// Funções do CRM. Todas exigem a senha do CRM (variável CRM_SENHA no Convex),
// usada tanto pelo painel (login) quanto pelos agentes (crm/scripts/crm.mjs).
import { query, mutation, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// Coleções aceitas: evita criar coleções novas por erro de digitação na linha de comando.
const COLECOES = new Set(["leads", "config"]);
// Tamanho máximo das listas acrescentadas com "append" (ex.: histórico).
const MAX_LISTA = 200;

function checkKey(key: string) {
  const secret = process.env.CRM_SENHA || "";
  // Comparação em tempo constante; sem senha configurada, ninguém entra.
  let diff = secret.length === key.length && secret.length > 0 ? 0 : 1;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ secret.charCodeAt(i % (secret.length || 1));
  if (diff !== 0) throw new ConvexError("nao_autorizado");
}
function checkColecao(collection: string) {
  if (!COLECOES.has(collection)) throw new ConvexError("colecao_invalida");
}

function deepMerge(base: any, patch: any): any {
  const out = { ...(base || {}) };
  for (const [k, val] of Object.entries(patch || {})) {
    if (val && typeof val === "object" && !Array.isArray(val) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) out[k] = deepMerge(out[k], val);
    else out[k] = val;
  }
  return out;
}
// Acrescenta itens no fim das listas (no servidor, para duas gravações seguidas não apagarem uma à outra).
function anexar(data: any, append: Record<string, any[]> | undefined) {
  for (const [k, itens] of Object.entries(append || {})) {
    if (!Array.isArray(itens) || !itens.length) continue;
    const atual = Array.isArray(data[k]) ? data[k] : [];
    data[k] = [...atual, ...itens].slice(-MAX_LISTA);
  }
  return data;
}

const findDoc = (ctx: QueryCtx, collection: string, docId: string) =>
  ctx.db.query("docs").withIndex("by_collection_doc", (q) => q.eq("collection", collection).eq("docId", docId)).unique();

const toOut = (d: { docId: string; json: string; updatedAt: string }) => ({ id: d.docId, data: JSON.parse(d.json), updatedAt: d.updatedAt });

export const check = query({
  args: { key: v.string() },
  handler: async (_ctx, { key }) => { checkKey(key); return true; },
});

export const list = query({
  args: { key: v.string(), collection: v.string() },
  handler: async (ctx, { key, collection }) => {
    checkKey(key);
    const rows = await ctx.db.query("docs").withIndex("by_collection_doc", (q) => q.eq("collection", collection)).collect();
    return rows.map(toOut);
  },
});

export const get = query({
  args: { key: v.string(), collection: v.string(), id: v.string() },
  handler: async (ctx, { key, collection, id }) => {
    checkKey(key);
    const d = await findDoc(ctx, collection, id);
    return d ? toOut(d) : null;
  },
});

export const set = mutation({
  args: { key: v.string(), collection: v.string(), id: v.string(), data: v.any() },
  handler: async (ctx, { key, collection, id, data }) => {
    checkKey(key);
    checkColecao(collection);
    const row = { collection, docId: id, json: JSON.stringify(data ?? {}), updatedAt: new Date().toISOString() };
    const cur = await findDoc(ctx, collection, id);
    if (cur) await ctx.db.replace(cur._id, row);
    else await ctx.db.insert("docs", row);
  },
});

// Cria um documento novo; falha se o id já existir (cadastro de lead não sobrescreve outro).
export const create = mutation({
  args: { key: v.string(), collection: v.string(), id: v.string(), data: v.any() },
  handler: async (ctx, { key, collection, id, data }) => {
    checkKey(key);
    checkColecao(collection);
    if (await findDoc(ctx, collection, id)) throw new ConvexError("documento_ja_existe");
    await ctx.db.insert("docs", { collection, docId: id, json: JSON.stringify(data ?? {}), updatedAt: new Date().toISOString() });
  },
});

// Mescla "patch" (objetos aninhados mesclam; listas substituem) e acrescenta "append" no fim das listas.
export const update = mutation({
  args: { key: v.string(), collection: v.string(), id: v.string(), patch: v.any(), append: v.optional(v.any()) },
  handler: async (ctx, { key, collection, id, patch, append }) => {
    checkKey(key);
    const cur = await findDoc(ctx, collection, id);
    if (!cur) throw new ConvexError("documento_nao_existe");
    const data = anexar(deepMerge(JSON.parse(cur.json), patch), append);
    await ctx.db.patch(cur._id, { json: JSON.stringify(data), updatedAt: new Date().toISOString() });
  },
});

export const remove = mutation({
  args: { key: v.string(), collection: v.string(), id: v.string() },
  handler: async (ctx, { key, collection, id }) => {
    checkKey(key);
    const cur = await findDoc(ctx, collection, id);
    if (cur) await ctx.db.delete(cur._id);
  },
});

export const importMany = mutation({
  args: { key: v.string(), rows: v.array(v.object({ collection: v.string(), id: v.string(), data: v.any() })) },
  handler: async (ctx, { key, rows }) => {
    checkKey(key);
    for (const r of rows) checkColecao(r.collection);
    const now = new Date().toISOString();
    for (const r of rows) {
      const row = { collection: r.collection, docId: r.id, json: JSON.stringify(r.data ?? {}), updatedAt: now };
      const cur = await findDoc(ctx, r.collection, r.id);
      if (cur) await ctx.db.replace(cur._id, row);
      else await ctx.db.insert("docs", row);
    }
    return rows.length;
  },
});

// Vários patches de uma vez (ações em massa do Banco de Leads): uma ida ao servidor em vez de uma por lead.
export const updateMany = mutation({
  args: { key: v.string(), collection: v.string(), rows: v.array(v.object({ id: v.string(), patch: v.any(), append: v.optional(v.any()) })) },
  handler: async (ctx, { key, collection, rows }) => {
    checkKey(key);
    const now = new Date().toISOString();
    let n = 0;
    for (const r of rows) {
      const cur = await findDoc(ctx, collection, r.id);
      if (!cur) continue;
      const data = anexar(deepMerge(JSON.parse(cur.json), r.patch), r.append);
      await ctx.db.patch(cur._id, { json: JSON.stringify(data), updatedAt: now });
      n++;
    }
    return n;
  },
});

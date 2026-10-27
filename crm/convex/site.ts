// Entrada de leads pelo site da RD Solutions (marca/site). Usa uma chave própria, SITE_CAPTURA_KEY
// (variável do Convex), para o site não precisar da senha do CRM: estas funções só criam ou
// atualizam leads e marcam a conversa de diagnóstico, sem ler nem apagar nada.
import { mutation, MutationCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

function checkSiteKey(key: string) {
  const secret = process.env.SITE_CAPTURA_KEY || "";
  let diff = secret.length === key.length && secret.length > 0 ? 0 : 1;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ secret.charCodeAt(i % (secret.length || 1));
  if (diff !== 0) throw new ConvexError("nao_autorizado");
}

const MAX_LISTA = 200;
const agora = () => new Date().toISOString();
// Dia em Brasília (AAAA-MM-DD), como o app grava em `datas`.
const hoje = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
const hist = (texto: string, tipo = "sistema") => ({ em: agora(), tipo, texto: texto + " (site)" });
const ETAPA_CURTO: Record<string, string> = {
  novo_lead: "Novo lead", primeiro_contato: "1º contato", cadencia: "Cadência", reuniao: "Conversa",
  diagnostico: "Diagnóstico", proposta: "Proposta", negociacao: "Negociação", contrato: "Contrato",
  ganho: "Ganho", encerrado: "Encerrado",
};

const findLead = (ctx: MutationCtx, docId: string) =>
  ctx.db.query("docs").withIndex("by_collection_doc", (q) => q.eq("collection", "leads").eq("docId", docId)).unique();

/** Lead sem Instagram: slug do nome + 4 caracteres (mesma regra do CRM). */
function slug(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 40) || "lead";
}
function handleInstagram(valor: string) {
  const m = (valor || "").trim().replace(/[?#].*$/, "").replace(/\/+$/, "").split("/").pop() || "";
  const h = m.replace(/^@/, "").toLowerCase();
  return /^[a-z0-9._]{2,30}$/.test(h) ? h : "";
}

async function salvar(ctx: MutationCtx, id: string, data: any, existe: { _id: any } | null) {
  if (Array.isArray(data.historico)) data.historico = data.historico.slice(-MAX_LISTA);
  const row = { json: JSON.stringify(data), updatedAt: agora() };
  if (existe) await ctx.db.patch(existe._id, row);
  else await ctx.db.insert("docs", { collection: "leads", docId: id, ...row });
}

/**
 * Formulário do Raio-X. Lead novo entra em "Novo lead"; se o @ do Instagram já existe no CRM
 * (lead da prospecção), só completa o contato que faltava e registra no histórico.
 * Devolve o id do lead (o site passa esse id para o Cal.com).
 */
export const capturarLead = mutation({
  args: {
    key: v.string(),
    lead: v.object({
      nome: v.string(),
      whatsapp: v.string(),
      email: v.string(),
      pousada: v.string(),
      cidade: v.string(),
      quartos: v.number(),
      instagram: v.optional(v.string()),
      viaOta: v.optional(v.string()),
      origemDetalhe: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { key, lead }) => {
    checkSiteKey(key);
    const ig = handleInstagram(lead.instagram || "");
    let id = ig;
    let cur = id ? await findLead(ctx, id) : null;
    if (!id) {
      // 4 caracteres aleatórios; tenta de novo no caso raro de colisão.
      for (let i = 0; i < 5; i++) {
        id = slug(lead.pousada) + Math.random().toString(36).slice(2, 6);
        if (!(await findLead(ctx, id))) break;
      }
    }
    const [cidade, uf] = lead.cidade.split(/\s*[\/\-,]\s*/);
    const resumo = `Pediu o Raio-X pelo site: ${lead.quartos} quartos` + (lead.viaOta ? `, ${lead.viaOta} pelas plataformas` : "");
    const proximaAcao = { texto: "Lead do site: confirmar o Raio-X no WhatsApp", ate: agora(), responsavel: "Pedro" };

    if (cur) {
      const d = JSON.parse(cur.json);
      // Completa só o que estava vazio: não sobrescreve o que a prospecção já levantou.
      const completar: Record<string, unknown> = {
        nome: lead.nome, whatsapp: lead.whatsapp, email: lead.email, cidade: cidade || lead.cidade, uf: (uf || "").toUpperCase(),
      };
      for (const [k, val] of Object.entries(completar)) if (!d[k] && val) d[k] = val;
      d.quartos = d.quartos || lead.quartos;
      if (lead.viaOta) d.viaOta = lead.viaOta;
      d.temperatura = "quente";
      d.proximaAcao = proximaAcao;
      d.atualizadoEm = agora();
      d.historico = [...(d.historico || []), hist(resumo + (lead.origemDetalhe ? ` (${lead.origemDetalhe})` : ""), "nota")];
      await salvar(ctx, id, d, cur);
      return { id, novo: false };
    }

    const data = {
      empresa: lead.pousada,
      nome: lead.nome,
      whatsapp: lead.whatsapp,
      email: lead.email,
      instagram: ig,
      cidade: cidade || lead.cidade,
      uf: (uf || "").toUpperCase(),
      localizacao: lead.cidade,
      nicho: "Hotelaria",
      segmento: "Hotelaria",
      quartos: lead.quartos,
      ...(lead.viaOta ? { viaOta: lead.viaOta } : {}),
      origem: "site",
      origemDetalhe: lead.origemDetalhe || "Formulário do Raio-X",
      temperatura: "quente",
      responsavel: "Pedro",
      etapa: "novo_lead",
      status: "novo",
      datas: { novo_lead: hoje() },
      proximaAcao,
      historico: [hist(resumo, "nota")],
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    await salvar(ctx, id, data, null);
    return { id, novo: true };
  },
});

/**
 * Agendamento no Cal.com (webhook BOOKING_CREATED / BOOKING_RESCHEDULED): move o lead para
 * "Conversa" com a data, com as mesmas regras do CRM (crm.mjs → patchEtapa). Sem o id
 * (agendou direto pelo link do Cal), procura pelo e-mail; sem lead, cria um.
 */
export const agendarReuniao = mutation({
  args: {
    key: v.string(),
    leadId: v.optional(v.string()),
    email: v.optional(v.string()),
    nome: v.optional(v.string()),
    data: v.string(),
    remarcacao: v.optional(v.boolean()),
  },
  handler: async (ctx, { key, leadId, email, nome, data, remarcacao }) => {
    checkSiteKey(key);
    const quando = new Date(data);
    if (isNaN(quando.getTime())) throw new ConvexError("data_invalida");
    const iso = quando.toISOString();
    const dataTxt = quando.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

    let id = leadId || "";
    let cur = id ? await findLead(ctx, id) : null;
    if (!cur && email) {
      const todos = await ctx.db.query("docs").withIndex("by_collection_doc", (q) => q.eq("collection", "leads")).collect();
      const alvo = email.trim().toLowerCase();
      cur = todos.find((r) => String(JSON.parse(r.json).email || "").trim().toLowerCase() === alvo) || null;
      if (cur) id = cur.docId;
    }
    if (!cur) {
      id = slug(nome || email || "lead") + Math.random().toString(36).slice(2, 6);
      const d = {
        empresa: nome || email || "Lead do site", nome: nome || "", email: email || "", nicho: "Hotelaria", segmento: "Hotelaria",
        origem: "site", origemDetalhe: "Agendou direto pelo Cal.com", temperatura: "quente", responsavel: "Pedro",
        etapa: "novo_lead", status: "novo", datas: { novo_lead: hoje() }, historico: [], criadoEm: agora(), atualizadoEm: agora(),
      };
      await salvar(ctx, id, d, null);
      cur = await findLead(ctx, id);
    }
    const d = JSON.parse(cur!.json);
    const itens: any[] = [];
    const de = ETAPA_CURTO[d.etapa] ? d.etapa : "novo_lead";
    if (de === "reuniao") {
      itens.push({ ...hist((remarcacao ? "Conversa remarcada para " : "Conversa de diagnóstico marcada para ") + dataTxt), tipo: "reuniao" });
    } else {
      itens.push({ ...hist(`Mudança de etapa: ${ETAPA_CURTO[de]} → ${ETAPA_CURTO.reuniao}`), tipo: "etapa" });
      if (d.cadencia && d.cadencia.estado === "ativa") {
        d.cadencia = { ...d.cadencia, estado: "respondeu", respondeuEm: agora(), respondeuNoPasso: Math.max(0, (d.cadencia.passo || 0) - 1) };
        d.proximoToque = "";
        itens.push(hist("Cadência interrompida: o lead respondeu"));
      }
      if (de === "encerrado") d.encerramento = null;
      itens.push({ ...hist("Conversa de diagnóstico marcada para " + dataTxt + " (Cal.com)"), tipo: "reuniao" });
      d.etapa = "reuniao";
      d.status = "respondeu";
      d.datas = { ...(d.datas || {}), reuniao: hoje() };
    }
    d.reuniao = { data: iso, status: "agendada", resultado: "" };
    d.proximaAcao = { texto: "Preparar o Raio-X antes da conversa", ate: iso, responsavel: "Pedro" };
    d.atualizadoEm = agora();
    d.historico = [...(d.historico || []), ...itens];
    await salvar(ctx, id, d, cur);
    return { id };
  },
});

/** Cancelamento no Cal.com: registra no histórico e cria a próxima ação (a etapa fica como está). */
export const cancelarReuniao = mutation({
  args: { key: v.string(), leadId: v.optional(v.string()), motivo: v.optional(v.string()) },
  handler: async (ctx, { key, leadId, motivo }) => {
    checkSiteKey(key);
    if (!leadId) return { id: null };
    const cur = await findLead(ctx, leadId);
    if (!cur) return { id: null };
    const d = JSON.parse(cur.json);
    // reuniao.status só aceita agendada/realizada/no_show no app: o cancelamento fica no histórico e na próxima ação.
    d.proximaAcao = { texto: "O lead cancelou o Raio-X no Cal.com: chamar no WhatsApp para remarcar", ate: agora(), responsavel: "Pedro" };
    d.atualizadoEm = agora();
    d.historico = [...(d.historico || []), { ...hist("Cancelou a conversa no Cal.com" + (motivo ? `: ${motivo}` : "")), tipo: "reuniao" }];
    await salvar(ctx, leadId, d, cur);
    return { id: leadId };
  },
});

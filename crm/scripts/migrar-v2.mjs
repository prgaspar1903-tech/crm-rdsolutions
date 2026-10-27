/**
 * Migração do CRM do Estúdio para a v2 (etapas do kanban, cadência v2, novos campos).
 * Padrão = SIMULAÇÃO: mostra o que mudaria e sai sem gravar nada.
 *
 *   node crm/scripts/migrar-v2.mjs            simulação (não grava)
 *   node crm/scripts/migrar-v2.mjs --aplicar  grava no Convex de produção
 *   node crm/scripts/migrar-v2.mjs --detalhes mostra o patch completo de cada lead
 *
 * Usa a mesma API HTTP do Convex que crm/scripts/crm.mjs (CRM_CONVEX_URL e CRM_SENHA de crm/.env.local).
 * Só ACRESCENTA campos (docs:update mescla); nenhum campo antigo é apagado. Rodar de novo é seguro:
 * leads já migrados e configurações já existentes são pulados.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { camposV2, CADENCIA_V2, NO_SHOW, ROTEIRO, OBJECOES, ETAPA, FASE, statusLegado } from "../app/padroes.js";

const here = dirname(fileURLToPath(import.meta.url));
const envFile = join(here, "..", ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*(#.*)?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const URL_ = (process.env.CRM_CONVEX_URL || "").replace(/\/$/, "");
const KEY = process.env.CRM_SENHA || "";
if (!URL_ || !KEY) { console.error("Faltam CRM_CONVEX_URL e CRM_SENHA em crm/.env.local (veja crm/README.md)."); process.exit(1); }

const APLICAR = process.argv.includes("--aplicar");
const DETALHES = process.argv.includes("--detalhes");

async function call(kind, path, args = {}) {
  const r = await fetch(`${URL_}/api/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args: { key: KEY, ...args }, format: "json" }),
  });
  const out = await r.json().catch(() => ({ status: "error", errorMessage: `HTTP ${r.status}` }));
  if (out.status !== "success") throw new Error(out.errorData || out.errorMessage || `HTTP ${r.status}`);
  return out.value;
}

const agora = new Date().toISOString();
const leads = (await call("query", "docs:list", { collection: "leads" })).sort((a, b) => a.id.localeCompare(b.id));
const config = Object.fromEntries((await call("query", "docs:list", { collection: "config" })).map((r) => [r.id, r.data]));

console.log(`\nMigração para o CRM v2 — ${APLICAR ? "APLICANDO (grava no banco de produção)" : "SIMULAÇÃO (nada será gravado)"}`);
console.log(`Banco: ${URL_}\n`);

/* ---------- Leads ---------- */
const planos = [];
for (const r of leads) {
  const d = r.data || {};
  const jaMigrado = Array.isArray(d.historico) && d.historico.some((h) => h && h.texto === "Migrado para o CRM v2");
  const patch = camposV2(d);
  if (jaMigrado && !Object.keys(patch).length) { planos.push({ id: r.id, d, patch: null }); continue; }
  const etapa = d.etapa || patch.etapa;
  const fase = d.faseCliente || patch.faseCliente;
  const datas = { ...(d.datas || {}), ...(patch.datas || {}) };
  if (!datas[etapa]) datas[etapa] = agora.slice(0, 10);
  patch.datas = datas;
  if (!jaMigrado) patch.historico = [...(Array.isArray(d.historico) ? d.historico : []), { em: agora, tipo: "sistema", texto: "Migrado para o CRM v2" }].slice(-120);
  patch.atualizadoEm = agora;
  planos.push({ id: r.id, d, patch, etapa, fase });
}

const pad = (s, n) => String(s ?? "").slice(0, n).padEnd(n);
console.log(`${pad("id", 26)} ${pad("empresa", 34)} ${pad("status → etapa", 30)} ${pad("temp.", 7)} ${pad("nome", 16)} grupo`);
console.log("-".repeat(140));
const porEtapa = {};
let aMigrar = 0;
for (const p of planos) {
  if (!p.patch) { console.log(`${pad(p.id, 26)} ${pad(p.d.empresa, 34)} já migrado — nada a fazer`); continue; }
  aMigrar++;
  const e = p.etapa;
  porEtapa[e] = (porEtapa[e] || 0) + 1;
  const etapaTxt = (p.d.status || "novo") + " → " + (ETAPA[e] ? ETAPA[e].curto : e) + (p.fase ? " (" + FASE[p.fase].label + ")" : "");
  const temp = p.patch.temperatura || p.d.temperatura || "—";
  const nome = p.patch.nome !== undefined ? (p.patch.nome || "(a confirmar)") : (p.d.nome || "—");
  console.log(`${pad(p.id, 26)} ${pad(p.d.empresa, 34)} ${pad(etapaTxt, 30)} ${pad(temp, 7)} ${pad(nome, 16)} ${p.patch.grupo || p.d.grupo || "—"}`);
  const extras = [];
  if (p.patch.cadencia) extras.push(`cadência ativa no passo ${p.patch.cadencia.passo + 1}, prevista ${p.patch.cadencia.previstoEm}`);
  if (p.patch.encerramento) extras.push(`encerramento: ${p.patch.encerramento.motivo}`);
  if (p.d.mensagemProxima) extras.push("mantém mensagemProxima");
  if (p.d.demo) extras.push("tem demo");
  if (extras.length) console.log(`${" ".repeat(27)}↳ ${extras.join(" · ")}`);
  if (DETALHES) console.log(JSON.stringify({ ...p.patch, historico: p.patch.historico ? "(+1 item: Migrado para o CRM v2)" : undefined }, null, 2));
}
console.log(`\nLeads: ${leads.length} no banco · ${aMigrar} a migrar · ${leads.length - aMigrar} já migrados`);
console.log("Por etapa: " + (Object.entries(porEtapa).map(([k, v]) => `${ETAPA[k] ? ETAPA[k].curto : k}: ${v}`).join(" · ") || "—"));
console.log("Campos novos preenchidos: etapa, segmento (= nicho), localizacao (cidade/UF), origem = prospeccao_ativa, responsavel = Pedro, temperatura (pela nota), grupo, nome, datas[etapa], histórico \"Migrado para o CRM v2\". Nenhum campo antigo é apagado.");

/* ---------- Configurações ---------- */
const acoesConfig = [];
const cad = config.cadencia;
if (cad && Number(cad.versao) === 2) acoesConfig.push(["cadencia", null, "já está na v2 — mantida"]);
else {
  if (cad && !config.cadencia_v1) acoesConfig.push(["cadencia_v1", cad, `cópia da cadência antiga (${(cad.passos || []).length} passos)`]);
  else if (cad) acoesConfig.push(["cadencia_v1", null, "cópia da antiga já existe — mantida"]);
  acoesConfig.push(["cadencia", CADENCIA_V2, `cadência v2 (${CADENCIA_V2.passos.length} templates: ${CADENCIA_V2.passos.map((p) => p.canal === "instagram" ? "IG" : "WA").join(" → ")})`]);
}
for (const [id, val, desc] of [["noShow", NO_SHOW, "template de no-show"], ["roteiro", ROTEIRO, `roteiro de ligação (${ROTEIRO.blocos.length} blocos)`], ["objecoes", OBJECOES, `matriz de objeções (${OBJECOES.itens.length} itens)`]]) {
  acoesConfig.push(config[id] ? [id, null, "já existe — mantido"] : [id, val, desc]);
}
console.log("\nConfigurações (coleção config):");
for (const [id, val, desc] of acoesConfig) console.log(`  ${val ? "grava " : "pula  "} config/${pad(id, 12)} ${desc}`);
console.log("  pula   config/metas        não é alterado");

if (!APLICAR) {
  console.log("\nSimulação: nada foi gravado. Para gravar, rode: node crm/scripts/migrar-v2.mjs --aplicar\n");
  process.exit(0);
}

/* ---------- Gravação ---------- */
let ok = 0;
for (const p of planos) {
  if (!p.patch) continue;
  const status = p.d.status || statusLegado(p.etapa, p.fase);
  await call("mutation", "docs:update", { collection: "leads", id: p.id, patch: { ...p.patch, status } });
  ok++;
}
for (const [id, val] of acoesConfig) if (val) await call("mutation", "docs:set", { collection: "config", id, data: val });
console.log(`\nPronto: ${ok} lead(s) migrados e ${acoesConfig.filter((a) => a[1]).length} configuração(ões) gravadas.\n`);

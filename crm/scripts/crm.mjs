/**
 * CLI do CRM do Estúdio — é por aqui que os agentes leem e gravam leads.
 * Sem dependências (Node 18+). Lê CRM_CONVEX_URL (deploy de produção) e CRM_SENHA de crm/.env.local e fala com o Convex pela API HTTP.
 *
 * Uso:
 *   node crm/scripts/crm.mjs list leads [campo=valor ...]     lista documentos (filtro por campo; aceita caminho, ex.: cadencia.estado=ativa)
 *   node crm/scripts/crm.mjs get leads <id>                   um documento
 *   node crm/scripts/crm.mjs set leads <id> '<json>'|@arq.json  cria/substitui
 *   node crm/scripts/crm.mjs update leads <id> '<json>'|@arq.json  mescla campos (objetos aninhados mesclam; listas substituem)
 *   node crm/scripts/crm.mjs note leads <id> "texto"          acrescenta um item no histórico (no servidor: não apaga notas gravadas ao mesmo tempo)
 *   node crm/scripts/crm.mjs delete leads <id>                apaga
 *   node crm/scripts/crm.mjs import arquivo.json [--substituir]  grava vários [{collection,id,data}] de uma vez
 *                                                             (leads que já existem são pulados, para não apagar a cadência
 *                                                              e o histórico; --substituir sobrescreve)
 *
 * Funil (mesmas regras do app: status antigo, datas, cadência e histórico ficam em sincronia):
 *   node crm/scripts/crm.mjs etapa <id> <etapa> [opções]      muda a etapa do kanban. Etapas: novo_lead, primeiro_contato,
 *        cadencia, reuniao, diagnostico, proposta, negociacao, contrato, ganho, encerrado. Opções:
 *        --data <ISO>       obrigatória em reuniao (data e hora da conversa)
 *        --motivo <id>      obrigatório em encerrado: perdido, sem_resposta, sem_interesse, desqualificado, contrato_nao_concluido
 *        --valor <n>        em ganho (se o lead ainda não tiver valor)
 *        --obs "texto"      vai para o histórico (e para o encerramento)
 *   node crm/scripts/crm.mjs fase <id> <fase> [--obs "..."]   fase do cliente ganho: em_construcao, aprovacao_cliente,
 *                                                             entregue, manutencao, cancelado
 *   node crm/scripts/crm.mjs cuidado <id> conversa|relatorio [--data AAAA-MM-DD] [--mes AAAA-MM] [--obs "..."]
 *                                                             registra a conversa mensal (sem pauta) ou o relatório do mês com um
 *                                                             cliente (campo cuidado.ultimaConversa / cuidado.ultimoRelatorio)
 *   node crm/scripts/crm.mjs hoje [--limite N] [--json]       o dia comercial: envios da cadência vencidos, ações e conversas
 *                                                             pendentes e os próximos leads da fila para iniciar a cadência.
 *                                                             Começa pelo Cuidado da base: com cliente atrasado (conversa > 30 dias,
 *                                                             relatório do mês após o dia 10, ação vencida), não sugere cadência
 *                                                             nova (--mesmo-assim mostra assim mesmo)
 *                                                             (template pelo segmento: Hotelaria usa config cadencia_hotelaria;
 *                                                              nos hotéis, mostra a faixa do decisor ao lado de cada envio)
 *   node crm/scripts/crm.mjs funil [segmento] [--json]        funil com contagens e % entre etapas: leads → decisor pesquisado →
 *                                                             decisor identificado (score ≥ 60) → contato válido (≥ 80) →
 *                                                             cadência iniciada → respondeu → reunião → proposta → ganho
 *                                                             (ex.: funil Hotelaria; sem segmento, todos os leads)
 *
 * Campos do decisor (hotelaria, gravados por ferramentas/verificar-decisor.mjs --crm):
 *   decisor {nome, cargo, prioridade, instagram, linkedin, email, telefone, canal, rota, contato, socios[], fonte},
 *   decisorScore (0–100), decisorFaixa ("prospectar" ≥ 80 | "enriquecer" 50–79 | "nao_priorizar" < 50), razaoSocial, cnpj.
 * E-mails (hotelaria): emailEmpresa (e-mail geral do estabelecimento) + emailEmpresaFonte (página onde aparece),
 *   emailsEncontrados [{email, tipo: generico|cargo|nominal|descartar, dominio, fonte}] (ferramentas/buscar-emails.mjs --crm);
 *   decisor.email = e-mail do decisor (só com prova, pela Dora + verificar-decisor.mjs --crm). `email` continua sendo o do contato.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ETAPA, FASE, MOTIVOS, PLAYBOOKS, playbookDe, passosDoPlaybook, statusLegado, FAIXA_DECISOR, faixaDecisor, funilDe } from "../app/padroes.js";

const here = dirname(fileURLToPath(import.meta.url));
// Credenciais: primeiro ~/.ponttosquad/crm.env (fora do iCloud, que tira do Mac o crm/.env.local e trava a leitura);
// depois crm/.env.local. Nenhum dos dois vai para o git.
const envFile = [join(process.env.HOME || "", ".ponttosquad/crm.env"), join(here, "..", ".env.local")].find((f) => existsSync(f));
if (envFile) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*(#.*)?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const URL_ = (process.env.CRM_CONVEX_URL || "").replace(/\/$/, "");
const KEY = process.env.CRM_SENHA || "";
if (!URL_ || !KEY) {
  console.error("Faltam CRM_CONVEX_URL e CRM_SENHA em crm/.env.local (veja crm/README.md).");
  process.exit(1);
}

async function call(kind, path, args = {}) {
  const r = await fetch(`${URL_}/api/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args: { key: KEY, ...args }, format: "json" }),
  });
  const out = await r.json().catch(() => ({ status: "error", errorMessage: `HTTP ${r.status}` }));
  if (out.status !== "success") {
    const erro = out.errorData ?? out.errorMessage ?? `HTTP ${r.status}`;
    throw new Error(MENSAGENS[erro] || (typeof erro === "string" ? erro : JSON.stringify(erro)));
  }
  return out.value;
}
const MENSAGENS = {
  nao_autorizado: "senha do CRM incorreta (confira CRM_SENHA em crm/.env.local).",
  documento_nao_existe: "documento não encontrado (use set para criar).",
  colecao_invalida: "coleção inválida: use leads ou config.",
  documento_ja_existe: "já existe um documento com esse id.",
};
const campo = (obj, caminho) => caminho.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
const getDoc = (c, id) => call("query", "docs:get", { collection: c, id });
const setDoc = (c, id, data) => call("mutation", "docs:set", { collection: c, id, data });
const readJson = (arg) => JSON.parse(arg.startsWith("@") ? readFileSync(arg.slice(1), "utf8") : arg);
// Opções no formato --nome valor (ou --flag sem valor).
function opcoes(args) {
  const o = {}, resto = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) { const k = args[i].slice(2); o[k] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true; }
    else resto.push(args[i]);
  }
  return [o, resto];
}
const agoraISO = () => new Date().toISOString();
const hojeISO = () => new Date().toLocaleDateString("sv-SE");
const diaLocal = (iso) => (!iso ? "" : String(iso).length <= 10 ? String(iso) : new Date(iso).toLocaleDateString("sv-SE"));
const hist = (texto, tipo = "sistema") => ({ em: agoraISO(), tipo, texto: texto + " (agente)" });
const nomeDe = (d, id) => d.empresa || d.nome || id;
const etapaDe = (d) => (ETAPA[d.etapa] ? d.etapa : "novo_lead");
const cadAtiva = (d) => d.cadencia && d.cadencia.estado === "ativa";
// Mantém os campos antigos (status, toque, proximoToque) iguais ao que o app grava.
function legado(d, patch) {
  const etapa = patch.etapa || etapaDe(d);
  patch.status = statusLegado(etapa, "faseCliente" in patch ? patch.faseCliente : d.faseCliente);
  if (patch.cadencia) {
    const c = { ...(d.cadencia || {}), ...patch.cadencia };
    patch.toque = Math.min(5, Number(c.passo) || 0);
    patch.proximoToque = c.estado === "ativa" && c.previstoEm ? diaLocal(c.previstoEm) : "";
  }
  return patch;
}

/* Muda a etapa com as mesmas regras do app (crm/app/app.js → mudarEtapa). */
function patchEtapa(d, nova, o) {
  const de = etapaDe(d);
  if (!ETAPA[nova]) throw new Error(`etapa desconhecida "${nova}". Use: ${Object.keys(ETAPA).join(", ")}`);
  if (de === nova) throw new Error(`o lead já está em ${ETAPA[nova].curto}.`);
  const patch = { etapa: nova }, extras = [];
  if (nova === "cadencia") {
    if (!d.instagram && !d.whatsapp) throw new Error("para iniciar a cadência, o lead precisa de Instagram ou WhatsApp.");
    if (!cadAtiva(d)) {
      const ciclo = ((d.cadencia && d.cadencia.ciclo) || 0) + 1;
      patch.cadencia = { estado: "ativa", passo: 0, iniciadaEm: agoraISO(), previstoEm: agoraISO(), envios: [], ciclo, respondeuEm: "", respondeuNoPasso: null };
      extras.push(hist("Cadência iniciada (ciclo " + ciclo + ")"));
    }
  } else if (cadAtiva(d) && nova !== "reuniao" && nova !== "encerrado") {
    patch.cadencia = { estado: "interrompida" };
    extras.push(hist("Cadência interrompida"));
  }
  if (nova === "reuniao") {
    if (!o.data || isNaN(new Date(o.data))) throw new Error("informe --data com a data e a hora da conversa (ISO, ex.: 2026-10-15T10:00:00-03:00).");
    const data = new Date(o.data).toISOString();
    patch.reuniao = { data, status: "agendada", resultado: "" };
    if (cadAtiva(d)) { patch.cadencia = { estado: "respondeu", respondeuEm: agoraISO(), respondeuNoPasso: Math.max(0, (d.cadencia.passo || 0) - 1) }; extras.push(hist("Cadência interrompida: o lead respondeu")); }
    extras.push({ ...hist("Conversa de diagnóstico marcada para " + new Date(data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })), tipo: "reuniao" });
  }
  if (nova === "encerrado") {
    if (!MOTIVOS.some((m) => m.id === o.motivo)) throw new Error(`informe --motivo: ${MOTIVOS.map((m) => m.id).join(", ")}`);
    patch.encerramento = { motivo: o.motivo, em: hojeISO(), obs: typeof o.obs === "string" ? o.obs : "" };
    if (cadAtiva(d)) patch.cadencia = { estado: "encerrada" };
    extras.push(hist("Encerrado: " + MOTIVOS.find((m) => m.id === o.motivo).label + (typeof o.obs === "string" ? " — " + o.obs : "")));
  }
  if (nova === "ganho") {
    const valor = Number(o.valor) || Number(d.valor);
    if (!(valor > 0)) throw new Error("informe --valor (valor fechado, em R$).");
    patch.valor = valor;
    patch.faseCliente = d.faseCliente && d.faseCliente !== "cancelado" && FASE[d.faseCliente] ? d.faseCliente : "em_construcao";
    extras.push(hist("Ganho: R$ " + valor.toLocaleString("pt-BR") + (d.entradaPaga ? " · entrada paga" : " · entrada pendente")));
  }
  if (de === "encerrado") patch.encerramento = null;
  patch.datas = { ...(d.datas || {}), [nova]: hojeISO() };
  if (typeof o.obs === "string" && nova !== "encerrado") extras.push(hist(o.obs, "nota"));
  return { patch: legado(d, patch), itens: [{ ...hist(`Mudança de etapa: ${ETAPA[de].curto} → ${ETAPA[nova].curto}`), tipo: "etapa" }, ...extras] };
}
/* Fase do cliente (aba Clientes), como no app (mudarFase). */
function patchFase(d, fase, o) {
  if (etapaDe(d) !== "ganho") throw new Error("a fase só vale para leads na etapa Ganho (use: etapa <id> ganho --valor N).");
  if (!FASE[fase]) throw new Error(`fase desconhecida "${fase}". Use: ${Object.keys(FASE).join(", ")}`);
  if (fase === d.faseCliente) throw new Error(`o cliente já está em ${FASE[fase].label}.`);
  const patch = { faseCliente: fase, datas: { ...(d.datas || {}), [fase]: hojeISO() } };
  if (fase === "manutencao" && !d.manutencao) { patch.manutencao = true; patch.manutencaoDesde = d.manutencaoDesde || hojeISO(); }
  if (fase === "cancelado" && d.manutencao) patch.manutencao = false;
  const itens = [{ ...hist("Fase do cliente: " + ((FASE[d.faseCliente] || {}).label || "—") + " → " + FASE[fase].label), tipo: "etapa" }];
  if (typeof o.obs === "string") itens.push(hist(o.obs, "nota"));
  return { patch: legado(d, patch), itens };
}
async function gravarFunil(id, fn, args) {
  const cur = await getDoc("leads", id);
  if (!cur) throw new Error("lead não encontrado: " + id);
  const { patch, itens } = fn(cur.data, ...args);
  await call("mutation", "docs:update", { collection: "leads", id, patch: { ...patch, atualizadoEm: agoraISO() }, append: { historico: itens } });
  return itens;
}

/* ---------- O dia comercial ---------- */
async function diaComercial(o) {
  const [leads, config] = await Promise.all([call("query", "docs:list", { collection: "leads" }), call("query", "docs:list", { collection: "config" })]);
  const cfg = Object.fromEntries(config.map((r) => [r.id, r.data]));
  // Templates pelo playbook do segmento: Hotelaria → cadencia_hotelaria (ou CADENCIA_HOTELARIA); demais → cadencia (ou CADENCIA_V2).
  const passoDe = (l) => passosDoPlaybook(cfg, playbookDe(l))[l.cadencia.passo] || {};
  const metas = cfg.metas || {};
  const limite = Number(o.limite) || Math.max(1, Math.ceil((Number(metas.abordagensSemana) || 50) / 5));
  const limiteFila = Number(metas.limiteFila) || 40;
  const fimHoje = new Date(); fimHoje.setHours(23, 59, 59, 999);
  const ate = (iso) => !!iso && new Date(String(iso).length <= 10 ? iso + "T12:00:00" : iso) <= fimHoje;
  const L = leads.map((r) => ({ id: r.id, ...r.data, etapa: etapaDe(r.data) }));
  const ativos = L.filter((l) => cadAtiva(l) && l.etapa !== "encerrado");
  const resumo = (l) => ({ id: l.id, empresa: nomeDe(l, l.id), instagram: l.instagram || "", whatsapp: l.whatsapp || "", nota: l.nota ?? null, demo: l.demo || "", playbook: playbookDe(l),
    ...(playbookDe(l) === "hotelaria" ? { decisorFaixa: faixaDecisor(l), decisorScore: l.decisorScore ?? null, decisor: (l.decisor || {}).nome || "" } : {}) });
  const envios = ativos.filter((l) => l.cadencia.passo < 5 && ate(l.cadencia.previstoEm)).map((l) => ({ ...resumo(l), passo: l.cadencia.passo, template: passoDe(l).nome || "", canal: passoDe(l).canal || "", previstoEm: l.cadencia.previstoEm, mensagemPronta: !!l.mensagemProxima, faltaGancho: !l.gancho, faltaProblema: !l.problema }));
  const encerrar = ativos.filter((l) => l.cadencia.passo >= 5 && l.cadencia.previstoEm && new Date(l.cadencia.previstoEm) <= new Date()).map(resumo);
  const acoes = L.filter((l) => l.proximaAcao && l.proximaAcao.texto && ate(l.proximaAcao.ate)).map((l) => ({ ...resumo(l), etapa: l.etapa, acao: l.proximaAcao.texto, ate: l.proximaAcao.ate }));
  const conversas = L.filter((l) => l.reuniao && l.reuniao.status === "agendada" && ate(l.reuniao.data)).map((l) => ({ ...resumo(l), data: l.reuniao.data, jaPassou: new Date(l.reuniao.data) < new Date() }));
  const fila = L.filter((l) => l.etapa === "novo_lead" && !cadAtiva(l) && !l.pausado && (l.instagram || l.whatsapp));
  const tempOrdem = { quente: 0, morno: 1, frio: 2 };
  // Menos volume, mais cuidado: na hotelaria, quem já tem o diagnóstico em PDF pronto vem primeiro.
  fila.sort((a, b) => (b.diagnostico?.pdf ? 1 : 0) - (a.diagnostico?.pdf ? 1 : 0) || (b.demo ? 1 : 0) - (a.demo ? 1 : 0) || (Number(b.nota) || 0) - (Number(a.nota) || 0) || (tempOrdem[a.temperatura] ?? 3) - (tempOrdem[b.temperatura] ?? 3) || String(a.criadoEm || "").localeCompare(String(b.criadoEm || "")));
  const proximos = fila.slice(0, limite).map((l) => ({ ...resumo(l), diagnosticoPronto: playbookDe(l) === "hotelaria" ? !!l.diagnostico?.pdf : null, mensagemPronta: !!l.mensagemProxima, faltaGancho: !l.gancho, faltaProblema: !l.problema }));
  // Cuidado da base (RD Solutions): crescer só sem atrapalhar quem já é cliente. Sem limite fixo de clientes: se alguém da base
  // está com a conversa mensal atrasada, o relatório do mês pendente ou ação vencida, a base vem antes de abrir conversa nova.
  const diasConversa = Number(metas.diasConversaCliente) || 30;
  const hojeD = new Date(), mesAnterior = new Date(hojeD.getFullYear(), hojeD.getMonth() - 1, 1).toISOString().slice(0, 7);
  const clientes = L.filter((l) => l.etapa === "ganho" && l.fase !== "cancelado");
  const base = clientes.map((l) => {
    const c = l.cuidado || {}, pend = [];
    const dias = c.ultimaConversa ? Math.floor((hojeD - new Date(String(c.ultimaConversa).slice(0, 10) + "T12:00:00")) / 864e5) : null;
    if (dias === null || dias > diasConversa) pend.push(dias === null ? "nenhuma conversa registrada" : `última conversa há ${dias} dias`);
    if (hojeD.getDate() > 10 && l.fase === "manutencao" && (c.ultimoRelatorio || "") < mesAnterior) pend.push(`relatório de ${mesAnterior} não enviado`);
    if (l.proximaAcao && l.proximaAcao.texto && ate(l.proximaAcao.ate)) pend.push(`ação vencida: ${l.proximaAcao.texto}`);
    return { ...resumo(l), fase: l.fase || "", diasDesdeConversa: dias, pendencias: pend };
  });
  const baseAtrasada = base.filter((c) => c.pendencias.length);
  const semana = new Date(); semana.setDate(semana.getDate() - 6);
  const abordadosSemana = L.filter((l) => ((l.cadencia && l.cadencia.envios) || []).some((e) => e.passo === 0 && new Date(e.em) >= semana)).length;
  return {
    data: hojeISO(),
    funil: { naFila: fila.length, emCadencia: ativos.length, limiteFila, filaCheia: fila.length > limiteFila, abordadosNaSemana: abordadosSemana, metaSemana: Number(metas.abordagensSemana) || null },
    base: { clientes: base.length, emDia: base.length - baseAtrasada.length, atrasados: baseAtrasada, diasConversa },
    envios, encerrar, acoes, conversas,
    // Base atrasada: nenhuma cadência nova hoje (a não ser com --mesmo-assim).
    proximos: baseAtrasada.length && !o["mesmo-assim"] ? [] : proximos, proximosSegurados: baseAtrasada.length && !o["mesmo-assim"] ? proximos.length : 0,
  };
}
// "decisor 🔥 prospectar (90) · Maria" ou "decisor não pesquisado"
function faixaTxt(l) {
  const f = FAIXA_DECISOR[l.decisorFaixa];
  return f ? `decisor ${f.emoji} ${f.label.toLowerCase()}${l.decisorScore !== null && l.decisorScore !== undefined ? " (" + l.decisorScore + ")" : ""}${l.decisor ? " · " + l.decisor : ""}` : "decisor não pesquisado";
}

/* ---------- Funil ---------- */
async function funil(segmento) {
  const rows = await call("query", "docs:list", { collection: "leads" });
  const alvo = String(segmento || "").trim().toLowerCase();
  const L = rows.map((r) => ({ id: r.id, ...r.data, etapa: etapaDe(r.data) })).filter((l) => !alvo || String(l.segmento || "").trim().toLowerCase() === alvo);
  return { segmento: segmento || "todos", etapas: funilDe(L) };
}
function imprimirFunil(f) {
  const larg = Math.max(...f.etapas.map((e) => e.nome.length));
  const pct = (x) => (x === null ? "" : (x * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "% da etapa anterior");
  console.log([`# Funil — ${f.segmento}`, "", ...f.etapas.map((e) => `${e.nome.padEnd(larg)}  ${String(e.n).padStart(5)}  ${pct(e.pctAnterior)}`)].join("\n"));
}
function imprimirDia(d) {
  const linha = (l, extra = "") => `- ${l.empresa}${l.instagram ? " (@" + String(l.instagram).replace(/^@/, "") + ")" : ""} [${l.id}]${l.playbook === "hotelaria" ? " · " + PLAYBOOKS.hotelaria.label + " · " + faixaTxt(l) : ""}${extra}`;
  const out = [`# Dia comercial — ${d.data}`, "",
    `Fila sem abordagem: ${d.funil.naFila} (limite ${d.funil.limiteFila})${d.funil.filaCheia ? " — FILA CHEIA: abordar antes de prospectar" : ""} · em cadência: ${d.funil.emCadencia} · 1º template enviado nos últimos 7 dias: ${d.funil.abordadosNaSemana}${d.funil.metaSemana ? " de " + d.funil.metaSemana : ""}`, ""];
  const bloco = (titulo, itens, fmt) => { out.push(`## ${titulo} (${itens.length})`); out.push(...(itens.length ? itens.map(fmt) : ["- nada"])); out.push(""); };
  if (d.base) {
    out.push(`## Cuidado da base — ${d.base.clientes ? `${d.base.emDia} de ${d.base.clientes} clientes em dia (conversa a cada ${d.base.diasConversa} dias, relatório até o dia 10)` : "nenhum cliente ainda"}`);
    out.push(...(d.base.atrasados.length ? d.base.atrasados.map((c) => `- ${c.empresa} [${c.id}] · ${c.pendencias.join(" · ")}`) : ["- base em dia"]));
    if (d.proximosSegurados) out.push("", `Crescer só sem atrapalhar a base: ${d.proximosSegurados} leads da fila ficam para depois de cuidar dos clientes acima (use --mesmo-assim para ver mesmo assim).`);
    out.push("");
  }
  bloco("Envios da cadência (vencidos ou de hoje)", d.envios, (l) => linha(l, ` · ${l.template} · ${l.canal}${l.mensagemPronta ? " · mensagem personalizada pronta" : ""}${l.faltaGancho || l.faltaProblema ? " · falta " + [l.faltaGancho && "gancho", l.faltaProblema && "problema"].filter(Boolean).join(" e ") : ""}`));
  bloco("Encerrar como Sem resposta (break-up vencido)", d.encerrar, (l) => linha(l));
  bloco("Próximas ações vencidas ou de hoje", d.acoes, (l) => linha(l, ` · ${l.acao} · até ${diaLocal(l.ate)}`));
  bloco("Conversas de hoje ou sem resultado", d.conversas, (l) => linha(l, ` · ${new Date(l.data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}${l.jaPassou ? " · registrar resultado" : ""}`));
  bloco("Próximos da fila para iniciar a cadência", d.proximos, (l) => linha(l, ` · nota ${l.nota ?? "—"}${l.demo ? " · com demo" : ""}${l.diagnosticoPronto === true ? " · diagnóstico pronto" : l.diagnosticoPronto === false ? " · sem diagnóstico (gerar antes)" : ""}${l.mensagemPronta ? " · mensagem pronta" : " · sem mensagem personalizada"}${l.faltaGancho || l.faltaProblema ? " · falta " + [l.faltaGancho && "gancho", l.faltaProblema && "problema"].filter(Boolean).join(" e ") : ""}`));
  console.log(out.join("\n"));
}

const [cmd, ...a] = process.argv.slice(2);
try {
  if (cmd === "list") {
    const [c, ...filters] = a;
    let rows = (await call("query", "docs:list", { collection: c })).sort((x, y) => x.id.localeCompare(y.id));
    for (const f of filters) {
      const i = f.indexOf("=");
      if (i < 1) throw new Error(`filtro inválido "${f}" (use campo=valor)`);
      const k = f.slice(0, i), v = f.slice(i + 1);
      rows = rows.filter((r) => String(campo(r.data, k) ?? "") === v);
    }
    console.log(JSON.stringify(rows, null, 2));
  } else if (cmd === "get") {
    const d = await getDoc(a[0], a[1]);
    if (!d) { console.error("Documento não encontrado."); process.exit(2); }
    console.log(JSON.stringify(d, null, 2));
  } else if (cmd === "set") {
    const now = new Date().toISOString();
    await setDoc(a[0], a[1], { ...readJson(a[2]), atualizadoEm: now });
    console.log("ok");
  } else if (cmd === "update") {
    await call("mutation", "docs:update", { collection: a[0], id: a[1], patch: { ...readJson(a[2]), atualizadoEm: new Date().toISOString() } });
    console.log("ok");
  } else if (cmd === "note") {
    const texto = a.slice(2).join(" ").trim();
    if (!texto) throw new Error("escreva o texto da nota.");
    const item = { em: new Date().toISOString(), tipo: "nota", texto };
    await call("mutation", "docs:update", { collection: a[0], id: a[1], patch: { atualizadoEm: item.em }, append: { historico: [item] } });
    console.log("ok");
  } else if (cmd === "delete") {
    await call("mutation", "docs:remove", { collection: a[0], id: a[1] });
    console.log("ok");
  } else if (cmd === "import") {
    const [o, [arq]] = opcoes(a);
    let rows = readJson("@" + arq);
    if (!o.substituir) {
      const existentes = new Set((await call("query", "docs:list", { collection: "leads" })).map((r) => r.id));
      const pulados = rows.filter((r) => r.collection === "leads" && existentes.has(r.id));
      if (pulados.length) console.log(`Pulados ${pulados.length} leads que já existem (use --substituir para sobrescrever): ${pulados.map((r) => r.id).join(", ")}`);
      rows = rows.filter((r) => !(r.collection === "leads" && existentes.has(r.id)));
    }
    for (let i = 0; i < rows.length; i += 100) await call("mutation", "docs:importMany", { rows: rows.slice(i, i + 100) });
    console.log(`ok — ${rows.length} documentos gravados`);
  } else if (cmd === "etapa") {
    const [o, [id, nova]] = opcoes(a);
    const itens = await gravarFunil(id, patchEtapa, [nova, o]);
    console.log("ok — " + itens.map((x) => x.texto).join(" · "));
  } else if (cmd === "fase") {
    const [o, [id, fase]] = opcoes(a);
    const itens = await gravarFunil(id, patchFase, [fase, o]);
    console.log("ok — " + itens.map((x) => x.texto).join(" · "));
  } else if (cmd === "funil") {
    const [o, resto] = opcoes(a);
    const f = await funil(resto.join(" "));
    if (o.json) console.log(JSON.stringify(f, null, 2)); else imprimirFunil(f);
  } else if (cmd === "cuidado") {
    // node crm/scripts/crm.mjs cuidado <id> conversa|relatorio [--data AAAA-MM-DD] [--mes AAAA-MM] [--obs "texto"]
    const [id, tipo, ...resto] = a;
    const [o] = opcoes(resto);
    if (!id || !["conversa", "relatorio"].includes(tipo)) throw new Error('uso: cuidado <id> conversa|relatorio [--data AAAA-MM-DD] [--mes AAAA-MM] [--obs "texto"]');
    const cur = await getDoc("leads", id); if (!cur) throw new Error("lead não encontrado: " + id);
    const c = { ...(cur.data.cuidado || {}) };
    if (tipo === "conversa") c.ultimaConversa = o.data || hojeISO(); else c.ultimoRelatorio = o.mes || new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7);
    const texto = tipo === "conversa" ? `Conversa com o cliente em ${c.ultimaConversa}${o.obs ? ": " + o.obs : ""}` : `Relatório de ${c.ultimoRelatorio} enviado${o.obs ? ": " + o.obs : ""}`;
    await call("mutation", "docs:update", { collection: "leads", id, patch: { cuidado: c, atualizadoEm: agoraISO() }, append: { historico: [{ em: agoraISO(), tipo: "nota", texto }] } });
    console.log("ok — " + texto);
  } else if (cmd === "hoje") {
    const [o] = opcoes(a);
    const d = await diaComercial(o);
    if (o.json) console.log(JSON.stringify(d, null, 2)); else imprimirDia(d);
  } else {
    console.log("Comandos: list | get | set | update | note | delete | import | etapa | fase | cuidado | hoje | funil  (detalhes no topo deste arquivo)");
  }
} catch (e) {
  console.error("Erro:", e.message);
  process.exit(1);
}

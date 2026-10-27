// CRM da RD Solutions (v2) — app (JS puro, módulo ES). Banco: Convex (mesma API do painel antigo, com senha).
import {
  ETAPAS, ETAPA, ORDEM_ETAPAS, FASES, FASE, ORIGENS, MOTIVOS, RESULTADOS_LIGACAO, TEMPERATURAS, CITAR, PACOTES, MENSALIDADE,
  CHECKLISTS, ETAPA_DE_STATUS, camposV2, statusLegado, somarDiasUteis, ehDiaUtil,
  PLAYBOOKS, playbookDe, chaveConfig, passosDoPlaybook, contaRaioX, TAXAS_PADRAO, PLANOS_HOTELARIA, MIGRACAO_DIRETO,
  FAIXAS_DECISOR, FAIXA_DECISOR, faixaDecisor, faixaPorScore, CANAIS_DECISOR, PRIORIDADES_DECISOR, ENCAMINHAMENTO_HOTELARIA,
} from "./padroes.js";

/* ================= Ícones (SVG inline) ================= */
const S = (d, extra = "") => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const I = {
  painel: S('<rect x="3" y="3" width="6" height="7" rx="1.5"/><rect x="11" y="3" width="6" height="4" rx="1.5"/><rect x="11" y="9" width="6" height="8" rx="1.5"/><rect x="3" y="12" width="6" height="5" rx="1.5"/>'),
  kanban: S('<rect x="3" y="3" width="4" height="14" rx="1.2"/><rect x="8.5" y="3" width="4" height="9" rx="1.2"/><rect x="14" y="3" width="3" height="11" rx="1.2"/>'),
  cadencia: S('<path d="M3 10h3l2-5 4 10 2-5h3"/>'),
  banco: S('<rect x="3" y="4" width="14" height="12" rx="2"/><path d="M3 8h14M8 8v8"/>'),
  agenda: S('<rect x="3" y="4.5" width="14" height="12.5" rx="2"/><path d="M3 8.5h14M7 3v3M13 3v3"/>'),
  relatorios: S('<path d="M4 16V9M8.5 16V5M13 16v-5M17 16H3"/>'),
  clientes: S('<circle cx="8" cy="7" r="3"/><path d="M2.5 16c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4"/><path d="M13 4.2a3 3 0 010 5.6M15 12.3c1.3.6 2.1 1.9 2.5 3.7"/>'),
  templates: S('<path d="M4 4h12v9H8l-4 3V4z"/><path d="M7 7.5h6M7 10h4"/>'),
  roteiro: S('<path d="M5 3h7l3 3v11H5V3z"/><path d="M12 3v3h3M8 9h4M8 12h4"/>'),
  objecoes: S('<path d="M10 3l7 3v4c0 4-3 6.5-7 7.5C6 16.5 3 14 3 10V6l7-3z"/><path d="M7.5 10l2 2 3.5-3.5"/>'),
  busca: S('<circle cx="9" cy="9" r="5.5"/><path d="M13.5 13.5L17 17"/>'),
  mais: S('<circle cx="5" cy="10" r=".9" fill="currentColor"/><circle cx="10" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>'),
  plus: S('<path d="M10 4v12M4 10h12"/>'),
  voltar: S('<path d="M12 5l-5 5 5 5"/>'),
  seta: S('<path d="M8 5l5 5-5 5"/>'),
  chevron: S('<path d="M5 8l5 5 5-5"/>'),
  relogio: S('<circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 2"/>'),
  alerta: S('<path d="M10 3l8 14H2L10 3z"/><path d="M10 8v4M10 14.5v.1"/>'),
  info: S('<circle cx="10" cy="10" r="7"/><path d="M10 9v5M10 6.5v.1"/>'),
  fogo: S('<path d="M10 17c3 0 5-2 5-5 0-3-2-4.5-3-7-1 2-2 2.5-3 2.5 0-1.5-.5-3-1-4C6 6 5 8.5 5 12c0 3 2 5 5 5z"/>'),
  telefone: S('<path d="M5 3h3l1.5 4-2 1.3a9 9 0 004.2 4.2L13 10.5l4 1.5v3a2 2 0 01-2 2A13 13 0 013 5a2 2 0 012-2z"/>'),
  chat: S('<path d="M4 15.5l1-3A6.5 6.5 0 1110 16.5a6.6 6.6 0 01-3-.7L4 15.5z"/>'),
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.6 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
  instagram: S('<rect x="3" y="3" width="14" height="14" rx="4"/><circle cx="10" cy="10" r="3.2"/><circle cx="14.2" cy="5.8" r=".8" fill="currentColor"/>'),
  calendario: S('<rect x="3" y="4.5" width="14" height="12.5" rx="2"/><path d="M3 8.5h14M7 3v3M13 3v3"/>'),
  nota: S('<path d="M5 3h10v14H5z"/><path d="M8 7h4M8 10h4M8 13h2"/>'),
  engrenagem: S('<circle cx="10" cy="10" r="2.5"/><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4"/>'),
  etapa: S('<path d="M4 10h11M11 6l4 4-4 4"/>'),
  check: S('<path d="M4.5 10.5l3.5 3.5 7.5-8"/>'),
  x: S('<path d="M5 5l10 10M15 5L5 15"/>'),
  link: S('<path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1"/><path d="M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1"/>'),
  externo: S('<path d="M11 4h5v5M16 4l-7 7M14 12v4H4V6h4"/>'),
  enviar: S('<path d="M3 10l14-6-5 14-2.5-5.5L3 10z"/>'),
  download: S('<path d="M10 3v10M6 9l4 4 4-4M4 16h12"/>'),
  grip: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="3.5" r="1.3"/><circle cx="10.5" cy="3.5" r="1.3"/><circle cx="5.5" cy="8" r="1.3"/><circle cx="10.5" cy="8" r="1.3"/><circle cx="5.5" cy="12.5" r="1.3"/><circle cx="10.5" cy="12.5" r="1.3"/></svg>',
  trofeu: S('<path d="M6 3h8v4a4 4 0 01-8 0V3zM6 5H3.5a2.5 2.5 0 002.7 3M14 5h2.5a2.5 2.5 0 01-2.7 3M10 11v3M7 17h6M8 14h4"/>'),
  dinheiro: S('<rect x="2.5" y="5" width="15" height="10" rx="2"/><circle cx="10" cy="10" r="2.2"/><path d="M5.5 8v4M14.5 8v4"/>'),
  pausa: S('<circle cx="10" cy="10" r="7"/><path d="M8 7.5v5M12 7.5v5"/>'),
  copiar: S('<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M13 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2"/>'),
};

/* ================= Estado ================= */
const st = {
  client: null, key: "", ready: false,
  base: new Map(),         // id → documento como está no banco (última leitura)
  raw: new Map(),          // id → documento na tela (banco + gravações ainda não confirmadas)
  pendentes: new Map(),    // id → gravações enviadas e ainda não confirmadas pelo banco
  versao: 0,               // muda a cada alteração nos leads (memoriza listas calculadas)
  config: {},              // id → dados (cadencia, noShow, roteiro, objecoes, metas)
  loaded: { leads: false, config: false },
  rota: { nome: "kanban", id: null },
  editando: false,         // edição inline aberta (não redesenhar)
  filtros: lerFiltros(),
  selecionados: new Set(),
  selKanban: false,        // modo "Selecionar vários" do Kanban
  recolhidos: new Set(lerLocal("crm-recolhidos", [])),
  rascunhos: {},           // textos editados antes de enviar, por lead
};
function lerLocal(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } }
function gravarLocal(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } }
// Filtros de cada tela, lembrados neste navegador (a busca por texto não é guardada).
function lerFiltros() {
  const padrao = { kanban: { q: "", etapa: "", resp: "", temp: "" }, banco: { q: "", etapa: "", temp: "", seg: "", resp: "", dec: "", agrupar: "grupo" }, agenda: { etapa: "", resp: "" }, rel: { periodo: "90" }, obj: { cat: "", q: "" }, clientes: { modo: "quadro" }, playbook: { pb: "sites" } };
  const salvos = lerLocal("crm-filtros", {});
  for (const [tela, f] of Object.entries(padrao)) if (salvos && typeof salvos[tela] === "object") for (const k of Object.keys(f)) if (k !== "q" && typeof salvos[tela][k] === "string") f[k] = salvos[tela][k];
  return padrao;
}
let timerFiltros = 0;
function gravarFiltros() { clearTimeout(timerFiltros); timerFiltros = setTimeout(() => gravarLocal("crm-filtros", st.filtros), 300); }

/* ================= Utilidades ================= */
const $ = (sel, root = document) => root.querySelector(sel);
function h(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k === "dataset") Object.assign(n.dataset, v);
    else if (k === "style" && typeof v === "object") Object.assign(n.style, v);
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
    else if (k === "value") n.value = v;
    else if (k === "checked") n.checked = !!v;
    else n.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat(Infinity)) if (kid !== null && kid !== undefined && kid !== false) n.append(kid instanceof Node ? kid : String(kid));
  return n;
}
const ico = (nome, cls = "") => { const s = h("span", { class: "ico " + cls, html: I[nome] || "" }); return s.firstChild; };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const agoraISO = () => new Date().toISOString();
const hojeISO = () => new Date().toLocaleDateString("sv-SE");
const diaLocal = (iso) => (iso ? new Date(iso.length <= 10 ? iso + "T12:00:00" : iso).toLocaleDateString("sv-SE") : "");
const somarDias = (dia, n) => { const d = new Date(dia + "T12:00:00"); d.setDate(d.getDate() + n); return d.toLocaleDateString("sv-SE"); };
const diasEntre = (a, b) => Math.round((new Date(diaLocal(b) + "T12:00:00") - new Date(diaLocal(a) + "T12:00:00")) / 86400000);
const MESES_C = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const DIAS_S = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
function fmtDia(iso, ano = false) {
  if (!iso) return "";
  const d = new Date(String(iso).length <= 10 ? iso + "T12:00:00" : iso);
  if (isNaN(d)) return "";
  return d.getDate() + " " + MESES_C[d.getMonth()] + (ano || d.getFullYear() !== new Date().getFullYear() ? " " + d.getFullYear() : "");
}
function fmtHora(iso) { const d = new Date(iso); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
// Datas só com o dia ("AAAA-MM-DD", gravadas pelos agentes) viram meio-dia local, para não cair no dia anterior em UTC.
const soDia = (iso) => String(iso || "").length <= 10;
const paraData = (iso) => new Date(soDia(iso) ? iso + "T12:00:00" : iso);
function fmtDiaHora(iso) {
  if (!iso) return "";
  const d = paraData(iso); if (isNaN(d)) return "";
  const dia = diaLocal(iso), hoje = hojeISO();
  const rot = dia === hoje ? "hoje" : dia === somarDias(hoje, 1) ? "amanhã" : dia === somarDias(hoje, -1) ? "ontem" : DIAS_S[d.getDay()] + ", " + fmtDia(iso);
  return soDia(iso) ? rot : rot + " · " + fmtHora(iso);
}
const passou = (iso) => !!iso && paraData(iso) < new Date();
// "late" (antes de hoje), "today" ou "future" — a regra de cor das datas (vermelho/âmbar).
function situacao(iso) { if (!iso) return null; const d = diaLocal(iso), t = hojeISO(); return d < t ? "late" : d === t ? "today" : "future"; }
const brl = (v) => "R$ " + Math.round(Number(v || 0)).toLocaleString("pt-BR");
const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "—");
const handle = (s) => String(s || "").trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/[/?#].*$/, "");
const igUrl = (s) => "https://instagram.com/" + handle(s);
// Só deixa links http(s) virarem href (os dados vêm também dos agentes): "javascript:" e afins viram "#".
const urlSegura = (u) => { const s = String(u || "").trim(); if (!s) return ""; const c = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : "https://" + s; return /^https?:\/\//i.test(c) ? c : ""; };
const semProtocolo = (u) => String(u || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const soDigitos = (s) => String(s || "").replace(/\D/g, "");
function waNumero(s) { let d = soDigitos(s).replace(/^0+/, ""); if (!d) return ""; if (d.length <= 11) d = "55" + d; return d; }
const bandeiraTel = (s) => (soDigitos(s).startsWith("351") ? "🇵🇹" : "🇧🇷");
function fmtTel(s) {
  let d = soDigitos(s); if (d.startsWith("55") && d.length >= 12) d = d.slice(2);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return s || "";
}
const paraInputDataHora = (iso) => { if (!iso) return ""; const d = paraData(iso); if (isNaN(d)) return ""; const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
const deInputDataHora = (v) => (v ? new Date(v).toISOString() : "");
const slugify = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
const corDe = (s) => { const cores = ["violet", "teal", "amber", "sky", "pink", "lime", "orange", "blue", "purple", "green"]; let x = 0; for (const c of String(s || "")) x = (x * 31 + c.charCodeAt(0)) >>> 0; return cores[x % cores.length]; };
const empresaCurta = (e) => String(e || "").split(/\s+[—–-]\s+/)[0].replace(/\s*\(.*\)\s*$/, "").trim();
function primeiroNome(nome) {
  const p = String(nome || "").trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "";
  return /^(dra?\.?|sr\.?|sra\.?)$/i.test(p[0]) && p[1] ? p[0] + " " + p[1] : p[0];
}
const histItem = (texto, tipo = "nota", extra = {}) => ({ em: agoraISO(), tipo, texto, ...extra });
// Itens a acrescentar no fim de uma lista do lead (histórico, ligações). Quem acrescenta é o servidor,
// então duas gravações seguidas (ou um agente gravando ao mesmo tempo) não apagam o item uma da outra.
class Anexo { constructor(itens) { this.itens = itens; } }
const anexo = (...itens) => new Anexo(itens);
const comHist = (_l, ...itens) => anexo(...itens);
const MAX_LISTA = 200;
const rotulo = (lista, id) => (lista.find((x) => x.id === id) || {}).label || id || "";
const canalLabel = (c) => (c === "instagram" ? "Instagram" : c === "whatsapp" ? "WhatsApp" : c || "");

/* ================= Leads (normalizados) ================= */
const cacheNorm = new WeakMap();
function norm(id, raw) {
  if (cacheNorm.has(raw)) return cacheNorm.get(raw);
  const l = { ...raw, ...camposV2(raw), id };
  // etapa ou fase desconhecida (gravada à mão ou por um agente) não pode sumir do kanban nem quebrar a tela
  if (!ETAPA[l.etapa]) l.etapa = ETAPA_DE_STATUS[l.status] || "novo_lead";
  if (l.etapa === "ganho" && !FASE[l.faseCliente]) l.faseCliente = "em_construcao";
  if (!l.historico) l.historico = [];
  if (!l.datas) l.datas = {};
  if (!l.checklist) l.checklist = {};
  if (!Array.isArray(l.ligacoes)) l.ligacoes = [];
  cacheNorm.set(raw, l);
  return l;
}
let cacheLeads = { v: -1, lista: [] };
const leads = () => {
  if (cacheLeads.v !== st.versao) cacheLeads = { v: st.versao, lista: [...st.raw.entries()].map(([id, r]) => norm(id, r)) };
  return cacheLeads.lista;
};
const lead = (id) => (st.raw.has(id) ? norm(id, st.raw.get(id)) : null);
const nomeLead = (l) => l.empresa || l.nome || l.instagram || "Sem nome";
const contato = (l) => l.nome || "";
/* Playbook por segmento: Hotelaria usa o Método Reserva Direta (config "<chave>_hotelaria"); os demais, sites.
   As funções aceitam o lead ou o nome do playbook ("sites" | "hotelaria"); sem argumento, valem as de sites. */
const pbDe = (x) => (x === "sites" || x === "hotelaria" ? x : playbookDe(x));
const cfgDe = (chave, x) => { const pb = pbDe(x); return st.config[chaveConfig(chave, pb)] || PLAYBOOKS[pb][chave]; };
const passos = (x) => passosDoPlaybook(st.config, pbDe(x));
const cadenciaV1 = () => { const c = st.config.cadencia; return !(c && Number(c.versao) === 2); };
const noShowCfg = (x) => cfgDe("noShow", x);
const roteiroCfg = (x) => cfgDe("roteiro", x);
const objecoesCfg = (x) => cfgDe("objecoes", x);
const ehHotelaria = (l) => playbookDe(l) === "hotelaria";
const valorDe = (l) => Number(l.valor) || Number(l.valorEstimado) || (PACOTES[l.pacote] ? PACOTES[l.pacote].preco : 0);
const respList = () => [...new Set(["Pedro", ...leads().map((l) => l.responsavel).filter(Boolean)])];
const cadAtiva = (l) => l.cadencia && l.cadencia.estado === "ativa";
// Quanto falta receber de um cliente: cada metade (entrada e final) ainda não paga. Cancelado não conta.
const pendenteDe = (l) => { const v = Number(l.valor) || 0; if (!v || l.etapa !== "ganho" || l.faseCliente === "cancelado") return 0; return (l.entradaPaga ? 0 : v / 2) + (l.finalPago ? 0 : v / 2); };
const ordemNum = (passo) => (passo < 4 ? passo + 1 + "º template" : "Break-up");

// Ações pendentes de um lead: próxima ação, envio de cadência previsto, conversa agendada.
// Memorizadas por lead (o objeto muda quando o lead muda) e zeradas quando a cadência salva muda.
let cacheAcoes = new WeakMap();
function acoesDe(l) {
  if (cacheAcoes.has(l)) return cacheAcoes.get(l);
  const out = calcularAcoes(l);
  cacheAcoes.set(l, out);
  return out;
}
function calcularAcoes(l) {
  const out = [];
  if (l.proximaAcao && l.proximaAcao.ate && l.proximaAcao.texto) out.push({ tipo: "acao", texto: l.proximaAcao.texto, em: l.proximaAcao.ate, resp: l.proximaAcao.responsavel || l.responsavel, l });
  if (cadAtiva(l) && l.etapa !== "encerrado") {
    const p = l.cadencia.passo;
    const ps = passos(l);
    if (p < 5) out.push({ tipo: "envio", texto: "Enviar " + (ps[p] ? ps[p].nome : ordemNum(p)), em: l.cadencia.previstoEm || agoraISO(), canal: (ps[p] || {}).canal, resp: l.responsavel, l });
    else out.push({ tipo: "encerrar", texto: "Encerrar cadência como Sem resposta", em: l.cadencia.previstoEm || agoraISO(), resp: l.responsavel, l });
  }
  if (l.reuniao && l.reuniao.data && l.reuniao.status === "agendada") out.push({ tipo: "conversa", texto: "Conversa de diagnóstico", em: l.reuniao.data, resp: l.responsavel, l });
  return out.sort((a, b) => String(a.em).localeCompare(String(b.em)));
}
const todasAcoes = () => leads().flatMap(acoesDe);

/* ================= Banco (Convex) ================= */
function deepMerge(base, patch) {
  const out = { ...(base || {}) };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}
const ehErroSenha = (e) => /nao_autorizado/.test(String((e && (e.data || e.message)) || ""));
async function mutacao(nome, args) {
  if (!st.client) throw new Error("sem_banco");
  try { return await st.client.mutation(nome, { key: st.key, ...args }); }
  catch (e) { if (ehErroSenha(e)) sair(); throw e; }
}
// Mantém o status antigo (v1) em sincronia para os agentes e o painel antigo.
function comLegado(l, patch) {
  const p = { ...patch };
  if ("etapa" in p || "faseCliente" in p) p.status = statusLegado(p.etapa || l.etapa, "faseCliente" in p ? p.faseCliente : l.faseCliente);
  if (p.cadencia && typeof p.cadencia === "object") {
    const c = { ...(l.cadencia || {}), ...p.cadencia };
    p.toque = Math.min(5, Number(c.passo) || 0);
    p.proximoToque = c.estado === "ativa" && c.previstoEm ? diaLocal(c.previstoEm) : "";
    if (c.passo > 0 && !l.abordadoEm && c.envios && c.envios[0]) p.abordadoEm = diaLocal(c.envios[0].em);
  }
  return p;
}
/* ---------- Gravações otimistas ----------
   A tela mostra o banco + as gravações ainda não confirmadas. Quando chega uma leitura nova do banco
   no meio de uma gravação, ela é reaplicada por cima (a tela não "volta" por um instante). */
function separarAnexos(patch) {
  const simples = {}, append = {};
  for (const [k, v] of Object.entries(patch)) { if (v instanceof Anexo) append[k] = v.itens; else simples[k] = v; }
  return { patch: simples, append };
}
const mesmoItem = (a, b) => a && b && a.em === b.em && a.texto === b.texto;
function aplicar(doc, { patch, append, doc: substituto }) {
  if (substituto) return substituto;
  const out = deepMerge(doc, patch);
  for (const [k, itens] of Object.entries(append || {})) {
    const atual = Array.isArray(out[k]) ? out[k] : [];
    const novos = itens.filter((x) => !atual.some((y) => mesmoItem(x, y))); // reaplicar não duplica
    out[k] = [...atual, ...novos].slice(-MAX_LISTA);
  }
  return out;
}
function mexeu() { st.versao++; }
function comPendentes(id, doc) {
  const ps = st.pendentes.get(id);
  return ps && doc ? ps.reduce(aplicar, doc) : doc;
}
function pendente(id, p) { if (!st.pendentes.has(id)) st.pendentes.set(id, []); st.pendentes.get(id).push(p); }
function confirmado(id, p) {
  const ps = st.pendentes.get(id); if (!ps) return;
  const i = ps.indexOf(p); if (i >= 0) ps.splice(i, 1);
  if (!ps.length) st.pendentes.delete(id);
}
function falhou(id, p) {
  confirmado(id, p);
  const base = st.base.get(id);
  if (base) st.raw.set(id, comPendentes(id, base)); else st.raw.delete(id);
  mexeu(); render();
}
/* Grava um patch (mesclado no servidor) com atualização otimista. Com desfazer, guarda o documento anterior. */
async function salvar(id, patchIn, { msg, desfazer, silencioso } = {}) {
  const atual = st.raw.get(id);
  if (!atual) return false;
  const l = lead(id);
  const p = separarAnexos({ ...comLegado(l, patchIn), atualizadoEm: agoraISO() });
  const antes = JSON.parse(JSON.stringify(atual));
  pendente(id, p);
  st.raw.set(id, aplicar(atual, p)); mexeu();
  render();
  try {
    await mutacao("docs:update", { collection: "leads", id, patch: p.patch, append: p.append });
    confirmado(id, p);
    if (msg && !silencioso) toast(msg, desfazer ? { acao: "Desfazer", onClick: () => restaurar(id, antes) } : {});
    return true;
  } catch (e) {
    falhou(id, p);
    if (!silencioso) toast("Não foi possível salvar. Confira a conexão e tente de novo.", { ruim: true });
    return false;
  }
}
/* O mesmo patch (ou um por lead) em vários leads, numa ida só ao servidor (ações em massa). */
async function salvarVarios(ids, patchDe) {
  const itens = ids.filter((id) => st.raw.has(id)).map((id) => {
    const p = separarAnexos({ ...comLegado(lead(id), patchDe(lead(id))), atualizadoEm: agoraISO() });
    pendente(id, p); st.raw.set(id, aplicar(st.raw.get(id), p));
    return { id, p };
  });
  mexeu(); render();
  try {
    await mutacao("docs:updateMany", { collection: "leads", rows: itens.map(({ id, p }) => ({ id, patch: p.patch, append: p.append })) });
    for (const { id, p } of itens) confirmado(id, p);
    return itens.length;
  } catch (e) {
    for (const { id, p } of itens) falhou(id, p);
    toast("Não foi possível salvar. Confira a conexão e tente de novo.", { ruim: true });
    return 0;
  }
}
async function restaurar(id, doc) {
  const p = { doc: { ...doc, atualizadoEm: agoraISO() } };
  pendente(id, p); st.raw.set(id, p.doc); mexeu(); render();
  try { await mutacao("docs:set", { collection: "leads", id, data: p.doc }); confirmado(id, p); toast("Desfeito"); }
  catch (e) { falhou(id, p); toast("Não foi possível desfazer.", { ruim: true }); }
}
async function salvarConfig(id, data, msg = "Salvo") {
  const antes = st.config[id];
  st.config[id] = data; cacheAcoes = new WeakMap(); render();
  try { await mutacao("docs:set", { collection: "config", id, data }); toast(msg); return true; }
  catch (e) { st.config[id] = antes; cacheAcoes = new WeakMap(); render(); toast("Não foi possível salvar.", { ruim: true }); return false; }
}

/* ================= Templates ================= */
function preencher(texto, l, { passo = -1 } = {}) {
  const nome = primeiroNome(contato(l));
  const emp = empresaCurta(l.empresa) || l.nome || "";
  let t = String(texto || "");
  if (!nome) {
    if (passo === 0) t = t.replace(/\{nome\}/g, "pessoal da " + (emp || "[empresa]"));
    else t = t.replace(/,\s*\{nome\}!/g, ", tudo bem?").replace(/tudo bem\?\s+Tudo bem\?/g, "tudo bem?").replace(/\s*\{nome\}/g, "");
  }
  const vals = {
    nome, empresa: emp, seunome: "Pedro", gancho: l.gancho, problema: l.problema, demo: l.demo,
    nicho: String(l.segmento || l.nicho || "").toLowerCase(), cidade: l.cidade || String(l.localizacao || "").split("/")[0], instagram: l.instagram ? "@" + handle(l.instagram) : "",
  };
  return t.replace(/\{(\w+)\}/g, (m, k) => (k in vals ? (vals[k] ? String(vals[k]) : "[" + k + "]") : m));
}
function textoDoPasso(l, i) {
  const p = passos(l)[i]; if (!p) return "";
  const base = p.textoSemDemo && !l.demo ? p.textoSemDemo : p.texto;
  return preencher(base, l, { passo: i });
}
// Mensagem do passo atual: rascunho > mensagemProxima (agentes) > template.
function mensagemAtual(l) {
  const i = l.cadencia ? l.cadencia.passo : 0;
  if (st.rascunhos[l.id] !== undefined) return { texto: st.rascunhos[l.id], origem: "rascunho" };
  if (l.mensagemProxima) return { texto: l.mensagemProxima, origem: "agentes" };
  return { texto: textoDoPasso(l, i), origem: "template" };
}
const colchetes = (t) => [...new Set(String(t || "").match(/\[[^\]\n]{1,60}\]/g) || [])];
function realce(texto) { return esc(texto).replace(/\[[^\]\n]{1,60}\]/g, (m) => `<mark>${m}</mark>`); }

/* ================= Regras de negócio ================= */
function novaCadencia(l) {
  return { estado: "ativa", passo: 0, iniciadaEm: agoraISO(), previstoEm: agoraISO(), envios: [], ciclo: ((l.cadencia && l.cadencia.ciclo) || 0) + 1, respondeuEm: "", respondeuNoPasso: null };
}
function fimDoDia() { const d = new Date(); if (d.getHours() < 18) d.setHours(18, 0, 0, 0); return d.toISOString(); }

/* Muda a etapa aplicando as regras (pede os dados antes, como no DPlay). Devolve true se mudou. */
async function mudarEtapa(l, nova, opts = {}) {
  const de = l.etapa;
  if (de === nova) return false;
  const patch = { etapa: nova };
  const extras = [];
  const agora = agoraISO();
  if (nova === "cadencia") {
    if (!l.instagram && !l.whatsapp) { if (!opts.silencioso) toast("Para iniciar a cadência, cadastre o Instagram ou o WhatsApp do lead.", { ruim: true }); return false; }
    if (!opts.semConfirmar) {
      const ok = await confirmar({ titulo: "Iniciar a cadência?", texto: `${nomeLead(l)} entra no Fluxo de Cadência: 1º template pelo Instagram, depois WhatsApp, com espera em dias úteis. Nada é enviado sem o seu clique.`, ok: "Iniciar cadência" });
      if (!ok) return false;
    }
    if (!cadAtiva(l)) { patch.cadencia = novaCadencia(l); extras.push(histItem("Cadência iniciada (ciclo " + patch.cadencia.ciclo + ")", "sistema")); }
  } else if (cadAtiva(l) && nova !== "reuniao" && nova !== "encerrado") {
    patch.cadencia = { estado: "interrompida" };
    extras.push(histItem("Cadência interrompida", "sistema"));
  }
  if (nova === "reuniao") {
    const r = opts.reuniao || (await modalConversa(l));
    if (!r) return false;
    patch.reuniao = { data: r.data, status: "agendada", resultado: "" };
    if (cadAtiva(l)) { patch.cadencia = { estado: "respondeu", respondeuEm: agora, respondeuNoPasso: Math.max(0, l.cadencia.passo - 1) }; extras.push(histItem("Cadência interrompida: o lead respondeu", "sistema")); }
    extras.push(histItem("Conversa de diagnóstico marcada para " + fmtDiaHora(r.data), "reuniao"));
  }
  if (nova === "encerrado") {
    const r = opts.encerramento || (await modalEncerrar(l, opts.motivo));
    if (!r) return false;
    patch.encerramento = { motivo: r.motivo, em: hojeISO(), obs: r.obs || "" };
    if (cadAtiva(l)) patch.cadencia = { estado: "encerrada" };
    extras.push(histItem("Encerrado: " + rotulo(MOTIVOS, r.motivo) + (r.obs ? " — " + r.obs : ""), "sistema"));
  }
  if (nova === "ganho") {
    const r = opts.ganho || (await modalGanho(l));
    if (!r) return false;
    patch.valor = r.valor;
    patch.entradaPaga = r.entradaPaga;
    if (r.entradaPaga) patch.entradaEm = l.entradaEm || hojeISO();
    patch.faseCliente = l.faseCliente && l.faseCliente !== "cancelado" ? l.faseCliente : "em_construcao";
    extras.push(histItem("Ganho: " + brl(r.valor) + (r.entradaPaga ? " · entrada paga" : " · entrada pendente"), "sistema"));
  }
  if (de === "encerrado") patch.encerramento = null;
  patch.datas = { ...(l.datas || {}), [nova]: hojeISO() };
  patch.historico = comHist(l, histItem(`Mudança de etapa: ${ETAPA[de] ? ETAPA[de].curto : de} → ${ETAPA[nova].curto}`, "etapa"), ...extras);
  return salvar(l.id, patch, { msg: `${nomeLead(l)}: ${ETAPA[nova].curto}`, desfazer: true, silencioso: opts.silencioso });
}

/* Registra o envio do passo atual da cadência e agenda o próximo em dias úteis (às 9h). */
function registrarEnvio(l, canal, texto) {
  const c = l.cadencia || novaCadencia(l);
  const i = c.passo || 0;
  const p = passos(l)[i] || {};
  const agora = new Date();
  const prox = somarDiasUteis(agora, p.esperaDiasUteis ?? 1);
  const cad = { ...c, estado: "ativa", passo: i + 1, previstoEm: prox.toISOString(), envios: [...(c.envios || []), { passo: i, em: agora.toISOString(), canal }] };
  const trecho = texto ? " — “" + texto.slice(0, 120).replace(/\s+/g, " ") + (texto.length > 120 ? "…" : "") + "”" : "";
  const patch = { cadencia: cad, historico: comHist(l, histItem(`Enviado: ${p.nome || ordemNum(i)} · ${canalLabel(canal)}${trecho}`, canal, { canal })) };
  if (l.mensagemProxima) patch.mensagemProxima = "";
  if (l.etapa === "novo_lead" || l.etapa === "primeiro_contato") { patch.etapa = "cadencia"; patch.datas = { ...(l.datas || {}), cadencia: hojeISO() }; }
  delete st.rascunhos[l.id];
  const msg = i >= 4 ? "Break-up registrado. Encerrar em " + fmtDia(cad.previstoEm) + " se não responder." : `${ordemNum(i)} registrado. Próximo envio: ${fmtDiaHora(cad.previstoEm)}`;
  return salvar(l.id, patch, { msg, desfazer: true });
}
function leadRespondeu(l) {
  const patch = {};
  const hs = [];
  if (l.cadencia && l.cadencia.estado === "ativa") {
    patch.cadencia = { estado: "respondeu", respondeuEm: agoraISO(), respondeuNoPasso: Math.max(0, l.cadencia.passo - 1) };
    hs.push(histItem("Lead respondeu" + (l.cadencia.passo ? " depois do " + ordemNum(l.cadencia.passo - 1) : "") + ". Cadência interrompida.", "sistema"));
  } else hs.push(histItem("Lead respondeu", "sistema"));
  if (["novo_lead", "cadencia"].includes(l.etapa)) {
    patch.etapa = "primeiro_contato";
    patch.datas = { ...(l.datas || {}), primeiro_contato: hojeISO() };
    hs.unshift(histItem(`Mudança de etapa: ${ETAPA[l.etapa].curto} → ${ETAPA.primeiro_contato.curto}`, "etapa"));
  }
  patch.proximaAcao = { texto: "Responder o lead e marcar a conversa", ate: fimDoDia(), responsavel: l.responsavel || "Pedro" };
  patch.historico = comHist(l, ...hs);
  return salvar(l.id, patch, { msg: nomeLead(l) + " respondeu: próxima ação criada para hoje", desfazer: true });
}
async function novoCiclo(l) {
  const ok = await confirmar({ titulo: "Iniciar novo ciclo?", texto: "A cadência recomeça do 1º template. O histórico dos envios anteriores continua na linha do tempo.", ok: "Iniciar novo ciclo" });
  if (!ok) return;
  const cad = novaCadencia(l);
  const patch = { cadencia: cad, historico: comHist(l, histItem("Novo ciclo de cadência iniciado (ciclo " + cad.ciclo + ")", "sistema")) };
  if (l.etapa !== "cadencia") {
    patch.etapa = "cadencia"; patch.datas = { ...(l.datas || {}), cadencia: hojeISO() };
    if (l.etapa === "encerrado") patch.encerramento = null;
    patch.historico = comHist(l, histItem(`Mudança de etapa: ${ETAPA[l.etapa].curto} → ${ETAPA.cadencia.curto}`, "etapa"), histItem("Novo ciclo de cadência iniciado (ciclo " + cad.ciclo + ")", "sistema"));
  }
  return salvar(l.id, patch, { msg: "Novo ciclo iniciado", desfazer: true });
}
const encerrarSemResposta = (l) => mudarEtapa(l, "encerrado", { motivo: "sem_resposta" });

/* ================= Toast, modal, painel, menu ================= */
function toast(msg, { acao, onClick, ruim } = {}) {
  const box = $("#toasts");
  const t = h("div", { class: "toast", role: "status", "data-bad": ruim }, h("span", {}, msg));
  if (acao) {
    // só o último "Desfazer" fica valendo (desfazer um anterior apagaria as mudanças seguintes)
    for (const x of [...box.querySelectorAll(".toast[data-undo]")]) x.remove();
    t.dataset.undo = "";
    t.append(h("button", { type: "button", onclick: () => { t.remove(); onClick(); } }, acao));
  }
  box.append(t);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => t.remove(), acao ? 7000 : 3200);
}
const pilhaCamadas = [];
function abrirCamada(el, aoFechar) {
  const anterior = document.activeElement;
  $("#layer").append(el);
  const item = { el, fechar: () => { el.remove(); const i = pilhaCamadas.indexOf(item); if (i >= 0) pilhaCamadas.splice(i, 1); if (aoFechar) aoFechar(); if (anterior && anterior.isConnected) anterior.focus(); } };
  pilhaCamadas.push(item);
  setTimeout(() => {
    for (const sel of ["[autofocus]", "input:not([type=checkbox]):not([type=radio]):not([type=hidden])", "textarea", "select", "button.primary", ".modal-b button, .modal-f button", "button"]) {
      const f = el.querySelector(sel); if (f) { f.focus(); break; }
    }
  }, 30);
  return item;
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && pilhaCamadas.length) { e.preventDefault(); pilhaCamadas[pilhaCamadas.length - 1].fechar(); }
  if (e.key === "Tab" && pilhaCamadas.length) {
    const el = pilhaCamadas[pilhaCamadas.length - 1].el;
    const foc = [...el.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex='0']")].filter((x) => x.offsetParent !== null);
    if (!foc.length) return;
    if (e.shiftKey && document.activeElement === foc[0]) { e.preventDefault(); foc[foc.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === foc[foc.length - 1]) { e.preventDefault(); foc[0].focus(); }
  }
});
/* Modal genérico. aoConfirmar() devolve o valor (fecha) ou lança Error("mensagem") para manter aberto. */
function modal({ titulo, sub, corpo, ok = "Salvar", cancelar = "Cancelar", perigo, largura, aoConfirmar, semRodape, extras = [] }) {
  return new Promise((resolve) => {
    const err = h("p", { class: "modal-err", role: "alert", hidden: true });
    const btnOk = h("button", { class: "btn " + (perigo ? "danger solid" : "primary"), type: "submit" }, ok);
    const form = h("form", { class: "modal", style: largura ? { "--mw": largura + "px" } : null, role: "dialog", "aria-modal": "true", "aria-labelledby": "mt", novalidate: true },
      h("div", { class: "modal-h" }, h("div", {}, h("h2", { id: "mt" }, titulo), sub ? h("p", {}, sub) : null),
        h("button", { class: "icon-btn", type: "button", "aria-label": "Fechar", html: I.x, onclick: () => fechar(null) })),
      h("div", { class: "modal-b" }, corpo, err),
      semRodape ? null : h("div", { class: "modal-f" }, ...extras, h("button", { class: "btn ghost", type: "button", onclick: () => fechar(null) }, cancelar), btnOk));
    const scrim = h("div", { class: "scrim" }, form);
    scrim.addEventListener("mousedown", (e) => { if (e.target === scrim) fechar(null); });
    let feito = false;
    const camada = abrirCamada(scrim, () => { if (!feito) { feito = true; resolve(null); } });
    function fechar(v) { if (feito) return; feito = true; camada.fechar(); resolve(v); }
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); err.hidden = true;
      try { const v = aoConfirmar ? await aoConfirmar(form) : true; fechar(v === undefined ? true : v); }
      catch (ex) { err.textContent = ex.message; err.hidden = false; }
    });
    form._fechar = fechar;
  });
}
const confirmar = ({ titulo, texto, ok = "Confirmar", perigo }) => modal({ titulo, corpo: h("p", { class: "muted", style: { margin: 0 } }, texto), ok, perigo, largura: 440 });
function painelLateral({ titulo, sub, corpo, rodape }) {
  const panel = h("aside", { class: "panel", role: "dialog", "aria-modal": "true", "aria-labelledby": "pt" },
    h("div", { class: "modal-h" }, h("div", {}, h("h2", { id: "pt" }, titulo), sub ? h("p", {}, sub) : null),
      h("button", { class: "icon-btn", type: "button", "aria-label": "Fechar", html: I.x, onclick: () => camada.fechar() })),
    h("div", { class: "modal-b" }, corpo),
    rodape ? h("div", { class: "modal-f" }, rodape) : null);
  const wrap = h("div", {}, h("div", { class: "panel-scrim", onclick: () => camada.fechar() }), panel);
  const camada = abrirCamada(wrap);
  return camada;
}
function menu(ancora, itens) {
  fecharMenus();
  const pop = h("div", { class: "pop", role: "menu" });
  for (const it of itens) {
    if (it === "-") { pop.append(h("hr")); continue; }
    pop.append(h("button", { type: "button", role: it.marcado !== undefined ? "menuitemradio" : "menuitem", "aria-checked": it.marcado !== undefined ? String(!!it.marcado) : null, class: it.perigo ? "danger" : null, onclick: () => { fecharMenus(); it.onClick(); } },
      it.cor ? h("span", { class: "pill dot", "data-c": it.cor }, it.label) : it.label));
  }
  document.body.append(pop);
  const r = ancora.getBoundingClientRect();
  const w = pop.offsetWidth, hh = pop.offsetHeight;
  pop.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + "px";
  pop.style.top = (r.bottom + hh + 8 > innerHeight ? Math.max(8, r.top - hh - 6) : r.bottom + 6) + "px";
  setTimeout(() => { const b = pop.querySelector("button"); if (b) b.focus(); }, 10);
  pop.addEventListener("keydown", (e) => {
    const bs = [...pop.querySelectorAll("button")]; const i = bs.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); bs[(i + 1) % bs.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus(); }
    if (e.key === "Escape") { e.stopPropagation(); fecharMenus(); ancora.focus(); }
  });
  menu.aberto = { pop, aoFechar: null };
  return menu.aberto;
}
function fecharMenus() { if (menu.aberto) { menu.aberto.pop.remove(); const f = menu.aberto.aoFechar; menu.aberto = null; if (f) f(); } }
document.addEventListener("mousedown", (e) => { if (menu.aberto && !menu.aberto.pop.contains(e.target)) fecharMenus(); });
// No celular, abrir o teclado muda só a altura da janela: isso não pode fechar o seletor de data.
let larguraJanela = innerWidth;
window.addEventListener("resize", () => { if (innerWidth !== larguraJanela) { larguraJanela = innerWidth; fecharMenus(); } });

/* ================= Seletor de data e hora ================= */
// Substitui o <input type="datetime-local"> do navegador: atalhos, calendário do mês e horários em botões.
// valor e retorno no formato do input ("AAAA-MM-DDTHH:MM", horário local) ou "".
const HORAS_RAPIDAS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const DIAS_INI = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES_L = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
function normHora(s) {
  const d = String(s || "").replace(/\D/g, "");
  if (!d) return "";
  let hh, mm;
  if (d.length <= 2) { hh = +d; mm = 0; } else if (d.length === 3) { hh = +d.slice(0, 1); mm = +d.slice(1); } else { hh = +d.slice(0, 2); mm = +d.slice(2, 4); }
  if (hh > 23 || mm > 59) return "";
  return String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}
function resumoData(v) { return v ? fmtDiaHora(new Date(v).toISOString()) : ""; }
function seletorData({ valor = "", aoMudar = () => {}, horaPadrao = "09:00" } = {}) {
  let dia = valor ? valor.slice(0, 10) : "";
  let hora = valor ? valor.slice(11, 16) : "";
  let mesVis = new Date((dia || hojeISO()) + "T12:00:00"); mesVis.setDate(1);
  const raiz = h("div", { class: "dp", role: "group", "aria-label": "Escolher data e hora" });
  const atual = () => (dia ? dia + "T" + (hora || horaPadrao) : "");
  const mudar = () => { aoMudar(atual()); desenhar(); };
  const escolherDia = (d) => { dia = d; if (!hora) hora = horaPadrao; mesVis = new Date(d + "T12:00:00"); mesVis.setDate(1); mudar(); };
  const proxUtil = () => somarDiasUteis(new Date(), 1).toLocaleDateString("sv-SE");
  function desenhar() {
    const hoje = hojeISO();
    const atalhos = [["Hoje", hoje], ["Amanhã", somarDias(hoje, 1)], ["Próx. dia útil", proxUtil()], ["Em 1 semana", somarDias(hoje, 7)]];
    const ano = mesVis.getFullYear(), mes = mesVis.getMonth();
    const primeiroDow = new Date(ano, mes, 1).getDay(), diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const celulas = [];
    for (let i = 0; i < primeiroDow; i++) celulas.push(h("span", { class: "dp-vazio", "aria-hidden": "true" }));
    for (let n = 1; n <= diasNoMes; n++) {
      const iso = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
      const util = ehDiaUtil(new Date(iso + "T12:00:00"));
      celulas.push(h("button", { type: "button", class: "dp-dia" + (iso === hoje ? " hoje" : "") + (iso === dia ? " sel" : "") + (util ? "" : " fds"),
        "aria-label": n + " de " + MESES_L[mes] + (iso === hoje ? " (hoje)" : "") + (util ? "" : " (fim de semana ou feriado)"), "aria-pressed": String(iso === dia), onclick: () => escolherDia(iso) }, String(n)));
    }
    const horaInp = h("input", { class: "dp-hora-inp", type: "text", inputmode: "numeric", placeholder: "hh:mm", "aria-label": "Outro horário (hh:mm)", value: hora && !HORAS_RAPIDAS.includes(hora) ? hora : "" });
    const aplicarHora = () => { const v = normHora(horaInp.value); if (v) { if (v !== hora) { hora = v; if (!dia) dia = hoje; mudar(); } } else if (horaInp.value) { horaInp.value = ""; } };
    horaInp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); aplicarHora(); } });
    horaInp.addEventListener("blur", aplicarHora);
    raiz.replaceChildren(
      h("div", { class: "dp-atalhos" }, atalhos.map(([rot, d]) => h("button", { type: "button", class: "dp-chip" + (d === dia ? " sel" : ""), onclick: () => escolherDia(d) }, rot))),
      h("div", { class: "dp-cal" },
        h("div", { class: "dp-mes" },
          h("button", { type: "button", class: "dp-nav", "aria-label": "Mês anterior", onclick: () => { mesVis.setMonth(mesVis.getMonth() - 1); desenhar(); } }, "‹"),
          h("strong", { "aria-live": "polite" }, MESES_L[mes] + " " + ano),
          h("button", { type: "button", class: "dp-nav", "aria-label": "Próximo mês", onclick: () => { mesVis.setMonth(mesVis.getMonth() + 1); desenhar(); } }, "›")),
        h("div", { class: "dp-grade" }, DIAS_INI.map((d) => h("span", { class: "dp-dow", "aria-hidden": "true" }, d)), celulas)),
      h("div", { class: "dp-horas" },
        h("span", { class: "dp-rot" }, "Horário"),
        h("div", { class: "dp-horas-lista" }, HORAS_RAPIDAS.map((x) => h("button", { type: "button", class: "dp-chip" + (x === hora ? " sel" : ""), "aria-pressed": String(x === hora), onclick: () => { hora = x; if (!dia) dia = hoje; mudar(); } }, x)), horaInp)),
      h("div", { class: "dp-resumo" + (dia ? "" : " vazio") }, dia ? resumoData(atual()) : "Nenhuma data escolhida"));
  }
  desenhar();
  return { el: raiz, valor: atual, limpar: () => { dia = ""; hora = ""; mudar(); } };
}
// Painel flutuante (célula do Banco): Salvar / Limpar / Cancelar. aoSalvar recebe o valor no formato do input ou "".
function popData(ancora, valor, aoSalvar, aoFechar) {
  fecharMenus();
  let v = valor;
  const sel = seletorData({ valor, aoMudar: (x) => { v = x; } });
  const pop = h("div", { class: "pop pop-data", role: "dialog", "aria-label": "Escolher data e hora" },
    sel.el,
    h("div", { class: "dp-acoes" },
      h("button", { type: "button", class: "btn ghost sm", onclick: () => { fecharMenus(); aoSalvar(""); } }, "Limpar"),
      h("span", { style: { flex: "1" } }),
      h("button", { type: "button", class: "btn ghost sm", onclick: () => fecharMenus() }, "Cancelar"),
      h("button", { type: "button", class: "btn primary sm", onclick: () => { fecharMenus(); aoSalvar(v); } }, "Salvar")));
  document.body.append(pop);
  const r = ancora.getBoundingClientRect(), w = pop.offsetWidth, hh = pop.offsetHeight;
  pop.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + "px";
  pop.style.top = (r.bottom + hh + 8 > innerHeight ? Math.max(8, r.top - hh - 6) : r.bottom + 6) + "px";
  pop.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); fecharMenus(); if (ancora.focus) ancora.focus(); } });
  setTimeout(() => { const b = pop.querySelector(".dp-dia.sel, .dp-dia.hoje, .dp-chip"); if (b) b.focus(); }, 10);
  menu.aberto = { pop, aoFechar };
  return menu.aberto;
}

/* ================= Componentes ================= */
const pill =(label, cor, cls = "") => h("span", { class: "pill " + cls, "data-c": cor }, label);
const etapaPill = (id) => pill(ETAPA[id] ? ETAPA[id].curto : id, ETAPA[id] ? ETAPA[id].cor : "slate", "dot");
const tempPill = (t) => (t ? pill((TEMPERATURAS.find((x) => x.id === t) || {}).label || t, (TEMPERATURAS.find((x) => x.id === t) || {}).cor, "up") : null);
// Faixa do decisor (hotelaria): 🔥 prospectar ≥ 80 · 🟡 enriquecer 50–79 · 🔴 não priorizar < 50.
function faixaPill(l) {
  const f = FAIXA_DECISOR[faixaDecisor(l)];
  if (!f) return pill("decisor não pesquisado", "slate", "sq");
  const s = l.decisorScore;
  return pill(f.emoji + " " + f.label + (s === null || s === undefined || s === "" ? "" : " · " + s), f.cor, "sq");
}
const notaTag = (n) => (n === null || n === undefined || n === "" ? null : h("span", { class: "score num", "data-hi": Number(n) >= 8, title: "Nota da auditoria (0–10)" }, n + "/10"));
function dataChip(iso, { prefixo = "", soDia = false } = {}) {
  if (!iso) return null;
  const s = situacao(iso);
  const txt = (s === "late" ? "Atrasado · " : "") + prefixo + (soDia ? fmtDia(iso) : fmtDiaHora(iso));
  const el = h("span", { class: "due", "data-st": s }); el.innerHTML = I.relogio; el.append(txt); return el;
}
function canalChip(canal) { const c = h("span", { class: "ch", "data-ch": canal, html: canal === "instagram" ? I.instagram : I.whatsapp }); c.append(canalLabel(canal)); return c; }
// Sub-passo mostrado no selo do card ("Cadência · Enviar 2º template").
function subPasso(l) {
  if (l.etapa === "cadencia") {
    if (!l.cadencia) return "Cadência · iniciar";
    if (l.cadencia.estado === "ativa") return l.cadencia.passo < 5 ? "Cadência · Enviar " + ordemNum(l.cadencia.passo) : "Cadência · Encerrar";
    return "Cadência · " + ({ respondeu: "respondeu", encerrada: "encerrada", interrompida: "interrompida" }[l.cadencia.estado] || "");
  }
  if (l.etapa === "reuniao" && l.reuniao && l.reuniao.data) return "Conversa · " + ({ agendada: "agendada", realizada: "realizada", no_show: "no-show" }[l.reuniao.status] || "");
  if (l.etapa === "encerrado" && l.encerramento) return "Encerrado · " + rotulo(MOTIVOS, l.encerramento.motivo);
  if (l.etapa === "ganho" && l.faseCliente) return "Ganho · " + FASE[l.faseCliente].label;
  return ETAPA[l.etapa] ? ETAPA[l.etapa].label : l.etapa;
}
function kpi(label, valor, sub, { tom, icone = "info", quente } = {}) {
  return h("div", { class: "card kpi", "data-tone": tom, "data-hot": quente },
    h("div", { class: "kpi-top" }, h("span", { class: "kpi-ico", html: I[icone] }), label),
    h("div", { class: "kpi-val num" }, valor), sub ? h("div", { class: "kpi-sub" }, sub) : null);
}
function barras(linhas, { fmt = (v) => String(v), sep = [] } = {}) {
  if (!linhas.length || !linhas.some((r) => r.valor > 0)) return h("p", { class: "chart-empty" }, "Sem dados no período.");
  const max = Math.max(1, ...linhas.map((r) => r.valor));
  const ul = h("ul", { class: "bars" });
  linhas.forEach((r, i) => ul.append(h("li", { class: "bar" + (sep.includes(i) ? " sep" : ""), title: r.label + ": " + fmt(r.valor) + (r.extra ? " · " + r.extra : "") },
    h("span", { class: "bar-l" }, r.label),
    h("span", { class: "bar-t", "aria-hidden": "true" }, h("span", { class: "bar-f" + (r.alt ? " alt" : ""), style: { width: (r.valor / max) * 100 + "%" } })),
    h("span", { class: "bar-v num" }, fmt(r.valor), r.extra ? h("small", {}, r.extra) : null))));
  const tabela = h("details", { class: "tv" }, h("summary", {}, "Ver em tabela"),
    h("table", {}, h("thead", {}, h("tr", {}, h("th", {}, "Item"), h("th", {}, "Valor"))),
      h("tbody", {}, linhas.map((r) => h("tr", {}, h("td", {}, r.label), h("td", { class: "num" }, fmt(r.valor) + (r.extra ? " · " + r.extra : "")))))));
  return h("div", {}, ul, tabela);
}
const cardSec = (titulo, icone, corpo, acoes) => h("section", { class: "card" },
  h("div", { class: "card-h" }, h("h2", {}, icone ? h("span", { html: I[icone], style: { display: "inline-flex" } }) : null, titulo), acoes || null),
  h("div", { class: "card-b" }, corpo));
const viewHead = (titulo, texto, acoes, eyebrow) => h("div", { class: "view-head" },
  h("div", {}, eyebrow ? h("div", { class: "eyebrow" }, eyebrow) : null, h("h1", {}, titulo), texto ? h("p", {}, texto) : null),
  acoes ? h("div", { class: "head-actions" }, acoes) : null);
function selectField(id, label, opcoes, valor, onChange) {
  const s = h("select", { class: "field", id, "aria-label": label, onchange: (e) => { onChange(e.target.value); gravarFiltros(); } }, opcoes.map(([v, t]) => h("option", { value: v }, t)));
  s.value = valor || "";
  return s;
}
function buscaField(id, placeholder, valor, onInput) {
  const i = h("input", { class: "field", type: "search", id, placeholder, "aria-label": placeholder, value: valor, oninput: (e) => onInput(e.target.value) });
  return h("div", { class: "search-field grow" }, h("span", { html: I.busca, style: { display: "contents" } }), i);
}
// "Limpar filtros" aparece só quando há algum filtro ativo (além da busca).
function botaoLimparFiltros(f, chaves) {
  if (!chaves.some((k) => f[k])) return null;
  return h("button", { class: "btn ghost sm", type: "button", onclick: () => { for (const k of chaves) f[k] = ""; f.q = ""; gravarFiltros(); render(true); } }, "Limpar filtros");
}
const casa = (l, q) => !q || [l.nome, l.empresa, l.instagram, l.segmento, l.localizacao, l.whatsapp, l.email, l.emailEmpresa, (l.decisor || {}).email].join(" ").toLowerCase().includes(q.trim().toLowerCase().replace(/^@/, ""));

/* ================= Navegação e rotas ================= */
const MENU = [
  ["Visão geral", [["painel", "Painel", "painel"]]],
  ["Acompanhamento de Leads", [["kanban", "Kanban", "kanban"], ["cadencia", "Fluxo de Cadência", "cadencia"], ["banco", "Banco de Leads", "banco"], ["agenda", "Agenda Comercial", "agenda"], ["relatorios", "Relatórios", "relatorios"]]],
  ["Clientes", [["clientes", "Clientes", "clientes"]]],
  ["Ferramentas", [["templates", "Templates", "templates"], ["roteiro", "Roteiro de Ligação", "roteiro"], ["objecoes", "Matriz de Objeções", "objecoes"]]],
];
const TITULOS = { painel: "Painel", kanban: "Kanban", cadencia: "Fluxo de Cadência", banco: "Banco de Leads", agenda: "Agenda Comercial", relatorios: "Relatórios", clientes: "Clientes", templates: "Templates", roteiro: "Roteiro de Ligação", objecoes: "Matriz de Objeções", lead: "Ficha do lead" };
function lerRota() {
  const m = (location.hash || "").match(/^#\/([a-z]+)(?:\/(.+))?$/);
  if (!m || !TITULOS[m[1]]) return { nome: "kanban", id: null };
  return { nome: m[1], id: m[2] ? decodeURIComponent(m[2]) : null };
}
const linkLead = (id) => "#/lead/" + encodeURIComponent(id);
function irPara(hash) { if (location.hash === hash) render(true); else location.hash = hash; }
function renderNav() {
  const nav = $("#side-nav"); nav.replaceChildren();
  const acoes = todasAcoes();
  const pendentes = acoes.filter((a) => ["late", "today"].includes(situacao(a.em))).length;
  const envios = acoes.filter((a) => (a.tipo === "envio" || a.tipo === "encerrar") && ["late", "today"].includes(situacao(a.em))).length;
  const ativo = st.rota.nome === "lead" ? (st.voltarPara || "kanban") : st.rota.nome;
  for (const [sec, itens] of MENU) {
    nav.append(h("div", { class: "nav-sec" }, sec));
    for (const [rota, label, icone] of itens) {
      const n = rota === "agenda" ? pendentes : rota === "cadencia" ? envios : null;
      nav.append(h("a", { class: "nav-link", href: "#/" + rota, "aria-current": ativo === rota ? "page" : null, onclick: fecharMenuLateral },
        h("span", { html: I[icone], style: { display: "contents" } }), label,
        n !== null && st.loaded.leads ? h("span", { class: "nav-count num", "data-zero": !n, "aria-label": n + " pendentes" }, String(n)) : null));
    }
  }
}
function abrirMenuLateral() { $("#side").dataset.open = ""; $("#side-scrim").hidden = false; $("#menu-btn").setAttribute("aria-expanded", "true"); setTimeout(() => { const a = $("#side .nav-link"); if (a) a.focus(); }, 50); }
function fecharMenuLateral() { delete $("#side").dataset.open; $("#side-scrim").hidden = true; $("#menu-btn").setAttribute("aria-expanded", "false"); }

const VIEWS = {};
let ultimaRota = "";
function render(forcar = false) {
  if (!st.ready) return;
  renderNav();
  if (drag || st.editando) return;
  const ae = document.activeElement;
  const main = $("#main");
  const digitando = ae && main.contains(ae) && (ae.tagName === "TEXTAREA" || (ae.tagName === "INPUT" && !["checkbox", "radio", "button"].includes(ae.type)) || ae.tagName === "SELECT");
  const rotaKey = st.rota.nome + "/" + (st.rota.id || "");
  if (digitando && !forcar && rotaKey === ultimaRota) return;
  // guarda a rolagem horizontal dos quadros e tabelas
  const rolos = [...main.querySelectorAll(".board, .table-wrap")].map((x) => x.scrollLeft);
  const foco = ae && main.contains(ae) && ae.id ? ae.id : null;
  const conteudo = (VIEWS[st.rota.nome] || VIEWS.kanban)();
  main.replaceChildren(conteudo);
  if (rotaKey === ultimaRota) {
    [...main.querySelectorAll(".board, .table-wrap")].forEach((x, i) => { if (rolos[i]) x.scrollLeft = rolos[i]; });
    if (foco) { const f = document.getElementById(foco); if (f) f.focus({ preventScroll: true }); }
  }
  ultimaRota = rotaKey;
  const urgentes = st.loaded.leads ? todasAcoes().filter((a) => situacao(a.em) === "late").length : 0;
  document.title = (urgentes ? "(" + urgentes + ") " : "") + (st.rota.nome === "lead" && lead(st.rota.id) ? nomeLead(lead(st.rota.id)) : TITULOS[st.rota.nome] || "Kanban") + " · RD Solutions";
}

/* ================= Arrastar e soltar (mouse e toque) ================= */
let drag = null;
function arrastavel(card, { id, colAtual, onDrop }) {
  card.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const naGrip = !!e.target.closest(".grip");
    if (!naGrip && e.target.closest("a, button, input, select, textarea")) return;
    if (e.pointerType !== "mouse" && !naGrip) return; // no toque, arraste pelo ícone de pontinhos
    drag = { id, card, colAtual, onDrop, x0: e.clientX, y0: e.clientY, started: false, ghost: null, over: null, dx: 0, dy: 0 };
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener("pointermove", (e) => {
    if (!drag || drag.card !== card) return;
    if (!drag.started) {
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;
      const r = card.getBoundingClientRect();
      drag.dx = drag.x0 - r.left; drag.dy = drag.y0 - r.top;
      drag.ghost = card.cloneNode(true); drag.ghost.classList.add("ghost"); drag.ghost.style.width = r.width + "px";
      document.body.append(drag.ghost); card.dataset.placeholder = ""; document.body.dataset.dragging = ""; drag.started = true;
    }
    e.preventDefault();
    drag.ghost.style.left = e.clientX - drag.dx + "px"; drag.ghost.style.top = e.clientY - drag.dy + "px";
    const col = document.elementFromPoint(e.clientX, e.clientY)?.closest(".col[data-key]");
    if (drag.over && drag.over !== col) delete drag.over.dataset.over;
    if (col) col.dataset.over = "";
    drag.over = col;
    drag.ultX = e.clientX;
    if (!drag.rolagem) {
      // rolagem automática enquanto o ponteiro fica perto das bordas do quadro
      const bd = card.closest(".board");
      const passo = () => {
        if (!drag || !drag.started || !bd) return;
        const r = bd.getBoundingClientRect();
        const v = drag.ultX > r.right - 80 ? 1 : drag.ultX < r.left + 80 ? -1 : 0;
        if (v) bd.scrollLeft += v * 18;
        drag.rolagem = requestAnimationFrame(passo);
      };
      drag.rolagem = requestAnimationFrame(passo);
    }
  });
  const fim = (e) => {
    if (!drag || drag.card !== card) return;
    const d = drag; drag = null;
    if (d.rolagem) cancelAnimationFrame(d.rolagem);
    if (!d.started) return;
    const engole = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
    card.addEventListener("click", engole, { capture: true, once: true });
    setTimeout(() => card.removeEventListener("click", engole, { capture: true }), 80);
    d.ghost.remove(); delete card.dataset.placeholder; delete document.body.dataset.dragging;
    if (d.over) delete d.over.dataset.over;
    const alvo = e.type === "pointerup" && d.over ? d.over.dataset.key : null;
    if (alvo && alvo !== d.colAtual) d.onDrop(alvo); else render(true);
  };
  card.addEventListener("pointerup", fim);
  card.addEventListener("pointercancel", fim);
}

/* ================= Kanban ================= */
function cardLead(l, { arrastar = true, acoes = null, selecionavel = false } = {}) {
  const prox = acoesDe(l)[0];
  const sel = selecionavel && st.selecionados.has(l.id);
  const ck = selecionavel ? h("input", { type: "checkbox", class: "kc-ck", "aria-label": "Selecionar " + nomeLead(l), checked: sel, onclick: (e) => e.stopPropagation(), onchange: (e) => { e.target.checked ? st.selecionados.add(l.id) : st.selecionados.delete(l.id); render(true); } }) : null;
  const s = prox ? situacao(prox.em) : null;
  const grip = arrastar ? h("button", { class: "grip", type: "button", "aria-label": "Arrastar " + nomeLead(l) + " para outra etapa", html: I.grip, onclick: (e) => e.stopPropagation() }) : null;
  const et = ETAPA[l.etapa] || ETAPA.novo_lead;
  const card = h("article", { class: "kcard", tabindex: "0", role: "link", "aria-label": nomeLead(l) + (selecionavel ? " — selecionar" : " — abrir ficha"), "data-late": s === "late", "data-today": s === "today", "data-sel": sel, dataset: { id: l.id } },
    h("div", { class: "kc-top" }, ck, h("span", { class: "kc-name" }, l.empresa ? empresaCurta(l.empresa) : (l.nome || "Sem nome")), selecionavel ? null : grip),
    h("span", { class: "kc-meta" }, [contato(l), l.instagram ? "@" + handle(l.instagram) : ""].filter(Boolean).join(" · ") || "Contato a confirmar"),
    subPasso(l) !== et.label ? h("span", { class: "kc-step", "data-c": et.cor }, subPasso(l)) : null,
    prox ? h("div", { class: "kc-next" }, dataChip(prox.em)) : null,
    prox ? h("div", { class: "kc-next" }, h("b", {}, "→ "), prox.texto) : null,
    h("div", { class: "kc-foot" },
      h("span", { class: "kc-tags" }, tempPill(l.temperatura), notaTag(l.nota), ehHotelaria(l) ? faixaPill(l) : null, l.etapa === "ganho" || ["proposta", "negociacao", "contrato"].includes(l.etapa) ? (valorDe(l) ? h("span", { class: "money num" }, brl(valorDe(l))) : null) : null),
      urlSegura(l.demo) ? h("a", { class: "mini-link", href: urlSegura(l.demo), target: "_blank", rel: "noopener", onclick: (e) => e.stopPropagation(), html: I.externo + "demo" }) : null),
    acoes);
  const alternar = () => { st.selecionados.has(l.id) ? st.selecionados.delete(l.id) : st.selecionados.add(l.id); render(true); };
  card.addEventListener("click", (e) => { if (e.target.closest("a, button, input")) return; selecionavel ? alternar() : irPara(linkLead(l.id)); });
  card.addEventListener("keydown", (e) => { if ((e.key === "Enter" || (selecionavel && e.key === " ")) && e.target === card) { e.preventDefault(); selecionavel ? alternar() : irPara(linkLead(l.id)); } });
  return card;
}
const ordenarPorAcao = (a, b) => { const x = acoesDe(a)[0], y = acoesDe(b)[0]; return String(x ? x.em : "9").localeCompare(String(y ? y.em : "9")) || (Number(b.nota) || 0) - (Number(a.nota) || 0); };
function indicadoresKanban() {
  const acoes = todasAcoes();
  const late = acoes.filter((a) => situacao(a.em) === "late").length;
  const hoje = acoes.filter((a) => situacao(a.em) === "today").length;
  const emCad = leads().filter(cadAtiva).length;
  const lim = somarDias(hojeISO(), 7);
  const conv = leads().filter((l) => l.reuniao && l.reuniao.status === "agendada" && l.reuniao.data && diaLocal(l.reuniao.data) >= hojeISO() && diaLocal(l.reuniao.data) <= lim).length;
  return { late, hoje, emCad, conv };
}
VIEWS.kanban = () => {
  const f = st.filtros.kanban;
  const k = indicadoresKanban();
  const v = h("div", { class: "view" });
  v.append(viewHead("Kanban", "Da primeira mensagem ao contrato. Arraste os cards entre as etapas (no celular, pelo ícone de pontinhos); etapas com regra própria pedem os dados antes de mover.",
    [h("button", { class: "btn" + (st.selKanban ? " ativo" : ""), type: "button", "aria-pressed": st.selKanban, onclick: () => { st.selKanban = !st.selKanban; st.selecionados.clear(); render(true); } }, st.selKanban ? "Concluir seleção" : "Selecionar vários"),
     h("button", { class: "btn primary", type: "button", onclick: cadastrarLead, html: I.plus + "Cadastrar lead" })], "Acompanhamento de Leads"));
  if (st.selKanban) v.append(h("div", { class: "notice info", role: "note" }, h("span", { html: I.info, style: { display: "contents" } }), "Modo seleção: clique nos cards (ou na caixa do topo de cada coluna, para marcar a coluna inteira) e use a barra embaixo para iniciar a cadência ou mover todos de uma vez."));
  v.append(h("div", { class: "kpis" },
    kpi("Atrasadas", String(k.late), "ações e envios vencidos", { tom: "bad", icone: "alerta", quente: k.late > 0 }),
    kpi("Para hoje", String(k.hoje), "ações e envios do dia", { tom: "warn", icone: "relogio" }),
    kpi("Em cadência", String(k.emCad), "leads com cadência ativa", { icone: "cadencia" }),
    kpi("Conversas em 7 dias", String(k.conv), "diagnósticos agendados", { tom: "violet", icone: "calendario" })));
  if (k.late + k.hoje) v.append(h("div", { class: "notice", role: "note" }, h("span", { html: I.alerta, style: { display: "contents" } }), `Há ${k.late + k.hoje} ${k.late + k.hoje === 1 ? "ação" : "ações"} para hoje ou atrasadas.`, h("a", { href: "#/agenda" }, "Abrir a Agenda →")));
  const atualizar = () => { const b = $("#kanban-board"); if (b) b.replaceChildren(...colunasKanban()); };
  v.append(h("div", { class: "toolbar" },
    buscaField("kb-q", "Buscar nome, empresa ou @", f.q, (x) => { f.q = x; atualizar(); }),
    selectField("kb-etapa", "Filtrar por etapa", [["", "Todas as etapas"], ...ETAPAS.map((e) => [e.id, e.curto])], f.etapa, (x) => { f.etapa = x; render(true); }),
    selectField("kb-resp", "Filtrar por responsável", [["", "Todos os responsáveis"], ...respList().map((r) => [r, r])], f.resp, (x) => { f.resp = x; render(true); }),
    selectField("kb-temp", "Filtrar por temperatura", [["", "Todas as temperaturas"], ...TEMPERATURAS.map((t) => [t.id, t.label])], f.temp, (x) => { f.temp = x; render(true); }),
    botaoLimparFiltros(f, ["etapa", "resp", "temp"])));
  if (!leads().length && st.loaded.leads) v.append(h("section", { class: "card empty" }, h("h2", {}, "Nenhum lead ainda"), h("p", {}, "Os leads chegam aqui quando o Quico Qualificador termina uma rodada da Prospecção, ou quando você cadastra um lead.")));
  v.append(h("div", { class: "board", id: "kanban-board" }, colunasKanban()));
  if (st.selKanban && st.selecionados.size) v.append(barraMassa());
  return v;
};
function colunasKanban() {
  const f = st.filtros.kanban;
  const lista = leads().filter((l) => casa(l, f.q) && (!f.resp || l.responsavel === f.resp) && (!f.temp || l.temperatura === f.temp));
  return ETAPAS.filter((e) => !f.etapa || e.id === f.etapa).map((e) => {
    const itens = lista.filter((l) => l.etapa === e.id).sort(ordenarPorAcao);
    const total = itens.reduce((a, l) => a + valorDe(l), 0);
    const col = h("section", { class: "col", dataset: { key: e.id }, "data-c": e.cor, "aria-label": e.label + ", " + itens.length + " leads" },
      h("div", { class: "col-h" }, h("div", { class: "col-h-top" },
        st.selKanban && itens.length ? h("input", { type: "checkbox", class: "kc-ck", "aria-label": "Selecionar todos de " + e.label, checked: itens.every((l) => st.selecionados.has(l.id)), onchange: (ev) => { for (const l of itens) ev.target.checked ? st.selecionados.add(l.id) : st.selecionados.delete(l.id); render(true); } }) : null,
        h("strong", {}, e.label), h("span", { class: "col-n num" }, String(itens.length))),
        total && ["proposta", "negociacao", "contrato", "ganho"].includes(e.id) ? h("span", { class: "col-sub num" }, brl(total)) : null),
      h("div", { class: "col-body" }, itens.length ? itens.map((l) => { if (st.selKanban) return cardLead(l, { selecionavel: true }); const c = cardLead(l); arrastavel(c, { id: l.id, colAtual: e.id, onDrop: (alvo) => mudarEtapa(lead(l.id), alvo).then(() => render(true)) }); return c; }) : h("div", { class: "col-empty" }, "Arraste um card para cá")));
    return col;
  });
}

/* ================= Fluxo de Cadência ================= */
VIEWS.cadencia = () => {
  const ps = passos();
  const todos = leads();
  const ativos = todos.filter((l) => cadAtiva(l) && l.etapa !== "encerrado");
  const iniciaram = todos.filter((l) => l.cadencia && (l.cadencia.iniciadaEm || (l.cadencia.envios || []).length || l.cadencia.passo > 0));
  const responderam = todos.filter((l) => l.cadencia && l.cadencia.estado === "respondeu");
  const atrasados = ativos.filter((l) => l.cadencia.passo < 5 && situacao(l.cadencia.previstoEm) === "late").length;
  const v = h("div", { class: "view" });
  v.append(viewHead("Fluxo de Cadência", null, [h("a", { class: "btn", href: "#/templates", html: I.templates + "Editar templates" })], "Acompanhamento de Leads"));
  v.append(h("div", { class: "kpis" },
    kpi("Em cadência", String(ativos.length), "leads com cadência ativa", { icone: "cadencia" }),
    kpi("Envios atrasados", String(atrasados), atrasados ? "envie hoje para não esfriar" : "tudo em dia", { tom: "bad", icone: "alerta", quente: atrasados > 0 }),
    kpi("Responderam (total)", String(responderam.length), "em todos os ciclos", { tom: "good", icone: "chat" }),
    kpi("Taxa de resposta", pct(responderam.length, iniciaram.length), responderam.length + " de " + iniciaram.length + " que iniciaram", { tom: "violet", icone: "relatorios" })));
  v.append(h("div", { class: "card guide" }, h("span", { html: I.info, style: { display: "contents" } }),
    h("div", {}, h("b", {}, "Envie cada template com um clique. "), "O 1º vai pelo Instagram (o texto é copiado e a DM abre), os demais pelo WhatsApp com o texto pronto. O próximo passo é lembrado em ", h("b", {}, "dias úteis"), " (sem fins de semana e feriados nacionais), às 9h. Nada é enviado sem você clicar. Se o lead responder, clique em Respondeu: a cadência para e ele vai para Primeiro contato.")));
  if (cadenciaV1()) v.append(h("div", { class: "notice info", role: "note" }, h("span", { html: I.info, style: { display: "contents" } }), "Usando os templates padrão da v2 (a cadência salva no banco ainda é a antiga). Eles passam a valer no banco quando a migração rodar ou quando você salvar em Templates."));
  const desde30 = somarDias(hojeISO(), -30);
  const cols = [
    ...ps.map((p, i) => ({ key: "p" + i, titulo: p.nome || ordemNum(i), sub: `Sem resposta em ${p.esperaDiasUteis} dia${p.esperaDiasUteis === 1 ? "" : "s"} út${p.esperaDiasUteis === 1 ? "il" : "eis"} → ${i < 4 ? ordemNum(i + 1) : "encerrar"}`, cor: i === 0 ? "pink" : i === 4 ? "orange" : "blue", itens: ativos.filter((l) => l.cadencia.passo === i) })),
    { key: "fim", titulo: "Encerrar", sub: "Break-up enviado; encerre quando vencer a espera", cor: "red", itens: ativos.filter((l) => l.cadencia.passo >= 5) },
    { key: "resp", titulo: "Responderam", sub: "Cadência interrompida pela resposta", cor: "green", itens: responderam },
    { key: "sem", titulo: "Sem resposta", sub: "Encerrados nos últimos 30 dias", cor: "slate", itens: todos.filter((l) => l.etapa === "encerrado" && l.encerramento && l.encerramento.motivo === "sem_resposta" && (l.encerramento.em || "") >= desde30) },
  ];
  v.append(h("div", { class: "board b5" }, cols.map((c) => h("section", { class: "col", "data-c": c.cor, "aria-label": c.titulo + ", " + c.itens.length + " leads" },
    h("div", { class: "col-h" }, h("div", { class: "col-h-top" }, h("strong", {}, c.titulo), h("span", { class: "col-n num" }, String(c.itens.length))), h("span", { class: "col-sub" }, c.sub)),
    h("div", { class: "col-body" }, c.itens.length ? c.itens.sort(ordenarPorAcao).map((l) => cardCadencia(l, c.key)) : h("div", { class: "col-empty" }, "Nenhum lead aqui"))))));
  return v;
};
function cardCadencia(l, key) {
  const c = l.cadencia || {};
  const p = passos(l)[c.passo];
  const acoes = h("div", { class: "kc-actions" });
  if (key.startsWith("p")) {
    acoes.append(h("button", { class: "btn primary xs", type: "button", onclick: () => abrirEnvio(l.id), html: I.enviar + "Enviar" }),
      h("button", { class: "btn xs", type: "button", onclick: () => leadRespondeu(l) }, "Respondeu"),
      h("button", { class: "btn ghost xs", type: "button", onclick: () => mudarEtapa(l, "encerrado") }, "Encerrar"));
  } else if (key === "fim") {
    const venceu = passou(c.previstoEm);
    if (venceu) acoes.append(h("button", { class: "btn danger xs", type: "button", onclick: () => encerrarSemResposta(l) }, "Encerrar como Sem resposta"));
    acoes.append(h("button", { class: "btn xs", type: "button", onclick: () => leadRespondeu(l) }, "Respondeu"));
  } else if (key === "sem") {
    acoes.append(h("button", { class: "btn xs", type: "button", onclick: () => novoCiclo(l) }, "Iniciar novo ciclo"));
  }
  const card = cardLeadCompacto(l, [
    key.startsWith("p") && p ? canalChip(p.canal) : null,
    key.startsWith("p") || key === "fim" ? dataChip(c.previstoEm, { prefixo: key === "fim" ? "Encerrar: " : "Previsto: " }) : null,
    key === "resp" && c.respondeuEm ? h("span", { class: "due" }, "Respondeu " + fmtDia(c.respondeuEm) + (c.respondeuNoPasso != null ? " · após o " + ordemNum(c.respondeuNoPasso) : "")) : null,
    key === "sem" ? h("span", { class: "due" }, "Encerrado em " + fmtDia(l.encerramento.em)) : null,
    key === "p0" && l.mensagemProxima ? h("span", { class: "pill sq", "data-c": "violet" }, "mensagem personalizada pronta") : null,
  ], acoes);
  return card;
}
function cardLeadCompacto(l, linhas, acoes) {
  const card = h("article", { class: "kcard", tabindex: "0", "aria-label": nomeLead(l), "data-late": linhas.some((x) => x && x.dataset && x.dataset.st === "late") },
    h("div", { class: "kc-top" }, h("a", { class: "kc-name", href: linkLead(l.id), style: { color: "inherit", textDecoration: "none" } }, l.empresa ? empresaCurta(l.empresa) : (l.nome || "Sem nome")), tempPill(l.temperatura)),
    h("span", { class: "kc-meta" }, [contato(l), l.whatsapp ? fmtTel(l.whatsapp) : "", l.instagram ? "@" + handle(l.instagram) : ""].filter(Boolean).join(" · ")),
    ...linhas.filter(Boolean).map((x) => h("div", { class: "kc-next" }, x)),
    acoes);
  card.addEventListener("click", (e) => { if (e.target.closest("a, button")) return; irPara(linkLead(l.id)); });
  card.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target === card) irPara(linkLead(l.id)); });
  return card;
}

/* ================= Enviar (painel com a mensagem) ================= */
function abrirEnvio(id, { tipo = "cadencia" } = {}) {
  const l = lead(id); if (!l) return;
  const noShow = tipo === "noshow";
  const c = l.cadencia || novaCadencia(l);
  const i = c.passo || 0;
  const p = noShow ? noShowCfg(l) : passos(l)[i];
  if (!p) { toast("A cadência deste lead já terminou."); return; }
  const canal = p.canal === "instagram" ? "instagram" : "whatsapp";
  const inicial = noShow ? preencher(p.texto, l) : mensagemAtual(l).texto;
  const origem = noShow ? "template" : mensagemAtual(l).origem;
  const ta = h("textarea", { class: "msg", id: "envio-texto", "aria-label": "Mensagem que será enviada" }); ta.value = inicial;
  const aviso = h("div", { class: "warn-box", role: "status" });
  const btn = h("button", { class: "btn " + (canal === "whatsapp" ? "good" : "grad"), type: "button" });
  let forcar = false;
  const atualizarAviso = () => {
    const falta = colchetes(ta.value);
    aviso.hidden = !falta.length;
    aviso.innerHTML = falta.length ? "<b>Preencha antes de enviar:</b> " + falta.map(esc).join(", ") : "";
    forcar = false; rotularBtn();
  };
  const destino = canal === "whatsapp" ? waNumero(l.whatsapp) : handle(l.instagram);
  const rotularBtn = () => { btn.innerHTML = (canal === "whatsapp" ? I.whatsapp : I.instagram) + (forcar ? "Enviar mesmo assim" : canal === "whatsapp" ? "Abrir WhatsApp" : "Copiar e abrir Instagram"); btn.disabled = !destino; };
  ta.addEventListener("input", () => { if (!noShow) st.rascunhos[l.id] = ta.value; atualizarAviso(); });
  btn.addEventListener("click", () => {
    const texto = ta.value.trim();
    if (!texto) { toast("A mensagem está vazia.", { ruim: true }); return; }
    if (colchetes(texto).length && !forcar) { forcar = true; rotularBtn(); aviso.innerHTML = "<b>Ainda há trechos entre colchetes:</b> " + colchetes(texto).map(esc).join(", ") + ". Edite o texto ou clique de novo para enviar assim."; ta.focus(); return; }
    if (canal === "whatsapp") window.open("https://wa.me/" + destino + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    else {
      try { navigator.clipboard.writeText(texto).catch(() => {}); } catch (e) { /* sem área de transferência */ }
      window.open("https://ig.me/m/" + destino, "_blank", "noopener");
    }
    camada.fechar();
    if (noShow) salvar(l.id, { historico: comHist(l, histItem("Mensagem de no-show enviada · " + canalLabel(canal), canal, { canal })) }, { msg: "No-show registrado: mensagem enviada", desfazer: true });
    else registrarEnvio(lead(id), canal, texto);
  });
  const manual = h("button", { class: "btn ghost sm", type: "button", onclick: () => {
    const texto = ta.value.trim(); camada.fechar();
    if (noShow) salvar(l.id, { historico: comHist(l, histItem("Mensagem de no-show enviada (registro manual) · " + canalLabel(canal), canal, { canal })) }, { msg: "Envio registrado", desfazer: true });
    else registrarEnvio(lead(id), canal, texto);
  } }, "Já enviei: só registrar");
  const copiar = h("button", { class: "btn ghost sm", type: "button", html: I.copiar + "Copiar", onclick: () => { try { navigator.clipboard.writeText(ta.value).then(() => toast("Mensagem copiada"), () => toast("Não deu para copiar: selecione o texto.")); } catch (e) { ta.select(); } } });
  rotularBtn(); atualizarAviso();
  const camada = painelLateral({
    titulo: noShow ? "Mensagem de no-show" : `Enviar ${p.nome || ordemNum(i)}`,
    sub: nomeLead(l) + " · " + canalLabel(canal) + (destino ? (canal === "whatsapp" ? " " + fmtTel(l.whatsapp) : " @" + destino) : ""),
    corpo: h("div", { style: { display: "grid", gap: "12px" } },
      !destino ? h("div", { class: "notice bad" }, canal === "whatsapp" ? "Este lead não tem WhatsApp cadastrado. Cadastre na ficha ou copie o texto e registre o envio manual." : "Este lead não tem Instagram cadastrado.") : null,
      origem === "agentes" ? h("div", { class: "notice info" }, "Mensagem personalizada pelos agentes (substitui o template deste passo e é limpa ao enviar).") : null,
      p.nota ? h("div", { class: "card guide" }, h("span", { html: I.info, style: { display: "contents" } }), h("div", {}, p.nota)) : null,
      h("label", { class: "f", for: "envio-texto" }, "Mensagem (pode editar antes de enviar)", ta), aviso,
      h("p", { class: "hint", style: { margin: 0 } }, canal === "instagram" ? "O Instagram não aceita texto pronto no link: o texto vai para a área de transferência e a DM abre. É só colar e enviar." : "O WhatsApp abre com o número e o texto prontos. Confira e toque em enviar."),
      !noShow ? h("p", { class: "hint", style: { margin: 0 } }, "Ao clicar, o envio é registrado na hora e o próximo passo é agendado em " + (p.esperaDiasUteis ?? 1) + " dia(s) útil(eis), às 9h. Dá para desfazer no aviso.") : null),
    rodape: [copiar, manual, btn],
  });
}

/* ================= Banco de Leads (estilo Monday) ================= */
const COLS_BANCO = [
  { k: "empresa", t: "Empresa", tipo: "texto", wide: true },
  { k: "responsavel", t: "Responsável", tipo: "texto", lista: () => respList() },
  { k: "etapa", t: "Status do lead", tipo: "etapa" },
  { k: "criadoEm", t: "Abertura do lead", tipo: "ro-data" },
  { k: "reuniao.data", t: "Data da conversa", tipo: "datahora" },
  { k: "whatsapp", t: "Telefone", tipo: "tel" },
  { k: "instagram", t: "Instagram", tipo: "ig" },
  { k: "emailEmpresa", t: "E-mail", tipo: "texto" },
  { k: "cargo", t: "Cargo", tipo: "texto" },
  { k: "segmento", t: "Segmento", tipo: "segmento", lista: () => [...new Set(leads().map((l) => l.segmento).filter(Boolean))] },
  { k: "decisor", t: "Decisor", tipo: "decisor" },
  { k: "decisor.email", t: "E-mail do decisor", tipo: "texto" },
  { k: "podeCitarIndicacao", t: "Pode citar a indicação?", tipo: "enum", opcoes: CITAR },
  { k: "infoAdicional", t: "Informação adicional", tipo: "texto", wide: true },
  { k: "nota", t: "Nota", tipo: "numero" },
  { k: "temperatura", t: "Temperatura", tipo: "enum", opcoes: TEMPERATURAS },
  { k: "localizacao", t: "Localização", tipo: "texto" },
  { k: "demo", t: "Demo", tipo: "url" },
];
const valorCampo = (l, k) => k.split(".").reduce((o, p) => (o ? o[p] : undefined), l);
function patchCampo(l, k, valor) {
  if (k === "reuniao.data") return { reuniao: { ...(l.reuniao || {}), data: valor, status: (l.reuniao && l.reuniao.status) || "agendada" } };
  if (k.startsWith("decisor.")) return { decisor: { ...(l.decisor || {}), [k.slice(8)]: valor } };
  return { [k]: valor };
}
function filtrarBanco() {
  const f = st.filtros.banco;
  return leads().filter((l) => casa(l, f.q) && (!f.etapa || l.etapa === f.etapa) && (!f.temp || l.temperatura === f.temp) && (!f.seg || l.segmento === f.seg) && (!f.resp || l.responsavel === f.resp) && casaDecisor(l, f.dec));
}
// Filtro pela faixa do decisor: só leads de hotelaria ("sem" = decisor não pesquisado).
const casaDecisor = (l, dec) => !dec || (ehHotelaria(l) && (dec === "sem" ? !faixaDecisor(l) : faixaDecisor(l) === dec));
function gruposBanco(lista) {
  const by = st.filtros.banco.agrupar;
  const mapa = new Map();
  const chave = (l) => by === "etapa" ? l.etapa : by === "segmento" ? (l.segmento || "") : by === "temperatura" ? (l.temperatura || "") : (l.grupo || "");
  for (const l of lista) { const c = chave(l); if (!mapa.has(c)) mapa.set(c, []); mapa.get(c).push(l); }
  let chaves = [...mapa.keys()];
  if (by === "etapa") chaves.sort((a, b) => ORDEM_ETAPAS.indexOf(a) - ORDEM_ETAPAS.indexOf(b));
  else if (by === "temperatura") chaves.sort((a, b) => ["quente", "morno", "frio", ""].indexOf(a) - ["quente", "morno", "frio", ""].indexOf(b));
  else chaves.sort((a, b) => (a ? 0 : 1) - (b ? 0 : 1) || a.localeCompare(b, "pt-BR"));
  return chaves.map((c) => ({
    chave: c,
    titulo: by === "etapa" ? ETAPA[c].label : by === "temperatura" ? (rotulo(TEMPERATURAS, c) || "Sem temperatura") : (c || (by === "grupo" ? "Sem grupo" : "Sem segmento")),
    cor: by === "etapa" ? ETAPA[c].cor : by === "temperatura" ? ((TEMPERATURAS.find((t) => t.id === c) || {}).cor || "slate") : corDe(c),
    itens: mapa.get(c).sort((a, b) => String(b.criadoEm || "").localeCompare(String(a.criadoEm || "")) || (Number(b.nota) || 0) - (Number(a.nota) || 0)),
  }));
}
VIEWS.banco = () => {
  const f = st.filtros.banco;
  const v = h("div", { class: "view" });
  v.append(viewHead("Banco de Leads", "Todos os leads em tabela, agrupados por rodada. Clique numa célula para editar; clique no nome para abrir a ficha.", null, "Acompanhamento de Leads"));
  const segs = [...new Set(leads().map((l) => l.segmento).filter(Boolean))].sort();
  const corpo = h("div", { id: "banco-corpo", style: { display: "grid", gap: "14px" } });
  const atualizar = () => corpo.replaceChildren(...conteudoBanco());
  v.append(h("div", { class: "toolbar" },
    h("button", { class: "btn primary", type: "button", onclick: cadastrarLead, html: I.plus + "Cadastrar lead" }),
    buscaField("bc-q", "Pesquisar", f.q, (x) => { f.q = x; atualizar(); }),
    selectField("bc-etapa", "Filtrar por etapa", [["", "Etapa: todas"], ...ETAPAS.map((e) => [e.id, e.curto])], f.etapa, (x) => { f.etapa = x; render(true); }),
    selectField("bc-temp", "Filtrar por temperatura", [["", "Temperatura: todas"], ...TEMPERATURAS.map((t) => [t.id, t.label])], f.temp, (x) => { f.temp = x; render(true); }),
    selectField("bc-seg", "Filtrar por segmento", [["", "Segmento: todos"], ...segs.map((s) => [s, s])], f.seg, (x) => { f.seg = x; render(true); }),
    selectField("bc-dec", "Filtrar pela faixa do decisor", [["", "Decisor: todas"], ...FAIXAS_DECISOR.map((x) => [x.id, x.emoji + " " + x.label]), ["sem", "Decisor não pesquisado"]], f.dec, (x) => { f.dec = x; render(true); }),
    selectField("bc-resp", "Filtrar por responsável", [["", "Responsável: todos"], ...respList().map((r) => [r, r])], f.resp, (x) => { f.resp = x; render(true); }),
    selectField("bc-agrupar", "Agrupar por", [["grupo", "Agrupar por: grupo"], ["etapa", "Agrupar por: etapa"], ["segmento", "Agrupar por: segmento"], ["temperatura", "Agrupar por: temperatura"]], f.agrupar, (x) => { f.agrupar = x; atualizar(); }),
    botaoLimparFiltros(f, ["etapa", "temp", "seg", "resp", "dec"]),
    h("button", { class: "btn", type: "button", onclick: exportarCSV, html: I.download + "Exportar CSV" })));
  corpo.append(...conteudoBanco());
  v.append(corpo);
  return v;
};
function conteudoBanco() {
  const lista = filtrarBanco();
  const out = [];
  if (!lista.length) out.push(h("section", { class: "card empty" }, h("h2", {}, "Nenhum lead com esses filtros"), h("p", {}, "Limpe a busca ou os filtros para ver todos os leads.")));
  for (const g of gruposBanco(lista)) {
    const idG = st.filtros.banco.agrupar + ":" + g.chave;
    const aberto = !st.recolhidos.has(idG);
    const todosSel = g.itens.every((l) => st.selecionados.has(l.id));
    const selG = h("input", { type: "checkbox", "aria-label": "Selecionar todos de " + g.titulo, checked: todosSel && g.itens.length > 0, onchange: (e) => { for (const l of g.itens) e.target.checked ? st.selecionados.add(l.id) : st.selecionados.delete(l.id); render(true); } });
    const thead = h("thead", {}, h("tr", {}, h("th", { class: "sticky", scope: "col" }, h("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, selG, "Nome")), COLS_BANCO.map((c) => h("th", { scope: "col" }, c.t))));
    const tbody = h("tbody", {}, g.itens.map(linhaBanco));
    out.push(h("section", { class: "grp", "data-c": g.cor },
      h("div", { class: "grp-h" },
        h("button", { type: "button", "aria-expanded": String(aberto), onclick: () => { aberto ? st.recolhidos.add(idG) : st.recolhidos.delete(idG); gravarLocal("crm-recolhidos", [...st.recolhidos]); render(true); }, html: I.chevron + esc(g.titulo) }),
        h("span", { class: "faint num" }, g.itens.length + (g.itens.length === 1 ? " lead" : " leads"))),
      aberto ? h("div", { class: "table-wrap" }, h("table", { class: "grid" }, thead, tbody)) : null));
  }
  if (st.selecionados.size) out.push(barraMassa());
  return out;
}
function linhaBanco(l) {
  const sel = st.selecionados.has(l.id);
  const nomeTxt = contato(l) || empresaCurta(l.empresa) || "Sem nome";
  return h("tr", { "data-sel": sel },
    h("td", { class: "sticky" }, h("div", { class: "cell-first" },
      h("input", { type: "checkbox", "aria-label": "Selecionar " + nomeLead(l), checked: sel, onchange: (e) => { e.target.checked ? st.selecionados.add(l.id) : st.selecionados.delete(l.id); render(true); } }),
      h("a", { href: linkLead(l.id), class: contato(l) ? "" : "pend", title: contato(l) ? "Abrir ficha" : "Contato a confirmar — abrir ficha" }, nomeTxt))),
    COLS_BANCO.map((c) => h("td", {}, celula(l, c))));
}
function celula(l, c) {
  const val = valorCampo(l, c.k);
  const cls = "cell" + (c.wide ? " wide" : "");
  const vazio = () => h("span", { class: "faint" }, "—");
  if (c.tipo === "decisor") {
    if (!ehHotelaria(l)) return h("div", { class: cls }, vazio());
    const d = l.decisor || {};
    const nome = [d.nome, l.decisorScore ?? null].filter((x) => x !== null && x !== undefined && x !== "").join(" · ");
    return h("div", { class: cls + " decisor-cel", title: d.cargo || "" }, nome ? h("span", { class: "txt" }, nome) : null, faixaPill(l));
  }
  if (c.tipo === "ro-data") return h("div", { class: cls, title: "Cadastrado em " + fmtDia(val, true) }, val ? h("span", { class: "txt" }, fmtDia(val)) : vazio());
  if (c.tipo === "etapa" || c.tipo === "enum") {
    const conteudo = c.tipo === "etapa" ? etapaPill(val) : val ? (c.k === "temperatura" ? tempPill(val) : pill(rotulo(c.opcoes, val), val === "sim" ? "green" : "amber")) : vazio();
    const b = h("div", { class: cls + " pick", tabindex: "0", role: "button", "aria-label": c.t + ": " + (c.tipo === "etapa" ? ETAPA[val].curto : rotulo(c.opcoes || [], val) || "vazio") + ". Alterar" }, conteudo);
    const abrir = () => {
      if (c.tipo === "etapa") menu(b, ETAPAS.map((e) => ({ label: e.curto, cor: e.cor, marcado: e.id === val, onClick: () => mudarEtapa(lead(l.id), e.id) })));
      else menu(b, [...c.opcoes.map((o) => ({ label: o.label, cor: o.cor || (o.id === "sim" ? "green" : "amber"), marcado: o.id === val, onClick: () => salvar(l.id, { [c.k]: o.id }, { msg: c.t + ": " + o.label }) })), "-", { label: "Limpar", onClick: () => salvar(l.id, { [c.k]: "" }, { msg: c.t + " limpo" }) }]);
    };
    b.addEventListener("click", abrir);
    b.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
    return b;
  }
  let mostra;
  if (c.tipo === "tel") mostra = val ? [h("span", { class: "flag", "aria-hidden": "true" }, bandeiraTel(val)), h("span", { class: "txt num" }, fmtTel(val)), h("a", { class: "mini-link", href: "https://wa.me/" + waNumero(val), target: "_blank", rel: "noopener", "aria-label": "Abrir WhatsApp de " + nomeLead(l), html: I.whatsapp, style: { width: "16px", color: "#4ade80" } })] : vazio();
  else if (c.tipo === "ig") mostra = val ? [h("a", { class: "mini-link", href: igUrl(val), target: "_blank", rel: "noopener" }, "@" + handle(val))] : vazio();
  else if (c.tipo === "url") mostra = urlSegura(val) ? [h("a", { class: "mini-link", href: urlSegura(val), target: "_blank", rel: "noopener", html: I.externo + "abrir" })] : val ? h("span", { class: "txt", title: String(val) }, String(val)) : vazio();
  else if (c.tipo === "datahora") mostra = val ? dataChip(val) : vazio();
  else if (c.tipo === "segmento") mostra = val ? pill(val, corDe(val), "sq") : vazio();
  else if (c.tipo === "numero") mostra = val !== undefined && val !== null && val !== "" ? notaTag(val) : vazio();
  else mostra = val ? h("span", { class: "txt", title: String(val) }, String(val)) : vazio();
  const box = h("div", { class: cls + " edit", tabindex: "0", role: "button", "aria-label": c.t + ": " + (val ? String(c.tipo === "datahora" ? fmtDiaHora(val) : val) : "vazio") + ". Editar" }, mostra);
  const editar = (e) => {
    if (e && e.target.closest && e.target.closest("a")) return;
    st.editando = true;
    if (c.tipo === "datahora") {
      box.classList.add("abrindo");
      popData(box, paraInputDataHora(val), (novo) => {
        const iso = deInputDataHora(novo);
        if (iso === (val || "") || (!iso && !val)) return;
        salvar(l.id, patchCampo(l, c.k, iso), { msg: c.t + (iso ? ": " + fmtDiaHora(iso) : " removida"), desfazer: true });
      }, () => { st.editando = false; box.classList.remove("abrindo"); render(true); });
      return;
    }
    const tipoInput = c.tipo === "numero" ? "number" : c.tipo === "datahora" ? "datetime-local" : c.tipo === "url" ? "url" : c.tipo === "tel" ? "tel" : "text";
    const dl = c.lista ? h("datalist", { id: "dl-" + c.k }, c.lista().map((x) => h("option", { value: x }))) : null;
    const inp = h("input", { type: tipoInput, "aria-label": c.t, list: dl ? "dl-" + c.k : null, value: c.tipo === "datahora" ? paraInputDataHora(val) : (val ?? ""), ...(c.tipo === "numero" ? { min: "0", max: "10", step: "1" } : {}) });
    box.replaceChildren(inp, dl || "");
    inp.focus(); if (inp.select && tipoInput !== "datetime-local") inp.select();
    let feito = false;
    const fim = (gravar) => {
      if (feito) return; feito = true; st.editando = false;
      if (!gravar) { render(true); return; }
      let novo = inp.value.trim();
      if (c.tipo === "numero") novo = novo === "" || isNaN(Number(novo)) ? null : Math.max(0, Math.min(10, Math.round(Number(novo))));
      if (c.tipo === "datahora") novo = deInputDataHora(novo);
      if (c.tipo === "ig") novo = handle(novo);
      const antes = c.tipo === "datahora" ? (val || "") : (val ?? (c.tipo === "numero" ? null : ""));
      if (novo === antes || (novo === "" && !antes)) { render(true); return; }
      salvar(l.id, patchCampo(l, c.k, novo), { msg: c.t + " salvo", desfazer: true });
    };
    inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); fim(true); } if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); fim(false); } });
    inp.addEventListener("blur", () => fim(true));
  };
  box.addEventListener("click", editar);
  box.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target === box) { e.preventDefault(); editar(); } });
  return box;
}
async function iniciarCadenciaMassa(ids) {
  const alvos = ids.map(lead).filter((l) => l && !cadAtiva(l));
  const jaEm = ids.length - alvos.length;
  const sem = alvos.filter((l) => !l.instagram && !l.whatsapp).length;
  if (!alvos.length) { toast("Os leads selecionados já estão em cadência."); return; }
  const ok = await confirmar({ titulo: "Iniciar a cadência para " + alvos.length + " lead(s)?", texto: "Cada lead entra no Fluxo de Cadência no 1º template. Nada é enviado sem o seu clique." + (sem ? ` ${sem} sem Instagram nem WhatsApp serão pulados.` : "") + (jaEm ? ` ${jaEm} já em cadência ficam como estão.` : ""), ok: "Iniciar cadência" });
  if (!ok) return render(true);
  st.selecionados.clear();
  const res = await Promise.all(alvos.map((l) => mudarEtapa(l, "cadencia", { silencioso: true, semConfirmar: true })));
  const n = res.filter(Boolean).length;
  toast(n + (n === 1 ? " lead entrou" : " leads entraram") + " na cadência");
  render(true);
}
function barraMassa() {
  const ids = [...st.selecionados].filter((id) => st.raw.has(id));
  const n = ids.length;
  const etapaSel = selectField("massa-etapa", "Mover selecionados para a etapa", [["", "Mover etapa…"], ...ETAPAS.filter((e) => !["reuniao", "ganho"].includes(e.id)).map((e) => [e.id, e.curto])], "", async (x) => {
    if (!x) return;
    let opts = { silencioso: true };
    if (x === "encerrado") { const r = await modalEncerrar(null); if (!r) return render(true); opts.encerramento = r; }
    if (x === "cadencia") {
      const sem = ids.filter((id) => !lead(id).instagram && !lead(id).whatsapp).length;
      const ok = await confirmar({ titulo: "Iniciar a cadência para " + n + " lead(s)?", texto: "Cada lead entra no Fluxo de Cadência no 1º template." + (sem ? ` ${sem} sem Instagram nem WhatsApp serão pulados.` : ""), ok: "Iniciar cadência" });
      if (!ok) return render(true); opts.semConfirmar = true;
    }
    st.selecionados.clear();
    const res = await Promise.all(ids.map((id) => mudarEtapa(lead(id), x, opts)));
    const ok = res.filter(Boolean).length;
    toast(ok + " lead(s) movidos para " + ETAPA[x].curto); render(true);
  });
  const tempSel = selectField("massa-temp", "Mudar temperatura dos selecionados", [["", "Temperatura…"], ...TEMPERATURAS.map((t) => [t.id, t.label])], "", async (x) => {
    if (!x) return;
    st.selecionados.clear();
    const ok = await salvarVarios(ids, () => ({ temperatura: x }));
    if (ok) toast(ok + " lead(s): temperatura " + rotulo(TEMPERATURAS, x));
    render(true);
  });
  return h("div", { class: "bulk", role: "region", "aria-label": "Ações em massa" },
    h("b", {}, n + (n === 1 ? " selecionado" : " selecionados")),
    h("button", { class: "btn primary sm", type: "button", onclick: () => iniciarCadenciaMassa(ids), html: I.cadencia + "Iniciar cadência" }),
    etapaSel, tempSel,
    h("button", { class: "btn sm", type: "button", onclick: async () => {
      const grupos = [...new Set(leads().map((l) => l.grupo).filter(Boolean))];
      const inp = h("input", { id: "massa-grupo", list: "dl-grupos", required: true, placeholder: "Ex.: Restaurantes · Recife · nov/26" });
      const r = await modal({ titulo: "Mudar grupo", sub: n + " lead(s) selecionados", ok: "Mudar grupo", largura: 460,
        corpo: h("label", { class: "f", for: "massa-grupo" }, "Grupo (rodada)", inp, h("datalist", { id: "dl-grupos" }, grupos.map((g) => h("option", { value: g })))),
        aoConfirmar: () => { if (!inp.value.trim()) throw new Error("Escreva o nome do grupo."); return inp.value.trim(); } });
      if (!r) return;
      st.selecionados.clear();
      const ok = await salvarVarios(ids, () => ({ grupo: r }));
      if (ok) toast(ok + " lead(s) no grupo " + r);
      render(true);
    } }, "Mudar grupo"),
    h("button", { class: "btn ghost sm", type: "button", onclick: () => { st.selecionados.clear(); render(true); } }, "Limpar seleção"),
    h("span", { class: "hint" }, "Conversa e Ganho pedem dados de cada lead: mova pela ficha ou pelo kanban."));
}
function exportarCSV() {
  const lista = filtrarBanco();
  const cols = [["Nome", (l) => l.nome], ["Empresa", (l) => l.empresa], ["Responsável", (l) => l.responsavel], ["Status do lead", (l) => ETAPA[l.etapa].curto], ["Abertura do lead", (l) => diaLocal(l.criadoEm)],
    ["Data da conversa", (l) => (l.reuniao && l.reuniao.data ? paraInputDataHora(l.reuniao.data).replace("T", " ") : "")], ["Telefone", (l) => fmtTel(l.whatsapp)], ["Instagram (@)", (l) => handle(l.instagram)],
    ["E-mail", (l) => l.email], ["E-mail do estabelecimento", (l) => l.emailEmpresa], ["E-mail do decisor", (l) => (l.decisor || {}).email], ["Cargo", (l) => l.cargo], ["Segmento", (l) => l.segmento], ["Decisor", (l) => (l.decisor || {}).nome], ["Score do decisor", (l) => l.decisorScore], ["Faixa do decisor", (l) => (FAIXA_DECISOR[faixaDecisor(l)] || {}).label], ["Pode citar a indicação?", (l) => rotulo(CITAR, l.podeCitarIndicacao)], ["Informação adicional", (l) => l.infoAdicional],
    ["Nota", (l) => l.nota], ["Temperatura", (l) => rotulo(TEMPERATURAS, l.temperatura)], ["Localização", (l) => l.localizacao], ["Grupo", (l) => l.grupo],
    ["Origem", (l) => rotulo(ORIGENS, l.origem)], ["Detalhe da origem", (l) => l.origemDetalhe], ["Valor estimado", (l) => l.valorEstimado], ["Próxima ação", (l) => (l.proximaAcao ? l.proximaAcao.texto : "")],
    ["Prazo da próxima ação", (l) => (l.proximaAcao && l.proximaAcao.ate ? paraInputDataHora(l.proximaAcao.ate).replace("T", " ") : "")], ["Site atual", (l) => l.site], ["Demo", (l) => l.demo]];
  const cel = (v) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // o Excel leria "=…", "+…", "@…" como fórmula
    return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = "\uFEFF" + [cols.map((c) => c[0]).join(";"), ...lista.map((l) => cols.map((c) => cel(c[1](l))).join(";"))].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = h("a", { href: url, download: "crm-leads-" + hojeISO() + ".csv" });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(lista.length + " lead(s) exportados para CSV");
}

/* ================= Modais de etapa ================= */
// Campo de data e hora dos modais: um botão com o resumo ("qua, 15 out · 10:30") que abre o seletor embutido.
// Devolve [elemento, input oculto]; o input guarda o valor no formato "AAAA-MM-DDTHH:MM" (como o datetime-local).
function campoDataHora(id, label, valor, req = true) {
  const i = h("input", { id, type: "hidden", value: paraInputDataHora(valor) });
  const resumo = h("span", { class: "dp-campo-txt" });
  let aberto = false, sel = null;
  const painel = h("div", { class: "dp-embutido", id: id + "-dp", hidden: true });
  const botao = h("button", { type: "button", class: "dp-campo", "aria-expanded": "false", "aria-controls": id + "-dp", onclick: () => {
    aberto = !aberto; botao.setAttribute("aria-expanded", String(aberto)); painel.hidden = !aberto;
    if (aberto && !sel) { sel = seletorData({ valor: i.value, aoMudar: (v) => { i.value = v; pintar(); } }); painel.append(sel.el); }
  } }, h("span", { class: "dp-campo-ic", html: I.agenda }), resumo, h("span", { class: "dp-campo-seta", "aria-hidden": "true" }, "▾"));
  function pintar() { resumo.textContent = i.value ? resumoData(i.value) : "Escolher data e hora"; botao.classList.toggle("vazio", !i.value); }
  const limpar = req ? null : h("button", { type: "button", class: "btn ghost sm", onclick: () => { i.value = ""; if (sel) sel.limpar(); pintar(); } }, "Limpar");
  pintar();
  const el = h("div", { class: "f" }, h("span", { class: "f-rot" }, label, req ? h("span", { class: "req" }, " *") : null), h("div", { class: "dp-campo-linha" }, botao, limpar), painel, i);
  return [el, i];
}
function proximoDiaUtil9h() { return somarDiasUteis(new Date(), 1).toISOString(); }
function modalConversa(l, { titulo = "Marcar conversa de diagnóstico", ok = "Marcar conversa" } = {}) {
  const [lab, inp] = campoDataHora("conv-data", "Data e hora da conversa", (l && l.reuniao && l.reuniao.data) || "");
  return modal({ titulo, sub: l ? nomeLead(l) + " vai para Conversa de diagnóstico. Se a cadência estiver ativa, ela para (o lead respondeu)." : null, ok, largura: 440,
    corpo: lab, aoConfirmar: () => { if (!inp.value) throw new Error("Informe a data e a hora da conversa."); return { data: deInputDataHora(inp.value) }; } });
}
function modalEncerrar(l, motivoPadrao) {
  const sel = h("select", { id: "enc-motivo", required: true }, h("option", { value: "" }, "Escolha o motivo"), MOTIVOS.map((m) => h("option", { value: m.id }, m.label)));
  sel.value = motivoPadrao || "";
  const obs = h("textarea", { id: "enc-obs", placeholder: "Opcional: o que aconteceu, quando vale retomar…" });
  return modal({ titulo: "Encerrar lead", sub: l ? nomeLead(l) + " vai para Encerrados." + (cadAtiva(l) ? " A cadência ativa será encerrada." : "") : "Os leads selecionados vão para Encerrados.", ok: "Encerrar", perigo: true, largura: 460,
    corpo: h("div", { style: { display: "grid", gap: "12px" } }, h("label", { class: "f", for: "enc-motivo" }, h("span", {}, "Motivo", h("span", { class: "req" }, " *")), sel), h("label", { class: "f", for: "enc-obs" }, "Observação", obs)),
    aoConfirmar: () => { if (!sel.value) throw new Error("Escolha o motivo do encerramento."); return { motivo: sel.value, obs: obs.value.trim() }; } });
}
function modalGanho(l) {
  const padrao = Number(l.valor) || (PACOTES[l.pacote] ? PACOTES[l.pacote].preco : 0) || Number(l.valorEstimado) || 797;
  const val = h("input", { id: "gan-valor", type: "number", min: "0", step: "1", value: padrao, required: true });
  const ent = h("input", { id: "gan-entrada", type: "checkbox", checked: !!l.entradaPaga });
  return modal({ titulo: "Marcar como ganho 🎉", sub: nomeLead(l) + " vira cliente e aparece na aba Clientes (Em construção).", ok: "Marcar como ganho", largura: 460,
    corpo: h("div", { style: { display: "grid", gap: "12px" } },
      h("label", { class: "f", for: "gan-valor" }, h("span", {}, "Valor fechado (R$)", h("span", { class: "req" }, " *")), val, h("span", { class: "hint" }, "Padrão: preço do pacote (landing R$ 797, institucional R$ 997).")),
      h("label", { class: "check", for: "gan-entrada" }, ent, h("span", {}, "A entrada (50%) já foi paga"))),
    aoConfirmar: () => { const v = Number(val.value); if (!(v > 0)) throw new Error("Informe o valor fechado."); return { valor: v, entradaPaga: ent.checked }; } });
}

/* ================= Cadastrar lead ================= */
function camposLead(l = {}, novo = false) {
  const inputs = {};
  const campo = (k, label, tipo = "text", { opcoes, full, req, hint, attrs = {} } = {}) => {
    let el;
    const atual = valorCampo(l, k);
    const inicial = Array.isArray(atual) ? atual.join("\n") : atual ?? "";
    if (tipo === "select") { el = h("select", { id: "fl-" + k }, opcoes.map(([v, t]) => h("option", { value: v }, t))); el.value = inicial; }
    else if (tipo === "textarea") { el = h("textarea", { id: "fl-" + k }); el.value = inicial; }
    else el = h("input", { id: "fl-" + k, type: tipo, value: inicial, ...attrs });
    inputs[k] = el;
    return h("label", { class: "f" + (full ? " full" : ""), for: "fl-" + k }, h("span", {}, label, req ? h("span", { class: "req" }, " *") : null), el, hint ? h("span", { class: "hint" }, hint) : null);
  };
  const origemOpts = [["", "—"], ...ORIGENS.map((o) => [o.id, o.label])];
  const grid = h("div", { class: "fgrid" },
    campo("nome", "Nome do contato", "text", { req: novo, hint: novo ? "Ou preencha só a empresa, se ainda não souber o nome." : null }), campo("empresa", "Empresa"),
    campo("whatsapp", "Telefone / WhatsApp", "tel", { attrs: { placeholder: "(84) 99999-9999" } }), campo("instagram", "Instagram (@)", "text", { attrs: { placeholder: "@perfil" } }),
    campo("email", ehHotelaria(l) ? "E-mail do contato" : "E-mail", "email"), campo("cargo", "Cargo"),
    ...(ehHotelaria(l) ? [campo("emailEmpresa", "E-mail do estabelecimento", "email", { hint: "Geral (reservas@, info@…), publicado pelo próprio estabelecimento" })] : []),
    campo("origem", "Canal de origem", "select", { opcoes: origemOpts }), campo("origemDetalhe", "Detalhe da origem", "text", { attrs: { placeholder: "Quem indicou, post, evento…" } }),
    campo("podeCitarIndicacao", "Pode citar a indicação?", "select", { opcoes: [["", "—"], ...CITAR.map((c) => [c.id, c.label])] }), campo("responsavel", "Responsável"),
    campo("segmento", "Segmento"), campo("localizacao", "Localização (Cidade/UF)", "text", { attrs: { placeholder: "Natal/RN" } }),
    campo("valorEstimado", "Valor estimado (R$)", "number", { attrs: { min: "0", step: "1" } }), campo("temperatura", "Temperatura", "select", { opcoes: [["", "Pela nota"], ...TEMPERATURAS.map((t) => [t.id, t.label])] }),
    campo("grupo", "Grupo (rodada)", "text", { attrs: { list: "dl-grupos-f" } }),
    ...(novo ? [] : [campo("nota", "Nota (0–10)", "number", { attrs: { min: "0", max: "10", step: "1" } }), campo("pacote", "Pacote", "select", { opcoes: [["", "—"], ["landing", "Landing (R$ 797)"], ["institucional", "Institucional (R$ 997)"]] }),
      campo("site", "Site atual", "url"), campo("demo", "Link da demo", "url"), campo("seguidores", "Seguidores", "number", { attrs: { min: "0" } }),
      campo("gancho", "Gancho (usado em {gancho})", "text", { full: true }), campo("problema", ehHotelaria(l) ? "Frase da busca pelo nome (usada em {problema})" : "Problema do site (usado em {problema})", "text", { full: true })]),
    ...(!novo && ehHotelaria(l) ? [...camposDecisor(campo, l), ...camposRaioX(campo)] : []),
    campo("necessidade", "Necessidade percebida", "textarea", { full: true }),
    ...(novo ? [] : [campo("infoAdicional", "Informação adicional", "text", { full: true }),
      campo("mensagemProxima", "Mensagem personalizada do próximo template", "textarea", { full: true, hint: "Se preenchida, substitui o template do passo atual da cadência e é limpa ao enviar." })]),
    campo("notas", "Observações", "textarea", { full: true }),
    h("datalist", { id: "dl-grupos-f" }, [...new Set(leads().map((x) => x.grupo).filter(Boolean))].map((g) => h("option", { value: g }))));
  const ler = () => {
    const out = {};
    for (const [k, el] of Object.entries(inputs)) {
      let v = el.value.trim();
      if (el.type === "number") v = v === "" ? null : Number(v);
      if (k === "instagram") v = handle(v);
      out[k] = v;
    }
    juntarDecisor(out, l);
    return out;
  };
  return { grid, ler, inputs };
}
// Campos do decisor (hotelaria): "decisor.<campo>" no formulário, gravados como o objeto decisor.
const vazioDec = (v) => v === "" || v === null || v === undefined || (Array.isArray(v) && !v.length);
function juntarDecisor(out, l) {
  const chaves = Object.keys(out).filter((k) => k.startsWith("decisor."));
  if (!chaves.length) return;
  const dec = { ...(l.decisor || {}) };
  for (const k of chaves) {
    const c = k.slice("decisor.".length);
    let v = out[k]; delete out[k];
    if (c === "socios") v = String(v || "").split("\n").map((x) => x.trim()).filter(Boolean);
    if (vazioDec(v) && vazioDec(dec[c])) continue; // vazio continua como estava (null não vira "")
    dec[c] = vazioDec(v) ? (c === "socios" ? [] : null) : v;
  }
  if (l.decisor || Object.keys(dec).length) out.decisor = dec;
}
function camposDecisor(campo, l) {
  const d = l.decisor || {};
  const canais = [["", "—"], ...CANAIS_DECISOR.map((c) => [c.id, c.label]), ...(d.canal && !CANAIS_DECISOR.some((c) => c.id === d.canal) ? [[d.canal, d.canal]] : [])];
  return [
    h("div", { class: "full fsec" }, h("b", {}, "Decisor"), h("span", { class: "hint" }, " · preenchido pela Dora Decisora; a faixa sai da nota")),
    campo("decisor.nome", "Nome do decisor"), campo("decisor.cargo", "Cargo do decisor"),
    campo("decisor.prioridade", "Prioridade (1 a 4)", "number", { attrs: { min: "1", max: "4", step: "1" }, hint: "1 dono · 2 gerente geral · 3 comercial/marketing · 4 recepção" }),
    campo("decisorScore", "Nota do decisor (0–100)", "number", { attrs: { min: "0", max: "100", step: "1" }, hint: "≥ 80 prospectar · 50–79 enriquecer · < 50 não priorizar" }),
    campo("decisor.canal", "Canal de acesso", "select", { opcoes: canais }), campo("decisor.contato", "Contato do canal", "text", { attrs: { placeholder: "Número, @ ou e-mail" } }),
    campo("decisor.rota", "Rota até o decisor", "text", { full: true }),
    campo("decisor.instagram", "Instagram do decisor"), campo("decisor.linkedin", "LinkedIn do decisor"),
    campo("decisor.email", "E-mail do decisor", "email"), campo("decisor.telefone", "Telefone do decisor", "tel"),
    campo("decisor.socios", "Sócios (CNPJ)", "textarea", { full: true, hint: "Um por linha, ex.: Maria Silva (sócia-administradora)" }),
    campo("razaoSocial", "Razão social"), campo("cnpj", "CNPJ"),
    campo("decisor.fonte", "Fonte (arquivo da verificação ou link)", "text", { full: true }),
  ];
}
// Campos do Raio-X da Reserva Direta (só na edição de leads de hotelaria). Percentuais de 0 a 100.
function camposRaioX(campo) {
  const pct = (k, label, padrao) => campo(k, label, "number", { attrs: { min: "0", max: "100", step: "0.1", ...(padrao ? { placeholder: String(padrao) } : {}) }, hint: padrao ? "Vazio = " + padrao + "%" : null });
  return [
    h("div", { class: "full fsec" }, h("b", {}, "Raio-X da Reserva Direta"), h("span", { class: "hint" }, " · os números da conta de comissão")),
    campo("quartos", "Quartos", "number", { attrs: { min: "0", step: "1" } }), campo("diariaMedia", "Diária média (R$)", "number", { attrs: { min: "0", step: "1" } }),
    pct("ocupacao", "Ocupação média (%)"), campo("plano", "Plano indicado", "select", { opcoes: [["", "—"], ...PLANOS_HOTELARIA.map((p) => [p, p])] }),
    pct("pctBooking", "Reservas pela Booking (%)"), pct("taxaBooking", "Taxa da Booking (%)", TAXAS_PADRAO.booking),
    pct("pctAirbnb", "Reservas pelo Airbnb (%)"), pct("taxaAirbnb", "Taxa do Airbnb (%)", TAXAS_PADRAO.airbnb),
    campo("buscaNome", "Busca pelo nome no Google (o que aparece)", "text", { full: true, attrs: { placeholder: "Ex.: o primeiro resultado é o anúncio da Booking" } }),
    campo("buscaNomePrint", "Print da busca (caminho ou URL)", "text", { full: true, attrs: { placeholder: "saidas/raiox/<slug>-busca.png" } }),
  ];
}
async function cadastrarLead() {
  const { grid, ler, inputs } = camposLead({ responsavel: "Pedro", origem: "" }, true);
  const r = await modal({ titulo: "Cadastrar lead", sub: "O lead entra como Novo lead.", ok: "Cadastrar lead", largura: 720, corpo: grid,
    aoConfirmar: async () => {
      const d = ler();
      if (!d.nome && !d.empresa) { inputs.nome.focus(); throw new Error("Preencha o nome do contato ou a empresa."); }
      if (!st.loaded.leads) throw new Error("Os leads ainda estão carregando. Tente de novo em instantes.");
      let id = d.instagram ? d.instagram.toLowerCase().replace(/[^a-z0-9_.]/g, "") : "";
      if (id && st.raw.has(id)) throw new Error("Já existe um lead com esse Instagram: " + nomeLead(lead(id)) + ".");
      // mesmo WhatsApp em outro lead: avisa uma vez; clicar de novo cadastra assim mesmo
      const tel = waNumero(d.whatsapp);
      const dup = tel && leads().find((x) => waNumero(x.whatsapp) === tel);
      if (dup && inputs.whatsapp.dataset.avisado !== tel) { inputs.whatsapp.dataset.avisado = tel; inputs.whatsapp.focus(); throw new Error("Este WhatsApp já está em " + nomeLead(dup) + ". Clique em Cadastrar lead de novo para cadastrar mesmo assim."); }
      if (!id) id = (slugify(d.nome || d.empresa) || "lead") + "-" + Math.random().toString(36).slice(2, 6);
      const agora = agoraISO();
      const doc = Object.fromEntries(Object.entries(d).filter(([, v]) => v !== "" && v !== null));
      if (!doc.temperatura) delete doc.temperatura;
      const [cidade, uf] = String(d.localizacao || "").split("/").map((x) => x.trim());
      Object.assign(doc, { nome: d.nome || "", responsavel: d.responsavel || "Pedro", origem: d.origem || "outro", segmento: d.segmento || "", nicho: d.segmento || "", cidade: cidade || "", uf: uf || "",
        etapa: "novo_lead", status: "novo", toque: 0, criadoEm: agora, atualizadoEm: agora, datas: { novo_lead: hojeISO() }, historico: [histItem("Lead cadastrado no CRM", "sistema")] });
      try { await mutacao("docs:create", { collection: "leads", id, data: doc }); }
      catch (e) { throw new Error(/documento_ja_existe/.test(String(e && (e.data || e.message))) ? "Já existe um lead com esse Instagram (cadastrado agora há pouco)." : "Não foi possível cadastrar. Confira a conexão."); }
      st.base.set(id, doc); st.raw.set(id, doc); mexeu();
      return id;
    } });
  if (r) { toast("Lead cadastrado"); irPara(linkLead(r)); }
}

/* ================= Ficha do lead ================= */
VIEWS.lead = () => {
  const l = lead(st.rota.id);
  const v = h("div", { class: "view" });
  if (!l) {
    v.append(h("a", { class: "back", href: "#/" + (st.voltarPara || "kanban"), html: I.voltar + "Voltar" }),
      h("section", { class: "card empty" }, h("h2", {}, st.loaded.leads ? "Lead não encontrado" : "Carregando…"), st.loaded.leads ? h("p", {}, "Ele pode ter sido excluído. Volte para o Kanban ou use a busca (⌘K).") : null));
    return v;
  }
  const maisBtn = h("button", { class: "btn sm", type: "button", "aria-label": "Mais ações", "aria-haspopup": "menu", html: I.mais });
  maisBtn.addEventListener("click", () => menu(maisBtn, [
    ...(l.instagram ? [{ label: "Abrir Instagram", onClick: () => window.open(igUrl(l.instagram), "_blank", "noopener") }] : []),
    ...(l.whatsapp ? [{ label: "Abrir WhatsApp", onClick: () => window.open("https://wa.me/" + waNumero(l.whatsapp), "_blank", "noopener") }] : []),
    { label: "Editar dados", onClick: () => editarDados(l) },
    "-",
    { label: "Excluir lead", perigo: true, onClick: () => excluirLead(l) },
  ]));
  v.append(h("div", { class: "lead-head" },
    h("a", { class: "back", href: "#/" + (st.voltarPara || "kanban"), html: I.voltar + "Voltar para " + TITULOS[st.voltarPara || "kanban"] }),
    h("div", { class: "lead-title" },
      h("div", { style: { minWidth: 0 } }, h("div", { class: "eyebrow" }, "Ficha do lead"), h("h1", {}, l.empresa || l.nome || "Sem nome"),
        h("div", { class: "lead-sub" }, etapaPill(l.etapa), tempPill(l.temperatura), notaTag(l.nota),
          contato(l) ? h("span", {}, contato(l) + (l.cargo ? " · " + l.cargo : "")) : h("span", { class: "faint" }, "Contato a confirmar"),
          l.instagram ? h("a", { href: igUrl(l.instagram), target: "_blank", rel: "noopener" }, "@" + handle(l.instagram)) : null)),
      h("div", { class: "head-actions" },
        h("button", { class: "btn sm", type: "button", onclick: () => registrarLigacao(l), html: I.telefone + "Registrar ligação" }),
        h("button", { class: "btn sm", type: "button", onclick: () => leadRespondeu(l), html: I.chat + "Lead respondeu" }),
        h("button", { class: "btn sm", type: "button", onclick: () => abrirRoteiro(l), html: I.roteiro + "Roteiro" }),
        h("button", { class: "btn sm", type: "button", onclick: () => abrirObjecoes(l), html: I.objecoes + "Objeções" }),
        maisBtn)),
    barraEtapas(l)));
  v.append(h("div", { class: "lead-grid" },
    h("div", {}, blocoDados(l), ehHotelaria(l) ? blocoDecisor(l) : null, ehHotelaria(l) ? blocoSinais(l) : null, ehHotelaria(l) ? blocoRaioX(l) : null, blocoCadencia(l), l.etapa === "ganho" ? blocoCliente(l) : null, blocoDiagnostico(l)),
    h("div", {}, blocoProximaAcao(l), blocoLinhaDoTempo(l))));
  return v;
};
function barraEtapas(l) {
  const idx = ORDEM_ETAPAS.indexOf(l.etapa);
  return h("nav", { class: "stagebar", "aria-label": "Etapas (clique para mudar)" }, ETAPAS.map((e, i) =>
    h("button", { class: "stage", type: "button", "data-st": e.id === l.etapa ? "cur" : i < idx && l.etapa !== "encerrado" ? "done" : "", "data-end": e.id, "aria-current": e.id === l.etapa ? "step" : null, title: e.label, onclick: () => mudarEtapa(lead(l.id), e.id) }, e.curto)));
}
function dlItem(rotuloTxt, valor, { full, pend } = {}) {
  const vazio = valor === undefined || valor === null || valor === "" || (Array.isArray(valor) && !valor.length);
  return h("div", { class: full ? "full" : "" }, h("dt", {}, rotuloTxt), h("dd", { class: vazio ? "pend" : "" }, vazio ? (pend || "—") : valor));
}
function blocoDados(l) {
  const link = (href, txt) => (href ? h("a", { href, target: "_blank", rel: "noopener" }, txt) : txt);
  const primeiro = (l.primeiraLigacao && l.primeiraLigacao.em) || l.datas.primeiro_contato;
  return cardSec("Dados do lead", "banco", h("dl", { class: "dl" },
    dlItem("Contato", contato(l) ? contato(l) + (l.cargo ? " · " + l.cargo : "") : "", { pend: "A confirmar" }),
    dlItem("Empresa", l.empresa),
    dlItem("WhatsApp", l.whatsapp ? link("https://wa.me/" + waNumero(l.whatsapp), bandeiraTel(l.whatsapp) + " " + fmtTel(l.whatsapp)) : ""),
    dlItem("Instagram", l.instagram ? link(igUrl(l.instagram), "@" + handle(l.instagram)) : ""),
    dlItem(ehHotelaria(l) ? "E-mail do contato" : "E-mail", l.email ? link("mailto:" + l.email, l.email) : ""),
    ehHotelaria(l) || l.emailEmpresa ? dlItem("E-mail do estabelecimento", l.emailEmpresa ? h("span", {}, link("mailto:" + l.emailEmpresa, l.emailEmpresa),
      l.emailEmpresaFonte ? h("a", { class: "faint", href: urlSegura(l.emailEmpresaFonte), target: "_blank", rel: "noopener", style: { marginLeft: "8px", fontSize: "12px" } }, "fonte") : null) : "", { pend: "Não encontrado" }) : null,
    dlItem("Site atual", l.site ? link(urlSegura(l.site), semProtocolo(l.site)) : "", { pend: "Não tem site" }),
    dlItem("Demo", l.demo ? link(urlSegura(l.demo), semProtocolo(l.demo)) : ""),
    dlItem("Seguidores", l.seguidores ? Number(l.seguidores).toLocaleString("pt-BR") : ""),
    dlItem("Nota (auditoria)", notaTag(l.nota)),
    dlItem("Temperatura", tempPill(l.temperatura)),
    dlItem("Pacote", PACOTES[l.pacote] ? PACOTES[l.pacote].label + " · " + brl(PACOTES[l.pacote].preco) : ""),
    dlItem("Valor estimado", l.valorEstimado ? brl(l.valorEstimado) : ""),
    dlItem("Segmento", l.segmento),
    dlItem("Localização", l.localizacao),
    dlItem("Origem", l.origem ? rotulo(ORIGENS, l.origem) + (l.origemDetalhe ? " · " + l.origemDetalhe : "") : ""),
    l.origem === "indicacao" ? dlItem("Pode citar a indicação?", rotulo(CITAR, l.podeCitarIndicacao)) : null,
    dlItem("Responsável", l.responsavel),
    dlItem("Grupo", l.grupo),
    dlItem("Primeiro contato", primeiro ? fmtDia(primeiro, true) : ""),
    dlItem("Cadastrado em", l.criadoEm ? fmtDia(l.criadoEm, true) : ""),
    dlItem("Necessidade percebida", l.necessidade, { full: true }),
    l.gancho ? dlItem("Gancho", l.gancho, { full: true }) : null,
    l.problema ? dlItem("Problema do site", l.problema, { full: true }) : null,
    l.infoAdicional ? dlItem("Informação adicional", l.infoAdicional, { full: true }) : null,
    l.notas ? dlItem("Observações", l.notas, { full: true }) : null,
    l.dossie ? dlItem("Dossiê", h("code", { style: { fontSize: "12px" } }, l.dossie), { full: true }) : null),
    h("button", { class: "btn sm", type: "button", onclick: () => editarDados(l) }, "Editar"));
}
/* Decisor (hotelaria): quem decide, por qual canal e com que prova (Dora Decisora + verificar-decisor.mjs). */
const rotuloCanalDec = (c) => (CANAIS_DECISOR.find((x) => x.id === c) || {}).label || c || "";
// Mensagem de encaminhamento com {empresa} e, se houver, o nome do decisor (ou do 1º sócio) no lugar do colchete.
function textoEncaminhamento(l) {
  const d = l.decisor || {};
  const nome = primeiroNome(d.nome || String((d.socios || [])[0] || "").replace(/\s*\(.*$/, ""));
  const t = preencher(ENCAMINHAMENTO_HOTELARIA.texto, l);
  return nome ? t.replace(/\[nome do sócio ou gerente[^\]]*\]/, nome) : t;
}
function copiarEncaminhamento(l) {
  const t = textoEncaminhamento(l);
  try { navigator.clipboard.writeText(t).then(() => toast(colchetes(t).length ? "Mensagem copiada: complete o trecho entre colchetes" : "Mensagem de encaminhamento copiada"), () => toast("Não deu para copiar.", { ruim: true })); }
  catch (e) { toast("Não deu para copiar.", { ruim: true }); }
}
function blocoDecisor(l) {
  const d = l.decisor || {};
  const faixa = faixaDecisor(l);
  const fonte = String(d.fonte || "").trim();
  const link = (v, href) => (v ? h("a", { href, target: "_blank", rel: "noopener" }, v) : "");
  const contatos = [
    d.instagram ? link("@" + handle(d.instagram), igUrl(d.instagram)) : null,
    d.linkedin ? link("LinkedIn", urlSegura(d.linkedin)) : null,
    d.telefone ? h("span", {}, fmtTel(d.telefone)) : null,
  ].filter(Boolean);
  const comVirgulas = (itens) => itens.flatMap((x, i) => (i ? [" · ", x] : [x]));
  const socios = Array.isArray(d.socios) ? d.socios : d.socios ? [d.socios] : [];
  const corpo = h("div", { style: { display: "grid", gap: "14px" } },
    faixa ? null : h("p", { class: "faint", style: { margin: 0 } }, "Decisor não pesquisado: rode a Dora Decisora e o verificar-decisor.mjs antes da cadência."),
    h("dl", { class: "dl" },
      dlItem("Decisor", d.nome, { pend: "Não identificado" }),
      dlItem("Cargo", d.cargo ? d.cargo + (PRIORIDADES_DECISOR[d.prioridade] ? " · prioridade " + d.prioridade : "") : ""),
      dlItem("Canal", d.canal ? rotuloCanalDec(d.canal) + (d.contato ? " · " + d.contato : "") : d.contato || ""),
      dlItem("E-mail do decisor", d.email ? link(d.email, "mailto:" + d.email) : "", { pend: "Não encontrado" }),
      dlItem("Contatos do decisor", contatos.length ? comVirgulas(contatos) : ""),
      d.rota ? dlItem("Rota", d.rota, { full: true }) : null,
      dlItem("Sócios (CNPJ)", socios.length ? socios.join(" · ") : "", { full: true }),
      dlItem("Razão social", l.razaoSocial), dlItem("CNPJ", l.cnpj),
      dlItem("Fonte", fonte ? (/^https?:\/\//i.test(fonte) ? link(semProtocolo(fonte), fonte) : h("code", { style: { fontSize: "12px" } }, fonte)) : "", { full: true })));
  const botoes = h("div", { class: "more", style: { flexWrap: "wrap" } },
    faixa === "enriquecer" ? h("button", { class: "btn primary sm", type: "button", onclick: () => copiarEncaminhamento(l), html: I.copiar + "Copiar mensagem de encaminhamento" }) : null,
    faixa === "nao_priorizar" ? h("button", { class: "btn sm", type: "button", onclick: () => abrirRoteiro(l), html: I.roteiro + "Roteiro da recepção" }) : null,
    h("button", { class: "btn sm", type: "button", onclick: () => editarDados(l) }, "Editar"));
  corpo.append(botoes);
  return cardSec("Decisor", "clientes", corpo, faixaPill(l));
}
/* Sinais de compra e diagnóstico gratuito (hotelaria): gerados por ferramentas/diagnostico/ (sinais.mjs e gerar-diagnostico.mjs). */
const COR_SINAL = { forte: "red", media: "amber", fraca: "slate" };
const RESERVA_DIRETA = { motor: "motor de reservas", manda_para_ota: "site manda para a plataforma", whatsapp_e_ota: "site manda para plataforma e WhatsApp", so_whatsapp: "só WhatsApp", sem_reserva: "sem caminho para reservar", sem_site: "sem site" };
function blocoSinais(l) {
  const sinais = Array.isArray(l.sinaisCompra) ? l.sinaisCompra : [], d = l.diagnostico;
  if (!sinais.length && !d) return null;
  const corpo = h("div", { style: { display: "grid", gap: "12px" } });
  if (sinais.length) corpo.append(h("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" } }, ...sinais.map((x) => pill(x.texto, COR_SINAL[x.forca] || "slate", "dot"))));
  else corpo.append(h("p", { class: "faint", style: { margin: 0 } }, "Nenhum sinal de compra encontrado."));
  if (d) {
    const cm = d.comissaoMes;
    corpo.append(h("dl", { class: "dl" },
      dlItem("Diagnóstico gerado em", d.data ? new Date(d.data + "T12:00").toLocaleDateString("pt-BR") : ""),
      dlItem("Imagem principal no celular (4G)", d.lcpCelularS != null ? String(d.lcpCelularS).replace(".", ",") + " s" : ""),
      dlItem("Reserva no site", (RESERVA_DIRETA[d.reservaDireta] || d.reservaDireta || "") + (d.motores?.length ? " (" + d.motores.join(", ") + ")" : "")),
      dlItem("HTTPS", d.https === true ? "sim" : d.https === false ? "não" : ""),
      dlItem("Comissão estimada", cm ? brl(cm.min) + " a " + brl(cm.max) + "/mês" : "", { pend: "Falta diária ou quartos" }),
      dlItem("PDF (no Mac)", d.pdf ? h("code", { style: { fontSize: "12px" } }, d.pdf) : "", { full: true })));
  }
  corpo.append(h("span", { class: "hint" }, "Site lento, nota baixa ou sem reserva direta deixam o lead quente. O PDF não é enviado sozinho: revise e mande."));
  return cardSec("Sinais de compra", "alerta", corpo);
}
/* Raio-X da Reserva Direta (hotelaria): números do hotel e a conta da comissão. */
const fmtPct = (v) => (v === null || v === undefined || v === "" ? "" : Number(v).toLocaleString("pt-BR") + "%");
function blocoRaioX(l) {
  const conta = contaRaioX(l);
  const print = String(l.buscaNomePrint || "").trim();
  const canal = (pctV, taxa, padrao) => (pctV === null || pctV === undefined || pctV === "" ? "" : fmtPct(pctV) + " das reservas · taxa " + fmtPct(taxa ?? padrao));
  const resultado = conta
    ? h("div", { class: "next-box raiox-conta" },
      h("div", { class: "raiox-linha" }, h("span", {}, "Receita estimada por mês"), h("b", { class: "num" }, brl(conta.receita))),
      h("div", { class: "raiox-linha" }, h("span", {}, "Comissão das plataformas por mês"), h("b", { class: "num" }, brl(conta.comissao))),
      h("div", { class: "raiox-linha destaque" }, h("span", {}, "Economia com " + Math.round(MIGRACAO_DIRETO * 100) + "% migrando para o direto"), h("b", { class: "num" }, brl(conta.economia) + "/mês")),
      h("span", { class: "hint" }, "Ordem de grandeza, não promessa: quartos × ocupação × diária × 30; comissão = receita × (% Booking × taxa + % Airbnb × taxa)."))
    : h("div", { class: "warn-box" }, "Para calcular a comissão, preencha quartos, diária, ocupação e % por canal.");
  return cardSec("Raio-X", "dinheiro", h("div", { style: { display: "grid", gap: "14px" } },
    resultado,
    h("dl", { class: "dl" },
      dlItem("Quartos", l.quartos ? String(l.quartos) : ""),
      dlItem("Diária média", l.diariaMedia ? brl(l.diariaMedia) : ""),
      dlItem("Ocupação média", fmtPct(l.ocupacao)),
      dlItem("Plano indicado", l.plano),
      dlItem("Booking", canal(l.pctBooking, l.taxaBooking, TAXAS_PADRAO.booking)),
      dlItem("Airbnb", canal(l.pctAirbnb, l.taxaAirbnb, TAXAS_PADRAO.airbnb)),
      dlItem("Busca pelo nome no Google", l.buscaNome, { full: true }),
      dlItem("Print da busca", print ? (urlSegura(print) && /^https?:\/\//i.test(print) ? h("a", { href: urlSegura(print), target: "_blank", rel: "noopener" }, semProtocolo(print)) : h("code", { style: { fontSize: "12px" } }, print)) : "", { full: true, pend: "Sem print: não use o gancho da busca" }))),
    h("button", { class: "btn sm", type: "button", onclick: () => editarDados(l) }, "Editar"));
}
async function editarDados(l) {
  const { grid, ler } = camposLead(l, false);
  const r = await modal({ titulo: "Editar dados", sub: nomeLead(l), ok: "Salvar dados", largura: 760, corpo: grid,
    aoConfirmar: () => {
      const d = ler();
      const mud = {};
      for (const [k, v] of Object.entries(d)) {
        const antes = l[k] ?? (typeof v === "number" ? null : "");
        const igual = v && typeof v === "object" ? JSON.stringify(antes) === JSON.stringify(v) : antes === v;
        if (!igual && !(antes === "" && v === null)) mud[k] = v;
      }
      if ("decisorScore" in mud) mud.decisorFaixa = mud.decisorScore === null ? null : faixaPorScore(mud.decisorScore);
      return mud;
    } });
  if (!r || !Object.keys(r).length) { if (r) toast("Nada mudou."); return; }
  if ("mensagemProxima" in r) delete st.rascunhos[l.id];
  if ("localizacao" in r) { const [c, u] = String(r.localizacao || "").split("/").map((x) => x.trim()); r.cidade = c || ""; r.uf = u || ""; }
  r.historico = comHist(l, histItem("Dados atualizados: " + Object.keys(r).filter((k) => !["cidade", "uf"].includes(k)).join(", "), "nota"));
  salvar(l.id, r, { msg: "Dados salvos", desfazer: true });
}
async function excluirLead(l) {
  const ok = await confirmar({ titulo: "Excluir " + nomeLead(l) + "?", texto: "O lead e todo o histórico serão apagados do banco. Isso não pode ser desfeito.", ok: "Excluir lead", perigo: true });
  if (!ok) return;
  try { await mutacao("docs:remove", { collection: "leads", id: l.id }); st.base.delete(l.id); st.raw.delete(l.id); st.pendentes.delete(l.id); mexeu(); toast("Lead excluído"); irPara("#/" + (st.voltarPara || "kanban")); }
  catch (e) { toast("Não foi possível excluir.", { ruim: true }); }
}
function blocoProximaAcao(l) {
  const pa = l.proximaAcao || {};
  const prox = acoesDe(l).filter((a) => a.tipo !== "acao")[0];
  return cardSec("Próxima ação", "relogio", h("div", { style: { display: "grid", gap: "10px" } },
    pa.texto ? h("div", { class: "next-box" }, h("strong", {}, pa.texto), h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" } }, dataChip(pa.ate), h("span", { class: "faint" }, "Responsável: " + (pa.responsavel || l.responsavel || "Pedro"))))
      : h("p", { class: "faint", style: { margin: 0 } }, "Nenhuma próxima ação definida."),
    prox ? h("div", { class: "faint", style: { fontSize: "12.5px" } }, "Também previsto: " + prox.texto + " · " + fmtDiaHora(prox.em)) : null),
    h("div", { class: "more" }, pa.texto ? h("button", { class: "btn ghost sm", type: "button", onclick: () => concluirAcao(l) }, "Concluir") : null,
      pa.texto && pa.ate ? h("button", { class: "btn ghost sm", type: "button", title: "Passar para o próximo dia útil, às 9h", onclick: () => adiarAcao(l) }, "Adiar") : null,
      h("button", { class: "btn sm", type: "button", onclick: () => ajustarAcao(l) }, "Ajustar")));
}
function concluirAcao(l) {
  const pa = l.proximaAcao || {};
  return salvar(l.id, { proximaAcao: { texto: "", ate: "", responsavel: "" }, historico: comHist(l, histItem("Próxima ação concluída: " + pa.texto, "nota")) }, { msg: "Ação concluída", desfazer: true });
}
// Adia a próxima ação para o próximo dia útil às 9h (contando a partir de hoje ou do prazo, o que for depois).
function adiarAcao(l) {
  const pa = l.proximaAcao || {};
  const base = pa.ate && paraData(pa.ate) > new Date() ? paraData(pa.ate) : new Date();
  const ate = somarDiasUteis(base, 1).toISOString();
  return salvar(l.id, { proximaAcao: { ate }, historico: comHist(l, histItem("Próxima ação adiada para " + fmtDiaHora(ate) + ": " + pa.texto, "nota")) }, { msg: "Adiada para " + fmtDiaHora(ate), desfazer: true });
}
async function ajustarAcao(l) {
  const pa = l.proximaAcao || {};
  const txt = h("input", { id: "pa-texto", value: pa.texto || "", placeholder: "Ex.: Ligar para confirmar a conversa" });
  const [lab, dt] = campoDataHora("pa-ate", "Até", pa.ate || proximoDiaUtil9h());
  const resp = h("input", { id: "pa-resp", value: pa.responsavel || l.responsavel || "Pedro" });
  const r = await modal({ titulo: "Ajustar próxima ação", sub: nomeLead(l), largura: 480,
    corpo: h("div", { style: { display: "grid", gap: "12px" } }, h("label", { class: "f", for: "pa-texto" }, h("span", {}, "O que fazer", h("span", { class: "req" }, " *")), txt), lab, h("label", { class: "f", for: "pa-resp" }, "Responsável", resp)),
    aoConfirmar: () => { if (!txt.value.trim()) throw new Error("Descreva a próxima ação."); if (!dt.value) throw new Error("Informe a data."); return { texto: txt.value.trim(), ate: deInputDataHora(dt.value), responsavel: resp.value.trim() || "Pedro" }; } });
  if (r) salvar(l.id, { proximaAcao: r, historico: comHist(l, histItem("Próxima ação: " + r.texto + " até " + fmtDiaHora(r.ate), "nota")) }, { msg: "Próxima ação salva", desfazer: true });
}
function blocoCadencia(l) {
  const c = l.cadencia;
  const ps = passos(l);
  const corpo = h("div", { style: { display: "grid", gap: "12px" } });
  const botoes = h("div", { class: "more", style: { flexWrap: "wrap" } });
  if (!c) {
    corpo.append(h("p", { class: "muted", style: { margin: 0 } }, "A cadência ainda não começou. Ao iniciar, o lead vai para a etapa Cadência e o 1º template (Instagram) fica pronto para enviar."));
    const m = mensagemAtual(l);
    corpo.append(h("div", { class: "subsec" }, h("h3", {}, "Mensagem do 1º template", m.origem === "agentes" ? pill("personalizada pelos agentes", "violet", "sq") : pill("template", "slate", "sq")), h("div", { class: "msg-box", html: realce(m.texto) })));
    botoes.append(h("button", { class: "btn primary sm", type: "button", onclick: () => mudarEtapa(lead(l.id), "cadencia") }, "Iniciar cadência"));
  } else {
    const lista = h("div", { class: "steps" });
    ps.forEach((p, i) => {
      const envio = (c.envios || []).filter((e) => e.passo === i).slice(-1)[0];
      let stt = "", txt;
      if (i < c.passo) { stt = "sent"; txt = envio ? "Enviado em " + fmtDiaHora(envio.em) + " · " + canalLabel(envio.canal) : "Enviado (antes do CRM v2)"; }
      else if (c.estado === "ativa" && i === c.passo) { stt = "next"; txt = situacao(c.previstoEm) === "late" ? "Atrasado: previsto para " + fmtDiaHora(c.previstoEm) : "Previsto para " + fmtDiaHora(c.previstoEm); }
      else if (c.estado === "ativa") txt = "Aguardando etapa anterior";
      else { stt = "cut"; txt = c.estado === "respondeu" ? "Não enviado (o lead respondeu)" : "Não enviado (cadência " + (c.estado === "encerrada" ? "encerrada" : "interrompida") + ")"; }
      lista.append(h("div", { class: "step", "data-st": stt },
        h("span", { class: "step-n", html: stt === "sent" ? I.check : String(i + 1) }),
        h("div", { style: { minWidth: 0 } }, h("b", {}, p.nome), h("span", { class: "s" }, txt)),
        canalChip(p.canal)));
    });
    if (c.estado === "ativa" && c.passo >= 5) lista.append(h("div", { class: "step", "data-st": "next" }, h("span", { class: "step-n", html: I.x }), h("div", {}, h("b", {}, "Encerrar como Sem resposta"), h("span", { class: "s" }, "Disponível a partir de " + fmtDiaHora(c.previstoEm))), h("span")));
    corpo.append(lista);
    if (c.estado === "ativa" && c.passo < 5) {
      const m = mensagemAtual(l);
      corpo.append(h("div", { class: "subsec" }, h("h3", {}, "Mensagem do " + ordemNum(c.passo), m.origem === "agentes" ? pill("personalizada pelos agentes", "violet", "sq") : m.origem === "rascunho" ? pill("editada", "amber", "sq") : pill("template", "slate", "sq")),
        h("div", { class: "msg-box", html: realce(m.texto) }),
        colchetes(m.texto).length ? h("div", { class: "warn-box" }, "Preencha antes de enviar: " + colchetes(m.texto).join(", ")) : null));
      botoes.append(h("button", { class: "btn primary sm", type: "button", onclick: () => abrirEnvio(l.id), html: I.enviar + "Enviar " + ordemNum(c.passo) }));
    }
    if (c.estado === "ativa") botoes.append(h("button", { class: "btn sm", type: "button", onclick: () => leadRespondeu(l) }, "Lead respondeu"));
    if (c.estado === "ativa") botoes.append(h("button", { class: "btn danger sm", type: "button", onclick: () => encerrarSemResposta(l) }, "Encerrar como \"Sem resposta\""));
    if (c.estado !== "ativa") botoes.append(h("button", { class: "btn sm", type: "button", onclick: () => novoCiclo(l) }, "Iniciar novo ciclo"));
  }
  corpo.append(botoes);
  const est = c ? { ativa: ["ativa", "blue"], respondeu: ["respondeu", "green"], encerrada: ["encerrada", "red"], interrompida: ["interrompida", "slate"] }[c.estado] : null;
  return cardSec("Cadência (Instagram + WhatsApp)", "cadencia", corpo, est ? h("span", { style: { display: "flex", gap: "6px" } }, pill(est[0], est[1], "dot"), c.ciclo > 1 ? pill("ciclo " + c.ciclo, "slate") : null) : null);
}
function checklistUI(l, grupo) {
  const marc = (l.checklist && l.checklist[grupo]) || {};
  const itens = CHECKLISTS[grupo];
  const feitos = itens.filter(([k]) => marc[k]).length;
  return { feitos, total: itens.length, el: h("div", { class: "checks" }, itens.map(([k, label]) => {
    const id = "ck-" + grupo + "-" + k;
    const cb = h("input", { type: "checkbox", id, checked: !!marc[k], onchange: (e) => {
      const patch = { checklist: { [grupo]: { [k]: e.target.checked } }, historico: comHist(l, histItem((e.target.checked ? "✓ " : "Desmarcado: ") + label, "nota")) };
      if (grupo === "contrato" && k === "entradaPaga") { patch.entradaPaga = e.target.checked; patch.entradaEm = e.target.checked ? (l.entradaEm || hojeISO()) : ""; }
      salvar(l.id, patch, { msg: e.target.checked ? "Marcado" : "Desmarcado" });
    } });
    return h("label", { class: "check", for: id }, cb, h("span", {}, label));
  })) };
}
const progresso = (a, b) => h("span", { style: { display: "inline-flex", gap: "8px", alignItems: "center", fontSize: "12px", color: "var(--fg-3)", fontWeight: 500 } }, h("span", { class: "progress", "aria-hidden": "true" }, h("span", { style: { width: (a / b) * 100 + "%" } })), a + "/" + b);
function blocoDiagnostico(l) {
  const r = l.reuniao || {};
  const conv = h("div", { class: "subsec" }, h("h3", {}, "Conversa de diagnóstico", r.status ? pill({ agendada: "agendada", realizada: "realizada", no_show: "no-show" }[r.status] || r.status, { agendada: "violet", realizada: "green", no_show: "red" }[r.status] || "slate", "dot") : null));
  if (r.data) {
    conv.append(h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" } }, dataChip(r.data), r.resultado ? h("span", { class: "muted" }, r.resultado) : null));
    if (r.status === "agendada" && passou(r.data)) conv.append(h("div", { class: "warn-box" }, "Já passou — registre o resultado."));
  } else conv.append(h("p", { class: "faint", style: { margin: 0 } }, "Nenhuma conversa marcada."));
  conv.append(h("div", { class: "more", style: { flexWrap: "wrap" } },
    !r.data ? h("button", { class: "btn sm", type: "button", onclick: () => reagendar(l, { titulo: "Marcar conversa de diagnóstico", ok: "Marcar conversa" }) }, "Marcar conversa") : null,
    r.data ? h("button", { class: "btn primary sm", type: "button", onclick: () => registrarResultado(l) }, "Registrar resultado") : null,
    r.data ? h("button", { class: "btn sm", type: "button", onclick: () => noShow(l) }, "No-show") : null,
    r.data ? h("button", { class: "btn ghost sm", type: "button", onclick: () => reagendar(l) }, "Reagendar") : null));
  // Cada checklist abre sozinho na etapa em que é usado (ou se já tem item marcado); os demais ficam recolhidos.
  const EM_USO = { diagnostico: ["reuniao", "diagnostico"], proposta: ["diagnostico", "proposta"], negociacao: ["proposta", "negociacao"], contrato: ["negociacao", "contrato", "ganho"] };
  const bloco = (grupo, titulo, c, ...resto) => h("details", { class: "subsec", open: EM_USO[grupo].includes(l.etapa) || c.feitos > 0 },
    h("summary", {}, h("h3", {}, titulo, progresso(c.feitos, c.total))), c.el, ...resto);
  const sec = (grupo, titulo) => bloco(grupo, titulo, checklistUI(l, grupo));
  const neg = checklistUI(l, "negociacao");
  const negSec = bloco("negociacao", "Negociação", neg,
    h("div", { class: "question" }, h("span", {}, "A proposta foi aprovada?"),
      h("button", { class: "btn good sm", type: "button", onclick: () => mudarEtapa(lead(l.id), "contrato") }, "Sim, seguir para contrato"),
      h("button", { class: "btn danger sm", type: "button", onclick: () => mudarEtapa(lead(l.id), "encerrado", { motivo: "perdido" }) }, "Não")));
  const ct = checklistUI(l, "contrato");
  const ctSec = bloco("contrato", "Contrato", ct,
    l.etapa !== "ganho" ? h("div", {}, h("button", { class: "btn good sm", type: "button", onclick: () => mudarEtapa(lead(l.id), "ganho"), html: I.trofeu + "Marcar como ganho" })) : null);
  return cardSec("Diagnóstico e proposta", "objecoes", h("div", {}, conv, sec("diagnostico", "Diagnóstico"), sec("proposta", "Proposta"), negSec, ctSec));
}
async function reagendar(l, textos = { titulo: "Reagendar conversa", ok: "Reagendar" }) {
  const r = await modalConversa(l, textos);
  if (r) marcarConversa(l, r.data);
}
// Antes da conversa (novo, 1º contato, cadência) o lead muda de etapa; depois dela, só a data é gravada.
function marcarConversa(l, data) {
  if (["novo_lead", "primeiro_contato", "cadencia", "encerrado"].includes(l.etapa)) return mudarEtapa(l, "reuniao", { reuniao: { data } });
  const novo = !(l.reuniao && l.reuniao.data);
  return salvar(l.id, { reuniao: { data, status: "agendada", resultado: "" }, historico: comHist(l, histItem((novo ? "Conversa marcada para " : "Conversa reagendada para ") + fmtDiaHora(data), "reuniao")) }, { msg: novo ? "Conversa marcada" : "Conversa reagendada", desfazer: true });
}
async function registrarResultado(l) {
  const res = h("textarea", { id: "rr-res", placeholder: "O que foi combinado, necessidade, pacote, próximos passos…" }); res.value = (l.reuniao && l.reuniao.resultado) || "";
  const prox = h("select", { id: "rr-etapa" }, h("option", { value: "diagnostico" }, "Seguir para Diagnóstico"), h("option", { value: "proposta" }, "Seguir para Proposta"), h("option", { value: "" }, "Manter na etapa atual"));
  const r = await modal({ titulo: "Registrar resultado da conversa", sub: nomeLead(l), largura: 500,
    corpo: h("div", { style: { display: "grid", gap: "12px" } }, h("label", { class: "f", for: "rr-res" }, "Resultado", res), h("label", { class: "f", for: "rr-etapa" }, "Próximo passo", prox)),
    aoConfirmar: () => ({ resultado: res.value.trim(), etapa: prox.value }) });
  if (!r) return;
  await salvar(l.id, { reuniao: { status: "realizada", resultado: r.resultado }, historico: comHist(l, histItem("Conversa realizada" + (r.resultado ? ": " + r.resultado : ""), "reuniao")) }, { msg: "Resultado registrado" });
  if (r.etapa && r.etapa !== l.etapa) mudarEtapa(lead(l.id), r.etapa);
}
async function noShow(l) {
  await salvar(l.id, { reuniao: { status: "no_show" }, historico: comHist(l, histItem("No-show na conversa de diagnóstico", "reuniao")) }, { msg: "No-show registrado" });
  abrirEnvio(l.id, { tipo: "noshow" });
}
function blocoCliente(l) {
  const id = (k) => "cl-" + k;
  const chk = (k, label, dataK) => {
    const cb = h("input", { type: "checkbox", id: id(k), checked: !!l[k], onchange: (e) => {
      const p = { [k]: e.target.checked };
      if (dataK) p[dataK] = e.target.checked ? (l[dataK] || hojeISO()) : "";
      if (k === "manutencao" && e.target.checked && l.faseCliente !== "manutencao") p.faseCliente = l.faseCliente === "entregue" ? "manutencao" : l.faseCliente;
      p.historico = comHist(l, histItem(label + (e.target.checked ? " marcado" : " desmarcado"), "sistema"));
      salvar(l.id, p, { msg: label + (e.target.checked ? " ✓" : " desmarcado"), desfazer: true });
    } });
    return h("label", { class: "check", for: id(k) }, cb, h("span", {}, label + (l[k] && l[dataK] ? " (" + fmtDia(l[dataK], true) + ")" : "")));
  };
  const fase = selectField(id("fase"), "Fase do cliente", FASES.map((f) => [f.id, f.label]), l.faseCliente || "em_construcao", (x) => mudarFase(l, x));
  const v = Number(l.valor) || 0;
  return cardSec("Cliente", "clientes", h("div", { style: { display: "grid", gap: "12px" } },
    h("div", { class: "fgrid" },
      h("label", { class: "f", for: id("fase") }, "Fase", fase),
      h("div", { class: "f" }, h("span", { class: "hint" }, "Projeto"), h("strong", { class: "num" }, v ? brl(v) + " · entrada " + brl(v / 2) + " · final " + brl(v / 2) : "Valor não informado"))),
    h("div", { class: "checks" }, chk("entradaPaga", "Entrada paga", "entradaEm"), chk("finalPago", "Final pago", "finalEm"), chk("manutencao", "Manutenção mensal (" + brl(MENSALIDADE) + "/mês)", "manutencaoDesde")),
    h("div", { class: "dl", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
      dlItem("Rodadas de ajuste usadas", h("span", { style: { display: "inline-flex", gap: "6px", alignItems: "center" } },
        h("button", { class: "btn xs", type: "button", "aria-label": "Diminuir rodadas", onclick: () => salvar(l.id, { rodadasUsadas: Math.max(0, (Number(l.rodadasUsadas) || 0) - 1) }, { msg: "Rodadas atualizadas" }) }, "−"),
        h("b", { class: "num" }, String(Number(l.rodadasUsadas) || 0)),
        h("button", { class: "btn xs", type: "button", "aria-label": "Aumentar rodadas", onclick: () => salvar(l.id, { rodadasUsadas: (Number(l.rodadasUsadas) || 0) + 1 }, { msg: "Rodadas atualizadas" }) }, "+"),
        (Number(l.rodadasUsadas) || 0) >= 2 ? h("span", { class: "pend-t", style: { fontSize: "12px" } }, "3ª em diante é cobrada") : null)),
      dlItem("Site no ar", urlSegura(l.urlProducao) ? h("a", { href: urlSegura(l.urlProducao), target: "_blank", rel: "noopener" }, semProtocolo(l.urlProducao)) : ""))));
}
function mudarFase(l, fase) {
  if (fase === l.faseCliente) return;
  const p = { faseCliente: fase, historico: comHist(l, histItem("Fase do cliente: " + (FASE[l.faseCliente] ? FASE[l.faseCliente].label : "—") + " → " + FASE[fase].label, "etapa")), datas: { ...(l.datas || {}), [fase]: hojeISO() } };
  if (fase === "manutencao" && !l.manutencao) { p.manutencao = true; p.manutencaoDesde = l.manutencaoDesde || hojeISO(); }
  if (fase === "cancelado" && l.manutencao) p.manutencao = false;
  return salvar(l.id, p, { msg: nomeLead(l) + ": " + FASE[fase].label, desfazer: true });
}
const ICONE_HIST = { etapa: "etapa", whatsapp: "whatsapp", instagram: "instagram", ligacao: "telefone", reuniao: "calendario", nota: "nota", sistema: "engrenagem", status: "etapa", toque: "enviar", financeiro: "dinheiro" };
function blocoLinhaDoTempo(l) {
  const prev = acoesDe(l);
  const hist = (l.historico || []).slice().sort((a, b) => String(b.em).localeCompare(String(a.em)));
  const ul = h("ul", { class: "tl" });
  const item = (tipo, texto, em, extra = {}) => h("li", { "data-cancel": extra.cancelada }, h("span", { class: "tl-ico", "data-t": tipo, html: I[ICONE_HIST[tipo] || (tipo === "prevista" ? "relogio" : "nota")] }),
    h("div", { class: "tl-txt" }, h("span", {}, texto), h("time", { datetime: em }, extra.quando || fmtDiaHora(em))));
  return cardSec("Linha do tempo", "agenda", h("div", {},
    h("div", { class: "tl-sec" }, "Previstas"),
    prev.length ? h("ul", { class: "tl" }, prev.map((a) => item("prevista", a.texto, a.em, { quando: (situacao(a.em) === "late" ? "Atrasada · " : "") + fmtDiaHora(a.em) + " · " + (a.resp || "Pedro") }))) : h("p", { class: "faint", style: { margin: "4px 0 8px" } }, "Nada previsto."),
    h("div", { class: "tl-sec" }, "Histórico"),
    hist.length ? (hist.forEach((x) => ul.append(item(x.tipo, x.texto, x.em, { cancelada: x.cancelada }))), ul) : h("p", { class: "faint", style: { margin: "4px 0" } }, "Sem movimentações.")));
}

/* ================= Registrar ligação ================= */
async function registrarLigacao(l) {
  const [labData, data] = campoDataHora("lg-data", "Data e hora da ligação", agoraISO());
  const radios = h("div", { class: "radios", role: "radiogroup", "aria-label": "Resultado" }, RESULTADOS_LIGACAO.map((r) => h("label", {}, h("input", { type: "radio", name: "lg-res", value: r.id }), r.label)));
  const [labConv, conv] = campoDataHora("lg-conv", "Data e hora da conversa marcada", "");
  const boxConv = h("div", { hidden: true }, labConv);
  radios.addEventListener("change", () => { boxConv.hidden = (radios.querySelector("input:checked") || {}).value !== "reuniao_marcada"; });
  const pa = h("input", { id: "lg-pa", placeholder: "Ex.: Mandar a prévia no WhatsApp" });
  const [labAte, ate] = campoDataHora("lg-ate", "Até", proximoDiaUtil9h(), false);
  const nec = h("textarea", { id: "lg-nec", style: { minHeight: "70px" } }); nec.value = l.necessidade || "";
  const obs = h("textarea", { id: "lg-obs", style: { minHeight: "70px" } });
  const r = await modal({ titulo: "Registrar ligação", sub: nomeLead(l) + (l.whatsapp ? " · " + fmtTel(l.whatsapp) : ""), ok: "Registrar ligação", largura: 640,
    extras: [h("button", { class: "btn ghost", type: "button", style: { marginRight: "auto" }, onclick: () => abrirRoteiro(l), html: I.roteiro + "Roteiro" })],
    corpo: h("div", { style: { display: "grid", gap: "14px" } }, labData, h("div", { class: "f" }, h("span", { class: "hint", style: { color: "var(--fg-2)", fontWeight: 500, fontSize: "12.5px" } }, "Resultado *"), radios), boxConv,
      h("div", { class: "fgrid" }, h("label", { class: "f", for: "lg-pa" }, "Próxima ação", pa), labAte),
      h("label", { class: "f", for: "lg-nec" }, "Necessidade percebida", nec), h("label", { class: "f", for: "lg-obs" }, "Observações", obs)),
    aoConfirmar: () => {
      const res = (radios.querySelector("input:checked") || {}).value;
      if (!data.value) throw new Error("Informe a data e a hora da ligação.");
      if (!res) throw new Error("Escolha o resultado da ligação.");
      if (res === "reuniao_marcada" && !conv.value) throw new Error("Informe a data e a hora da conversa marcada.");
      if (pa.value.trim() && !ate.value) throw new Error("Informe o prazo da próxima ação.");
      return { em: deInputDataHora(data.value), resultado: res, conversa: conv.value ? deInputDataHora(conv.value) : "", pa: pa.value.trim(), ate: ate.value ? deInputDataHora(ate.value) : "", necessidade: nec.value.trim(), obs: obs.value.trim() };
    } });
  if (!r) return;
  const lig = { em: r.em, resultado: r.resultado, obs: r.obs };
  const patch = { ligacoes: anexo(lig), historico: comHist(l, histItem("Ligação: " + rotulo(RESULTADOS_LIGACAO, r.resultado) + (r.obs ? " — " + r.obs : ""), "ligacao")) };
  if (!l.primeiraLigacao || !l.primeiraLigacao.em) patch.primeiraLigacao = { em: r.em, resultado: r.resultado };
  if (r.necessidade !== (l.necessidade || "")) patch.necessidade = r.necessidade;
  if (r.pa) patch.proximaAcao = { texto: r.pa, ate: r.ate, responsavel: l.responsavel || "Pedro" };
  await salvar(l.id, patch, { msg: "Ligação registrada", desfazer: true });
  if (r.resultado === "reuniao_marcada") await marcarConversa(lead(l.id), r.conversa);
  if (r.resultado === "sem_interesse") {
    const ok = await confirmar({ titulo: "Encerrar o lead?", texto: "O lead disse que não tem interesse. Quer movê-lo para Encerrados com o motivo \"Sem interesse\"?", ok: "Encerrar como Sem interesse" });
    if (ok) await mudarEtapa(lead(l.id), "encerrado", { encerramento: { motivo: "sem_interesse", obs: r.obs } });
  }
}

/* ================= Agenda Comercial ================= */
const ICONE_ACAO = { acao: ["nota", "prevista"], envio: ["enviar", "etapa"], encerrar: ["x", "prevista"], conversa: ["calendario", "reuniao"] };
VIEWS.agenda = () => {
  const f = st.filtros.agenda;
  const v = h("div", { class: "view" });
  v.append(viewHead("Agenda Comercial", "Próximas ações, envios da cadência e conversas, das atrasadas para as futuras.", null, "Acompanhamento de Leads"));
  const corpo = h("div", { class: "agenda" });
  const atualizar = () => corpo.replaceChildren(...conteudoAgenda());
  v.append(h("div", { class: "toolbar" },
    selectField("ag-etapa", "Filtrar por etapa", [["", "Todas as etapas"], ...ETAPAS.map((e) => [e.id, e.curto])], f.etapa, (x) => { f.etapa = x; atualizar(); }),
    selectField("ag-resp", "Filtrar por responsável", [["", "Todos os responsáveis"], ...respList().map((r) => [r, r])], f.resp, (x) => { f.resp = x; atualizar(); })));
  corpo.append(...conteudoAgenda());
  v.append(corpo);
  return v;
};
function itemAgenda(a) {
  const l = a.l;
  const [ic, t] = ICONE_ACAO[a.tipo];
  const acoes = h("div", { class: "ag-act" });
  if (a.tipo === "envio") acoes.append(h("button", { class: "btn primary xs", type: "button", onclick: () => abrirEnvio(l.id), html: I.enviar + "Enviar" }));
  if (a.tipo === "encerrar") acoes.append(h("button", { class: "btn danger xs", type: "button", disabled: !passou(a.em), title: passou(a.em) ? null : "Disponível quando vencer a espera do break-up", onclick: () => encerrarSemResposta(l) }, "Encerrar"));
  if (a.tipo === "conversa" && passou(a.em)) acoes.append(h("button", { class: "btn primary xs", type: "button", onclick: () => registrarResultado(l) }, "Registrar resultado"));
  if (a.tipo === "acao") acoes.append(
    h("button", { class: "btn xs", type: "button", onclick: () => concluirAcao(l) }, "Concluir"),
    h("button", { class: "btn ghost xs", type: "button", title: "Passar para o próximo dia útil, às 9h", onclick: () => adiarAcao(l) }, "Adiar"));
  acoes.append(h("a", { class: "btn ghost xs", href: linkLead(l.id) }, "Abrir ficha"));
  return h("div", { class: "ag-item" },
    h("span", { class: "tl-ico", "data-t": t, html: a.tipo === "envio" ? (a.canal === "instagram" ? I.instagram : I.whatsapp) : I[ic] }),
    h("div", { class: "ag-lead" }, h("a", { href: linkLead(l.id) }, empresaCurta(l.empresa) || l.nome || "Sem nome"), h("div", { style: { marginTop: "3px" } }, etapaPill(l.etapa))),
    h("div", { class: "ag-what" }, a.texto, h("div", { class: "faint", style: { fontSize: "12px" } }, a.resp || "Pedro")),
    h("div", {}, dataChip(a.em)),
    acoes);
}
function conteudoAgenda() {
  const f = st.filtros.agenda;
  const acoes = todasAcoes().filter((a) => (!f.etapa || a.l.etapa === f.etapa) && (!f.resp || (a.resp || "Pedro") === f.resp));
  const hoje = hojeISO(), lim = somarDias(hoje, 7);
  const grupos = [
    ["late", "Atrasadas", acoes.filter((a) => diaLocal(a.em) < hoje)],
    ["today", "Hoje", acoes.filter((a) => diaLocal(a.em) === hoje)],
    ["week", "Próximos 7 dias", acoes.filter((a) => diaLocal(a.em) > hoje && diaLocal(a.em) <= lim)],
    ["later", "Depois", acoes.filter((a) => diaLocal(a.em) > lim)],
  ];
  const out = grupos.map(([g, titulo, itens]) => h("section", { class: "ag-group", "data-g": g },
    h("h2", {}, titulo, h("span", { class: "col-n num" }, String(itens.length))),
    itens.length ? h("div", { class: "ag-list" }, itens.map(itemAgenda)) : h("p", { class: "faint", style: { margin: 0 } }, g === "late" ? "Nada atrasado. 👏" : "Nada por aqui.")));
  const conversas = leads().filter((l) => l.reuniao && l.reuniao.data && l.reuniao.status === "agendada" && (!f.etapa || l.etapa === f.etapa)).sort((a, b) => a.reuniao.data.localeCompare(b.reuniao.data));
  out.push(cardSec("Conversas e apresentações", "calendario", conversas.length ? h("div", { class: "ag-list" }, conversas.map((l) => {
    const jaPassou = passou(l.reuniao.data);
    return h("div", { class: "ag-item" }, h("span", { class: "tl-ico", "data-t": "reuniao", html: I.calendario }),
      h("div", { class: "ag-lead" }, h("a", { href: linkLead(l.id) }, empresaCurta(l.empresa) || l.nome), h("div", { style: { marginTop: "3px" } }, etapaPill(l.etapa))),
      h("div", { class: "ag-what" }, jaPassou ? h("span", { class: "pend-t" }, "Já passou — registre o resultado") : "Conversa de diagnóstico"),
      h("div", {}, dataChip(l.reuniao.data)),
      h("div", { class: "ag-act" }, jaPassou ? h("button", { class: "btn primary xs", type: "button", onclick: () => registrarResultado(l) }, "Registrar resultado") : null, h("a", { class: "btn ghost xs", href: linkLead(l.id) }, "Abrir ficha")));
  })) : h("p", { class: "faint", style: { margin: 0 } }, "Nenhuma conversa agendada.")));
  return out;
}

/* ================= Relatórios ================= */
VIEWS.relatorios = () => {
  const f = st.filtros.rel;
  const dias = f.periodo === "tudo" ? null : Number(f.periodo);
  const inicio = dias ? somarDias(hojeISO(), -dias) : "0000";
  const noPeriodo = (iso) => !!iso && diaLocal(iso) >= inicio;
  const todos = leads();
  const doPeriodo = todos.filter((l) => !dias || noPeriodo(l.criadoEm));
  const ganhos = todos.filter((l) => l.etapa === "ganho" && (!dias || noPeriodo(l.datas.ganho)));
  const encerrados = todos.filter((l) => l.etapa === "encerrado" && l.encerramento && (!dias || noPeriodo(l.encerramento.em || l.datas.encerrado)));
  const receita = ganhos.reduce((a, l) => a + (Number(l.valor) || 0), 0);
  const ciclos = ganhos.filter((l) => l.criadoEm && l.datas.ganho).map((l) => diasEntre(l.criadoEm, l.datas.ganho));
  const iniciaram = todos.filter((l) => l.cadencia && (l.cadencia.iniciadaEm || (l.cadencia.envios || []).length || l.cadencia.passo > 0) && (!dias || noPeriodo(l.cadencia.iniciadaEm || ((l.cadencia.envios || [])[0] || {}).em || l.criadoEm)));
  const responderam = iniciaram.filter((l) => l.cadencia.estado === "respondeu" || l.cadencia.respondeuEm);
  const conversas = todos.filter((l) => l.reuniao && l.reuniao.status === "realizada" && (!dias || noPeriodo(l.reuniao.data)));
  const porMotivo = (m) => encerrados.filter((l) => l.encerramento.motivo === m).length;
  const v = h("div", { class: "view" });
  const seg = h("div", { class: "seg", role: "group", "aria-label": "Período" }, [["30", "30 dias"], ["90", "90 dias"], ["365", "12 meses"], ["tudo", "Tudo"]].map(([k, t]) => h("button", { type: "button", "aria-pressed": String(f.periodo === k), onclick: () => { f.periodo = k; gravarFiltros(); render(true); } }, t)));
  v.append(viewHead("Relatórios", dias ? `Últimos ${dias} dias (desde ${fmtDia(inicio, true)}).` : "Desde o primeiro lead.", seg, "Acompanhamento de Leads"));
  const passosNomes = passos().map((p, i) => ordemNum(i));
  const respPorPasso = passosNomes.map((n, i) => responderam.filter((l) => l.cadencia.respondeuNoPasso === i).length);
  const topPasso = respPorPasso.some((x) => x) ? passosNomes[respPorPasso.indexOf(Math.max(...respPorPasso))] : "—";
  v.append(h("div", { class: "kpis" },
    kpi("Leads no período", String(doPeriodo.length), "cadastrados", { icone: "banco" }),
    kpi("Ganhos", String(ganhos.length), brl(receita) + " fechados", { tom: "good", icone: "trofeu" }),
    kpi("Taxa de conversão", pct(ganhos.length, ganhos.length + encerrados.length), "ganhos ÷ (encerrados + ganhos)", { tom: "violet", icone: "relatorios" }),
    kpi("Ciclo médio até o ganho", ciclos.length ? Math.round(ciclos.reduce((a, b) => a + b, 0) / ciclos.length) + " dias" : "—", "do cadastro ao ganho", { icone: "relogio" }),
    kpi("Taxa de resposta da cadência", pct(responderam.length, iniciaram.length), responderam.length + " de " + iniciaram.length + " que iniciaram", { icone: "chat", tom: "good" }),
    kpi("Em qual template responderam", topPasso, responderam.length ? "o que mais gerou resposta" : "ainda sem respostas", { icone: "cadencia" }),
    kpi("Conversas realizadas", String(conversas.length), "diagnósticos feitos", { tom: "violet", icone: "calendario" }),
    kpi("Sem resposta · Perdidos", porMotivo("sem_resposta") + " · " + porMotivo("perdido"), "encerrados no período", { tom: "bad", icone: "x" })));
  const alcancou = (l, e) => !!(l.datas && l.datas[e]) || (l.etapa !== "encerrado" && ORDEM_ETAPAS.indexOf(l.etapa) >= ORDEM_ETAPAS.indexOf(e));
  const funil = ETAPAS.filter((e) => e.id !== "encerrado").map((e) => ({ label: e.curto, valor: doPeriodo.filter((l) => alcancou(l, e.id)).length }));
  const mot = MOTIVOS.map((m) => ({ label: m.label, valor: doPeriodo.filter((l) => l.etapa === "encerrado" && l.encerramento && l.encerramento.motivo === m.id).length, alt: true }));
  const contar = (lista, chave, rot) => { const m = {}; for (const l of lista) { const k = chave(l) || ""; m[k] = (m[k] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ chave: k, label: rot(k), valor: n })); };
  const origens = contar(doPeriodo, (l) => l.origem, (k) => rotulo(ORIGENS, k) || "Sem origem").map((r) => ({ ...r, extra: doPeriodo.filter((l) => (l.origem || "") === r.chave && l.etapa === "ganho").length + " ganho(s)" }));
  const segmentos = contar(doPeriodo, (l) => l.segmento, (k) => k || "Sem segmento").slice(0, 8);
  const temps = ["quente", "morno", "frio", ""].map((t) => ({ label: rotulo(TEMPERATURAS, t) || "Sem temperatura", valor: doPeriodo.filter((l) => (l.temperatura || "") === t).length })).filter((r) => r.valor || r.label !== "Sem temperatura");
  const motivosPerda = MOTIVOS.map((m) => ({ label: m.label, valor: porMotivo(m.id) }));
  v.append(h("div", { class: "charts" },
    cardSec("Funil por etapa", "kanban", h("div", {}, h("p", { class: "faint", style: { margin: "0 0 10px", fontSize: "12.5px" } }, "Leads do período que chegaram a cada etapa; abaixo, os encerrados por motivo."), barras([...funil, ...mot], { sep: [funil.length] }))),
    cardSec("Origem dos leads", "info", barras(origens)),
    cardSec("Por segmento", "banco", barras(segmentos)),
    cardSec("Por temperatura", "fogo", barras(temps)),
    cardSec("Em qual template responderam", "cadencia", barras(passosNomes.map((n, i) => ({ label: n, valor: respPorPasso[i] })))),
    cardSec("Motivos de perda", "x", barras(motivosPerda))));
  return v;
};

/* ================= Clientes ================= */
VIEWS.clientes = () => {
  const f = st.filtros.clientes;
  const cl = leads().filter((l) => l.etapa === "ganho");
  const v = h("div", { class: "view" });
  const seg = h("div", { class: "seg", role: "group", "aria-label": "Visualização" }, [["quadro", "Quadro"], ["lista", "Lista"]].map(([k, t]) => h("button", { type: "button", "aria-pressed": String(f.modo === k), onclick: () => { f.modo = k; gravarFiltros(); render(true); } }, t)));
  v.append(viewHead("Clientes", "Leads ganhos, da construção à manutenção. Marque entrada e final pagos na ficha de cada cliente.", seg, "Clientes"));
  const aReceber = cl.reduce((a, l) => a + pendenteDe(l), 0);
  const manut = cl.filter((l) => l.faseCliente === "manutencao" || l.manutencao).length;
  v.append(h("div", { class: "kpis" },
    kpi("Clientes", String(cl.filter((l) => l.faseCliente !== "cancelado").length), "ativos", { icone: "clientes" }),
    kpi("Em construção", String(cl.filter((l) => l.faseCliente === "em_construcao" || l.faseCliente === "aprovacao_cliente").length), "construção + aprovação", { tom: "violet", icone: "kanban" }),
    kpi("A receber", brl(aReceber), "entradas e finais pendentes", { tom: "warn", icone: "dinheiro" }),
    kpi("Manutenção", manut + " × " + brl(MENSALIDADE), brl(manut * MENSALIDADE) + "/mês recorrente", { tom: "good", icone: "engrenagem" })));
  if (!cl.length) { v.append(h("section", { class: "card empty" }, h("h2", {}, "Nenhum cliente ainda"), h("p", {}, "Quando um lead for marcado como Ganho, ele aparece aqui em Em construção."))); return v; }
  const info = (l) => h("div", { class: "cl-money" },
    h("div", { class: "cl-row" }, h("span", {}, "Valor"), h("b", { class: "num" }, l.valor ? brl(l.valor) : "—")),
    h("div", { class: "cl-row" }, h("span", {}, "Entrada"), l.entradaPaga ? h("span", { class: "ok" }, "paga " + fmtDia(l.entradaEm)) : h("span", { class: "pend-t" }, "pendente")),
    h("div", { class: "cl-row" }, h("span", {}, "Final"), l.finalPago ? h("span", { class: "ok" }, "pago " + fmtDia(l.finalEm)) : h("span", { class: "pend-t" }, "pendente")),
    h("div", { class: "cl-row" }, h("span", {}, "Rodadas"), h("span", { class: "num" }, String(Number(l.rodadasUsadas) || 0))),
    l.manutencao ? h("div", { class: "cl-row" }, h("span", {}, "Manutenção"), h("span", { class: "ok" }, brl(MENSALIDADE) + "/mês desde " + fmtDia(l.manutencaoDesde))) : null,
    urlSegura(l.urlProducao) ? h("a", { class: "mini-link", href: urlSegura(l.urlProducao), target: "_blank", rel: "noopener", html: I.externo + esc(semProtocolo(l.urlProducao)) }) : null);
  if (f.modo === "quadro") {
    v.append(h("div", { class: "board b5" }, FASES.map((fz) => {
      const itens = cl.filter((l) => (l.faseCliente || "em_construcao") === fz.id);
      return h("section", { class: "col", dataset: { key: fz.id }, "data-c": fz.cor, "aria-label": fz.label },
        h("div", { class: "col-h" }, h("div", { class: "col-h-top" }, h("strong", {}, fz.label), h("span", { class: "col-n num" }, String(itens.length))), h("span", { class: "col-sub num" }, brl(itens.reduce((a, l) => a + (Number(l.valor) || 0), 0)))),
        h("div", { class: "col-body" }, itens.length ? itens.map((l) => {
          const c = h("article", { class: "kcard", tabindex: "0", "aria-label": nomeLead(l) },
            h("div", { class: "kc-top" }, h("a", { class: "kc-name", href: linkLead(l.id), style: { color: "inherit", textDecoration: "none" } }, empresaCurta(l.empresa) || l.nome), h("button", { class: "grip", type: "button", "aria-label": "Arrastar " + nomeLead(l), html: I.grip })), info(l));
          c.addEventListener("click", (e) => { if (e.target.closest("a, button")) return; irPara(linkLead(l.id)); });
          arrastavel(c, { id: l.id, colAtual: fz.id, onDrop: (alvo) => mudarFase(lead(l.id), alvo) });
          return c;
        }) : h("div", { class: "col-empty" }, "Arraste um card para cá")));
    })));
  } else {
    v.append(h("div", { class: "table-wrap" }, h("table", { class: "grid" },
      h("thead", {}, h("tr", {}, ["Cliente", "Fase", "Valor", "Entrada", "Final", "Rodadas", "Manutenção", "Site no ar"].map((t, i) => h("th", { scope: "col", class: i ? null : "sticky" }, t)))),
      h("tbody", {}, cl.map((l) => h("tr", {},
        h("td", { class: "sticky" }, h("div", { class: "cell-first" }, h("a", { href: linkLead(l.id) }, empresaCurta(l.empresa) || l.nome))),
        h("td", {}, h("div", { class: "cell" }, pill(FASE[l.faseCliente || "em_construcao"].label, FASE[l.faseCliente || "em_construcao"].cor, "dot"))),
        h("td", {}, h("div", { class: "cell num" }, l.valor ? brl(l.valor) : "—")),
        h("td", {}, h("div", { class: "cell" }, l.entradaPaga ? h("span", { class: "ok" }, "paga " + fmtDia(l.entradaEm)) : h("span", { class: "pend-t" }, "pendente"))),
        h("td", {}, h("div", { class: "cell" }, l.finalPago ? h("span", { class: "ok" }, "pago " + fmtDia(l.finalEm)) : h("span", { class: "pend-t" }, "pendente"))),
        h("td", {}, h("div", { class: "cell num" }, String(Number(l.rodadasUsadas) || 0))),
        h("td", {}, h("div", { class: "cell" }, l.manutencao ? brl(MENSALIDADE) + "/mês desde " + fmtDia(l.manutencaoDesde) : "—")),
        h("td", {}, h("div", { class: "cell" }, urlSegura(l.urlProducao) ? h("a", { class: "mini-link", href: urlSegura(l.urlProducao), target: "_blank", rel: "noopener" }, semProtocolo(l.urlProducao)) : "—"))))))));
  }
  return v;
};

/* ================= Painel (visão geral) ================= */
function metricas() {
  const todos = leads();
  const mes = hojeISO().slice(0, 7);
  const receitaPorMes = {};
  for (const l of todos) {
    const v = Number(l.valor) || 0; if (!v) continue;
    if (l.entradaPaga && l.entradaEm) receitaPorMes[l.entradaEm.slice(0, 7)] = (receitaPorMes[l.entradaEm.slice(0, 7)] || 0) + v / 2;
    if (l.finalPago && l.finalEm) receitaPorMes[l.finalEm.slice(0, 7)] = (receitaPorMes[l.finalEm.slice(0, 7)] || 0) + v / 2;
  }
  const semana = somarDias(hojeISO(), -6);
  const abordagens = todos.filter((l) => { const e = ((l.cadencia && l.cadencia.envios) || []).find((x) => x.passo === 0); const d = e ? diaLocal(e.em) : l.abordadoEm; return d && d >= semana; }).length;
  const ganhos = todos.filter((l) => l.etapa === "ganho");
  const comValor = ganhos.filter((l) => Number(l.valor) > 0);
  const iniciaram = todos.filter((l) => l.cadencia && (l.cadencia.passo > 0 || (l.cadencia.envios || []).length));
  const responderam = todos.filter((l) => l.cadencia && (l.cadencia.estado === "respondeu" || l.cadencia.respondeuEm));
  const negocio = todos.filter((l) => ["proposta", "negociacao", "contrato"].includes(l.etapa));
  return {
    receitaMes: receitaPorMes[mes] || 0, receitaPorMes, abordagens,
    ativos: todos.filter((l) => !["ganho", "encerrado"].includes(l.etapa)).length, total: todos.length,
    ganhos: ganhos.length, ticket: comValor.length ? comValor.reduce((a, l) => a + Number(l.valor), 0) / comValor.length : null,
    taxaResp: pct(responderam.length, iniciaram.length), nResp: responderam.length, nIni: iniciaram.length,
    emNegocio: negocio.reduce((a, l) => a + valorDe(l), 0), nNegocio: negocio.length,
    aReceber: ganhos.reduce((a, l) => a + pendenteDe(l), 0),
    nManut: ganhos.filter((l) => l.faseCliente === "manutencao" || l.manutencao).length,
  };
}
VIEWS.painel = () => {
  const m = metricas();
  const metas = st.config.metas || {};
  const metaRec = Number(metas.receitaMes) || 0, metaAb = Number(metas.abordagensSemana) || 0;
  const k = indicadoresKanban();
  const v = h("div", { class: "view" });
  v.append(viewHead("Painel", "Receita, metas e o pulso do funil. Os números se atualizam sozinhos quando você ou os agentes mexem nos leads.", null, "Visão geral"));
  const metaBar = (atual, meta) => h("div", { class: "meter", "data-done": atual >= meta, role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(meta), "aria-valuenow": String(atual) }, h("span", { style: { width: Math.min(100, (atual / meta) * 100) + "%" } }));
  const hero = h("section", { class: "card hero" },
    h("span", { class: "hero-l" }, "Receita recebida em " + new Date().toLocaleDateString("pt-BR", { month: "long" })),
    h("span", { class: "hero-v num" }, brl(m.receitaMes)),
    metaRec ? h("div", { style: { display: "grid", gap: "6px" } }, metaBar(m.receitaMes, metaRec), h("div", { class: "hero-sub" }, h("span", {}, pct(m.receitaMes, metaRec) + " da meta"), h("span", { class: "num" }, "Meta " + brl(metaRec)))) : null,
    h("div", { class: "hero-goals" },
      metaAb ? h("div", { style: { display: "grid", gap: "6px" } }, h("div", { class: "hero-sub" }, h("span", {}, "Novas abordagens (últimos 7 dias)"), h("span", { class: "num" }, m.abordagens + " de " + metaAb)), metaBar(m.abordagens, metaAb)) : null,
      h("div", { class: "hero-sub" }, h("span", {}, "Manutenção recorrente"), h("span", { class: "num" }, m.nManut + " × " + brl(MENSALIDADE) + " = " + brl(m.nManut * MENSALIDADE) + "/mês")),
      st.editandoMetas ? formMetas(metas) : h("div", {}, h("button", { class: "btn ghost sm", type: "button", onclick: () => { st.editandoMetas = true; render(true); } }, metaRec || metaAb ? "Editar metas" : "Definir metas"))));
  const tiles = h("div", { class: "kpis", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
    kpi("Leads no funil", String(m.ativos), m.total + " no total", { icone: "kanban" }),
    kpi("Taxa de resposta", m.taxaResp, m.nResp + " de " + m.nIni + " que receberam mensagem", { icone: "chat", tom: "good" }),
    kpi("Em negociação", brl(m.emNegocio), m.nNegocio + " em proposta, negociação ou contrato", { icone: "dinheiro", tom: "violet" }),
    kpi("A receber", brl(m.aReceber), "entradas e finais pendentes dos clientes", { icone: "dinheiro", tom: "warn" }),
    kpi("Ticket médio", m.ticket == null ? "—" : brl(m.ticket), m.ganhos + " cliente(s) ganhos", { icone: "trofeu", tom: "good" }),
    kpi("Atrasadas", String(k.late), k.late ? "veja a Agenda" : "tudo em dia", { icone: "alerta", tom: "bad", quente: k.late > 0 }));
  v.append(h("div", { class: "dash" }, hero, tiles));
  const meses = []; const d0 = new Date(); d0.setDate(1);
  for (let i = 5; i >= 0; i--) { const d = new Date(d0.getFullYear(), d0.getMonth() - i, 1); meses.push({ key: d.toLocaleDateString("sv-SE").slice(0, 7), label: MESES_C[d.getMonth()] }); }
  const rv = meses.map((x) => m.receitaPorMes[x.key] || 0); const top = Math.max(1, ...rv);
  const receita = rv.some((x) => x > 0)
    ? h("div", {}, h("div", { class: "cols", role: "img", "aria-label": "Receita por mês: " + meses.map((x, i) => x.label + " " + brl(rv[i])).join(", ") }, meses.map((x, i) => h("div", { title: x.label + ": " + brl(rv[i]) }, h("i", { style: { height: (rv[i] / top) * 100 + "%" } }), rv[i] ? h("b", { class: "num", style: { bottom: (rv[i] / top) * 100 + "%" } }, brl(rv[i])) : null))),
      h("div", { class: "cols-x" }, meses.map((x) => h("span", {}, x.label))))
    : h("p", { class: "chart-empty" }, "Sem pagamentos registrados ainda. Marque entrada e final pagos na ficha do cliente.");
  const atalho = (href, icone, titulo, sub, tom) => h("a", { class: "card shortcut", href }, h("span", { class: "kpi-ico", "data-tone": tom, html: I[icone], style: tom ? { background: `var(--${tom}-bg, var(--accent-soft))`, color: `var(--${tom}-fg, var(--accent-ink))` } : null }), h("span", {}, h("b", {}, titulo), h("small", {}, sub)));
  v.append(h("div", { class: "shortcuts" },
    atalho("#/kanban", "kanban", "Kanban", m.ativos + " leads no funil"),
    atalho("#/agenda", "agenda", "Agenda", (k.late + k.hoje) + " ações para hoje ou atrasadas", "amber"),
    atalho("#/cadencia", "cadencia", "Fluxo de Cadência", k.emCad + " em cadência", "violet"),
    atalho("#/clientes", "clientes", "Clientes", m.ganhos + " ganho(s)", "green")));
  v.append(cardSec("Receita recebida por mês", "relatorios", receita));
  return v;
};
function formMetas(metas) {
  const rec = h("input", { id: "meta-rec", type: "number", min: "0", step: "50", value: metas.receitaMes || "" });
  const ab = h("input", { id: "meta-ab", type: "number", min: "0", step: "1", value: metas.abordagensSemana || "" });
  return h("form", { class: "goal-form", onsubmit: async (e) => { e.preventDefault(); st.editandoMetas = false; await salvarConfig("metas", { ...metas, receitaMes: Number(rec.value) || 0, abordagensSemana: Number(ab.value) || 0 }, "Metas salvas"); } },
    h("label", { class: "f", for: "meta-rec" }, "Receita no mês (R$)", rec), h("label", { class: "f", for: "meta-ab" }, "Abordagens por semana", ab),
    h("button", { class: "btn primary sm", type: "submit" }, "Salvar"), h("button", { class: "btn ghost sm", type: "button", onclick: () => { st.editandoMetas = false; render(true); } }, "Cancelar"));
}

/* ================= Templates ================= */
const VARS = [["nome", "primeiro nome do contato (sem nome: \"pessoal da {empresa}\" no 1º, \"tudo bem?\" nos demais)"], ["empresa", "nome da empresa (sem o complemento após o travessão)"], ["seunome", "Pedro"], ["gancho", "fato real do perfil (dossiê)"], ["problema", "principal falha do site atual"], ["demo", "link da demo"], ["nicho", "segmento em minúsculas"], ["cidade", "cidade"], ["instagram", "@ do Instagram"]];
const varsDe = (pb) => (pb === "hotelaria" ? VARS.map(([k, d]) => [k, k === "problema" ? "frase verificada da busca pelo nome no Google (com print)" : d]) : VARS);
const AMOSTRA = {
  sites: { id: "x", empresa: "Doces da Maria", nome: "Maria", segmento: "Confeitaria", cidade: "Recife", instagram: "docesdamaria", gancho: "adorei o bolo de rolo do último post", problema: "o link da bio leva só para o WhatsApp", demo: "https://exemplo.vercel.app" },
  hotelaria: { id: "x", empresa: "Pousada Maré Alta", nome: "Ana", segmento: "Hotelaria", cidade: "Pipa", instagram: "pousadamarealta", gancho: "adorei a vista do café da manhã no último post", problema: "o primeiro resultado é o anúncio da Booking, antes do perfil de vocês", demo: "https://exemplo.vercel.app" },
};
// Seletor do conjunto de textos (Templates, Roteiro e Objeções). Fica lembrado neste navegador.
const pbAtual = () => (st.filtros.playbook.pb === "hotelaria" ? "hotelaria" : "sites");
function seletorPlaybook(aoMudar = () => render(true)) {
  const atual = pbAtual();
  return h("div", { class: "seg", role: "group", "aria-label": "Linha de venda" }, Object.entries(PLAYBOOKS).map(([k, p]) =>
    h("button", { type: "button", "aria-pressed": String(atual === k), onclick: () => { st.filtros.playbook.pb = k; gravarFiltros(); aoMudar(); } }, p.label)));
}
VIEWS.templates = () => {
  const pb = pbAtual();
  if (!st.tplDraft || st.tplDraft.pb !== pb) st.tplDraft = { pb, passos: JSON.parse(JSON.stringify(passos(pb))), noShow: JSON.parse(JSON.stringify(noShowCfg(pb))) };
  const doPb = leads().filter((l) => playbookDe(l) === pb);
  const comDemo = doPb.filter((l) => l.demo);
  if (!st.tplLead || !doPb.some((l) => l.id === st.tplLead)) st.tplLead = (comDemo[0] || doPb[0] || {}).id || "";
  const amostra = lead(st.tplLead) || AMOSTRA[pb];
  const v = h("div", { class: "view" });
  const leadSel = selectField("tpl-lead", "Lead da prévia", doPb.length ? doPb.map((l) => [l.id, (empresaCurta(l.empresa) || l.nome) + (l.demo ? " (com demo)" : "")]) : [["", "Exemplo (sem leads deste segmento)"]], st.tplLead, (x) => { st.tplLead = x; render(true); });
  v.append(viewHead("Templates", "Os 5 templates da cadência e o de no-show, por linha de venda: leads com segmento \"Hotelaria\" usam os do Método Reserva Direta; os demais, os de sites. A espera é em dias úteis; o canal define se o botão Enviar abre o Instagram ou o WhatsApp.", h("label", { class: "f", for: "tpl-lead", style: { minWidth: "240px" } }, "Prévia com o lead", leadSel), "Ferramentas"));
  v.append(h("div", { class: "toolbar" }, seletorPlaybook()));
  if (pb === "sites" && cadenciaV1()) v.append(h("div", { class: "notice info", role: "note" }, h("span", { html: I.info, style: { display: "contents" } }), "O banco ainda tem a cadência antiga (v1). Estes são os templates padrão da v2; ao salvar qualquer um, a cadência v2 completa passa a valer."));
  let ultimoTa = null;
  const cartao = (p, i, noShow) => {
    const pre = noShow ? "ns" : "t" + i;
    const prev = h("div", { class: "preview" });
    const ta = h("textarea", { id: pre + "-texto", style: { minHeight: "150px" } }); ta.value = p.texto || "";
    const taSem = "textoSemDemo" in p ? h("textarea", { id: pre + "-sem", style: { minHeight: "110px" } }) : null; if (taSem) taSem.value = p.textoSemDemo || "";
    const nota = noShow ? null : h("textarea", { id: pre + "-nota", style: { minHeight: "60px" } }); if (nota) nota.value = p.nota || "";
    const nome = noShow ? null : h("input", { id: pre + "-nome", value: p.nome || "" });
    const canal = h("select", { id: pre + "-canal" }, h("option", { value: "instagram" }, "Instagram (DM)"), h("option", { value: "whatsapp" }, "WhatsApp")); canal.value = p.canal || "whatsapp";
    const espera = noShow ? null : h("input", { id: pre + "-espera", type: "number", min: "0", max: "30", value: p.esperaDiasUteis ?? 1 });
    const chip = h("span", { style: { display: "contents" } });
    const atualizar = () => {
      p.texto = ta.value; if (taSem) p.textoSemDemo = taSem.value; if (nota) p.nota = nota.value; if (nome) p.nome = nome.value; p.canal = canal.value; if (espera) p.esperaDiasUteis = Math.max(0, Math.min(30, Math.round(Number(espera.value) || 0)));
      chip.replaceChildren(canalChip(p.canal));
      const base = taSem && !amostra.demo ? taSem.value : ta.value;
      prev.innerHTML = realce(preencher(base, amostra, { passo: noShow ? -1 : i }));
    };
    [ta, taSem, nota, nome, canal, espera].filter(Boolean).forEach((x) => { x.addEventListener("input", atualizar); x.addEventListener("change", atualizar); });
    [ta, taSem].filter(Boolean).forEach((x) => x.addEventListener("focus", () => (ultimoTa = x)));
    atualizar();
    const salvarBtn = h("button", { class: "btn primary sm", type: "button", onclick: async () => {
      if (!ta.value.trim()) { toast("O texto não pode ficar vazio.", { ruim: true }); return; }
      if (noShow) { await salvarConfig(chaveConfig("noShow", pb), { canal: p.canal, texto: p.texto }, "Template de no-show salvo"); return; }
      const atuais = JSON.parse(JSON.stringify(passos(pb)));
      atuais[i] = { ...p };
      await salvarConfig(chaveConfig("cadencia", pb), { versao: 2, passos: atuais }, "“" + (p.nome || ordemNum(i)) + "” salvo");
    } }, "Salvar");
    const vars = h("div", { class: "vars" }, varsDe(pb).map(([k]) => h("button", { class: "var", type: "button", title: "Inserir {" + k + "}", onclick: () => {
      const alvo = ultimoTa && ultimoTa.closest("section") === sec ? ultimoTa : ta;
      const s0 = alvo.selectionStart ?? alvo.value.length, s1 = alvo.selectionEnd ?? s0;
      alvo.value = alvo.value.slice(0, s0) + "{" + k + "}" + alvo.value.slice(s1); alvo.focus(); alvo.selectionStart = alvo.selectionEnd = s0 + k.length + 2; atualizar();
    } }, "{" + k + "}")));
    const sec = h("section", { class: "card tpl" },
      h("div", { class: "tpl-head" }, h("span", { class: "tpl-num" }, noShow ? "NS" : String(i + 1)), h("h2", { style: { margin: 0, fontSize: "15px" } }, noShow ? "No-show da conversa" : p.nome || ordemNum(i)), chip),
      noShow ? h("div", { class: "tpl-row", style: { gridTemplateColumns: "200px" } }, h("label", { class: "f", for: pre + "-canal" }, "Canal", canal))
        : h("div", { class: "tpl-row" }, h("label", { class: "f", for: pre + "-nome" }, "Nome", nome), h("label", { class: "f", for: pre + "-canal" }, "Canal", canal), h("label", { class: "f", for: pre + "-espera" }, "Espera (dias úteis)", espera)),
      h("label", { class: "f", for: pre + "-texto" }, "Texto", ta),
      taSem ? h("label", { class: "f", for: pre + "-sem" }, "Texto alternativo (lead sem demo)", taSem) : null,
      vars,
      nota ? h("label", { class: "f", for: pre + "-nota" }, "Nota de uso", nota) : null,
      h("div", { class: "f" }, h("span", { class: "hint" }, "Prévia com " + (empresaCurta(amostra.empresa) || amostra.nome) + (taSem ? (amostra.demo ? " (usa o texto com demo)" : " (usa o texto sem demo)") : "")), prev),
      h("div", {}, salvarBtn));
    return sec;
  };
  const lista = h("div", { style: { display: "grid", gap: "14px" } }, st.tplDraft.passos.map((p, i) => cartao(p, i, false)), cartao(st.tplDraft.noShow, 0, true));
  const lado = h("aside", { class: "card side-note" }, h("h2", {}, "Variáveis"), h("ul", {}, varsDe(pb).map(([k, d]) => h("li", {}, h("code", {}, "{" + k + "}"), " " + d))),
    h("h2", {}, "Colchetes"), h("p", { style: { margin: 0 } }, "Trechos entre [colchetes] são preenchidos à mão na hora de enviar. O app destaca e avisa antes de enviar."),
    h("h2", {}, "Mensagem dos agentes"), h("p", { style: { margin: 0 } }, "Se o lead tiver mensagemProxima (escrita pelo Quico ou pela Vera), ela substitui o template do passo atual e é limpa ao enviar."));
  v.append(h("div", { class: "tpl-grid" }, lista, lado));
  return v;
};

/* ================= Roteiro e Objeções ================= */
function textoRico(t, l) {
  let s = esc(l ? String(t).replace(/\{(\w+)\}/g, (m, k) => { const r = preencher("{" + k + "}", l); return r.startsWith("[") ? m : r; }) : t);
  s = s.replace(/\[[^\]]{1,60}\]/g, (m) => `<span class="ph">${m}</span>`).replace(/\{(\w+)\}/g, (m) => `<span class="vr">${m}</span>`);
  return s;
}
function conteudoRoteiro(l, pb) {
  return h("div", { class: "script" }, (roteiroCfg(pb || l).blocos || []).map((b) => h("section", { class: "card block" },
    h("h2", {}, b.titulo), h("p", {}, b.orientacao), h("ul", { class: "falas" }, (b.falas || []).map((f) => h("li", { html: textoRico(f, l) }))))));
}
VIEWS.roteiro = () => {
  const pb = pbAtual();
  const n = (roteiroCfg(pb).blocos || []).length;
  const v = h("div", { class: "view", style: { maxWidth: "900px" } });
  v.append(viewHead("Roteiro de Ligação", n + " blocos com orientação e falas. Trechos entre [colchetes] você completa na hora; {variáveis} vêm do lead (na ficha, o roteiro abre já preenchido e no conjunto do segmento do lead).", null, "Ferramentas"));
  v.append(h("div", { class: "toolbar" }, seletorPlaybook()));
  v.append(conteudoRoteiro(null, pb));
  return v;
};
const CAT = { qualificacao: ["Qualificação", "sky"], proposta: ["Proposta", "amber"], ambos: ["Ambos", "violet"] };
function conteudoObjecoes(estado, aoMudar, pb) {
  const itens = (objecoesCfg(pb).itens || []).filter((o) => (!estado.cat || o.categoria === estado.cat || (estado.cat !== "ambos" && o.categoria === "ambos")) && (!estado.q || (o.titulo + " " + o.conducao).toLowerCase().includes(estado.q.toLowerCase())));
  const seg = h("div", { class: "seg", role: "group", "aria-label": "Categoria" }, [["", "Todas"], ["qualificacao", "Qualificação"], ["proposta", "Proposta"], ["ambos", "Ambos"]].map(([k, t]) => h("button", { type: "button", "aria-pressed": String(estado.cat === k), onclick: () => { estado.cat = k; aoMudar(); } }, t)));
  const lista = h("div", { class: "obj-list" }, itens.length ? itens.map((o) => h("article", { class: "card obj" }, h("div", {}, pill(CAT[o.categoria][0], CAT[o.categoria][1], "dot")), h("h3", {}, o.titulo), h("p", {}, o.conducao))) : h("p", { class: "faint" }, "Nenhuma objeção encontrada."));
  return { seg, lista };
}
VIEWS.objecoes = () => {
  const est = st.filtros.obj;
  const v = h("div", { class: "view" });
  const pb = pbAtual();
  const { seg, lista } = conteudoObjecoes(est, () => render(true), pb);
  const caixa = h("div", { id: "obj-box" }, lista);
  v.append(viewHead("Matriz de Objeções", "Como conduzir as objeções mais comuns. Qualificação: ligação e diagnóstico. Proposta: apresentação e negociação. \"Ambos\" aparece nos dois filtros.", null, "Ferramentas"));
  v.append(h("div", { class: "toolbar" }, seletorPlaybook()));
  v.append(h("div", { class: "toolbar" }, seg, buscaField("obj-q", "Buscar objeção", est.q, (x) => { est.q = x; caixa.replaceChildren(conteudoObjecoes(est, () => render(true), pb).lista); })));
  v.append(caixa);
  return v;
};
const subPlaybook = (l) => (l ? nomeLead(l) + (ehHotelaria(l) ? " · " + PLAYBOOKS.hotelaria.label : "") : null);
function abrirRoteiro(l) { painelLateral({ titulo: "Roteiro de ligação", sub: subPlaybook(l), corpo: conteudoRoteiro(l) }); }
function abrirObjecoes(l) {
  const est = { cat: ["proposta", "negociacao", "contrato"].includes(l && l.etapa) ? "proposta" : "qualificacao", q: "" };
  const box = h("div", { style: { display: "grid", gap: "12px" } });
  const desenhar = () => { const { seg, lista } = conteudoObjecoes(est, desenhar, playbookDe(l)); lista.style.gridTemplateColumns = "minmax(0,1fr)"; box.replaceChildren(seg, lista); };
  desenhar();
  painelLateral({ titulo: "Matriz de objeções", sub: subPlaybook(l), corpo: box });
}

/* ================= Busca global (⌘K) ================= */
function abrirBusca() {
  if (pilhaCamadas.length) return;
  const inp = h("input", { class: "field", type: "search", id: "busca-global", placeholder: "Nome, empresa ou @", autocomplete: "off", "aria-label": "Buscar lead", "aria-controls": "busca-res" });
  const res = h("div", { class: "k-res", id: "busca-res", role: "listbox" });
  let sel = 0, achados = [];
  const desenhar = () => {
    const q = inp.value.trim();
    achados = (q ? leads().filter((l) => casa(l, q)) : leads().slice().sort((a, b) => String(b.atualizadoEm || "").localeCompare(String(a.atualizadoEm || "")))).slice(0, 12);
    sel = Math.min(sel, Math.max(0, achados.length - 1));
    inp.setAttribute("aria-activedescendant", achados.length ? "busca-op-" + sel : "");
    res.replaceChildren(...(achados.length ? achados.map((l, i) => h("a", { href: linkLead(l.id), id: "busca-op-" + i, role: "option", "aria-selected": String(i === sel), onclick: () => fechar() },
      h("span", { style: { flex: 1, minWidth: 0 } }, h("b", {}, empresaCurta(l.empresa) || l.nome || "Sem nome"), h("br"), h("small", {}, [contato(l), l.instagram ? "@" + handle(l.instagram) : ""].filter(Boolean).join(" · "))), etapaPill(l.etapa)))
      : [h("p", { class: "faint", style: { margin: "6px" } }, "Nenhum lead encontrado.")]));
  };
  inp.addEventListener("input", () => { sel = 0; desenhar(); });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(achados.length - 1, sel + 1); desenhar(); res.querySelector("[aria-selected=true]")?.scrollIntoView({ block: "nearest" }); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); desenhar(); res.querySelector("[aria-selected=true]")?.scrollIntoView({ block: "nearest" }); }
    if (e.key === "Enter" && achados[sel]) { e.preventDefault(); fechar(); irPara(linkLead(achados[sel].id)); }
  });
  desenhar();
  let fechar = () => {};
  modal({ titulo: "Buscar lead", corpo: h("div", { style: { display: "grid", gap: "10px" } }, inp, res, h("p", { class: "hint", style: { margin: 0 } }, "↑ ↓ para escolher · Enter abre a ficha · Esc fecha")), semRodape: true, largura: 560 });
  fechar = () => { const top = pilhaCamadas[pilhaCamadas.length - 1]; if (top) top.fechar(); };
}

/* ================= Login e conexão ================= */
function telaLogin(client) {
  return new Promise((resolve) => {
    const pass = h("input", { id: "login-senha", type: "password", autocomplete: "current-password", required: true });
    const err = h("p", { class: "modal-err", hidden: true, role: "alert" });
    const btn = h("button", { class: "btn primary", type: "submit", style: { width: "100%" } }, "Entrar");
    const tela = h("div", { class: "scrim", style: { background: "radial-gradient(80% 60% at 50% 0%, rgb(194 70 44 / 0.22), transparent), var(--bg)" } },
      h("form", { class: "card", style: { width: "min(400px,100%)", padding: "28px", display: "grid", gap: "16px", boxShadow: "var(--shadow-lift)" }, onsubmit: async (e) => {
        e.preventDefault(); btn.disabled = true; err.hidden = true;
        const key = pass.value.trim();
        try { await client.query("docs:check", { key }); }
        catch (ex) { btn.disabled = false; err.textContent = ehErroSenha(ex) ? "Senha incorreta." : "Sem conexão com o banco. Tente de novo."; err.hidden = false; return; }
        gravarSenha(key); tela.remove(); resolve(key);
      } },
        h("div", { style: { display: "flex", gap: "12px", alignItems: "center" } }, h("span", { class: "brand-mark", "aria-hidden": "true" }, "RD"), h("span", { class: "brand-txt" }, "RD Solutions", h("small", {}, "Entre para ver seus leads"))),
        h("label", { class: "f", for: "login-senha" }, "Senha do CRM", pass), err, btn));
    document.body.append(tela);
    setTimeout(() => pass.focus(), 30);
  });
}
const lerSenha = () => { try { return localStorage.getItem("crm-senha") || ""; } catch (e) { return ""; } };
const gravarSenha = (k) => { try { k ? localStorage.setItem("crm-senha", k) : localStorage.removeItem("crm-senha"); } catch (e) { /* sem armazenamento */ } };
function sair() { gravarSenha(""); location.reload(); }
function setLive(txt, estado) { const el = $("#live"); el.textContent = txt; delete el.dataset.on; delete el.dataset.off; if (estado) el.dataset[estado] = ""; }

async function iniciar() {
  $("#menu-btn").addEventListener("click", abrirMenuLateral);
  $("#side-close").addEventListener("click", fecharMenuLateral);
  $("#side-scrim").addEventListener("click", fecharMenuLateral);
  $("#search-btn").addEventListener("click", abrirBusca);
  $("#btn-sair").addEventListener("click", sair);
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abrirBusca(); }
    if (e.key === "Escape" && $("#side").dataset.open !== undefined) fecharMenuLateral();
  });
  window.addEventListener("hashchange", () => {
    const nova = lerRota();
    if (nova.nome !== "lead") st.voltarPara = nova.nome;
    if (nova.nome !== "templates") st.tplDraft = null;
    st.rota = nova; fecharMenus(); fecharMenuLateral();
    render(true); window.scrollTo(0, 0); $("#main").focus({ preventScroll: true });
  });
  st.rota = lerRota();
  st.voltarPara = st.rota.nome === "lead" ? "kanban" : st.rota.nome;
  if (!location.hash) history.replaceState(null, "", "#/kanban");
  const cfg = window.CRM_CONVEX;
  if (!cfg || !cfg.url || !window.convex) {
    $("#main").replaceChildren(h("div", { class: "notice bad" }, "Não foi possível carregar a conexão com o banco (config.js ou o pacote do Convex). Recarregue a página."));
    setLive("Sem banco", "off"); return;
  }
  const client = new window.convex.ConvexClient(cfg.url);
  let key = lerSenha();
  if (key) { try { await client.query("docs:check", { key }); } catch (e) { if (ehErroSenha(e)) { gravarSenha(""); key = ""; } } }
  if (!key) key = await telaLogin(client);
  st.client = client; st.key = key; st.ready = true;
  $("#btn-sair").hidden = false;
  render(true);
  client.onUpdate("docs:list", { key, collection: "leads" }, (rows) => {
    st.base = new Map(rows.map((r) => [r.id, r.data]));
    st.raw = new Map(rows.map((r) => [r.id, comPendentes(r.id, r.data)]));
    mexeu();
    st.loaded.leads = true;
    setLive(rows.length + (rows.length === 1 ? " lead" : " leads") + " · ao vivo", "on");
    for (const id of [...st.selecionados]) if (!st.raw.has(id)) st.selecionados.delete(id);
    render();
  }, (e) => { if (ehErroSenha(e)) return sair(); setLive("Conexão perdida", "off"); });
  client.onUpdate("docs:list", { key, collection: "config" }, (rows) => {
    st.config = Object.fromEntries(rows.map((r) => [r.id, r.data]));
    st.loaded.config = true;
    cacheAcoes = new WeakMap();
    if (st.rota.nome !== "templates") render();
  }, () => {});
  // "Atrasado", "hoje" e "amanhã" dependem do relógio: redesenha ao virar o dia e ao voltar para a aba.
  let dia = hojeISO();
  const revisar = () => { if (hojeISO() !== dia) { dia = hojeISO(); render(); } };
  setInterval(revisar, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { dia = ""; revisar(); } });
}
iniciar();

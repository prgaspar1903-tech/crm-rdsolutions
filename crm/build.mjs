// Gera crm/dist a partir do app v2 (crm/app/*) + crm/config.js. Sem dependências e sem etapa de compilação:
// os arquivos são copiados como estão (o app é JS puro em módulos ES).
// Rodado pela Vercel no deploy ("node crm/build.mjs"); também dá para rodar localmente.
import { readdirSync, mkdirSync, copyFileSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, "app");
const dist = join(here, "dist");
mkdirSync(dist, { recursive: true });
for (const f of readdirSync(dist)) rmSync(join(dist, f), { recursive: true, force: true }); // limpa o conteúdo (mantém a pasta)

const arquivos = readdirSync(app).filter((f) => !f.startsWith(".") && statSync(join(app, f)).isFile());
for (const f of arquivos) copyFileSync(join(app, f), join(dist, f));
copyFileSync(join(here, "config.js"), join(dist, "config.js"));
console.log(`crm/dist pronto (${arquivos.length + 1} arquivos: ${[...arquivos, "config.js"].join(", ")})`);

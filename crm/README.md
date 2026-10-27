# CRM da RD Solutions (app próprio)

**Endereço:** https://crm-estudio-pi.vercel.app (entre com a senha do CRM)

É o **CRM da RD Solutions v2** (estrutura do CRM da DPlay + Banco de Leads no estilo Monday; especificação em `crm/ESPEC-CRM-V2.md`):
- na **Vercel pessoal** do Pedro (conta `prgaspar1903-tech`, time `pedro-rocha`, projeto `crm-estudio`);
- com banco no **Convex** (conta pr.gaspar1903@gmail.com, projeto `crm-estudio`, deploy de produção `brazen-duck-740`);
- com acesso por **senha do CRM**, conferida no servidor em toda leitura e gravação. Ela fica salva no navegador depois do primeiro login. O botão "Sair" (rodapé do menu) apaga a senha salva.

```
crm/app/index.html         ← casca da interface (menu lateral, busca ⌘K, indicador "ao vivo")
crm/app/styles.css         ← tema escuro (estilo DPlay)
crm/app/app.js             ← o app (JS puro, módulo ES, sem framework): telas, regras, conexão Convex
crm/app/padroes.js         ← etapas, regras, dias úteis/feriados e textos padrão (cadência v2, no-show, roteiro, objeções); usado também pela migração
crm/build.mjs              ← copia crm/app/* + crm/config.js para crm/dist/ (sem compilação)
crm/config.js              ← URL pública do Convex (produção)
crm/convex/                ← backend: schema.ts (tabela docs) e docs.ts (funções com checagem de senha: list, get, set, create, update com append, updateMany, remove, importMany)
crm/scripts/crm.mjs        ← linha de comando que os agentes usam para ler e gravar leads
crm/scripts/migrar-v2.mjs  ← migração dos leads e da config para a v2 (simulação por padrão)
crm/.env.local             ← CRM_CONVEX_URL e CRM_SENHA (secreto; fora do Git e da Vercel)
~/.ponttosquad/crm.env      ← cópia fora do iCloud, lida primeiro pelo crm.mjs (o iCloud tira o .env.local do Mac e trava o CLI)
painel/painel-leads.html   ← interface antiga (v1), mantida como legado até a v2 ser aprovada
vercel.json, .vercelignore ← deploy (só a interface vai para a Vercel)
```

## Como usar a v2
- **Telas** (menu lateral): Painel · Kanban · Fluxo de Cadência · Banco de Leads · Agenda Comercial · Relatórios · Clientes · Templates · Roteiro de Ligação · Matriz de Objeções. Rotas por hash (`#/kanban`, `#/lead/<id>` etc.). **⌘K** (ou Ctrl+K) abre a busca por nome, empresa ou @.
- **Kanban:** 10 etapas (Novo lead → Primeiro contato → Cadência → Conversa de diagnóstico → Diagnóstico → Proposta → Negociação → Contrato → Ganho · Encerrados). Arraste com o mouse; no celular, pelo ícone de pontinhos. Cadência, Conversa, Encerrados e Ganho pedem os dados antes de mover. Toda ação importante mostra um aviso com **Desfazer**.
- **Fluxo de Cadência:** colunas por template. **Enviar** abre um painel com a mensagem pronta (editável; avisa se ainda houver `[colchetes]`): no WhatsApp abre `wa.me` com número e texto; no Instagram copia o texto e abre a DM (`ig.me/m/<@>`). O clique registra o envio e agenda o próximo em **dias úteis, às 9h** (sem fins de semana e feriados nacionais). **Respondeu** para a cadência e leva o lead para Primeiro contato. Depois do break-up, o card fica em "Encerrar" até vencer a espera.
- **Ficha do lead:** dados (Editar), próxima ação (Ajustar), cadência passo a passo, conversa de diagnóstico (resultado, no-show com mensagem pronta, reagendar), checklists de diagnóstico/proposta/negociação/contrato, bloco Cliente (quando ganho) e linha do tempo. Ações no topo: Registrar ligação, Lead respondeu, Roteiro, Objeções e (…) Excluir.
- **Banco de Leads:** tabela por grupo/rodada (ou etapa, segmento, temperatura), edição inline ao clicar na célula, seleção para ações em massa (mover etapa, temperatura, grupo) e **Exportar CSV** (separador `;`, abre direto no Excel).
- **Duas linhas de venda:** leads com `segmento` = `Hotelaria` usam os textos do **Método Reserva Direta** (cadência, no-show, roteiro com o bloco da recepção, objeções); os demais usam os de sites. Em Templates, Roteiro e Objeções, o seletor "Sites | Hotelaria · Método Reserva Direta" troca o conjunto. Salvar em Templates grava `config/cadencia` e `config/noShow` (sites) ou `config/cadencia_hotelaria` e `config/noShow_hotelaria` (hotelaria). Sem config salva, valem os padrões de `padroes.js`.
- **Ficha de hotelaria:** blocos **Decisor** (nome, cargo, canal e contato/rota, sócios do CNPJ, razão social/CNPJ, fonte e a pílula da faixa; na faixa "enriquecer", botão **Copiar mensagem de encaminhamento**) e **Raio-X** (quartos, diária, ocupação, % e taxa por canal, plano, busca pelo nome e print, com a conta: receita/mês, comissão/mês e economia com 15% migrando para o direto). Os dois são editáveis em Editar dados. No Kanban e no Banco de Leads, os hotéis mostram a faixa do decisor; o Banco tem a coluna **Decisor** (nome · nota) e o filtro pela faixa.
- **Nada é enviado sozinho:** todo envio depende do clique do Pedro.

## Migração para a v2 (uma vez)
```bash
node crm/scripts/migrar-v2.mjs            # simulação: mostra o que mudaria, não grava
node crm/scripts/migrar-v2.mjs --detalhes # simulação com o patch de cada lead
node crm/scripts/migrar-v2.mjs --aplicar  # grava (só depois da aprovação do Pedro)
```
Preenche `etapa` (a partir do `status`), `segmento`, `localizacao`, `origem`, `responsavel`, `temperatura`, `grupo`, `nome` e o histórico "Migrado para o CRM v2", sem apagar nenhum campo. Grava `config/cadencia` v2 (a antiga vai para `config/cadencia_v1`), `config/noShow`, `config/roteiro` e `config/objecoes`; não mexe em `config/metas`. Rodar de novo é seguro (pula o que já foi migrado). Antes da migração o app já funciona: calcula os campos novos na tela e usa os textos padrão da v2.

## Testar localmente
```bash
node crm/build.mjs
cd crm/dist && python3 -m http.server 8790   # abra http://localhost:8790 e entre com a senha
```
O app local usa o banco de **produção** (dados reais). Para testar gravações, crie um lead com id `__teste...` (`node crm/scripts/crm.mjs set leads __teste_x '{...}'`) e apague no fim.

## Como os agentes gravam
Sempre pela linha de comando, nunca editando o banco à mão:
```bash
node crm/scripts/crm.mjs list leads status=novo
node crm/scripts/crm.mjs list leads cadencia.estado=ativa             # filtro aceita caminho
node crm/scripts/crm.mjs get leads draisauria
node crm/scripts/crm.mjs set leads <id> @/caminho/lead.json        # criar
node crm/scripts/crm.mjs update leads <id> '{"demo":"https://..."}' # mesclar campos
node crm/scripts/crm.mjs note leads <id> "Proposta enviada"          # histórico
node crm/scripts/crm.mjs import arquivo.json                         # vários de uma vez (pula leads que já existem; --substituir sobrescreve)
node crm/scripts/crm.mjs etapa <id> proposta --obs "Proposta enviada" # muda a etapa com as regras do app (reuniao pede --data, encerrado --motivo, ganho --valor)
node crm/scripts/crm.mjs fase <id> entregue                           # fase do cliente (em_construcao, aprovacao_cliente, entregue, manutencao, cancelado)
node crm/scripts/crm.mjs hoje                                         # o dia comercial (base do Abrir o dia da Vera); nos hotéis, template do Método Reserva Direta e faixa do decisor
node crm/scripts/crm.mjs funil Hotelaria                              # funil com contagens e % entre etapas (sem segmento: todos; --json)
```

**Campos de hotelaria:**
- **Decisor** (gravados por `node ferramentas/verificar-decisor.mjs <arquivo> --crm`, a partir do JSON da Dora Decisora): `decisor` = `{nome, cargo, prioridade, instagram, linkedin, email, telefone, canal, rota, contato, socios[], fonte}`, `decisorScore` (0–100), `decisorFaixa` (`prospectar` ≥ 80 · `enriquecer` 50–79 · `nao_priorizar` < 50) e, quando houver, `razaoSocial` e `cnpj`. Sem `decisorScore`, o lead aparece como "decisor não pesquisado". Ao editar a nota no app, a faixa é recalculada.
- **Raio-X:** `quartos`, `diariaMedia` (R$), `ocupacao` (%), `pctBooking` (%), `pctAirbnb` (%), `taxaBooking` (%, padrão 18), `taxaAirbnb` (%, padrão 15), `plano` (Essencial · Completo · Completo + WhatsApp), `buscaNome` e `buscaNomePrint`.
- **Funil** (`funil`): leads → decisor pesquisado (tem `decisorScore`) → decisor identificado (≥ 60) → contato válido (≥ 80) → cadência iniciada → respondeu → reunião (etapa `reuniao` ou além) → proposta → ganho. Cada etapa conta quem chegou nela ou além (pela etapa atual ou pelas datas registradas).
Os campos dos leads e as regras do funil estão em `memoria/empresa.md`. O `note` (e o app) **acrescentam** no histórico pelo servidor (`append` do `docs:update`), então uma nota de agente e um clique no app ao mesmo tempo não apagam um ao outro (máx. 200 itens). O app aberto atualiza sozinho quando um agente grava. Para a mensagem do próximo template, grave `mensagemProxima` (o app usa no lugar do template e limpa ao enviar).

## Manutenção
- **Mudar a interface:** edite `crm/app/` e rode `vercel --prod --scope pedro-rocha` na raiz do projeto (o build da Vercel roda `node crm/build.mjs`). Antes, confira `vercel whoami` (precisa ser `prgaspar1903-tech`, nunca o time "pj").
- **Mudar o backend:** edite `crm/convex/` e rode `cd crm && npx convex deploy -y`. **Ordem:** quando a interface depende de função nova do backend (ex.: `docs:create`, `docs:updateMany`, `append`), publique o backend **antes** da interface.
- **Segurança da página:** `vercel.json` manda Content-Security-Policy (só scripts do próprio site e do jsDelivr; conexão só com `*.convex.cloud`). O pacote do Convex no `index.html` tem `integrity` (SRI): ao trocar a versão, recalcule com `openssl dgst -sha384 -binary node_modules/convex/dist/browser.bundle.js | openssl base64 -A`.
- **Trocar a senha:** `cd crm && npx convex env set CRM_SENHA "nova-senha" --prod`, depois atualize `CRM_SENHA` em `crm/.env.local` e em `~/.ponttosquad/crm.env` e entre de novo no painel.
- **Ver os dados:** https://dashboard.convex.dev → projeto `crm-estudio` → Production → Data.
- `npx convex dev` usa um banco de **desenvolvimento** separado (`dusty-rat-147`). Os agentes e o painel sempre usam o de produção.

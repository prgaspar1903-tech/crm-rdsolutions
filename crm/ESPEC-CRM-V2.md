# Especificação: CRM do Estúdio v2 (base: DPlay + Banco de Leads no estilo Monday)

Referência da estrutura: `crm/referencia-dplay.md` (leia antes). Decisões do Pedro (2026-10-10):
- Kanban com as **mesmas 10 etapas do DPlay**; fases de cliente numa aba **Clientes** separada.
- Botão **Enviar** da cadência **abre o WhatsApp** (wa.me) com número e texto prontos e registra o envio na hora (com "Desfazer" no toast). No Instagram não dá para preencher o texto: o botão copia o texto para a área de transferência e abre `https://ig.me/m/<instagram>` (DM).
- Cadência **mista**: Toque 1 por Instagram (DM, com a demo), os demais por WhatsApp. O canal é um campo de cada template.
- Visual **escuro estilo DPlay** (menu lateral, cards arredondados, acentos azul/roxo, contraste AA).
- Usuário único por enquanto (campo Responsável existe, padrão "Pedro").
- Nota do lead: manter **nota 0–10** (auditoria) **e** adicionar **Temperatura** (Frio / Morno / Quente).
- Nada é enviado sozinho: tudo exige o clique do Pedro.

## Arquitetura
- Novo app em `crm/app/`: `index.html`, `styles.css`, `app.js` (JS puro, sem framework, sem build step; módulos ES ok). Ícones em SVG inline. Fontes: Inter via Google Fonts.
- `crm/build.mjs` passa a copiar `crm/app/*` + `crm/config.js` para `crm/dist/` (mantendo `<script src="https://cdn.jsdelivr.net/npm/convex@1.46.0/dist/browser.bundle.js">` e `/config.js`). `vercel.json`/`.vercelignore` continuam valendo (ajuste se precisar).
- **Banco: o mesmo Convex** (`crm/convex/docs.ts`, coleções `leads` e `config`, funções `docs:list/get/set/update/remove/check`, todas com a senha `key`). Reaproveite a camada de conexão e o login por senha que existem em `painel/painel-leads.html` (seção "Modo app próprio (Convex)"): `ConvexClient`, `onUpdate("docs:list")` em tempo real, senha em localStorage, tela de login, botão Sair. **Não altere `crm/convex/`** a menos que seja indispensável.
- `crm/scripts/crm.mjs` (usado pelos agentes) tem de continuar funcionando sem mudança.
- Não apague `painel/painel-leads.html` (vira legado até o Pedro aprovar a v2).
- Roteamento por hash: `#/kanban`, `#/cadencia`, `#/banco`, `#/agenda`, `#/relatorios`, `#/clientes`, `#/painel`, `#/templates`, `#/roteiro`, `#/objecoes`, `#/lead/<id>`.
- Responsivo: funciona no celular (menu lateral vira gaveta; kanban com rolagem horizontal; tabela com rolagem horizontal e primeira coluna fixa).
- Datas em pt-BR; "dias úteis" pulam sábado, domingo e feriados nacionais (fixos + Carnaval segunda/terça, Sexta-feira Santa e Corpus Christi calculados pela Páscoa).

## Modelo de dados (coleção `leads`, id = @ do Instagram sem "@"; leads sem Instagram: slug do nome + 4 caracteres aleatórios)
Campos existentes continuam (não apague nada): `empresa, instagram, whatsapp, seguidores, nicho, cidade, uf, site, nota, oportunidade, pacote, dossie, gancho, problema, mensagemProxima, demo, valor, entradaPaga, entradaEm, finalPago, finalEm, rodadasUsadas, urlProducao, manutencao, manutencaoDesde, notas, historico, criadoEm, atualizadoEm, datas`.
Novos campos:
| Campo | Tipo | Uso |
|---|---|---|
| `nome` | texto | nome do contato (Monday "Nome") |
| `cargo` | texto | cargo do contato |
| `email` | texto | |
| `segmento` | texto | Monday "Segmento" (padrão = `nicho`) |
| `localizacao` | texto | "Cidade/UF" (padrão = `cidade/uf`) |
| `grupo` | texto | rodada/grupo do Banco (ex.: "Clínicas estéticas · Natal · out/26") |
| `origem` | enum | indicacao, instagram, site, linkedin, whatsapp, evento, prospeccao_ativa, outro |
| `origemDetalhe` | texto | quem indicou, post, evento… |
| `podeCitarIndicacao` | "sim" \| "prefiro_nao" \| "" | Monday "Por fim, podemos…" (só faz sentido com origem = indicacao) |
| `infoAdicional` | texto | Monday "Tem alguma informação adicional" |
| ~~`infoLead`~~ | — | removido em 2026-10-10 (redundante com `infoAdicional`) |
| `necessidade` | texto | necessidade percebida |
| `responsavel` | texto | padrão "Pedro" |
| `valorEstimado` | número | |
| `temperatura` | "frio" \| "morno" \| "quente" | padrão a partir da nota: ≥8 quente, 6–7 morno, ≤5 frio |
| `etapa` | enum | ver Etapas |
| `encerramento` | `{motivo, em, obs}` | motivo: perdido, sem_resposta, sem_interesse, desqualificado, contrato_nao_concluido |
| `proximaAcao` | `{texto, ate (ISO datetime), responsavel}` | |
| `primeiraLigacao` | `{em, resultado}` | |
| `ligacoes` | lista `{em, resultado, obs}` | resultados: atendeu, nao_atendeu, pediu_retorno, respondeu_whatsapp, reuniao_marcada, sem_interesse |
| `cadencia` | `{estado, passo, iniciadaEm, previstoEm, envios: [{passo, em, canal}], ciclo}` | estado: ativa, respondeu, encerrada, interrompida; passo = índice do próximo template (0–4); 5 = encerrar |
| `reuniao` | `{data (ISO datetime), status: agendada/realizada/no_show, resultado}` | Monday "Data que marcou reunião" = data |
| `checklist` | `{diagnostico:{…}, proposta:{…}, contrato:{…}}` | booleanos (itens abaixo) |
| `faseCliente` | enum | em_construcao, aprovacao_cliente, entregue, manutencao, cancelado (aba Clientes) |
`historico` ganha tipos: `etapa, whatsapp, instagram, ligacao, reuniao, nota, sistema` (manter `{em, tipo, texto}`; opcional `canal`, `cancelada`). Máx. 120 itens.

Coleção `config`: `cadencia` (v2, abaixo), `metas` (já existe: `receitaMes`, `abordagensSemana`), `roteiro`, `objecoes`, `noShow`.

## Etapas (Kanban)
`novo_lead` Novo lead · `primeiro_contato` Primeiro contato · `cadencia` Cadência (Instagram + WhatsApp) · `reuniao` Conversa de diagnóstico · `diagnostico` Diagnóstico · `proposta` Proposta · `negociacao` Negociação · `contrato` Contrato · `ganho` Ganho · `encerrado` Encerrados.
Regras ao mover (modal pede os dados antes, como no DPlay):
- → **Cadência**: confirma iniciar a cadência (precisa de Instagram ou WhatsApp); cria `cadencia {estado: ativa, passo: 0, previstoEm: agora}`, histórico "Cadência iniciada".
- → **Conversa de diagnóstico**: data e hora obrigatórias → `reuniao`; interrompe cadência ativa ("respondeu").
- → **Encerrados**: motivo obrigatório (+ observação). Cadência ativa vira "encerrada".
- → **Ganho**: valor fechado (padrão: preço do pacote) e se a entrada foi paga; cria `faseCliente: em_construcao`, histórico. (O Pedro marca entrada/final na aba Clientes.)
- Toda mudança grava `datas[etapa]` (AAAA-MM-DD) e histórico "Mudança de etapa: A → B".

## Telas
**Menu lateral** (como DPlay): marca "CRM do Estúdio", seções *Visão geral* (Painel), *Acompanhamento de Leads* (Kanban, Fluxo de Cadência, Banco de Leads, Agenda Comercial, Relatórios), *Clientes* (Clientes), *Ferramentas* (Templates, Roteiro de Ligação, Matriz de Objeções). Topo: busca global (⌘K abre busca por nome/empresa/@) e indicador "ao vivo".

1. **Kanban**: cards de indicadores (Atrasadas · Para hoje · Em cadência · Conversas em 7 dias), aviso "Há N ações para hoje ou atrasadas → Agenda", filtros (busca, etapa, responsável, temperatura), botão **Cadastrar lead**, colunas arrastáveis (mouse e toque). Card: empresa (ou nome), contato, selo da etapa + sub-passo ("Cadência · Enviar 2º template"), data da próxima ação/envio (vermelho atrasado, âmbar hoje), "→ próxima ação", chip de temperatura, link "demo" se houver. Clicar abre a ficha.
2. **Ficha do lead** (`#/lead/<id>`, página como DPlay): título, empresa, selo da etapa; ações: Registrar ligação · Lead respondeu · Roteiro · Objeções · (…) Excluir. Barra de etapas clicável (aplica as regras). Blocos:
   - *Dados do lead* (Editar): todos os campos do Banco + Instagram (link), WhatsApp (link wa.me), site atual, demo, seguidores, nota 0–10, temperatura, pacote, origem/detalhe, responsável, valor estimado, primeiro contato, cadastrado em, necessidade.
   - *Próxima ação* (Ajustar): texto, data/hora, responsável.
   - *Cadência*: os 5 passos com status (Enviado em … · canal / Previsto para … / Não enviado (interrompida) / Aguardando etapa anterior), botões Enviar (passo atual), Lead respondeu, Encerrar como "Sem resposta", Iniciar novo ciclo. Mostra a mensagem que será enviada (template preenchido; se `mensagemProxima` existir, ela substitui o template do passo atual e é limpa ao enviar) com opção de editar antes.
   - *Diagnóstico e proposta*: Conversa de diagnóstico (data, status, Registrar resultado, No-show → mostra o template de no-show para enviar, Reagendar); checklists:
     - Diagnóstico: objetivo do site identificado · pacote definido (landing/institucional) · conteúdo disponível levantado (logo, fotos, textos) · domínio verificado · preço definido
     - Proposta: proposta preparada · apresentação agendada · proposta enviada/apresentada
     - Negociação: condições de pagamento negociadas (50% + 50% ou Pix à vista −5%) · "A proposta foi aprovada?" Sim → Contrato / Não → Encerrados (perdido)
     - Contrato: termo de aceite enviado · termo aceito por escrito · cobrança da entrada enviada · entrada paga · checklist de conteúdo enviado → botão "Marcar como ganho"
   - *Linha do tempo*: Previstas (próxima ação, próximo envio, conversa agendada) e Histórico (mais recentes primeiro, ícone por tipo).
   - Modal **Registrar ligação**: data/hora, resultado (6 opções), próxima ação + até, necessidade percebida, observações; "reuniao_marcada" pede data e move para Conversa de diagnóstico; "sem_interesse" oferece encerrar.
3. **Fluxo de Cadência**: indicadores (Em cadência · Envios atrasados · Responderam (total) · Taxa de resposta), texto-guia, colunas 1º template … 4º template · Break-up · Encerrar · Responderam · Sem resposta (últimos 30 dias); cabeçalho de cada coluna "Sem resposta em N dia(s) útil(eis) → próximo"; card com empresa, contato, canal do passo (ícone Instagram/WhatsApp), "Previsto: data hora" (atrasado em vermelho) e botões **Enviar · Respondeu · Encerrar**.
   - **Enviar**: abre um painel com a mensagem preenchida (editável; se ainda houver `[colchetes]` para preencher, avisa antes) e o botão final "Abrir WhatsApp" (wa.me/<número>?text=…) ou "Copiar e abrir Instagram". Ao clicar: registra o envio (`envios`, histórico com canal), avança `passo`, calcula `previstoEm` = agora + espera em dias úteis (às 9h), toast com Desfazer.
   - Depois do Break-up enviado, o card fica em "Encerrar" até vencer a espera; aí botão "Encerrar como Sem resposta".
   - **Respondeu**: cadência `respondeu`, lead vai para "Primeiro contato" (se ainda estava em Cadência) com próxima ação "Responder o lead e marcar a conversa", hoje.
4. **Banco de Leads** (estilo Monday): grupos colapsáveis por `grupo` (título colorido + contagem), barra com Cadastrar lead · Pesquisar · Filtro (etapa, temperatura, segmento, responsável) · Agrupar por (grupo/etapa/segmento/temperatura) · Exportar CSV. Colunas (redimensionáveis não precisa; rolagem horizontal; primeira coluna fixa): Nome · Empresa · Responsável · Status do lead (= etapa, pílula colorida) · Abertura do lead (criadoEm, "set 9") · Data da conversa (reuniao.data) · Telefone (com bandeira 🇧🇷 e link wa.me) · Instagram · Cargo · Segmento (pílula colorida por segmento) · Pode citar a indicação? (Sim / Prefiro que não) · Informação adicional · Nota (0–10) · Temperatura (FRIO/MORNO/QUENTE pílula) · Localização · Demo. **Edição inline** ao clicar na célula (texto → input; enums → menu de pílulas), salvando no banco. Clicar no nome abre a ficha. Checkbox por linha para ações em massa: mover etapa, mudar temperatura, mudar grupo.
5. **Agenda Comercial**: lista agrupada (Atrasadas · Hoje · Próximos 7 dias · Depois) juntando próximas ações, envios de cadência previstos e conversas agendadas; filtros por etapa e responsável; cada item com lead, etapa, ação, data e atalho (Enviar / Abrir ficha). Seção "Conversas e apresentações" ("Já passou — registre o resultado").
6. **Relatórios**: período (30/90/365 dias/tudo); indicadores: Leads no período · Ganhos (+ R$ fechados) · Taxa de conversão (ganhos ÷ encerrados+ganhos) · Ciclo médio até o ganho (dias) · Taxa de resposta da cadência (respondeu ÷ iniciaram) · Em qual template responderam · Conversas realizadas · Sem resposta · Perdidos; gráficos de barras horizontais: Funil por etapa (incluindo motivos de encerramento), Origem dos leads (com ganhos), Por segmento, Por temperatura, Motivos de perda. Barras em SVG/HTML puro, acessíveis, com valores visíveis.
7. **Clientes**: kanban/lista dos leads `ganho` por `faseCliente` (Em construção · Aprovação do cliente · Entregue · Manutenção · Cancelado) com valor, entrada paga/data, final pago/data, rodadas usadas, URL de produção, manutenção (R$ 150/mês desde …). Port do que já existe na ficha do painel antigo.
8. **Painel** (visão geral): porte do "Painel" atual (receita recebida no mês vs meta `config/metas.receitaMes`, abordagens na semana vs meta, manutenção recorrente, a receber, ticket médio, editar metas) + atalhos para Kanban/Agenda.
9. **Templates**: editor dos 5 templates da cadência + No-show: nome, canal (Instagram/WhatsApp), dias úteis de espera, texto (textarea), texto alternativo sem demo (só onde existir), nota de uso; legenda das variáveis; botão Salvar por template; prévia preenchida com um lead escolhido.
10. **Roteiro de Ligação** e **Matriz de Objeções**: renderizam `config/roteiro` e `config/objecoes` (filtro Qualificação/Proposta/Ambos, busca). Também abrem como painel lateral a partir da ficha.

**Variáveis dos templates** (chaves): `{nome}` (primeiro nome do contato; se vazio, "pessoal da {empresa}" no T1 e "tudo bem?" sem nome nos demais), `{empresa}`, `{seunome}` (= "Pedro"), `{gancho}`, `{problema}`, `{demo}`, `{nicho}` (segmento em minúsculas), `{cidade}`, `{instagram}`. Trechos entre `[colchetes]` são preenchimento manual (o app destaca e avisa antes de enviar). Se o template tem `textoSemDemo` e o lead não tem `demo`, usa `textoSemDemo`.

## config/cadencia (v2) — `{ versao: 2, passos: [...] }`
1. `{ nome: "1º template — Abordagem", canal: "instagram", esperaDiasUteis: 1, nota: "Use o gancho e o problema reais do perfil. Se o lead responder em qualquer etapa, clique em Respondeu e conduza a conversa.", texto:
"Oi, {nome}! Tudo bem? Acompanho o perfil da {empresa} e {gancho}.\n\nReparei que {problema}. Eu crio sites sob medida a partir da identidade que vocês já têm no Instagram, e montei uma prévia de como poderia ficar: {demo}\n\nÉ só uma ideia: não está no Google e eu apago se você preferir. O que achou?",
textoSemDemo: "Oi, {nome}! Tudo bem? Acompanho o perfil da {empresa} e {gancho}.\n\nReparei que {problema}. Eu crio sites sob medida a partir da identidade que vocês já têm no Instagram, para quem procura no Google encontrar e chamar no WhatsApp.\n\nPosso te mostrar uma ideia de como ficaria?" }`
2. `{ nome: "2º template — Retomada no WhatsApp", canal: "whatsapp", esperaDiasUteis: 2, texto:
"Oi, {nome}! Aqui é o {seunome}, te chamei no Instagram sobre o site da {empresa}.\n\nHoje quem pesquisa \"{nicho} em {cidade}\" no Google encontra primeiro quem tem site, e o link da bio não aparece lá. Uma página rápida no celular, com botão de WhatsApp, já muda isso.\n\nPosso te ligar 5 minutinhos para mostrar a ideia? [dia e horário] funciona para você?" }`
3. `{ nome: "3º template — Prévia / exemplo", canal: "whatsapp", esperaDiasUteis: 2, texto:
"Oi, {nome}! Deixo aqui a prévia que montei para a {empresa}, para você abrir com calma no celular: {demo}\n\nRepare no botão de WhatsApp no topo e na seção de serviços: é isso que faz quem te encontra no Google virar agendamento. Faz sentido para o momento de vocês?",
textoSemDemo: "Oi, {nome}! Para ficar mais claro o tipo de trabalho, deixo aqui um exemplo de site no mesmo estilo: [link do exemplo]\n\nÉ uma página rápida no celular, com a identidade do Instagram e botão de WhatsApp em destaque. Faz sentido algo assim para a {empresa}?" }`
4. `{ nome: "4º template — Fechando a agenda", canal: "whatsapp", esperaDiasUteis: 3, texto:
"Oi, {nome}! Estou fechando a agenda de sites que vamos entregar este mês e queria incluir a {empresa}.\n\nA landing page sai por R$ 797 e fica pronta em 7 dias, já com a cara do seu Instagram. Ainda consigo encaixar vocês.\n\nSe fizer sentido, te ligo e em 5 minutos explico como funciona, ou me chama aqui quando puder!" }`
5. `{ nome: "Break-up", canal: "whatsapp", esperaDiasUteis: 2, nota: "Se não responder em 2 dias úteis, encerre como \"Sem resposta\" (o histórico fica para uma retomada). Não envie outra mensagem nesse intervalo.", texto:
"Oi, {nome}! Imagino que a rotina esteja corrida, então vou parar de mandar mensagem por aqui para não incomodar.\n\nSe em algum momento quiserem um site com a cara da {empresa}, é só me chamar. Sucesso para vocês!" }`
`config/noShow`: `{ canal: "whatsapp", texto: "Oi, {nome}! Tudo bem? Senti sua falta na nossa conversa sobre o site da {empresa}. Imagino que tenha surgido algum imprevisto.\n\nPodemos remarcar? Tenho [dia e horário] ou [dia e horário]. Qual fica melhor para você?" }`
(Preços e prazos vêm de `memoria/empresa.md`: landing R$ 797 / 7 dias; institucional R$ 997 / 14 dias; manutenção R$ 150/mês.)

## config/roteiro — `{ blocos: [{titulo, orientacao, falas: [..]}] }`
1. **Apresentação — quem você é e de onde veio o contato.** Orientação: diga seu nome e como chegou até a empresa (o perfil do Instagram, uma indicação — cite quem indicou, se ele autorizou). Contexto quebra a frieza. Falas: "Oi, [nome]? Aqui é o Pedro, eu crio sites para negócios de {cidade}. Você consegue falar comigo por 3 minutinhos?" · "Encontrei vocês pelo Instagram: [fato real do perfil]. Por isso resolvi te ligar."
2. **Início da conversa.** Orientação: uma frase sobre o que você faz e pergunte se ele viu a mensagem/prévia. Falas: "Você chegou a ver a prévia de site que eu te mandei no Instagram?" · [Se sim] "E aí, o que achou?" · [Se não] "Eu montei uma ideia de como ficaria o site da {empresa} usando as fotos do perfil. Posso te mandar agora pelo WhatsApp?"
3. **Identificação da necessidade.** Orientação: perguntas abertas; descubra como os clientes chegam hoje e o que se perde. Falas: "Hoje, como os clientes novos chegam até vocês?" · "Quando alguém procura {nicho} em {cidade} no Google, vocês aparecem?" · "Tem algum serviço que vocês querem vender mais?"
4. **Conexão entre a necessidade e o site.** Orientação: resuma com as palavras dele antes de oferecer; não prometa resultado. Falas: "Então, pelo que entendi, hoje vocês dependem de [canal citado] e quem procura no Google acaba [problema citado]. É esse o ponto que vocês querem melhorar?"
5. **Convite para a conversa de diagnóstico.** Orientação: se houver interesse, proponha 15–20 minutos (vídeo ou ligação) para entender o que entra no site; ofereça duas opções de horário. Falas: "Vale a gente conversar 15 minutinhos para eu entender o que entra no site e te passar valor e prazo certinhos. Tenho [dia e horário] ou [dia e horário]. Qual fica melhor?"
6. **Encerramento e registro no CRM.** Orientação: confirme o combinado; depois registre resultado, necessidade, próxima ação e data. Falas: "Combinado, [nome]. Te mando a confirmação no WhatsApp para [dia], às [horário]. Obrigado!"

## config/objecoes — `{ itens: [{titulo, categoria: "qualificacao"|"proposta"|"ambos", conducao}] }`
Escreva a condução de cada uma em 2–4 frases, tom próximo e direto, **sem inventar cases, números ou garantias** (o estúdio ainda não tem cases publicados; use a demo como prova). Itens:
- Qualificação: Sem tempo · "Não preciso de site, o Instagram já basta" · "Manda por WhatsApp/e-mail" · "Meu negócio é pequeno, não é hora" · "Não sei o que colocaria no site" · Prefere falar pessoalmente · Não decide sozinho (sócio/marido/esposa) · "Como vocês conseguiram meu contato e minhas fotos?" (explicar: perfil e ficha do Google são públicos; a prévia não está no Google e é apagada se ele pedir)
- Ambos: "Já tenho site e funciona" · "Já tenho agência, freelancer ou sobrinho que faz" · Outras prioridades / "agora não é o momento" · Não confia em estúdio novo/pequeno (mostrar a demo, pagamento 50/50, código e conteúdo são dele depois de quitado)
- Proposta: Valor alto (comparar com 1 cliente novo por mês; landing como porta de entrada) · "No Wix/Canva/freelancer sai mais barato" · "Por que pagar manutenção?" (R$ 150/mês: hospedagem, SSL, backup, checagem mensal e até 1h de alterações; sem manutenção ele recebe o código) · "Só pago depois de ver pronto" (a demo já mostra; 50% entrada e 50% só na entrega, antes de publicar) · "E se o site não trouxer clientes?" (não prometer número; explicar Google + WhatsApp + credibilidade) · "E se aparecerem custos extras?" (domínio ~R$ 40/ano no registro.br é do cliente; rodada extra a partir da 3ª) · Receio de atraso (prazo conta da entrada + conteúdo; 7 ou 14 dias) · "E se eu quiser mudar algo depois?" (2 rodadas incluídas; manutenção cobre 1h/mês) · "Preciso pensar / falar com meu sócio" (combinar data de retorno e registrar a próxima ação) · Pede só o preço por mensagem · Sumiu depois de receber a proposta

## Migração (script `crm/scripts/migrar-v2.mjs`, roda via CLI, **padrão = simulação**; `--aplicar` grava)
- Para cada lead: `etapa` a partir de `status` (novo→novo_lead; abordado→cadencia com `cadencia {estado: ativa, passo: toque, previstoEm: proximoToque 09:00}`; respondeu→primeiro_contato; proposta→proposta; perdido→encerrado {motivo: perdido}; fechado/em_construcao/aprovacao_cliente/entregue/manutencao/cancelado→ganho + `faseCliente` correspondente). Preenche `segmento`=nicho, `localizacao`="cidade/uf", `origem`="prospeccao_ativa", `responsavel`="Pedro", `temperatura` pela nota, `grupo`="Clínicas estéticas · Natal · out/26" para os leads criados em 2026-10-10 (ou derivado de nicho+cidade+mês), `nome` vazio (contato a confirmar) **exceto** quando a empresa é "Dra. X …" → `nome`="Dra. X" (sem o resto). Mantém `mensagemProxima`, `demo`, `historico` e todos os campos antigos. Histórico: "Migrado para o CRM v2".
- Grava `config/cadencia` v2 (guardando a antiga em `config/cadencia_v1`), `config/noShow`, `config/roteiro`, `config/objecoes`. Não mexe em `config/metas`.
- Mostra um resumo do que mudaria e sai sem gravar se não tiver `--aplicar`.

## Qualidade
- Sem erros no console; funciona em 375, 768 e 1280 px; contraste AA no tema escuro; foco visível; botões com rótulo; `prefers-reduced-motion`.
- Teste local com `node crm/build.mjs` e um servidor estático em `crm/dist` apontando para o Convex de **desenvolvimento**? Não: o app usa o deploy de produção configurado em `crm/config.js`. Para testar sem estragar dados, rode a migração só em simulação e teste a interface com os dados atuais **sem salvar ações destrutivas**; ações de escrita podem ser testadas num lead de teste criado e apagado no fim (id começando com `__teste`).
- Entregue também: atualização do `crm/README.md` (como usar a v2) e da seção "Painel de leads e clientes (CRM)" de `memoria/empresa.md` (novos campos, etapas, cadência v2, regra de envio por clique) — mantendo a compatibilidade dos agentes (`mensagemProxima` continua valendo para o próximo template).

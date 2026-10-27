# Referência: CRM da DPlay (estrutura do "Acompanhamento de Leads")

Levantado em 2026-10-10, só leitura, na conta do Pedro. Este arquivo guarda só a **estrutura** (telas, campos, regras e modelos). Nenhum dado de lead foi copiado. É a base para reestruturar o CRM do estúdio. O "Banco de Leads" segue o print do quadro no Monday ("Indicações PTPJ 26.1").

## Menu
- **Acompanhamento de Leads:** Kanban · Fluxo de Cadência · Banco de Leads · Agenda Comercial · Relatórios
- **Ferramentas:** Templates · Roteiro de Ligação · Matriz de Objeções

## Kanban ("da primeira ligação ao contrato")
- **Indicadores no topo:** Atrasadas · Para hoje · Em cadência · Reuniões em 7 dias. Embaixo, o aviso "Há N ações para hoje ou atrasadas → Agenda".
- **Filtros:** busca (nome, empresa, contato), etapa, responsável e próxima ação.
- **Colunas:** Novo lead → Primeiro contato → Cadência de WhatsApp → Reunião de diagnóstico → Diagnóstico → Proposta → Negociação → Contrato → Ganho → Encerrados.
- **Arrastar:** etapas com regra própria (cadência, reunião, encerramento) pedem os dados antes de mover. Exemplos: data da reunião, motivo do encerramento.
- **Card:** nome, empresa, um selo com a etapa e o sub-passo ("Cadência de WhatsApp · Enviar 1º template"), a data da próxima ação (vermelha se atrasada), "→ próxima ação" e o responsável.
- **Cadastrar lead:** nome do contato*, empresa, telefone/WhatsApp, contato (e-mail, cargo), canal de origem, detalhe da origem, necessidade inicial percebida, responsável, valor estimado e observações. O lead entra como "Novo lead".
  - **Canais de origem:** Indicação, Instagram, Site, LinkedIn, WhatsApp, Evento, Prospecção ativa, Outro.

## Ficha do lead (página própria)
- **Ações no topo:** Registrar ligação · Lead respondeu · Roteiro · Objeções · menu (…).
- **Etapas:** uma barra com as etapas clicáveis.
- **Dados do lead (editável):** telefone, contato, empresa, origem, responsável, valor estimado, primeiro contato (data da ligação), cadastrado em, necessidade percebida.
- **Próxima ação:** texto, data (com aviso de atrasada) e responsável, com o botão "Ajustar".
- **Cadência de WhatsApp:** o status de cada passo:
  - 1º template "Enviada em … · WhatsApp (API)";
  - 4º "Não enviada (cadência interrompida)";
  - Break-up "Aguardando etapa anterior";
  - "Encerrar como Sem resposta".
  - Botões: "Lead respondeu" e "Iniciar novo ciclo".
- **Diagnóstico e proposta:**
  - **Reunião de diagnóstico:** data, status, "Registrar resultado", "No-show", "Reagendar".
  - **Diagnóstico (checklist):** necessidade identificada · escopo definido · custos levantados · preço definido.
  - **Proposta (checklist):** preparada · apresentação agendada · apresentada.
  - **Negociação:** condições negociadas e a pergunta "A proposta foi aprovada?" (Sim, seguir para contrato / Não).
  - **Contrato (checklist):** dados cadastrais solicitados · recebidos · contrato elaborado · enviado · ajustes solicitados.
- **Linha do tempo:**
  - *Previstas:* ações futuras com data e responsável.
  - *Histórico:* mudanças de etapa, templates enviados (canal API ou manual), reuniões, ligações e eventos do sistema. Ações canceladas aparecem riscadas.
- **Registrar ligação (modal):** roteiro de apoio, data e hora, resultado, próxima ação e prazo, necessidade percebida, observações.
  - **Resultados:** Atendeu · Não atendeu · Pediu retorno · Respondeu pelo WhatsApp · Reunião marcada · Sem interesse.

## Fluxo de Cadência
- **Regra:** "Envie cada template pelo WhatsApp com um clique. O próximo passo é lembrado em **dias úteis**; nada é enviado sem você clicar." O clique envia pela **Evolution API**; também dá para registrar envio manual.
- **Indicadores:** Em cadência · Envios atrasados · Responderam (total) · Taxa de resposta.
- **Colunas e espera em dias úteis:**

| Coluna | Espera sem resposta | Próximo passo |
|---|---|---|
| 1º template | 1 dia útil | 2º template |
| 2º template | 2 dias úteis | 3º template |
| 3º template | 2 dias úteis | 4º template |
| 4º template | 3 dias úteis | Break-up |
| Break-up | 2 dias úteis | encerrar |

  Depois vêm as colunas Encerrar · Responderam · Sem resposta (encerrados nos últimos 30 dias).
- **Card:** nome, empresa, telefone, "Previsto: data hora" (atrasado em vermelho), responsável. Botões **Enviar · Respondeu · Encerrar**.
- **Lead respondeu:** a cadência para e o restante fica "cancelado". "Iniciar novo ciclo" recomeça a cadência.

## Templates (editáveis; os campos entre colchetes são preenchidos com os dados do lead)
- **5 templates da cadência**, cada um com "dias úteis de espera" e uma nota de uso. Exemplos de nota: usar [informação observada] só com dado real; se o lead responder, interromper.
- **No-show da reunião:** pede para remarcar e oferece 2 horários.
- **Estrutura dos textos da DPlay:**
  1. apresentação + origem real do contato + pergunta sobre a dor + oferta de ligação de 5 minutos;
  2. retomada com um exemplo de dor + convite com dia e horário;
  3. link da apresentação institucional + pergunta se faz sentido;
  4. "fechando a agenda da semana" + escassez leve + oferta de ligação de 5 a 7 minutos;
  5. break-up educado, porta aberta e e-mail.

## Roteiro de Ligação (6 blocos com orientação e falas)
1. Apresentação: quem você é e de onde veio o contato.
2. Início da conversa: se já conhece a empresa e o que ela faz, em uma frase.
3. Identificação da necessidade com perguntas abertas.
4. Conexão: resumir a dor com as palavras do cliente.
5. Convite para a reunião de diagnóstico, com 2 opções de horário.
6. Encerramento e registro no CRM: necessidade, resultado, próxima ação e data.

## Matriz de Objeções
- 35 objeções, filtráveis por **Qualificação** (ligação e diagnóstico), **Proposta** (apresentação e negociação) ou **Ambos**. Cada uma tem o título e a orientação de como conduzir.
- Exemplos que se aplicam a sites:
  - Sem tempo
  - "Não preciso de site"
  - "Manda por WhatsApp"
  - "Já tenho site e funciona"
  - "Já tenho agência/freelancer"
  - "Meu negócio é pequeno"
  - "Achei mais barato no Wix/freelancer"
  - "Não entendo a mensalidade"
  - "Só pago depois de ver funcionando"
  - "Preciso pensar / falar com sócio"
  - "Pediu a proposta por mensagem e só olha o preço"
  - "Sumiu depois da proposta"
  - Receio de atraso
  - "A quem recorro se der errado?"

## Agenda Comercial
Lista de próximas ações (atrasadas primeiro), com lead, etapa, ação e responsável, além da seção "Reuniões e apresentações" ("Já passou — registre o resultado").

## Relatórios (período: últimos 90 dias)
- **Indicadores:** leads no período · ganhos (e valor em propostas) · taxa de conversão (ganhos ÷ encerrados) · ciclo médio até o ganho · taxa de resposta · diagnósticos realizados · sem resposta · perdidos.
- **Funil por etapa:** inclui Perdido, Sem resposta e Contrato não concluído.
- **Quebras:** origem dos leads (com ganhos), por responsável e motivos de perda.

## Banco de Leads (modelo: print do Monday)
- **Colunas:** Nome · Nome da empresa · SDR responsável · Status do lead · Abertura do lead · Data que marcou reunião · Telefone · Cargo do contato · Segmento · "Por fim, podemos…" (Sim / Prefiro que não) · Informação adicional · Nota do lead (Frio/Morno/Quente) · Informações do lead · Localização da empresa.
- **Status (cores):** Novo lead · Não atendeu · Reunião marcada · Sem interesse · Desqualificado.
- **Barra:** criar, pesquisar, filtrar por pessoa, filtro, agrupar por; os grupos são as rodadas ("INDICAÇÕES PTPJ 26.1").
- **DPlay (tabela simples):** lead, contato, origem, etapa, responsável, próxima ação, cadastro, com exportação para CSV.

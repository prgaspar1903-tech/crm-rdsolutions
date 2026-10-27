// CRM do Estúdio v2 — constantes, textos padrão e regras compartilhadas.
// Usado pelo app (navegador) e pelo script de migração (crm/scripts/migrar-v2.mjs, Node).
// Sem dependências e sem acesso ao DOM.

/* ---------- Etapas do kanban (iguais às do DPlay) ---------- */
export const ETAPAS = [
  { id: "novo_lead", label: "Novo lead", curto: "Novo lead", cor: "slate" },
  { id: "primeiro_contato", label: "Primeiro contato", curto: "1º contato", cor: "sky" },
  { id: "cadencia", label: "Cadência (Instagram + WhatsApp)", curto: "Cadência", cor: "blue" },
  { id: "reuniao", label: "Conversa de diagnóstico", curto: "Conversa", cor: "violet" },
  { id: "diagnostico", label: "Diagnóstico", curto: "Diagnóstico", cor: "purple" },
  { id: "proposta", label: "Proposta", curto: "Proposta", cor: "amber" },
  { id: "negociacao", label: "Negociação", curto: "Negociação", cor: "orange" },
  { id: "contrato", label: "Contrato", curto: "Contrato", cor: "teal" },
  { id: "ganho", label: "Ganho", curto: "Ganho", cor: "green" },
  { id: "encerrado", label: "Encerrados", curto: "Encerrado", cor: "red" },
];
export const ETAPA = Object.fromEntries(ETAPAS.map((e) => [e.id, e]));
export const ORDEM_ETAPAS = ETAPAS.map((e) => e.id);

/* ---------- Fases de cliente (aba Clientes) ---------- */
export const FASES = [
  { id: "em_construcao", label: "Em construção", cor: "blue" },
  { id: "aprovacao_cliente", label: "Aprovação do cliente", cor: "amber" },
  { id: "entregue", label: "Entregue", cor: "green" },
  { id: "manutencao", label: "Manutenção", cor: "teal" },
  { id: "cancelado", label: "Cancelado", cor: "red" },
];
export const FASE = Object.fromEntries(FASES.map((f) => [f.id, f]));

export const ORIGENS = [
  { id: "indicacao", label: "Indicação" },
  { id: "instagram", label: "Instagram" },
  { id: "site", label: "Site" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "evento", label: "Evento" },
  { id: "prospeccao_ativa", label: "Prospecção ativa" },
  { id: "outro", label: "Outro" },
];
export const MOTIVOS = [
  { id: "perdido", label: "Perdido" },
  { id: "sem_resposta", label: "Sem resposta" },
  { id: "sem_interesse", label: "Sem interesse" },
  { id: "desqualificado", label: "Desqualificado" },
  { id: "contrato_nao_concluido", label: "Contrato não concluído" },
];
export const RESULTADOS_LIGACAO = [
  { id: "atendeu", label: "Atendeu" },
  { id: "nao_atendeu", label: "Não atendeu" },
  { id: "pediu_retorno", label: "Pediu retorno" },
  { id: "respondeu_whatsapp", label: "Respondeu pelo WhatsApp" },
  { id: "reuniao_marcada", label: "Conversa marcada" },
  { id: "sem_interesse", label: "Sem interesse" },
];
export const TEMPERATURAS = [
  { id: "frio", label: "Frio", cor: "sky" },
  { id: "morno", label: "Morno", cor: "amber" },
  { id: "quente", label: "Quente", cor: "red" },
];
export const CITAR = [
  { id: "sim", label: "Sim" },
  { id: "prefiro_nao", label: "Prefiro que não" },
];
export const PACOTES = { landing: { label: "Landing page", preco: 797, prazo: 7 }, institucional: { label: "Site institucional", preco: 997, prazo: 14 } };
export const MENSALIDADE = 150;

/* Checklists da ficha (Diagnóstico e proposta) */
export const CHECKLISTS = {
  diagnostico: [
    ["objetivo", "Objetivo do site identificado"],
    ["pacote", "Pacote definido (landing ou institucional)"],
    ["conteudo", "Conteúdo disponível levantado (logo, fotos, textos)"],
    ["dominio", "Domínio verificado"],
    ["preco", "Preço definido"],
  ],
  proposta: [
    ["preparada", "Proposta preparada"],
    ["apresentacaoAgendada", "Apresentação agendada"],
    ["enviada", "Proposta enviada/apresentada"],
  ],
  negociacao: [
    ["condicoes", "Condições de pagamento negociadas (50% + 50% ou Pix à vista −5%)"],
  ],
  contrato: [
    ["termoEnviado", "Termo de aceite enviado"],
    ["termoAceito", "Termo aceito por escrito"],
    ["cobrancaEntrada", "Cobrança da entrada enviada"],
    ["entradaPaga", "Entrada paga"],
    ["checklistConteudo", "Checklist de conteúdo enviado"],
  ],
};

/* ---------- Cadência v2, no-show, roteiro e objeções (textos padrão) ---------- */
export const CADENCIA_V2 = {
  versao: 2,
  passos: [
    {
      nome: "1º template — Abordagem", canal: "instagram", esperaDiasUteis: 1,
      nota: "Use o gancho e o problema reais do perfil. Se o lead responder em qualquer etapa, clique em Respondeu e conduza a conversa.",
      texto: "Oi, {nome}! Tudo bem? Acompanho o perfil da {empresa} e {gancho}.\n\nReparei que {problema}. Eu crio sites sob medida a partir da identidade que vocês já têm no Instagram, e montei uma prévia de como poderia ficar: {demo}\n\nÉ só uma ideia: não está no Google e eu apago se você preferir. O que achou?",
      textoSemDemo: "Oi, {nome}! Tudo bem? Acompanho o perfil da {empresa} e {gancho}.\n\nReparei que {problema}. Eu crio sites sob medida a partir da identidade que vocês já têm no Instagram, para quem procura no Google encontrar e chamar no WhatsApp.\n\nPosso te mostrar uma ideia de como ficaria?",
    },
    {
      nome: "2º template — Retomada no WhatsApp", canal: "whatsapp", esperaDiasUteis: 2, nota: "",
      texto: "Oi, {nome}! Aqui é o {seunome}, te chamei no Instagram sobre o site da {empresa}.\n\nHoje quem pesquisa \"{nicho} em {cidade}\" no Google encontra primeiro quem tem site, e o link da bio não aparece lá. Uma página rápida no celular, com botão de WhatsApp, já muda isso.\n\nPosso te ligar 5 minutinhos para mostrar a ideia? [dia e horário] funciona para você?",
    },
    {
      nome: "3º template — Prévia / exemplo", canal: "whatsapp", esperaDiasUteis: 2, nota: "",
      texto: "Oi, {nome}! Deixo aqui a prévia que montei para a {empresa}, para você abrir com calma no celular: {demo}\n\nRepare no botão de WhatsApp no topo e na seção de serviços: é isso que faz quem te encontra no Google virar agendamento. Faz sentido para o momento de vocês?",
      textoSemDemo: "Oi, {nome}! Para ficar mais claro o tipo de trabalho, deixo aqui um exemplo de site no mesmo estilo: [link do exemplo]\n\nÉ uma página rápida no celular, com a identidade do Instagram e botão de WhatsApp em destaque. Faz sentido algo assim para a {empresa}?",
    },
    {
      nome: "4º template — Fechando a agenda", canal: "whatsapp", esperaDiasUteis: 3, nota: "",
      texto: "Oi, {nome}! Estou fechando a agenda de sites que vamos entregar este mês e queria incluir a {empresa}.\n\nA landing page sai por R$ 797 e fica pronta em 7 dias, já com a cara do seu Instagram. Ainda consigo encaixar vocês.\n\nSe fizer sentido, te ligo e em 5 minutos explico como funciona, ou me chama aqui quando puder!",
    },
    {
      nome: "Break-up", canal: "whatsapp", esperaDiasUteis: 2,
      nota: "Se não responder em 2 dias úteis, encerre como \"Sem resposta\" (o histórico fica para uma retomada). Não envie outra mensagem nesse intervalo.",
      texto: "Oi, {nome}! Imagino que a rotina esteja corrida, então vou parar de mandar mensagem por aqui para não incomodar.\n\nSe em algum momento quiserem um site com a cara da {empresa}, é só me chamar. Sucesso para vocês!",
    },
  ],
};

export const NO_SHOW = {
  canal: "whatsapp",
  texto: "Oi, {nome}! Tudo bem? Senti sua falta na nossa conversa sobre o site da {empresa}. Imagino que tenha surgido algum imprevisto.\n\nPodemos remarcar? Tenho [dia e horário] ou [dia e horário]. Qual fica melhor para você?",
};

export const ROTEIRO = {
  blocos: [
    {
      titulo: "Apresentação — quem você é e de onde veio o contato",
      orientacao: "Diga seu nome e como chegou até a empresa (o perfil do Instagram, uma indicação — cite quem indicou, se ele autorizou). Contexto quebra a frieza.",
      falas: ["Oi, [nome]? Aqui é o Pedro, eu crio sites para negócios de {cidade}. Você consegue falar comigo por 3 minutinhos?", "Encontrei vocês pelo Instagram: [fato real do perfil]. Por isso resolvi te ligar."],
    },
    {
      titulo: "Início da conversa",
      orientacao: "Uma frase sobre o que você faz e pergunte se ele viu a mensagem/prévia.",
      falas: ["Você chegou a ver a prévia de site que eu te mandei no Instagram?", "[Se sim] E aí, o que achou?", "[Se não] Eu montei uma ideia de como ficaria o site da {empresa} usando as fotos do perfil. Posso te mandar agora pelo WhatsApp?"],
    },
    {
      titulo: "Identificação da necessidade",
      orientacao: "Perguntas abertas; descubra como os clientes chegam hoje e o que se perde.",
      falas: ["Hoje, como os clientes novos chegam até vocês?", "Quando alguém procura {nicho} em {cidade} no Google, vocês aparecem?", "Tem algum serviço que vocês querem vender mais?"],
    },
    {
      titulo: "Conexão entre a necessidade e o site",
      orientacao: "Resuma com as palavras dele antes de oferecer; não prometa resultado.",
      falas: ["Então, pelo que entendi, hoje vocês dependem de [canal citado] e quem procura no Google acaba [problema citado]. É esse o ponto que vocês querem melhorar?"],
    },
    {
      titulo: "Convite para a conversa de diagnóstico",
      orientacao: "Se houver interesse, proponha 15–20 minutos (vídeo ou ligação) para entender o que entra no site; ofereça duas opções de horário.",
      falas: ["Vale a gente conversar 15 minutinhos para eu entender o que entra no site e te passar valor e prazo certinhos. Tenho [dia e horário] ou [dia e horário]. Qual fica melhor?"],
    },
    {
      titulo: "Encerramento e registro no CRM",
      orientacao: "Confirme o combinado; depois registre resultado, necessidade, próxima ação e data.",
      falas: ["Combinado, [nome]. Te mando a confirmação no WhatsApp para [dia], às [horário]. Obrigado!"],
    },
  ],
};

export const OBJECOES = {
  itens: [
    // Qualificação
    { titulo: "Sem tempo", categoria: "qualificacao", conducao: "Respeite e encurte: peça só 3 minutos ou combine um horário melhor. Ofereça mandar a prévia pelo WhatsApp para ele ver quando puder e registre a próxima ação com data." },
    { titulo: "\"Não preciso de site, o Instagram já basta\"", categoria: "qualificacao", conducao: "Concorde que o Instagram é forte e é justamente a base do site. Explique que quem procura no Google não encontra o perfil, e o site leva essa pessoa direto para o WhatsApp. Pergunte como os clientes novos chegam hoje." },
    { titulo: "\"Manda por WhatsApp/e-mail\"", categoria: "qualificacao", conducao: "Mande, mas com contexto: a prévia e duas linhas sobre o que ela resolve. Antes de desligar, combine quando você volta a falar para ouvir a opinião dele." },
    { titulo: "\"Meu negócio é pequeno, não é hora\"", categoria: "qualificacao", conducao: "Mostre que a landing page foi pensada para negócio pequeno: uma página, rápida, com botão de WhatsApp e prazo de 7 dias. Pergunte o que faria ser a hora certa e registre um retorno." },
    { titulo: "\"Não sei o que colocaria no site\"", categoria: "qualificacao", conducao: "Tranquilize: o conteúdo sai do que ele já publica no Instagram (fotos, serviços, depoimentos). A prévia mostra isso na prática; na conversa de diagnóstico vocês fecham juntos o que entra." },
    { titulo: "Prefere falar pessoalmente", categoria: "qualificacao", conducao: "Se for possível, ofereça a visita; se não, proponha uma chamada de vídeo curta mostrando a prévia na tela. O importante é marcar dia e horário ainda nesta conversa." },
    { titulo: "Não decide sozinho (sócio, marido, esposa)", categoria: "qualificacao", conducao: "Pergunte quem mais participa da decisão e convide essa pessoa para a conversa de diagnóstico. Mande a prévia para os dois verem juntos e combine a data do retorno." },
    { titulo: "\"Como vocês conseguiram meu contato e minhas fotos?\"", categoria: "qualificacao", conducao: "Seja transparente: o perfil do Instagram e a ficha do Google são públicos, e foi por eles que você chegou. A prévia não está no Google, serve só para ele ver a ideia, e você apaga na hora se ele pedir." },
    // Ambos
    { titulo: "\"Já tenho site e funciona\"", categoria: "ambos", conducao: "Pergunte como o site traz clientes hoje e se ele sabe quantos chegam por lá. Se o dossiê apontou um problema real (lento, sem HTTPS, sem botão de WhatsApp), mostre com calma, sem desmerecer quem fez." },
    { titulo: "\"Já tenho agência, freelancer ou sobrinho que faz\"", categoria: "ambos", conducao: "Valorize a parceria que ele já tem. Pergunte se o site está no ar e trazendo contatos; se não estiver, a prévia mostra um caminho pronto em 7 dias, sem depender da agenda de ninguém." },
    { titulo: "Outras prioridades / \"agora não é o momento\"", categoria: "ambos", conducao: "Entenda o que está na frente e quando ele imagina olhar para isso. Combine uma data de retorno concreta e registre como próxima ação, sem pressionar." },
    { titulo: "Não confia em estúdio novo/pequeno", categoria: "ambos", conducao: "Use a demo como prova: o trabalho já está na tela dele. Explique que o pagamento é 50% para começar e 50% só na entrega, e que, depois de quitado, o código e o conteúdo são dele." },
    // Proposta
    { titulo: "Valor alto", categoria: "proposta", conducao: "Compare com o que um cliente novo por mês representa para ele. Se o institucional pesar, a landing page é a porta de entrada e pode crescer depois. Lembre do Pix à vista com 5% de desconto." },
    { titulo: "\"No Wix/Canva/freelancer sai mais barato\"", categoria: "proposta", conducao: "Concorde que existem opções mais baratas e mostre o que está incluído: site sob medida com a identidade dele, rápido no celular, pensado para o Google e para o WhatsApp, entregue em 7 ou 14 dias. Ele não precisa montar nada sozinho." },
    { titulo: "\"Por que pagar manutenção?\"", categoria: "proposta", conducao: "Explique o que os R$ 150/mês cobrem: hospedagem, SSL, backup, checagem mensal e até 1h de alterações. A manutenção é opcional: sem ela, ele recebe o código e hospeda por conta própria, com a nossa orientação." },
    { titulo: "\"Só pago depois de ver pronto\"", categoria: "proposta", conducao: "A demo já mostra o resultado antes de qualquer pagamento. A entrada de 50% reserva a agenda, e os outros 50% só são pagos na entrega, antes de publicar no domínio." },
    { titulo: "\"E se o site não trouxer clientes?\"", categoria: "proposta", conducao: "Não prometa números. Explique o que o site faz: ajuda a ser encontrado no Google, passa credibilidade e leva quem chega direto para o WhatsApp. O resultado depende também da divulgação dele, e você orienta como usar o link." },
    { titulo: "\"E se aparecerem custos extras?\"", categoria: "proposta", conducao: "Deixe tudo claro antes: o domínio (cerca de R$ 40/ano no registro.br) é do cliente e fica no nome dele. As 2 rodadas de ajustes estão incluídas; rodada extra só a partir da 3ª, sempre combinada antes." },
    { titulo: "Receio de atraso", categoria: "proposta", conducao: "O prazo é de 7 dias (landing) ou 14 dias (institucional) e começa a contar quando a entrada é paga e o conteúdo chega. Combine as datas por escrito e mantenha o cliente atualizado." },
    { titulo: "\"E se eu quiser mudar algo depois?\"", categoria: "proposta", conducao: "Antes da entrega há 2 rodadas de ajustes incluídas. Depois de publicado, a manutenção cobre até 1h de alterações por mês; sem manutenção, as alterações são orçadas antes." },
    { titulo: "\"Preciso pensar / falar com meu sócio\"", categoria: "proposta", conducao: "Pergunte qual ponto ainda pesa e se pode ajudar a esclarecer agora. Combine a data do retorno, ofereça falar com o sócio junto e registre a próxima ação no CRM." },
    { titulo: "Pede só o preço por mensagem", categoria: "proposta", conducao: "Passe o valor com o contexto: o que está incluído, prazo e forma de pagamento. Em seguida, convide para uma conversa curta para mostrar a prévia e tirar dúvidas." },
    { titulo: "Sumiu depois de receber a proposta", categoria: "proposta", conducao: "Retome com uma pergunta simples e sem cobrança, por exemplo se ficou alguma dúvida. Se não houver resposta depois de dois contatos, encerre com educação e deixe a porta aberta." },
  ],
};

/* ---------- Hotelaria: Método Reserva Direta (textos padrão) ----------
   Fonte: squads/prospeccao-de-clientes/saidas/2026-10-14-abordagem-metodo-reserva-direta.md.
   Mesmos nomes de passo, canais e esperas da cadência de sites. No hotel, {problema} é a frase da busca pelo nome. */
export const CADENCIA_HOTELARIA = {
  versao: 2,
  passos: [
    {
      nome: "1º template — Abordagem", canal: "instagram", esperaDiasUteis: 1,
      nota: "Use o gancho real e, se houver, a frase verificada da busca. Se o lead responder, clique em Respondeu e conduza para o Raio-X.",
      texto: "Oi, {nome}! Tudo bem?\n\nVi o perfil da {empresa} e {gancho}!\n\nFiz uma busca pelo nome da pousada no Google e reparei que {problema}. Ou seja, quem já procura a pousada pode acabar reservando pela Booking, e cada uma dessas reservas paga comissão, que pode chegar a 18%.\n\nEu ajudo pousadas a trazer essas reservas para o direto. Preparei uma prévia de como o site de vocês poderia ficar: {demo}\n\nQuer que eu te mande o print da busca e uma estimativa de quanto isso pode representar por mês para vocês?",
      textoSemDemo: "Oi, {nome}! Tudo bem?\n\nVi o perfil da {empresa} e {gancho}!\n\nFiz uma busca pelo nome da pousada no Google e reparei que {problema}. Ou seja, quem já procura a pousada pode acabar reservando pela Booking, e cada uma dessas reservas paga comissão, que pode chegar a 18%.\n\nEu ajudo pousadas a trazer essas reservas para o direto.\n\nQuer que eu te mande o print da busca e uma estimativa de quanto isso pode representar por mês para vocês?",
    },
    {
      nome: "2º template — Retomada no WhatsApp", canal: "whatsapp", esperaDiasUteis: 2, nota: "",
      texto: "Oi, {nome}! Aqui é o {seunome}, te chamei no Instagram sobre as reservas da {empresa}.\n\nUma conta rápida: numa pousada de 10 quartos, com 60% de ocupação, diária de R$ 450 e metade das reservas pela Booking, a comissão passa de R$ 7 mil por mês. Trazer só 15% dessas reservas para o direto já faz diferença no caixa.\n\nFaço um Raio-X gratuito da {empresa}: quanto vem de cada canal, quanto vai em comissão e quem aparece quando buscam o nome de vocês. Leva 15 minutos. [dia e horário] funciona para você?",
    },
    {
      nome: "3º template — Prévia / exemplo", canal: "whatsapp", esperaDiasUteis: 2, nota: "",
      texto: "Oi, {nome}! Deixo aqui a prévia que montei para a {empresa}, para você abrir com calma no celular: {demo}\n\nO site é só uma parte. A outra é uma campanha no Google com o nome da pousada, para o site de vocês aparecer acima da Booking quando o hóspede procura por vocês. Junto com o botão de reservar direto e o WhatsApp, é isso que faz quem já te procurava fechar com vocês. Faz sentido para o momento da {empresa}?",
      textoSemDemo: "Oi, {nome}! Para ficar mais claro: o método junta site de reserva, uma campanha no Google com o nome da pousada (para aparecer acima da Booking quando procuram vocês), ajuste no perfil da Booking e do Airbnb e um relatório mensal com quanto vocês economizaram em comissão.\n\nPosso montar uma prévia da home da {empresa} para você ver como ficaria. Faz sentido para o momento de vocês?",
    },
    {
      nome: "4º template — Fechando a agenda", canal: "whatsapp", esperaDiasUteis: 3, nota: "",
      texto: "Oi, {nome}! Estou fechando as implantações que começam em [mês] e consigo encaixar mais duas pousadas de {cidade}.\n\nSe quiser, faço o Raio-X da {empresa} sem compromisso: você sai sabendo quanto paga de comissão por mês e quanto dá para trazer para o direto nos próximos 90 dias.\n\nTe ligo 15 minutos? Ou me chama aqui quando puder!",
    },
    {
      nome: "Break-up", canal: "whatsapp", esperaDiasUteis: 2,
      nota: "Se não houver resposta, encerre como \"Sem resposta\".",
      texto: "Oi, {nome}! Imagino que a rotina da pousada esteja corrida, então vou parar de mandar mensagem por aqui para não incomodar.\n\nSe em algum momento quiserem diminuir a dependência da Booking e trazer mais reservas para o direto, é só me chamar. Boa temporada para vocês!",
    },
  ],
};

export const NO_SHOW_HOTELARIA = {
  canal: "whatsapp",
  texto: "Oi, {nome}! Tudo bem? Senti sua falta na nossa conversa sobre as reservas diretas da {empresa}. Imagino que tenha surgido algum imprevisto, pousada é assim mesmo.\n\nPodemos remarcar? Tenho [dia e horário] ou [dia e horário]. Qual fica melhor?",
};

export const ROTEIRO_HOTELARIA = {
  blocos: [
    {
      titulo: "Apresentação",
      orientacao: "Diga seu nome e como chegou até a pousada (Instagram, Google, indicação). Seja breve.",
      falas: ["Oi, [nome]? Aqui é o Pedro, eu ajudo pousadas a aumentar as reservas diretas. Você consegue falar comigo 3 minutinhos?", "Te chamei porque busquei a {empresa} no Google e [o que a busca mostrou]."],
    },
    {
      titulo: "Início da conversa",
      orientacao: "Pergunte se ele viu a mensagem ou a prévia e confirme que falar de comissão faz sentido.",
      falas: ["Você chegou a ver a mensagem que eu mandei?", "Hoje a comissão da Booking é um assunto para vocês?"],
    },
    {
      titulo: "Raio-X: as perguntas",
      orientacao: "Anote tudo no CRM (quartos, diária, ocupação, % por canal). São os números da conta.",
      falas: ["Quantos quartos vocês têm?", "Qual a diária média e a ocupação média do ano?", "Mais ou menos quanto das reservas vem pela Booking, pelo Airbnb, pelo WhatsApp ou telefone e por agências?", "Vocês estão no programa Preferred ou no Genius da Booking?", "Usam motor de reservas (Omnibees, Cloudbeds, HSystem...)?", "Quem responde o WhatsApp, e em quanto tempo?", "Já fizeram anúncio no Google ou no Instagram? Como foi?"],
    },
    {
      titulo: "A conta na frente dele",
      orientacao: "Faça a conta com os números que ele deu. Receita × % das plataformas × taxa = comissão por mês. Depois, quanto volta com 10 a 15% migrando para o direto. Não prometa resultado: mostre a ordem de grandeza.",
      falas: ["Pelo que você me passou, vocês pagam algo perto de R$ [X] por mês em comissão. Se a gente trouxer 15% dessas reservas para o direto, são uns R$ [Y] por mês que ficam com vocês."],
    },
    {
      titulo: "O método em 1 minuto",
      orientacao: "90 dias de implantação: site de reserva integrado ao motor, campanha no Google com o nome da pousada, Meta para quem visitou, ajuste na Booking e no Airbnb e relatório mensal. As contas ficam no nome do cliente.",
      falas: ["A ideia não é sair da Booking: é ela continuar como vitrine e o hóspede que já procurava vocês reservar direto.", "Todo mês você recebe um relatório com quanto economizou em comissão."],
    },
    {
      titulo: "Convite para a reunião de diagnóstico",
      orientacao: "Proponha 30 minutos com a conta completa e o plano indicado. Dê duas opções de horário.",
      falas: ["Que tal a gente fazer 30 minutos para eu te mostrar o Raio-X completo da {empresa}, com a conta e o plano? Tenho [dia e horário] ou [dia e horário]."],
    },
    {
      titulo: "Encerramento e registro",
      orientacao: "Confirme o combinado e registre no CRM os números do Raio-X, a próxima ação e a data.",
      falas: ["Combinado, [nome]. Te mando a confirmação no WhatsApp. Obrigado!"],
    },
    {
      titulo: "Se atender a recepção — descobrir quem decide",
      orientacao: "Não apresente a empresa e não venda: o objetivo é só saber quem decide (a recepção serve de ponte). Se a resposta for \"sou eu\", é o decisor: siga este roteiro a partir do bloco 2. Se citarem um nome, peça o melhor canal, dando o motivo legítimo. Se não quiserem passar o contato, deixe o recado e o seu contato. Não insista. No fim, grave no CRM o nome e o cargo citados (fonte: \"ligação para a recepção\" e a data) e rode a Dora de novo para confirmar.",
      falas: [
        "Olá! Tudo bem? Estou tentando falar com a pessoa responsável pela parte comercial e de reservas da pousada. É o proprietário ou tem algum gerente que cuida disso?",
        "[Se citarem um nome] Perfeito. Qual a melhor forma de falar com o [nome citado]? Fiz uma análise de como a pousada aparece no Google e queria mandar para ele. Pode ser pelo WhatsApp ou tem um e-mail comercial dele?",
        "[Se não quiserem passar o contato] Sem problema! Posso deixar meu WhatsApp para você passar para ele? É sobre as reservas que hoje chegam pela Booking.",
      ],
    },
  ],
};

/* Mensagem de encaminhamento (faixa "enriquecer"): vai pelo canal comercial pedindo o contato de quem decide. */
export const ENCAMINHAMENTO_HOTELARIA = {
  texto: "Oi! Tudo bem? Fiz uma análise rápida de como a {empresa} aparece quando alguém busca o nome de vocês no Google e achei algumas oportunidades de aumentar as reservas diretas.\n\nQuem seria a pessoa certa para eu enviar? É com o [nome do sócio ou gerente, se a Dora encontrou] mesmo?",
};

export const OBJECOES_HOTELARIA = {
  itens: [
    // Qualificação
    { titulo: "\"A Booking traz a maioria dos meus hóspedes, não posso sair dela\"", categoria: "qualificacao", conducao: "Concorde: ninguém precisa sair. A Booking continua como vitrine. O método recupera quem já procurava a pousada pelo nome e os hóspedes que voltam, que hoje também pagam comissão. Pergunte quantos hóspedes repetem." },
    { titulo: "\"Não sei quanto vem de cada canal\"", categoria: "qualificacao", conducao: "É exatamente o que o Raio-X levanta. Ofereça fazer junto, em 15 minutos, com o relatório do motor ou da extranet." },
    { titulo: "\"Sou pequeno, poucos quartos\"", categoria: "qualificacao", conducao: "Para 6 a 14 quartos existe o plano mais enxuto: site, campanha só no nome e revisão da Booking. Faça a conta com os números dele antes de concluir." },
    { titulo: "\"Na alta temporada eu lotei\"", categoria: "qualificacao", conducao: "Lotar pela Booking é pagar comissão em todas as diárias. O momento de trocar comissão por reserva direta é justamente a alta. Na baixa, os anúncios ajudam a encher." },
    { titulo: "\"Meu público vem de agência e operadora\"", categoria: "qualificacao", conducao: "Pergunte qual a proporção. O método foca no hóspede final. Se agência for mais de 70%, registre e deixe para depois." },
    { titulo: "\"Sem tempo para isso\"", categoria: "qualificacao", conducao: "A gestão é nossa: ele aprova e recebe o relatório. Peça só os 15 minutos do Raio-X." },
    { titulo: "\"Manda por WhatsApp\"", categoria: "qualificacao", conducao: "Mande a prévia e uma frase sobre a conta, e combine quando voltar a falar." },
    { titulo: "\"Não decido sozinho (sócio, família)\"", categoria: "qualificacao", conducao: "Convide o sócio para a reunião do Raio-X e mande a prévia para os dois." },
    { titulo: "\"Como conseguiu meu contato?\"", categoria: "qualificacao", conducao: "Perfil do Instagram, ficha do Google e Booking são públicos. A prévia não está no Google e é apagada na hora, se ele pedir." },
    // Ambos
    { titulo: "\"Já tenho site\"", categoria: "ambos", conducao: "Pergunte se ele sabe quantas reservas o site gera por mês, se tem motor integrado e se aparece quando buscam o nome da pousada. Mostre o print da busca, sem desmerecer quem fez." },
    { titulo: "\"Já faço anúncio\" ou \"tenho agência\"", categoria: "ambos", conducao: "Pergunte se existe campanha no próprio nome da pousada e se mede as reservas diretas que vêm dela. Impulsionar post no Instagram não é a mesma coisa que aparecer no Google quando procuram a pousada." },
    { titulo: "\"Anúncio não funciona, já tentei\"", categoria: "ambos", conducao: "Entenda o que foi feito (geralmente post impulsionado). A campanha no nome custa pouco por clique, comparado à comissão de uma reserva, e só aparece para quem já procura a pousada." },
    { titulo: "\"Não posso cobrar mais barato no site, por causa do contrato da Booking\"", categoria: "ambos", conducao: "Está certo, e o método respeita isso. A oferta direta usa benefícios (café, upgrade, late checkout, sem taxa de serviço) e o melhor preço pode ir pelo WhatsApp ou pelo telefone, que a paridade não alcança (acordo do Cade de 2018). Vale conferir o contrato atual dele." },
    { titulo: "\"Agora não é o momento\"", categoria: "ambos", conducao: "Entenda o calendário (alta, baixa, reforma) e combine uma data concreta de retorno." },
    // Proposta
    { titulo: "\"Está caro\" ou \"mais uma mensalidade\"", categoria: "proposta", conducao: "Volte à conta: a comissão economizada por mês contra a mensalidade. A meta é cobrir a mensalidade a partir do 4º mês. A verba de anúncios vai direto para o Google e a Meta, no nome dele." },
    { titulo: "\"E se não der resultado?\"", categoria: "proposta", conducao: "Não prometa número. Mostre o processo e as metas acompanhadas: % de reservas diretas, comissão economizada, custo por reserva e relatório mensal. A garantia do 4º mês ainda está em decisão: não oferecer." },
    { titulo: "\"Quanto tempo até ver resultado?\"", categoria: "proposta", conducao: "90 dias de implantação. A campanha no nome dá retorno rápido; anúncios e reposicionamento na Booking levam de 2 a 3 meses para amadurecer." },
    { titulo: "\"Por que contrato mínimo?\"", categoria: "proposta", conducao: "Anúncios e ajustes nas plataformas precisam de tempo para aprender e medir. O prazo mínimo ainda está em decisão: confirmar com o Pedro antes de citar." },
    { titulo: "\"De quem são as contas e o site?\"", categoria: "proposta", conducao: "Do cliente. Google Ads, Meta, Analytics e domínio ficam no nome da pousada, e nós só gerimos." },
    { titulo: "\"Preciso pensar\"", categoria: "proposta", conducao: "Pergunte qual ponto ainda pesa, combine a data do retorno e registre." },
    { titulo: "\"Sumiu depois da proposta\"", categoria: "proposta", conducao: "Retome com uma pergunta simples. Depois de 2 contatos sem resposta, encerre com educação." },
  ],
};

/* ---------- Playbook por segmento ---------- */
// Leads de hotelaria usam o Método Reserva Direta; os demais, a abordagem de sites.
export const playbookDe = (l) => (l && l.segmento === "Hotelaria" ? "hotelaria" : "sites");
export const PLAYBOOKS = {
  sites: { label: "Sites", cadencia: CADENCIA_V2, noShow: NO_SHOW, roteiro: ROTEIRO, objecoes: OBJECOES },
  hotelaria: { label: "Hotelaria · Método Reserva Direta", cadencia: CADENCIA_HOTELARIA, noShow: NO_SHOW_HOTELARIA, roteiro: ROTEIRO_HOTELARIA, objecoes: OBJECOES_HOTELARIA },
};
// Documento em config: "cadencia" (sites) ou "cadencia_hotelaria" (hotelaria); idem noShow, roteiro e objecoes.
export const chaveConfig = (chave, pb) => (pb === "hotelaria" ? chave + "_hotelaria" : chave);
// Passos da cadência do playbook: a config salva (versão 2) ou os padrões.
export function passosDoPlaybook(config, pb) {
  const c = (config || {})[chaveConfig("cadencia", pb)];
  return c && Number(c.versao) === 2 && Array.isArray(c.passos) ? c.passos : (PLAYBOOKS[pb] || PLAYBOOKS.sites).cadencia.passos;
}

/* ---------- Raio-X da Reserva Direta (hotelaria) ---------- */
export const TAXAS_PADRAO = { booking: 18, airbnb: 15 };
export const PLANOS_HOTELARIA = ["Essencial", "Completo", "Completo + WhatsApp"];
export const MIGRACAO_DIRETO = 0.15;
const numOuNada = (v) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));
/* Conta do Raio-X (percentuais de 0 a 100). Sem quartos, diária, ocupação ou % por canal, devolve null.
   receita/mês = quartos × ocupação × diária × 30; comissão = receita × (%Booking × taxa + %Airbnb × taxa); economia = comissão × 15%. */
export function contaRaioX(l) {
  const x = l || {};
  const quartos = numOuNada(x.quartos), diaria = numOuNada(x.diariaMedia), ocupacao = numOuNada(x.ocupacao);
  const pctBooking = numOuNada(x.pctBooking), pctAirbnb = numOuNada(x.pctAirbnb);
  if (!(quartos > 0) || !(diaria > 0) || !(ocupacao > 0) || (pctBooking === null && pctAirbnb === null)) return null;
  const taxaBooking = numOuNada(x.taxaBooking) ?? TAXAS_PADRAO.booking, taxaAirbnb = numOuNada(x.taxaAirbnb) ?? TAXAS_PADRAO.airbnb;
  const receita = quartos * (ocupacao / 100) * diaria * 30;
  const comissao = receita * (((pctBooking || 0) / 100) * (taxaBooking / 100) + ((pctAirbnb || 0) / 100) * (taxaAirbnb / 100));
  return { receita, comissao, economia: comissao * MIGRACAO_DIRETO, taxaBooking, taxaAirbnb };
}

/* ---------- Decisor (hotelaria): Dora Decisora + ferramentas/verificar-decisor.mjs ----------
   Campos no lead: decisor {nome, cargo, prioridade, instagram, linkedin, email, telefone, canal, rota, contato, socios[], fonte},
   decisorScore (0–100), decisorFaixa, razaoSocial e cnpj. */
export const FAIXAS_DECISOR = [
  { id: "prospectar", label: "Prospectar", emoji: "🔥", cor: "green", min: 80 },
  { id: "enriquecer", label: "Enriquecer", emoji: "🟡", cor: "amber", min: 50 },
  { id: "nao_priorizar", label: "Não priorizar", emoji: "🔴", cor: "red", min: 0 },
];
export const FAIXA_DECISOR = Object.fromEntries(FAIXAS_DECISOR.map((f) => [f.id, f]));
// Canais de acesso e prioridades da Dora Decisora (squads/prospeccao-de-clientes/agentes/dora-decisora.md).
export const CANAIS_DECISOR = [
  { id: "whatsapp_comercial", label: "WhatsApp comercial" }, { id: "instagram_dm", label: "DM do Instagram" }, { id: "email", label: "E-mail" },
  { id: "linkedin", label: "LinkedIn" }, { id: "telefone_recepcao", label: "Telefone da recepção" }, { id: "presencial", label: "Presencial" },
];
export const PRIORIDADES_DECISOR = { 1: "proprietário, sócio-administrador ou anfitrião", 2: "gerente geral", 3: "gerente comercial, de marketing ou de revenue", 4: "recepção (ponte, não decide)" };
// Mesma régua do verificar-decisor.mjs.
export const faixaPorScore = (s) => (s >= 80 ? "prospectar" : s >= 50 ? "enriquecer" : "nao_priorizar");
// Faixa do lead: pela nota (quando há) ou pela faixa gravada; null = decisor não pesquisado.
export function faixaDecisor(l) {
  const s = numOuNada(l && l.decisorScore);
  if (s !== null) return faixaPorScore(s);
  return l && FAIXA_DECISOR[l.decisorFaixa] ? l.decisorFaixa : null;
}

/* ---------- Funil (CLI "funil" e testes) ----------
   Cada etapa conta os leads que chegaram nela (ou além, pela etapa atual ou pelas datas de cada etapa). */
const DEPOIS_DA_RESPOSTA = ["primeiro_contato", "reuniao", "diagnostico", "proposta", "negociacao", "contrato", "ganho"];
const chegou = (l, etapas) => etapas.includes(l.etapa) || etapas.some((e) => l.datas && l.datas[e]);
const cadIniciada = (l) => !!(l.cadencia && (l.cadencia.iniciadaEm || (l.cadencia.envios || []).length || Number(l.cadencia.passo) > 0));
export function funilDe(lista) {
  const score = (l) => numOuNada(l.decisorScore);
  const etapas = [
    ["Leads", () => true],
    ["Decisor pesquisado", (l) => score(l) !== null],
    ["Decisor identificado (≥ 60)", (l) => score(l) >= 60],
    ["Contato válido (≥ 80)", (l) => score(l) >= 80],
    ["Cadência iniciada", (l) => cadIniciada(l) || chegou(l, ["cadencia", ...DEPOIS_DA_RESPOSTA])],
    ["Respondeu", (l) => !!(l.cadencia && (l.cadencia.estado === "respondeu" || l.cadencia.respondeuEm)) || chegou(l, DEPOIS_DA_RESPOSTA)],
    ["Reunião", (l) => chegou(l, DEPOIS_DA_RESPOSTA.slice(1))],
    ["Proposta", (l) => chegou(l, ["proposta", "negociacao", "contrato", "ganho"])],
    ["Ganho", (l) => chegou(l, ["ganho"])],
  ];
  const contagem = etapas.map(([nome, fn]) => ({ nome, n: lista.filter(fn).length }));
  return contagem.map((e, i) => ({ ...e, pctAnterior: i && contagem[i - 1].n ? e.n / contagem[i - 1].n : null }));
}

/* ---------- Regras ---------- */
export const ETAPA_DE_STATUS = {
  novo: "novo_lead", abordado: "cadencia", respondeu: "primeiro_contato", proposta: "proposta", perdido: "encerrado",
  fechado: "ganho", em_construcao: "ganho", aprovacao_cliente: "ganho", entregue: "ganho", manutencao: "ganho", cancelado: "ganho",
};
export const FASE_DE_STATUS = { fechado: "em_construcao", em_construcao: "em_construcao", aprovacao_cliente: "aprovacao_cliente", entregue: "entregue", manutencao: "manutencao", cancelado: "cancelado" };
// Status antigo (v1) mantido em sincronia para os agentes e o painel antigo.
export function statusLegado(etapa, faseCliente) {
  if (etapa === "ganho") return faseCliente || "fechado";
  return { novo_lead: "novo", primeiro_contato: "respondeu", cadencia: "abordado", reuniao: "respondeu", diagnostico: "respondeu", proposta: "proposta", negociacao: "proposta", contrato: "proposta", encerrado: "perdido" }[etapa] || "novo";
}
export function temperaturaPorNota(nota) {
  if (nota === null || nota === undefined || nota === "" || isNaN(Number(nota))) return "";
  const n = Number(nota);
  return n >= 8 ? "quente" : n >= 6 ? "morno" : "frio";
}
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export function grupoPadrao(d) {
  const criado = String(d.criadoEm || "").slice(0, 10);
  if (criado === "2026-10-10") return "Clínicas estéticas · Natal · out/26";
  if (!criado) return "";
  const [a, m] = criado.split("-");
  return [d.nicho, d.cidade, MESES[Number(m) - 1] + "/" + a.slice(2)].filter(Boolean).join(" · ");
}
// "Dra. Isauria d'Avila — Harmonização" → "Dra. Isauria"; nas demais empresas o contato fica a confirmar.
export function nomeDaEmpresa(empresa) {
  const m = String(empresa || "").match(/^(Dra?\.)\s+([A-Za-zÀ-ÿ'’-]+)/);
  return m ? m[1] + " " + m[2] : "";
}
const dataLocalISO = (d) => d.toLocaleDateString("sv-SE");
// Data AAAA-MM-DD às 9h no horário de Brasília → ISO.
export const as9h = (dia) => new Date(String(dia).slice(0, 10) + "T09:00:00-03:00").toISOString();

/* Preenche os campos novos a partir dos antigos, sem apagar nada (app e migração usam a mesma regra). */
export function camposV2(d) {
  const status = d.status || "novo";
  const out = {};
  if (!d.etapa) out.etapa = ETAPA_DE_STATUS[status] || "novo_lead";
  const etapa = d.etapa || out.etapa;
  if (etapa === "ganho" && !d.faseCliente) out.faseCliente = FASE_DE_STATUS[status] || "em_construcao";
  if (etapa === "encerrado" && !d.encerramento) out.encerramento = { motivo: "perdido", em: (d.datas && d.datas.perdido) || "", obs: "" };
  if (!d.cadencia && status === "abordado") {
    out.cadencia = { estado: "ativa", passo: Math.min(5, Number(d.toque) || 0), iniciadaEm: d.abordadoEm ? as9h(d.abordadoEm) : "", previstoEm: d.proximoToque ? as9h(d.proximoToque) : new Date().toISOString(), envios: [], ciclo: 1 };
  }
  if (d.segmento === undefined) out.segmento = d.nicho || "";
  if (d.localizacao === undefined) out.localizacao = [d.cidade, d.uf].filter(Boolean).join("/");
  if (!d.origem) out.origem = "prospeccao_ativa";
  if (!d.responsavel) out.responsavel = "Pedro";
  if (!d.temperatura) { const t = temperaturaPorNota(d.nota); if (t) out.temperatura = t; }
  if (!d.grupo) { const g = grupoPadrao(d); if (g) out.grupo = g; }
  if (d.nome === undefined) out.nome = nomeDaEmpresa(d.empresa);
  if (etapa && d.datas && !d.datas[etapa]) {
    const legado = d.datas[status];
    if (legado) out.datas = { ...d.datas, [etapa]: legado };
  }
  return out;
}

/* ---------- Dias úteis (feriados nacionais) ---------- */
function pascoa(ano) {
  const a = ano % 19, b = Math.floor(ano / 100), c = ano % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia, 12);
}
const cacheFeriados = {};
export function feriados(ano) {
  if (cacheFeriados[ano]) return cacheFeriados[ano];
  const s = new Set(["01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"].map((md) => ano + "-" + md));
  const p = pascoa(ano);
  for (const off of [-48, -47, -2, 60]) { const d = new Date(p); d.setDate(d.getDate() + off); s.add(dataLocalISO(d)); }
  return (cacheFeriados[ano] = s);
}
export function ehDiaUtil(d) {
  const dow = d.getDay();
  return dow !== 0 && dow !== 6 && !feriados(d.getFullYear()).has(dataLocalISO(d));
}
// Soma n dias úteis a partir de "base" e devolve a data às 9h (horário local).
export function somarDiasUteis(base, n) {
  const d = new Date(base); d.setHours(12, 0, 0, 0);
  let falta = Math.max(0, Number(n) || 0);
  while (falta > 0) { d.setDate(d.getDate() + 1); if (ehDiaUtil(d)) falta--; }
  while (!ehDiaUtil(d)) d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}

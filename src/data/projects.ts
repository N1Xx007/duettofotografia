/**
 * Acervo da Duetto — estrutura editável do portfólio.
 *
 * ⚠️ CONTEÚDO PROVISÓRIO
 * O manual da marca contém apenas uma fotografia real (as sócias, usada na cena
 * "O lado humano"). Todos os projetos abaixo usam imagens provisórias do Unsplash
 * (licença livre) para demonstrar a direção de arte. Elas aparecem no site com a
 * legenda "Imagem provisória" e NÃO devem ser publicadas como trabalho do estúdio.
 *
 * Para publicar um trabalho real:
 *  1. coloque as fotos em /public/acervo/<slug>/ (JPG/WebP em boa resolução);
 *  2. troque `src` pelo caminho (ex.: '/acervo/presenca/01.webp') e ajuste `ratio`;
 *  3. defina `provisional: false` no projeto e preencha `client`, `year`, `credits`.
 */

export interface Photo {
  /** ID do Unsplash (`photo-...`) ou caminho local em /public. */
  src: string;
  alt: string;
  /** Proporção largura / altura — evita mudança de layout durante o carregamento. */
  ratio: number;
  /** Cor média da imagem, exibida enquanto ela carrega. */
  tone?: string;
  /** object-position para recortes (ex.: '50% 30%'). */
  focus?: string;
}

export type Block =
  | { kind: 'full'; photo: Photo }
  | { kind: 'pair'; photos: [Photo, Photo]; stagger?: boolean }
  | { kind: 'single'; photo: Photo; place: 'left' | 'right' | 'center'; size: 'sm' | 'md' | 'lg' }
  | { kind: 'note'; text: string };

export type CategoryId = 'marca' | 'pessoal' | 'gestante' | 'familia' | 'celebracao' | 'audiovisual';

export interface Category {
  id: CategoryId;
  label: string;
  /** Linha de serviço correspondente no manual ("O que vendemos"). */
  service: string;
}

export interface Project {
  slug: string;
  title: string;
  category: CategoryId;
  /** Frase curta, em tom Duetto: simples, humana, sem exagero. */
  lede: string;
  /** Contexto editorial curto (1–2 parágrafos). */
  text: string[];
  cover: Photo;
  blocks: Block[];
  provisional: boolean;
  client?: string | null;
  year?: string | null;
  credits?: { role: string; name: string }[];
}

export const categories: Category[] = [
  { id: 'marca', label: 'Marca & profissionais', service: 'Imagem profissional' },
  { id: 'pessoal', label: 'Ensaios pessoais', service: 'Experiência e registro' },
  { id: 'gestante', label: 'Gestantes', service: 'Experiência e registro' },
  { id: 'familia', label: 'Famílias', service: 'Experiência e registro' },
  { id: 'celebracao', label: 'Celebrações', service: 'Experiência e registro' },
  { id: 'audiovisual', label: 'Audiovisual', service: 'História em movimento' },
];

const u = (id: string, ratio: number, alt: string, tone: string, focus?: string): Photo => ({
  src: `photo-${id}`,
  ratio,
  alt,
  tone,
  focus,
});

/* ------------------------------------------------------------------ */
/* Imagens provisórias                                                 */
/* ------------------------------------------------------------------ */

const luz = {
  persiana: u('1512206451403-542d321772f3', 1.493, 'Mulher de perfil com faixas de luz quente atravessando a persiana', '#393227', '62% 40%'),
  contraluz: u('1775808949430-c211703bc3d8', 0.68, 'Mulher em contraluz junto a uma janela, cabelo iluminado pelo sol', '#100d04'),
  sombra: u('1533594285052-5a88351dab21', 1.333, 'Retrato em preto e branco: mulher sentada no chão, recortes de luz da janela', '#313131'),
  escuro: u('1515138692129-197a2c608cfd', 0.667, 'Rosto feminino em meia-luz sobre fundo preto', '#0e0906'),
};

const presenca = {
  laranja: u('1771072428365-f0f97d0d25b7', 0.667, 'Mulher de terno listrado sentada diante de uma cortina laranja', '#ae5b15', '50% 35%'),
  blazer: u('1563132337-f159f484226c', 0.667, 'Retrato de mulher de blazer laranja com braços cruzados', '#938576'),
  janela: u('1573496359142-b8d87734a5a2', 0.667, 'Profissional de casaco cinza sentada junto à janela do escritório', '#957258'),
  sorriso: u('1573497161161-c3e73707e25c', 0.667, 'Mulher sorridente de suéter azul sentada em cadeira de escritório', '#737d82'),
  terno1: u('1665224752136-4dbe2dfc8195', 0.667, 'Retrato de profissional de terno escuro sobre fundo preto', '#1c1a1a'),
  terno2: u('1665224752123-a2ea29dddcb2', 0.667, 'Profissional de terno escuro sentada, fundo preto', '#1b1918'),
};

const campo = {
  cadeira: u('1762110109516-2bb1c56a9828', 0.667, 'Mulher sentada em uma cadeira no meio de um campo seco', '#b4947d'),
  blazer: u('1762110108956-6d258ba6c5a0', 0.667, 'Mulher de blazer preto e legging vermelha em campo aberto', '#688593'),
  pordosol: u('1762110110743-a58d78c9f93d', 0.667, 'Mulher sentada no campo ao pôr do sol', '#beae9e'),
  empe: u('1762110110867-42dd5ee5f021', 0.667, 'Mulher em pé sobre a cadeira no campo seco', '#7f9aa0'),
  cidade: u('1762110109685-41659a1a6eed', 0.667, 'Mulher no campo com edifícios ao fundo', '#a98d82'),
  sentada: u('1762110110727-d5ea8fed00ce', 0.667, 'Mulher de blazer sentada, céu azul ao fundo', '#5b7788'),
  close: u('1762110110517-21acfcbabf23', 0.667, 'Close de mulher de cabelo loiro no campo', '#7c7e78'),
  vento: u('1762110109853-224dd5f39035', 0.667, 'Mulher de cabelo curto ao ar livre', '#907e72'),
};

const espera = {
  perfil: u('1710897869539-a48e3d69a8d7', 0.667, 'Gestante de perfil em estúdio, fundo claro', '#bfb3ae'),
  olhar: u('1710897869625-feacd81ed629', 0.667, 'Gestante de perfil olhando para cima, fundo claro', '#bfb2ad'),
  maos: u('1710897537209-392c74a1c299', 0.667, 'Gestante em pé com as mãos na barriga', '#ccc4c1'),
  frente: u('1710897537288-d29ceb135bcf', 0.667, 'Gestante de frente, olhar para baixo, em estúdio', '#c4b8b3'),
};

const mesa = {
  chef: u('1583394293214-28ded15ee548', 1, 'Chef de braços cruzados na cozinha', '#8f8883'),
  avental: u('1559575003-fb4ee38a747d', 0.662, 'Cozinheiro de óculos e avental jeans', '#635d5a'),
  salao: u('1731476626184-698e35a863d1', 0.769, 'Chef de braços cruzados no salão do restaurante', '#423e34'),
  preparo: u('1583394293211-45718f7eb6b0', 1, 'Chef finalizando um prato na bancada', '#675a50'),
  sorriso: u('1689588532679-4bb5fdd8f6d5', 0.667, 'Cozinheiro sorridente de avental azul', '#746258'),
  equipe: u('1731576089290-e6230a18dcb4', 0.667, 'Cozinheira de avental em pé na cozinha', '#86786e'),
};

const dias = {
  abajur: u('1597098868667-113f3a729471', 1.538, 'Mãe alimentando o bebê sob a luz âmbar de um abajur', '#895a2a'),
  nariz: u('1551934262-db2d7dd517f4', 1.333, 'Mãe encostando o nariz no do bebê', '#a07652'),
  cama: u('1696767281882-736cbeee67d4', 0.667, 'Mãe e bebê sobre a cama em luz suave', '#6c6258'),
  colo: u('1583710457367-47de0ea21fef', 1.493, 'Mulher de camisa branca segurando o bebê no colo', '#96887d'),
  bebe: u('1515012003471-9d658cf66e1a', 1.515, 'Bebê deitado ao lado da mãe, foco raso', '#794a38'),
  bracos: u('1700651463652-b24be6e143ba', 1.471, 'Mulher segurando um bebê nos braços', '#544f42'),
};

const pele = {
  ocre: u('1527203561188-dae1bc1a417f', 0.714, 'Perfil de mulher com rabo de cavalo trançado sobre fundo ocre', '#9d7b48'),
  folhas: u('1593351799227-75df2026356b', 0.68, 'Mulher com folhas verdes no cabelo, fundo escuro', '#38201d'),
  flor: u('1542513217-0b0eedf7005d', 0.8, 'Mulher com flor branca na orelha sobre fundo rosado', '#5e453a'),
  brinco: u('1552793084-49132af00ff1', 0.8, 'Mulher sentada sobre fundo vinho, luz lateral', '#412529'),
  ouro: u('1631346543932-ce110c10dbec', 0.667, 'Mulher sorrindo com acessórios dourados', '#1f1b1a'),
  anel: u('1600144559281-53d1dee79a99', 0.667, 'Mão com anel dourado cobrindo parte do rosto', '#78481e'),
};

const casa = {
  estudio: u('1763013259279-3195d6330519', 0.667, 'Família com duas crianças pequenas em estúdio de fundo bege', '#9d948e'),
  campo: u('1685873875872-ecd77ba5a2b0', 0.667, 'Família em pé em um campo de grama alta', '#b3b7af'),
  bebe: u('1685873875056-bb96de15555c', 0.667, 'Casal segurando o bebê no campo', '#a5a59d'),
  brincadeira: u('1760084836111-b384c6d32104', 0.667, 'Família brincando junta no gramado', '#666051'),
  cama: u('1581952976147-5a2d15560349', 1.493, 'Família na cama em manhã clara', '#d3c3b5'),
  pai: u('1762438421221-1626a4958dbf', 0.667, 'Pai jogando o bebê para o alto, em preto e branco', '#a7a7a7'),
};

const festa = {
  vela: u('1544155891-969f15a055d3', 0.667, 'Mulher comemorando o aniversário com velas de faísca', '#a07567'),
  confete: u('1544155892-b2b6c64204fc', 0.667, 'Duas amigas rindo sob confetes durante a festa', '#7b5045'),
  tiara: u('1763732460710-0c36e349dabc', 1.493, 'Menina com tiara iluminada por luzes desfocadas', '#412d15'),
  baloes: u('1760036120428-42742c16a23c', 0.667, 'Grupo de amigas comemorando entre balões', '#c39b84'),
};

const movimento = {
  camera: u('1728415878898-0f03fdb9201e', 0.667, 'Mão segurando uma câmera de cinema com monitor acoplado', '#293135'),
  set: u('1612544409025-e1f6a56c1152', 1.493, 'Equipe de filmagem trabalhando em um grande estúdio', '#433e3c'),
  equipe: u('1632187981988-40f3cbaeef5e', 1.493, 'Grupo reunido em torno de uma câmera durante gravação', '#4a3c34'),
  fundo: u('1654723011680-0e037c2a4f18', 1.493, 'Câmera posicionada diante de um fundo infinito branco', '#8f8984'),
  foto: u('1542992933-ce75d0187ec1', 1.493, 'Mulher fotografando em ambiente escuro', '#1f2624'),
};

/** Imagens provisórias do espaço — substituir por fotos reais do estúdio Duetto. */
export const studioPhotos = {
  softbox: u('1786325492013-3858aaf08892', 0.752, 'Estúdio com softbox, espelho e cadeira de direção', '#beb6ab'),
  sala: u('1648740678671-c37d78567ea8', 1.493, 'Estúdio fotográfico com iluminação e tripé', '#a59268'),
  concreto: u('1786325492063-8967ed6ad88d', 1.333, 'Estúdio amplo com paredes de concreto e luz natural', '#c1bab4'),
  rosa: u('1647427854253-b92bb40c9330', 1.493, 'Set montado com fundo rosa e flashes', '#896471'),
  modelo: u('1536293283170-b4604bbe272f', 1.493, 'Modelo posando diante de uma softbox', '#9a6552'),
};

/** Imagem de abertura do site (desktop) e sua versão vertical para celular. */
export const heroPhoto = luz.persiana;
export const heroPhotoMobile: Photo = { ...luz.escuro, focus: '42% 30%' };
/** Segundo olhar do díptico da cena "Visão". */
export const visionPhoto = pele.ocre;
/** Imagem da cena de encerramento. */
export const closingPhoto = luz.contraluz;

/* ------------------------------------------------------------------ */
/* Projetos                                                            */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: 'entre-luz-e-sombra',
    title: 'Entre luz e sombra',
    category: 'pessoal',
    lede: 'Um ensaio feito com o que a luz do fim de tarde oferece.',
    text: [
      'Pouca luz, nenhuma pressa. O ensaio acompanha o desenho que o sol faz ao atravessar a janela e deixa que ele conduza o retrato.',
    ],
    cover: luz.persiana,
    blocks: [
      { kind: 'full', photo: luz.persiana },
      { kind: 'pair', photos: [luz.escuro, luz.contraluz], stagger: true },
      { kind: 'note', text: 'A sombra também descreve quem está diante da câmera.' },
      { kind: 'single', photo: luz.sombra, place: 'center', size: 'lg' },
    ],
    provisional: true,
  },
  {
    slug: 'presenca',
    title: 'Presença',
    category: 'marca',
    lede: 'Retratos para quem precisa comunicar autoridade sem perder a naturalidade.',
    text: [
      'Imagem profissional é posicionamento. Antes da câmera, uma conversa sobre como cada pessoa quer ser percebida; depois, retratos que sustentam essa escolha no site, nas redes e na imprensa.',
    ],
    cover: presenca.laranja,
    blocks: [
      { kind: 'single', photo: presenca.laranja, place: 'center', size: 'lg' },
      { kind: 'pair', photos: [presenca.blazer, presenca.janela] },
      { kind: 'note', text: 'Elegante, profissional e próxima — sem rigidez.' },
      { kind: 'single', photo: presenca.sorriso, place: 'right', size: 'md' },
      { kind: 'pair', photos: [presenca.terno1, presenca.terno2], stagger: true },
    ],
    provisional: true,
  },
  {
    slug: 'campo-aberto',
    title: 'Campo aberto',
    category: 'pessoal',
    lede: 'Um ensaio sobre espaço, vento e a coragem de ocupar o quadro.',
    text: [
      'Uma cadeira, um campo seco e a luz baixa do fim do dia. O ensaio pessoal nasce do que a pessoa quer mostrar de si — e encontra a cena certa para isso.',
    ],
    cover: campo.cadeira,
    blocks: [
      { kind: 'pair', photos: [campo.cadeira, campo.empe] },
      { kind: 'single', photo: campo.pordosol, place: 'left', size: 'lg' },
      { kind: 'note', text: 'O cenário existe para valorizar quem está nele.' },
      { kind: 'pair', photos: [campo.blazer, campo.sentada], stagger: true },
      { kind: 'single', photo: campo.close, place: 'right', size: 'md' },
      { kind: 'pair', photos: [campo.cidade, campo.vento] },
    ],
    provisional: true,
  },
  {
    slug: 'espera',
    title: 'Espera',
    category: 'gestante',
    lede: 'O tempo suspenso dos últimos meses, em fundo claro e luz suave.',
    text: [
      'Um ensaio de gestante em estúdio, com direção delicada e espaço para o silêncio. Poucas poses, muito cuidado com o conforto de quem está sendo fotografada.',
    ],
    cover: espera.perfil,
    blocks: [
      { kind: 'single', photo: espera.perfil, place: 'center', size: 'md' },
      { kind: 'pair', photos: [espera.olhar, espera.maos], stagger: true },
      { kind: 'note', text: 'Estou confortável. É daí que a imagem nasce.' },
      { kind: 'single', photo: espera.frente, place: 'left', size: 'md' },
    ],
    provisional: true,
  },
  {
    slug: 'mesa-posta',
    title: 'Mesa posta',
    category: 'marca',
    lede: 'Retratos de equipe para uma cozinha que tem orgulho de quem a faz.',
    text: [
      'Fotografia de marca para gastronomia: pessoas, gestos e o ambiente de trabalho registrados com a mesma atenção dada ao prato.',
    ],
    cover: mesa.salao,
    blocks: [
      { kind: 'single', photo: mesa.salao, place: 'left', size: 'lg' },
      { kind: 'pair', photos: [mesa.chef, mesa.preparo] },
      { kind: 'pair', photos: [mesa.avental, mesa.sorriso], stagger: true },
      { kind: 'note', text: 'Quem faz também é a marca.' },
      { kind: 'single', photo: mesa.equipe, place: 'right', size: 'md' },
    ],
    provisional: true,
  },
  {
    slug: 'primeiros-dias',
    title: 'Primeiros dias',
    category: 'familia',
    lede: 'A casa em luz baixa, nos primeiros dias de uma família nova.',
    text: [
      'Um registro sem pressa, feito no ritmo do bebê. A fotografia acompanha a rotina em vez de interrompê-la.',
    ],
    cover: dias.abajur,
    blocks: [
      { kind: 'full', photo: dias.abajur },
      { kind: 'single', photo: dias.nariz, place: 'right', size: 'lg' },
      { kind: 'pair', photos: [dias.cama, dias.colo] },
      { kind: 'note', text: 'Momentos pequenos, guardados com cuidado.' },
      { kind: 'single', photo: dias.bebe, place: 'left', size: 'md' },
      { kind: 'single', photo: dias.bracos, place: 'center', size: 'lg' },
    ],
    provisional: true,
  },
  {
    slug: 'cor-e-pele',
    title: 'Cor e pele',
    category: 'pessoal',
    lede: 'Fundos de cor, luz lateral e retratos que não pedem licença.',
    text: [
      'Uma série de retratos em estúdio construída com cor e textura. Cada fundo foi escolhido para conversar com o tom de pele e a personalidade de quem posou.',
    ],
    cover: pele.ocre,
    blocks: [
      { kind: 'pair', photos: [pele.ocre, pele.folhas] },
      { kind: 'single', photo: pele.flor, place: 'center', size: 'md' },
      { kind: 'note', text: 'Cada pessoa tem uma história e um objetivo.' },
      { kind: 'pair', photos: [pele.brinco, pele.ouro], stagger: true },
      { kind: 'single', photo: pele.anel, place: 'right', size: 'sm' },
    ],
    provisional: true,
  },
  {
    slug: 'casa-cheia',
    title: 'Casa cheia',
    category: 'familia',
    lede: 'Famílias inteiras no mesmo quadro — e ninguém precisando posar.',
    text: [
      'Ensaios de família em estúdio e ao ar livre. A direção é leve: brincadeiras, conversa e espaço para cada um ser quem é.',
    ],
    cover: casa.estudio,
    blocks: [
      { kind: 'single', photo: casa.estudio, place: 'center', size: 'lg' },
      { kind: 'pair', photos: [casa.campo, casa.bebe], stagger: true },
      { kind: 'full', photo: casa.cama },
      { kind: 'note', text: 'Eu faria novamente.' },
      { kind: 'pair', photos: [casa.brincadeira, casa.pai] },
    ],
    provisional: true,
  },
  {
    slug: 'noite-de-festa',
    title: 'Noite de festa',
    category: 'celebracao',
    lede: 'Aniversários e datas especiais registrados por dentro da celebração.',
    text: [
      'Cobertura de celebrações com olhar de quem está na festa: atenção aos gestos, às pessoas e ao que acontece entre um momento planejado e outro.',
    ],
    cover: festa.vela,
    blocks: [
      { kind: 'pair', photos: [festa.vela, festa.confete] },
      { kind: 'full', photo: festa.tiara },
      { kind: 'single', photo: festa.baloes, place: 'left', size: 'md' },
    ],
    provisional: true,
  },
  {
    slug: 'em-movimento',
    title: 'Em movimento',
    category: 'audiovisual',
    lede: 'Quando a história precisa de som, ritmo e tempo.',
    text: [
      'Produção audiovisual para pessoas e marcas: roteiro, captação e direção criativa com a mesma linguagem da fotografia.',
      'Vídeos reais do estúdio serão adicionados aqui com reprodução sob demanda.',
    ],
    cover: movimento.camera,
    blocks: [
      { kind: 'single', photo: movimento.camera, place: 'right', size: 'md' },
      { kind: 'full', photo: movimento.set },
      { kind: 'pair', photos: [movimento.equipe, movimento.fundo] },
      { kind: 'single', photo: movimento.foto, place: 'left', size: 'lg' },
    ],
    provisional: true,
  },
];

export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;

/** Categorias exibidas nos filtros: apenas as que têm trabalhos publicados. */
export const activeCategories = categories.filter((c) => projects.some((p) => p.category === c.id));

/** Projetos que aparecem na sequência "Trabalhos selecionados" da home. */
export const featuredSlugs = ['presenca', 'campo-aberto', 'primeiros-dias', 'cor-e-pele', 'espera'];

export function allPhotos(project: Project): Photo[] {
  const list: Photo[] = [];
  for (const b of project.blocks) {
    if (b.kind === 'full' || b.kind === 'single') list.push(b.photo);
    if (b.kind === 'pair') list.push(...b.photos);
  }
  return list;
}

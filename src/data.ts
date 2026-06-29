import { Product, UserStory } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Alface Manteiga Crocante',
    price: 4.50,
    category: 'vegetais',
    unit: 'unidade (250g)',
    quantity: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9phTr7dlQzJtpCCKvVMLke5ZYP4_wCNtEnjwcRpaRIEVsvIgKUYRQr4LmfColZG6MP2pH5FEzq3zD6K-V95OcytoAfj7kogWEQ9BZgy1Ipoyzlelgwg4jrQdDGAz125NTNybT7sCtplCmgbvA-PwOmraJyxOSOmugk7utTR3MzPi52E6hivlB6Bq7Yao4rWM3pRW7-PbJhXbNz6rcxrsyPZmop_Y6yj3CoSG3rdcG9SaUHSM7lZHP-DGlR3vUjx1XPTGftXAZShTH',
    rating: 4.9,
    reviewsCount: 128,
    isOrganic: true,
    isVegan: true,
    tag: 'Orgânico'
  },
  {
    id: '2',
    name: 'Rabanetes Orgânicos',
    price: 3.20,
    category: 'vegetais',
    unit: 'Maço (300g)',
    quantity: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWCm8Je2wUksjDqBkHcMM7_e2OVMDZfbjkevSe_Wgizc47UJduXm1gWl1YC2HA-fLJeVg2HinZA5adMes0k3nt1N9N4chwS-a8w9VTcXZDuasWvaseyzxxaBe6faGh4-fvAYt8XC2Nzgqk_u4UTMU91hCu1pajAtwGCZWZc4cHlfN3AExLVYPZPcNX-V48w9DydBcPt7FRO75XzK_UlBXC6Xg2PIrgbHtjp4FkIretAKli0oeytadYMzGw6BbOcmqCGVlyg0xEfcZ-',
    rating: 4.7,
    reviewsCount: 85,
    isOrganic: true,
    isVegan: true,
    tag: 'Vegano'
  },
  {
    id: '3',
    name: 'Mix Matinal Artesanal',
    price: 12.90,
    category: 'despensa',
    unit: 'Pote (350g)',
    quantity: 18,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5ik66OMIQZoz07HqU3eGJ0TTEFOeoPgQUoaMltFI3qvRE6Yb6q4OReHcFSBneJN-IeuJRsmBIqoH2V8iCzQ8ugbzB07MUatMYj2ze9PYIEiygDxdSgWn3oBhdIxyt0Be6nmnoBlIjFVvjLwI6ZgE8td_s-5RtkF-xtY6MZ4lTVaIUVkibIAT8cFbmmbiw6bSt0UzIoi-iqvY_k5BhX2KuG4NZPVS-KchTfkKIieRW_ToqMOdKjm5Q3o6_8_Bbnfutd-3GSNo29hLt',
    rating: 5.0,
    reviewsCount: 210,
    isOrganic: true,
    isGlutenFree: true,
    tag: 'Orgânico'
  },
  {
    id: '4',
    name: 'Couve Manteiga Fresca',
    price: 5.50,
    category: 'vegetais',
    unit: 'Maço (400g)',
    quantity: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeY6scs__Ki1CQ8xT5qJ4d-clU0mHeg0FvlTklwqmEkzUMDAmddk_1-49nkwk635yLOo1Cjk14FJvbZBVT_DhDrIXVVnhPkeOo842af6p_TaA80ChY4m3c9Z3cG9OkbeJfxg20nOu5S1CPkPUIWCcTHh1RqXJVV-OASTqWSmlWDIfaVtilfb4_ZOg_ZOBbubAPj1snmGtITIvI64G1fMoqEjaKP6OeDkbmv4TZ6gfZNccSoWDdXBqMI3AcgD6uCYV74NH0iY-L7Fp9',
    rating: 4.8,
    reviewsCount: 94,
    isOrganic: true,
    isVegan: true,
    tag: 'Orgânico'
  },
  {
    id: '5',
    name: 'Morango Orgânico',
    price: 12.90,
    category: 'frutas',
    unit: 'Bandeja (250g)',
    quantity: 8, // Estoque Baixo
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSylQ4tZzdb_ROa7UuKp0gGa5dXIPxyVnBDvam9NIQqRJ18jo2NOr_ziBojN2ISrpZAIEbFHeym3YOlGbLXsbbdb4q8rwcnCV34bVMyruYnu2HnEfpjfKWgz2jLRJGwEa2hgYscGJWfjaXu3ulKebJAkkNB8QzToTA1m3tiKvaA0m1BkFt3iHEsofON-Jq_v-j_myhwVzvA_BbAqQldXSOw1_KUaUjfJPZJDxCirgRainODHSxExa5-2f7Ap2x_xfuhvPoDMqsP5Tj',
    rating: 4.9,
    reviewsCount: 154,
    isOrganic: true,
    tag: 'Sazonal'
  },
  {
    id: '6',
    name: 'Quinoa Real em Grãos',
    price: 28.00,
    category: 'graos',
    unit: 'Pacote (500g)',
    quantity: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3djWbJ4Udipst-lOTaI9Qm3_sNmjts3kQbPU98NT-tT9d7xDqbMyNYfJCOfu4jovt3bCOPNc6LJUh9Ra-eYqtyFIvQmBveXFFHTseE4Wwt88sMMiKjiNdV38WMmzyKFiaNDpXKr2x9ZC6mCFV7f5TbLG3VIKBRnMY3JyZXs8QRCVbAOfY_TOYh3G0V-9X3coBx6sZto9bCGw-9h6ZXITpGiNLbWBgfcK_5_RwKhAeUISZLK1Evyavp805hkZIsCxPyQCnsdx5ZL91',
    rating: 4.9,
    reviewsCount: 72,
    isOrganic: true,
    isVegan: true,
    isGlutenFree: true,
    tag: 'Glúten-Free'
  },
  {
    id: '7',
    name: 'Cenouras Baby Orgânicas',
    price: 6.80,
    category: 'vegetais',
    unit: 'Pacote (400g)',
    quantity: 19,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewsCount: 48,
    isOrganic: true,
    isVegan: true,
    tag: 'Orgânico'
  },
  {
    id: '8',
    name: 'Tomate Cereja Orgânico',
    price: 8.50,
    category: 'vegetais',
    unit: 'Bandeja (300g)',
    quantity: 3, // Estoque Baixo
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewsCount: 65,
    isOrganic: true,
    isVegan: true,
    tag: 'Novidade'
  },
  {
    id: '9',
    name: 'Banana Prata da Terra',
    price: 7.20,
    category: 'frutas',
    unit: 'Maço (6 un)',
    quantity: 32,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 112,
    isOrganic: true,
    isVegan: true,
    tag: 'Fresco'
  },
  {
    id: '10',
    name: 'Granola de Cacau e Chia',
    price: 15.40,
    category: 'despensa',
    unit: 'Pote (300g)',
    quantity: 11,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 55,
    isVegan: true,
    isGlutenFree: true,
    tag: 'Vegano'
  }
];

export const USER_STORIES: UserStory[] = [
  {
    id: 'H1',
    title: 'Busca e Filtros',
    description: 'Como comprador, eu quero buscar produtos usando filtros (orgânico, vegano, categoria, preço, região) para encontrar rapidamente o que preciso sem ter que navegar por muitos itens.',
    gravity: 5,
    urgency: 5,
    trend: 5,
    total: 125,
    priority: '1º'
  },
  {
    id: 'H3',
    title: 'Checkout e Pagamento Seguro',
    description: 'Como comprador, eu quero finalizar meu pedido com pagamento integrado (cartão de crédito, boleto ou Pix) sem que o sistema armazene os meus dados de cartão para garantir segurança e conformidade com a LGPD.',
    gravity: 5,
    urgency: 5,
    trend: 5,
    total: 125,
    priority: '1º'
  },
  {
    id: 'H7',
    title: 'Cadastro de Produtor/Lojista',
    description: 'Como lojista ou produtor, quero me cadastrar (associar) no sistema, para poder acessar o tutorial e cadastrar produtos.',
    gravity: 5,
    urgency: 5,
    trend: 5,
    total: 125,
    priority: '1º'
  },
  {
    id: 'H4',
    title: 'Cadastro de Produtos',
    description: 'Como lojista, eu quero cadastrar meus produtos manualmente com nome, preço, foto, categoria e quantidade disponível para deixar meus itens visíveis aos compradores.',
    gravity: 5,
    urgency: 4,
    trend: 5,
    total: 100,
    priority: '2º'
  },
  {
    id: 'H2',
    title: 'Cálculo de Frete',
    description: 'Cálculo automático de custos de entrega com base na proximidade e peso do produto para dar transparência ao comprador.',
    gravity: 4,
    urgency: 4,
    trend: 4,
    total: 64,
    priority: '3º'
  },
  {
    id: 'H6',
    title: 'Tutorial para Lojista',
    description: 'Fluxo autoexplicativo (guia passo a passo) para que o lojista aprenda a subir fotos corretas e organizar seu catálogo.',
    gravity: 3,
    urgency: 5,
    trend: 3,
    total: 45,
    priority: '4º'
  },
  {
    id: 'H5',
    title: 'Atualização de Status de Pedido',
    description: 'Atualizações em tempo real (Preparando, Enviado, Entregue) visíveis tanto ao lojista quanto ao consumidor.',
    gravity: 3,
    urgency: 4,
    trend: 3,
    total: 36,
    priority: '5º'
  }
];

export const MVP_MATRIX = {
  e: [
    'Sistema organizado por módulos funcionais (busca, cadastro, pedidos, pagamento, gestão de lojas), voltado à comercialização de produtos veganos e orgânicos (e-commerce).',
    'Sistema que protege dados pessoais de consumidores e lojistas (LGPD) e funciona consistentemente durante a operação.',
    'De interface limpa, com hierarquia visual clara e fluxos guiados (wizards para cadastro de produtos).'
  ],
  nao_e: [
    'Não é um sistema de estoque avançado (ex: controle de inventário em tempo real com baixa automática).',
    'Não é um aplicativo mobile nativo (é web responsivo, excelente para qualquer dispositivo).',
    'Não é um sistema com certificação formal de segurança (ex: ISO 27001), apenas boas práticas básicas para MVP.'
  ],
  faz: [
    'Busca com filtros; cadastro de produtos, consumidores e lojas; cálculo de frete; gestão de pedidos.',
    'Tutorial para lojistas; busca em destaque; cards com selo; menu categorias.',
    'Simulação de criptografia; autenticação mock; backup diário de estado; logs de acesso básicos.'
  ],
  nao_faz: [
    'Rotas de entrega em tempo real; gestão de frotas de caminhões; comparação automática de preços entre lojas concorrentes.',
    'Armazenar dados de cartão de crédito no servidor (usa gateway externo), compartilhar dados sem consentimento, operar sem HTTPS.',
    'Exigir treinamento prévio; usar ícones ambíguos sem texto descritivo; exibir informações técnicas complexas ao usuário comum.'
  ]
};

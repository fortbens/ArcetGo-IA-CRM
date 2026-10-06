import { 
  PortalIntegration, 
  WebsiteTemplateOption, 
  WebsiteConfig,
  RealEstateProperty
} from '../types/crm';

export const INITIAL_PORTALS: PortalIntegration[] = [
  {
    id: 'portal_zap',
    portalCode: 'ZAP_VIVAREAL',
    name: 'Grupo ZAP (ZAP Imóveis + VivaReal)',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80',
    active: true,
    feedUrl: 'https://api.acertgo.com.br/v1/xml-feed/matriz_sp/zap-grupozap.xml?token=sec_zap_9841',
    totalPublished: 42,
    maxProperties: 50,
    highlightCount: 8,
    maxHighlights: 10,
    lastSyncAt: 'Hoje às 08:30 (Automático)',
    syncFrequencyHours: 2,
    status: 'ONLINE',
    leadWebhookActive: true
  },
  {
    id: 'portal_olx',
    portalCode: 'OLX',
    name: 'OLX Brasil Imóveis',
    logo: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=120&auto=format&fit=crop&q=80',
    active: true,
    feedUrl: 'https://api.acertgo.com.br/v1/xml-feed/matriz_sp/olx-brasil.xml?token=sec_olx_7712',
    totalPublished: 38,
    maxProperties: 45,
    highlightCount: 5,
    maxHighlights: 5,
    lastSyncAt: 'Hoje às 07:15 (Automático)',
    syncFrequencyHours: 4,
    status: 'ONLINE',
    leadWebhookActive: true
  },
  {
    id: 'portal_imovelweb',
    portalCode: 'IMOVELWEB',
    name: 'Imovelweb & ChaveFácil',
    logo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&auto=format&fit=crop&q=80',
    active: true,
    feedUrl: 'https://api.acertgo.com.br/v1/xml-feed/matriz_sp/imovelweb-carga.xml?token=sec_iw_3320',
    totalPublished: 35,
    maxProperties: 40,
    highlightCount: 3,
    maxHighlights: 5,
    lastSyncAt: 'Ontem às 22:00',
    syncFrequencyHours: 6,
    status: 'ONLINE',
    leadWebhookActive: true
  },
  {
    id: 'portal_mercadolivre',
    portalCode: 'MERCADO_LIVRE',
    name: 'Mercado Livre Imóveis',
    logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&auto=format&fit=crop&q=80',
    active: false,
    feedUrl: 'https://api.acertgo.com.br/v1/xml-feed/matriz_sp/mercadolivre.xml?token=sec_ml_5501',
    totalPublished: 0,
    maxProperties: 30,
    highlightCount: 0,
    maxHighlights: 2,
    lastSyncAt: 'Pausado pelo usuário',
    syncFrequencyHours: 12,
    status: 'PAUSED',
    leadWebhookActive: false
  },
  {
    id: 'portal_meta_catalog',
    portalCode: 'META_CATALOG',
    name: 'Meta Catalog (Facebook & Instagram Shopping)',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    active: true,
    feedUrl: 'https://api.acertgo.com.br/v1/xml-feed/matriz_sp/meta-real-estate.xml?token=sec_meta_9942',
    totalPublished: 42,
    maxProperties: 100,
    highlightCount: 0,
    maxHighlights: 0,
    lastSyncAt: 'Hoje às 09:00',
    syncFrequencyHours: 24,
    status: 'ONLINE',
    leadWebhookActive: true
  }
];

export const WEBSITE_TEMPLATE_OPTIONS: WebsiteTemplateOption[] = [
  {
    id: 'EXCLUSIVE_HIGH_END',
    name: 'Opção 1: Exclusive High-End',
    tagline: 'Sofisticação & Boutique de Alto Padrão',
    description: 'Design imersivo minimalista com fundo escuro elegante, detalhes dourados, fotos cinematográficas em tela cheia, agendamento de concierge VIP e foco em coberturas, mansões e condomínios de luxo.',
    bestFor: 'Imobiliárias boutique, corretores de altíssimo padrão e imóveis exclusivos acima de R$ 2 Milhões.',
    accentBadge: 'Alto Padrão VIP',
    features: [
      'Visual Dark Mode / Ouro de alto luxo',
      'Hero cinematográfico com tour virtual e vídeo',
      'Filtros refinados por metragem e suítes',
      'Botão de agendamento VIP direto no WhatsApp do concierge',
      'Galeria imersiva e ficha técnica de acabamentos'
    ],
    previewThumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    defaultColors: {
      primary: '#D4AF37', // Gold
      secondary: '#0F172A', // Slate 900
      background: '#0B0F19',
      text: '#F8FAFC'
    }
  },
  {
    id: 'URBAN_FLOW',
    name: 'Opção 2: Urban Flow & Lançamentos',
    tagline: 'Moderno, Tecnológico & Lançamentos na Planta',
    description: 'Layout vibrante, limpo e ágil com tons de azul e ciano. Foco em lançamentos na planta, studios para investidores, apartamentos modernos, simulador de crédito e mapa interativo de localização.',
    bestFor: 'Imobiliárias comerciais, loteadoras, vendas de lançamentos e público jovem/investidor.',
    accentBadge: 'Lançamentos & Planta',
    features: [
      'Espelho de unidades e plantas baixas interativas',
      'Simulador de parcelas de financiamento bancário na home',
      'Busca ultra rápida por bairros e proximidade de metrô',
      'Badges dinâmicos: Na Planta, Pronto para Morar, Em Obras',
      'Conversão ágil com formulário de plantão 24h'
    ],
    previewThumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    defaultColors: {
      primary: '#2563EB', // Blue 600
      secondary: '#06B6D4', // Cyan 500
      background: '#F8FAFC',
      text: '#0F172A'
    }
  },
  {
    id: 'FAST_RENT',
    name: 'Opção 3: FastRent & Locação Ágil',
    tagline: 'Locação Sem Fiador & Contratação 100% Digital',
    description: 'Estilo fintech imobiliária (inspirado em QuintoAndar e Loft), com foco em locação sem fiador, aprovação de crédito em 15 minutos, fotos verticais e calculadora de rentabilidade para proprietários.',
    bestFor: 'Imobiliárias focadas em locação residencial/comercial, administração de condomínios e giro rápido.',
    accentBadge: 'Locação Sem Fiador',
    features: [
      'Aluguel sem fiador com seguro fiança integrado',
      'Agendamento de visita presencial ou por vídeo em 1 clique',
      'Calculadora de aluguel líquido para proprietários',
      'Filtro exclusivo: Aceita Pet, Mobiliado, Perto de Metrô',
      'Área do inquilino e proprietário com 2ª via de boleto'
    ],
    previewThumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    defaultColors: {
      primary: '#10B981', // Emerald 500
      secondary: '#6366F1', // Indigo 500
      background: '#FFFFFF',
      text: '#1E293B'
    }
  },
  {
    id: 'HERITAGE_TRUST',
    name: 'Opção 4: Heritage & Tradição Familiar',
    tagline: 'Autoridade Local, Confiança & Família',
    description: 'Layout acolhedor clássico que valoriza a história e solidez da imobiliária no bairro, com foto e CRECI da diretoria, depoimentos de famílias clientes, mapa histórico da região e atendimento consultivo.',
    bestFor: 'Imobiliárias tradicionais, consolidadas em cidades médias/capitais, compra e venda de bairros consolidados.',
    accentBadge: 'Tradição & Bairros',
    features: [
      'Destaque para o CRECI Jurídico e anos de fundação',
      'Mural de depoimentos e histórias reais de clientes',
      'Vitrine dos corretores especialistas por cada bairro',
      'Canal de avaliação gratuita de imóveis para famílias',
      'Atendimento humanizado com botão "Falar com o Diretor"'
    ],
    previewThumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    defaultColors: {
      primary: '#0F766E', // Teal 700
      secondary: '#B45309', // Amber 700
      background: '#FDFBF7', // Warm White
      text: '#1C1917'
    }
  }
];

export const INITIAL_WEBSITE_CONFIG: WebsiteConfig = {
  templateId: 'URBAN_FLOW',
  siteName: 'AcertGo Imóveis & Negócios',
  slogan: 'A melhor experiência em compra, venda e locação de imóveis em São Paulo',
  creci: '128490-J / SP',
  customDomain: 'www.acertgoimoveis.com.br',
  subdomain: 'matriz.acertgo.com.br',
  isDomainActive: true,
  logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80',
  logoSize: 'MEDIO',
  fontFamily: 'Outfit',
  primaryColor: '#2563EB',
  secondaryColor: '#06B6D4',
  phone: '(11) 3042-8800',
  whatsapp: '(11) 99864-2424',
  email: 'contato@acertgo.com.br',
  address: 'Av. Brigadeiro Faria Lima, 3477 - 14º Andar - Itaim Bibi, São Paulo - SP',
  instagramHandle: '@acertgo.imoveis',
  showFinancingSimulator: true,
  showOwnerCaptureBanner: true,
  showVirtualTourBadge: true,
  featuredPropertyIds: ['IMO-101', 'IMO-102', 'IMO-103', 'IMO-104'],
  lastPublishedAt: 'Hoje às 08:00',
  status: 'PUBLICADO',

  whatsappButton: {
    enabled: true,
    number: '(11) 99864-2424',
    position: 'BOTTOM_RIGHT',
    welcomeMessage: 'Olá! Estava navegando no site da AcertGo e gostaria de atendimento sobre um imóvel.',
    showPulse: true,
    size: 'MEDIO',
    label: 'Fale Conosco no WhatsApp'
  },

  aboutUs: {
    title: 'Sobre a AcertGo Imóveis',
    story: 'Fundada há mais de 18 anos no coração do polo financeiro da Faria Lima, a AcertGo nasceu com o propósito de transformar a jornada imobiliária em uma experiência ágil, transparente e desburocratizada.',
    mission: 'Conectar pessoas aos seus melhores lares e investimentos com integridade, tecnologia e consultoria de alta precisão.',
    values: 'Ética inegociável, transparência jurídica, velocidade de atendimento e valorização dos parceiros.',
    yearsInMarket: 18,
    dealsClosed: 3420,
    satisfactionPercent: 99.4,
    heroBannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80'
  },

  institutionalVideo: {
    enabled: true,
    title: 'Conheça o Jeito AcertGo de Negociar Imóveis',
    subtitle: 'Assista ao nosso vídeo institucional e entenda porque somos referência em São Paulo',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
    duration: '2:45 min'
  },

  teamMembers: [
    {
      id: 'team_1',
      name: 'Dr. Roberto Mendonça',
      role: 'Diretor Geral & Fundador',
      creci: '45.892-F / SP',
      phone: '(11) 99876-1100',
      email: 'roberto@acertgo.com.br',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Especialista em Direito Imobiliário e avaliação patrimonial com mais de 25 anos de atuação.',
      specialty: 'Alto Padrão & Investimentos'
    },
    {
      id: 'team_2',
      name: 'Mariana Junqueira Prado',
      role: 'Gerente Comercial & Lançamentos',
      creci: '88.102-F / SP',
      phone: '(11) 98765-2200',
      email: 'mariana.prado@acertgo.com.br',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      bio: 'Lidera a equipe de vendas de lançamentos nos Jardins, Itaim Bibi e Vila Nova Conceição.',
      specialty: 'Jardins & Itaim Bibi'
    },
    {
      id: 'team_3',
      name: 'Lucas Brandão',
      role: 'Head de Locação & Fintech',
      creci: '94.215-F / SP',
      phone: '(11) 97654-3300',
      email: 'lucas.brandao@acertgo.com.br',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      bio: 'Especialista em locação digital sem fiador e split automático de aluguel para herdeiros.',
      specialty: 'Locação Residencial & Comercial'
    },
    {
      id: 'team_4',
      name: 'Juliana Falcão',
      role: 'Consultora de Crédito Imobiliário CCA',
      creci: '101.400-F / SP',
      phone: '(11) 96543-4400',
      email: 'juliana.falcao@acertgo.com.br',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      bio: 'Acelera a aprovação de financiamentos bancários em até 48h junto à Caixa, Itaú e Santander.',
      specialty: 'Financiamento Bancário & SFH'
    }
  ],

  testimonials: [
    {
      id: 'dep_1',
      clientName: 'Dra. Camila Bittencourt',
      roleOrProfession: 'Médica Cardiologista',
      comment: 'Vendi meu apartamento em Moema em apenas 18 dias e comprei uma cobertura no Itaim Bibi com a equipe AcertGo. Atendimento impecável, assessoria jurídica impecável e sem nenhuma dor de cabeça.',
      rating: 5,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      propertyTypeOrNeighborhood: 'Cobertura Duplex no Itaim Bibi'
    },
    {
      id: 'dep_2',
      clientName: 'Eng. Marcelo Queiroz',
      roleOrProfession: 'Diretor de Tecnologia',
      comment: 'A gestão do meu imóvel alugado pelo portal é espetacular. O aluguel cai no dia certinho via PIX com extrato detalhado e divisão entre meus dois filhos sem complicação.',
      rating: 5,
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      propertyTypeOrNeighborhood: 'Proprietário de 3 Imóveis em Cerqueira César'
    },
    {
      id: 'dep_3',
      clientName: 'Patrícia & Gustavo Lemos',
      roleOrProfession: 'Empresários',
      comment: 'Processo de locação sem fiador e sem burocracia. Em menos de 24 horas estávamos com as chaves na mão e contrato digital assinado no celular!',
      rating: 5,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      propertyTypeOrNeighborhood: 'Apartamento em Pinheiros'
    }
  ],

  blogPosts: [
    {
      id: 'post_1',
      title: 'Taxa Selic e o Mercado Imobiliário: É a hora certa de comprar em 2026?',
      slug: 'taxa-selic-mercado-imobiliario-2026',
      excerpt: 'Descubra como os ciclos de juros impactam o financiamento SFH e as melhores oportunidades em bairros nobres.',
      content: 'O mercado de imóveis de médio e alto padrão mantém forte valorização em São Paulo...',
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80',
      author: 'Dr. Roberto Mendonça',
      date: '20 de Setembro, 2026',
      category: 'Mercado & Finanças',
      readTime: '4 min de leitura'
    },
    {
      id: 'post_2',
      title: 'Guia do Inquilino: Como alugar sem fiador utilizando seguro fiança CredPago e Porto',
      slug: 'guia-locacao-sem-fiador',
      excerpt: 'Esqueça caução alta ou favor de parentes. Saiba como a análise em 15 minutos pelo cartão de crédito funciona.',
      content: 'A locação tradicional está no passado. Com a modalidade de garantia digital...',
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
      author: 'Lucas Brandão',
      date: '15 de Setembro, 2026',
      category: 'Locação Descomplicada',
      readTime: '3 min de leitura'
    },
    {
      id: 'post_3',
      title: 'Os 5 Bairros com Maior Potencial de Valorização do m² em São Paulo',
      slug: 'bairros-maior-valorizacao-sp',
      excerpt: 'Análise de infraestrutura, novas estações de metrô, praças arborizadas e lançamentos icônicos.',
      content: 'Pinheiros, Vila Madalena, Itaim e Moema continuam no topo do ranking de liquidez...',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      author: 'Mariana Junqueira',
      date: '08 de Setembro, 2026',
      category: 'Tendências Urbanas',
      readTime: '5 min de leitura'
    }
  ],

  customPages: [
    { id: 'page_1', title: 'Quem Somos', slug: 'quem-somos', content: 'História e DNA da nossa imobiliária.', published: true, showInFooter: true },
    { id: 'page_2', title: 'Trabalhe Conosco', slug: 'trabalhe-conosco', content: 'Faça parte da nossa equipe de corretores associados.', published: true, showInFooter: true },
    { id: 'page_3', title: 'Política de Privacidade & LGPD', slug: 'privacidade-lgpd', content: 'Compromisso com o sigilo e segurança dos dados.', published: true, showInFooter: true },
    { id: 'page_4', title: 'Avaliação Imobiliária Gratuita', slug: 'avaliacao-imovel', content: 'Descubra quanto vale o seu imóvel com base em dados de mercado.', published: true, showInFooter: true },
  ],

  mapConfig: {
    displayOnMapByDefault: true,
    showPointsOfInterest: true,
    mapStyle: 'MODERN',
    defaultZoom: 14
  },

  leadFormConfig: {
    enabled: true,
    title: 'Encontre o Imóvel Perfeito com Consultoria VIP',
    subtitle: 'Nossos corretores especialistas enviam opções exclusivas e agendam visitas no seu melhor horário',
    callToActionText: 'Quero Receber Opções VIP',
    requireFinancingInfo: true
  },

  customerPortalConfig: {
    enabled: true,
    title: 'Área do Cliente (Inquilino & Proprietário)',
    subtitle: 'Segunda via de boletos, solicitação de vistorias, abertura de chamados e extrato de repasses em um só lugar.',
    directAccessUrl: '#area-do-cliente'
  },

  referralBannerConfig: {
    enabled: true,
    title: 'Indique um Imóvel e Ganhe até R$ 2.500 no PIX!',
    rewardDescription: 'Conhece alguém querendo vender ou alugar? Porteiros, zeladores, síndicos e vizinhos ganham premiação em dinheiro a cada negócio fechado.',
    ctaText: 'Quero Indicar um Imóvel'
  }
};

/**
 * Generates valid standard ZAP / VivaReal XML snippet from property database
 */
export function generateSampleZapXml(properties: RealEstateProperty[]): string {
  const listings = properties.slice(0, 3).map(p => `
    <Listing>
      <ListingID>${p.code}</ListingID>
      <Title><![CDATA[${p.title}]]></Title>
      <TransactionType>${p.transactionType === 'LOCACAO' ? 'For Rent' : 'For Sale'}</TransactionType>
      <DetailViewUrl>https://acertgo.com.br/imovel/${p.code.toLowerCase()}</DetailViewUrl>
      <Media>
        <Item medium="image" caption="Fachada Principal">${p.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}</Item>
        ${p.images[1] ? `<Item medium="image" caption="Living">${p.images[1].url}</Item>` : ''}
      </Media>
      <Details>
        <UsageType>Residential</UsageType>
        <PropertyType>${p.propertyType}</PropertyType>
        <Description><![CDATA[${p.description}]]></Description>
        <ListPrice currency="BRL">${p.pricing.salePrice || p.pricing.rentPrice || 0}</ListPrice>
        ${p.pricing.condoFee ? `<PropertyAdministrationFee currency="BRL">${p.pricing.condoFee}</PropertyAdministrationFee>` : ''}
        ${p.pricing.iptuFee ? `<YearlyTax currency="BRL">${p.pricing.iptuFee * 12}</YearlyTax>` : ''}
        <LivingArea unit="square metres">${p.specs.usableAreaM2}</LivingArea>
        <Bedrooms>${p.specs.bedrooms}</Bedrooms>
        <Bathrooms>${p.specs.bathrooms}</Bathrooms>
        <Suites>${p.specs.suites}</Suites>
        <Garage unit="parking spaces">${p.specs.parkingSpaces}</Garage>
      </Details>
      <Location displayAddress="${p.address.displayAddressOnWeb ? 'All' : 'Neighborhood'}">
        <Country abbreviation="BR">Brasil</Country>
        <State abbreviation="${p.address.state}">${p.address.state}</State>
        <City>${p.address.city}</City>
        <Neighborhood>${p.address.neighborhood}</Neighborhood>
        <StreetAddress>${p.address.displayAddressOnWeb ? p.address.street : 'Oculto a pedido do proprietário'}</StreetAddress>
      </Location>
      <ContactInfo>
        <Name>AcertGo Imóveis Matriz</Name>
        <Email>leads-zap@acertgo.com.br</Email>
        <Website>https://acertgo.com.br</Website>
      </ContactInfo>
    </Listing>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns="http://www.vivareal.com/schemas/1.0/VRSync"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://www.vivareal.com/schemas/1.0/VRSync vr-sync.xsd">
  <Header>
    <Provider>AcertGo SaaS CRM Real Estate Feed Engine v4.2</Provider>
    <Email>suporte@acertgo.com.br</Email>
    <ContactName>Diretoria Comercial AcertGo</ContactName>
    <PublishDate>${new Date().toISOString()}</PublishDate>
  </Header>
  <Listings>${listings}
  </Listings>
</ListingDataFeed>`;
}

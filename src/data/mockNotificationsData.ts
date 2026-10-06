import { SystemNotification, PlatformBroadcastBanner, DemoPresentationScenario } from '../types/notifications';

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  // Super Admin Platform Broadcasts
  {
    id: 'notif_sa_01',
    title: 'Nova Atualização AcertGo: Assinatura Digital & Check-in de Stand',
    message: 'Liberada a nova esteira com verificação biométrica e geofencing para plantões de vendas. Nenhuma ação necessária da sua equipe.',
    category: 'PLATAFORMA_SISTEMA',
    priority: 'ALTA',
    channels: ['PUSH', 'BANNER', 'IN_APP'],
    targetAudience: 'TODOS_SISTEMA',
    senderName: 'Administração AcertGo',
    senderRole: 'PLATAFORMA_SUPER_ADMIN',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isRead: false,
    isPinnedBanner: true,
    actionLabel: 'Ver Detalhes do Release',
    actionUrl: 'super_admin',
    createdAt: 'Há 15 minutos',
    metadata: {
      bannerTheme: 'purple'
    }
  },
  {
    id: 'notif_sa_02',
    title: 'Aviso de Manutenção Programada dos Gateways Bancários',
    message: 'Neste domingo, das 02:00 às 04:00, os serviços de emissão de boletos e consultas SAC/Price da Caixa passarão por melhorias preventivas.',
    category: 'PLATAFORMA_SISTEMA',
    priority: 'MEDIA',
    channels: ['BANNER', 'IN_APP'],
    targetAudience: 'TODOS_SISTEMA',
    senderName: 'Equipe de Infraestrutura',
    senderRole: 'PLATAFORMA_SUPER_ADMIN',
    isRead: true,
    isPinnedBanner: false,
    createdAt: 'Há 2 horas',
    metadata: {
      bannerTheme: 'warning'
    }
  },

  // Real Estate Director Announcements to the Team
  {
    id: 'notif_dir_01',
    title: 'Comunicado da Diretoria: Plantão Especial Jardins One neste Sábado',
    message: 'Todos os corretores escalados devem realizar o check-in pontualmente até as 08:30 no stand. Bônus especial de 0.5% para o primeiro fechamento do dia!',
    category: 'COMUNICADO_DIRETORIA',
    priority: 'ALTA',
    channels: ['PUSH', 'BANNER', 'IN_APP', 'WHATSAPP'],
    targetAudience: 'TODA_IMOBILIARIA',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    senderName: 'Emerson Carneiro',
    senderRole: 'DIRETOR_GERAL',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    isRead: false,
    isPinnedBanner: true,
    actionLabel: 'Ver Escala no Stand',
    actionUrl: 'roleta',
    createdAt: 'Há 35 minutos',
    metadata: {
      bannerTheme: 'info',
      standName: 'Stand Jardins One'
    }
  },
  {
    id: 'notif_dir_02',
    title: 'Meta da Semana: 5 Visitas Concluídas = R$ 500 no Pix',
    message: 'Campanha relâmpago de aceleração comercial da Diretoria. Registre o laudo da visita e o feedback do cliente no CRM para validar a bonificação.',
    category: 'COMUNICADO_DIRETORIA',
    priority: 'MEDIA',
    channels: ['PUSH', 'IN_APP'],
    targetAudience: 'CORRETORES_VENDAS',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    senderName: 'Diretoria Comercial',
    senderRole: 'DIRETOR_GERAL',
    isRead: false,
    actionLabel: 'Abrir Funil de Vendas',
    actionUrl: 'kanban',
    createdAt: 'Há 3 horas'
  },

  // Operational Push Notifications (Leads, Fintech, GPS, Contracts)
  {
    id: 'notif_op_01',
    title: 'Lead Qualificado Distribuído na Roleta (SLA 15 min)',
    message: 'Dr. Fernando Albuquerque acabou de solicitar visita para a Cobertura Duplex nos Jardins (R$ 8.900.000). Inicie o atendimento agora.',
    category: 'LEAD_ROLETA',
    priority: 'CRITICA',
    channels: ['PUSH', 'IN_APP'],
    targetAudience: 'USUARIO_INDIVIDUAL',
    senderName: 'Roleta de Atendimento',
    senderRole: 'SISTEMA_CRM',
    isRead: false,
    actionLabel: 'Chamar no WhatsApp',
    actionUrl: 'kanban',
    createdAt: 'Há 4 minutos',
    metadata: {
      leadId: 'lead_01',
      propertyCode: 'COB-JARDINS-01'
    }
  },
  {
    id: 'notif_op_02',
    title: 'Split de Comissão Aprovado e Liquidado no Pix',
    message: 'Contrato LOC-2026-904: Repasse de R$ 14.850,00 liquidado na sua conta bancária cadastrada.',
    category: 'FINANCEIRO_SPLIT',
    priority: 'ALTA',
    channels: ['PUSH', 'IN_APP'],
    targetAudience: 'USUARIO_INDIVIDUAL',
    senderName: 'Fintech AcertGo Split',
    senderRole: 'SISTEMA_FINTEHC',
    isRead: false,
    actionLabel: 'Ver Comprovante Pix',
    actionUrl: 'fintech_split',
    createdAt: 'Há 1 hora',
    metadata: {
      commissionAmount: 14850
    }
  },
  {
    id: 'notif_op_03',
    title: 'Check-in de Stand Confirmado com Sucesso',
    message: 'Presença validada no Stand Jardins Sky Lounge. Sua posição no sorteio diário está confirmada.',
    category: 'STAND_GPS',
    priority: 'BAIXA',
    channels: ['PUSH', 'IN_APP'],
    targetAudience: 'USUARIO_INDIVIDUAL',
    senderName: 'Validação de Presença',
    senderRole: 'SISTEMA_GPS',
    isRead: true,
    actionLabel: 'Ver Fila do Plantão',
    actionUrl: 'roleta',
    createdAt: 'Há 4 horas'
  },
  {
    id: 'notif_op_04',
    title: 'Contrato Assinado Digitalmente pelas Partes',
    message: 'Locação Residencial Rua Oscar Freire assinada com certificado digital por Locador e Locatário. Chaves liberadas para vistoria.',
    category: 'JURIDICO_CONTRATOS',
    priority: 'MEDIA',
    channels: ['PUSH', 'IN_APP'],
    targetAudience: 'TODA_IMOBILIARIA',
    senderName: 'Módulo Jurídico & DocuSign',
    senderRole: 'SISTEMA_JURIDICO',
    isRead: true,
    actionLabel: 'Acessar Contrato',
    actionUrl: 'contracts',
    createdAt: 'Ontem às 17:40'
  }
];

export const INITIAL_BROADCAST_BANNERS: PlatformBroadcastBanner[] = [
  {
    id: 'banner_sa_01',
    title: 'Novidade na Plataforma: Inteligência Artificial AcertAI e Simulador de Financiamento Caixa 2026',
    content: 'O novo motor preditivo de conversão de leads já está ativo para todas as filiais. Teste gerando propostas bancárias instantâneas!',
    level: 'NOVIDADE',
    scope: 'SUPER_ADMIN_GLOBAL',
    active: true,
    isDismissible: true,
    linkText: 'Explorar Recursos',
    linkActionTab: 'cca_banking',
    authorName: 'Super Admin Plataforma',
    authorRole: 'SaaS Administrator',
    startDate: '2026-09-25T08:00:00Z'
  },
  {
    id: 'banner_dir_01',
    title: 'Comunicado da Diretoria AcertGo: Plantão Presencial no Empreendimento Jardins One neste Sábado',
    content: 'Sorteio da ordem de atendimento pontualmente às 08:30 via GPS. Chegue no raio de 10 metros para validar a presença na urna eletrônica.',
    level: 'INFO',
    scope: 'IMOBILIARIA_INTERNO',
    active: true,
    isDismissible: true,
    linkText: 'Ver Stand & Escala',
    linkActionTab: 'roleta',
    authorName: 'Emerson Carneiro (Diretor Geral)',
    authorRole: 'Diretoria Executiva',
    startDate: '2026-09-26T09:00:00Z'
  }
];

export const DEMO_PRESENTATION_SCENARIOS: DemoPresentationScenario[] = [
  {
    id: 'jardins_prime',
    name: 'Imobiliária Prime Jardins (Alto Padrão & Luxo)',
    tagline: 'Operação boutique com foco em coberturas, penthouses e clientes UHNW',
    description: 'Cenário ideal para apresentar a corretores de alto padrão e diretores exigentes. Destaca vistorias com fotos de alta resolução, esteira CCA com aprovação expressa e split de comissão.',
    badge: 'Luxo & VGV R$ 145M',
    vgv: 'R$ 145.800.000',
    brokersCount: 42,
    leadsActiveCount: 384,
    highlightModules: [
      'Roleta com Roleta 24/7 & Plantões GPS 10m',
      'Universidade Corporativa EAD Gamificada',
      'Fintech Split com Repasses Pix Automáticos',
      'Espelho de Vendas 3D das Penthouses'
    ],
    suggestedPitchPoints: [
      'Demonstre como a Roleta distribui um lead de R$ 10M em 15 minutos sem favorecimento.',
      'Abra a Universidade Corporativa e mostre os certificados com autenticidade digital.',
      'Mostre a DRE da imobiliária no Painel do Diretor com lucro líquido de R$ 184k/mês.'
    ]
  },
  {
    id: 'rede_alpha',
    name: 'Rede Alpha Franchising (Multi-Tenant & Expansão)',
    tagline: 'Gestão multi-filial para redes imobiliárias com mais de 100 corretores',
    description: 'Cenário ideal para franquias e grandes imobiliárias. Demonstra isolamento total por filiais (Jardins, Alphaville, Barra), controle financeiro consolidado e inteligência de leads.',
    badge: 'Franquia · 12 Filiais',
    vgv: 'R$ 380.000.000',
    brokersCount: 128,
    leadsActiveCount: 1420,
    highlightModules: [
      'Super Admin SaaS com Gestão de Planos & Mensalidades',
      'Multi-Tenancy com Alternância Instantânea de Filial',
      'DRE Consolidada e Repasses de Royalties',
      'Whaticket Omnichannel para 50 Atendentes Simultâneos'
    ],
    suggestedPitchPoints: [
      'Mostre o dropdown de Filial no topo alternando entre São Paulo, Alphaville e Rio de Janeiro.',
      'Abra o painel Super Admin e mostre o MRR de R$ 248k e as faturas de cada filial.',
      'Demonstre a esteira de correspondente bancário (CCA) aprovando crédito Caixa.'
    ]
  },
  {
    id: 'sky_horizon',
    name: 'Incorporadora Sky Horizon (Lançamentos na Planta)',
    tagline: 'Foco exclusivo em plantões de vendas, stands, maquetes 3D e comissões de lançamentos',
    description: 'Cenário configurado para construtoras e house de vendas. Destaca o sorteio diário no stand de vendas com verificação por satélite no raio de 10 metros e espelho de vendas com bloqueio de unidades.',
    badge: 'Lançamentos & Stands',
    vgv: 'R$ 210.000.000',
    brokersCount: 65,
    leadsActiveCount: 610,
    highlightModules: [
      'Stand de Vendas com Cercamento GPS Estrito de 10m',
      'Espelho de Vendas Dinâmico com Reserva de 48 Horas',
      'Treinamento de Produto EAD do Lançamento',
      'Comissões RPA com Split Automático Construtora x Corretor'
    ],
    suggestedPitchPoints: [
      'Execute a simulação do sorteio diário às 08:30 no Stand com verificação de raio GPS.',
      'Reserve uma unidade no Espelho de Vendas e mostre o cronômetro de expiração em tempo real.',
      'Abra o treinamento do lançamento Jardins Sky na Universidade Corporativa.'
    ]
  }
];

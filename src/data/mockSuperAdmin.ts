import {
  SaaSModule,
  SaaSPlan,
  TenantAgency,
  PlatformUserAccount,
  PermissionDefinition,
  PlatformUserHierarchy,
  SystemWhiteLabelConfig,
  AuditLogItem
} from '../types/superAdmin';

export const INITIAL_SAAS_MODULES: SaaSModule[] = [
  {
    id: 'crm_roleta',
    code: 'MOD-01',
    name: 'Rodízio & Roleta de Leads',
    category: 'VENDAS',
    description: 'Distribuição inteligente round-robin, filas por dia, SLA de primeiro contato e re-atribuição automática.',
    isCore: true,
    monthlyAddonPrice: 0,
    iconName: 'Shuffle',
    features: ['Roleta Round-Robin', 'Fila por Dia da Semana', 'SLA Anti-Vácuo', 'Re-atribuição Inteligente']
  },
  {
    id: 'whatsapp_desk',
    code: 'MOD-02',
    name: 'Desk WhatsApp Multi-Atendente',
    category: 'VENDAS',
    description: 'Central de chat estilo Whaticket, múltiplos corretores no mesmo número, disparos e tags automáticas.',
    isCore: true,
    monthlyAddonPrice: 190,
    iconName: 'MessageSquare',
    features: ['Multi-atendimento', 'QR Code de Conexão', 'Mensagens Rápidas', 'Notas Privadas (Whisper)']
  },
  {
    id: 'kanban_funnel',
    code: 'MOD-03',
    name: 'Funil Kanban & Pipeline',
    category: 'VENDAS',
    description: 'Gestão visual de leads em etapas configuráveis, motivos de perda e taxa de conversão.',
    isCore: true,
    monthlyAddonPrice: 0,
    iconName: 'Columns',
    features: ['Etapas Customizáveis', 'Drag & Drop', 'Automação de Mudança de Fase', 'Histórico Completo']
  },
  {
    id: 'imoveis_portais',
    code: 'MOD-04',
    name: 'Estoque de Imóveis & Integração Portais',
    category: 'GESTAO',
    description: 'Cadastro completo de imóveis (PF/PJ), especificações técnicas, fotos em alta resolução e integração XML.',
    isCore: true,
    monthlyAddonPrice: 0,
    iconName: 'Home',
    features: ['Catálogo Completo', 'Exportação XML ZAP/VivaReal', 'Gerador de Ficha PDF', 'Tour Virtual 360']
  },
  {
    id: 'proprietarios',
    code: 'MOD-05',
    name: 'Gestão de Proprietários (PF & PJ)',
    category: 'GESTAO',
    description: 'Cadastro unificado de proprietários, dados bancários para repasse Pix, documentação e contratos vinculados.',
    isCore: true,
    monthlyAddonPrice: 0,
    iconName: 'UserCheck',
    features: ['Pessoa Física e Jurídica', 'Dados Bancários e Chave Pix', 'Controle de Imóveis por Dono', 'Painel de Repasses']
  },
  {
    id: 'fintech_split',
    code: 'MOD-06',
    name: 'Motor Fintech Split Pix (Asaas)',
    category: 'FINANCEIRO',
    description: 'Cobrança automatizada de aluguéis com liquidação instantânea de taxas de adm, condomínio e repasse ao proprietário.',
    isCore: false,
    monthlyAddonPrice: 350,
    iconName: 'Wallet',
    features: ['Split Pix Automatizado', 'Cobrança via Boleto & Pix', 'Provisionamento de ISS/IRRF', 'Webhooks em Tempo Real']
  },
  {
    id: 'vistorias_chaves',
    code: 'MOD-07',
    name: 'Vistorias Digitais & Claviculário',
    category: 'OPERACAO',
    description: 'Laudos de vistoria de entrada e saída com fotos, assinatura digital na ponta e controle de retiradas de chaves.',
    isCore: false,
    monthlyAddonPrice: 190,
    iconName: 'KeyRound',
    features: ['Laudo com Fotos e Assinatura', 'Claviculário Inteligente', 'Alerta de Atraso de Devolução', 'Suporte Offline']
  },
  {
    id: 'comissoes_rpa',
    code: 'MOD-08',
    name: 'Comissões & Emissão de RPA',
    category: 'FINANCEIRO',
    description: 'Divisão automática de comissões (captador, fechador, gerente, imobiliária) e geração de recibos RPA.',
    isCore: false,
    monthlyAddonPrice: 220,
    iconName: 'CreditCard',
    features: ['Regras de Repasse Customizadas', 'Geração de RPA / NFS-e', 'Histórico Fiscal', 'Previsão de Receita']
  },
  {
    id: 'cca_banking',
    code: 'MOD-09',
    name: 'Esteira Bancária CCA Multibancos',
    category: 'FINANCEIRO',
    description: 'Simulador e acompanhamento de propostas de financiamento Caixa, Itaú, Santander e Bradesco com comissão CCA.',
    isCore: false,
    monthlyAddonPrice: 250,
    iconName: 'Building',
    features: ['Simulação Multibancos', 'Gestão de Etapas de Crédito', 'Comissão Adicional CCA (+1.2%)', 'Upload de Documentos']
  },
  {
    id: 'espelho_3d',
    code: 'MOD-10',
    name: 'Espelho de Lançamentos 3D',
    category: 'VENDAS',
    description: 'Tabela de disponibilidades interativa por andar, torre e prumada para lançamentos e incorporações.',
    isCore: false,
    monthlyAddonPrice: 290,
    iconName: 'Layers',
    features: ['Visão por Andar e Prumada', 'Reserva Instantânea', 'Controle de Permutas', 'Espelho Corretor Externo']
  },
  {
    id: 'bi_analytics',
    code: 'MOD-11',
    name: 'BI & Alertas Gargalo de Venda',
    category: 'INTELIGENCIA',
    description: 'Dashboards analíticos de conversão, CAC, LTV, tempo médio de atendimento e detecção preditiva de perda.',
    isCore: false,
    monthlyAddonPrice: 290,
    iconName: 'BarChart3',
    features: ['Métricas em Tempo Real', 'Alertas Preditivos de Gargalo', 'Exportação Excel/CSV', 'Ranking de Desempenho']
  },
  {
    id: 'acertai_engine',
    code: 'MOD-12',
    name: 'AcertAI Engine (Copilot & SDR)',
    category: 'INTELIGENCIA',
    description: 'Inteligência artificial para redação de anúncios para portais, qualificação prévia de leads e sugestão de matches.',
    isCore: false,
    monthlyAddonPrice: 390,
    iconName: 'Sparkles',
    features: ['Gerador de Descrições de Imóveis', 'Matchmaker Lead x Imóvel', 'Scripts de Vendas WhatsApp', 'Auditoria de Atendimento']
  }
];

export const INITIAL_SAAS_PLANS: SaaSPlan[] = [
  {
    id: 'plan_starter',
    name: 'Plano Essencial',
    tier: 'STARTER',
    monthlyPrice: 590,
    annualPrice: 5664, // 20% desc
    description: 'Ideal para imobiliárias e assessorias em estruturação com time de até 5 corretores.',
    maxUsers: 5,
    maxProperties: 200,
    maxLeadsPerMonth: 500,
    whatsappIncluded: false,
    includedModuleIds: ['crm_roleta', 'kanban_funnel', 'imoveis_portais', 'proprietarios', 'comissoes_rpa'],
    badge: 'Iniciantes',
    status: 'ACTIVE',
    activeTenantsCount: 14
  },
  {
    id: 'plan_pro',
    name: 'Imobiliária Pro',
    tier: 'PROFESSIONAL',
    monthlyPrice: 1390,
    annualPrice: 13344, // 20% desc
    description: 'O pacote mais completo para imobiliárias médias com alta rotatividade de leads e carteira de locação.',
    maxUsers: 25,
    maxProperties: 1000,
    maxLeadsPerMonth: 3000,
    whatsappIncluded: true,
    includedModuleIds: [
      'crm_roleta',
      'whatsapp_desk',
      'kanban_funnel',
      'imoveis_portais',
      'proprietarios',
      'fintech_split',
      'vistorias_chaves',
      'comissoes_rpa',
      'cca_banking',
      'bi_analytics'
    ],
    isPopular: true,
    badge: 'Mais Popular',
    status: 'ACTIVE',
    activeTenantsCount: 38
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Redes',
    tier: 'ENTERPRISE',
    monthlyPrice: 2890,
    annualPrice: 27744,
    description: 'Infraestrutura dedicada para redes e franquias com multi-filiais, espelho 3D e AcertAI liberado.',
    maxUsers: 100,
    maxProperties: 5000,
    maxLeadsPerMonth: 15000,
    whatsappIncluded: true,
    includedModuleIds: [
      'crm_roleta',
      'whatsapp_desk',
      'kanban_funnel',
      'imoveis_portais',
      'proprietarios',
      'fintech_split',
      'vistorias_chaves',
      'comissoes_rpa',
      'cca_banking',
      'espelho_3d',
      'bi_analytics',
      'acertai_engine'
    ],
    badge: 'Alta Performance',
    status: 'ACTIVE',
    activeTenantsCount: 12
  },
  {
    id: 'plan_custom',
    name: 'Custom White-label',
    tier: 'CUSTOM',
    monthlyPrice: 4800,
    annualPrice: 46080,
    description: 'Domínio próprio, aplicativo customizado nas lojas, SLA 24/7 e arquitetura dedicada multi-tenancy.',
    maxUsers: -1, // ilimitado
    maxProperties: 25000,
    maxLeadsPerMonth: 50000,
    whatsappIncluded: true,
    includedModuleIds: [
      'crm_roleta',
      'whatsapp_desk',
      'kanban_funnel',
      'imoveis_portais',
      'proprietarios',
      'fintech_split',
      'vistorias_chaves',
      'comissoes_rpa',
      'cca_banking',
      'espelho_3d',
      'bi_analytics',
      'acertai_engine'
    ],
    badge: 'Franquias & Redes',
    status: 'ACTIVE',
    activeTenantsCount: 4
  }
];

export const INITIAL_TENANTS: TenantAgency[] = [
  {
    id: 'tenant_matriz_sp',
    name: 'AcertGo Imóveis Matriz Jardins Ltda',
    tradeName: 'AcertGo Matriz Jardins',
    cnpj: '18.492.341/0001-92',
    creciJ: '34.890-J / SP',
    subdomain: 'matriz.acertgo.com.br',
    customDomain: 'imoveis.acertgo.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80',
    ownerName: 'Emerson Carneiro dos Santos',
    ownerEmail: 'diretorcarneiro@gmail.com',
    ownerPhone: '(11) 99864-2424',
    city: 'São Paulo',
    state: 'SP',
    address: 'Av. Brigadeiro Faria Lima, 3477 - 12º Andar, Itaim Bibi',
    status: 'ACTIVE',
    planId: 'plan_enterprise',
    planName: 'Enterprise Redes',
    billingCycle: 'MENSAL',
    monthlyBilling: 2890,
    activeModules: [
      'crm_roleta',
      'whatsapp_desk',
      'kanban_funnel',
      'imoveis_portais',
      'proprietarios',
      'fintech_split',
      'vistorias_chaves',
      'comissoes_rpa',
      'cca_banking',
      'espelho_3d',
      'bi_analytics',
      'acertai_engine'
    ],
    customTheme: {
      primaryColor: '#2563eb',
      secondaryColor: '#0ea5e9',
      appName: 'AcertGo Matriz'
    },
    stats: {
      usersCount: 42,
      propertiesCount: 840,
      activeLeadsCount: 1420,
      monthlyDealsVolume: 18500000
    },
    createdAt: '2024-01-15T10:00:00Z',
    nextBillingDate: '2026-10-15',
    paymentMethod: 'PIX',
    adminPassword: 'Acert@2026',
    inviteCode: 'MATRIZ-2026',
    initialModule: 'kanban',
    chosenSiteTemplate: 'URBAN_FLOW',
    chosenSiteTitle: 'AcertGo Matriz Jardins · Imóveis Exclusivos'
  },
  {
    id: 'tenant_alphaville',
    name: 'AcertGo Barueri & Tamboré Negócios Imobiliários Ltda',
    tradeName: 'AcertGo Alphaville & Tamboré',
    cnpj: '24.910.882/0001-44',
    creciJ: '41.209-J / SP',
    subdomain: 'alphaville.acertgo.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
    ownerName: 'Camila Albuquerque',
    ownerEmail: 'camila.alphaville@acertgo.com.br',
    ownerPhone: '(11) 98765-4321',
    city: 'Barueri',
    state: 'SP',
    address: 'Alameda Rio Negro, 503 - Sl. 1402, Alphaville Centro Industrial',
    status: 'ACTIVE',
    planId: 'plan_pro',
    planName: 'Imobiliária Pro',
    billingCycle: 'MENSAL',
    monthlyBilling: 1390,
    activeModules: [
      'crm_roleta',
      'whatsapp_desk',
      'kanban_funnel',
      'imoveis_portais',
      'proprietarios',
      'fintech_split',
      'vistorias_chaves',
      'comissoes_rpa',
      'cca_banking',
      'bi_analytics'
    ],
    customTheme: {
      primaryColor: '#0284c7',
      secondaryColor: '#38bdf8',
      appName: 'AcertGo Alphaville'
    },
    stats: {
      usersCount: 18,
      propertiesCount: 320,
      activeLeadsCount: 680,
      monthlyDealsVolume: 9200000
    },
    createdAt: '2024-06-10T14:30:00Z',
    nextBillingDate: '2026-10-10',
    paymentMethod: 'CARTAO_CREDITO',
    adminPassword: 'Alpha@2026',
    inviteCode: 'ALPHA-2026',
    initialModule: 'imoveis',
    chosenSiteTemplate: 'EXCLUSIVE_HIGH_END',
    chosenSiteTitle: 'AcertGo Alphaville & Tamboré · Mansões & Condomínios'
  },
  {
    id: 'tenant_barra',
    name: 'AcertGo Barra & Recreio Soluções Imobiliárias Ltda',
    tradeName: 'AcertGo Barra Prime',
    cnpj: '31.114.756/0001-19',
    creciJ: '09.432-J / RJ',
    subdomain: 'barra.acertgo.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&auto=format&fit=crop&q=80',
    ownerName: 'Rodrigo Santoro Fontes',
    ownerEmail: 'rodrigo.barra@acertgo.com.br',
    ownerPhone: '(21) 98844-3322',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Av. das Américas, 3500 - Bloco 4, Barra da Tijuca',
    status: 'ACTIVE',
    planId: 'plan_pro',
    planName: 'Imobiliária Pro',
    billingCycle: 'ANUAL',
    monthlyBilling: 1112, // mensalizado do plano anual
    activeModules: [
      'crm_roleta',
      'whatsapp_desk',
      'kanban_funnel',
      'imoveis_portais',
      'proprietarios',
      'fintech_split',
      'comissoes_rpa',
      'bi_analytics'
    ],
    customTheme: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      appName: 'AcertGo Barra Prime'
    },
    stats: {
      usersCount: 14,
      propertiesCount: 260,
      activeLeadsCount: 510,
      monthlyDealsVolume: 7400000
    },
    createdAt: '2024-11-01T09:15:00Z',
    nextBillingDate: '2026-11-01',
    paymentMethod: 'BOLETO',
    adminPassword: 'Barra@2026',
    inviteCode: 'BARRA-2026',
    initialModule: 'roleta',
    chosenSiteTemplate: 'URBAN_FLOW',
    chosenSiteTitle: 'Barra Prime Imóveis · Lançamentos e Coberturas'
  },
  {
    id: 'tenant_nexus',
    name: 'Nexus Real Estate Boutique Curitiba Ltda',
    tradeName: 'Nexus Home & Prime',
    cnpj: '44.821.092/0001-77',
    creciJ: '07.654-J / PR',
    subdomain: 'nexushome.acertgo.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&auto=format&fit=crop&q=80',
    ownerName: 'Guilherme Bastos',
    ownerEmail: 'contato@nexushome.com.br',
    ownerPhone: '(41) 99123-8899',
    city: 'Curitiba',
    state: 'PR',
    address: 'Rua Comendador Araújo, 499 - Batel',
    status: 'TRIAL',
    planId: 'plan_starter',
    planName: 'Plano Essencial',
    billingCycle: 'MENSAL',
    monthlyBilling: 590,
    activeModules: ['crm_roleta', 'kanban_funnel', 'imoveis_portais', 'proprietarios', 'comissoes_rpa'],
    stats: {
      usersCount: 4,
      propertiesCount: 48,
      activeLeadsCount: 110,
      monthlyDealsVolume: 1200000
    },
    createdAt: '2026-09-18T16:00:00Z',
    trialEndsAt: '2026-10-02',
    nextBillingDate: '2026-10-02',
    paymentMethod: 'PIX',
    adminPassword: 'Nexus@2026',
    inviteCode: 'NEXUS-2026',
    initialModule: 'kanban',
    chosenSiteTemplate: 'FAST_RENT',
    chosenSiteTitle: 'Nexus Home & Prime Curitiba · Locação Digital'
  },
  {
    id: 'tenant_lumiere',
    name: 'Lumière Imóveis Alto Padrão BH Ltda',
    tradeName: 'Lumière Imóveis Boutique',
    cnpj: '39.400.118/0001-33',
    creciJ: '08.912-J / MG',
    subdomain: 'lumiere.acertgo.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80',
    ownerName: 'Renata Castanho',
    ownerEmail: 'renata@lumierebh.com.br',
    ownerPhone: '(31) 98787-1234',
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Rua Santa Catarina, 1200 - Lourdes',
    status: 'ACTIVE',
    planId: 'plan_enterprise',
    planName: 'Enterprise Redes',
    billingCycle: 'MENSAL',
    monthlyBilling: 2890,
    activeModules: [
      'crm_roleta',
      'whatsapp_desk',
      'kanban_funnel',
      'imoveis_portais',
      'proprietarios',
      'fintech_split',
      'vistorias_chaves',
      'comissoes_rpa',
      'cca_banking',
      'espelho_3d',
      'bi_analytics',
      'acertai_engine'
    ],
    stats: {
      usersCount: 32,
      propertiesCount: 490,
      activeLeadsCount: 920,
      monthlyDealsVolume: 14600000
    },
    createdAt: '2025-03-20T11:00:00Z',
    nextBillingDate: '2026-10-20',
    paymentMethod: 'CARTAO_CREDITO',
    adminPassword: 'Lumiere@2026',
    inviteCode: 'LUMIERE-2026',
    initialModule: 'sites_modelos',
    chosenSiteTemplate: 'EXCLUSIVE_HIGH_END',
    chosenSiteTitle: 'Lumière Imóveis Boutique BH · Alto Luxo Lourdes'
  },
  {
    id: 'tenant_beiramar',
    name: 'Beira Mar Floripa Consultoria Imobiliária Ltda',
    tradeName: 'Beira Mar Soluções Imobiliárias',
    cnpj: '28.199.402/0001-65',
    creciJ: '05.120-J / SC',
    subdomain: 'beiramar.acertgo.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=200&auto=format&fit=crop&q=80',
    ownerName: 'Felipe D Avila',
    ownerEmail: 'felipe@beiramarfloripa.com.br',
    ownerPhone: '(48) 99888-7711',
    city: 'Florianópolis',
    state: 'SC',
    address: 'Av. Beira Mar Norte, 2200 - Centro',
    status: 'SUSPENDED',
    planId: 'plan_pro',
    planName: 'Imobiliária Pro',
    billingCycle: 'MENSAL',
    monthlyBilling: 1390,
    activeModules: ['crm_roleta', 'whatsapp_desk', 'kanban_funnel', 'imoveis_portais', 'proprietarios'],
    stats: {
      usersCount: 9,
      propertiesCount: 140,
      activeLeadsCount: 85,
      monthlyDealsVolume: 0
    },
    createdAt: '2024-08-14T08:00:00Z',
    nextBillingDate: '2026-09-14',
    paymentMethod: 'BOLETO',
    adminPassword: 'Beira@2026',
    inviteCode: 'BEIRAMAR-2026',
    initialModule: 'imoveis',
    chosenSiteTemplate: 'HERITAGE_TRUST',
    chosenSiteTitle: 'Beira Mar Soluções Imobiliárias · Florianópolis'
  }
];

export const INITIAL_PLATFORM_USERS: PlatformUserAccount[] = [
  {
    id: 'usr_super_admin',
    name: 'Emerson Carneiro dos Santos',
    email: 'diretorcarneiro@gmail.com',
    phone: '(11) 99864-2424',
    role: 'SUPER_ADMIN',
    tenantId: 'GLOBAL',
    tenantName: 'Plataforma Global AcertGo SaaS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creci: 'SaaS Master Key',
    cpf: '111.222.333-44',
    rg: '22.333.444-5 SSP/SP',
    birthDate: '1980-08-25',
    admissionDate: '2023-11-01',
    department: 'Diretoria Geral & Super Admin',
    address: {
      cep: '01452-002',
      street: 'Av. Brigadeiro Faria Lima',
      number: '2800',
      complement: '14º Andar',
      neighborhood: 'Jardim Paulistano',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Mariana Carneiro',
      relationship: 'Cônjuge',
      phone: '(11) 99988-1122',
      notes: 'Contato direto emergência'
    },
    status: 'ATIVO',
    password: 'Super@2026',
    inviteCode: 'SUPER-MASTER-KEY',
    lastLoginAt: 'Hoje às 09:14',
    createdAt: '2023-11-01'
  },
  {
    id: 'usr_diretor',
    name: 'Emerson Carneiro dos Santos',
    email: 'diretorcarneiro@acertgo.com.br',
    phone: '(11) 99864-2424',
    role: 'MASTER_ADMIN',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creci: '128490-F / SP',
    cpf: '222.333.444-55',
    rg: '33.444.555-6 SSP/SP',
    birthDate: '1980-08-25',
    admissionDate: '2024-01-15',
    department: 'Diretoria Executiva',
    address: {
      cep: '04538-133',
      street: 'Rua Joaquim Floriano',
      number: '960',
      complement: 'Cobertura',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Mariana Carneiro',
      relationship: 'Esposa',
      phone: '(11) 99123-4567',
      notes: 'Tipo sanguíneo A+'
    },
    status: 'ATIVO',
    password: 'Acert@2026',
    inviteCode: 'MATRIZ-2026',
    lastLoginAt: 'Hoje às 08:30',
    createdAt: '2024-01-15'
  },
  {
    id: 'usr_gerente',
    name: 'Camila Albuquerque',
    email: 'camila.gerente@acertgo.com.br',
    phone: '(11) 98765-4321',
    role: 'MANAGER',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creci: '154320-F / SP',
    cpf: '333.444.555-66',
    rg: '44.555.666-7 SSP/SP',
    birthDate: '1989-12-14',
    admissionDate: '2024-01-20',
    department: 'Gerência de Vendas',
    address: {
      cep: '05407-002',
      street: 'Rua Teodoro Sampaio',
      number: '1100',
      complement: 'Apto 82',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Rodrigo Albuquerque',
      relationship: 'Irmão',
      phone: '(11) 98777-3322'
    },
    status: 'ATIVO',
    password: 'Acert@2026',
    inviteCode: 'MATRIZ-2026',
    lastLoginAt: 'Hoje às 09:05',
    createdAt: '2024-01-20'
  },
  {
    id: 'usr_corretor_juliana',
    name: 'Juliana Mendes',
    email: 'juliana.mendes@acertgo.com.br',
    phone: '(11) 97777-2005',
    role: 'BROKER',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    creci: '210984-F / SP',
    cpf: '342.981.458-12',
    birthDate: '1990-05-14',
    admissionDate: '2024-02-01',
    department: 'Vendas Alto Padrão',
    address: {
      cep: '04538-133',
      street: 'Rua Joaquim Floriano',
      number: '820',
      complement: 'Apto 112',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Marcos Mendes',
      relationship: 'Cônjuge',
      phone: '(11) 99881-2233'
    },
    status: 'ATIVO',
    password: 'Acert@2026',
    inviteCode: 'MATRIZ-2026',
    lastLoginAt: 'Ontem às 17:40',
    createdAt: '2024-02-01'
  },
  {
    id: 'usr_financeiro',
    name: 'Vanessa Nogueira',
    email: 'financeiro@acertgo.com.br',
    phone: '(11) 96543-2198',
    role: 'FINANCIAL_OPERATOR',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    creci: 'CRA 84920',
    cpf: '444.555.666-77',
    birthDate: '1993-03-30',
    admissionDate: '2024-01-18',
    department: 'Controladoria & Split',
    address: {
      cep: '04001-001',
      street: 'Rua Tutóia',
      number: '450',
      neighborhood: 'Paraíso',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'José Carlos Nogueira',
      relationship: 'Pai',
      phone: '(11) 98222-1133'
    },
    status: 'ATIVO',
    password: 'Acert@2026',
    inviteCode: 'MATRIZ-2026',
    lastLoginAt: 'Hoje às 08:00',
    createdAt: '2024-01-18'
  },
  {
    id: 'usr_nexus_admin',
    name: 'Guilherme Bastos',
    email: 'contato@nexushome.com.br',
    phone: '(41) 99123-8899',
    role: 'MASTER_ADMIN',
    tenantId: 'tenant_nexus',
    tenantName: 'Nexus Home & Prime (Curitiba)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creci: '32190-F / PR',
    cpf: '555.666.777-88',
    department: 'Diretoria Curitiba',
    address: {
      cep: '80420-000',
      street: 'Rua Comendador Araújo',
      number: '499',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR'
    },
    emergencyContact: {
      name: 'Fernanda Bastos',
      relationship: 'Esposa',
      phone: '(41) 98877-2211'
    },
    status: 'ATIVO',
    password: 'Nexus@2026',
    inviteCode: 'NEXUS-2026',
    lastLoginAt: 'Hoje às 10:12',
    createdAt: '2026-09-18'
  }
];

export const PLATFORM_HIERARCHIES: PlatformUserHierarchy[] = [
  {
    role: 'SUPER_ADMIN',
    label: 'Super Admin Global SaaS',
    level: 1,
    description: 'Acesso irrestrito a todas as imobiliárias, faturamento, banco de dados, planos, módulos e auditoria.',
    color: 'text-rose-600 bg-rose-50 border-rose-200'
  },
  {
    role: 'MASTER_ADMIN',
    label: 'Diretor / Sócio (Tenant Master)',
    level: 2,
    description: 'Gestão total da sua imobiliária: equipe, financeiro, regras de comissão, roleta e exclusão de cadastros.',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    role: 'MANAGER',
    label: 'Gerente de Vendas',
    level: 3,
    description: 'Supervisão de corretores, modo fantasma no WhatsApp, reatribuição de leads e relatórios de conversão.',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    role: 'FINANCIAL_OPERATOR',
    label: 'Operador Financeiro',
    level: 4,
    description: 'Emissão de RPA, gestão do Motor Fintech Split Pix, repasses aos proprietários e relatórios DRE/Dimob.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    role: 'BROKER',
    label: 'Corretor Interno',
    level: 5,
    description: 'Acesso aos seus próprios leads na roleta, chat WhatsApp, catálogo de imóveis e reserva de unidades.',
    color: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  {
    role: 'EXTERNAL_PARTNER',
    label: 'Corretor Externo / Parceiro',
    level: 6,
    description: 'Visualização de espelho de lançamentos e submissão de propostas comissionadas com validação.',
    color: 'text-slate-600 bg-slate-50 border-slate-200'
  }
];

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  {
    id: 'perm_tenants_manage',
    category: 'SaaS & Plataforma',
    name: 'Gerenciar Imobiliárias (Tenants)',
    description: 'Cadastrar, suspender, alterar planos e módulos das imobiliárias.',
    defaultRoles: ['SUPER_ADMIN']
  },
  {
    id: 'perm_plans_manage',
    category: 'SaaS & Plataforma',
    name: 'Criar e Editar Planos SaaS',
    description: 'Definir preços, limites de usuários e módulos dos planos.',
    defaultRoles: ['SUPER_ADMIN']
  },
  {
    id: 'perm_audit_view',
    category: 'Segurança & Auditoria',
    name: 'Visualizar Logs de Auditoria Global',
    description: 'Acesso completo ao rastro de alterações e IPs de todas as contas.',
    defaultRoles: ['SUPER_ADMIN']
  },
  {
    id: 'perm_properties_write',
    category: 'Estoque & Imóveis',
    name: 'Cadastrar e Editar Imóveis',
    description: 'Criar fichas, adicionar fotos, definir preços e comissões.',
    defaultRoles: ['SUPER_ADMIN', 'MASTER_ADMIN', 'MANAGER', 'BROKER']
  },
  {
    id: 'perm_properties_delete',
    category: 'Estoque & Imóveis',
    name: 'Excluir Imóveis do Catálogo',
    description: 'Remover definitivamente imóveis da base de dados.',
    defaultRoles: ['SUPER_ADMIN', 'MASTER_ADMIN']
  },
  {
    id: 'perm_owners_manage',
    category: 'Proprietários & Splits',
    name: 'Gerenciar Proprietários e Chaves Pix',
    description: 'Editar dados bancários confidenciais para repasse de aluguéis.',
    defaultRoles: ['SUPER_ADMIN', 'MASTER_ADMIN', 'FINANCIAL_OPERATOR']
  },
  {
    id: 'perm_fintech_split',
    category: 'Financeiro & Fintech',
    name: 'Executar e Autorizar Split Pix',
    description: 'Disparar liquidações via gateway Asaas e emitir recibos.',
    defaultRoles: ['SUPER_ADMIN', 'MASTER_ADMIN', 'FINANCIAL_OPERATOR']
  },
  {
    id: 'perm_roleta_override',
    category: 'Vendas & Leads',
    name: 'Reatribuir Leads na Roleta',
    description: 'Remover lead da fila de um corretor e atribuir a outro manualmente.',
    defaultRoles: ['SUPER_ADMIN', 'MASTER_ADMIN', 'MANAGER']
  },
  {
    id: 'perm_export_data',
    category: 'Segurança & LGPD',
    name: 'Exportar Base de Clientes (CSV/Excel)',
    description: 'Extração massiva de contatos telefônicos e CPFs.',
    defaultRoles: ['SUPER_ADMIN', 'MASTER_ADMIN']
  }
];

export const INITIAL_WHITE_LABEL_CONFIG: SystemWhiteLabelConfig = {
  platformName: 'AcertGo Real Estate Cloud OS',
  tagline: 'O mais avançado ecossistema SaaS para Imobiliárias, Lançamentos e Fintech',
  logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80',
  faviconUrl: '/favicon.ico',
  primaryColor: '#2563eb', // Blue 600
  secondaryColor: '#0ea5e9', // Sky 500
  accentColor: '#10b981', // Emerald 500
  supportEmail: 'suporte@acertgo.com.br',
  supportPhone: '(11) 3090-5000',
  websiteUrl: 'https://acertgo.com.br',
  termsUrl: 'https://acertgo.com.br/termos',
  privacyUrl: 'https://acertgo.com.br/privacidade',
  enableSelfRegistration: true,
  enableTrialMode: true,
  trialDurationDays: 14,
  billingGateway: {
    provider: 'ASAAS',
    environment: 'PRODUCTION',
    apiKeyMasked: 'asaas_live_••••••••••••••••382a',
    webhookUrl: 'https://api.acertgo.com.br/v1/webhooks/asaas-subscription',
    autoSuspendOverdueDays: 5
  },
  smtpConfig: {
    host: 'smtp.sendgrid.net',
    port: 587,
    senderEmail: 'noreply@acertgo.com.br',
    senderName: 'AcertGo Plataforma Imobiliária',
    useTls: true
  }
};

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-24T10:14:22Z',
    action: 'CRIOU_IMOBILIARIA',
    category: 'TENANT',
    userId: 'usr_super_admin',
    userName: 'Eduardo Fontes',
    userRole: 'SUPER_ADMIN',
    tenantId: 'tenant_nexus',
    tenantName: 'Nexus Home & Prime',
    ipAddress: '177.136.240.12',
    severity: 'INFO',
    details: 'Cadastrou nova imobiliária no período Trial de 14 dias (Plano Essencial - 5 licenças).'
  },
  {
    id: 'log_02',
    timestamp: '2026-09-24T09:45:10Z',
    action: 'ALTEROU_MODULOS_CONTRATADOS',
    category: 'MODULO',
    userId: 'usr_super_admin',
    userName: 'Eduardo Fontes',
    userRole: 'SUPER_ADMIN',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    ipAddress: '177.136.240.12',
    severity: 'INFO',
    details: 'Ativou módulo adicional: AcertAI Engine (Copilot & SDR) com cobrança mensal inclusa no pacote Enterprise.'
  },
  {
    id: 'log_03',
    timestamp: '2026-09-24T08:30:19Z',
    action: 'LOGIN_SUCESSO',
    category: 'SEGURANCA',
    userId: 'usr_diretor',
    userName: 'Dr. Leonardo Carneiro',
    userRole: 'MASTER_ADMIN',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    ipAddress: '201.86.110.45',
    severity: 'INFO',
    details: 'Autenticação 2FA bem-sucedida via App Authenticator.'
  },
  {
    id: 'log_04',
    timestamp: '2026-09-23T18:12:00Z',
    action: 'SUSPENSAO_TENANT_INADIMPLENCIA',
    category: 'FINANCEIRO',
    userId: 'SYS_AUTOMATION',
    userName: 'Sistema Automação Financeira',
    userRole: 'SISTEMA',
    tenantId: 'tenant_beiramar',
    tenantName: 'Beira Mar Soluções Imobiliárias',
    ipAddress: '127.0.0.1',
    severity: 'WARNING',
    details: 'Fatura fat_2026_09 com vencimento em 14/09 atingiu 9 dias em atraso. Acesso suspenso conforme política.'
  },
  {
    id: 'log_05',
    timestamp: '2026-09-23T15:20:44Z',
    action: 'EXCLUIU_IMOVEL',
    category: 'CONFIGURACAO',
    userId: 'usr_diretor',
    userName: 'Dr. Leonardo Carneiro',
    userRole: 'MASTER_ADMIN',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Matriz Jardins',
    ipAddress: '201.86.110.45',
    severity: 'WARNING',
    details: 'Exclusão física do imóvel código IMO-109 (Venda concluída fora do sistema).'
  },
  {
    id: 'log_06',
    timestamp: '2026-09-22T11:05:32Z',
    action: 'ALTEROU_CONFIG_GATEWAY',
    category: 'CONFIGURACAO',
    userId: 'usr_super_admin',
    userName: 'Eduardo Fontes',
    userRole: 'SUPER_ADMIN',
    ipAddress: '177.136.240.12',
    severity: 'CRITICAL',
    details: 'Chave de API do gateway Asaas de produção foi revalidada e webhook testado com status 200 OK.'
  }
];

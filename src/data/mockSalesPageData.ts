import { SalesPageCmsState } from '../types/salesPageCms';

export const INITIAL_SALES_PAGE_DATA: SalesPageCmsState = {
  settings: {
    announcementBarText: 'Nova Versão: Módulo de Splits com 10 Bancos API, Assinatura Digital e Roteiro de Visitas Integrado',
    announcementActive: true,
    announcementBadge: 'NOVIDADE',
    whatsappContactNumber: '5511987654321',
    whatsappDefaultMessage: 'Olá! Gostaria de uma demonstração VIP do sistema imobiliário com planos a partir de R$ 399,99.',
    showFloatingWhatsapp: true,
    logoHeight: 52,
    demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    metaTitle: 'Acert Imob - O CRM ERP Imobiliário Definitivo com a Melhor Gestão de Leads',
    metaDescription: 'Multiplique suas vendas com o melhor CRM ERP do mercado. Roleta de leads em 30s, WhatsApp multi-atendente, splits bancários automáticos e planos a partir de R$ 399,99.'
  },
  hero: {
    badgeText: 'PLATAFORMA IMOBILIÁRIA INTEGRADA',
    headline: 'Multiplique suas Vendas com a Melhor',
    highlightedWord: 'Gestão de Leads e ERP Integrado',
    subheadline: 'Elimine o vácuo de atendimento com roleta de leads em 30s, centralize o WhatsApp da equipe, automatize splits de aluguel e comissões com 10 bancos via API. Tudo em uma só tela a partir de R$ 399,99/mês.',
    primaryCtaText: 'Começar Teste Grátis de 14 Dias',
    secondaryCtaText: 'Ver Demonstração ao Vivo',
    guaranteeText: '✓ Sem fidelidade obrigatória  ✓ Migração gratuita de dados  ✓ Ativação em até 10 minutos',
    stats: [
      {
        value: '38s',
        label: 'Tempo Médio de 1º Contato',
        sublabel: 'contra 45min da média do mercado'
      },
      {
        value: '+340%',
        label: 'Aumento na Conversão de Leads',
        sublabel: 'com roleta anti-vácuo e cadência IA'
      },
      {
        value: '10 APIs',
        label: 'Bancos e Splits Homologados',
        sublabel: 'Conta Pronta, Mercado Pago, Asaas e +'
      },
      {
        value: '99.8%',
        label: 'Satisfação dos Clientes',
        sublabel: '+1.400 imobiliárias em todo o país'
      }
    ]
  },
  plans: [
    {
      id: 'plan_starter_399',
      name: 'Start Imob',
      tag: 'A partir de R$ 399,99',
      badge: 'Entrada Facilitada',
      monthlyPrice: 399.99,
      annualPrice: 319.99, // com 20% no anual
      isPopular: false,
      isStartingPlan: true,
      description: 'Perfeito para corretores autônomos e imobiliárias boutique acelerarem captações e fechamentos rápidos.',
      maxBrokers: 'Até 5 Corretores',
      maxProperties: 'Até 300 Imóveis Ativos',
      maxLeadsMonth: 'Leads Ilimitados',
      features: [
        'Roleta Inteligente de Leads (Round-Robin)',
        'CRM Funil Kanban Visual de Vendas e Locação',
        'Integração Portais (ZAP, VivaReal, OLX)',
        'Captura de Meta Ads (Facebook & Instagram)',
        'Emissão de Boletos e Pix Avulsos',
        'Módulo de Roteiro de Visitas com GPS',
        'Ficha Digital de Imóveis para WhatsApp',
        'Suporte Especializado via Ticket & Chat'
      ],
      ctaText: 'Garantir Plano Start por R$ 399,99',
      active: true
    },
    {
      id: 'plan_pro_699',
      name: 'Performance Pro',
      tag: 'O Mais Escolhido',
      badge: 'MAIS POPULAR • MELHOR ROI',
      monthlyPrice: 699.99,
      annualPrice: 559.99,
      isPopular: true,
      isStartingPlan: false,
      description: 'A solução mais completa para imobiliárias em escala que precisam de alto poder de conversão de leads e automação fiscal.',
      maxBrokers: 'Até 15 Corretores',
      maxProperties: 'Até 1.500 Imóveis Ativos',
      maxLeadsMonth: 'Leads Ilimitados + SLA Automático',
      features: [
        'Tudo do Plano Start Imob e mais:',
        'Central WhatsApp Desk Multi-Atendente Oficial',
        'SLA Anti-Vácuo com Re-atribuição de Leads',
        'Splits Automáticos de Comissões via API',
        'Assinatura Digital Integrada (Clicksign, ZapSign, D4Sign)',
        'Check-in Georreferenciado com Assinatura na Tela',
        'Portal do Proprietário e Inquilino com 2ª via Pix',
        'Painel Financeiro DRE e Previsão de Receita',
        'Onboarding VIP com Gerente de Contas'
      ],
      ctaText: 'Quero o Plano Pro com Desconto',
      active: true
    },
    {
      id: 'plan_enterprise_1299',
      name: 'Enterprise & Redes',
      tag: 'Máxima Performance',
      badge: 'SOLUÇÃO DEFINITIVA',
      monthlyPrice: 1299.99,
      annualPrice: 1039.99,
      isPopular: false,
      isStartingPlan: false,
      description: 'Infraestrutura robusta de ponta a ponta para redes imobiliárias, franquias e grandes operações de lançamentos.',
      maxBrokers: 'Corretores Ilimitados',
      maxProperties: 'Estoque Ilimitado de Imóveis',
      maxLeadsMonth: 'Alta Escala com IA de Atendimento',
      features: [
        'Tudo do Plano Performance Pro e mais:',
        'Gestão Multi-Filiais e Franquias Unificada',
        'Conta BaaS Dedicada (Conta Pronta ou Asaas)',
        'AcertAI Engine: Qualificação Preditiva de Leads',
        'Espelho de Vendas 3D para Lançamentos',
        'White-label Total: Seu Domínio, Marca e Cores',
        'API Rest Pública para Integrações Customizadas',
        'SLA de Suporte de 15 Minutos via WhatsApp VIP',
        'Treinamento Completo da Equipe de Vendas'
      ],
      ctaText: 'Falar com Consultor Enterprise',
      active: true
    }
  ],
  leadHighlights: [
    {
      id: 'roleta_leads',
      title: 'Roleta de Leads Anti-Vácuo em 30 Segundos',
      subtitle: 'Nunca mais perca um lead para a concorrência',
      description: 'Distribuição inteligente round-robin por plantão, especialidade do corretor, bairro de preferência e velocidade de resposta. Se o corretor não responder no SLA definido (ex: 2 minutos), o lead pula para o próximo automaticamente!',
      iconName: 'Zap',
      badge: 'Zero Vácuo',
      bullets: [
        'Distribuição em tempo real 24/7',
        'Filas por especialidade (Locação, Prontos, Lançamentos)',
        'Cronômetro de SLA visível para a gerência',
        'Alerta sonoro e push no WhatsApp do corretor'
      ],
      highlightMetric: '92%',
      highlightLabel: 'dos leads são contatados nos primeiros 3 minutos',
      active: true
    },
    {
      id: 'omnichannel_capture',
      title: 'Captura Unificada de Todas as Fontes',
      subtitle: 'ZAP, VivaReal, OLX, Meta Ads, Google e Site Próprio',
      description: 'Centralize 100% dos seus canais em um único funil sem precisar importar planilhas ou trocar de abas. O lead entra e os dados de perfil, imóvel desejado e UTM de campanha são associados instantaneamente.',
      iconName: 'Layers',
      badge: 'Centralização Total',
      bullets: [
        'Webhooks instantâneos com Meta Ads e Google Lead Forms',
        'Integração oficial com os maiores portais imobiliários',
        'Rastreamento exato de qual anúncio gerou a venda (ROI real)',
        'Detecção e mescla automática de leads duplicados'
      ],
      highlightMetric: '0',
      highlightLabel: 'leads perdidos no limbo ou em planilhas esquecidas',
      active: true
    },
    {
      id: 'whatsapp_multi',
      title: 'WhatsApp Oficial Multi-Atendimento com IA',
      subtitle: 'Toda a equipe no mesmo número oficial da imobiliária',
      description: 'Tenha controle total das conversas dos corretores. Distribuição automática por departamento, mensagens rápidas padronizadas, notas internas e qualificação prévia com Inteligência Artificial para agendamento de visitas.',
      iconName: 'MessageSquare',
      badge: 'WhatsApp Desk',
      bullets: [
        'Histórico das conversas fica seguro na imobiliária',
        'Sem risco de perder contatos se um corretor sair da equipe',
        'Envio de fichas de imóveis com fotos e tour direto no chat',
        'Qualificação prévia com chatbot humanizado'
      ],
      highlightMetric: '4.8x',
      highlightLabel: 'mais visitas agendadas por dia por corretor',
      active: true
    },
    {
      id: 'kanban_cadencia',
      title: 'Funis Visuais Kanban com Cadência Automática',
      subtitle: 'Esteira clara de vendas, locação e captação',
      description: 'Gerencie o ciclo de vida completo do cliente com visão clara de cada etapa. Disparos automáticos de lembretes, tarefas de follow-up e alertas para leads estagnados há mais de 48 horas.',
      iconName: 'Columns',
      badge: 'Alta Conversão',
      bullets: [
        'Etapas 100% customizáveis para a sua operação',
        'Filtros rápidos por temperatura (Quente, Morno, Frio)',
        'Métricas de tempo de permanência em cada estágio',
        'Motivos de perda mapeados para auditoria comercial'
      ],
      highlightMetric: '+215%',
      highlightLabel: 'aumento de produtividade da equipe comercial',
      active: true
    }
  ],
  erpHighlights: [
    {
      id: 'split_bancario_10apis',
      title: 'Motor de Splits com 10 Bancos e Gateways API',
      subtitle: 'Liquidação D+0 e D+1 sem trabalho manual',
      description: 'Integração pronta com Conta Pronta, Mercado Pago, Pagar.me, Asaas, PagSeguro, PJBank, Iugu, Cora, Inter e Celcoin. Na liquidação do aluguel ou venda, a taxa de administração vai para a imobiliária, o repasse vai para o proprietário e as comissões vão direto para os corretores.',
      iconName: 'Wallet',
      badge: 'Fintech Imobiliária',
      bullets: [
        'Split automático no Pix e Boleto bancário',
        'Elimina bitributação e reduz riscos fiscais',
        'Gestão de subcontas bancárias de proprietários e corretores',
        'Conciliação bancária 100% automática via Webhook'
      ],
      highlightMetric: '100%',
      highlightLabel: 'automatizado, economizando mais de 40 horas/mês do financeiro',
      active: true
    },
    {
      id: 'assinatura_digital_api',
      title: 'Assinatura Digital de Documentos via API',
      subtitle: 'Contratos fechados em minutos pelo celular',
      description: 'Integração com Clicksign, ZapSign, D4Sign, DocuSign, Autentique e CertiSign. Gere contratos de compra e venda, locação ou autorizações de venda e envie com um clique para WhatsApp com validade jurídica (ICP-Brasil e MP 2.200-2).',
      iconName: 'FileCheck',
      badge: 'Validade Jurídica',
      bullets: [
        'Envio direto por WhatsApp e E-mail',
        'Acompanhamento em tempo real de quem já visualizou e assinou',
        'Token via WhatsApp e SMS com geolocalização e selfie',
        'Armazenamento seguro com trilha de auditoria completa'
      ],
      highlightMetric: '85%',
      highlightLabel: 'dos contratos são assinados em menos de 2 horas',
      active: true
    },
    {
      id: 'roteiro_visitas_gps',
      title: 'Roteiro de Visitas Inteligente com GPS e Check-in',
      subtitle: 'Otimização de tempo e proteção legal da corretagem',
      description: 'Planeje roteiros de visitas otimizados por distância e trânsito com navegação direta via Waze e Google Maps. Check-in com geolocalização a menos de 50 metros do imóvel e Ficha de Visita Digital com assinatura do cliente na tela do celular.',
      iconName: 'Compass',
      badge: 'Exclusividade e Segurança',
      bullets: [
        'Ordem otimizada de paradas para economizar combustível e tempo',
        'Check-in automático comprovando a presença física do corretor',
        'Assinatura do cliente na tela com validade do Art. 726 do Código Civil',
        'Envio do roteiro estilizado com fotos direto no WhatsApp do cliente'
      ],
      highlightMetric: 'Art. 726',
      highlightLabel: 'garantia total de recebimento dos honorários de corretagem',
      active: true
    }
  ],
  testimonials: [
    {
      id: 'test_1',
      authorName: 'Eduardo Guimarães',
      authorRole: 'Diretor Comercial',
      companyName: 'Nova Aliança Imóveis',
      city: 'São Paulo - SP',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
      quote: 'Antes do Acert Imob, nossos corretores demoravam até 40 minutos para dar o primeiro oi para um lead do ZAP. Com a roleta anti-vácuo de 30 segundos e o WhatsApp oficial, nossa taxa de conversão triplicou no primeiro trimestre!',
      rating: 5,
      metricHighlight: '+310% em Vendas',
      metricLabel: 'crescimento em 6 meses de uso',
      active: true
    },
    {
      id: 'test_2',
      authorName: 'Patrícia Mendonça',
      authorRole: 'CEO e Fundadora',
      companyName: 'Mendonça & Prime Properties',
      city: 'Curitiba - PR',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      quote: 'O módulo de splits bancários com Conta Pronta e Asaas salvou o nosso departamento financeiro. O dinheiro cai, divide a comissão dos corretores e faz o repasse do proprietário no mesmo segundo. O plano de R$ 699 se pagou no primeiro dia.',
      rating: 5,
      metricHighlight: '40h economizadas/mês',
      metricLabel: 'no fechamento de comissões e repasses',
      active: true
    },
    {
      id: 'test_3',
      authorName: 'Rodrigo Siqueira',
      authorRole: 'Gerente Geral de Vendas',
      companyName: 'Vanguard Lançamentos',
      city: 'Belo Horizonte - MG',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
      quote: 'O roteiro de visitas com GPS e assinatura na tela do cliente acabou de vez com os conflitos de intermediação. A equipe adora, o cliente se sente em uma imobiliária de alto padrão e a diretoria tem controle absoluto da esteira.',
      rating: 5,
      metricHighlight: 'Zero disputas',
      metricLabel: 'de honorários com comprovação digital',
      active: true
    }
  ],
  faqs: [
    {
      id: 'faq_1',
      question: 'Como funciona o teste grátis de 14 dias?',
      answer: 'Você se cadastra em menos de 2 minutos, escolhe o seu plano (a partir de R$ 399,99) e sua imobiliária é ativada imediatamente com todos os recursos liberados. Não exigimos cartão de crédito antecipado para iniciar o teste.',
      category: 'PLANOS',
      active: true
    },
    {
      id: 'faq_2',
      question: 'Consigo migrar os imóveis e clientes do meu CRM antigo?',
      answer: 'Sim! Nossa equipe faz a migração gratuita e completa de imóveis, proprietários, leads e históricos do seu sistema antigo ou planilhas em até 48 horas.',
      category: 'MIGRACAO',
      active: true
    },
    {
      id: 'faq_3',
      question: 'Por que a gestão de leads é considerada a melhor do mercado?',
      answer: 'Porque desenvolvemos a única roleta com SLA de anti-vácuo em segundos: se o corretor não responder no tempo estipulado, o lead é redistribuído na hora. Além disso, temos integração nativa com Meta Ads, Google e todos os portais, tudo sincronizado no WhatsApp oficial.',
      category: 'LEADS',
      active: true
    },
    {
      id: 'faq_4',
      question: 'Quais bancos e gateways funcionam com o Split de comissões e aluguéis?',
      answer: 'Contamos com 10 APIs homologadas: Conta Pronta, Mercado Pago, Pagar.me, Asaas, PagSeguro/PagBank, PJBank, Iugu, Banco Cora, Banco Inter e Celcoin. O dinheiro é liquidado com divisão automática sem risco de bitributação.',
      category: 'ERP_SPLITS',
      active: true
    },
    {
      id: 'faq_5',
      question: 'Existe contrato de fidelidade ou multa rescisória?',
      answer: 'Não! Nossos planos mensais não possuem qualquer tipo de fidelidade ou carência. Você pode cancelar ou alterar seu plano a qualquer momento diretamente pelo seu painel sem burocracia.',
      category: 'PLANOS',
      active: true
    },
    {
      id: 'faq_6',
      question: 'Minha equipe precisa de treinamento para usar o sistema?',
      answer: 'O sistema é extremamente intuitivo, feito para que corretores e gerentes aprendam a usar no primeiro dia. Além disso, disponibilizamos a Acert Academy com videoaulas passo a passo e suporte humano em tempo real.',
      category: 'GERAL',
      active: true
    }
  ],
  leads: [
    {
      id: 'lead_reg_101',
      fullName: 'Carlos Alberto Moreira',
      email: 'carlos@moreiraprime.com.br',
      phone: '(11) 98721-4321',
      agencyName: 'Moreira Prime Imóveis',
      city: 'Campinas - SP',
      brokersCount: '8 a 15 corretores',
      planId: 'plan_pro_699',
      planName: 'Performance Pro (R$ 699,99)',
      subdomain: 'moreiraprime',
      createdAt: '2026-09-27 09:15',
      status: 'NOVO',
      notes: 'Interessado na roleta de leads e no WhatsApp integrado para 12 corretores.'
    },
    {
      id: 'lead_reg_102',
      fullName: 'Mariana Duarte Prado',
      email: 'mariana@duarteimoveis.com.br',
      phone: '(21) 99654-1122',
      agencyName: 'Duarte Gestão Imobiliária',
      city: 'Niterói - RJ',
      brokersCount: '3 a 5 corretores',
      planId: 'plan_starter_399',
      planName: 'Start Imob (R$ 399,99)',
      subdomain: 'duartegestao',
      createdAt: '2026-09-27 08:30',
      status: 'EM_CONTATO',
      notes: 'Imobiliária nova querendo sair de planilhas. Já enviamos apresentação no WhatsApp.'
    },
    {
      id: 'lead_reg_103',
      fullName: 'Fernando Albuquerque',
      email: 'fernando@vanguardrealty.com.br',
      phone: '(31) 98432-8877',
      agencyName: 'Vanguard Realty Brasil',
      city: 'Belo Horizonte - MG',
      brokersCount: 'Mais de 30 corretores',
      planId: 'plan_enterprise_1299',
      planName: 'Enterprise & Redes (R$ 1.299,99)',
      subdomain: 'vanguardrealty',
      createdAt: '2026-09-26 17:40',
      status: 'DEMO_AGENDADA',
      notes: 'Demonstração marcada para segunda 14h com Diretor de TI e Diretor Comercial.'
    },
    {
      id: 'lead_reg_104',
      fullName: 'Juliana Costa e Silva',
      email: 'juliana@costaimobiliaria.com.br',
      phone: '(41) 99123-5544',
      agencyName: 'Costa & Associados',
      city: 'Curitiba - PR',
      brokersCount: '8 a 15 corretores',
      planId: 'plan_pro_699',
      planName: 'Performance Pro (R$ 699,99)',
      subdomain: 'costaassociados',
      createdAt: '2026-09-26 14:10',
      status: 'CONVERTIDO',
      notes: 'Tenant criado com sucesso no Super Admin! Assinatura ativada.'
    }
  ]
};

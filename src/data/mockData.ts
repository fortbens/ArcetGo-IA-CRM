import { 
  UserProfile, 
  Lead, 
  RoletaQueue, 
  ChatMessage, 
  Development, 
  RentalContract, 
  CommissionDeal, 
  PropertyInspection, 
  PropertyKeyRecord, 
  CreditProposalCCA, 
  FleetVehicle, 
  CompanyAsset, 
  ReferralLead, 
  LMSCourse, 
  BrandEquityConfig,
  Owner,
  RealEstateProperty
} from '../types/crm';

export const CURRENT_USER_PROFILES: UserProfile[] = [
  {
    id: 'usr_super_admin',
    name: 'Emerson Carneiro dos Santos',
    email: 'diretorcarneiro@gmail.com',
    phone: '(11) 99864-2424',
    role: 'SUPER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creci: 'SaaS Master Key',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'Plataforma Global AcertGo SaaS',
    active: true,
    scorePoints: 1200,
  },
  {
    id: 'usr_diretor',
    name: 'Emerson Carneiro dos Santos',
    email: 'diretorcarneiro@acertgo.com.br',
    phone: '(11) 99864-2424',
    role: 'MASTER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creci: '128490-F / SP',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Imóveis (Matriz Jardins)',
    active: true,
    scorePoints: 940,
  },
  {
    id: 'usr_gerente',
    name: 'Camila Albuquerque',
    email: 'camila.gerente@acertgo.com.br',
    phone: '(11) 98765-4321',
    role: 'MANAGER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creci: '154320-F / SP',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Imóveis (Matriz Jardins)',
    active: true,
    scorePoints: 780,
  },
  {
    id: 'usr_corretor_juliana',
    name: 'Juliana Mendes',
    email: 'juliana.mendes@acertgo.com.br',
    phone: '(11) 97777-2005',
    role: 'BROKER',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    creci: '210984-F / SP',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Imóveis (Matriz Jardins)',
    active: true,
    scorePoints: 520,
  },
  {
    id: 'usr_corretor_roberto',
    name: 'Roberto Silveira',
    email: 'roberto.silveira@acertgo.com.br',
    phone: '(11) 97777-2008',
    role: 'BROKER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creci: '198765-F / SP',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Imóveis (Matriz Jardins)',
    active: true,
    scorePoints: 460,
  },
  {
    id: 'usr_financeiro',
    name: 'Vanessa Nogueira',
    email: 'financeiro@acertgo.com.br',
    phone: '(11) 96543-2198',
    role: 'FINANCIAL_OPERATOR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    creci: 'CRA 84920',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'AcertGo Imóveis (Matriz Jardins)',
    active: true,
    scorePoints: 310,
  },
  {
    id: 'usr_parceiro_externo',
    name: 'Marcio Fontes (Imob Parceira)',
    email: 'marcio@fontesimoveis.com.br',
    phone: '(11) 95555-4321',
    role: 'EXTERNAL_PARTNER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creci: '89421-J / SP',
    tenantId: 'tenant_matriz_sp',
    tenantName: 'Fontes & Associados (Parceiro)',
    active: true,
    scorePoints: 190,
  }
];

export const INITIAL_ROLETA_QUEUES: RoletaQueue[] = [
  {
    id: 'queue_terca',
    name: 'Terça',
    description: 'Fila prioritária para captações do dia e leads quentes dos portais',
    active: true,
    strategy: 'ALEATORIO',
    mode: 'Manual',
    scope: 'Todos',
    totalDistributedCount: 14,
    members: [
      {
        userId: 'usr_corretor_juliana',
        name: 'Juliana',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        color: '#2563EB', // Blue
        active: true,
        weight: 1,
        assignedTodayCount: 5,
        lastAssignedAt: '10:14',
      },
      {
        userId: 'usr_corretor_fernanda',
        name: 'Fernanda',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        color: '#F59E0B', // Amber
        active: true,
        weight: 1,
        assignedTodayCount: 4,
        lastAssignedAt: '09:40',
      },
      {
        userId: 'usr_corretor_roberto',
        name: 'Roberto',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        color: '#10B981', // Green
        active: true,
        weight: 1,
        assignedTodayCount: 5,
        lastAssignedAt: '10:48',
      }
    ],
    history: [
      { id: 'h1', leadName: 'Elisangela da Cruz', leadPhone: '119867547242', assignedToBrokerName: 'Roberto', timestamp: 'Hoje às 10:48' },
      { id: 'h2', leadName: 'Emerson Carneiro dos Santos', leadPhone: '(11) 99864-2424', assignedToBrokerName: 'Juliana', timestamp: 'Hoje às 10:14' },
      { id: 'h3', leadName: 'Ricardo Faria', leadPhone: '(11) 97777-2004', assignedToBrokerName: 'Fernanda', timestamp: 'Hoje às 09:40' }
    ]
  },
  {
    id: 'queue_quinta',
    name: 'QUinta',
    description: 'Plantão digital de Lançamentos e campanhas de Meta Ads',
    active: true,
    strategy: 'ALEATORIO',
    mode: 'Manual',
    scope: 'Lançamentos',
    totalDistributedCount: 22,
    members: [
      { userId: 'u1', name: 'Juliana', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', color: '#2563EB', active: true, weight: 1, assignedTodayCount: 4 },
      { userId: 'u2', name: 'Roberto', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', color: '#10B981', active: true, weight: 1, assignedTodayCount: 4 },
      { userId: 'u3', name: 'Fernanda', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', color: '#F59E0B', active: true, weight: 1, assignedTodayCount: 5 },
      { userId: 'u4', name: 'Thiago Costa', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', color: '#8B5CF6', active: true, weight: 1, assignedTodayCount: 5 },
      { userId: 'u5', name: 'Beatriz Lima', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', color: '#EC4899', active: true, weight: 1, assignedTodayCount: 4 }
    ],
    history: []
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_novo_sla_1',
    name: 'Carolina Bittencourt',
    phone: '(11) 98112-9988',
    email: 'carolina.bittencourt@invest.com.br',
    source: 'PORTAL_ZAP',
    stage: 'NOVO_LEAD',
    assignedBrokerId: 'usr_corretor_juliana',
    assignedBrokerName: 'Juliana Mendes',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    interestType: 'COMPRA',
    propertyOfInterestTitle: 'Apartamento Duplex Jardins (180m²)',
    budgetMin: 1900000,
    budgetMax: 2500000,
    tags: ['Novo Lead', 'Alerta SLA', 'Alto Padrão'],
    unreadMessagesCount: 1,
    lastMessageText: 'Olá, gostaria de saber se este duplex aceita permuta e se tem vaga para visitante.',
    lastMessageTime: 'Há 45 min',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    rating: 4,
    timeline: [
      { id: 'tl_novo_1', leadId: 'lead_novo_sla_1', type: 'STATUS_CHANGE', title: 'Lead Ingressou no Sistema', description: 'Lead captado via Portal ZAP e aguardando primeiro contato.', authorName: 'Portal ZAP', authorRole: 'Integração', timestamp: 'Há 45 min' }
    ],
    followUps: []
  },
  {
    id: 'lead_novo_sla_2',
    name: 'Lucas Nogueira',
    phone: '(11) 97455-1234',
    email: 'lucas.nogueira@techcorp.com.br',
    source: 'SITE_OFICIAL',
    stage: 'NOVO_LEAD',
    assignedBrokerId: 'usr_corretor_roberto',
    assignedBrokerName: 'Roberto Silveira',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    interestType: 'LANCAMENTO',
    propertyOfInterestTitle: 'Studio Smart Faria Lima',
    budgetMin: 650000,
    budgetMax: 850000,
    tags: ['Site Próprio', 'Investidor'],
    unreadMessagesCount: 1,
    lastMessageText: 'Qual a previsão de entrega e tabela de fluxo do Studio?',
    lastMessageTime: 'Há 12 min',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    rating: 3,
    timeline: [
      { id: 'tl_novo_2', leadId: 'lead_novo_sla_2', type: 'STATUS_CHANGE', title: 'Lead Ingressou via Site Oficial', description: 'Formulário de captação preenchido no site do corretor.', authorName: 'Site Oficial', authorRole: 'Integração', timestamp: 'Há 12 min' }
    ],
    followUps: []
  },
  {
    id: 'lead_1',
    name: 'Elisangela da Cruz',
    phone: '119867547242',
    email: 'elisangela.cruz@gmail.com',
    source: 'PORTAL_ZAP',
    stage: 'FECHAMENTO_GANHO',
    assignedBrokerId: 'usr_corretor_roberto',
    assignedBrokerName: 'Roberto Silveira',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    interestType: 'COMPRA',
    propertyOfInterestTitle: 'Apartamento Jardim Paulistano (210m²)',
    budgetMin: 2200000,
    budgetMax: 2800000,
    tags: ['Família', 'Alto Padrão', 'Aceita Financiamento'],
    unreadMessagesCount: 0,
    lastMessageText: 'Escritura pública assinada no 14º Cartório de Notas!',
    lastMessageTime: '10:48',
    createdAt: '2026-09-18T10:00:00Z',
    rating: 5,
    timeline: [
      { id: 'tl1', leadId: 'lead_1', type: 'STATUS_CHANGE', title: 'Negócio Fechado & Ganho 🎉', description: 'VGV: R$ 2.450.000. Comissão total liquidada: R$ 147.000.', authorName: 'Roberto Silveira', authorRole: 'Corretor', timestamp: 'Hoje às 10:48' },
      { id: 'tl2', leadId: 'lead_1', type: 'PROPOSAL', title: 'Proposta Aceita', description: 'Proposta de R$ 2.450.000 aprovada pelo proprietário sem ressalvas.', authorName: 'Roberto Silveira', authorRole: 'Corretor', timestamp: 'Ontem às 16:20' },
      { id: 'tl3', leadId: 'lead_1', type: 'VISIT', title: 'Visita Realizada', description: 'Cliente adorou a varanda integrada e as 3 vagas privativas.', authorName: 'Roberto Silveira', authorRole: 'Corretor', timestamp: '22/09 às 11:00' }
    ],
    followUps: [
      {
        id: 'fu_1',
        leadId: 'lead_1',
        title: 'Pós-Venda: Entrega de Chaves & Boas-Vindas',
        channel: 'VISITA',
        scheduledAt: '2026-09-24T10:00:00',
        timeStr: '10:00',
        status: 'CONCLUIDO',
        priority: 'ALTA',
        notes: 'Entregar kit de boas-vindas da AcertGo com champanhe e controle de acesso da garagem.',
        outcomeNotes: 'Cliente extremamente satisfeita. Elogiou pontualidade da equipe e indicou o irmão.',
        completedAt: '2026-09-24T10:45:00',
        assignedBrokerName: 'Roberto Silveira',
        createdAt: '2026-09-23T14:00:00'
      }
    ],
    aiScoring: {
      score: 98,
      temperature: 'HOT',
      probabilityPercent: 98,
      classification: 'ALTA_PROPENSAO',
      summary: 'Negócio formalmente concluído. A timeline reflete fluxo exemplar com visita presencial, aceite imediato de proposta e assinatura de escritura pública.',
      keyStrengths: [
        'Escritura lavrada em cartório com liquidação de split',
        'Visita presencial sem ressalvas ou fricções',
        'Feedback pós-venda nota máxima com indicação de novos clientes'
      ],
      riskFactors: [
        'Nenhum risco de reversão identificado nesta transação'
      ],
      nextBestAction: 'Coletar depoimento em vídeo da cliente para fortalecimento do Brand Equity.',
      suggestedScript: 'Olá Elisangela! Foi uma imensa honra assessorá-la na conquista do seu apartamento no Jardim Paulistano. Desejo muitas felicidades no novo lar!',
      analyzedAt: '2026-09-24T10:48:00Z',
      timelineInteractionsAnalyzed: 3
    }
  },
  {
    id: 'lead_2',
    name: 'Emerson Carneiro dos Santos',
    phone: '(11) 99864-2424',
    email: 'emerson.carneiro@acertgo.com.br',
    source: 'WHATSAPP_DIRETO',
    stage: 'FECHAMENTO_GANHO',
    assignedBrokerId: 'usr_corretor_juliana',
    assignedBrokerName: 'Juliana Mendes',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    interestType: 'LANCAMENTO',
    propertyOfInterestTitle: 'Residencial Jardins One - Unidade 1204',
    budgetMin: 1800000,
    budgetMax: 2400000,
    tags: ['Investidor', 'Lançamento', 'Cash Buyer'],
    unreadMessagesCount: 0,
    lastMessageText: 'Comprovante do sinal de entrada enviado. Parabéns pela assessoria!',
    lastMessageTime: '10:14',
    createdAt: '2026-09-19T14:30:00Z',
    rating: 5,
    timeline: [
      { id: 'tl4', leadId: 'lead_2', type: 'STATUS_CHANGE', title: 'Contrato de Compra e Venda Assinado', description: 'Assinatura eletrônica via DocuSign finalizada por ambas as partes.', authorName: 'Camila Albuquerque', authorRole: 'Gerente', timestamp: 'Hoje às 10:14' },
      { id: 'tl5', leadId: 'lead_2', type: 'WHISPER_NOTE', title: 'Orientação de Gerência (Modo Fantasma)', description: 'Cliente tem urgência em garantir a vaga extra. Autorizado bônus na personalização da planta.', authorName: 'Camila Albuquerque', authorRole: 'Gerente', timestamp: 'Ontem às 15:10', isPrivateWhisper: true }
    ],
    followUps: [
      {
        id: 'fu_2',
        leadId: 'lead_2',
        title: 'Enviar protocolo de registro da incorporação',
        channel: 'WHATSAPP',
        scheduledAt: '2026-09-24T11:00:00',
        timeStr: '11:00',
        status: 'CONCLUIDO',
        priority: 'MEDIA',
        outcomeNotes: 'Protocolo e comprovante de TED enviados pelo WhatsApp.',
        completedAt: '2026-09-24T11:15:00',
        assignedBrokerName: 'Juliana Mendes',
        createdAt: '2026-09-23T16:00:00'
      }
    ]
  },
  {
    id: 'lead_3',
    name: 'Ricardo Faria',
    phone: '(11) 97777-2004',
    email: 'ricardo.faria@engenhariasp.com.br',
    source: 'PASSAGEM_STAND',
    stage: 'FECHAMENTO_GANHO',
    assignedBrokerId: 'usr_corretor_fernanda',
    assignedBrokerName: 'Fernanda Castro',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    interestType: 'COMPRA',
    propertyOfInterestTitle: 'Cobertura Duplex Pinheiros',
    budgetMin: 3500000,
    budgetMax: 4200000,
    tags: ['QR Code Placa', 'Cobertura', 'Engenheiro'],
    unreadMessagesCount: 0,
    lastMessageText: 'Perfeito, aguardo a chave no imóvel amanhã.',
    lastMessageTime: '09:40',
    createdAt: '2026-09-20T08:00:00Z',
    rating: 5,
    timeline: [
      { id: 'tl6', leadId: 'lead_3', type: 'STATUS_CHANGE', title: 'Venda Concluída', description: 'Pagamento à vista com DRE e split provisionados.', authorName: 'Fernanda Castro', authorRole: 'Corretora', timestamp: 'Hoje às 09:40' }
    ],
    followUps: []
  },
  {
    id: 'lead_4',
    name: 'Eduardo Martins',
    phone: '(11) 97777-2008',
    email: 'eduardo.martins@outlook.com',
    source: 'PORTAL_VIVAREAL',
    stage: 'PRIMEIRO_CONTATO',
    assignedBrokerId: 'usr_corretor_roberto',
    assignedBrokerName: 'Roberto Silveira',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    interestType: 'COMPRA',
    propertyOfInterestTitle: 'Apartamento 3 Dormitórios Itaim Bibi',
    budgetMin: 1400000,
    budgetMax: 1800000,
    tags: ['Troca de Imóvel', 'Portais'],
    unreadMessagesCount: 2,
    lastMessageText: 'Gostaria de saber se o condomínio aceita pet de grande porte e o valor do IPTU mensal.',
    lastMessageTime: '08:52',
    createdAt: '2026-09-24T08:15:00Z',
    rating: 4,
    timeline: [
      { id: 'tl7', leadId: 'lead_4', type: 'WHATSAPP_MSG', title: 'Lead ingressou via VivaReal', description: 'Distribuído automaticamente pela Roleta Terça para Roberto Silveira.', authorName: 'AcertGo Roleta', authorRole: 'Sistema', timestamp: 'Hoje às 08:15' }
    ],
    followUps: [
      {
        id: 'fu_3',
        leadId: 'lead_4',
        title: 'Ligar para esclarecer regras de pet e confirmar visita no Itaim Bibi',
        channel: 'LIGACAO',
        scheduledAt: '2026-09-24T14:30:00',
        timeStr: '14:30',
        status: 'PENDENTE',
        priority: 'ALTA',
        notes: 'Regimento do condomínio autoriza pet até 25kg. Explicar e agendar visita para sábado às 10h.',
        assignedBrokerName: 'Roberto Silveira',
        createdAt: '2026-09-24T08:30:00'
      }
    ],
    aiScoring: {
      score: 48,
      temperature: 'WARM',
      probabilityPercent: 45,
      classification: 'MEDIA_PROPENSAO',
      summary: 'Lead em primeiro contato com dúvidas sobre aceitação de pet no condomínio. Apresenta interesse genuíno no Itaim Bibi, mas necessita de esclarecimento ágil para destravar o agendamento de visita.',
      keyStrengths: [
        'Interesse pontual em unidade específica (Apartamento 3 Dorms Itaim Bibi)',
        'Ticket de até R$ 1,8M compatível com a tipologia',
        'Canal WhatsApp ativo com resposta rápida'
      ],
      riskFactors: [
        '2 mensagens aguardando retorno do corretor',
        'Objeção pontual sobre regimento interno de animais de estimação'
      ],
      nextBestAction: 'Ligar para confirmar regra do condomínio (pet até 25kg autorizado) e agendar visita presencial para sábado.',
      suggestedScript: 'Olá Eduardo! Tudo bem? Verifiquei a convenção do condomínio no Itaim Bibi e pets de porte médio/grande são muito bem-vindos. Podemos agendar para você conhecer o apartamento neste sábado às 10h?',
      analyzedAt: '2026-09-24T08:55:00Z',
      timelineInteractionsAnalyzed: 1
    }
  },
  {
    id: 'lead_5',
    name: 'Beatriz Nunes',
    phone: '(11) 97777-2005',
    email: 'beatriz.nunes@advocaciapaulista.com.br',
    source: 'INDICOU_GANHOU',
    stage: 'PRIMEIRO_CONTATO',
    assignedBrokerId: 'usr_corretor_juliana',
    assignedBrokerName: 'Juliana Mendes',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    interestType: 'LOCACAO',
    propertyOfInterestTitle: 'Studio Mobiliado Vila Madalena',
    budgetMin: 4000,
    budgetMax: 6500,
    tags: ['Indicação Premiada', 'Locação Ágil'],
    unreadMessagesCount: 1,
    lastMessageText: 'Fui indicada pelo Dr. Carneiro. Preciso me mudar em até 15 dias.',
    lastMessageTime: '08:40',
    createdAt: '2026-09-24T08:30:00Z',
    rating: 4,
    timeline: [
      { id: 'tl8', leadId: 'lead_5', type: 'WHATSAPP_MSG', title: 'Indicação recebida pelo portal', description: 'Porteiro Sr. Sebastião indicou este lead (Bounty de R$ 1.200 provisionado).', authorName: 'Indicou Ganhou', authorRole: 'Sistema', timestamp: 'Hoje às 08:30' }
    ],
    followUps: [
      {
        id: 'fu_4',
        leadId: 'lead_5',
        title: 'Enviar fotos de 3 Studios na Vila Madalena com entrada imediata',
        channel: 'WHATSAPP',
        scheduledAt: '2026-09-24T16:00:00',
        timeStr: '16:00',
        status: 'PENDENTE',
        priority: 'ALTA',
        notes: 'Cliente precisa mudar rápido. Apresentar opções com seguro fiança aprovado em 15 minutos.',
        assignedBrokerName: 'Juliana Mendes',
        createdAt: '2026-09-24T08:45:00'
      }
    ],
    aiScoring: {
      score: 72,
      temperature: 'WARM',
      probabilityPercent: 70,
      classification: 'MEDIA_PROPENSAO',
      summary: 'Altíssima urgência de mudança (prazo de 15 dias) e origem por indicação qualificada. Potencial imediato de fechamento em locação com garantia ágil de seguro-fiança.',
      keyStrengths: [
        'Urgência expressa de mudança imediata',
        'Lead quente de indicação qualificada do Dr. Carneiro',
        'Orçamento compatível com studios de alto padrão na Vila Madalena'
      ],
      riskFactors: [
        'Sensibilidade a velocidade de resposta: se demorar, fechará com outra imobiliária'
      ],
      nextBestAction: 'Enviar seleção de 3 studios mobiliados prontos para ocupação e aprovação cadastral instantânea.',
      suggestedScript: 'Olá Dra. Beatriz! Tudo bem? O Dr. Carneiro me pediu atenção especial para seu caso. Já selecionei 3 studios perfeitos e mobiliados na Vila Madalena com aprovação em 15 min. Posso te enviar as fotos agora?',
      analyzedAt: '2026-09-24T08:50:00Z',
      timelineInteractionsAnalyzed: 1
    }
  },
  {
    id: 'lead_6',
    name: 'Gustavo Henrique Vasconcelos',
    phone: '(11) 99123-4567',
    email: 'gh.vasconcelos@tech.io',
    source: 'VISITA_IMOBILIARIA',
    stage: 'VISITA_AGENDADA',
    assignedBrokerId: 'usr_corretor_juliana',
    assignedBrokerName: 'Juliana Mendes',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    interestType: 'LANCAMENTO',
    propertyOfInterestTitle: 'Residencial Jardins One - Torre Horizon',
    budgetMin: 2000000,
    budgetMax: 3000000,
    tags: ['Tech Founder', 'Agendado Quinta 15h'],
    unreadMessagesCount: 0,
    lastMessageText: 'Confirmado! Estarei no estande às 15h com minha esposa.',
    lastMessageTime: 'Ontem',
    createdAt: '2026-09-22T11:00:00Z',
    rating: 5,
    timeline: [
      { id: 'tl9', leadId: 'lead_6', type: 'VISIT', title: 'Visita Agendada com Alerta no Calendário', description: 'Agendado para Quinta-feira às 15:00 no Decorado Torre Horizon.', authorName: 'Juliana Mendes', authorRole: 'Corretora', timestamp: 'Ontem às 14:00' }
    ],
    followUps: [
      {
        id: 'fu_5',
        leadId: 'lead_6',
        title: 'Confirmar horário da visita e preparar maquete 3D com cafezinho',
        channel: 'WHATSAPP',
        scheduledAt: '2026-09-25T11:00:00',
        timeStr: '11:00',
        status: 'PENDENTE',
        priority: 'MEDIA',
        notes: 'Enviar lembrete de endereço e localização com rota no WhatsApp.',
        assignedBrokerName: 'Juliana Mendes',
        createdAt: '2026-09-23T10:00:00'
      }
    ],
    aiScoring: {
      score: 87,
      temperature: 'HOT',
      probabilityPercent: 85,
      classification: 'ALTA_PROPENSAO',
      summary: 'Lead de alto valor com visita presencial confirmada no estande e presença de ambos os decisores (esposa). Alta afinidade com tipologia de lançamento.',
      keyStrengths: [
        'Visita presencial confirmada com ambos os cônjuges presentes',
        'Ticket de até R$ 3.000.000 (Tech Founder)',
        'Engajamento ativo e resposta pontual no WhatsApp'
      ],
      riskFactors: [
        'Atenção ao preparo da recepção no decorado para assegurar encantamento na primeira impressão'
      ],
      nextBestAction: 'Enviar localização com rota Waze/Google Maps e reservar sala privativa com maquete para apresentação.',
      suggestedScript: 'Olá Gustavo! Tudo pronto para receber você e sua esposa amanhã às 15h no decorado da Torre Horizon. Já reservei a vaga no estacionamento com manobrista para vocês!',
      analyzedAt: '2026-09-24T09:10:00Z',
      timelineInteractionsAnalyzed: 1
    }
  },
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  lead_4: [
    {
      id: 'm1',
      leadId: 'lead_4',
      sender: 'SYSTEM',
      senderName: 'AcertGo Bot',
      text: 'Lead recebido via Portal VivaReal (Anúncio ZP-8941). Distribuído na Roleta para Roberto Silveira.',
      timestamp: '08:15',
      status: 'READ',
      type: 'TEXT',
    },
    {
      id: 'm2',
      leadId: 'lead_4',
      sender: 'LEAD',
      senderName: 'Eduardo Martins',
      text: 'Olá Roberto! Vi este apartamento no Itaim Bibi com 3 quartos e achei lindo.',
      timestamp: '08:16',
      status: 'READ',
      type: 'TEXT',
    },
    {
      id: 'm3',
      leadId: 'lead_4',
      sender: 'LEAD',
      senderName: 'Eduardo Martins',
      text: 'Gostaria de saber se o condomínio aceita pet de grande porte e o valor do IPTU mensal.',
      timestamp: '08:52',
      status: 'DELIVERED',
      type: 'TEXT',
    },
    {
      id: 'm_whisper_1',
      leadId: 'lead_4',
      sender: 'MANAGER',
      senderName: 'Camila (Gerente de Vendas)',
      text: '[NOTA SECRETA DO SUPERVISOR]: Roberto, esse condomínio aceita pets grandes sim! Além disso, a proprietária aceita carro na negociação até 80k. Mencione a visita ainda hoje!',
      timestamp: '08:54',
      status: 'READ',
      type: 'WHISPER',
      isWhisperNote: true,
    }
  ],
  lead_2: [
    {
      id: 'm2_1',
      leadId: 'lead_2',
      sender: 'LEAD',
      senderName: 'Emerson Carneiro dos Santos',
      text: 'Juliana, revisei a minuta do contrato da unidade 1204 do Jardins One. O split do pagamento ficou super claro.',
      timestamp: '09:50',
      status: 'READ',
      type: 'TEXT',
    },
    {
      id: 'm2_2',
      leadId: 'lead_2',
      sender: 'BROKER',
      senderName: 'Juliana Mendes',
      text: 'Excelente Emerson! Nosso motor financeiro já emitiu o Pix seguro da entrada. Segue o comprovante com validação jurídica.',
      timestamp: '10:02',
      status: 'READ',
      type: 'TEXT',
    },
    {
      id: 'm2_3',
      leadId: 'lead_2',
      sender: 'LEAD',
      senderName: 'Emerson Carneiro dos Santos',
      text: 'Comprovante do sinal de entrada enviado. Parabéns pela assessoria!',
      timestamp: '10:14',
      status: 'READ',
      type: 'TEXT',
    }
  ]
};

export const INITIAL_DEVELOPMENT: Development = {
  id: 'dev_jardins_one',
  title: 'Residencial Jardins One & Sky Lounge',
  builderName: 'Cyrela & AcertGo Empreendimentos',
  neighborhood: 'Jardins / Cerqueira César',
  city: 'São Paulo - SP',
  deliveryDate: 'Dezembro / 2027',
  totalUnits: 48,
  availableUnits: 22,
  reservedUnits: 8,
  soldUnits: 18,
  towers: ['Torre Alpha (Park View)', 'Torre Horizon (Sky)'],
  bannerUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
  brochureUrl: 'https://acertgo.com.br/books/jardins_one_book_oficial.pdf',
  units: [
    // Torre Alpha - Andar 15 (Penthouses)
    { id: 'u_1501', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 15, unitNumber: '1501', typology: 'Penthouse Duplex 4 Suítes', privateAreaM2: 320, parkingSpaces: 4, sunOrientation: 'MANHA', price: 4850000, condoFee: 3200, iptuFee: 1100, status: 'VENDIDO' },
    { id: 'u_1502', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 15, unitNumber: '1502', typology: 'Penthouse Duplex 4 Suítes', privateAreaM2: 320, parkingSpaces: 4, sunOrientation: 'TARDE', price: 4790000, condoFee: 3200, iptuFee: 1100, status: 'RESERVADO', reservedByBrokerName: 'Roberto Silveira', reservedClientName: 'Dr. Fernando Prado', reservationExpiresAt: '23h 40m restantes' },
    
    // Torre Alpha - Andar 14
    { id: 'u_1401', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 14, unitNumber: '1401', typology: '3 Suítes Master', privateAreaM2: 185, parkingSpaces: 3, sunOrientation: 'MANHA', price: 2950000, condoFee: 1900, iptuFee: 650, status: 'DISPONIVEL' },
    { id: 'u_1402', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 14, unitNumber: '1402', typology: '3 Suítes Master', privateAreaM2: 185, parkingSpaces: 3, sunOrientation: 'TARDE', price: 2890000, condoFee: 1900, iptuFee: 650, status: 'DISPONIVEL' },

    // Torre Alpha - Andar 12
    { id: 'u_1201', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 12, unitNumber: '1201', typology: '3 Suítes Master', privateAreaM2: 185, parkingSpaces: 3, sunOrientation: 'MANHA', price: 2850000, condoFee: 1900, iptuFee: 650, status: 'VENDIDO' },
    { id: 'u_1202', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 12, unitNumber: '1202', typology: '3 Suítes Master', privateAreaM2: 185, parkingSpaces: 3, sunOrientation: 'TARDE', price: 2790000, condoFee: 1900, iptuFee: 650, status: 'RESERVADO', reservedByBrokerName: 'Juliana Mendes', reservedClientName: 'Emerson Carneiro', reservationExpiresAt: '04h 15m restantes' },

    // Torre Alpha - Andar 10
    { id: 'u_1001', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 10, unitNumber: '1001', typology: '3 Dorms (2 Suítes)', privateAreaM2: 142, parkingSpaces: 2, sunOrientation: 'MANHA', price: 2190000, condoFee: 1400, iptuFee: 490, status: 'DISPONIVEL' },
    { id: 'u_1002', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 10, unitNumber: '1002', typology: '3 Dorms (2 Suítes)', privateAreaM2: 142, parkingSpaces: 2, sunOrientation: 'TARDE', price: 2150000, condoFee: 1400, iptuFee: 490, status: 'VENDIDO' },

    // Torre Alpha - Andar 8
    { id: 'u_801', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 8, unitNumber: '801', typology: '3 Dorms (2 Suítes)', privateAreaM2: 142, parkingSpaces: 2, sunOrientation: 'MANHA', price: 2090000, condoFee: 1400, iptuFee: 490, status: 'DISPONIVEL' },
    { id: 'u_802', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 8, unitNumber: '802', typology: '3 Dorms (2 Suítes)', privateAreaM2: 142, parkingSpaces: 2, sunOrientation: 'TARDE', price: 2050000, condoFee: 1400, iptuFee: 490, status: 'RESERVADO', reservedByBrokerName: 'Fernanda Castro', reservedClientName: 'Larissa Albuquerque', reservationExpiresAt: '18h 12m restantes' },

    // Torre Alpha - Andar 4
    { id: 'u_401', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 4, unitNumber: '401', typology: '2 Suítes Garden View', privateAreaM2: 105, parkingSpaces: 2, sunOrientation: 'MANHA', price: 1680000, condoFee: 1100, iptuFee: 390, status: 'DISPONIVEL' },
    { id: 'u_402', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 4, unitNumber: '402', typology: '2 Suítes Garden View', privateAreaM2: 105, parkingSpaces: 2, sunOrientation: 'TARDE', price: 1640000, condoFee: 1100, iptuFee: 390, status: 'VENDIDO' },

    // Torre Alpha - Andar 2
    { id: 'u_201', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 2, unitNumber: '201', typology: '2 Suítes Compact', privateAreaM2: 92, parkingSpaces: 1, sunOrientation: 'MANHA', price: 1490000, condoFee: 980, iptuFee: 310, status: 'DISPONIVEL' },
    { id: 'u_202', developmentId: 'dev_jardins_one', tower: 'Torre Alpha (Park View)', floor: 2, unitNumber: '202', typology: '2 Suítes Compact', privateAreaM2: 92, parkingSpaces: 1, sunOrientation: 'TARDE', price: 1450000, condoFee: 980, iptuFee: 310, status: 'DISPONIVEL' },
  ]
};

export const INITIAL_RENTAL_CONTRACTS: RentalContract[] = [
  {
    id: 'cnt_001',
    code: 'LOC-2026-904',
    propertyCode: 'AP-JARDINS-42',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    tenantName: 'Lucas Ferraz Medeiros',
    tenantCpf: '349.812.908-11',
    ownerName: 'Construções & Participações Silva Ltda',
    ownerPixKey: 'repasse.silva@bancobrasil.com.br',
    monthlyRent: 5500,
    condoFee: 1200,
    iptuFee: 410,
    guaranteeFee: 220, // Seguro Fiança CredPago
    adminFeePercentage: 10,
    guaranteeType: 'SEGURO_FIANCA',
    startDate: '2026-01-10',
    endDate: '2028-01-10',
    dueDay: 10,
    repasseDay: 15,
    adjustmentIndex: 'IPCA',
    signatureStatus: 'ASSINADO',
    status: 'ATIVO',
    beneficiaries: [
      {
        id: 'ben_silva_1',
        name: 'Dra. Helena Fontes da Silva',
        relationship: 'Viúva Meeira / Titular',
        cpfCnpj: '124.589.632-00',
        percent: 50,
        pixKeyType: 'CPF',
        pixKey: '124.589.632-00'
      },
      {
        id: 'ben_silva_2',
        name: 'Lucas Fontes da Silva',
        relationship: 'Filho / Herdeiro',
        cpfCnpj: '389.412.558-91',
        percent: 50,
        pixKeyType: 'EMAIL',
        pixKey: 'lucas.fontes@gmail.com'
      }
    ]
  },
  {
    id: 'cnt_002',
    code: 'LOC-2026-905',
    propertyCode: 'AP-PINHEIROS-18',
    propertyAddress: 'Rua dos Pinheiros, 890 - Ap 141, Pinheiros, SP',
    tenantName: 'Mariana Duarte Souza',
    tenantCpf: '412.765.340-90',
    ownerName: 'Dr. Renato Barcellos',
    ownerPixKey: 'renato.barcellos@gmail.com',
    monthlyRent: 4200,
    condoFee: 890,
    iptuFee: 280,
    guaranteeFee: 168,
    adminFeePercentage: 10,
    guaranteeType: 'SEGURO_FIANCA',
    startDate: '2026-02-01',
    endDate: '2028-02-01',
    dueDay: 5,
    repasseDay: 12,
    adjustmentIndex: 'IGP-M',
    signatureStatus: 'ASSINADO',
    status: 'ATIVO',
    beneficiaries: [
      {
        id: 'ben_renato',
        name: 'Dr. Renato Barcellos',
        relationship: 'Proprietário Titular',
        cpfCnpj: '098.765.432-11',
        percent: 100,
        pixKeyType: 'EMAIL',
        pixKey: 'renato.barcellos@gmail.com'
      }
    ]
  }
];

export const INITIAL_COMMISSIONS: CommissionDeal[] = [
  {
    id: 'com_1',
    code: 'VEN-2026-042',
    propertyTitle: 'Apartamento Jardim Paulistano (210m²)',
    salePrice: 2450000,
    totalCommissionPercent: 6,
    totalCommissionValue: 147000,
    calculationModel: 'PERCENTUAL_COMISSAO',
    calculationDetail: 'Comissão em Porcentual: 6.0% CRECI (Split 40/40/10/10%)',
    captadorName: 'Fernanda Castro',
    captadorPercent: 40,
    captadorValue: 58800, // 40% da comissão
    fechadorName: 'Roberto Silveira',
    fechadorPercent: 40,
    fechadorValue: 58800, // 40% da comissão
    gerenteName: 'Camila Albuquerque',
    gerentePercent: 10,
    gerenteValue: 14700,  // 10% da comissão
    imobiliariaPercent: 10,
    imobiliariaValue: 14700, // 10% da comissão
    status: 'RECEBIDO',
    closedAt: '2026-09-24',
    rpaDocumentId: 'RPA-2026-891',
    notes: 'Venda de imóvel avulso comissionada a 6% padrão CRECI.'
  },
  {
    id: 'com_2',
    code: 'LAN-2026-014',
    propertyTitle: 'Residencial Jardins One - Unidade 1204',
    salePrice: 2790000,
    totalCommissionPercent: 4,
    totalCommissionValue: 111600,
    calculationModel: 'SOBRE_VGV',
    calculationDetail: 'Sobre o VGV: Fechador 1.30%, Coord. 0.35%, Gerente 0.25%, Imob. 2.10%',
    captadorName: 'Marcos Vinicius (Coordenador)',
    captadorPercent: 0.35,
    captadorValue: 9765, // 0.35% s/ VGV
    fechadorName: 'Juliana Mendes',
    fechadorPercent: 1.30,
    fechadorValue: 36270, // 1.30% s/ VGV
    gerenteName: 'Camila Albuquerque',
    gerentePercent: 0.25,
    gerenteValue: 6975, // 0.25% s/ VGV
    coordenadorName: 'Marcos Vinicius',
    coordenadorPercent: 0.35,
    coordenadorValue: 9765,
    imobiliariaPercent: 2.10,
    imobiliariaValue: 58590, // 2.10% s/ VGV
    status: 'A_RECEBER_FUTURO',
    closedAt: '2026-09-22',
    notes: 'Lançamento com repasse direto da construtora sobre o VGV.'
  },
  {
    id: 'com_3',
    code: 'VEN-2026-039',
    propertyTitle: 'Cobertura Duplex Vila Mariana (180m²)',
    salePrice: 1850000,
    totalCommissionPercent: 6,
    totalCommissionValue: 111000,
    calculationModel: 'PERCENTUAL_COMISSAO',
    calculationDetail: 'Comissão em Porcentual: 6.0% (Split 35/35/10/20%)',
    captadorName: 'Carlos Mendes',
    captadorPercent: 35,
    captadorValue: 38850,
    fechadorName: 'Juliana Mendes',
    fechadorPercent: 35,
    fechadorValue: 38850,
    gerenteName: 'Roberto Valente',
    gerentePercent: 10,
    gerenteValue: 11100,
    imobiliariaPercent: 20,
    imobiliariaValue: 22200,
    status: 'PAGO_COM_RPA',
    closedAt: '2026-09-15',
    rpaDocumentId: 'RPA-2026-782',
    notes: 'Comissões liquidadas via PIX com RPAs homologados.'
  }
];

export const INITIAL_INSPECTIONS: PropertyInspection[] = [
  {
    id: 'insp_1',
    propertyCode: 'AP-JARDINS-42',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82',
    type: 'ENTRADA',
    inspectorName: 'Carlos Eduardo (Vistoriador Certificado)',
    clientName: 'Lucas Ferraz Medeiros',
    date: '2026-01-08',
    status: 'CONCLUIDA',
    offlineCached: true,
    rooms: [
      {
        roomName: 'Living e Varanda Integrada',
        items: [
          { id: 'i1', name: 'Pintura Acrílica Fosca (Gelo)', condition: 'NOVO', observations: 'Sem trincas ou manchas.', hasPhoto: true },
          { id: 'i2', name: 'Piso Porcelanato 1.20x1.20m', condition: 'NOVO', observations: 'Rejuntes perfeitos.', hasPhoto: true },
          { id: 'i3', name: 'Fechamento de Vidro Retrátil', condition: 'BOM', observations: 'Deslizamento suave.', hasPhoto: true }
        ]
      },
      {
        roomName: 'Cozinha Gourmet & Área de Serviço',
        items: [
          { id: 'i4', name: 'Bancada em Granito Preto São Gabriel', condition: 'NOVO', observations: 'Sem lascas.', hasPhoto: true },
          { id: 'i5', name: 'Metais e Torneira Monocomando', condition: 'BOM', observations: 'Pressão normal de água.', hasPhoto: true }
        ]
      }
    ]
  }
];

export const INITIAL_KEYS: PropertyKeyRecord[] = [
  {
    id: 'key_1',
    keyNumber: 'CH-042',
    propertyCode: 'AP-JARDINS-42',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82',
    status: 'NO_CLAVICULARIO',
  },
  {
    id: 'key_2',
    keyNumber: 'CH-018',
    propertyCode: 'AP-PINHEIROS-18',
    propertyAddress: 'Rua dos Pinheiros, 890 - Ap 141',
    status: 'EM_VISITA',
    checkedOutToBrokerName: 'Roberto Silveira',
    checkedOutAt: 'Hoje às 09:30',
    expectedReturnAt: 'Hoje às 11:30',
    isOverdue: false,
  },
  {
    id: 'key_3',
    keyNumber: 'CH-104',
    propertyCode: 'COB-MOEMA-99',
    propertyAddress: 'Av. Ibirapuera, 2400 - Cobertura',
    status: 'NO_CLAVICULARIO',
  }
];

export const INITIAL_CCA_PROPOSALS: CreditProposalCCA[] = [
  {
    id: 'cca_1',
    clientName: 'Dra. Gabriela Vasconcelos',
    clientCpf: '298.411.782-90',
    bank: 'CAIXA_ECONOMICA',
    propertyValue: 1850000,
    downPaymentValue: 370000,
    financedValue: 1480000,
    termMonths: 360,
    interestRateAnnual: 9.8,
    estimatedMonthlyPayment: 13420,
    stage: 'AVALIACAO_ENGENHARIA',
    bankCommissionFee: 17760, // 1.2% receita líquida para imobiliária
    updatedAt: '24/09/2026',
  },
  {
    id: 'cca_2',
    clientName: 'Rodrigo Siqueira',
    clientCpf: '184.992.304-45',
    bank: 'ITAU',
    propertyValue: 2200000,
    downPaymentValue: 600000,
    financedValue: 1600000,
    termMonths: 420,
    interestRateAnnual: 10.2,
    estimatedMonthlyPayment: 14890,
    stage: 'ANALISE_RISCO',
    bankCommissionFee: 19200,
    updatedAt: '23/09/2026',
  },
  {
    id: 'cca_3',
    clientName: 'Elisangela da Cruz',
    clientCpf: '119.867.547-24',
    bank: 'SANTANDER',
    propertyValue: 2450000,
    downPaymentValue: 800000,
    financedValue: 1650000,
    termMonths: 360,
    interestRateAnnual: 9.9,
    estimatedMonthlyPayment: 15100,
    stage: 'PAGO_COMISSAO_CCA',
    bankCommissionFee: 19800,
    updatedAt: '24/09/2026',
  }
];

export const INITIAL_FLEET: FleetVehicle[] = [
  {
    id: 'veh_1',
    model: 'Jeep Renegade Longitude Turbo',
    plate: 'BRA-2E19',
    year: 2025,
    status: 'EM_USO',
    currentKm: 18450,
    fuelLevelPercent: 75,
    assignedBrokerName: 'Roberto Silveira (Visita Clientes)',
    nextRevisionKm: 20000,
    lastCleanedAt: 'Ontem',
  },
  {
    id: 'veh_2',
    model: 'Hyundai HB20 Diamond Plus',
    plate: 'GHT-4A32',
    year: 2024,
    status: 'DISPONIVEL',
    currentKm: 32100,
    fuelLevelPercent: 90,
    nextRevisionKm: 40000,
    lastCleanedAt: '22/09/2026',
  }
];

export const INITIAL_ASSETS: CompanyAsset[] = [
  { id: 'ast_1', assetCode: 'PAT-0042', title: 'MacBook Pro M3 14" (Corretor Plantão)', category: 'NOTEBOOK', assignedUser: 'Juliana Mendes', branch: 'Matriz Jardins', purchaseDate: '15/02/2025', estimatedValue: 14500, condition: 'EXCELENTE' },
  { id: 'ast_2', assetCode: 'PAT-0043', title: 'Monitor Dell UltraSharp 27" 4K', category: 'MONITOR', assignedUser: 'Camila Albuquerque', branch: 'Matriz Jardins', purchaseDate: '10/01/2025', estimatedValue: 3400, condition: 'EXCELENTE' },
  { id: 'ast_3', assetCode: 'PAT-0089', title: 'Mesa de Reunião Fechamento Carvalho', category: 'MOBILIARIO', assignedUser: 'Sala Presidencial', branch: 'Matriz Jardins', purchaseDate: '20/11/2024', estimatedValue: 8900, condition: 'BOM' }
];

export const INITIAL_REFERRALS: ReferralLead[] = [
  {
    id: 'ref_1',
    referrerName: 'Sebastião Alves (Porteiro Ed. Maison D\'Or)',
    referrerPhone: '(11) 98112-9090',
    referrerPix: '11981129090',
    relationship: 'PORTEIRO',
    leadClientName: 'Beatriz Nunes',
    leadClientPhone: '(11) 97777-2005',
    interestType: 'LOCACAO',
    status: 'EM_NEGOCIACAO',
    bountyRewardAmount: 1200,
    submittedAt: 'Hoje às 08:30',
  },
  {
    id: 'ref_2',
    referrerName: 'Dr. Ricardo Antunes (Cliente Antigo)',
    referrerPhone: '(11) 99192-3344',
    referrerPix: 'ricardo@antunes.med.br',
    relationship: 'CLIENTE_ANTIGO',
    leadClientName: 'Eduardo Martins',
    leadClientPhone: '(11) 97777-2008',
    interestType: 'COMPRA',
    status: 'EM_NEGOCIACAO',
    bountyRewardAmount: 3500,
    submittedAt: 'Ontem às 17:00',
  }
];

export const INITIAL_LMS_COURSES: LMSCourse[] = [
  {
    id: 'crs_1',
    title: 'Técnicas de Negociação e Fechamento de Alto Padrão nos Jardins',
    category: 'ALTO_PADRAO',
    source: 'PLATAFORMA_ACERTGO',
    durationMinutes: 45,
    lessonsCount: 6,
    completedByCount: 18,
    hasAudioPodcast: true,
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=80',
    summary: 'Roteiros de abordagem, contorno de objeções de investidores e etiqueta em visitas presenciais.',
    instructor: 'Dr. Roberto Silveira',
    instructorRole: 'Master Closer & Especialista Jardins',
    xpPoints: 300,
    badgeName: 'Closer Jardins',
    badgeIcon: 'Award'
  },
  {
    id: 'crs_2',
    title: 'Esteira Bancária CCA: Como Multiplicar sua Comissão com Financiamento',
    category: 'FINANCIAMENTO',
    source: 'PLATAFORMA_ACERTGO',
    durationMinutes: 30,
    lessonsCount: 4,
    completedByCount: 22,
    hasAudioPodcast: true,
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    summary: 'Aprenda o passo a passo da Caixa e Itaú para aprovar o crédito do seu cliente em até 48 horas.',
    instructor: 'Vanessa Nogueira',
    instructorRole: 'Head de Correspondente Bancário (CCA)',
    xpPoints: 250,
    badgeName: 'Especialista CCA',
    badgeIcon: 'Building'
  }
];

export const BRAND_EQUITY_CONFIG: BrandEquityConfig = {
  primaryColor: '#0056D2',
  accentColor: '#00C896',
  headingFont: 'Poppins',
  bodyFont: 'Outfit',
  toneOfVoice: 'SOFISTICADO',
  allowedPhrasingRules: [
    'Sempre enfatizar segurança jurídica e curadoria imobiliária',
    'Destacar iluminação natural, ventilação cruzada e localização estratégica',
    'Proibido usar gírias ou superlativos não verificados ("o melhor do mundo")',
    'Sempre incluir CRECI da imobiliária em todas as peças e artes'
  ],
  mandatoryDisclaimer: 'AcertGo Intermediações Imobiliárias Ltda - CRECI 34982-J. Imagens meramente ilustrativas.'
};

// ============================================================================
// MÓDULO PROPRIETÁRIOS (PESSOA FÍSICA E JURÍDICA)
// ============================================================================
export const INITIAL_OWNERS: Owner[] = [
  {
    id: 'own_01',
    personType: 'PF',
    name: 'Dr. Cláudio Prado Junqueira',
    document: '142.890.348-12',
    rg: '24.891.023-X SSP/SP',
    birthDate: '1978-05-18',
    maritalStatus: 'SOLTEIRO',
    profession: 'Médico Cardiologista',
    email: 'claudio.prado@cardiojardins.com.br',
    secondaryEmail: 'cprado.pessoal@gmail.com',
    phone: '(11) 99882-1100',
    secondaryPhone: '(11) 3088-4422',
    address: {
      cep: '01426-001',
      street: 'Rua Bela Cintra',
      number: '2105',
      complement: 'Apto 181',
      neighborhood: 'Cerqueira César / Jardins',
      city: 'São Paulo',
      state: 'SP'
    },
    bankDetails: {
      bankCode: '341',
      bankName: 'Itaú Unibanco',
      accountType: 'CORRENTE',
      agency: '0842',
      accountNumber: '48920',
      accountDigit: '4',
      pixKeyType: 'CPF',
      pixKey: '14289034812',
      accountHolderName: 'Cláudio Prado Junqueira',
      accountHolderDocument: '142.890.348-12'
    },
    status: 'ATIVO',
    notes: 'Cliente investidor de alta renda. Prefere contato preferencialmente via WhatsApp ou com a secretária Ana.',
    propertiesCount: 2,
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'own_02',
    personType: 'PJ',
    name: 'Vanguard Patrimonial & Participações S/A',
    tradeName: 'Grupo Vanguard Asset',
    document: '18.294.810/0001-92',
    stateRegistration: '114.892.401.110',
    legalRepresentative: {
      name: 'Roberto Mendonça da Silva',
      cpf: '087.654.321-99',
      role: 'Diretor Financeiro & COO',
      phone: '(11) 98450-8900',
      email: 'roberto.mendonca@vanguardasset.com.br'
    },
    email: 'controladoria@vanguardasset.com.br',
    secondaryEmail: 'repasse.locacao@vanguardasset.com.br',
    phone: '(11) 3100-7500',
    secondaryPhone: '(11) 98450-8900',
    address: {
      cep: '04538-133',
      street: 'Av. Brigadeiro Faria Lima',
      number: '3900',
      complement: '14º Andar - Torre Sul',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    bankDetails: {
      bankCode: '033',
      bankName: 'Banco Santander',
      accountType: 'CORRENTE',
      agency: '2150',
      accountNumber: '1300948',
      accountDigit: '8',
      pixKeyType: 'CNPJ',
      pixKey: '18294810000192',
      accountHolderName: 'Vanguard Patrimonial & Participações S/A',
      accountHolderDocument: '18.294.810/0001-92'
    },
    status: 'ATIVO',
    notes: 'Holding familiar com portfólio robusto para locação corporativa e residencial prime. Split automático homologado no Asaas.',
    propertiesCount: 3,
    createdAt: '2023-11-20T14:30:00.000Z'
  },
  {
    id: 'own_03',
    personType: 'PF',
    name: 'Dra. Helena Beatriz Cavalcanti',
    document: '219.048.712-40',
    rg: '18.490.231-1 SSP/SP',
    birthDate: '1962-09-28',
    maritalStatus: 'CASADO',
    profession: 'Juíza de Direito Aposentada',
    spouseName: 'Dr. Sérgio Augusto Cavalcanti',
    spouseCpf: '190.283.472-10',
    propertyRegime: 'Comunhão Parcial de Bens',
    email: 'helena.cavalcanti@uol.com.br',
    phone: '(11) 99123-5566',
    address: {
      cep: '05463-000',
      street: 'Rua Alberto Faria',
      number: '210',
      neighborhood: 'Alto de Pinheiros',
      city: 'São Paulo',
      state: 'SP'
    },
    bankDetails: {
      bankCode: '001',
      bankName: 'Banco do Brasil',
      accountType: 'CORRENTE',
      agency: '1890',
      accountNumber: '98402',
      accountDigit: '1',
      pixKeyType: 'EMAIL',
      pixKey: 'helena.cavalcanti@uol.com.br',
      accountHolderName: 'Helena Beatriz Cavalcanti',
      accountHolderDocument: '219.048.712-40'
    },
    status: 'ATIVO',
    notes: 'Proprietária da mansão em Alto de Pinheiros. Exige agendamento prévio com no mínimo 24h de antecedência e corretor credenciado no local.',
    propertiesCount: 1,
    createdAt: '2024-02-05T09:15:00.000Z'
  },
  {
    id: 'own_04',
    personType: 'PJ',
    name: 'Prime Office & Co Holding LTDA',
    tradeName: 'Prime Office Imóveis Comerciais',
    document: '32.748.190/0001-05',
    stateRegistration: '109.482.012.333',
    legalRepresentative: {
      name: 'Mariana F. Castilho',
      cpf: '312.984.605-77',
      role: 'Sócia Administradora',
      phone: '(11) 97321-4400',
      email: 'mariana@primeofficeholding.com.br'
    },
    email: 'contato@primeofficeholding.com.br',
    phone: '(11) 3290-6000',
    address: {
      cep: '04538-001',
      street: 'Rua Amauri',
      number: '255',
      complement: 'Conjunto 81',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    bankDetails: {
      bankCode: '208',
      bankName: 'Banco BTG Pactual',
      accountType: 'CORRENTE',
      agency: '0001',
      accountNumber: '5540192',
      accountDigit: '3',
      pixKeyType: 'ALEATORIA',
      pixKey: 'b83c2710-41fa-4fbb-9189-e593acbc6210',
      accountHolderName: 'Prime Office & Co Holding LTDA',
      accountHolderDocument: '32.748.190/0001-05'
    },
    status: 'ATIVO',
    notes: 'Especialistas em lajes corporativas e salas comerciais de alto padrão nos eixos Faria Lima, Berrini e Paulista.',
    propertiesCount: 1,
    createdAt: '2024-03-10T16:00:00.000Z'
  },
  {
    id: 'own_05',
    personType: 'PF',
    name: 'Marcelo Silveira Antunes',
    document: '389.201.748-55',
    rg: '32.901.844-0 SSP/SP',
    birthDate: '1985-10-14',
    maritalStatus: 'DIVORCIADO',
    profession: 'Engenheiro de Software & Fundador Tech',
    email: 'marcelo.antunes@techventures.io',
    phone: '(11) 98112-9900',
    address: {
      cep: '04515-030',
      street: 'Rua Canário',
      number: '512',
      complement: 'Garden 12',
      neighborhood: 'Moema Pássaros',
      city: 'São Paulo',
      state: 'SP'
    },
    bankDetails: {
      bankCode: '260',
      bankName: 'Nu Pagamentos (Nubank)',
      accountType: 'PAGAMENTO',
      agency: '0001',
      accountNumber: '8901234',
      accountDigit: '9',
      pixKeyType: 'TELEFONE',
      pixKey: '+5511981129900',
      accountHolderName: 'Marcelo Silveira Antunes',
      accountHolderDocument: '389.201.748-55'
    },
    status: 'EM_ANALISE',
    notes: 'Pendente envio de certidão atualizada de matrícula do imóvel no 14º CRI de São Paulo.',
    propertiesCount: 1,
    createdAt: '2024-04-01T11:20:00.000Z'
  },
  {
    id: 'own_06',
    personType: 'PJ',
    name: 'Incorporadora Terras do Sul Empreendimentos LTDA',
    tradeName: 'Terras do Sul Urbanismo',
    document: '45.109.823/0001-78',
    stateRegistration: '206.491.804.119',
    legalRepresentative: {
      name: 'Gustavo Peixoto',
      cpf: '245.981.409-18',
      role: 'Diretor de Incorporações',
      phone: '(11) 99650-1200',
      email: 'gustavo@terrasdosul.com.br'
    },
    email: 'vendas@terrasdosul.com.br',
    phone: '(11) 4195-3000',
    address: {
      cep: '06454-000',
      street: 'Alameda Rio Negro',
      number: '585',
      complement: 'Bloco C - Sala 904',
      neighborhood: 'Alphaville Industrial',
      city: 'Barueri',
      state: 'SP'
    },
    bankDetails: {
      bankCode: '237',
      bankName: 'Banco Bradesco',
      accountType: 'CORRENTE',
      agency: '3200',
      accountNumber: '445019',
      accountDigit: '7',
      pixKeyType: 'CNPJ',
      pixKey: '45109823000178',
      accountHolderName: 'Terras do Sul Empreendimentos LTDA',
      accountHolderDocument: '45.109.823/0001-78'
    },
    status: 'ATIVO',
    notes: 'Desenvolvedora de condomínios fechados horizontais de luxo em Alphaville e Tamboré. Contrato de exclusividade de 90 dias.',
    propertiesCount: 1,
    createdAt: '2024-02-18T08:45:00.000Z'
  }
];

// ============================================================================
// MÓDULO IMÓVEIS (CADASTRO COMPLETO & CATÁLOGO)
// ============================================================================
export const INITIAL_PROPERTIES: RealEstateProperty[] = [
  {
    id: 'prop_01',
    code: 'IMO-1001',
    title: 'Cobertura Duplex Garden na Oscar Freire com Piscina Privativa',
    description: 'Espetacular cobertura duplex em um dos endereços mais cobiçados do Brasil. Living amplo integrado com terraço gourmet, pé direito duplo, piscina privativa aquecida com vista panorâmica 360° para os Jardins e Parque do Ibirapuera. Suíte master com closet duplo senhor e senhora, hidromassagem e acabamento em mármore travertino romano.',
    propertyType: 'COBERTURA',
    transactionType: 'VENDA_LOCACAO',
    status: 'DISPONIVEL',
    featured: true,
    ownerId: 'own_01',
    ownerName: 'Dr. Cláudio Prado Junqueira',
    ownerDocument: '142.890.348-12',
    ownerPhone: '(11) 99882-1100',
    pricing: {
      salePrice: 6800000,
      rentPrice: 28000,
      condoFee: 4200,
      iptuFee: 1850,
      fireInsurance: 240,
      commissionSalePercent: 6,
      commissionRentValue: 28000
    },
    specs: {
      totalAreaM2: 460,
      usableAreaM2: 340,
      bedrooms: 4,
      suites: 4,
      bathrooms: 5,
      parkingSpaces: 4,
      floor: 21,
      totalFloors: 22,
      sunOrientation: 'MANHA',
      furnishing: 'SEMIMOBILIADO',
      yearBuilt: 2020
    },
    address: {
      cep: '01426-001',
      street: 'Rua Oscar Freire',
      number: '1420',
      complement: 'Cobertura 2101',
      neighborhood: 'Cerqueira César / Jardins',
      city: 'São Paulo',
      state: 'SP',
      zone: 'SUL',
      displayAddressOnWeb: true
    },
    features: [
      'Piscina Privativa Aquecida',
      'Varanda Gourmet com Churrasqueira',
      'Ar Condicionado Central VRF',
      'Elevador Privativo com Biometria',
      'Portaria Blindada 24h',
      'Vista Panorâmica 360°',
      'Pé Direito Duplo',
      'Depósito Privativo no Subsolo',
      'Adega Climatizada para 200 rótulos'
    ],
    images: [
      {
        id: 'img_01_1',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Fachada e Vista Externa da Cobertura'
      },
      {
        id: 'img_01_2',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Living com Pé Direito Duplo'
      },
      {
        id: 'img_01_3',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Varanda Gourmet com Deck e Piscina'
      },
      {
        id: 'img_01_4',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Suíte Master com Vista Livre'
      }
    ],
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample-duplex-jardins',
    videoUrl: 'https://www.youtube.com/watch?v=sample-video-tour',
    keysLocation: 'Claviculário #18 - Gaveta Central da Matriz',
    createdAt: '2024-02-10T11:00:00.000Z'
  },
  {
    id: 'prop_02',
    code: 'IMO-1002',
    title: 'Residência Contemporânea em Alphaville Residencial 2 com Borda Infinita',
    description: 'Arquitetura autoral e imponente assinada por renomado escritório paulista. Terreno plano de 950m² com 680m² de área construída. Ambientes 100% integrados à natureza, caixilharia do chão ao teto, home cinema automatizado em 4K, suítes todas com closets privativos e varanda para a reserva florestal.',
    propertyType: 'CASA_CONDOMINIO',
    transactionType: 'VENDA',
    status: 'DISPONIVEL',
    featured: true,
    ownerId: 'own_06',
    ownerName: 'Incorporadora Terras do Sul Empreendimentos LTDA',
    ownerDocument: '45.109.823/0001-78',
    ownerPhone: '(11) 99650-1200',
    pricing: {
      salePrice: 9450000,
      condoFee: 2400,
      iptuFee: 980,
      commissionSalePercent: 6
    },
    specs: {
      totalAreaM2: 950,
      usableAreaM2: 680,
      bedrooms: 5,
      suites: 5,
      bathrooms: 7,
      parkingSpaces: 6,
      sunOrientation: 'MANHA',
      furnishing: 'SEMIMOBILIADO',
      yearBuilt: 2023
    },
    address: {
      cep: '06454-010',
      street: 'Alameda das Quaresmeiras',
      number: '340',
      neighborhood: 'Alphaville Residencial 2',
      city: 'Barueri',
      state: 'SP',
      zone: 'OESTE',
      displayAddressOnWeb: false
    },
    features: [
      'Piscina com Borda Infinita e Prainha',
      'Sauna Úmida Integrada à Piscina',
      'Espaço Gourmet com Ilha em Quartzo',
      'Home Cinema Acústico 4K',
      'Automação Residencial Control4 Completa',
      'Painéis Fotovoltaicos com Inversor Solar',
      'Adega Climatizada em Vidro',
      'Garagem Coberta para 6 Carros Grandes',
      'Segurança e Ronda Motorizada Armada 24h'
    ],
    images: [
      {
        id: 'img_02_1',
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Fachada Contemporânea Alphaville'
      },
      {
        id: 'img_02_2',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Piscina Iluminada e Área Gourmet'
      },
      {
        id: 'img_02_3',
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Cozinha Gourmet Integrada'
      }
    ],
    keysLocation: 'Portaria Central Condomínio Alphaville 2 (Autorização Digital Liberada)',
    createdAt: '2024-03-01T15:30:00.000Z'
  },
  {
    id: 'prop_03',
    code: 'IMO-1003',
    title: 'Apartamento de Luxo no Itaim Bibi com Varanda Gourmet e Vista para o Parque',
    description: 'Projeto moderno de alto padrão a poucos passos dos melhores restaurantes do Itaim e do Parque do Povo. Living amplo com marcenaria sob medida de altíssimo nível, ar condicionado split em todos os ambientes e fechadura digital. Condomínio clube de altíssimo padrão com raia olímpica aquecida e academia equipada pela LifeFitness.',
    propertyType: 'APARTAMENTO',
    transactionType: 'LOCACAO',
    status: 'DISPONIVEL',
    featured: false,
    ownerId: 'own_02',
    ownerName: 'Vanguard Patrimonial & Participações S/A',
    ownerDocument: '18.294.810/0001-92',
    ownerPhone: '(11) 3100-7500',
    pricing: {
      rentPrice: 14500,
      condoFee: 2100,
      iptuFee: 780,
      fireInsurance: 150,
      commissionRentValue: 14500
    },
    specs: {
      totalAreaM2: 210,
      usableAreaM2: 165,
      bedrooms: 3,
      suites: 3,
      bathrooms: 4,
      parkingSpaces: 3,
      floor: 14,
      totalFloors: 24,
      sunOrientation: 'MANHA',
      furnishing: 'MOBILIADO',
      yearBuilt: 2021
    },
    address: {
      cep: '04533-002',
      street: 'Rua Tabapuã',
      number: '890',
      complement: 'Apto 142',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zone: 'SUL',
      displayAddressOnWeb: true
    },
    features: [
      'Totalmente Mobiliado por Arquiteto Renomado',
      'Churrasqueira a Carvão na Varanda Envidraçada',
      'Fechadura Biométrica Samsung',
      'Academia Equipada LifeFitness',
      'Piscina Aquecida Coberta com Raia 25m',
      'Ponto de Recarga para Carros Elétricos',
      'Serviço de Concierge & Lavanderia Pay-Per-Use'
    ],
    images: [
      {
        id: 'img_03_1',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Living Room com Varanda Integrada'
      },
      {
        id: 'img_03_2',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Cozinha Aberta e Sala de Jantar'
      },
      {
        id: 'img_03_3',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Suíte Principal com Cama King Size'
      }
    ],
    keysLocation: 'Claviculário #04 - Filial Jardins',
    createdAt: '2024-03-12T09:00:00.000Z'
  },
  {
    id: 'prop_04',
    code: 'IMO-1004',
    title: 'Laje Corporativa Triple A na Faria Lima com Certificação LEED Platinum',
    description: 'Excelente andar corporativo integral no coração do centro financeiro de São Paulo. Piso elevado com cabeamento estruturado Cat6A, ar condicionado central VRF de alta eficiência, gerador com autonomia de 100% das áreas privativas e comuns, heliponto homologado e recepção com controle de acesso por reconhecimento facial.',
    propertyType: 'SALA_COMERCIAL',
    transactionType: 'LOCACAO',
    status: 'EM_NEGOCIACAO',
    featured: true,
    ownerId: 'own_04',
    ownerName: 'Prime Office & Co Holding LTDA',
    ownerDocument: '32.748.190/0001-05',
    ownerPhone: '(11) 3290-6000',
    pricing: {
      rentPrice: 68000,
      condoFee: 12800,
      iptuFee: 5400,
      fireInsurance: 850,
      commissionRentValue: 68000
    },
    specs: {
      totalAreaM2: 560,
      usableAreaM2: 480,
      bedrooms: 0,
      suites: 0,
      bathrooms: 8,
      parkingSpaces: 12,
      floor: 11,
      totalFloors: 28,
      sunOrientation: 'MANHA',
      furnishing: 'VAZIO',
      yearBuilt: 2019
    },
    address: {
      cep: '04538-133',
      street: 'Av. Brigadeiro Faria Lima',
      number: '3477',
      complement: '11º Andar Inteiro',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zone: 'SUL',
      displayAddressOnWeb: true
    },
    features: [
      'Certificação Internacional LEED Platinum',
      'Piso Elevado com Placas de Aço',
      'Gerador de Energia 100% de Carga Contínua',
      'Heliponto Homologado para Grandes Aeronaves',
      'Catracas com Reconhecimento Facial',
      'Bicicletário com Vestiário Executivo Completo',
      'Restaurante e Cafeteria no Mezanino do Edifício'
    ],
    images: [
      {
        id: 'img_04_1',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Salão Principal da Laje Corporativa'
      },
      {
        id: 'img_04_2',
        url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Salas de Reunião com Vidros Acústicos'
      }
    ],
    keysLocation: 'Administração Predial Torre Norte - 4º Andar com Síndico',
    createdAt: '2024-01-28T14:10:00.000Z'
  },
  {
    id: 'prop_05',
    code: 'IMO-1005',
    title: 'Apartamento Garden em Moema Pássaros com Quintal Privativo e Jacuzzi',
    description: 'O privilégio de viver com a tranquilidade de uma casa e a segurança integral de um condomínio fechado. Quintal privativo com gramado, deck em madeira nobre e spa jacuzzi aquecido com cromoterapia. Living integrado à cozinha americana, armários planejados da Ornare e 2 vagas de garagem demarcadas e soltas.',
    propertyType: 'APARTAMENTO',
    transactionType: 'VENDA',
    status: 'RESERVADO',
    featured: false,
    ownerId: 'own_05',
    ownerName: 'Marcelo Silveira Antunes',
    ownerDocument: '389.201.748-55',
    ownerPhone: '(11) 98112-9900',
    pricing: {
      salePrice: 2950000,
      condoFee: 1650,
      iptuFee: 620,
      commissionSalePercent: 6
    },
    specs: {
      totalAreaM2: 180,
      usableAreaM2: 142,
      bedrooms: 3,
      suites: 2,
      bathrooms: 3,
      parkingSpaces: 2,
      floor: 1,
      totalFloors: 16,
      sunOrientation: 'TARDE',
      furnishing: 'SEMIMOBILIADO',
      yearBuilt: 2018
    },
    address: {
      cep: '04515-030',
      street: 'Rua Canário',
      number: '512',
      complement: 'Garden 12',
      neighborhood: 'Moema Pássaros',
      city: 'São Paulo',
      state: 'SP',
      zone: 'SUL',
      displayAddressOnWeb: true
    },
    features: [
      'Garden Privativo com Gramado e Paisagismo',
      'Jacuzzi Externa com Aquecedor e Hidromassagem',
      'Armários Planejados Ornare na Cozinha e Dormitórios',
      'Ar Condicionado Inverter em Todos os Ambientes',
      'Churrasqueira a Carvão Privativa',
      'Pet Place no Condomínio',
      'Portaria Remota 24h com Acesso por App'
    ],
    images: [
      {
        id: 'img_05_1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Garden Privativo com Deck de Madeira'
      },
      {
        id: 'img_05_2',
        url: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8c974c?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Living com Integração ao Jardim'
      }
    ],
    keysLocation: 'Com Zelador do Edifício - Sr. Antônio',
    createdAt: '2024-03-22T17:40:00.000Z'
  },
  {
    id: 'prop_06',
    code: 'IMO-1006',
    title: 'Mansão Neoclássica em Alto de Pinheiros com Quadra de Beach Tennis',
    description: 'Propriedade monumental situada em rua estritamente residencial e monitorada em Alto de Pinheiros. Terreno exuberante com 820m² e projeto paisagístico preservado. Possui quadra oficial de beach tennis iluminada, piscina semiolímpica de alvenaria com bar molhado, casa de hóspedes independente e segurança patrimonial com guarida blindada.',
    propertyType: 'CASA',
    transactionType: 'VENDA',
    status: 'DISPONIVEL',
    featured: true,
    ownerId: 'own_03',
    ownerName: 'Dra. Helena Beatriz Cavalcanti',
    ownerDocument: '219.048.712-40',
    ownerPhone: '(11) 99123-5566',
    pricing: {
      salePrice: 12500000,
      iptuFee: 3100,
      commissionSalePercent: 6
    },
    specs: {
      totalAreaM2: 820,
      usableAreaM2: 590,
      bedrooms: 4,
      suites: 4,
      bathrooms: 6,
      parkingSpaces: 5,
      sunOrientation: 'MANHA',
      furnishing: 'SEMIMOBILIADO',
      yearBuilt: 2016
    },
    address: {
      cep: '05463-000',
      street: 'Rua Alberto Faria',
      number: '210',
      neighborhood: 'Alto de Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zone: 'OESTE',
      displayAddressOnWeb: false
    },
    features: [
      'Quadra Oficial de Beach Tennis Iluminada',
      'Piscina Semiolímpica com Bar Molhado',
      'Casa de Hóspedes / Dependência Completa',
      'Paisagismo Exuberante com Árvores Frutíferas',
      'Adega Subterrânea Natural',
      'Guarita Blindada com Central de Monitoramento CFTV',
      'Aquecimento Solar Térmico com Boiler Central'
    ],
    images: [
      {
        id: 'img_06_1',
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Entrada Monumental e Jardins'
      },
      {
        id: 'img_06_2',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Piscina e Área de Lazer'
      }
    ],
    keysLocation: 'Com a proprietária - Visitas acompanhadas com agendamento prévio de 24h',
    createdAt: '2024-02-14T10:20:00.000Z'
  },
  {
    id: 'prop_07',
    code: 'IMO-1007',
    title: 'Studio Design & Pronto para Morar a 200m da Estação Paulista',
    description: 'Imóvel sob medida para investidores de alta rentabilidade (Short Stay / Airbnb ou locação convencional). Totalmente mobiliado e decorado, com eletrodomésticos embutidos, cama queen rebatível com sofá integrado, fechadura biométrica e varanda com vista livre para os Jardins.',
    propertyType: 'STUDIO',
    transactionType: 'LOCACAO',
    status: 'ALUGADO',
    featured: false,
    ownerId: 'own_02',
    ownerName: 'Vanguard Patrimonial & Participações S/A',
    ownerDocument: '18.294.810/0001-92',
    ownerPhone: '(11) 3100-7500',
    pricing: {
      rentPrice: 4200,
      condoFee: 580,
      iptuFee: 160,
      fireInsurance: 60,
      commissionRentValue: 4200
    },
    specs: {
      totalAreaM2: 45,
      usableAreaM2: 38,
      bedrooms: 1,
      suites: 0,
      bathrooms: 1,
      parkingSpaces: 1,
      floor: 9,
      totalFloors: 18,
      sunOrientation: 'MANHA',
      furnishing: 'MOBILIADO',
      yearBuilt: 2022
    },
    address: {
      cep: '01419-000',
      street: 'Rua Bela Cintra',
      number: '620',
      complement: 'Studio 903',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zone: 'CENTRO',
      displayAddressOnWeb: true
    },
    features: [
      '100% Mobiliado com Marcenaria Inteligente',
      'Rooftop com Piscina de Borda Infinita e Bar',
      'Coworking Equipado com Cabines de Call Acústicas',
      'Lavanderia Coletiva Compartilhada OMO',
      'Mercadinho Autônomo Hirota no Prédio',
      'Academia Moderna com Equipamentos Technogym'
    ],
    images: [
      {
        id: 'img_07_1',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Studio Compacto com Cama e Cozinha Aberta'
      }
    ],
    keysLocation: 'Fechadura Eletrônica Digital (Senha no Contrato de Locação)',
    createdAt: '2024-03-05T12:00:00.000Z'
  }
];


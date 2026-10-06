import { 
  BrokerRankingEntry, 
  TeamRankingEntry, 
  RecentDealAlert, 
  TvSlideDefinition, 
  TvSlideCategory,
  TvPeriod 
} from '../types/tvRanking';

export const TV_SLIDES_CATALOG: TvSlideDefinition[] = [
  {
    id: 'PODIUM_GERAL',
    title: 'Pódio dos Campeões Gerais',
    subtitle: 'Os 3 Maiores Faturamentos & Estrelas em Destaque do Período',
    kicker: 'HALL DA FAMA • VGV & FATURAMENTO',
    iconName: 'Crown',
    accentColor: 'amber'
  },
  {
    id: 'EQUIPE_CAMPEA',
    title: 'Equipes Campeãs do Mês e do Ano',
    subtitle: 'Liderança Coletiva, Metas Batidas e Troféu de Melhor Squad',
    kicker: 'DISPUTA ENTRE SQUADS • METAS & VGV',
    iconName: 'Users',
    accentColor: 'blue'
  },
  {
    id: 'VENDAS_VGV',
    title: 'Campeões de Vendas (VGV)',
    subtitle: 'Volume Geral de Vendas Intermediado & Negócios Concluídos',
    kicker: 'ESCRITURAS & FECHAMENTOS',
    iconName: 'DollarSign',
    accentColor: 'emerald'
  },
  {
    id: 'LOCACOES',
    title: 'Campeões de Locações',
    subtitle: 'Contratos Assinados, Receita Recorrente e Menor Vacância',
    kicker: 'CARTEIRA DE ALUGUEL & TAXA ADM',
    iconName: 'KeyRound',
    accentColor: 'purple'
  },
  {
    id: 'ATENDIMENTO_LEADS',
    title: 'Campeões de Atendimento de Leads (SLA)',
    subtitle: 'Menor Tempo de Primeiro Contato e Máxima Taxa de Conversão',
    kicker: 'VELOCIDADE 24/7 • ROLETA & WHATSAPP',
    iconName: 'Zap',
    accentColor: 'amber'
  },
  {
    id: 'CAPTACOES',
    title: 'Campeões de Captações & Exclusividades',
    subtitle: 'Novos Imóveis Angariados para o Estoque com Exclusividade',
    kicker: 'ANGARIAÇÃO & CANAL PRO',
    iconName: 'Home',
    accentColor: 'cyan'
  },
  {
    id: 'VISITAS_REALIZADAS',
    title: 'Campeões de Visitas Realizadas',
    subtitle: 'Visitas Presenciais Guiadas com Clientes nos Imóveis',
    kicker: 'RELACIONAMENTO & PRESENÇA DE CAMPO',
    iconName: 'Compass',
    accentColor: 'indigo'
  },
  {
    id: 'LANCAMENTOS',
    title: 'Campeões de Lançamentos & Stands',
    subtitle: 'Vendas de Imóveis na Planta, Stands e Parcerias com Incorporadoras',
    kicker: 'PLANTÕES & ESPELHO DE VENDAS',
    iconName: 'Building',
    accentColor: 'rose'
  },
  {
    id: 'USO_CRM',
    title: 'Campeões de Uso do CRM & Disciplina Comercial',
    subtitle: 'Pontuação de Gamificação, Tarefas em Dia e Funil sem Estagnação',
    kicker: 'ORGANIZAÇÃO & RIGOR COMERCIAL',
    iconName: 'Activity',
    accentColor: 'teal'
  },
  {
    id: 'MURAL_CONQUISTAS',
    title: 'Mural de Vitórias em Tempo Real',
    subtitle: 'Fechamentos Recentes no Salão de Vendas & Celebrações',
    kicker: 'TRANSMISSÃO AO VIVO • TOQUE DO SINO',
    iconName: 'Trophy',
    accentColor: 'amber'
  }
];

export const MOCK_TEAM_RANKINGS: Record<TvPeriod, TeamRankingEntry[]> = {
  MES: [
    {
      id: 'team_alpha',
      rank: 1,
      teamName: 'Equipe Alpha Prime',
      managerName: 'Camila Albuquerque',
      managerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      membersCount: 8,
      vgvMonth: 21850000,
      vgvFormatted: 'R$ 21.850.000',
      contractsCount: 19,
      targetPercent: 138,
      monthlyTrophies: 7,
      isMonthChampion: true,
      topPerformerName: 'Juliana Mendes',
      badge: 'Squad Campeão do Mês',
      colorScheme: 'gold',
      motto: 'Foco no Alto Padrão e Fechamentos Velozes'
    },
    {
      id: 'team_titanium',
      rank: 2,
      teamName: 'Titanium Luxury Brokers',
      managerName: 'Roberto Silveira',
      managerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      membersCount: 7,
      vgvMonth: 16400000,
      vgvFormatted: 'R$ 16.400.000',
      contractsCount: 14,
      targetPercent: 114,
      monthlyTrophies: 4,
      topPerformerName: 'Carlos Mendes',
      badge: 'Vice-Campeão do Mês',
      colorScheme: 'blue',
      motto: 'Captação Exclusiva e Conversão Máxima'
    },
    {
      id: 'team_vanguard',
      rank: 3,
      teamName: 'Vanguard Moema & Jardins',
      managerName: 'Beatriz Vasconcelos',
      managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      membersCount: 6,
      vgvMonth: 11950000,
      vgvFormatted: 'R$ 11.950.000',
      contractsCount: 16,
      targetPercent: 102,
      monthlyTrophies: 3,
      topPerformerName: 'Marcos Silveira',
      badge: 'Meta Batida (102%)',
      colorScheme: 'emerald',
      motto: 'Especialistas em Locação & Novos Negócios'
    },
    {
      id: 'team_fenix',
      rank: 4,
      teamName: 'Fênix Plantão & Lançamentos',
      managerName: 'Marcio Fontes',
      managerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      membersCount: 5,
      vgvMonth: 8700000,
      vgvFormatted: 'R$ 8.700.000',
      contractsCount: 9,
      targetPercent: 87,
      monthlyTrophies: 1,
      topPerformerName: 'Luciana Prado',
      badge: 'Em Crescimento',
      colorScheme: 'purple',
      motto: 'Parceria com Incorporadoras e Stands'
    }
  ],
  ANO: [
    {
      id: 'team_alpha',
      rank: 1,
      teamName: 'Equipe Alpha Prime',
      managerName: 'Camila Albuquerque',
      managerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      membersCount: 8,
      vgvMonth: 184500000,
      vgvFormatted: 'R$ 184.500.000',
      contractsCount: 168,
      targetPercent: 142,
      monthlyTrophies: 8,
      isYearChampion: true,
      topPerformerName: 'Juliana Mendes',
      badge: 'Campeã do Ano (Hall da Fama)',
      colorScheme: 'gold',
      motto: 'Liderança Histórica e Consistência'
    },
    {
      id: 'team_titanium',
      rank: 2,
      teamName: 'Titanium Luxury Brokers',
      managerName: 'Roberto Silveira',
      managerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      membersCount: 7,
      vgvMonth: 142800000,
      vgvFormatted: 'R$ 142.800.000',
      contractsCount: 122,
      targetPercent: 118,
      monthlyTrophies: 3,
      topPerformerName: 'Carlos Mendes',
      badge: 'Vice-Campeã Anual',
      colorScheme: 'blue',
      motto: 'Captação Exclusiva e Conversão Máxima'
    },
    {
      id: 'team_vanguard',
      rank: 3,
      teamName: 'Vanguard Moema & Jardins',
      managerName: 'Beatriz Vasconcelos',
      managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      membersCount: 6,
      vgvMonth: 104200000,
      vgvFormatted: 'R$ 104.200.000',
      contractsCount: 145,
      targetPercent: 109,
      monthlyTrophies: 1,
      topPerformerName: 'Rodrigo Faro',
      badge: '3º Lugar Anual',
      colorScheme: 'emerald',
      motto: 'Domínio de Locações Comerciais'
    },
    {
      id: 'team_fenix',
      rank: 4,
      teamName: 'Fênix Plantão & Lançamentos',
      managerName: 'Marcio Fontes',
      managerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      membersCount: 5,
      vgvMonth: 78500000,
      vgvFormatted: 'R$ 78.500.000',
      contractsCount: 82,
      targetPercent: 96,
      monthlyTrophies: 0,
      topPerformerName: 'Luciana Prado',
      badge: 'Forte Expansão',
      colorScheme: 'purple',
      motto: 'Lançamentos Mais Desejados de SP'
    }
  ],
  TRIMESTRE: [
    {
      id: 'team_alpha',
      rank: 1,
      teamName: 'Equipe Alpha Prime',
      managerName: 'Camila Albuquerque',
      managerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      membersCount: 8,
      vgvMonth: 58200000,
      vgvFormatted: 'R$ 58.200.000',
      contractsCount: 51,
      targetPercent: 132,
      monthlyTrophies: 3,
      isMonthChampion: true,
      topPerformerName: 'Juliana Mendes',
      badge: 'Líder do Trimestre',
      colorScheme: 'gold',
      motto: 'Alta Produtividade'
    },
    {
      id: 'team_titanium',
      rank: 2,
      teamName: 'Titanium Luxury Brokers',
      managerName: 'Roberto Silveira',
      managerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      membersCount: 7,
      vgvMonth: 44100000,
      vgvFormatted: 'R$ 44.100.000',
      contractsCount: 38,
      targetPercent: 110,
      monthlyTrophies: 0,
      topPerformerName: 'Carlos Mendes',
      badge: '2º Lugar Trimestral',
      colorScheme: 'blue',
      motto: 'Exclusividades Premium'
    },
    {
      id: 'team_vanguard',
      rank: 3,
      teamName: 'Vanguard Moema & Jardins',
      managerName: 'Beatriz Vasconcelos',
      managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      membersCount: 6,
      vgvMonth: 31800000,
      vgvFormatted: 'R$ 31.800.000',
      contractsCount: 43,
      targetPercent: 104,
      monthlyTrophies: 0,
      topPerformerName: 'Marcos Silveira',
      badge: '3º Lugar Trimestral',
      colorScheme: 'emerald',
      motto: 'Locações e Vendas Sólidas'
    },
    {
      id: 'team_fenix',
      rank: 4,
      teamName: 'Fênix Plantão & Lançamentos',
      managerName: 'Marcio Fontes',
      managerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      membersCount: 5,
      vgvMonth: 23600000,
      vgvFormatted: 'R$ 23.600.000',
      contractsCount: 24,
      targetPercent: 91,
      monthlyTrophies: 0,
      topPerformerName: 'Luciana Prado',
      badge: 'Plantão Lançamento',
      colorScheme: 'purple',
      motto: 'Incorporadoras Parceiras'
    }
  ]
};

export const MOCK_BROKER_RANKINGS: Partial<Record<TvSlideCategory, Record<TvPeriod, BrokerRankingEntry[]>>> = {
  PODIUM_GERAL: {
    MES: [
      {
        id: 'brk_1',
        rank: 1,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: 'R$ 14.200.000',
        numericValue: 14200000,
        primaryUnit: 'VGV Intermediado',
        secondaryMetric: 'Comissão Líquida R$ 340.800 · 5 Contratos',
        targetPercent: 154,
        badge: 'Campeã do Mês',
        highlightNote: 'Bateu 154% da Meta Individual com Fechamento no Fasano Jardins',
        isChampion: true
      },
      {
        id: 'brk_2',
        rank: 2,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: 'R$ 9.800.000',
        numericValue: 9800000,
        primaryUnit: 'VGV Intermediado',
        secondaryMetric: 'Comissão Líquida R$ 235.200 · 4 Contratos',
        targetPercent: 122,
        badge: 'Vice-Líder VGV',
        highlightNote: 'Líder em Vendas no Itaim Bibi e Coberturas'
      },
      {
        id: 'brk_3',
        rank: 3,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: 'R$ 5.400.000',
        numericValue: 5400000,
        primaryUnit: 'VGV Intermediado',
        secondaryMetric: 'Comissão Líquida R$ 129.600 · 3 Contratos',
        targetPercent: 108,
        badge: '3º Lugar Geral',
        highlightNote: 'Destaque em Agilidade e Atendimento Instantâneo'
      }
    ],
    ANO: [
      {
        id: 'brk_1',
        rank: 1,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: 'R$ 112.500.000',
        numericValue: 112500000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: 'Comissão Líquida R$ 2.700.000 · 38 Vendas',
        targetPercent: 168,
        badge: 'Campeã do Ano (Hall da Fama)',
        highlightNote: 'Melhor Desempenho Histórico da Imobiliária',
        isChampion: true
      },
      {
        id: 'brk_2',
        rank: 2,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: 'R$ 84.600.000',
        numericValue: 84600000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: 'Comissão Líquida R$ 2.030.400 · 29 Vendas',
        targetPercent: 135,
        badge: 'Vice-Campeão Anual',
        highlightNote: 'Recordista em Captações Exclusivas no Ano'
      },
      {
        id: 'brk_3',
        rank: 3,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: 'R$ 51.200.000',
        numericValue: 51200000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: 'Comissão Líquida R$ 1.228.800 · 22 Vendas',
        targetPercent: 116,
        badge: '3º Lugar Anual',
        highlightNote: 'Mais Rápido no SLA em Todos os Meses'
      }
    ],
    TRIMESTRE: [
      {
        id: 'brk_1',
        rank: 1,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: 'R$ 38.400.000',
        numericValue: 38400000,
        primaryUnit: 'VGV Trimestral',
        secondaryMetric: 'Comissão R$ 921.600 · 12 Contratos',
        targetPercent: 148,
        badge: 'Líder Q3',
        isChampion: true
      },
      {
        id: 'brk_2',
        rank: 2,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: 'R$ 27.900.000',
        numericValue: 27900000,
        primaryUnit: 'VGV Trimestral',
        secondaryMetric: 'Comissão R$ 669.600 · 9 Contratos',
        targetPercent: 124,
        badge: 'Vice-Líder Q3'
      },
      {
        id: 'brk_3',
        rank: 3,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: 'R$ 16.500.000',
        numericValue: 16500000,
        primaryUnit: 'VGV Trimestral',
        secondaryMetric: 'Comissão R$ 396.000 · 6 Contratos',
        targetPercent: 110,
        badge: '3º Lugar Q3'
      }
    ]
  },
  EQUIPE_CAMPEA: {
    MES: [],
    ANO: [],
    TRIMESTRE: []
  },
  VENDAS_VGV: {
    MES: [
      {
        id: 'v_1',
        rank: 1,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: 'R$ 14.200.000',
        numericValue: 14200000,
        primaryUnit: 'VGV Faturado',
        secondaryMetric: '5 Fechamentos · Ticket Médio R$ 2.84M',
        targetPercent: 154,
        badge: 'Top Vendas',
        highlightNote: 'Fechamento Cobertura Triplex Vila Nova Conceição',
        isChampion: true
      },
      {
        id: 'v_2',
        rank: 2,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: 'R$ 9.800.000',
        numericValue: 9800000,
        primaryUnit: 'VGV Faturado',
        secondaryMetric: '4 Fechamentos · Ticket Médio R$ 2.45M',
        targetPercent: 122,
        badge: 'Vice-Líder VGV',
        highlightNote: '2 Apartamentos no Ed. Vitra Jardins'
      },
      {
        id: 'v_3',
        rank: 3,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: 'R$ 5.400.000',
        numericValue: 5400000,
        primaryUnit: 'VGV Faturado',
        secondaryMetric: '3 Fechamentos · Ticket Médio R$ 1.8M',
        targetPercent: 108,
        badge: '3º Lugar VGV'
      },
      {
        id: 'v_4',
        rank: 4,
        name: 'Marcos Silveira',
        role: 'Corretor Associado',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        primaryValue: 'R$ 3.200.000',
        numericValue: 3200000,
        primaryUnit: 'VGV Faturado',
        secondaryMetric: '2 Fechamentos · Moema Pássaros',
        targetPercent: 95,
        badge: 'Em Destaque'
      },
      {
        id: 'v_5',
        rank: 5,
        name: 'Roberto Silveira',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        primaryValue: 'R$ 2.900.000',
        numericValue: 2900000,
        primaryUnit: 'VGV Faturado',
        secondaryMetric: '1 Fechamento Comercial',
        targetPercent: 88,
        badge: 'Consistente'
      }
    ],
    ANO: [
      {
        id: 'v_1',
        rank: 1,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: 'R$ 112.500.000',
        numericValue: 112500000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: '38 Fechamentos Ganho',
        targetPercent: 168,
        badge: 'Campeã do Ano',
        isChampion: true
      },
      {
        id: 'v_2',
        rank: 2,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: 'R$ 84.600.000',
        numericValue: 84600000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: '29 Fechamentos Ganho',
        targetPercent: 135,
        badge: 'Vice-Campeão Anual'
      },
      {
        id: 'v_3',
        rank: 3,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: 'R$ 51.200.000',
        numericValue: 51200000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: '22 Fechamentos Ganho',
        targetPercent: 116,
        badge: '3º Lugar Anual'
      },
      {
        id: 'v_4',
        rank: 4,
        name: 'Marcos Silveira',
        role: 'Corretor Associado',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        primaryValue: 'R$ 31.800.000',
        numericValue: 31800000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: '14 Fechamentos Ganho',
        targetPercent: 104,
        badge: 'Top Revelação'
      },
      {
        id: 'v_5',
        rank: 5,
        name: 'Roberto Silveira',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        primaryValue: 'R$ 28.400.000',
        numericValue: 28400000,
        primaryUnit: 'VGV Anual',
        secondaryMetric: '11 Fechamentos Ganho',
        targetPercent: 98,
        badge: 'Experiência & Solidez'
      }
    ],
    TRIMESTRE: []
  },
  LOCACOES: {
    MES: [
      {
        id: 'loc_1',
        rank: 1,
        name: 'Beatriz Vasconcelos',
        role: 'Especialista em Locação',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '22 Contratos',
        numericValue: 22,
        primaryUnit: 'Aluguéis Assinados',
        secondaryMetric: 'R$ 96.800/mês locado · Taxa Adm R$ 9.680/mês',
        targetPercent: 146,
        badge: 'Rainha da Locação',
        highlightNote: 'Zero Inadimplência e 100% de Garantia Seguro Fiança Porto & CredPago',
        isChampion: true
      },
      {
        id: 'loc_2',
        rank: 2,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '16 Contratos',
        numericValue: 16,
        primaryUnit: 'Aluguéis Assinados',
        secondaryMetric: 'R$ 64.000/mês locado · Taxa Adm R$ 6.400/mês',
        targetPercent: 120,
        badge: 'Vice-Líder Locações',
        highlightNote: 'Média de 48 horas entre visita e assinatura digital'
      },
      {
        id: 'loc_3',
        rank: 3,
        name: 'Marcos Silveira',
        role: 'Corretor Associado',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        primaryValue: '12 Contratos',
        numericValue: 12,
        primaryUnit: 'Aluguéis Assinados',
        secondaryMetric: 'R$ 48.500/mês locado · Taxa Adm R$ 4.850/mês',
        targetPercent: 105,
        badge: '3º Lugar Locações'
      },
      {
        id: 'loc_4',
        rank: 4,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '7 Contratos',
        numericValue: 7,
        primaryUnit: 'Aluguéis Assinados',
        secondaryMetric: 'R$ 38.000/mês locado · Locação Comercial',
        targetPercent: 88,
        badge: 'Comercial Prime'
      }
    ],
    ANO: [
      {
        id: 'loc_1',
        rank: 1,
        name: 'Beatriz Vasconcelos',
        role: 'Especialista em Locação',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '210 Contratos',
        numericValue: 210,
        primaryUnit: 'Aluguéis no Ano',
        secondaryMetric: 'R$ 940.000/ano em Taxa Adm Recorrente',
        targetPercent: 152,
        badge: 'Campeã Anual Locações',
        isChampion: true
      },
      {
        id: 'loc_2',
        rank: 2,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '148 Contratos',
        numericValue: 148,
        primaryUnit: 'Aluguéis no Ano',
        secondaryMetric: 'R$ 610.000/ano em Taxa Adm Recorrente',
        targetPercent: 124,
        badge: 'Vice-Campeão Anual'
      }
    ],
    TRIMESTRE: []
  },
  ATENDIMENTO_LEADS: {
    MES: [
      {
        id: 'sla_1',
        rank: 1,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '2.8 min',
        numericValue: 2.8,
        primaryUnit: 'Tempo Médio SLA',
        secondaryMetric: '158 Leads Atendidos · 99.4% no Prazo (<5 min)',
        targetPercent: 165,
        badge: '⚡ Raio de Resposta',
        highlightNote: 'Mais Rápido do Salão no Primeiro Contato via WhatsApp Oficial',
        isChampion: true
      },
      {
        id: 'sla_2',
        rank: 2,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '3.6 min',
        numericValue: 3.6,
        primaryUnit: 'Tempo Médio SLA',
        secondaryMetric: '142 Leads Atendidos · 98.1% no Prazo',
        targetPercent: 140,
        badge: 'Alta Eficiência',
        highlightNote: 'Maior taxa de agendamento de visita no 1º contato (38%)'
      },
      {
        id: 'sla_3',
        rank: 3,
        name: 'Beatriz Vasconcelos',
        role: 'Consultora de Vendas',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '5.1 min',
        numericValue: 5.1,
        primaryUnit: 'Tempo Médio SLA',
        secondaryMetric: '118 Leads Atendidos · 96.5% no Prazo',
        targetPercent: 122,
        badge: 'Plantão Ágil'
      },
      {
        id: 'sla_4',
        rank: 4,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '6.4 min',
        numericValue: 6.4,
        primaryUnit: 'Tempo Médio SLA',
        secondaryMetric: '104 Leads Atendidos · 94.0% no Prazo',
        targetPercent: 105,
        badge: 'Consistente'
      }
    ],
    ANO: [
      {
        id: 'sla_1',
        rank: 1,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '2.9 min',
        numericValue: 2.9,
        primaryUnit: 'Média Anual SLA',
        secondaryMetric: '1.640 Leads Convertidos no Ano',
        targetPercent: 170,
        badge: 'Campeão Anual de SLA',
        isChampion: true
      },
      {
        id: 'sla_2',
        rank: 2,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '3.7 min',
        numericValue: 3.7,
        primaryUnit: 'Média Anual SLA',
        secondaryMetric: '1.480 Leads Convertidos no Ano',
        targetPercent: 145,
        badge: 'Vice-Campeã Anual de SLA'
      }
    ],
    TRIMESTRE: []
  },
  CAPTACOES: {
    MES: [
      {
        id: 'cap_1',
        rank: 1,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '19 Imóveis',
        numericValue: 19,
        primaryUnit: 'Captações Ativas',
        secondaryMetric: '14 Exclusividades (74%) · VGC R$ 38.5M',
        targetPercent: 158,
        badge: 'Mestre da Angariação',
        highlightNote: 'Líder Absoluto em Exclusividades nos Jardins e Itaim',
        isChampion: true
      },
      {
        id: 'cap_2',
        rank: 2,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '15 Imóveis',
        numericValue: 15,
        primaryUnit: 'Captações Ativas',
        secondaryMetric: '9 Exclusividades (60%) · VGC R$ 26.2M',
        targetPercent: 128,
        badge: 'Vice-Líder Captação',
        highlightNote: '100% dos Imóveis com Selo Ouro e Fotos Profissionais'
      },
      {
        id: 'cap_3',
        rank: 3,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '11 Imóveis',
        numericValue: 11,
        primaryUnit: 'Captações Ativas',
        secondaryMetric: '6 Exclusividades · VGC R$ 17.8M',
        targetPercent: 104,
        badge: '3º Lugar Captação'
      },
      {
        id: 'cap_4',
        rank: 4,
        name: 'Beatriz Vasconcelos',
        role: 'Consultora de Vendas',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '8 Imóveis',
        numericValue: 8,
        primaryUnit: 'Captações Ativas',
        secondaryMetric: '4 Exclusividades · VGC R$ 12.0M',
        targetPercent: 92,
        badge: 'Foco Locação'
      }
    ],
    ANO: [
      {
        id: 'cap_1',
        rank: 1,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '164 Imóveis',
        numericValue: 164,
        primaryUnit: 'Captações no Ano',
        secondaryMetric: '118 Exclusividades · VGC R$ 340M',
        targetPercent: 162,
        badge: 'Campeão Anual Captações',
        isChampion: true
      },
      {
        id: 'cap_2',
        rank: 2,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '138 Imóveis',
        numericValue: 138,
        primaryUnit: 'Captações no Ano',
        secondaryMetric: '86 Exclusividades · VGC R$ 265M',
        targetPercent: 138,
        badge: 'Vice-Campeã Anual Captações'
      }
    ],
    TRIMESTRE: []
  },
  VISITAS_REALIZADAS: {
    MES: [
      {
        id: 'vis_1',
        rank: 1,
        name: 'Roberto Silveira',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '48 Visitas',
        numericValue: 48,
        primaryUnit: 'Visitas Guiadas',
        secondaryMetric: 'Média de 1.8 visita/dia · 18 Propostas Geradas',
        targetPercent: 160,
        badge: 'Rei da Rua',
        highlightNote: 'Maior presença em campo com 94% de presença no horário agendado',
        isChampion: true
      },
      {
        id: 'vis_2',
        rank: 2,
        name: 'Beatriz Vasconcelos',
        role: 'Consultora Especialista',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '41 Visitas',
        numericValue: 41,
        primaryUnit: 'Visitas Guiadas',
        secondaryMetric: 'Roteiros Inteligentes · 22 Locações Assinadas',
        targetPercent: 138,
        badge: 'Vice-Líder de Visitas',
        highlightNote: 'Excelente índice de conversão de visita para contrato'
      },
      {
        id: 'vis_3',
        rank: 3,
        name: 'Juliana Mendes',
        role: 'Consultora de Vendas',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '36 Visitas',
        numericValue: 36,
        primaryUnit: 'Visitas Guiadas',
        secondaryMetric: 'Alto Padrão · 5 Fechamentos de Compra',
        targetPercent: 120,
        badge: '3º Lugar em Visitas'
      },
      {
        id: 'vis_4',
        rank: 4,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '32 Visitas',
        numericValue: 32,
        primaryUnit: 'Visitas Guiadas',
        secondaryMetric: 'Agendamentos Instantâneos',
        targetPercent: 106,
        badge: 'Muito Ativo'
      }
    ],
    ANO: [
      {
        id: 'vis_1',
        rank: 1,
        name: 'Roberto Silveira',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '480 Visitas',
        numericValue: 480,
        primaryUnit: 'Visitas no Ano',
        secondaryMetric: 'Mais de 160 clientes atendidos presencialmente',
        targetPercent: 155,
        badge: 'Campeão Anual de Visitas',
        isChampion: true
      },
      {
        id: 'vis_2',
        rank: 2,
        name: 'Beatriz Vasconcelos',
        role: 'Consultora Especialista',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '415 Visitas',
        numericValue: 415,
        primaryUnit: 'Visitas no Ano',
        secondaryMetric: 'Alta conversão em locações comerciais e residenciais',
        targetPercent: 135,
        badge: 'Vice-Campeã Anual'
      }
    ],
    TRIMESTRE: []
  },
  LANCAMENTOS: {
    MES: [
      {
        id: 'lanc_1',
        rank: 1,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '6 Unidades',
        numericValue: 6,
        primaryUnit: 'Vendas na Planta',
        secondaryMetric: 'VGV Lançamentos R$ 8.900.000 · Cyrela & Even',
        targetPercent: 150,
        badge: 'Top Lançamentos',
        highlightNote: 'Destaque no Stand do Jardins Signature',
        isChampion: true
      },
      {
        id: 'lanc_2',
        rank: 2,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '4 Unidades',
        numericValue: 4,
        primaryUnit: 'Vendas na Planta',
        secondaryMetric: 'VGV Lançamentos R$ 6.200.000 · JHSF & Gafisa',
        targetPercent: 125,
        badge: 'Vice-Líder Plantão',
        highlightNote: 'Especialista em plantas inteligentes e tabela espelho'
      },
      {
        id: 'lanc_3',
        rank: 3,
        name: 'Marcio Fontes',
        role: 'Parceiro Externo',
        team: 'Fênix Plantão & Lançamentos',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        primaryValue: '3 Unidades',
        numericValue: 3,
        primaryUnit: 'Vendas na Planta',
        secondaryMetric: 'VGV Lançamentos R$ 4.500.000',
        targetPercent: 110,
        badge: '3º Lugar Lançamentos'
      },
      {
        id: 'lanc_4',
        rank: 4,
        name: 'Luciana Prado',
        role: 'Consultora de Plantão',
        team: 'Fênix Plantão & Lançamentos',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        primaryValue: '2 Unidades',
        numericValue: 2,
        primaryUnit: 'Vendas na Planta',
        secondaryMetric: 'VGV Lançamentos R$ 2.800.000',
        targetPercent: 90,
        badge: 'Stand Ativo'
      }
    ],
    ANO: [
      {
        id: 'lanc_1',
        rank: 1,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '42 Unidades',
        numericValue: 42,
        primaryUnit: 'Vendas na Planta/Ano',
        secondaryMetric: 'VGV Acumulado R$ 68.400.000',
        targetPercent: 158,
        badge: 'Campeã Anual Lançamentos',
        isChampion: true
      },
      {
        id: 'lanc_2',
        rank: 2,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '31 Unidades',
        numericValue: 31,
        primaryUnit: 'Vendas na Planta/Ano',
        secondaryMetric: 'VGV Acumulado R$ 48.900.000',
        targetPercent: 130,
        badge: 'Vice-Campeão Anual'
      }
    ],
    TRIMESTRE: []
  },
  USO_CRM: {
    MES: [
      {
        id: 'crm_1',
        rank: 1,
        name: 'Beatriz Vasconcelos',
        role: 'Consultora de Vendas',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '998 pts',
        numericValue: 998,
        primaryUnit: 'Score de Disciplina',
        secondaryMetric: '0 Tarefas Atrasadas · 100% Leads com Histórico',
        targetPercent: 100,
        badge: '⭐ Padrão Ouro de Organização',
        highlightNote: 'Atualização diária do pipeline e registro imediato de propostas',
        isChampion: true
      },
      {
        id: 'crm_2',
        rank: 2,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '986 pts',
        numericValue: 986,
        primaryUnit: 'Score de Disciplina',
        secondaryMetric: '100% de Follow-ups Registrados no Prazo',
        targetPercent: 99,
        badge: 'Vice-Líder CRM',
        highlightNote: 'Excelente documentação de perfis de compradores'
      },
      {
        id: 'crm_3',
        rank: 3,
        name: 'Rodrigo Faro',
        role: 'Corretor Pleno',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '974 pts',
        numericValue: 974,
        primaryUnit: 'Score de Disciplina',
        secondaryMetric: 'Maior volume de notas de áudio e atas de visita',
        targetPercent: 97,
        badge: '3º Lugar CRM'
      },
      {
        id: 'crm_4',
        rank: 4,
        name: 'Carlos Mendes',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '942 pts',
        numericValue: 942,
        primaryUnit: 'Score de Disciplina',
        secondaryMetric: 'Cadastros com fotos em alta resolução',
        targetPercent: 94,
        badge: 'Consistente'
      },
      {
        id: 'crm_5',
        rank: 5,
        name: 'Roberto Silveira',
        role: 'Corretor Sênior',
        team: 'Titanium Luxury Brokers',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        primaryValue: '920 pts',
        numericValue: 920,
        primaryUnit: 'Score de Disciplina',
        secondaryMetric: 'Feedback de visitas 100% preenchido',
        targetPercent: 92,
        badge: 'Em Evolução'
      }
    ],
    ANO: [
      {
        id: 'crm_1',
        rank: 1,
        name: 'Beatriz Vasconcelos',
        role: 'Consultora de Vendas',
        team: 'Vanguard Moema & Jardins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        primaryValue: '995 pts',
        numericValue: 995,
        primaryUnit: 'Média Anual CRM',
        secondaryMetric: 'Zero leads estagnados por mais de 48h durante todo o ano',
        targetPercent: 100,
        badge: 'Campeã Anual CRM',
        isChampion: true
      },
      {
        id: 'crm_2',
        rank: 2,
        name: 'Juliana Mendes',
        role: 'Consultora Especialista',
        team: 'Equipe Alpha Prime',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        primaryValue: '982 pts',
        numericValue: 982,
        primaryUnit: 'Média Anual CRM',
        secondaryMetric: 'Líder em preenchimento de perfil financeiro',
        targetPercent: 98,
        badge: 'Vice-Campeã Anual CRM'
      }
    ],
    TRIMESTRE: []
  },
  MURAL_CONQUISTAS: {
    MES: [],
    ANO: [],
    TRIMESTRE: []
  }
};

// Fill empty periods with sensible fallbacks
(['PODIUM_GERAL', 'EQUIPE_CAMPEA', 'VENDAS_VGV', 'LOCACOES', 'ATENDIMENTO_LEADS', 'CAPTACOES', 'VISITAS_REALIZADAS', 'LANCAMENTOS', 'USO_CRM', 'MURAL_CONQUISTAS'] as TvSlideCategory[]).forEach(cat => {
  if (MOCK_BROKER_RANKINGS[cat] && !MOCK_BROKER_RANKINGS[cat].TRIMESTRE?.length) {
    MOCK_BROKER_RANKINGS[cat].TRIMESTRE = MOCK_BROKER_RANKINGS[cat].MES;
  }
  if (MOCK_BROKER_RANKINGS[cat] && !MOCK_BROKER_RANKINGS[cat].ANO?.length) {
    MOCK_BROKER_RANKINGS[cat].ANO = MOCK_BROKER_RANKINGS[cat].MES;
  }
});

export const MOCK_RECENT_DEALS: RecentDealAlert[] = [
  {
    id: 'deal_1',
    timestamp: 'Há 12 minutos',
    brokerName: 'Juliana Mendes',
    brokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    teamName: 'Equipe Alpha Prime',
    dealType: 'VENDA',
    title: 'Escritura Assinada: Cobertura Duplex 380m²',
    valueFormatted: 'R$ 4.250.000',
    commissionFormatted: 'Comissão Imob: R$ 255.000',
    location: 'Rua Bela Cintra, Jardins - SP'
  },
  {
    id: 'deal_2',
    timestamp: 'Há 34 minutos',
    brokerName: 'Carlos Mendes',
    brokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    teamName: 'Titanium Luxury Brokers',
    dealType: 'CAPTACAO_EXCLUSIVA',
    title: 'Nova Captação Exclusiva: Edifício Vitra',
    valueFormatted: 'VGC R$ 6.800.000',
    commissionFormatted: 'Exclusividade 180 dias',
    location: 'Av. Horácio Lafer, Itaim Bibi - SP'
  },
  {
    id: 'deal_3',
    timestamp: 'Há 1 hora',
    brokerName: 'Beatriz Vasconcelos',
    brokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    teamName: 'Vanguard Moema & Jardins',
    dealType: 'LOCACAO',
    title: 'Contrato de Locação Residencial Fechado',
    valueFormatted: 'R$ 14.500/mês',
    commissionFormatted: 'Garantia Seguro Fiança 100% Aprovada',
    location: 'Alameda dos Maracatins, Moema - SP'
  },
  {
    id: 'deal_4',
    timestamp: 'Há 2 horas',
    brokerName: 'Camila Albuquerque',
    brokerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    teamName: 'Equipe Alpha Prime',
    dealType: 'META_BATIDA',
    title: 'Equipe Alpha Prime bateu 138% da Meta Mensal!',
    valueFormatted: 'R$ 21.850.000 VGV',
    commissionFormatted: 'Bônus de Squad Desbloqueado',
    location: 'Salão de Vendas AcertGo Matriz'
  },
  {
    id: 'deal_5',
    timestamp: 'Há 3 horas',
    brokerName: 'Rodrigo Faro',
    brokerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    teamName: 'Vanguard Moema & Jardins',
    dealType: 'LANCAMENTO',
    title: 'Unidade Vendida no Stand: Jardins Signature',
    valueFormatted: 'R$ 2.450.000',
    commissionFormatted: 'Comissão: R$ 98.000',
    location: 'Stand Incorporadora Cyrela'
  }
];

/**
 * Web Audio API synthesizer for celebratory chimes without external mp3 dependencies
 */
export function playTvChime(soundType: 'victory' | 'bell' | 'tick' = 'victory'): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (soundType === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + index * 0.12);
        osc.stop(ctx.currentTime + index * 0.12 + 0.7);
      });
    } else if (soundType === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.3);
    } else if (soundType === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    }
  } catch {
    // Audio Context might be blocked until user gesture, safe to ignore
  }
}

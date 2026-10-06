import { LMSCourse, LMSLeaderboardStudent } from '../types/crm';

export const INITIAL_EXTENDED_LMS_COURSES: LMSCourse[] = [
  // ==========================================
  // CURSOS OFICIAIS DA PLATAFORMA ACERTGO
  // ==========================================
  {
    id: 'course_alto_padrao',
    title: 'Mestrado em Negociação & Fechamento de Alto Padrão',
    category: 'ALTO_PADRAO',
    source: 'PLATAFORMA_ACERTGO',
    durationMinutes: 180,
    lessonsCount: 8,
    completedByCount: 142,
    hasAudioPodcast: true,
    podcastAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    summary: 'Técnicas avançadas de rapport, linguagem corporal, leitura de perfil patrimonial ultra-wealthy e condução de visitas em coberturas e mansões sem ansiedade de comissão.',
    instructor: 'Dr. Roberto Silveira',
    instructorRole: 'Master Closer & Especialista Jardins',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    xpPoints: 500,
    badgeName: 'Closer de Alto Padrão',
    badgeIcon: 'Award',
    rating: 4.9,
    level: 'AVANCADO',
    tags: ['Luxo', 'Negociação', 'UHNW', 'Fechamento'],
    isEnrolled: true,
    progressPercent: 62,
    modules: [
      {
        id: 'mod_1',
        title: 'Módulo 1: Perfil do Comprador de Alta Renda',
        lessons: [
          {
            id: 'les_1_1',
            title: '1. Decodificando o Cliente Ultra-Wealthy (UHNW)',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como entender as prioridades de privacidade, segurança, liquidez e status sem fazer perguntas invasivas.',
            isCompleted: true
          },
          {
            id: 'les_1_2',
            title: '2. Etiqueta, Postura e Elegância em Visitas de Luxo',
            durationMinutes: 25,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Código de vestimenta, pontualidade britânica, recepção com espumante e roteiro sensorial no imóvel.',
            isCompleted: true
          }
        ]
      },
      {
        id: 'mod_2',
        title: 'Módulo 2: Negociação e Condução de Propostas',
        lessons: [
          {
            id: 'les_2_1',
            title: '3. A Arte do Silêncio e Argumentação Baseada em Escassez',
            durationMinutes: 28,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como apresentar o valor do metro quadrado exclusivo e transformar objeções de preço em valorização de patrimônio.',
            isCompleted: true
          },
          {
            id: 'les_2_2',
            title: '4. Mesa de Fechamento com Jurídico e Family Offices',
            durationMinutes: 30,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Condução serena da minuta de compra e venda quando advogados das duas partes entram na negociação.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Qual é o maior motivador de compra de um cliente do segmento Super Luxo?',
        options: [
          'Preço por metro quadrado abaixo do mercado com desconto agressivo',
          'Exclusividade, localização irreplicável, privacidade e segurança familiar',
          'Financiamento bancário com parcelas longas',
          'Urgência do proprietário em vender rápido'
        ],
        correctOptionIndex: 1,
        explanation: 'Clientes de alta renda compram escassez, localização consagrada e proteção patrimonial; o preço é secundário em relação à exclusividade.'
      },
      {
        id: 'q2',
        question: 'Durante a visita a uma mansão, o cliente faz uma objeção sobre o valor do condomínio. Qual é a melhor resposta consultiva?',
        options: [
          'Dizer que o condomínio é barato comparado a outros',
          'Reconhecer o ponto e contextualizar os serviços inclusos: segurança armada 24h, clube privativo e manutenção impecável que valorizam o ativo',
          'Tentar mudar de assunto imediatamente para não perder a venda',
          'Sugerir que o cliente procure um imóvel mais modesto'
        ],
        correctOptionIndex: 1,
        explanation: 'Contextualizar a taxa condominial como investimento em proteção patrimonial e conveniência transforma o custo em benefício tangível.'
      }
    ],
    downloadMaterials: [
      { title: 'Playbook Oficial de Atendimento Alto Padrão AcertGo.pdf', type: 'PDF', size: '3.4 MB' },
      { title: 'Checklist de Vistoria Sensorial para Imóveis Exclusivos.pdf', type: 'PDF', size: '1.2 MB' }
    ]
  },
  {
    id: 'course_financiamento',
    title: 'Esteira Completa de Financiamento Imobiliário (Caixa, Itaú & Santander)',
    category: 'FINANCIAMENTO',
    source: 'PLATAFORMA_ACERTGO',
    durationMinutes: 120,
    lessonsCount: 6,
    completedByCount: 215,
    hasAudioPodcast: true,
    podcastAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    summary: 'Domine simulações SAC x Price, composição de renda familiar, esteira de análise de risco bancária e como destravar crédito de clientes em menos de 24 horas.',
    instructor: 'Vanessa Nogueira',
    instructorRole: 'Head de Correspondente Bancário (CCA) & Fintech',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    xpPoints: 400,
    badgeName: 'Expert em Crédito Bancário',
    badgeIcon: 'Building',
    rating: 4.8,
    level: 'INTERMEDIARIO',
    tags: ['Crédito', 'Bancos', 'Simulação', 'Financiamento'],
    isEnrolled: true,
    progressPercent: 100,
    certificateIssued: true,
    modules: [
      {
        id: 'mod_fin_1',
        title: 'Módulo 1: Sistemas de Amortização & Taxas',
        lessons: [
          {
            id: 'les_f1',
            title: '1. SAC vs Tabela Price na Prática para o Cliente',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como explicar a diferença entre parcelas decrescentes e fixas sem complicar a vida do comprador.',
            isCompleted: true
          },
          {
            id: 'les_f2',
            title: '2. Uso do FGTS: Regras do SFH e Desbloqueio Rápido',
            durationMinutes: 25,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Limites do SFH, interstício de 3 anos e como amortizar parcelas com o fundo de garantia.',
            isCompleted: true
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_fin_1',
        question: 'Qual é a principal característica do sistema de amortização SAC?',
        options: [
          'Parcelas fixas do início ao fim do contrato',
          'Parcelas decrescentes com amortização constante do saldo devedor',
          'Não permite uso do FGTS',
          'Juros crescentes mês a mês'
        ],
        correctOptionIndex: 1,
        explanation: 'No Sistema de Amortização Constante (SAC), o valor amortizado da dívida é constante todo mês, reduzindo os juros e gerando parcelas decrescentes.'
      }
    ],
    downloadMaterials: [
      { title: 'Tabela Comparativa de Taxas de Financiamento 2026.pdf', type: 'PDF', size: '2.1 MB' },
      { title: 'Checklist Documental para Aprovação em 24h.pdf', type: 'PDF', size: '890 KB' }
    ]
  },
  {
    id: 'course_juridico_contratos',
    title: 'Segurança Jurídica & Gestão de Contratos de Locação sem Conflitos',
    category: 'JURIDICO',
    source: 'PLATAFORMA_ACERTGO',
    durationMinutes: 110,
    lessonsCount: 5,
    completedByCount: 164,
    hasAudioPodcast: false,
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    summary: 'Aprenda como blindar os contratos de locação da imobiliária com Lei do Inquilinato (8.245/91), garantias locatícias modernas (Seguro Fiança CredPago e Porto) e vistoria fotográfica.',
    instructor: 'Dra. Patrícia Fontes',
    instructorRole: 'Assessora Jurídica Imobiliária & Especialista OAB',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    xpPoints: 350,
    badgeName: 'Guardião Jurídico',
    badgeIcon: '⚖️',
    rating: 4.9,
    level: 'AVANCADO',
    tags: ['Direito Imobiliário', 'Locação', 'Lei 8245', 'Contratos'],
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      {
        id: 'mod_jur_1',
        title: 'Módulo 1: Garantias e Vistoria Inviolável',
        lessons: [
          {
            id: 'les_j1',
            title: '1. Vistoria de Entrada com Laudo Fotográfico e Assinatura Digital',
            durationMinutes: 24,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como documentar o estado de conservação para eliminar litígios na devolução de chaves.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_jur_1',
        question: 'Segundo a Lei do Inquilinato, quantas modalidades de garantia locatícia podem ser exigidas no mesmo contrato?',
        options: [
          'Duas garantias simultâneas (ex: Fiador + Caução)',
          'Apenas UMA única modalidade de garantia (exigir mais de uma é contravenção penal)',
          'Quantas o proprietário achar necessário',
          'Nenhuma é obrigatória'
        ],
        correctOptionIndex: 1,
        explanation: 'O artigo 37, parágrafo único, da Lei 8.245/91 proíbe terminantemente mais de uma modalidade de garantia num mesmo contrato de locação.'
      }
    ],
    downloadMaterials: [
      { title: 'Modelo Padrão de Contrato de Locação Residencial AcertGo.pdf', type: 'PDF', size: '1.5 MB' }
    ]
  },
  {
    id: 'course_marketing_digital',
    title: 'Captação Digital & Tráfego Pago no Instagram e TikTok para Corretores',
    category: 'MARKETING',
    source: 'PLATAFORMA_ACERTGO',
    durationMinutes: 140,
    lessonsCount: 6,
    completedByCount: 198,
    hasAudioPodcast: true,
    podcastAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    summary: 'Como criar anúncios no Meta Ads com segmentação por CEP nobre, vídeos de tour cinematográfico com smartphone e campanhas que geram leads qualificados a menos de R$ 15.',
    instructor: 'Lucas Andrade',
    instructorRole: 'Head de Growth & Tráfego Imobiliário',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    xpPoints: 420,
    badgeName: 'Mestre do Tráfego Digital',
    badgeIcon: 'Phone',
    rating: 4.9,
    level: 'INTERMEDIARIO',
    tags: ['Meta Ads', 'Instagram', 'Leads', 'Tour Virtual'],
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      {
        id: 'mod_mkt_1',
        title: 'Módulo 1: Vídeos de Tour Imobiliário com Smartphone',
        lessons: [
          {
            id: 'les_mkt_1',
            title: '1. Iluminação, Roteiro e Apresentação Dinâmica do Imóvel',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Técnicas práticas de gravação sem equipamento caro que retêm a atenção nos primeiros 3 segundos.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_mkt_1',
        question: 'Qual é o elemento mais importante nos primeiros 3 segundos de um vídeo imobiliário no Instagram Reels?',
        options: [
          'O logotipo da imobiliária e o número do CRECI em tela cheia',
          'Um gancho visual ou sensorial forte (ex: a vista da varanda, pé-direito duplo ou pergunta intrigante)',
          'Música alta sem fala',
          'O valor total do condomínio'
        ],
        correctOptionIndex: 1,
        explanation: 'O gancho nos primeiros 3 segundos é decisivo para reter o público antes que ele deslize para o próximo vídeo.'
      }
    ],
    downloadMaterials: [
      { title: 'Guia de Roteiros de Vídeos Curtos para Vendas.pdf', type: 'PDF', size: '2.8 MB' }
    ]
  },
  {
    id: 'course_atendimento_whatsapp',
    title: 'WhatsApp Imobiliário de Alta Conversão & Agendamento Rápido de Visitas',
    category: 'ATENDIMENTO',
    source: 'PLATAFORMA_ACERTGO',
    durationMinutes: 90,
    lessonsCount: 4,
    completedByCount: 310,
    hasAudioPodcast: true,
    podcastAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    coverImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80',
    summary: 'Scripts comprovados para transformar curiosos em visitas presenciais em até 4 mensagens, com técnicas de qualificação sem interrogatório e uso de áudios estratégicos.',
    instructor: 'Juliana Mendes',
    instructorRole: 'Top Producer & Embaixadora Comercial',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    xpPoints: 350,
    badgeName: 'Closer no WhatsApp',
    badgeIcon: 'MessageSquare',
    rating: 5.0,
    level: 'INICIANTE',
    tags: ['WhatsApp', 'SDR', 'Agendamento', 'Conversão'],
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      {
        id: 'mod_wpp_1',
        title: 'Módulo 1: O Primeiro Contato em Menos de 15 Minutos',
        lessons: [
          {
            id: 'les_w1',
            title: '1. A Mensagem de Abertura que Não Parece Robô',
            durationMinutes: 18,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como saudar mencionando exatamente o imóvel de interesse e gerando resposta imediata.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_w1',
        question: 'Qual é a melhor abordagem ao responder um lead que pergunta apenas "Qual o valor?"',
        options: [
          'Informar o valor e encerrar a mensagem',
          'Informar com transparência o valor do imóvel e emendar uma pergunta de qualificação leve (ex: "Você busca para morar ou investimento?")',
          'Não informar o valor até ele passar o telefone',
          'Mandar um áudio de 5 minutos'
        ],
        correctOptionIndex: 1,
        explanation: 'Transparência gera confiança; responder o valor e fazer uma pergunta aberta mantém a conversa ativa sem atrito.'
      }
    ],
    downloadMaterials: [
      { title: 'Templates de Scripts para WhatsApp Imobiliário.pdf', type: 'PDF', size: '1.9 MB' }
    ]
  },

  // ==========================================
  // TREINAMENTOS DA PRÓPRIA IMOBILIÁRIA (INTERNOS)
  // ==========================================
  {
    id: 'course_onboarding_imobiliaria',
    title: 'Onboarding & Cultura da Imobiliária: O Jeito AcertGo de Encantar',
    category: 'VENDAS',
    source: 'IMOBILIARIA_INTERNO',
    durationMinutes: 75,
    lessonsCount: 4,
    completedByCount: 88,
    hasAudioPodcast: true,
    podcastAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    summary: 'Treinamento interno obrigatório para corretores associados da AcertGo. Normas de conduta no plantão, uso do CRM no celular, regras de divisão de comissão e padrão visual da marca.',
    instructor: 'Emerson Carneiro',
    instructorRole: 'Diretor Geral & Fundador da Imobiliária',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    xpPoints: 300,
    badgeName: 'Embaixador AcertGo',
    badgeIcon: '⭐',
    rating: 4.9,
    level: 'INICIANTE',
    tags: ['Cultura', 'Regimento Interno', 'Comissão', 'CRM'],
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      {
        id: 'mod_onb_1',
        title: 'Módulo 1: A Essência AcertGo',
        lessons: [
          {
            id: 'les_o1',
            title: '1. Nossa Missão, Valores e o Padrão de Excelência Jardins',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como nos posicionamos como consultores patrimoniais e não meros corretores transacionais.',
            isCompleted: false
          },
          {
            id: 'les_o2',
            title: '2. Rotina Diária no CRM: Atualização de Fases e Roleta',
            durationMinutes: 25,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Regra de ouro de 15 minutos para primeiro contato e alimentação dos follow-ups no app.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_onb_1',
        question: 'Qual é o prazo máximo de primeiro contato estabelecido no SLA da AcertGo ao receber um lead da Roleta?',
        options: [
          'Em até 2 horas úteis',
          'Em até 15 minutos (com mensagem personalizada no WhatsApp)',
          'No final do dia de trabalho',
          'Apenas no dia seguinte se for à tarde'
        ],
        correctOptionIndex: 1,
        explanation: 'Leads contatados nos primeiros 15 minutos possuem 400% mais chance de conversão e agendamento de visita.'
      }
    ],
    downloadMaterials: [
      { title: 'Manual de Boas Práticas do Corretor AcertGo.pdf', type: 'PDF', size: '4.8 MB' }
    ]
  },
  {
    id: 'course_lancamento_jardins_one',
    title: 'Treinamento de Produto: Lançamento Jardins One & Sky Lounge',
    category: 'ALTO_PADRAO',
    source: 'IMOBILIARIA_INTERNO',
    durationMinutes: 50,
    lessonsCount: 3,
    completedByCount: 52,
    hasAudioPodcast: true,
    podcastAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    summary: 'Apresentação detalhada da planta das unidades, memorial descritivo, condições de fluxo de pagamento durante as obras, comissão de 4% e argumentos de vendas para investidores.',
    instructor: 'Marcos Vinicius',
    instructorRole: 'Coordenador do Empreendimento & Cyrela Parcerias',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    xpPoints: 250,
    badgeName: 'Especialista Jardins One',
    badgeIcon: 'Building2',
    rating: 4.8,
    level: 'INTERMEDIARIO',
    tags: ['Lançamento', 'Cyrela', 'Plantas', 'Tabela de Vendas'],
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      {
        id: 'mod_j1',
        title: 'Módulo 1: Plantas e Diferenciais Construtivos',
        lessons: [
          {
            id: 'les_j1_1',
            title: '1. Apresentação da Maquete 3D e Penthouses da Torre Horizon',
            durationMinutes: 18,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Conheça o pé-direito duplo, as garagens com ponto para carro elétrico e a vista definitiva.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_j1',
        question: 'Qual é o percentual de fluxo de pagamento previsto durante o período de obras no Jardins One?',
        options: [
          '10% obras e 90% chaves',
          '35% no período de obras e 65% na entrega das chaves via financiamento',
          '100% à vista no lançamento',
          '50% de entrada imediata'
        ],
        correctOptionIndex: 1,
        explanation: 'O fluxo padrão prevê 35% pulverizado durante o cronograma físico de obras e 65% liquidado na entrega das chaves.'
      }
    ],
    downloadMaterials: [
      { title: 'Tabela de Vendas Oficial Jardins One.pdf', type: 'PDF', size: '5.2 MB' },
      { title: 'Book de Arquitetura e Decoração Cyrela.pdf', type: 'PDF', size: '12.0 MB' }
    ]
  },
  {
    id: 'course_plantao_stand_vendas',
    title: 'Manual do Stand de Vendas: Check-in GPS 10m, Roleta e Abordagem Presencial',
    category: 'VENDAS',
    source: 'IMOBILIARIA_INTERNO',
    durationMinutes: 60,
    lessonsCount: 4,
    completedByCount: 64,
    hasAudioPodcast: true,
    podcastAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    summary: 'Instruções oficiais sobre a escala de plantão da imobiliária, validação de presença por satélite no raio de 10 metros, regras de ausência tolerada de 15 minutos e acolhimento do cliente na recepção.',
    instructor: 'Emerson Carneiro',
    instructorRole: 'Diretor de Operações AcertGo',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    xpPoints: 300,
    badgeName: 'Mestre do Plantão de Vendas',
    badgeIcon: 'MapPin',
    rating: 4.9,
    level: 'INICIANTE',
    tags: ['Stand', 'GPS', 'Plantão', 'Recepção'],
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      {
        id: 'mod_std_1',
        title: 'Módulo 1: Regras do Cercamento Eletrônico & Urna do Sorteio',
        lessons: [
          {
            id: 'les_std_1',
            title: '1. Como Funciona o Check-in GPS no Raio de 10m',
            durationMinutes: 15,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Validação pelo navegador do celular e horário limite do sorteio diário às 08:30.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_std_1',
        question: 'O que acontece com o corretor que precisa sair do stand para almoçar ou ir ao sanitário?',
        options: [
          'Ele é excluído permanentemente da escala da semana',
          'Deve acionar "Registrar Ausência" no app, contando com a tolerância de até 15 minutos sem perder sua posição',
          'Pede para o colega atender e dividir a comissão',
          'Sai sem avisar o sistema'
        ],
        correctOptionIndex: 1,
        explanation: 'O botão de ausência pausa temporariamente a fila pelo tempo configurado sem gerar penalidade ao corretor.'
      }
    ],
    downloadMaterials: [
      { title: 'Regulamento de Plantões e Stands AcertGo.pdf', type: 'PDF', size: '2.4 MB' }
    ]
  },
  {
    id: 'course_vistoria_locacao_interna',
    title: 'POP de Vistorias Fotográficas, Chaves & Repasses da Imobiliária',
    category: 'JURIDICO',
    source: 'IMOBILIARIA_INTERNO',
    durationMinutes: 45,
    lessonsCount: 3,
    completedByCount: 47,
    hasAudioPodcast: false,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
    summary: 'Procedimento Operacional Padrão da AcertGo para realização de vistorias com fotos de alta resolução, guarda de chaves no claviculário eletrônico e fluxo do Split de comissão e repasse.',
    instructor: 'Dra. Patrícia Fontes',
    instructorRole: 'Jurídico Interno AcertGo',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    xpPoints: 200,
    badgeName: 'Especialista em Vistoria',
    badgeIcon: 'Key',
    rating: 4.7,
    level: 'INICIANTE',
    tags: ['Vistoria', 'Claviculário', 'Locação', 'POP'],
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      {
        id: 'mod_vis_1',
        title: 'Módulo 1: Padrão Fotográfico por Cômodo',
        lessons: [
          {
            id: 'les_v1',
            title: '1. Fotografando Pintura, Esquadrias, Louças e Elétrica',
            durationMinutes: 15,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Ângulos corretos e anotação imediata de avarias pré-existentes.',
            isCompleted: false
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q_v1',
        question: 'Quantas fotos mínimas por cômodo são exigidas no protocolo de vistoria da imobiliária?',
        options: [
          'Apenas 1 foto geral',
          'No mínimo 4 fotos (visão geral, teto, piso e detalhes de portas/janelas)',
          'Nenhuma se o imóvel for novo',
          'Fotos são opcionais'
        ],
        correctOptionIndex: 1,
        explanation: 'A documentação completa dos 4 ângulos elimina discussões e contestações no momento da desocupação.'
      }
    ],
    downloadMaterials: [
      { title: 'Checklist Prático de Vistoria de Imóveis.pdf', type: 'PDF', size: '1.1 MB' }
    ]
  }
];

// ==========================================
// GAMIFICAÇÃO: RANKING DOS CORRETORES
// ==========================================
export const INITIAL_LMS_LEADERBOARD: LMSLeaderboardStudent[] = [
  {
    rank: 1,
    id: 'u_lead_1',
    name: 'Juliana Mendes',
    role: 'Corretora de Alto Padrão',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    levelTitle: 'Nível 5 · Master Closer',
    levelNumber: 5,
    totalXp: 1850,
    completedCoursesCount: 6,
    badgesCount: 5,
    streakDays: 14
  },
  {
    rank: 2,
    id: 'u_lead_2',
    name: 'Thiago Martins',
    role: 'Especialista em Financiamento & CCA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    levelTitle: 'Nível 4 · Expert em Crédito',
    levelNumber: 4,
    totalXp: 1420,
    completedCoursesCount: 4,
    badgesCount: 3,
    streakDays: 9
  },
  {
    rank: 3,
    id: 'u_lead_3',
    name: 'Fernanda Lima',
    role: 'Consultora de Locação & Jurídico',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    levelTitle: 'Nível 3 · Especialista Locação',
    levelNumber: 3,
    totalXp: 1100,
    completedCoursesCount: 3,
    badgesCount: 3,
    streakDays: 6
  },
  {
    rank: 4,
    id: 'u_lead_4',
    name: 'Rodrigo Faro',
    role: 'Corretor de Terceiros',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    levelTitle: 'Nível 2 · Em Desenvolvimento',
    levelNumber: 2,
    totalXp: 850,
    completedCoursesCount: 2,
    badgesCount: 2,
    streakDays: 4
  },
  {
    rank: 5,
    id: 'u_lead_5',
    name: 'Camila Rossi',
    role: 'Corretora Júnior Onboarding',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    levelTitle: 'Nível 1 · Iniciante Talentosa',
    levelNumber: 1,
    totalXp: 500,
    completedCoursesCount: 1,
    badgesCount: 1,
    streakDays: 2
  }
];

export const INITIAL_STUDENT_BADGES = [
  { id: 'b1', name: 'Closer de Alto Padrão', category: 'Vendas', date: 'Há 5 dias', unlocked: true },
  { id: 'b2', name: 'Expert em Crédito Bancário', category: 'Financiamento', date: 'Há 12 dias', unlocked: true },
  { id: 'b3', name: '⚖️ Guardião Jurídico', category: 'Contratos', date: 'Bloqueado', unlocked: false },
  { id: 'b4', name: '⭐ Embaixador AcertGo', category: 'Cultura', date: 'Bloqueado', unlocked: false },
  { id: 'b5', name: 'Especialista Jardins One', category: 'Lançamentos', date: 'Bloqueado', unlocked: false }
];

import { LaunchDevelopment } from '../types/launches';

export const MOCK_LAUNCH_DEVELOPMENTS: LaunchDevelopment[] = [
  {
    id: 'dev_jardins_one',
    code: 'LANC-JARDINS-01',
    title: 'Residencial Jardins One & Sky Lounge',
    tagline: 'O novo marco do alto padrão nos Jardins com vista eterna para o skyline',
    builderName: 'Cyrela Construtora S.A.',
    developerName: 'AcertGo & Cyrela Incorporações',
    incorporationRegistryNumber: 'R.3/184.920 no 14º CRI de São Paulo',
    neighborhood: 'Jardins / Cerqueira César',
    city: 'São Paulo',
    state: 'SP',
    address: 'Alameda Campinas, 1280 - Jardins, São Paulo - SP',
    deliveryDate: 'Dezembro / 2027',
    status: 'OBRAS_ACELERADAS',
    totalUnits: 48,
    availableUnits: 22,
    reservedUnits: 8,
    soldUnits: 18,
    blockedUnits: 0,
    bannerUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&auto=format&fit=crop&q=80',
    videoTourUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    virtualTour360Url: 'https://matterport.com/discover/space/high-end-penthouse',
    towers: ['Torre Alpha (Park View)', 'Torre Horizon (Sky)'],
    renderGallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80'
    ],
    technicalSheet: {
      totalTowers: 2,
      totalFloors: 16,
      unitsPerFloor: 2,
      totalLandAreaM2: 4800,
      architect: 'Arthur Casas Arquitetura',
      interiorDesigner: 'Fernanda Marques Interiores',
      landscapeArchitect: 'Benedito Abbud Paisagismo',
      totalElevators: 4, // 2 sociais privativos + 2 serviços
      parkingType: 'DETERMINADAS',
      electricCarCharger: true,
      typologies: [
        'Penthouse Duplex 4 Suítes (320m²)',
        '3 Suítes Master (185m²)',
        '3 Dorms com 2 Suítes (142m²)',
        '2 Suítes Garden View (105m²)'
      ],
      amenities: [
        'Piscina com Raia Olímpica 25m Aquecida',
        'Rooftop Sky Lounge com Vista 360°',
        'Academia Assinada com Equipamentos Life Fitness',
        'Spa & Sauna Úmida com Sala de Massagem',
        'Quadra de Tênis Oficial de Saibro',
        'Espaço Gourmet com Forno de Pizza à Lenha',
        'Wine Bar Climatizado com Lockers Privativos',
        'Coworking Executivo com Salas de Reunião Acústicas',
        'Pet Place com Agility e Dog Wash',
        'Delivery Space com Armários Refrigerados'
      ],
      securityFeatures: [
        'Portaria Blindada Nível III-A com Clausura Dupla',
        'Reconhecimento Facial em todos os acessos',
        'Circuito Fechado de TV com IA para detecção perimetral',
        'Elevadores Sociais com Biometria e Acesso Restrito'
      ],
      sustainability: [
        'Certificação LEED Gold de Eficiência Energética',
        'Ponto individual para recarga de veículo elétrico',
        'Reaproveitamento de águas pluviais para irrigação',
        'Placas solares fotovoltaicas para iluminação comum'
      ]
    },
    constructionStage: {
      overallPercent: 54,
      foundationPercent: 100,
      structurePercent: 92,
      masonryPercent: 78,
      installationsPercent: 46,
      finishingPercent: 28,
      paintingPercent: 14,
      landscapingPercent: 5,
      lastUpdatedDate: '15/09/2026',
      supervisorName: 'Eng. Renato Calheiros (CREA 506.912/SP)',
      notes: 'Estrutura da Torre Alpha concretada até a laje do 15º pavimento. Instalações elétricas e hidráulicas avançando no 8º andar conforme cronograma.',
      photos: [
        {
          id: 'cp_1',
          stageName: 'Concretagem da Laje de Cobertura',
          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=800&auto=format&fit=crop&q=80',
          caption: 'Conclusão da laje da Torre Alpha com vista para o skyline',
          date: 'Setembro 2026'
        },
        {
          id: 'cp_2',
          stageName: 'Alvenaria e Vedação',
          imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
          caption: 'Fechamento de paredes em blocos cerâmicos no 10º pavimento',
          date: 'Agosto 2026'
        },
        {
          id: 'cp_3',
          stageName: 'Instalações Hidráulicas e Shafts',
          imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
          caption: 'Tubulações acústicas silenciosas Tigre Redux instaladas',
          date: 'Julho 2026'
        }
      ]
    },
    commissionRules: {
      totalPercent: 5.0,
      brokerPercent: 2.3,
      agencyPercent: 2.2,
      managerPercent: 0.5,
      bonusPrizeText: 'Bônus especial de R$ 15.000 em PIX no fechamento das unidades de 185m² este mês',
      paymentTerms: '50% do valor da comissão liberado na compensação do sinal; 50% após emissão e assinatura do contrato de promessa de compra e venda.',
      contractorVgvGoal: 85000000
    },
    floorPlans: [
      {
        id: 'fp_penthouse',
        typologyName: 'Penthouse Duplex 4 Suítes',
        privateAreaM2: 320,
        bedrooms: 4,
        suites: 4,
        parkingSpaces: 4,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
        blueprintHighResUrl: 'https://acertimob.com.br/plantas/jardins_penthouse_320m.pdf',
        description: 'Planta duplex com piscina privativa, terraço gourmet e suíte master com 2 banheiros e walk-in closet.'
      },
      {
        id: 'fp_3suites',
        typologyName: 'Apartamento Tipo 3 Suítes Master',
        privateAreaM2: 185,
        bedrooms: 3,
        suites: 3,
        parkingSpaces: 3,
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
        blueprintHighResUrl: 'https://acertimob.com.br/plantas/jardins_tipo_185m.pdf',
        description: 'Living amplo integrado com terraço gourmet, elevador social privativo com biometria e dependência completa de serviço.'
      },
      {
        id: 'fp_3dorms',
        typologyName: 'Apartamento Tipo 3 Dorms (2 Suítes)',
        privateAreaM2: 142,
        bedrooms: 3,
        suites: 2,
        parkingSpaces: 2,
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
        blueprintHighResUrl: 'https://acertimob.com.br/plantas/jardins_tipo_142m.pdf',
        description: 'Planta flexível com opção de sala ampliada ou home office, churrasqueira a carvão e ponto para adega climatizada.'
      },
      {
        id: 'fp_garden',
        typologyName: 'Garden Residence com Pátio Privativo',
        privateAreaM2: 240,
        bedrooms: 3,
        suites: 3,
        parkingSpaces: 3,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80',
        blueprintHighResUrl: 'https://acertimob.com.br/plantas/jardins_garden_240m.pdf',
        description: 'Sensação de morar em uma casa com jardim privativo, deck de madeira, spa e total segurança de condomínio vertical.'
      }
    ],
    documents: [
      {
        id: 'doc_1',
        title: 'Book Oficial de Apresentação e Perspectivas 3D (PDF)',
        category: 'LIVRO_DO_PRODUTO',
        fileUrl: 'https://acertimob.com.br/downloads/jardins_one_book_oficial.pdf',
        fileSizeMb: '42.8 MB',
        uploadedAt: '01/09/2026'
      },
      {
        id: 'doc_2',
        title: 'Tabela de Vendas e Fluxo Financeiro Oficial (Vigência 2026)',
        category: 'TABELA_OFICIAL',
        fileUrl: 'https://acertimob.com.br/downloads/tabela_jardins_one_setembro26.xlsx',
        fileSizeMb: '2.4 MB',
        uploadedAt: '10/09/2026'
      },
      {
        id: 'doc_3',
        title: 'Memorial Descritivo e Acabamentos da Construtora',
        category: 'MEMORIAL_DESCRITIVO',
        fileUrl: 'https://acertimob.com.br/downloads/memorial_descritivo_jardins.pdf',
        fileSizeMb: '18.1 MB',
        uploadedAt: '15/08/2026'
      },
      {
        id: 'doc_4',
        title: 'Certidão de Registro de Incorporação (RI) e Matrícula-Mãe',
        category: 'REGISTRO_INCORPORACAO',
        fileUrl: 'https://acertimob.com.br/downloads/ri_cartorio_jardins.pdf',
        fileSizeMb: '8.7 MB',
        uploadedAt: '12/07/2026'
      }
    ],
    salesTableConfig: {
      tableCode: 'TAB-JARDINS-SET26',
      validUntil: '31/10/2026',
      inccAnnualEstimate: 5.2,
      signalPercent: 10,
      thirtyDaysPercent: 5,
      sixtyDaysPercent: 5,
      monthlyInstallmentsCount: 28,
      monthlyInstallmentsTotalPercent: 15,
      semiAnnualInstallmentsCount: 4,
      semiAnnualInstallmentsTotalPercent: 10,
      keysDeliveryPercent: 15,
      bankFinancingPercent: 40,
      specialCashDiscountPercent: 8.5
    },
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

      // Torre Horizon - Andar 15 (Penthouses)
      { id: 'u_hz_1501', developmentId: 'dev_jardins_one', tower: 'Torre Horizon (Sky)', floor: 15, unitNumber: '1501-H', typology: 'Penthouse Duplex 4 Suítes', privateAreaM2: 320, parkingSpaces: 4, sunOrientation: 'MANHA', price: 4950000, condoFee: 3200, iptuFee: 1100, status: 'DISPONIVEL' },
      { id: 'u_hz_1502', developmentId: 'dev_jardins_one', tower: 'Torre Horizon (Sky)', floor: 15, unitNumber: '1502-H', typology: 'Penthouse Duplex 4 Suítes', privateAreaM2: 320, parkingSpaces: 4, sunOrientation: 'TARDE', price: 4890000, condoFee: 3200, iptuFee: 1100, status: 'VENDIDO' },

      // Torre Horizon - Andar 12
      { id: 'u_hz_1201', developmentId: 'dev_jardins_one', tower: 'Torre Horizon (Sky)', floor: 12, unitNumber: '1201-H', typology: '3 Suítes Master', privateAreaM2: 185, parkingSpaces: 3, sunOrientation: 'MANHA', price: 2890000, condoFee: 1900, iptuFee: 650, status: 'DISPONIVEL' },
      { id: 'u_hz_1202', developmentId: 'dev_jardins_one', tower: 'Torre Horizon (Sky)', floor: 12, unitNumber: '1202-H', typology: '3 Suítes Master', privateAreaM2: 185, parkingSpaces: 3, sunOrientation: 'TARDE', price: 2850000, condoFee: 1900, iptuFee: 650, status: 'DISPONIVEL' }
    ],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'dev_horizonte_pinheiros',
    code: 'LANC-PINHEIROS-02',
    title: 'Horizonte Pinheiros Signature Residences',
    tagline: 'Design autoral a poucos passos da Faria Lima e da Praça Panamericana',
    builderName: 'Even Construtora e Incorporadora',
    developerName: 'Even & SP Urbanismo',
    incorporationRegistryNumber: 'R.5/214.301 no 18º CRI de São Paulo',
    neighborhood: 'Pinheiros / Alto de Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua dos Pinheiros, 1140 - Pinheiros, São Paulo - SP',
    deliveryDate: 'Junho / 2028',
    status: 'LANCAMENTO_OFICIAL',
    totalUnits: 64,
    availableUnits: 38,
    reservedUnits: 12,
    soldUnits: 14,
    blockedUnits: 0,
    bannerUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80',
    videoTourUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    towers: ['Torre Única Signature'],
    renderGallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80'
    ],
    technicalSheet: {
      totalTowers: 1,
      totalFloors: 22,
      unitsPerFloor: 3,
      totalLandAreaM2: 3200,
      architect: 'Kogan Studio MK27',
      interiorDesigner: 'Jader Almeida Interiores',
      landscapeArchitect: 'Burle Marx Paisagismo',
      totalElevators: 3,
      parkingType: 'DETERMINADAS',
      electricCarCharger: true,
      typologies: ['Studios Executivos 38m²', '2 Dorms (1 Suíte) 72m²', '3 Suítes 118m²'],
      amenities: [
        'Rooftop Infinity Pool no 22º Andar',
        'Lounge Gourmet com Bar de Coquetelaria',
        'Espaço Wellness com Hidromassagem e Sauna Seca',
        'Coworking Integrado com Cafeteria Grab&Go'
      ],
      securityFeatures: [
        'Portaria Remota Conectada 24h com Reconhecimento Facial',
        'Controle de Entregas com Locker Inteligente'
      ],
      sustainability: [
        'Fachada ventilada que reduz em 30% a absorção de calor',
        'Painéis solares para geração de energia'
      ]
    },
    constructionStage: {
      overallPercent: 18,
      foundationPercent: 85,
      structurePercent: 20,
      masonryPercent: 0,
      installationsPercent: 0,
      finishingPercent: 0,
      paintingPercent: 0,
      landscapingPercent: 0,
      lastUpdatedDate: '10/09/2026',
      supervisorName: 'Engª. Marcela Rezende',
      notes: 'Execução de estacas e blocos de fundação finalizados. Iniciada a armação dos pilares do 1º subsolo.',
      photos: [
        {
          id: 'hp_1',
          stageName: 'Fundações Profundas',
          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=800&auto=format&fit=crop&q=80',
          caption: 'Escavação dos subsolos e cravação de estacas raiz',
          date: 'Agosto 2026'
        }
      ]
    },
    commissionRules: {
      totalPercent: 5.5,
      brokerPercent: 2.5,
      agencyPercent: 2.5,
      managerPercent: 0.5,
      bonusPrizeText: 'Comissão antecipada de 60% para reservas validadas nas primeiras 48h de lançamento',
      paymentTerms: 'Repasse semanal via PIX após assinatura de CCV.',
      contractorVgvGoal: 92000000
    },
    floorPlans: [
      {
        id: 'fp_pinheiros_3suites',
        typologyName: '3 Suítes Premium',
        privateAreaM2: 118,
        bedrooms: 3,
        suites: 3,
        parkingSpaces: 2,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
        blueprintHighResUrl: 'https://acertimob.com.br/plantas/pinheiros_118m.pdf',
        description: 'Planta moderna com varanda gourmet voltada para a copa das árvores de Pinheiros.'
      },
      {
        id: 'fp_pinheiros_2dorms',
        typologyName: '2 Dormitórios (1 Suíte)',
        privateAreaM2: 72,
        bedrooms: 2,
        suites: 1,
        parkingSpaces: 1,
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
        blueprintHighResUrl: 'https://acertimob.com.br/plantas/pinheiros_72m.pdf',
        description: 'Ideal para jovens casais ou investidores que buscam alta rentabilidade de locação por temporada.'
      }
    ],
    documents: [
      {
        id: 'doc_pinheiros_1',
        title: 'Apresentação Comercial de Lançamento (PDF)',
        category: 'LIVRO_DO_PRODUTO',
        fileUrl: 'https://acertimob.com.br/downloads/horizonte_pinheiros_book.pdf',
        fileSizeMb: '36.5 MB',
        uploadedAt: '02/09/2026'
      }
    ],
    salesTableConfig: {
      tableCode: 'TAB-PINHEIROS-AGO26',
      validUntil: '15/11/2026',
      inccAnnualEstimate: 5.0,
      signalPercent: 12,
      thirtyDaysPercent: 4,
      sixtyDaysPercent: 4,
      monthlyInstallmentsCount: 36,
      monthlyInstallmentsTotalPercent: 20,
      semiAnnualInstallmentsCount: 6,
      semiAnnualInstallmentsTotalPercent: 10,
      keysDeliveryPercent: 10,
      bankFinancingPercent: 40,
      specialCashDiscountPercent: 10
    },
    units: [
      { id: 'u_pin_2001', developmentId: 'dev_horizonte_pinheiros', tower: 'Torre Única Signature', floor: 20, unitNumber: '2001', typology: '3 Suítes 118m²', privateAreaM2: 118, parkingSpaces: 2, sunOrientation: 'MANHA', price: 1890000, condoFee: 1200, iptuFee: 420, status: 'DISPONIVEL' },
      { id: 'u_pin_2002', developmentId: 'dev_horizonte_pinheiros', tower: 'Torre Única Signature', floor: 20, unitNumber: '2002', typology: '2 Dorms (1 Suíte) 72m²', privateAreaM2: 72, parkingSpaces: 1, sunOrientation: 'TARDE', price: 1180000, condoFee: 780, iptuFee: 260, status: 'DISPONIVEL' },
      { id: 'u_pin_1801', developmentId: 'dev_horizonte_pinheiros', tower: 'Torre Única Signature', floor: 18, unitNumber: '1801', typology: '3 Suítes 118m²', privateAreaM2: 118, parkingSpaces: 2, sunOrientation: 'MANHA', price: 1850000, condoFee: 1200, iptuFee: 420, status: 'RESERVADO', reservedByBrokerName: 'Carlos Eduardo', reservedClientName: 'Mariana Duarte', reservationExpiresAt: '21h 30m restantes' },
      { id: 'u_pin_1802', developmentId: 'dev_horizonte_pinheiros', tower: 'Torre Única Signature', floor: 18, unitNumber: '1802', typology: '2 Dorms (1 Suíte) 72m²', privateAreaM2: 72, parkingSpaces: 1, sunOrientation: 'TARDE', price: 1150000, condoFee: 780, iptuFee: 260, status: 'VENDIDO' },
      { id: 'u_pin_1501', developmentId: 'dev_horizonte_pinheiros', tower: 'Torre Única Signature', floor: 15, unitNumber: '1501', typology: '3 Suítes 118m²', privateAreaM2: 118, parkingSpaces: 2, sunOrientation: 'MANHA', price: 1810000, condoFee: 1200, iptuFee: 420, status: 'DISPONIVEL' },
      { id: 'u_pin_1502', developmentId: 'dev_horizonte_pinheiros', tower: 'Torre Única Signature', floor: 15, unitNumber: '1502', typology: '2 Dorms (1 Suíte) 72m²', privateAreaM2: 72, parkingSpaces: 1, sunOrientation: 'TARDE', price: 1120000, condoFee: 780, iptuFee: 260, status: 'DISPONIVEL' }
    ],
    createdAt: '2026-03-01T10:00:00Z'
  }
];

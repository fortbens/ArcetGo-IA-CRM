import { PtamReport } from '../types/ptam';

export const INITIAL_PTAMS: PtamReport[] = [
  {
    id: 'ptam_001',
    code: 'PTAM-2026-0042',
    title: 'Parecer Técnico de Avaliação Mercadológica - Cobertura Duplex Jardins',
    status: 'HOMOLOGADO',
    purpose: 'VENDA',
    createdAt: '2026-09-28',
    inspectionDate: '2026-09-25',
    validityDays: 90,
    validUntil: '2026-12-27',

    requester: {
      name: 'Dr. Roberto Mendonça Guimarães',
      document: '184.920.341-20',
      phone: '(11) 98765-4321',
      email: 'roberto.guimaraes@advocacia.com.br',
      address: 'Rua Bela Cintra, 2100 - Cerqueira César, São Paulo/SP',
      city: 'São Paulo',
      state: 'SP',
      purposeDescription: 'Determinação do real valor de mercado para partilha amigável e venda patrimonial com base na Resolução COFECI nº 1.066/2007.'
    },

    evaluator: {
      name: 'Emerson Carneiro dos Santos',
      creci: '128.490-F / SP',
      cnai: 'CNAI 42.890',
      role: 'Perito Avaliador Imobiliário & Diretor Geral',
      phone: '(11) 99864-2424',
      email: 'diretorcarneiro@gmail.com',
      certificationSealCode: 'CNAI-SP-2026-981240-E',
      digitalSignatureHash: 'SHA256: 4a8b7f12e98c0d3a56e7f891b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1'
    },

    agency: {
      name: 'AcertGo Gestão Imobiliária & Soluções ERP Ltda',
      tradeName: 'AcertGo Imóveis Jardins',
      cnpj: '18.492.341/0001-92',
      creciJ: '34.890-J / SP',
      address: 'Av. Brigadeiro Faria Lima, 3477 - 12º Andar, Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 99864-2424',
      email: 'diretorcarneiro@gmail.com',
      website: 'www.acertgo.com.br',
      logoUrl: ''
    },

    targetProperty: {
      id: 'prop_001',
      title: 'Cobertura Duplex Contemporânea com Vista Panorâmica',
      type: 'Cobertura Duplex',
      address: {
        street: 'Alameda Ministro Rocha Azevedo',
        number: '1150',
        complement: 'Cobertura 181',
        neighborhood: 'Jardim Paulista',
        city: 'São Paulo',
        state: 'SP',
        cep: '01410-002',
        zone: 'Zona Sul - Centro Expandido'
      },
      areas: {
        privateM2: 340,
        totalM2: 520,
        terrainM2: 1200,
        idealFraction: 0.0833
      },
      rooms: {
        bedrooms: 4,
        suites: 4,
        bathrooms: 6,
        parkingSpaces: 4
      },
      construction: {
        ageYears: 8,
        standard: 'LUXO',
        state: 'OTIMO',
        floors: 18,
        floorNumber: 18
      },
      registry: {
        registryOffice: '13º Cartório de Registro de Imóveis da Capital/SP',
        registrationNumber: 'Matrícula nº 148.922',
        taxIdIPTU: '015.089.0412-8',
        bookOrSheet: 'Livro nº 2 - Registro Geral'
      },
      amenities: [
        'Piscina privativa aquecida no terraço',
        'Espaço gourmet com churrasqueira a carvão e adega climatizada',
        'Automação residencial completa (áudio, vídeo e climatização)',
        '4 vagas demarcadas + depósito privativo no subsolo',
        'Condomínio com academia Technogym, gerador total e segurança Haganá'
      ],
      photos: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80'
      ],
      description: 'Espetacular cobertura duplex em localização nobre dos Jardins, com pé-direito duplo no living, acabamentos em mármore travertino navona e projeto assinado por arquiteto premiado.'
    },

    demographicsAndRegion: {
      neighborhoodSummary: 'O Jardim Paulista é considerado um dos bairros de mais alta liquidez e prestígio no mercado de luxo paulistano, caracterizado por infraestrutura cosmopolita, proximidade à Avenida Paulista, Parque Ibirapuera e alta densidade de serviços triple-A.',
      socioeconomicLevel: 'CLASSE_A',
      averageFamilyIncome: 34500,
      idhScore: 0.957,
      demographicDensity: '9.840 hab/km² com perfil de executivos, médicos, advogados e investidores patrimoniais',
      infrastructure: {
        transportation: 'Excelente acessibilidade pelas vias Av. Paulista, Av. Rebouças e Rua Augusta; a 450m da estação Trianon-Masp (Linha 2-Verde).',
        education: 'Próximo aos renomados colégios Dante Alighieri, São Luís e faculdades FGV e FMUSP.',
        health: 'Entorno servido pelos hospitais Sírio-Libanês, 9 de Julho e Albert Einstein (Unidade Paulista).',
        commerce: 'Região gastronômica de elite (Oscar Freire, Jardins) e Shopping Cidade São Paulo a curta distância a pé.',
        security: 'Monitoramento policial ostensivo, câmeras comunitárias e programas de vizinhança solidária com segurança privada 24 horas.'
      },
      marketLiquidityRating: 'MUITO_ALTA',
      averageSaleDays: 95,
      pricePerM2Trend: 'VALORIZACAO_ACENTUADA',
      aiAnalysisNotes: 'Diagnóstico IA AcertGo: O quadrilátero entre Al. Rocha Azevedo, Peixoto Gomide e Oscar Freire mantém valorização média anual de +11.2% nos últimos 24 meses, com baixa elasticidade de preço na ponta compradora e forte atratividade para capitais familiares.',
      generatedByAi: true
    },

    samples: [
      {
        id: 'smp_001',
        title: 'Cobertura Duplex Decorada na Al. Jaú',
        sourcePortal: 'ZAP_IMOVEIS',
        adUrl: 'https://www.zapimoveis.com.br/imovel/cobertura-jardim-paulista-sp-330m2-id-289410/',
        adDate: '2026-09-15',
        photoUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=300&auto=format&fit=crop&q=80',
        neighborhood: 'Jardim Paulista (a 180m)',
        distanceFromTargetMeters: 180,
        areaM2: 330,
        askingPrice: 8900000,
        askingPricePerM2: 26969.70,
        offerDiscountFactor: 0.92, // -8% negociação
        standardFactor: 1.00,
        conservationFactor: 0.98,
        locationFactor: 1.00,
        finalHomogenizedPricePerM2: 24316.08,
        notes: 'Anúncio ativo no portal ZAP com fotos de alto padrão e condomínio com lazer similar.'
      },
      {
        id: 'smp_002',
        title: 'Apartamento Duplex na Rua Bela Cintra',
        sourcePortal: 'VIVAREAL',
        adUrl: 'https://www.vivareal.com.br/imovel/apartamento-jardins-350m2-id-499120/',
        adDate: '2026-09-20',
        photoUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&auto=format&fit=crop&q=80',
        neighborhood: 'Jardim Paulista (a 320m)',
        distanceFromTargetMeters: 320,
        areaM2: 350,
        askingPrice: 9450000,
        askingPricePerM2: 27000.00,
        offerDiscountFactor: 0.90, // -10% negociação
        standardFactor: 0.98,
        conservationFactor: 1.00,
        locationFactor: 0.98,
        finalHomogenizedPricePerM2: 23336.28,
        notes: 'Unidade reformada recentemente, 4 suítes, 4 vagas, condomínio clássico.'
      },
      {
        id: 'smp_003',
        title: 'Cobertura com Terraço na Rua Haddock Lobo',
        sourcePortal: 'IMOVELWEB',
        adUrl: 'https://www.imovelweb.com.br/propriedades/cobertura-haddock-lobo-345m2-id-38190/',
        adDate: '2026-09-22',
        photoUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=300&auto=format&fit=crop&q=80',
        neighborhood: 'Cerqueira César / Jardins (a 400m)',
        distanceFromTargetMeters: 400,
        areaM2: 345,
        askingPrice: 9200000,
        askingPricePerM2: 26666.67,
        offerDiscountFactor: 0.90,
        standardFactor: 1.00,
        conservationFactor: 0.96,
        locationFactor: 1.02,
        finalHomogenizedPricePerM2: 23497.33,
        notes: 'Padrão construtivo equivalente, 4 vagas demarcadas, vista desimpedida.'
      },
      {
        id: 'smp_004',
        title: 'Cobertura Duplex Exclusiva na Al. Lorena',
        sourcePortal: 'SITE_PROPRIO',
        adUrl: 'https://www.acertgo.com.br/imovel/cobertura-lorena-340m2-acert-99/',
        adDate: '2026-09-18',
        photoUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=300&auto=format&fit=crop&q=80',
        neighborhood: 'Jardim Paulista (a 250m)',
        distanceFromTargetMeters: 250,
        areaM2: 340,
        askingPrice: 9100000,
        askingPricePerM2: 26764.71,
        offerDiscountFactor: 0.91,
        standardFactor: 1.00,
        conservationFactor: 1.00,
        locationFactor: 1.00,
        finalHomogenizedPricePerM2: 24355.88,
        notes: 'Imóvel em carteira própria com autorização de venda firmada.'
      }
    ],

    calculations: {
      rawAveragePerM2: 26850.27,
      homogenizedAveragePerM2: 23876.39,
      standardDeviation: 476.12,
      coefficientOfVariation: 1.99, // Super preciso (< 30% exigido pela NBR)
      confidenceIntervalMin: 23150.00,
      confidenceIntervalMax: 24600.00,
      recommendedMarketValue: 8118000, // 340m² * 23.876,39
      recommendedRentalValue: 38500, // ~0.47% ao mês
      quickSaleValue: 6900000, // Liquidação rápida / judicial
      arbitrageFactorPercentage: 0,
      arbitrageJustification: 'Adotado o valor médio exato homogeneizado pelo Método Comparativo Direto de Dados de Mercado (MCDDM), com coeficiente de variação amostral de 1.99%, assegurando Grau III de precisão fundamentada.'
    },

    legalTerms: {
      resolutionCofeci: 'Parecer Técnico de Avaliação Mercadológica emitido em estrita consonância com a Resolução COFECI nº 1.066/2007, regulamentado pelo Ato Normativo COFECI nº 001/2008 e amparado pelo art. 3º da Lei Federal nº 6.530/1978.',
      standardAbnt: 'Laudo pericial estruturado nos preceitos da Associação Brasileira de Normas Técnicas - ABNT NBR 14.653-1 (Procedimentos Gerais) e ABNT NBR 14.653-2 (Imóveis Urbanos).',
      declaration: 'Declaro sob as penas da lei que vistoriei pessoalmente o imóvel avaliando em 25/09/2026, não possuindo interesse direto ou indireto no resultado financeiro desta avaliação nem parentesco com as partes requerentes, mantendo conduta ética e estrita independência profissional.',
      sealNumber: 'CNAI 42.890 - Selo Oficial Certificador COFECI nº 2026.09.42890-SP',
      qrCodeVerificationUrl: 'https://verificador.cofeci.gov.br/ptam/2026-SP-42890'
    }
  },
  {
    id: 'ptam_002',
    code: 'PTAM-2026-0043',
    title: 'Parecer Técnico de Avaliação Mercadológica - Residência Alto Padrão Moema Pássaros',
    status: 'EMITIDO',
    purpose: 'GARANTIA_BANCARIA',
    createdAt: '2026-09-30',
    inspectionDate: '2026-09-28',
    validityDays: 120,
    validUntil: '2027-01-28',

    requester: {
      name: 'Banco Santander Brasil S.A. / Gestão de Garantias',
      document: '90.400.888/0001-42',
      phone: '(11) 4004-3535',
      email: 'credito.imobiliario@santander.com.br',
      address: 'Av. Presidente Juscelino Kubitschek, 2041 - Vila Olímpia, São Paulo/SP',
      city: 'São Paulo',
      state: 'SP',
      purposeDescription: 'Avaliação técnica mercadológica para concessão de crédito imobiliário com garantia de alienação fiduciária em conformidade com a NBR 14.653.'
    },

    evaluator: {
      name: 'Emerson Carneiro dos Santos',
      creci: '128.490-F / SP',
      cnai: 'CNAI 42.890',
      role: 'Perito Avaliador Imobiliário & Diretor Geral',
      phone: '(11) 99864-2424',
      email: 'diretorcarneiro@gmail.com',
      certificationSealCode: 'CNAI-SP-2026-981241-F',
      digitalSignatureHash: 'SHA256: 8f3c9e11b45d2a76f09e81b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c2d3'
    },

    agency: {
      name: 'AcertGo Gestão Imobiliária & Soluções ERP Ltda',
      tradeName: 'AcertGo Imóveis Jardins',
      cnpj: '18.492.341/0001-92',
      creciJ: '34.890-J / SP',
      address: 'Av. Brigadeiro Faria Lima, 3477 - 12º Andar, Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 99864-2424',
      email: 'diretorcarneiro@gmail.com',
      website: 'www.acertgo.com.br',
      logoUrl: ''
    },

    targetProperty: {
      id: 'prop_002',
      title: 'Residência Contemporânea com Paisagismo e Automação',
      type: 'Casa / Residência',
      address: {
        street: 'Rua Canário',
        number: '820',
        complement: 'Casa',
        neighborhood: 'Moema Pássaros',
        city: 'São Paulo',
        state: 'SP',
        cep: '04521-003',
        zone: 'Zona Sul - Eixo Ibirapuera'
      },
      areas: {
        privateM2: 285,
        totalM2: 380,
        terrainM2: 320,
        idealFraction: 1.00
      },
      rooms: {
        bedrooms: 3,
        suites: 3,
        bathrooms: 5,
        parkingSpaces: 3
      },
      construction: {
        ageYears: 5,
        standard: 'ALTO',
        state: 'OTIMO',
        floors: 2
      },
      registry: {
        registryOffice: '14º Cartório de Registro de Imóveis de São Paulo/SP',
        registrationNumber: 'Matrícula nº 98.412',
        taxIdIPTU: '042.112.0190-3',
        bookOrSheet: 'Livro nº 2'
      },
      amenities: [
        'Área gourmet com churrasqueira e teto retrátil',
        'Piscina aquecida com raia e deck de madeira cumaru',
        'Energia solar fotovoltaica com microinversores instalados',
        '3 suítes com persianas blackout motorizadas',
        'Cisterna de reuso de água pluvial de 5.000 litros'
      ],
      photos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80'
      ],
      description: 'Casa isolada em rua arborizada no miolo de Moema Pássaros, acabamento primoroso com piso de peroba rosa de demolição, suíte master com hidro e closet walk-in.'
    },

    demographicsAndRegion: {
      neighborhoodSummary: 'Moema Pássaros é um dos bairros com melhor qualidade de vida da capital, plano, arborizado e estritamente residencial nas vias secundárias, beneficiado pela proximidade do Parque Ibirapuera e comércio sofisticado.',
      socioeconomicLevel: 'CLASSE_A',
      averageFamilyIncome: 28900,
      idhScore: 0.961,
      demographicDensity: '8.400 hab/km² com forte presença de famílias e casais seniores',
      infrastructure: {
        transportation: 'Fácil acesso pelas avenidas Ibirapuera, República do Líbano e 23 de Maio; a 600m da estação Moema (Linha 5-Lilás).',
        education: 'Colégios renomados no raio de 1.5km: Mobile, Vértice e Escola Suíço-Brasileira.',
        health: 'Hospital Alvorada e centros diagnósticos Fleury a poucos minutos.',
        commerce: 'Comércio gastronômico requintado a pé nas ruas Canário, Gaivota e Rouxinol.',
        security: 'Excelente policiamento com vigilância motorizada contratada pela associação de moradores.'
      },
      marketLiquidityRating: 'ALTA',
      averageSaleDays: 80,
      pricePerM2Trend: 'VALORIZACAO_ESTAVEL',
      aiAnalysisNotes: 'Diagnóstico IA AcertGo: Moema Pássaros tem oferta restrita de casas isoladas térreas/sobrados devido à verticalização anterior ao plano diretor. O m² de casas de alto padrão reformadas atinge prêmio de 18% sobre a média do bairro.',
      generatedByAi: true
    },

    samples: [
      {
        id: 'smp_005',
        title: 'Sobrado Contemporâneo na Rua Gaivota',
        sourcePortal: 'ZAP_IMOVEIS',
        adUrl: 'https://www.zapimoveis.com.br/imovel/casa-moema-passaros-290m2-id-5891/',
        adDate: '2026-09-10',
        photoUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&auto=format&fit=crop&q=80',
        neighborhood: 'Moema Pássaros (a 220m)',
        distanceFromTargetMeters: 220,
        areaM2: 290,
        askingPrice: 5600000,
        askingPricePerM2: 19310.34,
        offerDiscountFactor: 0.90,
        standardFactor: 1.00,
        conservationFactor: 0.98,
        locationFactor: 1.00,
        finalHomogenizedPricePerM2: 17031.72,
        notes: 'Padrão moderno, 3 suítes, acabamento recente.'
      },
      {
        id: 'smp_006',
        title: 'Casa com Piscina na Rua Rouxinol',
        sourcePortal: 'VIVAREAL',
        adUrl: 'https://www.vivareal.com.br/imovel/casa-moema-passaros-280m2-id-7182/',
        adDate: '2026-09-12',
        photoUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=300&auto=format&fit=crop&q=80',
        neighborhood: 'Moema Pássaros (a 150m)',
        distanceFromTargetMeters: 150,
        areaM2: 280,
        askingPrice: 5450000,
        askingPricePerM2: 19464.28,
        offerDiscountFactor: 0.90,
        standardFactor: 0.98,
        conservationFactor: 1.00,
        locationFactor: 1.00,
        finalHomogenizedPricePerM2: 17167.49,
        notes: 'Terreno de 300m², churrasqueira, reformada.'
      },
      {
        id: 'smp_007',
        title: 'Residência de Vila Fechada na Rua Canário',
        sourcePortal: 'IMOVELWEB',
        adUrl: 'https://www.imovelweb.com.br/imovel/casa-canario-285m2-id-9912/',
        adDate: '2026-09-19',
        photoUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=300&auto=format&fit=crop&q=80',
        neighborhood: 'Moema Pássaros (mesma rua)',
        distanceFromTargetMeters: 80,
        areaM2: 285,
        askingPrice: 5500000,
        askingPricePerM2: 19298.24,
        offerDiscountFactor: 0.90,
        standardFactor: 1.00,
        conservationFactor: 1.00,
        locationFactor: 1.00,
        finalHomogenizedPricePerM2: 17368.41,
        notes: 'Excelente comparável pela proximidade imediata.'
      }
    ],

    calculations: {
      rawAveragePerM2: 19357.62,
      homogenizedAveragePerM2: 17189.20,
      standardDeviation: 168.40,
      coefficientOfVariation: 0.98,
      confidenceIntervalMin: 16800.00,
      confidenceIntervalMax: 17500.00,
      recommendedMarketValue: 4898000, // 285m² * 17.189,20
      recommendedRentalValue: 24500,
      quickSaleValue: 4160000,
      arbitrageFactorPercentage: 0,
      arbitrageJustification: 'Adotado o valor homogêneo médio apurado pelo MCDDM NBR 14.653-2, refletindo a liquidez para garantia hipotecária.'
    },

    legalTerms: {
      resolutionCofeci: 'Parecer Técnico de Avaliação Mercadológica emitido em estrita consonância com a Resolução COFECI nº 1.066/2007 e Ato Normativo COFECI nº 001/2008.',
      standardAbnt: 'Laudo pericial estruturado nos preceitos da ABNT NBR 14.653-1 e NBR 14.653-2.',
      declaration: 'Declaro sob as penas da lei que realizei a vistoria presencial do imóvel e que a avaliação observou rigor técnico, independência e probidade profissional.',
      sealNumber: 'CNAI 42.890 - Selo Oficial Certificador COFECI nº 2026.09.42891-SP',
      qrCodeVerificationUrl: 'https://verificador.cofeci.gov.br/ptam/2026-SP-42891'
    }
  }
];

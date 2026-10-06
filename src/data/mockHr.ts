import { 
  Employee, 
  ElectronicClockRecord, 
  Payslip, 
  VacationAndLeaveRequest, 
  PerformanceReview, 
  CorporateBenefit 
} from '../types/hr';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_1',
    name: 'Juliana Mendes',
    email: 'juliana.mendes@imobiliaria.com.br',
    phone: '(11) 98765-4321',
    role: 'Corretora de Alto Padrão Sênior',
    department: 'VENDAS',
    contractType: 'AUTONOMO_CORRETOR',
    status: 'ATIVO',
    cpf: '342.981.458-12',
    rg: '44.891.203-9 SSP/SP',
    birthDate: '1990-05-14',
    admissionDate: '2022-03-01',
    salary: 4500, // Adiantamento/fixo + comissões
    pixKey: 'juliana.mendes@imobiliaria.com.br',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creci: '194.821-F / SP',
    ctpsOrCnpj: '12345/001-SP',
    dependentsCount: 1,
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
      phone: '(11) 99881-2233',
      phoneAlt: '(11) 3044-8899',
      notes: 'Alergia a penicilina. Tipo sanguíneo O+'
    },
    bankInfo: {
      bank: 'Itaú Unibanco (341)',
      agency: '0812',
      account: '34912-8',
      accountType: 'Corrente'
    },
    notes: 'Especialista em lançamentos Jardins e Pinheiros. Top Producer 2025.'
  },
  {
    id: 'emp_2',
    name: 'Carlos Eduardo Silveira',
    email: 'carlos.eduardo@imobiliaria.com.br',
    phone: '(11) 97123-8899',
    role: 'Gerente Geral de Vendas',
    department: 'VENDAS',
    contractType: 'CLT',
    status: 'ATIVO',
    cpf: '219.873.118-44',
    rg: '32.190.542-1 SSP/SP',
    birthDate: '1984-11-20',
    admissionDate: '2020-08-15',
    salary: 12500,
    pixKey: '21987311844',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    creci: '142.901-F / SP',
    ctpsOrCnpj: '88991/002-SP',
    dependentsCount: 2,
    address: {
      cep: '05407-002',
      street: 'Rua Teodoro Sampaio',
      number: '1420',
      complement: 'Apto 54 Bloco B',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Renata Silveira',
      relationship: 'Esposa',
      phone: '(11) 98112-9900',
      notes: 'Contato em caso de qualquer emergência médica'
    },
    bankInfo: {
      bank: 'Banco Santander (033)',
      agency: '2190',
      account: '88771-4',
      accountType: 'Corrente'
    }
  },
  {
    id: 'emp_3',
    name: 'Beatriz Vasconcelos',
    email: 'beatriz.financeiro@imobiliaria.com.br',
    phone: '(11) 96541-2233',
    role: 'Analista Financeiro Pleno & Split',
    department: 'FINANCEIRO',
    contractType: 'CLT',
    status: 'ATIVO',
    cpf: '409.123.882-90',
    rg: '48.901.120-X SSP/SP',
    birthDate: '1995-02-18',
    admissionDate: '2023-01-10',
    salary: 5800,
    pixKey: 'beatriz.financeiro@imobiliaria.com.br',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    dependentsCount: 0,
    address: {
      cep: '04001-001',
      street: 'Rua Tutóia',
      number: '315',
      neighborhood: 'Paraíso',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Maria Helena Vasconcelos',
      relationship: 'Mãe',
      phone: '(11) 97722-1133'
    },
    bankInfo: {
      bank: 'Bradesco (237)',
      agency: '1402',
      account: '10982-1',
      accountType: 'Corrente'
    }
  },
  {
    id: 'emp_4',
    name: 'Rodrigo Alcantara',
    email: 'rodrigo.locacao@imobiliaria.com.br',
    phone: '(11) 99182-3344',
    role: 'Gestor de Contratos de Locação',
    department: 'LOCACAO',
    contractType: 'CLT',
    status: 'FERIAS',
    cpf: '189.542.771-09',
    birthDate: '1991-09-08',
    admissionDate: '2021-06-01',
    salary: 6200,
    pixKey: '18954277109',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    dependentsCount: 1,
    address: {
      cep: '01311-000',
      street: 'Av. Paulista',
      number: '1200',
      complement: 'Conjunto 81',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Camila Alcantara',
      relationship: 'Irmã',
      phone: '(11) 98877-3322'
    }
  },
  {
    id: 'emp_5',
    name: 'Larissa Albuquerque',
    email: 'larissa.juridico@imobiliaria.com.br',
    phone: '(11) 98223-1122',
    role: 'Advogada Imobiliária Sênior',
    department: 'JURIDICO',
    contractType: 'PJ',
    status: 'ATIVO',
    cpf: '298.712.441-33',
    birthDate: '1988-07-22',
    admissionDate: '2022-10-01',
    salary: 9500,
    pixKey: 'larissa.albuquerque@advocacia.com.br',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    ctpsOrCnpj: '41.890.123/0001-44',
    dependentsCount: 0,
    address: {
      cep: '04533-010',
      street: 'Rua Bandeira Paulista',
      number: '420',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: 'Otávio Albuquerque',
      relationship: 'Pai',
      phone: '(11) 99122-3344'
    }
  }
];

export const INITIAL_CLOCK_RECORDS: ElectronicClockRecord[] = [
  {
    id: 'clk_1',
    employeeId: 'emp_2',
    employeeName: 'Carlos Eduardo Silveira',
    employeeRole: 'Gerente Geral de Vendas',
    timestamp: '2026-09-25T08:02:14.000Z',
    formattedDate: '25/09/2026',
    formattedTime: '08:02:14',
    type: 'ENTRADA',
    location: {
      latitude: -23.561684,
      longitude: -46.655981,
      accuracyMeters: 4.8,
      addressDescription: 'Av. Brigadeiro Faria Lima, 2800 - Sede Matriz',
      isWithinOfficePerimeter: true,
      distanceMeters: 12
    },
    nsrCode: 'NSR-2026-0925-0012',
    verificationStatus: 'VALIDADO_GPS',
    deviceInfo: 'App AcertGo Web / iPhone 16 Pro (GPS Alta Precisão)'
  },
  {
    id: 'clk_2',
    employeeId: 'emp_3',
    employeeName: 'Beatriz Vasconcelos',
    employeeRole: 'Analista Financeiro Pleno & Split',
    timestamp: '2026-09-25T08:29:40.000Z',
    formattedDate: '25/09/2026',
    formattedTime: '08:29:40',
    type: 'ENTRADA',
    location: {
      latitude: -23.561702,
      longitude: -46.656012,
      accuracyMeters: 5.2,
      addressDescription: 'Av. Brigadeiro Faria Lima, 2800 - Sede Matriz',
      isWithinOfficePerimeter: true,
      distanceMeters: 18
    },
    nsrCode: 'NSR-2026-0925-0045',
    verificationStatus: 'VALIDADO_GPS',
    deviceInfo: 'Chrome 128 / macOS Sequoia (Geolocalização Ativa)'
  },
  {
    id: 'clk_3',
    employeeId: 'emp_1',
    employeeName: 'Juliana Mendes',
    employeeRole: 'Corretora de Alto Padrão Sênior',
    timestamp: '2026-09-25T09:15:30.000Z',
    formattedDate: '25/09/2026',
    formattedTime: '09:15:30',
    type: 'ENTRADA',
    location: {
      latitude: -23.570120,
      longitude: -46.678910,
      accuracyMeters: 8.5,
      addressDescription: 'Rua Oscar Freire, 900 - Plantão Externo Jardins',
      isWithinOfficePerimeter: false,
      distanceMeters: 2450
    },
    nsrCode: 'NSR-2026-0925-0089',
    verificationStatus: 'APROVADO_GESTOR',
    deviceInfo: 'Samsung Galaxy S25 / Android 16 (Visita com Cliente)',
    justification: 'Plantão de Lançamento Jardins autorizado pelo Gerente Carlos'
  },
  {
    id: 'clk_4',
    employeeId: 'emp_2',
    employeeName: 'Carlos Eduardo Silveira',
    employeeRole: 'Gerente Geral de Vendas',
    timestamp: '2026-09-25T12:05:00.000Z',
    formattedDate: '25/09/2026',
    formattedTime: '12:05:00',
    type: 'PAUSA_ALMOCO',
    location: {
      latitude: -23.561684,
      longitude: -46.655981,
      accuracyMeters: 4.8,
      addressDescription: 'Av. Brigadeiro Faria Lima, 2800 - Sede Matriz',
      isWithinOfficePerimeter: true,
      distanceMeters: 10
    },
    nsrCode: 'NSR-2026-0925-0142',
    verificationStatus: 'VALIDADO_GPS'
  },
  {
    id: 'clk_5',
    employeeId: 'emp_2',
    employeeName: 'Carlos Eduardo Silveira',
    employeeRole: 'Gerente Geral de Vendas',
    timestamp: '2026-09-25T13:08:22.000Z',
    formattedDate: '25/09/2026',
    formattedTime: '13:08:22',
    type: 'RETORNO_ALMOCO',
    location: {
      latitude: -23.561690,
      longitude: -46.655990,
      accuracyMeters: 3.9,
      addressDescription: 'Av. Brigadeiro Faria Lima, 2800 - Sede Matriz',
      isWithinOfficePerimeter: true,
      distanceMeters: 14
    },
    nsrCode: 'NSR-2026-0925-0198',
    verificationStatus: 'VALIDADO_GPS'
  }
];

export const INITIAL_PAYSLIPS: Payslip[] = [
  {
    id: 'hol_2026_09_emp2',
    employeeId: 'emp_2',
    employeeName: 'Carlos Eduardo Silveira',
    cpf: '219.873.118-44',
    role: 'Gerente Geral de Vendas',
    department: 'VENDAS',
    monthYear: '09/2026',
    referencePeriod: '01/09/2026 a 30/09/2026',
    admissionDate: '15/08/2020',
    bankAccount: 'Banco Santander - Ag 2190 / CC 88771-4',
    pixKey: '21987311844',
    earnings: [
      { code: '001', description: 'Salário Base Mensal', reference: '30 Dias', type: 'PROVENTO', value: 12500.00 },
      { code: '025', description: 'DSR sobre Comissões / Metas', reference: 'Integral', type: 'PROVENTO', value: 1850.00 },
      { code: '034', description: 'Bônus de Superação de Meta Q3', reference: '120% Meta', type: 'PROVENTO', value: 3500.00 },
      { code: '050', description: 'Ajuda de Custo Combustível / Plantão', reference: 'Mensal', type: 'PROVENTO', value: 800.00 }
    ],
    deductions: [
      { code: '101', description: 'INSS Previdência Oficial', reference: '14.00% Teto', type: 'DESCONTO', value: 908.85 },
      { code: '102', description: 'IRRF Imposto de Renda Fonte', reference: '27.50%', type: 'DESCONTO', value: 3640.20 },
      { code: '105', description: 'Coparticipação Plano de Saúde Bradesco Top', reference: 'Titular + 2', type: 'DESCONTO', value: 380.00 },
      { code: '108', description: 'Seguro de Vida em Grupo', reference: 'Apólice Imob', type: 'DESCONTO', value: 45.00 }
    ],
    grossSalary: 18650.00,
    totalDeductions: 4974.05,
    netSalary: 13675.95,
    inssBase: 7786.02,
    fgtsBase: 17850.00,
    fgtsAmount: 1428.00,
    irrfBase: 16941.15,
    paymentDate: '05/10/2026',
    status: 'EMITIDO'
  },
  {
    id: 'hol_2026_09_emp3',
    employeeId: 'emp_3',
    employeeName: 'Beatriz Vasconcelos',
    cpf: '409.123.882-90',
    role: 'Analista Financeiro Pleno & Split',
    department: 'FINANCEIRO',
    monthYear: '09/2026',
    referencePeriod: '01/09/2026 a 30/09/2026',
    admissionDate: '10/01/2023',
    bankAccount: 'Bradesco - Ag 1402 / CC 10982-1',
    pixKey: 'beatriz.financeiro@imobiliaria.com.br',
    earnings: [
      { code: '001', description: 'Salário Base Mensal', reference: '30 Dias', type: 'PROVENTO', value: 5800.00 },
      { code: '015', description: 'Gratificação Fechamento Repasses Pix', reference: 'Mensal', type: 'PROVENTO', value: 650.00 },
      { code: '040', description: 'Auxílio Home Office & Internet', reference: 'Fixo', type: 'PROVENTO', value: 200.00 }
    ],
    deductions: [
      { code: '101', description: 'INSS Previdência Oficial', reference: '12.00%', type: 'DESCONTO', value: 642.10 },
      { code: '102', description: 'IRRF Imposto de Renda Fonte', reference: '22.50%', type: 'DESCONTO', value: 489.30 },
      { code: '104', description: 'Vale Transporte (Desc. Legal 6%)', reference: '6.00%', type: 'DESCONTO', value: 348.00 },
      { code: '106', description: 'Coparticipação Odonto Uniodonto', reference: 'Mensal', type: 'DESCONTO', value: 35.00 }
    ],
    grossSalary: 6650.00,
    totalDeductions: 1514.40,
    netSalary: 5135.60,
    inssBase: 6450.00,
    fgtsBase: 6450.00,
    fgtsAmount: 516.00,
    irrfBase: 5807.90,
    paymentDate: '05/10/2026',
    status: 'EMITIDO'
  }
];

export const INITIAL_VACATIONS: VacationAndLeaveRequest[] = [
  {
    id: 'vac_1',
    employeeId: 'emp_4',
    employeeName: 'Rodrigo Alcantara',
    department: 'LOCACAO',
    type: 'FERIAS',
    startDate: '2026-09-15',
    endDate: '2026-10-04',
    totalDays: 20,
    sellOneThird: true, // Vendeu 10 dias de abono
    advanceThirteenth: true,
    status: 'EM_GOZO',
    requestedAt: '2026-08-01',
    approvedBy: 'Carlos Eduardo Silveira',
    notes: 'Período Aquisitivo 2024/2025. Cobertura de plantão alinhada com equipe de locação.'
  },
  {
    id: 'vac_2',
    employeeId: 'emp_3',
    employeeName: 'Beatriz Vasconcelos',
    department: 'FINANCEIRO',
    type: 'FERIAS',
    startDate: '2026-11-03',
    endDate: '2026-11-17',
    totalDays: 15,
    sellOneThird: false,
    advanceThirteenth: false,
    status: 'APROVADO',
    requestedAt: '2026-09-10',
    approvedBy: 'Diretoria Executiva',
    notes: 'Programação de férias antes do fechamento anual de dezembro.'
  },
  {
    id: 'vac_3',
    employeeId: 'emp_1',
    employeeName: 'Juliana Mendes',
    department: 'VENDAS',
    type: 'FOLGA_COMPENSATORIA',
    startDate: '2026-09-28',
    endDate: '2026-09-28',
    totalDays: 1,
    sellOneThird: false,
    advanceThirteenth: false,
    status: 'APROVADO',
    requestedAt: '2026-09-22',
    approvedBy: 'Carlos Eduardo Silveira',
    notes: 'Compensação de plantão de domingo no lançamento Casa Jardins.'
  }
];

export const INITIAL_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: 'prf_1',
    employeeId: 'emp_1',
    employeeName: 'Juliana Mendes',
    role: 'Corretora de Alto Padrão Sênior',
    department: 'VENDAS',
    period: 'Q2/Q3 2026',
    evaluatorName: 'Carlos Eduardo Silveira (Gerente)',
    overallScore: 4.8,
    criteria: [
      { name: 'Conversão de Leads em Visitas', score: 5, weight: 30, comment: 'Excelente taxa de 38% de conversão na roleta inteligente.' },
      { name: 'Pontualidade & Registro no CRM', score: 4.5, weight: 20, comment: 'SLA de resposta de 8 minutos, bem acima da média de mercado.' },
      { name: 'Negociação & Fechamento', score: 5, weight: 30, comment: 'Capacidade diferenciada de negociação em imóveis acima de R$ 3M.' },
      { name: 'Trabalho em Equipe & Parcerias', score: 4.5, weight: 20, comment: 'Compartilha captações ativamente com outros corretores da casa.' }
    ],
    strengths: 'Comunicação empática, networking premium nos Jardins e domínio de contratos digitais.',
    areasToImprove: 'Aprofundar conhecimento em estruturação de financiamento bancário SBPE/CCA.',
    individualDevelopmentPlan: 'Realizar o treinamento de Correspondente Bancário Caixa na AcertGo Academy.',
    okrCompletionPercent: 96,
    reviewedAt: '2026-08-30'
  },
  {
    id: 'prf_2',
    employeeId: 'emp_3',
    employeeName: 'Beatriz Vasconcelos',
    role: 'Analista Financeiro Pleno & Split',
    department: 'FINANCEIRO',
    period: 'Q2/Q3 2026',
    evaluatorName: 'Diretoria Financeira',
    overallScore: 4.9,
    criteria: [
      { name: 'Precisão na Conciliação Bancária', score: 5, weight: 35, comment: 'Zero discrepâncias em mais de 1.400 repasses efetuados.' },
      { name: 'Velocidade no Split de Herdeiros Pix', score: 5, weight: 30, comment: 'Fluxo 100% automatizado sem atrasos para os proprietários.' },
      { name: 'Atendimento ao Cliente / Proprietário', score: 4.8, weight: 20, comment: 'Clareza excepcional ao explicar informes de rendimento.' },
      { name: 'Iniciativa & Automação de Processos', score: 4.7, weight: 15, comment: 'Propôs melhorias no envio de comprovantes via WhatsApp.' }
    ],
    strengths: 'Rigor analítico, pontualidade inquestionável e proatividade técnica.',
    areasToImprove: 'Delegação de tarefas rotineiras para o estagiário de finanças.',
    individualDevelopmentPlan: 'Curso executivo de Gestão de Tesouraria Imobiliária.',
    okrCompletionPercent: 100,
    reviewedAt: '2026-09-02'
  }
];

export const INITIAL_BENEFITS: CorporateBenefit[] = [
  {
    id: 'ben_1',
    name: 'Cartão Flash Benefícios (VA / VR Flexível)',
    provider: 'Flash Benefícios',
    category: 'ALIMENTACAO',
    monthlyCompanyCost: 1200.00,
    employeeCopayPercent: 0,
    activeCount: 14,
    description: 'Saldo flexível para supermercados, restaurantes e delivery iFood.'
  },
  {
    id: 'ben_2',
    name: 'Plano de Saúde Bradesco Saúde Top Nacional',
    provider: 'Bradesco Saúde',
    category: 'SAUDE',
    monthlyCompanyCost: 850.00,
    employeeCopayPercent: 15,
    activeCount: 12,
    description: 'Acomodação em apartamento, ampla rede credenciada (Albert Einstein, Sírio-Libanês).'
  },
  {
    id: 'ben_3',
    name: 'Plano Odontológico MetLife Premium',
    provider: 'MetLife Odonto',
    category: 'SAUDE',
    monthlyCompanyCost: 65.00,
    employeeCopayPercent: 10,
    activeCount: 11,
    description: 'Cobertura total para ortodontia, clareamento e próteses.'
  },
  {
    id: 'ben_4',
    name: 'Seguro de Vida em Grupo & Acidentes Pessoais',
    provider: 'Porto Seguro',
    category: 'SEGURO',
    monthlyCompanyCost: 45.00,
    employeeCopayPercent: 0,
    activeCount: 18,
    description: 'Cobertura de R$ 250.000,00 com assistência funeral e invalidez por acidente.'
  },
  {
    id: 'ben_5',
    name: 'Gympass / Wellhub (Acesso a Academias)',
    provider: 'Wellhub',
    category: 'BEM_ESTAR',
    monthlyCompanyCost: 110.00,
    employeeCopayPercent: 25,
    activeCount: 9,
    description: 'Planos a partir de Smart Fit até Bodytech com subsídio corporativo.'
  }
];

import { 
  RentalContract, 
  RentalInvoice, 
  CollectionRuleStep, 
  CollectionNotification, 
  ContractAdjustmentRecord, 
  RepasseSplitPayment 
} from '../types/crm';

export const INITIAL_RENTAL_CONTRACTS_FULL: RentalContract[] = [
  {
    id: 'cnt_001',
    code: 'LOC-2026-904',
    propertyCode: 'AP-JARDINS-42',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    tenantName: 'Lucas Ferraz Medeiros',
    tenantCpf: '349.812.908-11',
    tenantEmail: 'lucas.medeiros@gmail.com',
    tenantPhone: '(11) 98765-4321',
    ownerName: 'Espólio de Arnaldo Fontes da Silva',
    ownerPixKey: 'repasse.fontes@silva.com.br',
    monthlyRent: 6500,
    condoFee: 1400,
    iptuFee: 480,
    guaranteeFee: 260, // Seguro Fiança Porto Seguro
    adminFeePercentage: 10, // 10% da imobiliária
    guaranteeType: 'SEGURO_FIANCA',
    startDate: '2025-10-15',
    endDate: '2028-10-15',
    dueDay: 10,
    repasseDay: 15,
    adjustmentIndex: 'IPCA',
    signatureStatus: 'ASSINADO',
    status: 'ATIVO',
    beneficiaries: [
      {
        id: 'ben_1',
        name: 'Dra. Helena Fontes da Silva (Cônjuge Meeira)',
        relationship: 'Viúva Meeira / Titular',
        cpfCnpj: '124.589.632-00',
        percent: 50,
        pixKeyType: 'CPF',
        pixKey: '124.589.632-00',
        bankName: 'Itaú Unibanco'
      },
      {
        id: 'ben_2',
        name: 'Lucas Fontes da Silva (Filho / Herdeiro)',
        relationship: 'Filho / Herdeiro',
        cpfCnpj: '389.412.558-91',
        percent: 25,
        pixKeyType: 'EMAIL',
        pixKey: 'lucas.fontes@gmail.com',
        bankName: 'Nubank'
      },
      {
        id: 'ben_3',
        name: 'Mariana Fontes da Silva (Filha / Herdeira)',
        relationship: 'Filha / Herdeira',
        cpfCnpj: '412.908.771-44',
        percent: 25,
        pixKeyType: 'TELEFONE',
        pixKey: '(11) 99876-5432',
        bankName: 'Banco do Brasil'
      }
    ],
    insurance: {
      guaranteeType: 'SEGURO_FIANCA',
      guaranteeCompany: 'Porto Seguro Aluguel',
      guaranteePolicyNumber: 'APO-PORTO-98412-2026',
      guaranteeMonthlyCost: 260,
      fireInsuranceCompany: 'Tokio Marine Seguradora',
      fireInsurancePolicyNumber: 'INC-TOKIO-7712',
      fireInsuranceMonthlyCost: 45
    },
    expenses: [
      {
        id: 'exp_1',
        description: 'Taxa Bancária de Emissão de Boleto/Pix',
        amount: 3.49,
        type: 'TAXA_BANCARIA',
        paidBy: 'IMOBILIARIA',
        deductFromRepasse: true,
        dueDate: '2026-09-10'
      }
    ],
    lastAdjustedAt: '2025-10-15'
  },
  {
    id: 'cnt_002',
    code: 'LOC-2026-905',
    propertyCode: 'AP-PINHEIROS-18',
    propertyAddress: 'Rua dos Pinheiros, 890 - Ap 141, Pinheiros, SP',
    tenantName: 'Mariana Duarte Souza',
    tenantCpf: '412.765.340-90',
    tenantEmail: 'mariana.duarte@advocacia.com.br',
    tenantPhone: '(11) 97777-2005',
    ownerName: 'Dr. Renato Barcellos',
    ownerPixKey: 'renato.barcellos@gmail.com',
    monthlyRent: 4800,
    condoFee: 980,
    iptuFee: 310,
    guaranteeFee: 192,
    adminFeePercentage: 8,
    guaranteeType: 'SEGURO_FIANCA',
    startDate: '2025-03-01',
    endDate: '2027-03-01',
    dueDay: 5,
    repasseDay: 12,
    adjustmentIndex: 'IGP-M',
    signatureStatus: 'ASSINADO',
    status: 'ATIVO',
    beneficiaries: [
      {
        id: 'ben_4',
        name: 'Dr. Renato Barcellos',
        relationship: 'Proprietário Titular',
        cpfCnpj: '098.765.432-11',
        percent: 100,
        pixKeyType: 'EMAIL',
        pixKey: 'renato.barcellos@gmail.com',
        bankName: 'Santander'
      }
    ],
    insurance: {
      guaranteeType: 'SEGURO_FIANCA',
      guaranteeCompany: 'CredPago / Too Seguros',
      guaranteePolicyNumber: 'CP-TOO-849102',
      guaranteeMonthlyCost: 192,
      fireInsuranceCompany: 'Porto Seguro',
      fireInsurancePolicyNumber: 'INC-88192',
      fireInsuranceMonthlyCost: 35
    }
  },
  {
    id: 'cnt_003',
    code: 'LOC-2026-906',
    propertyCode: 'COB-MOEMA-05',
    propertyAddress: 'Av. Rouxinol, 450 - Cobertura Duplex, Moema, SP',
    tenantName: 'Rodrigo Santoro de Oliveira',
    tenantCpf: '221.908.765-33',
    tenantEmail: 'rodrigo.santoro@techbrasil.io',
    tenantPhone: '(11) 98888-4321',
    ownerName: 'Irmãos Carvalho Copropriedade',
    ownerPixKey: 'repasse.carvalho@copropriedade.com.br',
    monthlyRent: 9500,
    condoFee: 2100,
    iptuFee: 750,
    guaranteeFee: 380,
    adminFeePercentage: 10,
    guaranteeType: 'SEGURO_FIANCA',
    startDate: '2025-11-01',
    endDate: '2028-11-01',
    dueDay: 8,
    repasseDay: 14,
    adjustmentIndex: 'IPCA',
    signatureStatus: 'ASSINADO',
    status: 'ATIVO',
    beneficiaries: [
      {
        id: 'ben_5',
        name: 'Guilherme Carvalho (Coproprietário)',
        relationship: 'Irmão Coproprietário',
        cpfCnpj: '234.567.890-12',
        percent: 50,
        pixKeyType: 'CPF',
        pixKey: '234.567.890-12',
        bankName: 'Bradesco'
      },
      {
        id: 'ben_6',
        name: 'Camila Carvalho (Coproprietária)',
        relationship: 'Irmã Coproprietária',
        cpfCnpj: '345.678.901-23',
        percent: 50,
        pixKeyType: 'EMAIL',
        pixKey: 'camila.carvalho@design.com',
        bankName: 'Itaú Unibanco'
      }
    ]
  },
  {
    id: 'cnt_004',
    code: 'LOC-2026-907',
    propertyCode: 'ST-VILAMAD-12',
    propertyAddress: 'Rua Harmonia, 320 - Studio 402, Vila Madalena, SP',
    tenantName: 'Thiago Nogueira Ramos',
    tenantCpf: '512.334.890-02',
    tenantEmail: 'thiago.ramos@agencia.com.br',
    tenantPhone: '(11) 97123-8899',
    ownerName: 'Sra. Beatriz Alcantara',
    ownerPixKey: 'beatriz.alcantara@uol.com.br',
    monthlyRent: 3800,
    condoFee: 650,
    iptuFee: 180,
    guaranteeFee: 152,
    adminFeePercentage: 10,
    guaranteeType: 'CAUCAO',
    startDate: '2025-06-15',
    endDate: '2027-06-15',
    dueDay: 15,
    repasseDay: 20,
    adjustmentIndex: 'IVAR',
    signatureStatus: 'ASSINADO',
    status: 'INADIMPLENTE',
    beneficiaries: [
      {
        id: 'ben_7',
        name: 'Sra. Beatriz Alcantara',
        relationship: 'Proprietária Titular',
        cpfCnpj: '112.443.556-77',
        percent: 100,
        pixKeyType: 'EMAIL',
        pixKey: 'beatriz.alcantara@uol.com.br',
        bankName: 'Caixa Econômica'
      }
    ]
  }
];

export const INITIAL_RENTAL_INVOICES: RentalInvoice[] = [
  {
    id: 'inv_101',
    contractId: 'cnt_001',
    contractCode: 'LOC-2026-904',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    tenantName: 'Lucas Ferraz Medeiros',
    tenantPhone: '(11) 98765-4321',
    competenceMonth: '09/2026',
    dueDate: '2026-09-10',
    paidAt: '2026-09-09T14:32:00',
    rentAmount: 6500,
    condoAmount: 1400,
    iptuAmount: 480,
    insuranceAmount: 260,
    expensesAmount: 0,
    totalAmount: 8640,
    status: 'PAGO',
    barcodeNumber: '23793.38128 60000.123456 12345.678901 1 98420000864000',
    pixCopyPaste: '00020126580014br.gov.bcb.pix0136loc-904-8640-asaas52040000530398654088640.005802BR5920AcertGo Locacao6009Sao Paulo62070503***6304C2D1',
    paymentMethod: 'PIX',
    repassesSettled: true
  },
  {
    id: 'inv_102',
    contractId: 'cnt_002',
    contractCode: 'LOC-2026-905',
    propertyAddress: 'Rua dos Pinheiros, 890 - Ap 141, Pinheiros, SP',
    tenantName: 'Mariana Duarte Souza',
    tenantPhone: '(11) 97777-2005',
    competenceMonth: '09/2026',
    dueDate: '2026-09-05',
    paidAt: '2026-09-05T09:15:00',
    rentAmount: 4800,
    condoAmount: 980,
    iptuAmount: 310,
    insuranceAmount: 192,
    expensesAmount: 0,
    totalAmount: 6282,
    status: 'PAGO',
    barcodeNumber: '23793.38128 60000.223456 22345.678901 2 98420000628200',
    pixCopyPaste: '00020126580014br.gov.bcb.pix0136loc-905-6282-asaas52040000530398654086282.005802BR5920AcertGo Locacao6009Sao Paulo62070503***6304E8A2',
    paymentMethod: 'BOLETO',
    repassesSettled: true
  },
  {
    id: 'inv_103',
    contractId: 'cnt_003',
    contractCode: 'LOC-2026-906',
    propertyAddress: 'Av. Rouxinol, 450 - Cobertura Duplex, Moema, SP',
    tenantName: 'Rodrigo Santoro de Oliveira',
    tenantPhone: '(11) 98888-4321',
    competenceMonth: '09/2026',
    dueDate: '2026-09-08',
    rentAmount: 9500,
    condoAmount: 2100,
    iptuAmount: 750,
    insuranceAmount: 380,
    expensesAmount: 0,
    penaltyAmount: 254.60, // 2% multa
    interestAmount: 127.30, // juros
    totalAmount: 13111.90,
    status: 'ATRASADO',
    daysOverdue: 16,
    barcodeNumber: '23793.38128 60000.323456 32345.678901 3 98420001311190',
    pixCopyPaste: '00020126580014br.gov.bcb.pix0136loc-906-13111-asaas520400005303986540913111.905802BR5920AcertGo Locacao6009Sao Paulo62070503***6304F119',
    repassesSettled: false
  },
  {
    id: 'inv_104',
    contractId: 'cnt_004',
    contractCode: 'LOC-2026-907',
    propertyAddress: 'Rua Harmonia, 320 - Studio 402, Vila Madalena, SP',
    tenantName: 'Thiago Nogueira Ramos',
    tenantPhone: '(11) 97123-8899',
    competenceMonth: '09/2026',
    dueDate: '2026-09-15',
    rentAmount: 3800,
    condoAmount: 650,
    iptuAmount: 180,
    insuranceAmount: 152,
    expensesAmount: 0,
    penaltyAmount: 95.64,
    interestAmount: 38.25,
    totalAmount: 4915.89,
    status: 'ATRASADO',
    daysOverdue: 9,
    barcodeNumber: '23793.38128 60000.423456 42345.678901 4 98420000491589',
    pixCopyPaste: '00020126580014br.gov.bcb.pix0136loc-907-4915-asaas52040000530398654084915.895802BR5920AcertGo Locacao6009Sao Paulo62070503***6304A312',
    repassesSettled: false
  },
  {
    id: 'inv_105',
    contractId: 'cnt_001',
    contractCode: 'LOC-2026-904',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    tenantName: 'Lucas Ferraz Medeiros',
    tenantPhone: '(11) 98765-4321',
    competenceMonth: '08/2026',
    dueDate: '2026-08-10',
    rentAmount: 6500,
    condoAmount: 1400,
    iptuAmount: 480,
    insuranceAmount: 260,
    expensesAmount: 0,
    penaltyAmount: 172.80,
    interestAmount: 86.40,
    totalAmount: 8899.20,
    status: 'ATRASADO',
    daysOverdue: 45,
    barcodeNumber: '23793.38128 60000.523456 52345.678901 5 98420000889920',
    pixCopyPaste: '00020126580014br.gov.bcb.pix0136loc-904-ago-asaas52040000530398654088899.205802BR5920AcertGo Locacao6009Sao Paulo62070503***6304B721',
    repassesSettled: false
  }
];

export const INITIAL_COLLECTION_RULES: CollectionRuleStep[] = [
  {
    id: 'rule_1',
    dayOffset: -5,
    title: 'D-5: Lembrete Preventivo',
    channel: 'WHATSAPP',
    active: true,
    messageTemplate: 'Olá, {inquilino}! Lembramos que o aluguel referente ao imóvel {imovel} vence em 5 dias ({vencimento}). Você pode pagar com PIX Copia e Cola ou pelo código de barras anexo. Bom dia!'
  },
  {
    id: 'rule_2',
    dayOffset: 0,
    title: 'D-0: Dia do Vencimento',
    channel: 'WHATSAPP',
    active: true,
    messageTemplate: 'Olá, {inquilino}! Hoje é o vencimento do seu aluguel no valor de {valor_total}. Pague até às 23h59 via PIX para evitar multas contratuais. Chave PIX: {pix_copia_cola}'
  },
  {
    id: 'rule_3',
    dayOffset: 1,
    title: 'D+1: Aviso Suave de Compensação',
    channel: 'WHATSAPP',
    active: true,
    messageTemplate: 'Olá, {inquilino}. Não identificamos o pagamento do aluguel vencido ontem ({vencimento}). Caso já tenha efetuado, por favor desconsidere ou envie o comprovante por aqui!'
  },
  {
    id: 'rule_4',
    dayOffset: 5,
    title: 'D+5: Notificação com Multa e Juros',
    channel: 'WHATSAPP',
    active: true,
    messageTemplate: 'Prezado(a) {inquilino}, seu aluguel está com 5 dias de atraso. Informamos a incidência de multa contratual de 2% e juros de mora. Segue o boleto atualizado com valor corrigido de {valor_corrigido}.'
  },
  {
    id: 'rule_5',
    dayOffset: 15,
    title: 'D+15: Notificação Pré-Jurídica & Negativação',
    channel: 'MULTI',
    active: true,
    messageTemplate: 'NOTIFICAÇÃO FORMAL: Constatamos inadimplência de 15 dias no contrato {contrato}. Para evitar envio do débito para negativação em cartório e execução de seguro fiança, regularize hoje pelo link.'
  }
];

export const INITIAL_COLLECTION_NOTIFICATIONS: CollectionNotification[] = [
  {
    id: 'notif_1',
    invoiceId: 'inv_103',
    contractCode: 'LOC-2026-906',
    tenantName: 'Rodrigo Santoro de Oliveira',
    channel: 'WHATSAPP',
    message: 'Prezado Rodrigo Santoro, seu aluguel está com 16 dias de atraso (Venc: 08/09). Valor com multa e juros: R$ 13.111,90.',
    sentAt: 'Hoje às 09:30',
    status: 'LIDO',
    triggerType: 'AUTOMATICO_REGUA'
  },
  {
    id: 'notif_2',
    invoiceId: 'inv_104',
    contractCode: 'LOC-2026-907',
    tenantName: 'Thiago Nogueira Ramos',
    channel: 'WHATSAPP',
    message: 'Prezado Thiago Nogueira, seu aluguel venceu dia 15/09. Boleto atualizado gerado no valor de R$ 4.915,89.',
    sentAt: 'Ontem às 10:15',
    status: 'ENTREGUE',
    triggerType: 'AUTOMATICO_REGUA'
  },
  {
    id: 'notif_3',
    invoiceId: 'inv_101',
    contractCode: 'LOC-2026-904',
    tenantName: 'Lucas Ferraz Medeiros',
    channel: 'WHATSAPP',
    message: 'Olá Lucas! Lembrete preventivo: seu aluguel vence dia 10/09. Chave PIX anexada.',
    sentAt: '05/09/2026 às 08:00',
    status: 'LIDO',
    triggerType: 'AUTOMATICO_REGUA'
  }
];

export const INITIAL_ADJUSTMENTS: ContractAdjustmentRecord[] = [
  {
    id: 'adj_1',
    contractId: 'cnt_001',
    contractCode: 'LOC-2026-904',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    tenantName: 'Lucas Ferraz Medeiros',
    anniversaryDate: '2026-10-15',
    indexUsed: 'IPCA',
    indexRatePercent: 3.92,
    currentRent: 6500,
    newRent: 6754.80,
    differenceAmount: 254.80,
    status: 'PENDENTE',
    effectiveDate: '2026-10-15'
  },
  {
    id: 'adj_2',
    contractId: 'cnt_003',
    contractCode: 'LOC-2026-906',
    propertyAddress: 'Av. Rouxinol, 450 - Cobertura Duplex, Moema, SP',
    tenantName: 'Rodrigo Santoro de Oliveira',
    anniversaryDate: '2026-11-01',
    indexUsed: 'IPCA',
    indexRatePercent: 3.92,
    currentRent: 9500,
    newRent: 9872.40,
    differenceAmount: 372.40,
    status: 'PENDENTE',
    effectiveDate: '2026-11-01'
  }
];

export const INITIAL_REPASSE_SPLITS: RepasseSplitPayment[] = [
  {
    id: 'rep_001',
    contractId: 'cnt_001',
    contractCode: 'LOC-2026-904',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    tenantName: 'Lucas Ferraz Medeiros',
    competenceMonth: '09/2026',
    totalCollected: 8640,
    adminFeePercent: 10,
    adminFeeAmount: 650, // 10% sobre aluguel
    deductionsAmount: 1400 + 480 + 260 + 3.49, // condomínio + IPTU + seguro + taxa boleto
    netRepasseAmount: 5846.51,
    status: 'PAGO',
    settledAt: '2026-09-15T11:20:00',
    beneficiariesPayout: [
      {
        beneficiaryId: 'ben_1',
        name: 'Dra. Helena Fontes da Silva',
        relationship: 'Viúva Meeira / Titular',
        cpfCnpj: '124.589.632-00',
        percent: 50,
        amount: 2923.26,
        pixKey: '124.589.632-00',
        status: 'PAGO',
        transactionId: 'E9841202609151120BB984'
      },
      {
        beneficiaryId: 'ben_2',
        name: 'Lucas Fontes da Silva',
        relationship: 'Filho / Herdeiro',
        cpfCnpj: '389.412.558-91',
        percent: 25,
        amount: 1461.63,
        pixKey: 'lucas.fontes@gmail.com',
        status: 'PAGO',
        transactionId: 'E9841202609151120NU331'
      },
      {
        beneficiaryId: 'ben_3',
        name: 'Mariana Fontes da Silva',
        relationship: 'Filha / Herdeira',
        cpfCnpj: '412.908.771-44',
        percent: 25,
        amount: 1461.62,
        pixKey: '(11) 99876-5432',
        status: 'PAGO',
        transactionId: 'E9841202609151120BB772'
      }
    ]
  },
  {
    id: 'rep_002',
    contractId: 'cnt_002',
    contractCode: 'LOC-2026-905',
    propertyAddress: 'Rua dos Pinheiros, 890 - Ap 141, Pinheiros, SP',
    tenantName: 'Mariana Duarte Souza',
    competenceMonth: '09/2026',
    totalCollected: 6282,
    adminFeePercent: 8,
    adminFeeAmount: 384,
    deductionsAmount: 980 + 310 + 192 + 3.49,
    netRepasseAmount: 4412.51,
    status: 'PAGO',
    settledAt: '2026-09-12T10:15:00',
    beneficiariesPayout: [
      {
        beneficiaryId: 'ben_4',
        name: 'Dr. Renato Barcellos',
        relationship: 'Proprietário Titular',
        cpfCnpj: '098.765.432-11',
        percent: 100,
        amount: 4412.51,
        pixKey: 'renato.barcellos@gmail.com',
        status: 'PAGO',
        transactionId: 'E9841202609121015SAN441'
      }
    ]
  }
];

export const MONTHLY_COLLECTION_CHART_DATA = [
  { month: 'Abr', collected: 8800, overdue: 0 },
  { month: 'Mai', collected: 14500, overdue: 0 },
  { month: 'Jun', collected: 0, overdue: 0 },
  { month: 'Jul', collected: 0, overdue: 15200 },
  { month: 'Ago', collected: 0, overdue: 8899 },
  { month: 'Set', collected: 14922, overdue: 18027 }
];

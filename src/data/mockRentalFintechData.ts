export interface RentAdvanceProposal {
  id: string;
  contractCode: string;
  propertyAddress: string;
  ownerName: string;
  ownerCpfCnpj: string;
  ownerPixKey: string;
  monthlyRent: number;
  monthsRequested: number; // 1 to 24 months
  grossAmount: number;
  discountRateMonthly: number; // e.g. 1.89%
  discountAmount: number;
  adminFeeAmount: number;
  agencyTakeRateAmount: number; // Agency commission (e.g. 2% of gross)
  netAmountToOwner: number;
  status: 'SIMULADO' | 'APROVADO' | 'EM_ANALISE' | 'DEPOSITADO_PIX' | 'CONCLUIDO';
  requestedAt: string;
  disbursedAt?: string;
  fundoParceiro: string; // e.g. 'FIDC AcertGo Recebíveis / Banco Itaú'
}

export interface InsurancePolicyRecord {
  id: string;
  contractCode: string;
  propertyAddress: string;
  tenantName: string;
  tenantCpf: string;
  insurerName: 'Porto Seguro' | 'CredPago' | 'Velo' | 'Pottencial' | 'Too Seguros' | 'Icatu Capitalização';
  guaranteeType: 'SEGURO_FIANCA' | 'CARTAO_CREDITO' | 'OPEN_FINANCE' | 'TITULO_CAPITALIZACAO' | 'CAUCAO';
  policyNumber: string;
  status: 'VIGENTE' | 'EM_COTACAO' | 'ANALISE_CREDITO' | 'APROVADO' | 'SINISTRO_ACIONADO';
  coverageValue: number; // e.g. R$ 150.000 (30x aluguel)
  monthlyCost: number;
  costBearer: 'INQUILINO' | 'PROPRIETARIO' | 'IMOBILIARIA';
  coversRent: boolean;
  coversCondoAndIptu: boolean;
  coversDamageAndPaint: boolean;
  coversLegalExpenses: boolean;
  expiresAt: string;
}

export interface ClientNotificationLog {
  id: string;
  recipientType: 'INQUILINO' | 'PROPRIETARIO';
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  contractCode: string;
  triggerType: 
    | 'AVISO_VENCIMENTO_D5'
    | 'AVISO_VENCIMENTO_D1'
    | 'CONFIRMACAO_PIX_RECEBIDO'
    | 'REPASSE_PROPRIETARIO_EFETUADO'
    | 'AVISO_REAJUSTE_ANUAL'
    | 'LEMBRETE_RENOVACAO_90D'
    | 'AGENDAMENTO_VISTORIA';
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH';
  subject: string;
  messagePreview: string;
  sentAt: string;
  deliveryStatus: 'ENTREGUE' | 'LIDO' | 'ENVIADO' | 'ERRO';
  pixCodeIncluded?: boolean;
}

export const INITIAL_RENT_ADVANCE_PROPOSALS: RentAdvanceProposal[] = [
  {
    id: 'adv_001',
    contractCode: 'LOC-2026-904',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    ownerName: 'Espólio de Arnaldo Fontes da Silva',
    ownerCpfCnpj: '124.589.632-00',
    ownerPixKey: 'repasse.fontes@silva.com.br',
    monthlyRent: 6500,
    monthsRequested: 12,
    grossAmount: 78000,
    discountRateMonthly: 1.89,
    discountAmount: 8840,
    adminFeeAmount: 7800, // 10%
    agencyTakeRateAmount: 1560, // 2% comissão da imobiliária
    netAmountToOwner: 61360,
    status: 'DEPOSITADO_PIX',
    requestedAt: '2026-09-12T14:30:00Z',
    disbursedAt: '2026-09-13T10:15:00Z',
    fundoParceiro: 'FIDC AcertGo Recebíveis • Banco BTG Pactual'
  },
  {
    id: 'adv_002',
    contractCode: 'LOC-2026-905',
    propertyAddress: 'Rua dos Pinheiros, 890 - Ap 141, Pinheiros, SP',
    ownerName: 'Dr. Renato Barcellos',
    ownerCpfCnpj: '234.876.541-20',
    ownerPixKey: 'renato.barcellos@gmail.com',
    monthlyRent: 4800,
    monthsRequested: 6,
    grossAmount: 28800,
    discountRateMonthly: 1.79,
    discountAmount: 1820,
    adminFeeAmount: 2880,
    agencyTakeRateAmount: 576,
    netAmountToOwner: 24100,
    status: 'APROVADO',
    requestedAt: '2026-09-22T09:00:00Z',
    fundoParceiro: 'FIDC QuintoCred / AcertGo Capital'
  },
  {
    id: 'adv_003',
    contractCode: 'LOC-2026-906',
    propertyAddress: 'Rua Bela Cintra, 2100 - Cj 61, Cerqueira César, SP',
    ownerName: 'Beatriz Vasconcelos de Moraes',
    ownerCpfCnpj: '389.214.509-32',
    ownerPixKey: 'beatriz.moraes@imoveis.com.br',
    monthlyRent: 3800,
    monthsRequested: 10,
    grossAmount: 38000,
    discountRateMonthly: 1.85,
    discountAmount: 3950,
    adminFeeAmount: 3800,
    agencyTakeRateAmount: 760,
    netAmountToOwner: 30250,
    status: 'EM_ANALISE',
    requestedAt: '2026-09-24T11:20:00Z',
    fundoParceiro: 'FIDC AcertGo Recebíveis • Banco BTG Pactual'
  }
];

export const INITIAL_INSURANCE_POLICIES: InsurancePolicyRecord[] = [
  {
    id: 'pol_001',
    contractCode: 'LOC-2026-904',
    propertyAddress: 'Alameda Lorena, 1420 - Ap 82, Jardins, SP',
    tenantName: 'Lucas Ferraz Medeiros',
    tenantCpf: '349.812.908-11',
    insurerName: 'Porto Seguro',
    guaranteeType: 'SEGURO_FIANCA',
    policyNumber: 'APO-PORTO-98412-2026',
    status: 'VIGENTE',
    coverageValue: 260000, // 40x aluguel
    monthlyCost: 260,
    costBearer: 'INQUILINO',
    coversRent: true,
    coversCondoAndIptu: true,
    coversDamageAndPaint: true,
    coversLegalExpenses: true,
    expiresAt: '2028-10-15'
  },
  {
    id: 'pol_002',
    contractCode: 'LOC-2026-905',
    propertyAddress: 'Rua dos Pinheiros, 890 - Ap 141, Pinheiros, SP',
    tenantName: 'Mariana Duarte Souza',
    tenantCpf: '412.765.340-90',
    insurerName: 'CredPago',
    guaranteeType: 'CARTAO_CREDITO',
    policyNumber: 'CP-LOFT-2026-8812',
    status: 'VIGENTE',
    coverageValue: 192000,
    monthlyCost: 384,
    costBearer: 'INQUILINO',
    coversRent: true,
    coversCondoAndIptu: true,
    coversDamageAndPaint: false,
    coversLegalExpenses: true,
    expiresAt: '2027-04-10'
  },
  {
    id: 'pol_003',
    contractCode: 'LOC-2026-906',
    propertyAddress: 'Rua Bela Cintra, 2100 - Cj 61, Cerqueira César, SP',
    tenantName: 'Engenharia & Projetos Paulista LTDA',
    tenantCpf: '34.891.204/0001-92',
    insurerName: 'Velo',
    guaranteeType: 'OPEN_FINANCE',
    policyNumber: 'VELO-OF-77123-SP',
    status: 'VIGENTE',
    coverageValue: 152000,
    monthlyCost: 304,
    costBearer: 'INQUILINO',
    coversRent: true,
    coversCondoAndIptu: true,
    coversDamageAndPaint: true,
    coversLegalExpenses: true,
    expiresAt: '2026-11-20'
  },
  {
    id: 'pol_004',
    contractCode: 'LOC-2026-907',
    propertyAddress: 'Av. Brigadeiro Faria Lima, 3477 - Ap 1802, Itaim Bibi, SP',
    tenantName: 'Dr. Fernando Siqueira de Abreu',
    tenantCpf: '198.423.891-00',
    insurerName: 'Icatu Capitalização',
    guaranteeType: 'TITULO_CAPITALIZACAO',
    policyNumber: 'CAP-ICATU-12903',
    status: 'VIGENTE',
    coverageValue: 110000, // 10x aluguel caucionado
    monthlyCost: 0, // Caução à vista
    costBearer: 'INQUILINO',
    coversRent: true,
    coversCondoAndIptu: true,
    coversDamageAndPaint: false,
    coversLegalExpenses: false,
    expiresAt: '2027-08-15'
  }
];

export const INITIAL_CLIENT_NOTIFICATIONS: ClientNotificationLog[] = [
  {
    id: 'notif_001',
    recipientType: 'INQUILINO',
    recipientName: 'Lucas Ferraz Medeiros',
    recipientPhone: '(11) 98765-4321',
    recipientEmail: 'lucas.medeiros@gmail.com',
    contractCode: 'LOC-2026-904',
    triggerType: 'AVISO_VENCIMENTO_D5',
    channel: 'WHATSAPP',
    subject: 'Lembrete de Aluguel • Vencimento em 5 dias',
    messagePreview: 'Olá Lucas! Seu boleto do aluguel vence em 10/10. Chave Pix Copia e Cola disponível para pagamento instantâneo.',
    sentAt: '2026-10-05T08:00:00Z',
    deliveryStatus: 'LIDO',
    pixCodeIncluded: true
  },
  {
    id: 'notif_002',
    recipientType: 'INQUILINO',
    recipientName: 'Lucas Ferraz Medeiros',
    recipientPhone: '(11) 98765-4321',
    recipientEmail: 'lucas.medeiros@gmail.com',
    contractCode: 'LOC-2026-904',
    triggerType: 'CONFIRMACAO_PIX_RECEBIDO',
    channel: 'WHATSAPP',
    subject: 'Pagamento Confirmado • Recibo Digital AcertGo',
    messagePreview: 'Pagamento de R$ 8.640,00 identificado com sucesso! Seu recibo oficial de quitação já está disponível.',
    sentAt: '2026-10-09T14:22:00Z',
    deliveryStatus: 'LIDO',
    pixCodeIncluded: false
  },
  {
    id: 'notif_003',
    recipientType: 'PROPRIETARIO',
    recipientName: 'Espólio de Arnaldo Fontes da Silva',
    recipientPhone: '(11) 99876-5432',
    recipientEmail: 'repasse.fontes@silva.com.br',
    contractCode: 'LOC-2026-904',
    triggerType: 'REPASSE_PROPRIETARIO_EFETUADO',
    channel: 'WHATSAPP',
    subject: 'Repasse Pix Efetuado com Sucesso',
    messagePreview: 'Olá! O repasse do aluguel referente a Alameda Lorena foi liquidado via Pix para os herdeiros cadastrados.',
    sentAt: '2026-10-15T09:30:00Z',
    deliveryStatus: 'LIDO',
    pixCodeIncluded: false
  },
  {
    id: 'notif_004',
    recipientType: 'INQUILINO',
    recipientName: 'Mariana Duarte Souza',
    recipientPhone: '(11) 97777-2005',
    recipientEmail: 'mariana.duarte@advocacia.com.br',
    contractCode: 'LOC-2026-905',
    triggerType: 'AVISO_REAJUSTE_ANUAL',
    channel: 'EMAIL',
    subject: 'Notificação Oficial de Reajuste Anual (IPCA)',
    messagePreview: 'Comunicamos o reajuste anual do contrato conforme variação acumulada do IPCA (+4,18%). Novo valor a partir de Nov/2026.',
    sentAt: '2026-09-15T11:00:00Z',
    deliveryStatus: 'ENTREGUE',
    pixCodeIncluded: false
  }
];

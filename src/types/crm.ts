export type TenantId = 'tenant_matriz_sp' | 'tenant_alphaville' | 'tenant_barra' | string;

export type UserRole = 
  | 'SUPER_ADMIN'        // Administrador Global SaaS (Super Admin da Plataforma)
  | 'MASTER_ADMIN'       // Diretor Geral / Sócio (Visibilidade total da Imobiliária)
  | 'MANAGER'            // Gerente de Vendas (Supervisão de equipe, Ghost mode, Roleta)
  | 'BROKER'             // Corretor Interno (Leads próprios, reservas)
  | 'FINANCIAL_OPERATOR' // Operador Financeiro (Splits, DRE, Dimob, Contratos)
  | 'EXTERNAL_PARTNER';  // Corretor Externo / Parceiro (Espelho e submissão)

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  creci: string;
  tenantId: TenantId;
  tenantName: string;
  active: boolean;
  scorePoints: number;
  initialModule?: string;
  chosenSiteTemplate?: string;
}

export type LeadFunnelStage = 
  | 'NOVO_LEAD'
  | 'PRIMEIRO_CONTATO'
  | 'QUALIFICACAO'
  | 'VISITA_AGENDADA'
  | 'VISITA_REALIZADA'
  | 'PROPOSTA_ENVIADA'
  | 'FECHAMENTO_GANHO'
  | 'FECHAMENTO_PERDIDO';

export type LeadSource = 
  | 'WHATSAPP_DIRETO'
  | 'PORTAL_ZAP'
  | 'PORTAL_VIVAREAL'
  | 'PASSAGEM_STAND'
  | 'VISITA_IMOBILIARIA'
  | 'PLACA_QR_CODE'
  | 'INDICOU_GANHOU'
  | 'INSTAGRAM_ADS'
  | 'SITE_OFICIAL'
  | 'RODAPE_PARCEIRO';

export type FollowUpChannel = 'WHATSAPP' | 'LIGACAO' | 'VISITA' | 'EMAIL' | 'REUNIAO' | 'VIDEOCHAMADA';
export type FollowUpStatus = 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO' | 'ATRASADO';
export type FollowUpPriority = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface ClientFollowUp {
  id: string;
  leadId: string;
  title: string;
  channel: FollowUpChannel;
  scheduledAt: string; // ISO format or YYYY-MM-DDTHH:mm
  timeStr?: string; // Display time, e.g. "14:30"
  status: FollowUpStatus;
  priority: FollowUpPriority;
  notes?: string;
  assignedBrokerName: string;
  completedAt?: string;
  outcomeNotes?: string; // Result of the contact
  createdAt: string;
}

export interface LeadInteraction {
  id: string;
  leadId: string;
  type: 'WHATSAPP_MSG' | 'CALL' | 'VISIT' | 'PROPOSAL' | 'STATUS_CHANGE' | 'WHISPER_NOTE';
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  isPrivateWhisper?: boolean; // Visible only to manager/broker, invisible to client!
}

export type InterestType = 'COMPRA' | 'LOCACAO' | 'LANCAMENTO';

export interface LeadProposer {
  id: string;
  name: string;
  relationship: 'TITULAR' | 'CONJUGE' | 'SEGUNDO_COMPRADOR' | 'AVALISTA_FIADOR' | 'SOCIO' | 'OUTRO';
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  profession?: string;
  income?: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  stage: LeadFunnelStage;
  assignedBrokerId: string;
  assignedBrokerName: string;
  assignedBrokerAvatar?: string;
  interestType: InterestType;
  propertyOfInterestId?: string;
  propertyOfInterestTitle?: string;
  budgetMin: number;
  budgetMax: number;
  tags: string[];
  unreadMessagesCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  lossReason?: string;
  createdAt: string;
  timeline: LeadInteraction[];
  rating: number; // 1 to 5 stars
  followUps?: ClientFollowUp[];
  cpf?: string;
  rg?: string;
  maritalStatus?: MaritalStatus;
  birthDate?: string;
  sdrQualified?: boolean;
  sendBirthdayWishes?: boolean;
  custodyFolder?: LeadCustodyFolder;
  aiScoring?: LeadAiScoring;
  proposers?: LeadProposer[];
  brokerLockedUntil?: string;
  brokerLockPeriodDays?: number;
  qualifiedAt?: string;
  canEmitContract?: boolean;
  contractBlockReasons?: string[];
}

export interface LeadAiScoring {
  score: number; // 0 to 100
  temperature: 'HOT' | 'WARM' | 'COLD';
  probabilityPercent: number; // 0 to 100
  classification: 'ALTA_PROPENSAO' | 'MEDIA_PROPENSAO' | 'BAIXA_PROPENSAO';
  summary: string;
  keyStrengths: string[];
  riskFactors: string[];
  nextBestAction: string;
  suggestedScript: string;
  analyzedAt: string;
  timelineInteractionsAnalyzed: number;
}

export interface LeadCustodyDocument {
  id: string;
  category: 
    | 'DOCUMENTO_IDENTIDADE' 
    | 'CPF_SITUACAO' 
    | 'COMPROVANTE_RESIDENCIA' 
    | 'ESTADO_CIVIL' 
    | 'COMPROVANTE_RENDA' 
    | 'IRPF_DECLARACAO' 
    | 'OUTROS';
  title: string;
  description: string;
  required: boolean;
  status: 'PENDENTE' | 'EM_ANALISE' | 'APROVADO' | 'REJEITADO';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  sha256Hash?: string;
}

export interface LeadCustodyFolder {
  id: string;
  leadId: string;
  status: 'AGUARDANDO_ENVIO' | 'EM_CONFERENCIA' | 'AUDITADO_APROVADO' | 'PENDENCIAS';
  secureRequestToken: string;
  requestedAt: string;
  requestedByBroker: string;
  documents: LeadCustodyDocument[];
}

export interface ChatMessage {
  id: string;
  leadId: string;
  sender: 'LEAD' | 'BROKER' | 'MANAGER' | 'SYSTEM';
  senderName: string;
  text: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  type: 'TEXT' | 'AUDIO' | 'IMAGE' | 'DOCUMENT' | 'WHISPER';
  audioDurationSeconds?: number;
  mediaUrl?: string;
  isWhisperNote?: boolean; // Ghost manager mode: internal note
}

export interface RoletaMember {
  userId: string;
  name: string;
  avatar: string;
  color: string;
  active: boolean;
  weight: number;
  assignedTodayCount: number;
  lastAssignedAt?: string;
}

export interface RoletaQueue {
  id: string;
  name: string; // e.g. "Terça", "QUinta", "Plantão Fim de Semana"
  description: string;
  active: boolean;
  strategy: 'ALEATORIO' | 'ROUND_ROBIN' | 'MENOR_CARGA';
  mode: 'Manual' | 'Automático 24/7';
  scope: 'Todos' | 'Lançamentos' | 'Locações' | 'Alto Padrão';
  members: RoletaMember[];
  totalDistributedCount: number;
  history: Array<{
    id: string;
    leadName: string;
    leadPhone: string;
    assignedToBrokerName: string;
    timestamp: string;
  }>;
}

// ----------------------------------------------------
// MÓDULO SORTEIO STANDS DE VENDAS & REGRAS GPS
// ----------------------------------------------------
export interface RoletaRuleConfig {
  dailyDrawTime: string; // ex: "08:30"
  lateArrivalToleranceMinutes: number; // ex: 15 min
  maxAbsenceMinutes: number; // ex: 15 min
  absencePenalty: 'FINAL_DA_FILA' | 'PAUSA_TEMPORARIA' | 'REMOVER_DO_DIA';
  geofenceRadiusMeters: number; // Padrão: 10 metros
  autoEnforceTimeouts: boolean;
  shifts: Array<{
    id: string;
    name: string;
    drawTime: string;
    startTime: string;
    endTime: string;
  }>;
}

export type StandGpsStatus = 'VALIDADO_NO_RAIO' | 'FORA_DO_RAIO' | 'PENDENTE_GPS';
export type StandBrokerStatus = 'DISPONIVEL' | 'EM_ATENDIMENTO' | 'AUSENTE_PAUSADO' | 'ATENDIMENTO_FINALIZADO';

export interface StandBrokerAttendance {
  id: string;
  brokerId: string;
  brokerName: string;
  brokerAvatar: string;
  brokerPhone: string;
  brokerCreci: string;
  checkInTime: string;
  distanceMeters: number;
  gpsStatus: StandGpsStatus;
  queuePosition: number; // 1 = primeiro a atender
  status: StandBrokerStatus;
  absenceStartedAt?: string;
  absenceSecondsRemaining?: number;
  absenceReason?: string;
  leadsAttendedCount: number;
  userCoords?: { lat: number; lng: number };
}

export interface StandDrawRecord {
  id: string;
  timestamp: string;
  standName: string;
  shiftName: string;
  participantsCount: number;
  drawnOrder: Array<{
    position: number;
    brokerName: string;
    distanceMeters: number;
    gpsStatus: StandGpsStatus;
  }>;
}

export interface StandVendas {
  id: string;
  name: string;
  developmentTitle: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number; // 10 metros obrigatórios
  status: 'ABERTO' | 'FECHADO' | 'EM_SORTEIO';
  dailyDrawTime: string;
  maxAbsenceMinutes: number;
  activeShift: 'MANHA' | 'TARDE' | 'INTEGRAL';
  attendanceList: StandBrokerAttendance[];
  history: StandDrawRecord[];
}

export type UnitStatus = 'DISPONIVEL' | 'RESERVADO' | 'VENDIDO';

export interface DevelopmentUnit {
  id: string;
  developmentId: string;
  tower: string;
  floor: number;
  unitNumber: string;
  typology: string; // e.g. "3 Suítes", "2 Dormitórios", "Penthouse"
  privateAreaM2: number;
  parkingSpaces: number;
  sunOrientation: 'MANHA' | 'TARDE';
  price: number;
  condoFee: number;
  iptuFee: number;
  status: UnitStatus;
  reservedByBrokerId?: string;
  reservedByBrokerName?: string;
  reservedClientName?: string;
  reservationExpiresAt?: string; // ISO string for live countdown
}

export interface Development {
  id: string;
  title: string;
  builderName: string;
  neighborhood: string;
  city: string;
  deliveryDate: string;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  towers: string[];
  bannerUrl: string;
  brochureUrl: string;
  units: DevelopmentUnit[];
}

export interface OwnerRepasseBeneficiary {
  id: string;
  name: string;
  relationship: string; // ex: "Mãe / Titular", "Filho / Herdeiro", "Coproprietário", "Cônjuge"
  cpfCnpj: string;
  percent: number; // e.g. 50%
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';
  pixKey: string;
  bankName?: string;
}

export interface ContractExpense {
  id: string;
  description: string;
  amount: number;
  type: 'CONDOMINIO_EXTRA' | 'MANUTENCAO' | 'SEGURO_INCENDIO' | 'IPTU' | 'TAXA_BANCARIA' | 'OUTROS';
  paidBy: 'LOCATARIO' | 'PROPRIETARIO' | 'IMOBILIARIA';
  deductFromRepasse: boolean;
  dueDate: string;
}

export interface ContractInsurance {
  guaranteeType: 'SEGURO_FIANCA' | 'FIADOR' | 'TITULO_CAPITALIZACAO' | 'CAUCAO' | 'CARTAO_CREDITO';
  guaranteeCompany?: string; // ex: "Porto Seguro", "Pottencial", "CredPago", "Too Seguros", "Velo"
  guaranteePolicyNumber?: string;
  guaranteeMonthlyCost: number;
  fireInsuranceCompany?: string;
  fireInsurancePolicyNumber?: string;
  fireInsuranceMonthlyCost: number;
  coverageDetails?: {
    coversRent: boolean;
    coversCondoAndIptu: boolean;
    coversDamageAndPaint: boolean;
    coversLegalExpenses: boolean;
    maxCoverageValue?: number;
    approvalScore?: number;
    quoteId?: string;
    certificateUrl?: string;
  };
}

export interface RentalContract {
  id: string;
  code: string;
  propertyCode: string;
  propertyAddress: string;
  tenantName: string;
  tenantCpf: string;
  tenantEmail?: string;
  tenantPhone?: string;
  ownerName: string;
  ownerPixKey: string;
  monthlyRent: number;
  condoFee: number;
  iptuFee: number;
  guaranteeFee: number; // Seguro fiança
  adminFeePercentage: number; // e.g. 10%
  guaranteeType: 'SEGURO_FIANCA' | 'FIADOR' | 'TITULO_CAPITALIZACAO' | 'CAUCAO' | 'CARTAO_CREDITO';
  startDate: string;
  endDate: string;
  dueDay: number; // Dia de vencimento do aluguel (ex: dia 10)
  repasseDay: number; // Dia de repasse ao proprietário (ex: dia 15)
  adjustmentIndex: 'IPCA' | 'IGP-M' | 'IVAR' | 'INPC';
  signatureStatus: 'ASSINADO' | 'AGUARDANDO_INQUILINO' | 'AGUARDANDO_PROPRIETARIO';
  status: 'ATIVO' | 'ENCERRADO' | 'INADIMPLENTE';
  beneficiaries: OwnerRepasseBeneficiary[];
  expenses?: ContractExpense[];
  insurance?: ContractInsurance;
  lastAdjustedAt?: string;
  agencyLogo?: string;
}

export interface RentalInvoice {
  id: string;
  contractId: string;
  contractCode: string;
  propertyAddress: string;
  tenantName: string;
  tenantPhone: string;
  competenceMonth: string; // e.g. "09/2026"
  dueDate: string;
  paidAt?: string;
  rentAmount: number;
  condoAmount: number;
  iptuAmount: number;
  insuranceAmount: number;
  expensesAmount: number;
  penaltyAmount?: number; // Multa por atraso (2%)
  interestAmount?: number; // Juros de mora (1% a.m.)
  totalAmount: number;
  status: 'PAGO' | 'PENDENTE' | 'ATRASADO';
  daysOverdue?: number;
  barcodeNumber: string;
  pixCopyPaste: string;
  paymentMethod?: 'PIX' | 'BOLETO' | 'TED';
  repassesSettled: boolean;
}

export interface CollectionRuleStep {
  id: string;
  dayOffset: number; // -5, 0, 1, 5, 15
  title: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'MULTI';
  active: boolean;
  messageTemplate: string;
}

export interface CollectionNotification {
  id: string;
  invoiceId: string;
  contractCode: string;
  tenantName: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  message: string;
  sentAt: string;
  status: 'ENTREGUE' | 'LIDO' | 'ENVIADO';
  triggerType: 'AUTOMATICO_REGUA' | 'MANUAL';
}

export interface ContractAdjustmentRecord {
  id: string;
  contractId: string;
  contractCode: string;
  propertyAddress: string;
  tenantName: string;
  anniversaryDate: string;
  indexUsed: 'IPCA' | 'IGP-M' | 'IVAR' | 'INPC';
  indexRatePercent: number;
  currentRent: number;
  newRent: number;
  differenceAmount: number;
  status: 'PENDENTE' | 'APLICADO';
  effectiveDate: string;
}

export interface RepasseSplitPayment {
  id: string;
  contractId: string;
  contractCode: string;
  propertyAddress: string;
  tenantName: string;
  competenceMonth: string;
  totalCollected: number;
  adminFeePercent: number;
  adminFeeAmount: number;
  deductionsAmount: number;
  netRepasseAmount: number;
  status: 'PENDENTE' | 'PAGO' | 'BLOQUEADO';
  settledAt?: string;
  beneficiariesPayout: {
    beneficiaryId: string;
    name: string;
    relationship: string;
    cpfCnpj: string;
    percent: number;
    amount: number;
    pixKey: string;
    status: 'PAGO' | 'PENDENTE';
    transactionId?: string;
  }[];
}

export interface SplitCalculationResult {
  totalInvoiceAmount: number;
  breakdown: {
    rentAmount: number;
    condoAmount: number;
    iptuAmount: number;
    guaranteeFeeAmount: number;
  };
  splits: {
    platformFee: number;             // Tarifa gateway Asaas (R$ 3,49 fixo ou %)
    realEstateAgencyAdmFee: number;   // Taxa de administração (10% sobre aluguel)
    netOwnerPayout: number;           // Repasse líquido do Proprietário
    insuranceVendorShare: number;     // Repasse seguradora (CredPago / Porto)
    condoPayout: number;              // Repasse administradora condomínio
    iptuPayout: number;               // Repasse prefeitura
    taxWithheldProvision: number;     // Provisão ISS/IRRF para emissão da NFS-e
  };
  executionTimestamp: string;
  paymentMethod: 'PIX_DINAMICO' | 'BOLETO_BANCARIO';
  pixCopyPasteCode: string;
  qrCodeUrl: string;
  webhookLog: {
    gateway: string;
    status: 'AUTHORIZED' | 'SPLIT_SETTLED';
    settledInSeconds: number;
    transactionId: string;
  };
}

export interface CommissionSplitRule {
  id: string;
  name: string;
  captadorPercent: number;    // e.g. 40%
  fechadorPercent: number;    // e.g. 40%
  gerentePercent: number;     // e.g. 10%
  imobiliariaPercent: number; // e.g. 10%
}

export interface CommissionDeal {
  id: string;
  code: string;
  propertyTitle: string;
  propertyId?: string;
  salePrice: number;
  totalCommissionPercent: number; // e.g. 6%
  totalCommissionValue: number;
  calculationModel?: 'SOBRE_VGV' | 'PERCENTUAL_COMISSAO'; // 1. Sobre o VGV | 2. Comissão em Porcentual (ex.: 6%)
  calculationDetail?: string;
  captadorName: string;
  captadorValue: number;
  captadorPercent?: number;
  fechadorName: string;
  fechadorValue: number;
  fechadorPercent?: number;
  gerenteName: string;
  gerenteValue: number;
  gerentePercent?: number;
  coordenadorName?: string;
  coordenadorValue?: number;
  coordenadorPercent?: number;
  imobiliariaValue: number;
  imobiliariaPercent?: number;
  parceiroName?: string;
  parceiroValue?: number;
  status: 'RECEBIDO' | 'A_RECEBER_FUTURO' | 'PAGO_COM_RPA';
  closedAt: string;
  rpaDocumentId?: string;
  notes?: string;
}

export type InspectionGeneralState = 'PESSIMO' | 'REGULAR' | 'BOM' | 'OTIMO';
export type InspectionPaintState = 'NOVA' | 'BOA' | 'REGULAR' | 'RUIM' | 'PESSIMA';

export interface InspectionPhoto {
  id: string;
  url: string;
  caption?: string;
  timestamp: string;
}

export interface InspectionRoomItem {
  id: string;
  name: string; // e.g. "Pintura das Paredes", "Piso", "Portas e Fechaduras", "Tomadas", "Vidros"
  condition: 'NOVO' | 'BOM' | 'DANIFICADO';
  state?: InspectionGeneralState; // Péssimo, Regular, Bom, Ótimo
  paintState?: InspectionPaintState; // Nova, Boa, Regular, Ruim, Péssima
  observations: string;
  hasPhoto: boolean;
  photos?: InspectionPhoto[];
}

export interface InspectionRoom {
  id?: string;
  roomName: string;
  overallState?: InspectionGeneralState;
  paintState?: InspectionPaintState;
  observations?: string;
  items: InspectionRoomItem[];
  photos?: InspectionPhoto[];
}

export interface PropertyInspection {
  id: string;
  code?: string;
  propertyId?: string;
  propertyCode: string;
  propertyAddress: string;
  type: 'ENTRADA' | 'SAIDA';
  inspectorName: string;
  inspectorCpfCreci?: string;
  clientName: string;
  clientDocument?: string;
  ownerName?: string;
  date: string;
  time?: string;
  status: 'CONCLUIDA' | 'EM_ANDAMENTO' | 'ASSINADA_DIGITALMENTE';
  offlineCached: boolean;
  generalObservations?: string;
  meterReadings?: {
    water?: string;
    electricity?: string;
    gas?: string;
  };
  keysDelivered?: {
    description: string;
    quantity: number;
  }[];
  rooms: InspectionRoom[];
}

export interface PropertyKeyRecord {
  id: string;
  keyNumber: string;
  propertyCode: string;
  propertyAddress: string;
  status: 'NO_CLAVICULARIO' | 'EM_VISITA' | 'MANUTENCAO';
  checkedOutToBrokerName?: string;
  checkedOutAt?: string;
  expectedReturnAt?: string;
  isOverdue?: boolean;
}

export type CCABankStage = 
  | 'SIMULACAO' 
  | 'COLETA_DOCUMENTOS' 
  | 'ANALISE_RISCO' 
  | 'AVALIACAO_ENGENHARIA' 
  | 'EMISSAO_CONTRATO' 
  | 'PAGO_COMISSAO_CCA';

export interface CreditProposalCCA {
  id: string;
  clientName: string;
  clientCpf: string;
  bank: 'CAIXA_ECONOMICA' | 'ITAU' | 'SANTANDER' | 'BRADESCO';
  propertyValue: number;
  downPaymentValue: number;
  financedValue: number;
  termMonths: number;
  interestRateAnnual: number;
  estimatedMonthlyPayment: number;
  stage: CCABankStage;
  bankCommissionFee: number; // Receita bancária da imobiliária (ex: 1.2%)
  updatedAt: string;
}

export interface BottleneckAlert {
  id: string;
  severity: 'CRITICO' | 'ALERTA' | 'OPORTUNIDADE';
  title: string;
  description: string;
  recommendedAction: string;
  metricContext: string;
}

export interface FleetVehicle {
  id: string;
  model: string;
  plate: string;
  year: number;
  status: 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO';
  currentKm: number;
  fuelLevelPercent: number;
  assignedBrokerName?: string;
  nextRevisionKm: number;
  lastCleanedAt: string;
}

export interface CompanyAsset {
  id: string;
  assetCode: string; // e.g. "PAT-0042"
  title: string;
  category: 'NOTEBOOK' | 'MONITOR' | 'MOBILIARIO' | 'SMARTPHONE';
  assignedUser: string;
  branch: string;
  purchaseDate: string;
  estimatedValue: number;
  condition: 'EXCELENTE' | 'BOM' | 'DESGASTADO';
}

export interface ReferralLead {
  id: string;
  referrerName: string;
  referrerPhone: string;
  referrerPix: string;
  relationship: 'CLIENTE_ANTIGO' | 'PORTEIRO' | 'ZELADOR' | 'PARCEIRO_EXTERNO';
  leadClientName: string;
  leadClientPhone: string;
  interestType: 'COMPRA' | 'LOCACAO';
  status: 'RECEBIDA' | 'EM_NEGOCIACAO' | 'FECHADA_PREMIO_LIBERADO';
  bountyRewardAmount: number; // e.g. R$ 1.500
  submittedAt: string;
}

export interface LMSLesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl: string;
  description: string;
  isCompleted?: boolean;
}

export interface LMSModule {
  id: string;
  title: string;
  lessons: LMSLesson[];
}

export interface LMSQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LMSCourse {
  id: string;
  title: string;
  category: 'VENDAS' | 'FINANCIAMENTO' | 'JURIDICO' | 'ALTO_PADRAO' | 'MARKETING' | 'ATENDIMENTO';
  source: 'PLATAFORMA_ACERTGO' | 'IMOBILIARIA_INTERNO';
  durationMinutes: number;
  lessonsCount: number;
  completedByCount: number;
  hasAudioPodcast: boolean;
  podcastAudioUrl?: string;
  coverImage: string;
  summary: string;
  instructor: string;
  instructorRole: string;
  instructorAvatar?: string;
  xpPoints: number;
  badgeName?: string;
  badgeIcon?: string;
  rating?: number;
  level?: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  tags?: string[];
  modules?: LMSModule[];
  quiz?: LMSQuizQuestion[];
  downloadMaterials?: Array<{ title: string; type: string; size: string }>;
  isEnrolled?: boolean;
  progressPercent?: number;
  certificateIssued?: boolean;
  createdAt?: string;
}

export interface LMSLeaderboardStudent {
  rank: number;
  id: string;
  name: string;
  role: string;
  avatar: string;
  levelTitle: string;
  levelNumber: number;
  totalXp: number;
  completedCoursesCount: number;
  badgesCount: number;
  streakDays: number;
}

export interface BrandEquityConfig {
  primaryColor: string;
  accentColor: string;
  headingFont: 'Poppins' | 'Outfit' | 'Montserrat';
  bodyFont: 'Outfit' | 'Inter' | 'Plus Jakarta Sans';
  toneOfVoice: 'SOFISTICADO' | 'DINAMICO_JOVEM' | 'CONSULTIVO_TECNICO';
  allowedPhrasingRules: string[];
  mandatoryDisclaimer: string;
}

// ----------------------------------------------------
// MÓDULO PROPRIETÁRIOS (PF & PJ)
// ----------------------------------------------------
export type OwnerPersonType = 'PF' | 'PJ';

export type OwnerStatus = 'ATIVO' | 'EM_ANALISE' | 'BLOQUEADO';

export type MaritalStatus = 
  | 'SOLTEIRO' 
  | 'CASADO' 
  | 'DIVORCIADO' 
  | 'VIUVO' 
  | 'UNIAO_ESTAVEL';

export interface OwnerBankDetails {
  bankCode: string;
  bankName: string;
  accountType: 'CORRENTE' | 'POUPANCA' | 'PAGAMENTO';
  agency: string;
  accountNumber: string;
  accountDigit: string;
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';
  pixKey: string;
  accountHolderName: string;
  accountHolderDocument: string;
}

export interface OwnerLegalRepresentative {
  name: string;
  cpf: string;
  role: string;
  phone: string;
  email?: string;
}

export interface OwnerSpousePartner {
  hasSpousePartner: boolean;
  name: string;
  cpf: string;
  rg?: string;
  profession?: string;
  email?: string;
  phone?: string;
  propertyRegime?: string;
  roleInFutureContracts?: 'CO_PROPRIETARIO' | 'ANUENTE_OUTORGA' | 'BENEFICIARIO_REPASSE';
  notes?: string;
}

export interface Owner {
  id: string;
  personType: OwnerPersonType;
  name: string; // Nome Completo (PF) ou Razão Social (PJ)
  tradeName?: string; // Nome Fantasia (PJ)
  document: string; // CPF (PF) ou CNPJ (PJ)
  rg?: string; // Para PF
  birthDate?: string; // Data de Nascimento (AAAA-MM-DD ou DD/MM/AAAA)
  stateRegistration?: string; // Inscrição Estadual/Municipal para PJ
  maritalStatus?: MaritalStatus;
  profession?: string;
  spouseName?: string;
  spouseCpf?: string;
  propertyRegime?: string;
  spousePartner?: OwnerSpousePartner; // Inclusão de cônjuge/parceiro para futuros contratos
  legalRepresentative?: OwnerLegalRepresentative; // Para PJ
  email: string;
  secondaryEmail?: string;
  phone: string;
  secondaryPhone?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  bankDetails: OwnerBankDetails;
  status: OwnerStatus;
  notes?: string;
  propertiesCount: number;
  createdAt: string;
  updatedAt?: string;
}

// ----------------------------------------------------
// MÓDULO IMÓVEIS
// ----------------------------------------------------
export type PropertyType = 
  | 'APARTAMENTO'
  | 'CASA'
  | 'CASA_CONDOMINIO'
  | 'COBERTURA'
  | 'TERRENO'
  | 'SALA_COMERCIAL'
  | 'GALPAO'
  | 'STUDIO'
  | 'FAZENDA';

export type PropertyTransactionType = 
  | 'VENDA'
  | 'LOCACAO'
  | 'VENDA_LOCACAO'
  | 'TEMPORADA';

export type PropertyAvailabilityStatus = 
  | 'DISPONIVEL'
  | 'RESERVADO'
  | 'EM_NEGOCIACAO'
  | 'VENDIDO'
  | 'ALUGADO'
  | 'INATIVO';

export interface PropertyImage {
  id: string;
  url: string;
  isCover: boolean;
  caption?: string;
}

export interface RealEstateProperty {
  id: string;
  code: string; // ex: IMO-101, IMO-102
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType: PropertyTransactionType;
  status: PropertyAvailabilityStatus;
  featured: boolean;
  ownerId: string;
  ownerName: string;
  ownerDocument: string;
  ownerPhone: string;
  pricing: {
    salePrice?: number;
    rentPrice?: number;
    condoFee?: number;
    iptuFee?: number;
    fireInsurance?: number;
    commissionSalePercent?: number; // e.g. 6%
    commissionRentValue?: number; // e.g. 1º aluguel
  };
  specs: {
    totalAreaM2: number;
    usableAreaM2: number;
    bedrooms: number;
    suites: number;
    bathrooms: number;
    parkingSpaces: number;
    floor?: number;
    totalFloors?: number;
    sunOrientation?: 'MANHA' | 'TARDE';
    furnishing: 'MOBILIADO' | 'SEMIMOBILIADO' | 'VAZIO';
    yearBuilt?: number;
  };
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zone: 'SUL' | 'NORTE' | 'LESTE' | 'OESTE' | 'CENTRO';
    displayAddressOnWeb: boolean;
  };
  features: string[];
  images: PropertyImage[];
  virtualTourUrl?: string;
  videoUrl?: string;
  qrCodeDataUrl?: string;
  keysLocation: string; // ex: "Claviculário #12", "Com Proprietário"
  displayOnWebsite?: boolean; // Exibir no site imobiliário
  isExclusive?: boolean; // Contrato com exclusividade
  exclusiveUntil?: string; // Data de validade da exclusividade
  displayOnMap?: boolean; // Exibir no mapa do site
  // Canal Pró (ZAP / VivaReal / OLX) & Negociação
  canalProListingType?: 'PADRAO' | 'DESTAQUE' | 'SUPER_DESTAQUE';
  canalProSubtype?: string; // e.g. "Apartamento Padrão", "Cobertura Duplex", "Loft", "Studio", "Casa em Condomínio", "Sala Comercial"
  buildingPosition?: 'FRENTE' | 'FUNDOS' | 'LATERAL';
  unitsPerFloor?: number;
  acceptsFinancing?: boolean;
  acceptsExchange?: boolean;
  exchangeDetails?: string;
  petsAllowed?: boolean;
  pcdAccessibility?: boolean;
  internalNotes?: string; // Informações confidenciais que NÃO aparecem no site nem nos portais
  captadorId?: string;
  captadorName?: string;
  captadorPhone?: string;
  createdAt: string;
  updatedAt?: string;
  // Controle de Placas Imobiliárias
  acceptsSign?: boolean; // Imóvel aceita placa de divulgação (Sim/Não)
  signRefusalReason?: 'CONDOMINIO_PROIBE' | 'RECUSA_PROPRIETARIO' | 'IMOVEL_OCUPADO' | 'OUTROS';
  signTypeAllowed?: 'PLACA_FACHADA' | 'FAIXA_VARANDA' | 'CAVALETE' | 'PORTAO';
  signStatus?: 'SEM_PLACA' | 'SOLICITADA' | 'INSTALADA' | 'RETIRADA_SOLICITADA' | 'RECOLHIDA' | 'NAO_AUTORIZADO';
  signInstalledAt?: string;
  signCode?: string;
  signInstallerName?: string;
  signPhotoUrl?: string;
  signNotes?: string;
}

export type BiReportType = 
  | 'CLIENTES_INATIVOS'
  | 'IMOVEIS_DESATUALIZADOS'
  | 'PROPRIETARIOS'
  | 'VENDAS'
  | 'LOCACOES'
  | 'PLACAS_INSTALADAS';

export interface PropertySignRecord {
  id: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyNeighborhood: string;
  ownerName: string;
  ownerPhone: string;
  acceptsSign: boolean;
  signType: 'PLACA_FACHADA' | 'FAIXA_VARANDA' | 'CAVALETE' | 'PORTAO';
  signCode: string;
  status: 'SOLICITADA' | 'EM_ROTA_INSTALACAO' | 'INSTALADA' | 'RETIRADA_SOLICITADA' | 'RECOLHIDA' | 'DANIFICADA_SUBSTITUIR';
  installedAt?: string;
  installerName?: string;
  removalDate?: string;
  photoProofUrl?: string;
  observations?: string;
  size: 'PEQUENA_50x40' | 'MEDIA_70x50' | 'GRANDE_100x70' | 'FAIXA_200x50';
}

export interface CommissionStakeholder {
  id: string;
  name: string;
  role: 'IMOBILIARIA' | 'CAPTADOR' | 'FECHADOR' | 'GERENTE' | 'PARCEIRO_EXTERNO';
  type: 'PERCENTUAL' | 'VALOR_FIXO';
  percent: number; // e.g. 40%
  fixedAmount: number; // e.g. R$ 15.000
  creciOrDoc?: string;
  pixKey?: string;
}

export interface RentalSplitBeneficiaryRule {
  id: string;
  name: string;
  relationship: 'PROPRIETARIO_TITULAR' | 'CONJUGE_PARCEIRO' | 'CO_PROPRIETARIO' | 'FILHO_HERDEIRO' | 'ADMINISTRADORA' | 'TERCEIRO_INDICADO';
  cpfCnpj: string;
  splitType: 'PERCENTUAL' | 'VALOR_FIXO';
  percent: number; // e.g. 60%
  fixedAmount: number; // e.g. R$ 2.500
  bankName: string;
  agency: string;
  accountNumber: string;
  accountType: 'CORRENTE' | 'POUPANCA';
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';
  pixKey: string;
  autoTransfer: boolean;
  notes?: string;
}

export interface RentalContractSplitConfig {
  contractId: string;
  propertyCode: string;
  monthlyRent: number;
  adminFeePercentage: number;
  beneficiaries: RentalSplitBeneficiaryRule[];
  updatedAt: string;
}

export interface PropertyProposal {
  id: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyAddress: string;
  leadId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientCpf?: string;
  isNewClient: boolean;
  proposedPrice: number;
  paymentMethod: 'A_VISTA' | 'FINANCIAMENTO' | 'PERMUTA' | 'PARCELAMENTO_DIRETO' | 'CONSORCIO';
  downPayment?: number;
  validityDate: string;
  conditions: string;
  status: 'EM_ANALISE_PROPRIETARIO' | 'ACEITA' | 'RECUSADA' | 'CONTRA_PROPOSTA';
  brokerId?: string;
  brokerName?: string;
  createdAt: string;
}

// ----------------------------------------------------
// MÓDULO INTEGRAÇÃO DE PORTAIS & SITES IMOBILIÁRIOS
// ----------------------------------------------------
export type PortalCode = 'ZAP_VIVAREAL' | 'OLX' | 'IMOVELWEB' | 'MERCADO_LIVRE' | 'META_CATALOG' | 'CUSTOM';

export interface PortalIntegration {
  id: string;
  portalCode: PortalCode;
  name: string;
  logo: string;
  active: boolean;
  feedUrl: string;
  totalPublished: number;
  maxProperties: number;
  highlightCount: number;
  maxHighlights: number;
  lastSyncAt: string;
  syncFrequencyHours: number;
  status: 'ONLINE' | 'SYNCING' | 'ERROR' | 'PAUSED';
  errorMessage?: string;
  leadWebhookActive: boolean;
}

export type WebsiteTemplateId = 
  | 'EXCLUSIVE_HIGH_END' // Opção 1: Luxo, Alto Padrão, Boutique
  | 'URBAN_FLOW'         // Opção 2: Moderno, Lançamentos & Studios
  | 'FAST_RENT'          // Opção 3: Locação Rápida & Sem Burocracia
  | 'HERITAGE_TRUST';    // Opção 4: Tradicional, Família & Especialista de Bairro

export interface WebsiteTemplateOption {
  id: WebsiteTemplateId;
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  accentBadge: string;
  features: string[];
  previewThumbnail: string;
  defaultColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export interface WebsiteTestimonial {
  id: string;
  clientName: string;
  roleOrProfession: string;
  comment: string;
  rating: number;
  photoUrl: string;
  propertyTypeOrNeighborhood?: string;
}

export interface WebsiteTeamMember {
  id: string;
  name: string;
  role: string;
  creci: string;
  phone: string;
  email: string;
  photoUrl: string;
  bio: string;
  specialty: string;
}

export interface WebsiteAboutUs {
  title: string;
  story: string;
  mission: string;
  values: string;
  yearsInMarket: number;
  dealsClosed: number;
  satisfactionPercent: number;
  heroBannerUrl?: string;
}

export interface WebsiteInstitutionalVideo {
  enabled: boolean;
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
}

export interface WebsiteBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export interface WebsiteCustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  showInFooter: boolean;
}

export interface WebsiteWhatsAppButton {
  enabled: boolean;
  number: string;
  position: 'BOTTOM_RIGHT' | 'BOTTOM_LEFT';
  welcomeMessage: string;
  showPulse: boolean;
  size: 'PEQUENO' | 'MEDIO' | 'GRANDE';
  label?: string;
}

export interface WebsiteMapConfig {
  displayOnMapByDefault: boolean;
  showPointsOfInterest: boolean;
  mapStyle: 'MODERN' | 'LIGHT' | 'DARK';
  defaultZoom: number;
}

export interface WebsiteLeadFormConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  callToActionText: string;
  requireFinancingInfo: boolean;
}

export interface WebsiteCustomerPortalConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  directAccessUrl: string;
}

export interface WebsiteReferralBannerConfig {
  enabled: boolean;
  title: string;
  rewardDescription: string;
  ctaText: string;
}

export interface WebsiteConfig {
  templateId: WebsiteTemplateId;
  siteName: string;
  slogan: string;
  creci: string;
  customDomain: string;
  subdomain: string;
  isDomainActive: boolean;
  logoUrl?: string;
  footerLogoUrl?: string;
  logoSize?: 'PEQUENO' | 'MEDIO' | 'GRANDE';
  fontFamily?: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagramHandle: string;
  showFinancingSimulator: boolean;
  showOwnerCaptureBanner: boolean;
  showVirtualTourBadge: boolean;
  featuredPropertyIds: string[];
  lastPublishedAt?: string;
  status: 'PUBLICADO' | 'RASCUNHO';
  whatsappButton?: WebsiteWhatsAppButton;
  testimonials?: WebsiteTestimonial[];
  teamMembers?: WebsiteTeamMember[];
  aboutUs?: WebsiteAboutUs;
  institutionalVideo?: WebsiteInstitutionalVideo;
  blogPosts?: WebsiteBlogPost[];
  customPages?: WebsiteCustomPage[];
  mapConfig?: WebsiteMapConfig;
  leadFormConfig?: WebsiteLeadFormConfig;
  customerPortalConfig?: WebsiteCustomerPortalConfig;
  referralBannerConfig?: WebsiteReferralBannerConfig;
  heroBanners?: Array<{
    id: string;
    badge?: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    active: boolean;
  }>;
}

// ----------------------------------------------------
// MÓDULO INDIQUE E GANHE (GAMIFICADO)
// ----------------------------------------------------
export type ReferralPartnerCategory = 
  | 'SINDICO' 
  | 'PORTEIRO' 
  | 'ZELADOR' 
  | 'VIZINHO' 
  | 'AMIGO' 
  | 'CORRETOR_PARCEIRO' 
  | 'CLIENTE_ANTIGO';

export type GamifiedReferralStatus = 
  | 'EM_VALIDACAO' 
  | 'AGENDANDO_VISITA' 
  | 'EM_NEGOCIACAO' 
  | 'IMOVEL_CAPTADO' 
  | 'FECHADO_PREMIO_PAGO' 
  | 'RECUSADA';

export interface GamifiedReferral {
  id: string;
  partnerName: string;
  partnerCategory: ReferralPartnerCategory;
  partnerPhone: string;
  partnerEmail?: string;
  partnerPixKey: string;
  partnerCondoOrArea?: string; // ex: "Condomínio Edifício Mirante das Palmeiras"
  propertyAddress: string;
  propertyType: 'APARTAMENTO' | 'CASA' | 'COMERCIAL' | 'TERRENO';
  intentType: 'VENDA' | 'LOCACAO';
  ownerName: string;
  ownerPhone: string;
  estimatedValue: number;
  status: GamifiedReferralStatus;
  rewardValue: number; // e.g. R$ 1.500
  rewardPaidAt?: string;
  scorePoints: number; // e.g. 500 pontos
  notes?: string;
  createdAt: string;
}

export interface ReferralLeaderboardPartner {
  id: string;
  name: string;
  category: ReferralPartnerCategory;
  condoOrBuilding: string;
  points: number;
  totalReferrals: number;
  convertedDeals: number;
  totalEarnedRewards: number;
  badgeLevel: 'DIAMANTE' | 'OURO' | 'PRATA' | 'BRONZE';
  avatarUrl?: string;
}

// ----------------------------------------------------
// MÓDULO ÁREA DO CLIENTE (INQUILINO & PROPRIETÁRIO)
// ----------------------------------------------------
export type CustomerTicketCategory = 
  | 'MANUTENCAO_HIDRAULICA' 
  | 'MANUTENCAO_ELETRICA' 
  | 'INFILTRACAO' 
  | 'VISTORIA' 
  | 'ENTREGA_IMOVEL' 
  | 'SEGUNDA_VIA_BOLETO' 
  | 'ORCAMENTO' 
  | 'OUTROS';

export interface CustomerTicket {
  id: string;
  contractCode: string;
  propertyAddress: string;
  userType: 'INQUILINO' | 'PROPRIETARIO';
  userName: string;
  userPhone: string;
  category: CustomerTicketCategory;
  title: string;
  description: string;
  urgency: 'BAIXA' | 'MEDIA' | 'URGENTE';
  status: 'ABERTO' | 'EM_ANALISE' | 'ORCAMENTO_APROVADO' | 'PRESTADOR_AGENDADO' | 'CONCLUIDO';
  createdAt: string;
  photoUrl?: string;
  estimatedCost?: number;
  ownerApproved?: boolean;
}

// ----------------------------------------------------
// MÓDULO REGRAS DE GOVERNANÇA DO TIME & ACESSO PARAMETRIZADO
// ----------------------------------------------------

export type OwnerAccessLevel = 
  | 'CAPTADOR_GERENTE_DIRETOR' // Apenas captador do imóvel, gerente e diretor
  | 'GERENTE_DIRETOR_ONLY'     // Somente gerência e diretoria
  | 'CAPTADOR_E_EQUIPE'        // Captador e corretores da mesma equipe
  | 'TODOS_CORRETORES';        // Livre para toda a imobiliária

export type ProposalAccessLevel = 
  | 'PROPOSICAO_GERENCIA_DIRETORIA' // Somente corretor proponente, gerente e diretor
  | 'SOMENTE_GERENCIA_DIRETORIA'    // Somente gerentes e diretores
  | 'EQUIPE_COMPLETA';              // Aberto para toda a imobiliária

export type PropertyAddressMapVisibility = 
  | 'EXCLUSIVOS_OU_MARCADOS' // Somente exclusivos OU marcados com exibir no mapa
  | 'SOMENTE_EXCLUSIVOS'     // Apenas imóveis com contrato de exclusividade
  | 'SOMENTE_MARCADOS'       // Apenas imóveis com flag explícita de mapa
  | 'LIVRE_TODOS';           // Exibir mapa e endereço completo em todos

export interface AgencyGovernanceRules {
  id?: string;
  tenantId?: string;
  agencyName: string;
  
  // 1. Acesso aos Dados e Contato do Proprietário
  ownerAccessLevel: OwnerAccessLevel;
  hideOwnerContactWithoutActiveDeal: boolean; // Oculta telefone/WhatsApp para quem não tem proposta/visita

  // 2. Acesso e Visualização de Propostas Comerciais
  proposalAccessLevel: ProposalAccessLevel;
  hideFinancialValuesFromOtherBrokers: boolean; // Oculta valores financeiros de propostas de outros corretores

  // 3. Exibição de Endereço Completo & Mapa nos Imóveis
  propertyAddressMapVisibility: PropertyAddressMapVisibility;
  obfuscateStreetForNonManagers: boolean; // Mostra apenas Bairro/Zona quando não atender a regra

  // 4. Escopo de Visualização de Leads
  leadVisibilityScope: 'MEUS_LEADS' | 'EQUIPE' | 'AGENCIA_INTEIRA';

  // 5. Visualização de Comissões da Equipe
  commissionsVisibilityScope: 'PROPRIAS_COMISSOES_ONLY' | 'GERENCIA_DIRETORIA_ONLY' | 'TRANSPARENTE';

  // 6. Governança e Blindagem de Exportação (LGPD)
  allowBrokersExportCsv: boolean;
  allowBrokersExportXml: boolean;

  updatedAt: string;
  updatedBy: string;
}

export const DEFAULT_AGENCY_GOVERNANCE_RULES: AgencyGovernanceRules = {
  agencyName: 'AcertGo Gestão Imobiliária',
  ownerAccessLevel: 'CAPTADOR_GERENTE_DIRETOR',
  hideOwnerContactWithoutActiveDeal: true,
  proposalAccessLevel: 'PROPOSICAO_GERENCIA_DIRETORIA',
  hideFinancialValuesFromOtherBrokers: true,
  propertyAddressMapVisibility: 'EXCLUSIVOS_OU_MARCADOS',
  obfuscateStreetForNonManagers: true,
  leadVisibilityScope: 'MEUS_LEADS',
  commissionsVisibilityScope: 'PROPRIAS_COMISSOES_ONLY',
  allowBrokersExportCsv: false,
  allowBrokersExportXml: false,
  updatedAt: '2026-09-29T10:00:00Z',
  updatedBy: 'Diretoria Executiva'
};

// Funções utilitárias de avaliação de governança
export function canUserViewOwnerDetails(
  user: UserProfile, 
  property: RealEstateProperty | null, 
  rules: AgencyGovernanceRules
): { allowed: boolean; reason?: string } {
  // Super Admin, Master Admin e Manager sempre têm acesso
  if (user.role === 'SUPER_ADMIN' || user.role === 'MASTER_ADMIN' || user.role === 'MANAGER') {
    return { allowed: true };
  }

  if (rules.ownerAccessLevel === 'TODOS_CORRETORES') {
    return { allowed: true };
  }

  if (rules.ownerAccessLevel === 'GERENTE_DIRETOR_ONLY') {
    return { 
      allowed: false, 
      reason: 'Acesso restrito à Gerência e Diretoria conforme regras de governança da imobiliária.' 
    };
  }

  if (rules.ownerAccessLevel === 'CAPTADOR_GERENTE_DIRETOR' || rules.ownerAccessLevel === 'CAPTADOR_E_EQUIPE') {
    const isCaptador = !!property && (
      property.captadorId === user.id || 
      (property.captadorName && property.captadorName.toLowerCase() === user.name.toLowerCase())
    );

    if (isCaptador) {
      return { allowed: true };
    }

    return { 
      allowed: false, 
      reason: property?.captadorName 
        ? `Contato protegido. Apenas o captador (${property.captadorName}) ou o gerente têm acesso ao proprietário.`
        : 'Contato protegido. Apenas o captador deste imóvel ou a gerência têm acesso ao proprietário.'
    };
  }

  return { allowed: false, reason: 'Acesso restrito pelas diretrizes da imobiliária.' };
}

export function canDisplayPropertyMapAndAddress(
  property: RealEstateProperty,
  user: UserProfile,
  rules: AgencyGovernanceRules
): { showMap: boolean; showExactAddress: boolean; reason?: string } {
  // Gerência e diretoria veem o endereço completo e mapa sempre
  if (user.role === 'SUPER_ADMIN' || user.role === 'MASTER_ADMIN' || user.role === 'MANAGER') {
    return { showMap: true, showExactAddress: true };
  }

  if (rules.propertyAddressMapVisibility === 'LIVRE_TODOS') {
    return { showMap: true, showExactAddress: true };
  }

  const isExclusive = !!property.isExclusive;
  const isMarkedForMap = !!property.displayOnMap || !!property.address?.displayAddressOnWeb;

  if (rules.propertyAddressMapVisibility === 'EXCLUSIVOS_OU_MARCADOS') {
    const allowed = isExclusive || isMarkedForMap;
    return {
      showMap: allowed,
      showExactAddress: allowed,
      reason: allowed 
        ? undefined 
        : 'Endereço e mapa restritos. Disponíveis apenas para imóveis com Exclusividade ou marcados para exibição pública.'
    };
  }

  if (rules.propertyAddressMapVisibility === 'SOMENTE_EXCLUSIVOS') {
    return {
      showMap: isExclusive,
      showExactAddress: isExclusive,
      reason: isExclusive 
        ? undefined 
        : 'Endereço e mapa restritos. Exibição autorizada apenas para imóveis com contrato de exclusividade ativo.'
    };
  }

  if (rules.propertyAddressMapVisibility === 'SOMENTE_MARCADOS') {
    return {
      showMap: isMarkedForMap,
      showExactAddress: isMarkedForMap,
      reason: isMarkedForMap 
        ? undefined 
        : 'Mapa não habilitado na ficha deste imóvel.'
    };
  }

  return { 
    showMap: false, 
    showExactAddress: false, 
    reason: 'Exibição de mapa e endereço bloqueada por política interna.' 
  };
}

export function canUserViewProposal(
  user: UserProfile,
  proposal: PropertyProposal,
  rules: AgencyGovernanceRules
): { allowed: boolean; hideValues: boolean; reason?: string } {
  if (user.role === 'SUPER_ADMIN' || user.role === 'MASTER_ADMIN' || user.role === 'MANAGER') {
    return { allowed: true, hideValues: false };
  }

  if (rules.proposalAccessLevel === 'EQUIPE_COMPLETA') {
    return { 
      allowed: true, 
      hideValues: rules.hideFinancialValuesFromOtherBrokers && proposal.brokerId !== user.id 
    };
  }

  if (rules.proposalAccessLevel === 'SOMENTE_GERENCIA_DIRETORIA') {
    return { 
      allowed: false, 
      hideValues: true, 
      reason: 'Propostas comerciais visíveis apenas para Gerência e Diretoria.' 
    };
  }

  // PROPOSICAO_GERENCIA_DIRETORIA
  const isOwnProposal = proposal.brokerId === user.id || proposal.brokerName?.toLowerCase() === user.name.toLowerCase();
  if (isOwnProposal) {
    return { allowed: true, hideValues: false };
  }

  return { 
    allowed: false, 
    hideValues: true, 
    reason: 'Acesso restrito ao corretor responsável pela proposta e gerência.' 
  };
}

export * from './superAdmin';


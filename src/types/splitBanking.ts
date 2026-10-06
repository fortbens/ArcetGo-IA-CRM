export type SplitBankGatewayId = 
  | 'CONTA_PRONTA'
  | 'MERCADO_PAGO'
  | 'PAGAR_ME'
  | 'PAGSEGURO'
  | 'PJBANK'
  | 'IGGU'
  | 'ASAAS'
  | 'CORA'
  | 'ITAU_OPEN_FINANCE'
  | 'BANCO_INTER';

export interface SplitBankGatewayConfig {
  id: SplitBankGatewayId;
  name: string;
  category: 'FINTECH_BAAS' | 'GATEWAY_SPLIT' | 'BANCO_DIGITAL_PJ' | 'OPEN_FINANCE';
  logoBadge: string;
  badgeColor: string;
  description: string;
  status: 'CONECTADO' | 'SANDBOX' | 'DESCONECTADO' | 'PENDENTE_HOMOLOGACAO';
  apiUrl: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  webhookUrl: string;
  supportedMethods: Array<'PIX_AUTOMATICO' | 'BOLETO_SPLIT' | 'TED_AUTOMATICA' | 'SUB_CONTA'>;
  feeBoleto: number;
  feePixPercent: number;
  feeSplitFixed: number;
  payoutSla: string; // e.g. "D+0 (Instantâneo Pix)", "D+1", "D+2"
  lastPingLatencyMs?: number;
  isDefault: boolean;
}

export type DataentryCommissionStatus = 
  | 'RASCUNHO'
  | 'VALIDADO'
  | 'AUTORIZADO'
  | 'LIQUIDADO_PIX'
  | 'REJEITADO_BANCO';

export interface DataentryCommissionItem {
  id: string;
  dealCode: string;
  propertyTitle: string;
  beneficiaryName: string;
  beneficiaryRole: 'CORRETOR_FECHADOR' | 'CORRETOR_CAPTADOR' | 'GERENTE' | 'COORDENADOR' | 'IMOBILIARIA_HOUSE' | 'PARCEIRO_EXTERNO';
  cpfCnpj: string;
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'CHAVE_ALEATORIA';
  pixKey: string;
  bankName: string;
  grossAmount: number;
  retentionRpaAmount: number;
  retentionIssAmount: number;
  retentionIrAmount: number;
  netAmount: number;
  status: DataentryCommissionStatus;
  scheduledPayDate: string;
  paidAt?: string;
  transactionE2E?: string;
  gatewayUsed?: SplitBankGatewayId;
  notes?: string;
}

export type BoletoAvulsoStatus = 
  | 'EMITIDO'
  | 'REGISTRADO_CIP'
  | 'LIQUIDADO'
  | 'VENCIDO'
  | 'CANCELADO';

export interface BoletoAvulsoCommission {
  id: string;
  boletoNumber: string;
  barcode: string;
  digitableLine: string;
  pixCopyPaste: string;
  qrCodePixUrl: string;
  payerName: string;
  payerCpfCnpj: string;
  payerEmail: string;
  payerPhone: string;
  beneficiaryName: string;
  beneficiaryCpfCnpj: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  paidAt?: string;
  status: BoletoAvulsoStatus;
  purpose: 'COMISSAO_CONSTRUTORA' | 'COMISSAO_INTERMEDIACAO' | 'SINAL_RESERVA' | 'HONORARIOS_AVULSOS' | 'TAXA_ADMINISTRATIVA';
  dealReference?: string;
  penaltyPercent: number; // e.g. 2%
  interestDailyPercent: number; // e.g. 0.033%
  gatewayId: SplitBankGatewayId;
  notes?: string;
}

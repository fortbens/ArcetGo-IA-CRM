import { SplitGatewayId } from './splitGateways';

export type CommissionDataentryStatus = 
  | 'PENDENTE_VALIDACAO' 
  | 'APROVADO_PARA_PAGAMENTO' 
  | 'PROCESSANDO_API' 
  | 'LIQUIDADO_PIX' 
  | 'ERRO_CHAVE_PIX' 
  | 'CANCELADO';

export interface CommissionDataentryItem {
  id: string;
  propertyTitle: string;
  propertyCode: string;
  dealType: 'VENDA_LANCAMENTO' | 'VENDA_TERCEIROS' | 'LOCACAO' | 'INTERMEDIACAO_RURAL';
  vgvAmount: number;
  grossCommissionAmount: number;
  payableCommissionAmount: number;
  beneficiaryName: string;
  beneficiaryCpfCnpj: string;
  beneficiaryCreci?: string;
  beneficiaryRole: 'CORRETOR_FECHADOR' | 'CAPTADOR' | 'GERENTE' | 'COORDENADOR' | 'PARCEIRO_EXTERNO' | 'IMOBILIARIA';
  bankCode: string;
  bankName: string;
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'CELULAR' | 'ALEATORIA';
  pixKey: string;
  isPixValidated: boolean;
  dueDate: string;
  paymentGateway: SplitGatewayId;
  gatewayTransactionId?: string;
  status: CommissionDataentryStatus;
  liquidationDate?: string;
  rpaNumber?: string;
  notes?: string;
  createdAt: string;
}

export type BoletoAvulsoStatus = 
  | 'A_VENCER' 
  | 'PAGO_SPLIT_EXECUTADO' 
  | 'VENCIDO' 
  | 'CANCELADO';

export interface BoletoSplitBeneficiary {
  id: string;
  name: string;
  role: string;
  cpfCnpj: string;
  percent: number;
  amount: number;
  pixKey: string;
  bankName: string;
  status: 'PENDENTE' | 'CREDITADO_D0' | 'CREDITADO_D1';
}

export interface BoletoAvulsoCommission {
  id: string;
  boletoNumber: string;
  payerName: string;
  payerCpfCnpj: string;
  payerEmail: string;
  payerPhone: string;
  propertyTitle: string;
  contractCode: string;
  description: string;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: BoletoAvulsoStatus;
  gateway: SplitGatewayId;
  linhaDigitavel: string;
  codigoBarras: string;
  pixCopiaECola: string;
  pixQrCodeUrl: string;
  pdfUrl: string;
  splitBeneficiaries: BoletoSplitBeneficiary[];
  gatewayFee: number;
  netAmountDistributed: number;
  webhookReceivedAt?: string;
  remindersSentCount: number;
  lastReminderDate?: string;
}

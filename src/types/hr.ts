import { UserAddress, UserEmergencyContact } from './superAdmin';

export type ContractType = 'CLT' | 'PJ' | 'ESTAGIO' | 'AUTONOMO_CORRETOR';

export type EmployeeStatus = 'ATIVO' | 'FERIAS' | 'AFASTADO' | 'DESLIGADO';

export type DepartmentType = 
  | 'VENDAS' 
  | 'LOCACAO' 
  | 'ADMINISTRATIVO' 
  | 'FINANCEIRO' 
  | 'JURIDICO' 
  | 'MARKETING' 
  | 'DIRETORIA' 
  | 'TECNOLOGIA';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: DepartmentType;
  contractType: ContractType;
  status: EmployeeStatus;
  cpf: string;
  rg?: string;
  birthDate?: string;
  admissionDate: string;
  salary: number;
  pixKey: string;
  avatar: string;
  creci?: string;
  ctpsOrCnpj?: string;
  dependentsCount: number;
  address: UserAddress;
  emergencyContact: UserEmergencyContact;
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
    accountType: string;
  };
  notes?: string;
}

export type ClockType = 
  | 'ENTRADA' 
  | 'PAUSA_ALMOCO' 
  | 'RETORNO_ALMOCO' 
  | 'SAIDA' 
  | 'HORA_EXTRA_INICIO' 
  | 'HORA_EXTRA_FIM';

export type ClockVerificationStatus = 
  | 'VALIDADO_GPS' 
  | 'APROVADO_GESTOR' 
  | 'JUSTIFICADO' 
  | 'PENDENTE';

export interface ElectronicClockRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  timestamp: string; // ISO String
  formattedTime: string; // 08:30:15
  formattedDate: string; // 25/09/2026
  type: ClockType;
  location: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    addressDescription: string;
    isWithinOfficePerimeter: boolean;
    distanceMeters?: number;
  };
  nsrCode: string; // Número Sequencial de Registro (Portaria 671 MTE)
  verificationStatus: ClockVerificationStatus;
  deviceInfo?: string;
  justification?: string;
}

export interface PayslipItem {
  code: string;
  description: string;
  reference?: string; // ex: '30 dias', '8%', '11%'
  type: 'PROVENTO' | 'DESCONTO';
  value: number;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  cpf: string;
  role: string;
  department: DepartmentType;
  monthYear: string; // ex: '09/2026'
  referencePeriod: string; // '01/09/2026 a 30/09/2026'
  admissionDate: string;
  bankAccount: string;
  pixKey: string;
  earnings: PayslipItem[];
  deductions: PayslipItem[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  inssBase: number;
  fgtsBase: number;
  fgtsAmount: number;
  irrfBase: number;
  paymentDate: string;
  status: 'EMITIDO' | 'ASSINADO_DIGITALMENTE' | 'PAGO';
}

export type LeaveType = 
  | 'FERIAS' 
  | 'LICENCA_MEDICA' 
  | 'FOLGA_COMPENSATORIA' 
  | 'LICENCA_MATERNIDADE_PATERNIDADE' 
  | 'CASAMENTO_LUTO'
  | 'OUTRA';

export interface VacationAndLeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: DepartmentType;
  type: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  sellOneThird: boolean; // Abono pecuniário
  advanceThirteenth: boolean; // Adiantamento 1ª parcela de 13º
  status: 'SOLICITADO' | 'APROVADO' | 'REJEITADO' | 'EM_GOZO' | 'CONCLUIDO';
  requestedAt: string;
  approvedBy?: string;
  medicalCid?: string;
  notes?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: DepartmentType;
  period: string; // 'Q3 2026'
  evaluatorName: string;
  overallScore: number; // 1 to 5
  criteria: {
    name: string;
    score: number; // 1 to 5
    weight: number;
    comment: string;
  }[];
  strengths: string;
  areasToImprove: string;
  individualDevelopmentPlan: string;
  okrCompletionPercent: number;
  reviewedAt: string;
}

export interface CorporateBenefit {
  id: string;
  name: string;
  provider: string;
  category: 'ALIMENTACAO' | 'SAUDE' | 'TRANSPORTE' | 'BEM_ESTAR' | 'SEGURO';
  monthlyCompanyCost: number;
  employeeCopayPercent: number;
  activeCount: number;
  description: string;
}

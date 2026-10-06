export type TenantStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED';

export type SaaSPlanTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'CUSTOM';

export type ModuleCategory = 'VENDAS' | 'GESTAO' | 'FINANCEIRO' | 'INTELIGENCIA' | 'OPERACAO';

export interface SaaSModule {
  id: string;
  code: string;
  name: string;
  category: ModuleCategory;
  description: string;
  isCore: boolean; // Módulos essenciais sempre incluídos
  monthlyAddonPrice: number;
  iconName: string;
  features: string[];
}

export interface SaaSPlan {
  id: string;
  name: string;
  tier: SaaSPlanTier;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  maxUsers: number; // -1 = ilimitado
  maxProperties: number;
  maxLeadsPerMonth: number;
  whatsappIncluded: boolean;
  includedModuleIds: string[];
  isPopular?: boolean;
  badge?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  activeTenantsCount: number;
}

export interface TenantAgency {
  id: string;
  name: string; // Razão Social
  tradeName: string; // Nome Fantasia
  cnpj: string;
  creciJ: string;
  subdomain: string; // ex: matriz.acertgo.com.br
  customDomain?: string;
  logoUrl?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  city: string;
  state: string;
  address?: string;
  status: TenantStatus;
  planId: string;
  planName: string;
  billingCycle: 'MENSAL' | 'ANUAL';
  monthlyBilling: number;
  activeModules: string[]; // IDs dos módulos contratados
  customTheme?: {
    primaryColor: string;
    secondaryColor: string;
    appName?: string;
  };
  stats: {
    usersCount: number;
    propertiesCount: number;
    activeLeadsCount: number;
    monthlyDealsVolume: number;
  };
  createdAt: string;
  trialEndsAt?: string;
  nextBillingDate: string;
  paymentMethod: 'PIX' | 'BOLETO' | 'CARTAO_CREDITO';
}

export type PlatformUserStatus = 'ATIVO' | 'BLOQUEADO' | 'PENDENTE';

export interface PlatformUserHierarchy {
  role: string;
  label: string;
  level: number; // 1 (mais alto) a 6
  description: string;
  color: string;
}

export interface PermissionDefinition {
  id: string;
  category: string;
  name: string;
  description: string;
  defaultRoles: string[];
}

export interface UserAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface UserEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  phoneAlt?: string;
  notes?: string;
}

export interface PlatformUserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  tenantId: string;
  tenantName: string;
  avatar: string;
  creci?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  admissionDate?: string;
  department?: string;
  address?: UserAddress;
  emergencyContact?: UserEmergencyContact;
  status: PlatformUserStatus;
  customPermissions?: Record<string, boolean>;
  lastLoginAt: string;
  createdAt: string;
}

export interface SystemWhiteLabelConfig {
  platformName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  termsUrl: string;
  privacyUrl: string;
  enableSelfRegistration: boolean;
  enableTrialMode: boolean;
  trialDurationDays: number;
  billingGateway: {
    provider: 'ASAAS' | 'STRIPE' | 'IUGU';
    environment: 'SANDBOX' | 'PRODUCTION';
    apiKeyMasked: string;
    webhookUrl: string;
    autoSuspendOverdueDays: number;
  };
  smtpConfig: {
    host: string;
    port: number;
    senderEmail: string;
    senderName: string;
    useTls: boolean;
  };
}

export type AuditLogSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  category: 'TENANT' | 'USUARIO' | 'PLANO' | 'MODULO' | 'CONFIGURACAO' | 'SEGURANCA' | 'FINANCEIRO';
  userId: string;
  userName: string;
  userRole: string;
  tenantId?: string;
  tenantName?: string;
  ipAddress: string;
  severity: AuditLogSeverity;
  details: string;
  userAgent?: string;
}

export type NotificationPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type NotificationChannel = 'PUSH' | 'BANNER' | 'WHATSAPP' | 'IN_APP';

export type NotificationCategory = 
  | 'LEAD_ROLETA'
  | 'FINANCEIRO_SPLIT'
  | 'STAND_GPS'
  | 'JURIDICO_CONTRATOS'
  | 'PLATAFORMA_SISTEMA'
  | 'COMUNICADO_DIRETORIA'
  | 'ACADEMY_TREINAMENTO';

export type NotificationTargetAudience = 
  | 'TODOS_SISTEMA'           // Super Admin -> Todas as Imobiliárias
  | 'TENANTS_SELECIONADOS'     // Super Admin -> Imobiliárias específicas
  | 'TODA_IMOBILIARIA'        // Diretoria -> Toda a equipe da imobiliária
  | 'CORRETORES_VENDAS'       // Diretoria -> Corretores de vendas
  | 'CORRETORES_LOCACAO'      // Diretoria -> Corretores de locação
  | 'GERENTES_COORDENADORES'  // Diretoria -> Gerência
  | 'USUARIO_INDIVIDUAL';     // Específico

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  targetAudience: NotificationTargetAudience;
  tenantId?: string; // Optional: specific tenant
  tenantName?: string;
  senderName: string;
  senderRole: string; // 'SUPER_ADMIN' | 'DIRETORIA' | 'SISTEMA'
  senderAvatar?: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  isPinnedBanner?: boolean; // Se deve ficar fixado no banner do topo
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
  metadata?: {
    leadId?: string;
    propertyCode?: string;
    commissionAmount?: number;
    standName?: string;
    courseId?: string;
    bannerTheme?: 'info' | 'warning' | 'danger' | 'success' | 'purple';
  };
}

export interface PlatformBroadcastBanner {
  id: string;
  title: string;
  content: string;
  level: 'INFO' | 'AVISO' | 'CRITICO' | 'NOVIDADE';
  scope: 'SUPER_ADMIN_GLOBAL' | 'IMOBILIARIA_INTERNO';
  targetTenantIds?: string[]; // Para quem enviar
  targetRoles?: string[];
  active: boolean;
  isDismissible: boolean;
  linkText?: string;
  linkActionTab?: string;
  authorName: string;
  authorRole: string;
  startDate: string;
  endDate?: string;
}

export interface DemoPresentationScenario {
  id: 'jardins_prime' | 'rede_alpha' | 'sky_horizon';
  name: string;
  tagline: string;
  description: string;
  badge: string;
  vgv: string;
  brokersCount: number;
  leadsActiveCount: number;
  highlightModules: string[];
  suggestedPitchPoints: string[];
}

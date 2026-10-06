export interface SalesPlan {
  id: string;
  name: string;
  tag?: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number; // usually 20% discount
  isPopular?: boolean;
  isStartingPlan?: boolean;
  description: string;
  maxBrokers: string;
  maxProperties: string;
  maxLeadsMonth: string;
  features: string[];
  ctaText: string;
  active: boolean;
}

export interface LeadRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  agencyName: string;
  city: string;
  brokersCount: string;
  planId: string;
  planName?: string;
  subdomain: string;
  createdAt: string;
  status: 'NOVO' | 'EM_CONTATO' | 'DEMO_AGENDADA' | 'CONVERTIDO' | 'DESQUALIFICADO';
  notes?: string;
}

export interface SalesPageHeroConfig {
  badgeText: string;
  headline: string;
  highlightedWord: string;
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  guaranteeText: string;
  stats: {
    value: string;
    label: string;
    sublabel?: string;
  }[];
}

export interface FeatureHighlight {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badge: string;
  bullets: string[];
  highlightMetric?: string;
  highlightLabel?: string;
  active: boolean;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  companyName: string;
  city: string;
  avatarUrl: string;
  quote: string;
  rating: number;
  metricHighlight: string;
  metricLabel: string;
  active: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'PLANOS' | 'LEADS' | 'ERP_SPLITS' | 'MIGRACAO' | 'GERAL';
  active: boolean;
}

export interface SalesPageSettings {
  announcementBarText: string;
  announcementActive: boolean;
  announcementBadge: string;
  whatsappContactNumber: string;
  whatsappDefaultMessage: string;
  showFloatingWhatsapp: boolean;
  demoVideoUrl?: string;
  metaTitle: string;
  metaDescription: string;
  logoUrl?: string;
  logoHeight?: number; // Altura do logo em pixels (ex: 36, 48, 64, 80, 96)
  logoWidth?: number; // Largura do logo em pixels (ex: 160, 240, 320, 380)
  faviconUrl?: string;
  phone?: string;
  platformName?: string;
}

export interface SalesPageCmsState {
  settings: SalesPageSettings;
  hero: SalesPageHeroConfig;
  plans: SalesPlan[];
  leadHighlights: FeatureHighlight[];
  erpHighlights: FeatureHighlight[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  leads: LeadRegistration[];
}

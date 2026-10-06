export type MarketingPostFormat = 
  | 'FEED_1_1' 
  | 'STORIES_REELS_9_16' 
  | 'CAROUSEL' 
  | 'BANNER_16_9';

export type CreativeTemplateTheme = 
  | 'LUXURY_DARK' 
  | 'MINIMAL_LIGHT' 
  | 'OPPORTUNITY_BADGE' 
  | 'SUNSET_GOLD';

export type CreativeBadgeTag = 
  | 'EXCLUSIVIDADE'
  | 'LANÇAMENTO'
  | 'BAIXOU O PREÇO'
  | 'VISTA PANORÂMICA'
  | 'ALTO PADRÃO'
  | 'OPORTUNIDADE'
  | 'PRONTO PARA MORAR';

export type CopyToneType = 
  | 'LUXURY' 
  | 'PERSUASIVE_SCARCITY' 
  | 'INVESTOR_YIELD' 
  | 'EMOTIONAL_FAMILY';

export interface CarouselSlide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  tag: string;
}

export interface VideoReelsClip {
  id: string;
  title: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  topTitleOverlay: string;
  bottomPriceBadge: string;
  audioTrackName: string;
  isTrendingAudio: boolean;
}

export interface ScheduledPost {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyNeighborhood: string;
  format: MarketingPostFormat;
  templateTheme: CreativeTemplateTheme;
  badgeTag: CreativeBadgeTag;
  imageUrl: string;
  headline: string;
  caption: string;
  hashtags: string[];
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  platforms: ('INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'WHATSAPP_STATUS')[];
  status: 'AGENDADO' | 'PUBLICADO' | 'RASCUNHO' | 'IMPULSIONADO';
  boostBudget?: number;
  estimatedReach?: number;
  estimatedLeads?: number;
}

export interface MetaApiConfig {
  appId: string;
  appSecret: string;
  accessToken: string;
  instagramAccountId: string;
  facebookPageId: string;
  tokenExpiresAt: string;
  autoPublishLive: boolean;
  webhookSecret: string;
}

export interface MetaConnectionStatus {
  isConnected: boolean;
  pageName: string;
  instagramHandle: string;
  followersCount: number;
  tokenExpiryDays: number;
  businessManagerId: string;
  apiConfig?: MetaApiConfig;
}

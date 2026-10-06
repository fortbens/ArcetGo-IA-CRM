export type AdvancedSearchStyle = 
  | 'HERO_BOX'       // Caixa suspensa sobreposta com abas e filtros rápidos
  | 'CLEAN_BAR'      // Barra horizontal moderna e compacta
  | 'EXPANDED_CARD'  // Painel completo com filtros estendidos na home
  | 'KENKO_HERO_BOX'
  | 'KENKO_CLEAN_BAR'
  | 'KENKO_EXPANDED_CARD';

export type KenkoSearchStyle = AdvancedSearchStyle;

export interface WebsiteHeroBanner {
  id: string;
  badge?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  active: boolean;
}

export interface WebsiteSeoConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'business.business';
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: string; // 'index, follow'
  googleAnalyticsId?: string; // G-XXXXXXXXXX
  facebookPixelId?: string;
  googleSearchConsoleTag?: string;
  structuredDataJsonLd?: string;
}

export interface WebsiteCarouselConfig {
  enabled: boolean;
  autoPlay: boolean;
  intervalSeconds: number;
  title: string;
  subtitle: string;
  tagFilter?: string; // e.g. 'DESTAQUE', 'LANÇAMENTO', 'OPORTUNIDADE'
}

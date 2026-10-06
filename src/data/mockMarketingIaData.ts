import { 
  ScheduledPost, 
  MetaConnectionStatus, 
  VideoReelsClip, 
  CarouselSlide 
} from '../types/marketingIa';

export const INITIAL_META_CONNECTION: MetaConnectionStatus = {
  isConnected: true,
  pageName: 'Acert Imob Imobiliária & Investimentos',
  instagramHandle: '@acertimob.oficial',
  followersCount: 28450,
  tokenExpiryDays: 58,
  businessManagerId: 'BM-982143098',
  apiConfig: {
    appId: '109823471098234',
    appSecret: '8f7a9d3e4b1c2a0f8e7d6c5b4a392817',
    accessToken: 'EAALk9z8X2PqV3bB10YkLw9mN4oPqRtS7uVwXyZ8aB9cD0eF1gH2iJ3kL4mN5oP6qR7sT8uV9wX',
    instagramAccountId: '17841405928374921',
    facebookPageId: '104829104928301',
    tokenExpiresAt: '2026-11-25T14:30:00Z',
    autoPublishLive: true,
    webhookSecret: 'whsec_98a72b1c4e5d6f7098a123bc'
  }
};

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'post_001',
    propertyId: 'prop_01',
    propertyTitle: 'Cobertura Penthouse Jardins Sky Lounge',
    propertyPrice: 12500000,
    propertyNeighborhood: 'Jardins - São Paulo',
    format: 'FEED_1_1',
    templateTheme: 'LUXURY_DARK',
    badgeTag: 'EXCLUSIVIDADE',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    headline: 'O Ápice da Exclusividade nos Jardins',
    caption: 'Uma obra de arte suspensa com vista 360° para a cidade. 680m² de puro requinte com piscina privativa aquecida, 4 suítes master e living com pé direito duplo. Agende uma visita privativa com nosso consultor exclusivo via WhatsApp.',
    hashtags: ['#JardinsSky', '#CoberturaDeLuxo', '#ImoveisSP', '#AltoPadrao', '#PenthouseJardins'],
    scheduledDate: '2026-09-28',
    scheduledTime: '18:30',
    platforms: ['INSTAGRAM', 'FACEBOOK'],
    status: 'AGENDADO',
    boostBudget: 150,
    estimatedReach: 14500,
    estimatedLeads: 24
  },
  {
    id: 'post_002',
    propertyId: 'prop_02',
    propertyTitle: 'Mansão Contemporânea Alphaville Residencial 02',
    propertyPrice: 8900000,
    propertyNeighborhood: 'Alphaville - Barueri',
    format: 'CAROUSEL',
    templateTheme: 'SUNSET_GOLD',
    badgeTag: 'OPORTUNIDADE',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
    headline: 'Viver em Alphaville com Espaço e Segurança Máxima',
    caption: 'Arraste para o lado e conheça cada detalhe desta mansão contemporânea com 5 suítes, adega climatizada para 500 garrafas e espaço gourmet integrado com piscina de borda infinita.',
    hashtags: ['#Alphaville', '#MansaoContemporanea', '#SegurancaPrivada', '#ImoveisDeLuxo'],
    scheduledDate: '2026-09-29',
    scheduledTime: '12:00',
    platforms: ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP_STATUS'],
    status: 'AGENDADO',
    boostBudget: 200,
    estimatedReach: 19800,
    estimatedLeads: 32
  },
  {
    id: 'post_003',
    propertyId: 'prop_03',
    propertyTitle: 'Apartamento Duplex Pinheiros Design',
    propertyPrice: 2850000,
    propertyNeighborhood: 'Pinheiros - São Paulo',
    format: 'STORIES_REELS_9_16',
    templateTheme: 'MINIMAL_LIGHT',
    badgeTag: 'PRONTO PARA MORAR',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    headline: 'Pronto para Morar a 3 Minutos do Metrô Fradique',
    caption: '185m² finamente decorado por arquiteto renomado. 3 suítes, varanda gourmet com fechamento em vidro e 3 vagas de garagem. Chame no direct ou WhatsApp para conferir a ficha completa.',
    hashtags: ['#PinheirosSP', '#DuplexDesign', '#ProntoParaMorar', '#MorarBemSP'],
    scheduledDate: '2026-09-27',
    scheduledTime: '20:15',
    platforms: ['INSTAGRAM', 'TIKTOK'],
    status: 'PUBLICADO',
    boostBudget: 80,
    estimatedReach: 8200,
    estimatedLeads: 14
  }
];

export const PRESET_REELS_CLIPS: VideoReelsClip[] = [
  {
    id: 'clip_01',
    title: 'Destaques Rápidos (Teaser de Entrada)',
    startSec: 0,
    endSec: 15,
    durationSec: 15,
    topTitleOverlay: 'COBERTURA JARDINS - TOUR VIP',
    bottomPriceBadge: 'R$ 12.500.000 • 680m²',
    audioTrackName: 'Luxury Ambient Strings (Trending #1)',
    isTrendingAudio: true
  },
  {
    id: 'clip_02',
    title: 'Living & Varanda Gourmet',
    startSec: 15,
    endSec: 35,
    durationSec: 20,
    topTitleOverlay: 'LIVING COM PÉ DIREITO DUPLO',
    bottomPriceBadge: 'Piscina Privativa Aquecida',
    audioTrackName: 'Chill Deep House Sunset (Trending #3)',
    isTrendingAudio: true
  },
  {
    id: 'clip_03',
    title: 'Tour Completo com Apresentação do Corretor',
    startSec: 0,
    endSec: 60,
    durationSec: 60,
    topTitleOverlay: 'EXCLUSIVIDADE • TOUR COMPLETO',
    bottomPriceBadge: 'Agende sua Visita no Link da Bio',
    audioTrackName: 'Corporate Sophistication Lo-Fi',
    isTrendingAudio: false
  }
];

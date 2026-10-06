export type TvSlideCategory = 
  | 'PODIUM_GERAL'
  | 'EQUIPE_CAMPEA'
  | 'VENDAS_VGV'
  | 'LOCACOES'
  | 'ATENDIMENTO_LEADS'
  | 'CAPTACOES'
  | 'VISITAS_REALIZADAS'
  | 'LANCAMENTOS'
  | 'USO_CRM'
  | 'MURAL_CONQUISTAS'
  | 'INFORMATIVO_CUSTOM';

export type TvPeriod = 'MES' | 'ANO' | 'TRIMESTRE';

export type TvColorMode = 'DARK' | 'LIGHT';

export type TvOrientation = 'HORIZONTAL' | 'VERTICAL';

export type TvTheme = 'DARK_LUXURY' | 'GOLD_CHAMPION' | 'DEEP_SLATE' | 'NEON_TECH';

// Tipos de Som do Sino Virtual e Celebrações ao Vivo
export type TvSoundType = 
  | 'SINO_TRADICIONAL'    // Sino de bronze clássico de salão de vendas
  | 'BUZINA_FESTA'        // Buzina de estádio / festa animada
  | 'SIRENE_POLICIA'      // Sirene de conquista / emergência de metas
  | 'FANFARRA_TRIUNFO'    // Fanfarra triunfal com trompetes
  | 'ALERTA_FLASH'        // Alerta sonoro de aviso urgente / comunicado
  | 'VITORIA_CHIME';      // Arpeggio moderno de vitória

export interface TvSoundOption {
  id: TvSoundType;
  name: string;
  description: string;
  iconName: string;
}

export const TV_SOUND_OPTIONS: TvSoundOption[] = [
  {
    id: 'SINO_TRADICIONAL',
    name: 'Sino Tradicional de Vendas',
    description: 'Badalada clássica de bronze do salão de vendas',
    iconName: 'Bell'
  },
  {
    id: 'BUZINA_FESTA',
    name: 'Buzina de Estádio / Festa',
    description: 'Som eletrizante de buzina de comemoração (Airhorn)',
    iconName: 'Megaphone'
  },
  {
    id: 'SIRENE_POLICIA',
    name: 'Sirene de Conquista / Meta',
    description: 'Sirene contínua e vibrante de quebra de recorde',
    iconName: 'Siren'
  },
  {
    id: 'FANFARRA_TRIUNFO',
    name: 'Fanfarra Triunfal (Trompetes)',
    description: 'Acorde maior comemorativo de grande vitória',
    iconName: 'Award'
  },
  {
    id: 'ALERTA_FLASH',
    name: 'Alerta Flash de Atenção',
    description: 'Sinal sonoro de comunicado importante da diretoria',
    iconName: 'AlertCircle'
  },
  {
    id: 'VITORIA_CHIME',
    name: 'Chime Melódico de Vitória',
    description: 'Sequência harmônica suave e moderna',
    iconName: 'Sparkles'
  }
];

// Categorias de Informativos, Metas e Banners para alternar no carrossel da TV
export type TvNoticeCategory = 
  | 'AVISO_IMPORTANTE'
  | 'META_BATIDA'
  | 'META_SEMANA'
  | 'PLATAO_VENDAS'
  | 'COMUNICADO_DIRETORIA'
  | 'PROPAGANDA_LANCAMENTO'
  | 'BANNER_PARCEIRO'
  | 'REUNIAO_GERAL';

export interface TvNoticeItem {
  id: string;
  title: string;
  subtitle?: string;
  category: TvNoticeCategory;
  message: string;
  imageUrl?: string;
  targetHighlight?: string; // ex: "Faltam R$ 380.000 para a Meta Platinum"
  targetPercent?: number;   // ex: 82%
  badgeText?: string;
  authorName: string;
  authorRole: string;
  active: boolean;
  priority: 'ALTA' | 'NORMAL';
  durationSeconds?: number;
  createdAt: string;
}

// Disparo ao vivo de Alerta Flash / Sino Virtual na TV
export interface TvLiveFlashAlert {
  id: string;
  title: string;
  message: string;
  soundType: TvSoundType;
  senderName: string;
  senderRole: string;
  active: boolean;
  timestamp: string;
  celebrationType?: 'CONFETTI' | 'BELL' | 'ALERT';
}

// Disparo ao vivo de Toque de Sino Virtual com Som Selecionado
export interface TvLiveBellTrigger {
  id: string;
  soundType: TvSoundType;
  title: string;
  brokerName?: string;
  valueFormatted?: string;
  teamName?: string;
  timestamp: string;
}

// Configurações Globais de Transmissão e Alternância da TV gerenciadas pelo Gestor
export interface TvBroadcastingSettings {
  slideIntervalSeconds: number;       // Padrão 10s (5s a 60s)
  interleaveNotices: boolean;          // Alternar avisos e banners entre rankings
  noticeIntervalFrequency: number;     // A cada quantos rankings mostra 1 aviso (ex: a cada 2 slides)
  enabledCategories: Record<string, boolean>; // Quais categorias de slides estão ativas
  colorMode: TvColorMode;              // Noturno ou Diurno
  orientation: TvOrientation;          // Horizontal (16:9) ou Vertical (9:16)
  soundEnabled: boolean;
  defaultBellSound: TvSoundType;       // Som padrão ao bater o sino
  currentPeriod: TvPeriod;             // Mês, Ano ou Trimestre
  agencyName?: string;
  updatedAt?: string;
}

export const DEFAULT_TV_BROADCASTING_SETTINGS: TvBroadcastingSettings = {
  slideIntervalSeconds: 10,
  interleaveNotices: true,
  noticeIntervalFrequency: 2,
  enabledCategories: {
    PODIUM_GERAL: true,
    EQUIPE_CAMPEA: true,
    VENDAS_VGV: true,
    LOCACOES: true,
    ATENDIMENTO_LEADS: true,
    CAPTACOES: true,
    VISITAS_REALIZADAS: true,
    LANCAMENTOS: true,
    USO_CRM: true,
    MURAL_CONQUISTAS: true
  },
  colorMode: 'DARK',
  orientation: 'HORIZONTAL',
  soundEnabled: true,
  defaultBellSound: 'SINO_TRADICIONAL',
  currentPeriod: 'MES'
};

export interface BrokerRankingEntry {
  id: string;
  rank: number;
  name: string;
  role: string;
  team: string;
  avatar: string;
  primaryValue: string;
  numericValue: number;
  primaryUnit: string;
  secondaryMetric: string;
  targetPercent: number; // e.g. 115%
  badge: string;
  highlightNote?: string;
  isChampion?: boolean;
}

export interface TeamRankingEntry {
  id: string;
  rank: number;
  teamName: string;
  managerName: string;
  managerAvatar: string;
  membersCount: number;
  vgvMonth: number;
  vgvFormatted: string;
  contractsCount: number;
  targetPercent: number;
  monthlyTrophies: number;
  isYearChampion?: boolean;
  isMonthChampion?: boolean;
  topPerformerName: string;
  badge: string;
  colorScheme: 'gold' | 'emerald' | 'blue' | 'purple';
  motto: string;
}

export interface RecentDealAlert {
  id: string;
  timestamp: string;
  brokerName: string;
  brokerAvatar: string;
  teamName: string;
  dealType: 'VENDA' | 'LOCACAO' | 'CAPTACAO_EXCLUSIVA' | 'LANCAMENTO' | 'META_BATIDA';
  title: string;
  valueFormatted: string;
  commissionFormatted?: string;
  location: string;
}

export interface TvSlideDefinition {
  id: TvSlideCategory;
  title: string;
  subtitle: string;
  kicker: string;
  iconName: string;
  accentColor: string; // e.g. 'emerald', 'amber', 'purple', 'blue'
  customNotice?: TvNoticeItem;
}

export interface TvRankingConfig {
  autoplay: boolean;
  slideIntervalSeconds: number; // e.g. 10
  currentPeriod: TvPeriod;
  soundEnabled: boolean;
  theme: TvTheme;
  agencyName: string;
  agencyCity: string;
  agencyCreci: string;
  autoHideControls: boolean;
}

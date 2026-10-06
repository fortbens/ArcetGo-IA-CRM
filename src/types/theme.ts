export type SidebarThemeVariant = 'dark' | 'navy' | 'light' | 'emerald' | 'obsidian';

export interface SystemThemeConfig {
  platformName: string;
  tagline: string;
  logoUrl: string;
  logoType: 'preset' | 'upload' | 'url';
  presetLogoId?: string;
  faviconUrl?: string;
  faviconType?: 'preset' | 'upload' | 'url';
  presetFaviconId?: string;
  sidebarLogoUrl?: string;
  loginLogoUrl?: string;
  footerLogoUrl?: string;
  agencyName?: string;
  supportPhone?: string;
  phone?: string;
  primaryColor: string; // Hex color e.g. #2563eb
  secondaryColor: string; // Hex color e.g. #0ea5e9
  accentColor: string; // Hex color e.g. #10b981
  sidebarTheme: SidebarThemeVariant;
  customCssVars?: Record<string, string>;
  isRightRailOpen?: boolean;
}

export interface ColorPreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  previewBg: string;
  sidebarTheme: SidebarThemeVariant;
}

export const SYSTEM_COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'sapphire_tech',
    name: 'Azul Safira & Tech',
    description: 'Moderno, confiável e focado em tecnologia imobiliária',
    primaryColor: '#2563eb', // Blue 600
    secondaryColor: '#0ea5e9', // Sky 500
    accentColor: '#10b981', // Emerald 500
    previewBg: 'from-blue-600 to-sky-500',
    sidebarTheme: 'dark'
  },
  {
    id: 'emerald_prime',
    name: 'Esmeralda Corporativo',
    description: 'Alta rentabilidade, sustentabilidade e prestígio',
    primaryColor: '#059669', // Emerald 600
    secondaryColor: '#10b981', // Emerald 500
    accentColor: '#34d399', // Emerald 400
    previewBg: 'from-emerald-700 to-teal-500',
    sidebarTheme: 'emerald'
  },
  {
    id: 'luxury_gold',
    name: 'Obsidian & Ouro Imperial',
    description: 'Imóveis de altíssimo padrão, mansões e boutique',
    primaryColor: '#b45309', // Amber 700
    secondaryColor: '#f59e0b', // Amber 500
    accentColor: '#d97706', // Amber 600
    previewBg: 'from-amber-700 to-yellow-500',
    sidebarTheme: 'obsidian'
  },
  {
    id: 'royal_indigo',
    name: 'Índigo Executivo',
    description: 'Elegância institucional para grandes redes e franquias',
    primaryColor: '#4338ca', // Indigo 700
    secondaryColor: '#6366f1', // Indigo 500
    accentColor: '#818cf8', // Indigo 400
    previewBg: 'from-indigo-800 to-purple-600',
    sidebarTheme: 'navy'
  },
  {
    id: 'ruby_elite',
    name: 'Rubi Prime & Finanças',
    description: 'Dinâmico, arrojado e focado em conversão e vendas',
    primaryColor: '#be123c', // Rose 700
    secondaryColor: '#f43f5e', // Rose 500
    accentColor: '#fb7185', // Rose 400
    previewBg: 'from-rose-800 to-pink-600',
    sidebarTheme: 'dark'
  },
  {
    id: 'slate_minimal',
    name: 'Grafite Minimalista',
    description: 'Visual discreto, monocromático e sofisticado',
    primaryColor: '#1e293b', // Slate 800
    secondaryColor: '#475569', // Slate 600
    accentColor: '#38bdf8', // Sky 400
    previewBg: 'from-slate-900 to-slate-700',
    sidebarTheme: 'dark'
  }
];

export interface PresetLogoOption {
  id: string;
  name: string;
  initial: string;
  iconBg: string;
  svgIcon?: string;
  category: string;
}

export const PRESET_LOGOS: PresetLogoOption[] = [
  {
    id: 'acertgo_default',
    name: 'AcertGo Clássico',
    initial: 'A',
    iconBg: 'from-blue-600 to-cyan-500',
    category: 'Tech'
  },
  {
    id: 'prime_crown',
    name: 'Crown Luxury',
    initial: '♔',
    iconBg: 'from-amber-600 to-yellow-400',
    category: 'Alto Padrão'
  },
  {
    id: 'emerald_estates',
    name: 'Emerald Real Estate',
    initial: 'E',
    iconBg: 'from-emerald-600 to-teal-400',
    category: 'Sustentável'
  },
  {
    id: 'vanguard_tower',
    name: 'Vanguard Tower',
    initial: 'V',
    iconBg: 'from-indigo-700 to-sky-500',
    category: 'Lançamentos'
  },
  {
    id: 'monogram_prime',
    name: 'Minimal Black & Gold',
    initial: '✦',
    iconBg: 'from-neutral-900 to-amber-600',
    category: 'Boutique'
  }
];

export const DEFAULT_SYSTEM_THEME: SystemThemeConfig = {
  platformName: 'AcertGo',
  agencyName: 'AcertGo Gestão Imobiliária & ERP',
  tagline: 'CRM · ERP · Fintech Imobiliária',
  logoUrl: '',
  loginLogoUrl: '',
  footerLogoUrl: '',
  logoType: 'preset',
  presetLogoId: 'acertgo_default',
  primaryColor: '#2563eb',
  secondaryColor: '#0ea5e9',
  accentColor: '#10b981',
  sidebarTheme: 'dark',
  isRightRailOpen: true
};

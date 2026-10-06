import React from 'react';
import { 
  Users, 
  Shuffle, 
  MessageSquare, 
  Columns, 
  Building, 
  Wallet, 
  FileSignature, 
  CreditCard, 
  BarChart3, 
  Palette, 
  Car, 
  Trophy, 
  GraduationCap, 
  Scale, 
  KeyRound, 
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Home,
  UserCheck,
  ShieldCheck,
  Globe,
  Gift,
  Sliders,
  Briefcase,
  LayoutDashboard,
  Crown,
  Bell,
  Zap,
  Compass,
  MapPin,
  FileCheck2,
  Database,
  Share2,
  Cpu,
  HelpCircle,
  FileText,
  Building2,
  Award,
  Tv
} from 'lucide-react';
import { UserRole } from '../../types/crm';
import { SystemThemeConfig, PRESET_LOGOS } from '../../types/theme';

export type NavTabId = 
  | 'executive_dashboard'
  | 'notifications_center'
  | 'super_admin'
  | 'agency_governance'
  | 'financial_erp'
  | 'nfse_homologacao'
  | 'dimob'
  | 'sales_proposals'
  | 'roleta'
  | 'whatsapp_desk'
  | 'kanban'
  | 'leads_list'
  | 'roteiro_visitas'
  | 'indique_ganhe'
  | 'customer_portal'
  | 'imoveis'
  | 'proprietarios'
  | 'ptam_reports'
  | 'sales_mirror'
  | 'portals_sites'
  | 'sites_modelos'
  | 'integracoes'
  | 'external_partner'
  | 'fintech_split'
  | 'contracts'
  | 'document_templates'
  | 'digital_signature'
  | 'inspections_keys'
  | 'commissions_rpa'
  | 'cca_banking'
  | 'bi_performance'
  | 'human_resources'
  | 'brand_equity'
  | 'fleet_assets'
  | 'gamification'
  | 'tv_ranking'
  | 'corporate_academy'
  | 'legal_sac'
  | 'central_ajuda_sac'
  | 'team_permissions'
  | 'sales_landing_page'
  | 'marketing_ia'
  | 'migration_backup';

interface SidebarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  userRole: UserRole;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  themeConfig?: SystemThemeConfig;
  onOpenThemeModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  unreadNotificationsCount?: number;
  systemEnvironment?: 'PRODUCTION' | 'TEST';
  onToggleSystemEnvironment?: (env: 'PRODUCTION' | 'TEST') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  userRole,
  isMobileOpen = false,
  onCloseMobile,
  themeConfig,
  onOpenThemeModal,
  isCollapsed = false,
  onToggleCollapse,
  unreadNotificationsCount,
  systemEnvironment = 'PRODUCTION',
  onToggleSystemEnvironment
}) => {
  const isBroker = userRole === 'BROKER';
  const isExternalPartner = userRole === 'EXTERNAL_PARTNER';

  const menuSections = [
    {
      title: 'Principal',
      items: [
        { id: 'executive_dashboard' as NavTabId, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'roleta' as NavTabId, label: 'Rodízio (Fila)', icon: Shuffle },
        { id: 'kanban' as NavTabId, label: 'Leads', icon: Columns },
        { id: 'leads_list' as NavTabId, label: 'Clientes', icon: Users },
        { id: 'imoveis' as NavTabId, label: 'Imóveis', icon: Home },
        { id: 'ptam_reports' as NavTabId, label: 'Avaliação PTAM', icon: Award },
        { id: 'proprietarios' as NavTabId, label: 'Proprietários', icon: UserCheck },
        { id: 'sales_proposals' as NavTabId, label: 'Propostas e Vendas', icon: FileSignature },
      ],
    },
    {
      title: 'Lançamentos',
      items: [
        { id: 'sales_mirror' as NavTabId, label: 'Lançamentos & Espelho', icon: Building },
        { id: 'sites_modelos' as NavTabId, label: 'Sites Modelos', icon: Globe },
        { id: 'external_partner' as NavTabId, label: 'Corretores Parceiros (House)', icon: Layers },
        { id: 'integracoes' as NavTabId, label: 'Integrações & Órulo', icon: Cpu },
      ],
    },
    {
      title: 'Gestão',
      items: [
        { id: 'contracts' as NavTabId, label: 'Locação & Contratos', icon: FileSignature },
        { id: 'inspections_keys' as NavTabId, label: 'Vistorias & Chaves', icon: KeyRound },
        { id: 'customer_portal' as NavTabId, label: 'Área do Cliente (Portal)', icon: ShieldCheck },
        { id: 'roteiro_visitas' as NavTabId, label: 'Roteiro de Visitas', icon: Compass },
        { id: 'fleet_assets' as NavTabId, label: 'Veículos & Patrimônio', icon: Car },
      ],
    },
    {
      title: 'Administrativos',
      items: [
        { id: 'document_templates' as NavTabId, label: 'Documentos & Minutas', icon: FileText },
        { id: 'digital_signature' as NavTabId, label: 'Assinatura Digital (APIs)', icon: FileCheck2 },
        { id: 'legal_sac' as NavTabId, label: 'Atendimento & Jurídico', icon: Scale },
        { id: 'central_ajuda_sac' as NavTabId, label: 'Central de Ajuda & SAC', icon: HelpCircle },
        { id: 'team_permissions' as NavTabId, label: 'Matriz de Permissões', icon: ShieldCheck },
        { id: 'agency_governance' as NavTabId, label: 'Regras da Imobiliária', icon: Sliders },
        { id: 'migration_backup' as NavTabId, label: 'Migração & Backup', icon: Database },
      ],
    },
    {
      title: 'Financeiro',
      items: [
        { id: 'financial_erp' as NavTabId, label: 'Módulo Financeiro (ERP)', icon: Wallet },
        { id: 'nfse_homologacao' as NavTabId, label: 'Emissão de NFS-e (Prefeituras)', icon: Building2 },
        { id: 'dimob' as NavTabId, label: 'DIMOB (Receita Federal)', icon: FileText },
        { id: 'commissions_rpa' as NavTabId, label: 'Comissões da Equipe', icon: CreditCard },
        { id: 'fintech_split' as NavTabId, label: 'Repasses & Split Pix', icon: Wallet },
        { id: 'cca_banking' as NavTabId, label: 'Financiamento Bancário', icon: Building },
        { id: 'bi_performance' as NavTabId, label: 'Relatórios & DRE / BI', icon: BarChart3 },
      ],
    },
    {
      title: 'RH',
      items: [
        { id: 'human_resources' as NavTabId, label: 'Recursos Humanos (RH)', icon: Users },
        { id: 'gamification' as NavTabId, label: 'Ranking & Premiações', icon: Trophy },
        { id: 'tv_ranking' as NavTabId, label: 'Painel TV Salão de Vendas', icon: Tv },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { id: 'marketing_ia' as NavTabId, label: 'Marketing.IA Studio', icon: Sparkles },
        { id: 'brand_equity' as NavTabId, label: 'Placas & Divulgação', icon: Palette },
        { id: 'sales_landing_page' as NavTabId, label: 'Página de Vendas (LP)', icon: Sparkles },
        { id: 'indique_ganhe' as NavTabId, label: 'Indique e Ganhe', icon: Gift },
      ],
    },
    {
      title: 'Treinamento',
      items: [
        { id: 'corporate_academy' as NavTabId, label: 'Cursos & Treinamentos', icon: GraduationCap },
        { id: 'whatsapp_desk' as NavTabId, label: 'Central de Atendimento & Desk', icon: MessageSquare },
      ],
    },
    {
      title: 'Diretoria',
      items: [
        { id: 'executive_dashboard' as NavTabId, label: 'Painel do Diretor (CEO)', icon: LayoutDashboard },
        { id: 'bi_performance' as NavTabId, label: 'BI & Indicadores Executivos', icon: BarChart3 },
        { 
          id: 'notifications_center' as NavTabId, 
          label: 'Notificações & Alertas', 
          icon: Bell, 
          badge: unreadNotificationsCount && unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined
        },
        { id: 'super_admin' as NavTabId, label: 'Painel do Administrador', icon: ShieldCheck },
      ],
    },
  ];

  const handleItemClick = (tabId: NavTabId) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  // Determine sidebar theme styling
  const sidebarTheme = themeConfig?.sidebarTheme || 'dark';
  let sidebarBgClass = 'bg-slate-900 text-slate-300 border-slate-800';
  let subheaderBorder = 'border-slate-800/80';
  let itemInactiveClass = 'text-slate-300 hover:text-white hover:bg-slate-800/80';
  let itemActiveClass = 'text-white shadow-xs font-semibold';
  let footerBgClass = 'border-slate-800 bg-slate-950/40 text-slate-400';

  if (sidebarTheme === 'navy') {
    sidebarBgClass = 'bg-slate-950 text-slate-300 border-indigo-950';
    subheaderBorder = 'border-indigo-950';
    itemInactiveClass = 'text-slate-300 hover:text-white hover:bg-indigo-950/60';
    footerBgClass = 'border-indigo-950 bg-slate-950 text-slate-400';
  } else if (sidebarTheme === 'emerald') {
    sidebarBgClass = 'bg-emerald-950 text-emerald-100 border-emerald-900';
    subheaderBorder = 'border-emerald-900';
    itemInactiveClass = 'text-emerald-200 hover:text-white hover:bg-emerald-900/60';
    footerBgClass = 'border-emerald-900 bg-emerald-950 text-emerald-300';
  } else if (sidebarTheme === 'obsidian') {
    sidebarBgClass = 'bg-neutral-950 text-neutral-300 border-neutral-900';
    subheaderBorder = 'border-neutral-900';
    itemInactiveClass = 'text-neutral-300 hover:text-white hover:bg-neutral-900';
    footerBgClass = 'border-neutral-900 bg-black text-neutral-400';
  } else if (sidebarTheme === 'light') {
    sidebarBgClass = 'bg-white text-slate-700 border-slate-200 shadow-2xs';
    subheaderBorder = 'border-slate-100';
    itemInactiveClass = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
    footerBgClass = 'border-slate-200 bg-slate-50 text-slate-500';
  }

  // Active item style with dynamic primary color
  const activeStyle = {
    backgroundColor: themeConfig?.primaryColor || '#2563eb',
    color: '#ffffff'
  };

  const selectedPreset = PRESET_LOGOS.find(p => p.id === themeConfig?.presetLogoId) || PRESET_LOGOS[0];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      
      {/* Sub-Header: Branding & Collapse Toggle */}
      <div className={`p-3.5 border-b ${subheaderBorder} flex items-center justify-between shrink-0`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            {themeConfig?.logoUrl && themeConfig.logoType !== 'preset' ? (
              <img 
                src={themeConfig.logoUrl} 
                alt="Logo" 
                className="w-7 h-7 object-contain rounded-md shrink-0 bg-white/10 p-0.5" 
              />
            ) : (
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                style={{ backgroundColor: themeConfig?.primaryColor || '#2563eb' }}
              >
                {selectedPreset.initial}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs font-bold tracking-tight block truncate text-inherit">
                {themeConfig?.platformName || 'AcertGo'}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                Painel Operacional
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs"
              style={{ backgroundColor: themeConfig?.primaryColor || '#2563eb' }}
            >
              {themeConfig?.platformName?.charAt(0) || 'A'}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Collapse toggle (Desktop only) */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isCollapsed ? 'Expandir Menu Lateral' : 'Recolher Menu Lateral'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}

          {/* Close mobile drawer button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className={`flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 ${isCollapsed ? 'px-1.5' : ''}`}>
        {menuSections.map((section) => {
          if (isExternalPartner && section.title !== 'Imóveis & Lançamentos') return null;

          return (
            <div key={section.title}>
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2.5 mb-1">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <button
                        onClick={() => handleItemClick(item.id)}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full flex items-center rounded-xl text-xs font-medium transition-all group ${
                          isCollapsed ? 'justify-center p-2.5' : 'justify-between px-2.5 py-2'
                        } ${isActive ? itemActiveClass : itemInactiveClass}`}
                        style={isActive ? activeStyle : undefined}
                      >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-inherit'}`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-tight shrink-0 ml-1.5 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-black/20 text-slate-300 border border-white/10'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {item.id === 'super_admin' && onToggleSystemEnvironment && !isCollapsed && (
                      <div className="mt-1 mb-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1">
                          <span>Ambiente:</span>
                          <span className={systemEnvironment === 'PRODUCTION' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                            {systemEnvironment === 'PRODUCTION' ? 'Produção (Zerado)' : 'Testes'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSystemEnvironment('PRODUCTION');
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all text-center cursor-pointer ${
                              systemEnvironment === 'PRODUCTION'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Produção
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSystemEnvironment('TEST');
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all text-center cursor-pointer ${
                              systemEnvironment === 'TEST'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Testes
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom White-Label / Theme Customizer Button */}
      {onOpenThemeModal && (
        <div className={`p-2 border-t ${subheaderBorder} shrink-0`}>
          <button
            onClick={onOpenThemeModal}
            title={isCollapsed ? 'Personalizar Cores e Logotipo' : undefined}
            className={`w-full flex items-center rounded-xl text-xs font-semibold p-2 transition-all text-slate-300 hover:text-white hover:bg-white/10 ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              {!isCollapsed && <span>Cores & Logotipo</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] text-amber-300 font-normal">Aparência</span>
            )}
          </button>
        </div>
      )}

      {/* Bottom Broker / Lead Attribution Status */}
      {!isCollapsed && (
        <div className={`p-3 border-t ${footerBgClass} text-xs shrink-0`}>
          <div className="flex items-center justify-between text-[11px]">
            <span>Fila Inteligente:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ativa
            </span>
          </div>
          <div className="text-[10px] mt-0.5 truncate">
            Próximo corretor: <strong className="text-slate-200">Juliana Mendes</strong>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: docked on large screens with smooth width transition */}
      <aside 
        className={`hidden lg:flex flex-col shrink-0 border-r overflow-hidden transition-all duration-200 z-20 ${sidebarBgClass} ${
          isCollapsed ? 'w-16' : 'w-60 xl:w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <aside className={`relative w-72 max-w-[80vw] shadow-2xl flex flex-col h-full z-10 border-r animate-in slide-in-from-left duration-200 ${sidebarBgClass}`}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

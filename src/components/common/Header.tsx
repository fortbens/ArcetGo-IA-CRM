import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ChevronDown, 
  Bell, 
  Sparkles, 
  Database, 
  UserCircle2, 
  Search, 
  Plus, 
  AlertTriangle,
  Menu,
  X,
  Palette,
  Columns,
  MoreHorizontal,
  Zap,
  Flame,
  CheckCircle2,
  ExternalLink,
  Check,
  ArrowLeft,
  ArrowRight,
  Sliders,
  LogOut,
  Lock,
  Cake,
  Tv,
  Globe,
  Trash2
} from 'lucide-react';
import { UserProfile, TenantId } from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';
import { SystemThemeConfig, PRESET_LOGOS } from '../../types/theme';
import { SystemNotification, NotificationCategory } from '../../types/notifications';

interface HeaderProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onOpenNewLead: () => void;
  onOpenSchemaModal: () => void;
  onOpenAiStudio: () => void;
  onOpenSuperAdmin?: () => void;
  onOpenGovernanceRules?: () => void;
  onOpenBirthdayHub?: () => void;
  onLogout?: () => void;
  onSelectTenant: (tenantId: TenantId) => void;
  selectedTenantId: TenantId;
  onToggleMobileMenu?: () => void;
  availableTenants?: { id: TenantId; name: string; city: string }[];
  themeConfig?: SystemThemeConfig;
  onOpenThemeModal?: () => void;
  onOpenFreeAiTools?: () => void;
  onOpenTvRanking?: () => void;
  onOpenTvControlModal?: () => void;
  onOpenSalesPageLinkModal?: () => void;
  isRightRailOpen?: boolean;
  onToggleRightRail?: () => void;
  notifications?: SystemNotification[];
  onOpenNotificationsCenter?: () => void;
  onMarkAllNotificationsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  onClearAllNotifications?: () => void;
  onOpenDemoSandbox?: () => void;
  onTriggerSimulatedPush?: (category: NotificationCategory) => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  previousStepLabel?: string;
  onGoForward?: () => void;
  canGoForward?: boolean;
  nextStepLabel?: string;
  currentStepLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  onOpenNewLead,
  onOpenSchemaModal,
  onOpenAiStudio,
  onOpenSuperAdmin,
  onOpenGovernanceRules,
  onOpenBirthdayHub,
  onLogout,
  onSelectTenant,
  selectedTenantId,
  onToggleMobileMenu,
  availableTenants,
  themeConfig,
  onOpenThemeModal,
  onOpenFreeAiTools,
  onOpenTvRanking,
  onOpenTvControlModal,
  onOpenSalesPageLinkModal,
  isRightRailOpen = true,
  onToggleRightRail,
  notifications = [],
  onOpenNotificationsCenter,
  onMarkAllNotificationsRead,
  onDeleteNotification,
  onClearAllNotifications,
  onOpenDemoSandbox,
  onTriggerSimulatedPush,
  onGoBack,
  canGoBack = false,
  previousStepLabel,
  onGoForward,
  canGoForward = false,
  nextStepLabel,
  currentStepLabel
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcutsMenu, setShowShortcutsMenu] = useState(false);
  const [showTvMenu, setShowTvMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
        setShowTenantDropdown(false);
        setShowNotifications(false);
        setShowShortcutsMenu(false);
        setShowTvMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRoleDropdown(false);
        setShowTenantDropdown(false);
        setShowNotifications(false);
        setShowShortcutsMenu(false);
        setShowTvMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const defaultTenants = [
    { id: 'tenant_matriz_sp' as TenantId, name: 'AcertGo Matriz (Jardins / SP)', city: 'São Paulo - SP' },
    { id: 'tenant_alphaville' as TenantId, name: 'AcertGo Alphaville & Tamboré', city: 'Barueri - SP' },
    { id: 'tenant_barra' as TenantId, name: 'AcertGo Barra & Recreio', city: 'Rio de Janeiro - RJ' },
  ];

  const tenants = availableTenants && availableTenants.length > 0 ? availableTenants : defaultTenants;
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'MASTER_ADMIN':
        return { label: 'Diretor / Sócio', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'MANAGER':
        return { label: 'Gerente', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'BROKER':
        return { label: 'Corretor', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'FINANCIAL_OPERATOR':
        return { label: 'Financeiro', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'EXTERNAL_PARTNER':
        return { label: 'Parceiro', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
      default:
        return { label: role, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);
  const selectedPreset = PRESET_LOGOS.find(p => p.id === themeConfig?.presetLogoId) || PRESET_LOGOS[0];
  const primaryColor = themeConfig?.primaryColor || '#2563eb';

  return (
    <header ref={headerRef} className="h-14 sm:h-16 bg-white border-b border-slate-200/90 px-2.5 sm:px-4 md:px-5 flex items-center justify-between sticky top-0 z-30 shadow-2xs select-none">
      
      {/* Zone 1: Mobile Hamburger + Dynamic Brand Logo & Name + Tenant */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1 sm:p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Abrir Menu de Módulos"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Dynamic Logo & Platform Branding */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {themeConfig?.logoUrl && themeConfig.logoType !== 'preset' ? (
            <img 
              src={themeConfig.logoUrl} 
              alt={themeConfig.platformName} 
              className="w-7 h-7 sm:w-9 sm:h-9 object-contain rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-2xs shrink-0" 
            />
          ) : (
            <div 
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-tr ${selectedPreset.iconBg} flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-sm shrink-0`}
            >
              {selectedPreset.initial}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 leading-none whitespace-nowrap">
              {themeConfig?.platformName || 'AcertGo'}
              <span 
                className="ml-0.5 sm:ml-1 text-[11px] sm:text-sm font-semibold inline-block"
                style={{ color: primaryColor }}
              >
                OS
              </span>
            </span>
            <span className="text-[9px] uppercase font-semibold tracking-wider text-slate-500 hidden sm:inline whitespace-nowrap">
              {themeConfig?.tagline || 'CRM · ERP · Fintech'}
            </span>
          </div>
        </div>

        {/* Voltar / Avançar Navigation Controls */}
        {onGoBack && canGoBack && (
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 p-0.5 sm:p-1 rounded-xl border border-slate-200/90 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 bg-white shadow-xs hover:bg-blue-50 hover:text-blue-700 active:scale-95 cursor-pointer border border-slate-200/70 select-none"
              title={previousStepLabel ? `Voltar para: ${previousStepLabel}` : 'Voltar'}
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span className="font-semibold text-xs hidden sm:inline">Voltar</span>
              {previousStepLabel && (
                <span className="hidden xl:inline text-[10px] text-slate-500 font-normal max-w-[120px] truncate">
                  ({previousStepLabel})
                </span>
              )}
            </button>

            {onGoForward && (
              <button
                type="button"
                onClick={onGoForward}
                disabled={!canGoForward}
                className={`p-1 rounded-lg text-xs transition-all select-none hidden sm:block ${
                  canGoForward
                    ? 'text-slate-700 hover:bg-white hover:text-blue-600 active:scale-95 cursor-pointer'
                    : 'text-slate-300 cursor-not-allowed opacity-40'
                }`}
                title={canGoForward ? `Avançar para: ${nextStepLabel || 'próxima etapa'}` : 'Sem próxima etapa'}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Tenant Switcher (Dropdown) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowTenantDropdown(!showTenantDropdown);
              setShowRoleDropdown(false);
              setShowShortcutsMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span className="truncate max-w-[110px] lg:max-w-[170px]">{currentTenant.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showTenantDropdown && (
            <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Alternar Filial / Tenant
                </span>
                <button
                  type="button"
                  onClick={() => setShowTenantDropdown(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Fechar"
                  aria-label="Fechar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {tenants.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTenant(t.id);
                    setShowTenantDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col transition-colors ${
                    selectedTenantId === t.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.name}</span>
                  <span className="text-[10px] text-slate-400">{t.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Actions, Brand Customizer & Profile */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        
        {/* Unified Tools & Shortcuts Menu (Desktop only - Hidden on Mobile) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowShortcutsMenu(!showShortcutsMenu);
              setShowTvMenu(false);
              setShowTenantDropdown(false);
              setShowRoleDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all shadow-2xs cursor-pointer"
            title="Ferramentas e Atalhos da Plataforma"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Atalhos</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showShortcutsMenu && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Ferramentas & Ações</span>
                <button
                  type="button"
                  onClick={() => setShowShortcutsMenu(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {onOpenThemeModal && (
                <button
                  onClick={() => {
                    onOpenThemeModal();
                    setShowShortcutsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span>Personalizar Cores & Logotipo</span>
                </button>
              )}

              {onOpenDemoSandbox && (
                <button
                  onClick={() => {
                    onOpenDemoSandbox();
                    setShowShortcutsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Modo Apresentação (Pitch)</span>
                </button>
              )}

              {onOpenFreeAiTools && (
                <button
                  onClick={() => {
                    onOpenFreeAiTools();
                    setShowShortcutsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Central de IA (Auditoria & Mapas)</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenAiStudio();
                  setShowShortcutsMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AcertAI Copilot & SDR</span>
              </button>

              {onOpenBirthdayHub && (
                <button
                  onClick={() => {
                    onOpenBirthdayHub();
                    setShowShortcutsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <Cake className="w-4 h-4 text-rose-500" />
                  <span>Central de Aniversários</span>
                </button>
              )}

              {onOpenSuperAdmin && (
                <button
                  onClick={() => {
                    onOpenSuperAdmin();
                    setShowShortcutsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Painel de Administração</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenSchemaModal();
                  setShowShortcutsMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Database className="w-4 h-4 text-slate-500" />
                <span>Estrutura do Banco de Dados</span>
              </button>
            </div>
          )}
        </div>

        {/* TV Salão Unified Dropdown (Desktop only) */}
        {(onOpenTvRanking || onOpenTvControlModal) && (
          <div className="relative hidden lg:block">
            <button
              onClick={() => {
                setShowTvMenu(!showTvMenu);
                setShowShortcutsMenu(false);
                setShowTenantDropdown(false);
                setShowRoleDropdown(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              title="Modo TV e Gestão do Salão de Vendas"
            >
              <Tv className="w-3.5 h-3.5 text-amber-600" />
              <span>TV Salão</span>
              <ChevronDown className="w-3 h-3 text-amber-600" />
            </button>

            {showTvMenu && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {onOpenTvRanking && (
                  <button
                    onClick={() => {
                      onOpenTvRanking();
                      setShowTvMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <Tv className="w-4 h-4 text-amber-600" />
                    <span>Abrir Tela da TV Salão (16:9)</span>
                  </button>
                )}
                {onOpenTvControlModal && (
                  <button
                    onClick={() => {
                      onOpenTvControlModal();
                      setShowTvMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span>Notificar TV & Tocar Sino</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Primary Action: Novo Lead (Hidden on extra small mobile to prevent any collision) */}
        <button
          onClick={onOpenNewLead}
          className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Novo Lead</span>
        </button>

        {/* Column 3 Toggle Button (Desktop only) */}
        {onToggleRightRail && (
          <button
            onClick={onToggleRightRail}
            className={`hidden xl:flex p-1.5 rounded-lg border transition-all ${
              isRightRailOpen
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
            }`}
            title={isRightRailOpen ? 'Recolher Painel Lateral' : 'Expandir Painel Lateral'}
          >
            <Columns className="w-4 h-4" />
          </button>
        )}

        {/* Notifications & SLA Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowTenantDropdown(false);
              setShowRoleDropdown(false);
              setShowShortcutsMenu(false);
              setShowTvMenu(false);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 relative transition-colors cursor-pointer"
            title="Notificações e Alertas"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">Alertas</span>
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="text-[10px] text-rose-700 font-black bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full">
                      {notifications.filter(n => !n.isRead).length} novos
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onMarkAllNotificationsRead && notifications.some(n => !n.isRead) && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[10px] text-slate-500 hover:text-blue-600 font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Marcar todas como lidas"
                    >
                      <Check className="w-3 h-3" />
                      <span>Lidas</span>
                    </button>
                  )}
                  {onClearAllNotifications && notifications.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Deseja excluir todas as notificações permanentemente?')) {
                          onClearAllNotifications();
                        }
                      }}
                      className="text-[10px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Excluir todas definitivamente"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpar</span>
                    </button>
                  )}
                  {onOpenNotificationsCenter && (
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onOpenNotificationsCenter();
                      }}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
                    >
                      Ver Central →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Fechar Notificações"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notification items list */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl border text-xs transition-all relative group ${
                      !notif.isRead
                        ? notif.priority === 'CRITICA'
                          ? 'bg-rose-50/80 border-rose-200'
                          : 'bg-blue-50/70 border-blue-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="font-bold text-slate-900 leading-tight block break-words pr-5">
                        {notif.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">
                        {notif.createdAt}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed break-words">
                      {notif.message}
                    </p>
                    {onDeleteNotification && (
                      <button
                        onClick={() => onDeleteNotification(notif.id)}
                        className="absolute bottom-2 right-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                        title="Excluir notificação definitivamente"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Nenhuma notificação no momento
                  </div>
                )}
              </div>

              {/* Bottom Quick Test Actions */}
              {onTriggerSimulatedPush && (
                <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Testar Push:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onTriggerSimulatedPush('LEAD_ROLETA')}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <Flame className="w-3 h-3 text-rose-500" />
                      <span>+ Lead</span>
                    </button>
                    <button
                      onClick={() => onTriggerSimulatedPush('FINANCEIRO_SPLIT')}
                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>+ Pix</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User RBAC Profile Switcher */}
        <div className="relative border-l border-slate-200 pl-1.5 sm:pl-2">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowTenantDropdown(false);
              setShowShortcutsMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 hover:opacity-90 transition-opacity text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="hidden 2xl:flex flex-col">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className={`text-[9px] font-medium px-1 rounded border ${roleInfo.bg}`}>
                {roleInfo.label}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Simulador de Perfis</p>
                  <p className="text-[11px] text-slate-500">
                    Alterne a perspectiva de visualização:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Fechar"
                  aria-label="Fechar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {CURRENT_USER_PROFILES.map((usr) => {
                  const b = getRoleBadge(usr.role);
                  return (
                    <button
                      key={usr.id}
                      onClick={() => {
                        onSelectUser(usr);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.id === usr.id ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img
                        src={usr.avatar}
                        alt={usr.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-slate-900 font-semibold truncate">{usr.name}</span>
                        <span className={`text-[10px] inline-block font-medium ${b.bg} px-1.5 py-0.2 rounded mt-0.5`}>
                          {b.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Agency Governance Rules Shortcut */}
              {onOpenGovernanceRules && (
                <div className="pt-2 mt-1 border-t border-slate-100 px-2">
                  <button
                    onClick={() => {
                      onOpenGovernanceRules();
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      Regras da Imobiliária
                    </span>
                    <span className="text-[10px] bg-indigo-200/60 text-indigo-800 px-1 rounded font-semibold">
                      Governança
                    </span>
                  </button>
                </div>
              )}

              {/* Secure Multitenant Logout (No credentials saved) */}
              {onLogout && (
                <div className="pt-1 mt-1 border-t border-slate-100 px-2">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Sair / Encerrar Sessão
                    </span>
                    <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      Sem salvar
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

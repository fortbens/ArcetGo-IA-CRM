import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Users, 
  User,
  MapPin,
  Layers, 
  CreditCard, 
  Shield, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Lock, 
  Unlock, 
  Sparkles, 
  ArrowUpRight, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Home, 
  LogIn, 
  Save, 
  Palette,
  Server,
  RefreshCw,
  Sliders,
  Database,
  Flame,
  RotateCcw,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Check,
  Globe,
  Send,
  Key,
  Copy
} from 'lucide-react';
import { updateBrowserFavicon, readFileAsDataUrl } from '../../utils/faviconManager';

import { 
  TenantAgency, 
  SaaSPlan, 
  SaaSModule, 
  PlatformUserAccount, 
  SystemWhiteLabelConfig, 
  AuditLogItem, 
  TenantStatus,
  AuditLogSeverity 
} from '../../types/superAdmin';

import { TenantModal } from './TenantModal';
import { TenantDetailModal } from './TenantDetailModal';
import { PlanModal } from './PlanModal';
import { UserAdminModal } from './UserAdminModal';
import { SalesPageCmsView } from './SalesPageCmsView';
import { CpanelDeploymentGuideModal } from './CpanelDeploymentGuideModal';
import { SalesPageCmsState } from '../../types/salesPageCms';
import { INITIAL_SALES_PAGE_DATA } from '../../data/mockSalesPageData';

interface SuperAdminViewProps {
  tenants: TenantAgency[];
  plans: SaaSPlan[];
  modules: SaaSModule[];
  users: PlatformUserAccount[];
  config: SystemWhiteLabelConfig;
  auditLogs: AuditLogItem[];
  onSaveTenant: (tenant: Partial<TenantAgency>) => void;
  onDeleteTenant: (tenantId: string) => void;
  onToggleTenantStatus: (tenantId: string, status: TenantStatus) => void;
  onSavePlan: (plan: Partial<SaaSPlan>) => void;
  onDeletePlan: (planId: string) => void;
  onSaveUser: (user: Partial<PlatformUserAccount>) => void;
  onDeleteUser: (userId: string) => void;
  onSaveConfig: (config: SystemWhiteLabelConfig) => void;
  onImpersonateTenant: (tenantId: string) => void;
  hierarchies: any[];
  permissions: any[];
  salesPageCmsData?: SalesPageCmsState;
  onUpdateSalesPageCmsData?: (data: SalesPageCmsState) => void;
  onOpenLiveSalesPage?: () => void;
  systemEnvironment?: 'PRODUCTION' | 'TEST';
  onToggleSystemEnvironment?: (env: 'PRODUCTION' | 'TEST') => void;
  onPurgeProductionData?: () => void;
  onResetTestData?: () => void;
  onInjectTestLead?: () => void;
}

export type SuperAdminSubTab = 
  | 'overview'
  | 'environment'
  | 'tenants' 
  | 'plans' 
  | 'users' 
  | 'whitelabel' 
  | 'audit'
  | 'sales_page_cms';

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  tenants,
  plans,
  modules,
  users,
  config,
  auditLogs,
  onSaveTenant,
  onDeleteTenant,
  onToggleTenantStatus,
  onSavePlan,
  onDeletePlan,
  onSaveUser,
  onDeleteUser,
  onSaveConfig,
  onImpersonateTenant,
  hierarchies,
  permissions,
  salesPageCmsData,
  onUpdateSalesPageCmsData,
  onOpenLiveSalesPage,
  systemEnvironment = 'PRODUCTION',
  onToggleSystemEnvironment,
  onPurgeProductionData,
  onResetTestData,
  onInjectTestLead
}) => {
  const [currentSubTab, setCurrentSubTab] = useState<SuperAdminSubTab>('tenants');
  
  // Sales Page CMS state (sync with prop or internal fallback)
  const [localSalesData, setLocalSalesData] = useState<SalesPageCmsState>(
    salesPageCmsData || INITIAL_SALES_PAGE_DATA
  );

  // Environment state
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [environmentToast, setEnvironmentToast] = useState<string | null>(null);
  const [isCpanelModalOpen, setIsCpanelModalOpen] = useState(false);

  const handleUpdateSalesData = (updated: SalesPageCmsState) => {
    setLocalSalesData(updated);
    if (onUpdateSalesPageCmsData) {
      onUpdateSalesPageCmsData(updated);
    }
  };
  
  // Search & Filter state for Tenants
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantStatusFilter, setTenantStatusFilter] = useState<'ALL' | TenantStatus>('ALL');
  const [tenantPlanFilter, setTenantPlanFilter] = useState<string>('ALL');

  // Search & Filter for Users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userTenantFilter, setUserTenantFilter] = useState<string>('ALL');

  // Search & Filter for Logs
  const [logSearch, setLogSearch] = useState('');
  const [logSeverityFilter, setLogSeverityFilter] = useState<string>('ALL');

  // Modals state
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState<TenantAgency | null>(null);

  const [isTenantDetailModalOpen, setIsTenantDetailModalOpen] = useState(false);
  const [selectedTenantDetail, setSelectedTenantDetail] = useState<TenantAgency | null>(null);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<SaaSPlan | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<PlatformUserAccount | null>(null);
  const [userToViewDetails, setUserToViewDetails] = useState<PlatformUserAccount | null>(null);

  // White-label local state for live edits
  const [localConfig, setLocalConfig] = useState<SystemWhiteLabelConfig>(config);
  const [configSavedToast, setConfigSavedToast] = useState(false);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [faviconSuccessMessage, setFaviconSuccessMessage] = useState<string | null>(null);
  const [faviconErrorMessage, setFaviconErrorMessage] = useState<string | null>(null);
  const [logoSuccessMessage, setLogoSuccessMessage] = useState<string | null>(null);
  const [logoErrorMessage, setLogoErrorMessage] = useState<string | null>(null);

  const handleFaviconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconErrorMessage(null);
    if (file.size > 2 * 1024 * 1024) {
      setFaviconErrorMessage('O arquivo de favicon deve ter no máximo 2MB.');
      setTimeout(() => setFaviconErrorMessage(null), 4000);
      return;
    }
    try {
      const base64Url = await readFileAsDataUrl(file);
      setLocalConfig(prev => ({ ...prev, faviconUrl: base64Url }));
      updateBrowserFavicon(base64Url);
      setFaviconSuccessMessage('Favicon enviado e atualizado na aba do navegador!');
      setTimeout(() => setFaviconSuccessMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setFaviconErrorMessage('Erro ao carregar o favicon.');
      setTimeout(() => setFaviconErrorMessage(null), 4000);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoErrorMessage(null);
    if (file.size > 3 * 1024 * 1024) {
      setLogoErrorMessage('O logotipo deve ter no máximo 3MB.');
      setTimeout(() => setLogoErrorMessage(null), 4000);
      return;
    }
    try {
      const base64Url = await readFileAsDataUrl(file);
      setLocalConfig(prev => ({ ...prev, logoUrl: base64Url }));
      setLogoSuccessMessage('Logotipo enviado com sucesso!');
      setTimeout(() => setLogoSuccessMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setLogoErrorMessage('Erro ao carregar o logotipo.');
      setTimeout(() => setLogoErrorMessage(null), 4000);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(localConfig);
    if (localConfig.faviconUrl) {
      updateBrowserFavicon(localConfig.faviconUrl);
    }
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
  };

  // SaaS KPIs calculation
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'ACTIVE').length;
  const trialTenants = tenants.filter(t => t.status === 'TRIAL').length;
  const suspendedTenants = tenants.filter(t => t.status === 'SUSPENDED').length;
  
  const totalMRR = tenants
    .filter(t => t.status === 'ACTIVE')
    .reduce((sum, t) => sum + (t.monthlyBilling || 0), 0);

  const totalPlatformUsers = users.length;
  const totalPropertiesInNetwork = tenants.reduce((sum, t) => sum + (t.stats?.propertiesCount || 0), 0);

  // Filtered Tenants
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.tradeName.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.city.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      (t.cnpj && t.cnpj.includes(tenantSearch));
    const matchesStatus = tenantStatusFilter === 'ALL' || t.status === tenantStatusFilter;
    const matchesPlan = tenantPlanFilter === 'ALL' || t.planId === tenantPlanFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.creci && u.creci.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesTenant = userTenantFilter === 'ALL' || u.tenantId === userTenantFilter;
    return matchesSearch && matchesRole && matchesTenant;
  });

  // Filtered Logs
  const filteredLogs = auditLogs.filter(l => {
    const matchesSearch = 
      l.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      (l.tenantName && l.tenantName.toLowerCase().includes(logSearch.toLowerCase()));
    const matchesSeverity = logSeverityFilter === 'ALL' || l.severity === logSeverityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16 overflow-y-auto">
      {/* Top Banner / Platform Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Painel Administrativo
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Gestão Global da Plataforma SaaS
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Controle unificado de imobiliárias clientes, assinaturas, planos, white-label e auditoria de sistema.
              </p>
            </div>

            {/* Quick Actions & Environment Toggle */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Chavinha de Ambiente: Produção (Limpo / Zerado) vs Testes */}
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 pl-2">Ambiente:</span>
                <button
                  type="button"
                  onClick={() => onToggleSystemEnvironment && onToggleSystemEnvironment('PRODUCTION')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    systemEnvironment === 'PRODUCTION'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                  title="Produção: Banco de dados limpo e zerado"
                >
                  <span className={`w-2 h-2 rounded-full ${systemEnvironment === 'PRODUCTION' ? 'bg-emerald-300 animate-pulse' : 'bg-slate-600'}`}></span>
                  <span>Produção (Zerado)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSystemEnvironment && onToggleSystemEnvironment('TEST')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    systemEnvironment === 'TEST'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                  title="Modo Testes / Sandbox: Dados simulados para apresentação"
                >
                  <span className={`w-2 h-2 rounded-full ${systemEnvironment === 'TEST' ? 'bg-amber-300 animate-pulse' : 'bg-slate-600'}`}></span>
                  <span>Testes / Sandbox</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setTenantToEdit(null);
                  setIsTenantModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Nova Imobiliária (Tenant)
              </button>
              <button
                onClick={() => {
                  setPlanToEdit(null);
                  setIsPlanModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-purple-400" />
                Criar Plano
              </button>

              <button
                type="button"
                onClick={() => setIsCpanelModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-cyan-200 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/80 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Configuração de Domínios no cPanel HomeHost (acertgo.com.br e aicrm.acertgo.com.br)"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">cPanel HomeHost</span>
                <span className="sm:hidden">cPanel</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-cyan-500/20 text-cyan-300">aicrm</span>
              </button>
            </div>
          </div>

          {/* Quick SaaS Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>MRR Recorrente</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                R$ {totalMRR.toLocaleString('pt-BR')}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-semibold">
                <ArrowUpRight className="w-3 h-3" /> +16.4% este mês
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Imobiliárias</span>
                <Building2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                {totalTenants}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                <strong className="text-emerald-400">{activeTenants}</strong> ativas · <strong className="text-blue-400">{trialTenants}</strong> trial
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Usuários da Rede</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                {totalPlatformUsers}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Total de corretores & gestores
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Estoque Global</span>
                <Home className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                {totalPropertiesInNetwork}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Imóveis cadastrados na rede
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Retenção & Churn</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                99.1%
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">
                Churn mensal: 0.9%
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-800/80 mt-6 no-scrollbar text-xs font-semibold">
            {[
              { id: 'environment' as SuperAdminSubTab, label: 'Ambiente & Banco (Produção / Testes)', icon: Server },
              { id: 'tenants' as SuperAdminSubTab, label: 'Imobiliárias (Tenants)', icon: Building2, count: totalTenants },
              { id: 'plans' as SuperAdminSubTab, label: 'Planos & Módulos', icon: CreditCard, count: plans.length },
              { id: 'users' as SuperAdminSubTab, label: 'Usuários & Hierarquias', icon: Users, count: users.length },
              { id: 'sales_page_cms' as SuperAdminSubTab, label: 'CMS Página de Vendas (R$ 399,99+)', icon: Sparkles, count: localSalesData.leads.length },
              { id: 'whitelabel' as SuperAdminSubTab, label: 'Configurações White-label & Sistema', icon: Settings },
              { id: 'audit' as SuperAdminSubTab, label: 'Logs & Auditoria', icon: Shield, count: auditLogs.length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = currentSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSubTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ======================================================== */}
        {/* TAB 0: AMBIENTE DE PRODUÇÃO E TESTES                      */}
        {/* ======================================================== */}
        {currentSubTab === 'environment' && (
          <div className="space-y-6">
            {/* Feedback Toast */}
            {environmentToast && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{environmentToast}</span>
              </div>
            )}

            {/* Current Environment Hero Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
              systemEnvironment === 'PRODUCTION'
                ? 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-emerald-500/40 text-white'
                : 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border-amber-500/40 text-white'
            }`}>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                      systemEnvironment === 'PRODUCTION'
                        ? 'bg-emerald-600 text-white border border-emerald-400/40'
                        : 'bg-amber-600 text-white border border-amber-400/40'
                    }`}>
                      <Server className="w-3.5 h-3.5" />
                      {systemEnvironment === 'PRODUCTION' ? 'Ambiente de Produção Ativo' : 'Modo Testes / Sandbox Ativo'}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      {systemEnvironment === 'PRODUCTION' ? 'Banco de Dados 100% Limpo (Zerado)' : 'Massa de Dados Simulada'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    {systemEnvironment === 'PRODUCTION' 
                      ? 'Ambiente de Produção Oficial: Zero Fictícios' 
                      : 'Ambiente de Testes / Sandbox para Apresentações'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {systemEnvironment === 'PRODUCTION'
                      ? 'O sistema está operando no banco de produção limpo. Nenhum lead, imóvel ou contrato fictício de teste é exibido. Todos os registros inseridos são dados operacionais reais da sua imobiliária.'
                      : 'O sistema está com a massa de dados de teste carregada (imóveis de luxo modelo, leads com simulação de SLA na roleta, propostas e comissões para treino de equipe e pitch comercial).'}
                  </p>
                </div>

                {/* Primary Switcher Button & Quick Purge */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                  {systemEnvironment === 'PRODUCTION' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (onToggleSystemEnvironment) onToggleSystemEnvironment('TEST');
                          setEnvironmentToast('Alternado para Modo Testes / Sandbox (Massa demonstrativa carregada)!');
                          setTimeout(() => setEnvironmentToast(null), 3500);
                        }}
                        className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Alternar para Modo Testes / Sandbox</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPurgeConfirm(true)}
                        className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                        <span>Zerar / Limpar Produção</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (onToggleSystemEnvironment) onToggleSystemEnvironment('PRODUCTION');
                          setEnvironmentToast('Alternado para Ambiente de Produção Oficial (Banco de dados limpo / zerado)!');
                          setTimeout(() => setEnvironmentToast(null), 3500);
                        }}
                        className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mudar para Produção (Banco Zerado)</span>
                      </button>

                      {onInjectTestLead && (
                        <button
                          type="button"
                          onClick={() => {
                            onInjectTestLead();
                            setEnvironmentToast('Lead quente de teste injetado na roleta ao vivo!');
                            setTimeout(() => setEnvironmentToast(null), 3000);
                          }}
                          className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                        >
                          <Flame className="w-4 h-4 text-rose-400" />
                          <span>Injetar Lead de Teste ao Vivo</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Architecture Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Isolamento Total do Ambiente de Produção</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No <strong>Ambiente de Produção</strong>, todos os módulos (Leads, Clientes, Imóveis, Proprietários, Vistorias, Contratos e Financeiro) operam sem qualquer contaminação por dados de teste. Ao criar novos registros, eles são salvos com segurança no armazenamento de produção.
                </p>
                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  Status: <strong className={systemEnvironment === 'PRODUCTION' ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                    {systemEnvironment === 'PRODUCTION' ? 'ATIVO EM PRODUÇÃO LIMPA' : 'INATIVO (EM SANDBOX)'}
                  </strong>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>Modo Testes / Sandbox Sob Demanda</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quando precisar realizar treinamentos de novos corretores, testar regras de comissão ou demonstrar a plataforma para sócios e investidores, basta acionar a chavinha no menu do Super Admin.
                </p>
                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  Status: <strong className={systemEnvironment === 'TEST' ? 'text-amber-700 font-bold' : 'text-slate-600'}>
                    {systemEnvironment === 'TEST' ? 'ATIVO EM MODO SANDBOX' : 'INATIVO'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Purge Confirmation Modal */}
            {showPurgeConfirm && (
              <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Zerar Banco de Produção?</h3>
                      <p className="text-xs text-slate-500">Garantir estado 100% limpo</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Esta ação irá remover todos os leads, imóveis, proprietários e propostas salvos em produção, deixando o ambiente <strong>completamente zerado e limpo</strong>.
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPurgeConfirm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onPurgeProductionData) onPurgeProductionData();
                        setShowPurgeConfirm(false);
                        setEnvironmentToast('Banco de dados de produção foi completamente limpo e zerado!');
                        setTimeout(() => setEnvironmentToast(null), 3500);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer"
                    >
                      Confirmar Limpeza (Zerar)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: IMOBILIÁRIAS (TENANTS)                             */}
        {/* ======================================================== */}
        {currentSubTab === 'tenants' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  placeholder="Buscar por nome, razão social, CNPJ, subdomínio ou cidade..."
                  className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <select
                  value={tenantStatusFilter}
                  onChange={(e) => setTenantStatusFilter(e.target.value as any)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-slate-700"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="ACTIVE">Ativas</option>
                  <option value="TRIAL">Em Teste (Trial)</option>
                  <option value="SUSPENDED">Suspensas</option>
                  <option value="CANCELLED">Canceladas</option>
                </select>

                {/* Plan Filter */}
                <select
                  value={tenantPlanFilter}
                  onChange={(e) => setTenantPlanFilter(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-slate-700"
                >
                  <option value="ALL">Todos os Planos</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setTenantToEdit(null);
                    setIsTenantModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Cadastrar Imobiliária
                </button>
              </div>
            </div>

            {/* Tenants Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Imobiliária / Subdomínio</th>
                      <th className="py-3.5 px-4">Plano & Faturamento</th>
                      <th className="py-3.5 px-4">Módulos Contratados</th>
                      <th className="py-3.5 px-4">Usuários / Imóveis</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Nenhuma imobiliária encontrada para os critérios selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((tenant) => {
                        const isSuspended = tenant.status === 'SUSPENDED';
                        const isTrial = tenant.status === 'TRIAL';

                        return (
                          <tr 
                            key={tenant.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isSuspended ? 'bg-rose-50/20' : ''
                            }`}
                          >
                            {/* Imobiliária & Subdomínio */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {tenant.logoUrl ? (
                                  <img
                                    src={tenant.logoUrl}
                                    alt={tenant.tradeName}
                                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                    {tenant.tradeName.charAt(0)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate">
                                    {tenant.tradeName}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {tenant.name} · {tenant.city}/{tenant.state}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-mono mt-0.5">
                                    <ExternalLink className="w-3 h-3" />
                                    <span>{tenant.subdomain}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Plano & Faturamento */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">
                                {tenant.planName}
                              </div>
                              <div className="text-[11px] font-bold text-emerald-700">
                                R$ {tenant.monthlyBilling.toLocaleString('pt-BR')}/mês
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Ciclo {tenant.billingCycle} · {tenant.paymentMethod}
                              </div>
                            </td>

                            {/* Módulos */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  {tenant.activeModules.length} módulos ativos
                                </span>
                                {tenant.activeModules.includes('fintech_split') && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-medium">
                                    Split Pix
                                  </span>
                                )}
                                {tenant.activeModules.includes('acertai_engine') && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-medium">
                                    AcertAI
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Usuários & Imóveis */}
                            <td className="py-3.5 px-4">
                              <div className="text-slate-800 font-medium">
                                <strong>{tenant.stats.usersCount}</strong> usuários
                              </div>
                              <div className="text-[11px] text-slate-500">
                                <strong>{tenant.stats.propertiesCount}</strong> imóveis
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              {tenant.status === 'ACTIVE' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Ativa
                                </span>
                              )}
                              {tenant.status === 'TRIAL' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  <Clock className="w-3 h-3" /> Em Testes
                                </span>
                              )}
                              {tenant.status === 'SUSPENDED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  <Lock className="w-3 h-3" /> Suspensa
                                </span>
                              )}
                              {tenant.status === 'CANCELLED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  Cancelada
                                </span>
                              )}
                            </td>

                            {/* Ações */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    const text = `🏢 *ACERTGO IMOBILIÁRIA - CREDENCIAIS DE ACESSO & INÍCIO DE TRABALHO*
--------------------------------------------------
*Imobiliária:* ${tenant.tradeName}
*E-mail de Login:* ${tenant.ownerEmail}
*Senha de Acesso:* ${tenant.adminPassword || 'Acert@2026'}
*Código de Convite:* ${tenant.inviteCode || 'IMO-2026'}
*Módulo de Entrada:* ${tenant.initialModule || 'kanban'}
*Site Escolhido:* ${tenant.chosenSiteTemplate || 'URBAN_FLOW'}
*Link do Sistema:* https://${tenant.subdomain || 'matriz.acertgo.com.br'}
--------------------------------------------------
👉 Inicie agora mesmo seus atendimentos!`;
                                    navigator.clipboard.writeText(text);
                                    alert(`Ficha de acesso de "${tenant.tradeName}" copiada com sucesso para WhatsApp!`);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Copiar Ficha de Acesso WhatsApp"
                                >
                                  <Send className="w-4 h-4 text-emerald-600" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTenantDetail(tenant);
                                    setIsTenantDetailModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Visualizar Detalhes 360°"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setTenantToEdit(tenant);
                                    setIsTenantModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Editar Imobiliária"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onImpersonateTenant(tenant.id)}
                                  className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  title="Acessar como usuário desta imobiliária (Simulação)"
                                >
                                  <LogIn className="w-4 h-4" />
                                </button>
                                {tenant.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => onToggleTenantStatus(tenant.id, 'SUSPENDED')}
                                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Suspender acesso"
                                  >
                                    <Lock className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onToggleTenantStatus(tenant.id, 'ACTIVE')}
                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Reativar acesso"
                                  >
                                    <Unlock className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (confirm(`Deseja excluir permanentemente a imobiliária "${tenant.tradeName}"?`)) {
                                      onDeleteTenant(tenant.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PLANOS & MÓDULOS CONTRATÁVEIS                      */}
        {/* ======================================================== */}
        {currentSubTab === 'plans' && (
          <div className="space-y-8">
            {/* Seção 1: Planos de Assinatura */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Planos de Assinatura SaaS
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gerencie os planos comerciais ofertados para novas e atuais imobiliárias.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPlanToEdit(null);
                    setIsPlanModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Criar Novo Plano
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  return (
                    <div
                      key={plan.id}
                      className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {plan.isPopular && (
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                          {plan.badge || 'Popular'}
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {plan.tier}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-2">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 min-h-[36px]">
                          {plan.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="text-2xl font-extrabold text-slate-900">
                            R$ {plan.monthlyPrice.toLocaleString('pt-BR')}
                            <span className="text-xs font-normal text-slate-500">/mês</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            ou R$ {plan.annualPrice.toLocaleString('pt-BR')}/ano faturado
                          </div>
                        </div>

                        {/* Limites */}
                        <div className="mt-4 space-y-1.5 text-xs text-slate-700">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Usuários:</span>
                            <strong>{plan.maxUsers === -1 ? 'Ilimitados' : `Até ${plan.maxUsers}`}</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Imóveis:</span>
                            <strong>{plan.maxProperties.toLocaleString('pt-BR')}</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Leads/mês:</span>
                            <strong>{plan.maxLeadsPerMonth.toLocaleString('pt-BR')}</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">WhatsApp Desk:</span>
                            <strong className={plan.whatsappIncluded ? 'text-emerald-600' : 'text-slate-400'}>
                              {plan.whatsappIncluded ? 'Incluso' : 'Add-on'}
                            </strong>
                          </div>
                        </div>

                        {/* Módulos inclusos count */}
                        <div className="mt-3 p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 font-medium">
                          ✓ {plan.includedModuleIds.length} módulos da plataforma inclusos
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          <strong>{plan.activeTenantsCount}</strong> clientes ativos
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setPlanToEdit(plan);
                              setIsPlanModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Editar Plano"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja excluir o plano "${plan.name}"?`)) {
                                onDeletePlan(plan.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir Plano"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seção 2: Catálogo de Módulos da Plataforma */}
            <div>
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Catálogo de Módulos SaaS ({modules.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Módulos de software disponíveis para ativação avulsa ou pacotes nos planos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                          {mod.category}
                        </span>
                        {mod.isCore ? (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Core da Plataforma
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700">
                            + R$ {mod.monthlyAddonPrice}/mês
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {mod.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {mod.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                      {mod.features.map(f => (
                        <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: USUÁRIOS & HIERARQUIAS                             */}
        {/* ======================================================== */}
        {currentSubTab === 'users' && (
          <div className="space-y-6">
            {/* Hierarchy Pyramid Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Estrutura de Hierarquias & Níveis de Acesso
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                O AcertGo possui 6 níveis hierárquicos bem delimitados para segurança da informação e governança multi-tenancy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hierarchies.map((h) => (
                  <div key={h.role} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${h.color}`}>
                        Nível {h.level}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{h.role}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{h.label}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Management Table */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar usuários por nome, email ou CRECI..."
                    className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={userTenantFilter}
                    onChange={(e) => setUserTenantFilter(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-slate-700"
                  >
                    <option value="ALL">Todas as Imobiliárias</option>
                    <option value="GLOBAL">Plataforma Global</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.tradeName}</option>
                    ))}
                  </select>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-slate-700"
                  >
                    <option value="ALL">Todos os Cargos</option>
                    {hierarchies.map(h => (
                      <option key={h.role} value={h.role}>{h.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setUserToEdit(null);
                      setIsUserModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Novo Usuário
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Usuário</th>
                        <th className="py-3.5 px-4">Imobiliária Vinculada</th>
                        <th className="py-3.5 px-4">Cargo & Hierarquia</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Último Acesso</th>
                        <th className="py-3.5 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredUsers.map((user) => {
                        const hInfo = hierarchies.find(h => h.role === user.role);

                        return (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate">
                                    {user.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {user.email}
                                  </div>
                                  {user.creci && (
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      CRECI: {user.creci}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-800">
                                {user.tenantName}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${hInfo?.color || 'bg-slate-100 text-slate-700'}`}>
                                {hInfo?.label || user.role}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {user.status === 'ATIVO' && (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ativo
                                </span>
                              )}
                              {user.status === 'BLOQUEADO' && (
                                <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Bloqueado
                                </span>
                              )}
                              {user.status === 'PENDENTE' && (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pendente
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-slate-500">
                              {user.lastLoginAt}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setUserToViewDetails(user)}
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Ver Ficha Cadastral, Endereço e Contato de Emergência"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setUserToEdit(user);
                                    setIsUserModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Editar Usuário & Permissões"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Deseja excluir o usuário "${user.name}"?`)) {
                                      onDeleteUser(user.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Excluir Usuário"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CONFIGURAÇÕES WHITE-LABEL & SISTEMA                 */}
        {/* ======================================================== */}
        {currentSubTab === 'whitelabel' && (
          <form onSubmit={handleSaveConfigSubmit} className="space-y-6">
            {configSavedToast && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Configurações do sistema e White-label atualizadas com sucesso!</span>
                </div>
              </div>
            )}

            {/* Identidade Visual & Branding Global */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-600" />
                    Identidade Visual da Plataforma SaaS (White-label)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Personalize o nome, logotipo e paleta de cores global exibida aos usuários.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Plataforma SaaS
                  </label>
                  <input
                    type="text"
                    value={localConfig.platformName}
                    onChange={(e) => setLocalConfig({ ...localConfig, platformName: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={localConfig.tagline}
                    onChange={(e) => setLocalConfig({ ...localConfig, tagline: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Hidden file inputs for Logo and Favicon Upload */}
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*,.png,.svg,.webp"
                onChange={handleLogoFileChange}
                className="hidden"
              />
              <input
                type="file"
                ref={faviconInputRef}
                accept="image/*,.ico,.png,.svg,.webp"
                onChange={handleFaviconFileChange}
                className="hidden"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Logotipo Principal */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      Logotipo Principal da Plataforma (PNG / SVG)
                    </label>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100/80 hover:bg-blue-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      title="Fazer upload de novo arquivo de logotipo"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Logotipo</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... ou faça upload do arquivo"
                        value={localConfig.logoUrl}
                        onChange={(e) => setLocalConfig({ ...localConfig, logoUrl: e.target.value })}
                        className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {localConfig.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLocalConfig({ ...localConfig, logoUrl: '' })}
                          className="px-2 py-1 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Limpar logotipo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {logoSuccessMessage && (
                      <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{logoSuccessMessage}</span>
                      </div>
                    )}

                    {logoErrorMessage && (
                      <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>{logoErrorMessage}</span>
                      </div>
                    )}

                    {/* Logo Preview */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Preview do Logo:</span>
                      {localConfig.logoUrl ? (
                        <div className="h-10 px-3 py-1 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                          <img
                            src={localConfig.logoUrl}
                            alt="Preview do Logotipo"
                            className="max-h-8 max-w-[160px] object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Nenhum logotipo definido</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Favicon da Aba do Navegador */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Favicon da Aba do Navegador (.ico, .png, .svg)
                    </label>
                    <div className="flex items-center gap-1.5">
                      {localConfig.logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setLocalConfig(prev => ({ ...prev, faviconUrl: prev.logoUrl }));
                            updateBrowserFavicon(localConfig.logoUrl);
                            setFaviconSuccessMessage('Favicon sincronizado com o logotipo!');
                            setTimeout(() => setFaviconSuccessMessage(null), 3000);
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Usar o mesmo arquivo do logotipo para o favicon"
                        >
                          Usar Logo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => faviconInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title="Subir arquivo de favicon do seu computador"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Favicon</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="/favicon.ico ou faça upload do arquivo"
                        value={localConfig.faviconUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalConfig({ ...localConfig, faviconUrl: val });
                          if (val) updateBrowserFavicon(val);
                        }}
                        className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {localConfig.faviconUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setLocalConfig({ ...localConfig, faviconUrl: '/favicon.ico' });
                            updateBrowserFavicon('/favicon.ico');
                          }}
                          className="px-2 py-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Restaurar favicon padrão"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {faviconSuccessMessage && (
                      <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{faviconSuccessMessage}</span>
                      </div>
                    )}

                    {faviconErrorMessage && (
                      <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>{faviconErrorMessage}</span>
                      </div>
                    )}

                    {/* Live Browser Tab Preview Widget */}
                    <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                        <span>Simulação da Aba no Navegador:</span>
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold normal-case">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Tempo Real
                        </span>
                      </div>

                      {/* Mock Browser Tab */}
                      <div className="bg-slate-100 p-1.5 rounded-md flex items-center">
                        <div className="bg-white px-3 py-1.5 rounded-t-md shadow-2xs border-t-2 border-blue-500 flex items-center gap-2 max-w-xs">
                          {localConfig.faviconUrl ? (
                            <img
                              src={localConfig.faviconUrl}
                              alt="Favicon Tab"
                              className="w-4 h-4 object-contain rounded-xs shrink-0"
                              onError={(e) => {
                                // Fallback icon on error
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-xs bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                              A
                            </div>
                          )}
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {localConfig.platformName || 'AcertGo Cloud OS'}
                          </span>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-600 ml-1 shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cores Globais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cor Primária (Theme Primary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig.primaryColor}
                      onChange={(e) => setLocalConfig({ ...localConfig, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localConfig.primaryColor}
                      onChange={(e) => setLocalConfig({ ...localConfig, primaryColor: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cor Secundária (Accent)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig.secondaryColor}
                      onChange={(e) => setLocalConfig({ ...localConfig, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localConfig.secondaryColor}
                      onChange={(e) => setLocalConfig({ ...localConfig, secondaryColor: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cor de Destaque / Sucesso
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig.accentColor}
                      onChange={(e) => setLocalConfig({ ...localConfig, accentColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localConfig.accentColor}
                      onChange={(e) => setLocalConfig({ ...localConfig, accentColor: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Preview Instantâneo */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Preview do Header SaaS
                </span>
                <div 
                  className="p-3.5 rounded-xl text-white flex items-center justify-between shadow-xs"
                  style={{ backgroundColor: localConfig.primaryColor }}
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-xs"
                      style={{ backgroundColor: localConfig.secondaryColor }}
                    >
                      A
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-none">{localConfig.platformName}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{localConfig.tagline}</div>
                    </div>
                  </div>
                  <span 
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: localConfig.accentColor }}
                  >
                    Ambiente Produção
                  </span>
                </div>
              </div>
            </div>

            {/* Gateway de Cobrança da Plataforma */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Gateway de Cobrança Recorrente das Imobiliárias
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Provedor do Gateway
                  </label>
                  <select
                    value={localConfig.billingGateway.provider}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      billingGateway: { ...localConfig.billingGateway, provider: e.target.value as any }
                    })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ASAAS">Asaas (Pix Recorrente & Boleto)</option>
                    <option value="STRIPE">Stripe Billing</option>
                    <option value="IUGU">Iugu Recorrência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ambiente
                  </label>
                  <select
                    value={localConfig.billingGateway.environment}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      billingGateway: { ...localConfig.billingGateway, environment: e.target.value as any }
                    })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="PRODUCTION">Produção (Live)</option>
                    <option value="SANDBOX">Sandbox / Homologação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dias de Tolerância p/ Suspensão
                  </label>
                  <input
                    type="number"
                    value={localConfig.billingGateway.autoSuspendOverdueDays}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      billingGateway: { ...localConfig.billingGateway, autoSuspendOverdueDays: parseInt(e.target.value) || 5 }
                    })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chave API Mascarada
                </label>
                <input
                  type="text"
                  value={localConfig.billingGateway.apiKeyMasked}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    billingGateway: { ...localConfig.billingGateway, apiKeyMasked: e.target.value }
                  })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL de Notificação Webhook (Liquidações)
                </label>
                <input
                  type="text"
                  value={localConfig.billingGateway.webhookUrl}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    billingGateway: { ...localConfig.billingGateway, webhookUrl: e.target.value }
                  })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono bg-slate-50"
                />
              </div>
            </div>

            {/* Suporte, Termos e Políticas */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-5 h-5 text-blue-600" />
                Canais de Suporte, Termos & Políticas Legais
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail do Suporte Técnico
                  </label>
                  <input
                    type="email"
                    value={localConfig.supportEmail}
                    onChange={(e) => setLocalConfig({ ...localConfig, supportEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone de Suporte / SLA
                  </label>
                  <input
                    type="text"
                    value={localConfig.supportPhone}
                    onChange={(e) => setLocalConfig({ ...localConfig, supportPhone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dias de Duração do Trial
                  </label>
                  <input
                    type="number"
                    value={localConfig.trialDurationDays}
                    onChange={(e) => setLocalConfig({ ...localConfig, trialDurationDays: parseInt(e.target.value) || 14 })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Infraestrutura de Domínios cPanel HomeHost */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/60 rounded-2xl shadow-xs border border-slate-800 p-6 space-y-4 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>Infraestrutura de Domínios & Hospedagem cPanel (HomeHost)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Multi-Domínio Ativo
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Roteamento inteligente automático configurado para o ecossistema AcertGo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCpanelModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  <Server className="w-4 h-4" />
                  <span>Ver Guia cPanel Passo a Passo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>Domínio da Página de Vendas (Público)</span>
                    <span className="text-blue-400 font-mono">public_html/</span>
                  </div>
                  <div className="text-sm font-bold text-white">https://acertgo.com.br</div>
                  <div className="text-slate-400 text-[11px]">
                    Landing page com apresentação de módulos, calculadora de ROI, planos e botão "Acessar CRM".
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>Subdomínio da Plataforma CRM / ERP</span>
                    <span className="text-emerald-400 font-mono">public_html/aicrm/</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">https://aicrm.acertgo.com.br</div>
                  <div className="text-slate-400 text-[11px]">
                    Ambiente operacional fechado com login seguro, roleta de leads, gestão imobiliária e ERP.
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Configurações Globais
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 5: LOGS & AUDITORIA DE SEGURANÇA                     */}
        {/* ======================================================== */}
        {currentSubTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Buscar nos logs por ação, usuário, imobiliária ou detalhe..."
                  className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={logSeverityFilter}
                  onChange={(e) => setLogSeverityFilter(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-slate-700"
                >
                  <option value="ALL">Todas as Severidades</option>
                  <option value="INFO">Apenas INFO</option>
                  <option value="WARNING">Avisos (WARNING)</option>
                  <option value="CRITICAL">Críticos (CRITICAL)</option>
                </select>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Severidade</th>
                      <th className="py-3 px-4">Ação</th>
                      <th className="py-3 px-4">Usuário</th>
                      <th className="py-3 px-4">Imobiliária</th>
                      <th className="py-3 px-4">IP / Origem</th>
                      <th className="py-3 px-4">Detalhes do Evento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          Nenhum registro de log encontrado para os filtros atuais.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => {
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString('pt-BR')}
                            </td>
                            <td className="py-3 px-4">
                              {log.severity === 'INFO' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  INFO
                                </span>
                              )}
                              {log.severity === 'WARNING' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  WARNING
                                </span>
                              )}
                              {log.severity === 'CRITICAL' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                  CRITICAL
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-[11px] text-slate-800">
                              {log.action}
                            </td>
                            <td className="py-3 px-4 text-slate-700">
                              <span className="font-semibold">{log.userName}</span>
                              <span className="text-[10px] text-slate-400 block">{log.userRole}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {log.tenantName || 'Plataforma Global'}
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {log.ipAddress}
                            </td>
                            <td className="py-3 px-4 text-slate-600 max-w-md">
                              {log.details}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: CMS DA PÁGINA DE VENDAS (R$ 399,99+)              */}
        {/* ======================================================== */}
        {currentSubTab === 'sales_page_cms' && (
          <SalesPageCmsView
            cmsData={localSalesData}
            onUpdateCmsData={handleUpdateSalesData}
            onOpenLiveSalesPage={() => {
              if (onOpenLiveSalesPage) {
                onOpenLiveSalesPage();
              }
            }}
            onConvertLeadToTenant={(lead) => {
              const newTenant: Partial<TenantAgency> = {
                name: lead.agencyName,
                tradeName: lead.agencyName,
                subdomain: lead.subdomain,
                status: 'ACTIVE',
                planId: lead.planId,
                planName: lead.planName || 'Plano Selecionado',
                city: lead.city.split('-')[0]?.trim() || lead.city,
                state: lead.city.split('-')[1]?.trim() || 'SP',
                ownerName: lead.fullName,
                ownerEmail: lead.email,
                ownerPhone: lead.phone,
                billingCycle: 'MENSAL',
                monthlyBilling: 399.99
              };
              onSaveTenant(newTenant);
            }}
          />
        )}

      </div>

      {/* Modals */}
      <TenantModal
        isOpen={isTenantModalOpen}
        onClose={() => {
          setIsTenantModalOpen(false);
          setTenantToEdit(null);
        }}
        onSave={onSaveTenant}
        tenantToEdit={tenantToEdit}
        availablePlans={plans}
        availableModules={modules}
      />

      <TenantDetailModal
        isOpen={isTenantDetailModalOpen}
        onClose={() => {
          setIsTenantDetailModalOpen(false);
          setSelectedTenantDetail(null);
        }}
        tenant={selectedTenantDetail}
        onEdit={(tenant) => {
          setTenantToEdit(tenant);
          setIsTenantModalOpen(true);
        }}
        onToggleStatus={onToggleTenantStatus}
        onDelete={onDeleteTenant}
        onImpersonate={onImpersonateTenant}
        availableModules={modules}
      />

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setPlanToEdit(null);
        }}
        onSave={onSavePlan}
        planToEdit={planToEdit}
        availableModules={modules}
      />

      <UserAdminModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={onSaveUser}
        userToEdit={userToEdit}
        tenants={tenants}
        hierarchies={hierarchies}
        permissions={permissions}
      />

      {/* User Full Profile & Emergency Modal */}
      {userToViewDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm">Ficha Cadastral do Usuário</span>
              </div>
              <button onClick={() => setUserToViewDetails(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={userToViewDetails.avatar}
                  alt={userToViewDetails.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{userToViewDetails.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{userToViewDetails.email}</p>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {userToViewDetails.tenantName} · Cargo: {userToViewDetails.role}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Telefone / WhatsApp:</span>
                  <strong>{userToViewDetails.phone || 'Não informado'}</strong>
                </div>
                {userToViewDetails.cpf && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">CPF:</span>
                    <strong className="font-mono">{userToViewDetails.cpf}</strong>
                  </div>
                )}
                {userToViewDetails.creci && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">CRECI:</span>
                    <strong className="font-mono">{userToViewDetails.creci}</strong>
                  </div>
                )}
                {userToViewDetails.department && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Departamento:</span>
                    <span>{userToViewDetails.department}</span>
                  </div>
                )}
                {userToViewDetails.admissionDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Data de Admissão:</span>
                    <span>{userToViewDetails.admissionDate}</span>
                  </div>
                )}
              </div>

              {/* Endereço */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Endereço Residencial
                </div>
                {userToViewDetails.address ? (
                  <div className="space-y-0.5 text-slate-700">
                    <div>
                      {userToViewDetails.address.street}, {userToViewDetails.address.number}
                      {userToViewDetails.address.complement ? ` (${userToViewDetails.address.complement})` : ''}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {userToViewDetails.address.neighborhood} - {userToViewDetails.address.city} / {userToViewDetails.address.state}
                    </div>
                    <div className="text-slate-400 font-mono text-[10px]">
                      CEP: {userToViewDetails.address.cep}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Endereço ainda não preenchido.</span>
                )}
              </div>

              {/* Contato de Emergência */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                <div className="font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1 text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Contato de Emergência
                </div>
                {userToViewDetails.emergencyContact?.name ? (
                  <div className="space-y-0.5">
                    <div className="font-semibold">
                      {userToViewDetails.emergencyContact.name} ({userToViewDetails.emergencyContact.relationship})
                    </div>
                    <div className="text-[11px] font-mono">
                      Tel: {userToViewDetails.emergencyContact.phone}
                      {userToViewDetails.emergencyContact.phoneAlt ? ` / ${userToViewDetails.emergencyContact.phoneAlt}` : ''}
                    </div>
                    {userToViewDetails.emergencyContact.notes && (
                      <div className="text-[10px] text-amber-800 mt-1 italic">
                        Obs: {userToViewDetails.emergencyContact.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-amber-800/70 italic text-[11px]">
                    Nenhum contato de emergência cadastrado ainda.
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => {
                  setUserToEdit(userToViewDetails);
                  setUserToViewDetails(null);
                  setIsUserModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                Editar Cadastro
              </button>
              <button
                onClick={() => setUserToViewDetails(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guia de Publicação no cPanel HomeHost Modal */}
      {isCpanelModalOpen && (
        <CpanelDeploymentGuideModal
          isOpen={isCpanelModalOpen}
          onClose={() => setIsCpanelModalOpen(false)}
        />
      )}
    </div>
  );
};

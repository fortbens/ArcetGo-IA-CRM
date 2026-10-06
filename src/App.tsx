/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ArrowLeft, X, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { Header } from './components/common/Header';
import { Sidebar, NavTabId } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { RightInspectorRail } from './components/common/RightInspectorRail';
import { ThemeBrandingModal } from './components/common/ThemeBrandingModal';
import { NavigationStepEntry, TAB_LABELS, getTabLabel } from './utils/navigationManager';
import { SystemThemeConfig, DEFAULT_SYSTEM_THEME, SYSTEM_COLOR_PRESETS } from './types/theme';
import { RodizioAtendimentoView } from './components/roleta/RodizioAtendimentoView';
import { WhaticketDesk } from './components/omnichannel/WhaticketDesk';
import { KanbanBoard } from './components/omnichannel/KanbanBoard';
import { LeadsListView } from './components/omnichannel/LeadsListView';
import { SalesMirrorView } from './components/sales-mirror/SalesMirrorView';
import { FintechSplitView } from './components/fintech/FintechSplitView';
import { FinancialErpView } from './components/finance/FinancialErpView';
import { NfseHomologacaoView } from './components/finance/NfseHomologacaoView';
import { CommissionsRpaView } from './components/finance/CommissionsRpaView';
import { CcaBankingView } from './components/cca/CcaBankingView';
import { BiPerformanceView } from './components/bi/BiPerformanceView';
import { BrandEquityView } from './components/brand/BrandEquityView';
import { InspectionsKeysView } from './components/operations/InspectionsKeysView';
import { FleetAssetsView } from './components/operations/FleetAssetsView';
import { VisitItineraryView } from './components/operations/VisitItineraryView';
import { DigitalSignatureView } from './components/legal/DigitalSignatureView';
import { GamificationView } from './components/gamification/GamificationView';
import { TvRankingPresentationView } from './components/tv/TvRankingPresentationView';
import { TvControlManagementModal } from './components/tv/TvControlManagementModal';
import { CorporateAcademyView } from './components/academy/CorporateAcademyView';
import { LegalSacView } from './components/legal/LegalSacView';
import { CentralAjudaSacView } from './components/help/CentralAjudaSacView';
import { DocumentTemplateGeneratorView } from './components/legal/DocumentTemplateGeneratorView';
import { UserPermissionsManagementView } from './components/super-admin/UserPermissionsManagementView';
import { PropertiesView } from './components/properties/PropertiesView';
import { OwnersView } from './components/owners/OwnersView';
import { SuperAdminView } from './components/super-admin/SuperAdminView';
import { PortalsAndSitesView } from './components/portals/PortalsAndSitesView';
import { ModelSitesView } from './components/portals/ModelSitesView';
import { IntegrationsHubView } from './components/integrations/IntegrationsHubView';
import { RentalManagementView } from './components/fintech/RentalManagementView';
import { IndiqueGanheView } from './components/referrals/IndiqueGanheView';
import { CustomerPortalView } from './components/customer-portal/CustomerPortalView';
import { ExternalPartnersView } from './components/operations/ExternalPartnersView';
import { HumanResourcesView } from './components/hr/HumanResourcesView';
import { ExecutiveDirectorDashboardView } from './components/dashboard/ExecutiveDirectorDashboardView';
import { NotificationCenterView } from './components/notifications/NotificationCenterView';
import { GlobalAnnouncementBanner } from './components/notifications/GlobalAnnouncementBanner';
import { PushNotificationToaster } from './components/notifications/PushNotificationToaster';
import { DemoSandboxBanner } from './components/demo/DemoSandboxBanner';
import { DemoSandboxModal } from './components/demo/DemoSandboxModal';
import { SalesLandingPageView } from './components/sales/SalesLandingPageView';
import { SalesProposalsView } from './components/sales/SalesProposalsView';
import { PtamModuleView } from './components/ptam/PtamModuleView';
import { MarketingIaStudioView } from './components/marketing/MarketingIaStudioView';
import { DataMigrationBackupView } from './components/migration/DataMigrationBackupView';
import { AgencyGovernanceRulesView } from './components/super-admin/AgencyGovernanceRulesView';
import { LoginAuthView } from './components/auth/LoginAuthView';
import { BirthdayWishesHubModal } from './components/modals/BirthdayWishesHubModal';
import { SalesPageCmsState, LeadRegistration } from './types/salesPageCms';
import { INITIAL_SALES_PAGE_DATA } from './data/mockSalesPageData';
import { purgeAllBrowserCaches, purgeStoredCredentials, initializeCacheControl } from './utils/cacheManager';
import { updateBrowserFavicon } from './utils/faviconManager';
import { 
  getInitialThemeConfig, 
  saveThemeConfigToCloud, 
  subscribeThemeConfigFromCloud,
  getInitialSystemConfig,
  saveSystemConfigToCloud,
  subscribeSystemConfigFromCloud,
  getInitialNotifications,
  saveNotificationsToCloud,
  clearAllNotificationsPermanently,
  subscribeNotificationsFromCloud,
  getInitialTenants,
  saveTenantsToCloud,
  getInitialPlatformUsers,
  savePlatformUsersToCloud,
  getInitialSalesPageCms,
  saveSalesPageCmsToCloud,
  subscribeSalesPageCmsFromCloud,
  getInitialAgencyGovernanceRules,
  saveAgencyGovernanceRulesToCloud,
  subscribeAgencyGovernanceRulesFromCloud,
  subscribeLeadsFromCloud,
  saveLeadsToCloud,
  saveSingleLeadToCloud,
  deleteLeadFromCloud,
  subscribePropertiesFromCloud,
  savePropertiesToCloud,
  saveSinglePropertyToCloud,
  deletePropertyFromCloud
} from './services/systemPersistenceService';
import { auth } from './services/firebase';

import { 
  SystemNotification, 
  PlatformBroadcastBanner, 
  NotificationCategory 
} from './types/notifications';
import { 
  INITIAL_NOTIFICATIONS, 
  INITIAL_BROADCAST_BANNERS 
} from './data/mockNotificationsData';

import { NewLeadModal } from './components/modals/NewLeadModal';
import { DatabaseSchemaModal } from './components/modals/DatabaseSchemaModal';
import { FreeAiToolsHubModal } from './components/ai/FreeAiToolsHubModal';
import { AiStudioModal } from './components/modals/AiStudioModal';
import { OwnerModal } from './components/owners/OwnerModal';
import { LeadDetailsModal } from './components/modals/LeadDetailsModal';
import { SalesPageLinkModal } from './components/modals/SalesPageLinkModal';

import { 
  UserProfile, 
  TenantId, 
  Lead, 
  LeadSource,
  RoletaQueue, 
  ChatMessage, 
  LeadFunnelStage,
  LeadInteraction,
  CCABankStage,
  Owner,
  RealEstateProperty,
  TenantAgency,
  SaaSPlan,
  SaaSModule,
  PlatformUserAccount,
  SystemWhiteLabelConfig,
  AuditLogItem,
  TenantStatus,
  ClientFollowUp,
  PropertyProposal,
  AgencyGovernanceRules,
  DEFAULT_AGENCY_GOVERNANCE_RULES
} from './types/crm';

import { 
  CURRENT_USER_PROFILES, 
  INITIAL_ROLETA_QUEUES, 
  INITIAL_LEADS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_DEVELOPMENT, 
  INITIAL_RENTAL_CONTRACTS, 
  INITIAL_COMMISSIONS,
  INITIAL_CCA_PROPOSALS,
  INITIAL_OWNERS,
  INITIAL_PROPERTIES
} from './data/mockData';

import {
  INITIAL_TENANTS,
  INITIAL_SAAS_PLANS,
  INITIAL_SAAS_MODULES,
  INITIAL_PLATFORM_USERS,
  INITIAL_WHITE_LABEL_CONFIG,
  INITIAL_AUDIT_LOGS,
  PLATFORM_HIERARCHIES,
  PERMISSION_DEFINITIONS
} from './data/mockSuperAdmin';
import { 
  isSalesRouteUrl, 
  isCrmSubdomain, 
  isSalesApexDomain, 
  navigateToCrm, 
  navigateToSales,
  PRODUCTION_DOMAINS 
} from './utils/domainRouting';

// Detecção inteligente de rota da Apresentação TV Salão de Vendas (/tv, /tv-ranking, ?view=tv-ranking)
function isTvRankingRouteUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname.toLowerCase();
  const h = window.location.hash.toLowerCase();
  const s = window.location.search.toLowerCase();
  return (
    p.startsWith('/tv') ||
    p.startsWith('/ranking-tv') ||
    p.startsWith('/tv-ranking') ||
    h.includes('tv-ranking') ||
    h.includes('tv') ||
    h.includes('ranking-tv') ||
    s.includes('view=tv') ||
    s.includes('mode=tv') ||
    s.includes('tv-ranking') ||
    s.includes('painel=tv')
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedUser = sessionStorage.getItem('acertgo_session_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {}
    return CURRENT_USER_PROFILES[0];
  });
  const [currentTenantId, setCurrentTenantId] = useState<TenantId>('tenant_matriz_sp');
  const [currentTab, setCurrentTab] = useState<NavTabId>(() => {
    if (isTvRankingRouteUrl()) {
      return 'tv_ranking';
    }
    if (isSalesRouteUrl()) {
      return 'sales_landing_page';
    }
    return 'executive_dashboard';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Inicialização e controle rigoroso de cache do dispositivo
  useEffect(() => {
    initializeCacheControl();
  }, []);

  // Monitorar alterações na URL para roteamento de /tv-ranking, /vendas e histórico
  useEffect(() => {
    const handleUrlChange = () => {
      if (isTvRankingRouteUrl()) {
        setCurrentTab('tv_ranking');
      } else if (isSalesRouteUrl()) {
        setCurrentTab('sales_landing_page');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Autenticação Segura & Multiusuário (Liberar acesso somente após login; sem credenciais salvas em disco)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('logout=true')) {
        sessionStorage.removeItem('acertgo_session_authenticated');
        sessionStorage.removeItem('acertgo_session_user');
        return false;
      }
      return sessionStorage.getItem('acertgo_session_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Regras de Governança Parametrizadas da Imobiliária (Acesso ao Proprietário, Propostas e Mapas/Endereços)
  const [agencyGovernanceRules, setAgencyGovernanceRules] = useState<AgencyGovernanceRules>(getInitialAgencyGovernanceRules);

  useEffect(() => {
    const unsub = subscribeAgencyGovernanceRulesFromCloud((rules) => {
      setAgencyGovernanceRules(rules);
    });
    return () => unsub();
  }, []);

  const handleSaveGovernanceRules = (newRules: AgencyGovernanceRules) => {
    setAgencyGovernanceRules(newRules);
    saveAgencyGovernanceRulesToCloud(newRules);
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    purgeStoredCredentials();
    await purgeAllBrowserCaches();
    try {
      sessionStorage.removeItem('acertgo_session_authenticated');
      sessionStorage.removeItem('acertgo_session_user');
      if (auth) {
        await auth.signOut();
      }
    } catch (e) {
      console.error(e);
    }
    showNavToast('Sessão encerrada com segurança. Caches locais do dispositivo limpos.');
  };

  const handleLoginSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('acertgo_session_authenticated', 'true');
      sessionStorage.setItem('acertgo_session_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    await purgeAllBrowserCaches();
    purgeStoredCredentials();
  };

  // Sales Page & CMS State (Sincronizado na Nuvem)
  const [salesPageCmsData, setSalesPageCmsData] = useState<SalesPageCmsState>(getInitialSalesPageCms);

  useEffect(() => {
    const unsub = subscribeSalesPageCmsFromCloud((cloudCms) => {
      setSalesPageCmsData(cloudCms);
    });
    return () => unsub();
  }, []);

  const handleRegisterLeadFromSalesPage = (newLeadData: Omit<LeadRegistration, 'id' | 'createdAt' | 'status'>) => {
    const newLead: LeadRegistration = {
      ...newLeadData,
      id: `lead_reg_${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'NOVO'
    };
    setSalesPageCmsData(prev => ({
      ...prev,
      leads: [newLead, ...prev.leads]
    }));

    // Sincronizar lead público capturado diretamente no pipeline do CRM
    const newCrmLead: Lead = {
      id: `lead_lp_${Date.now()}`,
      name: newLeadData.fullName,
      phone: newLeadData.phone,
      email: newLeadData.email,
      source: 'SITE_OFICIAL',
      stage: 'PRIMEIRO_CONTATO',
      assignedBrokerId: currentUser.id,
      assignedBrokerName: currentUser.name,
      assignedBrokerAvatar: currentUser.avatar,
      interestType: 'COMPRA',
      propertyOfInterestTitle: `Plano SaaS ${newLeadData.planName || 'AcertGo'} (${newLeadData.agencyName || 'Imobiliária'})`,
      budgetMin: 399,
      budgetMax: 2890,
      tags: ['Lead LP Pública (/vendas)', 'Interesse SaaS'],
      unreadMessagesCount: 1,
      lastMessageText: `Lead registrado via Landing Page Pública: Cidade ${newLeadData.city || 'SP'} - Equipe: ${newLeadData.brokersCount}`,
      lastMessageTime: 'Agora',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl_lp_${Date.now()}`,
          leadId: `lead_lp_${Date.now()}`,
          type: 'STATUS_CHANGE',
          title: 'Cadastro via Landing Page de Vendas',
          description: `Novo lead capturado na URL pública /vendas. Empresa: ${newLeadData.agencyName || 'Nova Imobiliária'}`,
          authorName: 'Motor de Captação Pública',
          authorRole: 'SDR_ROBOT',
          timestamp: 'Agora'
        }
      ],
      rating: 5,
      followUps: []
    };
    setLeads(prev => [newCrmLead, ...prev]);
    saveSingleLeadToCloud(newCrmLead);
  };

  const handleImportLeads = (newLeads: Partial<Lead>[]) => {
    const formatted: Lead[] = newLeads.map((nl, idx) => ({
      id: nl.id || `lead_migrated_${Date.now()}_${idx}`,
      name: nl.name || 'Cliente Migrado',
      phone: nl.phone || '(11) 90000-0000',
      email: nl.email || 'contato@cliente.com.br',
      source: (nl.source as LeadSource) || 'SITE_OFICIAL',
      stage: nl.stage || 'PRIMEIRO_CONTATO',
      assignedBrokerId: currentUser.id,
      assignedBrokerName: nl.assignedBrokerName || currentUser.name,
      assignedBrokerAvatar: currentUser.avatar,
      interestType: nl.interestType || 'COMPRA',
      propertyOfInterestTitle: nl.propertyOfInterestTitle || 'Imóvel de Interesse',
      budgetMin: 0,
      budgetMax: nl.budgetMax || 1000000,
      tags: ['Migração de CRM', 'Importado'],
      unreadMessagesCount: 0,
      lastMessageText: (nl as any).notes || 'Lead importado via assistente de migração.',
      lastMessageTime: 'Hoje',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl_${Date.now()}_${idx}`,
          leadId: nl.id || `lead_migrated_${Date.now()}_${idx}`,
          type: 'STATUS_CHANGE',
          title: 'Lead Migrado de Outro CRM',
          description: (nl as any).notes || 'Registro importado pelo módulo de migração e backup.',
          authorName: currentUser.name,
          authorRole: currentUser.role,
          timestamp: 'Agora'
        }
      ],
      rating: 4,
      followUps: []
    }));
    setLeads(prev => [...formatted, ...prev]);
    saveLeadsToCloud(formatted);
  };

  // Three-Column Layout & System White-Label Branding State (Cloud Firestore + LocalStorage Sync)
  const [themeConfig, setThemeConfig] = useState<SystemThemeConfig>(getInitialThemeConfig);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFreeAiToolsModal, setShowFreeAiToolsModal] = useState(false);
  const [showTvControlModal, setShowTvControlModal] = useState(false);
  const [showSalesPageLinkModal, setShowSalesPageLinkModal] = useState(false);
  const [isRightRailOpen, setIsRightRailOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Escuta alterações de Tema/Logo em tempo real de qualquer dispositivo
  useEffect(() => {
    const unsub = subscribeThemeConfigFromCloud((cloudTheme) => {
      setThemeConfig(cloudTheme);
      setSystemConfig(prev => ({
        ...prev,
        platformName: cloudTheme.platformName,
        tagline: cloudTheme.tagline,
        logoUrl: cloudTheme.logoUrl || prev.logoUrl,
        primaryColor: cloudTheme.primaryColor,
        secondaryColor: cloudTheme.secondaryColor,
        accentColor: cloudTheme.accentColor
      }));
    });
    return () => unsub();
  }, []);

  // Apply CSS custom properties and dynamic document title
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', themeConfig.primaryColor);
    document.documentElement.style.setProperty('--brand-secondary', themeConfig.secondaryColor);
    document.documentElement.style.setProperty('--brand-accent', themeConfig.accentColor);
    if (themeConfig.platformName) {
      document.title = `${themeConfig.platformName} | CRM/ERP & Fintech Imobiliária`;
    }
    if (themeConfig.faviconUrl) {
      updateBrowserFavicon(themeConfig.faviconUrl);
    }
  }, [themeConfig]);

  const handleSaveTheme = async (newTheme: SystemThemeConfig) => {
    setThemeConfig(newTheme);
    try {
      await saveThemeConfigToCloud(newTheme);
    } catch (e) {
      console.warn('Falha ao persistir tema na nuvem:', e);
    }
    // Also synchronize SuperAdmin White-Label config
    setSystemConfig(prev => ({
      ...prev,
      platformName: newTheme.platformName,
      tagline: newTheme.tagline,
      logoUrl: newTheme.logoUrl || prev.logoUrl,
      primaryColor: newTheme.primaryColor,
      secondaryColor: newTheme.secondaryColor,
      accentColor: newTheme.accentColor
    }));
  };

  const handleApplyColorPreset = (preset: typeof SYSTEM_COLOR_PRESETS[0]) => {
    const updated: SystemThemeConfig = {
      ...themeConfig,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      sidebarTheme: preset.sidebarTheme
    };
    handleSaveTheme(updated);
  };

  // Environment State: PRODUCTION (clean/zerado) vs TEST (sandbox)
  const [systemEnvironment, setSystemEnvironment] = useState<'PRODUCTION' | 'TEST'>(() => {
    return (localStorage.getItem('sistema_ambiente') as 'PRODUCTION' | 'TEST') || 'PRODUCTION';
  });

  const isProductionInitial = systemEnvironment === 'PRODUCTION';

  // Application Domain State - Zerado em Produção
  const [leads, setLeads] = useState<Lead[]>(() => isProductionInitial ? [] : INITIAL_LEADS);
  const [queues, setQueues] = useState<RoletaQueue[]>(() => isProductionInitial ? [] : INITIAL_ROLETA_QUEUES);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => isProductionInitial ? {} : INITIAL_CHAT_MESSAGES);
  const [development, setDevelopment] = useState(() => isProductionInitial ? null : INITIAL_DEVELOPMENT);
  const [contracts, setContracts] = useState(() => isProductionInitial ? [] : INITIAL_RENTAL_CONTRACTS);
  const [commissions, setCommissions] = useState(() => isProductionInitial ? [] : INITIAL_COMMISSIONS);
  const [ccaProposals, setCcaProposals] = useState(() => isProductionInitial ? [] : INITIAL_CCA_PROPOSALS);

  // New Domains: Imóveis & Proprietários
  const [owners, setOwners] = useState<Owner[]>(() => isProductionInitial ? [] : INITIAL_OWNERS);
  const [properties, setProperties] = useState<RealEstateProperty[]>(() => isProductionInitial ? [] : INITIAL_PROPERTIES);
  const [showGlobalNewOwnerModal, setShowGlobalNewOwnerModal] = useState(false);

  // Sincronização em tempo real de Leads e Imóveis no Cloud Firestore
  useEffect(() => {
    const unsub = subscribeLeadsFromCloud((cloudLeads) => {
      if (cloudLeads && cloudLeads.length > 0) {
        setLeads(cloudLeads);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribePropertiesFromCloud((cloudProps) => {
      if (cloudProps && cloudProps.length > 0) {
        setProperties(cloudProps);
      }
    });
    return () => unsub();
  }, []);

  // Modals state
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [showAiStudioModal, setShowAiStudioModal] = useState(false);

  // Notification & Broadcast State (Persistência Resiliente)
  const [notifications, setNotifications] = useState<SystemNotification[]>(getInitialNotifications);
  const [broadcastBanners, setBroadcastBanners] = useState<PlatformBroadcastBanner[]>(INITIAL_BROADCAST_BANNERS);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sincronização em tempo real de notificações (respeitando exclusões)
  useEffect(() => {
    const unsub = subscribeNotificationsFromCloud((cloudNotifs) => {
      setNotifications(cloudNotifs);
    });
    return () => unsub();
  }, []);

  // Environment Switch Handler: Alternar entre Produção Zerada e Testes Demonstrativos
  const handleToggleSystemEnvironment = (env: 'PRODUCTION' | 'TEST') => {
    setSystemEnvironment(env);
    localStorage.setItem('sistema_ambiente', env);
    if (env === 'PRODUCTION') {
      setLeads([]);
      setProperties([]);
      setOwners([]);
      setContracts([]);
      setCommissions([]);
      setCcaProposals([]);
      setChatMessages({});
      setQueues([]);
      setDevelopment(null);
      handleSendNotification({
        title: 'Ambiente de Produção Ativo',
        message: 'O sistema agora está em modo Produção Oficial. Banco de dados zerado e pronto para dados reais.',
        category: 'PLATAFORMA_SISTEMA',
        priority: 'ALTA',
        channels: ['IN_APP'],
        targetAudience: 'TODOS_SISTEMA',
        senderName: 'Sistema',
        senderRole: 'SUPER_ADMIN',
        isRead: false
      });
    } else {
      setLeads(INITIAL_LEADS);
      setProperties(INITIAL_PROPERTIES);
      setOwners(INITIAL_OWNERS);
      setContracts(INITIAL_RENTAL_CONTRACTS);
      setCommissions(INITIAL_COMMISSIONS);
      setCcaProposals(INITIAL_CCA_PROPOSALS);
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setQueues(INITIAL_ROLETA_QUEUES);
      setDevelopment(INITIAL_DEVELOPMENT);
      handleSendNotification({
        title: 'Modo Testes / Sandbox Ativo',
        message: 'Massa de dados demonstrativos e leads de treino carregada com sucesso.',
        category: 'PLATAFORMA_SISTEMA',
        priority: 'MEDIA',
        channels: ['IN_APP'],
        targetAudience: 'TODOS_SISTEMA',
        senderName: 'Sistema',
        senderRole: 'SUPER_ADMIN',
        isRead: false
      });
    }
  };

  const handlePurgeProductionData = () => {
    setLeads([]);
    setProperties([]);
    setOwners([]);
    setContracts([]);
    setCommissions([]);
    setCcaProposals([]);
    setChatMessages({});
    setQueues([]);
    setDevelopment(null);
    handleSendNotification({
      title: 'Banco de Produção Zerado',
      message: 'Todos os registros foram excluídos e o ambiente restaurado ao estado limpo.',
      category: 'PLATAFORMA_SISTEMA',
      priority: 'ALTA',
      channels: ['IN_APP'],
      targetAudience: 'TODOS_SISTEMA',
      senderName: 'Sistema',
      senderRole: 'SUPER_ADMIN',
      isRead: false
    });
  };

  // Demo Presentation & Sandbox State
  const [demoScenarioId, setDemoScenarioId] = useState<'jardins_prime' | 'rede_alpha' | 'sky_horizon'>('jardins_prime');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isDemoBannerDismissed, setIsDemoBannerDismissed] = useState(false);

  // Notification Handlers (Com gravação em cache e nuvem para nunca voltarem após exclusão)
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n);
      saveNotificationsToCloud(updated);
      return updated;
    });
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }));
      saveNotificationsToCloud(updated);
      return updated;
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotificationsToCloud(updated, [id]);
      return updated;
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    clearAllNotificationsPermanently();
  };

  const handleSendNotification = (newNotif: Omit<SystemNotification, 'id' | 'createdAt'>) => {
    const notif: SystemNotification = {
      ...newNotif,
      id: `notif_${Date.now()}`,
      createdAt: 'Agora'
    };
    setNotifications(prev => {
      const updated = [notif, ...prev];
      saveNotificationsToCloud(updated);
      return updated;
    });
  };

  const handleSaveBroadcastBanner = (newBanner: PlatformBroadcastBanner) => {
    setBroadcastBanners(prev => [newBanner, ...prev.filter(b => b.id !== newBanner.id)]);
  };

  const handleToggleBannerStatus = (bannerId: string) => {
    setBroadcastBanners(prev => prev.map(b => b.id === bannerId ? { ...b, active: !b.active } : b));
  };

  const handleDismissBanner = (bannerId: string) => {
    setBroadcastBanners(prev => prev.map(b => b.id === bannerId ? { ...b, active: false } : b));
  };

  const handleTriggerSimulatedPush = (category: NotificationCategory) => {
    const pushSamples: Record<NotificationCategory, { title: string; message: string; priority: any; actionLabel: string; actionUrl: string }> = {
      LEAD_ROLETA: {
        title: 'Novo Lead de Alto Valor na Roleta (SLA 15m)!',
        message: 'Dr. Roberto Silveira solicitou visita para a Cobertura Jardins (R$ 12.500.000). Toque para abrir no WhatsApp.',
        priority: 'CRITICA',
        actionLabel: 'Chamar no WhatsApp',
        actionUrl: 'kanban'
      },
      FINANCEIRO_SPLIT: {
        title: 'Split de Comissão Pago via Pix!',
        message: 'Contrato VENDA-2026-88: Repasse de R$ 38.400,00 liquidado na conta corrente do corretor.',
        priority: 'ALTA',
        actionLabel: 'Ver Comprovante Pix',
        actionUrl: 'fintech_split'
      },
      STAND_GPS: {
        title: 'Check-in de Satélite Confirmado (4.2m)',
        message: 'Sua presença no Stand Jardins Sky foi validada com sucesso pelo GPS no raio de 10m. Posição no sorteio diário garantida!',
        priority: 'MEDIA',
        actionLabel: 'Ver Fila do Stand',
        actionUrl: 'roleta'
      },
      PLATAFORMA_SISTEMA: {
        title: 'Broadcast Super Admin: Nova Atualização AcertGo 3.5',
        message: 'Novo módulo de vistorias fotográficas e assinatura digital de contratos já está liberado para sua filial.',
        priority: 'ALTA',
        actionLabel: 'Conhecer Recursos',
        actionUrl: 'super_admin'
      },
      COMUNICADO_DIRETORIA: {
        title: 'Comunicado da Diretoria: Plantão Sábado às 08:30',
        message: 'Presença obrigatória no Stand Jardins One para sorteio das 08:30. Bônus especial no primeiro fechamento!',
        priority: 'ALTA',
        actionLabel: 'Ver Detalhes',
        actionUrl: 'roleta'
      },
      ACADEMY_TREINAMENTO: {
        title: 'Novo Treinamento Disponível na Universidade',
        message: 'Treinamento de Lançamento Jardins Sky liberado com simulado pedagógico e certificado oficial de especialista.',
        priority: 'MEDIA',
        actionLabel: 'Iniciar Treinamento',
        actionUrl: 'corporate_academy'
      },
      JURIDICO_CONTRATOS: {
        title: 'Minuta Contratual Aprovada pelo Jurídico',
        message: 'Contrato de locação Rua Bela Cintra liberado com Seguro Fiança CredPago sem necessidade de fiador.',
        priority: 'MEDIA',
        actionLabel: 'Ver Minuta',
        actionUrl: 'contracts'
      }
    };

    const sample = pushSamples[category] || pushSamples.LEAD_ROLETA;

    handleSendNotification({
      title: sample.title,
      message: sample.message,
      category,
      priority: sample.priority,
      channels: ['PUSH', 'IN_APP'],
      targetAudience: 'USUARIO_INDIVIDUAL',
      senderName: 'Simulador do Sistema',
      senderRole: 'SISTEMA',
      actionLabel: sample.actionLabel,
      actionUrl: sample.actionUrl,
      isRead: false
    });
  };

  const handleResetTestData = () => {
    setLeads(INITIAL_LEADS);
    setQueues(INITIAL_ROLETA_QUEUES);
    setContracts(INITIAL_RENTAL_CONTRACTS);
    setCommissions(INITIAL_COMMISSIONS);
    setCcaProposals(INITIAL_CCA_PROPOSALS);
    setProperties(INITIAL_PROPERTIES);
    setOwners(INITIAL_OWNERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBroadcastBanners(INITIAL_BROADCAST_BANNERS);
  };

  const handleInjectLiveEvent = (eventType: 'HOT_LEAD' | 'CREDIT_APPROVED' | 'DEAL_CLOSED' | 'STAND_GPS') => {
    if (eventType === 'HOT_LEAD') {
      const newLeadId = `lead_demo_${Date.now()}`;
      const newLead: Lead = {
        id: newLeadId,
        name: 'Dr. Roberto Silveira (UHNW)',
        phone: '(11) 99888-7711',
        email: 'roberto.silveira@silveirapartners.com.br',
        source: 'WHATSAPP_DIRETO',
        stage: 'PRIMEIRO_CONTATO',
        assignedBrokerId: 'usr_01',
        assignedBrokerName: currentUser.name,
        assignedBrokerAvatar: currentUser.avatar,
        interestType: 'COMPRA',
        propertyOfInterestTitle: 'Cobertura Penthouse Jardins Sky Lounge',
        budgetMin: 8500000,
        budgetMax: 14000000,
        tags: ['UHNW', 'Cobertura', 'Urgência', 'À Vista'],
        unreadMessagesCount: 1,
        lastMessageText: 'Olá! Gostaria de agendar uma visita reservada na cobertura duplex ainda esta semana.',
        lastMessageTime: 'Agora',
        createdAt: new Date().toISOString(),
        rating: 5,
        timeline: [
          {
            id: `tl_${Date.now()}`,
            leadId: newLeadId,
            type: 'WHATSAPP_MSG',
            title: 'Lead Recebido via Roleta 24/7',
            description: 'Lead qualificado com interesse em Penthouse nos Jardins.',
            authorName: 'Roleta Inteligente',
            authorRole: 'SISTEMA',
            timestamp: 'Agora'
          }
        ]
      };
      setLeads(prev => [newLead, ...prev]);
      handleTriggerSimulatedPush('LEAD_ROLETA');
    } else if (eventType === 'CREDIT_APPROVED') {
      handleTriggerSimulatedPush('FINANCEIRO_SPLIT');
    } else if (eventType === 'DEAL_CLOSED') {
      handleTriggerSimulatedPush('FINANCEIRO_SPLIT');
    } else if (eventType === 'STAND_GPS') {
      handleTriggerSimulatedPush('STAND_GPS');
    }
  };

  // Selected Lead Details & Follow-up Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetailsModal, setShowLeadDetailsModal] = useState(false);

  // Contract Emission Validation Alert Modal State (up to 4 proposers Name/CPF validation)
  const [contractValidationAlert, setContractValidationAlert] = useState<{
    isOpen: boolean;
    leadId: string;
    leadName: string;
    missingErrors: Array<{
      proposerName: string;
      role: string;
      issues: string[];
    }>;
    createdLead: Lead | null;
  } | null>(null);

  const handleOpenLead = (lead: Lead) => {
    const current = leads.find(l => l.id === lead.id) || lead;
    setSelectedLead(current);
    setShowLeadDetailsModal(true);
  };

  // --- Platform Navigation History & Safe In-Platform Trapping ---
  const [historyStack, setHistoryStack] = useState<NavigationStepEntry[]>([
    {
      id: 'step_init',
      tab: 'executive_dashboard',
      tabLabel: getTabLabel('executive_dashboard'),
      timestamp: Date.now()
    }
  ]);
  const [historyPointer, setHistoryPointer] = useState<number>(0);
  const [navToastMessage, setNavToastMessage] = useState<string | null>(null);
  const navToastTimerRef = useRef<any>(null);

  const showNavToast = useCallback((msg: string) => {
    if (navToastTimerRef.current) clearTimeout(navToastTimerRef.current);
    setNavToastMessage(msg);
    navToastTimerRef.current = setTimeout(() => {
      setNavToastMessage(null);
    }, 2400);
  }, []);

  const isAnyModalOpen = Boolean(
    showNewLeadModal ||
    contractValidationAlert?.isOpen ||
    showSchemaModal ||
    showAiStudioModal ||
    showGlobalNewOwnerModal ||
    showThemeModal ||
    isDemoModalOpen ||
    showLeadDetailsModal ||
    selectedLead ||
    isMobileMenuOpen
  );

  const closeAnyOpenModal = useCallback((): boolean => {
    let closed = false;
    if (contractValidationAlert?.isOpen) {
      setContractValidationAlert(null);
      closed = true;
    }
    if (showLeadDetailsModal || selectedLead) {
      setShowLeadDetailsModal(false);
      setSelectedLead(null);
      closed = true;
    }
    if (showNewLeadModal) {
      setShowNewLeadModal(false);
      closed = true;
    }
    if (showSchemaModal) {
      setShowSchemaModal(false);
      closed = true;
    }
    if (showAiStudioModal) {
      setShowAiStudioModal(false);
      closed = true;
    }
    if (showGlobalNewOwnerModal) {
      setShowGlobalNewOwnerModal(false);
      closed = true;
    }
    if (showThemeModal) {
      setShowThemeModal(false);
      closed = true;
    }
    if (isDemoModalOpen) {
      setIsDemoModalOpen(false);
      closed = true;
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      closed = true;
    }
    return closed;
  }, [
    showLeadDetailsModal,
    selectedLead,
    showNewLeadModal,
    showSchemaModal,
    showAiStudioModal,
    showGlobalNewOwnerModal,
    showThemeModal,
    isDemoModalOpen,
    isMobileMenuOpen
  ]);

  const handleNavigateTab = useCallback((tab: NavTabId, subStep?: string) => {
    closeAnyOpenModal();

    if (tab === currentTab && !subStep) return;

    const newStep: NavigationStepEntry = {
      id: `step_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tab,
      tabLabel: getTabLabel(tab),
      subStep,
      timestamp: Date.now()
    };

    setHistoryStack(prev => {
      const sliced = prev.slice(0, historyPointer + 1);
      const nextList = [...sliced, newStep];
      return nextList.slice(-50);
    });
    setHistoryPointer(prev => prev + 1);
    setCurrentTab(tab);

    try {
      window.history.pushState(
        { app: 'acertgo_crm', tab, step: historyPointer + 1 },
        '',
        window.location.pathname + '#' + tab
      );
    } catch {
      // browser history sandbox safe fallback
    }
  }, [closeAnyOpenModal, currentTab, historyPointer]);

  const handleGoBack = useCallback(() => {
    // 1. If any modal or drawer is open, close it first and stay on the current tab
    if (closeAnyOpenModal()) {
      showNavToast('Janela fechada — de volta ao módulo');
      return;
    }

    // 2. If on Sales Landing Page and no stack, return to dashboard
    if (currentTab === 'sales_landing_page' && historyPointer <= 0) {
      setCurrentTab('executive_dashboard');
      showNavToast('Voltando para: Dashboard Diretoria');
      return;
    }

    // 3. If there is a previous step in history stack
    if (historyPointer > 0) {
      const prevStep = historyStack[historyPointer - 1];
      setHistoryPointer(prev => prev - 1);
      setCurrentTab(prevStep.tab);
      showNavToast(`Voltando para: ${prevStep.tabLabel}`);
    } else {
      // Already on the initial root screen: DO NOT leave platform or site
      showNavToast('Você está na tela inicial da plataforma');
      // Re-push state so user won't exit if pressing browser back repeatedly
      try {
        window.history.pushState({ app: 'acertgo_crm', root: true }, '', window.location.pathname + '#' + currentTab);
      } catch {
        // ignore
      }
    }
  }, [closeAnyOpenModal, currentTab, historyPointer, historyStack, showNavToast]);

  const handleGoForward = useCallback(() => {
    if (historyPointer < historyStack.length - 1) {
      const nextStep = historyStack[historyPointer + 1];
      setHistoryPointer(prev => prev + 1);
      setCurrentTab(nextStep.tab);
      showNavToast(`Avançando para: ${nextStep.tabLabel}`);
    }
  }, [historyPointer, historyStack, showNavToast]);

  // Set up browser history barrier and popstate / shortcut interceptor
  useEffect(() => {
    try {
      // Push initial barrier state so back never leaves the platform or site
      window.history.replaceState({ app: 'acertgo_crm', root: true }, '', window.location.pathname + '#' + currentTab);
      window.history.pushState({ app: 'acertgo_crm', active: true }, '', window.location.pathname + '#' + currentTab);
    } catch {
      // ignore
    }

    const handlePopState = () => {
      // Do not hijack navigation or kick user back to dashboard if they are on the public sales landing page
      if (currentTab === 'sales_landing_page') {
        return;
      }
      // Route back internally without leaving the platform
      handleGoBack();
      // Always maintain the barrier so back button never exits the site
      try {
        window.history.pushState({ app: 'acertgo_crm', barrier: true }, '', window.location.pathname + '#' + currentTab);
      } catch {
        // ignore
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept Alt + ArrowLeft
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleGoBack();
        return;
      }
      // Intercept Alt + ArrowRight
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleGoForward();
        return;
      }
      // Intercept Escape key when modal is open
      if (e.key === 'Escape') {
        if (isAnyModalOpen) {
          e.preventDefault();
          closeAnyOpenModal();
        }
      }
      // Intercept Backspace when NOT typing in an input or editable field
      if (e.key === 'Backspace') {
        const target = e.target as HTMLElement | null;
        const isInput = target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          (target as any).type === 'text'
        );
        if (!isInput && (isAnyModalOpen || historyPointer > 0)) {
          e.preventDefault();
          handleGoBack();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleGoBack, handleGoForward, currentTab, isAnyModalOpen, historyPointer]);

  const handleAddFollowUp = (leadId: string, followUpData: Omit<ClientFollowUp, 'id' | 'createdAt'>) => {
    const newFollowUp: ClientFollowUp = {
      ...followUpData,
      id: `fu_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedFollowUps = [...(lead.followUps || []), newFollowUp];
        const updatedLead = { ...lead, followUps: updatedFollowUps };
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
      return lead;
    }));
  };

  const handleCompleteFollowUp = (
    leadId: string, 
    followUpId: string, 
    outcomeNotes: string, 
    nextFollowUp?: Omit<ClientFollowUp, 'id' | 'createdAt'>
  ) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        let updatedFollowUps = (lead.followUps || []).map(f => {
          if (f.id === followUpId) {
            return {
              ...f,
              status: 'CONCLUIDO' as const,
              completedAt: new Date().toISOString(),
              outcomeNotes: outcomeNotes
            };
          }
          return f;
        });

        if (nextFollowUp) {
          const nextItem: ClientFollowUp = {
            ...nextFollowUp,
            id: `fu_${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          updatedFollowUps = [...updatedFollowUps, nextItem];
        }

        const completedFollowUp = (lead.followUps || []).find(f => f.id === followUpId);
        const timelineItem = {
          id: `tl_${Date.now()}`,
          leadId,
          type: 'CALL' as const,
          title: `Follow-up Realizado: ${completedFollowUp?.title || 'Contato'}`,
          description: outcomeNotes,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          timestamp: 'Agora'
        };

        const updatedLead = { 
          ...lead, 
          followUps: updatedFollowUps,
          timeline: [timelineItem, ...(lead.timeline || [])]
        };

        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
      return lead;
    }));
  };

  const handleDeleteFollowUp = (leadId: string, followUpId: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedFollowUps = (lead.followUps || []).filter(f => f.id !== followUpId);
        const updatedLead = { ...lead, followUps: updatedFollowUps };
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
      return lead;
    }));
  };

  const handleRescheduleFollowUp = (leadId: string, followUpId: string, newDate: string, newTime?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedFollowUps = (lead.followUps || []).map(f => {
          if (f.id === followUpId) {
            const time = newTime || f.timeStr || '14:00';
            return {
              ...f,
              scheduledAt: `${newDate}T${time}:00`,
              timeStr: time,
              status: 'PENDENTE' as const
            };
          }
          return f;
        });
        const updatedLead = { ...lead, followUps: updatedFollowUps };
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
      return lead;
    }));
  };

  const handleAddTimelineNote = (leadId: string, note: { title: string; description: string; isPrivateWhisper?: boolean }) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const timelineItem = {
          id: `tl_${Date.now()}`,
          leadId,
          type: note.isPrivateWhisper ? ('WHISPER_NOTE' as const) : ('WHATSAPP_MSG' as const),
          title: note.title,
          description: note.description,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          timestamp: 'Agora',
          isPrivateWhisper: note.isPrivateWhisper
        };
        const updatedLead = {
          ...lead,
          timeline: [timelineItem, ...(lead.timeline || [])]
        };
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
      return lead;
    }));
  };

  // Super Admin Platform State (Persistência Resiliente)
  const [tenants, setTenants] = useState<TenantAgency[]>(getInitialTenants);
  const [saasPlans, setSaasPlans] = useState<SaaSPlan[]>(INITIAL_SAAS_PLANS);
  const [saasModules, setSaasModules] = useState<SaaSModule[]>(INITIAL_SAAS_MODULES);
  const [platformUsers, setPlatformUsers] = useState<PlatformUserAccount[]>(getInitialPlatformUsers);
  const [systemConfig, setSystemConfig] = useState<SystemWhiteLabelConfig>(getInitialSystemConfig);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Escuta alterações de White-Label em tempo real
  useEffect(() => {
    const unsub = subscribeSystemConfigFromCloud((cloudConfig) => {
      setSystemConfig(cloudConfig);
    });
    return () => unsub();
  }, []);

  // Super Admin CRUD Handlers
  const handleSaveTenant = async (tenantData: Partial<TenantAgency>) => {
    let updatedTenants: TenantAgency[];
    const isEdit = tenantData.id && tenants.some(t => t.id === tenantData.id);
    if (isEdit) {
      updatedTenants = tenants.map(t => t.id === tenantData.id ? { ...t, ...tenantData } as TenantAgency : t);
      const log: AuditLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'EDITOU_IMOBILIARIA',
        category: 'TENANT',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        tenantId: tenantData.id,
        tenantName: tenantData.tradeName || tenantData.name || 'Imobiliária',
        ipAddress: '177.136.240.12',
        severity: 'INFO',
        details: `Atualizou os dados/plano da imobiliária ${tenantData.tradeName || tenantData.name}.`
      };
      setAuditLogs(prev => [log, ...prev]);
    } else {
      const newTenant: TenantAgency = {
        id: `tenant_${Date.now()}` as TenantId,
        name: tenantData.name || 'Nova Imobiliária',
        tradeName: tenantData.tradeName || tenantData.name || 'Nova Imobiliária',
        cnpj: tenantData.cnpj || '00.000.000/0001-00',
        creciJ: tenantData.creciJ || '',
        ownerName: tenantData.ownerName || 'Administrador',
        ownerEmail: tenantData.ownerEmail || 'admin@imobiliaria.com.br',
        ownerPhone: tenantData.ownerPhone || '(11) 99999-9999',
        city: tenantData.city || 'São Paulo',
        state: tenantData.state || 'SP',
        planId: tenantData.planId || saasPlans[0]?.id || 'plan_pro',
        planName: tenantData.planName || saasPlans[0]?.name || 'Plano Pro Imob',
        billingCycle: tenantData.billingCycle || 'MENSAL',
        status: tenantData.status || 'ACTIVE',
        activeModules: tenantData.activeModules || ['crm', 'propostas', 'roleta'],
        subdomain: tenantData.subdomain || 'nova',
        logoUrl: tenantData.logoUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150',
        monthlyBilling: tenantData.monthlyBilling || 499,
        stats: tenantData.stats || { usersCount: 1, propertiesCount: 0, activeLeadsCount: 0, monthlyDealsVolume: 0 },
        createdAt: new Date().toISOString().split('T')[0],
        nextBillingDate: tenantData.nextBillingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: tenantData.paymentMethod || 'PIX'
      };
      updatedTenants = [newTenant, ...tenants];
      const log: AuditLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'CRIOU_IMOBILIARIA',
        category: 'TENANT',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        tenantId: newTenant.id,
        tenantName: newTenant.tradeName,
        ipAddress: '177.136.240.12',
        severity: 'INFO',
        details: `Provisionou nova instância da imobiliária ${newTenant.tradeName} no plano ${newTenant.planName}.`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
    setTenants(updatedTenants);
    await saveTenantsToCloud(updatedTenants);
  };

  const handleDeleteTenant = (tenantId: string) => {
    const target = tenants.find(t => t.id === tenantId);
    setTenants(prev => prev.filter(t => t.id !== tenantId));
    if (target) {
      const log: AuditLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'EXCLUIU_IMOBILIARIA',
        category: 'TENANT',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        tenantId: target.id,
        tenantName: target.tradeName,
        ipAddress: '177.136.240.12',
        severity: 'CRITICAL',
        details: `Excluiu definitivamente a instância da imobiliária ${target.tradeName}.`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const handleToggleTenantStatus = (tenantId: string, status: TenantStatus) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status } : t));
    const target = tenants.find(t => t.id === tenantId);
    if (target) {
      const log: AuditLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: status === 'SUSPENDED' ? 'SUSPENDEU_IMOBILIARIA' : 'REATIVOU_IMOBILIARIA',
        category: 'TENANT',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        tenantId: target.id,
        tenantName: target.tradeName,
        ipAddress: '177.136.240.12',
        severity: status === 'SUSPENDED' ? 'WARNING' : 'INFO',
        details: `Alterou o status da imobiliária ${target.tradeName} para ${status}.`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const handleSavePlan = (planData: Partial<SaaSPlan>) => {
    if (planData.id && saasPlans.some(p => p.id === planData.id)) {
      setSaasPlans(prev => prev.map(p => p.id === planData.id ? { ...p, ...planData } as SaaSPlan : p));
    } else {
      const newPlan: SaaSPlan = {
        id: `plan_${Date.now()}`,
        name: planData.name || 'Novo Plano',
        tier: planData.tier || 'PROFESSIONAL',
        monthlyPrice: planData.monthlyPrice || 990,
        annualPrice: planData.annualPrice || 9504,
        description: planData.description || '',
        maxUsers: planData.maxUsers ?? 10,
        maxProperties: planData.maxProperties ?? 500,
        maxLeadsPerMonth: planData.maxLeadsPerMonth ?? 2000,
        whatsappIncluded: !!planData.whatsappIncluded,
        includedModuleIds: planData.includedModuleIds || ['crm_roleta', 'kanban_funnel', 'imoveis_portais'],
        badge: planData.badge,
        status: 'ACTIVE',
        activeTenantsCount: 0
      };
      setSaasPlans(prev => [...prev, newPlan]);
    }

    const log: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SALVOU_PLANO',
      category: 'PLANO',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      ipAddress: '177.136.240.12',
      severity: 'INFO',
      details: `Salvou configurações do plano SaaS: ${planData.name}.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleDeletePlan = (planId: string) => {
    const target = saasPlans.find(p => p.id === planId);
    setSaasPlans(prev => prev.filter(p => p.id !== planId));
    if (target) {
      const log: AuditLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'EXCLUIU_PLANO',
        category: 'PLANO',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        ipAddress: '177.136.240.12',
        severity: 'WARNING',
        details: `Excluiu o plano comercial: ${target.name}.`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const handleSavePlatformUser = async (userData: Partial<PlatformUserAccount>) => {
    let updatedUsers: PlatformUserAccount[];
    if (userData.id && platformUsers.some(u => u.id === userData.id)) {
      updatedUsers = platformUsers.map(u => u.id === userData.id ? { ...u, ...userData } as PlatformUserAccount : u);
    } else {
      const newUser: PlatformUserAccount = {
        id: `usr_${Date.now()}`,
        name: userData.name || 'Novo Usuário',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'BROKER',
        tenantId: userData.tenantId || tenants[0]?.id || 'tenant_matriz_sp',
        tenantName: userData.tenantName || tenants[0]?.tradeName || 'AcertGo Matriz',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        creci: userData.creci,
        cpf: userData.cpf,
        rg: userData.rg,
        birthDate: userData.birthDate,
        admissionDate: userData.admissionDate,
        department: userData.department,
        address: userData.address,
        emergencyContact: userData.emergencyContact,
        status: userData.status || 'ATIVO',
        customPermissions: userData.customPermissions,
        lastLoginAt: 'Nunca acessou',
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedUsers = [newUser, ...platformUsers];
    }
    setPlatformUsers(updatedUsers);
    await savePlatformUsersToCloud(updatedUsers);

    if (userData.phone) {
      if (userData.email) {
        localStorage.setItem(`acertgo_user_phone_${userData.email.toLowerCase()}`, userData.phone);
      }
      if (currentUser?.email) {
        localStorage.setItem(`acertgo_user_phone_${currentUser.email.toLowerCase()}`, userData.phone);
      }
    }

    if (userData.id === currentUser.id) {
      const mergedUser = { ...currentUser, ...userData } as UserProfile;
      setCurrentUser(mergedUser);
      sessionStorage.setItem('acertgo_session_user', JSON.stringify(mergedUser));
    }

    const log: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SALVOU_USUARIO',
      category: 'USUARIO',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      ipAddress: '177.136.240.12',
      severity: 'INFO',
      details: `Cadastrou/atualizou o usuário ${userData.name} no cargo ${userData.role}.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleDeletePlatformUser = async (userId: string) => {
    const target = platformUsers.find(u => u.id === userId);
    const updatedUsers = platformUsers.filter(u => u.id !== userId);
    setPlatformUsers(updatedUsers);
    await savePlatformUsersToCloud(updatedUsers);
    if (target) {
      const log: AuditLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'EXCLUIU_USUARIO',
        category: 'USUARIO',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        ipAddress: '177.136.240.12',
        severity: 'WARNING',
        details: `Excluiu a conta do usuário ${target.name} (${target.email}).`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const handleSaveSystemConfig = async (newConfig: SystemWhiteLabelConfig) => {
    setSystemConfig(newConfig);
    await saveSystemConfigToCloud(newConfig);

    const updatedTheme: SystemThemeConfig = {
      ...themeConfig,
      platformName: newConfig.platformName,
      logoUrl: newConfig.logoUrl || themeConfig.logoUrl,
      faviconUrl: newConfig.faviconUrl || themeConfig.faviconUrl,
      primaryColor: newConfig.primaryColor,
      secondaryColor: newConfig.secondaryColor
    };
    setThemeConfig(updatedTheme);
    await saveThemeConfigToCloud(updatedTheme);

    if (newConfig.faviconUrl) {
      updateBrowserFavicon(newConfig.faviconUrl);
    }
    const log: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'ALTEROU_CONFIG_SISTEMA',
      category: 'CONFIGURACAO',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      ipAddress: '177.136.240.12',
      severity: 'CRITICAL',
      details: `Atualizou as configurações globais de White-label, logotipo, favicon e gateway de faturamento da plataforma.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleUpdateSalesPageCmsData = async (updated: SalesPageCmsState) => {
    setSalesPageCmsData(updated);
    await saveSalesPageCmsToCloud(updated);
  };

  const handleImpersonateTenant = (tenantId: string) => {
    const target = tenants.find(t => t.id === tenantId);
    if (target) {
      setCurrentTenantId(target.id as TenantId);
      handleNavigateTab('kanban');
      const log: AuditLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'SIMULACAO_TENANT',
        category: 'SEGURANCA',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        tenantId: target.id,
        tenantName: target.tradeName,
        ipAddress: '177.136.240.12',
        severity: 'WARNING',
        details: `Super Admin acessou em modo de simulação a imobiliária ${target.tradeName}.`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  // Property handlers
  const handleSaveProperty = (propData: Partial<RealEstateProperty>) => {
    if (propData.id && properties.some(p => p.id === propData.id)) {
      const existing = properties.find(p => p.id === propData.id);
      if (existing) {
        const updated = { ...existing, ...propData } as RealEstateProperty;
        setProperties(prev => prev.map(p => p.id === propData.id ? updated : p));
        saveSinglePropertyToCloud(updated);
      }
    } else {
      const newProp: RealEstateProperty = {
        id: `prop_${Date.now()}`,
        code: propData.code || `IMO-${Math.floor(1000 + Math.random() * 9000)}`,
        title: propData.title || 'Novo Imóvel',
        description: propData.description || '',
        propertyType: propData.propertyType || 'APARTAMENTO',
        transactionType: propData.transactionType || 'VENDA',
        status: propData.status || 'DISPONIVEL',
        featured: !!propData.featured,
        ownerId: propData.ownerId || owners[0]?.id || 'own_01',
        ownerName: propData.ownerName || owners[0]?.name || 'Proprietário',
        ownerDocument: propData.ownerDocument || owners[0]?.document || '',
        ownerPhone: propData.ownerPhone || owners[0]?.phone || '',
        pricing: propData.pricing || { salePrice: 1000000 },
        specs: propData.specs || {
          totalAreaM2: 120,
          usableAreaM2: 100,
          bedrooms: 3,
          suites: 1,
          bathrooms: 2,
          parkingSpaces: 2,
          sunOrientation: 'MANHA',
          furnishing: 'SEMIMOBILIADO'
        },
        address: propData.address || {
          cep: '01426-001',
          street: 'Rua Bela Cintra',
          number: '100',
          neighborhood: 'Jardins',
          city: 'São Paulo',
          state: 'SP',
          zone: 'SUL',
          displayAddressOnWeb: true
        },
        features: propData.features || ['Piscina Privativa', 'Varanda Gourmet'],
        images: propData.images || [
          {
            id: `img_${Date.now()}`,
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
            isCover: true,
            caption: 'Foto Principal'
          }
        ],
        keysLocation: propData.keysLocation || 'Claviculário Matriz',
        createdAt: new Date().toISOString()
      };
      setProperties([newProp, ...properties]);
      saveSinglePropertyToCloud(newProp);

      // Update owner's property count
      setOwners(prev => prev.map(o => o.id === newProp.ownerId ? { ...o, propertiesCount: o.propertiesCount + 1 } : o));
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    const propToRemove = properties.find(p => p.id === propertyId);
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    deletePropertyFromCloud(propertyId);
    if (propToRemove) {
      setOwners(prev => prev.map(o => o.id === propToRemove.ownerId ? { ...o, propertiesCount: Math.max(0, o.propertiesCount - 1) } : o));
    }
  };

  const handleSaveProposal = (proposal: PropertyProposal, newLeadData?: { name: string; phone: string; email: string }) => {
    let targetLeadId = proposal.leadId;
    const formattedPrice = Number(proposal.proposedPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (newLeadData && (!targetLeadId || !leads.some(l => l.id === targetLeadId))) {
      targetLeadId = `lead_${Date.now()}`;
      const newLead: Lead = {
        id: targetLeadId,
        name: newLeadData.name,
        phone: newLeadData.phone,
        email: newLeadData.email,
        source: 'SITE_OFICIAL',
        stage: 'PROPOSTA_ENVIADA',
        assignedBrokerId: currentUser.id,
        assignedBrokerName: currentUser.name,
        interestType: 'COMPRA',
        propertyOfInterestTitle: proposal.propertyTitle,
        budgetMin: Math.round(proposal.proposedPrice * 0.8),
        budgetMax: proposal.proposedPrice,
        tags: ['Proposta Formal Aberta', 'Quente'],
        unreadMessagesCount: 0,
        lastMessageText: `Proposta formal de ${formattedPrice} enviada para o imóvel ${proposal.propertyCode}.`,
        lastMessageTime: 'Agora',
        createdAt: new Date().toISOString(),
        timeline: [
          {
            id: `tl_${Date.now()}`,
            leadId: targetLeadId,
            type: 'STATUS_CHANGE',
            title: `Proposta Formal Aberta no Imóvel ${proposal.propertyCode}`,
            description: `Valor proposto: ${formattedPrice} (${proposal.paymentMethod.replace('_', ' ')}). Entrada: ${proposal.downPayment ? Number(proposal.downPayment).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A combinar'}. Validade: ${proposal.validityDate || '5 dias'}.`,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            timestamp: 'Agora'
          }
        ],
        rating: 5
      };
      setLeads(prev => [newLead, ...prev]);
    } else if (targetLeadId) {
      setLeads(prev => prev.map(l => {
        if (l.id === targetLeadId) {
          return {
            ...l,
            stage: 'PROPOSTA_ENVIADA' as const,
            timeline: [
              {
                id: `tl_${Date.now()}`,
                leadId: l.id,
                type: 'STATUS_CHANGE' as const,
                title: `Nova Proposta Formal no Imóvel ${proposal.propertyCode}`,
                description: `Valor proposto: ${formattedPrice} (${proposal.paymentMethod.replace('_', ' ')}). Validade: ${proposal.validityDate || '5 dias'}. Condições: ${proposal.conditions || 'Padrão'}.`,
                authorName: currentUser.name,
                authorRole: currentUser.role,
                timestamp: 'Agora'
              },
              ...(l.timeline || [])
            ]
          };
        }
        return l;
      }));
    }
  };

  // Owner handlers
  const handleSaveOwner = (ownerData: Partial<Owner>) => {
    if (ownerData.id && owners.some(o => o.id === ownerData.id)) {
      setOwners(prev => prev.map(o => o.id === ownerData.id ? { ...o, ...ownerData } as Owner : o));
      // Update owner name on properties if changed
      if (ownerData.name || ownerData.phone || ownerData.document) {
        setProperties(prev => prev.map(p => p.ownerId === ownerData.id ? {
          ...p,
          ownerName: ownerData.name || p.ownerName,
          ownerPhone: ownerData.phone || p.ownerPhone,
          ownerDocument: ownerData.document || p.ownerDocument,
        } : p));
      }
    } else {
      const newOwner: Owner = {
        id: `own_${Date.now()}`,
        personType: ownerData.personType || 'PF',
        name: ownerData.name || 'Novo Proprietário',
        tradeName: ownerData.tradeName,
        document: ownerData.document || '000.000.000-00',
        rg: ownerData.rg,
        stateRegistration: ownerData.stateRegistration,
        maritalStatus: ownerData.maritalStatus || 'SOLTEIRO',
        profession: ownerData.profession,
        spouseName: ownerData.spouseName,
        spouseCpf: ownerData.spouseCpf,
        propertyRegime: ownerData.propertyRegime,
        legalRepresentative: ownerData.legalRepresentative,
        email: ownerData.email || '',
        secondaryEmail: ownerData.secondaryEmail,
        phone: ownerData.phone || '(11) 90000-0000',
        secondaryPhone: ownerData.secondaryPhone,
        address: ownerData.address || {
          cep: '01426-001',
          street: 'Rua Bela Cintra',
          number: '100',
          neighborhood: 'Jardins',
          city: 'São Paulo',
          state: 'SP'
        },
        bankDetails: ownerData.bankDetails || {
          bankCode: '341',
          bankName: 'Itaú Unibanco',
          accountType: 'CORRENTE',
          agency: '0842',
          accountNumber: '10000',
          accountDigit: '1',
          pixKeyType: 'CPF',
          pixKey: ownerData.document || '',
          accountHolderName: ownerData.name || '',
          accountHolderDocument: ownerData.document || ''
        },
        status: ownerData.status || 'ATIVO',
        notes: ownerData.notes,
        propertiesCount: 0,
        createdAt: new Date().toISOString()
      };
      setOwners([newOwner, ...owners]);
    }
  };

  const handleDeleteOwner = (ownerId: string) => {
    setOwners(prev => prev.filter(o => o.id !== ownerId));
  };

  // Lead Lifecycle Actions
  const handleCreateLead = (leadData: Partial<Lead>) => {
    const newId = `lead_${Date.now()}`;

    // --- Verificação Lógica de Proponentes para Emissão de Contrato ---
    // Valida se os até 4 proponentes possuem Nome completo (nome e sobrenome) e CPF válido (11 dígitos)
    const rawProposers = leadData.proposers || [];
    const proposersToCheck = rawProposers.length > 0 
      ? rawProposers.slice(0, 4)
      : [
          {
            id: `prop_titular_${Date.now()}`,
            name: leadData.name || '',
            relationship: 'TITULAR' as const,
            cpf: leadData.cpf || '',
            rg: leadData.rg,
            phone: leadData.phone,
            email: leadData.email
          }
        ];

    const missingErrors: Array<{
      proposerName: string;
      role: string;
      issues: string[];
    }> = [];

    proposersToCheck.forEach((p, idx) => {
      const roleLabel = 
        p.relationship === 'TITULAR' ? 'Titular' :
        p.relationship === 'CONJUGE' ? 'Cônjuge' :
        p.relationship === 'SEGUNDO_COMPRADOR' ? '2º Comprador' :
        p.relationship === 'AVALISTA_FIADOR' ? 'Avalista/Fiador' :
        p.relationship === 'SOCIO' ? 'Sócio' : 'Outro Proponente';

      const nameTrimmed = (p.name || '').trim();
      const nameParts = nameTrimmed.split(/\s+/).filter(Boolean);
      const isNameComplete = nameParts.length >= 2 && nameTrimmed.length >= 3;

      const cleanCpf = (p.cpf || '').replace(/\D/g, '');
      const isCpfValid = cleanCpf.length === 11;

      const issues: string[] = [];
      if (!isNameComplete) {
        issues.push('Nome incompleto (informe Nome e Sobrenome completos)');
      }
      if (!isCpfValid) {
        issues.push(cleanCpf.length === 0 ? 'CPF ausente' : `CPF incompleto (${cleanCpf.length}/11 dígitos)`);
      }

      if (issues.length > 0) {
        missingErrors.push({
          proposerName: nameTrimmed || `Proponente #${idx + 1}`,
          role: roleLabel,
          issues
        });
      }
    });

    const canEmitContract = missingErrors.length === 0;
    const contractBlockReasons = missingErrors.flatMap(m => 
      m.issues.map(iss => `${m.role} (${m.proposerName}): ${iss}`)
    );

    const initialTimeline: LeadInteraction[] = [
      {
        id: `tl_${Date.now()}`,
        leadId: newId,
        type: 'STATUS_CHANGE',
        title: 'Lead Criado no Sistema',
        description: `Canal de origem: ${leadData.source || 'Portal'}. Corretor: ${leadData.assignedBrokerName || 'Juliana Mendes'}.`,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        timestamp: 'Agora'
      }
    ];

    if (!canEmitContract) {
      initialTimeline.push({
        id: `tl_contract_pending_${Date.now()}`,
        leadId: newId,
        type: 'STATUS_CHANGE',
        title: 'Pendência: Emissão de Contrato Bloqueada',
        description: `A emissão formal de contrato está bloqueada. Pendências: ${contractBlockReasons.join('; ')}.`,
        authorName: 'Compliance & Validação Contratual',
        authorRole: 'Sistema',
        timestamp: 'Agora'
      });
    } else {
      initialTimeline.push({
        id: `tl_contract_valid_${Date.now()}`,
        leadId: newId,
        type: 'STATUS_CHANGE',
        title: 'Validação Concluída: Apto para Emissão de Contrato',
        description: `✓ Todos os proponentes (até 4) validados com Nome completo e CPF regularizados para minuta e assinatura eletrônica.`,
        authorName: 'Compliance & Validação Contratual',
        authorRole: 'Sistema',
        timestamp: 'Agora'
      });
    }

    const newLead: Lead = {
      id: newId,
      name: leadData.name || 'Novo Lead',
      phone: leadData.phone || '(11) 90000-0000',
      email: leadData.email || '',
      source: leadData.source || 'PORTAL_ZAP',
      stage: 'NOVO_LEAD',
      assignedBrokerId: leadData.assignedBrokerId || 'usr_corretor_juliana',
      assignedBrokerName: leadData.assignedBrokerName || 'Juliana Mendes',
      interestType: leadData.interestType || 'COMPRA',
      propertyOfInterestTitle: leadData.propertyOfInterestTitle || 'Apartamento nos Jardins',
      budgetMin: leadData.budgetMin || 1000000,
      budgetMax: leadData.budgetMax || 2000000,
      tags: leadData.tags || ['Inbound Recente'],
      unreadMessagesCount: 1,
      lastMessageText: 'Lead ingressou no sistema e aguarda primeiro atendimento na Roleta.',
      lastMessageTime: 'Agora',
      createdAt: new Date().toISOString(),
      rating: 4,
      cpf: leadData.cpf,
      rg: leadData.rg,
      maritalStatus: leadData.maritalStatus,
      birthDate: leadData.birthDate,
      sdrQualified: leadData.sdrQualified,
      sendBirthdayWishes: leadData.sendBirthdayWishes,
      proposers: rawProposers,
      brokerLockedUntil: leadData.brokerLockedUntil,
      brokerLockPeriodDays: leadData.brokerLockPeriodDays,
      canEmitContract,
      contractBlockReasons: canEmitContract ? undefined : contractBlockReasons,
      timeline: initialTimeline
    };

    setLeads([newLead, ...leads]);

    // Exibe alerta amigável caso haja proponentes com pendências de Nome ou CPF
    if (!canEmitContract) {
      setContractValidationAlert({
        isOpen: true,
        leadId: newId,
        leadName: leadData.name || 'Novo Lead',
        missingErrors,
        createdLead: newLead
      });
    }
  };

  const handleDistributeLeadFromRoleta = (queueId: string, leadId: string, brokerName: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          stage: 'PRIMEIRO_CONTATO',
          assignedBrokerName: brokerName,
          timeline: [
            {
              id: `tl_${Date.now()}`,
              leadId: l.id,
              type: 'STATUS_CHANGE',
              title: 'Atribuído na Roleta de Atendimento',
              description: `Lead sorteado e encaminhado com sucesso para o corretor ${brokerName}.`,
              authorName: 'Roleta Inteligente',
              authorRole: 'Sistema',
              timestamp: 'Agora'
            },
            ...l.timeline
          ]
        };
      }
      return l;
    }));
  };

  const handleChangeLeadStage = (leadId: string, newStage: LeadFunnelStage, lossReason?: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updatedLead = {
          ...l,
          stage: newStage,
          lossReason: lossReason || l.lossReason,
          timeline: [
            {
              id: `tl_${Date.now()}`,
              leadId: l.id,
              type: 'STATUS_CHANGE' as const,
              title: `Fase do Funil Alterada para ${newStage.replace('_', ' ')}`,
              description: lossReason ? `Motivo de Perda: ${lossReason}` : `Avançado por ${currentUser.name}.`,
              authorName: currentUser.name,
              authorRole: currentUser.role,
              timestamp: 'Agora'
            },
            ...l.timeline
          ]
        };
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
      return l;
    }));
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const handleLinkPropertyToLead = (leadId: string, property: RealEstateProperty) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          propertyOfInterestId: property.id,
          propertyOfInterestTitle: property.title,
          timeline: [
            {
              id: `int_${Date.now()}`,
              leadId,
              type: 'STATUS_CHANGE',
              title: 'Imóvel Vinculado via Radar',
              description: `Imóvel "${property.title}" (${property.code}) vinculado com sucesso ao perfil deste cliente via Radar.`,
              authorName: currentUser.name,
              authorRole: currentUser.role,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            },
            ...l.timeline
          ]
        };
      }
      return l;
    }));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? {
        ...prev,
        propertyOfInterestId: property.id,
        propertyOfInterestTitle: property.title,
      } : null);
    }
  };

  const handleSendMessage = (leadId: string, text: string, isWhisper: boolean) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      leadId,
      sender: isWhisper ? 'MANAGER' : currentUser.role === 'BROKER' ? 'BROKER' : 'MANAGER',
      senderName: isWhisper ? `${currentUser.name} (Modo Fantasma)` : currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT',
      type: isWhisper ? 'WHISPER' : 'TEXT',
      isWhisperNote: isWhisper,
    };

    setChatMessages(prev => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), newMsg]
    }));
  };

  const handleLockUnit = (unitId: string, clientName: string) => {
    setDevelopment(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        availableUnits: Math.max(0, prev.availableUnits - 1),
        reservedUnits: prev.reservedUnits + 1,
        units: prev.units.map(u => {
          if (u.id === unitId) {
            return {
              ...u,
              status: 'RESERVADO',
              reservedByBrokerName: currentUser.name,
              reservedClientName: clientName,
              reservationExpiresAt: '23h 59m restantes',
            };
          }
          return u;
        })
      };
    });
  };

  const handleUpdateCcaStage = (proposalId: string, newStage: CCABankStage) => {
    setCcaProposals(prev => prev.map(p => p.id === proposalId ? { ...p, stage: newStage } : p));
  };

  // 0. Rota Pública e Painel de Apresentação TV Salão de Vendas (/tv, /tv-ranking, ?view=tv-ranking)
  if (currentTab === 'tv_ranking' || isTvRankingRouteUrl()) {
    const isUserAdmin = isAuthenticated && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MASTER_ADMIN' || currentUser.role === 'MANAGER');
    return (
      <TvRankingPresentationView
        standalone={true}
        isAdmin={isUserAdmin}
        onExitPresentation={() => {
          setCurrentTab(isAuthenticated ? 'gamification' : 'executive_dashboard');
          try {
            window.history.pushState({ app: 'acertgo_crm' }, '', '/');
          } catch {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  // 1. Rota Pública da Página de Vendas (/vendas, /lp, #/vendas) acessível a todos
  if (currentTab === 'sales_landing_page') {
    return (
      <div className="relative min-h-screen bg-slate-950">
        {/* Floating Back to Internal Platform Button (visível apenas para usuários autenticados) */}
        {isAuthenticated && (
          <button
            onClick={handleGoBack}
            className="fixed bottom-6 left-6 z-50 px-4 py-2.5 bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700/80 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            title="Voltar para a plataforma interna (permanece no sistema)"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Voltar à Plataforma</span>
            {historyPointer > 0 && (
              <span className="text-slate-400 font-normal">
                ({historyStack[historyPointer - 1]?.tabLabel})
              </span>
            )}
          </button>
        )}

        {/* Visual feedback toast */}
        {navToastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
            <div className="bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-slate-700/80 flex items-center gap-2 text-xs font-medium">
              <ArrowLeft className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{navToastMessage}</span>
            </div>
          </div>
        )}

        <SalesLandingPageView
          cmsData={salesPageCmsData}
          onRegisterLead={handleRegisterLeadFromSalesPage}
          onBackToApp={handleGoBack}
          onOpenSuperAdminCms={() => handleNavigateTab('super_admin')}
          isSuperAdmin={currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MASTER_ADMIN' || currentUser.role === 'MANAGER'}
          logoUrl={themeConfig.logoUrl || systemConfig.logoUrl}
          platformName={themeConfig.platformName || systemConfig.platformName}
          onGoToLogin={() => {
            if (typeof window !== 'undefined' && isSalesApexDomain() && !isCrmSubdomain()) {
              navigateToCrm(() => {
                setCurrentTab('executive_dashboard');
              });
              return;
            }
            setCurrentTab('executive_dashboard');
            try {
              window.history.pushState({ app: 'acertgo_crm', login: true }, '', '/');
            } catch {
              window.location.hash = '';
            }
          }}
          isAuthenticated={isAuthenticated}
        />
      </div>
    );
  }

  // 2. Guardião de Autenticação Segura (Liberar acesso interno somente após login; sem credenciais salvas em disco)
  if (!isAuthenticated) {
    return (
      <LoginAuthView
        onLoginSuccess={handleLoginSuccess}
        agencyName={themeConfig.agencyName || themeConfig.platformName}
        logoUrl={themeConfig.loginLogoUrl || themeConfig.logoUrl}
        onOpenSalesPage={() => {
          if (typeof window !== 'undefined' && isCrmSubdomain()) {
            navigateToSales(() => {
              setCurrentTab('sales_landing_page');
            });
            return;
          }
          setCurrentTab('sales_landing_page');
          try {
            window.history.pushState({ app: 'acertgo_crm', tab: 'sales_landing_page' }, '', '/vendas');
          } catch {
            window.location.hash = '#/vendas';
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 relative">
      {/* Visual Navigation Feedback Pill */}
      {navToastMessage && (
        <div className="fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
          <div className="bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-slate-700/80 flex items-center gap-2 text-xs sm:text-sm font-medium">
            <ArrowLeft className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{navToastMessage}</span>
          </div>
        </div>
      )}

      {/* Platform & Agency Broadcast Announcements Banner */}
      <GlobalAnnouncementBanner
        banners={broadcastBanners}
        onActionClick={(tabId) => {
          if (tabId) handleNavigateTab(tabId as NavTabId);
        }}
        onDismiss={handleDismissBanner}
      />

      {/* Top Navigation Header (Limpo: sem botões ou atalhos de ambiente no topo) */}
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        onOpenNewLead={() => setShowNewLeadModal(true)}
        onOpenSchemaModal={() => setShowSchemaModal(true)}
        onOpenAiStudio={() => setShowAiStudioModal(true)}
        onOpenSuperAdmin={() => handleNavigateTab('super_admin')}
        onOpenGovernanceRules={() => handleNavigateTab('agency_governance')}
        onLogout={handleLogout}
        onSelectTenant={setCurrentTenantId}
        selectedTenantId={currentTenantId}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        themeConfig={themeConfig}
        onOpenThemeModal={() => setShowThemeModal(true)}
        onOpenFreeAiTools={() => setShowFreeAiToolsModal(true)}
        onOpenTvRanking={() => handleNavigateTab('tv_ranking')}
        onOpenTvControlModal={() => setShowTvControlModal(true)}
        isRightRailOpen={isRightRailOpen}
        onToggleRightRail={() => setIsRightRailOpen(prev => !prev)}
        availableTenants={tenants.map(t => ({
          id: t.id as TenantId,
          name: t.tradeName,
          city: `${t.city} - ${t.state}`
        }))}
        notifications={notifications}
        onOpenNotificationsCenter={() => handleNavigateTab('notifications_center')}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAllNotifications={handleClearAllNotifications}
        onTriggerSimulatedPush={handleTriggerSimulatedPush}
        onGoBack={handleGoBack}
        canGoBack={isAnyModalOpen || historyPointer > 0}
        previousStepLabel={
          isAnyModalOpen
            ? 'Fechar Janela'
            : historyPointer > 0
            ? historyStack[historyPointer - 1]?.tabLabel
            : undefined
        }
        onGoForward={handleGoForward}
        canGoForward={historyPointer < historyStack.length - 1}
        nextStepLabel={
          historyPointer < historyStack.length - 1
            ? historyStack[historyPointer + 1]?.tabLabel
            : undefined
        }
        currentStepLabel={getTabLabel(currentTab)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Column 1: Main Operational Navigation Sidebar (Collapsible) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleNavigateTab}
          userRole={currentUser.role}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          themeConfig={themeConfig}
          onOpenThemeModal={() => setShowThemeModal(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
          systemEnvironment={systemEnvironment}
          onToggleSystemEnvironment={handleToggleSystemEnvironment}
        />

        {/* Column 2: Dynamic Center Workspace Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 bg-slate-100/90 pb-20 lg:pb-0">
          {currentTab === 'notifications_center' && (
            <NotificationCenterView
              notifications={notifications}
              banners={broadcastBanners}
              userRole={currentUser.role}
              currentTenantId={currentTenantId}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onDeleteNotification={handleDeleteNotification}
              onClearAllNotifications={handleClearAllNotifications}
              onSendNotification={handleSendNotification}
              onSaveBanner={handleSaveBroadcastBanner}
              onToggleBannerStatus={handleToggleBannerStatus}
              onTriggerSimulatedPush={handleTriggerSimulatedPush}
              onNavigateTab={(tab) => handleNavigateTab(tab as NavTabId)}
            />
          )}

          {currentTab === 'executive_dashboard' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <ExecutiveDirectorDashboardView
                currentUser={currentUser}
                properties={properties}
                leads={leads}
                commissions={commissions}
                contracts={contracts}
                onNavigateToTab={(tabId) => handleNavigateTab(tabId as NavTabId)}
                onSimulateRole={(role) => {
                  const found = CURRENT_USER_PROFILES.find(u => u.role === role);
                  if (found) setCurrentUser(found);
                }}
              />
            </div>
          )}

          {currentTab === 'super_admin' && (
            <SuperAdminView
              tenants={tenants}
              plans={saasPlans}
              modules={saasModules}
              users={platformUsers}
              config={systemConfig}
              auditLogs={auditLogs}
              onSaveTenant={handleSaveTenant}
              onDeleteTenant={handleDeleteTenant}
              onToggleTenantStatus={handleToggleTenantStatus}
              onSavePlan={handleSavePlan}
              onDeletePlan={handleDeletePlan}
              onSaveUser={handleSavePlatformUser}
              onDeleteUser={handleDeletePlatformUser}
              onSaveConfig={handleSaveSystemConfig}
              onImpersonateTenant={handleImpersonateTenant}
              hierarchies={PLATFORM_HIERARCHIES}
              permissions={PERMISSION_DEFINITIONS}
              salesPageCmsData={salesPageCmsData}
              onUpdateSalesPageCmsData={handleUpdateSalesPageCmsData}
              onOpenLiveSalesPage={() => handleNavigateTab('sales_landing_page')}
              systemEnvironment={systemEnvironment}
              onToggleSystemEnvironment={handleToggleSystemEnvironment}
              onPurgeProductionData={handlePurgeProductionData}
              onResetTestData={handleResetTestData}
              onInjectTestLead={() => handleInjectLiveEvent('HOT_LEAD')}
            />
          )}

          {currentTab === 'roleta' && (
            <RodizioAtendimentoView
              queues={queues}
              leads={leads}
              currentUser={currentUser}
              onUpdateQueues={setQueues}
              onDistributeLead={handleDistributeLeadFromRoleta}
            />
          )}

          {currentTab === 'whatsapp_desk' && (
            <WhaticketDesk
              leads={leads}
              chatMessages={chatMessages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onChangeStage={handleChangeLeadStage}
            />
          )}

          {currentTab === 'kanban' && (
            <KanbanBoard
              leads={leads}
              properties={properties}
              onChangeStage={handleChangeLeadStage}
              onOpenLead={handleOpenLead}
              onSelectPropertyForLead={handleLinkPropertyToLead}
            />
          )}

          {currentTab === 'leads_list' && (
            <LeadsListView
              leads={leads}
              properties={properties}
              onOpenNewLead={() => setShowNewLeadModal(true)}
              onSelectLeadDetails={handleOpenLead}
              onDeleteLead={handleDeleteLead}
              onSelectPropertyForLead={handleLinkPropertyToLead}
              onUpdateLead={(leadId, updates) => {
                setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
                setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, ...updates } : prev);
              }}
              onOpenWhatsAppDesk={(lead) => {
                handleNavigateTab('whatsapp_desk');
              }}
            />
          )}

          {currentTab === 'indique_ganhe' && (
            <IndiqueGanheView />
          )}

          {currentTab === 'customer_portal' && (
            <CustomerPortalView />
          )}

          {currentTab === 'imoveis' && (
            <PropertiesView
              properties={properties}
              owners={owners}
              leads={leads}
              currentUser={currentUser}
              governanceRules={agencyGovernanceRules}
              onSaveProperty={handleSaveProperty}
              onDeleteProperty={handleDeleteProperty}
              onViewOwnerDetails={(owner) => {
                handleNavigateTab('proprietarios');
              }}
              onOpenNewOwnerModal={() => setShowGlobalNewOwnerModal(true)}
              onSaveProposal={handleSaveProposal}
              onNavigateToPtam={(prop) => {
                handleNavigateTab('ptam_reports');
              }}
            />
          )}

          {currentTab === 'ptam_reports' && (
            <PtamModuleView
              properties={properties}
              currentUser={currentUser}
              themeConfig={themeConfig}
            />
          )}

          {currentTab === 'proprietarios' && (
            <OwnersView
              owners={owners}
              properties={properties}
              currentUser={currentUser}
              governanceRules={agencyGovernanceRules}
              onSaveOwner={handleSaveOwner}
              onDeleteOwner={handleDeleteOwner}
              onNavigateToProperty={(property) => {
                handleNavigateTab('imoveis');
              }}
              onOpenNewPropertyWithPreselectedOwner={(owner) => {
                handleNavigateTab('imoveis');
              }}
            />
          )}

          {currentTab === 'sales_proposals' && (
            <SalesProposalsView
              properties={properties}
              leads={leads}
              owners={owners}
              currentUser={currentUser}
              governanceRules={agencyGovernanceRules}
            />
          )}

          {currentTab === 'sales_mirror' && (
            <SalesMirrorView
              development={development}
              currentUser={currentUser}
              isExternalPartnerPortal={false}
              onLockUnitReservation={handleLockUnit}
            />
          )}

          {currentTab === 'sites_modelos' && (
            <ModelSitesView
              properties={properties}
              onOpenPropertyDetails={(property) => {
                handleNavigateTab('imoveis');
              }}
              onNavigateToCustomerPortal={() => {
                handleNavigateTab('customer_portal');
              }}
              onNavigateToIndiqueGanhe={() => {
                handleNavigateTab('indique_ganhe');
              }}
              onNewLeadFromWebsite={(leadData) => {
                const newLeadId = `lead_${Date.now()}`;
                const newLead: Lead = {
                  id: newLeadId,
                  name: leadData.name,
                  phone: leadData.phone,
                  email: leadData.email,
                  source: 'SITE_OFICIAL',
                  stage: 'NOVO_LEAD',
                  assignedBrokerId: 'usr_corretor_juliana',
                  assignedBrokerName: 'Juliana Mendes',
                  interestType: 'COMPRA',
                  budgetMin: 600000,
                  budgetMax: 1800000,
                  tags: ['Lead Site Oficial', 'Captação Web'],
                  unreadMessagesCount: 1,
                  lastMessageText: leadData.interest,
                  lastMessageTime: 'Agora',
                  createdAt: new Date().toISOString(),
                  timeline: [
                    {
                      id: `tl_${Date.now()}`,
                      leadId: newLeadId,
                      type: 'STATUS_CHANGE',
                      title: 'Lead Recebido pelo Site Oficial da Imobiliária',
                      description: leadData.interest,
                      authorName: 'Site Oficial',
                      authorRole: 'Sistema Web',
                      timestamp: 'Agora'
                    }
                  ],
                  rating: 5,
                  followUps: [
                    {
                      id: `fu_${Date.now()}`,
                      leadId: newLeadId,
                      title: 'Retorno Imediato: Lead recebido pelo Site Oficial',
                      channel: 'WHATSAPP',
                      scheduledAt: new Date().toISOString(),
                      timeStr: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                      status: 'PENDENTE',
                      priority: 'ALTA',
                      notes: 'Entrar em contato em até 15 minutos para maximizar taxa de conversão.',
                      assignedBrokerName: 'Juliana Mendes',
                      createdAt: new Date().toISOString()
                    }
                  ]
                };
                setLeads(prev => [newLead, ...prev]);
              }}
            />
          )}

          {(currentTab === 'integracoes' || currentTab === 'portals_sites') && (
            <IntegrationsHubView
              properties={properties}
              currentUser={currentUser}
              onOpenPropertyDetails={(property) => {
                handleNavigateTab('imoveis');
              }}
            />
          )}

          {currentTab === 'external_partner' && (
            <ExternalPartnersView
              properties={properties}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'human_resources' && (
            <HumanResourcesView />
          )}

          {currentTab === 'fintech_split' && (
            <RentalManagementView properties={properties} initialTab="repasses" />
          )}

          {currentTab === 'contracts' && (
            <RentalManagementView properties={properties} initialTab="dashboard" />
          )}

          {currentTab === 'dimob' && (
            <RentalManagementView properties={properties} initialTab="dimob" />
          )}

          {currentTab === 'digital_signature' && (
            <DigitalSignatureView />
          )}

          {currentTab === 'roteiro_visitas' && (
            <VisitItineraryView properties={properties} />
          )}

          {currentTab === 'inspections_keys' && (
            <InspectionsKeysView properties={properties} />
          )}

          {currentTab === 'financial_erp' && (
            <FinancialErpView />
          )}

          {currentTab === 'nfse_homologacao' && (
            <NfseHomologacaoView />
          )}

          {currentTab === 'commissions_rpa' && (
            <CommissionsRpaView
              deals={commissions}
              currentUser={currentUser}
              properties={properties}
              onAddDeal={(newDeal) => setCommissions(prev => {
                const exists = prev.some(d => d.id === newDeal.id);
                if (exists) {
                  return prev.map(d => d.id === newDeal.id ? newDeal : d);
                }
                return [newDeal, ...prev];
              })}
              onUpdateDealStatus={(dealId, newStatus) => {
                setCommissions(prev => prev.map(d => d.id === dealId ? { ...d, status: newStatus } : d));
              }}
              onDeleteDeal={(dealId) => {
                setCommissions(prev => prev.filter(d => d.id !== dealId));
              }}
            />
          )}

          {currentTab === 'cca_banking' && (
            <CcaBankingView proposals={ccaProposals} onUpdateStage={handleUpdateCcaStage} />
          )}

          {currentTab === 'bi_performance' && (
            <BiPerformanceView
              leads={leads}
              properties={properties}
              users={platformUsers}
              commissions={commissions}
              contracts={contracts}
              owners={owners}
              onUpdateProperty={(propertyId, updates) => {
                setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
              }}
              onOpenLeadDetails={(lead) => {
                setSelectedLead(lead);
              }}
            />
          )}

          {currentTab === 'brand_equity' && (
            <BrandEquityView />
          )}

          {currentTab === 'fleet_assets' && (
            <FleetAssetsView />
          )}

          {currentTab === 'gamification' && (
            <GamificationView onOpenTvMode={() => handleNavigateTab('tv_ranking')} />
          )}

          {currentTab === 'corporate_academy' && (
            <CorporateAcademyView />
          )}

          {currentTab === 'legal_sac' && (
            <LegalSacView onNavigateToHelp={() => handleNavigateTab('central_ajuda_sac')} />
          )}

          {currentTab === 'central_ajuda_sac' && (
            <CentralAjudaSacView onNavigateTab={(tab) => handleNavigateTab(tab as NavTabId)} />
          )}

          {currentTab === 'document_templates' && (
            <DocumentTemplateGeneratorView
              properties={properties}
              leads={leads}
              owners={owners}
            />
          )}

          {currentTab === 'team_permissions' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <UserPermissionsManagementView
                currentUser={currentUser}
                onNavigateToTab={(tab) => handleNavigateTab(tab as NavTabId)}
                onSimulateRole={(role) => {
                  const found = CURRENT_USER_PROFILES.find(u => u.role === role);
                  if (found) setCurrentUser(found);
                }}
              />
            </div>
          )}

          {currentTab === 'agency_governance' && (
            <AgencyGovernanceRulesView
              currentRules={agencyGovernanceRules}
              onSaveRules={handleSaveGovernanceRules}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'marketing_ia' && (
            <MarketingIaStudioView properties={properties} />
          )}

          {currentTab === 'migration_backup' && (
            <DataMigrationBackupView
              leads={leads}
              properties={properties}
              owners={owners}
              contracts={contracts}
              onImportLeads={handleImportLeads}
            />
          )}
        </main>

        {/* Column 3: Right Inspector & Intelligence Rail */}
        <RightInspectorRail
          isOpen={isRightRailOpen}
          onToggle={() => setIsRightRailOpen(prev => !prev)}
          leads={leads}
          properties={properties}
          themeConfig={themeConfig}
          onOpenThemeModal={() => setShowThemeModal(true)}
          onSelectLead={handleOpenLead}
          onOpenNewLead={() => setShowNewLeadModal(true)}
          onOpenAiStudio={() => setShowAiStudioModal(true)}
          onApplyColorPreset={handleApplyColorPreset}
        />
      </div>

      {/* Theme & Branding Customization Modal */}
      {showThemeModal && (
        <ThemeBrandingModal
          isOpen={showThemeModal}
          onClose={() => setShowThemeModal(false)}
          currentTheme={themeConfig}
          onSaveTheme={handleSaveTheme}
        />
      )}

      {/* Mobile Bottom Navigation Bar (Visible only on < lg screens) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={handleNavigateTab}
        onOpenDrawer={() => setIsMobileMenuOpen(true)}
      />

      {/* Global Modals */}
      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onSubmitLead={handleCreateLead}
          existingLeads={leads}
          onSelectExistingLead={(existingLead) => {
            setShowNewLeadModal(false);
            setSelectedLead(existingLead);
          }}
          availableBrokers={platformUsers
            .filter(u => u.role === 'BROKER' || u.role === 'MANAGER' || u.role === 'MASTER_ADMIN')
            .map(u => ({ id: u.id, name: u.name }))}
        />
      )}

      {/* Friendly Contract Validation Alert Modal (Emissão de Contrato - Validação de Proponentes) */}
      {contractValidationAlert && contractValidationAlert.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border-b border-amber-200/80 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900">
                      Validação para Contrato
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Esteira Jurídica & Financiamento
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Pendências para Emissão de Contrato
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContractValidationAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-amber-900 space-y-1">
                <p className="font-semibold text-xs">
                  O lead <strong>{contractValidationAlert.leadName}</strong> foi cadastrado com sucesso no CRM!
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Contudo, antes de permitir a emissão formal da minuta contratual ou envio para assinatura digital, é necessário que todos os proponentes (até 4) tenham <strong>Nome Completo (nome e sobrenome)</strong> e <strong>CPF válido (11 dígitos)</strong> preenchidos.
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Proponentes com pendências cadastrais:</span>
                  <span className="font-mono text-amber-700 font-bold">{contractValidationAlert.missingErrors.length} proponente(s)</span>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {contractValidationAlert.missingErrors.map((err, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          {err.proposerName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {err.role}
                        </span>
                      </div>
                      <div className="space-y-1 pl-5">
                        {err.issues.map((iss, j) => (
                          <div key={j} className="text-[11px] text-rose-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            <span>{iss}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                💡 <strong>Dica de Conformidade:</strong> Você pode complementar esses dados a qualquer momento na ficha do lead (Aba Geral ou Custódia de Documentos) para liberar a minuta contratual e a esteira de financiamento.
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setContractValidationAlert(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                Continuar no CRM (Preencher Depois)
              </button>
              <button
                type="button"
                onClick={() => {
                  const leadToOpen = contractValidationAlert.createdLead;
                  setContractValidationAlert(null);
                  if (leadToOpen) {
                    setSelectedLead(leadToOpen);
                    setShowLeadDetailsModal(true);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Abrir Ficha do Lead para Completar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSchemaModal && (
        <DatabaseSchemaModal onClose={() => setShowSchemaModal(false)} />
      )}

      {showAiStudioModal && (
        <AiStudioModal onClose={() => setShowAiStudioModal(false)} />
      )}

      {/* Free AI Tools Hub Modal (Custody Audit, Gemini Chat & Grounding) */}
      {showFreeAiToolsModal && (
        <FreeAiToolsHubModal
          isOpen={showFreeAiToolsModal}
          onClose={() => setShowFreeAiToolsModal(false)}
          leads={leads}
          properties={properties}
          onUpdateLead={(leadId, updates) => {
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
            setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, ...updates } : prev);
          }}
        />
      )}

      {showGlobalNewOwnerModal && (
        <OwnerModal
          isOpen={showGlobalNewOwnerModal}
          onClose={() => setShowGlobalNewOwnerModal(false)}
          onSave={handleSaveOwner}
        />
      )}

      {/* Complete Lead Details & Follow-up Modal */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          properties={properties}
          currentUser={currentUser}
          isOpen={showLeadDetailsModal}
          onClose={() => {
            setShowLeadDetailsModal(false);
            setSelectedLead(null);
          }}
          onChangeStage={handleChangeLeadStage}
          onAddFollowUp={handleAddFollowUp}
          onCompleteFollowUp={handleCompleteFollowUp}
          onDeleteFollowUp={handleDeleteFollowUp}
          onRescheduleFollowUp={handleRescheduleFollowUp}
          onAddTimelineNote={handleAddTimelineNote}
          onSelectPropertyForLead={handleLinkPropertyToLead}
          onOpenWhatsAppDesk={(lead) => {
            handleNavigateTab('whatsapp_desk');
          }}
          onUpdateLead={(leadId, updates) => {
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
            setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, ...updates } : prev);
          }}
        />
      )}

      {/* Floating Web Push Notification Toaster */}
      <PushNotificationToaster
        notifications={notifications}
        onDismiss={handleDeleteNotification}
        onActionClick={(notif) => {
          handleMarkNotificationAsRead(notif.id);
          if (notif.actionUrl) {
            handleNavigateTab(notif.actionUrl as NavTabId);
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />

      {/* Demo Presentation / Test Sandbox Modal */}
      <DemoSandboxModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        activeScenarioId={demoScenarioId}
        onSelectScenario={(scId) => {
          setDemoScenarioId(scId);
          if (scId === 'rede_alpha') {
            setCurrentTenantId('tenant_alphaville');
          } else if (scId === 'sky_horizon') {
            handleNavigateTab('sales_mirror');
          } else {
            setCurrentTenantId('tenant_matriz_sp');
          }
        }}
        onResetTestData={handleResetTestData}
        onInjectLiveEvent={handleInjectLiveEvent}
      />

      {/* Modal de Gestão da TV Salão (Sino Virtual, Metas, Avisos, Banners e Tempos) */}
      {showTvControlModal && (
        <TvControlManagementModal
          isOpen={showTvControlModal}
          onClose={() => setShowTvControlModal(false)}
          currentBrokersList={['Juliana Mendes', 'Carlos Eduardo', 'Beatriz Silveira', 'Lucas Amorim', 'Mariana Rocha', 'Rodrigo Faro']}
          currentTeamsList={['Equipe Alpha Prime', 'Esquadrão Elite VGV', 'Vanguard Moema & Jardins', 'Squad Águia de Ouro']}
        />
      )}

      {/* Modal Oficial de Compartilhamento do Link da Página de Vendas (Pública) */}
      <SalesPageLinkModal
        isOpen={showSalesPageLinkModal}
        onClose={() => setShowSalesPageLinkModal(false)}
        platformName={themeConfig.platformName}
        agencyName={themeConfig.agencyName}
      />
    </div>
  );
}

/**
 * System Cloud Persistence & Real-time Sync Service
 * 
 * Sincroniza em tempo real as configurações globais de Marca (Nome, Paleta de Cores,
 * Logo Principal, Logo da Tela de Login, Logo de Rodapé, Favicon), Fotos da Equipe de Corretores,
 * CMS dos Sites Oficiais, Regras de Governança e Transmissões de Propostas/Contratos para TV
 * entre TODOS os dispositivos (Desktop, Celular, Tablets, Smart TV no Salão de Vendas)
 * via Firebase Cloud Firestore, com espelhamento resiliente no localStorage e compressão automática de imagens.
 */

import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { SystemThemeConfig, DEFAULT_SYSTEM_THEME } from '../types/theme';
import { SalesPageCmsState } from '../types/salesPageCms';
import { INITIAL_SALES_PAGE_DATA } from '../data/mockSalesPageData';
import { AgencyGovernanceRules, DEFAULT_AGENCY_GOVERNANCE_RULES, WebsiteConfig, Lead, RealEstateProperty } from '../types/crm';
import { INITIAL_WEBSITE_CONFIG } from '../data/mockPortals';
import { 
  RecentDealAlert, 
  TvBroadcastingSettings, 
  DEFAULT_TV_BROADCASTING_SETTINGS,
  TvNoticeItem,
  TvLiveBellTrigger,
  TvLiveFlashAlert
} from '../types/tvRanking';
import { MOCK_RECENT_DEALS } from '../data/mockTvRankingData';
import { INITIAL_TV_NOTICES } from '../data/mockTvNoticesData';
import { compressExistingDataUrl } from '../utils/imageOptimizer';
import { SystemMessageTemplate, INITIAL_SYSTEM_COMMUNICATION_TEMPLATES } from '../types/communicationTemplates';
import { DocumentTemplateItem, SavedGeneratedDocument } from '../types/documentTemplates';
import { SystemWhiteLabelConfig, TenantAgency, PlatformUserAccount } from '../types/superAdmin';
import { INITIAL_WHITE_LABEL_CONFIG, INITIAL_TENANTS, INITIAL_PLATFORM_USERS } from '../data/mockSuperAdmin';
import { SystemNotification } from '../types/notifications';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotificationsData';

const THEME_DOC_PATH = 'theme_branding';
const CMS_DOC_PATH = 'sales_page_cms';
const GOVERNANCE_DOC_PATH = 'agency_governance';
const WEBSITE_DOC_PATH = 'official_website_cms';
const TV_DEALS_DOC_PATH = 'tv_sales_live_deals';
const TV_SETTINGS_DOC_PATH = 'tv_broadcasting_settings';
const TV_NOTICES_DOC_PATH = 'tv_notices_and_banners';
const TV_BELL_DOC_PATH = 'tv_live_bell_trigger';
const TV_FLASH_ALERT_DOC_PATH = 'tv_live_flash_alert';
const WHITE_LABEL_DOC_PATH = 'system_white_label';
const NOTIFICATIONS_DOC_PATH = 'system_notifications';
const TENANTS_DOC_PATH = 'system_tenants';
const USERS_DOC_PATH = 'system_platform_users';

const LOCAL_STORAGE_THEME_KEY = 'acertgo_system_theme_config';
const LOCAL_STORAGE_CMS_KEY = 'acertgo_sales_page_cms';
const LOCAL_STORAGE_GOVERNANCE_KEY = 'acertgo_agency_governance_rules';
const LOCAL_STORAGE_WEBSITE_KEY = 'acertgo_official_website_config';
const LOCAL_STORAGE_TV_DEALS_KEY = 'acertgo_tv_live_deals';
const LOCAL_STORAGE_TV_SETTINGS_KEY = 'acertgo_tv_broadcasting_settings';
const LOCAL_STORAGE_TV_NOTICES_KEY = 'acertgo_tv_notices_and_banners';
const LOCAL_STORAGE_WHITE_LABEL_KEY = 'acertgo_system_white_label_config';
const LOCAL_STORAGE_NOTIFICATIONS_KEY = 'acertgo_system_notifications';
const LOCAL_STORAGE_DELETED_NOTIFS_KEY = 'acertgo_deleted_notification_ids';
const LOCAL_STORAGE_NOTIFS_CLEARED_FLAG = 'acertgo_notifications_cleared_all';
const LOCAL_STORAGE_TENANTS_KEY = 'acertgo_tenants_data';
const LOCAL_STORAGE_USERS_KEY = 'acertgo_platform_users_data';

// Evento customizado para notificar componentes de atualização de sincronização
export const SYSTEM_SYNC_EVENT = 'acertgo_system_sync_update';

export function notifySyncListeners(type: string, data: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYSTEM_SYNC_EVENT, { detail: { type, data } }));
  }
}

/**
 * 1. PERSISTÊNCIA DE TEMA, LOGO LOGIN, LOGO RODAPÉ E MARCA (DESKTOP, CELULAR & TV)
 */
export function getInitialThemeConfig(): SystemThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_SYSTEM_THEME;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    let themeObj = saved ? JSON.parse(saved) : {};
    
    // Also check if white-label config has newer logo/favicon/phone
    const savedWhiteLabel = localStorage.getItem(LOCAL_STORAGE_WHITE_LABEL_KEY);
    if (savedWhiteLabel) {
      try {
        const wl = JSON.parse(savedWhiteLabel);
        if (wl.logoUrl) themeObj.logoUrl = wl.logoUrl;
        if (wl.faviconUrl) themeObj.faviconUrl = wl.faviconUrl;
        if (wl.platformName) themeObj.platformName = wl.platformName;
        if (wl.supportPhone) themeObj.supportPhone = wl.supportPhone;
      } catch {}
    }

    return { ...DEFAULT_SYSTEM_THEME, ...themeObj };
  } catch (e) {
    console.warn('[Persistence] Erro ao ler tema do cache local:', e);
  }
  return DEFAULT_SYSTEM_THEME;
}

export async function saveThemeConfigToCloud(newTheme: SystemThemeConfig): Promise<void> {
  // Otimizar imagens para garantir que caibam sem exceder quotas
  const optimizedTheme: SystemThemeConfig = { ...newTheme };

  try {
    if (optimizedTheme.logoUrl && optimizedTheme.logoUrl.startsWith('data:image')) {
      optimizedTheme.logoUrl = await compressExistingDataUrl(optimizedTheme.logoUrl, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
    }
    if (optimizedTheme.loginLogoUrl && optimizedTheme.loginLogoUrl.startsWith('data:image')) {
      optimizedTheme.loginLogoUrl = await compressExistingDataUrl(optimizedTheme.loginLogoUrl, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
    }
    if (optimizedTheme.footerLogoUrl && optimizedTheme.footerLogoUrl.startsWith('data:image')) {
      optimizedTheme.footerLogoUrl = await compressExistingDataUrl(optimizedTheme.footerLogoUrl, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
    }
    if (optimizedTheme.faviconUrl && optimizedTheme.faviconUrl.startsWith('data:image')) {
      optimizedTheme.faviconUrl = await compressExistingDataUrl(optimizedTheme.faviconUrl, { maxWidth: 128, maxHeight: 128, quality: 0.85 });
    }
  } catch (err) {
    console.warn('[Persistence] Erro ao comprimir imagens de tema:', err);
  }

  // 1. Gravar no cache local para resposta ultra-rápida
  try {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(optimizedTheme));
    
    // Also cross-sync with white-label config in localStorage
    const savedWl = localStorage.getItem(LOCAL_STORAGE_WHITE_LABEL_KEY);
    const wlObj = savedWl ? JSON.parse(savedWl) : { ...INITIAL_WHITE_LABEL_CONFIG };
    let changed = false;
    if (optimizedTheme.logoUrl && wlObj.logoUrl !== optimizedTheme.logoUrl) {
      wlObj.logoUrl = optimizedTheme.logoUrl;
      changed = true;
    }
    if (optimizedTheme.faviconUrl && wlObj.faviconUrl !== optimizedTheme.faviconUrl) {
      wlObj.faviconUrl = optimizedTheme.faviconUrl;
      changed = true;
    }
    if (optimizedTheme.platformName && wlObj.platformName !== optimizedTheme.platformName) {
      wlObj.platformName = optimizedTheme.platformName;
      changed = true;
    }
    if (changed) {
      localStorage.setItem(LOCAL_STORAGE_WHITE_LABEL_KEY, JSON.stringify(wlObj));
    }
  } catch (e) {
    console.warn('[Persistence] Falha no localStorage (quota), tentando salvar reduzido:', e);
  }

  // 2. Sincronizar na nuvem (Firestore) para que celular e TV recebam instantaneamente
  try {
    const docRef = doc(db, 'system_config', THEME_DOC_PATH);
    await setDoc(docRef, {
      ...optimizedTheme,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('[Persistence] ✅ Tema, Logos (Login/Rodapé) sincronizados no Cloud Firestore com sucesso!');
    notifySyncListeners('THEME', optimizedTheme);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar tema no Firestore:', err);
  }
}

export function subscribeThemeConfigFromCloud(
  onUpdate: (theme: SystemThemeConfig) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', THEME_DOC_PATH);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as Partial<SystemThemeConfig>;
          const currentLocal = getInitialThemeConfig();
          const mergedTheme: SystemThemeConfig = {
            ...DEFAULT_SYSTEM_THEME,
            ...currentLocal,
            ...remoteData
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(mergedTheme));
          } catch {
            // ignore
          }
          onUpdate(mergedTheme);
        }
      },
      (error) => {
        console.warn('[Persistence] Firestore listener de tema:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Persistence] Não foi possível iniciar listener de tema no Firestore:', e);
    return () => {};
  }
}

/**
 * 1.1 PERSISTÊNCIA DE CONFIGURAÇÕES GLOBAIS WHITE-LABEL (SUPER ADMIN, SUPORTE, SLA, LOGOS & FAVICON)
 */
export function getInitialSystemConfig(): SystemWhiteLabelConfig {
  if (typeof window === 'undefined') return INITIAL_WHITE_LABEL_CONFIG;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_WHITE_LABEL_KEY);
    let parsed = saved ? JSON.parse(saved) : {};

    // Check if theme has newer logo/favicon
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (savedTheme) {
      try {
        const th = JSON.parse(savedTheme);
        if (th.logoUrl) parsed.logoUrl = th.logoUrl;
        if (th.faviconUrl) parsed.faviconUrl = th.faviconUrl;
        if (th.platformName) parsed.platformName = th.platformName;
      } catch {}
    }

    return { ...INITIAL_WHITE_LABEL_CONFIG, ...parsed };
  } catch (e) {
    console.warn('[Persistence] Erro ao ler systemConfig do cache local:', e);
  }
  return INITIAL_WHITE_LABEL_CONFIG;
}

export async function saveSystemConfigToCloud(newConfig: SystemWhiteLabelConfig): Promise<void> {
  const optimizedConfig = { ...newConfig };
  try {
    if (optimizedConfig.logoUrl && optimizedConfig.logoUrl.startsWith('data:image')) {
      optimizedConfig.logoUrl = await compressExistingDataUrl(optimizedConfig.logoUrl, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
    }
    if (optimizedConfig.faviconUrl && optimizedConfig.faviconUrl.startsWith('data:image')) {
      optimizedConfig.faviconUrl = await compressExistingDataUrl(optimizedConfig.faviconUrl, { maxWidth: 128, maxHeight: 128, quality: 0.85 });
    }
  } catch (err) {
    console.warn('[Persistence] Erro ao comprimir imagens de white-label:', err);
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_WHITE_LABEL_KEY, JSON.stringify(optimizedConfig));
  } catch (e) {
    console.warn('[Persistence] Falha ao gravar white-label no localStorage:', e);
  }

  // Also sync with theme in localStorage
  try {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    const themeObj = savedTheme ? JSON.parse(savedTheme) : { ...DEFAULT_SYSTEM_THEME };
    themeObj.platformName = optimizedConfig.platformName;
    themeObj.tagline = optimizedConfig.tagline;
    if (optimizedConfig.logoUrl) themeObj.logoUrl = optimizedConfig.logoUrl;
    if (optimizedConfig.faviconUrl) themeObj.faviconUrl = optimizedConfig.faviconUrl;
    if (optimizedConfig.primaryColor) themeObj.primaryColor = optimizedConfig.primaryColor;
    if (optimizedConfig.secondaryColor) themeObj.secondaryColor = optimizedConfig.secondaryColor;
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(themeObj));
  } catch {}

  try {
    const docRef = doc(db, 'system_config', WHITE_LABEL_DOC_PATH);
    await setDoc(docRef, {
      ...optimizedConfig,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    notifySyncListeners('SYSTEM_CONFIG', optimizedConfig);
  } catch (err) {
    console.warn('[Persistence] Erro ao salvar white-label no Firestore:', err);
  }
}

export function subscribeSystemConfigFromCloud(
  onUpdate: (config: SystemWhiteLabelConfig) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', WHITE_LABEL_DOC_PATH);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as Partial<SystemWhiteLabelConfig>;
          const currentLocal = getInitialSystemConfig();
          const merged: SystemWhiteLabelConfig = {
            ...INITIAL_WHITE_LABEL_CONFIG,
            ...currentLocal,
            ...remoteData
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_WHITE_LABEL_KEY, JSON.stringify(merged));
          } catch {}
          onUpdate(merged);
        }
      },
      (error) => {
        console.warn('[Persistence] Firestore listener de systemConfig:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Persistence] Erro ao iniciar listener de systemConfig:', e);
    return () => {};
  }
}

/**
 * 1.2 PERSISTÊNCIA RESILIENTE DE NOTIFICAÇÕES & EXCLUSÃO DEFINITIVA
 */
export function recordDeletedNotificationId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_DELETED_NOTIFS_KEY);
    const ids: string[] = saved ? JSON.parse(saved) : [];
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(LOCAL_STORAGE_DELETED_NOTIFS_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao registrar ID deletado:', e);
  }
}

export function recordDeletedNotificationIds(idsToDelete: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_DELETED_NOTIFS_KEY);
    const ids: string[] = saved ? JSON.parse(saved) : [];
    idsToDelete.forEach(id => {
      if (!ids.includes(id)) ids.push(id);
    });
    localStorage.setItem(LOCAL_STORAGE_DELETED_NOTIFS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('[Persistence] Erro ao registrar IDs deletados:', e);
  }
}

export function getDeletedNotificationIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_DELETED_NOTIFS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function getInitialNotifications(): SystemNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const wasClearedAll = localStorage.getItem(LOCAL_STORAGE_NOTIFS_CLEARED_FLAG) === 'true';
    const deletedIds = getDeletedNotificationIds();

    const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
    if (saved) {
      const list: SystemNotification[] = JSON.parse(saved);
      if (Array.isArray(list)) {
        if (list.length === 0 || wasClearedAll) {
          return list.filter(n => !deletedIds.includes(n.id));
        }
        return list.filter(n => !deletedIds.includes(n.id));
      }
    }

    if (wasClearedAll) {
      return [];
    }

    return INITIAL_NOTIFICATIONS.filter(n => !deletedIds.includes(n.id));
  } catch (e) {
    console.warn('[Persistence] Erro ao carregar notificações do cache:', e);
  }
  return [];
}

export async function saveNotificationsToCloud(
  notifications: SystemNotification[], 
  extraDeletedIds?: string[]
): Promise<void> {
  if (extraDeletedIds && extraDeletedIds.length > 0) {
    recordDeletedNotificationIds(extraDeletedIds);
  }

  const isCleared = notifications.length === 0;

  try {
    localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    if (isCleared) {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_CLEARED_FLAG, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_NOTIFS_CLEARED_FLAG);
    }
  } catch (e) {
    console.warn('[Persistence] Falha ao salvar notificações no localStorage:', e);
  }

  try {
    const docRef = doc(db, 'system_config', NOTIFICATIONS_DOC_PATH);
    await setDoc(docRef, {
      notifications,
      deletedIds: getDeletedNotificationIds(),
      clearedAll: isCleared,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    notifySyncListeners('NOTIFICATIONS', notifications);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar notificações no Firestore:', err);
  }
}

export async function clearAllNotificationsPermanently(extraDeletedIds?: string[]): Promise<void> {
  const initialIds = INITIAL_NOTIFICATIONS.map(n => n.id);
  const idsToRecord = extraDeletedIds && extraDeletedIds.length > 0 
    ? [...extraDeletedIds, ...initialIds]
    : initialIds;

  recordDeletedNotificationIds(idsToRecord);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_CLEARED_FLAG, 'true');
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify([]));
    } catch {}
  }
  await saveNotificationsToCloud([], idsToRecord);
}

export function subscribeNotificationsFromCloud(
  onUpdate: (notifications: SystemNotification[]) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', NOTIFICATIONS_DOC_PATH);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const remoteDeleted = (data.deletedIds || []) as string[];
          if (remoteDeleted.length > 0) {
            recordDeletedNotificationIds(remoteDeleted);
          }
          const deletedIds = getDeletedNotificationIds();
          const wasClearedAll = data.clearedAll === true || localStorage.getItem(LOCAL_STORAGE_NOTIFS_CLEARED_FLAG) === 'true';

          if (Array.isArray(data.notifications)) {
            const filtered = (data.notifications as SystemNotification[]).filter(n => !deletedIds.includes(n.id));
            if (wasClearedAll && filtered.length === 0) {
              try {
                localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify([]));
                localStorage.setItem(LOCAL_STORAGE_NOTIFS_CLEARED_FLAG, 'true');
              } catch {}
              onUpdate([]);
              return;
            }
            try {
              localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(filtered));
              if (filtered.length > 0) {
                localStorage.removeItem(LOCAL_STORAGE_NOTIFS_CLEARED_FLAG);
              }
            } catch {}
            onUpdate(filtered);
          } else if (wasClearedAll) {
            onUpdate([]);
          }
        }
      },
      (error) => {
        console.warn('[Persistence] Firestore listener de notificações:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Persistence] Erro ao iniciar listener de notificações:', e);
    return () => {};
  }
}

/**
 * 1.3 PERSISTÊNCIA DE TENANTS E USUÁRIOS DA PLATAFORMA
 */
export function getInitialTenants(): TenantAgency[] {
  if (typeof window === 'undefined') return INITIAL_TENANTS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TENANTS_KEY);
    if (saved) {
      const list = JSON.parse(saved);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch {}
  return INITIAL_TENANTS;
}

export async function saveTenantsToCloud(tenants: TenantAgency[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_TENANTS_KEY, JSON.stringify(tenants));
  } catch {}
  try {
    const docRef = doc(db, 'system_config', TENANTS_DOC_PATH);
    await setDoc(docRef, { tenants, updatedAt: new Date().toISOString() }, { merge: true });
    notifySyncListeners('TENANTS', tenants);
  } catch {}
}

export function getInitialPlatformUsers(): PlatformUserAccount[] {
  if (typeof window === 'undefined') return INITIAL_PLATFORM_USERS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (saved) {
      const list = JSON.parse(saved);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch {}
  return INITIAL_PLATFORM_USERS;
}

export async function savePlatformUsersToCloud(users: PlatformUserAccount[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  } catch {}
  try {
    const docRef = doc(db, 'system_config', USERS_DOC_PATH);
    await setDoc(docRef, { users, updatedAt: new Date().toISOString() }, { merge: true });
    notifySyncListeners('USERS', users);
  } catch {}
}

/**
 * 2. PERSISTÊNCIA DO SITE OFICIAL (FOTOS DA EQUIPE, LOGOS, DEPOIMENTOS E CMS)
 */
export function getInitialWebsiteConfig(): WebsiteConfig {
  if (typeof window === 'undefined') return INITIAL_WEBSITE_CONFIG;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_WEBSITE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_WEBSITE_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler website config do cache local:', e);
  }
  return INITIAL_WEBSITE_CONFIG;
}

export async function saveWebsiteConfigToCloud(newConfig: WebsiteConfig): Promise<void> {
  const optimizedConfig: WebsiteConfig = { ...newConfig };

  // Otimizar fotos da equipe antes de persistir
  if (optimizedConfig.teamMembers && optimizedConfig.teamMembers.length > 0) {
    try {
      const processedMembers = await Promise.all(
        optimizedConfig.teamMembers.map(async (member) => {
          if (member.photoUrl && member.photoUrl.startsWith('data:image')) {
            const compressed = await compressExistingDataUrl(member.photoUrl, {
              maxWidth: 400,
              maxHeight: 400,
              quality: 0.82
            });
            return { ...member, photoUrl: compressed };
          }
          return member;
        })
      );
      optimizedConfig.teamMembers = processedMembers;
    } catch (e) {
      console.warn('[Persistence] Falha ao comprimir fotos da equipe:', e);
    }
  }

  // Otimizar logo do site e logo do rodapé
  if (optimizedConfig.logoUrl && optimizedConfig.logoUrl.startsWith('data:image')) {
    optimizedConfig.logoUrl = await compressExistingDataUrl(optimizedConfig.logoUrl, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
  }
  if (optimizedConfig.footerLogoUrl && optimizedConfig.footerLogoUrl.startsWith('data:image')) {
    optimizedConfig.footerLogoUrl = await compressExistingDataUrl(optimizedConfig.footerLogoUrl, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
  }

  // 1. Salvar no localStorage local
  try {
    localStorage.setItem(LOCAL_STORAGE_WEBSITE_KEY, JSON.stringify(optimizedConfig));
  } catch (e) {
    console.warn('[Persistence] Falha ao gravar website no localStorage:', e);
  }

  // 2. Sincronizar na nuvem (Firestore)
  try {
    const docRef = doc(db, 'system_config', WEBSITE_DOC_PATH);
    await setDoc(docRef, {
      ...optimizedConfig,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('[Persistence] ✅ Fotos da equipe e Website CMS sincronizados na nuvem Firestore!');
    notifySyncListeners('WEBSITE_CMS', optimizedConfig);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar Website no Firestore:', err);
  }
}

export function subscribeWebsiteConfigFromCloud(
  onUpdate: (config: WebsiteConfig) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', WEBSITE_DOC_PATH);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as Partial<WebsiteConfig>;
          const mergedConfig: WebsiteConfig = {
            ...INITIAL_WEBSITE_CONFIG,
            ...remoteData
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_WEBSITE_KEY, JSON.stringify(mergedConfig));
          } catch {
            // ignore
          }
          onUpdate(mergedConfig);
        }
      },
      (error) => {
        console.warn('[Persistence] Firestore listener de website CMS:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Persistence] Não foi possível iniciar listener de website no Firestore:', e);
    return () => {};
  }
}

/**
 * 3. PERSISTÊNCIA DO CMS DA LANDING PAGE DE VENDAS (SAAS / CAPTAÇÃO)
 */
export function getInitialSalesPageCms(): SalesPageCmsState {
  if (typeof window === 'undefined') return INITIAL_SALES_PAGE_DATA;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CMS_KEY);
    if (saved) {
      return { ...INITIAL_SALES_PAGE_DATA, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler CMS do cache local:', e);
  }
  return INITIAL_SALES_PAGE_DATA;
}

export async function saveSalesPageCmsToCloud(newCms: SalesPageCmsState): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_CMS_KEY, JSON.stringify(newCms));
  } catch (e) {
    console.warn('[Persistence] Falha ao gravar CMS no localStorage:', e);
  }

  try {
    const docRef = doc(db, 'system_config', CMS_DOC_PATH);
    await setDoc(docRef, {
      ...newCms,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('[Persistence] ✅ Landing Page CMS sincronizada no Firestore!');
    notifySyncListeners('SALES_CMS', newCms);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar CMS no Firestore:', err);
  }
}

export function subscribeSalesPageCmsFromCloud(
  onUpdate: (cms: SalesPageCmsState) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', CMS_DOC_PATH);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as Partial<SalesPageCmsState>;
          const mergedCms: SalesPageCmsState = {
            ...INITIAL_SALES_PAGE_DATA,
            ...remoteData
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_CMS_KEY, JSON.stringify(mergedCms));
          } catch {
            // ignore
          }
          onUpdate(mergedCms);
        }
      },
      (error) => {
        console.warn('[Persistence] Firestore listener de CMS:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[Persistence] Não foi possível iniciar listener de CMS no Firestore:', e);
    return () => {};
  }
}

/**
 * 4. PERSISTÊNCIA DAS REGRAS DE GOVERNANÇA DA IMOBILIÁRIA
 */
export function getInitialAgencyGovernanceRules(): AgencyGovernanceRules {
  if (typeof window === 'undefined') return DEFAULT_AGENCY_GOVERNANCE_RULES;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_GOVERNANCE_KEY);
    if (saved) {
      return { ...DEFAULT_AGENCY_GOVERNANCE_RULES, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler governança local:', e);
  }
  return DEFAULT_AGENCY_GOVERNANCE_RULES;
}

export async function saveAgencyGovernanceRulesToCloud(newRules: AgencyGovernanceRules): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_GOVERNANCE_KEY, JSON.stringify(newRules));
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = doc(db, 'system_config', GOVERNANCE_DOC_PATH);
    await setDoc(docRef, {
      ...newRules,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    notifySyncListeners('GOVERNANCE', newRules);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar governança no Firestore:', err);
  }
}

export function subscribeAgencyGovernanceRulesFromCloud(
  onUpdate: (rules: AgencyGovernanceRules) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', GOVERNANCE_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as Partial<AgencyGovernanceRules>;
          const merged = { ...DEFAULT_AGENCY_GOVERNANCE_RULES, ...remoteData };
          try {
            localStorage.setItem(LOCAL_STORAGE_GOVERNANCE_KEY, JSON.stringify(merged));
          } catch {
            // ignore
          }
          onUpdate(merged);
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de governança:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 5. PERSISTÊNCIA E SINCRONIZAÇÃO EM TEMPO REAL DA TV SALÃO DE VENDAS
 * (Propostas e Contratos ao vivo disparados de qualquer celular/desktop para a TV)
 */
export function getInitialTvLiveDeals(): RecentDealAlert[] {
  if (typeof window === 'undefined') return MOCK_RECENT_DEALS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TV_DEALS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler deals da TV local:', e);
  }
  return MOCK_RECENT_DEALS;
}

export async function broadcastTvLiveDealToCloud(newDeal: RecentDealAlert): Promise<void> {
  let existingDeals = getInitialTvLiveDeals();
  const updatedDeals = [newDeal, ...existingDeals.filter(d => d.id !== newDeal.id)].slice(0, 30);

  try {
    localStorage.setItem(LOCAL_STORAGE_TV_DEALS_KEY, JSON.stringify(updatedDeals));
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = doc(db, 'system_config', TV_DEALS_DOC_PATH);
    await setDoc(docRef, {
      deals: updatedDeals,
      latestDeal: newDeal,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('[Persistence] Nova Proposta/Contrato transmitido para a TV Salão via Firestore!');
    notifySyncListeners('TV_DEAL', newDeal);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar deal de TV no Firestore:', err);
  }
}

export function subscribeTvLiveDealsFromCloud(
  onUpdate: (deals: RecentDealAlert[], latestDeal?: RecentDealAlert) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', TV_DEALS_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.deals)) {
            try {
              localStorage.setItem(LOCAL_STORAGE_TV_DEALS_KEY, JSON.stringify(data.deals));
            } catch {
              // ignore
            }
            onUpdate(data.deals, data.latestDeal);
          }
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de TV Deals no Firestore:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 6. CONFIGURAÇÕES DE TRANSMISSÃO E TEMPO DA TV SALÃO (GERENCIADAS PELO GESTOR)
 */
export function getInitialTvBroadcastingSettings(): TvBroadcastingSettings {
  if (typeof window === 'undefined') return DEFAULT_TV_BROADCASTING_SETTINGS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TV_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_TV_BROADCASTING_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler configs de TV local:', e);
  }
  return DEFAULT_TV_BROADCASTING_SETTINGS;
}

export async function saveTvBroadcastingSettingsToCloud(newSettings: TvBroadcastingSettings): Promise<void> {
  const payload = {
    ...newSettings,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_TV_SETTINGS_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = doc(db, 'system_config', TV_SETTINGS_DOC_PATH);
    await setDoc(docRef, payload, { merge: true });
    console.log('[Persistence] ⚙️ Configurações de tempo e alternância da TV salvas no Firestore!');
    notifySyncListeners('TV_SETTINGS', payload);
  } catch (err) {
    console.warn('[Persistence] Erro ao salvar configurações de TV no Firestore:', err);
  }
}

export function subscribeTvBroadcastingSettingsFromCloud(
  onUpdate: (settings: TvBroadcastingSettings) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', TV_SETTINGS_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remote = snapshot.data() as Partial<TvBroadcastingSettings>;
          const merged = { ...DEFAULT_TV_BROADCASTING_SETTINGS, ...remote };
          try {
            localStorage.setItem(LOCAL_STORAGE_TV_SETTINGS_KEY, JSON.stringify(merged));
          } catch {
            // ignore
          }
          onUpdate(merged);
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de TV Settings:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 7. INFORMATIVOS, METAS E BANNERS DA TV SALÃO (GERENCIADOS PELO GESTOR)
 */
export function getInitialTvNotices(): TvNoticeItem[] {
  if (typeof window === 'undefined') return INITIAL_TV_NOTICES;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TV_NOTICES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler notices da TV local:', e);
  }
  return INITIAL_TV_NOTICES;
}

export async function saveTvNoticesToCloud(notices: TvNoticeItem[]): Promise<void> {
  // Otimizar imagens dos avisos antes de salvar
  const processedNotices = await Promise.all(
    notices.map(async (n) => {
      if (n.imageUrl && n.imageUrl.startsWith('data:image')) {
        const compressed = await compressExistingDataUrl(n.imageUrl, { maxWidth: 800, maxHeight: 600, quality: 0.82 });
        return { ...n, imageUrl: compressed };
      }
      return n;
    })
  );

  try {
    localStorage.setItem(LOCAL_STORAGE_TV_NOTICES_KEY, JSON.stringify(processedNotices));
  } catch (e) {
    console.warn(e);
  }

  try {
    const docRef = doc(db, 'system_config', TV_NOTICES_DOC_PATH);
    await setDoc(docRef, {
      notices: processedNotices,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('[Persistence] Informativos, metas e banners da TV sincronizados no Firestore!');
    notifySyncListeners('TV_NOTICES', processedNotices);
  } catch (err) {
    console.warn('[Persistence] Erro ao salvar avisos de TV no Firestore:', err);
  }
}

export function subscribeTvNoticesFromCloud(
  onUpdate: (notices: TvNoticeItem[]) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', TV_NOTICES_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.notices)) {
            try {
              localStorage.setItem(LOCAL_STORAGE_TV_NOTICES_KEY, JSON.stringify(data.notices));
            } catch {
              // ignore
            }
            onUpdate(data.notices);
          }
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de TV Notices:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 8. TOCAR SINO VIRTUAL AO VIVO COM SOM SELECIONADO
 * (Dispara o sino em tempo real para a Smart TV sintonizada no salão)
 */
export async function triggerVirtualBellToCloud(bell: TvLiveBellTrigger): Promise<void> {
  try {
    const docRef = doc(db, 'system_config', TV_BELL_DOC_PATH);
    await setDoc(docRef, {
      ...bell,
      triggeredAt: new Date().toISOString()
    });
    console.log('[Persistence] Sino Virtual tocado ao vivo na TV via Firestore!', bell.soundType);
    notifySyncListeners('TV_BELL', bell);
  } catch (err) {
    console.warn('[Persistence] Erro ao disparar sino virtual no Firestore:', err);
  }
}

export function subscribeVirtualBellFromCloud(
  onTrigger: (bell: TvLiveBellTrigger) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', TV_BELL_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as TvLiveBellTrigger;
          if (data && data.soundType) {
            onTrigger(data);
          }
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de Sino Virtual:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 9. ALERTA FLASH INSTANTÂNEO NA TELA DA TV ("PLANTÃO URGENTE")
 */
export async function sendFlashAlertToCloud(alert: TvLiveFlashAlert): Promise<void> {
  try {
    const docRef = doc(db, 'system_config', TV_FLASH_ALERT_DOC_PATH);
    await setDoc(docRef, {
      ...alert,
      updatedAt: new Date().toISOString()
    });
    console.log('[Persistence] ⚡ Alerta Flash transmitido para a TV via Firestore!');
    notifySyncListeners('TV_FLASH', alert);
  } catch (err) {
    console.warn('[Persistence] Erro ao transmitir alerta flash no Firestore:', err);
  }
}

export function subscribeFlashAlertFromCloud(
  onAlert: (alert: TvLiveFlashAlert | null) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', TV_FLASH_ALERT_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as TvLiveFlashAlert;
          if (data && data.active) {
            onAlert(data);
          } else {
            onAlert(null);
          }
        } else {
          onAlert(null);
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de Flash Alert:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 10. PERSISTÊNCIA E SINCRONIZAÇÃO EM NUVEM DE LEADS (FIRESTORE)
 */
const LEADS_COLLECTION = 'leads';
const LOCAL_STORAGE_LEADS_KEY = 'acertgo_system_leads';

export function getInitialLeadsFromCache(): Lead[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler leads do cache local:', e);
  }
  return null;
}

export async function saveSingleLeadToCloud(lead: Lead): Promise<void> {
  try {
    const docRef = doc(db, LEADS_COLLECTION, lead.id);
    await setDoc(docRef, {
      ...lead,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    notifySyncListeners('LEAD_UPDATED', lead);
  } catch (err) {
    console.warn('[Persistence] Erro ao salvar lead individual no Firestore:', err);
  }
}

export async function deleteLeadFromCloud(leadId: string): Promise<void> {
  try {
    const docRef = doc(db, LEADS_COLLECTION, leadId);
    await deleteDoc(docRef);
    notifySyncListeners('LEAD_DELETED', { id: leadId });
  } catch (err) {
    console.warn('[Persistence] Erro ao excluir lead no Firestore:', err);
  }
}

export async function saveLeadsToCloud(leads: Lead[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.warn('[Persistence] Falha ao gravar leads no localStorage:', e);
  }

  try {
    // Gravar em lote (batch) no Firestore
    const batch = writeBatch(db);
    leads.forEach(lead => {
      const docRef = doc(db, LEADS_COLLECTION, lead.id);
      batch.set(docRef, { ...lead, updatedAt: new Date().toISOString() }, { merge: true });
    });
    await batch.commit();
    console.log(`[Persistence] ✅ ${leads.length} leads sincronizados com o Firestore!`);
    notifySyncListeners('LEADS_SYNC', leads);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar lote de leads no Firestore:', err);
  }
}

export function subscribeLeadsFromCloud(
  onUpdate: (leads: Lead[]) => void
): () => void {
  try {
    const colRef = collection(db, LEADS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedLeads: Lead[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Lead;
            loadedLeads.push({ ...data, id: docSnap.id });
          });
          // Cache local
          try {
            localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(loadedLeads));
          } catch {}
          onUpdate(loadedLeads);
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de Leads do Firestore:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 11. PERSISTÊNCIA E SINCRONIZAÇÃO EM NUVEM DE IMÓVEIS (PROPERTIES)
 */
const PROPERTIES_COLLECTION = 'properties';
const LOCAL_STORAGE_PROPERTIES_KEY = 'acertgo_system_properties';

export function getInitialPropertiesFromCache(): RealEstateProperty[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler imóveis do cache local:', e);
  }
  return null;
}

export async function saveSinglePropertyToCloud(property: RealEstateProperty): Promise<void> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, property.id);
    await setDoc(docRef, {
      ...property,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    notifySyncListeners('PROPERTY_UPDATED', property);
  } catch (err) {
    console.warn('[Persistence] Erro ao salvar imóvel individual no Firestore:', err);
  }
}

export async function deletePropertyFromCloud(propertyId: string): Promise<void> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await deleteDoc(docRef);
    notifySyncListeners('PROPERTY_DELETED', { id: propertyId });
  } catch (err) {
    console.warn('[Persistence] Erro ao excluir imóvel no Firestore:', err);
  }
}

export async function savePropertiesToCloud(properties: RealEstateProperty[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
  } catch (e) {
    console.warn('[Persistence] Falha ao gravar imóveis no localStorage:', e);
  }

  try {
    const batch = writeBatch(db);
    properties.forEach(prop => {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      batch.set(docRef, { ...prop, updatedAt: new Date().toISOString() }, { merge: true });
    });
    await batch.commit();
    console.log(`[Persistence] ✅ ${properties.length} imóveis sincronizados com o Firestore!`);
    notifySyncListeners('PROPERTIES_SYNC', properties);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar lote de imóveis no Firestore:', err);
  }
}

export function subscribePropertiesFromCloud(
  onUpdate: (properties: RealEstateProperty[]) => void
): () => void {
  try {
    const colRef = collection(db, PROPERTIES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProps: RealEstateProperty[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as RealEstateProperty;
            loadedProps.push({ ...data, id: docSnap.id });
          });
          try {
            localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(loadedProps));
          } catch {}
          onUpdate(loadedProps);
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de Imóveis do Firestore:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 12. PARAMETRIZAÇÃO DE MENSAGENS E NOTIFICAÇÕES (FIRESTORE & LOCALSTORAGE)
 */
const COMMUNICATION_TEMPLATES_DOC_PATH = 'communication_templates';
const LOCAL_STORAGE_COMMUNICATION_TEMPLATES_KEY = 'acertgo_system_communication_templates';

export function getInitialCommunicationTemplates(): SystemMessageTemplate[] {
  if (typeof window === 'undefined') return INITIAL_SYSTEM_COMMUNICATION_TEMPLATES;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_COMMUNICATION_TEMPLATES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler modelos de comunicação do cache local:', e);
  }
  return INITIAL_SYSTEM_COMMUNICATION_TEMPLATES;
}

export async function saveCommunicationTemplatesToCloud(templates: SystemMessageTemplate[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_COMMUNICATION_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    console.warn('[Persistence] Falha ao gravar modelos de comunicação no localStorage:', e);
  }

  try {
    const docRef = doc(db, 'system_config', COMMUNICATION_TEMPLATES_DOC_PATH);
    await setDoc(docRef, {
      templates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Persistence] ✅ ${templates.length} modelos de comunicação sincronizados no Cloud Firestore!`);
    notifySyncListeners('COMMUNICATION_TEMPLATES_SYNC', templates);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar modelos de comunicação no Firestore:', err);
  }
}

export function subscribeCommunicationTemplatesFromCloud(
  onUpdate: (templates: SystemMessageTemplate[]) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', COMMUNICATION_TEMPLATES_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.templates) && data.templates.length > 0) {
            try {
              localStorage.setItem(LOCAL_STORAGE_COMMUNICATION_TEMPLATES_KEY, JSON.stringify(data.templates));
            } catch {}
            onUpdate(data.templates as SystemMessageTemplate[]);
          }
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de Modelos de Comunicação do Firestore:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * 13. MINUTAS & MODELOS DE DOCUMENTOS JURÍDICOS (FIRESTORE & LOCALSTORAGE)
 */
const DOCUMENT_TEMPLATES_DOC_PATH = 'document_templates';
const LOCAL_STORAGE_DOCUMENT_TEMPLATES_KEY = 'acertgo_system_document_templates';
const LOCAL_STORAGE_SAVED_DOCUMENTS_KEY = 'acertgo_system_saved_documents';

export function getInitialDocumentTemplatesFromCache(): DocumentTemplateItem[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_DOCUMENT_TEMPLATES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler minutas de documentos do cache:', e);
  }
  return null;
}

export async function saveDocumentTemplatesToCloud(templates: DocumentTemplateItem[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_DOCUMENT_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    console.warn('[Persistence] Falha no localStorage para minutas:', e);
  }

  try {
    const docRef = doc(db, 'system_config', DOCUMENT_TEMPLATES_DOC_PATH);
    await setDoc(docRef, {
      templates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Persistence] ✅ ${templates.length} minutas de documentos sincronizadas no Cloud Firestore!`);
    notifySyncListeners('DOCUMENT_TEMPLATES_SYNC', templates);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar minutas no Firestore:', err);
  }
}

export function subscribeDocumentTemplatesFromCloud(
  onUpdate: (templates: DocumentTemplateItem[]) => void
): () => void {
  try {
    const docRef = doc(db, 'system_config', DOCUMENT_TEMPLATES_DOC_PATH);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.templates) && data.templates.length > 0) {
            try {
              localStorage.setItem(LOCAL_STORAGE_DOCUMENT_TEMPLATES_KEY, JSON.stringify(data.templates));
            } catch {}
            onUpdate(data.templates as DocumentTemplateItem[]);
          }
        }
      },
      (error) => {
        console.warn('[Persistence] Listener de Minutas de Documentos do Firestore:', error.message);
      }
    );
  } catch {
    return () => {};
  }
}

export const DEFAULT_SAVED_GENERATED_DOCUMENTS: SavedGeneratedDocument[] = [
  {
    id: 'doc_saved_001',
    templateId: 'tpl_contrato_locacao_residencial',
    title: 'Contrato de Locação Residencial (30 Meses) - Lucas Ferraz Medeiros',
    category: 'CONTRATO_LOCACAO',
    leadId: 'lead_001',
    leadName: 'Lucas Ferraz Medeiros',
    propertyId: 'prop_001',
    propertyCode: 'IMO-101',
    propertyAddress: 'Rua Oscar Freire, 1420 - Ap 82, Jardins, São Paulo/SP',
    ownerId: 'owner_001',
    ownerName: 'Carlos Eduardo Mendonça',
    status: 'ASSINADO',
    version: '1.2',
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-09-15T14:30:00.000Z',
    authorName: 'Juliana Santos (CRECI 198273)',
    digitalSignatureHash: 'a8f5b2c91d4e7f3b8c2e1a90d4f6c7e2b1a8d9e0f3c2b1a4',
    signedAt: '2026-09-15T14:30:00.000Z',
    auditTrail: [
      {
        id: 'aud_1',
        timestamp: '2026-09-10T10:00:00.000Z',
        author: 'Juliana Santos',
        action: 'Minuta gerada e parametrizada com dados do CRM'
      },
      {
        id: 'aud_2',
        timestamp: '2026-09-15T14:30:00.000Z',
        author: 'Portal de Assinatura Digital',
        action: 'Assinatura digital com validade jurídica finalizada por Locador e Locatário'
      }
    ],
    compiledContent: `INSTRUMENTO PARTICULAR DE CONTRATO DE LOCAÇÃO DE IMÓVEL RESIDENCIAL (LEI Nº 8.245/1991)

LOCADOR: Carlos Eduardo Mendonça, brasileiro, casado, empresário, inscrito no CPF/MF sob o nº 123.456.789-00, residente em São Paulo/SP.

LOCATÁRIO: Lucas Ferraz Medeiros, brasileiro, solteiro, engenheiro de software, inscrito no CPF/MF sob o nº 987.654.321-00, telefone (11) 98765-4321, residente e domiciliado na cidade de São Paulo/SP.

INTERMEDIADORA E ADMINISTRADORA: AcertGo Gestão Imobiliária & Soluções Digitais Ltda., inscrita no CNPJ sob o nº 48.912.345/0001-90, CRECI Jurídico nº 39.840-J, com sede na Alameda Lorena, 1420 - 8º andar, Jardins, São Paulo/SP.

As partes acima qualificadas têm entre si, justo e contratado, as seguintes cláusulas:

CLÁUSULA PRIMEIRA - DO OBJETO E DESTINAÇÃO:
O LOCADOR dá em locação ao LOCATÁRIO o imóvel residencial situado na Rua Oscar Freire, 1420 - Ap 82, Bairro Jardins, São Paulo/SP, código de referência IMO-101, destinando-se exclusivamente para fins residenciais unifamiliares (Art. 46 e 47 da Lei nº 8.245/1991).

CLÁUSULA SEGUNDA - DO PRAZO CONTRATUAL:
O prazo da presente locação é de 30 (trinta) meses, iniciando-se em 15 de setembro de 2026 e terminando impreterivelmente em 14 de março de 2029.

CLÁUSULA TERCEIRA - DO VALOR DO ALUGUEL E REAJUSTE:
O aluguel mensal inicial é de R$ 6.500,00 (seis mil e quinhentos reais), com vencimento todo dia 10 de cada mês subsequente ao vencido. O reajuste dar-se-á anualmente com base na variação acumulada do IPCA/IBGE (Art. 18 da Lei nº 8.245/1991).

CLÁUSULA QUARTA - DOS ENCARGOS E DESPESAS CONDOMINIAIS:
O LOCATÁRIO arcará com as despesas ordinárias de condomínio (Art. 23, XII) e contas de consumo próprio (água, luz, gás). As despesas extraordinárias de condomínio (obras estruturais, fundo de reserva, pintura de fachada externa) cabem única e exclusivamente ao LOCADOR (Art. 22, X).

CLÁUSULA QUINTA - DA MULTA RESCISÓRIA PROPORCIONAL:
Em caso de desocupação voluntária antes do termo final, o LOCATÁRIO pagará multa compensatória de 3 (três) aluguéis, calculada de forma rigorosamente PROPORCIONAL ao período restante de cumprimento do contrato (Artigo 4º da Lei nº 8.245/1991).

São Paulo/SP, 15 de setembro de 2026.
Assinado digitalmente com certificado ICP-Brasil / Hash SHA-256 validado.`
  },
  {
    id: 'doc_saved_002',
    templateId: 'tpl_promessa_compra_venda',
    title: 'Compromisso Particular de Compra e Venda - Roberto Alencar Sampaio',
    category: 'CONTRATO_VENDA',
    leadId: 'lead_002',
    leadName: 'Roberto Alencar Sampaio',
    propertyId: 'prop_002',
    propertyCode: 'IMO-303',
    propertyAddress: 'Av. Brigadeiro Faria Lima, 2800 - Cobertura Duplex, Itaim Bibi, São Paulo/SP',
    ownerId: 'owner_002',
    ownerName: 'Dra. Helena Vasconcelos',
    status: 'AGUARDANDO_ASSINATURA',
    version: '1.0',
    createdAt: '2026-10-02T16:00:00.000Z',
    updatedAt: '2026-10-02T16:00:00.000Z',
    authorName: 'Marcos Vinicius (CRECI 214550)',
    auditTrail: [
      {
        id: 'aud_3',
        timestamp: '2026-10-02T16:00:00.000Z',
        author: 'Marcos Vinicius',
        action: 'Minuta gerada com sinal confirmatório de R$ 150.000,00 e enviada para conferência'
      }
    ],
    compiledContent: `INSTRUMENTO PARTICULAR DE COMPROMISSO DE VENDA E COMPRA DE IMÓVEL URBANO

PROMITENTE VENDEDORA: Dra. Helena Vasconcelos, brasileira, médica, inscrita no CPF sob o nº 321.654.987-11, residente na cidade de São Paulo/SP.

PROMISSÁRIO COMPRADOR: Roberto Alencar Sampaio, brasileiro, investidor, inscrito no CPF sob o nº 456.789.123-55, residente em São Paulo/SP.

INTERMEDIADORA: AcertGo Gestão Imobiliária & Soluções Digitais Ltda., CRECI Jurídico nº 39.840-J.

CLÁUSULA PRIMEIRA - DO IMÓVEL:
A VENDEDORA promete vender ao COMPRADOR o imóvel situado na Av. Brigadeiro Faria Lima, 2800 - Cobertura Duplex, Itaim Bibi, São Paulo/SP, código IMO-303, matriculado sob o nº 148.902 junto ao 4º Cartório de Registro de Imóveis da Capital.

CLÁUSULA SEGUNDA - DO PREÇO E CONDIÇÕES DE PAGAMENTO:
O preço total da transação é de R$ 2.850.000,00 (dois milhões, oitocentos e cinquenta mil reais), quitado da seguinte forma:
a) R$ 150.000,00 (cento e cinquenta mil reais) a título de arras confirmatórias (Art. 417 do Código Civil), transferidos via Pix nesta data;
b) R$ 2.700.000,00 (dois milhões e setecentos mil reais) na outorga da Escritura Pública Definitiva de Venda e Compra.

CLÁUSULA TERCEIRA - DA COMISSÃO DE INTERMEDIAÇÃO:
A comissão devida à intermediadora é de 6% (seis por cento) sobre o valor total da venda, sob responsabilidade do Vendedor.

São Paulo/SP, 02 de outubro de 2026.`
  },
  {
    id: 'doc_saved_003',
    templateId: 'tpl_termo_vistoria_creci',
    title: 'Termo de Vistoria de Imóvel com Registro Fotográfico - Mariana Rios',
    category: 'TERMO_VISTORIA',
    leadId: 'lead_003',
    leadName: 'Mariana Rios',
    propertyId: 'prop_003',
    propertyCode: 'IMO-204',
    propertyAddress: 'Rua Harmonia, 500 - Studio 42, Vila Madalena, São Paulo/SP',
    ownerId: 'owner_003',
    ownerName: 'Espólio de Arnaldo Fontes da Silva',
    status: 'APROVADO',
    version: '1.0',
    createdAt: '2026-09-28T11:20:00.000Z',
    updatedAt: '2026-09-28T11:20:00.000Z',
    authorName: 'Lucas Silva (Vistoriador CRECI 24890)',
    auditTrail: [
      {
        id: 'aud_4',
        timestamp: '2026-09-28T11:20:00.000Z',
        author: 'Lucas Silva',
        action: 'Vistoria detalhada de entrada aprovada com 38 fotos em anexo'
      }
    ],
    compiledContent: `LAUDO E TERMO OFICIAL DE VISTORIA DE ENTRADA (CRECI-SP / LEI 8.245/1991)
PARTE INTEGRANTE DO CONTRATO DE LOCAÇÃO

Imóvel Vistoriado: Rua Harmonia, 500 - Studio 42, Vila Madalena, São Paulo/SP
Referência: IMO-204
Locador: Espólio de Arnaldo Fontes da Silva
Locatária: Mariana Rios (CPF: 554.887.992-33)
Vistoriador Responsável: Lucas Silva (CRECI 24890)

DESCRIÇÃO DO ESTADO GERAL DE CONSERVAÇÃO:
1. PINTURA: Paredes e tetos recém-pintados em tinta acrílica fosca cor Branco Neve, sem manchas, trincas ou descascamentos.
2. PISOS E REVESTIMENTOS: Porcelanato retificado 60x60 em perfeito estado de rejunte e conservação, sem peças trincadas.
3. INSTALAÇÕES ELÉTRICAS: Quadro de disjuntores DIN etiquetado, todas as tomadas e interruptores testados e energizados (110V/220V).
4. INSTALAÇÕES HIDRÁULICAS: Torneiras, sifões e bacias sanitárias sem vazamentos; pressão de água regular.
5. ESQUADRIAS E VIDROS: Janelas de alumínio anodizado preto deslizando suavemente; vidros íntegros e sem arranhões.

O LOCATÁRIO declara receber o imóvel nas condições acima, comprometendo-se a restituí-lo no mesmo estado ao término da locação (Art. 23, III da Lei 8.245/91).

São Paulo/SP, 28 de setembro de 2026.`
  }
];

export function getInitialSavedDocumentsFromCache(): SavedGeneratedDocument[] {
  if (typeof window === 'undefined') return DEFAULT_SAVED_GENERATED_DOCUMENTS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SAVED_DOCUMENTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Persistence] Erro ao ler documentos salvos:', e);
  }
  return DEFAULT_SAVED_GENERATED_DOCUMENTS;
}

export async function saveGeneratedDocumentsToStorage(documents: SavedGeneratedDocument[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_SAVED_DOCUMENTS_KEY, JSON.stringify(documents));
  } catch (e) {
    console.warn('[Persistence] Falha ao salvar documentos no localStorage:', e);
  }

  try {
    const docRef = doc(db, 'system_config', 'saved_generated_documents');
    await setDoc(docRef, {
      documents,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    notifySyncListeners('SAVED_DOCUMENTS_SYNC', documents);
  } catch (err) {
    console.warn('[Persistence] Erro ao sincronizar documentos salvos no Firestore:', err);
  }
}




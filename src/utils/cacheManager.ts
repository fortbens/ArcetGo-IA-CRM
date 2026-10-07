/**
 * Cache and Credential Sanitizer Manager
 * Garante que o dispositivo não salve caches obsoletos,
 * force sempre a versão mais atualizada e não deixe credenciais salvas em disco.
 */

export const APP_VERSION = '2026.10.07-v1';
export const APP_BUILD_TIMESTAMP = '2026-10-07T03:00:00Z';

/**
 * Limpa todos os caches do navegador (CacheStorage, Service Workers e dados temporários de sessão).
 */
export async function purgeAllBrowserCaches(): Promise<void> {
  try {
    // 1. Desregistrar todos os Service Workers
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('[CacheManager] ServiceWorker desregistrado com sucesso:', registration.scope);
      }
    }

    // 2. Limpar CacheStorage API
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          console.log('[CacheManager] Deletando CacheStorage:', name);
          return caches.delete(name);
        })
      );
    }

    // 3. Limpar caches temporários de sessão mantendo apenas estados essenciais não sensíveis
    if (typeof window !== 'undefined' && window.sessionStorage) {
      // Remove tokens expirados ou chaves temporárias
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('cache') || key.includes('temp_') || key.includes('draft_login'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => sessionStorage.removeItem(k));
    }

    // 4. Registrar timestamp da última limpeza para controle de versão
    try {
      sessionStorage.setItem('acertgo_last_cache_purge', Date.now().toString());
      sessionStorage.setItem('acertgo_app_version', APP_VERSION);
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('[CacheManager] Aviso ao limpar caches:', err);
  }
}

/**
 * Sanitiza e remove quaisquer credenciais salvas temporariamente na memória ou DOM
 */
export function purgeStoredCredentials(): void {
  try {
    if (typeof window !== 'undefined') {
      // Remove do localStorage e sessionStorage quaisquer referências de credenciais
      const sensitiveKeys = [
        'acertgo_saved_user',
        'acertgo_saved_email',
        'acertgo_saved_password',
        'firebase:authUser',
        'user_token',
        'login_remember'
      ];
      sensitiveKeys.forEach(k => {
        try {
          localStorage.removeItem(k);
          sessionStorage.removeItem(k);
        } catch {
          // ignore
        }
      });
    }
  } catch (e) {
    console.error('[CacheManager] Erro ao sanitizar credenciais:', e);
  }
}

/**
 * Executa a verificação na inicialização da aplicação
 */
export function initializeCacheControl(): void {
  if (typeof window === 'undefined') return;

  const currentVer = sessionStorage.getItem('acertgo_app_version');
  if (currentVer !== APP_VERSION) {
    console.log('[CacheManager] Nova versão detectada. Forçando limpeza de caches...');
    purgeAllBrowserCaches();
  }
}

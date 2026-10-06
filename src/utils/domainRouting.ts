/**
 * Utilitário de Roteamento Inteligente Multi-Domínio (AcertGo Imob)
 * 
 * Arquitetura de Domínios para Hospedagem no cPanel da HomeHost:
 * - Domínio Principal: acertgo.com.br e www.acertgo.com.br -> Página de Vendas (Landing Page Pública)
 * - Subdomínio CRM: aicrm.acertgo.com.br -> Plataforma CRM / ERP (Login & Dashboard)
 */

export const PRODUCTION_DOMAINS = {
  SALES_APEX: 'acertgo.com.br',
  SALES_WWW: 'www.acertgo.com.br',
  CRM_SUBDOMAIN: 'aicrm.acertgo.com.br',
  CRM_URL: 'https://aicrm.acertgo.com.br',
  SALES_URL: 'https://acertgo.com.br',
};

/**
 * Verifica se a requisição atual está no subdomínio do CRM (aicrm.acertgo.com.br)
 */
export function isCrmSubdomain(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Flag de teste e emulação via query string para dev/preview
  if (
    search.includes('domain=aicrm') || 
    search.includes('app=crm') || 
    search.includes('mode=crm') ||
    search.includes('ambiente=crm')
  ) {
    return true;
  }

  return (
    host === PRODUCTION_DOMAINS.CRM_SUBDOMAIN ||
    host.startsWith('aicrm.') ||
    host.startsWith('crm.')
  );
}

/**
 * Verifica se a requisição atual está no domínio da página de vendas (acertgo.com.br / www.acertgo.com.br)
 */
export function isSalesApexDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Flag de teste e emulação via query string
  if (
    search.includes('domain=sales') || 
    search.includes('app=sales') || 
    search.includes('mode=sales') ||
    search.includes('ambiente=vendas')
  ) {
    return true;
  }

  // Se for explicitamente o subdomínio aicrm, não é o domínio de vendas
  if (isCrmSubdomain()) {
    return false;
  }

  return (
    host === PRODUCTION_DOMAINS.SALES_APEX ||
    host === PRODUCTION_DOMAINS.SALES_WWW ||
    (host.endsWith('.acertgo.com.br') && !host.startsWith('aicrm.') && !host.startsWith('crm.'))
  );
}

/**
 * Verifica se a URL contém um caminho ou hash explícito da página de vendas
 */
export function isExplicitSalesPath(): boolean {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname.toLowerCase();
  const h = window.location.hash.toLowerCase();
  const s = window.location.search.toLowerCase();

  return (
    p.startsWith('/vendas') ||
    p.startsWith('/lp') ||
    p.startsWith('/sales') ||
    p.startsWith('/planos') ||
    h.includes('vendas') ||
    h.includes('lp') ||
    h.includes('sales') ||
    h.includes('gestao-leads') ||
    h.includes('erp-splits') ||
    h.includes('calculadora-roi') ||
    h.includes('planos-precos') ||
    h.includes('depoimentos') ||
    h.includes('faq') ||
    h.includes('simulador') ||
    h.includes('cadastro-vip') ||
    s.includes('page=vendas') ||
    s.includes('pagina=vendas') ||
    s.includes('domain=sales')
  );
}

/**
 * Detecção unificada se a rota deve renderizar a página de vendas pública
 */
export function isSalesRouteUrl(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Se estiver no subdomínio do CRM (aicrm.acertgo.com.br)
  if (isCrmSubdomain()) {
    // Só renderiza a landing page de vendas se o usuário digitou explicitamente /vendas ou /lp
    return isExplicitSalesPath();
  }

  // 2. Se estiver no domínio de vendas acertgo.com.br ou www.acertgo.com.br
  if (isSalesApexDomain()) {
    const p = window.location.pathname.toLowerCase();
    // Se o usuário digitou explicitamente /crm, /login ou /painel, não força a landing page
    if (p.startsWith('/crm') || p.startsWith('/login') || p.startsWith('/painel') || p.startsWith('/app')) {
      return false;
    }
    // Caso padrão na raiz do domínio principal: SEMPRE exibe a Página de Vendas!
    return true;
  }

  // 3. Ambiente local / preview do AI Studio: ativa quando acessado via /vendas ou query
  return isExplicitSalesPath();
}

/**
 * Obtém a URL de destino do CRM (aicrm.acertgo.com.br)
 */
export function getCrmDestinationUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('acertgo.com.br')) {
      return PRODUCTION_DOMAINS.CRM_URL;
    }
  }
  return '/';
}

/**
 * Obtém a URL de destino da Página de Vendas (acertgo.com.br)
 */
export function getSalesDestinationUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('acertgo.com.br')) {
      return PRODUCTION_DOMAINS.SALES_URL;
    }
  }
  return '/vendas';
}

/**
 * Navega para o CRM (redireciona para https://aicrm.acertgo.com.br quando em produção)
 */
export function navigateToCrm(fallbackFn?: () => void) {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('acertgo.com.br') && !isCrmSubdomain()) {
      window.location.href = PRODUCTION_DOMAINS.CRM_URL;
      return;
    }
  }
  if (fallbackFn) {
    fallbackFn();
  }
}

/**
 * Navega para a Página de Vendas (redireciona para https://acertgo.com.br quando em produção)
 */
export function navigateToSales(fallbackFn?: () => void) {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('acertgo.com.br') && isCrmSubdomain()) {
      window.location.href = PRODUCTION_DOMAINS.SALES_URL;
      return;
    }
  }
  if (fallbackFn) {
    fallbackFn();
  }
}

import { NavTabId } from '../components/common/Sidebar';

export interface NavigationStepEntry {
  id: string;
  tab: NavTabId;
  tabLabel: string;
  subStep?: string;
  subStepLabel?: string;
  modalId?: string;
  modalLabel?: string;
  timestamp: number;
}

export const TAB_LABELS: Record<NavTabId, string> = {
  executive_dashboard: 'Dashboard Diretoria',
  notifications_center: 'Central de Notificações',
  super_admin: 'Super Admin SaaS',
  financial_erp: 'Financeiro & ERP',
  nfse_homologacao: 'NFS-e & Fiscal',
  dimob: 'DIMOB & Receita',
  sales_proposals: 'Propostas de Venda',
  roleta: 'Roleta 24/7 & Plantão',
  whatsapp_desk: 'Atendimento WhatsApp',
  kanban: 'Funil Kanban',
  leads_list: 'Lista de Leads',
  roteiro_visitas: 'Roteiro de Visitas',
  indique_ganhe: 'Indique & Ganhe',
  customer_portal: 'Portal do Cliente',
  imoveis: 'Imóveis & Vendas',
  ptam_reports: 'Avaliação PTAM (CRECI)',
  proprietarios: 'Proprietários',
  sales_mirror: 'Espelho de Vendas',
  portals_sites: 'Portais Imobiliários',
  sites_modelos: 'Modelos de Sites',
  integracoes: 'Hub de Integrações',
  external_partner: 'Parceiros Externos',
  fintech_split: 'Split & Fintech',
  contracts: 'Contratos de Locação',
  document_templates: 'Gerador de Minutas',
  digital_signature: 'Assinatura Digital',
  inspections_keys: 'Vistorias & Chaves',
  commissions_rpa: 'Comissões & RPA',
  cca_banking: 'Crédito Imobiliário CCA',
  bi_performance: 'BI & Performance',
  human_resources: 'Recursos Humanos',
  brand_equity: 'Brand Equity & Marca',
  fleet_assets: 'Frota & Patrimônio',
  gamification: 'Gamificação & Metas',
  tv_ranking: 'Painel TV Salão de Vendas',
  corporate_academy: 'Universidade Corporativa',
  legal_sac: 'Jurídico & Compliance',
  central_ajuda_sac: 'Central de Ajuda & SAC',
  team_permissions: 'Equipe & Permissões',
  agency_governance: 'Regras da Imobiliária',
  sales_landing_page: 'Página de Vendas',
  marketing_ia: 'Marketing IA Studio',
  migration_backup: 'Migração & Backups'
};

export const getTabLabel = (tab: NavTabId): string => {
  return TAB_LABELS[tab] || 'Módulo do Sistema';
};

export const createInitialStep = (tab: NavTabId = 'executive_dashboard'): NavigationStepEntry => ({
  id: `nav_step_${Date.now()}_0`,
  tab,
  tabLabel: getTabLabel(tab),
  timestamp: Date.now()
});

export const MAX_HISTORY_LENGTH = 50;

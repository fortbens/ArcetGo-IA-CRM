/**
 * Utilitário de Exportação e Download Seguro de Banco de Dados para Administradores de Imobiliárias
 * Permite ao gestor/administrador baixar com 1 clique todo o banco de dados da sua instância exclusiva.
 */

export interface DownloadTenantDatabaseBackupParams {
  tenantName: string;
  tenantId?: string;
  userName?: string;
  userEmail?: string;
  leads?: any[];
  properties?: any[];
  owners?: any[];
  contracts?: any[];
  commissions?: any[];
  ccaProposals?: any[];
  queues?: any[];
  themeConfig?: any;
}

export interface BackupDownloadResult {
  success: boolean;
  fileName: string;
  totalRecords: number;
  sizeKb: number;
}

export function downloadTenantDatabaseBackup(
  params: DownloadTenantDatabaseBackupParams
): BackupDownloadResult {
  const {
    tenantName,
    tenantId = 'default_tenant',
    userName = 'Administrador',
    userEmail = '',
    leads = [],
    properties = [],
    owners = [],
    contracts = [],
    commissions = [],
    ccaProposals = [],
    queues = [],
    themeConfig = null
  } = params;

  const now = new Date();
  const dateFormatted = now.toISOString().slice(0, 10);
  const timeFormatted = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  const tenantSlug = tenantName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 30);

  const fileName = `backup_banco_${tenantSlug}_${dateFormatted}_${timeFormatted}.json`;

  const totalRecords =
    leads.length +
    properties.length +
    owners.length +
    contracts.length +
    commissions.length +
    ccaProposals.length +
    queues.length;

  const backupPayload = {
    metadata: {
      platform: 'AcertGo OS · CRM ERP Fintech Multitenant',
      tenantId,
      tenantName,
      exportedAt: now.toISOString(),
      exportedAtFormatted: now.toLocaleString('pt-BR'),
      exportedBy: {
        name: userName,
        email: userEmail
      },
      version: '4.8.0',
      totalRecords,
      modulesIncluded: [
        'leads_clientes',
        'estoque_imoveis',
        'proprietarios',
        'contratos_locacao',
        'comissoes_financeiro',
        'propostas_cca',
        'roleta_atendimento',
        'configuracoes_visuais'
      ]
    },
    data: {
      leads,
      properties,
      owners,
      rentalContracts: contracts,
      commissions,
      ccaProposals,
      queues,
      branding: themeConfig
    }
  };

  const jsonContent = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const sizeKb = Math.round(blob.size / 1024);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return {
    success: true,
    fileName,
    totalRecords,
    sizeKb
  };
}

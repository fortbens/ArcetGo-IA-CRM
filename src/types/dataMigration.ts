export type OriginCrmType = 
  | 'EXCEL_SHEETS'
  | 'CSV_PADRAO'
  | 'SISTEMA_IMOBILIARIO'
  | 'LANCAMENTOS_STAND'
  | 'INBOUND_LEADS'
  | 'CRM_CORPORATIVO'
  | 'GENERIC_CSV';

export interface CrmFieldMapping {
  sourceColumn: string;
  targetField: string;
  sampleValue: string;
  required: boolean;
}

export interface MigrationLogItem {
  id: string;
  timestamp: string;
  originCrm: string;
  fileName: string;
  totalRows: number;
  importedCount: number;
  duplicateMergedCount: number;
  errorCount: number;
  status: 'SUCCESS' | 'PARTIAL' | 'ERROR';
  details: string;
}

export interface BackupHistoryItem {
  id: string;
  fileName: string;
  generatedAt: string;
  format: 'CSV' | 'XML' | 'JSON';
  sizeKb: number;
  modulesIncluded: string[];
  totalRecords: number;
  checksumMd5: string;
}

export interface DatabaseExportFilter {
  modules: {
    leadsClients: boolean;
    properties: boolean;
    owners: boolean;
    contracts: boolean;
    commissionsFinance: boolean;
  };
  format: 'CSV' | 'XML';
  dateRange: 'ALL' | 'LAST_30_DAYS' | 'LAST_90_DAYS' | 'CURRENT_YEAR';
  statusFilter: 'ALL' | 'ACTIVE_ONLY';
}

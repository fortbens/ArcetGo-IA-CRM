import { 
  OriginCrmType, 
  CrmFieldMapping, 
  MigrationLogItem, 
  BackupHistoryItem 
} from '../types/dataMigration';

export const CRM_PRESET_TEMPLATES: Record<OriginCrmType, { name: string; tag: string; description: string; mappings: CrmFieldMapping[] }> = {
  EXCEL_SHEETS: {
    name: 'Planilhas Excel & Google Sheets',
    tag: 'Mais Popular',
    description: 'Importação automática de contatos, clientes compradores/locatários, imóveis favoritos e notas de atendimento em formato CSV.',
    mappings: [
      { sourceColumn: 'Nome_Cliente', targetField: 'name', sampleValue: 'Guilherme Albuquerque', required: true },
      { sourceColumn: 'Telefone_Celular', targetField: 'phone', sampleValue: '(11) 98765-4321', required: true },
      { sourceColumn: 'Email_Principal', targetField: 'email', sampleValue: 'guilherme@albuquerque.adv.br', required: false },
      { sourceColumn: 'CPF_CNPJ', targetField: 'document', sampleValue: '341.890.128-44', required: false },
      { sourceColumn: 'Origem_Midia', targetField: 'source', sampleValue: 'ZAP Imóveis', required: false },
      { sourceColumn: 'Interesse_Tipo', targetField: 'interestType', sampleValue: 'COMPRA', required: false },
      { sourceColumn: 'Imovel_Codigo', targetField: 'propertyOfInterestTitle', sampleValue: 'AP-JARDINS-402', required: false },
      { sourceColumn: 'Faixa_Valor_Max', targetField: 'budgetMax', sampleValue: '2500000', required: false },
      { sourceColumn: 'Etapa_Funil', targetField: 'stage', sampleValue: 'Visita Agendada', required: false },
      { sourceColumn: 'Corretor_Responsavel', targetField: 'assignedBrokerName', sampleValue: 'Lucas Sampaio', required: false },
      { sourceColumn: 'Historico_Anotacoes', targetField: 'notes', sampleValue: 'Cliente procura cobertura com 3 vagas demarcadas.', required: false }
    ]
  },
  SISTEMA_IMOBILIARIO: {
    name: 'Exportação de Sistema Imobiliário Anterior',
    tag: 'Migração Completa',
    description: 'Migração de carteira de clientes, leads de plantão e propostas registradas no sistema anterior.',
    mappings: [
      { sourceColumn: 'Cliente_NomeCompleto', targetField: 'name', sampleValue: 'Dra. Beatriz Fontana', required: true },
      { sourceColumn: 'WhatsApp_Contato', targetField: 'phone', sampleValue: '(11) 99123-4567', required: true },
      { sourceColumn: 'Email_Corporativo', targetField: 'email', sampleValue: 'beatriz@fontana.med.br', required: false },
      { sourceColumn: 'Canal_Captacao', targetField: 'source', sampleValue: 'Portal de Anúncios', required: false },
      { sourceColumn: 'Finalidade', targetField: 'interestType', sampleValue: 'LOCACAO', required: false },
      { sourceColumn: 'Imovel_Ref', targetField: 'propertyOfInterestTitle', sampleValue: 'Casa Alphaville 02', required: false },
      { sourceColumn: 'Valor_Pretendido', targetField: 'budgetMax', sampleValue: '12000', required: false },
      { sourceColumn: 'Fase_Atendimento', targetField: 'stage', sampleValue: 'Proposta em Análise', required: false },
      { sourceColumn: 'Corretor_Agente', targetField: 'assignedBrokerName', sampleValue: 'Juliana Mendes', required: false },
      { sourceColumn: 'Observacoes_Gerais', targetField: 'notes', sampleValue: 'Família com 2 pets, precisa de quintal amplo.', required: false }
    ]
  },
  CSV_PADRAO: {
    name: 'Arquivo CSV Padronizado (Locação & Vendas)',
    tag: 'Locação & Vendas',
    description: 'Importação de locatários, fiadores, pretendentes e histórico de atendimento em planilha padronizada.',
    mappings: [
      { sourceColumn: 'Nome_RazaoSocial', targetField: 'name', sampleValue: 'Engenharia Santos & Cia', required: true },
      { sourceColumn: 'Telefone_Comercial', targetField: 'phone', sampleValue: '(11) 97654-3210', required: true },
      { sourceColumn: 'Email', targetField: 'email', sampleValue: 'comercial@santosengenharia.com', required: false },
      { sourceColumn: 'Origem', targetField: 'source', sampleValue: 'Site Próprio', required: false },
      { sourceColumn: 'Tipo_Transacao', targetField: 'interestType', sampleValue: 'COMPRA', required: false },
      { sourceColumn: 'Imovel_Alvo', targetField: 'propertyOfInterestTitle', sampleValue: 'Conjunto Comercial Faria Lima', required: false },
      { sourceColumn: 'Valor_Investimento', targetField: 'budgetMax', sampleValue: '4800000', required: false },
      { sourceColumn: 'Status_Lead', targetField: 'stage', sampleValue: 'Negociação', required: false },
      { sourceColumn: 'Responsavel', targetField: 'assignedBrokerName', sampleValue: 'Roberto Silveira', required: false }
    ]
  },
  LANCAMENTOS_STAND: {
    name: 'Plantão de Lançamentos & Incorporação',
    tag: 'Lançamentos',
    description: 'Especialista em lançamentos imobiliários, espelho de vendas, stands e atribuição de corretores parceiros.',
    mappings: [
      { sourceColumn: 'Nome_Lead', targetField: 'name', sampleValue: 'Dr. Paulo Victor Ramos', required: true },
      { sourceColumn: 'Telefone_Celular', targetField: 'phone', sampleValue: '(11) 98111-2233', required: true },
      { sourceColumn: 'Email', targetField: 'email', sampleValue: 'paulovictor@ramos.com.br', required: false },
      { sourceColumn: 'Midia_Origem', targetField: 'source', sampleValue: 'Instagram Meta Ads', required: false },
      { sourceColumn: 'Empreendimento_Interesse', targetField: 'propertyOfInterestTitle', sampleValue: 'Jardins Sky Lounge (Torre A)', required: false },
      { sourceColumn: 'Potencial_Compra', targetField: 'budgetMax', sampleValue: '3200000', required: false },
      { sourceColumn: 'Status_Atendimento', targetField: 'stage', sampleValue: 'Visita Feita', required: false },
      { sourceColumn: 'Corretor_Stand', targetField: 'assignedBrokerName', sampleValue: 'Lucas Sampaio', required: false }
    ]
  },
  INBOUND_LEADS: {
    name: 'Inbound Leads / Tráfego Pago & Webhooks',
    tag: 'Inbound Leads',
    description: 'Conversão de leads qualificados, landing pages, Meta Ads e histórico de pontuação de lead scoring.',
    mappings: [
      { sourceColumn: 'Nome', targetField: 'name', sampleValue: 'Mariana Duarte', required: true },
      { sourceColumn: 'Telefone', targetField: 'phone', sampleValue: '(11) 99888-4455', required: true },
      { sourceColumn: 'Email', targetField: 'email', sampleValue: 'mariana.duarte@design.art.br', required: false },
      { sourceColumn: 'Conversao_Origem', targetField: 'source', sampleValue: 'Google Ads', required: false },
      { sourceColumn: 'Interesse', targetField: 'interestType', sampleValue: 'COMPRA', required: false },
      { sourceColumn: 'Produto_Alvo', targetField: 'propertyOfInterestTitle', sampleValue: 'Studio Pinheiros Design', required: false },
      { sourceColumn: 'Orcamento_Estimado', targetField: 'budgetMax', sampleValue: '650000', required: false },
      { sourceColumn: 'Etapa_Funil', targetField: 'stage', sampleValue: 'Primeiro Contato', required: false },
      { sourceColumn: 'Dono_Lead', targetField: 'assignedBrokerName', sampleValue: 'Fernanda Castro', required: false }
    ]
  },
  CRM_CORPORATIVO: {
    name: 'CRM Corporativo / Padrão Internacional',
    tag: 'Global',
    description: 'Padrão internacional com campos customizados, tags de ciclo de vida e histórico completo de e-mails.',
    mappings: [
      { sourceColumn: 'First_Name_Last_Name', targetField: 'name', sampleValue: 'Alexander Vance', required: true },
      { sourceColumn: 'Phone_Number', targetField: 'phone', sampleValue: '(11) 98777-6655', required: true },
      { sourceColumn: 'Email', targetField: 'email', sampleValue: 'alexander.vance@techcorp.io', required: false },
      { sourceColumn: 'Lead_Source', targetField: 'source', sampleValue: 'Indicação / Parceiro', required: false },
      { sourceColumn: 'Deal_Stage', targetField: 'stage', sampleValue: 'Negociação', required: false },
      { sourceColumn: 'Contact_Owner', targetField: 'assignedBrokerName', sampleValue: 'Juliana Mendes', required: false }
    ]
  },
  GENERIC_CSV: {
    name: 'Planilha Excel / CSV Genérico',
    tag: 'Arquivo Livre',
    description: 'Importe qualquer arquivo .csv ou .xlsx. O assistente mapeia automaticamente as colunas correspondentes.',
    mappings: [
      { sourceColumn: 'Nome', targetField: 'name', sampleValue: 'Nome do Cliente', required: true },
      { sourceColumn: 'Telefone', targetField: 'phone', sampleValue: '(00) 00000-0000', required: true },
      { sourceColumn: 'E-mail', targetField: 'email', sampleValue: 'cliente@exemplo.com', required: false },
      { sourceColumn: 'Origem', targetField: 'source', sampleValue: 'ZAP / Meta / Site', required: false },
      { sourceColumn: 'Tipo (Compra/Locação)', targetField: 'interestType', sampleValue: 'COMPRA', required: false },
      { sourceColumn: 'Imóvel de Interesse', targetField: 'propertyOfInterestTitle', sampleValue: 'Nome ou Código', required: false },
      { sourceColumn: 'Valor Máximo', targetField: 'budgetMax', sampleValue: '1500000', required: false },
      { sourceColumn: 'Fase do Funil', targetField: 'stage', sampleValue: 'Primeiro Contato', required: false },
      { sourceColumn: 'Corretor', targetField: 'assignedBrokerName', sampleValue: 'Nome do Corretor', required: false },
      { sourceColumn: 'Anotações', targetField: 'notes', sampleValue: 'Histórico e detalhes', required: false }
    ]
  }
};

export const INITIAL_MIGRATION_LOGS: MigrationLogItem[] = [
  {
    id: 'mig_001',
    timestamp: '2026-09-26 18:40',
    originCrm: 'Planilha Excel (CSV)',
    fileName: 'export_clientes_setembro.csv',
    totalRows: 248,
    importedCount: 236,
    duplicateMergedCount: 12,
    errorCount: 0,
    status: 'SUCCESS',
    details: '236 novos leads adicionados à roleta e 12 clientes existentes atualizados por telefone duplicado.'
  },
  {
    id: 'mig_002',
    timestamp: '2026-09-24 11:15',
    originCrm: 'Sistema Imobiliário Anterior',
    fileName: 'leads_export_stand_jardins.xlsx',
    totalRows: 95,
    importedCount: 91,
    duplicateMergedCount: 4,
    errorCount: 0,
    status: 'SUCCESS',
    details: '91 leads de alto padrão distribuídos entre a equipe Jardins.'
  },
  {
    id: 'mig_003',
    timestamp: '2026-09-20 15:30',
    originCrm: 'Planilha Excel Genérica',
    fileName: 'contatos_carteira_antiga_diretoria.csv',
    totalRows: 150,
    importedCount: 148,
    duplicateMergedCount: 2,
    errorCount: 0,
    status: 'SUCCESS',
    details: 'Contatos legados importados com tag "Ex-Clientes" para re-ativação comercial.'
  }
];

export const INITIAL_BACKUP_HISTORY: BackupHistoryItem[] = [
  {
    id: 'bak_001',
    fileName: 'backup_full_acertimob_2026-09-27.xml',
    generatedAt: '2026-09-27 03:30',
    format: 'XML',
    sizeKb: 4820,
    modulesIncluded: ['Clientes & Leads (CRM)', 'Estoque de Imóveis', 'Proprietários & Splits', 'Contratos de Locação', 'Histórico Financeiro'],
    totalRecords: 1240,
    checksumMd5: 'e2fc714c4727ee9395f324cd2e7f331f'
  },
  {
    id: 'bak_002',
    fileName: 'backup_full_acertimob_2026-09-27.csv',
    generatedAt: '2026-09-27 03:28',
    format: 'CSV',
    sizeKb: 3150,
    modulesIncluded: ['Clientes & Leads (CRM)', 'Estoque de Imóveis', 'Proprietários & Splits', 'Contratos de Locação'],
    totalRecords: 1240,
    checksumMd5: '9b3f090e72251268b6da93a2e37943c2'
  },
  {
    id: 'bak_003',
    fileName: 'backup_clientes_leads_2026-09-20.csv',
    generatedAt: '2026-09-20 23:59',
    format: 'CSV',
    sizeKb: 1420,
    modulesIncluded: ['Clientes & Leads (CRM)'],
    totalRecords: 680,
    checksumMd5: '6c1488c9f53852084c8a29e4726ebef9'
  }
];

export type DocumentCategory = 
  | 'CONTRATO_VENDA' 
  | 'CONTRATO_LOCACAO' 
  | 'RECIBO' 
  | 'TERMO_VISTORIA' 
  | 'DECLARACAO' 
  | 'AUTORIZACAO' 
  | 'NOTIFICACAO';

export type DocumentLifecycleStatus = 
  | 'RASCUNHO' 
  | 'EM_REVISAO' 
  | 'APROVADO' 
  | 'AGUARDANDO_ASSINATURA' 
  | 'ASSINADO' 
  | 'ARQUIVADO';

export interface DocumentAuditEntry {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  note?: string;
}

export interface DocumentTemplateItem {
  id: string;
  category: DocumentCategory;
  title: string;
  tagline: string;
  bodyContent: string;
  variables: string[];
  isCustomUploaded?: boolean;
  version?: string;
  status?: DocumentLifecycleStatus;
  updatedAt?: string;
  updatedBy?: string;
  auditTrail?: DocumentAuditEntry[];
  signerCount?: number;
  digitalSignatureHash?: string;
}

export interface SavedGeneratedDocument {
  id: string;
  templateId: string;
  title: string;
  category: DocumentCategory;
  compiledContent: string;
  leadId?: string;
  leadName?: string;
  propertyId?: string;
  propertyCode?: string;
  propertyAddress?: string;
  ownerId?: string;
  ownerName?: string;
  status: DocumentLifecycleStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  auditTrail: DocumentAuditEntry[];
  digitalSignatureHash?: string;
  signedAt?: string;
}

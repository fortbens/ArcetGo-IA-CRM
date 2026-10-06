export type SignatureProviderId = 
  | 'clicksign' 
  | 'd4sign' 
  | 'zapsign' 
  | 'docusign' 
  | 'autentique' 
  | 'certisign';

export interface SignatureProviderInfo {
  id: SignatureProviderId;
  name: string;
  badge: string;
  logoColor: string;
  description: string;
  supportsWhatsApp: boolean;
  supportsIcpBrasil: boolean;
  supportsSelfie: boolean;
  isConfigured: boolean;
  apiDocsUrl: string;
  monthlyQuota: {
    used: number;
    total: number;
  };
}

export const SIGNATURE_PROVIDERS: SignatureProviderInfo[] = [
  {
    id: 'clicksign',
    name: 'Clicksign',
    badge: 'Líder Imobiliário',
    logoColor: 'from-blue-600 to-indigo-700',
    description: 'Padrão de mercado para contratos imobiliários no Brasil. Validade jurídica completa conforme MP 2.200-2/2001 e Lei 14.063/2020.',
    supportsWhatsApp: true,
    supportsIcpBrasil: true,
    supportsSelfie: true,
    isConfigured: true,
    apiDocsUrl: 'https://developers.clicksign.com',
    monthlyQuota: { used: 48, total: 200 }
  },
  {
    id: 'd4sign',
    name: 'D4Sign',
    badge: 'Pix & Biometria',
    logoColor: 'from-emerald-600 to-teal-700',
    description: 'Autenticação avançada com Pix R$ 0,01 para prova cabal de titularidade bancária, WhatsApp nativo e biometria facial.',
    supportsWhatsApp: true,
    supportsIcpBrasil: true,
    supportsSelfie: true,
    isConfigured: true,
    apiDocsUrl: 'https://docs.d4sign.com.br',
    monthlyQuota: { used: 35, total: 150 }
  },
  {
    id: 'zapsign',
    name: 'ZapSign',
    badge: '100% WhatsApp',
    logoColor: 'from-green-600 to-emerald-700',
    description: 'Envio direto pelo WhatsApp com taxa de conversão recorde e assinatura em menos de 2 minutos pelo smartphone.',
    supportsWhatsApp: true,
    supportsIcpBrasil: false,
    supportsSelfie: true,
    isConfigured: true,
    apiDocsUrl: 'https://docs.zapsign.com.br',
    monthlyQuota: { used: 62, total: 300 }
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    badge: 'Padrão Global',
    logoColor: 'from-amber-600 to-orange-700',
    description: 'Infraestrutura global corporativa com integração eSignature REST API, compliance internacional e alta disponibilidade.',
    supportsWhatsApp: false,
    supportsIcpBrasil: true,
    supportsSelfie: false,
    isConfigured: true,
    apiDocsUrl: 'https://developers.docusign.com',
    monthlyQuota: { used: 14, total: 50 }
  },
  {
    id: 'autentique',
    name: 'Autentique',
    badge: 'API Ágil BR',
    logoColor: 'from-purple-600 to-pink-600',
    description: 'Plataforma nacional com API GraphQL e REST moderna, rubrica em todas as páginas e excelente custo-benefício.',
    supportsWhatsApp: true,
    supportsIcpBrasil: true,
    supportsSelfie: true,
    isConfigured: false,
    apiDocsUrl: 'https://docs.autentique.com.br',
    monthlyQuota: { used: 0, total: 100 }
  },
  {
    id: 'certisign',
    name: 'CertiSign TermSigner',
    badge: 'ICP-Brasil Qualificada',
    logoColor: 'from-cyan-600 to-blue-800',
    description: 'Autoridade Certificadora brasileira para assinaturas digitais com e-CPF, e-CNPJ e carimbo do tempo oficial.',
    supportsWhatsApp: false,
    supportsIcpBrasil: true,
    supportsSelfie: false,
    isConfigured: true,
    apiDocsUrl: 'https://www.certisign.com.br/desenvolvedores',
    monthlyQuota: { used: 8, total: 50 }
  }
];

export type DocumentType = 
  | 'PROMESSA_COMPRA_VENDA'
  | 'CONTRATO_LOCACAO'
  | 'OPCAO_VENDA_EXCLUSIVIDADE'
  | 'FICHA_VISITA_DIGITAL'
  | 'TERMO_VISTORIA_CHAVES'
  | 'ADITIVO_CONTRATUAL'
  | 'DISTRATO';

export type SignerRole = 
  | 'COMPRADOR'
  | 'VENDEDOR'
  | 'LOCATARIO'
  | 'LOCADOR'
  | 'FIADOR'
  | 'CORRETOR'
  | 'TESTEMUNHA'
  | 'DIRETOR_IMOBILIARIA';

export type AuthMethod = 
  | 'WHATSAPP_TOKEN'
  | 'SMS_TOKEN'
  | 'EMAIL_LINK'
  | 'SELFIE_COM_DOCUMENTO'
  | 'CERTIFICADO_ICP_BRASIL'
  | 'PIX_TITULARIDADE';

export type SignerStatus = 
  | 'PENDENTE'
  | 'VISUALIZADO'
  | 'ASSINADO'
  | 'RECUSADO';

export interface DocumentSigner {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: SignerRole;
  authMethod: AuthMethod;
  status: SignerStatus;
  signedAt?: string;
  signatureUrl?: string;
  ipAddress?: string;
  viewedAt?: string;
  signatureEvidence?: {
    geoLatitude?: number;
    geoLongitude?: number;
    authDetails?: string;
  };
}

export type EnvelopeStatus = 
  | 'RASCUNHO'
  | 'ENVIADO'
  | 'AGUARDANDO_ASSINATURAS'
  | 'CONCLUIDO'
  | 'RECUSADO'
  | 'EXPIRADO';

export interface DigitalDocumentEnvelope {
  id: string;
  envelopeCode: string;
  title: string;
  documentType: DocumentType;
  provider: SignatureProviderId;
  propertyCode?: string;
  propertyTitle?: string;
  clientOrDealName?: string;
  status: EnvelopeStatus;
  createdAt: string;
  expiresAt: string;
  completedAt?: string;
  signers: DocumentSigner[];
  pdfPagesCount: number;
  pdfFileSize: string;
  auditTrail: {
    timestamp: string;
    action: string;
    details: string;
  }[];
  notes?: string;
  originalPdfUrl?: string;
  signedPdfUrl?: string;
}

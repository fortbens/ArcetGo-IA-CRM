import { DigitalDocumentEnvelope } from '../types/digitalSignature';

export const INITIAL_DIGITAL_ENVELOPES: DigitalDocumentEnvelope[] = [
  {
    id: 'env_01',
    envelopeCode: 'DOC-CS-2026-9041',
    title: 'Contrato de Promessa de Compra e Venda - Apto 142 Horizon',
    documentType: 'PROMESSA_COMPRA_VENDA',
    provider: 'clicksign',
    propertyCode: 'AP-9021',
    propertyTitle: 'Residencial Horizon Jardins - Apto 142',
    clientOrDealName: 'Dr. Roberto Silveira Campos',
    status: 'AGUARDANDO_ASSINATURAS',
    createdAt: '2026-09-24T10:00:00Z',
    expiresAt: '2026-10-01T23:59:59Z',
    pdfPagesCount: 18,
    pdfFileSize: '2.4 MB',
    signers: [
      {
        id: 'sig_1',
        name: 'Roberto Silveira Campos',
        email: 'roberto.silveira@advocacia.com.br',
        phone: '(11) 98721-0091',
        cpf: '129.481.029-33',
        role: 'COMPRADOR',
        authMethod: 'WHATSAPP_TOKEN',
        status: 'ASSINADO',
        signedAt: '2026-09-24T14:15:22Z',
        ipAddress: '177.132.89.21',
        viewedAt: '2026-09-24T14:10:00Z',
        signatureEvidence: {
          geoLatitude: -23.561684,
          geoLongitude: -46.655981,
          authDetails: 'Token SMS/WhatsApp validado via Clicksign API'
        }
      },
      {
        id: 'sig_2',
        name: 'Helena Ribeiro Castro Campos',
        email: 'helena.campos@gmail.com',
        phone: '(11) 98721-0092',
        cpf: '241.982.381-00',
        role: 'COMPRADOR',
        authMethod: 'WHATSAPP_TOKEN',
        status: 'VISUALIZADO',
        viewedAt: '2026-09-25T09:40:00Z'
      },
      {
        id: 'sig_3',
        name: 'Marcos Vinicius de Andrade (Vendedor)',
        email: 'marcos.andrade@holding.com.br',
        phone: '(11) 99123-4567',
        cpf: '098.765.432-11',
        role: 'VENDEDOR',
        authMethod: 'CERTIFICADO_ICP_BRASIL',
        status: 'PENDENTE'
      },
      {
        id: 'sig_4',
        name: 'Ricardo Alencar',
        email: 'ricardo.alencar@acertgo.com.br',
        phone: '(11) 98877-6655',
        cpf: '234.819.201-99',
        role: 'CORRETOR',
        authMethod: 'EMAIL_LINK',
        status: 'ASSINADO',
        signedAt: '2026-09-24T10:30:00Z',
        ipAddress: '189.120.40.12'
      },
      {
        id: 'sig_5',
        name: 'Dr. Paulo Carneiro (Diretor)',
        email: 'diretorcarneiro@acertgo.com.br',
        phone: '(11) 99999-8888',
        cpf: '001.002.003-04',
        role: 'DIRETOR_IMOBILIARIA',
        authMethod: 'WHATSAPP_TOKEN',
        status: 'ASSINADO',
        signedAt: '2026-09-24T11:05:00Z',
        ipAddress: '189.120.40.12'
      }
    ],
    auditTrail: [
      { timestamp: '24/09/2026 10:00', action: 'Envelope Criado', details: 'Documento gerado e enviado via Clicksign API v2' },
      { timestamp: '24/09/2026 10:30', action: 'Assinatura Registrada', details: 'Corretor Ricardo Alencar assinou via Link de E-mail' },
      { timestamp: '24/09/2026 11:05', action: 'Assinatura Registrada', details: 'Diretor Paulo Carneiro assinou via Token WhatsApp' },
      { timestamp: '24/09/2026 14:15', action: 'Assinatura Registrada', details: 'Comprador Roberto Silveira assinou com geolocalização e selfie' },
      { timestamp: '25/09/2026 09:40', action: 'Documento Visualizado', details: 'Helena Campos abriu o contrato pelo smartphone' }
    ]
  },
  {
    id: 'env_02',
    envelopeCode: 'DOC-D4S-2026-7782',
    title: 'Contrato de Locação Residencial com Garantia CredPago - Apto 82 Jardins',
    documentType: 'CONTRATO_LOCACAO',
    provider: 'd4sign',
    propertyCode: 'AP-5520',
    propertyTitle: 'Edifício Villa d’Este - Jardins',
    clientOrDealName: 'Lucas Ferreira Guimarães',
    status: 'CONCLUIDO',
    createdAt: '2026-09-20T11:00:00Z',
    expiresAt: '2026-09-27T23:59:59Z',
    completedAt: '2026-09-22T16:45:00Z',
    pdfPagesCount: 12,
    pdfFileSize: '1.8 MB',
    signers: [
      {
        id: 'sig_11',
        name: 'Lucas Ferreira Guimarães',
        email: 'lucas.guimaraes@techcorp.com',
        phone: '(11) 97766-5544',
        cpf: '332.190.871-44',
        role: 'LOCATARIO',
        authMethod: 'PIX_TITULARIDADE',
        status: 'ASSINADO',
        signedAt: '2026-09-21T18:30:10Z',
        ipAddress: '179.182.20.9',
        signatureEvidence: {
          authDetails: 'Autenticado via Pix R$ 0,01 Banco Inter D4Sign Titularidade'
        }
      },
      {
        id: 'sig_12',
        name: 'Dra. Beatriz Toledo Barreto',
        email: 'beatriz.barreto@uol.com.br',
        phone: '(11) 98112-3344',
        cpf: '119.283.471-90',
        role: 'LOCADOR',
        authMethod: 'WHATSAPP_TOKEN',
        status: 'ASSINADO',
        signedAt: '2026-09-22T16:45:00Z',
        ipAddress: '201.89.12.44'
      }
    ],
    auditTrail: [
      { timestamp: '20/09/2026 11:00', action: 'Envelope Enviado', details: 'D4Sign Webhook disparou links via WhatsApp e E-mail' },
      { timestamp: '21/09/2026 18:30', action: 'Assinado pelo Locatário', details: 'Validação bancária por Pix Titularidade concluída' },
      { timestamp: '22/09/2026 16:45', action: 'Assinado pela Locadora', details: 'Autenticação por biometria facial facial-match 99.8%' },
      { timestamp: '22/09/2026 16:46', action: 'Envelope Concluído', details: 'Certificado de Conformidade gerado com Carimbo do Tempo ICP-Brasil' }
    ]
  },
  {
    id: 'env_03',
    envelopeCode: 'DOC-ZAP-2026-3391',
    title: 'Autorização de Venda com Exclusividade (Opção 120 Dias) - Casa Morumbi',
    documentType: 'OPCAO_VENDA_EXCLUSIVIDADE',
    provider: 'zapsign',
    propertyCode: 'CS-7719',
    propertyTitle: 'Casa Contemporânea Morumbi - 650m²',
    clientOrDealName: 'Eng. Sergio Murilo Brandão',
    status: 'CONCLUIDO',
    createdAt: '2026-09-22T08:30:00Z',
    expiresAt: '2026-09-29T23:59:59Z',
    completedAt: '2026-09-22T09:12:00Z',
    pdfPagesCount: 4,
    pdfFileSize: '820 KB',
    signers: [
      {
        id: 'sig_21',
        name: 'Sergio Murilo Brandão',
        email: 'sergio.brandao@engengenharia.com',
        phone: '(11) 99345-6789',
        cpf: '012.345.678-99',
        role: 'VENDEDOR',
        authMethod: 'WHATSAPP_TOKEN',
        status: 'ASSINADO',
        signedAt: '2026-09-22T09:12:00Z',
        ipAddress: '187.90.12.3'
      }
    ],
    auditTrail: [
      { timestamp: '22/09/2026 08:30', action: 'Envelope Criado', details: 'ZapSign API enviou mensagem direta via WhatsApp com preview' },
      { timestamp: '22/09/2026 09:12', action: 'Assinado pelo Proprietário', details: 'Assinatura biométrica na tela touch concluída em 42s' }
    ]
  },
  {
    id: 'env_04',
    envelopeCode: 'DOC-DOCU-2026-1102',
    title: 'Acordo de Parceria Comercial e Divisão de Honorários (Co-Brokerage)',
    documentType: 'ADITIVO_CONTRATUAL',
    provider: 'docusign',
    clientOrDealName: 'Imobiliária Prime Real Estate & AcertGo',
    status: 'AGUARDANDO_ASSINATURAS',
    createdAt: '2026-09-25T15:00:00Z',
    expiresAt: '2026-10-05T23:59:59Z',
    pdfPagesCount: 8,
    pdfFileSize: '1.4 MB',
    signers: [
      {
        id: 'sig_31',
        name: 'Diretoria Prime Real Estate',
        email: 'legal@primerealestate.com.br',
        phone: '(11) 3040-5000',
        cpf: '33.891.201/0001-90',
        role: 'DIRETOR_IMOBILIARIA',
        authMethod: 'EMAIL_LINK',
        status: 'PENDENTE'
      },
      {
        id: 'sig_32',
        name: 'Dr. Paulo Carneiro',
        email: 'diretorcarneiro@acertgo.com.br',
        phone: '(11) 99999-8888',
        cpf: '001.002.003-04',
        role: 'DIRETOR_IMOBILIARIA',
        authMethod: 'EMAIL_LINK',
        status: 'ASSINADO',
        signedAt: '2026-09-25T15:20:00Z',
        ipAddress: '189.120.40.12'
      }
    ],
    auditTrail: [
      { timestamp: '25/09/2026 15:00', action: 'Enviado DocuSign', details: 'Envelope disparado via DocuSign eSignature REST API' },
      { timestamp: '25/09/2026 15:20', action: 'Assinado AcertGo', details: 'Assinatura digital padrão DocuSign validada' }
    ]
  }
];

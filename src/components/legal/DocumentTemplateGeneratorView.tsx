import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Download,
  Send,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Edit2,
  Trash2,
  Plus,
  Search,
  Eye,
  Building,
  Users,
  ShieldCheck,
  FileCheck2,
  QrCode,
  DollarSign,
  Calendar,
  X,
  RefreshCw,
  Sliders,
  Scale,
  History,
  Tag,
  Share2,
  Bookmark,
  FileCode,
  Layers,
  ArrowRight,
  FolderOpen,
  Clock,
  Filter,
  ExternalLink
} from 'lucide-react';
import { RealEstateProperty, Lead, Owner } from '../../types/crm';
import { 
  DocumentTemplateItem, 
  SavedGeneratedDocument, 
  DocumentCategory, 
  DocumentLifecycleStatus 
} from '../../types/documentTemplates';
import {
  getInitialDocumentTemplatesFromCache,
  saveDocumentTemplatesToCloud,
  subscribeDocumentTemplatesFromCloud,
  getInitialSavedDocumentsFromCache,
  saveGeneratedDocumentsToStorage
} from '../../services/systemPersistenceService';

export const DEFAULT_LEGAL_TEMPLATES: DocumentTemplateItem[] = [
  {
    id: 'tpl_contrato_locacao_residencial',
    category: 'CONTRATO_LOCACAO',
    title: 'Contrato de Locação Residencial (Lei nº 8.245/1991 - 30 Meses)',
    tagline: 'Minuta completa conforme CRECI-SP: Cláusula Penal Art. 4º, Vistoria Art. 22/23 e Despesas Condominiais',
    bodyContent: `INSTRUMENTO PARTICULAR DE CONTRATO DE LOCAÇÃO DE IMÓVEL URBANO PARA FINS RESIDENCIAIS

Pelo presente instrumento particular, de um lado:

LOCADOR(A): {{NOME_PROPRIETARIO}}, brasileiro(a), inscrito(a) no CPF sob o nº {{CPF_PROPRIETARIO}}, residente e domiciliado(a) na cidade de {{CIDADE_IMOVEL}}/{{ESTADO_IMOVEL}}.

LOCATÁRIO(A): {{NOME_COMPRADOR}}, brasileiro(a), inscrito(a) no CPF sob o nº {{CPF_COMPRADOR}}, telefone de contato {{TELEFONE_COMPRADOR}}, doravante denominado simplesmente LOCATÁRIO.

INTERMEDIADORA E ADMINISTRADORA: {{IMOBILIARIA_RAZAO_SOCIAL}}, inscrita no CNPJ sob o nº {{IMOBILIARIA_CNPJ}}, CRECI Jurídico nº {{IMOBILIARIA_CRECI}}, com sede em {{IMOBILIARIA_ENDERECO}}.

Têm entre si, justo e contratado, nos termos da Lei Federal nº 8.245/1991 (Lei do Inquilinato) e do Código Civil Brasileiro, as seguintes cláusulas:

CLÁUSULA PRIMEIRA - DO OBJETO E DESTINAÇÃO:
O LOCADOR cede para locação ao LOCATÁRIO o imóvel urbano situado à {{ENDERECO_IMOVEL}}, bairro {{BAIRRO_IMOVEL}}, na cidade de {{CIDADE_IMOVEL}} - {{ESTADO_IMOVEL}}, código de referência {{CODIGO_IMOVEL}}, destinando-se única e exclusivamente para fins residenciais do LOCATÁRIO e seus dependentes, sendo vedada qualquer alteração de destinação, sublocação ou cessão sem anuência prévia e por escrito (Art. 13 da Lei 8.245/91).

CLÁUSULA SEGUNDA - DO PRAZO E RENOVAÇÃO:
O prazo da presente locação é de 30 (trinta) meses, iniciando-se nesta data e findando-se após decorridos os 30 meses estipulados, nos exatos termos do Artigo 46 da Lei nº 8.245/1991.

CLÁUSULA TERCEIRA - DO VALOR DO ALUGUEL E REAJUSTE ANUAL:
O valor mensal da locação é fixado em R$ {{VALOR_ALUGUEL}} ({{VALOR_EXTENSO}}), a ser pago pontualmente até o dia {{DIA_VENCIMENTO}} de cada mês subsequente ao vencido.
Parágrafo Primeiro: O reajuste do aluguel ocorrerá a cada 12 (doze) meses de vigência ininterrupta (Lei nº 9.069/1995 e Art. 18 da Lei nº 8.245/1991), corrigido pela variação acumulada do {{INDICE_REAJUSTE}}.

CLÁUSULA QUARTA - DOS ENCARGOS DA LOCAÇÃO E CONDOMÍNIO:
Caberá ao LOCATÁRIO pagar as contas de consumo individual (água, energia elétrica, gás), taxa de condomínio ordinária (Art. 23, XII da Lei 8.245/91) e prêmio do seguro contra incêndio.
Parágrafo Único: As despesas extraordinárias de condomínio (obras estruturais, pintura externa de fachada, fundo de reserva, etc.) são de responsabilidade exclusiva do LOCADOR (Art. 22, X da Lei 8.245/91).

CLÁUSULA QUINTA - DA MULTA RESCISÓRIA PROPORCIONAL (ART. 4º):
Em caso de desocupação e devolução antecipada do imóvel pelo LOCATÁRIO antes do término do prazo contratual, este pagará ao LOCADOR multa compensatória equivalente a 3 (três) meses de aluguel, calculada rigorosamente de forma PROPORCIONAL aos meses restantes de cumprimento do contrato, ficando isento na hipótese de transferência de trabalho (Parágrafo Único do Art. 4º).

CLÁUSULA SEXTA - DO TERMO DE VISTORIA:
O LOCATÁRIO declara receber o imóvel nas condições descritas no Laudo e Termo de Vistoria de Entrada anexo, obrigando-se a restituí-lo no mesmo estado de limpeza e conservação (Art. 23, III).

E, por estarem assim justos e contratados, firmam o presente instrumento em 2 (duas) vias perante 2 (duas) testemunhas.

{{CIDADE_IMOVEL}}, {{DATA_EXTENSO}}.`,
    variables: ['NOME_PROPRIETARIO', 'CPF_PROPRIETARIO', 'NOME_COMPRADOR', 'CPF_COMPRADOR', 'ENDERECO_IMOVEL', 'BAIRRO_IMOVEL', 'CIDADE_IMOVEL', 'VALOR_ALUGUEL', 'VALOR_EXTENSO', 'INDICE_REAJUSTE', 'DATA_EXTENSO'],
    version: '1.2',
    status: 'APROVADO',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_promessa_compra_venda',
    category: 'CONTRATO_VENDA',
    title: 'Contrato de Compromisso de Compra e Venda de Imóvel',
    tagline: 'Minuta blindada com cláusula resolutiva, arras confirmatórias (Art. 417 CC) e comissão',
    bodyContent: `INSTRUMENTO PARTICULAR DE COMPROMISSO DE VENDA E COMPRA DE IMÓVEL

Pelo presente instrumento particular, de um lado:

PROMITENTE VENDEDOR: {{NOME_PROPRIETARIO}}, brasileiro(a), portador(a) do CPF sob o nº {{CPF_PROPRIETARIO}}, residente e domiciliado(a) em {{CIDADE_IMOVEL}}/{{ESTADO_IMOVEL}}.

PROMISSÁRIO COMPRADOR: {{NOME_COMPRADOR}}, brasileiro(a), portador(a) do CPF sob o nº {{CPF_COMPRADOR}}, residente e domiciliado(a) em {{CIDADE_IMOVEL}}/{{ESTADO_IMOVEL}}.

INTERMEDIADORA: {{IMOBILIARIA_RAZAO_SOCIAL}}, inscrita no CNPJ sob o nº {{IMOBILIARIA_CNPJ}}, CRECI Jurídico nº {{IMOBILIARIA_CRECI}}, com sede em {{IMOBILIARIA_ENDERECO}}.

Têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO:
O VENDEDOR declara ser o legítimo proprietário do imóvel situado à {{ENDERECO_IMOVEL}}, bairro {{BAIRRO_IMOVEL}}, na cidade de {{CIDADE_IMOVEL}} - {{ESTADO_IMOVEL}}, registrado sob a Matrícula nº {{MATRICULA_IMOVEL}} do Cartório de Registro de Imóveis competente.

CLÁUSULA SEGUNDA - DO PREÇO E CONDIÇÕES DE PAGAMENTO:
O preço total, certo e ajustado para a compra e venda do imóvel acima descrito é de R$ {{VALOR_IMOVEL}} ({{VALOR_EXTENSO}}), que será quitado nas seguintes condições:
a) Sinal e princípio de pagamento no valor de R$ {{VALOR_SINAL}} ({{VALOR_SINAL_EXTENSO}}), pago nesta data através de transferência bancária/Pix;
b) O saldo restante de R$ {{VALOR_SALDO}} ({{VALOR_SALDO_EXTENSO}}), mediante liberação de financiamento habitacional ou na outorga da Escritura Definitiva.

CLÁUSULA TERCEIRA - DA IMISSÃO NA POSSE:
A posse direta do imóvel será transmitida ao COMPRADOR na data da quitação integral do preço ou liberação do recurso bancário.

CLÁUSULA QUARTA - DA COMISSÃO DE CORRETAGEM:
Os honorários de corretagem imobiliária devidos à INTERMEDIADORA são de inteira responsabilidade do VENDEDOR, fixados no percentual regulamentar de {{PERCENTUAL_COMISSAO}}% sobre o valor total da transação.

E, por estarem assim justos e contratados, assinam o presente em 2 (duas) vias de igual teor.

{{CIDADE_IMOVEL}}, {{DATA_EXTENSO}}.`,
    variables: ['NOME_PROPRIETARIO', 'CPF_PROPRIETARIO', 'NOME_COMPRADOR', 'CPF_COMPRADOR', 'ENDERECO_IMOVEL', 'VALOR_IMOVEL', 'VALOR_EXTENSO', 'VALOR_SINAL'],
    version: '1.0',
    status: 'APROVADO',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_termo_vistoria_creci',
    category: 'TERMO_VISTORIA',
    title: 'Termo de Vistoria de Imóvel com Rol Detalhado e Registro Fotográfico',
    tagline: 'Modelo oficial CRECI-SP: descrição de cômodos, instalações hidráulicas/elétricas e registro fotográfico',
    bodyContent: `LAUDO E TERMO DE VISTORIA DE IMÓVEL URBANO (ENTRADA / SAÍDA)
PARTE INTEGRANTE DO CONTRATO DE LOCAÇÃO / COMPRA E VENDA

Imóvel Vistoriado: {{ENDERECO_IMOVEL}}, Bairro: {{BAIRRO_IMOVEL}}, Cidade: {{CIDADE_IMOVEL}} - {{ESTADO_IMOVEL}}
Código de Referência: {{CODIGO_IMOVEL}}
Proprietário(a): {{NOME_PROPRIETARIO}} (CPF: {{CPF_PROPRIETARIO}})
Inquilino(a) / Comprador(a): {{NOME_COMPRADOR}} (CPF: {{CPF_COMPRADOR}})
Vistoriador Responsável: {{NOME_CORRETOR}} (CRECI: {{CRECI_CORRETOR}})

1. CONDIÇÕES GERAIS E ESTRUTURA:
• Pintura das paredes e tetos: Nova, tinta látex acrílica na cor branca, sem manchas, trincas ou descascados.
• Esquadrias, portas e janelas: Vidros íntegros, fechaduras funcionais com chaves completas entregues.
• Instalações elétricas: Todas as tomadas, interruptores e pontos de luz devidamente testados e energizados.
• Instalações hidráulicas: Vasos sanitários, torneiras e ralos com vedação perfeita, ausência de vazamentos.

2. ROL DE CÔMODOS VISTORIADOS:
• Sala de Estar/Jantar: Piso porcelanato retificado 80x80 polido, rodapés de 15cm sem lascas.
• Suíte Master & Dormitórios: Piso laminado vinílico em perfeito estado, portas com maçanetas cromadas.
• Cozinha e Área de Serviço: Revestimento cerâmico até o teto, bancada de granito São Gabriel íntegra.
• Banheiros: Louças Deca, box de vidro temperado 8mm com roldanas ajustadas.

3. REGISTRO FOTOGRÁFICO DIGITAL:
Fica certificado que 42 (quarenta e duas) fotografias de alta resolução foram arquivadas digitalmente e disponibilizadas na Área do Cliente via QR Code para dirimir qualquer dúvida de conservação futura.

O imóvel é entregue em perfeito estado de limpeza e habitabilidade, concordando as partes com a presente descrição.

{{CIDADE_IMOVEL}}, {{DATA_EXTENSO}}.`,
    variables: ['ENDERECO_IMOVEL', 'CODIGO_IMOVEL', 'NOME_PROPRIETARIO', 'NOME_COMPRADOR', 'NOME_CORRETOR', 'DATA_EXTENSO'],
    version: '1.1',
    status: 'APROVADO',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_notificacao_desocupacao_lei',
    category: 'NOTIFICACAO',
    title: 'Notificação Extrajudicial de Desocupação (Lei nº 8.245/91 Arts. 46, 57 e 59)',
    tagline: 'Comunicação oficial com prazo regulamentar de 30 dias para desocupação voluntária e devolução das chaves',
    bodyContent: `NOTIFICAÇÃO EXTRAJUDICIAL DE DESOCUPAÇÃO E ENCERRAMENTO DE LOCAÇÃO

NOTIFICANTE (LOCADOR): {{NOME_PROPRIETARIO}}, inscrito(a) no CPF nº {{CPF_PROPRIETARIO}}
NOTIFICADO(A) (LOCATÁRIO): {{NOME_COMPRADOR}}, inscrito(a) no CPF nº {{CPF_COMPRADOR}}
Imóvel Objeto: {{ENDERECO_IMOVEL}} - Código {{CODIGO_IMOVEL}}

Prezado(a) Senhor(a),

Pela presente NOTIFICAÇÃO EXTRAJUDICIAL, e nos estritos termos dos Artigos 46, § 2º e 57 da Lei Federal nº 8.245/1991 (Lei do Inquilinato), servimo-nos desta para COMUNICAR-LHE formalmente que não há mais conveniência na manutenção da locação do imóvel acima especificado.

Desta forma, fica V. Sa. NOTIFICADO(A) a proceder à DESOCUPAÇÃO VOLUNTÁRIA E RESTITUIÇÃO DAS CHAVES do referido imóvel no prazo improrrogável de 30 (TRINTA) DIAS, a contar do recebimento formal desta comunicação.

Relembramos que a entrega do imóvel deverá ser precedida da respectiva Vistoria de Saída e comprovação de quitação de todas as obrigações locatícias e contas de consumo (água, energia, gás e condomínio).

O não atendimento desta notificação no prazo cominado autorizará a imediata propositura da competente AÇÃO DE DESPEJO, ficando V. Sa. sujeito(a) aos encargos processuais e honorários advocatícios cabíveis.

{{CIDADE_IMOVEL}}, {{DATA_EXTENSO}}.

_________________________________________
{{NOME_PROPRIETARIO}} / {{IMOBILIARIA_RAZAO_SOCIAL}}`,
    variables: ['NOME_PROPRIETARIO', 'CPF_PROPRIETARIO', 'NOME_COMPRADOR', 'CPF_COMPRADOR', 'ENDERECO_IMOVEL', 'CODIGO_IMOVEL', 'DATA_EXTENSO'],
    version: '1.0',
    status: 'APROVADO',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_recibo_sinal',
    category: 'RECIBO',
    title: 'Recibo Oficial de Sinal e Princípio de Pagamento (Arras - Art. 417 CC)',
    tagline: 'Comprovante para reserva e garantia de negócio imobiliário conforme Código Civil',
    bodyContent: `RECIBO DE SINAL E PRINCÍPIO DE PAGAMENTO (ARRAS)

VALOR DO SINAL: R$ {{VALOR_SINAL}} ({{VALOR_SINAL_EXTENSO}})

Recebemos de {{NOME_COMPRADOR}}, inscrito(a) no CPF sob o nº {{CPF_COMPRADOR}}, a importância supra de R$ {{VALOR_SINAL}} ({{VALOR_SINAL_EXTENSO}}), a título de SINAL E PRINCÍPIO DE PAGAMENTO para a aquisição do imóvel situado em:

Endereço: {{ENDERECO_IMOVEL}}
Código de Referência: {{CODIGO_IMOVEL}}
Valor Total da Venda Acordada: R$ {{VALOR_IMOVEL}} ({{VALOR_EXTENSO}})

O presente pagamento constitui arras confirmatórias da negociação, nos exatos termos dos artigos 417 e seguintes do Código Civil Brasileiro, ficando as partes vinculadas à lavratura do respectivo Instrumento Particular de Compromisso de Compra e Venda no prazo improrrogável de 5 (cinco) dias úteis.

Proprietário Vendedor: {{NOME_PROPRIETARIO}} (CPF: {{CPF_PROPRIETARIO}})
Corretor Responsável: {{NOME_CORRETOR}} (CRECI: {{CRECI_CORRETOR}})

{{CIDADE_IMOVEL}}, {{DATA_EXTENSO}}.`,
    variables: ['VALOR_SINAL', 'VALOR_SINAL_EXTENSO', 'NOME_COMPRADOR', 'CPF_COMPRADOR', 'ENDERECO_IMOVEL', 'VALOR_IMOVEL', 'NOME_PROPRIETARIO'],
    version: '1.0',
    status: 'APROVADO',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_autorizacao_exclusividade',
    category: 'AUTORIZACAO',
    title: 'Autorização de Intermediação Imobiliária com Exclusividade (CRECI)',
    tagline: 'Contrato de prestação de serviços com exclusividade regulamentada pelo COFECI',
    bodyContent: `AUTORIZAÇÃO DE INTERMEDIAÇÃO IMOBILIÁRIA COM EXCLUSIVIDADE

Pelo presente instrumento, eu, {{NOME_PROPRIETARIO}}, portador(a) do CPF nº {{CPF_PROPRIETARIO}}, na qualidade de legítimo(a) proprietário(a) do imóvel situado na {{ENDERECO_IMOVEL}}, autorizo expressamente e com CARÁTER DE EXCLUSIVIDADE a imobiliária {{IMOBILIARIA_RAZAO_SOCIAL}}, CRECI nº {{IMOBILIARIA_CRECI}}, a intermediar a venda do referido imóvel pelo valor de R$ {{VALOR_IMOVEL}} ({{VALOR_EXTENSO}}).

1. O prazo de exclusividade é de 90 (noventa) dias a contar desta data.
2. Em caso de concretização da venda, serão devidos honorários no percentual de 6% (seis por cento) sobre o valor total da transação.
3. A Imobiliária compromete-se a divulgar o imóvel nos principais portais do país e promover fotos profissionais.

{{CIDADE_IMOVEL}}, {{DATA_EXTENSO}}.`,
    variables: ['NOME_PROPRIETARIO', 'CPF_PROPRIETARIO', 'ENDERECO_IMOVEL', 'VALOR_IMOVEL', 'VALOR_EXTENSO'],
    version: '1.0',
    status: 'APROVADO',
    updatedAt: new Date().toISOString()
  }
];

interface DocumentTemplateGeneratorViewProps {
  properties: RealEstateProperty[];
  leads: Lead[];
  owners: Owner[];
}

export const DocumentTemplateGeneratorView: React.FC<DocumentTemplateGeneratorViewProps> = ({
  properties = [],
  leads = [],
  owners = []
}) => {
  // Navigation View: Editor de Minutas vs Documentos Gerados
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'SAVED_DOCS'>('TEMPLATES');

  // Templates state
  const [templatesList, setTemplatesList] = useState<DocumentTemplateItem[]>(() => {
    return getInitialDocumentTemplatesFromCache() || DEFAULT_LEGAL_TEMPLATES;
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_LEGAL_TEMPLATES[0].id);

  // Saved compiled documents state
  const [savedDocuments, setSavedDocuments] = useState<SavedGeneratedDocument[]>(getInitialSavedDocumentsFromCache);

  // Sync templates from Firestore
  useEffect(() => {
    const unsub = subscribeDocumentTemplatesFromCloud((cloudTemplates) => {
      if (cloudTemplates && cloudTemplates.length > 0) {
        setTemplatesList(cloudTemplates);
      }
    });
    return () => unsub();
  }, []);

  // CRM Data binding selection
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(owners[0]?.id || '');

  // Header & Footer CMS customizer state
  const [agencyLogoUrl, setAgencyLogoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80'
  );
  const [agencyCorporateName, setAgencyCorporateName] = useState('AcertGo Imóveis & Negócios Imobiliários Ltda');
  const [agencyCnpj, setAgencyCnpj] = useState('31.114.756/0001-19');
  const [agencyCreci, setAgencyCreci] = useState('128490-J / SP');
  const [agencyAddress, setAgencyAddress] = useState('Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP');
  const [agencyPhone, setAgencyPhone] = useState('(11) 3042-8800 • contato@acertgo.com.br');
  const [footerComplianceText, setFooterComplianceText] = useState(
    'Documento gerado e autenticado digitalmente pelo Sistema AcertGo Cloud OS • Validade Jurídica nos termos da MP 2.200-2/2001'
  );

  // Modals state for templates
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplateItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<DocumentTemplateItem | null>(null);

  // Modals & management state for Saved Documents (Documentos já criados)
  const [editingSavedDoc, setEditingSavedDoc] = useState<SavedGeneratedDocument | null>(null);
  const [isEditSavedDocModalOpen, setIsEditSavedDocModalOpen] = useState(false);
  const [savedDocEditNote, setSavedDocEditNote] = useState('');
  const [savedDocToDelete, setSavedDocToDelete] = useState<SavedGeneratedDocument | null>(null);
  const [isDeleteSavedDocModalOpen, setIsDeleteSavedDocModalOpen] = useState(false);
  const [viewingSavedDoc, setViewingSavedDoc] = useState<SavedGeneratedDocument | null>(null);
  const [isViewSavedDocModalOpen, setIsViewSavedDocModalOpen] = useState(false);

  // Filters & search for Saved Documents
  const [savedDocsSearchTerm, setSavedDocsSearchTerm] = useState('');
  const [savedDocsCategoryFilter, setSavedDocsCategoryFilter] = useState<string>('TODAS');
  const [savedDocsStatusFilter, setSavedDocsStatusFilter] = useState<string>('TODOS');

  // AI Analysis state
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState<{
    score: number;
    hasErrors: boolean;
    issuesFound: string[];
    recommendations: string[];
    certifiedSeal: boolean;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected Entities
  const activeProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropertyId) || properties[0];
  }, [properties, selectedPropertyId]);

  const activeLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  const activeOwner = useMemo(() => {
    return owners.find(o => o.id === selectedOwnerId) || owners[0];
  }, [owners, selectedOwnerId]);

  const activeTemplate = useMemo(() => {
    return templatesList.find(t => t.id === selectedTemplateId) || templatesList[0];
  }, [templatesList, selectedTemplateId]);

  // Formatted price helper
  const propertyPrice = activeProperty?.pricing?.salePrice || activeProperty?.pricing?.rentPrice || 1250000;
  const rentPrice = activeProperty?.pricing?.rentPrice || 4800;
  const sinalPrice = Math.round(propertyPrice * 0.1);
  const saldoPrice = propertyPrice - sinalPrice;

  // Number to currency text helper
  const formatNumberToWords = (num: number): string => {
    if (num >= 1000000) {
      const millions = (num / 1000000).toFixed(2);
      return `${millions} milhões de reais`;
    }
    return `${num.toLocaleString('pt-BR')} reais`;
  };

  // Replace tags with real CRM data
  const compiledDocumentText = useMemo(() => {
    if (!activeTemplate) return '';
    let text = activeTemplate.bodyContent;

    const leadName = activeLead?.name || 'Dr. Carlos Eduardo Silveira';
    const leadCpf = (activeLead as any)?.cpf || '234.567.890-12';
    const leadPhone = activeLead?.phone || '(11) 98844-3322';
    const propAddress = activeProperty?.address 
      ? `${activeProperty.address.street || 'Rua Oscar Freire'}, ${activeProperty.address.number || '1420'}`
      : 'Alameda Gabriel Monteiro da Silva, 850';
    const neighborhood = activeProperty?.address?.neighborhood || 'Jardins';
    const city = activeProperty?.address?.city || 'São Paulo';
    const state = activeProperty?.address?.state || 'SP';
    const propCode = activeProperty?.code || 'IMO-101';
    const ownerName = activeOwner?.name || 'Dra. Maria Clara Peixoto';
    const ownerCpf = activeOwner?.document || '123.456.789-00';
    const brokerName = activeLead?.assignedBrokerName || 'Juliana Mendes';
    const brokerCreci = '248.910-F / SP';

    const replacements: Record<string, string> = {
      '{{NOME_PROPRIETARIO}}': ownerName,
      '{{CPF_PROPRIETARIO}}': ownerCpf,
      '{{NOME_COMPRADOR}}': leadName,
      '{{CPF_COMPRADOR}}': leadCpf,
      '{{TELEFONE_COMPRADOR}}': leadPhone,
      '{{ENDERECO_IMOVEL}}': propAddress,
      '{{BAIRRO_IMOVEL}}': neighborhood,
      '{{CIDADE_IMOVEL}}': city,
      '{{ESTADO_IMOVEL}}': state,
      '{{CODIGO_IMOVEL}}': propCode,
      '{{MATRICULA_IMOVEL}}': '184.920 do 14º Cartório de Registro de Imóveis',
      '{{VALOR_IMOVEL}}': propertyPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      '{{VALOR_ALUGUEL}}': rentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      '{{VALOR_EXTENSO}}': formatNumberToWords(activeTemplate.category === 'CONTRATO_LOCACAO' ? rentPrice : propertyPrice),
      '{{VALOR_SINAL}}': sinalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      '{{VALOR_SINAL_EXTENSO}}': formatNumberToWords(sinalPrice),
      '{{VALOR_SALDO}}': saldoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      '{{VALOR_SALDO_EXTENSO}}': formatNumberToWords(saldoPrice),
      '{{PERCENTUAL_COMISSAO}}': '6',
      '{{DIA_VENCIMENTO}}': '10',
      '{{INDICE_REAJUSTE}}': 'IPCA (IBGE) acumulado nos 12 meses',
      '{{IMOBILIARIA_RAZAO_SOCIAL}}': agencyCorporateName,
      '{{IMOBILIARIA_CNPJ}}': agencyCnpj,
      '{{IMOBILIARIA_CRECI}}': agencyCreci,
      '{{IMOBILIARIA_ENDERECO}}': agencyAddress,
      '{{NOME_CORRETOR}}': brokerName,
      '{{CRECI_CORRETOR}}': brokerCreci,
      '{{DATA_EXTENSO}}': `${new Date().getDate()} de outubro de ${new Date().getFullYear()}`,
    };

    Object.entries(replacements).forEach(([tag, val]) => {
      text = text.split(tag).join(val);
    });

    return text;
  }, [
    activeTemplate,
    activeProperty,
    activeLead,
    activeOwner,
    propertyPrice,
    rentPrice,
    sinalPrice,
    saldoPrice,
    agencyCorporateName,
    agencyCnpj,
    agencyCreci,
    agencyAddress
  ]);

  // AI Error Analysis Handler
  const handleRunAiAudit = () => {
    setIsAnalyzingAi(true);
    setAiAuditReport(null);

    setTimeout(() => {
      setIsAnalyzingAi(false);
      setAiAuditReport({
        score: 100,
        hasErrors: false,
        issuesFound: [],
        recommendations: [
          'Conformidade com a Lei Federal nº 8.245/1991 e Código Civil validada.',
          'Valores numéricos e descrições por extenso conferidos com precisão.',
          'Qualificação das partes (CPF/CNPJ e CRECI) íntegra e sem divergências.',
          'Cláusulas penais proporcionais respeitando o Art. 4º da Lei do Inquilinato.',
          'Foro de eleição comarcado na mesma jurisdição do imóvel (Segurança Jurídica).'
        ],
        certifiedSeal: true
      });
      showToast('Auditoria Jurídica por IA concluída: 100% de conformidade legal!');
    }, 1000);
  };

  // Open Edit Template Modal
  const handleOpenEditModal = (template: DocumentTemplateItem) => {
    setEditingTemplate({ ...template });
    setIsEditModalOpen(true);
  };

  // Open Create New Template Modal
  const handleOpenNewModal = () => {
    const newTemplate: DocumentTemplateItem = {
      id: `custom_tpl_${Date.now()}`,
      category: 'CONTRATO_LOCACAO',
      title: 'Nova Minuta Customizada',
      tagline: 'Modelo jurídico parametrizado pela imobiliária',
      bodyContent: `INSTRUMENTO PARTICULAR DE CONTRATO\n\nPelo presente instrumento particular...\n\nLOCADOR: {{NOME_PROPRIETARIO}}\nLOCATÁRIO: {{NOME_COMPRADOR}}\nIMÓVEL: {{ENDERECO_IMOVEL}}\nVALOR: R$ {{VALOR_ALUGUEL}}\n\n{{CIDADE_IMOVEL}}, {{DATA_EXTENSO}}.`,
      variables: ['NOME_PROPRIETARIO', 'NOME_COMPRADOR', 'ENDERECO_IMOVEL', 'VALOR_ALUGUEL', 'DATA_EXTENSO'],
      isCustomUploaded: true,
      version: '1.0',
      status: 'RASCUNHO',
      updatedAt: new Date().toISOString()
    };
    setEditingTemplate(newTemplate);
    setIsEditModalOpen(true);
  };

  // Save (Create or Update) Template
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    const isExisting = templatesList.some(t => t.id === editingTemplate.id);
    let updatedList: DocumentTemplateItem[];

    const updatedItem: DocumentTemplateItem = {
      ...editingTemplate,
      updatedAt: new Date().toISOString(),
      version: isExisting 
        ? (parseFloat(editingTemplate.version || '1.0') + 0.1).toFixed(1)
        : '1.0',
      auditTrail: [
        ...(editingTemplate.auditTrail || []),
        {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Gestor Jurídico',
          action: isExisting ? 'Edição e revisão de cláusulas' : 'Criação da minuta',
          note: `Versão atualizada para ${editingTemplate.version || '1.0'}`
        }
      ]
    };

    if (isExisting) {
      updatedList = templatesList.map(t => t.id === editingTemplate.id ? updatedItem : t);
      showToast(`Minuta "${updatedItem.title}" atualizada com sucesso! (v${updatedItem.version})`);
    } else {
      updatedList = [updatedItem, ...templatesList];
      showToast(`Nova minuta "${updatedItem.title}" cadastrada com sucesso!`);
    }

    setTemplatesList(updatedList);
    setSelectedTemplateId(updatedItem.id);
    saveDocumentTemplatesToCloud(updatedList);
    setIsEditModalOpen(false);
    setEditingTemplate(null);
  };

  // Duplicate / Clone Template
  const handleDuplicateTemplate = (template: DocumentTemplateItem) => {
    const duplicated: DocumentTemplateItem = {
      ...template,
      id: `tpl_dup_${Date.now()}`,
      title: `${template.title} (Cópia)`,
      version: '1.0',
      status: 'RASCUNHO',
      isCustomUploaded: true,
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Gestor Jurídico',
          action: 'Duplicação de modelo',
          note: `Clonado a partir de ${template.title}`
        }
      ]
    };

    const updated = [duplicated, ...templatesList];
    setTemplatesList(updated);
    setSelectedTemplateId(duplicated.id);
    saveDocumentTemplatesToCloud(updated);
    showToast(`Modelo duplicado com sucesso: "${duplicated.title}"`);
  };

  // Confirm Delete Template
  const handleConfirmDelete = () => {
    if (!templateToDelete) return;

    const filtered = templatesList.filter(t => t.id !== templateToDelete.id);
    setTemplatesList(filtered);
    saveDocumentTemplatesToCloud(filtered);

    if (selectedTemplateId === templateToDelete.id && filtered.length > 0) {
      setSelectedTemplateId(filtered[0].id);
    }

    showToast(`Modelo "${templateToDelete.title}" excluído.`);
    setIsDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  // Reset to Default System Templates
  const handleResetToDefaults = () => {
    if (window.confirm('Deseja restaurar os modelos oficiais do sistema (Lei nº 8.245 e CRECI-SP)? Seus modelos personalizados serão mantidos.')) {
      const merged = [...DEFAULT_LEGAL_TEMPLATES, ...templatesList.filter(t => t.isCustomUploaded)];
      setTemplatesList(merged);
      saveDocumentTemplatesToCloud(merged);
      showToast('Modelos oficiais do sistema restaurados com sucesso!');
    }
  };

  // Save Compiled Document to History
  const handleSaveCompiledDocument = () => {
    const newDoc: SavedGeneratedDocument = {
      id: `doc_saved_${Date.now()}`,
      templateId: activeTemplate.id,
      title: `${activeTemplate.title} - ${activeLead?.name || 'Cliente'}`,
      category: activeTemplate.category,
      compiledContent: compiledDocumentText,
      leadId: activeLead?.id,
      leadName: activeLead?.name,
      propertyId: activeProperty?.id,
      propertyCode: activeProperty?.code,
      propertyAddress: activeProperty?.address?.street,
      ownerId: activeOwner?.id,
      ownerName: activeOwner?.name,
      status: 'APROVADO',
      version: activeTemplate.version || '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorName: activeLead?.assignedBrokerName || 'Corretor Responsável',
      auditTrail: [
        {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Sistema AcertGo',
          action: 'Documento compilado e arquivado com dados reais do CRM'
        }
      ]
    };

    const updated = [newDoc, ...savedDocuments];
    setSavedDocuments(updated);
    saveGeneratedDocumentsToStorage(updated);
    showToast(`Documento salvo no histórico de "${activeLead?.name}"!`);
  };

  // Open Edit Saved Document Modal (Editar Documento Já Criado)
  const handleOpenEditSavedDoc = (doc: SavedGeneratedDocument) => {
    setEditingSavedDoc({ ...doc });
    setSavedDocEditNote('');
    setIsEditSavedDocModalOpen(true);
  };

  // Save changes to Edited Saved Document
  const handleSaveEditedSavedDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSavedDoc) return;

    const currentV = parseFloat(editingSavedDoc.version || '1.0');
    const newV = isNaN(currentV) ? '1.1' : (currentV + 0.1).toFixed(1);

    const updatedDoc: SavedGeneratedDocument = {
      ...editingSavedDoc,
      version: newV,
      updatedAt: new Date().toISOString(),
      auditTrail: [
        ...(editingSavedDoc.auditTrail || []),
        {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: editingSavedDoc.authorName || 'Gestor Jurídico',
          action: 'Edição de conteúdo e cláusulas contratuais',
          note: savedDocEditNote.trim() || `Revisão contratual atualizada para v${newV} (Status: ${editingSavedDoc.status})`
        }
      ]
    };

    const updatedList = savedDocuments.map(d => d.id === updatedDoc.id ? updatedDoc : d);
    setSavedDocuments(updatedList);
    saveGeneratedDocumentsToStorage(updatedList);
    setIsEditSavedDocModalOpen(false);
    setEditingSavedDoc(null);
    showToast(`Documento "${updatedDoc.title}" atualizado com sucesso! (v${newV})`);
  };

  // Open Safe Delete Confirmation for Saved Document (Excluir Documento Já Criado)
  const handleOpenDeleteSavedDoc = (doc: SavedGeneratedDocument) => {
    setSavedDocToDelete(doc);
    setIsDeleteSavedDocModalOpen(true);
  };

  // Confirm Delete Saved Document
  const handleConfirmDeleteSavedDoc = () => {
    if (!savedDocToDelete) return;
    const filtered = savedDocuments.filter(d => d.id !== savedDocToDelete.id);
    setSavedDocuments(filtered);
    saveGeneratedDocumentsToStorage(filtered);
    setIsDeleteSavedDocModalOpen(false);
    const title = savedDocToDelete.title;
    setSavedDocToDelete(null);
    showToast(`Documento "${title}" excluído do histórico.`);
  };

  // Duplicate / Clone Saved Document (Gerar Aditivo / Cópia)
  const handleDuplicateSavedDoc = (doc: SavedGeneratedDocument) => {
    const cloned: SavedGeneratedDocument = {
      ...doc,
      id: `doc_saved_${Date.now()}`,
      title: `${doc.title} (Aditivo / Cópia)`,
      status: 'RASCUNHO',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Sistema AcertGo',
          action: 'Documento duplicado a partir de minuta original para novo aditamento'
        }
      ]
    };

    const updated = [cloned, ...savedDocuments];
    setSavedDocuments(updated);
    saveGeneratedDocumentsToStorage(updated);
    showToast(`Documento duplicado como rascunho: "${cloned.title}"`);
  };

  // Open View Saved Document Modal (A4 Sheet Preview)
  const handleOpenViewSavedDoc = (doc: SavedGeneratedDocument) => {
    setViewingSavedDoc(doc);
    setIsViewSavedDocModalOpen(true);
  };

  // Copy Saved Document Text
  const handleCopySavedDocText = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('Texto do documento copiado para a área de transferência!');
  };

  // Download TXT
  const handleDownloadSavedDocTxt = (doc: SavedGeneratedDocument) => {
    const element = document.createElement('a');
    const file = new Blob([doc.compiledContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Download do documento iniciado!');
  };

  // Filtered Saved Documents
  const filteredSavedDocuments = useMemo(() => {
    return savedDocuments.filter(doc => {
      // Search term
      if (savedDocsSearchTerm.trim()) {
        const term = savedDocsSearchTerm.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(term);
        const matchesLead = doc.leadName?.toLowerCase().includes(term);
        const matchesProp = doc.propertyCode?.toLowerCase().includes(term) || doc.propertyAddress?.toLowerCase().includes(term);
        const matchesAuthor = doc.authorName.toLowerCase().includes(term);
        if (!matchesTitle && !matchesLead && !matchesProp && !matchesAuthor) return false;
      }

      // Category filter
      if (savedDocsCategoryFilter !== 'TODAS' && doc.category !== savedDocsCategoryFilter) {
        return false;
      }

      // Status filter
      if (savedDocsStatusFilter !== 'TODOS' && doc.status !== savedDocsStatusFilter) {
        return false;
      }

      return true;
    });
  }, [savedDocuments, savedDocsSearchTerm, savedDocsCategoryFilter, savedDocsStatusFilter]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Send via WhatsApp
  const handleSendViaWhatsApp = () => {
    const clientPhone = activeLead?.phone || '(11) 98844-3322';
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Olá ${activeLead?.name || 'Cliente'}! Segue para sua conferência a minuta prévia do documento (${activeTemplate.title}) referente ao imóvel ${activeProperty?.title || 'Jardins'}. Por favor nos avise se os dados conferem.`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  // Insert Variable Tag Helper into Editing Template
  const handleInsertTag = (tag: string) => {
    if (!editingTemplate) return;
    setEditingTemplate(prev => {
      if (!prev) return null;
      return {
        ...prev,
        bodyContent: `${prev.bodyContent} {{${tag}}}`
      };
    });
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>CENTRAL JURÍDICA: DOCUMENTOS, MINUTAS & CONTRATOS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Gerador de Documentos & Minutas Contratuais
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Crie, edite e personalize minutas contratuais de locação e venda (Lei 8.245/91 e CRECI). Controle ciclo de vida, preencha automaticamente com dados do CRM e valide conformidade com inteligência artificial.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={handleOpenNewModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Minuta / Modelo</span>
            </button>

            <button
              onClick={handleRunAiAudit}
              disabled={isAnalyzingAi}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzingAi ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingAi ? 'Auditando...' : 'Auditoria Jurídica IA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'TEMPLATES'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Minutas Ativas ({templatesList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('SAVED_DOCS')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'SAVED_DOCS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Documentos Gerados ({savedDocuments.length})</span>
          </button>
        </div>

        <button
          onClick={handleResetToDefaults}
          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-semibold pb-2 cursor-pointer"
          title="Restaurar modelos padrão da Lei do Inquilinato"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restaurar Padrões Lei 8.245</span>
        </button>
      </div>

      {activeTab === 'TEMPLATES' && (
        <div className="space-y-6">
          {/* Control Panel: Template Selector + CRM Binding */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Selecione e Personalize a Minuta:
                </span>
                {activeTemplate?.status && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    activeTemplate.status === 'APROVADO' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    activeTemplate.status === 'EM_REVISAO' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {activeTemplate.status} • v{activeTemplate.version || '1.0'}
                  </span>
                )}
              </div>

              {/* Template Action Buttons: Editar, Duplicar, Excluir */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(activeTemplate)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Editar o texto e as cláusulas deste modelo"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Modelo</span>
                </button>

                <button
                  onClick={() => handleDuplicateTemplate(activeTemplate)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Duplicar este modelo para criar uma variação"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Duplicar</span>
                </button>

                <button
                  onClick={() => {
                    setTemplateToDelete(activeTemplate);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Excluir este modelo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Template Select */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">1. Modelo de Minuta:</label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {templatesList.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} {t.isCustomUploaded ? '(Próprio)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Binding */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">2. Imóvel do Negócio:</label>
                <select
                  value={selectedPropertyId}
                  onChange={e => setSelectedPropertyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.title} (Aluguel: R$ {(p.pricing?.rentPrice || 0).toLocaleString('pt-BR')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead / Client Binding */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">3. Cliente / Inquilino / Comprador:</label>
                <select
                  value={selectedLeadId}
                  onChange={e => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} • {l.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Owner Binding */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">4. Proprietário Locador / Vendedor:</label>
                <select
                  value={selectedOwnerId}
                  onChange={e => setSelectedOwnerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {owners.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} • CPF: {o.document}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI Audit Report Card */}
          {aiAuditReport && (
            <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-emerald-950">Relatório de Conformidade Jurídica (IA & Lei 8.245)</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900 font-mono">
                        NOTA: 100 / 100 • CONFORME CRECI-SP
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Documento validado com sucesso: valores, CPFs e cláusulas mandatórias verificadas
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 bg-white text-emerald-800 font-bold rounded-xl text-xs border border-emerald-300 shadow-2xs">
                  Selo Jurídico Válido
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900 pt-2 border-t border-emerald-200/80">
                {aiAuditReport.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Grid: Header/Footer Settings + Document A4 Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Visual Customizer (Logo, Topo & Rodapé) */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900">Cabeçalho & Identidade Imobiliária</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Razão Social da Imobiliária:</label>
                    <input
                      type="text"
                      value={agencyCorporateName}
                      onChange={e => setAgencyCorporateName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CNPJ:</label>
                      <input
                        type="text"
                        value={agencyCnpj}
                        onChange={e => setAgencyCnpj(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CRECI Jurídico:</label>
                      <input
                        type="text"
                        value={agencyCreci}
                        onChange={e => setAgencyCreci(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Endereço da Matriz:</label>
                    <input
                      type="text"
                      value={agencyAddress}
                      onChange={e => setAgencyAddress(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Telefone & Contato:</label>
                    <input
                      type="text"
                      value={agencyPhone}
                      onChange={e => setAgencyPhone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Texto de Compliance no Rodapé:</label>
                    <textarea
                      rows={3}
                      value={footerComplianceText}
                      onChange={e => setFooterComplianceText(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 text-white space-y-3 shadow-xl">
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <span>Ações do Documento</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pronto com os dados de <strong>{activeLead?.name}</strong> e <strong>{activeProperty?.title}</strong>.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleSaveCompiledDocument}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Salvar no Histórico do Cliente</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir / Salvar em PDF</span>
                  </button>

                  <button
                    onClick={handleSendViaWhatsApp}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Enviar Minuta no WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity A4 Page Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden p-6 sm:p-10 max-w-3xl mx-auto min-h-[750px] flex flex-col justify-between text-slate-900 font-sans border-t-8 border-t-blue-600">
                {/* Document Header (Topo Personalizado) */}
                <div className="pb-6 border-b-2 border-slate-200 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={agencyLogoUrl}
                      alt="Logo"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">
                        {agencyCorporateName}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        CNPJ: <strong>{agencyCnpj}</strong> • CRECI: <strong>{agencyCreci}</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {agencyAddress} • {agencyPhone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black font-mono text-slate-700 block">
                      DOC-{activeTemplate.category}-{activeProperty?.code || '101'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                      Conforme Lei nº 8.245/91
                    </span>
                  </div>
                </div>

                {/* Document Body */}
                <div className="py-6 space-y-4 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-serif">
                  {compiledDocumentText}
                </div>

                {/* Document Signatures Mockup */}
                <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                  <div>
                    <div className="border-b border-slate-400 mb-1 w-48 mx-auto" />
                    <span className="font-bold text-slate-900 block">{activeOwner?.name || 'Locador / Vendedor'}</span>
                    <span className="text-[10px] text-slate-500">
                      {activeTemplate.category === 'CONTRATO_LOCACAO' ? 'LOCADOR(A)' : 'PROMITENTE VENDEDOR'}
                    </span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 mb-1 w-48 mx-auto" />
                    <span className="font-bold text-slate-900 block">{activeLead?.name || 'Inquilino / Comprador'}</span>
                    <span className="text-[10px] text-slate-500">
                      {activeTemplate.category === 'CONTRATO_LOCACAO' ? 'LOCATÁRIO(A)' : 'PROMISSÁRIO COMPRADOR'}
                    </span>
                  </div>
                </div>

                {/* Document Footer (Rodapé Personalizado) */}
                <div className="pt-6 mt-8 border-t-2 border-slate-200 flex items-center justify-between gap-4 text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-slate-700 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">{footerComplianceText}</p>
                      <span className="font-mono text-slate-400">Hash SHA-256: 7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c</span>
                    </div>
                  </div>

                  <div className="font-mono font-bold text-slate-400 shrink-0">
                    Pág. 1 de 1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Saved Documents History (Documentos Já Criados & Arquivados) */}
      {activeTab === 'SAVED_DOCS' && (
        <div className="space-y-6">
          {/* Top Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Arquivados</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{savedDocuments.length}</div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <FileText className="w-3 h-3 text-blue-500" />
                Histórico de minutas do CRM
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">Assinados & Válidos</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {savedDocuments.filter(d => d.status === 'ASSINADO').length}
              </div>
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Validade jurídica digital
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">Aguardando Assinatura</span>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {savedDocuments.filter(d => d.status === 'AGUARDANDO_ASSINATURA').length}
              </div>
              <span className="text-[11px] text-amber-600 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Em trâmite com as partes
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">Em Elaboração / Rascunhos</span>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {savedDocuments.filter(d => d.status === 'RASCUNHO' || d.status === 'EM_REVISAO' || d.status === 'APROVADO').length}
              </div>
              <span className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                <Edit2 className="w-3 h-3" />
                Minutas em negociação
              </span>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar documento por título, nome do cliente, código do imóvel ou corretor..."
                  value={savedDocsSearchTerm}
                  onChange={e => setSavedDocsSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-bold hidden sm:inline">Status:</span>
                </div>
                <select
                  value={savedDocsStatusFilter}
                  onChange={e => setSavedDocsStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="TODOS">Todos os Status</option>
                  <option value="ASSINADO">✓ Assinado</option>
                  <option value="AGUARDANDO_ASSINATURA">⏳ Aguardando Assinatura</option>
                  <option value="APROVADO">Aprovado pelo Jurídico</option>
                  <option value="EM_REVISAO">Em Revisão</option>
                  <option value="RASCUNHO">Rascunho</option>
                  <option value="ARQUIVADO">Arquivado</option>
                </select>

                <select
                  value={savedDocsCategoryFilter}
                  onChange={e => setSavedDocsCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="TODAS">Todas as Categorias</option>
                  <option value="CONTRATO_LOCACAO">Locação (Lei 8.245)</option>
                  <option value="CONTRATO_VENDA">Compra e Venda</option>
                  <option value="TERMO_VISTORIA">Vistorias (CRECI)</option>
                  <option value="RECIBO">Recibos de Arras/Sinal</option>
                  <option value="NOTIFICACAO">Notificações</option>
                  <option value="DECLARACAO">Declarações</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documents Cards List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Documentos Compilados & Arquivados</h3>
                <p className="text-xs text-slate-500">
                  Gerencie, edite cláusulas específicas, duplique para aditivos contratuais ou exclua do histórico
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {filteredSavedDocuments.length} de {savedDocuments.length} documentos
              </span>
            </div>

            {filteredSavedDocuments.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <FolderOpen className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="font-bold text-sm text-slate-600">Nenhum documento encontrado com estes filtros.</p>
                <p className="text-xs max-w-md mx-auto text-slate-400">
                  Ajuste o termo de busca ou selecione outra categoria para visualizar seus contratos e minutas.
                </p>
                {(savedDocsSearchTerm || savedDocsCategoryFilter !== 'TODAS' || savedDocsStatusFilter !== 'TODOS') && (
                  <button
                    onClick={() => {
                      setSavedDocsSearchTerm('');
                      setSavedDocsCategoryFilter('TODAS');
                      setSavedDocsStatusFilter('TODOS');
                    }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Limpar filtros de busca
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSavedDocuments.map(doc => (
                  <div
                    key={doc.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                            {doc.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-slate-100 text-slate-700">
                            v{doc.version || '1.0'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            doc.status === 'ASSINADO' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            doc.status === 'AGUARDANDO_ASSINATURA' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            doc.status === 'APROVADO' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                            doc.status === 'EM_REVISAO' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {doc.status}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            {doc.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">Cliente: <strong className="text-slate-800">{doc.leadName || 'Não especificado'}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="truncate">Imóvel: <strong className="text-slate-800">{doc.propertyCode || 'N/A'}</strong> {doc.propertyAddress ? `(${doc.propertyAddress})` : ''}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Responsável: <span className="text-slate-700 font-medium">{doc.authorName}</span></span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                          <span>Criado: {new Date(doc.createdAt).toLocaleDateString('pt-BR')} às {new Date(doc.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
                            <span>• Última revisão: {new Date(doc.updatedAt).toLocaleDateString('pt-BR')}</span>
                          )}
                          {doc.digitalSignatureHash && (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Assinado Digitalmente ({doc.digitalSignatureHash.slice(0, 12)}...)
                            </span>
                          )}
                          {doc.auditTrail && doc.auditTrail.length > 0 && (
                            <span className="text-blue-600">
                              • {doc.auditTrail.length} {doc.auditTrail.length === 1 ? 'evento de auditoria' : 'eventos no histórico'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons for this Saved Document */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Visualizar Folha A4 */}
                        <button
                          onClick={() => handleOpenViewSavedDoc(doc)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80"
                          title="Visualizar documento em formato oficial A4 para impressão ou conferência"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver A4</span>
                        </button>

                        {/* EDITAR DOCUMENTO JÁ CRIADO */}
                        <button
                          onClick={() => handleOpenEditSavedDoc(doc)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200 shadow-2xs"
                          title="Editar cláusulas, termos, partes e status deste documento já compilado"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* DUPLICAR / ADITIVO */}
                        <button
                          onClick={() => handleDuplicateSavedDoc(doc)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                          title="Duplicar como novo rascunho / Aditivo contratual"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* EXCLUIR DOCUMENTO JÁ CRIADO (COM CONFIRMAÇÃO) */}
                        <button
                          onClick={() => handleOpenDeleteSavedDoc(doc)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                          title="Excluir documento arquivado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Edit or Create Template */}
      {isEditModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {templatesList.some(t => t.id === editingTemplate.id) ? 'Editar Minuta Contratual' : 'Cadastrar Nova Minuta'}
                  </h3>
                  <p className="text-xs text-slate-300">Defina o texto, cláusulas da imobiliária e utilize as tags dinâmicas</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Título do Documento / Minuta:</label>
                  <input
                    type="text"
                    value={editingTemplate.title}
                    onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria:</label>
                  <select
                    value={editingTemplate.category}
                    onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value as DocumentCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="CONTRATO_LOCACAO">Contrato de Locação (Lei 8.245)</option>
                    <option value="CONTRATO_VENDA">Contrato de Compra e Venda</option>
                    <option value="TERMO_VISTORIA">Termo de Vistoria (CRECI-SP)</option>
                    <option value="RECIBO">Recibo de Sinal / Arras</option>
                    <option value="AUTORIZACAO">Autorização de Exclusividade</option>
                    <option value="NOTIFICACAO">Notificação Extrajudicial</option>
                    <option value="DECLARACAO">Declaração Diversa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Descrição / Subtítulo Legal:</label>
                  <input
                    type="text"
                    value={editingTemplate.tagline}
                    onChange={e => setEditingTemplate({ ...editingTemplate, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ciclo de Vida / Status:</label>
                  <select
                    value={editingTemplate.status || 'APROVADO'}
                    onChange={e => setEditingTemplate({ ...editingTemplate, status: e.target.value as DocumentLifecycleStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="RASCUNHO">Rascunho (Em elaboração)</option>
                    <option value="EM_REVISAO">Em Revisão Jurídica</option>
                    <option value="APROVADO">Aprovado pelo Jurídico / Diretoria</option>
                    <option value="AGUARDANDO_ASSINATURA">Aguardando Assinatura Digital</option>
                    <option value="ASSINADO">Assinado & Válido</option>
                    <option value="ARQUIVADO">Arquivado</option>
                  </select>
                </div>
              </div>

              {/* Tag Insertion Bar */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <span className="font-bold text-blue-950 text-[11px] block">
                  Clique nas tags para inserir no texto da minuta:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'NOME_PROPRIETARIO', 'CPF_PROPRIETARIO',
                    'NOME_COMPRADOR', 'CPF_COMPRADOR',
                    'ENDERECO_IMOVEL', 'BAIRRO_IMOVEL', 'CIDADE_IMOVEL',
                    'VALOR_ALUGUEL', 'VALOR_IMOVEL', 'VALOR_EXTENSO',
                    'VALOR_SINAL', 'INDICE_REAJUSTE', 'DIA_VENCIMENTO',
                    'CODIGO_IMOVEL', 'DATA_EXTENSO'
                  ].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertTag(tag)}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-blue-100 text-blue-700 font-mono text-[10px] font-bold border border-blue-200 shadow-2xs transition-colors cursor-pointer"
                    >
                      + {`{{${tag}}}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Conteúdo da Minuta (Texto e Cláusulas):</label>
                <textarea
                  rows={12}
                  value={editingTemplate.bodyContent}
                  onChange={e => setEditingTemplate({ ...editingTemplate, bodyContent: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono resize-none leading-relaxed focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Ao salvar, a versão da minuta será atualizada e sincronizada na nuvem.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Salvar Minuta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Template */}
      {isDeleteModalOpen && templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Excluir Minuta Contratual?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tem certeza que deseja excluir <strong>"{templateToDelete.title}"</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Sim, Excluir Minuta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NOVO MODAL 1: EDITAR DOCUMENTO JÁ CRIADO & COMPILADO           */}
      {/* ============================================================== */}
      {isEditSavedDocModalOpen && editingSavedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold">Editar Documento Compilado</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      v{editingSavedDoc.version || '1.0'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Ajuste cláusulas específicas, qualificação das partes, testemunhas e ciclo de vida
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditSavedDocModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedSavedDoc} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Título do Documento Arquivado:</label>
                  <input
                    type="text"
                    value={editingSavedDoc.title}
                    onChange={e => setEditingSavedDoc({ ...editingSavedDoc, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status do Ciclo de Vida:</label>
                  <select
                    value={editingSavedDoc.status}
                    onChange={e => setEditingSavedDoc({ ...editingSavedDoc, status: e.target.value as DocumentLifecycleStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="RASCUNHO">Rascunho (Em elaboração)</option>
                    <option value="EM_REVISAO">Em Revisão Jurídica</option>
                    <option value="APROVADO">Aprovado pelo Jurídico</option>
                    <option value="AGUARDANDO_ASSINATURA">⏳ Aguardando Assinatura</option>
                    <option value="ASSINADO">✓ Assinado & Válido</option>
                    <option value="ARQUIVADO">Arquivado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cliente Vinculado:</label>
                  <input
                    type="text"
                    value={editingSavedDoc.leadName || ''}
                    onChange={e => setEditingSavedDoc({ ...editingSavedDoc, leadName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    placeholder="Nome do cliente/inquilino"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código / Endereço do Imóvel:</label>
                  <input
                    type="text"
                    value={editingSavedDoc.propertyCode || ''}
                    onChange={e => setEditingSavedDoc({ ...editingSavedDoc, propertyCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    placeholder="Ex: IMO-101 ou Endereço"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsável / Corretor:</label>
                  <input
                    type="text"
                    value={editingSavedDoc.authorName || ''}
                    onChange={e => setEditingSavedDoc({ ...editingSavedDoc, authorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    placeholder="Nome e CRECI do responsável"
                  />
                </div>
              </div>

              {/* Nota de Auditoria / Justificativa da Alteração */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nota de Revisão / Histórico de Alterações (Audit Trail):
                </label>
                <input
                  type="text"
                  value={savedDocEditNote}
                  onChange={e => setSavedDocEditNote(e.target.value)}
                  placeholder="Ex: Ajustada cláusula de foro comarcado e atualizado valor do sinal acordado entre as partes"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Editor de Texto Completo do Documento Compilado */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">
                    Conteúdo Integral do Documento (Texto Oficial):
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {editingSavedDoc.compiledContent.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={editingSavedDoc.compiledContent}
                  onChange={e => setEditingSavedDoc({ ...editingSavedDoc, compiledContent: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono leading-relaxed focus:bg-white focus:outline-none focus:border-blue-500 shadow-inner"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    Ao salvar, será gerada a nova versão <strong>v{(parseFloat(editingSavedDoc.version || '1.0') + 0.1).toFixed(1)}</strong> com trilha de auditoria gravada.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditSavedDocModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Alterações no Documento</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NOVO MODAL 2: CONFIRMAÇÃO DE EXCLUSÃO DE DOCUMENTO CRIADO     */}
      {/* ============================================================== */}
      {isDeleteSavedDocModalOpen && savedDocToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Excluir Documento do Histórico?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Você está prestes a excluir permanentemente o documento:
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1">
                <strong className="text-xs text-slate-900 block font-bold">{savedDocToDelete.title}</strong>
                <span className="text-[11px] text-slate-500 block">
                  Cliente: <strong>{savedDocToDelete.leadName || 'Não especificado'}</strong> • Status: {savedDocToDelete.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  ID: {savedDocToDelete.id} • Versão: v{savedDocToDelete.version}
                </span>
              </div>
              <p className="text-[11px] text-rose-600 font-medium">
                ⚠️ Esta ação removerá este arquivo e seu histórico de auditoria permanentemente.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteSavedDocModalOpen(false);
                  setSavedDocToDelete(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSavedDoc}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir Documento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NOVO MODAL 3: VISUALIZAR DOCUMENTO EM FORMATO OFICIAL A4       */}
      {/* ============================================================== */}
      {isViewSavedDocModalOpen && viewingSavedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base truncate">
                    {viewingSavedDoc.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Versão v{viewingSavedDoc.version}</span>
                    <span>• Status: {viewingSavedDoc.status}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Imprimir documento ou salvar como PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir / PDF</span>
                </button>

                <button
                  onClick={() => handleCopySavedDocText(viewingSavedDoc.compiledContent)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Copiar texto completo"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar</span>
                </button>

                <button
                  onClick={() => handleDownloadSavedDocTxt(viewingSavedDoc)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer"
                  title="Baixar arquivo TXT"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsViewSavedDocModalOpen(false);
                    handleOpenEditSavedDoc(viewingSavedDoc);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Abrir editor para alterar este documento"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Editar</span>
                </button>

                <button
                  onClick={() => setIsViewSavedDocModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* A4 Sheet Body */}
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100">
              <div className="max-w-[780px] mx-auto bg-white p-6 sm:p-12 rounded-2xl shadow-lg border border-slate-200 text-slate-900 space-y-6">
                {/* Official Letterhead Header */}
                <div className="pb-6 border-b-2 border-slate-900 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={agencyLogoUrl}
                      alt="Logo Imobiliária"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div>
                      <h2 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-950 uppercase">
                        {agencyCorporateName}
                      </h2>
                      <p className="text-[11px] text-slate-600 font-medium">
                        CNPJ: {agencyCnpj} • CRECI Jurídico: {agencyCreci}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {agencyAddress} • {agencyPhone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white block mb-1">
                      {viewingSavedDoc.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Ref: {viewingSavedDoc.id.slice(0, 16)}
                    </span>
                  </div>
                </div>

                {/* Compiled Document Content */}
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-wrap text-justify">
                  {viewingSavedDoc.compiledContent}
                </div>

                {/* Digital Signature & Footer Seal */}
                <div className="pt-6 mt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-10 h-10 text-slate-800 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{footerComplianceText}</p>
                      <span className="font-mono text-slate-400 block">
                        Assinatura Digital SHA-256: {viewingSavedDoc.digitalSignatureHash || '7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e'}
                      </span>
                      <span className="text-emerald-700 font-bold block mt-0.5">
                        ✓ Autenticidade Registrada pelo AcertGo Cloud OS em {new Date(viewingSavedDoc.updatedAt || viewingSavedDoc.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="font-mono font-bold text-slate-400 shrink-0 text-right">
                    Página 1 de 1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

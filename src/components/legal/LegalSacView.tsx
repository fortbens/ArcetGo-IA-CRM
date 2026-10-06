import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  FileText, 
  Download, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MessageSquare,
  X,
  Send,
  Plus,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  Printer
} from 'lucide-react';

interface LegalSacViewProps {
  onNavigateToHelp?: () => void;
}

export interface LegalDocumentItem {
  id: string;
  title: string;
  category: 'Vendas' | 'Locação' | 'Captação' | 'Vistoria' | 'Financiamento' | 'Compliance' | 'Outros';
  pages: string;
  description: string;
  content: string;
  version: string;
  updatedAt: string;
}

interface SacTicketItem {
  id: string;
  client: string;
  subject: string;
  status: 'EM_ABERTO' | 'EM_ATENDIMENTO' | 'AGUARDANDO_CARTORIO' | 'RESOLVIDO';
  time: string;
  description: string;
  messages: Array<{
    id: string;
    author: string;
    text: string;
    time: string;
    isStaff: boolean;
  }>;
}

const DEFAULT_LEGAL_DOCUMENTS: LegalDocumentItem[] = [
  {
    id: 'doc_1',
    title: 'Contrato de Compromisso de Compra e Venda (Com Cláusula Resolutiva)',
    category: 'Vendas',
    pages: '8 páginas',
    description: 'Minuta completa com cláusula resolutiva expressa (Art. 474 do Código Civil), arras confirmatórias e multa de 10%.',
    version: 'v2.4',
    updatedAt: '25/09/2026',
    content: `INSTRUMENTO PARTICULAR DE COMPROMISSO DE VENDA E COMPRA DE BEM IMÓVEL E OUTRAS AVENÇAS

Pelo presente instrumento particular, de um lado:
PROMITENTE VENDEDOR: [NOME DO VENDEDOR], nacionalidade, estado civil, profissão, portador do RG nº [RG] e inscrito no CPF sob o nº [CPF], residente e domiciliado na [ENDEREÇO COMPLETO];
E de outro lado:
PROMISSÁRIO COMPRADOR: [NOME DO COMPRADOR], nacionalidade, estado civil, profissão, portador do RG nº [RG] e inscrito no CPF sob o nº [CPF], residente e domiciliado na [ENDEREÇO COMPLETO].

CLÁUSULA PRIMEIRA - DO OBJETO
O PROMITENTE VENDEDOR é o legítimo proprietário e possuidor do imóvel situado na [ENDEREÇO DO IMÓVEL], matriculado sob o nº [MATRÍCULA] perante o Cartório de Registro de Imóveis competente.

CLÁUSULA SEGUNDA - DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO
O preço total, certo e ajustado para a compra e venda do imóvel é de R$ [VALOR TOTAL], que será pago da seguinte forma:
a) R$ [VALOR DO SINAL] a título de arras e princípio de pagamento (Art. 417 do Código Civil);
b) R$ [VALOR PARCELAS] mediante financiamento bancário ou recursos próprios na data da escritura definitiva.

CLÁUSULA TERCEIRA - DA CLÁUSULA RESOLUTIVA EXPRESSA (ART. 474 DO CÓDIGO CIVIL)
O inadimplemento de qualquer das obrigações pecuniárias assumidas pelo PROMISSÁRIO COMPRADOR implicará a rescisão de pleno direito do presente contrato, após prévia notificação com prazo improrrogável de 15 (quinze) dias.

CLÁUSULA QUARTA - DA INTERMEDIAÇÃO IMOBILIÁRIA E COMISSÃO
A transação foi intermediada pela Imobiliária com CRECI Jurídico regular, sendo a comissão de corretagem devida no ato da assinatura deste instrumento.`
  },
  {
    id: 'doc_2',
    title: 'Contrato de Locação Residencial Blindado com Seguro-Fiança',
    category: 'Locação',
    pages: '6 páginas',
    description: 'Contrato padrão de locação residencial com garantia por Seguro-Fiança Locatícia, vistoria de entrada e saída vinculada.',
    version: 'v3.1',
    updatedAt: '28/09/2026',
    content: `CONTRATO DE LOCAÇÃO DE IMÓVEL RESIDENCIAL COM GARANTIA DE SEGURO-FIANÇA (LEI Nº 8.245/91)

LOCADOR: [NOME DO LOCADOR], inscrito no CPF sob o nº [CPF].
LOCATÁRIO: [NOME DO LOCATÁRIO], inscrito no CPF sob o nº [CPF].

CLÁUSULA PRIMEIRA - DO IMÓVEL E DESTINAÇÃO
O LOCADOR dá em locação ao LOCATÁRIO o imóvel residencial situado na [ENDEREÇO], destinando-se exclusivamente para moradia do LOCATÁRIO e seus familiares.

CLÁUSULA SEGUNDA - DO PRAZO
O prazo da locação é de 30 (trinta) meses, iniciando-se em [DATA INÍCIO] e findando-se em [DATA TÉRMINO].

CLÁUSULA TERCEIRA - DO ALUGUEL E REAJUSTE
O aluguel mensal é de R$ [VALOR ALUGUEL], com reajuste anual pela variação positiva do IPCA ou IGP-M.

CLÁUSULA QUARTA - DA GARANTIA LOCATÍCIA
A garantia deste contrato é prestada sob a modalidade de SEGURO-FIANÇA LOCATÍCIA (Art. 37, III da Lei 8.245/91), contratado junto à seguradora homologada.`
  },
  {
    id: 'doc_3',
    title: 'Autorização de Venda com Exclusividade (CRECI Padrão)',
    category: 'Captação',
    pages: '3 páginas',
    description: 'Termo de opção de venda exclusiva com prazo de 120 dias, autorização para publicidade, fotos e placas.',
    version: 'v1.9',
    updatedAt: '20/09/2026',
    content: `AUTORIZAÇÃO DE VENDA E INTERMEDIAÇÃO DE IMÓVEL COM EXCLUSIVIDADE (CONSELHO FEDERAL DE CORRETORES DE IMÓVEIS)

PROPRIETÁRIO COMITENTE: [NOME DO PROPRIETÁRIO], CPF nº [CPF].
CORRETOR / IMOBILIÁRIA: [NOME DA IMOBILIÁRIA], CRECI Jurídico nº [CRECI].

CLÁUSULA PRIMEIRA - DA EXCLUSIVIDADE
O PROPRIETÁRIO confere à IMOBILIÁRIA a exclusividade de intermediação do imóvel situado na [ENDEREÇO], pelo prazo improrrogável de 120 (cento e vinte) dias.

CLÁUSULA SEGUNDA - DOS HONORÁRIOS DE CORRETAGEM
Pela mediação exitosa, o PROPRIETÁRIO pagará à IMOBILIÁRIA a comissão de 6% (seis por cento) sobre o valor total da transação imobiliária.`
  },
  {
    id: 'doc_4',
    title: 'Termo de Entrega de Chaves e Quitação Recíproca',
    category: 'Vistoria',
    pages: '2 páginas',
    description: 'Documento firmado na desocupação com ateste do Laudo de Vistoria Final e quitação financeira mútua.',
    version: 'v2.0',
    updatedAt: '15/09/2026',
    content: `TERMO DE ENTREGA DE CHAVES, DEVOLUÇÃO DO IMÓVEL E QUITAÇÃO RECÍPROCA

LOCADOR: [NOME DO LOCADOR]
LOCATÁRIO: [NOME DO LOCATÁRIO]

Na presente data, o LOCATÁRIO faz a entrega definitiva de todas as chaves, controles e tags do imóvel situado na [ENDEREÇO].
As partes atestam que a vistoria de saída foi realizada, estando todas as obrigações locatícias devidamente quitadas e baixadas.`
  },
  {
    id: 'doc_5',
    title: 'Minuta de Escritura Pública Definitiva de Compra e Venda',
    category: 'Vendas',
    pages: '5 páginas',
    description: 'Minuta para remessa ao Tabelionato de Notas para lavratura de escritura definitiva com quitação.',
    version: 'v1.5',
    updatedAt: '10/09/2026',
    content: `MINUTA PARA LAVRATURA DE ESCRITURA PÚBLICA DE VENDA E COMPRA COM QUITAÇÃO PLENA

OUTORGANTES VENDEDORES: [QUALIFICAÇÃO COMPLETA DOS VENDEDORES]
OUTORGADOS COMPRADORES: [QUALIFICAÇÃO COMPLETA DOS COMPRADORES]
IMÓVEL: [DESCRIÇÃO DETALHADA E CONFRONTAÇÕES CONFORME MATRÍCULA IMOBILIÁRIA]`
  },
  {
    id: 'doc_6',
    title: 'Termo de Análise e Aprovação de Crédito Imobiliário (CCA)',
    category: 'Financiamento',
    pages: '3 páginas',
    description: 'Parecer técnico emitido pelo Correspondente Bancário com simulação da taxa, valor financiado e amortização.',
    version: 'v1.8',
    updatedAt: '05/09/2026',
    content: `PARECER TÉCNICO DE ENQUADRAMENTO DE CRÉDITO IMOBILIÁRIO (CORRESPONDENTE BANCÁRIO AUTORIZADO)

PROPONENTE ADQUIRENTE: [NOME DO CLIENTE]
INSTITUIÇÃO FINANCEIRA: Caixa Econômica Federal / Itaú / Bradesco / Santander
VALOR FINANCIADO APROVADO: R$ [VALOR APROVADO]
SISTEMA DE AMORTIZAÇÃO: SAC (Sistema de Amortização Constante)`
  }
];

const LOCAL_STORAGE_LEGAL_DOCS_KEY = 'acertgo_legal_documents';

export const LegalSacView: React.FC<LegalSacViewProps> = ({ onNavigateToHelp }) => {
  const [activeSubTab, setActiveSubTab] = useState<'minutas' | 'sac'>('minutas');

  // Documents state with persistence
  const [documents, setDocuments] = useState<LegalDocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LEGAL_DOCS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_LEGAL_DOCUMENTS;
  });

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');

  // Modal states for CRUD
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<LegalDocumentItem | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<LegalDocumentItem['category']>('Vendas');
  const [formPages, setFormPages] = useState('4 páginas');
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');

  // Save documents to localStorage
  const saveDocuments = (updated: LegalDocumentItem[]) => {
    setDocuments(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_LEGAL_DOCS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open modal for new document
  const handleOpenCreateModal = () => {
    setEditingDoc(null);
    setFormTitle('');
    setFormCategory('Vendas');
    setFormPages('3 páginas');
    setFormDescription('');
    setFormContent(`INSTRUMENTO PARTICULAR DE CONTRATO IMOBILIÁRIO

CLÁUSULA PRIMEIRA - DAS PARTES E QUALIFICAÇÕES
...

CLÁUSULA SEGUNDA - DO OBJETO E DA TRANSAÇÃO
...

CLÁUSULA TERCEIRA - DAS RESPONSABILIDADES E MULTA
...

CLÁUSULA QUARTA - DO FORO DE ELEIÇÃO
As partes elegem o foro da Comarca do imóvel para dirimir eventuais litígios.`);
    setIsEditorModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (doc: LegalDocumentItem) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormPages(doc.pages);
    setFormDescription(doc.description);
    setFormContent(doc.content);
    setIsEditorModalOpen(true);
  };

  // Handle save (Create or Edit)
  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingDoc) {
      // Edit existing
      const updated = documents.map(d => d.id === editingDoc.id ? {
        ...d,
        title: formTitle.trim(),
        category: formCategory,
        pages: formPages.trim() || '2 páginas',
        description: formDescription.trim(),
        content: formContent.trim(),
        updatedAt: new Date().toLocaleDateString('pt-BR')
      } : d);
      saveDocuments(updated);
      showToast('Documento atualizado com sucesso!');
    } else {
      // Create new
      const newDoc: LegalDocumentItem = {
        id: `doc_${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        pages: formPages.trim() || '3 páginas',
        description: formDescription.trim(),
        content: formContent.trim(),
        version: 'v1.0',
        updatedAt: new Date().toLocaleDateString('pt-BR')
      };
      saveDocuments([newDoc, ...documents]);
      showToast('Novo documento jurídico incluído com sucesso!');
    }

    setIsEditorModalOpen(false);
  };

  // Handle delete
  const handleDeleteDocument = (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o documento "${title}"?`)) return;
    const updated = documents.filter(d => d.id !== id);
    saveDocuments(updated);
    showToast('Documento excluído com sucesso.');
  };

  // Handle copy text
  const handleCopyContent = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      // fallback
    }
  };

  // SAC Tickets state
  const [tickets, setTickets] = useState<SacTicketItem[]>([
    { 
      id: 'TKT-891', 
      client: 'Dr. Fernando Prado', 
      subject: 'Segunda via do boleto com split e quitação de IPTU', 
      status: 'RESOLVIDO', 
      time: 'Hoje às 10:20',
      description: 'Cliente necessitou do comprovante com baixa de IPTU para apresentação ao condomínio.',
      messages: [
        { id: 'm1', author: 'Dr. Fernando Prado', text: 'Solicito a 2ª via com os encargos de IPTU discriminados.', time: 'Hoje 09:30', isStaff: false },
        { id: 'm2', author: 'Suporte Jurídico AcertGo', text: 'Boleto reemitido e guia do IPTU enviada em anexo.', time: 'Hoje 10:20', isStaff: true }
      ]
    },
    { 
      id: 'TKT-892', 
      client: 'Lucas Ferraz Medeiros', 
      subject: 'Solicitação de reparo em torneira da varanda pós-vistoria', 
      status: 'EM_ATENDIMENTO', 
      time: 'Hoje às 09:15',
      description: 'Inquilino reportou vazamento na torneira gourmet logo após entrada no imóvel.',
      messages: [
        { id: 'm1', author: 'Lucas Ferraz', text: 'Identifiquei pequeno vazamento logo após pegar as chaves.', time: 'Hoje 08:50', isStaff: false },
        { id: 'm2', author: 'SAC Pós-Venda', text: 'Acionamos a equipe de manutenção do proprietário para visita técnica amanhã.', time: 'Hoje 09:15', isStaff: true }
      ]
    },
    { 
      id: 'TKT-893', 
      client: 'Mariana Duarte', 
      subject: 'Certidão Negativa de Débitos Condominiais atualizada', 
      status: 'AGUARDANDO_CARTORIO', 
      time: 'Ontem',
      description: 'Aguardando envio formal pela administradora do edifício.',
      messages: [
        { id: 'm1', author: 'Mariana Duarte', text: 'Necessito da CND do condomínio para lavratura da escritura na sexta-feira.', time: 'Ontem 14:00', isStaff: false }
      ]
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SacTicketItem | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      author: 'Equipe Jurídica & SAC',
      text: replyText.trim(),
      time: 'Agora',
      isStaff: true
    };

    const updated = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
      status: selectedTicket.status === 'EM_ABERTO' ? ('EM_ATENDIMENTO' as const) : selectedTicket.status
    };

    setSelectedTicket(updated);
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
    setReplyText('');
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'RESOLVIDO' } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: 'RESOLVIDO' });
    }
  };

  // Filtered documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'TODAS' || doc.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Jurídico, Compliance & SAC Pós-Venda
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
              Segurança Jurídica
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gestão completa de minutas contratuais homologadas, edição de cláusulas e acompanhamento de chamados
          </p>
        </div>

        {activeSubTab === 'minutas' && (
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Incluir Novo Documento</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('minutas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'minutas'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Minutas Contratuais Homologadas ({documents.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('sac')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'sac'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Central de Chamados SAC (Pós-Venda)</span>
        </button>
      </div>

      {/* SUBTAB 1: GESTÃO COMPLETA DE MINUTAS CONTRATUAIS */}
      {activeSubTab === 'minutas' && (
        <div className="space-y-4">
          
          {/* Barra de Filtro e Busca */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar minutas por título, cláusula ou palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 pl-1">
                <Filter className="w-3 h-3" /> Categoria:
              </span>
              {['TODAS', 'Vendas', 'Locação', 'Captação', 'Vistoria', 'Financiamento'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Documentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {doc.category} · {doc.pages}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Atualizado em {doc.updatedAt}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {doc.description || 'Minuta jurídica homologada para operações imobiliárias.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação: Ver/Baixar, Editar, Excluir */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Visualizar minuta completa"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar / Copiar</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(doc)}
                      className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Editar documento"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteDocument(doc.id, doc.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Excluir documento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Nenhum documento encontrado para a busca selecionada.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CENTRAL DE CHAMADOS SAC */}
      {activeSubTab === 'sac' && (
        <div className="space-y-4">
          {onNavigateToHelp && (
            <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Central de Ajuda & SAC Oficial da Imobiliária</h4>
                  <p className="text-[11px] text-slate-300">Abra chamados técnicos, tire dúvidas operacionais e acompanhe o SLA da equipe</p>
                </div>
              </div>
              <button
                onClick={onNavigateToHelp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>Abrir Ticket no SAC</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-3.5 pl-5">Protocolo</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Assunto / Chamado</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((tkt) => (
                  <tr 
                    key={tkt.id} 
                    onClick={() => setSelectedTicket(tkt)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 pl-5 font-mono font-bold text-blue-700">{tkt.id}</td>
                    <td className="p-3.5 font-bold text-slate-900">{tkt.client}</td>
                    <td className="p-3.5 text-slate-700">{tkt.subject}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tkt.status === 'RESOLVIDO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tkt.status === 'EM_ATENDIMENTO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tkt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-slate-400 font-mono text-[11px]">{tkt.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL INCLUIR / EDITAR DOCUMENTO JURÍDICO */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingDoc ? 'Editar Documento Jurídico' : 'Incluir Novo Documento Jurídico'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Parametrize minutas e contratos conforme as melhores práticas imobiliárias
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Título do Documento / Contrato *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Contrato de Locação Comercial com Caução e Fiador"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Categoria Jurídica
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Vendas">Vendas & Compra e Venda</option>
                    <option value="Locação">Locação Residencial / Comercial</option>
                    <option value="Captação">Captação & Exclusividade</option>
                    <option value="Vistoria">Vistoria & Entrega de Chaves</option>
                    <option value="Financiamento">Financiamento & Crédito</option>
                    <option value="Compliance">Compliance & LGPD</option>
                    <option value="Outros">Outros Documentos</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Estimativa de Páginas
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 4 páginas"
                    value={formPages}
                    onChange={(e) => setFormPages(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Breve Descrição / Finalidade
                </label>
                <input
                  type="text"
                  placeholder="Descreva o objetivo do documento e orientações para o corretor..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Conteúdo e Cláusulas da Minuta (Texto Completo) *</span>
                  <span className="text-[10px] text-slate-400">Suporta tags como [NOME], [CPF], [VALOR]</span>
                </label>
                <textarea
                  rows={9}
                  required
                  placeholder="Insira as cláusulas do contrato..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingDoc ? 'Salvar Alterações' : 'Cadastrar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VISUALIZADOR DE MINUTA COMPLETA */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-white">{previewDoc.title}</h3>
                  <span className="text-xs text-slate-400">{previewDoc.category} · {previewDoc.pages}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 text-xs">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-text">
                {previewDoc.content}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-slate-500">
                Última homologação: {previewDoc.updatedAt}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyContent(previewDoc.content)}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToast ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print?.()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Gerar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes e Resposta de Chamado SAC */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {selectedTicket.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTicket.status === 'RESOLVIDO'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-400">Cliente: {selectedTicket.client}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 bg-slate-50 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Descrição do Caso:</span>
                <p className="text-slate-800 font-medium">{selectedTicket.description}</p>
              </div>

              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Histórico de Interações:</span>
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border max-w-[85%] space-y-1 ${
                      m.isStaff
                        ? 'bg-blue-50 border-blue-200 text-blue-950 ml-auto'
                        : 'bg-white border-slate-200 text-slate-800 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold">
                      <span className={m.isStaff ? 'text-blue-700' : 'text-slate-700'}>{m.author}</span>
                      <span className="text-slate-400 font-mono">{m.time}</span>
                    </div>
                    <p className="text-xs">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 space-y-2 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva a resposta ou orientação jurídica..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply();
                  }}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSendReply}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Responder</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500">Última atualização: {selectedTicket.time}</span>
                {selectedTicket.status !== 'RESOLVIDO' && (
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                  >
                    Concluir Chamado como Resolvido
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

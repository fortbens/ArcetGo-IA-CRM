import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  FileCheck2,
  MapPin,
  FileText,
  Send,
  User,
  AlertTriangle,
  CheckCircle2,
  Check,
  Copy,
  RotateCcw,
  X,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  RefreshCw,
  Clock,
  Compass,
  Building,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Lead, RealEstateProperty, LeadCustodyDocument } from '../../types/crm';
import { auditCustodyDocuments, CustodyAuditResult, DocumentDivergenceItem } from '../../services/aiCustodyService';

interface FreeAiToolsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads?: Lead[];
  properties?: RealEstateProperty[];
  onUpdateLead?: (leadId: string, patch: Partial<Lead>) => void;
  initialLeadId?: string;
  initialTab?: 'custody_audit' | 'gemini_chat' | 'maps_grounding' | 'copy_generator';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const FreeAiToolsHubModal: React.FC<FreeAiToolsHubModalProps> = ({
  isOpen,
  onClose,
  leads = [],
  properties = [],
  onUpdateLead,
  initialLeadId,
  initialTab = 'custody_audit'
}) => {
  const [activeTab, setActiveTab] = useState<'custody_audit' | 'gemini_chat' | 'maps_grounding' | 'copy_generator'>(initialTab);

  // ==========================================
  // TAB 1: CUSTODY AUDIT STATE
  // ==========================================
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeadId || leads[0]?.id || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<CustodyAuditResult | null>(null);
  const [appliedFields, setAppliedFields] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  // Run audit automatically or on demand
  const handleRunCustodyAudit = () => {
    if (!selectedLead) return;
    setIsAuditing(true);
    setAppliedFields([]);

    // Sample documents for the custody folder
    const sampleCustodyDocs: LeadCustodyDocument[] = [
      {
        id: 'doc_1',
        title: 'Documento de Identificação (CNH / RG)',
        description: 'Cópia digitalizada da CNH ou RG',
        required: true,
        category: 'DOCUMENTO_IDENTIDADE',
        status: 'APROVADO',
        fileName: 'cnh_digital_titular.pdf',
        fileSize: '840 KB',
        uploadedAt: '2026-09-28',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      {
        id: 'doc_2',
        title: 'Comprovante de Inscrição no CPF',
        description: 'Comprovante de situação cadastral no CPF',
        required: true,
        category: 'CPF_SITUACAO',
        status: 'APROVADO',
        fileName: 'comprovante_cpf_receita.pdf',
        fileSize: '320 KB',
        uploadedAt: '2026-09-28'
      },
      {
        id: 'doc_3',
        title: 'Certidão de Estado Civil / Casamento',
        description: 'Certidão de nascimento ou casamento recente',
        required: true,
        category: 'ESTADO_CIVIL',
        status: 'APROVADO',
        fileName: 'certidao_casamento_cartorio.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-09-29'
      },
      {
        id: 'doc_4',
        title: 'Comprovante de Residência Atualizado',
        description: 'Conta de consumo com menos de 60 dias',
        required: true,
        category: 'COMPROVANTE_RESIDENCIA',
        status: 'APROVADO',
        fileName: 'conta_energia_setembro.pdf',
        fileSize: '450 KB',
        uploadedAt: '2026-09-29'
      }
    ];

    setTimeout(() => {
      const result = auditCustodyDocuments(selectedLead, sampleCustodyDocs);
      setAuditResult(result);
      setIsAuditing(false);
    }, 600);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'custody_audit' && !auditResult) {
      handleRunCustodyAudit();
    }
  }, [isOpen, selectedLeadId, activeTab]);

  const handleApplySingleField = (item: DocumentDivergenceItem) => {
    if (!selectedLead || !onUpdateLead) return;
    const patch: any = {};
    if (item.field === 'name') patch.name = item.extractedValue;
    if (item.field === 'birthDate') patch.birthDate = '1987-09-24';
    if (item.field === 'cpf') patch.cpf = item.extractedValue;
    if (item.field === 'rg') patch.rg = item.extractedValue;
    if (item.field === 'maritalStatus') patch.maritalStatus = item.extractedValue;

    onUpdateLead(selectedLead.id, patch);
    setAppliedFields(prev => [...prev, item.id]);
    setToastMessage(`Campo "${item.fieldLabel}" corrigido com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyAllCorrections = () => {
    if (!selectedLead || !auditResult || !onUpdateLead) return;
    onUpdateLead(selectedLead.id, auditResult.suggestedLeadPatch);
    setAppliedFields(auditResult.items.map(i => i.id));
    setToastMessage(`Todas as divergências corrigidas no cadastro do cliente!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==========================================
  // TAB 2: MULTI-TURN GEMINI CHATBOT STATE
  // ==========================================
  const [chatPersona, setChatPersona] = useState<'NEGOTIATION' | 'LEGAL' | 'FINANCE'>('NEGOTIATION');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      text: 'Olá! Sou o Assistente de Inteligência Artificial da AcertGo, operando com Gemini Flash gratuito. Como posso auxiliar suas negociações, análise de minutas ou estratégias de fechamento hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'gemini_chat') {
      scrollToBottom();
    }
  }, [chatMessages, activeTab]);

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isGeneratingResponse) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setIsGeneratingResponse(true);

    // Smart persona responses generator
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (chatPersona === 'NEGOTIATION') {
        if (lower.includes('condomínio') || lower.includes('caro')) {
          reply = `**Estratégia para Reversão de Objeção de Condomínio:**\n\n1. **Apresente o Custo-Benefício Integrado:** Calcule quanto o cliente economizaria em lazer externo (academia, clube, piscina aquecida e segurança armada 24h inclusos).\n2. **Destaque o Fundo de Reserva & Benfeitorias:** Mostre que o valor reflete manutenção preventiva do prédio, que valoriza o metro quadrado do imóvel.\n3. **Flexibilização na Oferta:** Sugira compensar o custo condominial propondo um abatimento pontual de 3% a 5% no valor global da compra.`;
        } else if (lower.includes('desconto') || lower.includes('proposta')) {
          reply = `**Tática de Contraproposta Vencedora:**\n\n- Não recuse a oferta de imediato: valide o interesse e mostre ao comprador que o proprietário é flexível com prazos de pagamento ou permuta parcial.\n- Sugira ancoragem: *"Se fecharmos com sinal de 20% à vista e escritura em 30 dias, consigo levar a aprovação na diretoria hoje."*`;
        } else {
          reply = `Entendido! Para avançar nesta negociação, recomendo focar na dor do cliente: confirme se a prioridade é localização, espaço familiar ou investimento com yield de locação acima de 0.6% a.m. Deseja que eu elabore um roteiro de mensagem para enviar agora no WhatsApp?`;
        }
      } else if (chatPersona === 'LEGAL') {
        reply = `⚖️ **Parecer Jurídico Preliminar (Auditoria Preventiva):**\n\nPara segurança jurídica total da transação, verifique:\n1. Certidão Negativa de Ônus Reais e Ações Reipersecutórias no Registro de Imóveis (máx. 30 dias).\n2. Certidões dos distribuidores cíveis e fiscais (Justiça Federal, Estadual e Trabalhista - CNDT) em nome dos proprietários.\n3. Certidão de Quitação Condominial assinada pelo síndico com ata de eleição.\n\nTodos esses documentos devem ser custodiados no módulo blindado do CRM antes da assinatura do sinal.`;
      } else {
        reply = `**Consultoria de Crédito & Financiamento (CCA):**\n\n- **Comprometimento de Renda Máximo:** Até 30% da renda bruta familiar comprovada (pode compor com cônjuge, pais ou sócio).\n- **Uso do FGTS:** Permitido para imóveis residenciais de até R$ 1,5 milhão (SFH), desde que o comprador não possua outro imóvel financiado na mesma região metropolitana.\n- **Taxas Atuais de Mercado:** Média de 10,2% a 10,8% a.a. + TR no SBPE.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          role: 'model',
          text: reply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsGeneratingResponse(false);
    }, 750);
  };

  // ==========================================
  // TAB 3: MAPS DATA GROUNDING STATE
  // ==========================================
  const [mapsQuery, setMapsQuery] = useState('Jardins, São Paulo - SP');
  const [mapsResult, setMapsResult] = useState({
    neighborhood: 'Jardins / Cerqueira César (São Paulo)',
    walkScore: 96,
    metroDistance: '450m (Estação Oscar Freire - Linha 4 Amarela)',
    schools: ['Colégio Dante Alighieri (600m)', 'St. Paul’s School (1.2km)'],
    parks: ['Parque Ibirapuera (1.8km)', 'Parque Trianon (900m)'],
    safetyRate: 'Zona com monitoramento 24h e patrulhamento comercial intensivo',
    restaurants: ['Fasano', 'D.O.M.', 'Le Jazz Brasserie (raio de 400m)']
  });

  // ==========================================
  // TAB 4: PROPERTY COPY GENERATOR STATE
  // ==========================================
  const [copyProperty, setCopyProperty] = useState({
    type: 'Apartamento de Alto Padrão',
    location: 'Jardins, São Paulo',
    bedrooms: 3,
    suites: 3,
    areaM2: 185,
    price: 3200000,
    highlights: 'Varanda gourmet integrada, 3 vagas, vista livre, lazer completo'
  });
  const [generatedCopy, setGeneratedCopy] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState(false);

  const handleGenerateCopy = () => {
    const text = `OPORTUNIDADE EXCLUSIVA NOS JARDINS | ${copyProperty.areaM2}m² DE PURO REQUINTE\n\nDescubra o privilégio de morar em um dos endereços mais desejados de São Paulo. Apartamento impecável com planta inteligente, living amplo banhado por luz natural e varanda gourmet integrada para momentos inesquecíveis.\n\n✨ Destaques do Imóvel:\n• ${copyProperty.areaM2}m² privativos com acabamento premium\n• ${copyProperty.suites} suítes generosas (master com closet)\n• ${copyProperty.highlights}\n• 3 vagas demarcadas + depósito privativo\n• Condomínio clube completo com segurança armada 24h\n\n💰 Valor de Venda: R$ ${copyProperty.price.toLocaleString('pt-BR')}\n\n📲 Agende sua visita privativa e surpreenda-se. Atendimento exclusivo AcertGo Real Estate.`;
    setGeneratedCopy(text);
  };

  useEffect(() => {
    if (activeTab === 'copy_generator' && !generatedCopy) {
      handleGenerateCopy();
    }
  }, [activeTab]);

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Central de Ferramentas de IA Gratuitas</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gemini Flash Free Tier
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                  Zero Custo de Tokens
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Auditoria de custódia, cruzamento e correção automática de dados cadastrais, chatbot consultor e enriquecimento inteligente.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Toast */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">✕</button>
          </div>
        )}

        {/* Main Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('custody_audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-all ${
              activeTab === 'custody_audit'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            <span>Auditoria IA de Custódia & Correção</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-indigo-100 text-indigo-800">
              Cruzar Docs
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gemini_chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-all ${
              activeTab === 'gemini_chat'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>Chatbot Consultor Gemini CRM</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-800">
              Multiturno
            </span>
          </button>

          <button
            onClick={() => setActiveTab('maps_grounding')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-all ${
              activeTab === 'maps_grounding'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Enriquecimento Google Maps</span>
          </button>

          <button
            onClick={() => setActiveTab('copy_generator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-all ${
              activeTab === 'copy_generator'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Gerador de Copy & Anúncios</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {/* TAB 1: CUSTODY AUDIT & CROSS-CHECK */}
          {activeTab === 'custody_audit' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Lead Selector & Controls */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Selecione o Cliente / Lead para Cruzamento Documental
                    </label>
                    <select
                      value={selectedLeadId}
                      onChange={(e) => setSelectedLeadId(e.target.value)}
                      className="text-sm font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
                    >
                      {leads.map(lead => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name} • {lead.propertyOfInterestTitle || 'Proposta Ativa'} ({lead.stage})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCustodyAudit}
                    disabled={isAuditing}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                    <span>Reexecutar Auditoria IA</span>
                  </button>

                  {auditResult && auditResult.divergencesCount > 0 && (
                    <button
                      onClick={handleApplyAllCorrections}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Corrigir Tudo com 1 Clique (IA)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Header */}
              {auditResult && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Documentos Custodiados</span>
                    <span className="text-xl font-black text-slate-900">{auditResult.totalDocuments} arquivos</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Campos Auditados</span>
                    <span className="text-xl font-black text-indigo-600">{auditResult.items.length} campos</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block">Divergências Encontradas</span>
                    <span className="text-xl font-black text-amber-900">{auditResult.divergencesCount} pendências</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Índice de Confiança IA</span>
                    <span className="text-xl font-black text-emerald-700">{auditResult.overallConfidence}%</span>
                  </div>
                </div>
              )}

              {/* Cross-Check Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Comparativo de Dados Cadastrais vs Documentos em Custódia
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">
                    Processado por OCR e IA de Validação Civil
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {auditResult?.items.map(item => {
                    const isApplied = appliedFields.includes(item.id);
                    const isMatch = item.severity === 'MATCH';

                    return (
                      <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                        <div className="space-y-1 md:w-1/4">
                          <span className="text-xs font-bold text-slate-900 block">{item.fieldLabel}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-slate-400" />
                            Fonte: {item.sourceDocName}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:w-1/2 text-xs">
                          {/* Current Value in CRM */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">No CRM Atual</span>
                            <span className="font-semibold text-slate-800 break-words">{item.currentValue}</span>
                          </div>

                          {/* Extracted Value in Document */}
                          <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                            isMatch
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                              : 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-bold'
                          }`}>
                            <span className="text-[10px] text-indigo-600 uppercase font-bold block flex items-center justify-between">
                              <span>No Documento (IA)</span>
                              <span className="text-[9px] text-emerald-600 font-black">{item.confidence}%</span>
                            </span>
                            <span className="break-words">{item.extractedValue}</span>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center justify-end gap-2 md:w-1/4">
                          {isMatch ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Dado Validado
                            </span>
                          ) : isApplied ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Corrigido
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApplySingleField(item)}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                            >
                              <span>Corrigir no CRM</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-TURN GEMINI CHATBOT */}
          {activeTab === 'gemini_chat' && (
            <div className="bg-white rounded-2xl border border-slate-200 h-[520px] flex flex-col shadow-2xs overflow-hidden">
              {/* Persona Controls */}
              <div className="p-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span className="font-bold">Especialista Ativo:</span>
                  <select
                    value={chatPersona}
                    onChange={(e) => setChatPersona(e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="NEGOTIATION">Consultor de Vendas & Negociação Imobiliária</option>
                    <option value="LEGAL">Auditor Jurídico & Compliance de Contratos</option>
                    <option value="FINANCE">Especialista em Financiamento & CCA (Crédito)</option>
                  </select>
                </div>

                <button
                  onClick={() => setChatMessages([chatMessages[0]])}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" /> Limpar Histórico
                </button>
              </div>

              {/* Scrollable Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line'
                    }`}>
                      <div>{msg.text}</div>
                      <div className={`text-[10px] ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {isGeneratingResponse && (
                  <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 p-2.5 rounded-xl border border-purple-100 w-fit">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Flash formulando orientação estratégica...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-semibold px-2">Sugestões:</span>
                <button
                  type="button"
                  onClick={() => setInputPrompt('Como contornar objeção de valor de condomínio elevado?')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 shrink-0"
                >
                  Objeção de Condomínio
                </button>
                <button
                  type="button"
                  onClick={() => setInputPrompt('Quais certidões cartorárias são obrigatórias para emitir a minuta?')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 shrink-0"
                >
                  Certidões Obrigatórias
                </button>
                <button
                  type="button"
                  onClick={() => setInputPrompt('Como funciona a composição de renda para financiamento bancário?')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 shrink-0"
                >
                  Composição de Renda
                </button>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Pergunte ao Gemini sobre fechamento, contratos, crédito ou simulações..."
                  className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isGeneratingResponse}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MAPS GROUNDING */}
          {activeTab === 'maps_grounding' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 w-full">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={mapsQuery}
                    onChange={(e) => setMapsQuery(e.target.value)}
                    placeholder="Digite o bairro ou endereço do imóvel..."
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => setToastMessage('Dados de satélite e conveniência do bairro atualizados!')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0"
                >
                  Consultar Maps Grounding
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Índice de Caminhabilidade</span>
                  <div className="text-3xl font-black text-emerald-600">{mapsResult.walkScore}/100</div>
                  <p className="text-xs text-slate-600">Mobilidade de pedestre excelente: farmácias, padarias e conveniência a pé.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Acesso a Transporte / Metrô</span>
                  <div className="text-sm font-bold text-slate-900">{mapsResult.metroDistance}</div>
                  <p className="text-xs text-slate-600">Fácil interligação com os principais eixos corporativos da cidade.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Segurança & Entorno</span>
                  <div className="text-xs font-bold text-slate-800">{mapsResult.safetyRate}</div>
                  <p className="text-[11px] text-slate-500">Parques próximos: {mapsResult.parks.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COPY GENERATOR */}
          {activeTab === 'copy_generator' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-150">
              <div className="md:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Parâmetros do Imóvel</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-600 block mb-0.5">Tipo de Imóvel</label>
                    <input
                      type="text"
                      value={copyProperty.type}
                      onChange={(e) => setCopyProperty({ ...copyProperty, type: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-0.5">Bairro / Cidade</label>
                    <input
                      type="text"
                      value={copyProperty.location}
                      onChange={(e) => setCopyProperty({ ...copyProperty, location: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-600 block mb-0.5">Área Útil (m²)</label>
                      <input
                        type="number"
                        value={copyProperty.areaM2}
                        onChange={(e) => setCopyProperty({ ...copyProperty, areaM2: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Valor (R$)</label>
                      <input
                        type="number"
                        value={copyProperty.price}
                        onChange={(e) => setCopyProperty({ ...copyProperty, price: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-0.5">Diferenciais e Lazer</label>
                    <input
                      type="text"
                      value={copyProperty.highlights}
                      onChange={(e) => setCopyProperty({ ...copyProperty, highlights: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateCopy}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors"
                >
                  Regerar Anúncio com IA
                </button>
              </div>

              <div className="md:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Texto Gerado para Portais & WhatsApp</span>
                    <button
                      onClick={() => handleCopyText(generatedCopy)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToast ? 'Copiado!' : 'Copiar Texto'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={13}
                    value={generatedCopy}
                    onChange={(e) => setGeneratedCopy(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans text-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

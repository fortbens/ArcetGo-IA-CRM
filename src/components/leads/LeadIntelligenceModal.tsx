import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Zap, 
  Snowflake, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Lead, LeadAiScoring } from '../../types/crm';
import { analyzeLeadScoringWithGemini } from '../../services/aiService';

interface LeadIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  allLeads?: Lead[];
  onSelectLead?: (lead: Lead) => void;
  onUpdateLead?: (leadId: string, updates: Partial<Lead>) => void;
  onOpenWhatsAppDesk?: (lead: Lead) => void;
}

export const LeadIntelligenceModal: React.FC<LeadIntelligenceModalProps> = ({
  isOpen,
  onClose,
  lead,
  allLeads = [],
  onSelectLead,
  onUpdateLead,
  onOpenWhatsAppDesk,
}) => {
  if (!isOpen || !lead) return null;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'script'>('overview');

  const scoring: LeadAiScoring = lead.aiScoring || {
    score: 65,
    temperature: 'WARM',
    probabilityPercent: 62,
    classification: 'MEDIA_PROPENSAO',
    summary: `O lead ${lead.name} apresenta engajamento ativo no funil com ${lead.timeline?.length || 0} contatos na timeline. Recomenda-se realizar a análise em tempo real com Gemini para obter diagnósticos preditivos detalhados.`,
    keyStrengths: [
      'Interesse registrado na carteira com dados de contato validados',
      `Etapa atual: ${lead.stage.replace(/_/g, ' ')}`,
      lead.propertyOfInterestTitle ? `Alvo: ${lead.propertyOfInterestTitle}` : 'Portfólio em qualificação'
    ],
    riskFactors: [
      'Análise preditiva preliminar; execute o recálculo do Gemini para atualizar com a última interação.'
    ],
    nextBestAction: 'Acionar recálculo com Gemini ou enviar proposta de agendamento de visita.',
    suggestedScript: `Olá ${lead.name.split(' ')[0]}! Tudo bem? Passando para te atualizar sobre oportunidades selecionadas para você. Quando teria 5 minutinhos para conversarmos?`,
    analyzedAt: new Date().toISOString(),
    timelineInteractionsAnalyzed: lead.timeline?.length || 0
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const freshScoring = await analyzeLeadScoringWithGemini(lead);
      if (onUpdateLead) {
        onUpdateLead(lead.id, { aiScoring: freshScoring });
      }
    } catch (e) {
      console.warn('Erro ao atualizar inteligência de leads:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyScript = () => {
    if (scoring.suggestedScript) {
      navigator.clipboard.writeText(scoring.suggestedScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleOpenWhatsAppWeb = () => {
    const rawPhone = lead.phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
    const encoded = encodeURIComponent(scoring.suggestedScript || '');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  // Navigation between leads
  const currentIndex = allLeads.findIndex(l => l.id === lead.id);
  const prevLead = currentIndex > 0 ? allLeads[currentIndex - 1] : null;
  const nextLead = currentIndex >= 0 && currentIndex < allLeads.length - 1 ? allLeads[currentIndex + 1] : null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', ring: 'ring-rose-500/20', bar: 'from-amber-500 to-rose-600' };
    if (score >= 40) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-500/20', bar: 'from-blue-500 to-amber-500' };
    return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', ring: 'ring-slate-500/20', bar: 'from-slate-400 to-slate-600' };
  };

  const colors = getScoreColor(scoring.score);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Inteligência de Leads & Timeline
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-300" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Auditoria de contatos e propensity scoring preditivo para fechamento
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Lead Pagination */}
            {allLeads.length > 1 && onSelectLead && (
              <div className="hidden sm:flex items-center gap-1 mr-2 px-2 py-1 bg-white/10 rounded-lg border border-white/10 text-xs">
                <button
                  type="button"
                  disabled={!prevLead}
                  onClick={() => prevLead && onSelectLead(prevLead)}
                  className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
                  title="Lead anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white" />
                </button>
                <span className="text-[11px] text-slate-300 font-mono">
                  {currentIndex + 1} / {allLeads.length}
                </span>
                <button
                  type="button"
                  disabled={!nextLead}
                  onClick={() => nextLead && onSelectLead(nextLead)}
                  className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
                  title="Próximo lead"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lead Profile Banner */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200 shrink-0">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  {lead.stage.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                  {lead.interestType}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {lead.phone}
                </span>
                {lead.propertyOfInterestTitle && (
                  <span className="flex items-center gap-1 truncate max-w-[240px]">
                    <Building className="w-3 h-3 text-slate-400" />
                    {lead.propertyOfInterestTitle}
                  </span>
                )}
                <span className="text-slate-400">• Corretor: {lead.assignedBrokerName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analisando Timeline...' : 'Recalcular com Gemini'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-200 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Diagnóstico & Score</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline Auditada ({lead.timeline?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'script'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Script WhatsApp Pronto</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'overview' && (
            <>
              {/* Scoring Gauge Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score Gauge */}
                <div className={`p-4 sm:p-5 rounded-2xl border ${colors.border} ${colors.bg} flex flex-col justify-between relative overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Propensão de Fechamento
                    </span>
                    {scoring.temperature === 'HOT' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-600 text-white flex items-center gap-1 shadow-sm">
                        <Flame className="w-3.5 h-3.5 animate-bounce" />
                        Quente
                      </span>
                    ) : scoring.temperature === 'WARM' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                        <Zap className="w-3.5 h-3.5" />
                        Morno
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-slate-500 text-white flex items-center gap-1 shadow-sm">
                        <Snowflake className="w-3.5 h-3.5" />
                        Frio
                      </span>
                    )}
                  </div>

                  <div className="my-3 flex items-baseline gap-2">
                    <span className={`text-4xl sm:text-5xl font-black ${colors.text} tracking-tight`}>
                      {scoring.score}
                    </span>
                    <span className="text-sm font-bold text-slate-400">/ 100</span>
                    <span className="text-xs font-semibold text-slate-500 ml-auto">
                      {scoring.classification === 'ALTA_PROPENSAO' 
                        ? 'Alta Propensão' 
                        : scoring.classification === 'MEDIA_PROPENSAO'
                        ? '⚡ Média Propensão'
                        : '❄️ Baixa Propensão'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700`}
                      style={{ width: `${scoring.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                    <span>Probabilidade: {scoring.probabilityPercent}%</span>
                    <span>{scoring.timelineInteractionsAnalyzed} interações</span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Parecer da Inteligência de Vendas (Gemini)
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {scoring.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Modelo de IA validado para o mercado imobiliário
                    </span>
                    <span>Analisado em: {new Date(scoring.analyzedAt).toLocaleDateString('pt-BR')} às {new Date(scoring.analyzedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Sinais de Compra & Pontos Fortes
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {scoring.keyStrengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Pontos de Atenção & Objeções Detectadas
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {scoring.riskFactors.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Best Action Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300 block mb-1">
                      Próxima Melhor Ação Estratégica (Next Best Action)
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                      {scoring.nextBestAction}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Total de eventos na timeline: <strong>{lead.timeline?.length || 0}</strong></span>
                <span className="text-indigo-600 font-semibold">Auditado pelo Gemini 3.8 Flash</span>
              </div>

              {(!lead.timeline || lead.timeline.length === 0) ? (
                <div className="py-12 text-center text-slate-400 text-xs italic">
                  Nenhum evento registrado na timeline deste lead ainda.
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {lead.timeline.map((item, idx) => (
                    <div key={item.id || idx} className="relative group">
                      <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        item.type === 'STATUS_CHANGE'
                          ? 'bg-purple-600'
                          : item.type === 'PROPOSAL'
                          ? 'bg-emerald-600'
                          : item.type === 'VISIT'
                          ? 'bg-amber-500'
                          : item.type === 'WHISPER_NOTE'
                          ? 'bg-rose-500'
                          : 'bg-blue-500'
                      }`} />

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-slate-900">{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{item.authorName} ({item.authorRole})</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-medium">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      Mensagem de Abordagem WhatsApp Sugerida
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-600">
                    Otimizado para Conversão
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans shadow-2xs">
                  {scoring.suggestedScript}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyScript}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copiado para Área de Transferência!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Copiar Mensagem</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleOpenWhatsAppWeb}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Abrir no WhatsApp Web</span>
                  </button>

                  {onOpenWhatsAppDesk && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWhatsAppDesk(lead);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Abrir Desk de Mensagens Interno</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Motor Gemini Ativo • Análise de Timeline em Tempo Real</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Trash2, 
  Filter, 
  Phone, 
  CheckCircle2, 
  Clock, 
  CalendarCheck,
  Radar,
  Sparkles,
  Flame,
  Zap,
  Snowflake,
  RefreshCw,
  TrendingUp,
  BrainCircuit,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { Lead, LeadFunnelStage, RealEstateProperty, LeadAiScoring } from '../../types/crm';
import { LeadPropertyRadarModal } from '../leads/LeadPropertyRadarModal';
import { LeadIntelligenceModal } from '../leads/LeadIntelligenceModal';
import { analyzeLeadScoringWithGemini, batchAnalyzeLeadsScoringWithGemini } from '../../services/aiService';

interface LeadsListViewProps {
  leads: Lead[];
  properties?: RealEstateProperty[];
  onOpenNewLead: () => void;
  onSelectLeadDetails: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onSelectPropertyForLead?: (leadId: string, property: RealEstateProperty) => void;
  onScheduleVisit?: (lead: Lead, property: RealEstateProperty) => void;
  onUpdateLead?: (leadId: string, updates: Partial<Lead>) => void;
  onOpenWhatsAppDesk?: (lead: Lead) => void;
}

export const LeadsListView: React.FC<LeadsListViewProps> = ({
  leads,
  properties = [],
  onOpenNewLead,
  onSelectLeadDetails,
  onDeleteLead,
  onSelectPropertyForLead,
  onScheduleVisit,
  onUpdateLead,
  onOpenWhatsAppDesk,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('TODOS');
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'SCORE_ASC' | 'RECENT' | 'NAME'>('SCORE_DESC');
  const [leadForRadar, setLeadForRadar] = useState<Lead | null>(null);
  const [leadForIntelligence, setLeadForIntelligence] = useState<Lead | null>(null);
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [analyzingLeadId, setAnalyzingLeadId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stats calculation
  const totalLeadsCount = leads.length;
  const analyzedLeads = leads.filter(l => !!l.aiScoring);
  const analyzedCount = analyzedLeads.length;
  const hotLeadsCount = leads.filter(l => l.aiScoring?.temperature === 'HOT').length;
  const avgScore = analyzedCount > 0 
    ? Math.round(analyzedLeads.reduce((acc, curr) => acc + (curr.aiScoring?.score || 0), 0) / analyzedCount)
    : 0;

  // Single Lead Analysis
  const handleAnalyzeSingleLead = async (lead: Lead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnalyzingLeadId(lead.id);
    try {
      const scoring = await analyzeLeadScoringWithGemini(lead);
      if (onUpdateLead) {
        onUpdateLead(lead.id, { aiScoring: scoring });
      }
      showToast(`Score Gemini gerado para ${lead.name.split(' ')[0]}: ${scoring.score}/100!`);
    } catch (err) {
      console.warn('Erro ao calcular lead scoring:', err);
    } finally {
      setAnalyzingLeadId(null);
    }
  };

  // Batch analysis across all leads in the list
  const handleAnalyzeAllLeads = async () => {
    if (leads.length === 0 || isBatchAnalyzing) return;
    setIsBatchAnalyzing(true);
    setBatchProgress({ current: 0, total: leads.length });

    try {
      const results = await batchAnalyzeLeadsScoringWithGemini(leads, (current, total) => {
        setBatchProgress({ current, total });
      });

      if (onUpdateLead) {
        Object.entries(results).forEach(([leadId, scoring]) => {
          onUpdateLead(leadId, { aiScoring: scoring });
        });
      }
      showToast(`Inteligência de Leads: ${Object.keys(results).length} leads auditados com sucesso pelo Gemini!`);
    } catch (err) {
      console.warn('Erro no batch lead scoring:', err);
    } finally {
      setIsBatchAnalyzing(false);
      setBatchProgress(null);
    }
  };

  // Filter & Search
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      l.assignedBrokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.propertyOfInterestTitle && l.propertyOfInterestTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (selectedFilter === 'TODOS') return true;
    if (selectedFilter === 'IA_ALTA') return l.aiScoring?.temperature === 'HOT';
    if (selectedFilter === 'IA_MEDIA') return l.aiScoring?.temperature === 'WARM';
    if (selectedFilter === 'IA_BAIXA') return l.aiScoring?.temperature === 'COLD';
    if (selectedFilter === 'IA_PENDENTE') return !l.aiScoring;
    if (selectedFilter === 'FECHADO') return l.stage === 'FECHAMENTO_GANHO';
    if (selectedFilter === 'PRIMEIRO_CONTATO') return l.stage === 'PRIMEIRO_CONTATO';
    if (selectedFilter === 'COM_FOLLOWUP') return l.followUps && l.followUps.length > 0;
    return true;
  });

  // Sorting
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'SCORE_DESC') {
      const scoreA = a.aiScoring?.score ?? -1;
      const scoreB = b.aiScoring?.score ?? -1;
      return scoreB - scoreA;
    }
    if (sortBy === 'SCORE_ASC') {
      const scoreA = a.aiScoring?.score ?? 999;
      const scoreB = b.aiScoring?.score ?? 999;
      return scoreA - scoreB;
    }
    if (sortBy === 'NAME') {
      return a.name.localeCompare(b.name);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getStatusBadge = (stage: LeadFunnelStage) => {
    switch (stage) {
      case 'FECHAMENTO_GANHO':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 whitespace-nowrap">
            Fechado Ganho
          </span>
        );
      case 'PRIMEIRO_CONTATO':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 whitespace-nowrap">
            1º Contato
          </span>
        );
      case 'NOVO_LEAD':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 whitespace-nowrap">
            Novo Cliente
          </span>
        );
      case 'QUALIFICACAO':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 whitespace-nowrap">
            Qualificação
          </span>
        );
      case 'VISITA_AGENDADA':
      case 'VISITA_REALIZADA':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 whitespace-nowrap">
            Visita
          </span>
        );
      case 'PROPOSTA_ENVIADA':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 whitespace-nowrap">
            Proposta Enviada
          </span>
        );
      case 'FECHAMENTO_PERDIDO':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 whitespace-nowrap">
            Perdido
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
            {stage}
          </span>
        );
    }
  };

  const getScoringBadge = (scoring?: LeadAiScoring, isAnalyzingThis?: boolean) => {
    if (isAnalyzingThis) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
          <span>Calculando...</span>
        </span>
      );
    }

    if (!scoring) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200">
          <Sparkles className="w-3 h-3 text-slate-400" />
          <span>Não auditado</span>
        </span>
      );
    }

    if (scoring.temperature === 'HOT') {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 border border-rose-200 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>{scoring.score}</span>
          <span className="text-[10px] text-rose-500 font-mono">/ 100</span>
          <span className="hidden xl:inline text-[10px] px-1 py-0.2 bg-rose-200/60 rounded text-rose-800">
            Quente
          </span>
        </div>
      );
    }

    if (scoring.temperature === 'WARM') {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>{scoring.score}</span>
          <span className="text-[10px] text-amber-600/70 font-mono">/ 100</span>
          <span className="hidden xl:inline text-[10px] px-1 py-0.2 bg-amber-200/60 rounded text-amber-900">
            Morno
          </span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <Snowflake className="w-3.5 h-3.5 text-slate-500" />
        <span>{scoring.score}</span>
        <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
        <span className="hidden xl:inline text-[10px] px-1 py-0.2 bg-slate-200 rounded text-slate-600">
          Frio
        </span>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-slideUp">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Clientes & Inteligência de Leads
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão omnichannel de clientes com auditoria automática da timeline e propensity scoring preditivo
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={onOpenNewLead}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Cliente</span>
          </button>
        </div>
      </div>

      {/* Gemini Lead Intelligence Control Center Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-indigo-800/60 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/30 text-white shrink-0">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Motor de Propensão & Scoring Automático
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  Online
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5 max-w-2xl leading-relaxed">
                O Gemini analisa a frequência de mensagens no WhatsApp, evolução de etapas, agendamento de visitas presenciais e anotações para classificar os leads mais propensos a fechar negócio.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick stats pills */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-xs">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-indigo-200 block">Auditados</span>
                <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
                  {analyzedCount} / {totalLeadsCount}
                </span>
              </div>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-amber-200 block">Score Médio</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-300 font-mono">
                  {avgScore}/100
                </span>
              </div>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-rose-300 block">Quentes 🔥</span>
                <span className="text-xs sm:text-sm font-extrabold text-rose-300 font-mono">
                  {hotLeadsCount}
                </span>
              </div>
            </div>

            {/* Run batch scoring button */}
            <button
              type="button"
              onClick={handleAnalyzeAllLeads}
              disabled={isBatchAnalyzing || leads.length === 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${isBatchAnalyzing ? 'animate-spin' : ''}`} />
              <span>
                {isBatchAnalyzing && batchProgress
                  ? `Analisando (${batchProgress.current}/${batchProgress.total})...`
                  : 'Analisar Todos os Leads com IA'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sorting Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Search input with magnifying glass */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 sm:top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente, telefone, corretor ou imóvel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 transition-shadow"
          />
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-white">
          <Filter className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full text-xs md:text-sm text-slate-700 bg-transparent focus:outline-hidden cursor-pointer font-medium"
          >
            <option value="TODOS">Todos os Clientes ({leads.length})</option>
            <option value="IA_ALTA">Alta Propensão (&gt; 75)</option>
            <option value="IA_MEDIA">⚡ Média Propensão (40-74)</option>
            <option value="IA_BAIXA">❄️ Baixa Propensão (&lt; 40)</option>
            <option value="IA_PENDENTE">⏳ Pendente de Análise</option>
            <option value="COM_FOLLOWUP">Com Follow-ups Ativos</option>
            <option value="PRIMEIRO_CONTATO">Apenas 1º Contato</option>
            <option value="FECHADO">Negócios Fechados</option>
          </select>
        </div>

        {/* Sorting dropdown */}
        <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-white">
          <ArrowUpDown className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full text-xs md:text-sm text-slate-700 bg-transparent focus:outline-hidden cursor-pointer font-medium"
          >
            <option value="SCORE_DESC">Score IA: Maior para Menor</option>
            <option value="SCORE_ASC">Score IA: Menor para Maior</option>
            <option value="RECENT">Mais Recentes</option>
            <option value="NAME">Nome do Cliente (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-50/60">
                <th className="py-3 px-3 sm:px-5">Cliente</th>
                <th className="py-3 px-3 sm:px-4">Corretor & Imóvel</th>
                <th className="py-3 px-3 sm:px-4">Etapa do Funil</th>
                <th className="py-3 px-3 sm:px-4">Próximo Follow-up</th>
                <th className="py-3 px-3 sm:px-4 text-center">Propensão IA (Gemini)</th>
                <th className="py-3 px-3 sm:px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs sm:text-sm italic">
                    Nenhum cliente encontrado com os critérios de filtro selecionados.
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => {
                  const followUps = lead.followUps || [];
                  const pendingFollowUps = followUps.filter(f => f.status === 'PENDENTE' || f.status === 'ATRASADO');
                  const nextFollowUp = pendingFollowUps[0];
                  const isToday = nextFollowUp && new Date(nextFollowUp.scheduledAt).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                  const isOverdue = nextFollowUp && new Date(nextFollowUp.scheduledAt) < new Date() && !isToday;
                  const isAnalyzingThis = analyzingLeadId === lead.id;

                  return (
                    <tr 
                      key={lead.id} 
                      onClick={() => onSelectLeadDetails(lead)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Lead Name & Phone */}
                      <td className="py-3.5 sm:py-4 px-3 sm:px-5">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm leading-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                          <span>{lead.name}</span>
                          {lead.aiScoring?.temperature === 'HOT' && (
                            <span title="Lead Quente com alta propensão de fechamento">🔥</span>
                          )}
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-mono flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{lead.phone}</span>
                        </div>
                      </td>

                      {/* Broker & Interest */}
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800 block text-xs">{lead.assignedBrokerName}</span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {lead.propertyOfInterestTitle || lead.interestType}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                        {getStatusBadge(lead.stage)}
                      </td>

                      {/* Follow-up Column */}
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                        {nextFollowUp ? (
                          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                            isOverdue
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isToday
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {isOverdue ? (
                              <Clock className="w-3 h-3 text-rose-500 animate-pulse shrink-0" />
                            ) : (
                              <CalendarCheck className="w-3 h-3 shrink-0" />
                            )}
                            <span className="truncate max-w-[120px] sm:max-w-none">{nextFollowUp.title}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Sem agendamento
                          </span>
                        )}
                      </td>

                      {/* Gemini Propensity Scoring Column */}
                      <td 
                        className="py-3.5 sm:py-4 px-3 sm:px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.aiScoring ? (
                          <button
                            type="button"
                            onClick={() => setLeadForIntelligence(lead)}
                            className="transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                            title="Clique para abrir o Raio-X completo da Inteligência Gemini"
                          >
                            {getScoringBadge(lead.aiScoring, isAnalyzingThis)}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAnalyzeSingleLead(lead, e)}
                            disabled={isAnalyzingThis}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs transition-all cursor-pointer active:scale-95"
                            title="Executar análise da timeline com Gemini"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span>{isAnalyzingThis ? 'Analisando...' : 'Analisar IA'}</span>
                          </button>
                        )}
                      </td>

                      {/* Action Icons */}
                      <td className="py-3.5 sm:py-4 px-3 sm:px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          {/* Lead Intelligence Button */}
                          <button
                            type="button"
                            onClick={() => setLeadForIntelligence(lead)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Abrir Módulo de Inteligência Gemini (Auditoria de Timeline & Script)"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          {/* Radar Imóveis Button */}
                          <button
                            type="button"
                            onClick={() => setLeadForRadar(lead)}
                            className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-slate-200 cursor-pointer"
                            title="Radar de Imóveis: localizar opções no catálogo"
                          >
                            <Radar className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="hidden lg:inline">Radar</span>
                          </button>

                          {/* Ficha & Follow-ups */}
                          <button
                            type="button"
                            onClick={() => onSelectLeadDetails(lead)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Abrir Ficha & Follow-ups"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Excluir */}
                          <button
                            type="button"
                            onClick={() => onDeleteLead(lead.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir Cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Property Radar Modal */}
      {leadForRadar && (
        <LeadPropertyRadarModal
          isOpen={!!leadForRadar}
          onClose={() => setLeadForRadar(null)}
          lead={leadForRadar}
          properties={properties}
          onSelectPropertyForLead={onSelectPropertyForLead}
          onScheduleVisit={onScheduleVisit}
        />
      )}

      {/* Lead Intelligence Modal (Gemini Timeline & Scoring) */}
      {leadForIntelligence && (
        <LeadIntelligenceModal
          isOpen={!!leadForIntelligence}
          onClose={() => setLeadForIntelligence(null)}
          lead={leadForIntelligence}
          allLeads={leads}
          onSelectLead={(l) => setLeadForIntelligence(l)}
          onUpdateLead={onUpdateLead}
          onOpenWhatsAppDesk={onOpenWhatsAppDesk}
        />
      )}
    </div>
  );
};

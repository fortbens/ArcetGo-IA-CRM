import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  ArrowRight,
  Zap,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Sliders,
  ShieldCheck,
  Columns
} from 'lucide-react';
import { Lead } from '../../types/crm';

interface ExecutiveSalesFunnelRechartsProps {
  leads?: Lead[];
  onNavigateToTab?: (tabId: string) => void;
  selectedBranch?: string;
}

export interface FunnelStageData {
  id: string;
  name: string;
  shortName: string;
  count: number;
  vgv: number;
  color: string;
  gradient: string;
  conversionFromPrev: number; // % converted from previous stage (100% for first)
  dropoffRate: number; // % lost
  dropoffCount: number;
  dropoffReason: string;
  avgTimeDays: number; // average time spent in this stage
  slaStatus: 'EXCELENTE' | 'ATENCAO' | 'CRITICO';
}

export const ExecutiveSalesFunnelRecharts: React.FC<ExecutiveSalesFunnelRechartsProps> = ({
  leads = [],
  onNavigateToTab,
  selectedBranch = 'TODAS'
}) => {
  // Chart visual presentation tab
  const [activeChartType, setActiveChartType] = useState<'FUNNEL' | 'CONVERSION_BARS' | 'FINANCIAL_VGV'>('FUNNEL');
  // Interactive filters
  const [funnelPeriod, setFunnelPeriod] = useState<'MES_ATUAL' | 'TRIMESTRE' | 'ANO_2026'>('MES_ATUAL');
  const [selectedChannel, setSelectedChannel] = useState<'TODOS' | 'PORTAIS' | 'ADS' | 'INDICACAO' | 'PLACAS'>('TODOS');
  // Interactive simulation slider (+X% conversion boost)
  const [showSimulation, setShowSimulation] = useState(false);
  const [conversionBoostPercent, setConversionBoostPercent] = useState<number>(5);

  // Compute or baseline pipeline funnel stages
  const funnelStages: FunnelStageData[] = useMemo(() => {
    // Dynamic multiplier based on period filter
    const periodMultiplier = funnelPeriod === 'ANO_2026' ? 10.5 : funnelPeriod === 'TRIMESTRE' ? 2.9 : 1.0;
    
    // Channel weight
    const channelMultiplier = selectedChannel === 'TODOS' ? 1.0 : selectedChannel === 'PORTAIS' ? 0.45 : selectedChannel === 'ADS' ? 0.32 : 0.15;
    
    const scale = periodMultiplier * channelMultiplier;

    // Base pipeline numbers for realistic high-end real estate brokerage
    const baseNewLeads = Math.round(1240 * scale);
    const baseQualified = Math.round(680 * scale);
    const baseVisits = Math.round(290 * scale);
    const baseProposals = Math.round(110 * scale);
    const baseLegalCredit = Math.round(75 * scale);
    const baseClosedDeals = Math.round(62 * scale);

    const stages: FunnelStageData[] = [
      {
        id: 'stage_1',
        name: '1. Captação & Novos Contatos',
        shortName: '1. Novos Leads',
        count: baseNewLeads,
        vgv: baseNewLeads * 1180000,
        color: '#6366f1', // Indigo
        gradient: 'from-indigo-600 to-indigo-700',
        conversionFromPrev: 100,
        dropoffRate: 0,
        dropoffCount: 0,
        dropoffReason: 'Início do funil comercial',
        avgTimeDays: 0.5,
        slaStatus: 'EXCELENTE'
      },
      {
        id: 'stage_2',
        name: '2. Qualificação & 1º Atendimento',
        shortName: '2. Qualificados',
        count: baseQualified,
        vgv: baseQualified * 1220000,
        color: '#8b5cf6', // Purple
        gradient: 'from-purple-600 to-purple-700',
        conversionFromPrev: Number(((baseQualified / baseNewLeads) * 100).toFixed(1)),
        dropoffRate: Number((((baseNewLeads - baseQualified) / baseNewLeads) * 100).toFixed(1)),
        dropoffCount: baseNewLeads - baseQualified,
        dropoffReason: 'Fora de perfil financeiro ou sem resposta',
        avgTimeDays: 1.2,
        slaStatus: 'EXCELENTE'
      },
      {
        id: 'stage_3',
        name: '3. Visitas Agendadas & Realizadas',
        shortName: '3. Visitas Feitas',
        count: baseVisits,
        vgv: baseVisits * 1250000,
        color: '#06b6d4', // Cyan
        gradient: 'from-cyan-600 to-cyan-700',
        conversionFromPrev: Number(((baseVisits / baseQualified) * 100).toFixed(1)),
        dropoffRate: Number((((baseQualified - baseVisits) / baseQualified) * 100).toFixed(1)),
        dropoffCount: baseQualified - baseVisits,
        dropoffReason: 'Desistência de agenda ou imóvel incompatível',
        avgTimeDays: 4.8,
        slaStatus: 'ATENCAO'
      },
      {
        id: 'stage_4',
        name: '4. Propostas Formais em Negociação',
        shortName: '4. Propostas',
        count: baseProposals,
        vgv: baseProposals * 1260000,
        color: '#f59e0b', // Amber
        gradient: 'from-amber-600 to-amber-700',
        conversionFromPrev: Number(((baseProposals / baseVisits) * 100).toFixed(1)),
        dropoffRate: Number((((baseVisits - baseProposals) / baseVisits) * 100).toFixed(1)),
        dropoffCount: baseVisits - baseProposals,
        dropoffReason: 'Gargalo Crítico: Desistência após visita ou preço',
        avgTimeDays: 5.4,
        slaStatus: 'CRITICO'
      },
      {
        id: 'stage_5',
        name: '5. Análise de Crédito & Jurídico (CCA)',
        shortName: '5. Crédito / Jurídico',
        count: baseLegalCredit,
        vgv: baseLegalCredit * 1270000,
        color: '#10b981', // Emerald
        gradient: 'from-emerald-600 to-emerald-700',
        conversionFromPrev: Number(((baseLegalCredit / baseProposals) * 100).toFixed(1)),
        dropoffRate: Number((((baseProposals - baseLegalCredit) / baseProposals) * 100).toFixed(1)),
        dropoffCount: baseProposals - baseLegalCredit,
        dropoffReason: 'Contraproposta rejeitada pelo proprietário',
        avgTimeDays: 7.2,
        slaStatus: 'EXCELENTE'
      },
      {
        id: 'stage_6',
        name: '6. Contratos Assinados & Fechamento',
        shortName: '6. Vendas Fechadas',
        count: baseClosedDeals,
        vgv: baseClosedDeals * 1285000,
        color: '#059669', // Dark Emerald
        gradient: 'from-emerald-700 to-teal-800',
        conversionFromPrev: Number(((baseClosedDeals / baseLegalCredit) * 100).toFixed(1)),
        dropoffRate: Number((((baseLegalCredit - baseClosedDeals) / baseLegalCredit) * 100).toFixed(1)),
        dropoffCount: baseLegalCredit - baseClosedDeals,
        dropoffReason: 'Reprovação de documentação cartorária ou crédito',
        avgTimeDays: 6.0,
        slaStatus: 'EXCELENTE'
      }
    ];

    return stages;
  }, [funnelPeriod, selectedChannel]);

  // Overall Global conversion (Stage 1 -> Stage 6)
  const globalConversionRate = useMemo(() => {
    if (!funnelStages.length) return 0;
    const first = funnelStages[0].count;
    const last = funnelStages[funnelStages.length - 1].count;
    if (first === 0) return 0;
    return Number(((last / first) * 100).toFixed(2));
  }, [funnelStages]);

  const totalClosedVgv = useMemo(() => {
    if (!funnelStages.length) return 0;
    return funnelStages[funnelStages.length - 1].vgv;
  }, [funnelStages]);

  const simulatedAdditionalDeals = useMemo(() => {
    if (!funnelStages.length) return { deals: 0, vgv: 0 };
    const firstCount = funnelStages[0].count;
    const additionalDeals = Math.round(firstCount * (conversionBoostPercent / 100));
    const additionalVgv = additionalDeals * 1250000;
    return { deals: additionalDeals, vgv: additionalVgv };
  }, [funnelStages, conversionBoostPercent]);

  // Format currency helper
  const formatMoney = (val: number) => {
    if (val >= 1000000) {
      return `R$ ${(val / 1000000).toFixed(2)}M`;
    }
    if (val >= 1000) {
      return `R$ ${(val / 1000).toFixed(0)}k`;
    }
    return `R$ ${val.toLocaleString('pt-BR')}`;
  };

  // Recharts Funnel data structure
  const rechartsFunnelData = useMemo(() => {
    return funnelStages.map((stage) => ({
      name: stage.shortName,
      fullName: stage.name,
      value: stage.count,
      vgv: stage.vgv,
      fill: stage.color,
      conversion: stage.conversionFromPrev,
      dropoff: stage.dropoffRate,
      dropoffCount: stage.dropoffCount,
      avgDays: stage.avgTimeDays
    }));
  }, [funnelStages]);

  // Recharts Conversion Bars data structure
  const rechartsConversionBarsData = useMemo(() => {
    return funnelStages.slice(1).map((stage, idx) => {
      const prevStage = funnelStages[idx];
      return {
        stepLabel: `${prevStage.shortName.split('.')[1]} ➔ ${stage.shortName.split('.')[1]}`,
        taxaConversao: stage.conversionFromPrev,
        taxaPerda: stage.dropoffRate,
        leadsPerdidos: stage.dropoffCount,
        leadsAvancados: stage.count,
        motivo: stage.dropoffReason,
        benchmark: 40 // Standard real estate benchmark
      };
    });
  }, [funnelStages]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
      {/* 1. Header with Controls & Actionable Filters */}
      <div className="p-5 sm:p-7 border-b border-slate-100 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Funil de Vendas Executivo • Recharts BI
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Taxas de Passagem Passo a Passo
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Funil de Vendas & Taxas de Conversão do Pipeline</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitore a eficiência de cada etapa do pipeline comercial: do lead captado nos portais até a assinatura do contrato e faturamento do VGV, identificando gargalos e oportunidades de alavancagem.
            </p>
          </div>

          {/* Controls: Period, Channel & Navigation */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period Switcher */}
            <div className="bg-slate-800/90 backdrop-blur-md p-1 rounded-2xl flex items-center gap-1 border border-slate-700">
              <button
                onClick={() => setFunnelPeriod('MES_ATUAL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  funnelPeriod === 'MES_ATUAL'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mês Atual
              </button>
              <button
                onClick={() => setFunnelPeriod('TRIMESTRE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  funnelPeriod === 'TRIMESTRE'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3º Trimestre
              </button>
              <button
                onClick={() => setFunnelPeriod('ANO_2026')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  funnelPeriod === 'ANO_2026'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ano 2026
              </button>
            </div>

            {/* Channel Filter */}
            <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl px-3 py-1.5 text-xs flex items-center gap-1.5 text-slate-200">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value as any)}
                className="bg-transparent font-bold text-xs text-white outline-none cursor-pointer"
              >
                <option value="TODOS" className="bg-slate-900 text-white">Todos os Canais</option>
                <option value="PORTAIS" className="bg-slate-900 text-white">Portais (ZAP, VivaReal, OLX)</option>
                <option value="ADS" className="bg-slate-900 text-white">Tráfego Pago (Meta & Google)</option>
                <option value="INDICACAO" className="bg-slate-900 text-white">Indicações & Carteira</option>
                <option value="PLACAS" className="bg-slate-900 text-white">Placas & QR Codes</option>
              </select>
            </div>

            {/* Link to Kanban */}
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('kanban')}
                className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Columns className="w-4 h-4 text-indigo-300" />
                <span>Ver Kanban</span>
              </button>
            )}

            {/* Toggle Simulation */}
            <button
              onClick={() => setShowSimulation(!showSimulation)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                showSimulation
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Simular Alavancagem (+5%)</span>
            </button>
          </div>
        </div>

        {/* What-if Simulator Drawer / Banner */}
        {showSimulation && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-amber-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Simulador de Alavancagem de Conversão
                </h4>
                <p className="text-xs text-amber-200/90">
                  Ajuste o ganho percentual na conversão geral do pipeline para projetar o impacto direto no VGV:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">+</span>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={conversionBoostPercent}
                  onChange={(e) => setConversionBoostPercent(Number(e.target.value))}
                  className="accent-amber-400 cursor-pointer w-28 sm:w-36"
                />
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-xs font-black">
                  +{conversionBoostPercent}%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs font-bold">
                <span className="text-slate-400 block text-[10px] uppercase">Impacto Direto</span>
                <span className="text-emerald-400 font-black">
                  +{simulatedAdditionalDeals.deals} Vendas ({formatMoney(simulatedAdditionalDeals.vgv)})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 sm:px-7 space-y-6">
        {/* 2. Top Executive KPI Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Top of Funnel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Topo do Funil (Leads)
              </span>
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {funnelStages[0]?.count.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{formatMoney(funnelStages[0]?.vgv || 0)} em pipeline bruto</span>
            </div>
          </div>

          {/* Card 2: Global Conversion Rate */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Conversão Global (Topo ➔ Fim)
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Percent className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-600">
              {globalConversionRate}%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Benchmark mercado: 2.8% a 4.0% (Acima da média)</span>
            </div>
          </div>

          {/* Card 3: Closed VGV */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                VGV Fechado (Fundo de Funil)
              </span>
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatMoney(totalClosedVgv)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <span>{funnelStages[funnelStages.length - 1]?.count} contratos assinados</span>
            </div>
          </div>

          {/* Card 4: Critical Bottleneck */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Maior Ponto de Fuga
              </span>
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <AlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-900">
              Visitas ➔ Propostas
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              <span>62.1% de drop-off (Oportunidade de alinhamento)</span>
            </div>
          </div>
        </div>

        {/* 3. Recharts Visual Chart Container with Sub-Tabs */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Visualização Gráfica Interativa (Recharts)
              </h3>
            </div>

            {/* Visual Mode Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveChartType('FUNNEL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeChartType === 'FUNNEL'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Funil Visual
              </button>
              <button
                onClick={() => setActiveChartType('CONVERSION_BARS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeChartType === 'CONVERSION_BARS'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Taxas de Passagem (%)
              </button>
              <button
                onClick={() => setActiveChartType('FINANCIAL_VGV')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeChartType === 'FINANCIAL_VGV'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                VGV por Etapa (R$)
              </button>
            </div>
          </div>

          {/* VIEW A: Recharts FunnelChart */}
          {activeChartType === 'FUNNEL' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 h-80 sm:h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 text-white p-3.5 rounded-2xl shadow-xl text-xs space-y-1.5">
                              <div className="font-bold text-indigo-300 text-sm">{data.fullName}</div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Volume de Leads:</span>
                                <span className="font-bold text-white">{data.value.toLocaleString('pt-BR')}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">VGV na Etapa:</span>
                                <span className="font-bold text-emerald-400">{formatMoney(data.vgv)}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Conversão da Etapa Anterior:</span>
                                <span className="font-bold text-amber-400">{data.conversion}%</span>
                              </div>
                              {data.dropoff > 0 && (
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-400">Taxa de Perda / Drop-off:</span>
                                  <span className="font-bold text-rose-400">{data.dropoff}% ({data.dropoffCount} leads)</span>
                                </div>
                              )}
                              <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 text-[11px]">
                                <span className="text-slate-400">Tempo Médio na Etapa:</span>
                                <span className="text-slate-200">{data.avgDays} dias</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Funnel
                      dataKey="value"
                      data={rechartsFunnelData}
                      isAnimationActive
                    >
                      {rechartsFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>

              {/* Legend & Breakdown Next to Recharts Funnel */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Detalhamento de Passagem do Funil
                </div>
                {funnelStages.map((st, i) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: st.color }}
                      />
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{st.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {st.count.toLocaleString('pt-BR')} leads • {formatMoney(st.vgv)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {i === 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                          100% Início
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black ${
                            st.conversionFromPrev >= 50
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : st.conversionFromPrev >= 35
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {st.conversionFromPrev}% conv.
                          </span>
                          <div className="text-[10px] text-rose-400">
                            -{st.dropoffRate}% perda
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW B: Recharts Conversion Bars (% between steps) */}
          {activeChartType === 'CONVERSION_BARS' && (
            <div className="space-y-4">
              <div className="h-80 sm:h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rechartsConversionBarsData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                    <XAxis
                      dataKey="stepLabel"
                      stroke="#94a3b8"
                      fontSize={11}
                      interval={0}
                      angle={-10}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 text-white p-3.5 rounded-2xl shadow-xl text-xs space-y-1.5">
                              <div className="font-bold text-indigo-300 text-sm">{item.stepLabel}</div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Taxa de Conversão:</span>
                                <span className="font-black text-emerald-400">{item.taxaConversao}%</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Taxa de Perda / Fuga:</span>
                                <span className="font-black text-rose-400">{item.taxaPerda}%</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Leads Perdidos:</span>
                                <span className="font-bold text-white">{item.leadsPerdidos} leads</span>
                              </div>
                              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                                <span className="text-amber-400 font-semibold">Causa provável: </span>
                                {item.motivo}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar
                      dataKey="taxaConversao"
                      name="Taxa de Conversão para Próxima Etapa (%)"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="taxaPerda"
                      name="Taxa de Perda / Abandono (%)"
                      fill="#f43f5e"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                <span>
                  💡 <strong>Diagnóstico de Eficiência:</strong> A etapa com maior taxa de conversão é <strong>Crédito / Jurídico ➔ Fechamento (82.7%)</strong>, demonstrando alta efetividade de fechamento uma vez que a documentação é aprovada.
                </span>
              </div>
            </div>
          )}

          {/* VIEW C: Financial VGV in Negotiation per Stage */}
          {activeChartType === 'FINANCIAL_VGV' && (
            <div className="space-y-4">
              <div className="h-80 sm:h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rechartsFunnelData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      interval={0}
                      angle={-10}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatMoney(Number(val)), 'VGV em Pipeline']}
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar
                      dataKey="vgv"
                      name="VGV Financeiro em Movimentação (R$)"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                    >
                      {rechartsFunnelData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                <span>
                  💰 <strong>VGV em Carteira Ativa:</strong> Há atualmente <strong>{formatMoney(funnelStages[3]?.vgv || 0)}</strong> em propostas em negociação direta aguardando contraproposta do proprietário.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Highlighted Step-by-Step Conversion Ribbon with Metric Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Pipeline Passo a Passo: Transições, Conversões e Gargalos</span>
            </h3>
            <span className="text-xs text-slate-500">
              Taxa de passagem entre cada degrau consecutivo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funnelStages.slice(1).map((currentStage, idx) => {
              const previousStage = funnelStages[idx];
              const isBottleneck = currentStage.dropoffRate > 50;

              return (
                <div
                  key={currentStage.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isBottleneck
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {/* Step Transition Header */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      Degrau {idx + 1} ➔ {idx + 2}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                      isBottleneck
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isBottleneck ? 'Gargalo de Passagem' : 'Fluxo Saudável'}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-600 truncate">{previousStage.shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="text-indigo-900 font-extrabold truncate">{currentStage.shortName}</span>
                  </div>

                  {/* Highlights Metric Box */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">
                        Taxa de Conversão
                      </span>
                      <span className="text-base font-black text-emerald-600">
                        {currentStage.conversionFromPrev}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {currentStage.count} leads avançaram
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">
                        Taxa de Fuga / Perda
                      </span>
                      <span className="text-base font-black text-rose-600">
                        {currentStage.dropoffRate}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        -{currentStage.dropoffCount} descartados
                      </span>
                    </div>
                  </div>

                  {/* Details / Motivo */}
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tempo médio na etapa:</span>
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {currentStage.avgTimeDays} dias
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      <strong>Causa principal:</strong> {currentStage.dropoffReason}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Executive Action Plan for Directors (Insights de Melhoria) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-indigo-950">
                Plano de Ação para o Diretor: Como Aumentar a Conversão Geral de 5.0% para 6.5%
              </h4>
              <p className="text-indigo-800 leading-relaxed max-w-3xl">
                1. <strong>Treinamento de Fechamento na Visita:</strong> Implementar ficha técnica e pré-proposta digital durante a visita presencial para mitigar a perda de 62.1%.<br />
                2. <strong>Velocidade no 1º Contato (SLA Roleta):</strong> Leads respondidos em até 5 minutos convertem 4.2x mais para a visita.<br />
                3. <strong>Pré-Aprovação de Crédito via CCA:</strong> Simular financiamento bancário antes da proposta reduz recusas documentais a zero.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('bi_performance')}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Ver BI Completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Users, 
  ArrowRight, 
  Layers, 
  BarChart3, 
  MessageSquare, 
  FileCheck2, 
  KeyRound, 
  Smartphone, 
  Award, 
  Calculator, 
  ChevronRight,
  HelpCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface RentalMarketBenchmarksViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const RentalMarketBenchmarksView: React.FC<RentalMarketBenchmarksViewProps> = ({ onNavigateToTab }) => {
  // Interactive ROI Calculator State
  const [managedContracts, setManagedContracts] = useState<number>(120);
  const [avgRent, setAvgRent] = useState<number>(3800);
  const [advancePenetrationRate, setAdvancePenetrationRate] = useState<number>(15); // % of owners who advance
  const [insurancePenetrationRate, setInsurancePenetrationRate] = useState<number>(65); // % of contracts with digital insurance

  // Financial Projections
  const monthlyTotalRent = managedContracts * avgRent;
  const annualTotalRent = monthlyTotalRent * 12;
  const regularAdminFeeMonthly = monthlyTotalRent * 0.10; // 10% padrão
  const regularAdminFeeAnnual = regularAdminFeeMonthly * 12;

  // New revenue streams:
  // 1. Antecipação de Aluguel (Originação 2% sobre volume antecipado de 10 meses em média)
  const advancingContracts = Math.round(managedContracts * (advancePenetrationRate / 100));
  const advanceVolumeAnnual = advancingContracts * (avgRent * 10);
  const originationFeeAnnual = advanceVolumeAnnual * 0.02; // 2% comissão imobiliária

  // 2. Corretagem / Comissão de Garantia Locatícia (12% a 15% sobre o custo da apólice mensal: apólice ~10% do aluguel)
  const insuredContracts = Math.round(managedContracts * (insurancePenetrationRate / 100));
  const annualInsuranceCommission = insuredContracts * (avgRent * 0.10 * 0.15) * 12;

  // 3. Economia de tempo operacional com Régua WhatsApp & Split Automático (estimativa ~40h/mês = ~R$ 1.600/mês)
  const operationalSavingsAnnual = 19200;

  // Total New Net Gain
  const totalExtraAnnualGain = originationFeeAnnual + annualInsuranceCommission + operationalSavingsAnnual;
  const revenueGrowthPercent = Math.round((totalExtraAnnualGain / regularAdminFeeAnnual) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase bg-blue-500/30 text-blue-300 border border-blue-400/40 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-300" />
                Diferenciais & Benchmarking de Mercado
              </span>
              <span className="text-xs text-slate-300 font-mono">
                PropTech & Imobiliária 4.0
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
              Como Superar Startups & Gigantes da Locação
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              O mercado imobiliário mudou radicalmente com QuintoAndar, Loft e fintechs de aluguel. 
              Com a <strong>AcertGo</strong>, sua imobiliária oferece a <strong>mesma experiência 100% digital</strong>, 
              mantendo <strong>100% da receita de taxa de administração para sua empresa</strong>, sem intermediários.
            </p>
          </div>

          {/* Quick Pillars Counter */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Receita Retida</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">100%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sem taxa de franquia</span>
            </div>
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Velocidade Fechamento</span>
              <span className="text-2xl font-black text-amber-300 font-mono">24 Horas</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sem fiador ou cartório</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Strategic Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Antecipação de Recebíveis FIDC */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Fintech Capital
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-1.5">
                Antecipação de Aluguéis (FIDC)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Proprietários adiantam de 1 a 24 meses à vista no Pix. Sua imobiliária fatura <strong>2% de comissão de originação</strong> e fideliza o proprietário por anos.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('antecipacao')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <span>Abrir Simulador FIDC</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 2: Hub Multi-Seguradoras */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Zero Fiador
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-1.5">
                Hub Multi-Seguradoras
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cotação simultânea (Porto Seguro, CredPago, Velo, Pottencial) e aprovação de crédito em 15 minutos via CPF. Sinistro acionável em 1 clique.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('seguradoras')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
          >
            <span>Ver Hub de Seguradoras</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 3: Régua Omnichannel WhatsApp */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Régua Ativa
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-1.5">
                Notificações WhatsApp & Pix
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Disparos automáticos no WhatsApp do inquilino com Chave Pix Copia & Cola (D-5, D-1) e recibos instantâneos. Reduz a inadimplência em até 68%.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('notificacoes')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700 hover:text-indigo-800 cursor-pointer"
          >
            <span>Central de Notificações</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 4: Split Bancário de Herdeiros */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                Automação Fiscal
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-1.5">
                Split Pix & DIMOB Automática
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Divisão bancária automática do aluguel entre múltiplos herdeiros e coproprietários. Integração com DIMOB oficial sem bitributação.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('repasses')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
          >
            <span>Ver Repasses com Split</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Benchmarking Comparison Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Matriz Comparativa de Mercado: AcertGo vs Concorrentes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Análise detalhada de recursos, independência e rentabilidade para a imobiliária
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold font-mono self-start sm:self-auto">
            Atualizado 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                <th className="py-3 px-4 font-bold rounded-l-xl">Recurso / Diferencial</th>
                <th className="py-3 px-3 font-black text-blue-700 bg-blue-50/70 border-x border-blue-100 text-center">
                  AcertGo Imob FinTech
                </th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-center">QuintoAndar</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-center">Loft / CredPago</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-center">Superlógica</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-center rounded-r-xl">Alude / Kenlo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold">
                  <span>Antecipação de Aluguéis para Proprietário (FIDC)</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Até 12 a 24 meses em 24h</span>
                </td>
                <td className="py-3 px-3 text-center bg-blue-50/30 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Nativo (Ganhe 2%)</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Sim (Taxa Alta)</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Parceria Externa</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Módulo Pago PJBank</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-500 font-medium flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Não nativo
                  </span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold">
                  <span>Hub Multi-Seguradoras (Zero Fiador)</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Porto, CredPago, Velo, Pottencial</span>
                </td>
                <td className="py-3 px-3 text-center bg-blue-50/30 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Multi-Hub Aberto</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Exclusivo QuintoAndar</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Apenas CredPago</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Limitado</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Parceiros Avulsos</span>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold">
                  <span>Régua Ativa WhatsApp com Chave Pix Dinâmica</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Avisos D-5, D-1, D0 e comprovantes</span>
                </td>
                <td className="py-3 px-3 text-center bg-blue-50/30 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Oficial Integrado</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Sim (App próprio)</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Parcial</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Apenas Boleto E-mail</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Disparo Manual</span>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold">
                  <span>Split Bancário para Herdeiros & Coproprietários</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Liquidação Pix dividida por percentual</span>
                </td>
                <td className="py-3 px-3 text-center bg-blue-50/30 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Multi-Beneficiários Pix</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-500 font-medium flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Apenas 1 titular
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-500 font-medium flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Não possui
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Complexo / Manual</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-500 font-medium flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Não possui
                  </span>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold">
                  <span>Retenção de 100% da Taxa de Administração</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Sem repassar 8% a 10% para franqueadora</span>
                </td>
                <td className="py-3 px-3 text-center bg-blue-50/30 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% da Imobiliária</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-500 font-medium">Retém quase tudo</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Cobra comissão alta</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Cobra por boleto emitido</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">100% da Imobiliária</span>
                </td>
              </tr>

              {/* Row 6 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold">
                  <span>Portal do Cliente White-Label (Marca da Imobiliária)</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Inquilino e proprietário não veem marcas terceiras</span>
                </td>
                <td className="py-3 px-3 text-center bg-blue-50/30 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% Sua Marca</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-500 font-medium">Marca QuintoAndar</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-500 font-medium">Marca Loft / CredPago</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Área do Condômino</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-slate-500 font-medium">Portal Básico</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive ROI Calculator Section */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h3 className="font-black text-white text-base sm:text-lg">
                Simulador de Nova Receita & ROI da Carteira de Locação
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Descubra quanto sua imobiliária fatura a mais agregando <strong>Fintech & Seguradoras</strong> à locação tradicional
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono self-start sm:self-auto">
            Monetização Ativa
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders (6 cols) */}
          <div className="lg:col-span-6 space-y-5 bg-white/5 p-5 rounded-2xl border border-white/10">
            {/* Slider 1: Managed Contracts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Contratos Administrados na Carteira:
                </label>
                <span className="text-lg font-black text-white font-mono">
                  {managedContracts} contratos
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={5}
                value={managedContracts}
                onChange={(e) => setManagedContracts(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>20</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>

            {/* Slider 2: Average Rent */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Aluguel Médio da Carteira:
                </label>
                <span className="text-lg font-black text-white font-mono">
                  R$ {avgRent.toLocaleString('pt-BR')}
                </span>
              </div>
              <input
                type="range"
                min={1500}
                max={15000}
                step={250}
                value={avgRent}
                onChange={(e) => setAvgRent(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>R$ 1.500</span>
                <span>R$ 7.500</span>
                <span>R$ 15.000</span>
              </div>
            </div>

            {/* Slider 3: % Antecipação */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Proprietários que Antecipam Aluguel:
                </label>
                <span className="text-lg font-black text-amber-300 font-mono">
                  {advancePenetrationRate}% ({advancingContracts} contratos)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={advancePenetrationRate}
                onChange={(e) => setAdvancePenetrationRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5% (Conservador)</span>
                <span>20% (Média de Mercado)</span>
                <span>40% (Alto Engajamento)</span>
              </div>
            </div>
          </div>

          {/* Results Summary (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300">Receita Tradicional (Taxa Adm 10%):</span>
                <span className="font-bold font-mono text-slate-200">
                  R$ {regularAdminFeeAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                </span>
              </div>

              <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  + Comissão Originação Antecipação (2%):
                </span>
                <span className="font-black font-mono text-emerald-400 text-sm">
                  + R$ {originationFeeAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                </span>
              </div>

              <div className="p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-between text-xs">
                <span className="text-blue-300 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  + Corretagem de Seguros & Garantias:
                </span>
                <span className="font-black font-mono text-blue-400 text-sm">
                  + R$ {annualInsuranceCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                </span>
              </div>

              <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center justify-between text-xs">
                <span className="text-purple-300 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  + Economia Operacional (WhatsApp & Split):
                </span>
                <span className="font-black font-mono text-purple-300 text-sm">
                  + R$ {operationalSavingsAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
                </span>
              </div>
            </div>

            {/* Total Big Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
                  Ganho Líquido Adicional Anual
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5">
                  + R$ {totalExtraAnnualGain.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-emerald-200 mt-1 block">
                  Aumento de <strong>+{revenueGrowthPercent}%</strong> no resultado líquido anual da sua carteira
                </span>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Experience (CX) Framework for Tenants & Owners */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div>
          <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Excelência na Experiência do Cliente (Inquilinos & Proprietários)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Jornada sem fricção que elimina o atrito tradicional da locação e gera retenção recorde
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tenant Experience */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm border-b border-slate-200 pb-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Experiência do Inquilino (Locatário)</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Fiador:</strong> Aluguel liberado em minutos via cartão de crédito ou seguro fiança, sem incomodar parentes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Pagamento Pix em 1 Toque:</strong> Chave Pix Copia & Cola no WhatsApp sem precisar abrir PDF de boleto.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Recibo Instantâneo:</strong> Baixa automática em 5 segundos com emissão de recibo digital de quitação.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Portal 24/7 de Chamados:</strong> Abertura de reparos, vistorias e informe de rendimentos para IRPF direto no navegador.</span>
              </li>
            </ul>
          </div>

          {/* Owner Experience */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Experiência do Proprietário (Locador)</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Liquidez Imediata (Fintech):</strong> Acesso a capital de giro com antecipação de até 12 a 24 meses de aluguel futuro.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Aluguel Protegido:</strong> Indenização automática por seguradora com cobertura jurídica e de danos físicos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Split Automático para Família:</strong> Divisão exata dos valores para herdeiros no Pix sem confusão contábil.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>DIMOB & Carnê-Leão Pronto:</strong> Arquivo oficial gerado para declaração do imposto de renda sem erros.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

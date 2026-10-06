import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Building, 
  Percent, 
  FileCheck2, 
  Zap, 
  CreditCard, 
  Landmark, 
  Coins, 
  Search, 
  Check, 
  Clock, 
  Download,
  AlertTriangle,
  RefreshCw,
  Phone,
  FileText
} from 'lucide-react';
import { InsurancePolicyRecord, INITIAL_INSURANCE_POLICIES } from '../../data/mockRentalFintechData';

export const InsuranceGuaranteesHubView: React.FC = () => {
  const [policies, setPolicies] = useState<InsurancePolicyRecord[]>(INITIAL_INSURANCE_POLICIES);
  
  // Instant Credit Analyzer state
  const [analyzerCpf, setAnalyzerCpf] = useState('389.412.908-11');
  const [analyzerIncome, setAnalyzerIncome] = useState<number>(18000);
  const [analyzerRent, setAnalyzerRent] = useState<number>(4500);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    approved: boolean;
    score: number;
    commitmentPercent: number;
    recommendedInsurers: string[];
    maxRentAllowed: number;
  } | null>({
    approved: true,
    score: 870,
    commitmentPercent: 25,
    recommendedInsurers: ['Porto Seguro', 'CredPago', 'Velo'],
    maxRentAllowed: 5400
  });

  // Quotation trigger state
  const [quotedInsurer, setQuotedInsurer] = useState<string | null>(null);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const commitment = Math.round((analyzerRent / Math.max(1, analyzerIncome)) * 100);
      const isApproved = commitment <= 33;
      const score = isApproved ? 820 + Math.floor(Math.random() * 120) : 480;

      setAnalysisResult({
        approved: isApproved,
        score,
        commitmentPercent: commitment,
        recommendedInsurers: isApproved ? ['Porto Seguro', 'CredPago', 'Velo', 'Pottencial'] : ['Título de Capitalização (Caução)'],
        maxRentAllowed: Math.round(analyzerIncome * 0.33)
      });
      setIsAnalyzing(false);
    }, 700);
  };

  const handleSelectInsurerQuote = (insurer: string) => {
    setQuotedInsurer(insurer);
    setTimeout(() => setQuotedInsurer(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border border-blue-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase bg-blue-500/30 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Garantias Sem Fiador
              </span>
              <span className="text-xs text-slate-300 font-mono">Hub Multi-Seguradoras 100% Digital</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
              Aprovação Cadastral & Seguradoras Integradas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Elimine a necessidade de fiador tradicional ou comprovantes em cartório. 
              Aprove inquilinos em <strong>menos de 15 minutos</strong> com garantia total de pagamento de aluguel, condomínio, IPTU e danos ao imóvel para o proprietário.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Tempo de Análise</span>
              <span className="text-xl font-black text-emerald-300 font-mono">&lt; 15 min</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Via IA e Birôs de Crédito</span>
            </div>
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Aluguel Garantido</span>
              <span className="text-xl font-black text-white font-mono">100% Seguro</span>
              <span className="text-[10px] text-blue-300 block mt-0.5">Repasse sem Atraso</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Instant Pre-Approval Simulator & Marketplace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Instant Pre-Approval Tool (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Análise Cadastral Instantânea
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Score em 15 min
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CPF do Pretendente:</label>
              <input
                type="text"
                value={analyzerCpf}
                onChange={(e) => setAnalyzerCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Renda Mensal Comprovada:</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400">R$</span>
                  <input
                    type="number"
                    value={analyzerIncome}
                    onChange={(e) => setAnalyzerIncome(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valor do Aluguel Alvo:</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400">R$</span>
                  <input
                    type="number"
                    value={analyzerRent}
                    onChange={(e) => setAnalyzerRent(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Consultando Birôs & Score...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Consultar Pré-Aprovação Gratuita</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Result Box */}
          {analysisResult && (
            <div className={`p-4 rounded-xl border space-y-2.5 animate-fadeIn ${
              analysisResult.approved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  {analysisResult.approved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Cadastro Pré-Aprovado Sem Fiador
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Comprometimento de Renda Excedido
                    </>
                  )}
                </span>
                <span className="font-mono text-xs font-black">
                  Score {analysisResult.score}/1000
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-current/10">
                <div>
                  <span className="text-slate-500 block">Comprometimento:</span>
                  <span className="font-bold font-mono">{analysisResult.commitmentPercent}% da renda</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Aluguel Máximo Permitido:</span>
                  <span className="font-bold font-mono">R$ {analysisResult.maxRentAllowed.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-bold block mb-1">Garantias Recomendadas:</span>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.recommendedInsurers.map((ins, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-current/20 text-[10px] font-bold">
                      {ins}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Multi-Insurer Marketplace / Comparador (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Marketplace de Garantias Locatícias
                </h3>
                <p className="text-xs text-slate-500">
                  Cotação simultânea para o aluguel simulado de <strong>R$ {analyzerRent.toLocaleString('pt-BR')}/mês</strong>
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 font-mono">5 Opções Ativas</span>
            </div>

            {/* Provider 1: Porto Seguro */}
            <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 transition-all bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                    P
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Porto Seguro Aluguel Tradicional</h4>
                    <span className="text-[10px] text-slate-500">Apólice nº 1 do Brasil • Cobertura Máxima</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-blue-700 font-mono block">
                    R$ {Math.round(analyzerRent * 0.065)}/mês
                  </span>
                  <span className="text-[10px] text-slate-400">~6,5% do aluguel</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">Aluguel + Condomínio + IPTU</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Danos ao Imóvel (R$ 50k)</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold">Despejo com Advogado Porto</span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleSelectInsurerQuote('Porto Seguro')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{quotedInsurer === 'Porto Seguro' ? 'Cotação Emitida!' : 'Emitir Apólice Porto'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Provider 2: CredPago (Loft Fiança) */}
            <div className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 transition-all bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">CredPago (Fiança no Cartão de Crédito)</h4>
                    <span className="text-[10px] text-slate-500">Sem fiador • Aprovação em 15 minutos em até 12x no cartão</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-indigo-700 font-mono block">
                    R$ {Math.round(analyzerRent * 0.085)}/mês
                  </span>
                  <span className="text-[10px] text-slate-400">~8,5% do aluguel</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">Sem comprovação de renda em carteira</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">Limite do cartão apenas da taxa mensal</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Repasse garantido todo dia 15</span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleSelectInsurerQuote('CredPago')}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{quotedInsurer === 'CredPago' ? 'Cotação Emitida!' : 'Contratar CredPago'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Provider 3: Velo Fiança Digital */}
            <div className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 transition-all bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                    V
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Velo Fiança (Open Finance)</h4>
                    <span className="text-[10px] text-slate-500">Validação via extrato bancário instantâneo com menor taxa</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-purple-700 font-mono block">
                    R$ {Math.round(analyzerRent * 0.075)}/mês
                  </span>
                  <span className="text-[10px] text-slate-400">~7,5% do aluguel</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold">Validação Open Finance</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Cobertura de Pintura & Danos</span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleSelectInsurerQuote('Velo')}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{quotedInsurer === 'Velo' ? 'Cotação Emitida!' : 'Contratar Velo'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Provider 4: Título de Capitalização */}
            <div className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 transition-all bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Título de Capitalização (Icatu / Porto Cap)</h4>
                    <span className="text-[10px] text-slate-500">Caução remunerada (6x a 12x aluguel) com resgate 100% corrigido</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-teal-700 font-mono block">
                    R$ {(analyzerRent * 8).toLocaleString('pt-BR')} à vista
                  </span>
                  <span className="text-[10px] text-slate-400">8x caucionado (Zero custo mensal)</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleSelectInsurerQuote('Capitalização')}
                  className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{quotedInsurer === 'Capitalização' ? 'Cotação Emitida!' : 'Emitir Título de Caução'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Policies Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              Apólices & Garantias Vigentes na Carteira ({policies.length})
            </h4>
          </div>
          <span className="text-xs font-bold text-emerald-600 font-mono">100% dos Contratos Cobertos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-2.5 px-3">Contrato / Imóvel</th>
                <th className="py-2.5 px-3">Inquilino</th>
                <th className="py-2.5 px-3">Seguradora</th>
                <th className="py-2.5 px-3">Apólice nº</th>
                <th className="py-2.5 px-3">Custo / Mês</th>
                <th className="py-2.5 px-3">Vigência Até</th>
                <th className="py-2.5 px-3 text-right">Status da Cobertura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map((pol) => (
                <tr key={pol.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block font-mono">{pol.contractCode}</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">{pol.propertyAddress}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800">{pol.tenantName}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{pol.tenantCpf}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {pol.insurerName}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {pol.policyNumber}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                    {pol.monthlyCost > 0 ? `R$ ${pol.monthlyCost}/mês` : 'Caucionado à vista'}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {pol.expiresAt}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {pol.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

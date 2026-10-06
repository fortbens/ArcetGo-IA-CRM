import React, { useState } from 'react';
import { 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Calculator, 
  FileText, 
  Download, 
  Percent, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Check,
  Send,
  Sliders
} from 'lucide-react';
import { RentalContract } from '../../types/crm';
import { RentAdvanceProposal, INITIAL_RENT_ADVANCE_PROPOSALS } from '../../data/mockRentalFintechData';

interface RentAdvanceSimulatorViewProps {
  contracts: RentalContract[];
}

export const RentAdvanceSimulatorView: React.FC<RentAdvanceSimulatorViewProps> = ({ contracts }) => {
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [monthsToAdvance, setMonthsToAdvance] = useState<number>(12);
  const [discountRate, setDiscountRate] = useState<number>(1.89); // % a.m.
  const [proposals, setProposals] = useState<RentAdvanceProposal[]>(INITIAL_RENT_ADVANCE_PROPOSALS);
  const [showSuccessModal, setShowSuccessModal] = useState<RentAdvanceProposal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const rentValue = selectedContract?.monthlyRent || 5000;
  const adminFeePct = selectedContract?.adminFeePercentage || 10;

  // Financial calculations
  const grossTotal = rentValue * monthsToAdvance;
  // Compound discount estimation: PV = FV / (1 + r)^n simplified for monthly receivables
  const discountFactor = (discountRate / 100) * ((monthsToAdvance + 1) / 2);
  const discountAmount = Math.round(grossTotal * discountFactor);
  const adminFeeTotal = Math.round(grossTotal * (adminFeePct / 100));
  const agencyTakeRate = Math.round(grossTotal * 0.02); // 2% comissão de originação da imobiliária
  const netToOwner = Math.max(0, grossTotal - discountAmount - adminFeeTotal);

  const handleRequestAdvance = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newProposal: RentAdvanceProposal = {
        id: `adv_${Date.now()}`,
        contractCode: selectedContract?.code || 'LOC-NOVO',
        propertyAddress: selectedContract?.propertyAddress || 'Imóvel em carteira',
        ownerName: selectedContract?.ownerName || 'Proprietário Titular',
        ownerCpfCnpj: '123.456.789-00',
        ownerPixKey: selectedContract?.ownerPixKey || 'pix@proprietario.com.br',
        monthlyRent: rentValue,
        monthsRequested: monthsToAdvance,
        grossAmount: grossTotal,
        discountRateMonthly: discountRate,
        discountAmount,
        adminFeeAmount: adminFeeTotal,
        agencyTakeRateAmount: agencyTakeRate,
        netAmountToOwner: netToOwner,
        status: 'APROVADO',
        requestedAt: new Date().toISOString(),
        fundoParceiro: 'FIDC AcertGo Recebíveis • Banco BTG Pactual'
      };

      setProposals(prev => [newProposal, ...prev]);
      setShowSuccessModal(newProposal);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Value Proposition */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                Fintech AcertGo Capital
              </span>
              <span className="text-xs text-slate-300 font-mono">FIDC Integrado • Sem Burocracia</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
              Antecipação de Aluguéis para Proprietários
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Permita que seus proprietários recebam até <strong>12 meses de aluguel futuro à vista no Pix em até 24 horas</strong>. 
              Sua imobiliária retém antecipadamente a taxa de administração e ganha <strong>2% de comissão de originação</strong>!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Taxa a partir de</span>
              <span className="text-xl font-black text-emerald-300 font-mono">1,79% a.m.</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sem fiador ou imóvel em garantia</span>
            </div>
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Liberação Pix</span>
              <span className="text-xl font-black text-white font-mono">24 Horas</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Assinatura Digital CCB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Section & Comparative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Simulador Interativo de Recebíveis
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Cálculo em Tempo Real</span>
          </div>

          {/* Contract Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              1. Selecione o Contrato de Locação Ativo:
            </label>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} • {c.propertyAddress.slice(0, 38)}... (R$ {c.monthlyRent.toLocaleString('pt-BR')}/mês - {c.ownerName})
                </option>
              ))}
            </select>
          </div>

          {/* Months Slider */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Meses de Aluguel a Antecipar:
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {monthsToAdvance}
                </span>
                <span className="text-xs font-bold text-slate-500">meses</span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={monthsToAdvance}
              onChange={(e) => setMonthsToAdvance(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>1 mês (Curto prazo)</span>
              <span>6 meses (Semestral)</span>
              <span>12 meses (Anual integral)</span>
            </div>
          </div>

          {/* Rates config pill */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-3 py-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <span className="flex items-center gap-1.5 font-medium text-emerald-900">
              <Percent className="w-3.5 h-3.5 text-emerald-600" />
              Taxa de desconto aplicada pelo Fundo parceiro:
            </span>
            <span className="font-bold text-emerald-700 font-mono">{discountRate}% ao mês</span>
          </div>

          {/* Breakdown summary */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Valor Bruto dos Aluguéis ({monthsToAdvance}x R$ {rentValue.toLocaleString('pt-BR')}):</span>
              <span className="font-bold font-mono">R$ {grossTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between text-rose-600">
              <span>(-) Custo da Antecipação Financeira ({discountRate}% a.m.):</span>
              <span className="font-bold font-mono">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>(-) Taxa de Administração Imobiliária ({adminFeePct}% retida à vista):</span>
              <span className="font-bold font-mono">- R$ {adminFeeTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Receita Adicional da Imobiliária (Comissão 2% de Originação):
              </span>
              <span className="font-black font-mono text-purple-700">
                + R$ {agencyTakeRate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Total Net Result */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
                Valor Líquido Liberado no Pix do Proprietário
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5">
                R$ {netToOwner.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-emerald-200 mt-1 block">
                Disponível na conta bancária em até 24h úteis após formalização digital
              </span>
            </div>

            <button
              onClick={handleRequestAdvance}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-800 font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>{isSubmitting ? 'Gerando CCB...' : 'Contratar Antecipação'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Comparative & Benefits (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Comparison Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Comparativo de Fluxo Financeiro
            </h4>

            {/* Mês a mês */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Modelo Convencional (Mês a Mês)</span>
                <span className="text-slate-500 font-mono">12 Parcelas</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Proprietário aguarda 365 dias para receber o total diluído, correndo risco de atrasos ou vacância.
              </p>
            </div>

            {/* Com Antecipação AcertGo */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Modelo Fintech AcertGo (Antecipado)
                </span>
                <span className="text-emerald-700 font-mono font-bold">100% à Vista</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-tight">
                Recebe <strong>R$ {netToOwner.toLocaleString('pt-BR')}</strong> de uma só vez para investir, reformar ou quitar compromissos. O fundo parceiro assume o fluxo mensal.
              </p>
            </div>
          </div>

          {/* Value Pillars */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Por que oferecer antecipação?
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Fidelização do Proprietário:</strong> O imóvel fica travado com exclusividade na sua imobiliária pelo período antecipado.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Antecipação da Taxa de Adm:</strong> A imobiliária já recebe 100% da sua taxa de administração do ano todo à vista.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Nova Linha de Receita Fintech:</strong> 2% de comissão de originação paga pelo fundo FIDC parceiro diretamente na sua conta.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* History of Advances / Operações em Andamento */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              Operações de Antecipação Contratadas & Solicitadas ({proposals.length})
            </h4>
          </div>
          <span className="text-xs text-emerald-600 font-bold">Total Antecipado na Carteira: R$ 146.800</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-2.5 px-3">Contrato / Imóvel</th>
                <th className="py-2.5 px-3">Proprietário</th>
                <th className="py-2.5 px-3">Prazo</th>
                <th className="py-2.5 px-3">Bruto</th>
                <th className="py-2.5 px-3">Líquido Liberado</th>
                <th className="py-2.5 px-3">Comissão Imobiliária</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proposals.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block font-mono">{prop.contractCode}</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">{prop.propertyAddress}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800">{prop.ownerName}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-700 font-mono">{prop.monthsRequested} meses</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-600">
                    R$ {prop.grossAmount.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                    R$ {prop.netAmountToOwner.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-purple-600">
                    + R$ {prop.agencyTakeRateAmount.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      prop.status === 'DEPOSITADO_PIX'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prop.status === 'APROVADO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prop.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Antecipação Aprovada com Sucesso!
              </h3>
              <p className="text-xs text-slate-500">
                A Cédula de Crédito Bancário (CCB) e o Termo de Cessão de Recebíveis foram gerados para assinatura eletrônica do proprietário.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Contrato:</span>
                <span className="font-bold text-slate-800">{showSuccessModal.contractCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Valor Líquido Pix:</span>
                <span className="font-black text-emerald-600">R$ {showSuccessModal.netAmountToOwner.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comissão da Imobiliária:</span>
                <span className="font-black text-purple-600">+ R$ {showSuccessModal.agencyTakeRateAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parceiro Financeiro:</span>
                <span className="font-semibold text-slate-700">{showSuccessModal.fundoParceiro}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(null)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Fechar e Acompanhar Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

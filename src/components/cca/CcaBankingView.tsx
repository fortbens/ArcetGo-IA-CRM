import React, { useState } from 'react';
import { 
  Building, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calculator, 
  FileCheck, 
  ShieldCheck, 
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Check,
  Building2,
  User,
  CreditCard
} from 'lucide-react';
import { CreditProposalCCA, CCABankStage } from '../../types/crm';
import { TableScrollContainer } from '../common/TableScrollContainer';

interface CcaBankingViewProps {
  proposals: CreditProposalCCA[];
  onUpdateStage: (proposalId: string, newStage: CCABankStage) => void;
  onAddProposal?: (proposal: CreditProposalCCA) => void;
  onEditProposal?: (proposal: CreditProposalCCA) => void;
  onDeleteProposal?: (proposalId: string) => void;
}

export const CcaBankingView: React.FC<CcaBankingViewProps> = ({ 
  proposals: initialProposals, 
  onUpdateStage,
  onAddProposal,
  onEditProposal,
  onDeleteProposal
}) => {
  const [localProposals, setLocalProposals] = useState<CreditProposalCCA[]>(initialProposals);
  const proposals = localProposals;

  const [showSimulator, setShowSimulator] = useState(false);
  const [simPropertyValue, setSimPropertyValue] = useState(2000000);
  const [simDownPayment, setSimDownPayment] = useState(400000);
  const [simTermMonths, setSimTermMonths] = useState(360);

  // Proposal modal state
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<CreditProposalCCA | null>(null);

  // Proposal Form State
  const [formClientName, setFormClientName] = useState('');
  const [formClientCpf, setFormClientCpf] = useState('');
  const [formBank, setFormBank] = useState<'CAIXA_ECONOMICA' | 'ITAU' | 'SANTANDER' | 'BRADESCO'>('CAIXA_ECONOMICA');
  const [formPropertyValue, setFormPropertyValue] = useState(1500000);
  const [formDownPaymentValue, setFormDownPaymentValue] = useState(300000);
  const [formTermMonths, setFormTermMonths] = useState(360);
  const [formStage, setFormStage] = useState<CCABankStage>('SIMULACAO');

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const financedValue = Math.max(0, simPropertyValue - simDownPayment);
  const annualRate = 0.098; // 9.8% a.a.
  const monthlyRate = annualRate / 12;
  // SAC first installment estimation: (Principal / n) + (Principal * i)
  const estimatedFirstPayment = (financedValue / simTermMonths) + (financedValue * monthlyRate);
  const potentialCcaRevenue = financedValue * 0.012; // 1.2% comissão CCA

  const stages: { stage: CCABankStage; label: string; color: string }[] = [
    { stage: 'SIMULACAO', label: '1. Simulação & Enquadramento', color: 'border-t-blue-500' },
    { stage: 'COLETA_DOCUMENTOS', label: '2. Dossiê de Documentos', color: 'border-t-purple-500' },
    { stage: 'ANALISE_RISCO', label: '3. Análise de Risco / Crédito', color: 'border-t-amber-500' },
    { stage: 'AVALIACAO_ENGENHARIA', label: '4. Laudo de Engenharia', color: 'border-t-cyan-500' },
    { stage: 'EMISSAO_CONTRATO', label: '5. Emissão do Contrato Bancário', color: 'border-t-indigo-500' },
    { stage: 'PAGO_COMISSAO_CCA', label: '6. Pago Comissão CCA', color: 'border-t-emerald-500' },
  ];

  const totalCcaRevenueEarned = proposals
    .filter(p => p.stage === 'PAGO_COMISSAO_CCA')
    .reduce((acc, p) => acc + p.bankCommissionFee, 0);

  const totalCcaInPipeline = proposals
    .filter(p => p.stage !== 'PAGO_COMISSAO_CCA')
    .reduce((acc, p) => acc + p.bankCommissionFee, 0);

  // Open modal
  const handleOpenProposalModal = (prop?: CreditProposalCCA) => {
    if (prop) {
      setEditingProposal(prop);
      setFormClientName(prop.clientName);
      setFormClientCpf(prop.clientCpf);
      setFormBank(prop.bank);
      setFormPropertyValue(prop.propertyValue);
      setFormDownPaymentValue(prop.downPaymentValue);
      setFormTermMonths(prop.termMonths);
      setFormStage(prop.stage);
    } else {
      setEditingProposal(null);
      setFormClientName('');
      setFormClientCpf('');
      setFormBank('CAIXA_ECONOMICA');
      setFormPropertyValue(1500000);
      setFormDownPaymentValue(300000);
      setFormTermMonths(360);
      setFormStage('SIMULACAO');
    }
    setIsProposalModalOpen(true);
  };

  // Save proposal
  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim()) {
      showToast('Por favor, informe o nome do cliente.');
      return;
    }

    const calculatedFinanced = Math.max(0, formPropertyValue - formDownPaymentValue);
    const calculatedFee = calculatedFinanced * 0.012; // 1.2% comissão CCA
    const estimatedPayment = (calculatedFinanced / formTermMonths) + (calculatedFinanced * (0.098 / 12));

    if (editingProposal) {
      const updated: CreditProposalCCA = {
        ...editingProposal,
        clientName: formClientName,
        clientCpf: formClientCpf || '000.000.000-00',
        bank: formBank,
        propertyValue: formPropertyValue,
        downPaymentValue: formDownPaymentValue,
        financedValue: calculatedFinanced,
        termMonths: formTermMonths,
        interestRateAnnual: 0.098,
        estimatedMonthlyPayment: estimatedPayment,
        stage: formStage,
        bankCommissionFee: calculatedFee,
        updatedAt: new Date().toISOString()
      };

      setLocalProposals(prev => prev.map(p => p.id === editingProposal.id ? updated : p));
      if (onEditProposal) onEditProposal(updated);
      showToast(`Proposta CCA de ${formClientName} atualizada com sucesso!`);
    } else {
      const newProp: CreditProposalCCA = {
        id: `cca_${Date.now()}`,
        clientName: formClientName,
        clientCpf: formClientCpf || '000.000.000-00',
        bank: formBank,
        propertyValue: formPropertyValue,
        downPaymentValue: formDownPaymentValue,
        financedValue: calculatedFinanced,
        termMonths: formTermMonths,
        interestRateAnnual: 0.098,
        estimatedMonthlyPayment: estimatedPayment,
        stage: formStage,
        bankCommissionFee: calculatedFee,
        updatedAt: new Date().toISOString()
      };

      setLocalProposals(prev => [newProp, ...prev]);
      if (onAddProposal) onAddProposal(newProp);
      showToast(`Nova proposta CCA cadastrada para ${formClientName}!`);
    }

    setIsProposalModalOpen(false);
  };

  // Delete proposal
  const handleDeleteProposal = (id: string, name: string) => {
    setLocalProposals(prev => prev.filter(p => p.id !== id));
    if (onDeleteProposal) onDeleteProposal(id);
    showToast(`Proposta CCA de ${name} removida.`);
  };

  const handleAdvanceStage = (propId: string, currentStage: CCABankStage) => {
    const nextIndex = stages.findIndex(s => s.stage === currentStage) + 1;
    if (nextIndex < stages.length) {
      const newStage = stages[nextIndex].stage;
      setLocalProposals(prev => prev.map(p => p.id === propId ? { ...p, stage: newStage } : p));
      onUpdateStage(propId, newStage);
      showToast('Etapa bancária avançada com sucesso!');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Esteira de Crédito Imobiliário & CCA
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full shrink-0">
              Correspondente Homologado
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão integrada de financiamentos habitacionais Caixa, Itaú, Santander e Bradesco gerando receita de 1.2%
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenProposalModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Proposta CCA</span>
          </button>

          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">{showSimulator ? 'Ocultar Simulador' : 'Simulador SAC'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Comissão CCA Faturada</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block tabular-nums">
            R$ {totalCcaRevenueEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Receita líquida adicional para a imobiliária
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Comissões em Andamento</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block tabular-nums">
            R$ {totalCcaInPipeline.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">
            {proposals.filter(p => p.stage !== 'PAGO_COMISSAO_CCA').length} propostas na esteira
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Volume Financiado Ativo</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block tabular-nums">
            R$ {(proposals.reduce((acc, p) => acc + p.financedValue, 0)).toLocaleString('pt-BR')}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">
            Taxa média: 9.8% ao ano
          </span>
        </div>
      </div>

      {/* Simulator Card Dropdown */}
      {showSimulator && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Simulador Rápido de Financiamento Habitacional (Tabela SAC)</span>
            </h3>
            <button
              onClick={() => setShowSimulator(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Fechar Simulador"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Valor do Imóvel (R$)</label>
              <input
                type="number"
                value={simPropertyValue}
                onChange={(e) => setSimPropertyValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Entrada em Dinheiro (R$)</label>
              <input
                type="number"
                value={simDownPayment}
                onChange={(e) => setSimDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Prazo (Meses)</label>
              <select
                value={simTermMonths}
                onChange={(e) => setSimTermMonths(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={180}>180 meses (15 anos)</option>
                <option value={240}>240 meses (20 anos)</option>
                <option value={360}>360 meses (30 anos)</option>
                <option value={420}>420 meses (35 anos)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Valor Financiado:</span>
              <span className="font-bold text-slate-900 text-sm tabular-nums">
                R$ {financedValue.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">1ª Parcela Estimada:</span>
              <span className="font-bold text-blue-700 text-sm tabular-nums">
                R$ {estimatedFirstPayment.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Receita de Comissão CCA da Imobiliária:</span>
              <span className="font-bold text-emerald-700 text-base tabular-nums">
                + R$ {potentialCcaRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Workflow Kanban with TableScrollContainer */}
      <TableScrollContainer hintText="Arraste lateralmente ou use os botões para navegar por todas as etapas da esteira CCA">
        <div className="flex gap-4 min-w-[1100px] pb-2">
          {stages.map((st) => {
            const stageProposals = proposals.filter(p => p.stage === st.stage);
            return (
              <div
                key={st.stage}
                className="flex-1 bg-slate-100/90 rounded-2xl border border-slate-200 flex flex-col min-h-[380px]"
              >
                <div className={`p-3 bg-white border-t-4 ${st.color} rounded-t-2xl border-b border-slate-200 flex items-center justify-between`}>
                  <span className="text-xs font-bold text-slate-900 truncate" title={st.label}>{st.label}</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums shrink-0">
                    {stageProposals.length}
                  </span>
                </div>

                <div className="p-2 space-y-2.5 flex-1 overflow-y-auto">
                  {stageProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:shadow-xs transition-shadow relative group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate" title={prop.clientName}>
                          {prop.clientName}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-mono">
                            {prop.bank.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => handleOpenProposalModal(prop)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                            title="Editar Proposta"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteProposal(prop.id, prop.clientName)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors"
                            title="Excluir Proposta"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        Financiado: <strong className="tabular-nums text-slate-900">R$ {prop.financedValue.toLocaleString('pt-BR')}</strong>
                      </div>

                      <div className="p-2 bg-emerald-50 rounded-lg text-[10px] text-emerald-800 font-semibold flex items-center justify-between">
                        <span>Bônus CCA:</span>
                        <span className="tabular-nums">+ R$ {prop.bankCommissionFee.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                      </div>

                      {st.stage !== 'PAGO_COMISSAO_CCA' && (
                        <button
                          onClick={() => handleAdvanceStage(prop.id, st.stage)}
                          className="w-full py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Avançar Etapa</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {stageProposals.length === 0 && (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400 text-center px-2">
                      Nenhuma proposta nesta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TableScrollContainer>

      {/* MODAL: CADASTRAR OU EDITAR PROPOSTA CCA */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">
                {editingProposal ? 'Editar Proposta de Crédito CCA' : 'Nova Proposta de Crédito Imobiliário CCA'}
              </span>
              <button 
                onClick={() => setIsProposalModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProposal} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto Alencar"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CPF do Cliente</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formClientCpf}
                    onChange={(e) => setFormClientCpf(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Banco Financiador</label>
                  <select
                    value={formBank}
                    onChange={(e) => setFormBank(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CAIXA_ECONOMICA">Caixa Econômica Federal</option>
                    <option value="ITAU">Banco Itaú</option>
                    <option value="SANTANDER">Banco Santander</option>
                    <option value="BRADESCO">Banco Bradesco</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Etapa Atual da Esteira</label>
                  <select
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {stages.map(st => (
                      <option key={st.stage} value={st.stage}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valor do Imóvel (R$)</label>
                  <input
                    type="number"
                    value={formPropertyValue}
                    onChange={(e) => setFormPropertyValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Entrada (R$)</label>
                  <input
                    type="number"
                    value={formDownPaymentValue}
                    onChange={(e) => setFormDownPaymentValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prazo (Meses)</label>
                  <select
                    value={formTermMonths}
                    onChange={(e) => setFormTermMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={180}>180 meses</option>
                    <option value={240}>240 meses</option>
                    <option value={360}>360 meses</option>
                    <option value={420}>420 meses</option>
                  </select>
                </div>
              </div>

              {/* Automatic preview */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Saldo Financiado Calculado:</span>
                  <strong className="text-slate-900 font-bold text-sm">
                    R$ {Math.max(0, formPropertyValue - formDownPaymentValue).toLocaleString('pt-BR')}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Bônus CCA Estimado (1.2%):</span>
                  <strong className="text-emerald-700 font-bold text-sm">
                    + R$ {(Math.max(0, formPropertyValue - formDownPaymentValue) * 0.012).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingProposal ? 'Salvar Proposta' : 'Cadastrar Proposta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

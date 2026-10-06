import React, { useState } from 'react';
import { 
  Percent, 
  DollarSign, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Building, 
  ArrowRight, 
  CreditCard, 
  QrCode, 
  AlertCircle, 
  ShieldCheck,
  Save,
  HelpCircle,
  X
} from 'lucide-react';
import { 
  RentalContract, 
  RentalSplitBeneficiaryRule, 
  RentalContractSplitConfig 
} from '../../types/crm';

interface RentalSplitRulesConfigProps {
  contracts: RentalContract[];
  onUpdateContractBeneficiaries?: (contractId: string, beneficiaries: RentalSplitBeneficiaryRule[]) => void;
}

const BRAZILIAN_BANKS = [
  '001 - Banco do Brasil',
  '033 - Santander',
  '104 - Caixa Econômica Federal',
  '237 - Bradesco',
  '341 - Itaú Unibanco',
  '260 - Nubank (Nu Pagamentos)',
  '077 - Banco Inter',
  '336 - C6 Bank',
  '212 - Banco Original',
  '756 - Sicoob',
  '748 - Sicredi',
  '422 - Banco Safra'
];

export const RentalSplitRulesConfig: React.FC<RentalSplitRulesConfigProps> = ({
  contracts,
  onUpdateContractBeneficiaries,
}) => {
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const currentContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // Default mock split rules initialized per contract
  const [rulesState, setRulesState] = useState<Record<string, RentalSplitBeneficiaryRule[]>>(() => {
    const initial: Record<string, RentalSplitBeneficiaryRule[]> = {};
    contracts.forEach(contract => {
      if (contract.beneficiaries && contract.beneficiaries.length > 0) {
        initial[contract.id] = contract.beneficiaries.map((b, idx) => ({
          id: b.id || `split_${Date.now()}_${idx}`,
          name: b.name,
          relationship: (b.relationship.toLowerCase().includes('titular') ? 'PROPRIETARIO_TITULAR' :
                         b.relationship.toLowerCase().includes('cônjuge') ? 'CONJUGE_PARCEIRO' :
                         b.relationship.toLowerCase().includes('filho') ? 'FILHO_HERDEIRO' : 'CO_PROPRIETARIO') as any,
          cpfCnpj: b.cpfCnpj || '***.***.***-**',
          splitType: 'PERCENTUAL',
          percent: b.percent,
          fixedAmount: Math.round((contract.monthlyRent * (1 - contract.adminFeePercentage / 100)) * (b.percent / 100)),
          bankName: b.bankName || '341 - Itaú Unibanco',
          agency: '1420',
          accountNumber: '48921-5',
          accountType: 'CORRENTE',
          pixKeyType: b.pixKeyType || 'CPF',
          pixKey: b.pixKey || '123.456.789-00',
          autoTransfer: true,
          notes: idx === 0 ? 'Titular da escritura' : 'Coproprietário / Divisão de aluguel'
        }));
      } else {
        initial[contract.id] = [
          {
            id: `split_${contract.id}_1`,
            name: contract.ownerName,
            relationship: 'PROPRIETARIO_TITULAR',
            cpfCnpj: '123.456.789-00',
            splitType: 'PERCENTUAL',
            percent: 100,
            fixedAmount: Math.round(contract.monthlyRent * (1 - contract.adminFeePercentage / 100)),
            bankName: '341 - Itaú Unibanco',
            agency: '1420',
            accountNumber: '48921-5',
            accountType: 'CORRENTE',
            pixKeyType: 'CPF',
            pixKey: contract.ownerPixKey || '123.456.789-00',
            autoTransfer: true,
            notes: 'Repasse integral ao proprietário principal'
          }
        ];
      }
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // New beneficiary form modal / drawer state
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState<Partial<RentalSplitBeneficiaryRule>>({
    name: '',
    relationship: 'CO_PROPRIETARIO',
    cpfCnpj: '',
    splitType: 'PERCENTUAL',
    percent: 30,
    fixedAmount: 1000,
    bankName: '341 - Itaú Unibanco',
    agency: '',
    accountNumber: '',
    accountType: 'CORRENTE',
    pixKeyType: 'CPF',
    pixKey: '',
    autoTransfer: true,
    notes: ''
  });

  if (!currentContract) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Nenhum contrato de locação ativo encontrado.</p>
      </div>
    );
  }

  const activeRules = rulesState[currentContract.id] || [];

  // Financial calculations
  const rentAmount = currentContract.monthlyRent || 0;
  const adminFeePercent = currentContract.adminFeePercentage || 10;
  const adminFeeAmount = rentAmount * (adminFeePercent / 100);
  const netRepasseAmount = rentAmount - adminFeeAmount;

  // Total percent of active rules
  const totalPercentage = activeRules.reduce((acc, r) => acc + (r.splitType === 'PERCENTUAL' ? r.percent : 0), 0);
  const totalFixedAmount = activeRules.reduce((acc, r) => acc + (r.splitType === 'VALOR_FIXO' ? r.fixedAmount : 0), 0);

  const handleAddBeneficiary = () => {
    if (!newBeneficiary.name?.trim()) return;

    const rule: RentalSplitBeneficiaryRule = {
      id: `split_${Date.now()}`,
      name: newBeneficiary.name.trim(),
      relationship: newBeneficiary.relationship || 'TERCEIRO_INDICADO',
      cpfCnpj: newBeneficiary.cpfCnpj || '000.000.000-00',
      splitType: newBeneficiary.splitType || 'PERCENTUAL',
      percent: Number(newBeneficiary.percent) || 0,
      fixedAmount: Number(newBeneficiary.fixedAmount) || 0,
      bankName: newBeneficiary.bankName || '341 - Itaú Unibanco',
      agency: newBeneficiary.agency || '0001',
      accountNumber: newBeneficiary.accountNumber || '12345-6',
      accountType: newBeneficiary.accountType || 'CORRENTE',
      pixKeyType: newBeneficiary.pixKeyType || 'CPF',
      pixKey: newBeneficiary.pixKey || newBeneficiary.cpfCnpj || '',
      autoTransfer: newBeneficiary.autoTransfer !== false,
      notes: newBeneficiary.notes || ''
    };

    setRulesState(prev => ({
      ...prev,
      [currentContract.id]: [...(prev[currentContract.id] || []), rule]
    }));

    setShowAddBeneficiary(false);
    setNewBeneficiary({
      name: '',
      relationship: 'CO_PROPRIETARIO',
      cpfCnpj: '',
      splitType: 'PERCENTUAL',
      percent: 20,
      fixedAmount: 1000,
      bankName: '341 - Itaú Unibanco',
      agency: '',
      accountNumber: '',
      accountType: 'CORRENTE',
      pixKeyType: 'CPF',
      pixKey: '',
      autoTransfer: true,
      notes: ''
    });
  };

  const handleRemoveBeneficiary = (id: string) => {
    setRulesState(prev => ({
      ...prev,
      [currentContract.id]: prev[currentContract.id].filter(r => r.id !== id)
    }));
  };

  const handleUpdateRule = (id: string, updates: Partial<RentalSplitBeneficiaryRule>) => {
    setRulesState(prev => ({
      ...prev,
      [currentContract.id]: prev[currentContract.id].map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const handleSaveAllRules = () => {
    if (onUpdateContractBeneficiaries) {
      onUpdateContractBeneficiaries(currentContract.id, activeRules);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Percent className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Configuração de Regras de Split de Repasse
                </h2>
                <p className="text-xs text-slate-500">
                  Distribuição automatizada de repasses por beneficiário, vinculando contas bancárias e Pix
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddBeneficiary(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Beneficiário</span>
            </button>

            <button
              onClick={handleSaveAllRules}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Regras de Split</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Regras de Split atualizadas com sucesso! Os repasses mensais seguirão esta partição automaticamente.</span>
          </div>
        )}

        {/* Contract Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-slate-600 font-semibold text-xs mb-1">
              Contrato de Locação Selecionado:
            </label>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {contracts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.propertyAddress} ({c.ownerName})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Aluguel Bruto</span>
              <strong className="text-sm font-bold text-slate-900 font-mono">
                {rentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-blue-600 uppercase font-bold block">Taxa Imobiliária ({adminFeePercent}%)</span>
              <strong className="text-sm font-bold text-blue-700 font-mono">
                - {adminFeeAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Líquido para Partição</span>
              <strong className="text-base font-extrabold text-emerald-800 font-mono">
                {netRepasseAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Soma das Regras</span>
              <span className={`text-xs font-extrabold font-mono ${totalPercentage === 100 ? 'text-emerald-700' : 'text-amber-600'}`}>
                {totalPercentage}% {totalPercentage === 100 ? '✓' : '(Ajustar)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Table & Beneficiaries List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Beneficiários Vinculados ({activeRules.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Repasses liquidados diretamente na conta bancária / Chave Pix cadastrada
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {activeRules.map((rule, idx) => {
            const calculatedValue = rule.splitType === 'PERCENTUAL'
              ? netRepasseAmount * (rule.percent / 100)
              : rule.fixedAmount;

            return (
              <div key={rule.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  
                  {/* Beneficiary Name & Role */}
                  <div className="lg:col-span-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <strong className="text-xs font-bold text-slate-900 truncate">
                        {rule.name}
                      </strong>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-600">
                        {rule.relationship.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{rule.cpfCnpj}</span>
                    </div>
                  </div>

                  {/* Bank & Pix Details */}
                  <div className="lg:col-span-3 space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium truncate">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{rule.bankName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Ag: {rule.agency} • CC: {rule.accountNumber}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                      <QrCode className="w-3 h-3" />
                      <span>Pix ({rule.pixKeyType}): {rule.pixKey}</span>
                    </div>
                  </div>

                  {/* Distribution Settings (% or R$) */}
                  <div className="lg:col-span-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Tipo:</label>
                      <select
                        value={rule.splitType}
                        onChange={(e) => handleUpdateRule(rule.id, { splitType: e.target.value as any })}
                        className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold outline-hidden"
                      >
                        <option value="PERCENTUAL">Percentual (%)</option>
                        <option value="VALOR_FIXO">Valor Fixo (R$)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {rule.splitType === 'PERCENTUAL' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={rule.percent}
                            onChange={(e) => handleUpdateRule(rule.id, { percent: Number(e.target.value) })}
                            className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-700 font-mono text-center"
                          />
                          <span className="text-xs font-bold text-slate-600">%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-600">R$</span>
                          <input
                            type="number"
                            min={0}
                            value={rule.fixedAmount}
                            onChange={(e) => handleUpdateRule(rule.id, { fixedAmount: Number(e.target.value) })}
                            className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-700 font-mono"
                          />
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400">
                        {rule.autoTransfer ? '⚡ Repasse Instantâneo' : 'Manual'}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Monthly Payout */}
                  <div className="lg:col-span-2 text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Valor Calculado (Mês)
                    </span>
                    <strong className="text-sm font-extrabold text-emerald-700 font-mono">
                      {calculatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                    <span className="text-[9px] text-slate-400 block">
                      Líquido de Taxa Adm
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => handleRemoveBeneficiary(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Remover Beneficiário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {activeRules.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhum beneficiário cadastrado para este contrato. Clique em "Adicionar Beneficiário" acima.
          </div>
        )}
      </div>

      {/* Modal: Adicionar Novo Beneficiário de Split */}
      {showAddBeneficiary && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900">Novo Beneficiário para Split</h3>
              </div>
              <button 
                onClick={() => setShowAddBeneficiary(false)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Fechar"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo do Beneficiário *</label>
                <input
                  type="text"
                  placeholder="Ex: Dra. Mariana Vasconcellos (Coproprietária)"
                  value={newBeneficiary.name || ''}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vínculo / Grau</label>
                  <select
                    value={newBeneficiary.relationship || 'CO_PROPRIETARIO'}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, relationship: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                  >
                    <option value="PROPRIETARIO_TITULAR">Proprietário Titular</option>
                    <option value="CONJUGE_PARCEIRO">Cônjuge / Parceiro</option>
                    <option value="CO_PROPRIETARIO">Co-proprietário</option>
                    <option value="FILHO_HERDEIRO">Filho / Herdeiro</option>
                    <option value="ADMINISTRADORA">Administradora</option>
                    <option value="TERCEIRO_INDICADO">Terceiro Indicado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CPF / CNPJ *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={newBeneficiary.cpfCnpj || ''}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, cpfCnpj: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              {/* Split Definition */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-[11px] uppercase">
                  Regra de Distribuição
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Rateio</label>
                    <select
                      value={newBeneficiary.splitType || 'PERCENTUAL'}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, splitType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden"
                    >
                      <option value="PERCENTUAL">Percentual (%) do Líquido</option>
                      <option value="VALOR_FIXO">Valor Fixo em Reais (R$)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {newBeneficiary.splitType === 'PERCENTUAL' ? 'Percentual (%)' : 'Valor Fixo (R$)'}
                    </label>
                    <input
                      type="number"
                      value={newBeneficiary.splitType === 'PERCENTUAL' ? (newBeneficiary.percent ?? '') : (newBeneficiary.fixedAmount ?? '')}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (newBeneficiary.splitType === 'PERCENTUAL') {
                          setNewBeneficiary({ ...newBeneficiary, percent: val });
                        } else {
                          setNewBeneficiary({ ...newBeneficiary, fixedAmount: val });
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold font-mono outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Bank & Pix Account */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3">
                <span className="font-bold text-blue-900 block text-[11px] uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  Dados Bancários & Chave Pix
                </span>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instituição Bancária</label>
                  <select
                    value={newBeneficiary.bankName || '341 - Itaú Unibanco'}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden"
                  >
                    {BRAZILIAN_BANKS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Agência</label>
                    <input
                      type="text"
                      placeholder="1420"
                      value={newBeneficiary.agency || ''}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, agency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Conta & Dígito</label>
                    <input
                      type="text"
                      placeholder="48921-5"
                      value={newBeneficiary.accountNumber || ''}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo</label>
                    <select
                      value={newBeneficiary.accountType || 'CORRENTE'}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, accountType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden"
                    >
                      <option value="CORRENTE">Corrente</option>
                      <option value="POUPANCA">Poupança</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Chave Pix</label>
                    <select
                      value={newBeneficiary.pixKeyType || 'CPF'}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, pixKeyType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden"
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="TELEFONE">Telefone</option>
                      <option value="ALEATORIA">Chave Aleatória (EVP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Chave Pix</label>
                    <input
                      type="text"
                      placeholder="Chave Pix para repasse"
                      value={newBeneficiary.pixKey || ''}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, pixKey: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddBeneficiary(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddBeneficiary}
                disabled={!newBeneficiary.name?.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                Vincular Beneficiário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

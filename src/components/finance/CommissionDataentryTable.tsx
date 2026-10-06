import React, { useState } from 'react';
import { 
  Table, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  RefreshCw, 
  Zap, 
  DollarSign, 
  Users, 
  Check, 
  ShieldCheck, 
  Building,
  Key,
  X,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';
import { CommissionDataentryItem, CommissionDataentryStatus } from '../../types/commissionsManagement';
import { INITIAL_DATAENTRY_COMMISSIONS } from '../../data/mockCommissionManagementData';
import { SplitGatewayId, DEFAULT_SPLIT_GATEWAYS } from '../../types/splitGateways';

interface CommissionDataentryTableProps {
  onOpenGatewaysModal?: () => void;
}

export const CommissionDataentryTable: React.FC<CommissionDataentryTableProps> = ({
  onOpenGatewaysModal
}) => {
  const [items, setItems] = useState<CommissionDataentryItem[]>(INITIAL_DATAENTRY_COMMISSIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedGateway, setSelectedGateway] = useState<SplitGatewayId>('conta_pronta');
  
  // Selection for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingApi, setIsProcessingApi] = useState(false);
  const [processSuccessMessage, setProcessSuccessMessage] = useState<string | null>(null);

  // New row modal / drawer
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<CommissionDataentryItem>>({
    propertyTitle: '',
    propertyCode: 'AP-',
    dealType: 'VENDA_LANCAMENTO',
    vgvAmount: 850000,
    grossCommissionAmount: 51000,
    payableCommissionAmount: 20400,
    beneficiaryName: '',
    beneficiaryCpfCnpj: '',
    beneficiaryCreci: '',
    beneficiaryRole: 'CORRETOR_FECHADOR',
    bankCode: '341',
    bankName: 'Itaú Unibanco',
    pixKeyType: 'CPF',
    pixKey: '',
    dueDate: new Date().toISOString().split('T')[0],
    paymentGateway: 'conta_pronta',
    notes: ''
  });

  // Financial calculations
  const totalVgv = items.reduce((acc, curr) => acc + curr.vgvAmount, 0);
  const totalPayable = items.reduce((acc, curr) => acc + curr.payableCommissionAmount, 0);
  const totalLiquidated = items
    .filter(i => i.status === 'LIQUIDADO_PIX')
    .reduce((acc, curr) => acc + curr.payableCommissionAmount, 0);
  const pendingValidationCount = items.filter(i => i.status === 'PENDENTE_VALIDACAO' || !i.isPixValidated).length;

  // Filtered items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pixKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.beneficiaryCpfCnpj.includes(searchTerm);
    
    const matchesRole = selectedRole === 'ALL' || item.beneficiaryRole === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Validate Pix DICT
  const handleValidatePixKeys = () => {
    setItems(prev => prev.map(item => ({
      ...item,
      isPixValidated: true,
      status: item.status === 'PENDENTE_VALIDACAO' ? 'APROVADO_PARA_PAGAMENTO' : item.status
    })));
    setProcessSuccessMessage('Todas as chaves Pix foram validadas com sucesso no DICT Bacen!');
    setTimeout(() => setProcessSuccessMessage(null), 3000);
  };

  // Approve selected
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    setItems(prev => prev.map(item => 
      selectedIds.includes(item.id) 
        ? { ...item, status: 'APROVADO_PARA_PAGAMENTO' }
        : item
    ));
    setProcessSuccessMessage(`${selectedIds.length} comissões aprovadas para pagamento!`);
    setTimeout(() => setProcessSuccessMessage(null), 3000);
  };

  // Process Batch via API
  const handleProcessBatchViaApi = () => {
    if (selectedIds.length === 0) {
      alert('Selecione pelo menos um item da tabela para enviar para a API.');
      return;
    }
    setIsProcessingApi(true);
    setProcessSuccessMessage(null);

    setTimeout(() => {
      setIsProcessingApi(false);
      const gw = DEFAULT_SPLIT_GATEWAYS.find(g => g.id === selectedGateway)?.name || 'Conta Pronta';
      setItems(prev => prev.map(item => 
        selectedIds.includes(item.id) 
          ? { 
              ...item, 
              status: 'LIQUIDADO_PIX', 
              paymentGateway: selectedGateway,
              gatewayTransactionId: `TXN_${selectedGateway.toUpperCase()}_${Math.floor(Math.random() * 900000 + 100000)}`,
              liquidationDate: new Date().toISOString()
            }
          : item
      ));
      setProcessSuccessMessage(`Lote liquidado com sucesso via API ${gw}! Split instantâneo efetuado.`);
      setSelectedIds([]);
      setTimeout(() => setProcessSuccessMessage(null), 4000);
    }, 1400);
  };

  // Save new entry
  const handleSaveNewEntry = () => {
    if (!newItem.beneficiaryName || !newItem.pixKey || !newItem.payableCommissionAmount) {
      alert('Preencha os campos obrigatórios (Beneficiário, Chave Pix e Valor).');
      return;
    }

    const created: CommissionDataentryItem = {
      id: `de_${Date.now()}`,
      propertyTitle: newItem.propertyTitle || 'Venda Imobiliária Direta',
      propertyCode: newItem.propertyCode || 'AP-000',
      dealType: newItem.dealType || 'VENDA_LANCAMENTO',
      vgvAmount: Number(newItem.vgvAmount) || 0,
      grossCommissionAmount: Number(newItem.grossCommissionAmount) || 0,
      payableCommissionAmount: Number(newItem.payableCommissionAmount) || 0,
      beneficiaryName: newItem.beneficiaryName,
      beneficiaryCpfCnpj: newItem.beneficiaryCpfCnpj || '000.000.000-00',
      beneficiaryCreci: newItem.beneficiaryCreci || 'CRECI ATIVO',
      beneficiaryRole: newItem.beneficiaryRole || 'CORRETOR_FECHADOR',
      bankCode: newItem.bankCode || '341',
      bankName: newItem.bankName || 'Itaú Unibanco',
      pixKeyType: newItem.pixKeyType || 'CPF',
      pixKey: newItem.pixKey,
      isPixValidated: true,
      dueDate: newItem.dueDate || new Date().toISOString().split('T')[0],
      paymentGateway: newItem.paymentGateway || selectedGateway,
      status: 'APROVADO_PARA_PAGAMENTO',
      notes: newItem.notes || '',
      createdAt: new Date().toISOString()
    };

    setItems(prev => [created, ...prev]);
    setIsNewEntryOpen(false);
    setNewItem({
      propertyTitle: '',
      propertyCode: 'AP-',
      dealType: 'VENDA_LANCAMENTO',
      vgvAmount: 850000,
      grossCommissionAmount: 51000,
      payableCommissionAmount: 20400,
      beneficiaryName: '',
      beneficiaryCpfCnpj: '',
      beneficiaryCreci: '',
      beneficiaryRole: 'CORRETOR_FECHADOR',
      bankCode: '341',
      bankName: 'Itaú Unibanco',
      pixKeyType: 'CPF',
      pixKey: '',
      dueDate: new Date().toISOString().split('T')[0],
      paymentGateway: 'conta_pronta',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total VGV dos Negócios</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {totalVgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-slate-400">{items.length} lançamentos registrados</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Comissões a Pagar</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-blue-600 font-mono">
            {totalPayable.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-slate-400">Rateio líquido para corretores</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Liquidado via Pix D+0</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono">
            {totalLiquidated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Sem bitributação · API ativa</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Validações DICT / Chaves</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {pendingValidationCount === 0 ? '100% Válidas' : `${pendingValidationCount} Pendente`}
          </div>
          <div className="text-[11px] text-slate-400">Banco Central SPI</div>
        </div>
      </div>

      {/* Success alert */}
      {processSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{processSuccessMessage}</span>
          </div>
          <button onClick={() => setProcessSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Bar & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar corretor, imóvel, CPF ou Pix..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Role */}
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="ALL">Todos os Papéis</option>
              <option value="CORRETOR_FECHADOR">Corretor Fechador</option>
              <option value="CAPTADOR">Corretor Captador</option>
              <option value="GERENTE">Gerente de Vendas</option>
              <option value="PARCEIRO_EXTERNO">Parceiro Externo</option>
            </select>

            {/* Filter Status */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="ALL">Todos os Status</option>
              <option value="APROVADO_PARA_PAGAMENTO">Aprovado p/ Pagamento</option>
              <option value="LIQUIDADO_PIX">Liquidado via Pix</option>
              <option value="PENDENTE_VALIDACAO">Pendente Validação</option>
            </select>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleValidatePixKeys}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Validar Chaves DICT</span>
            </button>

            <button
              onClick={() => setIsNewEntryOpen(true)}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lançamento Rápido</span>
            </button>
          </div>
        </div>

        {/* Batch Operations Toolbar (when items selected) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800">
              {selectedIds.length} selecionado(s) de {filteredItems.length}
            </span>

            {selectedIds.length > 0 && (
              <button
                onClick={handleApproveSelected}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Aprovar Selecionados
              </button>
            )}
          </div>

          {/* Gateway selector for payment & execution */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Gateway de Pagamento:</span>
            <select
              value={selectedGateway}
              onChange={e => setSelectedGateway(e.target.value as SplitGatewayId)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold shadow-2xs"
            >
              <option value="conta_pronta">Conta Pronta (BaaS Imob)</option>
              <option value="asaas">Asaas (Split Nativo)</option>
              <option value="pagarme">Pagar.me Stone</option>
              <option value="pjbank">PJBank Imobiliário</option>
              <option value="iugu">Iugu Subcontas</option>
              <option value="cora">Banco Cora PJ</option>
              <option value="mercado_pago">Mercado Pago</option>
            </select>

            <button
              onClick={handleProcessBatchViaApi}
              disabled={isProcessingApi || selectedIds.length === 0}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap"
            >
              <Zap className={`w-3.5 h-3.5 ${isProcessingApi ? 'animate-spin' : ''}`} />
              <span>{isProcessingApi ? 'Enviando Lote Pix...' : 'Liquidar Lote via API Pix'}</span>
            </button>

            {onOpenGatewaysModal && (
              <button
                onClick={onOpenGatewaysModal}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium"
                title="Configurações de APIs Bancárias"
              >
                Configurar Gateways
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 w-10">
                  <input 
                    type="checkbox"
                    checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-3.5">Imóvel & Negócio</th>
                <th className="p-3.5">Beneficiário (Corretor)</th>
                <th className="p-3.5">Papel</th>
                <th className="p-3.5">Chave Pix & Banco</th>
                <th className="p-3.5 text-right">VGV</th>
                <th className="p-3.5 text-right">Comissão Líquida</th>
                <th className="p-3.5">Gateway API</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}>
                    <td className="p-3.5">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 truncate max-w-[200px]" title={item.propertyTitle}>
                        {item.propertyTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.propertyCode} · {item.dealType.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.beneficiaryName}</div>
                      <div className="text-[11px] text-slate-400">{item.beneficiaryCpfCnpj} {item.beneficiaryCreci ? `· ${item.beneficiaryCreci}` : ''}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.beneficiaryRole === 'CORRETOR_FECHADOR' ? 'Fechador' :
                         item.beneficiaryRole === 'CAPTADOR' ? 'Captador' :
                         item.beneficiaryRole === 'GERENTE' ? 'Gerente' : 'Parceiro'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800">
                        <span>{item.pixKey}</span>
                        {item.isPixValidated ? (
                          <span title="Chave Pix Validada no DICT">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          </span>
                        ) : (
                          <span title="Aguardando Validação">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.bankName}</div>
                    </td>

                    <td className="p-3.5 text-right font-mono text-slate-600">
                      {item.vgvAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                      {item.payableCommissionAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {item.paymentGateway.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                        item.status === 'LIQUIDADO_PIX' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        item.status === 'APROVADO_PARA_PAGAMENTO' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        item.status === 'PENDENTE_VALIDACAO' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status === 'LIQUIDADO_PIX' ? 'Liquidado D+0' :
                         item.status === 'APROVADO_PARA_PAGAMENTO' ? 'Aprovado' :
                         item.status === 'PENDENTE_VALIDACAO' ? 'Pendente DICT' : item.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          setItems(prev => prev.filter(x => x.id !== item.id));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Remover linha"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Commission Dataentry Modal */}
      {isNewEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span>Novo Lançamento de Comissão (Dataentry)</span>
              </h3>
              <button onClick={() => setIsNewEntryOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Título do Imóvel / Unidade</label>
                <input 
                  type="text"
                  placeholder="ex: Residencial Vila Nova - Apto 302"
                  value={newItem.propertyTitle}
                  onChange={e => setNewItem({ ...newItem, propertyTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">VGV Total da Venda (R$)</label>
                <input 
                  type="number"
                  value={newItem.vgvAmount}
                  onChange={e => setNewItem({ ...newItem, vgvAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Comissão a Pagar (R$ Líquido)</label>
                <input 
                  type="number"
                  value={newItem.payableCommissionAmount}
                  onChange={e => setNewItem({ ...newItem, payableCommissionAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome do Corretor / Beneficiário</label>
                <input 
                  type="text"
                  placeholder="Nome completo"
                  value={newItem.beneficiaryName}
                  onChange={e => setNewItem({ ...newItem, beneficiaryName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">CPF ou CNPJ do Beneficiário</label>
                <input 
                  type="text"
                  placeholder="000.000.000-00"
                  value={newItem.beneficiaryCpfCnpj}
                  onChange={e => setNewItem({ ...newItem, beneficiaryCpfCnpj: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Papel na Negociação</label>
                <select
                  value={newItem.beneficiaryRole}
                  onChange={e => setNewItem({ ...newItem, beneficiaryRole: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="CORRETOR_FECHADOR">Corretor Fechador</option>
                  <option value="CAPTADOR">Corretor Captador</option>
                  <option value="GERENTE">Gerente de Vendas</option>
                  <option value="PARCEIRO_EXTERNO">Parceiro Externo</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chave Pix</label>
                <input 
                  type="text"
                  placeholder="CPF, E-mail ou Celular"
                  value={newItem.pixKey}
                  onChange={e => setNewItem({ ...newItem, pixKey: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsNewEntryOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveNewEntry}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Salvar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

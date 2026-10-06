import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  QrCode, 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Printer, 
  Download, 
  RefreshCw, 
  Building, 
  Users, 
  Percent, 
  X, 
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { BoletoAvulsoCommission, BoletoSplitBeneficiary } from '../../types/commissionsManagement';
import { INITIAL_BOLETOS_AVULSOS } from '../../data/mockCommissionManagementData';
import { SplitGatewayId, DEFAULT_SPLIT_GATEWAYS } from '../../types/splitGateways';

interface BoletosAvulsosCommissionViewProps {
  onOpenGatewaysModal?: () => void;
}

export const BoletosAvulsosCommissionView: React.FC<BoletosAvulsosCommissionViewProps> = ({
  onOpenGatewaysModal
}) => {
  const [boletos, setBoletos] = useState<BoletoAvulsoCommission[]>(INITIAL_BOLETOS_AVULSOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedBoleto, setSelectedBoleto] = useState<BoletoAvulsoCommission | null>(null);

  // New Boleto Modal
  const [isNewBoletoOpen, setIsNewBoletoOpen] = useState(false);
  const [isSimulatingSettlement, setIsSimulatingSettlement] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form state for new boleto
  const [newBoleto, setNewBoleto] = useState({
    payerName: '',
    payerCpfCnpj: '',
    payerEmail: '',
    payerPhone: '',
    propertyTitle: '',
    contractCode: 'CTR-VND-',
    description: 'Honorários de Corretagem e Intermediação Imobiliária',
    totalAmount: 60000,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    gateway: 'conta_pronta' as SplitGatewayId,
    // Split shares
    fechadorName: 'Ricardo Alencar',
    fechadorPercent: 50,
    captadorName: 'Mariana Duarte',
    captadorPercent: 20,
    gerenteName: 'Fernanda Valente',
    gerentePercent: 10,
    imobiliariaPercent: 20
  });

  // Financial KPIs
  const totalIssued = boletos.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = boletos
    .filter(b => b.status === 'PAGO_SPLIT_EXECUTADO')
    .reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPending = boletos
    .filter(b => b.status === 'A_VENCER')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  // Filtered list
  const filteredBoletos = boletos.filter(b => {
    const matchesSearch = 
      b.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.boletoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.payerCpfCnpj.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyPix = (boleto: BoletoAvulsoCommission) => {
    navigator.clipboard?.writeText(boleto.pixCopiaECola);
    setCopiedId(boleto.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsAppReminder = (boleto: BoletoAvulsoCommission) => {
    const msg = `Olá ${boleto.payerName}! Segue o link do Boleto Híbrido com QR Code Pix referente à comissão da negociação (${boleto.propertyTitle}). Valor: ${boleto.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Vencimento: ${boleto.dueDate}. Pix Copia e Cola: ${boleto.pixCopiaECola.substring(0, 35)}...`;
    const cleanPhone = boleto.payerPhone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    setSuccessToast(`Notificação disparada para o WhatsApp de ${boleto.payerName}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSimulateWebhookSettlement = (boletoId: string) => {
    setIsSimulatingSettlement(boletoId);
    setTimeout(() => {
      setIsSimulatingSettlement(null);
      setBoletos(prev => prev.map(b => b.id === boletoId ? {
        ...b,
        status: 'PAGO_SPLIT_EXECUTADO',
        paidDate: new Date().toISOString(),
        webhookReceivedAt: new Date().toISOString(),
        splitBeneficiaries: b.splitBeneficiaries.map(sb => ({ ...sb, status: 'CREDITADO_D0' }))
      } : b));
      setSuccessToast('Liquidação D+0 processada com sucesso! O split foi distribuído para os corretores e imobiliária.');
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1200);
  };

  const handleCreateBoleto = () => {
    if (!newBoleto.payerName || !newBoleto.totalAmount) {
      alert('Preencha os dados do pagador e o valor do boleto.');
      return;
    }

    const total = Number(newBoleto.totalAmount) || 0;
    const fechadorVal = (total * newBoleto.fechadorPercent) / 100;
    const captadorVal = (total * newBoleto.captadorPercent) / 100;
    const gerenteVal = (total * newBoleto.gerentePercent) / 100;
    const imobVal = total - (fechadorVal + captadorVal + gerenteVal);

    const beneficiaries: BoletoSplitBeneficiary[] = [
      {
        id: `sb_${Date.now()}_1`,
        name: newBoleto.fechadorName,
        role: `Corretor Fechador (${newBoleto.fechadorPercent}%)`,
        cpfCnpj: '234.819.201-99',
        percent: newBoleto.fechadorPercent,
        amount: fechadorVal,
        pixKey: '234.819.201-99',
        bankName: '341 - Itaú',
        status: 'PENDENTE'
      },
      {
        id: `sb_${Date.now()}_2`,
        name: newBoleto.captadorName,
        role: `Corretor Captador (${newBoleto.captadorPercent}%)`,
        cpfCnpj: '419.028.188-32',
        percent: newBoleto.captadorPercent,
        amount: captadorVal,
        pixKey: 'mariana.duarte@imob.com',
        bankName: '260 - Nubank',
        status: 'PENDENTE'
      },
      {
        id: `sb_${Date.now()}_3`,
        name: newBoleto.gerenteName,
        role: `Gerente (${newBoleto.gerentePercent}%)`,
        cpfCnpj: '512.981.332-90',
        percent: newBoleto.gerentePercent,
        amount: gerenteVal,
        pixKey: '+5511998761234',
        bankName: '341 - Itaú',
        status: 'PENDENTE'
      },
      {
        id: `sb_${Date.now()}_4`,
        name: 'AcertGo Imobiliária Matriz',
        role: `Taxa Imobiliária (${newBoleto.imobiliariaPercent}%)`,
        cpfCnpj: '42.198.810/0001-90',
        percent: newBoleto.imobiliariaPercent,
        amount: imobVal,
        pixKey: 'financeiro@acertgo.com.br',
        bankName: '077 - Banco Inter',
        status: 'PENDENTE'
      }
    ];

    const boletoCreated: BoletoAvulsoCommission = {
      id: `bol_${Date.now()}`,
      boletoNumber: `BOL-2026-${Math.floor(Math.random() * 900 + 100)}`,
      payerName: newBoleto.payerName,
      payerCpfCnpj: newBoleto.payerCpfCnpj || '000.000.000-00',
      payerEmail: newBoleto.payerEmail || 'cliente@email.com',
      payerPhone: newBoleto.payerPhone || '(11) 99999-9999',
      propertyTitle: newBoleto.propertyTitle || 'Intermediação Imobiliária',
      contractCode: newBoleto.contractCode || 'CTR-2026',
      description: newBoleto.description,
      totalAmount: total,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newBoleto.dueDate,
      status: 'A_VENCER',
      gateway: newBoleto.gateway,
      linhaDigitavel: '23793.38128 60000.123456 78000.902182 1 984500' + total.toString().padStart(8, '0'),
      codigoBarras: '23791984500' + total.toString().padStart(8, '0') + '338126000012345',
      pixCopiaECola: '00020101021226840014br.gov.bcb.pix2562qrcodes-pix.contapronta.com.br/v2/cobv/9918237198273918273981273981520400005303986540' + total + '5802BR5916ACERTGO IMOVEIS6009SAO PAULO62070503***6304E8A1',
      pixQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226840014br.gov.bcb.pix2562qrcodes-pix.contapronta.com.br',
      pdfUrl: '#',
      gatewayFee: 1.89,
      netAmountDistributed: total - 1.89,
      remindersSentCount: 0,
      splitBeneficiaries: beneficiaries
    };

    setBoletos(prev => [boletoCreated, ...prev]);
    setIsNewBoletoOpen(false);
    setSuccessToast(`Boleto ${boletoCreated.boletoNumber} emitido com sucesso com regras de split ativas!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Emitido em Boletos Avulsos</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {totalIssued.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-slate-400">{boletos.length} boletos gerados com split</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Liquidado & Split Executado</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono">
            {totalPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">D+0 sem retenção no caixa transitório</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Boletos A Vencer</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 font-mono">
            {totalPending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-slate-400">Régua de cobrança automática</div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar por pagador, imóvel, boleto..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="ALL">Todos os Status</option>
            <option value="A_VENCER">A Vencer</option>
            <option value="PAGO_SPLIT_EXECUTADO">Pago (Split Executado)</option>
            <option value="VENCIDO">Vencido</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {onOpenGatewaysModal && (
            <button
              onClick={onOpenGatewaysModal}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              Configurar Gateways de Boleto
            </button>
          )}

          <button
            onClick={() => setIsNewBoletoOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Boleto Avulso com Split</span>
          </button>
        </div>
      </div>

      {/* Boletos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBoletos.map(boleto => {
          const isSettling = isSimulatingSettlement === boleto.id;
          const isCopied = copiedId === boleto.id;

          return (
            <div 
              key={boleto.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Number, Status & Gateway */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {boleto.boletoNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {boleto.gateway.replace('_', ' ')}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    boleto.status === 'PAGO_SPLIT_EXECUTADO'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {boleto.status === 'PAGO_SPLIT_EXECUTADO' ? 'Liquidado D+0' : 'A Vencer'}
                  </span>
                </div>

                {/* Amount & Due Date */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Valor da Comissão</div>
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {boleto.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                    <span>Vencimento: <strong className="text-slate-800">{new Date(boleto.dueDate).toLocaleDateString('pt-BR')}</strong></span>
                    <span>Tarifa Gateway: <strong className="text-slate-800">R$ {boleto.gatewayFee.toFixed(2)}</strong></span>
                  </div>
                </div>

                {/* Payer info */}
                <div className="text-xs space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Pagador da Comissão</div>
                  <div className="font-bold text-slate-900">{boleto.payerName}</div>
                  <div className="text-slate-500 text-[11px]">{boleto.payerCpfCnpj} · {boleto.payerPhone}</div>
                  <div className="text-slate-500 text-[11px] truncate">{boleto.propertyTitle}</div>
                </div>

                {/* Embedded Split Beneficiaries */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                    <span>Divisão do Split Automático</span>
                    <Percent className="w-3 h-3 text-purple-600" />
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {boleto.splitBeneficiaries.map(sb => (
                      <div key={sb.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="truncate mr-2">
                          <span className="font-semibold text-slate-800">{sb.name}</span>
                          <span className="text-[10px] text-slate-400 block">{sb.role}</span>
                        </div>
                        <div className="text-right shrink-0 font-mono font-bold text-slate-900">
                          {sb.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCopyPix(boleto)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Pix Copiado!' : 'Copiar Pix'}</span>
                  </button>

                  <button
                    onClick={() => handleSendWhatsAppReminder(boleto)}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {boleto.status === 'A_VENCER' && (
                  <button
                    onClick={() => handleSimulateWebhookSettlement(boleto.id)}
                    disabled={isSettling}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSettling ? 'animate-spin' : ''}`} />
                    <span>{isSettling ? 'Processando Split Webhook...' : 'Simular Liquidação D+0'}</span>
                  </button>
                )}

                {boleto.status === 'PAGO_SPLIT_EXECUTADO' && (
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Split Creditado via Pix D+0</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Boleto Avulso Modal */}
      {isNewBoletoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Emitir Boleto Avulso com Split Automático
                  </h3>
                  <p className="text-xs text-slate-500">
                    Boleto Híbrido (Febraban + QR Code Pix) com rateio instantâneo entre os corretores e imobiliária
                  </p>
                </div>
              </div>
              <button onClick={() => setIsNewBoletoOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Payer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Nome do Pagador (Cliente, Vendedor ou Construtora)</label>
                  <input 
                    type="text"
                    placeholder="Ex: Construtora Moura Dubeux ou Dr. Roberto Silveira"
                    value={newBoleto.payerName}
                    onChange={e => setNewBoleto({ ...newBoleto, payerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">CPF ou CNPJ</label>
                  <input 
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={newBoleto.payerCpfCnpj}
                    onChange={e => setNewBoleto({ ...newBoleto, payerCpfCnpj: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Celular / WhatsApp do Pagador</label>
                  <input 
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newBoleto.payerPhone}
                    onChange={e => setNewBoleto({ ...newBoleto, payerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Imóvel Vinculado / Referência</label>
                  <input 
                    type="text"
                    placeholder="Ex: Mansão Tamboré 10 - Lote 14"
                    value={newBoleto.propertyTitle}
                    onChange={e => setNewBoleto({ ...newBoleto, propertyTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Valor da Comissão (R$)</label>
                  <input 
                    type="number"
                    value={newBoleto.totalAmount}
                    onChange={e => setNewBoleto({ ...newBoleto, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data de Vencimento</label>
                  <input 
                    type="date"
                    value={newBoleto.dueDate}
                    onChange={e => setNewBoleto({ ...newBoleto, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Gateway Emissor do Boleto</label>
                  <select
                    value={newBoleto.gateway}
                    onChange={e => setNewBoleto({ ...newBoleto, gateway: e.target.value as SplitGatewayId })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="conta_pronta">Conta Pronta (BaaS Imobiliário D+0)</option>
                    <option value="asaas">Asaas (Boleto Híbrido Split Nativo)</option>
                    <option value="pjbank">PJBank Pagamentos</option>
                    <option value="cora">Banco Cora PJ</option>
                    <option value="pagarme">Pagar.me Stone</option>
                  </select>
                </div>
              </div>

              {/* Split definition */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3">
                <div className="font-bold text-purple-900 flex items-center justify-between">
                  <span>Parametrização do Split no Boleto</span>
                  <span>Total: 100%</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block">Fechador (%)</label>
                    <input 
                      type="number"
                      value={newBoleto.fechadorPercent}
                      onChange={e => setNewBoleto({ ...newBoleto, fechadorPercent: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-purple-200 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block">Captador (%)</label>
                    <input 
                      type="number"
                      value={newBoleto.captadorPercent}
                      onChange={e => setNewBoleto({ ...newBoleto, captadorPercent: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-purple-200 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block">Gerente (%)</label>
                    <input 
                      type="number"
                      value={newBoleto.gerentePercent}
                      onChange={e => setNewBoleto({ ...newBoleto, gerentePercent: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-purple-200 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block">Imobiliária (%)</label>
                    <input 
                      type="number"
                      value={newBoleto.imobiliariaPercent}
                      onChange={e => setNewBoleto({ ...newBoleto, imobiliariaPercent: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-purple-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsNewBoletoOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateBoleto}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Gerar Boleto Híbrido com API
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

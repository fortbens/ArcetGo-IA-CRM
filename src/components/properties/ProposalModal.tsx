import React, { useState } from 'react';
import { 
  X, 
  Search, 
  UserPlus, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  Building, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Percent,
  Calculator,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { RealEstateProperty, Lead, PropertyProposal } from '../../types/crm';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: RealEstateProperty | null;
  leads: Lead[];
  onSaveProposal: (proposal: PropertyProposal, newLeadData?: { name: string; phone: string; email: string }) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  property,
  leads,
  onSaveProposal,
}) => {
  if (!isOpen || !property) return null;

  // Selection mode: 'EXISTING_LEAD' or 'NEW_CLIENT'
  const [clientMode, setClientMode] = useState<'EXISTING_LEAD' | 'NEW_CLIENT'>('EXISTING_LEAD');

  // Search lead
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New client fields
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientCpf, setNewClientCpf] = useState('');

  // Proposal terms
  const initialPrice = property.pricing.salePrice || property.pricing.rentPrice || 0;
  const [proposedPrice, setProposedPrice] = useState<number | ''>(initialPrice);
  const [paymentMethod, setPaymentMethod] = useState<'A_VISTA' | 'FINANCIAMENTO' | 'PERMUTA' | 'PARCELAMENTO_DIRETO' | 'CONSORCIO'>('FINANCIAMENTO');
  const [downPayment, setDownPayment] = useState<number | ''>(initialPrice ? Math.round(initialPrice * 0.2) : '');
  
  // Default validity: 5 days from today
  const defaultValidity = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [validityDate, setValidityDate] = useState(defaultValidity);
  const [conditions, setConditions] = useState('Proposta condicionada à aprovação da documentação do imóvel e obtenção de financiamento bancário.');

  // Commission Simulator State
  const [showCommissionSimulator, setShowCommissionSimulator] = useState(true);
  const [commissionBasePercent, setCommissionBasePercent] = useState<number>(
    property.transactionType === 'LOCACAO' ? 100 : (property.pricing.commissionSalePercent || 6)
  );
  const [stakeholders, setStakeholders] = useState<Array<{
    id: string;
    name: string;
    role: 'IMOBILIARIA' | 'CAPTADOR' | 'FECHADOR' | 'GERENTE' | 'PARCEIRO';
    type: 'PERCENTUAL' | 'VALOR_FIXO';
    percent: number;
    fixedAmount: number;
  }>>([
    { id: '1', name: 'Imobiliária Matriz', role: 'IMOBILIARIA', type: 'PERCENTUAL', percent: 30, fixedAmount: 0 },
    { id: '2', name: 'Corretor Captador', role: 'CAPTADOR', type: 'PERCENTUAL', percent: 30, fixedAmount: 0 },
    { id: '3', name: 'Corretor Fechador', role: 'FECHADOR', type: 'PERCENTUAL', percent: 30, fixedAmount: 0 },
    { id: '4', name: 'Gerente / Parceiro', role: 'GERENTE', type: 'PERCENTUAL', percent: 10, fixedAmount: 0 },
  ]);

  // UI state
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successProposal, setSuccessProposal] = useState<PropertyProposal | null>(null);

  // Filter leads
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
    l.phone.includes(leadSearchTerm) ||
    l.email.toLowerCase().includes(leadSearchTerm.toLowerCase())
  );

  const getProposalSummaryText = () => {
    const clientName = clientMode === 'EXISTING_LEAD' ? (selectedLead?.name || 'Cliente') : newClientName;
    const clientPhone = clientMode === 'EXISTING_LEAD' ? (selectedLead?.phone || '') : newClientPhone;
    const priceFormatted = Number(proposedPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const downFormatted = downPayment ? Number(downPayment).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Não informado';
    
    return `📄 *PROPOSTA FORMAL DE COMPRA / LOCAÇÃO*
🏛️ *Imóvel:* ${property.code} - ${property.title}
📍 *Endereço:* ${property.address.neighborhood}, ${property.address.city}/${property.address.state}
💰 *Valor de Referência:* ${(property.pricing.salePrice || property.pricing.rentPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

👤 *Proponente (Cliente):* ${clientName}
📱 *Contato:* ${clientPhone}
💵 *Valor Proposto:* ${priceFormatted}
💳 *Condição:* ${paymentMethod.replace('_', ' ')}
🪙 *Sinal / Entrada:* ${downFormatted}
📅 *Validade:* ${validityDate ? new Date(validityDate + 'T00:00:00').toLocaleDateString('pt-BR') : '5 dias'}

📝 *Condições:*
${conditions}

_Gerado via CRM Imobiliário Integrado_`;
  };

  const handleCopyWhatsapp = () => {
    const text = getProposalSummaryText();
    navigator.clipboard.writeText(text);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (clientMode === 'EXISTING_LEAD' && !selectedLead) {
      setErrorMsg('Por favor, selecione um lead da lista ou clique em "Cadastrar Novo Cliente".');
      return;
    }

    if (clientMode === 'NEW_CLIENT' && (!newClientName.trim() || !newClientPhone.trim())) {
      setErrorMsg('Informe o nome e o telefone do novo cliente.');
      return;
    }

    if (!proposedPrice || Number(proposedPrice) <= 0) {
      setErrorMsg('Informe um valor de proposta válido.');
      return;
    }

    const clientName = clientMode === 'EXISTING_LEAD' ? selectedLead!.name : newClientName.trim();
    const clientPhone = clientMode === 'EXISTING_LEAD' ? selectedLead!.phone : newClientPhone.trim();
    const clientEmail = clientMode === 'EXISTING_LEAD' ? selectedLead!.email : newClientEmail.trim();

    const newProposal: PropertyProposal = {
      id: `prop_${Date.now()}`,
      propertyId: property.id,
      propertyCode: property.code,
      propertyTitle: property.title,
      propertyAddress: `${property.address.neighborhood} - ${property.address.city}/${property.address.state}`,
      leadId: selectedLead?.id,
      clientName,
      clientPhone,
      clientEmail,
      clientCpf: newClientCpf.trim() || undefined,
      isNewClient: clientMode === 'NEW_CLIENT',
      proposedPrice: Number(proposedPrice),
      paymentMethod,
      downPayment: downPayment ? Number(downPayment) : undefined,
      validityDate,
      conditions: conditions.trim(),
      status: 'EM_ANALISE_PROPRIETARIO',
      createdAt: new Date().toISOString(),
    };

    onSaveProposal(
      newProposal,
      clientMode === 'NEW_CLIENT' ? { name: clientName, phone: clientPhone, email: clientEmail } : undefined
    );

    setSuccessProposal(newProposal);
  };

  const coverImage = property.images.find(img => img.isCover)?.url || property.images[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Abrir Proposta Imobiliária</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500 text-white font-mono">
                  {property.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Vincule o proponente existente ou cadastre um novo cliente com registro formal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {successProposal ? (
          <div className="p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Proposta Registrada com Sucesso!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                A proposta formal no valor de{' '}
                <strong className="text-emerald-700 font-bold">
                  {successProposal.proposedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>{' '}
                para o cliente <strong>{successProposal.clientName}</strong> foi gerada e vinculada ao imóvel.
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Ações Imediatas:</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleCopyWhatsapp}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  {copiedWhatsapp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWhatsapp ? 'Copiado para Área de Transferência!' : 'Copiar Texto para WhatsApp'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(getProposalSummaryText())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Property Summary Pill */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              {coverImage && (
                <img
                  src={coverImage}
                  alt={property.title}
                  className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-300"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  Imóvel Alvo da Proposta
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">{property.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {property.address.neighborhood} • {property.address.city}/{property.address.state}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Preço Referência</span>
                <span className="text-sm font-black text-slate-900">
                  {(property.pricing.salePrice || property.pricing.rentPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            {/* Step 1: Client Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                  1. Proponente (Cliente)
                </label>
                <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => { setClientMode('EXISTING_LEAD'); setErrorMsg(''); }}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      clientMode === 'EXISTING_LEAD' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Buscar Lead do CRM
                  </button>
                  <button
                    type="button"
                    onClick={() => { setClientMode('NEW_CLIENT'); setSelectedLead(null); setErrorMsg(''); }}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      clientMode === 'NEW_CLIENT' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    + Novo Cliente
                  </button>
                </div>
              </div>

              {clientMode === 'EXISTING_LEAD' ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Digite o nome, telefone ou e-mail do lead..."
                      value={leadSearchTerm}
                      onChange={(e) => setLeadSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>

                  {selectedLead ? (
                    <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {selectedLead.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-950">{selectedLead.name}</p>
                          <p className="text-[11px] text-blue-700">{selectedLead.phone} • {selectedLead.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedLead(null)}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Trocar
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                      {filteredLeads.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          Nenhum lead encontrado com esse termo.
                        </div>
                      ) : (
                        filteredLeads.map(lead => (
                          <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-800">{lead.name}</p>
                              <p className="text-[11px] text-slate-500">{lead.phone} • {lead.email}</p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                              {lead.stage}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Novo Cliente Inputs */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nome Completo do Cliente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. Mariana Albuquerque"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 98888-7777"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      E-mail do Cliente
                    </label>
                    <input
                      type="email"
                      placeholder="cliente@email.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      CPF do Proponente (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={newClientCpf}
                      onChange={(e) => setNewClientCpf(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Proposal Terms */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                2. Condições da Proposta
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Valor Proposto (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 text-sm font-black bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                  >
                    <option value="A_VISTA">À Vista (Recursos Próprios / TED)</option>
                    <option value="FINANCIAMENTO">Financiamento Bancário (SFH / SFI)</option>
                    <option value="CONSORCIO">Carta de Crédito / Consórcio</option>
                    <option value="PERMUTA">Permuta Parcial (Imóvel / Veículo)</option>
                    <option value="PARCELAMENTO_DIRETO">Parcelamento Direto com Proprietário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sinal / Entrada (R$)
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ex: 100000"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Validade da Proposta
                  </label>
                  <input
                    type="date"
                    required
                    value={validityDate}
                    onChange={(e) => setValidityDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cláusulas & Condições Especiais
                  </label>
                  <textarea
                    rows={2}
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="Condições de entrega de chaves, prazo de desocupação, laudo de vistoria, etc."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Simulador de Comissões & Split de Envolvidos */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-blue-600" />
                  3. Simulador de Comissões & Repasse da Proposta
                </label>
                <button
                  type="button"
                  onClick={() => setShowCommissionSimulator(!showCommissionSimulator)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                >
                  {showCommissionSimulator ? 'Ocultar Simulador' : 'Exibir Simulador'}
                </button>
              </div>

              {showCommissionSimulator && (() => {
                const price = Number(proposedPrice || 0);
                const totalCommission = (price * commissionBasePercent) / 100;

                const calculatedStakeholders = stakeholders.map(s => {
                  const amount = s.type === 'PERCENTUAL' 
                    ? (totalCommission * s.percent) / 100 
                    : s.fixedAmount;
                  const effectivePercent = totalCommission > 0 ? (amount / totalCommission) * 100 : 0;
                  return { ...s, calculatedAmount: amount, effectivePercent };
                });

                const totalDistributedAmount = calculatedStakeholders.reduce((acc, s) => acc + s.calculatedAmount, 0);
                const totalDistributedPercent = calculatedStakeholders.reduce((acc, s) => acc + s.effectivePercent, 0);
                const remainingAmount = totalCommission - totalDistributedAmount;

                return (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                    {/* Header bar: Base percent and total amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Preço Proposto</span>
                        <strong className="text-sm font-black text-slate-900">
                          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Taxa de Comissão (%)</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            value={commissionBasePercent}
                            onChange={(e) => setCommissionBasePercent(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-blue-900"
                          />
                          <span className="font-bold text-slate-600">%</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Comissão Total Estimada</span>
                        <strong className="text-sm font-black text-blue-700">
                          {totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>
                    </div>

                    {/* Stakeholders distribution table */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
                        <span>Envolvido / Papel</span>
                        <div className="flex items-center gap-6">
                          <span>Distribuição (% ou R$)</span>
                          <span className="w-24 text-right">Repasse Líquido</span>
                        </div>
                      </div>

                      {stakeholders.map((s, idx) => {
                        const amount = s.type === 'PERCENTUAL' 
                          ? (totalCommission * s.percent) / 100 
                          : s.fixedAmount;

                        return (
                          <div
                            key={s.id}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={s.name}
                                onChange={(e) => {
                                  const updated = [...stakeholders];
                                  updated[idx].name = e.target.value;
                                  setStakeholders(updated);
                                }}
                                className="font-bold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-hidden px-1"
                              />
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                                {s.role}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Toggle % vs R$ */}
                              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...stakeholders];
                                    updated[idx].type = 'PERCENTUAL';
                                    setStakeholders(updated);
                                  }}
                                  className={`px-1.5 py-0.5 rounded ${s.type === 'PERCENTUAL' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-500'}`}
                                >
                                  %
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...stakeholders];
                                    updated[idx].type = 'VALOR_FIXO';
                                    if (!updated[idx].fixedAmount) {
                                      updated[idx].fixedAmount = Math.round((totalCommission * updated[idx].percent) / 100);
                                    }
                                    setStakeholders(updated);
                                  }}
                                  className={`px-1.5 py-0.5 rounded ${s.type === 'VALOR_FIXO' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-500'}`}
                                >
                                  R$
                                </button>
                              </div>

                              {s.type === 'PERCENTUAL' ? (
                                <div className="flex items-center gap-1 w-20">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={s.percent}
                                    onChange={(e) => {
                                      const updated = [...stakeholders];
                                      updated[idx].percent = Number(e.target.value);
                                      setStakeholders(updated);
                                    }}
                                    className="w-14 px-1.5 py-1 text-xs font-bold text-right border border-slate-300 rounded-lg bg-slate-50"
                                  />
                                  <span className="text-slate-500 font-bold">%</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 w-24">
                                  <span className="text-slate-400 text-[10px]">R$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={s.fixedAmount}
                                    onChange={(e) => {
                                      const updated = [...stakeholders];
                                      updated[idx].fixedAmount = Number(e.target.value);
                                      setStakeholders(updated);
                                    }}
                                    className="w-20 px-1.5 py-1 text-xs font-bold text-right border border-slate-300 rounded-lg bg-slate-50"
                                  />
                                </div>
                              )}

                              <div className="w-24 text-right font-black text-slate-800 text-xs">
                                {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </div>

                              {stakeholders.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setStakeholders(stakeholders.filter((_, i) => i !== idx))}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary row */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStakeholders([
                            ...stakeholders,
                            {
                              id: `st_${Date.now()}`,
                              name: 'Parceiro Externo',
                              role: 'PARCEIRO',
                              type: 'PERCENTUAL',
                              percent: 10,
                              fixedAmount: 0
                            }
                          ])}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold flex items-center gap-1 text-[11px] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Adicionar Envolvido</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">TOTAL REPASSES</span>
                          <strong className="text-slate-900 font-mono">
                            {totalDistributedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            {' '}({totalDistributedPercent.toFixed(1)}%)
                          </strong>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">SALDO RESTANTE</span>
                          <strong className={`font-mono ${Math.abs(remainingAmount) < 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {remainingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyWhatsapp}
                className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedWhatsapp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWhatsapp ? 'Copiado!' : 'Prévia WhatsApp'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Registrar Proposta</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

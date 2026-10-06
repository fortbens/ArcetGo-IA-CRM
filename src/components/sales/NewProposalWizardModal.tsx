import React, { useState, useMemo } from 'react';
import { 
  X, 
  Home, 
  User, 
  DollarSign, 
  Calendar, 
  Percent, 
  CheckCircle2, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles, 
  Building,
  Plus
} from 'lucide-react';
import { RealEstateProperty, Lead, Owner } from '../../types/crm';
import { PropostaVenda, FormaComissao } from '../../types/salesProposal';

interface NewProposalWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: RealEstateProperty[];
  leads: Lead[];
  owners: Owner[];
  onSaveProposal: (proposal: PropostaVenda) => void;
  preselectedProperty?: RealEstateProperty | null;
  editingProposal?: PropostaVenda | null;
}

export const NewProposalWizardModal: React.FC<NewProposalWizardModalProps> = ({
  isOpen,
  onClose,
  properties,
  leads,
  owners,
  onSaveProposal,
  preselectedProperty,
  editingProposal
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Selected Property
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(preselectedProperty?.id || '');
  const [propertySearch, setPropertySearch] = useState('');

  // Step 2: Client / Buyer
  const [clientType, setClientType] = useState<'EXISTING' | 'NEW'>('EXISTING');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [leadSearch, setLeadSearch] = useState('');
  
  // New Client Fields
  const [newClientName, setNewClientName] = useState('');
  const [newClientCpf, setNewClientCpf] = useState('');
  const [newClientRg, setNewClientRg] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientCivilState, setNewClientCivilState] = useState('Casado em Comunhão Parcial');
  const [newClientProfession, setNewClientProfession] = useState('Empresário');

  // Step 3: Financial Conditions
  const [valorProposto, setValorProposto] = useState('');
  const [valorSinal, setValorSinal] = useState('');
  const [dataSinal, setDataSinal] = useState(new Date().toISOString().split('T')[0]);
  const [formaSinal, setFormaSinal] = useState<'PIX' | 'TED' | 'CHEQUE_ADM'>('PIX');
  const [valorFgts, setValorFgts] = useState('');
  const [valorFinanciamento, setValorFinanciamento] = useState('');
  const [bancoFinanciamento, setBancoFinanciamento] = useState('Banco Itaú');
  const [valorParcelasDiretas, setValorParcelasDiretas] = useState('');
  const [qtdParcelasDiretas, setQtdParcelasDiretas] = useState('12');
  const [valorPermuta, setValorPermuta] = useState('');
  const [descricaoPermuta, setDescricaoPermuta] = useState('');
  const [valorSaldoChaves, setValorSaldoChaves] = useState('');
  const [validadeDias, setValidadeDias] = useState('5');
  const [condicoesEspeciais, setCondicoesEspeciais] = useState('Inclusão de armários planejados e aparelhos de ar-condicionado fixados.');

  // Step 4: Commission & Broker
  const [percentualComissao, setPercentualComissao] = useState('6.0');
  const [formaComissao, setFormaComissao] = useState<FormaComissao>('RETIDA_SINAL');
  const [corretorNome, setCorretorNome] = useState('Renata Albuquerque');
  const [corretorCreci, setCorretorCreci] = useState('CRECI 198.442-F');

  // Populate when editing
  React.useEffect(() => {
    if (editingProposal) {
      setSelectedPropertyId(editingProposal.imovelId);
      setSelectedLeadId(editingProposal.compradorId || '');
      setNewClientName(editingProposal.compradorNome);
      setNewClientCpf(editingProposal.compradorCpfCnpj || '');
      setNewClientPhone(editingProposal.compradorTelefone);
      setNewClientEmail(editingProposal.compradorEmail || '');
      setValorProposto(String(editingProposal.condicoes.valorProposto));
      setValorSinal(String(editingProposal.condicoes.valorSinalEntrada));
      setFormaSinal(editingProposal.condicoes.formaSinal);
      setDataSinal(editingProposal.condicoes.dataPrevisaoSinal || new Date().toISOString().split('T')[0]);
      setValorFgts(editingProposal.condicoes.valorFgts ? String(editingProposal.condicoes.valorFgts) : '');
      setValorFinanciamento(editingProposal.condicoes.valorFinanciamentoBancario ? String(editingProposal.condicoes.valorFinanciamentoBancario) : '');
      setBancoFinanciamento(editingProposal.condicoes.bancoFinanciamento || 'Banco Itaú');
      setValorParcelasDiretas(editingProposal.condicoes.valorParcelasDiretas ? String(editingProposal.condicoes.valorParcelasDiretas) : '');
      setQtdParcelasDiretas(String(editingProposal.condicoes.quantidadeParcelasDiretas || 12));
      setValorPermuta(editingProposal.condicoes.valorPermutaBem ? String(editingProposal.condicoes.valorPermutaBem) : '');
      setDescricaoPermuta(editingProposal.condicoes.descricaoPermuta || '');
      setValorSaldoChaves(editingProposal.condicoes.valorSaldoEscrituraChaves ? String(editingProposal.condicoes.valorSaldoEscrituraChaves) : '');
      setValidadeDias(String(editingProposal.condicoes.validadeDiasUteis || 5));
      setCondicoesEspeciais(editingProposal.condicoes.condicoesEspeciais || '');
      setPercentualComissao(String(editingProposal.comissao.percentualComissao || 6.0));
      setFormaComissao(editingProposal.comissao.formaCobranca || 'RETIDA_SINAL');
      setCorretorNome(editingProposal.corretorResponsavelNome || 'Renata Albuquerque');
      setCorretorCreci(editingProposal.corretorCreci || 'CRECI 198.442-F');
    }
  }, [editingProposal]);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchText = !propertySearch || 
        p.code.toLowerCase().includes(propertySearch.toLowerCase()) ||
        p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
        p.address.neighborhood.toLowerCase().includes(propertySearch.toLowerCase());
      return matchText && p.status === 'DISPONIVEL';
    });
  }, [properties, propertySearch]);

  // Selected Property Object
  const selectedProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropertyId);
  }, [properties, selectedPropertyId]);

  // Auto-fill proposed price with property sale price when selected
  React.useEffect(() => {
    if (selectedProperty && selectedProperty.pricing.salePrice && !valorProposto) {
      setValorProposto(String(selectedProperty.pricing.salePrice));
      setValorSinal(String(selectedProperty.pricing.salePrice * 0.2)); // 20% sinal padrão
    }
  }, [selectedProperty]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      return !leadSearch || 
        l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
        l.phone.includes(leadSearch) ||
        (l.email && l.email.toLowerCase().includes(leadSearch.toLowerCase()));
    });
  }, [leads, leadSearch]);

  const selectedLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId);
  }, [leads, selectedLeadId]);

  if (!isOpen) return null;

  // Calculation of totals
  const numValorProposto = parseFloat(valorProposto.replace(',', '.')) || 0;
  const numValorSinal = parseFloat(valorSinal.replace(',', '.')) || 0;
  const numValorFgts = parseFloat(valorFgts.replace(',', '.')) || 0;
  const numValorFinanciamento = parseFloat(valorFinanciamento.replace(',', '.')) || 0;
  const numValorParcelas = parseFloat(valorParcelasDiretas.replace(',', '.')) || 0;
  const numValorPermuta = parseFloat(valorPermuta.replace(',', '.')) || 0;
  const numValorSaldoChaves = parseFloat(valorSaldoChaves.replace(',', '.')) || 0;
  
  const somaCondicoes = numValorSinal + numValorFgts + numValorFinanciamento + numValorParcelas + numValorPermuta + numValorSaldoChaves;
  const diferenca = numValorProposto - somaCondicoes;

  const numTabela = selectedProperty?.pricing.salePrice || numValorProposto;
  const variacaoTabela = numTabela > 0 ? ((numValorProposto - numTabela) / numTabela) * 100 : 0;

  const numPercentComissao = parseFloat(percentualComissao.replace(',', '.')) || 6.0;
  const valorComissaoTotal = (numValorProposto * numPercentComissao) / 100;

  const handleFinishProposal = () => {
    if (!selectedProperty) return;

    const propId = editingProposal ? editingProposal.id : `prop-${Date.now()}`;
    const cod = editingProposal ? editingProposal.codigo : `PROP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + parseInt(validadeDias || '5'));

    // Resolve Buyer
    const compradorNome = clientType === 'EXISTING' ? (selectedLead?.name || 'Comprador Proponente') : newClientName;
    const compradorCpfCnpj = clientType === 'EXISTING' ? (selectedLead?.cpf || '000.000.000-00') : newClientCpf;
    const compradorTelefone = clientType === 'EXISTING' ? (selectedLead?.phone || '') : newClientPhone;
    const compradorEmail = clientType === 'EXISTING' ? (selectedLead?.email || '') : newClientEmail;

    // Resolve Vendor
    const owner = owners.find(o => o.id === selectedProperty.ownerId);
    const vendedorNome = owner ? owner.name : selectedProperty.ownerName;
    const vendedorCpf = owner ? owner.document : '111.222.333-44';
    const vendedorPhone = owner ? owner.phone : '(11) 98888-0000';
    const vendedorMail = owner ? owner.email : 'vendedor@imovel.com.br';

    const novaProposta: PropostaVenda = {
      id: propId,
      codigo: cod,
      dataCriacao: editingProposal ? editingProposal.dataCriacao : new Date().toISOString().replace('T', ' ').substring(0, 16),
      dataUltimaAtualizacao: new Date().toISOString().replace('T', ' ').substring(0, 16),
      imovelId: selectedProperty.id,
      imovelCodigo: selectedProperty.code,
      imovelTitulo: selectedProperty.title,
      imovelEndereco: `${selectedProperty.address.street}, ${selectedProperty.address.number || 'S/N'} - ${selectedProperty.address.neighborhood}, ${selectedProperty.address.city}/${selectedProperty.address.state}`,
      imovelFotoUrl: selectedProperty.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      vendedorId: selectedProperty.ownerId,
      vendedorNome,
      vendedorCpfCnpj: vendedorCpf,
      vendedorTelefone: vendedorPhone,
      vendedorEmail: vendedorMail,
      compradorId: clientType === 'EXISTING' ? selectedLeadId : undefined,
      compradorNome,
      compradorCpfCnpj,
      compradorRg: newClientRg || 'Identificado nos autos',
      compradorTelefone,
      compradorEmail,
      compradorProfissao: newClientProfession,
      compradorEstadoCivil: newClientCivilState,
      condicoes: {
        valorTabelaImovel: selectedProperty.pricing.salePrice || numValorProposto,
        valorProposto: numValorProposto,
        descontoOuAcrescimo: variacaoTabela,
        valorSinalEntrada: numValorSinal,
        dataPrevisaoSinal: dataSinal,
        formaSinal,
        valorFgts: numValorFgts,
        valorFinanciamentoBancario: numValorFinanciamento,
        bancoFinanciamento,
        valorParcelasDiretas: numValorParcelas,
        quantidadeParcelasDiretas: parseInt(qtdParcelasDiretas || '1'),
        valorParcelaMensal: numValorParcelas > 0 ? numValorParcelas / parseInt(qtdParcelasDiretas || '1') : 0,
        valorBaloesIntermediarias: 0,
        valorPermutaBem: numValorPermuta,
        descricaoPermuta: descricaoPermuta || undefined,
        valorSaldoEscrituraChaves: numValorSaldoChaves,
        validadeDiasUteis: parseInt(validadeDias || '5'),
        dataExpiracao: expDate.toISOString().split('T')[0],
        condicoesEspeciais
      },
      comissao: {
        percentualComissao: numPercentComissao,
        valorComissaoTotal,
        formaCobranca: formaComissao,
        splitCorretorFechador: {
          nome: corretorNome,
          percentual: 45,
          valor: valorComissaoTotal * 0.45
        },
        splitCorretorCaptador: {
          nome: 'Corretor Captador',
          percentual: 15,
          valor: valorComissaoTotal * 0.15
        },
        splitImobiliaria: {
          nome: 'AcertGo Imóveis Matriz',
          percentual: 40,
          valor: valorComissaoTotal * 0.40
        }
      },
      corretorResponsavelNome: corretorNome,
      corretorCreci,
      status: 'ENCAMINHADA_VENDEDOR'
    };

    onSaveProposal(novaProposta);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col my-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Wizard Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {editingProposal ? `Editar Proposta (${editingProposal.codigo})` : 'Assistente de Proposta de Compra e Venda'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {editingProposal ? 'Atualize as condições financeiras e comissões' : 'Gere propostas formais com fluxo financeiro, comissão e minuta legal'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors shrink-0 shadow-xs"
            title="Fechar formulário (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator - Fully Mobile Responsive without cutting letters */}
        <div className="bg-slate-950/80 px-2 sm:px-6 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-semibold shrink-0 gap-1 overflow-x-auto horizontal-scroll-hint">
          {[
            { step: 1, label: 'Imóvel' },
            { step: 2, label: 'Comprador' },
            { step: 3, label: 'Condições' },
            { step: 4, label: 'Comissão' }
          ].map(s => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step as any)}
              className={`flex items-center gap-1 sm:gap-1.5 py-1 px-2 sm:px-3 rounded-lg transition-all text-[11px] sm:text-xs shrink-0 ${
                currentStep === s.step 
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : currentStep > s.step
                  ? 'text-emerald-400 hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                {s.step}
              </span>
              <span>{s.label}</span>
              {currentStep > s.step && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: SELEÇÃO DO IMÓVEL */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Home className="w-4 h-4 text-blue-400" />
                    Selecione o Imóvel Objeto da Proposta
                  </h3>
                  <p className="text-xs text-slate-400">Busque pelo código do imóvel, título ou bairro</p>
                </div>
              </div>

              {/* Input de Busca */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={propertySearch}
                  onChange={e => setPropertySearch(e.target.value)}
                  placeholder="Filtrar por código (ex: AP-PIN-044), condomínio ou rua..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredProperties.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPropertyId(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex gap-3 ${
                      selectedPropertyId === p.id
                        ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img 
                      src={p.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'} 
                      alt="" 
                      className="w-20 h-20 rounded-lg object-cover shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-blue-400 px-1.5 py-0.5 rounded-sm bg-blue-950/80 border border-blue-800/60">
                        {p.code}
                      </span>
                      <h4 className="font-semibold text-white text-xs mt-1 truncate">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{p.address.neighborhood} • {p.address.city}</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">
                        R$ {(p.pricing.salePrice || 0).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PROPONENTE COMPRADOR */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    Identificação do Proponente Comprador
                  </h3>
                  <p className="text-xs text-slate-400">Escolha um lead/cliente cadastrado ou insira os dados do novo comprador</p>
                </div>

                <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setClientType('EXISTING')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      clientType === 'EXISTING' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cliente Cadastrado
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('NEW')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      clientType === 'NEW' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    + Novo Proponente
                  </button>
                </div>
              </div>

              {clientType === 'EXISTING' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={e => setLeadSearch(e.target.value)}
                      placeholder="Buscar por nome do cliente ou telefone..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {filteredLeads.map(l => (
                      <div
                        key={l.id}
                        onClick={() => setSelectedLeadId(l.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedLeadId === l.id
                            ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-white text-xs">{l.name}</p>
                          <p className="text-[11px] text-slate-400">{l.phone} • {l.email || 'Sem e-mail'}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {l.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 font-medium mb-1">Nome Completo do Comprador *</label>
                    <input
                      type="text"
                      value={newClientName}
                      onChange={e => setNewClientName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo de Castro"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">CPF *</label>
                    <input
                      type="text"
                      value={newClientCpf}
                      onChange={e => setNewClientCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">RG</label>
                    <input
                      type="text"
                      value={newClientRg}
                      onChange={e => setNewClientRg(e.target.value)}
                      placeholder="00.000.000-0 SSP/SP"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">WhatsApp / Telefone *</label>
                    <input
                      type="text"
                      value={newClientPhone}
                      onChange={e => setNewClientPhone(e.target.value)}
                      placeholder="(11) 98888-7777"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">E-mail *</label>
                    <input
                      type="email"
                      value={newClientEmail}
                      onChange={e => setNewClientEmail(e.target.value)}
                      placeholder="cliente@email.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Estado Civil</label>
                    <input
                      type="text"
                      value={newClientCivilState}
                      onChange={e => setNewClientCivilState(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Profissão</label>
                    <input
                      type="text"
                      value={newClientProfession}
                      onChange={e => setNewClientProfession(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CONDIÇÕES FINANCEIRAS */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Engenharia Financeira & Condições de Pagamento
                  </h3>
                  <p className="text-xs text-slate-400">Especifique o valor global e o desdobramento do fluxo de pagamento</p>
                </div>
              </div>

              {/* Valor de Pedido vs Valor Proposto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Valor de Tabela / Pedido Original</label>
                  <p className="text-base font-extrabold text-slate-300 font-mono">
                    R$ {(selectedProperty?.pricing.salePrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Valor Total Proposto pelo Comprador (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorProposto}
                    onChange={e => setValorProposto(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-emerald-400 font-bold font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                  <span className={`text-[11px] font-bold block mt-1 ${variacaoTabela < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    Variação: {variacaoTabela.toFixed(2)}% em relação ao pedido original
                  </span>
                </div>
              </div>

              {/* Desmembramento do Pagamento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sinal / Arras de Entrada (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorSinal}
                    onChange={e => setValorSinal(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Forma do Sinal</label>
                  <select
                    value={formaSinal}
                    onChange={e => setFormaSinal(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PIX">PIX Imediato</option>
                    <option value="TED">Transferência TED</option>
                    <option value="CHEQUE_ADM">Cheque Administrativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Previsão do Sinal</label>
                  <input
                    type="date"
                    value={dataSinal}
                    onChange={e => setDataSinal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Financiamento Bancário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorFinanciamento}
                    onChange={e => setValorFinanciamento(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Banco Pretendido</label>
                  <input
                    type="text"
                    value={bancoFinanciamento}
                    onChange={e => setBancoFinanciamento(e.target.value)}
                    placeholder="Ex: Itaú, Caixa, Bradesco..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Recursos de FGTS (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorFgts}
                    onChange={e => setValorFgts(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Parcelas Diretas com Vendedor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorParcelasDiretas}
                    onChange={e => setValorParcelasDiretas(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nº de Parcelas Diretas</label>
                  <input
                    type="number"
                    value={qtdParcelasDiretas}
                    onChange={e => setQtdParcelasDiretas(e.target.value)}
                    placeholder="12"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Saldo nas Chaves / Escritura (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorSaldoChaves}
                    onChange={e => setValorSaldoChaves(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Permuta / Dação */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Permuta / Dação de Bem (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorPermuta}
                    onChange={e => setValorPermuta(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Descrição do Bem em Permuta</label>
                  <input
                    type="text"
                    value={descricaoPermuta}
                    onChange={e => setDescricaoPermuta(e.target.value)}
                    placeholder="Ex: Veículo BMW 2024 ou Imóvel menor em São Caetano..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Status do Somatório do Fluxo */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Soma dos Itens de Pagamento:</span>
                  <p className="font-mono font-bold text-white text-sm">R$ {somaCondicoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Diferença para o Valor Proposto:</span>
                  <p className={`font-mono font-bold text-sm ${Math.abs(diferenca) < 0.01 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {Math.abs(diferenca) < 0.01 ? '✓ Fluxo 100% Equalizado' : `Diferença: R$ ${diferenca.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* Validade e Condições Especiais */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Validade da Proposta (Dias)</label>
                  <input
                    type="number"
                    value={validadeDias}
                    onChange={e => setValidadeDias(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-400 font-medium mb-1">Condições Especiais / Mobília</label>
                  <input
                    type="text"
                    value={condicoesEspeciais}
                    onChange={e => setCondicoesEspeciais(e.target.value)}
                    placeholder="Armários, ar-condicionado, prazo de desocupação..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: COMISSÃO & CORRETOR */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-400" />
                    Honorários de Corretagem & Split da Imobiliária
                  </h3>
                  <p className="text-xs text-slate-400">Defina o percentual acordado e a forma de dedução/cobrança no sinal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Comissão Acordada (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={percentualComissao}
                    onChange={e => setPercentualComissao(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Valor Total da Comissão</label>
                  <p className="text-base font-extrabold text-emerald-400 font-mono mt-1">
                    R$ {valorComissaoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Forma de Quitação</label>
                  <select
                    value={formaComissao}
                    onChange={e => setFormaComissao(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="RETIDA_SINAL">Retida Diretamente no Sinal</option>
                    <option value="PAGA_VENDEDOR">Paga pelo Vendedor no Sinal</option>
                    <option value="PAGA_COMPRADOR">Paga pelo Comprador</option>
                  </select>
                </div>
              </div>

              {/* Split Demonstrativo */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">Divisão de Honorários (Split AcertGo):</span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Corretor Fechador (45%)</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      R$ {(valorComissaoTotal * 0.45).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Corretor Captador (15%)</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      R$ {(valorComissaoTotal * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Imobiliária Matriz (40%)</span>
                    <span className="font-bold text-blue-400 font-mono">
                      R$ {(valorComissaoTotal * 0.40).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dados do Corretor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Corretor Responsável</label>
                  <input
                    type="text"
                    value={corretorNome}
                    onChange={e => setCorretorNome(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">CRECI do Corretor</label>
                  <input
                    type="text"
                    value={corretorCreci}
                    onChange={e => setCorretorCreci(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => (prev - 1) as any)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              disabled={currentStep === 1 && !selectedPropertyId}
              onClick={() => setCurrentStep(prev => (prev + 1) as any)}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition-all"
            >
              Avançar
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishProposal}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar Proposta & Gerar Minuta
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

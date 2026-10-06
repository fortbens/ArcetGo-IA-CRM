import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Building, 
  Phone, 
  Mail, 
  Calendar, 
  Cake, 
  UserCheck, 
  ChevronDown, 
  Users, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Lead, LeadSource, InterestType, MaritalStatus, LeadProposer } from '../../types/crm';

interface NewLeadModalProps {
  onClose: () => void;
  onSubmitLead: (newLead: Partial<Lead>) => void;
  existingLeads?: Lead[];
  onSelectExistingLead?: (lead: Lead) => void;
  availableBrokers?: { id: string; name: string }[];
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ 
  onClose, 
  onSubmitLead,
  existingLeads = [],
  onSelectExistingLead,
  availableBrokers = [
    { id: 'usr_corretor_juliana', name: 'Juliana Mendes' },
    { id: 'usr_corretor_roberto', name: 'Roberto Carlos' },
    { id: 'usr_corretor_fernanda', name: 'Fernanda Lima' },
    { id: 'usr_corretor_marcos', name: 'Marcos Silva' }
  ]
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<LeadSource>('PORTAL_ZAP');
  const [interestType, setInterestType] = useState<InterestType>('COMPRA');
  const [budgetMin, setBudgetMin] = useState(1500000);
  const [budgetMax, setBudgetMax] = useState(2500000);
  const [propertyTitle, setPropertyTitle] = useState('');
  
  // Dados de Qualificação SDR (CPF, RG, Estado Civil, Data de Nascimento)
  const [showCivilData, setShowCivilData] = useState(false);
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('SOLTEIRO');
  const [birthDate, setBirthDate] = useState('');
  const [sendBirthdayWishes, setSendBirthdayWishes] = useState(true);

  // Proponentes Adicionais (Até 4 proponentes livres para o contrato)
  const [showProposers, setShowProposers] = useState(false);
  const [proposers, setProposers] = useState<LeadProposer[]>([]);

  // Vinculação ao Corretor & Trava de Proteção Anti-Repasse
  const [selectedBrokerName, setSelectedBrokerName] = useState('Juliana Mendes');
  const [lockToBroker, setLockToBroker] = useState(true);
  const [lockPeriodDays, setLockPeriodDays] = useState<number>(60);

  // Anti-duplicidade state
  const [duplicateMatch, setDuplicateMatch] = useState<{ lead: Lead; reason: string } | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  // Helpers para adicionar/remover proponentes
  const handleAddProposer = () => {
    if (proposers.length >= 3) { // 1 titular + 3 adicionais = até 4 proponentes totais
      return;
    }
    const newP: LeadProposer = {
      id: `prop_${Date.now()}_${proposers.length}`,
      name: '',
      relationship: proposers.length === 0 ? 'CONJUGE' : 'SEGUNDO_COMPRADOR',
      cpf: '',
      phone: '',
      email: '',
      profession: ''
    };
    setProposers([...proposers, newP]);
    setShowProposers(true);
  };

  const handleUpdateProposer = (index: number, updates: Partial<LeadProposer>) => {
    const next = [...proposers];
    next[index] = { ...next[index], ...updates };
    setProposers(next);
  };

  const handleRemoveProposer = (index: number) => {
    setProposers(proposers.filter((_, i) => i !== index));
  };

  // Verificação de duplicidade com cruzamento rigoroso de Nome, E-mail e Telefone
  const checkForDuplicates = (): { lead: Lead; reason: string } | null => {
    const cleanDigits = phone.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim().toLowerCase();

    for (const exLead of existingLeads) {
      const exDigits = exLead.phone.replace(/\D/g, '');
      const exEmail = exLead.email?.trim().toLowerCase();
      const exName = exLead.name?.trim().toLowerCase();

      // Checagem de telefone (se tiver ao menos 8 dígitos comparáveis)
      if (cleanDigits.length >= 8 && exDigits.length >= 8) {
        if (cleanDigits === exDigits || exDigits.includes(cleanDigits) || cleanDigits.includes(exDigits)) {
          return { lead: exLead, reason: 'Telefone / WhatsApp idêntico' };
        }
      }

      // Checagem de e-mail
      if (cleanEmail && exEmail && cleanEmail === exEmail) {
        return { lead: exLead, reason: 'E-mail idêntico já cadastrado' };
      }

      // Checagem de nome exato
      if (cleanName.length >= 5 && cleanName === exName) {
        return { lead: exLead, reason: 'Nome completo idêntico na carteira' };
      }
    }
    return null;
  };

  const executeSubmit = () => {
    const brokerObj = availableBrokers.find(b => b.name === selectedBrokerName) || availableBrokers[0];
    const brokerLockedUntil = lockToBroker
      ? new Date(Date.now() + lockPeriodDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    // Titular como proponente principal se houver lista de proponentes
    const fullProposersList: LeadProposer[] = [
      {
        id: `prop_titular_${Date.now()}`,
        name: name.trim(),
        relationship: 'TITULAR',
        cpf: cpf.trim() || undefined,
        rg: rg.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined
      },
      ...proposers.filter(p => p.name.trim().length > 0)
    ];

    onSubmitLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      source,
      interestType,
      budgetMin,
      budgetMax,
      propertyOfInterestTitle: propertyTitle || 'Apartamento nos Jardins',
      stage: 'NOVO_LEAD',
      assignedBrokerId: brokerObj.id,
      assignedBrokerName: brokerObj.name,
      cpf: cpf.trim() || undefined,
      rg: rg.trim() || undefined,
      maritalStatus: showCivilData ? maritalStatus : undefined,
      birthDate: birthDate || undefined,
      sdrQualified: !!(cpf || rg || birthDate),
      sendBirthdayWishes,
      proposers: fullProposersList,
      brokerLockedUntil,
      brokerLockPeriodDays: lockToBroker ? lockPeriodDays : undefined,
      qualifiedAt: (cpf || rg) ? new Date().toISOString() : undefined
    });

    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Checagem de duplicidade
    const found = checkForDuplicates();
    if (found) {
      setDuplicateMatch(found);
      setShowDuplicateDialog(true);
      return;
    }

    executeSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Cadastrar Novo Lead no CRM
              </h3>
              <p className="text-[11px] text-slate-500">
                Cadastro de proponentes, vinculação ao corretor e proteção anti-duplicidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nome Completo do Cliente (1º Proponente Titular) *</label>
            <input
              type="text"
              required
              placeholder="Ex: Vanessa Guimarães"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">E-mail</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Canal de Origem</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="PASSAGEM_STAND">Passagem Stand (Plantão Presencial)</option>
                <option value="VISITA_IMOBILIARIA">Visita na Imobiliária (Balcão)</option>
                <option value="PORTAL_ZAP">Portal Zap Imóveis</option>
                <option value="PORTAL_VIVAREAL">Portal VivaReal</option>
                <option value="WHATSAPP_DIRETO">WhatsApp Direto</option>
                <option value="PLACA_QR_CODE">Placa Física (QR Code)</option>
                <option value="INDICOU_GANHOU">Programa Indicou Ganhou</option>
                <option value="INSTAGRAM_ADS">Meta Ads / Instagram</option>
                <option value="SITE_OFICIAL">Site Oficial da Imobiliária</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tipo de Interesse</label>
              <select
                value={interestType}
                onChange={(e) => setInterestType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="COMPRA">Compra (Prontos)</option>
                <option value="LANCAMENTO">Lançamento na Planta</option>
                <option value="LOCACAO">Locação Residencial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Imóvel de Interesse Inicial</label>
            <input
              type="text"
              placeholder="Ex: Residencial Jardins One ou Ap 210m² Pinheiros"
              value={propertyTitle}
              onChange={(e) => setPropertyTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Orçamento Mínimo (R$)</label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Orçamento Máximo (R$)</label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 tabular-nums"
              />
            </div>
          </div>

          {/* DADOS DE QUALIFICAÇÃO SDR & DOCUMENTAÇÃO CIVIL */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowCivilData(!showCivilData)}
              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-xs text-slate-800">
                  Qualificação & Documentação Civil (CPF, RG, Estado Civil, Nascimento)
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showCivilData ? 'rotate-180' : ''}`} />
            </button>

            {showCivilData && (
              <div className="p-3.5 bg-white space-y-3 border-t border-slate-100 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">CPF do Titular</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-mono focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">RG / Órgão</label>
                    <input
                      type="text"
                      placeholder="Ex: 24.890.112-X SSP/SP"
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Estado Civil</label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value as any)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                    >
                      <option value="SOLTEIRO">Solteiro(a)</option>
                      <option value="CASADO">Casado(a)</option>
                      <option value="UNIAO_ESTAVEL">União Estável</option>
                      <option value="DIVORCIADO">Divorciado(a)</option>
                      <option value="VIUVO">Viúvo(a)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-600" />
                        Nascimento
                      </span>
                      <Cake className="w-3 h-3 text-pink-500" />
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden font-mono focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={sendBirthdayWishes}
                    onChange={(e) => setSendBirthdayWishes(e.target.checked)}
                    className="rounded-sm border-slate-300 text-pink-600 focus:ring-pink-500 w-3.5 h-3.5"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">
                    Enviar mensagem de felicitações de aniversário automaticamente
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* MÚLTIPLOS PROPONENTES (ATÉ 4 PROPONENTES LIVRES) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowProposers(!showProposers)}
              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-bold text-xs text-slate-800">
                    Proponentes Adicionais (Até 4 Compradores / Cônjuge / Fiador)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {proposers.length + 1} de 4 participantes cadastrados
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showProposers ? 'rotate-180' : ''}`} />
            </button>

            {showProposers && (
              <div className="p-3.5 bg-white space-y-3 border-t border-slate-100 animate-in fade-in">
                <p className="text-[11px] text-slate-600">
                  Cadastre o cônjuge, segundo comprador, sócio ou fiador para facilitar a qualificação de crédito e emissão formal de contrato.
                </p>

                {/* Lista de proponentes adicionais */}
                {proposers.map((prop, idx) => (
                  <div key={prop.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">
                          {idx + 2}
                        </span>
                        Proponente {idx + 2}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProposer(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                        title="Remover Proponente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Nome Completo</label>
                        <input
                          type="text"
                          placeholder="Nome do segundo comprador ou cônjuge"
                          value={prop.name}
                          onChange={(e) => handleUpdateProposer(idx, { name: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Vínculo / Grau</label>
                        <select
                          value={prop.relationship}
                          onChange={(e) => handleUpdateProposer(idx, { relationship: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="CONJUGE">Cônjuge / Esposo(a)</option>
                          <option value="SEGUNDO_COMPRADOR">Segundo Comprador (Co-adquirente)</option>
                          <option value="AVALISTA_FIADOR">Avalista / Fiador</option>
                          <option value="SOCIO">Sócio / Empresa</option>
                          <option value="OUTRO">Outro Vínculo</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">CPF</label>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={prop.cpf || ''}
                          onChange={(e) => handleUpdateProposer(idx, { cpf: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden font-mono focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Telefone</label>
                        <input
                          type="text"
                          placeholder="(11) 98888-7777"
                          value={prop.phone || ''}
                          onChange={(e) => handleUpdateProposer(idx, { phone: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">E-mail</label>
                        <input
                          type="email"
                          placeholder="proponente@email.com"
                          value={prop.email || ''}
                          onChange={(e) => handleUpdateProposer(idx, { email: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {proposers.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddProposer}
                    className="w-full py-2 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Proponente {proposers.length + 2} (Até 4)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* VINCULAÇÃO AO CORRETOR & PERÍODO DE PROTEÇÃO DA IMOBILIÁRIA */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Vinculação ao Corretor & Trava de Proteção</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Anti-Repasse
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Corretor Responsável Inicial
                </label>
                <select
                  value={selectedBrokerName}
                  onChange={(e) => setSelectedBrokerName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {availableBrokers.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Prazo de Exclusividade / Proteção
                </label>
                <select
                  value={lockPeriodDays}
                  onChange={(e) => setLockPeriodDays(Number(e.target.value))}
                  disabled={!lockToBroker}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  <option value={30}>30 Dias (Padrão Inicial)</option>
                  <option value={60}>60 Dias (Recomendado)</option>
                  <option value={90}>90 Dias (Alto Padrão)</option>
                  <option value={180}>180 Dias (Exclusividade Longa)</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none pt-0.5">
              <input
                type="checkbox"
                checked={lockToBroker}
                onChange={(e) => setLockToBroker(e.target.checked)}
                className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span className="text-[11px] font-medium text-slate-700">
                Bloquear repasse para outro corretor durante o período de proteção
              </span>
            </label>
          </div>

          {/* Rodapé com botões de ação */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Cadastrar Lead
            </button>
          </div>
        </form>

        {/* DIÁLOGO MODAL DE ANTI-DUPLICIDADE DE CLIENTE */}
        {showDuplicateDialog && duplicateMatch && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Cliente Já Cadastrado na Imobiliária
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Detectamos duplicidade através do critério: <strong>{duplicateMatch.reason}</strong>.
                  </p>
                </div>
              </div>

              {/* Card com os dados do cliente existente */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {duplicateMatch.lead.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {duplicateMatch.lead.stage}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600">
                  <div><strong>Telefone:</strong> {duplicateMatch.lead.phone}</div>
                  {duplicateMatch.lead.email && (
                    <div><strong>E-mail:</strong> {duplicateMatch.lead.email}</div>
                  )}
                  <div>
                    <strong>Corretor Responsável:</strong> {duplicateMatch.lead.assignedBrokerName}
                  </div>
                  {duplicateMatch.lead.brokerLockedUntil && (
                    <div className="text-emerald-700 font-semibold flex items-center gap-1 mt-1 pt-1 border-t border-slate-200">
                      <Lock className="w-3 h-3" />
                      <span>
                        Protegido até: {new Date(duplicateMatch.lead.brokerLockedUntil).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                A imobiliária proíbe a duplicação ou o repasse indevido de contatos enquanto houver corretor responsável e período de proteção ativo.
              </p>

              <div className="space-y-2 pt-2">
                {onSelectExistingLead && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDuplicateDialog(false);
                      onSelectExistingLead(duplicateMatch.lead);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Cadastro Existente</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDuplicateDialog(false)}
                    className="flex-1 py-2 px-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Voltar e Corrigir
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDuplicateDialog(false);
                      executeSubmit();
                    }}
                    className="py-2 px-3 text-rose-600 hover:bg-rose-50 font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                    title="Exceção com registro na auditoria"
                  >
                    Cadastrar Mesmo Assim
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


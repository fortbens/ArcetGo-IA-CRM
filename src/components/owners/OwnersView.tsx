import React, { useState } from 'react';
import { 
  Users, 
  User, 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  CreditCard, 
  Building, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Briefcase,
  Lock,
  ShieldAlert,
  Cake,
  Sparkles,
  Camera,
  Scan
} from 'lucide-react';
import { 
  Owner, 
  RealEstateProperty, 
  OwnerPersonType, 
  OwnerStatus,
  UserProfile,
  AgencyGovernanceRules,
  DEFAULT_AGENCY_GOVERNANCE_RULES
} from '../../types/crm';
import { OwnerModal } from './OwnerModal';
import { OwnerDetailModal } from './OwnerDetailModal';
import { OwnerDocumentOcrModal } from './OwnerDocumentOcrModal';
import { ExtractedDocumentData } from '../../services/documentOcrService';

interface OwnersViewProps {
  owners: Owner[];
  properties: RealEstateProperty[];
  currentUser?: UserProfile;
  governanceRules?: AgencyGovernanceRules;
  onSaveOwner: (ownerData: Partial<Owner>) => void;
  onDeleteOwner: (ownerId: string) => void;
  onNavigateToProperty: (property: RealEstateProperty) => void;
  onOpenNewPropertyWithPreselectedOwner?: (owner: Owner) => void;
}

export const OwnersView: React.FC<OwnersViewProps> = ({
  owners,
  properties,
  currentUser,
  governanceRules = DEFAULT_AGENCY_GOVERNANCE_RULES,
  onSaveOwner,
  onDeleteOwner,
  onNavigateToProperty,
  onOpenNewPropertyWithPreselectedOwner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'TODOS' | OwnerPersonType>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<'TODOS' | OwnerStatus>('TODOS');
  const [filterBirthdays, setFilterBirthdays] = useState(false);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerToEdit, setOwnerToEdit] = useState<Owner | null>(null);
  const [selectedOwnerForDetail, setSelectedOwnerForDetail] = useState<Owner | null>(null);
  
  // Direct OCR modal state
  const [isOcrDirectModalOpen, setIsOcrDirectModalOpen] = useState(false);
  const [pendingOcrData, setPendingOcrData] = useState<ExtractedDocumentData | null>(null);

  // Statistics calculation
  const totalOwners = owners.length;
  const totalPF = owners.filter(o => o.personType === 'PF').length;
  const totalPJ = owners.filter(o => o.personType === 'PJ').length;
  const totalActive = owners.filter(o => o.status === 'ATIVO').length;

  const currentMonth = new Date().getMonth() + 1;
  const isBirthdayThisMonth = (birthDate?: string) => {
    if (!birthDate) return false;
    const parts = birthDate.split('-');
    if (parts.length >= 2) {
      return parseInt(parts[1], 10) === currentMonth;
    }
    return false;
  };

  const totalBirthdaysThisMonth = owners.filter(o => isBirthdayThisMonth(o.birthDate)).length;

  const totalManagedRent = properties
    .filter(p => p.pricing.rentPrice)
    .reduce((acc, curr) => acc + (curr.pricing.rentPrice || 0), 0);

  // Filtering
  const filteredOwners = owners.filter(owner => {
    const matchesSearch = 
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (owner.tradeName && owner.tradeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      owner.document.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')) ||
      owner.phone.includes(searchTerm) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.bankDetails.bankName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'TODOS' || owner.personType === selectedType;
    const matchesStatus = selectedStatus === 'TODOS' || owner.status === selectedStatus;
    const matchesBirthday = !filterBirthdays || isBirthdayThisMonth(owner.birthDate) || !!owner.birthDate;

    return matchesSearch && matchesType && matchesStatus && matchesBirthday;
  });

  const handleOpenCreate = () => {
    setOwnerToEdit(null);
    setPendingOcrData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (owner: Owner) => {
    setOwnerToEdit(owner);
    setPendingOcrData(null);
    setIsModalOpen(true);
  };

  const handleApplyDirectOcrData = (data: ExtractedDocumentData) => {
    setIsOcrDirectModalOpen(false);
    setOwnerToEdit(null);
    setPendingOcrData(data);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Partial<Owner>) => {
    setPendingOcrData(null);
    if (ownerToEdit) {
      onSaveOwner({ ...data, id: ownerToEdit.id });
    } else {
      const newOwner: Partial<Owner> = {
        ...data,
        id: `own_${Date.now()}`,
        propertiesCount: 0,
        createdAt: new Date().toISOString(),
      };
      onSaveOwner(newOwner);
    }
  };

  // Helper de governança: Avalia se o usuário logado tem permissão para visualizar contatos do proprietário
  const checkOwnerAccess = (owner: Owner, ownerProps: RealEstateProperty[]) => {
    if (!currentUser) return { allowed: true };
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MASTER_ADMIN' || currentUser.role === 'MANAGER') {
      return { allowed: true };
    }
    if (governanceRules.ownerAccessLevel === 'TODOS_CORRETORES') {
      return { allowed: true };
    }
    if (governanceRules.ownerAccessLevel === 'GERENTE_DIRETOR_ONLY') {
      return { 
        allowed: false, 
        reason: 'Acesso restrito à Gerência e Diretoria conforme as regras de governança da imobiliária.' 
      };
    }
    // CAPTADOR_GERENTE_DIRETOR ou CAPTADOR_E_EQUIPE
    const isCaptador = ownerProps.some(p => 
      p.captadorId === currentUser.id || 
      (p.captadorName && p.captadorName.toLowerCase() === currentUser.name.toLowerCase())
    );
    if (isCaptador) {
      return { allowed: true };
    }
    const captadorNames = Array.from(new Set(ownerProps.map(p => p.captadorName).filter(Boolean))).join(', ');
    return {
      allowed: false,
      reason: captadorNames 
        ? `Apenas o captador credenciado (${captadorNames}) e a Gerência possuem acesso direto aos contatos deste proprietário.`
        : 'Apenas o captador do imóvel e a Gerência possuem acesso aos contatos e dados bancários.'
    };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Proprietários (PF & PJ)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {totalOwners} Cadastrados
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão cadastral completa de Pessoa Física e Jurídica com dados bancários para Split Fintech de repasse
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOcrDirectModalOpen(true)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Escanear documento do proprietário pela câmera ou upload para preenchimento automático"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Escanear Documento (OCR)</span>
            <span className="sm:hidden">OCR Câmera</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-white/20 text-white uppercase">IA</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Proprietário</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Proprietários</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOwners}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span className="text-emerald-600 font-bold">{totalActive} ativos</span> • {totalOwners - totalActive} pendentes
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pessoa Física (PF)</span>
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPF}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {Math.round((totalPF / (totalOwners || 1)) * 100)}% da carteira proprietária
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pessoa Jurídica (PJ)</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPJ}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Holdings, Fundos e Incorporadoras
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aluguel sob Split</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {totalManagedRent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Volume mensal com repasse Asaas
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF/CNPJ, telefone, e-mail..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedType('TODOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === 'TODOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedType('PF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                selectedType === 'PF' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              PF
            </button>
            <button
              onClick={() => setSelectedType('PJ')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                selectedType === 'PJ' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              PJ
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedStatus('TODOS')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                selectedStatus === 'TODOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Status: Todos
            </button>
            <button
              onClick={() => setSelectedStatus('ATIVO')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                selectedStatus === 'ATIVO' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setSelectedStatus('EM_ANALISE')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                selectedStatus === 'EM_ANALISE' ? 'bg-white text-amber-700 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              Análise
            </button>
          </div>

          {/* Birthday Filter Button */}
          <button
            onClick={() => setFilterBirthdays(!filterBirthdays)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filterBirthdays
                ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'
            }`}
            title="Filtrar proprietários aniversariantes"
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Aniversariantes</span>
            {totalBirthdaysThisMonth > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filterBirthdays ? 'bg-white text-pink-700' : 'bg-pink-200 text-pink-900'
              }`}>
                {totalBirthdaysThisMonth}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white">
            <button
              onClick={() => setViewMode('CARDS')}
              title="Visualização em Grade"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'CARDS' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              title="Visualização em Tabela"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'TABLE' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredOwners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Nenhum proprietário encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ajuste os filtros de busca ou cadastre um novo proprietário físico ou jurídico.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Cadastrar Proprietário
          </button>
        </div>
      ) : viewMode === 'CARDS' ? (
        /* CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOwners.map(owner => {
            const isPF = owner.personType === 'PF';
            const ownerProps = properties.filter(p => p.ownerId === owner.id);
            const access = checkOwnerAccess(owner, ownerProps);

            return (
              <div
                key={owner.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0 ${
                        isPF ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-amber-600 to-orange-700'
                      }`}>
                        {isPF ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {owner.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-md ${
                            isPF ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {isPF ? 'PF' : 'PJ'}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {owner.document}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      owner.status === 'ATIVO'
                        ? 'bg-emerald-50 text-emerald-700'
                        : owner.status === 'EM_ANALISE'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {owner.status === 'ATIVO' ? 'Ativo' : owner.status === 'EM_ANALISE' ? 'Análise' : 'Bloq'}
                    </span>
                  </div>

                  {owner.tradeName && (
                    <p className="text-xs text-slate-600 italic">
                      Nome Fantasia: {owner.tradeName}
                    </p>
                  )}

                  {/* Contact Chips / Governance Protection */}
                  {access.allowed ? (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp:
                        </span>
                        <a
                          href={`https://wa.me/55${owner.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {owner.phone}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-blue-600" /> E-mail:
                        </span>
                        <span className="font-mono text-slate-800 truncate max-w-[180px]">
                          {owner.email}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Building className="w-3.5 h-3.5 text-indigo-600" /> Cidade:
                        </span>
                        <span className="font-medium text-slate-800">
                          {owner.address.neighborhood}, {owner.address.city}/{owner.address.state}
                        </span>
                      </div>

                      {owner.birthDate && (
                        <div className="flex items-center justify-between text-slate-600 pt-0.5">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Cake className="w-3.5 h-3.5 text-pink-600" /> Nascimento:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-800">
                              {owner.birthDate.split('-').reverse().join('/')}
                            </span>
                            {isBirthdayThisMonth(owner.birthDate) && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-pink-100 text-pink-700 animate-pulse">
                                Aniversário este mês
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {owner.birthDate && (
                        <div className="pt-1.5 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const cleanPhone = owner.phone.replace(/\D/g, '');
                              const primeNome = owner.name.split(' ')[0];
                              const msg = encodeURIComponent(
                                `🎉 Olá ${primeNome}! Em nome de toda a nossa equipe, desejamos a você um Feliz Aniversário! 🎂 Muita saúde, sucesso, realizações e prosperidade em seu novo ciclo. É uma grande satisfação ter você como nosso parceiro e proprietário!`
                              );
                              window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
                            }}
                            className="w-full py-1.5 px-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <Cake className="w-3.5 h-3.5 text-pink-200" />
                            <span>Parabenizar via WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                          <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Contatos Blindados (Captador / Gerência)</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-snug">
                          {access.reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bank & Split Preview */}
                  {access.allowed ? (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1 text-[11px] font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                          {owner.bankDetails.bankName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Ag {owner.bankDetails.agency} • CC {owner.bankDetails.accountNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 truncate font-mono">
                        Pix ({owner.bankDetails.pixKeyType}): <span className="font-bold">{owner.bankDetails.pixKey}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Lock className="w-3 h-3 text-slate-400" /> Dados Bancários & Pix
                      </span>
                      <span className="font-mono text-[10px]">Sigilo Comercial</span>
                    </div>
                  )}

                  {/* Linked Properties Preview */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Imóveis vinculados:</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {ownerProps.length} {ownerProps.length === 1 ? 'imóvel' : 'imóveis'}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedOwnerForDetail(owner)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Ficha 360°</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(owner)}
                      title="Editar Proprietário"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja realmente remover o proprietário "${owner.name}"?`)) {
                          onDeleteOwner(owner.id);
                        }
                      }}
                      title="Excluir Proprietário"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Proprietário / Documento</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Contato (WhatsApp / E-mail)</th>
                  <th className="py-3.5 px-4">Dados Bancários & Pix</th>
                  <th className="py-3.5 px-4 text-center">Imóveis</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOwners.map(owner => {
                  const isPF = owner.personType === 'PF';
                  const ownerProps = properties.filter(p => p.ownerId === owner.id);
                  const access = checkOwnerAccess(owner, ownerProps);

                  return (
                    <tr 
                      key={owner.id}
                      onClick={() => setSelectedOwnerForDetail(owner)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">{owner.name}</span>
                          {owner.birthDate && (
                            <span 
                              title={`Aniversário: ${owner.birthDate.split('-').reverse().join('/')}`}
                              className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-pink-100 text-pink-700 inline-flex items-center gap-0.5"
                            >
                              <Cake className="w-2.5 h-2.5" />
                              {owner.birthDate.split('-').slice(1).reverse().join('/')}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                          {owner.document} {owner.tradeName ? `(${owner.tradeName})` : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isPF ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {access.allowed ? (
                          <>
                            <div className="font-bold text-emerald-700">{owner.phone}</div>
                            <div className="text-slate-500 truncate max-w-[160px] font-mono">{owner.email}</div>
                          </>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>Blindado (Captador)</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {access.allowed ? (
                          <>
                            <div className="font-semibold text-slate-800">{owner.bankDetails.bankName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Pix: {owner.bankDetails.pixKey}
                            </div>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">••••••••••••</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {ownerProps.length}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          owner.status === 'ATIVO'
                            ? 'bg-emerald-50 text-emerald-700'
                            : owner.status === 'EM_ANALISE'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {owner.status === 'ATIVO' ? 'Ativo' : owner.status === 'EM_ANALISE' ? 'Em Análise' : 'Bloqueado'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(owner)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remover proprietário ${owner.name}?`)) {
                                onDeleteOwner(owner.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Owner Create / Edit Modal */}
      {isModalOpen && (
        <OwnerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setPendingOcrData(null);
          }}
          onSave={handleSaveModal}
          ownerToEdit={ownerToEdit}
          initialExtractedData={pendingOcrData}
        />
      )}

      {/* Direct OCR Document Scanner Modal */}
      {isOcrDirectModalOpen && (
        <OwnerDocumentOcrModal
          isOpen={isOcrDirectModalOpen}
          onClose={() => setIsOcrDirectModalOpen(false)}
          onApplyExtractedData={handleApplyDirectOcrData}
        />
      )}

      {/* Owner Detail 360° Modal */}
      {selectedOwnerForDetail && (
        <OwnerDetailModal
          isOpen={!!selectedOwnerForDetail}
          onClose={() => setSelectedOwnerForDetail(null)}
          owner={selectedOwnerForDetail}
          properties={properties}
          currentUser={currentUser}
          governanceRules={governanceRules}
          onEdit={(owner) => {
            setSelectedOwnerForDetail(null);
            handleOpenEdit(owner);
          }}
          onViewProperty={(property) => {
            setSelectedOwnerForDetail(null);
            onNavigateToProperty(property);
          }}
          onNewPropertyForOwner={(owner) => {
            setSelectedOwnerForDetail(null);
            if (onOpenNewPropertyWithPreselectedOwner) {
              onOpenNewPropertyWithPreselectedOwner(owner);
            }
          }}
        />
      )}
    </div>
  );
};

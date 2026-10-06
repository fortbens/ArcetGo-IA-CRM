import React, { useState } from 'react';
import { 
  Trophy, 
  Gift, 
  Users, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Award, 
  Sparkles, 
  Building, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  ChevronRight, 
  Wallet,
  ShieldCheck,
  Send,
  Star,
  MapPin,
  Home,
  X
} from 'lucide-react';
import { 
  GamifiedReferral, 
  ReferralLeaderboardPartner, 
  ReferralPartnerCategory, 
  GamifiedReferralStatus 
} from '../../types/crm';
import { 
  INITIAL_LEADERBOARD_PARTNERS, 
  INITIAL_GAMIFIED_REFERRALS 
} from '../../data/mockIndiqueGanhe';

export const IndiqueGanheView: React.FC = () => {
  const [partners, setPartners] = useState<ReferralLeaderboardPartner[]>(INITIAL_LEADERBOARD_PARTNERS);
  const [referrals, setReferrals] = useState<GamifiedReferral[]>(INITIAL_GAMIFIED_REFERRALS);
  
  // Navigation sub-tabs
  const [activeTab, setActiveTab] = useState<'pipeline' | 'ranking' | 'regras'>('pipeline');
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<'TODOS' | ReferralPartnerCategory>('TODOS');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | GamifiedReferralStatus>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [showPixPayoutModal, setShowPixPayoutModal] = useState<GamifiedReferral | null>(null);
  const [showShareModal, setShowShareModal] = useState<ReferralLeaderboardPartner | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State for New Referral
  const [formPartnerName, setFormPartnerName] = useState('');
  const [formPartnerCategory, setFormPartnerCategory] = useState<ReferralPartnerCategory>('PORTEIRO');
  const [formPartnerPhone, setFormPartnerPhone] = useState('');
  const [formPartnerPix, setFormPartnerPix] = useState('');
  const [formPartnerCondo, setFormPartnerCondo] = useState('');
  
  const [formPropertyAddress, setFormPropertyAddress] = useState('');
  const [formPropertyType, setFormPropertyType] = useState<'APARTAMENTO' | 'CASA' | 'COMERCIAL' | 'TERRENO'>('APARTAMENTO');
  const [formIntentType, setFormIntentType] = useState<'VENDA' | 'LOCACAO'>('VENDA');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formOwnerPhone, setFormOwnerPhone] = useState('');
  const [formEstimatedValue, setFormEstimatedValue] = useState<number | ''>(850000);
  const [formNotes, setFormNotes] = useState('');

  // KPIs
  const totalReferralsCount = referrals.length;
  const inProgressCount = referrals.filter(r => r.status === 'EM_NEGOCIACAO' || r.status === 'AGENDANDO_VISITA' || r.status === 'IMOVEL_CAPTADO').length;
  const closedDealsCount = referrals.filter(r => r.status === 'FECHADO_PREMIO_PAGO').length;
  const totalRewardsPaid = referrals.filter(r => r.status === 'FECHADO_PREMIO_PAGO').reduce((acc, r) => acc + r.rewardValue, 0);

  // Filtered referrals
  const filteredReferrals = referrals.filter(ref => {
    const matchesSearch = 
      ref.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ref.partnerCondoOrArea && ref.partnerCondoOrArea.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'TODOS' || ref.partnerCategory === categoryFilter;
    const matchesStatus = statusFilter === 'TODOS' || ref.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filtered partners
  const filteredPartners = categoryFilter === 'TODOS' 
    ? partners 
    : partners.filter(p => p.category === categoryFilter);

  const top3 = [...partners].sort((a, b) => b.points - a.points).slice(0, 3);

  // Handle New Referral Submit
  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPartnerName.trim() || !formPropertyAddress.trim() || !formOwnerName.trim()) return;

    // Automatic calculation of expected reward
    const estVal = Number(formEstimatedValue) || 500000;
    const calculatedReward = formIntentType === 'VENDA' 
      ? Math.round(estVal * 0.003) // ~0.3% do valor da venda como bonificação de indicação
      : Math.round(estVal * 0.4);  // ~40% do 1º aluguel

    const newRef: GamifiedReferral = {
      id: `ref_${Date.now()}`,
      partnerName: formPartnerName.trim(),
      partnerCategory: formPartnerCategory,
      partnerPhone: formPartnerPhone.trim() || '(11) 99999-0000',
      partnerPixKey: formPartnerPix.trim() || formPartnerPhone.trim() || 'pix@indicador.com',
      partnerCondoOrArea: formPartnerCondo.trim() || undefined,
      propertyAddress: formPropertyAddress.trim(),
      propertyType: formPropertyType,
      intentType: formIntentType,
      ownerName: formOwnerName.trim(),
      ownerPhone: formOwnerPhone.trim() || '(11) 98888-0000',
      estimatedValue: estVal,
      status: 'EM_VALIDACAO',
      rewardValue: Math.max(1000, calculatedReward),
      scorePoints: 150, // Pontos iniciais pela indicação qualificada
      notes: formNotes.trim() || 'Indicação cadastrada pela equipe comercial.',
      createdAt: new Date().toISOString(),
    };

    setReferrals([newRef, ...referrals]);

    // Check if partner exists in leaderboard or add them
    const existingPartner = partners.find(p => p.name.toLowerCase() === formPartnerName.toLowerCase());
    if (existingPartner) {
      setPartners(partners.map(p => p.id === existingPartner.id ? {
        ...p,
        points: p.points + 150,
        totalReferrals: p.totalReferrals + 1
      } : p));
    } else {
      const newPartner: ReferralLeaderboardPartner = {
        id: `lead_p_${Date.now()}`,
        name: formPartnerName.trim(),
        category: formPartnerCategory,
        condoOrBuilding: formPartnerCondo.trim() || 'Região Metropolitana',
        points: 150,
        totalReferrals: 1,
        convertedDeals: 0,
        totalEarnedRewards: 0,
        badgeLevel: 'BRONZE',
      };
      setPartners([newPartner, ...partners]);
    }

    setShowNewReferralModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormPartnerName('');
    setFormPartnerPhone('');
    setFormPartnerPix('');
    setFormPartnerCondo('');
    setFormPropertyAddress('');
    setFormOwnerName('');
    setFormOwnerPhone('');
    setFormNotes('');
  };

  // Status progression
  const handleAdvanceStatus = (referralId: string) => {
    const sequence: GamifiedReferralStatus[] = [
      'EM_VALIDACAO',
      'AGENDANDO_VISITA',
      'IMOVEL_CAPTADO',
      'EM_NEGOCIACAO',
      'FECHADO_PREMIO_PAGO'
    ];

    setReferrals(referrals.map(ref => {
      if (ref.id === referralId) {
        const currentIndex = sequence.indexOf(ref.status);
        const nextStatus = sequence[currentIndex + 1] || ref.status;
        
        // If reached payout
        if (nextStatus === 'FECHADO_PREMIO_PAGO') {
          return {
            ...ref,
            status: nextStatus,
            rewardPaidAt: new Date().toISOString(),
            scorePoints: ref.scorePoints + 500,
          };
        }

        return {
          ...ref,
          status: nextStatus,
          scorePoints: ref.scorePoints + 100,
        };
      }
      return ref;
    }));
  };

  const handleExecutePayout = (ref: GamifiedReferral) => {
    setReferrals(referrals.map(r => r.id === ref.id ? {
      ...r,
      status: 'FECHADO_PREMIO_PAGO',
      rewardPaidAt: new Date().toISOString(),
    } : r));

    // Update partner in leaderboard
    setPartners(partners.map(p => p.name.toLowerCase() === ref.partnerName.toLowerCase() ? {
      ...p,
      convertedDeals: p.convertedDeals + 1,
      totalEarnedRewards: p.totalEarnedRewards + ref.rewardValue,
      points: p.points + 600
    } : p));

    setShowPixPayoutModal(null);
  };

  const getStatusBadge = (status: GamifiedReferralStatus) => {
    switch (status) {
      case 'EM_VALIDACAO':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Em Validação</span>;
      case 'AGENDANDO_VISITA':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Agendando Visita</span>;
      case 'IMOVEL_CAPTADO':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Imóvel Captado</span>;
      case 'EM_NEGOCIACAO':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Em Negociação</span>;
      case 'FECHADO_PREMIO_PAGO':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">Negócio Fechado & PIX Pago</span>;
      case 'RECUSADA':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Recusada</span>;
    }
  };

  const getCategoryLabel = (category: ReferralPartnerCategory) => {
    switch (category) {
      case 'SINDICO': return 'Síndico(a)';
      case 'PORTEIRO': return 'Porteiro';
      case 'ZELADOR': return 'Zelador';
      case 'VIZINHO': return 'Vizinho(a)';
      case 'AMIGO': return 'Amigo(a)';
      case 'CORRETOR_PARCEIRO': return 'Corretor Parceiro';
      case 'CLIENTE_ANTIGO': return 'Cliente Fidelizado';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Trophy className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-heading flex items-center gap-2">
                Indique e Ganhe (Gamificado)
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Melhores Práticas de Mercado
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Programa de indicações para Síndicos, Porteiros, Zeladores, Vizinhos e Parceiros com premiação PIX e ranking
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewReferralModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Indicação</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Indicações</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">{totalReferralsCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Imóveis cadastrados por parceiros</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Em Andamento</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-600">{inProgressCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Validação, visita ou negociação</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Negócios Fechados</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700">{closedDealsCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Vendas e locações concluídas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prêmios Pagos via PIX</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-800">
            {totalRewardsPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Bonificação direta aos indicadores</p>
        </div>
      </div>

      {/* Podium of Top 3 Partners */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                Pódio dos Campeões de Indicação
              </span>
              <h2 className="text-xl md:text-2xl font-bold mt-2 font-heading">
                Quem mais indica, mais ganha no ecossistema
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('ranking')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
              >
                <span>Ver Ranking Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Podium Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {top3.map((partner, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              return (
                <div
                  key={partner.id}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isFirst 
                      ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-400/50 shadow-lg shadow-amber-500/10 order-first md:order-2 md:-translate-y-2' 
                      : isSecond
                      ? 'bg-slate-800/60 border-slate-700 order-2 md:order-1'
                      : 'bg-slate-800/60 border-slate-700 order-3 md:order-3'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-md ${
                        isFirst ? 'bg-amber-400 text-slate-950' : isSecond ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                      }`}>
                        {index + 1}º
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300">
                        Nível {partner.badgeLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      {partner.avatarUrl ? (
                        <img
                          src={partner.avatarUrl}
                          alt={partner.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-base">
                          {partner.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-base text-white">{partner.name}</h3>
                        <p className="text-xs text-amber-300 font-medium">{getCategoryLabel(partner.category)}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{partner.condoOrBuilding}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">PONTOS</span>
                      <strong className="text-amber-400 font-bold text-sm">{partner.points} pts</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">TOTAL EM PIX</span>
                      <strong className="text-emerald-400 font-bold text-sm">
                        {partner.totalEarnedRewards.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Esteira de Indicações ({referrals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'ranking'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Ranking de Parceiros ({partners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('regras')}
            className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'regras'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Regras & Premiações</span>
          </button>
        </div>

        {/* Category Quick Filter */}
        <div className="flex items-center gap-2 text-xs py-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold outline-hidden"
          >
            <option value="TODOS">Todas as Categorias</option>
            <option value="PORTEIRO">Porteiros</option>
            <option value="SINDICO">Síndicos</option>
            <option value="ZELADOR">Zeladores</option>
            <option value="VIZINHO">Vizinhos</option>
            <option value="AMIGO">Amigos</option>
            <option value="CORRETOR_PARCEIRO">Corretores Parceiros</option>
          </select>
        </div>
      </div>

      {/* TAB 1: PIPELINE / ESTEIRA */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por parceiro, endereço do imóvel, condomínio ou proprietário..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="EM_VALIDACAO">Em Validação</option>
              <option value="AGENDANDO_VISITA">Agendando Visita</option>
              <option value="IMOVEL_CAPTADO">Imóvel Captado</option>
              <option value="EM_NEGOCIACAO">Em Negociação</option>
              <option value="FECHADO_PREMIO_PAGO">Fechado & PIX Pago</option>
            </select>
          </div>

          {/* Referrals Cards Grid */}
          <div className="space-y-3">
            {filteredReferrals.map(ref => (
              <div
                key={ref.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 font-mono">
                      {ref.intentType === 'VENDA' ? 'Venda' : 'Locação'} • {ref.propertyType}
                    </span>
                    {getStatusBadge(ref.status)}
                    <span className="text-xs text-slate-400">
                      Cadastrado em {new Date(ref.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                      {ref.propertyAddress}
                    </h3>
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                      <span>Proprietário: <strong className="text-slate-800">{ref.ownerName}</strong> ({ref.ownerPhone})</span>
                      <span>•</span>
                      <span>Valor Estimado: <strong className="text-slate-800">{ref.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></span>
                    </div>
                  </div>

                  {ref.notes && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{ref.notes}"
                    </p>
                  )}
                </div>

                {/* Right Side: Partner Info & Bounty Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Indicado por:</span>
                    <strong className="text-sm font-bold text-slate-900 block">{ref.partnerName}</strong>
                    <span className="text-xs text-blue-600 font-medium block">
                      {getCategoryLabel(ref.partnerCategory)} {ref.partnerCondoOrArea ? `• ${ref.partnerCondoOrArea}` : ''}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">PIX: {ref.partnerPixKey}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Prêmio PIX</span>
                      <strong className="text-base font-black text-emerald-700">
                        {ref.rewardValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
                    </div>

                    {ref.status !== 'FECHADO_PREMIO_PAGO' ? (
                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={() => handleAdvanceStatus(ref.id)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Avançar status na esteira"
                        >
                          <span>Avançar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowPixPayoutModal(ref)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>Pagar PIX</span>
                        </button>
                      </div>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Liquidado</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RANKING GERAL */}
      {activeTab === 'ranking' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 text-center">Posição</th>
                  <th className="py-3.5 px-4">Indicador / Parceiro</th>
                  <th className="py-3.5 px-4">Categoria & Condomínio</th>
                  <th className="py-3.5 px-4 text-center">Total Indicações</th>
                  <th className="py-3.5 px-4 text-center">Contratos Fechados</th>
                  <th className="py-3.5 px-4 text-right">Pontos</th>
                  <th className="py-3.5 px-4 text-right">Prêmios Recebidos (PIX)</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.map((partner, index) => (
                  <tr key={partner.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-black">
                      <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-300 text-slate-950' : index === 2 ? 'bg-amber-700 text-white' : 'text-slate-500'
                      }`}>
                        {index + 1}º
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {partner.avatarUrl ? (
                          <img src={partner.avatarUrl} alt={partner.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            {partner.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span>{partner.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-700 block">{getCategoryLabel(partner.category)}</span>
                      <span className="text-[11px] text-slate-500">{partner.condoOrBuilding}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {partner.totalReferrals}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      {partner.convertedDeals}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-amber-600">
                      {partner.points} pts
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {partner.totalEarnedRewards.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setShowShareModal(partner)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGRAS E PREMIAÇÕES */}
      {activeTab === 'regras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              Tabela de Premiação Instantânea (Via PIX)
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <strong className="text-amber-900 block font-bold text-sm mb-0.5">Venda de Imóvel</strong>
                <p>Prêmio de <strong>R$ 1.500 a R$ 5.000</strong> direto no PIX do indicador após a assinatura da escritura e liquidação dos honorários.</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <strong className="text-blue-900 block font-bold text-sm mb-0.5">Locação de Imóvel</strong>
                <p>Prêmio equivalente a <strong>40% a 50% do primeiro aluguel líquido</strong> pago ao indicador no momento do primeiro repasse.</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <strong className="text-emerald-900 block font-bold text-sm mb-0.5">Bônus por Captação Exclusiva</strong>
                <p>Caso o proprietário assine contrato de exclusividade de no mínimo 120 dias, o indicador recebe um adiantamento de <strong>R$ 150 no PIX imediato</strong>.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Pontuação & Níveis do Ranking Gamificado
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-slate-900 block font-bold">Indicação de Imóvel Válida</strong>
                  <span className="text-slate-500">Com endereço e contato do proprietário</span>
                </div>
                <span className="font-black text-blue-600 text-sm">+150 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-slate-900 block font-bold">Agendamento de Visita do Corretor</strong>
                  <span className="text-slate-500">Corretor realizou visita e fotos</span>
                </div>
                <span className="font-black text-blue-600 text-sm">+100 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-slate-900 block font-bold">Negócio Fechado (Venda ou Locação)</strong>
                  <span className="text-slate-500">Contrato assinado e liquidado</span>
                </div>
                <span className="font-black text-amber-600 text-sm">+500 pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Indicação */}
      {showNewReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold">Cadastrar Nova Indicação de Imóvel</h2>
              </div>
              <button onClick={() => setShowNewReferralModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Partner Details */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  1. Quem está indicando (Parceiro / Indicador)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome do Indicador *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Porteiro Severino"
                      value={formPartnerName}
                      onChange={(e) => setFormPartnerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Perfil / Categoria *</label>
                    <select
                      value={formPartnerCategory}
                      onChange={(e) => setFormPartnerCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                      <option value="PORTEIRO">Porteiro</option>
                      <option value="SINDICO">Síndico(a)</option>
                      <option value="ZELADOR">Zelador</option>
                      <option value="VIZINHO">Vizinho(a)</option>
                      <option value="AMIGO">Amigo(a)</option>
                      <option value="CORRETOR_PARCEIRO">Corretor Parceiro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp do Indicador *</label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 98765-4321"
                      value={formPartnerPhone}
                      onChange={(e) => setFormPartnerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Chave PIX do Indicador *</label>
                    <input
                      type="text"
                      required
                      placeholder="CPF, celular ou e-mail"
                      value={formPartnerPix}
                      onChange={(e) => setFormPartnerPix(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Condomínio / Edifício de Atuação</label>
                    <input
                      type="text"
                      placeholder="Ex: Condomínio Edifício Mirante das Palmeiras"
                      value={formPartnerCondo}
                      onChange={(e) => setFormPartnerCondo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  2. Imóvel Indicado & Proprietário
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Endereço Completo do Imóvel *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alameda dos Maracatins, 890 - Apto 142 (Moema)"
                      value={formPropertyAddress}
                      onChange={(e) => setFormPropertyAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Finalidade da Indicação *</label>
                    <select
                      value={formIntentType}
                      onChange={(e) => setFormIntentType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden font-bold"
                    >
                      <option value="VENDA">Venda do Imóvel</option>
                      <option value="LOCACAO">Locação do Imóvel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Imóvel</label>
                    <select
                      value={formPropertyType}
                      onChange={(e) => setFormPropertyType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    >
                      <option value="APARTAMENTO">Apartamento</option>
                      <option value="CASA">Casa Residencial</option>
                      <option value="COMERCIAL">Sala / Conjunto Comercial</option>
                      <option value="TERRENO">Terreno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome do Proprietário *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dr. Fernando Guimarães"
                      value={formOwnerName}
                      onChange={(e) => setFormOwnerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp do Proprietário *</label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 99111-2233"
                      value={formOwnerPhone}
                      onChange={(e) => setFormOwnerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Valor Estimado do Imóvel (R$)</label>
                    <input
                      type="number"
                      value={formEstimatedValue}
                      onChange={(e) => setFormEstimatedValue(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Premiação Estimada no Fechamento</label>
                    <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-black text-emerald-700 text-sm">
                      {formIntentType === 'VENDA' ? 'R$ 2.500,00' : '50% do 1º Aluguel'}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Observações do Indicador</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Proprietário colocou placa na janela, quer vender rápido por motivo de mudança..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewReferralModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cadastrar & Pontuar Indicador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Pagar Prêmio PIX */}
      {showPixPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 text-center relative">
            <button 
              type="button"
              onClick={() => setShowPixPayoutModal(null)} 
              className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Fechar"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Wallet className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Confirmar Liquidação de Prêmio PIX
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Bonificação pela indicação do imóvel: <strong>{showPixPayoutModal.propertyAddress}</strong>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Favorecido (Indicador):</span>
                <strong className="text-slate-900">{showPixPayoutModal.partnerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chave PIX:</span>
                <strong className="text-slate-900 font-mono">{showPixPayoutModal.partnerPixKey}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-700">Valor do Prêmio:</span>
                <strong className="text-emerald-700 font-black text-base">
                  {showPixPayoutModal.rewardValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPixPayoutModal(null)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => handleExecutePayout(showPixPayoutModal)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Pagamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Compartilhar Link do Parceiro */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Link Personalizado de Indicação</h3>
              </div>
              <button onClick={() => setShowShareModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Envie este link exclusivo para <strong>{showShareModal.name}</strong>. Todas as indicações feitas por esse link serão creditadas automaticamente a ele no ranking.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono break-all text-blue-700">
              {window.location.origin}/#indique/{showShareModal.name.toLowerCase().replace(/\s+/g, '-')}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/#indique/${showShareModal.name.toLowerCase().replace(/\s+/g, '-')}`;
                  navigator.clipboard.writeText(url);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Olá ${showShareModal.name}! Acesse seu portal de indicações de imóveis e ganhe até R$ 2.500 no PIX por indicação: ${window.location.origin}/#indique/${showShareModal.name.toLowerCase().replace(/\s+/g, '-')}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

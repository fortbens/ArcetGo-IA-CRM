import React, { useState, useMemo } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Phone,
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize2,
  Star,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Monitor,
  Heart,
  Calendar,
  DollarSign,
  ArrowRight,
  User,
  Building,
  Sliders,
  Award,
  Send,
  Eye,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RealEstateProperty, UserProfile, Lead } from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';
import { ImageUploadField } from '../common/ImageUploadField';

interface BrokerSalesLandingPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperties: RealEstateProperty[];
  currentUser?: UserProfile;
  leads?: Lead[];
  onRemoveProperty?: (propertyId: string) => void;
}

export const BrokerSalesLandingPageModal: React.FC<BrokerSalesLandingPageModalProps> = ({
  isOpen,
  onClose,
  selectedProperties,
  currentUser,
  leads = [],
  onRemoveProperty
}) => {
  // Device view mode
  const [deviceMode, setDeviceMode] = useState<'MOBILE' | 'DESKTOP'>('MOBILE');
  
  // Customization state
  const [clientName, setClientName] = useState('');
  const [customHeadline, setCustomHeadline] = useState('Separei essas opções pensando em você');
  const [customMessage, setCustomMessage] = useState(
    'Fiz uma curadoria exclusiva com imóveis que combinam perfeitamente com seu perfil, localização desejada e potencial de valorização. Dê uma olhada nos detalhes abaixo e vamos agendar uma visita!'
  );
  
  // Broker details (defaults to current user or a top broker)
  const defaultBroker = currentUser || CURRENT_USER_PROFILES[3] || CURRENT_USER_PROFILES[0];
  const [brokerName, setBrokerName] = useState(defaultBroker?.name || 'Juliana Mendes');
  const [brokerCreci, setBrokerCreci] = useState(defaultBroker?.creci || '210984-F / SP');
  const [brokerPhone, setBrokerPhone] = useState(defaultBroker?.phone || '(11) 97777-2005');
  const [brokerAvatar, setBrokerAvatar] = useState(
    defaultBroker?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  );
  const [agencyName, setAgencyName] = useState(defaultBroker?.tenantName || 'AcertGo Imóveis (Jardins)');

  // Selected lead to prefill
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');

  // Active image carousel per property
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  
  // Copy state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  // Sync with selected lead
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    if (!leadId) return;
    const found = leads.find(l => l.id === leadId);
    if (found) {
      setClientName(found.name.split(' ')[0]);
    }
  };

  const handleNextPhoto = (propId: string, totalPhotos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) + 1) % totalPhotos
    }));
  };

  const handlePrevPhoto = (propId: string, totalPhotos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) - 1 + totalPhotos) % totalPhotos
    }));
  };

  // Formatted public URL simulation
  const publicShareUrl = useMemo(() => {
    const ids = selectedProperties.map(p => p.code).join('-');
    const safeBroker = encodeURIComponent(brokerName);
    return `https://acertgo.com.br/lp/selecao?corretor=${safeBroker}&creci=${encodeURIComponent(brokerCreci)}&props=${ids}`;
  }, [selectedProperties, brokerName, brokerCreci]);

  // Clean WhatsApp phone number (Brazilian format)
  const cleanPhone = brokerPhone.replace(/\D/g, '');
  const waTargetNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  // WhatsApp formatted text for 1-click send/copy
  const whatsappPitchText = useMemo(() => {
    const greeting = clientName ? `Olá ${clientName}!` : 'Olá!';
    let text = `🏡 *${greeting} ${customHeadline}!* ✨\n\n`;
    text += `${customMessage}\n\n`;
    text += `📍 *Imóveis Selecionados para Você:*\n`;

    selectedProperties.forEach((p, idx) => {
      const priceStr = p.pricing.salePrice 
        ? p.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
        : p.pricing.rentPrice 
        ? `${p.pricing.rentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}/mês`
        : 'Sob Consulta';

      text += `\n*${idx + 1}️⃣ ${p.title}* (${p.code})\n`;
      text += `💰 Valor: *${priceStr}*\n`;
      text += `📐 ${p.specs.usableAreaM2}m² • ${p.specs.bedrooms} quartos (${p.specs.suites} suítes) • ${p.specs.parkingSpaces} vagas\n`;
      text += `📍 ${p.address.neighborhood} - ${p.address.city}/${p.address.state}\n`;
    });

    text += `\n🔗 *Acesse sua mini página de apresentação exclusiva com todas as fotos e detalhes:*\n`;
    text += `${publicShareUrl}\n\n`;
    text += `Fico à sua inteira disposição para tirar qualquer dúvida ou agendarmos uma visita!\n\n`;
    text += `👤 *${brokerName}* | CRECI: ${brokerCreci}\n`;
    text += `🏢 ${agencyName}\n`;
    text += `📲 WhatsApp: ${brokerPhone}`;

    return text;
  }, [clientName, customHeadline, customMessage, selectedProperties, publicShareUrl, brokerName, brokerCreci, agencyName, brokerPhone]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(whatsappPitchText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleOpenDirectWhatsApp = () => {
    const selectedLead = leads.find(l => l.id === selectedLeadId);
    let targetPhone = cleanPhone;
    if (selectedLead && selectedLead.phone) {
      const leadClean = selectedLead.phone.replace(/\D/g, '');
      targetPhone = leadClean.startsWith('55') ? leadClean : `55${leadClean}`;
    }
    const encodedText = encodeURIComponent(whatsappPitchText);
    const waUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  const handleClientPropertyClickWhatsApp = (prop: RealEstateProperty) => {
    const propPrice = prop.pricing.salePrice 
      ? prop.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
      : prop.pricing.rentPrice 
      ? `${prop.pricing.rentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}/mês`
      : 'Sob Consulta';

    const msg = `Olá ${brokerName}! Vi na mini página que você separou para mim o imóvel *${prop.title}* (${prop.code}) no valor de ${propPrice}. Gostaria de mais fotos e informações para agendarmos uma visita!`;
    const waUrl = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleClientGeneralWhatsApp = () => {
    const msg = `Olá ${brokerName}! Acessei a página de imóveis que você separou para mim ("${customHeadline}") e gostaria de conversar!`;
    const waUrl = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Mini Página de Vendas do Corretor
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Landing Page do Cliente
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Página personalizada de alta conversão para encantar o cliente no WhatsApp
              </p>
            </div>
          </div>

          {/* Quick Actions & Device Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Device Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700">
              <button
                onClick={() => setDeviceMode('MOBILE')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === 'MOBILE'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Pré-visualizar como o cliente vê no celular"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile (WhatsApp)</span>
              </button>
              <button
                onClick={() => setDeviceMode('DESKTOP')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === 'DESKTOP'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Pré-visualizar em tela cheia (Desktop)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>

            {/* Toggle Config Drawer */}
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showConfigDrawer 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Personalizar Textos</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area: Config Drawer (optional collapsible) + Landing Page Preview */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-950">
          
          {/* Side Drawer: Corretor & Personalization Settings */}
          {showConfigDrawer && (
            <div className="w-full lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0 text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Personalização da Landing Page
                </h3>
              </div>

              {/* Select Lead */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Vincular ao Lead (Opcional)
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleSelectLead(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Nenhum lead pré-selecionado</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} ({lead.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nome do Cliente (no cabeçalho)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Ricardo ou Dr. Marcelo"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-500"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Chamada Principal (Headline)
                </label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Persuasive Message */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mensagem de Boas-Vindas
                </label>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              {/* Broker Switcher / Customizer */}
              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dados do Corretor (Assinatura)
                </span>
                
                {/* Quick preset selector */}
                <div className="grid grid-cols-2 gap-1.5">
                  {CURRENT_USER_PROFILES.slice(1, 5).map(profile => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => {
                        setBrokerName(profile.name);
                        setBrokerCreci(profile.creci);
                        setBrokerPhone(profile.phone);
                        setBrokerAvatar(profile.avatar);
                      }}
                      className={`text-left p-1.5 rounded-lg border text-[10px] font-semibold truncate transition-all ${
                        brokerName === profile.name 
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' 
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {profile.name.split(' ')[0]} ({profile.creci.split(' ')[0]})
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    value={brokerName}
                    onChange={(e) => setBrokerName(e.target.value)}
                    placeholder="Nome do Corretor"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={brokerCreci}
                    onChange={(e) => setBrokerCreci(e.target.value)}
                    placeholder="CRECI"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={brokerPhone}
                    onChange={(e) => setBrokerPhone(e.target.value)}
                    placeholder="WhatsApp"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Upload or URL for Broker Photo */}
                <div className="pt-1">
                  <ImageUploadField
                    label="Foto do Corretor"
                    value={brokerAvatar}
                    onChange={(val) => setBrokerAvatar(val)}
                    aspect="avatar"
                    helperText="Upload da sua foto ou link de imagem"
                  />
                </div>
              </div>

              {/* Selected properties summary */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Imóveis na Mini Página ({selectedProperties.length})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedProperties.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-slate-800/60 p-1.5 rounded-lg text-xs">
                      <span className="font-mono font-bold text-emerald-400">{p.code}</span>
                      <span className="truncate max-w-[120px] text-slate-300 text-[11px]">{p.title}</span>
                      {onRemoveProperty && selectedProperties.length > 1 && (
                        <button
                          onClick={() => onRemoveProperty(p.id)}
                          className="text-slate-500 hover:text-rose-400 text-xs px-1"
                          title="Remover da seleção"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Preview Container */}
          <div className="flex-1 overflow-y-auto flex justify-center p-3 sm:p-6 bg-radial from-slate-900 to-slate-950">
            <div className={`transition-all duration-300 ${
              deviceMode === 'MOBILE'
                ? 'w-full max-w-[430px] rounded-[44px] border-[10px] border-slate-800 shadow-2xl overflow-hidden bg-white text-slate-900 flex flex-col relative my-auto'
                : 'w-full max-w-4xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-white text-slate-900 flex flex-col'
            }`}>
              
              {/* Mobile Notch Bar if Mobile */}
              {deviceMode === 'MOBILE' && (
                <div className="bg-slate-900 text-slate-300 px-6 py-2 flex items-center justify-between text-[11px] font-bold select-none shrink-0">
                  <span>9:41</span>
                  <div className="w-20 h-4 bg-black rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* LANDING PAGE REAL CONTENT (WHAT THE CLIENT SEES) */}
              {/* ============================================================== */}
              <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
                
                {/* 1. Header / Agency Brand Bar */}
                <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center font-black text-white text-sm shadow-md">
                      A
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm tracking-tight flex items-center gap-1">
                        {agencyName}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Imóveis Selecionados & Verificados
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </div>
                </div>

                {/* 2. Hero Section: "Separei essas opções pensando em você" */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 relative overflow-hidden">
                  {/* Decorative Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Curadoria Imobiliária Exclusiva</span>
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                      {clientName ? `Olá, ${clientName}! ` : ''}
                      <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                        {customHeadline}
                      </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {customMessage}
                    </p>

                    {/* Broker Badge inside Hero */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={brokerAvatar}
                            alt={brokerName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-lg"
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-1">
                            {brokerName}
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <div className="text-xs text-slate-300 flex items-center gap-2">
                            <span>CRECI {brokerCreci}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">Consultor Dedicado</span>
                          </div>
                        </div>
                      </div>

                      {/* Top WhatsApp Hero Button */}
                      <button
                        onClick={handleClientGeneralWhatsApp}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Falar no WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Properties Count Banner */}
                <div className="bg-slate-100 px-4 sm:px-6 py-2.5 flex items-center justify-between border-y border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>{selectedProperties.length} {selectedProperties.length === 1 ? 'Opção Selecionada' : 'Opções Selecionadas com Alta Afinidade'}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Toque no imóvel para ver detalhes e fotos
                  </span>
                </div>

                {/* 4. Property Cards Showcase */}
                <div className="p-4 sm:p-6 space-y-6">
                  {selectedProperties.map((prop, idx) => {
                    const allPhotos = prop.images && prop.images.length > 0 
                      ? prop.images.map(img => img.url) 
                      : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'];
                    const activeIdx = activePhotoIndices[prop.id] || 0;
                    const currentPhoto = allPhotos[activeIdx] || allPhotos[0];

                    const priceFormatted = prop.pricing.salePrice
                      ? prop.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                      : prop.pricing.rentPrice
                      ? `${prop.pricing.rentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}/mês`
                      : 'Sob Consulta';

                    // Estimated mortgage breakdown (approx 20% down, 80% financed)
                    const estimatedDownPayment = prop.pricing.salePrice ? prop.pricing.salePrice * 0.2 : 0;
                    const estimatedInstallment = prop.pricing.salePrice ? (prop.pricing.salePrice * 0.8 * 0.0085) : 0;

                    return (
                      <div
                        key={prop.id}
                        className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                      >
                        {/* Property Media Carousel */}
                        <div className="relative aspect-16/10 sm:aspect-16/9 bg-slate-900 overflow-hidden">
                          <img
                            src={currentPhoto}
                            alt={prop.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-white/95 text-slate-950 font-mono shadow-md backdrop-blur-xs">
                              Opção #{idx + 1} • {prop.code}
                            </span>
                            {prop.isExclusive && (
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                                <Star className="w-3 h-3 fill-slate-950" />
                                Exclusivo
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-600 text-white shadow-md">
                              {prop.transactionType === 'VENDA' ? 'Venda' : prop.transactionType === 'LOCACAO' ? 'Locação' : 'Venda & Locação'}
                            </span>
                          </div>

                          {/* Photo Carousel Navigation (if multiple photos) */}
                          {allPhotos.length > 1 && (
                            <>
                              <button
                                onClick={(e) => handlePrevPhoto(prop.id, allPhotos.length, e)}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleNextPhoto(prop.id, allPhotos.length, e)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                <span>{activeIdx + 1} / {allPhotos.length}</span>
                              </div>
                            </>
                          )}

                          {/* Bottom info over image */}
                          <div className="absolute bottom-3 left-3 right-16 text-white">
                            <div className="flex items-center gap-1 text-xs text-slate-200 font-medium drop-shadow-md">
                              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span className="truncate">{prop.address.neighborhood} • {prop.address.city}/{prop.address.state}</span>
                            </div>
                            <h3 className="font-black text-base sm:text-lg text-white drop-shadow-md line-clamp-1">
                              {prop.title}
                            </h3>
                          </div>
                        </div>

                        {/* Property Body */}
                        <div className="p-4 sm:p-5 space-y-4">
                          
                          {/* Price & Charges */}
                          <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {prop.pricing.salePrice ? 'Valor de Venda' : 'Valor de Locação'}
                              </span>
                              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-emerald-700">
                                {priceFormatted}
                              </div>
                            </div>

                            <div className="text-right text-[11px] text-slate-500 font-medium">
                              {prop.pricing.condoFee && (
                                <div>Condomínio: <strong>{prop.pricing.condoFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
                              )}
                              {prop.pricing.iptuFee && (
                                <div>IPTU: <strong>{prop.pricing.iptuFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês</strong></div>
                              )}
                            </div>
                          </div>

                          {/* Key Specs Bar */}
                          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">ÁREA</span>
                              <span className="text-xs sm:text-sm font-black text-slate-800">{prop.specs.usableAreaM2} m²</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">QUARTOS</span>
                              <span className="text-xs sm:text-sm font-black text-slate-800">{prop.specs.bedrooms} ({prop.specs.suites}s)</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">BANH.</span>
                              <span className="text-xs sm:text-sm font-black text-slate-800">{prop.specs.bathrooms}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">VAGAS</span>
                              <span className="text-xs sm:text-sm font-black text-slate-800">{prop.specs.parkingSpaces}</span>
                            </div>
                          </div>

                          {/* Description Excerpt */}
                          {prop.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {prop.description}
                            </p>
                          )}

                          {/* Features / Highlights Pills */}
                          {prop.features && prop.features.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {prop.features.slice(0, 5).map((feature: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  {feature}
                                </span>
                              ))}
                              {prop.features.length > 5 && (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-500">
                                  +{prop.features.length - 5} itens
                                </span>
                              )}
                            </div>
                          )}

                          {/* Financing Estimation Box (if sale) */}
                          {prop.pricing.salePrice && (
                            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-3 rounded-2xl border border-emerald-100/80 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  Estimativa de Financiamento Caixa/Itaú
                                </span>
                                <div className="text-[11px] text-slate-700 mt-0.5">
                                  Entrada sugerida: <strong>{estimatedDownPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</strong> • Parcela aprox.: <strong>{estimatedInstallment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}/mês</strong>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                                Simulador CCA
                              </span>
                            </div>
                          )}

                          {/* Individual Property CTA Button */}
                          <div className="pt-2">
                            <button
                              onClick={() => handleClientPropertyClickWhatsApp(prop)}
                              className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                            >
                              <MessageCircle className="w-4 h-4 fill-white" />
                              <span>Tenho Interesse na Opção #{idx + 1} ({prop.code})</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 5. Trust / Conversion Arguments */}
                <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-200 space-y-4">
                  <h4 className="font-black text-sm text-slate-900 text-center uppercase tracking-wider">
                    Por que visitar estes imóveis comigo?
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-2">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-slate-900">Documentação 100% OK</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Certidões e matrícula checadas pela nossa assessoria jurídica</div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-slate-900">Negociação Direta</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Contato alinhado direto com os proprietários para melhor proposta</div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-2">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-slate-900">Visita no Seu Horário</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Agendamento rápido em dias úteis ou finais de semana</div>
                    </div>
                  </div>
                </div>

                {/* 6. Realtor Bio Footer */}
                <div className="p-5 sm:p-6 bg-slate-900 text-white text-center space-y-3">
                  <img
                    src={brokerAvatar}
                    alt={brokerName}
                    className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-emerald-500/40 shadow-xl"
                  />
                  <div>
                    <h3 className="font-black text-base text-white">{brokerName}</h3>
                    <p className="text-xs text-slate-400">CRECI {brokerCreci} • {agencyName}</p>
                    <p className="text-xs text-emerald-400 font-semibold mt-1">
                      {brokerPhone}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                    "Estou à disposição para responder qualquer dúvida ou agendar uma visita guiada sem compromisso."
                  </p>
                </div>
              </div>

              {/* Sticky WhatsApp Floating Bottom Bar for the Client */}
              <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xl z-20">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="relative shrink-0">
                    <img
                      src={brokerAvatar}
                      alt={brokerName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border border-white" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">Gostou das opções?</div>
                    <div className="text-[10px] text-slate-500 truncate">Fale comigo no WhatsApp</div>
                  </div>
                </div>

                <button
                  onClick={handleClientGeneralWhatsApp}
                  className="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 shrink-0 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chamar no WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Toolbar: Broker Actions (Copy link, Copy WhatsApp text, Send directly) */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap shrink-0">
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-white">🔗 Link Pronto:</span>
            <span className="font-mono text-[11px] bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-slate-300 max-w-[220px] sm:max-w-xs truncate">
              {publicShareUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                copiedLink 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Copiar link público da página"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            {/* Copy Formatted WhatsApp Text */}
            <button
              onClick={handleCopyWhatsAppText}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                copiedText 
                  ? 'bg-teal-600 text-white border-teal-500 shadow-md' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Copiar texto persuasivo com emojis e links para colar no WhatsApp"
            >
              {copiedText ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Texto Copiado!' : 'Copiar Texto Pronto WhatsApp'}</span>
            </button>

            {/* Direct Open WhatsApp */}
            <button
              onClick={handleOpenDirectWhatsApp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar via WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  Filter, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Share2, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  SlidersHorizontal, 
  Globe, 
  Clock, 
  X,
  ExternalLink,
  MessageCircle,
  Eye,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { RealEstateProperty, Lead, WebsiteConfig } from '../../types/crm';
import { TenantAgency } from '../../types/superAdmin';

interface WebsiteStandalonePageViewProps {
  properties: RealEstateProperty[];
  websiteConfig: WebsiteConfig;
  currentTenant?: TenantAgency | null;
  onNewLead?: (leadData: { name: string; phone: string; email: string; interest: string; propertyId?: string }) => void;
  onReturnToCrm?: () => void;
}

export const getPropertyPrice = (p: RealEstateProperty): number => {
  return p.pricing?.salePrice || p.pricing?.rentPrice || 0;
};

export const getPropertyImageUrl = (img: any): string => {
  if (!img) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80';
  if (typeof img === 'string') return img;
  return img.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80';
};

export const WebsiteStandalonePageView: React.FC<WebsiteStandalonePageViewProps> = ({
  properties,
  websiteConfig,
  currentTenant,
  onNewLead,
  onReturnToCrm
}) => {
  const [activeTab, setActiveTab] = useState<'TODOS' | 'VENDA' | 'LOCACAO' | 'LANCAMENTO'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('TODOS');
  const [selectedType, setSelectedType] = useState('TODOS');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedProperty, setSelectedProperty] = useState<RealEstateProperty | null>(null);

  // Lead inquiry form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  const agencyName = currentTenant?.tradeName || websiteConfig.siteName || 'AcertGo Imóveis';
  const logoUrl = websiteConfig.logoUrl || currentTenant?.logoUrl || '';
  const phone = websiteConfig.phone || currentTenant?.ownerPhone || '(11) 3045-8000';
  const whatsapp = websiteConfig.whatsapp || currentTenant?.ownerPhone || '(11) 98844-3322';
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');
  const primaryColor = websiteConfig.primaryColor || '#0284c7';

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Transaction type
      if (activeTab === 'VENDA' && p.transactionType !== 'VENDA' && p.transactionType !== 'VENDA_LOCACAO') return false;
      if (activeTab === 'LOCACAO' && p.transactionType !== 'LOCACAO' && p.transactionType !== 'VENDA_LOCACAO') return false;
      if (activeTab === 'LANCAMENTO' && !p.isExclusive) return false;

      // City filter
      if (selectedCity !== 'TODOS' && p.address?.city !== selectedCity) return false;

      // Type filter
      if (selectedType !== 'TODOS' && p.propertyType !== selectedType) return false;

      // Price filter
      const pPrice = getPropertyPrice(p);
      if (maxPrice !== '' && pPrice > Number(maxPrice)) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesNeighborhood = p.address?.neighborhood?.toLowerCase().includes(query);
        const matchesCity = p.address?.city?.toLowerCase().includes(query);
        const matchesCode = p.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNeighborhood && !matchesCity && !matchesCode) return false;
      }

      return true;
    });
  }, [properties, activeTab, selectedCity, selectedType, maxPrice, searchTerm]);

  // Unique cities and types for filters
  const cities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.address?.city) set.add(p.address.city);
    });
    return Array.from(set);
  }, [properties]);

  const propertyTypes = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.propertyType) set.add(p.propertyType);
    });
    return Array.from(set);
  }, [properties]);

  const handleSendLeadInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;

    if (onNewLead) {
      onNewLead({
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim() || 'cliente@site.com.br',
        interest: leadMessage.trim() || `Interesse no imóvel: ${selectedProperty?.title || 'Imóveis do site'}`,
        propertyId: selectedProperty?.id
      });
    }

    setLeadSuccess(true);
    setTimeout(() => {
      setLeadSuccess(false);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
      setLeadMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none">
      {/* Top Admin Return Bar (Discreet for logged-in administrators) */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">Site Oficial Ativo</span>
          <span className="text-slate-400 hidden sm:inline">• Apontamento Direto ao Estoque do CRM</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 hidden md:inline">
            Domínio: <strong className="text-slate-200">{websiteConfig.customDomain || 'imoveis.acertgo.com.br'}</strong>
          </span>
          {onReturnToCrm ? (
            <button
              onClick={onReturnToCrm}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Voltar ao CRM</span>
            </button>
          ) : (
            <button
              onClick={() => window.close()}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
            >
              <X className="w-3 h-3" />
              <span>Fechar Aba</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Website Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Agency Name */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={agencyName} 
                className="h-10 sm:h-12 max-w-[200px] object-contain"
              />
            ) : (
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                {agencyName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                {agencyName}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {websiteConfig.slogan || 'Imóveis Selecionados & Atendimento Exclusivo'}
              </p>
            </div>
          </div>

          {/* Contact Fast Shortcuts */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex flex-col text-right text-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Plantão de Atendimento</span>
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="font-extrabold text-slate-900 hover:text-blue-600 transition-colors">
                {phone}
              </a>
            </div>

            <a
              href={`https://wa.me/55${cleanWhatsapp}?text=Ol%C3%A1!%20Acessei%20o%20site%20da%20imobili%C3%A1ria%20e%20gostaria%20de%20atendimento.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp de Plantão</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <div 
        className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner"
      >
        <div className="max-w-5xl mx-auto relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Encontre o imóvel perfeito para comprar ou alugar</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Os Melhores Imóveis com a Garantia {agencyName}
          </h2>

          {/* Transaction Tabs */}
          <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            {(['TODOS', 'VENDA', 'LOCACAO', 'LANCAMENTO'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-white text-slate-900 shadow-md scale-102' 
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'TODOS' ? 'Todos os Imóveis' : tab === 'VENDA' ? 'Venda' : tab === 'LOCACAO' ? 'Locação' : 'Lançamentos'}
              </button>
            ))}
          </div>

          {/* Filter Bar Box */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-2xl text-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Buscar por bairro, condomínio ou código
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ex: Jardins, Moema, ACG-8942..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Cidade
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                <option value="TODOS">Todas as Cidades</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Tipo de Imóvel
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                <option value="TODOS">Todos os Tipos</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Valor Máximo
              </label>
              <input
                type="number"
                placeholder="R$ Sem limite"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Property Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Catálogo de Imóveis Disponíveis
            </h3>
            <p className="text-xs text-slate-500">
              Exibindo <strong>{filteredProperties.length}</strong> imóveis encontrados
            </p>
          </div>

          {(searchTerm || selectedCity !== 'TODOS' || selectedType !== 'TODOS' || maxPrice !== '') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('TODOS');
                setSelectedType('TODOS');
                setMaxPrice('');
              }}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => setSelectedProperty(property)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Photo Area */}
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img
                  src={getPropertyImageUrl(property.images?.[0])}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                    {property.transactionType === 'VENDA' ? 'Venda' : property.transactionType === 'LOCACAO' ? 'Locação' : 'Venda ou Locação'}
                  </span>
                  {property.isExclusive && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                      Exclusividade
                    </span>
                  )}
                </div>

                {/* Property Code */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white">
                  {property.code || property.id}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {property.address?.neighborhood}, {property.address?.city} - {property.address?.state}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h4>

                  {/* Highlights Features */}
                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    {(property.specs?.bedrooms ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{property.specs?.bedrooms}</strong> qts
                      </span>
                    )}
                    {(property.specs?.bathrooms ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{property.specs?.bathrooms}</strong> banh
                      </span>
                    )}
                    {(property.specs?.parkingSpaces ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{property.specs?.parkingSpaces}</strong> vg
                      </span>
                    )}
                    {(property.specs?.usableAreaM2 || property.specs?.totalAreaM2) ? (
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{property.specs?.usableAreaM2 || property.specs?.totalAreaM2}</strong> m²
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Valor de Oferta</span>
                    <strong className="text-lg font-black text-slate-900 font-mono">
                      R$ {getPropertyPrice(property).toLocaleString('pt-BR')}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                    }}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>Ver Ficha</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">Nenhum imóvel encontrado com estes filtros</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tente redefinir o valor máximo ou a cidade para visualizar os outros imóveis cadastrados na imobiliária.
            </p>
          </div>
        )}
      </main>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white">
                    {selectedProperty.transactionType}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Cód: {selectedProperty.id}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white truncate">
                  {selectedProperty.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedProperty.address?.street}, {selectedProperty.address?.neighborhood} - {selectedProperty.address?.city}
                </p>
              </div>

              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Photo Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
                <img
                  src={getPropertyImageUrl(selectedProperty.images?.[0])}
                  alt={selectedProperty.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="grid grid-cols-2 gap-2">
                  {(selectedProperty.images?.slice(1, 5) || []).map((img, idx) => (
                    <img
                      key={idx}
                      src={getPropertyImageUrl(img)}
                      alt={`Foto ${idx + 2}`}
                      className="w-full h-31 object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* Price & Features Bar */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block">Valor do Imóvel</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    R$ {getPropertyPrice(selectedProperty).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-700">
                  {(selectedProperty.specs?.bedrooms ?? 0) > 0 && (
                    <span className="flex items-center gap-1.5 font-bold">
                      <Bed className="w-4 h-4 text-blue-600" />
                      {selectedProperty.specs?.bedrooms} Quartos
                    </span>
                  )}
                  {(selectedProperty.specs?.bathrooms ?? 0) > 0 && (
                    <span className="flex items-center gap-1.5 font-bold">
                      <Bath className="w-4 h-4 text-blue-600" />
                      {selectedProperty.specs?.bathrooms} Banheiros
                    </span>
                  )}
                  {(selectedProperty.specs?.parkingSpaces ?? 0) > 0 && (
                    <span className="flex items-center gap-1.5 font-bold">
                      <Car className="w-4 h-4 text-blue-600" />
                      {selectedProperty.specs?.parkingSpaces} Vagas
                    </span>
                  )}
                  {(selectedProperty.specs?.usableAreaM2 || selectedProperty.specs?.totalAreaM2) ? (
                    <span className="flex items-center gap-1.5 font-bold">
                      <Maximize className="w-4 h-4 text-blue-600" />
                      {selectedProperty.specs?.usableAreaM2 || selectedProperty.specs?.totalAreaM2} m²
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Descrição Completa do Imóvel
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedProperty.description || 'Excelente imóvel em localização privilegiada, acabamentos de primeira linha e infraestrutura completa. Agende sua visita com a nossa equipe especializada.'}
                </p>
              </div>

              {/* Direct Inquiry Form */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    Tenho Interesse neste Imóvel (Receba Atendimento Imediato)
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    SLA &lt; 5 min
                  </span>
                </div>

                {leadSuccess ? (
                  <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Mensagem recebida com sucesso! Um corretor de plantão já foi notificado e entrará em contato.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendLeadInquiry} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Seu Nome Completo *"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp com DDD *"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Quero Mais Informações</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500">
                Atendimento Oficial: <strong>{agencyName}</strong>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/55${cleanWhatsapp}?text=Ol%C3%A1!%20Tenho%20interesse%20no%20im%C3%B3vel%20c%C3%B3digo%20${selectedProperty.id}%20(${encodeURIComponent(selectedProperty.title)}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Falar no WhatsApp sobre este Imóvel</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Website Footer */}
      <footer className="bg-slate-900 text-white pt-10 pb-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-2">
            <h5 className="font-bold text-white text-sm">{agencyName}</h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {websiteConfig.slogan || 'Assessoria imobiliária especializada em compra, venda, locação e lançamentos com segurança jurídica e atendimento personalizado.'}
            </p>
            <p className="text-slate-400 text-[11px] font-mono">
              CRECI: {currentTenant?.creciJ || '34982-J'}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white text-sm">Contatos & Plantão</h5>
            <p className="text-slate-400">Telefone: {phone}</p>
            <p className="text-slate-400">WhatsApp: {whatsapp}</p>
            <p className="text-slate-400">E-mail: {currentTenant?.ownerEmail || 'contato@acertgo.com.br'}</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white text-sm">Localização</h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {currentTenant?.address || 'Av. Brigadeiro Faria Lima, 2601 - Itaim Bibi'}
            </p>
            <p className="text-slate-400 text-[11px]">
              {currentTenant?.city || 'São Paulo'} - {currentTenant?.state || 'SP'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {agencyName}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Site Imobiliário Oficial & Plataforma AcertGo</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Phone, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Check, 
  Filter, 
  Sparkles,
  ArrowRight,
  Calculator,
  Compass,
  Award,
  Users,
  ChevronRight,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Play,
  Video,
  Gift,
  Map,
  CheckCircle2,
  Mail,
  FileText,
  Calendar,
  X
} from 'lucide-react';
import { RealEstateProperty, WebsiteConfig, WebsiteTemplateId } from '../../types/crm';
import { WEBSITE_TEMPLATE_OPTIONS } from '../../data/mockPortals';
import { KenkoSearchBar, KenkoFilterState } from './KenkoSearchBar';
import { FeaturedPropertiesCarousel } from './FeaturedPropertiesCarousel';
import { WebsiteHeroBannersSlider, DEFAULT_HERO_BANNERS } from './WebsiteHeroBannersSlider';
import { KenkoSearchStyle, WebsiteHeroBanner } from '../../types/websiteSeo';

interface WebsiteTemplatePreviewProps {
  properties: RealEstateProperty[];
  config: WebsiteConfig;
  selectedTemplateId: WebsiteTemplateId;
  onSelectProperty?: (property: RealEstateProperty) => void;
  onLeadSubmitted?: (leadData: { name: string; phone: string; email: string; interest: string }) => void;
  onOpenCustomerPortal?: () => void;
  onOpenIndiqueGanhe?: () => void;
  kenkoSearchStyle?: KenkoSearchStyle;
  heroBanners?: WebsiteHeroBanner[];
  showCarousel?: boolean;
}

export const WebsiteTemplatePreview: React.FC<WebsiteTemplatePreviewProps> = ({
  properties,
  config,
  selectedTemplateId,
  onSelectProperty,
  onLeadSubmitted,
  onOpenCustomerPortal,
  onOpenIndiqueGanhe,
  kenkoSearchStyle = 'KENKO_HERO_BOX',
  heroBanners = DEFAULT_HERO_BANNERS,
  showCarousel = true,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [kenkoFilters, setKenkoFilters] = useState<KenkoFilterState>({
    transaction: 'TODOS',
    query: '',
    propertyType: 'TODOS',
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    selectedAmenities: [],
    selectedQuickTag: null
  });

  // Interactive CMS state
  const [selectedMapProperty, setSelectedMapProperty] = useState<RealEstateProperty | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showClientAreaModal, setShowClientAreaModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Lead modal or inquiry success
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Mortgage Calculator state
  const [calcPropertyPrice, setCalcPropertyPrice] = useState(1200000);
  const [calcEntryPercent, setCalcEntryPercent] = useState(20);
  const [calcYears, setCalcYears] = useState(30);

  const templateOption = WEBSITE_TEMPLATE_OPTIONS.find(t => t.id === selectedTemplateId) || WEBSITE_TEMPLATE_OPTIONS[0];

  const filteredProperties = properties.filter(p => {
    // Transaction filter
    if (kenkoFilters.transaction === 'VENDA' && p.transactionType !== 'VENDA' && p.transactionType !== 'VENDA_LOCACAO') return false;
    if (kenkoFilters.transaction === 'LOCACAO' && p.transactionType !== 'LOCACAO' && p.transactionType !== 'VENDA_LOCACAO') return false;
    if (kenkoFilters.transaction === 'LANCAMENTO' && !p.isExclusive && p.canalProListingType !== 'SUPER_DESTAQUE') return false;

    // Search query (title, neighborhood, city, code)
    if (kenkoFilters.query) {
      const q = kenkoFilters.query.toLowerCase();
      const match = 
        p.title.toLowerCase().includes(q) ||
        p.address.neighborhood.toLowerCase().includes(q) ||
        p.address.city.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Property type
    if (kenkoFilters.propertyType !== 'TODOS' && p.propertyType !== kenkoFilters.propertyType) {
      return false;
    }

    // Bedrooms
    if (kenkoFilters.bedrooms !== null && p.specs.bedrooms < kenkoFilters.bedrooms) {
      return false;
    }

    // Bathrooms
    if (kenkoFilters.bathrooms !== null && p.specs.bathrooms < kenkoFilters.bathrooms) {
      return false;
    }

    // Parking spaces
    if (kenkoFilters.parkingSpaces !== null && p.specs.parkingSpaces < kenkoFilters.parkingSpaces) {
      return false;
    }

    // Min / Max Price
    const effectivePrice = p.pricing.salePrice || p.pricing.rentPrice || 0;
    if (kenkoFilters.minPrice !== null && effectivePrice < kenkoFilters.minPrice) return false;
    if (kenkoFilters.maxPrice !== null && effectivePrice > kenkoFilters.maxPrice) return false;

    // Min / Max Area
    if (kenkoFilters.minArea !== null && p.specs.usableAreaM2 < kenkoFilters.minArea) return false;
    if (kenkoFilters.maxArea !== null && p.specs.usableAreaM2 > kenkoFilters.maxArea) return false;

    // Amenities
    if (kenkoFilters.selectedAmenities.length > 0) {
      const hasAll = kenkoFilters.selectedAmenities.every(amenity => 
        p.features.some(f => f.toLowerCase().includes(amenity.toLowerCase()))
      );
      if (!hasAll) return false;
    }

    // Quick tag
    if (kenkoFilters.selectedQuickTag) {
      const tag = kenkoFilters.selectedQuickTag.toLowerCase();
      if (tag.includes('pronto') && !p.features.some(f => f.toLowerCase().includes('pronto'))) return false;
      if (tag.includes('mobiliado') && p.specs.furnishing !== 'MOBILIADO') return false;
      if (tag.includes('alto padrão') && effectivePrice < 1500000) return false;
    }

    return true;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    if (onLeadSubmitted) {
      onLeadSubmitted({
        name: inquiryName,
        phone: inquiryPhone,
        email: `${inquiryName.toLowerCase().replace(/\s+/g, '.')}@cliente.com`,
        interest: `Interesse enviado através do site da imobiliária (${templateOption.name})`
      });
    }

    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryName('');
      setInquiryPhone('');
    }, 3000);
  };

  // Financing calculation estimate
  const loanAmount = calcPropertyPrice * (1 - calcEntryPercent / 100);
  const monthlyRate = 0.0085; // approx 10.5% a.a.
  const months = calcYears * 12;
  const estimatedInstallment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  return (
    <div className="space-y-4">
      {/* Device View Selector Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-slate-200">
            Pré-visualização do Site Oficial ({templateOption.name})
          </span>
          <span className="text-slate-400 font-mono hidden sm:inline">
            • {config.customDomain || config.subdomain}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-md transition-colors ${deviceView === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Desktop / Monitor"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-1.5 rounded-md transition-colors ${deviceView === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Tablet (iPad)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-md transition-colors ${deviceView === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Smartphone"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center bg-slate-950/20 p-2 sm:p-4 rounded-2xl border border-slate-200 overflow-x-auto min-h-[700px]">
        <div 
          className={`bg-white rounded-2xl shadow-2xl border border-slate-300 transition-all duration-300 overflow-y-auto max-h-[85vh] ${
            deviceView === 'desktop' 
              ? 'w-full' 
              : deviceView === 'tablet' 
              ? 'w-[768px]' 
              : 'w-[375px]'
          }`}
        >
          {/* ============================================================== */}
          {/* TEMPLATE 1: EXCLUSIVE HIGH-END (BOUTIQUE ALTO PADRÃO) */}
          {/* ============================================================== */}
          {selectedTemplateId === 'EXCLUSIVE_HIGH_END' && (
            <div className="bg-[#0B0F19] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-black">
              {/* Header VIP */}
              <header className="border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0B0F19]/90 backdrop-blur-md z-20">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center text-black font-serif font-black text-lg">
                    A
                  </div>
                  <div>
                    <span className="text-base font-serif font-bold tracking-widest text-[#F8FAFC] uppercase block leading-none">
                      {config.siteName}
                    </span>
                    <span className="text-[10px] tracking-wider text-[#D4AF37] uppercase font-mono">
                      Exclusive Real Estate • CRECI {config.creci}
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 tracking-wider uppercase font-medium">
                  <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Mansões</span>
                  <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Coberturas</span>
                  <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Private Collection</span>
                  <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Sobre Nós</span>
                </div>

                <a
                  href={`https://wa.me/55${config.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-black font-semibold text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Concierge VIP</span>
                </a>
              </header>

              {/* Hero Cinematográfico & Banners Slider */}
              <div className="relative pt-6 pb-12 px-4 sm:px-8 bg-gradient-to-b from-slate-900 to-[#0B0F19] border-b border-slate-800 text-center">
                <div className="max-w-6xl mx-auto space-y-6">
                  <WebsiteHeroBannersSlider banners={heroBanners} accentColor="#D4AF37" />

                  {/* Kenko Search Bar */}
                  <div className="-mt-8 relative z-20">
                    <KenkoSearchBar
                      style={kenkoSearchStyle}
                      totalResultsCount={filteredProperties.length}
                      onFilterChange={setKenkoFilters}
                      accentColor="#D4AF37"
                      isDarkTheme={true}
                    />
                  </div>
                </div>
              </div>

              {/* Carrossel de Destaques */}
              {showCarousel && (
                <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
                  <FeaturedPropertiesCarousel
                    properties={properties}
                    accentColor="#D4AF37"
                    isDarkTheme={true}
                    onSelectProperty={onSelectProperty}
                  />
                </div>
              )}

              {/* Grid de Imóveis Alto Padrão */}
              <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                      Acervo Selecionado
                    </h2>
                    <p className="text-xs text-slate-400">
                      {filteredProperties.length} propriedades singulares disponíveis
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => onSelectProperty && onSelectProperty(property)}
                      className="bg-[#131B2E] border border-slate-800 hover:border-[#D4AF37]/60 rounded-2xl overflow-hidden transition-all group cursor-pointer shadow-lg hover:shadow-2xl"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                        <img
                          src={property.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-xs">
                            {property.transactionType}
                          </span>
                          {property.featured && (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-black">
                              Destaque
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{property.address.neighborhood}, {property.address.city}</span>
                        </div>

                        <h3 className="text-sm font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                          {property.title}
                        </h3>

                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Maximize2 className="w-3 h-3 text-slate-500" />
                            {property.specs.usableAreaM2} m²
                          </span>
                          <span className="flex items-center gap-1">
                            <Bed className="w-3 h-3 text-slate-500" />
                            {property.specs.bedrooms} Qts ({property.specs.suites} Stes)
                          </span>
                          <span className="flex items-center gap-1">
                            <Car className="w-3 h-3 text-slate-500" />
                            {property.specs.parkingSpaces} Vagas
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Investimento</span>
                            <span className="text-sm sm:text-base font-bold text-white font-mono">
                              R$ {(property.pricing.salePrice || property.pricing.rentPrice || 0).toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <button 
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#D4AF37] hover:text-black text-xs font-semibold text-slate-200 transition-colors"
                          >
                            Agendar Visita
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TEMPLATE 2: URBAN FLOW (MODERNO & LANÇAMENTOS) */}
          {/* ============================================================== */}
          {selectedTemplateId === 'URBAN_FLOW' && (
            <div className="bg-slate-50 text-slate-900 font-sans">
              {/* Header Modern Urban */}
              <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    A
                  </div>
                  <div>
                    <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                      {config.siteName}
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium block">
                      CRECI {config.creci} • Lançamentos & Vendas
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span className="text-blue-600">Lançamentos</span>
                  <span className="hover:text-blue-600 cursor-pointer">Prontos para Morar</span>
                  <span className="hover:text-blue-600 cursor-pointer">Simulador Caixa</span>
                </div>

                <a
                  href={`tel:${config.phone.replace(/\D/g, '')}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Plantão:</span> {config.phone}
                </a>
              </header>

              {/* Hero & Banners Slider */}
              <div className="pt-6 pb-8 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
                <WebsiteHeroBannersSlider banners={heroBanners} accentColor="#2563EB" />

                {/* Kenko Search Bar */}
                <div className="-mt-8 relative z-20">
                  <KenkoSearchBar
                    style={kenkoSearchStyle}
                    totalResultsCount={filteredProperties.length}
                    onFilterChange={setKenkoFilters}
                    accentColor="#2563EB"
                    isDarkTheme={false}
                  />
                </div>
              </div>

              {/* Carrossel de Destaques */}
              {showCarousel && (
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                  <FeaturedPropertiesCarousel
                    properties={properties}
                    accentColor="#2563EB"
                    isDarkTheme={false}
                    onSelectProperty={onSelectProperty}
                  />
                </div>
              )}

              {/* Cards Grid */}
              <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Oportunidades em Destaque
                    </h2>
                    <p className="text-xs text-slate-500">
                      Unidades avaliadas e prontas para negociação
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => onSelectProperty && onSelectProperty(property)}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                        <img
                          src={property.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                          {property.propertyType}
                        </span>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{property.address.neighborhood}</span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {property.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                          <span>{property.specs.usableAreaM2} m²</span>
                          <span>•</span>
                          <span>{property.specs.bedrooms} dorms</span>
                          <span>•</span>
                          <span>{property.specs.parkingSpaces} vagas</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Preço</span>
                            <span className="text-base font-bold text-blue-700 font-mono">
                              R$ {(property.pricing.salePrice || property.pricing.rentPrice || 0).toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <button className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all">
                            Ver Imóvel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulador de Financiamento Embutido */}
                {config.showFinancingSimulator && (
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-bold">
                        Simulador de Financiamento Bancário (Caixa / Itaú / Bradesco)
                      </h3>
                    </div>
                    <p className="text-xs text-blue-200">
                      Calcule a estimativa da parcela do seu financiamento imobiliário em segundos
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">
                          Valor do Imóvel: R$ {calcPropertyPrice.toLocaleString('pt-BR')}
                        </label>
                        <input
                          type="range"
                          min={200000}
                          max={3000000}
                          step={50000}
                          value={calcPropertyPrice}
                          onChange={(e) => setCalcPropertyPrice(Number(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-blue-200 mb-1">
                          Entrada: {calcEntryPercent}% (R$ {(calcPropertyPrice * calcEntryPercent / 100).toLocaleString('pt-BR')})
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={50}
                          step={5}
                          value={calcEntryPercent}
                          onChange={(e) => setCalcEntryPercent(Number(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
                        <span className="text-[10px] text-cyan-300 uppercase font-bold block">
                          Parcela Estimada (30 anos)
                        </span>
                        <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                          R$ {Math.round(estimatedInstallment).toLocaleString('pt-BR')}<span className="text-xs font-normal">/mês</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TEMPLATE 3: FAST RENT (LOCAÇÃO SEM FIADOR ESTILO QUINTOANDAR) */}
          {/* ============================================================== */}
          {selectedTemplateId === 'FAST_RENT' && (
            <div className="bg-white text-slate-900 font-sans">
              <header className="border-b border-emerald-100 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-base font-extrabold tracking-tight text-slate-900">
                      {config.siteName}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Aluguel Sem Fiador • Análise em 15min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                    Proprietário: Anunciar Imóvel
                  </button>
                </div>
              </header>

              {/* Hero Rápido & Banners */}
              <div className="pt-6 pb-8 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
                <WebsiteHeroBannersSlider banners={heroBanners} accentColor="#059669" />

                {/* Kenko Search Bar */}
                <div className="-mt-8 relative z-20">
                  <KenkoSearchBar
                    style={kenkoSearchStyle}
                    totalResultsCount={filteredProperties.length}
                    onFilterChange={setKenkoFilters}
                    accentColor="#059669"
                    isDarkTheme={false}
                  />
                </div>
              </div>

              {/* Carrossel de Destaques */}
              {showCarousel && (
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                  <FeaturedPropertiesCarousel
                    properties={properties}
                    accentColor="#059669"
                    isDarkTheme={false}
                    onSelectProperty={onSelectProperty}
                  />
                </div>
              )}

              {/* Feed com tags de locação ágil */}
              <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => onSelectProperty && onSelectProperty(property)}
                      className="rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer bg-white"
                    >
                      <div className="relative aspect-16/10 bg-slate-100">
                        <img
                          src={property.images[0]?.url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Aluguel sem fiador
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {property.title}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{property.address.neighborhood}, {property.address.city}</span>
                        </div>

                        <div className="text-xs text-slate-600 flex gap-2 pt-1 font-medium">
                          <span>{property.specs.usableAreaM2}m²</span>
                          <span>•</span>
                          <span>{property.specs.bedrooms} quartos</span>
                          <span>•</span>
                          <span>{property.specs.parkingSpaces} vaga</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400">Total Mensal</span>
                            <span className="text-base font-extrabold text-emerald-700 block font-mono">
                              R$ {(property.pricing.rentPrice || 3500).toLocaleString('pt-BR')}/mês
                            </span>
                          </div>

                          <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
                            Visitar Online
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TEMPLATE 4: HERITAGE & TRUST (TRADIÇÃO FAMILIAR & BAIRROS) */}
          {/* ============================================================== */}
          {selectedTemplateId === 'HERITAGE_TRUST' && (
            <div className="bg-[#FDFBF7] text-[#1C1917] font-serif">
              <header className="border-b border-[#E7E5E4] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-xs z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#0F766E] flex items-center justify-center text-[#0F766E] font-bold text-lg">
                    ⚜
                  </div>
                  <div>
                    <span className="text-lg font-bold tracking-tight text-[#1C1917] font-serif">
                      {config.siteName}
                    </span>
                    <span className="text-[10px] text-[#0F766E] font-sans font-bold block">
                      Desde 1998 • Mais de 3.500 Famílias Atendidas
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-sans">
                  <span className="hidden sm:inline font-bold text-slate-700">CRECI Jurídico: {config.creci}</span>
                  <a
                    href={`https://wa.me/55${config.whatsapp.replace(/\D/g, '')}`}
                    className="px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d645e] text-white font-bold transition-all shadow-xs"
                  >
                    Falar com um Diretor
                  </a>
                </div>
              </header>

              {/* Hero Tradicional & Banners */}
              <div className="pt-6 pb-8 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
                <WebsiteHeroBannersSlider banners={heroBanners} accentColor="#0F766E" />

                {/* Kenko Search Bar */}
                <div className="-mt-8 relative z-20">
                  <KenkoSearchBar
                    style={kenkoSearchStyle}
                    totalResultsCount={filteredProperties.length}
                    onFilterChange={setKenkoFilters}
                    accentColor="#0F766E"
                    isDarkTheme={false}
                  />
                </div>
              </div>

              {/* Carrossel de Destaques */}
              {showCarousel && (
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                  <FeaturedPropertiesCarousel
                    properties={properties}
                    accentColor="#0F766E"
                    isDarkTheme={false}
                    onSelectProperty={onSelectProperty}
                  />
                </div>
              )}

              {/* Grid Tradicional */}
              <div className="p-4 sm:p-8 max-w-6xl mx-auto font-sans space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => onSelectProperty && onSelectProperty(property)}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="relative aspect-16/10 bg-stone-100">
                        <img
                          src={property.images[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                          {property.address.neighborhood}
                        </div>

                        <h3 className="text-sm font-bold font-serif text-slate-900 line-clamp-1">
                          {property.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{property.specs.bedrooms} dorms ({property.specs.suites} suíte)</span>
                          <span>•</span>
                          <span>{property.specs.usableAreaM2}m²</span>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-base font-bold text-stone-900 font-mono">
                            R$ {(property.pricing.salePrice || property.pricing.rentPrice || 0).toLocaleString('pt-BR')}
                          </span>

                          <button className="px-3 py-1.5 bg-[#0F766E] text-white rounded-lg text-xs font-bold hover:bg-[#0d645e] transition-colors">
                            Ver Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Captura de Lead com Avaliação Gratuita */}
                <div className="bg-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-200 text-center space-y-3">
                  <h3 className="text-lg font-bold font-serif text-stone-900">
                    Quer Vender ou Avaliar seu Imóvel com a Gente?
                  </h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto">
                    Nossos peritos avaliadores credenciados pelo CNAI realizam uma avaliação técnica precisa sem custo para o proprietário.
                  </p>

                  <form onSubmit={handleInquirySubmit} className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto pt-2">
                    <input
                      type="text"
                      required
                      placeholder="Seu nome completo"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F766E] outline-hidden"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp (DDD + Número)"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F766E] outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0F766E] hover:bg-[#0d645e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      {inquirySuccess ? 'Enviado!' : 'Solicitar Avaliação'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SEÇÕES ADICIONAIS DO CMS COMPLETO INTEGRADO NO SITE */}
          {/* ============================================================== */}

          {/* 1. MAPA INTERATIVO DOS IMÓVEIS (OPÇÃO EXIBIR NO MAPA) */}
          <div className="py-10 px-4 sm:px-8 bg-slate-900 text-white border-t border-slate-800">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                      <Map className="w-4 h-4" />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Mapa Interativo de Imóveis
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Explore a localização dos imóveis com anúncio geolocalizado habilitado
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                    {properties.filter(p => p.displayOnMap !== false).length} imóveis no mapa
                  </span>
                </div>
              </div>

              {/* Simulated Map Canvas */}
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-700 bg-[#0F172A] shadow-inner flex flex-col justify-between p-4">
                {/* Map Grid / Topography visual styling */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #38BDF8 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Street Lines simulation */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-slate-500 transform -rotate-3" />
                  <div className="absolute top-2/3 left-0 right-0 h-[3px] bg-blue-500/80 transform rotate-2" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-slate-500 transform rotate-6" />
                  <div className="absolute top-0 bottom-0 left-2/3 w-[3px] bg-emerald-500/60 transform -rotate-4" />
                </div>

                {/* Map Controls */}
                <div className="relative z-10 flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span>São Paulo - SP (Jardins, Pinheiros, Itaim Bibi, Moema)</span>
                  </div>

                  <div className="flex flex-col gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700 text-xs text-white">
                    <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-800 rounded font-bold">+</button>
                    <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-800 rounded font-bold">-</button>
                  </div>
                </div>

                {/* Interactive Pins on Map */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto pointer-events-auto">
                  {properties.filter(p => p.displayOnMap !== false).slice(0, 4).map((p, idx) => {
                    const isSelected = selectedMapProperty?.id === p.id;
                    const priceFormatted = p.pricing.salePrice 
                      ? `R$ ${(p.pricing.salePrice / 1000000).toFixed(2)}M` 
                      : `R$ ${(p.pricing.rentPrice || 0).toLocaleString('pt-BR')}/mês`;

                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedMapProperty(isSelected ? null : p)}
                        className={`p-2 rounded-xl text-left transition-all border shadow-lg ${
                          isSelected
                            ? 'bg-blue-600 border-white text-white scale-105 z-20'
                            : 'bg-slate-800/90 hover:bg-slate-800 border-slate-600 text-slate-100 hover:scale-102'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{p.address.neighborhood}</span>
                        </div>
                        <div className="font-extrabold text-xs font-mono mt-0.5 truncate">
                          {priceFormatted}
                        </div>
                        <div className="text-[10px] text-slate-300 truncate">
                          {p.specs.usableAreaM2}m² • {p.specs.bedrooms} dorms
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Property Popup Card */}
                {selectedMapProperty ? (
                  <div className="relative z-20 bg-slate-900/95 border border-blue-500 rounded-xl p-3 flex items-center justify-between gap-3 text-xs shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-150">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedMapProperty.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=150'} 
                        alt={selectedMapProperty.title}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
                            {selectedMapProperty.code}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {selectedMapProperty.address.street}, {selectedMapProperty.address.neighborhood}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate max-w-xs mt-0.5">
                          {selectedMapProperty.title}
                        </h4>
                        <span className="text-emerald-400 font-mono font-bold text-xs">
                          {selectedMapProperty.pricing.salePrice 
                            ? selectedMapProperty.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : `${(selectedMapProperty.pricing.rentPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProperty && onSelectProperty(selectedMapProperty)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => setSelectedMapProperty(null)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 text-center text-[11px] text-slate-400 bg-slate-900/60 py-1 rounded-lg">
                    Clique em qualquer marcador acima para abrir a ficha do imóvel no mapa
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. QUEM SOMOS & VÍDEO INSTITUCIONAL */}
          <div className="py-12 px-4 sm:px-8 bg-white text-slate-900 border-t border-slate-200">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  Institucional & História
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {config.aboutUs?.title || `Sobre a ${config.siteName}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {config.aboutUs?.story || `${config.siteName} atua com tradição, assessoria jurídica integral e inovação digital para conectar pessoas aos melhores imóveis e oportunidades de investimento.`}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xl sm:text-2xl font-black text-blue-600 block font-mono">
                      {config.aboutUs?.yearsInMarket || 18}+
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">Anos de Mercado</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xl sm:text-2xl font-black text-emerald-600 block font-mono">
                      {config.aboutUs?.dealsClosed || 3420}+
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">Negócios Fechados</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-xl sm:text-2xl font-black text-amber-500 block font-mono">
                      {config.aboutUs?.satisfactionPercent || 99.4}%
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">Satisfação 5★</span>
                  </div>
                </div>
              </div>

              {/* Video Institutional Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group aspect-16/10 bg-slate-900 flex items-center justify-center">
                <img 
                  src={config.institutionalVideo?.thumbnailUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80'} 
                  alt="Vídeo Institucional"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-rose-500" />
                      Vídeo Institucional
                    </span>
                    <span className="text-xs text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                      {config.institutionalVideo?.duration || '2:45 min'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {config.institutionalVideo?.title || 'Conheça o Jeito de Negociar Imóveis'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {config.institutionalVideo?.subtitle || 'Assista e veja os diferenciais e a segurança jurídica que oferecemos'}
                    </p>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="absolute w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-10"
                >
                  <Play className="w-6 h-6 fill-white ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. NOSSO TIME DE ESPECIALISTAS */}
          <div className="py-12 px-4 sm:px-8 bg-slate-50 text-slate-900 border-t border-slate-200">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                  Equipe Credenciada
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Nosso Time de Especialistas
                </h2>
                <p className="text-xs text-slate-500">
                  Consultores com registro no CRECI, peritos avaliadores e especialistas prontos para te assessorar
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(config.teamMembers && config.teamMembers.length > 0 ? config.teamMembers : [
                  {
                    id: 'tm_default_1',
                    name: 'Dr. Roberto Mendonça',
                    role: 'Diretor Geral & Avaliador CNAI',
                    creci: '45.892-F / SP',
                    phone: '(11) 99876-1100',
                    email: 'roberto@imob.com',
                    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
                    specialty: 'Alto Padrão'
                  },
                  {
                    id: 'tm_default_2',
                    name: 'Mariana Junqueira Prado',
                    role: 'Gerente Comercial',
                    creci: '88.102-F / SP',
                    phone: '(11) 98765-2200',
                    email: 'mariana@imob.com',
                    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
                    specialty: 'Lançamentos'
                  },
                  {
                    id: 'tm_default_3',
                    name: 'Lucas Brandão',
                    role: 'Head de Locação & Contratos',
                    creci: '94.215-F / SP',
                    phone: '(11) 97654-3300',
                    email: 'lucas@imob.com',
                    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
                    specialty: 'Locação Digital'
                  },
                  {
                    id: 'tm_default_4',
                    name: 'Juliana Falcão',
                    role: 'Consultora de Crédito CCA',
                    creci: '101.400-F / SP',
                    phone: '(11) 96543-4400',
                    email: 'juliana@imob.com',
                    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300',
                    specialty: 'Financiamentos'
                  }
                ]).map((member) => (
                  <div 
                    key={member.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all text-center space-y-3 group"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                      <img 
                        src={member.photoUrl} 
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                      <p className="text-[11px] text-blue-600 font-semibold">{member.role}</p>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">CRECI {member.creci}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <a
                        href={`https://wa.me/55${(member.phone || config.whatsapp).replace(/\D/g, '')}`}
                        className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Falar no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. DEPOIMENTOS DE CLIENTES */}
          <div className="py-12 px-4 sm:px-8 bg-white text-slate-900 border-t border-slate-200">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Avaliações Verificadas
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  O Que Nossos Clientes Dizem
                </h2>
                <p className="text-xs text-slate-500">
                  Depoimentos reais de quem comprou, vendeu ou alugou conosco
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(config.testimonials && config.testimonials.length > 0 ? config.testimonials : [
                  {
                    id: 'dep_default_1',
                    clientName: 'Dra. Camila Bittencourt',
                    roleOrProfession: 'Médica Cardiologista',
                    comment: 'Vendi meu apartamento em Moema em apenas 18 dias e comprei uma cobertura no Itaim Bibi com a equipe AcertGo. Atendimento impecável e assessoria jurídica nota 10!',
                    rating: 5,
                    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
                    propertyTypeOrNeighborhood: 'Cobertura Duplex no Itaim Bibi'
                  },
                  {
                    id: 'dep_default_2',
                    clientName: 'Eng. Marcelo Queiroz',
                    roleOrProfession: 'Diretor de Tecnologia',
                    comment: 'A gestão do meu imóvel alugado pelo portal é espetacular. O aluguel cai certinho via PIX com extrato detalhado e divisão automática entre meus filhos.',
                    rating: 5,
                    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                    propertyTypeOrNeighborhood: 'Proprietário de 3 Imóveis em Cerqueira César'
                  },
                  {
                    id: 'dep_default_3',
                    clientName: 'Patrícia & Gustavo Lemos',
                    roleOrProfession: 'Empresários',
                    comment: 'Processo de locação sem fiador e sem burocracia. Em menos de 24 horas estávamos com as chaves na mão e contrato digital assinado no celular!',
                    rating: 5,
                    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    propertyTypeOrNeighborhood: 'Apartamento em Pinheiros'
                  }
                ]).map((t) => (
                  <div 
                    key={t.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Stars */}
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        "{t.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                      <img 
                        src={t.photoUrl} 
                        alt={t.clientName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{t.clientName}</h4>
                        <p className="text-[10px] text-slate-500">{t.roleOrProfession}</p>
                        {t.propertyTypeOrNeighborhood && (
                          <span className="text-[9px] text-blue-600 font-semibold block">{t.propertyTypeOrNeighborhood}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. BLOG & ARTIGOS IMOBILIÁRIOS */}
          <div className="py-12 px-4 sm:px-8 bg-slate-50 text-slate-900 border-t border-slate-200">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Conteúdo & Notícias
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                    Blog & Dicas Imobiliárias
                  </h2>
                </div>
                <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                  Ver todos os artigos →
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(config.blogPosts && config.blogPosts.length > 0 ? config.blogPosts : [
                  {
                    id: 'bp_1',
                    title: 'Taxa Selic e o Mercado Imobiliário: É a hora certa de comprar em 2026?',
                    excerpt: 'Descubra como os ciclos de juros impactam o financiamento SFH e as melhores oportunidades em bairros nobres.',
                    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
                    date: '20 de Setembro, 2026',
                    category: 'Mercado & Finanças',
                    readTime: '4 min'
                  },
                  {
                    id: 'bp_2',
                    title: 'Guia do Inquilino: Como alugar sem fiador utilizando seguro fiança digital',
                    excerpt: 'Esqueça caução alta ou favor de parentes. Saiba como a análise em 15 minutos pelo cartão de crédito funciona.',
                    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
                    date: '15 de Setembro, 2026',
                    category: 'Locação Ágil',
                    readTime: '3 min'
                  },
                  {
                    id: 'bp_3',
                    title: 'Os 5 Bairros com Maior Potencial de Valorização do m² em São Paulo',
                    excerpt: 'Análise de infraestrutura, novas estações de metrô, praças arborizadas e lançamentos icônicos.',
                    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
                    date: '08 de Setembro, 2026',
                    category: 'Tendências',
                    readTime: '5 min'
                  }
                ]).map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                        Ler artigo completo →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6 & 7. BANNERS INTEGRADOS: ÁREA DO CLIENTE NO SITE & INDIQUE E GANHE NO SITE */}
          <div className="py-12 px-4 sm:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border-t border-slate-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: ÁREA DO CLIENTE NO SITE (INTEGRADA COM LOCAÇÃO) */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Autoatendimento 24h
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">
                    {config.customerPortalConfig?.title || 'Área do Cliente (Inquilino & Proprietário)'}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {config.customerPortalConfig?.subtitle || 'Segunda via de boletos com Pix copia e cola, abertura de chamados técnicos, solicitações de vistoria, entrega de chaves e extrato de repasses para proprietários.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>2ª Via Boleto & Pix</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Abertura de Chamados</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Solicitar Vistorias</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Extrato de Repasses</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onOpenCustomerPortal) {
                        onOpenCustomerPortal();
                      } else {
                        setShowClientAreaModal(true);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Acessar Área do Cliente</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: INDIQUE E GANHE NO SITE (GAMIFICADO) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 backdrop-blur-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Gift className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Ganhe Dinheiro Indicando Imóveis
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">
                    {config.referralBannerConfig?.title || 'Programa Indique e Ganhe: Até R$ 1.000 via Pix!'}
                  </h3>

                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    {config.referralBannerConfig?.rewardDescription || 'Síndicos, porteiros, zeladores, vizinhos e amigos: indique proprietários querendo vender ou alugar e receba prêmio em dinheiro direto na sua conta bancária na conclusão do negócio.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-amber-200">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Ranking Gamificado</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Receba via Pix Instantâneo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Para Síndicos & Porteiros</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Acompanhe pelo App</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onOpenIndiqueGanhe) {
                        onOpenIndiqueGanhe();
                      } else {
                        setShowReferralModal(true);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{config.referralBannerConfig?.ctaText || 'Indicar Imóvel & Ver Ranking'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 8. BOTÃO FLUTUANTE DO WHATSAPP NO SITE */}
          {config.whatsappButton?.enabled !== false && (
            <div className="sticky bottom-4 right-4 flex justify-end px-4 pointer-events-none z-30">
              <a
                href={`https://wa.me/55${config.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-white/40"
              >
                <div className="relative">
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                </div>
                <span>{config.whatsappButton?.label || 'Fale no WhatsApp'}</span>
              </a>
            </div>
          )}

          {/* Video Modal Preview */}
          {showVideoModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-500" />
                    <span>{config.institutionalVideo?.title || 'Vídeo Institucional'}</span>
                  </h3>
                  <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="aspect-16/9 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 relative">
                  <img 
                    src={config.institutionalVideo?.thumbnailUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000'}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                    <p className="text-xs text-slate-200 font-semibold">
                      Vídeo Institucional: {config.institutionalVideo?.videoUrl || 'Link personalizado no CMS'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal informativo: Área do Cliente no Site */}
          {showClientAreaModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                    <h3 className="font-bold text-base">Área do Cliente Integrada</h3>
                  </div>
                  <button onClick={() => setShowClientAreaModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No site oficial da imobiliária, o botão da Área do Cliente direciona inquilinos e proprietários diretamente para o portal onde podem emitir 2ª via de boleto, abrir chamados e consultar repasses.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                  <div>✓ <strong>Inquilino:</strong> 2ª via de boleto e Pix, vistorias e chamados.</div>
                  <div>✓ <strong>Proprietário:</strong> Repasses Pix, comprovantes e orçamentos.</div>
                </div>
                <button
                  onClick={() => setShowClientAreaModal(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          {/* Modal informativo: Indique e Ganhe no Site */}
          {showReferralModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 space-y-4 border border-slate-200 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Gift className="w-6 h-6" />
                    <h3 className="font-bold text-base">Indique e Ganhe no Site</h3>
                  </div>
                  <button onClick={() => setShowReferralModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Os visitantes do site (porteiros de edifícios, síndicos, zeladores e vizinhos) contam com uma página gamificada com ranking de indicações e premiações pagas via Pix.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1 text-amber-900">
                  <div><strong>Ranking de Líderes:</strong> Pontuação por captações e fechamentos.</div>
                  <div>💰 <strong>Premiação Pix:</strong> Até R$ 1.000 por imóvel comercializado.</div>
                </div>
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          {/* Footer Unificado com Logo de Rodapé, CRECI e Contatos */}
          <footer className="p-6 bg-slate-900 text-slate-400 text-xs border-t border-slate-800 text-center space-y-3">
            {(config.footerLogoUrl || config.logoUrl) && (
              <div className="flex justify-center items-center py-1">
                <img 
                  src={config.footerLogoUrl || config.logoUrl} 
                  alt={config.siteName} 
                  className="max-h-10 max-w-48 object-contain"
                />
              </div>
            )}
            <p className="text-slate-200 font-semibold">
              {config.siteName} • Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-slate-400">
              {config.address} • Tel: {config.phone} • WhatsApp: {config.whatsapp}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              CRECI Jurídico Oficial: {config.creci} • Plataforma AcertGo Real Estate SaaS Engine
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

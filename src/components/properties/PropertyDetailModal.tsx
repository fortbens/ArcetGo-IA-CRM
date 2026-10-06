import React, { useState } from 'react';
import { 
  X, 
  Home, 
  Building, 
  DollarSign, 
  MapPin, 
  User, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Sparkles, 
  KeyRound, 
  Phone, 
  QrCode, 
  Printer, 
  Share2, 
  ExternalLink,
  Edit,
  Check,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Radar,
  Lock,
  ShieldAlert,
  CheckCheck,
  Smartphone
} from 'lucide-react';
import { 
  RealEstateProperty, 
  Owner, 
  UserProfile, 
  AgencyGovernanceRules, 
  DEFAULT_AGENCY_GOVERNANCE_RULES,
  canDisplayPropertyMapAndAddress,
  canUserViewOwnerDetails 
} from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';
import { RealPropertyQrCode } from '../common/RealPropertyQrCode';
import { GoogleMapComponent } from '../common/GoogleMapComponent';

interface PropertyDetailModalProps {
  property: RealEstateProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (property: RealEstateProperty) => void;
  onViewOwner: (owner: Owner) => void;
  owners: Owner[];
  onOpenProposal?: (property: RealEstateProperty) => void;
  onOpenRadar?: (property: RealEstateProperty) => void;
  onOpenLandingPage?: (property: RealEstateProperty) => void;
  currentUser?: UserProfile;
  governanceRules?: AgencyGovernanceRules;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onEdit,
  onViewOwner,
  owners,
  onOpenProposal,
  onOpenRadar,
  onOpenLandingPage,
  currentUser,
  governanceRules = DEFAULT_AGENCY_GOVERNANCE_RULES
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showQrSignPreview, setShowQrSignPreview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !property) return null;

  const linkedOwner = owners.find(o => o.id === property.ownerId);

  const activeUser = currentUser || CURRENT_USER_PROFILES[0];
  const mapAddressRule = canDisplayPropertyMapAndAddress(property, activeUser, governanceRules);
  const ownerRule = canUserViewOwnerDetails(activeUser, property, governanceRules);

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ id: 'def', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', isCover: true }];

  const handleNextPhoto = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevPhoto = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/#imovel-${property.code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 bg-slate-50/95 shrink-0 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-600 text-white font-mono shadow-xs shrink-0">
                {property.code}
              </span>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg font-bold text-slate-900 truncate">
                  {property.title}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                  {property.address.neighborhood} • {property.address.city}/{property.address.state} ({property.propertyType})
                </p>
              </div>
            </div>

            {/* Pinned close button: NEVER overflows or gets pushed off-screen! */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shrink-0 shadow-2xs"
              title="Fechar Detalhes"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons Toolbar: scrollable/wrap on mobile so nothing cuts off */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setShowQrSignPreview(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
                showQrSignPreview
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{showQrSignPreview ? 'Fechar Placa' : 'Placa com QR Code'}</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Share2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            {onOpenRadar && (
              <button
                onClick={() => onOpenRadar(property)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                title="Buscar leads compatíveis com o perfil deste imóvel"
              >
                <Radar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Radar Leads</span>
              </button>
            )}

            {onOpenLandingPage && (
              <button
                onClick={() => onOpenLandingPage(property)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0"
                title="Criar mini página de vendas para cliente com seus dados e WhatsApp"
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span>Mini Página</span>
              </button>
            )}

            {onOpenProposal && (
              <button
                onClick={() => onOpenProposal(property)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>Proposta</span>
              </button>
            )}

            <button
              onClick={() => onEdit(property)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Edit className="w-3.5 h-3.5 shrink-0" />
              <span>Editar</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* QR Sign Preview Mode */}
          {showQrSignPreview && (
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-blue-800/40 relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    Placa Inteligente de Venda / Locação
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    AcertGo Imóveis Prime • Exclusividade
                  </h3>
                  <p className="text-sm text-slate-300">
                    Aponte a câmera do seu celular para fazer um tour virtual 360°, ver valores e falar direto no WhatsApp do corretor responsável.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
                    <span>Código: <strong className="text-amber-400 text-sm">{property.code}</strong></span>
                    <span>•</span>
                    <span>CRECI 34982-J</span>
                    <span>•</span>
                    <span>Plantão: (11) 99864-2424</span>
                  </div>
                </div>

                {/* QR Code Real da Placa Inteligente */}
                <div className="bg-white p-3.5 rounded-2xl shadow-2xl flex flex-col items-center shrink-0 border-4 border-amber-400">
                  <RealPropertyQrCode 
                    propertyCode={property.code}
                    propertyTitle={property.title}
                    whatsappNumber="5511998642424"
                    size={140}
                    showActions={true}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Formato de impressão oficial: Placa de PVC 60x40cm com laminação UV</span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Placa / Salvar PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Photo Gallery with Slider */}
          <div className="space-y-3">
            <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden relative bg-slate-900 group shadow-md">
              <img
                src={images[activeImageIndex]?.url}
                alt={images[activeImageIndex]?.caption || property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Badges Over Photo */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-md ${
                  property.status === 'DISPONIVEL'
                    ? 'bg-emerald-500 text-white'
                    : property.status === 'RESERVADO'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-900 text-white'
                }`}>
                  {property.status}
                </span>

                <span className="px-3 py-1 rounded-xl text-xs font-black bg-blue-600 text-white shadow-md">
                  {property.transactionType === 'VENDA'
                    ? 'Venda'
                    : property.transactionType === 'LOCACAO'
                    ? 'Locação'
                    : 'Venda & Locação'}
                </span>

                <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-md flex items-center gap-1 ${
                  property.acceptsSign !== false
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{property.acceptsSign !== false ? 'Aceita Placa' : 'Não Aceita Placa'}</span>
                </span>
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/60 backdrop-blur-xs px-4 py-2 rounded-xl">
                <span>{images[activeImageIndex]?.caption || property.title}</span>
                <span className="font-mono font-bold">
                  {activeImageIndex + 1} / {images.length}
                </span>
              </div>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Financial Banner */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Valores Comerciais</span>
              <div className="flex items-baseline gap-4 mt-1 flex-wrap">
                {property.pricing.salePrice && (
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Preço de Venda:</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {property.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                )}

                {property.pricing.rentPrice && (
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Aluguel Mensal:</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                      {property.pricing.rentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      <span className="text-xs font-normal text-slate-500">/mês</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Overhead fees */}
            <div className="flex items-center gap-4 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
              {property.pricing.condoFee ? (
                <div>
                  <span className="text-slate-400 block font-medium">Condomínio:</span>
                  <span className="font-bold text-slate-800">
                    {property.pricing.condoFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                  </span>
                </div>
              ) : null}

              {property.pricing.iptuFee ? (
                <div>
                  <span className="text-slate-400 block font-medium">IPTU:</span>
                  <span className="font-bold text-slate-800">
                    {property.pricing.iptuFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                  </span>
                </div>
              ) : null}

              {property.pricing.commissionSalePercent ? (
                <div>
                  <span className="text-slate-400 block font-medium">Comissão Venda:</span>
                  <span className="font-bold text-blue-700">
                    {property.pricing.commissionSalePercent}%
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Área Útil</span>
                <span className="text-sm font-black text-slate-900">{property.specs.usableAreaM2} m²</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Quartos / Suítes</span>
                <span className="text-sm font-black text-slate-900">{property.specs.bedrooms} ({property.specs.suites} suítes)</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Banheiros</span>
                <span className="text-sm font-black text-slate-900">{property.specs.bathrooms}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Vagas</span>
                <span className="text-sm font-black text-slate-900">{property.specs.parkingSpaces}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Andar</span>
                <span className="text-sm font-black text-slate-900">
                  {property.specs.floor ? `${property.specs.floor}º andar` : 'Térreo / Casa'}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobília</span>
                <span className="text-xs font-black text-slate-900 truncate block">
                  {property.specs.furnishing === 'MOBILIADO' ? 'Mobiliado' : property.specs.furnishing === 'SEMIMOBILIADO' ? 'Planejados' : 'Vazio'}
                </span>
              </div>
            </div>
          </div>

          {/* Grid 2 Columns: Description & Features / Owner & Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Description & Features (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Descrição do Imóvel
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities & Features */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Diferenciais & Comodidades ({property.features.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map(feat => (
                    <span
                      key={feat}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Address card */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    Localização & Mapa
                  </h3>
                  {property.isExclusive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                      ★ Contrato com Exclusividade
                    </span>
                  )}
                </div>

                <p className="font-bold text-slate-900 text-sm">
                  {mapAddressRule.showExactAddress
                    ? `${property.address.street}, ${property.address.number || 'S/N'} ${property.address.complement ? ` - ${property.address.complement}` : ''}`
                    : `${property.address.street} (Número protegido por regra de governança)`}
                </p>
                <p className="text-slate-600 font-mono">
                  {property.address.neighborhood} • {property.address.city}/{property.address.state} • CEP {property.address.cep} (Zona {property.address.zone})
                </p>

                {mapAddressRule.reason && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>{mapAddressRule.reason}</span>
                  </p>
                )}

                {/* Google Maps Interativo ou Bloqueio por Governança */}
                <div className="pt-2">
                  {mapAddressRule.showMap ? (
                    <GoogleMapComponent
                      center={{
                        lat: property.address.neighborhood?.toLowerCase().includes('jardins') ? -23.5629 : property.address.neighborhood?.toLowerCase().includes('itaim') ? -23.5835 : -23.5615,
                        lng: property.address.neighborhood?.toLowerCase().includes('jardins') ? -46.6691 : property.address.neighborhood?.toLowerCase().includes('itaim') ? -46.6789 : -46.6559
                      }}
                      zoom={15}
                      height="240px"
                      markers={[{
                        id: property.id,
                        title: property.title,
                        lat: property.address.neighborhood?.toLowerCase().includes('jardins') ? -23.5629 : property.address.neighborhood?.toLowerCase().includes('itaim') ? -23.5835 : -23.5615,
                        lng: property.address.neighborhood?.toLowerCase().includes('jardins') ? -46.6691 : property.address.neighborhood?.toLowerCase().includes('itaim') ? -46.6789 : -46.6559,
                        address: `${property.address.street}, ${property.address.neighborhood}`,
                        price: property.pricing.salePrice || property.pricing.rentPrice,
                        imageUrl: property.images[0]?.url
                      }]}
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 mx-auto flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Mapa Interativo Restrito por Política de Governança
                      </div>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Conforme a regra parametrizada da imobiliária, a visualização no mapa é exibida exclusivamente em imóveis com contrato de exclusividade ou marcados pelo captador.
                      </p>
                      <div className="inline-block px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                        Bairro: {property.address.neighborhood} ({property.address.city}/{property.address.state})
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Canal Pró & Negociação */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-indigo-700">
                    <CheckCheck className="w-4 h-4" />
                    Padrão Canal Pró (ZAP / VivaReal / OLX) & Condições Comerciais
                  </span>
                  {property.canalProListingType && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                      {property.canalProListingType}
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">SUBTIPO</span>
                    <strong className="text-slate-800 text-xs">{property.canalProSubtype || 'Padrão'}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">POSIÇÃO</span>
                    <strong className="text-slate-800 text-xs">{property.buildingPosition || 'Frente'}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">FINANCIAMENTO</span>
                    <strong className={property.acceptsFinancing !== false ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                      {property.acceptsFinancing !== false ? '✓ Aceita Bancário' : 'Não Aceita'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">PERMUTA</span>
                    <strong className={property.acceptsExchange ? 'text-blue-700 font-bold' : 'text-slate-500'}>
                      {property.acceptsExchange ? '✓ Aceita Permuta' : 'Não Aceita'}
                    </strong>
                  </div>
                </div>

                {property.acceptsExchange && property.exchangeDetails && (
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900">
                    <span className="font-bold text-[11px] block">Detalhes da Permuta:</span>
                    <p className="text-xs mt-0.5">{property.exchangeDetails}</p>
                  </div>
                )}
              </div>

              {/* Controle de Sinalização & Placa */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Controle de Placas & Sinalização</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    property.acceptsSign !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {property.acceptsSign !== false ? '✓ Aceita Placa' : '✕ Não Aceita Placa'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">AUTORIZAÇÃO</span>
                    <strong className={property.acceptsSign !== false ? 'text-emerald-700' : 'text-rose-700'}>
                      {property.acceptsSign !== false ? 'Autorizado pelo Proprietário' : 'Recusado / Proibido'}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">TIPO DE PLACA</span>
                    <strong className="text-slate-800">
                      {property.acceptsSign !== false 
                        ? (property.signTypeAllowed || 'Placa de Fachada') 
                        : (property.signRefusalReason || 'Condomínio Proíbe')}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">STATUS EM CAMPO</span>
                    <strong className="text-blue-700 font-bold">
                      {property.signStatus || (property.acceptsSign !== false ? 'Sem Placa Instalada' : 'Não Aplicável')}
                    </strong>
                  </div>
                </div>

                {property.acceptsSign !== false && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Placa física com QR Code exclusivo direcionando para landing page e WhatsApp.
                    </span>
                    <button
                      onClick={() => setShowQrSignPreview(true)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Gerar Placa para Impressão</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Informações Internas Confidenciais (NÃO APARECE NO SITE NEM NOS PORTAIS) */}
              <div className="bg-amber-50/70 border border-amber-300/80 p-5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Informações Internas Confidenciais</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 ml-auto">
                    Uso Interno Corretor
                  </span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  {property.internalNotes || 'Nenhuma observação interna confidencial cadastrada para este imóvel.'}
                </p>
                <span className="text-[10px] text-amber-700/80 block italic">
                  * Este campo nunca é publicado no site institucional nem exportado nos feeds de portais.
                </span>
              </div>
            </div>

            {/* Right: Owner Card & Keys Operational Control (1 col) */}
            <div className="space-y-5">
              
              {/* Owner Linked Box */}
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Proprietário Vinculado
                  </span>
                  {ownerRule.allowed && linkedOwner && (
                    <button
                      onClick={() => onViewOwner(linkedOwner)}
                      className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      Ver Ficha 360°
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {ownerRule.allowed ? (
                  <>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{property.ownerName}</h4>
                      <p className="text-xs text-slate-600 font-mono mt-0.5">Doc: {property.ownerDocument}</p>
                    </div>

                    <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Contato direto:</span>
                      <a
                        href={`https://wa.me/55${property.ownerPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>

                    {linkedOwner && (
                      <div className="pt-1 text-[11px] text-slate-500">
                        Chave Pix ({linkedOwner.bankDetails.pixKeyType}): <span className="font-mono font-semibold text-slate-800">{linkedOwner.bankDetails.pixKey}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3.5 bg-white/90 border border-amber-300 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Contato Direto Protegido</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {ownerRule.reason}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Proprietário: <strong className="text-slate-800">{property.ownerName.split(' ')[0]} ***</strong></span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                        Captador: {property.captadorName || 'Juliana Mendes'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Physical Keys Control */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  Controle Físico das Chaves
                </span>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                  <span className="text-amber-800 font-bold block">Localização Cadastrada:</span>
                  <span className="text-slate-900 font-semibold text-sm block mt-0.5">
                    {property.keysLocation || 'Claviculário Geral'}
                  </span>
                </div>
              </div>

              {/* Virtual Tour / Video Links */}
              {(property.virtualTourUrl || property.videoUrl) && (
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Mídia Interativa
                  </span>
                  {property.virtualTourUrl && (
                    <a
                      href={property.virtualTourUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Abrir Tour Virtual 360 (Matterport)
                    </a>
                  )}
                  {property.videoUrl && (
                    <a
                      href={property.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Assistir Vídeo no YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>Cadastrado no sistema em {new Date(property.createdAt).toLocaleDateString('pt-BR')}</div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 rounded-xl transition-colors"
          >
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};

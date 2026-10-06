import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Heart, 
  MessageSquare, 
  Eye, 
  Sparkles,
  Play,
  Pause,
  ArrowRight
} from 'lucide-react';
import { RealEstateProperty } from '../../types/crm';

interface FeaturedPropertiesCarouselProps {
  properties: RealEstateProperty[];
  title?: string;
  subtitle?: string;
  autoPlay?: boolean;
  accentColor?: string;
  isDarkTheme?: boolean;
  onSelectProperty?: (property: RealEstateProperty) => void;
  onWhatsAppInquiry?: (property: RealEstateProperty) => void;
}

export const FeaturedPropertiesCarousel: React.FC<FeaturedPropertiesCarouselProps> = ({
  properties,
  title = 'Imóveis em Destaque',
  subtitle = 'Oportunidades exclusivas selecionadas pela nossa equipe de curadoria',
  autoPlay = true,
  accentColor = '#2563EB',
  isDarkTheme = false,
  onSelectProperty,
  onWhatsAppInquiry
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [favorites, setFavorites] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter or prioritize featured properties
  const featuredList = properties.length > 0 
    ? properties.filter(p => p.featured || p.isExclusive).concat(properties).slice(0, 8)
    : [];

  const itemsPerView = 3; // On desktop
  const maxIndex = Math.max(0, featuredList.length - 1);

  useEffect(() => {
    if (!isPlaying || featuredList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, maxIndex, featuredList.length]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  if (featuredList.length === 0) return null;

  const bgCard = isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800';
  const textMuted = isDarkTheme ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-4 my-8">
      {/* Header with Title and Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              <Sparkles className="w-3 h-3" />
              <span>Destaques & Lançamentos</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading">
            {title}
          </h2>
          <p className={`text-xs ${textMuted} mt-0.5`}>
            {subtitle}
          </p>
        </div>

        {/* Carousel Navigation Buttons & Play/Pause */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-600'
            } hover:text-blue-600`}
            title={isPlaying ? 'Pausar Carrossel Automático' : 'Reproduzir Carrossel Automático'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className={`p-2 rounded-xl border transition-all ${
              isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            } shadow-xs`}
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`p-2 rounded-xl border transition-all ${
              isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            } shadow-xs`}
            title="Próximo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="relative overflow-hidden rounded-3xl">
        <div 
          className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
          style={{ transform: `translateX(-${currentIndex * (100 / (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : itemsPerView))}%)` }}
        >
          {featuredList.map((property, idx) => {
            const isFav = favorites.includes(property.id);
            const isVenda = property.transactionType === 'VENDA' || property.transactionType === 'VENDA_LOCACAO';
            const price = isVenda 
              ? (property.pricing.salePrice ? `R$ ${property.pricing.salePrice.toLocaleString('pt-BR')}` : 'Sob Consulta')
              : (property.pricing.rentPrice ? `R$ ${property.pricing.rentPrice.toLocaleString('pt-BR')}/mês` : 'Sob Consulta');

            return (
              <div
                key={`${property.id}-${idx}`}
                onClick={() => onSelectProperty && onSelectProperty(property)}
                className={`shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-3xl overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group ${bgCard}`}
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={property.images[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span 
                      className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs"
                      style={{ backgroundColor: accentColor }}
                    >
                      {property.transactionType === 'LOCACAO' ? 'Aluguel' : 'Venda'}
                    </span>
                    {property.isExclusive && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                        Exclusivo
                      </span>
                    )}
                    {property.featured && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                        Destaque
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, property.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white transition-all z-10"
                    title={isFav ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
                  </button>

                  {/* Photo counter */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                    📷 {property.images.length || 1} fotos
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{property.address.neighborhood}, {property.address.city}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>

                  {/* Price */}
                  <div>
                    <span className="text-base sm:text-lg font-black tracking-tight" style={{ color: accentColor }}>
                      {price}
                    </span>
                    {property.pricing.condoFee && (
                      <span className={`text-[11px] ${textMuted} block`}>
                        Condomínio: R$ {property.pricing.condoFee.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-4 gap-1 py-2.5 border-y border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1 justify-center" title="Área Útil">
                      <Maximize2 className="w-3 h-3 text-slate-400" />
                      <span>{property.specs.usableAreaM2}m²</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center" title="Quartos">
                      <Bed className="w-3 h-3 text-slate-400" />
                      <span>{property.specs.bedrooms} Qts</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center" title="Banheiros">
                      <Bath className="w-3 h-3 text-slate-400" />
                      <span>{property.specs.bathrooms} Ban</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center" title="Vagas">
                      <Car className="w-3 h-3 text-slate-400" />
                      <span>{property.specs.parkingSpaces} Vag</span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      Cód: {property.code}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onWhatsAppInquiry) {
                          onWhatsAppInquiry(property);
                        } else {
                          window.open(`https://wa.me/5511998642424?text=Olá! Tenho interesse no imóvel ${property.code} (${property.title})`, '_blank');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {featuredList.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              currentIndex === idx 
                ? 'w-6 bg-blue-600' 
                : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
            style={currentIndex === idx ? { backgroundColor: accentColor } : {}}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

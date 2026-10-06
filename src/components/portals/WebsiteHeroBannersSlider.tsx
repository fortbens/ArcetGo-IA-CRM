import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WebsiteHeroBanner } from '../../types/websiteSeo';

interface WebsiteHeroBannersSliderProps {
  banners: WebsiteHeroBanner[];
  autoPlay?: boolean;
  accentColor?: string;
  onCtaClick?: (link?: string) => void;
}

export const DEFAULT_HERO_BANNERS: WebsiteHeroBanner[] = [
  {
    id: 'banner_1',
    badge: 'Lançamentos Exclusivos 2026',
    title: 'Encontre o Imóvel Perfeito para o Seu Estilo de Vida',
    subtitle: 'Apartamentos na planta, coberturas e casas nos bairros mais nobres com assessoria jurídica completa.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
    ctaText: 'Explorar Lançamentos',
    ctaLink: '#lancamentos',
    active: true
  },
  {
    id: 'banner_2',
    badge: 'Avaliação Patrimonial Gratuita',
    title: 'Quer Vender ou Alugar Seu Imóvel com Rapidez e Segurança?',
    subtitle: 'Cadastre seu imóvel e alcance mais de 50 mil compradores qualificados com fotos profissionais e tour virtual 360°.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&auto=format&fit=crop&q=80',
    ctaText: 'Cadastrar Meu Imóvel',
    ctaLink: '#cadastrar-imovel',
    active: true
  },
  {
    id: 'banner_3',
    badge: 'Crédito Imobiliário Aprovado em 24h',
    title: 'Simule Seu Financiamento com as Menores Taxas do Mercado',
    subtitle: 'Correspondente Bancário Autorizado Caixa, Itaú, Santander e Bradesco. Cuidamos de 100% da burocracia.',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80',
    ctaText: 'Simular Financiamento',
    ctaLink: '#simulador-financiamento',
    active: true
  }
];

export const WebsiteHeroBannersSlider: React.FC<WebsiteHeroBannersSliderProps> = ({
  banners = DEFAULT_HERO_BANNERS,
  autoPlay = true,
  accentColor = '#2563EB',
  onCtaClick
}) => {
  const activeBanners = banners.filter(b => b.active);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoPlay, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentSlide];

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] overflow-hidden rounded-3xl shadow-2xl mb-8 group">
      {/* Background Image with Crossfade */}
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay for high readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-5xl mx-auto px-6 sm:px-10 flex flex-col justify-center text-white space-y-4">
        {current.badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white self-start">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{current.badge}</span>
          </div>
        )}

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl drop-shadow-md">
          {current.title}
        </h1>

        <p className="text-xs sm:text-base text-slate-200 max-w-xl line-clamp-3 leading-relaxed drop-shadow-xs font-light">
          {current.subtitle}
        </p>

        {current.ctaText && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onCtaClick && onCtaClick(current.ctaLink)}
              className="px-6 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer self-start"
              style={{ backgroundColor: accentColor }}
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Chevrons */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
            title="Banner Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
            title="Próximo Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-5 left-6 sm:left-10 z-20 flex items-center gap-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Ir para banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

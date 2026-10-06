import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';

interface TableScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  hintText?: string;
  showControls?: boolean;
}

export const TableScrollContainer: React.FC<TableScrollContainerProps> = ({
  children,
  className = '',
  hintText = 'Arraste para o lado ou use as setas para ver mais colunas',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 5;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;

    window.addEventListener('resize', checkScroll);
    el.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
      el.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const scrollByAmount = (offset: number) => {
    const el = containerRef.current;
    if (el) {
      el.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative flex flex-col w-full ${className}`}>
      {/* Scroll indicator & quick scroll buttons bar */}
      {showControls && (canScrollLeft || canScrollRight) && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 border border-slate-200/80 rounded-xl mb-2 text-xs text-slate-600 select-none animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
            <MoveHorizontal className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>{hintText}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollByAmount(-240)}
              disabled={!canScrollLeft}
              className="p-1 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors text-[11px] font-bold flex items-center gap-1 shadow-2xs"
              title="Rolar para esquerda"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Esquerda</span>
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(240)}
              disabled={!canScrollRight}
              className="p-1 px-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:pointer-events-none transition-colors text-[11px] font-bold flex items-center gap-1 shadow-2xs"
              title="Rolar para direita"
            >
              <span className="hidden sm:inline">Direita</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main scrollable area with prominent scrollbar */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto prominent-horizontal-scrollbar touch-pan-x"
      >
        {children}
      </div>

      {/* Bottom hint indicator if table is wide */}
      {(canScrollLeft || canScrollRight) && (
        <div className="mt-1 flex items-center justify-center text-[10px] text-slate-400 font-medium sm:hidden">
          <span>⟵ Deslize com o dedo para visualizar todas as colunas ⟶</span>
        </div>
      )}
    </div>
  );
};

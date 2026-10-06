import React, { useState } from 'react';
import { 
  Megaphone, 
  X, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  Building2, 
  ShieldCheck,
  Flame
} from 'lucide-react';
import { PlatformBroadcastBanner } from '../../types/notifications';

interface GlobalAnnouncementBannerProps {
  banners: PlatformBroadcastBanner[];
  onActionClick: (targetTab?: string) => void;
  onDismiss: (bannerId: string) => void;
}

export const GlobalAnnouncementBanner: React.FC<GlobalAnnouncementBannerProps> = ({
  banners,
  onActionClick,
  onDismiss
}) => {
  const activeBanners = banners.filter(b => b.active);
  const [currentIdx, setCurrentIdx] = useState(0);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[Math.min(currentIdx, activeBanners.length - 1)];

  const getStyleByLevel = (level: PlatformBroadcastBanner['level']) => {
    switch (level) {
      case 'CRITICO':
        return {
          wrapper: 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white border-b border-rose-700',
          badge: 'bg-rose-500 text-white',
          icon: <Flame className="w-4 h-4 text-rose-300 animate-pulse" />
        };
      case 'AVISO':
        return {
          wrapper: 'bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white border-b border-amber-700',
          badge: 'bg-amber-400 text-amber-950 font-black',
          icon: <AlertTriangle className="w-4 h-4 text-amber-300" />
        };
      case 'NOVIDADE':
        return {
          wrapper: 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-b border-indigo-700',
          badge: 'bg-purple-400 text-purple-950 font-black',
          icon: <Sparkles className="w-4 h-4 text-purple-300 animate-spin-slow" />
        };
      case 'INFO':
      default:
        return {
          wrapper: 'bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white border-b border-blue-800',
          badge: 'bg-blue-500 text-white font-bold',
          icon: <Megaphone className="w-4 h-4 text-blue-300" />
        };
    }
  };

  const currentStyle = getStyleByLevel(currentBanner.level);
  const isSuperAdminScope = currentBanner.scope === 'SUPER_ADMIN_GLOBAL';

  return (
    <aside 
      aria-label="Comunicado global da plataforma"
      className={`px-3 py-2 text-xs relative select-none transition-all duration-300 shadow-sm ${currentStyle.wrapper}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Section: Icon + Scope Badge + Content */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-1 rounded-lg bg-white/10 shrink-0">
            {currentStyle.icon}
          </div>

          {/* Scope Indicator: Super Admin Platform vs Real Estate Team */}
          {isSuperAdminScope ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 shrink-0">
              <ShieldCheck className="w-3 h-3 text-rose-400" />
              <span>Super Admin</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0">
              <Building2 className="w-3 h-3 text-blue-400" />
              <span>Diretoria</span>
            </span>
          )}

          {/* Banner Text Content */}
          <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
            <span className="font-black text-white shrink-0 truncate max-w-[200px] sm:max-w-none">
              {currentBanner.title}
            </span>
            <span className="text-slate-300 text-[11px] hidden md:inline truncate">
              — {currentBanner.content}
            </span>
          </div>
        </div>

        {/* Right Section: Action Button + Multiple Banners Cycler + Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {currentBanner.linkText && (
            <button
              onClick={() => onActionClick(currentBanner.linkActionTab)}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 whitespace-nowrap shadow-2xs"
            >
              <span>{currentBanner.linkText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Cycler if multiple banners exist */}
          {activeBanners.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-300 font-mono px-1.5 py-0.5 rounded bg-black/20">
              <button 
                onClick={() => setCurrentIdx(prev => (prev > 0 ? prev - 1 : activeBanners.length - 1))}
                className="hover:text-white"
              >
                ◀
              </button>
              <span>{currentIdx + 1}/{activeBanners.length}</span>
              <button 
                onClick={() => setCurrentIdx(prev => (prev < activeBanners.length - 1 ? prev + 1 : 0))}
                className="hover:text-white"
              >
                ▶
              </button>
            </div>
          )}

          {currentBanner.isDismissible && (
            <button
              onClick={() => onDismiss(currentBanner.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Dispensar este comunicado"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};

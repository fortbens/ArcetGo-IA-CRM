import React from 'react';
import { 
  Zap, 
  RotateCcw, 
  Play, 
  Flame, 
  Sparkles, 
  Building2, 
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { DEMO_PRESENTATION_SCENARIOS } from '../../data/mockNotificationsData';

interface DemoSandboxBannerProps {
  activeScenarioId: string;
  onOpenSandboxModal: () => void;
  onResetData: () => void;
  onInjectQuickLead: () => void;
  isDismissed?: boolean;
  onToggleVisibility?: () => void;
}

export const DemoSandboxBanner: React.FC<DemoSandboxBannerProps> = ({
  activeScenarioId,
  onOpenSandboxModal,
  onResetData,
  onInjectQuickLead,
  isDismissed = false,
  onToggleVisibility
}) => {
  if (isDismissed) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={onToggleVisibility}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full text-xs font-black shadow-lg transition-all animate-bounce"
          title="Reabrir barra de apresentação / sandbox"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Modo Apresentação Ativo</span>
        </button>
      </div>
    );
  }

  const scenario = DEMO_PRESENTATION_SCENARIOS.find(s => s.id === activeScenarioId) || DEMO_PRESENTATION_SCENARIOS[0];

  return (
    <aside 
      aria-label="Barra de ambiente de apresentação e testes"
      className="bg-emerald-950 text-emerald-100 border-b border-emerald-800/80 px-3 py-1.5 text-xs select-none shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        
        {/* Left: Active Scenario & Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3 text-amber-300" />
            <span>Ambiente de Testes / Apresentação</span>
          </span>

          <span className="text-[11px] font-semibold text-emerald-300 truncate hidden sm:inline">
            Cenário: <strong>{scenario.name}</strong> ({scenario.badge})
          </span>
        </div>

        {/* Right: Quick Presentation Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Inject Quick Lead */}
          <button
            onClick={onInjectQuickLead}
            className="px-2.5 py-1 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex items-center gap-1 shrink-0"
            title="Injetar lead quente de demonstração ao vivo com notificação push"
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span className="hidden md:inline">Injetar Lead ao Vivo</span>
            <span className="md:hidden">+ Lead</span>
          </button>

          {/* Open Sandbox Modal */}
          <button
            onClick={onOpenSandboxModal}
            className="px-2.5 py-1 rounded-lg bg-white text-emerald-950 text-[11px] font-black hover:bg-emerald-50 transition-all flex items-center gap-1 shrink-0 shadow-2xs"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Central do Apresentador</span>
          </button>

          {/* Reset Test Data */}
          <button
            onClick={onResetData}
            className="p-1 rounded-lg hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors shrink-0"
            title="Resetar dados simulados para estado limpo de apresentação"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Banner */}
          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className="p-1 rounded-lg hover:bg-emerald-900 text-emerald-400 hover:text-white transition-colors shrink-0"
              title="Minimizar barra para o canto da tela"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};

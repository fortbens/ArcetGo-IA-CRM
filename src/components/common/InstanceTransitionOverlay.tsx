import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  X
} from 'lucide-react';

interface InstanceTransitionOverlayProps {
  tenantName: string;
  ownerName: string;
  ownerEmail?: string;
  city?: string;
  state?: string;
  initialModule?: string;
  logoUrl?: string;
  onDismiss: () => void;
}

export const InstanceTransitionOverlay: React.FC<InstanceTransitionOverlayProps> = ({
  tenantName,
  ownerName,
  ownerEmail,
  city,
  state,
  initialModule = 'kanban',
  logoUrl,
  onDismiss
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onDismiss]);

  const getModuleLabel = (mod: string) => {
    switch (mod) {
      case 'imoveis': return 'Estoque de Imóveis';
      case 'roleta': return 'Roleta de Atendimento';
      case 'sites_modelos': return 'Site & Portais';
      case 'financial_erp': return 'Financeiro ERP';
      case 'executive_dashboard': return 'Painel do Diretor (CEO)';
      case 'sales_proposals': return 'Propostas & Vendas';
      case 'kanban':
      default: return 'Funil de Leads (Kanban)';
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-lg select-none pointer-events-auto">
      <div className="bg-slate-950/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl p-4 text-white relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo or Shield Icon */}
            <div className="relative shrink-0">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={tenantName} 
                  className="w-11 h-11 rounded-xl object-contain bg-white/10 p-1 border border-white/20 shadow-md" 
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-emerald-200" />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  AMBIENTE EXCLUSIVO ATIVADO
                </span>
                <span className="text-[10px] text-slate-400 font-semibold truncate">
                  Produção Limpa
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white tracking-tight truncate mt-0.5">
                {tenantName}
              </h3>
              <p className="text-[11px] text-slate-300 truncate">
                Gestor Principal: <strong className="text-emerald-300 font-semibold">{ownerName}</strong>
                {ownerEmail && <span className="text-slate-400 font-normal"> ({ownerEmail})</span>}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              Pronto para operação · Módulo: <strong className="text-slate-200">{getModuleLabel(initialModule)}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors shrink-0 ml-2 cursor-pointer"
          >
            <span>Iniciar Trabalho</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Smooth progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

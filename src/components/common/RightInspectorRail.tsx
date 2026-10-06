import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Radar, 
  Bell, 
  Palette, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Building2, 
  DollarSign, 
  Flame, 
  FileSignature, 
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Sliders,
  X
} from 'lucide-react';
import { Lead, RealEstateProperty, PropertyProposal } from '../../types/crm';
import { SystemThemeConfig, SYSTEM_COLOR_PRESETS } from '../../types/theme';

interface RightInspectorRailProps {
  isOpen: boolean;
  onToggle: () => void;
  leads: Lead[];
  properties: RealEstateProperty[];
  themeConfig: SystemThemeConfig;
  onOpenThemeModal: () => void;
  onSelectLead: (lead: Lead) => void;
  onOpenNewLead: () => void;
  onOpenAiStudio: () => void;
  onApplyColorPreset?: (preset: typeof SYSTEM_COLOR_PRESETS[0]) => void;
}

export const RightInspectorRail: React.FC<RightInspectorRailProps> = ({
  isOpen,
  onToggle,
  leads,
  properties,
  themeConfig,
  onOpenThemeModal,
  onSelectLead,
  onOpenNewLead,
  onOpenAiStudio,
  onApplyColorPreset
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'sla' | 'actions'>('radar');

  // Filter hot / high budget leads for radar
  const hotLeads = leads
    .filter(l => l.rating && l.rating >= 4 || (l.budgetMax && l.budgetMax >= 1000000))
    .slice(0, 4);

  // SLA Alerts
  const pendingLeadsCount = leads.filter(l => l.stage === 'NOVO_LEAD').length;

  if (!isOpen) {
    return (
      <div className="hidden xl:flex flex-col items-center py-4 px-1.5 bg-white border-l border-slate-200/80 shrink-0 z-20">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Expandir Painel Lateral (Three-Column Layout)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="my-3 w-6 h-px bg-slate-200" />
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors relative"
          title="Radar & Alertas"
        >
          <Radar className="w-4 h-4 animate-spin-slow" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>
        <button
          onClick={onOpenThemeModal}
          className="mt-2 p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Personalizar Cores e Logotipo"
        >
          <Palette className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
        </button>
      </div>
    );
  }

  const railContent = (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Top Header of Column 3 */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: themeConfig.primaryColor }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Painel Lateral & Inteligência
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenThemeModal}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Alterar Logo e Cores do Sistema"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: themeConfig.primaryColor }} />
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 font-bold text-xs"
            title="Fechar / Recolher Painel Lateral"
          >
            <X className="w-4 h-4" />
            <span className="text-[10px]">Fechar</span>
          </button>
        </div>
      </div>

      {/* Mini Quick Theme Switcher Bar */}
      <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
        <span className="flex items-center gap-1 font-semibold text-slate-500">
          <Sliders className="w-3 h-3 text-slate-400" /> Cores Rápidas:
        </span>
        <div className="flex items-center gap-1.5">
          {SYSTEM_COLOR_PRESETS.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyColorPreset?.(preset)}
              className="w-4 h-4 rounded-full border border-white ring-1 ring-slate-200 hover:scale-115 transition-transform"
              style={{ backgroundColor: preset.primaryColor }}
              title={preset.name}
            />
          ))}
          <button
            onClick={onOpenThemeModal}
            className="text-[10px] text-blue-600 hover:underline font-semibold ml-1"
          >
            + Mais
          </button>
        </div>
      </div>

      {/* Column 3 Subnav Tabs */}
      <div className="flex border-b border-slate-200/80 bg-white px-3 pt-1 shrink-0">
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex-1 pb-2 pt-1.5 text-xs font-semibold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'radar'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          style={activeTab === 'radar' ? { borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor } : {}}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Radar Quente
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`flex-1 pb-2 pt-1.5 text-xs font-semibold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'sla'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          style={activeTab === 'sla' ? { borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor } : {}}
        >
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          SLA & Avisos
          {pendingLeadsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
              {pendingLeadsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 pb-2 pt-1.5 text-xs font-semibold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'actions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          style={activeTab === 'actions' ? { borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor } : {}}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          Ações
        </button>
      </div>

      {/* Tab Content List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        
        {/* TAB 1: RADAR DE LEADS & MATCHES QUENTES */}
        {activeTab === 'radar' && (
          <div className="space-y-2.5 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
              <span>Leads com Alto Poder de Compra</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 4 matches
              </span>
            </div>

            {hotLeads.map((lead) => {
              const formattedBudget = lead.budgetMax
                ? Number(lead.budgetMax).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                : 'Orçamento Flexível';

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="p-3 rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xs bg-white transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate flex items-center gap-1">
                        {lead.name}
                        {lead.rating && lead.rating >= 4 && (
                          <span className="text-[10px] text-amber-500 font-semibold">★ {lead.rating}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lead.propertyOfInterestTitle || 'Interessado em Imóveis'}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {formattedBudget}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2 mt-2">
                    <span className="truncate">Corretor: {lead.assignedBrokerName || 'Não atribuído'}</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ver Lead <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick Radar Action Card */}
            <div className="p-3 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-xl border border-blue-100 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Radar className="w-3.5 h-3.5 text-blue-600" /> Cruzamento de Carteira
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
                Existem {properties.length} imóveis ativos cruzando perfeitamente com os perfis buscados hoje.
              </p>
              <button
                onClick={onOpenAiStudio}
                className="w-full py-1.5 px-2 text-center text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors flex items-center justify-center gap-1"
                style={{ backgroundColor: themeConfig.primaryColor }}
              >
                <Sparkles className="w-3 h-3" />
                Executar Matchmaker IA
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SLA & AVISOS */}
        {activeTab === 'sla' && (
          <div className="space-y-2.5 animate-in fade-in-50 duration-150">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Roleta de Atendimento
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                {pendingLeadsCount > 0 
                  ? `${pendingLeadsCount} novos leads aguardando 1º contato via WhatsApp.`
                  : 'Fila zerada. Todos os leads foram contatados a tempo!'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Split Financeiro Pix
              </div>
              <p className="text-[11px] text-blue-800 leading-snug">
                Gateway Asaas em sincronia contínua. Próxima remessa de repasses programada para as 16h.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                Esteira Bancária CCA
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                3 propostas de crédito Caixa e Itaú aguardando laudo de engenharia.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: AÇÕES RÁPIDAS */}
        {activeTab === 'actions' && (
          <div className="space-y-2 animate-in fade-in-50 duration-150">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
              Atalhos Rápidos
            </div>

            <button
              onClick={onOpenNewLead}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Cadastrar Novo Lead</div>
                  <div className="text-[10px] text-slate-500">Inserir na roleta de vendas</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenAiStudio}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600">AcertAI SDR & Descrições</div>
                  <div className="text-[10px] text-slate-500">Gerar anúncios para portais</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenThemeModal}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Logo & Cores do Sistema</div>
                  <div className="text-[10px] text-slate-500">Personalizar identidade visual</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

      </div>

      {/* Bottom Identity & Active Status Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div 
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ backgroundColor: themeConfig.primaryColor }}
          >
            {themeConfig.platformName?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-800 text-[11px] truncate">
              {themeConfig.platformName || 'AcertGo'}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              Layout 3 Colunas Ativo
            </div>
          </div>
        </div>

        <button
          onClick={onOpenThemeModal}
          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors shrink-0"
        >
          Editar Cores
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Docked Column 3 for XL+ screens */}
      <aside className="hidden xl:flex w-80 2xl:w-88 bg-white border-l border-slate-200/90 flex-col shrink-0 overflow-hidden z-20 shadow-2xs">
        {railContent}
      </aside>

      {/* Slide-over Drawer for < XL screens when opened via header button */}
      <div className="xl:hidden fixed inset-0 z-50 flex justify-end animate-in fade-in duration-150">
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs"
          onClick={onToggle}
        />
        <aside className="relative w-80 sm:w-88 max-w-[85vw] bg-white shadow-2xl flex flex-col h-full z-10 border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {railContent}
        </aside>
      </div>
    </>
  );
};

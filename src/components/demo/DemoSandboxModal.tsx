import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Building2, 
  Flame, 
  Shuffle, 
  MapPin, 
  CreditCard, 
  Award, 
  Users, 
  ChevronRight, 
  X, 
  ShieldCheck,
  Zap,
  HelpCircle,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { DEMO_PRESENTATION_SCENARIOS } from '../../data/mockNotificationsData';
import { DemoPresentationScenario } from '../../types/notifications';

interface DemoSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: 'jardins_prime' | 'rede_alpha' | 'sky_horizon') => void;
  onResetTestData: () => void;
  onInjectLiveEvent: (eventType: 'HOT_LEAD' | 'CREDIT_APPROVED' | 'DEAL_CLOSED' | 'STAND_GPS') => void;
}

export const DemoSandboxModal: React.FC<DemoSandboxModalProps> = ({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
  onResetTestData,
  onInjectLiveEvent
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'cenarios' | 'gatilhos' | 'pitch_guide'>('cenarios');
  const [lastInjectedMessage, setLastInjectedMessage] = useState<string | null>(null);

  const handleTrigger = (type: 'HOT_LEAD' | 'CREDIT_APPROVED' | 'DEAL_CLOSED' | 'STAND_GPS', label: string) => {
    onInjectLiveEvent(type);
    setLastInjectedMessage(`✅ Evento disparado: ${label}! Verifique a notificação push e o módulo correspondente.`);
    setTimeout(() => {
      setLastInjectedMessage(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-sandbox-title"
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ambiente de Apresentação & Testes do Sistema</span>
            </div>
            <h2 id="demo-sandbox-title" className="text-lg sm:text-2xl font-black font-heading">
              Central do Apresentador & Pitch Interativo
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Alterne cenários pré-configurados, injete leads e contratos ao vivo para impressionar clientes e parceiros, ou resete os dados com um clique.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner if injected */}
        {lastInjectedMessage && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{lastInjectedMessage}</span>
          </div>
        )}

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cenarios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cenarios'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Cenários de Apresentação</span>
          </button>

          <button
            onClick={() => setActiveTab('gatilhos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gatilhos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Gatilhos ao Vivo (Injetar Eventos)</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch_guide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pitch_guide'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Roteiro de Pitch (10 Minutos)</span>
          </button>

          <div className="ml-auto shrink-0">
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja restaurar todos os dados simulados para o estado padrão de demonstração?')) {
                  onResetTestData();
                  setLastInjectedMessage('✨ Todos os dados foram resetados com sucesso para o estado original de apresentação!');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Restaura banco de dados em memória para demonstração"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar Dados de Teste</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: CENÁRIOS DE DEMONSTRAÇÃO */}
          {activeTab === 'cenarios' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Selecione o perfil do cliente que você está atendendo agora para carregar as métricas e destaques adequados:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_PRESENTATION_SCENARIOS.map((sc) => {
                  const isSelected = activeScenarioId === sc.id;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => onSelectScenario(sc.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {sc.badge}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {sc.name}
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {sc.description}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">VGV Médio:</span>
                          <strong className="text-slate-800 font-mono">{sc.vgv}</strong>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Equipe:</span>
                          <strong className="text-slate-800">{sc.brokersCount} corretores</strong>
                        </div>

                        <button
                          type="button"
                          className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Cenário Ativo' : 'Carregar Este Cenário'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GATILHOS AO VIVO */}
          {activeTab === 'gatilhos' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Dispare eventos simulados em tempo real durante a demonstração para mostrar ao cliente as notificações push e automações funcionando:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="p-2 rounded-xl bg-rose-600 text-white inline-block">
                      <Flame className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">1. Simular Lead Quente na Roleta</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Injeta um lead de alto valor (Dr. Roberto Silveira - Cobertura R$ 12.5M) com disparo imediato de Web Push e contagem regressiva de SLA de 15 minutos.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrigger('HOT_LEAD', 'Lead Quente Cobertura R$ 12.5M')}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Injetar Lead ao Vivo</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="p-2 rounded-xl bg-emerald-600 text-white inline-block">
                      <CreditCard className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">2. Simular Fechamento & Split Pix</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Simula liquidação imediata de contrato de R$ 3.4M com comissão de R$ 204k dividida automaticamente entre Imobiliária, Corretor e Gerente via Pix.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrigger('DEAL_CLOSED', 'Venda Concluída R$ 3.4M')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simular Venda & Split Pix</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="p-2 rounded-xl bg-blue-600 text-white inline-block">
                      <FileCheck className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">3. Aprovação de Crédito Caixa (CCA)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Gera aprovação bancária em menos de 24h na esteira de Correspondente Bancário, notificando o corretor e gerando receita de 1.2% para a imobiliária.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrigger('CREDIT_APPROVED', 'Crédito Caixa R$ 1.8M Aprovado')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Aprovar Financiamento</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="p-2 rounded-xl bg-indigo-600 text-white inline-block">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">4. Check-in Stand GPS 10m</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Simula satélite validando a chegada do corretor dentro do raio estrito de 10 metros para o sorteio diário das 08:30 no plantão do empreendimento.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrigger('STAND_GPS', 'Check-in Satélite 4.8m')}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simular Check-in Satélite</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROTEIRO DE PITCH EM 10 MINUTOS */}
          {activeTab === 'pitch_guide' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Siga este roteiro comprovado para fechar contratos com diretores de imobiliárias e construtoras em 10 minutos:
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '1',
                    time: '0 a 2 min',
                    title: 'Dor do Diretor: Leads sem resposta rápida & Favorecimento na Roleta',
                    pitch: 'Mostre a Roleta Inteligente e os Plantões com GPS 10m. Enfatize que nenhum lead fica mais de 15 minutos sem contato e que o sorteio é 100% auditável por satélite.',
                    tabShortcut: 'roleta'
                  },
                  {
                    step: '2',
                    time: '2 a 4 min',
                    title: 'Atendimento & Funil WhatsApp Omnichannel',
                    pitch: 'Abra a tela do Whaticket e o Funil Kanban. Mostre mensagens com botões, disparo de fotos de imóveis e anotações internas (whisper) entre o gerente e o corretor.',
                    tabShortcut: 'kanban'
                  },
                  {
                    step: '3',
                    time: '4 a 6 min',
                    title: 'Fintech de Comissões, Repasses Pix & DRE Executiva',
                    pitch: 'Vá ao Fintech Split e ao Painel do Diretor. Mostre a divisão automática do valor bruto, cálculo de impostos, DRE em tempo real e comprovantes Pix emitidos na hora.',
                    tabShortcut: 'fintech_split'
                  },
                  {
                    step: '4',
                    time: '6 a 8 min',
                    title: 'Capacitação: Universidade Corporativa EAD Gamificada',
                    pitch: 'Mostre os cursos da plataforma e a facilidade de subir treinamentos da própria imobiliária, além dos quizzes avaliativos e certificados com autenticidade digital.',
                    tabShortcut: 'corporate_academy'
                  },
                  {
                    step: '5',
                    time: '8 a 10 min',
                    title: 'Segurança, White-Label & Super Admin SaaS',
                    pitch: 'Finalize demonstrando a personalização de cores, logotipo da imobiliária e o isolamento multi-tenant garantido pelo Super Admin.',
                    tabShortcut: 'super_admin'
                  }
                ].map(item => (
                  <div key={item.step} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.pitch}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ambiente seguro em memória · Dados de produção intocados</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Fechar Central
          </button>
        </div>

      </div>
    </div>
  );
};

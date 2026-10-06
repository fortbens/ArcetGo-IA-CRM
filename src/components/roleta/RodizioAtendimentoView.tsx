import React, { useState } from 'react';
import { 
  Shuffle, 
  Plus, 
  Settings2, 
  Edit3, 
  Trash2, 
  Users, 
  Play, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight,
  MapPin,
  Compass,
  Clock,
  Timer,
  ShieldCheck,
  Settings,
  Building,
  Target,
  Coffee,
  Check,
  X
} from 'lucide-react';
import { RoletaQueue, Lead, UserProfile, StandVendas, RoletaRuleConfig } from '../../types/crm';
import { LeadRouletteModal } from './LeadRouletteModal';
import { StandVendasGpsView } from './StandVendasGpsView';
import { RotationRulesModal } from './RotationRulesModal';
import { INITIAL_STANDS_VENDAS, DEFAULT_ROLETA_RULES } from '../../data/mockStandsData';

interface RodizioAtendimentoViewProps {
  queues: RoletaQueue[];
  leads: Lead[];
  currentUser?: UserProfile;
  onUpdateQueues: (queues: RoletaQueue[]) => void;
  onDistributeLead: (queueId: string, leadId: string, brokerName: string) => void;
}

export const RodizioAtendimentoView: React.FC<RodizioAtendimentoViewProps> = ({
  queues,
  leads,
  currentUser,
  onUpdateQueues,
  onDistributeLead,
}) => {
  // Main Navigation Tabs
  const [activeMainTab, setActiveMainTab] = useState<'stands_gps' | 'roletas_online' | 'regras_gerais'>('stands_gps');

  // Stands & Rules State
  const [stands, setStands] = useState<StandVendas[]>(INITIAL_STANDS_VENDAS);
  const [rules, setRules] = useState<RoletaRuleConfig>(DEFAULT_ROLETA_RULES);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Queue Modal State
  const [activeQueueForModal, setActiveQueueForModal] = useState<RoletaQueue | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'roleta' | 'membros' | 'editar' | 'distribuir' | 'historico'>('roleta');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQueueName, setNewQueueName] = useState('');
  const [newQueueStrategy, setNewQueueStrategy] = useState<'ALEATORIO' | 'ROUND_ROBIN'>('ALEATORIO');

  const openQueueModal = (queue: RoletaQueue, tab: 'roleta' | 'membros' | 'editar' | 'distribuir' | 'historico' = 'roleta') => {
    setActiveQueueForModal(queue);
    setModalInitialTab(tab);
  };

  const pendingLeads = leads.filter(l => l.stage === 'NOVO_LEAD' || l.stage === 'PRIMEIRO_CONTATO');

  const handleCreateQueue = () => {
    if (!newQueueName.trim()) return;
    const newQ: RoletaQueue = {
      id: `queue_${Date.now()}`,
      name: newQueueName,
      description: 'Fila personalizada de atendimento e plantão comercial',
      active: true,
      strategy: newQueueStrategy,
      mode: 'Manual',
      scope: 'Todos',
      totalDistributedCount: 0,
      members: [
        {
          userId: 'u_default_1',
          name: 'Juliana',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          color: '#2563EB',
          active: true,
          weight: 1,
          assignedTodayCount: 0,
        },
        {
          userId: 'u_default_2',
          name: 'Roberto',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          color: '#10B981',
          active: true,
          weight: 1,
          assignedTodayCount: 0,
        },
        {
          userId: 'u_default_3',
          name: 'Fernanda',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          color: '#F59E0B',
          active: true,
          weight: 1,
          assignedTodayCount: 0,
        }
      ],
      history: []
    };
    onUpdateQueues([...queues, newQ]);
    setNewQueueName('');
    setShowCreateModal(false);
  };

  const handleDeleteQueue = (id: string) => {
    if (queues.length <= 1) return;
    onUpdateQueues(queues.filter(q => q.id !== id));
  };

  const totalValidStandBrokers = stands.reduce(
    (acc, s) => acc + s.attendanceList.filter(b => b.gpsStatus === 'VALIDADO_NO_RAIO').length,
    0
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Title & Top Global Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Rodízio & Plantão de Atendimento
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Distribuição balanceada de leads online e sorteio presencial para Stands de Vendas com validação no local
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all"
          >
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>Regras do Rodízio</span>
          </button>

          {activeMainTab === 'roletas_online' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Fila Online</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveMainTab('stands_gps')}
          className={`shrink-0 md:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            activeMainTab === 'stands_gps'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">Plantões de Stand Presencial</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 shrink-0">
            {stands.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('roletas_online')}
          className={`shrink-0 md:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            activeMainTab === 'roletas_online'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shuffle className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">Roletas de Leads Online</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 shrink-0">
            {queues.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('regras_gerais')}
          className={`shrink-0 md:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            activeMainTab === 'regras_gerais'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="truncate">Regras de Horário & Ausência</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 shrink-0 font-mono">
            {rules.dailyDrawTime}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PLANTÕES DE STANDS DE VENDAS COM GPS 10M */}
      {/* ======================================================== */}
      {activeMainTab === 'stands_gps' && (
        <StandVendasGpsView
          stands={stands}
          rules={rules}
          onUpdateStands={setStands}
          currentUser={currentUser}
          onOpenRulesModal={() => setShowRulesModal(true)}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 2: ROLETAS DE LEADS ONLINE */}
      {/* ======================================================== */}
      {activeMainTab === 'roletas_online' && (
        <div className="space-y-6">
          {/* SLA & Roleta Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-medium text-slate-500">Filas de Atendimento Ativas</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{queues.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">
                Distribuição 100% calibrada
              </span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-medium text-slate-500">Leads Distribuídos Hoje</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {queues.reduce((acc, q) => acc + q.totalDistributedCount, 0)}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold mt-0.5 inline-block">
                Tempo médio de 1º contato: 3m 40s
              </span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-medium text-slate-500">Aguardando Roleta</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{pendingLeads.length}</div>
              <span className="text-[11px] text-amber-600 font-semibold mt-0.5 inline-block">
                Prontos para sorteio imediato
              </span>
            </div>
          </div>

          {/* Queues List matching Screenshot 2 cards */}
          <div className="space-y-4">
            {queues.map((queue) => {
              return (
                <div
                  key={queue.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Shuffle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{queue.name}</h3>
                        <p className="text-xs text-slate-500">{queue.scope}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                      {queue.mode}
                    </span>
                  </div>

                  {/* Card Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 my-4">
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">Corretores</span>
                      <span className="text-lg font-bold text-slate-900 tabular-nums">
                        {queue.members.length}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">Distribuídos</span>
                      <span className="text-lg font-bold text-slate-900 tabular-nums">
                        {queue.totalDistributedCount}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                      <span className="text-[11px] font-medium text-slate-500 block">Estratégia</span>
                      <span className="text-xs font-bold text-slate-900 block mt-1">
                        {queue.strategy === 'ALEATORIO' ? 'Aleatório' : 'Round-Robin'}
                      </span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => openQueueModal(queue, 'roleta')}
                      className="flex-1 min-w-[140px] py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Girar Roleta</span>
                    </button>

                    <button
                      onClick={() => openQueueModal(queue, 'membros')}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Gerenciar Participantes da Roleta"
                    >
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Participantes ({queue.members.length})</span>
                    </button>

                    <button
                      onClick={() => openQueueModal(queue, 'editar')}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Editar Regras da Roleta"
                    >
                      <Edit3 className="w-4 h-4 text-slate-600" />
                    </button>

                    <button
                      onClick={() => handleDeleteQueue(queue.id)}
                      disabled={queues.length <= 1}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 transition-colors ${
                        queues.length <= 1
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-rose-500 hover:bg-rose-50 cursor-pointer'
                      }`}
                      title="Excluir Roleta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: REGRAS DO RODÍZIO & AUSÊNCIA */}
      {/* ======================================================== */}
      {activeMainTab === 'regras_gerais' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span>Regras Gerais de Horário de Sorteio, Ausência e GPS</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Políticas operacionais da imobiliária aplicadas aos stands físicos e roleta digital
              </p>
            </div>

            <button
              onClick={() => setShowRulesModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar Parâmetros</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Horário de Sorteio</h3>
              <p className="text-2xl font-black text-indigo-600 font-mono">{rules.dailyDrawTime}</p>
              <p className="text-xs text-slate-600">
                Tolerância máxima de chegada: <strong>{rules.lateArrivalToleranceMinutes} minutos</strong>.
                Chegadas posteriores entram automaticamente no final da fila.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Tempo de Ausência</h3>
              <p className="text-2xl font-black text-amber-600 font-mono">{rules.maxAbsenceMinutes} min</p>
              <p className="text-xs text-slate-600">
                Penalidade ao estourar: <strong>{rules.absencePenalty === 'FINAL_DA_FILA' ? 'Mover para o Final da Fila' : 'Pausar Corretor'}</strong>.
                Cronômetro regressivo visível em tempo real.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Localização do Stand</h3>
              <p className="text-2xl font-black text-emerald-600 font-mono">Presencial</p>
              <p className="text-xs text-slate-600">
                Auditoria de presença no local. Bloqueio automático de sorteio se o corretor estiver fora do stand físico.
              </p>
            </div>
          </div>

          {/* Turnos e Escalas do Dia */}
          <div className="pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
              Turnos e Horários de Abertura Programados
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rules.shifts.map((shift) => (
                <div key={shift.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{shift.name}</div>
                  <div className="text-slate-500">
                    Jornada: <strong>{shift.startTime} às {shift.endTime}</strong>
                  </div>
                  <div className="text-indigo-600 font-bold">
                    Sorteio programado: {shift.drawTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal to Create New Queue */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Criar Nova Fila de Atendimento</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure uma nova roleta com distribuição por horário, dia da semana ou canal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                title="Fechar (Esc)"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Fila</label>
                <input
                  type="text"
                  placeholder="Ex: Sexta-Feira, Plantão Alto Padrão, Fim de Semana"
                  value={newQueueName}
                  onChange={(e) => setNewQueueName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estratégia de Sorteio</label>
                <select
                  value={newQueueStrategy}
                  onChange={(e) => setNewQueueStrategy(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  <option value="ALEATORIO">Aleatório Ponderado</option>
                  <option value="ROUND_ROBIN">Round-Robin Sequencial Rigoroso</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateQueue}
                disabled={!newQueueName.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                Criar Fila
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Roulette Wheel Modal for Online Leads */}
      {activeQueueForModal && (
        <LeadRouletteModal
          queue={activeQueueForModal}
          initialTab={modalInitialTab}
          onClose={() => setActiveQueueForModal(null)}
          pendingLeads={pendingLeads}
          onUpdateQueue={(updatedQueue) => {
            onUpdateQueues(queues.map(q => q.id === updatedQueue.id ? updatedQueue : q));
            setActiveQueueForModal(updatedQueue);
          }}
          onDistributeLead={(queueId, leadId, brokerName) => {
            onDistributeLead(queueId, leadId, brokerName);
            // Refresh local queue state count
            onUpdateQueues(
              queues.map(q => q.id === queueId ? {
                ...q,
                totalDistributedCount: q.totalDistributedCount + 1,
                history: [
                  {
                    id: `h_${Date.now()}`,
                    leadName: leads.find(l => l.id === leadId)?.name || 'Novo Lead',
                    leadPhone: leads.find(l => l.id === leadId)?.phone || '',
                    assignedToBrokerName: brokerName,
                    timestamp: 'Agora'
                  },
                  ...q.history
                ]
              } : q)
            );
          }}
        />
      )}

      {/* Rotation Rules Modal */}
      {showRulesModal && (
        <RotationRulesModal
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
          rules={rules}
          onSaveRules={(newRules) => setRules(newRules)}
        />
      )}
    </div>
  );
};

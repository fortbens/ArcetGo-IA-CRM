import React, { useState } from 'react';
import { 
  Plus, 
  ArrowRight, 
  Calendar, 
  Phone, 
  DollarSign, 
  AlertCircle, 
  X, 
  CheckCircle,
  Building,
  GripVertical,
  Clock,
  MessageSquare,
  Radar
} from 'lucide-react';
import { Lead, LeadFunnelStage, RealEstateProperty } from '../../types/crm';
import { LeadPropertyRadarModal } from '../leads/LeadPropertyRadarModal';

interface KanbanBoardProps {
  leads: Lead[];
  properties?: RealEstateProperty[];
  onChangeStage: (leadId: string, stage: LeadFunnelStage, lossReason?: string) => void;
  onOpenLead: (lead: Lead) => void;
  onSelectPropertyForLead?: (leadId: string, property: RealEstateProperty) => void;
  onScheduleVisit?: (lead: Lead, property: RealEstateProperty) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  properties = [],
  onChangeStage,
  onOpenLead,
  onSelectPropertyForLead,
  onScheduleVisit,
}) => {
  const [lossModalLeadId, setLossModalLeadId] = useState<string | null>(null);
  const [lossReasonText, setLossReasonText] = useState('');
  const [leadForRadar, setLeadForRadar] = useState<Lead | null>(null);
  
  // Drag & drop state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadFunnelStage | null>(null);

  const columns: { stage: LeadFunnelStage; label: string; color: string; badgeColor: string }[] = [
    { stage: 'NOVO_LEAD', label: 'Novo Lead', color: 'border-t-blue-500', badgeColor: 'bg-blue-100 text-blue-700' },
    { stage: 'PRIMEIRO_CONTATO', label: '1º Contato', color: 'border-t-purple-500', badgeColor: 'bg-purple-100 text-purple-700' },
    { stage: 'QUALIFICACAO', label: 'Qualificação', color: 'border-t-indigo-500', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { stage: 'VISITA_AGENDADA', label: 'Visita Agendada', color: 'border-t-amber-500', badgeColor: 'bg-amber-100 text-amber-700' },
    { stage: 'VISITA_REALIZADA', label: 'Visita Realizada', color: 'border-t-cyan-500', badgeColor: 'bg-cyan-100 text-cyan-700' },
    { stage: 'PROPOSTA_ENVIADA', label: 'Proposta Enviada', color: 'border-t-orange-500', badgeColor: 'bg-orange-100 text-orange-700' },
    { stage: 'FECHAMENTO_GANHO', label: 'Fechado Ganho', color: 'border-t-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { stage: 'FECHAMENTO_PERDIDO', label: 'Perdido', color: 'border-t-rose-500', badgeColor: 'bg-rose-100 text-rose-700' },
  ];

  const handleConfirmLoss = () => {
    if (!lossModalLeadId || !lossReasonText.trim()) return;
    onChangeStage(lossModalLeadId, 'FECHAMENTO_PERDIDO', lossReasonText);
    setLossModalLeadId(null);
    setLossReasonText('');
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, stage: LeadFunnelStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeaveColumn = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverStage(null);
    }
  };

  const handleDropColumn = (e: React.DragEvent, stage: LeadFunnelStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    setDragOverStage(null);
    setDraggedLeadId(null);

    if (!leadId) return;

    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead || targetLead.stage === stage) return;

    if (stage === 'FECHAMENTO_PERDIDO') {
      setLossModalLeadId(leadId);
    } else {
      onChangeStage(leadId, stage);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 h-[calc(100vh-4rem-3.5rem)] lg:h-[calc(100vh-4rem)] flex flex-col space-y-3 sm:space-y-4 select-none">
      {/* Kanban Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Funil Comercial de Vendas
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Clique no card para abrir o cliente e seu sistema de follow-up, ou arraste entre as etapas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            Total no Pipeline: <strong className="text-blue-600">{leads.length} Clientes</strong>
          </div>
        </div>
      </div>

      {/* Columns Container with horizontal scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-3 pb-3">
        {columns.map((col) => {
          const colLeads = leads.filter(l => l.stage === col.stage);
          const isOver = dragOverStage === col.stage;

          return (
            <div
              key={col.stage}
              onDragOver={(e) => handleDragOverColumn(e, col.stage)}
              onDragLeave={handleDragLeaveColumn}
              onDrop={(e) => handleDropColumn(e, col.stage)}
              className={`w-72 shrink-0 rounded-2xl border flex flex-col max-h-full transition-all duration-150 ${
                isOver 
                  ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/40 shadow-md' 
                  : 'bg-slate-100/90 border-slate-200/90'
              }`}
            >
              {/* Column Header */}
              <div className={`p-3 border-t-4 ${col.color} bg-white rounded-t-2xl border-b border-slate-200/80 flex items-center justify-between shadow-2xs`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate">{col.label}</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${col.badgeColor}`}>
                  {colLeads.length}
                </span>
              </div>

              {/* Column Cards Feed */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {/* Drop placeholder indicator when dragging over this column */}
                {isOver && draggedLeadId && (
                  <div className="p-3 border-2 border-dashed border-blue-400 rounded-xl bg-blue-100/50 text-center text-xs font-semibold text-blue-700 animate-pulse">
                    Soltar cliente aqui na fase {col.label}
                  </div>
                )}

                {colLeads.length === 0 && !isOver ? (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    Sem leads nesta fase
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const isBeingDragged = draggedLeadId === lead.id;
                    const followUps = lead.followUps || [];
                    const pendingFollowUps = followUps.filter(f => f.status === 'PENDENTE' || f.status === 'ATRASADO');
                    const overdueFollowUp = pendingFollowUps.find(f => {
                      const target = new Date(f.scheduledAt);
                      const now = new Date();
                      return target < now;
                    });
                    const todayFollowUp = pendingFollowUps.find(f => {
                      const target = new Date(f.scheduledAt).toISOString().split('T')[0];
                      const today = new Date().toISOString().split('T')[0];
                      return target === today;
                    });

                    return (
                      <div
                        key={lead.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onOpenLead(lead)}
                        className={`p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing space-y-2 relative group ${
                          isBeingDragged ? 'opacity-40 scale-95 border-dashed border-2 border-blue-400' : ''
                        }`}
                      >
                        {/* Drag Handle & Client Header */}
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-900 leading-tight truncate hover:text-blue-600 transition-colors">
                              {lead.name}
                            </span>
                          </div>
                          <span className="text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                            {lead.interestType}
                          </span>
                        </div>

                        {/* Property of interest */}
                        {lead.propertyOfInterestTitle && (
                          <div className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{lead.propertyOfInterestTitle}</span>
                          </div>
                        )}

                        {/* Budget */}
                        <div className="text-[11px] text-slate-600 font-mono">
                          R$ {lead.budgetMin.toLocaleString('pt-BR')} ~ {lead.budgetMax.toLocaleString('pt-BR')}
                        </div>

                        {/* Follow-up status pill & Custody Badge */}
                        <div className="flex flex-wrap items-center gap-1">
                          {overdueFollowUp ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <Clock className="w-3 h-3 text-rose-600 animate-pulse shrink-0" />
                              <span className="truncate">Follow-up atrasado!</span>
                            </div>
                          ) : todayFollowUp ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                              <span className="truncate">Follow-up hoje às {todayFollowUp.timeStr || '14:00'}</span>
                            </div>
                          ) : pendingFollowUps.length > 0 ? (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
                              <span className="truncate">Follow-up: {pendingFollowUps[0].scheduledAt.split('T')[0]}</span>
                            </div>
                          ) : null}

                          {(col.stage === 'PROPOSTA_ENVIADA' || col.stage === 'FECHAMENTO_GANHO') && (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1"
                              title="Pasta de Custódia de Documentos Habilitada"
                            >
                              🛡️ Custódia
                            </span>
                          )}
                        </div>

                        {/* Broker info & Last message */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                          <span className="truncate max-w-[130px] font-medium text-slate-700">
                            {lead.assignedBrokerName}
                          </span>
                          <span>{lead.lastMessageTime}</span>
                        </div>

                        {/* Quick stage mover & Card Actions */}
                        <div className="flex items-center justify-between pt-1 gap-1 border-t border-slate-50">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenLead(lead);
                              }}
                              className="text-[10px] text-slate-500 hover:text-blue-600 font-semibold"
                            >
                              Ficha
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLeadForRadar(lead);
                              }}
                              className="text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 border border-indigo-200 transition-colors"
                              title="Radar de Imóveis para este Lead"
                            >
                              <Radar className="w-2.5 h-2.5 text-indigo-600" />
                              <span>Radar</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {col.stage !== 'FECHAMENTO_PERDIDO' && col.stage !== 'FECHAMENTO_GANHO' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLossModalLeadId(lead.id);
                                  }}
                                  className="text-[10px] text-rose-600 hover:underline font-semibold"
                                >
                                  Perdido
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextIndex = columns.findIndex(c => c.stage === col.stage) + 1;
                                    if (nextIndex < columns.length - 1) {
                                      onChangeStage(lead.id, columns[nextIndex].stage);
                                    }
                                  }}
                                  className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                                >
                                  <span>Avançar</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Loss Reason Modal */}
      {lossModalLeadId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Motivo Obrigatório de Perda do Lead
              </h3>
              <button
                onClick={() => setLossModalLeadId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Para auditoria de BI e contorno de objeções, informe por que a negociação não foi concluída:
            </p>

            <textarea
              rows={3}
              placeholder="Ex: Comprou direto com construtora concorrente; reprovação cadastral no banco; preço acima da avaliação..."
              value={lossReasonText}
              onChange={(e) => setLossReasonText(e.target.value)}
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-hidden"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setLossModalLeadId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLoss}
                disabled={!lossReasonText.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs disabled:opacity-50"
              >
                Confirmar Perda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Property Radar Modal */}
      {leadForRadar && (
        <LeadPropertyRadarModal
          isOpen={!!leadForRadar}
          onClose={() => setLeadForRadar(null)}
          lead={leadForRadar}
          properties={properties}
          onSelectPropertyForLead={onSelectPropertyForLead}
          onScheduleVisit={onScheduleVisit}
        />
      )}
    </div>
  );
};

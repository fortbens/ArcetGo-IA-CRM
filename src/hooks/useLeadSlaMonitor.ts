import { useState, useEffect, useMemo, useCallback } from 'react';
import { Lead } from '../types/crm';

export interface LeadSlaStatus {
  leadId: string;
  isBreached: boolean;
  minutesWaiting: number;
  formattedTime: string;
  createdAtDate: Date;
}

export interface UseLeadSlaMonitorResult {
  slaBreachedLeads: Lead[];
  slaWarningCount: number;
  isLeadSlaBreached: (leadId: string) => boolean;
  getLeadSlaInfo: (lead: Lead) => LeadSlaStatus | null;
  thresholdMinutes: number;
}

/**
 * Hook de monitoramento em tempo real de SLA para leads com status 'NOVO_LEAD'.
 * Dispara aviso e status de alerta (badge amarelo) caso o lead permaneça mais de 30 minutos sem interação.
 */
export function useLeadSlaMonitor(
  leads: Lead[],
  thresholdMinutes: number = 30,
  onBreachDetected?: (breachedLeads: Lead[]) => void
): UseLeadSlaMonitorResult {
  const [now, setNow] = useState<Date>(() => new Date());

  // Atualiza o relógio interno a cada 30 segundos para recalcular os SLAs
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Helper para calcular o tempo decorrido
  const getLeadSlaInfo = useCallback((lead: Lead): LeadSlaStatus | null => {
    if (lead.stage !== 'NOVO_LEAD') {
      return null;
    }

    // Identificar a data de criação ou última interação do lead
    let refTime: number = Date.now();
    try {
      if (lead.createdAt) {
        const parsed = new Date(lead.createdAt).getTime();
        if (!isNaN(parsed)) {
          refTime = parsed;
        }
      }
    } catch {
      refTime = Date.now();
    }

    // Se o lead já tiver mensagens enviadas por corretores ou interação humana na timeline, verificar a mais recente
    if (lead.timeline && lead.timeline.length > 0) {
      const humanInteractions = lead.timeline.filter(t => 
        t.type === 'CALL' || t.type === 'WHATSAPP_MSG' || t.type === 'VISIT' || t.type === 'PROPOSAL'
      );
      if (humanInteractions.length > 0) {
        // Já houve interação ativa
        return {
          leadId: lead.id,
          isBreached: false,
          minutesWaiting: 0,
          formattedTime: 'Atendido',
          createdAtDate: new Date(refTime)
        };
      }
    }

    const elapsedMs = now.getTime() - refTime;
    const minutesWaiting = Math.max(0, Math.floor(elapsedMs / (1000 * 60)));
    const isBreached = minutesWaiting >= thresholdMinutes;

    let formattedTime = '';
    if (minutesWaiting < 60) {
      formattedTime = `${minutesWaiting}m`;
    } else {
      const hours = Math.floor(minutesWaiting / 60);
      const remainingMinutes = minutesWaiting % 60;
      formattedTime = `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`.trim();
    }

    return {
      leadId: lead.id,
      isBreached,
      minutesWaiting,
      formattedTime,
      createdAtDate: new Date(refTime)
    };
  }, [now, thresholdMinutes]);

  // Lista de leads que ultrapassaram o SLA de 30 minutos
  const slaBreachedLeads = useMemo(() => {
    return leads.filter(lead => {
      const info = getLeadSlaInfo(lead);
      return info?.isBreached;
    });
  }, [leads, getLeadSlaInfo]);

  // Disparar callback opcional quando há violação
  useEffect(() => {
    if (slaBreachedLeads.length > 0 && onBreachDetected) {
      onBreachDetected(slaBreachedLeads);
    }
  }, [slaBreachedLeads, onBreachDetected]);

  const isLeadSlaBreached = useCallback((leadId: string): boolean => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return false;
    const info = getLeadSlaInfo(target);
    return !!info?.isBreached;
  }, [leads, getLeadSlaInfo]);

  return {
    slaBreachedLeads,
    slaWarningCount: slaBreachedLeads.length,
    isLeadSlaBreached,
    getLeadSlaInfo,
    thresholdMinutes
  };
}

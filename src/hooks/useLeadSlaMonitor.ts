import { useState, useEffect, useMemo, useCallback } from 'react';
import { Lead } from '../types/crm';

export interface LeadSlaStatus {
  isBreached: boolean;
  elapsedMinutes: number;
  timeFormatted: string;
  stage: string;
  hasInteractions: boolean;
  needsAttention: boolean;
}

const SLA_THRESHOLD_MINUTES = 30;

/**
 * Calcula os minutos decorridos desde a criação ou último contato do lead.
 */
export function calculateMinutesElapsed(lead: Lead, now: Date = new Date()): number {
  let referenceTime: number | null = null;

  // 1. Tentar pegar o createdAt
  if (lead.createdAt) {
    const parsed = new Date(lead.createdAt).getTime();
    if (!isNaN(parsed)) {
      referenceTime = parsed;
    }
  }

  // 2. Se houver interações na timeline, considerar a mais recente
  if (lead.timeline && lead.timeline.length > 0) {
    const lastInteraction = lead.timeline[lead.timeline.length - 1];
    if (lastInteraction.timestamp) {
      const parsedInteraction = new Date(lastInteraction.timestamp).getTime();
      if (!isNaN(parsedInteraction)) {
        referenceTime = Math.max(referenceTime || 0, parsedInteraction);
      }
    }
  }

  // 3. Fallback inteligente para lastMessageTime no formato de hora simples (ex: "14:20" ou "Ontem")
  if (!referenceTime && lead.lastMessageTime) {
    const today = new Date();
    const match = lead.lastMessageTime.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const msgDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
      referenceTime = msgDate.getTime();
    }
  }

  // Se mesmo assim não houver timestamp confiável, usa 35 minutos como fallback para sinalizar novo lead que aguarda contato
  if (!referenceTime) {
    return 35;
  }

  const diffMs = now.getTime() - referenceTime;
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}

/**
 * Formata os minutos de forma amigável (ex: "32 min", "1h 15m")
 */
export function formatSlaTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Hook de monitoramento de SLA para leads com status 'NOVO_LEAD'
 * Dispara notificação visual (badge amarelo) caso o lead permaneça mais de 30 minutos sem interação.
 */
export function useLeadSlaMonitor(leads: Lead[]) {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Atualizar a cada 30 segundos para recalcular o SLA em tempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const checkLeadSla = useCallback(
    (lead: Lead): LeadSlaStatus => {
      if (lead.stage !== 'NOVO_LEAD') {
        return {
          isBreached: false,
          elapsedMinutes: 0,
          timeFormatted: '',
          stage: lead.stage,
          hasInteractions: false,
          needsAttention: false
        };
      }

      const elapsed = calculateMinutesElapsed(lead, currentTime);
      const hasInteractions = !!(lead.timeline && lead.timeline.length > 0);
      const isBreached = elapsed >= SLA_THRESHOLD_MINUTES && !hasInteractions;

      return {
        isBreached,
        elapsedMinutes: elapsed,
        timeFormatted: formatSlaTime(elapsed),
        stage: lead.stage,
        hasInteractions,
        needsAttention: isBreached
      };
    },
    [currentTime]
  );

  const slaBreachedLeads = useMemo(() => {
    return leads.filter(l => {
      if (l.stage !== 'NOVO_LEAD') return false;
      const status = checkLeadSla(l);
      return status.isBreached;
    });
  }, [leads, checkLeadSla]);

  const breachedCount = slaBreachedLeads.length;

  return {
    checkLeadSla,
    slaBreachedLeads,
    breachedCount,
    hasAnySlaBreach: breachedCount > 0,
    slaThresholdMinutes: SLA_THRESHOLD_MINUTES
  };
}

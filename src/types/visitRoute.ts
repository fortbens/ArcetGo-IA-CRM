export type VisitInterestLevel = 
  | 'MUITO_QUENTE' // Proposta Iminente
  | 'INTERESSADO'  // Avaliando / 2ª Visita
  | 'MORNO'        // Comparando opções
  | 'FRIO_RECUSADO'; // Descartado pelo cliente

export interface VisitPropertyStop {
  id: string;
  order: number; // 1, 2, 3...
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyAddress: string;
  neighborhood: string;
  price: number;
  type: 'VENDA' | 'LOCACAO';
  coverImage: string;
  estimatedArrival: string; // e.g. "14:30"
  estimatedDurationMinutes: number; // e.g. 35
  keyLocation: 'IMOBILIARIA_PORTARIA' | 'ZELADOR_CHAVE' | 'PROPRIETARIO_PRESENTE' | 'FECHADURA_DIGITAL_SENHA';
  keyNotes?: string;
  status: 'AGENDADA' | 'EM_DESLOCAMENTO' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  
  // GPS Check-in & Check-out
  checkInTime?: string;
  checkInGpsAccuracyMeters?: number;
  checkInLat?: number;
  checkInLng?: number;
  checkOutTime?: string;

  // Sensorial Checklist & Impressions
  checklist?: {
    illuminationScore: number; // 1 to 5
    ventilationScore: number;  // 1 to 5
    conservationState: 'IMPECAVEL' | 'BOM' | 'PRECISA_REFORMA' | 'CRITICO';
    noiseLevel: 'MUITO_SILENCIOSO' | 'MODERADO' | 'BARULHENTO';
    clientReaction: VisitInterestLevel;
    clientComments: string;
    identifiedObjections: string[];
    suggestedOfferAmount?: number;
    photosTakenCount?: number;
  };
}

export type VisitRouteStatus = 
  | 'PROGRAMADA'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA';

export interface VisitRoute {
  id: string;
  routeCode: string; // e.g. "ROT-2026-042"
  title: string;
  scheduledDate: string; // "2026-09-28"
  startTime: string; // "14:00"
  endTimeEstimated: string; // "17:30"
  status: VisitRouteStatus;
  
  // Lead / Client
  leadId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientProfileNotes?: string;
  companionsCount?: number; // e.g. 2 (casal)

  // Assigned Broker & Escort
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerAvatar?: string;
  vehicleType?: 'CARRO_IMOBILIARIA' | 'CARRO_CORRETOR' | 'UBER_VOUCHER' | 'A_PE';

  stops: VisitPropertyStop[];
  totalDistanceKm: number;
  totalPropertiesCount: number;

  notes?: string;
  postVisitDossierSentWhatsApp: boolean;
  createdAt: string;
}

export type VisitStopStatus = 
  | 'AGENDADA'
  | 'A_CAMINHO'
  | 'EM_VISITA'
  | 'REALIZADA'
  | 'PULADA'
  | 'CANCELADA';

export type ClientInterestLevel = 
  | 'MUITO_ALTO' // Quer fazer proposta
  | 'ALTO'       // Gostou muito, vai pensar/mostrar cônjuge
  | 'MEDIO'      // Gostou mas tem dúvidas
  | 'BAIXO'      // Não atendeu perfil
  | 'DESCARTADO';// Rejeitou completamente

export interface VisitFeedback {
  interestLevel: ClientInterestLevel;
  ratingStars: number; // 1 to 5
  verbalOfferAmount?: number;
  objections: string[]; // ex: 'Preço acima do orçamento', 'Falta garagem', 'Pouca luminosidade', 'Condomínio alto', 'Necessita reforma'
  clientImpressionNotes: string;
  nextStep: 'ENVIAR_PROPOSTA' | 'AGENDAR_SEGUNDA_VISITA' | 'BUSCAR_OUTRAS_OPCOES' | 'ARQUIVAR';
  clientSigned: boolean;
  clientSignatureTimestamp?: string;
  clientSignatureName?: string;
}

export interface VisitStop {
  id: string;
  stopOrder: number;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyType: string;
  address: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  salePrice: number;
  condoFee?: number;
  iptuFee?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  usableAreaM2: number;
  coverImage: string;
  ownerName: string;
  ownerPhone: string;
  keysLocation: 'PORTARIA' | 'IMOBILIARIA_CHAVEIRO' | 'PROPRIETARIO_NO_LOCAL' | 'FECHADURA_DIGITAL';
  keysCode?: string;
  scheduledTime: string; // ex: '10:00'
  estimatedDurationMin: number; // ex: 35 min
  drivingTimeToNextMin?: number; // ex: 12 min
  distanceToNextKm?: number; // ex: 3.4 km
  status: VisitStopStatus;
  checkIn?: {
    timestamp: string;
    latitude: number;
    longitude: number;
    distanceAccuracyMeters: number;
    verifiedWithinGeofence: boolean;
  };
  feedback?: VisitFeedback;
  wazeUrl: string;
  googleMapsUrl: string;
}

export type ItineraryStatus = 
  | 'PLANEJADO'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'CANCELADO';

export interface VisitItinerary {
  id: string;
  code: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // '09:00'
  endTimeEstimated: string; // '12:30'
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerAvatar?: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientProfileNotes?: string;
  budgetMax?: number;
  status: ItineraryStatus;
  totalDistanceKm: number;
  totalDurationMin: number;
  stops: VisitStop[];
  meetingPointAddress?: string;
  weatherForecast?: string;
  notes?: string;
  sharedViaWhatsAppAt?: string;
  createdAt: string;
}

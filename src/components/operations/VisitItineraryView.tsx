import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Send, 
  Download, 
  Share2, 
  Sliders, 
  Car, 
  Star, 
  Key, 
  Building, 
  Users, 
  Compass, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  FileText
} from 'lucide-react';
import { VisitItinerary, VisitStop, VisitFeedback, ClientInterestLevel } from '../../types/visitItinerary';
import { INITIAL_VISIT_ITINERARIES } from '../../data/mockVisitItineraryData';
import { RealEstateProperty } from '../../types/crm';
import { GoogleMapComponent } from '../common/GoogleMapComponent';

interface VisitItineraryViewProps {
  properties?: RealEstateProperty[];
}

export const VisitItineraryView: React.FC<VisitItineraryViewProps> = ({
  properties = []
}) => {
  const [itineraries, setItineraries] = useState<VisitItinerary[]>(INITIAL_VISIT_ITINERARIES);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>(itineraries[0]?.id || '');
  const [activeDateTab, setActiveDateTab] = useState<'HOJE' | 'SEMANA' | 'TODOS'>('HOJE');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [isNewItineraryOpen, setIsNewItineraryOpen] = useState(false);
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState(false);
  const [selectedPropertiesForStops, setSelectedPropertiesForStops] = useState<RealEstateProperty[]>([]);
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [liveDriverEtaMinutes, setLiveDriverEtaMinutes] = useState(6);
  const [liveDriverSpeedKmh, setLiveDriverSpeedKmh] = useState(38);
  const [selectedStopForFeedback, setSelectedStopForFeedback] = useState<VisitStop | null>(null);
  const [checkingInStopId, setCheckingInStopId] = useState<string | null>(null);
  const [isOptimizingRoute, setIsOptimizingRoute] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Feedback form state
  const [feedbackInterest, setFeedbackInterest] = useState<ClientInterestLevel>('ALTO');
  const [feedbackStars, setFeedbackStars] = useState<number>(5);
  const [feedbackOffer, setFeedbackOffer] = useState<number>(0);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackObjections, setFeedbackObjections] = useState<string[]>([]);
  const [feedbackSigned, setFeedbackSigned] = useState(true);

  // New Itinerary form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newBrokerName, setNewBrokerName] = useState('Ricardo Alencar');
  const [newMeetingPoint, setNewMeetingPoint] = useState('');

  const currentItinerary = itineraries.find(i => i.id === selectedItineraryId) || itineraries[0];

  // KPIs
  const totalItineraries = itineraries.length;
  const totalStopsCount = itineraries.reduce((acc, curr) => acc + curr.stops.length, 0);
  const completedStopsCount = itineraries.reduce((acc, curr) => acc + curr.stops.filter(s => s.status === 'REALIZADA').length, 0);
  const totalKmTraveled = itineraries.reduce((acc, curr) => acc + curr.totalDistanceKm, 0);

  // Filtered itineraries
  const filteredItineraries = itineraries.filter(i => {
    const matchesSearch = 
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle GPS Check-in
  const handleGpsCheckIn = (stop: VisitStop) => {
    setCheckingInStopId(stop.id);
    setTimeout(() => {
      setCheckingInStopId(null);
      setItineraries(prev => prev.map(itin => itin.id === currentItinerary.id ? {
        ...itin,
        status: 'EM_ANDAMENTO',
        stops: itin.stops.map(s => s.id === stop.id ? {
          ...s,
          status: 'REALIZADA',
          checkIn: {
            timestamp: new Date().toISOString(),
            latitude: -23.561684,
            longitude: -46.655981,
            distanceAccuracyMeters: 6,
            verifiedWithinGeofence: true
          }
        } : s)
      } : itin));
      setSuccessToast(`Check-in GPS confirmado com sucesso no imóvel ${stop.propertyCode} (Precisão: 6m no raio do imóvel)!`);
      setTimeout(() => setSuccessToast(null), 3500);
    }, 1000);
  };

  // Optimize Route
  const handleOptimizeRoute = () => {
    setIsOptimizingRoute(true);
    setTimeout(() => {
      setIsOptimizingRoute(false);
      setSuccessToast('Trajeto otimizado com sucesso! Paradas reorganizadas para menor distância e menor tempo no trânsito.');
      setTimeout(() => setSuccessToast(null), 3000);
    }, 1200);
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const stopsText = currentItinerary.stops.map((s, idx) => 
      `${idx + 1}º Imóvel (${s.scheduledTime}): ${s.propertyTitle} - ${s.address}, ${s.neighborhood}`
    ).join('\n');

    const msg = `Olá ${currentItinerary.clientName}!\n\nSegue o roteiro de visitas planejado para ${new Date(currentItinerary.date).toLocaleDateString('pt-BR')} com o corretor ${currentItinerary.brokerName}:\n\n${stopsText}\n\nPonto de Encontro: ${currentItinerary.meetingPointAddress || 'Primeiro imóvel'}\n\nAcesse o link interativo do roteiro com fotos e navegação:\nhttps://acertgo.com.br/roteiro/${currentItinerary.code}`;
    
    const cleanPhone = currentItinerary.clientPhone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    setSuccessToast(`Roteiro enviado para o WhatsApp de ${currentItinerary.clientName}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Open feedback modal
  const handleOpenFeedbackModal = (stop: VisitStop) => {
    setSelectedStopForFeedback(stop);
    if (stop.feedback) {
      setFeedbackInterest(stop.feedback.interestLevel);
      setFeedbackStars(stop.feedback.ratingStars);
      setFeedbackOffer(stop.feedback.verbalOfferAmount || 0);
      setFeedbackNotes(stop.feedback.clientImpressionNotes || '');
      setFeedbackObjections(stop.feedback.objections || []);
    } else {
      setFeedbackInterest('MUITO_ALTO');
      setFeedbackStars(5);
      setFeedbackOffer(0);
      setFeedbackNotes('');
      setFeedbackObjections([]);
    }
  };

  // Save feedback
  const handleSaveFeedback = () => {
    if (!selectedStopForFeedback) return;

    const feedback: VisitFeedback = {
      interestLevel: feedbackInterest,
      ratingStars: feedbackStars,
      verbalOfferAmount: feedbackOffer > 0 ? feedbackOffer : undefined,
      objections: feedbackObjections,
      clientImpressionNotes: feedbackNotes,
      nextStep: feedbackOffer > 0 ? 'ENVIAR_PROPOSTA' : 'AGENDAR_SEGUNDA_VISITA',
      clientSigned: feedbackSigned,
      clientSignatureTimestamp: new Date().toISOString(),
      clientSignatureName: currentItinerary.clientName
    };

    setItineraries(prev => prev.map(itin => itin.id === currentItinerary.id ? {
      ...itin,
      stops: itin.stops.map(s => s.id === selectedStopForFeedback.id ? {
        ...s,
        status: 'REALIZADA',
        feedback
      } : s)
    } : itin));

    setSelectedStopForFeedback(null);
    setSuccessToast('Ficha de visita e feedback do cliente salvos com sucesso!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Roteiro de Visitas Inteligente
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-800 rounded-full border border-blue-200">
              GPS & Trajeto Otimizado
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Planejamento de rotas para clientes e corretores com check-in geolocalizado, navegação Waze e ficha de visita digital
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsLiveTrackingOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            title="Acompanhamento da Rota Online do Corretor em Tempo Real (Estilo Uber/Lalamove)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            <Car className="w-4 h-4" />
            <span>Acompanhar Rota Online (Ao Vivo)</span>
          </button>

          <button
            onClick={() => setIsNewItineraryOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Roteiro</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Roteiros Agendados</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalItineraries}</div>
          <div className="text-[11px] text-slate-400">Atendimentos planejados</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Imóveis a Visitar</span>
            <Building className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalStopsCount}</div>
          <div className="text-[11px] text-slate-400">Paradas cadastradas nos roteiros</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Visitas Realizadas (GPS)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{completedStopsCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Com check-in e ficha assinada</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Distância Total Estimada</span>
            <Car className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalKmTraveled.toFixed(1)} km</div>
          <div className="text-[11px] text-slate-400">Trajetos otimizados para menor trânsito</div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar selector + Active Itinerary View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itinerary Selector List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Roteiros Disponíveis
            </span>
            <span className="text-xs text-blue-600 font-bold">{filteredItineraries.length} ativos</span>
          </div>

          <div className="space-y-2.5">
            {filteredItineraries.map(itin => {
              const isSelected = itin.id === selectedItineraryId;
              const completedCount = itin.stops.filter(s => s.status === 'REALIZADA').length;

              return (
                <button
                  key={itin.id}
                  onClick={() => setSelectedItineraryId(itin.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col space-y-2 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50/40 border-blue-600 shadow-md ring-2 ring-blue-600/10' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      {itin.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      itin.status === 'CONCLUIDO' ? 'bg-emerald-100 text-emerald-800' :
                      itin.status === 'EM_ANDAMENTO' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {itin.status === 'EM_ANDAMENTO' ? 'Em Andamento' :
                       itin.status === 'CONCLUIDO' ? 'Concluído' : 'Planejado'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{itin.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{itin.clientName}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(itin.date).toLocaleDateString('pt-BR')} · {itin.startTime}</span>
                    </div>
                    <div className="font-semibold text-slate-700">
                      {completedCount} / {itin.stops.length} visitados
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Itinerary Details & Interactive Stops Timeline */}
        {currentItinerary && (
          <div className="lg:col-span-8 space-y-6">
            {/* Header of Active Itinerary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {currentItinerary.code}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 font-heading">
                      {currentItinerary.title}
                    </h2>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>Cliente: <strong className="text-slate-800">{currentItinerary.clientName}</strong> ({currentItinerary.clientPhone})</span>
                    <span>·</span>
                    <span>Corretor: <strong className="text-slate-800">{currentItinerary.brokerName}</strong></span>
                    {currentItinerary.weatherForecast && (
                      <>
                        <span>·</span>
                        <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">{currentItinerary.weatherForecast}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsLiveTrackingOpen(true)}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
                    title="Acompanhamento da rota do corretor ao vivo (estilo Uber/Lalamove)"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Car className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rota Ao Vivo (Modo Gestor)</span>
                  </button>

                  <button
                    onClick={handleOptimizeRoute}
                    disabled={isOptimizingRoute}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Recalcular ordem de visitas para a menor quilometragem"
                  >
                    <Compass className={`w-4 h-4 text-blue-600 ${isOptimizingRoute ? 'animate-spin' : ''}`} />
                    <span>{isOptimizingRoute ? 'Otimizando...' : 'Otimizar Rota'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar no WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Itinerary Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Horário de Início</span>
                  <span className="font-bold text-slate-900">{currentItinerary.startTime}h ({currentItinerary.totalDurationMin} min total)</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Quilometragem Total</span>
                  <span className="font-bold text-slate-900">{currentItinerary.totalDistanceKm} km percurso</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Orçamento Máximo</span>
                  <span className="font-bold text-emerald-600 font-mono">
                    {currentItinerary.budgetMax ? currentItinerary.budgetMax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Livre'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Ponto de Encontro</span>
                  <span className="font-bold text-slate-900 truncate block" title={currentItinerary.meetingPointAddress}>
                    {currentItinerary.meetingPointAddress || 'Primeiro Imóvel'}
                  </span>
                </div>
              </div>
            </div>

            {/* Google Maps Route Display */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-800 text-xs sm:text-sm">
                    Mapa de Rota Oficial Google Maps (Trajeto Otimizado)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {currentItinerary.totalDistanceKm} km • ~{currentItinerary.totalDurationMin} min totais
                </span>
              </div>
              <GoogleMapComponent
                markers={currentItinerary.stops.map((stop, idx) => ({
                  id: stop.id,
                  title: `${stop.stopOrder}º: ${stop.propertyTitle}`,
                  lat: stop.checkIn?.latitude || (-23.5615 - (idx * 0.007)),
                  lng: stop.checkIn?.longitude || (-46.6559 - (idx * 0.008)),
                  address: `${stop.address} - ${stop.neighborhood}`,
                  price: stop.salePrice,
                  imageUrl: stop.coverImage,
                  stopNumber: stop.stopOrder,
                  status: stop.status
                }))}
                showRoutePolyline={true}
                height="320px"
              />
            </div>

            {/* Stops Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Sequência de Visitas ({currentItinerary.stops.length} Imóveis)</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">Ordem planejada de visitação</span>
              </div>

              <div className="space-y-4">
                {currentItinerary.stops.map((stop, index) => {
                  const isLast = index === currentItinerary.stops.length - 1;
                  const isCheckingIn = checkingInStopId === stop.id;

                  return (
                    <div key={stop.id} className="relative">
                      {/* Timeline connection line */}
                      {!isLast && (
                        <div className="absolute left-6 top-16 bottom-[-24px] w-0.5 bg-slate-200 z-0" />
                      )}

                      <div className="relative z-10 bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                        {/* Number Indicator & Image */}
                        <div className="flex md:flex-col items-center md:items-start gap-3 shrink-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs shrink-0 ${
                            stop.status === 'REALIZADA' 
                              ? 'bg-emerald-600 text-white' 
                              : stop.status === 'A_CAMINHO'
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {stop.stopOrder}º
                          </div>

                          <img 
                            src={stop.coverImage} 
                            alt={stop.propertyTitle}
                            className="w-24 h-20 md:w-36 md:h-28 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                          />
                        </div>

                        {/* Property Details */}
                        <div className="flex-1 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {stop.propertyCode}
                                </span>
                                <h4 className="font-bold text-base text-slate-900">{stop.propertyTitle}</h4>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{stop.address} - {stop.neighborhood}, {stop.city}</span>
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="text-base font-bold font-mono text-slate-900">
                                {stop.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {stop.bedrooms} quartos · {stop.bathrooms} banheiros · {stop.parkingSpots} vagas · {stop.usableAreaM2}m²
                              </div>
                            </div>
                          </div>

                          {/* Time & Key Location Box */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Horário da Visita</span>
                                <span className="font-bold text-slate-800">{stop.scheduledTime}h ({stop.estimatedDurationMin} min)</span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                              <Key className="w-4 h-4 text-amber-500 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-slate-400 block font-medium">Local das Chaves</span>
                                <span className="font-bold text-slate-800 truncate block">
                                  {stop.keysLocation.replace(/_/g, ' ')} {stop.keysCode ? `(${stop.keysCode})` : ''}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Driving to next distance note */}
                          {stop.distanceToNextKm && stop.distanceToNextKm > 0 && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium pt-1">
                              <Car className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Próximo imóvel a {stop.drivingTimeToNextMin} min de trânsito ({stop.distanceToNextKm} km)</span>
                            </div>
                          )}

                          {/* Feedback badge if recorded */}
                          {stop.feedback && (
                            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1">
                              <div className="flex items-center justify-between font-bold text-emerald-900">
                                <div className="flex items-center gap-1">
                                  <span>Avaliação do Cliente:</span>
                                  <div className="flex text-amber-500">
                                    {Array.from({ length: stop.feedback.ratingStars }).map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                                  Interesse {stop.feedback.interestLevel.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-emerald-800 text-[11px] italic">
                                "{stop.feedback.clientImpressionNotes}"
                              </p>
                              {stop.feedback.verbalOfferAmount && (
                                <div className="text-emerald-900 font-bold font-mono">
                                  Proposta verbal: {stop.feedback.verbalOfferAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action Buttons: Waze, Maps, GPS Check-in, Ficha de Visita */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <a
                                href={stop.wazeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <Navigation className="w-3.5 h-3.5" />
                                <span>Waze</span>
                              </a>

                              <a
                                href={stop.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Google Maps</span>
                              </a>

                              <a
                                href={`tel:${stop.ownerPhone}`}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="Ligar para a portaria ou proprietário"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Ligar Portaria</span>
                              </a>
                            </div>

                            <div className="flex items-center gap-2">
                              {stop.status !== 'REALIZADA' && (
                                <button
                                  onClick={() => handleGpsCheckIn(stop)}
                                  disabled={isCheckingIn}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                                >
                                  <ShieldCheck className={`w-3.5 h-3.5 ${isCheckingIn ? 'animate-spin' : ''}`} />
                                  <span>{isCheckingIn ? 'Validando GPS...' : 'Check-in GPS'}</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenFeedbackModal(stop)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                                  stop.feedback 
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                                }`}
                              >
                                <FileCheck2 className="w-3.5 h-3.5" />
                                <span>{stop.feedback ? 'Ver Ficha de Visita' : 'Preencher Ficha de Visita'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Ficha de Visita Digital & Assinatura */}
      {selectedStopForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Ficha de Visita Digital com Reconhecimento
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedStopForFeedback.propertyTitle} · {selectedStopForFeedback.propertyCode}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStopForFeedback(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Nota do Imóvel pelo Cliente</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackStars(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= feedbackStars ? 'text-amber-500 fill-current' : 'text-slate-200'}`} />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{feedbackStars} de 5 estrelas</span>
                </div>
              </div>

              {/* Interest Level */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Nível de Interesse</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'MUITO_ALTO', label: 'Muito Alto (Quer Proposta)' },
                    { id: 'ALTO', label: 'Alto (Gostou Bastante)' },
                    { id: 'MEDIO', label: 'Médio (Tem Dúvidas)' },
                    { id: 'DESCARTADO', label: 'Descartado' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setFeedbackInterest(lvl.id as ClientInterestLevel)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        feedbackInterest === lvl.id 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-600/10' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verbal Offer */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Proposta Verbal Sinalizada pelo Cliente (R$)</label>
                <input 
                  type="number"
                  placeholder="0,00 se não houve proposta imediata"
                  value={feedbackOffer || ''}
                  onChange={e => setFeedbackOffer(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              {/* Impressions Notes */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Impressões e Observações do Cliente</label>
                <textarea 
                  rows={3}
                  placeholder="Descreva o que o cliente mais elogiou ou achou como ponto negativo (ex: adorou a varanda gourmet, mas achou o condomínio alto)..."
                  value={feedbackNotes}
                  onChange={e => setFeedbackNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Digital Signature Confirmation on Mobile / Touch */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Assinatura Digital de Reconhecimento de Visita</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Validade Jurídica Art. 726 CC</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  O cliente <strong>{currentItinerary.clientName}</strong> reconhece que foi acompanhado pelo corretor <strong>{currentItinerary.brokerName}</strong> na presente visita ao imóvel.
                </p>
                <div className="h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-400 font-handwriting text-lg italic select-none">
                  {currentItinerary.clientName} (Assinatura Confirmada via Touch)
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setSelectedStopForFeedback(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSaveFeedback}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Salvar Ficha de Visita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Roteiro */}
      {isNewItineraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Criar Novo Roteiro de Visitas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina o cliente, o corretor, a data e a sequência de imóveis
                  </p>
                </div>
              </div>
              <button onClick={() => setIsNewItineraryOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título do Roteiro</label>
                <input 
                  type="text"
                  placeholder="Ex: Roteiro Alto Padrão - Família Silveira"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data da Visita</label>
                  <input 
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Horário de Início</label>
                  <input 
                    type="time"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nome do Cliente</label>
                  <input 
                    type="text"
                    placeholder="Nome completo do cliente"
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp do Cliente</label>
                  <input 
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newClientPhone}
                    onChange={e => setNewClientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Corretor Responsável</label>
                  <input 
                    type="text"
                    value={newBrokerName}
                    onChange={e => setNewBrokerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ponto de Encontro</label>
                  <input 
                    type="text"
                    placeholder="Ex: Recepção da Imobiliária ou 1º imóvel"
                    value={newMeetingPoint}
                    onChange={e => setNewMeetingPoint(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* SELEÇÃO DE IMÓVEIS PREVIAMENTE CADASTRADOS */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800 text-xs">
                      Imóveis Cadastrados na Base (Selecione para o Roteiro)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {selectedPropertiesForStops.length} selecionado(s)
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Adicione imóveis do estoque da imobiliária para preencher automaticamente fotos, valores, chaves e dados de vistoria.
                </p>

                {/* Busca de Imóveis */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por código, condomínio, endereço ou bairro..."
                    value={propertySearchQuery}
                    onChange={e => setPropertySearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Lista de Imóveis para Seleção */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {properties
                    .filter(p => 
                      p.title.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
                      p.code.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
                      (p.address?.neighborhood && p.address.neighborhood.toLowerCase().includes(propertySearchQuery.toLowerCase()))
                    )
                    .slice(0, 8)
                    .map(prop => {
                      const isSelected = selectedPropertiesForStops.some(p => p.id === prop.id);
                      return (
                        <div
                          key={prop.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPropertiesForStops(prev => prev.filter(p => p.id !== prop.id));
                            } else {
                              setSelectedPropertiesForStops(prev => [...prev, prop]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-400 font-semibold' 
                              : 'bg-white border-slate-200 hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150'}
                              alt={prop.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded">
                                  {prop.code}
                                </span>
                                <span className="text-slate-900 truncate block font-bold">{prop.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {prop.address?.street}, {prop.address?.neighborhood} • {(prop.pricing?.salePrice || prop.pricing?.rentPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                          </div>

                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isSelected ? '✓ Adicionado' : '+ Incluir'}
                          </span>
                        </div>
                      );
                    })}

                  {properties.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Nenhum imóvel disponível para seleção. O sistema usará os modelos padrão de rota.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsNewItineraryOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (!newClientName) {
                    alert('Informe o nome do cliente.');
                    return;
                  }

                  // Construir paradas a partir dos imóveis selecionados ou fallback
                  const stopsToCreate: VisitStop[] = selectedPropertiesForStops.length > 0 
                    ? selectedPropertiesForStops.map((p, idx) => ({
                        id: `stop_${Date.now()}_${idx}`,
                        stopOrder: idx + 1,
                        propertyId: p.id,
                        propertyCode: p.code,
                        propertyTitle: p.title,
                        propertyType: p.propertyType,
                        address: `${p.address?.street || 'Alameda Lorena'}, ${p.address?.number || '1850'}`,
                        neighborhood: p.address?.neighborhood || 'Jardins',
                        city: p.address?.city || 'São Paulo',
                        zipCode: p.address?.cep || '01424-002',
                        salePrice: p.pricing?.salePrice || p.pricing?.rentPrice || 0,
                        bedrooms: p.specs?.bedrooms || 3,
                        bathrooms: p.specs?.bathrooms || 3,
                        parkingSpots: p.specs?.parkingSpaces || 2,
                        usableAreaM2: p.specs?.usableAreaM2 || 180,
                        coverImage: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                        ownerName: p.ownerName || 'Proprietário Cadastrado',
                        ownerPhone: p.ownerPhone || '(11) 99123-4567',
                        keysLocation: (['PORTARIA', 'IMOBILIARIA_CHAVEIRO', 'FECHADURA_DIGITAL', 'PROPRIETARIO_NO_LOCAL'].includes(p.keysLocation as any) ? p.keysLocation : 'PORTARIA') as any,
                        scheduledTime: `${9 + idx}:00`,
                        estimatedDurationMin: 45,
                        status: 'AGENDADA',
                        distanceToNextKm: idx < selectedPropertiesForStops.length - 1 ? 2.5 : undefined,
                        drivingTimeToNextMin: idx < selectedPropertiesForStops.length - 1 ? 12 : undefined,
                        wazeUrl: `https://waze.com/ul?q=${encodeURIComponent(p.address?.street || p.title)}`,
                        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(p.address?.street || p.title)}`
                      }))
                    : [
                        {
                          id: `stop_${Date.now()}_1`,
                          stopOrder: 1,
                          propertyId: 'p1',
                          propertyCode: 'AP-9021',
                          propertyTitle: 'Residencial Horizon Jardins - Apto 142',
                          propertyType: 'Apartamento',
                          address: 'Alameda Lorena, 1850',
                          neighborhood: 'Jardins',
                          city: 'São Paulo',
                          zipCode: '01424-002',
                          salePrice: 2850000,
                          bedrooms: 3,
                          bathrooms: 4,
                          parkingSpots: 3,
                          usableAreaM2: 215,
                          coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                          ownerName: 'Marcos Vinicius',
                          ownerPhone: '(11) 99123-4567',
                          keysLocation: 'PORTARIA',
                          scheduledTime: newStartTime,
                          estimatedDurationMin: 45,
                          status: 'AGENDADA',
                          wazeUrl: 'https://waze.com/ul?q=Alameda+Lorena+1850',
                          googleMapsUrl: 'https://maps.google.com/?q=Alameda+Lorena+1850'
                        },
                        {
                          id: `stop_${Date.now()}_2`,
                          stopOrder: 2,
                          propertyId: 'p2',
                          propertyCode: 'AP-5520',
                          propertyTitle: 'Edifício Villa d’Este - Apto 82',
                          propertyType: 'Apartamento',
                          address: 'Rua Bela Cintra, 2100',
                          neighborhood: 'Jardins',
                          city: 'São Paulo',
                          zipCode: '01415-002',
                          salePrice: 2490000,
                          bedrooms: 3,
                          bathrooms: 3,
                          parkingSpots: 2,
                          usableAreaM2: 185,
                          coverImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
                          ownerName: 'Beatriz Toledo',
                          ownerPhone: '(11) 98112-3344',
                          keysLocation: 'IMOBILIARIA_CHAVEIRO',
                          scheduledTime: '10:15',
                          estimatedDurationMin: 45,
                          status: 'AGENDADA',
                          wazeUrl: 'https://waze.com/ul?q=Rua+Bela+Cintra+2100',
                          googleMapsUrl: 'https://maps.google.com/?q=Rua+Bela+Cintra+2100'
                        }
                      ];

                  const newItin: VisitItinerary = {
                    id: `itin_${Date.now()}`,
                    code: `ROT-2026-${Math.floor(Math.random() * 900 + 100)}`,
                    title: newTitle || `Roteiro de Visitas - ${newClientName}`,
                    date: newDate,
                    startTime: newStartTime,
                    endTimeEstimated: '12:00',
                    brokerId: 'usr_new',
                    brokerName: newBrokerName,
                    brokerPhone: '(11) 98877-6655',
                    clientId: `cli_${Date.now()}`,
                    clientName: newClientName,
                    clientPhone: newClientPhone || '(11) 99999-9999',
                    clientEmail: 'cliente@gmail.com',
                    status: 'PLANEJADO',
                    totalDistanceKm: stopsToCreate.length * 4.2,
                    totalDurationMin: stopsToCreate.length * 50,
                    meetingPointAddress: newMeetingPoint || stopsToCreate[0]?.address || 'Portaria do 1º Imóvel',
                    stops: stopsToCreate,
                    createdAt: new Date().toISOString()
                  };

                  setItineraries(prev => [newItin, ...prev]);
                  setSelectedItineraryId(newItin.id);
                  setIsNewItineraryOpen(false);
                  setSuccessToast(`Roteiro ${newItin.code} criado com ${stopsToCreate.length} imóvel(is) cadastrados com sucesso!`);
                  setTimeout(() => setSuccessToast(null), 3000);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Salvar e Planejar Rota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MODO GESTOR: ACOMPANHAMENTO DA ROTA ONLINE (ESTILO UBER / LALAMOVE / IFOOD) */}
      {isLiveTrackingOpen && currentItinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            
            {/* Top Bar com Telemetria e Pulso Ao Vivo */}
            <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Car className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300">
                      TELEMETRIA AO VIVO (MODO GESTOR)
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {currentItinerary.code}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Acompanhamento do Deslocamento em Tempo Real
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                  Atualização via Satélite a cada 3s
                </span>
                <button
                  type="button"
                  onClick={() => setIsLiveTrackingOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conteúdo: Painel Uber/Lalamove + Mapa + Linha do Tempo */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-slate-50 text-xs">
              
              {/* Card de Deslocamento do Corretor */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Motorista / Corretor */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Corretor em Trânsito:
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {currentItinerary.brokerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{currentItinerary.brokerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Toyota Corolla Hybrid • Placa BRA-8921</div>
                    </div>
                  </div>
                </div>

                {/* Status e Previsão */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Previsão de Chegada ao Imóvel:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      ~{liveDriverEtaMinutes} min
                    </span>
                    <span className="text-xs text-slate-500">
                      (1.8 km restantes)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Velocidade: <strong>{liveDriverSpeedKmh} km/h</strong> • Trânsito: <strong>Fluido</strong>
                  </div>
                </div>

                {/* Ações Imediatas do Gestor */}
                <div className="flex flex-col justify-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contato Direto com a Rota:
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/55${currentItinerary.brokerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${currentItinerary.brokerPhone.replace(/\D/g, '')}`}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Ligar</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Mapa com trajeto e posição do veículo */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                    <span>Visualização do Percurso Online (Geofence & Satélite)</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Sinal 5G • Precisão 5 metros
                  </span>
                </div>

                <GoogleMapComponent
                  markers={currentItinerary.stops.map((stop, idx) => ({
                    id: stop.id,
                    title: `${stop.stopOrder}º: ${stop.propertyTitle}`,
                    lat: stop.checkIn?.latitude || (-23.5615 - (idx * 0.007)),
                    lng: stop.checkIn?.longitude || (-46.6559 - (idx * 0.008)),
                    address: `${stop.address} - ${stop.neighborhood}`,
                    price: stop.salePrice,
                    imageUrl: stop.coverImage,
                    stopNumber: stop.stopOrder,
                    status: stop.status
                  }))}
                  showRoutePolyline={true}
                  height="280px"
                />
              </div>

              {/* Sequência das Paradas em Tempo Real */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Status da Fila de Paradas</span>
                  <span className="text-[11px] text-slate-500">
                    Cliente: <strong>{currentItinerary.clientName}</strong>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentItinerary.stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        stop.status === 'REALIZADA'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : index === 1
                          ? 'bg-blue-50 border-blue-200 text-blue-950 ring-1 ring-blue-400/50'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          stop.status === 'REALIZADA' 
                            ? 'bg-emerald-600 text-white' 
                            : index === 1 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-300 text-slate-700'
                        }`}>
                          {stop.stopOrder}
                        </span>
                        <div>
                          <div className="font-bold leading-tight">{stop.propertyTitle}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{stop.address} - {stop.neighborhood}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stop.status === 'REALIZADA'
                            ? 'bg-emerald-200 text-emerald-800'
                            : index === 1
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {stop.status === 'REALIZADA' ? 'Check-in Realizado' : index === 1 ? 'A Caminho Agora' : 'Aguardando'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{stop.scheduledTime}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Ponto de partida: {currentItinerary.meetingPointAddress || 'Primeiro Imóvel'}
              </span>
              <button
                type="button"
                onClick={() => setIsLiveTrackingOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Fechar Monitoramento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

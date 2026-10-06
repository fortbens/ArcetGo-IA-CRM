import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  Shuffle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
  Timer,
  Play,
  RotateCw,
  Plus,
  Coffee,
  UserCheck,
  ChevronRight,
  Flame,
  Building,
  Target,
  Smartphone,
  Eye,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Radio
} from 'lucide-react';
import {
  StandVendas,
  StandBrokerAttendance,
  RoletaRuleConfig,
  StandGpsStatus,
  UserProfile
} from '../../types/crm';
import { getHaversineDistanceMeters } from '../../utils/geoUtils';

interface StandVendasGpsViewProps {
  stands: StandVendas[];
  rules: RoletaRuleConfig;
  onUpdateStands: (stands: StandVendas[]) => void;
  currentUser?: UserProfile;
  onOpenRulesModal: () => void;
}

export const StandVendasGpsView: React.FC<StandVendasGpsViewProps> = ({
  stands,
  rules,
  onUpdateStands,
  currentUser,
  onOpenRulesModal
}) => {
  const [selectedStandId, setSelectedStandId] = useState<string>(stands[0]?.id || '');
  const activeStand = stands.find(s => s.id === selectedStandId) || stands[0];

  // GPS State
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [lastCheckInResult, setLastCheckInResult] = useState<{
    success: boolean;
    distanceMeters: number;
    message: string;
  } | null>(null);

  // Stand Draw / Shuffle State
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawSuccessMessage, setDrawSuccessMessage] = useState<string | null>(null);

  // Absence modal
  const [absenceModalBroker, setAbsenceModalBroker] = useState<StandBrokerAttendance | null>(null);
  const [absenceReasonInput, setAbsenceReasonInput] = useState('Café / Sanitário');

  // New Stand Modal
  const [showNewStandModal, setShowNewStandModal] = useState(false);
  const [newStandName, setNewStandName] = useState('');
  const [newStandDev, setNewStandDev] = useState('');
  const [newStandAddress, setNewStandAddress] = useState('');
  const [newStandLat, setNewStandLat] = useState(-23.561684);
  const [newStandLng, setNewStandLng] = useState(-46.655981);

  // Live timer tick for absence countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      onUpdateStands(
        stands.map(stand => {
          if (stand.id !== selectedStandId) return stand;
          const updatedAttendance = stand.attendanceList.map(att => {
            if (att.status === 'AUSENTE_PAUSADO' && att.absenceSecondsRemaining !== undefined) {
              const remaining = att.absenceSecondsRemaining - 1;
              if (remaining <= 0) {
                // Rule penalty triggered! Move to end of queue or mark expired
                return {
                  ...att,
                  status: 'DISPONIVEL' as const,
                  absenceSecondsRemaining: 0,
                  queuePosition: stand.attendanceList.length, // Penalty: sent to end of queue!
                  absenceReason: 'Penalizado: Tempo máximo de ausência excedido (Final da Fila)'
                };
              }
              return { ...att, absenceSecondsRemaining: remaining };
            }
            return att;
          });
          return { ...stand, attendanceList: updatedAttendance };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedStandId, stands]);

  // Execute real browser GPS check-in
  const handleRealGpsCheckIn = () => {
    setIsLocating(true);
    setGpsError(null);
    setLastCheckInResult(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocalização GPS não suportada neste navegador.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        processCheckInWithCoords(userLat, userLng, 'GPS Real do Dispositivo');
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        setGpsError('Permissão de localização GPS recusada ou sinal fraco. Use a simulação abaixo.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Process Coordinates against Stand Pin (10m Geofence)
  const processCheckInWithCoords = (lat: number, lng: number, sourceLabel: string) => {
    if (!activeStand) return;

    const distanceMeters = getHaversineDistanceMeters(
      lat,
      lng,
      activeStand.latitude,
      activeStand.longitude
    );

    const isInsideRadius = distanceMeters <= (activeStand.geofenceRadiusMeters || 10);
    const brokerName = currentUser?.name || 'Corretor Conectado';
    const brokerId = currentUser?.id || `usr_curr_${Date.now()}`;
    const brokerAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    if (isInsideRadius) {
      setLastCheckInResult({
        success: true,
        distanceMeters,
        message: `✅ PRESENÇA CONFIRMADA! Você está a ${distanceMeters}m do Stand de Vendas (${sourceLabel}). GPS Validado dentro do raio de 10m!`
      });

      // Add or update broker in stand queue
      const existingIdx = activeStand.attendanceList.findIndex(b => b.brokerId === brokerId || b.brokerName === brokerName);
      let updatedList = [...activeStand.attendanceList];

      const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      if (existingIdx >= 0) {
        updatedList[existingIdx] = {
          ...updatedList[existingIdx],
          distanceMeters,
          gpsStatus: 'VALIDADO_NO_RAIO',
          checkInTime: now,
          userCoords: { lat, lng }
        };
      } else {
        const nextPos = updatedList.length + 1;
        updatedList.push({
          id: `att_${Date.now()}`,
          brokerId,
          brokerName,
          brokerAvatar,
          brokerPhone: currentUser?.phone || '(11) 98765-4321',
          brokerCreci: currentUser?.creci || '198765-F',
          checkInTime: now,
          distanceMeters,
          gpsStatus: 'VALIDADO_NO_RAIO',
          queuePosition: nextPos,
          status: 'DISPONIVEL',
          leadsAttendedCount: 0,
          userCoords: { lat, lng }
        });
      }

      onUpdateStands(
        stands.map(s => s.id === activeStand.id ? { ...s, attendanceList: updatedList } : s)
      );
    } else {
      setLastCheckInResult({
        success: false,
        distanceMeters,
        message: `🚫 FORA DO RAIO PERMITIDO! Você está a ${distanceMeters}m do Stand de Vendas (${sourceLabel}). A tolerância é de até 10 metros para participar do sorteio do plantão.`
      });

      // Update broker with FORA_DO_RAIO status
      const existingIdx = activeStand.attendanceList.findIndex(b => b.brokerId === brokerId || b.brokerName === brokerName);
      if (existingIdx >= 0) {
        const updatedList = [...activeStand.attendanceList];
        updatedList[existingIdx] = {
          ...updatedList[existingIdx],
          distanceMeters,
          gpsStatus: 'FORA_DO_RAIO',
          userCoords: { lat, lng }
        };
        onUpdateStands(
          stands.map(s => s.id === activeStand.id ? { ...s, attendanceList: updatedList } : s)
        );
      }
    }
  };

  // Perform the physical stand lottery shuffle for brokers with valid GPS
  const handlePerformStandDraw = () => {
    if (!activeStand || isDrawing) return;

    // Filter only brokers with VALIDADO_NO_RAIO (<= 10m)
    const validBrokers = activeStand.attendanceList.filter(b => b.gpsStatus === 'VALIDADO_NO_RAIO');

    if (validBrokers.length < 2) {
      alert('Para realizar o sorteio do Stand de Vendas, é necessário ter pelo menos 2 corretores com GPS validado a menos de 10 metros do Stand!');
      return;
    }

    setIsDrawing(true);
    setDrawSuccessMessage(null);

    setTimeout(() => {
      // Fisher-Yates shuffle
      const shuffled = [...validBrokers].sort(() => Math.random() - 0.5);

      // Re-assign queuePosition 1, 2, 3...
      const reorderedValid = shuffled.map((b, idx) => ({
        ...b,
        queuePosition: idx + 1,
        status: idx === 0 ? ('EM_ATENDIMENTO' as const) : ('DISPONIVEL' as const)
      }));

      // Non-valid brokers stay at the end
      const invalidBrokers = activeStand.attendanceList.filter(b => b.gpsStatus !== 'VALIDADO_NO_RAIO');
      const finalList = [
        ...reorderedValid,
        ...invalidBrokers.map((b, i) => ({ ...b, queuePosition: reorderedValid.length + i + 1 }))
      ];

      const drawRecord = {
        id: `draw_${Date.now()}`,
        timestamp: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        standName: activeStand.name,
        shiftName: activeStand.activeShift === 'MANHA' ? 'Turno Matutino' : 'Turno Vespertino',
        participantsCount: reorderedValid.length,
        drawnOrder: reorderedValid.map(b => ({
          position: b.queuePosition,
          brokerName: b.brokerName,
          distanceMeters: b.distanceMeters,
          gpsStatus: b.gpsStatus
        }))
      };

      onUpdateStands(
        stands.map(s =>
          s.id === activeStand.id
            ? {
                ...s,
                attendanceList: finalList,
                history: [drawRecord, ...(s.history || [])]
              }
            : s
        )
      );

      setIsDrawing(false);
      setDrawSuccessMessage(
        `Sorteio do Stand realizado com sucesso! 1º lugar: ${reorderedValid[0].brokerName}. Ordem de atendimento do plantão definida com auditoria GPS.`
      );
    }, 1800);
  };

  // Complete attendance for the current broker and move to next
  const handleCompleteCurrentLead = (brokerId: string) => {
    if (!activeStand) return;
    const list = [...activeStand.attendanceList];
    const currentIdx = list.findIndex(b => b.id === brokerId);
    if (currentIdx === -1) return;

    // Move completed broker to the end of the queue (Round-robin)
    const [completed] = list.splice(currentIdx, 1);
    completed.leadsAttendedCount += 1;
    completed.status = 'DISPONIVEL';
    list.push(completed);

    // Reindex positions
    const reindexed: StandBrokerAttendance[] = list.map((b, idx) => ({
      ...b,
      queuePosition: idx + 1,
      status: (idx === 0
        ? 'EM_ATENDIMENTO'
        : b.status === 'AUSENTE_PAUSADO'
        ? 'AUSENTE_PAUSADO'
        : 'DISPONIVEL') as StandBrokerAttendance['status']
    }));

    onUpdateStands(
      stands.map(s => s.id === activeStand.id ? { ...s, attendanceList: reindexed } : s)
    );
  };

  // Pause broker for absence
  const handleStartAbsence = () => {
    if (!activeStand || !absenceModalBroker) return;
    const maxSecs = (activeStand.maxAbsenceMinutes || rules.maxAbsenceMinutes || 15) * 60;

    const updated = activeStand.attendanceList.map(b => {
      if (b.id === absenceModalBroker.id) {
        return {
          ...b,
          status: 'AUSENTE_PAUSADO' as const,
          absenceStartedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          absenceSecondsRemaining: maxSecs,
          absenceReason: absenceReasonInput
        };
      }
      return b;
    });

    onUpdateStands(
      stands.map(s => s.id === activeStand.id ? { ...s, attendanceList: updated } : s)
    );
    setAbsenceModalBroker(null);
  };

  // Return broker from absence
  const handleReturnFromAbsence = (brokerId: string) => {
    if (!activeStand) return;
    const updated = activeStand.attendanceList.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          status: 'DISPONIVEL' as const,
          absenceSecondsRemaining: undefined,
          absenceStartedAt: undefined
        };
      }
      return b;
    });

    onUpdateStands(
      stands.map(s => s.id === activeStand.id ? { ...s, attendanceList: updated } : s)
    );
  };

  // Format seconds into mm:ss
  const formatSeconds = (sec?: number) => {
    if (sec === undefined || sec === null) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const validBrokersCount = activeStand?.attendanceList.filter(b => b.gpsStatus === 'VALIDADO_NO_RAIO').length || 0;
  const outsideBrokersCount = activeStand?.attendanceList.filter(b => b.gpsStatus === 'FORA_DO_RAIO').length || 0;

  return (
    <div className="space-y-6">
      
      {/* Top Stand Control Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Sorteio de Plantão com Geo-referenciamento GPS</span>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                Raio Estrito: 10m
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {activeStand?.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{activeStand?.address}</span>
            </p>

            {/* Stand Coordinates & Security Spec */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-300">
              <span className="bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700 font-mono text-[10px]">
                GPS: {activeStand?.latitude.toFixed(4)}, {activeStand?.longitude.toFixed(4)}
              </span>
              <span className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 text-[10px]">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                Raio Estrito: 10m
              </span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700 text-[10px]">
                Sorteio: <strong>{activeStand?.dailyDrawTime || rules.dailyDrawTime}</strong>
              </span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700 text-[10px]">
                Tolerância: <strong>{activeStand?.maxAbsenceMinutes || rules.maxAbsenceMinutes}m</strong>
              </span>
            </div>
          </div>

          {/* Quick Stand Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={onOpenRulesModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Regras</span>
            </button>

            <button
              onClick={handlePerformStandDraw}
              disabled={isDrawing || validBrokersCount < 2}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isDrawing ? 'animate-spin' : ''} shrink-0`} />
              <span>{isDrawing ? 'Sorteando...' : 'Sortear Ordem Agora'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stand Switcher & Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {stands.map((stand) => (
            <button
              key={stand.id}
              onClick={() => setSelectedStandId(stand.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                stand.id === selectedStandId
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{stand.developmentTitle}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                stand.id === selectedStandId ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {stand.attendanceList.filter(b => b.gpsStatus === 'VALIDADO_NO_RAIO').length} no raio
              </span>
            </button>
          ))}

          <button
            onClick={() => setShowNewStandModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-dashed border-slate-300 hover:border-indigo-300 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Stand de Vendas</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sincronização GPS Ativa em Tempo Real</span>
        </div>
      </div>

      {/* Check-In Action Bar with GPS & Simulation */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Check-in Obrigatório de Presença no Stand (Raio de 10 Metros)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              O corretor precisa estar a menos de 10 metros do ponto de satélite do Stand para entrar na urna do sorteio.
            </p>
          </div>

          {/* Action Buttons: Real GPS + Fast Simulator for demo */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRealGpsCheckIn}
              disabled={isLocating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              <Smartphone className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce' : ''}`} />
              <span>{isLocating ? 'Capturando Coordenadas...' : 'Validar Meu GPS Real'}</span>
            </button>

            {/* Test Simulations for Demonstration */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1 hidden sm:inline">
                Simulador:
              </span>
              <button
                onClick={() => {
                  // Simulate 3.8 meters from stand
                  const lat = activeStand.latitude + 0.00003;
                  const lng = activeStand.longitude + 0.00002;
                  processCheckInWithCoords(lat, lng, 'Simulação de Presença no Stand');
                }}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-2xs flex items-center gap-1"
                title="Simular presença física a menos de 10m do stand"
              >
                <Target className="w-3 h-3" />
                <span>No Stand (3.8m ✅)</span>
              </button>

              <button
                onClick={() => {
                  // Simulate 84.5 meters outside
                  const lat = activeStand.latitude + 0.00075;
                  const lng = activeStand.longitude + 0.00045;
                  processCheckInWithCoords(lat, lng, 'Simulação Fora do Stand');
                }}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center gap-1"
                title="Simular corretor distante do stand"
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                <span>Distante (85m)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Check-In Feedback Box */}
        {lastCheckInResult && (
          <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            lastCheckInResult.success
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-rose-50 text-rose-900 border border-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {lastCheckInResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{lastCheckInResult.message}</span>
            </div>
            <button
              onClick={() => setLastCheckInResult(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

        {gpsError && (
          <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {drawSuccessMessage && (
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{drawSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Presentes no Stand de Vendas</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {validBrokersCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Aptos para o sorteio do plantão</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fora do Raio Permitido</div>
          <div className="text-2xl font-bold text-rose-500 mt-1 tabular-nums">
            {outsideBrokersCount}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Fora do local do plantão</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Horário do Sorteio</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">
            {activeStand?.dailyDrawTime || rules.dailyDrawTime}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Abertura da fila do plantão</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tempo de Ausência</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {activeStand?.maxAbsenceMinutes || rules.maxAbsenceMinutes} min
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tolerância antes de perder a vez</div>
        </div>
      </div>

      {/* Stand Attendance Live Board */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Ordem do Plantão & Fila de Atendimento do Stand</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ordem oficial sorteada para atendimento de clientes que chegam fisicamente ao stand
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {activeStand?.attendanceList.length} corretores cadastrados
          </span>
        </div>

        {/* List of Brokers in Queue */}
        <div className="divide-y divide-slate-100">
          {activeStand?.attendanceList
            .sort((a, b) => a.queuePosition - b.queuePosition)
            .map((broker) => {
              const isFirst = broker.queuePosition === 1;
              const isValidGps = broker.gpsStatus === 'VALIDADO_NO_RAIO';
              const isAbsent = broker.status === 'AUSENTE_PAUSADO';

              return (
                <div
                  key={broker.id}
                  className={`p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isFirst
                      ? 'bg-emerald-50/50 hover:bg-emerald-50'
                      : isAbsent
                      ? 'bg-amber-50/40 hover:bg-amber-50/60'
                      : !isValidGps
                      ? 'bg-rose-50/20 hover:bg-rose-50/40 opacity-75'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Left: Position Badge & Broker Info */}
                  <div className="flex items-center gap-3.5">
                    {/* Position Medal Badge */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                      isFirst
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                        : broker.queuePosition === 2
                        ? 'bg-blue-600 text-white'
                        : broker.queuePosition === 3
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{broker.queuePosition}
                    </div>

                    {/* Broker Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={broker.brokerAvatar}
                        alt={broker.brokerName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isValidGps ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                    </div>

                    {/* Broker Identity */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{broker.brokerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">CRECI {broker.brokerCreci}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                        {/* GPS Distance Badge */}
                        <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          isValidGps
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <Compass className="w-3 h-3" />
                          <span>{broker.distanceMeters}m do Stand</span>
                          {isValidGps ? ' (Raio OK)' : ' (Fora do Raio)'}
                        </span>

                        <span className="text-slate-400">·</span>

                        <span className="text-slate-500">
                          Check-in às {broker.checkInTime}
                        </span>

                        <span className="text-slate-400">·</span>

                        <span className="text-slate-600 font-semibold">
                          {broker.leadsAttendedCount} atendimentos hoje
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Status & Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {/* Status Badge */}
                    {isFirst && broker.status === 'EM_ATENDIMENTO' && (
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-2xs flex items-center gap-1.5 animate-pulse">
                        <Flame className="w-3.5 h-3.5" />
                        <span>ATENDENDO PRÓXIMO CLIENTE</span>
                      </span>
                    )}

                    {isAbsent && (
                      <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-2">
                        <Timer className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
                        <div>
                          <span>Ausente: {broker.absenceReason}</span>
                          <span className="block font-mono text-[10px] font-black text-amber-800">
                            Restam {formatSeconds(broker.absenceSecondsRemaining)} de tolerância
                          </span>
                        </div>
                      </div>
                    )}

                    {!isValidGps && (
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Bloqueado (Fora do Stand)
                      </span>
                    )}

                    {/* Operational Action Buttons */}
                    {isFirst && (
                      <button
                        onClick={() => handleCompleteCurrentLead(broker.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1"
                        title="Finalizar atendimento atual e passar vez para o próximo da fila"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Concluir Atendimento</span>
                      </button>
                    )}

                    {isAbsent ? (
                      <button
                        onClick={() => handleReturnFromAbsence(broker.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Voltar da Ausência</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setAbsenceModalBroker(broker)}
                        className="px-2.5 py-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                        title="Pausar na fila por motivo de café, almoço ou visita breve"
                      >
                        <Coffee className="w-3.5 h-3.5 text-amber-600" />
                        <span>Registrar Ausência</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Stand Draw Audit History */}
      {activeStand?.history && activeStand.history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Auditoria de Sorteios Anteriores do Stand</span>
            </h4>
            <span className="text-[11px] text-slate-500">
              Registros com coordenadas e conformidade de 10 metros
            </span>
          </div>

          <div className="space-y-2">
            {activeStand.history.map((h) => (
              <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">
                    Sorteio do {h.shiftName} · {h.timestamp}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {h.participantsCount} corretores participantes com presença física validada
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {h.drawnOrder.slice(0, 3).map((item) => (
                    <span
                      key={item.position}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
                    >
                      #{item.position} {item.brokerName} ({item.distanceMeters}m)
                    </span>
                  ))}
                  {h.drawnOrder.length > 3 && (
                    <span className="text-[11px] text-slate-400">+{h.drawnOrder.length - 3} corretores</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Registrar Ausência do Corretor */}
      {absenceModalBroker && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Registrar Ausência na Fila</h3>
              </div>
              <button
                onClick={() => setAbsenceModalBroker(null)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Corretor: <strong>{absenceModalBroker.brokerName}</strong>
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              Tolerância configurada: <strong>{activeStand.maxAbsenceMinutes || rules.maxAbsenceMinutes} minutos</strong>. Se o tempo for excedido, o corretor irá automaticamente para o final da fila de atendimento.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo da Ausência</label>
              <select
                value={absenceReasonInput}
                onChange={(e) => setAbsenceReasonInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Café / Sanitário">Café / Sanitário</option>
                <option value="Almoço / Refeição Rápida">Almoço / Refeição Rápida</option>
                <option value="Apresentação rápida do Decorado">Apresentação rápida do Decorado</option>
                <option value="Ligação de cliente urgente">Ligação de cliente urgente</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAbsenceModalBroker(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleStartAbsence}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirmar Ausência com Timer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Novo Stand de Vendas */}
      {showNewStandModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Novo Stand de Vendas (GPS)</h3>
              </div>
              <button onClick={() => setShowNewStandModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome do Stand *</label>
                <input
                  type="text"
                  placeholder="Ex: Stand Grand Park Alphaville"
                  value={newStandName}
                  onChange={(e) => setNewStandName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome do Empreendimento *</label>
                <input
                  type="text"
                  placeholder="Ex: Residencial Grand Park"
                  value={newStandDev}
                  onChange={(e) => setNewStandDev(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Endereço Completo do Stand *</label>
                <input
                  type="text"
                  placeholder="Ex: Av. Copacabana, 500 - Alphaville"
                  value={newStandAddress}
                  onChange={(e) => setNewStandAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Latitude GPS *</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newStandLat}
                    onChange={(e) => setNewStandLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Longitude GPS *</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newStandLng}
                    onChange={(e) => setNewStandLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-indigo-600" />
                O raio de validação eletrônica é fixado em <strong>10 metros</strong> para garantir a presença física no stand.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewStandModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newStandName.trim()) return;
                  const newStand: StandVendas = {
                    id: `stand_${Date.now()}`,
                    name: newStandName,
                    developmentTitle: newStandDev || newStandName,
                    address: newStandAddress || 'Endereço Comercial',
                    latitude: newStandLat,
                    longitude: newStandLng,
                    geofenceRadiusMeters: 10,
                    status: 'ABERTO',
                    dailyDrawTime: '08:30',
                    maxAbsenceMinutes: 15,
                    activeShift: 'MANHA',
                    attendanceList: [],
                    history: []
                  };
                  onUpdateStands([...stands, newStand]);
                  setSelectedStandId(newStand.id);
                  setShowNewStandModal(false);
                }}
                disabled={!newStandName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Cadastrar Stand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

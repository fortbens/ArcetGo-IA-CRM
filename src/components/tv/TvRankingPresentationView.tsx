import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Building, 
  DollarSign, 
  KeyRound, 
  Zap, 
  Home, 
  Compass, 
  Activity, 
  Award, 
  Users, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  Tv, 
  BellRing, 
  Sun,
  Moon,
  Smartphone,
  Monitor,
  FileSignature,
  FileCheck2,
  Send,
  Plus,
  Bell,
  Megaphone,
  Siren,
  Sliders,
  Target,
  AlertCircle,
  ShieldAlert,
  Building2,
  Radio,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  TvSlideCategory, 
  TvPeriod, 
  TvColorMode,
  TvOrientation,
  BrokerRankingEntry,
  TeamRankingEntry,
  RecentDealAlert,
  TvNoticeItem,
  TvBroadcastingSettings,
  DEFAULT_TV_BROADCASTING_SETTINGS,
  TvLiveBellTrigger,
  TvLiveFlashAlert,
  TvSoundType,
  TV_SOUND_OPTIONS,
  TvSlideDefinition
} from '../../types/tvRanking';
import { 
  TV_SLIDES_CATALOG, 
  MOCK_TEAM_RANKINGS, 
  MOCK_BROKER_RANKINGS, 
  MOCK_RECENT_DEALS,
  playTvChime 
} from '../../data/mockTvRankingData';
import { 
  broadcastTvLiveDealToCloud, 
  subscribeTvLiveDealsFromCloud, 
  getInitialTvLiveDeals,
  getInitialTvBroadcastingSettings,
  subscribeTvBroadcastingSettingsFromCloud,
  getInitialTvNotices,
  subscribeTvNoticesFromCloud,
  subscribeVirtualBellFromCloud,
  subscribeFlashAlertFromCloud
} from '../../services/systemPersistenceService';
import { playTvCustomSound } from '../../utils/tvAudioSynthesizer';
import { TvControlManagementModal } from './TvControlManagementModal';

interface TvRankingPresentationViewProps {
  onExitPresentation?: () => void;
  standalone?: boolean;
  isAdmin?: boolean;
}

export const TvRankingPresentationView: React.FC<TvRankingPresentationViewProps> = ({
  onExitPresentation,
  standalone = false,
  isAdmin = false
}) => {
  // Apresentação limpa de TV: Sem botões operacionais na tela para um visual limpo e cinematográfico de TV.
  // Somente administradores podem alternar e ver botões operacionais.
  const [isCleanPresentationMode, setIsCleanPresentationMode] = useState<boolean>(true);

  const handleCloseTv = useCallback(() => {
    if (onExitPresentation) {
      onExitPresentation();
    } else if (typeof window !== 'undefined') {
      try {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      } catch {
        window.location.href = '/';
      }
    }
  }, [onExitPresentation]);

  // Configuration states with localStorage persistence
  const [colorMode, setColorMode] = useState<TvColorMode>(() => {
    try {
      return (localStorage.getItem('acertgo_tv_colormode') as TvColorMode) || 'DARK';
    } catch {
      return 'DARK';
    }
  });

  const [orientation, setOrientation] = useState<TvOrientation>(() => {
    try {
      return (localStorage.getItem('acertgo_tv_orientation') as TvOrientation) || 'HORIZONTAL';
    } catch {
      return 'HORIZONTAL';
    }
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slideInterval, setSlideInterval] = useState(10); // seconds per slide
  const [period, setPeriod] = useState<TvPeriod>('MES');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [mouseActive, setMouseActive] = useState(true);
  const [liveClock, setLiveClock] = useState({ time: '', date: '' });

  // Live Deals and Celebration State (Sincronizado na Nuvem)
  const [liveRecentDeals, setLiveRecentDeals] = useState<RecentDealAlert[]>(getInitialTvLiveDeals);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [celebrationToast, setCelebrationToast] = useState<{
    id: string;
    type: 'PROPOSTA' | 'CONTRATO';
    title: string;
    brokerName: string;
    brokerAvatar: string;
    valueFormatted: string;
    teamName: string;
    location: string;
  } | null>(null);

  // Configurações Globais de Transmissão da TV e Informativos do Gestor (Firestore / Real-time)
  const [tvSettings, setTvSettings] = useState<TvBroadcastingSettings>(getInitialTvBroadcastingSettings);
  const [notices, setNotices] = useState<TvNoticeItem[]>(getInitialTvNotices);
  const [showTvControlModal, setShowTvControlModal] = useState(false);
  const [virtualBellCelebration, setVirtualBellCelebration] = useState<TvLiveBellTrigger | null>(null);
  const [flashAlert, setFlashAlert] = useState<TvLiveFlashAlert | null>(null);

  // Trigger celebration confetti
  const triggerConfettiExplosion = useCallback(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6']
      });
      if (soundEnabled) {
        playTvChime('victory');
      }
    } catch (e) {
      console.error(e);
    }
  }, [soundEnabled]);

  // Escuta configurações de tempo e alternância salvas pelo Gestor
  useEffect(() => {
    const unsub = subscribeTvBroadcastingSettingsFromCloud((s) => {
      setTvSettings(s);
      if (s.slideIntervalSeconds) setSlideInterval(s.slideIntervalSeconds);
      if (s.colorMode) setColorMode(s.colorMode);
      if (s.orientation) setOrientation(s.orientation);
      if (s.soundEnabled !== undefined) setSoundEnabled(s.soundEnabled);
      if (s.currentPeriod) setPeriod(s.currentPeriod);
    });
    return () => unsub();
  }, []);

  // Escuta informativos, metas e banners cadastrados pelo Gestor
  useEffect(() => {
    const unsub = subscribeTvNoticesFromCloud((n) => {
      setNotices(n);
    });
    return () => unsub();
  }, []);

  // Escuta Toque do Sino Virtual disparado ao vivo pelo Gestor com som selecionado
  useEffect(() => {
    const unsub = subscribeVirtualBellFromCloud((bell) => {
      if (soundEnabled) {
        playTvCustomSound(bell.soundType || 'SINO_TRADICIONAL');
      }
      triggerConfettiExplosion();
      setTimeout(() => triggerConfettiExplosion(), 500);
      setVirtualBellCelebration(bell);
      setTimeout(() => {
        setVirtualBellCelebration(null);
      }, 9500);
    });
    return () => unsub();
  }, [soundEnabled, triggerConfettiExplosion]);

  // Escuta Alerta Flash de Plantão Urgente
  useEffect(() => {
    const unsub = subscribeFlashAlertFromCloud((alert) => {
      setFlashAlert(alert);
      if (alert && alert.active && soundEnabled) {
        playTvCustomSound(alert.soundType || 'ALERTA_FLASH');
      }
    });
    return () => unsub();
  }, [soundEnabled]);

  // Escutar transmissões ao vivo de propostas e contratos disparadas de qualquer celular ou PC
  useEffect(() => {
    const unsub = subscribeTvLiveDealsFromCloud((deals, latestDeal) => {
      setLiveRecentDeals(deals);
      if (latestDeal) {
        if (soundEnabled) {
          playTvChime(latestDeal.dealType === 'LOCACAO' ? 'victory' : 'bell');
        }
        triggerConfettiExplosion();
        setCelebrationToast({
          id: latestDeal.id,
          type: latestDeal.id.startsWith('prop') ? 'PROPOSTA' : 'CONTRATO',
          title: latestDeal.title,
          brokerName: latestDeal.brokerName,
          brokerAvatar: latestDeal.brokerAvatar,
          valueFormatted: latestDeal.valueFormatted,
          teamName: latestDeal.teamName,
          location: latestDeal.location
        });
        setTimeout(() => {
          setCelebrationToast(null);
        }, 8000);
      }
    });
    return () => unsub();
  }, [soundEnabled, triggerConfettiExplosion]);

  // Proposal Form State
  const [propClientName, setPropClientName] = useState('');
  const [propBroker, setPropBroker] = useState('Juliana Mendes');
  const [propProperty, setPropProperty] = useState('');
  const [propValue, setPropValue] = useState('');
  const [propTerms, setPropTerms] = useState('À vista com sinal de 20%');

  // Contract Form State
  const [contractType, setContractType] = useState<'VENDA' | 'LOCACAO'>('VENDA');
  const [contractBroker, setContractBroker] = useState('Juliana Mendes');
  const [contractTeam, setContractTeam] = useState('Equipe Alpha Prime');
  const [contractProperty, setContractProperty] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [contractCommission, setContractCommission] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Montagem do Deck Dinâmico de Apresentação: Intercalando Rankings com Informativos, Metas e Banners
  type TvPresentationSlide = 
    | { kind: 'RANKING'; data: TvSlideDefinition; id: string }
    | { kind: 'NOTICE'; data: TvNoticeItem; id: string };

  const presentationDeck = useMemo<TvPresentationSlide[]>(() => {
    // 1. Filtrar slides de ranking ativos conforme configurações do Gestor
    const activeRankings = TV_SLIDES_CATALOG.filter(s => {
      if (!tvSettings.enabledCategories) return true;
      return tvSettings.enabledCategories[s.id] !== false;
    }).map(s => ({
      kind: 'RANKING' as const,
      data: s,
      id: `ranking_${s.id}`
    }));

    const baseRankings = activeRankings.length > 0 ? activeRankings : TV_SLIDES_CATALOG.map(s => ({
      kind: 'RANKING' as const,
      data: s,
      id: `ranking_${s.id}`
    }));

    // 2. Filtrar avisos/banners ativos cadastrados pelo Gestor
    const activeNotices = notices.filter(n => n.active).map(n => ({
      kind: 'NOTICE' as const,
      data: n,
      id: `notice_${n.id}`
    }));

    if (!tvSettings.interleaveNotices || activeNotices.length === 0) {
      return baseRankings;
    }

    // 3. Intercalar conforme frequência (a cada 1, 2 ou 3 rankings exibe 1 aviso/banner/meta)
    const frequency = tvSettings.noticeIntervalFrequency || 2;
    const result: TvPresentationSlide[] = [];
    let noticeIdx = 0;

    baseRankings.forEach((rSlide, idx) => {
      result.push(rSlide);
      if ((idx + 1) % frequency === 0 && activeNotices.length > 0) {
        result.push(activeNotices[noticeIdx % activeNotices.length]);
        noticeIdx++;
      }
    });

    if (noticeIdx === 0 && activeNotices.length > 0) {
      result.push(activeNotices[0]);
    }

    return result;
  }, [tvSettings.enabledCategories, tvSettings.interleaveNotices, tvSettings.noticeIntervalFrequency, notices]);

  const currentSlideItem = presentationDeck[currentSlideIndex % Math.max(1, presentationDeck.length)] || presentationDeck[0];
  const isNoticeSlide = currentSlideItem?.kind === 'NOTICE';
  const currentNotice = isNoticeSlide ? (currentSlideItem.data as TvNoticeItem) : null;
  const currentSlide = !isNoticeSlide && currentSlideItem ? (currentSlideItem.data as TvSlideDefinition) : TV_SLIDES_CATALOG[0];

  const teamsData = MOCK_TEAM_RANKINGS[period];
  const brokersData = MOCK_BROKER_RANKINGS[currentSlide.id]?.[period] || [];

  const currentSlideDurationSeconds = isNoticeSlide 
    ? (currentNotice?.durationSeconds || slideInterval)
    : slideInterval;

  // Save colorMode preference
  useEffect(() => {
    try {
      localStorage.setItem('acertgo_tv_colormode', colorMode);
    } catch {
      // ignore
    }
  }, [colorMode]);

  // Save orientation preference
  useEffect(() => {
    try {
      localStorage.setItem('acertgo_tv_orientation', orientation);
    } catch {
      // ignore
    }
  }, [orientation]);

  // Direct presentation URL
  const tvDirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?view=tv-ranking`;
  }, []);

  // Generate QR code for Smart TV pairing
  useEffect(() => {
    if (tvDirectUrl) {
      QRCode.toDataURL(tvDirectUrl, {
        width: 260,
        margin: 1.5,
        color: {
          dark: colorMode === 'DARK' ? '#0f172a' : '#1e293b',
          light: '#ffffff'
        }
      }).then(url => {
        setQrCodeDataUrl(url);
      }).catch(err => {
        console.error('Failed to generate TV QR Code', err);
      });
    }
  }, [tvDirectUrl, colorMode]);

  // Live Clock updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      setLiveClock({
        time: timeStr,
        date: dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
      });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide controls on mouse inactivity for true clean TV display
  const handleMouseMove = useCallback(() => {
    setMouseActive(true);
    if (mouseTimerRef.current) {
      clearTimeout(mouseTimerRef.current);
    }
    mouseTimerRef.current = setTimeout(() => {
      setMouseActive(false);
    }, 4500);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
    };
  }, [handleMouseMove]);

  // Move to next slide
  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex(prev => {
      const deckLen = Math.max(1, presentationDeck.length);
      const next = (prev + 1) % deckLen;
      if (next === 0 && soundEnabled) {
        playTvChime('bell');
      } else if (soundEnabled) {
        playTvChime('tick');
      }
      return next;
    });
    setProgressPercent(0);
  }, [soundEnabled, presentationDeck.length]);

  // Move to previous slide
  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex(prev => {
      const deckLen = Math.max(1, presentationDeck.length);
      return (prev - 1 + deckLen) % deckLen;
    });
    setProgressPercent(0);
    if (soundEnabled) playTvChime('tick');
  }, [soundEnabled, presentationDeck.length]);

  // Slideshow progress & autoplay loop
  useEffect(() => {
    if (!isPlaying) return;

    const tickIntervalMs = 100;
    const duration = Math.max(3, currentSlideDurationSeconds);
    const totalTicks = (duration * 1000) / tickIntervalMs;
    let ticksElapsed = 0;

    const timer = setInterval(() => {
      ticksElapsed += 1;
      const currentProgress = (ticksElapsed / totalTicks) * 100;
      setProgressPercent(Math.min(100, currentProgress));

      if (ticksElapsed >= totalTicks) {
        handleNextSlide();
        ticksElapsed = 0;
      }
    }, tickIntervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSlideDurationSeconds, handleNextSlide]);

  // Fullscreen management
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen error', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Exit fullscreen error', err);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showShareModal || showProposalModal || showContractModal) {
        if (e.key === 'Escape') {
          setShowShareModal(false);
          setShowProposalModal(false);
          setShowContractModal(false);
        }
        return;
      }

      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key.toLowerCase() === 'p') {
        setIsPlaying(p => !p);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'm') {
        setSoundEnabled(s => !s);
      } else if (e.key.toLowerCase() === 'c') {
        triggerConfettiExplosion();
      } else if (e.key === 'Escape' && !document.fullscreenElement) {
        handleCloseTv();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide, showShareModal, showProposalModal, showContractModal, triggerConfettiExplosion, handleCloseTv]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tvDirectUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      setCopiedLink(true);
    }
  };

  // Submit Nova Proposta ao Vivo
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propProperty.trim() || !propValue.trim()) return;

    const brokerAvatar = propBroker.includes('Juliana')
      ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
      : propBroker.includes('Carlos')
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';

    const newDeal: RecentDealAlert = {
      id: `prop_${Date.now()}`,
      timestamp: 'Agora mesmo',
      brokerName: propBroker,
      brokerAvatar,
      teamName: 'Equipe Alpha Prime',
      dealType: 'VENDA',
      title: `Nova Proposta Formal: ${propProperty}`,
      valueFormatted: `R$ ${propValue}`,
      commissionFormatted: `Cliente: ${propClientName || 'Cliente Qualificado'} · ${propTerms}`,
      location: 'Salão de Vendas AcertGo'
    };

    setLiveRecentDeals(prev => [newDeal, ...prev]);
    setShowProposalModal(false);

    // Transmitir para a nuvem para que todas as TVs e dispositivos recebam ao mesmo tempo
    broadcastTvLiveDealToCloud(newDeal).catch(err => console.warn('Erro ao transmitir proposta:', err));

    // Trigger celebration
    if (soundEnabled) playTvChime('victory');
    triggerConfettiExplosion();

    setCelebrationToast({
      id: newDeal.id,
      type: 'PROPOSTA',
      title: `Nova Proposta Formal Registrada!`,
      brokerName: propBroker,
      brokerAvatar,
      valueFormatted: `R$ ${propValue}`,
      teamName: 'Equipe Alpha Prime',
      location: propProperty
    });

    setTimeout(() => {
      setCelebrationToast(null);
    }, 7000);

    // Reset fields
    setPropProperty('');
    setPropValue('');
    setPropClientName('');
  };

  // Submit Novo Contrato ao Vivo (Bater o Sino!)
  const handleSubmitContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractProperty.trim() || !contractValue.trim()) return;

    const brokerAvatar = contractBroker.includes('Juliana')
      ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
      : contractBroker.includes('Carlos')
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      : contractBroker.includes('Beatriz')
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';

    const formattedVal = contractValue.startsWith('R$') ? contractValue : `R$ ${contractValue}${contractType === 'LOCACAO' ? '/mês' : ''}`;

    const newDeal: RecentDealAlert = {
      id: `deal_${Date.now()}`,
      timestamp: 'Agora mesmo',
      brokerName: contractBroker,
      brokerAvatar,
      teamName: contractTeam,
      dealType: contractType,
      title: `${contractType === 'VENDA' ? 'Escritura & Sinal de Venda' : 'Contrato de Locação Assinado'}: ${contractProperty}`,
      valueFormatted: formattedVal,
      commissionFormatted: contractCommission ? `Comissão Gerada: R$ ${contractCommission}` : 'Meta do Salão Superada!',
      location: 'Salão de Vendas AcertGo'
    };

    setLiveRecentDeals(prev => [newDeal, ...prev]);
    setShowContractModal(false);

    // Transmitir para a nuvem para que todas as TVs e dispositivos recebam ao mesmo tempo
    broadcastTvLiveDealToCloud(newDeal).catch(err => console.warn('Erro ao transmitir contrato:', err));

    // Ring the Bell & Massive celebration
    if (soundEnabled) playTvChime('bell');
    triggerConfettiExplosion();
    setTimeout(() => triggerConfettiExplosion(), 400);

    setCelebrationToast({
      id: newDeal.id,
      type: 'CONTRATO',
      title: `NOVO CONTRATO ASSINADO! SINO TOCADO!`,
      brokerName: contractBroker,
      brokerAvatar,
      valueFormatted: formattedVal,
      teamName: contractTeam,
      location: contractProperty
    });

    setTimeout(() => {
      setCelebrationToast(null);
    }, 9000);

    // Reset fields
    setContractProperty('');
    setContractValue('');
    setContractCommission('');
  };

  // Color theme variables based on colorMode
  const isDark = colorMode === 'DARK';

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden select-none flex flex-col justify-between font-sans transition-colors duration-500 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
      } ${!mouseActive && !showShareModal && !showProposalModal && !showContractModal ? 'cursor-none' : ''}`}
      style={{
        backgroundImage: isDark 
          ? 'radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #090d16 65%, #020617 100%)'
          : 'radial-gradient(ellipse at 50% 0%, #f1f5f9 0%, #e2e8f0 70%, #cbd5e1 100%)'
      }}
    >
      {/* Decorative ambient glowing beams */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-400/15'
      }`} />
      <div className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDark ? 'bg-amber-500/10' : 'bg-amber-400/20'
      }`} />
      <div className={`absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDark ? 'bg-emerald-500/10' : 'bg-emerald-400/15'
      }`} />

      {/* ========================================================================= */}
      {/* VIRTUAL SALES BELL CELEBRATION (DISPARADO PELO GESTOR/ADMIN AO VIVO)      */}
      {/* ========================================================================= */}
      {virtualBellCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className={`relative max-w-2xl w-full p-6 sm:p-8 rounded-3xl border-2 shadow-2xl text-center overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 border-amber-400 text-white shadow-amber-500/40' 
              : 'bg-gradient-to-b from-amber-100 via-white to-amber-50 border-amber-400 text-slate-900 shadow-amber-500/30'
          }`}>
            {/* Top Sound Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md mb-4 animate-bounce">
              {virtualBellCelebration.soundType === 'BUZINA_FESTA' ? (
                <>
                  <Megaphone className="w-4 h-4" />
                  <span>BUZINA DE COMEMORAÇÃO TOCADA NO SALÃO!</span>
                </>
              ) : virtualBellCelebration.soundType === 'SIRENE_POLICIA' ? (
                <>
                  <Siren className="w-4 h-4 text-red-700" />
                  <span>SIRENE DE QUEBRA DE RECORDE!</span>
                </>
              ) : virtualBellCelebration.soundType === 'FANFARRA_TRIUNFO' ? (
                <>
                  <Award className="w-4 h-4" />
                  <span>FANFARRA TRIUNFAL DE VITÓRIA!</span>
                </>
              ) : virtualBellCelebration.soundType === 'ALERTA_FLASH' ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-900" />
                  <span>⚡ ALERTA ESPECIAL DA GESTÃO!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>SINO DE VENDAS TOCADO AO VIVO!</span>
                </>
              )}
            </div>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
              {virtualBellCelebration.title}
            </h2>

            {/* Details Box */}
            <div className={`my-5 p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-slate-900/90 border-amber-500/30' : 'bg-white border-amber-200 shadow-sm'
            }`}>
              <div className="text-left">
                <div className="text-xs uppercase font-extrabold tracking-wider text-amber-500">Corretor / Equipe</div>
                <div className="text-lg sm:text-xl font-black mt-0.5">{virtualBellCelebration.brokerName || 'Corretor Destaque'}</div>
                {virtualBellCelebration.teamName && (
                  <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{virtualBellCelebration.teamName}</div>
                )}
              </div>

              {virtualBellCelebration.valueFormatted && (
                <div className="text-right">
                  <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-500">Valor Homologado</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono tabular-nums">{virtualBellCelebration.valueFormatted}</div>
                </div>
              )}
            </div>

            {/* Pulsating Audio Sound Wave Visualizer */}
            <div className="flex items-center justify-center gap-1.5 my-4">
              {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-amber-400 rounded-full animate-pulse"
                  style={{
                    height: `${h * 0.4}px`,
                    animationDelay: `${i * 90}ms`,
                    animationDuration: '600ms'
                  }}
                />
              ))}
            </div>

            <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Transmissão autorizada pela Gestão da Imobiliária · {virtualBellCelebration.timestamp || 'Agora'}
            </p>

            <button
              onClick={() => setVirtualBellCelebration(null)}
              className="mt-5 px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              Continuar Apresentação
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE FLASH ALERT BANNER (URGENTE / PLANTÃO DA DIRETORIA)                  */}
      {/* ========================================================================= */}
      {flashAlert && flashAlert.active && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-3 shadow-2xl border-b-2 border-white/60 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 animate-pulse shrink-0">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white text-red-700 text-[10px] font-black uppercase tracking-wider">
                    {flashAlert.title}
                  </span>
                  <span className="text-xs font-semibold opacity-90">Por: {flashAlert.senderName} ({flashAlert.senderRole})</span>
                </div>
                <p className="text-xs sm:text-sm font-extrabold mt-0.5 tracking-tight">{flashAlert.message}</p>
              </div>
            </div>

            <button
              onClick={() => setFlashAlert(null)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE CELEBRATION OVERLAY BANNER (When proposal or contract is closed)      */}
      {/* ========================================================================= */}
      {celebrationToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top-6 duration-300">
          <div className={`p-4 sm:p-5 rounded-3xl border-2 shadow-2xl flex items-center gap-4 ${
            celebrationToast.type === 'CONTRATO'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border-white shadow-amber-500/40 animate-pulse'
              : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-blue-400 shadow-blue-500/30'
          }`}>
            <div className="relative shrink-0">
              <img 
                src={celebrationToast.brokerAvatar} 
                alt={celebrationToast.brokerName} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 text-xl">
                {celebrationToast.type === 'CONTRATO' ? '🔔' : '🚀'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  celebrationToast.type === 'CONTRATO' ? 'bg-slate-950 text-amber-300' : 'bg-blue-500 text-white'
                }`}>
                  {celebrationToast.title}
                </span>
                <span className="text-xs font-bold opacity-80">{celebrationToast.teamName}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black truncate mt-0.5">{celebrationToast.brokerName}</h3>
              <p className="text-xs font-semibold truncate opacity-90">{celebrationToast.location}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs uppercase font-extrabold tracking-wider opacity-80">Valor Fechado</div>
              <div className="font-mono text-xl sm:text-2xl font-black tabular-nums">{celebrationToast.valueFormatted}</div>
            </div>
            <button 
              onClick={() => setCelebrationToast(null)}
              className="p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR: Live Branding, Clock, Toggles & Live Action Buttons    */}
      {/* ========================================================================= */}
      <header className={`relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b backdrop-blur-md shrink-0 transition-colors ${
        isDark ? 'border-slate-800/80 bg-slate-950/75' : 'border-slate-200/90 bg-white/80 shadow-xs'
      }`}>
        {/* Left: Branding & Live Ticker Indicator */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-base tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AcertGo
                </span>
                <span className={isDark ? 'text-slate-500 font-light' : 'text-slate-300 font-light'}>|</span>
                <span className="text-xs font-bold tracking-wider uppercase text-amber-500">Salão de Vendas</span>
              </div>
              <div className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Painel Corporativo & Ranking em Tempo Real
              </div>
            </div>
          </div>

          <div className={`h-6 w-px hidden sm:block ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Pulse Live Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/50 border border-red-500/40 text-red-500 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500" />
            <span className="hidden md:inline">AO VIVO NA TV</span>
            <span className="md:hidden">AO VIVO</span>
          </div>

          {/* Period Filter */}
          <div className={`hidden lg:flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Período:</span>
            <div className={`flex items-center border rounded-md p-0.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              {(['MES', 'TRIMESTRE', 'ANO'] as TvPeriod[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    period === p 
                      ? 'bg-amber-500 text-slate-950 shadow-xs' 
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p === 'MES' ? 'Mês' : p === 'TRIMESTRE' ? 'Trimestre' : 'Ano'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Slide Category Title with Pill Indicator */}
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isNoticeSlide && currentNotice 
                ? (currentNotice.badgeText || currentNotice.category.replace(/_/g, ' ')) 
                : currentSlide.kicker}
            </span>
          </div>
          <h1 className={`text-base sm:text-lg font-bold tracking-tight truncate max-w-md ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isNoticeSlide && currentNotice ? currentNotice.title : currentSlide.title}
          </h1>
        </div>

        {/* Right: Live Actions, Toggles, Clock & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* SE ADMINISTRADOR: Toggle para alternar entre Apresentação Limpa de TV e Modo Gestor */}
          {isAdmin && (
            <button
              onClick={() => setIsCleanPresentationMode(m => !m)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                isCleanPresentationMode
                  ? isDark 
                    ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300' 
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
              }`}
              title={isCleanPresentationMode ? 'Alternar para Painel do Gestor (Exibir botões operacionais)' : 'Alternar para Apresentação Limpa de TV (Ocultar botões operacionais)'}
            >
              {isCleanPresentationMode ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{isCleanPresentationMode ? 'Apresentação Limpa' : 'Painel Gestor'}</span>
            </button>
          )}

          {/* BOTÕES OPERACIONAIS: Exibidos APENAS para Administradores quando o Painel do Gestor estiver ativado */}
          {isAdmin && !isCleanPresentationMode && (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
              {/* GESTÃO DA TV & SINO VIRTUAL (PELO GESTOR/ADMIN) */}
              <button
                onClick={() => setShowTvControlModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
                title="Painel de Gestão da TV: Tocar Sino Virtual, Informativos, Metas, Avisos, Banners e Alternância"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden sm:inline">Gestão TV & Sino</span>
              </button>

              <button
                onClick={() => setShowProposalModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
                title="Registrar Nova Proposta ao Vivo no Salão"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">+ Nova Proposta</span>
              </button>

              <button
                onClick={() => setShowContractModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer animate-bounce duration-1000"
                title="Bater o Sino & Registrar Novo Contrato Fechado!"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Tocar o Sino!</span>
              </button>

              {/* TOGGLE 1: MODO DIURNO VS NOTURNO */}
              <button
                onClick={() => setColorMode(m => m === 'DARK' ? 'LIGHT' : 'DARK')}
                title={isDark ? 'Alternar para Modo Diurno (Cores Claras)' : 'Alternar para Modo Noturno (Cores Escuras)'}
                className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300' 
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* TOGGLE 2: ORIENTAÇÃO HORIZONTAL (16:9) VS VERTICAL (TOTEM / RETRATO) */}
              <button
                onClick={() => setOrientation(o => o === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL')}
                title={orientation === 'HORIZONTAL' ? 'Alternar para Formato Vertical (Totem / Display Retrato)' : 'Alternar para Formato Horizontal (16:9 TV)'}
                className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  orientation === 'VERTICAL'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
                }`}
              >
                {orientation === 'HORIZONTAL' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                <span className="hidden 2xl:inline">{orientation === 'HORIZONTAL' ? '16:9' : 'Totem'}</span>
              </button>

              {/* Audio Chimes Toggle */}
              <button
                onClick={() => setSoundEnabled(s => !s)}
                title={soundEnabled ? 'Silenciar Áudio (Tecla M)' : 'Ativar Fanfarra & Sons (Tecla M)'}
                className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  soundEnabled 
                    ? isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700' 
                    : 'bg-red-950/40 border-red-800/60 text-red-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Transmit QR Code Modal */}
              <button
                onClick={() => setShowShareModal(true)}
                title="Abrir Link da TV / QR Code"
                className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                <Tv className="w-4 h-4 text-blue-500" />
              </button>
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Sair de Tela Cheia (Tecla F)' : 'Modo Tela Cheia (Tecla F)'}
            className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Live Clock */}
          <div className="text-right hidden md:block">
            <div className={`font-mono text-sm sm:text-base font-bold tabular-nums tracking-wide flex items-center justify-end gap-1 ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{liveClock.time || '--:--:--'}</span>
            </div>
            <div className={`text-[9px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{liveClock.date}</div>
          </div>

          {/* BOTÃO "X" PARA FECHAR O PAINEL TV E VOLTAR AO CRM (SEMPRE PRESENTE) */}
          <button
            onClick={handleCloseTv}
            title="Fechar Apresentação TV e Voltar ao CRM (Tecla Esc)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all ml-1 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
              isDark 
                ? 'bg-red-500/15 hover:bg-red-500/30 border-red-500/30 hover:border-red-500/60 text-red-300' 
                : 'bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-400 text-red-700'
            }`}
          >
            <X className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Fechar TV</span>
          </button>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN STAGE: Animated Presentation Slide View (Adaptive 16:9 / Totem)    */}
      {/* ========================================================================= */}
      <main className={`relative z-10 flex-1 w-full mx-auto px-4 sm:px-6 py-4 flex flex-col justify-center overflow-y-auto ${
        orientation === 'VERTICAL' ? 'max-w-2xl' : 'max-w-[1600px]'
      }`}>
        
        {/* ========================================================================= */}
        {/* SLIDE DE INFORMATIVO, METAS OU PROPAGANDA/BANNER (GERENCIADO PELO GESTOR) */}
        {/* ========================================================================= */}
        {isNoticeSlide && currentNotice && (
          <div className="w-full flex flex-col justify-center items-center animate-in fade-in zoom-in-95 duration-500 py-2 sm:py-4">
            <div className={`w-full max-w-5xl rounded-3xl border-2 p-6 sm:p-10 shadow-2xl transition-all ${
              isDark 
                ? 'bg-slate-900/90 border-slate-800 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              {/* Category Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${
                    currentNotice.category.includes('META')
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : currentNotice.category.includes('PROPAGANDA') || currentNotice.category.includes('LANCAMENTO')
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                      : currentNotice.category.includes('REUNIAO')
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {currentNotice.category.includes('META') ? (
                      <Target className="w-4 h-4 text-emerald-400" />
                    ) : currentNotice.category.includes('PROPAGANDA') || currentNotice.category.includes('LANCAMENTO') ? (
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    ) : currentNotice.category.includes('REUNIAO') ? (
                      <Users className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Megaphone className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{currentNotice.badgeText || currentNotice.category.replace(/_/g, ' ')}</span>
                  </span>

                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ★ Informativo da Gestão Salão de Vendas ★
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold opacity-80">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Duração: {currentNotice.durationSeconds || slideInterval}s</span>
                </div>
              </div>

              {/* Content Grid: Split (if banner image) or Full */}
              <div className={`grid gap-8 items-center ${
                currentNotice.imageUrl && orientation === 'HORIZONTAL' 
                  ? 'grid-cols-1 md:grid-cols-12' 
                  : 'grid-cols-1'
              }`}>
                {/* Text Block */}
                <div className={currentNotice.imageUrl && orientation === 'HORIZONTAL' ? 'md:col-span-7' : 'w-full'}>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
                    {currentNotice.title}
                  </h2>

                  {currentNotice.subtitle && (
                    <h3 className={`text-base sm:text-xl font-bold mb-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {currentNotice.subtitle}
                    </h3>
                  )}

                  <p className={`text-sm sm:text-lg leading-relaxed font-medium mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {currentNotice.message}
                  </p>

                  {/* Target Progress Bar (Metas) */}
                  {(currentNotice.targetHighlight || currentNotice.targetPercent !== undefined) && (
                    <div className={`p-4 sm:p-5 rounded-2xl border mb-6 ${
                      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                          <Target className="w-4 h-4 shrink-0" />
                          <span>{currentNotice.targetHighlight || 'Atingimento de Meta Comercial'}</span>
                        </span>
                        {currentNotice.targetPercent !== undefined && (
                          <span className="font-mono text-xl font-black text-emerald-500 tabular-nums">
                            {currentNotice.targetPercent}%
                          </span>
                        )}
                      </div>

                      {currentNotice.targetPercent !== undefined && (
                        <div className={`w-full h-3.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, Math.max(0, currentNotice.targetPercent))}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Author Footnote */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/40">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                      AG
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">{currentNotice.authorName}</div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentNotice.authorRole}</div>
                    </div>
                  </div>
                </div>

                {/* Image / Banner Graphic */}
                {currentNotice.imageUrl && (
                  <div className={orientation === 'HORIZONTAL' ? 'md:col-span-5' : 'w-full'}>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl group">
                      <img 
                        src={currentNotice.imageUrl} 
                        alt={currentNotice.title}
                        className="w-full h-64 sm:h-80 object-cover transform transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold truncate">
                        {currentNotice.badgeText || 'Campanha em Destaque'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* SLIDE 1: PÓDIO GERAL DAS ESTRELAS (Top 3) */}
        {!isNoticeSlide && currentSlide.id === 'PODIUM_GERAL' && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            {/* Header info */}
            <div className="text-center mb-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                ★ Troféu Estrelas do Imobiliário · {period === 'MES' ? 'Mês Vigente' : period === 'ANO' ? 'Hall da Fama Anual' : 'Trimestre Q3'} ★
              </span>
              <h2 className={`text-xl sm:text-3xl font-black mt-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Pódio dos Campeões Gerais de Faturamento
              </h2>
              <p className={`text-xs sm:text-sm mt-0.5 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Corretores com mais alto Volume Geral de Vendas (VGV) e fechamentos no salão
              </p>
            </div>

            {/* ADAPTIVE PODIUM: 3-column on Horizontal, Stacked on Vertical Totem */}
            {orientation === 'HORIZONTAL' ? (
              <div className="w-full max-w-4xl grid grid-cols-3 gap-3 sm:gap-6 items-end mt-2">
                
                {/* 2º LUGAR (Prata - Esquerda) */}
                {brokersData[1] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-6 duration-700 delay-150">
                    <div className="relative mb-3">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full p-1 bg-gradient-to-tr from-slate-400 to-slate-200 shadow-xl shadow-slate-400/20">
                        <img 
                          src={brokersData[1].avatar} 
                          alt={brokersData[1].name}
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full shadow-md border-2 border-slate-900">
                        2º
                      </div>
                    </div>

                    <div className="text-center mb-2">
                      <h3 className={`font-extrabold text-sm sm:text-base lg:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {brokersData[1].name}
                      </h3>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{brokersData[1].team}</div>
                    </div>

                    <div className={`w-full h-44 sm:h-52 lg:h-56 rounded-t-2xl border-t-4 border-slate-400 flex flex-col justify-between p-3 sm:p-4 text-center shadow-lg ${
                      isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-slate-200 to-slate-100'
                    }`}>
                      <div>
                        <div className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          VGV Intermediado
                        </div>
                        <div className={`font-mono text-base sm:text-xl lg:text-2xl font-black tabular-nums mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                          {brokersData[1].primaryValue}
                        </div>
                        <div className={`text-[10px] sm:text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{brokersData[1].secondaryMetric}</div>
                      </div>
                      <div className={`py-1 px-2 rounded-lg text-[10px] sm:text-xs font-bold ${
                        isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-300/80 text-slate-800'
                      }`}>
                        {brokersData[1].targetPercent}% da Meta
                      </div>
                    </div>
                  </div>
                )}

                {/* 1º LUGAR (Ouro - Centro, Mais Alto) */}
                {brokersData[0] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 z-10">
                    <div className="animate-bounce duration-1000 mb-1">
                      <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                    </div>

                    <div className="relative mb-3">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full p-1.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-2xl shadow-amber-500/40 animate-pulse">
                        <img 
                          src={brokersData[0].avatar} 
                          alt={brokersData[0].name}
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-sm sm:text-base font-black px-3.5 py-0.5 rounded-full shadow-lg border-2 border-slate-950 flex items-center gap-1">
                        <span>1º</span>
                      </div>
                    </div>

                    <div className="text-center mb-2">
                      <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">GRANDE CAMPEÃ</div>
                      <h3 className={`font-black text-base sm:text-xl lg:text-2xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {brokersData[0].name}
                      </h3>
                      <div className="text-xs font-semibold text-amber-600">{brokersData[0].team}</div>
                    </div>

                    <div className={`w-full h-56 sm:h-64 lg:h-72 rounded-t-2xl border-t-4 border-amber-400 flex flex-col justify-between p-4 text-center shadow-2xl ${
                      isDark ? 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 shadow-amber-500/10' : 'bg-gradient-to-b from-amber-100 via-white to-slate-100 shadow-amber-400/20'
                    }`}>
                      <div>
                        <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">Líder Absoluta</div>
                        <div className={`font-mono text-xl sm:text-2xl lg:text-3xl font-black tabular-nums drop-shadow-sm mt-1 ${isDark ? 'text-yellow-300' : 'text-amber-600'}`}>
                          {brokersData[0].primaryValue}
                        </div>
                        <div className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{brokersData[0].secondaryMetric}</div>
                      </div>
                      <div>
                        <div className="py-1.5 px-3 rounded-xl bg-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-md">
                          {brokersData[0].targetPercent}% da Meta Atingida!
                        </div>
                        {brokersData[0].highlightNote && (
                          <div className="text-[10px] text-amber-600 mt-1 italic line-clamp-1 font-medium">
                            {brokersData[0].highlightNote}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3º LUGAR (Bronze - Direita) */}
                {brokersData[2] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 delay-300">
                    <div className="relative mb-3">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-800 to-amber-600 shadow-xl shadow-amber-900/30">
                        <img 
                          src={brokersData[2].avatar} 
                          alt={brokersData[2].name}
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full shadow-md border-2 border-slate-900">
                        3º
                      </div>
                    </div>

                    <div className="text-center mb-2">
                      <h3 className={`font-extrabold text-sm sm:text-base lg:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {brokersData[2].name}
                      </h3>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{brokersData[2].team}</div>
                    </div>

                    <div className={`w-full h-36 sm:h-44 lg:h-48 rounded-t-2xl border-t-4 border-amber-700 flex flex-col justify-between p-3 sm:p-4 text-center shadow-lg ${
                      isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-slate-200 to-slate-100'
                    }`}>
                      <div>
                        <div className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          VGV Intermediado
                        </div>
                        <div className={`font-mono text-base sm:text-xl lg:text-2xl font-black tabular-nums mt-0.5 ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
                          {brokersData[2].primaryValue}
                        </div>
                        <div className={`text-[10px] sm:text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{brokersData[2].secondaryMetric}</div>
                      </div>
                      <div className={`py-1 px-2 rounded-lg text-[10px] sm:text-xs font-bold ${
                        isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-300/80 text-slate-800'
                      }`}>
                        {brokersData[2].targetPercent}% da Meta
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* VERTICAL TOTEM PODIUM (Optimized for Portrait Totem 9:16) */
              <div className="w-full flex flex-col gap-3 max-w-xl mx-auto mt-2">
                {/* 1st Place Hero Card */}
                {brokersData[0] && (
                  <div className={`p-4 rounded-3xl border-2 border-amber-500 shadow-xl flex items-center justify-between gap-4 ${
                    isDark ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900' : 'bg-gradient-to-r from-amber-50 via-white to-amber-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={brokersData[0].avatar} 
                          alt={brokersData[0].name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 p-1 rounded-full shadow-sm font-black text-xs">
                          👑
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-500">1º Lugar · Campeã Geral</span>
                        <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{brokersData[0].name}</h3>
                        <div className="text-xs text-amber-600 font-semibold">{brokersData[0].team}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-black text-amber-500 tabular-nums">{brokersData[0].primaryValue}</div>
                      <div className="text-xs font-bold text-emerald-500">{brokersData[0].targetPercent}% Meta</div>
                    </div>
                  </div>
                )}

                {/* 2nd and 3rd Place side-by-side in Totem */}
                <div className="grid grid-cols-2 gap-3">
                  {brokersData[1] && (
                    <div className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-md bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center">2º</span>
                        <img src={brokersData[1].avatar} alt={brokersData[1].name} className="w-9 h-9 rounded-full object-cover" />
                      </div>
                      <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{brokersData[1].name}</h4>
                      <div className="font-mono text-sm font-bold text-slate-400 mt-1">{brokersData[1].primaryValue}</div>
                      <div className="text-[11px] text-emerald-500 font-semibold">{brokersData[1].targetPercent}% da meta</div>
                    </div>
                  )}

                  {brokersData[2] && (
                    <div className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-md bg-amber-800 text-amber-100 font-black text-xs flex items-center justify-center">3º</span>
                        <img src={brokersData[2].avatar} alt={brokersData[2].name} className="w-9 h-9 rounded-full object-cover" />
                      </div>
                      <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{brokersData[2].name}</h4>
                      <div className="font-mono text-sm font-bold text-slate-400 mt-1">{brokersData[2].primaryValue}</div>
                      <div className="text-[11px] text-emerald-500 font-semibold">{brokersData[2].targetPercent}% da meta</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SLIDE 2: EQUIPE CAMPEÃ DO MÊS E DO ANO */}
        {!isNoticeSlide && currentSlide.id === 'EQUIPE_CAMPEA' && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-500 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                ★ Competição de Squads · Liderança Coletiva ★
              </span>
              <h2 className={`text-xl sm:text-3xl font-black mt-1.5 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ranking de Equipes Campeãs ({period === 'MES' ? 'Mês Vigente' : period === 'ANO' ? 'Retrospectiva Anual' : 'Trimestre'})
              </h2>
            </div>

            <div className={`grid gap-4 items-stretch ${orientation === 'VERTICAL' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
              
              {/* Champion Team Big Spotlight Card */}
              {teamsData[0] && (
                <div className={`${orientation === 'VERTICAL' ? 'w-full' : 'lg:col-span-7'} rounded-3xl p-5 sm:p-6 border-2 border-amber-500 shadow-2xl flex flex-col justify-between ${
                  isDark ? 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900' : 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/60'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                          1º Lugar Geral
                        </span>
                        <span className="text-xs font-bold text-amber-600">{teamsData[0].badge}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                        <Trophy className="w-4 h-4" />
                        <span>{teamsData[0].monthlyTrophies} Troféus Conquistados</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-xl shrink-0">
                        <img 
                          src={teamsData[0].managerAvatar} 
                          alt={teamsData[0].managerName}
                          className="w-full h-full object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{teamsData[0].teamName}</h3>
                        <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          Liderada por: <strong className="text-amber-500">{teamsData[0].managerName}</strong> · {teamsData[0].membersCount} Corretores
                        </p>
                        <p className={`text-xs italic mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>"{teamsData[0].motto}"</p>
                      </div>
                    </div>

                    {/* Team Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2.5 my-3">
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>VGV da Equipe</div>
                        <div className="font-mono text-base sm:text-lg font-black text-amber-500 tabular-nums">
                          {teamsData[0].vgvFormatted}
                        </div>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Contratos Fechados</div>
                        <div className="font-mono text-base sm:text-lg font-black text-emerald-500 tabular-nums">
                          {teamsData[0].contractsCount}
                        </div>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Meta do Squad</div>
                        <div className="font-mono text-base sm:text-lg font-black text-amber-500 tabular-nums">
                          {teamsData[0].targetPercent}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Atingimento da Meta Coletiva</span>
                        <span className="text-amber-500 font-mono font-bold">{teamsData[0].targetPercent}%</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (teamsData[0].targetPercent / 150) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <div>Destaque Individual: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{teamsData[0].topPerformerName}</strong></div>
                    <div className="text-amber-500 font-bold">Squad Campeão</div>
                  </div>
                </div>
              )}

              {/* Other Competing Teams */}
              <div className={`${orientation === 'VERTICAL' ? 'w-full' : 'lg:col-span-5'} flex flex-col gap-2.5 justify-between`}>
                {teamsData.slice(1).map(team => (
                  <div 
                    key={team.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                        team.rank === 2 ? 'bg-slate-300 text-slate-950' : team.rank === 3 ? 'bg-amber-800 text-amber-100' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {team.rank}º
                      </div>
                      <img 
                        src={team.managerAvatar} 
                        alt={team.managerName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-500/40"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{team.teamName}</h4>
                        <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{team.managerName} · {team.membersCount} corretores</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono text-sm font-bold tabular-nums ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{team.vgvFormatted}</div>
                      <div className="text-xs font-semibold text-emerald-500">{team.targetPercent}% meta</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* SLIDE 3 AO 9: LEADERBOARDS CATEGORIES */}
        {!isNoticeSlide && currentSlide.id !== 'PODIUM_GERAL' && currentSlide.id !== 'EQUIPE_CAMPEA' && currentSlide.id !== 'MURAL_CONQUISTAS' && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-500">
            <div className={`flex items-center justify-between mb-3 pb-2 border-b ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>{currentSlide.title}</span>
                </span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentSlide.subtitle}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Período: <strong className="text-amber-500">{period === 'MES' ? 'Mês Vigente' : period === 'ANO' ? 'Anual' : 'Trimestral'}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {brokersData.slice(0, orientation === 'VERTICAL' ? 4 : 5).map((broker, idx) => (
                <div 
                  key={broker.id}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    idx === 0 
                      ? isDark 
                        ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/80 shadow-md' 
                        : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-400 shadow-sm'
                      : isDark
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      idx === 0 
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950' 
                        : idx === 1 
                        ? 'bg-slate-300 text-slate-950' 
                        : idx === 2 
                        ? 'bg-amber-800 text-amber-100' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx === 0 ? '1' : `${idx + 1}º`}
                    </div>

                    <div className="relative shrink-0">
                      <img 
                        src={broker.avatar} 
                        alt={broker.name}
                        className={`w-11 h-11 rounded-full object-cover border-2 ${
                          idx === 0 ? 'border-amber-400' : 'border-slate-500/40'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {broker.name}
                        </h3>
                        {broker.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 border border-amber-500/30">
                            {broker.badge}
                          </span>
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{broker.role}</span>
                        <span>·</span>
                        <span className="font-medium">{broker.team}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-mono text-base sm:text-xl font-black tabular-nums ${
                      idx === 0 ? 'text-amber-500' : isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {broker.primaryValue}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {broker.secondaryMetric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLIDE 10: MURAL DE CONQUISTAS EM TEMPO REAL */}
        {!isNoticeSlide && currentSlide.id === 'MURAL_CONQUISTAS' && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                ★ Fechamentos ao Vivo · Salão de Vendas ★
              </span>
              <h2 className={`text-xl sm:text-3xl font-black mt-1.5 tracking-tight flex items-center justify-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <BellRing className="w-6 h-6 text-amber-500 animate-bounce" />
                <span>Mural de Vitórias & Fechamentos Recentes</span>
              </h2>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Negócios registrados e sino tocado no salão de vendas
              </p>
            </div>

            <div className={`grid gap-3 ${orientation === 'VERTICAL' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {liveRecentDeals.slice(0, orientation === 'VERTICAL' ? 4 : 6).map((deal) => (
                <div 
                  key={deal.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3.5 shadow-md ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <img 
                    src={deal.brokerAvatar} 
                    alt={deal.brokerName}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/60 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-500 truncate">{deal.brokerName} ({deal.teamName})</span>
                      <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{deal.timestamp}</span>
                    </div>
                    <h4 className={`text-sm sm:text-base font-extrabold mt-0.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {deal.title}
                    </h4>
                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                      isDark ? 'border-slate-800' : 'border-slate-100'
                    }`}>
                      <span className="font-mono text-base font-black text-emerald-500 tabular-nums">{deal.valueFormatted}</span>
                      <span className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{deal.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM CONTROLS & CONTINUOUS PROGRESS BAR                               */}
      {/* ========================================================================= */}
      <footer className={`relative z-20 shrink-0 border-t backdrop-blur-md transition-colors ${
        isDark ? 'border-slate-800/80 bg-slate-950/80' : 'border-slate-200 bg-white/90 shadow-sm'
      }`}>
        <div className={`w-full h-1 overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* Slide Navigator Dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {presentationDeck.map((slideItem, idx) => {
              const isNotice = slideItem.kind === 'NOTICE';
              const title = isNotice ? (slideItem.data as TvNoticeItem).title : (slideItem.data as TvSlideDefinition).title;
              const badge = isNotice ? '📢' : `${idx + 1}.`;

              return (
                <button
                  key={slideItem.id || idx}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setProgressPercent(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    currentSlideIndex === idx 
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                      : isNotice
                      ? isDark
                        ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                      : isDark 
                      ? 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={title}
                >
                  <span>{badge}</span>
                  <span className="hidden xl:inline max-w-[120px] truncate">{title}</span>
                </button>
              );
            })}
          </div>

          {/* Speed & Playback */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`hidden sm:flex items-center gap-1 border rounded-lg p-0.5 text-xs ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <span className="px-1.5 text-[11px]">Tempo:</span>
              {[5, 10, 15, 20].map(sec => (
                <button
                  key={sec}
                  onClick={() => setSlideInterval(sec)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                    slideInterval === sec 
                      ? 'bg-amber-500 text-slate-950' 
                      : isDark ? 'hover:text-white' : 'hover:text-slate-950'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className={`flex items-center gap-1 border rounded-xl p-1 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={handlePrevSlide}
                title="Slide Anterior"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(p => !p)}
                title={isPlaying ? 'Pausar' : 'Iniciar'}
                className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleNextSlide}
                title="Próximo Slide"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 4. MODAL: NOVA PROPOSTA AO VIVO NO SALÃO                                  */}
      {/* ========================================================================= */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left text-white">
            <button
              onClick={() => setShowProposalModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black">
                <FileSignature className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Lançar Proposta ao Vivo</h3>
                <p className="text-xs text-slate-400">Transmitir na tela da imobiliária em tempo real</p>
              </div>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Corretor Responsável</label>
                <select
                  value={propBroker}
                  onChange={(e) => setPropBroker(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Juliana Mendes">Juliana Mendes (Equipe Alpha Prime)</option>
                  <option value="Carlos Mendes">Carlos Mendes (Titanium Luxury)</option>
                  <option value="Rodrigo Faro">Rodrigo Faro (Vanguard Moema)</option>
                  <option value="Beatriz Vasconcelos">Beatriz Vasconcelos (Vanguard Moema)</option>
                  <option value="Roberto Silveira">Roberto Silveira (Titanium Luxury)</option>
                  <option value="Marcos Silveira">Marcos Silveira (Vanguard Moema)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Cliente Proponente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Roberto Alencar"
                  value={propClientName}
                  onChange={(e) => setPropClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Imóvel / Empreendimento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cobertura Fasano Jardins - 340m²"
                  value={propProperty}
                  onChange={(e) => setPropProperty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Valor da Proposta (R$)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 3.850.000"
                    value={propValue}
                    onChange={(e) => setPropValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Condição de Pagamento</label>
                  <input
                    type="text"
                    placeholder="Ex: 30% sinal + saldo Financiamento"
                    value={propTerms}
                    onChange={(e) => setPropTerms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPropClientName('Eduardo F. Guimarães');
                    setPropProperty('Apto Duplex Jardins - Ed. Vitra');
                    setPropValue('2.950.000');
                    setPropTerms('À vista com sinal de 30%');
                  }}
                  className="text-xs text-blue-400 hover:underline"
                >
                  ⚡ Preencher Exemplo
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Lançar na TV!</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: NOVO CONTRATO FECHADO AO VIVO (BATER O SINO!)                   */}
      {/* ========================================================================= */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-left text-white">
            <button
              onClick={() => setShowContractModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 font-black animate-bounce">
                <BellRing className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-amber-400">Bater o Sino • Contrato Fechado!</h3>
                <p className="text-xs text-slate-300">Celebração ao vivo com confetes e toque do sino no salão</p>
              </div>
            </div>

            <form onSubmit={handleSubmitContract} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo de Fechamento</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as 'VENDA' | 'LOCACAO')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none font-bold"
                  >
                    <option value="VENDA">Venda (Escritura / Sinal)</option>
                    <option value="LOCACAO">Locação Residencial / Com.</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Equipe / Squad</label>
                  <select
                    value={contractTeam}
                    onChange={(e) => setContractTeam(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Equipe Alpha Prime">Equipe Alpha Prime</option>
                    <option value="Titanium Luxury Brokers">Titanium Luxury Brokers</option>
                    <option value="Vanguard Moema & Jardins">Vanguard Moema & Jardins</option>
                    <option value="Fênix Plantão & Lançamentos">Fênix Lançamentos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Corretor Fechador</label>
                <select
                  value={contractBroker}
                  onChange={(e) => setContractBroker(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none font-bold"
                >
                  <option value="Juliana Mendes">Juliana Mendes (Top VGV)</option>
                  <option value="Carlos Mendes">Carlos Mendes (Sênior)</option>
                  <option value="Beatriz Vasconcelos">Beatriz Vasconcelos (Locações)</option>
                  <option value="Rodrigo Faro">Rodrigo Faro (Pleno)</option>
                  <option value="Roberto Silveira">Roberto Silveira (Sênior)</option>
                  <option value="Marcos Silveira">Marcos Silveira (Associado)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Imóvel / Endereço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cobertura Triplex 420m² - Vila Nova Conceição"
                  value={contractProperty}
                  onChange={(e) => setContractProperty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {contractType === 'VENDA' ? 'Valor da Venda (R$)' : 'Valor Aluguel Mensal (R$)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={contractType === 'VENDA' ? 'Ex: 4.500.000' : 'Ex: 18.500'}
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:border-amber-400 focus:outline-none font-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Comissão Gerada (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 270.000"
                    value={contractCommission}
                    onChange={(e) => setContractCommission(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setContractProperty('Edifício Cyrela Heritage - 280m²');
                    setContractValue('5.200.000');
                    setContractCommission('312.000');
                  }}
                  className="text-xs text-amber-400 hover:underline"
                >
                  ⚡ Preencher Exemplo
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowContractModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-xs font-black shadow-xl shadow-amber-500/30"
                  >
                    <BellRing className="w-4 h-4" />
                    <span>BATER O SINO AO VIVO!</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: TRANSMITIR NA SMART TV (QR CODE & LINK DIRETO)                  */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left text-white">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Transmitir na Smart TV</h3>
                <p className="text-xs text-slate-400">Salão de Vendas, Totens Verticais e Recepção</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {qrCodeDataUrl ? (
                <div className="p-2 bg-white rounded-xl shadow-lg shrink-0">
                  <img src={qrCodeDataUrl} alt="QR Code Link da TV" className="w-36 h-36" />
                </div>
              ) : (
                <div className="w-36 h-36 bg-slate-800 animate-pulse rounded-xl" />
              )}

              <div className="text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white">Instruções para Smart TV:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Abra o navegador da Smart TV (Samsung, LG, Android TV).</li>
                  <li>Ou aponte a câmera para ler o QR Code.</li>
                  <li>Use o botão de modo tela cheia no controle da TV.</li>
                  <li>Passe os slides ou lance propostas/contratos ao vivo!</li>
                </ol>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Link Direto da Apresentação</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={tvDirectUrl}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    copiedLink 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestão da TV Salão (Sino Virtual, Metas, Avisos, Banners e Tempos) */}
      {showTvControlModal && (
        <TvControlManagementModal
          isOpen={showTvControlModal}
          onClose={() => setShowTvControlModal(false)}
        />
      )}

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Bell, 
  Megaphone, 
  Siren, 
  Award, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  Volume2, 
  Sliders, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Send, 
  Eye, 
  Layers, 
  Building2, 
  Calendar, 
  Play, 
  Sun, 
  Moon, 
  Smartphone, 
  Monitor, 
  Flame, 
  ShieldAlert,
  Zap,
  Target
} from 'lucide-react';
import { 
  TvBroadcastingSettings, 
  DEFAULT_TV_BROADCASTING_SETTINGS,
  TvNoticeItem, 
  TvNoticeCategory, 
  TvSoundType, 
  TV_SOUND_OPTIONS,
  TvLiveBellTrigger,
  TvLiveFlashAlert,
  TvSlideCategory
} from '../../types/tvRanking';
import { 
  getInitialTvBroadcastingSettings, 
  saveTvBroadcastingSettingsToCloud, 
  subscribeTvBroadcastingSettingsFromCloud,
  getInitialTvNotices, 
  saveTvNoticesToCloud, 
  subscribeTvNoticesFromCloud,
  triggerVirtualBellToCloud,
  sendFlashAlertToCloud
} from '../../services/systemPersistenceService';
import { playTvCustomSound } from '../../utils/tvAudioSynthesizer';
import { optimizeImageFile } from '../../utils/imageOptimizer';

interface TvControlManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrokersList?: string[];
  currentTeamsList?: string[];
}

export const TvControlManagementModal: React.FC<TvControlManagementModalProps> = ({
  isOpen,
  onClose,
  currentBrokersList = ['Juliana Mendes', 'Carlos Eduardo', 'Beatriz Silveira', 'Lucas Amorim', 'Mariana Rocha', 'Rodrigo Faro'],
  currentTeamsList = ['Equipe Alpha Prime', 'Esquadrão Elite VGV', 'Vanguard Moema & Jardins', 'Squad Águia de Ouro']
}) => {
  const [activeTab, setActiveTab] = useState<'sino' | 'notices' | 'timing' | 'flash'>('sino');

  // 1. Configurações de Transmissão e Tempo
  const [tvSettings, setTvSettings] = useState<TvBroadcastingSettings>(getInitialTvBroadcastingSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessFeedback, setSettingsSuccessFeedback] = useState<string | null>(null);

  // 2. Informativos e Banners
  const [notices, setNotices] = useState<TvNoticeItem[]>(getInitialTvNotices);
  const [isSavingNotices, setIsSavingNotices] = useState(false);
  const [noticeSuccessMsg, setNoticeSuccessMsg] = useState<string | null>(null);

  // Form de Novo Informativo / Banner
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeSubtitle, setNewNoticeSubtitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<TvNoticeCategory>('AVISO_IMPORTANTE');
  const [newNoticeMessage, setNewNoticeMessage] = useState('');
  const [newNoticeTarget, setNewNoticeTarget] = useState('');
  const [newNoticePercent, setNewNoticePercent] = useState<number>(0);
  const [newNoticeBadge, setNewNoticeBadge] = useState('');
  const [newNoticeImage, setNewNoticeImage] = useState('');
  const [newNoticeDuration, setNewNoticeDuration] = useState(12);
  const [newNoticeAuthor, setNewNoticeAuthor] = useState('Gestão Comercial');
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // 3. Sino Virtual ao Vivo
  const [selectedBellSound, setSelectedBellSound] = useState<TvSoundType>('SINO_TRADICIONAL');
  const [bellTitle, setBellTitle] = useState('NOVO FECHAMENTO HOMOLOGADO NO SALÃO!');
  const [bellBroker, setBellBroker] = useState('Juliana Mendes');
  const [bellTeam, setBellTeam] = useState('Equipe Alpha Prime');
  const [bellValue, setBellValue] = useState('R$ 1.850.000');
  const [bellSuccessFeedback, setBellSuccessFeedback] = useState<string | null>(null);

  // 4. Alerta Flash Urgente
  const [flashTitle, setFlashTitle] = useState('PLANTÃO URGENTE DA DIRETORIA');
  const [flashMessage, setFlashMessage] = useState('Reunião Geral e Alinhamento Estratégico em 10 minutos na Sala de Reuniões Principal!');
  const [flashSound, setFlashSound] = useState<TvSoundType>('ALERTA_FLASH');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [flashFeedback, setFlashFeedback] = useState<string | null>(null);

  // Sincronizar dados em tempo real da nuvem
  useEffect(() => {
    const unsubSettings = subscribeTvBroadcastingSettingsFromCloud((s) => {
      setTvSettings(s);
      setSelectedBellSound(s.defaultBellSound || 'SINO_TRADICIONAL');
    });

    const unsubNotices = subscribeTvNoticesFromCloud((n) => {
      setNotices(n);
    });

    return () => {
      unsubSettings();
      unsubNotices();
    };
  }, []);

  if (!isOpen) return null;

  // Ouvir prévia de som
  const handlePreviewSound = (soundType: TvSoundType) => {
    playTvCustomSound(soundType);
  };

  // Disparar Sino Virtual
  const handleTriggerBellNow = async () => {
    playTvCustomSound(selectedBellSound);

    const triggerPayload: TvLiveBellTrigger = {
      id: `bell_${Date.now()}`,
      soundType: selectedBellSound,
      title: bellTitle,
      brokerName: bellBroker,
      valueFormatted: bellValue,
      teamName: bellTeam,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await triggerVirtualBellToCloud(triggerPayload);
      setBellSuccessFeedback(`Sino Virtual disparado na TV com o som "${TV_SOUND_OPTIONS.find(s => s.id === selectedBellSound)?.name}"!`);
      setTimeout(() => setBellSuccessFeedback(null), 4000);
    } catch (e) {
      console.warn(e);
    }
  };

  // Upload de Imagem do Banner / Propaganda
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await optimizeImageFile(file, { maxWidth: 1000, maxHeight: 600, quality: 0.85 });
        setNewNoticeImage(compressed);
      } catch (err) {
        console.error('Erro ao otimizar banner:', err);
      }
    }
    e.target.value = '';
  };

  // Salvar Novo Informativo
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeMessage.trim()) return;

    setIsSavingNotices(true);

    const item: TvNoticeItem = {
      id: `notice_${Date.now()}`,
      title: newNoticeTitle.trim(),
      subtitle: newNoticeSubtitle.trim() || undefined,
      category: newNoticeCategory,
      message: newNoticeMessage.trim(),
      imageUrl: newNoticeImage || undefined,
      targetHighlight: newNoticeTarget.trim() || undefined,
      targetPercent: newNoticePercent > 0 ? newNoticePercent : undefined,
      badgeText: newNoticeBadge.trim() || undefined,
      authorName: newNoticeAuthor.trim() || 'Diretoria',
      authorRole: 'Gestão da Imobiliária',
      active: true,
      priority: 'ALTA',
      durationSeconds: newNoticeDuration,
      createdAt: 'Agora mesmo'
    };

    const updated = [item, ...notices];
    setNotices(updated);

    try {
      await saveTvNoticesToCloud(updated);
      setNoticeSuccessMsg('Informativo adicionado e transmitido para a TV Salão!');
      setTimeout(() => setNoticeSuccessMsg(null), 3500);

      // Limpar formulário
      setNewNoticeTitle('');
      setNewNoticeSubtitle('');
      setNewNoticeMessage('');
      setNewNoticeTarget('');
      setNewNoticePercent(0);
      setNewNoticeBadge('');
      setNewNoticeImage('');
    } catch (err) {
      console.warn(err);
    } finally {
      setIsSavingNotices(false);
    }
  };

  // Alternar status ativo/inativo de um comunicado
  const handleToggleNoticeActive = async (id: string, currentActive: boolean) => {
    const updated = notices.map(n => n.id === id ? { ...n, active: !currentActive } : n);
    setNotices(updated);
    try {
      await saveTvNoticesToCloud(updated);
    } catch (e) {
      console.warn(e);
    }
  };

  // Deletar comunicado
  const handleDeleteNotice = async (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    try {
      await saveTvNoticesToCloud(updated);
    } catch (e) {
      console.warn(e);
    }
  };

  // Salvar Configurações de Transmissão (Tempo e Alternância)
  const handleSaveBroadcastingSettings = async () => {
    setIsSavingSettings(true);
    try {
      const updated = {
        ...tvSettings,
        defaultBellSound: selectedBellSound
      };
      await saveTvBroadcastingSettingsToCloud(updated);
      setTvSettings(updated);
      setSettingsSuccessFeedback('Configurações de apresentação da TV Salão atualizadas com sucesso na nuvem!');
      setTimeout(() => setSettingsSuccessFeedback(null), 4000);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Alternar Categoria de Slide de Ranking Ativa
  const handleToggleRankingCategory = (catKey: string) => {
    setTvSettings(prev => ({
      ...prev,
      enabledCategories: {
        ...prev.enabledCategories,
        [catKey]: !prev.enabledCategories[catKey]
      }
    }));
  };

  // Transmitir Alerta Flash Urgente
  const handleSendFlashAlert = async () => {
    playTvCustomSound(flashSound);
    const alertPayload: TvLiveFlashAlert = {
      id: `flash_${Date.now()}`,
      title: flashTitle,
      message: flashMessage,
      soundType: flashSound,
      senderName: 'Diretoria / Gestão',
      senderRole: 'Supervisão Geral',
      active: true,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      celebrationType: 'ALERT'
    };

    try {
      await sendFlashAlertToCloud(alertPayload);
      setIsFlashActive(true);
      setFlashFeedback('⚡ Alerta Flash urgente transmitido para a TV em tela cheia!');
      setTimeout(() => setFlashFeedback(null), 4000);
    } catch (err) {
      console.warn(err);
    }
  };

  // Encerrar Alerta Flash na TV
  const handleDismissFlashAlert = async () => {
    const dismissPayload: TvLiveFlashAlert = {
      id: `flash_dismiss_${Date.now()}`,
      title: '',
      message: '',
      soundType: 'ALERTA_FLASH',
      senderName: '',
      senderRole: '',
      active: false,
      timestamp: ''
    };
    try {
      await sendFlashAlertToCloud(dismissPayload);
      setIsFlashActive(false);
      setFlashFeedback('Alerta Flash encerrado na TV.');
      setTimeout(() => setFlashFeedback(null), 3000);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Central de Gestão & Controle da TV Salão
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ao Vivo na Nuvem
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bata o sino virtual com sons realistas, publique metas e banners, e controle o tempo de apresentação
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar Controle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('sino')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'sino'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>1. Tocar Sino Virtual & Sons</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'notices'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>2. Informativos, Metas & Banners ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timing')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'timing'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3. Tempo & Alternância de Slides</span>
          </button>

          <button
            onClick={() => setActiveTab('flash')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'flash'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>4. Alerta Flash / Plantão Urgente</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">

          {/* TAB 1: TOCAR SINO VIRTUAL & ESCOLHER SOM */}
          {activeTab === 'sino' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              
              {/* Feedback Alert */}
              {bellSuccessFeedback && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{bellSuccessFeedback}</span>
                </div>
              )}

              {/* Big Ring The Bell CTA Card */}
              <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-400/40 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
                
                <div className="space-y-2 text-center sm:text-left z-10">
                  <span className="px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 font-black text-[10px] uppercase tracking-wider inline-block">
                    Transmissão Imediata na TV Salão
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Bater o Sino Virtual com Som Selecionado
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-amber-950/80 max-w-lg">
                    Dispare comemoração ao vivo com chuva de confetes, aplausos e som de celebração na Smart TV de vendas!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerBellNow}
                  className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-amber-400 rounded-2xl font-black text-base shadow-2xl flex items-center gap-3 transition-transform active:scale-95 shrink-0 hover:ring-4 hover:ring-amber-300/40 cursor-pointer"
                >
                  <Bell className="w-6 h-6 animate-bounce text-amber-400" />
                  <span>BATER O SINO AGORA!</span>
                </button>
              </div>

              {/* Seletor de Som com Prévia */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      Escolha o Efeito Sonoro da Comemoração
                    </h4>
                    <p className="text-xs text-slate-500">
                      Sons gerados com síntese de áudio de alta fidelidade que funcionam em qualquer Smart TV
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TV_SOUND_OPTIONS.map((opt) => {
                    const isSelected = selectedBellSound === opt.id;
                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBellSound(opt.id)}
                            className="text-left flex-1"
                          >
                            <span className="text-xs font-bold text-slate-900 block">{opt.name}</span>
                            <span className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">{opt.description}</span>
                          </button>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setSelectedBellSound(opt.id)}
                            className={`text-[11px] font-bold ${isSelected ? 'text-amber-700' : 'text-slate-600'}`}
                          >
                            {isSelected ? 'Selecionado Padrão' : 'Selecionar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePreviewSound(opt.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                            title="Ouvir teste de som"
                          >
                            <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                            <span>Ouvir Prévia</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detalhes da Comemoração */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  Detalhes do Negócio para Exibir em Destaque na TV
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Corretor Campeão</label>
                    <select
                      value={bellBroker}
                      onChange={e => setBellBroker(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    >
                      {currentBrokersList.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Squad / Equipe</label>
                    <select
                      value={bellTeam}
                      onChange={e => setBellTeam(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    >
                      {currentTeamsList.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Valor do Fechamento / VGV</label>
                    <input
                      type="text"
                      value={bellValue}
                      onChange={e => setBellValue(e.target.value)}
                      placeholder="Ex: R$ 2.450.000"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mensagem Festiva da TV</label>
                  <input
                    type="text"
                    value={bellTitle}
                    onChange={e => setBellTitle(e.target.value)}
                    placeholder="Ex: NOVO FECHAMENTO HOMOLOGADO NO SALÃO!"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INFORMATIVOS, METAS & BANNERS */}
          {activeTab === 'notices' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              
              {/* Feedback Alert */}
              {noticeSuccessMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{noticeSuccessMsg}</span>
                </div>
              )}

              {/* Criar Novo Comunicado / Banner */}
              <form onSubmit={handleAddNotice} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Criar Novo Slide de Comunicado, Meta ou Propaganda
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Alternará no carrossel da TV</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Título do Comunicado / Banner *</label>
                    <input
                      type="text"
                      required
                      value={newNoticeTitle}
                      onChange={e => setNewNoticeTitle(e.target.value)}
                      placeholder="Ex: Meta da Semana: 12 Contratos Fechados!"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categoria do Slide</label>
                    <select
                      value={newNoticeCategory}
                      onChange={e => setNewNoticeCategory(e.target.value as TvNoticeCategory)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    >
                      <option value="AVISO_IMPORTANTE">Aviso Importante</option>
                      <option value="META_SEMANA">Meta da Semana</option>
                      <option value="META_BATIDA">Meta Batida / Conquista</option>
                      <option value="PROPAGANDA_LANCAMENTO">Propaganda de Lançamento</option>
                      <option value="BANNER_PARCEIRO">Banner Construtora Parceira</option>
                      <option value="PLATAO_VENDAS">Plantão de Vendas</option>
                      <option value="COMUNICADO_DIRETORIA">Comunicado da Diretoria</option>
                      <option value="REUNIAO_GERAL">Reunião Geral</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo / Campanha</label>
                    <input
                      type="text"
                      value={newNoticeSubtitle}
                      onChange={e => setNewNoticeSubtitle(e.target.value)}
                      placeholder="Ex: Construtora Parceira Cyrela & Mitre"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge de Destaque Superior</label>
                    <input
                      type="text"
                      value={newNoticeBadge}
                      onChange={e => setNewNoticeBadge(e.target.value)}
                      placeholder="Ex: LANÇAMENTO DO MÊS"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mensagem Completa / Detalhes *</label>
                  <textarea
                    required
                    rows={3}
                    value={newNoticeMessage}
                    onChange={e => setNewNoticeMessage(e.target.value)}
                    placeholder="Descreva o comunicado ou condições comerciais do lançamento imobiliário..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-hidden resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Destaque de Meta / Alvo</label>
                    <input
                      type="text"
                      value={newNoticeTarget}
                      onChange={e => setNewNoticeTarget(e.target.value)}
                      placeholder="Ex: Faltam 3 contratos para o bônus!"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Progresso da Meta (0 a 100%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newNoticePercent}
                      onChange={e => setNewNoticePercent(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tempo na Tela (Segundos)</label>
                    <select
                      value={newNoticeDuration}
                      onChange={e => setNewNoticeDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                    >
                      <option value={8}>8 segundos</option>
                      <option value={10}>10 segundos</option>
                      <option value={12}>12 segundos</option>
                      <option value={15}>15 segundos</option>
                      <option value={20}>20 segundos</option>
                      <option value={30}>30 segundos (Destaque)</option>
                    </select>
                  </div>
                </div>

                {/* Upload de Imagem de Banner */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Imagem de Fundo / Banner de Propaganda (Opcional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newNoticeImage}
                      onChange={e => setNewNoticeImage(e.target.value)}
                      placeholder="https://... ou clique em Upload de Banner"
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 outline-hidden"
                    />
                    <label className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 border border-blue-200 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>Upload Banner</span>
                      <input
                        type="file"
                        ref={bannerFileInputRef}
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {newNoticeImage && (
                    <div className="mt-2.5 p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                      <img src={newNoticeImage} alt="Prévia" className="h-10 w-24 object-cover rounded-lg" />
                      <span className="text-[11px] text-slate-300 font-semibold">Banner carregado com sucesso</span>
                      <button
                        type="button"
                        onClick={() => setNewNoticeImage('')}
                        className="ml-auto text-xs text-rose-400 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingNotices}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar Slide na TV Salão</span>
                  </button>
                </div>
              </form>

              {/* Lista de Comunicados e Banners Ativos */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  Slides de Avisos & Propagandas em Exibição ({notices.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        n.active ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-100 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-1">
                            {n.badgeText || n.category}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{n.title}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{n.message}</p>
                        </div>

                        {n.imageUrl && (
                          <img src={n.imageUrl} alt={n.title} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" />
                        )}
                      </div>

                      {n.targetHighlight && (
                        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[10px] font-bold text-amber-900 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{n.targetHighlight}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400">⏱️ {n.durationSeconds || 10}s na tela</span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleNoticeActive(n.id, n.active)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors ${
                              n.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {n.active ? 'Ativo na TV' : 'Pausado'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNotice(n.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Excluir comunicado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPO & ALTERNÂNCIA DE SLIDES */}
          {activeTab === 'timing' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              
              {settingsSuccessFeedback && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{settingsSuccessFeedback}</span>
                </div>
              )}

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Tempo de Exibição dos Slides de Ranking
                  </h4>
                  <p className="text-xs text-slate-500">
                    Defina quantos segundos cada ranking permanece na tela antes de passar para o próximo
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      Duração por Slide: <span className="text-indigo-600 font-black">{tvSettings.slideIntervalSeconds} segundos</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Recomendado: 10s a 15s</span>
                  </div>

                  <input
                    type="range"
                    min={5}
                    max={45}
                    step={1}
                    value={tvSettings.slideIntervalSeconds}
                    onChange={e => setTvSettings({ ...tvSettings, slideIntervalSeconds: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>5s (Rápido)</span>
                    <span>10s (Padrão TV)</span>
                    <span>20s (Detalhado)</span>
                    <span>45s (Lento)</span>
                  </div>
                </div>

                {/* Alternância de Avisos e Banners */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Intercalar Comunicados & Banners no Ranking</h4>
                      <p className="text-xs text-slate-500">Alterna slides de informativos, metas e propagandas entre os rankings</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tvSettings.interleaveNotices}
                        onChange={e => setTvSettings({ ...tvSettings, interleaveNotices: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {tvSettings.interleaveNotices && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Frequência de Intercalação:</label>
                      <select
                        value={tvSettings.noticeIntervalFrequency}
                        onChange={e => setTvSettings({ ...tvSettings, noticeIntervalFrequency: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                      >
                        <option value={1}>A cada 1 slide de ranking, exibir 1 comunicado/propaganda</option>
                        <option value={2}>A cada 2 slides de ranking, exibir 1 comunicado/propaganda (Recomendado)</option>
                        <option value={3}>A cada 3 slides de ranking, exibir 1 comunicado/propaganda</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Categorias de Ranking Ativas */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Categorias de Ranking Ativas no Loop da TV</h4>
                    <p className="text-xs text-slate-500">Marque apenas as categorias que deseja exibir no salão</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: 'PODIUM_GERAL', label: 'Pódio Geral dos 3 Maiores' },
                      { key: 'EQUIPE_CAMPEA', label: 'Equipes Campeãs (Squads)' },
                      { key: 'VENDAS_VGV', label: 'Vendas em VGV' },
                      { key: 'LOCACOES', label: 'Locações & Aluguéis' },
                      { key: 'ATENDIMENTO_LEADS', label: '⚡ Atendimento de Leads' },
                      { key: 'CAPTACOES', label: 'Captações Exclusivas' },
                      { key: 'VISITAS_REALIZADAS', label: 'Visitas Realizadas' },
                      { key: 'LANCAMENTOS', label: 'Lançamentos & Stands' },
                      { key: 'USO_CRM', label: 'Disciplina & CRM' },
                      { key: 'MURAL_CONQUISTAS', label: 'Mural ao Vivo' }
                    ].map(cat => {
                      const isChecked = tvSettings.enabledCategories[cat.key] ?? true;
                      return (
                        <label
                          key={cat.key}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                            isChecked ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRankingCategory(cat.key)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          <span className="truncate">{cat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={handleSaveBroadcastingSettings}
                    disabled={isSavingSettings}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Salvar Configurações da TV na Nuvem</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALERTA FLASH / PLANTÃO URGENTE */}
          {activeTab === 'flash' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              
              {/* Feedback Alert */}
              {flashFeedback && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold animate-in fade-in">
                  <Zap className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{flashFeedback}</span>
                </div>
              )}

              <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-rose-800/40 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600/30 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-white">
                      Transmissão de Alerta Flash em Tela Cheia
                    </h3>
                    <p className="text-xs text-rose-200/80">
                      Sobrepõe a transmissão da TV instantaneamente com sirene de atenção para comunicados de máxima prioridade
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-rose-200 font-bold mb-1">Título do Alerta na TV</label>
                    <input
                      type="text"
                      value={flashTitle}
                      onChange={e => setFlashTitle(e.target.value)}
                      placeholder="Ex: ⚡ PLANTÃO URGENTE DA DIRETORIA"
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-rose-700/60 rounded-xl text-white font-bold outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-rose-200 font-bold mb-1">Mensagem de Alto Impacto</label>
                    <textarea
                      rows={3}
                      value={flashMessage}
                      onChange={e => setFlashMessage(e.target.value)}
                      placeholder="Digite o comunicado urgente para todo o salão de vendas ler..."
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-rose-700/60 rounded-xl text-white font-medium outline-hidden resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-rose-200 font-bold mb-1">Efeito Sonoro ao Disparar Alerta</label>
                      <select
                        value={flashSound}
                        onChange={e => setFlashSound(e.target.value as TvSoundType)}
                        className="w-full px-3.5 py-2 bg-slate-900/90 border border-rose-700/60 rounded-xl text-white font-bold outline-hidden"
                      >
                        <option value="ALERTA_FLASH">Alerta Flash de Atenção</option>
                        <option value="SIRENE_POLICIA">Sirene Contínua</option>
                        <option value="BUZINA_FESTA">Buzina de Estádio</option>
                        <option value="SINO_TRADICIONAL">Sino Tradicional</option>
                      </select>
                    </div>

                    <div className="flex items-end gap-2">
                      <button
                        type="button"
                        onClick={() => handlePreviewSound(flashSound)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                        <span>Testar Som</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={handleSendFlashAlert}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black shadow-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>DISPARAR ALERTA FLASH NA TV AGORA!</span>
                    </button>

                    {isFlashActive && (
                      <button
                        type="button"
                        onClick={handleDismissFlashAlert}
                        className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold transition-colors cursor-pointer"
                      >
                        Encerrar Alerta na TV
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0 text-white text-xs">
          <span className="text-slate-400">
            Sincronização em tempo real: todas as Smart TVs sintonizadas receberão os avisos instantaneamente.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};

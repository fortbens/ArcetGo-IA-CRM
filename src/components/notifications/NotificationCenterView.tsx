import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Megaphone, 
  ShieldCheck, 
  Building2, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  Check, 
  Plus, 
  Radio, 
  Smartphone, 
  Layers, 
  Share2,
  ExternalLink,
  Volume2,
  Settings,
  Users
} from 'lucide-react';
import { 
  SystemNotification, 
  PlatformBroadcastBanner, 
  NotificationChannel, 
  NotificationCategory, 
  NotificationPriority, 
  NotificationTargetAudience 
} from '../../types/notifications';
import { UserRole, TenantId } from '../../types/crm';

interface NotificationCenterViewProps {
  notifications: SystemNotification[];
  banners: PlatformBroadcastBanner[];
  userRole: UserRole;
  currentTenantId: TenantId;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAllNotifications?: () => void;
  onSendNotification: (newNotif: Omit<SystemNotification, 'id' | 'createdAt'>) => void;
  onSaveBanner: (newBanner: PlatformBroadcastBanner) => void;
  onToggleBannerStatus: (bannerId: string) => void;
  onTriggerSimulatedPush: (category: NotificationCategory) => void;
  onNavigateTab: (tabId: string) => void;
}

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  notifications,
  banners,
  userRole,
  currentTenantId,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAllNotifications,
  onSendNotification,
  onSaveBanner,
  onToggleBannerStatus,
  onTriggerSimulatedPush,
  onNavigateTab
}) => {
  // Main tabs: 'inbox' | 'comunicados_imobiliaria' | 'broadcast_super_admin' | 'simulador'
  const [activeTab, setActiveTab] = useState<'inbox' | 'comunicados_imobiliaria' | 'broadcast_super_admin' | 'simulador'>('inbox');

  // Filter & Search in Inbox
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  // Form for Imobiliária Internal Announcement
  const [imobTitle, setImobTitle] = useState('');
  const [imobMessage, setImobMessage] = useState('');
  const [imobPriority, setImobPriority] = useState<NotificationPriority>('ALTA');
  const [imobAudience, setImobAudience] = useState<NotificationTargetAudience>('TODA_IMOBILIARIA');
  const [imobChannels, setImobChannels] = useState<NotificationChannel[]>(['PUSH', 'BANNER', 'IN_APP']);
  const [imobActionLabel, setImobActionLabel] = useState('Ver no CRM');
  const [imobActionUrl, setImobActionUrl] = useState('kanban');

  // Form for Super Admin Broadcast
  const [saTitle, setSaTitle] = useState('');
  const [saContent, setSaContent] = useState('');
  const [saLevel, setSaLevel] = useState<PlatformBroadcastBanner['level']>('NOVIDADE');
  const [saLinkText, setSaLinkText] = useState('Conhecer Novidade');
  const [saLinkTab, setSaLinkTab] = useState('cca_banking');
  const [saIsDismissible, setSaIsDismissible] = useState(true);

  // Filtered notifications
  const filteredNotifications = notifications.filter(n => {
    if (showOnlyUnread && n.isRead) return false;
    if (filterCategory !== 'ALL' && n.category !== filterCategory) return false;
    if (filterPriority !== 'ALL' && n.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || n.senderName.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSendImobAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imobTitle.trim() || !imobMessage.trim()) return;

    onSendNotification({
      title: imobTitle.trim(),
      message: imobMessage.trim(),
      category: 'COMUNICADO_DIRETORIA',
      priority: imobPriority,
      channels: imobChannels,
      targetAudience: imobAudience,
      tenantId: currentTenantId,
      senderName: 'Diretoria da Imobiliária',
      senderRole: 'MASTER_ADMIN',
      actionLabel: imobActionLabel.trim() || undefined,
      actionUrl: imobActionUrl || undefined,
      isRead: false,
      isPinnedBanner: imobChannels.includes('BANNER'),
      metadata: {
        bannerTheme: imobPriority === 'CRITICA' ? 'danger' : 'info'
      }
    });

    // Also register as active banner if BANNER was selected
    if (imobChannels.includes('BANNER')) {
      const newBanner: PlatformBroadcastBanner = {
        id: `banner_imob_${Date.now()}`,
        title: imobTitle.trim(),
        content: imobMessage.trim(),
        level: imobPriority === 'CRITICA' ? 'CRITICO' : 'INFO',
        scope: 'IMOBILIARIA_INTERNO',
        active: true,
        isDismissible: true,
        linkText: imobActionLabel.trim() || 'Acessar',
        linkActionTab: imobActionUrl,
        authorName: 'Diretoria Executiva',
        authorRole: 'Gestão da Imobiliária',
        startDate: new Date().toISOString()
      };
      onSaveBanner(newBanner);
    }

    setImobTitle('');
    setImobMessage('');
    alert('✅ Comunicado enviado com sucesso para a equipe via Push e Banner!');
    setActiveTab('inbox');
  };

  const handleSendSuperAdminBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saTitle.trim() || !saContent.trim()) return;

    const newBanner: PlatformBroadcastBanner = {
      id: `banner_sa_${Date.now()}`,
      title: saTitle.trim(),
      content: saContent.trim(),
      level: saLevel,
      scope: 'SUPER_ADMIN_GLOBAL',
      active: true,
      isDismissible: saIsDismissible,
      linkText: saLinkText.trim() || undefined,
      linkActionTab: saLinkTab || undefined,
      authorName: 'Super Admin da Plataforma',
      authorRole: 'SaaS Platform Admin',
      startDate: new Date().toISOString()
    };

    onSaveBanner(newBanner);

    // Also push into notifications stream
    onSendNotification({
      title: `🌐 Plataforma: ${saTitle.trim()}`,
      message: saContent.trim(),
      category: 'PLATAFORMA_SISTEMA',
      priority: saLevel === 'CRITICO' ? 'CRITICA' : 'ALTA',
      channels: ['PUSH', 'BANNER', 'IN_APP'],
      targetAudience: 'TODOS_SISTEMA',
      senderName: 'Super Admin AcertGo',
      senderRole: 'PLATAFORMA_SUPER_ADMIN',
      actionLabel: saLinkText.trim() || 'Acessar Recurso',
      actionUrl: saLinkTab,
      isRead: false,
      isPinnedBanner: true,
      metadata: {
        bannerTheme: saLevel === 'NOVIDADE' ? 'purple' : saLevel === 'CRITICO' ? 'danger' : 'info'
      }
    });

    setSaTitle('');
    setSaContent('');
    alert('Broadcast Global da Plataforma disparado para todas as imobiliárias!');
    setActiveTab('inbox');
  };

  const toggleChannel = (channel: NotificationChannel) => {
    setImobChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Bell className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Central Unificada de Notificações, Push & Banners</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 animate-pulse">
                  {unreadCount} Não Lidas
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight font-heading break-words">
              Módulo de Notificação & Banners em Tempo Real 🔔
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Disparos interativos de <strong>Web Push</strong>, <strong>Banners no Topo</strong> e alertas operacionais. 
              Gestão tanto para a <strong>Imobiliária & seu Time</strong> (SLA de leads, comissões, stands) 
              quanto para o <strong>Super Admin da Plataforma</strong> (comunicados globais para todas as filiais).
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-slate-300">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono">
                {notifications.length} Alertas Registrados
              </span>
              <span className="bg-indigo-950/80 border border-indigo-600/60 text-indigo-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <Megaphone className="w-3.5 h-3.5 shrink-0" />
                <span>{banners.filter(b => b.active).length} Banners Ativos no Topo</span>
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Web Push Simulado Ativo</span>
              </span>
            </div>
          </div>

          {/* Quick Simulation Shortcuts */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => onTriggerSimulatedPush('LEAD_ROLETA')}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Testar Push: Lead Quente</span>
            </button>
            <button
              onClick={() => onTriggerSimulatedPush('FINANCEIRO_SPLIT')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Testar Push: Pix Comissão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            activeTab === 'inbox'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">Central de Alertas & Push ({notifications.length})</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shrink-0">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('comunicados_imobiliaria')}
          className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            activeTab === 'comunicados_imobiliaria'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="truncate">Comunicados da Imobiliária (Diretoria)</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast_super_admin')}
          className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            activeTab === 'broadcast_super_admin'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="truncate">Broadcast Super Admin (Plataforma Global)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            activeTab === 'simulador'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">Simulador & Canais Push</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: INBOX / LISTA DE NOTIFICAÇÕES & PUSH */}
      {/* ======================================================== */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {/* Controls Bar: Filters & Actions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar alerta, emissor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold outline-none"
              >
                <option value="ALL">Todas as Categorias</option>
                <option value="LEAD_ROLETA">Leads & Roleta</option>
                <option value="FINANCEIRO_SPLIT">Fintech & Splits</option>
                <option value="STAND_GPS">Plantões Stand GPS</option>
                <option value="COMUNICADO_DIRETORIA">Diretoria Imobiliária</option>
                <option value="PLATAFORMA_SISTEMA">Plataforma Super Admin</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold outline-none"
              >
                <option value="ALL">Todas as Prioridades</option>
                <option value="CRITICA">Crítica</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Média</option>
                <option value="BAIXA">Baixa</option>
              </select>

              {/* Unread Only Toggle */}
              <button
                onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  showOnlyUnread
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Apenas Não Lidas ({unreadCount})
              </button>
            </div>

            {/* Bulk Action: Marcar todas como lidas & Excluir Todas */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Marcar Todas como Lidas</span>
              </button>

              {onClearAllNotifications && (
                <button
                  type="button"
                  onClick={() => {
                    onClearAllNotifications();
                  }}
                  disabled={notifications.length === 0}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Apagar todas as notificações definitivamente"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Apagar Todas</span>
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => {
                const isCrit = notif.priority === 'CRITICA';
                const isHigh = notif.priority === 'ALTA';
                const isSuperAdmin = notif.category === 'PLATAFORMA_SISTEMA';

                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                      !notif.isRead
                        ? isCrit
                          ? 'bg-rose-50/60 border-rose-200 shadow-2xs'
                          : isHigh
                          ? 'bg-amber-50/50 border-amber-200 shadow-2xs'
                          : 'bg-blue-50/40 border-blue-200 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Read status dot */}
                      <div className="pt-1 shrink-0">
                        <span 
                          className={`w-2.5 h-2.5 rounded-full inline-block ${
                            !notif.isRead 
                              ? isCrit ? 'bg-rose-500 ring-2 ring-rose-200' : 'bg-blue-600 ring-2 ring-blue-200'
                              : 'bg-slate-300'
                          }`} 
                        />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          {isSuperAdmin ? (
                            <span className="px-2 py-0.5 rounded-md font-black bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-purple-600" />
                              Plataforma Global
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {notif.category.replace('_', ' ')}
                            </span>
                          )}

                          <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${
                            isCrit ? 'bg-rose-100 text-rose-800' : isHigh ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {notif.priority}
                          </span>

                          <span className="text-slate-400 font-medium">
                            Por: <strong className="text-slate-700">{notif.senderName}</strong>
                          </span>

                          <span className="text-slate-400">· {notif.createdAt}</span>

                          {/* Channels badges */}
                          <div className="flex items-center gap-1 ml-auto">
                            {notif.channels.map(c => (
                              <span key={c} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-900 leading-snug break-words">
                          {notif.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed break-words">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions on this notification */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {notif.actionLabel && notif.actionUrl && (
                        <button
                          onClick={() => {
                            onMarkAsRead(notif.id);
                            onNavigateTab(notif.actionUrl!);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <span>{notif.actionLabel}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {!notif.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notif.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Marcar como lida"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteNotification(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remover alerta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">Nenhum alerta localizado</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Altere os filtros de busca ou aguarde novas notificações operacionais em tempo real.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: COMUNICADOS DA IMOBILIÁRIA (DIRETORIA -> TIME) */}
      {/* ======================================================== */}
      {activeTab === 'comunicados_imobiliaria' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Novo Comunicado Interno da Imobiliária</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispare avisos para toda a equipe, corretores de plantão ou gerentes com Banner no Topo e Push Notification.
              </p>
            </div>

            <form onSubmit={handleSendImobAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Título do Comunicado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Plantão Extra neste Sábado às 08:30 no Stand Jardins Sky"
                  value={imobTitle}
                  onChange={(e) => setImobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mensagem Completa *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalhes, regras de comissão, horários de tolerância ou instruções para a equipe..."
                  value={imobMessage}
                  onChange={(e) => setImobMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Público-Alvo
                  </label>
                  <select
                    value={imobAudience}
                    onChange={(e) => setImobAudience(e.target.value as NotificationTargetAudience)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="TODA_IMOBILIARIA">Toda a Imobiliária (Geral)</option>
                    <option value="CORRETORES_VENDAS">Apenas Corretores de Vendas</option>
                    <option value="CORRETORES_LOCACAO">Apenas Corretores de Locação</option>
                    <option value="GERENTES_COORDENADORES">Apenas Gerentes & Coordenação</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Prioridade do Alerta
                  </label>
                  <select
                    value={imobPriority}
                    onChange={(e) => setImobPriority(e.target.value as NotificationPriority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="ALTA">Alta (Aviso de destaque)</option>
                    <option value="CRITICA">Crítica (Vermelho urgente)</option>
                    <option value="MEDIA">Média (Informativo padrão)</option>
                  </select>
                </div>
              </div>

              {/* Channels checkboxes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Canais de Entrega Ativos
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'PUSH' as NotificationChannel, label: 'Web Push (Notificação tela)' },
                    { id: 'BANNER' as NotificationChannel, label: 'Banner Fixado no Topo' },
                    { id: 'IN_APP' as NotificationChannel, label: '📬 Central de Notificações' },
                    { id: 'WHATSAPP' as NotificationChannel, label: '💬 WhatsApp da Equipe' },
                  ].map(ch => {
                    const active = imobChannels.includes(ch.id);
                    return (
                      <button
                        type="button"
                        key={ch.id}
                        onClick={() => toggleChannel(ch.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Link Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Texto do Botão de Ação
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Ver Escala no Stand"
                    value={imobActionLabel}
                    onChange={(e) => setImobActionLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Módulo Destino
                  </label>
                  <select
                    value={imobActionUrl}
                    onChange={(e) => setImobActionUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="roleta">Plantões Stand & Roleta</option>
                    <option value="kanban">Funil de Leads (Kanban)</option>
                    <option value="corporate_academy">Universidade Corporativa EAD</option>
                    <option value="fintech_split">Fintech Split de Comissões</option>
                    <option value="contracts">Gestão de Contratos</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar e Disparar para a Equipe Agora</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Info: Diretrizes de Comunicação */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Boas Práticas de Disparo</span>
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Plantões Stand:</strong> Dispare avisos de escala na véspera até as 20h para garantir pontualidade.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Metas & Bonificações:</strong> Notificações com bônus no Pix aumentam o engajamento de visitas em até 300%.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Banners no Topo:</strong> Banners com urgência crítica devem ser desativados assim que a ação for concluída.</span>
                </li>
              </ul>
            </div>

            {/* Active Agency Banners */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Banners Internos da Imobiliária</span>
                <span className="text-[10px] font-bold text-indigo-600">
                  {banners.filter(b => b.scope === 'IMOBILIARIA_INTERNO').length} Total
                </span>
              </h3>

              <div className="space-y-2">
                {banners.filter(b => b.scope === 'IMOBILIARIA_INTERNO').map(b => (
                  <div key={b.id} className="p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">{b.title}</span>
                      <button
                        onClick={() => onToggleBannerStatus(b.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {b.active ? 'Ativo no Topo' : 'Pausado'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{b.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: BROADCAST SUPER ADMIN (PLATAFORMA SAAS GLOBAL) */}
      {/* ======================================================== */}
      {activeTab === 'broadcast_super_admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 mb-1.5">
                <ShieldCheck className="w-3 h-3 text-rose-600" />
                Painel Super Admin SaaS
              </div>
              <h2 className="text-base font-black text-slate-900">
                Disparo Global de Broadcast para Todas as Imobiliárias
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Envie anúncios corporativos, novidades de versão, avisos de manutenção ou comunicados de faturamento para todas as instâncias contratantes.
              </p>
            </div>

            <form onSubmit={handleSendSuperAdminBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Título do Broadcast Global *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atualização AcertGo 3.5: Novo Módulo de Vistorias Fotográficas Liberado"
                  value={saTitle}
                  onChange={(e) => setSaTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Conteúdo do Comunicado *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mensagem exibida no banner superior e na central de notificações de todos os usuários da plataforma..."
                  value={saContent}
                  onChange={(e) => setSaContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tipo / Nível do Comunicado
                  </label>
                  <select
                    value={saLevel}
                    onChange={(e) => setSaLevel(e.target.value as PlatformBroadcastBanner['level'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="NOVIDADE">✨ NOVIDADE (Roxo - Lançamento de Recurso)</option>
                    <option value="INFO">ℹ️ INFO (Azul - Informativo geral)</option>
                    <option value="AVISO">⚠️ AVISO (Âmbar - Manutenção / Atenção)</option>
                    <option value="CRITICO">🚨 CRÍTICO (Vermelho - Urgente / Instabilidade)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Link de Ação Rápida
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Conhecer Recurso"
                    value={saLinkText}
                    onChange={(e) => setSaLinkText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="saDismiss"
                  checked={saIsDismissible}
                  onChange={(e) => setSaIsDismissible(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="saDismiss" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Permitir que o usuário feche (dispense) o banner durante a sessão
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Disparar Broadcast Global da Plataforma</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Active Super Admin Banners */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Banners Globais Ativos ({banners.filter(b => b.scope === 'SUPER_ADMIN_GLOBAL').length})</span>
              <span className="text-[10px] font-bold text-rose-600">Super Admin</span>
            </h3>

            <div className="space-y-3">
              {banners.filter(b => b.scope === 'SUPER_ADMIN_GLOBAL').map(b => (
                <div key={b.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      b.level === 'NOVIDADE' ? 'bg-purple-100 text-purple-800' : b.level === 'AVISO' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {b.level}
                    </span>
                    <button
                      onClick={() => onToggleBannerStatus(b.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {b.active ? 'Ativo no Topo' : 'Desativado'}
                    </button>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{b.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SIMULADOR DE PUSH & CANAIS */}
      {/* ======================================================== */}
      {activeTab === 'simulador' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600" />
              <span>Simulador Interativo de Notificações Web Push</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Acione gatilhos em tempo real para verificar a experiência do corretor e da diretoria nos dispositivos móveis e desktop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-2 rounded-xl bg-rose-500 text-white inline-block">
                  <Flame className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs text-slate-900">Lead Quente na Roleta</h4>
                <p className="text-[11px] text-slate-500">
                  Simula lead solicitando visita em imóvel de R$ 8.9M com cronômetro de 15 minutos.
                </p>
              </div>
              <button
                onClick={() => onTriggerSimulatedPush('LEAD_ROLETA')}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
              >
                Disparar Push Lead
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-2 rounded-xl bg-emerald-500 text-white inline-block">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs text-slate-900">Comissão Liquidada no Pix</h4>
                <p className="text-[11px] text-slate-500">
                  Simula split de comissão automática de R$ 14.850,00 pago via Pix ao corretor.
                </p>
              </div>
              <button
                onClick={() => onTriggerSimulatedPush('FINANCEIRO_SPLIT')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
              >
                Disparar Push Pix
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-2 rounded-xl bg-blue-500 text-white inline-block">
                  <Building2 className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs text-slate-900">Check-in no Stand GPS</h4>
                <p className="text-[11px] text-slate-500">
                  Simula satélite validando presença no raio de 10 metros para sorteio do plantão.
                </p>
              </div>
              <button
                onClick={() => onTriggerSimulatedPush('STAND_GPS')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
              >
                Disparar Push GPS
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-2 rounded-xl bg-purple-500 text-white inline-block">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs text-slate-900">Broadcast Super Admin</h4>
                <p className="text-[11px] text-slate-500">
                  Simula aviso global da plataforma SaaS enviado a todas as imobiliárias cadastradas.
                </p>
              </div>
              <button
                onClick={() => onTriggerSimulatedPush('PLATAFORMA_SISTEMA')}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
              >
                Disparar Push Global
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

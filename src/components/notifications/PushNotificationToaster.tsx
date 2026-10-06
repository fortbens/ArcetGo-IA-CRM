import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  X, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { SystemNotification } from '../../types/notifications';

interface PushNotificationToasterProps {
  notifications: SystemNotification[];
  onDismiss: (id: string) => void;
  onActionClick: (notification: SystemNotification) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const PushNotificationToaster: React.FC<PushNotificationToasterProps> = ({
  notifications,
  onDismiss,
  onActionClick,
  soundEnabled = true,
  onToggleSound
}) => {
  // Only show notifications received recently that haven't been dismissed
  const visiblePushes = notifications.filter(n => !n.isRead && n.channels.includes('PUSH')).slice(0, 3);

  if (visiblePushes.length === 0) return null;

  const getCategoryIcon = (category: SystemNotification['category']) => {
    switch (category) {
      case 'LEAD_ROLETA':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'FINANCEIRO_SPLIT':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'STAND_GPS':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'PLATAFORMA_SISTEMA':
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'COMUNICADO_DIRETORIA':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'ACADEMY_TREINAMENTO':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityBorder = (priority: SystemNotification['priority']) => {
    switch (priority) {
      case 'CRITICA':
        return 'border-rose-400 bg-rose-50/95 shadow-rose-200/50';
      case 'ALTA':
        return 'border-amber-400 bg-amber-50/95 shadow-amber-200/50';
      case 'MEDIA':
        return 'border-blue-300 bg-white/95 shadow-slate-200/60';
      default:
        return 'border-slate-200 bg-white/95 shadow-slate-200/60';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none select-none">
      {/* Sound toggle float pill if multiple notifications */}
      {onToggleSound && (
        <div className="self-end pointer-events-auto">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Silenciar avisos sonoros de push' : 'Ativar avisos sonoros de push'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>{soundEnabled ? 'Som Push Ativo' : 'Som Mudo'}</span>
          </button>
        </div>
      )}

      {visiblePushes.map((notif) => (
        <div
          key={notif.id}
          className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md shadow-lg transition-all animate-in slide-in-from-right duration-300 ${getPriorityBorder(notif.priority)}`}
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100 shrink-0 mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-slate-900 text-white shrink-0">
                    PUSH
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 truncate">
                    {notif.senderName}
                  </span>
                  <span className="text-[10px] text-slate-400">· {notif.createdAt}</span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words">
                  {notif.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed break-words">
                  {notif.message}
                </p>

                {/* Direct Action Button */}
                {notif.actionLabel && (
                  <div className="pt-1.5">
                    <button
                      onClick={() => onActionClick(notif)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      <span>{notif.actionLabel}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => onDismiss(notif.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              title="Dispensar Notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

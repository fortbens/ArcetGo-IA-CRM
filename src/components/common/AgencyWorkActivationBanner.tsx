import React, { useState } from 'react';
import { 
  Building2, 
  Key, 
  Ticket, 
  Globe, 
  Users, 
  CheckCircle2, 
  Copy, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { TenantAgency } from '../../types/superAdmin';
import { UserProfile } from '../../types/crm';

interface AgencyWorkActivationBannerProps {
  tenant: TenantAgency;
  currentUser: UserProfile;
  onNavigateTab: (tabId: string) => void;
  onOpenNewLead: () => void;
  onOpenUserModal?: () => void;
  onReturnToSuperAdmin?: () => void;
}

export const AgencyWorkActivationBanner: React.FC<AgencyWorkActivationBannerProps> = ({
  tenant,
  currentUser,
  onNavigateTab,
  onOpenNewLead,
  onOpenUserModal,
  onReturnToSuperAdmin
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  if (isDismissed) return null;

  const handleCopyInviteWhatsApp = () => {
    const text = `👋 *BEM-VINDO À EQUIPE - ${tenant.tradeName}*
--------------------------------------------------
*Imobiliária:* ${tenant.tradeName} (${tenant.city} - ${tenant.state})
*Código de Convite da Equipe:* ${tenant.inviteCode || 'IMO-2026'}
*Módulo de Entrada:* ${tenant.initialModule || 'kanban'}
*Site da Imobiliária:* https://${tenant.subdomain || 'matriz.acertgo.com.br'}
*Acesso ao Sistema:* Entre na tela de login, selecione a aba *Por Convite*, informe o código *${tenant.inviteCode || 'IMO-2026'}*, seu nome e acesse imediatamente!
--------------------------------------------------
🚀 Boas vendas!`;

    navigator.clipboard.writeText(text);
    setCopyFeedback('Convite copiado para WhatsApp!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleCopyDirectorCredentials = () => {
    const text = `🏢 *CREDENCIAS DE ACESSO - ${tenant.tradeName}*
--------------------------------------------------
*Responsável:* ${tenant.ownerName}
*E-mail de Login:* ${tenant.ownerEmail}
*Senha de Acesso:* ${tenant.adminPassword || 'Acert@2026'}
*Código de Convite da Equipe:* ${tenant.inviteCode || 'IMO-2026'}
*Site Escolhido:* ${tenant.chosenSiteTemplate || 'URBAN_FLOW'}
*Link do Sistema:* https://${tenant.subdomain || 'matriz.acertgo.com.br'}
--------------------------------------------------
👉 Inicie agora mesmo seus atendimentos!`;

    navigator.clipboard.writeText(text);
    setCopyFeedback('Credenciais copiadas!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const getTemplateLabel = (templateId?: string) => {
    switch (templateId) {
      case 'EXCLUSIVE_HIGH_END': return 'Exclusive High-End VIP';
      case 'FAST_RENT': return 'FastRent & Locação Ágil';
      case 'HERITAGE_TRUST': return 'Heritage & Tradição Familiar';
      case 'URBAN_FLOW':
      default: return 'Urban Flow & Lançamentos';
    }
  };

  const getModuleLabel = (moduleId?: string) => {
    switch (moduleId) {
      case 'imoveis': return 'Estoque de Imóveis';
      case 'roleta': return 'Roleta de Atendimento';
      case 'sites_modelos': return 'Site Oficial & Modelos';
      case 'financial_erp': return 'Financeiro ERP';
      case 'executive_dashboard': return 'Painel do Diretor (CEO)';
      case 'sales_proposals': return 'Propostas & Vendas';
      case 'kanban':
      default: return 'Funil Kanban de Leads';
    }
  };

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-3 mb-1">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden transition-all">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Top line of banner */}
        <div className="flex items-center justify-between gap-3 relative z-10 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  INSTÂNCIA ATIVA · OPERAÇÃO REAL
                </span>
                {onReturnToSuperAdmin && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    👑 MODO SUPER ADMIN
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-400">
                  {tenant.city} - {tenant.state}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{tenant.tradeName}</span>
                <span className="text-xs font-normal text-slate-300 hidden sm:inline">
                  · Gestor Principal: <strong className="text-amber-300">{tenant.ownerName}</strong>
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReturnToSuperAdmin && (
              <button
                type="button"
                onClick={onReturnToSuperAdmin}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                title="Sair desta instância e retornar à Plataforma Geral (Super Admin)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>Voltar ao Super Admin</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expandir painel de início' : 'Recolher'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fechar banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback pill */}
        {copyFeedback && (
          <div className="mt-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{copyFeedback}</span>
          </div>
        )}

        {/* Collapsible content */}
        {!isCollapsed && (
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 relative z-10 space-y-3.5">
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {/* Card 1: Gestor Principal Cadastrado no Módulo Principal */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-1 text-amber-400">
                    <ShieldCheck className="w-3 h-3" />
                    Gestor Principal (Diretoria)
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold">
                    Responsável
                  </span>
                </div>
                <div className="font-bold text-white truncate text-xs" title={tenant.ownerName}>
                  {tenant.ownerName}
                </div>
                <div className="font-mono text-slate-400 truncate text-[11px]" title={tenant.ownerEmail}>
                  {tenant.ownerEmail}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span className="truncate">{tenant.ownerPhone}</span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('executive_dashboard')}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Painel CEO →
                  </button>
                </div>
              </div>

              {/* Card 2: Convite da Equipe */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Ticket className="w-3 h-3" />
                    Convite de Corretores
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyInviteWhatsApp}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <Send className="w-2.5 h-2.5" />
                    WhatsApp
                  </button>
                </div>
                <div className="font-mono font-bold text-cyan-300 text-xs">
                  {tenant.inviteCode || 'IMO-2026'}
                </div>
                <div className="text-[10px] text-slate-400">
                  Cadastram-se direto no login
                </div>
              </div>

              {/* Card 3: Módulo Inicial de Entrada */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1 text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  Módulo Inicial
                </div>
                <div className="font-bold text-white text-xs truncate">
                  {getModuleLabel(tenant.initialModule)}
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab(tenant.initialModule || 'kanban')}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <span>Abrir Módulo</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Card 4: Site Modelo Escolhido */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1 text-purple-400">
                  <Globe className="w-3 h-3" />
                  Site Modelo Escolhido
                </div>
                <div className="font-bold text-white text-xs truncate">
                  {getTemplateLabel(tenant.chosenSiteTemplate)}
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('sites_modelos')}
                  className="text-[10px] text-purple-300 hover:text-purple-200 flex items-center gap-1 font-semibold"
                >
                  <span>Ver & Personalizar Site</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenNewLead}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Lead</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('imoveis')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <span>Cadastrar Imóvel</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('team_permissions')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Criar Usuários / Equipe</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyInviteWhatsApp}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Convite WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('sites_modelos')}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Site Oficial</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

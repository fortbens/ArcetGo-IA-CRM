import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  Home, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Shield, 
  Key, 
  Layers, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Trash2,
  Lock,
  Unlock,
  LogIn,
  Eye,
  EyeOff,
  Copy,
  Sparkles,
  Send,
  Globe
} from 'lucide-react';
import { TenantAgency, SaaSModule, TenantStatus } from '../../types/superAdmin';

interface TenantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantAgency | null;
  onEdit: (tenant: TenantAgency) => void;
  onToggleStatus: (tenantId: string, newStatus: TenantStatus) => void;
  onDelete: (tenantId: string) => void;
  onImpersonate: (tenantId: string) => void;
  availableModules: SaaSModule[];
}

export const TenantDetailModal: React.FC<TenantDetailModalProps> = ({
  isOpen,
  onClose,
  tenant,
  onEdit,
  onToggleStatus,
  onDelete,
  onImpersonate,
  availableModules,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  if (!isOpen || !tenant) return null;

  const handleCopyCard = () => {
    const text = `🏢 *ACERTGO - CREDENCIAIS DE ACESSO DA IMOBILIÁRIA*
--------------------------------------------------
*Imobiliária:* ${tenant.tradeName}
*Login do Diretor:* ${tenant.ownerEmail}
*Senha de Acesso:* ${tenant.adminPassword || 'Acert@2026'}
*Código de Convite da Equipe:* ${tenant.inviteCode || 'IMO-ACERT-2026'}
*Módulo de Entrada:* ${tenant.initialModule || 'kanban'}
*Site Escolhido:* ${tenant.chosenSiteTemplate || 'URBAN_FLOW'}
*Link do Sistema:* ${tenant.subdomain ? `https://${tenant.subdomain}` : 'https://matriz.acertgo.com.br'}
--------------------------------------------------
👉 Inicie seus trabalhos acessando o link com seu login e senha!`;

    navigator.clipboard.writeText(text);
    setCopyFeedback('Copiado com sucesso!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const getStatusBadge = (status: TenantStatus) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Ativa & Regular', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'TRIAL':
        return { label: 'Período de Testes (Trial)', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock };
      case 'SUSPENDED':
        return { label: 'Acesso Suspenso', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertCircle };
      case 'CANCELLED':
        return { label: 'Cancelada', bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: X };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: AlertCircle };
    }
  };

  const statusInfo = getStatusBadge(tenant.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-3.5">
              {tenant.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.tradeName}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-700 bg-slate-800"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                  {tenant.tradeName.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">{tenant.tradeName}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusInfo.bg}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{tenant.name}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                  <span>CNPJ: {tenant.cnpj || 'Não inf.'}</span>
                  <span>•</span>
                  <span>CRECI: {tenant.creciJ || 'Não inf.'}</span>
                </div>
              </div>
            </div>

            {/* Impersonate Action Button */}
            <button
              onClick={() => {
                onImpersonate(tenant.id);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              title="Acessar como usuário desta imobiliária para suporte"
            >
              <LogIn className="w-3.5 h-3.5" />
              Acessar Tenant (Simulação)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key SaaS Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">Usuários</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                {tenant.stats.usersCount} <span className="text-xs font-normal text-slate-500">ativos</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">Estoque Imóveis</span>
                <Home className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                {tenant.stats.propertiesCount} <span className="text-xs font-normal text-slate-500">unidades</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">Faturamento Mensal</span>
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                R$ {tenant.monthlyBilling.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">Volume VGV Mês</span>
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                R$ {(tenant.stats.monthlyDealsVolume / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>

          {/* Plano & Assinatura */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                Plano Contratado
              </span>
              <div className="text-sm font-extrabold text-blue-950 mt-0.5">
                {tenant.planName} · Ciclo {tenant.billingCycle}
              </div>
              <p className="text-blue-700 text-[11px] mt-0.5">
                Próxima renovação: <strong>{new Date(tenant.nextBillingDate).toLocaleDateString('pt-BR')}</strong> · Pago via {tenant.paymentMethod}
              </p>
            </div>
            <button
              onClick={() => {
                onEdit(tenant);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition-colors shrink-0 self-start sm:self-auto"
            >
              Mudar Plano ou Módulos
            </button>
          </div>

          {/* CREDENCIAIS DE ACESSO & INÍCIO DE TRABALHO REAL */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-700/80 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
                    Credenciais de Entrada & Convite da Equipe
                    <span className="text-[9px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Início de Trabalho Ativo
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dados configurados para o diretor entrar e para a equipe se cadastrar
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCard}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {copyFeedback || 'Copiar Ficha WhatsApp'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* E-mail de Login */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Login do Diretor
                </span>
                <div className="font-mono font-medium text-slate-200 truncate select-all" title={tenant.ownerEmail}>
                  {tenant.ownerEmail}
                </div>
              </div>

              {/* Senha */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                  <span>Senha de Acesso</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <div className="font-mono font-bold text-amber-400 select-all">
                  {showPassword ? (tenant.adminPassword || 'Acert@2026') : '••••••••'}
                </div>
              </div>

              {/* Código de Convite */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Convite da Equipe
                </span>
                <div className="font-mono font-bold text-cyan-400 uppercase select-all">
                  {tenant.inviteCode || `IMO-${tenant.tradeName?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}-2026`}
                </div>
              </div>

              {/* Módulo & Site */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Módulo & Site Inicial
                </span>
                <div className="font-semibold text-emerald-400 text-[11px] truncate">
                  🚀 {tenant.initialModule || 'kanban'} · {tenant.chosenSiteTemplate || 'URBAN_FLOW'}
                </div>
              </div>
            </div>
          </div>

          {/* Endereço & Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Contato & Responsável
              </span>
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{tenant.ownerName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${tenant.ownerEmail}`} className="text-blue-600 hover:underline">
                  {tenant.ownerEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{tenant.ownerPhone || 'Não informado'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Acesso & Domínio
              </span>
              <div className="flex items-center gap-2 text-slate-800">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-blue-700">{tenant.subdomain}</span>
              </div>
              {tenant.customDomain && (
                <div className="text-[11px] text-slate-600">
                  Domínio Próprio: <strong className="text-slate-800">{tenant.customDomain}</strong>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{tenant.city} - {tenant.state}</span>
              </div>
            </div>
          </div>

          {/* Módulos Habilitados */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Módulos Habilitados para esta Imobiliária ({tenant.activeModules.length})
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableModules.map((mod) => {
                const isEnabled = tenant.activeModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      isEnabled
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    }`}
                  >
                    <span className="truncate">{mod.name}</span>
                    {isEnabled ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {tenant.status === 'ACTIVE' ? (
              <button
                onClick={() => onToggleStatus(tenant.id, 'SUSPENDED')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Suspender acesso por inadimplência ou ordem administrativa"
              >
                <Lock className="w-3.5 h-3.5" />
                Suspender Acesso
              </button>
            ) : (
              <button
                onClick={() => onToggleStatus(tenant.id, 'ACTIVE')}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Unlock className="w-3.5 h-3.5" />
                Reativar Acesso
              </button>
            )}

            <button
              onClick={() => {
                if (confirm(`Tem certeza que deseja excluir permanentemente a imobiliária "${tenant.tradeName}"? Essa ação não pode ser desfeita.`)) {
                  onDelete(tenant.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onImpersonate(tenant.id);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title={`Acessar instância de ${tenant.tradeName} com o gestor principal ${tenant.ownerName}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acessar Instância ({tenant.ownerName.split(' ')[0]})</span>
            </button>
            <button
              onClick={() => {
                onEdit(tenant);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar Dados
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  Edit2,
  Trash2,
  Download,
  Share2,
  FileCheck2,
  UserCheck,
  Search,
  Filter,
  Sparkles,
  Printer,
  ChevronDown,
  Building,
  Key,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';
import { DEFAULT_ROLE_PERMISSIONS, UserModulePermissions } from './TeamPermissionsModal';

interface UserPermissionsManagementViewProps {
  currentUser?: UserProfile;
  onNavigateToTab?: (tabId: string) => void;
  onSimulateRole?: (role: UserRole) => void;
}

export const UserPermissionsManagementView: React.FC<UserPermissionsManagementViewProps> = ({
  currentUser,
  onNavigateToTab,
  onSimulateRole
}) => {
  const [activeMode, setActiveMode] = useState<'CARGOS' | 'USUARIOS'>('CARGOS');
  const [selectedRole, setSelectedRole] = useState<UserRole>('BROKER');
  const [selectedUserId, setSelectedUserId] = useState<string>(CURRENT_USER_PROFILES[2]?.id || 'usr_corretor_juliana');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Custom permissions per user or role
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, UserModulePermissions>>(() => ({
    ...DEFAULT_ROLE_PERMISSIONS
  }));

  const [userPermissions, setUserPermissions] = useState<Record<string, UserModulePermissions>>(() => {
    const initial: Record<string, UserModulePermissions> = {};
    CURRENT_USER_PROFILES.forEach(u => {
      initial[u.id] = { ...DEFAULT_ROLE_PERMISSIONS[u.role] };
    });
    return initial;
  });

  const [savedToast, setSavedToast] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'TODAS' | 'LEADS' | 'IMOVEIS' | 'DOCUMENTOS' | 'CUSTODIA' | 'FINANCEIRO'>('TODAS');

  // Active user and permissions depending on mode
  const activeUser = useMemo(() => {
    return CURRENT_USER_PROFILES.find(u => u.id === selectedUserId) || CURRENT_USER_PROFILES[0];
  }, [selectedUserId]);

  const activePerms = useMemo(() => {
    if (activeMode === 'CARGOS') {
      return rolePermissions[selectedRole];
    }
    return userPermissions[selectedUserId] || DEFAULT_ROLE_PERMISSIONS[activeUser.role];
  }, [activeMode, selectedRole, selectedUserId, rolePermissions, userPermissions, activeUser]);

  // Update permission function
  const updatePerm = <M extends keyof UserModulePermissions, K extends keyof UserModulePermissions[M]>(
    module: M,
    key: K,
    val: UserModulePermissions[M][K]
  ) => {
    if (activeMode === 'CARGOS') {
      setRolePermissions(prev => ({
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [module]: {
            ...prev[selectedRole][module],
            [key]: val
          }
        }
      }));
    } else {
      setUserPermissions(prev => ({
        ...prev,
        [selectedUserId]: {
          ...activePerms,
          [module]: {
            ...activePerms[module],
            [key]: val
          }
        }
      }));
    }
  };

  const handleResetToDefault = () => {
    if (activeMode === 'CARGOS') {
      setRolePermissions(prev => ({
        ...prev,
        [selectedRole]: { ...DEFAULT_ROLE_PERMISSIONS[selectedRole] }
      }));
    } else {
      setUserPermissions(prev => ({
        ...prev,
        [selectedUserId]: { ...DEFAULT_ROLE_PERMISSIONS[activeUser.role] }
      }));
    }
    showToast();
  };

  const handleSave = () => {
    showToast();
  };

  const showToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return CURRENT_USER_PROFILES;
    const term = userSearchTerm.toLowerCase();
    return CURRENT_USER_PROFILES.filter(
      u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term)
    );
  }, [userSearchTerm]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <div className="font-bold text-sm">Permissões Atualizadas com Sucesso!</div>
            <div className="text-xs text-emerald-100">Políticas de segurança aplicadas no sistema.</div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                CONTROLE DE ACESSO & PERFIS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SEGURANÇA & LGPD BLINDADA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Matriz de Permissões & Parâmetros de Usuários
            </h1>
            <p className="text-sm text-slate-300">
              Parametrize de forma granular as permissões de cada perfil ou colaborador para <strong>Ver, Alterar, Excluir, Exportar e Acessar Custódia de Documentos</strong> confidenciais.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('agency_governance')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-2 transition-all shadow-sm"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                Regras da Imobiliária (Governança)
              </button>
            )}
            <button
              onClick={handleResetToDefault}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Restaurar Padrão
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Salvar Permissões
            </button>
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Imprimir Matriz de Acessos"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveMode('CARGOS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'CARGOS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              1. Matriz por Cargo (Perfis Padrão)
            </button>
            <button
              onClick={() => setActiveMode('USUARIOS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'USUARIOS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              2. Permissões Granulares por Colaborador
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Perfil Ativo:</span>
            <span className="font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
              {currentUser?.name} ({currentUser?.role})
            </span>
          </div>
        </div>
      </div>

      {/* Target Selector Bar */}
      {activeMode === 'CARGOS' ? (
        /* Role Selection Cards */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(
            [
              { role: 'MASTER_ADMIN', label: 'Diretor / Sócio', desc: 'Acesso total irrestrito', color: 'from-amber-500 to-amber-700' },
              { role: 'MANAGER', label: 'Gerente de Vendas', desc: 'Supervisão de equipe & Roleta', color: 'from-purple-500 to-indigo-600' },
              { role: 'BROKER', label: 'Corretor Interno', desc: 'Leads próprios & Minhas reservas', color: 'from-blue-500 to-cyan-600' },
              { role: 'FINANCIAL_OPERATOR', label: 'Operador Financeiro', desc: 'Splits, DRE, Dimob & Contratos', color: 'from-emerald-500 to-teal-700' },
              { role: 'EXTERNAL_PARTNER', label: 'Corretor Parceiro', desc: 'Lançamentos & Co-corretagem', color: 'from-slate-600 to-slate-800' },
            ] as const
          ).map(item => {
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                )}
                <div className="text-xs font-bold text-slate-900">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-semibold">
                  <span className="font-mono text-slate-400">{item.role}</span>
                  {isSelected ? (
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      Editando <ChevronDown className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-slate-400">Configurar</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* User Selection Strip with Search */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Selecione o Colaborador para Parametrizar:</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={e => setUserSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou cargo..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {filteredUsers.map(user => {
              const isSelected = selectedUserId === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="text-left">
                    <div className="text-[11px] font-bold leading-tight">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.role} • {user.creci}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Permissions Matrix Grid */}
      <div className="space-y-4">
        {/* Module 1: Leads & Funil de Vendas */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Leads & Funil de Vendas</h3>
                <p className="text-xs text-slate-500">Visibilidade de carteira, alteração de etapas, exclusão e roleta</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Escopo: {activePerms.leads.viewScope}
            </span>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* View Scope Select */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  Visualizar Leads (Ver)
                </span>
              </div>
              <select
                value={activePerms.leads.viewScope}
                onChange={e => updatePerm('leads', 'viewScope', e.target.value as any)}
                className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="OWN_ONLY">Apenas Leads Próprios (Individual)</option>
                <option value="TEAM_ONLY">Leads da Equipe / Plantão</option>
                <option value="ALL_AGENCY">Todos os Leads da Imobiliária</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Controla se o corretor enxerga apenas sua carteira ou os contatos de outros corretores.
              </p>
            </div>

            {/* Create & Edit */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Cadastrar & Alterar Leads</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Criar Novos Leads</span>
                <input
                  type="checkbox"
                  checked={activePerms.leads.create}
                  onChange={e => updatePerm('leads', 'create', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Alterar Dados & Observações</span>
                <input
                  type="checkbox"
                  checked={activePerms.leads.edit}
                  onChange={e => updatePerm('leads', 'edit', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>

            {/* Delete, Export & Roleta */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Ações Críticas</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span className="text-red-700 font-semibold flex items-center gap-1">
                  <Trash2 className="w-3 h-3 text-red-500" />
                  Excluir Leads do Sistema
                </span>
                <input
                  type="checkbox"
                  checked={activePerms.leads.delete}
                  onChange={e => updatePerm('leads', 'delete', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Exportar CSV / Planilhas</span>
                <input
                  type="checkbox"
                  checked={activePerms.leads.exportCsv}
                  onChange={e => updatePerm('leads', 'exportCsv', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Redistribuir na Roleta</span>
                <input
                  type="checkbox"
                  checked={activePerms.leads.reassignRoleta}
                  onChange={e => updatePerm('leads', 'reassignRoleta', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Module 2: Imóveis & Estoque */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Catálogo de Imóveis & Estoque</h3>
                <p className="text-xs text-slate-500">Cadastro de imóveis, alteração de valores de venda e dados de proprietários</p>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Visualização & Cadastro</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Visualizar Imóveis (Ver)</span>
                <input
                  type="checkbox"
                  checked={activePerms.properties.view}
                  onChange={e => updatePerm('properties', 'view', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Cadastrar Novo Imóvel</span>
                <input
                  type="checkbox"
                  checked={activePerms.properties.create}
                  onChange={e => updatePerm('properties', 'create', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Alterações & Preço</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Alterar Preço de Venda / Aluguel</span>
                <input
                  type="checkbox"
                  checked={activePerms.properties.editPrice}
                  onChange={e => updatePerm('properties', 'editPrice', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Exportar XML Portais (ZAP/OLX)</span>
                <input
                  type="checkbox"
                  checked={activePerms.properties.exportXml}
                  onChange={e => updatePerm('properties', 'exportXml', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Exclusão</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span className="text-red-700 font-semibold flex items-center gap-1">
                  <Trash2 className="w-3 h-3 text-red-500" />
                  Excluir Imóvel do Catálogo
                </span>
                <input
                  type="checkbox"
                  checked={activePerms.properties.delete}
                  onChange={e => updatePerm('properties', 'delete', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded-sm"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Module 3: Documentos & Minutas Padrão */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Módulo de Documentos & Minutas Padrão</h3>
                <p className="text-xs text-slate-500">Upload de minutas da imobiliária, edição de logo/topo/rodapé, auditoria de IA e impressão PDF</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab?.('document_templates')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Abrir Módulo de Documentos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Geração & Edição</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Gerar Contratos, Recibos & Termos</span>
                <input
                  type="checkbox"
                  checked={activePerms.documents.generateTemplates}
                  onChange={e => updatePerm('documents', 'generateTemplates', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Subir Minutas Padrão da Imobiliária</span>
                <input
                  type="checkbox"
                  checked={activePerms.documents.generateTemplates}
                  onChange={e => updatePerm('documents', 'generateTemplates', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Personalização & IA</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Editar Logo, Topo e Rodapé</span>
                <input
                  type="checkbox"
                  checked={activePerms.documents.generateTemplates}
                  onChange={e => updatePerm('documents', 'generateTemplates', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Executar Auditoria de Erros por IA</span>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="w-4 h-4 text-emerald-600 rounded-sm"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Module 4: Custódia de Documentos no Lead */}
        <div className="bg-white rounded-3xl border border-blue-200 shadow-md overflow-hidden relative">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                4
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Custódia de Documentos Confidenciais (Lead & Proposta)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    SIGILO BANCÁRIO & LGPD
                  </span>
                </div>
                <p className="text-xs text-slate-300">Acesso a RG, CPF, Certidões, Holerites e IRPF ao avançar para Proposta no Funil</p>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50/20">
            {/* Solicitar Custódia */}
            <div className="p-4 rounded-2xl bg-white border border-blue-200/80 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-slate-800 block">Solicitação ao Cliente</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Gerar Link de Custódia</span>
                <input
                  type="checkbox"
                  checked={activePerms.documents.requestCustody}
                  onChange={e => updatePerm('documents', 'requestCustody', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <p className="text-[11px] text-slate-500">
                Gera link com token seguro para o comprador enviar documentos pelo celular ou WhatsApp.
              </p>
            </div>

            {/* Scope of confidential access */}
            <div className="p-4 rounded-2xl bg-white border border-blue-200/80 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-slate-800 block">Acesso aos Documentos (Visualizar)</span>
              <select
                value={activePerms.documents.viewConfidentialCustody}
                onChange={e => updatePerm('documents', 'viewConfidentialCustody', e.target.value as any)}
                className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="OWN_LEADS">Apenas Documentos de Leads Próprios (Dono do Lead)</option>
                <option value="ALL_LEADS">Todos os Documentos de Custódia (Gerência / Direção)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Corretores não autorizados veem aviso de bloqueio por sigilo fiscal.
              </p>
            </div>

            {/* Approval & Download */}
            <div className="p-4 rounded-2xl bg-white border border-blue-200/80 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-slate-800 block">Aprovação & Download</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Aprovar / Rejeitar Documento</span>
                <input
                  type="checkbox"
                  checked={activePerms.documents.approveRejectCustody}
                  onChange={e => updatePerm('documents', 'approveRejectCustody', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Baixar Arquivos Fiscais / PDF</span>
                <input
                  type="checkbox"
                  checked={activePerms.documents.downloadCustodyDocs}
                  onChange={e => updatePerm('documents', 'downloadCustodyDocs', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Module 5: Financeiro, DRE & Splits */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Financeiro, DRE & Repasses</h3>
                <p className="text-xs text-slate-500">Visualização de comissões, autorização de Pix split D+0 e DRE da empresa</p>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Comissões Próprias vs Equipe</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Ver Minhas Comissões</span>
                <input
                  type="checkbox"
                  checked={activePerms.financial.viewOwnCommissions}
                  onChange={e => updatePerm('financial', 'viewOwnCommissions', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Ver Comissões de Toda Equipe</span>
                <input
                  type="checkbox"
                  checked={activePerms.financial.viewTeamCommissions}
                  onChange={e => updatePerm('financial', 'viewTeamCommissions', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Autorizações Bancárias</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Autorizar Pagamentos & Pix Split</span>
                <input
                  type="checkbox"
                  checked={activePerms.financial.authorizePixSplit}
                  onChange={e => updatePerm('financial', 'authorizePixSplit', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">DRE & Contabilidade</span>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Visualizar DRE & Lucro Líquido</span>
                <input
                  type="checkbox"
                  checked={activePerms.financial.viewDre}
                  onChange={e => updatePerm('financial', 'viewDre', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

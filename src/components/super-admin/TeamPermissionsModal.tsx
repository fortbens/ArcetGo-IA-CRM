import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';

export interface UserModulePermissions {
  leads: {
    viewScope: 'OWN_ONLY' | 'TEAM_ONLY' | 'ALL_AGENCY';
    create: boolean;
    edit: boolean;
    delete: boolean;
    exportCsv: boolean;
    reassignRoleta: boolean;
  };
  properties: {
    view: boolean;
    create: boolean;
    editPrice: boolean;
    delete: boolean;
    exportXml: boolean;
  };
  salesMirror: {
    view: boolean;
    lockReservation: boolean; // Trava de 24h
    manageDevelopments: boolean;
    editSalesTable: boolean;
  };
  documents: {
    generateTemplates: boolean;
    requestCustody: boolean;
    viewConfidentialCustody: 'OWN_LEADS' | 'ALL_LEADS';
    approveRejectCustody: boolean;
    downloadCustodyDocs: boolean;
  };
  financial: {
    viewOwnCommissions: boolean;
    viewTeamCommissions: boolean;
    authorizePixSplit: boolean;
    viewDre: boolean;
  };
  integrations: {
    manageApiTokens: boolean;
  };
}

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, UserModulePermissions> = {
  SUPER_ADMIN: {
    leads: { viewScope: 'ALL_AGENCY', create: true, edit: true, delete: true, exportCsv: true, reassignRoleta: true },
    properties: { view: true, create: true, editPrice: true, delete: true, exportXml: true },
    salesMirror: { view: true, lockReservation: true, manageDevelopments: true, editSalesTable: true },
    documents: { generateTemplates: true, requestCustody: true, viewConfidentialCustody: 'ALL_LEADS', approveRejectCustody: true, downloadCustodyDocs: true },
    financial: { viewOwnCommissions: true, viewTeamCommissions: true, authorizePixSplit: true, viewDre: true },
    integrations: { manageApiTokens: true }
  },
  MASTER_ADMIN: {
    leads: { viewScope: 'ALL_AGENCY', create: true, edit: true, delete: true, exportCsv: true, reassignRoleta: true },
    properties: { view: true, create: true, editPrice: true, delete: true, exportXml: true },
    salesMirror: { view: true, lockReservation: true, manageDevelopments: true, editSalesTable: true },
    documents: { generateTemplates: true, requestCustody: true, viewConfidentialCustody: 'ALL_LEADS', approveRejectCustody: true, downloadCustodyDocs: true },
    financial: { viewOwnCommissions: true, viewTeamCommissions: true, authorizePixSplit: true, viewDre: true },
    integrations: { manageApiTokens: true }
  },
  MANAGER: {
    leads: { viewScope: 'TEAM_ONLY', create: true, edit: true, delete: false, exportCsv: false, reassignRoleta: true },
    properties: { view: true, create: true, editPrice: true, delete: false, exportXml: true },
    salesMirror: { view: true, lockReservation: true, manageDevelopments: true, editSalesTable: false },
    documents: { generateTemplates: true, requestCustody: true, viewConfidentialCustody: 'ALL_LEADS', approveRejectCustody: true, downloadCustodyDocs: true },
    financial: { viewOwnCommissions: true, viewTeamCommissions: true, authorizePixSplit: false, viewDre: false },
    integrations: { manageApiTokens: false }
  },
  BROKER: {
    leads: { viewScope: 'OWN_ONLY', create: true, edit: true, delete: false, exportCsv: false, reassignRoleta: false },
    properties: { view: true, create: true, editPrice: false, delete: false, exportXml: false },
    salesMirror: { view: true, lockReservation: true, manageDevelopments: false, editSalesTable: false },
    documents: { generateTemplates: true, requestCustody: true, viewConfidentialCustody: 'OWN_LEADS', approveRejectCustody: false, downloadCustodyDocs: false },
    financial: { viewOwnCommissions: true, viewTeamCommissions: false, authorizePixSplit: false, viewDre: false },
    integrations: { manageApiTokens: false }
  },
  FINANCIAL_OPERATOR: {
    leads: { viewScope: 'ALL_AGENCY', create: false, edit: false, delete: false, exportCsv: true, reassignRoleta: false },
    properties: { view: true, create: false, editPrice: false, delete: false, exportXml: false },
    salesMirror: { view: true, lockReservation: false, manageDevelopments: false, editSalesTable: false },
    documents: { generateTemplates: true, requestCustody: true, viewConfidentialCustody: 'ALL_LEADS', approveRejectCustody: true, downloadCustodyDocs: true },
    financial: { viewOwnCommissions: true, viewTeamCommissions: true, authorizePixSplit: true, viewDre: true },
    integrations: { manageApiTokens: false }
  },
  EXTERNAL_PARTNER: {
    leads: { viewScope: 'OWN_ONLY', create: true, edit: true, delete: false, exportCsv: false, reassignRoleta: false },
    properties: { view: true, create: false, editPrice: false, delete: false, exportXml: false },
    salesMirror: { view: true, lockReservation: true, manageDevelopments: false, editSalesTable: false },
    documents: { generateTemplates: false, requestCustody: false, viewConfidentialCustody: 'OWN_LEADS', approveRejectCustody: false, downloadCustodyDocs: false },
    financial: { viewOwnCommissions: true, viewTeamCommissions: false, authorizePixSplit: false, viewDre: false },
    integrations: { manageApiTokens: false }
  }
};

interface TeamPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
}

export const TeamPermissionsModal: React.FC<TeamPermissionsModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(CURRENT_USER_PROFILES[2]?.id || 'usr_corretor_juliana');
  const [userPermissions, setUserPermissions] = useState<Record<string, UserModulePermissions>>(() => {
    const initial: Record<string, UserModulePermissions> = {};
    CURRENT_USER_PROFILES.forEach(u => {
      initial[u.id] = { ...DEFAULT_ROLE_PERMISSIONS[u.role] };
    });
    return initial;
  });
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const activeUser = CURRENT_USER_PROFILES.find(u => u.id === selectedUserId) || CURRENT_USER_PROFILES[0];
  const currentPerms = userPermissions[selectedUserId] || DEFAULT_ROLE_PERMISSIONS[activeUser.role];

  const updatePerm = <M extends keyof UserModulePermissions, K extends keyof UserModulePermissions[M]>(
    module: M,
    key: K,
    val: UserModulePermissions[M][K]
  ) => {
    setUserPermissions(prev => ({
      ...prev,
      [selectedUserId]: {
        ...currentPerms,
        [module]: {
          ...currentPerms[module],
          [key]: val
        }
      }
    }));
  };

  const applyPreset = (presetRole: UserRole) => {
    setUserPermissions(prev => ({
      ...prev,
      [selectedUserId]: { ...DEFAULT_ROLE_PERMISSIONS[presetRole] }
    }));
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Matriz de Permissões da Equipe</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 border border-blue-400/30 text-blue-300">
                  GESTOR IMOBILIÁRIO
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Parametrize permissões de Ver, Alterar, Excluir, Exportar e Custódia de Documentos para cada usuário
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Switcher Bar */}
        <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Selecionar Usuário:</span>
            {CURRENT_USER_PROFILES.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  selectedUserId === u.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{u.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-80">({u.role === 'MASTER_ADMIN' ? 'Diretor' : u.role === 'MANAGER' ? 'Gerente' : u.role === 'BROKER' ? 'Corretor' : u.role})</span>
              </button>
            ))}
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500">Preset Rápido:</span>
            <button
              onClick={() => applyPreset('BROKER')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold"
            >
              Corretor
            </button>
            <button
              onClick={() => applyPreset('MANAGER')}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-[10px] font-bold"
            >
              Gerente
            </button>
            <button
              onClick={() => applyPreset('MASTER_ADMIN')}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-[10px] font-bold"
            >
              Diretor
            </button>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* User Info Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeUser.avatar} alt={activeUser.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{activeUser.name}</h4>
                <p className="text-slate-500 text-xs">{activeUser.email} • CRECI: {activeUser.creci}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Função: {activeUser.role}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">Status: Ativo</span>
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <span>Tenant: <strong>{activeUser.tenantName}</strong></span>
            </div>
          </div>

          {/* Module 1: LEADS & CRM */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h4 className="font-extrabold text-slate-900">Módulo de Leads & Roleta de Atendimento</h4>
              </div>
              <span className="text-[10px] text-slate-500">Controle de acesso a contatos e clientes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 block text-[11px]">Escopo de Visualização:</span>
                <select
                  value={currentPerms.leads.viewScope}
                  onChange={e => updatePerm('leads', 'viewScope', e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                >
                  <option value="OWN_ONLY">Apenas os Próprios Leads</option>
                  <option value="TEAM_ONLY">Leads da sua Equipe</option>
                  <option value="ALL_AGENCY">Todos os Leads da Imobiliária</option>
                </select>
              </div>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Criar / Cadastrar Leads</span>
                  <span className="text-[10px] text-slate-500">Entrada manual ou WhatsApp</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.leads.create}
                  onChange={e => updatePerm('leads', 'create', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Alterar / Editar Leads</span>
                  <span className="text-[10px] text-slate-500">Mudar fase do funil e notas</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.leads.edit}
                  onChange={e => updatePerm('leads', 'edit', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-red-700 block text-[11px]">Excluir Leads</span>
                  <span className="text-[10px] text-slate-500">Remover do funil permanentemente</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.leads.delete}
                  onChange={e => updatePerm('leads', 'delete', e.target.checked)}
                  className="w-4 h-4 rounded text-red-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Exportar Base (CSV/Excel)</span>
                  <span className="text-[10px] text-slate-500">Download em massa de telefones</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.leads.exportCsv}
                  onChange={e => updatePerm('leads', 'exportCsv', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Reatribuir na Roleta</span>
                  <span className="text-[10px] text-slate-500">Transferir lead entre corretores</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.leads.reassignRoleta}
                  onChange={e => updatePerm('leads', 'reassignRoleta', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>
            </div>
          </div>

          {/* Module 2: IMÓVEIS & CATÁLOGO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-600" />
                <h4 className="font-extrabold text-slate-900">Módulo de Imóveis & Estoque</h4>
              </div>
              <span className="text-[10px] text-slate-500">Cadastros e precificação</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Cadastrar Imóveis</span>
                  <span className="text-[10px] text-slate-500">Inserir nova captação</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.properties.create}
                  onChange={e => updatePerm('properties', 'create', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Alterar Preços / Venda</span>
                  <span className="text-[10px] text-slate-500">Editar valores de tabela</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.properties.editPrice}
                  onChange={e => updatePerm('properties', 'editPrice', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-red-700 block text-[11px]">Excluir do Catálogo</span>
                  <span className="text-[10px] text-slate-500">Remover do sistema</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.properties.delete}
                  onChange={e => updatePerm('properties', 'delete', e.target.checked)}
                  className="w-4 h-4 rounded text-red-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Exportar Feeds XML</span>
                  <span className="text-[10px] text-slate-500">ZAP, VivaReal, OLX</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.properties.exportXml}
                  onChange={e => updatePerm('properties', 'exportXml', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>
            </div>
          </div>

          {/* Module 3: DOCUMENTOS & CUSTÓDIA */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-purple-600" />
                <h4 className="font-extrabold text-slate-900">Módulo de Documentos & Custódia de Propostas</h4>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">
                LGPD & COMPLIANCE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 block text-[11px]">Acesso aos Documentos de Custódia:</span>
                <select
                  value={currentPerms.documents.viewConfidentialCustody}
                  onChange={e => updatePerm('documents', 'viewConfidentialCustody', e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                >
                  <option value="OWN_LEADS">Apenas dos Seus Próprios Leads (Corretor)</option>
                  <option value="ALL_LEADS">De Todos os Leads da Imobiliária (Gestor)</option>
                </select>
              </div>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Gerar Link de Custódia</span>
                  <span className="text-[10px] text-slate-500">Enviar link para o cliente no WhatsApp</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.documents.requestCustody}
                  onChange={e => updatePerm('documents', 'requestCustody', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Aprovar / Reprovar Docs</span>
                  <span className="text-[10px] text-slate-500">Validar CNH, renda e certidões</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.documents.approveRejectCustody}
                  onChange={e => updatePerm('documents', 'approveRejectCustody', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Baixar Documentos Sensíveis</span>
                  <span className="text-[10px] text-slate-500">Download de comprovantes e IR</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.documents.downloadCustodyDocs}
                  onChange={e => updatePerm('documents', 'downloadCustodyDocs', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Gerar Minutas & Contratos IA</span>
                  <span className="text-[10px] text-slate-500">Criar PDFs com dados automáticos</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.documents.generateTemplates}
                  onChange={e => updatePerm('documents', 'generateTemplates', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
              </label>
            </div>
          </div>

          {/* Module 4: FINANCEIRO & SPLIT */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <h4 className="font-extrabold text-slate-900">Módulo Financeiro, Comissões & BaaS</h4>
              </div>
              <span className="text-[10px] text-slate-500">Alçadas financeiras</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Ver Comissões da Equipe</span>
                  <span className="text-[10px] text-slate-500">Visibilidade de outros corretores</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.financial.viewTeamCommissions}
                  onChange={e => updatePerm('financial', 'viewTeamCommissions', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Autorizar Split Pix D+0</span>
                  <span className="text-[10px] text-slate-500">Liquidação Conta Pronta</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.financial.authorizePixSplit}
                  onChange={e => updatePerm('financial', 'authorizePixSplit', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Visualizar DRE & Lucro</span>
                  <span className="text-[10px] text-slate-500">Relatórios fiscais e despesas</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.financial.viewDre}
                  onChange={e => updatePerm('financial', 'viewDre', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Configurar Tokens de APIs</span>
                  <span className="text-[10px] text-slate-500">WhatsApp, Meta, OpenAI, Bancos</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPerms.integrations.manageApiTokens}
                  onChange={e => updatePerm('integrations', 'manageApiTokens', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-600">
              Permissões salvas no perfil de <strong>{activeUser.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saveToast ? 'Permissões Salvas!' : 'Salvar Permissões'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Shield, 
  Building2, 
  Check, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Camera, 
  Upload, 
  Image as ImageIcon,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  Copy,
  Sparkles
} from 'lucide-react';
import { 
  PlatformUserAccount, 
  TenantAgency, 
  PlatformUserHierarchy, 
  PermissionDefinition,
  PlatformUserStatus,
  UserAddress,
  UserEmergencyContact
} from '../../types/superAdmin';
import { optimizeImageFile } from '../../utils/imageOptimizer';

interface UserAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<PlatformUserAccount>) => void;
  userToEdit?: PlatformUserAccount | null;
  tenants: TenantAgency[];
  hierarchies: PlatformUserHierarchy[];
  permissions: PermissionDefinition[];
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
];

export const UserAdminModal: React.FC<UserAdminModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  tenants,
  hierarchies,
  permissions,
}) => {
  const [formData, setFormData] = useState<Partial<PlatformUserAccount>>({
    name: '',
    email: '',
    phone: '',
    role: 'BROKER',
    tenantId: tenants[0]?.id || 'tenant_matriz_sp',
    tenantName: tenants[0]?.tradeName || 'AcertGo Matriz Jardins',
    avatar: AVATAR_PRESETS[0],
    creci: '',
    cpf: '',
    rg: '',
    birthDate: '',
    admissionDate: '',
    department: 'Vendas',
    address: {
      cep: '04538-133',
      street: 'Rua Joaquim Floriano',
      number: '820',
      complement: '',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    emergencyContact: {
      name: '',
      relationship: 'Cônjuge',
      phone: '',
      phoneAlt: '',
      notes: ''
    },
    status: 'ATIVO',
    customPermissions: {},
    password: ''
  });

  const [activeTab, setActiveTab] = useState<'DADOS' | 'FOTO' | 'ENDERECO' | 'EMERGENCIA' | 'PERMISSOES'>('DADOS');
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pass = 'Imob#';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleCopyUserCard = () => {
    const tenant = tenants.find(t => t.id === formData.tenantId) || tenants[0];
    const text = `👋 *BEM-VINDO À EQUIPE - ${tenant?.tradeName || 'ACERTGO'}*
--------------------------------------------------
*Colaborador:* ${formData.name || 'Novo Usuário'}
*Cargo / Função:* ${formData.role || 'Corretor'}
*E-mail de Login:* ${formData.email || 'Não informado'}
*Senha de Acesso:* ${formData.password || 'Acert@2026'}
*Imobiliária:* ${tenant?.tradeName || 'AcertGo'}
*Link de Acesso:* https://matriz.acertgo.com.br
--------------------------------------------------
👉 Entre no sistema com suas credenciais para começar a atender seus clientes!`;

    navigator.clipboard.writeText(text);
    setCopyFeedback('Convite copiado com sucesso!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        ...userToEdit,
        password: userToEdit.password || 'Acert@2026',
        address: userToEdit.address || {
          cep: '04538-133',
          street: 'Rua Joaquim Floriano',
          number: '820',
          complement: '',
          neighborhood: 'Itaim Bibi',
          city: 'São Paulo',
          state: 'SP'
        },
        emergencyContact: userToEdit.emergencyContact || {
          name: '',
          relationship: 'Cônjuge',
          phone: '',
          phoneAlt: '',
          notes: ''
        }
      });
    } else {
      const initialPass = generateStrongPassword();
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'BROKER',
        tenantId: tenants[0]?.id || 'tenant_matriz_sp',
        tenantName: tenants[0]?.tradeName || 'AcertGo Matriz Jardins',
        avatar: AVATAR_PRESETS[0],
        creci: '',
        cpf: '',
        rg: '',
        birthDate: '',
        admissionDate: '2026-09-01',
        department: 'Vendas',
        password: initialPass,
        address: {
          cep: '04538-133',
          street: 'Rua Joaquim Floriano',
          number: '820',
          complement: '',
          neighborhood: 'Itaim Bibi',
          city: 'São Paulo',
          state: 'SP'
        },
        emergencyContact: {
          name: '',
          relationship: 'Cônjuge',
          phone: '',
          phoneAlt: '',
          notes: ''
        },
        status: 'ATIVO',
        customPermissions: {}
      });
    }
  }, [userToEdit, tenants]);

  if (!isOpen) return null;

  const handleRoleChange = (role: string) => {
    const defaultPerms: Record<string, boolean> = {};
    permissions.forEach(p => {
      defaultPerms[p.id] = p.defaultRoles.includes(role);
    });

    setFormData(prev => ({
      ...prev,
      role,
      customPermissions: defaultPerms,
      tenantId: role === 'SUPER_ADMIN' ? 'GLOBAL' : prev.tenantId,
      tenantName: role === 'SUPER_ADMIN' ? 'Plataforma Global AcertGo SaaS' : prev.tenantName
    }));
  };

  const handleTenantChange = (tenantId: string) => {
    const selected = tenants.find(t => t.id === tenantId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        tenantId: selected.id,
        tenantName: selected.tradeName
      }));
    }
  };

  const handleTogglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      customPermissions: {
        ...(prev.customPermissions || {}),
        [permId]: !prev.customPermissions?.[permId]
      }
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormError(null);
      try {
        // Redimensiona e otimiza automaticamente sem travar por limite de 2MB
        const optimized = await optimizeImageFile(file, { maxWidth: 800, maxHeight: 800, quality: 0.9 });
        setFormData(prev => ({
          ...prev,
          avatar: optimized
        }));
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({
            ...prev,
            avatar: event.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim()) {
      setFormError('Preencha os campos obrigatórios (Nome completo e E-mail corporativo).');
      setActiveTab('DADOS');
      return;
    }
    setFormError(null);
    onSave(formData);
    onClose();
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, PermissionDefinition[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {userToEdit ? 'Editar Usuário do Sistema' : 'Novo Usuário do Sistema (Super Admin)'}
              </h2>
              <p className="text-xs text-slate-400">
                Cadastro com endereço, contatos de emergência, foto de perfil e matriz de permissões
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-2 sm:gap-4 text-xs font-semibold text-slate-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('DADOS')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'DADOS' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            1. Perfil & Cargo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FOTO')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'FOTO' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            2. Foto de Perfil
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ENDERECO')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'ENDERECO' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            3. Endereço
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EMERGENCIA')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'EMERGENCIA' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            4. Emergência
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PERMISSOES')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'PERMISSOES' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            5. Permissões
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[72vh] overflow-y-auto space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between animate-in fade-in-50 duration-150">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{formError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-500 hover:text-rose-800 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: DADOS CADASTRAIS & CARGO */}
          {activeTab === 'DADOS' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">E-mail Corporativo (Login) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="carlos@imobiliaria.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Senha Inicial de Acesso do Usuário */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-800 font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    Senha de Acesso do Usuário *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, password: generateStrongPassword() }))}
                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Gerar Nova Senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Digite a senha de login..."
                    className="w-full px-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-500">
                    O usuário usará este e-mail e senha para entrar.
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUserCard}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    {copyFeedback || 'Copiar Convite (WhatsApp)'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CPF</label>
                  <input
                    type="text"
                    value={formData.cpf || ''}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="123.456.789-00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98888-7777"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CRECI / Registro</label>
                  <input
                    type="text"
                    value={formData.creci || ''}
                    onChange={(e) => setFormData({ ...formData, creci: e.target.value })}
                    placeholder="123456-F / SP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Departamento</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Vendas, Locação, Jurídico..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Data Admissão</label>
                  <input
                    type="date"
                    value={formData.admissionDate || ''}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status da Conta</label>
                  <select
                    value={formData.status || 'ATIVO'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PlatformUserStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                    <option value="PENDENTE">Pendente de Ativação</option>
                  </select>
                </div>
              </div>

              {/* Cargo e Hierarquia */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Cargo / Nível Hierárquico *</label>
                <div className="space-y-1.5">
                  {hierarchies.map((h) => {
                    const isSelected = formData.role === h.role;
                    return (
                      <div
                        key={h.role}
                        onClick={() => handleRoleChange(h.role)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${h.color}`}>
                            Nível {h.level}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900">{h.label}</span>
                            <span className="text-[11px] text-slate-500 ml-2">{h.description}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Imobiliária Vinculada */}
              {formData.role !== 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Imobiliária Vinculada (Tenant) *</label>
                  <select
                    value={formData.tenantId || ''}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.tradeName} ({t.city} - {t.state})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FOTO DE PERFIL */}
          {activeTab === 'FOTO' && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="relative">
                  <img
                    src={formData.avatar || AVATAR_PRESETS[0]}
                    alt="Foto Preview"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-xs">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h4 className="font-bold text-slate-900 text-sm">Foto de Perfil do Usuário</h4>
                    <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 rounded-full">
                      Sem Limite de Tamanho
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Utilizada no CRM, cabeçalho, roleta de atendimento e relatórios de comissões (suporta fotos em alta resolução de qualquer tamanho).
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Fazer Upload
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ou Insira uma URL Direta de Imagem</label>
                <input
                  type="url"
                  value={formData.avatar || ''}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Avatares Corporativos Prontos</label>
                <div className="flex gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: preset })}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                        formData.avatar === preset ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENDEREÇO COMPLETO */}
          {activeTab === 'ENDERECO' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CEP</label>
                  <input
                    type="text"
                    value={formData.address?.cep || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...(formData.address as UserAddress), cep: e.target.value }
                    })}
                    placeholder="01234-567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Logradouro / Rua</label>
                  <input
                    type="text"
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...(formData.address as UserAddress), street: e.target.value }
                    })}
                    placeholder="Rua Joaquim Floriano"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Número</label>
                  <input
                    type="text"
                    value={formData.address?.number || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...(formData.address as UserAddress), number: e.target.value }
                    })}
                    placeholder="100"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Complemento</label>
                  <input
                    type="text"
                    value={formData.address?.complement || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...(formData.address as UserAddress), complement: e.target.value }
                    })}
                    placeholder="Apto 45"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bairro</label>
                  <input
                    type="text"
                    value={formData.address?.neighborhood || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...(formData.address as UserAddress), neighborhood: e.target.value }
                    })}
                    placeholder="Itaim Bibi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cidade / Estado</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.address?.city || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...(formData.address as UserAddress), city: e.target.value }
                      })}
                      placeholder="São Paulo"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.address?.state || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...(formData.address as UserAddress), state: e.target.value }
                      })}
                      placeholder="SP"
                      className="w-16 px-2 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTATO DE EMERGÊNCIA */}
          {activeTab === 'EMERGENCIA' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Informações essenciais para segurança do trabalho e comunicação urgente em plantões ou viagens corporativas.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nome do Contato *</label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: { ...(formData.emergencyContact as UserEmergencyContact), name: e.target.value }
                    })}
                    placeholder="Ex: Renata Silveira"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grau de Parentesco</label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: { ...(formData.emergencyContact as UserEmergencyContact), relationship: e.target.value }
                    })}
                    placeholder="Cônjuge, Mãe, Pai, Filho, Irmão"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone Principal *</label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: { ...(formData.emergencyContact as UserEmergencyContact), phone: e.target.value }
                    })}
                    placeholder="(11) 98112-9900"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone Alternativo</label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.phoneAlt || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: { ...(formData.emergencyContact as UserEmergencyContact), phoneAlt: e.target.value }
                    })}
                    placeholder="(11) 3044-8899"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observações Médicas / Alergias</label>
                <textarea
                  rows={2}
                  value={formData.emergencyContact?.notes || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...(formData.emergencyContact as UserEmergencyContact), notes: e.target.value }
                  })}
                  placeholder="Tipo sanguíneo, alergias a medicamentos ou instruções em caso de socorro..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 5: MATRIZ DE PERMISSÕES */}
          {activeTab === 'PERMISSOES' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Permissões pré-configuradas para o cargo <strong>{formData.role}</strong>. Você pode personalizar exceções individualmente.
                </span>
              </div>

              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category} className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {category}
                  </span>
                  <div className="space-y-1.5">
                    {perms.map((p) => {
                      const isGranted = !!formData.customPermissions?.[p.id];
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleTogglePermission(p.id)}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isGranted
                              ? 'bg-slate-50 border-slate-300 text-slate-900'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-[11px] text-slate-500">{p.description}</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isGranted}
                            onChange={() => {}}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Salvar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

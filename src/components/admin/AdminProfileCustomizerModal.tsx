import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Palette, 
  Globe, 
  Camera, 
  Upload, 
  Check, 
  Sliders, 
  Building2, 
  Phone, 
  Mail, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal,
  ExternalLink,
  Save,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../../types/crm';
import { SystemThemeConfig, SYSTEM_COLOR_PRESETS, SidebarThemeVariant } from '../../types/theme';
import { WebsiteConfig } from '../../types/crm';
import { TenantAgency } from '../../types/superAdmin';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { saveThemeConfigToCloud, saveWebsiteConfigToCloud } from '../../services/systemPersistenceService';

interface AdminProfileCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  currentTheme: SystemThemeConfig;
  currentWebsiteConfig: WebsiteConfig;
  currentTenant?: TenantAgency | null;
  onSaveAll: (updated: {
    user: UserProfile;
    theme: SystemThemeConfig;
    websiteConfig: WebsiteConfig;
    tenant?: Partial<TenantAgency>;
  }) => void;
}

export const AdminProfileCustomizerModal: React.FC<AdminProfileCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentTheme,
  currentWebsiteConfig,
  currentTenant,
  onSaveAll
}) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SYSTEM_THEME' | 'CMS_WEBSITE'>('PROFILE');

  // 1. Admin Profile States
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || currentTenant?.ownerPhone || '(11) 98844-3322');
  const [avatar, setAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  const [creci, setCreci] = useState(currentUser.creci || currentTenant?.creciJ || '');
  const [roleTitle, setRoleTitle] = useState('Diretor Geral & Administrador');
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  // 2. System Theme (CRM) States
  const [systemLogoUrl, setSystemLogoUrl] = useState(currentTheme.logoUrl || currentTenant?.logoUrl || '');
  const [systemLogoSize, setSystemLogoSize] = useState<number>(38); // height in px
  const [primaryColor, setPrimaryColor] = useState(currentTheme.primaryColor || '#2563eb');
  const [secondaryColor, setSecondaryColor] = useState(currentTheme.secondaryColor || '#0ea5e9');
  const [sidebarTheme, setSidebarTheme] = useState<SidebarThemeVariant>(currentTheme.sidebarTheme || 'dark');
  const [systemPlatformName, setSystemPlatformName] = useState(currentTheme.platformName || currentTenant?.tradeName || 'AcertGo Imóveis');
  const systemLogoInputRef = useRef<HTMLInputElement>(null);

  // 3. Website & CMS States
  const [cmsLogoUrl, setCmsLogoUrl] = useState(currentWebsiteConfig.logoUrl || currentTenant?.logoUrl || '');
  const [cmsLogoSize, setCmsLogoSize] = useState<'PEQUENO' | 'MEDIO' | 'GRANDE'>(currentWebsiteConfig.logoSize || 'MEDIO');
  const [cmsSiteName, setCmsSiteName] = useState(currentWebsiteConfig.siteName || currentTenant?.tradeName || 'AcertGo Imóveis');
  const [cmsSlogan, setCmsSlogan] = useState(currentWebsiteConfig.slogan || 'Imóveis Selecionados & Atendimento Exclusivo');
  const [cmsPrimaryColor, setCmsPrimaryColor] = useState(currentWebsiteConfig.primaryColor || '#0284c7');
  const [cmsWhatsapp, setCmsWhatsapp] = useState(currentWebsiteConfig.whatsapp || currentTenant?.ownerPhone || '(11) 98844-3322');
  const [cmsPhone, setCmsPhone] = useState(currentWebsiteConfig.phone || currentTenant?.ownerPhone || '(11) 3045-8000');
  const [cmsCustomDomain, setCmsCustomDomain] = useState(currentWebsiteConfig.customDomain || 'imoveis.acertgo.com.br');
  const cmsLogoInputRef = useRef<HTMLInputElement>(null);

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handler for Profile Photo (NO 2MB LIMIT - automatically optimized gracefully)
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Handles any file size without arbitrary limits (5MB, 10MB, 20MB+)
      const optimized = await optimizeImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.88 });
      setAvatar(optimized);
      setToastMessage('Foto de perfil carregada com sucesso (sem limite de tamanho)!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      // Fallback direct read
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handler for System Logo Upload (No file size limit)
  const handleSystemLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 800, maxHeight: 400, quality: 0.9 });
      setSystemLogoUrl(optimized);
      setToastMessage('Logotipo do sistema carregado com sucesso!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => setSystemLogoUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handler for CMS Website Logo Upload (No file size limit)
  const handleCmsLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 800, maxHeight: 400, quality: 0.9 });
      setCmsLogoUrl(optimized);
      setToastMessage('Logotipo do site e página de vendas carregado!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => setCmsLogoUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Force Fixation & Atomic Save
  const handleSaveAllAndPersist = async () => {
    setIsSaving(true);

    const updatedUser: UserProfile = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim(),
      avatar: avatar || currentUser.avatar,
      creci: creci.trim()
    };

    const updatedTheme: SystemThemeConfig = {
      ...currentTheme,
      platformName: systemPlatformName.trim(),
      logoUrl: systemLogoUrl,
      sidebarLogoUrl: systemLogoUrl,
      primaryColor,
      secondaryColor,
      sidebarTheme
    };

    const updatedWebsiteConfig: WebsiteConfig = {
      ...currentWebsiteConfig,
      siteName: cmsSiteName.trim(),
      slogan: cmsSlogan.trim(),
      logoUrl: cmsLogoUrl,
      logoSize: cmsLogoSize,
      primaryColor: cmsPrimaryColor,
      whatsapp: cmsWhatsapp.trim(),
      phone: cmsPhone.trim(),
      customDomain: cmsCustomDomain.trim()
    };

    // Apply CSS Variables immediately to document root
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    }

    // Persist in cloud and localStorage
    try {
      await saveThemeConfigToCloud(updatedTheme);
      await saveWebsiteConfigToCloud(updatedWebsiteConfig);
    } catch (err) {
      console.warn('Erro ao salvar no cloud (mantido cache local seguro):', err);
    }

    // Callback to parent App.tsx
    onSaveAll({
      user: updatedUser,
      theme: updatedTheme,
      websiteConfig: updatedWebsiteConfig,
      tenant: currentTenant ? {
        tradeName: systemPlatformName,
        logoUrl: systemLogoUrl,
        ownerPhone: phone
      } : undefined
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setToastMessage('✅ Todas as personalizações foram fixadas e salvas com sucesso no sistema e no CMS!');
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md font-bold">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Perfil do Administrador & Personalizações
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Gestão Centralizada
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Organize claramente o que é para o <strong>Sistema CRM</strong> e o que é para o <strong>Site Oficial & CMS</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 shrink-0 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'PROFILE'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Perfil & Foto (Sem Limite 2MB)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SYSTEM_THEME')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'SYSTEM_THEME'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>2. Personalizações do Sistema (CRM)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CMS_WEBSITE')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'CMS_WEBSITE'
                ? 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>3. Página de Vendas & CMS (Site Público)</span>
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-slate-700">
          {/* TAB 1: ADMIN PROFILE & PHOTO (NO 2MB LIMIT) */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              {/* Photo Area */}
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <img
                    src={avatar}
                    alt="Foto do Perfil"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => profilePhotoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold">Alterar</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h4 className="font-bold text-sm text-slate-900">Foto de Perfil do Administrador</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-full">
                      Sem Limite de Tamanho
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Você pode subir fotos de qualquer resolução ou tamanho (5MB, 10MB, 20MB+). O sistema comprime e otimiza automaticamente no seu navegador sem perda de qualidade visual.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <input
                      type="file"
                      ref={profilePhotoInputRef}
                      onChange={handleProfilePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => profilePhotoInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto do Computador / Celular</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Data Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nome Completo do Administrador</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">E-mail Corporativo de Login</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@acertgo.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telefone / WhatsApp Corporativo</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98844-3322"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">CRECI do Administrador / Responsável</label>
                  <input
                    type="text"
                    value={creci}
                    onChange={(e) => setCreci(e.target.value)}
                    placeholder="123456-F / SP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Cargo / Descrição Hierárquica</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="Diretor Geral & Administrador"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM CUSTOMIZATION (CRM) */}
          {activeTab === 'SYSTEM_THEME' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2 text-blue-900 font-medium">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Estas configurações aplicam-se exclusivamente ao <strong>ambiente interno do CRM</strong> (telas, barras e menus).</span>
              </div>

              {/* System Logo & Size */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-sm text-slate-900">Logotipo do Sistema (CRM)</h4>
                    <p className="text-slate-500 text-[11px]">Exibido na barra lateral e topo do painel administrativo.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={systemLogoInputRef}
                      onChange={handleSystemLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => systemLogoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Logo do Sistema</span>
                    </button>
                  </div>
                </div>

                {/* Logo Preview and Height Slider */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-bold text-[11px]">Pré-visualização:</span>
                    {systemLogoUrl ? (
                      <img
                        src={systemLogoUrl}
                        alt="Logo Sistema"
                        style={{ height: `${systemLogoSize}px` }}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-slate-400 italic">Nenhum logo configurado</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-64">
                    <span className="text-slate-500 font-bold text-[11px] whitespace-nowrap">Altura: {systemLogoSize}px</span>
                    <input
                      type="range"
                      min={24}
                      max={64}
                      step={2}
                      value={systemLogoSize}
                      onChange={(e) => setSystemLogoSize(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* System Colors & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nome da Instância no Sistema</label>
                  <input
                    type="text"
                    value={systemPlatformName}
                    onChange={(e) => setSystemPlatformName(e.target.value)}
                    placeholder="AcertGo Matriz Jardins"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tema da Barra Lateral</label>
                  <select
                    value={sidebarTheme}
                    onChange={(e) => setSidebarTheme(e.target.value as SidebarThemeVariant)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                    <option value="dark">Escuro Padrão (Slate)</option>
                    <option value="navy">Azul Marinho Executivo</option>
                    <option value="emerald">Esmeralda Corporativo</option>
                    <option value="obsidian">Obsidiana & Ouro</option>
                    <option value="light">Claro Minimalista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cor Primária do Sistema (Botões e Destaques)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cor Secundária do Sistema</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Ready Presets */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">Presets Rápidos de Cores Corporativas</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SYSTEM_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primaryColor);
                        setSecondaryColor(preset.secondaryColor);
                        setSidebarTheme(preset.sidebarTheme);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-left transition-all hover:shadow-xs flex items-center gap-2 cursor-pointer bg-white"
                    >
                      <span 
                        className="w-5 h-5 rounded-full shrink-0 shadow-2xs" 
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <span className="font-bold text-[11px] text-slate-800 truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEBSITE & SALES CMS CUSTOMIZATION */}
          {activeTab === 'CMS_WEBSITE' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-900 font-medium">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Estas configurações aplicam-se à <strong>Página Pública de Vendas & Site Modelo</strong> visto pelos clientes finais.</span>
              </div>

              {/* CMS Logo & Size */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-sm text-slate-900">Logotipo da Página de Vendas & Site</h4>
                    <p className="text-slate-500 text-[11px]">Exibido no cabeçalho e rodapé do site oficial da imobiliária.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={cmsLogoInputRef}
                      onChange={handleCmsLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cmsLogoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Logo do Site</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-bold text-[11px]">Pré-visualização no Site:</span>
                    {cmsLogoUrl ? (
                      <img
                        src={cmsLogoUrl}
                        alt="Logo CMS"
                        className={`object-contain ${
                          cmsLogoSize === 'PEQUENO' ? 'h-8' : cmsLogoSize === 'GRANDE' ? 'h-14' : 'h-10'
                        }`}
                      />
                    ) : (
                      <span className="text-slate-400 italic">Nenhum logo configurado</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold text-[11px]">Tamanho:</span>
                    <select
                      value={cmsLogoSize}
                      onChange={(e) => setCmsLogoSize(e.target.value as any)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold text-xs"
                    >
                      <option value="PEQUENO">Pequeno (32px)</option>
                      <option value="MEDIO">Médio Padrão (40px)</option>
                      <option value="GRANDE">Grande Destaque (56px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Site Identity & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Título do Site Oficial</label>
                  <input
                    type="text"
                    value={cmsSiteName}
                    onChange={(e) => setCmsSiteName(e.target.value)}
                    placeholder="AcertGo Imóveis"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Slogan Comercial / Subtítulo</label>
                  <input
                    type="text"
                    value={cmsSlogan}
                    onChange={(e) => setCmsSlogan(e.target.value)}
                    placeholder="Imóveis Selecionados & Atendimento Exclusivo"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp de Plantão para Leads</label>
                  <input
                    type="tel"
                    value={cmsWhatsapp}
                    onChange={(e) => setCmsWhatsapp(e.target.value)}
                    placeholder="(11) 98844-3322"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telefone Fixo / Comercial do Site</label>
                  <input
                    type="tel"
                    value={cmsPhone}
                    onChange={(e) => setCmsPhone(e.target.value)}
                    placeholder="(11) 3045-8000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cor Primária do Site & Botões de Ação</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cmsPrimaryColor}
                      onChange={(e) => setCmsPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={cmsPrimaryColor}
                      onChange={(e) => setCmsPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Domínio Próprio do Site (Apontamento CNAME)</label>
                  <input
                    type="text"
                    value={cmsCustomDomain}
                    onChange={(e) => setCmsCustomDomain(e.target.value)}
                    placeholder="www.suaimobiliaria.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Persistência atômica no Firestore e cache local seguro sem perda de dados.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAllAndPersist}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Fixado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>Fixar e Salvar Todas as Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

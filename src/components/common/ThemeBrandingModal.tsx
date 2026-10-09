import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  X, 
  Sparkles, 
  Building2, 
  Eye, 
  Sliders, 
  Layers, 
  Sun, 
  Moon, 
  Trash2,
  ExternalLink,
  Crop,
  Globe, 
  Info, 
  Maximize2,
  Cloud,
  CheckCircle2,
  Lock,
  FileCheck
} from 'lucide-react';
import { 
  SystemThemeConfig, 
  SYSTEM_COLOR_PRESETS, 
  PRESET_LOGOS, 
  DEFAULT_SYSTEM_THEME,
  SidebarThemeVariant
} from '../../types/theme';
import { ImageCropModal } from './ImageCropModal';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { saveThemeConfigToCloud } from '../../services/systemPersistenceService';

interface ThemeBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: SystemThemeConfig;
  onSaveTheme: (newTheme: SystemThemeConfig) => void;
}

export const ThemeBrandingModal: React.FC<ThemeBrandingModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSaveTheme
}) => {
  const [formData, setFormData] = useState<SystemThemeConfig>({ ...currentTheme });
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'sidebar'>('colors');
  const [logoInputMode, setLogoInputMode] = useState<'preset' | 'upload' | 'url'>(formData.logoType || 'preset');
  const [customLogoUrl, setCustomLogoUrl] = useState(formData.logoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loginLogoFileInputRef = useRef<HTMLInputElement>(null);
  const footerLogoFileInputRef = useRef<HTMLInputElement>(null);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Favicon state & refs
  const [faviconInputMode, setFaviconInputMode] = useState<'upload' | 'url' | 'same_as_logo'>(
    formData.faviconUrl ? (formData.faviconType === 'url' ? 'url' : 'upload') : 'same_as_logo'
  );
  const [customFaviconUrl, setCustomFaviconUrl] = useState(formData.faviconUrl || '');
  const faviconFileInputRef = useRef<HTMLInputElement>(null);

  // Crop tool state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<'LOGO' | 'FAVICON' | 'SIDEBAR_ICON'>('LOGO');
  const [cropSourceImage, setCropSourceImage] = useState<string>('');

  if (!isOpen) return null;

  // Helper to dynamically update browser tab favicon
  const updateBrowserFavicon = (url: string) => {
    if (!url) return;
    try {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = url;
    } catch (e) {
      console.error('Erro ao atualizar favicon:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file, { maxWidth: 800, maxHeight: 400, quality: 0.85 });
        setFormData(prev => ({
          ...prev,
          logoUrl: optimized,
          logoType: 'upload'
        }));
        setCustomLogoUrl(optimized);
      } catch (err) {
        console.error('Erro ao otimizar logotipo:', err);
      }
    }
    e.target.value = '';
  };

  const handleLoginLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file, { maxWidth: 600, maxHeight: 300, quality: 0.85 });
        setFormData(prev => ({
          ...prev,
          loginLogoUrl: optimized
        }));
      } catch (err) {
        console.error('Erro ao otimizar logo de login:', err);
      }
    }
    e.target.value = '';
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file, { maxWidth: 600, maxHeight: 300, quality: 0.85 });
        setFormData(prev => ({
          ...prev,
          footerLogoUrl: optimized
        }));
      } catch (err) {
        console.error('Erro ao otimizar logo de rodapé:', err);
      }
    }
    e.target.value = '';
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file, { maxWidth: 128, maxHeight: 128, quality: 0.85 });
        setFormData(prev => ({
          ...prev,
          faviconUrl: optimized,
          faviconType: 'upload'
        }));
        setCustomFaviconUrl(optimized);
        updateBrowserFavicon(optimized);
      } catch (err) {
        console.error('Erro ao otimizar favicon:', err);
      }
    }
    e.target.value = '';
  };

  const handleOpenCrop = (target: 'LOGO' | 'FAVICON' | 'SIDEBAR_ICON') => {
    const src = target === 'LOGO' 
      ? (formData.logoUrl || customLogoUrl)
      : (formData.faviconUrl || customFaviconUrl || formData.logoUrl || customLogoUrl);
    
    if (!src) {
      alert('Carregue ou selecione uma imagem antes de abrir a ferramenta de recorte.');
      return;
    }
    setCropTarget(target);
    setCropSourceImage(src);
    setCropModalOpen(true);
  };

  const handleApplyCropped = (croppedDataUrl: string) => {
    if (cropTarget === 'LOGO') {
      setFormData(prev => ({
        ...prev,
        logoUrl: croppedDataUrl,
        logoType: 'upload'
      }));
      setCustomLogoUrl(croppedDataUrl);
    } else {
      setFormData(prev => ({
        ...prev,
        faviconUrl: croppedDataUrl,
        faviconType: 'upload'
      }));
      setCustomFaviconUrl(croppedDataUrl);
      updateBrowserFavicon(croppedDataUrl);
    }
  };

  const handleSelectPresetColor = (preset: typeof SYSTEM_COLOR_PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      sidebarTheme: preset.sidebarTheme
    }));
  };

  const handleSelectPresetLogo = (presetId: string) => {
    setFormData(prev => ({
      ...prev,
      logoType: 'preset',
      presetLogoId: presetId,
      logoUrl: ''
    }));
  };

  const handleResetToDefault = () => {
    setFormData({ ...DEFAULT_SYSTEM_THEME });
    setCustomLogoUrl('');
    setCustomFaviconUrl('');
    setLogoInputMode('preset');
  };

  const handleSave = async () => {
    setIsSavingCloud(true);
    const finalFavicon = formData.faviconUrl || formData.logoUrl;
    if (finalFavicon) {
      updateBrowserFavicon(finalFavicon);
    }
    try {
      await saveThemeConfigToCloud(formData);
      setSyncStatusMsg('Sincronizado na nuvem com sucesso!');
    } catch (e) {
      console.warn('Erro ao sincronizar tema na nuvem:', e);
    }
    onSaveTheme(formData);
    setIsSavingCloud(false);
    onClose();
  };

  const selectedPresetLogo = PRESET_LOGOS.find(p => p.id === formData.presetLogoId) || PRESET_LOGOS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Personalização de Marca & Identidade Visual
              </h2>
              <p className="text-xs text-slate-500">
                Altere o logotipo, o nome da imobiliária e a paleta de cores de todo o sistema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Banner */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" /> Pré-Visualização em Tempo Real (Cabeçalho & Marca)
            </span>
            <span className="text-[10px] text-slate-400">
              Cores e logo aplicados dinamicamente
            </span>
          </div>

          <div className="p-3 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Dynamic Logo Rendering */}
              {formData.logoUrl && formData.logoType !== 'preset' ? (
                <img 
                  src={formData.logoUrl} 
                  alt="Logo Preview" 
                  className="w-9 h-9 object-contain rounded-lg border border-slate-200 bg-slate-50 p-0.5 shrink-0" 
                />
              ) : (
                <div 
                  className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${selectedPresetLogo.iconBg} flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0`}
                >
                  {selectedPresetLogo.initial}
                </div>
              )}

              <div className="min-w-0">
                <div className="font-bold text-base text-slate-900 leading-tight truncate">
                  {formData.platformName || 'AcertGo'}
                  <span 
                    className="ml-1 text-sm font-semibold transition-colors"
                    style={{ color: formData.primaryColor }}
                  >
                    OS
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate">
                  {formData.tagline || 'CRM · ERP · Fintech Imobiliária'}
                </div>
              </div>
            </div>

            {/* Simulated Header Buttons with Selected Color */}
            <div className="flex items-center gap-2 shrink-0">
              <span 
                className="px-2.5 py-1 rounded-md text-[11px] font-medium border"
                style={{ 
                  backgroundColor: `${formData.primaryColor}15`, 
                  borderColor: `${formData.primaryColor}30`,
                  color: formData.primaryColor 
                }}
              >
                Aba Ativa
              </span>
              <button
                type="button"
                className="px-3 py-1 rounded-md text-xs font-semibold text-white shadow-xs"
                style={{ backgroundColor: formData.primaryColor }}
              >
                Botão de Ação
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-50/50 shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('colors')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'colors'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            1. Cores do Sistema
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'logo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            2. Logotipo & Nome
          </button>
          <button
            onClick={() => setActiveTab('sidebar')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sidebar'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3. Estilo da Barra Lateral
          </button>
        </div>

        {/* Tab Contents - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* TAB 1: CORES DO SISTEMA */}
          {activeTab === 'colors' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              {/* Presets Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Paletas Pré-Configuradas (1 Clique)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {SYSTEM_COLOR_PRESETS.map((preset) => {
                    const isSelected = 
                      formData.primaryColor.toLowerCase() === preset.primaryColor.toLowerCase() &&
                      formData.secondaryColor.toLowerCase() === preset.secondaryColor.toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPresetColor(preset)}
                        className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="font-semibold text-xs text-slate-900">{preset.name}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {/* Swatches */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span 
                            className="w-6 h-6 rounded-md shadow-2xs border border-white"
                            style={{ backgroundColor: preset.primaryColor }}
                            title={`Primária: ${preset.primaryColor}`}
                          />
                          <span 
                            className="w-6 h-6 rounded-md shadow-2xs border border-white"
                            style={{ backgroundColor: preset.secondaryColor }}
                            title={`Secundária: ${preset.secondaryColor}`}
                          />
                          <span 
                            className="w-6 h-6 rounded-md shadow-2xs border border-white"
                            style={{ backgroundColor: preset.accentColor }}
                            title={`Acento: ${preset.accentColor}`}
                          />
                        </div>

                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Hex Color Pickers */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" /> Ajuste Manual de Cores (Hexadecimal)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Cor Primária (Botões & Destaques)
                    </label>
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-300">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-full text-xs font-mono font-semibold uppercase text-slate-800 bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Cor Secundária (Gradientes & Subtítulos)
                    </label>
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-300">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-full text-xs font-mono font-semibold uppercase text-slate-800 bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Cor de Acento (Badges & Sucesso)
                    </label>
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-300">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-full text-xs font-mono font-semibold uppercase text-slate-800 bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGOTIPO & NOME */}
          {activeTab === 'logo' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              {/* Recommended Dimensions Guide Cards */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Guia Oficial de Medidas Recomendadas para Identidade Visual</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Card 1: Logo Principal */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">1. Logotipo Principal</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-700">4:1 ou 5:1</span>
                    </div>
                    <div className="text-base font-black text-blue-600">250 × 60 px</div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Fundo transparente (PNG/SVG). Cabeçalhos, relatórios e páginas de vendas.
                    </p>
                  </div>

                  {/* Card 2: Favicon da Aba */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">2. Favicon do Navegador</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700">1:1</span>
                    </div>
                    <div className="text-base font-black text-emerald-600">32 × 32 / 64 × 64 px</div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Ícone quadrado para aba do navegador, favoritos e atalho no celular.
                    </p>
                  </div>

                  {/* Card 3: Ícone da Barra Lateral */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">3. Ícone da Barra Lateral</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-700">1:1</span>
                    </div>
                    <div className="text-base font-black text-purple-600">64 × 64 px</div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Monograma ou brasão para o menu recolhido e cabeçalho mobile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Nome da Plataforma & Slogan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Plataforma / Imobiliária
                  </label>
                  <input
                    type="text"
                    value={formData.platformName}
                    onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                    placeholder="Ex: AcertGo, Prime Imóveis, Nexus Real Estate"
                    className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slogan / Subtítulo Institucional
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Ex: CRM · ERP · Fintech Imobiliária"
                    className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* SEÇÃO 1: LOGOTIPO PRINCIPAL */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Logotipo Principal do Sistema (Horizontal)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Medida recomendada: <strong>250 × 60 px</strong>
                  </span>
                </div>

                {/* Logo Source Type Selection */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLogoInputMode('preset');
                      setFormData(prev => ({ ...prev, logoType: 'preset' }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      logoInputMode === 'preset'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Ícones & Monogramas Prontos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoInputMode('upload');
                      setFormData(prev => ({ ...prev, logoType: 'upload' }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      logoInputMode === 'upload'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Fazer Upload de Imagem
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoInputMode('url');
                      setFormData(prev => ({ ...prev, logoType: 'url' }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      logoInputMode === 'url'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Inserir URL de Logo
                  </button>
                </div>

                {/* Mode: Preset Logos */}
                {logoInputMode === 'preset' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">
                      Escolha um Monograma / Símbolo Institucional
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {PRESET_LOGOS.map((preset) => {
                        const isSelected = formData.presetLogoId === preset.id && formData.logoType === 'preset';
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPresetLogo(preset.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                              isSelected
                                ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${preset.iconBg} flex items-center justify-center text-white font-bold text-lg shadow-xs`}>
                              {preset.initial}
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-semibold text-slate-900">{preset.name}</div>
                              <div className="text-[10px] text-slate-500">{preset.category}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mode: File Upload */}
                {logoInputMode === 'upload' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      className="hidden"
                    />

                    {formData.logoUrl && formData.logoType === 'upload' ? (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-14 p-1.5 bg-slate-50 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center">
                            <img 
                              src={formData.logoUrl} 
                              alt="Logo carregado" 
                              className="max-h-full max-w-full object-contain" 
                            />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-800">Logo Carregado no Sistema</p>
                            <span className="text-[11px] text-emerald-600 font-semibold">Pronto para uso</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenCrop('LOGO')}
                            className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                            title="Recortar e ajustar enquadramento do logo"
                          >
                            <Crop className="w-3.5 h-3.5" /> Recortar / Ajustar
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Trocar Imagem
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, logoUrl: '', logoType: 'preset' }))}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-400 p-6 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Clique aqui para enviar o arquivo de logotipo
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Formatos recomendados: PNG transparente, SVG ou JPG (Sem limite de tamanho - otimização automática)
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode: URL input */}
                {logoInputMode === 'url' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      URL Direta da Imagem do Logotipo
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customLogoUrl}
                        onChange={(e) => {
                          setCustomLogoUrl(e.target.value);
                          setFormData(prev => ({ ...prev, logoUrl: e.target.value, logoType: 'url' }));
                        }}
                        placeholder="https://exemplo.com/logo-imobiliaria.png"
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                      />
                    </div>
                    {customLogoUrl && (
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <img 
                            src={customLogoUrl} 
                            alt="Preview" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Erro';
                            }}
                            className="w-10 h-10 object-contain rounded border border-slate-200"
                          />
                          <span className="text-xs text-slate-600">Prévia do endereço informado</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenCrop('LOGO')}
                          className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Crop className="w-3.5 h-3.5" /> Recortar Imagem
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SEÇÃO 2: FAVICON DO NAVEGADOR (NOVO) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Favicon do Sistema (Ícone da Aba do Navegador)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Medida recomendada: <strong>32 × 32 px</strong> ou <strong>64 × 64 px</strong> (1:1)
                  </span>
                </div>

                {/* Favicon Mode Selection */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFaviconInputMode('same_as_logo');
                      setFormData(prev => ({ ...prev, faviconUrl: undefined, faviconType: 'preset' }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      faviconInputMode === 'same_as_logo'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Automático (Baseado no Logotipo)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFaviconInputMode('upload');
                      setFormData(prev => ({ ...prev, faviconType: 'upload' }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      faviconInputMode === 'upload'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Próprio de Favicon
                  </button>
                </div>

                {/* Favicon Upload Mode */}
                {faviconInputMode === 'upload' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <input
                      type="file"
                      ref={faviconFileInputRef}
                      onChange={handleFaviconUpload}
                      accept="image/png, image/x-icon, image/svg+xml, image/webp"
                      className="hidden"
                    />

                    {formData.faviconUrl ? (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 p-1.5 bg-slate-100 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
                            <img 
                              src={formData.faviconUrl} 
                              alt="Favicon" 
                              className="w-8 h-8 object-contain" 
                            />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-800">Favicon Personalizado Ativo</p>
                            <span className="text-[11px] text-emerald-600 font-semibold">Exibido na aba do navegador</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenCrop('FAVICON')}
                            className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                            title="Recortar favicon em proporção 1:1"
                          >
                            <Crop className="w-3.5 h-3.5" /> Recortar (1:1)
                          </button>
                          <button
                            type="button"
                            onClick={() => faviconFileInputRef.current?.click()}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          >
                            Trocar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, faviconUrl: undefined, faviconType: 'preset' }));
                              setCustomFaviconUrl('');
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => faviconFileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-400 p-5 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Clique aqui para enviar o arquivo de Favicon (.png, .ico, .svg)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Recomendado: 32 × 32 ou 64 × 64 pixels (Proporção quadrada 1:1)
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Live Browser Tab Mockup Preview */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Prévia ao Vivo na Aba do Navegador
                  </span>
                  <div className="bg-slate-200/80 p-2 rounded-xl flex items-center gap-2">
                    <div className="bg-white rounded-t-lg px-3 py-1.5 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 border-t border-x border-slate-300/80 max-w-xs">
                      {formData.faviconUrl ? (
                        <img 
                          src={formData.faviconUrl} 
                          alt="Favicon" 
                          className="w-4 h-4 object-contain rounded-xs" 
                        />
                      ) : formData.logoUrl ? (
                        <img 
                          src={formData.logoUrl} 
                          alt="Favicon derivado" 
                          className="w-4 h-4 object-contain rounded-xs" 
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-xs bg-blue-600 flex items-center justify-center text-white font-black text-[9px]">
                          {formData.platformName?.[0] || 'A'}
                        </div>
                      )}
                      <span className="truncate">{formData.platformName || 'AcertGo'} · CRM Imobiliário</span>
                      <span className="text-slate-400 text-[10px] ml-1">✕</span>
                    </div>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      Simulação exata de como os corretores e clientes verão na barra do navegador.
                    </span>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: LOGOTIPO DA TELA DE LOGIN */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Logotipo Exclusivo da Tela de Login (Desktop & Celular)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Sincronizado na nuvem para todos os dispositivos
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Por padrão, a tela de login usa o mesmo Logotipo Principal. Se você deseja exibir uma versão alternativa (ex: fundo escuro, brasão ou logotipo vertical), envie aqui.
                </p>

                <input
                  type="file"
                  ref={loginLogoFileInputRef}
                  onChange={handleLoginLogoUpload}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                />

                {formData.loginLogoUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-slate-900 text-white rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-12 p-1.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-center">
                        <img 
                          src={formData.loginLogoUrl} 
                          alt="Logo Login" 
                          className="max-h-full max-w-full object-contain" 
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Logo Customizado de Login Ativo</p>
                        <span className="text-[11px] text-amber-400 font-semibold">Aparece na tela de login móvel e desktop</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => loginLogoFileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                      >
                        Trocar
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, loginLogoUrl: '' }))}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-950/60 rounded-lg transition-colors flex items-center gap-1 border border-rose-900/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Usar Padrão
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        {formData.platformName?.[0] || 'A'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Usando o Logotipo Principal na Tela de Login
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Mesmo logotipo do cabeçalho é exibido no desktop e celular
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => loginLogoFileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1.5 border border-amber-200"
                    >
                      <Upload className="w-3.5 h-3.5" /> Enviar Logo Específico
                    </button>
                  </div>
                )}
              </div>

              {/* SEÇÃO 4: LOGOTIPO DE RODAPÉ & RELATÓRIOS OFICIAIS */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Logotipo de Rodapé & Documentos Oficiais
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Para minutas, rodapés de sites e relatórios impressos
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Personalize o logotipo exibido no rodapé do portal imobiliário, minutas de contratos e propostas comerciais geradas em PDF.
                </p>

                <input
                  type="file"
                  ref={footerLogoFileInputRef}
                  onChange={handleFooterLogoUpload}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                />

                {formData.footerLogoUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-12 p-1.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
                        <img 
                          src={formData.footerLogoUrl} 
                          alt="Logo Rodapé" 
                          className="max-h-full max-w-full object-contain" 
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">Logo de Rodapé Ativo</p>
                        <span className="text-[11px] text-purple-600 font-semibold">Exibido em rodapés e contratos</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => footerLogoFileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                      >
                        Trocar
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, footerLogoUrl: '' }))}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        {formData.platformName?.[0] || 'A'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Nenhum Logo de Rodapé Específico
                        </div>
                        <div className="text-[11px] text-slate-500">
                          O sistema utilizará o Logotipo Principal como alternativa nos rodapés
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => footerLogoFileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1.5 border border-purple-200"
                    >
                      <Upload className="w-3.5 h-3.5" /> Enviar Logo de Rodapé
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ESTILO DA BARRA LATERAL */}
          {activeTab === 'sidebar' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Tema de Contraste da Barra Lateral (Sidebar)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'dark' as SidebarThemeVariant,
                    name: 'Obsidian Slate (Escuro Padrão)',
                    desc: 'Fundo escuro profundo, ícones com alto contraste e elegância',
                    bg: 'bg-slate-900 text-white border-slate-800'
                  },
                  {
                    id: 'navy' as SidebarThemeVariant,
                    name: 'Midnight Navy (Azul Profundo)',
                    desc: 'Tons azulados institucionais de alta fidelidade executiva',
                    bg: 'bg-slate-950 text-sky-100 border-indigo-900'
                  },
                  {
                    id: 'emerald' as SidebarThemeVariant,
                    name: 'Emerald Forest (Verde Nobre)',
                    desc: 'Tons floresta escuro que combinam com alto padrão e ecossistemas',
                    bg: 'bg-emerald-950 text-emerald-100 border-emerald-900'
                  },
                  {
                    id: 'light' as SidebarThemeVariant,
                    name: 'Clean Slate (Claro & Minimalista)',
                    desc: 'Barra lateral clara em cinza suave com tipografia nítida',
                    bg: 'bg-white text-slate-800 border-slate-200'
                  }
                ].map((sidebarOption) => {
                  const isSelected = formData.sidebarTheme === sidebarOption.id;
                  return (
                    <button
                      key={sidebarOption.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sidebarTheme: sidebarOption.id }))}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${sidebarOption.bg} flex items-center justify-center shrink-0 shadow-xs`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{sidebarOption.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{sidebarOption.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrão
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSavingCloud}
              className="px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-opacity hover:opacity-95 flex items-center gap-1.5 disabled:opacity-60"
              style={{ backgroundColor: formData.primaryColor }}
            >
              {isSavingCloud ? (
                <>
                  <Cloud className="w-4 h-4 animate-spin" />
                  Sincronizando na Nuvem...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Salvar e Sincronizar na Nuvem
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Image Crop & Alignment Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageUrl={cropSourceImage}
        targetType={cropTarget}
        onApplyCrop={handleApplyCropped}
      />
    </div>
  );
};

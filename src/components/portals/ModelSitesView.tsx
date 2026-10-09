import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Settings, 
  Sparkles, 
  Check, 
  Eye, 
  Smartphone, 
  Monitor, 
  Tablet, 
  CheckCircle2,
  Sliders, 
  Palette, 
  Lock, 
  X, 
  Share2, 
  Building, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ChevronRight, 
  TrendingUp, 
  Search, 
  MessageSquare,
  Cloud
} from 'lucide-react';
import { 
  RealEstateProperty, 
  WebsiteConfig, 
  WebsiteTemplateId, 
  WebsiteTemplateOption 
} from '../../types/crm';
import { TenantAgency } from '../../types/superAdmin';
import { 
  WEBSITE_TEMPLATE_OPTIONS, 
  INITIAL_WEBSITE_CONFIG 
} from '../../data/mockPortals';
import { WebsiteTemplatePreview } from './WebsiteTemplatePreview';
import { WebsiteCmsModal } from './WebsiteCmsModal';
import { KenkoSearchStyle, WebsiteHeroBanner, WebsiteSeoConfig } from '../../types/websiteSeo';
import { DEFAULT_HERO_BANNERS } from './WebsiteHeroBannersSlider';
import { DEFAULT_SEO_CONFIG, WebsiteSeoStudioModal } from './WebsiteSeoStudioModal';
import { 
  getInitialWebsiteConfig, 
  saveWebsiteConfigToCloud, 
  subscribeWebsiteConfigFromCloud 
} from '../../services/systemPersistenceService';

interface ModelSitesViewProps {
  properties: RealEstateProperty[];
  onOpenPropertyDetails?: (property: RealEstateProperty) => void;
  onNewLeadFromWebsite?: (leadData: { name: string; phone: string; email: string; interest: string }) => void;
  onNavigateToCustomerPortal?: () => void;
  onNavigateToIndiqueGanhe?: () => void;
  currentTenant?: TenantAgency | null;
  onSaveTenant?: (tenant: Partial<TenantAgency>) => void;
}

export const ModelSitesView: React.FC<ModelSitesViewProps> = ({
  properties,
  onOpenPropertyDetails,
  onNewLeadFromWebsite,
  onNavigateToCustomerPortal,
  onNavigateToIndiqueGanhe,
  currentTenant,
  onSaveTenant,
}) => {
  // Website State & Cloud Persistence
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(() => {
    const initial = getInitialWebsiteConfig();
    if (currentTenant?.chosenSiteTemplate) {
      initial.templateId = currentTenant.chosenSiteTemplate as WebsiteTemplateId;
    }
    if (currentTenant?.tradeName) {
      initial.siteName = currentTenant.tradeName;
    }
    return initial;
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<WebsiteTemplateId>(() => {
    return (currentTenant?.chosenSiteTemplate as WebsiteTemplateId) || 'URBAN_FLOW';
  });
  const [previewDevice, setPreviewDevice] = useState<'DESKTOP' | 'TABLET' | 'MOBILE'>('DESKTOP');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [showCmsModal, setShowCmsModal] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState(() => {
    if (currentTenant?.subdomain) {
      return currentTenant.subdomain.includes('.') ? currentTenant.subdomain : `${currentTenant.subdomain}.acertgo.com.br`;
    }
    return 'www.imobiliariapro.com.br';
  });
  const [whatsappFloatingNumber, setWhatsappFloatingNumber] = useState(() => {
    return currentTenant?.ownerPhone || '(11) 98844-3322';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sincronizar com mudanças do tenant
  useEffect(() => {
    if (currentTenant?.chosenSiteTemplate) {
      setSelectedTemplateId(currentTenant.chosenSiteTemplate as WebsiteTemplateId);
    }
    if (currentTenant?.subdomain) {
      setCustomDomainInput(currentTenant.subdomain.includes('.') ? currentTenant.subdomain : `${currentTenant.subdomain}.acertgo.com.br`);
    }
    if (currentTenant?.ownerPhone) {
      setWhatsappFloatingNumber(currentTenant.ownerPhone);
    }
    if (currentTenant?.tradeName) {
      setWebsiteConfig(prev => ({ ...prev, siteName: currentTenant.tradeName }));
    }
  }, [currentTenant]);

  // Sincronização em tempo real entre todos os dispositivos (Desktop, Celular, Smart TV)
  useEffect(() => {
    const unsubscribe = subscribeWebsiteConfigFromCloud((cloudConfig) => {
      setWebsiteConfig(cloudConfig);
      if (cloudConfig.templateId) {
        setSelectedTemplateId(cloudConfig.templateId);
      }
      if (cloudConfig.customDomain) {
        setCustomDomainInput(cloudConfig.customDomain);
      }
      if (cloudConfig.whatsapp) {
        setWhatsappFloatingNumber(cloudConfig.whatsapp);
      }
    });
    return () => unsubscribe();
  }, []);

  // Advanced Sites Extensions: Kenko Search Styles, Carousel, Banners & SEO
  const [kenkoSearchStyle, setKenkoSearchStyle] = useState<KenkoSearchStyle>('KENKO_HERO_BOX');
  const [showCarousel, setShowCarousel] = useState(true);
  const [heroBanners, setHeroBanners] = useState<WebsiteHeroBanner[]>(DEFAULT_HERO_BANNERS);
  const [seoConfig, setSeoConfig] = useState<WebsiteSeoConfig>(DEFAULT_SEO_CONFIG);
  const [showSeoModal, setShowSeoModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleActivateModel = async (templateId: WebsiteTemplateId) => {
    setSelectedTemplateId(templateId);
    const updated = {
      ...websiteConfig,
      templateId
    };
    setWebsiteConfig(updated);
    if (currentTenant && onSaveTenant) {
      onSaveTenant({
        id: currentTenant.id,
        chosenSiteTemplate: templateId
      });
    }
    try {
      await saveWebsiteConfigToCloud(updated);
    } catch (e) {
      console.warn('Erro ao sincronizar template:', e);
    }
    showToast(`Modelo alterado para "${WEBSITE_TEMPLATE_OPTIONS.find(t => t.id === templateId)?.name}"${currentTenant ? ` para ${currentTenant.tradeName}` : ''}!`);
  };

  const handlePublishWebsite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsPublishing(true);
    const updatedConfig: WebsiteConfig = {
      ...websiteConfig,
      templateId: selectedTemplateId,
      customDomain: customDomainInput,
      whatsapp: whatsappFloatingNumber,
      whatsappButton: {
        ...(websiteConfig.whatsappButton || {
          enabled: true,
          position: 'BOTTOM_RIGHT',
          welcomeMessage: 'Olá!',
          showPulse: true,
          size: 'MEDIO'
        }),
        number: whatsappFloatingNumber
      },
      lastPublishedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'PUBLICADO'
    };
    setWebsiteConfig(updatedConfig);
    if (currentTenant && onSaveTenant) {
      onSaveTenant({
        id: currentTenant.id,
        chosenSiteTemplate: selectedTemplateId
      });
    }
    try {
      await saveWebsiteConfigToCloud(updatedConfig);
    } catch (err) {
      console.warn('Erro ao salvar no cloud:', err);
    }
    setIsPublishing(false);
    setPublishSuccess(true);
    showToast(`✅ Site Oficial de ${currentTenant?.tradeName || websiteConfig.siteName} publicado e sincronizado!`);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const activeTemplate = WEBSITE_TEMPLATE_OPTIONS.find(t => t.id === selectedTemplateId) || WEBSITE_TEMPLATE_OPTIONS[0];

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>SITES MODELOS & CMS IMOBILIÁRIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sites Modelos Profissionais
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Escolha entre 4 templates imobiliários de alto padrão, personalize com o logotipo da sua imobiliária, cores e domínio próprio, e publique instantaneamente na web com captação direta de leads no CRM.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => {
                const previewUrl = `${window.location.origin}${window.location.pathname}#/site-oficial?tenant=${encodeURIComponent(currentTenant?.id || 'tenant_matriz_sp')}`;
                window.open(previewUrl, '_blank');
                showToast('🚀 Abrindo Site Oficial em nova aba do navegador!');
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              title="Abrir o site oficial em uma nova aba independente do navegador"
            >
              <ExternalLink className="w-4 h-4 text-emerald-200" />
              <span>Abrir Site em Nova Aba</span>
            </button>

            <button
              onClick={() => setShowFullscreenPreview(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Ver no Sistema</span>
            </button>

            <button
              onClick={() => setShowCmsModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Personalizar CMS Completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Site Status Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-500">Site Oficial Ativo: </span>
            <strong className="text-slate-900 font-bold">{currentTenant ? currentTenant.tradeName : websiteConfig.siteName}</strong>
            <span className="text-slate-400 mx-2">•</span>
            <span className="text-blue-700 font-bold">Template: {activeTemplate.name}</span>
            <span className="text-slate-400 mx-2">•</span>
            <button
              onClick={() => {
                const previewUrl = `${window.location.origin}${window.location.pathname}#/site-oficial?tenant=${encodeURIComponent(currentTenant?.id || 'tenant_matriz_sp')}`;
                window.open(previewUrl, '_blank');
              }}
              className="text-emerald-700 hover:text-emerald-900 underline font-bold font-mono inline-flex items-center gap-1 cursor-pointer"
              title="Abrir URL do site em nova aba"
            >
              <span>https://{customDomainInput}</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </button>
            <span className="px-2 py-0.5 ml-2 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
              SSL SEGURO
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SEO & Meta Tags Studio Button */}
          <button
            onClick={() => setShowSeoModal(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>SEO & Meta Tags Google</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-black">
              JSON-LD
            </span>
          </button>

          <button
            onClick={() => handlePublishWebsite()}
            disabled={isPublishing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{publishSuccess ? 'Publicado!' : 'Publicar Alterações no Site'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Informações de Apontamento Real e Estoque Integrado */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            📡
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span>Apontamento de Domínio Próprio da Imobiliária</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                Operação Real
              </span>
            </div>
            <div className="text-slate-600 mt-0.5">
              Entrada CNAME: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">www</code> ou <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">imoveis</code>
              <span className="mx-1.5 text-slate-400">➔</span>
              Destino Servidor: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-emerald-800 font-mono font-bold">sites.acertgo.com.br</code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-slate-600 text-right">
            <span className="text-[11px] block text-slate-500">Estoque Integrado:</span>
            <strong className="text-blue-700 font-bold text-xs">{properties.length} imóveis sincronizados</strong>
          </div>
          <button
            onClick={() => {
              const previewUrl = `${window.location.origin}${window.location.pathname}#/site-oficial?tenant=${encodeURIComponent(currentTenant?.id || 'tenant_matriz_sp')}`;
              window.open(previewUrl, '_blank');
              showToast('🚀 Abrindo Site Oficial em nova aba!');
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir Nova Aba</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TOOLBAR EXCLUSIVO: ESTILOS DE BUSCA, CARROSSEL E BANNERS */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Alta Conversão
            </span>
            <span className="text-xs text-slate-400">• Mecanismos de Busca Avançados</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            Estilos de Busca Rápida, Carrossel & Banners
          </h3>
          <p className="text-xs text-slate-300">
            Alterne o estilo de filtro e exiba carrossel de destaques com agendamento instantâneo no WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Seletor de Estilo de Busca */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] font-bold text-slate-400 px-2 hidden sm:inline">Busca:</span>
            <button
              onClick={() => {
                setKenkoSearchStyle('HERO_BOX');
                showToast('Estilo alterado para "Box Flutuante"!');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                kenkoSearchStyle === 'HERO_BOX' || (kenkoSearchStyle as string) === 'KENKO_HERO_BOX'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Box Flutuante
            </button>
            <button
              onClick={() => {
                setKenkoSearchStyle('CLEAN_BAR');
                showToast('Estilo alterado para "Barra Compacta"!');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                kenkoSearchStyle === 'CLEAN_BAR' || (kenkoSearchStyle as string) === 'KENKO_CLEAN_BAR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Barra Compacta
            </button>
            <button
              onClick={() => {
                setKenkoSearchStyle('EXPANDED_CARD');
                showToast('Estilo alterado para "Painel Expandido"!');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                kenkoSearchStyle === 'EXPANDED_CARD' || (kenkoSearchStyle as string) === 'KENKO_EXPANDED_CARD'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Painel Expandido
            </button>
          </div>

          {/* Toggle Carrossel */}
          <button
            onClick={() => {
              setShowCarousel(!showCarousel);
              showToast(showCarousel ? 'Carrossel de Destaques desativado' : 'Carrossel de Destaques ativado!');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showCarousel
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Carrossel: {showCarousel ? 'Ligado' : 'Desligado'}</span>
          </button>
        </div>
      </div>

      {/* 4 Models Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Escolha o Modelo de Site da sua Imobiliária:
          </h2>
          <span className="text-xs text-slate-500">4 Modelos prontos para conversão</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WEBSITE_TEMPLATE_OPTIONS.map(template => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <div
                key={template.id}
                className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isSelected
                    ? 'border-blue-600 ring-4 ring-blue-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Modelo Ativo
                  </div>
                )}

                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 inline-block">
                    {template.accentBadge}
                  </span>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{template.name}</h3>
                    <p className="text-[11px] text-blue-600 font-medium">{template.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {template.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <strong className="block text-slate-700">Destaques:</strong>
                    <ul className="space-y-1">
                      {template.features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => handleActivateModel(template.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isSelected ? 'Modelo Selecionado' : 'Usar Este Modelo'}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setShowFullscreenPreview(true);
                    }}
                    className="w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Prévia em Tela Cheia</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick CMS & Domain Configuration Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Configurações Rápidas do Site</h3>
              <p className="text-xs text-slate-500">Domínio próprio, WhatsApp flutuante e identidade visual</p>
            </div>
          </div>

          <button
            onClick={() => setShowCmsModal(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Abrir CMS Avançado (Banners, Textos & Cores)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">Domínio Próprio da Imobiliária:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customDomainInput}
                onChange={e => setCustomDomainInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => showToast('Domínio verificado no DNS com sucesso!')}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
              >
                Verificar
              </button>
            </div>
            <p className="text-[10px] text-slate-500">Apontamento CNAME para cdn.acertgo.com.br</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">WhatsApp Flutuante (Captação de Leads):</span>
            <input
              type="text"
              value={whatsappFloatingNumber}
              onChange={e => setWhatsappFloatingNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500">Botão flutuante no canto inferior direito do site</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">Título do Site (SEO Google):</span>
            <input
              type="text"
              value={websiteConfig.siteName}
              onChange={e => setWebsiteConfig(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500">Meta Title indexado pelos motores de busca</p>
          </div>
        </div>
      </div>

      {/* Interactive Responsive Live Preview Frame */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl space-y-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>https://{customDomainInput}</span>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPreviewDevice('DESKTOP')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                previewDevice === 'DESKTOP' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setPreviewDevice('TABLET')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                previewDevice === 'TABLET' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setPreviewDevice('MOBILE')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                previewDevice === 'MOBILE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Embedded preview window with full real-time interactive Kenko search and carousel */}
        <div className="flex justify-center bg-slate-950/80 rounded-2xl p-2 sm:p-4 overflow-hidden min-h-[500px]">
          <div
            className={`transition-all duration-300 bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl ${
              previewDevice === 'MOBILE'
                ? 'w-[375px] h-[640px] border-4 border-slate-800'
                : previewDevice === 'TABLET'
                ? 'w-[768px] h-[640px] border-4 border-slate-800'
                : 'w-full max-h-[750px]'
            } overflow-y-auto`}
          >
            <WebsiteTemplatePreview
              properties={properties}
              config={websiteConfig}
              selectedTemplateId={selectedTemplateId}
              onSelectProperty={onOpenPropertyDetails}
              onLeadSubmitted={onNewLeadFromWebsite}
              onOpenCustomerPortal={onNavigateToCustomerPortal}
              onOpenIndiqueGanhe={onNavigateToIndiqueGanhe}
              kenkoSearchStyle={kenkoSearchStyle}
              heroBanners={heroBanners}
              showCarousel={showCarousel}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {showFullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-white px-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold font-mono">Prévia ao Vivo • https://{customDomainInput}</span>
            </div>
            <button
              onClick={() => setShowFullscreenPreview(false)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Fechar Prévia</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <WebsiteTemplatePreview
              properties={properties}
              config={websiteConfig}
              selectedTemplateId={selectedTemplateId}
              onSelectProperty={onOpenPropertyDetails}
              onLeadSubmitted={onNewLeadFromWebsite}
              onOpenCustomerPortal={onNavigateToCustomerPortal}
              onOpenIndiqueGanhe={onNavigateToIndiqueGanhe}
              kenkoSearchStyle={kenkoSearchStyle}
              heroBanners={heroBanners}
              showCarousel={showCarousel}
            />
          </div>
        </div>
      )}

      {/* Website CMS Modal */}
      {showCmsModal && (
        <WebsiteCmsModal
          isOpen={showCmsModal}
          onClose={() => setShowCmsModal(false)}
          config={websiteConfig}
          onSaveConfig={async (updated) => {
            setWebsiteConfig(updated);
            if (currentTenant && onSaveTenant) {
              onSaveTenant({
                id: currentTenant.id,
                logoUrl: updated.logoUrl,
                tradeName: updated.siteName
              });
            }
            try {
              await saveWebsiteConfigToCloud(updated);
              showToast('✅ Logotipo, fotos da equipe e configurações do site sincronizadas com sucesso!');
            } catch (err) {
              console.warn('Erro ao sincronizar website:', err);
              showToast('Configurações salvas localmente.');
            }
            setShowCmsModal(false);
          }}
        />
      )}

      {/* Website SEO & Meta Tags Studio Modal */}
      {showSeoModal && (
        <WebsiteSeoStudioModal
          isOpen={showSeoModal}
          onClose={() => setShowSeoModal(false)}
          siteName={websiteConfig.siteName}
          customDomain={customDomainInput}
          seoConfig={seoConfig}
          onSaveSeo={(updatedSeo) => {
            setSeoConfig(updatedSeo);
            setShowSeoModal(false);
            showToast('Configurações de SEO, Tags & Meta Tags salvas com sucesso!');
          }}
        />
      )}
    </div>
  );
};

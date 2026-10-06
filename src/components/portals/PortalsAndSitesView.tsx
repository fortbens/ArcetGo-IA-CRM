import React, { useState } from 'react';
import { 
  Globe, 
  Share2, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  Settings, 
  Layers, 
  Sparkles, 
  Check, 
  Eye, 
  Smartphone, 
  Monitor, 
  Sliders, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Building2,
  ChevronRight,
  Palette,
  Lock,
  X
} from 'lucide-react';
import { 
  PortalIntegration, 
  RealEstateProperty, 
  WebsiteConfig, 
  WebsiteTemplateId,
  WebsiteTemplateOption
} from '../../types/crm';
import { 
  INITIAL_PORTALS, 
  WEBSITE_TEMPLATE_OPTIONS, 
  INITIAL_WEBSITE_CONFIG 
} from '../../data/mockPortals';
import { XmlFeedViewerModal } from './XmlFeedViewerModal';
import { WebsiteTemplatePreview } from './WebsiteTemplatePreview';
import { WebsiteCmsModal } from './WebsiteCmsModal';

interface PortalsAndSitesViewProps {
  properties: RealEstateProperty[];
  onOpenPropertyDetails?: (property: RealEstateProperty) => void;
  onNewLeadFromWebsite?: (leadData: { name: string; phone: string; email: string; interest: string }) => void;
  onNavigateToCustomerPortal?: () => void;
  onNavigateToIndiqueGanhe?: () => void;
}

export const PortalsAndSitesView: React.FC<PortalsAndSitesViewProps> = ({
  properties,
  onOpenPropertyDetails,
  onNewLeadFromWebsite,
  onNavigateToCustomerPortal,
  onNavigateToIndiqueGanhe,
}) => {
  const [activeTab, setActiveTab] = useState<'portals' | 'sites'>('sites');

  // Portals state
  const [portals, setPortals] = useState<PortalIntegration[]>(INITIAL_PORTALS);
  const [selectedXmlPortal, setSelectedXmlPortal] = useState<PortalIntegration | null>(null);
  const [syncingPortalId, setSyncingPortalId] = useState<string | null>(null);
  const [copiedFeedId, setCopiedFeedId] = useState<string | null>(null);

  // XML Export Rules
  const [ruleOnlyWithPhotos, setRuleOnlyWithPhotos] = useState(true);
  const [ruleHideExactAddress, setRuleHideExactAddress] = useState(true);
  const [ruleOnlyAvailable, setRuleOnlyAvailable] = useState(true);

  // Website State & 4 Options
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(INITIAL_WEBSITE_CONFIG);
  const [selectedTemplateId, setSelectedTemplateId] = useState<WebsiteTemplateId>('URBAN_FLOW');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [showCmsModal, setShowCmsModal] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);

  // Quick Portal Toggle
  const handleTogglePortal = (portalId: string) => {
    setPortals(prev => prev.map(p => {
      if (p.id === portalId) {
        const nextActive = !p.active;
        return {
          ...p,
          active: nextActive,
          status: nextActive ? 'ONLINE' : 'PAUSED'
        };
      }
      return p;
    }));
  };

  // Force Portal Sync
  const handleSyncPortal = (portalId: string) => {
    setSyncingPortalId(portalId);
    setTimeout(() => {
      setPortals(prev => prev.map(p => {
        if (p.id === portalId) {
          return {
            ...p,
            lastSyncAt: 'Agora mesmo (Sucesso)',
            status: 'ONLINE'
          };
        }
        return p;
      }));
      setSyncingPortalId(null);
    }, 1200);
  };

  // Copy feed URL
  const handleCopyFeedUrl = (portal: PortalIntegration) => {
    navigator.clipboard.writeText(portal.feedUrl);
    setCopiedFeedId(portal.id);
    setTimeout(() => setCopiedFeedId(null), 2000);
  };

  // Save Website Config
  const handleSaveWebsiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      setWebsiteConfig(prev => ({
        ...prev,
        templateId: selectedTemplateId,
        lastPublishedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'PUBLICADO'
      }));
      setTimeout(() => setPublishSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Portais XML & Sites Imobiliários
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              Hub de Divulgação
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exporte seus imóveis automaticamente para os grandes portais e escolha entre 4 opções de sites oficiais para sua imobiliária
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'sites' && (
            <>
              <button
                type="button"
                onClick={() => setShowFullscreenPreview(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-xs transition-all hover:shadow-md"
              >
                <Eye className="w-4 h-4 text-emerald-100" />
                <span>Pré-visualizar Site Oficial</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCmsModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all hover:shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>CMS Completo do Site</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>{showConfigDrawer ? 'Ocultar Ajustes' : 'Ajustes Rápidos'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setSelectedXmlPortal(portals[0])}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-2xs"
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            <span>Feed XML Universal</span>
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-3">
        <button
          onClick={() => setActiveTab('sites')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'sites'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Sites da Imobiliária (4 Opções de Modelos)</span>
          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px]">
            Novo
          </span>
        </button>

        <button
          onClick={() => setActiveTab('portals')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'portals'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Integrações com Portais & Feeds XML</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
            5 Portais
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: SITES DA IMOBILIÁRIA (4 OPÇÕES PARA OS CLIENTES) */}
      {/* ========================================================================= */}
      {activeTab === 'sites' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Header das 4 opções */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Escolha o Modelo de Site Oficial da sua Imobiliária
            </h2>
            <p className="text-xs text-slate-500">
              Todos os modelos vêm integrados em tempo real com seu catálogo de imóveis, WhatsApp flutuante e formulários que enviam leads direto para o CRM
            </p>
          </div>

          {/* Cards das 4 Opções de Sites */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WEBSITE_TEMPLATE_OPTIONS.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;

              // Color accents per template
              const accentColor = 
                tmpl.id === 'URBAN_FLOW' ? 'from-blue-600 to-indigo-600' :
                tmpl.id === 'EXCLUSIVE_HIGH_END' ? 'from-amber-500 to-orange-600' :
                tmpl.id === 'FAST_RENT' ? 'from-teal-500 to-emerald-600' : 'from-purple-600 to-indigo-600';

              return (
                <div
                  key={tmpl.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col justify-between relative group overflow-hidden ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-sm'
                  }`}
                >
                  {/* Top Color Accent Strip */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${accentColor}`} />

                  <div className="space-y-3 pt-1">
                    <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                      <img
                        src={tmpl.previewThumbnail}
                        alt={tmpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-xs bg-gradient-to-r ${accentColor}`}>
                        {tmpl.accentBadge}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {tmpl.name}
                      </h3>
                      <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                        {tmpl.tagline}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Diferenciais do Modelo:
                      </span>
                      {tmpl.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Preview & Activate */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setShowFullscreenPreview(true);
                      }}
                      className="flex-1 py-2 px-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      title="Abrir pré-visualização interativa em tela cheia"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Pré-visualizar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Ativo ✓' : 'Ativar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Configurator Drawer / Accordion */}
          {showConfigDrawer && (
            <form 
              onSubmit={handleSaveWebsiteConfig}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Personalização do Site ({websiteConfig.siteName})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Status: <strong className="text-emerald-600">{websiteConfig.status}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Imobiliária no Site
                  </label>
                  <input
                    type="text"
                    value={websiteConfig.siteName}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, siteName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CRECI Jurídico Oficial
                  </label>
                  <input
                    type="text"
                    value={websiteConfig.creci}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, creci: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp para Recebimento de Leads
                  </label>
                  <input
                    type="text"
                    value={websiteConfig.whatsapp}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slogan / Chamada Principal do Site
                  </label>
                  <input
                    type="text"
                    value={websiteConfig.slogan}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, slogan: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Domínio Próprio CNAME
                  </label>
                  <input
                    type="text"
                    value={websiteConfig.customDomain}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, customDomain: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={websiteConfig.showFinancingSimulator}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, showFinancingSimulator: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Simulador de Financiamento</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={websiteConfig.showOwnerCaptureBanner}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, showOwnerCaptureBanner: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Banner "Anuncie seu Imóvel"</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={websiteConfig.showVirtualTourBadge}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, showVirtualTourBadge: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Selo de Tour Virtual 360°</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConfigDrawer(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isPublishing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : publishSuccess ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  <span>{isPublishing ? 'Publicando...' : publishSuccess ? 'Publicado com Sucesso!' : 'Salvar & Publicar'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Interactive Live Preview Component with Browser Chrome Frame */}
          <div className="pt-2">
            <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-700 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-xl text-[11px] font-mono text-slate-300 border border-slate-700">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>https://{websiteConfig.customDomain || 'imobiliaria.acertgo.com.br'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Modelo Ativo: <strong className="text-white">{WEBSITE_TEMPLATE_OPTIONS.find(t => t.id === selectedTemplateId)?.name}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFullscreenPreview(true)}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Tela Cheia</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-inner">
                <WebsiteTemplatePreview
                  properties={properties}
                  config={websiteConfig}
                  selectedTemplateId={selectedTemplateId}
                  onSelectProperty={onOpenPropertyDetails}
                  onLeadSubmitted={onNewLeadFromWebsite}
                  onOpenCustomerPortal={onNavigateToCustomerPortal}
                  onOpenIndiqueGanhe={onNavigateToIndiqueGanhe}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: INTEGRAÇÕES COM PORTAIS & FEEDS XML */}
      {/* ========================================================================= */}
      {activeTab === 'portals' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Portais Conectados
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {portals.filter(p => p.active).length} / {portals.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                Feeds sincronizados automaticamente
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Imóveis no Feed XML
              </span>
              <div className="text-xl font-bold text-blue-600 mt-1">
                {properties.length} Ativos
              </div>
              <span className="text-[10px] text-slate-500">
                100% com geolocalização e fotos
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Destaques Utilizados
              </span>
              <div className="text-xl font-bold text-amber-600 mt-1">
                16 / 20 Contratados
              </div>
              <span className="text-[10px] text-slate-500">
                4 vagas de Super Destaque livres
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Leads de Portais este Mês
              </span>
              <div className="text-xl font-bold text-emerald-600 mt-1">
                128 Leads
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                Entrando direto na Fila do CRM
              </span>
            </div>
          </div>

          {/* Cards dos Portais */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Canais de Publicação em Portais
                </h3>
                <p className="text-xs text-slate-500">
                  Gerencie as cotas e links de feed XML de cada portal parceiro
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portals.map((portal) => {
                const isSyncing = syncingPortalId === portal.id;
                const isCopied = copiedFeedId === portal.id;

                return (
                  <div
                    key={portal.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={portal.logo}
                          alt={portal.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {portal.name}
                            </h4>
                            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              portal.status === 'ONLINE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {portal.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Última carga: {portal.lastSyncAt}
                          </p>
                        </div>
                      </div>

                      {/* On/Off Switch */}
                      <button
                        onClick={() => handleTogglePortal(portal.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                          portal.active ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                            portal.active ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Progress Bar of quota */}
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Cota de Anúncios Usada:</span>
                        <strong className="text-slate-900 font-mono">
                          {portal.totalPublished} / {portal.maxProperties}
                        </strong>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(portal.totalPublished / portal.maxProperties) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>Destaques: <strong>{portal.highlightCount}/{portal.maxHighlights}</strong></span>
                        <span>Frequência: <strong>a cada {portal.syncFrequencyHours}h</strong></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        onClick={() => setSelectedXmlPortal(portal)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Ver Feed XML</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyFeedUrl(portal)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                          title="Copiar link público do XML"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copiado!' : 'Copiar URL'}</span>
                        </button>

                        <button
                          onClick={() => handleSyncPortal(portal.id)}
                          disabled={isSyncing || !portal.active}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regras de Validação & Exportação XML */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Regras Automáticas de Validação de XML dos Portais (Anti-Rejeição)
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              O AcertGo sanitiza e valida o XML em conformidade com as diretrizes do Grupo ZAP, VivaReal e OLX para evitar bloqueios de anúncios.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleOnlyWithPhotos}
                  onChange={(e) => setRuleOnlyWithPhotos(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Bloquear imóveis com menos de 3 fotos
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Evita rejeição e perda de score nos portais
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleHideExactAddress}
                  onChange={(e) => setRuleHideExactAddress(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Ocultar número e andar nos feeds
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Protege o proprietário e a exclusividade do corretor
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleOnlyAvailable}
                  onChange={(e) => setRuleOnlyAvailable(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Remover do XML ao vender/alugar
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sincronização imediata de baixa no estoque
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* XML Code Viewer Modal */}
      {selectedXmlPortal && (
        <XmlFeedViewerModal
          portal={selectedXmlPortal}
          properties={properties}
          isOpen={!!selectedXmlPortal}
          onClose={() => setSelectedXmlPortal(null)}
        />
      )}

      {/* Full Website CMS Modal */}
      {showCmsModal && (
        <WebsiteCmsModal
          isOpen={showCmsModal}
          onClose={() => setShowCmsModal(false)}
          config={websiteConfig}
          onSaveConfig={(newConfig) => {
            setWebsiteConfig(newConfig);
          }}
        />
      )}

      {/* Fullscreen Interactive Site Preview Modal */}
      {showFullscreenPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-6xl h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Simulated Browser Chrome Top Bar */}
            <div className="px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              
              {/* Browser Dots & URL */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-mono">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>https://{websiteConfig.customDomain || 'imobiliaria.acertgo.com.br'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SSL Seguro
                  </span>
                </div>
              </div>

              {/* Template Switcher & Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Modelo:</span>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value as WebsiteTemplateId)}
                    className="px-2.5 py-1 text-xs font-bold bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-1 focus:ring-blue-500 outline-hidden"
                  >
                    {WEBSITE_TEMPLATE_OPTIONS.map(tmpl => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} ({tmpl.accentBadge})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFullscreenPreview(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Live Interactive Preview Container */}
            <div className="flex-1 overflow-y-auto bg-slate-100 p-2 sm:p-4">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <WebsiteTemplatePreview
                  properties={properties}
                  config={websiteConfig}
                  selectedTemplateId={selectedTemplateId}
                  onSelectProperty={onOpenPropertyDetails}
                  onLeadSubmitted={onNewLeadFromWebsite}
                  onOpenCustomerPortal={onNavigateToCustomerPortal}
                  onOpenIndiqueGanhe={onNavigateToIndiqueGanhe}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

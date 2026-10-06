import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Search, 
  Share2, 
  Code2, 
  Check, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Tag, 
  BarChart, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { WebsiteSeoConfig } from '../../types/websiteSeo';

interface WebsiteSeoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  customDomain: string;
  seoConfig?: WebsiteSeoConfig;
  onSaveSeo: (newSeo: WebsiteSeoConfig) => void;
}

export const DEFAULT_SEO_CONFIG: WebsiteSeoConfig = {
  metaTitle: 'AcertGo Imóveis | Compra, Venda e Locação de Alto Padrão em São Paulo',
  metaDescription: 'Encontre apartamentos, casas e coberturas nos melhores bairros de São Paulo. Assessoria jurídica completa, locação sem fiador e aprovação de crédito em 24h.',
  metaKeywords: [
    'imobiliaria sp',
    'apartamentos a venda pinheiros',
    'coberturas jardins',
    'locacao sem fiador sao paulo',
    'lancamentos na planta sp',
    'studios faria lima',
    'acertgo imoveis'
  ],
  canonicalUrl: 'https://www.acertgoimoveis.com.br',
  ogTitle: 'AcertGo Imóveis - Os Melhores Imóveis e Lançamentos de São Paulo',
  ogDescription: 'Acesse o acervo exclusivo de imóveis para compra e locação nos bairros mais nobres de São Paulo.',
  ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
  googleAnalyticsId: 'G-ACERTGO2026',
  facebookPixelId: '148920194812390',
  googleSearchConsoleTag: 'google-site-verification=89abcde789fghij101112'
};

export const WebsiteSeoStudioModal: React.FC<WebsiteSeoStudioModalProps> = ({
  isOpen,
  onClose,
  siteName,
  customDomain,
  seoConfig = DEFAULT_SEO_CONFIG,
  onSaveSeo
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'meta' | 'tags' | 'social' | 'schema' | 'analytics'>('meta');
  const [formData, setFormData] = useState<WebsiteSeoConfig>(seoConfig);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const titleLength = formData.metaTitle.length;
  const descLength = formData.metaDescription.length;

  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const clean = newKeywordInput.trim().toLowerCase();
    if (!formData.metaKeywords.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, clean]
      }));
    }
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(k => k !== keyword)
    }));
  };

  // Generate dynamic Schema.org JSON-LD
  const schemaJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": siteName,
    "url": formData.canonicalUrl || `https://${customDomain}`,
    "logo": formData.ogImage,
    "image": formData.ogImage,
    "description": formData.metaDescription,
    "telephone": "+55-11-3042-8800",
    "priceRange": "R$ 300.000 - R$ 15.000.000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Brigadeiro Faria Lima, 3477",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "postalCode": "01452-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.5855,
      "longitude": -46.6826
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  }, null, 2);

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(schemaJsonLd);
    setCopiedJsonLd(true);
    setTimeout(() => setCopiedJsonLd(false), 2500);
  };

  const handleSave = () => {
    onSaveSeo(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-heading">
                Estúdio de SEO, Tags & Meta Tags
              </h2>
              <p className="text-xs text-slate-400">
                Otimização para o Google (SERP), Redes Sociais, OpenGraph e Schema.org
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'meta', label: 'Meta Tags & Google (SERP)', icon: Search },
            { id: 'tags', label: 'Palavras-Chave & Tags', icon: Tag },
            { id: 'social', label: 'Redes Sociais & OpenGraph', icon: Share2 },
            { id: 'schema', label: 'Schema.org (JSON-LD)', icon: Code2 },
            { id: 'analytics', label: 'Analytics & Pixels', icon: BarChart },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: META TAGS & GOOGLE SERP PREVIEW */}
          {activeTab === 'meta' && (
            <div className="space-y-6">
              
              {/* Google Live SERP Snippet Preview */}
              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="font-bold flex items-center gap-1.5 text-blue-400">
                    <Search className="w-3.5 h-3.5" />
                    <span>Pré-Visualização no Google Brasil (Desktop & Mobile)</span>
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                    Ao Vivo
                  </span>
                </div>

                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                      🌐
                    </div>
                    <span className="text-slate-400 truncate font-mono text-[11px]">
                      {formData.canonicalUrl || `https://${customDomain}`} › imoveis
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                    {formData.metaTitle || 'Título da Página'}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {formData.metaDescription || 'Descrição da página exibida nos resultados do Google.'}
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Meta Title (Tag &lt;title&gt;)
                    </label>
                    <span className={`text-[11px] font-mono font-bold ${
                      titleLength > 65 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {titleLength}/60 caracteres {titleLength > 65 && '(pode truncar no Google)'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Meta Description (Tag &lt;meta name="description"&gt;)
                    </label>
                    <span className={`text-[11px] font-mono font-bold ${
                      descLength > 160 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {descLength}/160 caracteres
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.metaDescription}
                    onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-hidden focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      URL Canônica (Canonical URL)
                    </label>
                    <input
                      type="text"
                      value={formData.canonicalUrl || ''}
                      onChange={e => setFormData({ ...formData, canonicalUrl: e.target.value })}
                      placeholder="https://www.suaimobiliaria.com.br"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Robots Meta Tag
                    </label>
                    <select
                      value={formData.robots || 'index, follow'}
                      onChange={e => setFormData({ ...formData, robots: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                    >
                      <option value="index, follow">index, follow (Recomendado - Indexa e segue links)</option>
                      <option value="noindex, follow">noindex, follow (Não exibe nos resultados)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Privado)</option>
                    </select>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PALAVRAS-CHAVE & TAGS */}
          {activeTab === 'tags' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Palavras-Chave de Foco & Tags Imobiliárias
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Termos estratégicos para impulsionar a relevância do seu site em buscas locais e bairros atendidos.
                </p>
              </div>

              {/* Add Keyword Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: apartamentos pinheiros, cobertura duplex moema..."
                  value={newKeywordInput}
                  onChange={e => setNewKeywordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  Adicionar Tag
                </button>
              </div>

              {/* Tags Cloud */}
              <div className="flex flex-wrap gap-2 p-4 bg-slate-950 rounded-2xl border border-slate-800 min-h-[120px]">
                {formData.metaKeywords.map(keyword => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-300 text-xs font-semibold"
                  >
                    <span>{keyword}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {formData.metaKeywords.length === 0 && (
                  <span className="text-xs text-slate-500 italic">Nenhuma tag cadastrada ainda.</span>
                )}
              </div>

              {/* Sugestões Rápidas */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sugestões Rápidas de Tags para Adicionar:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'imoveis alto padrao sp',
                    'locacao sem fiador',
                    'comprar apartamento sp',
                    'lancamento planta pinheiros',
                    'cobertura jardins',
                    'studios investimento',
                    'financiamento caixa aprovado',
                    'imobiliaria faria lima'
                  ].map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        if (!formData.metaKeywords.includes(sug)) {
                          setFormData(prev => ({ ...prev, metaKeywords: [...prev.metaKeywords, sug] }));
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-[11px] font-medium transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REDES SOCIAIS & OPENGRAPH */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              
              {/* WhatsApp & Facebook Card Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pré-visualização do Card ao Compartilhar no WhatsApp / Facebook / LinkedIn:
                </span>
                
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden max-w-md mx-auto shadow-2xl">
                  <div className="aspect-16/9 bg-slate-900 overflow-hidden relative">
                    <img
                      src={formData.ogImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'}
                      alt="OpenGraph Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-[10px] text-white rounded font-mono">
                      1200 x 630 px
                    </div>
                  </div>
                  <div className="p-4 space-y-1 bg-slate-900/90">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                      {customDomain || 'acertgoimoveis.com.br'}
                    </span>
                    <h4 className="font-bold text-sm text-white line-clamp-1">
                      {formData.ogTitle || formData.metaTitle}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {formData.ogDescription || formData.metaDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form OpenGraph Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Título OpenGraph (og:title)
                  </label>
                  <input
                    type="text"
                    value={formData.ogTitle || formData.metaTitle}
                    onChange={e => setFormData({ ...formData, ogTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Descrição OpenGraph (og:description)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ogDescription || formData.metaDescription}
                    onChange={e => setFormData({ ...formData, ogDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    URL da Imagem de Compartilhamento (og:image - Recomendado 1200x630px)
                  </label>
                  <input
                    type="text"
                    value={formData.ogImage || ''}
                    onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SCHEMA.ORG JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Dados Estruturados Schema.org (JSON-LD RealEstateAgent)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gera rich snippets no Google, destacando endereço, telefone, horário de funcionamento e avaliações.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyJsonLd}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  {copiedJsonLd ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJsonLd ? 'Copiado!' : 'Copiar JSON-LD'}</span>
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[300px]">
                <pre>{schemaJsonLd}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS & PIXELS */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Ferramentas de Rastreamento & Webmasters
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conecte o Google Analytics 4, Pixel da Meta e Verificação do Google Search Console.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    ID de Medição do Google Analytics 4 (GA4)
                  </label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={formData.googleAnalyticsId || ''}
                    onChange={e => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    ID do Pixel da Meta (Facebook / Instagram Ads)
                  </label>
                  <input
                    type="text"
                    placeholder="123456789012345"
                    value={formData.facebookPixelId || ''}
                    onChange={e => setFormData({ ...formData, facebookPixelId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Meta Tag de Verificação do Google Search Console
                  </label>
                  <input
                    type="text"
                    placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXXX"
                    value={formData.googleSearchConsoleTag || ''}
                    onChange={e => setFormData({ ...formData, googleSearchConsoleTag: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Configurações salvas são injetadas automaticamente no cabeçalho do site.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <span>Salvar Configurações de SEO</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

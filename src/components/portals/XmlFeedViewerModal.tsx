import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Code, 
  Download, 
  FileCode2, 
  Sparkles,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { PortalIntegration, RealEstateProperty } from '../../types/crm';
import { generateSampleZapXml } from '../../data/mockPortals';

interface XmlFeedViewerModalProps {
  portal: PortalIntegration;
  properties: RealEstateProperty[];
  isOpen: boolean;
  onClose: () => void;
}

export const XmlFeedViewerModal: React.FC<XmlFeedViewerModalProps> = ({
  portal,
  properties,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const xmlContent = generateSampleZapXml(properties);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portal.feedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `feed-${portal.portalCode.toLowerCase()}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight font-heading">
                  Feed XML Integrado: {portal.name}
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Padrão ZAP / VRSync v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                URL de sincronização contínua para robôs de captação e portais parceiros
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

        {/* URL Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Link Público Seguro para o Portal:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Token criptografado SHA-256
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate select-all">
              {portal.feedUrl}
            </div>

            <button
              onClick={handleCopyUrl}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                copiedUrl
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copiado!' : 'Copiar URL'}</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-600" />
              Conteúdo XML Gerado em Tempo Real ({properties.length} imóveis na base):
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                title="Recarregar XML"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>

              <button
                onClick={handleCopyXml}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedXml ? 'Copiado' : 'Copiar Código'}</span>
              </button>

              <button
                onClick={handleDownloadXml}
                className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar .xml</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-auto border border-slate-800 shadow-inner">
            <pre className="text-slate-300">
              <code>{xmlContent}</code>
            </pre>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Robôs do portal lêem este arquivo a cada <strong>{portal.syncFrequencyHours} horas</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

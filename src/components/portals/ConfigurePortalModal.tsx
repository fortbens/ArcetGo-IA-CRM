import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Check, 
  Save, 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Globe, 
  Key, 
  Sliders, 
  Layers, 
  FileCode, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { PortalIntegration } from '../../types/crm';

interface ConfigurePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  portal: PortalIntegration;
  onSavePortal: (updatedPortal: PortalIntegration) => void;
}

export const ConfigurePortalModal: React.FC<ConfigurePortalModalProps> = ({
  isOpen,
  onClose,
  portal,
  onSavePortal
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<PortalIntegration>({
    ...portal,
    maxProperties: portal.maxProperties || 50,
    maxHighlights: portal.maxHighlights || 10,
    syncFrequencyHours: portal.syncFrequencyHours || 2,
    leadWebhookActive: portal.leadWebhookActive ?? true
  });

  const [contractId, setContractId] = useState(
    portal.id === 'portal_zap' ? 'CTR-ZAP-8492' : 
    portal.id === 'portal_olx' ? 'OLX-PRO-3320' : 
    portal.id === 'portal_imovelweb' ? 'IW-MATRIZ-9102' : 'CONTRATO-ACERTGO'
  );
  const [apiKeyToken, setApiKeyToken] = useState('sec_feed_' + portal.portalCode.toLowerCase() + '_98412');
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(true);
  const [hideExactNumber, setHideExactNumber] = useState(true);
  const [includeIptuCondo, setIncludeIptuCondo] = useState(true);
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(formData.feedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PortalIntegration = {
      ...formData,
      status: formData.active ? 'ONLINE' : 'PAUSED'
    };
    onSavePortal(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={portal.logo} 
              alt={portal.name} 
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-white" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Configurar Portal: {portal.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  formData.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {formData.active ? 'ATIVO' : 'PAUSADO'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ajuste cotas de anúncios, destaques, frequência de carga e credenciais de integração
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Status & Ativação */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 text-sm block">Publicação Automática no Portal</span>
              <p className="text-slate-500 text-[11px]">
                Quando ativado, os robôs do portal consultam o XML nos horários agendados e sincronizam o estoque
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: !formData.active })}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                formData.active ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.active ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Cotas do Portal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Cota de Imóveis Contratada
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.maxProperties}
                onChange={(e) => setFormData({ ...formData, maxProperties: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Atualmente no feed: {formData.totalPublished} imóveis
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Cota de Destaques
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.maxHighlights}
                onChange={(e) => setFormData({ ...formData, maxHighlights: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Super Destaques / Destaques
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Frequência de Atualização
              </label>
              <select
                value={formData.syncFrequencyHours}
                onChange={(e) => setFormData({ ...formData, syncFrequencyHours: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
              >
                <option value={1}>A cada 1 hora (Alta rotação)</option>
                <option value={2}>A cada 2 horas (Recomendado)</option>
                <option value={4}>A cada 4 horas</option>
                <option value={6}>A cada 6 horas</option>
                <option value={12}>A cada 12 horas</option>
                <option value={24}>A cada 24 horas (Diário)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Carga incremental no portal
              </span>
            </div>
          </div>

          {/* Credenciais no Portal Parceiro */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              Credenciais da Imobiliária no Portal
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Código do Contrato / ID da Agência</label>
                <input
                  type="text"
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  placeholder="Ex: CTR-ZAP-8492"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Token de Segurança do Feed</label>
                <input
                  type="text"
                  value={apiKeyToken}
                  onChange={(e) => setApiKeyToken(e.target.value)}
                  placeholder="sec_feed_token_xyz"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* URL do Feed XML */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">URL Oficial do Feed XML</label>
              <button
                type="button"
                onClick={handleCopyFeed}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-[11px]"
              >
                {copiedFeed ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFeed ? 'Copiado!' : 'Copiar URL'}</span>
              </button>
            </div>
            <input
              type="text"
              value={formData.feedUrl}
              onChange={(e) => setFormData({ ...formData, feedUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono text-[11px]"
            />
            <p className="text-[11px] text-slate-400">
              Cole este link no painel de anunciante do portal (Canal Pro do Zap, Portal do Cliente OLX, ou Imovelweb).
            </p>
          </div>

          {/* Regras de Sanitização XML */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Regras de Exportação para este Portal
            </span>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithPhotos}
                onChange={(e) => setOnlyWithPhotos(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-slate-700 font-medium">Exportar somente imóveis que contenham fotos cadastradas</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hideExactNumber}
                onChange={(e) => setHideExactNumber(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-slate-700 font-medium">Ocultar número exato do endereço no XML público (Anti-captação predatória)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeIptuCondo}
                onChange={(e) => setIncludeIptuCondo(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-slate-700 font-medium">Incluir valores de IPTU e taxa condominial discriminados</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.leadWebhookActive}
                onChange={(e) => setFormData({ ...formData, leadWebhookActive: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="text-slate-700 font-medium">Captura automática de leads gerados no portal para o CRM</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5 transition-colors"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Configurações Salvas!' : 'Salvar Configurações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  QrCode, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  Layers,
  HelpCircle,
  CheckCircle2,
  Server
} from 'lucide-react';

interface SalesPageLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName?: string;
  agencyName?: string;
}

export const SalesPageLinkModal: React.FC<SalesPageLinkModalProps> = ({
  isOpen,
  onClose,
  platformName = 'AcertGo Imob',
  agencyName = 'Imobiliária'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'LINKS' | 'INSTRUCTIONS' | 'QRCODE'>('LINKS');

  if (!isOpen) return null;

  // Obter o host e protocolo atual de forma resiliente
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://seusite.com.br';
  
  const linkCanonical = `${origin}/vendas`;
  const linkSpaHash = `${origin}/#/vendas`;
  const linkParam = `${origin}/?page=vendas`;

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(linkSpaHash)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Link Oficial da Página de Vendas
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Pública
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Acesse e compartilhe a Landing Page de captação de clientes independentemente do CRM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('LINKS')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'LINKS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Links de Acesso</span>
          </button>
          <button
            onClick={() => setActiveTab('QRCODE')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'QRCODE'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab('INSTRUCTIONS')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'INSTRUCTIONS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Como Publicar Separado</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'LINKS' && (
            <div className="space-y-4">
              {/* Informative Banner */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-blue-200 text-xs flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-300">Página de Vendas 100% Pública e Desconectada do Login</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Qualquer lead cadastrado nestes links é automaticamente gravado no Cloud Firestore e aparece instantaneamente no pipeline do CRM para sua equipe de corretores.
                  </p>
                </div>
              </div>

              {/* Link 1: Universal Hash Link (Works on cPanel, Homehost, Firebase, Apache without config) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Link Universal (100% Compatível SPA / cPanel / Apache)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      Mais Recomendado
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={linkSpaHash}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-blue-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(linkSpaHash, 'hash')}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {copiedKey === 'hash' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'hash' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                  <a
                    href={linkSpaHash}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Abrir página em nova aba"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400">
                  Funciona diretamente em qualquer hospedagem mesmo sem redirecionamento especial no servidor web.
                </p>
              </div>

              {/* Link 2: Clean Canonical Link (/vendas) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Link Direto Limpo (/vendas)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={linkCanonical}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(linkCanonical, 'clean')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {copiedKey === 'clean' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'clean' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                  <a
                    href={linkCanonical}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Abrir página em nova aba"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ideal para anúncios no Google Ads, Instagram Ads e bio do Instagram. (Necessita do arquivo .htaccess configurado no cPanel).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'QRCODE' && (
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20 shrink-0">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code da Página de Vendas" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white text-base">QR Code para Celular & Impressão</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aponte a câmera do seu celular para testar a Landing Page instantaneamente. Você também pode salvar esta imagem para incluir em cartões de visita, panfletos, placas de captação de imóveis ou telões de eventos.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleCopy(linkSpaHash, 'qr_link')}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    {copiedKey === 'qr_link' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>Copiar URL do QR Code</span>
                  </button>
                  <a
                    href={qrCodeUrl}
                    download="qrcode-pagina-vendas.png"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Baixar Imagem QR Code</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INSTRUCTIONS' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>Opções para Publicar a Página de Vendas Separadamente</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Você mencionou que deseja publicar a página de vendas separadamente do CRM. Veja como fazer isso de maneira simples:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <p className="font-bold text-blue-300 text-xs flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    Opção 1: Subdomínio no cPanel (Recomendado)
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    No cPanel da Homehost, crie um subdomínio como <code className="text-amber-300">vendas.seudominio.com.br</code> ou <code className="text-amber-300">lp.seudominio.com.br</code>. Você pode apontar a pasta raiz desse subdomínio para os arquivos estáticos ou criar um redirecionamento 301 para a rota <code className="text-blue-300">/#/vendas</code>.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <p className="font-bold text-emerald-300 text-xs flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Opção 2: Publicação em Domínio Próprio Separado
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Você pode hospedar o build gerado em qualquer servidor ou pasta pública dedicada. A Landing Page se comunica com o Firebase Firestore pela chave já configurada no projeto, garantindo que todo lead enviado caia no CRM centralizado em tempo real.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Sincronizado em tempo real com o Cloud Firestore
          </span>
          <div className="flex items-center gap-2">
            <a
              href={linkSpaHash}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visualizar Página de Vendas</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

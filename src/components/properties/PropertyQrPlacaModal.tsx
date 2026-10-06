import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  QrCode, 
  ExternalLink, 
  Share2, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Sparkles, 
  Check, 
  CheckCircle2,
  Maximize2,
  Copy
} from 'lucide-react';
import { RealEstateProperty } from '../../types/crm';
import { RealPropertyQrCode } from '../common/RealPropertyQrCode';

interface PropertyQrPlacaModalProps {
  property: RealEstateProperty | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyQrPlacaModal: React.FC<PropertyQrPlacaModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const [signOrientation, setSignOrientation] = useState<'VERTICAL' | 'HORIZONTAL'>('VERTICAL');
  const [signColorTheme, setSignColorTheme] = useState<'NAVY' | 'EMERALD' | 'DARK'>('NAVY');
  const [destType, setDestType] = useState<'WEB_LANDING' | 'WHATSAPP_CORRETOR'>('WEB_LANDING');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !property) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://acertgo.com.br';
  const targetWebUrl = `${currentOrigin}/#imovel=${property.code}`;
  const whatsappUrl = `https://wa.me/5511998642424?text=${encodeURIComponent(`Olá! Estou em frente à placa do imóvel cód. ${property.code} (${property.title}) e gostaria de mais informações e visita.`)}`;

  const activeUrl = destType === 'WEB_LANDING' ? targetWebUrl : whatsappUrl;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isLocacao = property.transactionType === 'LOCACAO';
  const tagText = isLocacao ? 'ALUGA-SE' : 'VENDE-SE';

  const themeStyles = {
    NAVY: {
      headerBg: 'bg-blue-900 text-white',
      accentColor: 'text-blue-600',
      badgeBg: 'bg-amber-400 text-slate-950 font-black',
      borderAccent: 'border-blue-900',
    },
    EMERALD: {
      headerBg: 'bg-emerald-800 text-white',
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-amber-400 text-slate-950 font-black',
      borderAccent: 'border-emerald-800',
    },
    DARK: {
      headerBg: 'bg-slate-950 text-white',
      accentColor: 'text-slate-900',
      badgeBg: 'bg-amber-400 text-slate-950 font-black',
      borderAccent: 'border-slate-950',
    }
  }[signColorTheme];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Placa Imobiliária com QR Code Inteligente
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  CÓD: {property.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gere e imprima a placa oficial da imobiliária para fixação externa no imóvel com rastreamento de leitura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Controls, Right Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Destino do QR Code */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                Destino ao Escanear
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDestType('WEB_LANDING')}
                  className={`p-3 rounded-xl border text-left transition-all text-xs ${
                    destType === 'WEB_LANDING'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <Globe className="w-4 h-4 mb-1.5" />
                  <div className="font-bold">Ficha / Mini Site</div>
                  <div className="text-[10px] opacity-80">Fotos, tour e ficha completa</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDestType('WHATSAPP_CORRETOR')}
                  className={`p-3 rounded-xl border text-left transition-all text-xs ${
                    destType === 'WHATSAPP_CORRETOR'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <Phone className="w-4 h-4 mb-1.5" />
                  <div className="font-bold">WhatsApp Direto</div>
                  <div className="text-[10px] opacity-80">Abre chat já qualificado</div>
                </button>
              </div>

              <div className="pt-2">
                <div className="text-[11px] text-slate-500 font-medium mb-1">Link de destino codificado:</div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-mono">
                  <span className="truncate flex-1 text-[11px]">{activeUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 text-slate-500 hover:text-blue-600 shrink-0"
                    title="Copiar link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Tema Visual da Placa */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                Padrão Visual da Placa
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSignColorTheme('NAVY')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    signColorTheme === 'NAVY'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Azul Royal
                </button>
                <button
                  onClick={() => setSignColorTheme('EMERALD')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    signColorTheme === 'EMERALD'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Verde Esmeralda
                </button>
                <button
                  onClick={() => setSignColorTheme('DARK')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    signColorTheme === 'DARK'
                      ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Preto Nobre
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setSignOrientation('VERTICAL')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                    signOrientation === 'VERTICAL'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Vertical (60x90cm)
                </button>
                <button
                  onClick={() => setSignOrientation('HORIZONTAL')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                    signOrientation === 'HORIZONTAL'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Horizontal (90x60cm)
                </button>
              </div>
            </div>

            {/* Ficha Rápida do Imóvel para a Placa */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-blue-950">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Dados no Rodapé da Placa:</span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5 font-medium">
                <div>• <strong>Código:</strong> {property.code}</div>
                <div>• <strong>Endereço:</strong> {property.address.street}, {property.address.number || 'S/N'} - {property.address.neighborhood}</div>
                <div>• <strong>Plantão Telefônico:</strong> (11) 3450-2020 / (11) 99864-2424</div>
                <div>• <strong>CRECI Jurídico:</strong> 34.890-J</div>
              </div>
            </div>

            {/* Ações de Impressão e Download */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Placa Direto (A4 / Plotter)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Physical Real Estate Sign Mockup */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100 p-4 sm:p-6 rounded-3xl border border-slate-200/80 min-h-[440px]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>MOCKUP DA PLACA FÍSICA PARA IMPRESSÃO</span>
            </div>

            {/* The Physical Placa Container */}
            <div 
              className={`bg-white rounded-2xl shadow-2xl border-4 ${themeStyles.borderAccent} overflow-hidden w-full max-w-[340px] flex flex-col justify-between transition-all`}
              style={{ minHeight: signOrientation === 'VERTICAL' ? '460px' : '360px' }}
            >
              {/* Placa Header */}
              <div className={`${themeStyles.headerBg} p-4 text-center space-y-1`}>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                    AG
                  </div>
                  <span className="font-black text-lg tracking-wider">ACERTGO</span>
                </div>
                <div className="text-[9px] uppercase tracking-widest text-slate-300 font-bold">
                  Gestão & Negócios Imobiliários
                </div>
              </div>

              {/* Tag VENDE-SE / ALUGA-SE */}
              <div className="text-center py-2.5 bg-amber-400 text-slate-950 font-black text-xl tracking-tight uppercase shadow-xs">
                {tagText}
              </div>

              {/* QR Code Center Display */}
              <div className="p-4 flex flex-col items-center justify-center space-y-2.5 text-center">
                <div className="bg-white p-2 rounded-2xl shadow-inner border border-slate-200">
                  <RealPropertyQrCode
                    propertyCode={property.code}
                    propertyTitle={property.title}
                    targetUrl={activeUrl}
                    size={170}
                    showActions={true}
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] font-black text-slate-900 tracking-wide uppercase">
                    Aponte a Câmera do Celular
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">
                    Fotos em HD • Preço • Tour Virtual • Plantão
                  </div>
                </div>
              </div>

              {/* Placa Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center space-y-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-black">
                  CÓD: {property.code}
                </div>
                <div className="text-[11px] font-black text-slate-900">
                  (11) 3450-2020 • (11) 99864-2424
                </div>
                <div className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">
                  creci 34.890-j • acertgo.com.br
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[11px] text-slate-500">
                Utilize os botões PNG e SVG abaixo do QR Code para enviar a arte para a gráfica ou plotagem rápida.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Imóvel: <strong className="text-slate-800">{property.title}</strong> ({property.address.neighborhood})
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

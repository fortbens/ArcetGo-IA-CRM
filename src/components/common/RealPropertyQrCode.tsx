import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, QrCode, ExternalLink, Share2, Check } from 'lucide-react';

interface RealPropertyQrCodeProps {
  propertyCode: string;
  propertyTitle?: string;
  targetUrl?: string;
  whatsappNumber?: string;
  size?: number;
  className?: string;
  showActions?: boolean;
}

export const RealPropertyQrCode: React.FC<RealPropertyQrCodeProps> = ({
  propertyCode,
  propertyTitle = 'Imóvel Exclusivo',
  targetUrl,
  whatsappNumber = '5511998642424',
  size = 180,
  className = '',
  showActions = false
}) => {
  const [qrMode, setQrMode] = useState<'WEB_LINK' | 'WHATSAPP'>('WEB_LINK');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Compute final destination URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://acertgo.com.br';
  const defaultWebUrl = targetUrl || `${currentOrigin}/#imovel=${propertyCode}`;
  
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(`Olá! Vi a placa do imóvel ${propertyCode} (${propertyTitle}) e gostaria de agendar uma visita e receber mais informações.`);
  const defaultWaUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const destinationUrl = qrMode === 'WEB_LINK' ? defaultWebUrl : defaultWaUrl;

  useEffect(() => {
    // Generate raster data URL
    QRCode.toDataURL(destinationUrl, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('Error generating QR Code', err));

    // Generate SVG string for vector export
    QRCode.toString(destinationUrl, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(svg => setSvgString(svg))
      .catch(err => console.error('Error generating SVG QR Code', err));
  }, [destinationUrl, size]);

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QRCode_Placa_${propertyCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QRCode_Placa_${propertyCode}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(destinationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Mode Switcher */}
      {showActions && (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold mb-2">
          <button
            type="button"
            onClick={() => setQrMode('WEB_LINK')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              qrMode === 'WEB_LINK' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ficha Web
          </button>
          <button
            type="button"
            onClick={() => setQrMode('WHATSAPP')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              qrMode === 'WHATSAPP' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            WhatsApp Plantão
          </button>
        </div>
      )}

      {/* QR Code Container */}
      <div 
        style={{ width: size, height: size }}
        className="bg-white p-2 rounded-xl border-2 border-slate-900 shadow-md flex items-center justify-center relative overflow-hidden"
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`QR Code para o imóvel ${propertyCode}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
            Gerando QR...
          </div>
        )}
      </div>

      <span className="text-[10px] font-black uppercase text-slate-900 tracking-wider mt-1.5 font-mono">
        {propertyCode}
      </span>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap justify-center text-xs">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1 text-[11px]"
            title="Baixar imagem em PNG alta resolução"
          >
            <Download className="w-3 h-3" />
            <span>PNG</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1 text-[11px]"
            title="Baixar vetor em SVG para gráfica"
          >
            <Download className="w-3 h-3" />
            <span>SVG</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold flex items-center gap-1 text-[11px]"
            title="Copiar link que abre ao escanear o QR Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
            <span>{copied ? 'Copiado' : 'Link'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { 
  Palette, 
  QrCode, 
  Lock, 
  Sparkles, 
  FileImage, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2, 
  Type, 
  ShieldCheck, 
  Sliders, 
  Printer, 
  Phone, 
  Globe, 
  MessageCircle, 
  Building2, 
  Maximize2, 
  Eye, 
  Upload, 
  Layers,
  FileCheck2,
  SlidersHorizontal,
  Image as ImageIcon,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { BRAND_EQUITY_CONFIG } from '../../data/mockData';
import { generatePropertyDescription } from '../../services/aiService';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { TenantAgency } from '../../types/superAdmin';

export type PlacaFinalidade = 'VENDE-SE' | 'ALUGA-SE' | 'VENDE OU ALUGA' | 'LANÇAMENTO' | 'OPORTUNIDADE';

export interface PlacaDimensao {
  id: string;
  label: string;
  larguraCm: number;
  alturaCm: number;
  materialSugerido: string;
  aplicacao: string;
}

export const PLACA_DIMENSOES: PlacaDimensao[] = [
  { id: '50x70', label: '50 × 70 cm', larguraCm: 50, alturaCm: 70, materialSugerido: 'Polionda / PVC 2mm', aplicacao: 'Janela, Grade ou Sacada' },
  { id: '70x100', label: '70 × 100 cm', larguraCm: 70, alturaCm: 100, materialSugerido: 'ACM / Alucobond 3mm', aplicacao: 'Fachada Padrão de Rua' },
  { id: '90x60', label: '90 × 60 cm', larguraCm: 90, alturaCm: 60, materialSugerido: 'Alucobond / Chapa Galvanizada', aplicacao: 'Portão e Gradil Residencial' },
  { id: '100x150', label: '100 × 150 cm', larguraCm: 100, alturaCm: 150, materialSugerido: 'Lona 440g com Ilhoses', aplicacao: 'Muro Alto e Fachada Comercial' },
  { id: '200x50', label: '200 × 50 cm (Faixa)', larguraCm: 200, alturaCm: 50, materialSugerido: 'Lona Frontlight com Bainha', aplicacao: 'Faixa Horizontal para Muro / Gradil' },
  { id: '300x100', label: '300 × 100 cm (Tapume)', larguraCm: 300, alturaCm: 100, materialSugerido: 'Lona 440g Reforçada', aplicacao: 'Terreno / Tapume de Lançamento' },
];

export const PLACA_TIPOS_IMOVEL = [
  'Venda de Salas Comerciais',
  'Venda de Apartamentos & Studios',
  'Venda de Casas em Condomínio',
  'Aluga-se Salão Comercial / Loja',
  'Aluga-se Galpão Industrial',
  'Área para Incorporação',
  'Terrenos & Lotes Urbanizados',
  'Vende-se Imóvel Residencial',
  'Aluga-se Apartamento Mobiliado',
  'Imóvel Comercial de Alto Padrão'
];

export const PLACA_PALETAS = [
  { id: 'azul_branco', name: 'Azul Corporativo & Branco', bgHeader: '#0056D2', textHeader: '#FFFFFF', bgBody: '#FFFFFF', textBody: '#0F172A', accent: '#00C896' },
  { id: 'amarelo_preto', name: 'Amarelo Rua & Preto (Alta Visibilidade)', bgHeader: '#FFD000', textHeader: '#000000', bgBody: '#000000', textBody: '#FFFFFF', accent: '#FFD000' },
  { id: 'vermelho_branco', name: 'Vermelho Comercial & Branco', bgHeader: '#DC2626', textHeader: '#FFFFFF', bgBody: '#FFFFFF', textBody: '#1E293B', accent: '#DC2626' },
  { id: 'verde_prime', name: 'Verde Prime & Branco', bgHeader: '#059669', textHeader: '#FFFFFF', bgBody: '#FFFFFF', textBody: '#064E3B', accent: '#10B981' },
  { id: 'luxo_preto_ouro', name: 'Preto & Ouro Imperial (Alto Padrão)', bgHeader: '#0F172A', textHeader: '#F59E0B', bgBody: '#020617', textBody: '#F8FAFC', accent: '#D97706' },
];

export interface BrandEquityViewProps {
  currentTenant?: TenantAgency | null;
  defaultLogoUrl?: string;
  defaultAgencyName?: string;
  defaultPhone?: string;
  defaultWhatsapp?: string;
  defaultSite?: string;
  defaultCreci?: string;
}

export const BrandEquityView: React.FC<BrandEquityViewProps> = ({
  currentTenant,
  defaultLogoUrl,
  defaultAgencyName,
  defaultPhone,
  defaultWhatsapp,
  defaultSite,
  defaultCreci
}) => {
  const [config] = useState(BRAND_EQUITY_CONFIG);

  // States for Placa Crafting Studio
  const [finalidade, setFinalidade] = useState<PlacaFinalidade>('VENDE-SE');
  const [tipoPlaca, setTipoPlaca] = useState<string>('Venda de Salas Comerciais');
  const [tipoPersonalizado, setTipoPersonalizado] = useState<string>('');
  const [isTipoCustom, setIsTipoCustom] = useState<boolean>(false);
  const [dimensaoId, setDimensaoId] = useState<string>('70x100');
  const [paletaId, setPaletaId] = useState<string>('azul_branco');
  
  // Contacts on Placa
  const [telefone, setTelefone] = useState(defaultPhone || currentTenant?.ownerPhone || '(11) 3045-8000');
  const [whatsapp, setWhatsapp] = useState(defaultWhatsapp || currentTenant?.ownerPhone || '(11) 98844-3322');
  const [site, setSite] = useState(defaultSite || currentTenant?.subdomain || 'acertgo.com.br');
  const [creci, setCreci] = useState(defaultCreci || currentTenant?.creciJ || 'CRECI 34982-J');
  const [propertyCode, setPropertyCode] = useState('ACG-8942');

  // Agency Logo on Placa
  const [showLogoOnPlaca, setShowLogoOnPlaca] = useState<boolean>(true);
  const [placaLogoUrl, setPlacaLogoUrl] = useState<string>(
    defaultLogoUrl || currentTenant?.logoUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80'
  );
  const [placaLogoPosition, setPlacaLogoPosition] = useState<'HEADER' | 'CORPO' | 'RODAPE'>('HEADER');
  const [placaLogoSize, setPlacaLogoSize] = useState<'PEQUENO' | 'MEDIO' | 'GRANDE'>('MEDIO');
  const [placaLogoBg, setPlacaLogoBg] = useState<'BRANCO_CARD' | 'TRANSPARENTE'>('BRANCO_CARD');
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Feedback states
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // AI Copywriter states
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [copiedCopy, setCopiedCopy] = useState(false);

  const selectedDimensao = PLACA_DIMENSOES.find(d => d.id === dimensaoId) || PLACA_DIMENSOES[1];
  const selectedPaleta = PLACA_PALETAS.find(p => p.id === paletaId) || PLACA_PALETAS[0];
  const activeTipoPlaca = isTipoCustom ? (tipoPersonalizado || 'Imóvel Exclusivo') : tipoPlaca;

  // Real QR Code pointing to tracking landing page
  const trackingUrl = `https://${site}/imovel/${propertyCode}?utm_source=placa_fisica&roleta=auto`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(trackingUrl)}`;

  // Handle Logo Upload for Sign
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 800, maxHeight: 400, quality: 0.95 });
      setPlacaLogoUrl(optimized);
      setShowLogoOnPlaca(true);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPlacaLogoUrl(event.target?.result as string);
        setShowLogoOnPlaca(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Real Print Function (Opens Clean Print Window)
  const handlePrintPlaca = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Placa Imobiliária - ${finalidade} - ${propertyCode}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #fff; 
              color: #000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .placa-box {
              width: 700px;
              border: 3px solid #000;
              background-color: ${selectedPaleta.bgBody};
              color: ${selectedPaleta.textBody};
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              text-align: center;
            }
            .placa-header {
              background-color: ${selectedPaleta.bgHeader};
              color: ${selectedPaleta.textHeader};
              padding: 20px 16px;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .placa-logo-container {
              display: inline-block;
              margin-bottom: 8px;
              ${placaLogoBg === 'BRANCO_CARD' ? 'background: #ffffff; padding: 6px 14px; border-radius: 8px;' : ''}
            }
            .placa-logo-img {
              max-height: ${placaLogoSize === 'PEQUENO' ? '45px' : placaLogoSize === 'MEDIO' ? '65px' : '90px'};
              max-width: 260px;
              object-fit: contain;
            }
            .placa-finalidade-text {
              font-size: 40px;
              font-weight: 900;
              margin: 0;
            }
            .placa-sub {
              font-size: 20px;
              font-weight: 800;
              margin: 16px 0 8px;
              text-transform: uppercase;
              color: ${selectedPaleta.textBody};
            }
            .placa-contacts {
              padding: 20px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              border-top: 2px solid rgba(0,0,0,0.1);
            }
            .contact-item {
              font-size: 24px;
              font-weight: 900;
            }
            .placa-footer {
              padding: 10px;
              font-size: 13px;
              font-family: monospace;
              background: rgba(0,0,0,0.05);
            }
          </style>
        </head>
        <body>
          <div class="placa-box">
            <div class="placa-header">
              ${showLogoOnPlaca && placaLogoUrl && placaLogoPosition === 'HEADER' ? `
                <div class="placa-logo-container">
                  <img src="${placaLogoUrl}" class="placa-logo-img" alt="Logo Imobiliária" />
                </div>
              ` : ''}
              <div class="placa-finalidade-text">
                ${finalidade}
              </div>
            </div>

            <div class="placa-sub">
              ${activeTipoPlaca}
            </div>

            ${showLogoOnPlaca && placaLogoUrl && placaLogoPosition === 'CORPO' ? `
              <div style="margin: 12px 0;">
                <div class="placa-logo-container">
                  <img src="${placaLogoUrl}" class="placa-logo-img" alt="Logo Imobiliária" />
                </div>
              </div>
            ` : ''}

            <div style="padding: 12px;">
              <img src="${qrCodeImgUrl}" style="width: 160px; height: 160px; border: 4px solid #fff; border-radius: 8px;" />
            </div>

            <div class="placa-contacts">
              <div class="contact-item">📞 ${telefone}</div>
              <div class="contact-item">💬 WhatsApp: ${whatsapp}</div>
            </div>

            <div style="font-size: 18px; font-weight: 800; padding-bottom: 12px;">
              🌐 ${site}
            </div>

            ${showLogoOnPlaca && placaLogoUrl && placaLogoPosition === 'RODAPE' ? `
              <div style="padding-bottom: 10px;">
                <img src="${placaLogoUrl}" style="max-height: 40px; max-width: 180px; object-fit: contain;" alt="Logo Imobiliária" />
              </div>
            ` : ''}

            <div class="placa-footer">
              REF: ${propertyCode} • ${creci} • FORMATO: ${selectedDimensao.label} (${selectedDimensao.materialSugerido})
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Real Canvas Download in High Resolution (Includes real Logo if enabled)
  const handleDownloadPlacaImage = () => {
    setIsDownloading(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // Background
    ctx.fillStyle = selectedPaleta.bgBody;
    ctx.fillRect(0, 0, 1200, 1600);

    // Header Background
    ctx.fillStyle = selectedPaleta.bgHeader;
    ctx.fillRect(0, 0, 1200, 390);

    const finishCanvasExport = (loadedLogo?: HTMLImageElement) => {
      // 1. Logo in Header
      if (loadedLogo && showLogoOnPlaca && placaLogoPosition === 'HEADER') {
        const logoW = placaLogoSize === 'PEQUENO' ? 240 : placaLogoSize === 'MEDIO' ? 340 : 440;
        const logoH = placaLogoSize === 'PEQUENO' ? 70 : placaLogoSize === 'MEDIO' ? 95 : 125;
        const logoX = 600 - (logoW / 2);
        const logoY = 35;

        if (placaLogoBg === 'BRANCO_CARD') {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(logoX - 16, logoY - 10, logoW + 32, logoH + 20, 14);
          } else {
            ctx.rect(logoX - 16, logoY - 10, logoW + 32, logoH + 20);
          }
          ctx.fill();
        }

        ctx.drawImage(loadedLogo, logoX, logoY, logoW, logoH);

        // Header Text below logo
        ctx.fillStyle = selectedPaleta.textHeader;
        ctx.font = 'bold 84px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(finalidade, 600, 310);
      } else {
        // Centered Header Text
        ctx.fillStyle = selectedPaleta.textHeader;
        ctx.font = 'bold 96px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(finalidade, 600, 240);
      }

      // 2. Tipo de Placa
      ctx.fillStyle = selectedPaleta.textBody;
      ctx.font = 'bold 50px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(activeTipoPlaca.toUpperCase(), 600, 480);

      // 3. Logo in Corpo (between type and contacts/QR)
      if (loadedLogo && showLogoOnPlaca && placaLogoPosition === 'CORPO') {
        const logoW = placaLogoSize === 'PEQUENO' ? 220 : placaLogoSize === 'MEDIO' ? 300 : 380;
        const logoH = placaLogoSize === 'PEQUENO' ? 65 : placaLogoSize === 'MEDIO' ? 85 : 110;
        const logoX = 600 - (logoW / 2);
        const logoY = 530;

        if (placaLogoBg === 'BRANCO_CARD') {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(logoX - 16, logoY - 10, logoW + 32, logoH + 20, 14);
          } else {
            ctx.rect(logoX - 16, logoY - 10, logoW + 32, logoH + 20);
          }
          ctx.fill();
        }

        ctx.drawImage(loadedLogo, logoX, logoY, logoW, logoH);
      }

      // 4. Telefone
      ctx.fillStyle = selectedPaleta.textBody;
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(`TEL: ${telefone}`, 600, 680);

      // 5. WhatsApp
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(`WHATSAPP: ${whatsapp}`, 600, 770);

      // 6. Site
      ctx.fillStyle = selectedPaleta.textBody;
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(`SITE: ${site}`, 600, 860);

      // 7. QR Code Image
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 425, 930, 350, 350);

        // 8. Logo in Rodape
        if (loadedLogo && showLogoOnPlaca && placaLogoPosition === 'RODAPE') {
          const logoW = 220;
          const logoH = 65;
          ctx.drawImage(loadedLogo, 600 - (logoW / 2), 1320, logoW, logoH);
        }

        // 9. Footer
        ctx.fillStyle = '#64748B';
        ctx.font = '30px monospace';
        ctx.fillText(`CÓD: ${propertyCode} • ${creci}`, 600, 1460);
        ctx.fillText(`FORMATO: ${selectedDimensao.label} (${selectedDimensao.materialSugerido})`, 600, 1515);

        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `placa-${finalidade.toLowerCase().replace(/\s+/g, '-')}-${selectedDimensao.id}.png`;
        a.click();
        setIsDownloading(false);
      };
      qrImg.onerror = () => {
        setIsDownloading(false);
        window.open(qrCodeImgUrl, '_blank');
      };
      qrImg.src = qrCodeImgUrl;
    };

    // Preload Logo if enabled
    if (showLogoOnPlaca && placaLogoUrl) {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => finishCanvasExport(logoImg);
      logoImg.onerror = () => finishCanvasExport();
      logoImg.src = placaLogoUrl;
    } else {
      finishCanvasExport();
    }
  };

  // Copy Specs for Graphic Shop
  const handleCopyGraphicSpecs = () => {
    const text = `*ESPECIFICAÇÕES PARA CONFECÇÃO DE PLACA IMOBILIÁRIA*\n` +
      `• Finalidade: ${finalidade}\n` +
      `• Tipo de Imóvel: ${activeTipoPlaca}\n` +
      `• Logotipo da Imobiliária: ${showLogoOnPlaca ? (placaLogoUrl ? `Sim (Posição: ${placaLogoPosition})` : 'Sim (Logo Oficial)') : 'Sem logotipo'}\n` +
      `• Dimensão: ${selectedDimensao.label} (${selectedDimensao.larguraCm}cm de largura × ${selectedDimensao.alturaCm}cm de altura)\n` +
      `• Material Recomendado: ${selectedDimensao.materialSugerido}\n` +
      `• Aplicação: ${selectedDimensao.aplicacao}\n` +
      `• Telefone: ${telefone}\n` +
      `• WhatsApp: ${whatsapp}\n` +
      `• Site: ${site}\n` +
      `• CRECI: ${creci}\n` +
      `• Código do Imóvel: ${propertyCode}\n` +
      `• Link do QR Code: ${trackingUrl}`;

    navigator.clipboard?.writeText(text);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2500);
  };

  const handleGenerateAiBrandCopy = async () => {
    setIsGeneratingCopy(true);
    const copy = await generatePropertyDescription({
      type: activeTipoPlaca,
      neighborhood: 'Jardins / Faria Lima, São Paulo',
      bedrooms: 3,
      suites: 3,
      m2: 185,
      amenities: ['Prédio Corporativo AAA', 'Estacionamento com Valet', 'Gerador Full', 'Segurança 24h'],
      price: 2890000,
    });
    setGeneratedCopy(copy);
    setIsGeneratingCopy(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-heading">
              Hub de Identidade de Marca & Confecção de Placas
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 rounded-full border border-blue-200">
              Padrão Corporativo Oficial
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gere placas imobiliárias físicas profissionais com logotipo, QR Code inteligente, telefones e tamanhos oficiais para gráfica.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Configurações da Placa Imobiliária
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Pronto para Impressão
              </span>
            </div>

            {/* 1. Finalidade (Venda / Locação / Vende ou Aluga) */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold text-xs block">
                Finalidade Principal
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['VENDE-SE', 'ALUGA-SE', 'VENDE OU ALUGA', 'LANÇAMENTO', 'OPORTUNIDADE'] as PlacaFinalidade[]).map((fin) => (
                  <button
                    key={fin}
                    type="button"
                    onClick={() => setFinalidade(fin)}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      finalidade === fin
                        ? 'bg-blue-600 text-white shadow-xs scale-102'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {fin}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Tipo de Placa Selecionada */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-bold text-xs block">
                  Tipo de Imóvel / Placa Selecionada
                </label>
                <button
                  type="button"
                  onClick={() => setIsTipoCustom(!isTipoCustom)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                >
                  {isTipoCustom ? 'Selecionar da Lista' : 'Digitar Personalizado'}
                </button>
              </div>

              {isTipoCustom ? (
                <input
                  type="text"
                  placeholder="Ex: Venda de Salas Comerciais, Aluguel de Galpão..."
                  value={tipoPersonalizado}
                  onChange={(e) => setTipoPersonalizado(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold text-xs"
                />
              ) : (
                <select
                  value={tipoPlaca}
                  onChange={(e) => setTipoPlaca(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold text-xs bg-white"
                >
                  {PLACA_TIPOS_IMOVEL.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              )}
            </div>

            {/* 3. Tamanhos & Dimensões Gráficas */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold text-xs block">
                Formato & Dimensão para Gráfica
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PLACA_DIMENSOES.map((dim) => (
                  <button
                    key={dim.id}
                    type="button"
                    onClick={() => setDimensaoId(dim.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      dimensaoId === dim.id
                        ? 'border-blue-600 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-slate-900">{dim.label}</span>
                      <span className="text-[10px] text-blue-700 font-bold">{dim.materialSugerido}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{dim.aplicacao}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Paleta Visual */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold text-xs block">
                Paleta de Cores da Placa
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PLACA_PALETAS.map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setPaletaId(pal.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      paletaId === pal.id
                        ? 'border-slate-900 bg-slate-50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: pal.bgHeader }} />
                    <span className="text-[11px] font-bold text-slate-800 truncate">{pal.name.split('&')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Opções do Logotipo da Imobiliária na Placa */}
            <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Logotipo da Imobiliária na Placa
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLogoOnPlaca}
                    onChange={(e) => setShowLogoOnPlaca(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-[11px] font-bold text-slate-700">
                    {showLogoOnPlaca ? 'Exibir na Placa' : 'Ocultar'}
                  </span>
                </label>
              </div>

              {showLogoOnPlaca && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  {/* Visualização e Ações do Logotipo */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="w-28 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1.5 shadow-2xs">
                      {placaLogoUrl ? (
                        <img
                          src={placaLogoUrl}
                          alt="Logo da Imobiliária"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-[10px] text-slate-400 font-bold leading-tight">
                          Sem Logo<br />Configurado
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{placaLogoUrl ? 'Substituir Logotipo' : 'Enviar Imagem do Logotipo'}</span>
                        </button>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />

                        {(defaultLogoUrl || currentTenant?.logoUrl) && placaLogoUrl !== (defaultLogoUrl || currentTenant?.logoUrl) && (
                          <button
                            type="button"
                            onClick={() => setPlacaLogoUrl(defaultLogoUrl || currentTenant?.logoUrl || '')}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Restaurar logotipo oficial cadastrado na imobiliária"
                          >
                            <RefreshCw className="w-3 h-3 text-slate-500" />
                            <span>Restaurar Oficial</span>
                          </button>
                        )}

                        {placaLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setPlacaLogoUrl('')}
                            className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Remover logotipo da placa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remover</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Aceita PNG, SVG ou JPG em alta resolução. Otimizado para gráficas e corte em chapa.
                      </p>
                    </div>
                  </div>

                  {/* Posição do Logotipo */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Posição do Logotipo na Placa
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'HEADER', label: 'Cabeçalho (Topo)' },
                        { id: 'CORPO', label: 'Centro (Acima QR)' },
                        { id: 'RODAPE', label: 'Rodapé (Contatos)' }
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => setPlacaLogoPosition(pos.id as any)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer ${
                            placaLogoPosition === pos.id
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tamanho e Estilo do Fundo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Tamanho da Logo
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['PEQUENO', 'MEDIO', 'GRANDE'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setPlacaLogoSize(sz)}
                            className={`py-1 rounded-lg font-bold text-center transition-all cursor-pointer ${
                              placaLogoSize === sz
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {sz === 'PEQUENO' ? 'Pequeno' : sz === 'MEDIO' ? 'Médio' : 'Grande'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Caixa de Fundo da Logo
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setPlacaLogoBg('BRANCO_CARD')}
                          className={`py-1 rounded-lg font-bold text-center transition-all cursor-pointer ${
                            placaLogoBg === 'BRANCO_CARD'
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Caixa Branca
                        </button>
                        <button
                          type="button"
                          onClick={() => setPlacaLogoBg('TRANSPARENTE')}
                          className={`py-1 rounded-lg font-bold text-center transition-all cursor-pointer ${
                            placaLogoBg === 'TRANSPARENTE'
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Transparente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Dados de Contato e Identificação */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefone Comercial</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp de Plantão</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Site Oficial</label>
                <input
                  type="text"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CRECI Oficial</label>
                <input
                  type="text"
                  value={creci}
                  onChange={(e) => setCreci(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Código do Imóvel para QR Code</label>
                <input
                  type="text"
                  value={propertyCode}
                  onChange={(e) => setPropertyCode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlePrintPlaca}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Placa</span>
              </button>

              <button
                type="button"
                disabled={isDownloading}
                onClick={handleDownloadPlacaImage}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-spin' : ''}`} />
                <span>Baixar Arte (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyGraphicSpecs}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Copiar texto técnico para enviar no WhatsApp da gráfica"
              >
                {copiedSpec ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSpec ? 'Copiado!' : 'Ordem para Gráfica'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Placa Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-400" />
                Pré-visualização Física em Escala
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {selectedDimensao.label}
              </span>
            </div>

            {/* The Visual Sign Board Component */}
            <div 
              className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700 flex flex-col text-center relative"
              style={{ backgroundColor: selectedPaleta.bgBody, color: selectedPaleta.textBody }}
            >
              {/* Corner Eyelets (Ilhoses gráficos) */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-slate-200 shadow-inner z-10" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-slate-200 shadow-inner z-10" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-slate-200 shadow-inner z-10" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-slate-200 shadow-inner z-10" />

              {/* Sign Header */}
              <div 
                className="py-5 px-4 shadow-md font-black tracking-wider uppercase flex flex-col items-center justify-center"
                style={{ backgroundColor: selectedPaleta.bgHeader, color: selectedPaleta.textHeader }}
              >
                {/* Logo in Header */}
                {showLogoOnPlaca && placaLogoUrl && placaLogoPosition === 'HEADER' && (
                  <div className={`mb-2.5 p-1.5 rounded-xl flex items-center justify-center ${
                    placaLogoBg === 'BRANCO_CARD' ? 'bg-white shadow-sm border border-black/10' : ''
                  }`}>
                    <img
                      src={placaLogoUrl}
                      alt="Logotipo Imobiliária"
                      className={`object-contain ${
                        placaLogoSize === 'PEQUENO' ? 'h-7 sm:h-8 max-w-[140px]' :
                        placaLogoSize === 'MEDIO' ? 'h-9 sm:h-11 max-w-[180px]' :
                        'h-12 sm:h-14 max-w-[220px]'
                      }`}
                    />
                  </div>
                )}
                <span className="text-2xl sm:text-3xl leading-tight">
                  {finalidade}
                </span>
              </div>

              {/* Subtitle / Property Type */}
              <div className="py-2.5 px-3 font-extrabold text-sm sm:text-base uppercase tracking-wide border-b border-black/10">
                {activeTipoPlaca}
              </div>

              {/* Logo in Corpo (above QR) */}
              {showLogoOnPlaca && placaLogoUrl && placaLogoPosition === 'CORPO' && (
                <div className="pt-3 pb-1 flex justify-center">
                  <div className={`p-1.5 rounded-xl flex items-center justify-center ${
                    placaLogoBg === 'BRANCO_CARD' ? 'bg-white shadow-xs border border-slate-200' : ''
                  }`}>
                    <img
                      src={placaLogoUrl}
                      alt="Logotipo Imobiliária"
                      className={`object-contain ${
                        placaLogoSize === 'PEQUENO' ? 'h-7 max-w-[130px]' :
                        placaLogoSize === 'MEDIO' ? 'h-10 max-w-[170px]' :
                        'h-13 max-w-[210px]'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Center Zone: QR Code & Brand */}
              <div className="p-4 flex flex-col items-center justify-center space-y-2">
                <div className="p-2 bg-white rounded-xl shadow-md border border-slate-200">
                  <img
                    src={qrCodeImgUrl}
                    alt="QR Code"
                    className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Aponte a câmera para ficha completa & fotos
                </span>
              </div>

              {/* Contact Area */}
              <div className="p-3 bg-black/5 border-t border-black/10 space-y-1">
                <div className="flex items-center justify-center gap-2 font-black text-base sm:text-lg">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{telefone}</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 font-black text-sm text-emerald-600">
                  <MessageCircle className="w-4 h-4 fill-emerald-600 text-white shrink-0" />
                  <span>{whatsapp}</span>
                </div>

                <div className="text-[11px] font-bold text-slate-600 pt-1">
                  🌐 {site}
                </div>

                {/* Logo in Rodapé */}
                {showLogoOnPlaca && placaLogoUrl && placaLogoPosition === 'RODAPE' && (
                  <div className="pt-2 flex justify-center">
                    <img
                      src={placaLogoUrl}
                      alt="Logotipo Imobiliária"
                      className="h-8 max-w-[160px] object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Sign Footer */}
              <div className="py-2 px-3 bg-black/10 text-[9px] font-mono font-bold text-slate-500 flex items-center justify-between">
                <span>{propertyCode}</span>
                <span>{creci}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed text-center pt-2">
              Arte vetorizada pronta com marcas de sangria para envio direto para gráficas de comunicação visual.
            </div>
          </div>

          {/* AI Copywriter Section (100% Portuguese, No Arbo/Supremo) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Gerador de Anúncio Blindado com a Marca
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Gera a copy para portais e Instagram sincronizada com o tipo de placa selecionada ({activeTipoPlaca}).
            </p>

            <button
              type="button"
              onClick={handleGenerateAiBrandCopy}
              disabled={isGeneratingCopy}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
              <span>{isGeneratingCopy ? 'Criando anúncio...' : 'Gerar Anúncio da Placa'}</span>
            </button>

            {generatedCopy && (
              <div className="space-y-2 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-800 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed font-sans">
                  {generatedCopy}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(generatedCopy);
                    setCopiedCopy(true);
                    setTimeout(() => setCopiedCopy(false), 2000);
                  }}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedCopy ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCopy ? 'Copy Copiada!' : 'Copiar Texto'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

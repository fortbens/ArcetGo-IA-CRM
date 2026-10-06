import React, { useState } from 'react';
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
  Sliders 
} from 'lucide-react';
import { BRAND_EQUITY_CONFIG } from '../../data/mockData';
import { generatePropertyDescription } from '../../services/aiService';

export const BrandEquityView: React.FC = () => {
  const [config, setConfig] = useState(BRAND_EQUITY_CONFIG);
  const [propertyCode, setPropertyCode] = useState('ACG-8942');
  const [propertyTitle, setPropertyTitle] = useState('Apartamento Jardins de Monet 185m²');
  const [qrSize, setQrSize] = useState<'PLACA_VENDE_SE' | 'POST_INSTAGRAM' | 'FOLHETO'>('PLACA_VENDE_SE');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic QR Code pointing to tracking landing page with auto roleta attribution
  const trackingUrl = `https://acertgo.com.br/imovel/${propertyCode}?utm_source=placa_fisica_qr&roleta=auto`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(trackingUrl)}`;

  const handleGenerateAiBrandCopy = async () => {
    setIsGeneratingCopy(true);
    const copy = await generatePropertyDescription({
      type: 'Apartamento Alto Padrão',
      neighborhood: 'Jardins, São Paulo',
      bedrooms: 3,
      suites: 3,
      m2: 185,
      amenities: ['Varanda Gourmet Integrada', '3 Vagas Privativas', 'Piscina com Raia Aquecida', 'Academia Cia Athletica'],
      price: 2890000,
    });
    setGeneratedCopy(copy);
    setIsGeneratingCopy(false);
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText(generatedCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Hub de Brand Equity & MKT Inteligente
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 rounded-full">
              Arbo / Supremo Style
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Trava corporativa de paleta, tipografia e diretrizes de copy: corretores só produzem materiais dentro da régua de marca
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Left: Locked Brand Rules Configuration (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Régua de Marca Travada
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Imutável por Corretores
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1 font-medium">Cores Oficiais da Imobiliária</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="w-4 h-4 rounded-full bg-[#0056D2]"></span>
                  <span className="font-mono text-[11px] font-bold text-slate-700">#0056D2 (Azul)</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="w-4 h-4 rounded-full bg-[#00C896]"></span>
                  <span className="font-mono text-[11px] font-bold text-slate-700">#00C896 (Tech)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-medium">Tipografias Padronizadas</label>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Títulos:</span>
                  <span className="font-bold text-slate-900 font-heading">Poppins SemiBold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Corpo & Anúncios:</span>
                  <span className="font-bold text-slate-900">Outfit Regular</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-medium">Regras de Copy Obrigatórias</label>
              <ul className="space-y-1.5">
                {config.allowedPhrasingRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-[10px] text-slate-500 font-mono">
              <strong className="block text-slate-700 mb-0.5">Disclaimer Legal Obrigatório:</strong>
              {config.mandatoryDisclaimer}
            </div>
          </div>
        </div>

        {/* 2. Center: Dynamic Placa QR Code Generator (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <QrCode className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Gerador de QR Code Dinâmico para Placas
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Código do Imóvel</label>
              <input
                type="text"
                value={propertyCode}
                onChange={(e) => setPropertyCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1">Tipo de Aplicação Física</label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="PLACA_VENDE_SE">Placa Física de Fachada (Alucobond 90x60cm)</option>
                <option value="POST_INSTAGRAM">Card Digital para Instagram / Stories</option>
                <option value="FOLHETO">Folheto de Bairro / Mala Direta</option>
              </select>
            </div>

            {/* Generated Placa Preview */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center space-y-2 text-center shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                VENDE-SE · ACERTGO IMÓVEIS
              </span>
              <img
                src={qrCodeImgUrl}
                alt="QR Code Placa"
                className="w-36 h-36 p-2 bg-white rounded-xl shadow-xs"
              />
              <span className="text-[10px] text-slate-300">
                Aponte a câmera para ficha completa & agendamento com corretor de plantão
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {propertyCode} · CRECI 34982-J
              </span>
            </div>

            <button
              onClick={() => window.open(qrCodeImgUrl, '_blank')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arte Vetorizada para Gráfica</span>
            </button>
          </div>
        </div>

        {/* 3. Right: AcertAI Auto-Copywriter under Brand Rules (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Gerador de Copy com Brand Equity
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Gera anúncios para Zap, VivaReal e Instagram respeitando a voz sofisticada da AcertGo.
            </p>

            <button
              onClick={handleGenerateAiBrandCopy}
              disabled={isGeneratingCopy}
              className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
              <span>{isGeneratingCopy ? 'Escrevendo nos padrões...' : 'Gerar Anúncio Blindado'}</span>
            </button>

            {generatedCopy && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 max-h-60 overflow-y-auto whitespace-pre-line leading-relaxed font-sans">
                {generatedCopy}
              </div>
            )}
          </div>

          {generatedCopy && (
            <button
              onClick={handleCopyText}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copy Copiada!' : 'Copiar Texto Pronto'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

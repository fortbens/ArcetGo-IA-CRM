import React, { useState, useRef, useEffect } from 'react';
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Maximize2,
  Sparkles,
  Info,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  targetType: 'LOGO' | 'FAVICON' | 'SIDEBAR_ICON';
  onApplyCrop: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  targetType,
  onApplyCrop
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [aspectPreset, setAspectPreset] = useState<'4:1' | '1:1' | 'FREE'>(
    targetType === 'FAVICON' || targetType === 'SIDEBAR_ICON' ? '1:1' : '4:1'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Recommendations metadata
  const recommendedConfig = {
    LOGO: {
      title: 'Ajuste do Logotipo Principal',
      recommendedSize: '250 × 60 px (proporção 4:1 a 5:1)',
      hint: 'Ideal para cabeçalho e topo do sistema. Fundo transparente PNG ou SVG recomendado.',
      aspect: '4:1',
      outputWidth: 500,
      outputHeight: 125
    },
    FAVICON: {
      title: 'Ajuste do Favicon do Navegador',
      recommendedSize: '32 × 32 px ou 64 × 64 px (proporção quadrada 1:1)',
      hint: 'Ícone que aparece na aba do navegador e nos favoritos. Use símbolo de alto contraste.',
      aspect: '1:1',
      outputWidth: 128,
      outputHeight: 128
    },
    SIDEBAR_ICON: {
      title: 'Ajuste do Ícone da Barra Lateral',
      recommendedSize: '64 × 64 px (proporção quadrada 1:1)',
      hint: 'Exibido no menu lateral recolhido e no topo mobile.',
      aspect: '1:1',
      outputWidth: 128,
      outputHeight: 128
    }
  }[targetType];

  // Load image
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      renderPreview();
    };
  }, [imageUrl]);

  // Re-render when parameters change
  useEffect(() => {
    if (imageRef.current) {
      renderPreview();
    }
  }, [zoom, rotation, offsetX, offsetY, aspectPreset]);

  const renderPreview = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetW = 400;
    let targetH = aspectPreset === '1:1' ? 400 : aspectPreset === '4:1' ? 100 : 250;

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.clearRect(0, 0, targetW, targetH);

    // Save state
    ctx.save();

    // Center and rotate
    ctx.translate(targetW / 2 + offsetX, targetH / 2 + offsetY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered
    const imgAspect = img.width / img.height;
    let drawW = targetW;
    let drawH = targetW / imgAspect;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    // Restore state
    ctx.restore();
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsProcessing(true);

    try {
      // Export high-quality PNG
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      onApplyCrop(dataUrl);
      onClose();
    } catch (err) {
      console.error('Erro ao recortar imagem:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{recommendedConfig.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {aspectPreset}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ajuste zoom, posição e recorte para o enquadramento perfeito.
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

        {/* Recommended size notification pill */}
        <div className="bg-blue-50/80 px-5 py-2.5 border-b border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Medida Recomendada:</strong> {recommendedConfig.recommendedSize}.{' '}
            <span className="text-blue-700">{recommendedConfig.hint}</span>
          </div>
        </div>

        {/* Body Canvas Preview */}
        <div className="p-6 bg-slate-100/70 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div
            className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200/80 max-w-full overflow-hidden flex items-center justify-center"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          >
            <canvas
              ref={canvasRef}
              className="rounded-lg shadow-sm border border-slate-300/60 max-w-full h-auto bg-transparent"
            />
          </div>

          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Pré-visualização em tempo real do recorte aplicado
          </div>
        </div>

        {/* Controls */}
        <div className="p-5 bg-white border-t border-slate-200 space-y-4">
          {/* Proportions Presets */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-700">Proporção do Recorte:</span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAspectPreset('4:1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  aspectPreset === '4:1'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4:1 (Logo Header)
              </button>
              <button
                type="button"
                onClick={() => setAspectPreset('1:1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  aspectPreset === '1:1'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1:1 (Favicon / Quadrado)
              </button>
              <button
                type="button"
                onClick={() => setAspectPreset('FREE')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  aspectPreset === 'FREE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Livre
              </button>
            </div>
          </div>

          {/* Sliders: Zoom & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Zoom */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                  Zoom
                </span>
                <span>{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Deslocamento X */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Posição Horizontal (X)</span>
                <span>{offsetX}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="1"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Deslocamento Y */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Posição Vertical (Y)</span>
                <span>{offsetY}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Buttons: Rotate & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Girar 90°
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Redefinir
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Recorte & Salvar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

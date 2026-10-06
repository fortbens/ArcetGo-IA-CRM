import React, { useState, useRef } from 'react';
import { Upload, Link2, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  helperText?: string;
  aspect?: 'avatar' | 'landscape' | 'square';
  placeholderText?: string;
  name?: string;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Foto / Imagem',
  value = '',
  onChange,
  helperText,
  aspect = 'avatar',
  placeholderText = 'Selecione uma imagem do seu dispositivo ou insira a URL',
  name,
  required = false
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('O arquivo selecionado não é uma imagem válida (PNG, JPG, WEBP).');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('A imagem deve ter no máximo 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        onChange(base64);
        setUrlInput(base64);
      }
    };
    reader.onerror = () => {
      setFileError('Erro ao carregar o arquivo de imagem.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setFileError(null);
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        
        {/* Toggle between Upload and URL */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
              mode === 'upload'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
              mode === 'url'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Hidden input to bind form data if name provided */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Main Container */}
      <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
        
        {/* Preview Container */}
        <div className="relative shrink-0">
          {value ? (
            <div className={`overflow-hidden border-2 border-indigo-500/40 shadow-xs relative group bg-white ${
              aspect === 'avatar' 
                ? 'w-16 h-16 rounded-full' 
                : aspect === 'square'
                ? 'w-16 h-16 rounded-xl'
                : 'w-24 h-16 rounded-xl'
            }`}>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-0 bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                title="Remover Imagem"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          ) : (
            <div className={`border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-100 text-slate-400 ${
              aspect === 'avatar' 
                ? 'w-16 h-16 rounded-full' 
                : aspect === 'square'
                ? 'w-16 h-16 rounded-xl'
                : 'w-24 h-16 rounded-xl'
            }`}>
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {mode === 'upload' ? (
            <div>
              {/* Drag and Drop / File Input Clickable Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer px-3 py-2 rounded-xl border border-dashed transition-all flex items-center justify-between gap-2 ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-700' 
                    : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {value ? 'Substituir arquivo do PC/Celular' : 'Clique para fazer Upload'}
                  </span>
                </div>

                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
                  Procurar
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={handleUrlApply}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlApply();
                  }
                }}
                placeholder="https://exemplo.com/foto.jpg"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleUrlApply}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-2xs"
              >
                Aplicar
              </button>
            </div>
          )}

          {/* Helper or error info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span className="truncate">
              {helperText || placeholderText}
            </span>
            {value && (
              <span className="text-emerald-600 font-bold inline-flex items-center gap-1 shrink-0 ml-2">
                <CheckCircle2 className="w-3 h-3" />
                Imagem Carregada
              </span>
            )}
          </div>

          {fileError && (
            <div className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

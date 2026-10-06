/**
 * Utilitário de Otimização e Compressão Inteligente de Imagens
 * Redimensiona e comprime automaticamente fotos da equipe, logos e avatares
 * para garantir sincronização instantânea no Firestore e evitar estouro de cota (QuotaExceededError).
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 a 1.0 (padrão: 0.82)
  outputFormat?: 'image/jpeg' | 'image/webp' | 'image/png';
}

/**
 * Converte um File ou Blob para DataURL Base64 otimizado
 */
export async function optimizeImageFile(
  file: File | Blob,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.82,
    outputFormat = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem'));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('DataURL inválido'));
        return;
      }

      // Se for SVG, não precisa redimensionar em canvas
      if (file.type === 'image/svg+xml' || src.startsWith('data:image/svg+xml')) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular escala preservando proporção
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src); // fallback
          return;
        }

        // Fundo branco se converter PNG transparente para JPEG
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL(outputFormat, quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Comprime um DataURL existente se ele for muito grande (> 200KB)
 */
export async function compressExistingDataUrl(
  dataUrl: string,
  options: OptimizeImageOptions = {}
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }
  // Se for SVG, manter intacto
  if (dataUrl.startsWith('data:image/svg+xml')) {
    return dataUrl;
  }
  // Se for pequeno (< 150KB), não precisa recomprimir
  if (dataUrl.length < 150000) {
    return dataUrl;
  }

  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.80,
    outputFormat = 'image/jpeg'
  } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL(outputFormat, quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

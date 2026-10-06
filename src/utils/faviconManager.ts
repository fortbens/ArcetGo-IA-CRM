/**
 * Favicon & Visual Identity Browser Tab Manager
 * Gerencia a atualização dinâmica do favicon no navegador e conversão de arquivos para Data URLs.
 */

export const updateBrowserFavicon = (url: string) => {
  if (!url || typeof document === 'undefined') return;
  try {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    
    // Configura tipo se for SVG ou PNG
    if (url.startsWith('data:image/svg') || url.endsWith('.svg')) {
      link.type = 'image/svg+xml';
    } else if (url.startsWith('data:image/png') || url.endsWith('.png')) {
      link.type = 'image/png';
    } else {
      link.type = 'image/x-icon';
    }
    
    link.href = url;
  } catch (e) {
    console.error('Erro ao atualizar favicon no navegador:', e);
  }
};

export const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Falha ao converter arquivo em Base64 Data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

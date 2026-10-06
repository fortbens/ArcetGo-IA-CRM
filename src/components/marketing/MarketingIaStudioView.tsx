import React, { useState, useMemo, useRef } from 'react';
import {
  Sparkles,
  Share2,
  Calendar,
  Layers,
  Image as ImageIcon,
  Video,
  Copy,
  Check,
  Send,
  Download,
  Plus,
  Clock,
  Play,
  Pause,
  Sliders,
  Eye,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Building,
  DollarSign,
  TrendingUp,
  Tag,
  Zap,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Smartphone,
  Flame,
  Globe,
  Camera,
  Music,
  Upload,
  Link as LinkIcon,
  Search,
  Scissors,
  Youtube,
  Key,
  Shield,
  X
} from 'lucide-react';
import { RealEstateProperty } from '../../types/crm';
import { 
  MarketingPostFormat, 
  CreativeTemplateTheme, 
  CreativeBadgeTag, 
  CopyToneType, 
  ScheduledPost, 
  MetaConnectionStatus, 
  VideoReelsClip,
  MetaApiConfig
} from '../../types/marketingIa';
import { 
  INITIAL_META_CONNECTION, 
  INITIAL_SCHEDULED_POSTS, 
  PRESET_REELS_CLIPS 
} from '../../data/mockMarketingIaData';
import { MetaApiConfigModal } from './MetaApiConfigModal';
import { DirectPublishModal } from './DirectPublishModal';

interface MarketingIaStudioViewProps {
  properties: RealEstateProperty[];
  onSchedulePost?: (post: ScheduledPost) => void;
}

type MarketingSubTab = 
  | 'creative_studio' 
  | 'ai_copywriter' 
  | 'reels_video_studio' 
  | 'content_calendar';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const MarketingIaStudioView: React.FC<MarketingIaStudioViewProps> = ({
  properties = [],
  onSchedulePost
}) => {
  const [activeTab, setActiveTab] = useState<MarketingSubTab>('creative_studio');

  // Property Search & Selection
  const [propertySearchQuery, setPropertySearchQuery] = useState<string>('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    properties[0]?.id || 'prop_01'
  );

  // Creative Studio state
  const [postFormat, setPostFormat] = useState<MarketingPostFormat>('FEED_1_1');
  const [templateTheme, setTemplateTheme] = useState<CreativeTemplateTheme>('LUXURY_DARK');
  const [badgeTag, setBadgeTag] = useState<CreativeBadgeTag>('EXCLUSIVIDADE');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [customHeadline, setCustomHeadline] = useState<string>('');
  const [customPriceText, setCustomPriceText] = useState<string>('');
  const [showCreciBadge, setShowCreciBadge] = useState<boolean>(true);
  const [photoFilter, setPhotoFilter] = useState<'NORMAL' | 'CONTRAST' | 'WARM_GOLD' | 'DRAMA_HDR' | 'BW'>('NORMAL');

  // Custom Image Uploads
  const [uploadedCustomPhotos, setUploadedCustomPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'
  ]);
  const [isUsingCustomImage, setIsUsingCustomImage] = useState<boolean>(false);
  const [activeCustomPhotoUrl, setActiveCustomPhotoUrl] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Carousel specific state
  const [carouselActiveSlide, setCarouselActiveSlide] = useState<number>(0);

  // AI Copywriter state
  const [copyTone, setCopyTone] = useState<CopyToneType>('LUXURY');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [generatedCaption, setGeneratedCaption] = useState<string>('');

  // Video Reels Studio state
  const [videoSourceMode, setVideoSourceMode] = useState<'PRESET_CLIPS' | 'YOUTUBE_URL'>('YOUTUBE_URL');
  const [youtubeUrlInput, setYoutubeUrlInput] = useState<string>('https://www.youtube.com/watch?v=ScMzIvxBSi4');
  const [activeYoutubeId, setActiveYoutubeId] = useState<string>('ScMzIvxBSi4');
  const [youtubeStartSec, setYoutubeStartSec] = useState<number>(15);
  const [youtubeEndSec, setYoutubeEndSec] = useState<number>(45);
  const [youtubeTitleOverlay, setYoutubeTitleOverlay] = useState<string>('TOUR EXCLUSIVO 9:16');
  const [isProcessingCut, setIsProcessingCut] = useState<boolean>(false);
  const [cutProgress, setCutProgress] = useState<number>(0);
  const [isCutReady, setIsCutReady] = useState<boolean>(false);

  const [selectedClipId, setSelectedClipId] = useState<string>(PRESET_REELS_CLIPS[0].id);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(6);

  // Calendar & Meta state
  const [metaConnection, setMetaConnection] = useState<MetaConnectionStatus>(INITIAL_META_CONNECTION);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Modals state
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isDirectPublishModalOpen, setIsDirectPublishModalOpen] = useState<boolean>(false);
  const [directPublishPayload, setDirectPublishPayload] = useState<any>(null);

  // Normalizer helper for CRM RealEstateProperty
  const normalizeProperty = (p?: RealEstateProperty) => {
    if (!p) {
      return {
        id: 'prop_fallback',
        code: 'AP-101',
        title: 'Cobertura Penthouse Jardins Sky Lounge',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        salePrice: 12500000,
        rentalPrice: 0,
        usefulArea: 680,
        bedrooms: 4,
        suites: 4,
        parkingSpots: 6,
        photos: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80'
        ]
      };
    }
    const photoUrls = (p.images && p.images.length > 0)
      ? p.images.map(img => (typeof img === 'string' ? img : (img as any).url || '')).filter(Boolean)
      : [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
        ];

    return {
      id: p.id,
      code: p.code || 'IMO-101',
      title: p.title || 'Imóvel Exclusivo',
      neighborhood: p.address?.neighborhood || 'Jardins',
      city: p.address?.city || 'São Paulo',
      state: p.address?.state || 'SP',
      salePrice: p.pricing?.salePrice || 0,
      rentalPrice: p.pricing?.rentPrice || 0,
      usefulArea: p.specs?.usableAreaM2 || p.specs?.totalAreaM2 || 140,
      bedrooms: p.specs?.bedrooms || 3,
      suites: p.specs?.suites || 1,
      parkingSpots: p.specs?.parkingSpaces || 2,
      photos: photoUrls.length > 0 ? photoUrls : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'
      ]
    };
  };

  // Filtered properties based on Search Query (Code, Title, Neighborhood)
  const filteredProperties = useMemo(() => {
    if (!propertySearchQuery.trim()) return properties;
    const query = propertySearchQuery.toLowerCase().trim();
    return properties.filter(p => {
      const codeMatch = p.code && p.code.toLowerCase().includes(query);
      const titleMatch = p.title && p.title.toLowerCase().includes(query);
      const neighborhoodMatch = p.address?.neighborhood && p.address.neighborhood.toLowerCase().includes(query);
      const cityMatch = p.address?.city && p.address.city.toLowerCase().includes(query);
      return codeMatch || titleMatch || neighborhoodMatch || cityMatch;
    });
  }, [properties, propertySearchQuery]);

  // Find active property
  const activeProperty = useMemo(() => {
    const raw = properties.find(p => p.id === selectedPropertyId) || properties[0];
    return normalizeProperty(raw);
  }, [properties, selectedPropertyId]);

  // Active Photo URL (supports custom uploads or property gallery)
  const activePhotoUrl = useMemo(() => {
    if (isUsingCustomImage && activeCustomPhotoUrl) {
      return activeCustomPhotoUrl;
    }
    return activeProperty.photos?.[selectedImageIndex] || activeProperty.photos?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80';
  }, [isUsingCustomImage, activeCustomPhotoUrl, activeProperty, selectedImageIndex]);

  // Format price helper
  const formattedPrice = useMemo(() => {
    if (customPriceText) return customPriceText;
    if (activeProperty.salePrice && activeProperty.salePrice > 0) {
      return `R$ ${activeProperty.salePrice.toLocaleString('pt-BR')}`;
    }
    if (activeProperty.rentalPrice && activeProperty.rentalPrice > 0) {
      return `R$ ${activeProperty.rentalPrice.toLocaleString('pt-BR')}/mês`;
    }
    return 'Consulte o Valor';
  }, [customPriceText, activeProperty]);

  // Generate headline helper
  const displayHeadline = customHeadline || activeProperty.title;

  // Custom Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setUploadedCustomPhotos(prev => [result, ...prev]);
          setIsUsingCustomImage(true);
          setActiveCustomPhotoUrl(result);
          setActionSuccessToast('Imagem própria carregada com sucesso para edição!');
          setTimeout(() => setActionSuccessToast(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomUrl = () => {
    if (customUrlInput.trim().startsWith('http')) {
      setUploadedCustomPhotos(prev => [customUrlInput.trim(), ...prev]);
      setIsUsingCustomImage(true);
      setActiveCustomPhotoUrl(customUrlInput.trim());
      setCustomUrlInput('');
      setShowUrlInput(false);
      setActionSuccessToast('Imagem por link adicionada com sucesso!');
      setTimeout(() => setActionSuccessToast(null), 3000);
    }
  };

  // YouTube Video Cut Handler
  const handleLoadYouTubeUrl = () => {
    const id = extractYouTubeId(youtubeUrlInput);
    if (id) {
      setActiveYoutubeId(id);
      setIsCutReady(false);
      setActionSuccessToast('Vídeo do YouTube carregado no Studio de Cortes!');
      setTimeout(() => setActionSuccessToast(null), 3000);
    } else {
      setActionSuccessToast('Link do YouTube inválido. Cole a URL completa do vídeo.');
      setTimeout(() => setActionSuccessToast(null), 3500);
    }
  };

  const handleProcessYouTubeCut = () => {
    setIsProcessingCut(true);
    setCutProgress(15);
    setIsCutReady(false);

    const interval = setInterval(() => {
      setCutProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessingCut(false);
            setIsCutReady(true);
            setActionSuccessToast(`Corte Reels 9:16 gerado com sucesso! Trecho: ${youtubeStartSec}s a ${youtubeEndSec}s.`);
            setTimeout(() => setActionSuccessToast(null), 4000);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  // Generate AI copy whenever property or tone changes
  const handleGenerateAiCopy = () => {
    setIsGeneratingCopy(true);
    setTimeout(() => {
      let copy = '';
      if (copyTone === 'LUXURY') {
        copy = `O privilégio de viver no ponto mais nobre de ${activeProperty.neighborhood}.\n\n`;
        copy += `Apresentamos ${activeProperty.title}: uma residência singular com ${activeProperty.usefulArea || 650}m² de área privativa, ${activeProperty.suites || 4} suítes e acabamentos de altíssimo padrão.\n\n`;
        copy += `• Living imponente com pé direito duplo e vista panorâmica\n`;
        copy += `• Varanda gourmet integrada para receber convidados\n`;
        copy += `• ${activeProperty.parkingSpots || 4} vagas de garagem demarcadas\n\n`;
        copy += `Localização reservada: ${activeProperty.neighborhood}, ${activeProperty.city}.\n`;
        copy += `Investimento: ${formattedPrice}\n\n`;
        copy += `Agende um atendimento privativo e exclusivo pelo link da bio ou chame nossa equipe no WhatsApp.`;
      } else if (copyTone === 'PERSUASIVE_SCARCITY') {
        copy = `OPORTUNIDADE EXCLUSIVA: Pouquíssimas unidades com este perfil em ${activeProperty.neighborhood}.\n\n`;
        copy += `Se você busca metragem ampla (${activeProperty.usefulArea}m²) com ${activeProperty.suites} suítes e localização premium, esta é a sua oportunidade.\n\n`;
        copy += `Diferenciais imediatos:\n`;
        copy += `- Condomínio com infraestrutura completa de lazer\n`;
        copy += `- Documentação 100% regularizada para escritura imediata\n`;
        copy += `- Valor altamente competitivo na região: ${formattedPrice}\n\n`;
        copy += `Condições especiais por tempo limitado. Envie uma mensagem direta agora mesmo para garantir prioridade de visita.`;
      } else if (copyTone === 'INVESTOR_YIELD') {
        copy = `ANÁLISE PARA INVESTIDORES: Alto potencial de valorização e rentabilidade de aluguel.\n\n`;
        copy += `Ativo imobiliário premium em ${activeProperty.neighborhood} com valor de ${formattedPrice}.\n\n`;
        copy += `Indicadores de Viabilidade:\n`;
        copy += `• Yield estimado acima de 0.65% a.m.\n`;
        copy += `• Alta liquidez e procura constante por locação corporativa\n`;
        copy += `• Metro quadrado consolidado e valorização média de +14.8% ao ano\n\n`;
        copy += `Solicite o dossiê completo de investimento com nossa mesa de negócios via WhatsApp.`;
      } else {
        copy = `O lar que sua família sempre sonhou para colecionar memórias inesquecíveis.\n\n`;
        copy += `Com ${activeProperty.usefulArea}m², ${activeProperty.bedrooms} dormitórios e muito espaço para as crianças e convivência com total tranquilidade.\n\n`;
        copy += `Comece os seus finais de semana nesta varanda gourmet, com segurança 24 horas e infraestrutura de condomínio fechado.\n\n`;
        copy += `Localização: ${activeProperty.neighborhood} - ${activeProperty.city}\n`;
        copy += `Investimento: ${formattedPrice}\n\n`;
        copy += `Venha conhecer de perto. Clique no botão de WhatsApp para agendar sua visita familiar.`;
      }

      setGeneratedCaption(copy);
      setIsGeneratingCopy(false);
    }, 500);
  };

  // Copy to clipboard
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption || displayHeadline);
    setCopiedCaption(true);
    setActionSuccessToast('Legenda copiada para a área de transferência!');
    setTimeout(() => {
      setCopiedCaption(false);
      setActionSuccessToast(null);
    }, 2500);
  };

  // Real WhatsApp sharing for Caption
  const handleSendWhatsAppCaption = () => {
    const text = encodeURIComponent(generatedCaption || displayHeadline);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Real TXT File Download for Caption
  const handleDownloadCaptionFile = () => {
    const textContent = `${displayHeadline}\n\n${generatedCaption || ''}\n\nHashtags:\n#${activeProperty.neighborhood.replace(/\s+/g, '')} #ImoveisDeLuxo #AltoPadrao #${activeProperty.city.replace(/\s+/g, '')}\n`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legenda_${activeProperty.code || 'imovel'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setActionSuccessToast('Arquivo de legenda .txt baixado com sucesso!');
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  // Real Canvas Image Export & Download
  const handleDownloadCreativeImage = () => {
    setActionSuccessToast('Renderizando imagem em alta definição 1080p...');
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = 1080;
      let height = 1080;
      if (postFormat === 'STORIES_REELS_9_16') {
        width = 1080;
        height = 1920;
      } else if (postFormat === 'CAROUSEL') {
        width = 1080;
        height = 1350;
      } else if (postFormat === 'BANNER_16_9') {
        width = 1920;
        height = 1080;
      }

      canvas.width = width;
      canvas.height = height;

      // Base background
      ctx.fillStyle = templateTheme === 'MINIMAL_LIGHT' ? '#f8fafc' : '#090d16';
      ctx.fillRect(0, 0, width, height);

      const drawOverlaysAndText = () => {
        // Gradient overlay
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        if (templateTheme === 'MINIMAL_LIGHT') {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
          grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.98)');
        } else if (templateTheme === 'SUNSET_GOLD') {
          grad.addColorStop(0, 'rgba(69, 26, 3, 0.3)');
          grad.addColorStop(0.5, 'rgba(69, 26, 3, 0.6)');
          grad.addColorStop(1, 'rgba(69, 26, 3, 0.96)');
        } else if (templateTheme === 'OPPORTUNITY_BADGE') {
          grad.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
          grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.7)');
          grad.addColorStop(1, 'rgba(15, 23, 42, 0.97)');
        } else {
          grad.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
          grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.5)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const textColor = templateTheme === 'MINIMAL_LIGHT' ? '#0f172a' : '#ffffff';
        const subTextColor = templateTheme === 'MINIMAL_LIGHT' ? '#475569' : '#cbd5e1';

        // Badge Tag Top Left
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(50, 50, 240, 50);
        ctx.fillStyle = '#090d16';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeTag, 170, 75);
        ctx.restore();

        // Watermark Top Right
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('ACERTGO IMÓVEIS', width - 50, 80);
        ctx.restore();

        // Bottom Content
        const bottomY = height - 240;

        // Headline
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = 'bold 42px sans-serif';
        ctx.textAlign = 'left';
        const headlineText = displayHeadline;
        ctx.fillText(headlineText.length > 36 ? headlineText.slice(0, 36) + '...' : headlineText, 50, bottomY);

        // Location & Specs
        ctx.fillStyle = subTextColor;
        ctx.font = '22px sans-serif';
        const locationText = `📍 ${activeProperty.neighborhood}, ${activeProperty.city} • ${activeProperty.usefulArea}m² • ${activeProperty.suites} Suítes`;
        ctx.fillText(locationText, 50, bottomY + 50);

        // Price
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(formattedPrice, 50, bottomY + 105);

        // CRECI Bar
        if (showCreciBadge) {
          ctx.fillStyle = subTextColor;
          ctx.font = '16px sans-serif';
          ctx.fillText('CRECI 198.420-J • Sujeito a alteração e disponibilidade', 50, bottomY + 155);
        }
        ctx.restore();

        // Convert and Download
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `criativo_${activeProperty.code || 'imovel'}_${postFormat.toLowerCase()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          setActionSuccessToast(`Criativo em alta resolução PNG (${width}x${height}) baixado com sucesso!`);
          setTimeout(() => setActionSuccessToast(null), 3500);
        }, 'image/png');
      };

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const hRatio = width / img.width;
          const vRatio = height / img.height;
          const ratio = Math.max(hRatio, vRatio);
          const centerShiftX = (width - img.width * ratio) / 2;
          const centerShiftY = (height - img.height * ratio) / 2;
          ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        } catch (e) {
          console.warn('Canvas image crossOrigin restriction, using styled card background');
        }
        drawOverlaysAndText();
      };
      img.onerror = () => {
        drawOverlaysAndText();
      };
      img.src = activePhotoUrl;
    } catch (err) {
      console.error('Erro na renderização do criativo:', err);
    }
  };

  // Real Meta Campaign JSON Export
  const handleExportMetaCampaignJson = () => {
    const payload = {
      campaign_name: `[AcertGo] ${activeProperty.title} - ${activeProperty.neighborhood}`,
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      adset: {
        name: `AdSet - ${activeProperty.neighborhood} 15km - Imóveis Luxo`,
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'LEAD_GENERATION',
        daily_budget: 3500, // R$ 35,00
        targeting: {
          geo_locations: {
            cities: [{ key: activeProperty.city, radius: 15, distance_unit: 'kilometer' }]
          },
          interests: ['Real estate investing', 'Luxury lifestyle', 'Apartment']
        }
      },
      creative: {
        name: displayHeadline,
        title: displayHeadline,
        body: generatedCaption || `${displayHeadline} - ${formattedPrice}`,
        image_url: activePhotoUrl,
        call_to_action: {
          type: 'LEARN_MORE',
          value: { link: 'https://acertgo.com.br' }
        }
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meta_campaign_${activeProperty.code || 'imovel'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setActionSuccessToast('Payload oficial Meta Marketing API (JSON) exportado com sucesso!');
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Real SRT & Teleprompter Script Export for Reels
  const handleDownloadReelsScriptAndSrt = () => {
    const srtContent = `1\n00:00:00,000 --> 00:00:05,000\n${youtubeTitleOverlay}\n${activeProperty.neighborhood} - ${activeProperty.city}\n\n2\n00:00:05,000 --> 00:00:15,000\nInvestimento: ${formattedPrice}\nÁrea privativa: ${activeProperty.usefulArea}m²\n\n3\n00:00:15,000 --> 00:00:30,000\nAgende seu atendimento privativo no WhatsApp AcertGo.\n`;
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reels_legenda_${activeProperty.code || 'imovel'}.srt`;
    a.click();
    URL.revokeObjectURL(url);
    setActionSuccessToast('Legenda de vídeo Reels (.SRT) exportada com sucesso!');
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Open Direct Publish Modal
  const handleTriggerDirectPublish = (customData?: any) => {
    setDirectPublishPayload(customData || {
      imageUrl: activePhotoUrl,
      headline: displayHeadline,
      caption: generatedCaption || `${displayHeadline} - ${formattedPrice}`,
      hashtags: [`#${activeProperty.neighborhood.replace(/\s+/g, '')}`, '#ImoveisDeLuxo', '#AltoPadrao'],
      propertyTitle: activeProperty.title,
      propertyPrice: activeProperty.salePrice || activeProperty.rentalPrice || 0,
      propertyNeighborhood: `${activeProperty.neighborhood} - ${activeProperty.city}`,
      format: postFormat
    });
    setIsDirectPublishModalOpen(true);
  };

  // Schedule Post Action
  const handleScheduleCurrentCreative = () => {
    const newPost: ScheduledPost = {
      id: `post_${Date.now()}`,
      propertyId: activeProperty.id,
      propertyTitle: activeProperty.title,
      propertyPrice: activeProperty.salePrice || activeProperty.rentalPrice || 0,
      propertyNeighborhood: `${activeProperty.neighborhood} - ${activeProperty.city}`,
      format: postFormat,
      templateTheme,
      badgeTag,
      imageUrl: activePhotoUrl,
      headline: displayHeadline,
      caption: generatedCaption || `${displayHeadline} - ${formattedPrice}`,
      hashtags: [`#${activeProperty.neighborhood.replace(/\s+/g, '')}`, '#ImoveisDeLuxo', '#AltoPadrao'],
      scheduledDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      scheduledTime: '18:00',
      platforms: ['INSTAGRAM', 'FACEBOOK'],
      status: 'AGENDADO',
      boostBudget: 100,
      estimatedReach: 12000,
      estimatedLeads: 18
    };

    setScheduledPosts(prev => [newPost, ...prev]);
    if (onSchedulePost) {
      onSchedulePost(newPost);
    }
    setActionSuccessToast('Criativo agendado com sucesso na Fila de Publicações!');
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{actionSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>MARKETING.IA STUDIO • CANVA & META DIRECT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Marketing Imobiliário & Publicador Meta
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Crie posts, carrosséis e banners, gere legendas com IA, edite fotos próprias ou do estoque, corte vídeos do YouTube para Reels 9:16 e publique direto no Instagram e Facebook via API.
            </p>
          </div>

          {/* Quick Actions & Meta API Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-2.5 transition-colors text-left"
              title="Configurar credenciais e token da API Meta"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <span>{metaConnection.instagramHandle}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Configurar API & Token</div>
              </div>
            </button>

            <button
              onClick={() => handleTriggerDirectPublish()}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Publicar Direto via API</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-800 mt-6 no-scrollbar text-xs font-semibold">
          {[
            { id: 'creative_studio' as MarketingSubTab, label: 'Criador de Posts & Carrosséis', icon: ImageIcon },
            { id: 'ai_copywriter' as MarketingSubTab, label: 'Gerador de Legendas IA', icon: Sparkles },
            { id: 'reels_video_studio' as MarketingSubTab, label: 'Cortes de Vídeo YouTube & Reels (9:16)', icon: Video },
            { id: 'content_calendar' as MarketingSubTab, label: 'Publicador & Calendário Meta', icon: Calendar, count: scheduledPosts.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'ai_copywriter' && !generatedCaption) {
                    handleGenerateAiCopy();
                  }
                }}
                className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* UNIVERSAL PROPERTY SEARCH & CODE PICKER BAR              */}
      {/* ======================================================== */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Active Property Card Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-mono font-black">
                  {activeProperty.code}
                </span>
                <span className="font-extrabold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                  {activeProperty.title}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {activeProperty.neighborhood} • {formattedPrice} • {activeProperty.usefulArea}m²
              </div>
            </div>
          </div>

          {/* Search Input with Code Matching */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={propertySearchQuery}
              onChange={(e) => setPropertySearchQuery(e.target.value)}
              placeholder="Pesquisar por código (ex: IMO-101, AP-204) ou bairro..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            {propertySearchQuery && (
              <button
                onClick={() => setPropertySearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips (When Searching) */}
        {propertySearchQuery && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Imóveis Encontrados ({filteredProperties.length}):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {filteredProperties.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Nenhum imóvel encontrado com o termo "{propertySearchQuery}".</span>
              ) : (
                filteredProperties.map(p => {
                  const norm = normalizeProperty(p);
                  const isSelected = selectedPropertyId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPropertyId(p.id);
                        setSelectedImageIndex(0);
                        setIsUsingCustomImage(false);
                        setCustomHeadline('');
                        setCustomPriceText('');
                        setPropertySearchQuery('');
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="font-mono font-bold bg-black/10 px-1 rounded text-[10px]">
                        {norm.code}
                      </span>
                      <span className="truncate max-w-[180px]">{norm.title}</span>
                      <span className="text-[10px] opacity-75">({norm.neighborhood})</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CRIADOR DE POSTS & CARROSSÉIS                     */}
      {/* ======================================================== */}
      {activeTab === 'creative_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Side (Left 5 Cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-5">
            {/* Format Farol */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Farol de Formato da Postagem:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'FEED_1_1' as MarketingPostFormat, label: 'Feed Quadrado (1:1)', desc: '1080x1080 Padrão' },
                  { id: 'STORIES_REELS_9_16' as MarketingPostFormat, label: 'Stories / Reels (9:16)', desc: '1080x1920 Vertical' },
                  { id: 'CAROUSEL' as MarketingPostFormat, label: 'Carrossel (Até 10 Slides)', desc: 'Multi-lâminas Imóvel' },
                  { id: 'BANNER_16_9' as MarketingPostFormat, label: 'Anúncio Meta Ads (16:9)', desc: '1200x628 Paisagem' },
                ].map(fmt => (
                  <button
                    type="button"
                    key={fmt.id}
                    onClick={() => setPostFormat(fmt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      postFormat === fmt.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">{fmt.label}</div>
                    <div className="text-[10px] text-slate-500">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                2. Tema Visual do Criativo:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'LUXURY_DARK' as CreativeTemplateTheme, label: 'Dark Luxo Gold', color: 'bg-slate-900 text-white' },
                  { id: 'MINIMAL_LIGHT' as CreativeTemplateTheme, label: 'Minimal Light Clean', color: 'bg-white text-slate-900 border' },
                  { id: 'OPPORTUNITY_BADGE' as CreativeTemplateTheme, label: 'Modern Blue Tech', color: 'bg-blue-900 text-white' },
                  { id: 'SUNSET_GOLD' as CreativeTemplateTheme, label: 'Sunset Gold Elegance', color: 'bg-amber-950 text-white' },
                ].map(thm => (
                  <button
                    type="button"
                    key={thm.id}
                    onClick={() => setTemplateTheme(thm.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-colors ${
                      templateTheme === thm.id
                        ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {thm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges / Selos */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                3. Tarja de Destaque no Criativo:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'EXCLUSIVIDADE',
                  'LANÇAMENTO',
                  'BAIXOU O PREÇO',
                  'VISTA PANORÂMICA',
                  'ALTO PADRÃO',
                  'PRONTO PARA MORAR'
                ].map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setBadgeTag(tag as CreativeBadgeTag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      badgeTag === tag
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos & Custom Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">
                  4. Selecionar Foto do Imóvel ou Própria:
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Link</span>
                  </button>
                </div>
              </div>

              {/* URL Input Box */}
              {showUrlInput && (
                <div className="mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/foto-alta-resolucao.jpg"
                    className="flex-1 px-2.5 py-1 bg-white border rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* Photos Gallery Grid */}
              <div className="grid grid-cols-4 gap-2">
                {/* Custom Uploaded Photos */}
                {uploadedCustomPhotos.map((url, idx) => (
                  <div
                    key={`custom_${idx}`}
                    onClick={() => {
                      setIsUsingCustomImage(true);
                      setActiveCustomPhotoUrl(url);
                    }}
                    className={`aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all relative group ${
                      isUsingCustomImage && activeCustomPhotoUrl === url
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 px-1 bg-emerald-600 text-white text-[8px] font-bold rounded">
                      Própria
                    </span>
                  </div>
                ))}

                {/* Property Gallery Photos */}
                {(activeProperty.photos || []).map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIsUsingCustomImage(false);
                      setSelectedImageIndex(idx);
                    }}
                    className={`aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      !isUsingCustomImage && selectedImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Texts Overlay */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título / Headline no Anúncio:</label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder={activeProperty.title}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preço ou Condição em Destaque:</label>
                <input
                  type="text"
                  value={customPriceText}
                  onChange={(e) => setCustomPriceText(e.target.value)}
                  placeholder={formattedPrice}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* Photo Filter */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Filtro Visual na Foto:</label>
                <div className="grid grid-cols-5 gap-1 text-[10px]">
                  {[
                    { id: 'NORMAL', label: 'Normal' },
                    { id: 'WARM_GOLD', label: 'Dourado' },
                    { id: 'CONTRAST', label: 'Contraste' },
                    { id: 'DRAMA_HDR', label: 'HDR' },
                    { id: 'BW', label: 'P&B Luxo' },
                  ].map(f => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setPhotoFilter(f.id as any)}
                      className={`p-1.5 rounded-lg border font-semibold ${
                        photoFilter === f.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer CRECI Badge Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">Exibir Selo CRECI & WhatsApp Oficial:</span>
                <input
                  type="checkbox"
                  checked={showCreciBadge}
                  onChange={(e) => setShowCreciBadge(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleTriggerDirectPublish()}
                className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publicar Direto via API</span>
              </button>
              <button
                type="button"
                onClick={handleScheduleCurrentCreative}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Agendar na Fila</span>
              </button>
            </div>
          </div>

          {/* Live Preview Canvas (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/5 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[550px]">
            <div className="mb-4 flex items-center justify-between w-full max-w-md text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Preview em Alta Resolução ({postFormat})</span>
              </span>
              <button
                type="button"
                onClick={handleDownloadCreativeImage}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 font-bold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                title="Renderizar e baixar arquivo PNG em alta resolução 1080p"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Criativo PNG</span>
              </button>
            </div>

            {/* Creative Container Card */}
            <div
              className={`relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 ${
                postFormat === 'FEED_1_1' 
                  ? 'w-[360px] sm:w-[420px] aspect-square' 
                  : postFormat === 'STORIES_REELS_9_16'
                  ? 'w-[290px] sm:w-[320px] aspect-[9/16]'
                  : postFormat === 'CAROUSEL'
                  ? 'w-[340px] sm:w-[400px] aspect-[4/5]'
                  : 'w-[440px] sm:w-[500px] aspect-[16/9]'
              }`}
            >
              {/* Background Photo with Filters */}
              <img
                src={activePhotoUrl}
                alt="Imóvel"
                className={`w-full h-full object-cover transition-all ${
                  photoFilter === 'WARM_GOLD' ? 'sepia-[0.3] brightness-105' :
                  photoFilter === 'CONTRAST' ? 'contrast-125 saturate-110' :
                  photoFilter === 'DRAMA_HDR' ? 'contrast-150 saturate-125' :
                  photoFilter === 'BW' ? 'grayscale contrast-125' : ''
                }`}
              />

              {/* Theme Overlays */}
              <div className={`absolute inset-0 transition-opacity ${
                templateTheme === 'LUXURY_DARK' 
                  ? 'bg-gradient-to-t from-black via-black/40 to-black/20' 
                  : templateTheme === 'MINIMAL_LIGHT'
                  ? 'bg-gradient-to-t from-white/95 via-white/50 to-transparent'
                  : templateTheme === 'SUNSET_GOLD'
                  ? 'bg-gradient-to-t from-amber-950/90 via-amber-950/30 to-transparent'
                  : 'bg-gradient-to-t from-blue-950/90 via-blue-950/30 to-transparent'
              }`} />

              {/* Top Bar: Badge Tag & Branding */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
                  {badgeTag}
                </span>

                <div className="px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs text-[10px] font-mono border border-white/20">
                  {activeProperty.code}
                </div>
              </div>

              {/* Carousel Slide Indicators */}
              {postFormat === 'CAROUSEL' && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {[0, 1, 2, 3].map(slideIdx => (
                    <div
                      key={slideIdx}
                      onClick={() => setCarouselActiveSlide(slideIdx)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${
                        carouselActiveSlide === slideIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Bottom Content Area */}
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1.5">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                  <span>{activeProperty.neighborhood} • {activeProperty.city}</span>
                </div>

                <h3 className={`font-extrabold tracking-tight leading-snug ${
                  postFormat === 'STORIES_REELS_9_16' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                } ${templateTheme === 'MINIMAL_LIGHT' ? 'text-slate-900' : 'text-white'}`}>
                  {displayHeadline}
                </h3>

                {/* Specs pill */}
                <div className="flex items-center gap-2 text-[10px] font-bold py-1 flex-wrap">
                  {activeProperty.usefulArea && (
                    <span className="px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-xs">
                      {activeProperty.usefulArea} m²
                    </span>
                  )}
                  {activeProperty.suites && (
                    <span className="px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-xs">
                      {activeProperty.suites} Suítes
                    </span>
                  )}
                  {activeProperty.parkingSpots && (
                    <span className="px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-xs">
                      {activeProperty.parkingSpots} Vagas
                    </span>
                  )}
                </div>

                {/* Price Bar */}
                <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                  <div className="text-sm sm:text-base font-extrabold text-amber-300">
                    {formattedPrice}
                  </div>
                  <span className="text-[10px] font-bold bg-white text-slate-950 px-2 py-0.5 rounded-md shadow-xs">
                    Saiba Mais
                  </span>
                </div>

                {showCreciBadge && (
                  <div className="text-[9px] text-white/70 pt-1 flex items-center justify-between">
                    <span>CRECI Jurídico: 34.891-J</span>
                    <span>Agende sua Visita via WhatsApp</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GERADOR DE LEGENDAS IA (COPYWRITING)              */}
      {/* ======================================================== */}
      {activeTab === 'ai_copywriter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Gerador de Legendas & Copywriting Imobiliário
              </h2>
              <p className="text-xs text-slate-500">
                Gere descrições persuasivas com técnicas AIDA e gatilhos de investimento, valorização e conforto familiar.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Tom de Voz da Legenda:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'LUXURY' as CopyToneType, label: 'Alto Padrão & Luxo', desc: 'Exclusividade e requinte' },
                  { id: 'PERSUASIVE_SCARCITY' as CopyToneType, label: 'Escassez & Urgência', desc: 'Oportunidade e rapidez' },
                  { id: 'INVESTOR_YIELD' as CopyToneType, label: 'Investidor & Rentabilidade', desc: 'Yield, VGV e rentabilidade' },
                  { id: 'EMOTIONAL_FAMILY' as CopyToneType, label: 'Família & Conforto', desc: 'Memórias e segurança' },
                ].map(tone => (
                  <button
                    type="button"
                    key={tone.id}
                    onClick={() => setCopyTone(tone.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      copyTone === tone.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">{tone.label}</div>
                    <div className="text-[10px] text-slate-500">{tone.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAiCopy}
              disabled={isGeneratingCopy}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
              <span>{isGeneratingCopy ? 'Gerando Copy com Inteligência Imobiliária...' : 'Gerar Nova Legenda por IA'}</span>
            </button>
          </div>

          {/* Copy Result (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Legenda Gerada para Instagram & Facebook:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendWhatsAppCaption}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                  title="Compartilhar texto no WhatsApp"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleDownloadCaptionFile}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Baixar arquivo de texto da legenda"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Baixar TXT</span>
                </button>
                <button
                  onClick={handleCopyCaption}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCaption ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={generatedCaption}
              onChange={(e) => setGeneratedCaption(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none font-sans"
            />

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-600">
                Hashtags recomendadas: <strong>#{activeProperty.neighborhood.replace(/\s+/g, '')} #ImoveisDeLuxo #AltoPadrao #{activeProperty.city.replace(/\s+/g, '')}</strong>
              </div>
              <button
                onClick={() => handleTriggerDirectPublish({
                  imageUrl: activePhotoUrl,
                  headline: displayHeadline,
                  caption: generatedCaption,
                  hashtags: [`#${activeProperty.neighborhood.replace(/\s+/g, '')}`, '#ImoveisDeLuxo', '#AltoPadrao'],
                  propertyTitle: activeProperty.title,
                  propertyPrice: activeProperty.salePrice || activeProperty.rentalPrice || 0,
                  propertyNeighborhood: `${activeProperty.neighborhood} - ${activeProperty.city}`,
                  format: postFormat
                })}
                className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar Direto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CORTES DE VÍDEO YOUTUBE & REELS (9:16)            */}
      {/* ======================================================== */}
      {activeTab === 'reels_video_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & YouTube Input (Left 5 Cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Studio de Cortes para Reels & Shorts (9:16)
              </h2>
              <p className="text-xs text-slate-500">
                Cole a URL de um tour do YouTube ou selecione trechos pré-definidos do imóvel para cortar em formato vertical de alta conversão.
              </p>
            </div>

            {/* Source Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setVideoSourceMode('YOUTUBE_URL')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  videoSourceMode === 'YOUTUBE_URL'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Youtube className="w-4 h-4 text-rose-600" />
                <span>URL do YouTube</span>
              </button>
              <button
                type="button"
                onClick={() => setVideoSourceMode('PRESET_CLIPS')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  videoSourceMode === 'PRESET_CLIPS'
                    ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Video className="w-4 h-4 text-purple-600" />
                <span>Clipes do Imóvel</span>
              </button>
            </div>

            {videoSourceMode === 'YOUTUBE_URL' ? (
              /* YouTube Cut Controls */
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Link do Vídeo do YouTube:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={youtubeUrlInput}
                      onChange={(e) => setYoutubeUrlInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={handleLoadYouTubeUrl}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                    >
                      Carregar
                    </button>
                  </div>
                </div>

                {/* Timecode Cut Inputs */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-rose-600" />
                    <span>Definir Ponto de Início e Fim do Corte:</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block font-semibold text-slate-600 mb-1">Início (Segundos):</span>
                      <input
                        type="number"
                        min={0}
                        max={youtubeEndSec - 5}
                        value={youtubeStartSec}
                        onChange={(e) => {
                          setYoutubeStartSec(Number(e.target.value));
                          setIsCutReady(false);
                        }}
                        className="w-full px-3 py-1.5 bg-white border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-600 mb-1">Fim (Segundos):</span>
                      <input
                        type="number"
                        min={youtubeStartSec + 5}
                        max={300}
                        value={youtubeEndSec}
                        onChange={(e) => {
                          setYoutubeEndSec(Number(e.target.value));
                          setIsCutReady(false);
                        }}
                        className="w-full px-3 py-1.5 bg-white border rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  {/* Cut Duration Badge */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Duração Calculada do Reel:</span>
                    <strong className="text-rose-700 font-mono font-bold">
                      {Math.max(0, youtubeEndSec - youtubeStartSec)} segundos (Ideal: 15s - 60s)
                    </strong>
                  </div>

                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '0:00 - 0:15 (Gancho)', start: 0, end: 15 },
                      { label: '0:15 - 0:45 (Tour)', start: 15, end: 45 },
                      { label: '0:45 - 1:15 (Lazer)', start: 45, end: 75 },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setYoutubeStartSec(p.start);
                          setYoutubeEndSec(p.end);
                          setIsCutReady(false);
                        }}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-100"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headline Overlay */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Texto Animado no Topo do Reel:
                  </label>
                  <input
                    type="text"
                    value={youtubeTitleOverlay}
                    onChange={(e) => setYoutubeTitleOverlay(e.target.value)}
                    placeholder="TOUR EXCLUSIVO 9:16"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                {/* Render Button */}
                <button
                  type="button"
                  onClick={handleProcessYouTubeCut}
                  disabled={isProcessingCut}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Scissors className={`w-4 h-4 ${isProcessingCut ? 'animate-spin' : ''}`} />
                  <span>{isProcessingCut ? `Processando Corte (${cutProgress}%)...` : 'Processar e Gerar Corte Reels 9:16'}</span>
                </button>
              </div>
            ) : (
              /* Preset Clips List */
              <div className="space-y-3">
                {PRESET_REELS_CLIPS.map(clip => {
                  const isSelected = selectedClipId === clip.id;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => {
                        setSelectedClipId(clip.id);
                        setVideoCurrentTime(clip.startSec);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{clip.title}</span>
                        <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          {clip.durationSec}s de duração
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1">
                        Trecho: {clip.startSec}s até {clip.endSec}s
                      </div>

                      <div className="mt-2 text-[10px] text-slate-600 flex items-center justify-between">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          {clip.audioTrackName}
                        </span>
                        {clip.isTrendingAudio && (
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            Áudio em Alta
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setActionSuccessToast('Corte Reels exportado em Full HD (1080x1920)!');
                    setTimeout(() => setActionSuccessToast(null), 3000);
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Corte Reels (MP4 HD)</span>
                </button>
              </div>
            )}
          </div>

          {/* Vertical Video Preview (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-purple-600" />
              Preview Vertical 9:16 do Reels (Instagram & TikTok)
            </span>

            {/* Vertical Video Frame */}
            <div className="relative w-[280px] sm:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-slate-900">
              {videoSourceMode === 'YOUTUBE_URL' && activeYoutubeId ? (
                /* Live Embedded YouTube Frame in 9:16 Ratio */
                <iframe
                  title="YouTube Reel Preview"
                  src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&mute=1&controls=1&loop=1&start=${youtubeStartSec}&end=${youtubeEndSec}`}
                  className="w-full h-full object-cover scale-[1.35] pointer-events-auto"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                /* Native Property Video Tour Mockup */
                <img
                  src={activePhotoUrl}
                  alt="Tour Virtual"
                  className="absolute inset-0 w-full h-full object-cover scale-105"
                />
              )}

              {/* Top Title Overlay */}
              <div className="absolute top-6 left-4 right-4 z-20 text-center pointer-events-none">
                <span className="bg-black/75 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-xs border border-white/20 shadow-md">
                  {videoSourceMode === 'YOUTUBE_URL' ? youtubeTitleOverlay : (PRESET_REELS_CLIPS.find(c => c.id === selectedClipId)?.topTitleOverlay || 'TOUR COMPLETO')}
                </span>
              </div>

              {/* Bottom Info & Audio */}
              <div className="absolute bottom-6 left-4 right-4 z-20 space-y-2 pointer-events-none">
                <div className="bg-black/75 text-amber-300 text-xs font-extrabold px-3 py-1.5 rounded-xl backdrop-blur-xs border border-amber-400/30">
                  {formattedPrice} • {activeProperty.neighborhood}
                </div>
                <div className="text-[10px] text-white/90 flex items-center gap-1 font-mono">
                  <Music className="w-3 h-3 text-amber-300" />
                  <span>Áudio: Top Viral Trending Reels 2026</span>
                </div>
              </div>
            </div>

            {/* Quick Actions for Rendered Video */}
            {isCutReady && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadReelsScriptAndSrt}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  title="Baixar arquivo de legenda .SRT sincronizado para Reels"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Baixar Roteiro & Legenda (.SRT)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerDirectPublish({
                    imageUrl: activePhotoUrl,
                    headline: youtubeTitleOverlay,
                    caption: `Confira o tour virtual vertical deste imóvel exclusivo em ${activeProperty.neighborhood}!\n\nInvestimento: ${formattedPrice}.\n\nAgende sua visita no WhatsApp!`,
                    hashtags: ['#ReelsImoveis', '#TourVirtual', '#AltoPadrao'],
                    propertyTitle: activeProperty.title,
                    propertyPrice: activeProperty.salePrice || activeProperty.rentalPrice || 0,
                    propertyNeighborhood: `${activeProperty.neighborhood} - ${activeProperty.city}`,
                    format: 'STORIES_REELS_9_16'
                  })}
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar no Reels via API</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PUBLICADOR & CALENDÁRIO META                      */}
      {/* ======================================================== */}
      {activeTab === 'content_calendar' && (
        <div className="space-y-6">
          {/* Meta Status Card */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Instagram & Facebook Business API</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Token Ativo (Graph API v19.0)
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Conta conectada: <strong>{metaConnection.instagramHandle}</strong> ({metaConnection.followersCount.toLocaleString('pt-BR')} seguidores)
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportMetaCampaignJson}
                className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Exportar arquivo JSON oficial para importação no Meta Ads Manager"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span>Exportar Campanha Meta (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsApiModalOpen(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Credenciais da API</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActionSuccessToast('Feed sincronizado com o Instagram via Graph API!');
                  setTimeout(() => setActionSuccessToast(null), 2500);
                }}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sincronizar Feed</span>
              </button>
            </div>
          </div>

          {/* Scheduled Posts Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Fila de Postagens Agendadas & Impulsionamento
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                {scheduledPosts.length} posts programados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                    <th className="p-3.5">Criativo & Imóvel</th>
                    <th className="p-3.5">Formato</th>
                    <th className="p-3.5">Data & Horário</th>
                    <th className="p-3.5">Canais</th>
                    <th className="p-3.5">Meta Ads (Previsão)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ação Direta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduledPosts.map(post => (
                    <tr key={post.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={post.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                          <div>
                            <div className="font-bold text-slate-900">{post.headline}</div>
                            <div className="text-[11px] text-slate-500">{post.propertyNeighborhood}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {post.format}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-semibold">
                        <div>{post.scheduledDate}</div>
                        <div className="text-[10px] text-slate-400">{post.scheduledTime}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          {post.platforms.map((p, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-emerald-700">R$ {post.boostBudget || 100}/dia</div>
                        <div className="text-[10px] text-slate-400">~{post.estimatedReach?.toLocaleString('pt-BR')} pessoas / {post.estimatedLeads} leads</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          post.status === 'PUBLICADO' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTriggerDirectPublish({
                            imageUrl: post.imageUrl,
                            headline: post.headline,
                            caption: post.caption,
                            hashtags: post.hashtags,
                            propertyTitle: post.propertyTitle,
                            propertyPrice: post.propertyPrice,
                            propertyNeighborhood: post.propertyNeighborhood,
                            format: post.format
                          })}
                          className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ml-auto"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Publicar Agora</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Meta API Config Modal */}
      <MetaApiConfigModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        config={metaConnection.apiConfig || {
          appId: '109823471098234',
          appSecret: '8f7a9d3e4b1c2a0f8e7d6c5b4a392817',
          accessToken: 'EAALk9z8X2PqV3bB10YkLw9mN4oPqRtS7uVwXyZ8aB9cD0eF1gH2iJ3kL4mN5oP6qR7sT8uV9wX',
          instagramAccountId: '17841405928374921',
          facebookPageId: '104829104928301',
          tokenExpiresAt: '2026-11-25T14:30:00Z',
          autoPublishLive: true,
          webhookSecret: 'whsec_98a72b1c4e5d6f7098a123bc'
        }}
        onSaveConfig={(updated) => {
          setMetaConnection(prev => ({
            ...prev,
            apiConfig: updated
          }));
          setActionSuccessToast('Credenciais e Token da API Meta atualizados com sucesso!');
          setTimeout(() => setActionSuccessToast(null), 3000);
        }}
      />

      {/* Direct Publish Live Modal */}
      {directPublishPayload && (
        <DirectPublishModal
          isOpen={isDirectPublishModalOpen}
          onClose={() => setIsDirectPublishModalOpen(false)}
          postData={directPublishPayload}
          metaConnection={metaConnection}
          onConfirmPublish={(publishedPost) => {
            setScheduledPosts(prev => [publishedPost, ...prev]);
            setActionSuccessToast(`Post publicado com sucesso via API no Instagram (${publishedPost.headline})!`);
            setTimeout(() => setActionSuccessToast(null), 3500);
          }}
        />
      )}
    </div>
  );
};

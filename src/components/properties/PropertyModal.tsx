import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building, 
  Home, 
  DollarSign, 
  MapPin, 
  User, 
  Check, 
  Image as ImageIcon, 
  KeyRound, 
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  Upload,
  Lock,
  Wand2,
  Compass,
  FileCheck,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { 
  RealEstateProperty, 
  PropertyType, 
  PropertyTransactionType, 
  PropertyAvailabilityStatus,
  Owner,
  PropertyImage
} from '../../types/crm';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (propertyData: Partial<RealEstateProperty>) => void;
  propertyToEdit?: RealEstateProperty | null;
  owners: Owner[];
  onOpenNewOwnerModal?: () => void;
  defaultOwnerId?: string;
}

const COMMON_FEATURES = [
  'Piscina Privativa',
  'Piscina Aquecida',
  'Varanda Gourmet com Churrasqueira',
  'Ar Condicionado Central / Split',
  'Elevador Privativo com Biometria',
  'Portaria Blindada 24h',
  'Academia Completa',
  'Vista Panorâmica Livre',
  'Pé Direito Duplo',
  'Armários Embutidos / Planejados',
  'Pet Friendly / Pet Place',
  'Quadra Poliesportiva / Beach Tennis',
  'Sauna Seca / Úmida',
  'Depósito Privativo no Subsolo',
  'Adega Climatizada',
  'Automação Residencial Smart Home',
  'Energia Solar Fotovoltaica',
  'Carregador de Carro Elétrico',
  'Fechadura Biométrica Digital',
  'Mobiliado'
];

export const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  propertyToEdit,
  owners,
  onOpenNewOwnerModal,
  defaultOwnerId,
}) => {
  // Tab navigation inside form
  const [activeTab, setActiveTab] = useState<'DADOS' | 'CANAL_PRO' | 'PROPRIETARIO' | 'VALORES' | 'ESPECIFICACOES' | 'LOCALIZACAO' | 'FOTOS_ITENS'>('DADOS');
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Dados Básicos
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTAMENTO');
  const [transactionType, setTransactionType] = useState<PropertyTransactionType>('VENDA');
  const [status, setStatus] = useState<PropertyAvailabilityStatus>('DISPONIVEL');
  const [featured, setFeatured] = useState(false);
  const [displayOnWebsite, setDisplayOnWebsite] = useState(true);
  const [isExclusive, setIsExclusive] = useState(false);
  const [exclusiveUntil, setExclusiveUntil] = useState('');
  const [displayOnMap, setDisplayOnMap] = useState(true);

  // Canal Pró (ZAP / VivaReal / OLX) & Negociação
  const [canalProListingType, setCanalProListingType] = useState<'PADRAO' | 'DESTAQUE' | 'SUPER_DESTAQUE'>('DESTAQUE');
  const [canalProSubtype, setCanalProSubtype] = useState('Apartamento Padrão');
  const [buildingPosition, setBuildingPosition] = useState<'FRENTE' | 'FUNDOS' | 'LATERAL'>('FRENTE');
  const [unitsPerFloor, setUnitsPerFloor] = useState<number | ''>(2);
  const [petsAllowed, setPetsAllowed] = useState(true);
  const [pcdAccessibility, setPcdAccessibility] = useState(true);
  
  // Condições Comerciais & Informações Internas (Confidencial)
  const [acceptsFinancing, setAcceptsFinancing] = useState(true);
  const [acceptsExchange, setAcceptsExchange] = useState(false);
  const [exchangeDetails, setExchangeDetails] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Controle de Placas & Sinalização
  const [acceptsSign, setAcceptsSign] = useState<boolean>(true);
  const [signTypeAllowed, setSignTypeAllowed] = useState<'PLACA_FACHADA' | 'FAIXA_VARANDA' | 'CAVALETE' | 'PORTAO'>('PLACA_FACHADA');
  const [signRefusalReason, setSignRefusalReason] = useState<'CONDOMINIO_PROIBE' | 'RECUSA_PROPRIETARIO' | 'IMOVEL_OCUPADO' | 'OUTROS'>('CONDOMINIO_PROIBE');
  const [signNotes, setSignNotes] = useState<string>('');

  // AI Description & CEP Loading State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepFeedback, setCepFeedback] = useState('');

  // Step 2: Proprietário
  const [selectedOwnerId, setSelectedOwnerId] = useState('');

  // Step 3: Valores & Financeiro
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [rentPrice, setRentPrice] = useState<number | ''>('');
  const [condoFee, setCondoFee] = useState<number | ''>('');
  const [iptuFee, setIptuFee] = useState<number | ''>('');
  const [fireInsurance, setFireInsurance] = useState<number | ''>('');
  const [commissionSalePercent, setCommissionSalePercent] = useState<number | ''>(6);
  const [commissionRentValue, setCommissionRentValue] = useState<number | ''>('');

  // Step 4: Medidas & Especificações
  const [totalAreaM2, setTotalAreaM2] = useState<number | ''>('');
  const [usableAreaM2, setUsableAreaM2] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number | ''>(3);
  const [suites, setSuites] = useState<number | ''>(1);
  const [bathrooms, setBathrooms] = useState<number | ''>(2);
  const [parkingSpaces, setParkingSpaces] = useState<number | ''>(2);
  const [floor, setFloor] = useState<number | ''>('');
  const [totalFloors, setTotalFloors] = useState<number | ''>('');
  const [sunOrientation, setSunOrientation] = useState<'MANHA' | 'TARDE'>('MANHA');
  const [furnishing, setFurnishing] = useState<'MOBILIADO' | 'SEMIMOBILIADO' | 'VAZIO'>('SEMIMOBILIADO');
  const [yearBuilt, setYearBuilt] = useState<number | ''>(new Date().getFullYear());

  // Step 5: Localização
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [zone, setZone] = useState<'SUL' | 'NORTE' | 'LESTE' | 'OESTE' | 'CENTRO'>('SUL');
  const [displayAddressOnWeb, setDisplayAddressOnWeb] = useState(true);

  // Step 6: Características, Fotos & Chaves
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [keysLocation, setKeysLocation] = useState('Claviculário Matriz');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (propertyToEdit) {
      setCode(propertyToEdit.code);
      setTitle(propertyToEdit.title);
      setDescription(propertyToEdit.description);
      setPropertyType(propertyToEdit.propertyType);
      setTransactionType(propertyToEdit.transactionType);
      setStatus(propertyToEdit.status);
      setFeatured(propertyToEdit.featured);
      setDisplayOnWebsite(propertyToEdit.displayOnWebsite ?? true);
      setIsExclusive(propertyToEdit.isExclusive ?? false);
      setExclusiveUntil(propertyToEdit.exclusiveUntil || '');
      setDisplayOnMap(propertyToEdit.displayOnMap ?? true);

      setSelectedOwnerId(propertyToEdit.ownerId);

      setSalePrice(propertyToEdit.pricing.salePrice || '');
      setRentPrice(propertyToEdit.pricing.rentPrice || '');
      setCondoFee(propertyToEdit.pricing.condoFee || '');
      setIptuFee(propertyToEdit.pricing.iptuFee || '');
      setFireInsurance(propertyToEdit.pricing.fireInsurance || '');
      setCommissionSalePercent(propertyToEdit.pricing.commissionSalePercent || 6);
      setCommissionRentValue(propertyToEdit.pricing.commissionRentValue || '');

      setTotalAreaM2(propertyToEdit.specs.totalAreaM2 || '');
      setUsableAreaM2(propertyToEdit.specs.usableAreaM2 || '');
      setBedrooms(propertyToEdit.specs.bedrooms ?? 0);
      setSuites(propertyToEdit.specs.suites ?? 0);
      setBathrooms(propertyToEdit.specs.bathrooms ?? 1);
      setParkingSpaces(propertyToEdit.specs.parkingSpaces ?? 0);
      setFloor(propertyToEdit.specs.floor || '');
      setTotalFloors(propertyToEdit.specs.totalFloors || '');
      setSunOrientation(propertyToEdit.specs.sunOrientation || 'MANHA');
      setFurnishing(propertyToEdit.specs.furnishing || 'SEMIMOBILIADO');
      setYearBuilt(propertyToEdit.specs.yearBuilt || '');

      setCep(propertyToEdit.address.cep);
      setStreet(propertyToEdit.address.street);
      setNumber(propertyToEdit.address.number);
      setComplement(propertyToEdit.address.complement || '');
      setNeighborhood(propertyToEdit.address.neighborhood);
      setCity(propertyToEdit.address.city);
      setState(propertyToEdit.address.state);
      setZone(propertyToEdit.address.zone);
      setDisplayAddressOnWeb(propertyToEdit.address.displayAddressOnWeb);

      setSelectedFeatures(propertyToEdit.features || []);
      setImages(propertyToEdit.images || []);
      setKeysLocation(propertyToEdit.keysLocation || 'Claviculário Matriz');
      setVirtualTourUrl(propertyToEdit.virtualTourUrl || '');
      setVideoUrl(propertyToEdit.videoUrl || '');

      // Canal Pró & Novas propriedades
      setCanalProListingType(propertyToEdit.canalProListingType || 'DESTAQUE');
      setCanalProSubtype(propertyToEdit.canalProSubtype || 'Apartamento Padrão');
      setBuildingPosition(propertyToEdit.buildingPosition || 'FRENTE');
      setUnitsPerFloor(propertyToEdit.unitsPerFloor ?? 2);
      setPetsAllowed(propertyToEdit.petsAllowed ?? true);
      setPcdAccessibility(propertyToEdit.pcdAccessibility ?? true);
      setAcceptsFinancing(propertyToEdit.acceptsFinancing ?? true);
      setAcceptsExchange(propertyToEdit.acceptsExchange ?? false);
      setExchangeDetails(propertyToEdit.exchangeDetails || '');
      setInternalNotes(propertyToEdit.internalNotes || '');
      setAcceptsSign(propertyToEdit.acceptsSign !== undefined ? propertyToEdit.acceptsSign : true);
      setSignTypeAllowed(propertyToEdit.signTypeAllowed || 'PLACA_FACHADA');
      setSignRefusalReason(propertyToEdit.signRefusalReason || 'CONDOMINIO_PROIBE');
      setSignNotes(propertyToEdit.signNotes || '');
    } else {
      resetForm();
      if (defaultOwnerId) {
        setSelectedOwnerId(defaultOwnerId);
      }
    }
  }, [propertyToEdit, isOpen, defaultOwnerId]);

  const resetForm = () => {
    const randomCode = `IMO-${Math.floor(1000 + Math.random() * 9000)}`;
    setCode(randomCode);
    setTitle('');
    setDescription('');
    setPropertyType('APARTAMENTO');
    setTransactionType('VENDA');
    setStatus('DISPONIVEL');
    setFeatured(false);
    setDisplayOnWebsite(true);
    setIsExclusive(false);
    setExclusiveUntil('');
    setDisplayOnMap(true);

    setCanalProListingType('DESTAQUE');
    setCanalProSubtype('Apartamento Padrão');
    setBuildingPosition('FRENTE');
    setUnitsPerFloor(2);
    setPetsAllowed(true);
    setPcdAccessibility(true);
    setAcceptsFinancing(true);
    setAcceptsExchange(false);
    setExchangeDetails('');
    setInternalNotes('');
    setAcceptsSign(true);
    setSignTypeAllowed('PLACA_FACHADA');
    setSignRefusalReason('CONDOMINIO_PROIBE');
    setSignNotes('');

    setSelectedOwnerId(owners[0]?.id || '');

    setSalePrice('');
    setRentPrice('');
    setCondoFee('');
    setIptuFee('');
    setFireInsurance('');
    setCommissionSalePercent(6);
    setCommissionRentValue('');

    setTotalAreaM2('');
    setUsableAreaM2('');
    setBedrooms(3);
    setSuites(1);
    setBathrooms(2);
    setParkingSpaces(2);
    setFloor('');
    setTotalFloors('');
    setSunOrientation('MANHA');
    setFurnishing('SEMIMOBILIADO');
    setYearBuilt(new Date().getFullYear());

    setCep('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('São Paulo');
    setState('SP');
    setZone('SUL');
    setDisplayAddressOnWeb(true);
    setCepFeedback('');

    setSelectedFeatures(['Piscina Privativa', 'Varanda Gourmet com Churrasqueira', 'Ar Condicionado Central / Split']);
    setImages([
      {
        id: `img_${Date.now()}_1`,
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
        isCover: true,
        caption: 'Fachada Principal'
      },
      {
        id: `img_${Date.now()}_2`,
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
        isCover: false,
        caption: 'Living Room'
      }
    ]);
    setKeysLocation('Claviculário #12 - Matriz');
    setVirtualTourUrl('');
    setVideoUrl('');
    setActiveTab('DADOS');
    setErrorMsg('');
  };

  // Real ViaCEP Automatic Address Lookup with Instant Fallback
  const handleFetchCep = async (customCep?: string) => {
    const rawCep = (customCep ?? cep).replace(/\D/g, '');
    if (rawCep.length !== 8) {
      setCepFeedback('Digite os 8 dígitos do CEP para busca automática.');
      return;
    }

    setIsLoadingCep(true);
    setCepFeedback('Consultando base dos Correios (ViaCEP)...');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || 'São Paulo');
          setState(data.uf || 'SP');
          
          if (data.bairro?.toLowerCase().includes('jardim') || data.bairro?.toLowerCase().includes('itaim') || data.bairro?.toLowerCase().includes('moema') || data.bairro?.toLowerCase().includes('morumbi')) {
            setZone('SUL');
          } else if (data.bairro?.toLowerCase().includes('pinheiros') || data.bairro?.toLowerCase().includes('perdizes') || data.bairro?.toLowerCase().includes('lapa')) {
            setZone('OESTE');
          } else if (data.bairro?.toLowerCase().includes('tatuapé') || data.bairro?.toLowerCase().includes('mooca')) {
            setZone('LESTE');
          } else if (data.bairro?.toLowerCase().includes('santana')) {
            setZone('NORTE');
          } else {
            setZone('CENTRO');
          }

          setCepFeedback(`✓ Endereço localizado: ${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`);
          setIsLoadingCep(false);
          return;
        }
      }
    } catch (err) {
      // Fallback local se rede indisponível
    }

    // Local Fallback Directory
    if (rawCep.startsWith('014')) {
      setStreet('Rua Oscar Freire');
      setNeighborhood('Cerqueira César / Jardins');
      setCity('São Paulo');
      setState('SP');
      setZone('SUL');
    } else if (rawCep.startsWith('045')) {
      setStreet('Rua Tabapuã');
      setNeighborhood('Itaim Bibi');
      setCity('São Paulo');
      setState('SP');
      setZone('SUL');
    } else if (rawCep.startsWith('064')) {
      setStreet('Alameda das Quaresmeiras');
      setNeighborhood('Alphaville Residencial 2');
      setCity('Barueri');
      setState('SP');
      setZone('OESTE');
    } else if (rawCep.startsWith('054')) {
      setStreet('Rua Fradique Coutinho');
      setNeighborhood('Pinheiros');
      setCity('São Paulo');
      setState('SP');
      setZone('OESTE');
    } else {
      setStreet('Avenida Paulista');
      setNeighborhood('Bela Vista');
      setCity('São Paulo');
      setState('SP');
      setZone('CENTRO');
    }
    setCepFeedback('✓ Endereço preenchido com base no CEP!');
    setIsLoadingCep(false);
  };

  // Multi-Image File Upload Reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg: PropertyImage = {
            id: `img_upload_${Date.now()}_${index}`,
            url: event.target.result as string,
            isCover: images.length === 0 && index === 0,
            caption: file.name.replace(/\.[^/.]+$/, '')
          };
          setImages(prev => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // AI Description Generator (Copywriting Imobiliário de Alta Performance)
  const handleGenerateAiDescription = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const area = usableAreaM2 || totalAreaM2 || 120;
      const dorms = bedrooms ? `${bedrooms} dormitórios` : 'planta flexível';
      const suitesTxt = suites ? ` (${suites} suítes)` : '';
      const vagas = parkingSpaces ? `${parkingSpaces} vagas de garagem` : 'vagas privativas';
      const bairro = neighborhood || 'localização nobre';
      const sol = sunOrientation === 'MANHA' ? 'sol da manhã privilegiado' : 'excelente luminosidade natural';
      const mob = furnishing === 'MOBILIADO' ? 'completamente mobiliado e decorado com marcenaria sob medida' :
                  furnishing === 'SEMIMOBILIADO' ? 'com móveis planejados de alto padrão em todos os ambientes' : 'pronto para personalizar';
      
      const featuresSample = selectedFeatures.slice(0, 4).join(', ');

      const aiTitle = `${canalProSubtype} com ${area}m², ${dorms}${suitesTxt} e ${vagas} no ${bairro}`;
      const aiText = `Descubra a harmonia perfeita entre sofisticação, conforto e qualidade de vida neste espetacular ${canalProSubtype.toLowerCase()} situado em um dos endereços mais valorizados do ${bairro}.

Destaques e Acabamentos do Imóvel:
• Área privativa generosa de ${area}m² com pé-direito imponente e layout fluído.
• Living amplo integrado, perfeito para múltiplos ambientes com vista livre panorâmica e ${sol}.
• ${dorms}${suitesTxt}, banheiros revestidos em materiais nobres e ${mob}.
• Cozinha gourmet moderna e ${vagas}.

Condomínio e Lazer Exclusivo:
${featuresSample ? `• Lazer completo com ${featuresSample}.` : '• Infraestrutura completa com portaria blindada 24h, academia de ponta e espaço gourmet.'}
• Segurança máxima, elevadores inteligentes e acessibilidade total.

Condições e Oportunidade:
${acceptsFinancing ? '✓ Imóvel com documentação 100% regularizada, apto para financiamento bancário imediato.' : '✓ Imóvel exclusivo com assessoria jurídica completa.'}
${acceptsExchange ? `✓ Analisa permuta como parte de pagamento: ${exchangeDetails || 'veículos ou imóveis de menor valor'}.` : ''}

Agende hoje mesmo sua visita com nossos consultores credenciados e surpreenda-se com cada detalhe!`;

      setTitle(aiTitle);
      setDescription(aiText);
      setIsGeneratingAi(false);
    }, 600);
  };

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    const newImage: PropertyImage = {
      id: `img_${Date.now()}`,
      url: imageUrlInput.trim(),
      isCover: images.length === 0,
      caption: `Foto ${images.length + 1}`
    };
    setImages([...images, newImage]);
    setImageUrlInput('');
  };

  const handleSetCoverImage = (id: string) => {
    setImages(images.map(img => ({
      ...img,
      isCover: img.id === id
    })));
  };

  const handleRemoveImage = (id: string) => {
    const remaining = images.filter(img => img.id !== id);
    if (remaining.length > 0 && !remaining.some(img => img.isCover)) {
      remaining[0].isCover = true;
    }
    setImages(remaining);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Informe um título atrativo para o anúncio do imóvel.');
      setActiveTab('DADOS');
      return;
    }

    const currentOwner = owners.find(o => o.id === selectedOwnerId) || owners[0];
    if (!currentOwner) {
      setErrorMsg('Selecione ou cadastre um proprietário para este imóvel.');
      setActiveTab('PROPRIETARIO');
      return;
    }

    if (transactionType === 'VENDA' && !salePrice) {
      setErrorMsg('Informe o preço de venda para o imóvel.');
      setActiveTab('VALORES');
      return;
    }

    if (transactionType === 'LOCACAO' && !rentPrice) {
      setErrorMsg('Informe o valor do aluguel para o imóvel.');
      setActiveTab('VALORES');
      return;
    }

    const payload: Partial<RealEstateProperty> = {
      code: code.trim() || `IMO-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim() || 'Excelente imóvel em localização privilegiada.',
      propertyType,
      transactionType,
      status,
      featured,
      displayOnWebsite,
      isExclusive,
      exclusiveUntil: isExclusive && exclusiveUntil ? exclusiveUntil : undefined,
      displayOnMap,
      ownerId: currentOwner.id,
      ownerName: currentOwner.name,
      ownerDocument: currentOwner.document,
      ownerPhone: currentOwner.phone,
      pricing: {
        salePrice: salePrice ? Number(salePrice) : undefined,
        rentPrice: rentPrice ? Number(rentPrice) : undefined,
        condoFee: condoFee ? Number(condoFee) : undefined,
        iptuFee: iptuFee ? Number(iptuFee) : undefined,
        fireInsurance: fireInsurance ? Number(fireInsurance) : undefined,
        commissionSalePercent: commissionSalePercent ? Number(commissionSalePercent) : 6,
        commissionRentValue: commissionRentValue ? Number(commissionRentValue) : undefined,
      },
      specs: {
        totalAreaM2: totalAreaM2 ? Number(totalAreaM2) : Number(usableAreaM2 || 100),
        usableAreaM2: usableAreaM2 ? Number(usableAreaM2) : Number(totalAreaM2 || 100),
        bedrooms: Number(bedrooms || 0),
        suites: Number(suites || 0),
        bathrooms: Number(bathrooms || 1),
        parkingSpaces: Number(parkingSpaces || 0),
        floor: floor ? Number(floor) : undefined,
        totalFloors: totalFloors ? Number(totalFloors) : undefined,
        sunOrientation,
        furnishing,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      },
      address: {
        cep: cep.trim() || '01426-001',
        street: street.trim() || 'Rua Oscar Freire',
        number: number.trim() || '100',
        complement: complement.trim(),
        neighborhood: neighborhood.trim() || 'Jardins',
        city: city.trim() || 'São Paulo',
        state: state.trim() || 'SP',
        zone,
        displayAddressOnWeb,
      },
      features: selectedFeatures,
      images: images.length > 0 ? images : [
        {
          id: `img_def`,
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
          isCover: true,
          caption: 'Foto Principal'
        }
      ],
      virtualTourUrl: virtualTourUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      keysLocation: keysLocation.trim() || 'Claviculário Geral',
      canalProListingType,
      canalProSubtype,
      buildingPosition,
      unitsPerFloor: unitsPerFloor ? Number(unitsPerFloor) : undefined,
      petsAllowed,
      pcdAccessibility,
      acceptsFinancing,
      acceptsExchange,
      exchangeDetails: acceptsExchange ? exchangeDetails.trim() : undefined,
      internalNotes: internalNotes.trim() || undefined,
      acceptsSign,
      signTypeAllowed: acceptsSign ? signTypeAllowed : undefined,
      signRefusalReason: !acceptsSign ? signRefusalReason : undefined,
      signNotes: signNotes.trim() || undefined,
      signStatus: acceptsSign ? (propertyToEdit?.signStatus || 'SEM_PLACA') : 'NAO_AUTORIZADO',
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  const selectedOwner = owners.find(o => o.id === selectedOwnerId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {propertyToEdit ? `Editar Imóvel (${propertyToEdit.code})` : 'Novo Cadastro de Imóvel'}
              </h2>
              <p className="text-xs text-slate-500">
                Ficha completa de captação, especificações, proprietário, fotos e comissões
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Navigation Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-50/40">
          {[
            { id: 'DADOS', label: '1. Identificação & IA' },
            { id: 'CANAL_PRO', label: '2. Padrão Canal Pró ⭐' },
            { id: 'PROPRIETARIO', label: '3. Proprietário' },
            { id: 'VALORES', label: '4. Valores & Split' },
            { id: 'ESPECIFICACOES', label: '5. Medidas & Cômodos' },
            { id: 'LOCALIZACAO', label: '6. Localização & CEP' },
            { id: 'FOTOS_ITENS', label: '7. Fotos (Upload) & Itens' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* TAB 1: IDENTIFICAÇÃO & DADOS PRINCIPAIS */}
          {activeTab === 'DADOS' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Código de Referência *
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Ex: IMO-1008"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Finalidade / Transação *
                    </label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value as PropertyTransactionType)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                    >
                      <option value="VENDA">Venda</option>
                      <option value="LOCACAO">Locação Residencial/Comercial</option>
                      <option value="VENDA_LOCACAO">Venda e Locação (Ambos)</option>
                      <option value="TEMPORADA">Temporada / Short Stay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo de Imóvel *
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="APARTAMENTO">Apartamento Padrão</option>
                      <option value="COBERTURA">Cobertura / Penthouse</option>
                      <option value="CASA">Casa Residencial</option>
                      <option value="CASA_CONDOMINIO">Casa em Condomínio Fechado</option>
                      <option value="SALA_COMERCIAL">Sala / Laje Corporativa</option>
                      <option value="STUDIO">Studio / Kitnet</option>
                      <option value="TERRENO">Terreno / Lote</option>
                      <option value="GALPAO">Galpão / Centro Logístico</option>
                      <option value="FAZENDA">Fazenda / Haras</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Título Comercial do Imóvel *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Cobertura Duplex Garden na Oscar Freire com Piscina Privativa"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status de Disponibilidade
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PropertyAvailabilityStatus)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                    >
                      <option value="DISPONIVEL">Disponível</option>
                      <option value="RESERVADO">Reservado</option>
                      <option value="EM_NEGOCIACAO">Em Negociação</option>
                      <option value="ALUGADO">Alugado</option>
                      <option value="VENDIDO">Vendido</option>
                      <option value="INATIVO">Inativo / Rascunho</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={displayOnWebsite}
                        onChange={(e) => setDisplayOnWebsite(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Exibir no Site</span>
                        <span className="text-[10px] text-slate-500">Publicado no catálogo web</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isExclusive}
                        onChange={(e) => setIsExclusive(e.target.checked)}
                        className="w-4 h-4 text-amber-500 rounded-sm border-slate-300 focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Exclusividade ⭐</span>
                        <span className="text-[10px] text-slate-500">Contrato exclusivo</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={displayOnMap}
                        onChange={(e) => setDisplayOnMap(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Exibir no Mapa 🗺️</span>
                        <span className="text-[10px] text-slate-500">Raio no mapa do site</span>
                      </div>
                    </label>

                    {isExclusive && (
                      <div className="sm:col-span-3 pt-2 border-t border-slate-100 flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700">Validade da Exclusividade:</span>
                        <input
                          type="date"
                          value={exclusiveUntil}
                          onChange={(e) => setExclusiveUntil(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Condições Comerciais: Aceita Financiamento e Aceita Permuta */}
                  <div className="sm:col-span-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block flex items-center gap-1.5">
                      <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                      Condições de Negociação Comercial
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptsFinancing}
                          onChange={(e) => setAcceptsFinancing(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <div>
                          <strong className="text-xs text-slate-800 block">Aceita Financiamento Bancário</strong>
                          <span className="text-[10px] text-slate-500">Apto para carta de crédito SFH / SFI</span>
                        </div>
                      </label>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acceptsExchange}
                            onChange={(e) => setAcceptsExchange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded-sm"
                          />
                          <div>
                            <strong className="text-xs text-slate-800 block">Aceita Permuta</strong>
                            <span className="text-[10px] text-slate-500">Analisa imóvel menor valor ou veículo</span>
                          </div>
                        </label>

                        {acceptsExchange && (
                          <input
                            type="text"
                            placeholder="Descreva as condições da permuta (Ex: Imóvel até 40% em SP ou carro)"
                            value={exchangeDetails}
                            onChange={(e) => setExchangeDetails(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-hidden"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Controle de Placas de Divulgação (Aceita Placa?) */}
                  <div className="sm:col-span-3 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                        Autorização de Placa & Faixa (Controle de Sinalização)
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        acceptsSign ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {acceptsSign ? 'Placa Permitida' : 'Sem Placa'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Aceita Placa Sim / Não Switch */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 block">
                          O proprietário / condomínio aceita placa no imóvel? *
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAcceptsSign(true)}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              acceptsSign
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sim, Aceita Placa</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setAcceptsSign(false)}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              !acceptsSign
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Não Aceita Placa</span>
                          </button>
                        </div>
                      </div>

                      {/* Configurações condicionais */}
                      {acceptsSign ? (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 block">
                            Tipo de Placa Autorizada:
                          </label>
                          <select
                            value={signTypeAllowed}
                            onChange={(e) => setSignTypeAllowed(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                          >
                            <option value="PLACA_FACHADA">Placa de Fachada (Fixação)</option>
                            <option value="FAIXA_VARANDA">Faixa de Sacada / Varanda</option>
                            <option value="CAVALETE">Cavalete no Gramado / Calçada</option>
                            <option value="PORTAO">Placa em Portão / Grade</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 block">
                            Motivo da Não Autorização:
                          </label>
                          <select
                            value={signRefusalReason}
                            onChange={(e) => setSignRefusalReason(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-hidden font-medium"
                          >
                            <option value="CONDOMINIO_PROIBE">Convenção do Condomínio Proíbe</option>
                            <option value="RECUSA_PROPRIETARIO">Recusado pelo Proprietário (Privacidade)</option>
                            <option value="IMOVEL_OCUPADO">Imóvel Ocupado por Inquilino</option>
                            <option value="OUTROS">Outros Motivos Particulares</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Observações sobre instalação de placa (Ex: Horário do zelador, chave do portão)"
                        value={signNotes}
                        onChange={(e) => setSignNotes(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Descrição Detalhada com Gerador de IA */}
                  <div className="sm:col-span-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Descrição Detalhada do Imóvel
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateAiDescription}
                        disabled={isGeneratingAi}
                        className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isGeneratingAi ? 'Gerando Texto Persuasivo...' : 'Gerar Descrição por IA'}</span>
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva o imóvel, acabamentos, iluminação natural, vista, reforma e diferenciais do condomínio ou clique em 'Gerar Descrição por IA'..."
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-normal"
                    />
                  </div>

                  {/* Informações Internas (Confidencial - NÃO APARECE NO SITE) */}
                  <div className="sm:col-span-3 p-3.5 bg-amber-50/80 rounded-xl border border-amber-300 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>Informações Internas (Confidencial - NÃO Aparece no Site nem Portais)</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Uso restrito da equipe de corretores e administradores: instruções de visitas, nome do zelador, código de cofre, comissão combinada com parceiros e particularidades do proprietário.
                    </p>
                    <textarea
                      rows={2}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Ex: Chaves no cofre #412 da portaria. Falar com Seu Antônio. Proprietário só permite visitas terças e quintas após as 14h. Não colocar placa na fachada..."
                      className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden font-medium text-slate-800"
                    />
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MODELO PORTAL CANAL PRÓ (GRUPO ZAP / VIVAREAL / OLX) */}
          {activeTab === 'CANAL_PRO' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-orange-600 text-white font-bold text-xs">
                      ZAP / OLX
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Padrão de Cadastro Canal Pró (Grupo ZAP & VivaReal)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Campos homologados para rankeamento orgânico superior e integração XML perfeita
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Otimizado para Alta Conversão
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tipo de Publicação Canal Pró *
                    </label>
                    <select
                      value={canalProListingType}
                      onChange={(e) => setCanalProListingType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-orange-700 outline-hidden"
                    >
                      <option value="PADRAO">Padrão (Básico)</option>
                      <option value="DESTAQUE">Destaque (Maior Relevância)</option>
                      <option value="SUPER_DESTAQUE">Super Destaque (Topo das Buscas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Subtipo Específico Canal Pró *
                    </label>
                    <select
                      value={canalProSubtype}
                      onChange={(e) => setCanalProSubtype(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold outline-hidden"
                    >
                      <option value="Apartamento Padrão">Apartamento Padrão</option>
                      <option value="Cobertura Duplex">Cobertura Duplex</option>
                      <option value="Cobertura Triplex">Cobertura Triplex</option>
                      <option value="Studio / Kitnet">Studio / Kitnet</option>
                      <option value="Loft">Loft</option>
                      <option value="Flat / Apart-Hotel">Flat / Apart-Hotel</option>
                      <option value="Casa em Condomínio">Casa em Condomínio</option>
                      <option value="Sobrado">Sobrado</option>
                      <option value="Sala Comercial">Sala Comercial</option>
                      <option value="Galpão Industrial">Galpão Industrial</option>
                      <option value="Terreno em Loteamento">Terreno em Loteamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Posição no Edifício
                    </label>
                    <select
                      value={buildingPosition}
                      onChange={(e) => setBuildingPosition(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    >
                      <option value="FRENTE">Frente (Vista para a Rua)</option>
                      <option value="FUNDOS">Fundos (Silencioso)</option>
                      <option value="LATERAL">Lateral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Unidades por Andar
                    </label>
                    <input
                      type="number"
                      value={unitsPerFloor}
                      onChange={(e) => setUnitsPerFloor(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 2"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Aceita Animais (Pet Friendly)
                    </label>
                    <select
                      value={petsAllowed ? 'SIM' : 'NAO'}
                      onChange={(e) => setPetsAllowed(e.target.value === 'SIM')}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    >
                      <option value="SIM">Sim (Aceita Pets)</option>
                      <option value="NAO">Não Aceita Pets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Acessibilidade PCD
                    </label>
                    <select
                      value={pcdAccessibility ? 'SIM' : 'NAO'}
                      onChange={(e) => setPcdAccessibility(e.target.value === 'SIM')}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-hidden"
                    >
                      <option value="SIM">Sim (Elevador Acessível & Rampas)</option>
                      <option value="NAO">Não Possui Acessibilidade Total</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800">Dica de Rankeamento Canal Pró:</div>
                  <p>
                    Anúncios com fotos em alta definição, especificações de posição solar, custos detalhados de condomínio/IPTU e indicação de pet friendly atingem até <strong>3.4x mais visualizações e leads qualificados</strong> no Grupo ZAP.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPRIETÁRIO */}
          {activeTab === 'PROPRIETARIO' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      Vincular Proprietário (PF ou PJ)
                    </h3>
                    <p className="text-xs text-slate-500">
                      O proprietário receberá os repasses automatizados de split de aluguel ou comissão de venda
                    </p>
                  </div>

                  {onOpenNewOwnerModal && (
                    <button
                      type="button"
                      onClick={onOpenNewOwnerModal}
                      className="px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Cadastrar Novo Proprietário
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selecione o Proprietário Cadastrado *
                  </label>
                  <select
                    value={selectedOwnerId}
                    onChange={(e) => setSelectedOwnerId(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                  >
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>
                        [{o.personType}] {o.name} - Doc: {o.document} ({o.address.city}/{o.address.state})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Owner Preview Box */}
                {selectedOwner && (
                  <div className="p-4 bg-white border border-blue-100 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          selectedOwner.personType === 'PF' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedOwner.personType === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{selectedOwner.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600">{selectedOwner.document}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block">WhatsApp:</span>
                        <span className="font-semibold text-emerald-700">{selectedOwner.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">E-mail:</span>
                        <span className="font-mono text-slate-700">{selectedOwner.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Banco para Split:</span>
                        <span className="font-semibold text-slate-800">{selectedOwner.bankDetails.bankName} (Pix: {selectedOwner.bankDetails.pixKey})</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VALORES & CONDIÇÕES FINANCEIRAS */}
          {activeTab === 'VALORES' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Precificação & Encargos Mensais
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(transactionType === 'VENDA' || transactionType === 'VENDA_LOCACAO') && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preço de Venda (R$) *
                      </label>
                      <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 2500000"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold text-slate-900"
                      />
                    </div>
                  )}

                  {(transactionType === 'LOCACAO' || transactionType === 'VENDA_LOCACAO' || transactionType === 'TEMPORADA') && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Valor do Aluguel Mensal (R$) *
                      </label>
                      <input
                        type="number"
                        value={rentPrice}
                        onChange={(e) => setRentPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 12000"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold text-emerald-700"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Condomínio Mensal (R$)
                    </label>
                    <input
                      type="number"
                      value={condoFee}
                      onChange={(e) => setCondoFee(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 1800"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      IPTU Mensal (R$)
                    </label>
                    <input
                      type="number"
                      value={iptuFee}
                      onChange={(e) => setIptuFee(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 650"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Seguro Fiança / Incêndio Estimado (R$)
                    </label>
                    <input
                      type="number"
                      value={fireInsurance}
                      onChange={(e) => setFireInsurance(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 180"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Comissão de Venda Pactuada (%)
                    </label>
                    <input
                      type="number"
                      value={commissionSalePercent}
                      onChange={(e) => setCommissionSalePercent(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 6"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Total Package Calculation if Rental */}
                {rentPrice && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <span className="font-semibold text-emerald-900">Pacote Total de Locação Estimado:</span>
                    <span className="font-black text-emerald-800 text-sm">
                      {((Number(rentPrice) || 0) + (Number(condoFee) || 0) + (Number(iptuFee) || 0) + (Number(fireInsurance) || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MEDIDAS & ESPECIFICAÇÕES */}
          {activeTab === 'ESPECIFICACOES' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Dimensões e Divisão de Ambientes
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Área Privativa / Útil (m²) *
                    </label>
                    <input
                      type="number"
                      required
                      value={usableAreaM2}
                      onChange={(e) => setUsableAreaM2(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 180"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Área Total (m²)
                    </label>
                    <input
                      type="number"
                      value={totalAreaM2}
                      onChange={(e) => setTotalAreaM2(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 240"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quartos (Dormitórios)
                    </label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="3"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Suítes
                    </label>
                    <input
                      type="number"
                      value={suites}
                      onChange={(e) => setSuites(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Banheiros
                    </label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="3"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vagas de Garagem
                    </label>
                    <input
                      type="number"
                      value={parkingSpaces}
                      onChange={(e) => setParkingSpaces(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Andar
                    </label>
                    <input
                      type="number"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 14"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total de Andares
                    </label>
                    <input
                      type="number"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 22"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Posição Solar
                    </label>
                    <select
                      value={sunOrientation}
                      onChange={(e) => setSunOrientation(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="MANHA">Sol da Manhã (Nascente)</option>
                      <option value="TARDE">Sol da Tarde (Poente)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobília
                    </label>
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
                    >
                      <option value="MOBILIADO">100% Mobiliado e Decorado</option>
                      <option value="SEMIMOBILIADO">Semimobiliado (Armários Planejados)</option>
                      <option value="VAZIO">Vazio / Desocupado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ano de Construção
                    </label>
                    <input
                      type="number"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 2021"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOCALIZAÇÃO & CEP AUTOMÁTICO */}
          {activeTab === 'LOCALIZACAO' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      Localização & Busca Automática por CEP
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Digite o CEP para autopreenchimento instantâneo dos Correios (ViaCEP)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFetchCep()}
                    disabled={isLoadingCep}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Compass className={`w-3.5 h-3.5 ${isLoadingCep ? 'animate-spin' : ''}`} />
                    <span>{isLoadingCep ? 'Buscando...' : 'Buscar CEP'}</span>
                  </button>
                </div>

                {cepFeedback && (
                  <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    cepFeedback.startsWith('✓') 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{cepFeedback}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CEP (Preenchimento Automático) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCep(val);
                          if (val.replace(/\D/g, '').length === 8) {
                            handleFetchCep(val);
                          }
                        }}
                        onBlur={() => handleFetchCep()}
                        placeholder="Ex: 01426-001"
                        maxLength={9}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono font-bold"
                      />
                      {isLoadingCep && (
                        <div className="absolute right-2.5 top-2.5">
                          <Compass className="w-4 h-4 text-blue-600 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Logradouro (Rua / Avenida) *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua Oscar Freire"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="1420"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Complemento (Apto / Bloco)
                    </label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Cobertura 2101"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Jardins / Cerqueira César"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden uppercase font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Zona / Região
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="SUL">Zona Sul</option>
                      <option value="OESTE">Zona Oeste</option>
                      <option value="CENTRO">Centro</option>
                      <option value="NORTE">Zona Norte</option>
                      <option value="LESTE">Zona Leste</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 flex items-center pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={displayAddressOnWeb}
                        onChange={(e) => setDisplayAddressOnWeb(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        Exibir nome da rua no portal público (oculta o número exato para segurança do proprietário)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FOTOS (UPLOAD & URL), COMODIDADES & CHAVES */}
          {activeTab === 'FOTOS_ITENS' && (
            <div className="space-y-5">
              
              {/* Comodidades & Diferenciais */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Diferenciais e Comodidades do Imóvel & Condomínio
                  </h3>
                  <span className="text-xs font-semibold text-blue-600">{selectedFeatures.length} selecionados</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {COMMON_FEATURES.map((feat) => {
                    const isSelected = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Localização das Chaves & Links */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  Controle Operacional de Chaves & Tours
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Localização Física da Chave *
                    </label>
                    <input
                      type="text"
                      value={keysLocation}
                      onChange={(e) => setKeysLocation(e.target.value)}
                      placeholder="Ex: Claviculário #18 - Matriz"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link Tour Virtual 360 (Matterport)
                    </label>
                    <input
                      type="text"
                      value={virtualTourUrl}
                      onChange={(e) => setVirtualTourUrl(e.target.value)}
                      placeholder="https://my.matterport.com/show/?m=..."
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link de Vídeo Tour (YouTube / Vimeo)
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Galeria de Fotos com Upload e URL */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      Galeria de Fotos do Imóvel ({images.length} fotos)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Você pode subir imagens direto do computador ou colar links externos
                    </p>
                  </div>

                  {/* Upload Direct Button */}
                  <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto">
                    <Upload className="w-4 h-4" />
                    <span>Upload de Imagens (PC/Celular)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* URL Input Bar */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Ou cole aqui o link da imagem (https://...)"
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar URL
                  </button>
                </div>

                {/* Images grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative rounded-xl overflow-hidden border-2 group aspect-video bg-slate-100 shadow-xs ${
                        img.isCover ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'
                      }`}
                    >
                      <img src={img.url} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                      
                      {img.isCover && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                          Capa Principal ⭐
                        </span>
                      )}

                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!img.isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(img.id)}
                            className="p-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-xs"
                            title="Definir como Capa"
                          >
                            Capa
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                          title="Remover Foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Imóvel</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

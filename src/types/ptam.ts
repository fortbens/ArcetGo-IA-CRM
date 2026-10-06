export type PtamStatus = 'RASCUNHO' | 'EM_ANALISE' | 'HOMOLOGADO' | 'EMITIDO';

export type PtamPurpose = 
  | 'VENDA' 
  | 'LOCACAO' 
  | 'JUDICIAL_PARTILHA' 
  | 'GARANTIA_BANCARIA' 
  | 'INVENTARIO' 
  | 'PATRIMONIAL' 
  | 'DESAPROPRIACAO' 
  | 'SEGURO';

export type PropertyStandard = 'LUXO' | 'ALTO' | 'MEDIO_ALTO' | 'MEDIO' | 'POPULAR';
export type PropertyState = 'NOVO' | 'OTIMO' | 'BOM' | 'REGULAR' | 'REFORMA_NECESSARIA';

export interface PtamComparableSample {
  id: string;
  title: string;
  sourcePortal: 'ZAP_IMOVEIS' | 'VIVAREAL' | 'IMOVELWEB' | 'CHAVES_NA_MAO' | 'OLX' | 'SITE_PROPRIO' | 'OUTRO';
  adUrl?: string;
  adDate: string;
  photoUrl: string;
  neighborhood: string;
  distanceFromTargetMeters: number;
  areaM2: number;
  askingPrice: number;
  askingPricePerM2: number;
  offerDiscountFactor: number; // ex: 0.90 (-10% negociação)
  standardFactor: number; // homogeneização de padrão (0.90 a 1.10)
  conservationFactor: number; // homogeneização estado (0.90 a 1.10)
  locationFactor: number; // homogeneização localização (0.95 a 1.05)
  finalHomogenizedPricePerM2: number;
  notes?: string;
}

export interface PtamReport {
  id: string;
  code: string; // Ex: PTAM-2026-0012
  title: string;
  status: PtamStatus;
  purpose: PtamPurpose;
  createdAt: string;
  inspectionDate: string;
  validityDays: number;
  validUntil: string;

  // Solicitante / Cliente
  requester: {
    name: string;
    document: string; // CPF ou CNPJ
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    purposeDescription: string;
  };

  // Avaliador Responsável (Perito Homologado)
  evaluator: {
    name: string;
    creci: string;
    cnai: string; // Cadastro Nacional de Avaliadores Imobiliários
    role: string;
    phone: string;
    email: string;
    certificationSealCode: string;
    digitalSignatureHash: string;
  };

  // Dados da Imobiliária (Personalizados com logo e dados corporativos)
  agency: {
    name: string;
    tradeName: string;
    cnpj: string;
    creciJ: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    website: string;
    logoUrl?: string;
  };

  // Imóvel Avaliando
  targetProperty: {
    id?: string;
    title: string;
    type: string; // Apartamento, Casa, Cobertura, Sala Comercial, etc.
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      cep: string;
      zone: string;
    };
    areas: {
      privateM2: number;
      totalM2: number;
      terrainM2?: number;
      idealFraction?: number;
    };
    rooms: {
      bedrooms: number;
      suites: number;
      bathrooms: number;
      parkingSpaces: number;
    };
    construction: {
      ageYears: number;
      standard: PropertyStandard;
      state: PropertyState;
      floors: number;
      floorNumber?: number;
    };
    registry: {
      registryOffice: string; // Cartório de Registro de Imóveis (ex: 4º RGI de SP)
      registrationNumber: string; // Número da Matrícula (ex: 184.920)
      taxIdIPTU: string; // Inscrição Cadastral / IPTU
      bookOrSheet?: string;
    };
    amenities: string[];
    photos: string[];
    description: string;
  };

  // Diagnóstico Demográfico & Mercadológico (Com IA)
  demographicsAndRegion: {
    neighborhoodSummary: string;
    socioeconomicLevel: 'CLASSE_A' | 'CLASSE_B' | 'CLASSE_C' | 'MISTO';
    averageFamilyIncome: number;
    idhScore: number;
    demographicDensity: string;
    infrastructure: {
      transportation: string;
      education: string;
      health: string;
      commerce: string;
      security: string;
    };
    marketLiquidityRating: 'MUITO_ALTA' | 'ALTA' | 'MODERADA' | 'BAIXA';
    averageSaleDays: number;
    pricePerM2Trend: 'VALORIZACAO_ACENTUADA' | 'VALORIZACAO_ESTAVEL' | 'ESTABILIDADE' | 'DESACELERACAO';
    aiAnalysisNotes: string;
    generatedByAi: boolean;
  };

  // Amostras Coletadas nos Anúncios / Portais
  samples: PtamComparableSample[];

  // Cálculos Estatísticos (Conforme ABNT NBR 14.653 - Método Comparativo Direto)
  calculations: {
    rawAveragePerM2: number;
    homogenizedAveragePerM2: number;
    standardDeviation: number;
    coefficientOfVariation: number; // Em percentual, ex: 8.4% (< 30% conforme NBR)
    confidenceIntervalMin: number;
    confidenceIntervalMax: number;
    recommendedMarketValue: number;
    recommendedRentalValue?: number;
    quickSaleValue: number; // Liquidação forçada (-15% a -20%)
    arbitrageFactorPercentage: number; // Fator de arbítrio (-10% a +10%)
    arbitrageJustification: string;
  };

  // Termos Legais & Normas CRECI / COFECI
  legalTerms: {
    resolutionCofeci: string; // Resolução COFECI nº 1.066/2007 e Ato Normativo nº 001/2008
    standardAbnt: string; // ABNT NBR 14.653
    declaration: string;
    sealNumber: string;
    qrCodeVerificationUrl: string;
  };
}

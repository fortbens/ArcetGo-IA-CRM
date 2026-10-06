import { DevelopmentUnit, UnitStatus } from './crm';

export interface ConstructionStage {
  overallPercent: number;
  foundationPercent: number;
  structurePercent: number;
  masonryPercent: number;
  installationsPercent: number;
  finishingPercent: number;
  paintingPercent: number;
  landscapingPercent: number;
  lastUpdatedDate: string;
  supervisorName: string;
  notes: string;
  photos: Array<{
    id: string;
    stageName: string;
    imageUrl: string;
    caption: string;
    date: string;
  }>;
}

export interface LaunchCommissionRule {
  totalPercent: number; // e.g. 5%
  brokerPercent: number; // e.g. 2.2%
  agencyPercent: number; // e.g. 2.3%
  managerPercent: number; // e.g. 0.5%
  bonusPrizeText?: string; // e.g. "Bônus de R$ 10.000 por unidade fechada"
  paymentTerms: string; // e.g. "50% após compensação do sinal, 50% após emissão do contrato de compra"
  contractorVgvGoal?: number; // e.g. 30000000
}

export interface LaunchTechnicalSheet {
  totalTowers: number;
  totalFloors: number;
  unitsPerFloor: number;
  totalLandAreaM2: number;
  architect: string;
  interiorDesigner: string;
  landscapeArchitect: string;
  totalElevators: number;
  parkingType: 'DETERMINADAS' | 'ROTATIVAS' | 'SUBSOLO_LIVRE';
  electricCarCharger: boolean;
  typologies: string[];
  amenities: string[];
  securityFeatures: string[];
  sustainability: string[];
}

export interface FloorPlanMaterial {
  id: string;
  typologyName: string;
  privateAreaM2: number;
  bedrooms: number;
  suites: number;
  parkingSpaces: number;
  imageUrl: string;
  blueprintHighResUrl: string;
  description: string;
}

export interface BrochureDocument {
  id: string;
  title: string;
  category: 'LIVRO_DO_PRODUTO' | 'TABELA_OFICIAL' | 'MEMORIAL_DESCRITIVO' | 'REGISTRO_INCORPORACAO';
  fileUrl: string;
  fileSizeMb: string;
  uploadedAt: string;
}

export interface SalesTableFlowConfig {
  tableCode: string;
  validUntil: string;
  inccAnnualEstimate: number; // e.g. 5.5%
  signalPercent: number; // e.g. 10%
  thirtyDaysPercent: number; // e.g. 5%
  sixtyDaysPercent: number; // e.g. 5%
  monthlyInstallmentsCount: number; // e.g. 28
  monthlyInstallmentsTotalPercent: number; // e.g. 15%
  semiAnnualInstallmentsCount: number; // e.g. 4
  semiAnnualInstallmentsTotalPercent: number; // e.g. 10%
  keysDeliveryPercent: number; // e.g. 15%
  bankFinancingPercent: number; // e.g. 40%
  specialCashDiscountPercent: number; // e.g. 8%
}

export interface LaunchDevelopment {
  id: string;
  code: string; // e.g. "LANC-JARDINS-01"
  title: string;
  tagline: string;
  builderName: string; // Construtora
  developerName: string; // Incorporadora
  incorporationRegistryNumber: string; // RI - Registro de Incorporação (Lei 4.591/64)
  neighborhood: string;
  city: string;
  state: string;
  address: string;
  deliveryDate: string; // e.g. "Dezembro de 2027"
  status: 'PRE_LANCAMENTO' | 'LANCAMENTO_OFICIAL' | 'OBRAS_ACELERADAS' | 'PRONTO_PARA_MORAR';
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  blockedUnits: number;
  bannerUrl: string;
  logoUrl?: string;
  videoTourUrl?: string;
  virtualTour360Url?: string;
  towers: string[];
  units: DevelopmentUnit[];
  technicalSheet: LaunchTechnicalSheet;
  constructionStage: ConstructionStage;
  commissionRules: LaunchCommissionRule;
  floorPlans: FloorPlanMaterial[];
  documents: BrochureDocument[];
  salesTableConfig: SalesTableFlowConfig;
  renderGallery: string[];
  createdAt: string;
  updatedAt?: string;
}

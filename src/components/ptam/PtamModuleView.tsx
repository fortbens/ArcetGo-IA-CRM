import React, { useState, useMemo } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  Printer,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  MapPin,
  TrendingUp,
  X,
  Layers,
  Home,
  Check,
  RotateCcw,
  Sliders,
  Send,
  Download
} from 'lucide-react';
import { PtamReport, PtamStatus, PtamPurpose, PtamComparableSample, PropertyStandard, PropertyState } from '../../types/ptam';
import { INITIAL_PTAMS } from '../../data/mockPtamData';
import { RealEstateProperty, UserProfile } from '../../types/crm';
import { SystemThemeConfig } from '../../types/theme';
import { PtamPrintCreciModal } from './PtamPrintCreciModal';
import { generatePtamDemographicsAndMarketIa, generatePtamComparableSamplesIa } from '../../services/aiService';

interface PtamModuleViewProps {
  properties?: RealEstateProperty[];
  currentUser?: UserProfile;
  themeConfig?: SystemThemeConfig;
  onSelectProperty?: (prop: RealEstateProperty) => void;
}

export const PtamModuleView: React.FC<PtamModuleViewProps> = ({
  properties = [],
  currentUser,
  themeConfig
}) => {
  const [reports, setReports] = useState<PtamReport[]>(INITIAL_PTAMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('TODOS');
  const [selectedPurposeFilter, setSelectedPurposeFilter] = useState<string>('TODAS');

  // Modal de Impressão Oficial CRECI A4
  const [printModalReport, setPrintModalReport] = useState<PtamReport | null>(null);

  // Modal de Edição / Criação de Laudo PTAM
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<PtamReport | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'DADOS' | 'IMOVEL' | 'IA_DEMOGRAFICO' | 'AMOSTRAS' | 'CALCULOS' | 'PERITO'>('DADOS');

  // Estados de IA no Editor
  const [isGeneratingDemographicsIa, setIsGeneratingDemographicsIa] = useState(false);
  const [isGeneratingSamplesIa, setIsGeneratingSamplesIa] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Estatísticas do Módulo
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const totalVgv = reports.reduce((acc, r) => acc + r.calculations.recommendedMarketValue, 0);
    const avgM2 = reports.length > 0 
      ? reports.reduce((acc, r) => acc + r.calculations.homogenizedAveragePerM2, 0) / reports.length 
      : 0;
    const certifiedCount = reports.filter(r => r.status === 'HOMOLOGADO' || r.status === 'EMITIDO').length;
    return { totalReports, totalVgv, avgM2, certifiedCount };
  }, [reports]);

  // Filtros de Relatórios
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchSearch = 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.targetProperty.address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = selectedStatusFilter === 'TODOS' || r.status === selectedStatusFilter;
      const matchPurpose = selectedPurposeFilter === 'TODAS' || r.purpose === selectedPurposeFilter;

      return matchSearch && matchStatus && matchPurpose;
    });
  }, [reports, searchQuery, selectedStatusFilter, selectedPurposeFilter]);

  // Abertura do Modal de Novo PTAM
  const handleOpenNewPtam = (sourceProperty?: RealEstateProperty) => {
    const newCode = `PTAM-2026-${String(reports.length + 1).padStart(4, '0')}`;
    const today = new Date().toISOString().slice(0, 10);
    const validDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const propStreet = sourceProperty?.address?.street || 'Av. Paulista';
    const propNumber = sourceProperty?.address?.number || '1000';
    const propNeighborhood = sourceProperty?.address?.neighborhood || 'Bela Vista';
    const propCity = sourceProperty?.address?.city || 'São Paulo';
    const propState = sourceProperty?.address?.state || 'SP';
    const propCep = sourceProperty?.address?.cep || '01310-100';
    const propZone = sourceProperty?.address?.zone ? `Zona ${sourceProperty.address.zone}` : 'Zona Sul';
    const propType = sourceProperty?.propertyType ? String(sourceProperty.propertyType) : 'Apartamento';
    const propArea = sourceProperty?.specs?.usableAreaM2 || sourceProperty?.specs?.totalAreaM2 || 120;
    const propTotalArea = sourceProperty?.specs?.totalAreaM2 || Math.round(propArea * 1.45);
    const propPrice = sourceProperty?.pricing?.salePrice || sourceProperty?.pricing?.rentPrice || 1200000;
    const propPhotos = (sourceProperty?.images && sourceProperty.images.length > 0)
      ? sourceProperty.images.map(img => img.url)
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'];

    const initialNewReport: PtamReport = {
      id: `ptam_${Date.now()}`,
      code: newCode,
      title: sourceProperty ? `Parecer Técnico de Avaliação - ${sourceProperty.title}` : 'Novo Parecer Técnico de Avaliação Mercadológica',
      status: 'RASCUNHO',
      purpose: 'VENDA',
      createdAt: today,
      inspectionDate: today,
      validityDays: 90,
      validUntil: validDate,

      requester: {
        name: sourceProperty?.ownerName || 'Nome do Requerente / Proprietário',
        document: sourceProperty?.ownerDocument || '000.000.000-00',
        phone: sourceProperty?.ownerPhone || '(11) 90000-0000',
        email: 'contato@cliente.com.br',
        address: sourceProperty?.address ? `${propStreet}, ${propNumber}` : 'Endereço do Requerente',
        city: propCity,
        state: propState,
        purposeDescription: 'Determinação fundamentada do valor de mercado para negociação imobiliária.'
      },

      evaluator: {
        name: currentUser?.name || 'Emerson Carneiro dos Santos',
        creci: currentUser?.creci || '128.490-F / SP',
        cnai: 'CNAI 42.890',
        role: 'Perito Avaliador Imobiliário Homologado',
        phone: currentUser?.phone || '(11) 99864-2424',
        email: currentUser?.email || 'diretorcarneiro@gmail.com',
        certificationSealCode: `CNAI-SP-2026-${Math.floor(100000 + Math.random() * 900000)}-E`,
        digitalSignatureHash: 'SHA256: e8b941029c78d0f1a23b45c67e89f012a34b56c78d90e1f2a3b4c5d6e7f8a9b0'
      },

      agency: {
        name: themeConfig?.platformName ? `${themeConfig.platformName} Gestão Imobiliária Ltda` : 'AcertGo Gestão Imobiliária & Soluções ERP Ltda',
        tradeName: themeConfig?.platformName || 'AcertGo Imóveis',
        cnpj: '18.492.341/0001-92',
        creciJ: '34.890-J / SP',
        address: 'Av. Brigadeiro Faria Lima, 3477 - 12º Andar, Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        phone: '(11) 99864-2424',
        email: 'diretorcarneiro@gmail.com',
        website: 'www.acertgo.com.br',
        logoUrl: themeConfig?.logoUrl || ''
      },

      targetProperty: {
        id: sourceProperty?.id || '',
        title: sourceProperty?.title || 'Imóvel Residencial / Comercial',
        type: propType,
        address: {
          street: propStreet,
          number: propNumber,
          neighborhood: propNeighborhood,
          city: propCity,
          state: propState,
          cep: propCep,
          zone: propZone
        },
        areas: {
          privateM2: propArea,
          totalM2: propTotalArea,
          terrainM2: propType === 'CASA' || propType === 'TERRENO' ? 300 : undefined
        },
        rooms: {
          bedrooms: sourceProperty?.specs?.bedrooms || 3,
          suites: sourceProperty?.specs?.suites || 1,
          bathrooms: sourceProperty?.specs?.bathrooms || 2,
          parkingSpaces: sourceProperty?.specs?.parkingSpaces || 2
        },
        construction: {
          ageYears: 10,
          standard: 'ALTO',
          state: 'BOM',
          floors: sourceProperty?.specs?.totalFloors || 15,
          floorNumber: sourceProperty?.specs?.floor || 5
        },
        registry: {
          registryOffice: 'Cartório de Registro de Imóveis',
          registrationNumber: 'Matrícula nº 00.000',
          taxIdIPTU: '000.000.0000-0'
        },
        amenities: sourceProperty?.features || ['Varanda', 'Garagem coberta', 'Segurança 24h', 'Elevador'],
        photos: propPhotos,
        description: sourceProperty?.description || 'Excelente imóvel em localização privilegiada, planta bem distribuída e ótima ventilação.'
      },

      demographicsAndRegion: {
        neighborhoodSummary: `O bairro ${propNeighborhood} conta com infraestrutura de mobilidade, serviços consolidados e atratividade comercial constante.`,
        socioeconomicLevel: 'CLASSE_B',
        averageFamilyIncome: 18500,
        idhScore: 0.935,
        demographicDensity: '7.800 hab/km² com perfil de famílias de classe média-alta e profissionais liberais',
        infrastructure: {
          transportation: 'Fácil acesso a corredores de ônibus e estações de metrô.',
          education: 'Colégios de tradição no raio de 1.5km.',
          health: 'Prontos-socorros e clínicas especializadas na proximidade.',
          commerce: 'Comércio variado, agências bancárias e supermercados.',
          security: 'Policiamento regular e iluminação pública moderna.'
        },
        marketLiquidityRating: 'ALTA',
        averageSaleDays: 75,
        pricePerM2Trend: 'VALORIZACAO_ESTAVEL',
        aiAnalysisNotes: 'Absorção contínua na região com baixa margem de deságio para imóveis bem conservados.',
        generatedByAi: false
      },

      samples: [
        {
          id: `smp_init_1`,
          title: `Imóvel Comparável 1 em ${propNeighborhood}`,
          sourcePortal: 'ZAP_IMOVEIS',
          adUrl: 'https://www.zapimoveis.com.br/',
          adDate: today,
          photoUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=300&auto=format&fit=crop&q=80',
          neighborhood: propNeighborhood,
          distanceFromTargetMeters: 250,
          areaM2: propArea,
          askingPrice: propPrice * 1.08,
          askingPricePerM2: Math.round((propPrice * 1.08) / propArea),
          offerDiscountFactor: 0.92,
          standardFactor: 1.00,
          conservationFactor: 1.00,
          locationFactor: 1.00,
          finalHomogenizedPricePerM2: Math.round(((propPrice * 1.08) / propArea) * 0.92),
          notes: 'Anúncio recente coletado em portal com metragem compatível.'
        }
      ],

      calculations: {
        rawAveragePerM2: Math.round(propPrice / propArea),
        homogenizedAveragePerM2: Math.round((propPrice / propArea) * 0.95),
        standardDeviation: 320,
        coefficientOfVariation: 2.5,
        confidenceIntervalMin: Math.round((propPrice / propArea) * 0.90),
        confidenceIntervalMax: Math.round((propPrice / propArea) * 1.00),
        recommendedMarketValue: propPrice,
        recommendedRentalValue: Math.round(propPrice * 0.005),
        quickSaleValue: Math.round(propPrice * 0.85),
        arbitrageFactorPercentage: 0,
        arbitrageJustification: 'Adotado o valor homogêneo do MCDDM NBR 14.653.'
      },

      legalTerms: {
        resolutionCofeci: 'Parecer Técnico de Avaliação Mercadológica emitido em estrita consonância com a Resolução COFECI nº 1.066/2007 e Ato Normativo COFECI nº 001/2008.',
        standardAbnt: 'Laudo pericial estruturado nos preceitos da ABNT NBR 14.653-1 e NBR 14.653-2.',
        declaration: 'Declaro sob as penas da lei que vistoriei o imóvel avaliando e mantive estrita independência e imparcialidade técnica.',
        sealNumber: `CNAI 42.890 - Selo Oficial Certificador COFECI nº 2026.10.${Math.floor(10000 + Math.random() * 90000)}-SP`,
        qrCodeVerificationUrl: 'https://verificador.cofeci.gov.br/ptam/autenticidade'
      }
    };

    setEditingReport(initialNewReport);
    setActiveEditorTab('DADOS');
    setIsEditorOpen(true);
  };

  // Excluir laudo
  const handleDeleteReport = (reportId: string) => {
    if (confirm('Deseja realmente remover este Laudo PTAM da base?')) {
      setReports(prev => prev.filter(r => r.id !== reportId));
      showToast('Laudo PTAM removido com sucesso!');
    }
  };

  // Clonar laudo
  const handleCloneReport = (report: PtamReport) => {
    const clone: PtamReport = {
      ...report,
      id: `ptam_${Date.now()}`,
      code: `PTAM-2026-${String(reports.length + 1).padStart(4, '0')}`,
      title: `${report.title} (Cópia)`,
      status: 'RASCUNHO',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setReports(prev => [clone, ...prev]);
    showToast('Laudo clonado como Rascunho com sucesso!');
  };

  // Salvar alterações no editor
  const handleSaveEditor = () => {
    if (!editingReport) return;

    // Recalcular métricas estatísticas baseadas nas amostras
    const samples = editingReport.samples;
    let avgHomog = 0;
    if (samples.length > 0) {
      const sum = samples.reduce((acc, s) => acc + s.finalHomogenizedPricePerM2, 0);
      avgHomog = sum / samples.length;
    }
    const finalRecValue = Math.round(avgHomog * (editingReport.targetProperty.areas.privateM2 || 100));

    const updated: PtamReport = {
      ...editingReport,
      calculations: {
        ...editingReport.calculations,
        homogenizedAveragePerM2: Math.round(avgHomog),
        recommendedMarketValue: finalRecValue,
        recommendedRentalValue: Math.round(finalRecValue * 0.005),
        quickSaleValue: Math.round(finalRecValue * 0.85)
      }
    };

    setReports(prev => {
      const idx = prev.findIndex(r => r.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });

    setIsEditorOpen(false);
    setEditingReport(null);
    showToast('Laudo PTAM salvo com sucesso no banco de dados!');
  };

  // Disparar IA para Diagnóstico Demográfico
  const handleRunDemographicsIa = async () => {
    if (!editingReport) return;
    setIsGeneratingDemographicsIa(true);
    try {
      const result = await generatePtamDemographicsAndMarketIa({
        neighborhood: editingReport.targetProperty.address.neighborhood,
        city: editingReport.targetProperty.address.city,
        state: editingReport.targetProperty.address.state,
        propertyType: editingReport.targetProperty.type,
        privateM2: editingReport.targetProperty.areas.privateM2,
        estimatedPrice: editingReport.calculations.recommendedMarketValue
      });

      setEditingReport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          demographicsAndRegion: {
            ...result,
            generatedByAi: true
          }
        };
      });
      showToast('Diagnóstico demográfico & mercadológico gerado com IA com sucesso!');
    } catch (e) {
      console.error(e);
      showToast('Erro ao consultar IA. Dados padrão aplicados.');
    } finally {
      setIsGeneratingDemographicsIa(false);
    }
  };

  // Disparar IA para Sugerir Amostras de Anúncios
  const handleRunSamplesIa = async () => {
    if (!editingReport) return;
    setIsGeneratingSamplesIa(true);
    try {
      const generatedSamples = await generatePtamComparableSamplesIa({
        neighborhood: editingReport.targetProperty.address.neighborhood,
        city: editingReport.targetProperty.address.city,
        propertyType: editingReport.targetProperty.type,
        privateM2: editingReport.targetProperty.areas.privateM2,
        referencePricePerM2: editingReport.calculations.homogenizedAveragePerM2
      });

      const formatted: PtamComparableSample[] = generatedSamples.map((gs, idx) => {
        const homogM2 = Math.round(
          (gs.askingPrice / gs.areaM2) *
          gs.offerDiscountFactor *
          gs.standardFactor *
          gs.conservationFactor *
          gs.locationFactor
        );
        return {
          id: `smp_ai_${Date.now()}_${idx}`,
          title: gs.title,
          sourcePortal: gs.sourcePortal,
          adUrl: gs.adUrl,
          adDate: new Date().toISOString().slice(0, 10),
          photoUrl: gs.photoUrl,
          neighborhood: `${editingReport.targetProperty.address.neighborhood} (a ${gs.distanceFromTargetMeters}m)`,
          distanceFromTargetMeters: gs.distanceFromTargetMeters,
          areaM2: gs.areaM2,
          askingPrice: gs.askingPrice,
          askingPricePerM2: Math.round(gs.askingPrice / gs.areaM2),
          offerDiscountFactor: gs.offerDiscountFactor,
          standardFactor: gs.standardFactor,
          conservationFactor: gs.conservationFactor,
          locationFactor: gs.locationFactor,
          finalHomogenizedPricePerM2: homogM2,
          notes: gs.notes
        };
      });

      setEditingReport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          samples: [...prev.samples, ...formatted]
        };
      });
      showToast('Amostras comparáveis coletadas via IA com sucesso!');
    } catch (e) {
      console.error(e);
      showToast('Erro ao buscar comparáveis de anúncios.');
    } finally {
      setIsGeneratingSamplesIa(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Avaliação Mercadológica (PTAM)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  COFECI • CRECI • CNAI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Geração de Pareceres Técnicos de Avaliação Mercadológica em estrita conformidade com a <strong>Resolução COFECI nº 1.066/2007</strong> e <strong>ABNT NBR 14.653</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleOpenNewPtam()}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Laudo PTAM</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold block">Laudos Cadastrados</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalReports}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Total no banco corporativo</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold block">VGV Total Avaliado</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            R$ {(stats.totalVgv / 1000000).toFixed(1)}M
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Soma de valores concluídos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold block">Preço Médio Homogeneizado</span>
          <div className="text-2xl font-black text-blue-700 mt-1">
            R$ {stats.avgM2.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/m²
          </div>
          <span className="text-[10px] text-blue-600 mt-0.5 block">MCDDM ABNT NBR 14.653</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold block">Selo Certificador CNAI</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{stats.certifiedCount}</div>
          <span className="text-[10px] text-purple-600 font-bold mt-0.5 block">Laudos com chancela oficial</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código, solicitante, imóvel ou bairro..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="HOMOLOGADO">Homologado</option>
            <option value="EMITIDO">Emitido</option>
            <option value="EM_ANALISE">Em Análise</option>
            <option value="RASCUNHO">Rascunho</option>
          </select>

          <select
            value={selectedPurposeFilter}
            onChange={(e) => setSelectedPurposeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="TODAS">Todas as Finalidades</option>
            <option value="VENDA">Venda</option>
            <option value="LOCACAO">Locação</option>
            <option value="GARANTIA_BANCARIA">Garantia Bancária</option>
            <option value="JUDICIAL_PARTILHA">Judicial / Partilha</option>
            <option value="INVENTARIO">Inventário</option>
          </select>
        </div>
      </div>

      {/* Grid de Laudos PTAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map(report => (
          <div
            key={report.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {report.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      report.status === 'HOMOLOGADO' ? 'bg-emerald-100 text-emerald-800' :
                      report.status === 'EMITIDO' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'EM_ANALISE' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1 line-clamp-1">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{report.targetProperty.address.neighborhood}, {report.targetProperty.address.city}/{report.targetProperty.address.state}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor Concluído</span>
                  <span className="text-base sm:text-lg font-black text-emerald-700">
                    R$ {report.calculations.recommendedMarketValue.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Informações Resumidas */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Área Privativa</span>
                  <span className="font-bold text-slate-800">{report.targetProperty.areas.privateM2} m²</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">R$/m² Homog.</span>
                  <span className="font-bold text-slate-800">
                    R$ {report.calculations.homogenizedAveragePerM2.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Amostras (Ads)</span>
                  <span className="font-bold text-slate-800">{report.samples.length} comparáveis</span>
                </div>
              </div>

              {/* Solicitante & Perito */}
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>
                  <span className="text-slate-400">Solicitante:</span> <strong>{report.requester.name}</strong> ({report.purpose})
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Avaliador: <strong>{report.evaluator.name}</strong> • {report.evaluator.cnai}</span>
                </div>
              </div>
            </div>

            {/* Ações do Card */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPrintModalReport(report)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Abrir visualização para Impressão Padrão CRECI A4"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir CRECI (A4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingReport(JSON.parse(JSON.stringify(report)));
                    setActiveEditorTab('DADOS');
                    setIsEditorOpen(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Editar Laudo"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCloneReport(report)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Clonar Laudo"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReport(report.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Excluir Laudo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                Emissão: {report.createdAt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MODAL DE EDIÇÃO E CRIAÇÃO DO PTAM (WIZARD COMPLETO)       */}
      {/* ========================================================= */}
      {isEditorOpen && editingReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header do Editor */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    {editingReport.id ? `Editar Laudo ${editingReport.code}` : 'Criar Novo Laudo PTAM'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Resolução COFECI nº 1.066/2007 • ABNT NBR 14.653
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintModalReport(editingReport)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>Prévia Impressão</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditorOpen(false); setEditingReport(null); }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Abas do Editor */}
            <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
              {[
                { id: 'DADOS' as const, label: '1. Solicitante & Finalidade' },
                { id: 'IMOVEL' as const, label: '2. Imóvel Avaliando' },
                { id: 'IA_DEMOGRAFICO' as const, label: '3. IA Demográfica & Região' },
                { id: 'AMOSTRAS' as const, label: '4. Amostras de Anúncios' },
                { id: 'CALCULOS' as const, label: '5. Cálculos & Conclusão' },
                { id: 'PERITO' as const, label: '6. Perito & Imobiliária' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeEditorTab === tab.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Conteúdo das Abas */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* ABA 1: DADOS GERAIS & SOLICITANTE */}
              {activeEditorTab === 'DADOS' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Título do Laudo PTAM *</label>
                      <input
                        type="text"
                        value={editingReport.title}
                        onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Finalidade da Avaliação *</label>
                      <select
                        value={editingReport.purpose}
                        onChange={(e) => setEditingReport({ ...editingReport, purpose: e.target.value as PtamPurpose })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      >
                        <option value="VENDA">Determinação de Valor de Venda</option>
                        <option value="LOCACAO">Determinação de Valor de Locação</option>
                        <option value="GARANTIA_BANCARIA">Garantia Bancária / Alienação Fiduciária</option>
                        <option value="JUDICIAL_PARTILHA">Judicial / Partilha de Bens</option>
                        <option value="INVENTARIO">Inventário e Sucessão</option>
                        <option value="PATRIMONIAL">Reavaliação Patrimonial Societária</option>
                        <option value="DESAPROPRIACAO">Desapropriação / Indenização</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Dados do Solicitante / Requerente
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-600">Nome Completo / Razão Social</label>
                        <input
                          type="text"
                          value={editingReport.requester.name}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            requester: { ...editingReport.requester, name: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-600">CPF ou CNPJ</label>
                        <input
                          type="text"
                          value={editingReport.requester.document}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            requester: { ...editingReport.requester, document: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-600">Telefone</label>
                        <input
                          type="text"
                          value={editingReport.requester.phone}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            requester: { ...editingReport.requester, phone: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-600">E-mail</label>
                        <input
                          type="email"
                          value={editingReport.requester.email}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            requester: { ...editingReport.requester, email: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: IMÓVEL AVALIANDO */}
              {activeEditorTab === 'IMOVEL' && (
                <div className="space-y-4">
                  {/* Seletor rápido de imóvel existente na carteira */}
                  {properties.length > 0 && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-blue-900 block">Puxar dados de um imóvel cadastrado:</span>
                        <span className="text-[11px] text-blue-700">Preencha automaticamente endereço, metragem e características</span>
                      </div>
                      <select
                        onChange={(e) => {
                          const p = properties.find(prop => prop.id === e.target.value);
                          if (p) {
                            const pArea = p.specs?.usableAreaM2 || p.specs?.totalAreaM2 || 100;
                            const pTotalArea = p.specs?.totalAreaM2 || Math.round(pArea * 1.4);
                            const pPhotos = (p.images && p.images.length > 0) ? p.images.map(img => img.url) : undefined;
                            setEditingReport(prev => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                targetProperty: {
                                  ...prev.targetProperty,
                                  title: p.title,
                                  type: String(p.propertyType || 'Apartamento'),
                                  address: {
                                    ...prev.targetProperty.address,
                                    street: p.address?.street || prev.targetProperty.address.street,
                                    number: p.address?.number || prev.targetProperty.address.number,
                                    neighborhood: p.address?.neighborhood || prev.targetProperty.address.neighborhood,
                                    city: p.address?.city || prev.targetProperty.address.city,
                                    state: p.address?.state || prev.targetProperty.address.state,
                                    cep: p.address?.cep || prev.targetProperty.address.cep
                                  },
                                  areas: {
                                    ...prev.targetProperty.areas,
                                    privateM2: pArea,
                                    totalM2: pTotalArea
                                  },
                                  rooms: {
                                    bedrooms: p.specs?.bedrooms || 2,
                                    suites: p.specs?.suites || 1,
                                    bathrooms: p.specs?.bathrooms || 2,
                                    parkingSpaces: p.specs?.parkingSpaces || 1
                                  },
                                  photos: pPhotos || prev.targetProperty.photos
                                }
                              };
                            });
                            showToast(`Dados importados de ${p.title}!`);
                          }
                        }}
                        className="px-3 py-1.5 bg-white border border-blue-300 rounded-xl text-xs text-slate-800"
                      >
                        <option value="">Selecione um imóvel...</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.title} ({p.address?.neighborhood || 'Bairro'})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Bairro do Imóvel *</label>
                      <input
                        type="text"
                        value={editingReport.targetProperty.address.neighborhood}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          targetProperty: {
                            ...editingReport.targetProperty,
                            address: { ...editingReport.targetProperty.address, neighborhood: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Cidade / UF *</label>
                      <input
                        type="text"
                        value={`${editingReport.targetProperty.address.city}/${editingReport.targetProperty.address.state}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('/');
                          setEditingReport({
                            ...editingReport,
                            targetProperty: {
                              ...editingReport.targetProperty,
                              address: {
                                ...editingReport.targetProperty.address,
                                city: parts[0]?.trim() || 'São Paulo',
                                state: parts[1]?.trim() || 'SP'
                              }
                            }
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Metragem Privativa (m²) *</label>
                      <input
                        type="number"
                        value={editingReport.targetProperty.areas.privateM2}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          targetProperty: {
                            ...editingReport.targetProperty,
                            areas: { ...editingReport.targetProperty.areas, privateM2: Number(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Padrão Construtivo</label>
                      <select
                        value={editingReport.targetProperty.construction.standard}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          targetProperty: {
                            ...editingReport.targetProperty,
                            construction: { ...editingReport.targetProperty.construction, standard: e.target.value as PropertyStandard }
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="LUXO">Luxo</option>
                        <option value="ALTO">Alto</option>
                        <option value="MEDIO_ALTO">Médio Alto</option>
                        <option value="MEDIO">Médio</option>
                        <option value="POPULAR">Popular</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Estado de Conservação</label>
                      <select
                        value={editingReport.targetProperty.construction.state}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          targetProperty: {
                            ...editingReport.targetProperty,
                            construction: { ...editingReport.targetProperty.construction, state: e.target.value as PropertyState }
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="NOVO">Novo</option>
                        <option value="OTIMO">Ótimo</option>
                        <option value="BOM">Bom</option>
                        <option value="REGULAR">Regular</option>
                        <option value="REFORMA_NECESSARIA">Reforma Necessária</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Matrícula RGI</label>
                      <input
                        type="text"
                        value={editingReport.targetProperty.registry.registrationNumber}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          targetProperty: {
                            ...editingReport.targetProperty,
                            registry: { ...editingReport.targetProperty.registry, registrationNumber: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Inscrição IPTU</label>
                      <input
                        type="text"
                        value={editingReport.targetProperty.registry.taxIdIPTU}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          targetProperty: {
                            ...editingReport.targetProperty,
                            registry: { ...editingReport.targetProperty.registry, taxIdIPTU: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: IA DEMOGRÁFICA & REGIÃO */}
              {activeEditorTab === 'IA_DEMOGRAFICO' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-sm">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Diagnóstico Demográfico & Mercadológico com IA</span>
                      </div>
                      <p className="text-xs text-indigo-700">
                        A IA pericial analisa automaticamente a renda média, IDH, densidade, transporte e liquidez de {editingReport.targetProperty.address.neighborhood}.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunDemographicsIa}
                      disabled={isGeneratingDemographicsIa}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingDemographicsIa ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingDemographicsIa ? 'Consultando IA...' : 'Atualizar Dados com IA'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Síntese do Bairro para o Laudo</label>
                    <textarea
                      rows={3}
                      value={editingReport.demographicsAndRegion.neighborhoodSummary}
                      onChange={(e) => setEditingReport({
                        ...editingReport,
                        demographicsAndRegion: {
                          ...editingReport.demographicsAndRegion,
                          neighborhoodSummary: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Renda Familiar Média (R$)</label>
                      <input
                        type="number"
                        value={editingReport.demographicsAndRegion.averageFamilyIncome}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          demographicsAndRegion: {
                            ...editingReport.demographicsAndRegion,
                            averageFamilyIncome: Number(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Índice IDH Bairro</label>
                      <input
                        type="number"
                        step="0.001"
                        value={editingReport.demographicsAndRegion.idhScore}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          demographicsAndRegion: {
                            ...editingReport.demographicsAndRegion,
                            idhScore: Number(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Tempo Médio Venda (Dias)</label>
                      <input
                        type="number"
                        value={editingReport.demographicsAndRegion.averageSaleDays}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          demographicsAndRegion: {
                            ...editingReport.demographicsAndRegion,
                            averageSaleDays: Number(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">Classificação Liquidez</label>
                      <select
                        value={editingReport.demographicsAndRegion.marketLiquidityRating}
                        onChange={(e) => setEditingReport({
                          ...editingReport,
                          demographicsAndRegion: {
                            ...editingReport.demographicsAndRegion,
                            marketLiquidityRating: e.target.value as any
                          }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="MUITO_ALTA">Muito Alta</option>
                        <option value="ALTA">Alta</option>
                        <option value="MODERADA">Moderada</option>
                        <option value="BAIXA">Baixa</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 4: AMOSTRAS DE MERCADO (ANÚNCIOS) */}
              {activeEditorTab === 'AMOSTRAS' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                        Amostras Coletadas em Anúncios (NBR 14.653 MCDDM)
                      </h4>
                      <p className="text-xs text-slate-500">
                        {editingReport.samples.length} comparáveis na amostra tratada
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRunSamplesIa}
                        disabled={isGeneratingSamplesIa}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSamplesIa ? 'animate-spin' : ''}`} />
                        <span>Buscar Anúncios na Região com IA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const baseM2 = editingReport.calculations.homogenizedAveragePerM2 || 15000;
                          const newSample: PtamComparableSample = {
                            id: `smp_manual_${Date.now()}`,
                            title: `Imóvel Anunciado no ${editingReport.targetProperty.address.neighborhood}`,
                            sourcePortal: 'ZAP_IMOVEIS',
                            adUrl: 'https://www.zapimoveis.com.br/',
                            adDate: new Date().toISOString().slice(0, 10),
                            photoUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&auto=format&fit=crop&q=80',
                            neighborhood: editingReport.targetProperty.address.neighborhood,
                            distanceFromTargetMeters: 200,
                            areaM2: editingReport.targetProperty.areas.privateM2 || 100,
                            askingPrice: (editingReport.targetProperty.areas.privateM2 || 100) * baseM2 * 1.08,
                            askingPricePerM2: Math.round(baseM2 * 1.08),
                            offerDiscountFactor: 0.90,
                            standardFactor: 1.00,
                            conservationFactor: 1.00,
                            locationFactor: 1.00,
                            finalHomogenizedPricePerM2: Math.round(baseM2 * 1.08 * 0.90),
                            notes: 'Adicionado manualmente pelo avaliador.'
                          };
                          setEditingReport({
                            ...editingReport,
                            samples: [...editingReport.samples, newSample]
                          });
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Amostra</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {editingReport.samples.map((s, idx) => (
                      <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <img src={s.photoUrl} alt="" className="w-16 h-12 rounded-lg object-cover border border-slate-300 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 block">{s.title}</span>
                            <span className="text-[11px] text-slate-500">
                              {s.sourcePortal.replace('_', ' ')} • {s.areaM2} m² • Oferta: R$ {s.askingPrice.toLocaleString('pt-BR')} (R$ {s.askingPricePerM2}/m²)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right font-mono">
                            <span className="text-[10px] text-slate-400 block">Homogeneizado:</span>
                            <strong className="text-slate-900 font-bold">R$ {s.finalHomogenizedPricePerM2.toLocaleString('pt-BR')}/m²</strong>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingReport({
                                ...editingReport,
                                samples: editingReport.samples.filter(item => item.id !== s.id)
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            title="Remover amostra"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 5: CÁLCULOS E PARECER CONCLUSIVO */}
              {activeEditorTab === 'CALCULOS' && (
                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-amber-400 uppercase font-black tracking-wider block">
                        Valor Recomendado de Mercado (Venda)
                      </span>
                      <div className="text-3xl font-black text-white mt-1">
                        R$ {editingReport.calculations.recommendedMarketValue.toLocaleString('pt-BR')}
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Preço Unitário: R$ {editingReport.calculations.homogenizedAveragePerM2.toLocaleString('pt-BR')}/m²
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-xs text-slate-400 block">Locação Estimada:</span>
                      <span className="text-lg font-bold text-amber-300">
                        R$ {editingReport.calculations.recommendedRentalValue?.toLocaleString('pt-BR')} /mês
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Justificativa e Arbítrio do Avaliador</label>
                    <textarea
                      rows={3}
                      value={editingReport.calculations.arbitrageJustification}
                      onChange={(e) => setEditingReport({
                        ...editingReport,
                        calculations: { ...editingReport.calculations, arbitrageJustification: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

              {/* ABA 6: PERITO & IMOBILIÁRIA */}
              {activeEditorTab === 'PERITO' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Dados da Imobiliária Emitente</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-500 block">Razão Social</label>
                        <input
                          type="text"
                          value={editingReport.agency.name}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            agency: { ...editingReport.agency, name: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block">CRECI Jurídico (CRECI-J)</label>
                        <input
                          type="text"
                          value={editingReport.agency.creciJ}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            agency: { ...editingReport.agency, creciJ: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Perito Avaliador Responsável</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-500 block">Nome do Avaliador</label>
                        <input
                          type="text"
                          value={editingReport.evaluator.name}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            evaluator: { ...editingReport.evaluator, name: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block">CRECI Físico</label>
                        <input
                          type="text"
                          value={editingReport.evaluator.creci}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            evaluator: { ...editingReport.evaluator, creci: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block">Registro CNAI</label>
                        <input
                          type="text"
                          value={editingReport.evaluator.cnai}
                          onChange={(e) => setEditingReport({
                            ...editingReport,
                            evaluator: { ...editingReport.evaluator, cnai: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-amber-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer do Editor */}
            <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => { setIsEditorOpen(false); setEditingReport(null); }}
                className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveEditor}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvar Laudo PTAM Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Impressão CRECI A4 */}
      {printModalReport && (
        <PtamPrintCreciModal
          isOpen={Boolean(printModalReport)}
          onClose={() => setPrintModalReport(null)}
          report={printModalReport}
        />
      )}
    </div>
  );
};

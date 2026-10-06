import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Building,
  Layers, 
  Lock, 
  Unlock, 
  Clock, 
  DollarSign, 
  FileDown, 
  CheckCircle2, 
  AlertTriangle, 
  Sun, 
  Car, 
  Maximize2, 
  X,
  Share2,
  Sparkles,
  Search,
  Filter,
  Plus,
  Compass,
  FileText,
  Calendar,
  Percent,
  Check,
  Download,
  ExternalLink,
  ChevronRight,
  Eye,
  Camera,
  HardHat,
  Trophy,
  Award,
  Shield,
  HelpCircle,
  Copy,
  Edit,
  Table,
  Upload
} from 'lucide-react';
import { DevelopmentUnit, UnitStatus, UserProfile } from '../../types/crm';
import { LaunchDevelopment } from '../../types/launches';
import { MOCK_LAUNCH_DEVELOPMENTS } from '../../data/mockLaunchesData';
import { NewDevelopmentModal } from './NewDevelopmentModal';
import { 
  EditDevelopmentModal, 
  SalesTableEditorModal, 
  UploadMaterialsModal 
} from './SalesMirrorAdminModals';

interface SalesMirrorViewProps {
  development?: any; // backwards compatibility
  currentUser: UserProfile;
  isExternalPartnerPortal?: boolean;
  onLockUnitReservation?: (unitId: string, clientName: string) => void;
}

type LaunchTab = 
  | 'espelho_interativo' 
  | 'tabela_vendas' 
  | 'materiais_plantas' 
  | 'ficha_tecnica' 
  | 'estagio_obra' 
  | 'comissoes_regras'
  | 'catalogo_empreendimentos';

export const SalesMirrorView: React.FC<SalesMirrorViewProps> = ({
  currentUser,
  isExternalPartnerPortal = false,
  onLockUnitReservation,
}) => {
  // Developments list
  const [developmentsList, setDevelopmentsList] = useState<LaunchDevelopment[]>(MOCK_LAUNCH_DEVELOPMENTS);
  const [selectedDevId, setSelectedDevId] = useState<string>(MOCK_LAUNCH_DEVELOPMENTS[0].id);
  const [activeTab, setActiveTab] = useState<LaunchTab>('espelho_interativo');

  // Modals
  const [showNewDevModal, setShowNewDevModal] = useState(false);
  const [showEditDevModal, setShowEditDevModal] = useState(false);
  const [showTableEditorModal, setShowTableEditorModal] = useState(false);
  const [showUploadMaterialsModal, setShowUploadMaterialsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateActiveDevelopment = (updated: LaunchDevelopment) => {
    setDevelopmentsList(prev => prev.map(d => d.id === updated.id ? updated : d));
    setToastMessage(`Empreendimento "${updated.title}" atualizado com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Active Development
  const activeDevelopment = useMemo(() => {
    return developmentsList.find(d => d.id === selectedDevId) || developmentsList[0];
  }, [developmentsList, selectedDevId]);

  // Mirror filters
  const [selectedTower, setSelectedTower] = useState<string>(activeDevelopment.towers[0] || 'Torre Alpha (Park View)');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UnitStatus>('ALL');
  const [typologyFilter, setTypologyFilter] = useState<string>('ALL');
  const [sunFilter, setSunFilter] = useState<'ALL' | 'MANHA' | 'TARDE'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<DevelopmentUnit | null>(null);

  // Reservation Form in Drawer
  const [reserveClientName, setReserveClientName] = useState('');
  const [reserveClientPhone, setReserveClientPhone] = useState('');
  const [reserveClientCpf, setReserveClientCpf] = useState('');
  const [isReserving, setIsReserving] = useState(false);

  // Filter units in selected tower
  const unitsInTower = useMemo(() => {
    return activeDevelopment.units.filter(u => {
      const matchTower = u.tower === selectedTower;
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchTypology = typologyFilter === 'ALL' || u.typology.toLowerCase().includes(typologyFilter.toLowerCase());
      const matchSun = sunFilter === 'ALL' || u.sunOrientation === sunFilter;
      return matchTower && matchStatus && matchTypology && matchSun;
    });
  }, [activeDevelopment, selectedTower, statusFilter, typologyFilter, sunFilter]);

  // Group floors descending
  const floors = useMemo(() => {
    return Array.from(new Set(unitsInTower.map(u => u.floor))).sort((a, b) => b - a);
  }, [unitsInTower]);

  // Available typologies for filter
  const availableTypologies = useMemo(() => {
    return Array.from(new Set(activeDevelopment.units.map(u => u.typology)));
  }, [activeDevelopment]);

  // Lock reservation handler
  const handleLockReservation = () => {
    if (!selectedUnit || !reserveClientName.trim()) return;
    setIsReserving(true);

    setTimeout(() => {
      setIsReserving(false);
      const updatedUnit: DevelopmentUnit = {
        ...selectedUnit,
        status: 'RESERVADO',
        reservedByBrokerName: currentUser.name,
        reservedClientName: reserveClientName,
        reservationExpiresAt: '23h 59m restantes',
      };

      setDevelopmentsList(prev => prev.map(d => {
        if (d.id === activeDevelopment.id) {
          return {
            ...d,
            reservedUnits: d.reservedUnits + 1,
            availableUnits: Math.max(0, d.availableUnits - 1),
            units: d.units.map(u => u.id === selectedUnit.id ? updatedUnit : u)
          };
        }
        return d;
      }));

      setSelectedUnit(updatedUnit);
      setReserveClientName('');
      setReserveClientPhone('');
      setReserveClientCpf('');

      if (onLockUnitReservation) {
        onLockUnitReservation(selectedUnit.id, reserveClientName);
      }

      setToastMessage(`Unidade ${selectedUnit.unitNumber} reservada com sucesso para ${reserveClientName}! SLA: 24 Horas.`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-xs';
      case 'RESERVADO':
        return 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 animate-pulse font-bold';
      case 'VENDIDO':
        return 'bg-slate-300 text-slate-500 border-slate-300 cursor-not-allowed';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar: Selector of Launch Developments + Register Button */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Módulo Oficial de Lançamentos
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                Lançamentos 360° Interativo
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
              Espelho de Vendas & Gestão de Empreendimentos
            </h1>
          </div>
        </div>

        {/* Development Switcher & Add Button */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <select
            value={selectedDevId}
            onChange={(e) => {
              setSelectedDevId(e.target.value);
              const found = developmentsList.find(d => d.id === e.target.value);
              if (found && found.towers[0]) {
                setSelectedTower(found.towers[0]);
              }
              setSelectedUnit(null);
            }}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
          >
            {developmentsList.map(dev => (
              <option key={dev.id} value={dev.id}>
                {dev.title} ({dev.neighborhood})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowEditDevModal(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
            title="Editar dados cadastrais, RI e links do empreendimento"
          >
            <Edit className="w-4 h-4 text-blue-600" />
            <span>Editar</span>
          </button>

          <button
            onClick={() => setShowTableEditorModal(true)}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
            title="Editar tabela de vendas e cadastrar unidades no espelho"
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Tabela & Unidades</span>
          </button>

          <button
            onClick={() => setShowUploadMaterialsModal(true)}
            className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
            title="Subir plantas humanizadas, books e documentos"
          >
            <Upload className="w-4 h-4 text-purple-600" />
            <span>Subir Materiais</span>
          </button>

          <button
            onClick={() => setShowNewDevModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Empreendimento</span>
          </button>
        </div>
      </div>

      {/* Hero Banner with Product Specs */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden text-white relative">
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={activeDevelopment.bannerUrl}
            alt={activeDevelopment.title}
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-600 text-white shadow-xs">
                {activeDevelopment.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                {activeDevelopment.builderName}
              </span>
              <span className="text-xs text-slate-300">
                Incorporação: {activeDevelopment.developerName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {activeDevelopment.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl line-clamp-2">
              {activeDevelopment.tagline} • {activeDevelopment.address}
            </p>
          </div>
        </div>

        {/* Stock & Progress Summary Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-6">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Unidades</span>
              <span className="text-base font-black text-white font-mono">{activeDevelopment.totalUnits}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Disponíveis</span>
              <span className="text-base font-black text-emerald-400 font-mono">{activeDevelopment.availableUnits}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase block">Reservadas</span>
              <span className="text-base font-black text-amber-400 font-mono">{activeDevelopment.reservedUnits}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Vendidas</span>
              <span className="text-base font-black text-slate-300 font-mono">{activeDevelopment.soldUnits}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase block">Comissão Paga</span>
              <span className="text-base font-black text-blue-400 font-mono">
                {activeDevelopment.commissionRules.totalPercent}%
              </span>
            </div>
          </div>

          {/* Construction Progress Pill */}
          <div className="flex items-center gap-3 bg-slate-900 p-2.5 px-4 rounded-2xl border border-slate-800">
            <HardHat className="w-5 h-5 text-amber-400" />
            <div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="font-bold text-slate-300">Evolução da Obra</span>
                <span className="font-black text-amber-400 font-mono">
                  {activeDevelopment.constructionStage.overallPercent}%
                </span>
              </div>
              <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeDevelopment.constructionStage.overallPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 sm:px-6 pt-2 pb-3 bg-slate-950 no-scrollbar border-t border-slate-800/60 text-xs font-semibold">
          {[
            { id: 'espelho_interativo' as LaunchTab, label: 'Espelho de Vendas', icon: Layers },
            { id: 'tabela_vendas' as LaunchTab, label: 'Tabela de Vendas & Fluxo', icon: DollarSign },
            { id: 'materiais_plantas' as LaunchTab, label: 'Plantas & Materiais', icon: FileText },
            { id: 'ficha_tecnica' as LaunchTab, label: 'Ficha Técnica & Arquitetura', icon: Building2 },
            { id: 'estagio_obra' as LaunchTab, label: 'Estágio da Obra', icon: HardHat },
            { id: 'comissoes_regras' as LaunchTab, label: 'Comissões & Regras', icon: Percent },
            { id: 'catalogo_empreendimentos' as LaunchTab, label: 'Catálogo de Lançamentos', icon: Building },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ESPELHO INTERATIVO DE VENDAS                     */}
      {/* ======================================================== */}
      {activeTab === 'espelho_interativo' && (
        <div className="space-y-6">
          {/* Tower Selector & Filters Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Tower Buttons */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 mr-1">Torre:</span>
              {activeDevelopment.towers.map(tower => (
                <button
                  key={tower}
                  onClick={() => setSelectedTower(tower)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedTower === tower
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tower}
                </button>
              ))}
            </div>

            {/* Filters (Status, Typology, Sun) */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="ALL">Todos os Status</option>
                <option value="DISPONIVEL">Apenas Disponíveis</option>
                <option value="RESERVADO">Reservadas</option>
                <option value="VENDIDO">Vendidas</option>
              </select>

              {/* Typology Filter */}
              <select
                value={typologyFilter}
                onChange={(e) => setTypologyFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="ALL">Todas as Tipologias</option>
                {availableTypologies.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Sun Filter */}
              <select
                value={sunFilter}
                onChange={(e) => setSunFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="ALL">Sol Manhã / Tarde</option>
                <option value="MANHA">Sol da Manhã</option>
                <option value="TARDE">Sol da Tarde</option>
              </select>
            </div>
          </div>

          {/* Mirror Grid Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* The Visual Tower Facade (Left 8 Cols) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{selectedTower}</span>
                  <span className="text-slate-400 text-xs">({unitsInTower.length} unidades encontradas)</span>
                </div>

                {/* Status Legend */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                    <span>Disponível</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
                    <span>Reservado</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-slate-300 inline-block" />
                    <span>Vendido</span>
                  </span>
                </div>
              </div>

              {/* Floor Rows */}
              <div className="space-y-3">
                {floors.map(floorNum => {
                  const unitsOnFloor = unitsInTower.filter(u => u.floor === floorNum);
                  return (
                    <div key={floorNum} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                      {/* Floor Indicator Label */}
                      <div className="w-14 shrink-0 text-center font-bold text-xs text-slate-600 font-mono bg-white py-2 rounded-lg border border-slate-200">
                        {floorNum}º Andar
                      </div>

                      {/* Units Buttons */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {unitsOnFloor.map(unit => {
                          const isSelected = selectedUnit?.id === unit.id;
                          return (
                            <button
                              key={unit.id}
                              onClick={() => setSelectedUnit(unit)}
                              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${getStatusColor(unit.status)} ${
                                isSelected ? 'ring-4 ring-blue-500/50 scale-[1.02] shadow-md z-10' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-black font-mono">{unit.unitNumber}</span>
                                <span className="text-[10px] opacity-85">
                                  {unit.sunOrientation === 'MANHA' ? '☀️ Manhã' : '🌅 Tarde'}
                                </span>
                              </div>

                              <div className="text-[11px] truncate font-medium mt-1">
                                {unit.typology}
                              </div>

                              <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-black/10">
                                <span>{unit.privateAreaM2}m²</span>
                                <span className="font-bold">
                                  R$ {(unit.price / 1000000).toFixed(2)}M
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unit Details & Reservation Drawer (Right 4 Cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 sticky top-6">
              {selectedUnit ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 block uppercase">
                        Unidade Selecionada
                      </span>
                      <h3 className="text-xl font-black text-slate-900 font-mono">
                        Apto {selectedUnit.unitNumber}
                      </h3>
                      <span className="text-xs text-slate-500">{selectedUnit.tower} • {selectedUnit.floor}º Pavimento</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      selectedUnit.status === 'DISPONIVEL' ? 'bg-emerald-100 text-emerald-800' :
                      selectedUnit.status === 'RESERVADO' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {selectedUnit.status}
                    </span>
                  </div>

                  {/* Specs & Pricing */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tipologia:</span>
                      <strong className="text-slate-900">{selectedUnit.typology}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Área Privativa:</span>
                      <strong className="text-slate-900">{selectedUnit.privateAreaM2} m²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vagas de Garagem:</span>
                      <strong className="text-slate-900">{selectedUnit.parkingSpaces} vagas</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Incidência Solar:</span>
                      <strong className="text-slate-900">
                        {selectedUnit.sunOrientation === 'MANHA' ? 'Sol da Manhã' : 'Sol da Tarde'}
                      </strong>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Preço de Tabela:</span>
                      <span className="text-lg font-black text-emerald-700 font-mono">
                        R$ {selectedUnit.price.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Flow Simulation for This Unit */}
                  <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs space-y-2">
                    <span className="font-bold text-blue-900 block text-[11px] uppercase tracking-wider">
                      Simulação do Fluxo Financeiro (Tabela de Incorporação):
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Ato / Sinal (10%):</span>
                        <strong className="text-slate-900">
                          R$ {(selectedUnit.price * 0.10).toLocaleString('pt-BR')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">28x Mensais Obra:</span>
                        <strong className="text-slate-900">
                          R$ {Math.round((selectedUnit.price * 0.15) / 28).toLocaleString('pt-BR')}/mês
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Chaves / Entrega (15%):</span>
                        <strong className="text-slate-900">
                          R$ {(selectedUnit.price * 0.15).toLocaleString('pt-BR')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Financiamento (50%):</span>
                        <strong className="text-emerald-700">
                          R$ {(selectedUnit.price * 0.50).toLocaleString('pt-BR')}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Reservation Action or Status */}
                  {selectedUnit.status === 'DISPONIVEL' ? (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-800">
                        Bloqueio / Reserva Expressa (SLA 24 Horas):
                      </h4>
                      <input
                        type="text"
                        value={reserveClientName}
                        onChange={(e) => setReserveClientName(e.target.value)}
                        placeholder="Nome completo do proponente *"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={reserveClientPhone}
                          onChange={(e) => setReserveClientPhone(e.target.value)}
                          placeholder="WhatsApp *"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          value={reserveClientCpf}
                          onChange={(e) => setReserveClientCpf(e.target.value)}
                          placeholder="CPF do cliente"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleLockReservation}
                        disabled={!reserveClientName.trim() || isReserving}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{isReserving ? 'Bloqueando no Espelho...' : 'Reservar Unidade por 24h'}</span>
                      </button>
                    </div>
                  ) : selectedUnit.status === 'RESERVADO' ? (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-amber-900">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Unidade sob Reserva Ativa</span>
                      </div>
                      <div>Proponente: <strong>{selectedUnit.reservedClientName}</strong></div>
                      <div>Corretor Responsável: <strong>{selectedUnit.reservedByBrokerName}</strong></div>
                      <div className="text-[11px] text-amber-800 font-mono">
                        Expira em: {selectedUnit.reservationExpiresAt}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 text-xs text-center font-bold">
                      Esta unidade foi comercializada e escriturada.
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Maximize2 className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Selecione uma unidade no espelho ao lado para visualizar ficha, valores e reservar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TABELA DE VENDAS & FLUXO FINANCEIRO               */}
      {/* ======================================================== */}
      {activeTab === 'tabela_vendas' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Tabela de Vendas & Condições Oficiais da Construtora
              </h3>
              <p className="text-xs text-slate-500">
                Código: <strong className="font-mono text-slate-700">{activeDevelopment.salesTableConfig.tableCode}</strong> • Válida até: {activeDevelopment.salesTableConfig.validUntil}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTableEditorModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Incluir / Editar Tabela</span>
              </button>

              <button
                onClick={() => {
                  setToastMessage('Tabela oficial de vendas exportada em formato Excel/PDF!');
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Tabela (XLSX)</span>
              </button>
            </div>
          </div>

          {/* Flow Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
              <span className="text-[10px] text-blue-700 font-bold block uppercase">Entrada / Sinal</span>
              <strong className="text-xl font-black text-blue-950 font-mono">
                {activeDevelopment.salesTableConfig.signalPercent}%
              </strong>
              <p className="text-[11px] text-blue-800 mt-1">Ato facilitado + 30/60 dias</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs">
              <span className="text-[10px] text-purple-700 font-bold block uppercase">Mensais no Período de Obra</span>
              <strong className="text-xl font-black text-purple-950 font-mono">
                {activeDevelopment.salesTableConfig.monthlyInstallmentsCount}x
              </strong>
              <p className="text-[11px] text-purple-800 mt-1">
                Totalizando {activeDevelopment.salesTableConfig.monthlyInstallmentsTotalPercent}% corrigido pelo INCC
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
              <span className="text-[10px] text-amber-700 font-bold block uppercase">Intermediárias / Balões</span>
              <strong className="text-xl font-black text-amber-950 font-mono">
                {activeDevelopment.salesTableConfig.semiAnnualInstallmentsCount}x
              </strong>
              <p className="text-[11px] text-amber-800 mt-1">Parcelas semestrais durante as obras</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="text-[10px] text-emerald-700 font-bold block uppercase">Financiamento Bancário / Chaves</span>
              <strong className="text-xl font-black text-emerald-950 font-mono">
                {activeDevelopment.salesTableConfig.bankFinancingPercent}%
              </strong>
              <p className="text-[11px] text-emerald-800 mt-1">Repasse e quitação no habite-se</p>
            </div>
          </div>

          {/* Full Units Price List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">Unidade</th>
                  <th className="p-3">Torre</th>
                  <th className="p-3">Tipologia</th>
                  <th className="p-3">Área (m²)</th>
                  <th className="p-3">Sol</th>
                  <th className="p-3">Valor de Tabela</th>
                  <th className="p-3">Sinal (10%)</th>
                  <th className="p-3">Financ. Bancário</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeDevelopment.units.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{u.unitNumber}</td>
                    <td className="p-3 text-slate-600">{u.tower}</td>
                    <td className="p-3 font-semibold text-slate-800">{u.typology}</td>
                    <td className="p-3 text-slate-600 font-mono">{u.privateAreaM2} m²</td>
                    <td className="p-3 text-slate-600">
                      {u.sunOrientation === 'MANHA' ? '☀️ Manhã' : '🌅 Tarde'}
                    </td>
                    <td className="p-3 font-mono font-black text-slate-900">
                      R$ {u.price.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 font-mono text-blue-700">
                      R$ {(u.price * 0.10).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 font-mono text-emerald-700">
                      R$ {(u.price * 0.50).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'DISPONIVEL' ? 'bg-emerald-100 text-emerald-800' :
                        u.status === 'RESERVADO' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MATERIAIS & PLANTAS HUMANIZADAS                  */}
      {/* ======================================================== */}
      {activeTab === 'materiais_plantas' && (
        <div className="space-y-6">
          {/* Floor Plans Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <span>Plantas Humanizadas & Tipologias do Projeto</span>
              </h3>

              <button
                onClick={() => setShowUploadMaterialsModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Nova Planta / Material</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeDevelopment.floorPlans.map(plan => (
                <div key={plan.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 relative group">
                    <img
                      src={plan.imageUrl}
                      alt={plan.typologyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setToastMessage(`Download da planta humanizada ${plan.typologyName} iniciado!`);
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Alta Resolução</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm">{plan.typologyName}</h4>
                      <span className="font-mono font-bold text-blue-600 text-xs">{plan.privateAreaM2} m²</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-200 font-semibold">
                    <span>{plan.bedrooms} Dorms</span>
                    <span>•</span>
                    <span>{plan.suites} Suítes</span>
                    <span>•</span>
                    <span>{plan.parkingSpaces} Vagas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Documents & Downloads */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-purple-600" />
              <span>Documentos, Books e Arquivos do Lançamento</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeDevelopment.documents.map(doc => (
                <div key={doc.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      <div className="text-[11px] text-slate-500">Tamanho: {doc.fileSizeMb} • Atualizado em {doc.uploadedAt}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setToastMessage(`Download de "${doc.title}" iniciado!`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs"
                    title="Baixar arquivo"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: FICHA TÉCNICA & ARQUITETURA                       */}
      {/* ======================================================== */}
      {activeTab === 'ficha_tecnica' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ficha Técnica & Memorial de Arquitetura
              </h3>
              <p className="text-slate-500">Registro de Incorporação: {activeDevelopment.incorporationRegistryNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">Assinatura de Projeto:</span>
              <div>Projeto Arquitetônico: <strong>{activeDevelopment.technicalSheet.architect}</strong></div>
              <div>Decoração de Interiores: <strong>{activeDevelopment.technicalSheet.interiorDesigner}</strong></div>
              <div>Paisagismo: <strong>{activeDevelopment.technicalSheet.landscapeArchitect}</strong></div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">Dados do Terreno:</span>
              <div>Área do Terreno: <strong>{activeDevelopment.technicalSheet.totalLandAreaM2} m²</strong></div>
              <div>Número de Torres: <strong>{activeDevelopment.technicalSheet.totalTowers} torres</strong></div>
              <div>Pavimentos por Torre: <strong>{activeDevelopment.technicalSheet.totalFloors} andares</strong></div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">Vagas & Acessos:</span>
              <div>Tipo de Vaga: <strong>{activeDevelopment.technicalSheet.parkingType}</strong></div>
              <div>Ponto p/ Carro Elétrico: <strong>{activeDevelopment.technicalSheet.electricCarCharger ? 'Sim (em todas)' : 'Não'}</strong></div>
              <div>Elevadores: <strong>{activeDevelopment.technicalSheet.totalElevators} com biometria</strong></div>
            </div>
          </div>

          {/* Amenities & Leisure List */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-3">Lazer, Serviços & Diferenciais do Condomínio:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeDevelopment.technicalSheet.amenities.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-slate-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ESTÁGIO DA OBRA & EVOLUÇÃO                        */}
      {/* ======================================================== */}
      {activeTab === 'estagio_obra' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Acompanhamento e Medição da Obra
              </h3>
              <p className="text-slate-500">
                Responsável Técnico: <strong>{activeDevelopment.constructionStage.supervisorName}</strong> • Última Medição: {activeDevelopment.constructionStage.lastUpdatedDate}
              </p>
            </div>

            <div className="px-4 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl font-bold font-mono">
              Evolução Total: {activeDevelopment.constructionStage.overallPercent}% Concluído
            </div>
          </div>

          {/* Construction Breakdown Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Fundações & Contenções', percent: activeDevelopment.constructionStage.foundationPercent },
              { label: 'Estrutura & Lajes', percent: activeDevelopment.constructionStage.structurePercent },
              { label: 'Alvenaria & Vedação', percent: activeDevelopment.constructionStage.masonryPercent },
              { label: 'Instalações Hidráulicas e Elétricas', percent: activeDevelopment.constructionStage.installationsPercent },
              { label: 'Acabamentos & Revestimentos', percent: activeDevelopment.constructionStage.finishingPercent },
              { label: 'Pintura & Fachada', percent: activeDevelopment.constructionStage.paintingPercent },
            ].map((stg, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">{stg.label}</span>
                  <span className="font-mono text-slate-900">{stg.percent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stg.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Construction Photos */}
          {activeDevelopment.constructionStage.photos.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-slate-600" />
                <span>Registros Fotográficos do Canteiro de Obras:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeDevelopment.constructionStage.photos.map(p => (
                  <div key={p.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={p.imageUrl} alt="" className="w-full aspect-video object-cover" />
                    <div className="p-3 space-y-1">
                      <div className="font-bold text-slate-900 text-xs">{p.stageName}</div>
                      <div className="text-[11px] text-slate-500">{p.caption} • {p.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: COMISSÕES & REGRAS DA CONSTRUTORA                 */}
      {/* ======================================================== */}
      {activeTab === 'comissoes_regras' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Regras de Comissionamento & Premiações da Construtora
            </h3>
            <p className="text-slate-500">
              Tabela de honorários acordada com a {activeDevelopment.builderName}
            </p>
          </div>

          {/* Big Commission Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-[10px] text-emerald-800 font-bold block uppercase">Comissão Total Paga</span>
              <span className="text-3xl font-black text-emerald-950 font-mono">
                {activeDevelopment.commissionRules.totalPercent}%
              </span>
              <p className="text-[11px] text-emerald-700">Sobre o valor de venda</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
              <span className="text-[10px] text-blue-800 font-bold block uppercase">Repasse Corretor</span>
              <span className="text-3xl font-black text-blue-950 font-mono">
                {activeDevelopment.commissionRules.brokerPercent}%
              </span>
              <p className="text-[11px] text-blue-700">Honorários diretos</p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
              <span className="text-[10px] text-purple-800 font-bold block uppercase">Retenção Imobiliária</span>
              <span className="text-3xl font-black text-purple-950 font-mono">
                {activeDevelopment.commissionRules.agencyPercent}%
              </span>
              <p className="text-[11px] text-purple-700">Taxa da imobiliária</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <span className="text-[10px] text-amber-800 font-bold block uppercase">Coordenação / Gerência</span>
              <span className="text-3xl font-black text-amber-950 font-mono">
                {activeDevelopment.commissionRules.managerPercent}%
              </span>
              <p className="text-[11px] text-amber-700">Supervisão de vendas</p>
            </div>
          </div>

          {/* Active Campaign Bonus */}
          {activeDevelopment.commissionRules.bonusPrizeText && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-300 flex items-start gap-3">
              <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-950 block text-xs">
                  Campanha de Premiação Ativa da Construtora:
                </strong>
                <p className="text-amber-900 text-xs mt-0.5">
                  {activeDevelopment.commissionRules.bonusPrizeText}
                </p>
              </div>
            </div>
          )}

          {/* Payment Terms */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-xs">Termos de Liberação de Pagamento:</span>
            <p className="text-slate-600 leading-relaxed">
              {activeDevelopment.commissionRules.paymentTerms}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: CATÁLOGO GERAL DE LANÇAMENTOS (ACERTGO 360°)       */}
      {/* ======================================================== */}
      {activeTab === 'catalogo_empreendimentos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Portfólio de Empreendimentos & Lançamentos
              </h3>
              <p className="text-xs text-slate-500">
                Todos os produtos ativos na esteira comercial com espelho e tabela de vendas
              </p>
            </div>
            <button
              onClick={() => setShowNewDevModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Empreendimento</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developmentsList.map(dev => {
              const isSelected = dev.id === activeDevelopment.id;
              const soldPercent = Math.round((dev.soldUnits / dev.totalUnits) * 100);
              return (
                <div
                  key={dev.id}
                  className={`bg-white rounded-3xl border-2 transition-all overflow-hidden flex flex-col justify-between shadow-xs ${
                    isSelected ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={dev.bannerUrl}
                        alt={dev.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-900/90 text-white backdrop-blur-xs">
                          {dev.code}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                          {dev.builderName}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold font-mono">
                        {dev.deliveryDate}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                          {dev.neighborhood} • {dev.city}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{dev.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{dev.tagline}</p>
                      </div>

                      {/* Sales Stats Bar */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">Vendas do Produto:</span>
                          <span className="text-emerald-700 font-mono">{soldPercent}% Vendido</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${soldPercent}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Disp.</span>
                            <strong className="text-emerald-700 font-mono">{dev.availableUnits}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Res.</span>
                            <strong className="text-amber-700 font-mono">{dev.reservedUnits}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Vend.</span>
                            <strong className="text-slate-700 font-mono">{dev.soldUnits}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Comissão Paga:</span>
                          <strong className="text-blue-600 font-bold font-mono">{dev.commissionRules.totalPercent}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Obra Concluída:</span>
                          <strong className="text-amber-600 font-bold font-mono">{dev.constructionStage.overallPercent}%</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-2">
                    <button
                      onClick={() => {
                        setSelectedDevId(dev.id);
                        if (dev.towers[0]) setSelectedTower(dev.towers[0]);
                        setActiveTab('espelho_interativo');
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Abrir Espelho de Vendas</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDevId(dev.id);
                        if (dev.towers[0]) setSelectedTower(dev.towers[0]);
                        setActiveTab('tabela_vendas');
                      }}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <DollarSign className="w-3 h-3 text-slate-500" />
                      <span>Ver Tabela Oficial de Vendas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: New Launch Development */}
      {showNewDevModal && (
        <NewDevelopmentModal
          isOpen={showNewDevModal}
          onClose={() => setShowNewDevModal(false)}
          onSaveDevelopment={(newDev) => {
            setDevelopmentsList(prev => [newDev, ...prev]);
            setSelectedDevId(newDev.id);
            if (newDev.towers[0]) {
              setSelectedTower(newDev.towers[0]);
            }
            setToastMessage(`Empreendimento "${newDev.title}" cadastrado com sucesso!`);
            setTimeout(() => setToastMessage(null), 4000);
          }}
        />
      )}

      {/* Modal: Edit Active Development */}
      {showEditDevModal && (
        <EditDevelopmentModal
          isOpen={showEditDevModal}
          onClose={() => setShowEditDevModal(false)}
          development={activeDevelopment}
          onSave={handleUpdateActiveDevelopment}
        />
      )}

      {/* Modal: Sales Table & Units Editor */}
      {showTableEditorModal && (
        <SalesTableEditorModal
          isOpen={showTableEditorModal}
          onClose={() => setShowTableEditorModal(false)}
          development={activeDevelopment}
          onSave={handleUpdateActiveDevelopment}
        />
      )}

      {/* Modal: Upload Floor Plans & Documents */}
      {showUploadMaterialsModal && (
        <UploadMaterialsModal
          isOpen={showUploadMaterialsModal}
          onClose={() => setShowUploadMaterialsModal(false)}
          development={activeDevelopment}
          onSave={handleUpdateActiveDevelopment}
        />
      )}
    </div>
  );
};

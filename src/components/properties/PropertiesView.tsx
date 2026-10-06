import React, { useState } from 'react';
import { 
  Home, 
  Building, 
  Search, 
  Plus, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  DollarSign, 
  Maximize2, 
  Bed, 
  Bath, 
  Car, 
  MapPin, 
  User, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Share2, 
  QrCode, 
  Sparkles,
  ChevronRight,
  Phone,
  Globe,
  Star,
  CheckCircle2,
  Radar,
  Smartphone,
  CheckSquare,
  Square,
  Send,
  MessageCircle,
  Map,
  Lock,
  X,
  Award
} from 'lucide-react';
import { 
  RealEstateProperty, 
  PropertyType, 
  PropertyTransactionType, 
  PropertyAvailabilityStatus,
  Owner,
  Lead,
  PropertyProposal,
  UserProfile,
  AgencyGovernanceRules,
  DEFAULT_AGENCY_GOVERNANCE_RULES,
  canDisplayPropertyMapAndAddress,
  canUserViewOwnerDetails
} from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';
import { PropertyModal } from './PropertyModal';
import { PropertyDetailModal } from './PropertyDetailModal';
import { ProposalModal } from './ProposalModal';
import { LeadRadarModal } from './LeadRadarModal';
import { BrokerSalesLandingPageModal } from './BrokerSalesLandingPageModal';
import { PropertyQrPlacaModal } from './PropertyQrPlacaModal';
import { GoogleMapComponent, MapMarkerItem } from '../common/GoogleMapComponent';

interface PropertiesViewProps {
  properties: RealEstateProperty[];
  owners: Owner[];
  leads?: Lead[];
  currentUser?: UserProfile;
  governanceRules?: AgencyGovernanceRules;
  onSaveProperty: (propertyData: Partial<RealEstateProperty>) => void;
  onDeleteProperty: (propertyId: string) => void;
  onViewOwnerDetails: (owner: Owner) => void;
  onOpenNewOwnerModal: () => void;
  onSaveProposal?: (proposal: PropertyProposal, newLeadData?: { name: string; phone: string; email: string }) => void;
  onNavigateToPtam?: (property?: RealEstateProperty) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  owners,
  leads = [],
  currentUser,
  governanceRules = DEFAULT_AGENCY_GOVERNANCE_RULES,
  onSaveProperty,
  onDeleteProperty,
  onViewOwnerDetails,
  onOpenNewOwnerModal,
  onSaveProposal,
  onNavigateToPtam,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<'TODOS' | PropertyTransactionType>('TODOS');
  const [selectedType, setSelectedType] = useState<'TODOS' | PropertyType>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<'TODOS' | PropertyAvailabilityStatus>('TODOS');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState<string>('TODOS');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE' | 'MAP'>('CARDS');
  const [selectedMarkerPropertyId, setSelectedMarkerPropertyId] = useState<string | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<RealEstateProperty | null>(null);
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<RealEstateProperty | null>(null);
  const [propertyForProposal, setPropertyForProposal] = useState<RealEstateProperty | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [propertyForRadar, setPropertyForRadar] = useState<RealEstateProperty | null>(null);
  const [selectedPropertyForQr, setSelectedPropertyForQr] = useState<RealEstateProperty | null>(null);

  // Multi-selection & Mini Página de Vendas (Landing Page)
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [showLandingPageModal, setShowLandingPageModal] = useState(false);
  const [landingPageProperties, setLandingPageProperties] = useState<RealEstateProperty[]>([]);

  const handleToggleSelectProperty = (propertyId: string) => {
    setSelectedPropertyIds(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId) 
        : [...prev, propertyId]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedPropertyIds.length === filteredProperties.length && filteredProperties.length > 0) {
      setSelectedPropertyIds([]);
    } else {
      setSelectedPropertyIds(filteredProperties.map(p => p.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedPropertyIds([]);
  };

  const handleOpenLandingPage = (propsToInclude?: RealEstateProperty[]) => {
    if (propsToInclude && propsToInclude.length > 0) {
      setLandingPageProperties(propsToInclude);
      setShowLandingPageModal(true);
    } else if (selectedPropertyIds.length > 0) {
      const selected = properties.filter(p => selectedPropertyIds.includes(p.id));
      setLandingPageProperties(selected);
      setShowLandingPageModal(true);
    } else if (filteredProperties.length > 0) {
      // If none selected, take the first 3 filtered properties as a smart starter
      setLandingPageProperties(filteredProperties.slice(0, 3));
      setShowLandingPageModal(true);
    }
  };

  // Statistics calculation
  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.status === 'DISPONIVEL').length;
  const totalSaleValue = properties
    .filter(p => p.pricing.salePrice)
    .reduce((acc, curr) => acc + (curr.pricing.salePrice || 0), 0);

  const totalRentValue = properties
    .filter(p => p.pricing.rentPrice)
    .reduce((acc, curr) => acc + (curr.pricing.rentPrice || 0), 0);

  // Filtering
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTransaction = 
      selectedTransaction === 'TODOS' ||
      prop.transactionType === selectedTransaction ||
      (selectedTransaction === 'VENDA' && prop.transactionType === 'VENDA_LOCACAO') ||
      (selectedTransaction === 'LOCACAO' && prop.transactionType === 'VENDA_LOCACAO');

    const matchesType = selectedType === 'TODOS' || prop.propertyType === selectedType;
    const matchesStatus = selectedStatus === 'TODOS' || prop.status === selectedStatus;
    const matchesOwner = selectedOwnerFilter === 'TODOS' || prop.ownerId === selectedOwnerFilter;

    return matchesSearch && matchesTransaction && matchesType && matchesStatus && matchesOwner;
  });

  const handleOpenCreate = () => {
    setPropertyToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (property: RealEstateProperty) => {
    setPropertyToEdit(property);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Partial<RealEstateProperty>) => {
    if (propertyToEdit) {
      onSaveProperty({ ...data, id: propertyToEdit.id });
    } else {
      const newProperty: Partial<RealEstateProperty> = {
        ...data,
        id: `prop_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      onSaveProperty(newProperty);
    }
  };

  return (
    <div className="p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
              Imóveis
            </h1>
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-800">
              {totalProperties} Imóveis no Catálogo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão completa de captações, estoque para venda e locação, especificações e vinculação direta com proprietários
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => handleOpenLandingPage()}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
              selectedPropertyIds.length > 0
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
            title="Criar mini página de vendas para cliente com dados do corretor e WhatsApp"
          >
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>Mini Página de Vendas</span>
            {selectedPropertyIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-emerald-700 shadow-xs">
                {selectedPropertyIds.length}
              </span>
            )}
          </button>

          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Cadastrar Imóvel</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Estoque Total</span>
            <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">{totalProperties}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 truncate">
            <span className="text-emerald-600 font-bold">{availableProperties} disponíveis</span> • {totalProperties - availableProperties} negociando/fechados
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">VGC Carteira Venda</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
          </div>
          <div className="text-base sm:text-xl md:text-2xl font-black text-slate-900 font-mono truncate">
            {totalSaleValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 truncate">
            Patrimônio ativo para venda
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Aluguel sob Gestão</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-base sm:text-xl md:text-2xl font-black text-emerald-700 font-mono truncate">
            {totalRentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 truncate">
            Volume mensal para Split Pix
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Proprietários Ativos</span>
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">{owners.length}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 truncate">
            PF e PJ vinculados à carteira
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
        
        {/* Top filter row: Search + Transaction Type + View Mode */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código IMO, título, endereço, bairro..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Transaction Type Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedTransaction('TODOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTransaction === 'TODOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedTransaction('VENDA')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTransaction === 'VENDA' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Venda
              </button>
              <button
                onClick={() => setSelectedTransaction('LOCACAO')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTransaction === 'LOCACAO' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Locação
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white">
              <button
                onClick={() => setViewMode('CARDS')}
                title="Grade de Cards"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'CARDS' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                title="Tabela de Dados"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'TABLE' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('MAP')}
                title="Mapa Interativo (Google Maps)"
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'MAP' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="text-[11px] font-bold pr-0.5">Mapa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter Row: Typology, Status, Owner selector */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Tipo:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium text-slate-700"
            >
              <option value="TODOS">Todos os tipos</option>
              <option value="APARTAMENTO">Apartamento</option>
              <option value="COBERTURA">Cobertura</option>
              <option value="CASA">Casa Residencial</option>
              <option value="CASA_CONDOMINIO">Casa em Condomínio</option>
              <option value="SALA_COMERCIAL">Comercial</option>
              <option value="STUDIO">Studio</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium text-slate-700"
            >
              <option value="TODOS">Todos status</option>
              <option value="DISPONIVEL">Disponível</option>
              <option value="RESERVADO">Reservado</option>
              <option value="EM_NEGOCIACAO">Em Negociação</option>
              <option value="ALUGADO">Alugado</option>
              <option value="VENDIDO">Vendido</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Proprietário:</span>
            <select
              value={selectedOwnerFilter}
              onChange={(e) => setSelectedOwnerFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium text-slate-700 max-w-[200px] truncate"
            >
              <option value="TODOS">Todos os proprietários</option>
              {owners.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.personType})
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedTransaction !== 'TODOS' || selectedType !== 'TODOS' || selectedStatus !== 'TODOS' || selectedOwnerFilter !== 'TODOS') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTransaction('TODOS');
                setSelectedType('TODOS');
                setSelectedStatus('TODOS');
                setSelectedOwnerFilter('TODOS');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Selection Shortcut Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-2.5 border-t border-slate-100 text-xs bg-slate-50/70 -mx-4 -mb-4 px-4 py-2.5 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAllFiltered}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-200/70 transition-colors"
            >
              {selectedPropertyIds.length === filteredProperties.length && filteredProperties.length > 0 ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Desmarcar todos ({filteredProperties.length})</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span>Selecionar todos ({filteredProperties.length})</span>
                </>
              )}
            </button>

            {selectedPropertyIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Limpar seleção ({selectedPropertyIds.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedPropertyIds.length > 0 ? (
              <button
                onClick={() => handleOpenLandingPage()}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Gerar Mini Página ({selectedPropertyIds.length} selecionados)</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md hidden sm:inline">"Separei essas opções pensando em você"</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Selecione um ou mais imóveis para gerar uma Mini Página de Vendas personalizada para o cliente
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Nenhum imóvel encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Nenhum imóvel corresponde aos filtros selecionados. Tente ajustar os termos ou cadastrar um novo imóvel.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Cadastrar Novo Imóvel
          </button>
        </div>
      ) : viewMode === 'CARDS' ? (
        /* CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => {
            const coverImage = property.images.find(img => img.isCover)?.url || property.images[0]?.url;
            const linkedOwner = owners.find(o => o.id === property.ownerId);
            const isSelected = selectedPropertyIds.includes(property.id);
            const activeUser = currentUser || CURRENT_USER_PROFILES[0];
            const ownerAccess = canUserViewOwnerDetails(activeUser, property, governanceRules);
            const mapAddressAccess = canDisplayPropertyMapAndAddress(property, activeUser, governanceRules);

            return (
              <div
                key={property.id}
                onClick={() => setSelectedPropertyForDetail(property)}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                {/* Image & Badges */}
                <div className="h-52 w-full relative overflow-hidden bg-slate-900">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Home className="w-12 h-12" />
                    </div>
                  )}

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[70%]">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-white/95 text-slate-900 font-mono shadow-md backdrop-blur-xs">
                      {property.code}
                    </span>
                    {property.isExclusive && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-slate-950" />
                        Exclusivo
                      </span>
                    )}
                    {property.displayOnWebsite !== false ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveProperty({ ...property, displayOnWebsite: false });
                        }}
                        title="Publicado no site. Clique para pausar."
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1 transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        No Site
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveProperty({ ...property, displayOnWebsite: true });
                        }}
                        title="Oculto do site. Clique para publicar."
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800/80 hover:bg-emerald-600 text-slate-200 hover:text-white shadow-md transition-colors"
                      >
                        Oculto
                      </button>
                    )}
                    {property.featured && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-500 text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-white" />
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-md ${
                      property.status === 'DISPONIVEL'
                        ? 'bg-emerald-500 text-white'
                        : property.status === 'RESERVADO'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-900 text-white'
                    }`}>
                      {property.status}
                    </span>

                    {/* Selection Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelectProperty(property.id);
                      }}
                      className={`p-1.5 rounded-xl backdrop-blur-md transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-white scale-105'
                          : 'bg-black/50 hover:bg-black/80 text-white/90'
                      }`}
                      title={isSelected ? 'Desmarcar seleção' : 'Selecionar para enviar ao cliente'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Transaction Type Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {property.transactionType === 'VENDA'
                        ? 'Venda'
                        : property.transactionType === 'LOCACAO'
                        ? 'Locação'
                        : 'Venda e Locação'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1 flex-wrap">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="truncate">{property.address.neighborhood} • {property.address.city}/{property.address.state}</span>
                      {property.isExclusive ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[9px] uppercase tracking-wide">
                          ★ Exclusivo
                        </span>
                      ) : !mapAddressAccess.showExactAddress ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-semibold flex items-center gap-0.5" title="Endereço exato protegido por governança">
                          <Lock className="w-2.5 h-2.5 text-slate-400" /> Bairro
                        </span>
                      ) : null}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {property.title}
                    </h3>
                  </div>

                  {/* Specs Quick Bar */}
                  <div className="grid grid-cols-4 gap-2 py-2 border-y border-slate-100 text-center text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">ÁREA</span>
                      <span className="text-xs font-bold">{property.specs.usableAreaM2} m²</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">QUARTOS</span>
                      <span className="text-xs font-bold">{property.specs.bedrooms} ({property.specs.suites}s)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">BANH.</span>
                      <span className="text-xs font-bold">{property.specs.bathrooms}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">VAGAS</span>
                      <span className="text-xs font-bold">{property.specs.parkingSpaces}</span>
                    </div>
                  </div>

                  {/* Owner Chip */}
                  <div 
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      ownerAccess.allowed ? 'bg-slate-50 border-slate-100' : 'bg-amber-50/60 border-amber-200/70'
                    }`}
                    onClick={(e) => {
                      if (!ownerAccess.allowed) {
                        e.stopPropagation();
                        alert(`Acesso Restrito: ${ownerAccess.reason}`);
                        return;
                      }
                      if (linkedOwner) {
                        e.stopPropagation();
                        onViewOwnerDetails(linkedOwner);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {ownerAccess.allowed ? (
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <span className="truncate text-slate-700 font-medium">
                        {ownerAccess.allowed ? (
                          <>Proprietário: <strong className="hover:underline">{property.ownerName}</strong></>
                        ) : (
                          <>Proprietário: <strong className="text-amber-900">{property.ownerName.split(' ')[0]} ***</strong> (Restrito ao Captador)</>
                        )}
                      </span>
                    </div>
                    {ownerAccess.allowed ? (
                      <span className="text-[10px] font-bold text-blue-600 shrink-0">Ver ficha →</span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">Protegido</span>
                    )}
                  </div>

                  {/* Pricing Bar */}
                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      {property.pricing.salePrice ? (
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Venda</span>
                          <span className="text-lg font-black text-slate-900">
                            {property.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                      ) : property.pricing.rentPrice ? (
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Aluguel</span>
                          <span className="text-lg font-black text-emerald-700">
                            {property.pricing.rentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            <span className="text-xs font-normal text-slate-500">/mês</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-700">Sob Consulta</span>
                      )}
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                      {property.pricing.condoFee ? (
                        <div>Cond: {property.pricing.condoFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleOpenLandingPage([property])}
                      className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold flex items-center gap-1 transition-colors border border-teal-200/70 text-[11px]"
                      title="Criar mini página de vendas para cliente com dados do corretor e WhatsApp"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Mini Página</span>
                    </button>

                    <button
                      onClick={() => {
                        setPropertyForProposal(property);
                        setShowProposalModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-2xs transition-all hover:shadow-xs active:scale-95 text-[11px]"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Proposta</span>
                    </button>

                    <button
                      onClick={() => setPropertyForRadar(property)}
                      className="px-2 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1 transition-colors border border-indigo-200/70 text-[11px]"
                      title="Radar de leads compatíveis com este imóvel"
                    >
                      <Radar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Radar</span>
                    </button>

                    <button
                      onClick={() => setSelectedPropertyForQr(property)}
                      className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1 transition-colors border border-slate-200 text-[11px]"
                      title="Gerar QR Code da Placa Imobiliária para Impressão"
                    >
                      <QrCode className="w-3.5 h-3.5 text-slate-700" />
                      <span>Placa</span>
                    </button>

                    {onNavigateToPtam && (
                      <button
                        onClick={() => onNavigateToPtam(property)}
                        className="px-2 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold flex items-center gap-1 transition-colors border border-amber-200 text-[11px]"
                        title="Gerar Laudo PTAM (CRECI) para este imóvel"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>PTAM</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedPropertyForDetail(property)}
                      className="px-2 py-1.5 rounded-lg font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors"
                    >
                      <span>Ficha</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(property)}
                      title="Editar Imóvel"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja realmente remover o imóvel ${property.code}?`)) {
                          onDeleteProperty(property.id);
                        }
                      }}
                      title="Excluir Imóvel"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'TABLE' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 min-w-[760px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                <tr>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                      title={selectedPropertyIds.length === filteredProperties.length && filteredProperties.length > 0 ? 'Desmarcar todos' : 'Selecionar todos'}
                    >
                      {selectedPropertyIds.length === filteredProperties.length && filteredProperties.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Código / Imóvel</th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Tipo & Transação</th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Bairro / Cidade</th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Medidas & Cômodos</th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Valores (Venda / Aluguel)</th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Proprietário</th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Status</th>
                  <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.map(property => {
                  const linkedOwner = owners.find(o => o.id === property.ownerId);
                  const isSelected = selectedPropertyIds.includes(property.id);

                  return (
                    <tr 
                      key={property.id}
                      onClick={() => setSelectedPropertyForDetail(property)}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleToggleSelectProperty(property.id)}
                          className="p-1 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                          title="Selecionar imóvel para mini página"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <span className="font-mono font-black text-blue-700 text-xs block">
                          {property.code}
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 max-w-[200px] sm:max-w-xs">
                          {property.title}
                        </span>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <div className="font-semibold text-slate-900 text-xs">{property.propertyType}</div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {property.transactionType}
                        </span>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <div className="font-medium text-slate-800 text-xs truncate max-w-[140px]">{property.address.neighborhood}</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">{property.address.city}/{property.address.state}</div>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <div className="font-bold text-slate-800 text-xs">{property.specs.usableAreaM2} m²</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">
                          {property.specs.bedrooms}q ({property.specs.suites}s) • {property.specs.parkingSpaces} vag
                        </div>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        {property.pricing.salePrice ? (
                          <div className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
                            {property.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        ) : null}
                        {property.pricing.rentPrice ? (
                          <div className="font-bold text-emerald-700 text-xs sm:text-sm font-mono">
                            {property.pricing.rentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                          </div>
                        ) : null}
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <span 
                          onClick={(e) => {
                            if (linkedOwner) {
                              e.stopPropagation();
                              onViewOwnerDetails(linkedOwner);
                            }
                          }}
                          className="font-medium text-blue-700 hover:underline block text-xs truncate max-w-[140px]"
                        >
                          {property.ownerName}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                          {property.ownerPhone}
                        </span>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          property.status === 'DISPONIVEL'
                            ? 'bg-emerald-50 text-emerald-700'
                            : property.status === 'RESERVADO'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {property.status}
                        </span>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 sm:gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleOpenLandingPage([property])}
                            className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Criar mini página de vendas para cliente"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Mini Página</span>
                          </button>
                          <button
                            onClick={() => {
                              setPropertyForProposal(property);
                              setShowProposalModal(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Abrir Proposta para este imóvel"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Proposta</span>
                          </button>
                          <button
                            onClick={() => setPropertyForRadar(property)}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Radar de Leads compatíveis"
                          >
                            <Radar className="w-3.5 h-3.5" />
                            <span>Radar</span>
                          </button>
                          <button
                            onClick={() => setSelectedPropertyForQr(property)}
                            className="px-2.5 py-1 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Gerar QR Code da Placa Imobiliária para Impressão"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Placa</span>
                          </button>
                          {onNavigateToPtam && (
                            <button
                              onClick={() => onNavigateToPtam(property)}
                              className="px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Gerar Laudo PTAM (CRECI / COFECI)"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>PTAM</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(property)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remover imóvel ${property.code}?`)) {
                                onDeleteProperty(property.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* MAP VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Mapa Interativo do Portfólio de Imóveis (Google Maps)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {filteredProperties.length} imóveis no mapa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Visualize os imóveis geolocalizados em São Paulo e região. Clique em qualquer marcador para inspecionar a ficha, proposta ou gerar a placa física.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filtro ativo:</span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                {selectedTransaction === 'TODOS' ? 'Venda & Locação' : selectedTransaction}
              </span>
            </div>
          </div>

          <GoogleMapComponent
            center={{ lat: -23.5615, lng: -46.6559 }}
            zoom={13}
            height="580px"
            selectedMarkerId={selectedMarkerPropertyId || undefined}
            onMarkerClick={(marker) => {
              setSelectedMarkerPropertyId(marker.id);
            }}
            markers={filteredProperties.map((p, idx) => {
              const n = p.address.neighborhood.toLowerCase();
              let baseLat = -23.5615;
              let baseLng = -46.6559;

              if (n.includes('jardin')) { baseLat = -23.5629; baseLng = -46.6691; }
              else if (n.includes('itaim')) { baseLat = -23.5835; baseLng = -46.6789; }
              else if (n.includes('pinheiro')) { baseLat = -23.5612; baseLng = -46.6918; }
              else if (n.includes('vila madalena')) { baseLat = -23.5539; baseLng = -46.6912; }
              else if (n.includes('moema')) { baseLat = -23.6045; baseLng = -46.6672; }
              else if (n.includes('brooklin')) { baseLat = -23.6190; baseLng = -46.6920; }
              else if (n.includes('morumbi')) { baseLat = -23.6010; baseLng = -46.7210; }
              else if (n.includes('higien')) { baseLat = -23.5430; baseLng = -46.6570; }
              else if (n.includes('perdizes')) { baseLat = -23.5350; baseLng = -46.6750; }
              else if (n.includes('bela vista')) { baseLat = -23.5580; baseLng = -46.6490; }

              const offsetLat = ((idx % 5) - 2) * 0.0035;
              const offsetLng = (Math.floor(idx / 5) - 1) * 0.0042;

              const coverImg = p.images.find(img => img.isCover)?.url || p.images[0]?.url;
              const price = p.pricing.salePrice || p.pricing.rentPrice || 0;

              return {
                id: p.id,
                title: `${p.code} - ${p.title}`,
                lat: baseLat + offsetLat,
                lng: baseLng + offsetLng,
                address: `${p.address.street}, ${p.address.number || ''} - ${p.address.neighborhood}`,
                price: price,
                imageUrl: coverImg,
                status: p.status,
                badge: p.transactionType === 'LOCACAO' ? 'Aluguel' : 'Venda'
              };
            })}
          />

          {/* Quick Active Marker Preview Drawer */}
          {selectedMarkerPropertyId && (() => {
            const activeProp = properties.find(p => p.id === selectedMarkerPropertyId);
            if (!activeProp) return null;
            const coverImg = activeProp.images.find(img => img.isCover)?.url || activeProp.images[0]?.url;
            return (
              <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center gap-4">
                  {coverImg && (
                    <img src={coverImg} alt={activeProp.title} className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500 text-white">
                        {activeProp.code}
                      </span>
                      <span className="text-xs font-bold text-amber-400">
                        {activeProp.transactionType === 'LOCACAO' ? 'LOCAÇÃO' : 'VENDA'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {activeProp.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white mt-0.5">{activeProp.title}</h4>
                    <p className="text-xs text-slate-300">
                      {activeProp.address.street}, {activeProp.address.number} - {activeProp.address.neighborhood} • {activeProp.specs.usableAreaM2}m² • {activeProp.specs.bedrooms} dorms • {activeProp.specs.parkingSpaces} vagas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                  <button
                    onClick={() => setSelectedPropertyForQr(activeProp)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <QrCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>QR Placa</span>
                  </button>
                  <button
                    onClick={() => {
                      setPropertyForProposal(activeProp);
                      setShowProposalModal(true);
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Criar Proposta</span>
                  </button>
                  <button
                    onClick={() => setSelectedPropertyForDetail(activeProp)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <span>Ver Ficha Completa</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Property Create/Edit Modal */}
      {isModalOpen && (
        <PropertyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveModal}
          propertyToEdit={propertyToEdit}
          owners={owners}
          onOpenNewOwnerModal={onOpenNewOwnerModal}
        />
      )}

      {/* Property Detail 360° Modal */}
      {selectedPropertyForDetail && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          isOpen={!!selectedPropertyForDetail}
          onClose={() => setSelectedPropertyForDetail(null)}
          onEdit={(property) => {
            setSelectedPropertyForDetail(null);
            handleOpenEdit(property);
          }}
          onViewOwner={(owner) => {
            setSelectedPropertyForDetail(null);
            onViewOwnerDetails(owner);
          }}
          onOpenLandingPage={(property) => {
            handleOpenLandingPage([property]);
          }}
          onOpenProposal={(property) => {
            setSelectedPropertyForDetail(null);
            setPropertyForProposal(property);
            setShowProposalModal(true);
          }}
          onOpenRadar={(property) => {
            setSelectedPropertyForDetail(null);
            setPropertyForRadar(property);
          }}
          owners={owners}
        />
      )}

      {/* Proposal Modal */}
      {showProposalModal && propertyForProposal && (
        <ProposalModal
          isOpen={showProposalModal}
          onClose={() => {
            setShowProposalModal(false);
            setPropertyForProposal(null);
          }}
          property={propertyForProposal}
          leads={leads}
          onSaveProposal={(proposal, newLeadData) => {
            if (onSaveProposal) {
              onSaveProposal(proposal, newLeadData);
            }
          }}
        />
      )}

      {/* Lead Radar Modal */}
      {propertyForRadar && (
        <LeadRadarModal
          isOpen={!!propertyForRadar}
          onClose={() => setPropertyForRadar(null)}
          property={propertyForRadar}
          leads={leads}
          onSelectLeadForProposal={(prop, lead) => {
            setPropertyForProposal(prop);
            setShowProposalModal(true);
          }}
        />
      )}

      {/* Floating Bottom Selection Bar */}
      {selectedPropertyIds.length > 0 && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-2xl px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6 animate-in slide-in-from-bottom-5 duration-200 max-w-[95vw]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                <span>{selectedPropertyIds.length}</span>
                <span>{selectedPropertyIds.length === 1 ? 'imóvel selecionado' : 'imóveis selecionados'}</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold hidden sm:block">
                "Separei essas opções pensando em você"
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-700" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenLandingPage()}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Criar Mini Página de Vendas</span>
            </button>

            <button
              onClick={handleClearSelection}
              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title="Limpar e Fechar Seleção"
              aria-label="Limpar e Fechar"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </div>
      )}

      {/* Broker Sales Landing Page Modal */}
      <BrokerSalesLandingPageModal
        isOpen={showLandingPageModal}
        onClose={() => {
          setShowLandingPageModal(false);
          setLandingPageProperties([]);
        }}
        selectedProperties={landingPageProperties}
        currentUser={currentUser}
        leads={leads}
        onRemoveProperty={(propId) => {
          setLandingPageProperties(prev => prev.filter(p => p.id !== propId));
          setSelectedPropertyIds(prev => prev.filter(id => id !== propId));
        }}
      />

      {/* Property QR Placa Modal for Physical Sign Printing */}
      <PropertyQrPlacaModal
        property={selectedPropertyForQr}
        isOpen={!!selectedPropertyForQr}
        onClose={() => setSelectedPropertyForQr(null)}
      />
    </div>
  );
};

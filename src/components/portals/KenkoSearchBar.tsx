import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  ChevronDown, 
  Home, 
  Building, 
  Check, 
  X, 
  Sparkles, 
  DollarSign, 
  Bed, 
  Car, 
  Maximize2,
  Tag
} from 'lucide-react';
import { AdvancedSearchStyle } from '../../types/websiteSeo';

export interface AdvancedFilterState {
  transaction: 'TODOS' | 'VENDA' | 'LOCACAO' | 'LANCAMENTO';
  query: string;
  propertyType: string;
  bedrooms: number | null; // null = any, 1, 2, 3, 4+
  bathrooms: number | null;
  parkingSpaces: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  minArea: number | null;
  maxArea: number | null;
  selectedAmenities: string[];
  selectedQuickTag: string | null;
}

export type KenkoFilterState = AdvancedFilterState;

interface AdvancedSearchBarProps {
  style?: AdvancedSearchStyle;
  totalResultsCount?: number;
  onFilterChange: (filters: AdvancedFilterState) => void;
  accentColor?: string;
  isDarkTheme?: boolean;
}

export type KenkoSearchBarProps = AdvancedSearchBarProps;

const QUICK_TAGS = [
  'Pronto para Morar',
  'Lançamentos na Planta',
  'Studios & Compactos',
  'Alto Padrão VIP',
  'Mobiliado',
  'Perto do Metrô',
  'Varanda Gourmet',
  'Pet Friendly'
];

const PROPERTY_TYPES = [
  { id: 'TODOS', label: 'Todos os Imóveis' },
  { id: 'APARTAMENTO', label: 'Apartamentos' },
  { id: 'CASA', label: 'Casas' },
  { id: 'COBERTURA', label: 'Coberturas' },
  { id: 'COMERCIAL', label: 'Salas Comerciais' },
  { id: 'TERRENO', label: 'Terrenos' }
];

const AMENITIES_LIST = [
  'Piscina',
  'Academia / Fitness',
  'Varanda Gourmet',
  'Churrasqueira',
  'Mobiliado',
  'Portaria 24h',
  'Elevador',
  'Playground',
  'Aceita Permuta',
  'Pet Friendly',
  'Perto do Metrô',
  'Vista Panorâmica'
];

export const KenkoSearchBar: React.FC<KenkoSearchBarProps> = ({
  style = 'HERO_BOX',
  totalResultsCount = 24,
  onFilterChange,
  accentColor = '#2563EB',
  isDarkTheme = false
}) => {
  const [filters, setFilters] = useState<KenkoFilterState>({
    transaction: 'TODOS',
    query: '',
    propertyType: 'TODOS',
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    selectedAmenities: [],
    selectedQuickTag: null
  });

  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const updateFilters = (newFilters: Partial<KenkoFilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleTransactionChange = (tab: KenkoFilterState['transaction']) => {
    updateFilters({ transaction: tab });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.selectedAmenities.includes(amenity);
    const updated = exists
      ? filters.selectedAmenities.filter(a => a !== amenity)
      : [...filters.selectedAmenities, amenity];
    updateFilters({ selectedAmenities: updated });
  };

  const selectQuickTag = (tag: string) => {
    const newTag = filters.selectedQuickTag === tag ? null : tag;
    updateFilters({ selectedQuickTag: newTag });
  };

  const resetFilters = () => {
    const fresh: KenkoFilterState = {
      transaction: 'TODOS',
      query: '',
      propertyType: 'TODOS',
      bedrooms: null,
      bathrooms: null,
      parkingSpaces: null,
      minPrice: null,
      maxPrice: null,
      minArea: null,
      maxArea: null,
      selectedAmenities: [],
      selectedQuickTag: null
    };
    setFilters(fresh);
    onFilterChange(fresh);
  };

  const activeFiltersCount = [
    filters.propertyType !== 'TODOS',
    filters.bedrooms !== null,
    filters.bathrooms !== null,
    filters.parkingSpaces !== null,
    filters.minPrice !== null || filters.maxPrice !== null,
    filters.minArea !== null,
    filters.selectedAmenities.length > 0,
    filters.selectedQuickTag !== null
  ].filter(Boolean).length;

  // Background styling
  const cardBg = isDarkTheme ? 'bg-slate-900/95 text-white border-slate-700/80' : 'bg-white text-slate-800 border-slate-200';
  const inputBg = isDarkTheme ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400';
  const tagInactiveBg = isDarkTheme ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200';

  return (
    <div className="w-full relative z-20">
      {/* ------------------------------------------------------------- */}
      {/* ESTILO 1: HERO BOX (FLUTUANTE COM ABAS E FILTROS RÁPIDOS) */}
      {/* ------------------------------------------------------------- */}
      {(style === 'HERO_BOX' || (style as string) === 'KENKO_HERO_BOX') && (
        <div className={`rounded-3xl shadow-2xl border backdrop-blur-md p-4 sm:p-6 space-y-4 max-w-4xl mx-auto transition-all ${cardBg}`}>
          
          {/* Top Transaction Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200/50">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTransactionChange('TODOS')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filters.transaction === 'TODOS'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => handleTransactionChange('VENDA')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filters.transaction === 'VENDA'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={filters.transaction === 'VENDA' ? { backgroundColor: accentColor } : {}}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => handleTransactionChange('LOCACAO')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filters.transaction === 'LOCACAO'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={filters.transaction === 'LOCACAO' ? { backgroundColor: accentColor } : {}}
              >
                Alugar
              </button>
              <button
                type="button"
                onClick={() => handleTransactionChange('LANCAMENTO')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filters.transaction === 'LANCAMENTO'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-amber-500'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lançamentos</span>
              </button>
            </div>

            {/* Total Encontrados Badge */}
            <div className="text-xs text-slate-400 font-medium">
              <span className="font-bold text-slate-700 dark:text-slate-200">{totalResultsCount}</span> imóveis disponíveis
            </div>
          </div>

          {/* Main Search Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Input de Busca de Bairro / Cidade / Código */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Bairro, condomínio, cidade ou código..."
                  value={filters.query}
                  onChange={(e) => updateFilters({ query: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all ${inputBg}`}
                />
                {filters.query && (
                  <button 
                    onClick={() => updateFilters({ query: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tipo de Imóvel Dropdown */}
            <div className="lg:col-span-3 relative">
              <button
                type="button"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between border ${inputBg}`}
              >
                <span className="truncate">
                  {PROPERTY_TYPES.find(t => t.id === filters.propertyType)?.label || 'Tipo do Imóvel'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {showTypeDropdown && (
                <div className={`absolute top-full left-0 mt-2 w-full rounded-2xl shadow-xl border p-2 z-30 ${isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        updateFilters({ propertyType: type.id });
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        filters.propertyType === type.id 
                          ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{type.label}</span>
                      {filters.propertyType === type.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quartos Pills */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateFilters({ bedrooms: filters.bedrooms === num ? null : num })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      filters.bedrooms === num
                        ? 'bg-blue-600 text-white border-blue-600'
                        : `${inputBg} hover:border-slate-400`
                    }`}
                    style={filters.bedrooms === num ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                    title={`${num}+ Quartos`}
                  >
                    {num}{num === 4 ? '+' : ''}Q
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Mais Filtros & Buscar */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedModal(true)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  activeFiltersCount > 0
                    ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                    : `${inputBg} hover:bg-slate-200 dark:hover:bg-slate-700`
                }`}
                title="Mais Filtros Avançados"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="flex-1 py-3 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: accentColor }}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>
          </div>

          {/* Quick Tags / Chips Rápidos (Estilo Kenko Sites) */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Destaques:</span>
            </span>
            {QUICK_TAGS.map(tag => {
              const isSelected = filters.selectedQuickTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => selectQuickTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : `${tagInactiveBg} border-transparent`
                  }`}
                  style={isSelected ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ESTILO 2: BARRA HORIZONTAL MODERNA E COMPACTA */}
      {/* ------------------------------------------------------------- */}
      {(style === 'CLEAN_BAR' || (style as string) === 'KENKO_CLEAN_BAR') && (
        <div className={`rounded-2xl shadow-xl border p-2 sm:p-3 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-2 ${cardBg}`}>
          {/* Transaction Pill */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 w-full md:w-auto">
            <button
              onClick={() => handleTransactionChange('VENDA')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filters.transaction === 'VENDA' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Comprar
            </button>
            <button
              onClick={() => handleTransactionChange('LOCACAO')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filters.transaction === 'LOCACAO' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Alugar
            </button>
          </div>

          {/* Search Input */}
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Digite o bairro, condomínio ou cidade..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl focus:outline-hidden ${inputBg}`}
            />
          </div>

          {/* Type Select */}
          <select
            value={filters.propertyType}
            onChange={(e) => updateFilters({ propertyType: e.target.value })}
            className={`px-3 py-2 rounded-xl text-xs font-medium border ${inputBg} shrink-0 w-full md:w-auto`}
          >
            {PROPERTY_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          {/* Quick Filter Modal Trigger */}
          <button
            onClick={() => setShowAdvancedModal(true)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 shrink-0 ${inputBg}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros ({activeFiltersCount})</span>
          </button>

          {/* Submit */}
          <button
            className="w-full md:w-auto px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            Buscar ({totalResultsCount})
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ESTILO 3: EXPANDED CARD (PAINEL COMPLETO NA HOME) */}
      {/* ------------------------------------------------------------- */}
      {(style === 'EXPANDED_CARD' || (style as string) === 'KENKO_EXPANDED_CARD') && (
        <div className={`rounded-3xl shadow-2xl border p-5 sm:p-7 max-w-5xl mx-auto space-y-5 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Mecanismo de Busca Inteligente Multi-Filtros</span>
              <h3 className="text-lg font-bold">Encontre seu Imóvel Ideal</h3>
            </div>
            <div className="flex items-center gap-2">
              {(['TODOS', 'VENDA', 'LOCACAO', 'LANCAMENTO'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTransactionChange(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filters.transaction === tab
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  style={filters.transaction === tab ? { backgroundColor: accentColor } : {}}
                >
                  {tab === 'TODOS' ? 'Todos' : tab === 'VENDA' ? 'Comprar' : tab === 'LOCACAO' ? 'Alugar' : 'Lançamentos'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Localização</label>
              <input
                type="text"
                placeholder="Ex: Pinheiros, Jardins..."
                value={filters.query}
                onChange={e => updateFilters({ query: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border ${inputBg}`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Tipo de Imóvel</label>
              <select
                value={filters.propertyType}
                onChange={e => updateFilters({ propertyType: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border ${inputBg}`}
              >
                {PROPERTY_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Dormitórios</label>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateFilters({ bedrooms: filters.bedrooms === n ? null : n })}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      filters.bedrooms === n ? 'bg-blue-600 text-white' : inputBg
                    }`}
                    style={filters.bedrooms === n ? { backgroundColor: accentColor } : {}}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Vagas de Garagem</label>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateFilters({ parkingSpaces: filters.parkingSpaces === n ? null : n })}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      filters.parkingSpaces === n ? 'bg-blue-600 text-white' : inputBg
                    }`}
                    style={filters.parkingSpaces === n ? { backgroundColor: accentColor } : {}}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedModal(true)}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Mais opções de lazer e condomínio ({activeFiltersCount})</span>
              </button>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-rose-500 hover:underline ml-2"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

            <button
              type="button"
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              style={{ backgroundColor: accentColor }}
            >
              <Search className="w-4 h-4" />
              <span>Ver {totalResultsCount} Imóveis Encontrados</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL / DRAWER DE FILTROS AVANÇADOS KENKO */}
      {/* ------------------------------------------------------------- */}
      {showAdvancedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-2xl rounded-3xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto space-y-6 ${cardBg}`}>
            
            <div className="flex items-center justify-between border-b pb-4 border-slate-200/50">
              <div>
                <h3 className="text-lg font-bold">Filtros Avançados de Imóveis</h3>
                <p className="text-xs text-slate-400">Refine as especificações exatas do seu imóvel</p>
              </div>
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Faixa de Preço */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Faixa de Preço (R$)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Preço Mínimo (Ex: 300000)"
                  value={filters.minPrice || ''}
                  onChange={e => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border ${inputBg}`}
                />
                <input
                  type="number"
                  placeholder="Preço Máximo (Ex: 1500000)"
                  value={filters.maxPrice || ''}
                  onChange={e => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>
            </div>

            {/* Área Útil M² */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Área Privativa / Útil (m²)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Área Mínima m² (Ex: 50)"
                  value={filters.minArea || ''}
                  onChange={e => updateFilters({ minArea: e.target.value ? Number(e.target.value) : null })}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border ${inputBg}`}
                />
                <input
                  type="number"
                  placeholder="Área Máxima m² (Ex: 250)"
                  value={filters.maxArea || ''}
                  onChange={e => updateFilters({ maxArea: e.target.value ? Number(e.target.value) : null })}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>
            </div>

            {/* Comodidades & Lazer (Checkboxes Estilo Kenko) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Lazer, Infraestrutura & Diferenciais
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map(amenity => {
                  const isChecked = filters.selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : `${inputBg} hover:border-slate-400`
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t pt-4 border-slate-200/50">
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Limpar Todos os Filtros
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedModal(false)}
                  className="px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md"
                  style={{ backgroundColor: accentColor }}
                >
                  Aplicar Filtros ({totalResultsCount} imóveis)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export const AdvancedPropertySearchBar = KenkoSearchBar;

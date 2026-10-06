import React, { useState, useMemo } from 'react';
import { 
  Radar, 
  X, 
  Search, 
  Sparkles, 
  Building, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  ExternalLink, 
  Check, 
  Copy, 
  MessageSquare, 
  Calendar, 
  Tag, 
  Filter, 
  ArrowRight,
  Flame,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { RealEstateProperty, Lead } from '../../types/crm';

interface LeadPropertyRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  properties: RealEstateProperty[];
  onSelectPropertyForLead?: (leadId: string, property: RealEstateProperty) => void;
  onScheduleVisit?: (lead: Lead, property: RealEstateProperty) => void;
  onViewPropertyDetails?: (property: RealEstateProperty) => void;
}

export const LeadPropertyRadarModal: React.FC<LeadPropertyRadarModalProps> = ({
  isOpen,
  onClose,
  lead,
  properties,
  onSelectPropertyForLead,
  onScheduleVisit,
  onViewPropertyDetails,
}) => {
  if (!isOpen || !lead) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(40);
  const [transactionFilter, setTransactionFilter] = useState<'TODOS' | 'VENDA' | 'LOCACAO'>('TODOS');
  const [copiedPropertyId, setCopiedPropertyId] = useState<string | null>(null);
  const [linkedPropertyId, setLinkedPropertyId] = useState<string | null>(lead.propertyOfInterestId || null);

  // Calculate affinity score (0 to 99%) for each property against this lead's search profile
  const scoredProperties = useMemo(() => {
    return properties.map((property) => {
      let score = 25; // Base score
      const matchReasons: string[] = [];

      const propPrice = property.pricing.salePrice || property.pricing.rentPrice || 0;
      const isSale = property.transactionType === 'VENDA' || property.transactionType === 'VENDA_LOCACAO';
      const isRent = property.transactionType === 'LOCACAO' || property.transactionType === 'VENDA_LOCACAO';

      // 1. Transaction Type Match
      if (lead.interestType === 'COMPRA') {
        if (isSale) {
          score += 30;
          matchReasons.push('Finalidade Compra compatível');
        } else {
          score -= 20;
        }
      } else if (lead.interestType === 'LOCACAO') {
        if (isRent) {
          score += 30;
          matchReasons.push('Finalidade Locação compatível');
        } else {
          score -= 20;
        }
      } else if (lead.interestType === 'LANCAMENTO') {
        if (isSale) {
          score += 25;
          matchReasons.push('Lançamento / Venda compatível');
        }
      }

      // 2. Budget Compatibility
      if (lead.budgetMin > 0 && lead.budgetMax > 0 && propPrice > 0) {
        if (propPrice >= lead.budgetMin && propPrice <= lead.budgetMax) {
          score += 30;
          matchReasons.push(`Orçamento perfeito (R$ ${propPrice.toLocaleString('pt-BR')})`);
        } else if (propPrice >= lead.budgetMin * 0.85 && propPrice <= lead.budgetMax * 1.15) {
          score += 18;
          matchReasons.push('Faixa de valor muito próxima (±15%)');
        } else if (propPrice >= lead.budgetMin * 0.70 && propPrice <= lead.budgetMax * 1.30) {
          score += 8;
          matchReasons.push('Margem de negociação (±30%)');
        }
      } else if (propPrice > 0) {
        score += 10;
      }

      // 3. Location / Neighborhood Match
      const neighborhoodLower = (property.address.neighborhood || '').toLowerCase();
      const cityLower = (property.address.city || '').toLowerCase();
      const zoneLower = (property.address.zone || '').toLowerCase();
      const titleLower = (property.title || '').toLowerCase();

      const leadTags = (lead.tags || []).map(t => t.toLowerCase());
      const hasNeighborhoodMatch = leadTags.some(tag => 
        neighborhoodLower.includes(tag) || 
        tag.includes(neighborhoodLower) ||
        cityLower.includes(tag) ||
        zoneLower.includes(tag)
      );

      if (hasNeighborhoodMatch) {
        score += 15;
        matchReasons.push(`Bairro no radar do cliente (${property.address.neighborhood})`);
      }

      // 4. Property of Interest Exact Match
      if (lead.propertyOfInterestTitle && titleLower.includes(lead.propertyOfInterestTitle.toLowerCase())) {
        score += 25;
        matchReasons.push('Imóvel originalmente procurado pelo lead');
      }

      // 5. Featured / Exclusive boost
      if (property.featured || property.isExclusive) {
        score += 5;
        matchReasons.push(property.isExclusive ? 'Exclusividade AcertGo' : 'Destaque do Catálogo');
      }

      // Clamp score between 10 and 99
      const finalScore = Math.max(10, Math.min(99, score));

      return {
        property,
        score: finalScore,
        matchReasons,
      };
    });
  }, [properties, lead]);

  // Filtered and sorted properties
  const filteredMatches = useMemo(() => {
    return scoredProperties
      .filter(item => {
        // Min score filter
        if (item.score < minScoreFilter) return false;

        // Transaction filter
        if (transactionFilter === 'VENDA' && item.property.transactionType === 'LOCACAO') return false;
        if (transactionFilter === 'LOCACAO' && item.property.transactionType === 'VENDA') return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.property.title.toLowerCase().includes(q);
          const matchCode = item.property.code.toLowerCase().includes(q);
          const matchNeighborhood = item.property.address.neighborhood.toLowerCase().includes(q);
          if (!matchTitle && !matchCode && !matchNeighborhood) return false;
        }

        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [scoredProperties, minScoreFilter, transactionFilter, searchQuery]);

  const handleCopyPitch = (prop: RealEstateProperty) => {
    const priceFormatted = prop.pricing.salePrice 
      ? `R$ ${prop.pricing.salePrice.toLocaleString('pt-BR')}`
      : `R$ ${prop.pricing.rentPrice?.toLocaleString('pt-BR')}/mês`;

    const text = `Olá, ${lead.name}! Tudo bem?\n\nLocalizei no radar de inteligência da AcertGo um imóvel com perfil exatamente compatível com sua busca:\n\n🏠 *${prop.title}* (Cód. ${prop.code})\n📍 Bairro: ${prop.address.neighborhood}, ${prop.address.city}\n💰 Valor: ${priceFormatted}\n📐 Metragem: ${prop.specs.usableAreaM2 || prop.specs.totalAreaM2}m² | ${prop.specs.bedrooms} quartos (${prop.specs.suites} suítes) | ${prop.specs.parkingSpaces} vagas\n\nPodemos agendar uma visita exclusiva para você conhecer nesta semana?`;

    navigator.clipboard.writeText(text);
    setCopiedPropertyId(prop.id);
    setTimeout(() => setCopiedPropertyId(null), 3000);

    const whatsappUrl = `https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLinkProperty = (prop: RealEstateProperty) => {
    setLinkedPropertyId(prop.id);
    if (onSelectPropertyForLead) {
      onSelectPropertyForLead(lead.id, prop);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Zone */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-indigo-300 relative shadow-inner shrink-0">
                <Radar className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-bold tracking-tight text-white font-heading">
                    Radar de Imóveis para o Lead
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Match 360° Inteligente
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Cruzamento em tempo real do perfil de busca de <strong className="text-white">{lead.name}</strong> com o catálogo de imóveis.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Fechar Radar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lead Search Profile Pill Summary */}
          <div className="mt-3 pt-3 border-t border-indigo-900/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg p-2 border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Cliente</span>
              <span className="font-bold text-white truncate block">{lead.name}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-2 border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Finalidade</span>
              <span className="font-bold text-indigo-300 truncate block">
                {lead.interestType === 'COMPRA' ? 'Aquisição (Compra)' : lead.interestType === 'LOCACAO' ? 'Locação' : 'Lançamento'}
              </span>
            </div>
            <div className="bg-white/5 rounded-lg p-2 border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Orçamento Alvo</span>
              <span className="font-mono font-bold text-emerald-400 truncate block">
                R$ {lead.budgetMin.toLocaleString('pt-BR')} ~ {lead.budgetMax.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="bg-white/5 rounded-lg p-2 border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Tags / Regiões</span>
              <div className="truncate text-slate-200 font-medium">
                {lead.tags && lead.tags.length > 0 ? lead.tags.join(', ') : 'Sem restrição'}
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por código, título ou bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end text-xs">
            {/* Transaction Segmented Buttons */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setTransactionFilter('TODOS')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  transactionFilter === 'TODOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTransactionFilter('VENDA')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  transactionFilter === 'VENDA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Venda
              </button>
              <button
                onClick={() => setTransactionFilter('LOCACAO')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  transactionFilter === 'LOCACAO' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Locação
              </button>
            </div>

            {/* Score Selector */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg">
              <span className="text-slate-500 text-[11px] font-medium">Afinidade mín:</span>
              <select
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="text-[11px] font-bold text-indigo-700 bg-transparent outline-hidden cursor-pointer"
              >
                <option value={0}>Todos ({scoredProperties.length})</option>
                <option value={50}>≥ 50% Match</option>
                <option value={70}>≥ 70% Match</option>
                <option value={85}>≥ 85% Alto Match 🔥</option>
              </select>
            </div>

            <div className="text-xs font-semibold text-slate-500 pl-1">
              <span className="text-indigo-600 font-bold">{filteredMatches.length}</span> imóveis no radar
            </div>
          </div>
        </div>

        {/* Property Matches List Body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-3.5 bg-slate-100/60">
          {filteredMatches.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3 my-6">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600">
                <Radar className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Nenhum imóvel atingiu o critério de compatibilidade mínimo ({minScoreFilter}%)
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tente reduzir o filtro de afinidade mínima ou expandir a faixa de orçamento para localizar mais opções disponíveis no catálogo.
              </p>
              <button
                onClick={() => {
                  setMinScoreFilter(0);
                  setSearchQuery('');
                  setTransactionFilter('TODOS');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Ver todos os imóveis no radar
              </button>
            </div>
          ) : (
            filteredMatches.map(({ property, score, matchReasons }) => {
              const isSuperHigh = score >= 85;
              const isHigh = score >= 70;
              const isLinked = linkedPropertyId === property.id || lead.propertyOfInterestId === property.id;
              const isCopied = copiedPropertyId === property.id;

              const displayPrice = property.pricing.salePrice 
                ? `R$ ${property.pricing.salePrice.toLocaleString('pt-BR')}`
                : `R$ ${property.pricing.rentPrice?.toLocaleString('pt-BR')}/mês`;

              return (
                <div
                  key={property.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border bg-white shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isLinked ? 'ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/20' : 'border-slate-200'
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Thumbnail with score chip */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {property.images && property.images[0]?.url ? (
                        <img 
                          src={property.images[0].url} 
                          alt={property.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Building className="w-8 h-8" />
                        </div>
                      )}
                      
                      {/* Score Badge */}
                      <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5 ${
                        isSuperHigh 
                          ? 'bg-emerald-600 text-white' 
                          : isHigh 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-amber-600 text-white'
                      }`}>
                        {isSuperHigh && <Flame className="w-2.5 h-2.5 fill-white" />}
                        <span>{score}%</span>
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {property.code}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          property.transactionType === 'VENDA'
                            ? 'bg-blue-100 text-blue-800'
                            : property.transactionType === 'LOCACAO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {property.transactionType}
                        </span>
                        {property.isExclusive && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            Exclusivo
                          </span>
                        )}
                        {isLinked && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Imóvel Vinculado
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 hover:text-indigo-600 transition-colors">
                        {property.title}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{property.address.neighborhood}, {property.address.city}</span>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap pt-0.5">
                        <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                          {displayPrice}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3 h-3 text-slate-400" />
                          {property.specs.usableAreaM2 || property.specs.totalAreaM2}m²
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3 text-slate-400" />
                          {property.specs.bedrooms} dorms ({property.specs.suites} suítes)
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="w-3 h-3 text-slate-400" />
                          {property.specs.parkingSpaces} vagas
                        </span>
                      </div>

                      {/* Match Reasons Chips */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {matchReasons.map((reason, idx) => (
                          <span 
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions Bar */}
                  <div className="flex md:flex-col items-center justify-end gap-2 w-full md:w-48 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Send WhatsApp Pitch Button */}
                    <button
                      onClick={() => handleCopyPitch(property)}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isCopied 
                          ? 'bg-emerald-700 text-white' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                      title="Enviar proposta com ficha técnica via WhatsApp do cliente"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Enviado / Copiado!</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Enviar no WhatsApp</span>
                        </>
                      )}
                    </button>

                    {/* Link to Lead Profile */}
                    <button
                      onClick={() => handleLinkProperty(property)}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                        isLinked
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                      title="Definir como imóvel principal no perfil deste cliente"
                    >
                      <Tag className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isLinked ? 'Imóvel Vinculado' : 'Vincular ao Lead'}</span>
                    </button>

                    {/* Schedule Visit */}
                    {onScheduleVisit && (
                      <button
                        onClick={() => onScheduleVisit(lead, property)}
                        className="w-full py-1 px-3 rounded-xl text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3 h-3 text-amber-500" />
                        <span>Agendar Visita</span>
                      </button>
                    )}

                    {/* View Details */}
                    {onViewPropertyDetails && (
                      <button
                        onClick={() => onViewPropertyDetails(property)}
                        className="text-[11px] text-indigo-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Ver Ficha Técnica</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Algoritmo de Radar cruza tipo de transação, teto orçamentário, localização e características.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors"
          >
            Fechar Radar
          </button>
        </div>
      </div>
    </div>
  );
};

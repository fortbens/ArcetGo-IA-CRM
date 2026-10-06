import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Phone, 
  User, 
  DollarSign, 
  MapPin, 
  Tag, 
  Send,
  Calendar,
  Eye,
  Check
} from 'lucide-react';
import { RealEstateProperty, Lead } from '../../types/crm';

interface PropertyLeadRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: RealEstateProperty | null;
  leads: Lead[];
  onConnectLead?: (leadId: string, propertyCode: string) => void;
}

export const PropertyLeadRadarModal: React.FC<PropertyLeadRadarModalProps> = ({
  isOpen,
  onClose,
  property,
  leads,
  onConnectLead,
}) => {
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [filterMinScore, setFilterMinScore] = useState<number>(50);

  if (!isOpen || !property) return null;

  const propPrice = property.pricing.salePrice || property.pricing.rentPrice || 0;
  const isVenda = property.transactionType === 'VENDA' || property.transactionType === 'VENDA_LOCACAO';
  const isLocacao = property.transactionType === 'LOCACAO' || property.transactionType === 'VENDA_LOCACAO';

  // Calculate Compatibility Match for each lead
  const matchedLeads = leads.map((lead) => {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Transaction match (up to 30 pts)
    if (isVenda && lead.interestType === 'COMPRA') {
      score += 30;
      matchReasons.push('Interesse em Compra');
    } else if (isLocacao && lead.interestType === 'LOCACAO') {
      score += 30;
      matchReasons.push('Interesse em Locação');
    } else if (lead.interestType === 'LANCAMENTO' && isVenda) {
      score += 20;
      matchReasons.push('Interesse em Lançamentos');
    }

    // 2. Budget match (up to 35 pts)
    if (propPrice > 0) {
      if (propPrice >= lead.budgetMin && propPrice <= lead.budgetMax) {
        score += 35;
        matchReasons.push('Orçamento 100% Compatível');
      } else if (propPrice >= lead.budgetMin * 0.8 && propPrice <= lead.budgetMax * 1.2) {
        score += 25;
        matchReasons.push('Orçamento Próximo (±20%)');
      } else if (propPrice <= lead.budgetMax * 1.35) {
        score += 15;
        matchReasons.push('Margem de Negociação');
      }
    } else {
      score += 20;
    }

    // 3. Location & Tags match (up to 20 pts)
    const neighborhoodLower = property.address.neighborhood.toLowerCase();
    const cityLower = property.address.city.toLowerCase();
    const leadTagsJoined = lead.tags.join(' ').toLowerCase();

    if (leadTagsJoined.includes(neighborhoodLower) || (lead.propertyOfInterestTitle && lead.propertyOfInterestTitle.toLowerCase().includes(neighborhoodLower))) {
      score += 20;
      matchReasons.push(`Busca no ${property.address.neighborhood}`);
    } else if (leadTagsJoined.includes(cityLower) || leadTagsJoined.includes('jardins') || leadTagsJoined.includes('itaim') || leadTagsJoined.includes('alto padrão')) {
      score += 12;
      matchReasons.push('Perfil de Região / Padrão');
    }

    // 4. Specs / Bedrooms (up to 15 pts)
    if (property.specs.bedrooms >= 2) {
      score += 15;
      matchReasons.push(`${property.specs.bedrooms} dorms`);
    } else {
      score += 10;
    }

    // Cap at 99%
    const finalScore = Math.min(score, 99);

    return {
      lead,
      score: finalScore,
      matchReasons
    };
  })
  .filter(item => item.score >= filterMinScore)
  .sort((a, b) => b.score - a.score);

  const handleSendWhatsApp = (lead: Lead) => {
    const formattedPrice = propPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const text = `Olá, *${lead.name.split(' ')[0]}*! Tudo bem?

Localizei uma excelente oportunidade com o perfil exato do que você procura:

🏛️ *${property.title}* (${property.code})
📍 *Localização:* ${property.address.neighborhood} - ${property.address.city}/${property.address.state}
💰 *Valor:* ${formattedPrice}
📐 *Área:* ${property.specs.usableAreaM2}m² | ${property.specs.bedrooms} dorms (${property.specs.suites} suítes) | ${property.specs.parkingSpaces} vagas
✨ *Diferenciais:* ${property.features.slice(0, 3).join(', ')}

Podemos agendar uma visita exclusiva para você conhecer?`;

    const cleanPhone = lead.phone.replace(/\D/g, '');
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    setCopiedLeadId(lead.id);
    setTimeout(() => setCopiedLeadId(null), 2500);

    if (onConnectLead) {
      onConnectLead(lead.id, property.code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Radar de Leads com Perfil</h2>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-blue-500/30 text-blue-200">
                  Cruzamento em Tempo Real
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Imóvel: <strong className="text-white">{property.code}</strong> · {property.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Reference Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-900">
              {property.pricing.salePrice 
                ? property.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : `${(property.pricing.rentPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês`}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-700">{property.address.neighborhood}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-700">{property.specs.usableAreaM2}m²</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-700">{property.specs.bedrooms} dorms</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Filtrar afinidade mínima:</span>
            <select
              value={filterMinScore}
              onChange={(e) => setFilterMinScore(Number(e.target.value))}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-700 outline-hidden"
            >
              <option value={80}>Score &gt;= 80% (Super Quente)</option>
              <option value={60}>Score &gt;= 60% (Alta Compatibilidade)</option>
              <option value={40}>Score &gt;= 40% (Todos Potenciais)</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {matchedLeads.length} Leads Compatíveis Encontrados no CRM
            </span>
            <span className="text-xs text-slate-400">
              Ordenados por pontuação de aderência ao imóvel
            </span>
          </div>

          {matchedLeads.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Nenhum lead com afinidade acima de {filterMinScore}%</h4>
              <p className="text-xs text-slate-500">Tente reduzir o filtro de afinidade mínima acima.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedLeads.map(({ lead, score, matchReasons }) => {
                const isVeryHigh = score >= 80;
                const isHigh = score >= 60;

                return (
                  <div
                    key={lead.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isVeryHigh 
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs hover:shadow-xs' 
                        : isHigh
                        ? 'bg-white border-blue-200 hover:border-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 rounded-xl text-xs font-extrabold font-mono flex items-center gap-1 ${
                          isVeryHigh 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : isHigh 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700 text-white'
                        }`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{score}% Match</span>
                        </div>

                        <strong className="text-sm font-bold text-slate-900">
                          {lead.name}
                        </strong>

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {lead.stage.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Budget: <strong>R$ {(lead.budgetMax / 1000).toFixed(0)}k</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Corretor: {lead.assignedBrokerName.split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* Match Reasons Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {matchReasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-700"
                          >
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSendWhatsApp(lead)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{copiedLeadId === lead.id ? 'WhatsApp Aberto ✓' : 'Disparar WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <p className="text-slate-500">
            Dica: Dispare mensagens no WhatsApp com a apresentação do imóvel direto para os leads compatíveis.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Fechar Radar
          </button>
        </div>
      </div>
    </div>
  );
};

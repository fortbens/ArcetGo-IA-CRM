import React, { useState } from 'react';
import { 
  Radar, 
  X, 
  Search, 
  Sparkles, 
  Users, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  ArrowRight, 
  Flame, 
  Clock, 
  Target, 
  DollarSign, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { RealEstateProperty, Lead } from '../../types/crm';

interface LeadRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: RealEstateProperty | null;
  leads: Lead[];
  onSelectLeadForProposal?: (property: RealEstateProperty, lead: Lead) => void;
}

export const LeadRadarModal: React.FC<LeadRadarModalProps> = ({
  isOpen,
  onClose,
  property,
  leads,
  onSelectLeadForProposal,
}) => {
  if (!isOpen || !property) return null;

  const [minScoreFilter, setMinScoreFilter] = useState<number>(50);
  const [copiedPhoneLeadId, setCopiedPhoneLeadId] = useState<string | null>(null);

  const propertyPrice = property.pricing.salePrice || property.pricing.rentPrice || 0;
  const isSale = property.transactionType === 'VENDA' || property.transactionType === 'VENDA_LOCACAO';
  const isRent = property.transactionType === 'LOCACAO' || property.transactionType === 'VENDA_LOCACAO';

  // Calculate affinity score (0 to 100%) for each lead
  const scoredLeads = leads.map(lead => {
    let score = 30; // base score
    const matchReasons: string[] = [];

    // 1. Transaction Type Match
    if ((isSale && lead.interestType === 'COMPRA') || (isRent && lead.interestType === 'LOCACAO')) {
      score += 30;
      matchReasons.push(`Interesse compatível (${lead.interestType})`);
    } else if (lead.interestType === 'LANCAMENTO' && isSale) {
      score += 15;
      matchReasons.push('Interesse em lançamentos/venda');
    }

    // 2. Budget Match
    if (lead.budgetMin && lead.budgetMax && propertyPrice > 0) {
      if (propertyPrice >= lead.budgetMin && propertyPrice <= lead.budgetMax) {
        score += 30;
        matchReasons.push(`Orçamento perfeito (R$ ${propertyPrice.toLocaleString('pt-BR')})`);
      } else if (propertyPrice <= lead.budgetMax * 1.15 && propertyPrice >= lead.budgetMin * 0.85) {
        score += 15;
        matchReasons.push('Faixa de preço muito próxima');
      }
    } else {
      score += 10;
    }

    // 3. Location/Neighborhood match in tags or notes
    const neighborhood = property.address.neighborhood.toLowerCase();
    const city = property.address.city.toLowerCase();
    const hasLocationMatch = lead.tags.some(tag => 
      neighborhood.includes(tag.toLowerCase()) || 
      tag.toLowerCase().includes(neighborhood) ||
      city.includes(tag.toLowerCase())
    );
    if (hasLocationMatch) {
      score += 10;
      matchReasons.push(`Bairro desejado (${property.address.neighborhood})`);
    }

    // Cap score at 99
    score = Math.min(99, score);

    return {
      lead,
      score,
      matchReasons,
    };
  });

  // Filter and sort by highest score first
  const matchedLeads = scoredLeads
    .filter(item => item.score >= minScoreFilter)
    .sort((a, b) => b.score - a.score);

  const handleOpenWhatsapp = (lead: Lead) => {
    const propertyTitle = property.title;
    const propertyPriceFmt = propertyPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const msg = encodeURIComponent(
      `Olá ${lead.name.split(' ')[0]}! Tudo bem? Vi que você tem interesse em imóveis no perfil de ${property.address.neighborhood}. Temos uma nova oportunidade excelente: "${propertyTitle}" (${property.code}) por ${propertyPriceFmt}. Gostaria de receber fotos e agendar uma visita?`
    );
    const cleanPhone = lead.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleCopyPhone = (lead: Lead) => {
    navigator.clipboard.writeText(lead.phone);
    setCopiedPhoneLeadId(lead.id);
    setTimeout(() => setCopiedPhoneLeadId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg relative">
              <Radar className="w-5 h-5 animate-spin duration-1000" style={{ animationDuration: '6s' }} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Radar de Leads Compatíveis
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                  {matchedLeads.length} matches
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Imóvel: <strong className="text-white">{property.code}</strong> — {property.title} ({property.address.neighborhood})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Radar Filter Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Critério do Radar:</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-800">
              Valor Ref: {propertyPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-800">
              {property.specs.bedrooms} Dorms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Afinidade mínima:</span>
            <div className="flex items-center gap-1">
              {[50, 70, 85].map(score => (
                <button
                  key={score}
                  onClick={() => setMinScoreFilter(score)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    minScoreFilter === score
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  +{score}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {matchedLeads.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Radar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Nenhum lead com afinidade acima de {minScoreFilter}%</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tente reduzir o filtro de afinidade mínima ou cadastre novos leads no Funil de Vendas.
              </p>
              <button
                onClick={() => setMinScoreFilter(40)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Ver todos os leads (+40%)
              </button>
            </div>
          ) : (
            matchedLeads.map(({ lead, score, matchReasons }) => (
              <div
                key={lead.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Lead Profile */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                      score >= 80 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : score >= 65
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {score}% AFINIDADE
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {lead.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 font-mono text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {lead.phone}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {lead.email}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Corretor: <strong className="text-slate-700">{lead.assignedBrokerName}</strong></span>
                  </div>

                  {/* Match reasons tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {matchReasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenWhatsapp(lead)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Enviar ficha do imóvel via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {onSelectLeadForProposal && (
                    <button
                      onClick={() => {
                        onSelectLeadForProposal(property, lead);
                        onClose();
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      title="Abrir proposta formal para este lead"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Gerar Proposta</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>O radar cruza orçamento, tipo de negócio, bairros e tags de interesse em tempo real.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

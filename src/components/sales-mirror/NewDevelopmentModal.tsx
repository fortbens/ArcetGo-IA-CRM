import React, { useState } from 'react';
import {
  Building2,
  X,
  Check,
  Plus,
  Trash2,
  Upload,
  Percent,
  DollarSign,
  Calendar,
  Layers,
  FileText,
  Sparkles
} from 'lucide-react';
import { LaunchDevelopment } from '../../types/launches';

interface NewDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDevelopment: (newDev: LaunchDevelopment) => void;
}

export const NewDevelopmentModal: React.FC<NewDevelopmentModalProps> = ({
  isOpen,
  onClose,
  onSaveDevelopment
}) => {
  const [form, setForm] = useState({
    title: '',
    tagline: '',
    builderName: '',
    developerName: '',
    incorporationRegistryNumber: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    address: '',
    deliveryDate: 'Dezembro / 2028',
    status: 'LANCAMENTO_OFICIAL' as any,
    towersInput: 'Torre A, Torre B',
    bannerUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    totalUnits: 40,
    priceMin: 850000,
    priceMax: 3200000,
    totalFloors: 14,
    unitsPerFloor: 2,
    architect: '',
    totalCommissionPercent: 5.0,
    brokerPercent: 2.3,
    agencyPercent: 2.2,
    bonusPrizeText: 'Bônus de R$ 10.000 em PIX por unidade fechada no mês',
    signalPercent: 10,
    monthlyInstallmentsCount: 30,
    monthlyInstallmentsPercent: 20,
    keysPercent: 10,
    financingPercent: 50
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const towers = form.towersInput.split(',').map(t => t.trim()).filter(Boolean);
    const newDev: LaunchDevelopment = {
      id: `dev_${Date.now()}`,
      code: `LANC-${form.title.slice(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      title: form.title,
      tagline: form.tagline || 'Lançamento imobiliário de alto padrão e investimento seguro',
      builderName: form.builderName || 'Construtora Parceira',
      developerName: form.developerName || form.builderName || 'Incorporadora',
      incorporationRegistryNumber: form.incorporationRegistryNumber || 'RI em andamento no cartório competente',
      neighborhood: form.neighborhood || 'Jardins',
      city: form.city,
      state: form.state,
      address: form.address || `${form.neighborhood}, ${form.city} - ${form.state}`,
      deliveryDate: form.deliveryDate,
      status: form.status,
      totalUnits: Number(form.totalUnits),
      availableUnits: Number(form.totalUnits) - 4,
      reservedUnits: 2,
      soldUnits: 2,
      blockedUnits: 0,
      bannerUrl: form.bannerUrl,
      towers: towers.length > 0 ? towers : ['Torre Única'],
      renderGallery: [form.bannerUrl],
      technicalSheet: {
        totalTowers: towers.length || 1,
        totalFloors: Number(form.totalFloors),
        unitsPerFloor: Number(form.unitsPerFloor),
        totalLandAreaM2: 2800,
        architect: form.architect || 'Studio de Arquitetura',
        interiorDesigner: 'Design Contemporâneo',
        landscapeArchitect: 'Paisagismo Tropical',
        totalElevators: 2,
        parkingType: 'DETERMINADAS',
        electricCarCharger: true,
        typologies: ['2 Dorms (1 Suíte)', '3 Suítes Master', 'Penthouse Duplex'],
        amenities: ['Piscina Climatizada', 'Academia Completa', 'Espaço Gourmet', 'Coworking'],
        securityFeatures: ['Portaria Blindada 24h', 'Reconhecimento Facial'],
        sustainability: ['Reúso de Água', 'Ponto p/ Carro Elétrico']
      },
      constructionStage: {
        overallPercent: 5,
        foundationPercent: 30,
        structurePercent: 0,
        masonryPercent: 0,
        installationsPercent: 0,
        finishingPercent: 0,
        paintingPercent: 0,
        landscapingPercent: 0,
        lastUpdatedDate: new Date().toLocaleDateString('pt-BR'),
        supervisorName: 'Engenheiro Responsável',
        notes: 'Canteiro de obras instalado e sondagem do terreno concluída.',
        photos: []
      },
      commissionRules: {
        totalPercent: Number(form.totalCommissionPercent),
        brokerPercent: Number(form.brokerPercent),
        agencyPercent: Number(form.agencyPercent),
        managerPercent: 0.5,
        bonusPrizeText: form.bonusPrizeText,
        paymentTerms: 'Repasse em 48h após compensação da 1ª parcela de entrada.'
      },
      floorPlans: [
        {
          id: `fp_${Date.now()}_1`,
          typologyName: 'Apartamento Tipo',
          privateAreaM2: 120,
          bedrooms: 3,
          suites: 2,
          parkingSpaces: 2,
          imageUrl: form.bannerUrl,
          blueprintHighResUrl: '',
          description: 'Planta tipo integrada com churrasqueira gourmet.'
        }
      ],
      documents: [
        {
          id: `doc_${Date.now()}_1`,
          title: 'Book Comercial de Lançamento (PDF)',
          category: 'LIVRO_DO_PRODUTO',
          fileUrl: '',
          fileSizeMb: '25 MB',
          uploadedAt: new Date().toLocaleDateString('pt-BR')
        }
      ],
      salesTableConfig: {
        tableCode: `TAB-${form.title.slice(0, 3).toUpperCase()}-2026`,
        validUntil: '31/12/2026',
        inccAnnualEstimate: 5.5,
        signalPercent: Number(form.signalPercent),
        thirtyDaysPercent: 5,
        sixtyDaysPercent: 5,
        monthlyInstallmentsCount: Number(form.monthlyInstallmentsCount),
        monthlyInstallmentsTotalPercent: Number(form.monthlyInstallmentsPercent),
        semiAnnualInstallmentsCount: 4,
        semiAnnualInstallmentsTotalPercent: 10,
        keysDeliveryPercent: Number(form.keysPercent),
        bankFinancingPercent: Number(form.financingPercent),
        specialCashDiscountPercent: 8
      },
      units: Array.from({ length: 12 }).map((_, idx) => {
        const floor = Math.floor(idx / 2) + 1;
        const unitNum = `${floor}0${(idx % 2) + 1}`;
        const isSold = idx === 0 || idx === 5;
        const isReserved = idx === 2;
        return {
          id: `u_${Date.now()}_${idx}`,
          developmentId: `dev_${Date.now()}`,
          tower: towers[0] || 'Torre Única',
          floor,
          unitNumber: unitNum,
          typology: idx % 2 === 0 ? '3 Suítes Master (135m²)' : '2 Suítes (95m²)',
          privateAreaM2: idx % 2 === 0 ? 135 : 95,
          parkingSpaces: idx % 2 === 0 ? 2 : 1,
          sunOrientation: idx % 2 === 0 ? 'MANHA' : 'TARDE',
          price: idx % 2 === 0 ? form.priceMax : form.priceMin,
          condoFee: 1200,
          iptuFee: 400,
          status: isSold ? 'VENDIDO' : isReserved ? 'RESERVADO' : 'DISPONIVEL',
          reservedByBrokerName: isReserved ? 'Corretor do Plantão' : undefined,
          reservedClientName: isReserved ? 'Cliente Interessado' : undefined,
          reservationExpiresAt: isReserved ? '23h 50m restantes' : undefined
        };
      }),
      createdAt: new Date().toISOString()
    };

    onSaveDevelopment(newDev);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cadastrar Novo Empreendimento (Lançamento)</h3>
              <p className="text-xs text-slate-300">
                Módulo completo 360° com tabela de vendas, comissões e espelho interativo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Section 1: Dados Principais */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> 1. Identificação & Construtora
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Empreendimento *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Reserva Ibirapuera Signature"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slogan / Chamada Principal</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Ex: O privilégio de viver frente ao parque"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Construtora *</label>
                <input
                  type="text"
                  required
                  value={form.builderName}
                  onChange={(e) => setForm({ ...form, builderName: e.target.value })}
                  placeholder="Ex: Cyrela, Even, Gafisa, Trisul..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incorporadora</label>
                <input
                  type="text"
                  value={form.developerName}
                  onChange={(e) => setForm({ ...form, developerName: e.target.value })}
                  placeholder="Ex: Cyrela Incorporações S.A."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={form.neighborhood}
                  onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                  placeholder="Ex: Moema Pássaros"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Previsão de Entrega *</label>
                <input
                  type="text"
                  required
                  value={form.deliveryDate}
                  onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                  placeholder="Ex: Dezembro / 2028"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Torres & Unidades */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> 2. Torres, Pavimentos & Espelho
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Torres (separadas por vírgula)</label>
                <input
                  type="text"
                  value={form.towersInput}
                  onChange={(e) => setForm({ ...form, towersInput: e.target.value })}
                  placeholder="Torre Alpha, Torre Horizon"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total de Andares / Pavimentos</label>
                <input
                  type="number"
                  value={form.totalFloors}
                  onChange={(e) => setForm({ ...form, totalFloors: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total de Unidades</label>
                <input
                  type="number"
                  value={form.totalUnits}
                  onChange={(e) => setForm({ ...form, totalUnits: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preço Inicial (Unidade Tipo)</label>
                <input
                  type="number"
                  value={form.priceMin}
                  onChange={(e) => setForm({ ...form, priceMin: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preço Máximo (Penthouse/Cobertura)</label>
                <input
                  type="number"
                  value={form.priceMax}
                  onChange={(e) => setForm({ ...form, priceMax: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Foto Principal / Fachada</label>
                <input
                  type="text"
                  value={form.bannerUrl}
                  onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Comissões & Regras da Construtora */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1.5">
              <Percent className="w-4 h-4" /> 3. Comissões & Premiações de Venda
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Comissão Total (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.totalCommissionPercent}
                  onChange={(e) => setForm({ ...form, totalCommissionPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Repasse ao Corretor (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.brokerPercent}
                  onChange={(e) => setForm({ ...form, brokerPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Retenção Imobiliária (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.agencyPercent}
                  onChange={(e) => setForm({ ...form, agencyPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">Campanha de Premiação / Bônus Ativo</label>
                <input
                  type="text"
                  value={form.bonusPrizeText}
                  onChange={(e) => setForm({ ...form, bonusPrizeText: e.target.value })}
                  placeholder="Ex: R$ 15.000 em PIX na assinatura do contrato para o corretor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Tabela de Vendas & Fluxo Padrão */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> 4. Fluxo Padrão da Tabela de Vendas
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
              <div>
                <span className="text-[10px] text-amber-800 font-bold block uppercase">Sinal / Ato</span>
                <span className="font-extrabold text-amber-950 text-sm">{form.signalPercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-bold block uppercase">Mensais Obra ({form.monthlyInstallmentsCount}x)</span>
                <span className="font-extrabold text-amber-950 text-sm">{form.monthlyInstallmentsPercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-bold block uppercase">Chaves / Entrega</span>
                <span className="font-extrabold text-amber-950 text-sm">{form.keysPercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-bold block uppercase">Financiamento Pós-Obra</span>
                <span className="font-extrabold text-emerald-800 text-sm">{form.financingPercent}%</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Cadastrar Lançamento & Gerar Espelho</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  Building,
  Calendar,
  Percent,
  Calculator,
  UserCheck,
  CheckCircle2,
  Building2,
  Sliders,
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';
import { CommissionDeal, RealEstateProperty, UserProfile } from '../../types/crm';

interface NewCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCommission: (deal: CommissionDeal) => void;
  properties?: RealEstateProperty[];
  currentUser?: UserProfile;
  initialData?: Partial<CommissionDeal>;
}

export const NewCommissionModal: React.FC<NewCommissionModalProps> = ({
  isOpen,
  onClose,
  onSaveCommission,
  properties = [],
  currentUser,
  initialData
}) => {
  // Model selector: 1. SOBRE_VGV (lançamentos) vs 2. PERCENTUAL_COMISSAO (ex: 6% avulso)
  const [model, setModel] = useState<'SOBRE_VGV' | 'PERCENTUAL_COMISSAO'>(
    initialData?.calculationModel || 'PERCENTUAL_COMISSAO'
  );

  // Property selection
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialData?.propertyId || (properties[0]?.id || '')
  );
  const [isCustomProperty, setIsCustomProperty] = useState<boolean>(!properties.length);
  const [propertyTitle, setPropertyTitle] = useState<string>(
    initialData?.propertyTitle || (properties[0]?.title || '')
  );
  const [dealCode, setDealCode] = useState<string>(
    initialData?.code || `VEN-2026-${Math.floor(100 + Math.random() * 900)}`
  );

  // Financial inputs
  const defaultSalePrice = initialData?.salePrice || (properties[0]?.pricing?.salePrice || 1200000);
  const [salePrice, setSalePrice] = useState<number>(defaultSalePrice);
  const [commissionRate, setCommissionRate] = useState<number>(
    initialData?.totalCommissionPercent || (model === 'PERCENTUAL_COMISSAO' ? 6 : 4)
  );
  const [closedAt, setClosedAt] = useState<string>(
    initialData?.closedAt || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'RECEBIDO' | 'A_RECEBER_FUTURO' | 'PAGO_COM_RPA'>(
    initialData?.status || 'A_RECEBER_FUTURO'
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');

  // Participants in MODEL 1: SOBRE_VGV (% direto sobre o VGV da venda)
  const [fechadorNameVgv, setFechadorNameVgv] = useState(initialData?.fechadorName || 'Juliana Mendes');
  const [fechadorPercentVgv, setFechadorPercentVgv] = useState<number>(
    initialData?.fechadorPercent || 1.30
  );

  const [coordenadorNameVgv, setCoordenadorNameVgv] = useState(
    initialData?.coordenadorName || 'Marcos Vinicius (Coordenador)'
  );
  const [coordenadorPercentVgv, setCoordenadorPercentVgv] = useState<number>(
    initialData?.coordenadorPercent || 0.35
  );

  const [gerenteNameVgv, setGerenteNameVgv] = useState(initialData?.gerenteName || 'Carlos Eduardo (Gerente)');
  const [gerentePercentVgv, setGerentePercentVgv] = useState<number>(
    initialData?.gerentePercent || 0.25
  );

  const [imobiliariaPercentVgv, setImobiliariaPercentVgv] = useState<number>(
    initialData?.imobiliariaPercent || 2.10
  );

  // Participants in MODEL 2: PERCENTUAL_COMISSAO (% sobre o valor da comissão)
  const [fechadorNamePct, setFechadorNamePct] = useState(initialData?.fechadorName || 'Roberto Silveira');
  const [fechadorPercentPct, setFechadorPercentPct] = useState<number>(
    initialData?.fechadorPercent || 40
  );

  const [captadorNamePct, setCaptadorNamePct] = useState(initialData?.captadorName || 'Fernanda Castro');
  const [captadorPercentPct, setCaptadorPercentPct] = useState<number>(
    initialData?.captadorPercent || 40
  );

  const [gerenteNamePct, setGerenteNamePct] = useState(initialData?.gerenteName || 'Camila Albuquerque');
  const [gerentePercentPct, setGerentePercentPct] = useState<number>(
    initialData?.gerentePercent || 10
  );

  const [imobiliariaPercentPct, setImobiliariaPercentPct] = useState<number>(
    initialData?.imobiliariaPercent || 10
  );

  // When property dropdown changes
  const handlePropertySelect = (propId: string) => {
    setSelectedPropertyId(propId);
    const found = properties.find(p => p.id === propId);
    if (found) {
      setPropertyTitle(`${found.code} - ${found.title}`);
      if (found.pricing?.salePrice) {
        setSalePrice(found.pricing.salePrice);
      }
      if (found.pricing?.commissionSalePercent) {
        setCommissionRate(found.pricing.commissionSalePercent);
      }
    }
  };

  // Switch model handler
  const handleSelectModel = (newModel: 'SOBRE_VGV' | 'PERCENTUAL_COMISSAO') => {
    setModel(newModel);
    if (newModel === 'SOBRE_VGV') {
      setDealCode(prev => prev.startsWith('VEN') ? prev.replace('VEN', 'LAN') : prev);
      setCommissionRate(4);
    } else {
      setDealCode(prev => prev.startsWith('LAN') ? prev.replace('LAN', 'VEN') : prev);
      setCommissionRate(6);
    }
  };

  // Calculations for Model 1 (Sobre o VGV)
  const totalGrossCommissionVgv = (salePrice * commissionRate) / 100;
  const fechadorValueVgv = (salePrice * fechadorPercentVgv) / 100;
  const coordenadorValueVgv = (salePrice * coordenadorPercentVgv) / 100;
  const gerenteValueVgv = (salePrice * gerentePercentVgv) / 100;
  const imobiliariaValueVgv = (salePrice * imobiliariaPercentVgv) / 100;
  const sumVgvRates = fechadorPercentVgv + coordenadorPercentVgv + gerentePercentVgv + imobiliariaPercentVgv;
  const diffVgvRates = commissionRate - sumVgvRates;

  // Calculations for Model 2 (Comissão em Porcentual, ex.: 6%)
  const totalGrossCommissionPct = (salePrice * commissionRate) / 100;
  const fechadorValuePct = (totalGrossCommissionPct * fechadorPercentPct) / 100;
  const captadorValuePct = (totalGrossCommissionPct * captadorPercentPct) / 100;
  const gerenteValuePct = (totalGrossCommissionPct * gerentePercentPct) / 100;
  const imobiliariaValuePct = (totalGrossCommissionPct * imobiliariaPercentPct) / 100;
  const sumPctSplit = fechadorPercentPct + captadorPercentPct + gerentePercentPct + imobiliariaPercentPct;
  const diffPctSplit = 100 - sumPctSplit;

  // Presets Model 1
  const applyPresetVgv = (preset: 'padrao4' | 'ousado5' | 'economico3') => {
    if (preset === 'padrao4') {
      setCommissionRate(4.0);
      setFechadorPercentVgv(1.30);
      setCoordenadorPercentVgv(0.35);
      setGerentePercentVgv(0.25);
      setImobiliariaPercentVgv(2.10);
    } else if (preset === 'ousado5') {
      setCommissionRate(5.0);
      setFechadorPercentVgv(1.80);
      setCoordenadorPercentVgv(0.40);
      setGerentePercentVgv(0.30);
      setImobiliariaPercentVgv(2.50);
    } else {
      setCommissionRate(3.0);
      setFechadorPercentVgv(1.00);
      setCoordenadorPercentVgv(0.25);
      setGerentePercentVgv(0.20);
      setImobiliariaPercentVgv(1.55);
    }
  };

  // Presets Model 2
  const applyPresetPct = (preset: 'creci6_4040' | 'creci6_3535' | 'exclusivo5') => {
    if (preset === 'creci6_4040') {
      setCommissionRate(6.0);
      setCaptadorPercentPct(40);
      setFechadorPercentPct(40);
      setGerentePercentPct(10);
      setImobiliariaPercentPct(10);
    } else if (preset === 'creci6_3535') {
      setCommissionRate(6.0);
      setCaptadorPercentPct(35);
      setFechadorPercentPct(35);
      setGerentePercentPct(10);
      setImobiliariaPercentPct(20);
    } else {
      setCommissionRate(5.0);
      setCaptadorPercentPct(35);
      setFechadorPercentPct(35);
      setGerentePercentPct(10);
      setImobiliariaPercentPct(20);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let dealToSave: CommissionDeal;

    if (model === 'SOBRE_VGV') {
      dealToSave = {
        id: initialData?.id || `com_${Date.now()}`,
        code: dealCode,
        propertyTitle: propertyTitle || 'Imóvel Cadastrado',
        propertyId: isCustomProperty ? undefined : selectedPropertyId,
        salePrice,
        totalCommissionPercent: commissionRate,
        totalCommissionValue: totalGrossCommissionVgv,
        calculationModel: 'SOBRE_VGV',
        calculationDetail: `Sobre o VGV: Fechador ${fechadorPercentVgv}%, Coord. ${coordenadorPercentVgv}%, Gerente ${gerentePercentVgv}%, Imob. ${imobiliariaPercentVgv}%`,
        captadorName: coordenadorNameVgv,
        captadorPercent: coordenadorPercentVgv,
        captadorValue: coordenadorValueVgv,
        fechadorName: fechadorNameVgv,
        fechadorPercent: fechadorPercentVgv,
        fechadorValue: fechadorValueVgv,
        coordenadorName: coordenadorNameVgv,
        coordenadorPercent: coordenadorPercentVgv,
        coordenadorValue: coordenadorValueVgv,
        gerenteName: gerenteNameVgv,
        gerentePercent: gerentePercentVgv,
        gerenteValue: gerenteValueVgv,
        imobiliariaPercent: imobiliariaPercentVgv,
        imobiliariaValue: imobiliariaValueVgv,
        status,
        closedAt,
        notes: notes || 'Comissão cadastrada via modelo Direto sobre o VGV.'
      };
    } else {
      dealToSave = {
        id: initialData?.id || `com_${Date.now()}`,
        code: dealCode,
        propertyTitle: propertyTitle || 'Imóvel Cadastrado',
        propertyId: isCustomProperty ? undefined : selectedPropertyId,
        salePrice,
        totalCommissionPercent: commissionRate,
        totalCommissionValue: totalGrossCommissionPct,
        calculationModel: 'PERCENTUAL_COMISSAO',
        calculationDetail: `Comissão em Porcentual: ${commissionRate}% s/ Venda (Split ${captadorPercentPct}/${fechadorPercentPct}/${gerentePercentPct}/${imobiliariaPercentPct}%)`,
        captadorName: captadorNamePct,
        captadorPercent: captadorPercentPct,
        captadorValue: captadorValuePct,
        fechadorName: fechadorNamePct,
        fechadorPercent: fechadorPercentPct,
        fechadorValue: fechadorValuePct,
        gerenteName: gerenteNamePct,
        gerentePercent: gerentePercentPct,
        gerenteValue: gerenteValuePct,
        imobiliariaPercent: imobiliariaPercentPct,
        imobiliariaValue: imobiliariaValuePct,
        status,
        closedAt,
        notes: notes || `Comissão cadastrada a ${commissionRate}% padrão mercado avulso.`
      };
    }

    onSaveCommission(dealToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                {initialData?.id ? 'Editar Comissão Registrada' : 'Adicionar Nova Comissão'}
              </h2>
              <p className="text-xs text-slate-400">
                Escolha o modelo de cálculo e configure o rateio entre os profissionais
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-slate-800 text-xs">
          
          {/* ============================================================== */}
          {/* SELETOR DE MODELOS: 1. SOBRE O VGV vs 2. COMISSÃO EM % (EX: 6%) */}
          {/* ============================================================== */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
              Selecione o Modelo de Comissionamento <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: SOBRE O VGV */}
              <button
                type="button"
                onClick={() => handleSelectModel('SOBRE_VGV')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  model === 'SOBRE_VGV'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>1. Sobre o VGV</span>
                  </span>
                  {model === 'SOBRE_VGV' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Lançamentos & Construtoras:</strong> taxas diretas sobre o VGV da venda (ex: Corretor 1,30%, Coord. 0,35%, Gerente 0,25%, Imob. 2,10%).
                </div>
              </button>

              {/* Option 2: COMISSÃO EM PORCENTUAL (EX.: 6%) */}
              <button
                type="button"
                onClick={() => handleSelectModel('PERCENTUAL_COMISSAO')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  model === 'PERCENTUAL_COMISSAO'
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <Percent className="w-4 h-4 text-blue-600" />
                    <span>2. Comissão em Porcentual (ex.: 6%)</span>
                  </span>
                  {model === 'PERCENTUAL_COMISSAO' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Mercado Avulso / Padrão CRECI:</strong> define alíquota de comissão (ex: 6% ou 5%) e divide o bolo entre captador, fechador e casa.
                </div>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* INFORMAÇÕES BÁSICAS: IMÓVEL, VGV E DATA */}
          {/* ============================================================== */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Dados da Transação & Imóvel</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomProperty(!isCustomProperty)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                {isCustomProperty ? '← Selecionar do Estoque' : '+ Digitar Imóvel Avulso'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Property Select or Input */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Imóvel / Empreendimento / Unidade <span className="text-rose-500">*</span>
                </label>
                {!isCustomProperty && properties.length > 0 ? (
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => handlePropertySelect(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden truncate"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.title} ({p.address?.neighborhood || 'Bairro'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    placeholder="Ex: Cobertura Jardins - Torre Alpha Unidade 1502"
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                )}
              </div>

              {/* Code */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Código do Fechamento
                </label>
                <input
                  type="text"
                  required
                  value={dealCode}
                  onChange={(e) => setDealCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden uppercase"
                />
              </div>

              {/* Sale Price / VGV */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Valor da Venda / VGV (R$) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step="1000"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-black font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-900"
                />
              </div>

              {/* Commission Rate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Alíquota Total ({model === 'SOBRE_VGV' ? '% s/ VGV' : '% de Comissão'})
                  </label>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    required
                    min={0.1}
                    max={100}
                    step="0.05"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-black font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-blue-700"
                  />
                  <span className="font-bold text-slate-600">%</span>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Data do Fechamento</span>
                </label>
                <input
                  type="date"
                  required
                  value={closedAt}
                  onChange={(e) => setClosedAt(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Status Inicial da Comissão
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  <option value="A_RECEBER_FUTURO">⏳ A Receber Futuro</option>
                  <option value="RECEBIDO">💰 Recebido (Liberado p/ Repasse)</option>
                  <option value="PAGO_COM_RPA">✅ Pago com RPA Emitido</option>
                </select>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* DETALHAMENTO DO RATEIO CONFORME O MODELO ESCOLHIDO */}
          {/* ============================================================== */}
          {model === 'SOBRE_VGV' ? (
            /* MODELO 1: SOBRE O VGV */
            <div className="space-y-3.5 border border-indigo-200 bg-indigo-50/40 p-4 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-200/70">
                <div>
                  <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Rateio Direto sobre o VGV (Lançamentos / Incorporação)</span>
                  </h3>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    Defina a porcentagem que cada profissional recebe diretamente sobre o VGV de {salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <span className="text-[10px] font-bold text-indigo-600">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyPresetVgv('padrao4')}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 rounded-lg text-[10px] font-bold border border-indigo-200 transition-colors"
                  >
                    4% Padrão (1.30/0.35/0.25/2.10)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetVgv('ousado5')}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 rounded-lg text-[10px] font-bold border border-indigo-200 transition-colors"
                  >
                    5% Lançamento
                  </button>
                </div>
              </div>

              {/* Participants Inputs - VGV */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* 1. Fechador */}
                <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Corretor Fechador</span>
                  <input
                    type="text"
                    value={fechadorNameVgv}
                    onChange={(e) => setFechadorNameVgv(e.target.value)}
                    placeholder="Nome do Corretor Fechador"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="100"
                        value={fechadorPercentVgv}
                        onChange={(e) => setFechadorPercentVgv(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% s/ VGV</span>
                    </div>
                    <strong className="text-xs font-black text-indigo-900 font-mono">
                      {fechadorValueVgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>

                {/* 2. Coordenador */}
                <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Coordenador de Produto</span>
                  <input
                    type="text"
                    value={coordenadorNameVgv}
                    onChange={(e) => setCoordenadorNameVgv(e.target.value)}
                    placeholder="Nome do Coordenador"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="100"
                        value={coordenadorPercentVgv}
                        onChange={(e) => setCoordenadorPercentVgv(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% s/ VGV</span>
                    </div>
                    <strong className="text-xs font-black text-indigo-900 font-mono">
                      {coordenadorValueVgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>

                {/* 3. Gerente */}
                <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Gerente Geral</span>
                  <input
                    type="text"
                    value={gerenteNameVgv}
                    onChange={(e) => setGerenteNameVgv(e.target.value)}
                    placeholder="Nome do Gerente"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="100"
                        value={gerentePercentVgv}
                        onChange={(e) => setGerentePercentVgv(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% s/ VGV</span>
                    </div>
                    <strong className="text-xs font-black text-indigo-900 font-mono">
                      {gerenteValueVgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>

                {/* 4. Imobiliária (Retenção Contratual) */}
                <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Imobiliária / Casa</span>
                  <input
                    type="text"
                    disabled
                    value="Imobiliária House (Retenção)"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="100"
                        value={imobiliariaPercentVgv}
                        onChange={(e) => setImobiliariaPercentVgv(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% s/ VGV</span>
                    </div>
                    <strong className="text-xs font-black text-emerald-800 font-mono">
                      {imobiliariaValueVgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Status check on sum */}
              {Math.abs(diffVgvRates) > 0.01 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Atenção: A soma das taxas ({sumVgvRates.toFixed(2)}%) difere da alíquota total ({commissionRate.toFixed(2)}%). Diferença: {diffVgvRates > 0 ? `+${diffVgvRates.toFixed(2)}% não alocado` : `${Math.abs(diffVgvRates).toFixed(2)}% excedente`}.
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* MODELO 2: COMISSÃO EM PORCENTUAL (EX.: 6%) */
            <div className="space-y-3.5 border border-blue-200 bg-blue-50/40 p-4 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-200/70">
                <div>
                  <h3 className="text-xs font-bold text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <Percent className="w-4 h-4 text-blue-600" />
                    <span>Divisão da Comissão em Porcentual ({commissionRate}% s/ Venda)</span>
                  </h3>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Comissão Bruta Gerada: <strong>{totalGrossCommissionPct.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>. Distribua os 100% da comissão:
                  </p>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <span className="text-[10px] font-bold text-blue-600">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyPresetPct('creci6_4040')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 rounded-lg text-[10px] font-bold border border-blue-200 transition-colors"
                  >
                    6% (40/40/10/10)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetPct('creci6_3535')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 rounded-lg text-[10px] font-bold border border-blue-200 transition-colors"
                  >
                    6% (35/35/10/20)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetPct('exclusivo5')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 rounded-lg text-[10px] font-bold border border-blue-200 transition-colors"
                  >
                    5% Especial
                  </button>
                </div>
              </div>

              {/* Participants Inputs - Percentual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* 1. Fechador */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Corretor Fechador</span>
                  <input
                    type="text"
                    value={fechadorNamePct}
                    onChange={(e) => setFechadorNamePct(e.target.value)}
                    placeholder="Nome do Fechador"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-hidden"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={fechadorPercentPct}
                        onChange={(e) => setFechadorPercentPct(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% Com.</span>
                    </div>
                    <strong className="text-xs font-black text-blue-900 font-mono">
                      {fechadorValuePct.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>

                {/* 2. Captador */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Corretor Captador</span>
                  <input
                    type="text"
                    value={captadorNamePct}
                    onChange={(e) => setCaptadorNamePct(e.target.value)}
                    placeholder="Nome do Captador"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-hidden"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={captadorPercentPct}
                        onChange={(e) => setCaptadorPercentPct(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% Com.</span>
                    </div>
                    <strong className="text-xs font-black text-blue-900 font-mono">
                      {captadorValuePct.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>

                {/* 3. Gerente */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Gerente de Vendas</span>
                  <input
                    type="text"
                    value={gerenteNamePct}
                    onChange={(e) => setGerenteNamePct(e.target.value)}
                    placeholder="Nome do Gerente"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-hidden"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={gerentePercentPct}
                        onChange={(e) => setGerentePercentPct(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% Com.</span>
                    </div>
                    <strong className="text-xs font-black text-blue-900 font-mono">
                      {gerenteValuePct.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>

                {/* 4. Imobiliária */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Imobiliária (Casa)</span>
                  <input
                    type="text"
                    disabled
                    value="Imobiliária Matriz"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={imobiliariaPercentPct}
                        onChange={(e) => setImobiliariaPercentPct(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[11px] font-bold text-slate-600">% Com.</span>
                    </div>
                    <strong className="text-xs font-black text-emerald-800 font-mono">
                      {imobiliariaValuePct.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Status check on 100% split */}
              {Math.abs(diffPctSplit) > 0.01 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Atenção: A divisão dos percentuais soma {sumPctSplit}% (o ideal é 100%). Diferença: {diffPctSplit > 0 ? `${diffPctSplit}% livre para a casa` : `${Math.abs(diffPctSplit)}% acima de 100%`}.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Observations */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Observações / Instruções de Liquidação
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pagamento da comissão parcelado em 3x pela construtora ou liberado após escritura"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Real-time Summary Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">VGV da Venda</span>
              <strong className="text-sm font-black font-mono text-white block mt-0.5">
                {salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Comissão Bruta ({commissionRate}%)</span>
              <strong className="text-sm font-black font-mono text-blue-400 block mt-0.5">
                {(model === 'SOBRE_VGV' ? totalGrossCommissionVgv : totalGrossCommissionPct).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Repasse aos Corretores</span>
              <strong className="text-sm font-black font-mono text-indigo-300 block mt-0.5">
                {(model === 'SOBRE_VGV' 
                  ? (fechadorValueVgv + coordenadorValueVgv + gerenteValueVgv) 
                  : (fechadorValuePct + captadorValuePct + gerenteValuePct)
                ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Retenção da Imobiliária</span>
              <strong className="text-sm font-black font-mono text-emerald-400 block mt-0.5">
                {(model === 'SOBRE_VGV' ? imobiliariaValueVgv : imobiliariaValuePct).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{initialData?.id ? 'Salvar Alterações' : 'Cadastrar Comissão'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

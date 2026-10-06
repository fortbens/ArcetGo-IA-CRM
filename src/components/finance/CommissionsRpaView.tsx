import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Printer, 
  Percent, 
  Sparkles, 
  X, 
  Building, 
  Plus, 
  Trash2, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Calculator, 
  Sliders, 
  Check,
  Building2,
  Table,
  Layers,
  ArrowDownToLine,
  Search,
  Filter,
  Eye,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Edit,
  Tag
} from 'lucide-react';
import { CommissionDeal, UserProfile, RealEstateProperty } from '../../types/crm';
import { NewCommissionModal } from './NewCommissionModal';
import { CommissionDataentryTable } from './CommissionDataentryTable';
import { BoletosAvulsosCommissionView } from './BoletosAvulsosCommissionView';
import { SplitGatewaysManagerModal } from '../fintech/SplitGatewaysManagerModal';
import { FileSpreadsheet, QrCode, Wallet, Zap } from 'lucide-react';

interface CommissionsRpaViewProps {
  deals: CommissionDeal[];
  currentUser: UserProfile;
  properties?: RealEstateProperty[];
  onAddDeal?: (deal: CommissionDeal) => void;
  onUpdateDealStatus?: (dealId: string, status: 'RECEBIDO' | 'A_RECEBER_FUTURO' | 'PAGO_COM_RPA') => void;
  onDeleteDeal?: (dealId: string) => void;
}

export type StakeholderCalcType = 
  | 'PERCENT_COMISSAO' // % sobre o valor da comissão (mercado avulso)
  | 'PERCENT_VENDA' // % sobre o valor total da venda/VGV (lançamentos)
  | 'VALOR_FIXO'; // R$ fixo

export interface SimulatorStakeholder {
  id: string;
  name: string;
  role: 'IMOBILIARIA' | 'CAPTADOR' | 'FECHADOR' | 'GERENTE' | 'COORDENADOR' | 'DIRETOR' | 'PARCEIRO_EXTERNO';
  type: StakeholderCalcType;
  percentOnCommission: number; // ex: 30 (%)
  percentOnSale: number; // ex: 1.30 (%)
  fixedAmount: number;
  docOrCreci?: string;
  pixKey?: string;
}

export const CommissionsRpaView: React.FC<CommissionsRpaViewProps> = ({ 
  deals: initialDeals, 
  currentUser,
  properties = [],
  onAddDeal,
  onUpdateDealStatus,
  onDeleteDeal
}) => {
  // Local fallback if handler is not provided
  const [localDeals, setLocalDeals] = useState<CommissionDeal[]>(initialDeals);

  // Keep localDeals in sync when prop changes
  React.useEffect(() => {
    setLocalDeals(initialDeals);
  }, [initialDeals]);

  const dealsList = onAddDeal ? initialDeals : localDeals;

  // Active top tab
  const [activeTab, setActiveTab] = useState<'fechamentos' | 'dataentry' | 'boletos_avulsos' | 'simulador' | 'rpas'>('fechamentos');
  const [isGatewaysModalOpen, setIsGatewaysModalOpen] = useState(false);

  // Filters for Deals table
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'RECEBIDO' | 'A_RECEBER_FUTURO' | 'PAGO_COM_RPA'>('TODOS');
  const [modelFilter, setModelFilter] = useState<'TODOS' | 'SOBRE_VGV' | 'PERCENTUAL_COMISSAO'>('TODOS');

  // Modals
  const [isNewCommissionModalOpen, setIsNewCommissionModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<CommissionDeal | undefined>(undefined);
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<CommissionDeal | null>(null);

  // Simulator based on registered property
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const defaultPrice = selectedProperty 
    ? (selectedProperty.pricing.salePrice || selectedProperty.pricing.rentPrice || 1000000)
    : 1000000;

  const [salePrice, setSalePrice] = useState<number>(defaultPrice);
  const [commissionRate, setCommissionRate] = useState<number>(
    selectedProperty?.transactionType === 'LOCACAO' ? 100 : (selectedProperty?.pricing.commissionSalePercent || 4)
  );

  // Distribution Stakeholders for Simulator
  const [stakeholders, setStakeholders] = useState<SimulatorStakeholder[]>([
    {
      id: '1',
      name: 'Corretor Fechador (Juliana Mendes)',
      role: 'FECHADOR',
      type: 'PERCENT_VENDA',
      percentOnCommission: 32.5,
      percentOnSale: 1.30, // 1.3% sobre o valor da venda
      fixedAmount: 0,
      docOrCreci: 'CRECI 210.984-F',
      pixKey: 'juliana.mendes@imobiliaria.com.br'
    },
    {
      id: '2',
      name: 'Coordenador de Lançamento (Marcos Vinicius)',
      role: 'COORDENADOR',
      type: 'PERCENT_VENDA',
      percentOnCommission: 8.75,
      percentOnSale: 0.35, // 0.35% sobre o valor da venda
      fixedAmount: 0,
      docOrCreci: 'CRECI 198.420-F',
      pixKey: 'marcos.coordenador@imobiliaria.com.br'
    },
    {
      id: '3',
      name: 'Gerente Geral (Carlos Eduardo)',
      role: 'GERENTE',
      type: 'PERCENT_VENDA',
      percentOnCommission: 6.25,
      percentOnSale: 0.25, // 0.25% sobre o valor da venda
      fixedAmount: 0,
      docOrCreci: 'CRECI 142.901-F',
      pixKey: '21987311844'
    },
    {
      id: '4',
      name: 'Imobiliária House (Retenção Contratual)',
      role: 'IMOBILIARIA',
      type: 'PERCENT_VENDA',
      percentOnCommission: 52.5,
      percentOnSale: 2.10, // Restante da comissão de 4%
      fixedAmount: 0,
      docOrCreci: 'CNPJ 12.345.678/0001-90',
      pixKey: 'financeiro@imobiliaria.com.br'
    }
  ]);

  // Preview Modals
  const [rpaPreviewModal, setRpaPreviewModal] = useState<{
    stakeholderName: string;
    stakeholderRole: string;
    stakeholderDoc?: string;
    stakeholderPix?: string;
    amount: number;
    ruleDetail: string;
    propertyTitle: string;
    propertyCode: string;
    totalSale: number;
    totalCommission: number;
  } | null>(null);

  const [isDistributionSheetModalOpen, setIsDistributionSheetModalOpen] = useState(false);

  // When changing property from selector in simulator, sync price & commission
  const handleSelectProperty = (propId: string) => {
    setSelectedPropertyId(propId);
    const prop = properties.find(p => p.id === propId);
    if (prop) {
      const price = prop.pricing.salePrice || prop.pricing.rentPrice || 1000000;
      setSalePrice(price);
      setCommissionRate(prop.transactionType === 'LOCACAO' ? 100 : (prop.pricing.commissionSalePercent || 4));
    }
  };

  // Calculations for current simulator
  const totalCommissionGross = (salePrice * commissionRate) / 100;

  const calculatedStakeholders = stakeholders.map(s => {
    let calculatedAmount = 0;
    let effectivePercentOnSale = 0;
    let effectivePercentOnCommission = 0;

    if (s.type === 'PERCENT_VENDA') {
      calculatedAmount = (salePrice * (s.percentOnSale || 0)) / 100;
      effectivePercentOnSale = s.percentOnSale || 0;
      effectivePercentOnCommission = totalCommissionGross > 0 ? (calculatedAmount / totalCommissionGross) * 100 : 0;
    } else if (s.type === 'PERCENT_COMISSAO') {
      calculatedAmount = (totalCommissionGross * (s.percentOnCommission || 0)) / 100;
      effectivePercentOnCommission = s.percentOnCommission || 0;
      effectivePercentOnSale = salePrice > 0 ? (calculatedAmount / salePrice) * 100 : 0;
    } else {
      calculatedAmount = s.fixedAmount || 0;
      effectivePercentOnCommission = totalCommissionGross > 0 ? (calculatedAmount / totalCommissionGross) * 100 : 0;
      effectivePercentOnSale = salePrice > 0 ? (calculatedAmount / salePrice) * 100 : 0;
    }

    return {
      ...s,
      calculatedAmount,
      effectivePercentOnSale,
      effectivePercentOnCommission,
    };
  });

  const totalDistributedAmount = calculatedStakeholders.reduce((acc, s) => acc + s.calculatedAmount, 0);
  const totalDistributedPercentOnSale = salePrice > 0 ? (totalDistributedAmount / salePrice) * 100 : 0;
  const remainingAmount = totalCommissionGross - totalDistributedAmount;

  // Simulator Presets
  const handleApplyLancamentoPreset = () => {
    setCommissionRate(4.0);
    setStakeholders([
      {
        id: '1',
        name: 'Corretor Fechador (Juliana Mendes)',
        role: 'FECHADOR',
        type: 'PERCENT_VENDA',
        percentOnCommission: 32.5,
        percentOnSale: 1.30,
        fixedAmount: 0,
        docOrCreci: 'CRECI 210.984-F',
        pixKey: 'juliana.mendes@imobiliaria.com.br'
      },
      {
        id: '2',
        name: 'Coordenador de Lançamento (Marcos Vinicius)',
        role: 'COORDENADOR',
        type: 'PERCENT_VENDA',
        percentOnCommission: 8.75,
        percentOnSale: 0.35,
        fixedAmount: 0,
        docOrCreci: 'CRECI 198.420-F',
        pixKey: 'marcos.coordenador@imobiliaria.com.br'
      },
      {
        id: '3',
        name: 'Gerente Geral (Carlos Eduardo)',
        role: 'GERENTE',
        type: 'PERCENT_VENDA',
        percentOnCommission: 6.25,
        percentOnSale: 0.25,
        fixedAmount: 0,
        docOrCreci: 'CRECI 142.901-F',
        pixKey: '21987311844'
      },
      {
        id: '4',
        name: 'Imobiliária House (Retenção Contratual)',
        role: 'IMOBILIARIA',
        type: 'PERCENT_VENDA',
        percentOnCommission: 52.5,
        percentOnSale: 2.10,
        fixedAmount: 0,
        docOrCreci: 'CNPJ 12.345.678/0001-90',
        pixKey: 'financeiro@imobiliaria.com.br'
      }
    ]);
  };

  const handleApplyAvulsoPreset = () => {
    setCommissionRate(6.0);
    setStakeholders([
      {
        id: '1',
        name: 'Imobiliária Matriz',
        role: 'IMOBILIARIA',
        type: 'PERCENT_COMISSAO',
        percentOnCommission: 30,
        percentOnSale: 1.8,
        fixedAmount: 0,
        docOrCreci: 'CNPJ 12.345.678/0001-90',
        pixKey: 'financeiro@imobiliaria.com.br'
      },
      {
        id: '2',
        name: 'Carlos Mendes (Captador)',
        role: 'CAPTADOR',
        type: 'PERCENT_COMISSAO',
        percentOnCommission: 30,
        percentOnSale: 1.8,
        fixedAmount: 0,
        docOrCreci: 'CRECI 123.456-F',
        pixKey: '11999991111'
      },
      {
        id: '3',
        name: 'Juliana Siqueira (Fechadora)',
        role: 'FECHADOR',
        type: 'PERCENT_COMISSAO',
        percentOnCommission: 30,
        percentOnSale: 1.8,
        fixedAmount: 0,
        docOrCreci: 'CRECI 234.567-F',
        pixKey: 'juliana@corretora.com.br'
      },
      {
        id: '4',
        name: 'Roberto Valente (Gerente)',
        role: 'GERENTE',
        type: 'PERCENT_COMISSAO',
        percentOnCommission: 10,
        percentOnSale: 0.6,
        fixedAmount: 0,
        docOrCreci: 'CRECI 98.765-F',
        pixKey: 'roberto@gerencia.com.br'
      }
    ]);
  };

  const handleAddStakeholder = () => {
    const newStakeholder: SimulatorStakeholder = {
      id: `st_${Date.now()}`,
      name: 'Novo Corretor / Parceiro',
      role: 'FECHADOR',
      type: 'PERCENT_VENDA',
      percentOnCommission: 25,
      percentOnSale: 1.0,
      fixedAmount: 0,
      docOrCreci: 'CRECI / CPF',
      pixKey: 'chave-pix@banco.com'
    };
    setStakeholders([...stakeholders, newStakeholder]);
  };

  const handleRemoveStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  // Convert current simulation into a New Commission!
  const handleTurnSimulationIntoCommission = () => {
    const isVgv = stakeholders.some(s => s.type === 'PERCENT_VENDA');
    const fechador = stakeholders.find(s => s.role === 'FECHADOR');
    const captador = stakeholders.find(s => s.role === 'CAPTADOR' || s.role === 'COORDENADOR');
    const gerente = stakeholders.find(s => s.role === 'GERENTE');
    const imobiliaria = stakeholders.find(s => s.role === 'IMOBILIARIA');

    const draftDeal: Partial<CommissionDeal> = {
      code: isVgv ? `LAN-2026-${Math.floor(100 + Math.random() * 900)}` : `VEN-2026-${Math.floor(100 + Math.random() * 900)}`,
      propertyTitle: selectedProperty ? `${selectedProperty.code} - ${selectedProperty.title}` : 'Imóvel Simulado',
      propertyId: selectedProperty?.id,
      salePrice: salePrice,
      totalCommissionPercent: commissionRate,
      totalCommissionValue: totalCommissionGross,
      calculationModel: isVgv ? 'SOBRE_VGV' : 'PERCENTUAL_COMISSAO',
      fechadorName: fechador?.name || 'Corretor Fechador',
      fechadorPercent: isVgv ? (fechador?.percentOnSale || 1.30) : (fechador?.percentOnCommission || 40),
      captadorName: captador?.name || 'Corretor Captador',
      captadorPercent: isVgv ? (captador?.percentOnSale || 0.35) : (captador?.percentOnCommission || 40),
      gerenteName: gerente?.name || 'Gerente de Vendas',
      gerentePercent: isVgv ? (gerente?.percentOnSale || 0.25) : (gerente?.percentOnCommission || 10),
      imobiliariaPercent: isVgv ? (imobiliaria?.percentOnSale || 2.10) : (imobiliaria?.percentOnCommission || 10),
      status: 'A_RECEBER_FUTURO',
      closedAt: new Date().toISOString().split('T')[0],
      notes: `Efetivado a partir do simulador de rateio com VGV de ${salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`
    };

    setEditingDeal(draftDeal as any);
    setIsNewCommissionModalOpen(true);
  };

  // Commission handlers
  const handleSaveCommission = (deal: CommissionDeal) => {
    if (onAddDeal) {
      onAddDeal(deal);
    } else {
      setLocalDeals(prev => {
        const exists = prev.some(d => d.id === deal.id);
        if (exists) {
          return prev.map(d => d.id === deal.id ? deal : d);
        }
        return [deal, ...prev];
      });
    }
    setEditingDeal(undefined);
  };

  const handleUpdateStatus = (dealId: string, newStatus: 'RECEBIDO' | 'A_RECEBER_FUTURO' | 'PAGO_COM_RPA') => {
    if (onUpdateDealStatus) {
      onUpdateDealStatus(dealId, newStatus);
    } else {
      setLocalDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: newStatus } : d));
    }
  };

  const handleDelete = (dealId: string) => {
    if (confirm('Deseja realmente remover o registro desta comissão?')) {
      if (onDeleteDeal) {
        onDeleteDeal(dealId);
      } else {
        setLocalDeals(prev => prev.filter(d => d.id !== dealId));
      }
    }
  };

  // Filtered Deals
  const filteredDeals = dealsList.filter(deal => {
    const matchesSearch = 
      deal.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.fechadorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.captadorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'TODOS' || deal.status === statusFilter;

    const matchesModel = 
      modelFilter === 'TODOS' || 
      (modelFilter === 'SOBRE_VGV' && deal.calculationModel === 'SOBRE_VGV') ||
      (modelFilter === 'PERCENTUAL_COMISSAO' && deal.calculationModel !== 'SOBRE_VGV');

    return matchesSearch && matchesStatus && matchesModel;
  });

  // Performance Metrics calculations (Top Summary Cards)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = Jan, 8 = Set, etc.
  
  // Format current month label, e.g. "Setembro de 2026"
  const monthNameRaw = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(now);
  const capitalizedMonthLabel = monthNameRaw.charAt(0).toUpperCase() + monthNameRaw.slice(1);

  // Filter deals for current month by closedAt
  const currentMonthDeals = dealsList.filter(d => {
    if (!d.closedAt) return false;
    const parts = d.closedAt.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed
      return year === currentYear && month === currentMonth;
    }
    const dDate = new Date(d.closedAt);
    return dDate.getFullYear() === currentYear && dDate.getMonth() === currentMonth;
  });

  const currentMonthCommissionTotal = currentMonthDeals.reduce((acc, d) => acc + (d.totalCommissionValue || 0), 0);
  const currentMonthVgvTotal = currentMonthDeals.reduce((acc, d) => acc + (d.salePrice || 0), 0);
  const currentMonthDealsCount = currentMonthDeals.length;

  // Pending commissions (A Receber Futuro)
  const pendingDeals = dealsList.filter(d => d.status === 'A_RECEBER_FUTURO');
  const totalPendingCommission = pendingDeals.reduce((acc, d) => acc + (d.totalCommissionValue || 0), 0);
  const pendingDealsCount = pendingDeals.length;

  // Paid / Settled commissions (PAGO_COM_RPA or RECEBIDO)
  const paidDeals = dealsList.filter(d => d.status === 'PAGO_COM_RPA' || d.status === 'RECEBIDO');
  const totalPaidCommission = paidDeals.reduce((acc, d) => acc + (d.totalCommissionValue || 0), 0);
  const paidDealsCount = paidDeals.length;

  // Total accumulated (all time)
  const totalAccumulatedCommission = dealsList.reduce((acc, d) => acc + (d.totalCommissionValue || 0), 0);
  const totalAccumulatedVgv = dealsList.reduce((acc, d) => acc + (d.salePrice || 0), 0);

  // Export CSV of Simulator
  const exportSpreadsheetCsv = () => {
    const headers = ['Beneficiário', 'Função', 'Documento/CRECI', 'Modelo Rateio', 'Alíquota', 'Valor a Receber (R$)', 'Chave Pix'];
    const rows = calculatedStakeholders.map(s => [
      `"${s.name}"`,
      `"${s.role}"`,
      `"${s.docOrCreci || ''}"`,
      `"${s.type === 'PERCENT_VENDA' ? '% sobre Valor da Venda' : s.type === 'PERCENT_COMISSAO' ? '% sobre Comissão' : 'Valor Fixo'}"`,
      `"${s.type === 'PERCENT_VENDA' ? `${s.percentOnSale}% s/ Venda` : s.type === 'PERCENT_COMISSAO' ? `${s.percentOnCommission}% s/ Comissão` : 'Fixo'}"`,
      `"${s.calculatedAmount.toFixed(2)}"`,
      `"${s.pixKey || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `planilha_distribuicao_comissao_${selectedProperty?.code || 'imovel'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6 select-none">
      
      {/* ============================================================== */}
      {/* HEADER PRINCIPAL COM BOTÃO ADICIONAR NOVA COMISSÃO */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              Módulo Financeiro & Split
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-[11px] font-semibold text-slate-500">
              Modelos: 1. Sobre o VGV e 2. Comissão % (6%)
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-heading flex items-center gap-2 sm:gap-2.5">
            <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 bg-blue-50 p-1.5 rounded-2xl shrink-0" />
            <span className="truncate">Gestão de Comissões, Lançamentos & RPAs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Adicione novas comissões calculadas sobre o <strong>VGV (Lançamentos)</strong> ou em <strong>Porcentual (ex.: 6% Avulso)</strong>, simule o rateio entre equipe e emita RPAs oficiais.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setEditingDeal(undefined);
              setIsNewCommissionModalOpen(true);
            }}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Adicionar Nova Comissão</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDistributionSheetModalOpen(true)}
            className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Visualizar ficha de rateio oficial"
          >
            <Printer className="w-4 h-4 shrink-0 text-slate-600" />
            <span>Planilha PDF</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RESUMO VISUAL: CARDS DE PERFORMANCE FINANCEIRA NO TOPO */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 animate-in fade-in duration-200">
        
        {/* 1. Comissões Pendentes */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-amber-400" />
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Comissões Pendentes
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-800 tracking-tight">
            {totalPendingCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              {pendingDealsCount} {pendingDealsCount === 1 ? 'fechamento pendente' : 'fechamentos pendentes'}
            </span>
            <span className="text-amber-800 font-bold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded-md">
              A Receber Futuro
            </span>
          </div>
        </div>

        {/* 2. Comissões Pagas */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Comissões Pagas
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 tracking-tight">
            {totalPaidCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              {paidDealsCount} {paidDealsCount === 1 ? 'comissão liquidada' : 'comissões liquidadas'}
            </span>
            <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-md">
              RPAs Emitidos
            </span>
          </div>
        </div>

        {/* 3. Acumulado no Mês Corrente */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500" />
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                Acumulado no Mês
              </span>
              <span className="text-[10px] font-bold text-indigo-600 block truncate">
                {capitalizedMonthLabel}
              </span>
            </div>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-indigo-900 tracking-tight">
            {currentMonthCommissionTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              {currentMonthDealsCount} {currentMonthDealsCount === 1 ? 'negócio no mês' : 'negócios no mês'}
            </span>
            <span className="text-slate-500 text-[10px] font-mono shrink-0">
              VGV: {currentMonthVgvTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* 4. Total Acumulado Geral */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 to-cyan-500" />
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Geral Acumulado
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-tight">
            {totalAccumulatedCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              {dealsList.length} fechamentos
            </span>
            <span className="text-slate-500 text-[10px] font-mono">
              VGV Total: {totalAccumulatedVgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TABS DE NAVEGAÇÃO: COMISSÕES vs SIMULADOR vs RPAS */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('fechamentos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fechamentos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Fechamentos & Splits</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'fechamentos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {dealsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dataentry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dataentry'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Dataentry de Comissões (Lotes)</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
              activeTab === 'dataentry' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Validação Pix
            </span>
          </button>

          <button
            onClick={() => setActiveTab('boletos_avulsos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'boletos_avulsos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4 text-purple-500" />
            <span>Boletos Avulsos com Split</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
              activeTab === 'boletos_avulsos' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              QR Pix D+0
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'simulador'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Simulador de Rateio</span>
          </button>

          <button
            onClick={() => setActiveTab('rpas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rpas'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Extrato de RPAs</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsGatewaysModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all"
            title="Conta Pronta, Asaas, Mercado Pago, Pagar.me, PagSeguro, PJBank, Iugu, Cora, Inter, Celcoin"
          >
            <Wallet className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bancos & Gateways de Split (10 APIs)</span>
          </button>

          {/* Quick action button inside tab row if in simulator */}
          {activeTab === 'simulador' && (
            <button
              onClick={handleTurnSimulationIntoCommission}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Salvar Simulação como Nova Comissão</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* ABA 1: COMISSÕES REGISTRADAS & FECHAMENTOS */}
      {/* ============================================================== */}
      {activeTab === 'fechamentos' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Filters & Action Toolbar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código, imóvel, corretor fechador ou captador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              />
            </div>

            {/* Model Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">Modelo:</span>
              <button
                type="button"
                onClick={() => setModelFilter('TODOS')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  modelFilter === 'TODOS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setModelFilter('SOBRE_VGV')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  modelFilter === 'SOBRE_VGV' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>1. Sobre o VGV</span>
              </button>
              <button
                type="button"
                onClick={() => setModelFilter('PERCENTUAL_COMISSAO')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  modelFilter === 'PERCENTUAL_COMISSAO' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Percent className="w-3 h-3" />
                <span>2. Comissão % (ex: 6%)</span>
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="A_RECEBER_FUTURO">⏳ A Receber Futuro</option>
                <option value="RECEBIDO">💰 Recebido</option>
                <option value="PAGO_COM_RPA">✅ Pago com RPA</option>
              </select>
            </div>
          </div>

          {/* Table of Registered Deals */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* Desktop / Tablet Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 whitespace-nowrap">Código / Data</th>
                    <th className="py-3 px-4">Imóvel Transacionado</th>
                    <th className="py-3 px-4 min-w-[190px] whitespace-nowrap">Modelo de Cálculo</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">VGV (Venda)</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Comissão Total</th>
                    <th className="py-3 px-4 min-w-[210px]">Rateio da Equipe</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeals.map((deal) => {
                    const isVgv = deal.calculationModel === 'SOBRE_VGV';

                    return (
                      <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Code & Date */}
                        <td className="py-3 px-4">
                          <strong className="text-slate-900 font-mono text-xs block">{deal.code}</strong>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {deal.closedAt ? new Date(deal.closedAt).toLocaleDateString('pt-BR') : 'Data n/d'}
                          </span>
                        </td>

                        {/* Property */}
                        <td className="py-3 px-4 max-w-xs">
                          <strong className="text-slate-900 font-bold block truncate" title={deal.propertyTitle}>
                            {deal.propertyTitle}
                          </strong>
                          {deal.notes && (
                            <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                              {deal.notes}
                            </span>
                          )}
                        </td>

                        {/* Calculation Model Badge */}
                        <td className="py-3 px-4 min-w-[190px]">
                          {isVgv ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                              <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span>1. Sobre VGV ({deal.totalCommissionPercent}% s/ VGV)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                              <Percent className="w-3 h-3 text-blue-600 shrink-0" />
                              <span>2. Comissão em % ({deal.totalCommissionPercent}% s/ Venda)</span>
                            </span>
                          )}
                          {deal.calculationDetail && (
                            <span className="text-[10px] text-slate-500 block mt-1 font-mono leading-tight whitespace-nowrap">
                              {deal.calculationDetail}
                            </span>
                          )}
                        </td>

                        {/* Sale Price */}
                        <td className="py-3 px-4 text-right">
                          <strong className="text-slate-900 font-black font-mono text-xs block">
                            {deal.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </strong>
                        </td>

                        {/* Total Commission */}
                        <td className="py-3 px-4 text-right">
                          <strong className="text-emerald-700 font-black font-mono text-xs block">
                            {deal.totalCommissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </strong>
                          <span className="text-[10px] font-bold text-slate-400">
                            {deal.totalCommissionPercent}% total
                          </span>
                        </td>

                        {/* Team Split Chips */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 text-[10px]">
                            {/* Fechador */}
                            <div className="flex items-center justify-between gap-2 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                              <span className="text-slate-600 font-medium truncate max-w-[120px]">
                                👤 Fech: {deal.fechadorName}
                              </span>
                              <strong className="text-slate-900 font-mono">
                                {deal.fechadorValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </strong>
                            </div>

                            {/* Captador */}
                            <div className="flex items-center justify-between gap-2 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                              <span className="text-slate-600 font-medium truncate max-w-[120px]">
                                🎯 Capt: {deal.captadorName}
                              </span>
                              <strong className="text-slate-900 font-mono">
                                {deal.captadorValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </strong>
                            </div>

                            {/* Imobiliária */}
                            <div className="flex items-center justify-between gap-2 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                              <span className="text-slate-500 font-medium">
                                🏢 Casa / Retenção:
                              </span>
                              <strong className="text-emerald-800 font-mono">
                                {deal.imobiliariaValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </strong>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <select
                            value={deal.status}
                            onChange={(e) => handleUpdateStatus(deal.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border outline-hidden transition-all ${
                              deal.status === 'RECEBIDO'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : deal.status === 'PAGO_COM_RPA'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="A_RECEBER_FUTURO">⏳ A Receber</option>
                            <option value="RECEBIDO">💰 Recebido</option>
                            <option value="PAGO_COM_RPA">✅ Pago c/ RPA</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Emit RPA */}
                            <button
                              type="button"
                              onClick={() => {
                                setRpaPreviewModal({
                                  stakeholderName: deal.fechadorName,
                                  stakeholderRole: 'Corretor Fechador',
                                  stakeholderDoc: 'CRECI Homologado',
                                  stakeholderPix: 'chave-pix-fechador@banco.com',
                                  amount: deal.fechadorValue,
                                  ruleDetail: isVgv 
                                    ? `${deal.fechadorPercent || 1.3}% direto sobre o VGV de ${deal.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                    : `${deal.fechadorPercent || 40}% da comissão bruta`,
                                  propertyTitle: deal.propertyTitle,
                                  propertyCode: deal.code,
                                  totalSale: deal.salePrice,
                                  totalCommission: deal.totalCommissionValue
                                });
                              }}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                              title="Emitir Recibo / RPA Oficial"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDeal(deal);
                                setIsNewCommissionModalOpen(true);
                              }}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                              title="Editar dados da comissão"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(deal.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Excluir comissão"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Small Screens Card View (< lg) */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredDeals.map((deal) => {
                const isVgv = deal.calculationModel === 'SOBRE_VGV';

                return (
                  <div key={deal.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                    {/* Header: Code, Date & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <strong className="text-slate-900 font-mono text-xs">{deal.code}</strong>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {deal.closedAt ? new Date(deal.closedAt).toLocaleDateString('pt-BR') : 'Data n/d'}
                        </span>
                      </div>

                      <select
                        value={deal.status}
                        onChange={(e) => handleUpdateStatus(deal.id, e.target.value as any)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border outline-none ${
                          deal.status === 'RECEBIDO'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : deal.status === 'PAGO_COM_RPA'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="A_RECEBER_FUTURO">⏳ A Receber</option>
                        <option value="RECEBIDO">💰 Recebido</option>
                        <option value="PAGO_COM_RPA">✅ Pago c/ RPA</option>
                      </select>
                    </div>

                    {/* Property Title */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {deal.propertyTitle}
                      </h4>
                      {deal.notes && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{deal.notes}</p>
                      )}
                    </div>

                    {/* Model & Values in grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">VGV (Venda)</span>
                        <strong className="text-slate-900 font-mono text-xs block">
                          {deal.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Comissão Total</span>
                        <strong className="text-emerald-700 font-mono text-xs block">
                          {deal.totalCommissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                        <span className="text-[9px] text-slate-500 font-semibold">({deal.totalCommissionPercent}%)</span>
                      </div>

                      <div className="col-span-2 pt-1 border-t border-slate-200">
                        {isVgv ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700">
                            <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
                            <span>1. Sobre VGV ({deal.totalCommissionPercent}% s/ VGV)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700">
                            <Percent className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>2. Comissão % ({deal.totalCommissionPercent}% s/ Venda)</span>
                          </span>
                        )}
                        {deal.calculationDetail && (
                          <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                            {deal.calculationDetail}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Team Split Chips */}
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        <span>👤 Fechador: {deal.fechadorName}</span>
                        <strong className="text-slate-900 font-mono">
                          {deal.fechadorValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        <span>🎯 Captador: {deal.captadorName}</span>
                        <strong className="text-slate-900 font-mono">
                          {deal.captadorValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        <span>🏢 Retenção Imobiliária</span>
                        <strong className="text-emerald-700 font-mono">
                          {deal.imobiliariaValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setRpaPreviewModal({
                            stakeholderName: deal.fechadorName,
                            stakeholderRole: 'Corretor Fechador',
                            stakeholderDoc: 'CRECI 210.984-F',
                            amount: deal.fechadorValue,
                            ruleDetail: `Comissão fechamento ${deal.code}`,
                            propertyTitle: deal.propertyTitle,
                            propertyCode: deal.code,
                            totalSale: deal.salePrice,
                            totalCommission: deal.totalCommissionValue
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 border border-blue-200"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Recibo / RPA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingDeal(deal);
                          setIsNewCommissionModalOpen(true);
                        }}
                        className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(deal.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-200"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDeals.length === 0 && (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Nenhuma comissão encontrada</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Cadastre sua primeira comissão usando o botão abaixo.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeal(undefined);
                    setIsNewCommissionModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Nova Comissão</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA: DATAENTRY DE COMISSÕES (LANÇAMENTOS EM LOTE & PIX) */}
      {/* ============================================================== */}
      {activeTab === 'dataentry' && (
        <div className="animate-in fade-in duration-200">
          <CommissionDataentryTable onOpenGatewaysModal={() => setIsGatewaysModalOpen(true)} />
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA: BOLETOS AVULSOS COM SPLIT AUTOMÁTICO */}
      {/* ============================================================== */}
      {activeTab === 'boletos_avulsos' && (
        <div className="animate-in fade-in duration-200">
          <BoletosAvulsosCommissionView onOpenGatewaysModal={() => setIsGatewaysModalOpen(true)} />
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: SIMULADOR DE RATEIO & LANÇAMENTOS */}
      {/* ============================================================== */}
      {activeTab === 'simulador' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          
          {/* Preset Model Switchers Banner */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-4 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Layers className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block">Modelos de Cálculo Pré-Configurados:</span>
                <span className="text-[11px] text-slate-500 block">Alterne instantaneamente as alíquotas com base no tipo de operação imobiliária</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleApplyLancamentoPreset}
                className="w-full justify-center px-3 py-2 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>1. Lançamentos (Sobre o VGV)</span>
              </button>

              <button
                type="button"
                onClick={handleApplyAvulsoPreset}
                className="w-full justify-center px-3 py-2 rounded-xl text-xs font-bold bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Percent className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>2. Mercado Avulso (6% Padrão CRECI)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Simulador de Rateio & Divisão de Honorários</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calcule a distribuição sobre o VGV da venda ou sobre a comissão total da imobiliária
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <button
                onClick={handleTurnSimulationIntoCommission}
                className="flex-1 sm:flex-none justify-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Efetivar como Nova Comissão</span>
              </button>
              <button
                onClick={exportSpreadsheetCsv}
                className="flex-1 sm:flex-none justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowDownToLine className="w-4 h-4 shrink-0" />
                <span>Exportar CSV</span>
              </button>
              <button
                onClick={handleAddStakeholder}
                className="flex-1 sm:flex-none justify-center px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Incluir Envolvido</span>
              </button>
            </div>
          </div>

          {/* Property Selector & Price Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
            
            {/* Property Select */}
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Imóvel / Empreendimento</span>
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => handleSelectProperty(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden truncate"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title} ({p.address?.neighborhood || 'Bairro'})
                  </option>
                ))}
              </select>
            </div>

            {/* Sale Value */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Valor Total de Venda / VGV (R$)
              </label>
              <input
                type="number"
                min={0}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-black bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-900 font-mono"
              />
            </div>

            {/* Commission Rate */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Comissão Total Paga (%)</span>
                <span className="text-[10px] text-blue-600 font-normal">Lanç: 4% | Av: 6%</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-black bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-blue-700 font-mono"
                />
                <span className="font-bold text-slate-600 text-sm">%</span>
              </div>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-5 rounded-2xl text-white shadow-md border border-slate-800">
            <div className="p-3 bg-white/5 sm:bg-transparent rounded-xl border border-white/5 sm:border-transparent min-w-0">
              <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block mb-1">VGV Negociado</span>
              <div className="text-base sm:text-xl font-black font-mono tracking-tight text-white break-words">
                {salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>

            <div className="p-3 bg-white/5 sm:bg-transparent rounded-xl border border-white/5 sm:border-transparent min-w-0">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-1">Comissão Total ({commissionRate}%)</span>
              <div className="text-base sm:text-xl font-black font-mono tracking-tight text-emerald-400 break-words">
                {totalCommissionGross.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>

            <div className="p-3 bg-white/5 sm:bg-transparent rounded-xl border border-white/5 sm:border-transparent min-w-0">
              <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider block mb-1">Total Distribuído</span>
              <div className="text-base sm:text-xl font-black font-mono tracking-tight text-blue-300 break-words">
                {totalDistributedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <span className="text-[11px] font-medium text-slate-300 block mt-0.5">
                {totalDistributedPercentOnSale.toFixed(2)}% do VGV da venda
              </span>
            </div>

            <div className="p-3 bg-white/5 sm:bg-transparent rounded-xl border border-white/5 sm:border-transparent min-w-0">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block mb-1">Saldo Retido</span>
              <div className={`text-base sm:text-xl font-black font-mono tracking-tight break-words ${
                Math.abs(remainingAmount) < 1 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {remainingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                {Math.abs(remainingAmount) < 1 ? '100% distribuído' : 'Retenção da imobiliária'}
              </span>
            </div>
          </div>

          {/* Stakeholders Distribution Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Envolvidos no Negócio & Configuração de Alíquota
              </h3>
              <span className="text-[11px] text-slate-500">
                Suporta <strong>1. % sobre a Venda (VGV)</strong> ou <strong>2. % sobre a Comissão (ex.: 6%)</strong>
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              {calculatedStakeholders.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-3.5 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 sm:gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Identification Section */}
                  <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      #{idx + 1}
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Name and Role */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                          type="text"
                          value={s.name}
                          onChange={(e) => {
                            const updated = [...stakeholders];
                            updated[idx].name = e.target.value;
                            setStakeholders(updated);
                          }}
                          className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-hidden bg-transparent w-full sm:w-60"
                          placeholder="Nome do Envolvido"
                        />
                        <select
                          value={s.role}
                          onChange={(e) => {
                            const updated = [...stakeholders];
                            updated[idx].role = e.target.value as any;
                            setStakeholders(updated);
                          }}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700"
                        >
                          <option value="FECHADOR">Corretor Fechador</option>
                          <option value="CAPTADOR">Corretor Captador</option>
                          <option value="COORDENADOR">Coordenador</option>
                          <option value="GERENTE">Gerente de Vendas</option>
                          <option value="IMOBILIARIA">Imobiliária</option>
                          <option value="PARCEIRO_EXTERNO">Parceiro Externo</option>
                          <option value="DIRETOR">Diretor</option>
                        </select>
                      </div>

                      {/* Pix & Document */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px]">
                        <input
                          type="text"
                          value={s.docOrCreci || ''}
                          onChange={(e) => {
                            const updated = [...stakeholders];
                            updated[idx].docOrCreci = e.target.value;
                            setStakeholders(updated);
                          }}
                          placeholder="CRECI ou CPF/CNPJ"
                          className="px-2 py-1 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50/50 w-full sm:w-40"
                        />
                        <input
                          type="text"
                          value={s.pixKey || ''}
                          onChange={(e) => {
                            const updated = [...stakeholders];
                            updated[idx].pixKey = e.target.value;
                            setStakeholders(updated);
                          }}
                          placeholder="Chave Pix para repasse"
                          className="px-2 py-1 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50/50 flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculation Rules Switcher */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...stakeholders];
                          updated[idx].type = 'PERCENT_VENDA';
                          setStakeholders(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          s.type === 'PERCENT_VENDA' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        % s/ VGV
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...stakeholders];
                          updated[idx].type = 'PERCENT_COMISSAO';
                          setStakeholders(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          s.type === 'PERCENT_COMISSAO' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        % s/ Comissão
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...stakeholders];
                          updated[idx].type = 'VALOR_FIXO';
                          setStakeholders(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          s.type === 'VALOR_FIXO' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        R$ Fixo
                      </button>
                    </div>

                    {/* Input values */}
                    <div className="flex items-center gap-2">
                      {s.type === 'PERCENT_VENDA' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            max="100"
                            value={s.percentOnSale}
                            onChange={(e) => {
                              const updated = [...stakeholders];
                              updated[idx].percentOnSale = Number(e.target.value);
                              setStakeholders(updated);
                            }}
                            className="w-16 px-2 py-1.5 text-xs font-black text-right border border-slate-300 rounded-xl bg-white shadow-2xs text-indigo-700 font-mono"
                          />
                          <span className="font-bold text-slate-600 text-xs">% VGV</span>
                        </div>
                      )}

                      {s.type === 'PERCENT_COMISSAO' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            value={s.percentOnCommission}
                            onChange={(e) => {
                              const updated = [...stakeholders];
                              updated[idx].percentOnCommission = Number(e.target.value);
                              setStakeholders(updated);
                            }}
                            className="w-16 px-2 py-1.5 text-xs font-black text-right border border-slate-300 rounded-xl bg-white shadow-2xs text-blue-700 font-mono"
                          />
                          <span className="font-bold text-slate-600 text-xs">% Com.</span>
                        </div>
                      )}

                      {s.type === 'VALOR_FIXO' && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">R$</span>
                          <input
                            type="number"
                            min="0"
                            value={s.fixedAmount}
                            onChange={(e) => {
                              const updated = [...stakeholders];
                              updated[idx].fixedAmount = Number(e.target.value);
                              setStakeholders(updated);
                            }}
                            className="w-24 px-2 py-1.5 text-xs font-black text-right border border-slate-300 rounded-xl bg-white shadow-2xs text-slate-800 font-mono"
                          />
                        </div>
                      )}

                      {/* Calculated Amount */}
                      <div className="text-right min-w-[110px]">
                        <strong className="text-sm font-black text-blue-900 font-mono block">
                          {s.calculatedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                        <span className="text-[10px] text-slate-400 block">
                          {s.effectivePercentOnSale.toFixed(2)}% venda
                        </span>
                      </div>

                      {/* Action: RPA & Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          setRpaPreviewModal({
                            stakeholderName: s.name,
                            stakeholderRole: s.role,
                            stakeholderDoc: s.docOrCreci,
                            stakeholderPix: s.pixKey,
                            amount: s.calculatedAmount,
                            ruleDetail: s.type === 'PERCENT_VENDA' ? `${s.percentOnSale}% s/ VGV` : s.type === 'PERCENT_COMISSAO' ? `${s.percentOnCommission}% s/ Comissão` : 'Fixo',
                            propertyTitle: selectedProperty?.title || 'Imóvel Selecionado',
                            propertyCode: selectedProperty?.code || 'IMO-001',
                            totalSale: salePrice,
                            totalCommission: totalCommissionGross,
                          });
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                        title="Emitir RPA individual"
                      >
                        RPA
                      </button>

                      {stakeholders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStakeholder(s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remover participante"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: EXTRATO DE RPAS & REPASSES */}
      {/* ============================================================== */}
      {activeTab === 'rpas' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Extrato Consolidado de RPAs & Liquidação Bancária</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprovantes fiscais gerados para autônomos, prestadores e corretores associados
              </p>
            </div>
            <button
              onClick={() => setIsDistributionSheetModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Imprimir Relatório de RPAs</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {dealsList.map(deal => (
              <div key={deal.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{deal.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      deal.status === 'PAGO_COM_RPA' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {deal.rpaDocumentId || 'RPA Gerado'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{deal.propertyTitle}</p>
                  <p className="text-[11px] text-slate-500">
                    Beneficiário: <strong>{deal.fechadorName}</strong> · Valor: <strong>{deal.fechadorValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRpaPreviewModal({
                        stakeholderName: deal.fechadorName,
                        stakeholderRole: 'Corretor Fechador',
                        stakeholderDoc: 'CRECI Homologado',
                        stakeholderPix: 'chave-pix@banco.com',
                        amount: deal.fechadorValue,
                        ruleDetail: deal.calculationDetail || `${deal.totalCommissionPercent}% de comissão`,
                        propertyTitle: deal.propertyTitle,
                        propertyCode: deal.code,
                        totalSale: deal.salePrice,
                        totalCommission: deal.totalCommissionValue
                      });
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Visualizar RPA</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADICIONAR / EDITAR NOVA COMISSÃO */}
      {/* ============================================================== */}
      <NewCommissionModal
        isOpen={isNewCommissionModalOpen}
        onClose={() => {
          setIsNewCommissionModalOpen(false);
          setEditingDeal(undefined);
        }}
        onSaveCommission={handleSaveCommission}
        properties={properties}
        currentUser={currentUser}
        initialData={editingDeal}
      />

      {/* ============================================================== */}
      {/* MODAL: PLANILHA OFICIAL DE DISTRIBUIÇÃO EM PDF / IMPRESSÃO */}
      {/* ============================================================== */}
      {isDistributionSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            {/* Action Bar Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="font-bold text-sm truncate">Planilha de Rateio & Distribuição</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportSpreadsheetCsv}
                  className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Baixar CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none justify-center px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>
                <button
                  onClick={() => setIsDistributionSheetModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Sheet Layout */}
            <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 text-xs text-slate-900 bg-white">
              {/* Company & Deal Header */}
              <div className="border border-slate-300 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 uppercase">ACERTGO GESTÃO IMOBILIÁRIA LTDA</h3>
                  <p className="text-[11px] text-slate-500">CNPJ: 12.345.678/0001-90 · CRECI-J: 45.678-SP</p>
                  <p className="text-[10px] text-slate-400">Av. Brigadeiro Faria Lima, 2800 - Jardins, São Paulo/SP</p>
                </div>
                <div className="sm:text-right">
                  <div className="font-bold text-xs sm:text-sm text-blue-700">FICHA DE RATEIO DE COMISSÃO & HONORÁRIOS</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</div>
                  <div className="text-[10px] font-mono text-slate-400">ID Fechamento: CLK-{Date.now().toString().slice(-6)}</div>
                </div>
              </div>

              {/* Deal Data Box */}
              <div className="border border-slate-300 rounded-xl p-3.5 sm:p-4 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Imóvel Objeto</span>
                  <strong className="text-slate-900 font-bold block truncate">{selectedProperty?.code} - {selectedProperty?.title}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Valor da Venda (VGV)</span>
                  <strong className="text-slate-900 font-bold font-mono block">
                    {salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Comissão Bruta ({commissionRate}%)</span>
                  <strong className="text-emerald-700 font-bold font-mono block">
                    {totalCommissionGross.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total a Liquidar</span>
                  <strong className="text-blue-700 font-bold font-mono block">
                    {totalDistributedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </strong>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-300 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Beneficiário / Nome</th>
                      <th className="py-2.5 px-3">Papel / Função</th>
                      <th className="py-2.5 px-3">CRECI / CPF</th>
                      <th className="py-2.5 px-3 text-center">Regra / Alíquota</th>
                      <th className="py-2.5 px-3 text-right">Valor Repasse (R$)</th>
                      <th className="py-2.5 px-3">Chave Pix Repasse</th>
                      <th className="py-2.5 px-3 text-center">Assinatura / Visto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {calculatedStakeholders.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-2 px-3 text-slate-600 font-semibold">{s.role}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{s.docOrCreci || '-'}</td>
                        <td className="py-2 px-3 text-center font-bold text-blue-700">
                          {s.type === 'PERCENT_VENDA' ? `${s.percentOnSale}% s/ Venda` :
                           s.type === 'PERCENT_COMISSAO' ? `${s.percentOnCommission}% s/ Comissão` : 'Fixo'}
                        </td>
                        <td className="py-2 px-3 text-right font-black font-mono text-slate-900">
                          {s.calculatedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-600">{s.pixKey || 'A cadastrar'}</td>
                        <td className="py-2 px-3 text-center text-slate-300">_________________</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t border-slate-300 text-xs">
                      <td colSpan={5} className="py-3 px-3 text-right uppercase text-slate-700">Total Distribuído aos Envolvidos:</td>
                      <td className="py-3 px-3 text-right font-black font-mono text-emerald-800">
                        {totalDistributedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td colSpan={2} className="py-3 px-3 text-slate-500 text-[10px]">
                        {totalDistributedPercentOnSale.toFixed(2)}% do VGV total
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Approval Footer */}
              <div className="pt-6 sm:pt-8 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-[10px] text-slate-500">
                <div>
                  <div className="border-b border-slate-400 pb-8 mb-2"></div>
                  <strong className="block text-slate-800">Gerência de Vendas</strong>
                  <span>Validação de Equipe e Participação</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-8 mb-2"></div>
                  <strong className="block text-slate-800">Controladoria / Financeiro</strong>
                  <span>Conferência de Split & Chaves Pix</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-8 mb-2"></div>
                  <strong className="block text-slate-800">Diretoria Executiva</strong>
                  <span>Autorização de Liquidação Bancária</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: RECIBO / RPA INDIVIDUAL */}
      {/* ============================================================== */}
      {rpaPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  Recibo de Pagamento Autônomo (RPA)
                </h3>
              </div>
              <button onClick={() => setRpaPreviewModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl space-y-3.5 border border-slate-200 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">ACERTGO GESTÃO IMOBILIÁRIA LTDA</h4>
                  <p className="text-slate-500 text-[11px]">CNPJ: 12.345.678/0001-90 · CRECI Jurídico: 45.678-SP</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold font-mono text-[10px]">
                  RPA #{Date.now().toString().slice(-6)}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Favorecido / Beneficiário</span>
                <p className="font-bold text-slate-800 text-sm">{rpaPreviewModal.stakeholderName}</p>
                <p className="text-slate-500 text-[11px]">Papel: <strong>{rpaPreviewModal.stakeholderRole}</strong> · Documento: {rpaPreviewModal.stakeholderDoc || 'Informado'}</p>
                <p className="text-slate-500 font-mono text-[11px] break-all">Chave Pix: {rpaPreviewModal.stakeholderPix || 'Não cadastrada'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 min-w-0">
                  <span className="text-[10px] text-slate-400 block font-semibold">IMÓVEL OBJETO</span>
                  <strong className="block truncate">{rpaPreviewModal.propertyCode} - {rpaPreviewModal.propertyTitle}</strong>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 min-w-0">
                  <span className="text-[10px] text-slate-400 block font-semibold">VGV TOTAL</span>
                  <strong className="block font-mono">{rpaPreviewModal.totalSale.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-blue-600 font-bold block uppercase">Valor Líquido do Repasse</span>
                  <span className="text-xs text-blue-700 font-medium">
                    {rpaPreviewModal.ruleDetail}
                  </span>
                </div>
                <strong className="text-lg sm:text-xl font-black text-blue-900 font-mono break-all">
                  {rpaPreviewModal.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
              </div>

              <div className="pt-2 text-center border-t border-dashed border-slate-300">
                <p className="text-[10px] text-slate-500">Documento homologado para comprovação fiscal e repasse Pix</p>
                <p className="text-[10px] font-bold text-slate-700 mt-0.5 font-mono">Autenticação: {Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRpaPreviewModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print?.()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURAÇÃO DE GATEWAYS & APIS BANCÁRIAS PARA SPLIT */}
      <SplitGatewaysManagerModal 
        isOpen={isGatewaysModalOpen} 
        onClose={() => setIsGatewaysModalOpen(false)} 
      />
    </div>
  );
};

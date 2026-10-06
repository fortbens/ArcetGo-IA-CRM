import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Bell, 
  TrendingUp, 
  ArrowLeftRight, 
  BarChart3, 
  Plus, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Send, 
  MessageSquare, 
  ExternalLink, 
  Copy, 
  Check, 
  Building, 
  Users, 
  Percent, 
  ShieldCheck, 
  QrCode, 
  FileCheck, 
  Sparkles,
  Receipt,
  Download,
  AlertCircle,
  Edit3,
  X,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { 
  RentalContract, 
  RentalInvoice, 
  CollectionRuleStep, 
  CollectionNotification, 
  ContractAdjustmentRecord, 
  RepasseSplitPayment,
  RealEstateProperty
} from '../../types/crm';
import { 
  INITIAL_RENTAL_CONTRACTS_FULL, 
  INITIAL_RENTAL_INVOICES, 
  INITIAL_COLLECTION_RULES, 
  INITIAL_COLLECTION_NOTIFICATIONS, 
  INITIAL_ADJUSTMENTS, 
  INITIAL_REPASSE_SPLITS,
  MONTHLY_COLLECTION_CHART_DATA
} from '../../data/mockLocacao';
import { RentalContractModal } from './RentalContractModal';
import { BoletoModal } from './BoletoModal';
import { CustomerPortalView } from '../customer-portal/CustomerPortalView';
import { RentalSplitRulesConfig } from './RentalSplitRulesConfig';
import { DimobExportView } from './DimobExportView';
import { RentAdvanceSimulatorView } from './RentAdvanceSimulatorView';
import { InsuranceGuaranteesHubView } from './InsuranceGuaranteesHubView';
import { ClientNotificationsCenterView } from './ClientNotificationsCenterView';
import { RentalMarketBenchmarksView } from './RentalMarketBenchmarksView';

export type RentalTabType = 
  | 'dashboard' 
  | 'contratos' 
  | 'cobrancas' 
  | 'regua' 
  | 'reajustes' 
  | 'repasses' 
  | 'regras_split' 
  | 'portal_cliente' 
  | 'dimob'
  | 'antecipacao'
  | 'seguradoras'
  | 'notificacoes'
  | 'diferenciais_mercado';

interface RentalManagementViewProps {
  properties: RealEstateProperty[];
  initialTab?: RentalTabType;
}

export const RentalManagementView: React.FC<RentalManagementViewProps> = ({
  properties,
  initialTab = 'dashboard',
}) => {
  const [activeTab, setActiveTab] = useState<RentalTabType>(initialTab);

  // Contracts state
  const [contracts, setContracts] = useState<RentalContract[]>(INITIAL_RENTAL_CONTRACTS_FULL);
  const [showContractModal, setShowContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState<RentalContract | null>(null);
  const [contractModalStep, setContractModalStep] = useState<'dados' | 'valores' | 'split' | 'seguros' | 'despesas'>('dados');

  // Invoices state
  const [invoices, setInvoices] = useState<RentalInvoice[]>(INITIAL_RENTAL_INVOICES);
  const [selectedBoletoInvoice, setSelectedBoletoInvoice] = useState<RentalInvoice | null>(null);

  // Collection rules & notifications
  const [collectionRules, setCollectionRules] = useState<CollectionRuleStep[]>(INITIAL_COLLECTION_RULES);
  const [notifications, setNotifications] = useState<CollectionNotification[]>(INITIAL_COLLECTION_NOTIFICATIONS);

  // Adjustments
  const [adjustments, setAdjustments] = useState<ContractAdjustmentRecord[]>(INITIAL_ADJUSTMENTS);

  // Repasses
  const [repasses, setRepasses] = useState<RepasseSplitPayment[]>(INITIAL_REPASSE_SPLITS);
  const [executingRepasseId, setExecutingRepasseId] = useState<string | null>(null);
  const [repasseSuccessModal, setRepasseSuccessModal] = useState<RepasseSplitPayment | null>(null);

  // Régua de Cobrança - Edição de Prazos e Mensagens
  const [editingRule, setEditingRule] = useState<CollectionRuleStep | null>(null);
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);
  const [ruleDayOffset, setRuleDayOffset] = useState<number>(0);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleChannel, setRuleChannel] = useState<'WHATSAPP' | 'EMAIL' | 'SMS' | 'MULTI'>('WHATSAPP');
  const [ruleMessage, setRuleMessage] = useState('');
  const [ruleActive, setRuleActive] = useState(true);

  // Reajustes - Edição Manual de Dados
  const [editingAdjustment, setEditingAdjustment] = useState<ContractAdjustmentRecord | null>(null);
  const [adjCurrentRent, setAdjCurrentRent] = useState<number>(0);
  const [adjNewRent, setAdjNewRent] = useState<number>(0);
  const [adjIndexUsed, setAdjIndexUsed] = useState<'IPCA' | 'IGP-M' | 'IVAR' | 'INPC'>('IPCA');
  const [adjIndexRatePercent, setAdjIndexRatePercent] = useState<number>(3.92);
  const [adjAnniversaryDate, setAdjAnniversaryDate] = useState<string>('');

  const handleOpenEditRule = (rule: CollectionRuleStep) => {
    setEditingRule(rule);
    setRuleDayOffset(rule.dayOffset);
    setRuleTitle(rule.title);
    setRuleChannel(rule.channel as any);
    setRuleMessage(rule.messageTemplate);
    setRuleActive(rule.active);
  };

  const handleOpenNewRule = () => {
    setEditingRule(null);
    setRuleDayOffset(-3);
    setRuleTitle('Lembrete Preventivo - 3 dias');
    setRuleChannel('WHATSAPP');
    setRuleMessage('Olá {nome_inquilino}, lembramos que o aluguel no valor de R$ {valor} vence em {vencimento}. Pague com PIX pelo link: {link_boleto_pix}');
    setRuleActive(true);
    setIsNewRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTitle.trim() || !ruleMessage.trim()) return;

    if (editingRule) {
      setCollectionRules(prev => prev.map(r => r.id === editingRule.id ? {
        ...r,
        title: ruleTitle.trim(),
        dayOffset: Number(ruleDayOffset),
        channel: ruleChannel,
        messageTemplate: ruleMessage.trim(),
        active: ruleActive
      } : r));
      setEditingRule(null);
    } else {
      const newStep: CollectionRuleStep = {
        id: `rule_${Date.now()}`,
        dayOffset: Number(ruleDayOffset),
        channel: ruleChannel,
        title: ruleTitle.trim(),
        messageTemplate: ruleMessage.trim(),
        active: ruleActive
      };
      setCollectionRules(prev => [...prev, newStep].sort((a, b) => a.dayOffset - b.dayOffset));
      setIsNewRuleModalOpen(false);
    }
  };

  const handleOpenEditAdjustment = (adj: ContractAdjustmentRecord) => {
    setEditingAdjustment(adj);
    setAdjCurrentRent(adj.currentRent);
    setAdjNewRent(adj.newRent);
    setAdjIndexUsed(adj.indexUsed);
    setAdjIndexRatePercent(adj.indexRatePercent);
    setAdjAnniversaryDate(adj.anniversaryDate);
  };

  const handleSaveAdjustmentManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdjustment) return;

    const diff = Number(adjNewRent) - Number(adjCurrentRent);
    setAdjustments(prev => prev.map(a => a.id === editingAdjustment.id ? {
      ...a,
      currentRent: Number(adjCurrentRent),
      newRent: Number(adjNewRent),
      differenceAmount: diff,
      indexUsed: adjIndexUsed,
      indexRatePercent: Number(adjIndexRatePercent),
      anniversaryDate: adjAnniversaryDate,
    } : a));
    setEditingAdjustment(null);
  };

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // -------------------------------------------------------------
  // CALCULOS E KPIS DO DASHBOARD (EXATAMENTE COMO NA TELA MODELO)
  // -------------------------------------------------------------
  const activeContractsCount = contracts.filter(c => c.status === 'ATIVO').length;
  const monthlyRentRevenue = contracts.filter(c => c.status === 'ATIVO').reduce((acc, c) => acc + c.monthlyRent, 0);
  const monthlyAdminFeeRevenue = contracts.filter(c => c.status === 'ATIVO').reduce((acc, c) => acc + (c.monthlyRent * c.adminFeePercentage / 100), 0);
  const defaultContractsCount = contracts.filter(c => c.status === 'INADIMPLENTE').length;

  const overdueInvoicesCount = invoices.filter(i => i.status === 'ATRASADO').length;
  const pendingRepassesAmount = repasses.filter(r => r.status === 'PENDENTE').reduce((acc, r) => acc + r.netRepasseAmount, 0);
  const expiringContractsCount = adjustments.filter(a => a.status === 'PENDENTE').length;
  const pendingInvoicesCount = invoices.filter(i => i.status === 'PENDENTE').length;

  // Handlers
  const handleSaveContract = (contractData: RentalContract) => {
    if (editingContract) {
      setContracts(prev => prev.map(c => c.id === contractData.id ? contractData : c));
    } else {
      setContracts(prev => [contractData, ...prev]);
    }
    setEditingContract(null);
  };

  const handleUpdateContractBeneficiaries = (contractId: string, beneficiaries: any[]) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          splitBeneficiaries: beneficiaries
        };
      }
      return c;
    }));
  };

  const handleMarkInvoiceAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        return {
          ...i,
          status: 'PAGO' as const,
          paidAt: new Date().toISOString(),
          penaltyAmount: 0,
          interestAmount: 0
        };
      }
      return i;
    }));
  };

  const handleApplyAdjustment = (adjId: string) => {
    setAdjustments(prev => prev.map(a => a.id === adjId ? { ...a, status: 'APLICADO' as const } : a));
    const targetAdj = adjustments.find(a => a.id === adjId);
    if (targetAdj) {
      setContracts(prev => prev.map(c => {
        if (c.id === targetAdj.contractId) {
          return {
            ...c,
            monthlyRent: targetAdj.newRent,
            lastAdjustedAt: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      }));
    }
  };

  const handleExecuteRepasse = (repasseId: string) => {
    setExecutingRepasseId(repasseId);
    setTimeout(() => {
      setRepasses(prev => prev.map(r => {
        if (r.id === repasseId) {
          const updated = {
            ...r,
            status: 'PAGO' as const,
            settledAt: new Date().toISOString(),
            beneficiariesPayout: r.beneficiariesPayout.map(b => ({
              ...b,
              status: 'PAGO' as const,
              transactionId: `E${Date.now()}BBPIX`
            }))
          };
          setRepasseSuccessModal(updated);
          return updated;
        }
        return r;
      }));
      setExecutingRepasseId(null);
    }, 1000);
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* ============================================================== */}
      {/* HEADER PRINCIPAL (IDENTICO À IMAGEM DO USUÁRIO) */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Módulo de Locação
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão completa de contratos, cobranças e repasses
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingContract(null);
              setContractModalStep('dados');
              setShowContractModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Contrato</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TABS COM ÍCONES (IDENTICAS À IMAGEM DO USUÁRIO) */}
      {/* ============================================================== */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span className="text-base">📊</span>
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('contratos')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'contratos'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Contratos</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
            {contracts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cobrancas')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'cobrancas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <DollarSign className="w-4 h-4 text-slate-500" />
          <span>Cobranças</span>
          {overdueInvoicesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
              {overdueInvoicesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('regua')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'regua'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Bell className="w-4 h-4 text-slate-500" />
          <span>Régua de Cobrança</span>
        </button>

        <button
          onClick={() => setActiveTab('reajustes')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'reajustes'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-slate-500" />
          <span>Reajustes</span>
        </button>

        <button
          onClick={() => setActiveTab('repasses')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'repasses'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 text-purple-600" />
          <span>Repasses (Split Herdeiros)</span>
        </button>

        <button
          onClick={() => setActiveTab('regras_split')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'regras_split'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-700 bg-purple-50/70 hover:bg-purple-100 hover:text-purple-900 border border-purple-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Regras de Split</span>
        </button>

        <button
          onClick={() => setActiveTab('dimob')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'dimob'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100 hover:text-blue-900 border border-blue-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>DIMOB (Receita Federal)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-200 text-blue-800 font-bold">
            Oficial RFB
          </span>
        </button>

        <button
          onClick={() => setActiveTab('portal_cliente')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'portal_cliente'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Área do Cliente</span>
        </button>

        <button
          onClick={() => setActiveTab('antecipacao')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'antecipacao'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Antecipação de Aluguel</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-900 font-extrabold">
            FIDC • Ganhe 2%
          </span>
        </button>

        <button
          onClick={() => setActiveTab('seguradoras')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'seguradoras'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100 hover:text-blue-900 border border-blue-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Garantias & Seguradoras</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-200 text-blue-900 font-extrabold">
            Zero Fiador
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notificacoes')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'notificacoes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>Notificações Clientes</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            WhatsApp
          </span>
        </button>

        <button
          onClick={() => setActiveTab('diferenciais_mercado')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'diferenciais_mercado'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Diferenciais & Mercado</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-200 text-indigo-900 font-extrabold">
            Benchmarking
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* ABA 1: DASHBOARD (EXATAMENTE COMO NA TELA MODELO IMAGE.PNG) */}
      {/* ============================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* 8 KPI Cards Grid (4x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {/* Card 1: Contratos Ativos */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-emerald-600 font-mono pt-1">
                {activeContractsCount}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                Contratos Ativos
              </div>
            </div>

            {/* Card 2: Receita Aluguel/mês */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-base sm:text-xl lg:text-2xl font-bold text-blue-900 font-mono pt-1 truncate">
                R$ {monthlyRentRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                Receita Aluguel/mês
              </div>
            </div>

            {/* Card 3: Taxa Adm/mês */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-base sm:text-xl lg:text-2xl font-bold text-blue-900 font-mono pt-1 truncate">
                R$ {monthlyAdminFeeRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                Taxa Adm/mês
              </div>
            </div>

            {/* Card 4: Inadimplentes */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-amber-700 font-mono pt-1">
                {defaultContractsCount}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                Inadimplentes
              </div>
            </div>

            {/* Card 5: Cobranças Atrasadas (Highlighted orange border like screenshot) */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border-2 border-amber-400 shadow-sm space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-rose-600 font-mono pt-1">
                {overdueInvoicesCount}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                Cobranças Atrasadas
              </div>
            </div>

            {/* Card 6: Repasses Pendentes */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-base sm:text-xl lg:text-2xl font-bold text-purple-700 font-mono pt-1 truncate">
                R$ {pendingRepassesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                Repasses Pendentes
              </div>
            </div>

            {/* Card 7: A Vencer em 60 dias */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-amber-600 font-mono pt-1">
                {expiringContractsCount}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                A Vencer em 60 dias
              </div>
            </div>

            {/* Card 8: Cobranças Pendentes */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-slate-700 font-mono pt-1">
                {pendingInvoicesCount}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                Cobranças Pendentes
              </div>
            </div>
          </div>

          {/* Gráficos em Linha (Exatamente como em image.png) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico 1: Cobranças - Últimos 6 meses */}
            <div className="lg:col-span-2 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Cobranças — Últimos 6 meses
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comparativo de valores recebidos (verde) e em atraso (laranja)
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500"></span> Recebido
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-amber-700">
                    <span className="w-3 h-3 rounded-sm bg-amber-500"></span> Atrasado
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-slate-200">
                {MONTHLY_COLLECTION_CHART_DATA.map((item, index) => {
                  const maxVal = 20000;
                  const collectedHeight = (item.collected / maxVal) * 100;
                  const overdueHeight = (item.overdue / maxVal) * 100;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {item.collected > 0 && (
                          <div
                            style={{ height: `${Math.min(100, collectedHeight)}%` }}
                            className="w-full max-w-[28px] bg-emerald-500 rounded-t-md transition-all group-hover:bg-emerald-600 relative"
                            title={`Recebido: R$ ${item.collected.toLocaleString('pt-BR')}`}
                          />
                        )}
                        {item.overdue > 0 && (
                          <div
                            style={{ height: `${Math.min(100, overdueHeight)}%` }}
                            className="w-full max-w-[28px] bg-amber-500 rounded-t-md transition-all group-hover:bg-amber-600 relative"
                            title={`Atrasado: R$ ${item.overdue.toLocaleString('pt-BR')}`}
                          />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gráfico 2: Status dos Contratos */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Status dos Contratos
                </h3>
                <p className="text-xs text-slate-400">
                  Distribuição da carteira de locação
                </p>
              </div>

              {/* Pie/Donut Chart Graphic */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-36 h-36 rounded-full flex items-center justify-center" style={{
                  background: 'conic-gradient(#10B981 0% 75%, #F59E0B 75% 85%, #64748B 85% 100%)'
                }}>
                  <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                    <span className="text-xl font-bold text-slate-900 font-mono">{contracts.length}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Ativos
                  </span>
                  <strong className="text-slate-900 font-mono">75%</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Inadimplentes
                  </span>
                  <strong className="text-slate-900 font-mono">10%</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Em Reajuste / Fim
                  </span>
                  <strong className="text-slate-900 font-mono">15%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access to Fintech & Market Innovations */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl border border-indigo-800/40 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">
                  Inovações & Ferramentas de Ponta da Locação
                </h3>
              </div>
              <span className="text-xs text-indigo-300 font-mono">
                Diferenciais Competitivos Ativos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Antecipação */}
              <div 
                onClick={() => setActiveTab('antecipacao')}
                className="p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-400/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300">
                    FIDC • 2% Take
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    Antecipação de Aluguéis
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Simule até 12 a 24 meses de aluguel à vista no Pix para proprietários.
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <span>Abrir Simulador</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Seguradoras */}
              <div 
                onClick={() => setActiveTab('seguradoras')}
                className="p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-blue-400/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300">
                    Zero Fiador
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition-colors">
                    Hub de Seguradoras
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Porto Seguro, CredPago, Velo com pré-aprovação de crédito em 15 min.
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-blue-400">
                  <span>Cotar Garantias</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Notificações */}
              <div 
                onClick={() => setActiveTab('notificacoes')}
                className="p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-400/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300">
                    WhatsApp + Pix
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    Régua de Notificações
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Lembretes D-5 e D-1 com Pix Copia e Cola e recibos automáticos.
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <span>Ver Notificações</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Diferenciais */}
              <div 
                onClick={() => setActiveTab('diferenciais_mercado')}
                className="p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-indigo-400/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300">
                    Benchmarking
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors">
                    Diferenciais de Mercado
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Comparativo com QuintoAndar/Superlógica e Simulador de ROI anual.
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-indigo-400">
                  <span>Analisar Mercado</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: CONTRATOS (GESTÃO COMPLETA) */}
      {/* ============================================================== */}
      {activeTab === 'contratos' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por inquilino, imóvel ou código do contrato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <button
              onClick={() => {
                setEditingContract(null);
                setShowContractModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Adicionar Contrato de Locação</span>
            </button>
          </div>

          {/* Contracts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts
              .filter(c => 
                c.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.code.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((c) => {
                const adminFeeAmount = (c.monthlyRent * c.adminFeePercentage) / 100;
                const netRepasseAmount = c.monthlyRent - adminFeeAmount;

                return (
                  <div
                    key={c.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {c.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'ATIVO' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                            Índice {c.adjustmentIndex}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mt-1">
                          {c.propertyAddress}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingContract(c);
                            setContractModalStep('seguros');
                            setShowContractModal(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 flex items-center gap-1"
                          title="Cotar Seguro Fiança e Garantia Locatícia (CredPago, Porto Seguro) para este contrato"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cotar Seguro</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingContract(c);
                            setContractModalStep('dados');
                            setShowContractModal(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                        >
                          Editar
                        </button>
                      </div>
                    </div>

                    {/* Inquilino e Prazos */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Locatário / Inquilino:</span>
                        <strong className="text-slate-800 truncate block">{c.tenantName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{c.tenantPhone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Vencimento & Repasse:</span>
                        <span className="text-slate-800 block">
                          Vence dia <strong>{c.dueDay}</strong> • Repasse dia <strong>{c.repasseDay}</strong>
                        </span>
                        <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Garantia: <strong>{c.insurance?.guaranteeCompany || c.guaranteeType.replace('_', ' ')}</strong></span>
                          {c.insurance?.guaranteePolicyNumber && (
                            <span className="text-[9px] text-blue-700 font-mono font-bold">({c.insurance.guaranteePolicyNumber})</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Valores e Taxa Adm */}
                    <div className="grid grid-cols-3 gap-2 text-xs py-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Aluguel:</span>
                        <strong className="text-slate-900 font-mono">
                          R$ {c.monthlyRent.toLocaleString('pt-BR')}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Taxa Adm ({c.adminFeePercentage}%):</span>
                        <strong className="text-blue-700 font-mono">
                          R$ {adminFeeAmount.toFixed(2)}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Líquido Repasse:</span>
                        <strong className="text-emerald-700 font-mono">
                          R$ {netRepasseAmount.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Split de Herdeiros */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-900 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                          Split de Herdeiros ({c.beneficiaries.length} beneficiários):
                        </span>
                      </div>

                      <div className="space-y-1">
                        {c.beneficiaries.map((b) => {
                          const amount = (netRepasseAmount * b.percent) / 100;
                          return (
                            <div 
                              key={b.id}
                              className="text-[11px] flex items-center justify-between bg-purple-50/60 px-2.5 py-1 rounded-lg border border-purple-100"
                            >
                              <span className="truncate max-w-[200px] text-purple-950 font-medium">
                                {b.name} ({b.relationship})
                              </span>
                              <div className="flex items-center gap-2 font-mono shrink-0">
                                <span className="font-bold text-purple-700">{b.percent}%</span>
                                <strong className="text-emerald-700">R$ {amount.toFixed(2)}</strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: COBRANÇAS & EMISSÃO DE BOLETOS */}
      {/* ============================================================== */}
      {activeTab === 'cobrancas' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Cobranças & Emissão de Boletos Registrados
              </h3>
              <p className="text-xs text-slate-500">
                Gere boletos com QR Code PIX, envie notificações e controle a compensação em tempo real
              </p>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-semibold text-[10px] sm:text-xs">
                    <th className="p-2.5 sm:p-3.5 pl-3 sm:pl-4">Competência</th>
                    <th className="p-2.5 sm:p-3.5">Contrato / Imóvel</th>
                    <th className="p-2.5 sm:p-3.5">Inquilino</th>
                    <th className="p-2.5 sm:p-3.5">Vencimento</th>
                    <th className="p-2.5 sm:p-3.5">Valor Total</th>
                    <th className="p-2.5 sm:p-3.5">Status</th>
                    <th className="p-2.5 sm:p-3.5 pr-3 sm:pr-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 sm:p-3.5 pl-3 sm:pl-4 font-bold text-slate-900 font-mono text-xs sm:text-sm">
                        {inv.competenceMonth}
                      </td>

                      <td className="p-2.5 sm:p-3.5">
                        <span className="font-semibold text-slate-900 block text-xs">{inv.contractCode}</span>
                        <span className="text-[10px] text-slate-400 truncate block max-w-xs">{inv.propertyAddress}</span>
                      </td>

                      <td className="p-2.5 sm:p-3.5">
                        <span className="font-medium text-slate-800 block text-xs">{inv.tenantName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{inv.tenantPhone}</span>
                      </td>

                      <td className="p-2.5 sm:p-3.5">
                        <span className={`font-mono text-xs font-semibold ${
                          inv.status === 'ATRASADO' ? 'text-rose-600 font-bold' : 'text-slate-700'
                        }`}>
                          {inv.dueDate.split('-').reverse().join('/')}
                        </span>
                        {inv.daysOverdue && (
                          <span className="text-[10px] text-rose-600 block font-bold">
                            {inv.daysOverdue} dias de atraso
                          </span>
                        )}
                      </td>

                      <td className="p-2.5 sm:p-3.5 font-bold font-mono text-slate-900 text-xs sm:text-sm">
                        R$ {inv.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-2.5 sm:p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'PAGO'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.status === 'ATRASADO'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>

                      <td className="p-2.5 sm:p-3.5 pr-3 sm:pr-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedBoletoInvoice(inv)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                            title="Ver Boleto Registrado e PIX"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Boleto / Pix</span>
                          </button>

                          {inv.status !== 'PAGO' && (
                            <button
                              onClick={() => handleMarkInvoiceAsPaid(inv.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Dar Baixa Manual"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 4: RÉGUA DE COBRANÇA & NOTIFICAÇÕES */}
      {/* ============================================================== */}
      {activeTab === 'regua' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Automação da Régua de Cobrança (WhatsApp & E-mail)
              </h3>
              <p className="text-xs text-slate-500">
                Disparos programados para reduzir a inadimplência e facilitar o pagamento imediato via Pix
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenNewRule}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Nova Etapa na Régua</span>
            </button>
          </div>

          {/* Timeline da Régua */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {collectionRules.map((rule) => (
              <div 
                key={rule.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {rule.dayOffset < 0 ? `${rule.dayOffset} dias` : rule.dayOffset === 0 ? 'No Vencimento' : `+${rule.dayOffset} dias`}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${rule.active ? 'bg-emerald-500' : 'bg-slate-300'}`} title={rule.active ? 'Ativo' : 'Inativo'}></span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {rule.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic line-clamp-4">
                    "{rule.messageTemplate}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Canal: <strong className="text-slate-600">{rule.channel}</strong></span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditRule(rule)}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Histórico Recente de Notificações */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Notificações Disparadas Recentemente ({notifications.length})
            </h4>

            <div className="space-y-2">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{notif.tenantName}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">({notif.contractCode})</span>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{notif.message}</p>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {notif.sentAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 5: REAJUSTES ANUAIS (IPCA / IGP-M / IVAR) */}
      {/* ============================================================== */}
      {activeTab === 'reajustes' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Controle de Aniversário & Reajustes de Contratos
            </h3>
            <p className="text-xs text-slate-500">
              Aplicação automática dos índices contratuais (IPCA, IGP-M, IVAR) com emissão de aditivo e notificação
            </p>
          </div>

          {/* Indices Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'IPCA (IBGE)', rate: '3.92% a.a.', status: 'Oficial Vigente' },
              { name: 'IGP-M (FGV)', rate: '4.10% a.a.', status: 'Oficial Vigente' },
              { name: 'IVAR (FGV Aluguéis)', rate: '2.85% a.a.', status: 'Oficial Vigente' },
              { name: 'INPC (IBGE)', rate: '3.80% a.a.', status: 'Oficial Vigente' },
            ].map((idx, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">{idx.name}</span>
                <div className="text-xl font-bold text-blue-700 font-mono">{idx.rate}</div>
                <span className="text-[10px] text-emerald-600 font-semibold">{idx.status}</span>
              </div>
            ))}
          </div>

          {/* Adjustments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Contratos Completando 12 Meses (Prontos para Reajuste)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-semibold">
                    <th className="p-3.5 pl-4">Contrato</th>
                    <th className="p-3.5">Locatário</th>
                    <th className="p-3.5">Aniversário</th>
                    <th className="p-3.5">Índice</th>
                    <th className="p-3.5">Aluguel Atual</th>
                    <th className="p-3.5">Novo Aluguel</th>
                    <th className="p-3.5 pr-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adjustments.map((adj) => (
                    <tr key={adj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-4 font-bold text-slate-900 font-mono">
                        {adj.contractCode}
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{adj.tenantName}</span>
                        <span className="text-[10px] text-slate-400 truncate block max-w-xs">{adj.propertyAddress}</span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-700">
                        {adj.anniversaryDate.split('-').reverse().join('/')}
                      </td>

                      <td className="p-3.5 font-bold text-blue-700">
                        {adj.indexUsed} ({adj.indexRatePercent}%)
                      </td>

                      <td className="p-3.5 font-mono text-slate-500">
                        R$ {adj.currentRent.toFixed(2)}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-emerald-700 text-sm">
                        R$ {adj.newRent.toFixed(2)}
                        <span className="text-[10px] text-emerald-600 block font-normal">
                          (+ R$ {adj.differenceAmount.toFixed(2)})
                        </span>
                      </td>

                      <td className="p-3.5 pr-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAdjustment(adj)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-300 inline-flex items-center gap-1 cursor-pointer"
                          title="Editar manualmente valores, índice e datas do reajuste"
                        >
                          <Edit3 className="w-3 h-3 text-slate-600" />
                          <span>Editar Manual</span>
                        </button>

                        {adj.status === 'APLICADO' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                            Reajustado ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApplyAdjustment(adj.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            Aplicar Reajuste
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 6: REPASSES & SPLIT DE HERDEIROS (O GRANDE DESTAQUE SOLICITADO) */}
      {/* ============================================================== */}
      {activeTab === 'repasses' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Split de Repasses Automáticos aos Proprietários & Herdeiros
              </h3>
              <p className="text-xs text-slate-500">
                Distribuição programada com divisão em percentuais de herança, retenção de taxa de adm da imobiliária e transferências PIX
              </p>
            </div>

            <button
              onClick={() => {
                repasses.filter(r => r.status === 'PENDENTE').forEach(r => handleExecuteRepasse(r.id));
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Executar Repasses Pix Pendentes</span>
            </button>
          </div>

          {/* Cards de Repasse com Árvore de Herdeiros */}
          <div className="space-y-4">
            {repasses.map((rep) => {
              const isExecuting = executingRepasseId === rep.id;

              return (
                <div 
                  key={rep.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs"
                >
                  {/* Top Bar of Repasse */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {rep.contractCode}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {rep.propertyAddress}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.status === 'PAGO' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rep.status === 'PAGO' ? 'Liquidado via PIX ✓' : 'Pendente de Repasse'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Competência: {rep.competenceMonth} • Inquilino: <strong>{rep.tenantName}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Total Líquido dos Herdeiros:
                        </span>
                        <strong className="text-base text-emerald-700 font-mono font-bold">
                          R$ {rep.netRepasseAmount.toFixed(2)}
                        </strong>
                      </div>

                      {rep.status !== 'PAGO' && (
                        <button
                          onClick={() => handleExecuteRepasse(rep.id)}
                          disabled={isExecuting}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{isExecuting ? 'Transferindo...' : 'Fazer Pix Agora'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Demonstração das Deduções */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Recebido Inquilino:</span>
                      <strong className="text-slate-800 font-mono">R$ {rep.totalCollected.toFixed(2)}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Taxa Adm Imob ({rep.adminFeePercent}%):</span>
                      <strong className="text-blue-700 font-mono">- R$ {rep.adminFeeAmount.toFixed(2)}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Despesas / IPTU / Seguros:</span>
                      <strong className="text-rose-600 font-mono">- R$ {rep.deductionsAmount.toFixed(2)}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Saldo Líquido Distribuído:</span>
                      <strong className="text-emerald-700 font-mono font-bold">R$ {rep.netRepasseAmount.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Árvore de Repasse dos Herdeiros e Filhos */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      Destinatários do Split (Filhos / Herdeiros / Meeira):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {rep.beneficiariesPayout.map((b) => (
                        <div 
                          key={b.beneficiaryId}
                          className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/90 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs text-purple-950 truncate max-w-[140px]">
                              {b.name}
                            </strong>
                            <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded">
                              {b.percent}%
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600">
                            Grau: <strong>{b.relationship}</strong>
                          </div>

                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            PIX: {b.pixKey}
                          </div>

                          <div className="pt-1 border-t border-purple-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700 font-mono">
                              R$ {b.amount.toFixed(2)}
                            </span>

                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              b.status === 'PAGO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {b.status === 'PAGO' ? 'Pago ✓' : 'Aguardando'}
                            </span>
                          </div>

                          {b.transactionId && (
                            <span className="text-[9px] text-slate-400 font-mono block truncate">
                              ID: {b.transactionId}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 7: REGRAS DE SPLIT (CONFIGURAÇÃO AUTOMÁTICA DE BENEFICIÁRIOS E CONTAS) */}
      {activeTab === 'regras_split' && (
        <div className="animate-in fade-in-50 duration-200">
          <RentalSplitRulesConfig
            contracts={contracts}
            onUpdateContractBeneficiaries={(contractId, newBeneficiaries) => {
              setContracts(prev => prev.map(c => {
                if (c.id === contractId) {
                  return {
                    ...c,
                    beneficiaries: newBeneficiaries.map(nb => ({
                      id: nb.id,
                      name: nb.name,
                      relationship: nb.relationship.replace('_', ' '),
                      cpfCnpj: nb.cpfCnpj,
                      percent: nb.percent,
                      pixKeyType: nb.pixKeyType,
                      pixKey: nb.pixKey,
                      bankName: nb.bankName
                    }))
                  };
                }
                return c;
              }));
            }}
          />
        </div>
      )}

      {/* ABA: CONFIGURAÇÃO DE REGRAS DE SPLIT */}
      {activeTab === 'regras_split' && (
        <div className="animate-in fade-in-50 duration-200">
          <RentalSplitRulesConfig 
            contracts={contracts} 
            onUpdateContractBeneficiaries={handleUpdateContractBeneficiaries}
          />
        </div>
      )}

      {/* ABA: DIMOB RECEITA FEDERAL */}
      {activeTab === 'dimob' && (
        <div className="animate-in fade-in-50 duration-200">
          <DimobExportView 
            contracts={contracts} 
            properties={properties}
          />
        </div>
      )}

      {/* ABA 8: ÁREA DO CLIENTE (PORTAL INQUILINO & PROPRIETÁRIO) */}
      {activeTab === 'portal_cliente' && (
        <div className="animate-in fade-in-50 duration-200">
          <CustomerPortalView embeddedInWebsite={false} />
        </div>
      )}

      {/* ABA: ANTECIPAÇÃO DE ALUGUÉIS (FINTECH FIDC) */}
      {activeTab === 'antecipacao' && (
        <div className="animate-in fade-in-50 duration-200">
          <RentAdvanceSimulatorView contracts={contracts} />
        </div>
      )}

      {/* ABA: SEGUROS E GARANTIAS LOCATÍCIAS (HUB MULTI-SEGURADORAS) */}
      {activeTab === 'seguradoras' && (
        <div className="animate-in fade-in-50 duration-200">
          <InsuranceGuaranteesHubView />
        </div>
      )}

      {/* ABA: CENTRAL DE NOTIFICAÇÕES AOS CLIENTES (RÉGUA WHATSAPP) */}
      {activeTab === 'notificacoes' && (
        <div className="animate-in fade-in-50 duration-200">
          <ClientNotificationsCenterView />
        </div>
      )}

      {/* ABA: DIFERENCIAIS & BENCHMARKING DE MERCADO */}
      {activeTab === 'diferenciais_mercado' && (
        <div className="animate-in fade-in-50 duration-200">
          <RentalMarketBenchmarksView onNavigateToTab={(tab) => setActiveTab(tab as any)} />
        </div>
      )}

      {/* Contract Modal */}
      {showContractModal && (
        <RentalContractModal
          isOpen={showContractModal}
          onClose={() => {
            setShowContractModal(false);
            setEditingContract(null);
          }}
          onSaveContract={handleSaveContract}
          existingContract={editingContract}
          properties={properties}
          initialStep={contractModalStep}
        />
      )}

      {/* Boleto & Pix Modal */}
      {selectedBoletoInvoice && (
        <BoletoModal
          invoice={selectedBoletoInvoice}
          isOpen={!!selectedBoletoInvoice}
          onClose={() => setSelectedBoletoInvoice(null)}
          onMarkAsPaid={handleMarkInvoiceAsPaid}
        />
      )}

      {/* Repasse Success Feedback Modal */}
      {repasseSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setRepasseSuccessModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Fechar"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Repasse Pix Concluído com Sucesso!
            </h3>

            <p className="text-xs text-slate-500">
              O valor líquido de <strong>R$ {repasseSuccessModal.netRepasseAmount.toFixed(2)}</strong> foi transferido instantaneamente para os {repasseSuccessModal.beneficiariesPayout.length} herdeiros cadastrados no split.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1 font-mono text-slate-700">
              {repasseSuccessModal.beneficiariesPayout.map(b => (
                <div key={b.beneficiaryId} className="flex justify-between">
                  <span>{b.name.split(' ')[0]} ({b.percent}%):</span>
                  <strong>R$ {b.amount.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <button
              onClick={() => setRepasseSuccessModal(null)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Concluir & Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL: EDIÇÃO DE ETAPA DA RÉGUA DE COBRANÇA */}
      {(editingRule || isNewRuleModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingRule ? 'Editar Etapa da Régua de Cobrança' : 'Nova Etapa da Régua de Cobrança'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ajuste o prazo em dias, canais de disparo e modelo de mensagem
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingRule(null);
                  setIsNewRuleModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título da Etapa:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lembrete Preventivo - 5 dias antes"
                  value={ruleTitle}
                  onChange={e => setRuleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Prazo em Dias (Offset do Vencimento):
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: -5 (antes) ou +3 (após)"
                    value={ruleDayOffset}
                    onChange={e => setRuleDayOffset(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Negativo = antes do vencimento • 0 = no dia • Positivo = após atraso
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Canal de Envio:</label>
                  <select
                    value={ruleChannel}
                    onChange={e => setRuleChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-hidden"
                  >
                    <option value="WHATSAPP">WhatsApp Oficial (API)</option>
                    <option value="EMAIL">E-mail com Boleto/Pix Anexo</option>
                    <option value="MULTI">WhatsApp + E-mail (Recomendado)</option>
                    <option value="SMS">SMS Corporativo</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">
                    Texto da Mensagem (com Tags Dinâmicas):
                  </label>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    Variáveis disponíveis abaixo
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={ruleMessage}
                  onChange={e => setRuleMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden resize-none font-mono"
                />

                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                  {['{nome_inquilino}', '{valor}', '{vencimento}', '{link_boleto_pix}', '{codigo_contrato}'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRuleMessage(prev => prev + ' ' + tag)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md font-mono cursor-pointer"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none pt-2">
                <input
                  type="checkbox"
                  checked={ruleActive}
                  onChange={e => setRuleActive(e.target.checked)}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">
                  Etapa Ativa na Régua Automática
                </span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRule(null);
                    setIsNewRuleModalOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Regra da Régua</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIÇÃO MANUAL DE REAJUSTE DE CONTRATO */}
      {editingAdjustment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Editar Dados do Reajuste Manualmente</h3>
                  <p className="text-xs text-slate-400">
                    Contrato {editingAdjustment.contractCode} • {editingAdjustment.tenantName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdjustment(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustmentManual} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Imóvel:</span>
                <p className="font-semibold text-slate-900">{editingAdjustment.propertyAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aluguel Atual (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={adjCurrentRent}
                    onChange={e => {
                      const cur = Number(e.target.value);
                      setAdjCurrentRent(cur);
                      const calculatedNew = cur * (1 + adjIndexRatePercent / 100);
                      setAdjNewRent(Number(calculatedNew.toFixed(2)));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Novo Aluguel Reajustado (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={adjNewRent}
                    onChange={e => setAdjNewRent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-xl text-xs font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Índice Contratual / Motivo:</label>
                  <select
                    value={adjIndexUsed}
                    onChange={e => setAdjIndexUsed(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-hidden"
                  >
                    <option value="IPCA">IPCA (IBGE)</option>
                    <option value="IGP-M">IGP-M (FGV)</option>
                    <option value="IVAR">IVAR (FGV Aluguéis)</option>
                    <option value="INPC">INPC (IBGE)</option>
                    <option value="ACORDO_LIVRE">Acordo Livre / Negociação Direta</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Percentual do Reajuste (%):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={adjIndexRatePercent}
                    onChange={e => {
                      const pct = Number(e.target.value);
                      setAdjIndexRatePercent(pct);
                      const calculatedNew = adjCurrentRent * (1 + pct / 100);
                      setAdjNewRent(Number(calculatedNew.toFixed(2)));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Data de Aniversário / Início da Vigência:
                </label>
                <input
                  type="date"
                  required
                  value={adjAnniversaryDate}
                  onChange={e => setAdjAnniversaryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                <span className="text-emerald-800 font-medium">Diferença Mensal a Adicionar:</span>
                <strong className="text-emerald-900 font-mono text-sm">
                  + R$ {(Number(adjNewRent) - Number(adjCurrentRent)).toFixed(2)}
                </strong>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAdjustment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Dados Manualmente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

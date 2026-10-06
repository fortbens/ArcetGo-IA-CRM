import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Building,
  Building2,
  Users,
  Trophy,
  Crown,
  Medal,
  Award,
  Target,
  Flame,
  Calendar,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Share2,
  Download,
  Printer,
  Copy,
  Check,
  Plus,
  Search,
  ChevronRight,
  Sparkles,
  Percent,
  FileText,
  PieChart,
  BarChart3,
  ShieldCheck,
  Smartphone,
  MessageCircle,
  Send,
  RefreshCw,
  Eye,
  X,
  Layers,
  Zap,
  Tag,
  QrCode,
  Gift,
  Globe,
  Home,
  MapPin,
  Shuffle,
  Columns,
  FileSignature,
  Sliders,
  Compass
} from 'lucide-react';
import { 
  RealEstateProperty, 
  Lead, 
  CommissionDeal, 
  RentalContract, 
  UserProfile, 
  TenantId,
  UserRole
} from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';
import { ExecutiveSalesFunnelRecharts } from './ExecutiveSalesFunnelRecharts';

export interface FinancialBillItem {
  id: string;
  type: 'PAGAR' | 'RECEBER';
  category: string;
  description: string;
  entityName: string; // Fornecedor ou Pagador
  dueDate: string;
  amount: number;
  status: 'PENDENTE' | 'PAGO' | 'RECEBIDO' | 'ATRASADO';
  paymentMethod: 'PIX' | 'BOLETO' | 'TED' | 'RETENCAO_SPLIT';
  referenceCode?: string;
  notes?: string;
}

interface ExecutiveDirectorDashboardViewProps {
  currentUser?: UserProfile;
  properties?: RealEstateProperty[];
  leads?: Lead[];
  commissions?: CommissionDeal[];
  contracts?: RentalContract[];
  onNavigateToTab?: (tabId: string) => void;
  onSimulateRole?: (role: UserRole) => void;
}

export const ExecutiveDirectorDashboardView: React.FC<ExecutiveDirectorDashboardViewProps> = ({
  currentUser,
  properties = [],
  leads = [],
  commissions = [],
  contracts = [],
  onNavigateToTab,
  onSimulateRole
}) => {
  // Active role view for tailored dashboard
  const [activeRoleView, setActiveRoleView] = useState<UserRole>(currentUser?.role || 'MASTER_ADMIN');
  const [managerApprovedProposals, setManagerApprovedProposals] = useState<string[]>([]);
  const [roletaBrokersState, setRoletaBrokersState] = useState([
    { id: '1', name: 'Juliana Mendes', role: 'Corretora Sênior', leadsToday: 5, active: true },
    { id: '2', name: 'Roberto Silveira', role: 'Corretor Pleno', leadsToday: 4, active: true },
    { id: '3', name: 'Fernanda Castro', role: 'Captadora & Vendas', leadsToday: 5, active: true },
    { id: '4', name: 'Lucas Albuquerque', role: 'Corretor Júnior', leadsToday: 2, active: false }
  ]);

  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState<'MES_ATUAL' | 'TRIMESTRE' | 'ANO_2026'>('MES_ATUAL');
  const [selectedBranch, setSelectedBranch] = useState<'TODAS' | 'MATRIZ_JARDINS' | 'ALPHAVILLE' | 'BARRA'>('TODAS');
  const [activeFinanceTab, setActiveFinanceTab] = useState<'TODOS' | 'PAGAR' | 'RECEBER' | 'DRE'>('TODOS');
  
  // Interactive Financial state (Contas a pagar e receber com liquidação interativa)
  const [financialBills, setFinancialBills] = useState<FinancialBillItem[]>([
    // Contas a Pagar
    {
      id: 'cp_01',
      type: 'PAGAR',
      category: 'Mídia & Portais',
      description: 'Mensalidade Grupo OLX (ZAP Imóveis + VivaReal - Pacote Destaques)',
      entityName: 'Grupo ZAP / OLX Brasil',
      dueDate: '2026-09-30',
      amount: 8200,
      status: 'PENDENTE',
      paymentMethod: 'BOLETO',
      referenceCode: 'ZAP-202609-849'
    },
    {
      id: 'cp_02',
      type: 'PAGAR',
      category: 'Tráfego Pago',
      description: 'Campanhas Meta Ads (Instagram Ads Lançamentos Jardins & Paulistano)',
      entityName: 'Meta Platforms Inc.',
      dueDate: '2026-09-28',
      amount: 4500,
      status: 'PENDENTE',
      paymentMethod: 'PIX',
      referenceCode: 'FB-ADS-99124'
    },
    {
      id: 'cp_03',
      type: 'PAGAR',
      category: 'Comissões da Equipe',
      description: 'Split de Comissão s/ Venda Cobertura Duplex (Corretora Juliana Mendes)',
      entityName: 'Juliana Mendes (Corretora)',
      dueDate: '2026-09-27',
      amount: 38850,
      status: 'PENDENTE',
      paymentMethod: 'PIX',
      referenceCode: 'RPA-2026-782'
    },
    {
      id: 'cp_04',
      type: 'PAGAR',
      category: 'Sede & Infraestrutura',
      description: 'Aluguel & Condomínio Agência Matriz Jardins (Alameda Lorena)',
      entityName: 'Lorena Prime Empreendimentos',
      dueDate: '2026-09-25',
      amount: 14200,
      status: 'PAGO',
      paymentMethod: 'TED',
      referenceCode: 'LOC-SEDE-0926'
    },
    {
      id: 'cp_05',
      type: 'PAGAR',
      category: 'Software & TI',
      description: 'Licenças Telefonia VoIP, WhatsApp API Cloud & Assinatura DocuSign',
      entityName: 'Cloud Comms & DocuSign Tech',
      dueDate: '2026-10-05',
      amount: 2890,
      status: 'PENDENTE',
      paymentMethod: 'BOLETO',
      referenceCode: 'TI-CLOUD-2026'
    },
    {
      id: 'cp_06',
      type: 'PAGAR',
      category: 'Comissões da Equipe',
      description: 'Comissão Captadora Fernanda Castro (Apt Jardim Paulistano)',
      entityName: 'Fernanda Castro (Corretora)',
      dueDate: '2026-09-24',
      amount: 58800,
      status: 'PAGO',
      paymentMethod: 'PIX',
      referenceCode: 'RPA-2026-891'
    },
    // Contas a Receber
    {
      id: 'cr_01',
      type: 'RECEBER',
      category: 'Comissão de Venda',
      description: 'Faturamento de Comissão Venda Residencial Jardins One (Unidade 1204)',
      entityName: 'Even Construtora & Incorporadora',
      dueDate: '2026-09-29',
      amount: 111600,
      status: 'PENDENTE',
      paymentMethod: 'TED',
      referenceCode: 'NF-E-2026-1049'
    },
    {
      id: 'cr_02',
      type: 'RECEBER',
      category: 'Taxa Adm Locação',
      description: 'Taxa de Administração (10%) Carteira de 184 Contratos Ativos',
      entityName: 'Carteira de Inquilinos AcertGo',
      dueDate: '2026-09-30',
      amount: 78400,
      status: 'PENDENTE',
      paymentMethod: 'RETENCAO_SPLIT',
      referenceCode: 'TAXA-ADM-0926'
    },
    {
      id: 'cr_03',
      type: 'RECEBER',
      category: 'Comissão de Venda',
      description: 'Comissão 6% Venda Apt Jardim Paulistano (Liquidada pelo Comprador)',
      entityName: 'Comprador Ricardo Faria',
      dueDate: '2026-09-24',
      amount: 147000,
      status: 'RECEBIDO',
      paymentMethod: 'TED',
      referenceCode: 'REC-COMP-2026'
    },
    {
      id: 'cr_04',
      type: 'RECEBER',
      category: 'Financiamento CCA',
      description: 'Repasse Bonificação Bancária Itaú BBA & Caixa (Crédito Aprovado)',
      entityName: 'Banco Itaú Consignado & Imob',
      dueDate: '2026-10-02',
      amount: 16500,
      status: 'PENDENTE',
      paymentMethod: 'TED',
      referenceCode: 'CCA-ITAU-883'
    },
    {
      id: 'cr_05',
      type: 'RECEBER',
      category: 'Intermediação Locação',
      description: 'Taxa de Intermediação 1º Aluguel (5 Novos Contratos Fechados na Semana)',
      entityName: 'Proprietários Diversos',
      dueDate: '2026-09-28',
      amount: 22800,
      status: 'PENDENTE',
      paymentMethod: 'PIX',
      referenceCode: '1-ALUGUEL-0926'
    }
  ]);

  // Modal State for New Bill
  const [showNewBillModal, setShowNewBillModal] = useState(false);
  const [newBillType, setNewBillType] = useState<'PAGAR' | 'RECEBER'>('PAGAR');
  const [newBillDesc, setNewBillDesc] = useState('');
  const [newBillEntity, setNewBillEntity] = useState('');
  const [newBillCategory, setNewBillCategory] = useState('Geral');
  const [newBillAmount, setNewBillAmount] = useState<number>(0);
  const [newBillDueDate, setNewBillDueDate] = useState('2026-10-10');
  const [newBillMethod, setNewBillMethod] = useState<'PIX' | 'BOLETO' | 'TED' | 'RETENCAO_SPLIT'>('PIX');

  // Copy state for Director WhatsApp Pitch
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Search filter for bills
  const [billSearchTerm, setBillSearchTerm] = useState('');

  // Quick Action: Liquidate Bill (Mark as Paid/Received)
  const handleToggleBillStatus = (billId: string) => {
    setFinancialBills(prev => prev.map(bill => {
      if (bill.id !== billId) return bill;
      if (bill.type === 'PAGAR') {
        const nextStatus = bill.status === 'PAGO' ? 'PENDENTE' : 'PAGO';
        return { ...bill, status: nextStatus };
      } else {
        const nextStatus = bill.status === 'RECEBIDO' ? 'PENDENTE' : 'RECEBIDO';
        return { ...bill, status: nextStatus };
      }
    }));
  };

  const handleAddNewBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillDesc || newBillAmount <= 0) return;

    const newItem: FinancialBillItem = {
      id: `bill_${Date.now()}`,
      type: newBillType,
      category: newBillCategory,
      description: newBillDesc,
      entityName: newBillEntity || 'Empresa / Parceiro',
      dueDate: newBillDueDate,
      amount: Number(newBillAmount),
      status: 'PENDENTE',
      paymentMethod: newBillMethod,
      referenceCode: `MANUAL-${Date.now().toString().slice(-4)}`
    };

    setFinancialBills(prev => [newItem, ...prev]);
    setShowNewBillModal(false);
    setNewBillDesc('');
    setNewBillEntity('');
    setNewBillAmount(0);
  };

  // =========================================================================
  // CORE EXECUTIVE METRICS COMPUTATIONS
  // =========================================================================

  // 1. Contas a Pagar & Receber Metrics
  const financeMetrics = useMemo(() => {
    const contasPagar = financialBills.filter(b => b.type === 'PAGAR');
    const contasReceber = financialBills.filter(b => b.type === 'RECEBER');

    const totalPagar = contasPagar.reduce((acc, curr) => acc + curr.amount, 0);
    const pagarPendente = contasPagar.filter(b => b.status === 'PENDENTE').reduce((acc, curr) => acc + curr.amount, 0);
    const pagarPago = contasPagar.filter(b => b.status === 'PAGO').reduce((acc, curr) => acc + curr.amount, 0);

    const totalReceber = contasReceber.reduce((acc, curr) => acc + curr.amount, 0);
    const receberPendente = contasReceber.filter(b => b.status === 'PENDENTE').reduce((acc, curr) => acc + curr.amount, 0);
    const receberRecebido = contasReceber.filter(b => b.status === 'RECEBIDO').reduce((acc, curr) => acc + curr.amount, 0);

    // Projected net cash flow for the month
    const saldoProjetado = totalReceber - totalPagar;
    const saldoRealizado = receberRecebido - pagarPago;

    return {
      totalPagar,
      pagarPendente,
      pagarPago,
      totalReceber,
      receberPendente,
      receberRecebido,
      saldoProjetado,
      saldoRealizado
    };
  }, [financialBills]);

  // 2. VGV Metrics (Mês e Ano)
  const vgvMetrics = useMemo(() => {
    // Current Month VGV
    const vgvMensalRealizado = 12850000; // R$ 12.85M
    const metaVgvMensal = 10000000; // R$ 10.00M
    const percentMetaMensal = (vgvMensalRealizado / metaVgvMensal) * 100;

    // Annual VGV (2026 Acumulado)
    const vgvAnoRealizado = 84500000; // R$ 84.50M
    const metaVgvAnual = 120000000; // R$ 120.00M
    const percentMetaAnual = (vgvAnoRealizado / metaVgvAnual) * 100;
    const crescimentoAnoAnterior = 28.4; // +28.4% YoY

    return {
      vgvMensalRealizado,
      metaVgvMensal,
      percentMetaMensal,
      vgvAnoRealizado,
      metaVgvAnual,
      percentMetaAnual,
      crescimentoAnoAnterior,
      ticketMedioVendas: 1140000, // R$ 1.14M
      qtdVendasMes: 14,
      qtdVendasAno: 82
    };
  }, []);

  // 3. Comissões & House Share
  const commissionMetrics = useMemo(() => {
    const comissaoTotalBrutaMes = 514000; // R$ 514k
    const comissaoTotalBrutaAno = 3840000; // R$ 3.84M
    
    // Repartição do Mês
    const parteImobiliaria = 184200; // 35.8% (House share)
    const parteCorretores = 265800;  // 51.7%
    const parteGerentes = 64000;     // 12.5%

    return {
      comissaoTotalBrutaMes,
      comissaoTotalBrutaAno,
      parteImobiliaria,
      parteCorretores,
      parteGerentes,
      percentHouseShare: 35.8
    };
  }, []);

  // 4. Locações Metrics
  const rentalMetrics = useMemo(() => {
    const novosContratosMes = 26;
    const novosContratosAno = 218;
    const totalContratosGestao = 184; // Carteira ativa sob gestão
    const volumeAluguelSobGestao = 784000; // R$ 784k/mês
    const taxaAdmRecorrenteMRR = 78400; // R$ 78.4k/mês (10%)
    const taxaInadimplencia = 1.4; // 1.4% (Muito baixa)
    const taxaVacancia = 3.8; // 3.8% do estoque

    return {
      novosContratosMes,
      novosContratosAno,
      totalContratosGestao,
      volumeAluguelSobGestao,
      taxaAdmRecorrenteMRR,
      taxaInadimplencia,
      taxaVacancia
    };
  }, []);

  // 5. Leads do Mês & Leads do Ano
  const leadMetrics = useMemo(() => {
    const leadsMes = leads.length > 50 ? leads.length : 342;
    const leadsAno = 3890;
    const crescimentoLeads = 18.5; // +18.5% MoM
    const custoMedioPorLead = 24.50; // R$ 24,50
    const cacMedio = 1680; // R$ 1.680
    const taxaConversaoLeadVisita = 28.6; // %
    const taxaConversaoVisitaFechamento = 18.2; // %

    return {
      leadsMes,
      leadsAno,
      crescimentoLeads,
      custoMedioPorLead,
      cacMedio,
      taxaConversaoLeadVisita,
      taxaConversaoVisitaFechamento
    };
  }, [leads]);

  // 6. Mídias com Mais Retorno (ROI & ROAS Ranking)
  const mediaPerformanceList = useMemo(() => [
    {
      id: 'midia_zap',
      name: 'Portal ZAP Imóveis',
      icon: Building2,
      leads: 142,
      invested: 4400,
      dealsCount: 4,
      vgvGenerated: 4200000,
      commissionGenerated: 210000,
      roiMultiplier: 47.7,
      isTopVolume: true,
      category: 'Portal Pago'
    },
    {
      id: 'midia_qr_placas',
      name: 'Placas Físicas c/ QR Code',
      icon: QrCode,
      leads: 34,
      invested: 520,
      dealsCount: 2,
      vgvGenerated: 2350000,
      commissionGenerated: 141000,
      roiMultiplier: 271.1, // Campeão absoluto em ROI
      isTopRoi: true,
      category: 'Offline Inteligente'
    },
    {
      id: 'midia_vivareal',
      name: 'Portal VivaReal',
      icon: Home,
      leads: 108,
      invested: 3800,
      dealsCount: 3,
      vgvGenerated: 2890000,
      commissionGenerated: 158000,
      roiMultiplier: 41.5,
      category: 'Portal Pago'
    },
    {
      id: 'midia_instagram',
      name: 'Instagram & Meta Ads',
      icon: Share2,
      leads: 94,
      invested: 3200,
      dealsCount: 2,
      vgvGenerated: 2150000,
      commissionGenerated: 107500,
      roiMultiplier: 33.6,
      category: 'Tráfego Pago'
    },
    {
      id: 'midia_referrals',
      name: 'Indique e Ganhe (Parceiros)',
      icon: Gift,
      leads: 38,
      invested: 1400,
      dealsCount: 2,
      vgvGenerated: 1980000,
      commissionGenerated: 99000,
      roiMultiplier: 70.7,
      category: 'Viral / Referral'
    },
    {
      id: 'midia_google',
      name: 'Google Ads (Search & Maps)',
      icon: Search,
      leads: 56,
      invested: 2600,
      dealsCount: 1,
      vgvGenerated: 1640000,
      commissionGenerated: 82000,
      roiMultiplier: 31.5,
      category: 'Tráfego Pago'
    },
    {
      id: 'midia_site',
      name: 'Site Oficial & SEO Orgânico',
      icon: Globe,
      leads: 48,
      invested: 750,
      dealsCount: 1,
      vgvGenerated: 1250000,
      commissionGenerated: 62500,
      roiMultiplier: 83.3,
      category: 'Orgânico'
    }
  ], []);

  // 7. Campeão de Vendas & Campeão de Locações (Top Performers)
  const salesChampions = useMemo(() => [
    {
      rank: 1,
      name: 'Roberto Silveira',
      role: 'Corretor Sênior (Alto Padrão)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      creci: '198765-F / SP',
      vgv: 4900000,
      dealsCount: 3,
      commissionGenerated: 205800,
      houseShareGenerated: 42100,
      highlightBadge: '1º Lugar - Campeão de Vendas'
    },
    {
      rank: 2,
      name: 'Juliana Mendes',
      role: 'Corretora & Consultora de Investimento',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      creci: '210984-F / SP',
      vgv: 4640000,
      dealsCount: 2,
      commissionGenerated: 147870,
      houseShareGenerated: 80790,
      highlightBadge: '2º Lugar - Vice-Campeã Vendas'
    },
    {
      rank: 3,
      name: 'Fernanda Castro',
      role: 'Corretora de Lançamentos & Parcerias',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      creci: '187420-F / SP',
      vgv: 2450000,
      dealsCount: 2,
      commissionGenerated: 98000,
      houseShareGenerated: 24500,
      highlightBadge: '3º Lugar - Vendas'
    }
  ], []);

  const rentalChampions = useMemo(() => [
    {
      rank: 1,
      name: 'Juliana Mendes',
      role: 'Gestora Comercial de Locações',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      creci: '210984-F / SP',
      newContracts: 9,
      monthlyVolume: 44800,
      taxaAdmRecorrenteGerada: 4480,
      avgCloseDays: 6,
      highlightBadge: '1º Lugar - Campeã de Locações'
    },
    {
      rank: 2,
      name: 'Carlos Eduardo',
      role: 'Consultor de Locação Residencial',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      creci: '176540-F / SP',
      newContracts: 7,
      monthlyVolume: 31200,
      taxaAdmRecorrenteGerada: 3120,
      avgCloseDays: 9,
      highlightBadge: '2º Lugar - Vice-Campeão Locação'
    },
    {
      rank: 3,
      name: 'Fernanda Castro',
      role: 'Captação & Negociação de Aluguel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      creci: '187420-F / SP',
      newContracts: 5,
      monthlyVolume: 24500,
      taxaAdmRecorrenteGerada: 2450,
      avgCloseDays: 8,
      highlightBadge: '3º Lugar - Locação'
    }
  ], []);

  // Filtered bills by search and tab
  const filteredFinancialBills = useMemo(() => {
    return financialBills.filter(bill => {
      if (activeFinanceTab === 'PAGAR' && bill.type !== 'PAGAR') return false;
      if (activeFinanceTab === 'RECEBER' && bill.type !== 'RECEBER') return false;
      if (!billSearchTerm) return true;
      const term = billSearchTerm.toLowerCase();
      return (
        bill.description.toLowerCase().includes(term) ||
        bill.entityName.toLowerCase().includes(term) ||
        bill.category.toLowerCase().includes(term) ||
        (bill.referenceCode && bill.referenceCode.toLowerCase().includes(term))
      );
    });
  }, [financialBills, activeFinanceTab, billSearchTerm]);

  // Formatted WhatsApp Executive Pitch for Board / Partners
  const whatsappExecutivePitch = useMemo(() => {
    const directorName = currentUser?.name || 'Dr. Leonardo Carneiro';
    let text = `*RELATÓRIO EXECUTIVO DA DIRETORIA - ACERTGO IMÓVEIS*\n`;
    text += `Período: Setembro/2026 | Gerado por: ${directorName}\n`;
    text += `Unidade: Matriz Jardins & Filiais Integradas\n\n`;

    text += `*VGV & PERFORMANCE COMERCIAL:*\n`;
    text += `• VGV do Mês: *R$ ${(vgvMetrics.vgvMensalRealizado / 1000000).toFixed(2)}M* (Meta: R$ 10.0M - *${vgvMetrics.percentMetaMensal.toFixed(0)}% BATIDA*)\n`;
    text += `• VGV Acumulado 2026: *R$ ${(vgvMetrics.vgvAnoRealizado / 1000000).toFixed(2)}M* (+${vgvMetrics.crescimentoAnoAnterior}% vs ano anterior)\n`;
    text += `• Vendas Fechadas no Mês: *${vgvMetrics.qtdVendasMes} imóveis* (Ticket Médio: R$ 1.14M)\n\n`;

    text += `*CARTEIRA DE LOCAÇÃO & MRR:*\n`;
    text += `• Novos Contratos no Mês: *${rentalMetrics.novosContratosMes} contratos*\n`;
    text += `• Carteira Ativa Sob Gestão: *${rentalMetrics.totalContratosGestao} imóveis*\n`;
    text += `• Receita Recorrente Taxa Adm (MRR): *R$ ${rentalMetrics.taxaAdmRecorrenteMRR.toLocaleString('pt-BR')}/mês*\n`;
    text += `• Inadimplência da Carteira: *${rentalMetrics.taxaInadimplencia}%* (Mínima histórica)\n\n`;

    text += `*FLUXO DE CAIXA & FINANCEIRO:*\n`;
    text += `• Contas a Receber no Mês: *R$ ${financeMetrics.totalReceber.toLocaleString('pt-BR')}*\n`;
    text += `• Contas a Pagar no Mês: *R$ ${financeMetrics.totalPagar.toLocaleString('pt-BR')}*\n`;
    text += `• Saldo Operacional Projetado: *R$ ${financeMetrics.saldoProjetado.toLocaleString('pt-BR')}*\n`;
    text += `• Comissão Bruta Gerada: *R$ ${commissionMetrics.comissaoTotalBrutaMes.toLocaleString('pt-BR')}* (House Share: R$ ${commissionMetrics.parteImobiliaria.toLocaleString('pt-BR')})\n\n`;

    text += `*LEADS & EFICIÊNCIA DE MÍDIA:*\n`;
    text += `• Leads do Mês: *${leadMetrics.leadsMes}* | Leads do Ano: *${leadMetrics.leadsAno}*\n`;
    text += `• Mídia Campeã em ROI: *Placas QR Code (271x de retorno)*\n`;
    text += `• Mídia Campeã em Volume: *Portal ZAP (R$ 210k de comissão gerada)*\n\n`;

    text += `*DESTAQUES DA EQUIPE (TOP PERFORMERS):*\n`;
    text += `• Campeão de Vendas: *${salesChampions[0].name}* (VGV: R$ ${(salesChampions[0].vgv / 1000000).toFixed(2)}M)\n`;
    text += `• Campeã de Locações: *${rentalChampions[0].name}* (${rentalChampions[0].newContracts} novos contratos)\n\n`;

    text += `Acesse o Painel Completo em: https://acertgo.com.br/diretoria`;
    return text;
  }, [vgvMetrics, rentalMetrics, financeMetrics, commissionMetrics, leadMetrics, salesChampions, rentalChampions, currentUser]);

  const handleCopyWhatsAppPitch = () => {
    navigator.clipboard.writeText(whatsappExecutivePitch);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* Role Profile Switcher & Permissions Parameterization Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-slate-900">Dashboard Dinâmica por Perfil</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Alterne a visão da dashboard para simular a experiência e os KPIs de cada perfil da imobiliária
            </p>
          </div>
        </div>

        {/* Roles Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70">
          <button
            onClick={() => setActiveRoleView('MASTER_ADMIN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoleView === 'MASTER_ADMIN' || activeRoleView === 'SUPER_ADMIN'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Diretoria (Master)</span>
          </button>

          <button
            onClick={() => setActiveRoleView('MANAGER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoleView === 'MANAGER'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-200" />
            <span>Gerente de Vendas</span>
          </button>

          <button
            onClick={() => setActiveRoleView('BROKER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoleView === 'BROKER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-blue-200" />
            <span>Corretor Interno</span>
          </button>

          <button
            onClick={() => setActiveRoleView('FINANCIAL_OPERATOR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoleView === 'FINANCIAL_OPERATOR'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-200" />
            <span>Financeiro</span>
          </button>

          <button
            onClick={() => setActiveRoleView('EXTERNAL_PARTNER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoleView === 'EXTERNAL_PARTNER'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-300" />
            <span>Parceiro Externo</span>
          </button>
        </div>

        {/* Permissions Parameterizer Shortcut */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab?.('team_permissions')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Parametrizar Permissões</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: GERENTE DE VENDAS COCKPIT */}
      {activeRoleView === 'MANAGER' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Manager Header */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-purple-800/60 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1.5 shadow-sm">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    PAINEL DA GERÊNCIA COMERCIAL
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-300">
                    Supervisão de Equipe & Roleta
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Gestão de Equipe, Metas & Roleta
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Acompanhe a meta mensal do time (R$ 15M), distribuição de leads na Roleta em tempo real, aprovação rápida de propostas e SLA de follow-ups da equipe.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigateToTab?.('roleta')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Abrir Fila da Roleta
                </button>
                <button
                  onClick={() => onNavigateToTab?.('kanban')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2"
                >
                  <Columns className="w-4 h-4 text-purple-300" />
                  Funil da Equipe
                </button>
              </div>
            </div>
          </div>

          {/* Manager KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Meta da Equipe (Setembro)</span>
              <div className="text-2xl font-black text-slate-900">R$ 12,40M</div>
              <div className="text-xs text-purple-700 font-semibold">82,6% da meta (R$ 15,0M)</div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82.6%' }} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Fila da Roleta Hoje</span>
              <div className="text-2xl font-black text-slate-900">14 Leads</div>
              <div className="text-xs text-emerald-700 font-semibold">3 corretores ativos no plantão</div>
              <span className="inline-block text-[10px] text-slate-400">Tempo médio de resposta: 8 min</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Propostas em Análise</span>
              <div className="text-2xl font-black text-amber-600">
                {2 - managerApprovedProposals.length} Pendentes
              </div>
              <div className="text-xs text-amber-700 font-semibold">Aguardando decisão da gerência</div>
              <span className="inline-block text-[10px] text-slate-400">Descontos & condições especiais</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">SLA de Visitas & Funil</span>
              <div className="text-2xl font-black text-emerald-600">94.2%</div>
              <div className="text-xs text-emerald-700 font-semibold">18 visitas realizadas esta semana</div>
              <span className="inline-block text-[10px] text-slate-400">Conversão de visita p/ proposta: 33%</span>
            </div>
          </div>

          {/* Pending Proposals Section for Manager */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Propostas Aguardando Aprovação da Gerência</h3>
              </div>
              <span className="text-xs text-slate-500">Decisão imediata</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Carlos Eduardo Silveira</h4>
                    <p className="text-[11px] text-slate-500">Imóvel: Residencial Jardins One (Unidade 1204)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                    Desconto Solicitado
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tabela Oficial:</span>
                    <span className="font-bold text-slate-800">R$ 2.500.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Oferta do Comprador:</span>
                    <span className="font-bold text-emerald-600">R$ 2.380.000 (-4.8%)</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1 border-t">
                    <span className="text-slate-500">Condição:</span>
                    <span className="font-semibold text-slate-700">Entrada 20% Pix + Saldo Financiamento Caixa</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {managerApprovedProposals.includes('prop_1') ? (
                    <span className="w-full py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> Proposta Aprovada pela Gerência
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setManagerApprovedProposals(prev => [...prev, 'prop_1'])}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Aprovar Proposta
                      </button>
                      <button
                        onClick={() => onNavigateToTab?.('document_templates')}
                        className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300"
                      >
                        Gerar Minuta
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Gustavo Henrique Vasconcelos</h4>
                    <p className="text-[11px] text-slate-500">Imóvel: Apartamento 3 Dorms Itaim Bibi</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                    Permuta Parcial
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Valor de Venda:</span>
                    <span className="font-bold text-slate-800">R$ 1.800.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Veículo na Entrada:</span>
                    <span className="font-bold text-blue-600">R$ 180.000 (FIPE -10%)</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1 border-t">
                    <span className="text-slate-500">Corretor Titular:</span>
                    <span className="font-semibold text-slate-700">Roberto Silveira</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {managerApprovedProposals.includes('prop_2') ? (
                    <span className="w-full py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> Proposta Aprovada pela Gerência
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setManagerApprovedProposals(prev => [...prev, 'prop_2'])}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Aprovar Proposta
                      </button>
                      <button
                        onClick={() => onNavigateToTab?.('document_templates')}
                        className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300"
                      >
                        Gerar Minuta
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CORRETOR DE VENDAS COCKPIT */}
      {activeRoleView === 'BROKER' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-blue-800/60 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5 shadow-sm">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    CENTRAL DO CORRETOR • MEUS RESULTADOS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-300">
                    CRECI 248.910-F
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Minha Central de Vendas & Negócios
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Acompanhe sua meta individual do mês, seus clientes ativos no funil, visitas agendadas hoje e suas comissões a receber com transparência de split.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigateToTab?.('kanban')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Columns className="w-4 h-4" />
                  Meu Funil de Leads
                </button>
                <button
                  onClick={() => onNavigateToTab?.('document_templates')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-300" />
                  Gerar Minuta / Proposta
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Minha Meta do Mês</span>
              <div className="text-2xl font-black text-slate-900">R$ 1,95M</div>
              <div className="text-xs text-blue-700 font-semibold">78,0% atingido (Meta: R$ 2,50M)</div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Comissões a Receber (Split)</span>
              <div className="text-2xl font-black text-emerald-600">R$ 58.800</div>
              <div className="text-xs text-emerald-700 font-semibold">2 negócios liquidados este mês</div>
              <span className="inline-block text-[10px] text-slate-400">Previsão D+0 Pix: 29/09 e 02/10</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Meus Leads Quentes</span>
              <div className="text-2xl font-black text-purple-600">4 Clientes</div>
              <div className="text-xs text-purple-700 font-semibold">1 proposta em negociação</div>
              <span className="inline-block text-[10px] text-slate-400">3 visitas realizadas</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Visitas Agendadas Hoje</span>
              <div className="text-2xl font-black text-amber-600">2 Visitas</div>
              <div className="text-xs text-amber-700 font-semibold">15:00 e 17:30 (Jardins / Itaim)</div>
              <span className="inline-block text-[10px] text-slate-400">Rotas e chaves confirmadas</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Ações Rápidas do Dia:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => onNavigateToTab?.('document_templates')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all"
              >
                <FileText className="w-5 h-5 text-blue-600 mb-2" />
                <div className="font-bold text-slate-900">Gerar Documento</div>
                <div className="text-[11px] text-slate-500">Recibo, Proposta ou Minuta</div>
              </button>

              <button
                onClick={() => onNavigateToTab?.('cca_banking')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all"
              >
                <Building className="w-5 h-5 text-emerald-600 mb-2" />
                <div className="font-bold text-slate-900">Simulador de Crédito</div>
                <div className="text-[11px] text-slate-500">Itaú, Caixa e Bradesco</div>
              </button>

              <button
                onClick={() => onNavigateToTab?.('sales_mirror')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition-all"
              >
                <Layers className="w-5 h-5 text-purple-600 mb-2" />
                <div className="font-bold text-slate-900">Espelho de Vendas</div>
                <div className="text-[11px] text-slate-500">Reservar unidade em 24h</div>
              </button>

              <button
                onClick={() => onNavigateToTab?.('roteiro_visitas')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all"
              >
                <Compass className="w-5 h-5 text-amber-600 mb-2" />
                <div className="font-bold text-slate-900">Roteiro de Visitas</div>
                <div className="text-[11px] text-slate-500">GPS & Rota Inteligente</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: OPERADOR FINANCEIRO COCKPIT */}
      {activeRoleView === 'FINANCIAL_OPERATOR' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    PAINEL FINANCEIRO & JURÍDICO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-300">
                    Fluxo de Caixa D+0 & Conciliação
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Contas, Boletos, Splits Pix & Dimob
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Gerencie contas a pagar e receber do dia, conciliação D+0 Pix e boleto registrado, repasses de locação para proprietários e relatórios contábeis.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigateToTab?.('fintech_split')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Split Pix & Repasses
                </button>
                <button
                  onClick={() => onNavigateToTab?.('contracts')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2"
                >
                  <FileSignature className="w-4 h-4 text-emerald-300" />
                  Contratos de Locação
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Saldo Projetado Hoje</span>
              <div className="text-2xl font-black text-emerald-600">R$ 184.200</div>
              <div className="text-xs text-slate-500 font-semibold">Conta Principal Santander & Pix</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Contas a Pagar Hoje</span>
              <div className="text-2xl font-black text-rose-600">R$ 38.850</div>
              <div className="text-xs text-rose-700 font-semibold">1 split de comissão pendente</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Contas a Receber Hoje</span>
              <div className="text-2xl font-black text-blue-600">R$ 111.600</div>
              <div className="text-xs text-blue-700 font-semibold">Faturamento Even Construtora</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Retenção de Tributos</span>
              <div className="text-2xl font-black text-slate-900">R$ 14.820</div>
              <div className="text-xs text-slate-500 font-semibold">IRRF s/ comissões e repasses</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: CORRETOR PARCEIRO COCKPIT */}
      {activeRoleView === 'EXTERNAL_PARTNER' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5 shadow-sm">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    PORTAL DE CO-CORRETAGEM & PARCERIA
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-300">
                    Comissão Garantida 3% a 5%
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Lançamentos & Co-corretagem
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Acesse lançamentos imobiliários autorizados para venda, tabelas de preço atualizadas com espelho de vendas e acompanhe suas comissões de parceria com split garantido.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigateToTab?.('sales_mirror')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  Ver Espelho de Vendas
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Lançamentos Autorizados</span>
              <div className="text-2xl font-black text-slate-900">12 Projetos</div>
              <div className="text-xs text-blue-700 font-semibold">Jardins, Alphaville e Barra</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Comissão de Parceria</span>
              <div className="text-2xl font-black text-emerald-600">4,0% Média</div>
              <div className="text-xs text-emerald-700 font-semibold">Garantia formal em contrato</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Minhas Propostas Ativas</span>
              <div className="text-2xl font-black text-purple-600">3 Propostas</div>
              <div className="text-xs text-purple-700 font-semibold">1 em análise de crédito</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Comissões Recebidas</span>
              <div className="text-2xl font-black text-slate-900">R$ 48.000</div>
              <div className="text-xs text-slate-500 font-semibold">Últimos 90 dias</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: DIRETOR GERAL / MASTER ADMIN (CEO STRATEGIC COCKPIT) */}
      {(activeRoleView === 'MASTER_ADMIN' || activeRoleView === 'SUPER_ADMIN') && (
        <div className="space-y-6">
          {/* Top CEO Command Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-emerald-400" />
                Painel do Dono & CEO • Cockpit Estratégico
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-300 border border-white/10">
                Visão Geral 360° em Uma Tela Só
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Cockpit Executivo da Imobiliária</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black">
                AO VIVO
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consolidado financeiro e operacional para sócios e diretores: VGV anual e mensal, contas a pagar e receber, vendas, carteira de locação, retorno real de mídias e campeões de equipe.
            </p>
          </div>

          {/* Quick Period & Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Period Switcher */}
            <div className="bg-slate-800/90 backdrop-blur-md p-1 rounded-2xl flex items-center gap-1 border border-slate-700">
              <button
                onClick={() => setSelectedPeriod('MES_ATUAL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPeriod === 'MES_ATUAL'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mês Atual (Setembro)
              </button>
              <button
                onClick={() => setSelectedPeriod('TRIMESTRE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPeriod === 'TRIMESTRE'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3º Trimestre
              </button>
              <button
                onClick={() => setSelectedPeriod('ANO_2026')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPeriod === 'ANO_2026'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ano 2026 (YTD)
              </button>
            </div>

            {/* Branch Filter */}
            <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl px-3 py-1.5 text-xs flex items-center gap-1.5 text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value as any)}
                className="bg-transparent font-bold text-xs text-white outline-none cursor-pointer"
              >
                <option value="TODAS" className="bg-slate-900 text-white">Todas as Unidades (Consolidado)</option>
                <option value="MATRIZ_JARDINS" className="bg-slate-900 text-white">Matriz Jardins (SP)</option>
                <option value="ALPHAVILLE" className="bg-slate-900 text-white">Filial Alphaville (SP)</option>
                <option value="BARRA" className="bg-slate-900 text-white">Filial Barra da Tijuca (RJ)</option>
              </select>
            </div>

            {/* Copy WhatsApp Report for Board */}
            <button
              onClick={handleCopyWhatsAppPitch}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border active:scale-95 ${
                copiedSummary
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-md'
              }`}
              title="Copiar relatório formatado para o WhatsApp dos sócios"
            >
              {copiedSummary ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedSummary ? 'Relatório Copiado!' : 'WhatsApp Diretoria'}</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Imprimir Painel ou Salvar em PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP CARDS: VGV DO ANO, VGV DO MÊS, LEADS DO MÊS, LEADS DO ANO */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: VGV DO ANO */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                VGV Acumulado do Ano
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                +{vgvMetrics.crescimentoAnoAnterior}% YoY
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              R$ {(vgvMetrics.vgvAnoRealizado / 1000000).toFixed(2)}M
            </div>
            
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Meta 2026: <strong>R$ 120,0M</strong></span>
              <span className="font-bold text-emerald-600">{vgvMetrics.percentMetaAnual.toFixed(1)}% atingida</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, vgvMetrics.percentMetaAnual)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>82 Vendas Acumuladas</span>
              <span>Ritmo: Projeção R$ 126,8M</span>
            </div>
          </div>
        </div>

        {/* Card 2: VGV MENSAL */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                VGV do Mês (Setembro)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                Meta Superada
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-blue-700">
              R$ {(vgvMetrics.vgvMensalRealizado / 1000000).toFixed(2)}M
            </div>
            
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Meta do Mês: <strong>R$ 10,0M</strong></span>
              <span className="font-bold text-blue-600">{vgvMetrics.percentMetaMensal.toFixed(0)}% da meta</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>14 Vendas Fechadas</span>
              <span>Ticket Médio: R$ 1,14M</span>
            </div>
          </div>
        </div>

        {/* Card 3: LEADS DO MÊS */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                Leads do Mês
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                +{leadMetrics.crescimentoLeads}% MoM
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {leadMetrics.leadsMes}
              <span className="text-xs font-bold text-slate-400 ml-1.5">novos contatos</span>
            </div>
            
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>CPL Médio: <strong>R$ {leadMetrics.custoMedioPorLead.toFixed(2)}</strong></span>
              <span className="text-purple-700 font-bold">28.6% viram visita</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>CAC Médio: R$ {leadMetrics.cacMedio.toLocaleString('pt-BR')}</span>
            <span className="font-semibold text-emerald-600">Tempo 1º Contato: 11 min</span>
          </div>
        </div>

        {/* Card 4: LEADS DO ANO */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                Leads Acumulados do Ano
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                2026 Total
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {leadMetrics.leadsAno.toLocaleString('pt-BR')}
              <span className="text-xs font-bold text-slate-400 ml-1.5">leads no CRM</span>
            </div>
            
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Base Qualificada: <strong>84%</strong></span>
              <span className="text-emerald-600 font-bold">18.2% conversão final</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Média: 432 leads/mês</span>
            <span className="font-semibold text-blue-600">12 canais ativos</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL HERO: VENDAS (COMERCIAL) vs LOCAÇÕES (CARTEIRA DE ALUGUEL) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Painel de Vendas */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Operação de Vendas (Intermediação)</h3>
                <p className="text-xs text-slate-500">Mercado de Terceiros (Avulsos) + Lançamentos Construtoras</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-100">
              14 Vendas no Mês
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">VGV Mês</span>
              <span className="text-base sm:text-lg font-black text-slate-900">R$ 12,85M</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Ticket Médio</span>
              <span className="text-base sm:text-lg font-black text-slate-900">R$ 1,14M</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Ciclo Médio</span>
              <span className="text-base sm:text-lg font-black text-emerald-600">26 dias</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Comissão Mês</span>
              <span className="text-base sm:text-lg font-black text-blue-700">R$ 514k</span>
            </div>
          </div>

          {/* Breakdown Comissões House vs Corretores */}
          <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Repartição de Comissões de Vendas (Mês):</span>
              <span className="text-blue-700">R$ 514.000 Total Bruto</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center min-w-0">
                <span className="text-[10px] text-slate-500 block truncate">Imobiliária (House)</span>
                <span className="font-black text-emerald-700 text-xs sm:text-sm block tabular-nums">R$ 184,2k · 35.8%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center min-w-0">
                <span className="text-[10px] text-slate-500 block truncate">Corretores</span>
                <span className="font-black text-slate-800 text-xs sm:text-sm block tabular-nums">R$ 265,8k · 51.7%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center min-w-0">
                <span className="text-[10px] text-slate-500 block truncate">Gerentes / Coord.</span>
                <span className="font-black text-slate-800 text-xs sm:text-sm block tabular-nums">R$ 64,0k · 12.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Locações (Carteira de Aluguel) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Carteira de Locação & Gestão Predial</h3>
                <p className="text-xs text-slate-500">Receita Recorrente Previsível (MRR) + Taxas de Intermediação</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-teal-50 text-teal-700 border border-teal-100">
              184 Contratos Ativos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Novos Contratos Mês</span>
              <span className="text-base sm:text-lg font-black text-slate-900">26 locações</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">MRR Taxa Adm (10%)</span>
              <span className="text-base sm:text-lg font-black text-teal-700">R$ 78,4k/mês</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Inadimplência</span>
              <span className="text-base sm:text-lg font-black text-emerald-600">1.4% (Baixa)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Taxa de Vacância</span>
              <span className="text-base sm:text-lg font-black text-slate-900">3.8%</span>
            </div>
          </div>

          {/* Destaque Carteira Recorrente */}
          <div className="bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Volume de Aluguel Sob Gestão: <strong>R$ 784.000 / mês</strong></span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                98% com garantia via Seguro Fiança CredPago / Porto Seguro (Risco zero de inadimplência direta).
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('contracts')}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              Ver Locações
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2.5. FUNIL DE VENDAS VISUAL (RECHARTS) - PIPELINE & TAXAS DE CONVERSÃO */}
      {/* ========================================================================= */}
      <ExecutiveSalesFunnelRecharts
        leads={leads}
        onNavigateToTab={onNavigateToTab}
        selectedBranch={selectedBranch}
      />

      {/* ========================================================================= */}
      {/* 3. CONTAS A PAGAR, RECEBER & FLUXO DE CAIXA EXECUTIVO */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header of Finance Section */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Contas a Pagar & Receber da Imobiliária
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Conciliação em 1 Clique
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Acompanhe e liquide faturas de portais, tráfego, comissões de corretores e recebíveis de construtoras
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 text-right">
              <span className="text-[10px] font-bold text-rose-700 block uppercase">A Pagar no Mês</span>
              <span className="text-sm font-black text-rose-800">R$ {financeMetrics.totalPagar.toLocaleString('pt-BR')}</span>
            </div>

            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-right">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">A Receber no Mês</span>
              <span className="text-sm font-black text-emerald-800">R$ {financeMetrics.totalReceber.toLocaleString('pt-BR')}</span>
            </div>

            <div className="bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 text-right">
              <span className="text-[10px] font-bold text-blue-700 block uppercase">Saldo Projetado</span>
              <span className="text-sm font-black text-blue-800">+R$ {financeMetrics.saldoProjetado.toLocaleString('pt-BR')}</span>
            </div>

            <button
              onClick={() => onNavigateToTab && onNavigateToTab('financial_erp')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Wallet className="w-4 h-4" />
              <span>Abrir ERP Financeiro</span>
            </button>

            <button
              onClick={() => {
                setNewBillType('PAGAR');
                setShowNewBillModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Conta</span>
            </button>
          </div>
        </div>

        {/* Sub-Header Tabs & Filters */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveFinanceTab('TODOS')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeFinanceTab === 'TODOS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Contas ({financialBills.length})
            </button>
            <button
              onClick={() => setActiveFinanceTab('PAGAR')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeFinanceTab === 'PAGAR'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contas a Pagar ({financialBills.filter(b => b.type === 'PAGAR').length})
            </button>
            <button
              onClick={() => setActiveFinanceTab('RECEBER')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeFinanceTab === 'RECEBER'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contas a Receber ({financialBills.filter(b => b.type === 'RECEBER').length})
            </button>
            <button
              onClick={() => setActiveFinanceTab('DRE')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeFinanceTab === 'DRE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DRE Sintético (CEO)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={billSearchTerm}
              onChange={(e) => setBillSearchTerm(e.target.value)}
              placeholder="Buscar por descrição, fornecedor..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Content based on Active Tab */}
        {activeFinanceTab === 'DRE' ? (
          /* DRE Sintético do Diretor */
          <div className="p-5 sm:p-6 space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-300">
                  DRE Sintético Operacional (Setembro/2026)
                </h3>
                <span className="text-xs text-emerald-400 font-bold">
                  Margem Líquida da Imobiliária: 36.4%
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                <div className="flex items-center justify-between py-1.5 text-slate-200">
                  <span>(+) Receita Bruta Intermediação de Vendas (Comissões)</span>
                  <span className="font-bold text-white">R$ 514.000,00</span>
                </div>
                <div className="flex items-center justify-between py-1.5 text-slate-200">
                  <span>(+) Receita Taxa de Administração de Locação (MRR 10%)</span>
                  <span className="font-bold text-white">R$ 78.400,00</span>
                </div>
                <div className="flex items-center justify-between py-1.5 text-slate-200">
                  <span>(+) Receita de Intermediação de Financiamento Bancário (CCA)</span>
                  <span className="font-bold text-white">R$ 16.500,00</span>
                </div>
                <div className="flex items-center justify-between py-1.5 font-bold text-emerald-400 bg-slate-800/40 px-2 rounded-lg">
                  <span>(=) RECEITA BRUTA TOTAL REALIZADA</span>
                  <span>R$ 608.900,00</span>
                </div>
                <div className="flex items-center justify-between py-1.5 text-rose-300">
                  <span>(-) Repasses de Comissões aos Corretores & Gerentes</span>
                  <span>- R$ 329.800,00</span>
                </div>
                <div className="flex items-center justify-between py-1.5 text-rose-300">
                  <span>(-) Investimento em Mídia, Portais ZAP/VivaReal & Tráfego</span>
                  <span>- R$ 16.270,00</span>
                </div>
                <div className="flex items-center justify-between py-1.5 text-rose-300">
                  <span>(-) Custos Fixos, Sede, Aluguel Lorena, TI & Softwares</span>
                  <span>- R$ 41.200,00</span>
                </div>
                <div className="flex items-center justify-between py-2 font-black text-sm text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3 rounded-xl">
                  <span>(=) LUCRO OPERACIONAL LÍQUIDO (EBITDA DA IMOBILIÁRIA)</span>
                  <span>R$ 221.630,00</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Table of Financial Bills */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Descrição / Categoria</th>
                  <th className="py-3 px-4">Favorecido / Pagador</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4 text-right">Valor (R$)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFinancialBills.map((bill) => {
                  const isPagar = bill.type === 'PAGAR';
                  const isSettled = bill.status === 'PAGO' || bill.status === 'RECEBIDO';

                  return (
                    <tr 
                      key={bill.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSettled ? 'bg-slate-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                          isPagar
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isPagar ? 'A Pagar' : 'A Receber'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{bill.description}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{bill.category}</span>
                          {bill.referenceCode && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{bill.referenceCode}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {bill.entityName}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {new Date(bill.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {bill.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-black text-sm">
                        <span className={isPagar ? 'text-rose-700' : 'text-emerald-700'}>
                          {isPagar ? '- ' : '+ '}
                          R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          isSettled
                            ? 'bg-emerald-100 text-emerald-800'
                            : bill.status === 'ATRASADO'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isSettled && <Check className="w-3 h-3" />}
                          {bill.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleBillStatus(bill.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border active:scale-95 ${
                            isSettled
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                              : isPagar
                              ? 'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-emerald-200'
                          }`}
                        >
                          {isSettled ? 'Desfazer' : isPagar ? 'Liquidar (Pix)' : 'Confirmar Recebimento'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. MÍDIA COM MAIS RETORNO (ROI REAL & EFICIÊNCIA DE PORTAIS/TRÁFEGO) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Mídia & Canais com Mais Retorno (ROI & Lucratividade)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                  Otimização de Verba
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Comparativo de investimento, leads gerados, comissão retornada e multiplicador de ROI
              </p>
            </div>
          </div>

          {/* Destaque Mídia Campeã */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-3.5 py-2 rounded-2xl font-black text-xs shadow-md flex items-center gap-2">
            <Trophy className="w-4 h-4 fill-slate-950" />
            <span>Mídia Campeã em ROI: Placas QR Code (271x)</span>
          </div>
        </div>

        {/* Media Channels Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {mediaPerformanceList.map((media) => (
            <div
              key={media.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                media.isTopRoi
                  ? 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 border-amber-300 ring-2 ring-amber-400/30 shadow-md'
                  : media.isTopVolume
                  ? 'bg-gradient-to-br from-blue-50/70 via-white to-blue-50/40 border-blue-300 ring-2 ring-blue-400/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <media.icon className="w-4 h-4" />
                    </div>
                    <span>{media.name}</span>
                  </div>
                  {media.isTopRoi && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-slate-950 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-slate-950" /> MAIOR ROI
                    </span>
                  )}
                  {media.isTopVolume && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-600 text-white flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-white" /> MAIOR VOLUME
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5">
                  {media.category} • {media.dealsCount} {media.dealsCount === 1 ? 'Venda Fechada' : 'Vendas Fechadas'}
                </div>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2 rounded-xl text-center border border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Leads</span>
                  <span className="font-black text-slate-800">{media.leads}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Custo</span>
                  <span className="font-bold text-slate-700">R$ {media.invested.toLocaleString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Comissão</span>
                  <span className="font-black text-emerald-700">R$ {(media.commissionGenerated / 1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* Bottom ROI Multiplier */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Retorno Financeiro:</span>
                <span className="font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  {media.roiMultiplier.toFixed(1)}x o investido
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight for CEO Media Allocation */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-amber-300">Recomendação Estratégica da IA para o Diretor:</span>
              <span className="text-slate-300 ml-1">
                Aumentar em 20% a verba em <strong>ZAP Imóveis (alta conversão de VGV)</strong> e expandir o investimento em <strong>Placas com QR Code (ROI de 271x)</strong> nos bairros Jardins e Pinheiros para reduzir o CAC médio em 14%.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. CAMPEÃO DE VENDAS & CAMPEÃO DE LOCAÇÕES (TOP PERFORMERS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Campeão de Vendas */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Campeão de Vendas (VGV)</h3>
                <p className="text-xs text-slate-500">Ranking dos Corretores com maior volume financeiro vendido</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-800">
              Pódio Vendas
            </span>
          </div>

          <div className="space-y-3">
            {salesChampions.map((champion) => (
              <div
                key={champion.name}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  champion.rank === 1
                    ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={champion.avatar}
                      alt={champion.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                      champion.rank === 1 ? 'bg-amber-500' : champion.rank === 2 ? 'bg-slate-400' : 'bg-amber-700'
                    }`}>
                      {champion.rank}º
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{champion.name}</span>
                      {champion.rank === 1 && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                    <div className="text-[11px] text-slate-500">{champion.role} • CRECI {champion.creci}</div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                      {champion.highlightBadge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">VGV Vendido</div>
                  <div className="text-base font-black text-slate-900 text-emerald-700">
                    R$ {(champion.vgv / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {champion.dealsCount} vendas • House: R$ {(champion.houseShareGenerated / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campeão de Locações */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100">
                <Medal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Campeão de Locações (Aluguéis)</h3>
                <p className="text-xs text-slate-500">Ranking por novos contratos assinados e carteira de aluguel adicionada</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-teal-100 text-teal-800">
              Pódio Locação
            </span>
          </div>

          <div className="space-y-3">
            {rentalChampions.map((champion) => (
              <div
                key={champion.name}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  champion.rank === 1
                    ? 'bg-teal-50/50 border-teal-200 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={champion.avatar}
                      alt={champion.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                      champion.rank === 1 ? 'bg-teal-600' : champion.rank === 2 ? 'bg-slate-400' : 'bg-teal-800'
                    }`}>
                      {champion.rank}º
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{champion.name}</span>
                      {champion.rank === 1 && <Award className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500">{champion.role} • CRECI {champion.creci}</div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                      {champion.highlightBadge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">Novos Contratos</div>
                  <div className="text-base font-black text-slate-900 text-teal-700">
                    {champion.newContracts} locações
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    +R$ {champion.monthlyVolume.toLocaleString('pt-BR')}/mês em aluguéis
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. MODAL: ADICIONAR NOVA CONTA A PAGAR / RECEBER */}
      {/* ========================================================================= */}
      {showNewBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Lançar Nova Conta Financeira</span>
              </h3>
              <button
                onClick={() => setShowNewBillModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewBill} className="space-y-3.5">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewBillType('PAGAR')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    newBillType === 'PAGAR'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Conta a Pagar (Despesa)
                </button>
                <button
                  type="button"
                  onClick={() => setNewBillType('RECEBER')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    newBillType === 'RECEBER'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Conta a Receber (Receita)
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Descrição da Conta
                </label>
                <input
                  type="text"
                  required
                  value={newBillDesc}
                  onChange={(e) => setNewBillDesc(e.target.value)}
                  placeholder="Ex: Fatura Anúncios ZAP Imóveis ou Comissão Construtora Even"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {newBillType === 'PAGAR' ? 'Fornecedor / Favorecido' : 'Cliente / Construtora Pagadora'}
                </label>
                <input
                  type="text"
                  required
                  value={newBillEntity}
                  onChange={(e) => setNewBillEntity(e.target.value)}
                  placeholder="Ex: Grupo OLX ou Incorporadora Mitre"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newBillAmount || ''}
                    onChange={(e) => setNewBillAmount(Number(e.target.value))}
                    placeholder="0,00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Vencimento
                  </label>
                  <input
                    type="date"
                    required
                    value={newBillDueDate}
                    onChange={(e) => setNewBillDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={newBillCategory}
                    onChange={(e) => setNewBillCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Mídia & Portais">Mídia & Portais</option>
                    <option value="Tráfego Pago">Tráfego Pago</option>
                    <option value="Comissões da Equipe">Comissões da Equipe</option>
                    <option value="Sede & Infraestrutura">Sede & Infraestrutura</option>
                    <option value="Software & TI">Software & TI</option>
                    <option value="Comissão de Venda">Comissão de Venda</option>
                    <option value="Taxa Adm Locação">Taxa Adm Locação</option>
                    <option value="Financiamento CCA">Financiamento CCA</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Forma de Liquidação
                  </label>
                  <select
                    value={newBillMethod}
                    onChange={(e) => setNewBillMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="PIX">PIX Direto</option>
                    <option value="BOLETO">Boleto Bancário</option>
                    <option value="TED">Transferência TED</option>
                    <option value="RETENCAO_SPLIT">Retenção de Split</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewBillModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Cadastrar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>
      )}

    </div>
  );
};

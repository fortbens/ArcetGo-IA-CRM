import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Building, 
  Users, 
  CreditCard, 
  Receipt, 
  ArrowDownRight, 
  ArrowUpRight, 
  ShoppingBag, 
  ShieldAlert, 
  FileSpreadsheet, 
  PieChart, 
  ChevronRight, 
  Download, 
  Calendar, 
  Check, 
  X, 
  Tag, 
  HelpCircle,
  Copy,
  ExternalLink,
  Wallet,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  ContaPagar, 
  ContaReceber, 
  Fornecedor, 
  LancamentoSalarial, 
  TransacaoPdv, 
  DispensaFinanceira,
  StatusConta,
  DemonstrativoDre 
} from '../../types/financialErp';
import { 
  MOCK_CONTAS_PAGAR, 
  MOCK_CONTAS_RECEBER, 
  MOCK_FORNECEDORES, 
  MOCK_FOLHA_SALARIAL, 
  MOCK_TRANSACOES_PDV, 
  MOCK_DISPENSAS, 
  MOCK_DRE_DATA 
} from '../../data/mockFinancialErpData';
import { NovaContaPagarModal } from './NovaContaPagarModal';
import { NovaContaReceberModal } from './NovaContaReceberModal';
import { NovoFornecedorModal } from './NovoFornecedorModal';
import { NovoLancamentoPdvModal } from './NovoLancamentoPdvModal';
import { NovaDispensaModal } from './NovaDispensaModal';
import { NovoLancamentoSalarialModal } from './NovoLancamentoSalarialModal';
import { ReciboComprovanteModal } from './ReciboComprovanteModal';
import { TableScrollContainer } from '../common/TableScrollContainer';

export type FinanceTab = 
  | 'visao_geral'
  | 'contas_pagar'
  | 'contas_receber'
  | 'fornecedores'
  | 'folha_salarial'
  | 'pdv_servicos'
  | 'dispensas'
  | 'dre';

export const FinancialErpView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('visao_geral');

  // Core Financial State
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>(MOCK_CONTAS_PAGAR);
  const [contasReceber, setContasReceber] = useState<ContaReceber[]>(MOCK_CONTAS_RECEBER);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(MOCK_FORNECEDORES);
  const [folhaSalarial, setFolhaSalarial] = useState<LancamentoSalarial[]>(MOCK_FOLHA_SALARIAL);
  const [transacoesPdv, setTransacoesPdv] = useState<TransacaoPdv[]>(MOCK_TRANSACOES_PDV);
  const [dispensas, setDispensas] = useState<DispensaFinanceira[]>(MOCK_DISPENSAS);
  const [dreData, setDreData] = useState<DemonstrativoDre>(MOCK_DRE_DATA);

  // Search & Filters State
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('MES_ATUAL');

  // Modals Open State
  const [isModalPagarOpen, setIsModalPagarOpen] = useState(false);
  const [isModalReceberOpen, setIsModalReceberOpen] = useState(false);
  const [isModalFornecedorOpen, setIsModalFornecedorOpen] = useState(false);
  const [isModalPdvOpen, setIsModalPdvOpen] = useState(false);
  const [isModalDispensaOpen, setIsModalDispensaOpen] = useState(false);
  const [isModalSalarialOpen, setIsModalSalarialOpen] = useState(false);

  // Entities Selected for Edit
  const [editingContaPagar, setEditingContaPagar] = useState<ContaPagar | null>(null);
  const [editingContaReceber, setEditingContaReceber] = useState<ContaReceber | null>(null);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [editingLancamentoSalarial, setEditingLancamentoSalarial] = useState<LancamentoSalarial | null>(null);
  const [editingPdv, setEditingPdv] = useState<TransacaoPdv | null>(null);
  const [editingDispensa, setEditingDispensa] = useState<DispensaFinanceira | null>(null);

  // Recibo Modal State
  const [reciboData, setReciboData] = useState<any | null>(null);

  // Financial Metrics
  const totalRecebido = useMemo(() => {
    return contasReceber
      .filter(c => c.status === 'PAGO')
      .reduce((acc, curr) => acc + (curr.valorRecebido || curr.valorPrevisto), 0);
  }, [contasReceber]);

  const totalAReceber = useMemo(() => {
    return contasReceber
      .filter(c => c.status === 'PENDENTE' || c.status === 'VENCIDO')
      .reduce((acc, curr) => acc + curr.valorPrevisto, 0);
  }, [contasReceber]);

  const totalPago = useMemo(() => {
    return contasPagar
      .filter(c => c.status === 'PAGO')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [contasPagar]);

  const totalAPagar = useMemo(() => {
    return contasPagar
      .filter(c => c.status === 'PENDENTE' || c.status === 'VENCIDO')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [contasPagar]);

  const saldoLiquidoAtual = totalRecebido - totalPago;

  const totalPdvEntradas = useMemo(() => {
    return transacoesPdv
      .filter(t => t.tipo === 'ENTRADA')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [transacoesPdv]);

  const totalPdvSaidas = useMemo(() => {
    return transacoesPdv
      .filter(t => t.tipo === 'SAIDA')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [transacoesPdv]);

  // Actions: Baixa de Conta a Pagar
  const handleBaixarContaPagar = (id: string) => {
    setContasPagar(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'PAGO' as StatusConta,
          dataPagamento: new Date().toISOString().split('T')[0],
          pagoPor: 'Operador Financeiro AcertGo'
        };
      }
      return item;
    }));
  };

  // Actions: Baixa de Conta a Receber
  const handleBaixarContaReceber = (conta: ContaReceber) => {
    setContasReceber(prev => prev.map(item => {
      if (item.id === conta.id) {
        return {
          ...item,
          status: 'PAGO' as StatusConta,
          valorRecebido: item.valorPrevisto + (item.jurosMulta || 0) - (item.descontoConcedido || 0),
          dataRecebimento: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    // Abre recibo automaticamente para impressão
    setReciboData({
      titulo: 'Recibo de Quitação de Receita',
      codigoDocumento: conta.codigo,
      dataHora: new Date().toLocaleString('pt-BR'),
      pagadorOuFavorecido: conta.clienteNome,
      valor: conta.valorPrevisto,
      descricao: conta.descricao,
      formaPagamento: conta.formaPagamento,
      operadorOuResponsavel: 'Financeiro Central',
      detalhesAdicionais: [
        { label: 'Origem da Receita', value: conta.origem },
        { label: 'Imóvel Vinculado', value: conta.imovelCodigo || 'N/A' }
      ]
    });
  };

  // Actions: Pagar Salário
  const handlePagarSalario = (id: string) => {
    setFolhaSalarial(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'PAGO',
          dataPagamento: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  // Handlers para novos registros ou edição
  const handleSaveContaPagar = (nova: Omit<ContaPagar, 'id' | 'codigo'>, idParaEditar?: string) => {
    if (idParaEditar) {
      setContasPagar(prev => prev.map(item => item.id === idParaEditar ? { ...item, ...nova } : item));
    } else {
      const cod = `PAG-${1000 + contasPagar.length + 1}`;
      const id = `pag-${Date.now()}`;
      setContasPagar(prev => [
        { id, codigo: cod, ...nova },
        ...prev
      ]);
    }
    setEditingContaPagar(null);
  };

  const handleDeleteContaPagar = (id: string) => {
    setContasPagar(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveContaReceber = (nova: Omit<ContaReceber, 'id' | 'codigo'>, idParaEditar?: string) => {
    if (idParaEditar) {
      setContasReceber(prev => prev.map(item => item.id === idParaEditar ? { ...item, ...nova } : item));
    } else {
      const cod = `REC-${2000 + contasReceber.length + 1}`;
      const id = `rec-${Date.now()}`;
      setContasReceber(prev => [
        { id, codigo: cod, ...nova },
        ...prev
      ]);
    }
    setEditingContaReceber(null);
  };

  const handleDeleteContaReceber = (id: string) => {
    setContasReceber(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveFornecedor = (novo: Omit<Fornecedor, 'id' | 'codigo' | 'totalFaturado'>, idParaEditar?: string) => {
    if (idParaEditar) {
      setFornecedores(prev => prev.map(item => item.id === idParaEditar ? { ...item, ...novo } : item));
    } else {
      const cod = `FORN-${String(fornecedores.length + 1).padStart(3, '0')}`;
      const id = `forn-${Date.now()}`;
      setFornecedores(prev => [
        { id, codigo: cod, totalFaturado: 0, ...novo },
        ...prev
      ]);
    }
    setEditingFornecedor(null);
  };

  const handleDeleteFornecedor = (id: string) => {
    setFornecedores(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveLancamentoSalarial = (novo: Omit<LancamentoSalarial, 'id' | 'codigo'>, idParaEditar?: string) => {
    if (idParaEditar) {
      setFolhaSalarial(prev => prev.map(item => item.id === idParaEditar ? { ...item, ...novo } : item));
    } else {
      const cod = `FOLHA-${String(folhaSalarial.length + 1).padStart(3, '0')}`;
      const id = `sal-${Date.now()}`;
      setFolhaSalarial(prev => [
        { id, codigo: cod, ...novo },
        ...prev
      ]);
    }
    setEditingLancamentoSalarial(null);
  };

  const handleDeleteLancamentoSalarial = (id: string) => {
    setFolhaSalarial(prev => prev.filter(item => item.id !== id));
  };

  const handleSavePdv = (nova: Omit<TransacaoPdv, 'id' | 'codigo' | 'dataHora'>, idParaEditar?: string) => {
    if (idParaEditar) {
      setTransacoesPdv(prev => prev.map(item => item.id === idParaEditar ? { ...item, ...nova } : item));
    } else {
      const cod = `PDV-${800 + transacoesPdv.length + 1}`;
      const id = `pdv-${Date.now()}`;
      const now = new Date();
      const dataHora = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const transacaoCompleta: TransacaoPdv = {
        id,
        codigo: cod,
        dataHora,
        ...nova
      };
      setTransacoesPdv(prev => [transacaoCompleta, ...prev]);

      // Dispara recibo de balcão imediato
      setReciboData({
        titulo: nova.tipo === 'ENTRADA' ? 'Comprovante de Entrada PDV' : 'Comprovante de Pagamento PDV',
        codigoDocumento: cod,
        dataHora,
        pagadorOuFavorecido: nova.clienteOuPrestador,
        valor: nova.valor,
        descricao: nova.descricao,
        formaPagamento: nova.formaPagamento,
        operadorOuResponsavel: nova.operadorCaixa,
        detalhesAdicionais: [
          { label: 'Serviço', value: nova.tipoServico },
          { label: 'Imóvel Referência', value: nova.imovelCodigoReferencia || 'N/A' },
          { label: 'Processo / Protocolo', value: nova.processoNumero || 'N/A' }
        ]
      });
    }
    setEditingPdv(null);
  };

  const handleDeletePdv = (id: string) => {
    setTransacoesPdv(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveDispensa = (nova: Omit<DispensaFinanceira, 'id' | 'codigo' | 'dataSolicitacao'>, idParaEditar?: string) => {
    if (idParaEditar) {
      setDispensas(prev => prev.map(item => item.id === idParaEditar ? { ...item, ...nova } : item));
    } else {
      const cod = `DSP-${String(dispensas.length + 1).padStart(2, '0')}`;
      const id = `disp-${Date.now()}`;
      setDispensas(prev => [
        { id, codigo: cod, dataSolicitacao: new Date().toISOString().split('T')[0], ...nova },
        ...prev
      ]);
    }
    setEditingDispensa(null);
  };

  const handleDeleteDispensa = (id: string) => {
    setDispensas(prev => prev.filter(item => item.id !== id));
  };

  // Quick Code & Text Filtering
  const filteredContasPagar = useMemo(() => {
    return contasPagar.filter(item => {
      const matchCod = !filtroCodigo || item.codigo.toLowerCase().includes(filtroCodigo.toLowerCase());
      const matchText = !filtroTexto || 
        item.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.favorecidoNome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        (item.numeroDocumento && item.numeroDocumento.toLowerCase().includes(filtroTexto.toLowerCase()));
      const matchStatus = filtroStatus === 'TODOS' || item.status === filtroStatus;
      return matchCod && matchText && matchStatus;
    });
  }, [contasPagar, filtroCodigo, filtroTexto, filtroStatus]);

  const filteredContasReceber = useMemo(() => {
    return contasReceber.filter(item => {
      const matchCod = !filtroCodigo || 
        item.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()) ||
        (item.imovelCodigo && item.imovelCodigo.toLowerCase().includes(filtroCodigo.toLowerCase()));
      const matchText = !filtroTexto || 
        item.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.clienteNome.toLowerCase().includes(filtroTexto.toLowerCase());
      const matchStatus = filtroStatus === 'TODOS' || item.status === filtroStatus;
      return matchCod && matchText && matchStatus;
    });
  }, [contasReceber, filtroCodigo, filtroTexto, filtroStatus]);

  const filteredFornecedores = useMemo(() => {
    return fornecedores.filter(item => {
      const matchCod = !filtroCodigo || item.codigo.toLowerCase().includes(filtroCodigo.toLowerCase());
      const matchText = !filtroTexto || 
        item.razaoSocial.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.nomeFantasia.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.cnpjCpf.includes(filtroTexto);
      return matchCod && matchText;
    });
  }, [fornecedores, filtroCodigo, filtroTexto]);

  const filteredPdv = useMemo(() => {
    return transacoesPdv.filter(item => {
      const matchCod = !filtroCodigo || 
        item.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()) ||
        (item.imovelCodigoReferencia && item.imovelCodigoReferencia.toLowerCase().includes(filtroCodigo.toLowerCase()));
      const matchText = !filtroTexto || 
        item.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.clienteOuPrestador.toLowerCase().includes(filtroTexto.toLowerCase());
      return matchCod && matchText;
    });
  }, [transacoesPdv, filtroCodigo, filtroTexto]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                ERP Financeiro & Controladoria 360°
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Módulo Completo
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Contas a Pagar, Receber, Fornecedores, Folha Salarial, PDV Balcão de Serviços, Dispensas e DRE Contábil
              </p>
            </div>
          </div>
        </div>

        {/* Global Fast Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsModalPdvOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            PDV / Caixa Balcão
          </button>
          <button
            onClick={() => setIsModalPagarOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            + Pagar
          </button>
          <button
            onClick={() => setIsModalReceberOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-100 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/30"
          >
            <TrendingUp className="w-4 h-4" />
            + Receber
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        {[
          { id: 'visao_geral', label: 'Visão Geral & KPIs', icon: PieChart },
          { id: 'contas_pagar', label: 'Contas a Pagar', icon: TrendingDown, badge: contasPagar.filter(c => c.status === 'PENDENTE' || c.status === 'VENCIDO').length },
          { id: 'contas_receber', label: 'Contas a Receber', icon: TrendingUp, badge: contasReceber.filter(c => c.status === 'PENDENTE' || c.status === 'VENCIDO').length },
          { id: 'fornecedores', label: 'Fornecedores & Prestadores', icon: Building, badge: fornecedores.length },
          { id: 'folha_salarial', label: 'Salariais & Pró-Labore', icon: Users, badge: folhaSalarial.length },
          { id: 'pdv_servicos', label: 'PDV Caixa de Balcão', icon: ShoppingBag, badge: transacoesPdv.length },
          { id: 'dispensas', label: 'Dispensas & Isenções', icon: ShieldAlert, badge: dispensas.length },
          { id: 'dre', label: 'DRE Completo (Demonstrativo)', icon: FileSpreadsheet }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FinanceTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {typeof tab.badge === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fast Filter Bar (Available on lists) */}
      {['contas_pagar', 'contas_receber', 'fornecedores', 'pdv_servicos', 'dispensas'].includes(activeTab) && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
          {/* Campo de Código Rápido */}
          <div className="w-full md:w-56 relative">
            <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs"># CÓDIGO</span>
            <input
              type="text"
              value={filtroCodigo}
              onChange={e => setFiltroCodigo(e.target.value)}
              placeholder="Ex: PAG-1001"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-20 pr-3 py-2 text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-hidden focus:border-blue-500"
            />
            {filtroCodigo && (
              <button 
                onClick={() => setFiltroCodigo('')} 
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Campo de Busca por Nome / Descrição */}
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filtroTexto}
              onChange={e => setFiltroTexto(e.target.value)}
              placeholder="Buscar por descrição, cliente, favorecido ou documento..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Filtro de Status */}
          {['contas_pagar', 'contas_receber'].includes(activeTab) && (
            <div className="w-full md:w-44">
              <select
                value={filtroStatus}
                onChange={e => setFiltroStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="PENDENTE">Apenas Pendentes</option>
                <option value="VENCIDO">Apenas Vencidos</option>
                <option value="PAGO">Apenas Pagos / Baixados</option>
                <option value="AGENDADO">Apenas Agendados</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: VISÃO GERAL & KPIS */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>SALDO LÍQUIDO REALIZADO</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <p className={`text-2xl font-extrabold ${saldoLiquidoAtual >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {saldoLiquidoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                Entradas pagas menos saídas quitadas
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>RECEBIMENTOS PREVISTOS</span>
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-extrabold text-blue-400">
                R$ {totalAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {contasReceber.filter(c => c.status === 'PENDENTE').length} títulos pendentes no mês
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>CONTAS A PAGAR PREVISTAS</span>
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <TrendingDown className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-extrabold text-rose-400">
                R$ {totalAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {contasPagar.filter(c => c.status === 'PENDENTE' || c.status === 'VENCIDO').length} contas a liquidar
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>CAIXA RÁPIDO PDV (HOJE)</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-extrabold text-amber-300">
                R$ {(totalPdvEntradas - totalPdvSaidas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                +R$ {totalPdvEntradas.toFixed(2)} entradas / -R$ {totalPdvSaidas.toFixed(2)} despesas
              </p>
            </div>
          </div>

          {/* Quick Action Matrix & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contas a Pagar Urgentes / Próximas */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Próximos Vencimentos a Pagar
                </h3>
                <button 
                  onClick={() => setActiveTab('contas_pagar')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Ver todos
                </button>
              </div>

              <div className="space-y-2.5">
                {contasPagar.slice(0, 4).map(conta => (
                  <div 
                    key={conta.id} 
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-400">
                          {conta.codigo}
                        </span>
                        <p className="text-xs font-semibold text-white max-w-[180px] truncate">{conta.favorecidoNome}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">{conta.descricao}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-400">
                        R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-[10px] font-semibold ${
                        conta.status === 'PAGO' ? 'text-emerald-400' :
                        conta.status === 'VENCIDO' ? 'text-rose-500 font-bold' : 'text-amber-400'
                      }`}>
                        {conta.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contas a Receber Previstas */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Previsão de Recebimentos
                </h3>
                <button 
                  onClick={() => setActiveTab('contas_receber')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Ver todos
                </button>
              </div>

              <div className="space-y-2.5">
                {contasReceber.slice(0, 4).map(conta => (
                  <div 
                    key={conta.id} 
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-400">
                          {conta.codigo}
                        </span>
                        <p className="text-xs font-semibold text-white max-w-[180px] truncate">{conta.clienteNome}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">{conta.descricao}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">
                        R$ {conta.valorPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-[10px] font-semibold ${
                        conta.status === 'PAGO' ? 'text-emerald-400' :
                        conta.status === 'VENCIDO' ? 'text-rose-500' : 'text-blue-400'
                      }`}>
                        {conta.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DRE Sintético do Mês */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                  Resultado Contábil (DRE)
                </h3>
                <button 
                  onClick={() => setActiveTab('dre')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  DRE Detalhado
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Receita Bruta Total:</span>
                  <span className="font-bold text-white">R$ {dreData.receitaBruta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">(-) Deduções e Impostos:</span>
                  <span className="font-semibold text-rose-400">- R$ {dreData.deducoesImpostos.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">(-) Repasses & Comissões:</span>
                  <span className="font-semibold text-amber-400">- R$ {dreData.custosOperacionais.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">(-) Despesas Administrativas/RH:</span>
                  <span className="font-semibold text-rose-400">- R$ {dreData.despesasOperacionais.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-2 pt-3 border-t border-slate-700 bg-emerald-950/30 px-2 rounded-lg">
                  <span className="font-bold text-emerald-300">(=) Lucro Líquido do Mês:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    R$ {dreData.lucroLiquido.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTAS A PAGAR */}
      {activeTab === 'contas_pagar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-400" />
                Contas a Pagar & Despesas Operacionais
              </h2>
              <p className="text-xs text-slate-400">Controle de pagamentos a fornecedores, salários, taxas e tributos</p>
            </div>
            <button
              onClick={() => {
                setEditingContaPagar(null);
                setIsModalPagarOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Novo Título a Pagar
            </button>
          </div>

          <TableScrollContainer hintText="Arraste ou use as setas para visualizar todas as colunas de pagamentos">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Favorecido / Descrição</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Forma</th>
                  <th className="px-4 py-3">Valor (R$)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredContasPagar.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      Nenhuma conta a pagar encontrada para os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredContasPagar.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-300">
                        {item.codigo}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white">{item.favorecidoNome}</p>
                        <p className="text-[11px] text-slate-400">{item.descricao}</p>
                        {item.numeroDocumento && (
                          <span className="text-[10px] text-slate-500 font-mono">Doc: {item.numeroDocumento}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {item.categoria.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {item.dataVencimento}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">
                        {item.formaPagamento}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-rose-400 font-mono text-sm">
                        R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'PAGO' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'VENCIDO'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingContaPagar(item);
                            setIsModalPagarOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                          title="Editar Conta a Pagar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContaPagar(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                          title="Excluir Conta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {item.status !== 'PAGO' && (
                          <button
                            onClick={() => handleBaixarContaPagar(item.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 transition-colors"
                          >
                            Dar Baixa
                          </button>
                        )}
                        {item.status === 'PAGO' && (
                          <button
                            onClick={() => setReciboData({
                              titulo: 'Comprovante de Pagamento de Título',
                              codigoDocumento: item.codigo,
                              dataHora: `${item.dataPagamento || item.dataVencimento} 12:00`,
                              pagadorOuFavorecido: item.favorecidoNome,
                              valor: item.valor,
                              descricao: item.descricao,
                              formaPagamento: item.formaPagamento,
                              operadorOuResponsavel: item.pagoPor || 'Diretoria Financeira',
                              detalhesAdicionais: [
                                { label: 'Centro de Custo', value: item.centroCusto },
                                { label: 'Documento Fiscal', value: item.numeroDocumento || 'S/N' }
                              ]
                            })}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors"
                          >
                            Recibo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableScrollContainer>
        </div>
      )}

      {/* TAB 3: CONTAS A RECEBER */}
      {activeTab === 'contas_receber' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Contas a Receber & Faturamento
              </h2>
              <p className="text-xs text-slate-400">Comissões de vendas, taxas de intermediação, administração de aluguéis e honorários</p>
            </div>
            <button
              onClick={() => {
                setEditingContaReceber(null);
                setIsModalReceberOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Novo Título a Receber
            </button>
          </div>

          <TableScrollContainer hintText="Arraste ou use as setas para visualizar todas as colunas de faturamento">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Cliente / Pagador</th>
                  <th className="px-4 py-3">Origem</th>
                  <th className="px-4 py-3">Imóvel Ref.</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Valor Previsto</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredContasReceber.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      Nenhuma conta a receber encontrada para os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredContasReceber.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-300">
                        {item.codigo}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white">{item.clienteNome}</p>
                        <p className="text-[11px] text-slate-400">{item.descricao}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/50">
                          {item.origem.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300 uppercase">
                        {item.imovelCodigo || '-'}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {item.dataVencimento}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400 font-mono text-sm">
                        R$ {item.valorPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'PAGO' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'VENCIDO'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingContaReceber(item);
                            setIsModalReceberOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                          title="Editar Conta a Receber"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContaReceber(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                          title="Excluir Conta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {item.status !== 'PAGO' && (
                          <button
                            onClick={() => handleBaixarContaReceber(item)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-xs"
                          >
                            Dar Baixa
                          </button>
                        )}
                        {item.status === 'PAGO' && (
                          <button
                            onClick={() => setReciboData({
                              titulo: 'Recibo de Pagamento - Intermediação Imobiliária',
                              codigoDocumento: item.codigo,
                              dataHora: `${item.dataRecebimento || item.dataVencimento} 14:30`,
                              pagadorOuFavorecido: item.clienteNome,
                              valor: item.valorRecebido || item.valorPrevisto,
                              descricao: item.descricao,
                              formaPagamento: item.formaPagamento,
                              operadorOuResponsavel: 'Controladoria Financeira',
                              detalhesAdicionais: [
                                { label: 'Origem', value: item.origem },
                                { label: 'Código do Imóvel', value: item.imovelCodigo || 'N/A' }
                              ]
                            })}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors"
                          >
                            Emitir Recibo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableScrollContainer>
        </div>
      )}

      {/* TAB 4: FORNECEDORES & PRESTADORES */}
      {activeTab === 'fornecedores' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                Fornecedores & Prestadores de Serviços Homologados
              </h2>
              <p className="text-xs text-slate-400">Cartórios, empresas de manutenção, motoboys, assessorias e despachantes</p>
            </div>
            <button
              onClick={() => {
                setEditingFornecedor(null);
                setIsModalFornecedorOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Novo Fornecedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {filteredFornecedores.map(f => (
              <div 
                key={f.id} 
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                      {f.codigo}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-1.5">{f.nomeFantasia}</h3>
                    <p className="text-xs text-slate-400 truncate max-w-[220px]">{f.razaoSocial}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFornecedor(f);
                        setIsModalFornecedorOpen(true);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                      title="Editar Fornecedor"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFornecedor(f.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Excluir Fornecedor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-1">
                      {f.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-400 pt-2 border-t border-slate-800/80">
                  <p><span className="text-slate-500">CNPJ/CPF:</span> <span className="font-mono text-slate-300">{f.cnpjCpf}</span></p>
                  <p><span className="text-slate-500">Contato:</span> {f.telefone} | {f.email}</p>
                  {f.chavePix && (
                    <p className="flex items-center gap-1 truncate">
                      <span className="text-slate-500">PIX ({f.tipoChavePix}):</span> 
                      <span className="font-mono text-emerald-400">{f.chavePix}</span>
                    </p>
                  )}
                  <p><span className="text-slate-500">Cidade/UF:</span> {f.cidade}/{f.estado}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Total Faturado:</span>
                  <span className="text-xs font-bold text-white font-mono">
                    R$ {f.totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FOLHA SALARIAL & PRÓ-LABORE */}
      {activeTab === 'folha_salarial' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Folha Salarial, Benefícios & Pró-Labore dos Sócios
              </h2>
              <p className="text-xs text-slate-400">Controle mensal de salários, adiantamentos do dia 20 e quitação no 5º dia útil</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingLancamentoSalarial(null);
                  setIsModalSalarialOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                Lançar Salário / Pró-Labore
              </button>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 hidden sm:inline">Competência:</span>
                <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  09/2026
                </span>
              </div>
            </div>
          </div>

          <TableScrollContainer hintText="Arraste ou use as setas para visualizar todas as colunas da Folha Salarial">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Colaborador / Cargo</th>
                  <th className="px-4 py-3">Tipo Contrato</th>
                  <th className="px-4 py-3">Salário Base</th>
                  <th className="px-4 py-3">Benefícios</th>
                  <th className="px-4 py-3">Adiantamento</th>
                  <th className="px-4 py-3">Líquido a Pagar</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {folhaSalarial.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-300">
                      {item.codigo}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-white">{item.colaboradorNome}</p>
                      <p className="text-[11px] text-slate-400">{item.cargo} • Depto: {item.departamento}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.tipoContrato.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      R$ {item.salarioBase.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      R$ {item.beneficios.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-rose-400">
                      - R$ {item.adiantamento.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-400 text-sm">
                      R$ {item.valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'PAGO' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingLancamentoSalarial(item);
                          setIsModalSalarialOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                        title="Editar Salário / Pró-Labore"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLancamentoSalarial(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                        title="Excluir Lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {item.status !== 'PAGO' ? (
                        <button
                          onClick={() => handlePagarSalario(item.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                        >
                          Pagar Salário
                        </button>
                      ) : (
                        <button
                          onClick={() => setReciboData({
                            titulo: 'Comprovante de Holerite / Pagamento Salarial',
                            codigoDocumento: item.codigo,
                            dataHora: `${item.dataPagamento || item.dataPrevista} 08:00`,
                            pagadorOuFavorecido: item.colaboradorNome,
                            valor: item.valorLiquido,
                            descricao: `Salário Líquido Ref. ${item.mesReferencia} - Cargo: ${item.cargo}`,
                            formaPagamento: 'PIX / TED',
                            operadorOuResponsavel: 'Recursos Humanos & Diretoria',
                            detalhesAdicionais: [
                              { label: 'Salário Base', value: `R$ ${item.salarioBase.toFixed(2)}` },
                              { label: 'Adiantamento Quitado', value: `R$ ${item.adiantamento.toFixed(2)}` },
                              { label: 'Chave PIX', value: item.chavePix || 'Cadastrada em Conta' }
                            ]
                          })}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                        >
                          Holerite
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScrollContainer>
        </div>
      )}

      {/* TAB 6: PDV CAIXA DE BALCÃO DE SERVIÇOS */}
      {activeTab === 'pdv_servicos' && (
        <div className="space-y-6">
          {/* Top PDV Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Frente de Caixa Rápido</span>
              <h2 className="text-xl font-bold text-white mt-0.5">PDV Balcão de Serviços & Despesas Imediatas</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Lançamento instantâneo de certidões vintenárias/RGI, despachos na prefeitura, honorários jurídicos, 
                serviços de chaveiro/eletricista, deslocamentos/motoboy e emolumentos.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingPdv(null);
                  setIsModalPdvOpen(true);
                }}
                className="px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                Novo Lançamento no Balcão
              </button>
            </div>
          </div>

          {/* Grid de Movimentações PDV */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Livro Caixa Diário do PDV</h3>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-emerald-400">Total Entradas: R$ {totalPdvEntradas.toFixed(2)}</span>
                <span className="text-rose-400">Total Saídas: R$ {totalPdvSaidas.toFixed(2)}</span>
                <span className="text-amber-300 font-bold">Saldo Caixa: R$ {(totalPdvEntradas - totalPdvSaidas).toFixed(2)}</span>
              </div>
            </div>

            <TableScrollContainer hintText="Arraste ou use as setas para visualizar todas as transações de PDV">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Serviço / Finalidade</th>
                    <th className="px-4 py-3">Cliente / Prestador</th>
                    <th className="px-4 py-3">Imóvel Ref.</th>
                    <th className="px-4 py-3">Data / Hora</th>
                    <th className="px-4 py-3">Forma</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPdv.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-300">{item.codigo}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-max ${
                          item.tipo === 'ENTRADA' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {item.tipo === 'ENTRADA' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {item.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{item.descricao}</p>
                        <span className="text-[10px] text-amber-300 font-mono">
                          {item.tipoServico.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-medium">{item.clienteOuPrestador}</td>
                      <td className="px-4 py-3 font-mono text-slate-400 uppercase">{item.imovelCodigoReferencia || '-'}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{item.dataHora}</td>
                      <td className="px-4 py-3 text-slate-300">{item.formaPagamento}</td>
                      <td className={`px-4 py-3 font-mono font-bold text-sm ${
                        item.tipo === 'ENTRADA' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {item.tipo === 'ENTRADA' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingPdv(item);
                            setIsModalPdvOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                          title="Editar Lançamento PDV"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePdv(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                          title="Estornar / Excluir Lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setReciboData({
                            titulo: item.tipo === 'ENTRADA' ? 'Comprovante PDV de Entrada' : 'Comprovante PDV de Pagamento',
                            codigoDocumento: item.codigo,
                            dataHora: item.dataHora,
                            pagadorOuFavorecido: item.clienteOuPrestador,
                            valor: item.valor,
                            descricao: item.descricao,
                            formaPagamento: item.formaPagamento,
                            operadorOuResponsavel: item.operadorCaixa,
                            detalhesAdicionais: [
                              { label: 'Serviço', value: item.tipoServico },
                              { label: 'Imóvel Referência', value: item.imovelCodigoReferencia || 'N/A' },
                              { label: 'Protocolo', value: item.processoNumero || 'N/A' }
                            ]
                          })}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                        >
                          Recibo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScrollContainer>
          </div>
        </div>
      )}

      {/* TAB 7: DISPENSAS & ISENÇÕES */}
      {activeTab === 'dispensas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
                Dispensas, Isenções & Abonos Financeiros
              </h2>
              <p className="text-xs text-slate-400">Auditoria de multas moratórias, juros e taxas administrativas perdoadas pela diretoria</p>
            </div>
            <button
              onClick={() => {
                setEditingDispensa(null);
                setIsModalDispensaOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Registrar Dispensa
            </button>
          </div>

          <TableScrollContainer hintText="Arraste ou use as setas para visualizar todas as dispensas financeiras">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Tipo Dispensa</th>
                  <th className="px-4 py-3">Beneficiário</th>
                  <th className="px-4 py-3">Imóvel / Contrato</th>
                  <th className="px-4 py-3">Valor Original</th>
                  <th className="px-4 py-3">Valor Dispensado</th>
                  <th className="px-4 py-3">Cobrado</th>
                  <th className="px-4 py-3">Justificativa</th>
                  <th className="px-4 py-3">Aprovador</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dispensas.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-300">{d.codigo}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-950/50 text-purple-300 border border-purple-800/60">
                        {d.tipoDispensa.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-white">{d.beneficiarioNome}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      {d.imovelCodigo || d.contratoCodigo || '-'}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      R$ {d.valorOriginal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-rose-400">
                      - R$ {d.valorDispensado.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">
                      R$ {d.valorFinalCobrado.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs text-slate-300 truncate" title={d.motivoJustificativa}>
                      {d.motivoJustificativa}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 font-medium">{d.aprovadorNome}</td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingDispensa(d);
                          setIsModalDispensaOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                        title="Editar Dispensa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDispensa(d.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                        title="Excluir Dispensa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScrollContainer>
        </div>
      )}

      {/* TAB 8: DRE COMPLETO */}
      {activeTab === 'dre' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">
                  Demonstrativo do Resultado do Exercício (DRE Contábil)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Estrutura oficial padrão contábil com apuração de Receita Bruta, Deduções, CPV, EBITDA e Lucro Líquido
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 font-bold border border-slate-800 text-xs">
                Período: {dreData.periodo}
              </span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
              >
                <Printer className="w-4 h-4" />
                Imprimir Relatório
              </button>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* 1. Receita Operacional Bruta */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between font-bold text-sm text-emerald-400">
                <span>{dreData.receitaBruta.descricao}</span>
                <span>R$ {dreData.receitaBruta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dreData.receitaBruta.percentual}%)</span>
              </div>
              {dreData.receitaBruta.subItens && (
                <div className="mt-2.5 space-y-1.5 pl-4 border-l-2 border-emerald-500/30 text-slate-400">
                  {dreData.receitaBruta.subItens.map((sub, i) => (
                    <div key={i} className="flex justify-between">
                      <span>• {sub.descricao}</span>
                      <span>R$ {sub.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({sub.percentual}%)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Deduções e Impostos */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between font-bold text-sm text-rose-400">
                <span>{dreData.deducoesImpostos.descricao}</span>
                <span>- R$ {dreData.deducoesImpostos.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dreData.deducoesImpostos.percentual}%)</span>
              </div>
              {dreData.deducoesImpostos.subItens && (
                <div className="mt-2.5 space-y-1.5 pl-4 border-l-2 border-rose-500/30 text-slate-400">
                  {dreData.deducoesImpostos.subItens.map((sub, i) => (
                    <div key={i} className="flex justify-between">
                      <span>• {sub.descricao}</span>
                      <span>- R$ {sub.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({sub.percentual}%)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Receita Operacional Líquida */}
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-800/40">
              <div className="flex justify-between font-extrabold text-sm text-emerald-300">
                <span>{dreData.receitaLiquida.descricao}</span>
                <span>R$ {dreData.receitaLiquida.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dreData.receitaLiquida.percentual}%)</span>
              </div>
            </div>

            {/* 4. Custos Operacionais & Repasses */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between font-bold text-sm text-amber-400">
                <span>{dreData.custosOperacionais.descricao}</span>
                <span>- R$ {dreData.custosOperacionais.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dreData.custosOperacionais.percentual}%)</span>
              </div>
              {dreData.custosOperacionais.subItens && (
                <div className="mt-2.5 space-y-1.5 pl-4 border-l-2 border-amber-500/30 text-slate-400">
                  {dreData.custosOperacionais.subItens.map((sub, i) => (
                    <div key={i} className="flex justify-between">
                      <span>• {sub.descricao}</span>
                      <span>- R$ {sub.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({sub.percentual}%)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Lucro Bruto */}
            <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-800/40">
              <div className="flex justify-between font-extrabold text-sm text-blue-300">
                <span>{dreData.lucroBruto.descricao}</span>
                <span>R$ {dreData.lucroBruto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dreData.lucroBruto.percentual}%)</span>
              </div>
            </div>

            {/* 6. Despesas Operacionais Gerais */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between font-bold text-sm text-rose-400">
                <span>{dreData.despesasOperacionais.descricao}</span>
                <span>- R$ {dreData.despesasOperacionais.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dreData.despesasOperacionais.percentual}%)</span>
              </div>
              {dreData.despesasOperacionais.subItens && (
                <div className="mt-2.5 space-y-1.5 pl-4 border-l-2 border-rose-500/30 text-slate-400">
                  {dreData.despesasOperacionais.subItens.map((sub, i) => (
                    <div key={i} className="flex justify-between">
                      <span>• {sub.descricao}</span>
                      <span>- R$ {sub.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({sub.percentual}%)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. EBITDA */}
            <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-800/40">
              <div className="flex justify-between font-extrabold text-sm text-purple-300">
                <span>{dreData.ebitda.descricao}</span>
                <span>R$ {dreData.ebitda.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dreData.ebitda.percentual}%)</span>
              </div>
            </div>

            {/* 10. Lucro Líquido do Exercício */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 p-5 rounded-2xl border-2 border-emerald-500/50 shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Resultado Final Líquido</span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{dreData.lucroLiquido.descricao}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-300">
                    R$ {dreData.lucroLiquido.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-emerald-400 font-bold mt-0.5">
                    Margem Líquida: {dreData.lucroLiquido.percentual}% da Receita Bruta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <NovaContaPagarModal
        isOpen={isModalPagarOpen}
        onClose={() => {
          setIsModalPagarOpen(false);
          setEditingContaPagar(null);
        }}
        onSave={handleSaveContaPagar}
        fornecedores={fornecedores}
        initialData={editingContaPagar}
      />

      <NovaContaReceberModal
        isOpen={isModalReceberOpen}
        onClose={() => {
          setIsModalReceberOpen(false);
          setEditingContaReceber(null);
        }}
        onSave={handleSaveContaReceber}
        initialData={editingContaReceber}
      />

      <NovoFornecedorModal
        isOpen={isModalFornecedorOpen}
        onClose={() => {
          setIsModalFornecedorOpen(false);
          setEditingFornecedor(null);
        }}
        onSave={handleSaveFornecedor}
        initialData={editingFornecedor}
      />

      <NovoLancamentoSalarialModal
        isOpen={isModalSalarialOpen}
        onClose={() => {
          setIsModalSalarialOpen(false);
          setEditingLancamentoSalarial(null);
        }}
        onSave={handleSaveLancamentoSalarial}
        initialData={editingLancamentoSalarial}
      />

      <NovoLancamentoPdvModal
        isOpen={isModalPdvOpen}
        onClose={() => {
          setIsModalPdvOpen(false);
          setEditingPdv(null);
        }}
        onSave={handleSavePdv}
        initialData={editingPdv}
      />

      <NovaDispensaModal
        isOpen={isModalDispensaOpen}
        onClose={() => {
          setIsModalDispensaOpen(false);
          setEditingDispensa(null);
        }}
        onSave={handleSaveDispensa}
        initialData={editingDispensa}
      />

      {reciboData && (
        <ReciboComprovanteModal
          isOpen={true}
          onClose={() => setReciboData(null)}
          {...reciboData}
        />
      )}
    </div>
  );
};

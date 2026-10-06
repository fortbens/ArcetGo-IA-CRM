import React, { useState, useMemo } from 'react';
import { 
  FileSignature, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Home, 
  User, 
  Share2, 
  Printer, 
  Eye, 
  ChevronRight, 
  Percent, 
  Building,
  Check,
  X,
  ArrowRight,
  MessageSquare,
  Lock,
  ShieldAlert,
  Download,
  FileDown,
  Loader2
} from 'lucide-react';
import { 
  RealEstateProperty, 
  Lead, 
  Owner,
  UserProfile,
  AgencyGovernanceRules,
  DEFAULT_AGENCY_GOVERNANCE_RULES
} from '../../types/crm';
import { PropostaVenda, StatusProposta } from '../../types/salesProposal';
import { MOCK_PROPOSTAS_VENDA } from '../../data/mockSalesProposalsData';
import { NewProposalWizardModal } from './NewProposalWizardModal';
import { ProposalDocumentPreviewModal } from './ProposalDocumentPreviewModal';
import { downloadProposalPdf } from '../../utils/salesProposalPdfGenerator';

interface SalesProposalsViewProps {
  properties: RealEstateProperty[];
  leads: Lead[];
  owners: Owner[];
  currentUser?: UserProfile;
  governanceRules?: AgencyGovernanceRules;
}

export const SalesProposalsView: React.FC<SalesProposalsViewProps> = ({
  properties,
  leads,
  owners,
  currentUser,
  governanceRules = DEFAULT_AGENCY_GOVERNANCE_RULES,
}) => {
  const [propostas, setPropostas] = useState<PropostaVenda[]>(MOCK_PROPOSTAS_VENDA);
  
  // Filters
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedProposalForDoc, setSelectedProposalForDoc] = useState<PropostaVenda | null>(null);

  // PDF Direct Export State
  const [downloadingProposalId, setDownloadingProposalId] = useState<string | null>(null);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);

  const handleExportPdfDirect = (proposal: PropostaVenda, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDownloadingProposalId(proposal.id);
    try {
      downloadProposalPdf(proposal);
      setPdfNotification(`PDF da proposta ${proposal.codigo} gerado e baixado com sucesso!`);
      setTimeout(() => setPdfNotification(null), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF da proposta:', err);
    } finally {
      setDownloadingProposalId(null);
    }
  };

  // KPIs
  const totalVolumePropostas = useMemo(() => {
    return propostas.reduce((acc, curr) => acc + curr.condicoes.valorProposto, 0);
  }, [propostas]);

  const totalComissoesEmNegociacao = useMemo(() => {
    return propostas
      .filter(p => p.status === 'ENCAMINHADA_VENDEDOR' || p.status === 'CONTRAPROPOSTA')
      .reduce((acc, curr) => acc + curr.comissao.valorComissaoTotal, 0);
  }, [propostas]);

  const propostasEmAnaliseCount = useMemo(() => {
    return propostas.filter(p => p.status === 'ENCAMINHADA_VENDEDOR').length;
  }, [propostas]);

  const propostasFechadasCount = useMemo(() => {
    return propostas.filter(p => p.status === 'ACEITA_VENDIDO').length;
  }, [propostas]);

  // Handlers
  const handleSaveProposal = (nova: PropostaVenda) => {
    setPropostas(prev => [nova, ...prev]);
    // Abre automaticamente a minuta gerada
    setSelectedProposalForDoc(nova);
  };

  // Helper de governança da imobiliária
  const checkProposalAccess = (proposal: PropostaVenda) => {
    if (!currentUser) return { allowed: true, hideValues: false };
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MASTER_ADMIN' || currentUser.role === 'MANAGER') {
      return { allowed: true, hideValues: false };
    }
    if (governanceRules.proposalAccessLevel === 'SOMENTE_GERENCIA_DIRETORIA') {
      return { 
        allowed: false, 
        hideValues: true, 
        reason: 'Acesso restrito à Gerência e Diretoria conforme as regras de governança da imobiliária.' 
      };
    }
    if (governanceRules.proposalAccessLevel === 'EQUIPE_COMPLETA') {
      return { 
        allowed: true, 
        hideValues: governanceRules.hideFinancialValuesFromOtherBrokers && proposal.corretorResponsavelId !== currentUser.id 
      };
    }
    // PROPOSICAO_GERENCIA_DIRETORIA
    const isOwn = (proposal.corretorResponsavelId && proposal.corretorResponsavelId === currentUser.id) || 
      (proposal.corretorResponsavelNome && proposal.corretorResponsavelNome.toLowerCase() === currentUser.name.toLowerCase());
    if (isOwn) {
      return { allowed: true, hideValues: false };
    }
    return { 
      allowed: false, 
      hideValues: true, 
      reason: 'Proposta visível apenas ao corretor responsável e à gerência.' 
    };
  };

  const handleRegisterDecision = (
    proposalId: string, 
    decision: 'ACEITO' | 'CONTRAPROPOSTA' | 'RECUSADO', 
    parecer: string, 
    valorContra?: number
  ) => {
    setPropostas(prev => prev.map(p => {
      if (p.id === proposalId) {
        let newStatus: StatusProposta = 'ENCAMINHADA_VENDEDOR';
        if (decision === 'ACEITO') newStatus = 'ACEITA_VENDIDO';
        if (decision === 'CONTRAPROPOSTA') newStatus = 'CONTRAPROPOSTA';
        if (decision === 'RECUSADO') newStatus = 'RECUSADA';

        return {
          ...p,
          status: newStatus,
          dataUltimaAtualizacao: new Date().toISOString().replace('T', ' ').substring(0, 16),
          historicoAceite: {
            decisaoVendedor: decision,
            dataDecisao: new Date().toLocaleString('pt-BR'),
            parecerVendedor: parecer || undefined,
            valorContraproposta: valorContra || undefined
          }
        };
      }
      return p;
    }));

    // Update selected in preview if currently viewed
    if (selectedProposalForDoc && selectedProposalForDoc.id === proposalId) {
      setSelectedProposalForDoc(prev => {
        if (!prev) return null;
        let newStatus: StatusProposta = 'ENCAMINHADA_VENDEDOR';
        if (decision === 'ACEITO') newStatus = 'ACEITA_VENDIDO';
        if (decision === 'CONTRAPROPOSTA') newStatus = 'CONTRAPROPOSTA';
        if (decision === 'RECUSADO') newStatus = 'RECUSADA';
        return {
          ...prev,
          status: newStatus,
          historicoAceite: {
            decisaoVendedor: decision,
            dataDecisao: new Date().toLocaleString('pt-BR'),
            parecerVendedor: parecer || undefined,
            valorContraproposta: valorContra || undefined
          }
        };
      });
    }
  };

  // Filtered List
  const filteredPropostas = useMemo(() => {
    return propostas.filter(item => {
      const matchCod = !filtroCodigo || 
        item.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()) ||
        item.imovelCodigo.toLowerCase().includes(filtroCodigo.toLowerCase());
      
      const matchText = !filtroTexto || 
        item.compradorNome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.vendedorNome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.imovelTitulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.imovelEndereco.toLowerCase().includes(filtroTexto.toLowerCase());

      const matchStatus = filtroStatus === 'TODOS' || item.status === filtroStatus;

      return matchCod && matchText && matchStatus;
    });
  }, [propostas, filtroCodigo, filtroTexto, filtroStatus]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Módulo de Vendas & Propostas Imobiliárias
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  Fechamento Ágil
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Seleção de imóvel e cliente, engenharia financeira de pagamento, cálculo de comissões e emissão da minuta formal ao vendedor
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Proposta de Compra
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>VOLUME TOTAL EM PROPOSTAS</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-blue-400">
            R$ {totalVolumePropostas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {propostas.length} negociações formalizadas
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>EM ANÁLISE DO VENDEDOR</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-amber-400">
            {propostasEmAnaliseCount} propostas
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Aguardando resposta do proprietário
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>COMISSÕES EM NEGOCIAÇÃO</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">
            R$ {totalComissoesEmNegociacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Comissões a receber se aprovadas
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>VENDAS FECHADAS (ACEITAS)</span>
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-teal-300">
            {propostasFechadasCount} negócios
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Convertidas em contrato de compra e venda
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Quick Code Input */}
        <div className="w-full md:w-60 relative">
          <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs"># CÓDIGO</span>
          <input
            type="text"
            value={filtroCodigo}
            onChange={e => setFiltroCodigo(e.target.value)}
            placeholder="Ex: PROP-2026-101"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-20 pr-3 py-2 text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-hidden focus:border-blue-500"
          />
          {filtroCodigo && (
            <button onClick={() => setFiltroCodigo('')} className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Text Search */}
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filtroTexto}
            onChange={e => setFiltroTexto(e.target.value)}
            placeholder="Buscar por comprador, vendedor, imóvel ou condomínio..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-52">
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ENCAMINHADA_VENDEDOR">Em Análise do Vendedor</option>
            <option value="CONTRAPROPOSTA">Contraproposta</option>
            <option value="ACEITA_VENDIDO">Aceita / Vendido</option>
            <option value="RECUSADA">Recusada</option>
          </select>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              Propostas de Compra Registradas
            </h2>
            <p className="text-xs text-slate-400">Minutas, condições de pagamento e respostas dos vendedores</p>
          </div>
          <span className="text-xs text-slate-400">
            Mostrando <strong>{filteredPropostas.length}</strong> de {propostas.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Imóvel & Localização</th>
                <th className="px-4 py-3">Proponente (Comprador)</th>
                <th className="px-4 py-3">Vendedor</th>
                <th className="px-4 py-3">Valor Proposto</th>
                <th className="px-4 py-3">Sinal (Arras)</th>
                <th className="px-4 py-3">Comissão (R$)</th>
                <th className="px-4 py-3">Status / Decisão</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPropostas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                    Nenhuma proposta encontrada com os filtros informados.
                  </td>
                </tr>
              ) : (
                filteredPropostas.map(p => {
                  const access = checkProposalAccess(p);

                  return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-400">
                      {p.codigo}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <img src={p.imovelFotoUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">[{p.imovelCodigo}]</span>
                          <p className="font-semibold text-white truncate max-w-[200px]">{p.imovelTitulo}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{p.imovelEndereco}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-white">{p.compradorNome}</p>
                      <p className="text-[11px] text-slate-400">{p.compradorTelefone}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-300">{p.vendedorNome}</p>
                      <p className="text-[11px] text-slate-400">{p.vendedorTelefone}</p>
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-400 text-sm">
                      {access.hideValues ? (
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-sans">
                          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>R$ ••••••• (Sigilo)</span>
                        </div>
                      ) : (
                        <>
                          R$ {p.condicoes.valorProposto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          {p.condicoes.descontoOuAcrescimo !== 0 && (
                            <span className={`block text-[10px] ${p.condicoes.descontoOuAcrescimo < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {p.condicoes.descontoOuAcrescimo.toFixed(1)}% vs pedido
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {access.hideValues ? (
                        <span className="text-slate-500 text-xs font-mono">••••••••</span>
                      ) : (
                        <>
                          R$ {p.condicoes.valorSinalEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          <span className="block text-[10px] text-slate-500 font-sans">{p.condicoes.formaSinal}</span>
                        </>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {access.hideValues ? (
                        <span className="text-slate-500 text-xs font-mono">••••••••</span>
                      ) : (
                        <>
                          R$ {p.comissao.valorComissaoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          <span className="block text-[10px] text-slate-500 font-sans">{p.comissao.percentualComissao}% ({p.comissao.formaCobranca === 'RETIDA_SINAL' ? 'Sinal' : 'Vendedor'})</span>
                        </>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                        p.status === 'ACEITA_VENDIDO'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'CONTRAPROPOSTA'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : p.status === 'RECUSADA'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {p.status.replace('_', ' ')}
                      </span>
                      {p.historicoAceite?.dataDecisao && (
                        <span className="block text-[10px] text-slate-500 mt-0.5">{p.historicoAceite.dataDecisao}</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleExportPdfDirect(p, e)}
                          disabled={downloadingProposalId === p.id}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 hover:border-emerald-500 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                          title="Gerar e Baixar PDF Oficial da Proposta"
                        >
                          {downloadingProposalId === p.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                          ) : (
                            <FileDown className="w-3.5 h-3.5" />
                          )}
                          <span>Gerar PDF</span>
                        </button>

                        <button
                          onClick={() => setSelectedProposalForDoc(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs cursor-pointer active:scale-95"
                          title="Visualizar Minuta, Enviar WhatsApp ou Tomar Decisão"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Minuta</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Proposal Wizard */}
      <NewProposalWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        properties={properties}
        leads={leads}
        owners={owners}
        onSaveProposal={handleSaveProposal}
      />

      {/* Modal: Document Preview & Actions */}
      <ProposalDocumentPreviewModal
        isOpen={!!selectedProposalForDoc}
        onClose={() => setSelectedProposalForDoc(null)}
        proposal={selectedProposalForDoc}
        onRegisterDecision={handleRegisterDecision}
      />

      {/* Toast Feedback: Geração de PDF Concluída */}
      {pdfNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Documento PDF Gerado</p>
            <p className="text-xs text-emerald-400">{pdfNotification}</p>
          </div>
          <button 
            onClick={() => setPdfNotification(null)} 
            className="ml-2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

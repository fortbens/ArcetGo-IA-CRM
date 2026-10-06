import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  FileText, 
  Download, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Share2, 
  DollarSign, 
  RefreshCw, 
  Check, 
  X, 
  ChevronRight, 
  Building, 
  User, 
  SlidersHorizontal,
  KeyRound,
  FileCheck
} from 'lucide-react';

export type AmbienteNfse = 'HOMOLOGACAO' | 'PRODUCAO';
export type TipoServicoNfse = 
  | 'COMISSAO_VENDA'
  | 'INTERMEDIACAO_LOCACAO'
  | 'ADMINISTRACAO_LOCACAO_MENSAL'
  | 'SERVICO_AVULSO_AVALIACAO';

export interface NotaFiscalNfse {
  id: string;
  numeroRps: string;
  serieRps: string;
  numeroNfse?: string;
  codigoVerificacao?: string;
  dataEmissao: string;
  ambiente: AmbienteNfse;
  tipoServico: TipoServicoNfse;
  
  // Tomador (Cliente / Pagador)
  tomadorNome: string;
  tomadorCpfCnpj: string;
  tomadorEmail: string;
  tomadorEndereco: string;
  
  // Detalhamento do Serviço
  discriminacaoServico: string;
  imovelCodigo?: string;
  valorServicos: number;
  valorDeducoes: number;
  baseCalculo: number;
  aliquotaIss: number; // ex: 2.0%
  valorIss: number;
  issRetido: boolean;
  
  // Retenções Federais (se PJ)
  valorPis?: number;
  valorCofins?: number;
  valorInss?: number;
  valorIrrf?: number;
  valorCsll?: number;
  valorLiquidoNfse: number;
  
  status: 'AUTORIZADA' | 'HOMOLOGADA_TESTE' | 'PENDENTE_ENVIO' | 'CANCELADA';
  linkDanfsePrefeitura?: string;
}

export const NfseHomologacaoView: React.FC = () => {
  // Configurações do Ambiente & Prefeitura
  const [ambiente, setAmbiente] = useState<AmbienteNfse>('HOMOLOGACAO');
  const [padraoPrefeitura, setPadraoPrefeitura] = useState('ABRASF_V204');
  const [municipio, setMunicipio] = useState('São Paulo / SP');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('8.452.910-1');
  const [cnaePrincipal, setCnaePrincipal] = useState('6821-8/01 - Corretagem na compra e venda e avaliação de imóveis');
  const [itemLc116, setItemLc116] = useState('10.05 - Agenciamento, corretagem ou intermediação de bens imóveis');
  const [aliquotaIssPadrao, setAliquotaIssPadrao] = useState('2.0');
  const [regimeTributario, setRegimeTributario] = useState('SIMPLES_NACIONAL');
  const [serieRps, setSerieRps] = useState('RPS-1');
  const [proximoNumeroRps, setProximoNumeroRps] = useState(148);

  // Certificado Digital A1
  const [certificadoValido, setCertificadoValido] = useState(true);
  const [certificadoValidade, setCertificadoValidade] = useState('28/08/2027 (Válido por 334 dias)');

  // Modal de Emissão
  const [showNovaNotaModal, setShowNovaNotaModal] = useState(false);
  const [selectedNotaParaDanfse, setSelectedNotaParaDanfse] = useState<NotaFiscalNfse | null>(null);

  // Form de Nova Nota
  const [novoTipoServico, setNovoTipoServico] = useState<TipoServicoNfse>('COMISSAO_VENDA');
  const [novoTomadorNome, setNovoTomadorNome] = useState('');
  const [novoTomadorCpfCnpj, setNovoTomadorCpfCnpj] = useState('');
  const [novoTomadorEmail, setNovoTomadorEmail] = useState('');
  const [novoTomadorEndereco, setNovoTomadorEndereco] = useState('São Paulo / SP');
  const [novoImovelCodigo, setNovoImovelCodigo] = useState('');
  const [novoValorServicos, setNovoValorServicos] = useState('');
  const [novaDiscriminacao, setNovaDiscriminacao] = useState('');

  // Mock de Notas Emitidas
  const [notas, setNotas] = useState<NotaFiscalNfse[]>([
    {
      id: 'nfe-001',
      numeroRps: '00145',
      serieRps: 'RPS-1',
      numeroNfse: '2026000000892',
      codigoVerificacao: 'A7F9-K2L1',
      dataEmissao: '2026-09-27 15:40',
      ambiente: 'PRODUCAO',
      tipoServico: 'COMISSAO_VENDA',
      tomadorNome: 'Cyrela Brazil Realty S.A.',
      tomadorCpfCnpj: '73.178.600/0001-18',
      tomadorEmail: 'faturamento@cyrela.com.br',
      tomadorEndereco: 'Rua do Rocio, 109 - Vila Olímpia, São Paulo/SP',
      discriminacaoServico: 'Prestação de serviços de corretagem e intermediação imobiliária na venda da unidade 142 do Empreendimento Residencial Figueira. Imóvel código AP-PIN-044.',
      imovelCodigo: 'AP-PIN-044',
      valorServicos: 72000.00,
      valorDeducoes: 0,
      baseCalculo: 72000.00,
      aliquotaIss: 2.0,
      valorIss: 1440.00,
      issRetido: false,
      valorLiquidoNfse: 72000.00,
      status: 'AUTORIZADA'
    },
    {
      id: 'nfe-002',
      numeroRps: '00146',
      serieRps: 'RPS-1',
      numeroNfse: '2026000000893',
      codigoVerificacao: 'B3X8-99P0',
      dataEmissao: '2026-09-28 09:15',
      ambiente: 'PRODUCAO',
      tipoServico: 'INTERMEDIACAO_LOCACAO',
      tomadorNome: 'Roberto Justus Alcantara',
      tomadorCpfCnpj: '123.456.789-00',
      tomadorEmail: 'roberto.justus@empresa.com.br',
      tomadorEndereco: 'Alameda Gabriel Monteiro da Silva, 2200 - Jardim América, São Paulo/SP',
      discriminacaoServico: 'Taxa de intermediação e captação imobiliária referente ao 1º aluguel do Contrato de Locação Residencial CTR-LOC-2026-101.',
      imovelCodigo: 'COB-VM-012',
      valorServicos: 14000.00,
      valorDeducoes: 0,
      baseCalculo: 14000.00,
      aliquotaIss: 2.0,
      valorIss: 280.00,
      issRetido: false,
      valorLiquidoNfse: 14000.00,
      status: 'AUTORIZADA'
    },
    {
      id: 'nfe-003',
      numeroRps: '00147',
      serieRps: 'RPS-1',
      numeroNfse: 'TESTE-HOMOL-00147',
      codigoVerificacao: 'HOM-7788-OK',
      dataEmissao: '2026-09-28 11:20',
      ambiente: 'HOMOLOGACAO',
      tipoServico: 'ADMINISTRACAO_LOCACAO_MENSAL',
      tomadorNome: 'Dr. Sergio Mattos (Pool de Locadores)',
      tomadorCpfCnpj: '234.567.890-11',
      tomadorEmail: 'sergio.mattos@uol.com.br',
      tomadorEndereco: 'Av. Paulista, 1500 - Bela Vista, São Paulo/SP',
      discriminacaoServico: '[HOMOLOGAÇÃO PREFEITURA] Taxa de administração de locação referente à gestão mensal de 10% da carteira de imóveis.',
      valorServicos: 3840.00,
      valorDeducoes: 0,
      baseCalculo: 3840.00,
      aliquotaIss: 2.0,
      valorIss: 76.80,
      issRetido: false,
      valorLiquidoNfse: 3840.00,
      status: 'HOMOLOGADA_TESTE'
    }
  ]);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');

  // Métricas
  const totalFaturadoAutorizado = useMemo(() => {
    return notas
      .filter(n => n.status === 'AUTORIZADA')
      .reduce((acc, curr) => acc + curr.valorServicos, 0);
  }, [notas]);

  const totalIssRecolhido = useMemo(() => {
    return notas
      .filter(n => n.status === 'AUTORIZADA')
      .reduce((acc, curr) => acc + curr.valorIss, 0);
  }, [notas]);

  const handleEmitirNota = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(novoValorServicos.replace(',', '.')) || 0;
    if (!novoTomadorNome || !novoTomadorCpfCnpj || val <= 0) return;

    const rpsNum = proximoNumeroRps.toString().padStart(5, '0');
    const aliq = parseFloat(aliquotaIssPadrao) || 2.0;
    const iss = (val * aliq) / 100;
    const isHomol = ambiente === 'HOMOLOGACAO';

    const novaNota: NotaFiscalNfse = {
      id: `nfe-${Date.now()}`,
      numeroRps: rpsNum,
      serieRps,
      numeroNfse: isHomol ? `TESTE-HOMOL-${rpsNum}` : `2026000000${proximoNumeroRps + 740}`,
      codigoVerificacao: isHomol ? `HOM-${Math.random().toString(36).substring(2, 6).toUpperCase()}` : `AUT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      dataEmissao: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ambiente,
      tipoServico: novoTipoServico,
      tomadorNome: novoTomadorNome,
      tomadorCpfCnpj: novoTomadorCpfCnpj,
      tomadorEmail: novoTomadorEmail || 'contato@cliente.com.br',
      tomadorEndereco: novoTomadorEndereco,
      imovelCodigo: novoImovelCodigo || undefined,
      discriminacaoServico: novaDiscriminacao || `Prestação de serviços de intermediação imobiliária / administração referente ao contrato.`,
      valorServicos: val,
      valorDeducoes: 0,
      baseCalculo: val,
      aliquotaIss: aliq,
      valorIss: iss,
      issRetido: false,
      valorLiquidoNfse: val,
      status: isHomol ? 'HOMOLOGADA_TESTE' : 'AUTORIZADA'
    };

    setNotas(prev => [novaNota, ...prev]);
    setProximoNumeroRps(prev => prev + 1);
    setShowNovaNotaModal(false);
    setSelectedNotaParaDanfse(novaNota);
  };

  const filteredNotas = useMemo(() => {
    return notas.filter(n => {
      const matchText = !filtroTexto || 
        n.tomadorNome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        n.tomadorCpfCnpj.includes(filtroTexto) ||
        (n.numeroNfse && n.numeroNfse.includes(filtroTexto)) ||
        n.numeroRps.includes(filtroTexto);
      const matchTipo = filtroTipo === 'TODOS' || n.tipoServico === filtroTipo;
      return matchText && matchTipo;
    });
  }, [notas, filtroTexto, filtroTipo]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner de Emissão e Homologação */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
              ambiente === 'HOMOLOGACAO' 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              Ambiente: {ambiente}
            </span>
            <span className="text-xs text-slate-400">• Padrão {padraoPrefeitura} (Prefeitura de {municipio})</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Central de Emissão de NFS-e & Homologação Municipal</h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Emissão eletrônica de notas fiscais de comissão de vendas, intermediação de locação, administração de carteira e serviços avulsos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Alternador de Ambiente */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setAmbiente('HOMOLOGACAO')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                ambiente === 'HOMOLOGACAO' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Homologação (Testes)
            </button>
            <button
              onClick={() => setAmbiente('PRODUCAO')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                ambiente === 'PRODUCAO' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Produção (Oficial)
            </button>
          </div>

          <button
            onClick={() => setShowNovaNotaModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-900/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            Emitir NFS-e
          </button>
        </div>
      </div>

      {/* Status da Conexão / Certificado Digital */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Certificado Digital ICP-Brasil</span>
            <p className="text-xs font-bold text-white mt-0.5">Certificado A1 (.PFX)</p>
            <p className="text-[11px] text-emerald-400 font-medium">✓ {certificadoValidade}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">WebService da Prefeitura</span>
            <p className="text-xs font-bold text-white mt-0.5">{municipio}</p>
            <p className="text-[11px] text-blue-400 font-medium">Inscrição Municipal: {inscricaoMunicipal}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Tributação & Alíquota de ISS</span>
            <p className="text-xs font-bold text-white mt-0.5">Simples Nacional • ISS {aliquotaIssPadrao}%</p>
            <p className="text-[11px] text-slate-400">Próximo RPS: {serieRps} nº {proximoNumeroRps}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filtroTexto}
            onChange={e => setFiltroTexto(e.target.value)}
            placeholder="Buscar por tomador, CNPJ/CPF, número da NFS-e ou RPS..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
          >
            <option value="TODOS">Todos os Serviços</option>
            <option value="COMISSAO_VENDA">Comissão de Vendas</option>
            <option value="INTERMEDIACAO_LOCACAO">Intermediação de Locação</option>
            <option value="ADMINISTRACAO_LOCACAO_MENSAL">Administração Mensal</option>
            <option value="SERVICO_AVULSO_AVALIACAO">Serviços Avulsos / PTAM</option>
          </select>
        </div>
      </div>

      {/* Tabela de Notas Fiscais */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Livro de Notas Fiscais de Serviços Eletrônicas</h3>
          <span className="text-xs text-slate-400">Total Faturado Oficial: <strong className="text-emerald-400 font-mono">R$ {totalFaturadoAutorizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Nº NFS-e / RPS</th>
                <th className="px-4 py-3">Data / Hora</th>
                <th className="px-4 py-3">Tipo de Serviço</th>
                <th className="px-4 py-3">Tomador (Cliente)</th>
                <th className="px-4 py-3">Imóvel Ref.</th>
                <th className="px-4 py-3 text-right">Valor Serviços</th>
                <th className="px-4 py-3 text-right">ISS ({aliquotaIssPadrao}%)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">DANFSE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredNotas.map(nota => (
                <tr key={nota.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-white">{nota.numeroNfse || 'RPS Pendente'}</span>
                    <p className="text-[10px] text-slate-500 font-mono">RPS: {nota.serieRps} nº {nota.numeroRps}</p>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-400">
                    {nota.dataEmissao}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-blue-300 border border-slate-700">
                      {nota.tipoServico.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-white truncate max-w-[200px]">{nota.tomadorNome}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Doc: {nota.tomadorCpfCnpj}</p>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-400 uppercase">
                    {nota.imovelCodigo || '-'}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                    R$ {nota.valorServicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                    R$ {nota.valorIss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      nota.status === 'AUTORIZADA' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : nota.status === 'HOMOLOGADA_TESTE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {nota.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedNotaParaDanfse(nota)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      Espelho DANFSE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Emissão de NFS-e */}
      {showNovaNotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Nova Emissão de NFS-e Municipal</h3>
                  <p className="text-xs text-slate-400">Ambiente de Envio: <strong>{ambiente}</strong> (Prefeitura de {municipio})</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNovaNotaModal(false)} 
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Fechar"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmitirNota} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Finalidade / Tipo de Serviço *</label>
                  <select
                    value={novoTipoServico}
                    onChange={e => {
                      const t = e.target.value as TipoServicoNfse;
                      setNovoTipoServico(t);
                      if (t === 'COMISSAO_VENDA') {
                        setNovaDiscriminacao('Intermediação e corretagem imobiliária na venda de imóvel conforme contrato de compra e venda.');
                      } else if (t === 'INTERMEDIACAO_LOCACAO') {
                        setNovaDiscriminacao('Intermediação e captação imobiliária referente à celebração do 1º aluguel do contrato de locação.');
                      } else if (t === 'ADMINISTRACAO_LOCACAO_MENSAL') {
                        setNovaDiscriminacao('Prestação de serviços contínuos de administração e gestão imobiliária de locação da carteira.');
                      } else {
                        setNovaDiscriminacao('Elaboração de Parecer Técnico de Avaliação Mercadológica (PTAM) e laudos periciais.');
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="COMISSAO_VENDA">1. Comissão sobre Venda de Imóvel</option>
                    <option value="INTERMEDIACAO_LOCACAO">2. Taxa de Intermediação de Locação (1º Aluguel)</option>
                    <option value="ADMINISTRACAO_LOCACAO_MENSAL">3. Taxa de Administração de Locação (Mensal)</option>
                    <option value="SERVICO_AVULSO_AVALIACAO">4. Serviços Avulsos / Avaliação PTAM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Código do Imóvel Referenciado (Opcional)</label>
                  <input
                    type="text"
                    value={novoImovelCodigo}
                    onChange={e => setNovoImovelCodigo(e.target.value)}
                    placeholder="Ex: AP-PIN-044"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tomador do Serviço (Razão Social / Nome) *</label>
                  <input
                    type="text"
                    required
                    value={novoTomadorNome}
                    onChange={e => setNovoTomadorNome(e.target.value)}
                    placeholder="Ex: Roberto Silveira ou Construtora Cyrela"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CNPJ ou CPF do Tomador *</label>
                  <input
                    type="text"
                    required
                    value={novoTomadorCpfCnpj}
                    onChange={e => setNovoTomadorCpfCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00 ou CPF"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">E-mail para Envio da NFS-e</label>
                  <input
                    type="email"
                    value={novoTomadorEmail}
                    onChange={e => setNovoTomadorEmail(e.target.value)}
                    placeholder="financeiro@empresa.com.br"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Valor Bruto do Serviço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={novoValorServicos}
                    onChange={e => setNovoValorServicos(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Discriminação dos Serviços na Nota Fiscal *</label>
                  <textarea
                    rows={3}
                    required
                    value={novaDiscriminacao}
                    onChange={e => setNovaDiscriminacao(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNovaNotaModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-900/40"
                >
                  <Send className="w-4 h-4" />
                  Transmitir à Prefeitura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Espelho DANFSE Oficial */}
      {selectedNotaParaDanfse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 border border-slate-300 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header da Prefeitura */}
            <div className="p-6 bg-slate-50 border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                  🏛️
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-slate-900">PREFEITURA DO MUNICÍPIO DE {municipio.toUpperCase()}</h3>
                  <p className="text-[11px] text-slate-600 font-semibold">SECRETARIA MUNICIPAL DA FAZENDA • NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNotaParaDanfse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                title="Fechar"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quadro Resumo */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-3 rounded-xl border border-slate-200 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Número da NFS-e</span>
                  <span className="font-bold text-sm text-slate-900">{selectedNotaParaDanfse.numeroNfse}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Data de Emissão</span>
                  <span className="font-bold text-slate-900">{selectedNotaParaDanfse.dataEmissao}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Código Verificador</span>
                  <span className="font-bold text-blue-700">{selectedNotaParaDanfse.codigoVerificacao}</span>
                </div>
              </div>

              {/* Prestador */}
              <div className="p-3 border border-slate-200 rounded-xl space-y-0.5">
                <span className="font-bold text-[10px] uppercase text-slate-500">PRESTADOR DE SERVIÇOS</span>
                <p className="font-bold text-slate-900">ACERTGO IMÓVEIS E GESTÃO IMOBILIÁRIA LTDA</p>
                <p className="text-slate-600">CNPJ: 45.123.890/0001-22 • IM: {inscricaoMunicipal} • CRECI 98.214-J</p>
                <p className="text-slate-500 text-[11px]">Av. Brigadeiro Faria Lima, 3477 - 14º Andar - Itaim Bibi, São Paulo/SP</p>
              </div>

              {/* Tomador */}
              <div className="p-3 border border-slate-200 rounded-xl space-y-0.5">
                <span className="font-bold text-[10px] uppercase text-slate-500">TOMADOR DOS SERVIÇOS</span>
                <p className="font-bold text-slate-900">{selectedNotaParaDanfse.tomadorNome}</p>
                <p className="text-slate-600">CPF/CNPJ: <span className="font-mono">{selectedNotaParaDanfse.tomadorCpfCnpj}</span></p>
                <p className="text-slate-500 text-[11px]">{selectedNotaParaDanfse.tomadorEndereco} • E-mail: {selectedNotaParaDanfse.tomadorEmail}</p>
              </div>

              {/* Discriminação */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-[10px] uppercase text-slate-500">DISCRIMINAÇÃO DOS SERVIÇOS</span>
                <p className="text-slate-800 leading-relaxed">{selectedNotaParaDanfse.discriminacaoServico}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">CNAE: {cnaePrincipal} • Item LC 116: {itemLc116}</p>
              </div>

              {/* Valores e Tributos */}
              <div className="p-3 border-2 border-slate-300 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                  <span>VALOR TOTAL DOS SERVIÇOS:</span>
                  <span className="font-mono">R$ {selectedNotaParaDanfse.valorServicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] text-slate-600 font-mono">
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-slate-500">Base Cálculo</span>
                    R$ {selectedNotaParaDanfse.baseCalculo.toFixed(2)}
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-slate-500">Alíquota ISS</span>
                    {selectedNotaParaDanfse.aliquotaIss}%
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-slate-500">Valor do ISS</span>
                    R$ {selectedNotaParaDanfse.valorIss.toFixed(2)}
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-slate-500">ISS Retido</span>
                    Não
                  </div>
                </div>
              </div>

              {/* QR Code de Autenticidade */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-500 space-y-0.5">
                  <p className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Documento Fiscal Emitido Eletronicamente
                  </p>
                  <p>Consulte a autenticidade desta nota fiscal no portal da Secretaria da Fazenda.</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Olá ${selectedNotaParaDanfse.tomadorNome}! Segue sua NFS-e nº ${selectedNotaParaDanfse.numeroNfse} emitida pela AcertGo Imóveis no valor de R$ ${selectedNotaParaDanfse.valorServicos.toFixed(2)}. Código verificador: ${selectedNotaParaDanfse.codigoVerificacao}.`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  Enviar WhatsApp
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

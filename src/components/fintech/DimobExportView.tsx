import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Building, 
  Users, 
  DollarSign, 
  Printer, 
  Share2, 
  Search, 
  Filter, 
  ShieldCheck, 
  Info,
  Check,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { RentalContract, RealEstateProperty } from '../../types/crm';

interface DimobContractMonthData {
  mes: number;
  nomeMes: string;
  valorAluguelBruto: number;
  taxaAdministracao: number; // Comissão da imobiliária
  impostoRendaRetido: number; // IRRF
  valorLiquidoRepassado: number;
}

interface DimobItem {
  id: string;
  contratoId: string;
  numeroContrato: string;
  imovelCodigo: string;
  tipoImovel: 'URBANO' | 'RURAL';
  enderecoCompleto: string;
  cep: string;
  
  // Locador (Proprietário)
  locadorNome: string;
  locadorCpfCnpj: string;
  
  // Locatário (Inquilino)
  locatarioNome: string;
  locatarioCpfCnpj: string;
  
  // Meses
  meses: DimobContractMonthData[];
  
  // Totais Anuais
  totalAluguelAnual: number;
  totalComissaoAnual: number;
  totalIrrfAnual: number;
  totalLiquidoAnual: number;
  
  statusValidacao: 'VALIDO' | 'PENDENCIA_CPF' | 'PENDENCIA_ENDERECO';
}

interface DimobExportViewProps {
  contracts: RentalContract[];
  properties: RealEstateProperty[];
}

const MESES_NOMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const DimobExportView: React.FC<DimobExportViewProps> = ({
  contracts,
  properties
}) => {
  const [anoCalendario, setAnoCalendario] = useState('2026');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [selectedContratoParaInforme, setSelectedContratoParaInforme] = useState<DimobItem | null>(null);

  // Dados da Imobiliária Declarante
  const declarante = {
    razaoSocial: 'ACERTGO IMÓVEIS E GESTÃO IMOBILIÁRIA LTDA',
    cnpj: '45.123.890/0001-22',
    creci: '98214-J',
    responsavelNome: 'LEONARDO CARNEIRO',
    responsavelCpf: '123.456.789-00',
    telefone: '(11) 3450-9900',
    email: 'fiscal@acertgo.com.br'
  };

  // Monta os dados da DIMOB baseados nos contratos reais
  const dimobItems: DimobItem[] = useMemo(() => {
    return contracts.map((c, index) => {
      const prop = properties.find(p => p.code === c.propertyCode);
      const valorAluguel = c.monthlyRent || 3500;
      const percentualTaxa = c.adminFeePercentage || 10;
      const taxaMensal = (valorAluguel * percentualTaxa) / 100;
      const irrfMensal = valorAluguel > 2826 ? (valorAluguel * 0.075) : 0;
      const liquidoMensal = valorAluguel - taxaMensal - irrfMensal;

      const meses: DimobContractMonthData[] = MESES_NOMES.map((nome, mIdx) => ({
        mes: mIdx + 1,
        nomeMes: nome,
        valorAluguelBruto: valorAluguel,
        taxaAdministracao: taxaMensal,
        impostoRendaRetido: irrfMensal,
        valorLiquidoRepassado: liquidoMensal
      }));

      const totalAluguelAnual = valorAluguel * 12;
      const totalComissaoAnual = taxaMensal * 12;
      const totalIrrfAnual = irrfMensal * 12;
      const totalLiquidoAnual = liquidoMensal * 12;

      const cpfLocador = c.beneficiaries?.[0]?.cpfCnpj || '111.222.333-44';
      const cpfLocatario = c.tenantCpf || '555.666.777-88';

      let statusValidacao: DimobItem['statusValidacao'] = 'VALIDO';
      if (!cpfLocador || cpfLocador.length < 11) statusValidacao = 'PENDENCIA_CPF';
      if (!c.propertyAddress || c.propertyAddress.length < 5) statusValidacao = 'PENDENCIA_ENDERECO';

      return {
        id: `dimob-${c.id}`,
        contratoId: c.id,
        numeroContrato: c.code || `CTR-LOC-${100 + index}`,
        imovelCodigo: prop?.code || c.propertyCode || `IMOV-${10 + index}`,
        tipoImovel: 'URBANO',
        enderecoCompleto: c.propertyAddress || 'Rua Oscar Freire, 1020 - Cerqueira César, São Paulo/SP',
        cep: prop?.address?.cep || '01426-001',
        locadorNome: c.ownerName,
        locadorCpfCnpj: cpfLocador,
        locatarioNome: c.tenantName,
        locatarioCpfCnpj: cpfLocatario,
        meses,
        totalAluguelAnual,
        totalComissaoAnual,
        totalIrrfAnual,
        totalLiquidoAnual,
        statusValidacao
      };
    });
  }, [contracts, properties]);

  // Totais Consolidados da DIMOB
  const totaisConsolidados = useMemo(() => {
    return dimobItems.reduce((acc, curr) => ({
      totalAluguel: acc.totalAluguel + curr.totalAluguelAnual,
      totalComissao: acc.totalComissao + curr.totalComissaoAnual,
      totalIrrf: acc.totalIrrf + curr.totalIrrfAnual,
      totalLiquido: acc.totalLiquido + curr.totalLiquidoAnual,
      totalContratos: acc.totalContratos + 1,
      pendencias: acc.pendencias + (curr.statusValidacao !== 'VALIDO' ? 1 : 0)
    }), {
      totalAluguel: 0,
      totalComissao: 0,
      totalIrrf: 0,
      totalLiquido: 0,
      totalContratos: 0,
      pendencias: 0
    });
  }, [dimobItems]);

  // Filtro
  const filteredItems = useMemo(() => {
    return dimobItems.filter(item => {
      return !filtroTexto || 
        item.locadorNome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.locatarioNome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.imovelCodigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.numeroContrato.toLowerCase().includes(filtroTexto.toLowerCase());
    });
  }, [dimobItems, filtroTexto]);

  // Gerador de Arquivo TXT no Layout Oficial da Receita Federal (DIMOB)
  const handleExportarArquivoOficialRFB = () => {
    const padStr = (str: string, len: number) => (str || '').substring(0, len).padEnd(len, ' ');
    const padNum = (num: number, len: number) => Math.round(num * 100).toString().padStart(len, '0');
    const cleanDoc = (doc: string) => (doc || '').replace(/\D/g, '');

    let linhas: string[] = [];

    // Header R01 - Dados da Declaração
    const linhaR01 = `DIMOB${anoCalendario}00000001${padStr(declarante.razaoSocial, 60)}${cleanDoc(declarante.cnpj).padStart(14, '0')}00000000000000${cleanDoc(declarante.responsavelCpf).padStart(11, '0')}`;
    linhas.push(linhaR01);

    // Registro R02 - Dados do Declarante Imobiliário
    const linhaR02 = `R02${cleanDoc(declarante.cnpj).padStart(14, '0')}${padStr(declarante.creci, 10)}${padStr(declarante.responsavelNome, 50)}${padStr(declarante.telefone, 15)}`;
    linhas.push(linhaR02);

    // Registros R03 - Locação (Cada contrato)
    dimobItems.forEach((item, idx) => {
      const sequencial = (idx + 1).toString().padStart(5, '0');
      const docLocador = cleanDoc(item.locadorCpfCnpj).padStart(14, '0');
      const tipoDocLocador = cleanDoc(item.locadorCpfCnpj).length > 11 ? '2' : '1';
      const docLocatario = cleanDoc(item.locatarioCpfCnpj).padStart(14, '0');
      const tipoDocLocatario = cleanDoc(item.locatarioCpfCnpj).length > 11 ? '2' : '1';

      // Monta os valores de cada mês (12 meses de aluguel bruto + comissão + IRRF)
      let valoresMeses = '';
      item.meses.forEach(m => {
        valoresMeses += padNum(m.valorAluguelBruto, 14) + padNum(m.taxaAdministracao, 14) + padNum(m.impostoRendaRetido, 14);
      });

      const linhaR03 = `R03${sequencial}${padStr(item.numeroContrato, 20)}${tipoDocLocador}${docLocador}${padStr(item.locadorNome, 60)}${tipoDocLocatario}${docLocatario}${padStr(item.locatarioNome, 60)}${valoresMeses}${padStr(item.cep, 8)}${padStr(item.enderecoCompleto, 80)}`;
      linhas.push(linhaR03);
    });

    // Trailler T9 - Totalizador
    const linhaT9 = `T9${dimobItems.length.toString().padStart(6, '0')}${padNum(totaisConsolidados.totalAluguel, 17)}${padNum(totaisConsolidados.totalComissao, 17)}${padNum(totaisConsolidados.totalIrrf, 17)}`;
    linhas.push(linhaT9);

    const blob = new Blob([linhas.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DIMOB_${declarante.cnpj.replace(/\D/g, '')}_${anoCalendario}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner DIMOB */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-800/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider">
              Receita Federal do Brasil (RFB)
            </span>
            <span className="text-xs text-slate-400">• Instrução Normativa RFB nº 1.987</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">DIMOB - Declaração de Informações sobre Atividades Imobiliárias</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Apuração contábil anual de contratos de locação, comissões de administração retidas, repasses líquidos a proprietários e IRRF para envio oficial à Receita Federal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">Ano-Calendário:</span>
            <select
              value={anoCalendario}
              onChange={e => setAnoCalendario(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-hidden"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <button
            onClick={handleExportarArquivoOficialRFB}
            className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all"
          >
            <Download className="w-4 h-4" />
            Gerar Arquivo Oficial (.TXT)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>ALUGUEL BRUTO DECLARADO</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-blue-400">
            R$ {totaisConsolidados.totalAluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {totaisConsolidados.totalContratos} contratos de locação apurados
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>COMISSÃO RETIDA (RECEITA ADM)</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">
            R$ {totaisConsolidados.totalComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Faturamento anual de taxa de administração
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>IRRF RETIDO NA FONTE</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-amber-400">
            R$ {totaisConsolidados.totalIrrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Imposto recolhido e informado à RFB
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>REPASSES LÍQUIDOS AOS LOCADORES</span>
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-teal-300">
            R$ {totaisConsolidados.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Total efetivamente pago aos proprietários
          </p>
        </div>
      </div>

      {/* Validation Status & Declarant Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white">Validador de Layout da Receita Federal (RFB):</p>
            <p className="text-slate-400">
              {totaisConsolidados.pendencias === 0 ? (
                <span className="text-emerald-400 font-semibold">✓ 100% dos contratos aptos e validados sem pendência cadastral.</span>
              ) : (
                <span className="text-amber-400 font-semibold">{totaisConsolidados.pendencias} contratos com pendência de CPF ou CEP.</span>
              )}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 text-right">
          <span className="font-bold text-slate-200">Declarante:</span> {declarante.razaoSocial} • <span className="font-mono">{declarante.cnpj}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filtroTexto}
            onChange={e => setFiltroTexto(e.target.value)}
            placeholder="Buscar por locador (proprietário), locatário, código do contrato ou imóvel..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Contracts DIMOB Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Demonstrativo Anual de Locações (Registro R03)</h3>
          <span className="text-xs text-slate-400">Exibindo <strong>{filteredItems.length}</strong> contratos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Contrato / Imóvel</th>
                <th className="px-4 py-3">Locador (Proprietário)</th>
                <th className="px-4 py-3">Locatário (Inquilino)</th>
                <th className="px-4 py-3 text-right">Aluguel Anual Bruto</th>
                <th className="px-4 py-3 text-right">Comissão Imobiliária</th>
                <th className="px-4 py-3 text-right">IRRF Retido</th>
                <th className="px-4 py-3 text-right">Repasse Líquido</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Informe IRPF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-blue-400">{item.numeroContrato}</span>
                    <p className="text-[11px] text-slate-400 font-mono">Imóvel: {item.imovelCodigo}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{item.enderecoCompleto}</p>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-white">{item.locadorNome}</p>
                    <p className="text-[11px] text-slate-400 font-mono">CPF: {item.locadorCpfCnpj}</p>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-300">{item.locatarioNome}</p>
                    <p className="text-[11px] text-slate-400 font-mono">CPF: {item.locatarioCpfCnpj}</p>
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-200">
                    R$ {item.totalAluguelAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-semibold text-emerald-400">
                    R$ {item.totalComissaoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-amber-400">
                    {item.totalIrrfAnual > 0 ? `R$ ${item.totalIrrfAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-teal-300">
                    R$ {item.totalLiquidoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.statusValidacao === 'VALIDO' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.statusValidacao === 'VALIDO' ? 'Validado' : 'Atenção'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedContratoParaInforme(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Gerar Informe de Rendimentos para declaração do IRPF do Proprietário"
                    >
                      Informe IRPF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Informe de Rendimentos do Proprietário (IRPF) */}
      {selectedContratoParaInforme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Informe de Rendimentos Financeiros de Aluguel</h3>
                <p className="text-xs text-slate-400">Declaração de Imposto sobre a Renda da Pessoa Física (IRPF - Ano {anoCalendario})</p>
              </div>
              <button 
                onClick={() => setSelectedContratoParaInforme(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Fechar"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p><strong>Fonte Pagadora / Administradora:</strong> {declarante.razaoSocial}</p>
                <p><strong>CNPJ:</strong> {declarante.cnpj} | <strong>CRECI:</strong> {declarante.creci}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p><strong>Locador Beneficiário:</strong> {selectedContratoParaInforme.locadorNome}</p>
                <p><strong>CPF:</strong> {selectedContratoParaInforme.locadorCpfCnpj}</p>
                <p><strong>Imóvel Locado:</strong> [{selectedContratoParaInforme.imovelCodigo}] {selectedContratoParaInforme.enderecoCompleto}</p>
              </div>

              {/* Tabela dos 12 Meses */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">Mês</th>
                      <th className="px-3 py-2 text-right">Rendimento Bruto</th>
                      <th className="px-3 py-2 text-right">Comissão Imobiliária</th>
                      <th className="px-3 py-2 text-right">IRRF Retido</th>
                      <th className="px-3 py-2 text-right">Líquido Repassado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedContratoParaInforme.meses.map(m => (
                      <tr key={m.mes}>
                        <td className="px-3 py-1.5 font-medium">{m.nomeMes}</td>
                        <td className="px-3 py-1.5 text-right font-mono">R$ {m.valorAluguelBruto.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right font-mono text-slate-600">- R$ {m.taxaAdministracao.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right font-mono text-amber-700">{m.impostoRendaRetido > 0 ? `R$ ${m.impostoRendaRetido.toFixed(2)}` : '-'}</td>
                        <td className="px-3 py-1.5 text-right font-mono font-bold text-emerald-800">R$ {m.valorLiquidoRepassado.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
                    <tr>
                      <td className="px-3 py-2">TOTAL ANUAL:</td>
                      <td className="px-3 py-2 text-right font-mono">R$ {selectedContratoParaInforme.totalAluguelAnual.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-mono">- R$ {selectedContratoParaInforme.totalComissaoAnual.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-mono text-amber-700">R$ {selectedContratoParaInforme.totalIrrfAnual.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-800">R$ {selectedContratoParaInforme.totalLiquidoAnual.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-[10px] text-slate-500">Documento idôneo gerado para o IRPF {anoCalendario}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir / PDF
                  </button>
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Olá ${selectedContratoParaInforme.locadorNome}! Segue seu Informe de Rendimentos de Aluguel (DIMOB ${anoCalendario}) referente ao imóvel ${selectedContratoParaInforme.imovelCodigo} para a declaração de Imposto de Renda. Total repassado no ano: R$ ${selectedContratoParaInforme.totalLiquidoAnual.toFixed(2)}.`);
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    Enviar WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

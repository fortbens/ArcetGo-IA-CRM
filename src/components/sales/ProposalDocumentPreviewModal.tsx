import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Building, 
  User, 
  Calendar, 
  DollarSign, 
  Check, 
  Copy, 
  MessageSquare, 
  ArrowRight, 
  Send, 
  AlertCircle,
  Download,
  Eye,
  Loader2,
  FileCheck,
  Maximize2
} from 'lucide-react';
import { PropostaVenda } from '../../types/salesProposal';
import { downloadProposalPdf, getProposalPdfBlobUrl } from '../../utils/salesProposalPdfGenerator';

interface ProposalDocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: PropostaVenda | null;
  onRegisterDecision?: (proposalId: string, decision: 'ACEITO' | 'CONTRAPROPOSTA' | 'RECUSADO', parecer: string, valorContra?: number) => void;
}

export const ProposalDocumentPreviewModal: React.FC<ProposalDocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onRegisterDecision
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDecisionBox, setShowDecisionBox] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<'ACEITO' | 'CONTRAPROPOSTA' | 'RECUSADO'>('ACEITO');
  const [parecerTexto, setParecerTexto] = useState('');
  const [valorContraproposta, setValorContraproposta] = useState('');

  // PDF Generation & Preview State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState(false);
  const [viewMode, setViewMode] = useState<'DOCUMENT' | 'PDF_PREVIEW'>('DOCUMENT');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  if (!isOpen || !proposal) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      downloadProposalPdf(proposal);
      setPdfSuccessToast(true);
      setTimeout(() => setPdfSuccessToast(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF da proposta:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleTogglePdfPreview = () => {
    if (viewMode === 'DOCUMENT') {
      try {
        const url = getProposalPdfBlobUrl(proposal);
        setPdfBlobUrl(url);
        setViewMode('PDF_PREVIEW');
      } catch (err) {
        console.error('Erro ao gerar prévia do PDF:', err);
      }
    } else {
      setViewMode('DOCUMENT');
    }
  };

  const handleSendWhatsAppToVendor = () => {
    const text = encodeURIComponent(
      `Olá ${proposal.vendedorNome}! Tudo bem?\n\n` +
      `Aqui é da AcertGo Imóveis. Recebemos uma PROPOSTA FORMAL DE COMPRA para o seu imóvel *[${proposal.imovelCodigo}] ${proposal.imovelTitulo}*.\n\n` +
      `*Resumo da Proposta nº ${proposal.codigo}*:\n` +
      `• *Comprador:* ${proposal.compradorNome}\n` +
      `• *Valor Proposto:* R$ ${proposal.condicoes.valorProposto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `• *Sinal de Entrada:* R$ ${proposal.condicoes.valorSinalEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      (proposal.condicoes.valorFinanciamentoBancario > 0 ? `• *Financiamento:* R$ ${proposal.condicoes.valorFinanciamentoBancario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` : '') +
      `• *Validade da Proposta:* ${proposal.condicoes.validadeDiasUteis} dias úteis (até ${proposal.condicoes.dataExpiracao})\n\n` +
      `A minuta completa com todos os termos e aceite formal foi emitida em PDF oficial. Podemos conversar a respeito?`
    );
    window.open(`https://wa.me/55${proposal.vendedorTelefone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleSaveDecision = () => {
    if (onRegisterDecision) {
      onRegisterDecision(
        proposal.id, 
        selectedDecision, 
        parecerTexto, 
        valorContraproposta ? parseFloat(valorContraproposta.replace(',', '.')) : undefined
      );
    }
    setShowDecisionBox(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[94vh]">
        
        {/* Top Action Bar */}
        <div className="p-3 sm:px-6 sm:py-4 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center justify-between gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-sm sm:text-base">Minuta Oficial de Proposta de Compra</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold shrink-0">
                    {proposal.codigo}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">Documento pronto para exportação em PDF, análise e assinatura formal</p>
              </div>
            </div>

            {/* Mobile close button: ALWAYS visible and pinned to top-right! */}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 md:hidden shrink-0 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
            {/* View Mode Toggle: Minuta HTML vs Prévia PDF */}
            <button
              onClick={handleTogglePdfPreview}
              className={`px-3 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border cursor-pointer ${
                viewMode === 'PDF_PREVIEW'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title={viewMode === 'PDF_PREVIEW' ? 'Voltar para Minuta Editável' : 'Pré-visualizar o PDF real formatado'}
            >
              <Eye className="w-4 h-4 shrink-0 text-indigo-300" />
              <span className="hidden sm:inline">{viewMode === 'PDF_PREVIEW' ? 'Modo Minuta' : 'Prévia PDF'}</span>
            </button>

            {/* BOTÃO PRINCIPAL: BAIXAR PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-900/40 cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
              title="Gerar e Baixar Proposta Formatada em PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>Baixar PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleSendWhatsAppToVendor}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Encaminhar proposta diretamente no WhatsApp do Proprietário"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Enviar ao Vendedor</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              title="Imprimir documento via navegador"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">Imprimir</span>
            </button>

            {/* Desktop close button */}
            <button
              onClick={onClose}
              className="hidden md:flex text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              title="Fechar"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast Banner */}
        {pdfSuccessToast && (
          <div className="mx-3 sm:mx-6 mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-emerald-400 text-xs font-semibold animate-in fade-in slide-in-from-top-2 shrink-0">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Documento PDF oficial da proposta <strong>{proposal.codigo}</strong> ({proposal.imovelCodigo}) exportado com sucesso!
              </span>
            </div>
            <button 
              onClick={() => setPdfSuccessToast(false)} 
              className="text-emerald-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Area: Either Embedded PDF Viewer or Styled HTML Document */}
        {viewMode === 'PDF_PREVIEW' && pdfBlobUrl ? (
          <div className="flex-1 p-3 sm:p-6 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full h-full min-h-[580px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative shadow-2xl flex flex-col">
              <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Visualizador de PDF Real (A4 Jurídico)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setViewMode('DOCUMENT')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    Fechar Prévia
                  </button>
                </div>
              </div>
              <iframe
                src={pdfBlobUrl}
                title="Pré-visualização do PDF"
                className="w-full flex-1 border-0 bg-white"
              />
            </div>
          </div>
        ) : (
          /* Document Body (Styled like formal legal paper) */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 text-slate-900 font-sans print:p-0 print:bg-white print:text-black">
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-slate-300/80 space-y-6 print:shadow-none print:border-none print:p-0">
              
              {/* Header Timbrado */}
              <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base">
                      AG
                    </div>
                    <div>
                      <h1 className="text-lg font-black tracking-tight text-slate-900">ACERTGO IMÓVEIS & FINTECH S.A.</h1>
                      <p className="text-[11px] text-slate-500 font-medium">CRECI 98.214-J • CNPJ: 45.123.890/0001-22 • Tel: (11) 3450-9900</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-medium">
                    Avenida Brigadeiro Faria Lima, 3477 - 14º Andar - Itaim Bibi, São Paulo/SP
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-100 rounded-md font-mono text-xs font-bold text-slate-900 border border-slate-300">
                    {proposal.codigo}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Data: {proposal.dataCriacao.split(' ')[0]}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    proposal.status === 'ACEITA_VENDIDO' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    proposal.status === 'CONTRAPROPOSTA' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    Status: {proposal.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Título do Documento */}
              <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-lg">
                <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                  PROPOSTA IRRETRATÁVEL DE COMPRA E VENDA DE IMÓVEL
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Com Sinal e Princípio de Pagamento (Arras) - Conforme Arts. 417 a 420 e 427 do Código Civil
                </p>
              </div>

              {/* 1. Das Partes */}
              <div className="space-y-3 text-xs text-slate-800 leading-relaxed">
                <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <span>1. IDENTIFICAÇÃO DAS PARTES</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase text-blue-700">PROPONENTE COMPRADOR:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{proposal.compradorNome}</p>
                    <p className="text-slate-600">CPF: <span className="font-mono">{proposal.compradorCpfCnpj}</span> | RG: {proposal.compradorRg || 'Identificado nos autos'}</p>
                    <p className="text-slate-600">Estado Civil: {proposal.compradorEstadoCivil || 'Não informado'} | Profissão: {proposal.compradorProfissao || 'Profissional Liberal'}</p>
                    <p className="text-slate-600">Contato: {proposal.compradorTelefone} | {proposal.compradorEmail}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase text-emerald-700">PROPRIETÁRIO / VENDEDOR:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{proposal.vendedorNome}</p>
                    <p className="text-slate-600">CPF/CNPJ: <span className="font-mono">{proposal.vendedorCpfCnpj}</span></p>
                    <p className="text-slate-600">Contato: {proposal.vendedorTelefone} | {proposal.vendedorEmail}</p>
                    <p className="text-slate-500 italic mt-1 text-[10px]">Titular do domínio do imóvel descrito no item 2.</p>
                  </div>
                </div>
              </div>

              {/* 2. Do Imóvel */}
              <div className="space-y-2 text-xs text-slate-800 leading-relaxed">
                <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-200 pb-1">
                  2. DO OBJETO / IMÓVEL NEGOCIADO
                </h3>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <p><strong className="text-slate-900">Identificação:</strong> [{proposal.imovelCodigo}] {proposal.imovelTitulo}</p>
                  <p><strong className="text-slate-900">Endereço Completo:</strong> {proposal.imovelEndereco}</p>
                  {proposal.imovelMatriculaRgi && (
                    <p><strong className="text-slate-900">Registro & Matrícula:</strong> {proposal.imovelMatriculaRgi}</p>
                  )}
                  <p><strong className="text-slate-900">Valor de Avaliação / Pedido Original:</strong> R$ {proposal.condicoes.valorTabelaImovel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {/* 3. Do Preço e Condições de Pagamento */}
              <div className="space-y-3 text-xs text-slate-800 leading-relaxed">
                <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-200 pb-1">
                  3. DO PREÇO PROPOSTO E FLUXO FINANCEIRO
                </h3>
                
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 uppercase">VALOR TOTAL PROPOSTO PELO COMPRADOR</span>
                    <p className="text-2xl font-black text-emerald-900 mt-0.5">
                      R$ {proposal.condicoes.valorProposto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-600">Variação da Tabela:</span>
                    <p className={`text-sm font-bold ${proposal.condicoes.descontoOuAcrescimo < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {proposal.condicoes.descontoOuAcrescimo.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Tabela do Fluxo */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs divide-y divide-slate-200">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="px-3.5 py-2">Composição do Pagamento</th>
                        <th className="px-3.5 py-2">Forma / Previsão</th>
                        <th className="px-3.5 py-2 text-right">Valor (R$)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-3.5 py-2 font-semibold">1. Sinal e Princípio de Pagamento (Arras)</td>
                        <td className="px-3.5 py-2">{proposal.condicoes.formaSinal} em {proposal.condicoes.dataPrevisaoSinal}</td>
                        <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-900">
                          R$ {proposal.condicoes.valorSinalEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>

                      {proposal.condicoes.valorFgts > 0 && (
                        <tr>
                          <td className="px-3.5 py-2 font-semibold">2. Recursos de FGTS</td>
                          <td className="px-3.5 py-2">Liberação Caixa Econômica Federal</td>
                          <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-900">
                            R$ {proposal.condicoes.valorFgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}

                      {proposal.condicoes.valorFinanciamentoBancario > 0 && (
                        <tr>
                          <td className="px-3.5 py-2 font-semibold">3. Financiamento Imobiliário Bancário</td>
                          <td className="px-3.5 py-2">{proposal.condicoes.bancoFinanciamento || 'Banco de preferência do comprador'}</td>
                          <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-900">
                            R$ {proposal.condicoes.valorFinanciamentoBancario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}

                      {proposal.condicoes.valorParcelasDiretas > 0 && (
                        <tr>
                          <td className="px-3.5 py-2 font-semibold">4. Parcelamento Direto com o Vendedor</td>
                          <td className="px-3.5 py-2">{proposal.condicoes.quantidadeParcelasDiretas || 1} parcelas mensais</td>
                          <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-900">
                            R$ {proposal.condicoes.valorParcelasDiretas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}

                      {proposal.condicoes.valorPermutaBem > 0 && (
                        <tr>
                          <td className="px-3.5 py-2 font-semibold">5. Dação em Pagamento / Permuta de Bem</td>
                          <td className="px-3.5 py-2 text-[11px] text-slate-600">{proposal.condicoes.descricaoPermuta || 'Bem avaliado pelas partes'}</td>
                          <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-900">
                            R$ {proposal.condicoes.valorPermutaBem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}

                      {proposal.condicoes.valorSaldoEscrituraChaves > 0 && (
                        <tr>
                          <td className="px-3.5 py-2 font-semibold">6. Saldo Final na Assinatura da Escritura / Chaves</td>
                          <td className="px-3.5 py-2">{proposal.condicoes.dataPrevisaoChaves || 'Contra entrega das chaves'}</td>
                          <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-900">
                            R$ {proposal.condicoes.valorSaldoEscrituraChaves.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {proposal.condicoes.condicoesEspeciais && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="font-bold text-amber-900 block text-[11px] uppercase">CONDIÇÕES ESPECIAIS & MOBILIÁRIO:</span>
                    <p className="text-amber-800 text-xs mt-0.5">{proposal.condicoes.condicoesEspeciais}</p>
                  </div>
                )}
              </div>

              {/* 4. Honorários de Corretagem */}
              <div className="space-y-2 text-xs text-slate-800 leading-relaxed">
                <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-200 pb-1">
                  4. DA COMISSÃO DE INTERMEDIAÇÃO IMOBILIÁRIA
                </h3>
                <p className="text-justify text-slate-700">
                  Pela intermediação exitosa deste negócio, são devidos honorários de corretagem à imobiliária interveniente 
                  <strong> ACERTGO IMÓVEIS & FINTECH</strong> (CRECI 98.214-J), no percentual de 
                  <strong> {proposal.comissao.percentualComissao}% ({proposal.comissao.percentualComissao} por cento)</strong> sobre o valor total da venda, 
                  perfazendo a quantia de <strong>R$ {proposal.comissao.valorComissaoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, 
                  a serem pagos {proposal.comissao.formaCobranca === 'RETIDA_SINAL' ? 'mediante dedução direta no sinal de entrada' : 'pelo Vendedor na data do sinal'}.
                </p>
              </div>

              {/* 5. Da Validade e Aceite Formal */}
              <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
                <h3 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-200 pb-1">
                  5. DA VALIDADE E DECISÃO FORMAL DO VENDEDOR
                </h3>
                <p className="text-slate-700">
                  A presente proposta possui prazo de validade improrrogável de 
                  <strong> {proposal.condicoes.validadeDiasUteis} dias úteis</strong>, expirando-se em 
                  <strong> {proposal.condicoes.dataExpiracao}</strong>, momento a partir do qual, se não houver aceite formal 
                  por escrito ou contraproposta, considerar-se-á cancelada de pleno direito sem ônus ao Proponente.
                </p>

                {/* Quadro de Aceite do Vendedor */}
                <div className="p-4 bg-slate-50 border-2 border-slate-400 rounded-xl space-y-3">
                  <span className="font-black text-slate-900 uppercase text-xs block text-center">
                    DECLARAÇÃO E DECISÃO FORMAL DO PROPRIETÁRIO / VENDEDOR
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-bold text-xs">
                      <input 
                        type="radio" 
                        name="decisao_doc" 
                        checked={proposal.historicoAceite?.decisaoVendedor === 'ACEITO'} 
                        readOnly 
                        className="w-4 h-4 text-emerald-600"
                      />
                      <span>( ) ACEITO A PROPOSTA</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-bold text-xs">
                      <input 
                        type="radio" 
                        name="decisao_doc" 
                        checked={proposal.historicoAceite?.decisaoVendedor === 'CONTRAPROPOSTA'} 
                        readOnly 
                        className="w-4 h-4 text-amber-600"
                      />
                      <span>( ) CONTRAPROPOSTA</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-bold text-xs">
                      <input 
                        type="radio" 
                        name="decisao_doc" 
                        checked={proposal.historicoAceite?.decisaoVendedor === 'RECUSADO'} 
                        readOnly 
                        className="w-4 h-4 text-rose-600"
                      />
                      <span>( ) RECUSADA</span>
                    </label>
                  </div>

                  {proposal.historicoAceite?.parecerVendedor && (
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
                      <span className="font-bold text-slate-700">Parecer do Vendedor:</span>
                      <p className="text-slate-800 italic mt-0.5">{proposal.historicoAceite.parecerVendedor}</p>
                      {proposal.historicoAceite.valorContraproposta && (
                        <p className="font-bold text-amber-800 mt-1">
                          Valor da Contraproposta: R$ {proposal.historicoAceite.valorContraproposta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Linhas de Assinaturas */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-t border-slate-900 pt-1.5 font-bold text-slate-900">
                    {proposal.compradorNome}
                  </div>
                  <p className="text-slate-500 text-[11px]">Proponente Comprador</p>
                  <p className="text-[10px] text-slate-400 font-mono">CPF: {proposal.compradorCpfCnpj}</p>
                </div>

                <div>
                  <div className="border-t border-slate-900 pt-1.5 font-bold text-slate-900">
                    {proposal.vendedorNome}
                  </div>
                  <p className="text-slate-500 text-[11px]">Proprietário / Vendedor</p>
                  <p className="text-[10px] text-slate-400 font-mono">CPF/CNPJ: {proposal.vendedorCpfCnpj}</p>
                </div>

                <div className="sm:col-span-2 max-w-sm mx-auto pt-4">
                  <div className="border-t border-slate-900 pt-1.5 font-bold text-slate-900">
                    {proposal.corretorResponsavelNome} - {proposal.corretorCreci}
                  </div>
                  <p className="text-slate-500 text-[11px]">Corretor de Imóveis Intermediador • AcertGo</p>
                </div>
              </div>

              {/* Rodapé e Autenticação */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>AcertGo Vendas Intelligence • Minuta Oficial de Fechamento</span>
                <span className="font-mono">HASH: SHA256-{proposal.id.toUpperCase()}-AUTH</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Drawer for Quick Decision Registration (if in review) */}
        {proposal.status !== 'ACEITA_VENDIDO' && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 print:hidden">
            <div>
              <p className="text-xs font-bold text-white">Registrar Retorno do Vendedor</p>
              <p className="text-[11px] text-slate-400">Formalize se o vendedor aceitou, recusou ou enviou contraproposta</p>
            </div>

            {!showDecisionBox ? (
              <button
                onClick={() => setShowDecisionBox(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registrar Aceite / Decisão
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedDecision}
                  onChange={e => setSelectedDecision(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="ACEITO">✅ Aceitar Proposta (Vendido!)</option>
                  <option value="CONTRAPROPOSTA">Contraproposta</option>
                  <option value="RECUSADO">❌ Recusar Proposta</option>
                </select>

                {selectedDecision === 'CONTRAPROPOSTA' && (
                  <input
                    type="number"
                    placeholder="Valor R$"
                    value={valorContraproposta}
                    onChange={e => setValorContraproposta(e.target.value)}
                    className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                )}

                <input
                  type="text"
                  placeholder="Parecer do vendedor..."
                  value={parecerTexto}
                  onChange={e => setParecerTexto(e.target.value)}
                  className="w-48 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />

                <button
                  onClick={handleSaveDecision}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowDecisionBox(false)}
                  className="px-2 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Utilitário de Geração de PDF Oficial para Propostas de Compra e Venda
 * AcertGo CRM/ERP Imobiliário & Fintech
 *
 * Gera um documento PDF em formato A4 timbrado, com formatação jurídica,
 * detalhamento do imóvel, qualificação das partes, fluxo financeiro,
 * honorários de corretagem, regras de validade e campos para assinatura.
 */

import { jsPDF } from 'jspdf';
import { PropostaVenda } from '../types/salesProposal';

export interface GenerateProposalPdfOptions {
  agencyName?: string;
  agencyCreci?: string;
  agencyCnpj?: string;
  agencyPhone?: string;
  agencyAddress?: string;
  watermarkText?: string;
}

export function formatCurrencyBRL(val: number): string {
  return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateSalesProposalPdf(
  proposal: PropostaVenda,
  options: GenerateProposalPdfOptions = {}
): jsPDF {
  const {
    agencyName = 'ACERTGO IMÓVEIS & FINTECH S.A.',
    agencyCreci = 'CRECI 98.214-J',
    agencyCnpj = '45.123.890/0001-22',
    agencyPhone = '(11) 3450-9900',
    agencyAddress = 'Avenida Brigadeiro Faria Lima, 3477 - 14º Andar - Itaim Bibi, São Paulo/SP'
  } = options;

  // Criação do documento A4 vertical em milímetros
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - (marginX * 2);
  let currentY = 14;

  const checkPageBreak = (neededHeight: number): void => {
    if (currentY + neededHeight > pageHeight - 18) {
      doc.addPage();
      currentY = 16;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = (): void => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(agencyName, marginX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Proposta nº ${proposal.codigo} • ${proposal.imovelTitulo}`, pageWidth - marginX, currentY, { align: 'right' });
    
    currentY += 2;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 6;
  };

  // ==========================================
  // 1. CABEÇALHO TIMBRADO OFICIAL
  // ==========================================
  // Faixa decorativa superior
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(marginX, currentY, 3, 16, 'F');

  // Nome da Empresa e Dados do CRECI
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(agencyName, marginX + 6, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text(`${agencyCreci} • CNPJ: ${agencyCnpj} • Tel: ${agencyPhone}`, marginX + 6, currentY + 9);
  doc.text(agencyAddress, marginX + 6, currentY + 13.5);

  // Badge da Proposta no canto superior direito
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - marginX - 44, currentY, 44, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text(proposal.codigo, pageWidth - marginX - 22, currentY + 5.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const dataCriacaoStr = proposal.dataCriacao ? proposal.dataCriacao.split(' ')[0] : new Date().toLocaleDateString('pt-BR');
  doc.text(`Emissão: ${dataCriacaoStr}`, pageWidth - marginX - 22, currentY + 9.5, { align: 'center' });

  // Status visual no badge
  let statusText = 'EM ANÁLISE';
  let statusBg = [219, 234, 254]; // Blue-100
  let statusColor = [30, 64, 175]; // Blue-800
  if (proposal.status === 'ACEITA_VENDIDO') {
    statusText = 'ACEITA / VENDIDO';
    statusBg = [220, 252, 231]; // Green-100
    statusColor = [22, 101, 52]; // Green-800
  } else if (proposal.status === 'CONTRAPROPOSTA') {
    statusText = 'CONTRAPROPOSTA';
    statusBg = [254, 243, 199]; // Amber-100
    statusColor = [146, 64, 14]; // Amber-800
  } else if (proposal.status === 'RECUSADA') {
    statusText = 'RECUSADA';
    statusBg = [254, 226, 226]; // Red-100
    statusColor = [153, 27, 27]; // Red-800
  }

  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.roundedRect(pageWidth - marginX - 40, currentY + 11.5, 36, 4, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(statusText, pageWidth - marginX - 22, currentY + 14.3, { align: 'center' });

  currentY += 21;

  // Linha separadora do cabeçalho
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 5;

  // ==========================================
  // TÍTULO DO DOCUMENTO
  // ==========================================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PROPOSTA IRRETRATÁVEL DE COMPRA E VENDA DE IMÓVEL', pageWidth / 2, currentY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Com Sinal e Princípio de Pagamento (Arras) - Conforme Arts. 417 a 420 e 427 da Lei Federal nº 10.406 (Código Civil)', pageWidth / 2, currentY + 9, { align: 'center' });

  currentY += 16;

  // ==========================================
  // SEÇÃO 1: QUALIFICAÇÃO DAS PARTES
  // ==========================================
  checkPageBreak(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. IDENTIFICAÇÃO DAS PARTES', marginX, currentY);
  currentY += 3;

  // Dois blocos lado a lado (Comprador e Vendedor)
  const colWidth = (contentWidth - 4) / 2;
  const colHeight = 32;

  // Bloco Comprador
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, colWidth, colHeight, 1.5, 1.5, 'FD');

  // Faixa esquerda Comprador
  doc.setFillColor(37, 99, 235);
  doc.rect(marginX, currentY, 2, colHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(37, 99, 235);
  doc.text('PROPONENTE COMPRADOR', marginX + 5, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const compradorNome = proposal.compradorNome || 'Não informado';
  doc.text(doc.splitTextToSize(compradorNome, colWidth - 8)[0] || compradorNome, marginX + 5, currentY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`CPF: ${proposal.compradorCpfCnpj || 'Não informado'} | RG: ${proposal.compradorRg || 'Identificado nos autos'}`, marginX + 5, currentY + 14.5);
  doc.text(`Estado Civil: ${proposal.compradorEstadoCivil || 'Não informado'} | Profissão: ${proposal.compradorProfissao || 'Profissional Liberal'}`, marginX + 5, currentY + 19);
  doc.text(`Telefone: ${proposal.compradorTelefone || '-'} | E-mail: ${proposal.compradorEmail || '-'}`, marginX + 5, currentY + 23.5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Qualificado formalmente como Proponente adquirente', marginX + 5, currentY + 28);

  // Bloco Vendedor
  const col2X = marginX + colWidth + 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, currentY, colWidth, colHeight, 1.5, 1.5, 'FD');

  // Faixa esquerda Vendedor
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.rect(col2X, currentY, 2, colHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(16, 185, 129);
  doc.text('PROPRIETÁRIO / VENDEDOR', col2X + 5, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const vendedorNome = proposal.vendedorNome || 'Proprietário Registrado';
  doc.text(doc.splitTextToSize(vendedorNome, colWidth - 8)[0] || vendedorNome, col2X + 5, currentY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`CPF/CNPJ: ${proposal.vendedorCpfCnpj || 'Não informado'}`, col2X + 5, currentY + 14.5);
  doc.text(`Telefone: ${proposal.vendedorTelefone || '-'}`, col2X + 5, currentY + 19);
  doc.text(`E-mail: ${proposal.vendedorEmail || '-'}`, col2X + 5, currentY + 23.5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Titular do domínio/direitos do imóvel objeto deste instrumento', col2X + 5, currentY + 28);

  currentY += colHeight + 6;

  // ==========================================
  // SEÇÃO 2: DO OBJETO / IMÓVEL NEGOCIADO
  // ==========================================
  checkPageBreak(28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DO OBJETO / IMÓVEL NEGOCIADO', marginX, currentY);
  currentY += 3;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`Identificação: [${proposal.imovelCodigo}] ${proposal.imovelTitulo}`, marginX + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Endereço Completo: ${proposal.imovelEndereco}`, marginX + 4, currentY + 9.5);

  if (proposal.imovelMatriculaRgi) {
    doc.text(`Matrícula Imobiliária / RGI: ${proposal.imovelMatriculaRgi}`, marginX + 4, currentY + 14);
  } else {
    doc.text('Matrícula Imobiliária: Conforme certidão de ônus e registro de imóveis competente', marginX + 4, currentY + 14);
  }

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Valor de Avaliação / Pedido Original de Tabela: ${formatCurrencyBRL(proposal.condicoes.valorTabelaImovel)}`,
    marginX + 4,
    currentY + 18.5
  );

  currentY += 26;

  // ==========================================
  // SEÇÃO 3: PREÇO E CONDIÇÕES DE PAGAMENTO
  // ==========================================
  checkPageBreak(75);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('3. DO PREÇO PROPOSTO E FLUXO FINANCEIRO', marginX, currentY);
  currentY += 3;

  // Banner em destaque com o valor total proposto
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.setDrawColor(167, 243, 208); // Emerald-200
  doc.roundedRect(marginX, currentY, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70); // Emerald-800
  doc.text('VALOR TOTAL LÍQUIDO PROPOSTO PELO COMPRADOR', marginX + 4, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(4, 120, 87); // Emerald-700
  doc.text(formatCurrencyBRL(proposal.condicoes.valorProposto), marginX + 4, currentY + 11);

  // Variação percentual
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Variação vs Tabela Original:', pageWidth - marginX - 4, currentY + 5, { align: 'right' });

  const descPercent = proposal.condicoes.descontoOuAcrescimo;
  const descText = descPercent < 0
    ? `${descPercent.toFixed(2)}% (Desconto Solicitado)`
    : descPercent > 0
    ? `+${descPercent.toFixed(2)}% (Ágio / Oferta Superior)`
    : '0.00% (Preço Integral da Tabela)';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(descPercent < 0 ? 180 : 16, descPercent < 0 ? 83 : 185, descPercent < 0 ? 9 : 129);
  doc.text(descText, pageWidth - marginX - 4, currentY + 10.5, { align: 'right' });

  currentY += 17;

  // Tabela de Composição do Pagamento
  const tableX = marginX;
  const col1W = 100;
  const col2W = 45;
  const col3W = contentWidth - col1W - col2W; // 37mm

  // Cabeçalho da Tabela
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(tableX, currentY, contentWidth, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Composição do Pagamento', tableX + 3, currentY + 4.2);
  doc.text('Forma / Previsão', tableX + col1W + 2, currentY + 4.2);
  doc.text('Valor (R$)', tableX + col1W + col2W + col3W - 3, currentY + 4.2, { align: 'right' });

  currentY += 6;

  // Linhas da Tabela
  const tableRows: Array<{ label: string; detail: string; val: number }> = [];

  tableRows.push({
    label: '1. Sinal e Princípio de Pagamento (Arras)',
    detail: `${proposal.condicoes.formaSinal} em ${proposal.condicoes.dataPrevisaoSinal || 'Imediato'}`,
    val: proposal.condicoes.valorSinalEntrada
  });

  if (proposal.condicoes.valorFgts > 0) {
    tableRows.push({
      label: '2. Liberação de Saldo FGTS',
      detail: 'Conta vinculada Caixa Econômica Federal',
      val: proposal.condicoes.valorFgts
    });
  }

  if (proposal.condicoes.valorFinanciamentoBancario > 0) {
    tableRows.push({
      label: '3. Financiamento Imobiliário Bancário',
      detail: proposal.condicoes.bancoFinanciamento || 'SFH / SFI Banco Eleito',
      val: proposal.condicoes.valorFinanciamentoBancario
    });
  }

  if (proposal.condicoes.valorParcelasDiretas > 0) {
    const qtd = proposal.condicoes.quantidadeParcelasDiretas || 1;
    const mensal = proposal.condicoes.valorParcelaMensal 
      ? ` (${formatCurrencyBRL(proposal.condicoes.valorParcelaMensal)}/mês)`
      : '';
    tableRows.push({
      label: '4. Parcelamento Direto com o Vendedor',
      detail: `${qtd} parcelas mensais${mensal}`,
      val: proposal.condicoes.valorParcelasDiretas
    });
  }

  if (proposal.condicoes.valorBaloesIntermediarias > 0) {
    const qtdBaloes = proposal.condicoes.quantidadeBaloes || 1;
    tableRows.push({
      label: '5. Intermediárias / Balões Semestrais/Anuais',
      detail: `${qtdBaloes} reforço(s) intermediário(s)`,
      val: proposal.condicoes.valorBaloesIntermediarias
    });
  }

  if (proposal.condicoes.valorPermutaBem > 0) {
    tableRows.push({
      label: '6. Dação em Pagamento / Permuta de Bem',
      detail: proposal.condicoes.descricaoPermuta || 'Bem avaliado e vistoriado pelas partes',
      val: proposal.condicoes.valorPermutaBem
    });
  }

  if (proposal.condicoes.valorSaldoEscrituraChaves > 0) {
    tableRows.push({
      label: '7. Saldo Final na Escritura Pública / Chaves',
      detail: proposal.condicoes.dataPrevisaoChaves || 'Contra entrega solene das chaves',
      val: proposal.condicoes.valorSaldoEscrituraChaves
    });
  }

  tableRows.forEach((row, index) => {
    checkPageBreak(7);
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(tableX, currentY, contentWidth, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    doc.text(row.label, tableX + 3, currentY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const detailTruncated = doc.splitTextToSize(row.detail, col2W - 4)[0] || row.detail;
    doc.text(detailTruncated, tableX + col1W + 2, currentY + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(formatCurrencyBRL(row.val), tableX + col1W + col2W + col3W - 3, currentY + 4.2, { align: 'right' });

    currentY += 6;
  });

  // Linha de Totalizador
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(tableX, currentY, contentWidth, 6.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL GERAL DA PROPOSTA', tableX + 3, currentY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87);
  doc.text(formatCurrencyBRL(proposal.condicoes.valorProposto), tableX + col1W + col2W + col3W - 3, currentY + 4.5, { align: 'right' });

  currentY += 9;

  // Condições especiais / Mobiliário
  if (proposal.condicoes.condicoesEspeciais) {
    checkPageBreak(18);
    doc.setFillColor(254, 252, 232); // Yellow-50
    doc.setDrawColor(254, 240, 138); // Yellow-200
    doc.roundedRect(marginX, currentY, contentWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(133, 77, 14); // Yellow-800
    doc.text('CONDIÇÕES ESPECIAIS, MOBILIÁRIO E OBSERVAÇÕES:', marginX + 3, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(113, 63, 18);
    const condLines = doc.splitTextToSize(proposal.condicoes.condicoesEspeciais, contentWidth - 6);
    doc.text(condLines.slice(0, 2), marginX + 3, currentY + 8.5);

    currentY += 17;
  }

  // ==========================================
  // SEÇÃO 4: HONORÁRIOS DE CORRETAGEM
  // ==========================================
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('4. DA COMISSÃO DE INTERMEDIAÇÃO IMOBILIÁRIA', marginX, currentY);
  currentY += 3;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const comissaoFormaTexto = proposal.comissao.formaCobranca === 'RETIDA_SINAL'
    ? 'mediante dedução direta no sinal de entrada (arras)'
    : proposal.comissao.formaCobranca === 'PAGA_VENDEDOR'
    ? 'paga integralmente pelo Vendedor na data do sinal'
    : 'conforme avençado entre as partes e intermediadores';

  const textoComissao = 
    `Pela intermediação exitosa deste negócio imobiliário, são devidos honorários profissionais de corretagem à imobiliária interveniente ` +
    `${agencyName} (${agencyCreci}), no percentual de ${proposal.comissao.percentualComissao}% (${proposal.comissao.percentualComissao} por cento) sobre o valor total fechado, ` +
    `perfazendo o montante irrevogável de ${formatCurrencyBRL(proposal.comissao.valorComissaoTotal)}, a serem pagos ${comissaoFormaTexto}. ` +
    `Corretor de Imóveis Intermediador: ${proposal.corretorResponsavelNome} (CRECI: ${proposal.corretorCreci || 'Ativo'}).`;

  const comissaoLines = doc.splitTextToSize(textoComissao, contentWidth);
  doc.text(comissaoLines, marginX, currentY + 3.5);
  currentY += (comissaoLines.length * 3.6) + 4;

  // ==========================================
  // SEÇÃO 5: VALIDADE E DECISÃO DO VENDEDOR
  // ==========================================
  checkPageBreak(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('5. DA VALIDADE E DECISÃO FORMAL DO VENDEDOR', marginX, currentY);
  currentY += 3;

  const validadeTexto = 
    `A presente proposta de compra e venda possui prazo de validade de ${proposal.condicoes.validadeDiasUteis} dias úteis, expirando-se ` +
    `em ${proposal.condicoes.dataExpiracao || 'data estipulada em cartório'}, momento após o qual, na ausência de aceite formal escrito ou contraproposta, ` +
    `restará extinta de pleno direito sem qualquer ônus, penalidade ou obrigação indenizatória entre as partes. ` +
    `Havendo concordância e aceite por parte do Vendedor, as partes obrigam-se à elaboração do Contrato de Compromisso de Compra e Venda definitivo no prazo máximo de 5 (cinco) dias úteis.`;

  const validadeLines = doc.splitTextToSize(validadeTexto, contentWidth);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);
  doc.text(validadeLines, marginX, currentY + 3.5);
  currentY += (validadeLines.length * 3.4) + 4;

  // Caixa de Decisão do Vendedor
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(marginX, currentY, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('MANIFESTAÇÃO DE VONTADE DO PROPRIETÁRIO / VENDEDOR:', marginX + 4, currentY + 4.5);

  const decisao = proposal.historicoAceite?.decisaoVendedor;

  // Opção 1: Aceito
  const opt1Checked = decisao === 'ACEITO';
  doc.setFont('helvetica', opt1Checked ? 'bold' : 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(opt1Checked ? 22 : 71, opt1Checked ? 101 : 85, opt1Checked ? 52 : 105);
  doc.text(opt1Checked ? '[ X ]  ACEITO A PROPOSTA INTEGRALMENTE' : '[   ]  ACEITO A PROPOSTA INTEGRALMENTE', marginX + 6, currentY + 10);

  // Opção 2: Contraproposta
  const opt2Checked = decisao === 'CONTRAPROPOSTA';
  doc.setFont('helvetica', opt2Checked ? 'bold' : 'normal');
  doc.setTextColor(opt2Checked ? 146 : 71, opt2Checked ? 64 : 85, opt2Checked ? 14 : 105);
  doc.text(opt2Checked ? '[ X ]  CONTRAPROPOSTA COM NOVOS TERMOS' : '[   ]  CONTRAPROPOSTA COM NOVOS TERMOS', marginX + 68, currentY + 10);

  // Opção 3: Recusada
  const opt3Checked = decisao === 'RECUSADO';
  doc.setFont('helvetica', opt3Checked ? 'bold' : 'normal');
  doc.setTextColor(opt3Checked ? 153 : 71, opt3Checked ? 27 : 85, opt3Checked ? 27 : 105);
  doc.text(opt3Checked ? '[ X ]  RECUSADA' : '[   ]  RECUSADA', marginX + 138, currentY + 10);

  // Parecer / Data
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  if (proposal.historicoAceite?.parecerVendedor) {
    doc.text(`Parecer do Vendedor: "${proposal.historicoAceite.parecerVendedor}"`, marginX + 6, currentY + 16);
  } else {
    doc.text('Declaro ter ciência das condições financeiras e aprovação desta proposta na forma da lei.', marginX + 6, currentY + 16);
  }

  if (proposal.historicoAceite?.valorContraproposta) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(`Valor Contraproposta: ${formatCurrencyBRL(proposal.historicoAceite.valorContraproposta)}`, pageWidth - marginX - 6, currentY + 16, { align: 'right' });
  }

  currentY += 26;

  // ==========================================
  // SEÇÃO 6: CAMPOS DE ASSINATURA
  // ==========================================
  checkPageBreak(38);
  currentY += 4;

  const signWidth = (contentWidth - 12) / 2;

  // Linha Assinatura Comprador
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY + 12, marginX + signWidth, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(compradorNome, marginX + (signWidth / 2), currentY + 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Proponente Comprador • CPF: ${proposal.compradorCpfCnpj || '-'}`, marginX + (signWidth / 2), currentY + 19.5, { align: 'center' });

  // Linha Assinatura Vendedor
  const sign2X = marginX + signWidth + 12;
  doc.setDrawColor(15, 23, 42);
  doc.line(sign2X, currentY + 12, sign2X + signWidth, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(vendedorNome, sign2X + (signWidth / 2), currentY + 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Proprietário / Vendedor • CPF/CNPJ: ${proposal.vendedorCpfCnpj || '-'}`, sign2X + (signWidth / 2), currentY + 19.5, { align: 'center' });

  // Linha Assinatura Corretor Intermediador (Centro)
  const sign3W = 90;
  const sign3X = (pageWidth - sign3W) / 2;
  const sign3Y = currentY + 28;

  checkPageBreak(24);
  doc.setDrawColor(15, 23, 42);
  doc.line(sign3X, sign3Y, sign3X + sign3W, sign3Y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${proposal.corretorResponsavelNome} - CRECI ${proposal.corretorCreci || 'Ativo'}`, pageWidth / 2, sign3Y + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Corretor de Imóveis Intermediador • ${agencyName}`, pageWidth / 2, sign3Y + 7.5, { align: 'center' });

  // ==========================================
  // RODAPÉ COM HASH DE VALIDAÇÃO E PAGINAÇÃO
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Linha inferior
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);

    const hashAuth = `SHA256-${proposal.id.toUpperCase()}-AUTH-${proposal.codigo}`;
    doc.text(`AcertGo Vendas Intelligence • Minuta Oficial de Fechamento • Autenticação: ${hashAuth}`, marginX, pageHeight - 8);

    doc.text(`Página ${i} de ${totalPages}`, pageWidth - marginX, pageHeight - 8, { align: 'right' });
  }

  return doc;
}

/**
 * Dispara o download automático do arquivo PDF no navegador
 */
export function downloadProposalPdf(
  proposal: PropostaVenda,
  options: GenerateProposalPdfOptions = {}
): void {
  const doc = generateSalesProposalPdf(proposal, options);
  const cleanCode = proposal.codigo.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Proposta_${cleanCode}_${proposal.imovelCodigo}.pdf`;
  doc.save(fileName);
}

/**
 * Gera um Data URL (blob/base64) para pré-visualização em iframe ou envio
 */
export function getProposalPdfBlobUrl(
  proposal: PropostaVenda,
  options: GenerateProposalPdfOptions = {}
): string {
  const doc = generateSalesProposalPdf(proposal, options);
  return doc.output('bloburl').toString();
}

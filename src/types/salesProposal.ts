export type StatusProposta = 
  | 'RASCUNHO'
  | 'ENCAMINHADA_VENDEDOR'
  | 'CONTRAPROPOSTA'
  | 'ACEITA_VENDIDO'
  | 'RECUSADA'
  | 'EXPIRADA';

export type FormaComissao = 
  | 'RETIDA_SINAL'
  | 'PAGA_VENDEDOR'
  | 'PAGA_COMPRADOR'
  | 'DIVIDIDA_PARTES';

export interface CondicaoPagamentoProposta {
  valorTabelaImovel: number;
  valorProposto: number;
  descontoOuAcrescimo: number; // Percentual
  
  // Detalhamento do Fluxo Financeiro
  valorSinalEntrada: number;
  dataPrevisaoSinal: string;
  formaSinal: 'PIX' | 'TED' | 'CHEQUE_ADM';
  
  valorFgts: number;
  
  valorFinanciamentoBancario: number;
  bancoFinanciamento?: string;
  
  valorParcelasDiretas: number;
  quantidadeParcelasDiretas?: number;
  valorParcelaMensal?: number;
  
  valorBaloesIntermediarias: number;
  quantidadeBaloes?: number;
  
  valorPermutaBem: number;
  descricaoPermuta?: string;
  
  valorSaldoEscrituraChaves: number;
  dataPrevisaoChaves?: string;
  
  // Validade e Regras
  validadeDiasUteis: number;
  dataExpiracao: string;
  condicoesEspeciais: string;
}

export interface DetalhesComissaoProposta {
  percentualComissao: number; // ex: 6%
  valorComissaoTotal: number;
  formaCobranca: FormaComissao;
  splitCorretorFechador: {
    nome: string;
    percentual: number;
    valor: number;
  };
  splitCorretorCaptador: {
    nome: string;
    percentual: number;
    valor: number;
  };
  splitImobiliaria: {
    nome: string;
    percentual: number;
    valor: number;
  };
}

export interface PropostaVenda {
  id: string;
  codigo: string; // Ex: "PROP-2026-081"
  dataCriacao: string;
  dataUltimaAtualizacao: string;
  
  // Imóvel
  imovelId: string;
  imovelCodigo: string;
  imovelTitulo: string;
  imovelEndereco: string;
  imovelMatriculaRgi?: string;
  imovelFotoUrl?: string;
  
  // Proprietário / Vendedor
  vendedorId?: string;
  vendedorNome: string;
  vendedorCpfCnpj: string;
  vendedorTelefone: string;
  vendedorEmail: string;
  
  // Proponente / Comprador
  compradorId?: string;
  compradorNome: string;
  compradorCpfCnpj: string;
  compradorRg?: string;
  compradorTelefone: string;
  compradorEmail: string;
  compradorProfissao?: string;
  compradorEstadoCivil?: string;
  
  // Condições Financeiras
  condicoes: CondicaoPagamentoProposta;
  
  // Comissão
  comissao: DetalhesComissaoProposta;
  
  // Corretor Responsável
  corretorResponsavelNome: string;
  corretorResponsavelId?: string;
  corretorCreci: string;
  
  // Status & Aceite
  status: StatusProposta;
  historicoAceite?: {
    decisaoVendedor?: 'ACEITO' | 'CONTRAPROPOSTA' | 'RECUSADO';
    dataDecisao?: string;
    parecerVendedor?: string;
    valorContraproposta?: number;
    condicoesContraproposta?: string;
  };
  
  // Assinatura digital
  assinaturaDigitalUrl?: string;
}

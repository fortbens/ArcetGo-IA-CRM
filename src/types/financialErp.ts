export type StatusConta = 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO' | 'AGENDADO';

export type FormaPagamento = 
  | 'PIX' 
  | 'BOLETO' 
  | 'CARTAO_CREDITO' 
  | 'CARTAO_DEBITO' 
  | 'TED_DOC' 
  | 'DINHEIRO_ESPECIE' 
  | 'CHEQUE';

export type CategoriaDespesa = 
  | 'FORNECEDORES'
  | 'SALARIAL_FOLHA'
  | 'PRO_LABORE'
  | 'MANUTENCAO_IMOVEL'
  | 'CARTORIO_CERTIDOES'
  | 'DESPACHOS_TAXAS'
  | 'JURIDICO_HONORARIOS'
  | 'DESLOCAMENTO_MOTOBOY'
  | 'MARKETING_ANUNCIOS'
  | 'TECNOLOGIA_SOFTWARE'
  | 'TRIBUTOS_IMPOSTOS'
  | 'INFRAESTRUTURA_ALUGUEL'
  | 'OUTRAS_DESPESAS';

export type OrigemReceita = 
  | 'COMISSAO_VENDA'
  | 'TAXA_INTERMEDIACAO_LOCACAO'
  | 'TAXA_ADMINISTRACAO_LOCACAO'
  | 'SERVICO_DESPACHANTE'
  | 'TAXA_AVALIACAO_IMOVEL'
  | 'TAXA_ANALISE_CREDITO'
  | 'SERVICO_PDV_BALCAO'
  | 'RENDIMENTOS_APLICACOES'
  | 'OUTRAS_RECEITAS';

export type TipoServicoPdv = 
  | 'CERTIDAO_CARTORIO_RGI'
  | 'CERTIDAO_ONUS_REAIS'
  | 'CERTIDAO_PROTESTO'
  | 'DESPACHO_PREFEITURA'
  | 'GUIA_HONORARIOS_JURIDICOS'
  | 'MANUTENCAO_REPARO'
  | 'DESLOCAMENTO_MOTOBOY'
  | 'CHAVEIRO_TROCA_SEGREDO'
  | 'AUTENTICACAO_RECONHECIMENTO'
  | 'OUTROS_SERVICOS';

export interface Fornecedor {
  id: string;
  codigo: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpjCpf: string;
  categoria: CategoriaDespesa;
  email: string;
  telefone: string;
  chavePix?: string;
  tipoChavePix?: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
  };
  cidade: string;
  estado: string;
  status: 'ATIVO' | 'INATIVO';
  observacoes?: string;
  totalFaturado: number;
}

export interface ContaPagar {
  id: string;
  codigo: string;
  descricao: string;
  fornecedorId?: string;
  favorecidoNome: string;
  categoria: CategoriaDespesa;
  centroCusto: string;
  valor: number;
  dataEmissao: string;
  dataVencimento: string;
  dataPagamento?: string;
  formaPagamento: FormaPagamento;
  status: StatusConta;
  numeroDocumento?: string;
  anexoComprovanteUrl?: string;
  observacoes?: string;
  pagoPor?: string;
}

export interface ContaReceber {
  id: string;
  codigo: string;
  descricao: string;
  clienteId?: string;
  clienteNome: string;
  imovelCodigo?: string;
  origem: OrigemReceita;
  valorPrevisto: number;
  valorRecebido?: number;
  dataVencimento: string;
  dataRecebimento?: string;
  formaPagamento: FormaPagamento;
  status: StatusConta;
  jurosMulta?: number;
  descontoConcedido?: number;
  numeroDocumento?: string;
  comprovanteReciboUrl?: string;
  observacoes?: string;
}

export interface LancamentoSalarial {
  id: string;
  codigo: string;
  colaboradorNome: string;
  cargo: string;
  departamento: 'VENDAS' | 'LOCACAO' | 'FINANCEIRO' | 'JURIDICO' | 'DIRETORIA' | 'ATENDIMENTO' | 'TI';
  tipoContrato: 'CLT' | 'PJ' | 'ESTAGIO' | 'PRO_LABORE_SOCIO' | 'AUTONOMO_COMISSIONADO';
  salarioBase: number;
  beneficios: number;
  adiantamento: number;
  descontos: number;
  valorLiquido: number;
  mesReferencia: string; // Ex: "09/2026"
  dataPrevista: string;
  dataPagamento?: string;
  status: 'PROGRAMADO' | 'PAGO' | 'PENDENTE';
  chavePix?: string;
}

export interface TransacaoPdv {
  id: string;
  codigo: string;
  tipo: 'ENTRADA' | 'SAIDA';
  tipoServico: TipoServicoPdv;
  descricao: string;
  clienteOuPrestador: string;
  imovelCodigoReferencia?: string;
  processoNumero?: string;
  valor: number;
  formaPagamento: FormaPagamento;
  dataHora: string;
  operadorCaixa: string;
  reciboEmitido: boolean;
  observacoes?: string;
}

export interface DispensaFinanceira {
  id: string;
  codigo: string;
  tipoDispensa: 'MULTA_MORATORIA' | 'JUROS_ATRASO' | 'TAXA_ADMINISTRATIVA' | 'TAXA_VISTORIA' | 'TAXA_EXPEDIENTE';
  beneficiarioNome: string;
  imovelCodigo?: string;
  contratoCodigo?: string;
  valorOriginal: number;
  valorDispensado: number;
  valorFinalCobrado: number;
  dataSolicitacao: string;
  dataAprovacao?: string;
  solicitanteNome: string;
  aprovadorNome: string;
  motivoJustificativa: string;
  status: 'APROVADO' | 'RECUSADO' | 'PENDENTE_DIRETORIA';
}

export interface ItemDre {
  descricao: string;
  valor: number;
  percentual: number;
  destaque?: boolean;
  subItens?: {
    descricao: string;
    valor: number;
    percentual: number;
  }[];
}

export interface DemonstrativoDre {
  periodo: string; // "Setembro / 2026"
  receitaBruta: ItemDre;
  deducoesImpostos: ItemDre;
  receitaLiquida: ItemDre;
  custosOperacionais: ItemDre;
  lucroBruto: ItemDre;
  despesasOperacionais: ItemDre;
  ebitda: ItemDre;
  depreciacaoAmortizacao: ItemDre;
  resultadoFinanceiro: ItemDre;
  lucroLiquido: ItemDre;
}

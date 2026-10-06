import { 
  ContaPagar, 
  ContaReceber, 
  Fornecedor, 
  LancamentoSalarial, 
  TransacaoPdv, 
  DispensaFinanceira, 
  DemonstrativoDre 
} from '../types/financialErp';

export const MOCK_FORNECEDORES: Fornecedor[] = [
  {
    id: 'forn-1',
    codigo: 'FORN-001',
    razaoSocial: 'Cartório do 1º Ofício de Registro de Imóveis',
    nomeFantasia: '1º RGI Central',
    cnpjCpf: '12.345.678/0001-90',
    categoria: 'CARTORIO_CERTIDOES',
    email: 'certidoes@1rgicentral.not.br',
    telefone: '(11) 3245-8800',
    chavePix: '12345678000190',
    tipoChavePix: 'CNPJ',
    dadosBancarios: { banco: 'Banco do Brasil', agencia: '1234-5', conta: '98765-4' },
    cidade: 'São Paulo',
    estado: 'SP',
    status: 'ATIVO',
    totalFaturado: 18450.00,
    observacoes: 'Emissão ágil de certidões de ônus reais e vintenárias em 24h.'
  },
  {
    id: 'forn-2',
    codigo: 'FORN-002',
    razaoSocial: 'Alfa Prime Manutenção Predial e Reformas ME',
    nomeFantasia: 'Alfa Reparos & Chaveiro 24h',
    cnpjCpf: '23.456.789/0001-01',
    categoria: 'MANUTENCAO_IMOVEL',
    email: 'atendimento@alfareparos.com.br',
    telefone: '(11) 98765-4321',
    chavePix: 'contato@alfareparos.com.br',
    tipoChavePix: 'EMAIL',
    dadosBancarios: { banco: 'Itaú Unibanco', agencia: '0342', conta: '45678-9' },
    cidade: 'São Paulo',
    estado: 'SP',
    status: 'ATIVO',
    totalFaturado: 12300.00,
    observacoes: 'Manutenção preventiva e corretiva para imóveis de locação e troca de segredos.'
  },
  {
    id: 'forn-3',
    codigo: 'FORN-003',
    razaoSocial: 'Veloce Courier e Logística Express EIRELI',
    nomeFantasia: 'Veloce Motoboy Express',
    cnpjCpf: '34.567.890/0001-12',
    categoria: 'DESLOCAMENTO_MOTOBOY',
    email: 'financeiro@velocelog.com.br',
    telefone: '(11) 97112-3344',
    chavePix: '34567890000112',
    tipoChavePix: 'CNPJ',
    cidade: 'São Paulo',
    estado: 'SP',
    status: 'ATIVO',
    totalFaturado: 3890.00,
    observacoes: 'Entrega urgente de chaves para vistorias e contratos para assinaturas físicas.'
  },
  {
    id: 'forn-4',
    codigo: 'FORN-004',
    razaoSocial: 'Despachante Imobiliário Oliveira & Associados',
    nomeFantasia: 'Oliveira Assessoria Imobiliária',
    cnpjCpf: '45.678.901/0001-23',
    categoria: 'DESPACHOS_TAXAS',
    email: 'contato@oliveiradespachos.com.br',
    telefone: '(11) 3105-9922',
    chavePix: 'financeiro@oliveiradespachos.com.br',
    tipoChavePix: 'EMAIL',
    cidade: 'São Paulo',
    estado: 'SP',
    status: 'ATIVO',
    totalFaturado: 9400.00,
    observacoes: 'Despachos de ITBI, certidões negativas forenses e quitação de IPTU.'
  },
  {
    id: 'forn-5',
    codigo: 'FORN-005',
    razaoSocial: 'Cloud Fiber Telecomunicações S.A.',
    nomeFantasia: 'Link Dedicado Fibra',
    cnpjCpf: '56.789.012/0001-34',
    categoria: 'TECNOLOGIA_SOFTWARE',
    email: 'cobranca@cloudfiber.com.br',
    telefone: '(11) 4004-9090',
    chavePix: '56789012000134',
    tipoChavePix: 'CNPJ',
    cidade: 'São Paulo',
    estado: 'SP',
    status: 'ATIVO',
    totalFaturado: 8900.00,
    observacoes: 'Link de internet redundante e PABX em nuvem da matriz.'
  }
];

export const MOCK_CONTAS_PAGAR: ContaPagar[] = [
  {
    id: 'pag-001',
    codigo: 'PAG-1001',
    descricao: 'Aluguel do Edifício Sede Corporativa e IPTU',
    favorecidoNome: 'Condomínio Prime Plaza Offices',
    categoria: 'INFRAESTRUTURA_ALUGUEL',
    centroCusto: 'ADMINISTRATIVO / SEDE',
    valor: 14500.00,
    dataEmissao: '2026-09-01',
    dataVencimento: '2026-09-10',
    dataPagamento: '2026-09-09',
    formaPagamento: 'BOLETO',
    status: 'PAGO',
    numeroDocumento: 'BOL-98234-SED',
    pagoPor: 'Diretoria Financeira'
  },
  {
    id: 'pag-002',
    codigo: 'PAG-1002',
    descricao: 'Pacote de 15 Certidões de Ôus e Vintenárias para Fechamentos de Venda',
    fornecedorId: 'forn-1',
    favorecidoNome: '1º RGI Central',
    categoria: 'CARTORIO_CERTIDOES',
    centroCusto: 'OPERAÇÕES IMOBILIÁRIAS',
    valor: 2450.00,
    dataEmissao: '2026-09-15',
    dataVencimento: '2026-09-28',
    formaPagamento: 'PIX',
    status: 'PENDENTE',
    numeroDocumento: 'RGI-2026-889'
  },
  {
    id: 'pag-003',
    codigo: 'PAG-1003',
    descricao: 'Reparo hidráulico e elétrica de emergência - Apto 802 Jardim Paulista',
    fornecedorId: 'forn-2',
    favorecidoNome: 'Alfa Reparos & Chaveiro 24h',
    categoria: 'MANUTENCAO_IMOVEL',
    centroCusto: 'LOCAÇÃO / ATENDIMENTO',
    valor: 890.00,
    dataEmissao: '2026-09-20',
    dataVencimento: '2026-09-30',
    formaPagamento: 'PIX',
    status: 'PENDENTE',
    numeroDocumento: 'OS-MAN-554'
  },
  {
    id: 'pag-004',
    codigo: 'PAG-1004',
    descricao: 'Campanha de Tráfego Pago Meta Ads & Google Ads - Lançamentos Alto Padrão',
    favorecidoNome: 'Meta Platforms & Google Ads Brasil',
    categoria: 'MARKETING_ANUNCIOS',
    centroCusto: 'MARKETING & GROWTH',
    valor: 6800.00,
    dataEmissao: '2026-09-05',
    dataVencimento: '2026-09-20',
    dataPagamento: '2026-09-19',
    formaPagamento: 'CARTAO_CREDITO',
    status: 'PAGO',
    numeroDocumento: 'INV-MKT-771',
    pagoPor: 'Gerência de Marketing'
  },
  {
    id: 'pag-005',
    codigo: 'PAG-1005',
    descricao: 'Simples Nacional / DAS Competência 08/2026',
    favorecidoNome: 'Receita Federal do Brasil',
    categoria: 'TRIBUTOS_IMPOSTOS',
    centroCusto: 'FISCAL / CONTÁBIL',
    valor: 11450.80,
    dataEmissao: '2026-09-01',
    dataVencimento: '2026-09-20',
    dataPagamento: '2026-09-20',
    formaPagamento: 'BOLETO',
    status: 'PAGO',
    numeroDocumento: 'DAS-2026-09-99'
  },
  {
    id: 'pag-006',
    codigo: 'PAG-1006',
    descricao: 'Honorários de Assessoria Jurídica Mensal - Contratos e Due Diligence',
    favorecidoNome: 'Castro & Mendes Sociedade de Advogados',
    categoria: 'JURIDICO_HONORARIOS',
    centroCusto: 'JURÍDICO',
    valor: 5500.00,
    dataEmissao: '2026-09-10',
    dataVencimento: '2026-10-05',
    formaPagamento: 'TED_DOC',
    status: 'AGENDADO',
    numeroDocumento: 'NF-ADV-2026'
  },
  {
    id: 'pag-007',
    codigo: 'PAG-1007',
    descricao: 'Serviço de Motoboy e Entrega de Malotes - Fechamento Quinzenal',
    fornecedorId: 'forn-3',
    favorecidoNome: 'Veloce Motoboy Express',
    categoria: 'DESLOCAMENTO_MOTOBOY',
    centroCusto: 'LOGÍSTICA / GERAL',
    valor: 640.00,
    dataEmissao: '2026-09-25',
    dataVencimento: '2026-09-27',
    formaPagamento: 'PIX',
    status: 'VENCIDO',
    numeroDocumento: 'FAT-VEL-304'
  }
];

export const MOCK_CONTAS_RECEBER: ContaReceber[] = [
  {
    id: 'rec-001',
    codigo: 'REC-2001',
    descricao: 'Comissão de Intermediação - Venda Apto 142 Ed. Mansão Figueira',
    clienteNome: 'Roberto Justus Alcantara',
    imovelCodigo: 'AP-PIN-044',
    origem: 'COMISSAO_VENDA',
    valorPrevisto: 72000.00,
    valorRecebido: 72000.00,
    dataVencimento: '2026-09-15',
    dataRecebimento: '2026-09-14',
    formaPagamento: 'TED_DOC',
    status: 'PAGO',
    numeroDocumento: 'REC-COM-8823',
    comprovanteReciboUrl: '#'
  },
  {
    id: 'rec-002',
    codigo: 'REC-2002',
    descricao: 'Taxa de Intermediação Primeiro Aluguel - Cobertura Vila Madalena',
    clienteNome: 'Mariana Duarte Camargo',
    imovelCodigo: 'COB-VM-012',
    origem: 'TAXA_INTERMEDIACAO_LOCACAO',
    valorPrevisto: 14000.00,
    valorRecebido: 14000.00,
    dataVencimento: '2026-09-18',
    dataRecebimento: '2026-09-18',
    formaPagamento: 'PIX',
    status: 'PAGO',
    numeroDocumento: 'REC-LOC-4412'
  },
  {
    id: 'rec-003',
    codigo: 'REC-2003',
    descricao: 'Taxas de Administração de Carteira de Locação (148 Imóveis Ativos)',
    clienteNome: 'Pool de Proprietários Locatícios AcertGo',
    origem: 'TAXA_ADMINISTRACAO_LOCACAO',
    valorPrevisto: 38400.00,
    dataVencimento: '2026-09-30',
    formaPagamento: 'BOLETO',
    status: 'PENDENTE',
    numeroDocumento: 'FAT-ADM-0926'
  },
  {
    id: 'rec-004',
    codigo: 'REC-2004',
    descricao: 'Comissão Parcela 2/3 - Venda Casa em Condomínio Fechado Alphaville',
    clienteNome: 'Carlos Eduardo Nogueira',
    imovelCodigo: 'CS-ALPH-90',
    origem: 'COMISSAO_VENDA',
    valorPrevisto: 45000.00,
    dataVencimento: '2026-09-25',
    formaPagamento: 'TED_DOC',
    status: 'VENCIDO',
    jurosMulta: 900.00,
    numeroDocumento: 'DUP-VEN-991'
  },
  {
    id: 'rec-005',
    codigo: 'REC-2005',
    descricao: 'Reembolso e Honorários de Despachante - Vistoria e ITBI Apto Brooklin',
    clienteNome: 'Fernanda Montenegro Silva',
    imovelCodigo: 'AP-BRK-201',
    origem: 'SERVICO_DESPACHANTE',
    valorPrevisto: 3200.00,
    dataVencimento: '2026-10-02',
    formaPagamento: 'PIX',
    status: 'AGENDADO',
    numeroDocumento: 'OS-DSP-119'
  }
];

export const MOCK_FOLHA_SALARIAL: LancamentoSalarial[] = [
  {
    id: 'sal-001',
    codigo: 'FOL-001',
    colaboradorNome: 'Dr. Leonardo Carneiro',
    cargo: 'Diretor Presidente / CEO',
    departamento: 'DIRETORIA',
    tipoContrato: 'PRO_LABORE_SOCIO',
    salarioBase: 25000.00,
    beneficios: 0,
    adiantamento: 10000.00,
    descontos: 2750.00,
    valorLiquido: 12250.00,
    mesReferencia: '09/2026',
    dataPrevista: '2026-10-05',
    status: 'PROGRAMADO',
    chavePix: 'diretorcarneiro@gmail.com'
  },
  {
    id: 'sal-002',
    codigo: 'FOL-002',
    colaboradorNome: 'Renata Albuquerque de Sousa',
    cargo: 'Gerente Geral de Vendas & Parcerias',
    departamento: 'VENDAS',
    tipoContrato: 'CLT',
    salarioBase: 8500.00,
    beneficios: 1200.00,
    adiantamento: 3400.00,
    descontos: 1680.00,
    valorLiquido: 4620.00,
    mesReferencia: '09/2026',
    dataPrevista: '2026-10-05',
    status: 'PROGRAMADO',
    chavePix: 'renata.vendas@acertgo.com.br'
  },
  {
    id: 'sal-003',
    codigo: 'FOL-003',
    colaboradorNome: 'Lucas Martins Ferreira',
    cargo: 'Coordenador Financeiro & Controladoria',
    departamento: 'FINANCEIRO',
    tipoContrato: 'CLT',
    salarioBase: 6800.00,
    beneficios: 1100.00,
    adiantamento: 2720.00,
    descontos: 1350.00,
    valorLiquido: 3830.00,
    mesReferencia: '09/2026',
    dataPrevista: '2026-10-05',
    status: 'PROGRAMADO',
    chavePix: '11988887766'
  },
  {
    id: 'sal-004',
    codigo: 'FOL-004',
    colaboradorNome: 'Camila Rossi Siqueira',
    cargo: 'Secretária Executiva & Balcão PDV',
    departamento: 'ATENDIMENTO',
    tipoContrato: 'CLT',
    salarioBase: 3800.00,
    beneficios: 950.00,
    adiantamento: 1520.00,
    descontos: 610.00,
    valorLiquido: 2620.00,
    mesReferencia: '09/2026',
    dataPrevista: '2026-10-05',
    status: 'PROGRAMADO',
    chavePix: 'camila.secretaria@acertgo.com.br'
  },
  {
    id: 'sal-005',
    codigo: 'FOL-005',
    colaboradorNome: 'Diego Vasconcelos',
    cargo: 'Advogado Pleno Imobiliário',
    departamento: 'JURIDICO',
    tipoContrato: 'PJ',
    salarioBase: 7500.00,
    beneficios: 0,
    adiantamento: 0,
    descontos: 0,
    valorLiquido: 7500.00,
    mesReferencia: '09/2026',
    dataPrevista: '2026-10-05',
    status: 'PROGRAMADO',
    chavePix: '39485720000188'
  }
];

export const MOCK_TRANSACOES_PDV: TransacaoPdv[] = [
  {
    id: 'pdv-001',
    codigo: 'PDV-801',
    tipo: 'ENTRADA',
    tipoServico: 'CERTIDAO_CARTORIO_RGI',
    descricao: 'Recebimento de Certidão Vintenária com Ônus Reais - Venda Apto 101 Moema',
    clienteOuPrestador: 'Maurício Gusmão',
    imovelCodigoReferencia: 'AP-MOE-101',
    processoNumero: 'PROC-2026-091',
    valor: 285.00,
    formaPagamento: 'PIX',
    dataHora: '2026-09-28 09:14',
    operadorCaixa: 'Camila Rossi (Balcão)',
    reciboEmitido: true
  },
  {
    id: 'pdv-002',
    codigo: 'PDV-802',
    tipo: 'SAIDA',
    tipoServico: 'DESLOCAMENTO_MOTOBOY',
    descricao: 'Adiantamento de Motoboy para entrega de chaves e recolhimento de assinatura física',
    clienteOuPrestador: 'Veloce Motoboy Express',
    imovelCodigoReferencia: 'CS-ALPH-90',
    valor: 65.00,
    formaPagamento: 'DINHEIRO_ESPECIE',
    dataHora: '2026-09-28 10:30',
    operadorCaixa: 'Camila Rossi (Balcão)',
    reciboEmitido: true
  },
  {
    id: 'pdv-003',
    codigo: 'PDV-803',
    tipo: 'ENTRADA',
    tipoServico: 'DESPACHO_PREFEITURA',
    descricao: 'Taxa de Guia de ITBI e Emissão de Certidão Negativa de Tributos Imobiliários',
    clienteOuPrestador: 'Juliana Paes de Barros',
    imovelCodigoReferencia: 'AP-PIN-044',
    processoNumero: 'ITBI-SP-2026/882',
    valor: 450.00,
    formaPagamento: 'PIX',
    dataHora: '2026-09-28 11:15',
    operadorCaixa: 'Camila Rossi (Balcão)',
    reciboEmitido: true
  },
  {
    id: 'pdv-004',
    codigo: 'PDV-804',
    tipo: 'SAIDA',
    tipoServico: 'CHAVEIRO_TROCA_SEGREDO',
    descricao: 'Pagamento imediato de Chaveiro para troca de miolo e 4 cópias para vistoria de entrega',
    clienteOuPrestador: 'Alfa Reparos & Chaveiro 24h',
    imovelCodigoReferencia: 'AP-BRK-201',
    valor: 180.00,
    formaPagamento: 'PIX',
    dataHora: '2026-09-28 13:40',
    operadorCaixa: 'Camila Rossi (Balcão)',
    reciboEmitido: true
  },
  {
    id: 'pdv-005',
    codigo: 'PDV-805',
    tipo: 'ENTRADA',
    tipoServico: 'GUIA_HONORARIOS_JURIDICOS',
    descricao: 'Taxa de Abertura de Dossiê e Análise de Crédito Locatício Especial',
    clienteOuPrestador: 'Thiago Lacerda Prado',
    imovelCodigoReferencia: 'COB-VM-012',
    valor: 350.00,
    formaPagamento: 'CARTAO_DEBITO',
    dataHora: '2026-09-28 15:20',
    operadorCaixa: 'Camila Rossi (Balcão)',
    reciboEmitido: true
  },
  {
    id: 'pdv-006',
    codigo: 'PDV-806',
    tipo: 'SAIDA',
    tipoServico: 'AUTENTICACAO_RECONHECIMENTO',
    descricao: 'Custas em dinheiro no cartório para 6 autenticações e abertura de ficha de firma',
    clienteOuPrestador: '14º Tabelião de Notas',
    valor: 112.50,
    formaPagamento: 'DINHEIRO_ESPECIE',
    dataHora: '2026-09-28 16:05',
    operadorCaixa: 'Camila Rossi (Balcão)',
    reciboEmitido: true
  }
];

export const MOCK_DISPENSAS: DispensaFinanceira[] = [
  {
    id: 'disp-001',
    codigo: 'DSP-01',
    tipoDispensa: 'MULTA_MORATORIA',
    beneficiarioNome: 'Dr. Sergio Mattos (Inquilino Apto 54)',
    imovelCodigo: 'AP-JDP-054',
    contratoCodigo: 'CTR-LOC-2025-88',
    valorOriginal: 540.00,
    valorDispensado: 540.00,
    valorFinalCobrado: 0,
    dataSolicitacao: '2026-09-12',
    dataAprovacao: '2026-09-12',
    solicitanteNome: 'Renata Albuquerque (Gerente)',
    aprovadorNome: 'Dr. Leonardo Carneiro (Diretor)',
    motivoJustificativa: 'Problema comprovado no sistema do banco no dia do vencimento. Cliente há 4 anos sem atrasos.',
    status: 'APROVADO'
  },
  {
    id: 'disp-002',
    codigo: 'DSP-02',
    tipoDispensa: 'TAXA_VISTORIA',
    beneficiarioNome: 'Espólio de Helena Silveira',
    imovelCodigo: 'AP-HIG-102',
    contratoCodigo: 'CTR-ADM-993',
    valorOriginal: 350.00,
    valorDispensado: 175.00,
    valorFinalCobrado: 175.00,
    dataSolicitacao: '2026-09-22',
    dataAprovacao: '2026-09-23',
    solicitanteNome: 'Lucas Martins (Financeiro)',
    aprovadorNome: 'Dr. Leonardo Carneiro (Diretor)',
    motivoJustificativa: 'Acordo comercial devido à exclusividade de 12 meses na carteira de locação.',
    status: 'APROVADO'
  },
  {
    id: 'disp-003',
    codigo: 'DSP-03',
    tipoDispensa: 'JUROS_ATRASO',
    beneficiarioNome: 'Beatriz Vasconcelos',
    imovelCodigo: 'AP-PIN-044',
    valorOriginal: 280.00,
    valorDispensado: 280.00,
    valorFinalCobrado: 0,
    dataSolicitacao: '2026-09-27',
    solicitanteNome: 'Camila Rossi (Atendimento)',
    aprovadorNome: 'Diretoria Executiva',
    motivoJustificativa: 'Inquilina esteve hospitalizada com atestado médico comprovando impossibilidade no vencimento.',
    status: 'PENDENTE_DIRETORIA'
  }
];

export const MOCK_DRE_DATA: DemonstrativoDre = {
  periodo: 'Setembro / 2026',
  receitaBruta: {
    descricao: '1. RECEITA OPERACIONAL BRUTA',
    valor: 173535.00,
    percentual: 100,
    destaque: true,
    subItens: [
      { descricao: 'Comissões sobre Vendas de Imóveis', valor: 117000.00, percentual: 67.4 },
      { descricao: 'Taxas de Intermediação de Locação', valor: 14000.00, percentual: 8.1 },
      { descricao: 'Taxas de Administração de Imóveis (Locação)', valor: 38400.00, percentual: 22.1 },
      { descricao: 'Receitas de Balcão e PDV de Serviços', valor: 4135.00, percentual: 2.4 }
    ]
  },
  deducoesImpostos: {
    descricao: '2. (-) DEDUÇÕES E IMPOSTOS SOBRE RECEITA',
    valor: 14750.48,
    percentual: 8.5,
    subItens: [
      { descricao: 'Simples Nacional (Anexo III) / ISS e DAS', valor: 11450.80, percentual: 6.6 },
      { descricao: 'Taxas de Meios de Pagamento e Gateway Pix/Cartões', valor: 2199.68, percentual: 1.3 },
      { descricao: 'Dispensas e Isenções Concedidas', valor: 1100.00, percentual: 0.6 }
    ]
  },
  receitaLiquida: {
    descricao: '3. (=) RECEITA OPERACIONAL LÍQUIDA',
    valor: 158784.52,
    percentual: 91.5,
    destaque: true
  },
  custosOperacionais: {
    descricao: '4. (-) CUSTOS OPERACIONAIS & REPASSES DE COMISSÃO',
    valor: 58500.00,
    percentual: 33.7,
    subItens: [
      { descricao: 'Repasse de Comissões aos Corretores Fechadores', valor: 46800.00, percentual: 27.0 },
      { descricao: 'Repasse a Corretores Captadores & Parceiros', valor: 11700.00, percentual: 6.7 }
    ]
  },
  lucroBruto: {
    descricao: '5. (=) LUCRO BRUTO',
    valor: 100284.52,
    percentual: 57.8,
    destaque: true
  },
  despesasOperacionais: {
    descricao: '6. (-) DESPESAS OPERACIONAIS GERAIS',
    valor: 52190.00,
    percentual: 30.1,
    subItens: [
      { descricao: 'Folha Salarial da Equipe e Pró-Labore', valor: 31020.00, percentual: 17.9 },
      { descricao: 'Infraestrutura, Aluguel e Condomínio da Sede', valor: 14500.00, percentual: 8.4 },
      { descricao: 'Marketing Digital e Tráfego Pago', valor: 6800.00, percentual: 3.9 },
      { descricao: 'Tecnologia, PABX e Softwares Imobiliários', valor: 2900.00, percentual: 1.7 },
      { descricao: 'Despesas com PDV de Balcão, Cartórios e Despachos', valor: 3570.00, percentual: 2.1 }
    ]
  },
  ebitda: {
    descricao: '7. (=) EBITDA (LAJIDA)',
    valor: 48094.52,
    percentual: 27.7,
    destaque: true
  },
  depreciacaoAmortizacao: {
    descricao: '8. (-) DEPRECIAÇÃO & AMORTIZAÇÃO',
    valor: 1650.00,
    percentual: 1.0,
    subItens: [
      { descricao: 'Depreciação de Máquinas, Frotas e Computadores', valor: 1650.00, percentual: 1.0 }
    ]
  },
  resultadoFinanceiro: {
    descricao: '9. (+/-) RESULTADO FINANCEIRO LÍQUIDO',
    valor: 1240.00,
    percentual: 0.7,
    subItens: [
      { descricao: 'Rendimentos de Aplicações de Caixa', valor: 1820.00, percentual: 1.0 },
      { descricao: 'Tarifas Bancárias e Manutenção de Conta', valor: -580.00, percentual: -0.3 }
    ]
  },
  lucroLiquido: {
    descricao: '10. (=) LUCRO LÍQUIDO DO EXERCÍCIO',
    valor: 47684.52,
    percentual: 27.5,
    destaque: true
  }
};

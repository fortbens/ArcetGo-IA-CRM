import { PropostaVenda } from '../types/salesProposal';

export const MOCK_PROPOSTAS_VENDA: PropostaVenda[] = [
  {
    id: 'prop-001',
    codigo: 'PROP-2026-101',
    dataCriacao: '2026-09-26 14:30',
    dataUltimaAtualizacao: '2026-09-27 10:15',
    imovelId: 'prop-1',
    imovelCodigo: 'AP-PIN-044',
    imovelTitulo: 'Apartamento Alto Padrão 240m² em Pinheiros',
    imovelEndereco: 'Rua dos Pinheiros, 1200 - Pinheiros, São Paulo/SP',
    imovelMatriculaRgi: 'Matrícula nº 142.890 do 13º RGI de São Paulo',
    imovelFotoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    
    vendedorId: 'own-1',
    vendedorNome: 'Dr. Roberto Silveira Mattos',
    vendedorCpfCnpj: '123.456.789-00',
    vendedorTelefone: '(11) 98765-1122',
    vendedorEmail: 'roberto.mattos@advocacia.com.br',
    
    compradorId: 'lead-101',
    compradorNome: 'Marcelo Queiroz Guimarães',
    compradorCpfCnpj: '234.567.890-11',
    compradorRg: '28.901.345-X SSP/SP',
    compradorTelefone: '(11) 99123-4567',
    compradorEmail: 'marcelo.guimaraes@techcorp.com.br',
    compradorProfissao: 'Engenheiro de Software & Executivo',
    compradorEstadoCivil: 'Casado em Comunhão Parcial de Bens',
    
    condicoes: {
      valorTabelaImovel: 2100000.00,
      valorProposto: 1980000.00,
      descontoOuAcrescimo: -5.71,
      valorSinalEntrada: 400000.00,
      dataPrevisaoSinal: '2026-10-02',
      formaSinal: 'PIX',
      valorFgts: 180000.00,
      valorFinanciamentoBancario: 1100000.00,
      bancoFinanciamento: 'Banco Itaú Personnalité',
      valorParcelasDiretas: 0,
      valorBaloesIntermediarias: 0,
      valorPermutaBem: 0,
      valorSaldoEscrituraChaves: 300000.00,
      dataPrevisaoChaves: '2026-11-15',
      validadeDiasUteis: 5,
      dataExpiracao: '2026-10-03',
      condicoesEspeciais: 'Ficam no imóvel todos os armários planejados da cozinha, suíte master e os 4 aparelhos de ar-condicionado inverter.'
    },
    
    comissao: {
      percentualComissao: 6.0,
      valorComissaoTotal: 118800.00,
      formaCobranca: 'RETIDA_SINAL',
      splitCorretorFechador: {
        nome: 'Renata Albuquerque (Fechadora)',
        percentual: 40,
        valor: 47520.00
      },
      splitCorretorCaptador: {
        nome: 'Carlos Mendonça (Captador)',
        percentual: 20,
        valor: 23760.00
      },
      splitImobiliaria: {
        nome: 'AcertGo Imóveis Matriz',
        percentual: 40,
        valor: 47520.00
      }
    },
    
    corretorResponsavelNome: 'Renata Albuquerque',
    corretorCreci: 'CRECI 198.442-F',
    status: 'ENCAMINHADA_VENDEDOR',
    historicoAceite: {
      decisaoVendedor: undefined,
      parecerVendedor: 'Vendedor analisando com a esposa. Retorno prometido até amanhã às 17h.'
    }
  },
  {
    id: 'prop-002',
    codigo: 'PROP-2026-102',
    dataCriacao: '2026-09-24 11:00',
    dataUltimaAtualizacao: '2026-09-25 16:45',
    imovelId: 'prop-2',
    imovelCodigo: 'CS-ALPH-90',
    imovelTitulo: 'Casa Contemporânea em Condomínio Fechado Alphaville',
    imovelEndereco: 'Alameda dos Ipês, 88 - Alphaville Residencial 2, Barueri/SP',
    imovelMatriculaRgi: 'Matrícula nº 98.712 do Cartório de Barueri',
    imovelFotoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    
    vendedorId: 'own-2',
    vendedorNome: 'Beatriz Vasconcelos de Alencar',
    vendedorCpfCnpj: '345.678.901-22',
    vendedorTelefone: '(11) 97654-3322',
    vendedorEmail: 'beatriz.vasconcelos@globo.com',
    
    compradorId: 'lead-102',
    compradorNome: 'Dr. Fernando Henrique Siqueira',
    compradorCpfCnpj: '456.789.012-33',
    compradorRg: '19.456.789-0 SSP/SP',
    compradorTelefone: '(11) 98877-6655',
    compradorEmail: 'f.siqueira@clinicaolhos.med.br',
    compradorProfissao: 'Médico Oftalmologista',
    compradorEstadoCivil: 'Casado',
    
    condicoes: {
      valorTabelaImovel: 3800000.00,
      valorProposto: 3700000.00,
      descontoOuAcrescimo: -2.63,
      valorSinalEntrada: 1000000.00,
      dataPrevisaoSinal: '2026-09-28',
      formaSinal: 'TED',
      valorFgts: 0,
      valorFinanciamentoBancario: 2200000.00,
      bancoFinanciamento: 'Santander Select',
      valorParcelasDiretas: 0,
      valorBaloesIntermediarias: 0,
      valorPermutaBem: 500000.00,
      descricaoPermuta: 'BMW X5 2024 Blindada Nível III-A, 12.000 km rodados, quitada e sem débitos.',
      valorSaldoEscrituraChaves: 0,
      dataPrevisaoChaves: '2026-10-30',
      validadeDiasUteis: 3,
      dataExpiracao: '2026-09-27',
      condicoesEspeciais: 'Inclusão da permuta do veículo mediante vistoria cautelar Dekra e transferência imediata.'
    },
    
    comissao: {
      percentualComissao: 6.0,
      valorComissaoTotal: 222000.00,
      formaCobranca: 'RETIDA_SINAL',
      splitCorretorFechador: {
        nome: 'Diego Vasconcelos',
        percentual: 50,
        valor: 111000.00
      },
      splitCorretorCaptador: {
        nome: 'Diego Vasconcelos',
        percentual: 10,
        valor: 22200.00
      },
      splitImobiliaria: {
        nome: 'AcertGo Imóveis Matriz',
        percentual: 40,
        valor: 88800.00
      }
    },
    
    corretorResponsavelNome: 'Diego Vasconcelos',
    corretorCreci: 'CRECI 205.119-F',
    status: 'ACEITA_VENDIDO',
    historicoAceite: {
      decisaoVendedor: 'ACEITO',
      dataDecisao: '2026-09-25 16:30',
      parecerVendedor: 'Proposta aceita integralmente com o veículo na permuta. Elaborando minuta de compra e venda.'
    }
  },
  {
    id: 'prop-003',
    codigo: 'PROP-2026-103',
    dataCriacao: '2026-09-27 09:30',
    dataUltimaAtualizacao: '2026-09-27 18:00',
    imovelId: 'prop-3',
    imovelCodigo: 'COB-VM-012',
    imovelTitulo: 'Penthouse Triplex com Piscina e Vista 360º Vila Madalena',
    imovelEndereco: 'Rua Harmonia, 500 - Vila Madalena, São Paulo/SP',
    imovelMatriculaRgi: 'Matrícula nº 78.110 do 2º RGI de São Paulo',
    imovelFotoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    
    vendedorId: 'own-3',
    vendedorNome: 'Construtora e Participações Vila Nova Ltda',
    vendedorCpfCnpj: '56.789.012/0001-44',
    vendedorTelefone: '(11) 3045-8899',
    vendedorEmail: 'diretoria@vilanovaimob.com.br',
    
    compradorId: 'lead-103',
    compradorNome: 'Rodrigo Santoro de Oliveira',
    compradorCpfCnpj: '567.890.123-44',
    compradorRg: '33.890.112-9 SSP/SP',
    compradorTelefone: '(11) 98111-2233',
    compradorEmail: 'rodrigo.oliveira@fundoasset.com.br',
    compradorProfissao: 'Gestor de Fundo de Investimentos',
    compradorEstadoCivil: 'Solteiro',
    
    condicoes: {
      valorTabelaImovel: 4500000.00,
      valorProposto: 4100000.00,
      descontoOuAcrescimo: -8.89,
      valorSinalEntrada: 1500000.00,
      dataPrevisaoSinal: '2026-10-05',
      formaSinal: 'TED',
      valorFgts: 0,
      valorFinanciamentoBancario: 0,
      valorParcelasDiretas: 2600000.00,
      quantidadeParcelasDiretas: 10,
      valorParcelaMensal: 260000.00,
      valorBaloesIntermediarias: 0,
      valorPermutaBem: 0,
      valorSaldoEscrituraChaves: 0,
      dataPrevisaoChaves: '2026-11-01',
      validadeDiasUteis: 5,
      dataExpiracao: '2026-10-04',
      condicoesEspeciais: 'Pagamento 100% com recursos próprios, sem dependência de banco. Correção das 10 parcelas pelo IPCA + 0,5% a.m.'
    },
    
    comissao: {
      percentualComissao: 5.0,
      valorComissaoTotal: 205000.00,
      formaCobranca: 'RETIDA_SINAL',
      splitCorretorFechador: {
        nome: 'Lucas Martins (Fechador)',
        percentual: 45,
        valor: 92250.00
      },
      splitCorretorCaptador: {
        nome: 'Renata Albuquerque (Captadora)',
        percentual: 15,
        valor: 30750.00
      },
      splitImobiliaria: {
        nome: 'AcertGo Imóveis Matriz',
        percentual: 40,
        valor: 82000.00
      }
    },
    
    corretorResponsavelNome: 'Lucas Martins',
    corretorCreci: 'CRECI 187.900-F',
    status: 'CONTRAPROPOSTA',
    historicoAceite: {
      decisaoVendedor: 'CONTRAPROPOSTA',
      dataDecisao: '2026-09-27 17:45',
      valorContraproposta: 4250000.00,
      parecerVendedor: 'Construtora aceita parcelar em 10x, porém pelo valor mínimo de R$ 4.250.000,00.',
      condicoesContraproposta: 'Entrada de R$ 1.650.000,00 + 10 parcelas de R$ 260.000,00 corrigidas por IPCA + 0.5%.'
    }
  }
];

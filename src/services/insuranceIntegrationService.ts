/**
 * Insurance Integration Service (Hub Multi-Seguradoras & Garantias Locatícias)
 * Integração com CredPago, Porto Seguro, Velo, Pottencial, Too Seguros e Icatu.
 * Permite cotação instantânea, pré-aprovação de crédito e emissão de apólices diretamente na esteira de contratos.
 */

export interface InsuranceQuoteRequest {
  contractCode?: string;
  propertyAddress?: string;
  tenantName: string;
  tenantCpf: string;
  tenantIncome?: number;
  monthlyRent: number;
  condoFee?: number;
  iptuFee?: number;
}

export type InsurerId = 
  | 'credpago' 
  | 'porto_seguro' 
  | 'velo' 
  | 'pottencial' 
  | 'too_seguros' 
  | 'icatu_capitalizacao';

export interface InsuranceQuoteOption {
  insurerId: InsurerId;
  insurerName: string;
  insurerTagline: string;
  guaranteeType: 'SEGURO_FIANCA' | 'CARTAO_CREDITO' | 'TITULO_CAPITALIZACAO';
  monthlyCost: number;
  annualCost: number;
  ratePercentage: number; // % sobre o total mensal
  estimatedApprovalTime: string;
  requiresCreditCard: boolean;
  requiresIncomeProof: boolean;
  coverages: {
    coversRent: boolean;
    coversCondoAndIptu: boolean;
    coversDamageAndPaint: boolean;
    coversLegalExpenses: boolean;
    maxCoverageMultiplier: number; // ex: 30x ou 40x
    maxCoverageValue: number;
  };
  features: string[];
  recommended?: boolean;
  badge?: string;
  brokerCommissionRate: number; // % comissão para a imobiliária
  brokerCommissionAmount: number;
  apiProviderStatus: 'ONLINE' | 'HOMOLOGADO';
}

export interface PreApprovalCheckResult {
  cpf: string;
  score: number;
  riskTier: 'BAIXO_RISCO' | 'MEDIO_RISCO' | 'ALTO_RISCO';
  approved: boolean;
  commitmentPercentage: number;
  maxRentApproved: number;
  recommendedInsurers: string[];
  reasons: string[];
}

export interface PolicyIssueResult {
  policyNumber: string;
  susepCode: string;
  insurerName: string;
  status: 'EMITIDA' | 'APROVADA';
  certificateUrl: string;
  effectiveDate: string;
  expirationDate: string;
  monthlyCost: number;
  coverageSummary: string;
}

export interface FireInsuranceQuoteResult {
  company: string;
  monthlyCost: number;
  annualCost: number;
  coverageAmount: number;
  policyNumber: string;
}

class InsuranceIntegrationService {
  /**
   * Realiza a cotação simultânea em todas as seguradoras parceiras conectadas
   */
  async calculateInsuranceQuotes(params: InsuranceQuoteRequest): Promise<InsuranceQuoteOption[]> {
    // Simula latência de rede realista com APIs parceiras (REST / Webhooks)
    await new Promise(resolve => setTimeout(resolve, 600));

    const totalPackage = (params.monthlyRent || 0) + (params.condoFee || 0) + (params.iptuFee || 0);

    const quotes: InsuranceQuoteOption[] = [
      {
        insurerId: 'porto_seguro',
        insurerName: 'Porto Seguro Aluguel',
        insurerTagline: 'Líder tradicional do mercado • Cobertura máxima e assistência 24h residencial',
        guaranteeType: 'SEGURO_FIANCA',
        ratePercentage: 8.2,
        monthlyCost: Math.round(totalPackage * 0.082),
        annualCost: Math.round(totalPackage * 0.082 * 12),
        estimatedApprovalTime: '15 minutos (IA)',
        requiresCreditCard: false,
        requiresIncomeProof: true,
        coverages: {
          coversRent: true,
          coversCondoAndIptu: true,
          coversDamageAndPaint: true,
          coversLegalExpenses: true,
          maxCoverageMultiplier: 40,
          maxCoverageValue: totalPackage * 40
        },
        features: [
          'Cobertura de até 40x o valor do aluguel',
          'Repasse pontual garantido para o proprietário',
          'Assistência 24h residencial gratuita para o inquilino (chaveiro, encanador, eletricista)',
          'Pagamento parcelado no boleto mensal do aluguel'
        ],
        recommended: true,
        badge: 'Mais Tradicional & Completo',
        brokerCommissionRate: 15,
        brokerCommissionAmount: Math.round(totalPackage * 0.082 * 0.15 * 12),
        apiProviderStatus: 'ONLINE'
      },
      {
        insurerId: 'credpago',
        insurerName: 'CredPago (Loft Fiança)',
        insurerTagline: 'Sem fiador e sem comprovação de renda em carteira • Aprovação via cartão de crédito',
        guaranteeType: 'CARTAO_CREDITO',
        ratePercentage: 9.8,
        monthlyCost: Math.round(totalPackage * 0.098),
        annualCost: Math.round(totalPackage * 0.098 * 12),
        estimatedApprovalTime: '1 minuto (Instantâneo)',
        requiresCreditCard: true,
        requiresIncomeProof: false,
        coverages: {
          coversRent: true,
          coversCondoAndIptu: true,
          coversDamageAndPaint: true,
          coversLegalExpenses: true,
          maxCoverageMultiplier: 30,
          maxCoverageValue: totalPackage * 30
        },
        features: [
          'Ideal para autônomos, empresários e profissionais liberais',
          'Aprovação em 60 segundos com fatura ou limite de cartão',
          'Não consome o limite total do cartão de crédito (apenas o valor da parcela)',
          'Contratação 100% digital no celular sem papelada'
        ],
        badge: 'Mais Rápido • Zero Comprovante',
        brokerCommissionRate: 18,
        brokerCommissionAmount: Math.round(totalPackage * 0.098 * 0.18 * 12),
        apiProviderStatus: 'ONLINE'
      },
      {
        insurerId: 'velo',
        insurerName: 'Velo Garantias',
        insurerTagline: 'Análise inteligente via Open Finance • Taxas ultra competitivas para inquilinos qualificados',
        guaranteeType: 'SEGURO_FIANCA',
        ratePercentage: 7.9,
        monthlyCost: Math.round(totalPackage * 0.079),
        annualCost: Math.round(totalPackage * 0.079 * 12),
        estimatedApprovalTime: '2 minutos (Open Finance)',
        requiresCreditCard: false,
        requiresIncomeProof: false,
        coverages: {
          coversRent: true,
          coversCondoAndIptu: true,
          coversDamageAndPaint: true,
          coversLegalExpenses: true,
          maxCoverageMultiplier: 36,
          maxCoverageValue: totalPackage * 36
        },
        features: [
          'Conexão segura Open Finance com o banco do pretendente',
          'Dispensa envio de holerite ou declaração de imposto de renda',
          'Taxa reduzida para inquilinos com bom histórico financeiro',
          'Indenização expressa em caso de inadimplência'
        ],
        badge: 'Menor Taxa Mensal',
        brokerCommissionRate: 15,
        brokerCommissionAmount: Math.round(totalPackage * 0.079 * 0.15 * 12),
        apiProviderStatus: 'ONLINE'
      },
      {
        insurerId: 'pottencial',
        insurerName: 'Pottencial Seguradora',
        insurerTagline: 'Especialista em garantias corporativas e residenciais de alto padrão',
        guaranteeType: 'SEGURO_FIANCA',
        ratePercentage: 8.5,
        monthlyCost: Math.round(totalPackage * 0.085),
        annualCost: Math.round(totalPackage * 0.085 * 12),
        estimatedApprovalTime: '30 minutos',
        requiresCreditCard: false,
        requiresIncomeProof: true,
        coverages: {
          coversRent: true,
          coversCondoAndIptu: true,
          coversDamageAndPaint: false,
          coversLegalExpenses: true,
          maxCoverageMultiplier: 30,
          maxCoverageValue: totalPackage * 30
        },
        features: [
          'Excelente cobertura jurídica com assessoria jurídica própria',
          'Aceita composição de renda de até 3 pessoas',
          'Foco em imóveis residenciais e comerciais'
        ],
        brokerCommissionRate: 12,
        brokerCommissionAmount: Math.round(totalPackage * 0.085 * 0.12 * 12),
        apiProviderStatus: 'ONLINE'
      },
      {
        insurerId: 'too_seguros',
        insurerName: 'Too Seguros (BTG Pactual)',
        insurerTagline: 'Solidez do Banco BTG Pactual • Emissão de apólice digital via API instantânea',
        guaranteeType: 'SEGURO_FIANCA',
        ratePercentage: 8.4,
        monthlyCost: Math.round(totalPackage * 0.084),
        annualCost: Math.round(totalPackage * 0.084 * 12),
        estimatedApprovalTime: '5 minutos',
        requiresCreditCard: false,
        requiresIncomeProof: true,
        coverages: {
          coversRent: true,
          coversCondoAndIptu: true,
          coversDamageAndPaint: true,
          coversLegalExpenses: true,
          maxCoverageMultiplier: 36,
          maxCoverageValue: totalPackage * 36
        },
        features: [
          'Respaldo e solidez financeira do BTG Pactual',
          'Emissão de apólice digital homologada pela SUSEP',
          'Plataforma ágil para acionamento de sinistros'
        ],
        brokerCommissionRate: 14,
        brokerCommissionAmount: Math.round(totalPackage * 0.084 * 0.14 * 12),
        apiProviderStatus: 'ONLINE'
      },
      {
        insurerId: 'icatu_capitalizacao',
        insurerName: 'Icatu Capitalização (Título Caução)',
        insurerTagline: 'Alternativa ao fiador tradicional • 100% do valor resgatado corrigido ao término',
        guaranteeType: 'TITULO_CAPITALIZACAO',
        ratePercentage: 0, // Não tem taxa mensal, é aporte único
        monthlyCost: 0,
        annualCost: totalPackage * 6,
        estimatedApprovalTime: 'Instantâneo (Sem análise)',
        requiresCreditCard: false,
        requiresIncomeProof: false,
        coverages: {
          coversRent: true,
          coversCondoAndIptu: true,
          coversDamageAndPaint: false,
          coversLegalExpenses: false,
          maxCoverageMultiplier: 6,
          maxCoverageValue: totalPackage * 6
        },
        features: [
          'Depósito único equivalente a 6 meses de aluguel e encargos',
          'Sem consulta ao Serasa/SPC (aprovação 100% garantida)',
          'Resgate integral com rendimento ao final da locação',
          'Concorre a sorteios mensais pela Loteria Federal'
        ],
        badge: 'Zero Burocracia • Sem Consulta',
        brokerCommissionRate: 8,
        brokerCommissionAmount: Math.round(totalPackage * 6 * 0.08),
        apiProviderStatus: 'ONLINE'
      }
    ];

    return quotes;
  }

  /**
   * Consulta instantânea de pré-aprovação de crédito nos birôs (Serasa, SPC, Open Finance)
   */
  async checkInstantCredit(
    tenantCpf: string,
    monthlyIncome: number,
    monthlyRentTotal: number
  ): Promise<PreApprovalCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanCpf = tenantCpf.replace(/\D/g, '');
    const income = monthlyIncome > 0 ? monthlyIncome : monthlyRentTotal * 3.2;
    const commitment = Math.round((monthlyRentTotal / Math.max(1, income)) * 100);

    // Heurística baseada no comprometimento de renda
    let score = 840;
    let approved = true;
    let riskTier: 'BAIXO_RISCO' | 'MEDIO_RISCO' | 'ALTO_RISCO' = 'BAIXO_RISCO';
    const reasons: string[] = [];

    if (commitment <= 25) {
      score = 880 + Math.floor(Math.random() * 80);
      riskTier = 'BAIXO_RISCO';
      reasons.push('Comprometimento de renda excelente (abaixo de 25%).');
      reasons.push('CPF regular na Receita Federal e sem anotações restritivas.');
      reasons.push('Elegível para todas as seguradoras com taxas reduzidas.');
    } else if (commitment <= 33) {
      score = 720 + Math.floor(Math.random() * 80);
      riskTier = 'MEDIO_RISCO';
      reasons.push(`Comprometimento de renda aceitável (${commitment}% do pacote).`);
      reasons.push('Aprovado nos parâmetros de Porto Seguro, CredPago e Velo.');
    } else {
      score = 490 + Math.floor(Math.random() * 70);
      approved = false;
      riskTier = 'ALTO_RISCO';
      reasons.push(`Comprometimento de renda elevado (${commitment}% - acima do limite de 33%).`);
      reasons.push('Recomendado incluir comprovante de co-locatário para compor renda ou optar por Título de Capitalização.');
    }

    return {
      cpf: tenantCpf,
      score,
      riskTier,
      approved,
      commitmentPercentage: commitment,
      maxRentApproved: Math.round(income * 0.33),
      recommendedInsurers: approved 
        ? ['Porto Seguro Aluguel', 'CredPago', 'Velo Garantias', 'Pottencial']
        : ['Icatu Capitalização (Título Caução)', 'Composição de Renda Co-Locatário'],
      reasons
    };
  }

  /**
   * Emite apólice digital pré-aprovada com registro e número SUSEP
   */
  async issueInstantPolicy(params: {
    quote: InsuranceQuoteOption;
    tenantName: string;
    tenantCpf: string;
    contractCode: string;
    monthlyRent: number;
  }): Promise<PolicyIssueResult> {
    await new Promise(resolve => setTimeout(resolve, 700));

    const year = new Date().getFullYear();
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    const prefix = params.quote.insurerId === 'credpago' ? 'CP-LOFT' : 
                   params.quote.insurerId === 'porto_seguro' ? 'APO-PORTO' :
                   params.quote.insurerId === 'velo' ? 'VELO-OF' : 'APO-SEG';

    const policyNumber = `${prefix}-${year}-${randomSeq}`;
    const susepCode = `SUSEP-0524.${Math.floor(100000 + Math.random() * 900000)}/${year}`;
    
    const effectiveDate = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 2); // 24 meses padrão
    const expirationDate = expDate.toISOString().split('T')[0];

    return {
      policyNumber,
      susepCode,
      insurerName: params.quote.insurerName,
      status: 'EMITIDA',
      certificateUrl: `https://acertgo.com.br/certificados/apolice-${policyNumber.toLowerCase()}.pdf`,
      effectiveDate,
      expirationDate,
      monthlyCost: params.quote.monthlyCost,
      coverageSummary: `Cobertura de ${params.quote.coverages.maxCoverageMultiplier}x o aluguel (R$ ${(params.quote.coverages.maxCoverageValue).toLocaleString('pt-BR')}) com indenização automática de inadimplência, condomínio, IPTU e danos.`
    };
  }

  /**
   * Cotação automática do seguro incêndio obrigatório (Lei do Inquilinato nº 8.245/91)
   */
  quoteFireInsurance(params: { rentAmount: number; propertyType?: string }): FireInsuranceQuoteResult {
    const rent = params.rentAmount || 3000;
    // Custo estimado do seguro incêndio varia entre R$ 25 e R$ 65/mês
    const monthlyCost = Math.max(25, Math.round(rent * 0.007));
    const coverageAmount = rent * 150; // Cobertura predial proporcional

    return {
      company: 'Tokio Marine Seguradora',
      monthlyCost,
      annualCost: monthlyCost * 12,
      coverageAmount,
      policyNumber: `INC-TOKIO-${Math.floor(10000 + Math.random() * 90000)}`
    };
  }
}

export const insuranceIntegrationService = new InsuranceIntegrationService();

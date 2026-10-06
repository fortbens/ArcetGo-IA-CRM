export type SplitGatewayId = 
  | 'conta_pronta'
  | 'mercado_pago'
  | 'pagarme'
  | 'pagseguro'
  | 'pjbank'
  | 'iugu'
  | 'asaas'
  | 'cora'
  | 'banco_inter'
  | 'celcoin';

export interface SplitGatewayConfig {
  id: SplitGatewayId;
  name: string;
  commercialName: string;
  badge: string;
  logoColor: string;
  category: 'BAAS_ESPECIALIZADO' | 'MARKETPLACE_API' | 'BANCO_DIGITAL_PJ';
  description: string;
  apiDocsUrl: string;
  isConfigured: boolean;
  isActive: boolean;
  environment: 'SANDBOX' | 'PRODUCTION';
  credentials: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    walletId?: string;
    webhookSecret?: string;
    pixMasterKey?: string;
  };
  features: {
    splitPixInstantD0: boolean;
    splitBoletoHibrido: boolean;
    splitCartaoCredito: boolean;
    autoSubaccountCreation: boolean;
    transferBatchApi: boolean;
    webhooksRealtime: boolean;
  };
  tariffs: {
    pixCashInFee: string;
    pixCashOutFee: string;
    boletoFee: string;
    transferFee: string;
  };
  healthCheck: {
    status: 'ONLINE' | 'DEGRADED' | 'TESTING';
    latencyMs: number;
    lastPing: string;
    activeWebhooksCount: number;
  };
  balance: {
    available: number;
    pendingSplit: number;
    currency: string;
  };
}

export const DEFAULT_SPLIT_GATEWAYS: SplitGatewayConfig[] = [
  {
    id: 'conta_pronta',
    name: 'Conta Pronta BaaS',
    commercialName: 'Conta Pronta Tecnologia & Pagamentos',
    badge: 'Foco Imobiliário',
    logoColor: 'from-amber-500 to-orange-600',
    category: 'BAAS_ESPECIALIZADO',
    description: 'BaaS especializado em recebimento de comissões imobiliárias, split instantâneo e esteira de compliance para corretores com emissão de subcontas.',
    apiDocsUrl: 'https://docs.contapronta.com.br/api/v2/splits',
    isConfigured: true,
    isActive: true,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'cp_live_sec_89f0293da821034fe90b',
      clientId: 'cp_client_acertgo_master_01',
      clientSecret: '••••••••••••••••••••••••••••••••',
      walletId: 'wallet_cp_imob_8832',
      webhookSecret: 'whsec_cp_9921bdfa0199',
      pixMasterKey: 'financeiro@acertgo.com.br'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: true,
      autoSubaccountCreation: true,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: '0.85%',
      pixCashOutFee: 'R$ 0,00 (Gratuito)',
      boletoFee: 'R$ 1,89 por liquidação',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 42,
      lastPing: 'Agora mesmo',
      activeWebhooksCount: 14
    },
    balance: {
      available: 184590.50,
      pendingSplit: 34200.00,
      currency: 'BRL'
    }
  },
  {
    id: 'asaas',
    name: 'Asaas FinTech',
    commercialName: 'Asaas Gestão Financeira S.A.',
    badge: 'API v3 / Split Nativo',
    logoColor: 'from-blue-600 to-cyan-600',
    category: 'BAAS_ESPECIALIZADO',
    description: 'Motor robusto com split nativo de boletos com QR Code Pix Dinâmico e divisão no momento da liquidação sem bitributação.',
    apiDocsUrl: 'https://docs.asaas.com/reference/criar-split-de-pagamento',
    isConfigured: true,
    isActive: true,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAw',
      walletId: 'cus_000005928172',
      webhookSecret: 'wh_asaas_sec_7781a9',
      pixMasterKey: 'cnpj: 42.198.810/0001-90'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: true,
      autoSubaccountCreation: true,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: '0.99% (máx R$ 8,00)',
      pixCashOutFee: 'R$ 0,00',
      boletoFee: 'R$ 1,99 por liquidação',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 38,
      lastPing: 'Há 1 minuto',
      activeWebhooksCount: 22
    },
    balance: {
      available: 312840.10,
      pendingSplit: 48900.00,
      currency: 'BRL'
    }
  },
  {
    id: 'mercado_pago',
    name: 'Mercado Pago',
    commercialName: 'Mercado Pago Instituição de Pagamento',
    badge: 'Marketplace API',
    logoColor: 'from-sky-500 to-blue-700',
    category: 'MARKETPLACE_API',
    description: 'Divisão de pagamento via Marketplace API com liberação rápida, split com múltiplas contas Mercado Pago e Pix SPI.',
    apiDocsUrl: 'https://www.mercadopago.com.br/developers/pt/reference/split_payments',
    isConfigured: true,
    isActive: false,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'APP_USR-8291048102948192-092618-9182371982739182-918273618',
      clientId: '9182736182918273',
      clientSecret: '••••••••••••••••••••••••••••••••',
      webhookSecret: 'whsec_mp_prod_7718'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: true,
      autoSubaccountCreation: false,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: '0.99%',
      pixCashOutFee: 'R$ 0,00',
      boletoFee: 'R$ 2,49',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 55,
      lastPing: 'Há 3 minutos',
      activeWebhooksCount: 8
    },
    balance: {
      available: 78920.00,
      pendingSplit: 12500.00,
      currency: 'BRL'
    }
  },
  {
    id: 'pagarme',
    name: 'Pagar.me (Stone)',
    commercialName: 'Pagar.me Pagamentos S.A.',
    badge: 'Motor de Recebedores',
    logoColor: 'from-emerald-600 to-teal-700',
    category: 'MARKETPLACE_API',
    description: 'Estrutura avançada de Recebedores (Recipients), regras de split de juros e chargeback personalizáveis para grandes volumes.',
    apiDocsUrl: 'https://docs.pagar.me/reference/criar-split-v5',
    isConfigured: true,
    isActive: true,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'sk_live_pgme_9981273981237198273981273',
      clientId: 'rec_master_acertgo_01',
      webhookSecret: 'whsec_pgme_8831'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: true,
      autoSubaccountCreation: true,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: '0.89%',
      pixCashOutFee: 'R$ 0,00',
      boletoFee: 'R$ 2,10',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 46,
      lastPing: 'Há 30 segundos',
      activeWebhooksCount: 16
    },
    balance: {
      available: 142100.80,
      pendingSplit: 21800.00,
      currency: 'BRL'
    }
  },
  {
    id: 'pagseguro',
    name: 'PagBank / PagSeguro',
    commercialName: 'PagSeguro Internet S.A.',
    badge: 'Split PagBank',
    logoColor: 'from-yellow-500 to-amber-600',
    category: 'MARKETPLACE_API',
    description: 'Split de pagamentos com ecossistema PagBank, divisão de recebíveis no cartão e split via Pix para contas do banco digital.',
    apiDocsUrl: 'https://dev.pagbank.uol.com.br/reference/split-de-pagamento',
    isConfigured: true,
    isActive: false,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'pagseg_token_live_88192837198237',
      clientId: 'pag_client_8819',
      webhookSecret: 'wh_pagseg_9182'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: true,
      autoSubaccountCreation: false,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: '0.99%',
      pixCashOutFee: 'R$ 0,00',
      boletoFee: 'R$ 2,39',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 62,
      lastPing: 'Há 5 minutos',
      activeWebhooksCount: 6
    },
    balance: {
      available: 45300.00,
      pendingSplit: 6100.00,
      currency: 'BRL'
    }
  },
  {
    id: 'pjbank',
    name: 'PJBank',
    commercialName: 'PJBank Pagamentos S/A',
    badge: 'Especialista Imob & Condomínio',
    logoColor: 'from-indigo-600 to-blue-800',
    category: 'BAAS_ESPECIALIZADO',
    description: 'Pioneiro em contas virtuais para condomínios e imobiliárias, split de boleto e conciliação bancária automatizada sem tarifas ocultas.',
    apiDocsUrl: 'https://docs.pjbank.com.br/v2/recebimentos/split',
    isConfigured: true,
    isActive: true,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'pjb_credencial_99182371982739182',
      clientId: 'pjb_empresa_44819',
      webhookSecret: 'wh_pjb_991823'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: true,
      autoSubaccountCreation: true,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: 'R$ 0,79 fixo',
      pixCashOutFee: 'R$ 0,00',
      boletoFee: 'R$ 1,75 por liquidação',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 34,
      lastPing: 'Há 12 segundos',
      activeWebhooksCount: 19
    },
    balance: {
      available: 95400.00,
      pendingSplit: 18200.00,
      currency: 'BRL'
    }
  },
  {
    id: 'iugu',
    name: 'Iugu ("Iggu")',
    commercialName: 'Iugu Serviços na Internet S/A',
    badge: 'API Subcontas & Split',
    logoColor: 'from-red-500 to-rose-700',
    category: 'BAAS_ESPECIALIZADO',
    description: 'Infraestrutura completa de subcontas, repasses automáticos de comissões e divisão de receitas com webhook seguro.',
    apiDocsUrl: 'https://dev.iugu.com/reference/criar-split',
    isConfigured: true,
    isActive: true,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'live_user_token_9918273918273918273',
      clientId: 'iugu_account_91823',
      webhookSecret: 'iugu_wh_sec_1182'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: true,
      autoSubaccountCreation: true,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: '0.90%',
      pixCashOutFee: 'R$ 0,00',
      boletoFee: 'R$ 1,95',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 40,
      lastPing: 'Há 1 minuto',
      activeWebhooksCount: 12
    },
    balance: {
      available: 112300.00,
      pendingSplit: 14700.00,
      currency: 'BRL'
    }
  },
  {
    id: 'cora',
    name: 'Banco Cora',
    commercialName: 'Cora Sociedade de Crédito Direto S.A.',
    badge: 'Banco Digital PJ',
    logoColor: 'from-pink-600 to-rose-600',
    category: 'BANCO_DIGITAL_PJ',
    description: 'API Direta Cora PJ com boletos gratuitos de compensação, Pix sem tarifa e integração direta mTLS para pagamentos em lote.',
    apiDocsUrl: 'https://developers.cora.com.br/reference/api-cora-splits',
    isConfigured: true,
    isActive: true,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'cora_oauth_token_live_9921',
      clientId: 'cora_client_prod_8812',
      clientSecret: '••••••••••••••••••••••••••••••••',
      pixMasterKey: 'financeiro@acertgo.com.br'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: false,
      autoSubaccountCreation: false,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: 'R$ 0,00 (Gratuito)',
      pixCashOutFee: 'R$ 0,00 (Gratuito)',
      boletoFee: 'R$ 0,00 (Isento PJ)',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 29,
      lastPing: 'Há 25 segundos',
      activeWebhooksCount: 15
    },
    balance: {
      available: 265000.00,
      pendingSplit: 19800.00,
      currency: 'BRL'
    }
  },
  {
    id: 'banco_inter',
    name: 'Banco Inter Empresas',
    commercialName: 'Banco Inter S.A.',
    badge: 'API Pix & Boletos',
    logoColor: 'from-orange-500 to-amber-700',
    category: 'BANCO_DIGITAL_PJ',
    description: 'API corporativa com certificados mTLS, split de pagamentos em conta corrente Inter e boletos com código Pix.',
    apiDocsUrl: 'https://developers.bancointer.com.br/v2/docs',
    isConfigured: true,
    isActive: false,
    environment: 'PRODUCTION',
    credentials: {
      clientId: 'inter_client_id_881928371',
      clientSecret: '••••••••••••••••••••••••••••••••',
      pixMasterKey: '42.198.810/0001-90'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: false,
      autoSubaccountCreation: false,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: 'R$ 0,00',
      pixCashOutFee: 'R$ 0,00',
      boletoFee: 'R$ 1,50',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 48,
      lastPing: 'Há 4 minutos',
      activeWebhooksCount: 9
    },
    balance: {
      available: 84300.00,
      pendingSplit: 8900.00,
      currency: 'BRL'
    }
  },
  {
    id: 'celcoin',
    name: 'Celcoin BaaS',
    commercialName: 'Celcoin Instituição de Pagamento S.A.',
    badge: 'Infraestrutura Pix SPI',
    logoColor: 'from-violet-600 to-purple-800',
    category: 'BAAS_ESPECIALIZADO',
    description: 'Conexão direta ao SPI do Banco Central para liquidação instantânea D+0 em massa de comissões e repasses.',
    apiDocsUrl: 'https://docs.celcoin.com.br/reference/pix-split',
    isConfigured: true,
    isActive: false,
    environment: 'PRODUCTION',
    credentials: {
      apiKey: 'celcoin_key_live_99182371982',
      clientId: 'celcoin_tenant_3319'
    },
    features: {
      splitPixInstantD0: true,
      splitBoletoHibrido: true,
      splitCartaoCredito: false,
      autoSubaccountCreation: true,
      transferBatchApi: true,
      webhooksRealtime: true,
    },
    tariffs: {
      pixCashInFee: 'R$ 0,55',
      pixCashOutFee: 'R$ 0,35',
      boletoFee: 'R$ 1,60',
      transferFee: 'R$ 0,00'
    },
    healthCheck: {
      status: 'ONLINE',
      latencyMs: 25,
      lastPing: 'Há 18 segundos',
      activeWebhooksCount: 11
    },
    balance: {
      available: 56700.00,
      pendingSplit: 5400.00,
      currency: 'BRL'
    }
  }
];

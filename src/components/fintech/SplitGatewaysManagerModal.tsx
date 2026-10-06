import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Key, 
  Zap, 
  ArrowRight, 
  Wallet, 
  Percent, 
  Layers, 
  Check, 
  Copy, 
  Radio, 
  HelpCircle,
  Building,
  Server
} from 'lucide-react';
import { SplitGatewayConfig, SplitGatewayId, DEFAULT_SPLIT_GATEWAYS } from '../../types/splitGateways';

interface SplitGatewaysManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGatewayId?: SplitGatewayId;
  onSelectActiveGateway?: (gatewayId: SplitGatewayId) => void;
}

export const SplitGatewaysManagerModal: React.FC<SplitGatewaysManagerModalProps> = ({
  isOpen,
  onClose,
  activeGatewayId = 'conta_pronta',
  onSelectActiveGateway
}) => {
  const [gateways, setGateways] = useState<SplitGatewayConfig[]>(DEFAULT_SPLIT_GATEWAYS);
  const [selectedGatewayId, setSelectedGatewayId] = useState<SplitGatewayId>(activeGatewayId);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingSuccessMessage, setPingSuccessMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const currentGateway = gateways.find(g => g.id === selectedGatewayId) || gateways[0];

  const handleToggleActive = (id: SplitGatewayId) => {
    setGateways(prev => prev.map(g => ({
      ...g,
      isActive: g.id === id
    })));
    setSelectedGatewayId(id);
    if (onSelectActiveGateway) {
      onSelectActiveGateway(id);
    }
  };

  const handleTestConnection = () => {
    setIsTestingPing(true);
    setPingSuccessMessage(null);
    setTimeout(() => {
      setIsTestingPing(false);
      const simulatedLatency = Math.floor(Math.random() * 25) + 20;
      setPingSuccessMessage(`Conexão OK! Latência: ${simulatedLatency}ms · Webhook 200 OK · SPI Bacen Ativo`);
      setGateways(prev => prev.map(g => g.id === currentGateway.id ? {
        ...g,
        healthCheck: {
          ...g.healthCheck,
          status: 'ONLINE',
          latencyMs: simulatedLatency,
          lastPing: 'Agora mesmo'
        }
      } : g));
    }, 1000);
  };

  const handleToggleEnvironment = () => {
    setGateways(prev => prev.map(g => g.id === currentGateway.id ? {
      ...g,
      environment: g.environment === 'PRODUCTION' ? 'SANDBOX' : 'PRODUCTION'
    } : g));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading">
                  Gateways & APIs Bancárias para Splits
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  10 Gateways Homologados
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Configure os bancos e BaaS parceiros para liquidação instantânea de aluguéis e comissões via Pix e Boletos Híbridos
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with 2 Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Left Column: Bank / Gateway List */}
          <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/60 p-4 space-y-2 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Selecione o Gateway para Configurar
            </div>

            {gateways.map(g => {
              const isSelected = g.id === selectedGatewayId;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGatewayId(g.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10' 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${g.logoColor} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}>
                      {g.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 truncate">{g.name}</span>
                        {g.isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Gateway Principal Ativo" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{g.badge}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      g.isActive 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {g.isActive ? 'Principal' : 'Disponível'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Gateway Configuration & Details */}
          <div className="lg:col-span-8 p-6 space-y-6 overflow-y-auto bg-white">
            {/* Header info of selected gateway */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentGateway.logoColor} text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0`}>
                  {currentGateway.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      {currentGateway.commercialName}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                      {currentGateway.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    {currentGateway.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(currentGateway.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentGateway.isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{currentGateway.isActive ? 'Gateway Principal Ativo' : 'Tornar Gateway Principal'}</span>
                </button>
              </div>
            </div>

            {/* Health check & Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] text-slate-400 font-medium">Ambiente API</span>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    currentGateway.environment === 'PRODUCTION' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentGateway.environment}
                  </span>
                  <button 
                    onClick={handleToggleEnvironment}
                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    Alternar
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] text-slate-400 font-medium">Status da Conexão</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">{currentGateway.healthCheck.status}</span>
                  <span className="text-[11px] text-slate-400 font-mono">({currentGateway.healthCheck.latencyMs}ms)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] text-slate-400 font-medium">Webhooks Ativos</span>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {currentGateway.healthCheck.activeWebhooksCount} rotas registradas
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] text-slate-400 font-medium">Saldo Disponível BaaS</span>
                <div className="text-xs font-bold text-emerald-600 font-mono mt-1">
                  {currentGateway.balance.available.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
            </div>

            {/* Test Connection Button & Alert */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs text-blue-900 font-medium">
                  {pingSuccessMessage || 'Teste o ping do webhook e a autorização de split instantâneo com a API deste banco.'}
                </span>
              </div>
              <button
                onClick={handleTestConnection}
                disabled={isTestingPing}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                <span>{isTestingPing ? 'Testando Conexão...' : 'Testar Conexão / Ping'}</span>
              </button>
            </div>

            {/* Credentials Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-500" />
                <span>Credenciais de Integração & Chaves de API</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">API Key / Token de Acesso</label>
                  <div className="relative">
                    <input 
                      type="password"
                      readOnly
                      value={currentGateway.credentials.apiKey || 'cp_sec_token_991823791827391827398127398'}
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pr-10 text-slate-800"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard?.writeText(currentGateway.credentials.apiKey || '');
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                      title="Copiar Chave"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Client ID / Conta Master</label>
                  <input 
                    type="text"
                    readOnly
                    value={currentGateway.credentials.clientId || 'master_account_acertgo_01'}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Webhook URL de Liquidação (Callback)</label>
                  <input 
                    type="text"
                    readOnly
                    value={`https://api.acertgo.com.br/v1/webhooks/${currentGateway.id}`}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Chave Pix Master do Tenant</label>
                  <input 
                    type="text"
                    readOnly
                    value={currentGateway.credentials.pixMasterKey || 'financeiro@acertgo.com.br'}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Features Supported Matrix */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Recursos Homologados neste Banco</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  currentGateway.features.splitPixInstantD0 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Split Pix D+0 Instantâneo</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  currentGateway.features.splitBoletoHibrido ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Boleto Híbrido + QR Pix</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  currentGateway.features.splitCartaoCredito ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Split Cartão de Crédito</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  currentGateway.features.autoSubaccountCreation ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Criação de Subcontas API</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  currentGateway.features.transferBatchApi ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Transferências em Lote</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  currentGateway.features.webhooksRealtime ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Webhooks em Tempo Real</span>
                </div>
              </div>
            </div>

            {/* Tariffs Table */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-slate-700">Tabela de Tarifas Negociada para este Gateway:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Pix Cash-In:</span>
                  <span className="font-bold text-slate-900">{currentGateway.tariffs.pixCashInFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pix Cash-Out:</span>
                  <span className="font-bold text-slate-900">{currentGateway.tariffs.pixCashOutFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Boleto Liquidado:</span>
                  <span className="font-bold text-slate-900">{currentGateway.tariffs.boletoFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Doc / Ted / Split:</span>
                  <span className="font-bold text-slate-900">{currentGateway.tariffs.transferFee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Transações criptografadas com certificado mTLS e auditoria BACEN SPI</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
          >
            Concluir & Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

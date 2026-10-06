import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  Building, 
  RefreshCw, 
  DollarSign, 
  Percent, 
  Send, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { RentalContract, SplitCalculationResult } from '../../types/crm';
import { calculateAndExecuteFintechSplit } from '../../services/fintechSplitEngine';
import { SplitGatewaysManagerModal } from './SplitGatewaysManagerModal';
import { SplitGatewayId, DEFAULT_SPLIT_GATEWAYS } from '../../types/splitGateways';

interface FintechSplitViewProps {
  contracts: RentalContract[];
}

export const FintechSplitView: React.FC<FintechSplitViewProps> = ({ contracts }) => {
  const [selectedContract, setSelectedContract] = useState<RentalContract>(contracts[0]);
  const [activeGateway, setActiveGateway] = useState<SplitGatewayId>('conta_pronta');
  const [isGatewaysModalOpen, setIsGatewaysModalOpen] = useState(false);
  const [splitResult, setSplitResult] = useState<SplitCalculationResult>(() => 
    calculateAndExecuteFintechSplit({
      rentAmount: contracts[0].monthlyRent,
      condoAmount: contracts[0].condoFee,
      iptuAmount: contracts[0].iptuFee,
      guaranteeFeeAmount: contracts[0].guaranteeFee,
      adminFeePercentage: contracts[0].adminFeePercentage,
      paymentMethod: 'PIX_DINAMICO',
    })
  );

  const [copiedPix, setCopiedPix] = useState(false);
  const [isSettlingWebhook, setIsSettlingWebhook] = useState(false);
  const [settledSuccess, setSettledSuccess] = useState(false);

  const handleSelectContract = (c: RentalContract) => {
    setSelectedContract(c);
    const res = calculateAndExecuteFintechSplit({
      rentAmount: c.monthlyRent,
      condoAmount: c.condoFee,
      iptuAmount: c.iptuFee,
      guaranteeFeeAmount: c.guaranteeFee,
      adminFeePercentage: c.adminFeePercentage,
      paymentMethod: 'PIX_DINAMICO',
    });
    setSplitResult(res);
    setSettledSuccess(false);
  };

  const handleSimulateWebhookSettlement = () => {
    setIsSettlingWebhook(true);
    setSettledSuccess(false);
    setTimeout(() => {
      setIsSettlingWebhook(false);
      setSettledSuccess(true);
    }, 1200);
  };

  const handleCopyPix = () => {
    if (splitResult.pixCopyPasteCode) {
      navigator.clipboard?.writeText(splitResult.pixCopyPasteCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      {/* Title & Architecture Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Motor Fintech de Split Automatizado 💳
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-800 rounded-full">
              API {activeGateway.replace('_', ' ').toUpperCase()} / BACEN SPI
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Liquidação instantânea de aluguel: boleto/Pix único dividido no mesmo segundo sem intervenção humana
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGatewaysModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-all"
            title="Conta Pronta, Asaas, Mercado Pago, Pagar.me, PagSeguro, PJBank, Iugu, Cora, Inter, Celcoin"
          >
            <Wallet className="w-4 h-4 text-indigo-600" />
            <span>Gateways Bancários (10 APIs)</span>
          </button>

          <button
            onClick={handleSimulateWebhookSettlement}
            disabled={isSettlingWebhook}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${isSettlingWebhook ? 'animate-spin' : ''}`} />
            <span>{isSettlingWebhook ? 'Processando Split via Webhook...' : 'Simular Liquidação Instantânea'}</span>
          </button>
        </div>
      </div>

      {/* Contract Selector Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contracts.map(c => {
          const isSelected = c.id === selectedContract.id;
          return (
            <div
              key={c.id}
              onClick={() => handleSelectContract(c)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">{c.code}</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {c.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{c.propertyAddress}</h3>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Inquilino</span>
                  <span className="font-semibold text-slate-800">{c.tenantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Proprietário</span>
                  <span className="font-semibold text-slate-800">{c.ownerName}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split Breakdown Visual Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Financial Breakdown & Split Routing Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Demonstrativo de Split em Tempo Real
              </h2>
              <p className="text-xs text-slate-500">Contrato: {selectedContract.code}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block">Total do Boleto / Pix Único</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                R$ {splitResult.totalInvoiceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Step 1: Inflow Components */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              1. Composição do Pagamento pelo Inquilino
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Aluguel Base</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  R$ {splitResult.breakdown.rentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Condomínio</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  R$ {splitResult.breakdown.condoAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">IPTU Mensal</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  R$ {splitResult.breakdown.iptuAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Seguro-Fiança</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  R$ {splitResult.breakdown.guaranteeFeeAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Instant Split Digital Routing */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              2. Liquidação Digital no Mesmo Segundo (Zero Intervenção Humana)
            </span>
            <div className="space-y-2">
              {/* Imobiliária Fee */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-blue-950 block">
                    Taxa de Administração AcertGo ({selectedContract.adminFeePercentage}%)
                  </span>
                  <span className="text-[11px] text-blue-700">Retenção automática na conta master</span>
                </div>
                <span className="text-sm font-bold text-blue-950 tabular-nums">
                  + R$ {splitResult.splits.realEstateAgencyAdmFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Net Owner Payout */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-950 block">
                    Repasse Líquido ao Proprietário (Pix Instantâneo)
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Chave Pix: {selectedContract.ownerPixKey}
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-950 tabular-nums">
                  R$ {splitResult.splits.netOwnerPayout.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Insurance Vendor */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Seguradora Parceira (Garantia Locatícia CredPago)
                  </span>
                  <span className="text-[11px] text-slate-500">Split direto conta seguradora</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 tabular-nums">
                  R$ {splitResult.splits.insuranceVendorShare.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Condo Administration */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Administradora do Condomínio (Repasse Boleto Cota)
                  </span>
                  <span className="text-[11px] text-slate-500">Repasse para conta do condomínio</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 tabular-nums">
                  R$ {splitResult.splits.condoPayout.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Tax provision */}
              <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-purple-950 block">
                    Provisão de Impostos NFS-e (ISSQN 5%)
                  </span>
                  <span className="text-[11px] text-purple-700">Emitido automaticamente pela prefeitura</span>
                </div>
                <span className="text-xs font-semibold text-purple-950 tabular-nums">
                  R$ {splitResult.splits.taxWithheldProvision.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Webhook Execution Trace */}
          {settledSuccess && (
            <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Webhook Disparado com Sucesso! (Status: SPLIT_SETTLED)</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Transação <strong>{splitResult.webhookLog?.transactionId}</strong> liquidada em <strong>0.84 segundos</strong> via SPI do Banco Central do Brasil.
              </p>
            </div>
          )}
        </div>

        {/* Right: Pix Dinâmico EMV & QR Code */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Pix Dinâmico com Split</h3>
            </div>
            <p className="text-xs text-slate-500">
              O QR Code abaixo contém a regra de split embutida no payload BACEN.
            </p>

            <div className="my-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={splitResult.qrCodeUrl}
                alt="QR Code Pix"
                className="w-44 h-44 rounded-xl shadow-xs"
              />
              <span className="text-[11px] text-slate-400 mt-2">
                Escaneie no App de qualquer banco
              </span>
            </div>

            {/* Pix Copia e Cola */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pix Copia e Cola
              </span>
              <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-[10px] text-slate-700 break-all select-all max-h-20 overflow-y-auto">
                {splitResult.pixCopyPasteCode}
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyPix}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPix ? 'Código Pix Copiado!' : 'Copiar Código Pix'}</span>
          </button>
        </div>
      </div>

      <SplitGatewaysManagerModal 
        isOpen={isGatewaysModalOpen} 
        onClose={() => setIsGatewaysModalOpen(false)} 
        activeGatewayId={activeGateway} 
        onSelectActiveGateway={setActiveGateway} 
      />
    </div>
  );
};

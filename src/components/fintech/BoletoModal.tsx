import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  QrCode, 
  FileText, 
  DollarSign, 
  Building2, 
  Calendar, 
  ShieldCheck,
  Download
} from 'lucide-react';
import { RentalInvoice } from '../../types/crm';

interface BoletoModalProps {
  invoice: RentalInvoice;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsPaid: (invoiceId: string) => void;
}

export const BoletoModal: React.FC<BoletoModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onMarkAsPaid,
}) => {
  if (!isOpen) return null;

  const [copiedBarcode, setCopiedBarcode] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(invoice.barcodeNumber);
    setCopiedBarcode(true);
    setTimeout(() => setCopiedBarcode(false), 2000);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(invoice.pixCopyPaste);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${invoice.tenantName}, segue a cobrança do aluguel referente a ${invoice.competenceMonth} com vencimento em ${invoice.dueDate.split('-').reverse().join('/')}.\n\nValor total: R$ ${invoice.totalAmount.toFixed(2)}\n\nChave PIX Copia e Cola:\n${invoice.pixCopyPaste}\n\nLinha digitável do Boleto:\n${invoice.barcodeNumber}\n\nObrigado! AcertGo Imóveis.`
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold">
              $
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  Boleto Bancário Registrado & PIX
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  invoice.status === 'PAGO' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : invoice.status === 'ATRASADO'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Competência: {invoice.competenceMonth} • Contrato: {invoice.contractCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/55${invoice.tenantPhone.replace(/\D/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enviar WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Quick PIX Bar */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                  Pagamento Instantâneo via PIX (Compensação em 2 segundos)
                </span>
                <span className="text-[11px] text-emerald-700 font-mono">
                  Tarifa de emissão: R$ 0,00 • Split automático com herdeiros
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyPix}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPix ? 'PIX Copiado!' : 'Copiar Chave PIX'}</span>
            </button>
          </div>

          {/* Boleto Simulation Visual (Padrão Bancário) */}
          <div className="border-2 border-slate-300 rounded-xl p-4 sm:p-6 bg-white font-sans text-xs space-y-4 shadow-sm">
            {/* Header Boleto */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black tracking-tighter text-blue-900 font-mono">
                  BANCO ACERTGO | 237-2
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 tracking-wider">
                {invoice.barcodeNumber}
              </div>
            </div>

            {/* Grid de Informações do Boleto */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sacado / Inquilino</span>
                <strong className="text-slate-900 text-xs block">{invoice.tenantName}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Vencimento</span>
                <strong className="text-rose-600 text-sm font-mono block">
                  {invoice.dueDate.split('-').reverse().join('/')}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Espécie</span>
                <span className="text-slate-800 text-xs block">R$ (Real)</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor do Documento</span>
                <strong className="text-base text-slate-900 font-mono block">
                  R$ {invoice.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
            </div>

            {/* Discriminativo de Valores */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Demonstrativo de Valores da Cobrança ({invoice.competenceMonth}):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Aluguel:</span>
                  <div className="font-bold text-slate-800 font-mono">R$ {invoice.rentAmount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Condomínio:</span>
                  <div className="font-bold text-slate-800 font-mono">R$ {invoice.condoAmount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">IPTU:</span>
                  <div className="font-bold text-slate-800 font-mono">R$ {invoice.iptuAmount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Seguro Fiança:</span>
                  <div className="font-bold text-slate-800 font-mono">R$ {invoice.insuranceAmount.toFixed(2)}</div>
                </div>
              </div>

              {(invoice.penaltyAmount || invoice.interestAmount) && (
                <div className="pt-2 border-t border-slate-200 flex items-center gap-4 text-rose-700 text-xs font-semibold">
                  {invoice.penaltyAmount && <span>+ Multa 2%: R$ {invoice.penaltyAmount.toFixed(2)}</span>}
                  {invoice.interestAmount && <span>+ Juros de Mora: R$ {invoice.interestAmount.toFixed(2)}</span>}
                </div>
              )}
            </div>

            {/* Instruções de Pagamento */}
            <div className="text-[11px] text-slate-500 space-y-1">
              <p>• Pagável em qualquer agência bancária ou via PIX até o vencimento.</p>
              <p>• Após o vencimento, cobrar multa de 2% e juros de 1% ao mês.</p>
              <p>• O não pagamento em até 15 dias acarretará envio para execução do Seguro Fiança.</p>
            </div>

            {/* Código de barras ilustrativo */}
            <div className="pt-4 border-t border-slate-200 flex flex-col items-center gap-2">
              <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_8px,#fff_8px,#fff_10px)] opacity-85"></div>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">{invoice.barcodeNumber}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBarcode}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
            >
              {copiedBarcode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBarcode ? 'Copiado!' : 'Copiar Linha Digitável'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Boleto</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'PAGO' && (
              <button
                onClick={() => {
                  onMarkAsPaid(invoice.id);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirmar Pagamento / Baixa</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

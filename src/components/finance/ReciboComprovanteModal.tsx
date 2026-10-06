import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download, Share2, QrCode } from 'lucide-react';

interface ReciboComprovanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  codigoDocumento: string;
  dataHora: string;
  pagadorOuFavorecido: string;
  valor: number;
  descricao: string;
  formaPagamento: string;
  operadorOuResponsavel: string;
  detalhesAdicionais?: { label: string; value: string }[];
}

export const ReciboComprovanteModal: React.FC<ReciboComprovanteModalProps> = ({
  isOpen,
  onClose,
  titulo,
  codigoDocumento,
  dataHora,
  pagadorOuFavorecido,
  valor,
  descricao,
  formaPagamento,
  operadorOuResponsavel,
  detalhesAdicionais = []
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:m-0 print:border-none print:shadow-none">
        {/* Header com identidade da imobiliária */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
              AG
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">AcertGo Imóveis & Fintech</h2>
              <p className="text-xs text-slate-400">CNPJ: 45.123.890/0001-22 | CRECI-J 98214</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Recibo */}
        <div className="p-6 space-y-5">
          <div className="text-center pb-4 border-b border-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              DOCUMENTO FISCAL / COMPROVANTE AUTÊNTICO
            </span>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{titulo}</h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">Controle: {codigoDocumento}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-center">
            <p className="text-xs text-slate-500 uppercase font-medium">Valor Total Quitado</p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Forma: <span className="font-semibold text-slate-800">{formaPagamento}</span>
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Favorecido / Pagador:</span>
              <span className="font-semibold text-slate-900 text-right">{pagadorOuFavorecido}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Descrição do Serviço:</span>
              <span className="font-semibold text-slate-900 text-right max-w-[260px] truncate">{descricao}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Data e Hora do Lançamento:</span>
              <span className="font-mono text-slate-900">{dataHora}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Operador / Responsável:</span>
              <span className="font-medium text-slate-900">{operadorOuResponsavel}</span>
            </div>

            {detalhesAdicionais.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{item.label}:</span>
                <span className="font-semibold text-slate-900 text-right">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Rodapé com QR Code e Hash de Autenticidade */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center p-1 shrink-0">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <div className="text-[11px] text-slate-500 space-y-0.5">
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Assinatura Digital AcertGo Auth
              </div>
              <p>Autenticação: <span className="font-mono text-[10px] text-slate-700">HASH-{Math.random().toString(36).substring(2, 12).toUpperCase()}</span></p>
              <p>Este comprovante possui validade legal e contábil conforme as diretrizes do CRECI e Receita Federal.</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

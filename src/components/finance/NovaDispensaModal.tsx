import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';
import { DispensaFinanceira } from '../../types/financialErp';

interface NovaDispensaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dispensa: Omit<DispensaFinanceira, 'id' | 'codigo' | 'dataSolicitacao'>, idParaEditar?: string) => void;
  initialData?: DispensaFinanceira | null;
}

export const NovaDispensaModal: React.FC<NovaDispensaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [tipoDispensa, setTipoDispensa] = useState<DispensaFinanceira['tipoDispensa']>('MULTA_MORATORIA');
  const [beneficiarioNome, setBeneficiarioNome] = useState('');
  const [imovelCodigo, setImovelCodigo] = useState('');
  const [contratoCodigo, setContratoCodigo] = useState('');
  const [valorOriginal, setValorOriginal] = useState('');
  const [valorDispensado, setValorDispensado] = useState('');
  const [solicitanteNome, setSolicitanteNome] = useState('Gestor Financeiro / Atendimento');
  const [aprovadorNome, setAprovadorNome] = useState('Diretoria Executiva');
  const [motivoJustificativa, setMotivoJustificativa] = useState('');

  useEffect(() => {
    if (initialData) {
      setTipoDispensa(initialData.tipoDispensa);
      setBeneficiarioNome(initialData.beneficiarioNome);
      setImovelCodigo(initialData.imovelCodigo || '');
      setContratoCodigo(initialData.contratoCodigo || '');
      setValorOriginal(initialData.valorOriginal.toString());
      setValorDispensado(initialData.valorDispensado.toString());
      setSolicitanteNome(initialData.solicitanteNome);
      setAprovadorNome(initialData.aprovadorNome || 'Diretoria Executiva');
      setMotivoJustificativa(initialData.motivoJustificativa);
    } else {
      setTipoDispensa('MULTA_MORATORIA');
      setBeneficiarioNome('');
      setImovelCodigo('');
      setContratoCodigo('');
      setValorOriginal('');
      setValorDispensado('');
      setSolicitanteNome('Gestor Financeiro / Atendimento');
      setAprovadorNome('Diretoria Executiva');
      setMotivoJustificativa('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vOrig = parseFloat(valorOriginal.replace(',', '.'));
    const vDisp = parseFloat(valorDispensado.replace(',', '.'));
    if (!beneficiarioNome || !motivoJustificativa || isNaN(vOrig) || isNaN(vDisp)) return;

    onSave({
      tipoDispensa,
      beneficiarioNome,
      imovelCodigo: imovelCodigo || undefined,
      contratoCodigo: contratoCodigo || undefined,
      valorOriginal: vOrig,
      valorDispensado: vDisp,
      valorFinalCobrado: Math.max(0, vOrig - vDisp),
      solicitanteNome,
      aprovadorNome,
      motivoJustificativa,
      status: initialData ? initialData.status : 'APROVADO',
      dataAprovacao: new Date().toISOString().split('T')[0]
    }, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {initialData ? 'Editar Dispensa / Isenção' : 'Registrar Dispensa / Isenção'}
              </h3>
              <p className="text-xs text-slate-400">Formalize abonos de multas, juros de mora ou taxas administrativas</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tipo de Isenção / Dispensa *
              </label>
              <select
                value={tipoDispensa}
                onChange={e => setTipoDispensa(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-purple-500"
              >
                <option value="MULTA_MORATORIA">Dispensa de Multa Moratória por Atraso</option>
                <option value="JUROS_ATRASO">Isenção de Juros de Mora</option>
                <option value="TAXA_ADMINISTRATIVA">Desconto na Taxa Administrativa</option>
                <option value="TAXA_VISTORIA">Isenção da Taxa de Vistoria de Locação</option>
                <option value="TAXA_EXPEDIENTE">Isenção de Taxa de Expediente / Emolumentos</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Beneficiário (Cliente / Inquilino / Proprietário) *
              </label>
              <input
                type="text"
                required
                value={beneficiarioNome}
                onChange={e => setBeneficiarioNome(e.target.value)}
                placeholder="Ex: João da Silva Sauro (Inquilino Apto 101)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Código do Imóvel
              </label>
              <input
                type="text"
                value={imovelCodigo}
                onChange={e => setImovelCodigo(e.target.value)}
                placeholder="Ex: AP-MOE-101"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white uppercase placeholder-slate-500 focus:outline-hidden focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nº Contrato de Locação / Venda
              </label>
              <input
                type="text"
                value={contratoCodigo}
                onChange={e => setContratoCodigo(e.target.value)}
                placeholder="Ex: CTR-LOC-2026-44"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Valor Original da Taxa/Multa (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={valorOriginal}
                onChange={e => setValorOriginal(e.target.value)}
                placeholder="0,00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Valor Dispensado / Abatido (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={valorDispensado}
                onChange={e => setValorDispensado(e.target.value)}
                placeholder="0,00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Justificativa Formal / Motivo da Aprovação *
              </label>
              <textarea
                rows={3}
                required
                value={motivoJustificativa}
                onChange={e => setMotivoJustificativa(e.target.value)}
                placeholder="Explique o motivo do abono (falha bancária no vencimento, cliente de longa data, concessão para fechamento contratual...)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {initialData ? 'Salvar Alterações' : 'Aprovar Dispensa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

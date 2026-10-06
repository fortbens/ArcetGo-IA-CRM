import React, { useState, useEffect } from 'react';
import { X, Users, DollarSign, Calendar, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';
import { LancamentoSalarial } from '../../types/financialErp';

interface NovoLancamentoSalarialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lancamento: Omit<LancamentoSalarial, 'id' | 'codigo'>, idParaEditar?: string) => void;
  initialData?: LancamentoSalarial | null;
}

export const NovoLancamentoSalarialModal: React.FC<NovoLancamentoSalarialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [colaboradorNome, setColaboradorNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState<LancamentoSalarial['departamento']>('VENDAS');
  const [tipoContrato, setTipoContrato] = useState<LancamentoSalarial['tipoContrato']>('CLT');
  const [salarioBase, setSalarioBase] = useState('');
  const [beneficios, setBeneficios] = useState('0');
  const [adiantamento, setAdiantamento] = useState('0');
  const [descontos, setDescontos] = useState('0');
  const [mesReferencia, setMesReferencia] = useState('09/2026');
  const [dataPrevista, setDataPrevista] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<LancamentoSalarial['status']>('PROGRAMADO');
  const [chavePix, setChavePix] = useState('');

  useEffect(() => {
    if (initialData) {
      setColaboradorNome(initialData.colaboradorNome);
      setCargo(initialData.cargo);
      setDepartamento(initialData.departamento);
      setTipoContrato(initialData.tipoContrato);
      setSalarioBase(initialData.salarioBase.toString());
      setBeneficios(initialData.beneficios.toString());
      setAdiantamento(initialData.adiantamento.toString());
      setDescontos(initialData.descontos.toString());
      setMesReferencia(initialData.mesReferencia);
      setDataPrevista(initialData.dataPrevista);
      setStatus(initialData.status);
      setChavePix(initialData.chavePix || '');
    } else {
      setColaboradorNome('');
      setCargo('Consultor Imobiliário / Operações');
      setDepartamento('VENDAS');
      setTipoContrato('CLT');
      setSalarioBase('4500');
      setBeneficios('850');
      setAdiantamento('0');
      setDescontos('420');
      setMesReferencia('09/2026');
      setDataPrevista(new Date().toISOString().split('T')[0]);
      setStatus('PROGRAMADO');
      setChavePix('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const baseNum = parseFloat(salarioBase.replace(',', '.')) || 0;
  const benefNum = parseFloat(beneficios.replace(',', '.')) || 0;
  const adiantNum = parseFloat(adiantamento.replace(',', '.')) || 0;
  const descNum = parseFloat(descontos.replace(',', '.')) || 0;
  const valorLiquido = Math.max(0, baseNum + benefNum - adiantNum - descNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaboradorNome.trim()) return;

    onSave({
      colaboradorNome: colaboradorNome.trim(),
      cargo: cargo.trim() || 'Colaborador',
      departamento,
      tipoContrato,
      salarioBase: baseNum,
      beneficios: benefNum,
      adiantamento: adiantNum,
      descontos: descNum,
      valorLiquido,
      mesReferencia,
      dataPrevista,
      status,
      chavePix: chavePix.trim() || undefined
    }, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header with prominent X button */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg">
                {initialData ? 'Editar Lançamento Salarial' : 'Lançar Pagamento de Folha / Pró-Labore'}
              </h3>
              <p className="text-xs text-slate-400">
                Remuneração fixa, pró-labore, estagiários e benefícios da equipe
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome do Colaborador / Sócio *
              </label>
              <input
                type="text"
                required
                value={colaboradorNome}
                onChange={e => setColaboradorNome(e.target.value)}
                placeholder="Ex: Beatriz Albuquerque"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cargo / Função *
              </label>
              <input
                type="text"
                required
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                placeholder="Ex: Gerente Administrativo"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Departamento
              </label>
              <select
                value={departamento}
                onChange={e => setDepartamento(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="VENDAS">Vendas</option>
                <option value="LOCACAO">Locação & Gestão</option>
                <option value="FINANCEIRO">Financeiro</option>
                <option value="JURIDICO">Jurídico</option>
                <option value="DIRETORIA">Diretoria / Sócios</option>
                <option value="ATENDIMENTO">Atendimento / SAC</option>
                <option value="TI">Tecnologia / TI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Regime Contratual
              </label>
              <select
                value={tipoContrato}
                onChange={e => setTipoContrato(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="CLT">CLT (Efetivo)</option>
                <option value="PJ">Prestador PJ</option>
                <option value="PRO_LABORE_SOCIO">Pró-Labore Sócio</option>
                <option value="ESTAGIO">Estágio</option>
                <option value="AUTONOMO_COMISSIONADO">Autônomo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mês Competência
              </label>
              <input
                type="text"
                value={mesReferencia}
                onChange={e => setMesReferencia(e.target.value)}
                placeholder="Ex: 09/2026"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>
          </div>

          {/* Salary values grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Salário Base (R$)
              </label>
              <input
                type="text"
                value={salarioBase}
                onChange={e => setSalarioBase(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                (+) Benefícios (R$)
              </label>
              <input
                type="text"
                value={beneficios}
                onChange={e => setBeneficios(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-emerald-300 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-amber-400 mb-1">
                (-) Adiantamento (R$)
              </label>
              <input
                type="text"
                value={adiantamento}
                onChange={e => setAdiantamento(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-amber-300 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-rose-400 mb-1">
                (-) Descontos (R$)
              </label>
              <input
                type="text"
                value={descontos}
                onChange={e => setDescontos(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-rose-300 font-mono text-xs"
              />
            </div>
          </div>

          {/* Valor Líquido Preview */}
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-300">Valor Líquido a Pagar:</span>
            <span className="text-base font-extrabold text-white font-mono">
              R$ {valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Data Prevista Pagamento
              </label>
              <input
                type="date"
                value={dataPrevista}
                onChange={e => setDataPrevista(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chave Pix Colaborador
              </label>
              <input
                type="text"
                value={chavePix}
                onChange={e => setChavePix(e.target.value)}
                placeholder="CPF ou e-mail"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Atual
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="PROGRAMADO">Programado</option>
                <option value="PAGO">Pago / Quitado</option>
                <option value="PENDENTE">Pendente</option>
              </select>
            </div>
          </div>

          {/* Modal Footer with Cancel and Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancelar / Fechar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{initialData ? 'Salvar Alterações' : 'Lançar Salário'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

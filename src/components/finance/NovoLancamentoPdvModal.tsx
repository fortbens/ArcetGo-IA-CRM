import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ArrowDownRight, ArrowUpRight, DollarSign, QrCode, CheckCircle } from 'lucide-react';
import { TransacaoPdv, TipoServicoPdv, FormaPagamento } from '../../types/financialErp';

interface NovoLancamentoPdvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transacao: Omit<TransacaoPdv, 'id' | 'codigo' | 'dataHora'>, idParaEditar?: string) => void;
  initialData?: TransacaoPdv | null;
}

export const NovoLancamentoPdvModal: React.FC<NovoLancamentoPdvModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [tipoServico, setTipoServico] = useState<TipoServicoPdv>('CERTIDAO_CARTORIO_RGI');
  const [descricao, setDescricao] = useState('');
  const [clienteOuPrestador, setClienteOuPrestador] = useState('');
  const [imovelCodigoReferencia, setImovelCodigoReferencia] = useState('');
  const [processoNumero, setProcessoNumero] = useState('');
  const [valor, setValor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');
  const [operadorCaixa, setOperadorCaixa] = useState('Balcão de Atendimento (Operador Ativo)');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (initialData) {
      setTipo(initialData.tipo);
      setTipoServico(initialData.tipoServico);
      setDescricao(initialData.descricao);
      setClienteOuPrestador(initialData.clienteOuPrestador);
      setImovelCodigoReferencia(initialData.imovelCodigoReferencia || '');
      setProcessoNumero(initialData.processoNumero || '');
      setValor(initialData.valor.toString());
      setFormaPagamento(initialData.formaPagamento);
      setOperadorCaixa(initialData.operadorCaixa);
      setObservacoes(initialData.observacoes || '');
    } else {
      setTipo('ENTRADA');
      setTipoServico('CERTIDAO_CARTORIO_RGI');
      setDescricao('');
      setClienteOuPrestador('');
      setImovelCodigoReferencia('');
      setProcessoNumero('');
      setValor('');
      setFormaPagamento('PIX');
      setOperadorCaixa('Balcão de Atendimento (Operador Ativo)');
      setObservacoes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !clienteOuPrestador) return;

    onSave({
      tipo,
      tipoServico,
      descricao,
      clienteOuPrestador,
      imovelCodigoReferencia: imovelCodigoReferencia || undefined,
      processoNumero: processoNumero || undefined,
      valor: parseFloat(valor.replace(',', '.')),
      formaPagamento,
      operadorCaixa,
      reciboEmitido: true,
      observacoes: observacoes || undefined
    }, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              tipo === 'ENTRADA' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {initialData ? 'Editar Lançamento no PDV' : 'Novo Lançamento no PDV Balcão'}
              </h3>
              <p className="text-xs text-slate-400">Pagamento ou recebimento de certidões, despachos, motoboy ou reparos</p>
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
          {/* Seletor Tipo: Entrada ou Saída */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setTipo('ENTRADA')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tipo === 'ENTRADA'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              Recebimento (Entrada)
            </button>
            <button
              type="button"
              onClick={() => setTipo('SAIDA')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tipo === 'SAIDA'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Pagamento (Saída / Despesa)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tipo do Serviço de Balcão *
              </label>
              <select
                value={tipoServico}
                onChange={e => setTipoServico(e.target.value as TipoServicoPdv)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value="CERTIDAO_CARTORIO_RGI">Certidão Cartório / RGI</option>
                <option value="CERTIDAO_ONUS_REAIS">Certidão de Ônus Reais & Ações</option>
                <option value="CERTIDAO_PROTESTO">Certidão de Protesto / Forense</option>
                <option value="DESPACHO_PREFEITURA">Despacho de ITBI / Prefeitura</option>
                <option value="GUIA_HONORARIOS_JURIDICOS">Guia & Honorários Jurídicos</option>
                <option value="MANUTENCAO_REPARO">Manutenção & Reparo Predial</option>
                <option value="DESLOCAMENTO_MOTOBOY">Deslocamento / Motoboy / Malote</option>
                <option value="CHAVEIRO_TROCA_SEGREDO">Chaveiro / Cópias / Troca de Segredo</option>
                <option value="AUTENTICACAO_RECONHECIMENTO">Autenticação / Reconhecimento Firma</option>
                <option value="OUTROS_SERVICOS">Outros Serviços</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Valor Total (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={valor}
                  onChange={e => setValor(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Descrição do Lançamento *
              </label>
              <input
                type="text"
                required
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Ex: Emissão de Certidão Negativa Forense - Venda Apto 54"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {tipo === 'ENTRADA' ? 'Cliente / Pagador *' : 'Prestador / Favorecido *'}
              </label>
              <input
                type="text"
                required
                value={clienteOuPrestador}
                onChange={e => setClienteOuPrestador(e.target.value)}
                placeholder={tipo === 'ENTRADA' ? 'Nome do cliente pagador' : 'Nome do motoboy/chaveiro/cartório'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Forma de Pagamento *
              </label>
              <select
                value={formaPagamento}
                onChange={e => setFormaPagamento(e.target.value as FormaPagamento)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value="PIX">PIX (Chave ou QR Code)</option>
                <option value="DINHEIRO_ESPECIE">Dinheiro em Espécie (Caixa Físico)</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="TED_DOC">Transferência Bancária</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Código do Imóvel Vinculado (Opcional)
              </label>
              <input
                type="text"
                value={imovelCodigoReferencia}
                onChange={e => setImovelCodigoReferencia(e.target.value)}
                placeholder="Ex: AP-MOE-101"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white uppercase placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nº Processo / Protocolo de Cartório
              </label>
              <input
                type="text"
                value={processoNumero}
                onChange={e => setProcessoNumero(e.target.value)}
                placeholder="Ex: PROT-2026-909"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observações
              </label>
              <input
                type="text"
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Detalhes adicionais para o fechamento de caixa diário..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
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
              className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {initialData ? 'Salvar Alterações' : 'Confirmar no PDV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

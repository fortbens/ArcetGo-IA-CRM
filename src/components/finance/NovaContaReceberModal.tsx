import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, Building, User, CheckCircle } from 'lucide-react';
import { ContaReceber, OrigemReceita, FormaPagamento } from '../../types/financialErp';

interface NovaContaReceberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (conta: Omit<ContaReceber, 'id' | 'codigo'>, idParaEditar?: string) => void;
  initialData?: ContaReceber | null;
}

export const NovaContaReceberModal: React.FC<NovaContaReceberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [descricao, setDescricao] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [imovelCodigo, setImovelCodigo] = useState('');
  const [origem, setOrigem] = useState<OrigemReceita>('COMISSAO_VENDA');
  const [valorPrevisto, setValorPrevisto] = useState('');
  const [dataVencimento, setDataVencimento] = useState(new Date().toISOString().split('T')[0]);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (initialData) {
      setDescricao(initialData.descricao);
      setClienteNome(initialData.clienteNome);
      setImovelCodigo(initialData.imovelCodigo || '');
      setOrigem(initialData.origem);
      setValorPrevisto(initialData.valorPrevisto.toString());
      setDataVencimento(initialData.dataVencimento);
      setFormaPagamento(initialData.formaPagamento);
      setNumeroDocumento(initialData.numeroDocumento || '');
      setObservacoes(initialData.observacoes || '');
    } else {
      setDescricao('');
      setClienteNome('');
      setImovelCodigo('');
      setOrigem('COMISSAO_VENDA');
      setValorPrevisto('');
      setDataVencimento(new Date().toISOString().split('T')[0]);
      setFormaPagamento('PIX');
      setNumeroDocumento('');
      setObservacoes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valorPrevisto || !clienteNome) return;

    onSave({
      descricao,
      clienteNome,
      imovelCodigo: imovelCodigo || undefined,
      origem,
      valorPrevisto: parseFloat(valorPrevisto.replace(',', '.')),
      dataVencimento,
      formaPagamento,
      status: initialData ? initialData.status : 'PENDENTE',
      numeroDocumento: numeroDocumento || undefined,
      observacoes: observacoes || undefined
    }, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {initialData ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
              </h3>
              <p className="text-xs text-slate-400">Registre recebimentos de comissões, taxas de locação ou serviços</p>
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
                Descrição do Recebimento *
              </label>
              <input
                type="text"
                required
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Ex: Comissão Venda - Apto 32 Ed. Grand Park"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Cliente / Pagador *
              </label>
              <input
                type="text"
                required
                value={clienteNome}
                onChange={e => setClienteNome(e.target.value)}
                placeholder="Ex: Construtora Cyrela ou Nome do Comprador"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Código do Imóvel Referenciado (Opcional)
              </label>
              <input
                type="text"
                value={imovelCodigo}
                onChange={e => setImovelCodigo(e.target.value)}
                placeholder="Ex: AP-MOE-101"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Origem da Receita *
              </label>
              <select
                value={origem}
                onChange={e => setOrigem(e.target.value as OrigemReceita)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="COMISSAO_VENDA">Comissão sobre Venda</option>
                <option value="TAXA_INTERMEDIACAO_LOCACAO">Taxa de Intermediação (1º Aluguel)</option>
                <option value="TAXA_ADMINISTRACAO_LOCACAO">Taxa de Administração (Mensal)</option>
                <option value="SERVICO_DESPACHANTE">Serviço de Despachante & Vistoria</option>
                <option value="TAXA_AVALIACAO_IMOVEL">Taxa de Avaliação Mercadológica (PTAM)</option>
                <option value="TAXA_ANALISE_CREDITO">Taxa de Análise de Crédito</option>
                <option value="SERVICO_PDV_BALCAO">Serviço PDV Balcão</option>
                <option value="RENDIMENTOS_APLICACOES">Rendimentos de Aplicações</option>
                <option value="OUTRAS_RECEITAS">Outras Receitas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Valor Previsto (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={valorPrevisto}
                  onChange={e => setValorPrevisto(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Data Prevista de Vencimento / Recebimento *
              </label>
              <input
                type="date"
                required
                value={dataVencimento}
                onChange={e => setDataVencimento(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Forma Prevista de Recebimento
              </label>
              <select
                value={formaPagamento}
                onChange={e => setFormaPagamento(e.target.value as FormaPagamento)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="PIX">PIX Direto na Conta</option>
                <option value="BOLETO">Boleto Bancário</option>
                <option value="TED_DOC">Transferência TED / DOC</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="DINHEIRO_ESPECIE">Dinheiro em Espécie (Caixa PDV)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nº Contrato / Proposta / Referência
              </label>
              <input
                type="text"
                value={numeroDocumento}
                onChange={e => setNumeroDocumento(e.target.value)}
                placeholder="Ex: PROP-2026-90 ou CTR-VENDA-08"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observações
              </label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Condições especiais, parcelas, dados bancários de recebimento..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
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
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {initialData ? 'Salvar Alterações' : 'Lançar Conta a Receber'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

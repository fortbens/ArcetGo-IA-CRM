import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard, Building, FileText, CheckCircle } from 'lucide-react';
import { ContaPagar, CategoriaDespesa, FormaPagamento, Fornecedor } from '../../types/financialErp';

interface NovaContaPagarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (conta: Omit<ContaPagar, 'id' | 'codigo'>, idParaEditar?: string) => void;
  fornecedores: Fornecedor[];
  initialData?: ContaPagar | null;
}

export const NovaContaPagarModal: React.FC<NovaContaPagarModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fornecedores,
  initialData
}) => {
  const [descricao, setDescricao] = useState('');
  const [favorecidoNome, setFavorecidoNome] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [categoria, setCategoria] = useState<CategoriaDespesa>('FORNECEDORES');
  const [centroCusto, setCentroCusto] = useState('ADMINISTRATIVO / SEDE');
  const [valor, setValor] = useState('');
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0]);
  const [dataVencimento, setDataVencimento] = useState(new Date().toISOString().split('T')[0]);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (initialData) {
      setDescricao(initialData.descricao);
      setFavorecidoNome(initialData.favorecidoNome);
      setFornecedorId(initialData.fornecedorId || '');
      setCategoria(initialData.categoria);
      setCentroCusto(initialData.centroCusto);
      setValor(initialData.valor.toString());
      setDataEmissao(initialData.dataEmissao);
      setDataVencimento(initialData.dataVencimento);
      setFormaPagamento(initialData.formaPagamento);
      setNumeroDocumento(initialData.numeroDocumento || '');
      setObservacoes(initialData.observacoes || '');
    } else {
      setDescricao('');
      setFavorecidoNome('');
      setFornecedorId('');
      setCategoria('FORNECEDORES');
      setCentroCusto('ADMINISTRATIVO / SEDE');
      setValor('');
      setDataEmissao(new Date().toISOString().split('T')[0]);
      setDataVencimento(new Date().toISOString().split('T')[0]);
      setFormaPagamento('PIX');
      setNumeroDocumento('');
      setObservacoes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFornecedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fId = e.target.value;
    setFornecedorId(fId);
    if (fId) {
      const f = fornecedores.find(item => item.id === fId);
      if (f) {
        setFavorecidoNome(f.razaoSocial || f.nomeFantasia);
        setCategoria(f.categoria);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !favorecidoNome) return;

    onSave({
      descricao,
      favorecidoNome,
      fornecedorId: fornecedorId || undefined,
      categoria,
      centroCusto,
      valor: parseFloat(valor.replace(',', '.')),
      dataEmissao,
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
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {initialData ? 'Editar Conta a Pagar' : 'Novo Título a Pagar'}
              </h3>
              <p className="text-xs text-slate-400">Cadastre despesas operacionais, tributos, fornecedores ou manutenções</p>
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
                Descrição do Pagamento *
              </label>
              <input
                type="text"
                required
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Ex: Emissão de 10 Certidões Vintenárias - Fechamento Venda Apto 101"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Selecionar Fornecedor Cadastrado (Opcional)
              </label>
              <select
                value={fornecedorId}
                onChange={handleFornecedorChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-rose-500"
              >
                <option value="">-- Avulso / Não cadastrado --</option>
                {fornecedores.map(f => (
                  <option key={f.id} value={f.id}>
                    [{f.codigo}] {f.nomeFantasia || f.razaoSocial}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Favorecido / Razão Social *
              </label>
              <input
                type="text"
                required
                value={favorecidoNome}
                onChange={e => setFavorecidoNome(e.target.value)}
                placeholder="Ex: 1º Cartório de Registro de Imóveis"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Categoria de Despesa *
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value as CategoriaDespesa)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-rose-500"
              >
                <option value="FORNECEDORES">Fornecedores & Prestadores</option>
                <option value="CARTORIO_CERTIDOES">Cartório & Certidões</option>
                <option value="DESPACHOS_TAXAS">Despachos & Taxas Públicas</option>
                <option value="JURIDICO_HONORARIOS">Jurídico & Honorários</option>
                <option value="MANUTENCAO_IMOVEL">Manutenção & Reparos</option>
                <option value="DESLOCAMENTO_MOTOBOY">Deslocamento & Motoboy</option>
                <option value="SALARIAL_FOLHA">Folha Salarial</option>
                <option value="PRO_LABORE">Pró-Labore Sócios</option>
                <option value="MARKETING_ANUNCIOS">Marketing & Anúncios</option>
                <option value="TECNOLOGIA_SOFTWARE">Tecnologia & Softwares</option>
                <option value="TRIBUTOS_IMPOSTOS">Tributos & Impostos</option>
                <option value="INFRAESTRUTURA_ALUGUEL">Aluguel & Infra Sede</option>
                <option value="OUTRAS_DESPESAS">Outras Despesas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                required
                value={dataVencimento}
                onChange={e => setDataVencimento(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Forma Prevista de Pagamento
              </label>
              <select
                value={formaPagamento}
                onChange={e => setFormaPagamento(e.target.value as FormaPagamento)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-rose-500"
              >
                <option value="PIX">PIX Instantâneo</option>
                <option value="BOLETO">Boleto Bancário</option>
                <option value="TED_DOC">Transferência TED / DOC</option>
                <option value="CARTAO_CREDITO">Cartão Corporativo de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="DINHEIRO_ESPECIE">Dinheiro em Espécie (Caixa PDV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Centro de Custo
              </label>
              <input
                type="text"
                value={centroCusto}
                onChange={e => setCentroCusto(e.target.value)}
                placeholder="Ex: OPERAÇÕES IMOBILIÁRIAS"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nº do Documento / Nota Fiscal / Boleto
              </label>
              <input
                type="text"
                value={numeroDocumento}
                onChange={e => setNumeroDocumento(e.target.value)}
                placeholder="Ex: NF-e 4521 ou Linha Digitável"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observações Adicionais
              </label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Instruções de pagamento, código de barras, chave PIX manual..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
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
              className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {initialData ? 'Salvar Alterações' : 'Lançar Conta a Pagar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

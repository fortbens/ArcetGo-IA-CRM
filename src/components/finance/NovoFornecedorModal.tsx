import React, { useState, useEffect } from 'react';
import { X, Building, Mail, Phone, MapPin, Key, CheckCircle } from 'lucide-react';
import { Fornecedor, CategoriaDespesa } from '../../types/financialErp';

interface NovoFornecedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fornecedor: Omit<Fornecedor, 'id' | 'codigo' | 'totalFaturado'>, idParaEditar?: string) => void;
  initialData?: Fornecedor | null;
}

export const NovoFornecedorModal: React.FC<NovoFornecedorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [categoria, setCategoria] = useState<CategoriaDespesa>('FORNECEDORES');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [tipoChavePix, setTipoChavePix] = useState<'CNPJ' | 'CPF' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA'>('CNPJ');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [estado, setEstado] = useState('SP');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (initialData) {
      setRazaoSocial(initialData.razaoSocial);
      setNomeFantasia(initialData.nomeFantasia || '');
      setCnpjCpf(initialData.cnpjCpf);
      setCategoria(initialData.categoria);
      setEmail(initialData.email);
      setTelefone(initialData.telefone);
      setChavePix(initialData.chavePix || '');
      setTipoChavePix(initialData.tipoChavePix || 'CNPJ');
      setBanco(initialData.dadosBancarios?.banco || '');
      setAgencia(initialData.dadosBancarios?.agencia || '');
      setConta(initialData.dadosBancarios?.conta || '');
      setCidade(initialData.cidade);
      setEstado(initialData.estado);
      setObservacoes(initialData.observacoes || '');
    } else {
      setRazaoSocial('');
      setNomeFantasia('');
      setCnpjCpf('');
      setCategoria('FORNECEDORES');
      setEmail('');
      setTelefone('');
      setChavePix('');
      setTipoChavePix('CNPJ');
      setBanco('');
      setAgencia('');
      setConta('');
      setCidade('São Paulo');
      setEstado('SP');
      setObservacoes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial || !cnpjCpf || !email || !telefone) return;

    onSave({
      razaoSocial,
      nomeFantasia: nomeFantasia || razaoSocial,
      cnpjCpf,
      categoria,
      email,
      telefone,
      chavePix: chavePix || undefined,
      tipoChavePix,
      dadosBancarios: banco ? { banco, agencia, conta } : undefined,
      cidade,
      estado,
      status: initialData ? initialData.status : 'ATIVO',
      observacoes: observacoes || undefined
    }, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {initialData ? 'Editar Fornecedor / Prestador' : 'Novo Fornecedor / Prestador'}
              </h3>
              <p className="text-xs text-slate-400">Cadastre cartórios, despachantes, prestadores de manutenção ou logística</p>
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
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Razão Social / Nome Completo *
              </label>
              <input
                type="text"
                required
                value={razaoSocial}
                onChange={e => setRazaoSocial(e.target.value)}
                placeholder="Ex: Cartório do 1º Ofício de Notas e Imóveis"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome Fantasia (Como é conhecido)
              </label>
              <input
                type="text"
                value={nomeFantasia}
                onChange={e => setNomeFantasia(e.target.value)}
                placeholder="Ex: 1º RGI Central"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                CNPJ ou CPF *
              </label>
              <input
                type="text"
                required
                value={cnpjCpf}
                onChange={e => setCnpjCpf(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Categoria Principal *
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value as CategoriaDespesa)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500"
              >
                <option value="CARTORIO_CERTIDOES">Cartório & Emissão de Certidões</option>
                <option value="DESPACHOS_TAXAS">Despachante Imobiliário & Prefeituras</option>
                <option value="MANUTENCAO_IMOVEL">Manutenção, Reformas & Chaveiro</option>
                <option value="DESLOCAMENTO_MOTOBOY">Logística & Motoboy</option>
                <option value="JURIDICO_HONORARIOS">Assessoria Jurídica & Notarial</option>
                <option value="TECNOLOGIA_SOFTWARE">Sistemas, Portais & TI</option>
                <option value="MARKETING_ANUNCIOS">Mídia & Agências de Marketing</option>
                <option value="FORNECEDORES">Fornecedores Diversos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-mail para Faturamento *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="financeiro@empresa.com.br"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Telefone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Chave PIX
              </label>
              <div className="flex gap-2">
                <select
                  value={tipoChavePix}
                  onChange={e => setTipoChavePix(e.target.value as any)}
                  className="w-28 bg-slate-800 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="CNPJ">CNPJ</option>
                  <option value="CPF">CPF</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="TELEFONE">Telefone</option>
                  <option value="ALEATORIA">Aleatória</option>
                </select>
                <input
                  type="text"
                  value={chavePix}
                  onChange={e => setChavePix(e.target.value)}
                  placeholder="Chave PIX para pagamentos"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={estado}
                  onChange={e => setEstado(e.target.value.toUpperCase())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white uppercase focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observações Operacionais
              </label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Prazos médios de entrega, contato do atendente, chaveiro plantonista..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
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
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {initialData ? 'Salvar Alterações' : 'Salvar Fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Check, 
  FileText, 
  Compass, 
  Building2, 
  DollarSign, 
  Save, 
  Sparkles, 
  Image, 
  FileDown, 
  Layers,
  Edit2,
  Table
} from 'lucide-react';
import { LaunchDevelopment, FloorPlanMaterial, BrochureDocument } from '../../types/launches';
import { DevelopmentUnit, UnitStatus } from '../../types/crm';

// ==========================================
// 1. MODAL DE EDIÇÃO DO EMPREENDIMENTO
// ==========================================
interface EditDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  development: LaunchDevelopment;
  onSave: (updatedDev: LaunchDevelopment) => void;
}

export const EditDevelopmentModal: React.FC<EditDevelopmentModalProps> = ({
  isOpen,
  onClose,
  development,
  onSave
}) => {
  const [formData, setFormData] = useState<LaunchDevelopment>({ ...development });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Editar Dados do Empreendimento</h3>
              <p className="text-xs text-slate-300">Altere informações gerais, RI e links comerciais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome do Empreendimento</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Código / Referência</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Slogan Comercial / Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Construtora</label>
              <input
                type="text"
                value={formData.builderName}
                onChange={(e) => setFormData({ ...formData, builderName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Incorporadora</label>
              <input
                type="text"
                value={formData.developerName}
                onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bairro</label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cidade / UF</label>
              <input
                type="text"
                value={`${formData.city} - ${formData.state}`}
                onChange={(e) => setFormData({ ...formData, city: e.target.value.split('-')[0]?.trim() || formData.city })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Previsão Entrega</label>
              <input
                type="text"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Endereço Completo do Stand / Terreno</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registro de Incorporação (RI)</label>
              <input
                type="text"
                value={formData.incorporationRegistryNumber}
                onChange={(e) => setFormData({ ...formData, incorporationRegistryNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Status do Empreendimento</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-800"
              >
                <option value="PRE_LANCAMENTO">Pré-Lançamento (Prioridade & Reservas)</option>
                <option value="LANCAMENTO_OFICIAL">Lançamento Oficial (Plantão Aberto)</option>
                <option value="OBRAS_ACELERADAS">Obras Aceleradas (Em Construção)</option>
                <option value="PRONTO_PARA_MORAR">Pronto para Morar (Habite-se Emitido)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">URL do Banner Principal (Fachada/Perspectiva)</label>
            <input
              type="text"
              value={formData.bannerUrl}
              onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Link do Tour Virtual 360°</label>
              <input
                type="text"
                placeholder="https://tour.matterport.com/..."
                value={formData.virtualTour360Url || ''}
                onChange={(e) => setFormData({ ...formData, virtualTour360Url: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Link de Vídeo Comercial (YouTube/Vimeo)</label>
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoTourUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoTourUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 2. MODAL DE INCLUSÃO / EDIÇÃO DE TABELA DE VENDAS & UNIDADES
// ==========================================
interface SalesTableEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  development: LaunchDevelopment;
  onSave: (updatedDev: LaunchDevelopment) => void;
}

export const SalesTableEditorModal: React.FC<SalesTableEditorModalProps> = ({
  isOpen,
  onClose,
  development,
  onSave
}) => {
  const [config, setConfig] = useState({ ...development.salesTableConfig });
  const [units, setUnits] = useState<DevelopmentUnit[]>([...development.units]);
  const [activeSubTab, setActiveSubTab] = useState<'condicoes' | 'nova_unidade'>('condicoes');

  // Form para nova unidade
  const [newUnit, setNewUnit] = useState<Partial<DevelopmentUnit>>({
    tower: development.towers[0] || 'Torre A',
    floor: 1,
    unitNumber: '11',
    typology: '3 Suítes + Varanda Gourmet',
    privateAreaM2: 124,
    parkingSpaces: 2,
    sunOrientation: 'MANHA',
    price: 1850000,
    status: 'DISPONIVEL'
  });

  if (!isOpen) return null;

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdUnit: DevelopmentUnit = {
      id: `unit_${Date.now()}`,
      developmentId: development.id,
      tower: newUnit.tower || 'Torre A',
      floor: Number(newUnit.floor) || 1,
      unitNumber: newUnit.unitNumber || '101',
      typology: newUnit.typology || '3 Suítes',
      privateAreaM2: Number(newUnit.privateAreaM2) || 100,
      parkingSpaces: Number(newUnit.parkingSpaces) || 2,
      sunOrientation: (newUnit.sunOrientation as any) || 'MANHA',
      price: Number(newUnit.price) || 1500000,
      condoFee: 1200,
      iptuFee: 450,
      status: (newUnit.status as UnitStatus) || 'DISPONIVEL'
    };

    const nextUnits = [createdUnit, ...units];
    setUnits(nextUnits);
    onSave({
      ...development,
      units: nextUnits,
      totalUnits: nextUnits.length,
      availableUnits: nextUnits.filter(u => u.status === 'DISPONIVEL').length,
      reservedUnits: nextUnits.filter(u => u.status === 'RESERVADO').length,
      soldUnits: nextUnits.filter(u => u.status === 'VENDIDO').length
    });
    alert(`Unidade ${createdUnit.unitNumber} inserida com sucesso na Tabela de Vendas!`);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...development,
      salesTableConfig: config,
      units
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Gestão da Tabela de Vendas & Unidades</h3>
              <p className="text-xs text-slate-300">Edite fluxos financeiros ou cadastre novas unidades no espelho</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 text-xs font-bold gap-3">
          <button
            onClick={() => setActiveSubTab('condicoes')}
            className={`py-2 px-3 border-b-2 transition-all ${
              activeSubTab === 'condicoes' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Fluxo de Pagamento (% Sinal / Mensais / Chaves)
          </button>
          <button
            onClick={() => setActiveSubTab('nova_unidade')}
            className={`py-2 px-3 border-b-2 transition-all ${
              activeSubTab === 'nova_unidade' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            + Adicionar Nova Unidade ao Estoque ({units.length} cadastradas)
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto text-xs">
          {activeSubTab === 'condicoes' ? (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">% Entrada / Sinal (Ato)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.signalPercent}
                    onChange={(e) => setConfig({ ...config, signalPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qtd. Mensais Obra</label>
                  <input
                    type="number"
                    value={config.monthlyInstallmentsCount}
                    onChange={(e) => setConfig({ ...config, monthlyInstallmentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">% Total das Mensais</label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.monthlyInstallmentsTotalPercent}
                    onChange={(e) => setConfig({ ...config, monthlyInstallmentsTotalPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qtd. Balões Semestrais</label>
                  <input
                    type="number"
                    value={config.semiAnnualInstallmentsCount}
                    onChange={(e) => setConfig({ ...config, semiAnnualInstallmentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">% Total Balões</label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.semiAnnualInstallmentsTotalPercent}
                    onChange={(e) => setConfig({ ...config, semiAnnualInstallmentsTotalPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">% Financiamento / Chaves</label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.bankFinancingPercent}
                    onChange={(e) => setConfig({ ...config, bankFinancingPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                💡 <strong>Soma dos percentuais:</strong> {config.signalPercent + config.monthlyInstallmentsTotalPercent + config.semiAnnualInstallmentsTotalPercent + config.bankFinancingPercent}%
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Regras de Pagamento</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Torre</label>
                  <select
                    value={newUnit.tower}
                    onChange={(e) => setNewUnit({ ...newUnit, tower: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  >
                    {development.towers.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Andar</label>
                  <input
                    type="number"
                    required
                    value={newUnit.floor}
                    onChange={(e) => setNewUnit({ ...newUnit, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nº da Unidade</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 42, 101, COB-01"
                    value={newUnit.unitNumber}
                    onChange={(e) => setNewUnit({ ...newUnit, unitNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newUnit.status}
                    onChange={(e) => setNewUnit({ ...newUnit, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold text-emerald-700"
                  >
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="RESERVADO">Reservado</option>
                    <option value="VENDIDO">Vendido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipologia</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 3 Suítes, Penthouse, Studio"
                    value={newUnit.typology}
                    onChange={(e) => setNewUnit({ ...newUnit, typology: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Área Privativa (m²)</label>
                  <input
                    type="number"
                    required
                    value={newUnit.privateAreaM2}
                    onChange={(e) => setNewUnit({ ...newUnit, privateAreaM2: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço de Tabela (R$)</label>
                  <input
                    type="number"
                    required
                    value={newUnit.price}
                    onChange={(e) => setNewUnit({ ...newUnit, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold text-blue-700"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar e Adicionar ao Espelho</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 3. MODAL DE UPLOAD DE MATERIAIS & PLANTAS
// ==========================================
interface UploadMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  development: LaunchDevelopment;
  onSave: (updatedDev: LaunchDevelopment) => void;
}

export const UploadMaterialsModal: React.FC<UploadMaterialsModalProps> = ({
  isOpen,
  onClose,
  development,
  onSave
}) => {
  const [materialType, setMaterialType] = useState<'PLANTA' | 'DOCUMENTO'>('PLANTA');

  // Form planta
  const [typologyName, setTypologyName] = useState('Planta 3 Suítes - 142m²');
  const [privateAreaM2, setPrivateAreaM2] = useState(142);
  const [bedrooms, setBedrooms] = useState(3);
  const [suites, setSuites] = useState(3);
  const [parkingSpaces, setParkingSpaces] = useState(2);
  const [description, setDescription] = useState('Planta com churrasqueira a carvão e hall privativo.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000');

  // Form documento
  const [docTitle, setDocTitle] = useState('Book Digital Completo (Apresentação HD)');
  const [docCategory, setDocCategory] = useState<'LIVRO_DO_PRODUTO' | 'TABELA_OFICIAL' | 'MEMORIAL_DESCRITIVO' | 'REGISTRO_INCORPORACAO'>('LIVRO_DO_PRODUTO');
  const [docSize, setDocSize] = useState('18.4 MB');

  if (!isOpen) return null;

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();

    if (materialType === 'PLANTA') {
      const newPlan: FloorPlanMaterial = {
        id: `plan_${Date.now()}`,
        typologyName,
        privateAreaM2: Number(privateAreaM2),
        bedrooms: Number(bedrooms),
        suites: Number(suites),
        parkingSpaces: Number(parkingSpaces),
        description,
        imageUrl,
        blueprintHighResUrl: imageUrl
      };

      const updated = {
        ...development,
        floorPlans: [...development.floorPlans, newPlan]
      };
      onSave(updated);
      alert('Planta humanizada adicionada com sucesso!');
      onClose();
    } else {
      const newDoc: BrochureDocument = {
        id: `doc_${Date.now()}`,
        title: docTitle,
        category: docCategory,
        fileUrl: '#',
        fileSizeMb: docSize,
        uploadedAt: 'Hoje'
      };

      const updated = {
        ...development,
        documents: [...development.documents, newDoc]
      };
      onSave(updated);
      alert('Documento / Material cadastrado com sucesso!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Subir Materiais do Lançamento</h3>
              <p className="text-xs text-slate-300">Adicione plantas humanizadas, books em PDF ou memoriais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMaterialType('PLANTA')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              materialType === 'PLANTA' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Planta Humanizada</span>
          </button>
          <button
            type="button"
            onClick={() => setMaterialType('DOCUMENTO')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              materialType === 'DOCUMENTO' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Book PDF / Memorial</span>
          </button>
        </div>

        <form onSubmit={handleAddMaterial} className="p-5 sm:p-6 space-y-4 text-xs">
          {materialType === 'PLANTA' ? (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Planta / Tipologia</label>
                <input
                  type="text"
                  required
                  value={typologyName}
                  onChange={(e) => setTypologyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Área (m²)</label>
                  <input
                    type="number"
                    value={privateAreaM2}
                    onChange={(e) => setPrivateAreaM2(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dorms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Suítes</label>
                  <input
                    type="number"
                    value={suites}
                    onChange={(e) => setSuites(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vagas</label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Imagem da Planta</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destaques da Planta</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Documento / Apresentação</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-800"
                  >
                    <option value="LIVRO_DO_PRODUTO">Livro do Produto / Book Comercial</option>
                    <option value="TABELA_OFICIAL">Tabela de Preços Oficial</option>
                    <option value="MEMORIAL_DESCRITIVO">Memorial Descritivo Técnico</option>
                    <option value="REGISTRO_INCORPORACAO">Registro de Incorporação (RI)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tamanho Aproximado</label>
                  <input
                    type="text"
                    value={docSize}
                    onChange={(e) => setDocSize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Concluir Upload</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

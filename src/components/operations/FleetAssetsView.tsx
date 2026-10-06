import React, { useState } from 'react';
import { 
  Car, 
  Laptop, 
  Fuel, 
  Gauge, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  DollarSign,
  Edit2,
  Trash2,
  X,
  Save,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { FleetVehicle, CompanyAsset } from '../../types/crm';
import { INITIAL_FLEET, INITIAL_ASSETS } from '../../data/mockData';
import { TableScrollContainer } from '../common/TableScrollContainer';

export const FleetAssetsView: React.FC = () => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(INITIAL_FLEET);
  const [assets, setAssets] = useState<CompanyAsset[]>(INITIAL_ASSETS);
  const [activeTab, setActiveTab] = useState<'frota' | 'patrimonio'>('frota');

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(null);

  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<CompanyAsset | null>(null);

  // Vehicle form
  const [vehicleForm, setVehicleForm] = useState({
    model: '',
    plate: '',
    year: new Date().getFullYear(),
    currentKm: 15000,
    fuelLevelPercent: 100,
    status: 'DISPONIVEL' as 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO',
    assignedBrokerName: '',
    nextRevisionKm: 20000,
    lastCleanedAt: 'Hoje'
  });

  // Asset form
  const [assetForm, setAssetForm] = useState({
    assetCode: '',
    title: '',
    category: 'NOTEBOOK' as 'NOTEBOOK' | 'MONITOR' | 'MOBILIARIO' | 'SMARTPHONE',
    assignedUser: '',
    branch: 'Matriz - Jardins',
    purchaseDate: new Date().toISOString().split('T')[0],
    estimatedValue: 2500,
    condition: 'EXCELENTE' as 'EXCELENTE' | 'BOM' | 'DESGASTADO'
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open vehicle modal
  const handleOpenVehicleModal = (veh?: FleetVehicle) => {
    if (veh) {
      setEditingVehicle(veh);
      setVehicleForm({
        model: veh.model,
        plate: veh.plate,
        year: veh.year || 2024,
        currentKm: veh.currentKm,
        fuelLevelPercent: veh.fuelLevelPercent,
        status: veh.status,
        assignedBrokerName: veh.assignedBrokerName || '',
        nextRevisionKm: veh.nextRevisionKm || 20000,
        lastCleanedAt: veh.lastCleanedAt || 'Hoje'
      });
    } else {
      setEditingVehicle(null);
      setVehicleForm({
        model: '',
        plate: '',
        year: new Date().getFullYear(),
        currentKm: 15000,
        fuelLevelPercent: 100,
        status: 'DISPONIVEL',
        assignedBrokerName: '',
        nextRevisionKm: 20000,
        lastCleanedAt: 'Hoje'
      });
    }
    setIsVehicleModalOpen(true);
  };

  // Save vehicle
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.model || !vehicleForm.plate) {
      showToast('Preencha o modelo e a placa do veículo.');
      return;
    }

    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? {
        ...v,
        ...vehicleForm
      } : v));
      showToast(`Veículo ${vehicleForm.model} (${vehicleForm.plate}) atualizado com sucesso!`);
    } else {
      const newVeh: FleetVehicle = {
        id: `veh_${Date.now()}`,
        ...vehicleForm
      };
      setVehicles(prev => [newVeh, ...prev]);
      showToast(`Novo veículo ${vehicleForm.model} lançado com sucesso!`);
    }

    setIsVehicleModalOpen(false);
  };

  // Delete vehicle
  const handleDeleteVehicle = (id: string, name: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    showToast(`Veículo ${name} removido com sucesso.`);
  };

  // Open asset modal
  const handleOpenAssetModal = (ast?: CompanyAsset) => {
    if (ast) {
      setEditingAsset(ast);
      setAssetForm({
        assetCode: ast.assetCode,
        title: ast.title,
        category: ast.category,
        assignedUser: ast.assignedUser,
        branch: ast.branch || 'Matriz - Jardins',
        purchaseDate: ast.purchaseDate || new Date().toISOString().split('T')[0],
        estimatedValue: ast.estimatedValue,
        condition: ast.condition
      });
    } else {
      setEditingAsset(null);
      setAssetForm({
        assetCode: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        title: '',
        category: 'NOTEBOOK',
        assignedUser: '',
        branch: 'Matriz - Jardins',
        purchaseDate: new Date().toISOString().split('T')[0],
        estimatedValue: 2500,
        condition: 'EXCELENTE'
      });
    }
    setIsAssetModalOpen(true);
  };

  // Save asset
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetForm.title || !assetForm.assetCode) {
      showToast('Preencha a descrição e o código do patrimônio.');
      return;
    }

    if (editingAsset) {
      setAssets(prev => prev.map(a => a.id === editingAsset.id ? {
        ...a,
        ...assetForm
      } : a));
      showToast(`Patrimônio "${assetForm.title}" atualizado com sucesso!`);
    } else {
      const newAst: CompanyAsset = {
        id: `ast_${Date.now()}`,
        ...assetForm
      };
      setAssets(prev => [newAst, ...prev]);
      showToast(`Novo patrimônio "${assetForm.title}" cadastrado com sucesso!`);
    }

    setIsAssetModalOpen(false);
  };

  // Delete asset
  const handleDeleteAsset = (id: string, title: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    showToast(`Patrimônio "${title}" excluído do inventário.`);
  };

  const filteredVehicles = vehicles.filter(v => 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.assignedBrokerName && v.assignedBrokerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAssets = assets.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.assignedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Gestão Patrimonial & Frota de Veículos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controle de veículos para visitas de clientes, quilometragem, combustível e inventário de equipamentos
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'frota' ? (
            <button
              onClick={() => handleOpenVehicleModal()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Veículo Comercial</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenAssetModal()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Bem / Patrimônio</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('frota')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'frota'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Frota de Veículos ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('patrimonio')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'patrimonio'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Inventário de Bens ({assets.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'frota' ? 'Buscar veículo por placa, modelo...' : 'Buscar bem por código, título...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* VEHICLES TAB */}
      {activeTab === 'frota' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Car className="w-5 h-5 text-blue-600 shrink-0" />
                    <h3 className="text-sm font-bold text-slate-900 truncate">{v.model}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        v.status === 'DISPONIVEL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'EM_USO'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {v.status === 'DISPONIVEL' ? 'Disponível na Garagem' : v.status === 'EM_USO' ? 'Em Uso (Visita Externa)' : 'Em Manutenção'}
                    </span>

                    <button
                      onClick={() => handleOpenVehicleModal(v)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Editar Veículo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteVehicle(v.id, v.model)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Excluir Veículo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Placa Mercosul</span>
                    <span className="font-bold text-slate-800 font-mono">{v.plate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Odômetro Atual</span>
                    <span className="font-bold text-slate-800 tabular-nums">{v.currentKm.toLocaleString('pt-BR')} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Combustível</span>
                    <span className="font-bold text-blue-600 tabular-nums">{v.fuelLevelPercent}%</span>
                  </div>
                </div>

                {v.assignedBrokerName && (
                  <div className="text-[11px] text-slate-600">
                    Condutor atual: <strong className="text-slate-900">{v.assignedBrokerName}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
              Nenhum veículo encontrado com os filtros atuais.
            </div>
          )}
        </div>
      )}

      {/* ASSETS TAB */}
      {activeTab === 'patrimonio' && (
        <TableScrollContainer hintText="Arraste lateralmente ou use os botões para navegar pelas colunas de patrimônio">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs min-w-[750px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-3.5 pl-5">Código Patrimônio</th>
                  <th className="p-3.5">Descrição do Bem</th>
                  <th className="p-3.5">Categoria</th>
                  <th className="p-3.5">Responsável / Alocado</th>
                  <th className="p-3.5">Valor Estimado</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 pr-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-5 font-mono font-bold text-blue-700">{ast.assetCode}</td>
                    <td className="p-3.5 font-bold text-slate-900">{ast.title}</td>
                    <td className="p-3.5 text-slate-600">{ast.category}</td>
                    <td className="p-3.5 text-slate-800 font-medium">{ast.assignedUser || '—'}</td>
                    <td className="p-3.5 font-bold text-slate-900 tabular-nums">
                      R$ {ast.estimatedValue.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ast.condition === 'EXCELENTE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ast.condition === 'BOM'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ast.condition}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenAssetModal(ast)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        title="Editar Patrimônio"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(ast.id, ast.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        title="Excluir Patrimônio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableScrollContainer>
      )}

      {/* MODAL 1: CADASTRAR OU EDITAR VEÍCULO */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">
                {editingVehicle ? 'Editar Veículo Comercial' : 'Cadastrar Novo Veículo da Frota'}
              </span>
              <button 
                onClick={() => setIsVehicleModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Modelo do Veículo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jeep Compass Longitude 1.3 Turbo"
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Placa Mercosul *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BRA2E19"
                    value={vehicleForm.plate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, plate: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Odômetro Atual (KM)</label>
                  <input
                    type="number"
                    value={vehicleForm.currentKm}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, currentKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nível Tanque (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={vehicleForm.fuelLevelPercent}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuelLevelPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Operacional</label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DISPONIVEL">Disponível na Garagem</option>
                    <option value="EM_USO">Em Uso (Visita Externa)</option>
                    <option value="MANUTENCAO">Em Manutenção Mecânica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Condutor / Corretor Responsável</label>
                <input
                  type="text"
                  placeholder="Nome do corretor (ou deixar vazio se na garagem)"
                  value={vehicleForm.assignedBrokerName}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, assignedBrokerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingVehicle ? 'Atualizar Veículo' : 'Lançar Veículo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CADASTRAR OU EDITAR PATRIMÔNIO */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">
                {editingAsset ? 'Editar Patrimônio' : 'Cadastrar Novo Bem / Equipamento'}
              </span>
              <button 
                onClick={() => setIsAssetModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Código Patrimônio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: PAT-1049"
                    value={assetForm.assetCode}
                    onChange={(e) => setAssetForm({ ...assetForm, assetCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoria</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NOTEBOOK">Notebooks & Computadores</option>
                    <option value="MONITOR">Monitores & Telas</option>
                    <option value="MOBILIARIO">Mobiliário & Mesas</option>
                    <option value="SMARTPHONE">Smartphones & Celulares</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descrição do Bem *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: MacBook Air M2 16GB Cinza Espacial"
                  value={assetForm.title}
                  onChange={(e) => setAssetForm({ ...assetForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Responsável Alocado</label>
                  <input
                    type="text"
                    placeholder="Ex: Lucas Sampaio"
                    value={assetForm.assignedUser}
                    onChange={(e) => setAssetForm({ ...assetForm, assignedUser: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={assetForm.estimatedValue}
                    onChange={(e) => setAssetForm({ ...assetForm, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estado de Conservação</label>
                <select
                  value={assetForm.condition}
                  onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EXCELENTE">Excelente (Perfeito estado)</option>
                  <option value="BOM">Bom (Marcas normais de uso)</option>
                  <option value="DESGASTADO">Desgastado (Necessita reparo/troca)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingAsset ? 'Salvar Alterações' : 'Lançar Patrimônio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Plus, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  Search, 
  Filter, 
  Building, 
  Home, 
  Phone, 
  QrCode, 
  Camera, 
  Download, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Check,
  Truck,
  Layers,
  FileText
} from 'lucide-react';
import { RealEstateProperty, PropertySignRecord } from '../../types/crm';
import { INITIAL_PROPERTY_SIGNS } from '../../data/mockSigns';
import { PropertyQrPlacaModal } from '../properties/PropertyQrPlacaModal';

interface PropertySignsControlTabProps {
  properties: RealEstateProperty[];
  signs?: PropertySignRecord[];
  onUpdateProperty?: (propertyId: string, updates: Partial<RealEstateProperty>) => void;
  onOpenPropertyDetails?: (property: RealEstateProperty) => void;
}

export const PropertySignsControlTab: React.FC<PropertySignsControlTabProps> = ({
  properties = [],
  signs: initialSigns = INITIAL_PROPERTY_SIGNS,
  onUpdateProperty,
  onOpenPropertyDetails
}) => {
  // Signs State
  const [signsList, setSignsList] = useState<PropertySignRecord[]>(initialSigns);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'INSTALADA' | 'SOLICITADA' | 'EM_ROTA_INSTALACAO' | 'RECOLHIDA'>('ALL');
  const [acceptsSignFilter, setAcceptsSignFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewSignModalOpen, setIsNewSignModalOpen] = useState(false);
  const [isOsPrintModalOpen, setIsOsPrintModalOpen] = useState(false);
  const [propertyForQrPlaca, setPropertyForQrPlaca] = useState<RealEstateProperty | null>(null);

  // New Request Form State
  const [newSignPropertyId, setNewSignPropertyId] = useState('');
  const [newSignType, setNewSignType] = useState<'PLACA_FACHADA' | 'FAIXA_VARANDA' | 'CAVALETE' | 'PORTAO'>('PLACA_FACHADA');
  const [newSignSize, setNewSignSize] = useState<'PEQUENA_50x40' | 'MEDIA_70x50' | 'GRANDE_100x70' | 'FAIXA_200x50'>('MEDIA_70x50');
  const [newSignInstaller, setNewSignInstaller] = useState('Marcos Instalador (Equipe Visual)');
  const [newSignNotes, setNewSignNotes] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Merge Properties with Sign Information
  const enrichedPropertyList = useMemo(() => {
    return properties.map(p => {
      const existingSign = signsList.find(s => s.propertyId === p.id || s.propertyCode === p.code);
      const accepts = p.acceptsSign !== undefined ? p.acceptsSign : true;
      return {
        ...p,
        acceptsSignComputed: accepts,
        signRecord: existingSign,
        signStatusComputed: existingSign?.status || (accepts ? 'SEM_PLACA' : 'NAO_AUTORIZADO')
      };
    });
  }, [properties, signsList]);

  // Statistics
  const totalProperties = enrichedPropertyList.length || 18;
  const propertiesAcceptSign = enrichedPropertyList.filter(p => p.acceptsSignComputed).length || 15;
  const propertiesRefuseSign = totalProperties - propertiesAcceptSign;
  const installedSignsCount = signsList.filter(s => s.status === 'INSTALADA').length;
  const pendingRequestsCount = signsList.filter(s => s.status === 'SOLICITADA' || s.status === 'EM_ROTA_INSTALACAO').length;
  const stockInventoryCount = 38; // 38 placas físicas em estoque

  // Filtered List
  const filteredPropertiesWithSigns = useMemo(() => {
    return enrichedPropertyList.filter(item => {
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.address?.neighborhood && item.address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchAccepts = 
        acceptsSignFilter === 'ALL' || 
        (acceptsSignFilter === 'YES' && item.acceptsSignComputed) || 
        (acceptsSignFilter === 'NO' && !item.acceptsSignComputed);

      const matchStatus = 
        statusFilter === 'ALL' || 
        (item.signRecord && item.signRecord.status === statusFilter);

      return matchSearch && matchAccepts && matchStatus;
    });
  }, [enrichedPropertyList, searchQuery, acceptsSignFilter, statusFilter]);

  // Toggle Property Accepts Sign Status
  const handleToggleAcceptsSign = (propertyId: string, currentVal: boolean) => {
    const newVal = !currentVal;
    if (onUpdateProperty) {
      onUpdateProperty(propertyId, { 
        acceptsSign: newVal,
        signRefusalReason: newVal ? undefined : 'RECUSA_PROPRIETARIO',
        signStatus: newVal ? 'SEM_PLACA' : 'NAO_AUTORIZADO'
      });
    }
    setActionSuccessToast(`Status de aceite de placa atualizado para ${newVal ? 'SIM (Autorizado)' : 'NÃO (Recusado)'}!`);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  // Submit New Sign Request
  const handleCreateSignRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === newSignPropertyId);
    if (!prop) return;

    const newSign: PropertySignRecord = {
      id: `sgn_${Date.now()}`,
      propertyId: prop.id,
      propertyCode: prop.code,
      propertyTitle: prop.title,
      propertyAddress: `${prop.address.street}, ${prop.address.number} - ${prop.address.neighborhood}`,
      propertyNeighborhood: prop.address.neighborhood,
      ownerName: prop.ownerName,
      ownerPhone: prop.ownerPhone,
      acceptsSign: true,
      signType: newSignType,
      signCode: `PLC-${Math.floor(100 + Math.random() * 900)}`,
      status: 'SOLICITADA',
      installerName: newSignInstaller,
      observations: newSignNotes,
      size: newSignSize
    };

    setSignsList(prev => [newSign, ...prev]);
    setIsNewSignModalOpen(false);
    setNewSignPropertyId('');
    setNewSignNotes('');
    setActionSuccessToast(`Solicitação de instalação de placa registrada com código ${newSign.signCode}!`);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Quick Action: Confirm Installation
  const handleConfirmInstallation = (signId: string) => {
    setSignsList(prev => prev.map(s => {
      if (s.id === signId) {
        return {
          ...s,
          status: 'INSTALADA',
          installedAt: new Date().toLocaleDateString('pt-BR'),
          photoProofUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80'
        };
      }
      return s;
    }));
    setActionSuccessToast('Instalação confirmada com sucesso! Placa marcada como ATIVA em campo.');
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  // Quick Action: Request Removal
  const handleRequestRemoval = (signId: string) => {
    setSignsList(prev => prev.map(s => {
      if (s.id === signId) {
        return {
          ...s,
          status: 'RECOLHIDA',
          removalDate: new Date().toLocaleDateString('pt-BR')
        };
      }
      return s;
    }));
    setActionSuccessToast('Solicitação de retirada de placa registrada. Imóvel desvinculado.');
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {actionSuccessToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase text-[10px] tracking-wider">Placas em Campo</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{installedSignsCount}</div>
          <span className="text-[10px] text-emerald-600 font-bold block">Placas ativas instaladas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase text-[10px] tracking-wider">Aceitam Placa</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{propertiesAcceptSign}</div>
          <span className="text-[10px] text-blue-600 font-bold block">
            {Math.round((propertiesAcceptSign / Math.max(1, totalProperties)) * 100)}% da carteira autorizou
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase text-[10px] tracking-wider">Não Aceitam Placa</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{propertiesRefuseSign}</div>
          <span className="text-[10px] text-rose-600 font-bold block">Condomínio proíbe / Recusado</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase text-[10px] tracking-wider">Em Rota / Pendentes</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingRequestsCount}</div>
          <span className="text-[10px] text-amber-600 font-bold block">Aguardando instalação</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase text-[10px] tracking-wider">Estoque Almoxarifado</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stockInventoryCount}</div>
          <span className="text-[10px] text-purple-600 font-bold block">Placas e faixas prontas</span>
        </div>
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Logística & Sinalização
              </span>
              <span className="text-xs text-slate-500">Módulo de Gestão de Placas Imobiliárias</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              Controle de Placas & Sinalização de Imóveis
            </h2>
            <p className="text-xs text-slate-500">
              Controle se o imóvel aceita placa ou faixa, acompanhe ordens de serviço de instalação e gere artes com QR Code.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOsPrintModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Imprimir Ordem de Serviço da equipe de instalação em campo"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Imprimir O.S. Instalador</span>
            </button>

            <button
              onClick={() => setIsNewSignModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Solicitar Instalação</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filtros:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Aceita Placa?</span>
            <select
              value={acceptsSignFilter}
              onChange={(e) => setAcceptsSignFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="ALL">Todos os Imóveis</option>
              <option value="YES">Apenas que Aceitam (Sim)</option>
              <option value="NO">Apenas que Não Aceitam (Não)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Status da Placa:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="ALL">Todos os Status</option>
              <option value="INSTALADA">Instaladas em Campo</option>
              <option value="SOLICITADA">Solicitadas</option>
              <option value="EM_ROTA_INSTALACAO">Em Rota de Instalação</option>
              <option value="RECOLHIDA">Recolhidas</option>
            </select>
          </div>

          <div className="relative ml-auto">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar imóvel ou placa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Properties & Signs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Carteira de Imóveis & Sinalização ({filteredPropertiesWithSigns.length} imóveis)
          </span>
          <span className="text-slate-500">
            Dica: Clique no interruptor para alterar o aceite de placa pelo proprietário
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Cód. Imóvel</th>
                <th className="py-3 px-4">Imóvel & Bairro</th>
                <th className="py-3 px-4">Proprietário</th>
                <th className="py-3 px-4 text-center">Aceita Placa?</th>
                <th className="py-3 px-4 text-center">Status Sinalização</th>
                <th className="py-3 px-4 text-center">Cód. Placa</th>
                <th className="py-3 px-4 text-center">Instalador Resp.</th>
                <th className="py-3 px-4 text-right">Ações de Placa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPropertiesWithSigns.length > 0 ? (
                filteredPropertiesWithSigns.map((item, idx) => {
                  const accepts = item.acceptsSignComputed;
                  const signRec = item.signRecord;
                  const isInstalled = signRec?.status === 'INSTALADA';

                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {item.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.address?.neighborhood || 'Bairro Nobre'} - {item.address?.city || 'São Paulo'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-900 font-medium">{item.ownerName || 'Proprietário Cadastrado'}</div>
                        <div className="text-[11px] text-slate-500">{item.ownerPhone || '(11) 98888-0000'}</div>
                      </td>

                      {/* Interactive Aceita Placa Switch */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAcceptsSign(item.id, accepts)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all ${
                            accepts 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                          }`}
                          title="Clique para alternar se o imóvel aceita placa ou não"
                        >
                          <span className={`w-2 h-2 rounded-full ${accepts ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                          <span>{accepts ? 'SIM, ACEITA' : 'NÃO ACEITA'}</span>
                        </button>
                      </td>

                      {/* Sign Status */}
                      <td className="py-3 px-4 text-center">
                        {signRec ? (
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block ${
                            signRec.status === 'INSTALADA' 
                              ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30' 
                              : signRec.status === 'EM_ROTA_INSTALACAO'
                              ? 'bg-blue-500/15 text-blue-800 border border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                          }`}>
                            {signRec.status}
                          </span>
                        ) : accepts ? (
                          <span className="text-[11px] text-slate-400 italic">Sem Placa Solicitada</span>
                        ) : (
                          <span className="text-[11px] text-rose-600 font-semibold">Proibido Condomínio</span>
                        )}
                      </td>

                      {/* Sign Code */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {signRec?.signCode || '-'}
                      </td>

                      {/* Installer */}
                      <td className="py-3 px-4 text-center text-slate-600 text-[11px]">
                        {signRec?.installerName || '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Sign / QR Code modal button */}
                          <button
                            onClick={() => setPropertyForQrPlaca(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-colors"
                            title="Visualizar arte da placa com QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick sign status trigger */}
                          {accepts && !signRec && (
                            <button
                              onClick={() => {
                                setNewSignPropertyId(item.id);
                                setIsNewSignModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-all"
                            >
                              Pedir Placa
                            </button>
                          )}

                          {signRec && signRec.status !== 'INSTALADA' && (
                            <button
                              onClick={() => handleConfirmInstallation(signRec.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all"
                              title="Marcar como instalada no local"
                            >
                              Confirmar Inst.
                            </button>
                          )}

                          {signRec && signRec.status === 'INSTALADA' && (
                            <button
                              onClick={() => handleRequestRemoval(signRec.id)}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-all border border-slate-300"
                              title="Solicitar retirada de placa"
                            >
                              Retirar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 italic">
                    Nenhum imóvel encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nova Solicitação de Placa */}
      {isNewSignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Solicitar Instalação de Placa</h3>
                  <p className="text-[11px] text-slate-500">Envio para rota de sinalização em campo</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewSignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSignRequest} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Imóvel Destino *</label>
                <select
                  required
                  value={newSignPropertyId}
                  onChange={(e) => setNewSignPropertyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="">Selecione um imóvel...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title} ({p.address?.neighborhood}) {p.acceptsSign === false ? '⚠️ (Marcado como Não Aceita)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tipo de Placa</label>
                  <select
                    value={newSignType}
                    onChange={(e) => setNewSignType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="PLACA_FACHADA">Placa de Fachada</option>
                    <option value="FAIXA_VARANDA">Faixa de Sacada</option>
                    <option value="CAVALETE">Cavalete Metálico</option>
                    <option value="PORTAO">Placa de Portão / Grade</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Dimensões / Tamanho</label>
                  <select
                    value={newSignSize}
                    onChange={(e) => setNewSignSize(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="MEDIA_70x50">Média (70x50 cm)</option>
                    <option value="GRANDE_100x70">Grande (100x70 cm)</option>
                    <option value="FAIXA_200x50">Faixa (200x50 cm)</option>
                    <option value="PEQUENA_50x40">Pequena (50x40 cm)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Instalador Responsável</label>
                <select
                  value={newSignInstaller}
                  onChange={(e) => setNewSignInstaller(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="Marcos Instalador (Equipe Visual)">Marcos Instalador (Equipe Visual)</option>
                  <option value="Carlos Obras (Manutenção Interna)">Carlos Obras (Manutenção Interna)</option>
                  <option value="Fornecedor Terceirizado Alpha Placas">Fornecedor Terceirizado Alpha Placas</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Instruções de Fixação / Local</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Fixar na lateral esquerda do portão principal com presilhas metálicas."
                  value={newSignNotes}
                  onChange={(e) => setNewSignNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>A solicitação será adicionada à Ordem de Serviço da semana com prioridade normal.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSignModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/30 active:scale-95"
                >
                  Confirmar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ordem de Serviço (O.S.) de Instalação para Impressão */}
      {isOsPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                  ORDEM DE SERVIÇO DE CAMPO
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Rota de Instalação e Manutenção de Placas
                </h3>
                <p className="text-xs text-slate-500">
                  Emissão: {new Date().toLocaleDateString('pt-BR')} • Equipe Operacional
                </p>
              </div>
              <button
                onClick={() => setIsOsPrintModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border text-xs text-slate-700">
                <strong>Instalador:</strong> Marcos Instalador (Equipe Visual) • <strong>Veículo:</strong> Fiorino Logística #02
              </div>

              <div className="border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Cód.</th>
                      <th className="p-2.5">Endereço do Imóvel</th>
                      <th className="p-2.5">Tipo Placa</th>
                      <th className="p-2.5">Proprietário / Fone</th>
                      <th className="p-2.5 text-center">Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {signsList.filter(s => s.status !== 'RECOLHIDA').map((s, idx) => (
                      <tr key={s.id}>
                        <td className="p-2.5 font-bold font-mono">{s.signCode}</td>
                        <td className="p-2.5">
                          <div className="font-bold">{s.propertyAddress}</div>
                          <div className="text-[10px] text-slate-500">{s.observations}</div>
                        </td>
                        <td className="p-2.5 font-semibold text-slate-700">{s.signType}</td>
                        <td className="p-2.5">
                          <div>{s.ownerName}</div>
                          <div className="text-[10px] text-slate-500">{s.ownerPhone}</div>
                        </td>
                        <td className="p-2.5 text-center">
                          <div className="w-4 h-4 rounded-sm border-2 border-slate-400 mx-auto"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs text-slate-500">
                Assinatura do Instalador: _____________________________________
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir O.S. Agora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property QR Placa Modal preview */}
      <PropertyQrPlacaModal
        property={propertyForQrPlaca}
        isOpen={!!propertyForQrPlaca}
        onClose={() => setPropertyForQrPlaca(null)}
      />

    </div>
  );
};

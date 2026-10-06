import React, { useState } from 'react';
import { 
  X, 
  ClipboardCheck, 
  Building, 
  User, 
  Calendar, 
  Clock, 
  Plus, 
  Check, 
  Gauge, 
  KeyRound, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PropertyInspection, RealEstateProperty, InspectionRoom } from '../../types/crm';

interface NewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties?: RealEstateProperty[];
  onSaveInspection: (inspection: PropertyInspection) => void;
}

const DEFAULT_ROOM_OPTIONS = [
  'Sala de Estar / Jantar',
  'Cozinha & Área de Serviço',
  'Dormitório 1',
  'Dormitório 2 (Suíte)',
  'Banheiro Social',
  'Banheiro da Suíte',
  'Varanda Gourmet / Sacada',
  'Lavabo',
  'Garagem / Vaga de Garagem'
];

export const NewInspectionModal: React.FC<NewInspectionModalProps> = ({
  isOpen,
  onClose,
  properties = [],
  onSaveInspection,
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>(properties[0]?.id || '');
  const [isCustomProperty, setIsCustomProperty] = useState(!properties.length);
  const [propertyCode, setPropertyCode] = useState(properties[0]?.code || 'AP-JARDINS-102');
  const [propertyAddress, setPropertyAddress] = useState(
    properties[0] ? `${properties[0].address.street}, ${properties[0].address.number} - ${properties[0].address.neighborhood}` : 'Alameda Lorena, 1420 - Ap 82, Jardins, SP'
  );
  const [inspectionType, setInspectionType] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [inspectorName, setInspectorName] = useState('Carlos Eduardo');
  const [inspectorCpfCreci, setInspectorCpfCreci] = useState('CRECI 142.901-F / Vistoriador Credenciado');
  const [clientName, setClientName] = useState('Lucas Ferraz Medeiros');
  const [clientDocument, setClientDocument] = useState('349.812.908-11');
  const [ownerName, setOwnerName] = useState('Construções & Participações Silva Ltda');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspectionTime, setInspectionTime] = useState('14:30');

  // Meter readings
  const [waterMeter, setWaterMeter] = useState('0412.8 m³');
  const [electricMeter, setElectricMeter] = useState('18492.0 kWh');
  const [gasMeter, setGasMeter] = useState('0198.4 m³');

  // Keys
  const [keysDeliveredCount, setKeysDeliveredCount] = useState(3);
  const [keysDescription, setKeysDescription] = useState('2 chaves tetra porta principal + 1 chave de acesso portaria/social');

  // Selected rooms
  const [selectedRooms, setSelectedRooms] = useState<string[]>([
    'Sala de Estar / Jantar',
    'Cozinha & Área de Serviço',
    'Dormitório 1',
    'Dormitório 2 (Suíte)',
    'Banheiro Social',
    'Varanda Gourmet / Sacada'
  ]);
  const [customRoomInput, setCustomRoomInput] = useState('');

  const handlePropertyChange = (propId: string) => {
    setSelectedPropId(propId);
    const prop = properties.find(p => p.id === propId);
    if (prop) {
      setPropertyCode(prop.code);
      setPropertyAddress(`${prop.address.street}, ${prop.address.number} - ${prop.address.neighborhood}, ${prop.address.city}`);
      if (prop.ownerName) setOwnerName(prop.ownerName);
    }
  };

  const toggleRoom = (roomName: string) => {
    if (selectedRooms.includes(roomName)) {
      if (selectedRooms.length > 1) {
        setSelectedRooms(selectedRooms.filter(r => r !== roomName));
      }
    } else {
      setSelectedRooms([...selectedRooms, roomName]);
    }
  };

  const handleAddCustomRoom = () => {
    if (!customRoomInput.trim()) return;
    if (!selectedRooms.includes(customRoomInput.trim())) {
      setSelectedRooms([...selectedRooms, customRoomInput.trim()]);
    }
    setCustomRoomInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const createdRooms: InspectionRoom[] = selectedRooms.map((roomName, idx) => ({
      id: `room_${Date.now()}_${idx}`,
      roomName,
      overallState: 'BOM',
      paintState: 'BOA',
      observations: '',
      items: [
        {
          id: `item_${Date.now()}_${idx}_1`,
          name: 'Pintura das Paredes e Teto',
          condition: 'BOM',
          state: 'BOM',
          paintState: 'BOA',
          observations: 'Pintura uniforme em látex acrílico fosco, sem marcas ou sujidades.',
          hasPhoto: false,
          photos: []
        },
        {
          id: `item_${Date.now()}_${idx}_2`,
          name: 'Piso e Rodapés',
          condition: 'BOM',
          state: 'BOM',
          observations: 'Revestimento íntegro e rejuntes limpos, sem trincas.',
          hasPhoto: false,
          photos: []
        },
        {
          id: `item_${Date.now()}_${idx}_3`,
          name: 'Portas, Fechaduras e Esquadrias',
          condition: 'BOM',
          state: 'BOM',
          observations: 'Mecanismo de trinco e chaves funcionando com alinhamento adequado.',
          hasPhoto: false,
          photos: []
        },
        {
          id: `item_${Date.now()}_${idx}_4`,
          name: 'Instalações Elétricas (Tomadas e Interruptores)',
          condition: 'BOM',
          state: 'OTIMO',
          observations: 'Espelhos fixados firmemente e testados com corrente ativa.',
          hasPhoto: false,
          photos: []
        }
      ],
      photos: []
    }));

    const newInspection: PropertyInspection = {
      id: `insp_${Date.now()}`,
      code: `LAU-2026-${Math.floor(100 + Math.random() * 900)}`,
      propertyCode,
      propertyAddress,
      type: inspectionType,
      inspectorName,
      inspectorCpfCreci,
      clientName,
      clientDocument,
      ownerName,
      date: inspectionDate,
      time: inspectionTime,
      status: 'EM_ANDAMENTO',
      offlineCached: true,
      generalObservations: 'Vistoria presencial inicial realizada com acompanhamento das partes. Todas as chaves e relógios foram conferidos.',
      meterReadings: {
        water: waterMeter,
        electricity: electricMeter,
        gas: gasMeter,
      },
      keysDelivered: [
        {
          description: keysDescription,
          quantity: keysDeliveredCount,
        }
      ],
      rooms: createdRooms,
    };

    onSaveInspection(newInspection);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Iniciar Nova Vistoria Imobiliária
              </h2>
              <p className="text-xs text-slate-400">
                Padrão Rede Vistorias / Vistoriador Digital com laudo pericial oficial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-slate-800 text-xs">
          
          {/* Tipo de Vistoria Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Tipo de Vistoria <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInspectionType('ENTRADA')}
                className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                  inspectionType === 'ENTRADA'
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <strong className="text-xs font-bold text-blue-900 block">Vistoria de Entrada</strong>
                  <span className="text-[11px] text-slate-500">Início de locação / entrega das chaves</span>
                </div>
                {inspectionType === 'ENTRADA' && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setInspectionType('SAIDA')}
                className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                  inspectionType === 'SAIDA'
                    ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <strong className="text-xs font-bold text-amber-900 block">Vistoria de Saída</strong>
                  <span className="text-[11px] text-slate-500">Rescisão contratual / desocupação</span>
                </div>
                {inspectionType === 'SAIDA' && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Dados do Imóvel */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Imóvel Objeto da Vistoria</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomProperty(!isCustomProperty)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                {isCustomProperty ? '← Selecionar do Estoque' : '+ Digitar Endereço Manualmente'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {!isCustomProperty && properties.length > 0 ? (
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Selecione o Imóvel Cadastrado
                  </label>
                  <select
                    value={selectedPropId}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.title} ({p.address.neighborhood})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Endereço Completo do Imóvel
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="Ex: Rua Oscar Freire, 900 - Ap 41, Cerqueira César, SP"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Código do Imóvel
                </label>
                <input
                  type="text"
                  required
                  value={propertyCode}
                  onChange={(e) => setPropertyCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden uppercase"
                />
              </div>
            </div>
          </div>

          {/* Dados das Partes (Vistoriador, Locatário, Locador) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                Perito Vistoriador Responsável
              </span>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nome do Vistoriador</label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">CRECI / Registro Pericial</label>
                <input
                  type="text"
                  value={inspectorCpfCreci}
                  onChange={(e) => setInspectorCpfCreci(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                Locatário & Proprietário
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Locatário</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">CPF Locatário</label>
                  <input
                    type="text"
                    value={clientDocument}
                    onChange={(e) => setClientDocument(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Proprietário / Locador</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Leituras de Relógio & Chaves */}
          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Leitura de Medidores & Entrega de Chaves</span>
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">💧 Hidrômetro (Água)</label>
                <input
                  type="text"
                  value={waterMeter}
                  onChange={(e) => setWaterMeter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">⚡ Luz / Energia</label>
                <input
                  type="text"
                  value={electricMeter}
                  onChange={(e) => setElectricMeter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Gás Encanado</label>
                <input
                  type="text"
                  value={gasMeter}
                  onChange={(e) => setGasMeter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <div className="w-24 shrink-0">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">🔑 Qtd. Chaves</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={keysDeliveredCount}
                  onChange={(e) => setKeysDeliveredCount(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold text-center"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Descrição das Chaves e Controles</label>
                <input
                  type="text"
                  value={keysDescription}
                  onChange={(e) => setKeysDescription(e.target.value)}
                  placeholder="Ex: 2 chaves tetra, 1 chave porta serviço, 1 controle portão"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Ambientes da Vistoria */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Selecione os Ambientes para Vistoriar ({selectedRooms.length} selecionados)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_ROOM_OPTIONS.map((room) => {
                const isSelected = selectedRooms.includes(room);
                return (
                  <button
                    key={room}
                    type="button"
                    onClick={() => toggleRoom(room)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{room}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom room input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customRoomInput}
                onChange={(e) => setCustomRoomInput(e.target.value)}
                placeholder="Adicionar outro ambiente (Ex: Dependência de Empregada, Adega, Depósito)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomRoom}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0"
              >
                + Adicionar
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Criar Vistoria & Iniciar Checklist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

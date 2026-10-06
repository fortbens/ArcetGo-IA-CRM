import React, { useState } from 'react';
import { 
  KeyRound, 
  ClipboardCheck, 
  WifiOff, 
  Wifi, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  FileSignature, 
  Check, 
  UserCheck,
  FileText,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  Edit2,
  Eye,
  Building,
  Calendar,
  Layers,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
  Gauge,
  X
} from 'lucide-react';
import { 
  PropertyInspection, 
  PropertyKeyRecord, 
  InspectionGeneralState, 
  InspectionPaintState,
  InspectionRoom,
  InspectionRoomItem,
  InspectionPhoto,
  RealEstateProperty
} from '../../types/crm';
import { INITIAL_INSPECTIONS, INITIAL_KEYS } from '../../data/mockData';
import { NewInspectionModal } from './NewInspectionModal';
import { InspectionDossierModal, getGeneralStateBadge, getPaintStateBadge } from './InspectionDossierModal';
import { correctAndPolishInspectionObservations } from '../../services/aiService';

interface InspectionsKeysViewProps {
  properties?: RealEstateProperty[];
}

export const InspectionsKeysView: React.FC<InspectionsKeysViewProps> = ({
  properties = []
}) => {
  const [activeTab, setActiveTab] = useState<'vistorias' | 'chaves'>('vistorias');
  const [inspections, setInspections] = useState<PropertyInspection[]>(() => {
    // Enrich mock inspections with room state structure if needed
    return INITIAL_INSPECTIONS.map(insp => ({
      ...insp,
      code: insp.code || `LAU-2026-0891`,
      rooms: insp.rooms.map((r, idx) => ({
        ...r,
        id: r.id || `r_${idx}`,
        overallState: r.overallState || 'BOM',
        paintState: r.paintState || 'BOA',
        items: r.items.map(item => ({
          ...item,
          state: item.state || (item.condition === 'NOVO' ? 'OTIMO' : item.condition === 'DANIFICADO' ? 'PESSIMO' : 'BOM'),
          paintState: item.paintState || 'BOA',
          photos: item.photos || (item.hasPhoto ? [
            {
              id: `ph_${Math.random()}`,
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
              caption: 'Foto do item anexada',
              timestamp: 'Hoje 14:35'
            }
          ] : [])
        }))
      }))
    }));
  });

  const [keys, setKeys] = useState<PropertyKeyRecord[]>(INITIAL_KEYS);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(inspections[0]?.id || '');
  const selectedInspection = inspections.find(i => i.id === selectedInspectionId) || inspections[0];

  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Modals
  const [isNewInspectionModalOpen, setIsNewInspectionModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  // Key registration and editing
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<PropertyKeyRecord | null>(null);
  const [keyForm, setKeyForm] = useState({
    keyNumber: '',
    propertyAddress: '',
    propertyCode: '',
    status: 'NO_CLAVICULARIO' as 'NO_CLAVICULARIO' | 'EM_VISITA' | 'MANUTENCAO',
    checkedOutToBrokerName: '',
    expectedReturnAt: ''
  });

  const handleOpenKeyModal = (keyToEdit?: PropertyKeyRecord) => {
    if (keyToEdit) {
      setEditingKey(keyToEdit);
      setKeyForm({
        keyNumber: keyToEdit.keyNumber,
        propertyAddress: keyToEdit.propertyAddress,
        propertyCode: keyToEdit.propertyCode,
        status: keyToEdit.status,
        checkedOutToBrokerName: keyToEdit.checkedOutToBrokerName || '',
        expectedReturnAt: keyToEdit.expectedReturnAt || ''
      });
    } else {
      setEditingKey(null);
      setKeyForm({
        keyNumber: `CH-${Math.floor(100 + Math.random() * 900)}`,
        propertyAddress: '',
        propertyCode: `IMO-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'NO_CLAVICULARIO',
        checkedOutToBrokerName: '',
        expectedReturnAt: ''
      });
    }
    setIsKeyModalOpen(true);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyForm.keyNumber || !keyForm.propertyAddress) return;

    if (editingKey) {
      setKeys(prev => prev.map(k => k.id === editingKey.id ? {
        ...k,
        ...keyForm,
        checkedOutAt: keyForm.status === 'EM_VISITA' ? (k.checkedOutAt || 'Hoje às 14:00') : undefined,
        checkedOutToBrokerName: keyForm.status === 'EM_VISITA' ? keyForm.checkedOutToBrokerName : undefined,
        expectedReturnAt: keyForm.status === 'EM_VISITA' ? keyForm.expectedReturnAt : undefined
      } : k));
    } else {
      const newKey: PropertyKeyRecord = {
        id: `key_${Date.now()}`,
        keyNumber: keyForm.keyNumber,
        propertyAddress: keyForm.propertyAddress,
        propertyCode: keyForm.propertyCode,
        status: keyForm.status,
        checkedOutToBrokerName: keyForm.status === 'EM_VISITA' ? keyForm.checkedOutToBrokerName : undefined,
        checkedOutAt: keyForm.status === 'EM_VISITA' ? 'Hoje às 14:00' : undefined,
        expectedReturnAt: keyForm.status === 'EM_VISITA' ? keyForm.expectedReturnAt : undefined
      };
      setKeys(prev => [newKey, ...prev]);
    }
    setIsKeyModalOpen(false);
  };

  const handleDeleteKey = (keyId: string) => {
    setKeys(prev => prev.filter(k => k.id !== keyId));
  };

  // AI polishing state tracking
  const [polishingItemId, setPolishingItemId] = useState<string | null>(null);

  // Add new inspection handler
  const handleSaveNewInspection = (newInsp: PropertyInspection) => {
    setInspections([newInsp, ...inspections]);
    setSelectedInspectionId(newInsp.id);
    setActiveRoomIndex(0);
  };

  // Active room in selected inspection
  const currentRoom = selectedInspection?.rooms[activeRoomIndex] || selectedInspection?.rooms[0];

  // Update room general state
  const handleUpdateRoomState = (newState: InspectionGeneralState) => {
    if (!selectedInspection || !currentRoom) return;

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      updatedRooms[activeRoomIndex] = {
        ...updatedRooms[activeRoomIndex],
        overallState: newState
      };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Update room paint state
  const handleUpdateRoomPaint = (newPaint: InspectionPaintState) => {
    if (!selectedInspection || !currentRoom) return;

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      updatedRooms[activeRoomIndex] = {
        ...updatedRooms[activeRoomIndex],
        paintState: newPaint
      };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Update item state
  const handleUpdateItemState = (itemId: string, newState: InspectionGeneralState) => {
    if (!selectedInspection || !currentRoom) return;

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      const room = updatedRooms[activeRoomIndex];
      const updatedItems = room.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            state: newState,
            condition: newState === 'OTIMO' || newState === 'BOM' ? 'BOM' : 'DANIFICADO'
          } as InspectionRoomItem;
        }
        return item;
      });
      updatedRooms[activeRoomIndex] = { ...room, items: updatedItems };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Update item paint state
  const handleUpdateItemPaint = (itemId: string, newPaint: InspectionPaintState) => {
    if (!selectedInspection || !currentRoom) return;

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      const room = updatedRooms[activeRoomIndex];
      const updatedItems = room.items.map(item => {
        if (item.id === itemId) {
          return { ...item, paintState: newPaint };
        }
        return item;
      });
      updatedRooms[activeRoomIndex] = { ...room, items: updatedItems };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Update item observation
  const handleUpdateItemObservations = (itemId: string, obs: string) => {
    if (!selectedInspection || !currentRoom) return;

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      const room = updatedRooms[activeRoomIndex];
      const updatedItems = room.items.map(item => {
        if (item.id === itemId) {
          return { ...item, observations: obs };
        }
        return item;
      });
      updatedRooms[activeRoomIndex] = { ...room, items: updatedItems };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Polish observation text using AI
  const handlePolishItemText = async (item: InspectionRoomItem) => {
    if (!item.observations.trim()) return;

    setPolishingItemId(item.id);
    try {
      const polished = await correctAndPolishInspectionObservations(item.observations, {
        roomName: currentRoom?.roomName,
        itemName: item.name,
        generalState: item.state,
        paintState: item.paintState
      });
      handleUpdateItemObservations(item.id, polished);
    } catch (e) {
      console.error('Error polishing inspection text:', e);
    } finally {
      setPolishingItemId(null);
    }
  };

  // Handle Photo Upload (or Camera capture)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const files = e.target.files;
    if (!files || !files.length || !selectedInspection || !currentRoom) return;

    const newPhotos: InspectionPhoto[] = Array.from(files).map((file, idx) => ({
      id: `photo_${Date.now()}_${idx}`,
      url: URL.createObjectURL(file),
      caption: `Registro de ${file.name}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }));

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      const room = updatedRooms[activeRoomIndex];
      const updatedItems = room.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            hasPhoto: true,
            photos: [...(item.photos || []), ...newPhotos]
          };
        }
        return item;
      });
      updatedRooms[activeRoomIndex] = { ...room, items: updatedItems };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Remove photo
  const handleRemovePhoto = (itemId: string, photoId: string) => {
    if (!selectedInspection || !currentRoom) return;

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      const room = updatedRooms[activeRoomIndex];
      const updatedItems = room.items.map(item => {
        if (item.id === itemId) {
          const filtered = (item.photos || []).filter(p => p.id !== photoId);
          return {
            ...item,
            hasPhoto: filtered.length > 0,
            photos: filtered
          };
        }
        return item;
      });
      updatedRooms[activeRoomIndex] = { ...room, items: updatedItems };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Add Item to current room
  const handleAddItemToRoom = () => {
    if (!selectedInspection || !currentRoom) return;
    const itemName = prompt('Nome do novo item para este ambiente (Ex: Ar-condicionado, Box Blindex, Armário Embutido):');
    if (!itemName?.trim()) return;

    const newItem: InspectionRoomItem = {
      id: `item_${Date.now()}`,
      name: itemName.trim(),
      condition: 'BOM',
      state: 'BOM',
      paintState: 'BOA',
      observations: 'Item sem avarias aparentes.',
      hasPhoto: false,
      photos: []
    };

    setInspections(prev => prev.map(insp => {
      if (insp.id !== selectedInspection.id) return insp;
      const updatedRooms = [...insp.rooms];
      const room = updatedRooms[activeRoomIndex];
      updatedRooms[activeRoomIndex] = {
        ...room,
        items: [...room.items, newItem]
      };
      return { ...insp, rooms: updatedRooms };
    }));
  };

  // Key check-out action
  const handleToggleKeyCheckout = (keyId: string) => {
    setKeys(prev => prev.map(k => {
      if (k.id === keyId) {
        if (k.status === 'NO_CLAVICULARIO') {
          return {
            ...k,
            status: 'EM_VISITA',
            checkedOutToBrokerName: 'Roberto Silveira (Corretor)',
            checkedOutAt: 'Hoje às 14:15',
            expectedReturnAt: 'Hoje às 16:30',
          };
        } else {
          return {
            ...k,
            status: 'NO_CLAVICULARIO',
            checkedOutToBrokerName: undefined,
            checkedOutAt: undefined,
            expectedReturnAt: undefined,
          };
        }
      }
      return k;
    }));
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* ============================================================== */}
      {/* HEADER PRINCIPAL COM CORES VIBRANTES & BOTÃO NOVA VISTORIA */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-full">
              Padrão Rede Vistorias / Vistoriador
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-[11px] font-semibold text-slate-500">
              Checklist Fotográfico com Correção por IA
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-heading flex items-center gap-2.5">
            <ClipboardCheck className="w-8 h-8 text-blue-600 bg-blue-50 p-1.5 rounded-2xl shrink-0" />
            <span>Vistorias Digitais & Claviculário de Chaves</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Vistorias completas com divisão por ambiente, termômetro em cores de temperatura, estado da pintura, fotos pela câmera e laudo oficial emitido com IA.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setIsNewInspectionModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Iniciar Nova Vistoria</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              isOfflineMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isOfflineMode ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
            <span className="hidden sm:inline">{isOfflineMode ? 'Modo Offline (Cache Local)' : 'Online & Sincronizado'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TABS DE NAVEGAÇÃO COLORIDAS */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('vistorias')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'vistorias'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Laudos de Vistoria (Entrada / Saída)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'vistorias' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {inspections.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chaves')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'chaves'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Claviculário Digital de Chaves</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'chaves' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {keys.length}
            </span>
          </button>
        </div>

        {activeTab === 'vistorias' && selectedInspection && (
          <button
            type="button"
            onClick={() => setIsDossierModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Compilar & Gerar Laudo Oficial</span>
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. ABA DE VISTORIAS DIGITAIS */}
      {/* ============================================================== */}
      {activeTab === 'vistorias' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 animate-in fade-in duration-200">
          
          {/* Left Column: Inspections List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Vistorias Cadastradas ({inspections.length})
              </span>
              <button
                type="button"
                onClick={() => setIsNewInspectionModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {inspections.map((insp) => {
                const isSelected = selectedInspection?.id === insp.id;
                const isEntrada = insp.type === 'ENTRADA';

                return (
                  <div
                    key={insp.id}
                    onClick={() => {
                      setSelectedInspectionId(insp.id);
                      setActiveRoomIndex(0);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-black text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                        {insp.propertyCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isEntrada 
                          ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {isEntrada ? 'Vistoria de Entrada' : 'Vistoria de Saída'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">
                      {insp.propertyAddress}
                    </h4>

                    <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="truncate max-w-[140px]">👤 {insp.inspectorName}</span>
                      <span className="font-mono text-slate-400 font-semibold">{insp.date}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px]">
                      <span className="text-slate-600 font-semibold">
                        📍 {insp.rooms.length} ambientes vistoriados
                      </span>
                      <span className={`font-bold px-1.5 py-0.5 rounded ${
                        insp.status === 'CONCLUIDA' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {insp.status === 'CONCLUIDA' ? 'Laudo Pronto ✓' : 'Em Andamento'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Room Checklist Editor (8 cols) */}
          {selectedInspection && currentRoom && (
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-5">
              
              {/* Inspection Info & Compilar Laudo Button Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedInspection.code || 'LAU-2026-0891'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-heading">
                      Checklist Técnico de Vistoria
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{selectedInspection.propertyAddress}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDossierModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Compilar Laudo Pericial</span>
                  </button>
                </div>
              </div>

              {/* Room Selector Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ambientes do Imóvel ({selectedInspection.rooms.length})
                  </span>
                  <span className="text-[11px] text-slate-400">Clique para alternar o cômodo</span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedInspection.rooms.map((room, idx) => {
                    const isRoomActive = idx === activeRoomIndex;
                    const rState = getGeneralStateBadge(room.overallState);

                    return (
                      <button
                        key={room.id || idx}
                        onClick={() => setActiveRoomIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                          isRoomActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{room.roomName}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          room.overallState === 'OTIMO' ? 'bg-emerald-400' :
                          room.overallState === 'BOM' ? 'bg-lime-400' :
                          room.overallState === 'REGULAR' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Room Control Card: Estado Geral (Cores de Temperatura) + Estado da Pintura */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>📍 {currentRoom.roomName}</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {currentRoom.items.length} itens avaliados
                  </span>
                </div>

                {/* Selectors for Room General State (Temperature) & Paint State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Estado Geral (Temperatura) */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Estado Geral do Ambiente (Temperatura)
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['PESSIMO', 'REGULAR', 'BOM', 'OTIMO'] as InspectionGeneralState[]).map(state => {
                        const isSelected = (currentRoom.overallState || 'BOM') === state;
                        const badge = getGeneralStateBadge(state);

                        return (
                          <button
                            key={state}
                            type="button"
                            onClick={() => handleUpdateRoomState(state)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
                              isSelected
                                ? `${badge.bg} shadow-xs scale-105`
                                : `${badge.lightBg} border opacity-70 hover:opacity-100`
                            }`}
                          >
                            {badge.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estado da Pintura */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Estado da Pintura do Ambiente
                    </span>
                    <div className="grid grid-cols-5 gap-1">
                      {(['NOVA', 'BOA', 'REGULAR', 'RUIM', 'PESSIMA'] as InspectionPaintState[]).map(paint => {
                        const isSelected = (currentRoom.paintState || 'BOA') === paint;
                        const badge = getPaintStateBadge(paint);

                        return (
                          <button
                            key={paint}
                            type="button"
                            onClick={() => handleUpdateRoomPaint(paint)}
                            className={`py-1.5 rounded-lg text-[9px] font-bold transition-all text-center ${
                              isSelected
                                ? `${badge.bg} shadow-xs scale-105`
                                : `${badge.lightBg} border opacity-70 hover:opacity-100`
                            }`}
                          >
                            {badge.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Checklist for Current Room */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Itens Inspecionados no Ambiente
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItemToRoom}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentRoom.items.map((item) => {
                    const itemState = item.state || (item.condition === 'NOVO' ? 'OTIMO' : item.condition === 'DANIFICADO' ? 'PESSIMO' : 'BOM');
                    const itemPaint = item.paintState || 'BOA';
                    const isPolishing = polishingItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
                      >
                        {/* Item Header & Quick State Selectors */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <strong className="text-xs font-bold text-slate-900 block">
                            {item.name}
                          </strong>

                          {/* Temperature Buttons for Item */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {(['PESSIMO', 'REGULAR', 'BOM', 'OTIMO'] as InspectionGeneralState[]).map(state => {
                              const isSelected = itemState === state;
                              const badge = getGeneralStateBadge(state);

                              return (
                                <button
                                  key={state}
                                  type="button"
                                  onClick={() => handleUpdateItemState(item.id, state)}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all ${
                                    isSelected
                                      ? `${badge.bg} shadow-2xs font-black`
                                      : `${badge.lightBg} border opacity-60 hover:opacity-100`
                                  }`}
                                >
                                  {badge.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Paint State Buttons for Item */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 overflow-x-auto py-0.5">
                          <span className="font-semibold text-slate-400 shrink-0">Pintura:</span>
                          {(['NOVA', 'BOA', 'REGULAR', 'RUIM', 'PESSIMA'] as InspectionPaintState[]).map(paint => {
                            const isSelected = itemPaint === paint;
                            const badge = getPaintStateBadge(paint);

                            return (
                              <button
                                key={paint}
                                type="button"
                                onClick={() => handleUpdateItemPaint(item.id, paint)}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                                  isSelected
                                    ? `${badge.bg} shadow-2xs`
                                    : `${badge.lightBg} border opacity-60 hover:opacity-100`
                                }`}
                              >
                                {badge.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Observations with AI Polish Button */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Anotações Técnicas & Avarias
                            </label>

                            {/* AI Polish Button */}
                            <button
                              type="button"
                              disabled={isPolishing || !item.observations.trim()}
                              onClick={() => handlePolishItemText(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
                              title="Corrigir gramática e reescrever em linguagem técnica pericial"
                            >
                              <Sparkles className={`w-3 h-3 text-indigo-600 ${isPolishing ? 'animate-spin' : ''}`} />
                              <span>{isPolishing ? 'Revisando com IA...' : 'Corrigir Texto com IA'}</span>
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={item.observations}
                            onChange={(e) => handleUpdateItemObservations(item.id, e.target.value)}
                            placeholder="Descreva o estado, trincas, manchas, funcionamento de fechos ou detalhes técnicos..."
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden leading-relaxed font-medium"
                          />
                        </div>

                        {/* Photo Attachments & Camera Upload */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-blue-600" />
                              <span>Evidências Fotográficas ({item.photos?.length || 0})</span>
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Open Camera Button */}
                              <label className="cursor-pointer px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-blue-200 transition-colors">
                                <Camera className="w-3 h-3 text-blue-600" />
                                <span>Abrir Câmera</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, item.id)}
                                />
                              </label>

                              {/* Upload from Gallery Button */}
                              <label className="cursor-pointer px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-slate-200 transition-colors">
                                <Upload className="w-3 h-3 text-slate-600" />
                                <span>Galeria</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, item.id)}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Photo Thumbnails */}
                          {item.photos && item.photos.length > 0 && (
                            <div className="flex items-center gap-2 overflow-x-auto py-1">
                              {item.photos.map((photo) => (
                                <div
                                  key={photo.id}
                                  className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden relative group shrink-0 bg-slate-100 shadow-2xs"
                                >
                                  <img
                                    src={photo.url}
                                    alt={photo.caption || 'Foto da vistoria'}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(item.id, photo.id)}
                                    className="absolute top-1 right-1 p-1 rounded-md bg-black/75 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                                    title="Remover foto"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Action: Compilar Laudo */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Conclusão & Emissão do Laudo</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Compile todas as evidências, fotos catalogadas e notas revisadas pela IA em um laudo pericial oficial para assinatura.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDossierModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  <span>Compilar Laudo Pericial Oficial</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ABA DO CLAVICULÁRIO DIGITAL DE CHAVES */}
      {/* ============================================================== */}
      {activeTab === 'chaves' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Claviculário Físico & Controle de Saída de Chaves</span>
              </h3>
              <p className="text-xs text-slate-500">
                Evita extravio de chaves durante visitas externas com corretores, parceiros e clientes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Total: <strong>{keys.length} Chaves Rastreadas</strong>
              </span>
              <button
                type="button"
                onClick={() => handleOpenKeyModal()}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar Chave</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {keys.map((k) => {
              const isAvailable = k.status === 'NO_CLAVICULARIO';
              return (
                <div
                  key={k.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 relative overflow-hidden group ${
                    isAvailable
                      ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white shadow-2xs hover:shadow-xs'
                      : 'border-amber-300 bg-gradient-to-br from-amber-50/70 to-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      🔑 {k.keyNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        }`}
                      >
                        {isAvailable ? 'No Claviculário' : 'Em Visita'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenKeyModal(k)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-white/80 transition-colors"
                        title="Editar Chave"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteKey(k.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-white/80 transition-colors"
                        title="Excluir Chave"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{k.propertyAddress}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{k.propertyCode}</span>
                  </div>

                  {!isAvailable && (
                    <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
                      <p><strong>Corretor Responsável:</strong> {k.checkedOutToBrokerName || 'Não especificado'}</p>
                      <p><strong>Horário de Saída:</strong> {k.checkedOutAt || 'Hoje'}</p>
                      <p><strong>Devolução Prevista:</strong> {k.expectedReturnAt || 'Hoje às 18:00'}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleToggleKeyCheckout(k.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                      isAvailable
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isAvailable ? 'Retirar Chave para Visita' : 'Registrar Devolução da Chave'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CADASTRAR OU EDITAR CHAVE NO CLAVICULÁRIO */}
      {/* ============================================================== */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">
                {editingKey ? 'Editar Registro de Chave' : 'Cadastrar Nova Chave no Claviculário'}
              </span>
              <button 
                onClick={() => setIsKeyModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nº da Chave / Etiqueta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CH-105"
                    value={keyForm.keyNumber}
                    onChange={(e) => setKeyForm({ ...keyForm, keyNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cód. do Imóvel</label>
                  <input
                    type="text"
                    placeholder="Ex: IMO-8942"
                    value={keyForm.propertyCode}
                    onChange={(e) => setKeyForm({ ...keyForm, propertyCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Endereço do Imóvel / Unidade *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alameda Santos, 1420 - Apt 124"
                  value={keyForm.propertyAddress}
                  onChange={(e) => setKeyForm({ ...keyForm, propertyAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Situação Inicial</label>
                <select
                  value={keyForm.status}
                  onChange={(e) => setKeyForm({ ...keyForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NO_CLAVICULARIO">Guardada no Claviculário Físico</option>
                  <option value="EM_VISITA">Retirada para Visita Externa</option>
                </select>
              </div>

              {keyForm.status === 'EM_VISITA' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2.5">
                  <div>
                    <label className="block text-amber-900 font-semibold mb-1">Corretor Responsável</label>
                    <input
                      type="text"
                      placeholder="Nome do corretor que retirou a chave"
                      value={keyForm.checkedOutToBrokerName}
                      onChange={(e) => setKeyForm({ ...keyForm, checkedOutToBrokerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-semibold mb-1">Previsão de Devolução</label>
                    <input
                      type="text"
                      placeholder="Ex: Hoje às 18:30"
                      value={keyForm.expectedReturnAt}
                      onChange={(e) => setKeyForm({ ...keyForm, expectedReturnAt: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  {editingKey ? 'Salvar Chave' : 'Cadastrar Chave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: INICIAR NOVA VISTORIA */}
      {/* ============================================================== */}
      <NewInspectionModal
        isOpen={isNewInspectionModalOpen}
        onClose={() => setIsNewInspectionModalOpen(false)}
        properties={properties}
        onSaveInspection={handleSaveNewInspection}
      />

      {/* ============================================================== */}
      {/* MODAL 2: LAUDO PERICIAL OFICIAL COMPILADO (DOSSIÊ & PDF) */}
      {/* ============================================================== */}
      {selectedInspection && (
        <InspectionDossierModal
          isOpen={isDossierModalOpen}
          onClose={() => setIsDossierModalOpen(false)}
          inspection={selectedInspection}
        />
      )}
    </div>
  );
};

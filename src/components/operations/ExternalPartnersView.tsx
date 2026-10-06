import React, { useState, useRef } from 'react';
import { 
  Users, 
  Handshake, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  DollarSign, 
  X, 
  Check, 
  Copy,
  Layers,
  ArrowUpRight,
  Edit2,
  Trash2,
  Camera,
  Crop,
  MapPin,
  User,
  ZoomIn,
  ZoomOut,
  Sparkles
} from 'lucide-react';
import { RealEstateProperty, UserProfile } from '../../types/crm';
import { TableScrollContainer } from '../common/TableScrollContainer';

export interface ExternalBrokerPartner {
  id: string;
  name: string;
  agencyName: string;
  creci: string;
  phone: string;
  email: string;
  cpfOrCnpj: string;
  city: string;
  state: string;
  pixKey: string;
  defaultSplitPercent: number; // e.g. 50 (50/50 co-brokerage)
  status: 'ATIVO' | 'EM_ANALISE' | 'SUSPENSO';
  dealsClosedCount: number;
  totalCommissionsReceived: number;
  createdAt: string;
  photoUrl?: string;
  referencePhone?: string;
  referenceContactName?: string;
  address?: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export interface ProtectedPartnerClient {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  propertyTitle: string;
  partnerId: string;
  partnerName: string;
  partnerCreci: string;
  internalBrokerName: string;
  registeredDate: string;
  validUntilDate: string; // 90 days validity
  status: 'EM_NEGOCIACAO' | 'VISITA_AGENDADA' | 'PROPOSTA_ENVIADA' | 'FECHADO' | 'EXPIRADO';
  estimatedValue: number;
  partnerExpectedCommission: number;
}

interface ExternalPartnersViewProps {
  properties: RealEstateProperty[];
  currentUser?: UserProfile;
}

const INITIAL_PARTNERS: ExternalBrokerPartner[] = [
  {
    id: 'prt_1',
    name: 'Murilo Henrique Brandão',
    agencyName: 'M. Brandão Imóveis & Consultoria',
    creci: '210.842-F / SP',
    phone: '(11) 98112-4455',
    email: 'murilo@mbrandaoimoveis.com.br',
    cpfOrCnpj: '28.910.452/0001-33',
    city: 'São Paulo',
    state: 'SP',
    pixKey: '28910452000133',
    defaultSplitPercent: 50,
    status: 'ATIVO',
    dealsClosedCount: 6,
    totalCommissionsReceived: 185000,
    createdAt: '2024-02-15',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=250&auto=format&fit=crop&q=80',
    referencePhone: '(11) 3450-8800',
    referenceContactName: 'Dra. Camila Brandão (Sócia)',
    address: {
      cep: '01426-001',
      street: 'Rua Oscar Freire',
      number: '1020',
      complement: 'Conj. 41',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP'
    }
  },
  {
    id: 'prt_2',
    name: 'Ana Paula Nogueira',
    agencyName: 'Prime Sul Imóveis',
    creci: '194.201-F / SP',
    phone: '(11) 97654-1122',
    email: 'anapaula@primesul.com.br',
    cpfOrCnpj: '381.902.441-20',
    city: 'Santo André',
    state: 'SP',
    pixKey: 'anapaula@primesul.com.br',
    defaultSplitPercent: 50,
    status: 'ATIVO',
    dealsClosedCount: 3,
    totalCommissionsReceived: 88000,
    createdAt: '2024-05-10',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    referencePhone: '(11) 4433-2211',
    referenceContactName: 'Gerência Comercial Prime Sul',
    address: {
      cep: '09015-000',
      street: 'Av. Portugal',
      number: '550',
      neighborhood: 'Centro',
      city: 'Santo André',
      state: 'SP'
    }
  },
  {
    id: 'prt_3',
    name: 'Fernando Guimarães',
    agencyName: 'Guimarães Alto Padrão Alphaville',
    creci: '158.740-F / SP',
    phone: '(11) 99221-7788',
    email: 'fernando@guimaraesaltopadrao.com.br',
    cpfOrCnpj: '34.890.112/0001-90',
    city: 'Barueri',
    state: 'SP',
    pixKey: 'fernando@guimaraesaltopadrao.com.br',
    defaultSplitPercent: 50,
    status: 'ATIVO',
    dealsClosedCount: 4,
    totalCommissionsReceived: 142000,
    createdAt: '2024-01-20',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80',
    referencePhone: '(11) 4195-3344',
    referenceContactName: 'Escritório Alphaville',
    address: {
      cep: '06454-000',
      street: 'Alameda Rio Negro',
      number: '1030',
      complement: 'Torre Corporate 8º andar',
      neighborhood: 'Alphaville',
      city: 'Barueri',
      state: 'SP'
    }
  },
  {
    id: 'prt_4',
    name: 'Juliana Bicalho',
    agencyName: 'Bicalho Negócios Imobiliários',
    creci: '230.112-F / RJ',
    phone: '(21) 98877-6655',
    email: 'juliana@bicalhoimoveis.com.br',
    cpfOrCnpj: '419.002.881-90',
    city: 'Rio de Janeiro',
    state: 'RJ',
    pixKey: '21988776655',
    defaultSplitPercent: 50,
    status: 'EM_ANALISE',
    dealsClosedCount: 0,
    totalCommissionsReceived: 0,
    createdAt: '2026-09-18',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
    referencePhone: '(21) 2255-7788',
    referenceContactName: 'Dra. Letícia Bicalho (Jurídico)',
    address: {
      cep: '22410-000',
      street: 'Av. Vieira Souto',
      number: '400',
      neighborhood: 'Ipanema',
      city: 'Rio de Janeiro',
      state: 'RJ'
    }
  }
];

const INITIAL_PROTECTED_CLIENTS: ProtectedPartnerClient[] = [
  {
    id: 'prot_1',
    clientName: 'Dr. Leonardo Castelo Branco',
    clientPhone: '(11) 99112-3344',
    clientEmail: 'castelo.branco@medicina.com.br',
    propertyTitle: 'Mansão Contemporânea Jardins 650m²',
    partnerId: 'prt_1',
    partnerName: 'Murilo Henrique Brandão',
    partnerCreci: '210.842-F / SP',
    internalBrokerName: 'Juliana Mendes',
    registeredDate: '2026-09-01',
    validUntilDate: '2026-11-30',
    status: 'VISITA_AGENDADA',
    estimatedValue: 4800000,
    partnerExpectedCommission: 144000 // 50% dos 6%
  },
  {
    id: 'prot_2',
    clientName: 'Mariana Duarte Prado',
    clientPhone: '(11) 98443-2211',
    propertyTitle: 'Cobertura Duplex Vila Nova Conceição',
    partnerId: 'prt_3',
    partnerName: 'Fernando Guimarães',
    partnerCreci: '158.740-F / SP',
    internalBrokerName: 'Carlos Eduardo Silveira',
    registeredDate: '2026-08-20',
    validUntilDate: '2026-11-18',
    status: 'PROPOSTA_ENVIADA',
    estimatedValue: 7200000,
    partnerExpectedCommission: 216000
  },
  {
    id: 'prot_3',
    clientName: 'Gustavo Mendonça Fontes',
    clientPhone: '(11) 97788-9900',
    propertyTitle: 'Casa Alpha 1 Alphaville 540m²',
    partnerId: 'prt_2',
    partnerName: 'Ana Paula Nogueira',
    partnerCreci: '194.201-F / SP',
    internalBrokerName: 'Juliana Mendes',
    registeredDate: '2026-09-10',
    validUntilDate: '2026-12-09',
    status: 'EM_NEGOCIACAO',
    estimatedValue: 3900000,
    partnerExpectedCommission: 117000
  }
];

export const ExternalPartnersView: React.FC<ExternalPartnersViewProps> = ({ 
  properties = [] 
}) => {
  const [activeTab, setActiveTab] = useState<'rede' | 'clientes_protegidos' | 'acervo_parceria' | 'minuta_termo'>('rede');
  const [partners, setPartners] = useState<ExternalBrokerPartner[]>(INITIAL_PARTNERS);
  const [protectedClients, setProtectedClients] = useState<ProtectedPartnerClient[]>(INITIAL_PROTECTED_CLIENTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<ExternalBrokerPartner | null>(null);

  // Photo crop state for partner modal
  const [partnerPhotoUrl, setPartnerPhotoUrl] = useState<string>('');
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropPanX, setCropPanX] = useState<number>(0);
  const [cropPanY, setCropPanY] = useState<number>(0);
  const [isCropping, setIsCropping] = useState<boolean>(false);

  // Address and reference state
  const [partnerAddress, setPartnerAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP'
  });
  const [partnerReferencePhone, setPartnerReferencePhone] = useState('');
  const [partnerReferenceContact, setPartnerReferenceContact] = useState('');

  const handleOpenPartnerModal = (partner?: ExternalBrokerPartner) => {
    if (partner) {
      setEditingPartner(partner);
      setPartnerPhotoUrl(partner.photoUrl || '');
      setPartnerAddress({
        cep: partner.address?.cep || '',
        street: partner.address?.street || '',
        number: partner.address?.number || '',
        complement: partner.address?.complement || '',
        neighborhood: partner.address?.neighborhood || '',
        city: partner.address?.city || partner.city || 'São Paulo',
        state: partner.address?.state || partner.state || 'SP'
      });
      setPartnerReferencePhone(partner.referencePhone || '');
      setPartnerReferenceContact(partner.referenceContactName || '');
    } else {
      setEditingPartner(null);
      setPartnerPhotoUrl('');
      setPartnerAddress({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: 'São Paulo',
        state: 'SP'
      });
      setPartnerReferencePhone('');
      setPartnerReferenceContact('');
    }
    setIsCropping(false);
    setRawImageForCrop(null);
    setIsPartnerModalOpen(true);
  };

  const handleSelectPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRawImageForCrop(event.target.result as string);
        setCropZoom(1);
        setCropPanX(0);
        setCropPanY(0);
        setIsCropping(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyCrop = () => {
    if (!rawImageForCrop) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 320;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const minDim = Math.min(img.width, img.height);
      const cropW = minDim / cropZoom;
      const cropH = minDim / cropZoom;
      const sourceX = Math.max(0, Math.min(img.width - cropW, (img.width - cropW) / 2 + (cropPanX * (img.width / 200))));
      const sourceY = Math.max(0, Math.min(img.height - cropH, (img.height - cropH) / 2 + (cropPanY * (img.height / 200))));

      ctx.drawImage(img, sourceX, sourceY, cropW, cropH, 0, 0, size, size);
      const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPartnerPhotoUrl(croppedUrl);
      setIsCropping(false);
      setRawImageForCrop(null);
      showToast('Foto do corretor parceiro recortada e aplicada!');
    };
    img.src = rawImageForCrop;
  };

  const handleCepLookup = async (cepValue: string) => {
    const cleaned = cepValue.replace(/\D/g, '');
    setPartnerAddress(prev => ({ ...prev, cep: cepValue }));
    if (cleaned.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setPartnerAddress(prev => ({
            ...prev,
            cep: cepValue,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state
          }));
          showToast(`Endereço preenchido: ${data.logradouro}, ${data.bairro}`);
        }
      } catch (e) {
        // graceful fallback
      }
    }
  };

  const [isClientProtectModalOpen, setIsClientProtectModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ProtectedPartnerClient | null>(null);

  const [selectedPartnerForTerm, setSelectedPartnerForTerm] = useState<ExternalBrokerPartner>(partners[0]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const totalPartnersActive = partners.filter(p => p.status === 'ATIVO').length;
  const totalVolumeInNegotiation = protectedClients.reduce((acc, c) => acc + c.estimatedValue, 0);
  const totalCommissionsDistributed = partners.reduce((acc, p) => acc + p.totalCommissionsReceived, 0);

  // Filtered partners
  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.creci.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Toast Notification */}
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
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Portal de Corretores Parceiros & Co-Corretagem
              </h1>
              <p className="text-xs text-slate-500">
                Gestão da rede de parcerias imobiliárias (split 50/50), proteção de clientes cadastrados e acervo compartilhado
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingClient(null);
              setIsClientProtectModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Registrar Cliente de Parceiro</span>
          </button>
          <button
            onClick={() => handleOpenPartnerModal()}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Credenciar Novo Parceiro</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Parceiros Homologados</span>
            <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 mt-1 font-mono">{totalPartnersActive}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">Corretores e Imobiliárias</div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Clientes Protegidos</span>
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-600 mt-1 font-mono">{protectedClients.length}</div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5 truncate">Vigência ativa de 90 dias</div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">VGV em Parceria</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 mt-1 font-mono">
            R$ {(totalVolumeInNegotiation / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">Em negociações ativas</div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Comissões Pagas</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-amber-600 mt-1 font-mono">
            R$ {(totalCommissionsDistributed / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">Repassadas via Split Pix</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-3 pt-2 shadow-2xs gap-1 sm:gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('rede')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'rede'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Rede de Parceiros ({partners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clientes_protegidos')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'clientes_protegidos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Registro & Proteção de Clientes ({protectedClients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('acervo_parceria')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'acervo_parceria'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Acervo Aberto para Co-Corretagem ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('minuta_termo')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'minuta_termo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Termo Oficial de Co-Corretagem (PDF)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: REDE DE PARCEIROS */}
      {/* ======================================================== */}
      {activeTab === 'rede' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar parceiro por nome, imobiliária, CRECI ou cidade..."
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      {partner.photoUrl ? (
                        <img 
                          src={partner.photoUrl} 
                          alt={partner.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20 shadow-xs shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
                          {partner.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate flex items-center gap-2">
                          {partner.name}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            {partner.defaultSplitPercent}% Split
                          </span>
                        </h3>
                        <p className="text-xs text-blue-600 font-semibold truncate mt-0.5">{partner.agencyName}</p>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">CRECI: {partner.creci}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      partner.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {partner.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{partner.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{partner.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{partner.city} - {partner.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono truncate">Pix: {partner.pixKey}</span>
                    </div>

                    {/* Endereço */}
                    {partner.address?.street && (
                      <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">
                          {partner.address.street}, {partner.address.number} {partner.address.complement ? `(${partner.address.complement})` : ''} - {partner.address.neighborhood} • CEP {partner.address.cep}
                        </span>
                      </div>
                    )}

                    {/* Telefone de Referência */}
                    {partner.referencePhone && (
                      <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200/70 truncate">
                        <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">
                          <strong>Tel. Referência:</strong> {partner.referencePhone} {partner.referenceContactName ? `(${partner.referenceContactName})` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Vendas em Parceria</span>
                      <strong className="text-slate-900">{partner.dealsClosedCount} fechamentos</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Total Repassado</span>
                      <strong className="text-emerald-700 font-bold">
                        R$ {partner.totalCommissionsReceived.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Cadastrado em {new Date(partner.createdAt).toLocaleDateString('pt-BR')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedPartnerForTerm(partner);
                        setActiveTab('minuta_termo');
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                      title="Gerar Minuta de Termo de Parceria"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Termo 50/50</span>
                    </button>
                    <button
                      onClick={() => handleOpenPartnerModal(partner)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Editar Parceiro"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setPartners(prev => prev.filter(p => p.id !== partner.id));
                        showToast(`Parceiro ${partner.name} removido.`);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Excluir Parceiro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CLIENTES PROTEGIDOS */}
      {/* ======================================================== */}
      {activeTab === 'clientes_protegidos' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registro & Proteção de Clientes de Parceiros</h2>
              <p className="text-xs text-slate-500">
                Garantia de não-atravessamento e comissão garantida de 50/50 com validade legal de 90 dias
              </p>
            </div>
            <button
              onClick={() => {
                setEditingClient(null);
                setIsClientProtectModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Cliente Protegido</span>
            </button>
          </div>

          <TableScrollContainer hintText="Arraste lateralmente ou use os botões para visualizar prazos e regras de proteção">
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4">Cliente Indicado</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4">Imóvel de Interesse</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4">Parceiro que Indicou</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4">Corretor Interno Responsável</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4">Vigência da Proteção</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4">Status & Split Estimado</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {protectedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{client.clientName}</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">{client.clientPhone}</div>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-medium text-slate-800">
                        <div className="text-xs truncate max-w-[160px] sm:max-w-xs">{client.propertyTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Valor: R$ {client.estimatedValue.toLocaleString('pt-BR')}
                        </div>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <div className="font-semibold text-blue-700 text-xs truncate max-w-[140px]">{client.partnerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">CRECI {client.partnerCreci}</div>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-slate-700 text-xs">
                        {client.internalBrokerName}
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <div className="text-slate-800 font-semibold font-mono text-xs">
                          Até {new Date(client.validUntilDate).toLocaleDateString('pt-BR')}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          ✓ Protegido por 90 dias
                        </span>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                          {client.status.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-emerald-700 font-bold mt-1 font-mono">
                          Split Previsto: R$ {client.partnerExpectedCommission.toLocaleString('pt-BR')}
                        </div>
                      </td>

                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setIsClientProtectModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Editar Cliente Protegido"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setProtectedClients(prev => prev.filter(c => c.id !== client.id));
                            showToast(`Cliente ${client.clientName} removido da proteção.`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Remover Proteção"
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
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ACERVO PARA CO-CORRETAGEM */}
      {/* ======================================================== */}
      {activeTab === 'acervo_parceria' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900">Imóveis Liberados para Co-Corretagem & Divulgação</h2>
            <p className="text-xs text-slate-500">
              Disponibilize materiais sem marca d'água para parceiros anunciarem com divisão oficial de comissão (50/50)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((prop) => {
              const salePrice = prop.pricing.salePrice || 1000000;
              const commissionGross = salePrice * 0.06;
              const partnerShare = commissionGross * 0.5;

              return (
                <div key={prop.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="relative mb-3 rounded-xl overflow-hidden aspect-video bg-slate-100">
                      <img
                        src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80'}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                        50/50 Co-Corretagem
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{prop.address.neighborhood}, {prop.address.city}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Valor de Venda:</span>
                        <strong className="text-slate-900 font-bold">R$ {salePrice.toLocaleString('pt-BR')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Comissão do Parceiro (50%):</span>
                        <strong className="text-emerald-700 font-bold">R$ {partnerShare.toLocaleString('pt-BR')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => alert(`Link de material white-label do imóvel "${prop.title}" copiado para a área de transferência!`)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Fotos sem Logo
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPartnerForTerm(partners[0]);
                        setActiveTab('minuta_termo');
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <span>Gerar Acordo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: MINUTA & TERMO DE CO-CORRETAGEM */}
      {/* ======================================================== */}
      {activeTab === 'minuta_termo' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between print:hidden">
            <div>
              <h2 className="text-base font-bold text-slate-900">Termo Oficial de Parceria & Co-Corretagem Imobiliária</h2>
              <p className="text-xs text-slate-500">Instrumento particular de rateio de honorários e proteção jurídica mútua</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Salvar Termo em PDF
            </button>
          </div>

          {/* Legal Document Timbrado */}
          <div className="bg-white rounded-2xl border border-slate-300 p-8 max-w-4xl mx-auto space-y-6 text-xs text-slate-900 leading-relaxed shadow-sm">
            <div className="text-center border-b border-slate-300 pb-4">
              <h3 className="text-base font-black uppercase tracking-wider">
                INSTRUMENTO PARTICULAR DE CO-CORRETAGEM E PARCERIA IMOBILIÁRIA
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Conforme Código Civil Brasileiro (Arts. 722 a 729) e Resolução COFECI</p>
            </div>

            <div className="space-y-3 text-justify">
              <p>
                <strong>IMOBILIÁRIA CAPTADORA:</strong> ACERTGO GESTÃO IMOBILIÁRIA LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 12.345.678/0001-90, CRECI-J nº 45.678-SP, com sede na Av. Brigadeiro Faria Lima, 2800, São Paulo/SP.
              </p>

              <p>
                <strong>CORRETOR / IMOBILIÁRIA PARCEIRA:</strong> {selectedPartnerForTerm.agencyName}, representada por <strong>{selectedPartnerForTerm.name}</strong>, inscrito(a) no CRECI sob o nº {selectedPartnerForTerm.creci}, CPF/CNPJ {selectedPartnerForTerm.cpfOrCnpj}, com domicílio profissional em {selectedPartnerForTerm.city}/{selectedPartnerForTerm.state}, Chave Pix de repasse: <strong className="font-mono">{selectedPartnerForTerm.pixKey}</strong>.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">CLÁUSULA 1ª - DO OBJETO E RATEIO DE HONORÁRIOS:</strong>
                As partes acordam cooperar na intermediação de compra e venda de imóveis do acervo da Captadora, fixando-se a divisão de honorários no percentual de <strong>{selectedPartnerForTerm.defaultSplitPercent}% (cinquenta por cento)</strong> para a Imobiliária Captadora e <strong>{selectedPartnerForTerm.defaultSplitPercent}% (cinquenta por cento)</strong> para o Corretor Parceiro sobre o montante líquido da comissão recebida na transação.
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">CLÁUSULA 2ª - DA PROTEÇÃO DE CLIENTE (NÃO-ATRAVESSAMENTO):</strong>
                O cliente formalmente cadastrado pelo Parceiro nesta plataforma gozará de exclusividade e proteção de atendimento pelo prazo improrrogável de <strong>90 (noventa) dias corridos</strong> a contar da data de homologação do registro. A Captadora se compromete a não atender o referido cliente diretamente ou por terceiros durante a vigência desta proteção.
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">CLÁUSULA 3ª - DA LIQUIDAÇÃO E REPASSE VIA PIX:</strong>
                O pagamento da parcela devida ao Corretor Parceiro será efetuado automaticamente em até 24 (vinte e quatro) horas úteis após a liquidação do valor da comissão pela parte compradora ou vendedora, via Pix na chave bancária declarada.
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-[11px]">
              <div>
                <div className="border-b border-slate-400 pb-8 mb-2"></div>
                <strong className="block">ACERTGO GESTÃO IMOBILIÁRIA LTDA</strong>
                <span className="text-slate-500">CRECI-J 45.678-SP · Diretoria Comercial</span>
              </div>

              <div>
                <div className="border-b border-slate-400 pb-8 mb-2"></div>
                <strong className="block">{selectedPartnerForTerm.name}</strong>
                <span className="text-slate-500">CRECI {selectedPartnerForTerm.creci} · Corretor Parceiro</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CADASTRAR OU EDITAR PARCEIRO */}
      {/* ======================================================== */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 my-6">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {editingPartner ? 'Editar Corretor Parceiro' : 'Credenciar Novo Corretor Parceiro'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Foto com recorte, endereço e telefone de referência</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsPartnerModalOpen(false);
                  setEditingPartner(null);
                  setIsCropping(false);
                  setRawImageForCrop(null);
                }} 
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const partnerData: Partial<ExternalBrokerPartner> = {
                  name: form.name.value,
                  agencyName: form.agencyName.value,
                  creci: form.creci.value,
                  phone: form.phone.value,
                  email: form.email.value,
                  cpfOrCnpj: form.cpfOrCnpj.value,
                  city: partnerAddress.city || form.city?.value || 'São Paulo',
                  state: partnerAddress.state || 'SP',
                  pixKey: form.pixKey.value,
                  photoUrl: partnerPhotoUrl,
                  referencePhone: partnerReferencePhone,
                  referenceContactName: partnerReferenceContact,
                  address: partnerAddress
                };

                if (editingPartner) {
                  setPartners(prev => prev.map(p => p.id === editingPartner.id ? {
                    ...p,
                    ...partnerData
                  } as ExternalBrokerPartner : p));
                  showToast(`Parceiro "${form.name.value}" atualizado com sucesso!`);
                } else {
                  const newPartner: ExternalBrokerPartner = {
                    id: `prt_${Date.now()}`,
                    name: form.name.value,
                    agencyName: form.agencyName.value,
                    creci: form.creci.value,
                    phone: form.phone.value,
                    email: form.email.value,
                    cpfOrCnpj: form.cpfOrCnpj.value,
                    city: partnerAddress.city || 'São Paulo',
                    state: partnerAddress.state || 'SP',
                    pixKey: form.pixKey.value,
                    defaultSplitPercent: 50,
                    status: 'ATIVO',
                    dealsClosedCount: 0,
                    totalCommissionsReceived: 0,
                    createdAt: new Date().toISOString(),
                    photoUrl: partnerPhotoUrl,
                    referencePhone: partnerReferencePhone,
                    referenceContactName: partnerReferenceContact,
                    address: partnerAddress
                  };
                  setPartners([newPartner, ...partners]);
                  showToast(`Parceiro "${newPartner.name}" credenciado com sucesso!`);
                }

                setIsPartnerModalOpen(false);
                setEditingPartner(null);
                setIsCropping(false);
                setRawImageForCrop(null);
              }}
              className="p-5 sm:p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto"
            >
              {/* 1. SEÇÃO DE FOTO COM RECORTE */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  Foto de Perfil & Sistema de Recorte
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="relative group shrink-0">
                    {partnerPhotoUrl ? (
                      <img 
                        src={partnerPhotoUrl} 
                        alt="Foto do Corretor" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <User className="w-8 h-8" />
                        <span className="text-[9px] mt-0.5 font-semibold">Sem foto</span>
                      </div>
                    )}
                    <label 
                      htmlFor="partner-photo-upload"
                      className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
                      title="Subir foto com recorte"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                    <input 
                      id="partner-photo-upload"
                      type="file" 
                      accept="image/*" 
                      onChange={handleSelectPhoto} 
                      className="hidden" 
                    />
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <label 
                        htmlFor="partner-photo-upload"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <Crop className="w-3.5 h-3.5 text-blue-600" />
                        <span>Carregar & Recortar Foto</span>
                      </label>
                      {partnerPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setPartnerPhotoUrl('')}
                          className="px-2.5 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Formatos aceitos: JPG, PNG ou WEBP. Sistema de recorte circular automático de alta definição.
                    </p>
                  </div>
                </div>

                {/* MODAL / PAINEL DE RECORTE INTERATIVO */}
                {isCropping && rawImageForCrop && (
                  <div className="mt-3 p-4 bg-slate-900 rounded-2xl text-white space-y-3 animate-in fade-in-50">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Crop className="w-4 h-4" />
                        Ajuste e Recorte de Foto
                      </span>
                      <span className="text-[10px] text-slate-400">Arraste os controles abaixo</span>
                    </div>

                    {/* Preview Box with Mask */}
                    <div className="flex justify-center py-2">
                      <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-blue-400 shadow-2xl bg-black flex items-center justify-center">
                        <img 
                          src={rawImageForCrop} 
                          alt="Recorte" 
                          style={{
                            transform: `scale(${cropZoom}) translate(${cropPanX}px, ${cropPanY}px)`,
                            transformOrigin: 'center center',
                            maxWidth: 'none'
                          }}
                          className="w-full h-full object-cover transition-transform duration-75"
                        />
                        {/* Circular Overlay Ring */}
                        <div className="absolute inset-0 pointer-events-none rounded-full border-4 border-white/20" />
                      </div>
                    </div>

                    {/* Controls: Zoom & Pan */}
                    <div className="space-y-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-slate-300 font-semibold mb-1">
                          <span className="flex items-center gap-1">
                            <ZoomIn className="w-3 h-3 text-blue-400" />
                            Zoom do Recorte: {cropZoom.toFixed(1)}x
                          </span>
                          <span className="text-slate-400">1.0x - 3.0x</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          step="0.1" 
                          value={cropZoom} 
                          onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                          className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-slate-400 mb-0.5 text-[10px]">Ajuste Horizontal (X)</label>
                          <input 
                            type="range" 
                            min="-50" 
                            max="50" 
                            value={cropPanX} 
                            onChange={(e) => setCropPanX(parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-0.5 text-[10px]">Ajuste Vertical (Y)</label>
                          <input 
                            type="range" 
                            min="-50" 
                            max="50" 
                            value={cropPanY} 
                            onChange={(e) => setCropPanY(parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Crop Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCropping(false);
                          setRawImageForCrop(null);
                        }}
                        className="px-3 py-1.5 text-slate-400 hover:text-white rounded-xl text-xs"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyCrop}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar Recorte & Aplicar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DADOS PRINCIPAIS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nome do Corretor *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    defaultValue={editingPartner?.name || ''}
                    placeholder="Ex: Murilo Brandão" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Imobiliária / Marca</label>
                  <input 
                    type="text" 
                    name="agencyName" 
                    required 
                    defaultValue={editingPartner?.agencyName || ''}
                    placeholder="Ex: Brandão Imóveis" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CRECI *</label>
                  <input 
                    type="text" 
                    name="creci" 
                    required 
                    defaultValue={editingPartner?.creci || ''}
                    placeholder="210.842-F / SP" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CPF ou CNPJ</label>
                  <input 
                    type="text" 
                    name="cpfOrCnpj" 
                    defaultValue={editingPartner?.cpfOrCnpj || ''}
                    placeholder="000.000.000-00" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
                  />
                </div>
              </div>

              {/* 3. CONTATOS E TELEFONE DE REFERÊNCIA */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Telefones & Referência de Contato
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">WhatsApp Principal *</label>
                    <input 
                      type="text" 
                      name="phone" 
                      required 
                      defaultValue={editingPartner?.phone || ''}
                      placeholder="(11) 98888-7777" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">E-mail Comercial</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      defaultValue={editingPartner?.email || ''}
                      placeholder="parceiro@email.com" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/60">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Telefone de Referência
                    </label>
                    <input 
                      type="text" 
                      value={partnerReferencePhone}
                      onChange={(e) => setPartnerReferencePhone(e.target.value)}
                      placeholder="Ex: (11) 3450-8800" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Nome / Grau da Referência
                    </label>
                    <input 
                      type="text" 
                      value={partnerReferenceContact}
                      onChange={(e) => setPartnerReferenceContact(e.target.value)}
                      placeholder="Ex: Dra. Camila (Sócia) ou Gerente" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                </div>
              </div>

              {/* 4. ENDEREÇO COMPLETO */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  Endereço do Corretor / Escritório
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">CEP</label>
                    <input 
                      type="text" 
                      value={partnerAddress.cep}
                      onChange={(e) => handleCepLookup(e.target.value)}
                      placeholder="00000-000" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white font-bold" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Logradouro (Rua / Av.)</label>
                    <input 
                      type="text" 
                      value={partnerAddress.street}
                      onChange={(e) => setPartnerAddress({ ...partnerAddress, street: e.target.value })}
                      placeholder="Ex: Rua Oscar Freire" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Número</label>
                    <input 
                      type="text" 
                      value={partnerAddress.number}
                      onChange={(e) => setPartnerAddress({ ...partnerAddress, number: e.target.value })}
                      placeholder="1020" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Complemento / Sala</label>
                    <input 
                      type="text" 
                      value={partnerAddress.complement || ''}
                      onChange={(e) => setPartnerAddress({ ...partnerAddress, complement: e.target.value })}
                      placeholder="Conj. 41 / Sala 12" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Bairro</label>
                    <input 
                      type="text" 
                      value={partnerAddress.neighborhood}
                      onChange={(e) => setPartnerAddress({ ...partnerAddress, neighborhood: e.target.value })}
                      placeholder="Cerqueira César" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Cidade</label>
                    <input 
                      type="text" 
                      value={partnerAddress.city}
                      onChange={(e) => setPartnerAddress({ ...partnerAddress, city: e.target.value })}
                      placeholder="São Paulo" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">UF / Estado</label>
                    <input 
                      type="text" 
                      maxLength={2}
                      value={partnerAddress.state}
                      onChange={(e) => setPartnerAddress({ ...partnerAddress, state: e.target.value.toUpperCase() })}
                      placeholder="SP" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white uppercase text-center font-bold" 
                    />
                  </div>
                </div>
              </div>

              {/* 5. DADOS BANCÁRIOS & CHAVE PIX */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Chave Pix Repasses</label>
                  <input 
                    type="text" 
                    name="pixKey" 
                    defaultValue={editingPartner?.pixKey || ''}
                    placeholder="Chave Pix (CPF, CNPJ, Email ou Telefone)" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Split Padrão</label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 text-center">
                    50% / 50%
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsPartnerModalOpen(false);
                    setEditingPartner(null);
                    setIsCropping(false);
                    setRawImageForCrop(null);
                  }} 
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPartner ? 'Salvar Alterações' : 'Cadastrar Parceiro'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REGISTRAR OU EDITAR CLIENTE PROTEGIDO */}
      {/* ======================================================== */}
      {isClientProtectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">
                {editingClient ? 'Editar Cliente Protegido' : 'Registrar & Proteger Cliente de Parceiro'}
              </span>
              <button 
                onClick={() => {
                  setIsClientProtectModalOpen(false);
                  setEditingClient(null);
                }} 
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const partner = partners.find(p => p.id === form.partnerId.value) || partners[0];
                const estValue = parseFloat(form.estimatedValue.value) || 2000000;

                if (editingClient) {
                  setProtectedClients(prev => prev.map(c => c.id === editingClient.id ? {
                    ...c,
                    clientName: form.clientName.value,
                    clientPhone: form.clientPhone.value,
                    propertyTitle: form.propertyTitle.value,
                    partnerId: partner.id,
                    partnerName: partner.name,
                    partnerCreci: partner.creci,
                    internalBrokerName: form.internalBroker.value || 'Juliana Mendes',
                    estimatedValue: estValue,
                    partnerExpectedCommission: estValue * 0.06 * 0.5
                  } : c));
                  showToast(`Dados de proteção do cliente "${form.clientName.value}" atualizados!`);
                } else {
                  const newClient: ProtectedPartnerClient = {
                    id: `prot_${Date.now()}`,
                    clientName: form.clientName.value,
                    clientPhone: form.clientPhone.value,
                    propertyTitle: form.propertyTitle.value,
                    partnerId: partner.id,
                    partnerName: partner.name,
                    partnerCreci: partner.creci,
                    internalBrokerName: form.internalBroker.value || 'Juliana Mendes',
                    registeredDate: new Date().toISOString().split('T')[0],
                    validUntilDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    status: 'EM_NEGOCIACAO',
                    estimatedValue: estValue,
                    partnerExpectedCommission: estValue * 0.06 * 0.5
                  };
                  setProtectedClients([newClient, ...protectedClients]);
                  showToast(`Cliente "${newClient.clientName}" protegido por 90 dias com sucesso para ${partner.name}!`);
                }

                setIsClientProtectModalOpen(false);
                setEditingClient(null);
              }}
              className="p-5 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nome do Cliente *</label>
                  <input 
                    type="text" 
                    name="clientName" 
                    required 
                    defaultValue={editingClient?.clientName || ''}
                    placeholder="Ex: Dr. Leonardo Castelo" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone do Cliente *</label>
                  <input 
                    type="text" 
                    name="clientPhone" 
                    required 
                    defaultValue={editingClient?.clientPhone || ''}
                    placeholder="(11) 98888-1122" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Parceiro que está Indicando</label>
                <select 
                  name="partnerId" 
                  defaultValue={editingClient?.partnerId || partners[0]?.id}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.agencyName} (CRECI {p.creci})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Imóvel de Interesse</label>
                <input 
                  type="text" 
                  name="propertyTitle" 
                  required 
                  defaultValue={editingClient?.propertyTitle || ''}
                  placeholder="Ex: Mansão Jardins 650m²" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valor Estimado do Negócio (R$)</label>
                  <input 
                    type="number" 
                    name="estimatedValue" 
                    defaultValue={editingClient?.estimatedValue || 2500000} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Corretor Interno da Casa</label>
                  <input 
                    type="text" 
                    name="internalBroker" 
                    defaultValue={editingClient?.internalBrokerName || 'Juliana Mendes'} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Proteção Automática por 90 Dias
                </span>
                <p className="text-[11px] text-blue-800 mt-1">
                  O registro bloqueará qualquer tentativa de contato desvinculado do parceiro, garantindo o split de 50/50 na liquidação.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsClientProtectModalOpen(false);
                    setEditingClient(null);
                  }} 
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  {editingClient ? 'Salvar Alterações' : 'Proteger Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

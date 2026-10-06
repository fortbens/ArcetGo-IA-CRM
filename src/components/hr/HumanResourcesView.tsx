import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  FileText, 
  Calendar, 
  Award, 
  HeartHandshake, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  ChevronRight, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  DollarSign, 
  Compass, 
  Eye, 
  Trash2, 
  Edit, 
  X, 
  Check, 
  Upload, 
  UserCheck, 
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import { 
  Employee, 
  ElectronicClockRecord, 
  Payslip, 
  VacationAndLeaveRequest, 
  PerformanceReview, 
  CorporateBenefit,
  DepartmentType,
  ContractType,
  ClockType
} from '../../types/hr';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_CLOCK_RECORDS, 
  INITIAL_PAYSLIPS, 
  INITIAL_VACATIONS, 
  INITIAL_PERFORMANCE_REVIEWS, 
  INITIAL_BENEFITS 
} from '../../data/mockHr';

export const HumanResourcesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'ponto_gps' | 'holerites' | 'ferias' | 'desempenho' | 'beneficios'>('colaboradores');

  // Domain State
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [clockRecords, setClockRecords] = useState<ElectronicClockRecord[]>(INITIAL_CLOCK_RECORDS);
  const [payslips, setPayslips] = useState<Payslip[]>(INITIAL_PAYSLIPS);
  const [vacations, setVacations] = useState<VacationAndLeaveRequest[]>(INITIAL_VACATIONS);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(INITIAL_PERFORMANCE_REVIEWS);
  const [benefits] = useState<CorporateBenefit[]>(INITIAL_BENEFITS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<Employee | null>(null);
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<Employee | null>(null);
  const [selectedPayslipForPrint, setSelectedPayslipForPrint] = useState<Payslip | null>(null);
  const [isClockModalOpen, setIsClockModalOpen] = useState(false);
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [employeeAvatar, setEmployeeAvatar] = useState<string>('');

  // GPS Electronic Clock State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [currentGpsCoords, setCurrentGpsCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [clockTypeSelected, setClockTypeSelected] = useState<ClockType>('ENTRADA');
  const [clockEmployeeId, setClockEmployeeId] = useState<string>(employees[0]?.id || '');
  const [clockJustification, setClockJustification] = useState<string>('');

  // Geolocation trigger
  const requestCurrentLocation = () => {
    setGpsLoading(true);
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocalização não suportada neste navegador.');
      // Fallback coordinates for demonstration (Sede Matriz Faria Lima)
      setCurrentGpsCoords({
        lat: -23.561684,
        lng: -46.655981,
        accuracy: 5
      });
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentGpsCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy)
        });
        setGpsLoading(false);
      },
      (error) => {
        console.warn('Geolocation error or permission denied, using headquarters fallback:', error);
        setGpsError('Permissão de GPS negada ou sinal indisponível. Utilizando coordenadas seguras da Sede.');
        setCurrentGpsCoords({
          lat: -23.561684,
          lng: -46.655981,
          accuracy: 6
        });
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleRegisterClock = () => {
    const emp = employees.find(e => e.id === clockEmployeeId) || employees[0];
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR');
    const formattedTime = now.toLocaleTimeString('pt-BR');

    const lat = currentGpsCoords?.lat || -23.561684;
    const lng = currentGpsCoords?.lng || -46.655981;
    const accuracy = currentGpsCoords?.accuracy || 5;

    // Headquarter distance mock calculation
    const isHQ = Math.abs(lat - (-23.561684)) < 0.005 && Math.abs(lng - (-46.655981)) < 0.005;

    const newRecord: ElectronicClockRecord = {
      id: `clk_${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeRole: emp.role,
      timestamp: now.toISOString(),
      formattedDate,
      formattedTime,
      type: clockTypeSelected,
      location: {
        latitude: lat,
        longitude: lng,
        accuracyMeters: accuracy,
        addressDescription: isHQ 
          ? 'Av. Brigadeiro Faria Lima, 2800 - Sede Matriz' 
          : 'Atendimento Externo / Em Visita com Cliente (GPS Registrado)',
        isWithinOfficePerimeter: isHQ,
        distanceMeters: isHQ ? 15 : 1200
      },
      nsrCode: `NSR-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      verificationStatus: isHQ ? 'VALIDADO_GPS' : 'APROVADO_GESTOR',
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Dispositivo Móvel Corporativo' : 'Navegador Web / AcertGo Ponto',
      justification: clockJustification || undefined
    };

    setClockRecords([newRecord, ...clockRecords]);
    setIsClockModalOpen(false);
    setClockJustification('');
    alert(`Ponto registrado com sucesso! Comprovante NSR: ${newRecord.nsrCode} às ${formattedTime}`);
  };

  // Filtered Employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.cpf.includes(searchQuery) ||
      (emp.creci && emp.creci.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Recursos Humanos (RH) & Departamento Pessoal
              </h1>
              <p className="text-xs text-slate-500">
                Gestão completa de colaboradores, ponto eletrônico via GPS, holerites, férias, desempenho e benefícios
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              requestCurrentLocation();
              setIsClockModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Bater Ponto GPS</span>
          </button>
          <button
            onClick={() => {
              setSelectedEmployeeForEdit(null);
              setEmployeeAvatar('');
              setIsEmployeeModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Novo Colaborador</span>
          </button>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Equipe Total</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 mt-1 font-mono">{employees.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {employees.filter(e => e.contractType === 'CLT').length} CLT · {employees.filter(e => e.contractType === 'AUTONOMO_CORRETOR').length} Corretores
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Batidas Hoje (GPS)</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-600 mt-1 font-mono">{clockRecords.length}</div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5 truncate">
            100% com geolocalização e NSR
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Férias / Ausências</span>
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-amber-600 mt-1 font-mono">
            {vacations.filter(v => v.status === 'EM_GOZO').length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {vacations.filter(v => v.status === 'SOLICITADO').length} pendentes de aprovação
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Folha de Pagamento</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 mt-1 font-mono">
            {payslips.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            Holerites 09/2026 emitidos
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-3 pt-2 shadow-2xs gap-1 sm:gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('colaboradores')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'colaboradores'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Colaboradores ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ponto_gps')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ponto_gps'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Ponto Eletrônico GPS</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
            Ao Vivo
          </span>
        </button>

        <button
          onClick={() => setActiveTab('holerites')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'holerites'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Holerites & Folha ({payslips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ferias')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ferias'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Férias & Licenças</span>
        </button>

        <button
          onClick={() => setActiveTab('desempenho')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'desempenho'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Avaliação de Desempenho</span>
        </button>

        <button
          onClick={() => setActiveTab('beneficios')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'beneficios'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Benefícios ({benefits.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COLABORADORES */}
      {/* ======================================================== */}
      {activeTab === 'colaboradores' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, email, CPF ou CRECI..."
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-slate-700"
              >
                <option value="ALL">Todos os Departamentos</option>
                <option value="VENDAS">Vendas</option>
                <option value="LOCACAO">Locação</option>
                <option value="FINANCEIRO">Financeiro</option>
                <option value="JURIDICO">Jurídico</option>
                <option value="ADMINISTRATIVO">Administrativo</option>
              </select>

              <button
                onClick={() => {
                  setSelectedEmployeeForEdit(null);
                  setIsEmployeeModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Cadastrar Colaborador
              </button>
            </div>
          </div>

          {/* Employees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{emp.name}</h3>
                        <p className="text-xs text-indigo-600 font-medium truncate">{emp.role}</p>
                        <span className="text-[10px] text-slate-400 font-mono">CPF: {emp.cpf}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      emp.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      emp.status === 'FERIAS' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {emp.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 py-3 border-t border-b border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.address.city} - {emp.address.state} ({emp.address.neighborhood})</span>
                    </div>
                  </div>

                  {/* Emergency Contact Pill */}
                  <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-700">Emergência:</span> {emp.emergencyContact.name} ({emp.emergencyContact.relationship})
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">{emp.emergencyContact.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Contrato: <strong className="text-slate-800">{emp.contractType}</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedEmployeeForView(emp)}
                      className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-semibold text-[11px]"
                    >
                      Ficha Completa
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEmployeeForEdit(emp);
                        setEmployeeAvatar(emp.avatar || '');
                        setIsEmployeeModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar Dados"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PONTO ELETRÔNICO POR GPS */}
      {/* ======================================================== */}
      {activeTab === 'ponto_gps' && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          
          {/* GPS Banner / Action Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Geolocalização Ativa (Portaria 671 MTE & Cercamento Eletrônico)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Ponto Eletrônico com Auditoria por GPS Direto na Plataforma
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Registre sua jornada em plantões de vendas, na sede da imobiliária ou em visitas externas com clientes. 
                As coordenadas de satélite geram o comprovante com Número Sequencial de Registro (NSR) inviolável.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    requestCurrentLocation();
                    setIsClockModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Bater Meu Ponto Agora</span>
                </button>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cercamento da Sede: Faria Lima (Tolerância 50m)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Records Table */}
          <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/90 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Histórico de Batidas de Ponto com GPS</h3>
                <p className="text-xs text-slate-500">Registros sincronizados com coordenadas de satélite e validação de raio</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Espelho de Ponto</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-4">Tipo & Horário</th>
                    <th className="py-3 px-4">Localização & Coordenadas GPS</th>
                    <th className="py-3 px-4">Comprovante NSR</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clockRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{record.employeeName}</div>
                        <div className="text-[11px] text-slate-500">{record.employeeRole}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          record.type === 'ENTRADA' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          record.type === 'SAIDA' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {record.type.replace('_', ' ')}
                        </span>
                        <div className="font-mono text-slate-800 font-semibold mt-1">
                          {record.formattedTime} - {record.formattedDate}
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-800">{record.location.addressDescription}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Lat: {record.location.latitude.toFixed(6)}, Lng: {record.location.longitude.toFixed(6)} (±{record.location.accuracyMeters}m)
                            </div>
                            {record.justification && (
                              <div className="text-[10px] text-amber-700 mt-0.5 italic">
                                Obs: {record.justification}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded text-[11px] font-semibold border border-slate-200">
                          {record.nsrCode}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {record.verificationStatus === 'VALIDADO_GPS' ? 'GPS Validado' : 'Aprovado Gestor'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: HOLERITES & FOLHA DE PAGAMENTO */}
      {/* ======================================================== */}
      {activeTab === 'holerites' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Emissão de Holerites & Folha de Pagamento</h2>
              <p className="text-xs text-slate-500">Recibos de pagamento de salário no padrão oficial com cálculo de INSS, IRRF e FGTS</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
              Competência: 09/2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payslips.map((hol) => (
              <div
                key={hol.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recibo de Salário</span>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">{hol.employeeName}</h3>
                      <p className="text-xs text-indigo-600 font-medium">{hol.role}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Mês {hol.monthYear}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">Ref: {hol.referencePeriod}</div>
                    </div>
                  </div>

                  {/* Summary Values */}
                  <div className="grid grid-cols-3 gap-2 my-4 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-medium block">Total Proventos</span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        R$ {hol.grossSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
                      <span className="text-[10px] text-rose-600 font-medium block">Total Descontos</span>
                      <span className="text-xs font-bold text-rose-700 mt-0.5 block">
                        - R$ {hol.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 font-medium block">Salário Líquido</span>
                      <span className="text-xs font-extrabold text-emerald-700 mt-0.5 block">
                        R$ {hol.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span>Base INSS: R$ {hol.inssBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span>Depósito FGTS: R$ {hol.fgtsAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base IRRF: R$ {hol.irrfBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span>Previsão de Pagto: {hol.paymentDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {hol.status}
                  </span>

                  <button
                    onClick={() => setSelectedPayslipForPrint(hol)}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Visualizar / Imprimir Holerite</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: FÉRIAS & LICENÇAS */}
      {/* ======================================================== */}
      {activeTab === 'ferias' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Programação de Férias, Licenças & Folgas</h2>
              <p className="text-xs text-slate-500">Controle de períodos aquisitivos, abonos pecuniários e escalas de cobertura de plantão</p>
            </div>
            <button
              onClick={() => setIsVacationModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Solicitar Férias / Ausência
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Período Solicitado</th>
                    <th className="py-3 px-4">Duração</th>
                    <th className="py-3 px-4">Abono 1/3 / 13º</th>
                    <th className="py-3 px-4">Status & Aprovador</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vacations.map((vac) => (
                    <tr key={vac.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {vac.employeeName}
                        <span className="block text-[10px] text-slate-400 font-normal">{vac.department}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">
                          {vac.type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-mono">
                        {new Date(vac.startDate).toLocaleDateString('pt-BR')} até {new Date(vac.endDate).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {vac.totalDays} dias
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-600">
                        {vac.sellOneThird ? '✓ Vendeu 1/3 (Abono)' : 'Sem abono'}
                        {vac.advanceThirteenth && <span className="block text-indigo-600">✓ Adiantamento 13º</span>}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          vac.status === 'APROVADO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          vac.status === 'EM_GOZO' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          vac.status === 'SOLICITADO' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {vac.status}
                        </span>
                        {vac.approvedBy && (
                          <div className="text-[10px] text-slate-400 mt-0.5">Por: {vac.approvedBy}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {vac.status === 'SOLICITADO' ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setVacations(vacations.map(v => v.id === vac.id ? { ...v, status: 'APROVADO', approvedBy: 'Gestão RH' } : v));
                              }}
                              className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => {
                                setVacations(vacations.map(v => v.id === vac.id ? { ...v, status: 'REJEITADO' } : v));
                              }}
                              className="px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              Recusar
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Processado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: DESEMPENHO */}
      {/* ======================================================== */}
      {activeTab === 'desempenho' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900">Avaliações de Desempenho & OKRs</h2>
            <p className="text-xs text-slate-500">Métricas de conversão de vendas, pontualidade, atendimento e Planos de Desenvolvimento Individual (PDI)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{rev.employeeName}</h3>
                    <p className="text-xs text-indigo-600 font-medium">{rev.role}</p>
                    <span className="text-[10px] text-slate-400">Ciclo {rev.period} · Avaliado por {rev.evaluatorName}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-indigo-600">{rev.overallScore.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 5.0</span></div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {rev.okrCompletionPercent}% OKR Atingido
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-b border-slate-100 py-3 text-xs">
                  {rev.criteria.map((crit, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-semibold text-slate-700 mb-0.5">
                        <span>{crit.name}</span>
                        <span className="text-indigo-600">{crit.score} / 5</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${(crit.score / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">{crit.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-emerald-700 block">Pontos Fortes:</strong>
                    <p className="text-slate-600 text-[11px]">{rev.strengths}</p>
                  </div>
                  <div>
                    <strong className="text-amber-700 block">PDI (Plano de Desenvolvimento Individual):</strong>
                    <p className="text-slate-600 text-[11px]">{rev.individualDevelopmentPlan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: BENEFÍCIOS */}
      {/* ======================================================== */}
      {activeTab === 'beneficios' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900">Catálogo de Benefícios Corporativos</h2>
            <p className="text-xs text-slate-500">Convênios e planos de saúde, refeição flexível, odontológico e seguro de vida oferecidos pela imobiliária</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((ben) => (
              <div key={ben.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {ben.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{ben.provider}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1">{ben.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{ben.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Custo Imobiliária</span>
                    <strong className="text-slate-900">R$ {ben.monthlyCompanyCost.toFixed(2)}/mês</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Coparticipação</span>
                    <strong className="text-slate-700">{ben.employeeCopayPercent}%</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Adesão</span>
                    <strong className="text-indigo-600">{ben.activeCount} membros</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: BATER PONTO ELETRÔNICO GPS */}
      {/* ======================================================== */}
      {isClockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold">Registrar Ponto Eletrônico por GPS</h3>
                  <p className="text-[11px] text-slate-400">Captura de coordenadas em tempo real com certificação NSR</p>
                </div>
              </div>
              <button onClick={() => setIsClockModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* GPS Location Status Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-600" /> Localização GPS Atual
                  </span>
                  <button
                    type="button"
                    onClick={requestCurrentLocation}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    Recarregar GPS
                  </button>
                </div>

                {gpsLoading ? (
                  <div className="py-3 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    Obtendo coordenadas de satélite de alta precisão...
                  </div>
                ) : (
                  <div className="text-xs text-slate-700">
                    <div className="font-semibold text-slate-900">
                      Av. Brigadeiro Faria Lima, 2800 - Sede Matriz (ou raio de atendimento)
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Lat: {currentGpsCoords?.lat.toFixed(6) || '-23.561684'}, Lng: {currentGpsCoords?.lng.toFixed(6) || '-46.655981'} (Precisão: ±{currentGpsCoords?.accuracy || 5}m)
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ Coordenadas Válidas pelo MTE
                    </span>
                  </div>
                )}
                {gpsError && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {gpsError}
                  </div>
                )}
              </div>

              {/* Colaborador Seletor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Colaborador</label>
                <select
                  value={clockEmployeeId}
                  onChange={(e) => setClockEmployeeId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} - {e.role} ({e.department})</option>
                  ))}
                </select>
              </div>

              {/* Tipo de Batida */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipo de Batida</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ENTRADA' as ClockType, label: 'Entrada Jornada' },
                    { id: 'PAUSA_ALMOCO' as ClockType, label: 'Saída Almoço' },
                    { id: 'RETORNO_ALMOCO' as ClockType, label: 'Retorno Almoço' },
                    { id: 'SAIDA' as ClockType, label: 'Saída / Fim' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setClockTypeSelected(t.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        clockTypeSelected === t.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observação / Justificativa Opcional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações / Justificativa (Opcional)
                </label>
                <input
                  type="text"
                  value={clockJustification}
                  onChange={(e) => setClockJustification(e.target.value)}
                  placeholder="Ex: Em plantão de lançamento externo ou visita com cliente"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsClockModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleRegisterClock}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Confirmar Batida & Emitir NSR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CADASTRO / EDIÇÃO DE COLABORADOR */}
      {/* ======================================================== */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">
                  {selectedEmployeeForEdit ? 'Editar Colaborador' : 'Novo Cadastro de Colaborador (RH)'}
                </h3>
              </div>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newEmp: Employee = {
                  id: selectedEmployeeForEdit ? selectedEmployeeForEdit.id : `emp_${Date.now()}`,
                  name: form.name.value,
                  email: form.email.value,
                  phone: form.phone.value,
                  role: form.role.value,
                  department: form.department.value as DepartmentType,
                  contractType: form.contractType.value as ContractType,
                  status: 'ATIVO',
                  cpf: form.cpf.value,
                  admissionDate: form.admissionDate.value || '2026-09-01',
                  salary: parseFloat(form.salary.value) || 4500,
                  pixKey: form.pixKey.value || form.email.value,
                  avatar: employeeAvatar || form.avatar?.value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  creci: form.creci.value,
                  dependentsCount: parseInt(form.dependentsCount.value) || 0,
                  address: {
                    cep: form.cep.value || '04538-133',
                    street: form.street.value || 'Rua Joaquim Floriano',
                    number: form.number.value || '100',
                    complement: form.complement.value || '',
                    neighborhood: form.neighborhood.value || 'Itaim Bibi',
                    city: form.city.value || 'São Paulo',
                    state: form.state.value || 'SP'
                  },
                  emergencyContact: {
                    name: form.emergencyName.value || 'Contato Familiar',
                    relationship: form.emergencyRel.value || 'Cônjuge',
                    phone: form.emergencyPhone.value || '(11) 98888-7777',
                    notes: form.emergencyNotes.value || ''
                  }
                };

                if (selectedEmployeeForEdit) {
                  setEmployees(employees.map(emp => emp.id === newEmp.id ? newEmp : emp));
                } else {
                  setEmployees([newEmp, ...employees]);
                }
                setIsEmployeeModalOpen(false);
                alert('Colaborador salvo com sucesso!');
              }}
              className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs"
            >
              {/* Section 1: Dados Pessoais & Contratuais */}
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                1. Dados Pessoais & Contratuais
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedEmployeeForEdit?.name || ''}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">E-mail Corporativo *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={selectedEmployeeForEdit?.email || ''}
                    placeholder="carlos@imobiliaria.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    required
                    defaultValue={selectedEmployeeForEdit?.cpf || ''}
                    placeholder="123.456.789-00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={selectedEmployeeForEdit?.phone || ''}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CRECI (Se corretor)</label>
                  <input
                    type="text"
                    name="creci"
                    defaultValue={selectedEmployeeForEdit?.creci || ''}
                    placeholder="194.821-F"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cargo / Função *</label>
                  <input
                    type="text"
                    name="role"
                    required
                    defaultValue={selectedEmployeeForEdit?.role || ''}
                    placeholder="Ex: Corretor Sênior"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Departamento</label>
                  <select
                    name="department"
                    defaultValue={selectedEmployeeForEdit?.department || 'VENDAS'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="VENDAS">Vendas</option>
                    <option value="LOCACAO">Locação</option>
                    <option value="FINANCEIRO">Financeiro</option>
                    <option value="JURIDICO">Jurídico</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="DIRETORIA">Diretoria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contrato</label>
                  <select
                    name="contractType"
                    defaultValue={selectedEmployeeForEdit?.contractType || 'CLT'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="CLT">CLT</option>
                    <option value="AUTONOMO_CORRETOR">Corretor Associado</option>
                    <option value="PJ">PJ</option>
                    <option value="ESTAGIO">Estágio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salário Base (R$)</label>
                  <input
                    type="number"
                    name="salary"
                    step="0.01"
                    defaultValue={selectedEmployeeForEdit?.salary || 4500}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Data Admissão</label>
                  <input
                    type="date"
                    name="admissionDate"
                    defaultValue={selectedEmployeeForEdit?.admissionDate || '2026-09-01'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Chave Pix Pagamento</label>
                  <input
                    type="text"
                    name="pixKey"
                    defaultValue={selectedEmployeeForEdit?.pixKey || ''}
                    placeholder="CPF, celular ou email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nº Dependentes</label>
                  <input
                    type="number"
                    name="dependentsCount"
                    defaultValue={selectedEmployeeForEdit?.dependentsCount || 0}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Foto de Perfil Upload & URL */}
              <div>
                <ImageUploadField
                  label="Foto de Perfil do Colaborador"
                  name="avatar"
                  value={employeeAvatar}
                  onChange={(val) => setEmployeeAvatar(val)}
                  aspect="avatar"
                  helperText="Upload do computador/celular ou insira a URL da foto"
                />
              </div>

              {/* Section 2: Endereço Residencial */}
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pt-3 pb-1 border-b border-slate-200">
                2. Endereço Residencial
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    defaultValue={selectedEmployeeForEdit?.address.cep || '04538-133'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Rua / Logradouro</label>
                  <input
                    type="text"
                    name="street"
                    defaultValue={selectedEmployeeForEdit?.address.street || 'Rua Joaquim Floriano'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Número</label>
                  <input
                    type="text"
                    name="number"
                    defaultValue={selectedEmployeeForEdit?.address.number || '820'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Complemento</label>
                  <input
                    type="text"
                    name="complement"
                    defaultValue={selectedEmployeeForEdit?.address.complement || ''}
                    placeholder="Apto 101"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bairro</label>
                  <input
                    type="text"
                    name="neighborhood"
                    defaultValue={selectedEmployeeForEdit?.address.neighborhood || 'Itaim Bibi'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cidade / UF</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="city"
                      defaultValue={selectedEmployeeForEdit?.address.city || 'São Paulo'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      defaultValue={selectedEmployeeForEdit?.address.state || 'SP'}
                      className="w-16 px-2 py-2 border border-slate-300 rounded-xl focus:outline-none uppercase text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contato para Emergência */}
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pt-3 pb-1 border-b border-slate-200">
                3. Contato de Emergência
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nome do Contato *</label>
                  <input
                    type="text"
                    name="emergencyName"
                    required
                    defaultValue={selectedEmployeeForEdit?.emergencyContact.name || ''}
                    placeholder="Ex: Mariana Mendes"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grau de Parentesco</label>
                  <input
                    type="text"
                    name="emergencyRel"
                    defaultValue={selectedEmployeeForEdit?.emergencyContact.relationship || 'Cônjuge'}
                    placeholder="Cônjuge, Mãe, Pai, Irmão"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone de Emergência *</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    required
                    defaultValue={selectedEmployeeForEdit?.emergencyContact.phone || ''}
                    placeholder="(11) 99881-2233"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observações Médicas / Alergias</label>
                <input
                  type="text"
                  name="emergencyNotes"
                  defaultValue={selectedEmployeeForEdit?.emergencyContact.notes || ''}
                  placeholder="Ex: Alergia a medicamentos, tipo sanguíneo, etc."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: FICHA COMPLETA DO COLABORADOR */}
      {/* ======================================================== */}
      {selectedEmployeeForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">Ficha Cadastral do Colaborador</span>
              <button onClick={() => setSelectedEmployeeForView(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployeeForView.avatar}
                  alt={selectedEmployeeForView.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedEmployeeForView.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium">{selectedEmployeeForView.role}</p>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Depto: {selectedEmployeeForView.department} · {selectedEmployeeForView.contractType}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">CPF:</span>
                  <strong>{selectedEmployeeForView.cpf}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admissão:</span>
                  <span>{new Date(selectedEmployeeForView.admissionDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Salário / Remuneração:</span>
                  <strong className="text-emerald-700">R$ {selectedEmployeeForView.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chave Pix:</span>
                  <span className="font-mono">{selectedEmployeeForView.pixKey}</span>
                </div>
              </div>

              {/* Endereço */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Endereço Residencial
                </div>
                <div className="text-slate-700">
                  {selectedEmployeeForView.address.street}, {selectedEmployeeForView.address.number}
                  {selectedEmployeeForView.address.complement ? ` - ${selectedEmployeeForView.address.complement}` : ''}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {selectedEmployeeForView.address.neighborhood} - {selectedEmployeeForView.address.city} / {selectedEmployeeForView.address.state}
                </div>
                <div className="text-slate-400 font-mono text-[10px]">
                  CEP: {selectedEmployeeForView.address.cep}
                </div>
              </div>

              {/* Emergência */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950">
                <div className="font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1 text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Contato de Emergência
                </div>
                <div className="font-semibold">
                  {selectedEmployeeForView.emergencyContact.name} ({selectedEmployeeForView.emergencyContact.relationship})
                </div>
                <div className="text-[11px] font-mono mt-0.5">
                  Tel: {selectedEmployeeForView.emergencyContact.phone}
                </div>
                {selectedEmployeeForView.emergencyContact.notes && (
                  <div className="text-[10px] text-amber-800 mt-1 italic">
                    Obs: {selectedEmployeeForView.emergencyContact.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEmployeeForView(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: VISUALIZADOR & IMPRESSÃO OFICIAL DE HOLERITE */}
      {/* ======================================================== */}
      {selectedPayslipForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            {/* Modal Actions Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <span className="font-bold text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-400" />
                Demonstrativo de Pagamento de Salário / Holerite Oficial
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir / Salvar PDF
                </button>
                <button
                  onClick={() => setSelectedPayslipForPrint(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Brazilian Payslip Layout */}
            <div className="p-6 md:p-8 space-y-4 text-xs font-sans text-slate-900 bg-white">
              {/* Header Box */}
              <div className="border border-slate-300 rounded-lg p-3 grid grid-cols-2 gap-4">
                <div>
                  <div className="font-black text-sm uppercase">ACERTGO GESTÃO IMOBILIÁRIA LTDA</div>
                  <div className="text-[11px] text-slate-600">CNPJ: 12.345.678/0001-90 · CRECI-J: 45.678-SP</div>
                  <div className="text-[10px] text-slate-500">Av. Brigadeiro Faria Lima, 2800 - Jardins, São Paulo/SP</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">RECIBO DE PAGAMENTO DE SALÁRIO</div>
                  <div className="text-xs text-indigo-700 font-semibold">Referência: {selectedPayslipForPrint.monthYear}</div>
                  <div className="text-[10px] text-slate-500">Emissão: {new Date().toLocaleDateString('pt-BR')}</div>
                </div>
              </div>

              {/* Employee Info Box */}
              <div className="border border-slate-300 rounded-lg p-3 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Nome do Funcionário</span>
                  <strong className="text-slate-900 text-xs">{selectedPayslipForPrint.employeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Cargo / Função</span>
                  <strong className="text-slate-900">{selectedPayslipForPrint.role}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">CPF</span>
                  <strong className="font-mono">{selectedPayslipForPrint.cpf}</strong>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                      <th className="py-2 px-3">Cód.</th>
                      <th className="py-2 px-3">Descrição da Verba</th>
                      <th className="py-2 px-3 text-center">Referência</th>
                      <th className="py-2 px-3 text-right">Proventos (R$)</th>
                      <th className="py-2 px-3 text-right">Descontos (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {selectedPayslipForPrint.earnings.map((e, idx) => (
                      <tr key={`e_${idx}`}>
                        <td className="py-1.5 px-3 font-mono text-slate-500">{e.code}</td>
                        <td className="py-1.5 px-3 font-medium text-slate-900">{e.description}</td>
                        <td className="py-1.5 px-3 text-center text-slate-600">{e.reference || '-'}</td>
                        <td className="py-1.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {e.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-1.5 px-3 text-right font-mono text-slate-400">-</td>
                      </tr>
                    ))}
                    {selectedPayslipForPrint.deductions.map((d, idx) => (
                      <tr key={`d_${idx}`}>
                        <td className="py-1.5 px-3 font-mono text-slate-500">{d.code}</td>
                        <td className="py-1.5 px-3 font-medium text-slate-900">{d.description}</td>
                        <td className="py-1.5 px-3 text-center text-slate-600">{d.reference || '-'}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-slate-400">-</td>
                        <td className="py-1.5 px-3 text-right font-mono font-semibold text-rose-700">
                          {d.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Net Salary Banner */}
              <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 grid grid-cols-3 gap-4 items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Proventos</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    R$ {selectedPayslipForPrint.grossSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-600 uppercase font-bold block">Total Descontos</span>
                  <span className="text-sm font-bold text-rose-700 font-mono">
                    R$ {selectedPayslipForPrint.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right p-2 rounded-lg bg-emerald-100 border border-emerald-300">
                  <span className="text-[10px] text-emerald-800 uppercase font-black block">Líquido a Receber</span>
                  <span className="text-base font-black text-emerald-900 font-mono">
                    R$ {selectedPayslipForPrint.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Bases Box */}
              <div className="border border-slate-300 rounded-lg p-2.5 grid grid-cols-4 gap-2 text-[10px] text-center text-slate-600">
                <div>
                  <span className="block text-slate-400">Salário Base</span>
                  <strong className="text-slate-800">R$ {selectedPayslipForPrint.grossSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Base Cálc. INSS</span>
                  <strong className="text-slate-800">R$ {selectedPayslipForPrint.inssBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Base Cálc. FGTS</span>
                  <strong className="text-slate-800">R$ {selectedPayslipForPrint.fgtsBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">FGTS do Mês (8%)</span>
                  <strong className="text-slate-800">R$ {selectedPayslipForPrint.fgtsAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              {/* Receipt & Signature */}
              <div className="border border-dashed border-slate-300 rounded-lg p-4 mt-4 text-[10px] text-slate-500">
                <p>
                  Declaro ter recebido a quantia líquida discriminada neste recibo referente ao salário da competência informada, nada mais tendo a reclamar.
                </p>
                <div className="mt-8 pt-2 border-t border-slate-400 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span>____ / ____ / ________</span>
                    <span className="block text-slate-400 mt-0.5">Data do Pagamento</span>
                  </div>
                  <div>
                    <span className="font-semibold">{selectedPayslipForPrint.employeeName}</span>
                    <span className="block text-slate-400 mt-0.5">Assinatura do Colaborador</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: SOLICITAR FÉRIAS */}
      {/* ======================================================== */}
      {isVacationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">Solicitação de Férias / Ausência</span>
              <button onClick={() => setIsVacationModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const emp = employees.find(ep => ep.id === form.empId.value) || employees[0];
                const newVac: VacationAndLeaveRequest = {
                  id: `vac_${Date.now()}`,
                  employeeId: emp.id,
                  employeeName: emp.name,
                  department: emp.department,
                  type: form.type.value,
                  startDate: form.startDate.value,
                  endDate: form.endDate.value,
                  totalDays: parseInt(form.totalDays.value) || 20,
                  sellOneThird: form.sellOneThird.checked,
                  advanceThirteenth: form.advanceThirteenth.checked,
                  status: 'SOLICITADO',
                  requestedAt: new Date().toISOString(),
                  notes: form.notes.value
                };
                setVacations([newVac, ...vacations]);
                setIsVacationModalOpen(false);
                alert('Solicitação enviada para aprovação do gestor de RH!');
              }}
              className="p-5 space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Colaborador</label>
                <select name="empId" className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none">
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tipo de Ausência</label>
                <select name="type" className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none">
                  <option value="FERIAS">Férias Regulamentares</option>
                  <option value="FOLGA_COMPENSATORIA">Folga Compensatória (Plantão de Vendas)</option>
                  <option value="LICENCA_MEDICA">Licença Médica / Atestado</option>
                  <option value="LICENCA_MATERNIDADE_PATERNIDADE">Licença Maternidade / Paternidade</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Data Início</label>
                  <input type="date" name="startDate" required className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Data Retorno</label>
                  <input type="date" name="endDate" required className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Quantidade de Dias</label>
                <input type="number" name="totalDays" defaultValue={20} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none" />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="sellOneThird" className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                  <span className="text-slate-700 font-medium">Abono Pecuniário (Vender 10 dias / 1/3)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="advanceThirteenth" className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                  <span className="text-slate-700 font-medium">Adiantamento da 1ª Parcela do 13º Salário</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observações de Alinhamento</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Escala de cobertura de plantão ou detalhes do período..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <button type="button" onClick={() => setIsVacationModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs">
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

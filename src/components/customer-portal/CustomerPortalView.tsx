import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  Send, 
  User, 
  Building, 
  DollarSign, 
  Plus, 
  ChevronRight, 
  X, 
  Calendar, 
  Phone, 
  HelpCircle,
  TrendingUp,
  Receipt,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  Scale,
  BookOpen,
  Home
} from 'lucide-react';
import { 
  CustomerTicket, 
  CustomerTicketCategory, 
  RentalContract, 
  RentalInvoice, 
  RepasseSplitPayment 
} from '../../types/crm';
import { 
  INITIAL_RENTAL_CONTRACTS_FULL, 
  INITIAL_RENTAL_INVOICES, 
  INITIAL_REPASSE_SPLITS 
} from '../../data/mockLocacao';
import { INITIAL_CUSTOMER_TICKETS } from '../../data/mockCustomerPortal';
import { BoletoModal } from '../fintech/BoletoModal';
import { LegalFaqRightsAndDutiesView } from './LegalFaqRightsAndDutiesView';

interface CustomerPortalViewProps {
  initialRole?: 'INQUILINO' | 'PROPRIETARIO';
  embeddedInWebsite?: boolean;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  initialRole = 'INQUILINO',
  embeddedInWebsite = false,
}) => {
  const [userRole, setUserRole] = useState<'INQUILINO' | 'PROPRIETARIO'>(initialRole);
  const [activePortalTab, setActivePortalTab] = useState<'DASHBOARD' | 'FAQ_LEI'>('DASHBOARD');
  
  // Contracts and data
  const [contracts] = useState<RentalContract[]>(INITIAL_RENTAL_CONTRACTS_FULL);
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [invoices] = useState<RentalInvoice[]>(INITIAL_RENTAL_INVOICES);
  const [repasses] = useState<RepasseSplitPayment[]>(INITIAL_REPASSE_SPLITS);
  const [tickets, setTickets] = useState<CustomerTicket[]>(INITIAL_CUSTOMER_TICKETS);

  // Modals & Forms
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showMoveOutModal, setShowMoveOutModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedBoletoInvoice, setSelectedBoletoInvoice] = useState<RentalInvoice | null>(null);
  
  // Copy feedback
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedDigitable, setCopiedDigitable] = useState(false);

  // New ticket state
  const [ticketCategory, setTicketCategory] = useState<CustomerTicketCategory>('MANUTENCAO_HIDRAULICA');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketUrgency, setTicketUrgency] = useState<'BAIXA' | 'MEDIA' | 'URGENTE'>('MEDIA');

  // Move-out request state
  const [moveOutDate, setMoveOutDate] = useState('');
  const [moveOutReason, setMoveOutReason] = useState('Fim do prazo contratual');
  const [moveOutSuccess, setMoveOutSuccess] = useState(false);

  // Inspection request state
  const [inspectionType, setInspectionType] = useState<'INTERMEDIARIA' | 'SAIDA' | 'REPARO'>('INTERMEDIARIA');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionSuccess, setInspectionSuccess] = useState(false);

  const currentContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const currentInvoice = invoices.find(i => i.contractId === currentContract?.id) || invoices[0];
  const currentRepasse = repasses.find(r => r.contractId === currentContract?.id) || repasses[0];

  const handleCopyDigitable = (line: string) => {
    navigator.clipboard.writeText(line);
    setCopiedDigitable(true);
    setTimeout(() => setCopiedDigitable(false), 2000);
  };

  const handleCopyPix = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDesc.trim()) return;

    const newTicket: CustomerTicket = {
      id: `tkt_${Date.now()}`,
      contractCode: currentContract?.code || 'CTR-2024-001',
      propertyAddress: currentContract?.propertyAddress || 'Endereço do Imóvel',
      userType: userRole,
      userName: userRole === 'INQUILINO' ? currentContract?.tenantName || 'Inquilino' : currentContract?.ownerName || 'Proprietário',
      userPhone: currentContract?.tenantPhone || '(11) 98765-4321',
      category: ticketCategory,
      title: ticketTitle.trim(),
      description: ticketDesc.trim(),
      urgency: ticketUrgency,
      status: 'ABERTO',
      createdAt: new Date().toISOString(),
      estimatedCost: ticketCategory === 'MANUTENCAO_HIDRAULICA' ? 250 : ticketCategory === 'MANUTENCAO_ELETRICA' ? 320 : 0,
      ownerApproved: false,
    };

    setTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
    setTicketTitle('');
    setTicketDesc('');
  };

  const handleOwnerApproveBudget = (ticketId: string, approve: boolean) => {
    setTickets(tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          ownerApproved: approve,
          status: approve ? 'ORCAMENTO_APROVADO' : 'EM_ANALISE',
        };
      }
      return t;
    }));
  };

  return (
    <div className={`space-y-6 ${embeddedInWebsite ? 'p-2' : 'p-4 md:p-8 max-w-7xl mx-auto'}`}>
      {/* Header and Profile Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold font-heading">
                  Área do Cliente & Portal do Usuário
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Online
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Portal integrado de autosserviço para Inquilinos (Locatários) e Proprietários (Locadores)
              </p>
            </div>
          </div>
        </div>

        {/* Profile Mode Switcher Pill */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setUserRole('INQUILINO')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              userRole === 'INQUILINO'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sou Inquilino</span>
          </button>
          <button
            onClick={() => setUserRole('PROPRIETARIO')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              userRole === 'PROPRIETARIO'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Sou Proprietário</span>
          </button>
        </div>
      </div>

      {/* Contract Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              Contrato de Locação Selecionado
            </span>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="font-bold text-xs md:text-sm text-slate-800 bg-transparent outline-none cursor-pointer w-full max-w-full truncate block"
            >
              {contracts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} • {c.propertyAddress} ({userRole === 'INQUILINO' ? `Locatário: ${c.tenantName}` : `Proprietário: ${c.ownerName}`})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 whitespace-nowrap">
            Contrato {currentContract?.status || 'ATIVO'}
          </span>
          <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
            Venc. dia {currentContract?.dueDay || 10}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Painel do Usuário vs Tira-Dúvidas da Lei 8.245 */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePortalTab('DASHBOARD')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activePortalTab === 'DASHBOARD'
                ? userRole === 'INQUILINO'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Meu Painel & Imóvel</span>
          </button>

          <button
            onClick={() => setActivePortalTab('FAQ_LEI')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activePortalTab === 'FAQ_LEI'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Tira-Dúvidas da Lei (Direitos & Deveres)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
              Lei 8.245/91
            </span>
          </button>
        </div>

        <button
          onClick={() => setActivePortalTab('FAQ_LEI')}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 pb-2 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Obrigações Inquilino vs Proprietário</span>
        </button>
      </div>

      {/* Render Legal FAQ View when activePortalTab === 'FAQ_LEI' */}
      {activePortalTab === 'FAQ_LEI' && (
        <LegalFaqRightsAndDutiesView
          userRole={userRole}
          onOpenTicketWithQuestion={(questionText) => {
            setTicketTitle(`Dúvida Lei 8.245: ${questionText.slice(0, 45)}`);
            setTicketDesc(`Gostaria de esclarecimentos sobre a regra da Lei do Inquilinato: ${questionText}`);
            setActivePortalTab('DASHBOARD');
            setShowNewTicketModal(true);
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. VISÃO DO INQUILINO / LOCATÁRIO */}
      {/* ------------------------------------------------------------- */}
      {activePortalTab === 'DASHBOARD' && userRole === 'INQUILINO' && (
        <div className="space-y-6">
          {/* Top Quick Actions for Tenant */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => setSelectedBoletoInvoice(currentInvoice)}
              className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all text-left shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <strong className="text-xs md:text-sm font-bold text-slate-900 block">2ª Via de Boleto</strong>
              <span className="text-[11px] text-slate-500">Linha digitável e PIX</span>
            </button>

            <button
              onClick={() => setShowNewTicketModal(true)}
              className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all text-left shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <strong className="text-xs md:text-sm font-bold text-slate-900 block">Abrir Chamado</strong>
              <span className="text-[11px] text-slate-500">Manutenção e reparos</span>
            </button>

            <button
              onClick={() => setShowInspectionModal(true)}
              className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all text-left shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <strong className="text-xs md:text-sm font-bold text-slate-900 block">Solicitar Vistoria</strong>
              <span className="text-[11px] text-slate-500">Conferência e laudo</span>
            </button>

            <button
              onClick={() => setShowMoveOutModal(true)}
              className="p-4 bg-white hover:bg-rose-50/50 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all text-left shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <KeyRound className="w-5 h-5" />
              </div>
              <strong className="text-xs md:text-sm font-bold text-slate-900 block">Devolver Imóvel</strong>
              <span className="text-[11px] text-slate-500">Aviso prévio e chaves</span>
            </button>

            <button
              onClick={() => setActivePortalTab('FAQ_LEI')}
              className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl border border-indigo-200 hover:border-indigo-300 transition-all text-left shadow-2xs group col-span-2 sm:col-span-1"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <strong className="text-xs md:text-sm font-bold text-indigo-950 block">Tira-Dúvidas Lei</strong>
              <span className="text-[11px] text-indigo-700">Quem paga? Lei 8.245</span>
            </button>
          </div>

          {/* Banner Destaque do Tira-Dúvidas Jurídico */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">
                  Dúvidas sobre consertos, vazamentos ou taxas do condomínio?
                </h4>
                <p className="text-[11px] text-slate-300">
                  Consulte o guia interativo de Direitos e Deveres conforme a Lei do Inquilinato nº 8.245/91.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePortalTab('FAQ_LEI')}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver Guia da Lei</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current Rent Invoice & Instant Payment Banner */}
          {currentInvoice && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-800 uppercase tracking-wider">
                    Fatura Atual de Aluguel • Competência {currentInvoice.competenceMonth}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-1">
                    Vencimento em {new Date(currentInvoice.dueDate).toLocaleDateString('pt-BR')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Boleto registrado com liquidação instantânea via PIX Copia e Cola 24/7
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Valor Total</span>
                  <span className="text-2xl md:text-3xl font-black text-slate-900">
                    {currentInvoice.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Aluguel</span>
                  <strong className="text-slate-800 font-bold">{currentInvoice.rentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Condomínio</span>
                  <strong className="text-slate-800 font-bold">{currentInvoice.condoAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">IPTU</span>
                  <strong className="text-slate-800 font-bold">{currentInvoice.iptuAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Seguro Fiança</span>
                  <strong className="text-slate-800 font-bold">{(currentInvoice.insuranceAmount || 180).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
              </div>

              {/* Actions & Copy Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => handleCopyPix(currentInvoice.pixCopyPaste || '00020126580014br.gov.bcb.pix0136locacao-imobiliaria-asaas-qrcode')}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  {copiedPix ? <Check className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                  <span>{copiedPix ? 'Código PIX Copiado!' : 'Copiar PIX Copia e Cola'}</span>
                </button>

                <button
                  onClick={() => handleCopyDigitable(currentInvoice.barcodeNumber || '34191.09008 00000.123456 78900.123456 1 95000000320000')}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedDigitable ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedDigitable ? 'Linha Copiada!' : 'Copiar Linha Digitável'}</span>
                </button>

                <button
                  onClick={() => setSelectedBoletoInvoice(currentInvoice)}
                  className="py-3 px-5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Boleto em PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Chamados & Ocorrências do Inquilino */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  Chamados de Manutenção & Ocorrências
                </h3>
                <p className="text-xs text-slate-500">
                  Acompanhe em tempo real o envio de orçamentos, aprovações e agendamento de técnicos
                </p>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Chamado</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {tickets.filter(t => t.contractCode === currentContract?.code || t.userType === 'INQUILINO').map(ticket => (
                <div key={ticket.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{ticket.title}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        ticket.urgency === 'URGENTE' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.urgency}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{ticket.description}</p>
                    <span className="text-[11px] text-slate-400">
                      Aberto em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')} por {ticket.userName}
                    </span>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    {ticket.estimatedCost ? (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Orçamento Estimado</span>
                        <strong className="text-xs font-bold text-slate-800">
                          {ticket.estimatedCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                        <span className={`block text-[10px] font-bold mt-0.5 ${ticket.ownerApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {ticket.ownerApproved ? '✓ Aprovado pelo Proprietário' : '⏳ Aguardando Aprovação'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Em avaliação técnica</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. VISÃO DO PROPRIETÁRIO / LOCADOR */}
      {/* ------------------------------------------------------------- */}
      {activePortalTab === 'DASHBOARD' && userRole === 'PROPRIETARIO' && (
        <div className="space-y-6">
          {/* Banner Destaque do Tira-Dúvidas Jurídico para o Proprietário */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">
                  O que é dever do proprietário e do inquilino pela Lei nº 8.245?
                </h4>
                <p className="text-[11px] text-slate-300">
                  Consulte os Artigos 22 e 23: Fundo de Reserva, obras estruturais e despesas extraordinárias do condomínio.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePortalTab('FAQ_LEI')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Acessar Guia da Lei</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Owner Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Último Repasse Líquido
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {(currentRepasse?.netRepasseAmount || 2880).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Creditado via PIX
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Status do Pagamento do Inquilino
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                Em Dia
              </div>
              <span className="text-xs text-emerald-600 font-bold mt-1 block">
                Fatura de {currentInvoice?.competenceMonth || 'Setembro/2026'} Liquidada
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Orçamentos Pendentes de Decisão
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {tickets.filter(t => !t.ownerApproved && t.estimatedCost && t.estimatedCost > 0).length}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Solicitações de manutenção para aprovar
              </span>
            </div>
          </div>

          {/* Repasse Extrato & Split de Herdeiros */}
          {currentRepasse && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    Extrato de Repasse de Aluguel • {currentRepasse.competenceMonth}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-1">
                    Discriminação Contábil e Split de Distribuição
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparência total dos valores retidos e do montante líquido transferido
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Repasse Líquido Total</span>
                  <span className="text-2xl font-black text-emerald-700">
                    {currentRepasse.netRepasseAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Deductions calculation line */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Cobrado</span>
                  <strong className="text-slate-800">{currentRepasse.totalCollected.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Taxa Adm ({currentRepasse.adminFeePercent}%)</span>
                  <strong className="text-rose-600 font-bold">- {currentRepasse.adminFeeAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Deduções / IPTU</span>
                  <strong className="text-slate-800 font-bold">- {(currentRepasse.deductionsAmount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Data de Liquidação</span>
                  <strong className="text-emerald-700 font-bold">{currentRepasse.settledAt ? new Date(currentRepasse.settledAt).toLocaleDateString('pt-BR') : 'Programado'}</strong>
                </div>
              </div>

              {/* Split Beneficiaries (Herdeiros / Coproprietários) */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Distribuição para Coproprietários e Herdeiros (Split Automático):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentRepasse.beneficiariesPayout.map(ben => (
                    <div key={ben.beneficiaryId} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-slate-900">{ben.name}</strong>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {ben.percent}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{ben.relationship} • CPF: {ben.cpfCnpj}</p>
                      <div className="pt-2 flex justify-between items-baseline border-t border-slate-200/60 mt-1">
                        <span className="text-[10px] text-slate-400 font-mono">{ben.pixKey}</span>
                        <strong className="text-xs font-black text-emerald-700">
                          {ben.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Aprovação de Orçamentos de Manutenção pelo Proprietário */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-blue-600" />
              Solicitações de Orçamento de Manutenção para Decisão
            </h3>
            <p className="text-xs text-slate-500">
              Aprove ou recuse os orçamentos de reparos estruturais solicitados pelos locatários
            </p>

            <div className="divide-y divide-slate-100">
              {tickets.filter(t => t.estimatedCost && t.estimatedCost > 0).map(ticket => (
                <div key={ticket.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{ticket.title}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                        {ticket.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{ticket.description}</p>
                    <span className="text-[11px] text-slate-400">
                      Imóvel: {ticket.propertyAddress} • Solicitado em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Valor Cotado</span>
                      <strong className="text-sm font-black text-slate-900">
                        {ticket.estimatedCost?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
                    </div>

                    {ticket.ownerApproved ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovado</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOwnerApproveBudget(ticket.id, true)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Aprovar Reparo</span>
                        </button>
                        <button
                          onClick={() => handleOwnerApproveBudget(ticket.id, false)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>Recusar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Chamado */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Abrir Chamado de Manutenção</h3>
              </div>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Categoria do Reparo</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="MANUTENCAO_HIDRAULICA">Hidráulica (Vazamento, Torneira, Sifão)</option>
                  <option value="MANUTENCAO_ELETRICA">Elétrica (Disjuntor, Tomadas, Fiação)</option>
                  <option value="INFILTRACAO">Infiltração / Umidade em Parede</option>
                  <option value="VISTORIA">Vistoria / Conferência de Obra</option>
                  <option value="OUTROS">Outras Ocorrências</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título da Ocorrência *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Torneira do banheiro principal com vazamento constante"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Urgência</label>
                <select
                  value={ticketUrgency}
                  onChange={(e) => setTicketUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                >
                  <option value="BAIXA">Baixa (Pode aguardar visita programada)</option>
                  <option value="MEDIA">Média (Reparo necessário nos próximos dias)</option>
                  <option value="URGENTE">Urgente (Risco de dano ao imóvel ou corte de serviço)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição Detalhada do Problema *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva quando começou o problema, localização exata dentro do imóvel..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Chamado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Entrega de Imóvel */}
      {showMoveOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Aviso Prévio de Desocupação</h3>
              </div>
              <button onClick={() => setShowMoveOutModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {moveOutSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900">Aviso Prévio Registrado com Sucesso!</h4>
                <p className="text-xs text-slate-500">
                  Nossa equipe de rescisão entrará em contato para agendar a vistoria de saída e orientar sobre a entrega de chaves.
                </p>
                <button
                  onClick={() => { setShowMoveOutModal(false); setMoveOutSuccess(false); }}
                  className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                  <p className="font-semibold">Aviso Prévio Legal de 30 Dias (Lei 8.245/91):</p>
                  <p className="text-[11px] mt-0.5">
                    O locatário deverá conceder 30 dias de aviso prévio e entregar o imóvel pintado no mesmo padrão do laudo inicial.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Prevista da Desocupação *</label>
                  <input
                    type="date"
                    required
                    value={moveOutDate}
                    onChange={(e) => setMoveOutDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motivo da Saída</label>
                  <select
                    value={moveOutReason}
                    onChange={(e) => setMoveOutReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                  >
                    <option value="Fim do prazo contratual">Fim do prazo contratual</option>
                    <option value="Compra de imóvel próprio">Compra de imóvel próprio</option>
                    <option value="Mudança de cidade ou estado">Mudança de cidade ou estado</option>
                    <option value="Necessidade de espaço maior">Necessidade de espaço maior</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMoveOutModal(false)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoveOutSuccess(true)}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirmar Aviso Prévio</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Solicitar Vistoria */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Solicitar Vistoria no Imóvel</h3>
              </div>
              <button onClick={() => setShowInspectionModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inspectionSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900">Agendamento Solicitado!</h4>
                <p className="text-xs text-slate-500">
                  O vistoriador credenciado entrará em contato para confirmar o horário exato da visita técnica.
                </p>
                <button
                  onClick={() => { setShowInspectionModal(false); setInspectionSuccess(false); }}
                  className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Finalidade da Vistoria</label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                  >
                    <option value="INTERMEDIARIA">Vistoria Intermediária (Acompanhamento Anual)</option>
                    <option value="REPARO">Conferência de Reparo ou Benfeitoria</option>
                    <option value="SAIDA">Vistoria Final de Saída / Desocupação</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Preferencial para Visita *</label>
                  <input
                    type="date"
                    required
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInspectionModal(false)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectionSuccess(true)}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar Vistoria</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Boleto PDF / Linha Digitável Modal */}
      {selectedBoletoInvoice && (
        <BoletoModal
          invoice={selectedBoletoInvoice}
          isOpen={!!selectedBoletoInvoice}
          onClose={() => setSelectedBoletoInvoice(null)}
          onMarkAsPaid={() => {}}
        />
      )}
    </div>
  );
};

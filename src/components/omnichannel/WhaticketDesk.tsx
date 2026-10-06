import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Send, 
  Mic, 
  Paperclip, 
  Eye, 
  EyeOff, 
  Lock, 
  ShieldAlert, 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  CheckCheck, 
  FileText, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Plus, 
  MoreVertical,
  ChevronRight,
  ArrowLeft,
  Info,
  X,
  UserCheck,
  Tag
} from 'lucide-react';
import { Lead, ChatMessage, LeadFunnelStage, UserProfile } from '../../types/crm';
import { askAcertAiSdr } from '../../services/aiService';

interface WhaticketDeskProps {
  leads: Lead[];
  chatMessages: Record<string, ChatMessage[]>;
  currentUser: UserProfile;
  onSendMessage: (leadId: string, text: string, isWhisper: boolean) => void;
  onChangeStage: (leadId: string, newStage: LeadFunnelStage, lossReason?: string) => void;
}

export const WhaticketDesk: React.FC<WhaticketDeskProps> = ({
  leads,
  chatMessages,
  currentUser,
  onSendMessage,
  onChangeStage,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');
  const [isGhostWhisperMode, setIsGhostWhisperMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Mobile responsive views: 'list' (conversation feed) vs 'chat' (active chat)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  // Right dossier drawer toggle on tablets & mobile
  const [showDossierDrawer, setShowDossierDrawer] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const messages = (selectedLead ? chatMessages[selectedLead.id] : []) || [];

  const isManagerOrAdmin = currentUser.role === 'MASTER_ADMIN' || currentUser.role === 'MANAGER';

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone.includes(searchTerm) ||
    l.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setMobileView('chat');
  };

  const handleSend = () => {
    if (!inputText.trim() || !selectedLead) return;
    onSendMessage(selectedLead.id, inputText, isGhostWhisperMode);
    setInputText('');
  };

  const handleAcertAiSuggest = async () => {
    if (!selectedLead) return;
    setAiGenerating(true);
    const lastClientMsg = [...messages].reverse().find(m => m.sender === 'LEAD')?.text || 'Olá, quero mais informações do imóvel';
    const suggestion = await askAcertAiSdr(lastClientMsg, `${selectedLead.name} interessado em ${selectedLead.propertyOfInterestTitle}`);
    setInputText(suggestion);
    setAiGenerating(false);
  };

  const stageOptions: { value: LeadFunnelStage; label: string }[] = [
    { value: 'NOVO_LEAD', label: 'Novo Lead' },
    { value: 'PRIMEIRO_CONTATO', label: '1º Contato' },
    { value: 'QUALIFICACAO', label: 'Qualificação' },
    { value: 'VISITA_AGENDADA', label: 'Visita Agendada' },
    { value: 'VISITA_REALIZADA', label: 'Visita Realizada' },
    { value: 'PROPOSTA_ENVIADA', label: 'Proposta Enviada' },
    { value: 'FECHAMENTO_GANHO', label: 'Fechado Ganho' },
    { value: 'FECHAMENTO_PERDIDO', label: 'Perdido' },
  ];

  // Lead Dossier Content Component
  const dossierContent = selectedLead && (
    <div className="flex flex-col h-full space-y-4 p-4 text-xs overflow-y-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="font-bold text-slate-900 font-heading text-sm">Dossiê 360 do Cliente</span>
        <button
          onClick={() => setShowDossierDrawer(false)}
          className="xl:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Profile Card */}
      <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-200/70">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
            {selectedLead.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 truncate">{selectedLead.name}</h4>
            <p className="text-[11px] text-slate-500 font-mono">{selectedLead.phone}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Interesse:</span>
            <span className="font-semibold text-slate-800">{selectedLead.interestType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Orçamento:</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              R$ {(selectedLead.budgetMin / 1000).toLocaleString('pt-BR')}k - {(selectedLead.budgetMax / 1000).toLocaleString('pt-BR')}k
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Origem:</span>
            <span className="font-semibold text-blue-700">
              {selectedLead.source === 'PASSAGEM_STAND' ? 'Passagem Stand' :
               selectedLead.source === 'VISITA_IMOBILIARIA' ? 'Visita na Imobiliária' :
               selectedLead.source.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Tags & Segmentação
        </span>
        <div className="flex flex-wrap gap-1">
          {selectedLead.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="flex-1 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Timeline de Atendimento
        </span>
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-200">
          {selectedLead.timeline.map((item) => (
            <div key={item.id} className="relative pl-6 space-y-0.5">
              <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></div>
              <span className="text-[11px] font-bold text-slate-900 block leading-tight">{item.title}</span>
              <p className="text-[10px] text-slate-500 leading-snug">{item.description}</p>
              <span className="text-[9px] text-slate-400 font-mono block">{item.timestamp} · {item.authorName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem-3.5rem)] lg:h-[calc(100vh-4rem)] flex bg-slate-100 overflow-hidden select-none relative">
      {/* 1. Left Column: Multi-Agent Conversations List */}
      <div 
        className={`w-full md:w-72 lg:w-80 xl:w-88 bg-white border-r border-slate-200 flex flex-col shrink-0 ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search & Filter Header */}
        <div className="p-3 border-b border-slate-100 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 font-heading">Multi-Atendimento</span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              WhatsApp Conectado
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar conversa ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredLeads.map((lead) => {
            const isSelected = lead.id === selectedLeadId;
            return (
              <div
                key={lead.id}
                onClick={() => handleSelectLead(lead.id)}
                className={`p-3 cursor-pointer transition-colors flex items-start gap-2.5 ${
                  isSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                    {lead.name.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">{lead.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{lead.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{lead.lastMessageText}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-semibold text-blue-700 bg-blue-100/60 px-1.5 py-0.2 rounded">
                      {lead.assignedBrokerName}
                    </span>
                    {lead.unreadMessagesCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                        {lead.unreadMessagesCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Center Column: Active Chat Feed */}
      <div 
        className={`flex-1 flex flex-col bg-slate-50 min-w-0 overflow-hidden ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {selectedLead ? (
          <>
            {/* Chat Header */}
            <div className="h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Back button on mobile */}
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
                  title="Voltar para lista de conversas"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                  {selectedLead.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{selectedLead.name}</h3>
                    <span className="text-[10px] text-emerald-600 hidden sm:inline">● Online</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    Corretor: <strong>{selectedLead.assignedBrokerName}</strong>
                  </p>
                </div>
              </div>

              {/* Chat Header Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Stage Selector Dropdown */}
                <select
                  value={selectedLead.stage}
                  onChange={(e) => onChangeStage(selectedLead.id, e.target.value as LeadFunnelStage)}
                  className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-2 py-1 outline-hidden cursor-pointer max-w-[110px] sm:max-w-none"
                >
                  {stageOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* Ghost Whisper Mode Toggle (Only for Managers / Admins) */}
                {isManagerOrAdmin && (
                  <button
                    onClick={() => setIsGhostWhisperMode(!isGhostWhisperMode)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                      isGhostWhisperMode
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                    title="Modo Fantasma: O cliente NÃO enxerga mensagens enviadas com esta trava ativada"
                  >
                    {isGhostWhisperMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isGhostWhisperMode ? 'Sussurro Ativo' : 'Fantasma'}</span>
                  </button>
                )}

                {/* Toggle Dossier Drawer on Tablets / Mobile */}
                <button
                  onClick={() => setShowDossierDrawer(!showDossierDrawer)}
                  className="xl:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
                  title="Ver Dossiê do Cliente"
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* Close Active Chat button */}
                <button
                  onClick={() => {
                    setSelectedLeadId('');
                    setMobileView('list');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                  title="Fechar conversa atual"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ghost Mode Alert Banner if active */}
            {isGhostWhisperMode && (
              <div className="bg-amber-100/90 border-b border-amber-300 px-3 py-1.5 text-[11px] font-bold text-amber-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Modo Fantasma Ativo: Mensagens enviadas agora são SUSSURROS INTERNOS invisíveis ao cliente.</span>
                </div>
                <button
                  onClick={() => setIsGhostWhisperMode(false)}
                  className="text-amber-800 hover:underline shrink-0 text-[10px]"
                >
                  Desativar
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {messages.map((msg) => {
                const isClient = msg.sender === 'LEAD';
                const isWhisper = msg.isWhisperNote;

                if (isWhisper) {
                  return (
                    <div key={msg.id} className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 space-y-1 my-2">
                      <div className="flex items-center justify-between font-bold text-[10px] text-amber-800 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Sussurro de Supervisão (Invisível ao Cliente)
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-medium text-slate-800">{msg.text}</p>
                      <span className="text-[9px] text-amber-700 font-mono block">Enviado por: {msg.senderName}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs space-y-1 shadow-2xs ${
                        isClient
                          ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                          : 'bg-blue-600 text-white rounded-tr-xs'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 text-[9px] ${isClient ? 'text-slate-400' : 'text-blue-100'}`}>
                        <span>{msg.timestamp}</span>
                        {!isClient && <CheckCheck className="w-3 h-3 text-blue-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2 sm:p-3 bg-white border-t border-slate-200 shrink-0 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAcertAiSuggest}
                  disabled={aiGenerating}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 shrink-0"
                  title="Sugerir Resposta de Alta Conversão via AcertAI"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-blue-600 ${aiGenerating ? 'animate-spin' : ''}`} />
                  <span className="hidden xs:inline">Sugerir com IA</span>
                </button>
                <span className="text-[10px] text-slate-400 truncate">
                  {isGhostWhisperMode ? 'Sussurrando para o corretor...' : 'Respondendo no WhatsApp do cliente'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={isGhostWhisperMode ? 'Digite o sussurro interno para orientar o corretor...' : 'Digite sua mensagem para o cliente...'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="p-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Selecione uma conversa ao lado para começar o atendimento.
          </div>
        )}
      </div>

      {/* 3. Right Column: Lead Dossier (Docked on xl screens) */}
      <div className="hidden xl:flex w-80 bg-white border-l border-slate-200 flex-col shrink-0">
        {dossierContent}
      </div>

      {/* 4. Slide-over Dossier Drawer for Mobile / Tablet */}
      {showDossierDrawer && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs"
            onClick={() => setShowDossierDrawer(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white shadow-2xl h-full z-10 animate-in slide-in-from-right duration-200">
            {dossierContent}
          </div>
        </div>
      )}
    </div>
  );
};

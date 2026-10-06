import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Send, 
  Mail, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Phone, 
  Search, 
  QrCode,
  ShieldCheck, 
  RefreshCw, 
  Sliders,
  Edit2,
  Plus,
  Trash2,
  X,
  FileText,
  Layers,
  ArrowRight,
  Eye,
  Settings
} from 'lucide-react';
import { 
  SystemMessageTemplate, 
  MessageCategory, 
  MessageChannel, 
  RecipientType,
  COMMON_TEMPLATE_VARIABLES,
  INITIAL_SYSTEM_COMMUNICATION_TEMPLATES,
  renderTemplateText
} from '../../types/communicationTemplates';
import {
  getInitialCommunicationTemplates,
  saveCommunicationTemplatesToCloud,
  subscribeCommunicationTemplatesFromCloud
} from '../../services/systemPersistenceService';
import { ClientNotificationLog, INITIAL_CLIENT_NOTIFICATIONS } from '../../data/mockRentalFintechData';

export const ClientNotificationsCenterView: React.FC = () => {
  // Main view tab: Operacional vs Parametrização Central
  const [activeTab, setActiveTab] = useState<'REGUA_OPERACIONAL' | 'PARAMETRIZACAO'>('REGUA_OPERACIONAL');

  // Communication templates loaded from persistence (Cloud Firestore + Local Cache)
  const [templates, setTemplates] = useState<SystemMessageTemplate[]>(getInitialCommunicationTemplates);

  // Subscribe to real-time changes
  useEffect(() => {
    const unsub = subscribeCommunicationTemplatesFromCloud((updatedTemplates) => {
      if (updatedTemplates && updatedTemplates.length > 0) {
        setTemplates(updatedTemplates);
      }
    });
    return () => unsub();
  }, []);

  // Notification logs
  const [logs, setLogs] = useState<ClientNotificationLog[]>(INITIAL_CLIENT_NOTIFICATIONS);

  // Simulator / test dispatch states
  const [selectedTrigger, setSelectedTrigger] = useState<string>('AVISO_VENCIMENTO_D5');
  const [targetPhone, setTargetPhone] = useState('(11) 98765-4321');
  const [targetName, setTargetName] = useState('Lucas Ferraz Medeiros');
  const [targetRent, setTargetRent] = useState(6500);
  const [targetDueDay, setTargetDueDay] = useState('10/10/2026');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentToast, setTestSentToast] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Template Editing & Parametrization State
  const [editingTemplate, setEditingTemplate] = useState<SystemMessageTemplate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Find active template for the selected trigger
  const activeTemplate = useMemo(() => {
    return templates.find(t => t.triggerKey === selectedTrigger) || templates[0] || INITIAL_SYSTEM_COMMUNICATION_TEMPLATES[0];
  }, [templates, selectedTrigger]);

  // Variables mapping for simulation
  const simulationVariables = useMemo(() => {
    const rentNum = targetRent || 6500;
    const adminFee = rentNum * 0.1;
    const netRepasse = rentNum - adminFee;
    const totalCob = rentNum + 650 + 190; // aluguel + cond + iptu

    return {
      NOME_CLIENTE: targetName || 'Lucas Ferraz Medeiros',
      VALOR_ALUGUEL: rentNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      VALOR_TOTAL_COBRANCA: totalCob.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      DATA_VENCIMENTO: targetDueDay || '10/10/2026',
      DIAS_RESTANTES: '5 dias',
      CODIGO_IMOVEL: 'IMO-101',
      ENDERECO_IMOVEL: 'Rua Oscar Freire, 1420 - Ap 82, Jardins, São Paulo/SP',
      CHAVE_PIX: `00020126580014br.gov.bcb.pix0136locacao-fatura-904@acertgo.com.br520400005303986540${rentNum}.005802BR5925AcertGo Imoveis Gestao6009Sao Paulo62070503***6304E8A1`,
      LINK_BOLETO: 'https://acertgo.com.br/boletos/bol_90412.pdf',
      LINK_PORTAL: 'https://acertgo.com.br/portal-cliente',
      INDICE_REAJUSTE: 'IPCA acumulado (+4,18%)',
      VALOR_REPASSE_LIQUIDO: netRepasse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      TAXA_ADMINISTRACAO: `10% (${adminFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
      NOME_IMOBILIARIA: 'AcertGo Gestão Imobiliária & Locações',
      TELEFONE_CONTATO: '(11) 98844-3322'
    };
  }, [targetName, targetRent, targetDueDay]);

  // Current rendered message text for the simulator
  const simulatedMessageText = useMemo(() => {
    if (!activeTemplate) return '';
    return renderTemplateText(activeTemplate.bodyTemplate, simulationVariables);
  }, [activeTemplate, simulationVariables]);

  // Live preview for editing modal
  const editingSimulatedPreview = useMemo(() => {
    if (!editingTemplate) return '';
    return renderTemplateText(editingTemplate.bodyTemplate, simulationVariables);
  }, [editingTemplate, simulationVariables]);

  // Filtered templates list for the Hub
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      if (categoryFilter !== 'TODAS' && t.category !== categoryFilter) {
        return false;
      }
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesKey = t.triggerKey.toLowerCase().includes(query);
        const matchesSubject = t.subject?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesKey && !matchesSubject) return false;
      }
      return true;
    });
  }, [templates, categoryFilter, searchFilter]);

  // Send Test Notification Handler
  const handleSendTestNotification = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      const newLog: ClientNotificationLog = {
        id: `notif_${Date.now()}`,
        recipientType: activeTemplate.recipientType as any,
        recipientName: targetName,
        recipientPhone: targetPhone,
        recipientEmail: 'cliente@exemplo.com.br',
        contractCode: 'LOC-2026-TESTE',
        triggerType: activeTemplate.triggerKey as any,
        channel: activeTemplate.channel,
        subject: activeTemplate.subject || activeTemplate.title,
        messagePreview: simulatedMessageText.slice(0, 110) + '...',
        sentAt: new Date().toISOString(),
        deliveryStatus: 'LIDO',
        pixCodeIncluded: simulatedMessageText.includes('Chave Pix')
      };

      setLogs(prev => [newLog, ...prev]);
      setIsSendingTest(false);
      setTestSentToast(true);
      setTimeout(() => setTestSentToast(false), 3500);
    }, 600);
  };

  // Open Edit Template Modal
  const handleOpenEditModal = (template: SystemMessageTemplate) => {
    setEditingTemplate({ ...template });
    setIsEditModalOpen(true);
  };

  // Open Create New Template Modal
  const handleOpenCreateModal = () => {
    const newTpl: SystemMessageTemplate = {
      id: `custom_msg_tpl_${Date.now()}`,
      triggerKey: `CUSTOM_TRIGGER_${Date.now().toString().slice(-4)}`,
      category: 'LOCACAO',
      title: 'Novo Modelo de Notificação Personalizado',
      description: 'Modelo de mensagem configurado pela imobiliária',
      channel: 'WHATSAPP',
      recipientType: 'INQUILINO',
      subject: 'Comunicado da Imobiliária - Imóvel {{CODIGO_IMOVEL}}',
      bodyTemplate: `Olá, *{{NOME_CLIENTE}}*!\n\nEsperamos que esteja bem.\n\nInformamos que seu aluguel vence em *{{DATA_VENCIMENTO}}* no valor de *{{VALOR_ALUGUEL}}*.\n\nQualquer dúvida, fale conosco: {{TELEFONE_CONTATO}}.\n_{{NOME_IMOBILIARIA}}_`,
      availableVariables: COMMON_TEMPLATE_VARIABLES,
      isActive: true,
      isCustomCreated: true,
      version: '1.0',
      updatedAt: new Date().toISOString()
    };
    setEditingTemplate(newTpl);
    setIsEditModalOpen(true);
  };

  // Save Template (Create or Update)
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    const isExisting = templates.some(t => t.id === editingTemplate.id);
    const updatedItem: SystemMessageTemplate = {
      ...editingTemplate,
      version: isExisting ? (parseFloat(editingTemplate.version || '1.0') + 0.1).toFixed(1) : '1.0',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Gestor da Imobiliária'
    };

    let updatedList: SystemMessageTemplate[];
    if (isExisting) {
      updatedList = templates.map(t => t.id === editingTemplate.id ? updatedItem : t);
      showToast(`Modelo "${updatedItem.title}" salvo com sucesso! (v${updatedItem.version})`);
    } else {
      updatedList = [updatedItem, ...templates];
      showToast(`Novo modelo "${updatedItem.title}" cadastrado com sucesso!`);
    }

    setTemplates(updatedList);
    saveCommunicationTemplatesToCloud(updatedList);
    setIsEditModalOpen(false);
    setEditingTemplate(null);
  };

  // Delete Template (Only custom created)
  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este modelo de notificação?')) {
      const filtered = templates.filter(t => t.id !== templateId);
      setTemplates(filtered);
      saveCommunicationTemplatesToCloud(filtered);
      showToast('Modelo de notificação removido.');
    }
  };

  // Reset Single Template to System Default
  const handleResetSingleTemplate = (triggerKey: string) => {
    const defaultTpl = INITIAL_SYSTEM_COMMUNICATION_TEMPLATES.find(t => t.triggerKey === triggerKey);
    if (!defaultTpl) return;

    if (window.confirm(`Deseja restaurar as mensagens originais de "${defaultTpl.title}"?`)) {
      const updatedList = templates.map(t => t.triggerKey === triggerKey ? { ...defaultTpl, updatedAt: new Date().toISOString() } : t);
      setTemplates(updatedList);
      saveCommunicationTemplatesToCloud(updatedList);
      showToast(`Modelo "${defaultTpl.title}" restaurado para o padrão do sistema!`);
    }
  };

  // Reset All Templates to Factory Defaults
  const handleResetAllToDefaults = () => {
    if (window.confirm('Deseja restaurar TODOS os modelos de mensagens e notificações para o padrão oficial do sistema?')) {
      setTemplates(INITIAL_SYSTEM_COMMUNICATION_TEMPLATES);
      saveCommunicationTemplatesToCloud(INITIAL_SYSTEM_COMMUNICATION_TEMPLATES);
      showToast('Todos os modelos de comunicação foram restaurados para o padrão oficial!');
    }
  };

  // Helper to insert dynamic tag into textarea
  const handleInsertTag = (tagKey: string) => {
    if (!editingTemplate) return;
    setEditingTemplate(prev => {
      if (!prev) return null;
      return {
        ...prev,
        bodyTemplate: `${prev.bodyTemplate} {{${tagKey}}}`
      };
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {testSentToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Notificação de teste disparada para {targetPhone}!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase bg-purple-500/30 text-purple-300 border border-purple-400/40 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-purple-300" />
                CENTRAL DE COMUNICAÇÃO & LOCAÇÃO
              </span>
              <span className="text-xs text-slate-300 font-mono">WhatsApp • E-mail • SMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
              Notificações ao Cliente & Parametrização de Modelos
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Personalize o tom de voz da sua imobiliária, configure os disparos automáticos de vencimento com Pix Copia e Cola, avisos de reajuste anual, vistorias e repasses aos proprietários. Cada imobiliária é livre para definir seus próprios modelos.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Modelo de Mensagem</span>
            </button>

            <button
              onClick={handleResetAllToDefaults}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 cursor-pointer"
              title="Restaurar todos os modelos para o padrão do sistema"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Padrões</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('REGUA_OPERACIONAL')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'REGUA_OPERACIONAL'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Régua Operacional & Disparos</span>
          </button>
          <button
            onClick={() => setActiveTab('PARAMETRIZACAO')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'PARAMETRIZACAO'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Parametrização Central de Modelos ({templates.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Sincronizado na Nuvem Firestore
        </span>
      </div>

      {/* ============================================================== */}
      {/* 1. ABA: RÉGUA OPERACIONAL & DISPAROS (SIMULADOR SMARTPHONE)    */}
      {/* ============================================================== */}
      {activeTab === 'REGUA_OPERACIONAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Trigger Selection & Direct Edit Button */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Disparador de Notificações da Locação
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                {activeTemplate?.channel || 'WHATSAPP'} • {activeTemplate?.recipientType || 'INQUILINO'}
              </span>
            </div>

            {/* Trigger Selector + Direct "Editar Modelo" Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Gatilho Operacional da Locação:
                </label>
                {/* BOTÃO PARA EDITAR AS INFORMAÇÕES DESTE GATILHO */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(activeTemplate)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Editar o texto, assunto e parâmetros deste modelo"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Modelo Desta Mensagem</span>
                </button>
              </div>

              <select
                value={selectedTrigger}
                onChange={(e) => setSelectedTrigger(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
              >
                {templates.map(tpl => (
                  <option key={tpl.id} value={tpl.triggerKey}>
                    [{tpl.channel}] {tpl.title} ({tpl.recipientType})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 italic">
                {activeTemplate?.description}
              </p>
            </div>

            {/* Test Simulation Parameters */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Dados de Simulação & Teste de Disparo:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Cliente:</label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone WhatsApp:</label>
                  <input
                    type="text"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor do Aluguel (R$):</label>
                  <input
                    type="number"
                    value={targetRent}
                    onChange={(e) => setTargetRent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data de Vencimento:</label>
                  <input
                    type="text"
                    value={targetDueDay}
                    onChange={(e) => setTargetDueDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-purple-500"
                    placeholder="10/10/2026"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSendTestNotification}
                disabled={isSendingTest}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isSendingTest ? 'animate-bounce' : ''}`} />
                <span>{isSendingTest ? 'Disparando Simulação...' : 'Simular Disparo ao Cliente'}</span>
              </button>

              <button
                onClick={() => {
                  const cleanPhone = targetPhone.replace(/\D/g, '');
                  const encoded = encodeURIComponent(simulatedMessageText);
                  window.open(`https://wa.me/55${cleanPhone}?text=${encoded}`, '_blank');
                }}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                title="Abrir WhatsApp Web com a mensagem preenchida"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Abrir no WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Smartphone / Message Live Preview */}
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-xs sm:text-sm text-slate-200">
                    Pré-visualização Fiel do Cliente ({activeTemplate.channel})
                  </span>
                </div>
                <button
                  onClick={() => handleOpenEditModal(activeTemplate)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Editar Texto</span>
                </button>
              </div>

              {/* Smartphone Frame Container */}
              <div className="mt-4 mx-auto max-w-sm rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl p-3 space-y-3">
                {/* Simulated Phone Top Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1 font-mono">
                  <span>09:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* WhatsApp Chat Header */}
                <div className="bg-emerald-800 text-white p-3 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                      AG
                    </div>
                    <div>
                      <strong className="text-xs block font-bold">AcertGo Imóveis (Oficial)</strong>
                      <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Conta Comercial Verificada
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Bubble (WhatsApp Green Style) */}
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-xs text-slate-200 leading-relaxed space-y-2 relative shadow-md">
                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {simulatedMessageText}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1 font-mono">
                    <span>09:42</span>
                    <span className="text-blue-400 font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Template: <strong>{activeTemplate.triggerKey}</strong> (v{activeTemplate.version})</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(simulatedMessageText);
                  showToast('Texto copiado com sucesso!');
                }}
                className="text-purple-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copiar Mensagem</span>
              </button>
            </div>
          </div>

          {/* Full-width History Logs */}
          <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Histórico de Notificações Disparadas Recentemente
                </h3>
                <p className="text-xs text-slate-500">
                  Registro de envio e confirmação de leitura em tempo real via webhook WhatsApp/E-mail
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {logs.length} disparos registrados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Destinatário</th>
                    <th className="py-2.5 px-3">Gatilho</th>
                    <th className="py-2.5 px-3">Canal</th>
                    <th className="py-2.5 px-3">Contrato</th>
                    <th className="py-2.5 px-3">Data/Hora</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{log.recipientName}</strong>
                        <span className="text-[11px] text-slate-400 font-mono">{log.recipientPhone}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 block">{log.subject}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.triggerType}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          log.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                          log.channel === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {log.contractCode}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {new Date(log.sentAt).toLocaleDateString('pt-BR')} {new Date(log.sentAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {log.deliveryStatus}
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

      {/* ============================================================== */}
      {/* 2. ABA: PARAMETRIZAÇÃO CENTRAL DE MODELOS (HUB CUSTOMIZÁVEL)  */}
      {/* ============================================================== */}
      {activeTab === 'PARAMETRIZACAO' && (
        <div className="space-y-6">
          {/* Explanation Card */}
          <div className="p-4 sm:p-5 bg-purple-50 rounded-3xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-purple-950">
                  Parametrização Livre de Mensagens, Notificações e Documentos
                </h4>
                <p className="text-xs text-purple-800">
                  Edite qualquer modelo, altere o texto padrão, utilize variáveis dinâmicas inteligentes e configure os canais oficiais da sua imobiliária.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Novo Modelo</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar por título, assunto ou gatilho..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500">Filtrar Categoria:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="TODAS">Todas as Categorias</option>
                <option value="LOCACAO">Locação & Vencimentos</option>
                <option value="JURIDICO">Cobrança & Jurídico</option>
                <option value="VENDAS">Vendas & Negociações</option>
                <option value="ONBOARDING">Boas-Vindas / Onboarding</option>
              </select>
            </div>
          </div>

          {/* Templates Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(tpl => (
              <div
                key={tpl.id}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 p-5 shadow-2xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{tpl.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                          v{tpl.version}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                        Chave: {tpl.triggerKey}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        tpl.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                        tpl.channel === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {tpl.channel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                        {tpl.recipientType}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">
                    {tpl.description}
                  </p>

                  {/* Body Preview */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-700 font-sans line-clamp-3 whitespace-pre-wrap">
                    {tpl.bodyTemplate}
                  </div>
                </div>

                {/* Template Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Atualizado em {new Date(tpl.updatedAt).toLocaleDateString('pt-BR')}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* EDITAR MODELO */}
                    <button
                      onClick={() => handleOpenEditModal(tpl)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-purple-200 shadow-2xs"
                      title="Editar o texto e as tags deste modelo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar Modelo</span>
                    </button>

                    {/* Reset single */}
                    <button
                      onClick={() => handleResetSingleTemplate(tpl.triggerKey)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                      title="Restaurar este modelo para o padrão do sistema"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete if custom */}
                    {tpl.isCustomCreated && (
                      <button
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                        title="Excluir este modelo customizado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDITAR / PARAMETRIZAR MODELO DE NOTIFICAÇÃO             */}
      {/* ============================================================== */}
      {isEditModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold">Parametrizar Modelo de Notificação</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      v{editingTemplate.version || '1.0'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Defina o texto, canal oficial e utilize as tags dinâmicas substituídas pelo CRM
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Título do Modelo:</label>
                  <input
                    type="text"
                    value={editingTemplate.title}
                    onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chave do Gatilho:</label>
                  <input
                    type="text"
                    value={editingTemplate.triggerKey}
                    onChange={e => setEditingTemplate({ ...editingTemplate, triggerKey: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Canal de Disparo:</label>
                  <select
                    value={editingTemplate.channel}
                    onChange={e => setEditingTemplate({ ...editingTemplate, channel: e.target.value as MessageChannel })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="WHATSAPP">WhatsApp Oficial</option>
                    <option value="EMAIL">E-mail Corporativo</option>
                    <option value="SMS">SMS Transacional</option>
                    <option value="PUSH">Notificação Push App</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destinatário Alvo:</label>
                  <select
                    value={editingTemplate.recipientType}
                    onChange={e => setEditingTemplate({ ...editingTemplate, recipientType: e.target.value as RecipientType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="INQUILINO">Inquilino (Locatário)</option>
                    <option value="PROPRIETARIO">Proprietário (Locador)</option>
                    <option value="COMPRADOR">Comprador</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="CORRETOR">Corretor Responsável</option>
                    <option value="FIADOR">Fiador</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria:</label>
                  <select
                    value={editingTemplate.category}
                    onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value as MessageCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="LOCACAO">Locação</option>
                    <option value="JURIDICO">Jurídico / Cobrança</option>
                    <option value="VENDAS">Vendas</option>
                    <option value="ONBOARDING">Onboarding</option>
                    <option value="SISTEMA">Sistema</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assunto (Para E-mails ou Push):</label>
                <input
                  type="text"
                  value={editingTemplate.subject || ''}
                  onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  placeholder="Ex: Lembrete de Vencimento do Aluguel - Imóvel {{CODIGO_IMOVEL}}"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Dynamic Tag Insertion Bar */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <span className="font-bold text-purple-950 text-[11px] block">
                  Clique nas variáveis para inserir dinamicamente na mensagem:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TEMPLATE_VARIABLES.map(v => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => handleInsertTag(v.key)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-700 font-mono text-[10px] font-bold border border-purple-200 shadow-2xs transition-colors cursor-pointer"
                      title={v.description}
                    >
                      + {`{{${v.key}}}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Editor & Live Preview Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Corpo da Mensagem (Texto Parametrizado):
                  </label>
                  <textarea
                    rows={12}
                    value={editingTemplate.bodyTemplate}
                    onChange={e => setEditingTemplate({ ...editingTemplate, bodyTemplate: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-purple-900 block flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    Prévia em Tempo Real (Com Dados Reais do CRM):
                  </label>
                  <div className="p-3.5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 font-sans text-xs leading-relaxed h-[240px] overflow-y-auto whitespace-pre-wrap">
                    {editingSimulatedPreview}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleResetSingleTemplate(editingTemplate.triggerKey)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restaurar Padrão Deste Modelo</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Modelo Parametrizado</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

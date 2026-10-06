import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  BookOpen,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Globe,
  Building2,
  Wallet,
  Phone,
  Bot,
  Cpu,
  FileCheck2,
  Users,
  ShieldCheck,
  Download,
  Star,
  Check,
  X,
  FileText,
  Calendar,
  Zap,
  Terminal,
  Server
} from 'lucide-react';
import { NavTabId } from '../common/Sidebar';

interface CentralAjudaSacViewProps {
  onNavigateTab?: (tab: NavTabId) => void;
}

export type HelpDeskTicketStatus = 'ABERTO' | 'EM_ANALISE' | 'AGUARDANDO_CLIENTE' | 'RESOLVIDO';
export type HelpDeskTicketPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA_URGENTE';
export type HelpDeskCategory = 
  | 'DUVIDA_USO' 
  | 'PROBLEMA_TECNICO' 
  | 'INTEGRACOES_APIS' 
  | 'FINANCEIRO_SPLIT' 
  | 'SUGESTAO_MELHORIA';

export interface HelpDeskTicket {
  id: string;
  protocolNumber: string;
  agencyName: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  category: HelpDeskCategory;
  priority: HelpDeskTicketPriority;
  subject: string;
  description: string;
  status: HelpDeskTicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedSupportAgent: string;
  slaTimeRemaining: string;
  messages: Array<{
    id: string;
    sender: 'IMOBILIARIA' | 'SUPORTE_TECNICO';
    authorName: string;
    message: string;
    timestamp: string;
  }>;
  rating?: number;
}

const INITIAL_TICKETS: HelpDeskTicket[] = [
  {
    id: 'tkt_01',
    protocolNumber: 'SAC-2026-9812',
    agencyName: 'AcertGo Imóveis Matriz',
    requesterName: 'Juliana Mendes (Diretora)',
    requesterEmail: 'juliana.mendes@acertgo.com.br',
    requesterPhone: '(11) 98844-3322',
    category: 'INTEGRACOES_APIS',
    priority: 'ALTA',
    subject: 'Ativação do Webhook Lead Ads do Instagram & Facebook',
    description: 'Configuramos o Token de Longa Duração da Meta Graph API e precisamos validar se a captura de leads do formulário do anúncio Jardins One está caindo direto na Roleta de Corretores.',
    status: 'EM_ANALISE',
    createdAt: 'Hoje às 09:30',
    updatedAt: 'Hoje às 10:15',
    assignedSupportAgent: 'Lucas Silva (Engenharia de Integrações)',
    slaTimeRemaining: '38 min restantes',
    messages: [
      {
        id: 'msg_1',
        sender: 'IMOBILIARIA',
        authorName: 'Juliana Mendes',
        message: 'Bom dia equipe! Acabamos de configurar o Meta Pixel e os Tokens. Vocês poderiam disparar um lead simulado no webhook para verificarmos o direcionamento na Roleta?',
        timestamp: '09:30'
      },
      {
        id: 'msg_2',
        sender: 'SUPORTE_TECNICO',
        authorName: 'Lucas Silva - Suporte Técnico',
        message: 'Olá Juliana! Já localizamos o seu webhook ativo com status 200 OK. Estamos disparando um payload de teste agora mesmo.',
        timestamp: '10:15'
      }
    ]
  },
  {
    id: 'tkt_02',
    protocolNumber: 'SAC-2026-9788',
    agencyName: 'AcertGo Imóveis Matriz',
    requesterName: 'Carlos Eduardo (Gerente Comercial)',
    requesterEmail: 'carlos.eduardo@acertgo.com.br',
    requesterPhone: '(11) 97722-1144',
    category: 'FINANCEIRO_SPLIT',
    priority: 'MEDIA',
    subject: 'Parametrização da chave Pix para split automático Conta Pronta',
    description: 'Gostaríamos de confirmar se o repasse de 2.3% da comissão dos corretores parceiros em D+0 está configurado sem retenção de IR na fonte conforme acordado na convenção imobiliária.',
    status: 'RESOLVIDO',
    createdAt: 'Ontem às 14:20',
    updatedAt: 'Ontem às 16:00',
    assignedSupportAgent: 'Mariana Duarte (Especialista Fintech BaaS)',
    slaTimeRemaining: 'Concluído no Prazo',
    messages: [
      {
        id: 'msg_201',
        sender: 'IMOBILIARIA',
        authorName: 'Carlos Eduardo',
        message: 'Olá, poderiam verificar o modelo de split cadastrado para a nossa agência?',
        timestamp: '14:20'
      },
      {
        id: 'msg_202',
        sender: 'SUPORTE_TECNICO',
        authorName: 'Mariana Duarte - Suporte Técnico',
        message: 'Perfeito Carlos! Verificamos a esteira da Conta Pronta. O split está 100% ativo com liquidação D+0 direta na chave Pix de cada corretor, sem bitributação.',
        timestamp: '16:00'
      }
    ],
    rating: 5
  },
  {
    id: 'tkt_03',
    protocolNumber: 'SAC-2026-9650',
    agencyName: 'AcertGo Imóveis Matriz',
    requesterName: 'Dr. Roberto Mendonça',
    requesterEmail: 'roberto@acertgo.com.br',
    requesterPhone: '(11) 99876-1100',
    category: 'DUVIDA_USO',
    priority: 'BAIXA',
    subject: 'Como importar planilha com 400 clientes do antigo CRM',
    description: 'Temos um arquivo CSV com histórico de clientes do PipeRun e gostaríamos de saber se o assistente de Migração & Backup já faz a higienização de CPFs e telefones duplicados.',
    status: 'RESOLVIDO',
    createdAt: 'Há 3 dias',
    updatedAt: 'Há 3 dias',
    assignedSupportAgent: 'Beatriz Lima (Customer Success)',
    slaTimeRemaining: 'Concluído no Prazo',
    messages: [
      {
        id: 'msg_301',
        sender: 'IMOBILIARIA',
        authorName: 'Dr. Roberto',
        message: 'Boa tarde! O módulo de migração CSV aceita qualquer formato de coluna?',
        timestamp: '11:10'
      },
      {
        id: 'msg_302',
        sender: 'SUPORTE_TECNICO',
        authorName: 'Beatriz Lima - Suporte Técnico',
        message: 'Olá Dr. Roberto! Sim, o módulo de Migração & Backup conta com um mapeador inteligente que reconhece nome, telefone com DDD, e-mail e interesse, descartando duplicados automaticamente.',
        timestamp: '11:28'
      }
    ],
    rating: 5
  }
];

export const CentralAjudaSacView: React.FC<CentralAjudaSacViewProps> = ({
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'base_conhecimento' | 'chamados_sac' | 'simulador_apresentacao'>('base_conhecimento');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // SAC Tickets state
  const [tickets, setTickets] = useState<HelpDeskTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<HelpDeskTicket | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketResponse, setNewTicketResponse] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Ticket Form
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<HelpDeskCategory>('DUVIDA_USO');
  const [newPriority, setNewPriority] = useState<HelpDeskTicketPriority>('MEDIA');
  const [newDescription, setNewDescription] = useState('');
  const [newRequesterName, setNewRequesterName] = useState('Juliana Mendes');
  const [newRequesterEmail, setNewRequesterEmail] = useState('juliana.mendes@acertgo.com.br');
  const [newRequesterPhone, setNewRequesterPhone] = useState('(11) 98844-3322');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Create ticket handler
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      showToast('Preencha o assunto e a descrição da solicitação.');
      return;
    }

    const created: HelpDeskTicket = {
      id: `tkt_${Date.now()}`,
      protocolNumber: `SAC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      agencyName: 'AcertGo Imóveis Matriz',
      requesterName: newRequesterName,
      requesterEmail: newRequesterEmail,
      requesterPhone: newRequesterPhone,
      category: newCategory,
      priority: newPriority,
      subject: newSubject,
      description: newDescription,
      status: 'ABERTO',
      createdAt: 'Agora mesmo',
      updatedAt: 'Agora mesmo',
      assignedSupportAgent: 'Plantão Técnico Nível 1',
      slaTimeRemaining: newPriority === 'CRITICA_URGENTE' ? '15 min restantes' : '45 min restantes',
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'IMOBILIARIA',
          authorName: newRequesterName,
          message: newDescription,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setTickets(prev => [created, ...prev]);
    setIsNewTicketModalOpen(false);
    setNewSubject('');
    setNewDescription('');
    showToast(`Chamado ${created.protocolNumber} aberto com sucesso! Nosso SLA de resposta é de até 15 minutos.`);
    setSelectedTicket(created);
  };

  // Reply ticket handler
  const handleReplyTicket = () => {
    if (!selectedTicket || !newTicketResponse.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'IMOBILIARIA' as const,
      authorName: selectedTicket.requesterName,
      message: newTicketResponse,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updated: HelpDeskTicket = {
      ...selectedTicket,
      updatedAt: 'Agora mesmo',
      status: 'EM_ANALISE',
      messages: [...selectedTicket.messages, newMessage]
    };

    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updated : t));
    setSelectedTicket(updated);
    setNewTicketResponse('');
    showToast('Resposta enviada para a equipe de suporte!');
  };

  // Close ticket handler
  const handleCloseTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'RESOLVIDO',
          updatedAt: 'Finalizado pelo cliente',
          slaTimeRemaining: 'Finalizado com Sucesso'
        };
      }
      return t;
    }));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: 'RESOLVIDO' } : null);
    }
    showToast('Chamado encerrado com sucesso!');
  };

  // Rate ticket
  const handleRateTicket = (ticketId: string, rating: number) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, rating } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, rating } : null);
    }
    showToast('Obrigado pela sua avaliação!');
  };

  // Knowledge base topics
  const knowledgeModules = [
    {
      id: 'roleta_leads',
      title: 'Roleta de Atendimento & Funil de Leads',
      category: 'Atendimento',
      icon: Phone,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      summary: 'Distribuição automática de clientes para corretores com SLA de 10 minutos.',
      targetTab: 'roleta' as NavTabId,
      howItWorks: [
        'Leads chegam automaticamente por WhatsApp, Meta Ads, Google Ads ou formulário do site.',
        'A Roleta entrega o lead para o próximo corretor da fila em status "Online".',
        'Se o corretor não responder em até 10 minutos, o sistema transfere automaticamente para o próximo da fila.',
        'O corretor clica no botão WhatsApp direto no CRM para falar com o cliente com mensagens pré-configuradas.'
      ],
      faq: [
        { q: 'O que acontece se o corretor estiver fora do expediente?', a: 'O corretor pode pausar sua fila no topo da tela ou o sistema desativa automaticamente após o horário comercial configurado no RH.' },
        { q: 'Como evitar duplicidade de clientes?', a: 'Se o cliente já tiver negociado com um corretor nos últimos 30 dias, a Roleta direciona para o corretor original.' }
      ]
    },
    {
      id: 'lancamentos_espelho',
      title: 'Lançamentos & Espelho de Vendas 360° Interativo',
      category: 'Imóveis & Lançamentos',
      icon: Building2,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      summary: 'Gestão completa de empreendimentos, tabela de vendas, plantas, obra e reservas com trava.',
      targetTab: 'sales_mirror' as NavTabId,
      howItWorks: [
        'Cadastre empreendimentos com torres, andares, construtora, incorporadora e Registro de Incorporação (RI).',
        'Espelho interativo andar por andar: verde (disponível), amarelo (reservada), cinza (vendida).',
        'Trava de reserva de 24 horas: o corretor insere o nome e CPF do cliente e garante exclusividade para proposta.',
        'Tabela de vendas com simulação de fluxo (entrada, parcelas mensais, semestrais, chaves e financiamento).'
      ],
      faq: [
        { q: 'Como expira a reserva?', a: 'A contagem regressiva de 24h avisa corretor e gerente. Caso não seja anexada a proposta assinada, a unidade volta a ficar verde no espelho.' },
        { q: 'As plantas e books podem ser baixados pelo corretor?', a: 'Sim! Na aba Plantas & Materiais o corretor tem download imediato do memorial descritivo e tabelas em PDF.' }
      ]
    },
    {
      id: 'integracoes_central',
      title: 'Central de Integrações & Conectores API',
      category: 'Tecnologia & APIs',
      icon: Cpu,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      summary: 'Todos os canais em um único lugar: Portais XML, Órulo, WhatsApp, ChatGPT, Gemini, Meta e Bancos.',
      targetTab: 'integracoes' as NavTabId,
      howItWorks: [
        'Portais XML: Feeds gerados para ZAP, VivaReal, OLX, Imovelweb e Mercado Livre com link copiável.',
        'Órulo: Sincronização automática do acervo nacional de lançamentos de centenas de construtoras.',
        'WhatsApp API: Conexão via QR Code ou Z-API para atendimento e disparo de notificações.',
        'ChatGPT & Gemini: Inteligência artificial para atender clientes e analisar fotos dos imóveis.'
      ],
      faq: [
        { q: 'Preciso pagar mensalidade adicional por portal?', a: 'Não, o feed XML padrão é ilimitado e homologado para todas as plataformas de anúncios do Brasil.' },
        { q: 'Como testo a API do WhatsApp?', a: 'Na Central de Integrações há um botão de teste instantâneo que dispara uma mensagem para o seu celular.' }
      ]
    },
    {
      id: 'marketing_studio',
      title: 'Marketing.IA Studio & Criador de Criativos',
      category: 'Marketing',
      icon: Sparkles,
      color: 'bg-pink-50 text-pink-700 border-pink-200',
      summary: 'Canva-like imobiliário, legendas com IA, cortes de vídeo do YouTube e publicação direta na Meta.',
      targetTab: 'marketing_ia' as NavTabId,
      howItWorks: [
        'Busque imóveis por código (ex: IMO-101) ou faça upload de fotos próprias do seu computador.',
        'Escolha o formato: Feed 1:1, Story/Reels 9:16 ou Carrossel com molduras luxo.',
        'Studio de Cortes: Cole a URL de qualquer vídeo do YouTube para extrair trechos de 15s a 60s em 9:16.',
        'Publique direto no Instagram e Facebook via Meta Graph API sem precisar baixar o arquivo.'
      ],
      faq: [
        { q: 'Posso agendar publicações para o final de semana?', a: 'Sim! Use a aba Calendário de Conteúdo para programar posts com horário definido.' }
      ]
    },
    {
      id: 'sites_modelos_cms',
      title: 'Sites Modelos & Gestor de Conteúdo (CMS)',
      category: 'Presença Digital',
      icon: Globe,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      summary: '4 modelos profissionais de sites imobiliários com domínio próprio e publicação instantânea.',
      targetTab: 'sites_modelos' as NavTabId,
      howItWorks: [
        'Escolha entre 4 templates (Exclusive High-End, Urban Flow, Lançamentos & Construtoras, Portal Completo).',
        'Personalize logotipo, cores, textos institucionais e botão do WhatsApp.',
        'Conecte seu domínio próprio (ex: www.suaimobiliaria.com.br) via apontamento CNAME.',
        'Leads gerados no site caem instantaneamente na Roleta de Corretores do CRM.'
      ],
      faq: [
        { q: 'O certificado de segurança SSL está incluso?', a: 'Sim, todos os sites publicados possuem HTTPS com certificado Let\'s Encrypt ativo automaticamente.' }
      ]
    },
    {
      id: 'locacao_split',
      title: 'Módulo de Locação, Split Pix & Conta Pronta',
      category: 'Financeiro & Jurídico',
      icon: Wallet,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      summary: 'Contratos digitais blindados, divisão automática de comissões e repasses a proprietários em D+0.',
      targetTab: 'contracts' as NavTabId,
      howItWorks: [
        'Contratos com emissão de boletos registrados e baixa automática.',
        'Split de comissão da imobiliária e corretores sem bitributação via Conta Pronta.',
        'Repasse instantâneo via Pix para o proprietário assim que o inquilino pagar o aluguel.',
        'Vistorias fotográficas com assinatura digital integrada (DocuSign, ClickSign, ZapSign).'
      ],
      faq: [
        { q: 'Como funciona a divisão entre herdeiros?', a: 'O sistema permite cadastrar múltiplos beneficiários por imóvel com percentuais definidos (ex: 50% Filho A, 50% Filha B).' }
      ]
    }
  ];

  const filteredKnowledge = knowledgeModules.filter(item => {
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.howItWorks.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getPriorityBadge = (p: HelpDeskTicketPriority) => {
    switch (p) {
      case 'CRITICA_URGENTE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-300">Crítica • Urgente</span>;
      case 'ALTA':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">Prioridade Alta</span>;
      case 'MEDIA':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Prioridade Média</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Prioridade Baixa</span>;
    }
  };

  const getStatusBadge = (s: HelpDeskTicketStatus) => {
    switch (s) {
      case 'ABERTO':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-300">Aberto (Na Fila)</span>;
      case 'EM_ANALISE':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">Em Atendimento</span>;
      case 'AGUARDANDO_CLIENTE':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900">Aguardando Retorno</span>;
      case 'RESOLVIDO':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">Concluído / Resolvido</span>;
    }
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide">
              <Headphones className="w-3.5 h-3.5 text-blue-400" />
              <span>CENTRAL OFICIAL DE AJUDA & SAC DO SISTEMA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Suporte Técnico, Dúvidas & SAC
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Consulte a base de conhecimento de todas as funcionalidades da plataforma imobiliária ou abra chamados técnicos e operacionais diretamente para nossa equipe de atendimento.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Abrir Novo Chamado (SAC)</span>
            </button>

            <a
              href="https://wa.me/5511998642424?text=Ol%C3%A1!%20Sou%20usu%C3%A1rio%20do%20sistema%20imobili%C3%A1rio%20e%20preciso%20de%20suporte."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp do Suporte</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('base_conhecimento')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'base_conhecimento'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Base de Conhecimento & Guia das Funções</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chamados_sac')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'chamados_sac'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Central de Chamados SAC (Imobiliárias)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeSubTab === 'chamados_sac' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {tickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulador_apresentacao')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'simulador_apresentacao'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Como Rodar, Simular & Guia Firebase</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 1: BASE DE CONHECIMENTO & GUIA DAS FUNÇÕES         */}
      {/* ======================================================== */}
      {activeSubTab === 'base_conhecimento' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar função, módulo ou dúvida..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
              {['ALL', 'Atendimento', 'Imóveis & Lançamentos', 'Tecnologia & APIs', 'Marketing', 'Presença Digital', 'Financeiro & Jurídico'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Todos os Tópicos' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards of Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKnowledge.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold border ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.summary}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <strong className="text-[11px] font-bold text-slate-800 block">Como funciona na prática:</strong>
                      <ul className="space-y-1.5 text-[11px] text-slate-600">
                        {item.howItWorks.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {item.faq.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <strong className="text-[11px] font-bold text-slate-800 block">Dúvidas Frequentes:</strong>
                        {item.faq.map((f, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                            <strong className="text-slate-900 block mb-0.5">{f.q}</strong>
                            <p className="text-slate-600">{f.a}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (onNavigateTab) {
                          onNavigateTab(item.targetTab);
                        }
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Abrir Módulo no Sistema</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: CENTRAL DE CHAMADOS SAC (TICKETS)              */}
      {/* ======================================================== */}
      {activeSubTab === 'chamados_sac' && (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Chamados Abertos</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {tickets.filter(t => t.status !== 'RESOLVIDO').length}
              </div>
              <p className="text-[11px] text-blue-600 font-semibold">Em tratamento ativo</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Médio de 1ª Resposta</span>
              <div className="text-2xl font-black text-emerald-600 font-mono">11 min</div>
              <p className="text-[11px] text-emerald-700 font-semibold">Garantia máxima 30 min</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Resolução no 1º Contato</span>
              <div className="text-2xl font-black text-purple-600 font-mono">94.8%</div>
              <p className="text-[11px] text-purple-700 font-semibold">Alto índice de satisfação</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avaliação Média (CSAT)</span>
              <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1">
                <span>4.98</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-[11px] text-amber-700 font-semibold">Baseado em 142 tickets</p>
            </div>
          </div>

          {/* Tickets List Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Histórico de Chamados da Imobiliária</h3>
                <p className="text-xs text-slate-500">Acompanhe em tempo real o status, analista designado e SLA de resposta</p>
              </div>

              <button
                onClick={() => setIsNewTicketModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Chamado</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Protocolo</th>
                    <th className="py-3 px-4">Assunto / Detalhes</th>
                    <th className="py-3 px-4">Solicitante</th>
                    <th className="py-3 px-4">Prioridade</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">SLA Restante</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map(ticket => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {ticket.protocolNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{ticket.subject}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{ticket.description}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{ticket.requesterName}</div>
                        <div className="text-[10px] text-slate-500">{ticket.requesterPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {ticket.slaTimeRemaining}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Ver Detalhes
                        </button>
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
      {/* SUBTAB 3: COMO RODAR, SIMULAR & GUIA FIREBASE            */}
      {/* ======================================================== */}
      {activeSubTab === 'simulador_apresentacao' && (
        <div className="space-y-6">
          {/* Quick Explanation Hero */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Como Rodar o Sistema, Simular para Apresentar e Conectar ao Firebase
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Visão geral clara e objetiva para diretores, corretores e desenvolvedores
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>O sistema JÁ ESTÁ RODANDO 100% FUNCIONAL para apresentação agora!</span>
              </div>
              <p className="leading-relaxed">
                Você já possui este aplicativo compilado e rodando ao vivo na nuvem do Google Cloud Run. Ele conta com dados completos e realistas (48 unidades no espelho de vendas, funil de leads com roleta, gerador de criativos para Instagram, contratos de locação e split de pagamentos). Você pode apresentá-lo a clientes, parceiros ou investidores em qualquer computador, tablet ou celular.
              </p>
            </div>
          </div>

          {/* 3 Step-by-Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Presentation */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  1
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Simulação Imediata para Apresentar
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tudo pode ser clicado e demonstrado em tempo real:
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Espelho de Vendas:</strong> Clique em qualquer unidade, veja a orientação do sol e faça uma reserva com trava de 24h.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Marketing.IA:</strong> Crie um post, cole uma URL do YouTube para cortar Reels 9:16 e teste a publicação direta.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Sites Modelos:</strong> Alterne entre os 4 templates e abra a prévia em tela cheia.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                Os dados inseridos ficam salvos no navegador para você demonstrar o fluxo completo.
              </div>
            </div>

            {/* Step 2: Firebase Firestore & Auth */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  2
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Conexão com Firebase (Produção)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para transformar este protótipo em banco de dados em nuvem permanente:
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Firebase Firestore:</strong> Armazenamento em nuvem multi-tenant de imóveis, leads, contratos e espelho de vendas.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Firebase Authentication:</strong> Login seguro para Corretores, Gerentes e Administradores com e-mail/senha ou Google.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Firebase Security Rules:</strong> Regras de acesso por função (RBAC).</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                Basta solicitar "Conectar Firebase" no chat e o assistente provisiona o Firestore e regras automaticamente.
              </div>
            </div>

            {/* Step 3: Deploy & Hosting */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                  3
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Deploy no Firebase Hosting
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Se desejar hospedar em um domínio próprio no Firebase Hosting:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[10px] space-y-1 overflow-x-auto">
                  <div># 1. Instalar Firebase CLI</div>
                  <div className="text-emerald-400">npm install -g firebase-tools</div>
                  <div className="pt-1"># 2. Compilar o app</div>
                  <div className="text-emerald-400">npm run build</div>
                  <div className="pt-1"># 3. Publicar na CDN</div>
                  <div className="text-emerald-400">firebase deploy --only hosting</div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900">
                Seu app fica com CDN global do Google, carregamento instantâneo e SSL automático.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: NOVO CHAMADO SAC                                 */}
      {/* ======================================================== */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Abrir Novo Chamado de Suporte (SAC)</h3>
                  <p className="text-xs text-slate-300">Nossa equipe técnica atende chamados com SLA prioritário</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria do Chamado:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="DUVIDA_USO">Dúvida sobre Funcionalidade</option>
                    <option value="PROBLEMA_TECNICO">Problema Técnico / Erro do Sistema</option>
                    <option value="INTEGRACOES_APIS">Integração (WhatsApp, Meta, Portais XML, Órulo)</option>
                    <option value="FINANCEIRO_SPLIT">Financeiro, Split Pix & Conta Pronta</option>
                    <option value="SUGESTAO_MELHORIA">Sugestão de Nova Função</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nível de Prioridade:</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="BAIXA">Baixa (Dúvidas gerais - SLA 4 horas)</option>
                    <option value="MEDIA">Média (Ajustes rotineiros - SLA 2 horas)</option>
                    <option value="ALTA">Alta (Impacto na operação - SLA 45 min)</option>
                    <option value="CRITICA_URGENTE">Crítica / Urgente (Sistema parado - SLA 15 min)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assunto Resumido:</label>
                <input
                  type="text"
                  placeholder="Ex: Como ativar a sincronização com o Zap Imóveis?"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição Detalhada da Solicitação:</label>
                <textarea
                  rows={4}
                  placeholder="Descreva o que está acontecendo ou o que precisa ser configurado com o máximo de detalhes possível..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Seu Nome:</label>
                  <input
                    type="text"
                    value={newRequesterName}
                    onChange={e => setNewRequesterName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Seu E-mail:</label>
                  <input
                    type="email"
                    value={newRequesterEmail}
                    onChange={e => setNewRequesterEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Seu WhatsApp:</label>
                  <input
                    type="text"
                    value={newRequesterPhone}
                    onChange={e => setNewRequesterPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Chamado para o SAC</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DETALHES DO CHAMADO SAC                          */}
      {/* ======================================================== */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {selectedTicket.protocolNumber}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <h3 className="text-base font-bold text-white">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-400">
                  Aberto por {selectedTicket.requesterName} • Atendente: {selectedTicket.assignedSupportAgent}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Descrição Inicial da Imobiliária:</span>
                <p className="text-slate-800 leading-relaxed text-xs font-medium">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Messages timeline */}
              <div className="space-y-3 pt-2">
                <strong className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Linha do Tempo de Respostas:
                </strong>

                {selectedTicket.messages.map(m => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border max-w-[85%] space-y-1 ${
                      m.sender === 'SUPORTE_TECNICO'
                        ? 'bg-blue-50 border-blue-200 text-blue-950 ml-auto'
                        : 'bg-white border-slate-200 text-slate-800 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] font-bold">
                      <span className={m.sender === 'SUPORTE_TECNICO' ? 'text-blue-700' : 'text-slate-700'}>
                        {m.authorName}
                      </span>
                      <span className="text-slate-400 font-mono">{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed text-xs">{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Rating if resolved */}
              {selectedTicket.status === 'RESOLVIDO' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <strong className="text-emerald-950 block text-xs">Chamado Finalizado com Sucesso</strong>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRateTicket(selectedTicket.id, star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (selectedTicket.rating || 5) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom reply bar */}
            {selectedTicket.status !== 'RESOLVIDO' && (
              <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escreva uma resposta ou anexe novas informações para o suporte..."
                    value={newTicketResponse}
                    onChange={e => setNewTicketResponse(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleReplyTicket();
                    }}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleReplyTicket}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Responder</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>SLA de Resposta: <strong>{selectedTicket.slaTimeRemaining}</strong></span>
                  <button
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                  >
                    Encerrar Chamado como Resolvido
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

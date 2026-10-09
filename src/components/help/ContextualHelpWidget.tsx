import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  ExternalLink, 
  BookOpen, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  MessageSquare,
  LifeBuoy
} from 'lucide-react';
import { NavTabId } from '../common/Sidebar';

interface ContextualHelpWidgetProps {
  currentTab: NavTabId;
  onNavigateTab: (tab: NavTabId) => void;
  tenantName?: string;
  supportPhone?: string;
}

interface ModuleHelpGuide {
  title: string;
  badge: string;
  summary: string;
  quickSteps: string[];
  faqs: Array<{ question: string; answer: string }>;
  tips: string[];
}

const MODULE_GUIDES: Partial<Record<NavTabId, ModuleHelpGuide>> = {
  executive_dashboard: {
    title: 'Painel Geral Executivo',
    badge: 'Visão Geral & Métricas',
    summary: 'Monitora em tempo real o VGV gerado, comissões a receber, conversão do funil de vendas e velocidade de atendimento de leads da imobiliária.',
    quickSteps: [
      'Acompanhe o termômetro de metas mensais no topo da tela.',
      'Analise os gráficos de conversão por etapa do funil (Leads → Visitas → Propostas).',
      'Confira a lista de corretores campeões e a distribuição de oportunidades ativas.',
      'Clique nos cards de atalho para saltar diretamente aos módulos operacionais.'
    ],
    faqs: [
      {
        question: 'Com que frequência os dados do painel são atualizados?',
        answer: 'Os números são atualizados em tempo real a cada novo lead recebido, proposta cadastrada ou status alterado no funil.'
      },
      {
        question: 'Como filtrar métricas por período?',
        answer: 'Utilize os botões de filtro no canto superior direito para alternar entre Hoje, Últimos 7 dias, Este Mês e Acumulado Anual.'
      }
    ],
    tips: [
      'Monitore o indicador de SLA no canto superior para garantir que nenhum lead fique sem resposta.',
      'Exporte relatórios consolidados em PDF no botão de exportação da barra superior.'
    ]
  },
  kanban: {
    title: 'Funil de Vendas (Kanban & Pipeline)',
    badge: 'Gestão de Oportunidades',
    summary: 'Organiza todos os clientes em colunas visuais desde o primeiro contato até o fechamento do contrato com cálculo automatizado de SLA.',
    quickSteps: [
      'Arraste os cards de leads entre as colunas para atualizar a etapa do processo.',
      'Clique no card para abrir o prontuário completo com timeline, radar de imóveis e documentos.',
      'Fique atento aos badges amarelos de SLA: sinalizam leads sem contato há mais de 30 minutos.',
      'Utilize os filtros por corretor, canal de captação e temperatura para organizar o dia.'
    ],
    faqs: [
      {
        question: 'O que significa o badge amarelo "⚠️ SLA +30m"?',
        answer: 'Indica que o lead está na etapa "Novo Lead" há mais de 30 minutos sem nenhuma interação registrada. Clique em "Chamar" para iniciar o WhatsApp imediatamente.'
      },
      {
        question: 'Como agendar uma visita diretamente pelo Kanban?',
        answer: 'Abra o card do lead, selecione a aba "Agenda / Visitas" e defina data, horário e imóvel desejado.'
      }
    ],
    tips: [
      'O tempo médio de primeiro contato é crucial: leads atendidos nos primeiros 5 minutos convertem até 8x mais.',
      'Use o filtro de busca rápida para localizar clientes por nome, telefone ou código do imóvel.'
    ]
  },
  imoveis: {
    title: 'Estoque de Imóveis & Captações',
    badge: 'Catálogo & Parcerias',
    summary: 'Gestão completa do acervo de imóveis para venda e locação, com controle de exclusividade, fotos, chaves e integração direta com portais e sites modelos.',
    quickSteps: [
      'Clique em "Novo Imóvel" para cadastrar fotos, características, valores e dados do proprietário.',
      'Use a busca por código (ex: ACG-8942), bairro ou faixa de valor para encontrar unidades rapidamente.',
      'Ative o canal de portais para sincronizar automaticamente com Zap, VivaReal e OLX.',
      'Gere fichas em PDF e links compartilháveis para enviar aos clientes pelo WhatsApp.'
    ],
    faqs: [
      {
        question: 'Como vincular um imóvel ao site modelo da imobiliária?',
        answer: 'Todos os imóveis com status "Disponível" e marcados para exibição pública entram automaticamente no catálogo do seu Site Modelo e CMS.'
      },
      {
        question: 'Onde encontro o código do imóvel para confeccionar placas?',
        answer: 'O código de referência alfanumérico aparece em destaque no card do imóvel e no topo do cadastro.'
      }
    ],
    tips: [
      'Imóveis com mais de 8 fotos em alta resolução recebem até 3x mais contatos nos portais.',
      'Cadastre as matrículas e certidões na aba documental para acelerar as análises jurídicas.'
    ]
  },
  sites_modelos: {
    title: 'Sites Modelos & CMS Imobiliário',
    badge: 'Presença Digital & Leads',
    summary: 'Plataforma completa de sites imobiliários de alto padrão integrados com o acervo da imobiliária, captação direta de leads e suporte a domínio próprio.',
    quickSteps: [
      'Escolha um dos 4 templates profissionais disponíveis no catálogo de modelos.',
      'Clique em "Abrir Site em Nova Aba" para visualizar a experiência pública real do visitante.',
      'Use "Personalizar CMS Completo" para trocar banners, logo, cores, textos e WhatsApp flutuante.',
      'Configure seu domínio próprio (ex: www.suaimobiliaria.com.br) via apontamento CNAME de DNS.'
    ],
    faqs: [
      {
        question: 'Como os leads que chegam pelo site entram no CRM?',
        answer: 'Qualquer formulário ou clique de WhatsApp enviado no site cai instantaneamente no status "NOVO_LEAD" do seu Funil de Vendas com aviso sonoro e visual.'
      },
      {
        question: 'Por que abrir em uma nova aba do navegador?',
        answer: 'Para verificar a navegação real exatamente como seus clientes veem, com URL limpa e sem elementos do painel administrativo.'
      }
    ],
    tips: [
      'Adicione depoimentos reais e fotos da equipe de corretores para aumentar a credibilidade do seu site.',
      'Mantenha seu número de WhatsApp sempre com DDD correto para garantir o atendimento imediato.'
    ]
  },
  roleta: {
    title: 'Roleta de Atendimento & Plantão',
    badge: 'Distribuição Justa',
    summary: 'Distribui automaticamente novos leads entre os corretores de plantão por rodízio sequencial ou pontuação, evitando favorecimento.',
    quickSteps: [
      'Verifique os corretores com status "Online" no plantão ativo.',
      'Ajuste o peso ou limite diário de leads para cada corretor se necessário.',
      'Ative a redistribuição automática para leads sem resposta dentro do tempo limite de SLA.'
    ],
    faqs: [
      {
        question: 'O que acontece se um corretor não atender o lead a tempo?',
        answer: 'Se a regra de redistribuição estiver ativada, o lead expira após o prazo configurado e passa para o próximo corretor da fila.'
      }
    ],
    tips: [
      'Mantenha a roleta em modo automático para garantir resposta em menos de 5 minutos mesmo fora do horário comercial.'
    ]
  },
  brand_equity: {
    title: 'Hub de Identidade & Placas Imobiliárias',
    badge: 'Marketing & Materiais',
    summary: 'Estúdio profissional de criação de placas físicas, faixas, cartazes e artes com logo da imobiliária, QR Code de rastreio e tamanhos gráficos padronizados.',
    quickSteps: [
      'Selecione a finalidade (Venda, Locação ou Venda/Locação) e o tipo da placa.',
      'Escolha a dimensão gráfica correta (ex: 50x70cm para janela, 90x60cm para portão ou faixas).',
      'Confirme o telefone, WhatsApp, site e CRECI que serão estampados.',
      'O QR Code é gerado automaticamente direcionando para a página do imóvel com rastreamento.',
      'Clique em "Imprimir Placa" ou "Baixar Arte da Placa" para enviar à gráfica.'
    ],
    faqs: [
      {
        question: 'O QR Code da placa realmente funciona na câmera do celular?',
        answer: 'Sim! Ele é gerado em alta definição com link direto para o anúncio do imóvel no site oficial da imobiliária.'
      },
      {
        question: 'Posso alterar a cor da placa?',
        answer: 'Sim, você pode alternar entre paletas de alto contraste (Azul Corporativo, Amarelo Rua, Vermelho, Verde e Preto Luxo).'
      }
    ],
    tips: [
      'Para placas de rua, a paleta Amarelo com Preto oferece a maior visibilidade à distância de motoristas.',
      'Sempre inclua o número do CRECI jurídico ou físico para conformidade com o COFECI.'
    ]
  },
  fintech_split: {
    title: 'Financeiro, Comissões & Split Pix',
    badge: 'Gestão Financeira',
    summary: 'Controle de honorários, split automatizado de comissões entre imobiliária, captação e corretor, e emissão de recibos.',
    quickSteps: [
      'Cadastre a proposta aprovada com os percentuais de comissão acordados.',
      'Visualize o rateio automático com dedução de impostos e taxas da empresa.',
      'Realize baixas financeiras com geração de comprovante digital.'
    ],
    faqs: [
      {
        question: 'Como funciona o split de comissão?',
        answer: 'O sistema calcula automaticamente a divisão cadastrada (ex: 50% imobiliária, 40% corretor vendedor, 10% captador).'
      }
    ],
    tips: [
      'Mantenha os dados bancários e chave Pix dos corretores atualizados no cadastro de usuários.'
    ]
  },
  central_ajuda_sac: {
    title: 'Central de Ajuda & SAC Oficial',
    badge: 'Suporte & Tutoriais',
    summary: 'Canal oficial de atendimento, abertura de chamados técnicos, base de conhecimento e contato com a equipe de engenharia do AcertGo.',
    quickSteps: [
      'Pesquise sua dúvida na barra de busca central.',
      'Abra um chamado clicando em "Novo Chamado SAC" caso encontre alguma instabilidade.',
      'Acompanhe o tempo de resposta e o protocolo de atendimento em tempo real.',
      'Chame nosso suporte técnico diretamente pelo WhatsApp corporativo.'
    ],
    faqs: [
      {
        question: 'Qual o tempo de resposta do suporte técnico?',
        answer: 'Chamados críticos têm resposta em até 30 minutos em horário comercial. Chamados regulares são atendidos em até 2 horas.'
      }
    ],
    tips: [
      'Ao relatar um problema técnico, anexe imagens da tela para que nossa equipe resolva mais rapidamente.'
    ]
  }
};

const DEFAULT_FALLBACK_GUIDE: ModuleHelpGuide = {
  title: 'Guia do Módulo do Sistema',
  badge: 'Instruções Rápidas',
  summary: 'Este módulo permite gerenciar as operações imobiliárias com segurança, alta produtividade e registros salvos na nuvem.',
  quickSteps: [
    'Utilize os botões e filtros superiores para interagir com os dados deste módulo.',
    'Todas as alterações realizadas são salvas de forma persistente e segura no banco de dados.',
    'Em caso de dúvidas pontuais, acione o suporte técnico através do botão flutuante.'
  ],
  faqs: [
    {
      question: 'Como obter suporte para esta funcionalidade?',
      answer: 'Você pode abrir um chamado na Central de Ajuda SAC ou falar diretamente no WhatsApp da equipe técnica.'
    }
  ],
  tips: [
    'Mantenha suas informações cadastrais e dados dos clientes sempre atualizados para melhor performance.'
  ]
};

export const ContextualHelpWidget: React.FC<ContextualHelpWidgetProps> = ({
  currentTab,
  onNavigateTab,
  tenantName = 'AcertGo Imóveis',
  supportPhone = '(11) 98844-3322'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const guide = MODULE_GUIDES[currentTab] || DEFAULT_FALLBACK_GUIDE;

  const handleOpenWhatsAppSupport = () => {
    const rawNumber = supportPhone.replace(/\D/g, '') || '5511988443322';
    const msg = encodeURIComponent(
      `Olá Suporte AcertGo! Estou no módulo "${guide.title}" da imobiliária ${tenantName} e gostaria de tirar uma dúvida:`
    );
    window.open(`https://wa.me/${rawNumber}?text=${msg}`, '_blank');
  };

  return (
    <>
      {/* Permanent Floating Button (Docked at Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center group">
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center relative cursor-pointer border-2 border-white/20"
          title={`Ajuda & Guia Rápido: ${guide.title}`}
          aria-label="Abrir Central de Ajuda do Módulo"
        >
          <HelpCircle className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* Hover Pill Label on Desktop */}
        <div 
          onClick={() => setIsOpen(true)}
          className="hidden sm:flex items-center gap-1.5 ml-2.5 px-3 py-1.5 bg-slate-900/90 text-white rounded-full text-xs font-bold shadow-lg border border-slate-700 cursor-pointer opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
          <span>Ajuda: {guide.title}</span>
        </div>
      </div>

      {/* Slide-over Drawer / Modal for Contextual Help */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150 p-0 sm:p-4">
          <div 
            className="w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-start justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600/30 rounded-lg border border-blue-500/40 text-blue-300">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                    {guide.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {guide.summary}
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Fechar Ajuda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Pesquisar instruções ou dúvidas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
              {/* Quick Steps Card */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2">
                <h4 className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  Passo a Passo Prático para Este Módulo:
                </h4>
                <ul className="space-y-1.5 text-slate-700">
                  {guide.quickSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                  Dúvidas Frequentes Rápidas:
                </h4>
                <div className="space-y-2">
                  {guide.faqs
                    .filter(f => !searchQuery || f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((faq, idx) => {
                      const isExpanded = expandedFaqIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                            className="w-full p-2.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <span className="font-bold text-slate-800 text-[11px] leading-snug">
                              {faq.question}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="p-2.5 pt-0 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Best Practice Tips */}
              {guide.tips && guide.tips.length > 0 && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1.5">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Dica de Alta Performance:
                  </h4>
                  <ul className="space-y-1 text-amber-900 text-[11px]">
                    {guide.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer with Instant Actions */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenWhatsAppSupport}
                className="w-full sm:flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Suporte via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateTab('central_ajuda_sac');
                }}
                className="w-full sm:flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Central de Ajuda SAC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

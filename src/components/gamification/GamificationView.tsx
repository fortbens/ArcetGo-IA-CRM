import React, { useState } from 'react';
import { 
  Trophy, 
  Gift, 
  Users, 
  Flame, 
  CheckCircle2, 
  DollarSign, 
  Send, 
  Plus, 
  Clock, 
  Sparkles,
  Home,
  Building,
  KeyRound,
  FileCheck,
  Zap,
  Target,
  Star,
  Activity,
  Award,
  TrendingUp,
  Percent,
  Check,
  Calendar,
  MessageSquare,
  X,
  Tv,
  Copy,
  Sliders,
  Bell
} from 'lucide-react';
import { ReferralLead, UserProfile } from '../../types/crm';
import { INITIAL_REFERRALS, CURRENT_USER_PROFILES } from '../../data/mockData';
import { TvControlManagementModal } from '../tv/TvControlManagementModal';

export interface GamificationViewProps {
  onOpenTvMode?: () => void;
}

type RankingCategory = 
  | 'CAPTACAO' 
  | 'VENDAS' 
  | 'LOCACAO' 
  | 'SLA' 
  | 'OFERTAS' 
  | 'USO_CRM' 
  | 'ATENDIMENTO_LEADS';

export const GamificationView: React.FC<GamificationViewProps> = ({ onOpenTvMode }) => {
  const [activeCategory, setActiveCategory] = useState<RankingCategory>('VENDAS');
  const [period, setPeriod] = useState<'MES' | 'TRIMESTRE' | 'ANO'>('MES');
  const [copiedTvLink, setCopiedTvLink] = useState(false);
  const [showTvControlModal, setShowTvControlModal] = useState(false);
  const [referrals, setReferrals] = useState<ReferralLead[]>(INITIAL_REFERRALS);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [refName, setRefName] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [leadClientName, setLeadClientName] = useState('');
  const [leadClientPhone, setLeadClientPhone] = useState('');

  // 7 Explicit Ranking Categories Data
  const RANKING_DATA: Record<RankingCategory, {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    unitName: string;
    leaders: Array<{
      id: string;
      name: string;
      role: string;
      avatar: string;
      score: number;
      secondaryMetric: string;
      badgeText: string;
      badgeColor: string;
      conversions: string;
    }>;
  }> = {
    CAPTACAO: {
      title: 'Ranking de Captações de Imóveis',
      description: 'Liderança em novos imóveis angariados, captação com exclusividade e qualidade Canal Pró',
      icon: <Home className="w-5 h-5" />,
      color: 'blue',
      unitName: 'Captações Ativas',
      leaders: [
        {
          id: '1',
          name: 'Carlos Mendes',
          role: 'Corretor Sênior',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          score: 18,
          secondaryMetric: '12 Exclusividades (66%)',
          badgeText: 'Top Angariador',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          conversions: 'VGC Angariado R$ 34.8M'
        },
        {
          id: '2',
          name: 'Juliana Siqueira',
          role: 'Consultora Especialista',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          score: 14,
          secondaryMetric: '8 Exclusividades',
          badgeText: 'Foco Alto Padrão',
          badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
          conversions: 'VGC Angariado R$ 22.4M'
        },
        {
          id: '3',
          name: 'Rodrigo Faro',
          role: 'Corretor Pleno',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          score: 11,
          secondaryMetric: '6 Exclusividades',
          badgeText: 'Mais Ágil no Cadastro',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          conversions: 'VGC Angariado R$ 16.1M'
        },
        {
          id: '4',
          name: 'Beatriz Vasconcelos',
          role: 'Consultora de Vendas',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          score: 8,
          secondaryMetric: '4 Exclusividades',
          badgeText: 'Fotos 360°',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          conversions: 'VGC Angariado R$ 11.2M'
        }
      ]
    },
    VENDAS: {
      title: 'Ranking de Vendas (VGV Intermediado)',
      description: 'Campeões de escrituração, maior faturamento de comissão e volume financeiro fechado',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'emerald',
      unitName: 'VGV Faturado',
      leaders: [
        {
          id: '2',
          name: 'Juliana Siqueira',
          role: 'Consultora Especialista',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          score: 14200000,
          secondaryMetric: '5 Fechamentos Ganho',
          badgeText: 'Campeã do Mês',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          conversions: 'Comissão Líquida R$ 340.800'
        },
        {
          id: '1',
          name: 'Carlos Mendes',
          role: 'Corretor Sênior',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          score: 9800000,
          secondaryMetric: '4 Fechamentos Ganho',
          badgeText: 'Vice-Líder VGV',
          badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
          conversions: 'Comissão Líquida R$ 235.200'
        },
        {
          id: '3',
          name: 'Rodrigo Faro',
          role: 'Corretor Pleno',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          score: 5400000,
          secondaryMetric: '2 Fechamentos Ganho',
          badgeText: 'Revelação',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          conversions: 'Comissão Líquida R$ 129.600'
        },
        {
          id: '5',
          name: 'Marcos Silveira',
          role: 'Corretor Associado',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          score: 3200000,
          secondaryMetric: '1 Fechamento Ganho',
          badgeText: 'Fechamento Rápido',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          conversions: 'Comissão Líquida R$ 76.800'
        }
      ]
    },
    LOCACAO: {
      title: 'Ranking de Locações & Contratos',
      description: 'Líderes em contratos de aluguel assinados, receita recorrente e agilidade em vistorias',
      icon: <KeyRound className="w-5 h-5" />,
      color: 'purple',
      unitName: 'Contratos Assinados',
      leaders: [
        {
          id: '4',
          name: 'Beatriz Vasconcelos',
          role: 'Especialista em Locação',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          score: 22,
          secondaryMetric: 'R$ 88.000/mês locado',
          badgeText: 'Mestre da Locação',
          badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
          conversions: 'Taxa Adm Gerada R$ 8.800/mês'
        },
        {
          id: '3',
          name: 'Rodrigo Faro',
          role: 'Corretor Pleno',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          score: 16,
          secondaryMetric: 'R$ 56.400/mês locado',
          badgeText: 'Zero Vacância',
          badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
          conversions: 'Taxa Adm Gerada R$ 5.640/mês'
        },
        {
          id: '5',
          name: 'Marcos Silveira',
          role: 'Corretor Associado',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          score: 12,
          secondaryMetric: 'R$ 41.200/mês locado',
          badgeText: '100% Análise Aprovada',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          conversions: 'Taxa Adm Gerada R$ 4.120/mês'
        },
        {
          id: '1',
          name: 'Carlos Mendes',
          role: 'Corretor Sênior',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          score: 7,
          secondaryMetric: 'R$ 29.500/mês locado',
          badgeText: 'Locação Comercial',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          conversions: 'Taxa Adm Gerada R$ 2.950/mês'
        }
      ]
    },
    SLA: {
      title: 'Ranking de SLA & Rapidez de 1º Contato',
      description: 'Menor tempo médio de resposta ao lead (em minutos) desde a entrada na Roleta 24/7',
      icon: <Zap className="w-5 h-5" />,
      color: 'amber',
      unitName: 'Tempo Médio Resposta',
      leaders: [
        {
          id: '3',
          name: 'Rodrigo Faro',
          role: 'Corretor Pleno',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          score: 3.2, // minutes
          secondaryMetric: '99.4% no prazo (<10 min)',
          badgeText: 'Raio de Resposta',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          conversions: '142 Leads Atendidos'
        },
        {
          id: '2',
          name: 'Juliana Siqueira',
          role: 'Consultora Especialista',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          score: 4.8,
          secondaryMetric: '98.1% no prazo (<10 min)',
          badgeText: 'Alta Eficiência',
          badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
          conversions: '128 Leads Atendidos'
        },
        {
          id: '4',
          name: 'Beatriz Vasconcelos',
          role: 'Consultora de Vendas',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          score: 6.5,
          secondaryMetric: '95.8% no prazo (<10 min)',
          badgeText: 'Plantão Ativo',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          conversions: '96 Leads Atendidos'
        },
        {
          id: '1',
          name: 'Carlos Mendes',
          role: 'Corretor Sênior',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          score: 8.9,
          secondaryMetric: '92.3% no prazo (<10 min)',
          badgeText: 'Consistente',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          conversions: '110 Leads Atendidos'
        }
      ]
    },
    OFERTAS: {
      title: 'Ranking de Ofertas & Propostas Formais',
      description: 'Volume de propostas formais abertas, negociações ativas e taxa de aceite pelo proprietário',
      icon: <FileCheck className="w-5 h-5" />,
      color: 'indigo',
      unitName: 'Propostas Registradas',
      leaders: [
        {
          id: '2',
          name: 'Juliana Siqueira',
          role: 'Consultora Especialista',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          score: 28,
          secondaryMetric: '82% Aceite de Proposta',
          badgeText: 'Negociadora de Ouro',
          badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          conversions: 'Volume Proposto: R$ 42.5M'
        },
        {
          id: '1',
          name: 'Carlos Mendes',
          role: 'Corretor Sênior',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          score: 22,
          secondaryMetric: '75% Aceite de Proposta',
          badgeText: 'Propostas Qualificadas',
          badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
          conversions: 'Volume Proposto: R$ 28.1M'
        },
        {
          id: '3',
          name: 'Rodrigo Faro',
          role: 'Corretor Pleno',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          score: 17,
          secondaryMetric: '68% Aceite de Proposta',
          badgeText: 'Contraproposta Ativa',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          conversions: 'Volume Proposto: R$ 19.3M'
        },
        {
          id: '5',
          name: 'Marcos Silveira',
          role: 'Corretor Associado',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          score: 11,
          secondaryMetric: '61% Aceite de Proposta',
          badgeText: 'Em Crescimento',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          conversions: 'Volume Proposto: R$ 9.8M'
        }
      ]
    },
    USO_CRM: {
      title: 'Ranking de Uso do CRM & Disciplina Comercial',
      description: 'Lançamento de tarefas no prazo, anotações de follow-up, funil atualizado e zero estagnação',
      icon: <Activity className="w-5 h-5" />,
      color: 'teal',
      unitName: 'Pontuação de Adoção',
      leaders: [
        {
          id: '4',
          name: 'Beatriz Vasconcelos',
          role: 'Consultora de Vendas',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          score: 995, // max 1000
          secondaryMetric: '0 Tarefas Atrasadas',
          badgeText: 'Organização Máxima',
          badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
          conversions: '420 Registros de Timeline'
        },
        {
          id: '3',
          name: 'Rodrigo Faro',
          role: 'Corretor Pleno',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          score: 960,
          secondaryMetric: '1 Tarefa Atrasada',
          badgeText: 'Follow-ups em Dia',
          badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
          conversions: '380 Registros de Timeline'
        },
        {
          id: '2',
          name: 'Juliana Siqueira',
          role: 'Consultora Especialista',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          score: 910,
          secondaryMetric: '2 Tarefas Atrasadas',
          badgeText: 'Funil Perfeito',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          conversions: '315 Registros de Timeline'
        },
        {
          id: '1',
          name: 'Carlos Mendes',
          role: 'Corretor Sênior',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          score: 870,
          secondaryMetric: '4 Tarefas Atrasadas',
          badgeText: 'Atualizado Semanalmente',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          conversions: '290 Registros de Timeline'
        }
      ]
    },
    ATENDIMENTO_LEADS: {
      title: 'Ranking de Atendimento & Satisfação dos Leads',
      description: 'Avaliação NPS dos clientes compradores e locatários, índice de conversão e feedback 5 estrelas',
      icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />,
      color: 'rose',
      unitName: 'Avaliação Média',
      leaders: [
        {
          id: '2',
          name: 'Juliana Siqueira',
          role: 'Consultora Especialista',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          score: 4.96, // 5 stars
          secondaryMetric: '84 Avaliações 5 Estrelas',
          badgeText: 'Encantamento 5 Estrelas',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          conversions: 'Taxa de Conversão: 24.2%'
        },
        {
          id: '4',
          name: 'Beatriz Vasconcelos',
          role: 'Consultora de Vendas',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          score: 4.91,
          secondaryMetric: '62 Avaliações 5 Estrelas',
          badgeText: 'Atendimento Humanizado',
          badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
          conversions: 'Taxa de Conversão: 21.8%'
        },
        {
          id: '1',
          name: 'Carlos Mendes',
          role: 'Corretor Sênior',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          score: 4.88,
          secondaryMetric: '71 Avaliações 5 Estrelas',
          badgeText: 'Consultor Recomendado',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          conversions: 'Taxa de Conversão: 19.5%'
        },
        {
          id: '3',
          name: 'Rodrigo Faro',
          role: 'Corretor Pleno',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          score: 4.82,
          secondaryMetric: '49 Avaliações 5 Estrelas',
          badgeText: 'Presteza & Cordialidade',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          conversions: 'Taxa de Conversão: 18.2%'
        }
      ]
    }
  };

  const currentCategoryData = RANKING_DATA[activeCategory];

  const handleAddReferral = () => {
    if (!refName.trim() || !leadClientName.trim()) return;
    const newRef: ReferralLead = {
      id: `ref_${Date.now()}`,
      referrerName: refName,
      referrerPhone: refPhone || '(11) 99999-0000',
      referrerPix: 'pix.indicador@banco.com.br',
      relationship: 'PORTEIRO',
      leadClientName: leadClientName,
      leadClientPhone: leadClientPhone || '(11) 98888-1111',
      interestType: 'COMPRA',
      status: 'EM_NEGOCIACAO',
      bountyRewardAmount: 2500,
      submittedAt: 'Agora',
    };
    setReferrals([newRef, ...referrals]);
    setShowNewReferralModal(false);
    setRefName('');
    setLeadClientName('');
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
                Rankings Comerciais & Gamificação
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Placar em tempo real para Captações, Vendas, Locações, SLA, Ofertas, Uso do CRM e Atendimento
              </p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setPeriod('MES')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'MES' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setPeriod('TRIMESTRE')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'TRIMESTRE' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trimestre
          </button>
          <button
            onClick={() => setPeriod('ANO')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'ANO' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ano 2026
          </button>
        </div>
      </div>

      {/* BANNER MODO TV SALÃO DE VENDAS (16:9) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border border-amber-500/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 font-black">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                Painel TV Salão de Vendas (Modo Apresentação 16:9)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse">
                Ao Vivo
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Transmissão automática com troca de slides em tela cheia para Smart TVs do salão: Equipe Campeã, Pódio, Vendas, Locações, SLA, Captações e Mural de Conquistas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {/* GESTÃO & NOTIFICAR TV SALÃO & TOCAR SINO */}
          <button
            onClick={() => setShowTvControlModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Gestão da TV Salão: Tocar Sino Virtual, Informativos, Metas, Avisos, Banners e Alternância"
          >
            <Sliders className="w-4 h-4 text-indigo-200" />
            <span>Notificar TV & Sino</span>
          </button>

          <button
            onClick={() => {
              if (onOpenTvMode) {
                onOpenTvMode();
              } else {
                try {
                  window.open('/?view=tv-ranking', '_blank');
                } catch {
                  window.location.search = '?view=tv-ranking';
                }
              }
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            <span>Iniciar no Salão (Tela Cheia)</span>
          </button>

          <button
            onClick={async () => {
              const tvUrl = `${window.location.origin}${window.location.pathname}?view=tv-ranking`;
              try {
                await navigator.clipboard.writeText(tvUrl);
                setCopiedTvLink(true);
                setTimeout(() => setCopiedTvLink(false), 3000);
              } catch {
                setCopiedTvLink(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              copiedTvLink 
                ? 'bg-emerald-600 border-emerald-500 text-white' 
                : 'bg-slate-800/90 border-slate-700 hover:bg-slate-800 text-slate-200'
            }`}
            title="Copiar Link direto para abrir no navegador da Smart TV"
          >
            {copiedTvLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedTvLink ? 'Copiado!' : 'Copiar Link da TV'}</span>
          </button>
        </div>
      </div>

      {/* 7 RANKING TABS BAR */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto border border-slate-200/80 shadow-2xs text-xs font-semibold scrollbar-none">
        {[
          { id: 'CAPTACAO', label: '1. Captações', icon: <Home className="w-4 h-4" /> },
          { id: 'VENDAS', label: '2. Vendas', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'LOCACAO', label: '3. Locações', icon: <KeyRound className="w-4 h-4" /> },
          { id: 'SLA', label: '4. SLA (Velocidade)', icon: <Zap className="w-4 h-4" /> },
          { id: 'OFERTAS', label: '5. Ofertas & Propostas', icon: <FileCheck className="w-4 h-4" /> },
          { id: 'USO_CRM', label: '6. Uso do CRM', icon: <Activity className="w-4 h-4" /> },
          { id: 'ATENDIMENTO_LEADS', label: '7. Atendimento dos Leads', icon: <Star className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as RankingCategory)}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === tab.id
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Podium & Leaderboard Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
        
        {/* Banner Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>{currentCategoryData.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentCategoryData.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span>Premiação Top 1:</span>
            <strong className="font-bold text-blue-900">Bônus Pix + Troféu Destaque</strong>
          </div>
        </div>

        {/* Podium 3 Top Winners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* 2º Lugar (Prata) */}
          {currentCategoryData.leaders[1] && (
            <div className="p-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-slate-200 flex flex-col items-center text-center space-y-3 shadow-2xs relative order-2 md:order-1">
              <span className="absolute -top-3.5 px-3 py-0.5 rounded-full text-[11px] font-black bg-slate-300 text-slate-800 border border-slate-400 shadow-xs">
                2º LUGAR (PRATA)
              </span>
              <img
                src={currentCategoryData.leaders[1].avatar}
                alt={currentCategoryData.leaders[1].name}
                className="w-16 h-16 rounded-full object-cover border-4 border-slate-300 shadow-md mt-2"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{currentCategoryData.leaders[1].name}</h4>
                <p className="text-xs text-slate-500">{currentCategoryData.leaders[1].role}</p>
              </div>

              <div className="p-2.5 bg-slate-100/80 rounded-xl w-full">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{currentCategoryData.unitName}</span>
                <strong className="text-lg font-black text-slate-900 font-mono">
                  {activeCategory === 'VENDAS' 
                    ? currentCategoryData.leaders[1].score.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                    : activeCategory === 'SLA'
                    ? `${currentCategoryData.leaders[1].score} min`
                    : activeCategory === 'ATENDIMENTO_LEADS'
                    ? `★ ${currentCategoryData.leaders[1].score.toFixed(2)}`
                    : currentCategoryData.leaders[1].score}
                </strong>
                <p className="text-[11px] text-slate-600 mt-0.5">{currentCategoryData.leaders[1].secondaryMetric}</p>
              </div>

              <span className="text-[10px] text-slate-500">{currentCategoryData.leaders[1].conversions}</span>
            </div>
          )}

          {/* 1º Lugar (Ouro) */}
          {currentCategoryData.leaders[0] && (
            <div className="p-6 bg-gradient-to-b from-amber-50/80 via-amber-50/30 to-white rounded-3xl border-2 border-amber-400 flex flex-col items-center text-center space-y-3.5 shadow-md relative order-1 md:order-2 -mt-2">
              <span className="absolute -top-4 px-4 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-500 shadow-sm flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                1º LUGAR (OURO)
              </span>
              <div className="relative mt-2">
                <img
                  src={currentCategoryData.leaders[0].avatar}
                  alt={currentCategoryData.leaders[0].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-lg ring-4 ring-amber-100"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  ★
                </span>
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900">{currentCategoryData.leaders[0].name}</h4>
                <p className="text-xs text-amber-800 font-semibold">{currentCategoryData.leaders[0].role}</p>
              </div>

              <div className="p-3 bg-amber-100/60 border border-amber-200 rounded-xl w-full">
                <span className="text-[10px] text-amber-800 font-bold uppercase block">{currentCategoryData.unitName}</span>
                <strong className="text-xl font-black text-amber-950 font-mono">
                  {activeCategory === 'VENDAS' 
                    ? currentCategoryData.leaders[0].score.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                    : activeCategory === 'SLA'
                    ? `${currentCategoryData.leaders[0].score} min`
                    : activeCategory === 'ATENDIMENTO_LEADS'
                    ? `★ ${currentCategoryData.leaders[0].score.toFixed(2)}`
                    : currentCategoryData.leaders[0].score}
                </strong>
                <p className="text-xs text-amber-900 font-bold mt-0.5">{currentCategoryData.leaders[0].secondaryMetric}</p>
              </div>

              <span className="text-xs text-slate-600 font-semibold">{currentCategoryData.leaders[0].conversions}</span>
            </div>
          )}

          {/* 3º Lugar (Bronze) */}
          {currentCategoryData.leaders[2] && (
            <div className="p-5 bg-gradient-to-b from-amber-50/20 to-white rounded-2xl border-2 border-amber-200/80 flex flex-col items-center text-center space-y-3 shadow-2xs relative order-3">
              <span className="absolute -top-3.5 px-3 py-0.5 rounded-full text-[11px] font-black bg-amber-200 text-amber-900 border border-amber-300 shadow-xs">
                3º LUGAR (BRONZE)
              </span>
              <img
                src={currentCategoryData.leaders[2].avatar}
                alt={currentCategoryData.leaders[2].name}
                className="w-16 h-16 rounded-full object-cover border-4 border-amber-300 shadow-md mt-2"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{currentCategoryData.leaders[2].name}</h4>
                <p className="text-xs text-slate-500">{currentCategoryData.leaders[2].role}</p>
              </div>

              <div className="p-2.5 bg-slate-100/80 rounded-xl w-full">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{currentCategoryData.unitName}</span>
                <strong className="text-lg font-black text-slate-900 font-mono">
                  {activeCategory === 'VENDAS' 
                    ? currentCategoryData.leaders[2].score.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                    : activeCategory === 'SLA'
                    ? `${currentCategoryData.leaders[2].score} min`
                    : activeCategory === 'ATENDIMENTO_LEADS'
                    ? `★ ${currentCategoryData.leaders[2].score.toFixed(2)}`
                    : currentCategoryData.leaders[2].score}
                </strong>
                <p className="text-[11px] text-slate-600 mt-0.5">{currentCategoryData.leaders[2].secondaryMetric}</p>
              </div>

              <span className="text-[10px] text-slate-500">{currentCategoryData.leaders[2].conversions}</span>
            </div>
          )}
        </div>

        {/* Complete Leaderboard Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Classificação Geral da Categoria ({currentCategoryData.leaders.length} Corretores)</span>
            <span className="text-[11px] font-normal text-slate-400">Atualizado a cada 15 min</span>
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            {currentCategoryData.leaders.map((leader, index) => (
              <div
                key={leader.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shadow-2xs ${
                    index === 0
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : index === 1
                      ? 'bg-slate-300 text-slate-800 font-bold'
                      : index === 2
                      ? 'bg-amber-200 text-amber-900 font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{index + 1}
                  </span>

                  <img
                    src={leader.avatar}
                    alt={leader.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-slate-900">{leader.name}</strong>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${leader.badgeColor}`}>
                        {leader.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{leader.role} • {leader.conversions}</p>
                  </div>
                </div>

                <div className="text-right sm:self-auto self-end">
                  <strong className="text-sm sm:text-base font-black text-slate-900 font-mono block">
                    {activeCategory === 'VENDAS' 
                      ? leader.score.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                      : activeCategory === 'SLA'
                      ? `${leader.score} min`
                      : activeCategory === 'ATENDIMENTO_LEADS'
                      ? `★ ${leader.score.toFixed(2)}`
                      : `${leader.score} ${currentCategoryData.unitName.split(' ')[0]}`}
                  </strong>
                  <span className="text-xs text-slate-500 font-medium">{leader.secondaryMetric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicou, Ganhou (Programa de Parcerias com Porteiros & Síndicos) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-600" />
              <span>Programa de Indicações "Indicou, Ganhou" (Porteiros, Síndicos & Clientes)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recompensas via Pix automático por captação e fechamento de negócios indicados
            </p>
          </div>

          <button
            onClick={() => setShowNewReferralModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Indicação</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-blue-100 text-blue-800">
                  {ref.relationship}
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  R$ {ref.bountyRewardAmount.toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{ref.referrerName}</p>
              <p className="text-slate-500">Lead: <strong>{ref.leadClientName}</strong> ({ref.interestType})</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                ref.status === 'FECHADA_PREMIO_LIBERADO' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : ref.status === 'RECEBIDA'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {ref.status === 'FECHADA_PREMIO_LIBERADO' ? '✓ Pix Liberado' : ref.status === 'RECEBIDA' ? 'Em Validação' : 'Em Negociação'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Referral Modal */}
      {showNewReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Nova Indicação de Porteiro/Parceiro</h3>
              <button 
                type="button"
                onClick={() => setShowNewReferralModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Fechar"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Indicador</label>
                <input
                  type="text"
                  placeholder="Ex: Seu Antônio (Porteiro Cond. Mirante)"
                  value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefone / Pix do Indicador</label>
                <input
                  type="text"
                  placeholder="(11) 99999-0000"
                  value={refPhone}
                  onChange={(e) => setRefPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Cliente Indicado</label>
                <input
                  type="text"
                  placeholder="Ex: Roberto Silva (Comprador)"
                  value={leadClientName}
                  onChange={(e) => setLeadClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp do Cliente Indicado</label>
                <input
                  type="text"
                  placeholder="(11) 98888-1111"
                  value={leadClientPhone}
                  onChange={(e) => setLeadClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewReferralModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddReferral}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Salvar Indicação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestão e Notificação da TV Salão */}
      {showTvControlModal && (
        <TvControlManagementModal
          isOpen={showTvControlModal}
          onClose={() => setShowTvControlModal(false)}
        />
      )}

    </div>
  );
};

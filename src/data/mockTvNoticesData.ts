import { TvNoticeItem } from '../types/tvRanking';

export const INITIAL_TV_NOTICES: TvNoticeItem[] = [
  {
    id: 'notice_1',
    title: 'Desafio da Semana: 12 Contratos Fechados!',
    subtitle: 'Campanha Acelera Salão de Vendas',
    category: 'META_SEMANA',
    message: 'Nossa meta semanal é atingir 12 contratos assinados até sexta-feira às 18h. Já foram 9 contratos homologados! Faltam apenas 3 para a meta máxima da imobiliária.',
    targetHighlight: 'Faltam apenas 3 contratos para o Bônus Geral!',
    targetPercent: 75,
    badgeText: 'META DA SEMANA',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    authorName: 'Emerson Carneiro',
    authorRole: 'Diretor Comercial & Operações',
    active: true,
    priority: 'ALTA',
    durationSeconds: 12,
    createdAt: 'Hoje'
  },
  {
    id: 'notice_2',
    title: 'Lançamento Exclusivo: Horizon Tower Jardins',
    subtitle: 'Construtora Parceira Cyrela & Mitre',
    category: 'PROPAGANDA_LANCAMENTO',
    message: 'Abertura oficial dos decorados neste sábado. Unidades de 145m² a 220m² com condições facilitadas para investidores. Comissão de 4,2% + Bônus de R$ 5.000 no primeiro fechamento!',
    targetHighlight: 'Comissão Especial de 4,2% + Bônus Pix',
    badgeText: 'LANÇAMENTO DO MÊS',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    authorName: 'Coordenação de Lançamentos',
    authorRole: 'Gestão de Parcerias',
    active: true,
    priority: 'NORMAL',
    durationSeconds: 15,
    createdAt: 'Hoje'
  },
  {
    id: 'notice_3',
    title: 'Reunião Geral & Alinhamento Estratégico',
    subtitle: 'Comemoração dos Resultados e Novas Metas',
    category: 'REUNIAO_GERAL',
    message: 'Todos os corretores, gerentes de squad e correspondentes bancários estão convocados para a reunião geral de sexta-feira às 17h no salão nobre.',
    badgeText: 'AVISO IMPORTANTE',
    authorName: 'Diretoria Executiva',
    authorRole: 'Presidência AcertGo',
    active: true,
    priority: 'ALTA',
    durationSeconds: 10,
    createdAt: 'Hoje'
  },
  {
    id: 'notice_4',
    title: 'Plantão de Domingo: Stand Grand Parque',
    subtitle: 'Escala de Rodízio & Atendimento Presencial',
    category: 'PLATAO_VENDAS',
    message: 'Escala de atendimento confirmada na roleta presencial. Expectativa de mais de 80 famílias visitantes cadastradas pelos portais e mídias sociais.',
    targetHighlight: 'Mais de 80 clientes pré-agendados',
    badgeText: 'PLANTÃO DE VENDAS',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    authorName: 'Camila Albuquerque',
    authorRole: 'Gerente Geral de Vendas',
    active: true,
    priority: 'NORMAL',
    durationSeconds: 12,
    createdAt: 'Ontem'
  }
];

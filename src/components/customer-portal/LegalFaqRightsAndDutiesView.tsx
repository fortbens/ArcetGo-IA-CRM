import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building, 
  ShieldCheck, 
  Calculator, 
  DollarSign, 
  Phone, 
  MessageSquare, 
  FileText, 
  Wrench, 
  Home, 
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export type FaqCategory = 
  | 'TODOS' 
  | 'INQUILINO' 
  | 'PROPRIETARIO' 
  | 'CONDOMINIO' 
  | 'OBRAS_REPAROS' 
  | 'RESCISAO_MULTA' 
  | 'IPTU_SEGUROS';

interface FaqItem {
  id: string;
  category: FaqCategory;
  responsibility: 'INQUILINO' | 'PROPRIETARIO' | 'AMBOS' | 'LEI_GERAL';
  lawArticle: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  practicalTip?: string;
}

export const LEGAL_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq_infiltracao_telhado',
    category: 'OBRAS_REPAROS',
    responsibility: 'PROPRIETARIO',
    lawArticle: 'Artigo 22, Incisos I e IV da Lei nº 8.245/1991',
    question: 'Quem paga conserto de infiltrações, telhado com goteira ou encanamento na parede?',
    shortAnswer: 'Responsabilidade do PROPRIETÁRIO (Locador).',
    detailedAnswer: 'A Lei do Inquilinato estabelece expressamente que o locador é obrigado a entregar o imóvel em estado de servir ao uso a que se destina e responder pelos vícios ou defeitos anteriores à locação, bem como garantir sua solidez estrutural. Vazamentos em tubulações embutidas na parede, trincas estruturais, infiltrações decorrentes de lajes ou telhados são de inteira responsabilidade do proprietário.',
    practicalTip: 'O inquilino deve notificar a imobiliária imediatamente por escrito (com fotos/vídeos). O Art. 23, IV obriga o locatário a avisar o locador sem demora para evitar o agravamento do dano.'
  },
  {
    id: 'faq_torneira_chuveiro_lampada',
    category: 'OBRAS_REPAROS',
    responsibility: 'INQUILINO',
    lawArticle: 'Artigo 23, Inciso V da Lei nº 8.245/1991',
    question: 'Quem deve pagar troca de lâmpadas, vedação de torneiras e resistência de chuveiro?',
    shortAnswer: 'Responsabilidade do INQUILINO (Locatário).',
    detailedAnswer: 'Pequenos reparos decorrentes do uso diário e desgaste comum da moradia cabem ao locatário. Isso inclui substituição de lâmpadas queimadas, troca de reparo/borrachinha de torneiras com pinga-pinga, troca de resistência de chuveiros, desentupimento de pias por resíduos domésticos e manutenção de fechaduras utilizadas no dia a dia.',
    practicalTip: 'Guarde os comprovantes das manutenções preventivas para apresentar caso haja qualquer dúvida durante a vistoria periódica.'
  },
  {
    id: 'faq_despesas_condominio',
    category: 'CONDOMINIO',
    responsibility: 'AMBOS',
    lawArticle: 'Artigos 22 (Inciso X) e 23 (Inciso XII) da Lei nº 8.245/1991',
    question: 'O que é despesa ORDINÁRIA e EXTRAORDINÁRIA de condomínio? Quem paga cada uma?',
    shortAnswer: 'Inquilino paga as ORDINÁRIAS; Proprietário paga as EXTRAORDINÁRIAS.',
    detailedAnswer: 'DESPESAS ORDINÁRIAS (Inquilino): Necessárias à administração e conservação rotineira do edifício, tais como: salários e encargos dos funcionários da portaria/limpeza, água e luz das áreas comuns, limpeza de caixas d\'água, manutenção preventiva rotineira de elevadores e bombas.\n\nDESPESAS EXTRAORDINÁRIAS (Proprietário): Obras que valorizam ou preservam o patrimônio do edifício, tais como: pintura de fachadas externas, reformas estruturais, instalação de portões eletrônicos novos, compra de equipamentos de segurança, indenizações trabalhistas de funcionários anteriores à locação e FUNDO DE RESERVA.',
    practicalTip: 'Se a administradora do condomínio emitir tudo em boleto único, o inquilino paga e solicita o reembolso/desconto imediato da cota extraordinária no boleto de aluguel do mês seguinte.'
  },
  {
    id: 'faq_fundo_de_reserva',
    category: 'CONDOMINIO',
    responsibility: 'PROPRIETARIO',
    lawArticle: 'Artigo 22, Inciso X, alínea "g" da Lei nº 8.245/1991',
    question: 'Quem paga o Fundo de Reserva do condomínio?',
    shortAnswer: 'Responsabilidade exclusiva do PROPRIETÁRIO.',
    detailedAnswer: 'O Fundo de Reserva destina-se a acumular recursos para obras futuras e contingências patrimoniais do condomínio. Por expressa disposição da alínea "g" do inciso X do Art. 22 da Lei do Inquilinato, o pagamento do fundo de reserva é encargo exclusivo do locador.',
    practicalTip: 'Caso o condomínio tenha utilizado o fundo de reserva para cobrir gastos ordinários rotineiros e o reconstitua no mesmo período, essa reposição pontual pode ser ordinária, mas qualquer acréscimo patrimonial cabe ao proprietário.'
  },
  {
    id: 'faq_multa_rescisoria_proporcional',
    category: 'RESCISAO_MULTA',
    responsibility: 'LEI_GERAL',
    lawArticle: 'Artigo 4º da Lei Federal nº 8.245/1991 e Artigo 413 do Código Civil',
    question: 'Posso desocupar antes dos 30 meses? A multa rescisória pode ser cobrada cheia?',
    shortAnswer: 'Pode desocupar, e a multa NUNCA pode ser cobrada integralmente; é SEMPRE proporcional.',
    detailedAnswer: 'O inquilino pode devolver o imóvel a qualquer momento pagando a multa compensatória prevista no contrato (geralmente equivalente a 3 aluguéis). Contudo, a Lei do Inquilinato proíbe expressamente a cobrança da multa cheia: ela deve ser calculada de forma rigorosamente PROPORCIONAL ao tempo que falta para o término do contrato.\n\nExemplo: Se o contrato era de 30 meses com multa de 3 aluguéis e o inquilino cumpriu 15 meses (metade do contrato), a multa a pagar será de apenas 1,5 aluguel (50% do valor).',
    practicalTip: 'Utilize o simulador da Lei do Inquilinato abaixo para calcular exatamente o valor da multa com os meses restantes do seu contrato.'
  },
  {
    id: 'faq_isencao_multa_transferencia',
    category: 'RESCISAO_MULTA',
    responsibility: 'INQUILINO',
    lawArticle: 'Artigo 4º, Parágrafo Único da Lei nº 8.245/1991',
    question: 'Existe situação em que o inquilino fica ISENTO da multa ao devolver o imóvel antes do prazo?',
    shortAnswer: 'SIM: em caso de transferência de trabalho comprovada pelo empregador.',
    detailedAnswer: 'O Parágrafo Único do Artigo 4º da Lei nº 8.245/1991 concede isenção total da multa rescisória ao locatário quando este for transferido de localidade por seu empregador (público ou privado). Para ter direito à isenção, o inquilino deve notificar o locador por escrito com antecedência mínima de 30 (trinta) dias e apresentar carta formal do empregador comprovando a transferência profissional.',
    practicalTip: 'Atenção: a regra se aplica quando o empregador determina a transferência. Demissões voluntárias ou mudança de emprego por iniciativa do trabalhador não dão direito à isenção legal.'
  },
  {
    id: 'faq_proprietario_pedir_de_volta',
    category: 'RESCISAO_MULTA',
    responsibility: 'PROPRIETARIO',
    lawArticle: 'Artigo 4º, caput e Artigo 46 da Lei nº 8.245/1991',
    question: 'O proprietário pode pedir o imóvel de volta antes de acabar o prazo de 30 meses?',
    shortAnswer: 'NÃO. Durante o prazo contratual o proprietário não pode reaver o imóvel.',
    detailedAnswer: 'O Artigo 4º determina que durante o prazo estipulado para a duração do contrato, não poderá o locador reaver o imóvel alugado, mesmo que se ofereça para pagar indenização ao inquilino. O locador só pode retomar antes do término nos casos excepcionais do Artigo 9º (ex: falta de pagamento de aluguel, infração contratual grave ou necessidade de reparações urgentes determinadas pelo Poder Público).',
    practicalTip: 'Ao término dos 30 meses estipulados no contrato residencial, o locador pode solicitar a devolução com notificação de 30 dias (denúncia vazia).'
  },
  {
    id: 'faq_iptu_seguro_incendio',
    category: 'IPTU_SEGUROS',
    responsibility: 'AMBOS',
    lawArticle: 'Artigo 22, Inciso VIII da Lei nº 8.245/1991',
    question: 'Quem deve pagar o IPTU e o Seguro contra Incêndio?',
    shortAnswer: 'Pela lei cabe ao Proprietário, SALVO se expressamente transferido ao Inquilino no contrato.',
    detailedAnswer: 'O Artigo 22, inciso VIII estabelece que os impostos (IPTU) e o seguro complementar contra fogo são obrigações do proprietário, "salvo disposição expressa em contrário no contrato". No mercado imobiliário brasileiro e nos padrões de CRECI, é praxe comercial constar no contrato de locação que o inquilino arcará com as parcelas mensais do IPTU e a apólice de seguro contra incêndio durante a vigência da locação.',
    practicalTip: 'Consulte a Cláusula de Encargos do seu contrato. Se estiver expressa a obrigação do locatário, a cobrança é 100% legal e válida perante os tribunais.'
  },
  {
    id: 'faq_pintura_devolucao_vistoria',
    category: 'OBRAS_REPAROS',
    responsibility: 'INQUILINO',
    lawArticle: 'Artigo 23, Inciso III da Lei nº 8.245/1991',
    question: 'O inquilino é obrigado a pintar o imóvel na devolução?',
    shortAnswer: 'SIM, caso o imóvel tenha sido entregue com pintura nova no Laudo de Vistoria de Entrada.',
    detailedAnswer: 'O Artigo 23, inciso III estabelece a obrigação do inquilino de "restituir o imóvel, finda a locação, no estado em que o recebeu, salvo as deteriorações decorrentes do seu uso normal". Se na Vistoria de Entrada inicial constava expressamente que as paredes estavam recém-pintadas (sem furos ou manchas), o inquilino deve devolver nas mesmíssimas condições e cor original.',
    practicalTip: 'O Laudo de Vistoria de Entrada com fotos anexas assinado por ambas as partes é o documento oficial supremo que define as obrigações da vistoria de saída.'
  },
  {
    id: 'faq_reajuste_anual_aluguel',
    category: 'INQUILINO',
    responsibility: 'LEI_GERAL',
    lawArticle: 'Artigo 18 da Lei 8.245/1991 e Lei Federal nº 9.069/1995',
    question: 'Como funciona o reajuste anual do aluguel? Qual índice deve ser aplicado?',
    shortAnswer: 'Ocorre a cada 12 meses ininterruptos, baseado no índice estipulado no contrato (IPCA ou IGP-M).',
    detailedAnswer: 'A legislação brasileira (Lei nº 9.069/1995) proíbe reajustes de aluguel em periodicidade inferior a 12 meses. O reajuste ocorre automaticamente no aniversário do contrato, aplicando-se a variação acumulada do índice oficial pactuado pelas partes (geralmente IPCA/IBGE ou IGP-M/FGV). Se o índice for negativo (deflação), a jurisprudência dominante entende que o valor se mantém ou reduz conforme previsão contratual.',
    practicalTip: 'A imobiliária notifica ambas as partes com antecedência mínima de 30 dias contendo a memória de cálculo do novo valor vigente.'
  },
  {
    id: 'faq_comprovante_quitacao_recibo',
    category: 'PROPRIETARIO',
    responsibility: 'PROPRIETARIO',
    lawArticle: 'Artigo 22, Inciso VI da Lei nº 8.245/1991',
    question: 'O proprietário ou a imobiliária é obrigado a fornecer recibo detalhado?',
    shortAnswer: 'SIM. O locador é legalmente obrigado a fornecer recibo discriminado de todas as quantias.',
    detailedAnswer: 'O Artigo 22, inciso VI impõe ao locador a obrigação de "fornecer ao locatário recibo discriminado das importâncias por este pagas, sendo vedada a quitação genérica". O inquilino tem o direito inalienável de saber exatamente quanto pagou de aluguel, condomínio, IPTU e taxa bancária.',
    practicalTip: 'No Portal do Cliente AcertGo, cada fatura quitada gera automaticamente o Recibo Oficial de Quitação com validade fiscal e jurídica disponível para download em PDF.'
  },
  {
    id: 'faq_vistoria_proprietario_entrar',
    category: 'PROPRIETARIO',
    responsibility: 'AMBOS',
    lawArticle: 'Artigo 23, Inciso IX da Lei nº 8.245/1991',
    question: 'O proprietário ou corretor pode entrar no imóvel alugado a qualquer momento?',
    shortAnswer: 'NÃO. A vistoria depende de combinação prévia de dia e hora.',
    detailedAnswer: 'Durante a locação, a posse direta do imóvel pertence exclusivamente ao inquilino (garantia constitucional de inviolabilidade do domicílio). O Artigo 23, inciso IX diz que o locatário é obrigado a "permitir a vistoria do imóvel pelo locador ou por seu mandatário, mediante combinação prévia de dia e hora, bem como admitir que seja o mesmo visitado e examinado por terceiros, na hipótese de venda". O proprietário não pode entrar sem aviso ou sem consentimento prévio.',
    practicalTip: 'Agendamentos de vistorias técnicas devem ser solicitados com no mínimo 48 horas de antecedência através dos canais oficiais da imobiliária.'
  },
  {
    id: 'faq_benfeitorias_indenizaveis',
    category: 'OBRAS_REPAROS',
    responsibility: 'PROPRIETARIO',
    lawArticle: 'Artigo 35 da Lei Federal nº 8.245/1991',
    question: 'Benfeitorias e reformas feitas pelo inquilino dão direito a indenização ou desconto no aluguel?',
    shortAnswer: 'Benfeitorias NECESSÁRIAS são indenizáveis; ÚTEIS dependem de autorização prévia por escrito.',
    detailedAnswer: 'A lei divide em 3 tipos:\n1. Necessárias (para conservar o imóvel e evitar ruína, ex: conserto urgente de telhado que caiu): São indenizáveis pelo proprietário mesmo que não tenham sido autorizadas previamente.\n2. Úteis (aumentam ou facilitam o uso, ex: instalação de grades de proteção, pia nova): Só são indenizáveis se o proprietário tiver autorizado previamente por escrito.\n3. Voluptuárias (mero deleite/estética, ex: revestimento decorativo): Não são indenizáveis, podendo ser retiradas ao final da locação sem estragar o imóvel.',
    practicalTip: 'Nunca execute obras sem notificar a imobiliária e formalizar a autorização por escrito para garantir direito a compensação.'
  },
  {
    id: 'faq_taxa_administracao_imobiliaria',
    category: 'PROPRIETARIO',
    responsibility: 'PROPRIETARIO',
    lawArticle: 'Artigo 22, Inciso VII da Lei nº 8.245/1991',
    question: 'Quem paga a taxa de administração e intermediação cobrada pela imobiliária?',
    shortAnswer: 'Responsabilidade exclusiva do PROPRIETÁRIO (Locador).',
    detailedAnswer: 'O Artigo 22, inciso VII determina que o locador é obrigado a "pagar as taxas de administração imobiliária, se houver, e de intermediações, nestas compreendidas as despesas necessárias à aferição da idoneidade do pretendente ou de seu fiador". É totalmente proibido transferir honorários de administração imobiliária para o inquilino.',
    practicalTip: 'A taxa é deduzida automaticamente do repasse mensal transferido ao locador, constando no extrato analítico da Área do Proprietário.'
  }
];

interface LegalFaqRightsAndDutiesViewProps {
  userRole?: 'INQUILINO' | 'PROPRIETARIO';
  onOpenTicketWithQuestion?: (questionText: string) => void;
}

export const LegalFaqRightsAndDutiesView: React.FC<LegalFaqRightsAndDutiesViewProps> = ({
  userRole = 'INQUILINO',
  onOpenTicketWithQuestion
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('TODOS');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(LEGAL_FAQ_ITEMS[0].id);

  // Calculator State for Early Termination Penalty (Art. 4º)
  const [calcRent, setCalcRent] = useState(3500);
  const [calcContractMonths, setCalcContractMonths] = useState(30);
  const [calcMonthsFulfilled, setCalcMonthsFulfilled] = useState(12);
  const [calcBasePenaltyMonths, setCalcBasePenaltyMonths] = useState(3);

  // Computed Proportional Penalty
  const penaltyCalculation = useMemo(() => {
    const totalContract = Math.max(1, calcContractMonths);
    const fulfilled = Math.min(totalContract, Math.max(0, calcMonthsFulfilled));
    const remainingMonths = totalContract - fulfilled;
    const fullPenalty = calcRent * calcBasePenaltyMonths;
    const proportionalPenalty = (fullPenalty / totalContract) * remainingMonths;
    const discountAmount = fullPenalty - proportionalPenalty;
    const discountPercent = totalContract > 0 ? (fulfilled / totalContract) * 100 : 0;

    return {
      fullPenalty,
      remainingMonths,
      proportionalPenalty,
      discountAmount,
      discountPercent
    };
  }, [calcRent, calcContractMonths, calcMonthsFulfilled, calcBasePenaltyMonths]);

  // Filtered FAQ Items
  const filteredFaqs = useMemo(() => {
    return LEGAL_FAQ_ITEMS.filter(item => {
      // Category filter
      if (selectedCategory === 'INQUILINO' && item.responsibility !== 'INQUILINO' && item.responsibility !== 'AMBOS') {
        return false;
      }
      if (selectedCategory === 'PROPRIETARIO' && item.responsibility !== 'PROPRIETARIO' && item.responsibility !== 'AMBOS') {
        return false;
      }
      if (selectedCategory !== 'TODOS' && selectedCategory !== 'INQUILINO' && selectedCategory !== 'PROPRIETARIO') {
        if (item.category !== selectedCategory) return false;
      }

      // Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesQ = item.question.toLowerCase().includes(query);
        const matchesShort = item.shortAnswer.toLowerCase().includes(query);
        const matchesDetail = item.detailedAnswer.toLowerCase().includes(query);
        const matchesArticle = item.lawArticle.toLowerCase().includes(query);
        if (!matchesQ && !matchesShort && !matchesDetail && !matchesArticle) return false;
      }

      return true;
    });
  }, [selectedCategory, searchTerm]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Legal Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>LEI FEDERAL Nº 8.245/1991 • DIREITOS E DEVERES NA LOCAÇÃO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tira-Dúvidas Jurídico: Guia da Lei do Inquilinato
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consulte com total clareza quem é responsável por cada despesa no imóvel. 
              Conheça as obrigações legais do <strong>Locatário (Inquilino - Art. 23)</strong> e do <strong>Locador (Proprietário - Art. 22)</strong> com embasamento jurídico e jurisprudência consolidada.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 text-center min-w-[140px] backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Art. 22 Lei 8.245</span>
              <span className="text-sm font-black text-emerald-300 block mt-0.5">Deveres do Locador</span>
              <span className="text-[10px] text-slate-400 block">Proprietário</span>
            </div>
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 text-center min-w-[140px] backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Art. 23 Lei 8.245</span>
              <span className="text-sm font-black text-blue-300 block mt-0.5">Deveres do Locatário</span>
              <span className="text-[10px] text-slate-400 block">Inquilino</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsibility Matrix: Quem Paga o Quê? */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Quadro Comparativo Rápido: Quem é Responsável?
            </h3>
            <p className="text-xs text-slate-500">
              Resumo prático das principais despesas conforme a legislação imobiliária brasileira
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Deveres do Inquilino */}
          <div className="bg-white rounded-3xl border border-blue-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-blue-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Obrigações do INQUILINO (Locatário)
                </h4>
                <span className="text-[11px] font-mono text-blue-700 font-semibold">
                  Artigo 23 da Lei nº 8.245/1991
                </span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Aluguel e encargos contratuais:</strong> pagar pontualmente no dia acordado.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Despesas ordinárias de condomínio:</strong> salários, portaria, limpeza, conservação e luz/água de áreas comuns.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Consumo individual:</strong> contas de energia elétrica, água, gás e internet.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Manutenção de desgaste diário:</strong> lâmpadas queimadas, borracha de torneiras, desentupimento de pias e ralos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Devolução nas mesmas condições:</strong> pintar e restituir no estado em que recebeu, conforme Laudo de Vistoria de Entrada.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Comunicação imediata de danos:</strong> avisar sem demora qualquer defeito ou infiltração cuja reparação caiba ao locador.</span>
              </li>
            </ul>
          </div>

          {/* Card: Deveres do Proprietário */}
          <div className="bg-white rounded-3xl border border-emerald-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Obrigações do PROPRIETÁRIO (Locador)
                </h4>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                  Artigo 22 da Lei nº 8.245/1991
                </span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Habitabilidade e solidez:</strong> entregar o imóvel em perfeito estado de servir ao uso a que se destina.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Obras estruturais:</strong> conserto de infiltrações profundas, telhados, trincas em vigas e encanamentos embutidos na parede.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Despesas extraordinárias de condomínio:</strong> reformas estruturais do prédio, pintura de fachada externa, instalação de portões novos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Fundo de Reserva:</strong> cota do condomínio destinada a obras e fundo patrimonial (Art. 22, X, "g").</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Vícios ocultos pré-existentes:</strong> defeitos que já existiam antes da entrega das chaves.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Taxa de administração imobiliária:</strong> honorários cobrados pela imobiliária para gerir a locação (Art. 22, VII).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Simulator: Calculadora de Multa Rescisória Proporcional (Art. 4º) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Simulador da Multa Rescisória Proporcional (Art. 4º da Lei nº 8.245)
              </h3>
              <p className="text-xs text-slate-500">
                Calcule a multa exata em caso de rescisão antecipada. A lei proíbe cobrar a multa cheia integralmente!
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Regra Pro Rata Temporis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Valor do Aluguel Mensal (R$):</label>
            <input
              type="number"
              value={calcRent}
              onChange={e => setCalcRent(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Prazo Total do Contrato (Meses):</label>
            <input
              type="number"
              value={calcContractMonths}
              onChange={e => setCalcContractMonths(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Meses Já Cumpridos:</label>
            <input
              type="number"
              value={calcMonthsFulfilled}
              onChange={e => setCalcMonthsFulfilled(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Multa Padrão (Nº de Aluguéis):</label>
            <select
              value={calcBasePenaltyMonths}
              onChange={e => setCalcBasePenaltyMonths(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={3}>3 Aluguéis (Padrão de Mercado)</option>
              <option value={2}>2 Aluguéis</option>
              <option value={1}>1 Aluguel</option>
            </select>
          </div>
        </div>

        {/* Calculation Result Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-slate-50 to-purple-50 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">
              Resultado Conforme Artigo 4º da Lei 8.245/1991:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-indigo-950">
                {penaltyCalculation.proportionalPenalty.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-xs text-slate-500">
                ({penaltyCalculation.remainingMonths} meses restantes de {calcContractMonths})
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Multa cheia contratual seria de <strong>{penaltyCalculation.fullPenalty.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>.
              Economia legal assegurada de <strong>{penaltyCalculation.discountAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({penaltyCalculation.discountPercent.toFixed(1)}% de redução)</strong> pelo tempo já cumprido.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-indigo-100 text-center shrink-0 min-w-[130px]">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Redução Legal</span>
            <span className="text-xl font-black text-emerald-600 font-mono">
              - {penaltyCalculation.discountPercent.toFixed(0)}%
            </span>
            <span className="text-[10px] text-slate-500 block">Art. 413 C. Civil</span>
          </div>
        </div>
      </div>

      {/* Search & Topic Filters for FAQs */}
      <div className="space-y-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquise por termo: infiltração, pintura, condomínio, rescisão, multa, iptu, vistoria..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <span className="text-xs text-slate-500 font-bold hidden sm:inline">
              {filteredFaqs.length} perguntas encontradas
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: 'TODOS', label: 'Todos os Tópicos' },
              { id: 'INQUILINO', label: 'Deveres do Inquilino (Art. 23)' },
              { id: 'PROPRIETARIO', label: 'Deveres do Proprietário (Art. 22)' },
              { id: 'OBRAS_REPAROS', label: 'Obras, Reparos & Infiltrações' },
              { id: 'CONDOMINIO', label: 'Condomínio (Ordinário vs Extraordinário)' },
              { id: 'RESCISAO_MULTA', label: 'Rescisão & Multa Proporcional' },
              { id: 'IPTU_SEGUROS', label: 'IPTU & Seguro Incêndio' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FaqCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 space-y-2">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-700">Nenhuma pergunta encontrada com o termo buscado.</p>
              <p className="text-xs text-slate-500">
                Tente palavras mais genéricas como "telhado", "reforma", "aluguel" ou "multa".
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('TODOS');
                }}
                className="text-xs text-blue-600 hover:underline font-bold pt-2 block mx-auto"
              >
                Limpar filtros de busca
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isExpanded = expandedFaqId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-black text-slate-400 font-mono">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          item.responsibility === 'PROPRIETARIO' ? 'bg-emerald-100 text-emerald-800' :
                          item.responsibility === 'INQUILINO' ? 'bg-blue-100 text-blue-800' :
                          item.responsibility === 'AMBOS' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.responsibility === 'PROPRIETARIO' ? 'Custa ao Proprietário' :
                           item.responsibility === 'INQUILINO' ? 'Custa ao Inquilino' :
                           item.responsibility === 'AMBOS' ? 'Regra Compartilhada' : 'Regra Geral da Lei'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.lawArticle}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                        {item.question}
                      </h4>

                      <p className="text-xs font-semibold text-slate-600">
                        {item.shortAnswer}
                      </p>
                    </div>

                    <div className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 space-y-4 text-xs animate-in fade-in">
                      <div className="space-y-2">
                        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                          Explicação Detalhada Conforme a Lei:
                        </span>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {item.detailedAnswer}
                        </p>
                      </div>

                      {item.practicalTip && (
                        <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-start gap-2.5 text-blue-900">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <strong className="text-[11px] block font-bold">Dica Prática AcertGo:</strong>
                            <span className="text-[11px] leading-snug">{item.practicalTip}</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60">
                        <span className="text-[10px] font-mono text-slate-400">
                          Fundamento Legal: {item.lawArticle}
                        </span>

                        {onOpenTicketWithQuestion && (
                          <button
                            type="button"
                            onClick={() => onOpenTicketWithQuestion(item.question)}
                            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Abrir chamado com esta dúvida</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Support / Legal Help Card */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">
              Ainda tem dúvidas sobre o seu contrato ou situação específica?
            </h4>
            <p className="text-xs text-slate-300">
              Nossa equipe jurídica e de mediação imobiliária está à disposição para analisar seu caso.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const msg = encodeURIComponent(
                'Olá! Gostaria de tirar uma dúvida jurídica referente às obrigações da Lei do Inquilinato nº 8.245 no meu contrato de locação.'
              );
              window.open(`https://wa.me/5511988443322?text=${msg}`, '_blank');
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Falar no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

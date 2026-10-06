import React, { useState } from 'react';
import { 
  X, 
  Cake, 
  Search, 
  Send, 
  ExternalLink, 
  Check, 
  Filter, 
  Calendar, 
  Users, 
  Building, 
  UserCheck, 
  HeartHandshake, 
  Briefcase, 
  Truck,
  Sparkles,
  Phone
} from 'lucide-react';

export type BirthdayCategory = 
  | 'TODOS'
  | 'CLIENTE'
  | 'PROPRIETARIO'
  | 'INQUILINO'
  | 'COLABORADOR'
  | 'INDICADOR'
  | 'PARCEIRO'
  | 'FORNECEDOR';

export interface BirthdayContact {
  id: string;
  name: string;
  phone: string;
  category: BirthdayCategory;
  birthDate: string; // MM-DD or YYYY-MM-DD
  roleOrRelation: string;
  lastDealOrContract?: string;
}

const INITIAL_BIRTHDAY_CONTACTS: BirthdayContact[] = [
  {
    id: 'bday_1',
    name: 'Dr. Cláudio Prado Junqueira',
    phone: '(11) 98844-3322',
    category: 'PROPRIETARIO',
    birthDate: '1978-05-18',
    roleOrRelation: 'Proprietário de 3 Imóveis nos Jardins',
    lastDealOrContract: 'Aluguel Alameda Lorena - R$ 12.000/mês'
  },
  {
    id: 'bday_2',
    name: 'Vanessa Guimarães',
    phone: '(11) 98765-4321',
    category: 'CLIENTE',
    birthDate: '1989-10-02',
    roleOrRelation: 'Cliente Compradora (Fechamento Recente)',
    lastDealOrContract: 'Apartamento Reserva Jardins - R$ 2.450.000'
  },
  {
    id: 'bday_3',
    name: 'Lucas Ferraz Medeiros',
    phone: '(11) 97777-1002',
    category: 'INQUILINO',
    birthDate: '1992-10-05',
    roleOrRelation: 'Locatário Ativo',
    lastDealOrContract: 'Contrato LOC-2026-104 - Itaim Bibi'
  },
  {
    id: 'bday_4',
    name: 'Juliana Mendes',
    phone: '(11) 97777-2005',
    category: 'COLABORADOR',
    birthDate: '1995-10-12',
    roleOrRelation: 'Corretora de Alto Padrão (Equipe Interna)',
    lastDealOrContract: 'Vendedora Top Performance Setembro'
  },
  {
    id: 'bday_5',
    name: 'Eng. Ricardo Silveira',
    phone: '(11) 99123-4567',
    category: 'INDICADOR',
    birthDate: '1984-10-15',
    roleOrRelation: 'Indicador no Programa Indique & Ganhe',
    lastDealOrContract: 'Indicou 4 compradores para o Parque Global'
  },
  {
    id: 'bday_6',
    name: 'Marcio Fontes (Imob Parceira)',
    phone: '(11) 95555-4321',
    category: 'PARCEIRO',
    birthDate: '1980-10-18',
    roleOrRelation: 'Parceiro Externo em Co-Corretagem',
    lastDealOrContract: 'Parceria no Edifício Paulicéia'
  },
  {
    id: 'bday_7',
    name: 'Carlos Alberto Manutenções Prediais',
    phone: '(11) 96432-1098',
    category: 'FORNECEDOR',
    birthDate: '1975-10-22',
    roleOrRelation: 'Fornecedor Homologado de Reformas e Reparos',
    lastDealOrContract: 'Manutenções da carteira de locação'
  },
  {
    id: 'bday_8',
    name: 'Dra. Beatriz Helena Fontoura',
    phone: '(11) 98111-2233',
    category: 'PROPRIETARIO',
    birthDate: '1970-10-25',
    roleOrRelation: 'Proprietária Titular',
    lastDealOrContract: 'Cobertura Duplex Vila Nova Conceição'
  }
];

interface BirthdayWishesHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName?: string;
}

export const BirthdayWishesHubModal: React.FC<BirthdayWishesHubModalProps> = ({
  isOpen,
  onClose,
  agencyName = 'AcertGo Imóveis'
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<BirthdayCategory>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [customGreeting, setCustomGreeting] = useState('');
  const [selectedContact, setSelectedContact] = useState<BirthdayContact | null>(null);
  const [dispatchedIds, setDispatchedIds] = useState<string[]>([]);

  const filteredContacts = INITIAL_BIRTHDAY_CONTACTS.filter(contact => {
    const matchesCategory = activeCategory === 'TODOS' || contact.category === activeCategory;
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.roleOrRelation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat: BirthdayCategory) => {
    switch (cat) {
      case 'CLIENTE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Cliente</span>;
      case 'PROPRIETARIO':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Proprietário</span>;
      case 'INQUILINO':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Inquilino</span>;
      case 'COLABORADOR':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Colaborador</span>;
      case 'INDICADOR':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Indicador</span>;
      case 'PARCEIRO':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Parceiro</span>;
      case 'FORNECEDOR':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">Fornecedor</span>;
      default:
        return null;
    }
  };

  const handleSendWhatsApp = (contact: BirthdayContact) => {
    const cleanPhone = contact.phone.replace(/\D/g, '');
    const primeNome = contact.name.split(' ')[0];
    
    let defaultMsg = `🎂 Olá ${primeNome}! Em nome de toda a equipe da ${agencyName}, gostaríamos de lhe desejar um Feliz Aniversário! 🎉\n\nQue este novo ano seja repleto de saúde, alegria, realizações e grandes conquistas. É uma grande satisfação ter você como nosso ${contact.category.toLowerCase()} e parceiro!\n\nConte sempre conosco! 🥂✨`;
    
    if (contact.category === 'CLIENTE') {
      defaultMsg = `🎂 Parabéns pelo seu aniversário, ${primeNome}! Toda a equipe da ${agencyName} lhe deseja um novo ciclo espetacular! Que sua conquista e seu lar continuem trazendo muitos momentos felizes para você e sua família. Um grande abraço! 🎉🥂`;
    } else if (contact.category === 'COLABORADOR') {
      defaultMsg = `🎂 Parabéns, ${primeNome}! Toda a família ${agencyName} comemora com você hoje! Muito obrigado por seu talento, dedicação e energia contagiante. Que este novo ano traga muito sucesso e muitas metas batidas! 🚀🎉`;
    }

    const finalMsg = encodeURIComponent(customGreeting.trim() || defaultMsg);
    window.open(`https://wa.me/55${cleanPhone}?text=${finalMsg}`, '_blank');

    setDispatchedIds(prev => [...prev, contact.id]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Cake className="w-6 h-6 text-pink-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  Central de Felicitações & Mensagens de Aniversário
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white uppercase tracking-wider">
                  Relacionamento 360°
                </span>
              </div>
              <p className="text-xs text-pink-100">
                Dispare felicitações automáticas via WhatsApp para Clientes, Proprietários, Inquilinos, Colaboradores, Indicadores, Parceiros e Fornecedores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          {(
            [
              { id: 'TODOS', label: 'Todos os Aniversariantes', icon: Users },
              { id: 'CLIENTE', label: 'Clientes (Fechamento)', icon: Sparkles },
              { id: 'PROPRIETARIO', label: 'Proprietários', icon: Building },
              { id: 'INQUILINO', label: 'Inquilinos', icon: HeartHandshake },
              { id: 'COLABORADOR', label: 'Colaboradores', icon: UserCheck },
              { id: 'INDICADOR', label: 'Indicadores', icon: Users },
              { id: 'PARCEIRO', label: 'Parceiros', icon: Briefcase },
              { id: 'FORNECEDOR', label: 'Fornecedores', icon: Truck },
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'TODOS' 
              ? INITIAL_BIRTHDAY_CONTACTS.length 
              : INITIAL_BIRTHDAY_CONTACTS.filter(c => c.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, cargo ou imóvel vinculado..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Cake className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs">Nenhum aniversariante encontrado com este filtro.</p>
            </div>
          ) : (
            filteredContacts.map(contact => {
              const wasDispatched = dispatchedIds.includes(contact.id);
              const formattedDate = contact.birthDate.split('-').reverse().join('/');

              return (
                <div
                  key={contact.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-rose-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-sm font-bold text-slate-900">{contact.name}</strong>
                      {getCategoryBadge(contact.category)}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-50 text-pink-700 border border-pink-200 flex items-center gap-1">
                        <Cake className="w-3 h-3 text-pink-500" />
                        {formattedDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">{contact.roleOrRelation}</p>

                    {contact.lastDealOrContract && (
                      <p className="text-[11px] text-slate-500">
                        Histórico: <strong className="text-slate-700">{contact.lastDealOrContract}</strong>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <a
                      href={`https://wa.me/55${contact.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-mono flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{contact.phone}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(contact)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                        wasDispatched
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white'
                      }`}
                    >
                      {wasDispatched ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Mensagem Enviada ✓</span>
                        </>
                      ) : (
                        <>
                          <Cake className="w-3.5 h-3.5 text-pink-200" />
                          <span>Enviar WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>As felicitações são disparadas diretamente para o WhatsApp do contato com mensagem amigável e personalizada.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer self-end sm:self-auto"
          >
            Fechar Central
          </button>
        </div>
      </div>
    </div>
  );
};

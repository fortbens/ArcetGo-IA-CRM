import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Building, 
  Edit, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Briefcase,
  HeartHandshake,
  Calendar,
  DollarSign,
  Plus,
  Lock,
  ShieldAlert,
  Cake,
  Sparkles
} from 'lucide-react';
import { 
  Owner, 
  RealEstateProperty, 
  UserProfile, 
  AgencyGovernanceRules, 
  DEFAULT_AGENCY_GOVERNANCE_RULES 
} from '../../types/crm';

interface OwnerDetailModalProps {
  owner: Owner | null;
  properties: RealEstateProperty[];
  currentUser?: UserProfile;
  governanceRules?: AgencyGovernanceRules;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (owner: Owner) => void;
  onViewProperty: (property: RealEstateProperty) => void;
  onNewPropertyForOwner: (owner: Owner) => void;
}

export const OwnerDetailModal: React.FC<OwnerDetailModalProps> = ({
  owner,
  properties,
  currentUser,
  governanceRules = DEFAULT_AGENCY_GOVERNANCE_RULES,
  isOpen,
  onClose,
  onEdit,
  onViewProperty,
  onNewPropertyForOwner,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen || !owner) return null;

  const ownerProperties = properties.filter(p => p.ownerId === owner.id);

  // Verificação de regras de governança para exibição de contatos e banco
  const canViewContacts = (() => {
    if (!currentUser) return true;
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MASTER_ADMIN' || currentUser.role === 'MANAGER') {
      return true;
    }
    if (governanceRules.ownerAccessLevel === 'TODOS_CORRETORES') {
      return true;
    }
    if (governanceRules.ownerAccessLevel === 'GERENTE_DIRETOR_ONLY') {
      return false;
    }
    // CAPTADOR_GERENTE_DIRETOR
    const isCaptador = ownerProperties.some(p => 
      p.captadorId === currentUser.id || 
      (p.captadorName && p.captadorName.toLowerCase() === currentUser.name.toLowerCase())
    );
    return isCaptador;
  })();
  const totalRentalRevenue = ownerProperties
    .filter(p => p.pricing.rentPrice)
    .reduce((acc, curr) => acc + (curr.pricing.rentPrice || 0), 0);

  const totalSaleValue = ownerProperties
    .filter(p => p.pricing.salePrice)
    .reduce((acc, curr) => acc + (curr.pricing.salePrice || 0), 0);

  const handleCopyPix = () => {
    if (!owner.bankDetails.pixKey) return;
    navigator.clipboard.writeText(owner.bankDetails.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const isPF = owner.personType === 'PF';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-xs ${
              isPF ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-amber-600 to-orange-700'
            }`}>
              {isPF ? <User className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{owner.name}</h2>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                  isPF ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isPF ? 'Pessoa Física (PF)' : 'Pessoa Jurídica (PJ)'}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                  owner.status === 'ATIVO'
                    ? 'bg-emerald-100 text-emerald-800'
                    : owner.status === 'EM_ANALISE'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {owner.status === 'ATIVO' ? 'Ativo' : owner.status === 'EM_ANALISE' ? 'Em Análise' : 'Bloqueado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {isPF ? `CPF: ${owner.document}` : `CNPJ: ${owner.document} ${owner.tradeName ? `• ${owner.tradeName}` : ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(owner)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>Editar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">Imóveis Cadastrados</span>
              <div className="text-2xl font-bold text-blue-900 mt-1 flex items-baseline gap-2">
                {ownerProperties.length}
                <span className="text-xs font-normal text-blue-600">unidade(s)</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Aluguel Mensal Sob Gestão</span>
              <div className="text-2xl font-bold text-emerald-900 mt-1">
                {totalRentalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">Patrimônio à Venda</span>
              <div className="text-2xl font-bold text-indigo-900 mt-1">
                {totalSaleValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          </div>

          {/* Grid with 2 columns: Info Left, Bank Details Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: Civil / Corporate & Contact Information */}
            <div className="space-y-4">
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  {isPF ? 'Perfil Civil & Qualificação' : 'Dados Societários da Empresa'}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Documento Principal:</span>
                    <span className="font-semibold text-slate-900 font-mono">{owner.document}</span>
                  </div>

                  {isPF ? (
                    <>
                      <div>
                        <span className="text-slate-500 block">RG / Emissor:</span>
                        <span className="font-semibold text-slate-900">{owner.rg || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Data de Nascimento:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-slate-900 font-mono">
                            {owner.birthDate ? owner.birthDate.split('-').reverse().join('/') : 'Não informada'}
                          </span>
                          {owner.birthDate && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-pink-100 text-pink-700 flex items-center gap-0.5">
                              <Cake className="w-2.5 h-2.5" />
                              Aniversariante
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Profissão:</span>
                        <span className="font-semibold text-slate-900">{owner.profession || 'Não informada'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Estado Civil:</span>
                        <span className="font-semibold text-slate-900">{owner.maritalStatus || 'Solteiro'}</span>
                      </div>
                      {(owner.spousePartner || owner.spouseName) && (
                        <div className="col-span-2 pt-2 border-t border-slate-200 mt-1 bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-blue-700 block font-bold text-[11px] uppercase mb-1">
                            Cônjuge / Parceiro Vinculado para Futuros Contratos:
                          </span>
                          <p className="font-semibold text-slate-900">
                            {owner.spousePartner?.name || owner.spouseName}
                            {owner.spousePartner?.cpf || owner.spouseCpf ? ` • CPF: ${owner.spousePartner?.cpf || owner.spouseCpf}` : ''}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] text-slate-600">
                            <div>
                              <span>Regime: </span>
                              <strong className="text-slate-800">{owner.spousePartner?.propertyRegime || owner.propertyRegime || 'Comunhão Parcial'}</strong>
                            </div>
                            <div>
                              <span>Papel Contratual: </span>
                              <strong className="text-blue-800">
                                {owner.spousePartner?.roleInFutureContracts === 'CO_PROPRIETARIO'
                                  ? 'Co-proprietário / Co-locador'
                                  : owner.spousePartner?.roleInFutureContracts === 'ANUENTE_OUTORGA'
                                  ? 'Anuente (Outorga Marital)'
                                  : 'Beneficiário de Repasse'}
                              </strong>
                            </div>
                            {owner.spousePartner?.profession && (
                              <div>
                                <span>Profissão: </span>
                                <strong>{owner.spousePartner.profession}</strong>
                              </div>
                            )}
                            {owner.spousePartner?.phone && (
                              <div>
                                <span>WhatsApp: </span>
                                <strong>{owner.spousePartner.phone}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-slate-500 block">Inscrição Estadual:</span>
                        <span className="font-semibold text-slate-900 font-mono">{owner.stateRegistration || 'Isento'}</span>
                      </div>
                      {owner.legalRepresentative && (
                        <div className="col-span-2 pt-2 border-t border-slate-200/60 mt-1">
                          <span className="text-slate-500 block font-bold text-[11px] uppercase mb-1">Representante Legal / Diretor:</span>
                          <p className="font-semibold text-slate-900">{owner.legalRepresentative.name} ({owner.legalRepresentative.role})</p>
                          <p className="text-slate-600 font-mono">CPF: {owner.legalRepresentative.cpf} • Tel: {owner.legalRepresentative.phone}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Contacts & Address */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Canais de Contato & Domicílio
                </h3>

                {canViewContacts ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp / Tel:
                      </span>
                      <a
                        href={`https://wa.me/55${owner.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        {owner.phone}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {owner.secondaryPhone && (
                      <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Telefone Secundário:</span>
                        <span className="font-medium text-slate-800">{owner.secondaryPhone}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" /> E-mail:
                      </span>
                      <span className="font-medium text-slate-800 font-mono">{owner.email}</span>
                    </div>

                    <div className="py-1">
                      <span className="text-slate-500 flex items-center gap-1.5 mb-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" /> Endereço:
                      </span>
                      <p className="font-medium text-slate-800">
                        {owner.address.street}, {owner.address.number} {owner.address.complement ? ` - ${owner.address.complement}` : ''}
                      </p>
                      <p className="text-slate-500 font-mono">
                        {owner.address.neighborhood} • {owner.address.city}/{owner.address.state} • CEP {owner.address.cep}
                      </p>
                    </div>

                    {/* Disparo de Mensagem de Aniversário */}
                    <div className="pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          const cleanPhone = owner.phone.replace(/\D/g, '');
                          const primeNome = owner.name.split(' ')[0];
                          const msg = encodeURIComponent(
                            `🎉 Olá ${primeNome}! Em nome de toda a nossa equipe, desejamos a você um Feliz Aniversário! 🎂 Muita saúde, sucesso, realizações e prosperidade em seu novo ciclo. É uma grande satisfação ter você como nosso parceiro e proprietário!`
                          );
                          window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
                        }}
                        className="w-full py-2 px-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        <Cake className="w-4 h-4 text-pink-200" />
                        <span>Enviar Mensagem de Aniversário (WhatsApp)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Contatos Blindados por Regra da Imobiliária</span>
                    </div>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      O acesso direto ao telefone, WhatsApp e e-mail deste proprietário é reservado exclusivamente ao Captador credenciado e à Gerência/Diretoria.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>WhatsApp: (••) •••••-••••</span>
                      <span>E-mail: •••••••@•••••.com</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Bank Details & Fintech Split Info */}
            <div className="space-y-4">
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    Dados Bancários & Split Imediato
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Asaas Homologado
                  </span>
                </div>

                {canViewContacts ? (

                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Instituição Financeira:</span>
                    <span className="font-bold text-slate-900">{owner.bankDetails.bankName} (Banco {owner.bankDetails.bankCode})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tipo de Conta:</span>
                    <span className="font-semibold text-slate-900">{owner.bankDetails.accountType}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 block">Agência:</span>
                      <span className="font-mono font-bold text-slate-900">{owner.bankDetails.agency}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Conta com Dígito:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {owner.bankDetails.accountNumber}-{owner.bankDetails.accountDigit}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 block">Favorecido / Titular:</span>
                    <span className="font-semibold text-slate-900 block">{owner.bankDetails.accountHolderName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">Doc: {owner.bankDetails.accountHolderDocument}</span>
                  </div>

                  {/* Pix Key Highlight Card */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        Chave Pix ({owner.bankDetails.pixKeyType})
                      </span>
                      <button
                        onClick={handleCopyPix}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar Pix'}</span>
                      </button>
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-sm break-all">
                      {owner.bankDetails.pixKey || 'Não cadastrada'}
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Dados Bancários e Pix Ocultados</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Apenas a Diretoria, Gerência e o setor Financeiro têm acesso aos dados bancários e chaves Pix dos proprietários.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {owner.notes && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Observações Internas:</span>
                  <p className="text-slate-600 italic">{owner.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Properties Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Imóveis Vinculados a este Proprietário ({ownerProperties.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Unidades sob gestão comercial ou locatícia da imobiliária
                </p>
              </div>

              <button
                onClick={() => onNewPropertyForOwner(owner)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Imóvel</span>
              </button>
            </div>

            {ownerProperties.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Nenhum imóvel cadastrado para este proprietário</p>
                <p className="text-xs text-slate-500 mt-0.5">Cadastre o primeiro imóvel vinculando este proprietário.</p>
                <button
                  onClick={() => onNewPropertyForOwner(owner)}
                  className="mt-3 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl shadow-xs"
                >
                  Cadastrar Imóvel Agora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownerProperties.map(p => (
                  <div
                    key={p.id}
                    onClick={() => onViewProperty(p)}
                    className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="h-28 relative overflow-hidden bg-slate-100">
                      {p.images[0] ? (
                        <img
                          src={p.images[0].url}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Building className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs font-mono">
                          {p.code}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                          p.status === 'DISPONIVEL' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {p.address.neighborhood} • {p.address.city}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div className="text-xs font-bold text-slate-900">
                          {p.pricing.salePrice
                            ? p.pricing.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : p.pricing.rentPrice
                            ? `${p.pricing.rentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês`
                            : 'Consulte'}
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                          Ver ficha →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>Cadastrado em {new Date(owner.createdAt).toLocaleDateString('pt-BR')}</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

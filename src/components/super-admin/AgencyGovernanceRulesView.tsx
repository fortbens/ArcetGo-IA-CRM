import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  MapPin, 
  UserCheck, 
  FileSignature, 
  Users, 
  DollarSign, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Eye, 
  EyeOff, 
  Building2, 
  HelpCircle,
  Sliders,
  Settings,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  AgencyGovernanceRules, 
  DEFAULT_AGENCY_GOVERNANCE_RULES, 
  OwnerAccessLevel, 
  ProposalAccessLevel, 
  PropertyAddressMapVisibility,
  UserProfile,
  RealEstateProperty
} from '../../types/crm';
import { INITIAL_PROPERTIES, CURRENT_USER_PROFILES } from '../../data/mockData';

interface AgencyGovernanceRulesViewProps {
  currentRules: AgencyGovernanceRules;
  onSaveRules: (newRules: AgencyGovernanceRules) => void;
  currentUser?: UserProfile;
}

export const AgencyGovernanceRulesView: React.FC<AgencyGovernanceRulesViewProps> = ({
  currentRules,
  onSaveRules,
  currentUser
}) => {
  const [rules, setRules] = useState<AgencyGovernanceRules>({ ...currentRules });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatedUserRole, setSimulatedUserRole] = useState<'BROKER' | 'MANAGER' | 'MASTER_ADMIN'>('BROKER');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyPreset = (presetType: 'BLINDAGEM_MAXIMA' | 'CORPORATIVO' | 'ABERTO') => {
    if (presetType === 'BLINDAGEM_MAXIMA') {
      setRules({
        ...rules,
        ownerAccessLevel: 'CAPTADOR_GERENTE_DIRETOR',
        hideOwnerContactWithoutActiveDeal: true,
        propertyAddressMapVisibility: 'EXCLUSIVOS_OU_MARCADOS',
        obfuscateStreetForNonManagers: true,
        proposalAccessLevel: 'PROPOSICAO_GERENCIA_DIRETORIA',
        hideFinancialValuesFromOtherBrokers: true,
        leadVisibilityScope: 'MEUS_LEADS',
        commissionsVisibilityScope: 'PROPRIAS_COMISSOES_ONLY',
        allowBrokersExportCsv: false,
        allowBrokersExportXml: false,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'Diretoria'
      });
      showToast('Preset "Máxima Blindagem & Exclusividade" aplicado com sucesso!');
    } else if (presetType === 'CORPORATIVO') {
      setRules({
        ...rules,
        ownerAccessLevel: 'CAPTADOR_E_EQUIPE',
        hideOwnerContactWithoutActiveDeal: false,
        propertyAddressMapVisibility: 'EXCLUSIVOS_OU_MARCADOS',
        obfuscateStreetForNonManagers: true,
        proposalAccessLevel: 'PROPOSICAO_GERENCIA_DIRETORIA',
        hideFinancialValuesFromOtherBrokers: true,
        leadVisibilityScope: 'EQUIPE',
        commissionsVisibilityScope: 'PROPRIAS_COMISSOES_ONLY',
        allowBrokersExportCsv: false,
        allowBrokersExportXml: false,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'Diretoria'
      });
      showToast('Preset "Padrão Corporativo Equilibrado" aplicado!');
    } else {
      setRules({
        ...rules,
        ownerAccessLevel: 'TODOS_CORRETORES',
        hideOwnerContactWithoutActiveDeal: false,
        propertyAddressMapVisibility: 'LIVRE_TODOS',
        obfuscateStreetForNonManagers: false,
        proposalAccessLevel: 'EQUIPE_COMPLETA',
        hideFinancialValuesFromOtherBrokers: false,
        leadVisibilityScope: 'AGENCIA_INTEIRA',
        commissionsVisibilityScope: 'TRANSPARENTE',
        allowBrokersExportCsv: true,
        allowBrokersExportXml: true,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'Diretoria'
      });
      showToast('Preset "Operação Aberta" aplicado!');
    }
  };

  const handleSave = () => {
    const updated: AgencyGovernanceRules = {
      ...rules,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.name || 'Administrador'
    };
    onSaveRules(updated);
    showToast('Regras de Governança salvas e ativadas em tempo real em toda a imobiliária!');
  };

  const handleReset = () => {
    setRules({ ...DEFAULT_AGENCY_GOVERNANCE_RULES });
    showToast('Regras restauradas para o padrão recomendado de fábrica.');
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>GOVERNANÇA DO TIME & BLINDAGEM DA IMOBILIÁRIA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Regras Parametrizadas de Acesso & Visibilidade
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Defina com precisão quem tem acesso aos dados sensíveis dos proprietários, quem pode visualizar propostas comerciais e a regra de exibição de endereços e mapas de imóveis (exclusivos vs não-exclusivos).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar Padrão</span>
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Regras da Imobiliária</span>
            </button>
          </div>
        </div>
      </div>

      {/* Presets Rápidos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Modelos de Governança Prontos (Presets em 1 Clique):</span>
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Configure as regras de toda a empresa rapidamente conforme a política de segurança da sua imobiliária
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleApplyPreset('BLINDAGEM_MAXIMA')}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            <span>Máxima Blindagem (Exclusividade)</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('CORPORATIVO')}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Corporativo Equilibrado</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('ABERTO')}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all flex items-center gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5 text-slate-600" />
            <span>Operação Aberta</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3 Pillars of Parametrization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PILLAR 1: ACESSO AO PROPRIETÁRIO */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Acesso ao Proprietário
                </h3>
                <span className="text-[11px] text-slate-500">Quem pode ver contatos & CPF</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Nível de Permissão
              </label>

              {/* Option 1: Captador + Gerente + Diretor */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.ownerAccessLevel === 'CAPTADOR_GERENTE_DIRETOR'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="ownerAccessLevel"
                    checked={rules.ownerAccessLevel === 'CAPTADOR_GERENTE_DIRETOR'}
                    onChange={() => setRules({ ...rules, ownerAccessLevel: 'CAPTADOR_GERENTE_DIRETOR' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Apenas Captador, Gerente e Diretor
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Corretores comuns não veem telefone, e-mail nem chave Pix do dono, a menos que sejam os captadores registrados.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 2: Gerente e Diretor Only */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.ownerAccessLevel === 'GERENTE_DIRETOR_ONLY'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="ownerAccessLevel"
                    checked={rules.ownerAccessLevel === 'GERENTE_DIRETOR_ONLY'}
                    onChange={() => setRules({ ...rules, ownerAccessLevel: 'GERENTE_DIRETOR_ONLY' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Somente Gerência e Diretoria
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Centralização total. Nenhum corretor de vendas fala com o dono sem intermédio da gerência.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 3: Captador e Equipe */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.ownerAccessLevel === 'CAPTADOR_E_EQUIPE'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="ownerAccessLevel"
                    checked={rules.ownerAccessLevel === 'CAPTADOR_E_EQUIPE'}
                    onChange={() => setRules({ ...rules, ownerAccessLevel: 'CAPTADOR_E_EQUIPE' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Captador e sua Equipe Vinculada
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Compartilhado entre os corretores que pertencem à mesma equipe do captador.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 4: Todos os corretores */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.ownerAccessLevel === 'TODOS_CORRETORES'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="ownerAccessLevel"
                    checked={rules.ownerAccessLevel === 'TODOS_CORRETORES'}
                    onChange={() => setRules({ ...rules, ownerAccessLevel: 'TODOS_CORRETORES' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Livre para Todos os Corretores
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Qualquer corretor credenciado da imobiliária tem acesso direto ao telefone do proprietário.
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Extra Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                <span className="font-semibold pr-2">Ocultar contatos se não houver negociação ativa</span>
                <input
                  type="checkbox"
                  checked={rules.hideOwnerContactWithoutActiveDeal}
                  onChange={(e) => setRules({ ...rules, hideOwnerContactWithoutActiveDeal: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* PILLAR 2: EXIBIÇÃO DE ENDEREÇO & MAPAS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Endereço & Mapas
                </h3>
                <span className="text-[11px] text-slate-500">Controle de localização física</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Regra de Visibilidade do Mapa
              </label>

              {/* Option 1: Exclusivos OU Marcados */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.propertyAddressMapVisibility === 'EXCLUSIVOS_OU_MARCADOS'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="propertyAddressMapVisibility"
                    checked={rules.propertyAddressMapVisibility === 'EXCLUSIVOS_OU_MARCADOS'}
                    onChange={() => setRules({ ...rules, propertyAddressMapVisibility: 'EXCLUSIVOS_OU_MARCADOS' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Apenas Exclusivos OU Marcados para Mapa
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Recomendado. Protege os imóveis sem exclusividade contra "pescaria" de concorrentes e preserva o captador.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 2: Somente Exclusivos */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.propertyAddressMapVisibility === 'SOMENTE_EXCLUSIVOS'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="propertyAddressMapVisibility"
                    checked={rules.propertyAddressMapVisibility === 'SOMENTE_EXCLUSIVOS'}
                    onChange={() => setRules({ ...rules, propertyAddressMapVisibility: 'SOMENTE_EXCLUSIVOS' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Somente Imóveis com Exclusividade Ativa
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Apenas imóveis com contrato de exclusividade jurídica registrado exibem o pino exato e mapa.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 3: Somente Marcados */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.propertyAddressMapVisibility === 'SOMENTE_MARCADOS'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="propertyAddressMapVisibility"
                    checked={rules.propertyAddressMapVisibility === 'SOMENTE_MARCADOS'}
                    onChange={() => setRules({ ...rules, propertyAddressMapVisibility: 'SOMENTE_MARCADOS' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Apenas Marcados com Flag no Cadastro
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Depende da flag individual "Exibir no Mapa" configurada no formulário de edição do imóvel.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 4: Livre para todos */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.propertyAddressMapVisibility === 'LIVRE_TODOS'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="propertyAddressMapVisibility"
                    checked={rules.propertyAddressMapVisibility === 'LIVRE_TODOS'}
                    onChange={() => setRules({ ...rules, propertyAddressMapVisibility: 'LIVRE_TODOS' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Livre para Todos os Imóveis
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Exibe localização, mapa e logradouro completo em 100% dos imóveis cadastrados.
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Extra Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                <span className="font-semibold pr-2">Ofuscar Rua/Número (exibir apenas Bairro/Região)</span>
                <input
                  type="checkbox"
                  checked={rules.obfuscateStreetForNonManagers}
                  onChange={(e) => setRules({ ...rules, obfuscateStreetForNonManagers: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* PILLAR 3: PROPOSTAS & COMISSÕES */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileSignature className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Propostas & Negociação
                </h3>
                <span className="text-[11px] text-slate-500">Sigilo de minutas e valores</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Visualização de Propostas
              </label>

              {/* Option 1: Proponente + Gerência + Diretoria */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.proposalAccessLevel === 'PROPOSICAO_GERENCIA_DIRETORIA'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="proposalAccessLevel"
                    checked={rules.proposalAccessLevel === 'PROPOSICAO_GERENCIA_DIRETORIA'}
                    onChange={() => setRules({ ...rules, proposalAccessLevel: 'PROPOSICAO_GERENCIA_DIRETORIA' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Somente Proponente, Gerente e Diretor
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Evita que outros corretores vejam a negociação em curso e vazem a contraproposta.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 2: Somente Gerência */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.proposalAccessLevel === 'SOMENTE_GERENCIA_DIRETORIA'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="proposalAccessLevel"
                    checked={rules.proposalAccessLevel === 'SOMENTE_GERENCIA_DIRETORIA'}
                    onChange={() => setRules({ ...rules, proposalAccessLevel: 'SOMENTE_GERENCIA_DIRETORIA' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Somente Gerência e Diretoria
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      A esteira de propostas é reservada estritamente aos cargos de gestão.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 3: Equipe completa */}
              <label 
                className={`p-3 rounded-2xl border cursor-pointer block transition-all ${
                  rules.proposalAccessLevel === 'EQUIPE_COMPLETA'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="proposalAccessLevel"
                    checked={rules.proposalAccessLevel === 'EQUIPE_COMPLETA'}
                    onChange={() => setRules({ ...rules, proposalAccessLevel: 'EQUIPE_COMPLETA' })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Aberto para Toda a Equipe
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Todos os corretores acompanham todas as propostas ativas da imobiliária.
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Extra Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                <span className="font-semibold pr-2">Ocultar valores de propostas concorrentes</span>
                <input
                  type="checkbox"
                  checked={rules.hideFinancialValuesFromOtherBrokers}
                  onChange={(e) => setRules({ ...rules, hideFinancialValuesFromOtherBrokers: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                <span className="font-semibold pr-2">Corretores veem apenas as próprias comissões</span>
                <input
                  type="checkbox"
                  checked={rules.commissionsVisibilityScope === 'PROPRIAS_COMISSOES_ONLY'}
                  onChange={(e) => setRules({ 
                    ...rules, 
                    commissionsVisibilityScope: e.target.checked ? 'PROPRIAS_COMISSOES_ONLY' : 'TRANSPARENTE' 
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

      </div>

      {/* Simulator Section: Preview in Real Time */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>SIMULADOR DE PERSPECTIVA EM TEMPO REAL</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Como um colaborador enxergará o sistema sob estas regras
            </h3>
            <p className="text-xs text-slate-400">
              Alterne a perspectiva abaixo para validar imediatamente o impacto das parametrizações selecionadas:
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setSimulatedUserRole('BROKER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                simulatedUserRole === 'BROKER'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Corretor Comum
            </button>
            <button
              onClick={() => setSimulatedUserRole('MANAGER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                simulatedUserRole === 'MANAGER'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gerente
            </button>
            <button
              onClick={() => setSimulatedUserRole('MASTER_ADMIN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                simulatedUserRole === 'MASTER_ADMIN'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diretor
            </button>
          </div>
        </div>

        {/* Dynamic Simulation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Proprietário */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Dados do Proprietário no Imóvel
            </span>
            {simulatedUserRole === 'MASTER_ADMIN' || simulatedUserRole === 'MANAGER' ? (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Liberado (Nome, WhatsApp, CPF e Chave Pix)</span>
              </div>
            ) : rules.ownerAccessLevel === 'TODOS_CORRETORES' ? (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Visível para todos os corretores</span>
              </div>
            ) : (
              <div className="text-amber-400 font-bold flex items-start gap-1.5">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div>Protegido e Oculto para terceiros</div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Exibido apenas se o corretor for o captador registrado do imóvel.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Mapa e Endereço */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Mapa e Endereço Exato
            </span>
            {simulatedUserRole === 'MASTER_ADMIN' || simulatedUserRole === 'MANAGER' ? (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Rua, número e pino no mapa visíveis sempre</span>
              </div>
            ) : rules.propertyAddressMapVisibility === 'LIVRE_TODOS' ? (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mapa e rua liberados para todos os imóveis</span>
              </div>
            ) : (
              <div className="text-blue-400 font-bold flex items-start gap-1.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div>Condicionado à Exclusividade</div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Imóveis sem exclusividade exibem apenas o Bairro. O mapa fica restrito.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Propostas */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Propostas Comerciais
            </span>
            {simulatedUserRole === 'MASTER_ADMIN' || simulatedUserRole === 'MANAGER' ? (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Visão geral de todas as propostas da casa</span>
              </div>
            ) : rules.proposalAccessLevel === 'EQUIPE_COMPLETA' ? (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Visível para toda a equipe</span>
              </div>
            ) : (
              <div className="text-purple-400 font-bold flex items-start gap-1.5">
                <FileSignature className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div>Apenas Propostas Próprias</div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    O corretor não vê o valor nem as condições de propostas de colegas.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

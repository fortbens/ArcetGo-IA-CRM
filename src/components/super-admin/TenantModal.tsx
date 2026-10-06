import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Shield, 
  CreditCard, 
  Layers, 
  Check, 
  Globe, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Palette 
} from 'lucide-react';
import { TenantAgency, SaaSPlan, SaaSModule, TenantStatus } from '../../types/superAdmin';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Partial<TenantAgency>) => void;
  tenantToEdit?: TenantAgency | null;
  availablePlans: SaaSPlan[];
  availableModules: SaaSModule[];
}

export const TenantModal: React.FC<TenantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tenantToEdit,
  availablePlans,
  availableModules,
}) => {
  const [formData, setFormData] = useState<Partial<TenantAgency>>({
    name: '',
    tradeName: '',
    cnpj: '',
    creciJ: '',
    subdomain: '',
    customDomain: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    city: '',
    state: 'SP',
    address: '',
    status: 'ACTIVE',
    planId: availablePlans[1]?.id || 'plan_pro',
    planName: availablePlans[1]?.name || 'Imobiliária Pro',
    billingCycle: 'MENSAL',
    monthlyBilling: availablePlans[1]?.monthlyPrice || 1390,
    activeModules: availablePlans[1]?.includedModuleIds || ['crm_roleta', 'kanban_funnel', 'imoveis_portais'],
    customTheme: {
      primaryColor: '#2563eb',
      secondaryColor: '#0ea5e9',
      appName: ''
    },
    paymentMethod: 'PIX'
  });

  const [activeTab, setActiveTab] = useState<'DADOS' | 'PLANO_MODULOS' | 'WHITE_LABEL'>('DADOS');

  useEffect(() => {
    if (tenantToEdit) {
      setFormData({ ...tenantToEdit });
    } else {
      setFormData({
        name: '',
        tradeName: '',
        cnpj: '',
        creciJ: '',
        subdomain: '',
        customDomain: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        city: '',
        state: 'SP',
        address: '',
        status: 'ACTIVE',
        planId: availablePlans[1]?.id || 'plan_pro',
        planName: availablePlans[1]?.name || 'Imobiliária Pro',
        billingCycle: 'MENSAL',
        monthlyBilling: availablePlans[1]?.monthlyPrice || 1390,
        activeModules: availablePlans[1]?.includedModuleIds || ['crm_roleta', 'kanban_funnel', 'imoveis_portais'],
        customTheme: {
          primaryColor: '#2563eb',
          secondaryColor: '#0ea5e9',
          appName: ''
        },
        paymentMethod: 'PIX'
      });
    }
  }, [tenantToEdit, availablePlans]);

  if (!isOpen) return null;

  const handlePlanChange = (planId: string) => {
    const selected = availablePlans.find(p => p.id === planId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        planId: selected.id,
        planName: selected.name,
        monthlyBilling: prev.billingCycle === 'ANUAL' ? Math.round(selected.annualPrice / 12) : selected.monthlyPrice,
        // Ao trocar de plano, pré-seleciona os módulos daquele plano
        activeModules: selected.includedModuleIds
      }));
    }
  };

  const handleToggleModule = (moduleId: string) => {
    setFormData(prev => {
      const current = prev.activeModules || [];
      if (current.includes(moduleId)) {
        return { ...prev, activeModules: current.filter(m => m !== moduleId) };
      } else {
        return { ...prev, activeModules: [...current, moduleId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tradeName || !formData.ownerEmail) {
      alert('Por favor, preencha os campos obrigatórios (Razão Social, Nome Fantasia e E-mail do Responsável).');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {tenantToEdit ? 'Editar Imobiliária (Tenant)' : 'Nova Imobiliária (Tenant SaaS)'}
              </h2>
              <p className="text-xs text-slate-400">
                {tenantToEdit ? `Gerenciando ${tenantToEdit.tradeName}` : 'Provisionamento de instância SaaS isolada'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-4 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('DADOS')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'DADOS' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            1. Dados da Imobiliária
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PLANO_MODULOS')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'PLANO_MODULOS' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            2. Plano & Módulos ({formData.activeModules?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WHITE_LABEL')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'WHITE_LABEL' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            3. White-label & Domínio
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {activeTab === 'DADOS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tradeName || ''}
                    onChange={(e) => {
                      const trade = e.target.value;
                      const slug = trade.toLowerCase().replace(/[^a-z0-9]/g, '');
                      setFormData(prev => ({
                        ...prev,
                        tradeName: trade,
                        subdomain: prev.subdomain || (slug ? `${slug}.acertgo.com.br` : '')
                      }));
                    }}
                    placeholder="Ex: Nexus Real Estate"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Razão Social Completa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Nexus Negócios Imobiliários Ltda"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj || ''}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CRECI Jurídico
                  </label>
                  <input
                    type="text"
                    value={formData.creciJ || ''}
                    onChange={(e) => setFormData({ ...formData, creciJ: e.target.value })}
                    placeholder="Ex: 34.890-J / SP"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status da Assinatura
                  </label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TenantStatus })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  >
                    <option value="ACTIVE">Ativa (Adimplente)</option>
                    <option value="TRIAL">Período de Testes (Trial)</option>
                    <option value="SUSPENDED">Suspensa (Bloqueio Automático)</option>
                    <option value="CANCELLED">Cancelada</option>
                  </select>
                </div>
              </div>

              {/* Responsável */}
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Responsável Legal & Contato Principal
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome do Responsável *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName || ''}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Ex: Carlos Eduardo"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail do Administrador *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.ownerEmail || ''}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      placeholder="admin@imobiliaria.com.br"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.ownerPhone || ''}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      placeholder="(11) 99999-8888"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Localização da Sede
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Endereço Completo
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Av. Paulista, 1000 - Sala 40"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="São Paulo"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        UF
                      </label>
                      <input
                        type="text"
                        value={formData.state || 'SP'}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                        placeholder="SP"
                        maxLength={2}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PLANO_MODULOS' && (
            <div className="space-y-6">
              {/* Seleção de Plano */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Plano SaaS Vinculado
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availablePlans.map((plan) => {
                    const isSelected = formData.planId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => handlePlanChange(plan.id)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{plan.name}</span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-extrabold text-blue-700 mb-1">
                          R$ {plan.monthlyPrice.toLocaleString('pt-BR')}
                          <span className="text-[10px] font-normal text-slate-500">/mês</span>
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <p>• {plan.maxUsers === -1 ? 'Usuários Ilimitados' : `Até ${plan.maxUsers} usuários`}</p>
                          <p>• Até {plan.maxProperties} imóveis</p>
                          <p>• {plan.whatsappIncluded ? 'WhatsApp incluso' : 'Sem WhatsApp'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ciclo de Cobrança e Faturamento */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ciclo de Cobrança</label>
                  <select
                    value={formData.billingCycle || 'MENSAL'}
                    onChange={(e) => {
                      const cycle = e.target.value as 'MENSAL' | 'ANUAL';
                      const plan = availablePlans.find(p => p.id === formData.planId);
                      setFormData(prev => ({
                        ...prev,
                        billingCycle: cycle,
                        monthlyBilling: cycle === 'ANUAL' && plan ? Math.round(plan.annualPrice / 12) : (plan?.monthlyPrice || prev.monthlyBilling)
                      }));
                    }}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="MENSAL">Mensal Recorrente</option>
                    <option value="ANUAL">Anual (com desconto)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Forma de Pagamento</label>
                  <select
                    value={formData.paymentMethod || 'PIX'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="PIX">Pix Recorrente (Asaas)</option>
                    <option value="BOLETO">Boleto Bancário</option>
                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Valor Mensal (R$)</label>
                  <input
                    type="number"
                    value={formData.monthlyBilling || 0}
                    onChange={(e) => setFormData({ ...formData, monthlyBilling: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Módulos Contratados Granulares */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Módulos Liberados para esta Imobiliária
                  </h3>
                  <span className="text-[11px] text-blue-600 font-semibold">
                    {formData.activeModules?.length || 0} de {availableModules.length} módulos ativos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableModules.map((mod) => {
                    const isActive = formData.activeModules?.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleToggleModule(mod.id)}
                        className={`p-2.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-blue-50/50 border-blue-300 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => {}} // handled by parent onClick
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold">{mod.name}</span>
                            {mod.isCore && (
                              <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                                Core
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{mod.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'WHITE_LABEL' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subdomínio da Imobiliária (Acesso do Tenant)
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.subdomain || ''}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    placeholder="imobiliaria.acertgo.com.br"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Exemplo: <code className="text-blue-600">alphaville.acertgo.com.br</code> ou <code className="text-blue-600">matriz.acertgo.com.br</code>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Domínio Customizado Próprio (CNAME White-label)
                </label>
                <input
                  type="text"
                  value={formData.customDomain || ''}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  placeholder="Ex: crm.imobiliariaprime.com.br"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL da Logo da Imobiliária (PNG / SVG)
                </label>
                <input
                  type="text"
                  value={formData.logoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cor Primária da Marca
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.customTheme?.primaryColor || '#2563eb'}
                      onChange={(e) => setFormData({
                        ...formData,
                        customTheme: {
                          ...formData.customTheme,
                          primaryColor: e.target.value,
                          secondaryColor: formData.customTheme?.secondaryColor || '#0ea5e9'
                        }
                      })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.customTheme?.primaryColor || '#2563eb'}
                      onChange={(e) => setFormData({
                        ...formData,
                        customTheme: {
                          ...formData.customTheme,
                          primaryColor: e.target.value,
                          secondaryColor: formData.customTheme?.secondaryColor || '#0ea5e9'
                        }
                      })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cor Secundária da Marca
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.customTheme?.secondaryColor || '#0ea5e9'}
                      onChange={(e) => setFormData({
                        ...formData,
                        customTheme: {
                          ...formData.customTheme,
                          primaryColor: formData.customTheme?.primaryColor || '#2563eb',
                          secondaryColor: e.target.value
                        }
                      })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.customTheme?.secondaryColor || '#0ea5e9'}
                      onChange={(e) => setFormData({
                        ...formData,
                        customTheme: {
                          ...formData.customTheme,
                          primaryColor: formData.customTheme?.primaryColor || '#2563eb',
                          secondaryColor: e.target.value
                        }
                      })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Preview da Marca */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">Preview do Visual Customizado</span>
                <div 
                  className="p-3 rounded-lg text-white flex items-center justify-between"
                  style={{ backgroundColor: formData.customTheme?.primaryColor || '#2563eb' }}
                >
                  <span className="font-bold text-sm">
                    {formData.tradeName || 'Sua Imobiliária'}
                  </span>
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded font-semibold"
                    style={{ backgroundColor: formData.customTheme?.secondaryColor || '#0ea5e9' }}
                  >
                    Portal do Corretor
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <div className="flex gap-2">
              {activeTab !== 'WHITE_LABEL' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'DADOS' ? 'PLANO_MODULOS' : 'WHITE_LABEL')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Próximo Passo →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Salvar Imobiliária
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

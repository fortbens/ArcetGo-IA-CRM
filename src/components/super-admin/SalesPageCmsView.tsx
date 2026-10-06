import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Users,
  Building2,
  DollarSign,
  Zap,
  Star,
  HelpCircle,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  Check,
  X,
  BadgeAlert,
  Send,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Palette,
  Sliders
} from 'lucide-react';
import {
  SalesPageCmsState,
  SalesPlan,
  LeadRegistration,
  TestimonialItem,
  FaqItem,
  FeatureHighlight
} from '../../types/salesPageCms';
import { readFileAsDataUrl, updateBrowserFavicon } from '../../utils/faviconManager';

interface SalesPageCmsViewProps {
  cmsData: SalesPageCmsState;
  onUpdateCmsData: (newData: SalesPageCmsState) => void;
  onOpenLiveSalesPage: () => void;
  onConvertLeadToTenant?: (lead: LeadRegistration) => void;
}

type CmsSubTab = 
  | 'leads_crm'
  | 'plans_pricing'
  | 'hero_content'
  | 'lead_features'
  | 'erp_splits'
  | 'testimonials'
  | 'faqs'
  | 'settings';

export const SalesPageCmsView: React.FC<SalesPageCmsViewProps> = ({
  cmsData,
  onUpdateCmsData,
  onOpenLiveSalesPage,
  onConvertLeadToTenant
}) => {
  const [activeSubTab, setActiveSubTab] = useState<CmsSubTab>('leads_crm');
  const [localData, setLocalData] = useState<SalesPageCmsState>(cmsData);
  const [saveToast, setSaveToast] = useState(false);

  // Search & Filters for Leads
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('ALL');

  // File Upload Refs & Feedback States for Sales Page
  const salesLogoInputRef = useRef<HTMLInputElement>(null);
  const salesFaviconInputRef = useRef<HTMLInputElement>(null);
  const [salesLogoSuccessMessage, setSalesLogoSuccessMessage] = useState<string | null>(null);
  const [salesLogoErrorMessage, setSalesLogoErrorMessage] = useState<string | null>(null);
  const [salesFaviconSuccessMessage, setSalesFaviconSuccessMessage] = useState<string | null>(null);
  const [salesFaviconErrorMessage, setSalesFaviconErrorMessage] = useState<string | null>(null);

  const handleSalesLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSalesLogoErrorMessage(null);
    if (file.size > 3 * 1024 * 1024) {
      setSalesLogoErrorMessage('O arquivo de logotipo deve ter no máximo 3MB.');
      setTimeout(() => setSalesLogoErrorMessage(null), 4000);
      return;
    }
    try {
      const base64Url = await readFileAsDataUrl(file);
      const updated = {
        ...localData,
        settings: {
          ...localData.settings,
          logoUrl: base64Url
        }
      };
      setLocalData(updated);
      onUpdateCmsData(updated);
      setSalesLogoSuccessMessage('Logotipo da página de vendas atualizado com sucesso!');
      setTimeout(() => setSalesLogoSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setSalesLogoErrorMessage('Erro ao carregar o arquivo de logotipo.');
      setTimeout(() => setSalesLogoErrorMessage(null), 4000);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleSalesFaviconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSalesFaviconErrorMessage(null);
    if (file.size > 2 * 1024 * 1024) {
      setSalesFaviconErrorMessage('O arquivo de favicon deve ter no máximo 2MB.');
      setTimeout(() => setSalesFaviconErrorMessage(null), 4000);
      return;
    }
    try {
      const base64Url = await readFileAsDataUrl(file);
      const updated = {
        ...localData,
        settings: {
          ...localData.settings,
          faviconUrl: base64Url
        }
      };
      setLocalData(updated);
      onUpdateCmsData(updated);
      updateBrowserFavicon(base64Url);
      setSalesFaviconSuccessMessage('Favicon atualizado e salvo com sucesso!');
      setTimeout(() => setSalesFaviconSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setSalesFaviconErrorMessage('Erro ao carregar o favicon.');
      setTimeout(() => setSalesFaviconErrorMessage(null), 4000);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Selected item modals / inline edit states
  const [editingPlan, setEditingPlan] = useState<SalesPlan | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // Save changes handler
  const handleSave = () => {
    onUpdateCmsData(localData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Update lead status
  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadRegistration['status']) => {
    const updatedLeads = localData.leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status: newStatus };
      }
      return lead;
    });
    const updated = { ...localData, leads: updatedLeads };
    setLocalData(updated);
    onUpdateCmsData(updated);
  };

  // Delete lead
  const handleDeleteLead = (leadId: string) => {
    if (confirm('Deseja realmente remover este registro de lead?')) {
      const updatedLeads = localData.leads.filter(l => l.id !== leadId);
      const updated = { ...localData, leads: updatedLeads };
      setLocalData(updated);
      onUpdateCmsData(updated);
    }
  };

  // Filtered Leads
  const filteredLeads = localData.leads.filter(l => {
    const matchesSearch = 
      l.fullName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.agencyName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.subdomain.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === 'ALL' || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalLeads = localData.leads.length;
  const newLeads = localData.leads.filter(l => l.status === 'NOVO').length;
  const convertedLeads = localData.leads.filter(l => l.status === 'CONVERTIDO').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Banner / CMS Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CMS DA PÁGINA DE VENDAS
              </span>
              <span className="text-xs text-slate-400 font-mono">Planos a partir de R$ 399,99/mês</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Gerenciador de Conteúdo, Preços e Leads da Landing Page
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-2xl">
              Edite textos, planos a partir de R$ 399,99, módulos de splits com 10 APIs e gerencie os leads capturados em tempo real.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLiveSalesPage}
              className="px-4 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Ver Página de Vendas ao Vivo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* CMS Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Total de Leads Capturados</div>
            <div className="text-xl font-bold text-white mt-0.5">{totalLeads}</div>
            <div className="text-[10px] text-blue-400 mt-0.5">Originados do formulário</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Novos Leads Pendentes</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{newLeads}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Aguardando 1º contato</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Convertidos em Tenants</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{convertedLeads}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">{conversionRate}% de taxa de conversão</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Preço de Entrada Ativo</div>
            <div className="text-xl font-bold text-purple-400 mt-0.5">R$ 399,99/mês</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Plano Start Imob</div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-800/80 mt-6 no-scrollbar text-xs font-semibold">
          {[
            { id: 'leads_crm' as CmsSubTab, label: 'Leads Capturados (CRM)', icon: Users, count: localData.leads.length },
            { id: 'plans_pricing' as CmsSubTab, label: 'Planos & Preços (R$ 399,99+)', icon: DollarSign, count: localData.plans.length },
            { id: 'hero_content' as CmsSubTab, label: 'Hero & Textos Principais', icon: Sparkles },
            { id: 'lead_features' as CmsSubTab, label: 'Destaques Gestão Leads', icon: Zap, count: localData.leadHighlights.length },
            { id: 'erp_splits' as CmsSubTab, label: 'ERP & Splits 10 APIs', icon: Building2, count: localData.erpHighlights.length },
            { id: 'testimonials' as CmsSubTab, label: 'Depoimentos de Diretores', icon: Star, count: localData.testimonials.length },
            { id: 'faqs' as CmsSubTab, label: 'FAQ / Tira-Dúvidas', icon: HelpCircle, count: localData.faqs.length },
            { id: 'settings' as CmsSubTab, label: 'Identidade, Logo & Avisos', icon: Palette },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Save Alert */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Configurações da Página de Vendas salvas com sucesso!</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: LEADS CAPTURADOS PELO FORMULÁRIO                  */}
      {/* ======================================================== */}
      {activeSubTab === 'leads_crm' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Buscar lead por nome, imobiliária, e-mail, telefone ou subdomínio..."
                className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-slate-700"
              >
                <option value="ALL">Todos os Status</option>
                <option value="NOVO">Novos (Aguardando)</option>
                <option value="EM_CONTATO">Em Contato</option>
                <option value="DEMO_AGENDADA">Demonstração Agendada</option>
                <option value="CONVERTIDO">Convertidos em Clientes</option>
                <option value="DESQUALIFICADO">Desqualificados</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3.5">Data & Status</th>
                    <th className="p-3.5">Nome & Contato</th>
                    <th className="p-3.5">Imobiliária & Localização</th>
                    <th className="p-3.5">Plano Desejado & Corretores</th>
                    <th className="p-3.5">Subdomínio</th>
                    <th className="p-3.5 text-right">Ações de Conversão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Nenhum lead encontrado com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                        `Olá ${lead.fullName}! Sou do time executivo do Acert Imob. Vi que você cadastrou a imobiliária ${lead.agencyName} com interesse no plano ${lead.planName}. Gostaria de tirar dúvidas ou fazer um tour VIP guiado?`
                      )}`;

                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Date & Status */}
                          <td className="p-3.5">
                            <div className="text-[11px] text-slate-400 font-mono">{lead.createdAt}</div>
                            <div className="mt-1">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                                  lead.status === 'NOVO'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : lead.status === 'EM_CONTATO'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : lead.status === 'DEMO_AGENDADA'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : lead.status === 'CONVERTIDO'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                <option value="NOVO">NOVO</option>
                                <option value="EM_CONTATO">EM CONTATO</option>
                                <option value="DEMO_AGENDADA">DEMO AGENDADA</option>
                                <option value="CONVERTIDO">CONVERTIDO</option>
                                <option value="DESQUALIFICADO">DESQUALIFICADO</option>
                              </select>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{lead.fullName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{lead.email}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{lead.phone}</span>
                            </div>
                          </td>

                          {/* Agency */}
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>{lead.agencyName}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{lead.city}</span>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                              {lead.planName || lead.planId}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1">
                              Equipe: {lead.brokersCount}
                            </div>
                          </td>

                          {/* Subdomain */}
                          <td className="p-3.5 font-mono text-xs text-slate-600">
                            <span className="font-bold text-slate-900">{lead.subdomain}</span>
                            <span className="text-slate-400">.acertimob.com.br</span>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                              title="Iniciar conversa no WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>

                            {onConvertLeadToTenant && lead.status !== 'CONVERTIDO' && (
                              <button
                                onClick={() => {
                                  onConvertLeadToTenant(lead);
                                  handleUpdateLeadStatus(lead.id, 'CONVERTIDO');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                                title="Criar Tenant diretamente no Super Admin"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Criar Tenant</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Excluir lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GESTÃO DE PLANOS & PREÇOS (A PARTIR DE 399,99)     */}
      {/* ======================================================== */}
      {activeSubTab === 'plans_pricing' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Planos Oferecidos na Página de Vendas
              </h3>
              <p className="text-xs text-slate-500">
                Configure os planos de assinatura exibidos para o público, com preços a partir de R$ 399,99.
              </p>
            </div>
            <button
              onClick={() => {
                const newPlan: SalesPlan = {
                  id: `plan_custom_${Date.now()}`,
                  name: 'Novo Plano',
                  tag: 'Personalizado',
                  badge: 'NOVO',
                  monthlyPrice: 499.99,
                  annualPrice: 399.99,
                  description: 'Descrição do novo plano customizado',
                  maxBrokers: 'Até 8 Corretores',
                  maxProperties: 'Até 500 Imóveis',
                  maxLeadsMonth: 'Leads Ilimitados',
                  features: ['Roleta de Leads', 'CRM Kanban', 'Emissão de Boletos'],
                  ctaText: 'Escolher este Plano',
                  active: true
                };
                setEditingPlan(newPlan);
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Plano</span>
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localData.plans.map((plan, pIdx) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${
                  plan.isPopular ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {plan.tag || 'Plano'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {plan.badge && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-extrabold">
                          {plan.badge}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        plan.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {plan.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg font-extrabold text-slate-900">{plan.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-500">Preço Mensal:</div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      R$ {plan.monthlyPrice.toFixed(2)}
                      <span className="text-xs text-slate-500 font-normal">/mês</span>
                    </div>
                    <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                      Anual: R$ {plan.annualPrice.toFixed(2)}/mês (-20%)
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-xs text-slate-600">
                    <div><strong>Equipe:</strong> {plan.maxBrokers}</div>
                    <div><strong>Imóveis:</strong> {plan.maxProperties}</div>
                    <div><strong>Leads:</strong> {plan.maxLeadsMonth}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 mb-1.5">Recursos ({plan.features.length}):</div>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-[11px] text-slate-400 italic">
                          + {plan.features.length - 4} outros recursos...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Plano</span>
                  </button>

                  <button
                    onClick={() => {
                      const updated = localData.plans.map(p => {
                        if (p.id === plan.id) {
                          return { ...p, active: !p.active };
                        }
                        return p;
                      });
                      const newData = { ...localData, plans: updated };
                      setLocalData(newData);
                      onUpdateCmsData(newData);
                    }}
                    className={`text-xs font-bold ${plan.active ? 'text-rose-600' : 'text-emerald-600'}`}
                  >
                    {plan.active ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900">
                    {localData.plans.some(p => p.id === editingPlan.id) ? 'Editar Plano' : 'Criar Novo Plano'}
                  </h4>
                  <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome do Plano</label>
                    <input
                      type="text"
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preço Mensal (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingPlan.monthlyPrice}
                        onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preço Anual com Desconto (R$/mês)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingPlan.annualPrice}
                        onChange={(e) => setEditingPlan({ ...editingPlan, annualPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-xl font-bold text-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      value={editingPlan.description}
                      onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Limite Corretores</label>
                      <input
                        type="text"
                        value={editingPlan.maxBrokers}
                        onChange={(e) => setEditingPlan({ ...editingPlan, maxBrokers: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Limite Imóveis</label>
                      <input
                        type="text"
                        value={editingPlan.maxProperties}
                        onChange={(e) => setEditingPlan({ ...editingPlan, maxProperties: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Volume Leads</label>
                      <input
                        type="text"
                        value={editingPlan.maxLeadsMonth}
                        onChange={(e) => setEditingPlan({ ...editingPlan, maxLeadsMonth: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Recursos Inclusos (um por linha)
                    </label>
                    <textarea
                      rows={6}
                      value={editingPlan.features.join('\n')}
                      onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value.split('\n').filter(Boolean) })}
                      className="w-full px-3 py-2 border rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={editingPlan.isPopular}
                        onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                      />
                      <span>Destacar como "Mais Popular"</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={editingPlan.active}
                        onChange={(e) => setEditingPlan({ ...editingPlan, active: e.target.checked })}
                      />
                      <span>Plano Ativo na Página</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const exists = localData.plans.some(p => p.id === editingPlan.id);
                      let updatedPlans = [];
                      if (exists) {
                        updatedPlans = localData.plans.map(p => p.id === editingPlan.id ? editingPlan : p);
                      } else {
                        updatedPlans = [...localData.plans, editingPlan];
                      }
                      const newData = { ...localData, plans: updatedPlans };
                      setLocalData(newData);
                      onUpdateCmsData(newData);
                      setEditingPlan(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Salvar Plano
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: HERO & TEXTOS PRINCIPAIS                          */}
      {/* ======================================================== */}
      {activeSubTab === 'hero_content' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Textos do Hero Principal</h3>
            <p className="text-xs text-slate-500">
              Personalize o título, a promessa de valor e os gatilhos mentais da primeira dobra da página.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Badge Superior</label>
              <input
                type="text"
                value={localData.hero.badgeText}
                onChange={(e) => setLocalData({ ...localData, hero: { ...localData.hero, badgeText: e.target.value } })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Início do Título</label>
                <input
                  type="text"
                  value={localData.hero.headline}
                  onChange={(e) => setLocalData({ ...localData, hero: { ...localData.hero, headline: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Palavra / Frase Destacada com Gradiente</label>
                <input
                  type="text"
                  value={localData.hero.highlightedWord}
                  onChange={(e) => setLocalData({ ...localData, hero: { ...localData.hero, highlightedWord: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl font-bold text-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subtítulo / Explicação da Solução</label>
              <textarea
                rows={3}
                value={localData.hero.subheadline}
                onChange={(e) => setLocalData({ ...localData, hero: { ...localData.hero, subheadline: e.target.value } })}
                className="w-full px-3 py-2 border rounded-xl leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Texto Botão CTA Principal</label>
                <input
                  type="text"
                  value={localData.hero.primaryCtaText}
                  onChange={(e) => setLocalData({ ...localData, hero: { ...localData.hero, primaryCtaText: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Texto Botão Secundário</label>
                <input
                  type="text"
                  value={localData.hero.secondaryCtaText}
                  onChange={(e) => setLocalData({ ...localData, hero: { ...localData.hero, secondaryCtaText: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Texto de Garantia / Segurança</label>
              <input
                type="text"
                value={localData.hero.guaranteeText}
                onChange={(e) => setLocalData({ ...localData, hero: { ...localData.hero, guaranteeText: e.target.value } })}
                className="w-full px-3 py-2 border rounded-xl text-slate-600"
              />
            </div>

            {/* Stats Editor */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block font-bold text-slate-800 mb-3">4 Métricas em Destaque no Hero</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {localData.hero.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...localData.hero.stats];
                        newStats[sIdx].value = e.target.value;
                        setLocalData({ ...localData, hero: { ...localData.hero, stats: newStats } });
                      }}
                      className="w-full px-2 py-1 text-sm font-extrabold text-blue-600 border rounded"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...localData.hero.stats];
                        newStats[sIdx].label = e.target.value;
                        setLocalData({ ...localData, hero: { ...localData.hero, stats: newStats } });
                      }}
                      className="w-full px-2 py-1 text-xs font-semibold text-slate-700 border rounded"
                    />
                    <input
                      type="text"
                      value={stat.sublabel || ''}
                      onChange={(e) => {
                        const newStats = [...localData.hero.stats];
                        newStats[sIdx].sublabel = e.target.value;
                        setLocalData({ ...localData, hero: { ...localData.hero, stats: newStats } });
                      }}
                      placeholder="Subrótulo explicativo"
                      className="w-full px-2 py-1 text-[11px] text-slate-500 border rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DESTAQUES DE GESTÃO DE LEADS                      */}
      {/* ======================================================== */}
      {activeSubTab === 'lead_features' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Funcionalidades de Gestão de Leads</h3>
            <p className="text-xs text-slate-500">
              Gerencie os blocos que destacam a roleta de 30 segundos, captura unificada e WhatsApp desk oficial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localData.leadHighlights.map((feat, fIdx) => (
              <div key={feat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                    {feat.badge}
                  </span>
                  <span className="text-xs font-extrabold text-blue-600 font-mono">
                    {feat.highlightMetric}
                  </span>
                </div>

                <input
                  type="text"
                  value={feat.title}
                  onChange={(e) => {
                    const updated = [...localData.leadHighlights];
                    updated[fIdx].title = e.target.value;
                    setLocalData({ ...localData, leadHighlights: updated });
                  }}
                  className="w-full text-sm font-bold text-slate-900 border px-2.5 py-1.5 rounded-lg"
                />

                <textarea
                  rows={3}
                  value={feat.description}
                  onChange={(e) => {
                    const updated = [...localData.leadHighlights];
                    updated[fIdx].description = e.target.value;
                    setLocalData({ ...localData, leadHighlights: updated });
                  }}
                  className="w-full text-xs text-slate-600 border px-2.5 py-1.5 rounded-lg"
                />

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Lista de Benefícios (separados por linha):
                  </label>
                  <textarea
                    rows={4}
                    value={feat.bullets.join('\n')}
                    onChange={(e) => {
                      const updated = [...localData.leadHighlights];
                      updated[fIdx].bullets = e.target.value.split('\n').filter(Boolean);
                      setLocalData({ ...localData, leadHighlights: updated });
                    }}
                    className="w-full text-xs text-slate-600 border px-2.5 py-1.5 rounded-lg font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ERP & SPLITS 10 APIS                              */}
      {/* ======================================================== */}
      {activeSubTab === 'erp_splits' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">ERP Imobiliário & Splits Bancários</h3>
            <p className="text-xs text-slate-500">
              Configure as informações dos módulos de split com 10 APIs homologadas, assinatura digital e roteiro GPS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localData.erpHighlights.map((feat, eIdx) => (
              <div key={feat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    {feat.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {feat.highlightMetric}
                  </span>
                </div>

                <input
                  type="text"
                  value={feat.title}
                  onChange={(e) => {
                    const updated = [...localData.erpHighlights];
                    updated[eIdx].title = e.target.value;
                    setLocalData({ ...localData, erpHighlights: updated });
                  }}
                  className="w-full text-sm font-bold text-slate-900 border px-2.5 py-1.5 rounded-lg"
                />

                <textarea
                  rows={4}
                  value={feat.description}
                  onChange={(e) => {
                    const updated = [...localData.erpHighlights];
                    updated[eIdx].description = e.target.value;
                    setLocalData({ ...localData, erpHighlights: updated });
                  }}
                  className="w-full text-xs text-slate-600 border px-2.5 py-1.5 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: DEPOIMENTOS DE DIRETORES                          */}
      {/* ======================================================== */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Depoimentos & Prova Social</h3>
              <p className="text-xs text-slate-500">
                Gerencie histórias reais de imobiliárias clientes com suas respectivas fotos e métricas alcançadas.
              </p>
            </div>
            <button
              onClick={() => {
                const newTest: TestimonialItem = {
                  id: `test_${Date.now()}`,
                  authorName: 'Novo Cliente',
                  authorRole: 'Diretor Geral',
                  companyName: 'Imobiliária Prime',
                  city: 'São Paulo - SP',
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
                  quote: 'Nossa experiência com a plataforma foi excelente, o tempo de atendimento reduziu para segundos.',
                  rating: 5,
                  metricHighlight: '+200% em Vendas',
                  metricLabel: 'em 3 meses',
                  active: true
                };
                setEditingTestimonial(newTest);
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Depoimento</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localData.testimonials.map((test, tIdx) => (
              <div key={test.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      {test.metricHighlight}
                    </span>
                    <span className={`text-[10px] font-bold ${test.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {test.active ? 'ATIVO' : 'OCULTO'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={test.avatarUrl} alt={test.authorName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{test.authorName}</div>
                      <div className="text-[10px] text-slate-500">{test.companyName}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = localData.testimonials.filter(t => t.id !== test.id);
                      const newData = { ...localData, testimonials: updated };
                      setLocalData(newData);
                      onUpdateCmsData(newData);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Testimonial Modal */}
          {editingTestimonial && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h4 className="text-sm font-bold text-slate-900">Editar Depoimento</h4>
                  <button onClick={() => setEditingTestimonial(null)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Nome do Autor</label>
                    <input
                      type="text"
                      value={editingTestimonial.authorName}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, authorName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Cargo & Empresa</label>
                    <input
                      type="text"
                      value={editingTestimonial.companyName}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, companyName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Métrica Destacada</label>
                    <input
                      type="text"
                      value={editingTestimonial.metricHighlight}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, metricHighlight: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Texto do Depoimento</label>
                    <textarea
                      rows={3}
                      value={editingTestimonial.quote}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button onClick={() => setEditingTestimonial(null)} className="px-3 py-2 border rounded-xl text-xs">
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const exists = localData.testimonials.some(t => t.id === editingTestimonial.id);
                      const updated = exists 
                        ? localData.testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t)
                        : [...localData.testimonials, editingTestimonial];
                      const newData = { ...localData, testimonials: updated };
                      setLocalData(newData);
                      onUpdateCmsData(newData);
                      setEditingTestimonial(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: FAQ                                               */}
      {/* ======================================================== */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Perguntas Frequentes (FAQ)</h3>
              <p className="text-xs text-slate-500">
                Responda às principais dúvidas sobre planos a partir de R$ 399,99, migração e splits.
              </p>
            </div>
            <button
              onClick={() => {
                const newFaq: FaqItem = {
                  id: `faq_${Date.now()}`,
                  question: 'Nova Pergunta?',
                  answer: 'Resposta detalhada para a pergunta.',
                  category: 'GERAL',
                  active: true
                };
                const updated = [...localData.faqs, newFaq];
                const newData = { ...localData, faqs: updated };
                setLocalData(newData);
                onUpdateCmsData(newData);
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Pergunta</span>
            </button>
          </div>

          <div className="space-y-3">
            {localData.faqs.map((faq, fIdx) => (
              <div key={faq.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {faq.category}
                  </span>
                  <button
                    onClick={() => {
                      const updated = localData.faqs.filter(f => f.id !== faq.id);
                      const newData = { ...localData, faqs: updated };
                      setLocalData(newData);
                      onUpdateCmsData(newData);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...localData.faqs];
                    updated[fIdx].question = e.target.value;
                    setLocalData({ ...localData, faqs: updated });
                  }}
                  className="w-full text-xs font-bold text-slate-900 border px-3 py-2 rounded-xl"
                />

                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...localData.faqs];
                    updated[fIdx].answer = e.target.value;
                    setLocalData({ ...localData, faqs: updated });
                  }}
                  className="w-full text-xs text-slate-600 border px-3 py-2 rounded-xl leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: IDENTIDADE, LOGO, FAVICON & AVISOS                */}
      {/* ======================================================== */}
      {activeSubTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                Identidade Visual, Logotipo & Favicon da Página de Vendas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Faça upload do logotipo exibido no topo da página de vendas, personalize o favicon do navegador e ajuste avisos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={salesLogoInputRef}
            accept="image/*,.png,.svg,.webp"
            onChange={handleSalesLogoFileChange}
            className="hidden"
          />
          <input
            type="file"
            ref={salesFaviconInputRef}
            accept="image/*,.ico,.png,.svg,.webp"
            onChange={handleSalesFaviconFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* CARD 1: UPLOAD DO LOGOTIPO DA PÁGINA DE VENDAS */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Logotipo da Página de Vendas (Header & Rodapé)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => salesLogoInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    title="Fazer upload de imagem do seu computador"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Logotipo</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... ou faça upload do arquivo acima"
                    value={localData.settings.logoUrl || ''}
                    onChange={(e) => {
                      const updated = {
                        ...localData,
                        settings: { ...localData.settings, logoUrl: e.target.value }
                      };
                      setLocalData(updated);
                      onUpdateCmsData(updated);
                    }}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {localData.settings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...localData,
                          settings: { ...localData.settings, logoUrl: '' }
                        };
                        setLocalData(updated);
                        onUpdateCmsData(updated);
                      }}
                      className="px-2 py-1 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remover logotipo personalizado"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {salesLogoSuccessMessage && (
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{salesLogoSuccessMessage}</span>
                  </div>
                )}

                {salesLogoErrorMessage && (
                  <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                    <span>{salesLogoErrorMessage}</span>
                  </div>
                )}

                {/* Live Logo Preview Box simulating dark header */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-2.5">
                    {localData.settings.logoUrl ? (
                      <div 
                        style={{ height: `${Math.max(36, (localData.settings.logoHeight || 52) * 0.7)}px` }}
                        className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center"
                      >
                        <img
                          src={localData.settings.logoUrl}
                          alt="Preview do Logo"
                          style={{ maxHeight: `${Math.max(28, (localData.settings.logoHeight || 52) * 0.65)}px`, maxWidth: `${Math.max(120, (localData.settings.logoWidth || 260) * 0.7)}px` }}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                        {(localData.settings.platformName || 'A').charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block leading-none">
                        {localData.settings.platformName || 'Acert Imob'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Preview no Topo da LP ({localData.settings.logoHeight || 60}px alt × {localData.settings.logoWidth || 280}px larg)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                    Ativo na LP
                  </span>
                </div>

                {/* CONTROLE DE TAMANHO DO LOGO NA PÁGINA DE VENDAS */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tamanho do Logotipo no Site (Página de Vendas)</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {localData.settings.logoHeight || 60}px × {localData.settings.logoWidth || 280}px
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Ajuste a escala para que seu logotipo apareça com destaque e legibilidade perfeita na página pública.
                  </p>

                  {/* Presets Rápidos */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: 'Pequeno (36px)', height: 36, width: 180 },
                      { label: 'Médio (52px)', height: 52, width: 240 },
                      { label: 'Grande (72px)', height: 72, width: 320 },
                      { label: 'Destaque (96px)', height: 96, width: 380 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...localData,
                            settings: {
                              ...localData.settings,
                              logoHeight: preset.height,
                              logoWidth: preset.width
                            }
                          };
                          setLocalData(updated);
                          onUpdateCmsData(updated);
                        }}
                        className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition-all ${
                          (localData.settings.logoHeight || 60) === preset.height
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Sliders Finos de Altura e Largura */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium mb-1">
                        <span>Altura do Logo:</span>
                        <strong className="text-slate-900 font-mono">{localData.settings.logoHeight || 60}px</strong>
                      </div>
                      <input
                        type="range"
                        min="28"
                        max="120"
                        step="2"
                        value={localData.settings.logoHeight || 60}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated = {
                            ...localData,
                            settings: { ...localData.settings, logoHeight: val }
                          };
                          setLocalData(updated);
                          onUpdateCmsData(updated);
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium mb-1">
                        <span>Largura Máxima:</span>
                        <strong className="text-slate-900 font-mono">{localData.settings.logoWidth || 280}px</strong>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="400"
                        step="10"
                        value={localData.settings.logoWidth || 280}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated = {
                            ...localData,
                            settings: { ...localData.settings, logoWidth: val }
                          };
                          setLocalData(updated);
                          onUpdateCmsData(updated);
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: UPLOAD DO FAVICON DA PÁGINA DE VENDAS & NAVEGADOR */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Favicon da Aba do Navegador (.ico, .png, .svg)
                </label>
                <div className="flex items-center gap-1.5">
                  {localData.settings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...localData,
                          settings: {
                            ...localData.settings,
                            faviconUrl: localData.settings.logoUrl
                          }
                        };
                        setLocalData(updated);
                        onUpdateCmsData(updated);
                        updateBrowserFavicon(localData.settings.logoUrl!);
                        setSalesFaviconSuccessMessage('Favicon sincronizado com o logotipo da página!');
                        setTimeout(() => setSalesFaviconSuccessMessage(null), 3500);
                      }}
                      className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Usar a mesma imagem do logotipo como favicon"
                    >
                      Usar Logo
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => salesFaviconInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    title="Fazer upload de arquivo de favicon"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Favicon</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {salesFaviconSuccessMessage && (
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{salesFaviconSuccessMessage}</span>
                  </div>
                )}

                {salesFaviconErrorMessage && (
                  <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                    <span>{salesFaviconErrorMessage}</span>
                  </div>
                )}

                {/* Browser Tab Simulation Widget */}
                <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    <span>Aba do Navegador:</span>
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold normal-case">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Ao Vivo
                    </span>
                  </div>

                  <div className="bg-slate-100 p-1.5 rounded-md flex items-center">
                    <div className="bg-white px-3 py-1.5 rounded-t-md shadow-2xs border-t-2 border-blue-500 flex items-center gap-2 max-w-xs">
                      {localData.settings.logoUrl ? (
                        <img
                          src={localData.settings.logoUrl}
                          alt="Favicon"
                          className="w-4 h-4 object-contain rounded-xs shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-xs bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                          {(localData.settings.platformName || 'A').charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {localData.settings.metaTitle || 'Acert Imob - CRM ERP'}
                      </span>
                      <X className="w-3 h-3 text-slate-400 hover:text-slate-600 ml-1 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Barra de Aviso Superior da Landing Page</span>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={localData.settings.announcementActive}
                    onChange={(e) => setLocalData({
                      ...localData,
                      settings: { ...localData.settings, announcementActive: e.target.checked }
                    })}
                  />
                  <span>Exibir Barra no Topo</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Badge da Barra (ex: NOVIDADE, PROMOÇÃO):</label>
                <input
                  type="text"
                  value={localData.settings.announcementBadge}
                  onChange={(e) => setLocalData({
                    ...localData,
                    settings: { ...localData.settings, announcementBadge: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Texto do Aviso:</label>
                <input
                  type="text"
                  value={localData.settings.announcementBarText}
                  onChange={(e) => setLocalData({
                    ...localData,
                    settings: { ...localData.settings, announcementBarText: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">WhatsApp de Atendimento & Conversão</span>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={localData.settings.showFloatingWhatsapp}
                    onChange={(e) => setLocalData({
                      ...localData,
                      settings: { ...localData.settings, showFloatingWhatsapp: e.target.checked }
                    })}
                  />
                  <span>Botão Flutuante Ativo</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Número de WhatsApp (com DDI e DDD, apenas números):</label>
                <input
                  type="text"
                  value={localData.settings.whatsappContactNumber}
                  onChange={(e) => setLocalData({
                    ...localData,
                    settings: { ...localData.settings, whatsappContactNumber: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Mensagem Padrão Pré-preenchida no Chat:</label>
                <input
                  type="text"
                  value={localData.settings.whatsappDefaultMessage}
                  onChange={(e) => setLocalData({
                    ...localData,
                    settings: { ...localData.settings, whatsappDefaultMessage: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

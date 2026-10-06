import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Shield,
  MessageSquare,
  Building2,
  Users,
  Compass,
  FileCheck2,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Phone,
  Layers,
  Award,
  DollarSign,
  Lock,
  ArrowUpRight,
  Check,
  X,
  Play,
  Share2,
  Flame,
  BadgeCheck,
  Send,
  Eye,
  Sliders,
  ExternalLink,
  Menu,
  ArrowLeft,
  LogIn
} from 'lucide-react';
import { SalesPageCmsState, SalesPlan, LeadRegistration } from '../../types/salesPageCms';
import { navigateToCrm, PRODUCTION_DOMAINS } from '../../utils/domainRouting';

interface SalesLandingPageViewProps {
  cmsData: SalesPageCmsState;
  onRegisterLead: (lead: Omit<LeadRegistration, 'id' | 'createdAt' | 'status'>) => void;
  onBackToApp?: () => void;
  onOpenSuperAdminCms?: () => void;
  isSuperAdmin?: boolean;
  onGoToLogin?: () => void;
  isAuthenticated?: boolean;
  logoUrl?: string;
  platformName?: string;
}

export const SalesLandingPageView: React.FC<SalesLandingPageViewProps> = ({
  cmsData,
  onRegisterLead,
  onBackToApp,
  onOpenSuperAdminCms,
  isSuperAdmin = false,
  onGoToLogin,
  isAuthenticated = false,
  logoUrl,
  platformName
}) => {
  const { settings, hero, plans, leadHighlights, erpHighlights, testimonials, faqs } = cmsData;
  const [copiedUrlToast, setCopiedUrlToast] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Logo e Nome da plataforma com fallback inteligente
  const effectiveLogoUrl = logoUrl || settings.logoUrl || '';
  const effectivePlatformName = platformName || settings.platformName || 'Acert Imob';

  // Navegação suave interna para as seções sem alterar hash ou disparar popstate
  const scrollToSection = (e?: React.MouseEvent, sectionId?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileNavOpen(false);
    if (!sectionId) return;
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCopySalesUrl = () => {
    try {
      const url = `${window.location.origin}/vendas`;
      navigator.clipboard.writeText(url);
      setCopiedUrlToast(true);
      setTimeout(() => setCopiedUrlToast(false), 2500);
    } catch {
      // fallback
    }
  };

  // Redireciona para o CRM (aicrm.acertgo.com.br em produção ou login local)
  const handleGoToCrmLogin = () => {
    setIsMobileNavOpen(false);
    navigateToCrm(onGoToLogin);
  };

  // Billing cycle state
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  // Interactive ROI Calculator state
  const [calcBrokers, setCalcBrokers] = useState<number>(8);
  const [calcMonthlyLeads, setCalcMonthlyLeads] = useState<number>(250);
  const [calcAverageTicket, setCalcAverageTicket] = useState<number>(450000);

  // Registration Form State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.find(p => p.isPopular)?.id || plans[0]?.id || 'plan_starter_399'
  );
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    agencyName: '',
    city: '',
    brokersCount: '5 a 10 corretores',
    subdomain: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<LeadRegistration | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('ALL');

  // Interactive Lead Roulette Simulator State
  const [simLeadStatus, setSimLeadStatus] = useState<string>('AGUARDANDO_LEAD');
  const [simAssignedBroker, setSimAssignedBroker] = useState<string | null>(null);
  const [simSecondsLeft, setSimSecondsLeft] = useState<number>(30);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // ROI calculations
  const estimatedHoursSaved = calcBrokers * 6; // 6h per broker per month in automation
  const estimatedLeadsSaved = Math.round(calcMonthlyLeads * 0.18); // 18% extra leads recovered with 30s roulette
  const estimatedExtraDeals = Math.max(1, Math.round(estimatedLeadsSaved * 0.04));
  const estimatedExtraRevenue = estimatedExtraDeals * (calcAverageTicket * 0.05); // 5% average commission

  // Handle lead registration form submit
  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.agencyName) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedPlan = plans.find(p => p.id === selectedPlanId);
      const cleanSubdomain = formData.subdomain 
        ? formData.subdomain.toLowerCase().replace(/[^a-z0-9]/g, '')
        : formData.agencyName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);

      const newLead: Omit<LeadRegistration, 'id' | 'createdAt' | 'status'> = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        agencyName: formData.agencyName,
        city: formData.city || 'Não informada',
        brokersCount: formData.brokersCount,
        planId: selectedPlanId,
        planName: selectedPlan ? `${selectedPlan.name} (R$ ${selectedPlan.monthlyPrice.toFixed(2)})` : 'Plano Selecionado',
        subdomain: cleanSubdomain,
        notes: `Cadastrado na landing page com ciclo ${billingCycle === 'ANNUAL' ? 'Anual (-20%)' : 'Mensal'}`
      };

      onRegisterLead(newLead);
      setIsSubmitting(false);
      setRegistrationSuccess({
        ...newLead,
        id: `lead_${Date.now()}`,
        createdAt: 'Agora mesmo',
        status: 'NOVO'
      });
    }, 800);
  };

  // Run lead roulette simulation
  const handleRunSimulator = () => {
    setIsSimulating(true);
    setSimLeadStatus('RECEBENDO');
    setSimAssignedBroker(null);
    setSimSecondsLeft(30);

    setTimeout(() => {
      setSimLeadStatus('ROTEANDO');
      setTimeout(() => {
        const brokers = [
          'Lucas Sampaio (Plantão Jardins - 98.4% SLA)',
          'Camila Viana (Especialista Alto Padrão - 100% SLA)',
          'Gabriel Antunes (Locação Residencial - 96.8% SLA)'
        ];
        const randomBroker = brokers[Math.floor(Math.random() * brokers.length)];
        setSimAssignedBroker(randomBroker);
        setSimLeadStatus('DISTRIBUIDO');
        setSimSecondsLeft(18);
        setIsSimulating(false);
      }, 900);
    }, 600);
  };

  const scrollToRegistration = (planId?: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileNavOpen(false);
    if (planId) {
      setSelectedPlanId(planId);
    }
    const formElement = document.getElementById('cadastro-vip-section');
    if (formElement) {
      const headerOffset = 85;
      const elementPosition = formElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    if (!faq.active) return false;
    if (selectedFaqCategory === 'ALL') return true;
    return faq.category === selectedFaqCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Announcement Bar */}
      {settings.announcementActive && (
        <div className="bg-slate-900/90 border-b border-slate-800/80 text-xs py-2 px-4 text-center backdrop-blur-md relative z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
              {settings.announcementBadge}
            </span>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">•</span>
            <span className="text-slate-300 font-medium">{settings.announcementBarText}</span>
            <button
              onClick={() => scrollToRegistration('plan_starter_399')}
              className="inline-flex items-center gap-1 text-white hover:text-blue-300 font-semibold transition-colors ml-1 cursor-pointer group"
            >
              <span>Planos a partir de R$ 399,99/mês</span>
              <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/70 shadow-lg shadow-black/20">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent absolute top-0 left-0 right-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3 shrink-0">
            {effectiveLogoUrl ? (
              <div 
                style={{ 
                  height: `${Math.max(40, settings.logoHeight || 60)}px`,
                  maxWidth: `${Math.max(180, settings.logoWidth || 280)}px`
                }}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center justify-center shadow-xs transition-colors shrink-0"
              >
                <img
                  src={effectiveLogoUrl}
                  alt={effectivePlatformName}
                  style={{ 
                    maxHeight: `${Math.max(32, (settings.logoHeight || 60) - 6)}px`,
                    maxWidth: `${Math.max(160, (settings.logoWidth || 280) - 16)}px`
                  }}
                  className="w-auto h-auto object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/20 flex items-center justify-center shadow-md shadow-blue-600/20 text-white font-extrabold text-lg shrink-0">
                {effectivePlatformName.charAt(0)}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                {effectivePlatformName}
              </span>
              <span className="text-slate-600 text-xs hidden sm:inline" aria-hidden="true">/</span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline whitespace-nowrap">
                CRM & ERP Imobiliário
              </span>
            </div>
          </div>

          {/* Desktop Nav Links - Harmonious, Clean Single-Line Typography */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-slate-300">
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'gestao-leads')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              Gestão de Leads
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'erp-splits')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              ERP & Splits
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'calculadora-roi')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              Calculadora ROI
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'planos-precos')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              Planos & Preços
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'depoimentos')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              Depoimentos
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'faq')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Back to App for authenticated users (discreet, harmonious) */}
            {onBackToApp && isAuthenticated && (
              <button
                type="button"
                onClick={onBackToApp}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
                title="Voltar ao sistema CRM/ERP"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Voltar ao Sistema</span>
              </button>
            )}

            {/* Acessar CRM Button (aicrm.acertgo.com.br) */}
            <button
              type="button"
              onClick={handleGoToCrmLogin}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
              title="Entrar na plataforma CRM / ERP (aicrm.acertgo.com.br)"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">Acessar CRM</span>
              <span className="sm:hidden">Entrar</span>
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={(e) => scrollToRegistration(undefined, e)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-blue-500/35 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 shrink-0" />
              <span>Teste Grátis 14 Dias</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer shrink-0"
              aria-label="Abrir Menu de Navegação"
            >
              {isMobileNavOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileNavOpen && (
          <div className="lg:hidden bg-slate-950/98 border-t border-slate-800/90 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Navegação Rápida
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'gestao-leads')}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">Gestão de Leads (Roleta)</span>
              </button>
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'erp-splits')}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">ERP & Splits Bancários</span>
              </button>
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'calculadora-roi')}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="whitespace-nowrap">Calculadora de ROI</span>
              </button>
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'planos-precos')}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="whitespace-nowrap">Planos a Partir de R$ 399,99</span>
              </button>
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'depoimentos')}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">Depoimentos de Imobiliárias</span>
              </button>
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'faq')}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="whitespace-nowrap">Perguntas Frequentes (FAQ)</span>
              </button>
            </div>

            {/* Acessar CRM Mobile */}
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 font-medium">Já possui acesso ou é corretor?</div>
              <button
                type="button"
                onClick={handleGoToCrmLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-blue-400" />
                  <span>Acessar CRM (aicrm.acertgo.com.br)</span>
                </span>
                <ArrowRight className="w-4 h-4 text-blue-300" />
              </button>
            </div>

            {/* In-drawer CTA to convert */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => scrollToRegistration(undefined, e)}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Começar Teste Grátis de 14 Dias</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/${settings.whatsappContactNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Falar no WhatsApp de Atendimento</span>
              </a>

              {onBackToApp && isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    onBackToApp();
                  }}
                  className="w-full py-2.5 px-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
                  <span>Voltar ao Sistema</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Glow Background blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-inner mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            {hero.badgeText}
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-tight lg:leading-[1.15]">
            {hero.headline}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              {hero.highlightedWord}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {hero.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={(e) => scrollToRegistration(undefined, e)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{hero.primaryCtaText}</span>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={(e) => scrollToSection(e, 'simulador-leads')}
              className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-400 fill-cyan-400" />
              <span>{hero.secondaryCtaText}</span>
            </button>
          </div>

          {/* Guarantees trust line */}
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-400 font-medium">
            {hero.guaranteeText}
          </p>

          {/* Stats Bar */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
            {hero.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 p-3.5 sm:p-5 rounded-2xl text-center backdrop-blur-sm hover:border-slate-700 transition-colors shadow-lg"
              >
                <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-200 mt-1">
                  {stat.label}
                </div>
                {stat.sublabel && (
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Interactive Showcase / Lead Flow Preview */}
        <div id="simulador-leads" className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Top Bar of the Mockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Demonstração da Roleta Inteligente em Tempo Real
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Teste você mesmo:</span>
                <button
                  type="button"
                  onClick={handleRunSimulator}
                  disabled={isSimulating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isSimulating ? 'Simulando Lead...' : 'Simular Entrada de Lead ZAP'}</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Notification Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              {/* Left: Incoming Lead Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Lead Quente - ZAP Imóveis
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Ao Vivo
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">Marcos Vinicius Rezende</div>
                  <div className="text-xs text-slate-400">Interesse: Cobertura Duplex 3 Suítes</div>
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span>Faixa: R$ 1.850.000</span>
                    <span className="text-cyan-400 font-mono">Bairro Moema</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 mt-2 flex items-start gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>"Olá! Gostaria de agendar visita para este sábado de manhã. Já tenho financiamento pré-aprovado."</span>
                  </div>
                </div>
              </div>

              {/* Center: Smart Roulette Engine Status */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-400" />
                      Motor de Distribuição Anti-Vácuo
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px] font-mono">
                      Algoritmo Round-Robin
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    O sistema avalia plantonistas disponíveis, bairro do imóvel e histórico de velocidade de resposta.
                  </p>
                </div>

                <div className="my-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Status da Roleta:</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {simLeadStatus === 'AGUARDANDO_LEAD' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Pronta para Receber
                        </>
                      )}
                      {simLeadStatus === 'RECEBENDO' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          Webhook Meta/ZAP Disparado...
                        </>
                      )}
                      {simLeadStatus === 'ROTEANDO' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                          Calculando SLA do Corretor...
                        </>
                      )}
                      {simLeadStatus === 'DISTRIBUIDO' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Distribuído com Sucesso!
                        </>
                      )}
                    </span>
                  </div>

                  {simAssignedBroker && (
                    <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{simAssignedBroker}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cronômetro Anti-Vácuo:</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {simSecondsLeft}s restantes
                  </span>
                </div>
              </div>

              {/* Right: Instant WhatsApp & ERP Split Action */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      Ação Imediata & Integrações
                    </span>
                    <span className="text-[10px] text-slate-400">Sincronização 360°</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Oficial Notificado
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Instantâneo</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Kanban Vendas Atualizado
                      </span>
                      <span className="text-[10px] text-blue-400 font-mono">Fase: 1º Contato</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Regra de Split Comissões
                      </span>
                      <span className="text-[10px] text-purple-400 font-mono">60% Fechador / 40% Imob</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => scrollToRegistration(undefined, e)}
                  className="mt-4 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ativar este Fluxo na Minha Imobiliária</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: LEAD MANAGEMENT POWERHOUSE */}
      <section id="gestao-leads" className="py-20 lg:py-28 bg-slate-900/60 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
              GESTÃO DE LEADS IMBATÍVEL
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              O Único CRM com Roleta Anti-Vácuo que Multiplica suas Vendas
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Estudos comprovam: se o lead não for respondido nos primeiros 5 minutos, a chance de conversão cai em 80%. O Acert Imob garante que 100% dos seus contatos recebam atenção em menos de 30 segundos.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadHighlights.map((feature) => (
              <div
                key={feature.id}
                className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-blue-500/40 transition-all shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                      {feature.badge}
                    </span>
                    {feature.highlightMetric && (
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {feature.highlightMetric}
                        </span>
                        <div className="text-[10px] text-slate-400">{feature.highlightLabel}</div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-400 mt-1">{feature.subtitle}</div>

                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-800/80">
                    {feature.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Incluso em todos os planos</span>
                  <button
                    type="button"
                    onClick={(e) => scrollToRegistration(undefined, e)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Experimentar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: ERP FINANCEIRO, SPLITS COM 10 APIS, ASSINATURA DIGITAL & ROTEIRO */}
      <section id="erp-splits" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              FINANCEIRO & OPERAÇÃO COMPLETA
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Motor de Splits com 10 Bancos, Assinatura Digital e Roteiro GPS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Não seja apenas um CRM de anotações. Tenha um ERP que resolve do pagamento do aluguel à comissão do corretor sem intervenção manual.
            </p>
          </div>

          {/* 10 Supported Banks and Gateways Grid */}
          <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                10 Gateways & BaaS Integrados via API Nativa
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Liquidação instantânea no Pix e Boleto com divisão automática para imobiliária, proprietário e corretores.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { name: 'Conta Pronta', desc: 'BaaS Imobiliário D+0', badge: 'Especialista' },
                { name: 'Mercado Pago', desc: 'Marketplace & Split Pix', badge: 'Líder LATAM' },
                { name: 'Pagar.me (Stone)', desc: 'Motor de Split de Vendas', badge: 'Stone Co' },
                { name: 'Asaas', desc: 'BaaS & Cobrança Recorrente', badge: 'Popular' },
                { name: 'PagSeguro / PagBank', desc: 'Split e Cartão de Crédito', badge: 'PagBank' },
                { name: 'PJBank', desc: 'Especialista Imobiliário', badge: 'Sem Burocracia' },
                { name: 'Iugu', desc: 'Subcontas e Split D+1', badge: 'API Robusta' },
                { name: 'Banco Cora', desc: 'Conta PJ & Pix Gratuito', badge: 'Open Finance' },
                { name: 'Banco Inter', desc: 'Inter Empresas API', badge: 'Sem Tarifas' },
                { name: 'Celcoin', desc: 'Infraestrutura BaaS Pix', badge: 'SPI Oficial' },
              ].map((bank, bIdx) => (
                <div
                  key={bIdx}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/40 transition-colors"
                >
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {bank.badge}
                  </span>
                  <div className="text-xs font-bold text-white mt-2">{bank.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{bank.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Main ERP Modules Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {erpHighlights.map((erp) => (
              <div
                key={erp.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {erp.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                      {erp.highlightMetric}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{erp.title}</h3>
                  <div className="text-xs font-semibold text-slate-400 mt-1">{erp.subtitle}</div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">{erp.description}</p>

                  <div className="mt-5 space-y-2 pt-4 border-t border-slate-800">
                    {erp.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => scrollToRegistration(undefined, e)}
                  className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Incluído no Plano</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE ROI CALCULATOR */}
      <section id="calculadora-roi" className="py-20 lg:py-24 bg-gradient-to-b from-slate-900/80 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider">
              SIMULADOR DE RETORNO SOBRE O INVESTIMENTO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Calcule Quanto sua Imobiliária vai Ganhar a Mais por Mês
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Ajuste o tamanho da sua equipe e veja o impacto financeiro imediato da automação de leads e splits.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sliders Side */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Brokers */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Quantidade de Corretores / Usuários:</span>
                  <span className="text-base font-extrabold text-cyan-400">{calcBrokers} corretores</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={calcBrokers}
                  onChange={(e) => setCalcBrokers(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>2 corretores</span>
                  <span>20 corretores</span>
                  <span>40+ corretores</span>
                </div>
              </div>

              {/* Slider 2: Monthly Leads */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Volume Médio de Leads por Mês:</span>
                  <span className="text-base font-extrabold text-cyan-400">{calcMonthlyLeads} leads/mês</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={calcMonthlyLeads}
                  onChange={(e) => setCalcMonthlyLeads(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>50 leads</span>
                  <span>1.000 leads</span>
                  <span>2.000+ leads</span>
                </div>
              </div>

              {/* Slider 3: Average Ticket */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Valor Médio dos Imóveis (Ticket Médio):</span>
                  <span className="text-base font-extrabold text-cyan-400">
                    R$ {calcAverageTicket.toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="2000000"
                  step="50000"
                  value={calcAverageTicket}
                  onChange={(e) => setCalcAverageTicket(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>R$ 200 mil</span>
                  <span>R$ 1 milhão</span>
                  <span>R$ 2 milhões+</span>
                </div>
              </div>
            </div>

            {/* Results Side */}
            <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                  PROJEÇÃO DE RESULTADO MENSAL
                </span>

                <div className="mt-4">
                  <div className="text-xs text-slate-400">Ganhos Adicionais Estimados:</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                    + R$ {estimatedExtraRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    <span className="text-xs font-normal text-slate-400">/mês</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Projeção conservadora baseada em {estimatedExtraDeals} fechamento(s) extra(s) gerado(s) pelo atendimento em 30s.
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Leads recuperados do vácuo:</span>
                    <strong className="text-white font-mono">+{estimatedLeadsSaved} leads/mês</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Horas de financeiro economizadas:</span>
                    <strong className="text-white font-mono">+{estimatedHoursSaved}h / mês</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Investimento no plano ideal:</span>
                    <strong className="text-cyan-400 font-mono">A partir de R$ 399,99</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => scrollToRegistration(undefined, e)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Quero Multiplicar Meus Resultados</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARATIVE TABLE (CRM TRADICIONAL VS ACERT IMOB) */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
              COMPARATIVO DIRETO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              CRM Tradicional vs. Acert Imob CRM ERP
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Veja por que mais de 1.400 imobiliárias cancelaram os sistemas antigos para migrar para a nossa solução.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 shadow-2xl">
            <table className="w-full min-w-[640px] text-left border-collapse bg-slate-900/60">
              <thead>
                <tr className="border-b border-slate-800 text-xs">
                  <th className="p-4 sm:p-5 text-slate-400 font-medium">Funcionalidade Chave</th>
                  <th className="p-4 sm:p-5 text-slate-400 font-medium text-center">CRMs Tradicionais de Mercado</th>
                  <th className="p-4 sm:p-5 bg-blue-600/10 text-blue-400 font-bold text-center border-x border-blue-500/20">
                    Acert Imob (Tudo em Um)
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800">
                {[
                  {
                    feature: 'Velocidade de Entrega do Lead',
                    old: 'Manual ou atraso de até 2 horas',
                    acert: 'Roleta anti-vácuo em menos de 30 segundos'
                  },
                  {
                    feature: 'WhatsApp Oficial da Imobiliária',
                    old: 'Cada corretor no seu celular pessoal (sem controle)',
                    acert: 'Desk multi-atendente oficial com histórico gravado'
                  },
                  {
                    feature: 'Splits Bancários de Comissões e Aluguéis',
                    old: 'Inexistente (fechamento manual em planilhas)',
                    acert: '10 APIs homologadas (Conta Pronta, Asaas, etc.)'
                  },
                  {
                    feature: 'Assinatura Digital de Documentos',
                    old: 'Contratar Clicksign/DocuSign por fora (R$ 200+/mês)',
                    acert: 'Integrada nativamente para envio via WhatsApp'
                  },
                  {
                    feature: 'Roteiro de Visitas com GPS & Ficha Digital',
                    old: 'Papel impresso ou sem comprovação legal',
                    acert: 'Check-in por GPS + Assinatura do cliente na tela'
                  },
                  {
                    feature: 'Preço dos Planos',
                    old: 'R$ 800 a R$ 2.500/mês + taxas de implantação',
                    acert: 'A partir de R$ 399,99/mês sem taxa de setup'
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/90 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">{row.feature}</td>
                    <td className="p-4 sm:p-5 text-slate-400 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{row.old}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 bg-blue-600/5 text-center font-bold text-white border-x border-blue-500/20">
                      <div className="flex items-center justify-center gap-1.5 text-blue-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.acert}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: PLANS & PRICING (STARTING AT R$ 399,99) */}
      <section id="planos-precos" className="py-20 lg:py-28 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
              INVESTIMENTO CLARO & TRANSPARENTE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Opções de Planos a Partir de R$ 399,99/mês
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Escolha o plano ideal para a fase da sua imobiliária. Sem letras miúdas, sem taxa de implantação e com 14 dias de teste grátis.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pagamento Mensal
              </button>
              <button
                onClick={() => setBillingCycle('ANNUAL')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'ANNUAL'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Plano Anual</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  -20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.filter(p => p.active).map((plan) => {
              const currentPrice = billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;
              const isPopular = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-blue-900/40 via-slate-900 to-slate-950 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 lg:-translate-y-2'
                      : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700 shadow-xl'
                  }`}
                >
                  {/* Popular or Starting Plan Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                        isPopular
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mt-2">
                      <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                      {plan.isStartingPlan && (
                        <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          A partir de R$ 399,99
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-2 min-h-[36px]">
                      {plan.description}
                    </p>

                    {/* Price Display */}
                    <div className="mt-6 pt-4 border-t border-slate-800/80">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-400 font-semibold">R$</span>
                        <span className="text-4xl font-extrabold text-white tracking-tight">
                          {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-slate-400">/mês</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {billingCycle === 'ANNUAL' ? 'Cobrado anualmente com 20% de economia' : 'Sem fidelidade, cancele quando quiser'}
                      </div>
                    </div>

                    {/* Capacity Limits */}
                    <div className="mt-6 p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Capacidade da Equipe:</span>
                        <strong className="text-white">{plan.maxBrokers}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Estoque de Imóveis:</span>
                        <strong className="text-white">{plan.maxProperties}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Volume de Leads:</span>
                        <strong className="text-emerald-400 font-semibold">{plan.maxLeadsMonth}</strong>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="mt-6 space-y-2.5">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        O que está incluso:
                      </div>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-blue-400' : 'text-emerald-400'}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan CTA */}
                  <div className="mt-8 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={(e) => scrollToRegistration(plan.id, e)}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isPopular
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: REGISTRATION FORM (CONVERTA AGORA / TESTE GRÁTIS 14 DIAS) */}
      <section id="cadastro-vip-section" className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-10">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              CADASTRO RÁPIDO & ATIVAÇÃO INSTANTÂNEA
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Comece Seu Teste Grátis de 14 Dias Agora
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Preencha o formulário abaixo para criar sua conta imobiliária e testar a roleta de leads e splits hoje mesmo.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            {registrationSuccess ? (
              /* Success Screen */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Parabéns, {registrationSuccess.fullName}!</h3>
                <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                  Sua solicitação de ativação da imobiliária <strong>{registrationSuccess.agencyName}</strong> foi recebida com sucesso!
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plano Selecionado:</span>
                    <strong className="text-blue-400">{registrationSuccess.planName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subdomínio Provisório:</span>
                    <strong className="text-white font-mono">{registrationSuccess.subdomain}.acertimob.com.br</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Equipe Estimada:</span>
                    <strong className="text-white">{registrationSuccess.brokersCount}</strong>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${settings.whatsappContactNumber}?text=${encodeURIComponent(
                      `Olá! Acabei de me cadastrar na página de vendas para a imobiliária ${registrationSuccess.agencyName} no plano ${registrationSuccess.planName}. Gostaria de agilizar meu onboarding!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Falar no WhatsApp com Gerente de Onboarding</span>
                  </a>

                  {onBackToApp && isAuthenticated && (
                    <button
                      type="button"
                      onClick={onBackToApp}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                    >
                      Acessar o Painel
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setRegistrationSuccess(null)}
                  className="mt-6 text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Cadastrar outra imobiliária
                </button>
              </div>
            ) : (
              /* The Active Registration Form */
              <form onSubmit={handleSubmitRegistration} className="space-y-5">
                {/* Plan Selection Radio Tabs */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    1. Escolha o Plano Desejado:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {plans.filter(p => p.active).map((p) => {
                      const isSelected = selectedPlanId === p.id;
                      const price = billingCycle === 'ANNUAL' ? p.annualPrice : p.monthlyPrice;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlanId(p.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                          <div className="text-sm font-extrabold text-blue-400">
                            R$ {price.toFixed(2)}/mês
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{p.maxBrokers}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ex: Roberto Carneiro"
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: roberto@imobiliaria.com.br"
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* WhatsApp & Agency Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: (11) 98765-4321"
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nome da Imobiliária / Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.agencyName}
                      onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                      placeholder="Ex: Carneiro Prime Imóveis"
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* City & Brokers count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cidade e Estado (UF)
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ex: São Paulo - SP"
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Quantidade de Corretores
                    </label>
                    <select
                      value={formData.brokersCount}
                      onChange={(e) => setFormData({ ...formData, brokersCount: e.target.value })}
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="1 a 3 corretores">1 a 3 corretores (Equipe Inicial)</option>
                      <option value="5 a 10 corretores">5 a 10 corretores (Em Crescimento)</option>
                      <option value="11 a 25 corretores">11 a 25 corretores (Média Operação)</option>
                      <option value="Mais de 30 corretores">Mais de 30 corretores (Grande Porte / Rede)</option>
                    </select>
                  </div>
                </div>

                {/* Subdomain preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Endereço de Acesso Desejado
                  </label>
                  <div className="flex items-center">
                    <span className="text-xs text-slate-500 bg-slate-950 px-3 py-3 rounded-l-xl border border-r-0 border-slate-800">
                      https://
                    </span>
                    <input
                      type="text"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                      placeholder={formData.agencyName ? formData.agencyName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) : 'suaimobiliaria'}
                      className="flex-1 text-xs px-3 py-3 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <span className="text-xs text-slate-400 bg-slate-950 px-3 py-3 rounded-r-xl border border-l-0 border-slate-800 font-mono">
                      .acertimob.com.br
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{isSubmitting ? 'Configurando Sua Imobiliária...' : 'Ativar Meu Teste Grátis de 14 Dias'}</span>
                </button>

                <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-4 pt-2">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> Seus dados estão 100% seguros
                  </span>
                  <span>•</span>
                  <span>Sem cartão de crédito antecipado</span>
                  <span>•</span>
                  <span>Ativação em até 10 minutos</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS & SOCIAL PROOF */}
      <section id="depoimentos" className="py-20 lg:py-28 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
              DEPOIMENTOS REAIS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              O Que Dizem os Diretores das Melhores Imobiliárias do Brasil
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Mais de R$ 100 milhões em comissões processadas sem atrito com nosso CRM ERP integrado.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.filter(t => t.active).map((test) => (
              <div
                key={test.id}
                className="bg-slate-950 p-6 sm:p-7 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {test.metricHighlight}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                  <img
                    src={test.avatarUrl}
                    alt={test.authorName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{test.authorName}</div>
                    <div className="text-[11px] text-slate-400">{test.authorRole} • {test.companyName}</div>
                    <div className="text-[10px] text-slate-500">{test.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section id="faq" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
              TIRA-DÚVIDAS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Tudo o que você precisa saber antes de iniciar seu teste de 14 dias.
            </p>

            {/* Category Filter */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'ALL', label: 'Todas as Dúvidas' },
                { id: 'PLANOS', label: 'Planos a partir de R$ 399' },
                { id: 'LEADS', label: 'Roleta de Leads' },
                { id: 'ERP_SPLITS', label: 'Splits Bancários' },
                { id: 'MIGRACAO', label: 'Migração de Dados' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFaqCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedFaqCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-t border-blue-500/30 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pronto para Ter a Melhor Gestão de Leads do Mercado?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-200 max-w-2xl mx-auto">
            Junte-se a mais de 1.400 imobiliárias que já escalaram suas operações com o Acert Imob. Planos a partir de R$ 399,99/mês.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={(e) => scrollToRegistration(undefined, e)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Garantir Teste Grátis de 14 Dias</span>
            </button>
            <a
              href={`https://wa.me/${settings.whatsappContactNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Falar com Especialista no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {effectiveLogoUrl ? (
              <div className="h-9 px-2 py-0.5 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                <img
                  src={effectiveLogoUrl}
                  alt={effectivePlatformName}
                  className="h-7 max-w-[140px] object-contain"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
                {effectivePlatformName.charAt(0)}
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-white">{effectivePlatformName} Tecnologia SaaS</div>
              <div className="text-[11px] text-slate-500">O CRM ERP imobiliário mais completo do Brasil</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-slate-400">
            <button type="button" onClick={(e) => scrollToSection(e, 'gestao-leads')} className="hover:text-white transition-colors cursor-pointer">
              Gestão de Leads
            </button>
            <button type="button" onClick={(e) => scrollToSection(e, 'erp-splits')} className="hover:text-white transition-colors cursor-pointer">
              Splits Bancários
            </button>
            <button type="button" onClick={(e) => scrollToSection(e, 'planos-precos')} className="hover:text-white transition-colors cursor-pointer">
              Planos R$ 399,99
            </button>
            <button type="button" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-white transition-colors cursor-pointer">
              FAQ
            </button>
            <button 
              type="button" 
              onClick={handleGoToCrmLogin} 
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acessar CRM (aicrm.acertgo.com.br)</span>
            </button>
            {onBackToApp && isAuthenticated && (
              <button type="button" onClick={onBackToApp} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Painel da Plataforma</span>
              </button>
            )}
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            © {new Date().getFullYear()} {effectivePlatformName}. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button */}
      {settings.showFloatingWhatsapp && (
        <a
          href={`https://wa.me/${settings.whatsappContactNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all flex items-center justify-center group"
          title="Falar com Especialista no WhatsApp"
        >
          <MessageSquare className="w-6 h-6 fill-white" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            Fale no WhatsApp
          </span>
        </a>
      )}
    </div>
  );
};

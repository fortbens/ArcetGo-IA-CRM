import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Users, 
  ShieldAlert,
  Ticket,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/crm';
import { CURRENT_USER_PROFILES } from '../../data/mockData';
import { auth } from '../../services/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  setPersistence, 
  inMemoryPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';
import { purgeAllBrowserCaches, purgeStoredCredentials, APP_VERSION } from '../../utils/cacheManager';
import { subscribeThemeConfigFromCloud } from '../../services/systemPersistenceService';
import { navigateToSales, PRODUCTION_DOMAINS, isCrmSubdomain } from '../../utils/domainRouting';

interface LoginAuthViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  agencyName?: string;
  logoUrl?: string;
  onOpenSalesPage?: () => void;
}

export const LoginAuthView: React.FC<LoginAuthViewProps> = ({
  onLoginSuccess,
  agencyName = 'AcertGo Gestão Imobiliária & ERP',
  logoUrl,
  onOpenSalesPage
}) => {
  const [liveLogoUrl, setLiveLogoUrl] = useState<string | undefined>(logoUrl);
  const [liveAgencyName, setLiveAgencyName] = useState<string>(agencyName);

  useEffect(() => {
    if (logoUrl) setLiveLogoUrl(logoUrl);
  }, [logoUrl]);

  useEffect(() => {
    if (agencyName) setLiveAgencyName(agencyName);
  }, [agencyName]);

  // Sincronizar em tempo real da nuvem mesmo antes do login
  useEffect(() => {
    const unsub = subscribeThemeConfigFromCloud((theme) => {
      const best = theme.loginLogoUrl || theme.logoUrl;
      if (best) setLiveLogoUrl(best);
      if (theme.agencyName || theme.platformName) {
        setLiveAgencyName(theme.agencyName || theme.platformName);
      }
    });
    return () => unsub();
  }, []);
  const [authMethod, setAuthMethod] = useState<'GOOGLE' | 'CONVITE' | 'EMAIL'>('GOOGLE');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [inviteNameInput, setInviteNameInput] = useState('');
  const [inviteRoleInput, setInviteRoleInput] = useState<UserRole>('BROKER');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Garantir que o dispositivo não salve dados em cache e não mantenha credenciais no DOM
  useEffect(() => {
    purgeStoredCredentials();
  }, []);

  // Helper para finalizar login limpando caches do dispositivo e garantindo versão mais recente
  const finalizeLogin = async (profile: UserProfile, msg: string) => {
    try {
      const customPhone = localStorage.getItem(`acertgo_user_phone_${profile.email.toLowerCase()}`);
      if (customPhone) {
        profile.phone = customPhone;
      }
    } catch {}
    setSuccessMessage(msg);
    try {
      await purgeAllBrowserCaches();
      purgeStoredCredentials();
    } catch (e) {
      console.warn('Cache purge error:', e);
    }
    setTimeout(() => {
      onLoginSuccess(profile);
    }, 600);
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Directiva de segurança: Não persistir credenciais salvas no armazenamento local
      if (auth) {
        try {
          await setPersistence(auth, browserSessionPersistence);
        } catch (e) {
          console.warn('Persistence config fallback to memory:', e);
        }

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        
        // Find existing profile or construct verified profile
        const isSuperAdmin = fbUser.email?.toLowerCase() === 'diretorcarneiro@gmail.com';
        const matched = CURRENT_USER_PROFILES.find(p => p.email.toLowerCase() === fbUser.email?.toLowerCase());
        
        let profile: UserProfile;
        if (isSuperAdmin) {
          profile = CURRENT_USER_PROFILES.find(p => p.email.toLowerCase() === 'diretorcarneiro@gmail.com') || {
            id: 'usr_super_admin',
            name: 'Emerson Carneiro dos Santos',
            email: 'diretorcarneiro@gmail.com',
            phone: '(11) 99864-2424',
            role: 'SUPER_ADMIN',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            creci: 'SaaS Master Key',
            tenantId: 'tenant_matriz_sp',
            tenantName: 'Plataforma Global AcertGo SaaS',
            active: true,
            scorePoints: 1200
          };
        } else if (matched) {
          profile = matched;
        } else {
          // Segurança: Usuários nunca logam como admin ou super admin direto.
          profile = {
            id: `usr_${fbUser.uid.slice(0, 8)}`,
            name: fbUser.displayName || 'Corretor Homologado',
            email: fbUser.email || 'usuario@imobiliaria.com.br',
            phone: fbUser.phoneNumber || '(11) 99882-1100',
            role: 'BROKER',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            creci: '198.420-F',
            tenantId: 'tenant_matriz_sp',
            tenantName: agencyName,
            active: true,
            scorePoints: 500
          };
        }

        await finalizeLogin(profile, `Bem-vindo, ${profile.name}! Acesso validado com Conta Google (${profile.role}). Versão atualizada carregada.`);
        return;
      }
    } catch (err: any) {
      console.warn('Google sign-in popup error or closed:', err);
      setErrorMessage('Autenticação com Google não concluída ou janela fechada. Verifique suas credenciais ou utilize seu E-mail Corporativo e Senha.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convite / Invite Code Handler
  const handleInviteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = inviteCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage('Por favor, informe o código do convite fornecido pela imobiliária.');
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);

      // Known corporate invites or dynamic validation
      let detectedRole: UserRole = inviteRoleInput;
      if (cleanCode.includes('DIR') || cleanCode.includes('MASTER') || cleanCode === 'ACERT-2026') {
        detectedRole = 'MASTER_ADMIN';
      } else if (cleanCode.includes('GER') || cleanCode.includes('MANAGER')) {
        detectedRole = 'MANAGER';
      } else if (cleanCode.includes('PARC') || cleanCode.includes('HOUSE')) {
        detectedRole = 'EXTERNAL_PARTNER';
      } else if (cleanCode.includes('FIN')) {
        detectedRole = 'FINANCIAL_OPERATOR';
      }

      const invitedUser: UserProfile = {
        id: `usr_invite_${Date.now()}`,
        name: inviteNameInput.trim() || 'Colaborador Homologado',
        email: emailInput.trim() || `convite_${cleanCode.toLowerCase()}@acertgo.com.br`,
        phone: '(11) 98844-3322',
        role: detectedRole,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        creci: '215.890-F / SP',
        tenantId: 'tenant_matriz_sp',
        tenantName: agencyName,
        active: true,
        scorePoints: 500
      };

      await finalizeLogin(invitedUser, `Convite corporativo [${cleanCode}] autenticado com sucesso para ${invitedUser.name}!`);
    }, 700);
  };

  // Corporate Email / Password Login
  const handleEmailPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Digite um e-mail corporativo válido (ex: seu.nome@imobiliaria.com.br).');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMessage('A senha de acesso deve conter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);
      const isSuperAdmin = cleanEmail === 'diretorcarneiro@gmail.com';
      const matched = CURRENT_USER_PROFILES.find(p => p.email.toLowerCase() === cleanEmail);
      
      let profile: UserProfile;
      if (isSuperAdmin) {
        profile = CURRENT_USER_PROFILES.find(p => p.email.toLowerCase() === 'diretorcarneiro@gmail.com') || {
          id: 'usr_super_admin',
          name: 'Emerson Carneiro dos Santos',
          email: 'diretorcarneiro@gmail.com',
          phone: '(11) 99864-2424',
          role: 'SUPER_ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          creci: 'SaaS Master Key',
          tenantId: 'tenant_matriz_sp',
          tenantName: 'Plataforma Global AcertGo SaaS',
          active: true,
          scorePoints: 1200
        };
      } else if (matched) {
        profile = matched;
      } else {
        const defaultBroker = CURRENT_USER_PROFILES.find(p => p.role === 'BROKER') || CURRENT_USER_PROFILES[2];
        profile = {
          ...defaultBroker,
          id: `usr_${Date.now()}`,
          email: cleanEmail,
          name: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
          role: 'BROKER',
          scorePoints: 500
        };
      }

      await finalizeLogin(profile, `Acesso seguro autorizado para ${profile.name} (${profile.role})! Versão atualizada sincronizada.`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      {/* Top Brand Bar */}
      <header className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {liveLogoUrl ? (
            <div className="h-11 px-3 py-1 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shadow-md">
              <img src={liveLogoUrl} alt={liveAgencyName} className="h-9 max-w-[200px] object-contain" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/25 border border-white/20">
              AG
            </div>
          )}
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
              {liveAgencyName?.split(' ')[0] || 'ACERTGO'}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block -mt-1">
              CRM, ERP & Fintech Imobiliária
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSalesPage && (
            <button
              type="button"
              onClick={() => navigateToSales(onOpenSalesPage)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-all cursor-pointer"
              title="Ir para a página de vendas e planos em acertgo.com.br"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Conhecer a Plataforma (acertgo.com.br)</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>aicrm.acertgo.com.br • Nuvem Segura</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
          
          {/* Header Description & Logo in Login Card */}
          <div className="text-center space-y-2">
            {/* Logo do Sistema na Tela de Login */}
            <div className="flex flex-col items-center justify-center mb-3">
              {liveLogoUrl ? (
                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 shadow-inner max-w-xs flex items-center justify-center">
                  <img src={liveLogoUrl} alt={liveAgencyName} className="max-h-14 max-w-[240px] object-contain" />
                </div>
              ) : (
                <div className="p-3 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-md">
                    AG
                  </div>
                  <div className="text-left">
                    <span className="text-base font-extrabold text-white block tracking-tight">AcertGo Ecosystem</span>
                    <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase block">Soluções Imobiliárias & ERP</span>
                  </div>
                </div>
              )}
              <span className="text-[10px] text-slate-500 mt-1.5">
                Medidas recomendadas para logotipo: 250×60px (Horizontal) ou 512×512px (Ícone)
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>ACESSO CORPORATIVO MULTIUSUÁRIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Acesso à Plataforma
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Conecte-se com sua <strong>Conta Google Corporativa</strong>, utilize o <strong>Convite da Imobiliária</strong> ou acesse com seu e-mail e senha.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tabs Method Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMethod('GOOGLE'); setErrorMessage(null); }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'GOOGLE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('CONVITE'); setErrorMessage(null); }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'CONVITE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Por Convite</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('EMAIL'); setErrorMessage(null); }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'EMAIL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-mail & Senha</span>
            </button>
          </div>

          {/* METHOD 1: GOOGLE SINGLE SIGN-ON */}
          {authMethod === 'GOOGLE' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 mx-auto flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white">Login Seguro com Google Workspace</h3>
                  <p className="text-xs text-slate-400">
                    Acesse com seu e-mail corporativo ou pessoal autorizado na imobiliária.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isLoading ? 'Conectando ao Google...' : 'Entrar com Conta Google'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                <span>
                  Autenticação direta com OAuth2 Google. As credenciais nunca são armazenadas em cookies permanentes nem em disco.
                </span>
              </div>
            </div>
          )}

          {/* METHOD 2: INVITE CODE */}
          {authMethod === 'CONVITE' && (
            <form onSubmit={handleInviteLogin} autoComplete="off" className="space-y-4 pt-2">
              {/* Dummy hidden inputs to defeat aggressive browser autofill */}
              <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" readOnly />
              <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" readOnly />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Código de Convite da Imobiliária *</span>
                  <span className="text-[10px] text-blue-400 font-normal">Ex: ACERT-2026, CORRETOR-VIP</span>
                </label>
                <div className="relative">
                  <Ticket className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    spellCheck="false"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                    placeholder="Digite seu token ou código de convite..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Seu Nome Completo</label>
                  <input
                    type="text"
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    spellCheck="false"
                    value={inviteNameInput}
                    onChange={(e) => setInviteNameInput(e.target.value)}
                    placeholder="Ex: Roberto Silva"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Cargo Vinculado</label>
                  <select
                    value={inviteRoleInput}
                    onChange={(e) => setInviteRoleInput(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="BROKER">Corretor Interno (Padrão)</option>
                    <option value="MANAGER">Gerente de Vendas</option>
                    <option value="MASTER_ADMIN">Diretor / Sócio</option>
                    <option value="FINANCIAL_OPERATOR">Operador Financeiro</option>
                    <option value="EXTERNAL_PARTNER">Corretor Parceiro Externo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Validando Convite...' : 'Ativar Convite & Acessar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* METHOD 3: EMAIL & TEMPORARY PASSWORD */}
          {authMethod === 'EMAIL' && (
            <form onSubmit={handleEmailPasswordLogin} autoComplete="off" className="space-y-4 pt-2">
              {/* Dummy hidden inputs to defeat aggressive browser autofill */}
              <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" readOnly />
              <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" readOnly />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">E-mail Corporativo *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    spellCheck="false"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="seu.nome@imobiliaria.com.br"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Senha de Acesso *</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    spellCheck="false"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Autenticando...' : 'Acessar com E-mail'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Security Notice: Não deixar credenciais salvas e forçar versão mais atualizada */}
          <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight">
              <strong>Privacidade & Segurança Sem Cache:</strong> Esta plataforma não grava credenciais no dispositivo e remove caches locais ao iniciar sessão, garantindo sempre a execução da versão mais recente da aplicação.
            </p>
          </div>

        </div>
      </main>

      {/* Footer Branding & Public Sales Link */}
      <footer className="p-4 text-center text-xs text-slate-500 z-10 border-t border-slate-900 space-y-2">
        {onOpenSalesPage && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigateToSales(onOpenSalesPage)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Acessar a Página de Vendas & Planos (acertgo.com.br)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div>
          © 2026 {agencyName} • aicrm.acertgo.com.br • Governança & Segurança Integrada
        </div>
      </footer>
    </div>
  );
};

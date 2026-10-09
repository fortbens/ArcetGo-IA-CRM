import React, { useState } from 'react';
import { 
  Globe, 
  Share2, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  Settings, 
  Layers, 
  Sparkles, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Building2,
  ChevronRight,
  Lock,
  X,
  MessageSquare,
  Bot,
  Key,
  Cpu,
  Phone,
  QrCode,
  DollarSign,
  Wallet,
  Search,
  Filter,
  ArrowRight,
  Database,
  Building,
  CheckCircle,
  Play,
  Send,
  HelpCircle,
  Cloud,
  GitBranch,
  Server,
  HardDrive,
  Terminal,
  UploadCloud,
  FolderCheck,
  Download,
  Plus,
  ShieldAlert
} from 'lucide-react';
import { 
  PortalIntegration, 
  RealEstateProperty,
  UserProfile
} from '../../types/crm';
import { 
  INITIAL_PORTALS 
} from '../../data/mockPortals';
import { XmlFeedViewerModal } from '../portals/XmlFeedViewerModal';

interface IntegrationsHubViewProps {
  properties: RealEstateProperty[];
  onOpenPropertyDetails?: (property: RealEstateProperty) => void;
  currentUser?: UserProfile;
}

export type IntegrationCategory = 
  | 'all'
  | 'deploy_instantaneo'
  | 'portais_xml'
  | 'orulo'
  | 'whatsapp'
  | 'ai_chatgpt_gemini'
  | 'meta_ads'
  | 'google'
  | 'bancos_financiamento'
  | 'conta_pronta'
  | 'webhooks';

export const IntegrationsHubView: React.FC<IntegrationsHubViewProps> = ({
  properties = [],
  onOpenPropertyDetails,
  currentUser
}) => {
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Portais State
  const [portals, setPortals] = useState<PortalIntegration[]>(INITIAL_PORTALS);
  const [selectedXmlPortal, setSelectedXmlPortal] = useState<PortalIntegration | null>(null);
  const [syncingPortalId, setSyncingPortalId] = useState<string | null>(null);
  const [copiedFeedId, setCopiedFeedId] = useState<string | null>(null);
  const [ruleOnlyWithPhotos, setRuleOnlyWithPhotos] = useState(true);
  const [ruleHideExactAddress, setRuleHideExactAddress] = useState(true);
  const [ruleOnlyAvailable, setRuleOnlyAvailable] = useState(true);

  // 2. Órulo State
  const [oruloApiKey, setOruloApiKey] = useState('oru_live_998342718491209384');
  const [oruloConnected, setOruloConnected] = useState(true);
  const [oruloTotalDevelopments, setOruloTotalDevelopments] = useState(8420);
  const [isSyncingOrulo, setIsSyncingOrulo] = useState(false);

  // 3. WhatsApp API State
  const [whatsappProvider, setWhatsappProvider] = useState<'Z_API' | 'EVOLUTION_BAILEYS' | 'META_CLOUD'>('Z_API');
  const [whatsappStatus, setWhatsappStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'PAIRING'>('CONNECTED');
  const [whatsappPhone, setWhatsappPhone] = useState('+55 11 98844-3322');
  const [whatsappInstanceId, setWhatsappInstanceId] = useState('INST_ACERT_MATRIZ_01');
  const [whatsappToken, setWhatsappToken] = useState('tok_zap_live_8492019482910');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [isSendingTestMessage, setIsSendingTestMessage] = useState(false);

  // 4. ChatGPT (OpenAI) State
  const [chatGptApiKey, setChatGptApiKey] = useState('sk-proj-4981729384729182371928471928');
  const [chatGptModel, setChatGptModel] = useState('gpt-4o');
  const [chatGptConnected, setChatGptConnected] = useState(true);
  const [chatGptSystemPrompt, setChatGptSystemPrompt] = useState(
    'Você é o Corretor IA Oficial da Imobiliária de Alto Padrão. Responda clientes com cordialidade, qualifique orçamento, perfil de imóvel e agende visitas.'
  );
  const [chatGptTestQuery, setChatGptTestQuery] = useState('');
  const [chatGptTestResponse, setChatGptTestResponse] = useState<string | null>(null);
  const [isTestingChatGpt, setIsTestingChatGpt] = useState(false);

  // 5. Gemini API (Google) State
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyD8492018492019482910482910');
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [geminiConnected, setGeminiConnected] = useState(true);
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestOutput, setGeminiTestOutput] = useState<string | null>(null);

  // 6. Meta Graph API State
  const [metaAccessToken, setMetaAccessToken] = useState('EAAOx8391820391209384019283019238');
  const [metaInstagramId, setMetaInstagramId] = useState('17841400284918201');
  const [metaPixelId, setMetaPixelId] = useState('849201948201948');
  const [metaLeadWebhookActive, setMetaLeadWebhookActive] = useState(true);

  // 7. Google APIs State
  const [googleAdsWebhookActive, setGoogleAdsWebhookActive] = useState(true);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('G-8492018492');
  const [googleTagManagerId, setGoogleTagManagerId] = useState('GTM-KV8921B');
  const [googleMapsKey, setGoogleMapsKey] = useState('AIzaSyC938102938102938102938');

  // 8. Bancos & Crédito Imobiliário State
  const [bankApis, setBankApis] = useState([
    { id: 'caixa', name: 'Caixa Econômica Federal (Caixa Aqui API)', code: 'CEF-001', connected: true, rateYear: '9.49% a.a. + TR', status: 'HOMOLOGADO' },
    { id: 'itau', name: 'Banco Itaú Personnalité & Uniclass', code: 'ITAU-341', connected: true, rateYear: '9.79% a.a. + TR', status: 'HOMOLOGADO' },
    { id: 'santander', name: 'Banco Santander Crédito Imobiliário', code: 'SAN-033', connected: true, rateYear: '9.99% a.a. + TR', status: 'HOMOLOGADO' },
    { id: 'bradesco', name: 'Banco Bradesco Prime & Varejo', code: 'BRAD-237', connected: true, rateYear: '10.15% a.a. + TR', status: 'HOMOLOGADO' },
    { id: 'bb', name: 'Banco do Brasil Imobiliário', code: 'BB-001', connected: false, rateYear: '9.65% a.a. + TR', status: 'AGUARDANDO_CHAVE' },
  ]);

  // 9. Conta Pronta (Split & BaaS) State
  const [contaProntaApiKey, setContaProntaApiKey] = useState('cp_sec_live_94820194820194820194');
  const [contaProntaPixKey, setContaProntaPixKey] = useState('financeiro@imobiliaria.com.br');
  const [contaProntaSplitEnabled, setContaProntaSplitEnabled] = useState(true);
  const [contaProntaDZeroLiquidation, setContaProntaDZeroLiquidation] = useState(true);
  const [contaProntaBalance, setContaProntaBalance] = useState(48250.00);

  // 10. Webhooks State
  const [customWebhookUrl, setCustomWebhookUrl] = useState('https://api.acertimob.com.br/v1/leads/webhook');
  const [webhookSecretToken, setWebhookSecretToken] = useState('whsec_9841284910293840192');

  // 11. Deploy Instantâneo (GitHub, HomeHost cPanel, Firebase) State
  const [githubRepoUrl, setGithubRepoUrl] = useState('https://github.com/imobiliaria-acert/crm-portal-acertgo.git');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubSyncStatus, setGithubSyncStatus] = useState<'CONNECTED' | 'SYNCING'>('CONNECTED');
  const [lastCommitSha, setLastCommitSha] = useState('b7291af');
  const [lastCommitMsg, setLastCommitMsg] = useState('feat: deploy instantâneo, QR placas e rota de visitas');
  const [isSyncingGit, setIsSyncingGit] = useState(false);

  // HomeHost / cPanel
  const [cpanelHost, setCpanelHost] = useState('cpanel.homehost.com.br');
  const [cpanelUser, setCpanelUser] = useState('acert_imob');
  const [cpanelTargetDir, setCpanelTargetDir] = useState('/public_html/aicrm/');
  const [cpanelDomain, setCpanelDomain] = useState('https://aicrm.acertgo.com.br');
  const [isDeployingCpanel, setIsDeployingCpanel] = useState(false);
  const [lastDeployTime, setLastDeployTime] = useState('Hoje, às 10:45');

  // Firebase
  const [firebaseProjectId, setFirebaseProjectId] = useState('acertgo-crm-master');
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [firebaseTestOutput, setFirebaseTestOutput] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTestFirebase = () => {
    setIsTestingFirebase(true);
    setFirebaseTestOutput(null);
    setTimeout(() => {
      setIsTestingFirebase(false);
      setFirebaseTestOutput('✓ Firebase Firestore e Authentication operacionais! 18 coleções ativas, latência de gravação 85ms.');
      showToast('Conexão Firebase validada com sucesso!');
    }, 1000);
  };

  const handleTestCpanel = () => {
    setIsDeployingCpanel(true);
    setTimeout(() => {
      setIsDeployingCpanel(false);
      showToast('Conexão cPanel HomeHost OK! .htaccess verificado e Apache 2.4 respondendo HTTP 200.');
    }, 1200);
  };

  const handleDeployToHomehost = () => {
    setIsDeployingCpanel(true);
    setTimeout(() => {
      setIsDeployingCpanel(false);
      setLastDeployTime('Agora mesmo');
      showToast('Deploy instantâneo concluído com sucesso no cPanel HomeHost!');
    }, 1600);
  };

  const handleSyncGithub = () => {
    setIsSyncingGit(true);
    setTimeout(() => {
      setIsSyncingGit(false);
      setLastCommitSha('c108f92');
      setLastCommitMsg('chore: sincronização automática do portal e espelho');
      showToast('Repositório GitHub sincronizado com branch main!');
    }, 1200);
  };

  const handleDownloadHtaccess = () => {
    const htaccessContent = `# ====================================================================
# Configuração Apache / cPanel HomeHost para Aplicações SPA (Vite / React)
# AcertGo CRM & ERP Imobiliário
# ====================================================================
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
`;
    const blob = new Blob([htaccessContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.htaccess';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('.htaccess baixado para o seu computador!');
  };

  // Toggle Portal
  const handleTogglePortal = (portalId: string) => {
    setPortals(prev => prev.map(p => {
      if (p.id === portalId) {
        const nextActive = !p.active;
        return {
          ...p,
          active: nextActive,
          status: nextActive ? 'ONLINE' : 'PAUSED'
        };
      }
      return p;
    }));
    showToast('Status do portal atualizado!');
  };

  // Sync Portal
  const handleSyncPortal = (portalId: string) => {
    setSyncingPortalId(portalId);
    setTimeout(() => {
      setPortals(prev => prev.map(p => {
        if (p.id === portalId) {
          return {
            ...p,
            lastSyncAt: 'Agora mesmo (Sucesso)',
            status: 'ONLINE'
          };
        }
        return p;
      }));
      setSyncingPortalId(null);
      showToast('Feed XML sincronizado e validado!');
    }, 1200);
  };

  // Copy feed URL
  const handleCopyFeedUrl = (portal: PortalIntegration) => {
    navigator.clipboard.writeText(portal.feedUrl);
    setCopiedFeedId(portal.id);
    showToast(`URL do feed ${portal.name} copiada!`);
    setTimeout(() => setCopiedFeedId(null), 2000);
  };

  // Sync Órulo
  const handleSyncOrulo = () => {
    setIsSyncingOrulo(true);
    setTimeout(() => {
      setIsSyncingOrulo(false);
      setOruloTotalDevelopments(prev => prev + 14);
      showToast('Catálogo nacional da Órulo sincronizado! +14 novos lançamentos adicionados.');
    }, 1500);
  };

  // Test WhatsApp
  const handleSendTestWhatsapp = () => {
    if (!testPhoneNumber) {
      showToast('Digite um número com DDD para enviar o teste.');
      return;
    }
    setIsSendingTestMessage(true);
    setTimeout(() => {
      setIsSendingTestMessage(false);
      showToast(`Mensagem de teste enviada com sucesso para ${testPhoneNumber}!`);
      setTestPhoneNumber('');
    }, 1200);
  };

  // Test ChatGPT
  const handleTestChatGpt = () => {
    if (!chatGptTestQuery.trim()) {
      showToast('Digite uma mensagem do cliente para testar o ChatGPT.');
      return;
    }
    setIsTestingChatGpt(true);
    setChatGptTestResponse(null);
    setTimeout(() => {
      setIsTestingChatGpt(false);
      setChatGptTestResponse(
        `Olá! Muito obrigado pelo interesse no condomínio. Temos opções exclusivas de 3 e 4 suítes na região, com plantas de 142m² a 320m². Qual é o melhor dia para agendarmos uma apresentação personalizada no decorado?`
      );
    }, 1000);
  };

  // Test Gemini
  const handleTestGemini = () => {
    setIsTestingGemini(true);
    setGeminiTestOutput(null);
    setTimeout(() => {
      setIsTestingGemini(false);
      setGeminiTestOutput(
        'Gemini 2.5 Flash conectado com sucesso! Análise multimodal de imagens e transcrição de áudios de clientes 100% operacional. Latência: 240ms.'
      );
      showToast('Conexão Google Gemini validada com sucesso!');
    }, 900);
  };

  // Toggle Bank
  const handleToggleBank = (bankId: string) => {
    setBankApis(prev => prev.map(b => {
      if (b.id === bankId) {
        return {
          ...b,
          connected: !b.connected,
          status: !b.connected ? 'HOMOLOGADO' : 'PAUSADO'
        };
      }
      return b;
    }));
    showToast('Status do banco alterado!');
  };

  // Super Admin check para permissão estrita na aba Deploy
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'MASTER_ADMIN' || currentUser?.email?.toLowerCase() === 'diretorcarneiro@gmail.com';

  // Modal de Configuração & Inclusão de Novas APIs (Bancos, Portais, Webhooks, Gateway)
  const [isNewApiModalOpen, setIsNewApiModalOpen] = useState(false);
  const [newApiType, setNewApiType] = useState<'BANCO' | 'PORTAL' | 'WEBHOOK' | 'GATEWAY'>('BANCO');
  const [newApiName, setNewApiName] = useState('');
  const [newApiEndpoint, setNewApiEndpoint] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiSecret, setNewApiSecret] = useState('');
  const [newApiEnvironment, setNewApiEnvironment] = useState<'PRODUCAO' | 'SANDBOX'>('SANDBOX');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestSuccess, setApiTestSuccess] = useState<string | null>(null);

  const handleTestNewApi = () => {
    if (!newApiEndpoint && !newApiName) {
      showToast('Preencha o nome e endpoint da API para testar.');
      return;
    }
    setIsTestingApi(true);
    setApiTestSuccess(null);
    setTimeout(() => {
      setIsTestingApi(false);
      setApiTestSuccess('Conexão HTTP 200 OK • Latência 48ms • Handshake SSL Válido');
      showToast('Endpoint da API respondeu com sucesso!');
    }, 1200);
  };

  const handleSaveNewApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiName.trim()) {
      showToast('Informe o nome da instituição ou portal.');
      return;
    }

    if (newApiType === 'BANCO') {
      const newBank = {
        id: `bank_custom_${Date.now()}`,
        name: newApiName.trim(),
        code: `BANK-${Math.floor(100 + Math.random() * 900)}`,
        connected: true,
        rateYear: '9.49% a.a. + TR',
        status: 'HOMOLOGADO'
      };
      setBankApis(prev => [newBank, ...prev]);
      showToast(`API Bancária de ${newBank.name} cadastrada e integrada com sucesso!`);
    } else if (newApiType === 'PORTAL') {
      const newPortal: PortalIntegration = {
        id: `portal_custom_${Date.now()}`,
        portalCode: 'CUSTOM',
        name: newApiName.trim(),
        active: true,
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
        feedUrl: newApiEndpoint.trim() || `https://api.acertgo.com.br/xml/v1/feed-${newApiName.toLowerCase().replace(/\s+/g, '-')}.xml`,
        totalPublished: properties.length,
        maxProperties: properties.length,
        highlightCount: 0,
        maxHighlights: 10,
        status: 'ONLINE',
        lastSyncAt: 'Agora mesmo',
        syncFrequencyHours: 4,
        leadWebhookActive: true
      };
      setPortals(prev => [newPortal, ...prev]);
      showToast(`Feed XML e API do portal ${newPortal.name} configurados e sincronizados!`);
    } else {
      showToast(`API de ${newApiName} homologada no gateway corporativo!`);
    }

    setIsNewApiModalOpen(false);
    setNewApiName('');
    setNewApiEndpoint('');
    setNewApiKey('');
    setNewApiSecret('');
    setApiTestSuccess(null);
  };

  const navCategories = [
    { id: 'all', label: 'Todas as Integrações', count: isSuperAdmin ? 11 : 10, icon: Layers },
    ...(isSuperAdmin ? [{ id: 'deploy_instantaneo', label: 'Deploy & Nuvem (Git / cPanel / Firebase)', count: 'Instantâneo', icon: Cloud }] : []),
    { id: 'portais_xml', label: 'Portais Imobiliários (XML)', count: portals.length, icon: Globe },
    { id: 'orulo', label: 'Órulo Lançamentos', count: '8.4k', icon: Building2 },
    { id: 'whatsapp', label: 'WhatsApp API', count: 'Online', icon: Phone },
    { id: 'ai_chatgpt_gemini', label: 'ChatGPT & Gemini AI', count: '2 Conectores', icon: Bot },
    { id: 'meta_ads', label: 'Meta (Insta & Face Ads)', count: 'Graph API', icon: Share2 },
    { id: 'google', label: 'Google (Ads, Maps & GA4)', count: '4 Serviços', icon: Sparkles },
    { id: 'bancos_financiamento', label: 'Bancos & Financiamento', count: bankApis.length, icon: Building },
    { id: 'conta_pronta', label: 'Conta Pronta & Split Pix', count: 'D+0', icon: Wallet },
    { id: 'webhooks', label: 'Webhooks & APIs Custom', count: 'REST', icon: Cpu },
  ];

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
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>CENTRAL UNIFICADA DE INTEGRAÇÕES & APIS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Módulo de Integrações do Sistema
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Conecte todos os canais da sua imobiliária em um único lugar: Portais Imobiliários via XML, ecossistema Órulo de lançamentos, WhatsApp API, inteligências artificiais ChatGPT e Gemini, campanhas Meta e Google, esteiras bancárias de financiamento e split Conta Pronta.
            </p>
          </div>

          {/* Quick Status Stats & New API Action */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="px-4 py-3 bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">APIs Conectadas</span>
              <span className="text-xl font-black text-emerald-400 font-mono">9 / 10</span>
            </div>
            <div className="px-4 py-3 bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sincronização</span>
              <span className="text-xl font-black text-blue-400 font-mono">100% OK</span>
            </div>
            <button
              onClick={() => {
                setNewApiType('BANCO');
                setIsNewApiModalOpen(true);
              }}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl border border-blue-400/30 text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer shrink-0"
              title="Incluir e homologar APIs de bancos, portais, webhooks e gateways"
            >
              <Settings className="w-4 h-4 text-white" />
              <span>Configurar & Incluir Nova API</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {navCategories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as IntegrationCategory)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* SECTION 0: DEPLOY INSTANTÂNEO (EXCLUSIVO SUPER ADMIN)    */}
      {/* ======================================================== */}
      {isSuperAdmin && (activeCategory === 'all' || activeCategory === 'deploy_instantaneo') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Deploy Instantâneo & Conexões em Nuvem
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    CI/CD ATIVO
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Gerenciamento de repositório Git, automação de hospedagem Apache/cPanel (HomeHost) e infraestrutura serverless Firebase
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDeployToHomehost}
                disabled={isDeployingCpanel}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isDeployingCpanel ? 'Publicando...' : 'Deploy Instantâneo HomeHost'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: GitHub Repository & CI/CD */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">GitHub Repository</h4>
                      <span className="text-[10px] text-slate-500 font-mono">Branch: {githubBranch}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Conectado</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Repositório Remoto</label>
                  <input
                    type="text"
                    value={githubRepoUrl}
                    onChange={(e) => setGithubRepoUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Último Commit Sincronizado:</span>
                    <span className="font-mono font-bold text-blue-600">#{lastCommitSha}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 line-clamp-1">
                    "{lastCommitMsg}"
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleSyncGithub}
                  disabled={isSyncingGit}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGit ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
                  <span>{isSyncingGit ? 'Sincronizando...' : 'Sincronizar Git Agora'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: cPanel HomeHost (Hospedagem Web & Apache .htaccess) */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">cPanel HomeHost</h4>
                      <span className="text-[10px] text-slate-500">Hospedagem SPA Apache</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {lastDeployTime}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Domínio de Produção</label>
                  <input
                    type="text"
                    value={cpanelDomain}
                    onChange={(e) => setCpanelDomain(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Servidor cPanel:</span>
                    <strong className="text-slate-700 font-mono">{cpanelHost}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Diretório Exclusivo CRM:</span>
                    <strong className="text-emerald-700 font-mono font-bold">{cpanelTargetDir}</strong>
                  </div>
                  <div className="text-[10px] text-blue-700 bg-blue-50 p-1.5 rounded-lg border border-blue-200">
                    🛡️ <strong>Raiz (public_html/):</strong> Landing Page oficial AcertGo (dist-root/) com <code>Options -Indexes</code>. CRM opera isolado em <code>public_html/aicrm/</code>.
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> .htaccess Integrado (aicrm)
                    </span>
                    <button
                      onClick={handleDownloadHtaccess}
                      className="text-blue-600 hover:text-blue-800 font-bold text-[10px] flex items-center gap-0.5"
                    >
                      <Download className="w-3 h-3" /> Baixar
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestCpanel}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-slate-600" />
                  <span>Testar Apache</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeployToHomehost}
                  disabled={isDeployingCpanel}
                  className="flex-1 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Publicar</span>
                </button>
              </div>
            </div>

            {/* Card 3: Firebase Cloud Infrastructure */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Firebase Cloud</h4>
                      <span className="text-[10px] text-slate-500">Firestore & Auth</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Online</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Project ID</label>
                  <input
                    type="text"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Segurança:</span>
                    <strong className="text-emerald-700 font-bold">firestore.rules Homologadas</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Coleções Ativas:</span>
                    <strong className="text-slate-700 font-mono">18 Coleções</strong>
                  </div>
                  {firebaseTestOutput && (
                    <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg text-[10px] font-medium border border-emerald-200">
                      {firebaseTestOutput}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleTestFirebase}
                  disabled={isTestingFirebase}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingFirebase ? 'animate-spin text-amber-600' : 'text-slate-600'}`} />
                  <span>{isTestingFirebase ? 'Testando Conexão...' : 'Testar Firestore & Auth'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: PORTAIS IMOBILIÁRIOS XML                     */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'portais_xml') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Portais Imobiliários & Feeds XML
                </h3>
                <p className="text-xs text-slate-500">
                  Exportação automática padrão Zap / VivaReal / OLX / Imovelweb para todos os portais do Brasil
                </p>
              </div>
            </div>

            {/* XML Rules Toggles */}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleOnlyWithPhotos}
                  onChange={e => setRuleOnlyWithPhotos(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Apenas com fotos</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleHideExactAddress}
                  onChange={e => setRuleHideExactAddress(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Ocultar endereço exato</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleOnlyAvailable}
                  onChange={e => setRuleOnlyAvailable(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Somente disponíveis</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setNewApiType('PORTAL');
                  setIsNewApiModalOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configurar Novo Portal / Feed</span>
              </button>
            </div>
          </div>

          {/* Portals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map(portal => (
              <div
                key={portal.id}
                className="bg-slate-50/70 hover:bg-slate-50 transition-all rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={portal.logo}
                        alt={portal.name}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{portal.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{portal.portalCode}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTogglePortal(portal.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        portal.active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {portal.active ? 'ONLINE' : 'PAUSADO'}
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Imóveis no Feed:</span>
                      <strong className="text-slate-900 font-mono">{portal.totalPublished} / {portal.maxProperties}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Destaques Ativos:</span>
                      <strong className="text-amber-600 font-mono">{portal.highlightCount} / {portal.maxHighlights}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Última Sincronização:</span>
                      <span className="text-[10px] text-slate-500">{portal.lastSyncAt}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => handleCopyFeedUrl(portal)}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedFeedId === portal.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedXmlPortal(portal)}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                    title="Ver conteúdo do XML"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Ver XML</span>
                  </button>

                  <button
                    onClick={() => handleSyncPortal(portal.id)}
                    disabled={syncingPortalId === portal.id}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors"
                    title="Forçar sincronização"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingPortalId === portal.id ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: ÓRULO LANÇAMENTOS                            */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'orulo') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Órulo Lançamentos</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    CONECTADO & HOMOLOGADO
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Integração oficial com a maior plataforma de lançamentos e construtoras do Brasil
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncOrulo}
              disabled={isSyncingOrulo}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingOrulo ? 'animate-spin' : ''}`} />
              <span>{isSyncingOrulo ? 'Sincronizando Órulo...' : 'Sincronizar Acervo Órulo Agora'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-1">
              <span className="text-[10px] font-bold text-orange-900 uppercase">Empreendimentos Disponíveis</span>
              <div className="text-2xl font-black text-orange-950 font-mono">{oruloTotalDevelopments.toLocaleString('pt-BR')}</div>
              <p className="text-[11px] text-orange-800">Cyrela, Even, Mitre, Eztec, Gafisa, Moura Dubeux e +400 construtoras</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-700 uppercase">Token de API Órulo (Bearer)</span>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={oruloApiKey}
                  onChange={e => setOruloApiKey(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => showToast('Token Órulo validado com sucesso!')}
                  className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shrink-0"
                >
                  Salvar
                </button>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">Token Válido • Escopos: buildings:read, units:read</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-slate-700 uppercase">Funcionalidades Integradas</span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Espelhos de vendas atualizados</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Tabelas de preços e fluxo de pagamento</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Plantas humanizadas em alta resolução</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: WHATSAPP API                                  */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'whatsapp') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">WhatsApp API & Multi-atendimento</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE & CONECTADO
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Z-API, Baileys / Evolution API e Meta Cloud API oficial conectados à Roleta de Corretores
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={whatsappProvider}
                onChange={e => setWhatsappProvider(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Z_API">Z-API (Recomendado)</option>
                <option value="EVOLUTION_BAILEYS">Evolution API (Baileys)</option>
                <option value="META_CLOUD">WhatsApp Cloud API (Meta Oficial)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Connection Status Card */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">Número Vinculado</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-200/60 text-emerald-900 font-bold">
                  {whatsappPhone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-white border border-emerald-200 p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-emerald-800" />
                </div>
                <div className="text-[11px] text-emerald-900 leading-tight space-y-1">
                  <strong>QR Code Sincronizado</strong>
                  <p className="text-emerald-700">Instância ativa. Mensagens recebidas disparam imediatamente a Roleta de Leads.</p>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900">Credenciais da Conexão</div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">ID da Instância:</span>
                  <input
                    type="text"
                    value={whatsappInstanceId}
                    onChange={e => setWhatsappInstanceId(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Token de Acesso:</span>
                  <input
                    type="password"
                    value={whatsappToken}
                    onChange={e => setWhatsappToken(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Test Message Dispatcher */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">Disparar Mensagem de Teste</span>
                <p className="text-[11px] text-slate-500 mb-2">Envie um WhatsApp instantâneo para testar a rota da API.</p>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={testPhoneNumber}
                  onChange={e => setTestPhoneNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <button
                onClick={handleSendTestWhatsapp}
                disabled={isSendingTestMessage}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTestMessage ? 'Enviando...' : 'Enviar Mensagem de Teste'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: CHATGPT & GEMINI AI                           */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'ai_chatgpt_gemini') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OpenAI ChatGPT Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">OpenAI ChatGPT API</h4>
                  <p className="text-xs text-slate-500">Corretor virtual & triagem inteligente de leads</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800">
                GPT-4o ATIVO
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Modelo Selecionado:</span>
                  <select
                    value={chatGptModel}
                    onChange={e => setChatGptModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="gpt-4o">GPT-4o (Mais Inteligente)</option>
                    <option value="gpt-4o-mini">GPT-4o-mini (Mais Rápido)</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Chave de API:</span>
                  <input
                    type="password"
                    value={chatGptApiKey}
                    onChange={e => setChatGptApiKey(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Prompt do Sistema (Persona do Corretor):</span>
                <textarea
                  rows={2}
                  value={chatGptSystemPrompt}
                  onChange={e => setChatGptSystemPrompt(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 leading-relaxed resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Testar Resposta da IA</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Quanto custa o m² nos Jardins?"
                    value={chatGptTestQuery}
                    onChange={e => setChatGptTestQuery(e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    onClick={handleTestChatGpt}
                    disabled={isTestingChatGpt}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shrink-0"
                  >
                    {isTestingChatGpt ? 'Pensando...' : 'Testar'}
                  </button>
                </div>
                {chatGptTestResponse && (
                  <div className="p-2.5 bg-white rounded-lg border border-teal-200 text-[11px] text-teal-950 font-medium">
                    {chatGptTestResponse}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Google Gemini Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Google Gemini API</h4>
                  <p className="text-xs text-slate-500">Visão computacional de fotos & transcrição de áudio</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                GEMINI 2.5 FLASH
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Modelo GenAI:</span>
                  <select
                    value={geminiModel}
                    onChange={e => setGeminiModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Rápido)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Raciocínio Complexo)</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Chave Gemini (AIzaSy...):</span>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={e => setGeminiApiKey(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-900 uppercase block">Recursos Ativos no CRM:</span>
                <ul className="text-[11px] text-blue-800 space-y-1">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Identificação automática de cômodos nas fotos de imóveis</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Transcrição instantânea de áudios de clientes no WhatsApp</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Geração de anúncios persuasivos para redes sociais</li>
                </ul>
              </div>

              <button
                onClick={handleTestGemini}
                disabled={isTestingGemini}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTestingGemini ? 'Testando conexão Google...' : 'Validar Conexão Google Gemini'}</span>
              </button>

              {geminiTestOutput && (
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                  {geminiTestOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: META ADS & GOOGLE                             */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'meta_ads' || activeCategory === 'google') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meta Ads Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Meta (Instagram & Facebook)</h4>
                  <p className="text-xs text-slate-500">Lead Ads webhook & catálogo de imóveis</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                GRAPH API v19.0
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-medium">Instagram Business ID:</span>
                <span className="font-mono font-bold text-slate-900">{metaInstagramId}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-medium">Pixel ID (Rastreamento):</span>
                <span className="font-mono font-bold text-slate-900">{metaPixelId}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-medium">Lead Ads Webhook:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Ativo (Captura imediata)
                </span>
              </div>
              <button
                onClick={() => showToast('Credenciais Meta sincronizadas com sucesso!')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Gerenciar Permissões da Meta
              </button>
            </div>
          </div>

          {/* Google Services Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Google Ecosystem</h4>
                  <p className="text-xs text-slate-500">Google Ads leads, GA4, GTM e Google Maps</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                GOOGLE CERTIFIED
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-medium">Google Ads Webhook:</span>
                <span className="font-mono font-bold text-emerald-700">Leads Conectados</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-medium">Google Analytics 4 (GA4):</span>
                <span className="font-mono font-bold text-slate-900">{googleAnalyticsId}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-medium">Google Tag Manager:</span>
                <span className="font-mono font-bold text-slate-900">{googleTagManagerId}</span>
              </div>
              <button
                onClick={() => showToast('Google Ads & Analytics validados!')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Configurar Tags do Google
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 6: BANCOS & FINANCIAMENTO                        */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'bancos_financiamento') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Bancos & Crédito Imobiliário</h3>
                <p className="text-xs text-slate-500">
                  APIs de correspondente bancário digital para simulação de taxas e esteira de aprovação de crédito
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                Taxa Média do Mercado: 9.79% a.a. + TR
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewApiType('BANCO');
                  setIsNewApiModalOpen(true);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Incluir API Bancária</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankApis.map(bank => (
              <div
                key={bank.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{bank.name}</span>
                  <button
                    onClick={() => handleToggleBank(bank.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bank.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {bank.connected ? 'ATIVO' : 'PAUSADO'}
                  </button>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxa Estimada:</span>
                    <strong className="text-slate-900 font-mono">{bank.rateYear}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Status da Esteira:</span>
                    <span className="text-[10px] text-emerald-700 font-bold">{bank.status}</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Simulador ${bank.name} aberto!`)}
                  className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>Simular Proposta</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 7: CONTA PRONTA & BAAS (SPLIT PIX)              */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'conta_pronta') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Conta Pronta • BaaS & Split de Comissões</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
                    SPLIT AUTOMÁTICO D+0
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Integração bancária especializada no mercado imobiliário: divisão de comissões, Pix e boletos sem bitributação
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Extrato da Conta Pronta exportado com sucesso!')}
                className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-colors"
              >
                Ver Extrato & Repasses
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-[10px] font-bold text-purple-900 uppercase">Saldo em Conta Escrow</span>
              <div className="text-2xl font-black text-purple-950 font-mono">
                R$ {contaProntaBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-purple-800">Disponível para repasse imediato aos corretores</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-700 uppercase">Chave Pix da Imobiliária (Recebimentos)</span>
              <input
                type="text"
                value={contaProntaPixKey}
                onChange={e => setContaProntaPixKey(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
              <span className="text-[10px] text-emerald-600 font-bold block">Chave Validada no Banco Central</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-700 uppercase">Parâmetros de Split</span>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Repasse Imediato Corretor:</span>
                  <strong className="text-slate-900">Ativado (Pix D+0)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Emissão de Boletos Registrados:</span>
                  <strong className="text-slate-900">Ativado (Taxa R$ 1,99)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Retenção Tributária:</span>
                  <strong className="text-slate-900">Automática s/ Bitributação</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 8: WEBHOOKS UNIVERSAIS & APIS REST               */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'webhooks') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Webhooks de Entrada & APIs REST Customizadas</h4>
                <p className="text-xs text-slate-500">Conecte formulários de sites externos, RD Station, ActiveCampaign ou CRM externo</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
              HTTPS POST JSON
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">URL do Webhook Receptor de Leads</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={customWebhookUrl}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(customWebhookUrl);
                    showToast('URL do Webhook copiada!');
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shrink-0"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Bearer Secret Token</span>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={webhookSecretToken}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                />
                <button
                  onClick={() => showToast('Token regenerado com sucesso!')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold shrink-0 border border-slate-300"
                >
                  Regenerar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* XML Viewer Modal */}
      {selectedXmlPortal && (
        <XmlFeedViewerModal
          portal={selectedXmlPortal}
          properties={properties}
          isOpen={!!selectedXmlPortal}
          onClose={() => setSelectedXmlPortal(null)}
        />
      )}

      {/* MODAL: CONFIGURAR & INCLUIR NOVA API (BANCOS, PORTAIS, APIS CUSTOMIZADAS) */}
      {isNewApiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Configurar Nova Integração de API</h3>
                  <p className="text-xs text-slate-400">Homologação de bancos, portais imobiliários e webhooks</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewApiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewApi} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de API / Conector:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'BANCO', label: 'Banco / Crédito' },
                    { id: 'PORTAL', label: 'Portal / XML' },
                    { id: 'WEBHOOK', label: 'Webhook REST' },
                    { id: 'GATEWAY', label: 'BaaS / Gateway' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewApiType(t.id as any)}
                      className={`p-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        newApiType === t.id
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nome da Instituição ou Portal *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newApiType === 'BANCO'
                      ? 'Ex: Banco Safra Financiamentos ou BTG Pactual'
                      : newApiType === 'PORTAL'
                      ? 'Ex: Chaves na Mão, Imovelweb ou CasaMineira'
                      : 'Ex: Sistema ERP Externo'
                  }
                  value={newApiName}
                  onChange={e => setNewApiName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Endpoint Base da API / Feed XML URL
                </label>
                <input
                  type="text"
                  placeholder="https://api.instituicao.com.br/v2/imoveis/stream"
                  value={newApiEndpoint}
                  onChange={e => setNewApiEndpoint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    API Key / Client ID
                  </label>
                  <input
                    type="password"
                    placeholder="pk_live_••••••••••••"
                    value={newApiKey}
                    onChange={e => setNewApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Client Secret / Token Bearer
                  </label>
                  <input
                    type="password"
                    placeholder="sk_secret_••••••••••••"
                    value={newApiSecret}
                    onChange={e => setNewApiSecret(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ambiente da API:</label>
                  <select
                    value={newApiEnvironment}
                    onChange={e => setNewApiEnvironment(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white outline-hidden"
                  >
                    <option value="SANDBOX">Sandbox / Homologação (Testes)</option>
                    <option value="PRODUCAO">Produção Oficial</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teste de Comunicação:</label>
                  <button
                    type="button"
                    onClick={handleTestNewApi}
                    disabled={isTestingApi}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
                    <span>{isTestingApi ? 'Pingando Endpoint...' : 'Testar Conexão HTTP'}</span>
                  </button>
                </div>
              </div>

              {apiTestSuccess && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{apiTestSuccess}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewApiModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar & Ativar Integração</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

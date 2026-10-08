import React, { useState } from 'react';
import { 
  Globe, 
  Server, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  X, 
  Terminal, 
  FolderTree, 
  FileCode, 
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { PRODUCTION_DOMAINS } from '../../utils/domainRouting';

interface CpanelDeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CpanelDeploymentGuideModal: React.FC<CpanelDeploymentGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedHtaccess, setCopiedHtaccess] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const htaccessCode = `# ====================================================================
# Configuração Apache / cPanel HomeHost para Aplicações SPA (Vite / React)
# AcertGo CRM & ERP Imobiliário (acertgo.com.br e aicrm.acertgo.com.br)
# ====================================================================

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Forçar HTTPS (SSL gratuito HomeHost Let's Encrypt / AutoSSL)
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. Redirecionar acessos ao CRM no domínio principal para o subdomínio aicrm
  RewriteCond %{HTTP_HOST} ^(www\.)?acertgo\.com\.br$ [NC]
  RewriteRule ^(crm|login|painel|app)/?$ https://aicrm.acertgo.com.br/ [R=301,L]

  # 3. Redirecionar acessos à página de vendas no subdomínio para o domínio principal
  RewriteCond %{HTTP_HOST} ^aicrm\.acertgo\.com\.br$ [NC]
  RewriteRule ^(vendas|lp|sales)/?$ https://acertgo.com.br/ [R=301,L]

  # 4. Servir arquivos e diretórios estáticos diretamente (JS, CSS, imagens)
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 5. Roteamento SPA: Qualquer rota virtual recarrega index.html (Evita erro 404)
  RewriteRule ^ index.html [L]
</IfModule>

# Compressão GZIP / Deflate para carregamento ultra rápido
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml
</IfModule>

# Cache de Assets compilados
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Sem cache para páginas HTML (garante versão sempre atualizada)
<FilesMatch "\.(html|htm)$">
  <IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate, max-age=0"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </IfModule>
</FilesMatch>

# Cabeçalhos de Segurança
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>`;

  const handleCopyHtaccess = () => {
    try {
      navigator.clipboard.writeText(htaccessCode);
      setCopiedHtaccess(true);
      setTimeout(() => setCopiedHtaccess(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Guia de Publicação no cPanel (HomeHost)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pronto para Produção
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Site Fortbens protegido na raiz (<strong className="text-white">public_html/</strong>) e CRM em <strong className="text-emerald-400">public_html/aicrm/</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm">
          
          {/* Top Architecture Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Site Fortbens */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  Domínio Principal (Raiz Protegida)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Site Fortbens
                </span>
              </div>
              <div className="text-base font-extrabold text-white">
                Site Institucional Fortbens
              </div>
              <p className="text-xs text-slate-300">
                Pasta cPanel: <code className="text-amber-300 font-mono font-bold">public_html/</code>
              </p>
              <div className="text-[11px] text-slate-400">
                ⚠️ <strong>Área Protegida:</strong> NUNCA envie o build do CRM para esta pasta. A raiz é exclusiva do site institucional da Fortbens e permanece 100% preservada.
              </div>
            </div>

            {/* Box 2: CRM & ERP */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Subdomínio Exclusivo do CRM
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CRM AcertGo
                </span>
              </div>
              <div className="text-base font-extrabold text-emerald-400">
                https://aicrm.acertgo.com.br
              </div>
              <p className="text-xs text-slate-300">
                Pasta cPanel: <code className="text-emerald-300 font-mono font-bold">public_html/aicrm/</code>
              </p>
              <div className="text-[11px] text-slate-400">
                Destino exclusivo e único da compilação do CRM. Contém a governança imobiliária, roleta, gestão de imóveis, split bancário e dashboards.
              </div>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800">
            {[
              { num: 1, label: '1. Subdomínio no cPanel' },
              { num: 2, label: '2. Configurar DNS' },
              { num: 3, label: '3. Envio dos Arquivos' },
              { num: 4, label: '4. Arquivo .htaccess' },
              { num: 5, label: '5. Ativar SSL Gratuito' },
              { num: 6, label: '⚠️ 6. Erros ao Clonar (Solução)' }
            ].map((step) => (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeStep === step.num
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Step 1: Subdomínio no cPanel */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</span>
                Criar o Subdomínio no cPanel da HomeHost
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Acesse o seu painel <strong>cPanel</strong> fornecido pela HomeHost (ex: <code className="text-blue-300 font-mono">https://cpanel.acertgo.com.br</code> ou pelo painel do cliente).</li>
                <li>Na seção <strong>Domínios</strong>, clique no ícone <strong>Subdomínios</strong> (ou <em>Domains</em>).</li>
                <li>Preencha os campos com os dados exatos:
                  <div className="mt-2 ml-4 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                    <div><strong>Subdomínio:</strong> <span className="text-blue-400">aicrm</span></div>
                    <div><strong>Domínio:</strong> <span className="text-blue-400">acertgo.com.br</span></div>
                    <div><strong>Raiz do Documento:</strong> <span className="text-emerald-400">public_html/aicrm</span> (ou pasta criada pelo cPanel)</div>
                  </div>
                </li>
                <li>Clique no botão azul <strong>Criar</strong>. O cPanel criará a pasta automaticamente no seu Gerenciador de Arquivos.</li>
              </ol>
            </div>
          )}

          {/* Step 2: DNS */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">2</span>
                Zona DNS do Domínio (HomeHost ou Registro.br / Cloudflare)
              </h3>
              <p className="text-slate-300">
                Se os DNS do domínio <code className="text-blue-300">acertgo.com.br</code> já apontam para a HomeHost (ex: ns1.homehost.com.br), o cPanel já cria o registro automaticamente!
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Tabela de Apontamento DNS:</div>
                <div className="grid grid-cols-3 gap-2 pb-1 border-b border-slate-800 font-bold text-slate-300">
                  <div>Nome / Entrada</div>
                  <div>Tipo</div>
                  <div>Destino / IP</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-slate-300">
                  <div><strong className="text-white">acertgo.com.br</strong></div>
                  <div>A</div>
                  <div>IP do seu servidor HomeHost</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-slate-300">
                  <div><strong className="text-white">www</strong></div>
                  <div>CNAME</div>
                  <div>acertgo.com.br</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-emerald-400 font-semibold">
                  <div><strong>aicrm</strong></div>
                  <div>CNAME (ou A)</div>
                  <div>acertgo.com.br (ou IP do servidor)</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Envio dos Arquivos */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">3</span>
                Compilação e Envio do CRM Exclusivamente para o Subdomínio
              </h3>
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Proteção Total da Raiz:</strong> O código do CRM (AcertGo) é compilado e enviado <strong>exclusivamente</strong> para a pasta do subdomínio (<code>public_html/aicrm/</code>), garantindo que o site institucional da Fortbens na raiz não seja sobrescrito!
                </span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Gere o pacote de produção executando no terminal:
                  <div className="mt-1 ml-4 p-2.5 bg-slate-950 rounded-xl font-mono text-xs text-blue-400 border border-slate-800">
                    npm run build
                  </div>
                </li>
                <li>Serão geradas as pastas <strong>dist-crm/</strong> e <strong>dist/</strong> contendo a aplicação do CRM e o <code>.htaccess</code> configurado.</li>
                <li>No <strong>Gerenciador de Arquivos</strong> do cPanel:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-300">
                    <li className="text-emerald-400 font-semibold">Envie o conteúdo para a pasta do subdomínio: <code className="text-white bg-slate-900 px-1 py-0.5 rounded">public_html/aicrm/</code> (atende <em>aicrm.acertgo.com.br</em>).</li>
                    <li className="text-amber-400 font-medium">⚠️ NUNCA envie para <code className="line-through text-slate-400">public_html/</code> raiz (reservada para o site Fortbens).</li>
                  </ul>
                </li>
              </ol>
            </div>
          )}

          {/* Step 4: .htaccess */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">4</span>
                  Arquivo .htaccess Configurado para cPanel / Apache
                </h3>
                <button
                  type="button"
                  onClick={handleCopyHtaccess}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedHtaccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtaccess ? 'Copiado!' : 'Copiar .htaccess'}</span>
                </button>
              </div>
              <p className="text-slate-400 text-xs">
                Este arquivo já está incluído na pasta <code className="text-blue-300">public/.htaccess</code> do projeto e vai automaticamente para a pasta <code>dist/</code> ao compilar. Ele garante que qualquer link interno não resulte em erro 404 ao recarregar a página (F5) e força HTTPS.
              </p>
              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64">
                {htaccessCode}
              </pre>
            </div>
          )}

          {/* Step 5: SSL */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">5</span>
                Ativar Certificado SSL Gratuito (AutoSSL / Let's Encrypt)
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>No cPanel da HomeHost, vá na seção <strong>Segurança</strong> &gt; <strong>Status do SSL/TLS</strong>.</li>
                <li>Verifique se tanto <code className="text-white">acertgo.com.br</code> quanto <code className="text-emerald-400">aicrm.acertgo.com.br</code> constam na lista de domínios.</li>
                <li>Clique no botão azul <strong>Executar AutoSSL</strong> (<em>Run AutoSSL</em>).</li>
                <li>Em poucos minutos, o cPanel emitirá os certificados SSL gratuitos (cadeado verde seguro com protocolo HTTPS).</li>
              </ol>
            </div>
          )}

          {/* Step 6: Troubleshooting Git Clone no cPanel */}
          {activeStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Como Resolver os Erros ao Clonar o Repositório no cPanel
              </h3>

              <div className="space-y-4">
                {/* Erro 1 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <span>1. Erro: "destination path already exists and is not an empty directory"</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Motivo:</strong> O cPanel cria arquivos padrão automáticos dentro de <code>public_html</code> ou na pasta do subdomínio (como <code>cgi-bin</code> ou <code>.htaccess</code>). O Git exige que o diretório esteja 100% vazio para clonar.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs text-emerald-300 space-y-1">
                    <strong>Como resolver:</strong>
                    <div>• <strong>Forma recomendada:</strong> No campo <em>Repository Path</em> no cPanel, digite uma pasta separada, por exemplo: <code className="text-white">repositories/acertgo-crm</code>.</div>
                    <div>• <strong>Ou:</strong> Abra o <em>Gerenciador de Arquivos</em> do cPanel, marque "Exibir arquivos ocultos" e exclua os arquivos padrão temporários da pasta antes de tentar clonar.</div>
                  </div>
                </div>

                {/* Erro 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <span>2. Erro de Autenticação / Repositório Privado no GitHub</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Motivo:</strong> O GitHub não aceita mais a sua senha de usuário comum para clonar repositórios via HTTPS ou cPanel.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs text-emerald-300 space-y-1">
                    <strong>Como resolver:</strong>
                    <div>• Use um <strong>Personal Access Token (PAT)</strong> do GitHub na URL de clone:</div>
                    <div className="p-2 bg-black rounded font-mono text-[11px] text-white">
                      https://SEU_TOKEN_GITHUB@github.com/SEU_USUARIO/SEU_REPOSITORIO.git
                    </div>
                    <div>• Ou gere uma <strong>Chave SSH</strong> no cPanel (em <em>Acesso SSH</em>) e adicione em <em>Settings &gt; Deploy keys</em> no seu GitHub.</div>
                  </div>
                </div>

                {/* Alternativa Mais Fácil */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800/80 space-y-2">
                  <div className="text-blue-300 font-bold text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Dica de Ouro: Como colocar no ar em 1 minuto sem precisar do Git no cPanel</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Como o projeto é construído em React/Vite, o Apache do cPanel precisa apenas dos arquivos estáticos da pasta <strong>dist/</strong>. Clonar o código cru exige que o servidor tenha Node.js e execute <code>npm run build</code>.
                  </p>
                  <div className="p-3 bg-slate-900/90 rounded-lg text-xs space-y-1.5 text-slate-300">
                    <div>1. No seu computador, rode <code className="text-blue-400 font-bold">npm run build</code>.</div>
                    <div>2. Compacte a pasta <strong>dist-crm</strong> (ou <strong>dist</strong>) em um arquivo <code>crm.zip</code>.</div>
                    <div>3. No Gerenciador de Arquivos do cPanel, faça o upload e extraia <strong>exclusivamente em <code>public_html/aicrm/</code></strong>.</div>
                    <div className="text-amber-300 text-[11px]">⚠️ Não altere a raiz <code>public_html/</code> — ela é do site institucional da Fortbens.</div>
                    <div className="text-emerald-400 font-semibold">✓ Funciona imediatamente em aicrm.acertgo.com.br, com máxima velocidade e total segurança!</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            Compatível com cPanel HomeHost, Apache 2.4+ e LiteSpeed Web Server.
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
            >
              Entendido, Fechar Guia
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

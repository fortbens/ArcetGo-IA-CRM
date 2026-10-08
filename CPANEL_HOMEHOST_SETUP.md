# Configuração e Publicação no cPanel da HomeHost
## Arquitetura de Hospedagem Segura

- **Site Institucional Fortbens (Domínio Principal / Raiz):** Pasta `public_html/` (Protegido — NUNCA sobrescrever!).
- **Plataforma CRM / ERP AcertGo (Subdomínio Exclusivo):** `https://aicrm.acertgo.com.br` -> Pasta `public_html/aicrm/`.

> ⚠️ **ATENÇÃO CRÍTICA DE DEPLOY:**
> O site institucional da **Fortbens** reside na raiz (`public_html/`). 
> O código do CRM (**AcertGo**) é compilado e enviado **exclusivamente** para a pasta do subdomínio (`public_html/aicrm/`), garantindo que o site da Fortbens na raiz **jamais** seja sobrescrito ou modificado.

---

## Como a Aplicação do CRM se Comporta
1. O CRM AcertGo opera em `https://aicrm.acertgo.com.br` com tela de login, governança multi-tenancy, roleta de corretores, gestão de imóveis, ERP financeiro e esteiras de contratos.
2. Na raiz (`public_html/`), permanece exclusivamente o site institucional da Fortbens.
3. Todo o build do CRM é direcionado para `dist-crm/` e deve ser publicado em `public_html/aicrm/`.

---

## Passo a Passo no cPanel da HomeHost

### 1. Criar o Subdomínio no cPanel
1. Acesse seu painel **cPanel** da HomeHost.
2. Na seção **Domínios**, clique em **Subdomínios** (ou *Domains*).
3. Preencha:
   - **Subdomínio:** `aicrm`
   - **Domínio:** `acertgo.com.br` (ou o domínio da sua empresa)
   - **Raiz do Documento:** `public_html/aicrm` (pasta dedicada).
4. Clique em **Criar**.

---

### 2. Apontamento de DNS (Zona DNS)
No cPanel da HomeHost (ou no Registro.br / Cloudflare, caso utilize DNS externo):
- **aicrm.acertgo.com.br** (CNAME ou Tipo A) -> Apontando para o IP do servidor HomeHost.

---

### 3. Gerar o Pacote de Produção do CRM
No terminal do projeto, execute:
```bash
npm run build
```
Serão geradas as pastas `dist/` e `dist-crm/` com:
- `index.html` (Aplicação CRM)
- Pasta `assets/` (arquivos JS e CSS minificados)
- `.htaccess` (configuração Apache/LiteSpeed dedicada com SPA routing e no-cache estrito)

---

### 4. Envio dos Arquivos pelo Gerenciador de Arquivos do cPanel
1. No cPanel, abra o **Gerenciador de Arquivos**.
2. Acesse a pasta exclusiva do CRM: **`public_html/aicrm/`** (a pasta do subdomínio criada no Passo 1).
3. Envie e extraia o conteúdo da pasta `dist-crm/` (ou `dist/`).
4. **NÃO altere nem envie arquivos para a raiz `public_html/`**, pois ela pertence ao site institucional da Fortbens!
5. *Nota:* Certifique-se de que o arquivo `.htaccess` esteja presente dentro de `public_html/aicrm/` (ative a opção "Mostrar Arquivos Ocultos / dotfiles" nas configurações da barra superior do Gerenciador de Arquivos).

---

### 5. Ativar o SSL Gratuito (HTTPS)
1. No cPanel, acesse **Segurança** > **Status do SSL/TLS**.
2. Verifique se `aicrm.acertgo.com.br` aparece na lista.
3. Clique em **Executar AutoSSL** (*Run AutoSSL*).
4. O certificado Let's Encrypt / cPanel será emitido gratuitamente em alguns minutos.

---

### 6. Como Testar em Ambiente de Desenvolvimento ou Preview
Para testar a alternância entre os domínios antes de publicar:
- Testar Página de Vendas: adicione `?domain=sales` ou acesse `/vendas`.
- Testar CRM: adicione `?domain=aicrm` ou acesse `/`.
- Dentro do Super Admin, há também o botão **"cPanel HomeHost"** com o guia visual completo.

---

## 7. Como Resolver os Erros Comuns ao Clonar Repositório no cPanel

Se ao tentar clonar via **Git™ Version Control** no cPanel você encontrar erros, veja os motivos e soluções:

### Erro A: "destination path '...' already exists and is not an empty directory"
- **Causa:** O cPanel não permite clonar em uma pasta que já contenha arquivos (ao criar o subdomínio ou na `public_html`, o cPanel cria arquivos automáticos como `cgi-bin`, `.htaccess` ou pastas padrão).
- **Solução 1 (Recomendada):** No campo **Repository Path** do cPanel, informe um diretório novo que ainda não existe, por exemplo: `repositories/acertgo-crm` (fora da `public_html`).
- **Solução 2:** Abra o **Gerenciador de Arquivos**, ative "Mostrar arquivos ocultos (dotfiles)" nas configurações da barra superior, e apague qualquer arquivo padrão existente na pasta antes de clonar.

### Erro B: "Authentication failed" / Repositório Privado no GitHub
- **Causa:** O GitHub não aceita mais a sua senha de login tradicional por segurança.
- **Solução com Token (PAT):**
  1. No GitHub, vá em **Settings** > **Developer Settings** > **Personal access tokens (classic)**.
  2. Gere um token com permissão `repo`.
  3. No cPanel, no campo **Clone URL**, informe com o token embutido:
     `https://SEU_TOKEN_AQUI@github.com/SEU_USUARIO/SEU_REPOSITORIO.git`
- **Solução com Chave SSH:**
  1. No cPanel, vá em **Acesso SSH** > **Gerenciar Chaves SSH** > **Gerar Nova Chave**.
  2. Copie a chave pública gerada.
  3. No GitHub do repositório, vá em **Settings** > **Deploy keys** > **Add deploy key** e cole a chave.
  4. No cPanel, use a URL SSH: `git@github.com:SEU_USUARIO/SEU_REPOSITORIO.git`.

### Erro C: "Clonei o repositório mas o site não abre" (Lembrete sobre React)
- **Importante:** A aplicação é desenvolvida em React/Vite. O servidor Apache da hospedagem precisa dos arquivos compilados da pasta **`dist/`** (`index.html`, `assets/`, `.htaccess`). Clonar o código-fonte cru não gera o build automaticamente sem o comando `npm run build`.
- **A forma mais rápida e 100% garantida (Upload direto via ZIP):**
  1. Na sua máquina local, execute: `npm run build`
  2. Compacte o conteúdo gerado na pasta `dist` em um arquivo `dist.zip`.
  3. No **Gerenciador de Arquivos** do cPanel, faça o upload do `dist.zip` para `public_html` e para `public_html/aicrm` e clique em **Extrair**.
  4. O sistema entra no ar na hora, sem depender de comandos no servidor!


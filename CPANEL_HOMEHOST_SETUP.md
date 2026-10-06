# Configuração e Publicação no cPanel da HomeHost
## Arquitetura Multi-Domínio AcertGo

- **Página de Vendas (Pública):** `https://acertgo.com.br` e `https://www.acertgo.com.br`
- **Plataforma CRM / ERP (Interna):** `https://aicrm.acertgo.com.br`

---

## Como a Aplicação se Comporta
O código foi programado com **detecção automática inteligente de host (`window.location.hostname`)**:
1. Quando o visitante acessa **`acertgo.com.br`**, a aplicação detecta o domínio raiz e renderiza **diretamente a Página de Vendas (Landing Page)** com apresentação dos planos, calculadora de ROI, depoimentos e o botão **"Acessar CRM"**.
2. Quando o usuário clica em "Acessar CRM" ou acessa **`aicrm.acertgo.com.br`**, a aplicação detecta o subdomínio e abre **diretamente a Tela de Login e Governança do CRM**.
3. Na tela de login do CRM, há um botão de retorno que direciona para `https://acertgo.com.br`.
4. Um único build compilado (`npm run build`) atende ambos os domínios perfeitamente.

---

## Passo a Passo no cPanel da HomeHost

### 1. Criar o Subdomínio no cPanel
1. Acesse seu painel **cPanel** da HomeHost.
2. Na seção **Domínios**, clique em **Subdomínios** (ou *Domains*).
3. Preencha:
   - **Subdomínio:** `aicrm`
   - **Domínio:** `acertgo.com.br`
   - **Raiz do Documento:** `public_html/aicrm` (ou o diretório sugerido pelo cPanel).
4. Clique em **Criar**.

---

### 2. Apontamento de DNS (Zona DNS)
No cPanel da HomeHost (ou no Registro.br / Cloudflare, caso utilize DNS externo):
- **acertgo.com.br** (Tipo A) -> IP do servidor HomeHost
- **www.acertgo.com.br** (CNAME) -> `acertgo.com.br`
- **aicrm.acertgo.com.br** (CNAME ou Tipo A) -> `acertgo.com.br` (ou IP do servidor)

---

### 3. Gerar o Pacote de Produção
No terminal do projeto, execute:
```bash
npm run build
```
Será gerada a pasta `dist/` com:
- `index.html`
- Pasta `assets/` (arquivos JS e CSS minificados)
- `.htaccess` (configuração Apache já pré-otimizada)

---

### 4. Envio dos Arquivos pelo Gerenciador de Arquivos do cPanel
1. No cPanel, abra o **Gerenciador de Arquivos**.
2. **Para a Página de Vendas (`acertgo.com.br`):**
   - Acesse a pasta `public_html/`
   - Envie e extraia o conteúdo da pasta `dist/`.
3. **Para o CRM (`aicrm.acertgo.com.br`):**
   - Acesse a pasta `public_html/aicrm/` (a pasta do subdomínio criada no Passo 1).
   - Envie e extraia o conteúdo da pasta `dist/`.
   - *Nota:* Certifique-se de que o arquivo `.htaccess` esteja presente em ambas as pastas (no cPanel, ative a opção "Mostrar Arquivos Ocultos / dotfiles" nas configurações da barra superior).

---

### 5. Ativar o SSL Gratuito (HTTPS)
1. No cPanel, acesse **Segurança** > **Status do SSL/TLS**.
2. Verifique se `acertgo.com.br`, `www.acertgo.com.br` e `aicrm.acertgo.com.br` aparecem na lista.
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


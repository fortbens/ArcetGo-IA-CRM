# Configuração e Publicação no cPanel da HomeHost
## Arquitetura de Hospedagem Segura (Raiz e Subdomínio)

- **Domínio Principal / Raiz (`https://acertgo.com.br`):** Pasta `public_html/` — Contém a Landing Page Institucional Oficial (elimina o erro `Index of /`).
- **Subdomínio do CRM (`https://aicrm.acertgo.com.br`):** Pasta `public_html/aicrm/` — Contém a plataforma operacional do CRM / ERP AcertGo.

---

## Como a Estrutura Funciona

1. **Na Raiz (`public_html/`):**
   - É publicado o `index.html` da landing page institucional e o arquivo `.htaccess`.
   - O arquivo `.htaccess` possui a diretiva `Options -Indexes`, impedindo que o Apache exiba a listagem de arquivos (`Index of /`).
   - Apresenta as soluções (Roleta, Espelho 360, Split Fintech, Planos, Calculadora de ROI e FAQ) com botão direto para **"Acessar CRM"** (`https://aicrm.acertgo.com.br`).
   - Qualquer tentativa de acessar `/crm`, `/login`, `/painel` ou `/app` no domínio principal é automaticamente redirecionada (301) para o subdomínio `aicrm.acertgo.com.br`.

2. **No Subdomínio (`public_html/aicrm/`):**
   - Opera o sistema completo do CRM (Login, Roleta, Estoque, Split, Vistorias, etc.).
   - Possui seu próprio `.htaccess` com suporte a SPA routing e controle no-cache estrito.

---

## Passo a Passo de Implantação no cPanel

### 1. Criar o Subdomínio no cPanel
1. Acesse o painel **cPanel** da HomeHost.
2. Na seção **Domínios**, clique em **Subdomínios** (ou *Domains*).
3. Preencha:
   - **Subdomínio:** `aicrm`
   - **Domínio:** `acertgo.com.br`
   - **Raiz do Documento:** `public_html/aicrm`
4. Clique em **Criar**.

---

### 2. Apontamento de DNS (Zona DNS)
No cPanel da HomeHost (ou no Registro.br / Cloudflare):
- **acertgo.com.br** (Tipo A) -> IP do servidor HomeHost
- **www.acertgo.com.br** (CNAME) -> `acertgo.com.br`
- **aicrm.acertgo.com.br** (CNAME ou Tipo A) -> Apontando para o IP do servidor HomeHost

---

### 3. Compilar os Pacotes
No terminal do projeto, execute:
```bash
npm run build
```
O comando gera automaticamente duas pastas prontas:
1. **`dist-root/`:** Contém o `index.html` institucional e `.htaccess` (para a raiz `public_html/`).
2. **`dist-crm/`:** Contém a aplicação compilada do CRM e `.htaccess` (para o subdomínio `public_html/aicrm/`).

---

### 4. Envio dos Arquivos pelo Gerenciador de Arquivos do cPanel
1. No cPanel, abra o **Gerenciador de Arquivos**.
2. **Para a Raiz (`public_html/`):**
   - Acesse a pasta `public_html/`.
   - Envie os arquivos da pasta **`dist-root/`** (`index.html` e `.htaccess`).
   - Isso garante que quem acessar `acertgo.com.br` veja a landing page institucional imediatamente, sem a tela `Index of /`.
3. **Para o Subdomínio (`public_html/aicrm/`):**
   - Acesse a pasta `public_html/aicrm/`.
   - Envie e extraia os arquivos da pasta **`dist-crm/`** (`index.html`, pasta `assets/` e `.htaccess`).
4. *Dica:* Certifique-se de que os arquivos ocultos estão visíveis (no cPanel, clique em "Configurações" no canto superior direito e marque "Mostrar Arquivos Ocultos / dotfiles").

---

### 5. Ativar o Certificado SSL Gratuito (HTTPS)
1. No cPanel, acesse **Segurança** > **Status do SSL/TLS**.
2. Verifique se `acertgo.com.br`, `www.acertgo.com.br` e `aicrm.acertgo.com.br` aparecem na lista.
3. Clique em **Executar AutoSSL** (*Run AutoSSL*).
4. O certificado Let's Encrypt / cPanel será emitido gratuitamente.

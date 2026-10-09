# 🚀 Guia de Integração e Deploy: GitHub -> cPanel (Homehost)

Este guia explica como funciona o deploy de **alta performance** do AcertGo, garantindo que o domínio principal (`acertgo.com.br`) carregue a landing page institucional oficial sem exibir o erro `Index of /`, e que o CRM opere de forma isolada no subdomínio (`aicrm.acertgo.com.br`).

---

## 🔍 Arquitetura de Publicação

1. **Raiz do Domínio (`public_html/` -> `https://acertgo.com.br`):**
   - Recebe a **Landing Page Institucional** oficial (`root-site/index.html`).
   - Recebe o `.htaccess` configurado com `Options -Indexes` (elimina definitivamente a tela de listagem de diretórios "Index of /").
   - Contém apresentação das soluções, planos, calculadora de ROI e botão direto para o CRM.

2. **Subdomínio do CRM (`public_html/aicrm/` -> `https://aicrm.acertgo.com.br`):**
   - Recebe a aplicação compilada do CRM / ERP (`dist-crm/`).
   - Ambiente isolado para login, funil de vendas, roleta WhatsApp, espelho 360 e financeiro.

---

## ✅ Solução 1: Deploy Automático via GitHub Actions (Recomendado)

O GitHub Actions compila o projeto em segundos e sincroniza automaticamente ambos os destinos via FTP:
- Envia `dist-root/` para `public_html/` (Site Institucional).
- Envia `dist-crm/` para `public_html/aicrm/` (CRM).

### Passo a Passo:

1. Acesse seu repositório no **GitHub**.
2. Vá em **Settings** > **Secrets and variables** > **Actions**.
3. Cadastre estas 3 credenciais do seu cPanel/FTP:
   - `CPANEL_FTP_SERVER`: Endereço FTP do cPanel (ex: `ftp.acertgo.com.br` ou o IP do servidor).
   - `CPANEL_FTP_USERNAME`: Seu usuário do cPanel ou da conta FTP.
   - `CPANEL_FTP_PASSWORD`: A senha da conta FTP.
4. Pronto! A cada `git push` na branch principal, o GitHub Actions atualiza ambos os ambientes automaticamente.

---

## ✅ Solução 2: Deploy Manual Rápido (Via Gerenciador de Arquivos do cPanel)

1. No terminal do projeto, execute:
   ```bash
   npm run build
   ```
2. O build gerará automaticamente duas pastas:
   - **`dist-root/`**: Arquivos da Landing Page Institucional.
   - **`dist-crm/`**: Arquivos do CRM / ERP.
3. No **Gerenciador de Arquivos** do cPanel:
   - Abra a pasta **`public_html/`** e envie os arquivos de **`dist-root/`** (`index.html` e `.htaccess`). *Isso remove imediatamente o erro "Index of /" no domínio acertgo.com.br.*
   - Abra a pasta **`public_html/aicrm/`** e envie/extraia os arquivos de **`dist-crm/`**.
4. Ambos os domínios estarão no ar com máxima velocidade!

# 🚀 Guia de Integração e Deploy: GitHub -> cPanel (Homehost)

Este guia explica exatamente **por que o cPanel ficava rodando horas sem implementar** e apresenta as **duas soluções definitivas** para colocar seu sistema no ar.

---

## 🔍 Por que o cPanel ficava "rodando horas"?

Existem **2 motivos principais** para esse problema ocorrer na integração entre GitHub e cPanel Homehost:

1. **Tentativa de rodar `npm install` / build dentro do cPanel compartilhado**:
   - Servidores compartilhados cPanel (como na Homehost) possuem limites rígidos de memória RAM (geralmente entre 256MB e 512MB por conta).
   - O projeto possui bibliotecas modernas (React, Vite, Tailwind CSS, Lucide, Recharts). Rodar `npm install` ou `npm run build` dentro do terminal do cPanel esgota a memória do servidor, e o sistema operacional bloqueia ou pausa o processo infinitamente em swap ("fica rodando horas").
   
2. **Pasta `dist/` não existe no repositório Git**:
   - Por padrão, o Git ignora a pasta `dist/` (onde ficam os arquivos gerados pelo Vite).
   - Se você clona o repositório diretamente no "Git™ Version Control" do cPanel e clica em **Deploy**, o script `.cpanel.yml` tentava copiar `dist/*`. Como `dist` não existe lá, o script falhava ou aguardava indefinidamente.

---

## ✅ Solução 1: Deploy Automático via GitHub Actions (Recomendado)

O GitHub possui servidores de alta performance gratuitos que compilam o CRM (`npm run build`) em segundos e enviam apenas os arquivos prontos e leves via FTP diretamente para o subdomínio `public_html/aicrm/` no cPanel.

> ⚠️ **ATENÇÃO:** A raiz (`public_html/`) contém o site institucional da **Fortbens** e NÃO é tocada por esta rotina, evitando qualquer risco de sobrescrita. O CRM AcertGo vai exclusivamente para `public_html/aicrm/`.

### Passo a Passo (Leva menos de 3 minutos):

1. Acesse seu repositório no **GitHub**.
2. Vá em **Settings** > **Secrets and variables** > **Actions**.
3. Clique em **New repository secret** e cadastre estas 3 credenciais do seu cPanel/FTP:
   - `CPANEL_FTP_SERVER`: Endereço FTP do seu cPanel (exemplo: `ftp.seudominio.com.br` ou o IP do seu servidor Homehost).
   - `CPANEL_FTP_USERNAME`: Seu usuário do cPanel ou da conta FTP (exemplo: `seuusuario@seudominio.com.br`).
   - `CPANEL_FTP_PASSWORD`: A senha da sua conta FTP.
4. Pronto! A cada `git push` na branch `main`, o GitHub Actions:
   - Compila o código com Vite e TypeScript;
   - Inclui o arquivo `.htaccess` específico do CRM para roteamento SPA e no-cache estrito;
   - Transfere os arquivos atualizados exclusivamente para `public_html/aicrm/` na sua hospedagem (o site institucional da Fortbens na raiz fica 100% preservado!).

---

## ✅ Solução 2: Deploy Manual Rápido (Via Gerenciador de Arquivos do cPanel)

Caso você não queira configurar FTP agora:

1. No seu computador ou ambiente de desenvolvimento, execute:
   ```bash
   npm run build
   ```
2. Acesse a pasta gerada `dist-crm/` (ou `dist/`).
3. Selecione todos os arquivos dentro de `dist-crm/` (incluindo `index.html`, pasta `assets/` e `.htaccess`) e compacte em um arquivo `.zip`.
4. Entre no **cPanel** > **Gerenciador de Arquivos** > navegue até a pasta do subdomínio: **`public_html/aicrm/`**.
   *(NUNCA extraia na raiz `public_html/`, pois a raiz é do site Fortbens!)*
5. Clique em **Carregar**, envie o arquivo `.zip` e clique com o botão direito em **Extrair**.
6. O CRM AcertGo estará no ar com segurança e sem interferir no site principal!

---

## 🔗 Publicação da Página de Vendas Separada do CRM

Se você deseja publicar a **Página de Vendas** em um subdomínio separado (ex: `vendas.seudominio.com.br`):
- No cPanel, vá em **Domínios** > **Subdomínios** e crie `vendas.seudominio.com.br`.
- Aponte o subdomínio para a pasta onde os arquivos foram publicados com o link universal `/#/vendas` ou adicione uma regra no `.htaccess`.
- Dentro da plataforma CRM, clique no botão **"Link Página de Vendas"** no topo da tela para copiar o link oficial e o QR Code.

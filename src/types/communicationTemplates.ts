export type MessageCategory = 'LOCACAO' | 'VENDAS' | 'JURIDICO' | 'ONBOARDING' | 'SISTEMA';
export type MessageChannel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH';
export type RecipientType = 'INQUILINO' | 'PROPRIETARIO' | 'COMPRADOR' | 'VENDEDOR' | 'CORRETOR' | 'FIADOR';

export interface TemplateVariable {
  key: string;
  label: string;
  example: string;
  description: string;
}

export interface SystemMessageTemplate {
  id: string;
  triggerKey: string;
  category: MessageCategory;
  title: string;
  description: string;
  channel: MessageChannel;
  recipientType: RecipientType;
  subject?: string; // Para e-mails
  bodyTemplate: string;
  availableVariables: TemplateVariable[];
  isActive: boolean;
  isCustomCreated?: boolean;
  version: string;
  updatedAt: string;
  updatedBy?: string;
}

export const COMMON_TEMPLATE_VARIABLES: TemplateVariable[] = [
  { key: 'NOME_CLIENTE', label: 'Nome do Cliente', example: 'Lucas Ferraz Medeiros', description: 'Nome completo ou primeiro nome do destinatário' },
  { key: 'VALOR_ALUGUEL', label: 'Valor do Aluguel', example: 'R$ 6.500,00', description: 'Valor atualizado do aluguel com pontualidade' },
  { key: 'VALOR_TOTAL_COBRANCA', label: 'Valor Total com Encargos', example: 'R$ 7.240,00', description: 'Aluguel + condomínio + IPTU + seguro contrafogo' },
  { key: 'DATA_VENCIMENTO', label: 'Data de Vencimento', example: '10/10/2026', description: 'Data limite para pagamento do boleto' },
  { key: 'DIAS_RESTANTES', label: 'Dias Restantes', example: '5 dias', description: 'Contagem regressiva até o vencimento' },
  { key: 'CODIGO_IMOVEL', label: 'Código do Imóvel', example: 'IMO-101', description: 'Identificador de referência do imóvel no CRM' },
  { key: 'ENDERECO_IMOVEL', label: 'Endereço do Imóvel', example: 'Rua Oscar Freire, 1420 - Jardins', description: 'Endereço completo da locação' },
  { key: 'CHAVE_PIX', label: 'Chave Pix / Copia e Cola', example: '00020126580014br.gov.bcb.pix...', description: 'Chave Pix dinâmica com split automático' },
  { key: 'LINK_BOLETO', label: 'Link do Boleto em PDF', example: 'https://acertgo.com.br/boletos/bol_90412.pdf', description: 'URL direta para download do boleto bancário' },
  { key: 'LINK_PORTAL', label: 'Link da Área do Cliente', example: 'https://acertgo.com.br/portal-cliente', description: 'Acesso direto do inquilino ou proprietário' },
  { key: 'INDICE_REAJUSTE', label: 'Índice de Reajuste', example: 'IPCA acumulado (+4,18%)', description: 'Índice pactuado no contrato de locação (IPCA/IGP-M)' },
  { key: 'VALOR_REPASSE_LIQUIDO', label: 'Valor Líquido do Repasse', example: 'R$ 5.850,00', description: 'Valor depositado ao proprietário deduzida taxa de administração' },
  { key: 'TAXA_ADMINISTRACAO', label: 'Taxa de Administração', example: '10% (R$ 650,00)', description: 'Honorários de administração imobiliária' },
  { key: 'NOME_IMOBILIARIA', label: 'Nome da Imobiliária', example: 'AcertGo Gestão Imobiliária', description: 'Razão social ou nome fantasia da imobiliária' },
  { key: 'TELEFONE_CONTATO', label: 'Telefone de Atendimento', example: '(11) 98844-3322', description: 'WhatsApp ou telefone da central de atendimento' }
];

export const INITIAL_SYSTEM_COMMUNICATION_TEMPLATES: SystemMessageTemplate[] = [
  {
    id: 'tpl_msg_aviso_d5',
    triggerKey: 'AVISO_VENCIMENTO_D5',
    category: 'LOCACAO',
    title: 'Lembrete de Vencimento D-5 (WhatsApp com Pix Copia e Cola)',
    description: 'Enviado automaticamente 5 dias antes da data de vencimento da fatura do aluguel',
    channel: 'WHATSAPP',
    recipientType: 'INQUILINO',
    subject: 'Lembrete de Vencimento de Aluguel - Imóvel {{CODIGO_IMOVEL}}',
    bodyTemplate: `Olá, *{{NOME_CLIENTE}}*! Tudo bem? 🏠

Lembramos que o aluguel do seu imóvel ({{CODIGO_IMOVEL}} - {{ENDERECO_IMOVEL}}) vence em *5 dias ({{DATA_VENCIMENTO}})*.
Valor total: *{{VALOR_TOTAL_COBRANCA}}*

Pague instantaneamente via Pix sem taxas:
👇 *Chave Pix Copia e Cola:*
\`{{CHAVE_PIX}}\`

Para visualizar o boleto em PDF ou contestar lançamentos, acesse a Área do Cliente:
👉 {{LINK_PORTAL}}

Dúvidas? Fale com a gente: {{TELEFONE_CONTATO}}
_{{NOME_IMOBILIARIA}}_`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_confirmacao_pix',
    triggerKey: 'CONFIRMACAO_PIX_RECEBIDO',
    category: 'LOCACAO',
    title: 'Confirmação de Pagamento D-0 (Recibo Digital Automático)',
    description: 'Enviado instantaneamente via WhatsApp assim que o webhook bancário liquida o Pix',
    channel: 'WHATSAPP',
    recipientType: 'INQUILINO',
    subject: 'Comprovante de Quitação de Aluguel',
    bodyTemplate: `✅ *Pagamento Confirmado com Sucesso!*

Olá, *{{NOME_CLIENTE}}*!
Identificamos o pagamento do aluguel referente ao imóvel *{{CODIGO_IMOVEL}}* no valor de *{{VALOR_ALUGUEL}}*.

Seu recibo oficial de quitação já foi registrado em nosso sistema e está disponível no seu portal:
👉 {{LINK_PORTAL}}

Obrigado pela pontualidade e pela parceria! 🤝
_{{NOME_IMOBILIARIA}}_`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_repasse_proprietario',
    triggerKey: 'REPASSE_PROPRIETARIO_EFETUADO',
    category: 'LOCACAO',
    title: 'Notificação de Repasse ao Proprietário D+5 (Extrato & Comprovante)',
    description: 'Disparado ao locador no momento do envio do split via Pix à sua conta bancária',
    channel: 'WHATSAPP',
    recipientType: 'PROPRIETARIO',
    subject: 'Repasse de Aluguel Liquidado - Imóvel {{CODIGO_IMOVEL}}',
    bodyTemplate: `💰 *Repasse de Aluguel Efetuado no Pix!*

Prezado(a) *{{NOME_CLIENTE}}*,
O repasse referente ao aluguel deste mês do imóvel *{{CODIGO_IMOVEL}} ({{ENDERECO_IMOVEL}})* foi liquidado com sucesso na sua conta cadastrada:

• Aluguel Bruto: {{VALOR_ALUGUEL}}
• (-) Taxa de Administração ({{TAXA_ADMINISTRACAO}})
• *Valor Líquido Depositado via Pix: {{VALOR_REPASSE_LIQUIDO}}*

O extrato analítico da locação e o comprovante bancário já estão disponíveis na sua Área do Proprietário:
👉 {{LINK_PORTAL}}

Atenciosamente,
Equipe Financeira {{NOME_IMOBILIARIA}} 🌟`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_aviso_reajuste',
    triggerKey: 'AVISO_REAJUSTE_ANUAL',
    category: 'LOCACAO',
    title: 'Alerta Antecipado de Reajuste Anual D-30 (IPCA / IGP-M)',
    description: 'Notificação formal com 30 dias de antecedência informando índice e novo valor',
    channel: 'EMAIL',
    recipientType: 'INQUILINO',
    subject: 'Notificação de Reajuste Anual de Locação - Imóvel {{CODIGO_IMOVEL}}',
    bodyTemplate: `Prezado(a) {{NOME_CLIENTE}},

Esperamos que este comunicado o encontre bem.

Informamos com transparência que, conforme estipulado na Cláusula de Reajuste do seu Contrato de Locação e nos termos da Lei nº 8.245/1991 e Lei nº 9.069/1995, seu contrato completará 12 meses de vigência no próximo mês.

Desta forma, passará a vigorar a correção monetária anual pelo índice oficial pactuado:
• Índice Aplicado: {{INDICE_REAJUSTE}}
• Valor do Aluguel Anterior: {{VALOR_ALUGUEL}}
• Novo Valor Reajustado: {{VALOR_TOTAL_COBRANCA}}
• Vigência a partir de: {{DATA_VENCIMENTO}}

Permanecemos à inteira disposição para qualquer esclarecimento por meio de nossa Central de Atendimento:
Telefone / WhatsApp: {{TELEFONE_CONTATO}}
Portal do Cliente: {{LINK_PORTAL}}

Cordialmente,
{{NOME_IMOBILIARIA}}`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_lembrete_renovacao',
    triggerKey: 'LEMBRETE_RENOVACAO_90D',
    category: 'LOCACAO',
    title: 'Lembrete de Renovação Contratual D-90',
    description: 'Antecipa a renovação para garantir previsibilidade e evitar desocupações indesejadas',
    channel: 'WHATSAPP',
    recipientType: 'INQUILINO',
    subject: 'Renovação Antecipada do Contrato de Locação',
    bodyTemplate: `Olá, *{{NOME_CLIENTE}}*! Esperamos que esteja adorando sua moradia no imóvel *{{CODIGO_IMOVEL}}*! 🏡

Seu contrato de locação completará seu ciclo de vigência em *90 dias*.
Gostaríamos de antecipar a sua renovação simplificada para mais 30 meses, garantindo continuidade, tranquilidade e isenção total de taxas de aditamento.

Podemos preparar o aditivo contratual digital para assinatura com 1 clique?
Responda a esta mensagem ou fale com nosso setor de locações: {{TELEFONE_CONTATO}}

_{{NOME_IMOBILIARIA}}_`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_notificacao_mora',
    triggerKey: 'NOTIFICACAO_MORA_D10',
    category: 'JURIDICO',
    title: 'Notificação Extrajudicial de Mora D+10 (Art. 582 CC & Lei 8.245)',
    description: 'Aviso formal extrajudicial com memória de cálculo de multa e juros conforme a lei',
    channel: 'EMAIL',
    recipientType: 'INQUILINO',
    subject: 'NOTIFICAÇÃO EXTRAJUDICIAL DE MORA - Imóvel {{CODIGO_IMOVEL}}',
    bodyTemplate: `NOTIFICAÇÃO EXTRAJUDICIAL DE MORA E COBRANÇA

Ao(À) Locatário(a): {{NOME_CLIENTE}}
Imóvel Objeto: {{CODIGO_IMOVEL}} - {{ENDERECO_IMOVEL}}

Prezado(a) Senhor(a),

Constatamos em nossos registros contábeis que, até a presente data, não foi acusado o pagamento das obrigações locatícias vencidas em {{DATA_VENCIMENTO}}, no montante principal de {{VALOR_ALUGUEL}}.

Conforme disposto no Artigo 23, inciso I da Lei nº 8.245/1991 (Lei do Inquilinato) e na Cláusula Penal Moratória pactuada (Artigos 408 e 412 do Código Civil), sobre o valor em atraso incidem:
• Multa moratória regulamentar de 10% (dez por cento);
• Juros de mora de 1% (um por cento) ao mês;
• Correção monetária diária.

Solicitamos a quitação imediata da pendência através da chave Pix abaixo ou pelo portal:
Chave Pix: {{CHAVE_PIX}}
Área do Cliente: {{LINK_PORTAL}}

O não atendimento desta notificação no prazo legal poderá ensejar o encaminhamento do título a protesto em cartório e a propositura da respectiva Ação de Despejo por Falta de Pagamento cumulada com Cobrança de Aluguéis (Artigo 59, § 1º, IX da Lei nº 8.245/1991).

Atenciosamente,
Departamento Jurídico e de Cobrança
{{NOME_IMOBILIARIA}} - Contato: {{TELEFONE_CONTATO}}`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_agendamento_vistoria',
    triggerKey: 'AGENDAMENTO_VISTORIA',
    category: 'LOCACAO',
    title: 'Aviso de Vistoria do Imóvel (Art. 22, V e Art. 23, IX da Lei 8.245)',
    description: 'Agendamento prévio com data e hora conforme exigido pela Lei do Inquilinato',
    channel: 'WHATSAPP',
    recipientType: 'INQUILINO',
    subject: 'Agendamento de Vistoria de Imóvel',
    bodyTemplate: `Olá, *{{NOME_CLIENTE}}*! 📋

Conforme previsto no Art. 23, inciso IX da Lei do Inquilinato, entramos em contato para agendar a realização da vistoria periódica no imóvel *{{CODIGO_IMOVEL}}* ({{ENDERECO_IMOVEL}}).

Nosso vistoriador credenciado comparecerá para conferência preventiva de conservação e registro fotográfico.

Por favor, confirme se a data sugerida ({{DATA_VENCIMENTO}}) é conveniente para você ou nos informe a melhor data e horário alternativo respondendo a esta mensagem.

Agradecemos a colaboração!
_{{NOME_IMOBILIARIA}}_ - {{TELEFONE_CONTATO}}`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_aviso_d0',
    triggerKey: 'AVISO_VENCIMENTO_D0',
    category: 'LOCACAO',
    title: 'Aviso de Vencimento D-0 (Dia do Vencimento com Pix Sem Taxas)',
    description: 'Enviado às 08h da manhã no dia em que o aluguel vence para incentivar pagamento pontual',
    channel: 'WHATSAPP',
    recipientType: 'INQUILINO',
    subject: 'Hoje vence o aluguel do seu imóvel {{CODIGO_IMOVEL}}',
    bodyTemplate: `Bom dia, *{{NOME_CLIENTE}}*! ⏰
Lembramos amigavelmente que o aluguel do seu imóvel (*{{CODIGO_IMOVEL}}*) vence *HOJE ({{DATA_VENCIMENTO}})*.

• Valor Líquido com Desconto de Pontualidade: *{{VALOR_ALUGUEL}}*

Pague em 1 clique sem juros ou filas pelo Pix Copia e Cola:
\`{{CHAVE_PIX}}\`

Ou visualize seu boleto registrado no portal:
👉 {{LINK_PORTAL}}

Tenha um excelente dia!
_{{NOME_IMOBILIARIA}}_`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_atraso_d3',
    triggerKey: 'AVISO_ATRASO_D3',
    category: 'LOCACAO',
    title: 'Lembrete Amigável de Atraso D+3 (Segunda Via e Reemissão)',
    description: 'Aviso preventivo enviado 3 dias após o vencimento antes de gerar encargos cartorários',
    channel: 'WHATSAPP',
    recipientType: 'INQUILINO',
    subject: 'Segunda via atualizada do aluguel - Imóvel {{CODIGO_IMOVEL}}',
    bodyTemplate: `Olá, *{{NOME_CLIENTE}}*! Tudo bem?

Constatamos em nosso sistema que o aluguel vencido em *{{DATA_VENCIMENTO}}* referente ao imóvel *{{CODIGO_IMOVEL}}* ainda não consta como liquidado.

Sabemos que imprevistos acontecem! Caso já tenha efetuado o pagamento, por favor desconsidere este aviso ou nos envie o comprovante.

Para regularizar com facilidade, gere sua 2ª via atualizada pelo link:
👉 {{LINK_PORTAL}}

Chave Pix para quitação:
\`{{CHAVE_PIX}}\`

Equipe de Atendimento {{NOME_IMOBILIARIA}} - Telefone: {{TELEFONE_CONTATO}}`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl_msg_comunicado_condominio',
    triggerKey: 'COMUNICADO_CONDOMINIO',
    category: 'LOCACAO',
    title: 'Comunicado de Despesas Condominiais & Fundo de Reserva (Lei 8.245)',
    description: 'Discriminação de despesas ordinárias do inquilino e extraordinárias do proprietário',
    channel: 'EMAIL',
    recipientType: 'INQUILINO',
    subject: 'Demonstrativo de Lançamentos de Condomínio - Imóvel {{CODIGO_IMOVEL}}',
    bodyTemplate: `Prezado(a) {{NOME_CLIENTE}},

Encaminhamos para sua conferência o demonstrativo das cotas condominiais referente ao imóvel {{CODIGO_IMOVEL}} ({{ENDERECO_IMOVEL}}).

Conforme estabelecido pela Lei do Inquilinato (Lei nº 8.245/1991):
• As despesas ORDINÁRIAS (consumo, funcionários, limpeza) constam no seu boleto de aluguel mensal.
• As despesas EXTRAORDINÁRIAS (fundo de reserva, reformas estruturais do edifício) foram integralmente direcionadas ao Proprietário (Art. 22, X).

O espelho completo com o boleto da administradora está disponível em:
{{LINK_PORTAL}}

Permanecemos à disposição: {{TELEFONE_CONTATO}}
{{NOME_IMOBILIARIA}}`,
    availableVariables: COMMON_TEMPLATE_VARIABLES,
    isActive: true,
    version: '1.0',
    updatedAt: new Date().toISOString()
  }
];

export function renderTemplateText(templateText: string, variables: Record<string, string>): string {
  let result = templateText;
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.split(placeholder).join(value || '');
  });
  return result;
}

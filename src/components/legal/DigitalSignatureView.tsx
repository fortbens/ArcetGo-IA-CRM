import React, { useState } from 'react';
import { 
  FileSignature, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Users, 
  FileText, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Mail, 
  QrCode, 
  RotateCw, 
  ChevronRight,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { 
  DigitalDocumentEnvelope, 
  DocumentSigner, 
  SignatureProviderId, 
  SIGNATURE_PROVIDERS, 
  DocumentType, 
  AuthMethod, 
  SignerRole 
} from '../../types/digitalSignature';
import { INITIAL_DIGITAL_ENVELOPES } from '../../data/mockDigitalSignatureData';

export const DigitalSignatureView: React.FC = () => {
  const [envelopes, setEnvelopes] = useState<DigitalDocumentEnvelope[]>(INITIAL_DIGITAL_ENVELOPES);
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Selected envelope for drawer
  const [selectedEnvelope, setSelectedEnvelope] = useState<DigitalDocumentEnvelope | null>(null);
  const [copiedLinkSignerId, setCopiedLinkSignerId] = useState<string | null>(null);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // New Document Envelope Modal
  const [isNewEnvelopeOpen, setIsNewEnvelopeOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  // New Envelope Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDocType, setNewDocType] = useState<DocumentType>('PROMESSA_COMPRA_VENDA');
  const [newProvider, setNewProvider] = useState<SignatureProviderId>('clicksign');
  const [newClientName, setNewClientName] = useState('');
  const [newPropertyCode, setNewPropertyCode] = useState('AP-');
  const [newSigners, setNewSigners] = useState<DocumentSigner[]>([
    {
      id: 'sig_temp_1',
      name: '',
      email: '',
      phone: '',
      cpf: '',
      role: 'COMPRADOR',
      authMethod: 'WHATSAPP_TOKEN',
      status: 'PENDENTE'
    },
    {
      id: 'sig_temp_2',
      name: '',
      email: '',
      phone: '',
      cpf: '',
      role: 'VENDEDOR',
      authMethod: 'WHATSAPP_TOKEN',
      status: 'PENDENTE'
    }
  ]);

  // KPIs
  const totalEnvelopes = envelopes.length;
  const activeEnvelopes = envelopes.filter(e => e.status === 'AGUARDANDO_ASSINATURAS' || e.status === 'ENVIADO').length;
  const completedEnvelopes = envelopes.filter(e => e.status === 'CONCLUIDO').length;
  const totalSignaturesCollected = envelopes.reduce((acc, e) => acc + e.signers.filter(s => s.status === 'ASSINADO').length, 0);

  // Filtered
  const filteredEnvelopes = envelopes.filter(e => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.envelopeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.clientOrDealName && e.clientOrDealName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.signers.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProvider = providerFilter === 'ALL' || e.provider === providerFilter;
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

    return matchesSearch && matchesProvider && matchesStatus;
  });

  const handleCopyDirectLink = (signer: DocumentSigner) => {
    const directUrl = `https://assinatura.acertgo.com.br/sign/${signer.id}?auth=token_temp_9921`;
    navigator.clipboard?.writeText(directUrl);
    setCopiedLinkSignerId(signer.id);
    setTimeout(() => setCopiedLinkSignerId(null), 2000);
  };

  const handleSendReminder = (signer: DocumentSigner) => {
    setActionSuccessToast(`Lembrete de assinatura reenviado com sucesso para ${signer.name} via ${signer.authMethod.replace('_', ' ')}!`);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  const handleAddSignerField = () => {
    setNewSigners(prev => [
      ...prev,
      {
        id: `sig_temp_${Date.now()}`,
        name: '',
        email: '',
        phone: '',
        cpf: '',
        role: 'TESTEMUNHA',
        authMethod: 'WHATSAPP_TOKEN',
        status: 'PENDENTE'
      }
    ]);
  };

  const handleRemoveSignerField = (id: string) => {
    if (newSigners.length <= 1) return;
    setNewSigners(prev => prev.filter(s => s.id !== id));
  };

  const handleCreateEnvelope = () => {
    if (!newTitle.trim()) {
      alert('Preencha o título do documento.');
      return;
    }
    const validSigners = newSigners.filter(s => s.name.trim() !== '');
    if (validSigners.length === 0) {
      alert('Cadastre pelo menos 1 signatário com nome preenchido.');
      return;
    }

    setIsSubmittingApi(true);
    setTimeout(() => {
      setIsSubmittingApi(false);
      const created: DigitalDocumentEnvelope = {
        id: `env_${Date.now()}`,
        envelopeCode: `DOC-${newProvider.toUpperCase().substring(0, 4)}-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        title: newTitle,
        documentType: newDocType,
        provider: newProvider,
        propertyCode: newPropertyCode,
        clientOrDealName: newClientName || validSigners[0]?.name,
        status: 'AGUARDANDO_ASSINATURAS',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        pdfPagesCount: 14,
        pdfFileSize: '2.1 MB',
        signers: validSigners,
        auditTrail: [
          {
            timestamp: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
            action: 'Envelope Criado e Enviado via API',
            details: `Documento disparado pelo gateway ${newProvider.toUpperCase()} para ${validSigners.length} signatários`
          }
        ]
      };

      setEnvelopes(prev => [created, ...prev]);
      setIsNewEnvelopeOpen(false);
      setActionSuccessToast(`Documento enviado com sucesso para ${validSigners.length} signatários via API ${newProvider.toUpperCase()}!`);
      setTimeout(() => setActionSuccessToast(null), 4000);

      // Reset form
      setNewTitle('');
      setNewClientName('');
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Central de Assinatura Digital (APIs) ✍️
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-800 rounded-full border border-blue-200">
              6 Empresas Homologadas
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Envio automatizado de contratos de compra e venda, locação, opções e vistorias via Clicksign, D4Sign, ZapSign, DocuSign e mais
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsApiSettingsOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Key className="w-4 h-4 text-slate-500" />
            <span>Configurar Tokens das APIs</span>
          </button>

          <button
            onClick={() => setIsNewEnvelopeOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Envio de Documento</span>
          </button>
        </div>
      </div>

      {/* Action Toast */}
      {actionSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccessToast}</span>
          </div>
          <button onClick={() => setActionSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Envelopes Enviados</span>
            <FileSignature className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalEnvelopes}</div>
          <div className="text-[11px] text-slate-400">Contratos imobiliários em trâmite</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Aguardando Assinaturas</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">{activeEnvelopes}</div>
          <div className="text-[11px] text-slate-400">Lembretes automáticos via WhatsApp</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Totalmente Concluídos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{completedEnvelopes}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Com Carimbo do Tempo ICP-Brasil</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Assinaturas Coletadas</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 font-mono">{totalSignaturesCollected}</div>
          <div className="text-[11px] text-slate-400">Tempo médio de assinatura: 3.8h</div>
        </div>
      </div>

      {/* Provider Cards Carousel */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Provedores de Assinatura Eletrônica & Qualificada Conectados
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SIGNATURE_PROVIDERS.map(p => (
            <div 
              key={p.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                p.isConfigured 
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs' 
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${p.logoColor} text-white flex items-center justify-center font-bold text-[11px] shadow-xs`}>
                  {p.name.substring(0, 2).toUpperCase()}
                </div>
                <span className={`w-2 h-2 rounded-full ${p.isConfigured ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <div className="font-bold text-xs text-slate-900 truncate">{p.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{p.badge}</div>
              <div className="mt-2 text-[10px] text-slate-400">
                {p.monthlyQuota.used} / {p.monthlyQuota.total} envelopes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar documento, signatário ou código..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={providerFilter}
            onChange={e => setProviderFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="ALL">Todas as Empresas (APIs)</option>
            <option value="clicksign">Clicksign</option>
            <option value="d4sign">D4Sign</option>
            <option value="zapsign">ZapSign</option>
            <option value="docusign">DocuSign</option>
            <option value="certisign">CertiSign</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="ALL">Todos os Status</option>
            <option value="AGUARDANDO_ASSINATURAS">Aguardando Assinaturas</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="ENVIADO">Enviado</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Exibindo <strong>{filteredEnvelopes.length}</strong> envelopes
        </div>
      </div>

      {/* Envelopes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Documento & Código</th>
                <th className="p-3.5">Empresa API</th>
                <th className="p-3.5">Tipo de Contrato</th>
                <th className="p-3.5">Signatários & Progresso</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Data de Envio</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEnvelopes.map(envelope => {
                const totalSigs = envelope.signers.length;
                const signedCount = envelope.signers.filter(s => s.status === 'ASSINADO').length;
                const percentDone = Math.round((signedCount / totalSigs) * 100);

                return (
                  <tr key={envelope.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 truncate max-w-xs" title={envelope.title}>
                        {envelope.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {envelope.envelopeCode} {envelope.clientOrDealName ? `· ${envelope.clientOrDealName}` : ''}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide bg-slate-100 text-slate-800 border border-slate-200">
                        {envelope.provider}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-600 font-medium text-[11px]">
                        {envelope.documentType.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1 max-w-[200px]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-800">{signedCount} de {totalSigs} assinaram</span>
                          <span className="text-slate-400 font-mono">{percentDone}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              percentDone === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${percentDone}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        envelope.status === 'CONCLUIDO' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        envelope.status === 'AGUARDANDO_ASSINATURAS' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {envelope.status === 'CONCLUIDO' ? 'Concluído' :
                         envelope.status === 'AGUARDANDO_ASSINATURAS' ? 'Em Andamento' : envelope.status}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {new Date(envelope.createdAt).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedEnvelope(envelope)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Signatários</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer / Modal for Selected Envelope Details */}
      {selectedEnvelope && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-3xl border border-slate-200 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedEnvelope.envelopeCode}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                    API {selectedEnvelope.provider}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading mt-1">
                  {selectedEnvelope.title}
                </h3>
              </div>
              <button onClick={() => setSelectedEnvelope(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Signers List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Signatários e Métodos de Autenticação
              </h4>
              <div className="space-y-2">
                {selectedEnvelope.signers.map(s => {
                  const isCopied = copiedLinkSignerId === s.id;
                  return (
                    <div 
                      key={s.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{s.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            {s.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap gap-2">
                          <span>{s.phone}</span>
                          <span>·</span>
                          <span>{s.email}</span>
                          <span>·</span>
                          <span className="font-medium text-indigo-700">Autenticação: {s.authMethod.replace(/_/g, ' ')}</span>
                        </div>
                        {s.signedAt && (
                          <div className="text-[10px] text-emerald-600 font-medium">
                            ✓ Assinado em {new Date(s.signedAt).toLocaleDateString('pt-BR')} às {new Date(s.signedAt).toLocaleTimeString('pt-BR')} {s.ipAddress ? `(IP: ${s.ipAddress})` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          s.status === 'ASSINADO' ? 'bg-emerald-100 text-emerald-800' :
                          s.status === 'VISUALIZADO' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {s.status === 'ASSINADO' ? 'Assinado' :
                           s.status === 'VISUALIZADO' ? 'Visualizado' : 'Pendente'}
                        </span>

                        {s.status !== 'ASSINADO' && (
                          <>
                            <button
                              onClick={() => handleCopyDirectLink(s)}
                              className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 text-xs font-semibold"
                              title="Copiar link direto de assinatura para enviar no WhatsApp"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => handleSendReminder(s)}
                              className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Lembrete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Trail */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Trilha de Auditoria & Validade Jurídica
              </h4>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {selectedEnvelope.auditTrail.map((log, idx) => (
                  <div key={idx} className="text-[11px] text-slate-600 flex items-start gap-2 py-1">
                    <span className="font-mono text-slate-400 shrink-0">{log.timestamp}</span>
                    <span className="font-semibold text-slate-800 shrink-0">{log.action}:</span>
                    <span className="text-slate-500">{log.details}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Documento com valor jurídico pleno (Medida Provisória 2.200-2/2001)</span>
              </div>
              <button 
                onClick={() => {
                  alert('Baixando PDF assinado com Certificado de Conformidade...');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Baixar PDF Assinado + Certificado</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Envelope Via API */}
      {isNewEnvelopeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-3xl border border-slate-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Novo Envio de Documento para Assinatura via API
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispare contratos com múltiplos signatários e validação por WhatsApp, SMS ou ICP-Brasil
                  </p>
                </div>
              </div>
              <button onClick={() => setIsNewEnvelopeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Select Provider */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Selecione a Empresa / API de Assinatura</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SIGNATURE_PROVIDERS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setNewProvider(p.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        newProvider === p.id 
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/10' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${p.logoColor} text-white flex items-center justify-center font-bold text-[10px]`}>
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{p.badge}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Document Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Título do Documento</label>
                  <input 
                    type="text"
                    placeholder="Ex: Contrato de Promessa de Compra e Venda - Apto 142 Horizon"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tipo de Contrato</label>
                  <select
                    value={newDocType}
                    onChange={e => setNewDocType(e.target.value as DocumentType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="PROMESSA_COMPRA_VENDA">Promessa de Compra e Venda</option>
                    <option value="CONTRATO_LOCACAO">Contrato de Locação Residencial / Comercial</option>
                    <option value="OPCAO_VENDA_EXCLUSIVIDADE">Opção de Venda com Exclusividade</option>
                    <option value="FICHA_VISITA_DIGITAL">Ficha de Visita com Reconhecimento</option>
                    <option value="TERMO_VISTORIA_CHAVES">Termo de Vistoria e Chaves</option>
                    <option value="ADITIVO_CONTRATUAL">Aditivo Contratual</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Código do Imóvel / Negócio</label>
                  <input 
                    type="text"
                    placeholder="Ex: AP-9021"
                    value={newPropertyCode}
                    onChange={e => setNewPropertyCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Signers list builder */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Signatários do Envelope</label>
                  <button
                    type="button"
                    onClick={handleAddSignerField}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Signatário</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {newSigners.map((s, idx) => (
                    <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Signatário #{idx + 1}</span>
                        {newSigners.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSignerField(s.id)}
                            className="text-slate-400 hover:text-rose-600 text-xs font-semibold"
                          >
                            Remover
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Nome Completo</label>
                          <input 
                            type="text"
                            placeholder="Nome"
                            value={s.name}
                            onChange={e => {
                              const val = e.target.value;
                              setNewSigners(prev => prev.map(item => item.id === s.id ? { ...item, name: val } : item));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">WhatsApp / Celular</label>
                          <input 
                            type="text"
                            placeholder="(11) 99999-9999"
                            value={s.phone}
                            onChange={e => {
                              const val = e.target.value;
                              setNewSigners(prev => prev.map(item => item.id === s.id ? { ...item, phone: val } : item));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Papel no Contrato</label>
                          <select
                            value={s.role}
                            onChange={e => {
                              const val = e.target.value as SignerRole;
                              setNewSigners(prev => prev.map(item => item.id === s.id ? { ...item, role: val } : item));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          >
                            <option value="COMPRADOR">Comprador</option>
                            <option value="VENDEDOR">Vendedor</option>
                            <option value="LOCATARIO">Locatário</option>
                            <option value="LOCADOR">Locador</option>
                            <option value="FIADOR">Fiador</option>
                            <option value="CORRETOR">Corretor</option>
                            <option value="TESTEMUNHA">Testemunha</option>
                            <option value="DIRETOR_IMOBILIARIA">Diretor Imobiliária</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Método de Autenticação</label>
                          <select
                            value={s.authMethod}
                            onChange={e => {
                              const val = e.target.value as AuthMethod;
                              setNewSigners(prev => prev.map(item => item.id === s.id ? { ...item, authMethod: val } : item));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          >
                            <option value="WHATSAPP_TOKEN">WhatsApp Token</option>
                            <option value="SMS_TOKEN">SMS Token</option>
                            <option value="EMAIL_LINK">Link por E-mail</option>
                            <option value="SELFIE_COM_DOCUMENTO">Selfie com Documento</option>
                            <option value="CERTIFICADO_ICP_BRASIL">Certificado ICP-Brasil</option>
                            <option value="PIX_TITULARIDADE">Pix R$ 0,01 Titularidade</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsNewEnvelopeOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleCreateEnvelope}
                disabled={isSubmittingApi}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Send className={`w-3.5 h-3.5 ${isSubmittingApi ? 'animate-spin' : ''}`} />
                <span>{isSubmittingApi ? 'Disparando via API...' : 'Disparar Envelopes via API'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: API Settings */}
      {isApiSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Chaves de API das Empresas de Assinatura
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tokens e endpoints de webhook para recepção instantânea de status de assinatura
                  </p>
                </div>
              </div>
              <button onClick={() => setIsApiSettingsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800">Clicksign API Token</span>
                <input 
                  type="password"
                  readOnly
                  value="cs_live_sec_8912389102839102381209381023"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800">D4Sign Safe Key & Crypt Key</span>
                <input 
                  type="password"
                  readOnly
                  value="d4s_crypt_live_88192837198273918237198"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800">ZapSign Token API</span>
                <input 
                  type="password"
                  readOnly
                  value="zapsign_api_token_live_3391028301928"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800">DocuSign Integration Key & RSA Secret</span>
                <input 
                  type="password"
                  readOnly
                  value="docusign_ik_99182371-9921-4412-8812-99182371"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsApiSettingsOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Fechar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

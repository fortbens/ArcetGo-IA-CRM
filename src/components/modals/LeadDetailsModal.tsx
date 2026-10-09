import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  User, 
  Building, 
  Tag, 
  Star, 
  Lock, 
  Trash2, 
  ExternalLink, 
  Check, 
  RotateCcw, 
  Video, 
  Mail, 
  Users, 
  FileText, 
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Radar,
  ShieldCheck,
  ShieldAlert,
  Download,
  Upload,
  Copy,
  Eye,
  Send,
  FileCheck2,
  Share2,
  LockKeyhole,
  Cake,
  HeartHandshake,
  UserCheck,
  Flame,
  Zap,
  Snowflake,
  RefreshCw,
  Target,
  Mic,
  MicOff,
  Radio,
  Volume2
} from 'lucide-react';
import { 
  Lead, 
  LeadProposer,
  LeadFunnelStage, 
  ClientFollowUp, 
  FollowUpChannel, 
  FollowUpPriority,
  LeadInteraction,
  RealEstateProperty,
  UserProfile,
  LeadCustodyDocument,
  UserRole
} from '../../types/crm';
import { LeadPropertyRadarModal } from '../leads/LeadPropertyRadarModal';
import { CustomerCustodyPortalModal } from './CustomerCustodyPortalModal';
import { FreeAiToolsHubModal } from '../ai/FreeAiToolsHubModal';
import { analyzeLeadScoringWithGemini } from '../../services/aiService';
import { calculateMinutesElapsed, formatSlaTime } from '../../hooks/useLeadSlaMonitor';

interface LeadDetailsModalProps {
  lead: Lead;
  isOpen: boolean;
  properties?: RealEstateProperty[];
  currentUser?: UserProfile;
  onClose: () => void;
  onChangeStage: (leadId: string, stage: LeadFunnelStage, lossReason?: string) => void;
  onAddFollowUp: (leadId: string, followUp: Omit<ClientFollowUp, 'id' | 'createdAt'>) => void;
  onCompleteFollowUp: (leadId: string, followUpId: string, outcomeNotes: string, nextFollowUp?: Omit<ClientFollowUp, 'id' | 'createdAt'>) => void;
  onDeleteFollowUp: (leadId: string, followUpId: string) => void;
  onRescheduleFollowUp: (leadId: string, followUpId: string, newDate: string, newTime?: string) => void;
  onAddTimelineNote: (leadId: string, note: { title: string; description: string; isPrivateWhisper?: boolean }) => void;
  onOpenWhatsAppDesk?: (lead: Lead) => void;
  onSelectPropertyForLead?: (leadId: string, property: RealEstateProperty) => void;
  onUpdateLead?: (leadId: string, updates: Partial<Lead>) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  isOpen,
  properties = [],
  currentUser,
  onClose,
  onChangeStage,
  onAddFollowUp,
  onCompleteFollowUp,
  onDeleteFollowUp,
  onRescheduleFollowUp,
  onAddTimelineNote,
  onOpenWhatsAppDesk,
  onSelectPropertyForLead,
  onUpdateLead,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'followup' | 'timeline' | 'intelligence' | 'interest' | 'info' | 'custodia'>(
    lead.stage === 'PROPOSTA_ENVIADA' ? 'custodia' : 'followup'
  );
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [isAnalyzingScore, setIsAnalyzingScore] = useState(false);
  const [copiedAiScript, setCopiedAiScript] = useState(false);

  const handleRecalculateScore = async () => {
    setIsAnalyzingScore(true);
    try {
      const scoring = await analyzeLeadScoringWithGemini(lead);
      if (onUpdateLead) {
        onUpdateLead(lead.id, { aiScoring: scoring });
      }
    } catch (e) {
      console.warn('Erro ao recalcular scoring:', e);
    } finally {
      setIsAnalyzingScore(false);
    }
  };

  // Custody Documents State
  const [custodyDocs, setCustodyDocs] = useState<LeadCustodyDocument[]>([
    {
      id: 'doc_rg_cnh',
      category: 'DOCUMENTO_IDENTIDADE',
      title: 'RG ou CNH do Comprador',
      description: 'Documento oficial com foto, CPF, filiação e emissão visíveis',
      required: true,
      status: 'APROVADO',
      fileName: `cnh_${lead.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '2.4 MB',
      uploadedAt: '24/09/2026 às 10:15',
      reviewedBy: 'Mariana Costa (Gerente)',
      reviewedAt: '24/09/2026 às 11:30',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'doc_cpf',
      category: 'CPF_SITUACAO',
      title: 'Comprovante de Regularidade Fiscal CPF',
      description: 'Certidão emitida no portal da Receita Federal (Situação Regular)',
      required: true,
      status: 'APROVADO',
      fileName: 'comprovante_situacao_cpf.pdf',
      fileSize: '412 KB',
      uploadedAt: '24/09/2026 às 10:16',
      reviewedBy: 'Mariana Costa (Gerente)',
      reviewedAt: '24/09/2026 às 11:31',
      sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    {
      id: 'doc_residencia',
      category: 'COMPROVANTE_RESIDENCIA',
      title: 'Comprovante de Residência Atualizado',
      description: 'Conta de consumo (luz, água ou gás) dos últimos 90 dias',
      required: true,
      status: 'EM_ANALISE',
      fileName: 'fatura_enel_setembro_2026.pdf',
      fileSize: '1.8 MB',
      uploadedAt: 'Hoje às 08:42',
      sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    },
    {
      id: 'doc_estado_civil',
      category: 'ESTADO_CIVIL',
      title: 'Certidão de Estado Civil (Casamento / Nascimento)',
      description: 'Se casado, certidão com averbação ou pacto antenupcial',
      required: true,
      status: 'PENDENTE'
    },
    {
      id: 'doc_renda',
      category: 'COMPROVANTE_RENDA',
      title: 'Comprovação de Renda (3 Holerites ou 6 Extratos Bancários)',
      description: 'Comprovantes de rendimento recente para análise de crédito',
      required: true,
      status: 'PENDENTE'
    },
    {
      id: 'doc_irpf',
      category: 'IRPF_DECLARACAO',
      title: 'Declaração e Recibo de Entrega do IRPF',
      description: 'Declaração completa com recibo de entrega da Receita Federal',
      required: true,
      status: 'PENDENTE'
    }
  ]);

  const [copiedCustodyLinkToast, setCopiedCustodyLinkToast] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<LeadCustodyDocument | null>(null);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [simulatedRoleOverride, setSimulatedRoleOverride] = useState<UserRole | null>(null);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [isAiAuditModalOpen, setIsAiAuditModalOpen] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const custodyFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleRealCustodyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingDocId) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const sizeStr = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`;

        setCustodyDocs(prev => prev.map(d => {
          if (d.id === uploadingDocId) {
            return {
              ...d,
              status: 'EM_ANALISE',
              fileName: file.name,
              fileSize: sizeStr,
              fileUrl: dataUrl,
              uploadedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sha256Hash: hashHex
            };
          }
          return d;
        }));
        setUploadingDocId(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Erro ao processar anexo de custódia:', err);
      setUploadingDocId(null);
    }
  };

  // SDR Qualification & Civil Data State (CPF, RG, Estado Civil, Data de Nascimento, Envio de Aniversário)
  const [sdrCpf, setSdrCpf] = useState(lead.cpf || '');
  const [sdrRg, setSdrRg] = useState(lead.rg || '');
  const [sdrMaritalStatus, setSdrMaritalStatus] = useState<any>(lead.maritalStatus || 'SOLTEIRO');
  const [sdrBirthDate, setSdrBirthDate] = useState(lead.birthDate || '');
  const [sdrQualified, setSdrQualified] = useState(lead.sdrQualified || false);
  const [sendBirthdayWishes, setSendBirthdayWishes] = useState(lead.sendBirthdayWishes !== false);
  const [sdrSavedToast, setSdrSavedToast] = useState(false);

  const handleSaveSdrQualification = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updates: Partial<Lead> = {
      cpf: sdrCpf.trim(),
      rg: sdrRg.trim(),
      maritalStatus: sdrMaritalStatus,
      birthDate: sdrBirthDate,
      sdrQualified: true,
      sendBirthdayWishes,
    };
    if (onUpdateLead) {
      onUpdateLead(lead.id, updates);
    }
    setSdrQualified(true);
    setSdrSavedToast(true);
    onAddTimelineNote(lead.id, {
      title: 'Qualificação SDR & Dados Civis Atualizados',
      description: `CPF: ${sdrCpf || 'Salvo'}, RG: ${sdrRg || 'Salvo'}, Estado Civil: ${sdrMaritalStatus}, Nasc: ${sdrBirthDate || 'Salva'}. Envio de felicitações ativado.`
    });
    setTimeout(() => setSdrSavedToast(false), 3000);
  };

  const handleSendBirthdayGreeting = () => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const primeNome = lead.name.split(' ')[0];
    const msg = encodeURIComponent(
      `🎂 Olá ${primeNome}! Passando para desejar a você um Feliz Aniversário! 🎉 Que este novo ano traga muitas alegrias, prosperidade e conquistas. Conte sempre com toda a nossa equipe!`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleSendDealClosingGreeting = () => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const primeNome = lead.name.split(' ')[0];
    const msg = encodeURIComponent(
      `🤝 Parabéns pelo fechamento do negócio, ${primeNome}! 🥂 É uma honra fazer parte desta grande conquista da sua vida. Estamos sempre à disposição para o que você precisar!`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  // Proponents State (up to 4 proposers for contract emission)
  const [proposers, setProposers] = useState<LeadProposer[]>(lead.proposers || []);
  const [isAddingProposer, setIsAddingProposer] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropRelationship, setNewPropRelationship] = useState<LeadProposer['relationship']>('CONJUGE');
  const [newPropCpf, setNewPropCpf] = useState('');
  const [newPropRg, setNewPropRg] = useState('');
  const [newPropEmail, setNewPropEmail] = useState('');
  const [newPropPhone, setNewPropPhone] = useState('');
  const [newPropProfession, setNewPropProfession] = useState('');
  const [proposersToast, setProposersToast] = useState<string | null>(null);

  // Broker Lock / Anti-repasse State
  const [brokerLockPeriodDays, setBrokerLockPeriodDays] = useState<number>(lead.brokerLockPeriodDays || 30);
  const [brokerLockedUntil, setBrokerLockedUntil] = useState<string>(lead.brokerLockedUntil || '');
  const [brokerLockToast, setBrokerLockToast] = useState<string | null>(null);

  const handleAddProposer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPropName.trim()) {
      alert('Informe o nome do proponente.');
      return;
    }
    if (proposers.length >= 4) {
      alert('Limite máximo de 4 proponentes atingido.');
      return;
    }

    const created: LeadProposer = {
      id: `prop_${Date.now()}`,
      name: newPropName.trim(),
      relationship: newPropRelationship,
      cpf: newPropCpf.trim() || undefined,
      rg: newPropRg.trim() || undefined,
      email: newPropEmail.trim() || undefined,
      phone: newPropPhone.trim() || undefined,
      profession: newPropProfession.trim() || undefined
    };

    const updated = [...proposers, created];
    setProposers(updated);
    if (onUpdateLead) {
      onUpdateLead(lead.id, { proposers: updated });
    }
    onAddTimelineNote(lead.id, {
      title: 'Novo Proponente Adicionado à Proposta',
      description: `${created.name} (${created.relationship}) adicionado para emissão contratual.`
    });

    // Reset form
    setNewPropName('');
    setNewPropCpf('');
    setNewPropRg('');
    setNewPropEmail('');
    setNewPropPhone('');
    setNewPropProfession('');
    setIsAddingProposer(false);
    setProposersToast('Proponente adicionado!');
    setTimeout(() => setProposersToast(null), 2500);
  };

  const handleRemoveProposer = (id: string, name: string) => {
    if (!confirm(`Remover o proponente ${name}?`)) return;
    const updated = proposers.filter(p => p.id !== id);
    setProposers(updated);
    if (onUpdateLead) {
      onUpdateLead(lead.id, { proposers: updated });
    }
    onAddTimelineNote(lead.id, {
      title: 'Proponente Removido',
      description: `${name} removido da lista de proponentes contratuais.`
    });
    setProposersToast('Proponente removido.');
    setTimeout(() => setProposersToast(null), 2500);
  };

  const handleSaveBrokerLock = () => {
    const lockDate = new Date();
    lockDate.setDate(lockDate.getDate() + brokerLockPeriodDays);
    const dateStr = lockDate.toISOString();
    setBrokerLockedUntil(dateStr);

    if (onUpdateLead) {
      onUpdateLead(lead.id, {
        brokerLockedUntil: dateStr,
        brokerLockPeriodDays
      });
    }

    onAddTimelineNote(lead.id, {
      title: 'Blindagem Anti-Repasse de Corretor Atualizada',
      description: `Lead protegido com exclusividade para o corretor ${lead.assignedBrokerName} por ${brokerLockPeriodDays} dias (até ${new Date(dateStr).toLocaleDateString('pt-BR')}).`
    });

    setBrokerLockToast('Blindagem atualizada!');
    setTimeout(() => setBrokerLockToast(null), 3000);
  };

  // Validação dos Proponentes para Emissão de Contrato (até 4 proponentes)
  const proposersValidation = useMemo(() => {
    const list = proposers.length > 0 
      ? proposers 
      : [{
          id: 'prop_titular_local',
          name: lead.name,
          relationship: 'TITULAR' as const,
          cpf: sdrCpf || lead.cpf || '',
          phone: lead.phone,
          email: lead.email
        }];

    const errors: Array<{ name: string; role: string; issues: string[] }> = [];

    list.slice(0, 4).forEach((p, idx) => {
      const roleLabel = 
        p.relationship === 'TITULAR' ? 'Titular' :
        p.relationship === 'CONJUGE' ? 'Cônjuge' :
        p.relationship === 'SEGUNDO_COMPRADOR' ? '2º Comprador' :
        p.relationship === 'AVALISTA_FIADOR' ? 'Avalista/Fiador' :
        p.relationship === 'SOCIO' ? 'Sócio' : 'Outro Proponente';

      const nameTrimmed = (p.name || '').trim();
      const nameParts = nameTrimmed.split(/\s+/).filter(Boolean);
      const isNameComplete = nameParts.length >= 2 && nameTrimmed.length >= 3;

      const cleanCpf = (p.cpf || '').replace(/\D/g, '');
      const isCpfValid = cleanCpf.length === 11;

      const issues: string[] = [];
      if (!isNameComplete) issues.push('Nome incompleto (informe Nome e Sobrenome)');
      if (!isCpfValid) issues.push(cleanCpf.length === 0 ? 'CPF não informado' : `CPF incompleto (${cleanCpf.length}/11 dígitos)`);

      if (issues.length > 0) {
        errors.push({
          name: nameTrimmed || `Proponente #${idx + 1}`,
          role: roleLabel,
          issues
        });
      }
    });

    return {
      canEmitContract: errors.length === 0,
      errors
    };
  }, [proposers, lead.name, lead.cpf, lead.phone, lead.email, sdrCpf]);

  const [contractEmitToast, setContractEmitToast] = useState<string | null>(null);

  const handleEmitContract = () => {
    if (!proposersValidation.canEmitContract) {
      alert(
        `Atenção: A emissão do contrato está temporariamente bloqueada.\n\n` +
        proposersValidation.errors.map(e => `• ${e.role} (${e.name}): ${e.issues.join(', ')}`).join('\n') +
        `\n\nPor favor, complete os campos acima antes de emitir a minuta contratual.`
      );
      return;
    }

    const docNumber = `CTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    onAddTimelineNote(lead.id, {
      title: 'Minuta de Contrato Emitida',
      description: `Minuta ${docNumber} gerada com sucesso para ${lead.name} e ${proposers.length} proponente(s). Dados civis e CPFs validados com segurança jurídica.`
    });
    if (onUpdateLead) {
      onUpdateLead(lead.id, {
        canEmitContract: true,
        contractBlockReasons: undefined
      });
    }
    setContractEmitToast(`Minuta ${docNumber} emitida com sucesso!`);
    setTimeout(() => setContractEmitToast(null), 3500);
  };

  // Follow-up Form state
  const [showNewFollowUpForm, setShowNewFollowUpForm] = useState(false);
  const [channel, setChannel] = useState<FollowUpChannel>('WHATSAPP');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<FollowUpPriority>('MEDIA');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('14:30');
  const [notes, setNotes] = useState('');

  // Complete Follow-up Modal state
  const [completingFollowUpId, setCompletingFollowUpId] = useState<string | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [scheduleNextPrompt, setScheduleNextPrompt] = useState(false);
  const [nextTitle, setNextTitle] = useState('');
  const [nextChannel, setNextChannel] = useState<FollowUpChannel>('WHATSAPP');
  const [nextDate, setNextDate] = useState('');
  const [nextTime, setNextTime] = useState('10:00');

  // New Timeline Note state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDescription, setNewNoteDescription] = useState('');
  const [isWhisper, setIsWhisper] = useState(false);

  // Web Speech API (Voice Recognition & Voice Commands) State
  const [isListening, setIsListening] = useState(false);
  const [speechInterim, setSpeechInterim] = useState('');
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [voiceTarget, setVoiceTarget] = useState<'timeline_note' | 'outcome_notes'>('timeline_note');
  const recognitionRef = useRef<any>(null);

  // Stop listening cleanly
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setSpeechInterim('');
  };

  // Start listening
  const startListening = (target: 'timeline_note' | 'outcome_notes' = 'timeline_note') => {
    setSpeechError(null);
    setSpeechFeedback(null);
    setVoiceTarget(target);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Seu navegador não possui suporte nativo à Web Speech API. Utilize Google Chrome ou Edge para ditar observações por voz.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechFeedback('Microfone conectado. Fale naturalmente ou use comandos de voz...');
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalizedText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalizedText += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }

        setSpeechInterim(interimText);

        if (finalizedText) {
          const textClean = finalizedText.trim();
          const lower = textClean.toLowerCase();

          if (target === 'outcome_notes') {
            setOutcomeNotes(prev => (prev ? `${prev} ${textClean}` : textClean));
            setSpeechFeedback('Observação do desfecho transcrita com sucesso.');
            return;
          }

          // Voice Command: Modo Fantasma / Sigiloso
          if (lower.includes('modo fantasma') || lower.includes('anotação sigilosa') || lower.includes('nota privada') || lower.includes('sigiloso')) {
            setIsWhisper(true);
            setSpeechFeedback('Comando de voz: Modo Fantasma (sigiloso) ATIVADO!');
            return;
          }

          if (lower.includes('desativar modo fantasma') || lower.includes('modo público') || lower.includes('anotação pública')) {
            setIsWhisper(false);
            setSpeechFeedback('Comando de voz: Modo Fantasma DESATIVADO.');
            return;
          }

          // Voice Command: Definir Título
          if (lower.startsWith('título ') || lower.startsWith('definir título ')) {
            const rawTitle = textClean.replace(/^(definir\s+)?título\s+/i, '').trim();
            const formatted = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
            setNewNoteTitle(formatted);
            setSpeechFeedback(`Título definido: "${formatted}"`);
            return;
          }

          // Voice Command: Limpar Texto
          if (lower.includes('limpar texto') || lower.includes('apagar anotação') || lower.includes('limpar tudo')) {
            setNewNoteDescription('');
            setSpeechInterim('');
            setSpeechFeedback('Texto apagado por comando de voz.');
            return;
          }

          // Voice Command: Salvar Anotação / Salvar na Timeline
          if (lower.includes('salvar anotação') || lower.includes('salvar na timeline') || lower.includes('concluir anotação') || lower.includes('enviar anotação')) {
            setSpeechFeedback('Comando de voz: Salvando na timeline...');
            stopListening();

            setTimeout(() => {
              const currentDesc = (document.getElementById('new-note-description-textarea') as HTMLTextAreaElement)?.value || newNoteDescription || textClean;
              const currentTitle = (document.getElementById('new-note-title-input') as HTMLInputElement)?.value || newNoteTitle || `Observação de Voz (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
              
              if (currentDesc.trim()) {
                onAddTimelineNote(lead.id, {
                  title: currentTitle.trim(),
                  description: currentDesc.trim(),
                  isPrivateWhisper: isWhisper,
                });
                setNewNoteTitle('');
                setNewNoteDescription('');
                setIsWhisper(false);
                setSpeechFeedback('Anotação gravada e salva com sucesso na timeline!');
                setTimeout(() => setSpeechFeedback(null), 3500);
              }
            }, 250);
            return;
          }

          // Normal text dictation
          setNewNoteDescription(prev => {
            const separator = prev.length > 0 && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '';
            return prev + separator + textClean;
          });

          // Auto-generate title if none exists
          setNewNoteTitle(prev => {
            if (!prev.trim()) {
              const preview = textClean.slice(0, 32);
              return `Áudio: ${preview.charAt(0).toUpperCase() + preview.slice(1)}${textClean.length > 32 ? '...' : ''}`;
            }
            return prev;
          });

          setSpeechFeedback('Voz transcrita em tempo real.');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Permissão de microfone negada. Permita o microfone nas permissões do navegador.');
        } else if (event.error === 'no-speech') {
          setSpeechFeedback('Nenhuma fala detectada. Continue falando próximo ao microfone.');
        } else {
          setSpeechError(`Erro de áudio: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechInterim('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Erro ao iniciar reconhecimento de voz:', err);
      setSpeechError('Não foi possível inicializar o microfone. Verifique suas permissões.');
      setIsListening(false);
    }
  };

  const handleToggleVoiceRecognition = (target: 'timeline_note' | 'outcome_notes' = 'timeline_note') => {
    if (isListening) {
      stopListening();
    } else {
      startListening(target);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Loss Reason modal
  const [showLossModal, setShowLossModal] = useState(false);
  const [lossReasonText, setLossReasonText] = useState('');

  const followUps = lead.followUps || [];
  const pendingFollowUps = followUps.filter(f => f.status === 'PENDENTE' || f.status === 'ATRASADO');
  const completedFollowUps = followUps.filter(f => f.status === 'CONCLUIDO');

  // Check if a date is in the past
  const isOverdue = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    return target < now;
  };

  const isToday = (dateStr: string) => {
    const target = new Date(dateStr).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return target === today;
  };

  const handleStageSelect = (newStage: LeadFunnelStage) => {
    if (newStage === 'FECHAMENTO_PERDIDO') {
      setShowLossModal(true);
    } else {
      onChangeStage(lead.id, newStage);
    }
  };

  const handleConfirmLoss = () => {
    if (!lossReasonText.trim()) return;
    onChangeStage(lead.id, 'FECHAMENTO_PERDIDO', lossReasonText);
    setShowLossModal(false);
    setLossReasonText('');
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddFollowUp(lead.id, {
      leadId: lead.id,
      title: title.trim(),
      channel,
      scheduledAt: `${scheduledDate}T${scheduledTime}:00`,
      timeStr: scheduledTime,
      status: 'PENDENTE',
      priority,
      notes: notes.trim(),
      assignedBrokerName: lead.assignedBrokerName,
    });

    // Reset Form
    setTitle('');
    setNotes('');
    setShowNewFollowUpForm(false);
  };

  const handleConfirmComplete = () => {
    if (!completingFollowUpId) return;

    let nextFollowUpPayload = undefined;
    if (scheduleNextPrompt && nextTitle.trim() && nextDate) {
      nextFollowUpPayload = {
        leadId: lead.id,
        title: nextTitle.trim(),
        channel: nextChannel,
        scheduledAt: `${nextDate}T${nextTime}:00`,
        timeStr: nextTime,
        status: 'PENDENTE' as const,
        priority: 'MEDIA' as const,
        assignedBrokerName: lead.assignedBrokerName,
      };
    }

    onCompleteFollowUp(lead.id, completingFollowUpId, outcomeNotes.trim() || 'Follow-up concluído com sucesso.', nextFollowUpPayload);
    setCompletingFollowUpId(null);
    setOutcomeNotes('');
    setScheduleNextPrompt(false);
    setNextTitle('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteDescription.trim()) return;

    if (isListening) {
      stopListening();
    }

    onAddTimelineNote(lead.id, {
      title: newNoteTitle.trim(),
      description: newNoteDescription.trim(),
      isPrivateWhisper: isWhisper,
    });

    setNewNoteTitle('');
    setNewNoteDescription('');
    setIsWhisper(false);
    setSpeechFeedback('Anotação registrada com sucesso na timeline!');
    setTimeout(() => setSpeechFeedback(null), 3000);
  };

  // Follow-up Template presets
  const followUpTemplates = [
    { title: 'Cobrar resposta sobre proposta enviada', channel: 'WHATSAPP' as FollowUpChannel, priority: 'ALTA' as FollowUpPriority },
    { title: 'Confirmar presença na visita ao imóvel', channel: 'LIGACAO' as FollowUpChannel, priority: 'ALTA' as FollowUpPriority },
    { title: 'Feedback após visita e próximos passos', channel: 'WHATSAPP' as FollowUpChannel, priority: 'MEDIA' as FollowUpPriority },
    { title: 'Enviar simulação de financiamento bancário', channel: 'WHATSAPP' as FollowUpChannel, priority: 'MEDIA' as FollowUpPriority },
    { title: 'Reunião para alinhamento de proposta', channel: 'REUNIAO' as FollowUpChannel, priority: 'ALTA' as FollowUpPriority },
    { title: 'Apresentar novas opções no mesmo perfil', channel: 'WHATSAPP' as FollowUpChannel, priority: 'BAIXA' as FollowUpPriority },
  ];

  const getChannelBadge = (ch: FollowUpChannel) => {
    switch (ch) {
      case 'WHATSAPP':
        return { label: 'WhatsApp', icon: MessageSquare, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'LIGACAO':
        return { label: 'Ligação', icon: Phone, bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'VISITA':
        return { label: 'Visita', icon: Building, bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'REUNIAO':
        return { label: 'Reunião', icon: Users, bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'VIDEOCHAMADA':
        return { label: 'Vídeo/Meet', icon: Video, bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'EMAIL':
        return { label: 'E-mail', icon: Mail, bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getStageLabel = (st: LeadFunnelStage) => {
    switch (st) {
      case 'NOVO_LEAD': return 'Novo Lead';
      case 'PRIMEIRO_CONTATO': return '1º Contato';
      case 'QUALIFICACAO': return 'Qualificação';
      case 'VISITA_AGENDADA': return 'Visita Agendada';
      case 'VISITA_REALIZADA': return 'Visita Realizada';
      case 'PROPOSTA_ENVIADA': return 'Proposta Enviada';
      case 'FECHAMENTO_GANHO': return 'Fechado Ganho 🎉';
      case 'FECHAMENTO_PERDIDO': return 'Perdido';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Zone: Client Overview */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-md shrink-0">
                {lead.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-heading truncate">
                    {lead.name}
                  </h2>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {lead.interestType}
                  </span>
                  {lead.rating && (
                    <div className="flex items-center text-amber-400 text-xs">
                      {Array.from({ length: lead.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-300 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 font-mono text-slate-200">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    {lead.phone}
                  </span>
                  {lead.email && (
                    <span className="flex items-center gap-1 text-slate-300 truncate max-w-[200px]">
                      <Mail className="w-3 h-3 text-blue-400" />
                      {lead.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3 h-3 text-purple-400" />
                    Corretor: <strong className="text-slate-200">{lead.assignedBrokerName}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Fechar Detalhes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SLA Alert Monitor Badge for NOVO_LEAD */}
          {lead.stage === 'NOVO_LEAD' && (() => {
            const slaMins = calculateMinutesElapsed(lead);
            const isBreached = slaMins >= 30 && (!lead.timeline || lead.timeline.length === 0);
            return (
              <div className={`mt-3 p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
                isBreached
                  ? 'bg-amber-300 text-amber-950 border-amber-400 font-extrabold shadow-md animate-pulse'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className={`w-4 h-4 shrink-0 ${isBreached ? 'text-amber-900 animate-spin' : 'text-slate-400'}`} />
                  <span className="truncate">
                    {isBreached
                      ? `⚠️ SLA VIOLADO: Lead sem atendimento há mais de 30 minutos (${formatSlaTime(slaMins)})! Ação imediata necessária.`
                      : `SLA Primeiro Contato: ${formatSlaTime(slaMins)} decorridos (Limite seguro: 30 minutos)`}
                  </span>
                </div>
                <a
                  href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(lead.name)},%20sou%20o%20corretor%20respons%C3%A1vel%20pelo%20seu%20atendimento.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all shadow-xs ${
                    isBreached
                      ? 'bg-amber-950 text-amber-100 hover:bg-black'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  <span>Atender via WhatsApp Agora</span>
                </a>
              </div>
            );
          })()}

          {/* Quick Action bar & Funnel Selector */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Stage Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Etapa no Funil:</span>
              <select
                value={lead.stage}
                onChange={(e) => handleStageSelect(e.target.value as LeadFunnelStage)}
                className="bg-slate-800 text-slate-100 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="NOVO_LEAD">Novo Lead</option>
                <option value="PRIMEIRO_CONTATO">1º Contato</option>
                <option value="QUALIFICACAO">Qualificação</option>
                <option value="VISITA_AGENDADA">Visita Agendada</option>
                <option value="VISITA_REALIZADA">Visita Realizada</option>
                <option value="PROPOSTA_ENVIADA">Proposta Enviada</option>
                <option value="FECHAMENTO_GANHO">Fechado Ganho 🎉</option>
                <option value="FECHAMENTO_PERDIDO">Perdido</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowRadarModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs transition-colors text-xs"
                title="Localizar imóveis compatíveis com este lead"
              >
                <Radar className="w-3.5 h-3.5 text-indigo-200" />
                <span>Radar de Imóveis</span>
              </button>
              {onOpenWhatsAppDesk && (
                <button
                  onClick={() => {
                    onOpenWhatsAppDesk(lead);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              )}
              <a
                href={`tel:${lead.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Ligar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 sm:px-6 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('followup')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'followup'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <span>Sistema de Follow-up</span>
              {pendingFollowUps.length > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 font-bold rounded-full text-[10px]">
                  {pendingFollowUps.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Histórico & Linha do Tempo</span>
            </button>

            <button
              onClick={() => setActiveTab('intelligence')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'intelligence'
                  ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Inteligência Gemini</span>
              {lead.aiScoring ? (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  lead.aiScoring.temperature === 'HOT'
                    ? 'bg-rose-100 text-rose-700'
                    : lead.aiScoring.temperature === 'WARM'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {lead.aiScoring.score}/100
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700">
                  Novo
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('interest')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'interest'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4 text-amber-600" />
              <span>Imóvel & Perfil de Compra</span>
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Dados Cadastrais</span>
            </button>

            <button
              onClick={() => setActiveTab('custodia')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
                activeTab === 'custodia'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${lead.stage === 'PROPOSTA_ENVIADA' ? 'text-amber-500 animate-pulse' : 'text-blue-600'}`} />
              <span>Custódia de Documentos</span>
              {lead.stage === 'PROPOSTA_ENVIADA' ? (
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full text-[9px] uppercase tracking-wider animate-bounce">
                  Proposta Ativa
                </span>
              ) : (
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 font-bold rounded-full text-[10px]">
                  {custodyDocs.filter(d => d.status === 'APROVADO').length}/{custodyDocs.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: FOLLOW-UP SYSTEM */}
          {activeTab === 'followup' && (
            <div className="space-y-6">
              {/* Follow-up Top Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                    Pendentes
                  </div>
                  <div className="text-xl font-bold text-blue-900 mt-0.5">
                    {pendingFollowUps.length}
                  </div>
                  <div className="text-[10px] text-blue-600/80 mt-0.5">
                    Ações a realizar
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                    Para Hoje
                  </div>
                  <div className="text-xl font-bold text-amber-900 mt-0.5">
                    {pendingFollowUps.filter(f => isToday(f.scheduledAt)).length}
                  </div>
                  <div className="text-[10px] text-amber-600/80 mt-0.5">
                    Atenção imediata
                  </div>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                    Atrasados
                  </div>
                  <div className="text-xl font-bold text-rose-900 mt-0.5">
                    {pendingFollowUps.filter(f => isOverdue(f.scheduledAt) && !isToday(f.scheduledAt)).length}
                  </div>
                  <div className="text-[10px] text-rose-600/80 mt-0.5">
                    Risco de perda
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    Realizados
                  </div>
                  <div className="text-xl font-bold text-emerald-900 mt-0.5">
                    {completedFollowUps.length}
                  </div>
                  <div className="text-[10px] text-emerald-600/80 mt-0.5">
                    Contatos com sucesso
                  </div>
                </div>
              </div>

              {/* Action Bar: New Follow-up */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Próximos Contatos & Follow-ups Agendados
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mantenha o cliente aquecido com histórico e prazos de retorno
                  </p>
                </div>

                <button
                  onClick={() => setShowNewFollowUpForm(!showNewFollowUpForm)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNewFollowUpForm ? 'Fechar Formulário' : '+ Agendar Follow-up'}</span>
                </button>
              </div>

              {/* Collapsible New Follow-up Form */}
              {showNewFollowUpForm && (
                <form 
                  onSubmit={handleCreateFollowUp}
                  className="bg-slate-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Novo Agendamento de Follow-up
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Corretor: <strong>{lead.assignedBrokerName}</strong>
                    </span>
                  </div>

                  {/* Channel selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Canal de Contato:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {(['WHATSAPP', 'LIGACAO', 'VISITA', 'REUNIAO', 'VIDEOCHAMADA', 'EMAIL'] as FollowUpChannel[]).map((ch) => {
                        const info = getChannelBadge(ch);
                        const Icon = info.icon;
                        const isSelected = channel === ch;
                        return (
                          <button
                            type="button"
                            key={ch}
                            onClick={() => setChannel(ch)}
                            className={`p-2 rounded-xl text-xs font-medium border flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                            <span className="text-[10px] leading-none">{info.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Template Chips */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                      Modelos Rápidos (1 clique):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {followUpTemplates.map((t, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => {
                            setTitle(t.title);
                            setChannel(t.channel);
                            setPriority(t.priority);
                          }}
                          className="text-[10px] font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg px-2.5 py-1 transition-colors text-left"
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Follow-up Title & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Motivo / Título do Follow-up *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Cobrar resposta da proposta ou confirmar visita..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Prioridade:
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as FollowUpPriority)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-medium"
                      >
                        <option value="ALTA">🔴 Alta (Prioridade Máxima)</option>
                        <option value="MEDIA">🟡 Média (Padrão)</option>
                        <option value="BAIXA">🔵 Baixa (Acompanhamento)</option>
                      </select>
                    </div>
                  </div>

                  {/* Date & Time with shortcuts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Data do Agendamento *</span>
                        <div className="flex gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              setScheduledDate(d.toISOString().split('T')[0]);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Hoje
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 1);
                              setScheduledDate(d.toISOString().split('T')[0]);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Amanhã
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 3);
                              setScheduledDate(d.toISOString().split('T')[0]);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            +3 dias
                          </button>
                        </div>
                      </label>
                      <input
                        type="date"
                        required
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Horário Previsto *
                      </label>
                      <input
                        type="time"
                        required
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  {/* Notes / Pauta */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Orientações para a Abordagem (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Focar na flexibilidade de pagamento do proprietário e no desconto do IPTU..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewFollowUpForm(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvar Agendamento</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Active Follow-ups List */}
              <div className="space-y-3">
                {pendingFollowUps.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <CalendarCheck className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">
                      Nenhum follow-up pendente para este cliente
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Clientes com follow-ups agendados têm 3x mais chance de fechamento.
                    </p>
                    <button
                      onClick={() => setShowNewFollowUpForm(true)}
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agendar primeiro follow-up
                    </button>
                  </div>
                ) : (
                  pendingFollowUps.map((item) => {
                    const channelInfo = getChannelBadge(item.channel);
                    const ChannelIcon = channelInfo.icon;
                    const overdue = isOverdue(item.scheduledAt) && !isToday(item.scheduledAt);
                    const today = isToday(item.scheduledAt);

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          overdue
                            ? 'bg-rose-50/40 border-rose-300 shadow-2xs'
                            : today
                            ? 'bg-amber-50/30 border-amber-300 shadow-2xs'
                            : 'bg-white border-slate-200/90 shadow-2xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-xl border ${channelInfo.bg} shrink-0`}>
                              <ChannelIcon className="w-4 h-4" />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                  {item.title}
                                </h4>
                                
                                {overdue && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                                    Atrasado
                                  </span>
                                )}

                                {today && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                    Hoje!
                                  </span>
                                )}

                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                                  item.priority === 'ALTA'
                                    ? 'bg-red-100 text-red-700'
                                    : item.priority === 'MEDIA'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  Prioridade {item.priority}
                                </span>
                              </div>

                              {item.notes && (
                                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  {item.notes}
                                </p>
                              )}

                              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                                <span className="flex items-center gap-1 font-medium text-slate-700">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {item.scheduledAt.split('T')[0]} às {item.timeStr || item.scheduledAt.split('T')[1]?.slice(0, 5) || '14:00'}
                                </span>
                                <span>•</span>
                                <span>Canal: <strong className="text-slate-700">{channelInfo.label}</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                            <button
                              onClick={() => {
                                setCompletingFollowUpId(item.id);
                                setOutcomeNotes('');
                                setScheduleNextPrompt(true);
                                setNextTitle('');
                                const d = new Date();
                                d.setDate(d.getDate() + 2);
                                setNextDate(d.toISOString().split('T')[0]);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                              title="Marcar como realizado e registrar resultado"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Concluir</span>
                            </button>

                            {/* Direct Action */}
                            {item.channel === 'WHATSAPP' && onOpenWhatsAppDesk && (
                              <button
                                onClick={() => {
                                  onOpenWhatsAppDesk(lead);
                                  onClose();
                                }}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                                title="Abrir WhatsApp agora"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Reschedule Shortcuts */}
                            <button
                              onClick={() => {
                                const d = new Date();
                                d.setDate(d.getDate() + 1);
                                onRescheduleFollowUp(lead.id, item.id, d.toISOString().split('T')[0], item.timeStr);
                              }}
                              className="px-2 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                              title="Adiar para amanhã"
                            >
                              +1 dia
                            </button>

                            <button
                              onClick={() => onDeleteFollowUp(lead.id, item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Excluir follow-up"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Completed Follow-ups Section */}
              {completedFollowUps.length > 0 && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Histórico de Follow-ups Concluídos ({completedFollowUps.length})
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {completedFollowUps.map((item) => {
                      const channelInfo = getChannelBadge(item.channel);
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">{item.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({channelInfo.label})</span>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                Realizado
                              </span>
                            </div>
                            {item.outcomeNotes && (
                              <p className="text-[11px] text-slate-600 italic">
                                Desfecho: "{item.outcomeNotes}"
                              </p>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {item.completedAt ? new Date(item.completedAt).toLocaleString('pt-BR') : 'Concluído'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TIMELINE & INTERNAL NOTES */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Gemini Intelligence Timeline Insight Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-800/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Inteligência de Leads Gemini</span>
                      {lead.aiScoring ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          lead.aiScoring.temperature === 'HOT'
                            ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
                            : lead.aiScoring.temperature === 'WARM'
                            ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                            : 'bg-slate-500/30 text-slate-300 border border-slate-400/40'
                        }`}>
                          {lead.aiScoring.temperature === 'HOT' ? <Flame className="w-3 h-3" /> : lead.aiScoring.temperature === 'WARM' ? <Zap className="w-3 h-3" /> : <Snowflake className="w-3 h-3" />}
                          Score {lead.aiScoring.score}/100 • {lead.aiScoring.classification === 'ALTA_PROPENSAO' ? 'Alta Propensão' : lead.aiScoring.classification === 'MEDIA_PROPENSAO' ? 'Média Propensão' : 'Baixa Propensão'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300">
                          Pendente de Análise
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-200/80 mt-0.5 line-clamp-1">
                      {lead.aiScoring?.summary || 'Audite a timeline deste cliente com Gemini 3.8 Flash para calcular a propensão de fechamento.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('intelligence')}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Ver Raio-X Completo
                  </button>
                  <button
                    type="button"
                    onClick={handleRecalculateScore}
                    disabled={isAnalyzingScore}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-all disabled:opacity-50 cursor-pointer"
                    title="Recalcular com Gemini"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingScore ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Add Note Box with Web Speech API Dictation */}
              <form onSubmit={handleAddNote} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    Registrar Nova Ocorrência ou Anotação
                  </span>

                  {/* Web Speech API Voice Recognition Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleVoiceRecognition('timeline_note')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                        isListening && voiceTarget === 'timeline_note'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-400/50'
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200'
                      }`}
                      title={
                        isListening && voiceTarget === 'timeline_note'
                          ? 'Parar gravação por voz'
                          : 'Iniciar reconhecimento de voz em tempo real (Web Speech API)'
                      }
                    >
                      {isListening && voiceTarget === 'timeline_note' ? (
                        <>
                          <Radio className="w-3.5 h-3.5 text-white animate-ping" />
                          <span>Gravando Voz... (Clique para parar)</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-purple-700" />
                          <span>Gravar por Voz (Comandos)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Live Speech Recognition Feedback & Voice Commands Banner */}
                {(isListening && voiceTarget === 'timeline_note' || speechInterim || speechFeedback || speechError) && (
                  <div className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                    speechError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : isListening && voiceTarget === 'timeline_note'
                      ? 'bg-purple-50/90 border-purple-300 text-purple-950 shadow-xs'
                      : 'bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {isListening && voiceTarget === 'timeline_note' && (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                          </span>
                        )}
                        <span className="font-bold">
                          {speechError
                            ? 'Aviso do Microfone'
                            : isListening && voiceTarget === 'timeline_note'
                            ? 'Ouvindo em Tempo Real via Web Speech...'
                            : 'Status de Voz'}
                        </span>
                      </div>

                      {isListening && voiceTarget === 'timeline_note' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-mono">
                            pt-BR ativo
                          </span>
                          <button
                            type="button"
                            onClick={stopListening}
                            className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                          >
                            Finalizar fala
                          </button>
                        </div>
                      )}
                    </div>

                    {speechError && (
                      <p className="text-xs text-rose-700">{speechError}</p>
                    )}

                    {speechInterim && (
                      <div className="p-2 bg-white/90 rounded-lg border border-purple-200 text-xs italic text-purple-900 flex items-center gap-2 shadow-2xs">
                        <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-pulse shrink-0" />
                        <span className="truncate">"... {speechInterim} ..."</span>
                      </div>
                    )}

                    {speechFeedback && !speechError && (
                      <p className="text-[11px] text-purple-800 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{speechFeedback}</span>
                      </p>
                    )}

                    {/* Voice Commands Guide Chips */}
                    {isListening && voiceTarget === 'timeline_note' && (
                      <div className="pt-1.5 border-t border-purple-200/70 flex flex-wrap items-center gap-1.5 text-[10px] text-purple-800">
                        <span className="font-bold">Comandos de voz:</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-purple-200 shadow-2xs font-mono">🗣️ "Título [assunto]"</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-purple-200 shadow-2xs font-mono">🗣️ "Modo Fantasma"</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-purple-200 shadow-2xs font-mono">🗣️ "Salvar na timeline"</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-purple-200 shadow-2xs font-mono">🗣️ "Limpar texto"</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="relative">
                  <input
                    id="new-note-title-input"
                    type="text"
                    required
                    placeholder="Título da anotação (ex: Ligação realizada, Objeção de preço, Reunião presencial...)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-hidden bg-white pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleVoiceRecognition('timeline_note')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 cursor-pointer p-0.5"
                    title="Ditar título por voz"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    id="new-note-description-textarea"
                    rows={2}
                    required
                    placeholder="Detalhes da conversa ou orientação de atendimento... (Fale pelo microfone para ditar em tempo real)"
                    value={newNoteDescription}
                    onChange={(e) => setNewNoteDescription(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={isWhisper}
                      onChange={(e) => setIsWhisper(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <Lock className="w-3 h-3 text-purple-600" />
                      Modo Fantasma (Anotação sigilosa visível apenas para gerência e corretor)
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    {isListening && voiceTarget === 'timeline_note' && (
                      <button
                        type="button"
                        onClick={() => {
                          stopListening();
                          if (newNoteDescription.trim()) {
                            onAddTimelineNote(lead.id, {
                              title: newNoteTitle.trim() || 'Anotação por Voz (Timeline)',
                              description: newNoteDescription.trim(),
                              isPrivateWhisper: isWhisper,
                            });
                            setNewNoteTitle('');
                            setNewNoteDescription('');
                            setIsWhisper(false);
                            setSpeechFeedback('Salvo com sucesso na timeline!');
                            setTimeout(() => setSpeechFeedback(null), 3000);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Concluir e Salvar</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Salvar na Timeline
                    </button>
                  </div>
                </div>
              </form>

              {/* Vertical Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {lead.timeline && lead.timeline.length > 0 ? (
                  lead.timeline.map((event) => (
                    <div key={event.id} className="relative group">
                      {/* Timeline dot */}
                      <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white ring-2 ${
                        event.isPrivateWhisper
                          ? 'bg-purple-600 ring-purple-200'
                          : event.type === 'STATUS_CHANGE'
                          ? 'bg-blue-600 ring-blue-200'
                          : event.type === 'PROPOSAL'
                          ? 'bg-emerald-600 ring-emerald-200'
                          : event.type === 'VISIT'
                          ? 'bg-amber-600 ring-amber-200'
                          : 'bg-slate-500 ring-slate-200'
                      }`}></div>

                      <div className={`p-4 rounded-xl border ${
                        event.isPrivateWhisper
                          ? 'bg-purple-50/70 border-purple-200'
                          : 'bg-white border-slate-200/90 shadow-2xs'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {event.isPrivateWhisper && <Lock className="w-3 h-3 text-purple-600" />}
                            {event.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {event.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Registrado por: <strong className="text-slate-600">{event.authorName} ({event.authorRole})</strong></span>
                          {event.isPrivateWhisper && (
                            <span className="text-purple-700 font-bold">Sigiloso</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic py-4">
                    Nenhuma interação registrada ainda.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: GEMINI LEAD INTELLIGENCE */}
          {activeTab === 'intelligence' && (
            <div className="space-y-6">
              {/* Header card with recalculate action */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-900/60 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 shrink-0">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-white">Inteligência de Leads Gemini</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 uppercase tracking-wider font-extrabold">
                        3.8 Flash
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Diagnóstico de momento de compra e scoring baseado na timeline de {lead.timeline?.length || 0} contatos
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRecalculateScore}
                  disabled={isAnalyzingScore}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-98 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingScore ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingScore ? 'Analisando Timeline...' : 'Recalcular Análise IA'}</span>
                </button>
              </div>

              {/* Gauge and Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 sm:p-5 rounded-2xl border ${
                  (lead.aiScoring?.score ?? 60) >= 75
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : (lead.aiScoring?.score ?? 60) >= 40
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                } flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Propensão de Fechamento</span>
                    {lead.aiScoring?.temperature === 'HOT' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 animate-bounce" /> Quente
                      </span>
                    ) : lead.aiScoring?.temperature === 'WARM' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Morno
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-black bg-slate-500 text-white flex items-center gap-1">
                        <Snowflake className="w-3.5 h-3.5" /> Frio
                      </span>
                    )}
                  </div>

                  <div className="my-3 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight">
                      {lead.aiScoring?.score ?? '--'}
                    </span>
                    <span className="text-sm font-bold text-slate-400">/ 100</span>
                    <span className="text-xs font-semibold ml-auto">
                      {lead.aiScoring?.classification === 'ALTA_PROPENSAO'
                        ? 'Alta'
                        : lead.aiScoring?.classification === 'MEDIA_PROPENSAO'
                        ? '⚡ Média'
                        : '❄️ Baixa'}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        (lead.aiScoring?.score ?? 60) >= 75
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                          : (lead.aiScoring?.score ?? 60) >= 40
                          ? 'bg-gradient-to-r from-blue-500 to-amber-500'
                          : 'bg-gradient-to-r from-slate-400 to-slate-600'
                      }`}
                      style={{ width: `${lead.aiScoring?.score ?? 50}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                    <span>Probabilidade: {lead.aiScoring?.probabilityPercent ?? 60}%</span>
                    <span>{lead.aiScoring?.timelineInteractionsAnalyzed ?? lead.timeline?.length ?? 0} interações</span>
                  </div>
                </div>

                <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Parecer Diagnóstico da Timeline
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {lead.aiScoring?.summary || 'O modelo Gemini avalia a cadência de interações para prever as chances de fechamento. Clique em "Recalcular Análise IA" para gerar um parecer atualizado.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Auditoria de Timeline Imobiliária
                    </span>
                    {lead.aiScoring?.analyzedAt && (
                      <span>Última análise: {new Date(lead.aiScoring.analyzedAt).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strengths & Risks */}
              {lead.aiScoring && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
                    <div className="flex items-center gap-2 mb-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                        Sinais de Compra na Timeline
                      </h4>
                    </div>
                    <ul className="space-y-1.5">
                      {lead.aiScoring.keyStrengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                    <div className="flex items-center gap-2 mb-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Pontos de Atenção & Objeções
                      </h4>
                    </div>
                    <ul className="space-y-1.5">
                      {lead.aiScoring.riskFactors.map((rf, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Next Best Action Card */}
              {lead.aiScoring?.nextBestAction && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300 block mb-1">
                        Próxima Melhor Ação Estratégica (Next Best Action)
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                        {lead.aiScoring.nextBestAction}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested WhatsApp Script */}
              {lead.aiScoring?.suggestedScript && (
                <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                        Script de Abordagem WhatsApp Sugerido pelo Gemini
                      </h4>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-indigo-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-2xs whitespace-pre-wrap">
                    {lead.aiScoring.suggestedScript}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (lead.aiScoring?.suggestedScript) {
                          navigator.clipboard.writeText(lead.aiScoring.suggestedScript);
                          setCopiedAiScript(true);
                          setTimeout(() => setCopiedAiScript(false), 2000);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      {copiedAiScript ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>Copiar Mensagem</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const rawPhone = lead.phone.replace(/\D/g, '');
                        const cleanPhone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
                        const encoded = encodeURIComponent(lead.aiScoring?.suggestedScript || '');
                        window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir no WhatsApp Web</span>
                    </button>

                    {onOpenWhatsAppDesk && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenWhatsAppDesk(lead);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Abrir Desk de Mensagens</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTEREST & BUDGET */}
          {activeTab === 'interest' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Perfil de Negociação
                  </span>

                  <div>
                    <span className="text-xs text-slate-500">Tipo de Negócio:</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {lead.interestType === 'COMPRA' ? 'Aquisição / Compra de Imóvel' : lead.interestType === 'LOCACAO' ? 'Locação Residencial / Comercial' : 'Lançamento na Planta'}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500">Faixa de Investimento Pretendido:</span>
                    <div className="text-sm font-bold text-blue-700 font-mono mt-0.5">
                      R$ {lead.budgetMin.toLocaleString('pt-BR')} até R$ {lead.budgetMax.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Imóvel de Interesse Principal
                  </span>

                  {lead.propertyOfInterestTitle ? (
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{lead.propertyOfInterestTitle}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Imóvel vinculado à captação deste cliente no catálogo.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      Nenhum imóvel específico vinculado. Cliente com busca aberta.
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  Tags & Marcadores do Perfil
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags && lead.tags.length > 0 ? (
                    lead.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Nenhuma tag associada</span>
                  )}
                </div>
              </div>

              {/* Radar de Imóveis Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl text-white shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                      <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        Radar de Imóveis Compatíveis
                      </h4>
                      <p className="text-xs text-indigo-200">
                        Localize instantaneamente imóveis no estoque que atendem a faixa de R$ {lead.budgetMin.toLocaleString('pt-BR')} a R$ {lead.budgetMax.toLocaleString('pt-BR')}.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRadarModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Radar className="w-3.5 h-3.5" />
                    <span>Abrir Radar de Imóveis</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GENERAL CLIENT INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-400">Nome Completo:</span>
                  <div className="text-sm font-bold text-slate-900">{lead.name}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-400">Telefone / WhatsApp:</span>
                  <div className="text-sm font-bold text-slate-900 font-mono">{lead.phone}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-400">E-mail:</span>
                  <div className="text-sm font-bold text-slate-900">{lead.email || 'Não informado'}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-400">Canal de Origem:</span>
                  <div className="text-sm font-bold text-slate-900">
                    {lead.source === 'PASSAGEM_STAND' ? 'Passagem Stand' :
                     lead.source === 'VISITA_IMOBILIARIA' ? 'Visita na Imobiliária' :
                     lead.source === 'PORTAL_ZAP' ? 'Portal Zap Imóveis' :
                     lead.source === 'PORTAL_VIVAREAL' ? 'Portal VivaReal' :
                     lead.source === 'WHATSAPP_DIRETO' ? 'WhatsApp Direto' :
                     lead.source === 'PLACA_QR_CODE' ? 'Placa Física (QR Code)' :
                     lead.source === 'INDICOU_GANHOU' ? 'Programa Indicou Ganhou' :
                     lead.source === 'INSTAGRAM_ADS' ? 'Meta Ads / Instagram' :
                     lead.source === 'SITE_OFICIAL' ? 'Site Oficial da Imobiliária' :
                     lead.source.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-400">Corretor Responsável:</span>
                  <div className="text-sm font-bold text-slate-900">{lead.assignedBrokerName}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-400">Data de Entrada no CRM:</span>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {new Date(lead.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* CARD DE QUALIFICAÇÃO SDR & DOCUMENTOS CIVIS */}
              <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 rounded-2xl border border-indigo-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        Qualificação do Lead na Fase SDR & Dados Civis
                        {sdrQualified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            QUALIFICADO ✓
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Cadastro de CPF, RG, Estado Civil e Data de Nascimento para esteira jurídica e felicitações automáticas
                      </p>
                    </div>
                  </div>

                  {sdrSavedToast && (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold animate-in fade-in flex items-center gap-1.5 shadow-xs">
                      <Check className="w-3.5 h-3.5" /> Salvo com Sucesso!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveSdrQualification} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CPF do Cliente *
                      </label>
                      <input
                        type="text"
                        value={sdrCpf}
                        onChange={e => setSdrCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        RG / Órgão Emissor
                      </label>
                      <input
                        type="text"
                        value={sdrRg}
                        onChange={e => setSdrRg(e.target.value)}
                        placeholder="Ex: 28.941.012-X SSP/SP"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estado Civil
                      </label>
                      <select
                        value={sdrMaritalStatus}
                        onChange={e => setSdrMaritalStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium"
                      >
                        <option value="SOLTEIRO">Solteiro(a)</option>
                        <option value="CASADO">Casado(a)</option>
                        <option value="UNIAO_ESTAVEL">União Estável</option>
                        <option value="DIVORCIADO">Divorciado(a)</option>
                        <option value="VIUVO">Viúvo(a)</option>
                        <option value="SEPARADO">Separado(a)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-800">
                          <Calendar className="w-3 h-3 text-indigo-600" />
                          Data de Nascimento
                        </span>
                        {sdrBirthDate && (
                          <span className="text-[10px] text-pink-600 font-bold flex items-center gap-0.5">
                            <Cake className="w-2.5 h-2.5" /> Ativa
                          </span>
                        )}
                      </label>
                      <input
                        type="date"
                        value={sdrBirthDate}
                        onChange={e => setSdrBirthDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={sdrQualified}
                          onChange={e => setSdrQualified(e.target.checked)}
                          className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          Marcar como Qualificado pelo SDR
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={sendBirthdayWishes}
                          onChange={e => setSendBirthdayWishes(e.target.checked)}
                          className="rounded-sm border-slate-300 text-pink-600 focus:ring-pink-500 w-3.5 h-3.5"
                        />
                        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Cake className="w-3.5 h-3.5 text-pink-500" />
                          Enviar mensagem de aniversário automaticamente
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 self-end sm:self-auto"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvar Qualificação SDR</span>
                    </button>
                  </div>
                </form>

                {/* DISPARO DE MENSAGENS FESTIVAS / FECHAMENTO DE NEGÓCIO */}
                <div className="pt-3 border-t border-indigo-100/80 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleSendBirthdayGreeting}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <Cake className="w-4 h-4 text-pink-200" />
                    <span>Disparar Mensagem de Aniversário (WhatsApp)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendDealClosingGreeting}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4 text-emerald-200" />
                    <span>Disparar Mensagem de Fechamento de Negócio (WhatsApp)</span>
                  </button>
                </div>
              </div>

              {/* CARD DE BLINDAGEM ANTI-REPASSE & VINCULAÇÃO DO CORRETOR */}
              <div className="p-5 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 rounded-2xl border border-emerald-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        Vinculação & Blindagem Anti-Repasse
                        {brokerLockedUntil && new Date(brokerLockedUntil) > new Date() ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> BLINDADO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            Sem Blindagem Ativa
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Garante exclusividade temporária do atendimento para o corretor titular, evitando disputas e duplicidade
                      </p>
                    </div>
                  </div>

                  {brokerLockToast && (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold animate-in fade-in flex items-center gap-1.5 shadow-xs">
                      <Check className="w-3.5 h-3.5" /> {brokerLockToast}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Corretor Titular Vinculado</span>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {lead.assignedBrokerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{lead.assignedBrokerName}</p>
                        <p className="text-[10px] text-slate-400">ID: {lead.assignedBrokerId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Prazo de Proteção de Atendimento</span>
                    <div className="pt-0.5">
                      {brokerLockedUntil && new Date(brokerLockedUntil) > new Date() ? (
                        <div className="text-xs text-slate-700">
                          <span className="font-bold text-emerald-700">Válido até {new Date(brokerLockedUntil).toLocaleDateString('pt-BR')}</span>
                          <span className="text-slate-400 ml-1">
                            (~{Math.ceil((new Date(brokerLockedUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias restantes)
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">Proteção expirada ou não configurada</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controles de Atualização de Blindagem */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Renovar por:</span>
                    <select
                      value={brokerLockPeriodDays}
                      onChange={e => setBrokerLockPeriodDays(Number(e.target.value))}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      <option value={15}>15 dias</option>
                      <option value={30}>30 dias (Padrão)</option>
                      <option value={45}>45 dias</option>
                      <option value={60}>60 dias</option>
                      <option value={90}>90 dias</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveBrokerLock}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 self-end sm:self-auto"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Atualizar Blindagem do Corretor</span>
                  </button>
                </div>
              </div>

              {/* CARD DE PROPONENTES DA PROPOSTA / EMISSÃO DE CONTRATO (ATÉ 4) */}
              <div className="p-5 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 rounded-2xl border border-blue-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        Proponentes do Negócio (Contrato / Financiamento)
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                          {proposers.length} de 4 Cadastrados
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Adicione até 4 proponentes (cônjuges, sócios, avalistas) para emissão de contrato e qualificação bancária sem retrabalho
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {proposersToast && (
                      <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold animate-in fade-in flex items-center gap-1.5 shadow-xs">
                        <Check className="w-3.5 h-3.5" /> {proposersToast}
                      </span>
                    )}

                    {!isAddingProposer && (
                      <button
                        type="button"
                        disabled={proposers.length >= 4}
                        onClick={() => setIsAddingProposer(true)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          proposers.length >= 4
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Proponente</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Formulário Inline de Novo Proponente */}
                {isAddingProposer && (
                  <form onSubmit={handleAddProposer} className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-blue-600" /> Novo Proponente ({proposers.length + 1} de 4)
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingProposer(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={newPropName}
                          onChange={e => setNewPropName(e.target.value)}
                          placeholder="Ex: Maria Ferreira da Silva"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Vínculo / Papel
                        </label>
                        <select
                          value={newPropRelationship}
                          onChange={e => setNewPropRelationship(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                        >
                          <option value="CONJUGE">Cônjuge / Companheiro(a)</option>
                          <option value="SEGUNDO_COMPRADOR">2º Comprador(a)</option>
                          <option value="AVALISTA_FIADOR">Avalista / Fiador</option>
                          <option value="SOCIO">Sócio / Representante</option>
                          <option value="OUTRO">Outro Parentesco</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          CPF
                        </label>
                        <input
                          type="text"
                          value={newPropCpf}
                          onChange={e => setNewPropCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          RG
                        </label>
                        <input
                          type="text"
                          value={newPropRg}
                          onChange={e => setNewPropRg(e.target.value)}
                          placeholder="Ex: 12.345.678-9 SSP/SP"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={newPropPhone}
                          onChange={e => setNewPropPhone(e.target.value)}
                          placeholder="(11) 98765-4321"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={newPropEmail}
                          onChange={e => setNewPropEmail(e.target.value)}
                          placeholder="proponente@email.com"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>

                      <div className="sm:col-span-2 md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Profissão / Ocupação Principal
                        </label>
                        <input
                          type="text"
                          value={newPropProfession}
                          onChange={e => setNewPropProfession(e.target.value)}
                          placeholder="Ex: Engenheira Civil, Administrador, etc."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-100">
                      <button
                        type="button"
                        onClick={() => setIsAddingProposer(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar e Salvar Proponente</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Lista de Proponentes Cadastrados */}
                {proposers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {proposers.map((prop, idx) => (
                      <div
                        key={prop.id}
                        className="p-3.5 bg-white rounded-xl border border-blue-100/90 shadow-2xs hover:shadow-xs transition-all space-y-2 relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs">{prop.name}</h5>
                            </div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                              {prop.relationship === 'CONJUGE' ? 'Cônjuge' :
                               prop.relationship === 'SEGUNDO_COMPRADOR' ? '2º Comprador' :
                               prop.relationship === 'AVALISTA_FIADOR' ? 'Avalista / Fiador' :
                               prop.relationship === 'SOCIO' ? 'Sócio' : 'Outro'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveProposer(prop.id, prop.name)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remover proponente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100 font-medium">
                          {prop.cpf && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">CPF:</span>
                              <span className="font-mono text-slate-800">{prop.cpf}</span>
                            </div>
                          )}
                          {prop.rg && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">RG:</span>
                              <span className="text-slate-800">{prop.rg}</span>
                            </div>
                          )}
                          {prop.phone && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Telefone:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-slate-800">{prop.phone}</span>
                                <a
                                  href={`https://wa.me/55${prop.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          )}
                          {prop.email && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">E-mail:</span>
                              <span className="text-slate-800 truncate max-w-[160px]">{prop.email}</span>
                            </div>
                          )}
                          {prop.profession && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Profissão:</span>
                              <span className="text-slate-800">{prop.profession}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isAddingProposer && (
                    <div className="p-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-center space-y-1">
                      <p className="text-xs font-semibold text-slate-600">Nenhum proponente adicional cadastrado.</p>
                      <p className="text-[11px] text-slate-400">
                        O contrato será gerado exclusivamente no nome do titular ({lead.name}). Adicione cônjuge ou co-compradores se houver.
                      </p>
                    </div>
                  )
                )}

                {/* Barra de Status e Ação: Validação para Emissão de Contrato */}
                <div className="pt-3 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {proposersValidation.canEmitContract ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-800">
                          Apto para Emissão de Contrato (Nome & CPF validados)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-amber-900 block">
                            Emissão de Contrato Bloqueada
                          </span>
                          <span className="text-[11px] text-amber-700">
                            Preencha Nome Completo e CPF (11 dígitos) dos proponentes para autorizar a minuta
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {contractEmitToast && (
                      <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold animate-in fade-in flex items-center gap-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" /> {contractEmitToast}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleEmitContract}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        proposersValidation.canEmitContract
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white active:scale-98'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200/80 border border-amber-300'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{proposersValidation.canEmitContract ? 'Emitir Minuta de Contrato' : 'Verificar Pendências do Contrato'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {lead.lossReason && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Motivo Registrado de Perda do Lead:
                  </span>
                  <p className="text-xs text-rose-700">{lead.lossReason}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CUSTÓDIA DE DOCUMENTOS DO CLIENTE (AVANÇO PARA PROPOSTA) */}
          {activeTab === 'custodia' && (() => {
            const effectiveRole = simulatedRoleOverride || currentUser?.role || 'MASTER_ADMIN';
            const isLeadOwner = currentUser 
              ? (currentUser.id === lead.assignedBrokerId || currentUser.name.toLowerCase().includes(lead.assignedBrokerName.toLowerCase().split(' ')[0]))
              : true;
            const isManagement = ['SUPER_ADMIN', 'MASTER_ADMIN', 'MANAGER', 'FINANCIAL_OPERATOR'].includes(effectiveRole);
            const hasCustodyAccess = isLeadOwner || isManagement;

            const custodyToken = `cust-${lead.id.toLowerCase().replace(/[^a-z0-9]/g, '')}-sec84`;
            const custodyUrl = `https://acertgo.com.br/custodia/${lead.id}?token=${custodyToken}`;

            const handleCopyLink = () => {
              navigator.clipboard.writeText(custodyUrl);
              setCopiedCustodyLinkToast(true);
              setTimeout(() => setCopiedCustodyLinkToast(false), 2500);
            };

            const handleSendWhatsAppCustody = () => {
              const cleanPhone = lead.phone.replace(/\D/g, '');
              const message = encodeURIComponent(
                `Olá ${lead.name.split(' ')[0]}! Para formalizarmos sua proposta do imóvel ${lead.propertyOfInterestTitle || 'selecionado'}, por favor envie os documentos necessários através do nosso link seguro de custódia:\n\n${custodyUrl}\n\nDocumentos: RG/CNH, CPF, Comprovante de Residência, Certidão de Estado Civil, 3 Holerites/Extratos e IRPF. Canal blindado com validade jurídica!`
              );
              window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
            };

            const handleUploadFile = (docId: string) => {
              setCustodyDocs(prev => prev.map(d => {
                if (d.id === docId) {
                  return {
                    ...d,
                    status: 'EM_ANALISE',
                    fileName: `${d.title.toLowerCase().replace(/\s+/g, '_')}_${lead.name.split(' ')[0].toLowerCase()}.pdf`,
                    fileSize: '1.9 MB',
                    uploadedAt: 'Agora mesmo',
                    sha256Hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945'
                  };
                }
                return d;
              }));
            };

            const handleApprove = (docId: string) => {
              setCustodyDocs(prev => prev.map(d => {
                if (d.id === docId) {
                  return {
                    ...d,
                    status: 'APROVADO',
                    reviewedBy: currentUser?.name || 'Mariana Costa (Gerente)',
                    reviewedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                }
                return d;
              }));
            };

            const handleConfirmReject = () => {
              if (!rejectingDocId) return;
              setCustodyDocs(prev => prev.map(d => {
                if (d.id === rejectingDocId) {
                  return {
                    ...d,
                    status: 'REJEITADO',
                    rejectionReason: rejectionReasonInput || 'Documento ilegível ou incompleto'
                  };
                }
                return d;
              }));
              setRejectingDocId(null);
              setRejectionReasonInput('');
            };

            const approvedCount = custodyDocs.filter(d => d.status === 'APROVADO').length;
            const inAnalysisCount = custodyDocs.filter(d => d.status === 'EM_ANALISE').length;
            const pendingCount = custodyDocs.filter(d => d.status === 'PENDENTE').length;

            return (
              <div className="space-y-6">
                {/* Hidden real file input for custody upload */}
                <input
                  type="file"
                  ref={custodyFileInputRef}
                  onChange={handleRealCustodyUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />

                {/* Customer Custody Portal Modal (Real Link Experience) */}
                <CustomerCustodyPortalModal
                  isOpen={isCustomerPortalOpen}
                  onClose={() => setIsCustomerPortalOpen(false)}
                  leadName={lead.name}
                  propertyTitle={lead.propertyOfInterestTitle}
                  leadId={lead.id}
                  token={custodyToken}
                  documents={custodyDocs}
                  onUploadCustomerDoc={(docId, file, dataUrl, hash) => {
                    const sizeStr = file.size > 1024 * 1024 
                      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                      : `${(file.size / 1024).toFixed(0)} KB`;

                    setCustodyDocs(prev => prev.map(d => {
                      if (d.id === docId) {
                        return {
                          ...d,
                          status: 'EM_ANALISE',
                          fileName: file.name,
                          fileSize: sizeStr,
                          fileUrl: dataUrl,
                          uploadedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          sha256Hash: hash
                        };
                      }
                      return d;
                    }));
                  }}
                />

                {/* Security Restriction Banner if user doesn't have permission */}
                {!hasCustodyAccess ? (
                  <div className="bg-slate-900 rounded-3xl p-8 text-white border border-slate-800 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
                      <LockKeyhole className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-lg font-bold text-white">Acesso Restrito: Custódia Confidencial</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Por conformidade com a <strong>LGPD (Lei 13.709/2018)</strong> e <strong>Sigilo Bancário</strong>, documentos pessoais e fiscais sob custódia são acessíveis exclusivamente pelo <strong>Corretor Titular ({lead.assignedBrokerName})</strong> ou por cargos de <strong>Gerência e Diretoria</strong>.
                      </p>
                      <div className="text-[11px] text-slate-400 pt-2">
                        Seu perfil atual: <span className="font-bold text-slate-200">{currentUser?.name} ({effectiveRole})</span>
                      </div>
                    </div>

                    {/* Simulation switcher for testing */}
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-2">
                      <span className="text-xs text-slate-400">Simular Acesso Autorizado:</span>
                      <button
                        onClick={() => setSimulatedRoleOverride('MANAGER')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Simular Visão Gerente
                      </button>
                      <button
                        onClick={() => setSimulatedRoleOverride('MASTER_ADMIN')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Simular Visão Diretor
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Proposal Stage Alert Banner */}
                    <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-blue-800/80 relative overflow-hidden">
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                              PASTA DE CUSTÓDIA ATIVA
                            </span>
                            {lead.stage === 'PROPOSTA_ENVIADA' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                                OBRIGATÓRIO PARA FORMALIZAR PROPOSTA
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold">
                            Custódia de Documentos de {lead.name}
                          </h3>
                          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                            Centralize RG, CPF, Comprovante de Residência, Estado Civil, Holerites e IRPF com link seguro de envio ao cliente e conferência com carimbo digital.
                          </p>
                        </div>

                        {/* Request Link Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                          <button
                            onClick={() => setIsAiAuditModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                            title="Cruzar dados dos documentos da custódia com o cadastro do cliente e corrigir erros automaticamente com IA gratuita"
                          >
                            <Sparkles className="w-4 h-4 text-purple-200" />
                            <span>Auditoria IA de Custódia</span>
                          </button>
                          <button
                            onClick={() => setIsCustomerPortalOpen(true)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                            title="Abrir o link real e página de envio de documentos do cliente"
                          >
                            <ExternalLink className="w-4 h-4 text-white" />
                            <span>Abrir Link Real (Portal)</span>
                          </button>
                          <button
                            onClick={handleCopyLink}
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Copy className="w-4 h-4 text-blue-300" />
                            <span>{copiedCustodyLinkToast ? 'Link Copiado!' : 'Copiar Link Seguro'}</span>
                          </button>
                          <button
                            onClick={handleSendWhatsAppCustody}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>Solicitar no WhatsApp</span>
                          </button>
                        </div>
                      </div>

                      {/* Progress summary bar */}
                      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-300">
                            Status da Pasta: <strong className="text-emerald-400">{approvedCount} Aprovados</strong> • <strong className="text-blue-300">{inAnalysisCount} Em Análise</strong> • <strong className="text-amber-400">{pendingCount} Pendentes</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">Token SHA:</span>
                          <code className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[10px] text-blue-300">
                            {custodyToken}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Simulation reset if switched */}
                    {simulatedRoleOverride && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900">
                        <span>Você está simulando o acesso como <strong>{simulatedRoleOverride}</strong>.</span>
                        <button
                          onClick={() => setSimulatedRoleOverride(null)}
                          className="font-bold underline text-blue-700 hover:text-blue-800"
                        >
                          Voltar ao perfil real
                        </button>
                      </div>
                    )}

                    {/* Document List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Documentos Exigidos para Formalização da Proposta:</span>
                        <span className="text-slate-500 font-normal">{custodyDocs.length} itens no checklist</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {custodyDocs.map(doc => {
                          const isApproved = doc.status === 'APROVADO';
                          const isInAnalysis = doc.status === 'EM_ANALISE';
                          const isRejected = doc.status === 'REJEITADO';
                          const isPending = doc.status === 'PENDENTE';

                          return (
                            <div
                              key={doc.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                isApproved
                                  ? 'bg-emerald-50/50 border-emerald-200'
                                  : isInAnalysis
                                  ? 'bg-blue-50/50 border-blue-200'
                                  : isRejected
                                  ? 'bg-rose-50/50 border-rose-200'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  isApproved
                                    ? 'bg-emerald-600 text-white'
                                    : isInAnalysis
                                    ? 'bg-blue-600 text-white'
                                    : isRejected
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {isApproved ? (
                                    <Check className="w-5 h-5" />
                                  ) : isRejected ? (
                                    <X className="w-5 h-5" />
                                  ) : (
                                    <FileText className="w-5 h-5" />
                                  )}
                                </div>

                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      isApproved
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : isInAnalysis
                                        ? 'bg-blue-100 text-blue-800'
                                        : isRejected
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {doc.status.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">{doc.description}</p>
                                  {doc.fileName && (
                                    <div className="text-[11px] text-slate-600 flex items-center gap-2 font-mono">
                                      <span>📄 {doc.fileName}</span>
                                      <span>•</span>
                                      <span>{doc.fileSize}</span>
                                      {doc.uploadedAt && <span>• Enviado: {doc.uploadedAt}</span>}
                                    </div>
                                  )}
                                  {doc.reviewedBy && (
                                    <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Validado por {doc.reviewedBy} em {doc.reviewedAt}
                                    </div>
                                  )}
                                  {doc.rejectionReason && (
                                    <div className="text-[11px] text-rose-700 font-semibold">
                                      Motivo da Recusa: {doc.rejectionReason}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Document Action Buttons */}
                              <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                                {doc.fileName && (
                                  <>
                                    <button
                                      onClick={() => setSelectedPreviewDoc(doc)}
                                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                                      Visualizar
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (doc.fileUrl) {
                                          const a = document.createElement('a');
                                          a.href = doc.fileUrl;
                                          a.download = doc.fileName || `${doc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`;
                                          a.click();
                                        } else {
                                          const certContent = `TERMO DE CUSTÓDIA DE DOCUMENTO DIGITAL - ACERTGO CRM\n` +
                                            `Documento: ${doc.title}\n` +
                                            `Titular: ${lead.name}\n` +
                                            `CPF: ${lead.cpf || '234.567.890-12'}\n` +
                                            `Hash SHA-256: ${doc.sha256Hash || '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945'}\n` +
                                            `Status: ${doc.status}\n` +
                                            `Data de Emissão: ${new Date().toLocaleString('pt-BR')}\n` +
                                            `Validade Jurídica: ICP-Brasil / LGPD Art. 7º Lei 13.709/2018\n`;
                                          const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
                                          const url = URL.createObjectURL(blob);
                                          const a = document.createElement('a');
                                          a.href = url;
                                          a.download = `${doc.title.toLowerCase().replace(/\s+/g, '_')}_termo_custodia.txt`;
                                          a.click();
                                        }
                                      }}
                                      className="p-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 cursor-pointer"
                                      title="Baixar Arquivo Real"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={() => {
                                    setUploadingDocId(doc.id);
                                    if (custodyFileInputRef.current) {
                                      custodyFileInputRef.current.value = '';
                                      custodyFileInputRef.current.click();
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                  title="Selecionar arquivo real do seu computador"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  {doc.fileName ? 'Substituir' : 'Subir Anexo'}
                                </button>

                                {isInAnalysis && (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleApprove(doc.id)}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      Aprovar
                                    </button>
                                    <button
                                      onClick={() => setRejectingDocId(doc.id)}
                                      className="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      Recusar
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Reject Document Modal Dialog */}
                {rejectingDocId && (
                  <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          Motivo da Recusa do Documento
                        </h4>
                        <button onClick={() => setRejectingDocId(null)} className="text-slate-400 hover:text-slate-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Informe o motivo da recusa para orientar o comprador a reenviar o documento corrigido.
                      </p>
                      <textarea
                        rows={3}
                        value={rejectionReasonInput}
                        onChange={e => setRejectionReasonInput(e.target.value)}
                        placeholder="Ex: Documento com validade expirada ou foto ilegível..."
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setRejectingDocId(null)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleConfirmReject}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar Recusa
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Preview Modal */}
                {selectedPreviewDoc && (
                  <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{selectedPreviewDoc.title}</h4>
                            <p className="text-[11px] text-slate-500 font-mono">{selectedPreviewDoc.fileName}</p>
                          </div>
                        </div>
                        <button onClick={() => setSelectedPreviewDoc(null)} className="text-slate-400 hover:text-slate-700">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Document Preview Paper / Real Image */}
                      {selectedPreviewDoc.fileUrl && selectedPreviewDoc.fileUrl.startsWith('data:image/') ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 text-center space-y-2 max-h-[420px] overflow-auto flex flex-col items-center justify-center">
                          <img 
                            src={selectedPreviewDoc.fileUrl} 
                            alt={selectedPreviewDoc.title}
                            className="max-h-[360px] w-auto object-contain rounded-xl shadow-lg border border-slate-700" 
                          />
                          <div className="text-[11px] text-slate-400 font-mono">
                            {selectedPreviewDoc.fileName} • {selectedPreviewDoc.fileSize}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4 min-h-[220px] flex flex-col items-center justify-center">
                          <FileText className="w-16 h-16 text-blue-500/60" />
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-800">{selectedPreviewDoc.title}</div>
                            <div className="text-[11px] text-slate-500">Documento custodiado em conformidade com o Art. 7º da LGPD.</div>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-left font-mono text-[10px] text-slate-600 space-y-1 max-w-md w-full">
                            <div><strong>Titular:</strong> {lead.name}</div>
                            <div><strong>CPF:</strong> {lead.cpf || '234.567.890-12'}</div>
                            <div><strong>Arquivo:</strong> {selectedPreviewDoc.fileName || 'documento_digital.pdf'} ({selectedPreviewDoc.fileSize || '1.8 MB'})</div>
                            <div><strong>SHA-256:</strong> {selectedPreviewDoc.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</div>
                            <div><strong>Carimbo:</strong> ICP-Brasil Timestamp • Autenticado com Validade Jurídica</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-500">
                          Status: <strong className="text-emerald-700">{selectedPreviewDoc.status}</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPreviewDoc(null)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span>ID: <code className="font-mono">{lead.id}</code></span>
            <span>•</span>
            <span>Última mensagem: {lead.lastMessageTime}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors"
          >
            Fechar Ficha
          </button>
        </div>
      </div>

      {/* Complete Follow-up Modal Dialog (with Outcome Notes + Prompt for Next Step) */}
      {completingFollowUpId && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Concluir Follow-up
              </h3>
              <button
                onClick={() => setCompletingFollowUpId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Registre o desfecho deste contato com <strong>{lead.name}</strong> para auditoria e histórico da negociação:
            </p>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Resultado do Contato / O que o cliente disse: *
                </label>
                <button
                  type="button"
                  onClick={() => handleToggleVoiceRecognition('outcome_notes')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    isListening && voiceTarget === 'outcome_notes'
                      ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400/50'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={
                    isListening && voiceTarget === 'outcome_notes'
                      ? 'Parar gravação'
                      : 'Ditar resultado do contato por voz (Web Speech API)'
                  }
                >
                  {isListening && voiceTarget === 'outcome_notes' ? (
                    <>
                      <Radio className="w-3 h-3 text-white animate-ping" />
                      <span>Ouvindo...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-emerald-600" />
                      <span>Ditar por Voz</span>
                    </>
                  )}
                </button>
              </div>

              {isListening && voiceTarget === 'outcome_notes' && speechInterim && (
                <div className="mb-2 p-2 bg-purple-50 rounded-lg border border-purple-200 text-xs italic text-purple-900 flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-pulse shrink-0" />
                  <span className="truncate">"... {speechInterim} ..."</span>
                </div>
              )}

              <textarea
                rows={3}
                required
                placeholder="Ex: Cliente atendeu, gostou do decorado e pediu para agendarmos reunião com o gerente do banco na sexta..."
                value={outcomeNotes}
                onChange={(e) => setOutcomeNotes(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              />
            </div>

            {/* Quick Next Follow-up Agendamento */}
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-blue-900 font-bold select-none">
                <input
                  type="checkbox"
                  checked={scheduleNextPrompt}
                  onChange={(e) => setScheduleNextPrompt(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Agendar imediatamente o próximo passo (Não deixar o lead esfriar)</span>
              </label>

              {scheduleNextPrompt && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-100">
                  <input
                    type="text"
                    placeholder="Próximo passo (ex: Enviar simulação atualizada)"
                    value={nextTitle}
                    onChange={(e) => setNextTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-blue-300 rounded-lg bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      className="px-2 py-1.5 text-xs border border-blue-300 rounded-lg bg-white"
                    />
                    <select
                      value={nextChannel}
                      onChange={(e) => setNextChannel(e.target.value as FollowUpChannel)}
                      className="px-2 py-1.5 text-xs border border-blue-300 rounded-lg bg-white font-medium"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="LIGACAO">Ligação</option>
                      <option value="VISITA">Visita</option>
                      <option value="REUNIAO">Reunião</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCompletingFollowUpId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar & Concluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Loss Modal */}
      {showLossModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Motivo Obrigatório de Perda do Lead
              </h3>
              <button
                onClick={() => setShowLossModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Para relatórios de BI e contorno de objeções, informe por que a negociação não prosseguiu:
            </p>

            <textarea
              rows={3}
              placeholder="Ex: Comprou com construtora concorrente; reprovado no crédito bancário; preferiu locação..."
              value={lossReasonText}
              onChange={(e) => setLossReasonText(e.target.value)}
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-hidden"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowLossModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLoss}
                disabled={!lossReasonText.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs disabled:opacity-50"
              >
                Confirmar Perda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Property Radar Modal */}
      {showRadarModal && (
        <LeadPropertyRadarModal
          isOpen={showRadarModal}
          onClose={() => setShowRadarModal(false)}
          lead={lead}
          properties={properties}
          onSelectPropertyForLead={onSelectPropertyForLead}
        />
      )}

      {/* Free AI Tools & Custody Audit Modal */}
      {isAiAuditModalOpen && (
        <FreeAiToolsHubModal
          isOpen={isAiAuditModalOpen}
          onClose={() => setIsAiAuditModalOpen(false)}
          leads={[lead]}
          properties={properties}
          onUpdateLead={onUpdateLead}
          initialLeadId={lead.id}
          initialTab="custody_audit"
        />
      )}
    </div>
  );
};

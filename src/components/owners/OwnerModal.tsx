import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  Check, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  HeartHandshake,
  Calendar,
  Cake,
  Camera,
  Scan,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
  Owner, 
  OwnerPersonType, 
  OwnerStatus, 
  MaritalStatus 
} from '../../types/crm';
import { OwnerDocumentOcrModal } from './OwnerDocumentOcrModal';
import { ExtractedDocumentData } from '../../services/documentOcrService';

interface OwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ownerData: Partial<Owner>) => void;
  ownerToEdit?: Owner | null;
  initialExtractedData?: ExtractedDocumentData | null;
}

const BRAZILIAN_BANKS = [
  { code: '341', name: '341 - Itaú Unibanco' },
  { code: '001', name: '001 - Banco do Brasil' },
  { code: '033', name: '033 - Banco Santander' },
  { code: '237', name: '237 - Banco Bradesco' },
  { code: '104', name: '104 - Caixa Econômica Federal' },
  { code: '260', name: '260 - Nubank (Nu Pagamentos)' },
  { code: '077', name: '077 - Banco Inter' },
  { code: '208', name: '208 - Banco BTG Pactual' },
  { code: '336', name: '336 - C6 Bank' },
  { code: '422', name: '422 - Banco Safra' },
  { code: '212', name: '212 - Banco Original' },
  { code: '748', name: '748 - Banco Sicredi' },
  { code: '756', name: '756 - Sicoob' },
];

export const OwnerModal: React.FC<OwnerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  ownerToEdit,
  initialExtractedData,
}) => {
  const [personType, setPersonType] = useState<OwnerPersonType>('PF');
  
  // OCR Reader Modal state
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [ocrSuccessNotice, setOcrSuccessNotice] = useState<string | null>(null);
  
  // Basic & Civil
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [document, setDocument] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [stateRegistration, setStateRegistration] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('SOLTEIRO');
  const [profession, setProfession] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [spouseCpf, setSpouseCpf] = useState('');
  const [propertyRegime, setPropertyRegime] = useState('Comunhão Parcial de Bens');
  
  // Cônjuge / Parceiro para Futuros Contratos
  const [hasSpousePartner, setHasSpousePartner] = useState(false);
  const [spousePartnerRg, setSpousePartnerRg] = useState('');
  const [spousePartnerProfession, setSpousePartnerProfession] = useState('');
  const [spousePartnerEmail, setSpousePartnerEmail] = useState('');
  const [spousePartnerPhone, setSpousePartnerPhone] = useState('');
  const [spousePartnerRole, setSpousePartnerRole] = useState<'CO_PROPRIETARIO' | 'ANUENTE_OUTORGA' | 'BENEFICIARIO_REPASSE'>('CO_PROPRIETARIO');
  const [spousePartnerNotes, setSpousePartnerNotes] = useState('');

  // Legal Representative (PJ)
  const [repName, setRepName] = useState('');
  const [repCpf, setRepCpf] = useState('');
  const [repRole, setRepRole] = useState('Diretor / Administrador');
  const [repPhone, setRepPhone] = useState('');
  const [repEmail, setRepEmail] = useState('');

  // Contacts
  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');

  // Address
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');

  // Bank & Split Details
  const [bankCode, setBankCode] = useState('341');
  const [accountType, setAccountType] = useState<'CORRENTE' | 'POUPANCA' | 'PAGAMENTO'>('CORRENTE');
  const [agency, setAgency] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountDigit, setAccountDigit] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA'>('CPF');
  const [pixKey, setPixKey] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountHolderDocument, setAccountHolderDocument] = useState('');

  // Status & Notes
  const [status, setStatus] = useState<OwnerStatus>('ATIVO');
  const [notes, setNotes] = useState('');

  const [activeTab, setActiveTab] = useState<'DADOS' | 'CONTATO_ENDERECO' | 'FINANCEIRO'>('DADOS');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (ownerToEdit) {
      setPersonType(ownerToEdit.personType);
      setName(ownerToEdit.name);
      setTradeName(ownerToEdit.tradeName || '');
      setDocument(ownerToEdit.document);
      setRg(ownerToEdit.rg || '');
      setBirthDate(ownerToEdit.birthDate || '');
      setStateRegistration(ownerToEdit.stateRegistration || '');
      setMaritalStatus(ownerToEdit.maritalStatus || 'SOLTEIRO');
      setProfession(ownerToEdit.profession || '');
      setSpouseName(ownerToEdit.spouseName || '');
      setSpouseCpf(ownerToEdit.spouseCpf || '');
      setPropertyRegime(ownerToEdit.propertyRegime || 'Comunhão Parcial de Bens');

      if (ownerToEdit.spousePartner) {
        setHasSpousePartner(ownerToEdit.spousePartner.hasSpousePartner);
        setSpouseName(ownerToEdit.spousePartner.name || ownerToEdit.spouseName || '');
        setSpouseCpf(ownerToEdit.spousePartner.cpf || ownerToEdit.spouseCpf || '');
        setSpousePartnerRg(ownerToEdit.spousePartner.rg || '');
        setSpousePartnerProfession(ownerToEdit.spousePartner.profession || '');
        setSpousePartnerEmail(ownerToEdit.spousePartner.email || '');
        setSpousePartnerPhone(ownerToEdit.spousePartner.phone || '');
        setPropertyRegime(ownerToEdit.spousePartner.propertyRegime || ownerToEdit.propertyRegime || 'Comunhão Parcial de Bens');
        setSpousePartnerRole(ownerToEdit.spousePartner.roleInFutureContracts || 'CO_PROPRIETARIO');
        setSpousePartnerNotes(ownerToEdit.spousePartner.notes || '');
      } else if (ownerToEdit.spouseName || ownerToEdit.maritalStatus === 'CASADO' || ownerToEdit.maritalStatus === 'UNIAO_ESTAVEL') {
        setHasSpousePartner(true);
        setSpouseName(ownerToEdit.spouseName || '');
        setSpouseCpf(ownerToEdit.spouseCpf || '');
        setPropertyRegime(ownerToEdit.propertyRegime || 'Comunhão Parcial de Bens');
        setSpousePartnerRg('');
        setSpousePartnerProfession('');
        setSpousePartnerEmail('');
        setSpousePartnerPhone('');
        setSpousePartnerRole('CO_PROPRIETARIO');
        setSpousePartnerNotes('');
      } else {
        setHasSpousePartner(false);
        setSpousePartnerRg('');
        setSpousePartnerProfession('');
        setSpousePartnerEmail('');
        setSpousePartnerPhone('');
        setSpousePartnerRole('CO_PROPRIETARIO');
        setSpousePartnerNotes('');
      }

      if (ownerToEdit.legalRepresentative) {
        setRepName(ownerToEdit.legalRepresentative.name || '');
        setRepCpf(ownerToEdit.legalRepresentative.cpf || '');
        setRepRole(ownerToEdit.legalRepresentative.role || '');
        setRepPhone(ownerToEdit.legalRepresentative.phone || '');
        setRepEmail(ownerToEdit.legalRepresentative.email || '');
      }

      setEmail(ownerToEdit.email);
      setSecondaryEmail(ownerToEdit.secondaryEmail || '');
      setPhone(ownerToEdit.phone);
      setSecondaryPhone(ownerToEdit.secondaryPhone || '');

      setCep(ownerToEdit.address.cep);
      setStreet(ownerToEdit.address.street);
      setNumber(ownerToEdit.address.number);
      setComplement(ownerToEdit.address.complement || '');
      setNeighborhood(ownerToEdit.address.neighborhood);
      setCity(ownerToEdit.address.city);
      setState(ownerToEdit.address.state);

      setBankCode(ownerToEdit.bankDetails.bankCode);
      setAccountType(ownerToEdit.bankDetails.accountType);
      setAgency(ownerToEdit.bankDetails.agency);
      setAccountNumber(ownerToEdit.bankDetails.accountNumber);
      setAccountDigit(ownerToEdit.bankDetails.accountDigit);
      setPixKeyType(ownerToEdit.bankDetails.pixKeyType);
      setPixKey(ownerToEdit.bankDetails.pixKey);
      setAccountHolderName(ownerToEdit.bankDetails.accountHolderName);
      setAccountHolderDocument(ownerToEdit.bankDetails.accountHolderDocument);

      setStatus(ownerToEdit.status);
      setNotes(ownerToEdit.notes || '');
    } else {
      resetForm();
    }
  }, [ownerToEdit, isOpen]);

  // Apply initial extracted data if modal was opened via external OCR scan
  useEffect(() => {
    if (initialExtractedData && isOpen) {
      handleApplyOcrData(initialExtractedData);
    }
  }, [initialExtractedData, isOpen]);

  // Handle OCR extracted data application to form fields
  const handleApplyOcrData = (data: ExtractedDocumentData) => {
    if (data.name) setName(data.name);
    
    if (data.document) {
      setDocument(data.document);
      const digits = data.document.replace(/\D/g, '');
      if (digits.length === 14) {
        setPersonType('PJ');
        setPixKeyType('CNPJ');
      } else {
        setPersonType('PF');
        setPixKeyType('CPF');
      }
    }
    
    if (data.rg) setRg(data.rg);
    if (data.birthDate) setBirthDate(data.birthDate);
    if (data.maritalStatus) setMaritalStatus(data.maritalStatus);
    if (data.profession) setProfession(data.profession);
    if (data.phone) setPhone(data.phone);
    if (data.email) setEmail(data.email);

    if (data.address) {
      if (data.address.cep) setCep(data.address.cep);
      if (data.address.street) setStreet(data.address.street);
      if (data.address.number) setNumber(data.address.number);
      if (data.address.complement) setComplement(data.address.complement);
      if (data.address.neighborhood) setNeighborhood(data.address.neighborhood);
      if (data.address.city) setCity(data.address.city);
      if (data.address.state) setState(data.address.state);
    }

    if (!accountHolderName && data.name) {
      setAccountHolderName(data.name);
    }
    if (!accountHolderDocument && data.document) {
      setAccountHolderDocument(data.document);
    }

    setOcrSuccessNotice(
      `Dados do documento (${data.documentType}) extraídos com ${data.confidenceScore}% de precisão e aplicados com sucesso!`
    );
    setIsOcrModalOpen(false);
  };

  const resetForm = () => {
    setOcrSuccessNotice(null);
    setPersonType('PF');
    setName('');
    setTradeName('');
    setDocument('');
    setRg('');
    setBirthDate('');
    setStateRegistration('');
    setMaritalStatus('SOLTEIRO');
    setProfession('');
    setSpouseName('');
    setSpouseCpf('');
    setPropertyRegime('Comunhão Parcial de Bens');
    setHasSpousePartner(false);
    setSpousePartnerRg('');
    setSpousePartnerProfession('');
    setSpousePartnerEmail('');
    setSpousePartnerPhone('');
    setSpousePartnerRole('CO_PROPRIETARIO');
    setSpousePartnerNotes('');
    setRepName('');
    setRepCpf('');
    setRepRole('Diretor / Administrador');
    setRepPhone('');
    setRepEmail('');
    setEmail('');
    setSecondaryEmail('');
    setPhone('');
    setSecondaryPhone('');
    setCep('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('São Paulo');
    setState('SP');
    setBankCode('341');
    setAccountType('CORRENTE');
    setAgency('');
    setAccountNumber('');
    setAccountDigit('');
    setPixKeyType('CPF');
    setPixKey('');
    setAccountHolderName('');
    setAccountHolderDocument('');
    setStatus('ATIVO');
    setNotes('');
    setActiveTab('DADOS');
    setErrorMsg('');
  };

  const handleCopyHolderInfo = () => {
    setAccountHolderName(name);
    setAccountHolderDocument(document);
  };

  const handleSimulateCep = () => {
    if (!cep) return;
    const clean = cep.replace(/\D/g, '');
    if (clean.startsWith('014')) {
      setStreet('Rua Oscar Freire');
      setNeighborhood('Cerqueira César / Jardins');
      setCity('São Paulo');
      setState('SP');
    } else if (clean.startsWith('045')) {
      setStreet('Rua Tabapuã');
      setNeighborhood('Itaim Bibi');
      setCity('São Paulo');
      setState('SP');
    } else if (clean.startsWith('064')) {
      setStreet('Alameda Rio Negro');
      setNeighborhood('Alphaville Industrial');
      setCity('Barueri');
      setState('SP');
    } else {
      setStreet('Avenida Paulista');
      setNeighborhood('Bela Vista');
      setCity('São Paulo');
      setState('SP');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor, informe o Nome Completo ou Razão Social do proprietário.');
      setActiveTab('DADOS');
      return;
    }
    if (!document.trim()) {
      setErrorMsg('Por favor, informe o CPF ou CNPJ.');
      setActiveTab('DADOS');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Por favor, informe o telefone/WhatsApp de contato.');
      setActiveTab('CONTATO_ENDERECO');
      return;
    }

    const selectedBank = BRAZILIAN_BANKS.find(b => b.code === bankCode);
    const bankName = selectedBank ? selectedBank.name.split(' - ')[1] || selectedBank.name : 'Banco';

    const payload: Partial<Owner> = {
      personType,
      name: name.trim(),
      tradeName: personType === 'PJ' ? tradeName.trim() : undefined,
      document: document.trim(),
      rg: personType === 'PF' ? rg.trim() : undefined,
      birthDate: personType === 'PF' && birthDate ? birthDate.trim() : undefined,
      stateRegistration: personType === 'PJ' ? stateRegistration.trim() : undefined,
      maritalStatus: personType === 'PF' ? maritalStatus : undefined,
      profession: personType === 'PF' ? profession.trim() : undefined,
      spouseName: personType === 'PF' && (hasSpousePartner || maritalStatus === 'CASADO' || maritalStatus === 'UNIAO_ESTAVEL') ? spouseName.trim() : undefined,
      spouseCpf: personType === 'PF' && (hasSpousePartner || maritalStatus === 'CASADO' || maritalStatus === 'UNIAO_ESTAVEL') ? spouseCpf.trim() : undefined,
      propertyRegime: personType === 'PF' && (hasSpousePartner || maritalStatus === 'CASADO') ? propertyRegime : undefined,
      spousePartner: personType === 'PF' && hasSpousePartner ? {
        hasSpousePartner: true,
        name: spouseName.trim(),
        cpf: spouseCpf.trim(),
        rg: spousePartnerRg.trim(),
        profession: spousePartnerProfession.trim(),
        email: spousePartnerEmail.trim(),
        phone: spousePartnerPhone.trim(),
        propertyRegime,
        roleInFutureContracts: spousePartnerRole,
        notes: spousePartnerNotes.trim(),
      } : undefined,
      legalRepresentative: personType === 'PJ' ? {
        name: repName.trim(),
        cpf: repCpf.trim(),
        role: repRole.trim(),
        phone: repPhone.trim(),
        email: repEmail.trim(),
      } : undefined,
      email: email.trim(),
      secondaryEmail: secondaryEmail.trim(),
      phone: phone.trim(),
      secondaryPhone: secondaryPhone.trim(),
      address: {
        cep: cep.trim(),
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim(),
      },
      bankDetails: {
        bankCode,
        bankName,
        accountType,
        agency: agency.trim(),
        accountNumber: accountNumber.trim(),
        accountDigit: accountDigit.trim(),
        pixKeyType,
        pixKey: pixKey.trim(),
        accountHolderName: accountHolderName.trim() || name.trim(),
        accountHolderDocument: accountHolderDocument.trim() || document.trim(),
      },
      status,
      notes: notes.trim(),
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              {personType === 'PF' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {ownerToEdit ? 'Editar Proprietário' : 'Novo Cadastro de Proprietário'}
              </h2>
              <p className="text-xs text-slate-500">
                Pessoa Física ou Jurídica com gestão bancária para split de repasse
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOcrModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              title="Capture a imagem do documento (CNH/RG) com a câmera ou faça upload para preencher os campos automaticamente"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Escanear Documento (OCR)</span>
              <span className="sm:hidden">OCR Câmera</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-white/20 text-white uppercase">IA</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* OCR Success notice */}
        {ocrSuccessNotice && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{ocrSuccessNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setOcrSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error notice */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Person Type Selector Bar */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setPersonType('PF'); setPixKeyType('CPF'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                personType === 'PF'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Pessoa Física (PF)</span>
            </button>
            <button
              type="button"
              onClick={() => { setPersonType('PJ'); setPixKeyType('CNPJ'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                personType === 'PJ'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Pessoa Jurídica (PJ)</span>
            </button>
          </div>

          {/* Form Tabs */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white">
            <button
              type="button"
              onClick={() => setActiveTab('DADOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'DADOS' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Identificação & Civil
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CONTATO_ENDERECO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'CONTATO_ENDERECO' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contatos & Endereço
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('FINANCEIRO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'FINANCEIRO' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Dados Bancários & Split
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* TAB 1: DADOS IDENTIFICAÇÃO */}
          {activeTab === 'DADOS' && (
            <div className="space-y-5">
              
              {/* OCR Quick Action Banner */}
              {!ownerToEdit && (
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                      <Scan className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Preenchimento Rápido via Câmera (OCR)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Inteligência Artificial
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Capture a CNH ou RG do proprietário pela câmera ou envie uma imagem para preencher nome, CPF, RG, nascimento e endereço automaticamente.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOcrModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Abrir Câmera / OCR</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  {personType === 'PF' ? 'Dados Pessoais (Pessoa Física)' : 'Dados Empresariais (Pessoa Jurídica)'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {personType === 'PF' ? 'Nome Completo *' : 'Razão Social *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={personType === 'PF' ? 'Ex: Dr. Cláudio Prado Junqueira' : 'Ex: Vanguard Patrimonial & Participações S/A'}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium"
                    />
                  </div>

                  {personType === 'PJ' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome Fantasia
                      </label>
                      <input
                        type="text"
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        placeholder="Ex: Grupo Vanguard"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {personType === 'PF' ? 'CPF *' : 'CNPJ *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      placeholder={personType === 'PF' ? '000.000.000-00' : '00.000.000/0001-00'}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>

                  {personType === 'PF' ? (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          RG / Órgão Emissor
                        </label>
                        <input
                          type="text"
                          value={rg}
                          onChange={(e) => setRg(e.target.value)}
                          placeholder="Ex: 24.891.023-X SSP/SP"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            Data de Nascimento
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">Felicitações automáticas</span>
                        </label>
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Profissão
                        </label>
                        <input
                          type="text"
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          placeholder="Ex: Médico Cardiologista"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inscrição Estadual (IE) / CCM
                      </label>
                      <input
                        type="text"
                        value={stateRegistration}
                        onChange={(e) => setStateRegistration(e.target.value)}
                        placeholder="Ex: 114.892.401.110 ou Isento"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status Cadastral
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as OwnerStatus)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="ATIVO">Ativo (Habilitado para Repasses e Vendas)</option>
                      <option value="EM_ANALISE">Em Análise / Documentação Pendente</option>
                      <option value="BLOQUEADO">Bloqueado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PF: Estado Civil & Cônjuge / Parceiro para Futuro Contrato */}
              {personType === 'PF' && (
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-blue-600" />
                      Estado Civil & Cônjuge / Parceiro para Futuro Contrato
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={hasSpousePartner}
                        onChange={(e) => setHasSpousePartner(e.target.checked)}
                        className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Incluir Cônjuge / Parceiro no Contrato
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estado Civil
                      </label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => {
                          const val = e.target.value as MaritalStatus;
                          setMaritalStatus(val);
                          if (val === 'CASADO' || val === 'UNIAO_ESTAVEL') {
                            setHasSpousePartner(true);
                          }
                        }}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      >
                        <option value="SOLTEIRO">Solteiro(a)</option>
                        <option value="CASADO">Casado(a)</option>
                        <option value="UNIAO_ESTAVEL">União Estável</option>
                        <option value="DIVORCIADO">Divorciado(a)</option>
                        <option value="VIUVO">Viúvo(a)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Regime de Bens
                      </label>
                      <select
                        value={propertyRegime}
                        onChange={(e) => setPropertyRegime(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      >
                        <option value="Comunhão Parcial de Bens">Comunhão Parcial de Bens (Regra geral Lei 6.515/77)</option>
                        <option value="Comunhão Universal de Bens">Comunhão Universal de Bens (com pacto antenupcial)</option>
                        <option value="Separação Total de Bens">Separação Total / Absoluta de Bens</option>
                        <option value="Participação Final nos Aquestos">Participação Final nos Aquestos</option>
                        <option value="Não se aplica / Outro">Não se aplica / Outro</option>
                      </select>
                    </div>
                  </div>

                  {hasSpousePartner && (
                    <div className="pt-3 border-t border-slate-200 mt-2 space-y-3 bg-white p-3.5 rounded-xl border">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                        <span>Dados do Cônjuge / Parceiro (Qualificação Contratual)</span>
                        <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">
                          Para minutas de locação e compra/venda
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nome Completo do Cônjuge / Parceiro *
                          </label>
                          <input
                            type="text"
                            value={spouseName}
                            onChange={(e) => setSpouseName(e.target.value)}
                            placeholder="Ex: Dra. Juliana Vasconcelos Prado"
                            className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            CPF do Cônjuge / Parceiro *
                          </label>
                          <input
                            type="text"
                            value={spouseCpf}
                            onChange={(e) => setSpouseCpf(e.target.value)}
                            placeholder="000.000.000-00"
                            className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            RG / Órgão Emissor
                          </label>
                          <input
                            type="text"
                            value={spousePartnerRg}
                            onChange={(e) => setSpousePartnerRg(e.target.value)}
                            placeholder="Ex: 31.980.112-8 SSP/SP"
                            className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Profissão do Cônjuge
                          </label>
                          <input
                            type="text"
                            value={spousePartnerProfession}
                            onChange={(e) => setSpousePartnerProfession(e.target.value)}
                            placeholder="Ex: Arquiteta Urbanista"
                            className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Papel no Contrato
                          </label>
                          <select
                            value={spousePartnerRole}
                            onChange={(e) => setSpousePartnerRole(e.target.value as any)}
                            className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                          >
                            <option value="CO_PROPRIETARIO">Co-proprietário / Co-locador</option>
                            <option value="ANUENTE_OUTORGA">Anuente (Outorga Uxória / Marital)</option>
                            <option value="BENEFICIARIO_REPASSE">Beneficiário do Repasse de Aluguel</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Telefone / WhatsApp do Cônjuge
                          </label>
                          <input
                            type="text"
                            value={spousePartnerPhone}
                            onChange={(e) => setSpousePartnerPhone(e.target.value)}
                            placeholder="(11) 98888-2222"
                            className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            E-mail do Cônjuge
                          </label>
                          <input
                            type="email"
                            value={spousePartnerEmail}
                            onChange={(e) => setSpousePartnerEmail(e.target.value)}
                            placeholder="conjuge.proprietario@email.com"
                            className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PJ: Representante Legal */}
              {personType === 'PJ' && (
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    Representante Legal / Sócio Administrador
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome do Representante
                      </label>
                      <input
                        type="text"
                        value={repName}
                        onChange={(e) => setRepName(e.target.value)}
                        placeholder="Ex: Roberto Mendonça da Silva"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CPF do Representante
                      </label>
                      <input
                        type="text"
                        value={repCpf}
                        onChange={(e) => setRepCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cargo / Função
                      </label>
                      <input
                        type="text"
                        value={repRole}
                        onChange={(e) => setRepRole(e.target.value)}
                        placeholder="Ex: Diretor Executivo / Sócio Administrador"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Telefone do Representante
                      </label>
                      <input
                        type="text"
                        value={repPhone}
                        onChange={(e) => setRepPhone(e.target.value)}
                        placeholder="(11) 98450-8900"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        E-mail do Representante
                      </label>
                      <input
                        type="email"
                        value={repEmail}
                        onChange={(e) => setRepEmail(e.target.value)}
                        placeholder="representante@empresa.com.br"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONTATOS & ENDEREÇO */}
          {activeTab === 'CONTATO_ENDERECO' && (
            <div className="space-y-5">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Canais de Comunicação
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Telefone Principal *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99882-1100"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone Secundário / Fixo
                    </label>
                    <input
                      type="text"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      placeholder="(11) 3088-4422"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail Principal *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="proprietario@email.com.br"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail Secundário / Financeiro
                    </label>
                    <input
                      type="email"
                      value={secondaryEmail}
                      onChange={(e) => setSecondaryEmail(e.target.value)}
                      placeholder="financeiro@email.com.br"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço de Correspondência */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Endereço de Domicílio / Correspondência
                  </h3>
                  <button
                    type="button"
                    onClick={handleSimulateCep}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    Buscar CEP
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="01426-001"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Logradouro (Rua / Avenida)
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Rua Bela Cintra"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="2105"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto 181, Bloco B"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Cerqueira César"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Observações Internas */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações Internas (Visível apenas para equipe)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Prefere receber notificações por WhatsApp. Dia de repasse preferencial no dia 10..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 3: DADOS BANCÁRIOS & SPLIT FINTECH */}
          {activeTab === 'FINANCEIRO' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block">Motor Fintech & Split Automatizado (Asaas / Bancos)</span>
                  Estes dados são utilizados para o split imediato do aluguel: a imobiliária retém sua taxa de administração e repassa o líquido para o proprietário via Pix ou TED no mesmo segundo da liquidação do boleto/Pix do inquilino.
                </div>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Conta Bancária para Repasse
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyHolderInfo}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Usar mesmo Nome e CPF/CNPJ do titular
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Instituição Financeira (Banco)
                    </label>
                    <select
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    >
                      {BRAZILIAN_BANKS.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo de Conta
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="CORRENTE">Conta Corrente</option>
                      <option value="POUPANCA">Conta Poupança</option>
                      <option value="PAGAMENTO">Conta Pagamento (Fintech)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Agência (sem dígito)
                    </label>
                    <input
                      type="text"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      placeholder="Ex: 0842"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número da Conta
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Ex: 48920"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dígito da Conta
                    </label>
                    <input
                      type="text"
                      value={accountDigit}
                      onChange={(e) => setAccountDigit(e.target.value)}
                      placeholder="Ex: 4"
                      maxLength={2}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome do Titular da Conta
                    </label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="Nome exatamente como no banco"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CPF / CNPJ do Titular da Conta
                    </label>
                    <input
                      type="text"
                      value={accountHolderDocument}
                      onChange={(e) => setAccountHolderDocument(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Chave Pix para Liquidação Instantânea */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Chave Pix Principal (Split Imediato)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo de Chave Pix
                    </label>
                    <select
                      value={pixKeyType}
                      onChange={(e) => setPixKeyType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="TELEFONE">Telefone (+55)</option>
                      <option value="ALEATORIA">Chave Aleatória (EVP)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chave Pix
                    </label>
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder={pixKeyType === 'CPF' ? '142.890.348-12' : pixKeyType === 'EMAIL' ? 'proprietario@email.com' : 'Informe a chave Pix'}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <div className="flex items-center gap-2">
              {activeTab !== 'FINANCEIRO' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'DADOS') setActiveTab('CONTATO_ENDERECO');
                    else if (activeTab === 'CONTATO_ENDERECO') setActiveTab('FINANCEIRO');
                  }}
                  className="px-5 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  Avançar →
                </button>
              ) : null}
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Proprietário</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* OCR Document Scanner Modal */}
      {isOcrModalOpen && (
        <OwnerDocumentOcrModal
          isOpen={isOcrModalOpen}
          onClose={() => setIsOcrModalOpen(false)}
          onApplyExtractedData={handleApplyOcrData}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Calendar, 
  Percent, 
  Building, 
  FileText, 
  Check, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Receipt,
  Image,
  Upload,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileCheck2,
  CreditCard,
  Lock,
  Download,
  Award
} from 'lucide-react';
import { 
  RentalContract, 
  OwnerRepasseBeneficiary, 
  ContractExpense, 
  ContractInsurance,
  RealEstateProperty
} from '../../types/crm';
import { 
  insuranceIntegrationService, 
  InsuranceQuoteOption, 
  PreApprovalCheckResult, 
  PolicyIssueResult 
} from '../../services/insuranceIntegrationService';

interface RentalContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveContract: (contract: RentalContract) => void;
  existingContract?: RentalContract | null;
  properties: RealEstateProperty[];
  initialStep?: 'dados' | 'valores' | 'split' | 'seguros' | 'despesas';
}

export const RentalContractModal: React.FC<RentalContractModalProps> = ({
  isOpen,
  onClose,
  onSaveContract,
  existingContract,
  properties,
  initialStep = 'dados',
}) => {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState<'dados' | 'valores' | 'split' | 'seguros' | 'despesas'>(initialStep);

  // Form states
  const [code, setCode] = useState(existingContract?.code || `LOC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [propertyCode, setPropertyCode] = useState(existingContract?.propertyCode || (properties[0]?.code || 'IMO-101'));
  const [propertyAddress, setPropertyAddress] = useState(existingContract?.propertyAddress || (properties[0]?.title || 'Alameda Lorena, 1420 - Ap 82, Jardins, SP'));
  
  // Locatário
  const [tenantName, setTenantName] = useState(existingContract?.tenantName || '');
  const [tenantCpf, setTenantCpf] = useState(existingContract?.tenantCpf || '');
  const [tenantEmail, setTenantEmail] = useState(existingContract?.tenantEmail || '');
  const [tenantPhone, setTenantPhone] = useState(existingContract?.tenantPhone || '');

  // Prazos e Vigência
  const [startDate, setStartDate] = useState(existingContract?.startDate || '2026-10-01');
  const [endDate, setEndDate] = useState(existingContract?.endDate || '2028-10-01');
  const [dueDay, setDueDay] = useState(existingContract?.dueDay || 10);
  const [repasseDay, setRepasseDay] = useState(existingContract?.repasseDay || 15);
  const [adjustmentIndex, setAdjustmentIndex] = useState<'IPCA' | 'IGP-M' | 'IVAR' | 'INPC'>(existingContract?.adjustmentIndex || 'IPCA');

  // Valores & Taxa de Adm
  const [monthlyRent, setMonthlyRent] = useState(existingContract?.monthlyRent || 5000);
  const [adminFeePercentage, setAdminFeePercentage] = useState(existingContract?.adminFeePercentage || 10);
  const [condoFee, setCondoFee] = useState(existingContract?.condoFee || 1200);
  const [iptuFee, setIptuFee] = useState(existingContract?.iptuFee || 350);

  // Agency Logo & Branding for Contract
  const [agencyLogo, setAgencyLogo] = useState<string>(() => {
    if (existingContract?.agencyLogo) return existingContract.agencyLogo;
    try {
      const saved = localStorage.getItem('acertgo_system_theme_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.logoUrl) return parsed.logoUrl;
      }
    } catch (e) {}
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80';
  });

  const handleAutoPopulateAgencyLogo = () => {
    try {
      const saved = localStorage.getItem('acertgo_system_theme_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.logoUrl) {
          setAgencyLogo(parsed.logoUrl);
          return;
        }
      }
    } catch (e) {}
    setAgencyLogo('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80');
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAgencyLogo(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Garantia & Seguros
  const [guaranteeType, setGuaranteeType] = useState<any>(existingContract?.guaranteeType || 'SEGURO_FIANCA');
  const [guaranteeCompany, setGuaranteeCompany] = useState(existingContract?.insurance?.guaranteeCompany || 'Porto Seguro Aluguel');
  const [guaranteePolicyNumber, setGuaranteePolicyNumber] = useState(existingContract?.insurance?.guaranteePolicyNumber || '');
  const [guaranteeMonthlyCost, setGuaranteeMonthlyCost] = useState(existingContract?.insurance?.guaranteeMonthlyCost || 200);
  const [fireInsuranceCompany, setFireInsuranceCompany] = useState(existingContract?.insurance?.fireInsuranceCompany || 'Tokio Marine');
  const [fireInsuranceMonthlyCost, setFireInsuranceMonthlyCost] = useState(existingContract?.insurance?.fireInsuranceMonthlyCost || 35);

  // Estados da Integração com Seguradoras & Cotação Automática
  const [quotes, setQuotes] = useState<InsuranceQuoteOption[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [tenantIncome, setTenantIncome] = useState<number>(() => Math.round((monthlyRent + condoFee + iptuFee) * 3.3));
  const [creditCheckResult, setCreditCheckResult] = useState<PreApprovalCheckResult | null>(null);
  const [isCheckingCredit, setIsCheckingCredit] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [issuedPolicy, setIssuedPolicy] = useState<PolicyIssueResult | null>(null);
  const [isIssuingPolicy, setIsIssuingPolicy] = useState(false);
  const [autoQuoteNotice, setAutoQuoteNotice] = useState<string | null>(null);

  // Beneficiários do Repasse (Split para herdeiros/filhos)
  const [beneficiaries, setBeneficiaries] = useState<OwnerRepasseBeneficiary[]>(
    existingContract?.beneficiaries && existingContract.beneficiaries.length > 0
      ? existingContract.beneficiaries
      : [
          {
            id: 'ben_1',
            name: 'Proprietário Titular / Mãe',
            relationship: 'Titular / Meeira',
            cpfCnpj: '123.456.789-00',
            percent: 50,
            pixKeyType: 'CPF',
            pixKey: '123.456.789-00',
            bankName: 'Itaú'
          },
          {
            id: 'ben_2',
            name: 'Filho Herdeiro 1',
            relationship: 'Filho / Herdeiro',
            cpfCnpj: '234.567.890-11',
            percent: 25,
            pixKeyType: 'EMAIL',
            pixKey: 'filho1@email.com',
            bankName: 'Nubank'
          },
          {
            id: 'ben_3',
            name: 'Filha Herdeira 2',
            relationship: 'Filha / Herdeira',
            cpfCnpj: '345.678.901-22',
            percent: 25,
            pixKeyType: 'TELEFONE',
            pixKey: '(11) 98765-4321',
            bankName: 'Bradesco'
          }
        ]
  );

  // Despesas
  const [expenses, setExpenses] = useState<ContractExpense[]>(
    existingContract?.expenses || [
      {
        id: 'exp_1',
        description: 'Taxa Bancária de Emissão de Boleto/Pix',
        amount: 3.49,
        type: 'TAXA_BANCARIA',
        paidBy: 'IMOBILIARIA',
        deductFromRepasse: true,
        dueDate: '2026-10-10'
      }
    ]
  );
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState(0);

  // Cálculos do Split em tempo real
  const adminFeeAmount = (monthlyRent * adminFeePercentage) / 100;
  const totalDeductions = expenses.filter(e => e.deductFromRepasse).reduce((acc, e) => acc + e.amount, 0);
  const netRentForRepasse = Math.max(0, monthlyRent - adminFeeAmount - totalDeductions);
  const totalPercent = beneficiaries.reduce((acc, b) => acc + Number(b.percent || 0), 0);

  const handleAddBeneficiary = () => {
    const nextPercent = Math.max(0, 100 - totalPercent);
    const newBen: OwnerRepasseBeneficiary = {
      id: `ben_${Date.now()}`,
      name: '',
      relationship: 'Filho / Herdeiro',
      cpfCnpj: '',
      percent: nextPercent > 0 ? nextPercent : 10,
      pixKeyType: 'CHAVE_ALEATORIA' as any,
      pixKey: ''
    };
    setBeneficiaries([...beneficiaries, newBen]);
  };

  const handleRemoveBeneficiary = (id: string) => {
    if (beneficiaries.length <= 1) return;
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  const handleUpdateBeneficiary = (id: string, field: keyof OwnerRepasseBeneficiary, value: any) => {
    setBeneficiaries(beneficiaries.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleAddExpense = () => {
    if (!newExpDesc.trim() || newExpAmount <= 0) return;
    const newExp: ContractExpense = {
      id: `exp_${Date.now()}`,
      description: newExpDesc.trim(),
      amount: newExpAmount,
      type: 'MANUTENCAO',
      paidBy: 'PROPRIETARIO',
      deductFromRepasse: true,
      dueDate: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExp]);
    setNewExpDesc('');
    setNewExpAmount(0);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleRunAutoQuotation = async () => {
    setIsLoadingQuotes(true);
    setAutoQuoteNotice(null);
    try {
      const result = await insuranceIntegrationService.calculateInsuranceQuotes({
        contractCode: code,
        propertyAddress,
        tenantName: tenantName || 'Locatário Pretendente',
        tenantCpf: tenantCpf || '000.000.000-00',
        tenantIncome,
        monthlyRent,
        condoFee,
        iptuFee
      });
      setQuotes(result);
      setAutoQuoteNotice('Cotação multisseguradoras calculada com sucesso em tempo real!');
      setTimeout(() => setAutoQuoteNotice(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  const handleCheckCreditScore = async () => {
    if (!tenantCpf) {
      alert('Por favor, informe o CPF do locatário no Passo 1 (Dados Gerais) para consultar o Score nos birôs de crédito.');
      return;
    }
    setIsCheckingCredit(true);
    try {
      const totalPkg = monthlyRent + condoFee + iptuFee;
      const res = await insuranceIntegrationService.checkInstantCredit(tenantCpf, tenantIncome, totalPkg);
      setCreditCheckResult(res);
      setAutoQuoteNotice('Score e pré-aprovação de crédito consultados com sucesso!');
      setTimeout(() => setAutoQuoteNotice(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingCredit(false);
    }
  };

  const handleSelectQuoteAndIssuePolicy = async (quote: InsuranceQuoteOption) => {
    setSelectedQuoteId(quote.insurerId);
    setIsIssuingPolicy(true);
    try {
      const policy = await insuranceIntegrationService.issueInstantPolicy({
        quote,
        tenantName: tenantName || 'Locatário Pretendente',
        tenantCpf: tenantCpf || '000.000.000-00',
        contractCode: code,
        monthlyRent
      });
      setIssuedPolicy(policy);
      setGuaranteeType(quote.guaranteeType);
      setGuaranteeCompany(quote.insurerName);
      setGuaranteePolicyNumber(policy.policyNumber);
      setGuaranteeMonthlyCost(quote.monthlyCost);
      setAutoQuoteNotice(`Apólice ${policy.policyNumber} (${quote.insurerName}) emitida e vinculada ao contrato com sucesso!`);
      setTimeout(() => setAutoQuoteNotice(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsIssuingPolicy(false);
    }
  };

  const handleAutoFireInsurance = () => {
    const fireQuote = insuranceIntegrationService.quoteFireInsurance({ rentAmount: monthlyRent });
    setFireInsuranceCompany(fireQuote.company);
    setFireInsuranceMonthlyCost(fireQuote.monthlyCost);
    setAutoQuoteNotice(`Seguro Incêndio ${fireQuote.company} calculado automaticamente: R$ ${fireQuote.monthlyCost}/mês.`);
    setTimeout(() => setAutoQuoteNotice(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) {
      alert('Informe o nome do locatário.');
      return;
    }
    if (totalPercent !== 100) {
      alert(`A soma dos percentuais dos herdeiros/beneficiários deve ser exatamente 100%. Atual: ${totalPercent}%`);
      return;
    }

    const payload: RentalContract = {
      id: existingContract?.id || `cnt_${Date.now()}`,
      code,
      propertyCode,
      propertyAddress,
      tenantName: tenantName.trim(),
      tenantCpf: tenantCpf.trim(),
      tenantEmail: tenantEmail.trim(),
      tenantPhone: tenantPhone.trim(),
      ownerName: beneficiaries[0]?.name || 'Proprietário',
      ownerPixKey: beneficiaries[0]?.pixKey || '',
      monthlyRent,
      condoFee,
      iptuFee,
      guaranteeFee: guaranteeMonthlyCost,
      adminFeePercentage,
      guaranteeType,
      startDate,
      endDate,
      dueDay,
      repasseDay,
      adjustmentIndex,
      signatureStatus: 'ASSINADO',
      status: existingContract?.status || 'ATIVO',
      beneficiaries,
      expenses,
      insurance: {
        guaranteeType,
        guaranteeCompany,
        guaranteePolicyNumber,
        guaranteeMonthlyCost,
        fireInsuranceCompany,
        fireInsuranceMonthlyCost,
        coverageDetails: issuedPolicy ? {
          coversRent: true,
          coversCondoAndIptu: true,
          coversDamageAndPaint: true,
          coversLegalExpenses: true,
          maxCoverageValue: (monthlyRent + condoFee + iptuFee) * 36,
          approvalScore: creditCheckResult?.score || 850,
          quoteId: selectedQuoteId || undefined,
          certificateUrl: issuedPolicy.certificateUrl
        } : undefined
      },
      lastAdjustedAt: startDate,
      agencyLogo
    };

    onSaveContract(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold font-heading text-white leading-tight">
                {existingContract ? 'Editar Contrato de Locação' : 'Novo Contrato de Locação & Repasses'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Gestão completa de despesas, seguros, correção, taxa de adm e split de herdeiros
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveStep('dados')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'dados' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>1. Imóvel & Inquilino</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('valores')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'valores' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>2. Valores & Taxa Adm</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('split')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'split' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>3. Split de Herdeiros ({beneficiaries.length})</span>
            {totalPercent === 100 ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('seguros')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'seguros' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>4. Seguros & Garantia</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              CredPago • Porto
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('despesas')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStep === 'despesas' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4 text-amber-600" />
            <span>5. Despesas & Deduções ({expenses.length})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* STEP 1: DADOS BÁSICOS */}
          {activeStep === 'dados' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código do Contrato *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vincular Imóvel do Catálogo
                  </label>
                  <select
                    value={propertyCode}
                    onChange={(e) => {
                      const sel = properties.find(p => p.code === e.target.value);
                      setPropertyCode(e.target.value);
                      if (sel) {
                        setPropertyAddress(`${sel.address.street}, ${sel.address.number} - ${sel.address.neighborhood}, ${sel.address.city}`);
                        if (sel.pricing.rentPrice) setMonthlyRent(sel.pricing.rentPrice);
                        if (sel.pricing.condoFee) setCondoFee(sel.pricing.condoFee);
                        if (sel.pricing.iptuFee) setIptuFee(sel.pricing.iptuFee);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.code}>
                        {p.code} - {p.title} ({p.address.neighborhood})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço Completo do Imóvel Locado *
                </label>
                <input
                  type="text"
                  required
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Locatário */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Dados do Inquilino / Locatário
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome Completo do Locatário *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo de Souza"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CPF / CNPJ do Locatário *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={tenantCpf}
                      onChange={(e) => setTenantCpf(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp para Envio de Boletos *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 98765-4321"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail do Locatário
                    </label>
                    <input
                      type="email"
                      placeholder="carlos@email.com"
                      value={tenantEmail}
                      onChange={(e) => setTenantEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Vigência e Datas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Início da Vigência
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Término da Vigência (30m)
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dia Vencimento Aluguel
                  </label>
                  <select
                    value={dueDay}
                    onChange={(e) => setDueDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-semibold"
                  >
                    <option value={5}>Dia 05</option>
                    <option value={8}>Dia 08</option>
                    <option value={10}>Dia 10</option>
                    <option value={15}>Dia 15</option>
                    <option value={20}>Dia 20</option>
                    <option value={25}>Dia 25</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dia Repasse Proprietário
                  </label>
                  <select
                    value={repasseDay}
                    onChange={(e) => setRepasseDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-semibold text-purple-700"
                  >
                    <option value={10}>Dia 10 (D+5)</option>
                    <option value={12}>Dia 12 (D+4)</option>
                    <option value={15}>Dia 15 (D+5)</option>
                    <option value={20}>Dia 20 (D+5)</option>
                    <option value={25}>Dia 25 (D+5)</option>
                  </select>
                </div>
              </div>

              {/* Logotipo e Timbrado do Contrato */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-blue-600" />
                    <span>Logotipo & Timbrado da Imobiliária</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Exibido no cabeçalho das vias contratuais e minutas
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="w-20 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                    {agencyLogo ? (
                      <img
                        src={agencyLogo}
                        alt="Logo da Imobiliária"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="text-[10px] text-slate-400 font-bold text-center">Sem Logo</div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Fazer Upload de Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleAutoPopulateAgencyLogo}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                        title="Auto-preencher com a marca do sistema"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Auto-preencher da Imobiliária</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Ou insira a URL da imagem do logotipo..."
                        value={agencyLogo}
                        onChange={(e) => setAgencyLogo(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VALORES E TAXAS */}
          {activeStep === 'valores' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                    Aluguel & Taxa de Administração
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Valor do Aluguel Base (R$) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full px-3 py-2 text-base font-bold text-slate-900 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Taxa de Adm da Imob (%)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        step={0.5}
                        value={adminFeePercentage}
                        onChange={(e) => setAdminFeePercentage(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-bold text-blue-700 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-blue-200 flex flex-col justify-center">
                      <span className="text-[10px] text-slate-500 block">Receita Imobiliária/mês:</span>
                      <strong className="text-sm font-bold text-blue-700 font-mono">
                        R$ {adminFeeAmount.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Encargos Cobrados no Boleto
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Condomínio Mensal Estimado (R$)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={condoFee}
                      onChange={(e) => setCondoFee(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      IPTU Mensal (R$)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={iptuFee}
                      onChange={(e) => setIptuFee(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Índice de Reajuste */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Regra de Correção Anual do Aluguel
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'IPCA', label: 'IPCA (IBGE)', rate: '+3.92% a.a.' },
                    { id: 'IGP-M', label: 'IGP-M (FGV)', rate: '+4.10% a.a.' },
                    { id: 'IVAR', label: 'IVAR (FGV Locação)', rate: '+2.85% a.a.' },
                    { id: 'INPC', label: 'INPC (IBGE)', rate: '+3.80% a.a.' }
                  ].map(idx => (
                    <button
                      key={idx.id}
                      type="button"
                      onClick={() => setAdjustmentIndex(idx.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        adjustmentIndex === idx.id
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <strong className="text-xs text-slate-900 block">{idx.label}</strong>
                      <span className="text-[10px] text-blue-600 font-mono mt-0.5 block">{idx.rate}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SPLIT DE HERDEIROS / BENEFICIÁRIOS */}
          {activeStep === 'split' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-purple-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    Split de Distribuição dos Repasses (Herdeiros & Filhos)
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    totalPercent === 100 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-700 animate-pulse'
                  }`}>
                    Total: {totalPercent}% / 100%
                  </span>
                </div>
                <p className="text-xs text-purple-800/80">
                  Configure para onde o valor líquido do aluguel (<strong>R$ {netRentForRepasse.toFixed(2)}</strong>) será repassado via PIX automático após o recebimento.
                </p>
              </div>

              {/* Beneficiários List */}
              <div className="space-y-3">
                {beneficiaries.map((b, index) => {
                  const shareAmount = (netRentForRepasse * (b.percent || 0)) / 100;

                  return (
                    <div 
                      key={b.id} 
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          Beneficiário #{index + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
                            Receberá: R$ {shareAmount.toFixed(2)} / mês
                          </span>

                          {beneficiaries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBeneficiary(b.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remover beneficiário"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                            Nome Completo (Filho, Herdeiro ou Cônjuge) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Lucas Fontes da Silva"
                            value={b.name}
                            onChange={(e) => handleUpdateBeneficiary(b.id, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                            Grau / Papel
                          </label>
                          <select
                            value={b.relationship}
                            onChange={(e) => handleUpdateBeneficiary(b.id, 'relationship', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                          >
                            <option value="Titular / Meeira">Mãe / Cônjuge Meeira</option>
                            <option value="Filho / Herdeiro">Filho / Herdeiro</option>
                            <option value="Filha / Herdeira">Filha / Herdeira</option>
                            <option value="Coproprietário">Coproprietário</option>
                            <option value="Inventariante">Inventariante</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                            Percentual da Cota (%) *
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              required
                              min={1}
                              max={100}
                              value={b.percent}
                              onChange={(e) => handleUpdateBeneficiary(b.id, 'percent', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 text-xs font-bold text-purple-700 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-purple-500 outline-hidden"
                            />
                            <span className="text-xs text-slate-400 font-bold">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                            CPF / CNPJ
                          </label>
                          <input
                            type="text"
                            placeholder="000.000.000-00"
                            value={b.cpfCnpj}
                            onChange={(e) => handleUpdateBeneficiary(b.id, 'cpfCnpj', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                            Tipo de Chave PIX
                          </label>
                          <select
                            value={b.pixKeyType}
                            onChange={(e) => handleUpdateBeneficiary(b.id, 'pixKeyType', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="CPF">CPF</option>
                            <option value="EMAIL">E-mail</option>
                            <option value="TELEFONE">Telefone</option>
                            <option value="ALEATORIA">Chave Aleatória (EVP)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                            Chave PIX para Transferência *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Chave PIX do herdeiro"
                            value={b.pixKey}
                            onChange={(e) => handleUpdateBeneficiary(b.id, 'pixKey', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-emerald-700 bg-slate-50"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAddBeneficiary}
                className="w-full py-2.5 border-2 border-dashed border-purple-300 hover:border-purple-500 text-purple-700 bg-purple-50/50 hover:bg-purple-50 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar Outro Herdeiro / Filho / Coproprietário no Split</span>
              </button>
            </div>
          )}

          {/* STEP 4: SEGUROS E GARANTIA (HUB MULTI-SEGURADORAS INTEGRADO) */}
          {activeStep === 'seguros' && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              {/* Notification Toast */}
              {autoQuoteNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{autoQuoteNotice}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAutoQuoteNotice(null)} 
                    className="text-emerald-700 hover:text-emerald-900 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Top Banner: Automation with Insurers */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border border-blue-800/40 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-500/30 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-300" />
                        Hub de Seguradoras Integradas
                      </span>
                      <span className="text-[11px] text-slate-300 font-mono">
                        CredPago • Porto Seguro • Velo • Pottencial • Too Seguros
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Cotação Automática de Fiança & Garantia Locatícia
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Cotar simultaneamente nas maiores seguradoras do país e emita a apólice digital 
                      direto no contrato sem precisar abrir portais externos.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRunAutoQuotation}
                      disabled={isLoadingQuotes}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                    >
                      {isLoadingQuotes ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Consultando APIs...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>Cotar Seguradoras Agora</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckCreditScore}
                      disabled={isCheckingCredit}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      title="Consulta instantânea de birôs de crédito (Serasa/SPC)"
                    >
                      {isCheckingCredit ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      )}
                      <span>Score & Pré-Aprovação</span>
                    </button>
                  </div>
                </div>

                {/* Quick Info Strip */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Pretendente: </span>
                    <strong className="text-white">{tenantName || 'Não informado no Passo 1'}</strong>
                    {tenantCpf && <span className="font-mono text-slate-400 text-[11px] ml-1">({tenantCpf})</span>}
                  </div>
                  <div>
                    <span className="text-slate-400">Aluguel: </span>
                    <strong className="text-white font-mono">R$ {monthlyRent.toLocaleString('pt-BR')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Pacote Total (Aluguel+Encargos): </span>
                    <strong className="text-emerald-400 font-mono">
                      R$ {(monthlyRent + condoFee + iptuFee).toLocaleString('pt-BR')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Credit Check Result Box */}
              {creditCheckResult && (
                <div className={`p-4 rounded-2xl border space-y-2.5 animate-fadeIn ${
                  creditCheckResult.approved
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/10 pb-2">
                    <div className="flex items-center gap-2">
                      {creditCheckResult.approved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <strong className="text-xs uppercase tracking-wider block">
                          {creditCheckResult.approved ? 'Cadastro Pré-Aprovado Sem Fiador' : 'Atenção aos Critérios de Renda'}
                        </strong>
                        <span className="text-[11px] opacity-80">
                          {creditCheckResult.riskTier === 'BAIXO_RISCO' ? 'Classificação: Baixo Risco de Inadimplência' : 'Classificação: Atenção à Composição'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] block opacity-70 uppercase font-semibold">Score Birô</span>
                        <span className="text-base font-black font-mono">{creditCheckResult.score}/1000</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] block opacity-70 uppercase font-semibold">Comprometimento</span>
                        <span className="text-base font-black font-mono">{creditCheckResult.commitmentPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {creditCheckResult.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 opacity-90">
                        <span className="text-xs">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issued Policy Card (If Policy was Generated) */}
              {issuedPolicy && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md space-y-3 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <FileCheck2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 block">
                          Garantia Locatícia Emitida & Vinculada
                        </span>
                        <h4 className="font-extrabold text-sm text-white">
                          {issuedPolicy.insurerName} • Apólice Nº {issuedPolicy.policyNumber}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-bold">
                        {issuedPolicy.susepCode}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-emerald-50">
                    <div>
                      <span className="opacity-75 block text-[10px]">Custo Mensal (Boleto):</span>
                      <strong className="text-sm font-black font-mono text-white">
                        R$ {issuedPolicy.monthlyCost.toFixed(2)}/mês
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-75 block text-[10px]">Vigência:</span>
                      <strong className="text-white font-mono">
                        {issuedPolicy.effectiveDate} até {issuedPolicy.expirationDate}
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-75 block text-[10px]">Certificado SUSEP:</span>
                      <a 
                        href={issuedPolicy.certificateUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-white font-bold underline inline-flex items-center gap-1 hover:text-emerald-100"
                      >
                        <span>Visualizar PDF da Apólice</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Quotes Cards Grid */}
              {quotes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-blue-600" />
                        Opções de Garantia Cotadas em Tempo Real
                      </h4>
                      <p className="text-xs text-slate-500">
                        Selecione a seguradora desejada para preencher e emitir a apólice digital automaticamente
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {quotes.length} opções disponíveis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quotes.map((q) => {
                      const isSelected = selectedQuoteId === q.insurerId || guaranteeCompany === q.insurerName;

                      return (
                        <div
                          key={q.insurerId}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          {/* Badge tag */}
                          {q.badge && (
                            <div className="absolute -top-2.5 right-3">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                                {q.badge}
                              </span>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="font-extrabold text-sm text-slate-900">
                                  {q.insurerName}
                                </h5>
                                <span className="text-[10px] text-slate-500 block leading-tight">
                                  {q.insurerTagline}
                                </span>
                              </div>
                            </div>

                            {/* Price block */}
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Custo Mensal</span>
                                <div className="text-lg font-black text-slate-900 font-mono">
                                  {q.monthlyCost > 0 ? (
                                    <>R$ {q.monthlyCost.toFixed(2)}<span className="text-[10px] font-normal text-slate-500">/mês</span></>
                                  ) : (
                                    <span className="text-emerald-700 text-sm">Caução à vista (6x)</span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-blue-600 font-mono">
                                {q.ratePercentage > 0 ? `${q.ratePercentage}% a.m.` : 'Aporte Único'}
                              </span>
                            </div>

                            {/* Features list */}
                            <ul className="space-y-1 text-[11px] text-slate-600">
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Aprovação: <strong>{q.estimatedApprovalTime}</strong></span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Cobertura: <strong>{q.coverages.maxCoverageMultiplier}x o aluguel</strong></span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Aluguel + Condomínio + IPTU</span>
                              </li>
                              {q.coverages.coversDamageAndPaint && (
                                <li className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Danos ao imóvel e pintura inclusos</span>
                                </li>
                              )}
                            </ul>

                            {/* Broker Take Rate */}
                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                              <span>Comissão da Imobiliária ({q.brokerCommissionRate}%):</span>
                              <strong className="text-purple-700 font-mono">
                                + R$ {q.brokerCommissionAmount.toFixed(2)}/ano
                              </strong>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => handleSelectQuoteAndIssuePolicy(q)}
                            disabled={isIssuingPolicy}
                            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {isIssuingPolicy && selectedQuoteId === q.insurerId ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Emitindo Apólice...</span>
                              </>
                            ) : isSelected ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-white" />
                                <span>Seguradora Selecionada</span>
                              </>
                            ) : (
                              <>
                                <span>Vincular Esta Cotação</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Inputs (Verified & Editable by the broker) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Garantia Selecionada no Contrato
                    </span>
                    <span className="text-[10px] text-emerald-800 font-mono font-semibold">
                      Auto-preenchido
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Modalidade de Garantia
                    </label>
                    <select
                      value={guaranteeType}
                      onChange={(e) => setGuaranteeType(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white font-semibold"
                    >
                      <option value="SEGURO_FIANCA">Seguro Fiança Locatícia (Sem Fiador)</option>
                      <option value="CARTAO_CREDITO">Cartão de Crédito (CredPago)</option>
                      <option value="TITULO_CAPITALIZACAO">Título de Capitalização (6x aluguel)</option>
                      <option value="FIADOR">Fiador Tradicional (2 Imóveis)</option>
                      <option value="CAUCAO">Caução em Dinheiro (3 Meses)</option>
                    </select>
                  </div>

                  {(guaranteeType === 'SEGURO_FIANCA' || guaranteeType === 'CARTAO_CREDITO' || guaranteeType === 'TITULO_CAPITALIZACAO') && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Seguradora Parceira
                        </label>
                        <select
                          value={guaranteeCompany}
                          onChange={(e) => setGuaranteeCompany(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                        >
                          <option value="Porto Seguro Aluguel">Porto Seguro Aluguel</option>
                          <option value="CredPago (Loft Fiança)">CredPago (Loft Fiança)</option>
                          <option value="Velo Garantias">Velo Garantias</option>
                          <option value="Too Seguros (BTG Pactual)">Too Seguros / BTG Pactual</option>
                          <option value="Pottencial Seguradora">Pottencial Seguradora</option>
                          <option value="Icatu Capitalização (Título Caução)">Icatu Capitalização (Título Caução)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nº da Apólice
                          </label>
                          <input
                            type="text"
                            placeholder="APO-PORTO-2026-98412"
                            value={guaranteePolicyNumber}
                            onChange={(e) => setGuaranteePolicyNumber(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-white font-bold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Custo Mensal (R$)
                          </label>
                          <input
                            type="number"
                            value={guaranteeMonthlyCost}
                            onChange={(e) => setGuaranteeMonthlyCost(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-white font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Seguro Incêndio Obrigatório (Lei 8.245/91)
                      </span>
                      <button
                        type="button"
                        onClick={handleAutoFireInsurance}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Auto-calcular</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Seguradora do Incêndio
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Tokio Marine Seguradora"
                        value={fireInsuranceCompany}
                        onChange={(e) => setFireInsuranceCompany(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Parcela Mensal do Incêndio (R$)
                      </label>
                      <input
                        type="number"
                        value={fireInsuranceMonthlyCost}
                        onChange={(e) => setFireInsuranceMonthlyCost(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-800">
                    💡 Cobrado mensalmente no boleto do inquilino para garantir proteção predial integral.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DESPESAS E DEDUÇÕES */}
          {activeStep === 'despesas' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                <h4 className="text-xs font-bold text-amber-900">
                  Lançamento de Despesas Dedutíveis no Repasse
                </h4>
                <p className="text-xs text-amber-800">
                  Despesas como taxa de boleto, manutenções emergenciais autorizadas ou benfeitorias são abatidas automaticamente do montante líquido antes da divisão aos herdeiros.
                </p>
              </div>

              {/* Add Expense Form */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                    Descrição da Despesa
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Reparo de vazamento no banheiro social"
                    value={newExpDesc}
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddExpense}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    + Lançar Despesa
                  </button>
                </div>
              </div>

              {/* Expenses Table */}
              <div className="space-y-2">
                {expenses.map((exp) => (
                  <div 
                    key={exp.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{exp.description}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Tipo: {exp.type} • Deduz do Repasse: {exp.deductFromRepasse ? 'Sim' : 'Não'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-rose-600 font-mono">
                        - R$ {exp.amount.toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveExpense(exp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Passo ativo: <strong>{activeStep.toUpperCase()}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Contrato de Locação</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

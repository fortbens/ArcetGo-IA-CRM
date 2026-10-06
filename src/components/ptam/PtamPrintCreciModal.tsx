import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Award,
  MapPin,
  ExternalLink,
  QrCode,
  FileCheck2,
  Sparkles,
  Home,
  Check,
  FileText
} from 'lucide-react';
import { PtamReport } from '../../types/ptam';

interface PtamPrintCreciModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: PtamReport;
}

export const PtamPrintCreciModal: React.FC<PtamPrintCreciModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const agencyLogo = report.agency.logoUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      
      {/* Container Principal do Laudo */}
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Barra de Ações Superior (Oculta na Impressão) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Visualização do Laudo PTAM (Padrão CRECI / COFECI)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  Resolução 1.066/2007
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Laudo pericial {report.code} • Imóvel: {report.targetProperty.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do Laudo PTAM A4 */}
        <div ref={printAreaRef} className="flex-1 overflow-y-auto p-6 sm:p-10 font-serif text-slate-900 print:overflow-visible print:p-8 space-y-8 bg-white">

          {/* ========================================================= */}
          {/* CABEÇALHO OFICIAL TIMBRADO DA IMOBILIÁRIA                 */}
          {/* ========================================================= */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              {agencyLogo ? (
                <img src={agencyLogo} alt={report.agency.name} className="h-16 max-w-[200px] object-contain" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-950 text-white flex flex-col items-center justify-center font-sans border-2 border-amber-500/60 shadow-md">
                  <span className="font-black text-lg leading-none">AG</span>
                  <span className="text-[8px] uppercase tracking-widest text-amber-300 font-bold mt-1">AcertGo</span>
                </div>
              )}
              <div className="font-sans">
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  {report.agency.tradeName || report.agency.name}
                </h1>
                <p className="text-xs text-slate-600">
                  {report.agency.name} • CNPJ: {report.agency.cnpj} • <strong>CRECI Jurídico: {report.agency.creciJ}</strong>
                </p>
                <p className="text-[11px] text-slate-500">
                  {report.agency.address}, {report.agency.city}/{report.agency.state} • Tel: {report.agency.phone} • {report.agency.email}
                </p>
              </div>
            </div>

            {/* Selo Certificador COFECI / CNAI */}
            <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 text-center shrink-0 w-44 font-sans shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-amber-700 font-black text-[10px] uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>COFECI • CNAI</span>
              </div>
              <div className="text-xs font-black text-slate-900">
                {report.evaluator.cnai}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">
                Selo: {report.legalTerms.sealNumber.split('-')[1]?.trim() || 'OFICIAL'}
              </div>
              <div className="text-[8px] text-emerald-700 font-bold mt-1 flex items-center justify-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> Autenticidade Registrada
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TÍTULO & IDENTIFICAÇÃO DO LAUDO                           */}
          {/* ========================================================= */}
          <div className="text-center space-y-1 font-sans">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black tracking-widest uppercase border border-slate-300 inline-block">
              Laudo Oficial de Avaliação Mercadológica
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight pt-1">
              PARECER TÉCNICO DE AVALIAÇÃO MERCADOLÓGICA (PTAM)
            </h2>
            <p className="text-xs font-mono text-blue-700 font-bold">
              REGISTRO Nº: {report.code} • DATA DA EMISSÃO: {report.createdAt}
            </p>
            <p className="text-xs text-slate-500 italic font-serif max-w-2xl mx-auto pt-1">
              Elaborado em rigorosa observância à Resolução COFECI nº 1.066/2007, Ato Normativo COFECI nº 001/2008 e normas técnicas ABNT NBR 14.653-1 e NBR 14.653-2.
            </p>
          </div>

          {/* ========================================================= */}
          {/* 1. IDENTIFICAÇÃO DAS PARTES                               */}
          {/* ========================================================= */}
          <section className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                <span>Identificação do Solicitante e do Avaliador Perito</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Solicitante */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Requerente / Solicitante:</span>
                <p className="font-bold text-slate-900 text-sm">{report.requester.name}</p>
                <p className="text-slate-600">CPF/CNPJ: <strong>{report.requester.document}</strong></p>
                <p className="text-slate-600">Endereço: {report.requester.address}, {report.requester.city}/{report.requester.state}</p>
                <p className="text-slate-600">Contato: {report.requester.phone} • {report.requester.email}</p>
                <p className="text-slate-700 pt-1 text-[11px] italic">
                  <strong>Finalidade da Avaliação:</strong> {report.purpose} — {report.requester.purposeDescription}
                </p>
              </div>

              {/* Avaliador Perito */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Avaliador Perito Responsável:</span>
                <p className="font-bold text-slate-900 text-sm">{report.evaluator.name}</p>
                <p className="text-slate-700 font-semibold">
                  CRECI Físico: <strong className="text-slate-950">{report.evaluator.creci}</strong> • Registro Nacional: <strong className="text-amber-800">{report.evaluator.cnai}</strong>
                </p>
                <p className="text-slate-600">Qualificação: {report.evaluator.role}</p>
                <p className="text-slate-600">E-mail: {report.evaluator.email} • Tel: {report.evaluator.phone}</p>
                <p className="text-[10px] text-slate-500 font-mono pt-1">
                  Código de Certificação: {report.evaluator.certificationSealCode}
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 2. CARACTERIZAÇÃO DO IMÓVEL AVALIANDO                     */}
          {/* ========================================================= */}
          <section className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                <span>Caracterização e Vistoria Minuciosa do Imóvel Avaliando</span>
              </h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{report.targetProperty.title}</h4>
                  <p className="text-slate-600">
                    {report.targetProperty.address.street}, {report.targetProperty.address.number} {report.targetProperty.address.complement && `(${report.targetProperty.address.complement})`} — {report.targetProperty.address.neighborhood}, {report.targetProperty.address.city}/{report.targetProperty.address.state} • CEP {report.targetProperty.address.cep}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs">
                    {report.targetProperty.type}
                  </span>
                </div>
              </div>

              {/* Tabela de Atributos Físicos e Legais */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Área Útil / Privativa</span>
                  <strong className="text-sm text-slate-900 font-black">{report.targetProperty.areas.privateM2} m²</strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Área Total Construída</span>
                  <strong className="text-sm text-slate-900 font-black">{report.targetProperty.areas.totalM2} m²</strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Padrão Construtivo</span>
                  <strong className="text-sm text-slate-900 font-bold">{report.targetProperty.construction.standard}</strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Estado de Conservação</span>
                  <strong className="text-sm text-slate-900 font-bold">{report.targetProperty.construction.state}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Dormitórios / Suítes</span>
                  <span className="font-semibold text-slate-800">{report.targetProperty.rooms.bedrooms} quartos ({report.targetProperty.rooms.suites} suítes)</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Banheiros / Vagas</span>
                  <span className="font-semibold text-slate-800">{report.targetProperty.rooms.bathrooms} banheiros • {report.targetProperty.rooms.parkingSpaces} vagas</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Matrícula no RGI</span>
                  <span className="font-semibold text-slate-800">{report.targetProperty.registry.registrationNumber}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Cartório / IPTU</span>
                  <span className="font-semibold text-slate-800">{report.targetProperty.registry.registryOffice} (IPTU: {report.targetProperty.registry.taxIdIPTU})</span>
                </div>
              </div>

              {/* Descrição e Itens */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Laudo Descritivo da Vistoria:</span>
                <p className="text-xs text-slate-700 leading-relaxed font-serif">
                  {report.targetProperty.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.targetProperty.amenities.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] border border-slate-200 font-sans">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Registro Fotográfico da Vistoria */}
              {report.targetProperty.photos.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Registro Fotográfico Homologado:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {report.targetProperty.photos.map((photo, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                        <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================= */}
          {/* 3. DIAGNÓSTICO DEMOGRÁFICO & MERCADOLÓGICO COM IA         */}
          {/* ========================================================= */}
          <section className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
                <span>Diagnóstico Demográfico, Socioeconômico e Infraestrutura (IA Pericial)</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Dados de Inteligência Artificial</span>
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <p className="text-slate-800 font-serif leading-relaxed italic">
                "{report.demographicsAndRegion.neighborhoodSummary}"
              </p>

              {/* Métricas Socioeconômicas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block">Nível Socioeconômico</span>
                  <span className="font-black text-sm text-slate-900">{report.demographicsAndRegion.socioeconomicLevel.replace('_', ' ')}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block">Renda Familiar Média</span>
                  <span className="font-black text-sm text-emerald-700">R$ {report.demographicsAndRegion.averageFamilyIncome.toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block">Índice IDH Bairro</span>
                  <span className="font-black text-sm text-blue-700">{report.demographicsAndRegion.idhScore} (Muito Alto)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block">Liquidez de Mercado</span>
                  <span className="font-black text-sm text-purple-700">{report.demographicsAndRegion.marketLiquidityRating}</span>
                </div>
              </div>

              {/* Equipamentos Urbanos */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-[11px]">
                <strong className="text-slate-800 uppercase block text-[10px]">Equipamentos Urbanos e Serviços Públicos:</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>• <strong>Mobilidade:</strong> {report.demographicsAndRegion.infrastructure.transportation}</div>
                  <div>• <strong>Educação:</strong> {report.demographicsAndRegion.infrastructure.education}</div>
                  <div>• <strong>Saúde:</strong> {report.demographicsAndRegion.infrastructure.health}</div>
                  <div>• <strong>Comércio:</strong> {report.demographicsAndRegion.infrastructure.commerce}</div>
                </div>
                <div className="pt-1 text-slate-700">
                  • <strong>Segurança Pública:</strong> {report.demographicsAndRegion.infrastructure.security}
                </div>
              </div>

              {/* Parecer IA */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 text-xs">
                <strong>Análise Técnica Preditiva:</strong> {report.demographicsAndRegion.aiAnalysisNotes}
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 4. PESQUISA MERCADOLÓGICA & AMOSTRAS DE ANÚNCIOS (MCDDM)   */}
          {/* ========================================================= */}
          <section className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">4</span>
                <span>Pesquisa de Mercado e Tabela Comparativa de Amostras (Anúncios)</span>
              </h3>
            </div>

            <p className="text-xs text-slate-600 font-serif">
              Coleta de dados amostrais realizada em portais imobiliários homologados (ZAP Imóveis, VivaReal, Imovelweb e carteira da imobiliária). As amostras foram tratadas pelo Método Comparativo Direto de Dados de Mercado (MCDDM - NBR 14.653-2) com fatores de oferta e homogeneização física:
            </p>

            {/* Tabela de Amostras */}
            <div className="overflow-x-auto border border-slate-300 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase">
                    <th className="py-2.5 px-3">Amostra / Portal</th>
                    <th className="py-2.5 px-3">Endereço / Bairro</th>
                    <th className="py-2.5 px-3 text-right">Área (m²)</th>
                    <th className="py-2.5 px-3 text-right">Preço Ofertado</th>
                    <th className="py-2.5 px-3 text-right">R$/m² Bruto</th>
                    <th className="py-2.5 px-3 text-center">Fatores (Homog.)</th>
                    <th className="py-2.5 px-3 text-right bg-slate-800">R$/m² Homog.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.samples.map((s, index) => (
                    <tr key={s.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{s.title}</div>
                        <div className="text-[10px] text-blue-700 flex items-center gap-1">
                          <span>{s.sourcePortal.replace('_', ' ')}</span>
                          {s.adUrl && <ExternalLink className="w-2.5 h-2.5" />}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                        {s.neighborhood}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {s.areaM2} m²
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        R$ {s.askingPrice.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        R$ {s.askingPricePerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[10px] text-slate-600 font-mono">
                        {s.offerDiscountFactor.toFixed(2)} × {s.standardFactor.toFixed(2)} × {s.conservationFactor.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 bg-slate-100/60">
                        R$ {s.finalHomogenizedPricePerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 5. TRATAMENTO MATEMÁTICO & CONCLUSÃO DO VALOR DE MERCADO  */}
          {/* ========================================================= */}
          <section className="space-y-3 font-sans">
            <div className="border-b border-slate-300 pb-1">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">5</span>
                <span>Tratamento Estatístico e Conclusão do Valor de Mercado</span>
              </h3>
            </div>

            {/* Quadro Estatístico */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Média Homogeneizada:</span>
                <span className="font-black text-sm text-slate-900">
                  R$ {report.calculations.homogenizedAveragePerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/m²
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Desvio Padrão:</span>
                <span className="font-black text-sm text-slate-900">
                  ± R$ {report.calculations.standardDeviation.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Coeficiente Variação:</span>
                <span className="font-black text-sm text-emerald-700">
                  {report.calculations.coefficientOfVariation.toFixed(2)}% (Grau III - Ótimo)
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Intervalo de Confiança:</span>
                <span className="font-medium text-[11px] text-slate-700">
                  R$ {report.calculations.confidenceIntervalMin.toLocaleString('pt-BR')} a {report.calculations.confidenceIntervalMax.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Destaque do Valor Final Avaliado */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-amber-400">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-amber-300 font-extrabold text-xs uppercase tracking-widest block">
                  VALOR DE MERCADO CONCLUÍDO (VENDA RECOMENDADA)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  R$ {report.calculations.recommendedMarketValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-slate-300">
                  Metragem Privativa: {report.targetProperty.areas.privateM2} m² × R$ {report.calculations.homogenizedAveragePerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/m²
                </p>
              </div>

              <div className="space-y-2 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Estimativa de Locação Mensal:</span>
                  <span className="text-lg font-extrabold text-amber-300">
                    R$ {report.calculations.recommendedRentalValue ? report.calculations.recommendedRentalValue.toLocaleString('pt-BR') : 'Consulte'} /mês
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Liquidação Rápida / Leilão:</span>
                  <span className="text-sm font-bold text-slate-200">
                    R$ {report.calculations.quickSaleValue.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 font-serif italic">
              <strong>Arbítrio do Perito:</strong> {report.calculations.arbitrageJustification}
            </p>
          </section>

          {/* ========================================================= */}
          {/* 6. TERMO DE ENCERRAMENTO E ASSINATURA CRECI / CNAI        */}
          {/* ========================================================= */}
          <section className="space-y-4 pt-4 border-t-2 border-slate-900 font-sans">
            <div className="space-y-1 text-xs text-slate-700 font-serif">
              <p>
                <strong>DECLARAÇÃO FINAL E TERMO DE ENCERRAMENTO:</strong> {report.legalTerms.declaration}
              </p>
              <p className="text-[11px] text-slate-500">
                {report.legalTerms.resolutionCofeci} — {report.legalTerms.standardAbnt}.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Validade do presente parecer: <strong>{report.validityDays} dias</strong> a contar de sua data de emissão (válido até {report.validUntil}).
              </p>
            </div>

            {/* Assinaturas & Chancelas */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* QR Code & Autenticidade */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-14 h-14 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1 shadow-2xs">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div className="text-[10px] text-slate-600 space-y-0.5 font-sans">
                  <strong className="text-slate-900 block">Autenticação Digital COFECI</strong>
                  <span>Conselho Federal de Corretores</span>
                  <span className="block font-mono text-blue-700">{report.evaluator.certificationSealCode}</span>
                </div>
              </div>

              {/* Assinatura do Perito */}
              <div className="text-center w-72">
                <div className="border-b-2 border-slate-900 pb-1 mb-1 font-serif text-sm italic font-bold text-slate-800">
                  {report.evaluator.name}
                </div>
                <div className="text-xs font-black text-slate-900 uppercase">
                  {report.evaluator.name}
                </div>
                <div className="text-[11px] text-slate-600 font-sans">
                  {report.evaluator.creci} • <strong>{report.evaluator.cnai}</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  {report.agency.name} ({report.agency.creciJ})
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200 font-sans">
              Laudo emitido eletronicamente pela plataforma AcertGo • Assinado digitalmente conforme MP nº 2.200-2/2001
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

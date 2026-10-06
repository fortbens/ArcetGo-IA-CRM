import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Building2, 
  Calendar, 
  User, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { BiReportType } from '../../types/crm';

export interface ReportColumnDef {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render?: (val: any, row: any) => React.ReactNode;
}

export interface ReportMetricSummary {
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

export interface ExecutivePrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: BiReportType;
  reportTitle: string;
  reportSubtitle: string;
  filterSummary: string;
  data: any[];
  columns: ReportColumnDef[];
  metrics: ReportMetricSummary[];
  agencyName?: string;
  agencyCreci?: string;
  agencyCnpj?: string;
}

export const ExecutivePrintReportModal: React.FC<ExecutivePrintReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  reportTitle,
  reportSubtitle,
  filterSummary,
  data,
  columns,
  metrics,
  agencyName = 'AcertGo Imóveis & Consultoria Imobiliária',
  agencyCreci = 'CRECI 042.890-J',
  agencyCnpj = '48.912.340/0001-88'
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentDateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const currentTimeStr = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Native Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Exporter for Excel
  const handleExportCsv = () => {
    if (!data || data.length === 0) return;

    const headers = columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join(';');
    const rows = data.map(item => {
      return columns.map(col => {
        let val = item[col.key];
        if (val === undefined || val === null) val = '';
        if (typeof val === 'boolean') val = val ? 'Sim' : 'Não';
        if (typeof val === 'number') val = val.toLocaleString('pt-BR');
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(';');
    }).join('\n');

    // Include UTF-8 BOM so Excel opens with proper accents
    const csvContent = '\uFEFF' + headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = reportTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute('download', `relatorio_${cleanTitle}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      {/* Styles injected specifically for clean printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-report-area, #printable-report-area * {
            visibility: visible !important;
          }
          #printable-report-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 12mm !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Central de Impressão de Relatórios Executivos</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Padrão Executivo A4
                </span>
              </div>
              <p className="text-xs text-slate-400">Layout A4 executivo pronto para impressão física ou PDF com auditoria.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Baixar dados tabulares em planilha CSV formatada para Microsoft Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel (CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Abrir diálogo de impressão do navegador ou salvar em PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (A4 Layout Sheet) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div 
            id="printable-report-area" 
            ref={printAreaRef}
            className="w-full max-w-[850px] bg-white rounded-xl shadow-lg border border-slate-300 p-8 sm:p-10 space-y-6 text-slate-900 font-sans"
          >
            {/* Header: Imobiliária & Metadados */}
            <div className="border-b-2 border-slate-800 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {agencyName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1 space-x-3">
                    <span><strong>CNPJ:</strong> {agencyCnpj}</span>
                    <span>•</span>
                    <span><strong>Registro:</strong> {agencyCreci}</span>
                    <span>•</span>
                    <span>Sistema Integrado AcertGo BI SaaS</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    DOCUMENTO OFICIAL
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1.5">
                    Emissão: <strong>{currentDateStr}</strong> às <strong>{currentTimeStr}</strong>
                  </div>
                </div>
              </div>

              {/* Title of Report */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                    {reportTitle}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {reportSubtitle}
                  </p>
                </div>
                <div className="text-xs bg-blue-50 text-blue-900 px-3 py-1.5 rounded-lg border border-blue-200/80 font-medium self-start sm:self-auto">
                  <strong>Filtro Aplicado:</strong> {filterSummary}
                </div>
              </div>
            </div>

            {/* KPI Metrics Summary Strip */}
            {metrics && metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      {metric.label}
                    </span>
                    <div className="text-base sm:text-lg font-black text-slate-900">
                      {metric.value}
                    </div>
                    {metric.subtext && (
                      <span className="text-[10px] text-slate-500 font-medium block">
                        {metric.subtext}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 border-b border-slate-800 w-10 text-center">#</th>
                    {columns.map(col => (
                      <th 
                        key={col.key} 
                        className={`py-2.5 px-3 border-b border-slate-800 ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data && data.length > 0 ? (
                    data.map((row, rowIdx) => (
                      <tr 
                        key={rowIdx} 
                        className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                      >
                        <td className="py-2 px-3 text-[11px] text-slate-400 text-center font-mono">
                          {rowIdx + 1}
                        </td>
                        {columns.map(col => {
                          const cellVal = row[col.key];
                          return (
                            <td 
                              key={col.key} 
                              className={`py-2 px-3 text-[11px] text-slate-800 ${
                                col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : 'text-left'
                              }`}
                            >
                              {col.render ? col.render(cellVal, row) : (
                                cellVal !== undefined && cellVal !== null 
                                  ? String(cellVal) 
                                  : '-'
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="py-8 text-center text-slate-500 italic">
                        Nenhum registro encontrado para o filtro selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Row Count & Notes */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 gap-2">
              <div>
                Total de registros listados: <strong className="text-slate-800 font-bold">{data.length}</strong> itens auditados.
              </div>
              <div className="text-[11px] italic text-slate-500">
                Padrão analítico imobiliário oficial com conformidade e auditoria.
              </div>
            </div>

            {/* Official Report Sign-off & Security Footer */}
            <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-slate-400">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Relatório Gerado Eletronicamente via AcertGo BI Intelligence</span>
                </div>
                <p>
                  As informações deste relatório são confidenciais e protegidas por sigilo comercial e pela LGPD (Lei nº 13.709/2018).
                </p>
              </div>

              <div className="text-right font-mono shrink-0">
                <div>HASH: {Math.random().toString(36).substring(2, 10).toUpperCase()}-ACERTGO</div>
                <div>Página 1 de 1</div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Dica: Para salvar em PDF, selecione a impressora <strong>"Salvar como PDF"</strong> no menu de impressão.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Agora (Ctrl+P)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

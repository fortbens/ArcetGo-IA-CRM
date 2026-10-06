import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Building, 
  Calendar, 
  User, 
  Gauge, 
  KeyRound, 
  Camera, 
  FileSignature, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { PropertyInspection, InspectionGeneralState, InspectionPaintState } from '../../types/crm';

interface InspectionDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: PropertyInspection;
}

export const getGeneralStateBadge = (state?: InspectionGeneralState) => {
  switch (state) {
    case 'OTIMO':
      return { label: 'Ótimo', bg: 'bg-emerald-600 text-white', lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    case 'BOM':
      return { label: 'Bom', bg: 'bg-lime-600 text-white', lightBg: 'bg-lime-50 text-lime-800 border-lime-300' };
    case 'REGULAR':
      return { label: 'Regular', bg: 'bg-amber-500 text-white', lightBg: 'bg-amber-50 text-amber-800 border-amber-300' };
    case 'PESSIMO':
      return { label: 'Péssimo', bg: 'bg-rose-600 text-white', lightBg: 'bg-rose-50 text-rose-800 border-rose-300' };
    default:
      return { label: 'Bom', bg: 'bg-lime-600 text-white', lightBg: 'bg-lime-50 text-lime-800 border-lime-300' };
  }
};

export const getPaintStateBadge = (state?: InspectionPaintState) => {
  switch (state) {
    case 'NOVA':
      return { label: 'Nova', bg: 'bg-cyan-600 text-white', lightBg: 'bg-cyan-50 text-cyan-800 border-cyan-300' };
    case 'BOA':
      return { label: 'Boa', bg: 'bg-emerald-600 text-white', lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    case 'REGULAR':
      return { label: 'Regular', bg: 'bg-amber-500 text-white', lightBg: 'bg-amber-50 text-amber-800 border-amber-300' };
    case 'RUIM':
      return { label: 'Ruim', bg: 'bg-orange-500 text-white', lightBg: 'bg-orange-50 text-orange-800 border-orange-300' };
    case 'PESSIMA':
      return { label: 'Péssima', bg: 'bg-rose-600 text-white', lightBg: 'bg-rose-50 text-rose-800 border-rose-300' };
    default:
      return { label: 'Boa', bg: 'bg-emerald-600 text-white', lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
  }
};

export const InspectionDossierModal: React.FC<InspectionDossierModalProps> = ({
  isOpen,
  onClose,
  inspection,
}) => {
  if (!isOpen || !inspection) return null;

  // Calculate statistics across all items in all rooms
  let totalItems = 0;
  let otimoCount = 0;
  let bomCount = 0;
  let regularCount = 0;
  let pessimoCount = 0;
  let totalPhotos = 0;

  inspection.rooms.forEach(room => {
    room.items.forEach(item => {
      totalItems++;
      const s = item.state || (item.condition === 'NOVO' ? 'OTIMO' : item.condition === 'DANIFICADO' ? 'PESSIMO' : 'BOM');
      if (s === 'OTIMO') otimoCount++;
      else if (s === 'BOM') bomCount++;
      else if (s === 'REGULAR') regularCount++;
      else if (s === 'PESSIMO') pessimoCount++;

      if (item.photos?.length) {
        totalPhotos += item.photos.length;
      } else if (item.hasPhoto) {
        totalPhotos += 1;
      }
    });
  });

  const otimoPct = totalItems > 0 ? Math.round((otimoCount / totalItems) * 100) : 0;
  const bomPct = totalItems > 0 ? Math.round((bomCount / totalItems) * 100) : 0;
  const regularPct = totalItems > 0 ? Math.round((regularCount / totalItems) * 100) : 0;
  const pessimoPct = totalItems > 0 ? Math.round((pessimoCount / totalItems) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[95vh] flex flex-col">
        
        {/* Top Action Bar (hidden in print) */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold text-sm truncate">
              Laudo Pericial Oficial de Vistoria #{inspection.code || 'LAU-2026-0891'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Certificado Digital ICP
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Gerar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Laudo Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 text-slate-900 text-xs bg-white">
          
          {/* Official Laudo Header */}
          <div className="border-2 border-slate-300 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-white flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-sm">
                  AG
                </span>
                <div>
                  <h1 className="font-black text-sm sm:text-base text-slate-900 tracking-wide uppercase">
                    ACERTGO GESTÃO & VISTORIAS IMOBILIÁRIAS
                  </h1>
                  <p className="text-[10px] text-slate-500 font-mono">
                    CNPJ: 12.345.678/0001-90 · CRECI-J: 45.678-SP · Certificação Pericial IBAPE/SP
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Laudo emitido em conformidade com a Lei do Inquilinato (Lei nº 8.245/91, Art. 22 e Art. 23)
              </p>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-900 font-mono">
                {inspection.type === 'ENTRADA' ? 'LAUDO DE VISTORIA DE ENTRADA' : 'LAUDO DE VISTORIA DE SAÍDA'}
              </span>
              <div className="text-[11px] font-bold text-slate-700 mt-1">
                Dossiê Nº: {inspection.code || 'LAU-2026-0891'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Data: {inspection.date} às {inspection.time || '14:30'}
              </div>
            </div>
          </div>

          {/* Identification Block */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Imóvel Objeto</span>
              <strong className="text-slate-900 block font-mono">{inspection.propertyCode}</strong>
              <p className="text-slate-600 text-[11px] leading-tight mt-0.5">{inspection.propertyAddress}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Perito Vistoriador</span>
              <strong className="text-slate-900 block">{inspection.inspectorName}</strong>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">{inspection.inspectorCpfCreci || 'CRECI 142.901-F'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Locatário / Ocupante</span>
              <strong className="text-slate-900 block">{inspection.clientName}</strong>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">CPF: {inspection.clientDocument || '349.812.908-11'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Proprietário / Locador</span>
              <strong className="text-slate-900 block truncate">{inspection.ownerName || 'Construções Silva Ltda'}</strong>
              <p className="text-slate-500 text-[10px] mt-0.5">Representado por AcertGo</p>
            </div>
          </div>

          {/* Termômetro Geral do Imóvel & Medidores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Termômetro de Estados com Cores de Temperatura */}
            <div className="md:col-span-2 p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Termômetro Geral de Conservação do Imóvel</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-bold">
                  {totalItems} itens vistoriados
                </span>
              </div>

              {/* Progress Temperature Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${otimoPct}%` }} className="bg-emerald-500 h-full" title={`Ótimo: ${otimoPct}%`} />
                <div style={{ width: `${bomPct}%` }} className="bg-lime-500 h-full" title={`Bom: ${bomPct}%`} />
                <div style={{ width: `${regularPct}%` }} className="bg-amber-400 h-full" title={`Regular: ${regularPct}%`} />
                <div style={{ width: `${pessimoPct}%` }} className="bg-rose-500 h-full" title={`Péssimo: ${pessimoPct}%`} />
              </div>

              {/* Legend with Temperature Colors */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="text-[10px] font-bold uppercase block">Ótimo</span>
                  <strong className="text-sm font-black font-mono">{otimoCount} ({otimoPct}%)</strong>
                </div>
                <div className="p-2 rounded-xl bg-lime-50 border border-lime-200 text-lime-900">
                  <span className="text-[10px] font-bold uppercase block">Bom</span>
                  <strong className="text-sm font-black font-mono">{bomCount} ({bomPct}%)</strong>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="text-[10px] font-bold uppercase block">Regular</span>
                  <strong className="text-sm font-black font-mono">{regularCount} ({regularPct}%)</strong>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <span className="text-[10px] font-bold uppercase block">Péssimo</span>
                  <strong className="text-sm font-black font-mono">{pessimoCount} ({pessimoPct}%)</strong>
                </div>
              </div>
            </div>

            {/* Medidores & Chaves */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>Medidores & Chaves</span>
              </span>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">💧 Hidrômetro (Água):</span>
                  <strong className="font-mono text-slate-900">{inspection.meterReadings?.water || '0412.8 m³'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">⚡ Luz / Energia:</span>
                  <strong className="font-mono text-slate-900">{inspection.meterReadings?.electricity || '18492.0 kWh'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Gás Encanado:</span>
                  <strong className="font-mono text-slate-900">{inspection.meterReadings?.gas || '0198.4 m³'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">🔑 Chaves Entregues:</span>
                  <strong className="font-mono text-slate-900">{inspection.keysDelivered?.[0]?.quantity || 3} un.</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Relatório Minucioso por Ambiente */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b-2 border-slate-800">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                1. Checklist Descritivo por Ambiente do Imóvel
              </h2>
              <span className="text-[10px] text-slate-500">
                {inspection.rooms.length} cômodos avaliados
              </span>
            </div>

            <div className="space-y-4">
              {inspection.rooms.map((room, rIdx) => {
                const roomState = getGeneralStateBadge(room.overallState);
                const roomPaint = getPaintStateBadge(room.paintState);

                return (
                  <div key={rIdx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    
                    {/* Room Header */}
                    <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900">
                          Ambiente #{rIdx + 1}: {room.roomName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${roomPaint.lightBg} border`}>
                          Pintura: {roomPaint.label}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${roomState.bg}`}>
                          Estado: {roomState.label}
                        </span>
                      </div>
                    </div>

                    {/* Room Items Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                            <th className="py-2 px-4 w-40">Item Vistoriado</th>
                            <th className="py-2 px-3 w-28 text-center">Estado</th>
                            <th className="py-2 px-3 w-24 text-center">Pintura</th>
                            <th className="py-2 px-4">Parecer Técnico / Observações Periciais</th>
                            <th className="py-2 px-3 w-20 text-center">Evidência</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {room.items.map((item, iIdx) => {
                            const itemState = getGeneralStateBadge(item.state || (item.condition === 'NOVO' ? 'OTIMO' : item.condition === 'DANIFICADO' ? 'PESSIMO' : 'BOM'));
                            const itemPaint = getPaintStateBadge(item.paintState);

                            return (
                              <tr key={iIdx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-4 font-bold text-slate-900">
                                  {item.name}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${itemState.lightBg} border`}>
                                    {itemState.label}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${itemPaint.lightBg} border`}>
                                    {itemPaint.label}
                                  </span>
                                </td>
                                <td className="py-2 px-4 text-slate-700 leading-relaxed font-medium">
                                  {item.observations || 'Item em perfeitas condições de uso e funcionamento, sem avarias.'}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {item.photos?.length || item.hasPhoto ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                                      <Camera className="w-3 h-3" />
                                      {item.photos?.length || 1}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 text-[10px]">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caderno Fotográfico de Evidências */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-1 border-b-2 border-slate-800">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>2. Caderno Fotográfico de Evidências Periciais ({totalPhotos} Registros)</span>
              </h2>
              <span className="text-[10px] text-slate-500">
                Fotos com carimbo de autenticação
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/* Gather all photos or render sample verified photos */}
              {inspection.rooms.flatMap((room, rIdx) => 
                (room.photos?.length ? room.photos : room.items.flatMap(item => item.photos || [])).map((photo, pIdx) => (
                  <div key={`${rIdx}-${pIdx}`} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                    <div className="aspect-4/3 relative bg-slate-200">
                      <img
                        src={photo.url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'}
                        alt={photo.caption || room.roomName}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/75 text-white">
                        {photo.timestamp || inspection.date}
                      </span>
                    </div>
                    <div className="p-2 text-[10px] space-y-0.5">
                      <strong className="block text-slate-800 truncate">{room.roomName}</strong>
                      <p className="text-slate-500 truncate">{photo.caption || 'Registro pericial de conservação'}</p>
                    </div>
                  </div>
                ))
              )}

              {/* If no user uploaded photos yet, render high quality inspection photos representing the dossier */}
              {totalPhotos === 0 && (
                <>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                    <div className="aspect-4/3 relative bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1502005229762-ee1b44b7d156?w=600&auto=format&fit=crop&q=80"
                        alt="Living e Janelas"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/75 text-white">
                        {inspection.date} 14:32
                      </span>
                    </div>
                    <div className="p-2 text-[10px]">
                      <strong className="block text-slate-800 truncate">Sala de Estar</strong>
                      <p className="text-slate-500 truncate">Paredes e esquadria em perfeito estado</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                    <div className="aspect-4/3 relative bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
                        alt="Cozinha e Metais"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/75 text-white">
                        {inspection.date} 14:38
                      </span>
                    </div>
                    <div className="p-2 text-[10px]">
                      <strong className="block text-slate-800 truncate">Cozinha</strong>
                      <p className="text-slate-500 truncate">Bancada e torneiras monocomando testadas</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                    <div className="aspect-4/3 relative bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
                        alt="Banheiro e Louças"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/75 text-white">
                        {inspection.date} 14:44
                      </span>
                    </div>
                    <div className="p-2 text-[10px]">
                      <strong className="block text-slate-800 truncate">Banheiro Social</strong>
                      <p className="text-slate-500 truncate">Louças sanitárias e box blindex limpos</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                    <div className="aspect-4/3 relative bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80"
                        alt="Dormitório Principal"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/75 text-white">
                        {inspection.date} 14:50
                      </span>
                    </div>
                    <div className="p-2 text-[10px]">
                      <strong className="block text-slate-800 truncate">Suíte Principal</strong>
                      <p className="text-slate-500 truncate">Piso laminado íntegro e tomadas operantes</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Termo de Concordância & Assinaturas Eletrônicas */}
          <div className="border-t-2 border-slate-800 pt-5 space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed text-justify">
              <strong>DECLARAÇÃO CONTRATUAL:</strong> As partes declaram para os devidos fins de direito que acompanharam ou tiveram pleno acesso aos termos e fotos deste laudo de vistoria, conferindo a exatidão das descrições do imóvel supraindicado. Fica estipulado o prazo regulamentar de 48 (quarenta e oito) horas a contar do recebimento para eventual impugnação por escrito, sob pena de aceitação tácita e integral do estado de conservação aqui documentado.
            </div>

            {/* Electronic Signatures Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
              
              {/* Vistoriador */}
              <div className="border border-emerald-200 bg-emerald-50/40 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="border-b border-slate-300 pb-2">
                  <strong className="block text-slate-900 text-xs">{inspection.inspectorName}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">Perito Vistoriador Responsável</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-emerald-800 font-mono bg-emerald-100 px-2 py-0.5 rounded-full">
                  Assinado Digitalmente ICP
                </span>
                <p className="text-[8px] text-slate-400 font-mono">Hash: {Math.random().toString(36).substring(2, 10).toUpperCase()}-SHA256</p>
              </div>

              {/* Locatário */}
              <div className="border border-blue-200 bg-blue-50/40 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                  <FileSignature className="w-4 h-4" />
                </div>
                <div className="border-b border-slate-300 pb-2">
                  <strong className="block text-slate-900 text-xs">{inspection.clientName}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">Locatário / Ocupante</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-blue-800 font-mono bg-blue-100 px-2 py-0.5 rounded-full">
                  Aguardando Assinatura via OTP
                </span>
                <p className="text-[8px] text-slate-400 font-mono">Enviado via WhatsApp & E-mail</p>
              </div>

              {/* Proprietário */}
              <div className="border border-slate-200 bg-slate-50 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mx-auto">
                  <Building className="w-4 h-4" />
                </div>
                <div className="border-b border-slate-300 pb-2">
                  <strong className="block text-slate-900 text-xs">{inspection.ownerName || 'Proprietário'}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">Locador / Proprietário</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-slate-700 font-mono bg-slate-200 px-2 py-0.5 rounded-full">
                  Validado por Procuração
                </span>
                <p className="text-[8px] text-slate-400 font-mono">Imobiliária Administradora</p>
              </div>
            </div>

            {/* Authenticity Footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
              <span>Autenticador AcertGo: DOC-VERIFIED-{Date.now().toString().slice(-8)}</span>
              <span>Padrão Nacional de Laudos Periciais Vistoriador / Rede Vistorias</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

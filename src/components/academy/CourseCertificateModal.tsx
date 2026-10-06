import React from 'react';
import { X, Award, Printer, Download, CheckCircle2, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { LMSCourse, UserProfile } from '../../types/crm';

interface CourseCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: LMSCourse;
  studentName?: string;
  studentRole?: string;
  studentCreci?: string;
}

export const CourseCertificateModal: React.FC<CourseCertificateModalProps> = ({
  isOpen,
  onClose,
  course,
  studentName = 'Juliana Mendes',
  studentRole = 'Corretora de Alto Padrão',
  studentCreci = '210.984-F / SP'
}) => {
  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const certificateHash = `ACERTGO-CERT-${course.id.toUpperCase().slice(0, 8)}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto flex flex-col">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Certificado de Conclusão Oficial EAD</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 flex flex-col items-center justify-center text-center relative overflow-hidden select-none">
          
          {/* Ornamental Inner Border */}
          <div className="w-full border-4 border-double border-amber-600/40 p-6 sm:p-10 rounded-2xl relative bg-white/80 shadow-xs">
            
            {/* Top Brand Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
                🎓
              </div>
              <div className="text-left">
                <span className="text-base font-black tracking-tight text-slate-900 uppercase block font-heading">
                  Universidade Corporativa AcertGo
                </span>
                <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase block">
                  Programa de Educação Continuada e Alta Performance Imobiliária
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="my-6">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
                Certificamos para os devidos fins que
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight border-b-2 border-amber-400 pb-2 inline-block px-6">
                {studentName}
              </h2>
              <span className="text-xs text-slate-500 font-semibold block mt-1">
                {studentRole} · CRECI: {studentCreci}
              </span>
            </div>

            {/* Text Body */}
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed my-4">
              concluiu com êxito o treinamento corporativo profissionalizante de{' '}
              <strong className="text-slate-900 font-bold underline decoration-amber-400 decoration-2">
                "{course.title}"
              </strong>, 
              perfazendo a carga horária total de <strong>{Math.ceil(course.durationMinutes / 60)} horas</strong>, 
              tendo demonstrado proficiência técnica e aprovação em avaliação pedagógica por quiz e simulado prático.
            </p>

            {/* Competencies Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 my-5">
              <span className="px-3 py-1 bg-amber-100/80 border border-amber-300 text-amber-900 rounded-full text-[11px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{course.badgeName || 'Profissional Certificado'}</span>
              </span>
              <span className="px-3 py-1 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-full text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Aprovado em Avaliação (Nota ≥ 70%)</span>
              </span>
              <span className="px-3 py-1 bg-blue-100/80 border border-blue-300 text-blue-900 rounded-full text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Credenciamento Ativo 2026</span>
              </span>
            </div>

            {/* Signatures & Seal Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 mt-6 items-end">
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-serif text-xs italic text-slate-800">
                  {course.instructor}
                </div>
                <span className="text-[10px] text-slate-500 font-bold block">{course.instructorRole}</span>
                <span className="text-[9px] text-slate-400 block">Instrutor Responsável</span>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800 flex flex-col items-center justify-center text-center p-1 bg-amber-400/30">
                    <span className="text-[8px] font-black text-amber-950 uppercase leading-none">SELO OFICIAL</span>
                    <Award className="w-5 h-5 text-amber-950 my-0.5" />
                    <span className="text-[7px] font-bold text-amber-950 leading-none">ACERTGO</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-serif text-xs italic text-slate-800">
                  Emerson Carneiro dos Santos
                </div>
                <span className="text-[10px] text-slate-500 font-bold block">Diretor Geral de Educação Imobiliária</span>
                <span className="text-[9px] text-slate-400 block">Universidade Corporativa AcertGo</span>
              </div>
            </div>

            {/* Authenticity Hash Footer */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-400 font-mono gap-1">
              <span>Data de Emissão: {issueDate}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Código de Validação: {certificateHash}</span>
              <span>acertgo.com.br/validar-certificado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

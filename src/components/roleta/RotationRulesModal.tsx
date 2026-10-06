import React, { useState } from 'react';
import {
  X,
  Settings,
  Clock,
  ShieldCheck,
  Timer,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Save,
  RotateCcw
} from 'lucide-react';
import { RoletaRuleConfig } from '../../types/crm';

interface RotationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: RoletaRuleConfig;
  onSaveRules: (newRules: RoletaRuleConfig) => void;
}

export const RotationRulesModal: React.FC<RotationRulesModalProps> = ({
  isOpen,
  onClose,
  rules,
  onSaveRules
}) => {
  const [dailyDrawTime, setDailyDrawTime] = useState(rules.dailyDrawTime || '08:30');
  const [lateArrivalToleranceMinutes, setLateArrivalToleranceMinutes] = useState(
    rules.lateArrivalToleranceMinutes || 15
  );
  const [maxAbsenceMinutes, setMaxAbsenceMinutes] = useState(rules.maxAbsenceMinutes || 15);
  const [absencePenalty, setAbsencePenalty] = useState<'FINAL_DA_FILA' | 'PAUSA_TEMPORARIA' | 'REMOVER_DO_DIA'>(
    rules.absencePenalty || 'FINAL_DA_FILA'
  );
  const [geofenceRadiusMeters, setGeofenceRadiusMeters] = useState(rules.geofenceRadiusMeters || 10);
  const [autoEnforceTimeouts, setAutoEnforceTimeouts] = useState(rules.autoEnforceTimeouts ?? true);
  const [shifts, setShifts] = useState(rules.shifts || []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRules({
      dailyDrawTime,
      lateArrivalToleranceMinutes,
      maxAbsenceMinutes,
      absencePenalty,
      geofenceRadiusMeters,
      autoEnforceTimeouts,
      shifts
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/30">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Regras do Rodízio & Plantão de Atendimento
              </h3>
              <p className="text-xs text-slate-400">
                Horários de sorteio, tempo de ausência e cercamento GPS de 10 metros
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs max-h-[78vh] overflow-y-auto">
          {/* Section 1: Regra de Horário de Sorteio */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                1. Horário do Sorteio & Abertura da Fila
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Horário Oficial do Sorteio Diário *
                </label>
                <input
                  type="time"
                  required
                  value={dailyDrawTime}
                  onChange={(e) => setDailyDrawTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-800 outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Horário em que a roleta é girada e a ordem do dia é definida
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tolerância de Chegada para o Sorteio
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={lateArrivalToleranceMinutes}
                    onChange={(e) => setLateArrivalToleranceMinutes(Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-800 outline-none"
                  />
                  <span className="text-slate-600 font-semibold">minutos</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Após esse prazo, o corretor entra no final da fila
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Regra de Tempo de Ausência (Tolerância / Timeout) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                2. Tempo Máximo de Ausência (Pausa da Fila)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tempo Máximo de Ausência Permitido *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={maxAbsenceMinutes}
                    onChange={(e) => setMaxAbsenceMinutes(Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-800 outline-none"
                  />
                  <span className="text-slate-600 font-semibold">minutos</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Padrão do mercado: 15 a 30 minutos (café, almoço ou visita breve)
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Penalidade ao Exceder o Tempo
                </label>
                <select
                  value={absencePenalty}
                  onChange={(e) => setAbsencePenalty(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800 outline-none"
                >
                  <option value="FINAL_DA_FILA">Mover para o Final da Fila</option>
                  <option value="PAUSA_TEMPORARIA">Pausar Atendimento (Aguardar retorno)</option>
                  <option value="REMOVER_DO_DIA">Remover da Escala do Dia</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Ação automática quando o cronômetro zerar
                </span>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoEnforceTimeouts}
                  onChange={(e) => setAutoEnforceTimeouts(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-700">
                  Aplicar penalidade automaticamente via sistema assim que o tempo for estourado
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Cercamento GPS do Stand (Raio de 10 metros) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                3. Cercamento Eletrônico por GPS (Stands de Vendas)
              </h4>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div>
                <span className="font-bold text-emerald-950 block">Raio de Validação GPS: 10 metros</span>
                <span className="text-[11px] text-emerald-800 mt-0.5 block">
                  O corretor precisa estar a menos de 10 metros das coordenadas do Stand para entrar no sorteio.
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-mono font-black text-sm">
                10m
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Regras de Atendimento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

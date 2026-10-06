import React, { useState, useEffect } from 'react';
import { X, Layers, Check, DollarSign, Users, Home, Sparkles, Shield } from 'lucide-react';
import { SaaSPlan, SaaSModule, SaaSPlanTier } from '../../types/superAdmin';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Partial<SaaSPlan>) => void;
  planToEdit?: SaaSPlan | null;
  availableModules: SaaSModule[];
}

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  planToEdit,
  availableModules,
}) => {
  const [formData, setFormData] = useState<Partial<SaaSPlan>>({
    name: '',
    tier: 'PROFESSIONAL',
    monthlyPrice: 1290,
    annualPrice: 12384,
    description: '',
    maxUsers: 20,
    maxProperties: 500,
    maxLeadsPerMonth: 2500,
    whatsappIncluded: true,
    includedModuleIds: ['crm_roleta', 'kanban_funnel', 'imoveis_portais', 'proprietarios'],
    badge: 'Recomendado',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (planToEdit) {
      setFormData({ ...planToEdit });
    } else {
      setFormData({
        name: '',
        tier: 'PROFESSIONAL',
        monthlyPrice: 1290,
        annualPrice: 12384,
        description: '',
        maxUsers: 20,
        maxProperties: 500,
        maxLeadsPerMonth: 2500,
        whatsappIncluded: true,
        includedModuleIds: ['crm_roleta', 'kanban_funnel', 'imoveis_portais', 'proprietarios'],
        badge: 'Recomendado',
        status: 'ACTIVE'
      });
    }
  }, [planToEdit]);

  if (!isOpen) return null;

  const handleToggleModule = (moduleId: string) => {
    setFormData(prev => {
      const current = prev.includedModuleIds || [];
      if (current.includes(moduleId)) {
        return { ...prev, includedModuleIds: current.filter(m => m !== moduleId) };
      } else {
        return { ...prev, includedModuleIds: [...current, moduleId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.monthlyPrice) {
      alert('Preencha os campos obrigatórios (Nome do Plano e Preço Mensal).');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {planToEdit ? 'Editar Plano de Assinatura' : 'Novo Plano SaaS'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure preços, cotas e catálogo de módulos inclusos
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
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Plano *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Imobiliária Pro"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nível / Categoria
              </label>
              <select
                value={formData.tier || 'PROFESSIONAL'}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as SaaSPlanTier })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="STARTER">Starter / Inicial</option>
                <option value="PROFESSIONAL">Professional / Médio</option>
                <option value="ENTERPRISE">Enterprise / Grande Porte</option>
                <option value="CUSTOM">Custom / Franquias & Redes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição Comercial do Plano
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva para qual perfil de imobiliária este plano é indicado..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Preços */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-900 mb-1">
                Preço Mensal (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  required
                  value={formData.monthlyPrice || 0}
                  onChange={(e) => {
                    const m = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      monthlyPrice: m,
                      annualPrice: Math.round(m * 12 * 0.8) // 20% desconto automático sugerido
                    }));
                  }}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-purple-300 rounded-lg font-bold text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-900 mb-1">
                Preço Anual (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  value={formData.annualPrice || 0}
                  onChange={(e) => setFormData({ ...formData, annualPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-purple-300 rounded-lg font-bold text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-900 mb-1">
                Badge / Destaque
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Ex: Mais Popular"
                className="w-full text-xs px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Limites e Cotas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Limite de Usuários
              </label>
              <input
                type="number"
                value={formData.maxUsers || 10}
                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 0 })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Coloque -1 para ilimitado</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Limite de Imóveis Ativos
              </label>
              <input
                type="number"
                value={formData.maxProperties || 500}
                onChange={(e) => setFormData({ ...formData, maxProperties: parseInt(e.target.value) || 0 })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Leads por Mês
              </label>
              <input
                type="number"
                value={formData.maxLeadsPerMonth || 2000}
                onChange={(e) => setFormData({ ...formData, maxLeadsPerMonth: parseInt(e.target.value) || 0 })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* WhatsApp Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="whatsappCheck"
              checked={formData.whatsappIncluded || false}
              onChange={(e) => setFormData({ ...formData, whatsappIncluded: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="whatsappCheck" className="text-xs text-slate-800 font-medium cursor-pointer">
              Incluir Desk WhatsApp Multi-Atendente no pacote padrão sem custo adicional
            </label>
          </div>

          {/* Módulos Inclusos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Módulos Inclusos Neste Plano ({formData.includedModuleIds?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    includedModuleIds: availableModules.map(m => m.id)
                  }));
                }}
                className="text-[11px] text-purple-600 font-semibold hover:underline"
              >
                Selecionar Todos
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {availableModules.map((mod) => {
                const isSelected = formData.includedModuleIds?.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => handleToggleModule(mod.id)}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-50/70 border-purple-300 text-purple-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="truncate">{mod.name}</span>
                    </div>
                    {mod.isCore && (
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                        Core
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Salvar Plano
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

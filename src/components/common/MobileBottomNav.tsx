import React from 'react';
import { 
  Home,
  Shuffle, 
  MessageSquare, 
  Users, 
  Columns, 
  Menu,
  LayoutDashboard
} from 'lucide-react';
import { NavTabId } from './Sidebar';

interface MobileBottomNavProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenDrawer,
}) => {
  const quickTabs = [
    { id: 'executive_dashboard' as NavTabId, label: 'Diretoria', icon: LayoutDashboard },
    { id: 'imoveis' as NavTabId, label: 'Imóveis', icon: Home },
    { id: 'kanban' as NavTabId, label: 'Leads', icon: Columns },
    { id: 'contracts' as NavTabId, label: 'Locação', icon: Users },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg flex items-center justify-around safe-area-bottom">
      {quickTabs.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-blue-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* Menu Drawer Opener */}
      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-600 hover:text-slate-900 transition-all font-medium"
      >
        <Menu className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[10px] mt-0.5 tracking-tight">Mais</span>
      </button>
    </div>
  );
};

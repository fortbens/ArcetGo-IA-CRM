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
    <nav 
      aria-label="Navegação Principal Mobile"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1.5 shadow-lg safe-area-bottom"
    >
      <div className="grid grid-cols-5 gap-1 max-w-lg mx-auto w-full items-center justify-items-center">
        {quickTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer select-none text-center group ${
                isActive
                  ? 'bg-blue-50/70'
                  : 'hover:bg-slate-100/60 active:scale-95'
              }`}
            >
              <div 
                className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span 
                className={`text-[9px] font-bold mt-1 tracking-tight text-center leading-tight truncate w-full block ${
                  isActive ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Menu Drawer Opener */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer select-none text-center group hover:bg-slate-100/60 active:scale-95"
        >
          <div className="w-9 h-7 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-slate-800">
            <Menu className="w-4 h-4 stroke-[1.8]" />
          </div>
          <span className="text-[9px] font-bold mt-1 tracking-tight text-center leading-tight text-slate-600 truncate w-full block">
            Mais
          </span>
        </button>
      </div>
    </nav>
  );
};

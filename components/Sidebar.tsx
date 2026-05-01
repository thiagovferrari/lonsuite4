import React from 'react';
import { ViewState } from '../types';
import { LayoutGrid, Stethoscope, Settings, Trash2, Home } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  trashCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, trashCount = 0 }) => {
  const NavItem = ({
    view,
    icon: Icon,
    label,
    badge,
  }: {
    view: ViewState;
    icon: any;
    label: string;
    badge?: number;
  }) => {
    const isActive = currentView === view;
    return (
      <div className="relative group flex flex-col items-center">
        <button
          onClick={() => setView(view)}
          aria-label={label}
          className={`relative flex items-center justify-center w-[40px] h-[40px] rounded-[12px] transition-all duration-300 ${isActive
            ? 'bg-white text-[#1d1d1f] shadow-apple border border-black/[0.04]'
            : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-white/80 border border-transparent'
            }`}
        >
          <Icon size={20} strokeWidth={isActive ? 1.5 : 1} />
          {badge != null && badge > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-[#1d1d1f] text-white text-[8px] font-bold rounded-[6px] flex items-center justify-center px-1 shadow-sm leading-none">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1d1d1f] text-white text-[10px] font-medium tracking-wider uppercase rounded-[8px] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-[400] shadow-apple-md translate-x-1 group-hover:translate-x-0">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1d1d1f]" />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 w-[56px] flex-col items-center glass rounded-[22px] z-[200] shadow-apple py-5">
        
        {/* Primary Nav */}
        <div className="flex flex-col items-center gap-5 flex-1">
          <NavItem view={ViewState.HOME} icon={Home} label="Início" />
          <NavItem view={ViewState.ATIVOS} icon={LayoutGrid} label="Ativos" />
          <NavItem view={ViewState.CASES} icon={Stethoscope} label="Cases Científicos" />
        </div>

        {/* Secondary Nav */}
        <div className="flex flex-col items-center gap-2 mt-auto">
          <NavItem view={ViewState.TRASH} icon={Trash2} label="Lixeira" badge={trashCount} />
          <div className="divider w-8 my-1" />
          <NavItem view={ViewState.SETTINGS} icon={Settings} label="Ajustes" />
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[200]">
        <div className="glass border-t border-black/6 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-around h-[72px] px-6 max-w-lg mx-auto pb-safe">
            <NavItem view={ViewState.HOME} icon={Home} label="Início" />
            <NavItem view={ViewState.ATIVOS} icon={LayoutGrid} label="Ativos" />
            <NavItem view={ViewState.CASES} icon={Stethoscope} label="Cases" />
            <NavItem view={ViewState.TRASH} icon={Trash2} label="Lixeira" badge={trashCount} />
            <NavItem view={ViewState.SETTINGS} icon={Settings} label="Ajustes" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import * as React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  Mic, 
  CheckSquare, 
  Library 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  className?: string;
}

export const Sidebar = ({ activePage, setActivePage, className }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'chat', label: 'Bot Aspri', icon: Bot },
    { id: 'draft', label: 'Pusat Draft', icon: FileText },
    { id: 'meeting', label: 'Asisten Rapat', icon: Mic },
    { id: 'task', label: 'Tugas Saya', icon: CheckSquare },
    { id: 'knowledge', label: 'Pustaka Kerja', icon: Library }
  ];

  return (
    <aside className={cn("w-64 bg-slate-50/50 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 gap-2 select-none", className)}>
      <nav className="flex-1 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                {
                  "bg-brand/10 text-brand border border-brand/20 shadow-sm shadow-brand/5": isActive,
                  "text-slate-550 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800/30": !isActive,
                }
              )}
            >
              <Icon size={18} className={cn("transition-transform duration-200", { "stroke-[2.5]": isActive, "group-hover:scale-110": !isActive })} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute right-3.5 h-1.5 w-1.5 rounded-full bg-brand" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-xl">
        <p className="text-[10px] text-slate-500 dark:text-slate-450 font-semibold uppercase tracking-wider">
          E-Aspri v1.0.0
        </p>
        <p className="text-[9px] text-slate-600 dark:text-slate-550 font-medium mt-0.5">
          PWA Mode: Terhubung Luring
        </p>
      </div>
    </aside>
  );
};

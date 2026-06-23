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

interface BottomNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
  className?: string;
}

export const BottomNav = ({ activePage, setActivePage, className }: BottomNavProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'chat', label: 'Bot Aspri', icon: Bot },
    { id: 'draft', label: 'Pusat Draft', icon: FileText },
    { id: 'meeting', label: 'Rapat', icon: Mic },
    { id: 'task', label: 'Tugas', icon: CheckSquare },
    { id: 'knowledge', label: 'Pustaka', icon: Library }
  ];

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 glass flex flex-col items-stretch select-none safe-bottom", className)}>
      <div className="flex items-center justify-around px-1 h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 gap-0.5 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform touch-manipulation"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-colors",
                { "bg-brand/10 text-brand": isActive }
              )}>
                <Icon size={20} className={cn({ "stroke-[2.5]": isActive })} />
              </div>
              <span className={cn(
                "text-[9px] font-semibold tracking-tight transition-colors leading-none",
                { "text-brand": isActive, "text-slate-500 dark:text-slate-450": !isActive }
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import * as React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { User, LogOut, Moon, Sun, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  user: any;
  onLogout: () => void;
}

export const AppLayout = ({ children, activePage, setActivePage, user, onLogout }: AppLayoutProps) => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  


  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };



  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full glass border-b border-border flex items-center justify-between px-4 sm:px-6 py-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="h-8.5 w-8.5 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-lg animate-pulse-subtle">
            <Bot size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-display text-sm sm:text-base">
              E-Aspri
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Electronic Assistant Pimpinan Bappeda
            </p>
          </div>
        </div>

        {/* Action Controls & Avatar */}
        <div className="flex items-center gap-4.5 relative">
          {/* Light/Dark Toggle */}
          <button 
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User profile dropdown trigger */}
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3.5 py-2 pl-4 pr-2 rounded-full bg-slate-100/80 dark:bg-slate-800/30 hover:bg-slate-200 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 transition-all duration-200 group active:scale-[0.98] shadow-sm"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 tracking-wide leading-tight transition-colors group-hover:text-brand">
                {user?.name.split(',')[0]}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 leading-none">
                {user?.role}
              </p>
            </div>
            <div className="h-8.5 w-8.5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-sm shadow-inner group-hover:scale-105 transition-transform duration-200">
              {user?.avatar || '👨‍💼'}
            </div>
          </button>

          {/* Profile Menu Popover */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 glass p-4 shadow-xl animate-fade-in text-slate-900 dark:text-slate-100">
                <div className="px-1 py-1 border-b border-slate-150 dark:border-slate-850 mb-3">
                  <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{user?.name}</p>
                  <p className="text-[10px] text-slate-550 dark:text-slate-450 font-medium mt-0.5">{user?.role}</p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1">NIP. {user?.nip}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-2 text-xs font-semibold text-red-650 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200 text-left"
                >
                  <LogOut size={12} />
                  Keluar dari E-Aspri
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} className="hidden md:flex" />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto pb-20 md:pb-0 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation (hidden on desktop) */}
      <BottomNav activePage={activePage} setActivePage={setActivePage} className="md:hidden" />
    </div>
  );
};

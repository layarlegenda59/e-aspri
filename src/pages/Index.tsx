import * as React from 'react';
import { 
  FileText, 
  Mic, 
  CheckSquare, 
  Library, 
  FilePlus, 
  Calendar, 
  ChevronRight, 
  Clock 
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Task, Draft, MeetingDoc } from '../types';
import { cn } from '../lib/utils';

interface IndexProps {
  user: any;
  tasks: Task[];
  drafts: Draft[];
  meetings: MeetingDoc[];
  setActivePage: (page: string) => void;
  onTriggerChatCommand: (cmd: string) => void;
}

export const Index = ({ user, tasks, drafts, meetings, setActivePage, onTriggerChatCommand }: IndexProps) => {
  // Filter for priority tasks
  const priorityTasks = tasks.filter(t => !t.completed).slice(0, 3);
  
  // Filter for upcoming/active meetings
  const activeMeeting = meetings.find(m => m.status === 'proses') || meetings[0];

  const quickActions = [
    { 
      label: 'Buat Surat Undangan', 
      description: 'Draf surat undangan resmi kedinasan', 
      command: '/surat', 
      icon: FilePlus, 
      color: 'text-sky-500 dark:text-sky-400', 
      glow: 'hover:shadow-sky-500/10 dark:hover:shadow-sky-500/5 hover:border-sky-500/50', 
      bg: 'bg-sky-500/5 dark:bg-sky-500/10' 
    },
    { 
      label: 'Buat Sambutan Pimpinan', 
      description: 'Naskah pidato atau sambutan formal', 
      command: '/sambutan', 
      icon: Mic, 
      color: 'text-emerald-500 dark:text-emerald-400', 
      glow: 'hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 hover:border-emerald-500/50', 
      bg: 'bg-emerald-500/5 dark:bg-emerald-500/10' 
    },
    { 
      label: 'Ringkas Laporan Kerja', 
      description: 'Ekstrak pokok penting dokumen perencanaan', 
      command: '/ringkas', 
      icon: FileText, 
      color: 'text-amber-500 dark:text-amber-400', 
      glow: 'hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5 hover:border-amber-500/50', 
      bg: 'bg-amber-500/5 dark:bg-amber-500/10' 
    },
    { 
      label: 'Buat Notulensi Rapat', 
      description: 'Susun notulen rapi dari hasil pembahasan', 
      command: '/notulen', 
      icon: Clock, 
      color: 'text-indigo-500 dark:text-indigo-400', 
      glow: 'hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:border-indigo-500/50', 
      bg: 'bg-indigo-500/5 dark:bg-indigo-500/10' 
    },
    { 
      label: 'Buat Nota Dinas', 
      description: 'Draf nota dinas internal antar bidang', 
      command: '/notadinas', 
      icon: FileText, 
      color: 'text-purple-500 dark:text-purple-400', 
      glow: 'hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 hover:border-purple-500/50', 
      bg: 'bg-purple-500/5 dark:bg-purple-500/10' 
    },
    { 
      label: 'Cari Referensi Kerja', 
      description: 'Akses basis data regulasi & pustaka Bappeda', 
      path: 'knowledge', 
      icon: Library, 
      color: 'text-pink-500 dark:text-pink-400', 
      glow: 'hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5 hover:border-pink-500/50', 
      bg: 'bg-pink-500/5 dark:bg-pink-500/10' 
    },
    { 
      label: 'Kelola Tugas Harian', 
      description: 'Pantau daftar pekerjaan dan tenggat waktu', 
      path: 'task', 
      icon: CheckSquare, 
      color: 'text-teal-500 dark:text-teal-400', 
      glow: 'hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5 hover:border-teal-500/50', 
      bg: 'bg-teal-500/5 dark:bg-teal-500/10' 
    },
    { 
      label: 'Kelola Draft Dokumen', 
      description: 'Lihat, edit, dan ekspor arsip dokumen kerja', 
      path: 'draft', 
      icon: FileText, 
      color: 'text-rose-500 dark:text-rose-400', 
      glow: 'hover:shadow-rose-500/10 dark:hover:shadow-rose-500/5 hover:border-rose-500/50', 
      bg: 'bg-rose-500/5 dark:bg-rose-500/10' 
    }
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.command) {
      onTriggerChatCommand(action.command);
    } else if (action.path) {
      setActivePage(action.path);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* 1. Welcoming Hero Banner (Executive Command Center Theme) */}
      <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-xl dark:shadow-slate-950/40">
        {/* Decorative glass mesh accents */}
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Command Center
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-none">
              Selamat Datang Kembali, {user?.name.split(',')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 max-w-2xl leading-relaxed">
              Asisten Virtual Anda siap sedia membantu memformulasikan surat dinas, merangkum dokumen perencanaan, dan mengorganisir jadwal kerja hari ini.
            </p>
          </div>
          
          {/* Live system counter widgets */}
          <div className="grid grid-cols-3 gap-3 sm:w-80 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 text-center backdrop-blur-sm">
              <span className="block text-lg sm:text-2xl font-black text-slate-800 dark:text-white font-mono leading-none">
                {tasks.filter(t => !t.completed).length}
              </span>
              <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1.5">Tugas</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 text-center backdrop-blur-sm">
              <span className="block text-lg sm:text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono leading-none">
                {meetings.filter(m => m.status === 'proses').length > 0 ? 'LIVE' : meetings.length}
              </span>
              <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1.5">Agenda</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 text-center backdrop-blur-sm">
              <span className="block text-lg sm:text-2xl font-black text-blue-500 dark:text-blue-400 font-mono leading-none">
                {drafts.length}
              </span>
              <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1.5">Draf</span>
            </div>
          </div>
        </div>
      </section>
 
      {/* 2. Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Columns: Quick Actions Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display pl-1.5">
              Aksi Cepat Dokumen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    className={cn(
                      "relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 hover:bg-white dark:hover:bg-slate-900/35 transition-all duration-300 group text-left hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] backdrop-blur-sm overflow-hidden",
                      action.glow
                    )}
                  >
                    {/* Light subtle glow blob on hover */}
                    <div className={cn(
                      "absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-300 pointer-events-none",
                      action.bg
                    )} />

                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-inner flex items-center justify-center shrink-0",
                        action.bg,
                        action.color
                      )}>
                        <Icon size={20} className="stroke-[2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                          {action.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1.5 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100/60 dark:border-slate-800/30 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                      <span>
                        {action.command ? `Picu ${action.command}` : 'Navigasi Modul'}
                      </span>
                      <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
 
        {/* Right Column: Widgets */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Prioritas & Agenda */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pl-1">
              <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">
                Prioritas & Agenda
              </h3>
              <button 
                type="button"
                onClick={() => setActivePage('task')}
                className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
              >
                Tugas Saya
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Rapat Terdekat (Primary Glow Accent Card) */}
              {activeMeeting && (
                <div 
                  onClick={() => setActivePage('meeting')}
                  className={cn(
                    "relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 cursor-pointer group active:scale-[0.99] backdrop-blur-sm",
                    activeMeeting.status === 'proses' 
                      ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-[0_8px_30px_rgba(16,185,129,0.06)] hover:border-emerald-500/60"
                      : "border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 hover:border-slate-300 dark:hover:border-slate-700/65 hover:bg-white dark:hover:bg-slate-900/20 shadow-sm"
                  )}
                >
                  {/* Glow backdrop effect for live meeting */}
                  {activeMeeting.status === 'proses' && (
                    <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-500/20 blur-xl animate-pulse pointer-events-none" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl shrink-0 flex items-center justify-center shadow-inner",
                      activeMeeting.status === 'proses'
                        ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                    )}>
                      <Calendar size={20} className={cn(activeMeeting.status === 'proses' && "animate-bounce-light")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          RAPAT TERDEKAT
                        </span>
                        {activeMeeting.status === 'proses' && (
                          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                            LIVE
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 leading-snug group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {activeMeeting.title}
                      </h4>
                      
                      <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-405 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {activeMeeting.date}
                        </span>
                        <span>•</span>
                        <span>{activeMeeting.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tugas List Widget */}
              <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 backdrop-blur-sm shadow-sm space-y-4">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                  TUGAS UTAMA ({priorityTasks.length})
                </p>
                
                {priorityTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Tidak ada tugas mendesak hari ini.</p>
                ) : (
                  <div className="space-y-3.5">
                    {priorityTasks.map((task) => {
                      const priorityBorder = task.priority === 'tinggi' 
                        ? 'border-red-500/30 dark:border-red-500/15 bg-red-500/[0.02] dark:bg-red-500/[0.03]' 
                        : task.priority === 'sedang' 
                          ? 'border-amber-500/30 dark:border-amber-500/15 bg-amber-500/[0.02] dark:bg-amber-500/[0.03]' 
                          : 'border-sky-500/30 dark:border-sky-500/15 bg-sky-500/[0.02] dark:bg-sky-500/[0.03]';
                          
                      const priorityBadge = task.priority === 'tinggi'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : task.priority === 'sedang'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-sky-500/10 text-sky-500 border-sky-500/20';

                      return (
                        <div 
                          key={task.id}
                          onClick={() => setActivePage('task')}
                          className={cn(
                            "flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/50 hover:bg-white dark:hover:bg-slate-900/20",
                            priorityBorder
                          )}
                        >
                          <div className={cn(
                            "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-subtle",
                            task.priority === 'tinggi' ? 'bg-red-500' : task.priority === 'sedang' ? 'bg-amber-500' : 'bg-sky-500'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-emerald-500 truncate">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2.5 mt-2.5">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                                priorityBadge
                              )}>
                                {task.priority}
                              </span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                                Batas: {task.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Aktivitas Terakhir */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pl-1">
              <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">
                Aktivitas Terakhir
              </h3>
              <button 
                type="button"
                onClick={() => setActivePage('draft')}
                className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
              >
                Pusat Draft
              </button>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/10 backdrop-blur-sm shadow-sm">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-4">
                DRAF DOKUMEN BARU ({drafts.length})
              </p>
              
              {drafts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Belum ada draf tersimpan.</p>
              ) : (
                <div className="space-y-3">
                  {drafts.slice(0, 3).map(draft => (
                    <div 
                      key={draft.id} 
                      onClick={() => setActivePage('draft')}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700/50 hover:-translate-y-0.5 hover:shadow-sm hover:bg-white dark:hover:bg-slate-900/30 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-emerald-500 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors leading-snug truncate pr-2">
                            {draft.title}
                          </p>
                          <span className="text-[9px] text-slate-400 dark:text-slate-555 font-bold font-mono mt-1 block">
                            Diubah: {new Date(draft.lastModified).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider shrink-0 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                        {draft.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
};

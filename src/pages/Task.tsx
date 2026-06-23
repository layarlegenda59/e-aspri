import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog } from '../components/ui/dialog';
import { Select } from '../components/ui/select';
import { CheckSquare, Square, AlertCircle, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import confetti from 'canvas-confetti';

interface TaskProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskPage = ({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskProps) => {
  const [selectedTab, setSelectedTab] = React.useState<'semua' | 'aktif' | 'selesai'>('semua');
  const [isOpenAdd, setIsOpenAdd] = React.useState(false);

  // Form states
  const [newTitle, setNewTitle] = React.useState('');
  const [newPriority, setNewPriority] = React.useState<'tinggi' | 'sedang' | 'rendah'>('sedang');
  const [newCategory, setNewCategory] = React.useState('Administrasi');
  const [newDueDate, setNewDueDate] = React.useState('Besok');

  const filteredTasks = tasks.filter(task => {
    if (selectedTab === 'aktif') return !task.completed;
    if (selectedTab === 'selesai') return task.completed;
    return true;
  });

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleTask(id);
    
    // Trigger confetti if marked completed (from false to true)
    if (!currentlyCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.85 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
      });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate
    });

    // Reset Form
    setNewTitle('');
    setNewPriority('sedang');
    setNewCategory('Administrasi');
    setNewDueDate('Besok');
    setIsOpenAdd(false);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 font-display">
            Tugas Saya
          </h2>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Kelola agenda kerja, notulen tindak lanjut, dan tenggat waktu pimpinan.
          </p>
          {/* Compact stats for mobile */}
          <div className="flex items-center gap-3 mt-1.5 md:hidden">
            <span className="text-[10px] font-bold text-slate-400">
              <span className="text-brand font-mono">{tasks.filter(t => !t.completed).length}</span> aktif •{' '}
              <span className="text-slate-500 font-mono">{tasks.filter(t => t.completed).length}</span> selesai
            </span>
            {tasks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-brand font-mono">
                  {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="h-9 px-3.5 font-semibold text-xs shrink-0"
          onClick={() => setIsOpenAdd(true)}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Tambah Tugas</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </div>

      {/* 2. Tasks Filters & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left 3 cols: Filter list */}
        <div className="md:col-span-3 space-y-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-850/60 w-fit">
            <button
              onClick={() => setSelectedTab('semua')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTab === 'semua' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Semua Tugas ({tasks.length})
            </button>
            <button
              onClick={() => setSelectedTab('aktif')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTab === 'aktif' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Aktif ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setSelectedTab('selesai')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTab === 'selesai' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Selesai ({tasks.filter(t => t.completed).length})
            </button>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-transparent py-14 text-center">
              <CardContent className="space-y-1.5">
                <CheckCircle2 size={36} className="mx-auto text-slate-400 dark:text-slate-700 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-450">Tidak ada tugas dalam daftar</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Semua pekerjaan Anda telah selesai diselesaikan.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                    task.completed
                      ? 'bg-slate-50 dark:bg-slate-900/5 border-slate-200 dark:border-slate-900/60 opacity-60'
                      : 'bg-white dark:bg-slate-900/10 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(task.id, task.completed)}
                      className="text-slate-400 hover:text-brand transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={19} className="text-brand fill-brand/10" />
                      ) : (
                        <Square size={19} />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold leading-tight text-slate-800 dark:text-slate-200 truncate ${task.completed ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 select-none">
                        <Badge 
                          variant={task.priority === 'tinggi' ? 'danger' : task.priority === 'sedang' ? 'warning' : 'secondary'}
                          className="px-1 py-0 text-[8px] font-bold"
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-450 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {task.category}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium font-mono flex items-center gap-1 pl-1">
                          <Calendar size={9} />
                          Tenggat: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right 1 col: Stats/KPI widgets - hidden on mobile (shown in header) */}
        <div className="hidden md:block space-y-4">
          <Card className="bg-white dark:bg-slate-900/10 border-slate-200 dark:border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Ringkasan Capaian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="text-center py-2">
                <span className="text-3xl font-extrabold text-brand font-display">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mt-1">
                  Tugas Terselesaikan
                </p>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand rounded-full transition-all duration-500 shadow-sm shadow-brand/35"
                  style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Add Task Dialog Form */}
      {isOpenAdd && (
        <Dialog
          isOpen={true}
          onClose={() => setIsOpenAdd(false)}
          title="Tambah Agenda Tugas Baru"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Deskripsi Tugas</label>
                <Input
                  type="text"
                  required
                  placeholder="Misal: Tinjau berkas usulan musrenbang..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Prioritas</label>
                  <Select
                    options={['rendah', 'sedang', 'tinggi']}
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Kategori</label>
                  <Select
                    options={['Administrasi', 'Rapat', 'Koordinasi', 'Dokumentasi', 'Perencanaan']}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Estimasi Tenggat</label>
                <Input
                  type="text"
                  required
                  placeholder="Contoh: Hari ini, Besok, 29 Jun 2026..."
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpenAdd(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="font-semibold text-xs h-9 px-3.5"
              >
                Simpan Tugas
              </Button>
            </div>
          </form>
        </Dialog>
      )}

    </div>
  );
};

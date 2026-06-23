import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { FileText, Trash2, Search, Copy, Check, Download, Edit } from 'lucide-react';
import { Draft } from '../types';

interface DraftProps {
  drafts: Draft[];
  onUpdateDraft: (id: string, title: string, content: string) => void;
  onDeleteDraft: (id: string) => void;
}

export const DraftPage = ({ drafts, onUpdateDraft, onDeleteDraft }: DraftProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Semua');
  const [editingDraft, setEditingDraft] = React.useState<Draft | null>(null);
  
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const categories = ['Semua', 'Sambutan', 'Nota Dinas', 'Surat', 'Laporan'];

  // Filter drafts based on search and category
  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || draft.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (draft: Draft) => {
    const element = document.createElement("a");
    const file = new Blob([draft.content], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${draft.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDraft) return;
    onUpdateDraft(editingDraft.id, editingDraft.title, editingDraft.content);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditingDraft(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* 1. Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 font-display">
            Pusat Draft Dokumen
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Kelola dan unduh draf naskah resmi yang dibuat oleh Bot Aspri.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            type="text"
            placeholder="Cari draf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-100/50 dark:bg-slate-950/20 p-1.5 rounded-lg max-w-full w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand/10 text-brand border border-brand/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. Drafts Grid */}
      {filteredDrafts.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-transparent py-12 text-center">
          <CardContent className="space-y-2">
            <FileText size={40} className="mx-auto text-slate-400 dark:text-slate-655 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-450">Tidak ada draf ditemukan</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Mulai obrolan dengan Bot Aspri untuk membuat draf baru.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {filteredDrafts.map((draft) => (
            <Card key={draft.id} className="bg-white dark:bg-slate-900/10 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between h-48">
              <CardHeader className="p-4 pb-2.5 flex flex-row items-start justify-between space-y-0 gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="primary" className="px-1 py-0 text-[8px] font-bold">
                      {draft.category}
                    </Badge>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(draft.lastModified).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <CardTitle className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-brand line-clamp-2">
                    {draft.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingDraft(draft)}
                    className="p-1.5 rounded text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Hapus draf ini?')) onDeleteDraft(draft.id);
                    }}
                    className="p-1.5 rounded text-slate-500 dark:text-slate-450 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-[11px] text-slate-650 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {draft.content.replace(/[#*`>]/g, '').trim()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 3. Editing/Viewing Dialog Form */}
      {editingDraft && (
        <Dialog
          isOpen={true}
          onClose={() => setEditingDraft(null)}
          title="Pratinjau & Sunting Draf"
          className="max-w-2xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Judul Dokumen
                </label>
                <Input
                  type="text"
                  required
                  value={editingDraft.title}
                  onChange={(e) => setEditingDraft({ ...editingDraft, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Isi Naskah Resmi
                </label>
                <textarea
                  required
                  rows={12}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand focus:border-transparent resize-none overflow-y-auto"
                  value={editingDraft.content}
                  onChange={(e) => setEditingDraft({ ...editingDraft, content: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none h-8.5 text-xs font-semibold"
                  onClick={() => handleCopy(editingDraft.content)}
                >
                  {copied ? <Check size={12} className="text-brand" /> : <Copy size={12} />}
                  {copied ? 'Tersalin' : 'Salin Teks'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none h-8.5 text-xs font-semibold"
                  onClick={() => handleDownload(editingDraft)}
                >
                  <Download size={12} />
                  Unduh .TXT
                </Button>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8.5"
                  onClick={() => setEditingDraft(null)}
                >
                  Tutup
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="h-8.5 text-xs font-semibold"
                >
                  {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
                </Button>
              </div>
            </div>
          </form>
        </Dialog>
      )}

    </div>
  );
};

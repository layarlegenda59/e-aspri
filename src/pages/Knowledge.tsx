import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog } from '../components/ui/dialog';
import { 
  Library, 
  Folder, 
  FileText, 
  UploadCloud, 
  ArrowRight, 
  Search, 
  CheckCircle, 
  Sparkles, 
  Plus 
} from 'lucide-react';
import { PustakaFile } from '../types';

interface KnowledgeProps {
  files: PustakaFile[];
  onUploadFile: (newFile: Omit<PustakaFile, 'id' | 'uploadDate'>) => void;
  setActivePage: (page: string) => void;
  onTriggerChatCommand: (cmd: string, initialValues: Record<string, string>) => void;
}

export const Knowledge = ({ files, onUploadFile, setActivePage, onTriggerChatCommand }: KnowledgeProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // Upload and scanning animation states
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [scanStep, setScanStep] = React.useState('');
  const [fileNameToUpload, setFileNameToUpload] = React.useState('');
  const [selectedFolderToUpload, setSelectedFolderToUpload] = React.useState('Planning');

  // Selected file details drawer state
  const [viewingFile, setViewingFile] = React.useState<PustakaFile | null>(null);

  const folders = [
    { key: 'Personal', name: 'Personal Documents', desc: 'Naskah sambutan, pidato, & catatan lama', count: files.filter(f => f.category === 'Personal').length },
    { key: 'Templates', name: 'Administrative Templates', desc: 'Format nota dinas & undangan baku', count: files.filter(f => f.category === 'Templates').length },
    { key: 'Planning', name: 'Planning Documents', desc: 'RPJMD, RKPD, & Renstra Bappeda', count: files.filter(f => f.category === 'Planning').length },
    { key: 'Monev', name: 'Monitoring & Evaluation', desc: 'Laporan triwulan & kinerja dinas', count: files.filter(f => f.category === 'Monev').length },
    { key: 'Meetings', name: 'Meetings & Coordination', desc: 'Notulen & catatan koordinasi', count: files.filter(f => f.category === 'Meetings').length },
    { key: 'Proposals', name: 'Musrenbang & Proposals', desc: 'Proposal OPD & hasil musrenbang', count: files.filter(f => f.category === 'Proposals').length },
    { key: 'SOP', name: 'SOP (Prosedur Standar)', desc: 'Regulasi internal & tata naskah dinas', count: files.filter(f => f.category === 'SOP').length }
  ];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = !selectedCategory || file.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Handle mock file upload
  const triggerMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileNameToUpload(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    const steps = [
      'Mengunggah berkas ke Pustaka Kerja...',
      'Membaca dokumen teks...',
      'Mengekstraksi istilah & data spasial Bappeda...',
      'Melakukan sinkronisasi semantik indeks...',
      'Pustaka berhasil diindeks!'
    ];

    let currentStepIdx = 0;
    setScanStep(steps[0]);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUploadFile({
              name: file.name,
              category: selectedFolderToUpload,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              description: `Dokumen rujukan diunggah staf: ${file.name}`
            });
            setIsUploading(false);
          }, 600);
          return 100;
        }
        
        // Progress incremental changes
        const nextProgress = prev + 10;
        const stepIdx = Math.floor(nextProgress / 25);
        if (stepIdx !== currentStepIdx && steps[stepIdx]) {
          currentStepIdx = stepIdx;
          setScanStep(steps[stepIdx]);
        }
        
        return nextProgress;
      });
    }, 250);
  };

  const handleSmartAction = (action: string) => {
    if (!viewingFile) return;
    
    let command = '';
    let initialValues: Record<string, string> = {};

    switch (action) {
      case 'ringkas':
        command = '/ringkas';
        initialValues = {
          judul: viewingFile.name,
          fokus: 'Ringkasan Eksekutif',
          text: `Buatkan ringkasan lengkap dari berkas rujukan: "${viewingFile.name}".`
        };
        break;
      case 'keypoints':
        command = '/ringkas';
        initialValues = {
          judul: viewingFile.name,
          fokus: 'Capaian Kinerja',
          text: `Ekstrak poin-poin kunci (key points) penting dari berkas: "${viewingFile.name}".`
        };
        break;
      case 'execsummary':
        command = '/ringkas';
        initialValues = {
          judul: viewingFile.name,
          fokus: 'Ringkasan Eksekutif',
          text: `Tolong susun executive summary formal yang siap diserahkan ke pimpinan berdasarkan berkas: "${viewingFile.name}".`
        };
        break;
      case 'briefing':
        command = '/ringkas';
        initialValues = {
          judul: viewingFile.name,
          fokus: 'Ringkasan Eksekutif',
          text: `Susun briefing note ringkas untuk bahan pembicaraan pimpinan berdasarkan berkas: "${viewingFile.name}".`
        };
        break;
      case 'minutes':
        command = '/notulen';
        initialValues = {
          judul: `Pembahasan Berkas ${viewingFile.name.split('.')[0]}`,
          pimpinan: 'Kepala Bappeda',
          poin: `Dokumen dibahas: ${viewingFile.name}.\nDraf usulan disetujui sesuai regulasi terkait.`
        };
        break;
      case 'actions':
        command = '/notulen';
        initialValues = {
          judul: `Action Items Berkas ${viewingFile.name.split('.')[0]}`,
          pimpinan: 'Kepala Bappeda',
          poin: `Ekstrak daftar rencana tindak lanjut (action items), unit penanggung jawab, dan estimasi tenggat waktu penyelesaian dari berkas: "${viewingFile.name}".`
        };
        break;
      case 'presentation':
        command = '/ringkas';
        initialValues = {
          judul: viewingFile.name,
          fokus: 'Ringkasan Eksekutif',
          text: `Buatkan kerangka outline slide presentasi PowerPoint ringkas berdasarkan berkas: "${viewingFile.name}".`
        };
        break;
      case 'speech':
        command = '/sambutan';
        initialValues = {
          acara: `Tinjauan Berkas ${viewingFile.name.split('.')[0]}`,
          pimpinan: 'Kepala Bappeda',
          tema: `Implementasi kebijakan strategis yang diatur dalam berkas "${viewingFile.name}"`,
          durasi: '10',
          audiens: 'Staf Bappeda dan jajaran OPD terkait'
        };
        break;
      case 'followup':
        command = '/notulen';
        initialValues = {
          judul: `Follow-up Checklist - ${viewingFile.name.split('.')[0]}`,
          pimpinan: 'Kepala Bappeda',
          poin: `Buat follow-up checklist mendetail berisi daftar centang kegiatan yang diusulkan dalam berkas: "${viewingFile.name}".`
        };
        break;
      default:
        return;
    }

    setViewingFile(null);
    onTriggerChatCommand(command, initialValues);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 font-display">
            Pustaka Kerja
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Basis data referensi organisasi untuk melatih pemahaman dokumen Bot Aspri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400">Target Folder:</span>
            <select
              value={selectedFolderToUpload}
              onChange={(e) => setSelectedFolderToUpload(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none"
            >
              {folders.map(f => (
                <option key={f.key} value={f.key}>{f.name.split(' ')[0]}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer bg-brand hover:bg-brand/90 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-brand/10">
            <UploadCloud size={14} />
            Unggah Berkas Referensi
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx,.xlsx,.txt" 
              onChange={triggerMockUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-6 space-y-4 shadow-2xl glass">
            <div className="flex items-center gap-3 text-brand">
              <Sparkles className="animate-spin" size={20} />
              <p className="text-sm font-bold font-display">Pemindaian Indeks Semantik AI</p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200 line-clamp-1">{fileNameToUpload}</span>
                <span className="text-slate-400 font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand rounded-full transition-all duration-300 shadow-sm shadow-brand/30"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium animate-pulse text-center">
              {scanStep}
            </p>
          </Card>
        </div>
      )}

      {/* 2. Folders Grid View */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-display pl-1">
          Kategori Pustaka Kerja
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {folders.map((folder) => (
            <div
              key={folder.key}
              onClick={() => setSelectedCategory(selectedCategory === folder.key ? null : folder.key)}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-34 ${
                selectedCategory === folder.key
                  ? 'bg-brand/10 border-brand text-slate-900 dark:text-slate-100 shadow-sm shadow-brand/5'
                  : 'bg-white dark:bg-slate-900/10 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <Folder 
                  size={20} 
                  className={selectedCategory === folder.key ? 'text-brand fill-brand/20' : 'text-slate-500'} 
                />
                <Badge 
                  variant={selectedCategory === folder.key ? 'primary' : 'secondary'} 
                  className="text-[8px] font-bold px-1 py-0"
                >
                  {folder.count}
                </Badge>
              </div>
              <div>
                <p className="text-[11px] font-extrabold font-display leading-tight truncate">
                  {folder.name}
                </p>
                <p className="text-[8px] text-slate-500 leading-tight mt-1 font-medium line-clamp-2">
                  {folder.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Document List Section */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-1">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-display">
            {selectedCategory ? `Daftar Berkas: ${folders.find(f => f.key === selectedCategory)?.name}` : 'Semua Berkas Pustaka'}
          </h3>
          <div className="relative w-full sm:w-60">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari di pustaka..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand focus:border-transparent"
            />
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-transparent py-10 text-center select-none">
            <CardContent className="space-y-1.5">
              <Library size={32} className="mx-auto text-slate-400 dark:text-slate-705 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-550 dark:text-slate-450">Tidak ada berkas pustaka</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-555">Unggah berkas untuk mulai membagikan dokumen dengan Bot Aspri.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/5 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Nama Berkas</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Ukuran</th>
                    <th className="p-3.5">Diunggah</th>
                    <th className="p-3.5 text-right pr-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                  {filteredFiles.map((file) => (
                    <tr 
                      key={file.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/20 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <td className="p-3.5 pl-5 font-semibold text-slate-900 dark:text-slate-200 max-w-[240px] truncate">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-brand shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-bold">
                          {folders.find(f => f.key === file.category)?.name.split(' ')[0] || file.category}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-mono text-[10px] text-slate-500 dark:text-slate-455">{file.size}</td>
                      <td className="p-3.5 font-mono text-[10px] text-slate-500 dark:text-slate-455">
                        {new Date(file.uploadDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-3.5 text-right pr-5">
                        <button
                          type="button"
                          onClick={() => setViewingFile(file)}
                          className="text-[10px] font-bold text-brand hover:text-brand/80 transition-colors"
                        >
                          Periksa Berkas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800/50">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-brand/5 border border-brand/10 text-brand shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="px-1.5 py-0 text-[8px] font-bold">
                        {folders.find(f => f.key === file.category)?.name.split(' ')[0] || file.category}
                      </Badge>
                      <span className="text-[9px] font-mono text-slate-400">{file.size}</span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(file.uploadDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingFile(file)}
                    className="text-[10px] font-bold text-brand hover:text-brand/80 transition-colors shrink-0 px-2 py-1.5 rounded-lg bg-brand/5 border border-brand/10"
                  >
                    Buka
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Document Viewer & Smart Actions Overlay */}
      {viewingFile && (
        <Dialog
          isOpen={true}
          onClose={() => setViewingFile(null)}
          title={`Detail Berkas: ${viewingFile.name}`}
          className="max-w-xl"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed font-medium">
                {viewingFile.description || 'Tidak ada deskripsi terlampir untuk berkas ini.'}
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1.5 border-t border-slate-200 dark:border-slate-900">
                <span>Ukuran: {viewingFile.size}</span>
                <span>Diunggah: {viewingFile.uploadDate}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider pl-0.5">
                Pilih Aksi Cepat Berbasis Referensi AI (9 Fitur Cerdas)
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSmartAction('ringkas')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">📑 Ringkas Dokumen</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('keypoints')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">🔑 Ekstrak Poin Kunci</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('execsummary')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">📄 Buat Executive Summary</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('briefing')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">📋 Buat Briefing Note</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('minutes')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">📝 Buat Notulen Rapat</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('actions')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">✅ Ekstrak Action Items</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('presentation')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">📊 Buat Outline Presentasi</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('speech')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">🎤 Buat Poin Sambutan</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSmartAction('followup')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-left text-xs transition-all group font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">📅 Buat Daftar Tindak Lanjut</span>
                  <ArrowRight size={11} className="text-slate-450 dark:text-slate-650 group-hover:text-brand transition-all" />
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

    </div>
  );
};

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog } from '../components/ui/dialog';
import { 
  Mic, 
  Upload, 
  FileText, 
  Play, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  FilePlus, 
  CheckSquare 
} from 'lucide-react';
import { MeetingDoc } from '../types';

interface MeetingProps {
  meetings: MeetingDoc[];
  onAddMeeting: (newMeeting: MeetingDoc) => void;
  onAddTasks: (taskTitles: string[]) => void;
  onSaveDraft: (title: string, content: string) => void;
}

export const Meeting = ({ meetings, onAddMeeting, onAddTasks, onSaveDraft }: MeetingProps) => {
  const [selectedMeeting, setSelectedMeeting] = React.useState<MeetingDoc | null>(null);
  
  // Transcription and Notulensi generation states
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processStep, setProcessStep] = React.useState('');
  const [processProgress, setProcessProgress] = React.useState(0);
  
  // Custom states for task integration
  const [pushedTasks, setPushedTasks] = React.useState<Record<string, boolean>>({});
  const [pushedDrafts, setPushedDrafts] = React.useState<Record<string, boolean>>({});

  const triggerMockRecording = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    
    const steps = [
      'Menerima rekaman audio rapat...',
      'Menerjemahkan suara ke transkrip teks (Speech-to-Text)...',
      'Mengidentifikasi pembicara & poin penting...',
      'Mengekstraksi Keputusan Utama & Rencana Tindak Lanjut...',
      'Notulen berhasil digenerasikan!'
    ];

    let currentStepIdx = 0;
    setProcessStep(steps[0]);

    const interval = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: MeetingDoc = {
              id: 'm_' + Math.random().toString(36).substring(7),
              title: 'Rapat Evaluasi Penurunan Stunting Terintegrasi',
              date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }),
              duration: '45 Menit',
              status: 'selesai',
              transcriptSnippet: 'Asisten Pemerintahan: "Kami butuh data konvergensi intervensi stunting dari dinas kesehatan per Juni ini. Ini mendesak untuk dilaporkan ke pimpinan..." Dinkes: "Draf data siap diserahkan besok siang."',
              summary: 'Rapat koordinasi membahas progres konvergensi intervensi stunting tingkat kabupaten/kota. Capaian program secara umum melampaui target nasional sebesar 3%, namun pelaporan administrasi dari dinas terkait mengalami kendala keterlambatan.',
              actionItems: [
                'Dinas Kesehatan menyerahkan data konvergensi intervensi stunting triwulan II (Deadline: Besok).',
                'Dinas PMD melakukan koordinasi posyandu desa lokus stunting prioritas (Deadline: 3 hari kerja).'
              ]
            };
            onAddMeeting(newDoc);
            setSelectedMeeting(newDoc);
            setIsProcessing(false);
          }, 600);
          return 100;
        }

        const nextProgress = prev + 10;
        const stepIdx = Math.floor(nextProgress / 25);
        if (stepIdx !== currentStepIdx && steps[stepIdx]) {
          currentStepIdx = stepIdx;
          setProcessStep(steps[stepIdx]);
        }
        return nextProgress;
      });
    }, 200);
  };

  const handlePushToTasks = (meeting: MeetingDoc) => {
    if (!meeting.actionItems) return;
    onAddTasks(meeting.actionItems);
    setPushedTasks(prev => ({ ...prev, [meeting.id]: true }));
  };

  const handlePushToDrafts = (meeting: MeetingDoc) => {
    if (!meeting.summary || !meeting.actionItems) return;
    
    const draftContent = `# NOTULEN RAPAT
## ACARA: ${meeting.title.toUpperCase()}
## TANGGAL: ${meeting.date}
## DURASI: ${meeting.duration}

---

### RINGKASAN JALANNYA RAPAT
${meeting.summary}

### RENCANA TINDAK LANJUT / ACTION ITEMS
${meeting.actionItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

---
*Draft notulen rapat diekstrak oleh Asisten Rapat E-Aspri.*`;

    onSaveDraft(`Notulen Rapat - ${meeting.title}`, draftContent);
    setPushedDrafts(prev => ({ ...prev, [meeting.id]: true }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none animate-fade-in">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 font-display">
            Asisten Rapat
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Unggah rekaman rapat dinas untuk mentranskripsi dan mengekstrak notulensi otomatis.
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3.5 font-semibold text-xs relative"
            disabled={isProcessing}
          >
            <Upload size={13} />
            Unggah Audio Rapat
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept="audio/*" 
              onChange={triggerMockRecording}
              disabled={isProcessing}
            />
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="h-9 px-3.5 font-semibold text-xs bg-red-500 hover:bg-red-650 text-white animate-pulse"
            disabled={isProcessing}
            onClick={triggerMockRecording}
          >
            <Mic size={13} />
            Simulasi Rekam Suara
          </Button>
        </div>
      </div>

      {/* 2. Processing Screen Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-6 space-y-4 shadow-2xl glass">
            <div className="flex items-center gap-3 text-red-400">
              <Sparkles className="animate-spin" size={20} />
              <p className="text-sm font-bold font-display">Pemrosesan Notulensi AI</p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Menyusun Transkripsi & Notulen</span>
                <span className="text-slate-400 font-mono">{processProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-200 shadow-sm shadow-red-500/30"
                  style={{ width: `${processProgress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium animate-pulse text-center">
              {processStep}
            </p>
          </Card>
        </div>
      )}

      {/* 3. Meetings List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-display pl-1">
          Daftar Rekaman & Transkrip Rapat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {meetings.map((meeting) => (
            <Card 
              key={meeting.id} 
              className="bg-white dark:bg-slate-900/10 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge 
                    variant={meeting.status === 'selesai' ? 'success' : 'warning'} 
                    className="px-1.5 py-0 text-[8px] font-bold"
                  >
                    {meeting.status === 'selesai' ? 'Selesai Transkrip' : 'Mengantre Transkrip'}
                  </Badge>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Waktu Rapat: {meeting.date}
                  </span>
                </div>
                <CardTitle className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {meeting.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-mono line-clamp-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-150 dark:border-slate-900">
                  {meeting.transcriptSnippet || 'Menunggu pemrosesan audio...'}
                </p>
                <div className="flex items-center justify-between pt-1 select-none">
                  <span className="text-[10px] text-slate-500 font-medium">
                    Durasi Audio: {meeting.duration}
                  </span>
                  {meeting.status === 'selesai' && (
                    <button
                      type="button"
                      onClick={() => setSelectedMeeting(meeting)}
                      className="text-[10px] font-bold text-brand hover:text-brand/85 flex items-center gap-1.5"
                    >
                      Buka Notulen Rapat
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Notulensi Detail Dialog (with Task and Draft integrations) */}
      {selectedMeeting && (
        <Dialog
          isOpen={true}
          onClose={() => setSelectedMeeting(null)}
          title="Notulensi Rapat & Rencana Tindak Lanjut"
          className="max-w-2xl"
        >
          <div className="space-y-4">
            
            {/* Header info */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-455 font-mono border-b border-slate-200 dark:border-slate-800 pb-2">
              <span>Tanggal: {selectedMeeting.date}</span>
              <span>Durasi: {selectedMeeting.duration}</span>
            </div>

            {/* Jalannya rapat summary */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Ringkasan Rapat
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                {selectedMeeting.summary}
              </p>
            </div>

            {/* Action items list */}
            {selectedMeeting.actionItems && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Rencana Tindak Lanjut (Action Items)
                </h4>
                <div className="space-y-2">
                  {selectedMeeting.actionItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-slate-300 bg-slate-950/20 p-2.5 rounded-lg border border-slate-900">
                      <span className="font-bold text-brand shrink-0">{idx + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integration Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3.5 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9.5 text-xs font-semibold"
                disabled={pushedDrafts[selectedMeeting.id]}
                onClick={() => handlePushToDrafts(selectedMeeting)}
              >
                {pushedDrafts[selectedMeeting.id] ? <Check size={13} className="text-brand" /> : <FilePlus size={13} />}
                {pushedDrafts[selectedMeeting.id] ? 'Terkirim ke Pusat Draft' : 'Simpan Draf ke Pusat Draft'}
              </Button>
              
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="h-9.5 text-xs font-semibold"
                disabled={pushedTasks[selectedMeeting.id] || !selectedMeeting.actionItems}
                onClick={() => handlePushToTasks(selectedMeeting)}
              >
                {pushedTasks[selectedMeeting.id] ? <Check size={13} className="text-slate-950" /> : <CheckSquare size={13} />}
                {pushedTasks[selectedMeeting.id] ? 'Ditambahkan ke Tugas Saya' : 'Kirim Action Items ke Tugas Saya'}
              </Button>
            </div>

          </div>
        </Dialog>
      )}

    </div>
  );
};

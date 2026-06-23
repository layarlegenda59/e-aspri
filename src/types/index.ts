export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isCommand?: boolean;
  commandType?: string;
  formValues?: Record<string, string>;
}

export interface Draft {
  id: string;
  title: string;
  category: string; // 'Sambutan' | 'Nota Dinas' | 'Surat' | 'Laporan' | etc
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'tinggi' | 'sedang' | 'rendah';
  dueDate: string;
  category: string; // 'Administrasi' | 'Rapat' | 'Koordinasi' | etc
}

export interface PustakaFile {
  id: string;
  name: string;
  category: string; // 'Personal' | 'Templates' | 'Planning' | 'Monev' | 'Meetings' | 'Proposals' | 'SOP'
  size: string;
  uploadDate: string;
  description?: string;
}

export interface MeetingDoc {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'proses' | 'selesai';
  transcriptSnippet?: string;
  summary?: string;
  actionItems?: string[];
}

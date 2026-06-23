import * as React from 'react';
import { Button } from '../components/ui/button';
import { HelpCircle } from 'lucide-react';

interface NotfoundProps {
  setActivePage: (page: string) => void;
}

export const Notfound = ({ setActivePage }: NotfoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none space-y-4.5">
      <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
        <HelpCircle size={24} />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-200 font-display">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-555 max-w-sm leading-relaxed">
          Mohon maaf, halaman yang Anda tuju tidak ditemukan atau dalam tahap konstruksi dinas.
        </p>
      </div>
      <Button 
        type="button"
        variant="primary"
        size="sm"
        onClick={() => setActivePage('dashboard')}
      >
        Kembali ke Command Center
      </Button>
    </div>
  );
};

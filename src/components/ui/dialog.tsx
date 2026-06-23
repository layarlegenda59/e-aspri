import * as React from "react"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export const Dialog = ({ isOpen, onClose, title, children, className }: DialogProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Dialog container */}
      <div 
        className={cn(
          "relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl animate-fade-in text-slate-100 z-10 glass max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h2 className="text-lg font-semibold text-slate-100 font-display">{title}</h2>
          <button 
            onClick={onClose} 
            className="rounded-md p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

import { useEffect } from 'react';

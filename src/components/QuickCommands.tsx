import * as React from 'react';
import { COMMANDS_METADATA } from '../hooks/useAIChat';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { FileText, Edit, User, MessageSquare } from 'lucide-react';

interface QuickCommandsProps {
  isOpen: boolean;
  onCloseList: () => void;
  onExecute: (command: string, values: Record<string, string>) => void;
  filterText: string;
}

export const QuickCommands = ({ isOpen, onCloseList, onExecute, filterText }: QuickCommandsProps) => {
  const [selectedCommand, setSelectedCommand] = React.useState<string | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});

  const listContainerRef = React.useRef<HTMLDivElement>(null);

  // Close command list when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (listContainerRef.current && !listContainerRef.current.contains(e.target as Node)) {
        onCloseList();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onCloseList]);

  // Filter commands based on input
  const commands = Object.keys(COMMANDS_METADATA).filter(cmd => 
    cmd.toLowerCase().startsWith(filterText.toLowerCase())
  );

  if (!isOpen && !selectedCommand) return null;

  const handleSelectCommand = (cmd: string) => {
    setSelectedCommand(cmd);
    onCloseList();
    
    // Set default empty values
    const metadata = COMMANDS_METADATA[cmd as keyof typeof COMMANDS_METADATA];
    const initialVals: Record<string, string> = {};
    metadata.fields.forEach(f => {
      initialVals[f.key] = f.type === 'select' && f.options ? f.options[0] : '';
    });
    setFormValues(initialVals);
  };

  const handleInputChange = (key: string, val: string) => {
    setFormValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommand) return;
    onExecute(selectedCommand, formValues);
    setSelectedCommand(null);
  };

  return (
    <>
      {/* 1. Popover List of Commands */}
      {isOpen && commands.length > 0 && (
        <div 
          ref={listContainerRef}
          className="absolute bottom-16 left-4 right-4 z-40 bg-slate-900 border border-slate-850 rounded-xl shadow-2xl glass p-1.5 animate-slide-up max-h-[220px] overflow-y-auto w-[calc(100%-2rem)] max-w-lg mx-auto"
        >
          <div className="px-3 py-1.5 border-b border-slate-850/60 mb-1 select-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">
              Perintah Cepat Asisten
            </span>
          </div>
          <div className="space-y-0.5">
            {commands.map((cmd) => {
              const meta = COMMANDS_METADATA[cmd as keyof typeof COMMANDS_METADATA];
              return (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleSelectCommand(cmd)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm hover:bg-brand/10 hover:text-brand font-semibold text-slate-350 transition-colors duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-brand font-mono">{cmd}</span>
                    <span className="text-slate-200">{meta.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Buka Formulir</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Dialog Form Overlay for Selected Command */}
      {selectedCommand && (
        <Dialog
          isOpen={true}
          onClose={() => setSelectedCommand(null)}
          title={`Formulir Terpandu: ${COMMANDS_METADATA[selectedCommand as keyof typeof COMMANDS_METADATA].name}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3.5">
              {COMMANDS_METADATA[selectedCommand as keyof typeof COMMANDS_METADATA].fields.map((field) => {
                const id = `field-${field.key}`;
                return (
                  <div key={field.key} className="space-y-1.5">
                    <label htmlFor={id} className="text-xs font-bold text-slate-300">
                      {field.label}
                    </label>
                    
                    {field.type === 'text' && (
                      <Input
                        id={id}
                        type="text"
                        required
                        placeholder={field.placeholder}
                        value={formValues[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <Textarea
                        id={id}
                        required
                        rows={4}
                        placeholder={field.placeholder}
                        value={formValues[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    )}

                    {field.type === 'select' && field.options && (
                      <Select
                        id={id}
                        options={field.options}
                        value={formValues[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedCommand(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Susun Dokumen
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
};

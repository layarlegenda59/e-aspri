import * as React from 'react';
import { ChatMessage } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { QuickCommands } from '../components/QuickCommands';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Send, Trash2, HelpCircle, FileText, Check, Copy } from 'lucide-react';
import { Message, Draft } from '../types';

interface ChatProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onExecuteCommand: (command: string, values: Record<string, string>) => void;
  onSaveDraft: (title: string, content: string) => void;
  pendingCommand: string | null;
  clearPendingCommand: () => void;
}

export const Chat = ({
  messages,
  isTyping,
  onSendMessage,
  onExecuteCommand,
  onSaveDraft,
  pendingCommand,
  clearPendingCommand
}: ChatProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const [showCommandsList, setShowCommandsList] = React.useState(false);
  const [commandFilter, setCommandFilter] = React.useState('');
  
  // Split-screen draft editor state
  const [activeDraft, setActiveDraft] = React.useState<{ title: string; content: string } | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle auto-triggering pending commands from dashboard
  React.useEffect(() => {
    if (pendingCommand) {
      setShowCommandsList(true);
      setCommandFilter(pendingCommand);
      clearPendingCommand();
    }
  }, [pendingCommand, clearPendingCommand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputValue(text);

    // Command menu trigger rules
    if (text.endsWith('/')) {
      setShowCommandsList(true);
      setCommandFilter('');
    } else if (showCommandsList) {
      const parts = text.split('/');
      const lastPart = parts[parts.length - 1];
      
      // If space typed after command trigger, close command list
      if (lastPart.includes(' ')) {
        setShowCommandsList(false);
      } else {
        setCommandFilter('/' + lastPart);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
    setShowCommandsList(false);
  };

  const handleCommandExecute = (command: string, values: Record<string, string>) => {
    onExecuteCommand(command, values);
    setShowCommandsList(false);
    setInputValue('');
  };

  // Callback when a user clicks "Simpan ke Draft" from message bubbles
  const handleSaveToLocalDraft = (title: string, content: string) => {
    // Open in split screen editor
    setActiveDraft({ title, content });
    
    // Save to global state
    onSaveDraft(title, content);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyDraft = () => {
    if (!activeDraft) return;
    navigator.clipboard.writeText(activeDraft.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEditedDraft = () => {
    if (!activeDraft) return;
    onSaveDraft(activeDraft.title, activeDraft.content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 h-[calc(100vh-130px)] select-none">
      
      {/* LEFT PANE: Chat Log & Input */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 overflow-hidden relative">
        
        {/* Chat log viewport */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onSaveDraft={handleSaveToLocalDraft} 
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Input & Form Control Area */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 relative">
          
          {/* Quick command lists component */}
          <QuickCommands
            isOpen={showCommandsList}
            onCloseList={() => setShowCommandsList(false)}
            onExecute={handleCommandExecute}
            filterText={commandFilter}
          />

          <div className="flex items-end gap-2.5 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-brand/40 focus-within:border-brand transition-all">
            <Textarea
              placeholder="Tulis pesan atau ketik '/' untuk memicu formulir pembuatan naskah..."
              rows={1}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="resize-none min-h-[40px] max-h-[120px] bg-transparent border-0 px-0 py-2.5 focus:ring-0 focus:ring-offset-0 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <Button
              type="button"
              variant="primary"
              size="icon"
              className="h-9.5 w-9.5 shrink-0"
              onClick={handleSend}
            >
              <Send size={15} />
            </Button>
          </div>

          <div className="flex justify-between items-center mt-2 px-1 select-none">
            <span className="text-[10px] text-slate-500 dark:text-slate-450 font-semibold flex items-center gap-1">
              <HelpCircle size={11} />
              Shift + Enter untuk baris baru
            </span>
            <button 
              type="button"
              onClick={() => {
                if (confirm('Hapus riwayat obrolan?')) {
                  localStorage.removeItem('e_aspri_chat_messages');
                  window.location.reload();
                }
              }}
              className="text-[10px] font-bold text-red-500 dark:text-red-400/80 hover:text-red-650 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={11} />
              Kosongkan Chat
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT PANE: Split screen editor (collapsible, displays when a draft is active) */}
      {activeDraft && (
        <div className="w-full md:w-[420px] xl:w-[480px] shrink-0 animate-fade-in flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900/10 border-slate-200 dark:border-slate-800">
            <CardHeader className="p-4 bg-slate-550/10 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-brand" />
                <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-slate-200">
                  Penyunting Naskah Bersama
                </CardTitle>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveDraft(null)}
                className="text-xs text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:hover:text-slate-200 font-semibold"
              >
                Tutup Panel
              </button>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider pl-0.5">
                  Judul Dokumen
                </label>
                <input
                  type="text"
                  value={activeDraft.title}
                  onChange={(e) => setActiveDraft({ ...activeDraft, title: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand focus:border-transparent transition-all"
                />
              </div>

              <div className="flex-1 flex flex-col space-y-1 min-h-[220px]">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider pl-0.5">
                  Isi Naskah (Mendukung Markdown)
                </label>
                <textarea
                  value={activeDraft.content}
                  onChange={(e) => setActiveDraft({ ...activeDraft, content: e.target.value })}
                  className="flex-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand focus:border-transparent resize-none overflow-y-auto transition-all"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800/60 select-none">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-9 text-xs font-semibold"
                  onClick={handleCopyDraft}
                >
                  {copied ? <Check size={13} className="text-brand" /> : <Copy size={13} />}
                  {copied ? 'Tersalin' : 'Salin Semua'}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="flex-1 h-9 text-xs font-semibold"
                  onClick={handleSaveEditedDraft}
                >
                  {saved ? 'Tersimpan!' : 'Simpan Draf'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};

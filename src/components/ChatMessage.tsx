import * as React from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
  onSaveDraft?: (title: string, content: string) => void;
}

export const ChatMessage = ({ message, onSaveDraft }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-sm shrink-0 self-start shadow-sm shadow-brand/5 animate-pulse-subtle">
          🤖
        </div>
      )}
      
      {/* Message Area */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name and Time Header */}
        <div className="flex items-center gap-2 mb-1 select-none">
          <span className="text-[10px] font-bold text-slate-550 dark:text-slate-450 font-display">
            {isUser ? 'Saya' : 'Bot Aspri'}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Message Bubble wrapper */}
        <div className={`px-4 py-3 rounded-2xl leading-relaxed border shadow-sm ${
          isUser 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-none border-slate-200 dark:border-slate-700/60' 
            : 'bg-white dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 rounded-tl-none border-slate-200 dark:border-slate-800/80 glass'
        }`}>
          {isUser ? (
            <p className="text-xs sm:text-sm whitespace-pre-wrap select-text leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} onSaveToDraft={onSaveDraft} />
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0 self-start shadow-sm">
          👨‍💼
        </div>
      )}
    </div>
  );
};

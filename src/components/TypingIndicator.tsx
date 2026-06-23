import * as React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 w-fit backdrop-blur-sm shadow-sm select-none animate-pulse-subtle">
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-[11px] font-semibold text-slate-400 font-display">
        Bot Aspri sedang merumuskan draf...
      </span>
    </div>
  );
};

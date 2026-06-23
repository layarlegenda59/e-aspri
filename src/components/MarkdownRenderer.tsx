import * as React from 'react';
import { Copy, Check, Save } from 'lucide-react';
import { Button } from './ui/button';

interface MarkdownRendererProps {
  content: string;
  onSaveToDraft?: (title: string, body: string) => void;
}

export const MarkdownRenderer = ({ content, onSaveToDraft }: MarkdownRendererProps) => {
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse simple markdown to JSX elements
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems: React.ReactNode[] = [];
    const elements: React.ReactNode[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 my-3 space-y-1.5 text-slate-700 dark:text-slate-300">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Code Block parsing (extracted separately for cleaner handling)
      if (trimmed.startsWith('```')) {
        flushList(idx);
        return; // skip block tags in line-by-line list
      }

      // Headings
      if (trimmed.startsWith('# ')) {
        flushList(idx);
        elements.push(
          <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-6 mb-3 font-display border-b border-slate-200 dark:border-slate-800 pb-2">
            {parseInlineStyles(trimmed.substring(2))}
          </h2>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList(idx);
        elements.push(
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 font-display">
            {parseInlineStyles(trimmed.substring(3))}
          </h3>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList(idx);
        elements.push(
          <h4 key={idx} className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1 font-display">
            {parseInlineStyles(trimmed.substring(4))}
          </h4>
        );
      } 
      // Blockquotes
      else if (trimmed.startsWith('> ')) {
        flushList(idx);
        elements.push(
          <blockquote key={idx} className="border-l-4 border-brand bg-slate-100/50 dark:bg-slate-900/50 px-4 py-3 rounded-r-lg my-3 text-slate-600 dark:text-slate-350 italic text-sm">
            {parseInlineStyles(trimmed.substring(2))}
          </blockquote>
        );
      } 
      // Horizontal Rule
      else if (trimmed === '---') {
        flushList(idx);
        elements.push(<hr key={idx} className="my-5 border-slate-200 dark:border-slate-800" />);
      } 
      // Unordered Lists
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        inList = true;
        listItems.push(
          <li key={idx} className="text-xs sm:text-sm">
            {parseInlineStyles(trimmed.substring(2))}
          </li>
        );
      } 
      // Numbered Lists
      else if (/^\d+\.\s/.test(trimmed)) {
        flushList(idx);
        const contentStr = trimmed.replace(/^\d+\.\s/, '');
        elements.push(
          <div key={idx} className="flex gap-2.5 my-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold text-brand">{trimmed.match(/^\d+/)![0]}.</span>
            <span>{parseInlineStyles(contentStr)}</span>
          </div>
        );
      }
      // Empty line
      else if (trimmed === '') {
        flushList(idx);
      } 
      // Regular Paragraphs
      else {
        if (inList) {
          flushList(idx);
        }
        elements.push(
          <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 my-2.5">
            {parseInlineStyles(trimmed)}
          </p>
        );
      }
    });

    flushList(lines.length);
    return elements;
  };

  // Helper to parse bold, code snippets, and italic formatting in strings
  const parseInlineStyles = (text: string): React.ReactNode[] => {
    // Very basic replacement for bold (**text**) and code (`code`)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-brand border border-slate-200 dark:border-slate-800 text-[11px] font-semibold">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Detect and extract naskah codeblock for copy/save actions
  const codeBlockMatch = content.match(/```markdown\r?\n([\s\S]*?)\r?\n```/) || content.match(/```[\s\S]*?\r?\n([\s\S]*?)\r?\n```/);
  const documentDraft = codeBlockMatch ? codeBlockMatch[1] : '';

  // Get a readable title for saving
  const getDocTitle = () => {
    const firstHeader = content.split('\n').find(l => l.trim().startsWith('# '));
    return firstHeader ? firstHeader.replace('# ', '').trim() : 'Draf Dokumen E-Aspri';
  };

  return (
    <div className="space-y-4">
      {/* Render parsed markdown text */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-300">
        {parseMarkdown(content.replace(/```markdown[\s\S]*?```/g, '').replace(/```[\s\S]*?```/g, ''))}
      </div>

      {/* Draft Document CodeBlock Card with Actions */}
      {documentDraft && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-inner overflow-hidden mt-4">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider font-mono">
              DRAF NASKAH DOKUMEN
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px]"
                onClick={() => handleCopy(documentDraft)}
              >
                {copied ? <Check size={12} className="text-brand" /> : <Copy size={12} />}
                {copied ? 'Tersalin' : 'Salin Naskah'}
              </Button>
              {onSaveToDraft && (
                <Button
                  variant="primary"
                  size="sm"
                  className="h-8 text-[11px]"
                  disabled={saved}
                  onClick={() => {
                    onSaveToDraft(getDocTitle(), documentDraft);
                    setSaved(true);
                    setTimeout(() => setSaved(false), 3000);
                  }}
                >
                  <Save size={12} />
                  {saved ? 'Tersimpan' : 'Simpan ke Draft'}
                </Button>
              )}
            </div>
          </div>
          <div className="p-4 overflow-x-auto text-xs font-mono text-slate-800 dark:text-slate-300 leading-relaxed max-h-[300px] whitespace-pre-wrap select-text">
            {documentDraft}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  // Basic syntax coloring highlighting logic using token regular expressions
  const highlightCode = (rawCode: string, lang: string): React.ReactNode[] => {
    const lines = rawCode.split('\n');

    return lines.map((line, lineIdx) => {
      // Tokenize the line
      const tokens: React.ReactNode[] = [];
      let remainder = line;
      let key = 0;

      // Check comments first
      if (remainder.trim().startsWith('//') || remainder.trim().startsWith('--') || remainder.trim().startsWith('#')) {
        return (
          <div key={lineIdx} className="table-row">
            {showLineNumbers && (
              <span className="table-cell pr-4 text-right text-slate-500 select-none text-xs font-mono opacity-60">
                {lineIdx + 1}
              </span>
            )}
            <span className="table-cell font-mono text-emerald-500 dark:text-emerald-400 italic">
              {line}
            </span>
          </div>
        );
      }

      // Regex tokenization for keywords, strings, numbers, types, functions
      const tokenRegex = /(\/\*[\s\S]*?\*\/|\/\/.*|--.*|#.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|for|while|class|interface|type|import|from|export|default|async|await|new|this|typeof|instanceof|SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|GROUP|BY|HAVING|ORDER|LIMIT|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|def|def|print|True|False|None)\b|\b\d+(?:\.\d+)?\b|\b[A-Z][a-zA-Z0-9_]*\b|\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()|[{}()[\].,;:+\-*/%=<>!&|^~?]+|[^\s{}()[\].,;:+\-*/%=<>!&|^~?]+|\s+)/g;

      let match: RegExpExecArray | null;
      let lastIndex = 0;

      while ((match = tokenRegex.exec(line)) !== null) {
        const text = match[0];
        const matchIdx = match.index;

        if (matchIdx > lastIndex) {
          tokens.push(<span key={key++}>{line.substring(lastIndex, matchIdx)}</span>);
        }

        // Categorize token
        if (/^(\/\*|\/\/|--|#)/.test(text)) {
          tokens.push(<span key={key++} className="text-emerald-600 dark:text-emerald-400 italic">{text}</span>);
        } else if (/^["'`]/.test(text)) {
          tokens.push(<span key={key++} className="text-amber-600 dark:text-amber-300">{text}</span>);
        } else if (/^\b(?:const|let|var|function|return|if|else|for|while|class|interface|type|import|from|export|default|async|await|new|this|typeof|instanceof|SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|GROUP|BY|HAVING|ORDER|LIMIT|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|def|print|True|False|None)\b/.test(text)) {
          tokens.push(<span key={key++} className="text-purple-600 dark:text-purple-400 font-semibold">{text}</span>);
        } else if (/^\b\d+(?:\.\d+)?\b$/.test(text)) {
          tokens.push(<span key={key++} className="text-cyan-600 dark:text-cyan-300 font-mono">{text}</span>);
        } else if (/^\b[A-Z][a-zA-Z0-9_]*\b$/.test(text)) {
          tokens.push(<span key={key++} className="text-blue-600 dark:text-blue-300 font-medium">{text}</span>);
        } else if (/^[{}()[\].,;:+\-*/%=<>!&|^~?]+$/.test(text)) {
          tokens.push(<span key={key++} className="text-slate-500 dark:text-slate-400">{text}</span>);
        } else {
          tokens.push(<span key={key++} className="text-slate-800 dark:text-slate-200">{text}</span>);
        }

        lastIndex = matchIdx + text.length;
      }

      if (lastIndex < line.length) {
        tokens.push(<span key={key++}>{line.substring(lastIndex)}</span>);
      }

      return (
        <div key={lineIdx} className="table-row hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
          {showLineNumbers && (
            <span className="table-cell pr-4 text-right text-slate-400 dark:text-slate-600 select-none text-xs font-mono opacity-80">
              {lineIdx + 1}
            </span>
          )}
          <span className="table-cell font-mono text-xs sm:text-sm whitespace-pre">
            {tokens.length > 0 ? tokens : ' '}
          </span>
        </div>
      );
    });
  };

  const cleanLang = language.toLowerCase().replace(/^(language-|lang-)/, '');

  return (
    <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 shadow-sm overflow-hidden text-left">
      {/* Code Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 dark:bg-slate-950/80 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-mono font-medium text-slate-300">
            {title || cleanLang || 'code'}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400 border border-slate-600/40">
            {cleanLang}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all active:scale-95 cursor-pointer"
          title="Salin kode"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed bg-slate-950 font-mono">
        <div className="table w-full">
          {highlightCode(code, cleanLang)}
        </div>
      </div>
    </div>
  );
};

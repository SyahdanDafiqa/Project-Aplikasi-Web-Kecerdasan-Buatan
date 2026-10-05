import React from 'react';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split content by code blocks: ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-slate-800 dark:text-slate-200">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Extract language and code
          const firstLineEnd = part.indexOf('\n');
          let language = 'typescript';
          let code = '';

          if (firstLineEnd !== -1) {
            language = part.slice(3, firstLineEnd).trim() || 'typescript';
            code = part.slice(firstLineEnd + 1, -3);
          } else {
            code = part.slice(3, -3);
          }

          return (
            <CodeBlock
              key={index}
              code={code.trim()}
              language={language}
            />
          );
        }

        // Render formatted markdown text paragraphs, lists, and headings
        return (
          <div key={index} className="space-y-2">
            {part.split('\n\n').map((paragraph, pIdx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Check for Headings
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={pIdx} className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1">
                    {parseInline(trimmed.replace('#### ', ''))}
                  </h4>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-indigo-500 inline-block"></span>
                    {parseInline(trimmed.replace('### ', ''))}
                  </h3>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={pIdx} className="text-xl font-extrabold text-slate-900 dark:text-white mt-5 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                    {parseInline(trimmed.replace('## ', ''))}
                  </h2>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={pIdx} className="text-2xl font-black text-slate-900 dark:text-white mt-6 mb-3">
                    {parseInline(trimmed.replace('# ', ''))}
                  </h1>
                );
              }

              // Check for Blockquote
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={pIdx}
                    className="border-l-4 border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 p-3 rounded-r-lg text-sm text-indigo-950 dark:text-indigo-200 italic my-2"
                  >
                    {parseInline(trimmed.replace(/^>\s*/gm, ''))}
                  </blockquote>
                );
              }

              // Check for unordered lists (- or *)
              if (trimmed.split('\n').every(line => /^[-*]\s+/.test(line.trim()))) {
                const items = trimmed.split('\n').map(line => line.trim().replace(/^[-*]\s+/, ''));
                return (
                  <ul key={pIdx} className="space-y-1.5 my-2 pl-4 list-disc marker:text-indigo-500 text-sm sm:text-base">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} className="pl-1">
                        {parseInline(item)}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Check for numbered lists (1. 2. 3.)
              if (trimmed.split('\n').every(line => /^\d+\.\s+/.test(line.trim()))) {
                const items = trimmed.split('\n').map(line => line.trim().replace(/^\d+\.\s+/, ''));
                return (
                  <ol key={pIdx} className="space-y-1.5 my-2 pl-4 list-decimal marker:text-indigo-500 marker:font-semibold text-sm sm:text-base">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} className="pl-1">
                        {parseInline(item)}
                      </li>
                    ))}
                  </ol>
                );
              }

              // Regular paragraph with potential single newlines
              const lines = trimmed.split('\n');
              return (
                <p key={pIdx} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lines.map((line, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {parseInline(line)}
                      {lIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to parse bold, italic, and inline code `code`
function parseInline(text: string): React.ReactNode[] {
  // Regex token for **bold**, *italic*, `inline code`
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const tokens = text.split(regex);

  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith('*') && tok.endsWith('*')) {
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-200">
          {tok.slice(1, -1)}
        </em>
      );
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs sm:text-sm border border-slate-200 dark:border-slate-700/60"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{tok}</span>;
  });
}

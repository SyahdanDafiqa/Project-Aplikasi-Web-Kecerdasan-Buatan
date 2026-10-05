import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  Code,
  Copy,
  Check,
  RotateCcw,
  X,
  FileCode,
  User,
  GraduationCap,
  Info,
  Maximize2,
  Minimize2,
  Flame
} from 'lucide-react';
import { ChatMessage } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { sendChatMessageStream } from '../services/geminiService';

interface ChatTutorProps {
  currentTopicContext?: string;
  onClearContext?: () => void;
  initialCodeSnippet?: string;
}

const DEFAULT_PROMPTS = [
  {
    title: 'Apa itu Machine Learning?',
    query: 'Tolong jelaskan apa itu Machine Learning secara sederhana untuk pemula, apa bedanya dengan pemrograman biasa, dan contoh jenisnya.',
  },
  {
    title: 'Analisis Big-O',
    query: 'Bagaimana cara menganalisis kompleksitas waktu dan ruang (Big-O) pada algoritma rekursif?',
  },
  {
    title: '3-Way Handshake TCP',
    query: 'Tolong jelaskan langkah demi langkah proses TCP 3-Way Handshake beserta fungsinya.',
  },
  {
    title: 'JOIN vs Subquery',
    query: 'Kapan kita sebaiknya menggunakan SQL JOIN dibandingkan Subquery untuk optimasi performa?',
  },
  {
    title: 'Event Loop JavaScript',
    query: 'Jelaskan perbedaan antrean Microtask vs Macrotask pada Event Loop JavaScript.',
  },
];

export const ChatTutor: React.FC<ChatTutorProps> = ({
  currentTopicContext,
  onClearContext,
  initialCodeSnippet,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Halo! Saya **Dosen & AI Tutor InformatikaLab** 🎓.

Saya siap mendampingi proses belajar mandiri Anda seputar:
- **Pemrograman Web** (HTML/CSS, JS/TS, React, Node.js, REST API, Web Security)
- **Struktur Data & Algoritma** (Big-O, Tree, Graph, Sorting, Dynamic Programming)
- **Basis Data** (SQL Lanjutan, Normalisasi 1NF-3NF, ACID, Indexing)
- **Jaringan Komputer** (OSI 7 Layer, TCP/IP, Subnetting, DNS, HTTP/HTTPS)
- **Kecerdasan Buatan (AI)** (Machine Learning, ANN, Backpropagation, LLM)

Silakan ketik pertanyaan Anda atau pilih topik di bawah untuk memulai!`,
        timestamp: Date.now(),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [codeSnippet, setCodeSnippet] = useState(initialCodeSnippet || '');
  const [showCodeInput, setShowCodeInput] = useState(Boolean(initialCodeSnippet));
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputPrompt]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isStreaming) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: textToSend + (codeSnippet.trim() ? `\n\n\`\`\`\n${codeSnippet.trim()}\n\`\`\`` : ''),
      timestamp: Date.now(),
      topicContext: currentTopicContext,
    };

    const newAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, newUserMessage, newAssistantMessage]);
    setInputPrompt('');
    setCodeSnippet('');
    setShowCodeInput(false);
    setIsStreaming(true);

    const apiMessages = [...messages, newUserMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await sendChatMessageStream({
      messages: apiMessages,
      topicContext: currentTopicContext,
      codeSnippet: codeSnippet.trim() || undefined,
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      },
      onError: (errMsg) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    `⚠️ Terjadi kendala: ${errMsg}\n\n*Catatan: Pastikan GEMINI_API_KEY telah diatur di panel Secrets atau berkas .env.*`,
                  isStreaming: false,
                }
              : msg
          )
        );
        setIsStreaming(false);
      },
      onFinish: () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
          )
        );
        setIsStreaming(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Bersihkan riwayat percakapan dengan AI Tutor?')) {
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'assistant',
          content: 'Riwayat obrolan telah dibersihkan. Apa yang ingin Anda diskusikan sekarang? 😊',
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] min-h-[550px] max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <header className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Dosen & Tutor IT Cerdas
              </h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Siap memandu konsep algoritma, debug kode, dan materi kuliah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Bersihkan riwayat percakapan"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </header>

      {/* Topic Context Indicator */}
      {currentTopicContext && (
        <div className="px-5 py-2 bg-indigo-50 dark:bg-indigo-950/50 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs text-indigo-950 dark:text-indigo-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">
              Sedang membahas modul: <strong>{currentTopicContext}</strong>
            </span>
          </div>
          {onClearContext && (
            <button
              onClick={onClearContext}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 shrink-0 ml-2"
            >
              <X className="w-3 h-3" />
              <span>Hapus Konteks</span>
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/70">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                    : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/10'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[90%] sm:max-w-[82%] text-xs sm:text-sm leading-relaxed transition-all ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-3.5 sm:p-4 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-sm'
                }`}
              >
                {/* Header inside bubble */}
                <div
                  className={`flex items-center justify-between gap-3 mb-2 pb-1.5 border-b text-[11px] ${
                    isUser
                      ? 'border-indigo-500/40 text-indigo-100 font-medium'
                      : 'border-slate-100 dark:border-slate-800/80 text-indigo-600 dark:text-indigo-400 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isUser ? (
                      <span>Mahasiswa</span>
                    ) : (
                      <>
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Dosen & Tutor Informatika</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className={`p-1 rounded transition-colors ${
                        isUser
                          ? 'text-indigo-200 hover:text-white hover:bg-indigo-700/50'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Salin jawaban"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                {isUser ? (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                ) : (
                  <div>
                    {message.content ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 py-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-xs font-mono">Dosen sedang menyusun penjelasan...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Saran Topik Diskusi Cepat:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DEFAULT_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-all shadow-2xs cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Code Snippet Input Area (Collapsible) */}
      {showCodeInput && (
        <div className="px-4 py-3 bg-slate-100/80 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-mono flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-500" />
              <span>Cuplikan Kode yang Ingin Ditanyakan / Di-debug:</span>
            </span>
            <button
              onClick={() => setShowCodeInput(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Tempelkan kode program Anda di sini (misal: kode Python, C++, SQL, atau TypeScript yang error)..."
            rows={4}
            className="w-full p-2.5 rounded-xl font-mono text-xs bg-slate-900 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Chat Input Bar */}
      <footer className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-2 border border-slate-200 dark:border-slate-700/60 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <button
            onClick={() => setShowCodeInput(!showCodeInput)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              showCodeInput || codeSnippet
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Sisipkan cuplikan kode"
          >
            <Code className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan konsep, algoritma, atau minta review kode (Shift+Enter untuk baris baru)..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent border-0 focus:outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 py-1.5 resize-none max-h-40"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={(!inputPrompt.trim() && !codeSnippet.trim()) || isStreaming}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer shrink-0"
            title="Kirim pertanyaan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
          <span>AI Tutor beroperasi dengan persona Dosen Informatika &amp; Google Gemini</span>
          <span className="hidden sm:inline font-mono">Enter ↵ kirim • Shift+Enter baris baru</span>
        </div>
      </footer>
    </div>
  );
};

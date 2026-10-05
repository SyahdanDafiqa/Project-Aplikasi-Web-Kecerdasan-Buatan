import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare,
  Share2,
  Sparkles,
  ChevronRight,
  Award,
  BookOpen,
  Check,
  AlertCircle
} from 'lucide-react';
import { CourseModule } from '../types';
import { CodeBlock } from './CodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ModuleDetailProps {
  module: CourseModule;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleComplete: (moduleId: string) => void;
  onToggleBookmark: (moduleId: string) => void;
  onBack: () => void;
  onOpenChatWithTopic: (topic: string, codeSnippet?: string) => void;
  onNavigateModule?: (moduleId: string) => void;
  allModules: CourseModule[];
}

export const ModuleDetail: React.FC<ModuleDetailProps> = ({
  module,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  onBack,
  onOpenChatWithTopic,
  onNavigateModule,
  allModules,
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Track scroll position for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find next and previous modules in the same or overall list
  const currentIndex = allModules.findIndex((m) => m.id === module.id);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in duration-300">
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-30">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Materi</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Salin tautan materi"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleBookmark(module.id)}
            className="p-2 rounded-lg text-slate-500 hover:text-amber-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isBookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Module Header Card */}
      <header className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
            {module.categoryName}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Tingkat: {module.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimasi {module.estimatedMinutes} menit</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {module.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {module.summary}
        </p>

        {/* Prerequisites */}
        {module.prerequisites && module.prerequisites.length > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <span className="font-semibold">Prasyarat Rekomendasi: </span>
              {module.prerequisites.join(', ')}
            </div>
          </div>
        )}

        {/* Action bar: Mark Complete & Ask AI Tutor */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleComplete(module.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950' : ''}`} />
            <span>{isCompleted ? 'Sudah Selesai Dipelajari' : 'Tandai Selesai'}</span>
          </button>

          <button
            onClick={() => onOpenChatWithTopic(module.title)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-indigo-600 transition-all cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tanya AI Tutor tentang Materi Ini</span>
          </button>
        </div>
      </header>

      {/* Sections Content */}
      <main className="space-y-8">
        {module.sections.map((section, sIdx) => (
          <section
            key={section.id || sIdx}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>{section.title}</span>
            </h2>

            {/* Markdown Main Content */}
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownRenderer content={section.content} />
            </div>

            {/* Key Takeaways */}
            {section.keyPoints && section.keyPoints.length > 0 && (
              <div className="rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <Award className="w-4 h-4" />
                  <span>Poin Kunci yang Wajib Dipahami</span>
                </div>
                <ul className="space-y-1.5 pl-5 list-disc marker:text-indigo-500 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200">
                  {section.keyPoints.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Code Snippets */}
            {section.codeSnippets && section.codeSnippets.length > 0 && (
              <div className="space-y-4 pt-2">
                {section.codeSnippets.map((snippet, cIdx) => (
                  <div key={cIdx} className="space-y-2">
                    <CodeBlock
                      code={snippet.code}
                      language={snippet.language}
                      title={snippet.title}
                    />
                    {snippet.explanation && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic pl-1">
                        💡 <strong>Catatan:</strong> {snippet.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Interactive Quiz Section */}
      {module.quiz && module.quiz.length > 0 && (
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Kuis Uji Pemahaman ({module.quiz.length} Soal)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Jawab pertanyaan berikut untuk mengevaluasi pemahaman konsep Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {module.quiz.map((q, qIdx) => {
              const selectedIdx = selectedAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = selectedIdx === q.correctAnswerIndex;

              return (
                <div key={q.id} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    {qIdx + 1}. {q.question}
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;
                      let optionClasses = 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                      if (showQuizResults) {
                        if (optIdx === q.correctAnswerIndex) {
                          optionClasses = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isOptionSelected) {
                          optionClasses = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200';
                        }
                      } else if (isOptionSelected) {
                        optionClasses = 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerSelect(q.id, optIdx)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {showQuizResults && optIdx === q.correctAnswerIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm leading-relaxed">
                      <span className={`font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isCorrect ? '✓ Jawaban Tepat!' : '✗ Kurang Tepat.'}
                      </span>{' '}
                      <span className="text-slate-600 dark:text-slate-300">
                        {q.explanation}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            {!showQuizResults ? (
              <button
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Periksa Jawaban Saya
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setShowQuizResults(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition-all cursor-pointer"
              >
                Ulangi Kuis
              </button>
            )}

            <button
              onClick={() => onOpenChatWithTopic(module.title, `Saya ingin membahas soal kuis pada materi ${module.title}`)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Diskusi Soal dengan AI Tutor</span>
            </button>
          </div>
        </section>
      )}

      {/* Navigation to Next / Previous Modules */}
      <footer className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {prevModule ? (
          <button
            onClick={() => onNavigateModule?.(prevModule.id)}
            className="flex flex-col items-start p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 transition-all text-left cursor-pointer group"
          >
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span>Materi Sebelumnya</span>
            </span>
            <span className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 mt-1">
              {prevModule.title}
            </span>
          </button>
        ) : <div />}

        {nextModule && (
          <button
            onClick={() => onNavigateModule?.(nextModule.id)}
            className="flex flex-col items-end p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 transition-all text-right cursor-pointer group"
          >
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <span>Materi Selanjutnya</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 mt-1">
              {nextModule.title}
            </span>
          </button>
        )}
      </footer>
    </div>
  );
};

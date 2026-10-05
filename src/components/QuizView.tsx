import React, { useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { CourseModule, QuizQuestion } from '../types';

interface QuizViewProps {
  modules: CourseModule[];
  onOpenChatWithTopic: (topic: string) => void;
}

interface FlattenedQuiz {
  moduleTitle: string;
  categoryName: string;
  question: QuizQuestion;
}

export const QuizView: React.FC<QuizViewProps> = ({ modules, onOpenChatWithTopic }) => {
  // Collect all questions from all modules
  const allQuizzes: FlattenedQuiz[] = [];
  modules.forEach((mod) => {
    mod.quiz.forEach((q) => {
      allQuizzes.push({
        moduleTitle: mod.title,
        categoryName: mod.categoryName,
        question: q,
      });
    });
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = allQuizzes[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // Prevent changing after answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < allQuizzes.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsFinished(false);
  };

  // Calculate score
  let correctCount = 0;
  Object.entries(selectedAnswers).forEach(([idxStr, ansIdx]) => {
    const idx = Number(idxStr);
    if (allQuizzes[idx]?.question.correctAnswerIndex === ansIdx) {
      correctCount++;
    }
  });

  const totalQuestions = allQuizzes.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Evaluasi Pemahaman Selesai!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Berikut adalah rekap hasil kuis konsep Teknik Informatika Anda.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
            {scorePercent}%
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {correctCount} dari {totalQuestions} Soal Terjawab Benar
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {scorePercent >= 80
              ? 'Luar biasa! Pemahaman konsep dasar Anda sangat solid di berbagai mata kuliah.'
              : scorePercent >= 60
              ? 'Bagus! Namun ada beberapa materi yang dapat diperdalam kembali bersama AI Tutor.'
              : 'Teruslah berlatih! Buka kembali modul materi dan tanyakan konsep yang sulit kepada AI Tutor.'}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Kuis</span>
          </button>

          <button
            onClick={() => onOpenChatWithTopic('Pembahasan Soal Kuis')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tanya Pembahasan ke AI Tutor</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="text-center py-20 text-slate-500">
        Belum ada soal kuis yang tersedia.
      </div>
    );
  }

  const selectedAnswer = selectedAnswers[currentIdx];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === currentItem.question.correctAnswerIndex;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Quiz Header & Progress */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
            {currentItem.categoryName}
          </span>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Modul: {currentItem.moduleTitle}
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">
            Soal {currentIdx + 1} dari {totalQuestions}
          </span>
          <div className="w-28 sm:w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-200"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
          {currentItem.question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentItem.question.options.map((option, optIdx) => {
            const isChosen = selectedAnswer === optIdx;
            const isCorrectOption = optIdx === currentItem.question.correctAnswerIndex;

            let optionStyle =
              'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200';

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle =
                  'bg-emerald-100/80 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
              } else if (isChosen) {
                optionStyle =
                  'bg-rose-100/80 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isAnswered && isChosen && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <span>Penjelasan Akademis:</span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
              {currentItem.question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          ← Soal Sebelumnya
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <span>{currentIdx === totalQuestions - 1 ? 'Lihat Hasil Akhir' : 'Lanjut ke Soal Berikutnya'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

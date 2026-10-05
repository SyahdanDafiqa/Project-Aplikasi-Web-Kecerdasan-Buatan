import React from 'react';
import {
  Award,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  ArrowRight,
  RotateCcw,
  Target
} from 'lucide-react';
import { CATEGORIES } from '../data/modulesData';
import { CourseModule, UserProgress } from '../types';

interface ProgressDashboardProps {
  modules: CourseModule[];
  progress: UserProgress;
  onSelectModule: (module: CourseModule) => void;
  onResetProgress: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  modules,
  progress,
  onSelectModule,
  onResetProgress,
}) => {
  const totalModules = modules.length;
  const completedCount = progress.completedModuleIds.length;
  const completionPercent = Math.round((completedCount / (totalModules || 1)) * 100);

  const bookmarkedModules = modules.filter((m) =>
    progress.bookmarkedModuleIds.includes(m.id)
  );

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8 animate-in fade-in duration-200">
      {/* Overview Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {completedCount} / {totalModules}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Modul Terselesaikan</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {completionPercent}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Target Kurikulum</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {bookmarkedModules.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Materi Ditandai (Saved)</div>
          </div>
        </div>
      </section>

      {/* Progress Breakdown by Subject */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span>Progress Berdasarkan 5 Pilar Bidang Studi</span>
        </h3>

        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const catModules = modules.filter((m) => m.categoryId === cat.id);
            const catCompleted = catModules.filter((m) =>
              progress.completedModuleIds.includes(m.id)
            ).length;
            const percent = Math.round((catCompleted / (catModules.length || 1)) * 100);

            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    {catCompleted} / {catModules.length} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bookmarked Modules */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-500" />
          <span>Materi yang Disimpan untuk Dibaca Ulang ({bookmarkedModules.length})</span>
        </h3>

        {bookmarkedModules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedModules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod)}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer bg-slate-50/60 dark:bg-slate-800/60 flex items-center justify-between group"
              >
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {mod.categoryName}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {mod.title}
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all shrink-0 ml-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs sm:text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            Belum ada modul yang di-bookmark. Klik ikon bookmark pada materi untuk menyimpannya di sini.
          </div>
        )}
      </section>

      {/* Reset Progress Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onResetProgress}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Riwayat Belajar & Bookmark</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Code2,
  Filter,
  Layers,
  Search,
  Sparkles,
  ArrowRight,
  BookOpen,
  Database,
  Binary,
  Network,
  Cpu,
  Globe
} from 'lucide-react';
import { CATEGORIES } from '../data/modulesData';
import { CategoryId, CourseModule, DifficultyLevel } from '../types';

interface ModuleListProps {
  modules: CourseModule[];
  completedIds: string[];
  bookmarkedIds: string[];
  onSelectModule: (module: CourseModule) => void;
  onToggleBookmark: (moduleId: string) => void;
  onOpenChatWithTopic: (topic: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  completedIds,
  bookmarkedIds,
  onSelectModule,
  onToggleBookmark,
  onOpenChatWithTopic,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // Filter modules
  const filteredModules = modules.filter((m) => {
    // Category filter
    if (selectedCategory !== 'all' && m.categoryId !== selectedCategory) return false;

    // Difficulty filter
    if (selectedDifficulty !== 'all' && m.difficulty !== selectedDifficulty) return false;

    // Bookmark filter
    if (showOnlyBookmarks && !bookmarkedIds.includes(m.id)) return false;

    // Search query filter (title, summary, tags, categoryName)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchSummary = m.summary.toLowerCase().includes(q);
      const matchCategory = m.categoryName.toLowerCase().includes(q);
      const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchCategory && !matchTags) return false;
    }

    return true;
  });

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'web-dev':
        return <Globe className="w-4 h-4" />;
      case 'dsa':
        return <Binary className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'network':
        return <Network className="w-4 h-4" />;
      case 'ai':
        return <Cpu className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyBadge = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'Dasar':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Dasar
          </span>
        );
      case 'Menengah':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Menengah
          </span>
        );
      case 'Lanjutan':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Lanjutan
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            <span>Kurikulum Standar Sarjana Teknik Informatika</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Kuasai Konsep Inti Informatika & Algoritma Bersama AI
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Modul pembelajaran mandiri interaktif mencakup 5 bidang kunci: Pemrograman Web, Struktur Data, Basis Data, Jaringan, dan Kecerdasan Buatan. Disertai AI Tutor cerdas bertenaga Google Gemini.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400">Total Modul</div>
              <div className="text-xl sm:text-2xl font-black text-white">{modules.length} Materi</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400">Bidang Ilmu</div>
              <div className="text-xl sm:text-2xl font-black text-cyan-400">5 Pilar</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400">Progres Anda</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {Math.round((completedIds.length / (modules.length || 1)) * 100)}%
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="text-xs text-slate-400">AI Assistant</div>
              <div className="text-xl sm:text-2xl font-black text-indigo-300 flex items-center gap-1">
                Gemini 3.8
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Filters */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Semua Kategori ({modules.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = modules.filter((m) => m.categoryId === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Difficulty & Bookmark toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="px-2 text-slate-400 font-medium">Tingkat:</span>
              {(['all', 'Dasar', 'Menengah', 'Lanjutan'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedDifficulty === level
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {level === 'all' ? 'Semua' : level}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                showOnlyBookmarks
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>Tersimpan ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Active Filter Notice */}
        {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || showOnlyBookmarks || searchQuery) && (
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900/50">
            <span>
              Menampilkan <strong>{filteredModules.length}</strong> modul materi kuliah
            </span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setShowOnlyBookmarks(false);
                onSearchChange('');
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </section>

      {/* Module Grid */}
      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const isCompleted = completedIds.includes(module.id);
            const isBookmarked = bookmarkedIds.includes(module.id);

            return (
              <div
                key={module.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 overflow-hidden"
              >
                {/* Top status bar */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {getCategoryIcon(module.categoryId)}
                        {module.categoryName}
                      </span>
                      {getDifficultyBadge(module.difficulty)}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(module.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={isBookmarked ? 'Hapus bookmark' : 'Simpan materi'}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
                        />
                      </button>

                      {isCompleted && (
                        <div title="Selesai dipelajari">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3
                    onClick={() => onSelectModule(module)}
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {module.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {module.summary}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {module.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                    {module.tags.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{module.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{module.estimatedMinutes} menit baca</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChatWithTopic(module.title);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-medium transition-colors"
                      title="Tanya AI Tutor tentang modul ini"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Tanya AI</span>
                    </button>

                    <button
                      onClick={() => onSelectModule(module)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors cursor-pointer"
                    >
                      <span>Pelajari</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Tidak ada materi yang sesuai
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter kategori dan tingkat kesulitan.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setShowOnlyBookmarks(false);
              onSearchChange('');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Tampilkan Semua Materi
          </button>
        </div>
      )}
    </div>
  );
};

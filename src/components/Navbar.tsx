import React, { useState } from 'react';
import {
  BookOpen,
  Bot,
  BrainCircuit,
  GraduationCap,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
  Bookmark,
  Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'modules' | 'chat' | 'quiz' | 'stats';
  onTabChange: (tab: 'modules' | 'chat' | 'quiz' | 'stats') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  completedCount: number;
  bookmarkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  completedCount,
  bookmarkCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'modules' | 'chat' | 'quiz' | 'stats') => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('modules')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                  Informatika<span className="text-indigo-600 dark:text-indigo-400">Lab</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                  AI v3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Media Belajar & AI Tutor Mahasiswa IT
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari materi, algoritma, SQL, OSI layer..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'modules') onTabChange('modules');
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('modules')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'modules'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Modul Materi</span>
              {completedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {completedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('chat')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'chat'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>AI Tutor Chat</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </button>

            <button
              onClick={() => handleNavClick('quiz')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-amber-500" />
              <span>Kuis Evaluasi</span>
            </button>

            <button
              onClick={() => handleNavClick('stats')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Progress</span>
              {bookmarkCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                  {bookmarkCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action buttons: Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari materi kuliah IT..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'modules') onTabChange('modules');
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('modules')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'modules'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" />
              <span>Modul Materi Kuliah</span>
            </div>
            {completedCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {completedCount} Selesai
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('chat')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'chat'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>AI Chatbot Tutor (Gemini)</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <Sparkles className="w-3 h-3" /> Aktif
            </span>
          </button>

          <button
            onClick={() => handleNavClick('quiz')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'quiz'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BrainCircuit className="w-4 h-4 text-amber-500" />
              <span>Kuis Pemahaman & Latihan</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('stats')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'stats'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Progres Belajar & Bookmark</span>
            </div>
            {bookmarkCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                {bookmarkCount} Disimpan
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { GraduationCap, Heart, Github, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectCategory?: (catId: string) => void;
  onOpenChat?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenChat }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">
              Informatika<span className="text-indigo-600 dark:text-indigo-400">Lab</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Portal pembelajaran mandiri interaktif untuk mahasiswa Teknik Informatika. Membantu memperkuat pemahaman konsep pemrograman, algoritma, basis data, jaringan, dan AI.
          </p>

          <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              React + Vite + Tailwind CSS
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
              <Sparkles className="w-3 h-3" /> Gemini AI 3.8
            </span>
          </div>
        </div>

        {/* 5 Pilar Kurikulum */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            5 Pilar Materi
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Pemrograman Web Modern</li>
            <li>Struktur Data &amp; Algoritma</li>
            <li>Basis Data Relasional &amp; SQL</li>
            <li>Jaringan Komputer &amp; Protokol</li>
            <li>Kecerdasan Buatan &amp; LLM</li>
          </ul>
        </div>

        {/* AI Tutor & Resources */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Fitur Unggulan
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>AI Chatbot Tutor Berbasis Gemini</li>
            <li>Pencarian &amp; Filter Kategori Instan</li>
            <li>Syntax Highlighting &amp; Copy Code</li>
            <li>Kuis Evaluasi Pemahaman Mandiri</li>
            <li>Mode Gelap &amp; Terang Responsif</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>© 2026 InformatikaLab. Didedikasikan untuk kemajuan mahasiswa Teknik Informatika Indonesia.</p>
        <p className="flex items-center gap-1">
          Dibuat dengan semangat akademis &amp; inovasi AI
        </p>
      </div>
    </footer>
  );
};

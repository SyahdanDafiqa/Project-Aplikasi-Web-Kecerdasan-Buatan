import React, { useState, useEffect } from 'react';
import { COURSE_MODULES } from './data/modulesData';
import { CourseModule, UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { ModuleList } from './components/ModuleList';
import { ModuleDetail } from './components/ModuleDetail';
import { ChatTutor } from './components/ChatTutor';
import { QuizView } from './components/QuizView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { Footer } from './components/Footer';
import { EVAL_DATASET } from './data/evalDataset';
import { evaluateSingleResponse } from './utils/evalEngine';
import { checkServerStatus, getFallbackResponse } from './services/geminiService';
import { ChatFeedbackEntry, EvalCaseResult, EvalTestCase } from './types';
import { Bot, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_PROGRESS_KEY = 'informatikalab_user_progress';
const LOCAL_STORAGE_THEME_KEY = 'informatikalab_theme';
const LOCAL_STORAGE_EVAL_CASES_KEY = 'informatikalab_custom_eval_cases';
const LOCAL_STORAGE_EVAL_RESULTS_KEY = 'informatikalab_eval_results';
const LOCAL_STORAGE_CHAT_FEEDBACK_KEY = 'informatikalab_chat_feedbacks';

export default function App() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync theme with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'modules' | 'chat' | 'quiz' | 'eval' | 'stats'>('modules');

  // Server Gemini key availability
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean | null>(null);
  useEffect(() => {
    checkServerStatus().then((status) => setHasGeminiKey(status.hasKey));
  }, []);

  // Custom evaluation test cases
  const [customEvalCases, setCustomEvalCases] = useState<EvalTestCase[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_EVAL_CASES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_EVAL_CASES_KEY, JSON.stringify(customEvalCases));
    } catch {
      // ignore
    }
  }, [customEvalCases]);

  const allEvalCases = React.useMemo(
    () => [...EVAL_DATASET, ...customEvalCases],
    [customEvalCases]
  );

  // Evaluation results map (initialized deterministically via real local evaluation engine if empty)
  const [evalResultsMap, setEvalResultsMap] = useState<Record<string, EvalCaseResult>>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_EVAL_RESULTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    const baseline: Record<string, EvalCaseResult> = {};
    for (const tc of EVAL_DATASET) {
      const resp = getFallbackResponse(tc.question, tc.topicContext);
      baseline[tc.id] = evaluateSingleResponse(tc, resp, 14, 'fallback-local');
    }
    return baseline;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_EVAL_RESULTS_KEY, JSON.stringify(evalResultsMap));
    } catch {
      // ignore
    }
  }, [evalResultsMap]);

  // Human-in-the-loop chat feedback entries
  const [chatFeedbacks, setChatFeedbacks] = useState<ChatFeedbackEntry[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CHAT_FEEDBACK_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CHAT_FEEDBACK_KEY, JSON.stringify(chatFeedbacks));
    } catch {
      // ignore
    }
  }, [chatFeedbacks]);

  const handleRateChatResponse = (entry: ChatFeedbackEntry) => {
    setChatFeedbacks((prev) => {
      const filtered = prev.filter((f) => f.messageId !== entry.messageId);
      return [entry, ...filtered];
    });
  };

  // Currently viewed module (if in detail mode)
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Chat context variables
  const [chatTopicContext, setChatTopicContext] = useState<string | undefined>(undefined);
  const [chatInitialCode, setChatInitialCode] = useState<string | undefined>(undefined);

  // User learning progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return {
      completedModuleIds: [],
      bookmarkedModuleIds: [],
      quizScores: {},
    };
  });

  // Persist progress changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Handle module completion toggle
  const handleToggleComplete = (moduleId: string) => {
    setProgress((prev) => {
      const isAlready = prev.completedModuleIds.includes(moduleId);
      return {
        ...prev,
        completedModuleIds: isAlready
          ? prev.completedModuleIds.filter((id) => id !== moduleId)
          : [...prev.completedModuleIds, moduleId],
      };
    });
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (moduleId: string) => {
    setProgress((prev) => {
      const isAlready = prev.bookmarkedModuleIds.includes(moduleId);
      return {
        ...prev,
        bookmarkedModuleIds: isAlready
          ? prev.bookmarkedModuleIds.filter((id) => id !== moduleId)
          : [...prev.bookmarkedModuleIds, moduleId],
      };
    });
  };

  // Reset user progress
  const handleResetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh progres dan bookmark belajar?')) {
      setProgress({
        completedModuleIds: [],
        bookmarkedModuleIds: [],
        quizScores: {},
      });
    }
  };

  // Jump to chat with a preloaded topic context
  const handleOpenChatWithTopic = (topic: string, codeSnippet?: string) => {
    setChatTopicContext(topic);
    setChatInitialCode(codeSnippet);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select a module to view
  const handleSelectModule = (mod: CourseModule) => {
    setSelectedModule(mod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back from module detail
  const handleBackToModules = () => {
    setSelectedModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Change tab
  const handleTabChange = (tab: 'modules' | 'chat' | 'quiz' | 'eval' | 'stats') => {
    setActiveTab(tab);
    if (tab !== 'modules') {
      setSelectedModule(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        completedCount={progress.completedModuleIds.length}
        bookmarkCount={progress.bookmarkedModuleIds.length}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'modules' && (
          <>
            {selectedModule ? (
              <ModuleDetail
                module={selectedModule}
                isCompleted={progress.completedModuleIds.includes(selectedModule.id)}
                isBookmarked={progress.bookmarkedModuleIds.includes(selectedModule.id)}
                onToggleComplete={handleToggleComplete}
                onToggleBookmark={handleToggleBookmark}
                onBack={handleBackToModules}
                onOpenChatWithTopic={handleOpenChatWithTopic}
                onNavigateModule={(id) => {
                  const target = COURSE_MODULES.find((m) => m.id === id);
                  if (target) handleSelectModule(target);
                }}
                allModules={COURSE_MODULES}
              />
            ) : (
              <ModuleList
                modules={COURSE_MODULES}
                completedIds={progress.completedModuleIds}
                bookmarkedIds={progress.bookmarkedModuleIds}
                onSelectModule={handleSelectModule}
                onToggleBookmark={handleToggleBookmark}
                onOpenChatWithTopic={handleOpenChatWithTopic}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
          </>
        )}

        {activeTab === 'chat' && (
          <div className="py-2">
            <ChatTutor
              currentTopicContext={chatTopicContext}
              onClearContext={() => setChatTopicContext(undefined)}
              initialCodeSnippet={chatInitialCode}
              chatFeedbacks={chatFeedbacks}
              onRateResponse={handleRateChatResponse}
              onOpenEvalDashboard={() => handleTabChange('eval')}
            />
          </div>
        )}

        {activeTab === 'quiz' && (
          <QuizView
            modules={COURSE_MODULES}
            onOpenChatWithTopic={handleOpenChatWithTopic}
          />
        )}

        {activeTab === 'eval' && (
          <EvaluationDashboard
            testCases={allEvalCases}
            resultsMap={evalResultsMap}
            onUpdateResults={setEvalResultsMap}
            onAddTestCase={(newCase) => setCustomEvalCases((prev) => [...prev, newCase])}
            onDeleteCustomTestCase={(id) => {
              setCustomEvalCases((prev) => prev.filter((c) => c.id !== id));
              setEvalResultsMap((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
              });
            }}
            chatFeedbacks={chatFeedbacks}
            onClearFeedbacks={() => setChatFeedbacks([])}
            onOpenChat={() => handleTabChange('chat')}
            hasGeminiKey={hasGeminiKey}
          />
        )}

        {activeTab === 'stats' && (
          <ProgressDashboard
            modules={COURSE_MODULES}
            progress={progress}
            onSelectModule={(mod) => {
              setSelectedModule(mod);
              setActiveTab('modules');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetProgress={handleResetProgress}
          />
        )}
      </div>

      {/* Floating AI Chat button when browsing modules or quiz */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => handleTabChange('chat')}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Tanya AI Tutor"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-1.5 -right-1.5 animate-bounce" />
          </div>
          <span className="text-xs sm:text-sm font-sans tracking-wide">Tanya AI Tutor</span>
        </button>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

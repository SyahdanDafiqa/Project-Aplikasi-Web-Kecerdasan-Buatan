export type CategoryId = 'web-dev' | 'dsa' | 'database' | 'network' | 'ai';

export type DifficultyLevel = 'Dasar' | 'Menengah' | 'Lanjutan';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CodeSnippet {
  language: string;
  title: string;
  code: string;
  explanation?: string;
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string; // Markdown or rich formatted text
  codeSnippets?: CodeSnippet[];
  keyPoints?: string[];
}

export interface CourseModule {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  title: string;
  slug: string;
  summary: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  iconName: string;
  tags: string[];
  sections: ModuleSection[];
  quiz: QuizQuestion[];
  prerequisites?: string[];
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortDesc: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  topicContext?: string;
  isStreaming?: boolean;
}

export interface UserProgress {
  completedModuleIds: string[];
  bookmarkedModuleIds: string[];
  quizScores: Record<string, { score: number; total: number; timestamp: number }>;
  lastVisitedModuleId?: string;
}

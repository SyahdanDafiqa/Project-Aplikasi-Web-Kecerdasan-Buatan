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

export type EvalDomainCategory = CategoryId | 'false-premise';

export type EvalConfusionOutcome = 'TP' | 'FP' | 'FN' | 'TN';

export interface EvalTestCase {
  id: string;
  category: EvalDomainCategory;
  categoryLabel: string;
  question: string;
  topicContext?: string;
  expectedPositive: boolean;
  expectedConcepts: string[];
  forbiddenClaims?: string[];
  referenceAnswer: string;
  isCustom?: boolean;
}

export interface EvalCaseResult {
  testCaseId: string;
  actualResponse: string;
  matchedConcepts: string[];
  missedConcepts: string[];
  triggeredForbidden: string[];
  tokenPrecision: number;
  tokenRecall: number;
  tokenF1: number;
  conceptCoverage: number;
  predictedPositive: boolean;
  outcome: EvalConfusionOutcome;
  latencyMs: number;
  evaluatedVia: 'gemini-live' | 'fallback-local';
  evaluatedAt: number;
}

export interface EvalCategoryBreakdown {
  category: EvalDomainCategory;
  categoryLabel: string;
  total: number;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  avgTokenF1: number;
  avgLatencyMs: number;
}

export interface EvalSummaryMetrics {
  total: number;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  macroTokenF1: number;
  macroConceptCoverage: number;
  avgLatencyMs: number;
  byCategory: EvalCategoryBreakdown[];
}

export interface ChatFeedbackEntry {
  id: string;
  messageId: string;
  userQuestion: string;
  assistantResponse: string;
  topicContext?: string;
  rating: 'accurate' | 'inaccurate';
  timestamp: number;
}


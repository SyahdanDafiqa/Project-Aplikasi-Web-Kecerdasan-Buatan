import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  MessageSquare,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import {
  ChatFeedbackEntry,
  EvalCaseResult,
  EvalConfusionOutcome,
  EvalDomainCategory,
  EvalTestCase,
} from '../types';
import {
  computeFeedbackMetrics,
  computeSummaryMetrics,
  evaluateSingleResponse,
} from '../utils/evalEngine';
import { evaluateChatbotPrompt } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface EvaluationDashboardProps {
  testCases: EvalTestCase[];
  resultsMap: Record<string, EvalCaseResult>;
  onUpdateResults: (updater: (prev: Record<string, EvalCaseResult>) => Record<string, EvalCaseResult>) => void;
  onAddTestCase: (newCase: EvalTestCase) => void;
  onDeleteCustomTestCase: (id: string) => void;
  chatFeedbacks: ChatFeedbackEntry[];
  onClearFeedbacks: () => void;
  onOpenChat: () => void;
  hasGeminiKey: boolean | null;
}

const DOMAIN_OPTIONS: { id: EvalDomainCategory; label: string }[] = [
  { id: 'web-dev', label: 'Pemrograman Web' },
  { id: 'dsa', label: 'Struktur Data & Algoritma' },
  { id: 'database', label: 'Basis Data' },
  { id: 'network', label: 'Jaringan Komputer' },
  { id: 'ai', label: 'Kecerdasan Buatan' },
  { id: 'false-premise', label: 'Koreksi Premis & Out-of-Scope' },
];

function formatPct(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

function getOutcomeDisplay(outcome: EvalConfusionOutcome) {
  switch (outcome) {
    case 'TP':
      return {
        label: 'TP · Tepat',
        textClass: 'text-emerald-700 dark:text-emerald-400',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
        Icon: CheckCircle2,
      };
    case 'TN':
      return {
        label: 'TN · Terkoreksi',
        textClass: 'text-sky-700 dark:text-sky-400',
        bgClass: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-900',
        Icon: ShieldCheck,
      };
    case 'FP':
      return {
        label: 'FP · Keliru Terima',
        textClass: 'text-amber-700 dark:text-amber-400',
        bgClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
        Icon: AlertTriangle,
      };
    case 'FN':
      return {
        label: 'FN · Kurang Konsep',
        textClass: 'text-rose-700 dark:text-rose-400',
        bgClass: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900',
        Icon: XCircle,
      };
  }
}

export const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({
  testCases,
  resultsMap,
  onUpdateResults,
  onAddTestCase,
  onDeleteCustomTestCase,
  chatFeedbacks,
  onClearFeedbacks,
  onOpenChat,
  hasGeminiKey,
}) => {
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [runningCaseId, setRunningCaseId] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [evalNotice, setEvalNotice] = useState<string | null>(null);

  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | EvalConfusionOutcome>('ALL');
  const [domainFilter, setDomainFilter] = useState<'ALL' | EvalDomainCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [inspectCaseId, setInspectCaseId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add custom test case form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<EvalDomainCategory>('dsa');
  const [newExpectedPositive, setNewExpectedPositive] = useState<boolean>(true);
  const [newConceptsInput, setNewConceptsInput] = useState('');
  const [newForbiddenInput, setNewForbiddenInput] = useState('');
  const [newReferenceAnswer, setNewReferenceAnswer] = useState('');

  const summary = useMemo(
    () => computeSummaryMetrics(testCases, resultsMap),
    [testCases, resultsMap]
  );

  const feedbackSummary = useMemo(
    () => computeFeedbackMetrics(chatFeedbacks),
    [chatFeedbacks]
  );

  const liveCount = useMemo(() => {
    return Object.values(resultsMap).filter((r) => r.evaluatedVia === 'gemini-live').length;
  }, [resultsMap]);

  const filteredCases = useMemo(() => {
    return testCases.filter((tc) => {
      const res = resultsMap[tc.id];
      if (outcomeFilter !== 'ALL' && res?.outcome !== outcomeFilter) return false;
      if (domainFilter !== 'ALL' && tc.category !== domainFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuestion = tc.question.toLowerCase().includes(q);
        const matchesCat = tc.categoryLabel.toLowerCase().includes(q);
        const matchesConcept = tc.expectedConcepts.some((c) => c.toLowerCase().includes(q));
        if (!matchesQuestion && !matchesCat && !matchesConcept) return false;
      }
      return true;
    });
  }, [testCases, resultsMap, outcomeFilter, domainFilter, searchQuery]);

  const inspectedCase = useMemo(
    () => testCases.find((tc) => tc.id === inspectCaseId) || null,
    [testCases, inspectCaseId]
  );
  const inspectedResult = inspectCaseId ? resultsMap[inspectCaseId] || null : null;

  const handleRunSingleCase = async (tc: EvalTestCase, useLiveGemini = true) => {
    setRunningCaseId(tc.id);
    setEvalNotice(null);
    try {
      const evalRes = await evaluateChatbotPrompt(tc.question, tc.topicContext, useLiveGemini);
      const scored = evaluateSingleResponse(
        tc,
        evalRes.responseText,
        evalRes.latencyMs,
        evalRes.evaluatedVia
      );
      onUpdateResults((prev) => ({
        ...prev,
        [tc.id]: scored,
      }));
      if (evalRes.errorNotice && useLiveGemini) {
        setEvalNotice(
          `Server Gemini belum aktif (${evalRes.errorNotice}); kasus diuji menggunakan evaluator fallback lokal.`
        );
      }
    } finally {
      setRunningCaseId(null);
    }
  };

  const handleRunFullEvaluation = async (useLiveGemini: boolean) => {
    if (isRunningBatch) return;
    setIsRunningBatch(true);
    setEvalNotice(null);
    setBatchProgress({ current: 0, total: testCases.length });

    let fallbackNoticeShown = false;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      setRunningCaseId(tc.id);
      const evalRes = await evaluateChatbotPrompt(tc.question, tc.topicContext, useLiveGemini);
      const scored = evaluateSingleResponse(
        tc,
        evalRes.responseText,
        evalRes.latencyMs,
        evalRes.evaluatedVia
      );
      onUpdateResults((prev) => ({
        ...prev,
        [tc.id]: scored,
      }));
      if (evalRes.errorNotice && useLiveGemini && !fallbackNoticeShown) {
        fallbackNoticeShown = true;
        setEvalNotice(
          `GEMINI_API_KEY belum tersedia atau server tidak merespons (${evalRes.errorNotice}). Evaluasi dijalankan pada mode fallback lokal.`
        );
      }
      setBatchProgress({ current: i + 1, total: testCases.length });
    }

    setRunningCaseId(null);
    setIsRunningBatch(false);
  };

  const handleCreateCustomCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQ = newQuestion.trim();
    const concepts = newConceptsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!trimmedQ || concepts.length === 0) return;

    const forbidden = newForbiddenInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const catOption = DOMAIN_OPTIONS.find((d) => d.id === newCategory);
    const id = `custom-${Date.now()}`;
    const newCase: EvalTestCase = {
      id,
      category: newCategory,
      categoryLabel: catOption ? catOption.label : 'Kustom',
      question: trimmedQ,
      topicContext: catOption?.label,
      expectedPositive: newExpectedPositive,
      expectedConcepts: concepts,
      forbiddenClaims: forbidden.length > 0 ? forbidden : undefined,
      referenceAnswer:
        newReferenceAnswer.trim() ||
        `Jawaban diharapkan mencakup konsep utama: ${concepts.join(', ')}.`,
      isCustom: true,
    };

    onAddTestCase(newCase);
    setShowAddModal(false);
    setNewQuestion('');
    setNewConceptsInput('');
    setNewForbiddenInput('');
    setNewReferenceAnswer('');

    // Immediately evaluate the newly created test case
    await handleRunSingleCase(newCase, Boolean(hasGeminiKey));
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Kategori',
      'Tipe_Ekspektasi',
      'Pertanyaan',
      'Outcome_Confusion_Matrix',
      'Concept_Coverage_Pct',
      'Token_Precision_Pct',
      'Token_Recall_Pct',
      'Token_F1_Pct',
      'Latency_Ms',
      'Evaluated_Via',
    ];

    const rows = testCases.map((tc) => {
      const r = resultsMap[tc.id];
      const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
      return [
        tc.id,
        escapeCsv(tc.categoryLabel),
        tc.expectedPositive ? 'Positif (Valid IT)' : 'Negatif (Koreksi/OOS)',
        escapeCsv(tc.question),
        r ? r.outcome : 'N/A',
        r ? (r.conceptCoverage * 100).toFixed(1) : '0.0',
        r ? (r.tokenPrecision * 100).toFixed(1) : '0.0',
        r ? (r.tokenRecall * 100).toFixed(1) : '0.0',
        r ? (r.tokenF1 * 100).toFixed(1) : '0.0',
        r ? String(r.latencyMs) : '0',
        r ? r.evaluatedVia : 'none',
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `informatikalab-eval-metrics-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Top Workspace Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Evaluasi Akurasi &amp; F1-Score Chatbot
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums">{summary.total} Kasus Uji</span>
            <span aria-hidden="true">·</span>
            <span>
              {liveCount > 0
                ? `${liveCount} diuji via Gemini Live (gemini-4-hydrogen)`
                : 'Mode Baseline Lokal (Knowledge Base)'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Rata-rata Latensi {summary.avgLatencyMs} ms
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isRunningBatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kasus Uji</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={isRunningBatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => handleRunFullEvaluation(false)}
            disabled={isRunningBatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            title="Uji cepat menggunakan engine fallback lokal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Uji Baseline Lokal</span>
          </button>

          <button
            onClick={() => handleRunFullEvaluation(true)}
            disabled={isRunningBatch}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            {isRunningBatch ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="font-mono tabular-nums">
                  Menguji {batchProgress.current}/{batchProgress.total}...
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Jalankan Evaluasi Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notice Banner (only when API key fallback occurs) */}
      {evalNotice && (
        <div className="px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{evalNotice}</span>
          </div>
          <button
            onClick={() => setEvalNotice(null)}
            className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded cursor-pointer"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4-Column KPI Summary Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Accuracy (Akurasi Global)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatPct(summary.accuracy)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            (TP {summary.tp} + TN {summary.tn}) / {summary.total} kasus
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>F1-Score (Klasifikasi)</span>
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
            {formatPct(summary.f1Score)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            2 × (P × R) / (P + R)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Precision &amp; Recall</span>
            <BarChart3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="flex items-baseline gap-3 font-mono tabular-nums">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">P:</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatPct(summary.precision)}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">R:</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatPct(summary.recall)}
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            FP: {summary.fp} · FN: {summary.fn}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Macro Token F1 &amp; Cakupan</span>
            <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatPct(summary.macroTokenF1)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            Cakupan Konsep: {formatPct(summary.macroConceptCoverage)}
          </div>
        </div>
      </section>

      {/* 2-Column Analytical Split: Confusion Matrix + Per-Domain Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive 2x2 Confusion Matrix + Formula Proof */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Confusion Matrix (2×2)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Klik sel matriks untuk memfilter tabel kasus uji di bawah
                </p>
              </div>
              {outcomeFilter !== 'ALL' && (
                <button
                  onClick={() => setOutcomeFilter('ALL')}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Matrix Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center">
                <div className="col-span-4" />
                <div className="col-span-4">Prediksi: Positif</div>
                <div className="col-span-4">Prediksi: Negatif</div>
              </div>

              {/* Row 1: Actual Positive */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-xs font-medium text-slate-600 dark:text-slate-300 pr-2 text-right">
                  Aktual: Positif
                  <div className="text-[11px] font-normal text-slate-400">Pertanyaan Valid</div>
                </div>

                <button
                  onClick={() => setOutcomeFilter(outcomeFilter === 'TP' ? 'ALL' : 'TP')}
                  className={`col-span-4 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    outcomeFilter === 'TP'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-400'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    True Positive (TP)
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                    {summary.tp}
                  </div>
                </button>

                <button
                  onClick={() => setOutcomeFilter(outcomeFilter === 'FN' ? 'ALL' : 'FN')}
                  className={`col-span-4 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    outcomeFilter === 'FN'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60'
                      : 'border-slate-200 dark:border-slate-800 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-400'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                    False Negative (FN)
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                    {summary.fn}
                  </div>
                </button>
              </div>

              {/* Row 2: Actual Negative */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-xs font-medium text-slate-600 dark:text-slate-300 pr-2 text-right">
                  Aktual: Negatif
                  <div className="text-[11px] font-normal text-slate-400">Premis Salah / OOS</div>
                </div>

                <button
                  onClick={() => setOutcomeFilter(outcomeFilter === 'FP' ? 'ALL' : 'FP')}
                  className={`col-span-4 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    outcomeFilter === 'FP'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60'
                      : 'border-slate-200 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-400'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    False Positive (FP)
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                    {summary.fp}
                  </div>
                </button>

                <button
                  onClick={() => setOutcomeFilter(outcomeFilter === 'TN' ? 'ALL' : 'TN')}
                  className={`col-span-4 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    outcomeFilter === 'TN'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60'
                      : 'border-slate-200 dark:border-slate-800 bg-sky-50/40 dark:bg-sky-950/20 hover:border-sky-400'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                    True Negative (TN)
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                    {summary.tn}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Live Mathematical Formulas */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="font-medium text-slate-700 dark:text-slate-300">
              Transparansi Perhitungan Matematis
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 font-mono tabular-nums text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span>
                  ({summary.tp}+{summary.tn})/{summary.total} = {formatPct(summary.accuracy)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Precision:</span>
                <span>
                  {summary.tp}/({summary.tp}+{summary.fp}) = {formatPct(summary.precision)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Recall:</span>
                <span>
                  {summary.tp}/({summary.tp}+{summary.fn}) = {formatPct(summary.recall)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>F1-Score:</span>
                <span>
                  2PR/(P+R) = {formatPct(summary.f1Score)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Per-Domain Performance Breakdown + Human-in-the-Loop Feedback */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Akurasi &amp; Token F1 Per Domain Studi
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Rincian performa chatbot pada 5 pilar Informatika dan uji koreksi premis
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-2 pr-3">Domain</th>
                    <th className="py-2 px-2 text-right">Uji</th>
                    <th className="py-2 px-2 text-right">Accuracy</th>
                    <th className="py-2 px-2 text-right">Token F1</th>
                    <th className="py-2 pl-2 text-right">Latensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {summary.byCategory.map((cat) => (
                    <tr
                      key={cat.category}
                      onClick={() =>
                        setDomainFilter(domainFilter === cat.category ? 'ALL' : cat.category)
                      }
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 pr-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {cat.categoryLabel}
                        </div>
                        <div className="w-full max-w-[180px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                            style={{ width: `${Math.round(cat.accuracy * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {cat.total}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {formatPct(cat.accuracy)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                        {formatPct(cat.avgTokenF1)}
                      </td>
                      <td className="py-2.5 pl-2 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {cat.avgLatencyMs} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Human-in-the-Loop Chat Feedback Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Evaluasi Pengguna Langsung (Human-in-the-Loop)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rating akurasi yang diberikan mahasiswa pada sesi AI Tutor Chat
                </p>
              </div>
              {feedbackSummary.total > 0 && (
                <button
                  onClick={onClearFeedbacks}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer shrink-0"
                >
                  Hapus Riwayat Rating
                </button>
              )}
            </div>

            {feedbackSummary.total > 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-6 font-mono tabular-nums">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Akurasi User</div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPct(feedbackSummary.userAccuracyRate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{feedbackSummary.accurateCount} Akurat</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>{feedbackSummary.inaccurateCount} Kurang Tepat</span>
                  </div>
                </div>
                <button
                  onClick={onOpenChat}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Uji di AI Tutor Chat
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Belum ada respons chatbot yang dinilai. Berikan tanda &ldquo;Akurat&rdquo; atau &ldquo;Kurang Tepat&rdquo; di tab AI Tutor Chat untuk melacak akurasi lapangan.
                </span>
                <button
                  onClick={onOpenChat}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Buka AI Tutor Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benchmark Test Cases Table */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Rincian Kasus Uji Benchmark ({filteredCases.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Bandingkan jawaban chatbot terhadap ground truth dan konsep wajib per pertanyaan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan atau konsep..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
              />
            </div>

            {/* Domain select */}
            <div className="relative flex items-center">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value as 'ALL' | EvalDomainCategory)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                aria-label="Filter Domain Studi"
              >
                <option value="ALL">Semua Domain</option>
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Segmented Outcome Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['ALL', 'TP', 'TN', 'FP', 'FN'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setOutcomeFilter(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    outcomeFilter === status
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {status === 'ALL' ? 'Semua' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Pertanyaan &amp; Domain</th>
                <th className="py-3 px-3">Kelas Aktual</th>
                <th className="py-3 px-3">Hasil Evaluasi</th>
                <th className="py-3 px-3 text-right">Cakupan Konsep</th>
                <th className="py-3 px-3 text-right">Token F1</th>
                <th className="py-3 px-3 text-right">Latensi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400">
                    Tidak ada kasus uji yang sesuai dengan filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredCases.map((tc) => {
                  const res = resultsMap[tc.id];
                  const isRunningThis = runningCaseId === tc.id;
                  const outcomeDisplay = res ? getOutcomeDisplay(res.outcome) : null;

                  return (
                    <tr
                      key={tc.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                          {tc.question}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span>{tc.categoryLabel}</span>
                          {tc.isCustom && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                Kasus Kustom
                              </span>
                            </>
                          )}
                          {res && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>
                                {res.evaluatedVia === 'gemini-live' ? 'Gemini Live' : 'Fallback Lokal'}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {tc.expectedPositive ? 'Positif (Valid IT)' : 'Negatif (Koreksi)'}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {isRunningThis ? (
                          <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Menguji...</span>
                          </span>
                        ) : outcomeDisplay ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium ${outcomeDisplay.bgClass} ${outcomeDisplay.textClass}`}
                          >
                            <outcomeDisplay.Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{outcomeDisplay.label}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Belum diuji</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {res
                          ? `${res.matchedConcepts.length}/${tc.expectedConcepts.length} (${formatPct(
                              res.conceptCoverage
                            )})`
                          : '—'}
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {res ? formatPct(res.tokenF1) : '—'}
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {res ? `${res.latencyMs} ms` : '—'}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setInspectCaseId(tc.id)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Lihat detail perbandingan jawaban"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRunSingleCase(tc, true)}
                            disabled={isRunningBatch || isRunningThis}
                            className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer disabled:opacity-40"
                            title="Uji ulang kasus ini via Gemini"
                          >
                            <RefreshCw className={`w-4 h-4 ${isRunningThis ? 'animate-spin' : ''}`} />
                          </button>
                          {tc.isCustom && (
                            <button
                              onClick={() => onDeleteCustomTestCase(tc.id)}
                              disabled={isRunningBatch}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer disabled:opacity-40"
                              title="Hapus kasus kustom"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Side-by-Side Inspection Modal */}
      {inspectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {inspectedCase.categoryLabel} · {inspectedCase.expectedPositive ? 'Pertanyaan Valid' : 'Uji Koreksi Premis / OOS'}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {inspectedCase.question}
                </h3>
              </div>
              <button
                onClick={() => setInspectCaseId(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
                aria-label="Tutup modal detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {inspectedResult ? (
                <>
                  {/* Per-case Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 font-mono tabular-nums">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Status Matriks</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {getOutcomeDisplay(inspectedResult.outcome).label}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Token Precision / Recall</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {formatPct(inspectedResult.tokenPrecision)} / {formatPct(inspectedResult.tokenRecall)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Token F1-Score</div>
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {formatPct(inspectedResult.tokenF1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Latensi</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {inspectedResult.latencyMs} ms
                      </div>
                    </div>
                  </div>

                  {/* Concepts Check */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Konsep Terpenuhi ({inspectedResult.matchedConcepts.length})
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {inspectedResult.matchedConcepts.length > 0
                          ? inspectedResult.matchedConcepts.join(' · ')
                          : 'Tidak ada'}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-semibold text-rose-700 dark:text-rose-400">
                        Konsep Terlewat ({inspectedResult.missedConcepts.length})
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {inspectedResult.missedConcepts.length > 0
                          ? inspectedResult.missedConcepts.join(' · ')
                          : 'Semua konsep terpenuhi'}
                      </div>
                    </div>
                  </div>

                  {inspectedResult.triggeredForbidden.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
                      Klaim terlarang terdeteksi pada respons: {inspectedResult.triggeredForbidden.join(', ')}
                    </div>
                  )}

                  {/* Side-by-side comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Referensi Ground Truth
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {inspectedCase.referenceAnswer}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Respons Aktual Chatbot ({inspectedResult.evaluatedVia === 'gemini-live' ? 'Gemini Live' : 'Fallback Lokal'})
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-h-72 overflow-y-auto">
                        <MarkdownRenderer content={inspectedResult.actualResponse} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-sm text-slate-500">
                  Kasus ini belum dievaluasi. Klik Uji Ulang untuk menjalankan evaluasi.
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/70 dark:bg-slate-950/40">
              <button
                onClick={() => handleRunSingleCase(inspectedCase, true)}
                disabled={runningCaseId === inspectedCase.id}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${runningCaseId === inspectedCase.id ? 'animate-spin' : ''}`} />
                <span>Uji Ulang via Gemini</span>
              </button>
              <button
                onClick={() => setInspectCaseId(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Test Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustomCase}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Kasus Uji Benchmark Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-700 dark:text-slate-300 block">
                    Domain Studi
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EvalDomainCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-700 dark:text-slate-300 block">
                    Kelas Ground Truth
                  </label>
                  <select
                    value={newExpectedPositive ? 'pos' : 'neg'}
                    onChange={(e) => setNewExpectedPositive(e.target.value === 'pos')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="pos">Positif (Pertanyaan Informatika Valid)</option>
                    <option value="neg">Negatif (Premis Salah / Out-of-Scope)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-slate-700 dark:text-slate-300 block">
                  Pertanyaan Uji Chatbot
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Contoh: Apa perbedaan antara Stack dan Queue dalam struktur data?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-slate-700 dark:text-slate-300 block">
                  Konsep / Kata Kunci Wajib (pisahkan dengan koma)
                </label>
                <input
                  required
                  type="text"
                  value={newConceptsInput}
                  onChange={(e) => setNewConceptsInput(e.target.value)}
                  placeholder="Contoh: LIFO, FIFO, push, pop, enqueue"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {!newExpectedPositive && (
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-700 dark:text-slate-300 block">
                    Klaim Terlarang (opsional, pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={newForbiddenInput}
                    onChange={(e) => setNewForbiddenInput(e.target.value)}
                    placeholder="Frasa yang menandakan halusinasi jika disetujui bot"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-medium text-slate-700 dark:text-slate-300 block">
                  Referensi Jawaban Ground Truth (untuk Token F1)
                </label>
                <textarea
                  rows={2}
                  value={newReferenceAnswer}
                  onChange={(e) => setNewReferenceAnswer(e.target.value)}
                  placeholder="Jawaban ideal singkat sebagai pembanding Token F1..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/70 dark:bg-slate-950/40">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                Simpan &amp; Uji Otomatis
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

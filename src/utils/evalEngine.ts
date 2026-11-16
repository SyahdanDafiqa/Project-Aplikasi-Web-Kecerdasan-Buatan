import {
  ChatFeedbackEntry,
  EvalCaseResult,
  EvalCategoryBreakdown,
  EvalConfusionOutcome,
  EvalDomainCategory,
  EvalSummaryMetrics,
  EvalTestCase,
} from '../types';

const STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'dengan', 'adalah', 'itu',
  'ini', 'atau', 'jika', 'maka', 'akan', 'juga', 'dapat', 'bisa', 'secara', 'dalam',
  'seperti', 'oleh', 'karena', 'agar', 'serta', 'lebih', 'tidak', 'hanya', 'saat',
  'anda', 'kita', 'saya', 'mereka', 'antara', 'sebuah', 'suatu', 'apa', 'bagaimana',
  'the', 'is', 'are', 'a', 'an', 'of', 'to', 'in', 'for', 'and', 'or', 'on', 'with',
]);

// Normalize text for token & concept comparison
export function normalizeForTokens(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-z]*/gi, ' '))
    .replace(/[`*_>#~|()[\]{}.,;:!?'"\\/+=$-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return [];
  return cleaned
    .split(' ')
    .filter((tok) => tok.length > 1 && !STOPWORDS.has(tok));
}

function normalizeConceptString(concept: string): string {
  return concept
    .toLowerCase()
    .replace(/\\log/g, 'log')
    .replace(/[`*_\\{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function conceptMatchesResponse(concept: string, normalizedResponse: string, rawLowerResponse: string): boolean {
  const normConcept = normalizeConceptString(concept);
  if (!normConcept) return false;

  // Direct substring match in raw lowercased response (preserves O(n^2), O(1), 401, etc.)
  if (rawLowerResponse.includes(concept.toLowerCase().replace(/\\log/g, 'log'))) {
    return true;
  }

  if (normalizedResponse.includes(normConcept)) {
    return true;
  }

  // Synonym / stem fallback for Indonesian & CS concepts
  const synonyms: Record<string, string[]> = {
    'salah': ['keliru', 'tidak benar', 'kurang tepat', 'bukan', 'berbeda', 'tidak'],
    'keliru': ['salah', 'tidak benar', 'kurang tepat', 'bukan', 'tidak'],
    'tidak': ['bukan', 'keliru', 'salah', 'tidak benar', 'hanya'],
    'di luar': ['tidak termasuk', 'fokus', 'informatika', 'bukan topik', 'domain'],
    'maaf': ['mohon maaf', 'sebagai dosen', 'informatika', 'fokus pada'],
    'hak akses': ['izin', 'authorization', 'otorisasi', 'role', 'forbidden'],
    'memori': ['space complexity', 'ruang', 'penyimpanan'],
    'kecocokan': ['cocok', 'berelasi', 'match', 'pasangan'],
    'bobot': ['weight', 'w_i'],
  };

  const altList = synonyms[normConcept];
  if (altList) {
    return altList.some((alt) => rawLowerResponse.includes(alt) || normalizedResponse.includes(alt));
  }

  return false;
}

// SQuAD-style multiset Token Precision, Recall & F1-Score
export function computeTokenMetrics(prediction: string, reference: string): {
  tokenPrecision: number;
  tokenRecall: number;
  tokenF1: number;
} {
  const predTokens = normalizeForTokens(prediction);
  const refTokens = normalizeForTokens(reference);

  if (predTokens.length === 0 || refTokens.length === 0) {
    return { tokenPrecision: 0, tokenRecall: 0, tokenF1: 0 };
  }

  const refCounts = new Map<string, number>();
  for (const tok of refTokens) {
    refCounts.set(tok, (refCounts.get(tok) || 0) + 1);
  }

  let overlap = 0;
  for (const tok of predTokens) {
    const count = refCounts.get(tok) || 0;
    if (count > 0) {
      overlap++;
      refCounts.set(tok, count - 1);
    }
  }

  if (overlap === 0) {
    return { tokenPrecision: 0, tokenRecall: 0, tokenF1: 0 };
  }

  const tokenPrecision = overlap / predTokens.length;
  const tokenRecall = overlap / refTokens.length;
  const tokenF1 = (2 * tokenPrecision * tokenRecall) / (tokenPrecision + tokenRecall);

  return { tokenPrecision, tokenRecall, tokenF1 };
}

export function evaluateSingleResponse(
  testCase: EvalTestCase,
  actualResponse: string,
  latencyMs: number,
  evaluatedVia: 'gemini-live' | 'fallback-local'
): EvalCaseResult {
  const rawLower = actualResponse.toLowerCase();
  const normalizedResp = rawLower
    .replace(/[`*_\\{}]/g, '')
    .replace(/\s+/g, ' ');

  const matchedConcepts: string[] = [];
  const missedConcepts: string[] = [];

  for (const concept of testCase.expectedConcepts) {
    if (conceptMatchesResponse(concept, normalizedResp, rawLower)) {
      matchedConcepts.push(concept);
    } else {
      missedConcepts.push(concept);
    }
  }

  const conceptCoverage =
    testCase.expectedConcepts.length > 0
      ? matchedConcepts.length / testCase.expectedConcepts.length
      : 1;

  const triggeredForbidden: string[] = [];
  if (testCase.forbiddenClaims && testCase.forbiddenClaims.length > 0) {
    for (const claim of testCase.forbiddenClaims) {
      if (rawLower.includes(claim.toLowerCase())) {
        triggeredForbidden.push(claim);
      }
    }
  }

  const { tokenPrecision, tokenRecall, tokenF1 } = computeTokenMetrics(
    actualResponse,
    testCase.referenceAnswer
  );

  // Determine Confusion Matrix Classification (TP, FP, FN, TN)
  let predictedPositive = false;
  let outcome: EvalConfusionOutcome = 'FN';

  if (testCase.expectedPositive) {
    // Positive class: valid CS question where chatbot must cover >= 60% of expected concepts
    const passed = conceptCoverage >= 0.6 && triggeredForbidden.length === 0;
    predictedPositive = passed;
    outcome = passed ? 'TP' : 'FN';
  } else {
    // Negative class: false-premise trap or out-of-domain request.
    // Correct behavior = rejects/corrects the premise (no forbidden claims + covers >= 50% correction concepts)
    const properlyRejectedOrCorrected =
      triggeredForbidden.length === 0 && conceptCoverage >= 0.5;
    // In binary classification:
    // TN = model correctly predicts Negative (rejects/corrects false premise)
    // FP = model falsely predicts Positive (accepts false premise or answers out-of-scope recipe)
    predictedPositive = !properlyRejectedOrCorrected;
    outcome = properlyRejectedOrCorrected ? 'TN' : 'FP';
  }

  return {
    testCaseId: testCase.id,
    actualResponse,
    matchedConcepts,
    missedConcepts,
    triggeredForbidden,
    tokenPrecision,
    tokenRecall,
    tokenF1,
    conceptCoverage,
    predictedPositive,
    outcome,
    latencyMs,
    evaluatedVia,
    evaluatedAt: Date.now(),
  };
}

function calcClassificationRates(tp: number, fp: number, fn: number, tn: number) {
  const total = tp + fp + fn + tn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return { accuracy, precision, recall, f1Score };
}

export function computeSummaryMetrics(
  testCases: EvalTestCase[],
  resultsMap: Record<string, EvalCaseResult>
): EvalSummaryMetrics {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  let totalTokenF1 = 0;
  let totalCoverage = 0;
  let totalLatency = 0;
  let evaluatedCount = 0;

  const categoryBuckets = new Map<
    EvalDomainCategory,
    {
      label: string;
      tp: number;
      fp: number;
      fn: number;
      tn: number;
      tokenF1Sum: number;
      latencySum: number;
      count: number;
    }
  >();

  for (const tc of testCases) {
    const res = resultsMap[tc.id];
    if (!res) continue;

    evaluatedCount++;
    totalTokenF1 += res.tokenF1;
    totalCoverage += res.conceptCoverage;
    totalLatency += res.latencyMs;

    if (res.outcome === 'TP') tp++;
    else if (res.outcome === 'FP') fp++;
    else if (res.outcome === 'FN') fn++;
    else if (res.outcome === 'TN') tn++;

    const bucket = categoryBuckets.get(tc.category) || {
      label: tc.categoryLabel,
      tp: 0,
      fp: 0,
      fn: 0,
      tn: 0,
      tokenF1Sum: 0,
      latencySum: 0,
      count: 0,
    };

    bucket.count++;
    bucket.tokenF1Sum += res.tokenF1;
    bucket.latencySum += res.latencyMs;
    if (res.outcome === 'TP') bucket.tp++;
    else if (res.outcome === 'FP') bucket.fp++;
    else if (res.outcome === 'FN') bucket.fn++;
    else if (res.outcome === 'TN') bucket.tn++;

    categoryBuckets.set(tc.category, bucket);
  }

  const globalRates = calcClassificationRates(tp, fp, fn, tn);

  const byCategory: EvalCategoryBreakdown[] = Array.from(categoryBuckets.entries()).map(
    ([category, b]) => {
      const rates = calcClassificationRates(b.tp, b.fp, b.fn, b.tn);
      return {
        category,
        categoryLabel: b.label,
        total: b.count,
        tp: b.tp,
        fp: b.fp,
        fn: b.fn,
        tn: b.tn,
        accuracy: rates.accuracy,
        precision: rates.precision,
        recall: rates.recall,
        f1Score: rates.f1Score,
        avgTokenF1: b.count > 0 ? b.tokenF1Sum / b.count : 0,
        avgLatencyMs: b.count > 0 ? Math.round(b.latencySum / b.count) : 0,
      };
    }
  );

  return {
    total: evaluatedCount,
    tp,
    fp,
    fn,
    tn,
    accuracy: globalRates.accuracy,
    precision: globalRates.precision,
    recall: globalRates.recall,
    f1Score: globalRates.f1Score,
    macroTokenF1: evaluatedCount > 0 ? totalTokenF1 / evaluatedCount : 0,
    macroConceptCoverage: evaluatedCount > 0 ? totalCoverage / evaluatedCount : 0,
    avgLatencyMs: evaluatedCount > 0 ? Math.round(totalLatency / evaluatedCount) : 0,
    byCategory,
  };
}

export function computeFeedbackMetrics(feedbacks: ChatFeedbackEntry[]) {
  const total = feedbacks.length;
  const accurateCount = feedbacks.filter((f) => f.rating === 'accurate').length;
  const inaccurateCount = total - accurateCount;
  const userAccuracyRate = total > 0 ? accurateCount / total : 0;

  return {
    total,
    accurateCount,
    inaccurateCount,
    userAccuracyRate,
  };
}

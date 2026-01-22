// Cognitive Reflection Test (CRT) Scoring Logic
// Handles answer normalization and validation for free-text responses

import { type CRTItem, crtItems, type PriorExposure } from './crt-items';

export interface ItemResult {
  itemId: number;
  userAnswer: string;
  normalizedAnswer: string;
  correct: boolean;
  wasIntuitive: boolean;  // Did they give the intuitive wrong answer?
}

export interface CRTResults {
  totalCorrect: number;
  totalQuestions: number;
  percentile: number;
  reflectiveScore: number;    // Correct answers
  intuitiveScore: number;     // Intuitive wrong answers
  otherErrors: number;        // Non-intuitive wrong answers
  itemResults: ItemResult[];
  priorExposure: PriorExposure;
  completedAt: string;
}

/**
 * Normalize an answer for comparison.
 * Handles variations like "5", "5 cents", "$0.05", "five", etc.
 */
export function normalizeAnswer(answer: string): string {
  if (!answer) return '';

  let normalized = answer.toLowerCase().trim();

  // Remove common suffixes/prefixes
  normalized = normalized
    .replace(/\s*(cents?|minutes?|min|days?|students?|dollars?)\s*/gi, '')
    .replace(/^\$/, '')
    .replace(/^0*(\d)/, '$1')  // Remove leading zeros but keep at least one digit
    .trim();

  // Convert word numbers to digits for common cases
  const wordToNum: Record<string, string> = {
    'zero': '0',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
    'ten': '10',
    'eleven': '11',
    'twelve': '12',
    'thirteen': '13',
    'fourteen': '14',
    'fifteen': '15',
    'sixteen': '16',
    'seventeen': '17',
    'eighteen': '18',
    'nineteen': '19',
    'twenty': '20',
    'twenty-one': '21',
    'twenty one': '21',
    'twenty-two': '22',
    'twenty two': '22',
    'twenty-three': '23',
    'twenty three': '23',
    'twenty-four': '24',
    'twenty four': '24',
    'twenty-five': '25',
    'twenty five': '25',
    'twenty-six': '26',
    'twenty six': '26',
    'twenty-seven': '27',
    'twenty seven': '27',
    'twenty-eight': '28',
    'twenty eight': '28',
    'twenty-nine': '29',
    'twenty nine': '29',
    'thirty': '30',
    'forty': '40',
    'forty-seven': '47',
    'forty seven': '47',
    'fifty': '50',
    'sixty': '60',
    'seventy': '70',
    'eighty': '80',
    'ninety': '90',
    'hundred': '100',
    'one hundred': '100',
  };

  if (wordToNum[normalized]) {
    normalized = wordToNum[normalized];
  }

  // Handle decimal representations of cents (e.g., ".05" or "0.05" for 5 cents)
  // Also handle values like "0.05" that represent dollar amounts
  if (normalized.includes('.') && /^0?\.\d+$/.test(normalized)) {
    const decimalValue = parseFloat(normalized);
    if (!isNaN(decimalValue) && decimalValue < 1) {
      // Convert to cents if it looks like a dollar amount (less than $1)
      normalized = Math.round(decimalValue * 100).toString();
    }
  }

  return normalized;
}

/**
 * Check if an answer matches any of the acceptable variations.
 */
export function matchesAnswer(userAnswer: string, acceptableVariations: string[]): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);

  for (const variation of acceptableVariations) {
    const normalizedVariation = normalizeAnswer(variation);
    if (normalizedUser === normalizedVariation) {
      return true;
    }
  }

  return false;
}

/**
 * Score a single item response.
 */
export function scoreItem(item: CRTItem, userAnswer: string): ItemResult {
  const normalizedAnswer = normalizeAnswer(userAnswer);
  const correct = matchesAnswer(userAnswer, item.correctVariations);
  const wasIntuitive = !correct && matchesAnswer(userAnswer, item.intuitiveVariations);

  return {
    itemId: item.id,
    userAnswer,
    normalizedAnswer,
    correct,
    wasIntuitive,
  };
}

/**
 * Calculate all scores from responses.
 */
export function calculateCRTScores(
  responses: Record<number, string>,
  priorExposure: PriorExposure
): CRTResults {
  const itemResults: ItemResult[] = [];
  let totalCorrect = 0;
  let intuitiveScore = 0;
  let otherErrors = 0;

  for (const item of crtItems) {
    const userAnswer = responses[item.id] || '';
    const result = scoreItem(item, userAnswer);
    itemResults.push(result);

    if (result.correct) {
      totalCorrect++;
    } else if (result.wasIntuitive) {
      intuitiveScore++;
    } else if (userAnswer.trim() !== '') {
      otherErrors++;
    }
  }

  const totalQuestions = crtItems.length;
  const percentile = calculatePercentile(totalCorrect);

  return {
    totalCorrect,
    totalQuestions,
    percentile,
    reflectiveScore: totalCorrect,
    intuitiveScore,
    otherErrors,
    itemResults,
    priorExposure,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Calculate percentile based on CRT-7 norms.
 * Based on typical population distributions from research.
 * Reference: Toplak et al. (2014)
 */
export function calculatePercentile(score: number): number {
  // Approximate percentiles based on research norms
  // These are rough estimates; actual norms vary by population
  const percentileMap: Record<number, number> = {
    0: 10,   // ~10% score 0
    1: 25,   // ~25th percentile for 1 correct
    2: 40,   // ~40th percentile for 2 correct
    3: 55,   // ~55th percentile for 3 correct
    4: 70,   // ~70th percentile for 4 correct
    5: 82,   // ~82nd percentile for 5 correct
    6: 92,   // ~92nd percentile for 6 correct
    7: 98,   // ~98th percentile for 7 correct
  };

  return percentileMap[score] ?? 50;
}

/**
 * Get interpretation text based on score.
 */
export function getScoreInterpretation(score: number, total: number): string {
  const ratio = score / total;

  if (ratio >= 0.85) {
    return 'Exceptional Reflective Thinking';
  } else if (ratio >= 0.7) {
    return 'Strong Reflective Thinking';
  } else if (ratio >= 0.5) {
    return 'Moderate Reflective Thinking';
  } else if (ratio >= 0.3) {
    return 'Developing Reflective Thinking';
  } else {
    return 'Intuitive Thinking Style';
  }
}

/**
 * Serialize results to JSON for localStorage.
 */
export function serializeCRTResults(results: CRTResults): string {
  return JSON.stringify(results);
}

/**
 * Deserialize results from JSON.
 */
export function deserializeCRTResults(json: string): CRTResults | null {
  try {
    return JSON.parse(json) as CRTResults;
  } catch {
    return null;
  }
}

/**
 * Serialize responses to JSON for localStorage (for pause/resume).
 */
export function serializeCRTResponses(responses: Record<number, string>): string {
  return JSON.stringify(responses);
}

/**
 * Deserialize responses from JSON.
 */
export function deserializeCRTResponses(json: string): Record<number, string> | null {
  try {
    return JSON.parse(json) as Record<number, string>;
  } catch {
    return null;
  }
}

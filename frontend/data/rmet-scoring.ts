// RMET Scoring Logic
// Based on Baron-Cohen et al. (2001)
// Reference: Baron-Cohen, S., Wheelwright, S., Hill, J., Raste, Y., & Plumb, I. (2001).
// The "Reading the Mind in the Eyes" Test Revised Version.
// Journal of Child Psychology and Psychiatry, 42(2), 241-251.

import { type RMETItem, scoredItems } from './rmet-items';

export interface RMETResponse {
  itemId: number;
  selectedAnswer: string;
  responseTime?: number; // milliseconds
}

export interface RMETItemResult {
  itemId: number;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
  responseTime?: number;
}

export interface RMETResults {
  totalCorrect: number;
  totalQuestions: number;
  percentCorrect: number;
  percentile: number;
  interpretation: string;
  itemResults: RMETItemResult[];
  averageResponseTime?: number;
  completedAt: string;
}

// Check if a response is correct
export function isCorrect(item: RMETItem, selectedAnswer: string): boolean {
  return selectedAnswer.toLowerCase() === item.correctAnswer.toLowerCase();
}

// Calculate item result
export function calculateItemResult(
  item: RMETItem,
  response: RMETResponse
): RMETItemResult {
  return {
    itemId: item.id,
    selectedAnswer: response.selectedAnswer,
    correctAnswer: item.correctAnswer,
    correct: isCorrect(item, response.selectedAnswer),
    responseTime: response.responseTime,
  };
}

// Normative data from Baron-Cohen et al. (2001)
// General population: Mean = 26.2, SD = 3.6
// These norms are used to calculate percentiles
const NORM_MEAN = 26.2;
const NORM_SD = 3.6;

// Convert z-score to percentile using standard normal CDF approximation
function zToPercentile(z: number): number {
  // Approximation of the standard normal CDF
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);

  const t = 1.0 / (1.0 + p * absZ);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp((-absZ * absZ) / 2);

  const cdf = 0.5 * (1.0 + sign * y);
  return Math.round(cdf * 100);
}

// Calculate percentile based on normative data
export function calculatePercentile(totalCorrect: number): number {
  const z = (totalCorrect - NORM_MEAN) / NORM_SD;
  return zToPercentile(z);
}

// Get interpretation based on score
export function getInterpretation(totalCorrect: number): string {
  if (totalCorrect >= 30) {
    return 'Your score indicates above-average ability to recognize mental states from eye expressions. You may be particularly skilled at reading subtle emotional cues.';
  }
  if (totalCorrect >= 22) {
    return 'Your score falls within the typical range for adults. You demonstrate a normal ability to recognize mental states from eye expressions.';
  }
  if (totalCorrect >= 15) {
    return 'Your score is somewhat below the typical range. This may suggest some difficulty recognizing subtle mental states from eye expressions.';
  }
  return 'Your score is notably below the typical range. This pattern is sometimes associated with differences in social cognition, though many factors can influence test performance.';
}

// Get score level label
export function getScoreLevel(totalCorrect: number): string {
  if (totalCorrect >= 30) return 'High';
  if (totalCorrect >= 26) return 'Above Average';
  if (totalCorrect >= 22) return 'Average';
  if (totalCorrect >= 18) return 'Below Average';
  return 'Low';
}

// Calculate all results from responses
export function calculateResults(responses: RMETResponse[]): RMETResults {
  const itemResults: RMETItemResult[] = [];
  let totalCorrect = 0;
  let totalResponseTime = 0;
  let responsesWithTime = 0;

  for (const response of responses) {
    const item = scoredItems.find((i) => i.id === response.itemId);
    if (!item) continue;

    const result = calculateItemResult(item, response);
    itemResults.push(result);

    if (result.correct) {
      totalCorrect++;
    }

    if (response.responseTime !== undefined) {
      totalResponseTime += response.responseTime;
      responsesWithTime++;
    }
  }

  const totalQuestions = scoredItems.length;
  const percentCorrect = Math.round((totalCorrect / totalQuestions) * 100);
  const percentile = calculatePercentile(totalCorrect);
  const interpretation = getInterpretation(totalCorrect);

  const averageResponseTime =
    responsesWithTime > 0 ? Math.round(totalResponseTime / responsesWithTime) : undefined;

  return {
    totalCorrect,
    totalQuestions,
    percentCorrect,
    percentile,
    interpretation,
    itemResults,
    averageResponseTime,
    completedAt: new Date().toISOString(),
  };
}

// Serialize results to JSON for localStorage
export function serializeResults(results: RMETResults): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): RMETResults | null {
  try {
    return JSON.parse(json) as RMETResults;
  } catch {
    return null;
  }
}

// Serialize responses to JSON for localStorage (for pause/resume)
export function serializeResponses(responses: RMETResponse[]): string {
  return JSON.stringify(responses);
}

// Deserialize responses from JSON
export function deserializeResponses(json: string): RMETResponse[] | null {
  try {
    return JSON.parse(json) as RMETResponse[];
  } catch {
    return null;
  }
}

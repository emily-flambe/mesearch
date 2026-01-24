// MRMET Scoring Logic
// Based on Warrier, V., et al. (2024)
// Reference: Warrier, V., et al. (2024). Multiracial Reading the Mind in the Eyes Test (MRMET):
// An inclusive version of an influential measure. Behavior Research Methods.
// https://doi.org/10.3758/s13428-023-02323-x
//
// The MRMET has 37 scored items (vs 36 in original RMET)

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

// Normative data adapted for MRMET (37 items)
// Original RMET (36 items): Mean = 26.2, SD = 3.6 (Baron-Cohen et al., 2001)
// MRMET shows statistically indistinguishable reliability with RMET (Warrier et al., 2024)
// Scaled proportionally for 37 items: Mean ≈ 27.0, SD ≈ 3.7
const NORM_MEAN = 27.0;
const NORM_SD = 3.7;

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

// Get interpretation based on score (thresholds adjusted for 37 items)
export function getInterpretation(totalCorrect: number): string {
  if (totalCorrect >= 31) {
    return 'Your score indicates above-average ability to recognize mental states from eye expressions. You may be particularly skilled at reading subtle emotional cues.';
  }
  if (totalCorrect >= 23) {
    return 'Your score falls within the typical range for adults. You demonstrate a normal ability to recognize mental states from eye expressions.';
  }
  if (totalCorrect >= 16) {
    return 'Your score is somewhat below the typical range. This may suggest some difficulty recognizing subtle mental states from eye expressions.';
  }
  return 'Your score is notably below the typical range. This pattern is sometimes associated with differences in social cognition, though many factors can influence test performance.';
}

// Get score level label (thresholds adjusted for 37 items)
export function getScoreLevel(totalCorrect: number): string {
  if (totalCorrect >= 31) return 'High';
  if (totalCorrect >= 27) return 'Above Average';
  if (totalCorrect >= 23) return 'Average';
  if (totalCorrect >= 19) return 'Below Average';
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

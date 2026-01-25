// RWA-VSA Scoring Logic
// Based on Bizumic & Duckitt (2018) Very Short Authoritarianism Scale
// Reference: Journal of Social and Political Psychology

import {
  type Dimension,
  type Item,
  items,
  dimensions,
  getItemsForDimension,
  dimensionInfo,
} from './rwa-items';

export interface Response {
  itemId: number;
  value: number; // -4 to +4 scale (Very strongly disagree to Very strongly agree)
}

export interface DimensionScore {
  dimension: Dimension;
  rawScore: number; // Sum of transformed item scores for dimension
  meanScore: number; // Average of transformed item scores (1-9 range)
}

export interface RWAResults {
  dimensions: DimensionScore[];
  rwaTotal: number; // Sum of all transformed scores (range 6-54)
  interpretation: string;
  completedAt: string;
  totalQuestions: number;
}

// Score an item: reverse items have sign flipped, then all are transformed to 1-9 scale
// Original scale: -4 to +4
// For reversed items: multiply by -1 (flip sign)
// Transform: add 5 to shift from -4..+4 to 1..9
export function scoreItem(item: Item, value: number): number {
  let scored = value;
  if (item.isReversed) {
    scored = 0 - value; // Flip sign for reversed items
  }
  // Transform to positive scale (1-9)
  return scored + 5;
}

// Calculate mean score from array of scores
export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Get items for a specific dimension (re-exported for convenience)
export { getItemsForDimension };

// Calculate dimension score
export function calculateDimensionScore(
  dimension: Dimension,
  responses: Map<number, number>
): DimensionScore {
  const dimItems = getItemsForDimension(dimension);
  const scores: number[] = [];

  for (const item of dimItems) {
    const value = responses.get(item.id);
    if (value !== undefined) {
      scores.push(scoreItem(item, value));
    }
  }

  const rawScore = scores.reduce((sum, s) => sum + s, 0);
  const meanScore = calculateMean(scores);

  return {
    dimension,
    rawScore,
    meanScore,
  };
}

// Get interpretation based on total RWA score
// Range: 6-54
// Low: 6-18, Below Average: 18-30, Above Average: 30-42, High: 42-54
export function getInterpretation(rwaTotal: number): string {
  if (rwaTotal <= 18) return 'Low';
  if (rwaTotal <= 30) return 'Below Average';
  if (rwaTotal <= 42) return 'Above Average';
  return 'High';
}

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): RWAResults {
  const responseMap = new Map<number, number>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const dimensionScores = dimensions.map((dimension) =>
    calculateDimensionScore(dimension, responseMap)
  );

  // Calculate total RWA score (sum of all transformed item scores)
  const rwaTotal = dimensionScores.reduce((sum, ds) => sum + ds.rawScore, 0);
  const interpretation = getInterpretation(rwaTotal);

  return {
    dimensions: dimensionScores,
    rwaTotal,
    interpretation,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Get description based on dimension and score level
export function getDimensionDescription(
  dimension: Dimension,
  meanScore: number
): string {
  const info = dimensionInfo[dimension];
  // Mean score range is 1-9, midpoint is 5
  if (meanScore >= 5) {
    return info.highDescription;
  }
  return info.lowDescription;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: RWAResults): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): RWAResults | null {
  try {
    return JSON.parse(json) as RWAResults;
  } catch {
    return null;
  }
}

// Serialize responses to JSON for localStorage (for pause/resume)
export function serializeResponses(responses: Response[]): string {
  return JSON.stringify(responses);
}

// Deserialize responses from JSON
export function deserializeResponses(json: string): Response[] | null {
  try {
    return JSON.parse(json) as Response[];
  } catch {
    return null;
  }
}

// SDO7 Scoring Logic
// Based on Ho et al. (2015) SDO7 Scale
// Reference: Journal of Personality and Social Psychology, 109(6), 1003-1028

import {
  type Dimension,
  type Item,
  items,
  dimensions,
  getItemsForDimension,
  dimensionInfo,
} from './sdo7-items';

export interface Response {
  itemId: number;
  value: number; // 1-7 Likert scale (strongly oppose to strongly favor)
}

export interface DimensionScore {
  dimension: Dimension;
  rawScore: number; // Sum of 8 items (after reverse scoring)
  meanScore: number; // 1-7 scale
}

export interface SDO7Results {
  dimensions: DimensionScore[];
  sdoTotal: number; // Mean of all 16 items
  completedAt: string;
  totalQuestions: number;
}

// Apply reverse scoring if needed
// For reversed items: (8 - response) transforms the scale
// e.g., 1 -> 7, 2 -> 6, 3 -> 5, 4 -> 4, 5 -> 3, 6 -> 2, 7 -> 1
export function scoreItem(item: Item, value: number): number {
  if (item.isReversed) {
    return 8 - value;
  }
  return value;
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
  const dimensionItems = getItemsForDimension(dimension);
  const scores: number[] = [];

  for (const item of dimensionItems) {
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

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): SDO7Results {
  const responseMap = new Map<number, number>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const dimensionScores = dimensions.map((dimension) =>
    calculateDimensionScore(dimension, responseMap)
  );

  // Calculate total SDO as mean of all items (after reverse scoring)
  const allScores: number[] = [];
  for (const item of items) {
    const value = responseMap.get(item.id);
    if (value !== undefined) {
      allScores.push(scoreItem(item, value));
    }
  }
  const sdoTotal = calculateMean(allScores);

  return {
    dimensions: dimensionScores,
    sdoTotal,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Interpretation thresholds based on the 1-7 scale
// These thresholds provide meaningful categories for interpretation
export type InterpretationLevel =
  | 'very-low'
  | 'low'
  | 'moderate'
  | 'moderately-high'
  | 'high';

export function getInterpretationLevel(meanScore: number): InterpretationLevel {
  if (meanScore < 2) return 'very-low';
  if (meanScore < 3) return 'low';
  if (meanScore < 4) return 'moderate';
  if (meanScore < 5) return 'moderately-high';
  return 'high';
}

export function getInterpretationLabel(level: InterpretationLevel): string {
  switch (level) {
    case 'very-low':
      return 'Very Low';
    case 'low':
      return 'Low';
    case 'moderate':
      return 'Moderate';
    case 'moderately-high':
      return 'Moderately High';
    case 'high':
      return 'High';
  }
}

export function getInterpretationDescription(
  dimension: Dimension | 'total',
  level: InterpretationLevel
): string {
  if (dimension === 'total') {
    switch (level) {
      case 'very-low':
        return 'You strongly favor group-based equality and reject hierarchical structures between social groups.';
      case 'low':
        return 'You generally favor equality between groups and are skeptical of social hierarchies.';
      case 'moderate':
        return 'You have mixed views on group-based hierarchy, sometimes accepting and sometimes rejecting it depending on context.';
      case 'moderately-high':
        return 'You tend to accept some degree of group-based hierarchy and may be skeptical of efforts to equalize groups.';
      case 'high':
        return 'You tend to accept or support group-based hierarchies and may oppose efforts toward group equality.';
    }
  }

  const info = dimensionInfo[dimension];
  if (level === 'very-low' || level === 'low') {
    return info.lowDescription;
  }
  return info.highDescription;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: SDO7Results): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): SDO7Results | null {
  try {
    return JSON.parse(json) as SDO7Results;
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

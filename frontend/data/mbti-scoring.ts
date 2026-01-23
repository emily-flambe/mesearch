// MBTI Scoring Logic
// Based on Open Extended Jungian Type Scales (OEJTS) 1.2
// Reference: https://openpsychometrics.org/tests/OEJTS/

import {
  type Dimension,
  type Pole,
  type Item,
  items,
  dimensions,
  dimensionInfo,
} from './mbti-items';

export interface Response {
  itemId: number;
  value: number; // 1-5 scale: 1 = left option, 5 = right option
}

export interface DimensionScore {
  dimension: Dimension;
  leftScore: number; // Sum of scores toward left pole (E, S, T, J)
  rightScore: number; // Sum of scores toward right pole (I, N, F, P)
  percentage: number; // 0-100 where 0 = fully left, 100 = fully right
  preference: Pole; // The dominant pole
  confidence: 'slight' | 'moderate' | 'clear' | 'very clear';
}

export interface MBTIResults {
  type: string; // e.g., "INTJ"
  dimensions: DimensionScore[];
  completedAt: string;
  totalQuestions: number;
}

// Get items for a specific dimension
export function getItemsForDimension(dimension: Dimension): Item[] {
  return items.filter((item) => item.dimension === dimension);
}

// Score an individual item
// Returns contribution toward right pole (I, N, F, P)
// Value 1 = strongly left (contribute 0 to right)
// Value 5 = strongly right (contribute 4 to right)
export function scoreItem(value: number): number {
  // Convert 1-5 scale to 0-4 contribution toward right pole
  return value - 1;
}

// Calculate dimension score
export function calculateDimensionScore(
  dimension: Dimension,
  responses: Map<number, number>
): DimensionScore {
  const dimItems = getItemsForDimension(dimension);
  const info = dimensionInfo[dimension];

  let rightScoreSum = 0;
  let answeredCount = 0;

  for (const item of dimItems) {
    const value = responses.get(item.id);
    if (value !== undefined) {
      rightScoreSum += scoreItem(value);
      answeredCount++;
    }
  }

  // Maximum possible score toward right pole is 4 * number of items = 32
  // Maximum possible score toward left pole is also 32 (when all values are 1)
  const maxScore = answeredCount * 4;
  const leftScoreSum = maxScore - rightScoreSum;

  // Calculate percentage (0 = fully left, 100 = fully right)
  const percentage = maxScore > 0 ? Math.round((rightScoreSum / maxScore) * 100) : 50;

  // Determine preference
  const preference = percentage >= 50 ? info.rightPole.code : info.leftPole.code;

  // Determine confidence based on how far from 50%
  const distanceFrom50 = Math.abs(percentage - 50);
  let confidence: DimensionScore['confidence'];
  if (distanceFrom50 <= 10) {
    confidence = 'slight';
  } else if (distanceFrom50 <= 20) {
    confidence = 'moderate';
  } else if (distanceFrom50 <= 35) {
    confidence = 'clear';
  } else {
    confidence = 'very clear';
  }

  return {
    dimension,
    leftScore: leftScoreSum,
    rightScore: rightScoreSum,
    percentage,
    preference,
    confidence,
  };
}

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): MBTIResults {
  const responseMap = new Map<number, number>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const dimensionScores = dimensions.map((dimension) =>
    calculateDimensionScore(dimension, responseMap)
  );

  // Build type string from preferences
  const type = dimensionScores.map((ds) => ds.preference).join('');

  return {
    type,
    dimensions: dimensionScores,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Get confidence description
export function getConfidenceDescription(confidence: DimensionScore['confidence']): string {
  switch (confidence) {
    case 'slight':
      return 'Your preference is very slight and may vary depending on context.';
    case 'moderate':
      return 'You have a moderate preference in this area.';
    case 'clear':
      return 'You have a clear preference in this area.';
    case 'very clear':
      return 'You have a very clear and consistent preference in this area.';
  }
}

// Get pole description based on dimension and preference
export function getPoleDescription(dimension: Dimension, pole: Pole): string {
  const info = dimensionInfo[dimension];
  if (pole === info.leftPole.code) {
    return info.leftPole.description;
  }
  return info.rightPole.description;
}

// Get pole name
export function getPoleName(dimension: Dimension, pole: Pole): string {
  const info = dimensionInfo[dimension];
  if (pole === info.leftPole.code) {
    return info.leftPole.name;
  }
  return info.rightPole.name;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: MBTIResults): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): MBTIResults | null {
  try {
    return JSON.parse(json) as MBTIResults;
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

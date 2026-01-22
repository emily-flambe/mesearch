// ECR Scoring Logic
// Based on ECR-R/ECR-RS scoring methodology
// Reference: https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm

import {
  type Dimension,
  type Item,
  type LikertValue,
  items,
  dimensions,
  getItemsForDimension,
  dimensionInfo,
} from './ecr-items';

export interface Response {
  itemId: number;
  value: LikertValue;
}

export interface DimensionScore {
  dimension: Dimension;
  rawScore: number;
  meanScore: number; // 1-7 scale
}

// Attachment style derived from 2D plot (for educational purposes only)
export type AttachmentStyle =
  | 'secure'
  | 'anxious-preoccupied'
  | 'dismissive-avoidant'
  | 'fearful-avoidant';

export interface AttachmentStyleInfo {
  code: AttachmentStyle;
  name: string;
  description: string;
  anxietyLevel: 'low' | 'high';
  avoidanceLevel: 'low' | 'high';
}

export const attachmentStyleInfo: Record<AttachmentStyle, AttachmentStyleInfo> = {
  secure: {
    code: 'secure',
    name: 'Secure',
    description:
      'Comfortable with intimacy and interdependence. Generally feels worthy of love and trusts that others will be responsive.',
    anxietyLevel: 'low',
    avoidanceLevel: 'low',
  },
  'anxious-preoccupied': {
    code: 'anxious-preoccupied',
    name: 'Anxious-Preoccupied',
    description:
      'Desires close relationships but worries about rejection and whether others truly care. May seek high levels of closeness and reassurance.',
    anxietyLevel: 'high',
    avoidanceLevel: 'low',
  },
  'dismissive-avoidant': {
    code: 'dismissive-avoidant',
    name: 'Dismissive-Avoidant',
    description:
      'Values independence and self-reliance. May downplay the importance of close relationships and prefer emotional distance.',
    anxietyLevel: 'low',
    avoidanceLevel: 'high',
  },
  'fearful-avoidant': {
    code: 'fearful-avoidant',
    name: 'Fearful-Avoidant',
    description:
      'Desires close relationships but fears intimacy and rejection. May experience conflicting desires for closeness and independence.',
    anxietyLevel: 'high',
    avoidanceLevel: 'high',
  },
};

export interface ECRResults {
  anxiety: DimensionScore;
  avoidance: DimensionScore;
  suggestedStyle: AttachmentStyle; // For educational purposes only
  disclaimer: string; // About not categorizing
  completedAt: string;
  totalQuestions: number;
}

// The standard disclaimer about dimensional interpretation
export const DIMENSIONAL_DISCLAIMER =
  'Important: Attachment is best understood as existing on continuous dimensions rather than discrete categories. ' +
  'The suggested attachment style is provided for educational context only. Your position on the anxiety and avoidance ' +
  'dimensions provides a more accurate and nuanced picture of your attachment patterns. Research shows that people can ' +
  'and do change their attachment patterns over time, particularly through secure relationships and personal growth.';

// Apply reverse scoring if needed
// For ECR: reverse scoring formula is (8 - response) for a 7-point scale
export function scoreItem(item: Item, value: LikertValue): number {
  if (item.isReversed) {
    return 8 - value;
  }
  return value;
}

// Calculate mean score from responses
export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Get item by ID
export function getItemById(id: number): Item | undefined {
  return items.find((item) => item.id === id);
}

// Calculate dimension score
export function calculateDimensionScore(
  dimension: Dimension,
  responses: Map<number, LikertValue>
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

// Determine suggested attachment style based on dimension scores
// Using midpoint of 4 on the 7-point scale as the threshold
export function determineSuggestedStyle(
  anxietyMean: number,
  avoidanceMean: number
): AttachmentStyle {
  const midpoint = 4;
  const highAnxiety = anxietyMean >= midpoint;
  const highAvoidance = avoidanceMean >= midpoint;

  if (!highAnxiety && !highAvoidance) {
    return 'secure';
  } else if (highAnxiety && !highAvoidance) {
    return 'anxious-preoccupied';
  } else if (!highAnxiety && highAvoidance) {
    return 'dismissive-avoidant';
  } else {
    return 'fearful-avoidant';
  }
}

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): ECRResults {
  const responseMap = new Map<number, LikertValue>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const anxiety = calculateDimensionScore('anxiety', responseMap);
  const avoidance = calculateDimensionScore('avoidance', responseMap);

  const suggestedStyle = determineSuggestedStyle(anxiety.meanScore, avoidance.meanScore);

  return {
    anxiety,
    avoidance,
    suggestedStyle,
    disclaimer: DIMENSIONAL_DISCLAIMER,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Get interpretation text based on mean score
export function getMeanScoreInterpretation(meanScore: number): string {
  if (meanScore >= 6) return 'Very High';
  if (meanScore >= 5) return 'High';
  if (meanScore >= 4) return 'Moderate-High';
  if (meanScore >= 3) return 'Moderate-Low';
  if (meanScore >= 2) return 'Low';
  return 'Very Low';
}

// Get description based on dimension and score level
export function getDimensionDescription(
  dimension: Dimension,
  meanScore: number
): string {
  const info = dimensionInfo[dimension];
  // Using midpoint of 4 as threshold
  if (meanScore >= 4) {
    return info.highDescription;
  }
  return info.lowDescription;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: ECRResults): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): ECRResults | null {
  try {
    return JSON.parse(json) as ECRResults;
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

// Re-export dimension info for convenience
export { dimensionInfo, dimensions };

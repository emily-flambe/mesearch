// Enneagram scoring functions

import { enneagramItems, type LikertValue } from './enneagram-items';
import { getTypeById } from './enneagram-types';

export type TypeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface TypeScore {
  type: TypeNumber;
  rawScore: number;
  maxScore: number;
  percentage: number;
}

export interface EnneagramResult {
  scores: TypeScore[];
  primaryType: TypeNumber;
  wing: TypeNumber;
  wingLabel: string;
}

// Calculate raw scores per type from responses
export function calculateRawScores(
  responses: Record<number, LikertValue>
): Map<TypeNumber, number> {
  const scores = new Map<TypeNumber, number>();

  // Initialize all types to 0
  for (let i = 1; i <= 9; i++) {
    scores.set(i as TypeNumber, 0);
  }

  // Sum up responses for each type
  for (const item of enneagramItems) {
    const response = responses[item.id];
    if (response !== undefined) {
      const currentScore = scores.get(item.type) || 0;
      scores.set(item.type, currentScore + response);
    }
  }

  return scores;
}

// Calculate scores with percentages
export function calculateTypeScores(
  responses: Record<number, LikertValue>
): TypeScore[] {
  const rawScores = calculateRawScores(responses);
  const itemsPerType = 4;
  const maxScorePerType = itemsPerType * 5; // 4 items * max 5 points = 20

  const scores: TypeScore[] = [];

  for (let i = 1; i <= 9; i++) {
    const type = i as TypeNumber;
    const rawScore = rawScores.get(type) || 0;
    scores.push({
      type,
      rawScore,
      maxScore: maxScorePerType,
      percentage: Math.round((rawScore / maxScorePerType) * 100),
    });
  }

  return scores;
}

// Identify the primary (dominant) type
export function getPrimaryType(scores: TypeScore[]): TypeNumber {
  let highest = scores[0];
  for (const score of scores) {
    if (score.rawScore > highest.rawScore) {
      highest = score;
    }
  }
  return highest.type;
}

// Get the wing (adjacent type with higher score)
export function getWing(primaryType: TypeNumber, scores: TypeScore[]): TypeNumber {
  const typeInfo = getTypeById(primaryType);
  const [wing1, wing2] = typeInfo.wings;

  const wing1Score = scores.find((s) => s.type === wing1)?.rawScore || 0;
  const wing2Score = scores.find((s) => s.type === wing2)?.rawScore || 0;

  return wing1Score >= wing2Score ? wing1 : wing2;
}

// Format wing label (e.g., "4w5")
export function formatWingLabel(primaryType: TypeNumber, wing: TypeNumber): string {
  return `${primaryType}w${wing}`;
}

// Complete scoring function
export function calculateEnneagramResult(
  responses: Record<number, LikertValue>
): EnneagramResult {
  const scores = calculateTypeScores(responses);
  const primaryType = getPrimaryType(scores);
  const wing = getWing(primaryType, scores);
  const wingLabel = formatWingLabel(primaryType, wing);

  return {
    scores,
    primaryType,
    wing,
    wingLabel,
  };
}

// Sort scores by percentage (highest first)
export function sortScoresByPercentage(scores: TypeScore[]): TypeScore[] {
  return [...scores].sort((a, b) => b.percentage - a.percentage);
}

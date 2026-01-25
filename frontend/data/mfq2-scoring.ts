// MFQ-2 Scoring Logic
// Based on the Moral Foundations Questionnaire 2 scoring methodology
// Reference: Atari et al. (2023). Morality beyond the WEIRD.
// Journal of Personality and Social Psychology, 125(5), 1157-1188.

import {
  type Foundation,
  type Item,
  items,
  foundations,
  foundationInfo,
  getItemsForFoundation,
  individualizingFoundations,
  bindingFoundations,
} from './mfq2-items';

export interface Response {
  itemId: number;
  value: number; // 0-4 Likert scale
}

export interface FoundationScore {
  foundation: Foundation;
  rawScore: number;
  meanScore: number; // 0-4 scale
}

export interface HigherOrderScore {
  name: 'Individualizing' | 'Binding';
  meanScore: number;
  foundations: Foundation[];
}

export interface MFQ2Results {
  foundations: FoundationScore[];
  higherOrder: HigherOrderScore[];
  completedAt: string;
  totalQuestions: number;
}

// MFQ-2 has NO reverse-scored items - all items scored directly
export function scoreItem(item: Item, value: number): number {
  return value;
}

// Calculate mean score from responses
export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Calculate foundation score
export function calculateFoundationScore(
  foundation: Foundation,
  responses: Map<number, number>
): FoundationScore {
  const foundationItems = getItemsForFoundation(foundation);
  const scores: number[] = [];

  for (const item of foundationItems) {
    const value = responses.get(item.id);
    if (value !== undefined) {
      scores.push(scoreItem(item, value));
    }
  }

  const rawScore = scores.reduce((sum, s) => sum + s, 0);
  const meanScore = calculateMean(scores);

  return {
    foundation,
    rawScore,
    meanScore,
  };
}

// Calculate higher-order scores (Individualizing and Binding)
export function calculateHigherOrderScores(
  foundationScores: FoundationScore[]
): HigherOrderScore[] {
  // Individualizing = mean of Care and Equality
  const individualizingScores = foundationScores
    .filter((s) => individualizingFoundations.includes(s.foundation))
    .map((s) => s.meanScore);
  const individualizingMean = calculateMean(individualizingScores);

  // Binding = mean of Proportionality, Loyalty, Authority, and Purity
  const bindingScores = foundationScores
    .filter((s) => bindingFoundations.includes(s.foundation))
    .map((s) => s.meanScore);
  const bindingMean = calculateMean(bindingScores);

  return [
    {
      name: 'Individualizing',
      meanScore: individualizingMean,
      foundations: individualizingFoundations,
    },
    {
      name: 'Binding',
      meanScore: bindingMean,
      foundations: bindingFoundations,
    },
  ];
}

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): MFQ2Results {
  const responseMap = new Map<number, number>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const foundationScores = foundations.map((foundation) =>
    calculateFoundationScore(foundation, responseMap)
  );

  const higherOrderScores = calculateHigherOrderScores(foundationScores);

  return {
    foundations: foundationScores,
    higherOrder: higherOrderScores,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Get interpretation text based on mean score (0-4 scale)
export function getScoreInterpretation(meanScore: number): string {
  if (meanScore >= 3.5) return 'Very High';
  if (meanScore >= 2.75) return 'High';
  if (meanScore >= 2.0) return 'Moderate';
  if (meanScore >= 1.25) return 'Low';
  return 'Very Low';
}

// Get description based on foundation and score level
export function getFoundationDescription(
  foundation: Foundation,
  meanScore: number
): string {
  const info = foundationInfo[foundation];
  const level = getScoreInterpretation(meanScore);

  if (meanScore >= 2.5) {
    return `You place relatively high importance on ${info.name.toLowerCase()} in your moral reasoning.`;
  }
  return `You place relatively less importance on ${info.name.toLowerCase()} in your moral reasoning.`;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: MFQ2Results): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): MFQ2Results | null {
  try {
    return JSON.parse(json) as MFQ2Results;
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

// SD3 Scoring Logic
// Based on Jones & Paulhus (2014) Short Dark Triad
// Reference: Assessment, 21(1), 28-41

import { type DarkTrait, type Item, items, traits, getItemsForTrait, traitInfo } from './sd3-items';

export interface Response {
  itemId: number;
  value: number; // 1-5 Likert scale (strongly disagree to strongly agree)
}

export interface TraitScore {
  trait: DarkTrait;
  rawScore: number; // Sum of 9 items (after reverse scoring)
  meanScore: number; // 1-5 scale
  percentile: number;
  level: 'low' | 'average' | 'high';
}

export interface SD3Results {
  traits: TraitScore[];
  completedAt: string;
  totalQuestions: number;
}

// Apply reverse scoring if needed
// Reverse scoring: (6 - response) for reversed items
export function scoreItem(item: Item, value: number): number {
  if (item.isReversed) {
    return 6 - value;
  }
  return value;
}

// Calculate mean score from array of scores
export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Get items for a specific trait (re-exported for convenience)
export { getItemsForTrait };

// Calculate trait score
export function calculateTraitScore(
  trait: DarkTrait,
  responses: Map<number, number>
): TraitScore {
  const traitItems = getItemsForTrait(trait);
  const scores: number[] = [];

  for (const item of traitItems) {
    const value = responses.get(item.id);
    if (value !== undefined) {
      scores.push(scoreItem(item, value));
    }
  }

  const rawScore = scores.reduce((sum, s) => sum + s, 0);
  const meanScore = calculateMean(scores);
  const percentile = calculateTraitPercentile(trait, meanScore);
  const level = getTraitLevel(trait, meanScore);

  return {
    trait,
    rawScore,
    meanScore,
    percentile,
    level,
  };
}

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): SD3Results {
  const responseMap = new Map<number, number>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const traitScores = traits.map((trait) => calculateTraitScore(trait, responseMap));

  return {
    traits: traitScores,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Population norms from the issue specification
// | Trait | Low | Average | High |
// | Machiavellianism | <2.1 | 2.1-3.9 | >3.9 |
// | Narcissism | <2.0 | 2.0-3.7 | >3.7 |
// | Psychopathy | <1.2 | 1.2-2.8 | >2.8 |

const traitNorms: Record<DarkTrait, { mean: number; sd: number; lowCutoff: number; highCutoff: number }> = {
  machiavellianism: { mean: 3.0, sd: 0.75, lowCutoff: 2.1, highCutoff: 3.9 },
  narcissism: { mean: 2.85, sd: 0.70, lowCutoff: 2.0, highCutoff: 3.7 },
  psychopathy: { mean: 2.0, sd: 0.65, lowCutoff: 1.2, highCutoff: 2.8 },
};

// Get trait level based on cutoffs from population norms
export function getTraitLevel(trait: DarkTrait, meanScore: number): 'low' | 'average' | 'high' {
  const norm = traitNorms[trait];
  if (meanScore < norm.lowCutoff) return 'low';
  if (meanScore > norm.highCutoff) return 'high';
  return 'average';
}

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
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp((-absZ * absZ) / 2);

  const cdf = 0.5 * (1.0 + sign * y);
  return Math.round(cdf * 100);
}

// Calculate percentile for a trait score
export function calculateTraitPercentile(trait: DarkTrait, meanScore: number): number {
  const norm = traitNorms[trait];
  const z = (meanScore - norm.mean) / norm.sd;
  return zToPercentile(z);
}

// Get interpretation text based on percentile
export function getPercentileInterpretation(percentile: number): string {
  if (percentile >= 85) return 'Very High';
  if (percentile >= 70) return 'High';
  if (percentile >= 55) return 'Above Average';
  if (percentile >= 45) return 'Average';
  if (percentile >= 30) return 'Below Average';
  if (percentile >= 15) return 'Low';
  return 'Very Low';
}

// Get description based on trait and score level
export function getTraitDescription(trait: DarkTrait, percentile: number): string {
  const info = traitInfo[trait];
  if (percentile >= 50) {
    return info.highDescription;
  }
  return info.lowDescription;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: SD3Results): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): SD3Results | null {
  try {
    return JSON.parse(json) as SD3Results;
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

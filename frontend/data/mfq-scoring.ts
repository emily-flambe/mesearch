// MFQ Scoring Logic
// Based on the Moral Foundations Questionnaire scoring methodology
// Reference: https://moralfoundations.org/questionnaires/

import {
  type Foundation,
  type Item,
  items,
  scoredFoundations,
  foundationInfo,
  getItemsForFoundation,
} from './mfq-items';

export interface Response {
  itemId: number;
  value: number; // 0-5 Likert scale (Not at all relevant/Strongly disagree to Extremely relevant/Strongly agree)
}

export interface FoundationScore {
  foundation: Foundation;
  rawScore: number;
  meanScore: number; // 0-5 scale
  percentile: number; // Based on population norms
}

export interface MFQResults {
  foundations: FoundationScore[];
  profile: string; // Brief interpretation
  completedAt: string;
  totalQuestions: number;
}

// Apply reverse scoring if needed
// For MFQ, standard scoring: value stays as is (0-5 scale)
// Reverse scoring: (5 - value) for reversed items
export function scoreItem(item: Item, value: number): number {
  if (item.isReversed) {
    return 5 - value;
  }
  return value;
}

// Calculate mean score from responses
export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Get items for a specific foundation
export function getItemsForFoundationFromList(foundation: Foundation): Item[] {
  return items.filter((item) => item.foundation === foundation);
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
    percentile: calculateFoundationPercentile(foundation, meanScore),
  };
}

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): MFQResults {
  const responseMap = new Map<number, number>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const foundationScores = scoredFoundations.map((foundation) =>
    calculateFoundationScore(foundation, responseMap)
  );

  return {
    foundations: foundationScores,
    profile: generateProfile(foundationScores),
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Population norms based on MFQ research
// These are approximate values based on large-scale studies
// Source: YourMorals.org data and published research
const foundationNorms: Record<Foundation, { mean: number; sd: number }> = {
  care: { mean: 3.69, sd: 0.74 },
  fairness: { mean: 3.59, sd: 0.73 },
  loyalty: { mean: 2.53, sd: 0.87 },
  authority: { mean: 2.79, sd: 0.89 },
  purity: { mean: 2.36, sd: 1.02 },
  liberty: { mean: 3.20, sd: 0.85 }, // Estimated, as liberty wasn't in original MFQ-30
};

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
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ / 2);

  const cdf = 0.5 * (1.0 + sign * y);
  return Math.round(cdf * 100);
}

// Calculate percentile for a foundation score
export function calculateFoundationPercentile(
  foundation: Foundation,
  meanScore: number
): number {
  const norm = foundationNorms[foundation];
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

// Get description based on foundation and score level
export function getFoundationDescription(
  foundation: Foundation,
  percentile: number
): string {
  const info = foundationInfo[foundation];
  const level = getPercentileInterpretation(percentile);

  if (percentile >= 50) {
    return `You place relatively high importance on ${info.concernsWith.toLowerCase()}.`;
  }
  return `You place relatively less importance on ${info.concernsWith.toLowerCase()}.`;
}

// Generate a brief profile summary
function generateProfile(scores: FoundationScore[]): string {
  // Sort by mean score to find highest and lowest
  const sorted = [...scores].sort((a, b) => b.meanScore - a.meanScore);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  const highestName = foundationInfo[highest.foundation].name.split('/')[0];
  const lowestName = foundationInfo[lowest.foundation].name.split('/')[0];

  // Classify as individualizing-dominant or binding-dominant
  const individualizingScore = (
    (scores.find(s => s.foundation === 'care')?.meanScore || 0) +
    (scores.find(s => s.foundation === 'fairness')?.meanScore || 0)
  ) / 2;

  const bindingScore = (
    (scores.find(s => s.foundation === 'loyalty')?.meanScore || 0) +
    (scores.find(s => s.foundation === 'authority')?.meanScore || 0) +
    (scores.find(s => s.foundation === 'purity')?.meanScore || 0)
  ) / 3;

  let profileType: string;
  if (individualizingScore > bindingScore + 0.5) {
    profileType = 'Your moral profile emphasizes individualizing foundations (Care and Fairness), focusing on individual rights and welfare.';
  } else if (bindingScore > individualizingScore + 0.5) {
    profileType = 'Your moral profile emphasizes binding foundations (Loyalty, Authority, and Purity), focusing on group cohesion and tradition.';
  } else {
    profileType = 'Your moral profile shows a balance between individualizing foundations (Care, Fairness) and binding foundations (Loyalty, Authority, Purity).';
  }

  return `Your strongest moral foundation is ${highestName}, and ${lowestName} is relatively less emphasized. ${profileType}`;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: MFQResults): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): MFQResults | null {
  try {
    return JSON.parse(json) as MFQResults;
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

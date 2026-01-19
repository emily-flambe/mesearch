// Big Five Scoring Logic
// Based on IPIP-NEO-120 scoring methodology
// Reference: https://ipip.ori.org/newScoringInstructions.htm

import {
  type Dimension,
  type Facet,
  type Item,
  items,
  dimensions,
  getFacetsForDimension,
  dimensionInfo,
  facetInfo,
} from './big-five-items';

export interface Response {
  itemId: number;
  value: number; // 1-5 Likert scale
}

export interface FacetScore {
  facet: Facet;
  rawScore: number;
  meanScore: number;
  percentile: number;
}

export interface DimensionScore {
  dimension: Dimension;
  rawScore: number;
  meanScore: number;
  percentile: number;
  facets: FacetScore[];
}

export interface BigFiveResults {
  dimensions: DimensionScore[];
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

// Calculate mean score from responses
export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Get items for a specific facet
export function getItemsForFacet(facet: Facet): Item[] {
  return items.filter((item) => item.facet === facet);
}

// Get items for a specific dimension
export function getItemsForDimension(dimension: Dimension): Item[] {
  return items.filter((item) => item.dimension === dimension);
}

// Calculate facet score
export function calculateFacetScore(
  facet: Facet,
  responses: Map<number, number>
): FacetScore {
  const facetItems = getItemsForFacet(facet);
  const scores: number[] = [];

  for (const item of facetItems) {
    const value = responses.get(item.id);
    if (value !== undefined) {
      scores.push(scoreItem(item, value));
    }
  }

  const rawScore = scores.reduce((sum, s) => sum + s, 0);
  const meanScore = calculateMean(scores);

  return {
    facet,
    rawScore,
    meanScore,
    percentile: calculateFacetPercentile(facet, meanScore),
  };
}

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

  // Calculate facet scores
  const facets = getFacetsForDimension(dimension).map((facet) =>
    calculateFacetScore(facet, responses)
  );

  return {
    dimension,
    rawScore,
    meanScore,
    percentile: calculateDimensionPercentile(dimension, meanScore),
    facets,
  };
}

// Calculate all scores from responses
export function calculateAllScores(responses: Response[]): BigFiveResults {
  const responseMap = new Map<number, number>();
  responses.forEach((r) => responseMap.set(r.itemId, r.value));

  const dimensionScores = dimensions.map((dimension) =>
    calculateDimensionScore(dimension, responseMap)
  );

  return {
    dimensions: dimensionScores,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Percentile norms based on IPIP norms
// Source: https://ipip.ori.org/newNorms.htm
// These are approximate values for demonstration; actual norms would need calibration

// Dimension norms (mean, SD) from large samples
const dimensionNorms: Record<Dimension, { mean: number; sd: number }> = {
  N: { mean: 2.90, sd: 0.70 },
  E: { mean: 3.25, sd: 0.65 },
  O: { mean: 3.60, sd: 0.55 },
  A: { mean: 3.65, sd: 0.50 },
  C: { mean: 3.45, sd: 0.60 },
};

// Facet norms - using dimension-level approximations for each facet
// In a production system, these would be calibrated per-facet
const facetNorms: Record<Facet, { mean: number; sd: number }> = {
  // Neuroticism facets
  N1_Anxiety: { mean: 3.00, sd: 0.85 },
  N2_Anger: { mean: 2.80, sd: 0.80 },
  N3_Depression: { mean: 2.70, sd: 0.90 },
  N4_SelfConsciousness: { mean: 2.90, sd: 0.85 },
  N5_Immoderation: { mean: 2.95, sd: 0.80 },
  N6_Vulnerability: { mean: 2.75, sd: 0.85 },
  // Extraversion facets
  E1_Friendliness: { mean: 3.45, sd: 0.75 },
  E2_Gregariousness: { mean: 3.00, sd: 0.80 },
  E3_Assertiveness: { mean: 3.20, sd: 0.80 },
  E4_ActivityLevel: { mean: 3.35, sd: 0.70 },
  E5_ExcitementSeeking: { mean: 3.25, sd: 0.75 },
  E6_Cheerfulness: { mean: 3.60, sd: 0.70 },
  // Openness facets
  O1_Imagination: { mean: 3.55, sd: 0.75 },
  O2_ArtisticInterests: { mean: 3.60, sd: 0.80 },
  O3_Emotionality: { mean: 3.55, sd: 0.70 },
  O4_Adventurousness: { mean: 3.65, sd: 0.65 },
  O5_Intellect: { mean: 3.50, sd: 0.80 },
  O6_Liberalism: { mean: 3.40, sd: 0.85 },
  // Agreeableness facets
  A1_Trust: { mean: 3.50, sd: 0.75 },
  A2_Morality: { mean: 3.80, sd: 0.65 },
  A3_Altruism: { mean: 3.85, sd: 0.60 },
  A4_Cooperation: { mean: 3.55, sd: 0.70 },
  A5_Modesty: { mean: 3.40, sd: 0.75 },
  A6_Sympathy: { mean: 3.75, sd: 0.65 },
  // Conscientiousness facets
  C1_SelfEfficacy: { mean: 3.65, sd: 0.65 },
  C2_Orderliness: { mean: 3.35, sd: 0.80 },
  C3_Dutifulness: { mean: 3.85, sd: 0.55 },
  C4_AchievementStriving: { mean: 3.55, sd: 0.70 },
  C5_SelfDiscipline: { mean: 3.30, sd: 0.80 },
  C6_Cautiousness: { mean: 3.25, sd: 0.75 },
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

// Calculate percentile for a dimension score
export function calculateDimensionPercentile(
  dimension: Dimension,
  meanScore: number
): number {
  const norm = dimensionNorms[dimension];
  const z = (meanScore - norm.mean) / norm.sd;
  return zToPercentile(z);
}

// Calculate percentile for a facet score
export function calculateFacetPercentile(facet: Facet, meanScore: number): number {
  const norm = facetNorms[facet];
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

// Get description based on dimension and score level
export function getDimensionDescription(
  dimension: Dimension,
  percentile: number
): string {
  const info = dimensionInfo[dimension];
  if (percentile >= 50) {
    return info.highDescription;
  }
  return info.lowDescription;
}

// Get facet description based on score level
export function getFacetDescription(facet: Facet, percentile: number): string {
  const info = facetInfo[facet];
  const level = getPercentileInterpretation(percentile);
  return `${level} ${info.name}: ${info.description}`;
}

// Serialize results to JSON for localStorage
export function serializeResults(results: BigFiveResults): string {
  return JSON.stringify(results);
}

// Deserialize results from JSON
export function deserializeResults(json: string): BigFiveResults | null {
  try {
    return JSON.parse(json) as BigFiveResults;
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

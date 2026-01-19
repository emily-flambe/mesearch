// HEXACO-60 Scoring Logic
// Based on Lee, K., & Ashton, M.C. (2004, 2018)
// https://hexaco.org

import {
  hexacoItems,
  HexacoDimension,
  HexacoFacet,
  HexacoItem,
} from './hexaco-items';

export interface HexacoResponse {
  itemId: number;
  value: number; // 1-5 Likert scale
}

export interface DimensionScore {
  dimension: HexacoDimension;
  score: number; // Mean score 1-5
  facetScores: FacetScore[];
}

export interface FacetScore {
  facet: HexacoFacet;
  score: number; // Mean score 1-5
}

/**
 * Reverse score an item if needed.
 * For a 5-point Likert scale: reversed = 6 - response
 */
function reverseScore(value: number, isReversed: boolean): number {
  return isReversed ? 6 - value : value;
}

/**
 * Get items for a specific dimension
 */
function getItemsByDimension(dimension: HexacoDimension): HexacoItem[] {
  return hexacoItems.filter((item) => item.dimension === dimension);
}

/**
 * Get items for a specific facet
 */
function getItemsByFacet(facet: HexacoFacet): HexacoItem[] {
  return hexacoItems.filter((item) => item.facet === facet);
}

/**
 * Calculate the mean score for a set of items
 */
function calculateMean(
  items: HexacoItem[],
  responses: Map<number, number>
): number {
  const scores: number[] = [];

  for (const item of items) {
    const response = responses.get(item.id);
    if (response !== undefined) {
      scores.push(reverseScore(response, item.isReversed));
    }
  }

  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

/**
 * Calculate facet scores for a dimension
 */
function calculateFacetScores(
  dimension: HexacoDimension,
  responses: Map<number, number>
): FacetScore[] {
  const dimensionItems = getItemsByDimension(dimension);
  const facets = [...new Set(dimensionItems.map((item) => item.facet))];

  return facets.map((facet) => {
    const facetItems = getItemsByFacet(facet);
    return {
      facet,
      score: calculateMean(facetItems, responses),
    };
  });
}

/**
 * Calculate all dimension scores from responses
 */
export function calculateScores(responses: HexacoResponse[]): DimensionScore[] {
  // Convert responses array to Map for efficient lookup
  const responseMap = new Map<number, number>();
  for (const response of responses) {
    responseMap.set(response.itemId, response.value);
  }

  const dimensions: HexacoDimension[] = [
    'Honesty-Humility',
    'Emotionality',
    'Extraversion',
    'Agreeableness',
    'Conscientiousness',
    'Openness',
  ];

  return dimensions.map((dimension) => {
    const dimensionItems = getItemsByDimension(dimension);
    const score = calculateMean(dimensionItems, responseMap);
    const facetScores = calculateFacetScores(dimension, responseMap);

    return {
      dimension,
      score,
      facetScores,
    };
  });
}

/**
 * Get a descriptive label for a score
 */
export function getScoreLabel(score: number): string {
  if (score >= 4.5) return 'Very High';
  if (score >= 3.5) return 'High';
  if (score >= 2.5) return 'Moderate';
  if (score >= 1.5) return 'Low';
  return 'Very Low';
}

/**
 * Convert a score to a percentage (0-100)
 */
export function scoreToPercentage(score: number): number {
  // Convert 1-5 scale to 0-100 percentage
  return Math.round(((score - 1) / 4) * 100);
}

/**
 * Check if all items have been answered
 */
export function isComplete(responses: HexacoResponse[]): boolean {
  return responses.length === hexacoItems.length;
}

/**
 * Get progress as a percentage
 */
export function getProgress(responses: HexacoResponse[]): number {
  return Math.round((responses.length / hexacoItems.length) * 100);
}

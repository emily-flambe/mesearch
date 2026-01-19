// Unit tests for Big Five scoring logic
import { describe, it, expect } from 'vitest';
import {
  scoreItem,
  calculateMean,
  getItemsForFacet,
  getItemsForDimension,
  calculateFacetScore,
  calculateDimensionScore,
  calculateAllScores,
  calculateDimensionPercentile,
  calculateFacetPercentile,
  getPercentileInterpretation,
  getDimensionDescription,
  getFacetDescription,
  serializeResults,
  deserializeResults,
  serializeResponses,
  deserializeResponses,
  type Response,
} from './big-five-scoring';
import { items, dimensions, facetInfo, getFacetsForDimension, type Item, type Facet } from './big-five-items';

// Get all facets from facetInfo keys
const allFacets = Object.keys(facetInfo) as Facet[];

describe('Big Five Scoring', () => {
  describe('scoreItem', () => {
    it('returns value unchanged for non-reversed items', () => {
      const item: Item = {
        id: 1,
        text: 'Test item',
        dimension: 'E',
        facet: 'E1_Friendliness',
        isReversed: false,
      };
      expect(scoreItem(item, 1)).toBe(1);
      expect(scoreItem(item, 3)).toBe(3);
      expect(scoreItem(item, 5)).toBe(5);
    });

    it('reverses value for reversed items (6 - value)', () => {
      const item: Item = {
        id: 1,
        text: 'Test item',
        dimension: 'E',
        facet: 'E1_Friendliness',
        isReversed: true,
      };
      expect(scoreItem(item, 1)).toBe(5);
      expect(scoreItem(item, 2)).toBe(4);
      expect(scoreItem(item, 3)).toBe(3);
      expect(scoreItem(item, 4)).toBe(2);
      expect(scoreItem(item, 5)).toBe(1);
    });
  });

  describe('calculateMean', () => {
    it('returns 0 for empty array', () => {
      expect(calculateMean([])).toBe(0);
    });

    it('calculates mean correctly for single value', () => {
      expect(calculateMean([5])).toBe(5);
    });

    it('calculates mean correctly for multiple values', () => {
      expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateMean([2, 4])).toBe(3);
      expect(calculateMean([1, 1, 1, 1])).toBe(1);
    });
  });

  describe('getItemsForFacet', () => {
    it('returns items for a specific facet', () => {
      const facetItems = getItemsForFacet('E1_Friendliness');
      expect(facetItems.length).toBeGreaterThan(0);
      expect(facetItems.every((item) => item.facet === 'E1_Friendliness')).toBe(true);
    });

    it('returns items for each facet', () => {
      for (const facet of allFacets) {
        const facetItems = getItemsForFacet(facet);
        expect(facetItems.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getItemsForDimension', () => {
    it('returns items for a specific dimension', () => {
      const dimItems = getItemsForDimension('E');
      expect(dimItems.length).toBeGreaterThan(0);
      expect(dimItems.every((item) => item.dimension === 'E')).toBe(true);
    });

    it('returns items for each dimension', () => {
      for (const dim of dimensions) {
        const dimItems = getItemsForDimension(dim);
        expect(dimItems.length).toBeGreaterThan(0);
      }
    });
  });

  describe('calculateFacetScore', () => {
    it('calculates facet score correctly', () => {
      const facetItems = getItemsForFacet('E1_Friendliness');
      const responses = new Map<number, number>();

      // Set all responses to 4
      for (const item of facetItems) {
        responses.set(item.id, 4);
      }

      const score = calculateFacetScore('E1_Friendliness', responses);
      expect(score.facet).toBe('E1_Friendliness');
      expect(score.rawScore).toBeGreaterThan(0);
      expect(score.meanScore).toBeGreaterThan(0);
      expect(score.percentile).toBeGreaterThanOrEqual(0);
      expect(score.percentile).toBeLessThanOrEqual(100);
    });

    it('handles missing responses gracefully', () => {
      const responses = new Map<number, number>();
      const score = calculateFacetScore('E1_Friendliness', responses);
      expect(score.rawScore).toBe(0);
      expect(score.meanScore).toBe(0);
    });
  });

  describe('calculateDimensionScore', () => {
    it('calculates dimension score correctly', () => {
      const dimItems = getItemsForDimension('E');
      const responses = new Map<number, number>();

      // Set all responses to 3 (neutral)
      for (const item of dimItems) {
        responses.set(item.id, 3);
      }

      const score = calculateDimensionScore('E', responses);
      expect(score.dimension).toBe('E');
      expect(score.rawScore).toBeGreaterThan(0);
      expect(score.meanScore).toBeGreaterThan(0);
      expect(score.facets.length).toBe(6); // 6 facets per dimension
      expect(score.percentile).toBeGreaterThanOrEqual(0);
      expect(score.percentile).toBeLessThanOrEqual(100);
    });

    it('includes all facets for the dimension', () => {
      const responses = new Map<number, number>();
      items.forEach((item) => responses.set(item.id, 3));

      const score = calculateDimensionScore('O', responses);
      expect(score.facets.length).toBe(6);
      const facetNames = score.facets.map((f) => f.facet);
      expect(facetNames).toContain('O1_Imagination');
      expect(facetNames).toContain('O2_ArtisticInterests');
      expect(facetNames).toContain('O3_Emotionality');
      expect(facetNames).toContain('O4_Adventurousness');
      expect(facetNames).toContain('O5_Intellect');
      expect(facetNames).toContain('O6_Liberalism');
    });
  });

  describe('calculateAllScores', () => {
    it('returns scores for all 5 dimensions', () => {
      const responses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 3,
      }));

      const results = calculateAllScores(responses);
      expect(results.dimensions.length).toBe(5);
      expect(results.totalQuestions).toBe(items.length);
      expect(results.completedAt).toBeDefined();
    });

    it('calculates different scores for different response patterns', () => {
      // All low responses
      const lowResponses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 1,
      }));
      const lowResults = calculateAllScores(lowResponses);

      // All high responses
      const highResponses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 5,
      }));
      const highResults = calculateAllScores(highResponses);

      // Scores should differ
      for (let i = 0; i < 5; i++) {
        expect(lowResults.dimensions[i].rawScore).not.toBe(
          highResults.dimensions[i].rawScore
        );
      }
    });
  });

  describe('percentile calculations', () => {
    describe('calculateDimensionPercentile', () => {
      it('returns percentile between 0 and 100', () => {
        const percentile = calculateDimensionPercentile('E', 3.25);
        expect(percentile).toBeGreaterThanOrEqual(0);
        expect(percentile).toBeLessThanOrEqual(100);
      });

      it('returns higher percentile for higher scores', () => {
        const lowPercentile = calculateDimensionPercentile('E', 2.0);
        const highPercentile = calculateDimensionPercentile('E', 4.5);
        expect(highPercentile).toBeGreaterThan(lowPercentile);
      });

      it('returns ~50th percentile for mean score', () => {
        // E dimension has mean of 3.25
        const percentile = calculateDimensionPercentile('E', 3.25);
        expect(percentile).toBeGreaterThanOrEqual(45);
        expect(percentile).toBeLessThanOrEqual(55);
      });
    });

    describe('calculateFacetPercentile', () => {
      it('returns percentile between 0 and 100', () => {
        const percentile = calculateFacetPercentile('E1_Friendliness', 3.45);
        expect(percentile).toBeGreaterThanOrEqual(0);
        expect(percentile).toBeLessThanOrEqual(100);
      });

      it('returns higher percentile for higher scores', () => {
        const lowPercentile = calculateFacetPercentile('N1_Anxiety', 1.5);
        const highPercentile = calculateFacetPercentile('N1_Anxiety', 4.5);
        expect(highPercentile).toBeGreaterThan(lowPercentile);
      });
    });
  });

  describe('getPercentileInterpretation', () => {
    it('returns correct interpretation for each range', () => {
      expect(getPercentileInterpretation(90)).toBe('Very High');
      expect(getPercentileInterpretation(85)).toBe('Very High');
      expect(getPercentileInterpretation(75)).toBe('High');
      expect(getPercentileInterpretation(70)).toBe('High');
      expect(getPercentileInterpretation(60)).toBe('Above Average');
      expect(getPercentileInterpretation(55)).toBe('Above Average');
      expect(getPercentileInterpretation(50)).toBe('Average');
      expect(getPercentileInterpretation(45)).toBe('Average');
      expect(getPercentileInterpretation(35)).toBe('Below Average');
      expect(getPercentileInterpretation(30)).toBe('Below Average');
      expect(getPercentileInterpretation(20)).toBe('Low');
      expect(getPercentileInterpretation(15)).toBe('Low');
      expect(getPercentileInterpretation(10)).toBe('Very Low');
      expect(getPercentileInterpretation(5)).toBe('Very Low');
    });
  });

  describe('getDimensionDescription', () => {
    it('returns high description for percentile >= 50', () => {
      const desc = getDimensionDescription('E', 75);
      expect(desc).toContain('social');
    });

    it('returns low description for percentile < 50', () => {
      const desc = getDimensionDescription('E', 25);
      expect(desc).toBeDefined();
      expect(typeof desc).toBe('string');
    });
  });

  describe('getFacetDescription', () => {
    it('returns description with level and facet info', () => {
      const desc = getFacetDescription('E1_Friendliness', 75);
      expect(desc).toContain('High');
      expect(desc).toContain('Friendliness');
    });
  });

  describe('serialization', () => {
    describe('serializeResults / deserializeResults', () => {
      it('round-trips results correctly', () => {
        const responses: Response[] = items.slice(0, 10).map((item) => ({
          itemId: item.id,
          value: 3,
        }));
        const results = calculateAllScores(responses);

        const serialized = serializeResults(results);
        const deserialized = deserializeResults(serialized);

        expect(deserialized).not.toBeNull();
        expect(deserialized?.dimensions.length).toBe(results.dimensions.length);
        expect(deserialized?.totalQuestions).toBe(results.totalQuestions);
      });

      it('returns null for invalid JSON', () => {
        expect(deserializeResults('invalid json')).toBeNull();
        expect(deserializeResults('{broken')).toBeNull();
      });
    });

    describe('serializeResponses / deserializeResponses', () => {
      it('round-trips responses correctly', () => {
        const responses: Response[] = [
          { itemId: 1, value: 3 },
          { itemId: 2, value: 4 },
          { itemId: 3, value: 5 },
        ];

        const serialized = serializeResponses(responses);
        const deserialized = deserializeResponses(serialized);

        expect(deserialized).toEqual(responses);
      });

      it('returns null for invalid JSON', () => {
        expect(deserializeResponses('invalid json')).toBeNull();
      });
    });
  });
});

describe('Big Five Items Data Integrity', () => {
  it('has 120 items total', () => {
    expect(items.length).toBe(120);
  });

  it('has 5 dimensions', () => {
    expect(dimensions.length).toBe(5);
    expect(dimensions).toContain('N');
    expect(dimensions).toContain('E');
    expect(dimensions).toContain('O');
    expect(dimensions).toContain('A');
    expect(dimensions).toContain('C');
  });

  it('has 30 facets (6 per dimension)', () => {
    expect(allFacets.length).toBe(30);
  });

  it('has 24 items per dimension', () => {
    for (const dim of dimensions) {
      const dimItems = items.filter((item) => item.dimension === dim);
      expect(dimItems.length).toBe(24);
    }
  });

  it('has 4 items per facet', () => {
    for (const facet of allFacets) {
      const facetItems = items.filter((item) => item.facet === facet);
      expect(facetItems.length).toBe(4);
    }
  });

  it('has unique item IDs', () => {
    const ids = items.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(items.length);
  });

  it('has mix of reversed and non-reversed items', () => {
    const reversed = items.filter((item) => item.isReversed);
    const nonReversed = items.filter((item) => !item.isReversed);
    expect(reversed.length).toBeGreaterThan(0);
    expect(nonReversed.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import {
  calculateScores,
  getScoreLabel,
  scoreToPercentage,
  isComplete,
  getProgress,
  HexacoResponse,
} from './hexaco-scoring';
import { hexacoItems } from './hexaco-items';

describe('hexaco-scoring', () => {
  describe('calculateScores', () => {
    it('calculates dimension scores correctly with all neutral responses', () => {
      // All items answered with 3 (Neutral)
      const responses: HexacoResponse[] = hexacoItems.map((item) => ({
        itemId: item.id,
        value: 3,
      }));

      const scores = calculateScores(responses);

      // With all neutral responses, all dimensions should score 3.0
      // (reverse scoring: 6 - 3 = 3, so neutral stays neutral)
      expect(scores).toHaveLength(6);
      scores.forEach((dimension) => {
        expect(dimension.score).toBeCloseTo(3.0, 1);
      });
    });

    it('handles reverse scoring correctly', () => {
      // Create responses where all items get value 5
      const responses: HexacoResponse[] = hexacoItems.map((item) => ({
        itemId: item.id,
        value: 5,
      }));

      const scores = calculateScores(responses);

      // Openness has items 1, 19, 31, 49, 55 as reversed (5 of 10)
      // Regular items: 5, reversed items: 6 - 5 = 1
      // So Openness score = (5*5 + 5*1) / 10 = 30 / 10 = 3.0
      const opennessScore = scores.find((s) => s.dimension === 'Openness');
      expect(opennessScore).toBeDefined();
      expect(opennessScore!.score).toBeCloseTo(3.0, 1);
    });

    it('returns correct dimension names', () => {
      const responses: HexacoResponse[] = hexacoItems.map((item) => ({
        itemId: item.id,
        value: 3,
      }));

      const scores = calculateScores(responses);
      const dimensionNames = scores.map((s) => s.dimension);

      expect(dimensionNames).toContain('Honesty-Humility');
      expect(dimensionNames).toContain('Emotionality');
      expect(dimensionNames).toContain('Extraversion');
      expect(dimensionNames).toContain('Agreeableness');
      expect(dimensionNames).toContain('Conscientiousness');
      expect(dimensionNames).toContain('Openness');
    });

    it('calculates facet scores for each dimension', () => {
      const responses: HexacoResponse[] = hexacoItems.map((item) => ({
        itemId: item.id,
        value: 3,
      }));

      const scores = calculateScores(responses);

      // Honesty-Humility should have 4 facets
      const hhScore = scores.find((s) => s.dimension === 'Honesty-Humility');
      expect(hhScore).toBeDefined();
      expect(hhScore!.facetScores).toHaveLength(4);

      const facetNames = hhScore!.facetScores.map((f) => f.facet);
      expect(facetNames).toContain('Sincerity');
      expect(facetNames).toContain('Fairness');
      expect(facetNames).toContain('Greed-Avoidance');
      expect(facetNames).toContain('Modesty');
    });

    it('handles empty responses', () => {
      const scores = calculateScores([]);

      expect(scores).toHaveLength(6);
      scores.forEach((dimension) => {
        expect(dimension.score).toBe(0);
      });
    });

    it('calculates varied scores correctly', () => {
      // Answer all Honesty-Humility items (6, 12, 18, 24, 30, 36, 42, 48, 54, 60) with 5
      // and all other items with 1
      const hhItemIds = hexacoItems
        .filter((item) => item.dimension === 'Honesty-Humility')
        .map((item) => item.id);

      const responses: HexacoResponse[] = hexacoItems.map((item) => ({
        itemId: item.id,
        value: hhItemIds.includes(item.id) ? 5 : 1,
      }));

      const scores = calculateScores(responses);

      // HH items: 6(normal->5), 12(R->1), 18(normal->5), 24(R->1), 30(R->1),
      // 36(normal->5), 42(R->1), 48(R->1), 54(normal->5), 60(R->1)
      // HH has 4 regular items (scores 5) and 6 reversed items (6-5=1)
      // Mean = (4*5 + 6*1) / 10 = 26/10 = 2.6
      const hhScore = scores.find((s) => s.dimension === 'Honesty-Humility');
      expect(hhScore).toBeDefined();
      expect(hhScore!.score).toBeCloseTo(2.6, 1);
    });
  });

  describe('getScoreLabel', () => {
    it('returns "Very High" for scores >= 4.5', () => {
      expect(getScoreLabel(4.5)).toBe('Very High');
      expect(getScoreLabel(5.0)).toBe('Very High');
    });

    it('returns "High" for scores >= 3.5 and < 4.5', () => {
      expect(getScoreLabel(3.5)).toBe('High');
      expect(getScoreLabel(4.0)).toBe('High');
      expect(getScoreLabel(4.49)).toBe('High');
    });

    it('returns "Moderate" for scores >= 2.5 and < 3.5', () => {
      expect(getScoreLabel(2.5)).toBe('Moderate');
      expect(getScoreLabel(3.0)).toBe('Moderate');
      expect(getScoreLabel(3.49)).toBe('Moderate');
    });

    it('returns "Low" for scores >= 1.5 and < 2.5', () => {
      expect(getScoreLabel(1.5)).toBe('Low');
      expect(getScoreLabel(2.0)).toBe('Low');
      expect(getScoreLabel(2.49)).toBe('Low');
    });

    it('returns "Very Low" for scores < 1.5', () => {
      expect(getScoreLabel(1.0)).toBe('Very Low');
      expect(getScoreLabel(1.49)).toBe('Very Low');
    });
  });

  describe('scoreToPercentage', () => {
    it('converts score 1 to 0%', () => {
      expect(scoreToPercentage(1)).toBe(0);
    });

    it('converts score 5 to 100%', () => {
      expect(scoreToPercentage(5)).toBe(100);
    });

    it('converts score 3 to 50%', () => {
      expect(scoreToPercentage(3)).toBe(50);
    });

    it('rounds to nearest integer', () => {
      expect(scoreToPercentage(2.5)).toBe(38); // (1.5/4) * 100 = 37.5
    });
  });

  describe('isComplete', () => {
    it('returns true when all 60 items are answered', () => {
      const responses: HexacoResponse[] = hexacoItems.map((item) => ({
        itemId: item.id,
        value: 3,
      }));
      expect(isComplete(responses)).toBe(true);
    });

    it('returns false when not all items are answered', () => {
      const responses: HexacoResponse[] = [{ itemId: 1, value: 3 }];
      expect(isComplete(responses)).toBe(false);
    });

    it('returns false for empty responses', () => {
      expect(isComplete([])).toBe(false);
    });
  });

  describe('getProgress', () => {
    it('returns 0% for no responses', () => {
      expect(getProgress([])).toBe(0);
    });

    it('returns 100% for all responses', () => {
      const responses: HexacoResponse[] = hexacoItems.map((item) => ({
        itemId: item.id,
        value: 3,
      }));
      expect(getProgress(responses)).toBe(100);
    });

    it('returns correct percentage for partial responses', () => {
      // 30 out of 60 items = 50%
      const responses: HexacoResponse[] = hexacoItems.slice(0, 30).map((item) => ({
        itemId: item.id,
        value: 3,
      }));
      expect(getProgress(responses)).toBe(50);
    });
  });
});

describe('hexaco-items', () => {
  it('has exactly 60 items', () => {
    expect(hexacoItems).toHaveLength(60);
  });

  it('has 10 items per dimension', () => {
    const dimensions = [
      'Honesty-Humility',
      'Emotionality',
      'Extraversion',
      'Agreeableness',
      'Conscientiousness',
      'Openness',
    ] as const;

    dimensions.forEach((dimension) => {
      const items = hexacoItems.filter((item) => item.dimension === dimension);
      expect(items).toHaveLength(10);
    });
  });

  it('has items numbered 1 to 60', () => {
    const ids = hexacoItems.map((item) => item.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
  });

  it('has all required properties for each item', () => {
    hexacoItems.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('text');
      expect(item).toHaveProperty('dimension');
      expect(item).toHaveProperty('facet');
      expect(item).toHaveProperty('isReversed');
      expect(typeof item.id).toBe('number');
      expect(typeof item.text).toBe('string');
      expect(item.text.length).toBeGreaterThan(0);
      expect(typeof item.isReversed).toBe('boolean');
    });
  });

  it('has 4 facets per dimension', () => {
    const dimensions = [
      'Honesty-Humility',
      'Emotionality',
      'Extraversion',
      'Agreeableness',
      'Conscientiousness',
      'Openness',
    ] as const;

    dimensions.forEach((dimension) => {
      const items = hexacoItems.filter((item) => item.dimension === dimension);
      const facets = new Set(items.map((item) => item.facet));
      expect(facets.size).toBe(4);
    });
  });
});

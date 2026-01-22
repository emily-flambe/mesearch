// Unit tests for MFQ scoring logic
import { describe, it, expect } from 'vitest';
import {
  scoreItem,
  calculateMean,
  calculateFoundationScore,
  calculateAllScores,
  calculateFoundationPercentile,
  getPercentileInterpretation,
  getFoundationDescription,
  serializeResults,
  deserializeResults,
  serializeResponses,
  deserializeResponses,
  type Response,
} from './mfq-scoring';
import {
  items,
  scoredFoundations,
  foundationInfo,
  getItemsForFoundation,
  type Item,
  type Foundation,
} from './mfq-items';

describe('MFQ Scoring', () => {
  describe('scoreItem', () => {
    it('returns value unchanged for non-reversed items', () => {
      const item: Item = {
        id: 1,
        text: 'Test item',
        foundation: 'care',
        questionType: 'relevance',
        isReversed: false,
      };
      expect(scoreItem(item, 0)).toBe(0);
      expect(scoreItem(item, 3)).toBe(3);
      expect(scoreItem(item, 5)).toBe(5);
    });

    it('reverses value for reversed items (5 - value)', () => {
      const item: Item = {
        id: 1,
        text: 'Test item',
        foundation: 'care',
        questionType: 'relevance',
        isReversed: true,
      };
      expect(scoreItem(item, 0)).toBe(5);
      expect(scoreItem(item, 1)).toBe(4);
      expect(scoreItem(item, 2)).toBe(3);
      expect(scoreItem(item, 3)).toBe(2);
      expect(scoreItem(item, 4)).toBe(1);
      expect(scoreItem(item, 5)).toBe(0);
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
      expect(calculateMean([0, 0, 0, 0])).toBe(0);
    });
  });

  describe('getItemsForFoundation', () => {
    it('returns items for a specific foundation', () => {
      const careItems = getItemsForFoundation('care');
      expect(careItems.length).toBeGreaterThan(0);
      expect(careItems.every((item) => item.foundation === 'care')).toBe(true);
    });

    it('returns items for each scored foundation', () => {
      for (const foundation of scoredFoundations) {
        const foundationItems = getItemsForFoundation(foundation);
        expect(foundationItems.length).toBeGreaterThan(0);
      }
    });
  });

  describe('calculateFoundationScore', () => {
    it('calculates foundation score correctly', () => {
      const careItems = getItemsForFoundation('care');
      const responses = new Map<number, number>();

      // Set all responses to 4
      for (const item of careItems) {
        responses.set(item.id, 4);
      }

      const score = calculateFoundationScore('care', responses);
      expect(score.foundation).toBe('care');
      expect(score.rawScore).toBeGreaterThan(0);
      expect(score.meanScore).toBeGreaterThan(0);
      expect(score.percentile).toBeGreaterThanOrEqual(0);
      expect(score.percentile).toBeLessThanOrEqual(100);
    });

    it('handles missing responses gracefully', () => {
      const responses = new Map<number, number>();
      const score = calculateFoundationScore('care', responses);
      expect(score.rawScore).toBe(0);
      expect(score.meanScore).toBe(0);
    });
  });

  describe('calculateAllScores', () => {
    it('returns scores for all 5 scored foundations', () => {
      const responses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 3,
      }));

      const results = calculateAllScores(responses);
      expect(results.foundations.length).toBe(5); // 5 scored foundations
      expect(results.totalQuestions).toBe(items.length);
      expect(results.completedAt).toBeDefined();
      expect(results.profile).toBeDefined();
    });

    it('calculates different scores for different response patterns', () => {
      // All low responses
      const lowResponses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 0,
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
        expect(lowResults.foundations[i].rawScore).not.toBe(
          highResults.foundations[i].rawScore
        );
      }
    });
  });

  describe('percentile calculations', () => {
    describe('calculateFoundationPercentile', () => {
      it('returns percentile between 0 and 100', () => {
        const percentile = calculateFoundationPercentile('care', 3.69);
        expect(percentile).toBeGreaterThanOrEqual(0);
        expect(percentile).toBeLessThanOrEqual(100);
      });

      it('returns higher percentile for higher scores', () => {
        const lowPercentile = calculateFoundationPercentile('care', 2.0);
        const highPercentile = calculateFoundationPercentile('care', 4.5);
        expect(highPercentile).toBeGreaterThan(lowPercentile);
      });

      it('returns ~50th percentile for mean score', () => {
        // Care foundation has mean of 3.69
        const percentile = calculateFoundationPercentile('care', 3.69);
        expect(percentile).toBeGreaterThanOrEqual(45);
        expect(percentile).toBeLessThanOrEqual(55);
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

  describe('getFoundationDescription', () => {
    it('returns high description for percentile >= 50', () => {
      const desc = getFoundationDescription('care', 75);
      expect(desc).toContain('high importance');
    });

    it('returns low description for percentile < 50', () => {
      const desc = getFoundationDescription('care', 25);
      expect(desc).toContain('less importance');
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
        expect(deserialized?.foundations.length).toBe(results.foundations.length);
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

describe('MFQ Items Data Integrity', () => {
  it('has 30 items total', () => {
    expect(items.length).toBe(30);
  });

  it('has 5 scored foundations', () => {
    expect(scoredFoundations.length).toBe(5);
    expect(scoredFoundations).toContain('care');
    expect(scoredFoundations).toContain('fairness');
    expect(scoredFoundations).toContain('loyalty');
    expect(scoredFoundations).toContain('authority');
    expect(scoredFoundations).toContain('purity');
  });

  it('has 6 items per foundation (for scored foundations)', () => {
    for (const foundation of scoredFoundations) {
      const foundationItems = items.filter((item) => item.foundation === foundation);
      expect(foundationItems.length).toBe(6);
    }
  });

  it('has unique item IDs', () => {
    const ids = items.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(items.length);
  });

  it('has 15 relevance items and 15 judgment items', () => {
    const relevanceItems = items.filter((item) => item.questionType === 'relevance');
    const judgmentItems = items.filter((item) => item.questionType === 'judgment');
    expect(relevanceItems.length).toBe(15);
    expect(judgmentItems.length).toBe(15);
  });

  it('has 3 relevance items and 3 judgment items per foundation', () => {
    for (const foundation of scoredFoundations) {
      const foundationItems = items.filter((item) => item.foundation === foundation);
      const relevanceItems = foundationItems.filter((item) => item.questionType === 'relevance');
      const judgmentItems = foundationItems.filter((item) => item.questionType === 'judgment');
      expect(relevanceItems.length).toBe(3);
      expect(judgmentItems.length).toBe(3);
    }
  });

  it('has foundation info for all foundations', () => {
    for (const foundation of scoredFoundations) {
      const info = foundationInfo[foundation];
      expect(info).toBeDefined();
      expect(info.name).toBeDefined();
      expect(info.description).toBeDefined();
      expect(info.concernsWith).toBeDefined();
      expect(info.oppositeOf).toBeDefined();
      expect(info.color).toBeDefined();
    }
  });
});

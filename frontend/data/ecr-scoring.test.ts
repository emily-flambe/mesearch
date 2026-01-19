// Unit tests for ECR scoring logic
import { describe, it, expect } from 'vitest';
import {
  scoreItem,
  calculateMean,
  getItemById,
  calculateDimensionScore,
  calculateAllScores,
  determineSuggestedStyle,
  getMeanScoreInterpretation,
  getDimensionDescription,
  serializeResults,
  deserializeResults,
  serializeResponses,
  deserializeResponses,
  DIMENSIONAL_DISCLAIMER,
  type Response,
} from './ecr-scoring';
import { items, dimensions, getItemsForDimension, type Item, type LikertValue } from './ecr-items';

describe('ECR Scoring', () => {
  describe('scoreItem', () => {
    it('returns value unchanged for non-reversed items', () => {
      // Item 5 is anxiety item, not reversed
      const item: Item = {
        id: 5,
        text: "I'm afraid that I will lose my partner's love.",
        dimension: 'anxiety',
        isReversed: false,
      };
      expect(scoreItem(item, 1)).toBe(1);
      expect(scoreItem(item, 4)).toBe(4);
      expect(scoreItem(item, 7)).toBe(7);
    });

    it('reverses value for reversed items (8 - value) on 7-point scale', () => {
      // Item 1 is avoidance item, reversed
      const item: Item = {
        id: 1,
        text: 'It helps to turn to my romantic partner in times of need.',
        dimension: 'avoidance',
        isReversed: true,
      };
      expect(scoreItem(item, 1)).toBe(7); // 8 - 1 = 7
      expect(scoreItem(item, 2)).toBe(6); // 8 - 2 = 6
      expect(scoreItem(item, 3)).toBe(5); // 8 - 3 = 5
      expect(scoreItem(item, 4)).toBe(4); // 8 - 4 = 4 (midpoint)
      expect(scoreItem(item, 5)).toBe(3); // 8 - 5 = 3
      expect(scoreItem(item, 6)).toBe(2); // 8 - 6 = 2
      expect(scoreItem(item, 7)).toBe(1); // 8 - 7 = 1
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
      expect(calculateMean([1, 2, 3, 4, 5, 6, 7])).toBe(4);
      expect(calculateMean([2, 4, 6])).toBe(4);
      expect(calculateMean([1, 1, 1, 1])).toBe(1);
      expect(calculateMean([7, 7, 7])).toBe(7);
    });
  });

  describe('getItemById', () => {
    it('returns the correct item', () => {
      const item = getItemById(1);
      expect(item).toBeDefined();
      expect(item?.id).toBe(1);
      expect(item?.dimension).toBe('avoidance');
    });

    it('returns undefined for non-existent item', () => {
      const item = getItemById(999);
      expect(item).toBeUndefined();
    });
  });

  describe('getItemsForDimension', () => {
    it('returns items for anxiety dimension', () => {
      const anxietyItems = getItemsForDimension('anxiety');
      expect(anxietyItems.length).toBe(5);
      expect(anxietyItems.every((item) => item.dimension === 'anxiety')).toBe(true);
    });

    it('returns items for avoidance dimension', () => {
      const avoidanceItems = getItemsForDimension('avoidance');
      expect(avoidanceItems.length).toBe(4);
      expect(avoidanceItems.every((item) => item.dimension === 'avoidance')).toBe(true);
    });
  });

  describe('calculateDimensionScore', () => {
    it('calculates anxiety score correctly', () => {
      const anxietyItems = getItemsForDimension('anxiety');
      const responses = new Map<number, LikertValue>();

      // Set all anxiety responses to 5
      for (const item of anxietyItems) {
        responses.set(item.id, 5);
      }

      const score = calculateDimensionScore('anxiety', responses);
      expect(score.dimension).toBe('anxiety');
      expect(score.meanScore).toBe(5); // All items scored 5, no reversals
      expect(score.rawScore).toBe(25); // 5 items * 5
    });

    it('calculates avoidance score correctly with reverse scoring', () => {
      const avoidanceItems = getItemsForDimension('avoidance');
      const responses = new Map<number, LikertValue>();

      // Set all avoidance responses to 7 (high agreement)
      // All avoidance items are reversed, so 7 -> 1 (low avoidance)
      for (const item of avoidanceItems) {
        responses.set(item.id, 7);
      }

      const score = calculateDimensionScore('avoidance', responses);
      expect(score.dimension).toBe('avoidance');
      expect(score.meanScore).toBe(1); // All items reverse-scored: 8 - 7 = 1
      expect(score.rawScore).toBe(4); // 4 items * 1
    });

    it('handles missing responses gracefully', () => {
      const responses = new Map<number, LikertValue>();
      const score = calculateDimensionScore('anxiety', responses);
      expect(score.rawScore).toBe(0);
      expect(score.meanScore).toBe(0);
    });
  });

  describe('determineSuggestedStyle', () => {
    it('returns secure for low anxiety and low avoidance', () => {
      expect(determineSuggestedStyle(2, 2)).toBe('secure');
      expect(determineSuggestedStyle(3.9, 3.9)).toBe('secure');
    });

    it('returns anxious-preoccupied for high anxiety and low avoidance', () => {
      expect(determineSuggestedStyle(5, 2)).toBe('anxious-preoccupied');
      expect(determineSuggestedStyle(4, 3.9)).toBe('anxious-preoccupied');
    });

    it('returns dismissive-avoidant for low anxiety and high avoidance', () => {
      expect(determineSuggestedStyle(2, 5)).toBe('dismissive-avoidant');
      expect(determineSuggestedStyle(3.9, 4)).toBe('dismissive-avoidant');
    });

    it('returns fearful-avoidant for high anxiety and high avoidance', () => {
      expect(determineSuggestedStyle(5, 5)).toBe('fearful-avoidant');
      expect(determineSuggestedStyle(4, 4)).toBe('fearful-avoidant');
    });
  });

  describe('calculateAllScores', () => {
    it('returns scores for both dimensions', () => {
      const responses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 4 as LikertValue,
      }));

      const results = calculateAllScores(responses);
      expect(results.anxiety).toBeDefined();
      expect(results.avoidance).toBeDefined();
      expect(results.suggestedStyle).toBeDefined();
      expect(results.disclaimer).toBe(DIMENSIONAL_DISCLAIMER);
      expect(results.totalQuestions).toBe(9);
      expect(results.completedAt).toBeDefined();
    });

    it('calculates different scores for different response patterns', () => {
      // Low anxiety, low avoidance pattern (secure)
      const secureResponses: Response[] = [
        // Avoidance items - high agreement = low avoidance (reversed)
        { itemId: 1, value: 7 },
        { itemId: 2, value: 7 },
        { itemId: 3, value: 7 },
        { itemId: 4, value: 7 },
        // Anxiety items - low agreement = low anxiety
        { itemId: 5, value: 1 },
        { itemId: 6, value: 1 },
        { itemId: 7, value: 1 },
        { itemId: 8, value: 1 },
        { itemId: 9, value: 1 },
      ];
      const secureResults = calculateAllScores(secureResponses);
      expect(secureResults.suggestedStyle).toBe('secure');
      expect(secureResults.anxiety.meanScore).toBe(1);
      expect(secureResults.avoidance.meanScore).toBe(1);

      // High anxiety, high avoidance pattern (fearful-avoidant)
      const fearfulResponses: Response[] = [
        // Avoidance items - low agreement = high avoidance (reversed)
        { itemId: 1, value: 1 },
        { itemId: 2, value: 1 },
        { itemId: 3, value: 1 },
        { itemId: 4, value: 1 },
        // Anxiety items - high agreement = high anxiety
        { itemId: 5, value: 7 },
        { itemId: 6, value: 7 },
        { itemId: 7, value: 7 },
        { itemId: 8, value: 7 },
        { itemId: 9, value: 7 },
      ];
      const fearfulResults = calculateAllScores(fearfulResponses);
      expect(fearfulResults.suggestedStyle).toBe('fearful-avoidant');
      expect(fearfulResults.anxiety.meanScore).toBe(7);
      expect(fearfulResults.avoidance.meanScore).toBe(7);
    });
  });

  describe('getMeanScoreInterpretation', () => {
    it('returns correct interpretation for each range', () => {
      expect(getMeanScoreInterpretation(6.5)).toBe('Very High');
      expect(getMeanScoreInterpretation(6)).toBe('Very High');
      expect(getMeanScoreInterpretation(5.5)).toBe('High');
      expect(getMeanScoreInterpretation(5)).toBe('High');
      expect(getMeanScoreInterpretation(4.5)).toBe('Moderate-High');
      expect(getMeanScoreInterpretation(4)).toBe('Moderate-High');
      expect(getMeanScoreInterpretation(3.5)).toBe('Moderate-Low');
      expect(getMeanScoreInterpretation(3)).toBe('Moderate-Low');
      expect(getMeanScoreInterpretation(2.5)).toBe('Low');
      expect(getMeanScoreInterpretation(2)).toBe('Low');
      expect(getMeanScoreInterpretation(1.5)).toBe('Very Low');
      expect(getMeanScoreInterpretation(1)).toBe('Very Low');
    });
  });

  describe('getDimensionDescription', () => {
    it('returns high description for mean >= 4', () => {
      const desc = getDimensionDescription('anxiety', 5);
      expect(desc).toContain('worry');
    });

    it('returns low description for mean < 4', () => {
      const desc = getDimensionDescription('anxiety', 2);
      expect(desc).toContain('secure');
    });
  });

  describe('serialization', () => {
    describe('serializeResults / deserializeResults', () => {
      it('round-trips results correctly', () => {
        const responses: Response[] = items.map((item) => ({
          itemId: item.id,
          value: 4 as LikertValue,
        }));
        const results = calculateAllScores(responses);

        const serialized = serializeResults(results);
        const deserialized = deserializeResults(serialized);

        expect(deserialized).not.toBeNull();
        expect(deserialized?.anxiety.dimension).toBe(results.anxiety.dimension);
        expect(deserialized?.avoidance.dimension).toBe(results.avoidance.dimension);
        expect(deserialized?.totalQuestions).toBe(results.totalQuestions);
        expect(deserialized?.suggestedStyle).toBe(results.suggestedStyle);
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

describe('ECR Items Data Integrity', () => {
  it('has 9 items total (ECR-RS)', () => {
    expect(items.length).toBe(9);
  });

  it('has 2 dimensions', () => {
    expect(dimensions.length).toBe(2);
    expect(dimensions).toContain('anxiety');
    expect(dimensions).toContain('avoidance');
  });

  it('has 5 anxiety items', () => {
    const anxietyItems = items.filter((item) => item.dimension === 'anxiety');
    expect(anxietyItems.length).toBe(5);
  });

  it('has 4 avoidance items', () => {
    const avoidanceItems = items.filter((item) => item.dimension === 'avoidance');
    expect(avoidanceItems.length).toBe(4);
  });

  it('has unique item IDs', () => {
    const ids = items.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(items.length);
  });

  it('has mix of reversed and non-reversed items', () => {
    const reversed = items.filter((item) => item.isReversed);
    const nonReversed = items.filter((item) => !item.isReversed);
    expect(reversed.length).toBe(4); // All avoidance items are reversed
    expect(nonReversed.length).toBe(5); // All anxiety items are not reversed
  });

  it('all avoidance items are reversed', () => {
    const avoidanceItems = items.filter((item) => item.dimension === 'avoidance');
    expect(avoidanceItems.every((item) => item.isReversed)).toBe(true);
  });

  it('no anxiety items are reversed', () => {
    const anxietyItems = items.filter((item) => item.dimension === 'anxiety');
    expect(anxietyItems.every((item) => !item.isReversed)).toBe(true);
  });
});

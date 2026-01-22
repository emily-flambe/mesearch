// Unit tests for SD3 scoring logic
import { describe, it, expect } from 'vitest';
import {
  scoreItem,
  calculateMean,
  getItemsForTrait,
  calculateTraitScore,
  calculateAllScores,
  calculateTraitPercentile,
  getTraitLevel,
  getPercentileInterpretation,
  getTraitDescription,
  serializeResults,
  deserializeResults,
  serializeResponses,
  deserializeResponses,
  type Response,
} from './sd3-scoring';
import { items, traits, type Item, type DarkTrait } from './sd3-items';

describe('SD3 Scoring', () => {
  describe('scoreItem', () => {
    it('returns value unchanged for non-reversed items', () => {
      const item: Item = {
        id: 1,
        text: 'Test item',
        trait: 'machiavellianism',
        isReversed: false,
      };
      expect(scoreItem(item, 1)).toBe(1);
      expect(scoreItem(item, 3)).toBe(3);
      expect(scoreItem(item, 5)).toBe(5);
    });

    it('reverses value for reversed items (6 - value)', () => {
      const item: Item = {
        id: 11,
        text: 'I hate being the center of attention.',
        trait: 'narcissism',
        isReversed: true,
      };
      expect(scoreItem(item, 1)).toBe(5);
      expect(scoreItem(item, 2)).toBe(4);
      expect(scoreItem(item, 3)).toBe(3);
      expect(scoreItem(item, 4)).toBe(2);
      expect(scoreItem(item, 5)).toBe(1);
    });

    it('correctly handles actual reversed items from the SD3', () => {
      // Item 11: "I hate being the center of attention." (narcissism, reversed)
      const item11 = items.find((i) => i.id === 11)!;
      expect(item11.isReversed).toBe(true);
      expect(scoreItem(item11, 5)).toBe(1); // Strongly agree with hating attention = low narcissism

      // Item 17: "I am an average person." (narcissism, reversed)
      const item17 = items.find((i) => i.id === 17)!;
      expect(item17.isReversed).toBe(true);
      expect(scoreItem(item17, 5)).toBe(1); // Strongly agree with being average = low narcissism

      // Item 20: "I avoid dangerous situations." (psychopathy, reversed)
      const item20 = items.find((i) => i.id === 20)!;
      expect(item20.isReversed).toBe(true);
      expect(scoreItem(item20, 5)).toBe(1); // Strongly agree with avoiding danger = low psychopathy

      // Item 25: "I have never gotten into trouble with the law." (psychopathy, reversed)
      const item25 = items.find((i) => i.id === 25)!;
      expect(item25.isReversed).toBe(true);
      expect(scoreItem(item25, 5)).toBe(1); // Strongly agree with no legal trouble = low psychopathy
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

  describe('getItemsForTrait', () => {
    it('returns 9 items for each trait', () => {
      for (const trait of traits) {
        const traitItems = getItemsForTrait(trait);
        expect(traitItems.length).toBe(9);
        expect(traitItems.every((item) => item.trait === trait)).toBe(true);
      }
    });

    it('returns items with correct IDs for machiavellianism (1-9)', () => {
      const machItems = getItemsForTrait('machiavellianism');
      const ids = machItems.map((i) => i.id).sort((a, b) => a - b);
      expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('returns items with correct IDs for narcissism (10-18)', () => {
      const narcItems = getItemsForTrait('narcissism');
      const ids = narcItems.map((i) => i.id).sort((a, b) => a - b);
      expect(ids).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18]);
    });

    it('returns items with correct IDs for psychopathy (19-27)', () => {
      const psychItems = getItemsForTrait('psychopathy');
      const ids = psychItems.map((i) => i.id).sort((a, b) => a - b);
      expect(ids).toEqual([19, 20, 21, 22, 23, 24, 25, 26, 27]);
    });
  });

  describe('calculateTraitScore', () => {
    it('calculates trait score correctly with all same responses', () => {
      const traitItems = getItemsForTrait('machiavellianism');
      const responses = new Map<number, number>();

      // Set all responses to 4
      for (const item of traitItems) {
        responses.set(item.id, 4);
      }

      const score = calculateTraitScore('machiavellianism', responses);
      expect(score.trait).toBe('machiavellianism');
      expect(score.rawScore).toBe(36); // 9 items * 4
      expect(score.meanScore).toBe(4);
      expect(score.percentile).toBeGreaterThanOrEqual(0);
      expect(score.percentile).toBeLessThanOrEqual(100);
    });

    it('handles reverse-scored items correctly in narcissism', () => {
      // Narcissism has 3 reversed items: 11, 15, 17
      const responses = new Map<number, number>();

      // Non-reversed items (10, 12, 13, 14, 16, 18) = 4 each = 24
      // Reversed items (11, 15, 17) = 4 each -> 6-4=2 each = 6
      // Total raw = 30, mean = 30/9 = 3.33...

      for (const item of getItemsForTrait('narcissism')) {
        responses.set(item.id, 4);
      }

      const score = calculateTraitScore('narcissism', responses);
      // 6 non-reversed * 4 = 24
      // 3 reversed: 6-4=2 each = 6
      // Total = 30
      expect(score.rawScore).toBe(30);
      expect(score.meanScore).toBeCloseTo(30 / 9, 5);
    });

    it('handles reverse-scored items correctly in psychopathy', () => {
      // Psychopathy has 2 reversed items: 20, 25
      const responses = new Map<number, number>();

      for (const item of getItemsForTrait('psychopathy')) {
        responses.set(item.id, 5);
      }

      const score = calculateTraitScore('psychopathy', responses);
      // 7 non-reversed * 5 = 35
      // 2 reversed: 6-5=1 each = 2
      // Total = 37
      expect(score.rawScore).toBe(37);
      expect(score.meanScore).toBeCloseTo(37 / 9, 5);
    });

    it('handles missing responses gracefully', () => {
      const responses = new Map<number, number>();
      const score = calculateTraitScore('machiavellianism', responses);
      expect(score.rawScore).toBe(0);
      expect(score.meanScore).toBe(0);
    });
  });

  describe('calculateAllScores', () => {
    it('returns scores for all 3 traits', () => {
      const responses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 3,
      }));

      const results = calculateAllScores(responses);
      expect(results.traits.length).toBe(3);
      expect(results.totalQuestions).toBe(27);
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
      for (let i = 0; i < 3; i++) {
        expect(lowResults.traits[i].rawScore).not.toBe(highResults.traits[i].rawScore);
      }
    });
  });

  describe('getTraitLevel', () => {
    it('returns correct level for machiavellianism', () => {
      // Low: < 2.1, Average: 2.1-3.9, High: > 3.9
      expect(getTraitLevel('machiavellianism', 1.5)).toBe('low');
      expect(getTraitLevel('machiavellianism', 2.0)).toBe('low');
      expect(getTraitLevel('machiavellianism', 2.1)).toBe('average');
      expect(getTraitLevel('machiavellianism', 3.0)).toBe('average');
      expect(getTraitLevel('machiavellianism', 3.9)).toBe('average');
      expect(getTraitLevel('machiavellianism', 4.0)).toBe('high');
      expect(getTraitLevel('machiavellianism', 4.5)).toBe('high');
    });

    it('returns correct level for narcissism', () => {
      // Low: < 2.0, Average: 2.0-3.7, High: > 3.7
      expect(getTraitLevel('narcissism', 1.5)).toBe('low');
      expect(getTraitLevel('narcissism', 1.9)).toBe('low');
      expect(getTraitLevel('narcissism', 2.0)).toBe('average');
      expect(getTraitLevel('narcissism', 2.85)).toBe('average');
      expect(getTraitLevel('narcissism', 3.7)).toBe('average');
      expect(getTraitLevel('narcissism', 3.8)).toBe('high');
      expect(getTraitLevel('narcissism', 4.5)).toBe('high');
    });

    it('returns correct level for psychopathy', () => {
      // Low: < 1.2, Average: 1.2-2.8, High: > 2.8
      expect(getTraitLevel('psychopathy', 1.0)).toBe('low');
      expect(getTraitLevel('psychopathy', 1.1)).toBe('low');
      expect(getTraitLevel('psychopathy', 1.2)).toBe('average');
      expect(getTraitLevel('psychopathy', 2.0)).toBe('average');
      expect(getTraitLevel('psychopathy', 2.8)).toBe('average');
      expect(getTraitLevel('psychopathy', 2.9)).toBe('high');
      expect(getTraitLevel('psychopathy', 4.0)).toBe('high');
    });
  });

  describe('percentile calculations', () => {
    describe('calculateTraitPercentile', () => {
      it('returns percentile between 0 and 100', () => {
        for (const trait of traits) {
          const percentile = calculateTraitPercentile(trait, 3.0);
          expect(percentile).toBeGreaterThanOrEqual(0);
          expect(percentile).toBeLessThanOrEqual(100);
        }
      });

      it('returns higher percentile for higher scores', () => {
        const lowPercentile = calculateTraitPercentile('machiavellianism', 1.5);
        const highPercentile = calculateTraitPercentile('machiavellianism', 4.5);
        expect(highPercentile).toBeGreaterThan(lowPercentile);
      });

      it('returns ~50th percentile for mean score', () => {
        // Machiavellianism has mean of 3.0
        const percentile = calculateTraitPercentile('machiavellianism', 3.0);
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

  describe('getTraitDescription', () => {
    it('returns high description for percentile >= 50', () => {
      const desc = getTraitDescription('machiavellianism', 75);
      expect(desc).toContain('strategic');
    });

    it('returns low description for percentile < 50', () => {
      const desc = getTraitDescription('machiavellianism', 25);
      expect(desc).toContain('straightforward');
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
        expect(deserialized?.traits.length).toBe(results.traits.length);
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

describe('SD3 Items Data Integrity', () => {
  it('has 27 items total', () => {
    expect(items.length).toBe(27);
  });

  it('has 3 traits', () => {
    expect(traits.length).toBe(3);
    expect(traits).toContain('machiavellianism');
    expect(traits).toContain('narcissism');
    expect(traits).toContain('psychopathy');
  });

  it('has 9 items per trait', () => {
    for (const trait of traits) {
      const traitItems = items.filter((item) => item.trait === trait);
      expect(traitItems.length).toBe(9);
    }
  });

  it('has unique item IDs', () => {
    const ids = items.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(items.length);
  });

  it('has sequential item IDs from 1-27', () => {
    const ids = items.map((item) => item.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 27 }, (_, i) => i + 1));
  });

  it('has correct number of reversed items per trait', () => {
    // Machiavellianism: 0 reversed
    const machReversed = items.filter((i) => i.trait === 'machiavellianism' && i.isReversed);
    expect(machReversed.length).toBe(0);

    // Narcissism: 3 reversed (11, 15, 17)
    const narcReversed = items.filter((i) => i.trait === 'narcissism' && i.isReversed);
    expect(narcReversed.length).toBe(3);
    expect(narcReversed.map((i) => i.id).sort((a, b) => a - b)).toEqual([11, 15, 17]);

    // Psychopathy: 2 reversed (20, 25)
    const psychReversed = items.filter((i) => i.trait === 'psychopathy' && i.isReversed);
    expect(psychReversed.length).toBe(2);
    expect(psychReversed.map((i) => i.id).sort((a, b) => a - b)).toEqual([20, 25]);
  });

  it('has mix of reversed and non-reversed items overall', () => {
    const reversed = items.filter((item) => item.isReversed);
    const nonReversed = items.filter((item) => !item.isReversed);
    expect(reversed.length).toBe(5); // 0 + 3 + 2
    expect(nonReversed.length).toBe(22);
  });
});

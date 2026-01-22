// Unit tests for Communication Styles (Love Languages) scoring logic
import { describe, it, expect } from 'vitest';
import {
  getItemById,
  getSelectedStyle,
  countStyleOccurrences,
  getMaxPossibleSelections,
  calculateStyleScores,
  calculateResults,
  getScoreInterpretation,
  serializeResponses,
  deserializeResponses,
  serializeResults,
  deserializeResults,
  type ForcedChoiceResponse,
} from './love-languages-scoring';
import { items, allStyles, type CommunicationStyle } from './love-languages-items';

describe('Communication Styles Scoring', () => {
  describe('getItemById', () => {
    it('returns the correct item for a valid ID', () => {
      const item = getItemById(1);
      expect(item).toBeDefined();
      expect(item?.id).toBe(1);
    });

    it('returns undefined for an invalid ID', () => {
      const item = getItemById(999);
      expect(item).toBeUndefined();
    });
  });

  describe('getSelectedStyle', () => {
    it('returns option A style when A is selected', () => {
      const response: ForcedChoiceResponse = { itemId: 1, selectedOption: 'A' };
      const style = getSelectedStyle(response);
      const item = getItemById(1);
      expect(style).toBe(item?.optionA.style);
    });

    it('returns option B style when B is selected', () => {
      const response: ForcedChoiceResponse = { itemId: 1, selectedOption: 'B' };
      const style = getSelectedStyle(response);
      const item = getItemById(1);
      expect(style).toBe(item?.optionB.style);
    });

    it('returns null for invalid item ID', () => {
      const response: ForcedChoiceResponse = { itemId: 999, selectedOption: 'A' };
      const style = getSelectedStyle(response);
      expect(style).toBeNull();
    });
  });

  describe('countStyleOccurrences', () => {
    it('counts occurrences correctly', () => {
      const counts = countStyleOccurrences();

      // With 30 items where each style appears in pairs with 4 others, 3 times each
      // Each style should appear 12 times (4 other styles * 3 pairs each)
      for (const style of allStyles) {
        expect(counts[style]).toBe(12);
      }
    });

    it('total occurrences equals 2x number of items', () => {
      const counts = countStyleOccurrences();
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      // Each item has 2 options, so total = items.length * 2
      expect(total).toBe(items.length * 2);
    });
  });

  describe('getMaxPossibleSelections', () => {
    it('returns 12 for each style', () => {
      for (const style of allStyles) {
        expect(getMaxPossibleSelections(style)).toBe(12);
      }
    });
  });

  describe('calculateStyleScores', () => {
    it('returns empty counts for empty responses', () => {
      const scores = calculateStyleScores([]);
      expect(scores.length).toBe(5);
      for (const score of scores) {
        expect(score.count).toBe(0);
        expect(score.percentage).toBe(0);
      }
    });

    it('correctly counts selections for a single style', () => {
      // Create responses where we always select 'words' when available
      const responses: ForcedChoiceResponse[] = [];
      for (const item of items) {
        if (item.optionA.style === 'words') {
          responses.push({ itemId: item.id, selectedOption: 'A' });
        } else if (item.optionB.style === 'words') {
          responses.push({ itemId: item.id, selectedOption: 'B' });
        }
      }

      const scores = calculateStyleScores(responses);
      const wordsScore = scores.find((s) => s.style === 'words');
      expect(wordsScore?.count).toBe(12); // 'words' appears 12 times
      expect(wordsScore?.percentage).toBe(100);
    });

    it('scores are sorted by count descending', () => {
      // Create varied responses
      const responses: ForcedChoiceResponse[] = items.slice(0, 10).map((item) => ({
        itemId: item.id,
        selectedOption: 'A' as const,
      }));

      const scores = calculateStyleScores(responses);

      // Verify sorted by count descending
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i].count).toBeGreaterThanOrEqual(scores[i + 1].count);
      }
    });

    it('includes name and color for each style', () => {
      const scores = calculateStyleScores([]);
      for (const score of scores) {
        expect(score.name).toBeDefined();
        expect(score.name.length).toBeGreaterThan(0);
        expect(score.color).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
  });

  describe('calculateResults', () => {
    it('returns results with primary and secondary styles', () => {
      // Create responses favoring 'words' then 'time'
      const responses: ForcedChoiceResponse[] = [];

      // Select 'words' for all its items
      for (const item of items) {
        if (item.optionA.style === 'words') {
          responses.push({ itemId: item.id, selectedOption: 'A' });
        } else if (item.optionB.style === 'words') {
          responses.push({ itemId: item.id, selectedOption: 'B' });
        }
      }

      // Select 'time' for remaining items where it appears
      for (const item of items) {
        const alreadyAnswered = responses.some((r) => r.itemId === item.id);
        if (alreadyAnswered) continue;

        if (item.optionA.style === 'time') {
          responses.push({ itemId: item.id, selectedOption: 'A' });
        } else if (item.optionB.style === 'time') {
          responses.push({ itemId: item.id, selectedOption: 'B' });
        }
      }

      const results = calculateResults(responses);
      expect(results.primary).toBe('words');
      expect(results.secondary).toBe('time');
    });

    it('includes completion timestamp', () => {
      const results = calculateResults([]);
      expect(results.completedAt).toBeDefined();
      expect(new Date(results.completedAt).getTime()).toBeGreaterThan(0);
    });

    it('includes total questions count', () => {
      const responses: ForcedChoiceResponse[] = items.map((item) => ({
        itemId: item.id,
        selectedOption: 'A',
      }));
      const results = calculateResults(responses);
      expect(results.totalQuestions).toBe(items.length);
    });

    it('styles array has 5 elements', () => {
      const results = calculateResults([]);
      expect(results.styles.length).toBe(5);
    });
  });

  describe('getScoreInterpretation', () => {
    it('returns correct interpretation for each range', () => {
      expect(getScoreInterpretation(100)).toBe('Very Strong');
      expect(getScoreInterpretation(80)).toBe('Very Strong');
      expect(getScoreInterpretation(79)).toBe('Strong');
      expect(getScoreInterpretation(60)).toBe('Strong');
      expect(getScoreInterpretation(59)).toBe('Moderate');
      expect(getScoreInterpretation(40)).toBe('Moderate');
      expect(getScoreInterpretation(39)).toBe('Low');
      expect(getScoreInterpretation(20)).toBe('Low');
      expect(getScoreInterpretation(19)).toBe('Very Low');
      expect(getScoreInterpretation(0)).toBe('Very Low');
    });
  });

  describe('serialization', () => {
    describe('serializeResponses / deserializeResponses', () => {
      it('round-trips responses correctly', () => {
        const responses: ForcedChoiceResponse[] = [
          { itemId: 1, selectedOption: 'A' },
          { itemId: 2, selectedOption: 'B' },
          { itemId: 3, selectedOption: 'A' },
        ];

        const serialized = serializeResponses(responses);
        const deserialized = deserializeResponses(serialized);

        expect(deserialized).toEqual(responses);
      });

      it('returns null for invalid JSON', () => {
        expect(deserializeResponses('invalid json')).toBeNull();
        expect(deserializeResponses('{broken')).toBeNull();
      });
    });

    describe('serializeResults / deserializeResults', () => {
      it('round-trips results correctly', () => {
        const responses: ForcedChoiceResponse[] = items.map((item) => ({
          itemId: item.id,
          selectedOption: 'A',
        }));
        const results = calculateResults(responses);

        const serialized = serializeResults(results);
        const deserialized = deserializeResults(serialized);

        expect(deserialized).toEqual(results);
      });

      it('returns null for invalid JSON', () => {
        expect(deserializeResults('invalid json')).toBeNull();
        expect(deserializeResults('{broken')).toBeNull();
      });
    });
  });
});

describe('Communication Styles Items Data Integrity', () => {
  it('has 30 items total', () => {
    expect(items.length).toBe(30);
  });

  it('has 5 communication styles', () => {
    expect(allStyles.length).toBe(5);
    expect(allStyles).toContain('words');
    expect(allStyles).toContain('time');
    expect(allStyles).toContain('gifts');
    expect(allStyles).toContain('service');
    expect(allStyles).toContain('touch');
  });

  it('each item has two different styles', () => {
    for (const item of items) {
      expect(item.optionA.style).not.toBe(item.optionB.style);
    }
  });

  it('each style pair appears exactly 3 times', () => {
    const pairCounts = new Map<string, number>();

    for (const item of items) {
      const styles = [item.optionA.style, item.optionB.style].sort();
      const key = styles.join('-');
      pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
    }

    // With 5 styles, there are 10 unique pairs (5 choose 2)
    expect(pairCounts.size).toBe(10);

    // Each pair should appear 3 times
    for (const [, count] of pairCounts) {
      expect(count).toBe(3);
    }
  });

  it('has unique item IDs', () => {
    const ids = items.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(items.length);
  });

  it('all items have non-empty text for both options', () => {
    for (const item of items) {
      expect(item.optionA.text.length).toBeGreaterThan(0);
      expect(item.optionB.text.length).toBeGreaterThan(0);
    }
  });

  it('each style appears 12 times total', () => {
    const styleCounts = new Map<CommunicationStyle, number>();

    for (const item of items) {
      styleCounts.set(item.optionA.style, (styleCounts.get(item.optionA.style) || 0) + 1);
      styleCounts.set(item.optionB.style, (styleCounts.get(item.optionB.style) || 0) + 1);
    }

    for (const style of allStyles) {
      expect(styleCounts.get(style)).toBe(12);
    }
  });
});

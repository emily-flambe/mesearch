// Unit tests for Enneagram scoring logic
import { describe, it, expect } from 'vitest';
import {
  calculateRawScores,
  calculateTypeScores,
  getPrimaryType,
  getWing,
  formatWingLabel,
  calculateEnneagramResult,
  sortScoresByPercentage,
  type TypeNumber,
  type TypeScore,
} from './enneagram-scoring';
import { enneagramItems, type LikertValue } from './enneagram-items';

describe('Enneagram Scoring', () => {
  describe('calculateRawScores', () => {
    it('initializes all 9 types to 0 with empty responses', () => {
      const scores = calculateRawScores({});
      expect(scores.size).toBe(9);
      for (let i = 1; i <= 9; i++) {
        expect(scores.get(i as TypeNumber)).toBe(0);
      }
    });

    it('sums responses for each type correctly', () => {
      // Answer all Type 1 questions (ids 1-4) with 5
      const responses: Record<number, LikertValue> = {
        1: 5,
        2: 5,
        3: 5,
        4: 5,
      };
      const scores = calculateRawScores(responses);
      expect(scores.get(1)).toBe(20); // 4 items * 5 = 20
    });

    it('handles mixed responses across types', () => {
      // Type 1 (ids 1-4): value 3 each = 12
      // Type 2 (ids 5-8): value 4 each = 16
      const responses: Record<number, LikertValue> = {
        1: 3,
        2: 3,
        3: 3,
        4: 3,
        5: 4,
        6: 4,
        7: 4,
        8: 4,
      };
      const scores = calculateRawScores(responses);
      expect(scores.get(1)).toBe(12);
      expect(scores.get(2)).toBe(16);
    });

    it('ignores responses for non-existent items', () => {
      const responses: Record<number, LikertValue> = {
        999: 5, // non-existent item
      };
      const scores = calculateRawScores(responses);
      // All types should be 0
      for (let i = 1; i <= 9; i++) {
        expect(scores.get(i as TypeNumber)).toBe(0);
      }
    });
  });

  describe('calculateTypeScores', () => {
    it('returns scores for all 9 types', () => {
      const scores = calculateTypeScores({});
      expect(scores.length).toBe(9);
    });

    it('calculates percentage correctly', () => {
      // Max score per type is 4 items * 5 = 20
      // If we score 10, percentage should be 50%
      const responses: Record<number, LikertValue> = {
        1: 2,
        2: 2,
        3: 3,
        4: 3, // Total for Type 1 = 10
      };
      const scores = calculateTypeScores(responses);
      const type1Score = scores.find((s) => s.type === 1);
      expect(type1Score?.rawScore).toBe(10);
      expect(type1Score?.maxScore).toBe(20);
      expect(type1Score?.percentage).toBe(50);
    });

    it('calculates 100% for max scores', () => {
      // All 5s for Type 4 (ids 13-16)
      const responses: Record<number, LikertValue> = {
        13: 5,
        14: 5,
        15: 5,
        16: 5,
      };
      const scores = calculateTypeScores(responses);
      const type4Score = scores.find((s) => s.type === 4);
      expect(type4Score?.percentage).toBe(100);
    });

    it('calculates 0% for zero scores', () => {
      const scores = calculateTypeScores({});
      expect(scores[0].percentage).toBe(0);
    });
  });

  describe('getPrimaryType', () => {
    it('returns type with highest raw score', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 2, rawScore: 15, maxScore: 20, percentage: 75 },
        { type: 3, rawScore: 8, maxScore: 20, percentage: 40 },
        { type: 4, rawScore: 20, maxScore: 20, percentage: 100 }, // Highest
        { type: 5, rawScore: 12, maxScore: 20, percentage: 60 },
        { type: 6, rawScore: 14, maxScore: 20, percentage: 70 },
        { type: 7, rawScore: 11, maxScore: 20, percentage: 55 },
        { type: 8, rawScore: 9, maxScore: 20, percentage: 45 },
        { type: 9, rawScore: 13, maxScore: 20, percentage: 65 },
      ];
      expect(getPrimaryType(scores)).toBe(4);
    });

    it('returns first type when multiple have same score', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 15, maxScore: 20, percentage: 75 },
        { type: 2, rawScore: 15, maxScore: 20, percentage: 75 },
        { type: 3, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 4, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 5, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 6, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 7, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 8, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 9, rawScore: 10, maxScore: 20, percentage: 50 },
      ];
      // Type 1 appears first in the array and has highest score
      expect(getPrimaryType(scores)).toBe(1);
    });
  });

  describe('getWing', () => {
    // Wing definitions: Type 1 -> [9, 2], Type 4 -> [3, 5], Type 9 -> [8, 1]

    it('returns adjacent type with higher score (Type 4)', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 2, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 3, rawScore: 12, maxScore: 20, percentage: 60 }, // Wing option 1
        { type: 4, rawScore: 18, maxScore: 20, percentage: 90 }, // Primary
        { type: 5, rawScore: 15, maxScore: 20, percentage: 75 }, // Wing option 2 - higher
        { type: 6, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 7, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 8, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 9, rawScore: 10, maxScore: 20, percentage: 50 },
      ];
      expect(getWing(4, scores)).toBe(5);
    });

    it('returns first wing when scores are equal', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 2, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 3, rawScore: 12, maxScore: 20, percentage: 60 }, // Equal
        { type: 4, rawScore: 18, maxScore: 20, percentage: 90 },
        { type: 5, rawScore: 12, maxScore: 20, percentage: 60 }, // Equal
        { type: 6, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 7, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 8, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 9, rawScore: 10, maxScore: 20, percentage: 50 },
      ];
      // Type 4's wings are [3, 5], both score 12, so wing1 (3) wins
      expect(getWing(4, scores)).toBe(3);
    });

    it('handles Type 1 wings correctly (9 and 2)', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 18, maxScore: 20, percentage: 90 },
        { type: 2, rawScore: 14, maxScore: 20, percentage: 70 }, // Wing option
        { type: 3, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 4, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 5, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 6, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 7, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 8, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 9, rawScore: 8, maxScore: 20, percentage: 40 }, // Wing option - lower
      ];
      expect(getWing(1, scores)).toBe(2);
    });

    it('handles Type 9 wings correctly (8 and 1)', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 16, maxScore: 20, percentage: 80 }, // Wing option - higher
        { type: 2, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 3, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 4, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 5, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 6, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 7, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 8, rawScore: 12, maxScore: 20, percentage: 60 }, // Wing option
        { type: 9, rawScore: 18, maxScore: 20, percentage: 90 },
      ];
      expect(getWing(9, scores)).toBe(1);
    });
  });

  describe('formatWingLabel', () => {
    it('formats wing label correctly', () => {
      expect(formatWingLabel(4, 5)).toBe('4w5');
      expect(formatWingLabel(1, 9)).toBe('1w9');
      expect(formatWingLabel(9, 1)).toBe('9w1');
      expect(formatWingLabel(7, 8)).toBe('7w8');
    });
  });

  describe('calculateEnneagramResult', () => {
    it('returns complete result with all fields', () => {
      // Create responses that make Type 5 dominant with Type 4 wing
      const responses: Record<number, LikertValue> = {};

      // Type 5 items (ids 17-20) - highest scores
      for (let i = 17; i <= 20; i++) {
        responses[i] = 5;
      }

      // Type 4 items (ids 13-16) - second highest (wing)
      for (let i = 13; i <= 16; i++) {
        responses[i] = 4;
      }

      // Type 6 items (ids 21-24) - lower than Type 4
      for (let i = 21; i <= 24; i++) {
        responses[i] = 2;
      }

      // Fill remaining with low scores
      for (const item of enneagramItems) {
        if (responses[item.id] === undefined) {
          responses[item.id] = 1;
        }
      }

      const result = calculateEnneagramResult(responses);
      expect(result.scores.length).toBe(9);
      expect(result.primaryType).toBe(5);
      expect(result.wing).toBe(4); // Type 5's wings are [4, 6], and Type 4 scored higher
      expect(result.wingLabel).toBe('5w4');
    });

    it('handles all neutral responses', () => {
      const responses: Record<number, LikertValue> = {};
      for (const item of enneagramItems) {
        responses[item.id] = 3;
      }

      const result = calculateEnneagramResult(responses);
      expect(result.scores.length).toBe(9);
      expect(result.primaryType).toBeGreaterThanOrEqual(1);
      expect(result.primaryType).toBeLessThanOrEqual(9);
      expect(result.wingLabel).toMatch(/^\dw\d$/);
    });
  });

  describe('sortScoresByPercentage', () => {
    it('sorts scores from highest to lowest percentage', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 2, rawScore: 18, maxScore: 20, percentage: 90 },
        { type: 3, rawScore: 6, maxScore: 20, percentage: 30 },
      ];

      const sorted = sortScoresByPercentage(scores);
      expect(sorted[0].percentage).toBe(90);
      expect(sorted[1].percentage).toBe(50);
      expect(sorted[2].percentage).toBe(30);
    });

    it('does not mutate original array', () => {
      const scores: TypeScore[] = [
        { type: 1, rawScore: 10, maxScore: 20, percentage: 50 },
        { type: 2, rawScore: 18, maxScore: 20, percentage: 90 },
      ];

      const sorted = sortScoresByPercentage(scores);
      expect(scores[0].type).toBe(1); // Original unchanged
      expect(sorted[0].type).toBe(2); // Sorted has type 2 first
    });
  });
});

describe('Enneagram Items Data Integrity', () => {
  it('has 36 items total (4 per type)', () => {
    expect(enneagramItems.length).toBe(36);
  });

  it('has 4 items for each of the 9 types', () => {
    for (let type = 1; type <= 9; type++) {
      const typeItems = enneagramItems.filter((item) => item.type === type);
      expect(typeItems.length).toBe(4);
    }
  });

  it('has unique item IDs', () => {
    const ids = enneagramItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(enneagramItems.length);
  });

  it('has sequential item IDs from 1 to 36', () => {
    const ids = enneagramItems.map((item) => item.id).sort((a, b) => a - b);
    for (let i = 0; i < 36; i++) {
      expect(ids[i]).toBe(i + 1);
    }
  });

  it('all items have non-empty text', () => {
    for (const item of enneagramItems) {
      expect(item.text.length).toBeGreaterThan(0);
    }
  });

  it('all item types are valid (1-9)', () => {
    for (const item of enneagramItems) {
      expect(item.type).toBeGreaterThanOrEqual(1);
      expect(item.type).toBeLessThanOrEqual(9);
    }
  });
});

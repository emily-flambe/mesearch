// Unit tests for MBTI scoring logic
import { describe, it, expect } from 'vitest';
import {
  scoreItem,
  getItemsForDimension,
  calculateDimensionScore,
  calculateAllScores,
  getConfidenceDescription,
  getPoleDescription,
  getPoleName,
  serializeResults,
  deserializeResults,
  serializeResponses,
  deserializeResponses,
  type Response,
} from './mbti-scoring';
import { items, dimensions, dimensionInfo } from './mbti-items';

describe('MBTI Scoring', () => {
  describe('scoreItem', () => {
    it('converts 1-5 scale to 0-4 contribution toward right pole', () => {
      expect(scoreItem(1)).toBe(0);
      expect(scoreItem(2)).toBe(1);
      expect(scoreItem(3)).toBe(2);
      expect(scoreItem(4)).toBe(3);
      expect(scoreItem(5)).toBe(4);
    });
  });

  describe('getItemsForDimension', () => {
    it('returns 8 items for each dimension', () => {
      for (const dim of dimensions) {
        const dimItems = getItemsForDimension(dim);
        expect(dimItems.length).toBe(8);
        expect(dimItems.every((item) => item.dimension === dim)).toBe(true);
      }
    });
  });

  describe('calculateDimensionScore', () => {
    it('calculates 50% when all answers are neutral (3)', () => {
      const dimItems = getItemsForDimension('EI');
      const responses = new Map<number, number>();

      for (const item of dimItems) {
        responses.set(item.id, 3);
      }

      const score = calculateDimensionScore('EI', responses);
      expect(score.dimension).toBe('EI');
      expect(score.percentage).toBe(50);
      expect(score.confidence).toBe('slight');
    });

    it('calculates 0% when all answers are 1 (strongly left)', () => {
      const dimItems = getItemsForDimension('EI');
      const responses = new Map<number, number>();

      for (const item of dimItems) {
        responses.set(item.id, 1);
      }

      const score = calculateDimensionScore('EI', responses);
      expect(score.percentage).toBe(0);
      expect(score.preference).toBe('E'); // Left pole
      expect(score.confidence).toBe('very clear');
    });

    it('calculates 100% when all answers are 5 (strongly right)', () => {
      const dimItems = getItemsForDimension('EI');
      const responses = new Map<number, number>();

      for (const item of dimItems) {
        responses.set(item.id, 5);
      }

      const score = calculateDimensionScore('EI', responses);
      expect(score.percentage).toBe(100);
      expect(score.preference).toBe('I'); // Right pole
      expect(score.confidence).toBe('very clear');
    });

    it('assigns correct confidence levels', () => {
      const dimItems = getItemsForDimension('SN');
      const responses = new Map<number, number>();

      // Slight preference (45-55%)
      for (const item of dimItems) {
        responses.set(item.id, 3);
      }
      let score = calculateDimensionScore('SN', responses);
      expect(score.confidence).toBe('slight');

      // Moderate preference (30-45% or 55-70%)
      responses.clear();
      for (const item of dimItems) {
        responses.set(item.id, 4);
      }
      score = calculateDimensionScore('SN', responses);
      expect(score.percentage).toBe(75);
      expect(score.confidence).toBe('clear');
    });

    it('handles missing responses gracefully', () => {
      const responses = new Map<number, number>();
      const score = calculateDimensionScore('TF', responses);
      expect(score.percentage).toBe(50);
      expect(score.leftScore).toBe(0);
      expect(score.rightScore).toBe(0);
    });
  });

  describe('calculateAllScores', () => {
    it('returns scores for all 4 dimensions', () => {
      const responses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 3,
      }));

      const results = calculateAllScores(responses);
      expect(results.dimensions.length).toBe(4);
      expect(results.totalQuestions).toBe(items.length);
      expect(results.completedAt).toBeDefined();
    });

    it('generates correct type string for all left preferences', () => {
      const responses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 1,
      }));

      const results = calculateAllScores(responses);
      expect(results.type).toBe('ESTJ');
    });

    it('generates correct type string for all right preferences', () => {
      const responses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: 5,
      }));

      const results = calculateAllScores(responses);
      expect(results.type).toBe('INFP');
    });

    it('calculates different types for different response patterns', () => {
      // Introvert pattern
      const introvertResponses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: item.dimension === 'EI' ? 5 : 3,
      }));
      const introvertResults = calculateAllScores(introvertResponses);
      expect(introvertResults.type[0]).toBe('I');

      // Extrovert pattern
      const extrovertResponses: Response[] = items.map((item) => ({
        itemId: item.id,
        value: item.dimension === 'EI' ? 1 : 3,
      }));
      const extrovertResults = calculateAllScores(extrovertResponses);
      expect(extrovertResults.type[0]).toBe('E');
    });
  });

  describe('getConfidenceDescription', () => {
    it('returns appropriate descriptions for each confidence level', () => {
      expect(getConfidenceDescription('slight')).toContain('slight');
      expect(getConfidenceDescription('moderate')).toContain('moderate');
      expect(getConfidenceDescription('clear')).toContain('clear');
      expect(getConfidenceDescription('very clear')).toContain('very clear');
    });
  });

  describe('getPoleDescription', () => {
    it('returns left pole description for left poles', () => {
      const desc = getPoleDescription('EI', 'E');
      expect(desc).toBe(dimensionInfo.EI.leftPole.description);
    });

    it('returns right pole description for right poles', () => {
      const desc = getPoleDescription('EI', 'I');
      expect(desc).toBe(dimensionInfo.EI.rightPole.description);
    });
  });

  describe('getPoleName', () => {
    it('returns correct pole names', () => {
      expect(getPoleName('EI', 'E')).toBe('Extraversion');
      expect(getPoleName('EI', 'I')).toBe('Introversion');
      expect(getPoleName('SN', 'S')).toBe('Sensing');
      expect(getPoleName('SN', 'N')).toBe('Intuition');
      expect(getPoleName('TF', 'T')).toBe('Thinking');
      expect(getPoleName('TF', 'F')).toBe('Feeling');
      expect(getPoleName('JP', 'J')).toBe('Judging');
      expect(getPoleName('JP', 'P')).toBe('Perceiving');
    });
  });

  describe('serialization', () => {
    describe('serializeResults / deserializeResults', () => {
      it('round-trips results correctly', () => {
        const responses: Response[] = items.map((item) => ({
          itemId: item.id,
          value: 3,
        }));
        const results = calculateAllScores(responses);

        const serialized = serializeResults(results);
        const deserialized = deserializeResults(serialized);

        expect(deserialized).not.toBeNull();
        expect(deserialized?.type).toBe(results.type);
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

describe('MBTI Items Data Integrity', () => {
  it('has 32 items total', () => {
    expect(items.length).toBe(32);
  });

  it('has 4 dimensions', () => {
    expect(dimensions.length).toBe(4);
    expect(dimensions).toContain('EI');
    expect(dimensions).toContain('SN');
    expect(dimensions).toContain('TF');
    expect(dimensions).toContain('JP');
  });

  it('has 8 items per dimension', () => {
    for (const dim of dimensions) {
      const dimItems = items.filter((item) => item.dimension === dim);
      expect(dimItems.length).toBe(8);
    }
  });

  it('has unique item IDs', () => {
    const ids = items.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(items.length);
  });

  it('has sequential IDs from 1 to 32', () => {
    const ids = items.map((item) => item.id).sort((a, b) => a - b);
    for (let i = 0; i < 32; i++) {
      expect(ids[i]).toBe(i + 1);
    }
  });

  it('has valid dimension info for each dimension', () => {
    for (const dim of dimensions) {
      const info = dimensionInfo[dim];
      expect(info).toBeDefined();
      expect(info.code).toBe(dim);
      expect(info.name).toBeDefined();
      expect(info.leftPole).toBeDefined();
      expect(info.rightPole).toBeDefined();
      expect(info.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('has consistent pole assignments for each dimension', () => {
    const expectedPoles: Record<string, [string, string]> = {
      EI: ['E', 'I'],
      SN: ['S', 'N'],
      TF: ['T', 'F'],
      JP: ['J', 'P'],
    };

    for (const dim of dimensions) {
      const dimItems = items.filter((item) => item.dimension === dim);
      const [leftPole, rightPole] = expectedPoles[dim];

      for (const item of dimItems) {
        expect(item.leftPole).toBe(leftPole);
        expect(item.rightPole).toBe(rightPole);
      }
    }
  });
});

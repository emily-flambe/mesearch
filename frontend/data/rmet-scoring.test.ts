// Unit tests for RMET scoring logic
import { describe, it, expect } from 'vitest';
import {
  isCorrect,
  calculateItemResult,
  calculatePercentile,
  getInterpretation,
  getScoreLevel,
  calculateResults,
  serializeResults,
  deserializeResults,
  serializeResponses,
  deserializeResponses,
  type RMETResponse,
} from './rmet-scoring';
import {
  rmetItems,
  scoredItems,
  practiceItem,
  getDefinition,
  hasDefinition,
  vocabularyDefinitions,
} from './rmet-items';

describe('RMET Items Data Integrity', () => {
  it('has 38 items total (1 practice + 37 scored)', () => {
    expect(rmetItems.length).toBe(38);
  });

  it('has 37 scored items', () => {
    expect(scoredItems.length).toBe(37);
  });

  it('has 1 practice item with id 0', () => {
    expect(practiceItem).toBeDefined();
    expect(practiceItem.id).toBe(0);
  });

  it('scored items have ids 1-37', () => {
    const ids = scoredItems.map((item) => item.id);
    for (let i = 1; i <= 37; i++) {
      expect(ids).toContain(i);
    }
  });

  it('each item has exactly 4 options', () => {
    for (const item of rmetItems) {
      expect(item.options.length).toBe(4);
    }
  });

  it('each item has a correct answer in its options', () => {
    for (const item of rmetItems) {
      const correctInOptions = item.options.some(
        (opt) => opt.toLowerCase() === item.correctAnswer.toLowerCase()
      );
      expect(correctInOptions).toBe(true);
    }
  });

  it('has unique item IDs', () => {
    const ids = rmetItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(rmetItems.length);
  });
});

describe('Vocabulary Definitions', () => {
  it('has definitions for difficult words', () => {
    expect(Object.keys(vocabularyDefinitions).length).toBeGreaterThan(0);
  });

  it('getDefinition returns definition for known word', () => {
    expect(getDefinition('aghast')).toBe('Filled with horror or shock');
    expect(getDefinition('contemplative')).toBe('Deep in thought; meditative');
  });

  it('getDefinition returns undefined for unknown word', () => {
    expect(getDefinition('happy')).toBeUndefined();
    expect(getDefinition('unknown')).toBeUndefined();
  });

  it('getDefinition is case-insensitive', () => {
    expect(getDefinition('AGHAST')).toBe(getDefinition('aghast'));
    expect(getDefinition('Contemplative')).toBe(getDefinition('contemplative'));
  });

  it('hasDefinition returns true for known words', () => {
    expect(hasDefinition('aghast')).toBe(true);
    expect(hasDefinition('contemplative')).toBe(true);
  });

  it('hasDefinition returns false for unknown words', () => {
    expect(hasDefinition('happy')).toBe(false);
    expect(hasDefinition('unknown')).toBe(false);
  });

  it('hasDefinition is case-insensitive', () => {
    expect(hasDefinition('AGHAST')).toBe(true);
    expect(hasDefinition('Contemplative')).toBe(true);
  });
});

describe('RMET Scoring', () => {
  describe('isCorrect', () => {
    it('returns true for correct answer', () => {
      const item = scoredItems[0]; // id: 1, correctAnswer: 'friendly'
      expect(isCorrect(item, item.correctAnswer)).toBe(true);
    });

    it('returns false for incorrect answer', () => {
      const item = scoredItems[0];
      const wrongAnswer = item.options.find((opt) => opt !== item.correctAnswer)!;
      expect(isCorrect(item, wrongAnswer)).toBe(false);
    });

    it('is case-insensitive', () => {
      const item = scoredItems[0];
      expect(isCorrect(item, item.correctAnswer.toUpperCase())).toBe(true);
      expect(isCorrect(item, item.correctAnswer.charAt(0).toUpperCase() + item.correctAnswer.slice(1))).toBe(true);
    });
  });

  describe('calculateItemResult', () => {
    it('marks correct answer as correct', () => {
      const item = scoredItems[0];
      const response: RMETResponse = {
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
      };

      const result = calculateItemResult(item, response);
      expect(result.correct).toBe(true);
      expect(result.selectedAnswer).toBe(item.correctAnswer);
      expect(result.correctAnswer).toBe(item.correctAnswer);
    });

    it('marks incorrect answer as incorrect', () => {
      const item = scoredItems[0];
      const wrongAnswer = item.options.find((opt) => opt !== item.correctAnswer)!;
      const response: RMETResponse = {
        itemId: item.id,
        selectedAnswer: wrongAnswer,
      };

      const result = calculateItemResult(item, response);
      expect(result.correct).toBe(false);
    });

    it('includes response time when provided', () => {
      const item = scoredItems[0];
      const response: RMETResponse = {
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
        responseTime: 5000,
      };

      const result = calculateItemResult(item, response);
      expect(result.responseTime).toBe(5000);
    });
  });

  describe('calculatePercentile', () => {
    it('returns percentile between 0 and 100', () => {
      for (let score = 0; score <= 37; score++) {
        const percentile = calculatePercentile(score);
        expect(percentile).toBeGreaterThanOrEqual(0);
        expect(percentile).toBeLessThanOrEqual(100);
      }
    });

    it('returns higher percentile for higher scores', () => {
      const lowPercentile = calculatePercentile(15);
      const midPercentile = calculatePercentile(27);
      const highPercentile = calculatePercentile(33);

      expect(midPercentile).toBeGreaterThan(lowPercentile);
      expect(highPercentile).toBeGreaterThan(midPercentile);
    });

    it('returns ~50th percentile for mean score (27)', () => {
      const percentile = calculatePercentile(27);
      expect(percentile).toBeGreaterThanOrEqual(45);
      expect(percentile).toBeLessThanOrEqual(55);
    });
  });

  describe('getInterpretation', () => {
    it('returns above-average interpretation for high scores', () => {
      const interpretation = getInterpretation(32);
      expect(interpretation.toLowerCase()).toContain('above-average');
    });

    it('returns typical range interpretation for average scores', () => {
      const interpretation = getInterpretation(26);
      expect(interpretation.toLowerCase()).toContain('typical');
    });

    it('returns below range interpretation for low scores', () => {
      const interpretation = getInterpretation(15);
      expect(interpretation.toLowerCase()).toContain('below');
    });

    it('returns notably below interpretation for very low scores', () => {
      const interpretation = getInterpretation(10);
      expect(interpretation.toLowerCase()).toContain('notably below');
    });
  });

  describe('getScoreLevel', () => {
    it('returns correct level labels', () => {
      expect(getScoreLevel(32)).toBe('High');
      expect(getScoreLevel(28)).toBe('Above Average');
      expect(getScoreLevel(24)).toBe('Average');
      expect(getScoreLevel(19)).toBe('Below Average');
      expect(getScoreLevel(10)).toBe('Low');
    });
  });

  describe('calculateResults', () => {
    it('returns correct results for all correct answers', () => {
      const responses: RMETResponse[] = scoredItems.map((item) => ({
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
      }));

      const results = calculateResults(responses);
      expect(results.totalCorrect).toBe(37);
      expect(results.totalQuestions).toBe(37);
      expect(results.percentCorrect).toBe(100);
      expect(results.completedAt).toBeDefined();
    });

    it('returns correct results for all wrong answers', () => {
      const responses: RMETResponse[] = scoredItems.map((item) => ({
        itemId: item.id,
        selectedAnswer: item.options.find((opt) => opt !== item.correctAnswer)!,
      }));

      const results = calculateResults(responses);
      expect(results.totalCorrect).toBe(0);
      expect(results.percentCorrect).toBe(0);
    });

    it('calculates average response time when provided', () => {
      const responses: RMETResponse[] = scoredItems.map((item) => ({
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
        responseTime: 3000,
      }));

      const results = calculateResults(responses);
      expect(results.averageResponseTime).toBe(3000);
    });

    it('handles mixed response times', () => {
      const responses: RMETResponse[] = scoredItems.map((item, i) => ({
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
        responseTime: i < 10 ? 2000 : undefined,
      }));

      const results = calculateResults(responses);
      expect(results.averageResponseTime).toBe(2000);
    });

    it('returns undefined average time when no times provided', () => {
      const responses: RMETResponse[] = scoredItems.slice(0, 5).map((item) => ({
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
      }));

      const results = calculateResults(responses);
      expect(results.averageResponseTime).toBeUndefined();
    });

    it('includes all item results', () => {
      const responses: RMETResponse[] = scoredItems.map((item) => ({
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
      }));

      const results = calculateResults(responses);
      expect(results.itemResults.length).toBe(37);
    });
  });
});

describe('Serialization', () => {
  describe('serializeResults / deserializeResults', () => {
    it('round-trips results correctly', () => {
      const responses: RMETResponse[] = scoredItems.slice(0, 10).map((item) => ({
        itemId: item.id,
        selectedAnswer: item.correctAnswer,
        responseTime: 3000,
      }));
      const results = calculateResults(responses);

      const serialized = serializeResults(results);
      const deserialized = deserializeResults(serialized);

      expect(deserialized).not.toBeNull();
      expect(deserialized?.totalCorrect).toBe(results.totalCorrect);
      expect(deserialized?.totalQuestions).toBe(results.totalQuestions);
      expect(deserialized?.itemResults.length).toBe(results.itemResults.length);
    });

    it('returns null for invalid JSON', () => {
      expect(deserializeResults('invalid json')).toBeNull();
      expect(deserializeResults('{broken')).toBeNull();
    });
  });

  describe('serializeResponses / deserializeResponses', () => {
    it('round-trips responses correctly', () => {
      const responses: RMETResponse[] = [
        { itemId: 1, selectedAnswer: 'playful' },
        { itemId: 2, selectedAnswer: 'upset', responseTime: 5000 },
        { itemId: 3, selectedAnswer: 'desire' },
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

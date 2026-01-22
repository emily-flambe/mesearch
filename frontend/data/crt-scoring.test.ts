// Unit tests for CRT scoring logic
import { describe, it, expect } from 'vitest';
import {
  normalizeAnswer,
  matchesAnswer,
  scoreItem,
  calculateCRTScores,
  calculatePercentile,
  getScoreInterpretation,
  serializeCRTResults,
  deserializeCRTResults,
  serializeCRTResponses,
  deserializeCRTResponses,
} from './crt-scoring';
import { crtItems } from './crt-items';

describe('CRT Scoring', () => {
  describe('normalizeAnswer', () => {
    it('handles empty and whitespace answers', () => {
      expect(normalizeAnswer('')).toBe('');
      expect(normalizeAnswer('  ')).toBe('');
      expect(normalizeAnswer('   5   ')).toBe('5');
    });

    it('normalizes numeric answers with units', () => {
      expect(normalizeAnswer('5')).toBe('5');
      expect(normalizeAnswer('5 cents')).toBe('5');
      expect(normalizeAnswer('5 cent')).toBe('5');
      expect(normalizeAnswer('5c')).toBe('5c');
      expect(normalizeAnswer('5 minutes')).toBe('5');
      expect(normalizeAnswer('5 min')).toBe('5');
      expect(normalizeAnswer('5 days')).toBe('5');
      expect(normalizeAnswer('5 day')).toBe('5');
    });

    it('normalizes dollar amounts', () => {
      expect(normalizeAnswer('$0.05')).toBe('5');
      expect(normalizeAnswer('$20')).toBe('20');
      expect(normalizeAnswer('$10')).toBe('10');
    });

    it('normalizes decimal representations', () => {
      expect(normalizeAnswer('.05')).toBe('5');
      expect(normalizeAnswer('0.05')).toBe('5');
      expect(normalizeAnswer('.10')).toBe('10');
    });

    it('converts word numbers to digits', () => {
      expect(normalizeAnswer('five')).toBe('5');
      expect(normalizeAnswer('ten')).toBe('10');
      expect(normalizeAnswer('twenty')).toBe('20');
      expect(normalizeAnswer('forty-seven')).toBe('47');
      expect(normalizeAnswer('forty seven')).toBe('47');
      expect(normalizeAnswer('twenty-nine')).toBe('29');
      expect(normalizeAnswer('hundred')).toBe('100');
    });

    it('handles case insensitivity', () => {
      expect(normalizeAnswer('FIVE')).toBe('5');
      expect(normalizeAnswer('Five')).toBe('5');
      expect(normalizeAnswer('Emily')).toBe('emily');
      expect(normalizeAnswer('EMILY')).toBe('emily');
    });

    it('removes leading zeros', () => {
      expect(normalizeAnswer('05')).toBe('5');
      expect(normalizeAnswer('007')).toBe('7');
    });
  });

  describe('matchesAnswer', () => {
    it('matches exact answers', () => {
      expect(matchesAnswer('5', ['5'])).toBe(true);
      expect(matchesAnswer('10', ['5'])).toBe(false);
    });

    it('matches answer variations', () => {
      const variations = ['5', '5 cents', '5c', '$0.05', 'five', 'five cents'];
      expect(matchesAnswer('5', variations)).toBe(true);
      expect(matchesAnswer('5 cents', variations)).toBe(true);
      expect(matchesAnswer('$0.05', variations)).toBe(true);
      expect(matchesAnswer('five', variations)).toBe(true);
      expect(matchesAnswer('FIVE', variations)).toBe(true);
      expect(matchesAnswer('Five Cents', variations)).toBe(true);
    });

    it('handles decimal variations for cents', () => {
      const variations = ['5', '5 cents', '$0.05', '.05'];
      expect(matchesAnswer('.05', variations)).toBe(true);
      expect(matchesAnswer('0.05', variations)).toBe(true);
    });
  });

  describe('scoreItem', () => {
    it('scores correct answers', () => {
      const batAndBall = crtItems[0];
      const result = scoreItem(batAndBall, '5');
      expect(result.correct).toBe(true);
      expect(result.wasIntuitive).toBe(false);
      expect(result.itemId).toBe(1);
    });

    it('identifies intuitive wrong answers', () => {
      const batAndBall = crtItems[0];
      const result = scoreItem(batAndBall, '10');
      expect(result.correct).toBe(false);
      expect(result.wasIntuitive).toBe(true);
    });

    it('identifies other wrong answers', () => {
      const batAndBall = crtItems[0];
      const result = scoreItem(batAndBall, '42');
      expect(result.correct).toBe(false);
      expect(result.wasIntuitive).toBe(false);
    });

    it('handles answer variations for each item', () => {
      // Bat and Ball - correct variations
      expect(scoreItem(crtItems[0], '5').correct).toBe(true);
      expect(scoreItem(crtItems[0], '5 cents').correct).toBe(true);
      expect(scoreItem(crtItems[0], '$0.05').correct).toBe(true);
      expect(scoreItem(crtItems[0], 'five').correct).toBe(true);
      expect(scoreItem(crtItems[0], '.05').correct).toBe(true);

      // Bat and Ball - intuitive answer
      expect(scoreItem(crtItems[0], '10').wasIntuitive).toBe(true);
      expect(scoreItem(crtItems[0], '10 cents').wasIntuitive).toBe(true);
      expect(scoreItem(crtItems[0], 'ten').wasIntuitive).toBe(true);

      // Widget machines
      expect(scoreItem(crtItems[1], '5').correct).toBe(true);
      expect(scoreItem(crtItems[1], '5 minutes').correct).toBe(true);
      expect(scoreItem(crtItems[1], '100').wasIntuitive).toBe(true);

      // Lily pad
      expect(scoreItem(crtItems[2], '47').correct).toBe(true);
      expect(scoreItem(crtItems[2], '47 days').correct).toBe(true);
      expect(scoreItem(crtItems[2], 'forty-seven').correct).toBe(true);
      expect(scoreItem(crtItems[2], '24').wasIntuitive).toBe(true);

      // John and Mary drinking
      expect(scoreItem(crtItems[3], '4').correct).toBe(true);
      expect(scoreItem(crtItems[3], '4 days').correct).toBe(true);
      expect(scoreItem(crtItems[3], 'four').correct).toBe(true);
      expect(scoreItem(crtItems[3], '9').wasIntuitive).toBe(true);

      // Jerry's mark
      expect(scoreItem(crtItems[4], '29').correct).toBe(true);
      expect(scoreItem(crtItems[4], '29 students').correct).toBe(true);
      expect(scoreItem(crtItems[4], 'twenty-nine').correct).toBe(true);
      expect(scoreItem(crtItems[4], '30').wasIntuitive).toBe(true);

      // Pig trading
      expect(scoreItem(crtItems[5], '20').correct).toBe(true);
      expect(scoreItem(crtItems[5], '$20').correct).toBe(true);
      expect(scoreItem(crtItems[5], 'twenty').correct).toBe(true);
      expect(scoreItem(crtItems[5], '10').wasIntuitive).toBe(true);

      // Emily's father (verbal)
      expect(scoreItem(crtItems[6], 'Emily').correct).toBe(true);
      expect(scoreItem(crtItems[6], 'emily').correct).toBe(true);
      expect(scoreItem(crtItems[6], 'EMILY').correct).toBe(true);
      expect(scoreItem(crtItems[6], 'June').wasIntuitive).toBe(true);
      expect(scoreItem(crtItems[6], 'june').wasIntuitive).toBe(true);
    });
  });

  describe('calculateCRTScores', () => {
    it('calculates scores for all correct answers', () => {
      const responses: Record<number, string> = {
        1: '5',
        2: '5',
        3: '47',
        4: '4',
        5: '29',
        6: '20',
        7: 'Emily',
      };
      const results = calculateCRTScores(responses, 'none');

      expect(results.totalCorrect).toBe(7);
      expect(results.totalQuestions).toBe(7);
      expect(results.reflectiveScore).toBe(7);
      expect(results.intuitiveScore).toBe(0);
      expect(results.otherErrors).toBe(0);
      expect(results.priorExposure).toBe('none');
      expect(results.completedAt).toBeDefined();
    });

    it('calculates scores for all intuitive answers', () => {
      const responses: Record<number, string> = {
        1: '10',
        2: '100',
        3: '24',
        4: '9',
        5: '30',
        6: '10',
        7: 'June',
      };
      const results = calculateCRTScores(responses, 'none');

      expect(results.totalCorrect).toBe(0);
      expect(results.intuitiveScore).toBe(7);
      expect(results.otherErrors).toBe(0);
    });

    it('calculates mixed scores correctly', () => {
      const responses: Record<number, string> = {
        1: '5',      // correct
        2: '100',    // intuitive
        3: '47',     // correct
        4: '42',     // other wrong
        5: '29',     // correct
        6: '10',     // intuitive
        7: 'Emily',  // correct
      };
      const results = calculateCRTScores(responses, 'some');

      expect(results.totalCorrect).toBe(4);
      expect(results.intuitiveScore).toBe(2);
      expect(results.otherErrors).toBe(1);
      expect(results.priorExposure).toBe('some');
    });

    it('handles empty responses', () => {
      const responses: Record<number, string> = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
      };
      const results = calculateCRTScores(responses, 'none');

      expect(results.totalCorrect).toBe(0);
      expect(results.intuitiveScore).toBe(0);
      expect(results.otherErrors).toBe(0);
    });

    it('returns correct item results', () => {
      const responses: Record<number, string> = {
        1: '5 cents',
        2: '100 minutes',
        3: '47',
        4: '',
        5: '29',
        6: '20',
        7: 'Emily',
      };
      const results = calculateCRTScores(responses, 'none');

      expect(results.itemResults.length).toBe(7);

      // Check first item
      expect(results.itemResults[0].itemId).toBe(1);
      expect(results.itemResults[0].userAnswer).toBe('5 cents');
      expect(results.itemResults[0].correct).toBe(true);

      // Check second item (intuitive)
      expect(results.itemResults[1].itemId).toBe(2);
      expect(results.itemResults[1].userAnswer).toBe('100 minutes');
      expect(results.itemResults[1].correct).toBe(false);
      expect(results.itemResults[1].wasIntuitive).toBe(true);
    });
  });

  describe('calculatePercentile', () => {
    it('returns expected percentiles for each score', () => {
      expect(calculatePercentile(0)).toBe(10);
      expect(calculatePercentile(1)).toBe(25);
      expect(calculatePercentile(2)).toBe(40);
      expect(calculatePercentile(3)).toBe(55);
      expect(calculatePercentile(4)).toBe(70);
      expect(calculatePercentile(5)).toBe(82);
      expect(calculatePercentile(6)).toBe(92);
      expect(calculatePercentile(7)).toBe(98);
    });

    it('returns 50 for unexpected scores', () => {
      expect(calculatePercentile(8)).toBe(50);
      expect(calculatePercentile(-1)).toBe(50);
    });
  });

  describe('getScoreInterpretation', () => {
    it('returns appropriate interpretation for each score range', () => {
      // 7/7 = 100% >= 85% -> Exceptional
      expect(getScoreInterpretation(7, 7)).toBe('Exceptional Reflective Thinking');
      // 6/7 = 85.7% >= 85% -> Exceptional
      expect(getScoreInterpretation(6, 7)).toBe('Exceptional Reflective Thinking');
      // 5/7 = 71.4% >= 70% -> Strong
      expect(getScoreInterpretation(5, 7)).toBe('Strong Reflective Thinking');
      // 4/7 = 57.1% >= 50% -> Moderate
      expect(getScoreInterpretation(4, 7)).toBe('Moderate Reflective Thinking');
      // 3/7 = 42.9% >= 30% -> Developing
      expect(getScoreInterpretation(3, 7)).toBe('Developing Reflective Thinking');
      // 2/7 = 28.6% < 30% -> Intuitive
      expect(getScoreInterpretation(2, 7)).toBe('Intuitive Thinking Style');
      expect(getScoreInterpretation(1, 7)).toBe('Intuitive Thinking Style');
      expect(getScoreInterpretation(0, 7)).toBe('Intuitive Thinking Style');
    });
  });

  describe('serialization', () => {
    describe('serializeCRTResults / deserializeCRTResults', () => {
      it('round-trips results correctly', () => {
        const responses: Record<number, string> = {
          1: '5',
          2: '5',
          3: '47',
          4: '4',
          5: '29',
          6: '20',
          7: 'Emily',
        };
        const results = calculateCRTScores(responses, 'none');
        const serialized = serializeCRTResults(results);
        const deserialized = deserializeCRTResults(serialized);

        expect(deserialized).not.toBeNull();
        expect(deserialized?.totalCorrect).toBe(results.totalCorrect);
        expect(deserialized?.totalQuestions).toBe(results.totalQuestions);
        expect(deserialized?.itemResults.length).toBe(results.itemResults.length);
      });

      it('returns null for invalid JSON', () => {
        expect(deserializeCRTResults('invalid json')).toBeNull();
        expect(deserializeCRTResults('{broken')).toBeNull();
      });
    });

    describe('serializeCRTResponses / deserializeCRTResponses', () => {
      it('round-trips responses correctly', () => {
        const responses: Record<number, string> = {
          1: '5 cents',
          2: '100',
          3: '47 days',
        };
        const serialized = serializeCRTResponses(responses);
        const deserialized = deserializeCRTResponses(serialized);

        expect(deserialized).toEqual(responses);
      });

      it('returns null for invalid JSON', () => {
        expect(deserializeCRTResponses('invalid json')).toBeNull();
      });
    });
  });
});

describe('CRT Items Data Integrity', () => {
  it('has 7 items total', () => {
    expect(crtItems.length).toBe(7);
  });

  it('has unique item IDs', () => {
    const ids = crtItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(crtItems.length);
  });

  it('has sequential IDs starting from 1', () => {
    for (let i = 0; i < crtItems.length; i++) {
      expect(crtItems[i].id).toBe(i + 1);
    }
  });

  it('has correct and intuitive variations for each item', () => {
    for (const item of crtItems) {
      expect(item.correctVariations.length).toBeGreaterThan(0);
      expect(item.intuitiveVariations.length).toBeGreaterThan(0);
      expect(item.explanation.length).toBeGreaterThan(0);
    }
  });

  it('has correct answer in variations', () => {
    for (const item of crtItems) {
      // The canonical correct answer should normalize to match at least one variation
      const normalizedCorrect = item.correctAnswer.toLowerCase();
      const hasMatch = item.correctVariations.some(
        (v) => v.toLowerCase() === normalizedCorrect
      );
      expect(hasMatch).toBe(true);
    }
  });

  it('has intuitive answer in variations', () => {
    for (const item of crtItems) {
      const normalizedIntuitive = item.intuitiveAnswer.toLowerCase();
      const hasMatch = item.intuitiveVariations.some(
        (v) => v.toLowerCase() === normalizedIntuitive
      );
      expect(hasMatch).toBe(true);
    }
  });

  it('has both numeric and verbal items', () => {
    const numeric = crtItems.filter((item) => item.category === 'numeric');
    const verbal = crtItems.filter((item) => item.category === 'verbal');
    expect(numeric.length).toBeGreaterThan(0);
    expect(verbal.length).toBeGreaterThan(0);
  });
});

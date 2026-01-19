// Unit tests for IAT D-Score calculation
import { describe, it, expect } from 'vitest';
import {
  calculateMean,
  calculateMedian,
  calculateStandardDeviation,
  isValidRT,
  createTrialResult,
  interpretDScore,
  calculateDScore,
  calculateBlockScores,
  serializeIATResults,
  deserializeIATResults,
  type TrialResult,
} from './iat-scoring';

describe('IAT Scoring - Basic Statistics', () => {
  describe('calculateMean', () => {
    it('returns 0 for empty array', () => {
      expect(calculateMean([])).toBe(0);
    });

    it('returns the value for single element', () => {
      expect(calculateMean([500])).toBe(500);
    });

    it('calculates mean correctly', () => {
      expect(calculateMean([100, 200, 300])).toBe(200);
      expect(calculateMean([400, 600])).toBe(500);
      expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
    });
  });

  describe('calculateMedian', () => {
    it('returns 0 for empty array', () => {
      expect(calculateMedian([])).toBe(0);
    });

    it('returns the value for single element', () => {
      expect(calculateMedian([500])).toBe(500);
    });

    it('returns middle value for odd-length array', () => {
      expect(calculateMedian([100, 200, 300])).toBe(200);
      expect(calculateMedian([5, 1, 3])).toBe(3); // Should sort first
    });

    it('returns average of middle values for even-length array', () => {
      expect(calculateMedian([100, 200, 300, 400])).toBe(250);
      expect(calculateMedian([1, 2])).toBe(1.5);
    });
  });

  describe('calculateStandardDeviation', () => {
    it('returns 0 for array with less than 2 elements', () => {
      expect(calculateStandardDeviation([])).toBe(0);
      expect(calculateStandardDeviation([500])).toBe(0);
    });

    it('calculates SD correctly for uniform values', () => {
      expect(calculateStandardDeviation([500, 500, 500])).toBe(0);
    });

    it('calculates SD correctly for varied values', () => {
      // SD of [400, 500, 600] should be ~81.65
      const sd = calculateStandardDeviation([400, 500, 600]);
      expect(sd).toBeGreaterThan(80);
      expect(sd).toBeLessThan(85);
    });
  });
});

describe('IAT Scoring - Response Time Validation', () => {
  describe('isValidRT', () => {
    it('marks RT < 300ms as too fast', () => {
      const result = isValidRT(299);
      expect(result.tooFast).toBe(true);
      expect(result.tooSlow).toBe(false);
      expect(result.valid).toBe(false);
    });

    it('marks RT > 10000ms as too slow', () => {
      const result = isValidRT(10001);
      expect(result.tooFast).toBe(false);
      expect(result.tooSlow).toBe(true);
      expect(result.valid).toBe(false);
    });

    it('marks RT in valid range as valid', () => {
      const result = isValidRT(500);
      expect(result.tooFast).toBe(false);
      expect(result.tooSlow).toBe(false);
      expect(result.valid).toBe(true);
    });

    it('boundary cases at 300ms and 10000ms', () => {
      const atMin = isValidRT(300);
      expect(atMin.valid).toBe(true);

      const atMax = isValidRT(10000);
      expect(atMax.valid).toBe(true);
    });
  });
});

describe('IAT Scoring - Trial Creation', () => {
  describe('createTrialResult', () => {
    it('creates a correct trial when response matches', () => {
      const trial = createTrialResult({
        blockNumber: 4,
        trialNumber: 1,
        stimulus: 'Rose',
        correctCategory: 'Flowers',
        responseKey: 'E',
        correctKey: 'E',
        responseTime: 500,
      });

      expect(trial.correct).toBe(true);
      expect(trial.tooFast).toBe(false);
      expect(trial.tooSlow).toBe(false);
    });

    it('creates an incorrect trial when response does not match', () => {
      const trial = createTrialResult({
        blockNumber: 4,
        trialNumber: 1,
        stimulus: 'Rose',
        correctCategory: 'Flowers',
        responseKey: 'I',
        correctKey: 'E',
        responseTime: 500,
      });

      expect(trial.correct).toBe(false);
    });

    it('marks too fast trials', () => {
      const trial = createTrialResult({
        blockNumber: 4,
        trialNumber: 1,
        stimulus: 'Rose',
        correctCategory: 'Flowers',
        responseKey: 'E',
        correctKey: 'E',
        responseTime: 150,
      });

      expect(trial.tooFast).toBe(true);
      expect(trial.tooSlow).toBe(false);
    });

    it('marks too slow trials', () => {
      const trial = createTrialResult({
        blockNumber: 4,
        trialNumber: 1,
        stimulus: 'Rose',
        correctCategory: 'Flowers',
        responseKey: 'E',
        correctKey: 'E',
        responseTime: 15000,
      });

      expect(trial.tooFast).toBe(false);
      expect(trial.tooSlow).toBe(true);
    });
  });
});

describe('IAT Scoring - D-Score Interpretation', () => {
  describe('interpretDScore', () => {
    it('interprets strong preference for A (negative D)', () => {
      expect(interpretDScore(-0.8)).toBe('strong_preference_a');
      expect(interpretDScore(-2.0)).toBe('strong_preference_a');
    });

    it('interprets moderate preference for A', () => {
      expect(interpretDScore(-0.5)).toBe('moderate_preference_a');
      expect(interpretDScore(-0.4)).toBe('moderate_preference_a');
    });

    it('interprets slight preference for A', () => {
      expect(interpretDScore(-0.25)).toBe('slight_preference_a');
      expect(interpretDScore(-0.2)).toBe('slight_preference_a');
    });

    it('interprets little to no preference', () => {
      expect(interpretDScore(0)).toBe('little_to_no_preference');
      expect(interpretDScore(0.1)).toBe('little_to_no_preference');
      expect(interpretDScore(-0.1)).toBe('little_to_no_preference');
    });

    it('interprets slight preference for B', () => {
      expect(interpretDScore(0.2)).toBe('slight_preference_b');
      expect(interpretDScore(0.25)).toBe('slight_preference_b');
    });

    it('interprets moderate preference for B', () => {
      expect(interpretDScore(0.5)).toBe('moderate_preference_b');
      expect(interpretDScore(0.4)).toBe('moderate_preference_b');
    });

    it('interprets strong preference for B (positive D)', () => {
      expect(interpretDScore(0.8)).toBe('strong_preference_b');
      expect(interpretDScore(2.0)).toBe('strong_preference_b');
    });
  });
});

describe('IAT Scoring - D-Score Calculation', () => {
  // Helper to generate mock trial data
  function generateMockTrials(
    block4MeanRT: number,
    block7MeanRT: number,
    numTrialsPerBlock: number = 40
  ): TrialResult[] {
    const trials: TrialResult[] = [];

    // Generate block 4 trials (compatible)
    for (let i = 0; i < numTrialsPerBlock; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 4,
          trialNumber: i + 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: block4MeanRT + (Math.random() - 0.5) * 100,
        })
      );
    }

    // Generate block 7 trials (incompatible)
    for (let i = 0; i < numTrialsPerBlock; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 7,
          trialNumber: i + 1,
          stimulus: 'Wasp',
          correctCategory: 'Insects',
          responseKey: 'I',
          correctKey: 'I',
          responseTime: block7MeanRT + (Math.random() - 0.5) * 100,
        })
      );
    }

    return trials;
  }

  it('calculates positive D-score when incompatible is slower', () => {
    // Slower on incompatible (block 7) = positive D
    const trials = generateMockTrials(600, 800);
    const results = calculateDScore(trials, 'flowers-insects');

    expect(results.dScore).toBeGreaterThan(0);
  });

  it('calculates negative D-score when compatible is slower', () => {
    // Slower on compatible (block 4) = negative D
    const trials = generateMockTrials(800, 600);
    const results = calculateDScore(trials, 'flowers-insects');

    expect(results.dScore).toBeLessThan(0);
  });

  it('calculates D-score near zero when RTs are identical', () => {
    // Use identical RTs (no random noise) to ensure D-score is exactly 0
    const trials: TrialResult[] = [];

    // Generate block 4 trials with identical RTs
    for (let i = 0; i < 40; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 4,
          trialNumber: i + 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 700, // Exact same RT
        })
      );
    }

    // Generate block 7 trials with identical RTs
    for (let i = 0; i < 40; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 7,
          trialNumber: i + 1,
          stimulus: 'Wasp',
          correctCategory: 'Insects',
          responseKey: 'I',
          correctKey: 'I',
          responseTime: 700, // Same exact RT as block 4
        })
      );
    }

    const results = calculateDScore(trials, 'flowers-insects');

    // With identical RTs, D-score should be exactly 0
    expect(results.dScore).toBe(0);
  });

  it('clamps D-score to [-2, 2]', () => {
    // Generate very extreme data
    const trials = generateMockTrials(400, 2000);
    const results = calculateDScore(trials, 'flowers-insects');

    expect(results.dScore).toBeLessThanOrEqual(2);
    expect(results.dScore).toBeGreaterThanOrEqual(-2);
  });

  it('flags participant for exclusion if too many fast trials', () => {
    const trials: TrialResult[] = [];

    // Generate many too-fast trials (>10%)
    for (let i = 0; i < 50; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 4,
          trialNumber: i + 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 100, // Too fast
        })
      );
    }

    const results = calculateDScore(trials, 'flowers-insects');

    expect(results.shouldExclude).toBe(true);
    expect(results.exclusionReason).toContain('300ms');
  });

  it('includes error rate in results', () => {
    const trials: TrialResult[] = [];

    // Mix of correct and incorrect trials
    for (let i = 0; i < 20; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 4,
          trialNumber: i + 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: i < 15 ? 'E' : 'I', // 5 errors out of 20
          correctKey: 'E',
          responseTime: 600,
        })
      );
    }

    for (let i = 0; i < 20; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 7,
          trialNumber: i + 1,
          stimulus: 'Wasp',
          correctCategory: 'Insects',
          responseKey: 'I',
          correctKey: 'I',
          responseTime: 700,
        })
      );
    }

    const results = calculateDScore(trials, 'flowers-insects');

    expect(results.errorRate).toBeGreaterThan(0);
    expect(results.totalTrials).toBe(40);
  });
});

describe('IAT Scoring - Block Scores', () => {
  describe('calculateBlockScores', () => {
    it('calculates statistics for each block', () => {
      const trials: TrialResult[] = [
        createTrialResult({
          blockNumber: 4,
          trialNumber: 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 500,
        }),
        createTrialResult({
          blockNumber: 4,
          trialNumber: 2,
          stimulus: 'Tulip',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 600,
        }),
        createTrialResult({
          blockNumber: 7,
          trialNumber: 1,
          stimulus: 'Wasp',
          correctCategory: 'Insects',
          responseKey: 'I',
          correctKey: 'I',
          responseTime: 700,
        }),
      ];

      const blockScores = calculateBlockScores(trials);

      expect(blockScores.length).toBe(2);

      const block4 = blockScores.find((b) => b.blockNumber === 4);
      expect(block4).toBeDefined();
      expect(block4?.numTrials).toBe(2);
      expect(block4?.meanRT).toBe(550);

      const block7 = blockScores.find((b) => b.blockNumber === 7);
      expect(block7).toBeDefined();
      expect(block7?.numTrials).toBe(1);
      expect(block7?.meanRT).toBe(700);
    });

    it('calculates error rate correctly', () => {
      const trials: TrialResult[] = [
        createTrialResult({
          blockNumber: 4,
          trialNumber: 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 500,
        }),
        createTrialResult({
          blockNumber: 4,
          trialNumber: 2,
          stimulus: 'Tulip',
          correctCategory: 'Flowers',
          responseKey: 'I', // Error
          correctKey: 'E',
          responseTime: 600,
        }),
      ];

      const blockScores = calculateBlockScores(trials);
      const block4 = blockScores.find((b) => b.blockNumber === 4);

      expect(block4?.errorRate).toBe(0.5);
    });

    it('counts too fast and too slow trials', () => {
      const trials: TrialResult[] = [
        createTrialResult({
          blockNumber: 4,
          trialNumber: 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 100, // Too fast
        }),
        createTrialResult({
          blockNumber: 4,
          trialNumber: 2,
          stimulus: 'Tulip',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 15000, // Too slow
        }),
        createTrialResult({
          blockNumber: 4,
          trialNumber: 3,
          stimulus: 'Daisy',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 500, // Valid
        }),
      ];

      const blockScores = calculateBlockScores(trials);
      const block4 = blockScores.find((b) => b.blockNumber === 4);

      expect(block4?.numTooFast).toBe(1);
      expect(block4?.numTooSlow).toBe(1);
      expect(block4?.numValid).toBe(1);
    });
  });
});

describe('IAT Scoring - Serialization', () => {
  it('round-trips results correctly', () => {
    const trials: TrialResult[] = [];

    for (let i = 0; i < 40; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 4,
          trialNumber: i + 1,
          stimulus: 'Rose',
          correctCategory: 'Flowers',
          responseKey: 'E',
          correctKey: 'E',
          responseTime: 600,
        })
      );
    }

    for (let i = 0; i < 40; i++) {
      trials.push(
        createTrialResult({
          blockNumber: 7,
          trialNumber: i + 1,
          stimulus: 'Wasp',
          correctCategory: 'Insects',
          responseKey: 'I',
          correctKey: 'I',
          responseTime: 750,
        })
      );
    }

    const results = calculateDScore(trials, 'flowers-insects');
    const serialized = serializeIATResults(results);
    const deserialized = deserializeIATResults(serialized);

    expect(deserialized).not.toBeNull();
    expect(deserialized?.dScore).toBe(results.dScore);
    expect(deserialized?.iatId).toBe(results.iatId);
    expect(deserialized?.totalTrials).toBe(results.totalTrials);
  });

  it('returns null for invalid JSON', () => {
    expect(deserializeIATResults('invalid json')).toBeNull();
    expect(deserializeIATResults('{broken')).toBeNull();
  });
});

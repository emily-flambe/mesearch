// IAT D-Score Calculation Algorithm
// Based on: Greenwald, A. G., Nosek, B. A., & Banaji, M. R. (2003).
// "Understanding and Using the Implicit Association Test: I. An Improved Scoring Algorithm"
// Journal of Personality and Social Psychology, 85(2), 197-216.
//
// This implements the "D2" scoring algorithm (improved scoring algorithm).

export interface TrialResult {
  blockNumber: number;
  trialNumber: number;
  stimulus: string;
  correctCategory: string;
  responseKey: 'E' | 'I';
  correctKey: 'E' | 'I';
  responseTime: number; // milliseconds from stimulus onset to correct response (includes error correction time)
  hadError: boolean; // true if user pressed wrong key before correcting
  tooFast: boolean; // < 300ms
  tooSlow: boolean; // > 10000ms
}

export interface BlockScore {
  blockNumber: number;
  blockType: 'practice' | 'test';
  meanRT: number;
  medianRT: number;
  errorRate: number;
  numTrials: number;
  numValid: number;
  numTooFast: number;
  numTooSlow: number;
}

export interface IATResults {
  iatId: string;
  dScore: number; // -2 to +2, standardized effect size
  dScoreInterpretation: DScoreInterpretation;
  interpretationText: string;
  disclaimer: string;
  blockScores: BlockScore[];
  totalTrials: number;
  validTrials: number;
  errorRate: number;
  averageResponseTime: number;
  medianResponseTime: number;
  tooFastRate: number;
  completedAt: string;
  shouldExclude: boolean; // True if participant should be excluded
  exclusionReason: string | null;
}

export type DScoreInterpretation =
  | 'strong_preference_a' // D < -0.65: Strong automatic preference for Target1+Good
  | 'moderate_preference_a' // -0.65 <= D < -0.35
  | 'slight_preference_a' // -0.35 <= D < -0.15
  | 'little_to_no_preference' // -0.15 <= D <= 0.15
  | 'slight_preference_b' // 0.15 < D <= 0.35
  | 'moderate_preference_b' // 0.35 < D <= 0.65
  | 'strong_preference_b'; // D > 0.65: Strong automatic preference for Target2+Good

// Constants for scoring
const MIN_RT = 300; // Minimum valid RT in ms
const MAX_RT = 10000; // Maximum valid RT in ms
const ERROR_PENALTY = 600; // ms to add for error trials (D2 algorithm uses built-in error penalty)
const TOO_FAST_EXCLUSION_THRESHOLD = 0.10; // Exclude if >10% of trials are too fast

// D-score interpretation thresholds
const D_THRESHOLDS = {
  strong: 0.65,
  moderate: 0.35,
  slight: 0.15,
};

/**
 * Calculate D-score from trial results using the improved D2 algorithm.
 *
 * The D2 algorithm:
 * 1. Delete trials with RT > 10000ms
 * 2. Delete trials with RT < 300ms (and exclude participant if >10%)
 * 3. Compute mean RT for each test block
 * 4. Compute "inclusive" standard deviation across both test block conditions
 * 5. Compute D = (Mean_Incompatible - Mean_Compatible) / SD_pooled
 *
 * For the Flowers-Insects IAT:
 * - Compatible: Flowers+Good, Insects+Bad (Blocks 3-4)
 * - Incompatible: Insects+Good, Flowers+Bad (Blocks 6-7)
 *
 * With counterbalancing, block 4 and 7 swap their condition assignment:
 * - counterbalanced=false: Block 4 = compatible, Block 7 = incompatible
 * - counterbalanced=true: Block 4 = incompatible, Block 7 = compatible
 *
 * A positive D-score means slower RT on incompatible trials,
 * suggesting stronger Flowers+Good association.
 */
export function calculateDScore(
  trials: TrialResult[],
  iatId: string,
  counterbalanced: boolean = false
): IATResults {
  const completedAt = new Date().toISOString();

  // Separate trials by block type
  const testBlockTrials = trials.filter(
    (t) => [4, 7].includes(t.blockNumber) // Only use test blocks (4 and 7)
  );

  const allTrials = trials;

  // Check for exclusion criteria
  const tooFastTrials = allTrials.filter((t) => t.tooFast);
  const tooFastRate = tooFastTrials.length / allTrials.length;
  const shouldExclude = tooFastRate > TOO_FAST_EXCLUSION_THRESHOLD;
  const exclusionReason = shouldExclude
    ? `More than 10% of trials (${(tooFastRate * 100).toFixed(1)}%) had response times under 300ms`
    : null;

  // Filter valid trials (not too fast, not too slow)
  const validTrials = testBlockTrials.filter((t) => !t.tooFast && !t.tooSlow);

  // Separate by block for D-score calculation
  // With counterbalancing, the assignment of blocks to conditions is swapped:
  // - Standard (counterbalanced=false): Block 4 = compatible, Block 7 = incompatible
  // - Counterbalanced: Block 4 = incompatible, Block 7 = compatible
  const compatibleBlockNumber = counterbalanced ? 7 : 4;
  const incompatibleBlockNumber = counterbalanced ? 4 : 7;
  const compatibleTrials = validTrials.filter((t) => t.blockNumber === compatibleBlockNumber);
  const incompatibleTrials = validTrials.filter((t) => t.blockNumber === incompatibleBlockNumber);

  // Apply error penalty (D2 algorithm: add 600ms for error trials)
  // Note: Response time already includes built-in penalty (time to correct error).
  // The 600ms is an additional penalty per the D2 algorithm.
  const getAdjustedRT = (trial: TrialResult): number => {
    if (trial.hadError) {
      return trial.responseTime + ERROR_PENALTY;
    }
    return trial.responseTime;
  };

  // Calculate mean RT for each condition
  const compatibleRTs = compatibleTrials.map(getAdjustedRT);
  const incompatibleRTs = incompatibleTrials.map(getAdjustedRT);

  const meanCompatible = calculateMean(compatibleRTs);
  const meanIncompatible = calculateMean(incompatibleRTs);

  // Calculate pooled standard deviation across both conditions
  const allTestRTs = [...compatibleRTs, ...incompatibleRTs];
  const pooledSD = calculateStandardDeviation(allTestRTs);

  // Calculate D-score
  // Positive D = slower on incompatible = preference for Flowers+Good
  let dScore = 0;
  if (pooledSD > 0) {
    dScore = (meanIncompatible - meanCompatible) / pooledSD;
  }

  // Clamp D-score to reasonable range
  dScore = Math.max(-2, Math.min(2, dScore));

  // Interpret D-score
  const dScoreInterpretation = interpretDScore(dScore);
  const interpretationText = getDScoreInterpretationText(dScore, iatId);

  // Calculate block-level statistics
  const blockScores = calculateBlockScores(trials);

  // Overall statistics
  const totalTrials = allTrials.length;
  const validTrialCount = validTrials.length;
  const errorTrials = allTrials.filter((t) => t.hadError);
  const errorRate = errorTrials.length / totalTrials;
  const allRTs = allTrials.map((t) => t.responseTime);
  const averageResponseTime = calculateMean(allRTs);
  const medianResponseTime = calculateMedian(allRTs);

  return {
    iatId,
    dScore: Math.round(dScore * 100) / 100, // Round to 2 decimal places
    dScoreInterpretation,
    interpretationText,
    disclaimer: getDisclaimer(),
    blockScores,
    totalTrials,
    validTrials: validTrialCount,
    errorRate: Math.round(errorRate * 1000) / 1000,
    averageResponseTime: Math.round(averageResponseTime),
    medianResponseTime: Math.round(medianResponseTime),
    tooFastRate: Math.round(tooFastRate * 1000) / 1000,
    completedAt,
    shouldExclude,
    exclusionReason,
  };
}

/**
 * Interpret D-score into categorical interpretation
 */
export function interpretDScore(dScore: number): DScoreInterpretation {
  if (dScore < -D_THRESHOLDS.strong) return 'strong_preference_a';
  if (dScore < -D_THRESHOLDS.moderate) return 'moderate_preference_a';
  if (dScore < -D_THRESHOLDS.slight) return 'slight_preference_a';
  if (dScore <= D_THRESHOLDS.slight) return 'little_to_no_preference';
  if (dScore <= D_THRESHOLDS.moderate) return 'slight_preference_b';
  if (dScore <= D_THRESHOLDS.strong) return 'moderate_preference_b';
  return 'strong_preference_b';
}

/**
 * Get human-readable interpretation text for D-score
 *
 * Language modeled after Project Implicit (implicit.harvard.edu)
 * Uses "implicit preference" terminology and emphasizes reflection over diagnosis
 */
export function getDScoreInterpretationText(
  dScore: number,
  _iatId: string // For future IAT-specific interpretations
): string {
  const interpretation = interpretDScore(dScore);

  // For Flowers-Insects IAT:
  // Positive D = Flowers+Good association (most people)
  // Negative D = Insects+Good association (uncommon)
  //
  // Labels (Slight/Moderate/Strong) reflect effect sizes based on
  // scientific conventions for communicating IAT results.

  switch (interpretation) {
    case 'strong_preference_a':
      return 'Your result suggests a strong implicit preference for Insects over Flowers. This means you were noticeably faster when Insects and Good shared a response key. This is an uncommon pattern.';
    case 'moderate_preference_a':
      return 'Your result suggests a moderate implicit preference for Insects over Flowers. This means you were faster when Insects and Good shared a response key. This is an uncommon pattern.';
    case 'slight_preference_a':
      return 'Your result suggests a slight implicit preference for Insects over Flowers. This means you were somewhat faster when Insects and Good shared a response key.';
    case 'little_to_no_preference':
      return 'Your result suggests little to no implicit preference between Flowers and Insects. Your response times were similar regardless of which concepts shared a response key.';
    case 'slight_preference_b':
      return 'Your result suggests a slight implicit preference for Flowers over Insects. This means you were somewhat faster when Flowers and Good shared a response key. This is a common pattern.';
    case 'moderate_preference_b':
      return 'Your result suggests a moderate implicit preference for Flowers over Insects. This means you were faster when Flowers and Good shared a response key. This is a common pattern.';
    case 'strong_preference_b':
      return 'Your result suggests a strong implicit preference for Flowers over Insects. This means you were noticeably faster when Flowers and Good shared a response key. This is the most common pattern.';
  }
}

/**
 * Calculate block-level statistics
 */
export function calculateBlockScores(trials: TrialResult[]): BlockScore[] {
  const blockNumbers = [...new Set(trials.map((t) => t.blockNumber))].sort(
    (a, b) => a - b
  );

  return blockNumbers.map((blockNum) => {
    const blockTrials = trials.filter((t) => t.blockNumber === blockNum);
    const validTrials = blockTrials.filter((t) => !t.tooFast && !t.tooSlow);
    const rts = validTrials.map((t) => t.responseTime);
    const errors = blockTrials.filter((t) => t.hadError);
    const tooFast = blockTrials.filter((t) => t.tooFast);
    const tooSlow = blockTrials.filter((t) => t.tooSlow);

    return {
      blockNumber: blockNum,
      blockType: [3, 4, 6, 7].includes(blockNum) ? 'test' : 'practice',
      meanRT: Math.round(calculateMean(rts)),
      medianRT: Math.round(calculateMedian(rts)),
      errorRate: Math.round((errors.length / blockTrials.length) * 1000) / 1000,
      numTrials: blockTrials.length,
      numValid: validTrials.length,
      numTooFast: tooFast.length,
      numTooSlow: tooSlow.length,
    };
  });
}

/**
 * Calculate mean of an array
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calculate median of an array
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate standard deviation of an array
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = calculateMean(values);
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const avgSquaredDiff = calculateMean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Check if a response time is valid
 */
export function isValidRT(rt: number): { valid: boolean; tooFast: boolean; tooSlow: boolean } {
  const tooFast = rt < MIN_RT;
  const tooSlow = rt > MAX_RT;
  return {
    valid: !tooFast && !tooSlow,
    tooFast,
    tooSlow,
  };
}

/**
 * Get the standard disclaimer text
 *
 * Language modeled after Project Implicit (implicit.harvard.edu)
 * Based on their FAQs and ethical guidelines
 */
export function getDisclaimer(): string {
  return `UNDERSTANDING YOUR RESULT

Take this result as an opportunity for self-reflection, not as a definitive assessment.

• YOUR RESULT MAY VARY: IAT scores can differ if you take the test again. Factors like fatigue, distraction, and recent experiences all influence results—similar to how blood pressure varies between doctor visits.

• NOT A MEASURE OF PREJUDICE: An implicit preference does not mean you are prejudiced. The IAT measures associations that are not necessarily personally endorsed and may even contradict your conscious beliefs.

• LIMITED PREDICTIVE VALUE: A single IAT score is unlikely to predict an individual's behavior in a specific situation. IAT results are most meaningful when looking at patterns across many people.

• FOR REFLECTION ONLY: This tool is designed for learning about implicit cognition. It should not be used for hiring decisions, selection purposes, or any consequential judgments about yourself or others.`;
}

/**
 * Serialize results for storage
 */
export function serializeIATResults(results: IATResults): string {
  return JSON.stringify(results);
}

/**
 * Deserialize results from storage
 */
export function deserializeIATResults(json: string): IATResults | null {
  try {
    return JSON.parse(json) as IATResults;
  } catch {
    return null;
  }
}

/**
 * Create a trial result object
 */
export function createTrialResult(params: {
  blockNumber: number;
  trialNumber: number;
  stimulus: string;
  correctCategory: string;
  responseKey: 'E' | 'I';
  correctKey: 'E' | 'I';
  responseTime: number;
  hadError: boolean;
}): TrialResult {
  const rtValidity = isValidRT(params.responseTime);

  return {
    blockNumber: params.blockNumber,
    trialNumber: params.trialNumber,
    stimulus: params.stimulus,
    correctCategory: params.correctCategory,
    responseKey: params.responseKey,
    correctKey: params.correctKey,
    responseTime: params.responseTime,
    hadError: params.hadError,
    tooFast: rtValidity.tooFast,
    tooSlow: rtValidity.tooSlow,
  };
}

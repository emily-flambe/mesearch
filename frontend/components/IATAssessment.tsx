import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  flowersInsectsIAT,
  type IATConfig,
  type IATBlockConfig,
  getCategoryForStimulus,
  getCorrectResponse,
  generateBlockTrials,
  getCounterbalancedBlocks,
} from '../data/iat-items';
import {
  type TrialResult,
  type IATResults,
  createTrialResult,
  calculateDScore,
} from '../data/iat-scoring';
import IATTrial from './IATTrial';
import IATResultsDisplay from './IATResults';
import { useAuth } from '../contexts/AuthContext';

type Phase = 'intro' | 'instructions' | 'trial' | 'block-break' | 'results';

const STORAGE_KEY = 'mesearch-iat-progress';
const INTER_TRIAL_INTERVAL = 250; // ms between trials

export default function IATAssessment() {
  const { user } = useAuth();
  const [baseConfig] = useState<IATConfig>(flowersInsectsIAT);
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [blockTrials, setBlockTrials] = useState<string[]>([]);
  const [allTrialResults, setAllTrialResults] = useState<TrialResult[]>([]);
  const [results, setResults] = useState<IATResults | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Counterbalancing per IAT methodology (2×2 design = 4 conditions):
  // 1. pairingOrderSwapped: Which combined pairing comes first (compatible vs incompatible)
  // 2. targetSideSwapped: Which target starts on the left (Flowers vs Insects)
  // Both are independently randomized 50/50, set once per session
  const [pairingOrderSwapped] = useState(() => Math.random() < 0.5);
  const [targetSideSwapped] = useState(() => Math.random() < 0.5);

  // Generate counterbalanced blocks based on random assignments
  const [blocks] = useState(() => getCounterbalancedBlocks(baseConfig, pairingOrderSwapped, targetSideSwapped));

  // For backwards compatibility with scoring function
  const counterbalanced = pairingOrderSwapped;

  // Create effective config with counterbalanced blocks
  const config = { ...baseConfig, blocks };

  const currentBlock = config.blocks[currentBlockIndex];
  const currentStimulus = blockTrials[currentTrialIndex];

  // Refs to track current state for use in setTimeout callbacks (avoids stale closures)
  const stateRef = useRef({
    currentTrialIndex,
    currentBlockIndex,
    blockTrialsLength: blockTrials.length,
    allTrialResults,
  });

  // Keep stateRef in sync - use useLayoutEffect to ensure synchronous update
  useLayoutEffect(() => {
    stateRef.current = {
      currentTrialIndex,
      currentBlockIndex,
      blockTrialsLength: blockTrials.length,
      allTrialResults,
    };
  });

  // Pre-generate all block trials on mount
  const blockTrialsRef = useRef<Map<number, string[]>>(new Map());

  useEffect(() => {
    // Pre-generate trials for all blocks
    config.blocks.forEach((block) => {
      if (!blockTrialsRef.current.has(block.blockNumber)) {
        blockTrialsRef.current.set(
          block.blockNumber,
          generateBlockTrials(config, block)
        );
      }
    });
  }, [config]);

  // Save results to backend
  const saveResults = useCallback(async (calculatedResults: IATResults) => {
    if (!user) return;

    setSaveStatus('saving');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          test_type: 'iat',
          scores: calculatedResults,
        }),
      });

      if (res.ok) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }, [user]);

  // Handle starting a block
  const startBlock = useCallback((blockIndex: number) => {
    const block = config.blocks[blockIndex];
    const trials = blockTrialsRef.current.get(block.blockNumber) ||
      generateBlockTrials(config, block);

    setBlockTrials(trials);
    setCurrentTrialIndex(0);
    setPhase('instructions');
  }, [config]);

  // Handle trial response
  // Note: stimulus is passed from IATTrial to avoid stale closure issues
  const handleTrialResponse = useCallback(
    (responseKey: 'E' | 'I', responseTime: number, stimulus: string) => {
      if (!currentBlock || !stimulus) return;

      const category = getCategoryForStimulus(config, stimulus);
      if (!category) return;

      const correctKey = getCorrectResponse(currentBlock, category);
      const isCorrect = responseKey === correctKey;

      // Create trial result
      const trialResult = createTrialResult({
        blockNumber: currentBlock.blockNumber,
        trialNumber: currentTrialIndex + 1,
        stimulus: stimulus,
        correctCategory: category,
        responseKey,
        correctKey,
        responseTime,
      });

      setAllTrialResults((prev) => [...prev, trialResult]);

      // Show feedback briefly
      if (currentBlock.type === 'practice') {
        setFeedbackType(isCorrect ? 'correct' : 'incorrect');
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setFeedbackType(null);
        }, 150);
      }

      // Move to next trial after interval
      // Use stateRef to get current values and avoid stale closure issues
      setTimeout(() => {
        const { currentTrialIndex: trialIdx, currentBlockIndex: blockIdx,
                blockTrialsLength, allTrialResults: allResults } = stateRef.current;

        if (trialIdx + 1 >= blockTrialsLength) {
          // Block complete
          if (blockIdx + 1 >= config.blocks.length) {
            // All blocks complete - calculate results
            const newResults = [...allResults, trialResult];
            const calculatedResults = calculateDScore(newResults, config.id, counterbalanced);
            setResults(calculatedResults);
            setPhase('results');
            saveResults(calculatedResults);
            localStorage.removeItem(STORAGE_KEY);
          } else {
            // Move to next block
            setCurrentBlockIndex((prev) => prev + 1);
            setPhase('block-break');
          }
        } else {
          // Next trial
          setCurrentTrialIndex((prev) => prev + 1);
        }
      }, INTER_TRIAL_INTERVAL);
    },
    // Dependencies - use stateRef for values accessed in setTimeout
    // counterbalanced is stable (set once at mount) but included for completeness
    [config, currentBlock, saveResults, counterbalanced]
  );

  // Continue to next block
  const continueToNextBlock = useCallback(() => {
    startBlock(currentBlockIndex);
  }, [currentBlockIndex, startBlock]);

  // Start the IAT
  const startIAT = useCallback(() => {
    setAllTrialResults([]);
    setCurrentBlockIndex(0);
    startBlock(0);
  }, [startBlock]);

  // Begin trials from instructions
  const beginTrials = useCallback(() => {
    setPhase('trial');
  }, []);

  // Retake the IAT
  const handleRetake = useCallback(() => {
    setPhase('intro');
    setCurrentBlockIndex(0);
    setCurrentTrialIndex(0);
    setBlockTrials([]);
    setAllTrialResults([]);
    setResults(null);
    setSaveStatus('idle');
    // Regenerate trials
    blockTrialsRef.current.clear();
    config.blocks.forEach((block) => {
      blockTrialsRef.current.set(
        block.blockNumber,
        generateBlockTrials(config, block)
      );
    });
  }, [config]);

  // Calculate progress
  const totalTrials = config.blocks.reduce((sum, b) => sum + b.numTrials, 0);
  const completedTrials = allTrialResults.length;
  const progressPercent = Math.round((completedTrials / totalTrials) * 100);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-2xl font-semibold tracking-wide text-gold-gradient"
          >
            Mesearch
          </Link>
          {phase !== 'intro' && phase !== 'results' && (
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-text-muted)] text-sm">
                Block {currentBlockIndex + 1} of {config.blocks.length}
              </span>
              <div className="w-32 h-1 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-champagne)] to-[var(--color-gold)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Intro Phase */}
        {phase === 'intro' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="card-premium rounded-lg p-12 max-w-2xl w-full text-center">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Educational Self-Reflection Tool
              </p>
              <h1 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
                {config.name}
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed transition-colors duration-300">
                {config.description}
              </p>

              {/* Disclaimer box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 text-left">
                <p className="text-amber-400 text-sm font-medium mb-2">
                  Important Disclaimer
                </p>
                <p className="text-[var(--color-text-muted)] text-xs whitespace-pre-line">
                  {config.disclaimer}
                </p>
              </div>

              {/* Test info */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>5-10 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>{totalTrials} trials across {config.blocks.length} blocks</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[var(--color-text-secondary)] text-sm">
                  You will categorize words using the E and I keys as quickly as possible.
                </p>
                <button
                  onClick={startIAT}
                  className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
                  data-testid="iat-start"
                >
                  Begin Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Phase */}
        {phase === 'instructions' && currentBlock && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="card-premium rounded-lg p-12 max-w-xl w-full text-center">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Block {currentBlockIndex + 1} of {config.blocks.length}
              </p>
              <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-6 transition-colors duration-300">
                Instructions
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed whitespace-pre-line transition-colors duration-300">
                {currentBlock.instructions}
              </p>

              {/* Category preview */}
              <div className="flex justify-between mb-8 text-sm">
                <div className="text-left">
                  <div className="text-[var(--color-text-muted)] mb-2">E Key:</div>
                  {currentBlock.leftCategories.map((cat) => (
                    <div key={cat} className="text-[var(--color-text-primary)]">
                      {cat}
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-[var(--color-text-muted)] mb-2">I Key:</div>
                  {currentBlock.rightCategories.map((cat) => (
                    <div key={cat} className="text-[var(--color-text-primary)]">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[var(--color-text-muted)] text-xs mb-6">
                {currentBlock.numTrials} trials in this block
              </p>

              <button
                onClick={beginTrials}
                className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
                data-testid="iat-begin-block"
              >
                Start Block
              </button>
            </div>
          </div>
        )}

        {/* Trial Phase */}
        {phase === 'trial' && currentBlock && currentStimulus && (
          <IATTrial
            stimulus={currentStimulus}
            correctCategory={getCategoryForStimulus(config, currentStimulus) || ''}
            leftCategories={currentBlock.leftCategories}
            rightCategories={currentBlock.rightCategories}
            onResponse={handleTrialResponse}
            showFeedback={true}
            feedbackType={feedbackType}
          />
        )}

        {/* Block Break Phase */}
        {phase === 'block-break' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="card-premium rounded-lg p-12 max-w-xl w-full text-center">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Block Complete
              </p>
              <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
                Take a Brief Break
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed transition-colors duration-300">
                Good work! You've completed block {currentBlockIndex} of {config.blocks.length}.
                <br />
                <br />
                When you're ready, continue to the next block.
              </p>
              <button
                onClick={continueToNextBlock}
                className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
                data-testid="iat-continue"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && results && (
          <IATResultsDisplay
            results={results}
            onRetake={handleRetake}
          />
        )}
      </main>

      {/* Footer during trials */}
      {phase === 'trial' && (
        <footer className="border-t border-[var(--color-border-subtle)] py-4 transition-colors duration-300">
          <div className="mx-auto max-w-3xl px-6 flex justify-between items-center">
            <p className="text-[var(--color-text-muted)] text-xs">
              Trial {currentTrialIndex + 1} of {blockTrials.length}
            </p>
            <p className="text-[var(--color-text-muted)] text-xs">
              Respond as quickly and accurately as possible
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

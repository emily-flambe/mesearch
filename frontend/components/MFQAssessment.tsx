import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from './Layout';
import { items, shuffleItems, type Item, citation } from '../data/mfq-items';
import {
  type Response,
  calculateAllScores,
  serializeResponses,
  deserializeResponses,
  serializeResults,
} from '../data/mfq-scoring';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'mesearch-mfq-responses';
const RESULTS_STORAGE_KEY = 'mesearch-mfq-results';

type AssessmentPhase = 'intro' | 'assessment' | 'complete';

// Likert scale for relevance questions (Part 1)
const relevanceLikertOptions = [
  { value: 0, label: 'Not at all relevant' },
  { value: 1, label: 'Not very relevant' },
  { value: 2, label: 'Slightly relevant' },
  { value: 3, label: 'Somewhat relevant' },
  { value: 4, label: 'Very relevant' },
  { value: 5, label: 'Extremely relevant' },
];

// Likert scale for judgment questions (Part 2)
const judgmentLikertOptions = [
  { value: 0, label: 'Strongly disagree' },
  { value: 1, label: 'Moderately disagree' },
  { value: 2, label: 'Slightly disagree' },
  { value: 3, label: 'Slightly agree' },
  { value: 4, label: 'Moderately agree' },
  { value: 5, label: 'Strongly agree' },
];

export default function MFQAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [shuffledItems, setShuffledItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Initialize shuffled items and check for saved progress
  useEffect(() => {
    const shuffled = shuffleItems(42); // Use consistent seed for now
    setShuffledItems(shuffled);

    // Check for saved progress
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedResponses = deserializeResponses(saved);
      if (savedResponses && savedResponses.length > 0) {
        setHasSavedProgress(true);
      }
    }
  }, []);

  // Resume saved progress
  const resumeProgress = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedResponses = deserializeResponses(saved);
      if (savedResponses) {
        setResponses(savedResponses);
        setCurrentIndex(savedResponses.length);
        setPhase('assessment');
      }
    }
  }, []);

  // Start fresh assessment
  const startFresh = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setResponses([]);
    setCurrentIndex(0);
    setPhase('assessment');
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback(
    (newResponses: Response[]) => {
      localStorage.setItem(STORAGE_KEY, serializeResponses(newResponses));
    },
    []
  );

  // Save results to backend
  const saveResultsToBackend = useCallback(
    async (results: ReturnType<typeof calculateAllScores>) => {
      if (!user) return;

      setSaveStatus('saving');
      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            test_type: 'mfq',
            scores: results,
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
    },
    [user]
  );

  // Handle response selection
  const handleResponse = useCallback(
    (value: number) => {
      const currentItem = shuffledItems[currentIndex];
      if (!currentItem) return;

      const newResponse: Response = {
        itemId: currentItem.id,
        value,
      };

      const newResponses = [...responses, newResponse];
      setResponses(newResponses);
      saveProgress(newResponses);

      // Check if assessment is complete
      if (currentIndex + 1 >= shuffledItems.length) {
        // Calculate and save results
        const results = calculateAllScores(newResponses);
        localStorage.setItem(RESULTS_STORAGE_KEY, serializeResults(results));
        localStorage.removeItem(STORAGE_KEY); // Clear in-progress data
        setPhase('complete');
        // Auto-save to backend if logged in
        saveResultsToBackend(results);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    },
    [currentIndex, shuffledItems, responses, saveProgress, saveResultsToBackend]
  );

  // Go back to previous question
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      const newResponses = responses.slice(0, -1);
      setResponses(newResponses);
      saveProgress(newResponses);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, responses, saveProgress]);

  // Render intro phase
  if (phase === 'intro') {
    return (
      <Layout>
        <main className="mx-auto max-w-2xl px-6 py-16">
          <div className="card-premium rounded-lg p-10">
            <div className="text-center mb-8">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Assessment
              </p>
              <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
                Moral Foundations Questionnaire
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm">MFQ-30</p>
            </div>

            <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
              <p>
                This assessment measures your moral intuitions across five foundations:
                <strong className="text-[var(--color-text-primary)]"> Care</strong>,
                <strong className="text-[var(--color-text-primary)]"> Fairness</strong>,
                <strong className="text-[var(--color-text-primary)]"> Loyalty</strong>,
                <strong className="text-[var(--color-text-primary)]"> Authority</strong>, and
                <strong className="text-[var(--color-text-primary)]"> Purity</strong>.
              </p>

              <p>
                The Moral Foundations Theory was developed by Jonathan Haidt and colleagues
                to understand the psychological basis of morality across cultures.
              </p>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-4">
                <h3 className="text-[var(--color-text-primary)] font-medium">Before you begin:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                  <li>This test contains 30 questions</li>
                  <li>It takes approximately 10-15 minutes to complete</li>
                  <li>Your progress is automatically saved</li>
                  <li>Answer honestly for the most accurate results</li>
                  <li>There are no right or wrong answers</li>
                </ul>
              </div>

              <p className="text-[var(--color-text-muted)] text-xs">
                The test has two parts: first, you&apos;ll rate how relevant certain considerations are
                when deciding right from wrong. Then, you&apos;ll indicate your agreement with specific moral statements.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {hasSavedProgress ? (
                <>
                  <button
                    onClick={resumeProgress}
                    className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                  >
                    Resume Progress
                  </button>
                  <button
                    onClick={startFresh}
                    className="btn-ghost w-full py-4 rounded text-sm tracking-widest uppercase"
                  >
                    Start Over
                  </button>
                </>
              ) : (
                <button
                  onClick={startFresh}
                  className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                >
                  Begin Assessment
                </button>
              )}
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  // Render completion phase
  if (phase === 'complete') {
    return (
      <Layout>
        <main className="mx-auto max-w-2xl px-6 py-16">
          <div className="card-premium rounded-lg p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[var(--color-champagne)] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--color-champagne)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
              Complete
            </p>
            <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
              Assessment Complete
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              Thank you for completing the Moral Foundations Questionnaire. Your results are ready.
            </p>
            {saveStatus === 'saved' && (
              <p className="text-[var(--color-text-muted)] text-xs mb-4">
                Results saved to your account.
              </p>
            )}
            <button
              onClick={() => navigate('/test/mfq/results')}
              className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
            >
              View Results
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  // Render assessment phase
  const currentItem = shuffledItems[currentIndex];
  const progress = ((currentIndex + 1) / shuffledItems.length) * 100;

  // Determine which likert scale to use based on question type
  const likertOptions = currentItem?.questionType === 'relevance'
    ? relevanceLikertOptions
    : judgmentLikertOptions;

  // Get the appropriate instruction text
  const instructionText = currentItem?.questionType === 'relevance'
    ? 'When you decide whether something is right or wrong, to what extent is the following consideration relevant to your thinking?'
    : 'Please indicate your agreement or disagreement with the following statement:';

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col transition-colors duration-300">
      {/* Progress Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/"
              className="font-display text-lg font-semibold tracking-wide text-gold-gradient"
            >
              Mesearch
            </Link>
            <span className="text-[var(--color-text-muted)] text-sm">
              {currentIndex + 1} of {shuffledItems.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-champagne)] to-[var(--color-gold)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Instruction text */}
          <div className="text-center mb-6">
            <p className="text-[var(--color-text-muted)] text-sm italic">
              {instructionText}
            </p>
          </div>

          <div className="text-center mb-12">
            <p className="text-[var(--color-text-primary)] text-xl md:text-2xl leading-relaxed font-light transition-colors duration-300">
              {currentItem?.text}
            </p>
          </div>

          {/* Likert Scale */}
          <div className="space-y-3">
            {likertOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(option.value)}
                className="w-full group"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-champagne)]/50 hover:bg-[var(--color-bg-secondary)]/80 transition-all duration-200">
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] group-hover:border-[var(--color-champagne)] flex items-center justify-center transition-colors duration-200">
                    <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-champagne)] text-sm font-medium transition-colors duration-200">
                      {option.value}
                    </span>
                  </div>
                  <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors duration-200">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Back button */}
          {currentIndex > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleBack}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors duration-200"
              >
                Previous Question
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] py-4 transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-6 flex justify-between items-center">
          <p className="text-[var(--color-text-muted)] text-xs">
            Your progress is automatically saved
          </p>
          <Link
            to="/"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-xs transition-colors duration-200"
          >
            Save & Exit
          </Link>
        </div>
      </footer>
    </div>
  );
}

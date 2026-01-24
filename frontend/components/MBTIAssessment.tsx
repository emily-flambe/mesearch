import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from './Layout';
import { useAuth } from '../contexts/AuthContext';
import { items, shuffleItems, type Item } from '../data/mbti-items';
import {
  type Response,
  calculateAllScores,
  serializeResponses,
  deserializeResponses,
  serializeResults,
} from '../data/mbti-scoring';

const STORAGE_KEY = 'mesearch-mbti-responses';
const RESULTS_STORAGE_KEY = 'mesearch-mbti-results';

type AssessmentPhase = 'intro' | 'assessment' | 'complete';

export default function MBTIAssessment() {
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
    const shuffled = shuffleItems(42); // Use consistent seed
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

  // Save results to backend if user is logged in
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
            test_type: 'mbti',
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
  const saveProgress = useCallback((newResponses: Response[]) => {
    localStorage.setItem(STORAGE_KEY, serializeResponses(newResponses));
  }, []);

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

        // Save to backend if logged in
        saveResultsToBackend(results);

        setPhase('complete');
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
                Myers-Briggs Style Test
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm">
                Open Extended Jungian Type Scales (OEJTS)
              </p>
            </div>

            <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
              <p>
                This assessment measures your personality across four dichotomies:
                <strong className="text-[var(--color-text-primary)]"> Extraversion/Introversion</strong>,
                <strong className="text-[var(--color-text-primary)]"> Sensing/Intuition</strong>,
                <strong className="text-[var(--color-text-primary)]"> Thinking/Feeling</strong>, and
                <strong className="text-[var(--color-text-primary)]"> Judging/Perceiving</strong>.
              </p>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-4">
                <h3 className="text-[var(--color-text-primary)] font-medium">Before you begin:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                  <li>This test contains 32 questions</li>
                  <li>It takes approximately 10-15 minutes to complete</li>
                  <li>Your progress is automatically saved</li>
                  <li>Answer honestly for the most accurate results</li>
                  <li>There are no right or wrong answers</li>
                </ul>
              </div>

              {/* Reliability disclaimer */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-amber-400 text-sm font-medium mb-1">
                  Important Note on Reliability
                </p>
                <p className="text-[var(--color-text-muted)] text-xs">
                  Research shows that 39-76% of people get different MBTI results when retested
                  after 5 weeks. Use these results for self-reflection and exploration, not as a
                  fixed identity. Your type may vary depending on context and mood.
                </p>
              </div>

              <p className="text-[var(--color-text-muted)] text-xs">
                For each pair of descriptions, indicate where you fall on the spectrum between them.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {hasSavedProgress ? (
                <>
                  <button
                    onClick={resumeProgress}
                    className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                    data-testid="mbti-resume"
                  >
                    Resume Progress
                  </button>
                  <button
                    onClick={startFresh}
                    className="btn-ghost w-full py-4 rounded text-sm tracking-widest uppercase"
                    data-testid="mbti-start"
                  >
                    Start Over
                  </button>
                </>
              ) : (
                <button
                  onClick={startFresh}
                  className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                  data-testid="mbti-start"
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
            <p className="text-[var(--color-text-secondary)] mb-2">
              Thank you for completing the Myers-Briggs style assessment. Your results are ready.
            </p>
            {saveStatus === 'saved' && (
              <p className="text-green-500 text-sm mb-6">Results saved to your account.</p>
            )}
            {saveStatus === 'error' && (
              <p className="text-red-500 text-sm mb-6">
                Could not save to account, but results are stored locally.
              </p>
            )}
            {saveStatus === 'saving' && (
              <p className="text-[var(--color-text-muted)] text-sm mb-6">Saving results...</p>
            )}
            {saveStatus === 'idle' && <div className="mb-6" />}
            <button
              onClick={() => navigate('/test/mbti/results')}
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
          <div className="text-center mb-8">
            <p className="text-[var(--color-text-muted)] text-sm mb-4">
              Where do you fall between these two descriptions?
            </p>
          </div>

          {/* Bipolar Scale */}
          <div className="card-premium rounded-lg p-6 md:p-8">
            {/* Left/Right Labels */}
            <div className="flex justify-between mb-6">
              <div className="flex-1 text-left pr-4">
                <p className="text-[var(--color-text-primary)] font-medium text-sm md:text-base">
                  {currentItem?.leftText}
                </p>
              </div>
              <div className="flex-1 text-right pl-4">
                <p className="text-[var(--color-text-primary)] font-medium text-sm md:text-base">
                  {currentItem?.rightText}
                </p>
              </div>
            </div>

            {/* 5-point scale */}
            <div className="flex justify-between gap-2 md:gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleResponse(value)}
                  data-testid={`mbti-option-${value}`}
                  className="flex-1 group"
                >
                  <div
                    className={`
                      aspect-square max-w-16 mx-auto rounded-full border-2
                      flex items-center justify-center transition-all duration-200
                      ${
                        value === 3
                          ? 'border-[var(--color-border)] hover:border-[var(--color-champagne)]/70'
                          : 'border-[var(--color-border)] hover:border-[var(--color-champagne)]'
                      }
                      hover:bg-[var(--color-champagne)]/10
                    `}
                  >
                    <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-champagne)] text-sm font-medium transition-colors duration-200">
                      {value}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Scale labels */}
            <div className="flex justify-between mt-4 text-xs text-[var(--color-text-muted)]">
              <span>Strongly</span>
              <span>Neutral</span>
              <span>Strongly</span>
            </div>
          </div>

          {/* Back button */}
          {currentIndex > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleBack}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors duration-200"
              >
                ← Previous Question
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

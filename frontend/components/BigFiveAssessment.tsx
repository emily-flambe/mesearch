import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { items, shuffleItems, type Item } from '../data/big-five-items';
import {
  type Response,
  calculateAllScores,
  serializeResponses,
  deserializeResponses,
  serializeResults,
} from '../data/big-five-scoring';

const STORAGE_KEY = 'mesearch-bigfive-responses';
const RESULTS_STORAGE_KEY = 'mesearch-bigfive-results';

type AssessmentPhase = 'intro' | 'assessment' | 'complete';

const likertOptions = [
  { value: 1, label: 'Very Inaccurate' },
  { value: 2, label: 'Moderately Inaccurate' },
  { value: 3, label: 'Neither Accurate Nor Inaccurate' },
  { value: 4, label: 'Moderately Accurate' },
  { value: 5, label: 'Very Accurate' },
];

export default function BigFiveAssessment() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [shuffledItems, setShuffledItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

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
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    },
    [currentIndex, shuffledItems, responses, saveProgress]
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
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-16">
          <div className="card-premium rounded-lg p-10">
            <div className="text-center mb-8">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Assessment
              </p>
              <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
                Big Five Personality Test
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm">IPIP-NEO-120</p>
            </div>

            <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
              <p>
                This assessment measures your personality across five major dimensions:
                <strong className="text-[var(--color-text-primary)]"> Openness</strong>,
                <strong className="text-[var(--color-text-primary)]"> Conscientiousness</strong>,
                <strong className="text-[var(--color-text-primary)]"> Extraversion</strong>,
                <strong className="text-[var(--color-text-primary)]"> Agreeableness</strong>, and
                <strong className="text-[var(--color-text-primary)]"> Neuroticism</strong> (OCEAN).
              </p>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-4">
                <h3 className="text-[var(--color-text-primary)] font-medium">Before you begin:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                  <li>This test contains 120 questions</li>
                  <li>It takes approximately 15-20 minutes to complete</li>
                  <li>Your progress is automatically saved</li>
                  <li>Answer honestly for the most accurate results</li>
                  <li>There are no right or wrong answers</li>
                </ul>
              </div>

              <p className="text-[var(--color-text-muted)] text-xs">
                For each statement, indicate how accurately it describes you on a scale from
                "Very Inaccurate" to "Very Accurate."
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
      </div>
    );
  }

  // Render completion phase
  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
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
              Thank you for completing the Big Five personality assessment. Your results are ready.
            </p>
            <button
              onClick={() => navigate('/test/big-five/results')}
              className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
            >
              View Results
            </button>
          </div>
        </main>
      </div>
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
              Mēsearch
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

function Header() {
  return (
    <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-wide text-gold-gradient"
        >
          Mēsearch
        </Link>
      </div>
    </header>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { items, shuffleItems, type ForcedChoiceItem } from '../data/love-languages-items';
import {
  type ForcedChoiceResponse,
  calculateResults,
  serializeResponses,
  deserializeResponses,
  serializeResults,
} from '../data/love-languages-scoring';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'mesearch-communication-styles-responses';
const RESULTS_STORAGE_KEY = 'mesearch-communication-styles-results';

type AssessmentPhase = 'intro' | 'assessment' | 'complete';

export default function LoveLanguagesAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [shuffledItems, setShuffledItems] = useState<ForcedChoiceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<ForcedChoiceResponse[]>([]);
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
  const saveProgress = useCallback((newResponses: ForcedChoiceResponse[]) => {
    localStorage.setItem(STORAGE_KEY, serializeResponses(newResponses));
  }, []);

  // Save results to backend
  const saveResultsToBackend = useCallback(
    async (results: ReturnType<typeof calculateResults>) => {
      if (!user) return;

      setSaveStatus('saving');
      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            test_type: 'love_languages',
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
    (selectedOption: 'A' | 'B') => {
      const currentItem = shuffledItems[currentIndex];
      if (!currentItem) return;

      const newResponse: ForcedChoiceResponse = {
        itemId: currentItem.id,
        selectedOption,
      };

      const newResponses = [...responses, newResponse];
      setResponses(newResponses);
      saveProgress(newResponses);

      // Check if assessment is complete
      if (currentIndex + 1 >= shuffledItems.length) {
        // Calculate and save results
        const results = calculateResults(newResponses);
        localStorage.setItem(RESULTS_STORAGE_KEY, serializeResults(results));
        localStorage.removeItem(STORAGE_KEY); // Clear in-progress data
        setPhase('complete');
        // Save to backend if logged in
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
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-16">
          <div className="card-premium rounded-lg p-10">
            <div className="text-center mb-8">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Assessment
              </p>
              <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
                Communication Styles
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm">
                Discover how you prefer to give and receive appreciation
              </p>
            </div>

            <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
              <p>
                This assessment helps you understand your primary communication styles in
                relationships. You&apos;ll discover how you prefer to express care and
                what makes you feel most valued by others.
              </p>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-4">
                <h3 className="text-[var(--color-text-primary)] font-medium">
                  The Five Communication Styles:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                  <li>
                    <strong className="text-[var(--color-text-secondary)]">Verbal Appreciation</strong> - Words that express gratitude and admiration
                  </li>
                  <li>
                    <strong className="text-[var(--color-text-secondary)]">Focused Attention</strong> - Quality time with undivided presence
                  </li>
                  <li>
                    <strong className="text-[var(--color-text-secondary)]">Thoughtful Tokens</strong> - Meaningful gifts and gestures
                  </li>
                  <li>
                    <strong className="text-[var(--color-text-secondary)]">Helpful Actions</strong> - Acts of service that lighten the load
                  </li>
                  <li>
                    <strong className="text-[var(--color-text-secondary)]">Physical Connection</strong> - Appropriate physical expressions of care
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-4">
                <h3 className="text-[var(--color-text-primary)] font-medium">Before you begin:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                  <li>This test contains {items.length} questions</li>
                  <li>For each question, choose the option that feels more meaningful to you</li>
                  <li>Your progress is automatically saved</li>
                  <li>Trust your gut - there are no wrong answers</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {hasSavedProgress ? (
                <>
                  <button
                    onClick={resumeProgress}
                    className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                    data-testid="love-languages-resume"
                  >
                    Resume Progress
                  </button>
                  <button
                    onClick={startFresh}
                    className="btn-ghost w-full py-4 rounded text-sm tracking-widest uppercase"
                    data-testid="love-languages-start-over"
                  >
                    Start Over
                  </button>
                </>
              ) : (
                <button
                  onClick={startFresh}
                  className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                  data-testid="love-languages-start"
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
              Thank you for completing the Communication Styles assessment. Your results are ready.
            </p>
            <button
              onClick={() => navigate('/test/communication-styles/results')}
              className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
              data-testid="love-languages-view-results"
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
            <p className="text-[var(--color-text-muted)] text-sm mb-2">
              Which feels more meaningful to you?
            </p>
          </div>

          {/* A/B Choice Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleResponse('A')}
              className="w-full group"
              data-testid="love-languages-option-a"
            >
              <div className="p-6 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-champagne)] hover:bg-[var(--color-bg-secondary)]/80 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[var(--color-border)] group-hover:border-[var(--color-champagne)] group-hover:bg-[var(--color-champagne)]/10 flex items-center justify-center transition-all duration-200">
                    <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-champagne)] text-lg font-medium transition-colors duration-200">
                      A
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] text-left text-lg leading-relaxed transition-colors duration-200 pt-1">
                    {currentItem?.optionA.text}
                  </p>
                </div>
              </div>
            </button>

            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-[var(--color-border)]" />
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>

            <button
              onClick={() => handleResponse('B')}
              className="w-full group"
              data-testid="love-languages-option-b"
            >
              <div className="p-6 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-champagne)] hover:bg-[var(--color-bg-secondary)]/80 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[var(--color-border)] group-hover:border-[var(--color-champagne)] group-hover:bg-[var(--color-champagne)]/10 flex items-center justify-center transition-all duration-200">
                    <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-champagne)] text-lg font-medium transition-colors duration-200">
                      B
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] text-left text-lg leading-relaxed transition-colors duration-200 pt-1">
                    {currentItem?.optionB.text}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Back button */}
          {currentIndex > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleBack}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors duration-200"
                data-testid="love-languages-back"
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

function Header() {
  return (
    <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-wide text-gold-gradient"
        >
          Mesearch
        </Link>
      </div>
    </header>
  );
}

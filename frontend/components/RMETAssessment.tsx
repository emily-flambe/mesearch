import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from './Layout';
import {
  scoredItems,
  practiceItem,
  hasDefinition,
  getDefinition,
  type RMETItem,
} from '../data/rmet-items';
import {
  type RMETResponse,
  calculateResults,
  serializeResponses,
  deserializeResponses,
  serializeResults,
} from '../data/rmet-scoring';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'mesearch-rmet-responses';
const RESULTS_STORAGE_KEY = 'mesearch-rmet-results';

type AssessmentPhase = 'intro' | 'practice' | 'assessment' | 'complete';

export default function RMETAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<RMETResponse[]>([]);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [tooltipWord, setTooltipWord] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [pendingResponse, setPendingResponse] = useState<RMETResponse | null>(null);

  // Check for saved progress
  useEffect(() => {
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
        setStartTime(Date.now());
      }
    }
  }, []);

  // Start fresh assessment
  const startFresh = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setResponses([]);
    setCurrentIndex(0);
    setPhase('practice');
  }, []);

  // Start practice
  const startPractice = useCallback(() => {
    setPhase('practice');
    setStartTime(Date.now());
  }, []);

  // Complete practice and start assessment
  const completePractice = useCallback(() => {
    setPhase('assessment');
    setCurrentIndex(0);
    setStartTime(Date.now());
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newResponses: RMETResponse[]) => {
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
            test_type: 'rmet',
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

  // Handle response selection - show feedback first
  const handleResponse = useCallback(
    (answer: string) => {
      if (showFeedback) return; // Ignore clicks while showing feedback

      const currentItem = phase === 'practice' ? practiceItem : scoredItems[currentIndex];
      if (!currentItem) return;

      const responseTime = startTime ? Date.now() - startTime : undefined;

      // Store the selected answer and show feedback
      setSelectedAnswer(answer);
      setShowFeedback(true);

      if (phase !== 'practice') {
        // Store the pending response to be committed when user continues
        const newResponse: RMETResponse = {
          itemId: currentItem.id,
          selectedAnswer: answer,
          responseTime,
        };
        setPendingResponse(newResponse);
      }
    },
    [showFeedback, phase, currentIndex, startTime]
  );

  // Handle continue after feedback
  const handleContinue = useCallback(() => {
    if (phase === 'practice') {
      // Practice item - just continue to assessment
      setShowFeedback(false);
      setSelectedAnswer(null);
      completePractice();
      return;
    }

    if (!pendingResponse) return;

    const newResponses = [...responses, pendingResponse];
    setResponses(newResponses);
    saveProgress(newResponses);
    setStartTime(Date.now()); // Reset for next item

    // Reset feedback state
    setShowFeedback(false);
    setSelectedAnswer(null);
    setPendingResponse(null);

    // Check if assessment is complete
    if (currentIndex + 1 >= scoredItems.length) {
      const results = calculateResults(newResponses);
      localStorage.setItem(RESULTS_STORAGE_KEY, serializeResults(results));
      localStorage.removeItem(STORAGE_KEY);
      setPhase('complete');
      saveResultsToBackend(results);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [
    phase,
    currentIndex,
    responses,
    pendingResponse,
    saveProgress,
    completePractice,
    saveResultsToBackend,
  ]);

  // Go back to previous question
  const handleBack = useCallback(() => {
    if (currentIndex > 0 && phase === 'assessment') {
      const newResponses = responses.slice(0, -1);
      setResponses(newResponses);
      saveProgress(newResponses);
      setCurrentIndex(currentIndex - 1);
      setStartTime(Date.now());
    }
  }, [currentIndex, phase, responses, saveProgress]);

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
                Reading the Mind in the Eyes Test
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm">RMET</p>
            </div>

            <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
              <p>
                This assessment measures your ability to recognize{' '}
                <strong className="text-[var(--color-text-primary)]">
                  mental states
                </strong>{' '}
                and{' '}
                <strong className="text-[var(--color-text-primary)]">emotions</strong>{' '}
                from looking at photographs of people&apos;s eyes.
              </p>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-4">
                <h3 className="text-[var(--color-text-primary)] font-medium">
                  How it works:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                  <li>You will see 37 photographs of eye regions</li>
                  <li>For each image, choose the word that best describes what the person is feeling or thinking</li>
                  <li>There are 4 options per image - pick the one that fits best</li>
                  <li>Hover or tap words with a dotted underline to see definitions</li>
                  <li>Your progress is automatically saved</li>
                </ul>
              </div>

              <div className="bg-[var(--color-discovery)]/10 border border-[var(--color-discovery-border)] rounded-lg p-4">
                <p className="text-[var(--color-discovery)] text-sm font-medium mb-1">
                  Research Note
                </p>
                <p className="text-[var(--color-text-muted)] text-xs">
                  This is the Multiracial RMET (MRMET) developed by Warrier et al. (2024),
                  an inclusive version of the original RMET with racially diverse stimuli.
                  It measures &quot;theory of mind&quot; - the ability to attribute mental states to others.
                </p>
              </div>

              <div className="text-[var(--color-text-muted)] text-xs border-t border-[var(--color-border-subtle)] pt-4 mt-4">
                <p className="font-medium mb-1">Attribution</p>
                <p>
                  MRMET stimuli © The Many Brains Project and Harvard University.
                  Licensed under{' '}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-champagne)] hover:underline"
                  >
                    CC-BY-SA 4.0
                  </a>
                  .
                </p>
              </div>

              <p className="text-[var(--color-text-muted)] text-xs">
                Note: For some words, definitions are available. Look for the dotted
                underline.
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
                  onClick={startPractice}
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
            <p className="text-[var(--color-text-secondary)] mb-4">
              Thank you for completing the Reading the Mind in the Eyes Test. Your
              results are ready.
            </p>
            {saveStatus === 'saving' && (
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                Saving results...
              </p>
            )}
            {saveStatus === 'saved' && (
              <p className="text-green-500 text-sm mb-4">Results saved to your account!</p>
            )}
            {saveStatus === 'error' && (
              <p className="text-red-500 text-sm mb-4">
                Could not save results. They are stored locally.
              </p>
            )}
            <button
              onClick={() => navigate('/test/rmet/results')}
              className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
            >
              View Results
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  // Get current item (practice or scored)
  const currentItem: RMETItem = phase === 'practice' ? practiceItem : scoredItems[currentIndex];
  const totalItems = scoredItems.length;
  const progress =
    phase === 'practice' ? 0 : ((currentIndex + 1) / totalItems) * 100;

  // Render assessment/practice phase
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
              {phase === 'practice' ? (
                'Practice'
              ) : (
                <>
                  {currentIndex + 1} of {totalItems}
                </>
              )}
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
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          {/* Practice indicator */}
          {phase === 'practice' && (
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-discovery)]/20 border border-[var(--color-discovery-border)] text-[var(--color-discovery)] text-xs tracking-wide uppercase">
                Practice Question
              </span>
            </div>
          )}

          {/* Eye Image */}
          <div className="mb-8">
            <EyeImage item={currentItem} />
          </div>

          {/* Question prompt */}
          <p className="text-center text-[var(--color-text-secondary)] text-sm mb-6">
            Which word best describes what this person is feeling or thinking?
          </p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentItem.options.map((option) => {
              const hasDef = hasDefinition(option);
              const isCorrect = option.toLowerCase() === currentItem.correctAnswer.toLowerCase();
              const isSelected = selectedAnswer?.toLowerCase() === option.toLowerCase();
              const showCorrectHighlight = showFeedback && isCorrect;
              const showWrongHighlight = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={option}
                  onClick={() => handleResponse(option)}
                  onMouseEnter={() => hasDef && !showFeedback && setTooltipWord(option)}
                  onMouseLeave={() => setTooltipWord(null)}
                  disabled={showFeedback}
                  className={`relative group ${showFeedback ? 'cursor-default' : ''}`}
                >
                  <div
                    className={`p-4 rounded-lg border transition-all duration-200 text-center ${
                      showCorrectHighlight
                        ? 'border-green-500 bg-green-500/20'
                        : showWrongHighlight
                        ? 'border-red-500 bg-red-500/20'
                        : showFeedback
                        ? 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] opacity-50'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-champagne)]/50 hover:bg-[var(--color-bg-secondary)]/80'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {/* Checkmark for correct answer */}
                      {showCorrectHighlight && (
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
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
                      )}
                      {/* X for wrong selection */}
                      {showWrongHighlight && (
                        <svg
                          className="w-5 h-5 text-red-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <span
                        className={`transition-colors duration-200 capitalize ${
                          showCorrectHighlight
                            ? 'text-green-400 font-medium'
                            : showWrongHighlight
                            ? 'text-red-400'
                            : showFeedback
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'
                        } ${
                          hasDef && !showFeedback
                            ? 'border-b border-dotted border-[var(--color-text-muted)]'
                            : ''
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </div>
                  {/* Tooltip */}
                  {tooltipWord === option && hasDef && !showFeedback && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg shadow-lg z-10 w-48">
                      <p className="text-[var(--color-text-secondary)] text-xs">
                        {getDefinition(option)}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue button after feedback */}
          {showFeedback && (
            <div className="mt-6 text-center">
              <button
                onClick={handleContinue}
                className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
                data-testid="rmet-continue-button"
              >
                Continue
              </button>
            </div>
          )}

          {/* Back button - hide during feedback */}
          {currentIndex > 0 && phase === 'assessment' && !showFeedback && (
            <div className="mt-8 text-center">
              <button
                onClick={handleBack}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors duration-200"
              >
                &larr; Previous Question
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] py-4 transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-6 flex justify-between items-center">
          <p className="text-[var(--color-text-muted)] text-xs">
            {phase === 'practice'
              ? 'This is a practice question'
              : 'Your progress is automatically saved'}
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

// Eye Image component - displays placeholder or actual image
function EyeImage({ item }: { item: RMETItem }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset state when item changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [item.id]);

  // Show placeholder only if there's an error loading the image
  // MRMET images are served from /images/mrmet/
  const showPlaceholder = imageError;

  if (showPlaceholder) {
    return (
      <div
        className="relative w-full aspect-[2/1] bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] flex items-center justify-center overflow-hidden"
        data-testid="rmet-image-placeholder"
      >
        {/* Stylized eye placeholder */}
        <svg
          viewBox="0 0 200 100"
          className="w-3/4 h-3/4 text-[var(--color-text-muted)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Eye outline */}
          <path
            d="M 20 50 Q 100 10 180 50 Q 100 90 20 50"
            fill="var(--color-bg-tertiary)"
          />
          {/* Iris */}
          <circle cx="100" cy="50" r="25" fill="var(--color-border)" />
          {/* Pupil */}
          <circle cx="100" cy="50" r="12" fill="var(--color-text-muted)" opacity="0.5" />
          {/* Reflection */}
          <circle cx="108" cy="42" r="5" fill="var(--color-bg-secondary)" />
          {/* Eyebrow suggestion */}
          <path
            d="M 30 25 Q 100 5 170 25"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute bottom-2 right-2">
          <span className="text-[var(--color-text-muted)] text-xs opacity-50">
            #{item.id}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[2/1] bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-[var(--color-text-muted)] text-sm">
            Loading...
          </div>
        </div>
      )}
      <img
        src={item.imageUrl}
        alt={`Eye photograph ${item.id}`}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        data-testid="rmet-image"
      />
    </div>
  );
}

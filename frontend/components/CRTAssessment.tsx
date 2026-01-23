import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { crtItems, priorExposureOptions, type PriorExposure } from '../data/crt-items';
import {
  calculateCRTScores,
  serializeCRTResponses,
  deserializeCRTResponses,
  serializeCRTResults,
  type CRTResults,
} from '../data/crt-scoring';
import { useAuth } from '../contexts/AuthContext';
import CRTResultsComponent from './CRTResults';

const STORAGE_KEY = 'mesearch-crt-responses';
const RESULTS_STORAGE_KEY = 'mesearch-crt-results';

type Phase = 'intro' | 'prior-exposure' | 'questions' | 'results';

export default function CRTAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('intro');
  const [priorExposure, setPriorExposure] = useState<PriorExposure | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [results, setResults] = useState<CRTResults | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Check for saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedData = deserializeCRTResponses(saved);
      if (savedData && Object.keys(savedData).length > 0) {
        setHasSavedProgress(true);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newResponses: Record<number, string>) => {
    localStorage.setItem(STORAGE_KEY, serializeCRTResponses(newResponses));
  }, []);

  // Resume saved progress
  const resumeProgress = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedData = deserializeCRTResponses(saved);
      if (savedData) {
        setResponses(savedData);
        // Find next unanswered question
        const answeredIds = Object.keys(savedData).map(Number);
        const nextIndex = crtItems.findIndex((item) => !answeredIds.includes(item.id));
        setCurrentIndex(nextIndex >= 0 ? nextIndex : 0);
        setPhase('questions');
      }
    }
  }, []);

  // Start fresh assessment
  const startFresh = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setResponses({});
    setCurrentIndex(0);
    setCurrentAnswer('');
    setPriorExposure(null);
    setPhase('prior-exposure');
  }, []);

  // Save results to backend if user is logged in
  async function saveResultsToBackend(calculatedResults: CRTResults) {
    if (!user) return;

    setSaveStatus('saving');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          test_type: 'crt',
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
  }

  // Handle prior exposure selection
  const handlePriorExposure = useCallback((value: PriorExposure) => {
    setPriorExposure(value);
    setPhase('questions');
  }, []);

  // Handle answer submission
  const handleSubmitAnswer = useCallback(() => {
    if (!currentAnswer.trim()) return;

    const currentItem = crtItems[currentIndex];
    const newResponses = { ...responses, [currentItem.id]: currentAnswer };
    setResponses(newResponses);
    saveProgress(newResponses);

    // Check if assessment is complete
    if (currentIndex + 1 >= crtItems.length) {
      // Calculate and save results
      const calculatedResults = calculateCRTScores(newResponses, priorExposure || 'none');
      setResults(calculatedResults);
      localStorage.setItem(RESULTS_STORAGE_KEY, serializeCRTResults(calculatedResults));
      localStorage.removeItem(STORAGE_KEY); // Clear in-progress data
      setPhase('results');
      // Save to backend if logged in
      saveResultsToBackend(calculatedResults);
    } else {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer('');
    }
  }, [currentAnswer, currentIndex, responses, priorExposure, saveProgress]);

  // Handle keyboard submit
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentAnswer.trim()) {
      handleSubmitAnswer();
    }
  }, [currentAnswer, handleSubmitAnswer]);

  // Go back to previous question
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevItem = crtItems[currentIndex - 1];
      setCurrentAnswer(responses[prevItem.id] || '');
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, responses]);

  // Retake the test
  const handleRetake = useCallback(() => {
    setPhase('intro');
    setCurrentIndex(0);
    setResponses({});
    setCurrentAnswer('');
    setResults(null);
    setPriorExposure(null);
    setSaveStatus('idle');
  }, []);

  // Render intro phase
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-16">
          <div className="card-premium rounded-lg p-10">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs tracking-wide uppercase mb-4">
                Research-Backed
              </span>
              <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
                Cognitive Reflection Test
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm">CRT-7</p>
            </div>

            <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
              <p>
                The Cognitive Reflection Test measures your tendency to override an intuitive
                response and engage in further reflection to find the correct answer.
              </p>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-4">
                <h3 className="text-[var(--color-text-primary)] font-medium">Before you begin:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                  <li>This test contains 7 questions</li>
                  <li>Each question has a correct answer</li>
                  <li>Type your answer in the text field</li>
                  <li>Take your time - there is no time limit</li>
                  <li>Try to solve each problem without outside help</li>
                </ul>
              </div>

              <p className="text-[var(--color-text-muted)] text-xs">
                These problems are designed to have an intuitive answer that feels right
                but is actually wrong. The correct answer requires more careful thought.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {hasSavedProgress ? (
                <>
                  <button
                    onClick={resumeProgress}
                    className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                    data-testid="crt-resume"
                  >
                    Resume Progress
                  </button>
                  <button
                    onClick={startFresh}
                    className="btn-ghost w-full py-4 rounded text-sm tracking-widest uppercase"
                    data-testid="crt-start"
                  >
                    Start Over
                  </button>
                </>
              ) : (
                <button
                  onClick={startFresh}
                  className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase"
                  data-testid="crt-start"
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

  // Render prior exposure phase
  if (phase === 'prior-exposure') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-16">
          <div className="card-premium rounded-lg p-10">
            <div className="text-center mb-8">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Quick Question
              </p>
              <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
                Have you seen these problems before?
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm">
                This helps us interpret your results more accurately.
              </p>
            </div>

            <div className="space-y-3">
              {priorExposureOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePriorExposure(option.value as PriorExposure)}
                  className="w-full p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-champagne)]/50 hover:bg-[var(--color-bg-tertiary)] transition-all duration-200 text-left"
                  data-testid={`crt-exposure-${option.value}`}
                >
                  <span className="text-[var(--color-text-secondary)] text-sm">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render results phase
  if (phase === 'results' && results) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-4xl px-6 py-12">
          <CRTResultsComponent results={results} onRetake={handleRetake} />
        </main>
      </div>
    );
  }

  // Render assessment phase
  const currentItem = crtItems[currentIndex];
  const progress = ((currentIndex + 1) / crtItems.length) * 100;

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
              {currentIndex + 1} of {crtItems.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Problem name */}
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs tracking-wide uppercase">
              {currentItem.name}
            </span>
          </div>

          <div className="card-premium rounded-lg p-8 md:p-10">
            {/* Question text */}
            <p className="text-[var(--color-text-primary)] text-lg md:text-xl leading-relaxed mb-8 transition-colors duration-300">
              {currentItem.text}
            </p>

            {/* Free-text input */}
            <div className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-[var(--color-text-muted)] text-sm mb-2">
                  Your Answer:
                </label>
                <input
                  type="text"
                  id="answer"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                  autoFocus
                  data-testid="crt-answer-input"
                />
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim()}
                className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="crt-submit"
              >
                {currentIndex + 1 >= crtItems.length ? 'Submit & See Results' : 'Next Question'}
              </button>
            </div>
          </div>

          {/* Back button */}
          {currentIndex > 0 && (
            <div className="mt-6 text-center">
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

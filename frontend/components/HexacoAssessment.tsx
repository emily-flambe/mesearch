import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hexacoItems } from '../data/hexaco-items';
import { HexacoResponse, getProgress } from '../data/hexaco-scoring';

interface HexacoAssessmentProps {
  onComplete: (responses: HexacoResponse[]) => void;
}

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export default function HexacoAssessment({ onComplete }: HexacoAssessmentProps) {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Map<number, number>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add noindex meta tag
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const currentItem = hexacoItems[currentIndex];
  const progress = getProgress(
    Array.from(responses.entries()).map(([itemId, value]) => ({ itemId, value }))
  );
  const isLastQuestion = currentIndex === hexacoItems.length - 1;
  const canGoBack = currentIndex > 0;
  const canGoForward = responses.has(currentItem.id) && currentIndex < hexacoItems.length - 1;
  const canSubmit = responses.size === hexacoItems.length;

  const handleResponse = (value: number) => {
    const newResponses = new Map(responses);
    newResponses.set(currentItem.id, value);
    setResponses(newResponses);

    // Auto-advance after a brief delay if not last question
    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, hexacoItems.length - 1));
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (canSubmit) {
      const responseArray: HexacoResponse[] = Array.from(responses.entries()).map(
        ([itemId, value]) => ({ itemId, value })
      );
      onComplete(responseArray);
      navigate('/hexaco/results');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Minimal Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-wide text-gold-gradient"
          >
            Mesearch
          </Link>
          <span className="text-[var(--color-text-muted)] text-sm">
            HEXACO-60 Assessment
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--color-text-muted)] text-xs tracking-wide uppercase">
              Progress
            </span>
            <span className="text-[var(--color-text-secondary)] text-sm">
              {currentIndex + 1} of {hexacoItems.length}
            </span>
          </div>
          <div className="w-full bg-[var(--color-border)] rounded-full h-1.5">
            <div
              className="bg-[var(--color-champagne)] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="card-premium rounded-lg p-8 md:p-12">
          {/* Question Number */}
          <div className="text-center mb-8">
            <span className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase">
              Question {currentIndex + 1}
            </span>
          </div>

          {/* Question Text */}
          <p className="text-[var(--color-text-primary)] text-xl md:text-2xl text-center leading-relaxed mb-12 font-light transition-colors duration-300">
            {currentItem.text}
          </p>

          {/* Likert Scale */}
          <div className="space-y-3">
            {LIKERT_OPTIONS.map((option) => {
              const isSelected = responses.get(currentItem.id) === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleResponse(option.value)}
                  className={`w-full py-4 px-6 rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-[var(--color-champagne)]/20 border-[var(--color-champagne)] text-[var(--color-champagne)]'
                      : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-champagne)]/50 hover:text-[var(--color-text-primary)]'
                  } border`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-[var(--color-champagne)]'
                          : 'border-[var(--color-text-muted)]'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-champagne)]" />
                      )}
                    </span>
                    <span className="text-sm md:text-base">{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-[var(--color-border-subtle)]">
            <button
              onClick={handlePrevious}
              disabled={!canGoBack}
              className={`px-6 py-2 rounded text-sm tracking-wide transition-colors ${
                canGoBack
                  ? 'text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)]'
                  : 'text-[var(--color-text-muted)] cursor-not-allowed'
              }`}
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-8 py-3 rounded text-sm tracking-widest uppercase transition-all ${
                  canSubmit
                    ? 'btn-gold'
                    : 'bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed'
                }`}
              >
                View Results
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canGoForward}
                className={`px-6 py-2 rounded text-sm tracking-wide transition-colors ${
                  canGoForward
                    ? 'text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)]'
                    : 'text-[var(--color-text-muted)] cursor-not-allowed'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-[var(--color-text-muted)] text-xs mt-8">
          Answer honestly based on how you typically think, feel, and behave.
          <br />
          There are no right or wrong answers.
        </p>
      </main>
    </div>
  );
}

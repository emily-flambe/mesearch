import { useState } from 'react';
import { Link } from 'react-router-dom';
import { miniTestItems, miniTestDimensionColors, type MiniTestItem } from '../data/mini-test-items';
import { useAuth } from '../contexts/AuthContext';

type LikertValue = 1 | 2 | 3 | 4 | 5;

const likertScale: { value: LikertValue; label: string }[] = [
  { value: 1, label: 'Very Inaccurate' },
  { value: 2, label: 'Moderately Inaccurate' },
  { value: 3, label: 'Neither Accurate Nor Inaccurate' },
  { value: 4, label: 'Moderately Accurate' },
  { value: 5, label: 'Very Accurate' },
];

interface MiniTestResult {
  responses: Record<number, LikertValue>;
  dimensionScores: { dimension: string; dimensionName: string; score: number; color: string }[];
}

type Phase = 'intro' | 'questions' | 'results';

export default function MiniTestAssessment() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, LikertValue>>({});
  const [result, setResult] = useState<MiniTestResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const totalQuestions = miniTestItems.length;
  const currentItem = miniTestItems[currentQuestion];

  // Save results to backend if user is logged in
  async function saveResults(calculatedResult: MiniTestResult) {
    if (!user) return;

    setSaveStatus('saving');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          test_type: 'mini_test',
          scores: calculatedResult,
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

  const calculateResults = (allResponses: Record<number, LikertValue>): MiniTestResult => {
    const dimensionScores = miniTestItems.map((item: MiniTestItem) => {
      const response = allResponses[item.id];
      const score = item.isReversed ? 6 - response : response;
      return {
        dimension: item.dimension,
        dimensionName: item.dimensionName,
        score,
        color: miniTestDimensionColors[item.dimension],
      };
    });

    return { responses: allResponses, dimensionScores };
  };

  const handleAnswer = (value: LikertValue) => {
    const newResponses = { ...responses, [currentItem.id]: value };
    setResponses(newResponses);

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const calculatedResult = calculateResults(newResponses);
        setResult(calculatedResult);
        setPhase('results');
        // Auto-save if logged in
        saveResults(calculatedResult);
      }
    }, 200);
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentQuestion(0);
    setResponses({});
    setResult(null);
    setSaveStatus('idle');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            Mesearch
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {phase === 'intro' && (
          <div className="text-center">
            <div className="card-premium rounded-lg p-12">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs tracking-wide uppercase mb-4">
                Debug / Testing Only
              </div>
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Quick Assessment
              </p>
              <h1 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
                Mini-Test
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed max-w-lg mx-auto transition-colors duration-300">
                A 5-question sampler covering one item from each Big Five personality dimension.
                This test is for debugging and automated testing purposes only.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~1 minute</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{totalQuestions} questions</span>
                </div>
              </div>

              <button
                onClick={() => setPhase('questions')}
                className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
                data-testid="mini-test-start"
              >
                Begin Mini-Test
              </button>
            </div>
          </div>
        )}

        {phase === 'questions' && currentItem && (
          <div>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-2">
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-1 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                    backgroundColor: miniTestDimensionColors[currentItem.dimension],
                  }}
                />
              </div>
            </div>

            {/* Dimension indicator */}
            <div className="text-center mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs tracking-wide uppercase"
                style={{
                  backgroundColor: `${miniTestDimensionColors[currentItem.dimension]}20`,
                  color: miniTestDimensionColors[currentItem.dimension],
                  borderColor: `${miniTestDimensionColors[currentItem.dimension]}40`,
                  borderWidth: '1px',
                }}
              >
                {currentItem.dimensionName}
              </span>
            </div>

            {/* Question card */}
            <div className="card-premium rounded-lg p-8 md:p-12">
              <p className="font-display text-2xl md:text-3xl text-[var(--color-text-primary)] mb-10 leading-relaxed text-center transition-colors duration-300">
                {currentItem.text}
              </p>

              {/* Likert scale */}
              <div className="space-y-3">
                {likertScale.map((option) => {
                  const isSelected = responses[currentItem.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      data-testid={`mini-test-option-${option.value}`}
                      className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[var(--color-champagne)] bg-[var(--color-champagne)]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-champagne)]/50 hover:bg-[var(--color-bg-tertiary)]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[var(--color-champagne)] bg-[var(--color-champagne)]'
                              : 'border-[var(--color-text-muted)]'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-[var(--color-bg-primary)]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            isSelected
                              ? 'text-[var(--color-champagne)]'
                              : 'text-[var(--color-text-secondary)]'
                          } transition-colors`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation hint */}
            <p className="text-center text-[var(--color-text-muted)] text-xs mt-6">
              Select an option to continue
            </p>
          </div>
        )}

        {phase === 'results' && result && (
          <div className="text-center">
            <div className="card-premium rounded-lg p-12">
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
                Mini-Test Complete
              </p>
              <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-8 transition-colors duration-300">
                Your Results
              </h2>

              <div className="space-y-4 mb-8" data-testid="mini-test-results">
                {result.dimensionScores.map((score) => (
                  <div key={score.dimension} className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-tertiary)]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: score.color }}
                      />
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {score.dimensionName}
                      </span>
                    </div>
                    <span className="text-[var(--color-text-secondary)]">
                      {score.score} / 5
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetake}
                  className="btn-ghost px-8 py-3 rounded text-xs tracking-widest uppercase"
                >
                  Retake
                </button>
                <Link
                  to="/"
                  className="btn-gold px-8 py-3 rounded text-xs tracking-widest uppercase"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  type CommunicationStylesResults,
  deserializeResults,
  getScoreInterpretation,
} from '../data/love-languages-scoring';
import { styleInfo, type CommunicationStyle } from '../data/love-languages-items';

const RESULTS_STORAGE_KEY = 'mesearch-communication-styles-results';

interface LoveLanguagesResultsProps {
  initialResults?: CommunicationStylesResults;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function LoveLanguagesResults({ initialResults, showHeader = true, showActions = true }: LoveLanguagesResultsProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<CommunicationStylesResults | null>(initialResults || null);
  const [expandedStyle, setExpandedStyle] = useState<CommunicationStyle | null>(null);

  useEffect(() => {
    // Only load from localStorage if no initial results provided
    if (!initialResults) {
      const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
      if (stored) {
        const parsed = deserializeResults(stored);
        if (parsed) {
          setResults(parsed);
        } else {
          // Invalid data, redirect to assessment
          navigate('/test/communication-styles');
        }
      } else {
        // No results, redirect to assessment
        navigate('/test/communication-styles');
      }
    }
  }, [navigate, initialResults]);

  if (!results) {
    return (
      <div className={showHeader ? "min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center" : ""}>
        <div className="text-[var(--color-text-muted)]">Loading results...</div>
      </div>
    );
  }

  const primaryStyle = styleInfo[results.primary];
  const secondaryStyle = styleInfo[results.secondary];

  return (
    <div className={showHeader ? "min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300" : ""}>
      {/* Header */}
      {showHeader && (
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
      )}

      <main className="mx-auto max-w-3xl px-6 py-12" data-testid="love-languages-results">
        {/* Results Header */}
        <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h1 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
            Communication Styles Profile
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
            Based on your responses, here&apos;s how you prefer to give and receive appreciation
          </p>
        </div>

        {/* Primary Style Card */}
        <div className="card-premium rounded-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: primaryStyle.color }}
            />
            <span className="text-[var(--color-champagne)] text-xs tracking-[0.2em] uppercase">
              Primary Style
            </span>
          </div>
          <h2
            className="font-display text-3xl font-medium mb-4 transition-colors duration-300"
            style={{ color: primaryStyle.color }}
            data-testid="primary-style"
          >
            {primaryStyle.name}
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
            {primaryStyle.description}
          </p>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
            <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide mb-3">
              What this looks like:
            </p>
            <ul className="space-y-2">
              {primaryStyle.examples.map((example, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[var(--color-text-secondary)] text-sm"
                >
                  <span style={{ color: primaryStyle.color }}>-</span>
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Secondary Style Card */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: secondaryStyle.color }}
            />
            <span className="text-[var(--color-text-muted)] text-xs tracking-[0.2em] uppercase">
              Secondary Style
            </span>
          </div>
          <h3
            className="font-display text-2xl font-medium mb-4 transition-colors duration-300"
            style={{ color: secondaryStyle.color }}
            data-testid="secondary-style"
          >
            {secondaryStyle.name}
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {secondaryStyle.description}
          </p>
        </div>

        {/* All Styles Ranking */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="font-display text-xl font-medium text-[var(--color-text-primary)] mb-6 transition-colors duration-300">
            Your Complete Profile
          </h3>
          <div className="space-y-4" data-testid="style-ranking">
            {results.styles.map((score, index) => {
              const info = styleInfo[score.style];
              const isExpanded = expandedStyle === score.style;

              return (
                <div key={score.style}>
                  <button
                    onClick={() => setExpandedStyle(isExpanded ? null : score.style)}
                    className="w-full text-left"
                    data-testid={`style-${score.style}`}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors duration-200">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                        <span className="text-[var(--color-text-muted)] text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>

                      {/* Style name and bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[var(--color-text-primary)] font-medium">
                            {score.name}
                          </span>
                          <span className="text-[var(--color-text-muted)] text-sm">
                            {score.count} / 12 ({score.percentage}%)
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${score.percentage}%`,
                              backgroundColor: score.color,
                            }}
                          />
                        </div>
                      </div>

                      {/* Expand indicator */}
                      <div className="flex-shrink-0">
                        <svg
                          className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-2 ml-12 p-4 rounded-lg bg-[var(--color-bg-tertiary)] animate-fade-in">
                      <p className="text-[var(--color-text-secondary)] text-sm mb-3">
                        {info.description}
                      </p>
                      <p className="text-[var(--color-text-muted)] text-xs">
                        Strength: {getScoreInterpretation(score.percentage)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Interpretation */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="font-display text-xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
            Understanding Your Profile
          </h3>
          <div className="space-y-4 text-[var(--color-text-secondary)] text-sm leading-relaxed">
            <p>
              Your <strong style={{ color: primaryStyle.color }}>{primaryStyle.name}</strong> as
              your primary style means this is likely how you naturally express care and what
              makes you feel most appreciated by others.
            </p>
            <p>
              Your secondary style, <strong style={{ color: secondaryStyle.color }}>{secondaryStyle.name}</strong>,
              is also important to you and may become more prominent in certain situations or
              relationships.
            </p>
            <p>
              Remember that all five styles are valuable, and most people use a combination.
              Understanding your preferences can help you communicate more effectively about
              what you need and recognize how others might be showing care in their own way.
            </p>
          </div>
        </div>

        {/* Attribution */}
        <div className="text-center mb-8 text-xs text-[var(--color-text-muted)]">
          <p>
            This assessment is based on the relationship communication framework popularized by
            Gary Chapman&apos;s &quot;The 5 Love Languages.&quot; This is an independent implementation
            with original questions, not affiliated with or endorsed by Gary Chapman or the official
            Love Languages brand.
          </p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/test/communication-styles"
              className="btn-ghost px-8 py-4 rounded text-sm tracking-widest uppercase text-center"
            >
              Retake Assessment
            </Link>
            <Link
              to="/"
              className="btn-gold px-8 py-4 rounded text-sm tracking-widest uppercase text-center"
            >
              Return Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

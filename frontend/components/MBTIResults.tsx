import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  type MBTIResults as Results,
  type DimensionScore,
  deserializeResults,
  getConfidenceDescription,
  getPoleDescription,
  getPoleName,
} from '../data/mbti-scoring';
import { dimensionInfo, typeDescriptions, type Dimension } from '../data/mbti-items';

const RESULTS_STORAGE_KEY = 'mesearch-mbti-results';

interface MBTIResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function MBTIResults({ initialResults, showHeader = true, showActions = true }: MBTIResultsProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(initialResults || null);
  const [expandedDimension, setExpandedDimension] = useState<Dimension | null>(null);

  useEffect(() => {
    // Only load from localStorage if no initial results provided
    if (!initialResults) {
      const saved = localStorage.getItem(RESULTS_STORAGE_KEY);
      if (saved) {
        const parsed = deserializeResults(saved);
        setResults(parsed);
      }
    }
  }, [initialResults]);

  if (!results) {
    return (
      <div className={showHeader ? "min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300" : ""}>
        {showHeader && <Header />}
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="card-premium rounded-lg p-10">
            <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-4">
              No Results Found
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              You haven&apos;t completed the Myers-Briggs style assessment yet.
            </p>
            <button
              onClick={() => navigate('/test/mbti')}
              className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
            >
              Take the Test
            </button>
          </div>
        </main>
      </div>
    );
  }

  const typeInfo = typeDescriptions[results.type] || {
    name: 'Your Type',
    description: 'A unique combination of cognitive preferences.',
  };

  return (
    <div
      className={showHeader ? "min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300" : ""}
      data-testid="mbti-results"
    >
      {showHeader && <Header />}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
            {results.type}
          </h2>
          <p className="text-[var(--color-champagne)] text-xl mb-4">{typeInfo.name}</p>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Type Description */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <p className="text-[var(--color-text-secondary)] text-center leading-relaxed">
            {typeInfo.description}
          </p>
        </div>

        {/* Dimensional Breakdown */}
        <div className="mb-8">
          <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
            Dimensional Breakdown
          </h3>
          <p className="text-center text-[var(--color-text-muted)] text-xs mb-8 max-w-lg mx-auto">
            Your type is determined by your preferences across four dimensions. The percentages
            below show how strongly you lean toward each preference.
          </p>
          <div className="space-y-4">
            {results.dimensions.map((score) => (
              <DimensionCard
                key={score.dimension}
                score={score}
                isExpanded={expandedDimension === score.dimension}
                onToggle={() =>
                  setExpandedDimension(
                    expandedDimension === score.dimension ? null : score.dimension
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Reliability Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-8">
          <h4 className="text-amber-400 font-medium mb-2">About Test Reliability</h4>
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
            Research shows that <strong>39-76% of people</strong> receive different MBTI results
            when retested after 5 weeks. Factors like mood, stress, and life circumstances can
            influence your responses. Consider your results as a snapshot of your current
            thinking style preferences, not a permanent identity.
          </p>
          <p className="text-[var(--color-text-muted)] text-sm mt-3 leading-relaxed">
            Pay special attention to dimensions where your preference is{' '}
            <strong>&ldquo;slight&rdquo;</strong> or <strong>&ldquo;moderate&rdquo;</strong> - these
            are more likely to change between assessments.
          </p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/test/mbti')}
              className="btn-ghost px-8 py-3 rounded text-sm tracking-widest uppercase"
            >
              Retake Test
            </button>
            <Link
              to="/"
              className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase text-center"
            >
              Explore More Tests
            </Link>
          </div>
        )}

        {/* Attribution */}
        <div className="mt-12 text-center">
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed max-w-2xl mx-auto">
            Based on the Open Extended Jungian Type Scales (OEJTS) by Eric Jorgenson at Open
            Psychometrics. Licensed under Creative Commons.{' '}
            <a
              href="https://openpsychometrics.org/tests/OEJTS/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-champagne)] hover:underline"
            >
              Learn more
            </a>
          </p>
        </div>
      </main>
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

interface DimensionCardProps {
  score: DimensionScore;
  isExpanded: boolean;
  onToggle: () => void;
}

function DimensionCard({ score, isExpanded, onToggle }: DimensionCardProps) {
  const info = dimensionInfo[score.dimension];
  const leftPoleName = getPoleName(score.dimension, info.leftPole.code);
  const rightPoleName = getPoleName(score.dimension, info.rightPole.code);
  const preferredPoleName = getPoleName(score.dimension, score.preference);
  const preferenceDescription = getPoleDescription(score.dimension, score.preference);
  const confidenceDesc = getConfidenceDescription(score.confidence);

  // Calculate which side is preferred
  const isRightPreferred = score.percentage >= 50;
  const preferenceStrength = isRightPreferred ? score.percentage : 100 - score.percentage;

  return (
    <div className="card-premium rounded-lg overflow-hidden">
      {/* Main card content */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-[var(--color-bg-secondary)]/50 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Dimension name and preference */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
              <h4 className="font-display text-lg font-medium text-[var(--color-text-primary)]">
                {info.name}
              </h4>
            </div>

            {/* Preference label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--color-champagne)] font-semibold">
                {score.preference}
              </span>
              <span className="text-[var(--color-text-secondary)] text-sm">
                {preferredPoleName}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  score.confidence === 'slight'
                    ? 'bg-amber-500/20 text-amber-400'
                    : score.confidence === 'moderate'
                      ? 'bg-blue-500/20 text-blue-400'
                      : score.confidence === 'clear'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {score.confidence}
              </span>
            </div>

            {/* Spectrum bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span
                  className={!isRightPreferred ? 'text-[var(--color-text-primary)] font-medium' : ''}
                >
                  {leftPoleName}
                </span>
                <span
                  className={isRightPreferred ? 'text-[var(--color-text-primary)] font-medium' : ''}
                >
                  {rightPoleName}
                </span>
              </div>
              <div className="relative h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
                {/* Left side fill (for left preference) */}
                {!isRightPreferred && (
                  <div
                    className="absolute right-1/2 h-full rounded-l-full transition-all duration-500"
                    style={{
                      width: `${50 - score.percentage}%`,
                      backgroundColor: info.color,
                    }}
                  />
                )}
                {/* Right side fill (for right preference) */}
                {isRightPreferred && (
                  <div
                    className="absolute left-1/2 h-full rounded-r-full transition-all duration-500"
                    style={{
                      width: `${score.percentage - 50}%`,
                      backgroundColor: info.color,
                    }}
                  />
                )}
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-text-muted)]/30 transform -translate-x-1/2" />
              </div>
            </div>

            {/* Percentage indicator */}
            <div className="text-center">
              <span className="text-[var(--color-text-primary)] text-sm font-medium">
                {preferenceStrength}% {preferredPoleName}
              </span>
            </div>
          </div>

          {/* Expand/collapse icon */}
          <div className="text-[var(--color-text-muted)]">
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
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
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6">
          <div className="space-y-4">
            <div>
              <h5 className="text-[var(--color-text-primary)] font-medium mb-2">
                Your Preference: {preferredPoleName}
              </h5>
              <p className="text-[var(--color-text-secondary)] text-sm">{preferenceDescription}</p>
            </div>

            <div>
              <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
                Confidence Level
              </h5>
              <p className="text-[var(--color-text-muted)] text-sm">{confidenceDesc}</p>
            </div>

            <div className="pt-2 border-t border-[var(--color-border)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">
                    {leftPoleName}
                  </h6>
                  <p className="text-[var(--color-text-muted)] text-xs">
                    {info.leftPole.description}
                  </p>
                </div>
                <div>
                  <h6 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">
                    {rightPoleName}
                  </h6>
                  <p className="text-[var(--color-text-muted)] text-xs">
                    {info.rightPole.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import {
  type SDO7Results as Results,
  type DimensionScore,
  deserializeResults,
  getInterpretationLevel,
  getInterpretationLabel,
  getInterpretationDescription,
} from '../data/sdo7-scoring';
import { dimensionInfo, type Dimension } from '../data/sdo7-items';

const RESULTS_STORAGE_KEY = 'mesearch-sdo7-results';

interface SDO7ResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function SDO7Results({
  initialResults,
  showHeader = true,
  showActions = true,
}: SDO7ResultsProps) {
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
    const content = (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="card-premium rounded-lg p-10">
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-4">
            No Results Found
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            You haven&apos;t completed the Social Dominance Orientation assessment yet.
          </p>
          <button
            onClick={() => navigate('/test/sdo7')}
            className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
          >
            Take the Test
          </button>
        </div>
      </main>
    );

    return showHeader ? <Layout>{content}</Layout> : content;
  }

  const dimensionScores = results.dimensions;
  const totalLevel = getInterpretationLevel(results.sdoTotal);
  const totalLabel = getInterpretationLabel(totalLevel);

  const mainContent = (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12">
        <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
          Your Results
        </p>
        <h2 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
          Social Dominance Orientation Profile
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          Completed {new Date(results.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Critical Framing Disclaimer */}
      <div className="card-premium rounded-lg p-6 mb-8 bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-blue-300 font-medium mb-2">
              Understanding Your Results
            </h3>
            <div className="text-blue-200/70 text-sm space-y-2">
              <p>
                <strong>This measures attitudes about group-based hierarchy, not character or moral worth.</strong>{' '}
                Social Dominance Orientation is a well-researched construct that helps explain
                political attitudes, policy preferences, and intergroup relations.
              </p>
              <p>
                People across the political spectrum hold varying SDO levels, and these attitudes
                can change based on context, life experiences, and social conditions.
              </p>
              <p>
                Your score is one data point for self-reflection, not a permanent label or judgment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total SDO Score */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
          Overall Social Dominance Orientation
        </h3>

        {/* Score Display */}
        <div className="text-center mb-6">
          <div className="text-5xl font-display font-medium text-[var(--color-text-primary)] mb-2">
            {results.sdoTotal.toFixed(2)}
          </div>
          <div className="text-[var(--color-champagne)] text-sm uppercase tracking-wider">
            {totalLabel}
          </div>
        </div>

        {/* Visual Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative h-4 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
              style={{ width: `${((results.sdoTotal - 1) / 6) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[var(--color-text-muted)] text-xs">1 (Low)</span>
            <span className="text-[var(--color-text-muted)] text-xs">7 (High)</span>
          </div>
        </div>

        {/* Interpretation */}
        <p className="text-center text-[var(--color-text-secondary)] text-sm max-w-lg mx-auto">
          {getInterpretationDescription('total', totalLevel)}
        </p>
      </div>

      {/* Subscale Bar Chart */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
          Subscale Breakdown
        </h3>

        <div className="space-y-6" data-testid="sdo7-results">
          {dimensionScores.map((score) => {
            const info = dimensionInfo[score.dimension];
            const level = getInterpretationLevel(score.meanScore);
            const label = getInterpretationLabel(level);

            return (
              <div key={score.dimension} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {info.name}
                    </span>
                  </div>
                  <span className="text-[var(--color-text-secondary)] text-sm">
                    {score.meanScore.toFixed(2)} / 7 ({label})
                  </span>
                </div>

                <div className="relative h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((score.meanScore - 1) / 6) * 100}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="space-y-4">
        {dimensionScores.map((score) => (
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

      {/* Actions */}
      {showActions && (
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/test/sdo7')}
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

      {/* Citation */}
      <div className="mt-12 text-center">
        <p className="text-[var(--color-text-muted)] text-xs leading-relaxed max-w-2xl mx-auto mb-4">
          This assessment measures attitudes about group-based hierarchy based on self-reported
          responses. Results should be used for self-reflection and understanding your current
          social attitudes, not as character judgments or permanent labels.
        </p>
        <p className="text-[var(--color-text-muted)] text-xs italic">
          Citation: Ho, A.K., Sidanius, J., Kteily, N., Sheehy-Skeffington, J., Pratto, F.,
          Henkel, K.E., Foels, R., & Stewart, A.L. (2015). The nature of social dominance
          orientation: Theorizing and measuring preferences for intergroup inequality using
          the new SDO7 scale. <em>Journal of Personality and Social Psychology</em>, 109(6), 1003-1028.
        </p>
      </div>
    </main>
  );

  return showHeader ? <Layout>{mainContent}</Layout> : mainContent;
}

interface DimensionCardProps {
  score: DimensionScore;
  isExpanded: boolean;
  onToggle: () => void;
}

function DimensionCard({ score, isExpanded, onToggle }: DimensionCardProps) {
  const info = dimensionInfo[score.dimension];
  const level = getInterpretationLevel(score.meanScore);
  const label = getInterpretationLabel(level);
  const description = getInterpretationDescription(score.dimension, level);

  // Level indicator styling
  const levelStyles = {
    'very-low': 'bg-green-500/20 text-green-400 border-green-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    moderate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'moderately-high': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="card-premium rounded-lg overflow-hidden">
      {/* Main card content */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-[var(--color-bg-secondary)]/50 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
              <h4 className="font-display text-lg font-medium text-[var(--color-text-primary)]">
                {info.name}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border ${levelStyles[level]}`}
              >
                {label}
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-4">{description}</p>

            {/* Spectrum bar */}
            <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="absolute h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((score.meanScore - 1) / 6) * 100}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>

            {/* Score indicator */}
            <div className="flex justify-between mt-2">
              <span className="text-[var(--color-text-muted)] text-xs">1</span>
              <span className="text-[var(--color-text-primary)] text-sm font-medium">
                Mean: {score.meanScore.toFixed(2)} / 7
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">7</span>
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

      {/* Expanded description */}
      {isExpanded && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6">
          <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-3">
            About This Dimension
          </h5>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
            {info.description}
          </p>

          <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-3">
            What Your Score Means
          </h5>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
            {level === 'very-low' && (
              <>
                Your score is <strong>very low</strong> on this dimension. You strongly reject
                {score.dimension === 'SDO-D'
                  ? ' the idea that some groups should dominate others.'
                  : ' opposition to group equality and support efforts to equalize conditions.'}
              </>
            )}
            {level === 'low' && (
              <>
                Your score is <strong>low</strong> on this dimension. You generally reject
                {score.dimension === 'SDO-D'
                  ? ' group-based dominance hierarchies.'
                  : ' opposition to equality and tend to support equalizing policies.'}
              </>
            )}
            {level === 'moderate' && (
              <>
                Your score is <strong>moderate</strong> on this dimension. You have mixed views on
                {score.dimension === 'SDO-D'
                  ? ' group-based hierarchy, sometimes accepting it in certain contexts.'
                  : ' group equality, balancing support for equality with other considerations.'}
              </>
            )}
            {level === 'moderately-high' && (
              <>
                Your score is <strong>moderately high</strong> on this dimension. You tend to
                {score.dimension === 'SDO-D'
                  ? ' accept some degree of group-based hierarchy in society.'
                  : ' be skeptical of efforts to equalize conditions between groups.'}
              </>
            )}
            {level === 'high' && (
              <>
                Your score is <strong>high</strong> on this dimension. You tend to
                {score.dimension === 'SDO-D'
                  ? ' support group-based dominance hierarchies.'
                  : ' oppose efforts toward group-based equality.'}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

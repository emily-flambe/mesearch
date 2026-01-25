import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import {
  type RWAResults as Results,
  type DimensionScore,
  deserializeResults,
  getDimensionDescription,
} from '../data/rwa-scoring';
import { dimensionInfo, type Dimension } from '../data/rwa-items';

const RESULTS_STORAGE_KEY = 'mesearch-rwa-results';

interface RWAResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function RWAResults({ initialResults, showHeader = true, showActions = true }: RWAResultsProps) {
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
            You haven&apos;t completed the Right-Wing Authoritarianism assessment yet.
          </p>
          <button
            onClick={() => navigate('/test/rwa')}
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

  // Get interpretation color
  const getInterpretationColor = (interpretation: string) => {
    switch (interpretation) {
      case 'Low':
        return 'text-green-400';
      case 'Below Average':
        return 'text-blue-400';
      case 'Above Average':
        return 'text-amber-400';
      case 'High':
        return 'text-red-400';
      default:
        return 'text-[var(--color-text-primary)]';
    }
  };

  const mainContent = (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12">
        <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
          Your Results
        </p>
        <h2 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
          Right-Wing Authoritarianism Profile
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
                <strong>This measures attitudes about authority and tradition, not character.</strong> Right-wing
                authoritarianism is a psychological concept describing certain attitude patterns, not a
                judgment of moral worth or political affiliation.
              </p>
              <p>
                These attitudes are shaped by culture, upbringing, and life experiences. They exist on
                a spectrum, and most people hold some of these views to varying degrees.
              </p>
              <p>
                Your results reflect self-reported attitudes and should be used for self-reflection,
                not as labels or diagnoses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Score Card */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
          Overall RWA Score
        </h3>
        <div className="text-center">
          <div className="text-5xl font-display font-medium text-[var(--color-text-primary)] mb-2">
            {results.rwaTotal}
          </div>
          <p className="text-[var(--color-text-muted)] text-sm mb-4">out of 54</p>
          <span className={`text-lg font-medium ${getInterpretationColor(results.interpretation)}`}>
            {results.interpretation}
          </span>
        </div>

        {/* Score bar visualization */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="relative h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500"
              style={{ width: `${((results.rwaTotal - 6) / 48) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[var(--color-text-muted)] text-xs">
            <span>Low (6)</span>
            <span>Average (30)</span>
            <span>High (54)</span>
          </div>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <h3 className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-4">
        Dimension Breakdown
      </h3>
      <div className="space-y-4" data-testid="rwa-results">
        {dimensionScores.map((score) => (
          <DimensionCard
            key={score.dimension}
            score={score}
            isExpanded={expandedDimension === score.dimension}
            onToggle={() =>
              setExpandedDimension(expandedDimension === score.dimension ? null : score.dimension)
            }
          />
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/test/rwa')}
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
          This assessment is based on self-reported responses and measures attitudes, not character
          traits or political affiliations. Results should be used for self-reflection and personal
          insight, not as judgments of moral worth.
        </p>
        <p className="text-[var(--color-text-muted)] text-xs italic">
          Citation: Bizumic, B., & Duckitt, J. (2018). Investigating right wing authoritarianism with
          a very short authoritarianism scale. <em>Journal of Social and Political Psychology</em>.
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
  const description = getDimensionDescription(score.dimension, score.meanScore);

  // Determine level based on mean score (1-9 scale)
  const getLevel = (meanScore: number): 'low' | 'average' | 'high' => {
    if (meanScore < 4) return 'low';
    if (meanScore <= 6) return 'average';
    return 'high';
  };

  const level = getLevel(score.meanScore);

  // Level indicator styling
  const levelStyles = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    average: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
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
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-4">{description}</p>

            {/* Spectrum bar */}
            <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="absolute h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((score.meanScore - 1) / 8) * 100}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>

            {/* Score indicator */}
            <div className="flex justify-between mt-2">
              <span className="text-[var(--color-text-muted)] text-xs">1</span>
              <span className="text-[var(--color-text-primary)] text-sm font-medium">
                Mean: {score.meanScore.toFixed(2)} / 9
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">9</span>
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
            {level === 'low' && (
              <>
                Your score is <strong>below average</strong> on this dimension. This suggests you
                tend toward the attitudes described in the &quot;low&quot; description above. Remember that
                this reflects attitudes, not moral character.
              </>
            )}
            {level === 'average' && (
              <>
                Your score falls within the <strong>average range</strong> on this dimension. Like
                most people, your attitudes on this dimension are moderate and may vary by context.
              </>
            )}
            {level === 'high' && (
              <>
                Your score is <strong>above average</strong> on this dimension. This suggests you
                tend toward the attitudes described in the &quot;high&quot; description above. Remember that
                this reflects attitudes, not moral character.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

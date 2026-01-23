import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  type SD3Results as Results,
  type TraitScore,
  deserializeResults,
  getPercentileInterpretation,
  getTraitDescription,
} from '../data/sd3-scoring';
import { traitInfo, type DarkTrait } from '../data/sd3-items';

const RESULTS_STORAGE_KEY = 'mesearch-sd3-results';

interface SD3ResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function SD3Results({ initialResults, showHeader = true, showActions = true }: SD3ResultsProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(initialResults || null);
  const [expandedTrait, setExpandedTrait] = useState<DarkTrait | null>(null);

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
              You haven&apos;t completed the Short Dark Triad assessment yet.
            </p>
            <button
              onClick={() => navigate('/test/sd3')}
              className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
            >
              Take the Test
            </button>
          </div>
        </main>
      </div>
    );
  }

  const traitScores = results.traits;

  return (
    <div className={showHeader ? "min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300" : ""}>
      {showHeader && <Header />}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h2 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
            Short Dark Triad Profile
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Critical Framing Disclaimer */}
        <div className="card-premium rounded-lg p-6 mb-8 bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-400"
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
              <h3 className="text-amber-300 font-medium mb-2">
                Understanding Your Results
              </h3>
              <div className="text-amber-200/70 text-sm space-y-2">
                <p>
                  <strong>These are subclinical personality traits, not disorders.</strong> The
                  &quot;Dark Triad&quot; measures normal personality variation that exists in everyone
                  to varying degrees.
                </p>
                <p>
                  Higher scores do not indicate a problem or diagnosis. At moderate levels, these
                  traits can be adaptive (e.g., strategic thinking, confidence, boldness).
                </p>
                <p>
                  This assessment cannot diagnose Narcissistic Personality Disorder, Antisocial
                  Personality Disorder, or any other clinical condition.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Triangle Chart */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
            Trait Overview
          </h3>
          <div className="flex justify-center">
            <TriangleChart scores={traitScores} />
          </div>
        </div>

        {/* Trait Breakdown */}
        <div className="space-y-4" data-testid="sd3-results">
          {traitScores.map((score) => (
            <TraitCard
              key={score.trait}
              score={score}
              isExpanded={expandedTrait === score.trait}
              onToggle={() =>
                setExpandedTrait(expandedTrait === score.trait ? null : score.trait)
              }
            />
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/test/sd3')}
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
            This assessment is based on self-reported responses and measures subclinical
            personality traits. Results should be used for self-reflection and personal insight,
            not as clinical diagnoses or labels.
          </p>
          <p className="text-[var(--color-text-muted)] text-xs italic">
            Citation: Jones, D.N., & Paulhus, D.L. (2014). Introducing the Short Dark Triad (SD3):
            A Brief Measure of Dark Personality Traits. <em>Assessment</em>, 21(1), 28-41.
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

interface TriangleChartProps {
  scores: TraitScore[];
}

function TriangleChart({ scores }: TriangleChartProps) {
  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 50;
  const levels = 5;

  // Order traits for the triangle: M, N, P (clockwise from top)
  const orderedTraits: DarkTrait[] = ['machiavellianism', 'narcissism', 'psychopathy'];
  const orderedScores = useMemo(() => {
    return orderedTraits.map((t) => scores.find((s) => s.trait === t)!);
  }, [scores]);

  // Calculate points for the triangle
  const angleStep = (2 * Math.PI) / orderedTraits.length;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const radius = (value / 5) * maxRadius; // Assuming max score is 5
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Generate polygon points for the score shape
  const polygonPoints = orderedScores
    .map((score, i) => {
      const point = getPoint(i, score.meanScore);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Background triangles (levels) */}
      {Array.from({ length: levels }).map((_, levelIndex) => {
        const levelRadius = ((levelIndex + 1) / levels) * maxRadius;
        const points = orderedTraits
          .map((_, i) => {
            const angle = startAngle + i * angleStep;
            const x = center + levelRadius * Math.cos(angle);
            const y = center + levelRadius * Math.sin(angle);
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <polygon
            key={levelIndex}
            points={points}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      {/* Axis lines */}
      {orderedTraits.map((_, i) => {
        const angle = startAngle + i * angleStep;
        const x2 = center + maxRadius * Math.cos(angle);
        const y2 = center + maxRadius * Math.sin(angle);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x2}
            y2={y2}
            stroke="var(--color-border)"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      {/* Score polygon */}
      <polygon
        points={polygonPoints}
        fill="var(--color-champagne)"
        fillOpacity={0.2}
        stroke="var(--color-champagne)"
        strokeWidth={2}
      />

      {/* Score points */}
      {orderedScores.map((score, i) => {
        const point = getPoint(i, score.meanScore);
        const info = traitInfo[score.trait];
        return (
          <circle key={score.trait} cx={point.x} cy={point.y} r={6} fill={info.color} />
        );
      })}

      {/* Labels */}
      {orderedTraits.map((trait, i) => {
        const angle = startAngle + i * angleStep;
        const labelRadius = maxRadius + 30;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const info = traitInfo[trait];
        // Shorten name for display
        const shortName =
          trait === 'machiavellianism' ? 'Mach' : trait === 'narcissism' ? 'Narc' : 'Psych';
        return (
          <text
            key={trait}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium"
            fill={info.color}
          >
            {shortName}
          </text>
        );
      })}
    </svg>
  );
}

interface TraitCardProps {
  score: TraitScore;
  isExpanded: boolean;
  onToggle: () => void;
}

function TraitCard({ score, isExpanded, onToggle }: TraitCardProps) {
  const info = traitInfo[score.trait];
  const interpretation = getPercentileInterpretation(score.percentile);
  const description = getTraitDescription(score.trait, score.percentile);

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
                className={`px-2 py-0.5 rounded text-xs font-medium border ${levelStyles[score.level]}`}
              >
                {score.level.charAt(0).toUpperCase() + score.level.slice(1)}
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-4">{description}</p>

            {/* Spectrum bar */}
            <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="absolute h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(score.meanScore / 5) * 100}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>

            {/* Score indicator */}
            <div className="flex justify-between mt-2">
              <span className="text-[var(--color-text-muted)] text-xs">1</span>
              <span className="text-[var(--color-text-primary)] text-sm font-medium">
                Mean: {score.meanScore.toFixed(2)} / 5 ({interpretation}, {score.percentile}th
                percentile)
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">5</span>
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
            About This Trait
          </h5>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
            {info.description}
          </p>

          <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-3">
            What Your Score Means
          </h5>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
            {score.level === 'low' && (
              <>
                Your score is <strong>below average</strong> compared to the general population.
                This suggests you may be less inclined toward the strategic, self-focused, or
                bold behaviors associated with this trait.
              </>
            )}
            {score.level === 'average' && (
              <>
                Your score falls within the <strong>average range</strong> for the general
                population. Like most people, you likely exhibit these tendencies in moderation
                and context-dependently.
              </>
            )}
            {score.level === 'high' && (
              <>
                Your score is <strong>above average</strong> compared to the general population.
                This may reflect greater comfort with strategic thinking, self-promotion, or
                risk-taking. Remember: these are normal personality variations, not disorders.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

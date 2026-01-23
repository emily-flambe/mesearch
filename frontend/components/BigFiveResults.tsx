import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  type BigFiveResults as Results,
  type DimensionScore,
  deserializeResults,
  getPercentileInterpretation,
  getDimensionDescription,
} from '../data/big-five-scoring';
import { dimensionInfo, facetInfo, type Dimension } from '../data/big-five-items';

const RESULTS_STORAGE_KEY = 'mesearch-bigfive-results';

interface BigFiveResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function BigFiveResults({ initialResults, showHeader = true, showActions = true }: BigFiveResultsProps) {
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
              You haven&apos;t completed the Big Five assessment yet.
            </p>
            <button
              onClick={() => navigate('/test/big-five')}
              className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
            >
              Take the Test
            </button>
          </div>
        </main>
      </div>
    );
  }

  const dimensionScores = results.dimensions;

  // If embedded mode (no header), return just the results content
  if (!showHeader) {
    return (
      <div className="space-y-8">
        {/* Radar Chart */}
        <div className="card-premium rounded-lg p-8">
          <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
            Personality Overview
          </h3>
          <div className="flex justify-center">
            <RadarChart scores={dimensionScores} />
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
      </div>
    );
  }

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
            Big Five Personality Profile
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Radar Chart */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
            Personality Overview
          </h3>
          <div className="flex justify-center">
            <RadarChart scores={dimensionScores} />
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
              onClick={() => navigate('/test/big-five')}
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

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed max-w-2xl mx-auto">
            This assessment provides a snapshot of your personality based on self-reported responses.
            Results should be used for self-reflection and personal growth, not as clinical diagnoses.
            Personality can be influenced by context and may change over time.
          </p>
        </div>
      </main>
    </div>
  );
}

// Export the Results type for use in ResultDetail
export type { Results as BigFiveResultsType };

function Header() {
  return (
    <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-wide text-gold-gradient"
        >
          Mēsearch
        </Link>
      </div>
    </header>
  );
}

interface RadarChartProps {
  scores: DimensionScore[];
}

function RadarChart({ scores }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const levels = 5;

  // Order dimensions for the radar chart: O, C, E, A, N (clockwise from top)
  const orderedDimensions: Dimension[] = ['O', 'C', 'E', 'A', 'N'];
  const orderedScores = useMemo(() => {
    return orderedDimensions.map((d) => scores.find((s) => s.dimension === d)!);
  }, [scores]);

  // Calculate points for the radar
  const angleStep = (2 * Math.PI) / orderedDimensions.length;
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
      {/* Background circles */}
      {Array.from({ length: levels }).map((_, i) => {
        const radius = ((i + 1) / levels) * maxRadius;
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      {/* Axis lines */}
      {orderedDimensions.map((_, i) => {
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
        return (
          <circle
            key={score.dimension}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="var(--color-champagne)"
          />
        );
      })}

      {/* Labels */}
      {orderedDimensions.map((dim, i) => {
        const angle = startAngle + i * angleStep;
        const labelRadius = maxRadius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const info = dimensionInfo[dim];
        return (
          <text
            key={dim}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--color-text-secondary)] text-xs font-medium"
          >
            {info.name.split(' ')[0]}
          </text>
        );
      })}
    </svg>
  );
}

interface DimensionCardProps {
  score: DimensionScore;
  isExpanded: boolean;
  onToggle: () => void;
}

function DimensionCard({ score, isExpanded, onToggle }: DimensionCardProps) {
  const info = dimensionInfo[score.dimension];
  const interpretation = getPercentileInterpretation(score.percentile);
  const description = getDimensionDescription(score.dimension, score.percentile);

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
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <h4 className="font-display text-lg font-medium text-[var(--color-text-primary)]">
                {info.name}
              </h4>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-4">
              {description}
            </p>

            {/* Spectrum bar */}
            <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="absolute h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score.percentile}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>

            {/* Percentile indicator */}
            <div className="flex justify-between mt-2">
              <span className="text-[var(--color-text-muted)] text-xs">Low</span>
              <span className="text-[var(--color-text-primary)] text-sm font-medium">
                {interpretation} ({score.percentile}th percentile)
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">High</span>
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

      {/* Expanded facet breakdown */}
      {isExpanded && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6">
          <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-4">
            Facet Breakdown
          </h5>
          <div className="space-y-4">
            {score.facets.map((facetScore) => {
              const fInfo = facetInfo[facetScore.facet];
              const fInterpretation = getPercentileInterpretation(facetScore.percentile);
              return (
                <div key={facetScore.facet}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[var(--color-text-secondary)] text-sm">
                      {fInfo.name}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-xs">
                      {fInterpretation}
                    </span>
                  </div>
                  <div className="relative h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="absolute h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${facetScore.percentile}%`,
                        backgroundColor: info.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <p className="text-[var(--color-text-muted)] text-xs mt-1">
                    {fInfo.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import {
  type MFQResults as Results,
  type FoundationScore,
  deserializeResults,
  getPercentileInterpretation,
  getFoundationDescription,
} from '../data/mfq-scoring';
import { foundationInfo, scoredFoundations, type Foundation, citation } from '../data/mfq-items';

const RESULTS_STORAGE_KEY = 'mesearch-mfq-results';

interface MFQResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function MFQResults({ initialResults, showHeader = true, showActions = true }: MFQResultsProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(initialResults || null);
  const [expandedFoundation, setExpandedFoundation] = useState<Foundation | null>(null);

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
            You haven&apos;t completed the Moral Foundations Questionnaire yet.
          </p>
          <button
            onClick={() => navigate('/test/mfq')}
            className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
          >
            Take the Test
          </button>
        </div>
      </main>
    );

    return showHeader ? <Layout>{content}</Layout> : content;
  }

  const foundationScores = results.foundations;

  const mainContent = (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h2 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
            Moral Foundations Profile
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Profile Summary */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-4">
            Profile Summary
          </h3>
          <p className="text-[var(--color-text-secondary)] text-center leading-relaxed">
            {results.profile}
          </p>
        </div>

        {/* Radar Chart */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
            Moral Foundations Overview
          </h3>
          <div className="flex justify-center">
            <RadarChart scores={foundationScores} />
          </div>
        </div>

        {/* Foundation Breakdown */}
        <div className="space-y-4">
          {foundationScores.map((score) => (
            <FoundationCard
              key={score.foundation}
              score={score}
              isExpanded={expandedFoundation === score.foundation}
              onToggle={() =>
                setExpandedFoundation(
                  expandedFoundation === score.foundation ? null : score.foundation
                )
              }
            />
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/test/mfq')}
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

      {/* Citation and Disclaimer */}
      <div className="mt-12 text-center space-y-4">
        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6">
          <h4 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-2">
            Citation
          </h4>
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
            {citation}
          </p>
        </div>
        <p className="text-[var(--color-text-muted)] text-xs leading-relaxed max-w-2xl mx-auto">
          This assessment provides a snapshot of your moral intuitions based on self-reported responses.
          Results should be used for self-reflection and personal understanding, not as clinical diagnoses.
          Moral foundations can be influenced by context and may change over time.
        </p>
      </div>
    </main>
  );

  return showHeader ? <Layout>{mainContent}</Layout> : mainContent;
}

interface RadarChartProps {
  scores: FoundationScore[];
}

function RadarChart({ scores }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const levels = 5;

  // Order foundations for the radar chart (clockwise from top)
  const orderedFoundations: Foundation[] = ['care', 'fairness', 'loyalty', 'authority', 'purity'];
  const orderedScores = useMemo(() => {
    return orderedFoundations.map((f) => scores.find((s) => s.foundation === f)!);
  }, [scores]);

  // Calculate points for the radar
  const angleStep = (2 * Math.PI) / orderedFoundations.length;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const radius = (value / 5) * maxRadius; // Max score is 5
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
      {orderedFoundations.map((_, i) => {
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
        const info = foundationInfo[score.foundation];
        return (
          <circle
            key={score.foundation}
            cx={point.x}
            cy={point.y}
            r={6}
            fill={info.color}
          />
        );
      })}

      {/* Labels */}
      {orderedFoundations.map((foundation, i) => {
        const angle = startAngle + i * angleStep;
        const labelRadius = maxRadius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const info = foundationInfo[foundation];
        return (
          <text
            key={foundation}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--color-text-secondary)] text-xs font-medium"
          >
            {info.name.split('/')[0]}
          </text>
        );
      })}
    </svg>
  );
}

interface FoundationCardProps {
  score: FoundationScore;
  isExpanded: boolean;
  onToggle: () => void;
}

function FoundationCard({ score, isExpanded, onToggle }: FoundationCardProps) {
  const info = foundationInfo[score.foundation];
  const interpretation = getPercentileInterpretation(score.percentile);
  const description = getFoundationDescription(score.foundation, score.percentile);

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

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6">
          <div className="space-y-4">
            <div>
              <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
                Description
              </h5>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                {info.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
                  Concerns
                </h5>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {info.concernsWith}
                </p>
              </div>
              <div>
                <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
                  Opposite
                </h5>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {info.oppositeOf}
                </p>
              </div>
            </div>
            <div>
              <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
                Your Score
              </h5>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Mean score: {score.meanScore.toFixed(2)} / 5.00
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import {
  type MFQ2Results as Results,
  type FoundationScore,
  type HigherOrderScore,
  deserializeResults,
  getScoreInterpretation,
  getFoundationDescription,
} from '../data/mfq2-scoring';
import { foundationInfo, foundations, type Foundation, citation } from '../data/mfq2-items';

const RESULTS_STORAGE_KEY = 'mesearch-mfq2-results';

interface MFQ2ResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function MFQ2Results({ initialResults, showHeader = true, showActions = true }: MFQ2ResultsProps) {
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
            You haven&apos;t completed the Moral Foundations Questionnaire 2 yet.
          </p>
          <button
            onClick={() => navigate('/test/mfq2')}
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
  const higherOrderScores = results.higherOrder;

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

      {/* Higher-Order Summary */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
          Individualizing vs. Binding
        </h3>
        <HigherOrderComparison scores={higherOrderScores} />
        <p className="text-[var(--color-text-muted)] text-xs text-center mt-6 max-w-2xl mx-auto">
          <strong>Individualizing</strong> foundations (Care, Equality) focus on protecting individuals and ensuring equal treatment.
          <br />
          <strong>Binding</strong> foundations (Proportionality, Loyalty, Authority, Purity) focus on group cohesion, merit, and tradition.
        </p>
      </div>

      {/* Radar Chart */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
          Six Moral Foundations
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
            onClick={() => navigate('/test/mfq2')}
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

      {/* Ethical Framing and Citation */}
      <div className="mt-12 text-center space-y-4">
        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6">
          <h4 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3">
            Understanding Your Results
          </h4>
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4">
            Moral foundations represent different perspectives on what matters ethically, not right or wrong answers.
            People across cultures and political orientations emphasize different foundations. Understanding these
            differences can help us appreciate diverse moral viewpoints and engage in more productive conversations
            about ethics and values.
          </p>
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
            Research shows that political liberals tend to emphasize Care and Equality (individualizing foundations),
            while political conservatives give more equal weight to all six foundations, including Loyalty, Authority,
            Purity, and Proportionality (binding foundations).
          </p>
        </div>
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
        </p>
      </div>
    </main>
  );

  return showHeader ? <Layout>{mainContent}</Layout> : mainContent;
}

interface HigherOrderComparisonProps {
  scores: HigherOrderScore[];
}

function HigherOrderComparison({ scores }: HigherOrderComparisonProps) {
  const individualizing = scores.find((s) => s.name === 'Individualizing');
  const binding = scores.find((s) => s.name === 'Binding');

  if (!individualizing || !binding) return null;

  const maxScore = 4;
  const individualizingPercent = (individualizing.meanScore / maxScore) * 100;
  const bindingPercent = (binding.meanScore / maxScore) * 100;

  return (
    <div className="space-y-6">
      {/* Individualizing */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[var(--color-text-primary)] font-medium">Individualizing</span>
          <span className="text-[var(--color-text-muted)] text-sm">
            {individualizing.meanScore.toFixed(2)} / 4.00
          </span>
        </div>
        <div className="relative h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="absolute h-full rounded-full transition-all duration-500"
            style={{
              width: `${individualizingPercent}%`,
              background: 'linear-gradient(to right, #ec4899, #3b82f6)',
            }}
          />
        </div>
        <p className="text-[var(--color-text-muted)] text-xs mt-1">
          Care + Equality (focus on individual welfare and equal treatment)
        </p>
      </div>

      {/* Binding */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[var(--color-text-primary)] font-medium">Binding</span>
          <span className="text-[var(--color-text-muted)] text-sm">
            {binding.meanScore.toFixed(2)} / 4.00
          </span>
        </div>
        <div className="relative h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="absolute h-full rounded-full transition-all duration-500"
            style={{
              width: `${bindingPercent}%`,
              background: 'linear-gradient(to right, #14b8a6, #22c55e, #f97316, #a855f7)',
            }}
          />
        </div>
        <p className="text-[var(--color-text-muted)] text-xs mt-1">
          Proportionality + Loyalty + Authority + Purity (focus on group cohesion and tradition)
        </p>
      </div>
    </div>
  );
}

interface RadarChartProps {
  scores: FoundationScore[];
}

function RadarChart({ scores }: RadarChartProps) {
  const size = 320;
  const center = size / 2;
  const maxRadius = size / 2 - 50;
  const levels = 4; // 0-4 scale

  // Order foundations for the radar chart (clockwise from top)
  const orderedFoundations: Foundation[] = ['Care', 'Equality', 'Proportionality', 'Loyalty', 'Authority', 'Purity'];
  const orderedScores = useMemo(() => {
    return orderedFoundations.map((f) => scores.find((s) => s.foundation === f)!);
  }, [scores]);

  // Calculate points for the radar
  const angleStep = (2 * Math.PI) / orderedFoundations.length;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const radius = (value / 4) * maxRadius; // Max score is 4
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
        const labelRadius = maxRadius + 30;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const info = foundationInfo[foundation];

        // Political lean indicator
        const leanColor = info.politicalLean === 'liberal'
          ? '#3b82f6'
          : info.politicalLean === 'conservative'
            ? '#ef4444'
            : '#9ca3af';

        return (
          <g key={foundation}>
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--color-text-secondary)] text-xs font-medium"
            >
              {info.name}
            </text>
            {/* Small dot indicating political lean */}
            <circle
              cx={x}
              cy={y + 12}
              r={3}
              fill={leanColor}
              opacity={0.6}
            />
          </g>
        );
      })}

      {/* Legend for political lean */}
      <g transform={`translate(${size - 90}, ${size - 30})`}>
        <circle cx={0} cy={0} r={3} fill="#3b82f6" opacity={0.6} />
        <text x={8} y={4} className="fill-[var(--color-text-muted)] text-[10px]">Liberal-leaning</text>
        <circle cx={0} cy={14} r={3} fill="#ef4444" opacity={0.6} />
        <text x={8} y={18} className="fill-[var(--color-text-muted)] text-[10px]">Conservative-leaning</text>
      </g>
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
  const interpretation = getScoreInterpretation(score.meanScore);
  const description = getFoundationDescription(score.foundation, score.meanScore);

  // Convert 0-4 score to percentage for display
  const percentage = (score.meanScore / 4) * 100;

  // Political lean badge
  const leanBadge = info.politicalLean === 'liberal'
    ? { text: 'Liberal-leaning', color: '#3b82f6' }
    : info.politicalLean === 'conservative'
      ? { text: 'Conservative-leaning', color: '#ef4444' }
      : null;

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
              {leanBadge && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${leanBadge.color}20`, color: leanBadge.color }}
                >
                  {leanBadge.text}
                </span>
              )}
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-4">
              {description}
            </p>

            {/* Spectrum bar */}
            <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="absolute h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>

            {/* Score indicator */}
            <div className="flex justify-between mt-2">
              <span className="text-[var(--color-text-muted)] text-xs">Low</span>
              <span className="text-[var(--color-text-primary)] text-sm font-medium">
                {interpretation} ({score.meanScore.toFixed(2)} / 4.00)
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
                  Higher-Order Factor
                </h5>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {info.higherOrder}
                </p>
              </div>
              <div>
                <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
                  Political Association
                </h5>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {info.politicalLean === 'liberal'
                    ? 'More emphasized by liberals'
                    : info.politicalLean === 'conservative'
                      ? 'More emphasized by conservatives'
                      : 'No strong political association'}
                </p>
              </div>
            </div>
            <div>
              <h5 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
                Your Score
              </h5>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Mean score: {score.meanScore.toFixed(2)} / 4.00 (Raw: {score.rawScore} / 24)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

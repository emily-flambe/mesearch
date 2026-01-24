import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import {
  type ECRResults as Results,
  deserializeResults,
  getMeanScoreInterpretation,
  getDimensionDescription,
  attachmentStyleInfo,
  dimensionInfo,
  DIMENSIONAL_DISCLAIMER,
} from '../data/ecr-scoring';

const RESULTS_STORAGE_KEY = 'mesearch-ecr-results';

interface ECRResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function ECRResults({ initialResults, showHeader = true, showActions = true }: ECRResultsProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(initialResults || null);

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
            You haven&apos;t completed the Attachment Style assessment yet.
          </p>
          <button
            onClick={() => navigate('/test/ecr')}
            className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
          >
            Take the Test
          </button>
        </div>
      </main>
    );

    return showHeader ? <Layout>{content}</Layout> : content;
  }

  const { anxiety, avoidance, suggestedStyle } = results;
  const styleInfo = attachmentStyleInfo[suggestedStyle];

  const mainContent = (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h2 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
            Attachment Style Profile
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* 2D Plot - Primary Visualization */}
        <div className="card-premium rounded-lg p-8 mb-8" data-testid="ecr-results">
          <h3 className="text-center text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
            Your Position on the Attachment Dimensions
          </h3>
          <div className="flex justify-center mb-6">
            <AttachmentPlot anxietyScore={anxiety.meanScore} avoidanceScore={avoidance.meanScore} />
          </div>
          <p className="text-center text-[var(--color-text-muted)] text-xs max-w-md mx-auto">
            The plot shows your position based on your anxiety (vertical) and avoidance (horizontal) scores.
            The center represents the midpoint of each dimension.
          </p>
        </div>

        {/* Dimension Scores - Prominent Display */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <DimensionCard
            dimension="anxiety"
            score={anxiety.meanScore}
            interpretation={getMeanScoreInterpretation(anxiety.meanScore)}
            description={getDimensionDescription('anxiety', anxiety.meanScore)}
          />
          <DimensionCard
            dimension="avoidance"
            score={avoidance.meanScore}
            interpretation={getMeanScoreInterpretation(avoidance.meanScore)}
            description={getDimensionDescription('avoidance', avoidance.meanScore)}
          />
        </div>

        {/* Suggested Style - Secondary, Educational */}
        <div className="card-premium rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-[var(--color-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">
                Suggested Style (Educational Reference Only)
              </p>
              <h4 className="text-[var(--color-text-primary)] text-lg font-medium mb-2" data-testid="ecr-suggested-style">
                {styleInfo.name}
              </h4>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                {styleInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Four Quadrants Explanation */}
        <div className="card-premium rounded-lg p-6 mb-8">
          <h4 className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-4">
            Understanding the Four Quadrants
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(attachmentStyleInfo).map((info) => (
              <div
                key={info.code}
                className={`p-4 rounded-lg border ${
                  info.code === suggestedStyle
                    ? 'border-[var(--color-champagne)]/50 bg-[var(--color-champagne)]/5'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[var(--color-text-primary)] font-medium text-sm">
                    {info.name}
                  </span>
                  {info.code === suggestedStyle && (
                    <span className="text-[var(--color-champagne)] text-xs">(Your position)</span>
                  )}
                </div>
                <p className="text-[var(--color-text-muted)] text-xs">
                  {info.anxietyLevel === 'low' ? 'Low' : 'High'} Anxiety,{' '}
                  {info.avoidanceLevel === 'low' ? 'Low' : 'High'} Avoidance
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Important: Dimensional vs. Categorical</h4>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                {DIMENSIONAL_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>

        {/* Citation */}
        <div className="text-center mb-8">
          <p className="text-[var(--color-text-muted)] text-xs">
            Based on the Experiences in Close Relationships - Revised Short form (ECR-RS).
            <br />
            Wei, M., Russell, D. W., Mallinckrodt, B., & Vogel, D. L. (2007).
          </p>
        </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/test/ecr')}
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
    </main>
  );

  return showHeader ? <Layout>{mainContent}</Layout> : mainContent;
}

interface AttachmentPlotProps {
  anxietyScore: number;
  avoidanceScore: number;
}

function AttachmentPlot({ anxietyScore, avoidanceScore }: AttachmentPlotProps) {
  const size = 320;
  const padding = 50;
  const plotSize = size - 2 * padding;

  // Convert 1-7 scale to plot coordinates
  // X-axis: Avoidance (1=left, 7=right)
  // Y-axis: Anxiety (1=bottom, 7=top)
  const x = padding + ((avoidanceScore - 1) / 6) * plotSize;
  const y = padding + ((7 - anxietyScore) / 6) * plotSize; // Invert Y since SVG Y increases downward

  const midX = padding + plotSize / 2;
  const midY = padding + plotSize / 2;

  return (
    <svg width={size} height={size} className="overflow-visible" data-testid="ecr-2d-plot">
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect x={padding} y={padding} width={plotSize} height={plotSize} fill="url(#grid)" />

      {/* Quadrant backgrounds */}
      {/* Secure (low anxiety, low avoidance) - bottom left */}
      <rect x={padding} y={midY} width={plotSize / 2} height={plotSize / 2} fill="#22c55e" opacity="0.1" />
      {/* Anxious-Preoccupied (high anxiety, low avoidance) - top left */}
      <rect x={padding} y={padding} width={plotSize / 2} height={plotSize / 2} fill="#ef4444" opacity="0.1" />
      {/* Dismissive-Avoidant (low anxiety, high avoidance) - bottom right */}
      <rect x={midX} y={midY} width={plotSize / 2} height={plotSize / 2} fill="#3b82f6" opacity="0.1" />
      {/* Fearful-Avoidant (high anxiety, high avoidance) - top right */}
      <rect x={midX} y={padding} width={plotSize / 2} height={plotSize / 2} fill="#a855f7" opacity="0.1" />

      {/* Border */}
      <rect
        x={padding}
        y={padding}
        width={plotSize}
        height={plotSize}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
      />

      {/* Center lines */}
      <line x1={midX} y1={padding} x2={midX} y2={padding + plotSize} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 2" />
      <line x1={padding} y1={midY} x2={padding + plotSize} y2={midY} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 2" />

      {/* Quadrant labels */}
      <text x={padding + plotSize / 4} y={padding + plotSize / 4} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Anxious-
      </text>
      <text x={padding + plotSize / 4} y={padding + plotSize / 4 + 12} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Preoccupied
      </text>

      <text x={padding + 3 * plotSize / 4} y={padding + plotSize / 4} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Fearful-
      </text>
      <text x={padding + 3 * plotSize / 4} y={padding + plotSize / 4 + 12} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Avoidant
      </text>

      <text x={padding + plotSize / 4} y={padding + 3 * plotSize / 4} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Secure
      </text>

      <text x={padding + 3 * plotSize / 4} y={padding + 3 * plotSize / 4} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Dismissive-
      </text>
      <text x={padding + 3 * plotSize / 4} y={padding + 3 * plotSize / 4 + 12} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Avoidant
      </text>

      {/* Axis labels */}
      <text x={size / 2} y={size - 10} textAnchor="middle" className="fill-[var(--color-text-secondary)] text-xs font-medium">
        Avoidance →
      </text>
      <text
        x={15}
        y={size / 2}
        textAnchor="middle"
        className="fill-[var(--color-text-secondary)] text-xs font-medium"
        transform={`rotate(-90 15 ${size / 2})`}
      >
        Anxiety →
      </text>

      {/* Scale labels */}
      <text x={padding} y={size - 25} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Low
      </text>
      <text x={padding + plotSize} y={size - 25} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        High
      </text>
      <text x={25} y={padding + plotSize} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        Low
      </text>
      <text x={25} y={padding} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[10px]">
        High
      </text>

      {/* User position marker */}
      <circle
        cx={x}
        cy={y}
        r={12}
        fill="var(--color-champagne)"
        opacity="0.3"
      />
      <circle
        cx={x}
        cy={y}
        r={8}
        fill="var(--color-champagne)"
        stroke="var(--color-bg-primary)"
        strokeWidth="2"
        data-testid="ecr-position-marker"
      />
    </svg>
  );
}

interface DimensionCardProps {
  dimension: 'anxiety' | 'avoidance';
  score: number;
  interpretation: string;
  description: string;
}

function DimensionCard({ dimension, score, interpretation, description }: DimensionCardProps) {
  const info = dimensionInfo[dimension];
  // Calculate percentage for the bar (1-7 scale to 0-100%)
  const percentage = ((score - 1) / 6) * 100;

  return (
    <div className="card-premium rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
        <h4 className="font-display text-lg font-medium text-[var(--color-text-primary)]">
          {info.name}
        </h4>
      </div>

      <p className="text-[var(--color-text-secondary)] text-sm mb-4">{description}</p>

      {/* Score bar */}
      <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden mb-2">
        <div
          className="absolute h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: info.color,
          }}
        />
      </div>

      {/* Scale labels and score */}
      <div className="flex justify-between items-center">
        <span className="text-[var(--color-text-muted)] text-xs">Low</span>
        <span className="text-[var(--color-text-primary)] text-sm font-medium" data-testid={`ecr-${dimension}-score`}>
          {interpretation} ({score.toFixed(1)})
        </span>
        <span className="text-[var(--color-text-muted)] text-xs">High</span>
      </div>
    </div>
  );
}

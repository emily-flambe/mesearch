import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import {
  type RMETResults as Results,
  deserializeResults,
  getScoreLevel,
} from '../data/rmet-scoring';

const RESULTS_STORAGE_KEY = 'mesearch-rmet-results';

interface RMETResultsProps {
  initialResults?: Results;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function RMETResults({ initialResults, showHeader = true, showActions = true }: RMETResultsProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(initialResults || null);
  const [showItemBreakdown, setShowItemBreakdown] = useState(false);

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
            You haven&apos;t completed the RMET assessment yet.
          </p>
          <button
            onClick={() => navigate('/test/rmet')}
            className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase"
          >
            Take the Test
          </button>
        </div>
      </main>
    );

    return showHeader ? <Layout>{content}</Layout> : content;
  }

  const scoreLevel = getScoreLevel(results.totalCorrect);

  const mainContent = (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h2 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
            Reading the Mind in the Eyes
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Main Score Card */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="flex-shrink-0">
              <ScoreCircle
                score={results.totalCorrect}
                total={results.totalQuestions}
                percentile={results.percentile}
              />
            </div>

            {/* Score Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <h3 className="font-display text-2xl font-medium text-[var(--color-text-primary)]">
                  {scoreLevel}
                </h3>
                <span className="px-3 py-1 rounded-full bg-[var(--color-champagne)]/20 text-[var(--color-champagne)] text-xs font-medium">
                  {results.percentile}th percentile
                </span>
              </div>

              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
                {results.interpretation}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border)]">
                <div>
                  <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">
                    Correct
                  </p>
                  <p className="text-[var(--color-text-primary)] text-lg font-medium">
                    {results.totalCorrect} / {results.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">
                    Accuracy
                  </p>
                  <p className="text-[var(--color-text-primary)] text-lg font-medium">
                    {results.percentCorrect}%
                  </p>
                </div>
                {results.averageResponseTime && (
                  <div>
                    <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">
                      Avg. Time
                    </p>
                    <p className="text-[var(--color-text-primary)] text-lg font-medium">
                      {(results.averageResponseTime / 1000).toFixed(1)}s
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-6">
            Where You Fall
          </h3>
          <ScoreDistribution score={results.totalCorrect} />
        </div>

        {/* Item Breakdown Toggle */}
        <div className="card-premium rounded-lg overflow-hidden mb-8">
          <button
            onClick={() => setShowItemBreakdown(!showItemBreakdown)}
            className="w-full p-6 text-left hover:bg-[var(--color-bg-secondary)]/50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[var(--color-text-primary)] font-medium mb-1">
                  Item-by-Item Breakdown
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm">
                  See which items you got correct and incorrect
                </p>
              </div>
              <svg
                className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 ${
                  showItemBreakdown ? 'rotate-180' : ''
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
          </button>

          {showItemBreakdown && (
            <div className="border-t border-[var(--color-border)] p-6">
              <div className="grid gap-2">
                {results.itemResults.map((item) => (
                  <div
                    key={item.itemId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.correct
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--color-text-muted)] text-sm w-8">
                        #{item.itemId}
                      </span>
                      <span
                        className={`text-sm ${
                          item.correct ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {item.correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div className="text-right">
                      {!item.correct && (
                        <div className="text-[var(--color-text-muted)] text-xs">
                          <span className="line-through opacity-50">
                            {item.selectedAnswer}
                          </span>
                          {' → '}
                          <span className="text-green-400 capitalize">
                            {item.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* About the Test */}
        <div className="card-premium rounded-lg p-8 mb-8">
          <h3 className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider mb-4">
            About This Test
          </h3>
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4">
            The Reading the Mind in the Eyes Test (RMET) measures &quot;theory of
            mind&quot; - the ability to understand what others are thinking or feeling
            based on their eye expressions. It was developed by Baron-Cohen and
            colleagues at the Autism Research Centre.
          </p>
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
            Normative data: In the general population, the average score is around
            26 out of 36 (SD ≈ 3.6). Scores can be influenced by factors like
            attention, vocabulary, and cultural background.
          </p>
        </div>

        {/* Citation */}
        <div className="text-center mb-8">
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
            Baron-Cohen, S., Wheelwright, S., Hill, J., Raste, Y., & Plumb, I.
            (2001). The &quot;Reading the Mind in the Eyes&quot; Test Revised Version: A
            Study with Normal Adults, and Adults with Asperger Syndrome or
            High-functioning Autism.{' '}
            <em>Journal of Child Psychology and Psychiatry</em>, 42(2), 241-251.
          </p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/test/rmet')}
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
          This assessment provides insight into social cognition abilities but
          should not be used for clinical diagnosis. Many factors can influence
          test performance. Consult a qualified professional for clinical
          evaluation.
        </p>
      </div>
    </main>
  );

  return showHeader ? <Layout>{mainContent}</Layout> : mainContent;
}

interface ScoreCircleProps {
  score: number;
  total: number;
  percentile: number;
}

function ScoreCircle({ score, total, percentile }: ScoreCircleProps) {
  const percentage = (score / total) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color based on percentile
  const getColor = () => {
    if (percentile >= 70) return 'var(--color-champagne)';
    if (percentile >= 30) return 'var(--color-gold)';
    return 'var(--color-text-muted)';
  };

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r="45"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r="45"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-medium text-[var(--color-text-primary)]">
          {score}
        </span>
        <span className="text-[var(--color-text-muted)] text-sm">of {total}</span>
      </div>
    </div>
  );
}

interface ScoreDistributionProps {
  score: number;
}

function ScoreDistribution({ score }: ScoreDistributionProps) {
  // Approximate normal distribution for visualization
  // Mean = 26.2, SD = 3.6
  const mean = 26.2;
  const sd = 3.6;

  // Generate distribution points
  const points: { x: number; y: number }[] = [];
  for (let x = 10; x <= 36; x++) {
    const z = (x - mean) / sd;
    const y = Math.exp(-0.5 * z * z);
    points.push({ x, y });
  }

  const maxY = Math.max(...points.map((p) => p.y));
  const width = 400;
  const height = 100;
  const padding = 20;

  const scaleX = (x: number) =>
    padding + ((x - 10) / (36 - 10)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - (y / maxY) * (height - 2 * padding);

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ');

  // Close the path for fill
  const areaPath = `${pathD} L ${scaleX(36)} ${height - padding} L ${scaleX(10)} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height + 30}`}
        className="w-full max-w-md mx-auto"
      >
        {/* Distribution curve fill */}
        <path
          d={areaPath}
          fill="var(--color-champagne)"
          fillOpacity="0.1"
        />
        {/* Distribution curve line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-champagne)"
          strokeWidth="2"
          opacity="0.5"
        />
        {/* Your score marker */}
        <line
          x1={scaleX(score)}
          y1={height - padding}
          x2={scaleX(score)}
          y2={padding}
          stroke="var(--color-champagne)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <circle
          cx={scaleX(score)}
          cy={scaleY(
            points.find((p) => Math.round(p.x) === score)?.y || 0.5
          )}
          r="6"
          fill="var(--color-champagne)"
        />
        {/* Labels */}
        <text
          x={scaleX(10)}
          y={height}
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-xs"
        >
          10
        </text>
        <text
          x={scaleX(20)}
          y={height}
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-xs"
        >
          20
        </text>
        <text
          x={scaleX(mean)}
          y={height}
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-xs"
        >
          Mean
        </text>
        <text
          x={scaleX(36)}
          y={height}
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-xs"
        >
          36
        </text>
        <text
          x={scaleX(score)}
          y={height + 20}
          textAnchor="middle"
          className="fill-[var(--color-champagne)] text-xs font-medium"
        >
          You
        </text>
      </svg>
    </div>
  );
}

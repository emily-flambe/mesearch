import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DimensionScore,
  scoreToPercentage,
  getScoreLabel,
} from '../data/hexaco-scoring';
import {
  dimensionDescriptions,
  facetDescriptions,
  HexacoDimension,
} from '../data/hexaco-items';

interface HexacoResultsProps {
  scores: DimensionScore[] | null;
}

// Dimension colors for visual distinction
const dimensionColors: Record<HexacoDimension, string> = {
  'Honesty-Humility': 'var(--color-champagne)',
  'Emotionality': '#a888a8',
  'Extraversion': '#e8a87c',
  'Agreeableness': '#7cb8a8',
  'Conscientiousness': '#8899cc',
  'Openness': '#cc8899',
};

function ScoreBar({ score, color }: { score: number; color: string }) {
  const percentage = scoreToPercentage(score);
  return (
    <div className="relative w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
}

function DimensionCard({ dimensionScore }: { dimensionScore: DimensionScore }) {
  const { dimension, score, facetScores } = dimensionScore;
  const description = dimensionDescriptions[dimension];
  const color = dimensionColors[dimension];
  const isHighlight = dimension === 'Honesty-Humility';

  return (
    <div
      className={`card-premium rounded-lg p-6 md:p-8 ${
        isHighlight ? 'ring-1 ring-[var(--color-champagne)]/30' : ''
      }`}
    >
      {/* Highlight badge for Honesty-Humility */}
      {isHighlight && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-[10px] tracking-widest uppercase bg-[var(--color-champagne)]/10 text-[var(--color-champagne)] rounded-full border border-[var(--color-champagne)]/20">
            Unique to HEXACO
          </span>
        </div>
      )}

      {/* Dimension Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="font-display text-xl font-medium mb-1"
            style={{ color }}
          >
            {description.name}
          </h3>
          <p className="text-[var(--color-text-muted)] text-sm">
            {getScoreLabel(score)} ({score.toFixed(2)})
          </p>
        </div>
        <div
          className="text-3xl font-display font-medium"
          style={{ color }}
        >
          {scoreToPercentage(score)}%
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <ScoreBar score={score} color={color} />
      </div>

      {/* Description */}
      <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
        {score >= 3 ? description.highDescription : description.lowDescription}
      </p>

      {/* Facets */}
      <div className="space-y-3 pt-4 border-t border-[var(--color-border-subtle)]">
        <p className="text-[var(--color-text-muted)] text-xs tracking-wide uppercase mb-2">
          Facet Breakdown
        </p>
        {facetScores.map(({ facet, score: facetScore }) => (
          <div key={facet}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[var(--color-text-secondary)] text-sm">
                {facet}
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                {facetScore.toFixed(2)}
              </span>
            </div>
            <div className="relative w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${scoreToPercentage(facetScore)}%`,
                  backgroundColor: color,
                  opacity: 0.7,
                }}
              />
            </div>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">
              {facetDescriptions[facet]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HexacoResults({ scores }: HexacoResultsProps) {
  // Add noindex meta tag
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (!scores) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <Link
              to="/"
              className="font-display text-2xl font-semibold tracking-wide text-gold-gradient"
            >
              Mesearch
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="card-premium rounded-lg p-12">
            <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
              No Results Found
            </p>
            <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
              Assessment Incomplete
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-10 leading-relaxed transition-colors duration-300">
              Please complete the HEXACO-60 assessment to view your results.
            </p>
            <Link
              to="/hexaco"
              className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
            >
              Start Assessment
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Reorder to put Honesty-Humility first (as the unique HEXACO insight)
  const orderedScores = [...scores].sort((a, b) => {
    if (a.dimension === 'Honesty-Humility') return -1;
    if (b.dimension === 'Honesty-Humility') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-2xl font-semibold tracking-wide text-gold-gradient"
          >
            Mesearch
          </Link>
          <Link
            to="/"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)] transition-colors duration-300 text-sm tracking-wide"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Results Header */}
        <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
            HEXACO-60 Profile
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Your personality profile across six fundamental dimensions. The HEXACO model
            includes Honesty-Humility, a dimension not captured by the traditional Big Five,
            making it particularly useful for understanding ethical behavior and interpersonal conduct.
          </p>
        </div>

        {/* Honesty-Humility Highlight Section */}
        <div className="mb-8 p-6 bg-[var(--color-accent-purple)] rounded-lg border border-[var(--color-champagne)]/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-champagne)]/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--color-champagne)]"
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
              <h3 className="font-display text-lg font-medium text-[var(--color-text-primary)] mb-2">
                The HEXACO Difference
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                Unlike the Big Five model, HEXACO includes <strong className="text-[var(--color-champagne)]">Honesty-Humility</strong> as
                a distinct dimension. Research shows this factor is particularly valuable for predicting
                ethical behavior, workplace conduct, and interpersonal relationships. It captures traits
                like sincerity, fairness, and modesty that aren't fully represented in other personality models.
              </p>
            </div>
          </div>
        </div>

        {/* Dimension Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {orderedScores.map((dimensionScore) => (
            <DimensionCard
              key={dimensionScore.dimension}
              dimensionScore={dimensionScore}
            />
          ))}
        </div>

        {/* Scientific Context */}
        <div className="mt-12 p-6 card-premium rounded-lg">
          <h3 className="font-display text-lg font-medium text-[var(--color-text-primary)] mb-4">
            Understanding Your Results
          </h3>
          <div className="space-y-4 text-[var(--color-text-secondary)] text-sm leading-relaxed">
            <p>
              <strong className="text-[var(--color-text-primary)]">Score Interpretation:</strong> Scores
              range from 1 to 5, with 3 being average. Higher scores indicate stronger expression of
              that dimension. There are no "good" or "bad" scores-each end of the spectrum has its
              own strengths and potential challenges.
            </p>
            <p>
              <strong className="text-[var(--color-text-primary)]">Scientific Backing:</strong> The
              HEXACO model emerged from cross-cultural lexical studies and has strong empirical support.
              It's widely used in academic research, particularly for studying ethics, organizational
              behavior, and interpersonal relationships.
            </p>
            <p>
              <strong className="text-[var(--color-text-primary)]">Limitations:</strong> Self-report
              assessments reflect how you see yourself, which may differ from how others perceive you.
              Personality can also vary somewhat across situations. Use these results as a starting
              point for self-reflection rather than a definitive label.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Link
            to="/hexaco"
            className="btn-ghost inline-block px-8 py-3 rounded text-xs tracking-widest uppercase mr-4"
          >
            Retake Assessment
          </Link>
          <Link
            to="/"
            className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
          >
            Explore More Tests
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-12 mt-12 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-xl text-gold-gradient mb-4">Mesearch</p>
          <p className="text-[var(--color-text-muted)] text-xs mb-2">
            HEXACO-60 is copyrighted by K. Lee & M.C. Ashton
          </p>
          <p className="text-[var(--color-text-muted)]/50 text-xs">&copy; 2026</p>
        </div>
      </footer>
    </div>
  );
}

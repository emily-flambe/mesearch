import { Link } from 'react-router-dom';
import { type EnneagramResult, sortScoresByPercentage } from '../data/enneagram-scoring';
import { getTypeById } from '../data/enneagram-types';

interface EnneagramResultsProps {
  result: EnneagramResult;
  onRetake: () => void;
  showHeader?: boolean;
  showActions?: boolean;
}

export function EnneagramResults({ result, onRetake, showHeader = true, showActions = true }: EnneagramResultsProps) {
  const primaryTypeInfo = getTypeById(result.primaryType);
  const wingTypeInfo = getTypeById(result.wing);
  const sortedScores = sortScoresByPercentage(result.scores);

  return (
    <div className="space-y-10">
      {/* Disclaimer Banner */}
      <div className="bg-[var(--color-discovery)]/10 border border-[var(--color-discovery-border)] rounded-lg p-4 text-center">
        <p className="text-[var(--color-discovery)] text-sm font-medium">
          Self-Discovery Tool &mdash; Not Scientifically Validated
        </p>
        <p className="text-[var(--color-text-muted)] text-xs mt-1">
          The Enneagram is a popular framework for personal exploration but lacks rigorous scientific validation.
        </p>
      </div>

      {/* Primary Result */}
      <div className="card-premium rounded-lg p-8 text-center">
        <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
          Your Primary Type
        </p>
        <h2 className="font-display text-5xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
          Type {result.primaryType}
        </h2>
        <p className="font-display text-2xl text-gold-gradient mb-1">
          {primaryTypeInfo.name}
        </p>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          {primaryTypeInfo.subtitle}
        </p>
        <div className="inline-block bg-[var(--color-bg-tertiary)] px-4 py-2 rounded-full">
          <span className="text-[var(--color-champagne)] font-medium">
            {result.wingLabel}
          </span>
          <span className="text-[var(--color-text-muted)] text-sm ml-2">
            ({wingTypeInfo.name} wing)
          </span>
        </div>
      </div>

      {/* Primary Type Description */}
      <div className="card-premium rounded-lg p-8">
        <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
          About {primaryTypeInfo.name}
        </h3>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6 transition-colors duration-300">
          {primaryTypeInfo.description}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-[var(--color-text-muted)] text-xs tracking-wide uppercase mb-2">
              Core Fear
            </p>
            <p className="text-[var(--color-text-secondary)] text-sm transition-colors duration-300">
              {primaryTypeInfo.coreFear}
            </p>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] text-xs tracking-wide uppercase mb-2">
              Core Desire
            </p>
            <p className="text-[var(--color-text-secondary)] text-sm transition-colors duration-300">
              {primaryTypeInfo.coreDesire}
            </p>
          </div>
        </div>
      </div>

      {/* All Type Scores */}
      <div className="card-premium rounded-lg p-8">
        <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-6 transition-colors duration-300">
          All Type Scores
        </h3>
        <div className="space-y-4">
          {sortedScores.map((score) => {
            const typeInfo = getTypeById(score.type);
            const isPrimary = score.type === result.primaryType;
            return (
              <div key={score.type} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-display text-lg ${
                        isPrimary
                          ? 'text-[var(--color-champagne)]'
                          : 'text-[var(--color-text-primary)]'
                      } transition-colors duration-300`}
                    >
                      Type {score.type}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm">
                      {typeInfo.name}
                    </span>
                    {isPrimary && (
                      <span className="bg-[var(--color-champagne)]/20 text-[var(--color-champagne)] text-xs px-2 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <span className="text-[var(--color-text-secondary)] font-medium transition-colors duration-300">
                    {score.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPrimary
                        ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-champagne)]'
                        : 'bg-[var(--color-text-muted)]/40'
                    }`}
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth & Stress */}
      <div className="card-premium rounded-lg p-8">
        <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-6 transition-colors duration-300">
          Growth & Stress Patterns
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-bg-tertiary)]/50 rounded-lg p-5">
            <p className="text-[var(--color-champagne)] text-xs tracking-wide uppercase mb-2">
              Direction of Growth
            </p>
            <p className="text-[var(--color-text-primary)] font-medium mb-1 transition-colors duration-300">
              Type {primaryTypeInfo.growthDirection} &mdash;{' '}
              {getTypeById(primaryTypeInfo.growthDirection).name}
            </p>
            <p className="text-[var(--color-text-muted)] text-sm">
              When you're at your best, you take on positive qualities of this type.
            </p>
          </div>
          <div className="bg-[var(--color-bg-tertiary)]/50 rounded-lg p-5">
            <p className="text-[var(--color-text-muted)] text-xs tracking-wide uppercase mb-2">
              Direction of Stress
            </p>
            <p className="text-[var(--color-text-primary)] font-medium mb-1 transition-colors duration-300">
              Type {primaryTypeInfo.stressDirection} &mdash;{' '}
              {getTypeById(primaryTypeInfo.stressDirection).name}
            </p>
            <p className="text-[var(--color-text-muted)] text-sm">
              Under stress, you may exhibit less healthy traits of this type.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetake}
            className="btn-ghost px-8 py-3 rounded text-sm tracking-widest uppercase"
          >
            Retake Test
          </button>
          <Link
            to="/"
            className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase text-center"
          >
            Explore Other Tests
          </Link>
        </div>
      )}

      {/* Attribution */}
      <div className="text-center pt-6 border-t border-[var(--color-border-subtle)]">
        <p className="text-[var(--color-text-muted)] text-xs">
          Items adapted from{' '}
          <a
            href="https://openpsychometrics.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-champagne)] hover:underline"
          >
            Open Source Psychometrics Project
          </a>{' '}
          (CC BY-NC-SA)
        </p>
      </div>
    </div>
  );
}

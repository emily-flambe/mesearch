import { Link } from 'react-router-dom';
import { crtItems } from '../data/crt-items';
import { type CRTResults, getScoreInterpretation } from '../data/crt-scoring';

interface CRTResultsProps {
  results: CRTResults;
  onRetake: () => void;
}

export default function CRTResultsComponent({ results, onRetake }: CRTResultsProps) {
  const interpretation = getScoreInterpretation(results.totalCorrect, results.totalQuestions);
  const percentage = Math.round((results.totalCorrect / results.totalQuestions) * 100);

  return (
    <div data-testid="crt-results">
      {/* Title */}
      <div className="text-center mb-12">
        <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
          Your Results
        </p>
        <h2 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
          Cognitive Reflection Test
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          Completed {new Date(results.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Score Summary */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-500 mb-4">
            <span className="text-4xl font-bold text-[var(--color-text-primary)]">
              {results.totalCorrect}
            </span>
            <span className="text-lg text-[var(--color-text-muted)]">/{results.totalQuestions}</span>
          </div>
          <h3 className="font-display text-xl font-medium text-[var(--color-text-primary)] mb-2">
            {interpretation}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {percentage}% correct - {results.percentile}th percentile
          </p>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
            <div data-testid="crt-reflective-score" className="text-2xl font-bold text-green-400">{results.reflectiveScore}</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mt-1">
              Reflective
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Correct answers</div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
            <div data-testid="crt-intuitive-score" className="text-2xl font-bold text-amber-400">{results.intuitiveScore}</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mt-1">
              Intuitive
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Common wrong</div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
            <div data-testid="crt-other-score" className="text-2xl font-bold text-red-400">{results.otherErrors}</div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mt-1">
              Other
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Other errors</div>
          </div>
        </div>

        {/* Prior exposure note */}
        {results.priorExposure !== 'none' && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 text-sm">
              <strong>Note:</strong> You indicated prior exposure to these problems.
              This may have influenced your performance.
            </p>
          </div>
        )}
      </div>

      {/* Individual Item Results */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <h3 className="text-[var(--color-text-primary)] font-medium mb-6">
          Question Breakdown
        </h3>
        <div className="space-y-6">
          {results.itemResults.map((itemResult, index) => {
            const item = crtItems.find((i) => i.id === itemResult.itemId);
            if (!item) return null;

            return (
              <ItemResultCard
                key={itemResult.itemId}
                index={index + 1}
                item={item}
                itemResult={itemResult}
              />
            );
          })}
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="card-premium rounded-lg p-8 mb-8">
        <h3 className="text-[var(--color-text-primary)] font-medium mb-4">
          Understanding Your Results
        </h3>
        <div className="space-y-4 text-[var(--color-text-secondary)] text-sm leading-relaxed">
          <p>
            The Cognitive Reflection Test measures your tendency to override an intuitive
            "gut" response in favor of more deliberate, analytical thinking. Each problem
            has a tempting wrong answer that comes to mind quickly.
          </p>
          <p>
            <strong className="text-green-400">Reflective thinking</strong> means you recognized
            the intuitive answer was wrong and engaged in further reflection to find the correct solution.
          </p>
          <p>
            <strong className="text-amber-400">Intuitive thinking</strong> means you gave the
            common wrong answer that most people's first instinct suggests.
          </p>
          <p className="text-[var(--color-text-muted)] text-xs">
            Research shows CRT scores correlate with various real-world outcomes including
            financial decision-making, risk assessment, and resistance to certain cognitive biases.
          </p>
        </div>
      </div>

      {/* Actions */}
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
          Explore More Tests
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-center">
        <p className="text-[var(--color-text-muted)] text-xs leading-relaxed max-w-2xl mx-auto">
          This assessment provides insight into your cognitive style based on performance
          on these specific problems. Results may vary based on context, alertness, and
          prior exposure to similar problems.
        </p>
      </div>
    </div>
  );
}

interface ItemResultCardProps {
  index: number;
  item: typeof crtItems[0];
  itemResult: {
    userAnswer: string;
    correct: boolean;
    wasIntuitive: boolean;
  };
}

function ItemResultCard({ index, item, itemResult }: ItemResultCardProps) {
  const statusColor = itemResult.correct
    ? 'text-green-400 border-green-500/30 bg-green-500/10'
    : itemResult.wasIntuitive
    ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    : 'text-red-400 border-red-500/30 bg-red-500/10';

  const statusLabel = itemResult.correct
    ? 'Correct'
    : itemResult.wasIntuitive
    ? 'Intuitive'
    : 'Incorrect';

  return (
    <div className="border border-[var(--color-border)] rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[var(--color-text-muted)] text-xs">Question {index}</span>
          <h4 className="text-[var(--color-text-primary)] font-medium">{item.name}</h4>
        </div>
        <span className={`px-2 py-1 rounded text-xs uppercase ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Question */}
      <p className="text-[var(--color-text-secondary)] text-sm mb-4 leading-relaxed">
        {item.text}
      </p>

      {/* Answers */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-[var(--color-text-muted)] text-xs block mb-1">Your answer:</span>
          <span className={itemResult.correct ? 'text-green-400' : 'text-red-400'}>
            {itemResult.userAnswer || '(no answer)'}
          </span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] text-xs block mb-1">Correct answer:</span>
          <span className="text-green-400">{item.correctAnswer}</span>
        </div>
      </div>

      {/* Explanation (show only for wrong answers) */}
      {!itemResult.correct && (
        <div className="bg-[var(--color-bg-secondary)] rounded p-3">
          <span className="text-[var(--color-text-muted)] text-xs block mb-1">Explanation:</span>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
            {item.explanation}
          </p>
          <p className="text-amber-400/80 text-xs mt-2">
            Common intuitive answer: {item.intuitiveAnswer}
          </p>
        </div>
      )}
    </div>
  );
}

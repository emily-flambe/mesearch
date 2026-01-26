import { Link } from 'react-router-dom';
import { type IATResults } from '../data/iat-scoring';

interface WeaponsIATResultsDisplayProps {
  results: IATResults;
  onRetake: () => void;
}

/**
 * Get Weapons IAT-specific interpretation text based on D-score.
 *
 * For Weapons IAT:
 * - Positive D = slower when White Faces + Weapons share a key = implicit association of Black Faces with Weapons
 * - Negative D = slower when Black Faces + Weapons share a key = implicit association of White Faces with Weapons
 *
 * Note: The "compatible" pairing in our implementation has Black Faces + Weapons together initially.
 * A positive D-score means the participant was faster on that pairing.
 */
function getWeaponsIATInterpretation(dScore: number): string {
  if (dScore < -0.65) {
    return 'Your result suggests a strong automatic association between White Faces and Weapons (compared to Black Faces and Weapons). This means you were noticeably faster when White Faces and Weapons shared a response key. This is an uncommon pattern among test-takers.';
  }
  if (dScore < -0.35) {
    return 'Your result suggests a moderate automatic association between White Faces and Weapons (compared to Black Faces and Weapons). This means you were faster when White Faces and Weapons shared a response key. This is an uncommon pattern among test-takers.';
  }
  if (dScore < -0.15) {
    return 'Your result suggests a slight automatic association between White Faces and Weapons (compared to Black Faces and Weapons). This means you were somewhat faster when White Faces and Weapons shared a response key.';
  }
  if (dScore <= 0.15) {
    return 'Your result suggests little to no differential automatic association between racial categories and weapons. Your response times were similar regardless of which concepts shared a response key.';
  }
  if (dScore <= 0.35) {
    return 'Your result suggests a slight automatic association between Black Faces and Weapons (compared to White Faces and Weapons). This means you were somewhat faster when Black Faces and Weapons shared a response key. Research shows this is a common pattern.';
  }
  if (dScore <= 0.65) {
    return 'Your result suggests a moderate automatic association between Black Faces and Weapons (compared to White Faces and Weapons). This means you were faster when Black Faces and Weapons shared a response key. Research shows this is a common pattern.';
  }
  return 'Your result suggests a strong automatic association between Black Faces and Weapons (compared to White Faces and Weapons). This means you were noticeably faster when Black Faces and Weapons shared a response key. Research shows this is a common pattern.';
}

export default function WeaponsIATResultsDisplay({ results, onRetake }: WeaponsIATResultsDisplayProps) {
  // Determine the interpretation display
  const getInterpretationBadge = () => {
    switch (results.dScoreInterpretation) {
      case 'strong_preference_a':
        return { text: 'Strong', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'moderate_preference_a':
        return { text: 'Moderate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'slight_preference_a':
        return { text: 'Slight', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'little_to_no_preference':
        return { text: 'Little to No', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
      case 'slight_preference_b':
        return { text: 'Slight', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'moderate_preference_b':
        return { text: 'Moderate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'strong_preference_b':
        return { text: 'Strong', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    }
  };

  const badge = getInterpretationBadge();

  // D-score visualization
  const dScorePosition = ((results.dScore + 2) / 4) * 100; // Map -2 to +2 to 0% to 100%

  // Get weapons-specific interpretation
  const interpretationText = getWeaponsIATInterpretation(results.dScore);

  return (
    <div className="flex-1 flex items-center justify-center p-6" data-testid="weapons-iat-results">
      <div className="card-premium rounded-lg p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Assessment Complete
          </p>
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
            Your Results
          </h2>

          {/* D-Score Display */}
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${badge.color}`}
            >
              {badge.text} Automatic Association
            </span>
          </div>

          {/* D-Score Value */}
          <div className="mb-4">
            <span className="text-4xl font-bold text-[var(--color-text-primary)]">
              D = {results.dScore.toFixed(2)}
            </span>
          </div>

          {/* D-Score Scale Visualization */}
          <div className="mb-6">
            <div className="relative h-4 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              {/* Scale markers */}
              <div className="absolute inset-0 flex justify-between px-1 items-center">
                <span className="text-[8px] text-[var(--color-text-muted)]">-2</span>
                <span className="text-[8px] text-[var(--color-text-muted)]">0</span>
                <span className="text-[8px] text-[var(--color-text-muted)]">+2</span>
              </div>
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)]" />
              {/* Score indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-champagne)] border-2 border-[var(--color-bg-primary)]"
                style={{ left: `calc(${dScorePosition}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
              <span>White + Weapons</span>
              <span>Black + Weapons</span>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4 mb-6">
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
            {interpretationText}
          </p>
        </div>

        {/* Critical Disclaimer for Weapons IAT */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm font-medium mb-2">
            Critical: What This Result Does NOT Mean
          </p>
          <ul className="text-[var(--color-text-muted)] text-xs space-y-2 leading-relaxed">
            <li>
              <strong>NOT a measure of racism or prejudice.</strong> An automatic association does not mean you consciously believe certain groups are dangerous. These are automatic associations shaped by cultural exposure, media portrayals, and societal patterns.
            </li>
            <li>
              <strong>NOT a character judgment.</strong> Your implicit associations do not define who you are as a person. They reflect cultural exposure, not personal endorsement or moral character.
            </li>
            <li>
              <strong>NOT predictive of individual behavior.</strong> A single IAT score does not reliably predict how you will act in any specific situation, including whether you would treat people differently.
            </li>
            <li>
              <strong>NOT suitable for consequential decisions.</strong> This test should NEVER be used for hiring, law enforcement training evaluations, or any decisions that affect people's lives.
            </li>
          </ul>
        </div>

        {/* Research Context */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-blue-400 text-sm font-medium mb-2">
            Research Context
          </p>
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
            This IAT replicates research paradigms used to study implicit weapon bias. Studies by Payne (2001), Correll et al. (2002), and others have found that many Americans - including both Black and White participants - show faster associations between Black faces and weapons. Researchers attribute this to cultural exposure rather than personal prejudice. Understanding these automatic associations is considered a first step toward addressing them.
          </p>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
            <div className="text-lg font-medium text-[var(--color-text-primary)]">
              {results.totalTrials}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Total Trials</div>
          </div>
          <div className="text-center p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
            <div className="text-lg font-medium text-[var(--color-text-primary)]">
              {Math.round(results.averageResponseTime)}ms
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Avg Response</div>
          </div>
          <div className="text-center p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
            <div className="text-lg font-medium text-[var(--color-text-primary)]">
              {(results.errorRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Error Rate</div>
          </div>
          <div className="text-center p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
            <div className="text-lg font-medium text-[var(--color-text-primary)]">
              {results.validTrials}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Valid Trials</div>
          </div>
        </div>

        {/* Exclusion Warning */}
        {results.shouldExclude && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm font-medium mb-1">
              Data Quality Warning
            </p>
            <p className="text-[var(--color-text-muted)] text-xs">
              {results.exclusionReason}
              <br />
              Your results may not be reliable. Consider retaking the test while responding more carefully.
            </p>
          </div>
        )}

        {/* Important Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
          <p className="text-amber-400 text-sm font-medium mb-2">
            Important: Please Read Carefully
          </p>
          <p className="text-[var(--color-text-muted)] text-xs whitespace-pre-line leading-relaxed">
            {results.disclaimer}
          </p>
        </div>

        {/* Placeholder Note */}
        <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5"
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
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                Note About This Version
              </p>
              <p className="text-[var(--color-text-muted)] text-xs">
                This version uses placeholder text labels instead of images.
                The standard Weapons IAT uses photographs of faces and images of objects.
                Results from this text-based version may differ from the image-based version.
              </p>
            </div>
          </div>
        </div>

        {/* Do Not Share Warning */}
        <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                Please Do Not Share Individual Results
              </p>
              <p className="text-[var(--color-text-muted)] text-xs">
                Project Implicit explicitly recommends against sharing individual IAT results.
                These scores are meaningful at the group level but have too much variability
                to be reliable for individuals. Use this result for personal reflection only.
              </p>
            </div>
          </div>
        </div>

        {/* Learn More Section */}
        <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4 mb-8">
          <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-3">
            Learn More About Implicit Weapon Bias Research
          </p>
          <div className="space-y-2 text-xs">
            <a
              href="https://implicit.harvard.edu/implicit/takeatest.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Take IATs at Project Implicit
            </a>
            <a
              href="https://implicit.harvard.edu/implicit/iatdetails.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              How the IAT Works - Project Implicit
            </a>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/11474722/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Payne (2001) - Weapon Bias Research (Academic Paper)
            </a>
            <a
              href="https://implicit.harvard.edu/implicit/faqs.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Frequently Asked Questions - Project Implicit
            </a>
          </div>
          <p className="text-[var(--color-text-muted)] text-xs mt-3 italic">
            The IAT was developed by Anthony Greenwald (University of Washington), Mahzarin Banaji (Harvard), and Brian Nosek (University of Virginia).
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onRetake}
            className="btn-ghost px-8 py-3 rounded text-xs tracking-widest uppercase"
          >
            Retake Test
          </button>
          <Link
            to="/"
            className="btn-gold px-8 py-3 rounded text-xs tracking-widest uppercase"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

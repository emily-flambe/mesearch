import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from '../components/UserMenu';

// Import result types and components
import { EnneagramResults } from '../components/EnneagramResults';
import type { EnneagramResult } from '../data/enneagram-scoring';
import type { BigFiveResults as BigFiveResultsType } from '../data/big-five-scoring';
import type { MBTIResults as MBTIResultsType } from '../data/mbti-scoring';
import type { MFQResults as MFQResultsType } from '../data/mfq-scoring';
import type { SD3Results as SD3ResultsType } from '../data/sd3-scoring';
import type { ECRResults as ECRResultsType } from '../data/ecr-scoring';
import type { CommunicationStylesResults } from '../data/love-languages-scoring';
import type { RMETResults as RMETResultsType } from '../data/rmet-scoring';
import type { CRTResults as CRTResultsType } from '../data/crt-scoring';

interface StoredResult {
  id: string;
  user_id: string;
  test_type: string;
  scores: Record<string, unknown>;
  completed_at: number;
}

// Test type display names
const testDisplayNames: Record<string, string> = {
  enneagram: 'Enneagram',
  'big-five': 'Big Five',
  hexaco: 'HEXACO',
  mini_test: 'Mini-Test',
  mbti: 'Myers-Briggs',
  mfq: 'Moral Foundations',
  sd3: 'Dark Triad',
  ecr: 'Attachment Style',
  'communication-styles': 'Communication Styles',
  rmet: 'RMET',
  crt: 'Cognitive Reflection',
};

// Map test types to their retake URLs
const testUrls: Record<string, string> = {
  enneagram: '/test/enneagram',
  'big-five': '/test/big-five',
  hexaco: '/hexaco',
  mbti: '/test/mbti',
  mfq: '/test/mfq',
  sd3: '/test/sd3',
  ecr: '/test/ecr',
  'communication-styles': '/test/communication-styles',
  rmet: '/test/rmet',
  crt: '/test/crt',
  mini_test: '/test/mini-test',
};

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) {
      fetchResult();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [id, user, authLoading]);

  async function fetchResult() {
    try {
      const res = await fetch(`/api/results/${id}`, { credentials: 'include' });
      const data = await res.json() as { data: StoredResult | null; error: { message: string } | null };

      if (!res.ok) {
        setError(data.error?.message || 'Failed to load result');
        return;
      }

      setResult(data.data);
    } catch (err) {
      console.error('Failed to fetch result:', err);
      setError('Failed to load result');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="card-premium rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[var(--color-champagne)]/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-champagne)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">Authentication Required</h2>
            <p className="text-[var(--color-text-secondary)]">
              Please sign in to view your saved results.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="card-premium rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-red-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">Error</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
            <Link
              to="/my-results"
              className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
            >
              Back to Results
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
        <Header />
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="card-premium rounded-lg p-12 text-center">
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">Result Not Found</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              This result doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <Link
              to="/my-results"
              className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
            >
              Back to Results
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const retakeUrl = testUrls[result.test_type] || `/test/${result.test_type}`;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Back link */}
        <Link
          to="/my-results"
          className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Results
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">
            {testDisplayNames[result.test_type] || result.test_type}
          </p>
          <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-2">
            Result Details
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {formatDate(result.completed_at)}
          </p>
        </div>

        {/* Result visualization */}
        <div data-testid="result-detail-content">
          <ResultVisualization testType={result.test_type} scores={result.scores} />
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to={retakeUrl}
            className="btn-ghost px-6 py-3 rounded text-xs tracking-widest uppercase"
          >
            Retake Test
          </Link>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
          Mesearch
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/my-results"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)] transition-colors text-sm"
          >
            My Results
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}

interface ResultVisualizationProps {
  testType: string;
  scores: Record<string, unknown>;
}

function ResultVisualization({ testType, scores }: ResultVisualizationProps) {
  // Render appropriate visualization based on test type
  switch (testType) {
    case 'enneagram':
      return (
        <EnneagramResults
          result={scores as unknown as EnneagramResult}
          onRetake={() => {}}
        />
      );

    case 'big-five':
      return <BigFiveResultDisplay scores={scores as unknown as BigFiveResultsType} />;

    case 'mbti':
      return <MBTIResultDisplay scores={scores as unknown as MBTIResultsType} />;

    case 'mfq':
      return <MFQResultDisplay scores={scores as unknown as MFQResultsType} />;

    case 'sd3':
      return <SD3ResultDisplay scores={scores as unknown as SD3ResultsType} />;

    case 'ecr':
      return <ECRResultDisplay scores={scores as unknown as ECRResultsType} />;

    case 'communication-styles':
      return <CommunicationStylesResultDisplay scores={scores as unknown as CommunicationStylesResults} />;

    case 'rmet':
      return <RMETResultDisplay scores={scores as unknown as RMETResultsType} />;

    case 'crt':
      return <CRTResultDisplay scores={scores as unknown as CRTResultsType} />;

    case 'hexaco':
      return <HexacoResultDisplay scores={scores} />;

    case 'mini_test':
      return <MiniTestResultDisplay scores={scores} />;

    default:
      return <GenericResultDisplay testType={testType} scores={scores} />;
  }
}

// Big Five result display
function BigFiveResultDisplay({ scores }: { scores: BigFiveResultsType }) {
  const dimensionColors: Record<string, string> = {
    O: 'var(--color-champagne)',
    C: '#6B8DD6',
    E: '#F5A623',
    A: '#7ED321',
    N: '#BD10E0',
  };

  const dimensionNames: Record<string, string> = {
    O: 'Openness',
    C: 'Conscientiousness',
    E: 'Extraversion',
    A: 'Agreeableness',
    N: 'Neuroticism',
  };

  return (
    <div className="space-y-6">
      <div className="card-premium rounded-lg p-8">
        <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-6 text-center">
          Personality Profile
        </h3>
        <div className="space-y-4">
          {scores.dimensions.map((dim) => (
            <div key={dim.dimension} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)] text-sm">
                  {dimensionNames[dim.dimension] || dim.dimension}
                </span>
                <span className="text-[var(--color-text-muted)] text-xs">
                  {dim.percentile}th percentile
                </span>
              </div>
              <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${dim.percentile}%`,
                    backgroundColor: dimensionColors[dim.dimension] || 'var(--color-champagne)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// MBTI result display
function MBTIResultDisplay({ scores }: { scores: MBTIResultsType }) {
  return (
    <div className="card-premium rounded-lg p-8 text-center">
      <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
        Your Type
      </p>
      <h2 className="font-display text-5xl font-medium text-[var(--color-text-primary)] mb-4">
        {scores.type}
      </h2>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {scores.dimensions.map((dim) => (
          <div key={dim.dimension} className="text-center">
            <div className="text-2xl font-display text-[var(--color-champagne)]">
              {dim.preference}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">
              {dim.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// MFQ result display
function MFQResultDisplay({ scores }: { scores: MFQResultsType }) {
  const foundationNames: Record<string, string> = {
    care: 'Care/Harm',
    fairness: 'Fairness/Cheating',
    loyalty: 'Loyalty/Betrayal',
    authority: 'Authority/Subversion',
    purity: 'Sanctity/Degradation',
  };

  return (
    <div className="card-premium rounded-lg p-8">
      <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-6 text-center">
        Moral Foundations
      </h3>
      <div className="space-y-4">
        {scores.foundations.map((f) => (
          <div key={f.foundation} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-secondary)] text-sm">
                {foundationNames[f.foundation] || f.foundation}
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                {f.meanScore.toFixed(1)} / 5
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-champagne)] rounded-full transition-all duration-500"
                style={{ width: `${(f.meanScore / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SD3 result display
function SD3ResultDisplay({ scores }: { scores: SD3ResultsType }) {
  const traitNames: Record<string, string> = {
    machiavellianism: 'Machiavellianism',
    narcissism: 'Narcissism',
    psychopathy: 'Psychopathy',
  };

  return (
    <div className="card-premium rounded-lg p-8">
      <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-6 text-center">
        Dark Triad Profile
      </h3>
      <div className="space-y-4">
        {scores.traits.map((t) => (
          <div key={t.trait} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-secondary)] text-sm">
                {traitNames[t.trait] || t.trait}
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                {t.meanScore.toFixed(1)} / 5
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-champagne)] rounded-full transition-all duration-500"
                style={{ width: `${(t.meanScore / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ECR result display
function ECRResultDisplay({ scores }: { scores: ECRResultsType }) {
  const styleNames: Record<string, string> = {
    'secure': 'Secure',
    'anxious-preoccupied': 'Anxious-Preoccupied',
    'dismissive-avoidant': 'Dismissive-Avoidant',
    'fearful-avoidant': 'Fearful-Avoidant',
  };

  return (
    <div className="card-premium rounded-lg p-8 text-center">
      <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
        Suggested Attachment Style
      </p>
      <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-6">
        {styleNames[scores.suggestedStyle] || scores.suggestedStyle}
      </h2>
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div>
          <div className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
            Anxiety
          </div>
          <div className="text-2xl font-display text-[var(--color-text-primary)]">
            {scores.anxiety.meanScore.toFixed(1)}
          </div>
        </div>
        <div>
          <div className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2">
            Avoidance
          </div>
          <div className="text-2xl font-display text-[var(--color-text-primary)]">
            {scores.avoidance.meanScore.toFixed(1)}
          </div>
        </div>
      </div>
      <p className="text-[var(--color-text-muted)] text-xs mt-6 max-w-md mx-auto">
        {scores.disclaimer}
      </p>
    </div>
  );
}

// Communication Styles result display
function CommunicationStylesResultDisplay({ scores }: { scores: CommunicationStylesResults }) {
  const styleNames: Record<string, string> = {
    words: 'Words of Affirmation',
    time: 'Quality Time',
    gifts: 'Receiving Gifts',
    acts: 'Acts of Service',
    touch: 'Physical Touch',
  };

  return (
    <div className="card-premium rounded-lg p-8 text-center">
      <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
        Your Primary Style
      </p>
      <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-6">
        {styleNames[scores.primary] || scores.primary}
      </h2>
      <div className="space-y-4 text-left mt-8">
        {scores.styles.map((s) => (
          <div key={s.style} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-secondary)] text-sm">
                {styleNames[s.style] || s.style}
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">{s.percentage}%</span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-champagne)] rounded-full transition-all duration-500"
                style={{ width: `${s.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// RMET result display
function RMETResultDisplay({ scores }: { scores: RMETResultsType }) {
  return (
    <div className="card-premium rounded-lg p-8 text-center">
      <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
        Your Score
      </p>
      <h2 className="font-display text-5xl font-medium text-[var(--color-text-primary)] mb-2">
        {scores.totalCorrect} / {scores.totalQuestions}
      </h2>
      <p className="text-[var(--color-text-muted)] text-sm mb-4">
        {scores.percentCorrect.toFixed(0)}% correct
      </p>
      <p className="text-[var(--color-text-secondary)]">
        {scores.interpretation}
      </p>
    </div>
  );
}

// CRT result display
function CRTResultDisplay({ scores }: { scores: CRTResultsType }) {
  const percentage = (scores.totalCorrect / scores.totalQuestions) * 100;

  let interpretation = '';
  if (scores.totalCorrect === scores.totalQuestions) {
    interpretation = 'Excellent! You consistently overrode intuitive responses with reflective thinking.';
  } else if (scores.totalCorrect >= scores.totalQuestions * 0.5) {
    interpretation = 'Good performance. You showed a tendency toward reflective thinking on many items.';
  } else {
    interpretation = 'You tended toward intuitive responses. These problems are designed to trigger quick, intuitive answers.';
  }

  return (
    <div className="card-premium rounded-lg p-8 text-center">
      <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
        Cognitive Reflection Score
      </p>
      <h2 className="font-display text-5xl font-medium text-[var(--color-text-primary)] mb-2">
        {scores.totalCorrect} / {scores.totalQuestions}
      </h2>
      <p className="text-[var(--color-text-muted)] text-sm mb-4">
        {percentage.toFixed(0)}% correct
      </p>
      <p className="text-[var(--color-text-secondary)]">
        {interpretation}
      </p>
    </div>
  );
}

// HEXACO result display
interface HexacoScores {
  dimension?: string;
  score?: number;
}

function HexacoResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const dimensionScores = Array.isArray(scores) ? scores as HexacoScores[] : [];

  const dimensionColors: Record<string, string> = {
    'Honesty-Humility': 'var(--color-champagne)',
    'Emotionality': '#a888a8',
    'Extraversion': '#e8a87c',
    'Agreeableness': '#7cb8a8',
    'Conscientiousness': '#8899cc',
    'Openness': '#cc8899',
  };

  if (dimensionScores.length === 0) {
    return <GenericResultDisplay testType="hexaco" scores={scores} />;
  }

  return (
    <div className="card-premium rounded-lg p-8">
      <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-6 text-center">
        HEXACO Profile
      </h3>
      <div className="space-y-4">
        {dimensionScores.map((dim) => (
          <div key={dim.dimension} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-secondary)] text-sm">
                {dim.dimension}
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                {dim.score?.toFixed(2)} / 5
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((dim.score || 0) / 5) * 100}%`,
                  backgroundColor: dimensionColors[dim.dimension || ''] || 'var(--color-champagne)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mini-Test result display
interface MiniTestScores {
  dimensionScores?: { dimension: string; dimensionName: string; score: number; color: string }[];
}

function MiniTestResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as MiniTestScores;
  const dimensionScores = typedScores.dimensionScores || [];

  if (dimensionScores.length === 0) {
    return <GenericResultDisplay testType="mini_test" scores={scores} />;
  }

  return (
    <div className="card-premium rounded-lg p-8">
      <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-6 text-center">
        Mini-Test Results
      </h3>
      <div className="space-y-4">
        {dimensionScores.map((score) => (
          <div key={score.dimension} className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-tertiary)]">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: score.color }}
              />
              <span className="text-[var(--color-text-primary)] font-medium">
                {score.dimensionName}
              </span>
            </div>
            <span className="text-[var(--color-text-secondary)]">
              {score.score} / 5
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generic fallback display for unknown test types
function GenericResultDisplay({ testType, scores }: { testType: string; scores: Record<string, unknown> }) {
  return (
    <div className="card-premium rounded-lg p-8">
      <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-4">
        {testDisplayNames[testType] || testType} Results
      </h3>
      <pre className="text-[var(--color-text-secondary)] text-sm overflow-auto bg-[var(--color-bg-tertiary)] p-4 rounded">
        {JSON.stringify(scores, null, 2)}
      </pre>
    </div>
  );
}

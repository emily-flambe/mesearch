import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import BigFiveResults from '../components/BigFiveResults';
import type { BigFiveResults as BigFiveResultsType } from '../data/big-five-scoring';

interface PublicUser {
  username: string;
  display_name: string | null;
}

interface PublicResult {
  id: string;
  test_type: string;
  scores: Record<string, unknown>;
  completed_at: number;
}

interface PublicResultData {
  user: PublicUser;
  result: PublicResult;
}

export function PublicResultDetail() {
  const { username, id } = useParams<{ username: string; id: string }>();
  const [data, setData] = useState<PublicResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username && id) {
      fetchResult();
    }
  }, [username, id]);

  async function fetchResult() {
    try {
      const res = await fetch(`/p/${encodeURIComponent(username!)}/results/${encodeURIComponent(id!)}`);
      const json = await res.json() as { data: PublicResultData | null; error: { message: string; code: string } | null };

      if (!res.ok) {
        if (json.error?.code === 'NOT_FOUND') {
          setError('Result not found');
        } else if (json.error?.code === 'FORBIDDEN') {
          setError('This result is private');
        } else {
          setError(json.error?.message || 'Failed to load result');
        }
        return;
      }

      setData(json.data);
    } catch (err) {
      console.error('Failed to fetch result:', err);
      setError('Failed to load result');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function getTestDisplayName(testType: string) {
    const names: Record<string, string> = {
      enneagram: 'Enneagram',
      'big-five': 'Big Five',
      hexaco: 'HEXACO',
      mfq: 'Moral Foundations',
      sd3: 'Dark Triad',
      ecr: 'Attachment Style',
      crt: 'CRT',
      mbti: 'Myers-Briggs',
      'communication-styles': 'Communication Styles',
      rmet: 'RMET',
      mini_test: 'Mini-Test',
    };
    return names[testType] || testType;
  }

  function renderResultContent() {
    if (!data) return null;

    const { test_type, scores } = data.result;

    switch (test_type) {
      case 'big-five':
        return (
          <BigFiveResults
            initialResults={scores as unknown as BigFiveResultsType}
            showHeader={false}
            showActions={false}
          />
        );
      case 'mini_test':
        return <MiniTestResultDisplay scores={scores} />;
      case 'enneagram':
        return <EnneagramResultDisplay scores={scores} />;
      case 'hexaco':
        return <HexacoResultDisplay scores={scores} />;
      case 'mfq':
        return <MFQResultDisplay scores={scores} />;
      case 'sd3':
        return <SD3ResultDisplay scores={scores} />;
      case 'ecr':
        return <ECRResultDisplay scores={scores} />;
      case 'crt':
        return <CRTResultDisplay scores={scores} />;
      case 'mbti':
        return <MBTIResultDisplay scores={scores} />;
      case 'communication-styles':
        return <CommunicationStylesResultDisplay scores={scores} />;
      case 'rmet':
        return <RMETResultDisplay scores={scores} />;
      default:
        return (
          <div className="card-premium rounded-lg p-6">
            <h2 className="font-display text-lg text-[var(--color-text-primary)] mb-4">Results</h2>
            <pre className="text-[var(--color-text-secondary)] text-sm whitespace-pre-wrap overflow-auto">
              {JSON.stringify(scores, null, 2)}
            </pre>
          </div>
        );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            Mesearch
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)] transition-colors text-sm"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {error ? (
          <div className="card-premium rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[var(--color-border)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">{error}</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {error === 'Result not found'
                ? 'The result you are looking for does not exist.'
                : error === 'This result is private'
                ? 'This result has not been shared publicly.'
                : 'Something went wrong while loading this result.'}
            </p>
            <Link
              to={username ? `/u/${username}` : '/'}
              className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
            >
              {username ? 'Back to Profile' : 'Return Home'}
            </Link>
          </div>
        ) : data ? (
          <>
            <div className="mb-8">
              <Link
                to={`/u/${username}`}
                className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors text-sm mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {data.user.display_name || data.user.username}'s profile
              </Link>
              <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)]">
                {getTestDisplayName(data.result.test_type)}
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm mt-2">
                Completed by {data.user.display_name || data.user.username} on {formatDate(data.result.completed_at)}
              </p>
            </div>

            {renderResultContent()}
          </>
        ) : null}
      </main>
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
    return (
      <div className="card-premium rounded-lg p-6">
        <p className="text-[var(--color-text-muted)]">No detailed scores available.</p>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-lg p-6 space-y-4">
      <h3 className="font-display text-lg text-[var(--color-text-primary)] mb-4">Dimension Scores</h3>
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
  );
}

// Enneagram result display
interface EnneagramScores {
  primaryType?: number;
  wing?: number;
  wingLabel?: string;
  scores?: { type: number; percentage: number }[];
}

function EnneagramResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as EnneagramScores;
  const typeScores = typedScores.scores || [];

  const typeNames: Record<number, string> = {
    1: 'The Reformer',
    2: 'The Helper',
    3: 'The Achiever',
    4: 'The Individualist',
    5: 'The Investigator',
    6: 'The Loyalist',
    7: 'The Enthusiast',
    8: 'The Challenger',
    9: 'The Peacemaker',
  };

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      {typedScores.primaryType && (
        <div className="text-center mb-8">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Primary Type</p>
          <h3 className="font-display text-4xl font-medium text-[var(--color-text-primary)]">
            Type {typedScores.primaryType}
          </h3>
          <p className="text-gold-gradient text-xl">{typeNames[typedScores.primaryType]}</p>
          {typedScores.wingLabel && (
            <p className="text-[var(--color-text-muted)] text-sm mt-2">{typedScores.wingLabel}</p>
          )}
        </div>
      )}

      {typeScores.length > 0 && (
        <div>
          <h4 className="font-display text-lg text-[var(--color-text-primary)] mb-4">All Type Scores</h4>
          <div className="space-y-3">
            {typeScores
              .sort((a, b) => b.percentage - a.percentage)
              .map((score) => (
                <div key={score.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[var(--color-text-primary)]">
                      Type {score.type} - {typeNames[score.type]}
                    </span>
                    <span className="text-[var(--color-text-secondary)] text-sm">
                      {score.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score.percentage}%`,
                        backgroundColor: score.type === typedScores.primaryType ? 'var(--color-champagne)' : 'var(--color-text-muted)',
                        opacity: score.type === typedScores.primaryType ? 1 : 0.4,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {typeScores.length === 0 && !typedScores.primaryType && (
        <p className="text-[var(--color-text-muted)]">No detailed scores available.</p>
      )}
    </div>
  );
}

// HEXACO result display
interface HexacoScores {
  dimension?: string;
  score?: number;
  facetScores?: { facet: string; score: number }[];
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
    return (
      <div className="card-premium rounded-lg p-6">
        <p className="text-[var(--color-text-muted)]">No detailed scores available.</p>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      <h3 className="font-display text-lg text-[var(--color-text-primary)] mb-4">Dimension Scores</h3>
      {dimensionScores.map((dim) => (
        <div key={dim.dimension}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--color-text-primary)] font-medium">
              {dim.dimension}
            </span>
            <span className="text-[var(--color-text-secondary)] text-sm">
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
  );
}

// MFQ (Moral Foundations) result display
interface MFQScores {
  foundations?: { name: string; score: number; maxScore: number }[];
}

function MFQResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as MFQScores;
  const foundations = typedScores.foundations || [];

  const foundationColors: Record<string, string> = {
    'Care/Harm': '#f472b6',
    'Fairness/Cheating': '#22d3ee',
    'Loyalty/Betrayal': '#fbbf24',
    'Authority/Subversion': '#a78bfa',
    'Sanctity/Degradation': '#34d399',
  };

  if (foundations.length === 0) {
    return (
      <div className="card-premium rounded-lg p-6">
        <p className="text-[var(--color-text-muted)]">No detailed scores available.</p>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      <h3 className="font-display text-lg text-[var(--color-text-primary)] mb-4">Moral Foundations</h3>
      {foundations.map((foundation) => (
        <div key={foundation.name}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--color-text-primary)] font-medium">
              {foundation.name}
            </span>
            <span className="text-[var(--color-text-secondary)] text-sm">
              {foundation.score.toFixed(1)} / {foundation.maxScore}
            </span>
          </div>
          <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(foundation.score / foundation.maxScore) * 100}%`,
                backgroundColor: foundationColors[foundation.name] || 'var(--color-champagne)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// SD3 (Dark Triad) result display
interface SD3Scores {
  machiavellianism?: number;
  narcissism?: number;
  psychopathy?: number;
}

function SD3ResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as SD3Scores;

  const traits = [
    { name: 'Machiavellianism', score: typedScores.machiavellianism, color: '#a78bfa' },
    { name: 'Narcissism', score: typedScores.narcissism, color: '#fbbf24' },
    { name: 'Psychopathy', score: typedScores.psychopathy, color: '#f472b6' },
  ].filter(t => t.score !== undefined);

  if (traits.length === 0) {
    return (
      <div className="card-premium rounded-lg p-6">
        <p className="text-[var(--color-text-muted)]">No detailed scores available.</p>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      <h3 className="font-display text-lg text-[var(--color-text-primary)] mb-4">Dark Triad Traits</h3>
      {traits.map((trait) => (
        <div key={trait.name}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[var(--color-text-primary)] font-medium">
              {trait.name}
            </span>
            <span className="text-[var(--color-text-secondary)] text-sm">
              {trait.score?.toFixed(2)} / 5
            </span>
          </div>
          <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((trait.score || 0) / 5) * 100}%`,
                backgroundColor: trait.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ECR (Attachment Style) result display
interface ECRScores {
  anxiety?: number;
  avoidance?: number;
  style?: string;
}

function ECRResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as ECRScores;

  const styleDescriptions: Record<string, string> = {
    'Secure': 'Low anxiety, low avoidance - comfortable with intimacy and independence',
    'Anxious-Preoccupied': 'High anxiety, low avoidance - seeks closeness, fears rejection',
    'Dismissive-Avoidant': 'Low anxiety, high avoidance - values independence, avoids intimacy',
    'Fearful-Avoidant': 'High anxiety, high avoidance - desires closeness but fears it',
  };

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      {typedScores.style && (
        <div className="text-center mb-6">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Attachment Style</p>
          <h3 className="font-display text-2xl font-medium text-[var(--color-text-primary)]">
            {typedScores.style}
          </h3>
          <p className="text-[var(--color-text-muted)] text-sm mt-2">
            {styleDescriptions[typedScores.style] || ''}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {typedScores.anxiety !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--color-text-primary)] font-medium">Anxiety</span>
              <span className="text-[var(--color-text-secondary)] text-sm">
                {typedScores.anxiety.toFixed(2)} / 7
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(typedScores.anxiety / 7) * 100}%`,
                  backgroundColor: '#f472b6',
                }}
              />
            </div>
          </div>
        )}
        {typedScores.avoidance !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--color-text-primary)] font-medium">Avoidance</span>
              <span className="text-[var(--color-text-secondary)] text-sm">
                {typedScores.avoidance.toFixed(2)} / 7
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(typedScores.avoidance / 7) * 100}%`,
                  backgroundColor: '#22d3ee',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CRT result display
interface CRTScores {
  correct?: number;
  intuitive?: number;
  other?: number;
  total?: number;
  priorExposure?: boolean;
}

function CRTResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as CRTScores;

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      <div className="text-center mb-6">
        <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Score</p>
        <h3 className="font-display text-4xl font-medium text-[var(--color-text-primary)]">
          {typedScores.correct || 0} / {typedScores.total || 7}
        </h3>
        <p className="text-[var(--color-text-muted)] text-sm mt-2">Correct Answers</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-[var(--color-bg-tertiary)]">
          <p className="text-2xl font-medium text-green-400">{typedScores.correct || 0}</p>
          <p className="text-[var(--color-text-muted)] text-xs">Reflective</p>
        </div>
        <div className="p-4 rounded-lg bg-[var(--color-bg-tertiary)]">
          <p className="text-2xl font-medium text-amber-400">{typedScores.intuitive || 0}</p>
          <p className="text-[var(--color-text-muted)] text-xs">Intuitive</p>
        </div>
        <div className="p-4 rounded-lg bg-[var(--color-bg-tertiary)]">
          <p className="text-2xl font-medium text-[var(--color-text-secondary)]">{typedScores.other || 0}</p>
          <p className="text-[var(--color-text-muted)] text-xs">Other</p>
        </div>
      </div>

      {typedScores.priorExposure && (
        <p className="text-amber-400 text-sm text-center">
          Note: Prior exposure to these questions was indicated
        </p>
      )}
    </div>
  );
}

// MBTI result display
interface MBTIScores {
  type?: string;
  dimensions?: { dimension: string; preference: string; score: number }[];
}

function MBTIResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as MBTIScores;
  const dimensions = typedScores.dimensions || [];

  const dimensionLabels: Record<string, [string, string]> = {
    'E-I': ['Extraversion', 'Introversion'],
    'S-N': ['Sensing', 'Intuition'],
    'T-F': ['Thinking', 'Feeling'],
    'J-P': ['Judging', 'Perceiving'],
  };

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      {typedScores.type && (
        <div className="text-center mb-6">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Your Type</p>
          <h3 className="font-display text-4xl font-medium text-[var(--color-text-primary)]">
            {typedScores.type}
          </h3>
        </div>
      )}

      {dimensions.length > 0 && (
        <div className="space-y-4">
          {dimensions.map((dim) => {
            const [left, right] = dimensionLabels[dim.dimension] || [dim.dimension, dim.dimension];
            const isLeft = dim.preference === dim.dimension.split('-')[0];
            return (
              <div key={dim.dimension}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--color-text-secondary)] text-sm">{left}</span>
                  <span className="text-[var(--color-text-primary)] font-medium">{dim.preference}</span>
                  <span className="text-[var(--color-text-secondary)] text-sm">{right}</span>
                </div>
                <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.abs(dim.score) * 10}%`,
                      backgroundColor: 'var(--color-champagne)',
                      left: isLeft ? `${50 - Math.abs(dim.score) * 10}%` : '50%',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Communication Styles result display
interface CommunicationStylesScores {
  styles?: { name: string; score: number; maxScore: number }[];
  primary?: string;
}

function CommunicationStylesResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as CommunicationStylesScores;
  const styles = typedScores.styles || [];

  const styleColors: Record<string, string> = {
    'Words of Affirmation': '#fbbf24',
    'Quality Time': '#22d3ee',
    'Acts of Service': '#34d399',
    'Receiving Gifts': '#a78bfa',
    'Physical Touch': '#f472b6',
  };

  if (styles.length === 0) {
    return (
      <div className="card-premium rounded-lg p-6">
        <p className="text-[var(--color-text-muted)]">No detailed scores available.</p>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      {typedScores.primary && (
        <div className="text-center mb-6">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Primary Style</p>
          <h3 className="font-display text-2xl font-medium text-[var(--color-text-primary)]">
            {typedScores.primary}
          </h3>
        </div>
      )}

      <div className="space-y-4">
        {styles
          .sort((a, b) => b.score - a.score)
          .map((style) => (
            <div key={style.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--color-text-primary)] font-medium">{style.name}</span>
                <span className="text-[var(--color-text-secondary)] text-sm">
                  {style.score} / {style.maxScore}
                </span>
              </div>
              <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(style.score / style.maxScore) * 100}%`,
                    backgroundColor: styleColors[style.name] || 'var(--color-champagne)',
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// RMET result display
interface RMETScores {
  correct?: number;
  total?: number;
  percentage?: number;
}

function RMETResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as RMETScores;

  return (
    <div className="card-premium rounded-lg p-6 space-y-6">
      <div className="text-center">
        <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Score</p>
        <h3 className="font-display text-4xl font-medium text-[var(--color-text-primary)]">
          {typedScores.correct || 0} / {typedScores.total || 36}
        </h3>
        <p className="text-[var(--color-text-muted)] text-sm mt-2">
          {typedScores.percentage !== undefined ? `${typedScores.percentage.toFixed(0)}%` : ''} Correct
        </p>
      </div>

      <div className="h-3 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((typedScores.correct || 0) / (typedScores.total || 36)) * 100}%`,
            backgroundColor: 'var(--color-champagne)',
          }}
        />
      </div>

      <p className="text-[var(--color-text-secondary)] text-sm text-center">
        Reading the Mind in the Eyes Test measures the ability to identify emotions from facial expressions.
      </p>
    </div>
  );
}

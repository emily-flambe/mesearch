import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from '../components/UserMenu';
import BigFiveResults from '../components/BigFiveResults';
import { EnneagramResults } from '../components/EnneagramResults';
import HexacoResults from '../components/HexacoResults';
import ECRResults from '../components/ECRResults';
import MBTIResults from '../components/MBTIResults';
import MFQResults from '../components/MFQResults';
import SD3Results from '../components/SD3Results';
import LoveLanguagesResults from '../components/LoveLanguagesResults';
import RMETResults from '../components/RMETResults';
import CRTResultsComponent from '../components/CRTResults';
import type { BigFiveResults as BigFiveResultsType } from '../data/big-five-scoring';
import type { EnneagramResult } from '../data/enneagram-scoring';
import type { DimensionScore as HexacoDimensionScore } from '../data/hexaco-scoring';
import type { ECRResults as ECRResultsType } from '../data/ecr-scoring';
import type { MBTIResults as MBTIResultsType } from '../data/mbti-scoring';
import type { MFQResults as MFQResultsType } from '../data/mfq-scoring';
import type { SD3Results as SD3ResultsType } from '../data/sd3-scoring';
import type { CommunicationStylesResults } from '../data/love-languages-scoring';
import type { RMETResults as RMETResultsType } from '../data/rmet-scoring';
import type { CRTResults } from '../data/crt-scoring';

interface TestResult {
  id: string;
  test_type: string;
  scores: Record<string, unknown>;
  completed_at: number;
}

export function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && id) {
      fetchResult();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, id]);

  async function fetchResult() {
    try {
      const res = await fetch(`/api/results/${id}`, { credentials: 'include' });
      const data = await res.json() as { data: TestResult | null; error: { message: string } | null };

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
      mini_test: 'Mini-Test',
      ecr: 'Attachment Style',
      mbti: 'Myers-Briggs Type',
      mfq: 'Moral Foundations',
      sd3: 'Short Dark Triad',
      'communication-styles': 'Communication Styles',
      rmet: 'Reading the Mind in the Eyes',
      crt: 'Cognitive Reflection Test',
    };
    return names[testType] || testType;
  }

  function getRetakeUrl(testType: string) {
    const urls: Record<string, string> = {
      enneagram: '/test/enneagram',
      'big-five': '/test/big-five',
      hexaco: '/hexaco',
      mini_test: '/test/mini-test',
      ecr: '/test/ecr',
      mbti: '/test/mbti',
      mfq: '/test/mfq',
      sd3: '/test/sd3',
      'communication-styles': '/test/communication-styles',
      rmet: '/test/rmet',
      crt: '/test/crt',
    };
    return urls[testType] || '/';
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
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">Authentication Required</h2>
            <p className="text-[var(--color-text-secondary)]">
              Please sign in to view your results.
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
              This result could not be found or you don&apos;t have permission to view it.
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

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Back link */}
        <div className="mb-8">
          <Link
            to="/my-results"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Results History
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">
            Your Results
          </p>
          <h1 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-2 transition-colors duration-300">
            {getTestDisplayName(result.test_type)}
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Completed {formatDate(result.completed_at)}
          </p>
        </div>

        {/* Results display based on test type */}
        <div data-testid="result-detail-content">
          {result.test_type === 'mini_test' && (
            <div className="card-premium rounded-lg p-8">
              <MiniTestResultDisplay scores={result.scores} />
            </div>
          )}
          {result.test_type === 'big-five' && (
            <BigFiveResults
              initialResults={result.scores as unknown as BigFiveResultsType}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'enneagram' && (
            <EnneagramResults
              result={result.scores as unknown as EnneagramResult}
              onRetake={() => navigate(getRetakeUrl('enneagram'))}
              showActions={false}
            />
          )}
          {result.test_type === 'hexaco' && (
            <HexacoResults
              scores={result.scores as unknown as HexacoDimensionScore[]}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'ecr' && (
            <ECRResults
              initialResults={result.scores as unknown as ECRResultsType}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'mbti' && (
            <MBTIResults
              initialResults={result.scores as unknown as MBTIResultsType}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'mfq' && (
            <MFQResults
              initialResults={result.scores as unknown as MFQResultsType}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'sd3' && (
            <SD3Results
              initialResults={result.scores as unknown as SD3ResultsType}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'communication-styles' && (
            <LoveLanguagesResults
              initialResults={result.scores as unknown as CommunicationStylesResults}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'rmet' && (
            <RMETResults
              initialResults={result.scores as unknown as RMETResultsType}
              showHeader={false}
              showActions={false}
            />
          )}
          {result.test_type === 'crt' && (
            <CRTResultsComponent
              results={result.scores as unknown as CRTResults}
              onRetake={() => navigate(getRetakeUrl('crt'))}
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(getRetakeUrl(result.test_type))}
            className="btn-ghost px-8 py-3 rounded text-sm tracking-widest uppercase"
          >
            Retake Test
          </button>
          <Link
            to="/my-results"
            className="btn-gold px-8 py-3 rounded text-sm tracking-widest uppercase text-center"
          >
            View All Results
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
            to="/"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)] transition-colors text-sm"
          >
            Home
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}

// Mini-Test result display (kept as simple display since it's a debug test)
interface MiniTestScores {
  dimensionScores?: { dimension: string; dimensionName: string; score: number; color: string }[];
}

function MiniTestResultDisplay({ scores }: { scores: Record<string, unknown> }) {
  const typedScores = scores as MiniTestScores;
  const dimensionScores = typedScores.dimensionScores || [];

  if (dimensionScores.length === 0) {
    return <p className="text-[var(--color-text-muted)]">No detailed scores available.</p>;
  }

  return (
    <div className="space-y-4">
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

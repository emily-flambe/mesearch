import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
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
  const navigate = useNavigate();
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
      <Layout>
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
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  const retakeUrl = testUrls[result.test_type] || `/test/${result.test_type}`;

  return (
    <Layout>
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

        {/* Results display based on test type - using full Results components */}
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
              onRetake={() => navigate(retakeUrl)}
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
              onRetake={() => navigate(retakeUrl)}
            />
          )}
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
    </Layout>
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

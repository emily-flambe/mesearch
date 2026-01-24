import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

export function PublicResultDetail() {
  const { username, id } = useParams<{ username: string; id: string }>();
  const navigate = useNavigate();
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

  function renderResultContent() {
    if (!data) return null;

    const { test_type, scores } = data.result;
    const retakeUrl = testUrls[test_type] || `/test/${test_type}`;

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
        return (
          <div className="card-premium rounded-lg p-8">
            <MiniTestResultDisplay scores={scores} />
          </div>
        );
      case 'enneagram':
        return (
          <EnneagramResults
            result={scores as unknown as EnneagramResult}
            onRetake={() => navigate(retakeUrl)}
            showActions={false}
          />
        );
      case 'hexaco':
        return (
          <HexacoResults
            scores={scores as unknown as HexacoDimensionScore[]}
            showHeader={false}
            showActions={false}
          />
        );
      case 'ecr':
        return (
          <ECRResults
            initialResults={scores as unknown as ECRResultsType}
            showHeader={false}
            showActions={false}
          />
        );
      case 'mbti':
        return (
          <MBTIResults
            initialResults={scores as unknown as MBTIResultsType}
            showHeader={false}
            showActions={false}
          />
        );
      case 'mfq':
        return (
          <MFQResults
            initialResults={scores as unknown as MFQResultsType}
            showHeader={false}
            showActions={false}
          />
        );
      case 'sd3':
        return (
          <SD3Results
            initialResults={scores as unknown as SD3ResultsType}
            showHeader={false}
            showActions={false}
          />
        );
      case 'communication-styles':
        return (
          <LoveLanguagesResults
            initialResults={scores as unknown as CommunicationStylesResults}
            showHeader={false}
            showActions={false}
          />
        );
      case 'rmet':
        return (
          <RMETResults
            initialResults={scores as unknown as RMETResultsType}
            showHeader={false}
            showActions={false}
          />
        );
      case 'crt':
        return (
          <CRTResultsComponent
            results={scores as unknown as CRTResults}
            onRetake={() => navigate(retakeUrl)}
          />
        );
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
    <Layout>
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
              <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">
                {testDisplayNames[data.result.test_type] || data.result.test_type}
              </p>
              <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)]">
                Result Details
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm mt-2">
                Completed by {data.user.display_name || data.user.username} on {formatDate(data.result.completed_at)}
              </p>
            </div>

            <div data-testid="public-result-detail-content">
              {renderResultContent()}
            </div>
          </>
        ) : null}
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

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
      const res = await fetch(`/api/u/${encodeURIComponent(username!)}/results/${encodeURIComponent(id!)}`);
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

            {/* Render full result component based on test type */}
            {data.result.test_type === 'big-five' && (
              <BigFiveResults
                initialResults={data.result.scores as unknown as BigFiveResultsType}
                showHeader={false}
                showActions={false}
              />
            )}

            {/* Fallback for other test types - show raw scores for now */}
            {data.result.test_type !== 'big-five' && (
              <div className="card-premium rounded-lg p-6">
                <h2 className="font-display text-lg text-[var(--color-text-primary)] mb-4">Results</h2>
                <pre className="text-[var(--color-text-secondary)] text-sm whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(data.result.scores, null, 2)}
                </pre>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

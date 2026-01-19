import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from '../components/UserMenu';

interface TestResult {
  id: string;
  test_type: string;
  scores: Record<string, unknown>;
  completed_at: number;
}

export function ResultsHistory() {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchResults();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  async function fetchResults() {
    try {
      const res = await fetch('/api/results', { credentials: 'include' });
      const data = await res.json() as { data: TestResult[] | null; error: { message: string } | null };

      if (!res.ok) {
        setError(data.error?.message || 'Failed to load results');
        return;
      }

      setResults(data.data || []);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to load results');
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
    };
    return names[testType] || testType;
  }

  if (authLoading || loading) {
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
            <UserMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Your Journey</p>
          <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)]">
            Results History
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!user ? (
          <div className="card-premium rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[var(--color-champagne)]/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-champagne)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">Authentication Required</h2>
            <p className="text-[var(--color-text-secondary)]">
              Use the link in the header to view and track your personality test results over time.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="card-premium rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[var(--color-champagne)]/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-champagne)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">No Results Yet</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Complete a personality test to see your results here.
            </p>
            <Link
              to="/#tests"
              className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
            >
              Take a Test
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="card-premium rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg text-[var(--color-text-primary)]">
                      {getTestDisplayName(result.test_type)}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-sm">
                      Completed {formatDate(result.completed_at)}
                    </p>
                  </div>
                  <Link
                    to={`/results/${result.id}`}
                    className="btn-ghost px-4 py-2 rounded text-xs tracking-wider uppercase"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

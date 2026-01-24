import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from '../components/UserMenu';

interface TestResult {
  id: string;
  test_type: string;
  scores: Record<string, unknown>;
  completed_at: number;
  is_public: boolean;
}

interface Profile {
  is_public: boolean;
  username: string | null;
}

export function ResultsHistory() {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showProfileMessage, setShowProfileMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchResults();
      fetchProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      const data = await res.json() as { data: Profile | null };
      if (res.ok && data.data) {
        setProfile(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }

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
      mfq: 'Moral Foundations',
      sd3: 'Dark Triad',
      ecr: 'Attachment Style',
      crt: 'CRT',
      mbti: 'Myers-Briggs',
      'communication-styles': 'Communication Styles',
      rmet: 'RMET',
    };
    return names[testType] || testType;
  }

  async function toggleVisibility(resultId: string, currentVisibility: boolean) {
    try {
      const res = await fetch(`/api/results/${resultId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_public: !currentVisibility }),
      });

      if (res.ok) {
        setResults((prev) =>
          prev.map((r) =>
            r.id === resultId ? { ...r, is_public: !currentVisibility } : r
          )
        );

        // Show message if making result public but profile is private
        if (!currentVisibility && profile && !profile.is_public) {
          setShowProfileMessage(resultId);
          // Auto-dismiss after 5 seconds
          setTimeout(() => setShowProfileMessage(null), 5000);
        }
      }
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  }

  async function copyShareLink(resultId: string) {
    if (!profile?.username) return;

    const url = `${window.location.origin}/u/${profile.username}/results/${resultId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(resultId);
      // Auto-clear after 2 seconds
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
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
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg text-[var(--color-text-primary)]">
                        {getTestDisplayName(result.test_type)}
                      </h3>
                      {result.is_public && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm">
                      Completed {formatDate(result.completed_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(result.id, result.is_public)}
                      className={`px-3 py-1.5 rounded text-xs transition-colors ${
                        result.is_public
                          ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-red-500/10 hover:text-red-400'
                          : 'bg-[var(--color-champagne)]/10 text-[var(--color-champagne)] hover:bg-[var(--color-champagne)]/20'
                      }`}
                      title={result.is_public ? 'Make private' : 'Make public'}
                    >
                      {result.is_public ? 'Hide' : 'Share'}
                    </button>
                    {result.is_public && profile?.username && (
                      <button
                        onClick={() => copyShareLink(result.id)}
                        className={`px-3 py-1.5 rounded text-xs transition-colors inline-flex items-center gap-1.5 ${
                          copiedId === result.id
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)]'
                        }`}
                        title="Copy share link"
                      >
                        {copiedId === result.id ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy Link
                          </>
                        )}
                      </button>
                    )}
                    <Link
                      to={`/results/${result.id}`}
                      className="btn-ghost px-4 py-2 rounded text-xs tracking-wider uppercase"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                {/* Profile visibility message */}
                {showProfileMessage === result.id && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                    <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-amber-400/90 text-xs">
                      Your profile is private. <Link to="/settings" className="underline hover:text-amber-300">Make your profile public</Link> for others to see your shared results.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

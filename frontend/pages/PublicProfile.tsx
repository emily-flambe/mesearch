import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface PublicUser {
  username: string;
  display_name: string | null;
  created_at: number;
}

interface PublicResult {
  id: string;
  test_type: string;
  scores: Record<string, unknown>;
  completed_at: number;
}

interface PublicProfileData {
  user: PublicUser;
  results: PublicResult[];
}

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  async function fetchProfile() {
    try {
      const res = await fetch(`/api/u/${encodeURIComponent(username!)}`);
      const json = await res.json() as { data: PublicProfileData | null; error: { message: string; code: string } | null };

      if (!res.ok) {
        if (json.error?.code === 'NOT_FOUND') {
          setError('User not found');
        } else if (json.error?.code === 'FORBIDDEN') {
          setError('This profile is private');
        } else {
          setError(json.error?.message || 'Failed to load profile');
        }
        return;
      }

      setData(json.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
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
              {error === 'User not found'
                ? 'The username you are looking for does not exist.'
                : error === 'This profile is private'
                ? 'This user has chosen to keep their profile private.'
                : 'Something went wrong while loading this profile.'}
            </p>
            <Link
              to="/"
              className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
            >
              Return Home
            </Link>
          </div>
        ) : data ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-champagne)]/20 border border-[var(--color-champagne)]/40 flex items-center justify-center">
                  <span className="text-[var(--color-champagne)] text-2xl font-medium">
                    {(data.user.display_name || data.user.username)[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)]">
                    {data.user.display_name || data.user.username}
                  </h1>
                  <p className="text-[var(--color-text-muted)] text-sm">
                    @{data.user.username} · Member since {formatDate(data.user.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {data.results.length === 0 ? (
              <div className="card-premium rounded-lg p-12 text-center">
                <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">No Public Results</h2>
                <p className="text-[var(--color-text-secondary)]">
                  This user hasn't shared any results publicly yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display text-lg text-[var(--color-text-primary)] mb-4">
                  Public Results ({data.results.length})
                </h2>
                {data.results.map((result) => (
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
                        to={`/u/${username}/results/${result.id}`}
                        className="btn-ghost px-4 py-2 rounded text-xs tracking-wider uppercase"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

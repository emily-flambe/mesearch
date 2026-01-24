import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from '../components/UserMenu';

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  username: string | null;
  is_public: boolean;
}

export function Settings() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      const data = await res.json() as { data: Profile | null; error: { message: string } | null };

      if (!res.ok) {
        setError(data.error?.message || 'Failed to load profile');
        return;
      }

      if (data.data) {
        setProfile(data.data);
        setDisplayName(data.data.display_name || '');
        setUsername(data.data.username || '');
        setIsPublic(data.data.is_public);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function checkUsername(value: string) {
    if (!value || value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const res = await fetch(`/api/profile/check-username/${encodeURIComponent(value)}`, {
        credentials: 'include',
      });
      const data = await res.json() as { data: { available: boolean; reason: string | null } };
      setUsernameAvailable(data.data.available);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username !== profile?.username) {
        checkUsername(username);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, profile?.username]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          display_name: displayName || null,
          username: username || null,
          is_public: isPublic,
        }),
      });

      const data = await res.json() as { data: Profile | null; error: { message: string; code: string } | null };

      if (!res.ok) {
        setError(data.error?.message || 'Failed to save profile');
        return;
      }

      if (data.data) {
        setProfile(data.data);
        setSuccess('Profile updated successfully');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
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

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-2">Account</p>
          <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)]">
            Settings
          </h1>
        </div>

        {!user ? (
          <div className="card-premium rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[var(--color-champagne)]/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-champagne)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-[var(--color-text-primary)] mb-2">Authentication Required</h2>
            <p className="text-[var(--color-text-secondary)]">
              Sign in to manage your profile settings.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <div className="card-premium rounded-lg p-6 space-y-6">
              <h2 className="font-display text-lg text-[var(--color-text-primary)]">Profile Information</h2>

              <div>
                <label htmlFor="email" className="block text-sm text-[var(--color-text-secondary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] opacity-60"
                />
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm text-[var(--color-text-secondary)] mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-champagne)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm text-[var(--color-text-secondary)] mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="your-username"
                    pattern="[a-z0-9][a-z0-9-]{1,28}[a-z0-9]"
                    className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-champagne)] focus:outline-none transition-colors"
                  />
                  {checkingUsername && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">
                      Checking...
                    </span>
                  )}
                  {!checkingUsername && usernameAvailable === true && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-sm">
                      Available
                    </span>
                  )}
                  {!checkingUsername && usernameAvailable === false && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-sm">
                      Taken
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  3-30 characters, lowercase letters, numbers, and hyphens only. This will be your public profile URL.
                </p>
              </div>
            </div>

            <div className="card-premium rounded-lg p-6 space-y-6">
              <h2 className="font-display text-lg text-[var(--color-text-primary)]">Privacy Settings</h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--color-text-primary)] text-sm font-medium">Public Profile</p>
                  <p className="text-[var(--color-text-muted)] text-xs mt-1">
                    Allow others to view your profile and public results
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPublic}
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isPublic ? 'bg-[var(--color-champagne)]' : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      isPublic ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {isPublic && username && (
                <div className="p-4 bg-[var(--color-champagne)]/10 border border-[var(--color-champagne)]/30 rounded-lg">
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Your public profile will be available at:{' '}
                    <Link
                      to={`/u/${username}`}
                      className="text-[var(--color-champagne)] hover:underline"
                    >
                      {window.location.origin}/u/{username}
                    </Link>
                  </p>
                </div>
              )}

              {isPublic && !username && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-400 text-sm">
                    Set a username to enable your public profile URL.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving || (usernameAvailable === false)}
              className="btn-gold w-full py-4 rounded text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function UserMenu() {
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] animate-pulse" />
    );
  }

  if (!user) {
    // For local dev, use dev-login; for production, use /api/auth/login
    // which is protected by Cloudflare Access and will trigger authentication
    const isLocalDev = window.location.hostname === 'localhost';
    const loginUrl = isLocalDev ? '/api/auth/dev-login' : '/api/auth/login';

    return (
      <a
        href={loginUrl}
        className="text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)] transition-colors duration-300 text-sm tracking-wide uppercase"
      >
        Sign In
      </a>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            className="w-8 h-8 rounded-full border border-[var(--color-border)]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--color-champagne)]/20 border border-[var(--color-champagne)]/40 flex items-center justify-center">
            <span className="text-[var(--color-champagne)] text-sm font-medium">
              {(user.display_name || user.email)[0].toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-[var(--color-border)]">
            <p className="text-[var(--color-text-primary)] text-sm font-medium truncate">
              {user.display_name || 'User'}
            </p>
            <p className="text-[var(--color-text-muted)] text-xs truncate">
              {user.email}
            </p>
          </div>
          <Link
            to="/my-results"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            My Results
          </Link>
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Settings
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

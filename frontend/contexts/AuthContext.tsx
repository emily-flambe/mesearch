import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json() as { data: User | null; error: { message: string } | null };
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<{ error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json() as { data: User | null; error: { message: string } | null };

      if (!res.ok) {
        return { error: data.error?.message || 'Login failed' };
      }

      setUser(data.data);
      return {};
    } catch (err) {
      console.error('Login failed:', err);
      return { error: 'Network error' };
    }
  }

  async function register(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await res.json() as { data: User | null; error: { message: string } | null };

      if (!res.ok) {
        return { error: data.error?.message || 'Registration failed' };
      }

      setUser(data.data);
      return {};
    } catch (err) {
      console.error('Registration failed:', err);
      return { error: 'Network error' };
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

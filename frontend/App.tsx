import { Routes, Route, Link } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';

// Theme Context
type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mesearch-theme');
      return (saved as Theme) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('mesearch-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

// Theme Toggle Button
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        // Sun icon for switching to light
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon icon for switching to dark
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors duration-300"
      aria-label="View on GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            Mēsearch
          </h1>
          <nav className="flex items-center gap-6">
            <a
              href="#tests"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)] transition-colors duration-300 text-sm tracking-wide uppercase"
            >
              Tests
            </a>
            <a
              href="#about"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-champagne)] transition-colors duration-300 text-sm tracking-wide uppercase"
            >
              About
            </a>
            <div className="w-px h-5 bg-[var(--color-border)]" />
            <ThemeToggle />
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto max-w-6xl px-6 py-32 text-center overflow-hidden">
          {/* Subtle gradient orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[var(--color-accent-purple)] via-transparent to-transparent opacity-60 pointer-events-none" />

          <p className="text-[var(--color-champagne)] text-sm tracking-[0.3em] uppercase mb-6 font-medium">
            Personality Assessment
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-[var(--color-text-primary)] mb-8 leading-tight tracking-tight transition-colors duration-300">
            Understand Yourself
            <span className="block text-gold-gradient italic mt-2">With Clarity</span>
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed font-light transition-colors duration-300">
            Scientifically-backed personality assessments designed to reveal insights
            across multiple psychological frameworks. Track your evolution over time.
          </p>
          <a
            href="#tests"
            className="btn-gold inline-block px-10 py-4 rounded text-sm tracking-widest uppercase"
          >
            Explore Tests
          </a>
        </section>

        {/* Divider */}
        <div className="divider-elegant mx-auto max-w-md" />

        {/* Tests Section */}
        <section id="tests" className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">Assessments</p>
            <h3 className="font-display text-4xl font-medium text-[var(--color-text-primary)] transition-colors duration-300">Featured Tests</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestCard
              title="Big Five"
              subtitle="IPIP-NEO"
              slug="big-five"
              keywords={['Traits', 'Behavior', 'Stability']}
              description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
              time="15 min"
              seriousness={5}
              fun={3}
            />
            <TestCard
              title="HEXACO"
              subtitle="Six Dimensions"
              slug="hexaco"
              keywords={['Ethics', 'Honesty', 'Integrity']}
              description="Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct with precision."
              time="12 min"
              seriousness={5}
              fun={2}
            />
            <TestCard
              title="Enneagram"
              subtitle="Nine Types"
              slug="enneagram"
              keywords={['Motivations', 'Growth', 'Archetypes']}
              description="Explore your core motivations through nine distinct personality archetypes. Renowned for personal growth insights."
              time="10 min"
              seriousness={2}
              fun={5}
            />
          </div>
        </section>

        {/* Divider */}
        <div className="divider-elegant mx-auto max-w-md" />

        {/* About Section */}
        <section id="about" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-accent-purple)] to-[var(--color-bg-primary)] opacity-50 transition-colors duration-300" />
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">Methodology</p>
            <h3 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-6 transition-colors duration-300">
              The Science Behind It
            </h3>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-light transition-colors duration-300">
              Each test is rated on two dimensions: Seriousness reflects the depth of research
              supporting its validity, while Fun captures how engaging the experience is.
              Some tests excel at both.
            </p>
            <div className="flex justify-center gap-16">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[var(--color-text-secondary)] text-sm">Seriousness</span>
                  <RatingDots value={5} />
                </div>
                <p className="text-[var(--color-text-muted)] text-sm transition-colors duration-300">Strong empirical support</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[var(--color-text-secondary)] text-sm">Fun</span>
                  <RatingDots value={5} />
                </div>
                <p className="text-[var(--color-text-muted)] text-sm transition-colors duration-300">Engaging and enjoyable</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-12 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-xl text-gold-gradient mb-4">Mēsearch</p>
          <p className="text-[var(--color-text-muted)] text-sm tracking-wide transition-colors duration-300">
            Built with science. Designed for insight.
          </p>
          <p className="text-[var(--color-text-muted)]/50 text-xs mt-4">&copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}

function RatingDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < value
              ? 'bg-[var(--color-champagne)]'
              : 'bg-[var(--color-border)]'
          }`}
        />
      ))}
    </div>
  );
}

function TestCard({
  title,
  subtitle,
  slug,
  keywords,
  description,
  time,
  seriousness,
  fun,
}: {
  title: string;
  subtitle: string;
  slug: string;
  keywords: string[];
  description: string;
  time: string;
  seriousness: number;
  fun: number;
}) {
  return (
    <div className="card-premium rounded-lg p-8 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Seriousness</span>
            <RatingDots value={seriousness} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Fun</span>
            <RatingDots value={fun} />
          </div>
        </div>
        <span className="text-[var(--color-text-muted)] text-xs tracking-wide">{time}</span>
      </div>
      <h4 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-1 transition-colors duration-300">{title}</h4>
      <p className="text-[var(--color-champagne)]/70 text-sm mb-4 tracking-wide">{subtitle}</p>
      <p className="text-[var(--color-text-muted)] text-xs mb-3 tracking-wide">
        {keywords.join(' · ')}
      </p>
      <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed transition-colors duration-300">{description}</p>
      <Link
        to={`/test/${slug}`}
        className="btn-ghost block w-full py-3 rounded text-center text-xs tracking-widest uppercase"
      >
        Begin Assessment
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            Mēsearch
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <GitHubIcon />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="card-premium rounded-lg p-12">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-[var(--color-champagne)]/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--color-champagne)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">In Development</p>
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">Coming Soon</h2>
          <p className="text-[var(--color-text-secondary)] mb-10 leading-relaxed transition-colors duration-300">
            We are meticulously crafting this assessment to ensure
            the highest standards of accuracy and insight.
          </p>
          <Link
            to="/"
            className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test/:slug" element={<TestPage />} />
      </Routes>
    </ThemeProvider>
  );
}

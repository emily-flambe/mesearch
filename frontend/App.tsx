import { Routes, Route, Link, useParams } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';
import HexacoAssessment from './components/HexacoAssessment';
import HexacoResults from './components/HexacoResults';
import { HexacoResponse, calculateScores, DimensionScore } from './data/hexaco-scoring';
import BigFiveAssessment from './components/BigFiveAssessment';
import BigFiveResults from './components/BigFiveResults';
import { enneagramItems, likertScale, type LikertValue } from './data/enneagram-items';
import { calculateEnneagramResult, type EnneagramResult } from './data/enneagram-scoring';
import { EnneagramResults } from './components/EnneagramResults';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FeatureFlagsProvider, useFeatureFlags } from './contexts/FeatureFlagsContext';
import { UserMenu } from './components/UserMenu';
import { ResultsHistory } from './pages/ResultsHistory';
import MiniTestAssessment from './components/MiniTestAssessment';
import LoveLanguagesAssessment from './components/LoveLanguagesAssessment';
import LoveLanguagesResults from './components/LoveLanguagesResults';

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
  const { flags } = useFeatureFlags();

  return (
    <div id="top" className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <a href="#top" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            Mesearch
          </a>
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
            <UserMenu />
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

          <h2 className="font-display text-6xl md:text-7xl lg:text-8xl font-medium text-[var(--color-text-primary)] mb-8 leading-tight tracking-tight transition-colors duration-300">
            Do Research
            <span className="block text-gold-gradient italic mt-2 text-4xl md:text-5xl lg:text-6xl">On Yourself</span>
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed font-light transition-colors duration-300">
            Scientifically-backed and/or bullshit personality assessments designed to reveal insights
            across multiple psychological frameworks and/or waste your time.
          </p>
          <div className="flex justify-center mb-12">
            <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2 font-light transition-colors duration-300 text-left">
              <li>Track your evolution over time.</li>
              <li>Argue with your friends and lovers about whether Myers-Briggs is bullshit.</li>
              <li>Generate filler for your Tinder profile.</li>
              <li>Question the nature of your reality.</li>
            </ul>
          </div>
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
        <section id="tests" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-24">
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
              link="/hexaco"
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
            <TestCard
              title="Communication Styles"
              subtitle="Five Styles"
              slug="communication-styles"
              keywords={['Relationships', 'Appreciation', 'Connection']}
              description="Discover how you prefer to give and receive appreciation. Learn your primary style for deeper connections."
              time="5 min"
              seriousness={2}
              fun={5}
            />
          </div>

          {/* Mini-Test - Admin/Test Users Only */}
          {flags.mini_test && (
            <div className="mt-8" data-testid="mini-test-section">
              <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs tracking-wide uppercase">
                  Debug / Testing Only
                </span>
              </div>
              <div className="max-w-md mx-auto">
                <TestCard
                  title="Mini-Test"
                  subtitle="5 Questions"
                  slug="mini-test"
                  keywords={['Debug', 'Testing', 'Quick']}
                  description="A 5-question sampler for debugging and automated testing. One question from each Big Five dimension."
                  time="1 min"
                  seriousness={1}
                  fun={1}
                />
              </div>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="divider-elegant mx-auto max-w-md" />

        {/* About Section */}
        <section id="about" className="relative py-24 overflow-hidden scroll-mt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-accent-purple)] to-[var(--color-bg-primary)] opacity-50 transition-colors duration-300" />
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">Methodology</p>
            <h3 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-6 transition-colors duration-300">
              The Science Behind It
            </h3>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-light transition-colors duration-300">
              Each test is rated on two dimensions: Seriousness reflects the depth of research
              supporting its validity, while Fun captures how engaging the experience is.
              Some tests excel at both. Some tests are dogshit. We decide, you report!
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
          <p className="font-display text-xl text-gold-gradient mb-4">Mesearch</p>
          <p className="text-[var(--color-text-muted)]/50 text-xs">&copy; 2026</p>
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
  link,
}: {
  title: string;
  subtitle: string;
  slug: string;
  keywords: string[];
  description: string;
  time: string;
  seriousness: number;
  fun: number;
  link?: string;
}) {
  const href = link || `/test/${slug}`;
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
        to={href}
        className="btn-ghost block w-full py-3 rounded text-center text-xs tracking-widest uppercase"
      >
        Begin Assessment
      </Link>
    </div>
  );
}

// Generic placeholder for tests not yet implemented
function ComingSoonTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            Mesearch
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

// Enneagram Assessment Page
type EnneagramPhase = 'intro' | 'questions' | 'results';

function EnneagramTestPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<EnneagramPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, LikertValue>>({});
  const [result, setResult] = useState<EnneagramResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const totalQuestions = enneagramItems.length;
  const currentItem = enneagramItems[currentQuestion];

  // Save results to backend if user is logged in
  async function saveResults(calculatedResult: EnneagramResult) {
    if (!user) return;

    setSaveStatus('saving');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          test_type: 'enneagram',
          scores: calculatedResult,
        }),
      });

      if (res.ok) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }

  const handleAnswer = (value: LikertValue) => {
    setResponses((prev) => ({ ...prev, [currentItem.id]: value }));

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Calculate results
        const calculatedResult = calculateEnneagramResult({
          ...responses,
          [currentItem.id]: value,
        });
        setResult(calculatedResult);
        setPhase('results');
        // Auto-save if logged in
        saveResults(calculatedResult);
      }
    }, 200);
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentQuestion(0);
    setResponses({});
    setResult(null);
    setSaveStatus('idle');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            Mesearch
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <GitHubIcon />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {phase === 'intro' && (
          <div className="text-center">
            <div className="card-premium rounded-lg p-12">
              <p className="text-[var(--color-discovery)] text-xs tracking-[0.3em] uppercase mb-4">
                Self-Discovery Tool
              </p>
              <h1 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
                Enneagram Assessment
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed max-w-lg mx-auto transition-colors duration-300">
                Explore your core motivations through nine distinct personality archetypes.
                This assessment will help you understand your patterns of thinking, feeling, and behaving.
              </p>

              <div className="bg-[var(--color-discovery)]/10 border border-[var(--color-discovery-border)] rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
                <p className="text-[var(--color-discovery)] text-sm font-medium mb-1">
                  Important Note
                </p>
                <p className="text-[var(--color-text-muted)] text-xs">
                  The Enneagram is a popular framework for self-reflection but lacks scientific validation.
                  Use these results for personal exploration, not diagnosis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~10 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{totalQuestions} questions</span>
                </div>
              </div>

              <button
                onClick={() => setPhase('questions')}
                className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
              >
                Begin Assessment
              </button>
            </div>
          </div>
        )}

        {phase === 'questions' && currentItem && (
          <div>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-2">
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-1 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-champagne)] transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="card-premium rounded-lg p-8 md:p-12">
              <p className="font-display text-2xl md:text-3xl text-[var(--color-text-primary)] mb-10 leading-relaxed text-center transition-colors duration-300">
                {currentItem.text}
              </p>

              {/* Likert scale */}
              <div className="space-y-3">
                {likertScale.map((option) => {
                  const isSelected = responses[currentItem.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[var(--color-champagne)] bg-[var(--color-champagne)]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-champagne)]/50 hover:bg-[var(--color-bg-tertiary)]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[var(--color-champagne)] bg-[var(--color-champagne)]'
                              : 'border-[var(--color-text-muted)]'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-[var(--color-bg-primary)]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            isSelected
                              ? 'text-[var(--color-champagne)]'
                              : 'text-[var(--color-text-secondary)]'
                          } transition-colors`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation hint */}
            <p className="text-center text-[var(--color-text-muted)] text-xs mt-6">
              Select an option to continue
            </p>
          </div>
        )}

        {phase === 'results' && result && (
          <EnneagramResults result={result} onRetake={handleRetake} />
        )}
      </main>
    </div>
  );
}

// Route handler that decides which test to show
function TestRouter() {
  const { slug } = useParams<{ slug: string }>();
  const { flags } = useFeatureFlags();

  if (slug === 'enneagram') {
    return <EnneagramTestPage />;
  }

  if (slug === 'communication-styles') {
    return <LoveLanguagesAssessment />;
  }

  if (slug === 'mini-test') {
    // Only allow access if feature flag is enabled
    if (!flags.mini_test) {
      return <ComingSoonTestPage />;
    }
    return <MiniTestAssessment />;
  }

  // All other tests show coming soon
  return <ComingSoonTestPage />;
}

export default function App() {
  const [hexacoScores, setHexacoScores] = useState<DimensionScore[] | null>(null);

  const handleHexacoComplete = (responses: HexacoResponse[]) => {
    const scores = calculateScores(responses);
    setHexacoScores(scores);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <FeatureFlagsProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-results" element={<ResultsHistory />} />
            <Route path="/test/big-five" element={<BigFiveAssessment />} />
            <Route path="/test/big-five/results" element={<BigFiveResults />} />
            <Route path="/test/communication-styles" element={<LoveLanguagesAssessment />} />
            <Route path="/test/communication-styles/results" element={<LoveLanguagesResults />} />
            <Route path="/test/:slug" element={<TestRouter />} />
            <Route
              path="/hexaco"
              element={<HexacoAssessment onComplete={handleHexacoComplete} />}
            />
            <Route
              path="/hexaco/results"
              element={<HexacoResults scores={hexacoScores} />}
            />
          </Routes>
        </FeatureFlagsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

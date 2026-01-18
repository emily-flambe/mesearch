import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/70 hover:text-white transition-colors"
      aria-label="View on GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
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
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="blur-shape w-96 h-96 bg-pink-400 top-20 -left-48" />
      <div className="blur-shape w-80 h-80 bg-purple-500 top-1/3 right-0" />
      <div className="blur-shape w-64 h-64 bg-blue-400 bottom-20 left-1/4" />
      <div className="blur-shape w-72 h-72 bg-indigo-500 bottom-0 right-1/3" />

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-tight">MeSearch</h1>
          <nav className="flex items-center gap-8">
            <a
              href="#tests"
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Tests
            </a>
            <a
              href="#about"
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              About
            </a>
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-6 py-32 text-center">
          <div className="glass-strong rounded-3xl p-12 max-w-3xl mx-auto inner-glow relative">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Understand Yourself Better
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Take scientifically-backed personality assessments, track your results over time,
              and discover insights across multiple frameworks.
            </p>
            <a
              href="#tests"
              className="btn-accent inline-block text-white px-10 py-4 rounded-xl text-lg font-semibold"
            >
              Explore Tests
            </a>
          </div>
        </section>

        {/* Tests Section */}
        <section id="tests" className="mx-auto max-w-6xl px-6 py-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Featured Tests
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <TestCard
              title="Big Five (IPIP-NEO)"
              slug="big-five"
              description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
              time="15 min"
              badge="research"
            />
            <TestCard
              title="HEXACO"
              slug="hexaco"
              description="Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct."
              time="12 min"
              badge="research"
            />
            <TestCard
              title="Enneagram"
              slug="enneagram"
              description="Explore your core motivations through 9 personality types. Popular for personal growth and self-discovery."
              time="10 min"
              badge="discovery"
            />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="glass-strong rounded-3xl p-12 text-center inner-glow relative">
              <h3 className="text-3xl font-bold text-white mb-6">
                The Science Behind It
              </h3>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                We prioritize scientifically validated assessments. Each test is labeled with its
                research backing so you know exactly what you're getting.
              </p>
              <div className="flex justify-center gap-12">
                <div className="text-center">
                  <span className="inline-block bg-emerald-500/80 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-semibold mb-3">
                    Research-Backed
                  </span>
                  <p className="text-white/70 text-sm">Strong empirical support</p>
                </div>
                <div className="text-center">
                  <span className="inline-block bg-violet-500/80 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-semibold mb-3">
                    Self-Discovery
                  </span>
                  <p className="text-white/70 text-sm">Popular for reflection</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass relative z-10 mt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center">
          <p className="text-white/60">
            2025 MeSearch. Built with science, designed for insight.
          </p>
        </div>
      </footer>
    </div>
  );
}

type BadgeType = 'research' | 'popular' | 'discovery';

function TestCard({
  title,
  slug,
  description,
  time,
  badge,
}: {
  title: string;
  slug: string;
  description: string;
  time: string;
  badge: BadgeType;
}) {
  const badgeStyles: Record<BadgeType, { bg: string; label: string }> = {
    research: { bg: 'bg-emerald-500/80', label: 'Research-Backed' },
    popular: { bg: 'bg-blue-500/80', label: 'Popular Assessment' },
    discovery: { bg: 'bg-violet-500/80', label: 'Self-Discovery' },
  };

  const { bg, label } = badgeStyles[badge];

  return (
    <div className="glass-strong rounded-2xl p-8 glass-hover inner-glow relative">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`${bg} backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-lg`}
        >
          {label}
        </span>
        <span className="text-white/50 text-sm font-medium">{time}</span>
      </div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-white/70 text-sm mb-6 leading-relaxed">{description}</p>
      <Link
        to={`/test/${slug}`}
        className="btn-glass block w-full text-white py-3 rounded-xl font-semibold text-center"
      >
        Start Test
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="blur-shape w-80 h-80 bg-purple-500 top-20 -right-20" />
      <div className="blur-shape w-64 h-64 bg-pink-400 bottom-40 -left-20" />

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight">
            MeSearch
          </Link>
          <GitHubIcon />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-6 py-24">
        <div className="glass-strong rounded-3xl p-12 text-center inner-glow relative">
          {/* Icon replacement for emoji */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/80 backdrop-blur flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-white/70 mb-8 text-lg leading-relaxed">
            We're working on bringing you this assessment. Check back soon!
          </p>
          <Link
            to="/"
            className="btn-accent inline-block text-white px-8 py-3 rounded-xl font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test/:slug" element={<TestPage />} />
    </Routes>
  );
}

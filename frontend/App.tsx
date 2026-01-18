import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#8a8a8f] hover:text-[#d4af37] transition-colors duration-300"
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
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="border-b border-[#2a2a2e]/50 bg-[#0a0a0b]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            MeSearch
          </h1>
          <nav className="flex items-center gap-8">
            <a
              href="#tests"
              className="text-[#9a9a9f] hover:text-[#d4af37] transition-colors duration-300 text-sm tracking-wide uppercase"
            >
              Tests
            </a>
            <a
              href="#about"
              className="text-[#9a9a9f] hover:text-[#d4af37] transition-colors duration-300 text-sm tracking-wide uppercase"
            >
              About
            </a>
            <div className="w-px h-5 bg-[#2a2a2e]" />
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto max-w-6xl px-6 py-32 text-center overflow-hidden">
          {/* Subtle gradient orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#1a1225] via-transparent to-transparent opacity-60 pointer-events-none" />

          <p className="text-[#d4af37] text-sm tracking-[0.3em] uppercase mb-6 font-medium">
            Personality Assessment
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-[#f5f0e6] mb-8 leading-tight tracking-tight">
            Understand Yourself
            <span className="block text-gold-gradient italic mt-2">With Clarity</span>
          </h2>
          <p className="text-lg text-[#8a8a8f] mb-12 max-w-2xl mx-auto leading-relaxed font-light">
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
            <p className="text-[#d4af37] text-xs tracking-[0.3em] uppercase mb-4">Assessments</p>
            <h3 className="font-display text-4xl font-medium text-[#f5f0e6]">Featured Tests</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestCard
              title="Big Five"
              subtitle="IPIP-NEO"
              slug="big-five"
              description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
              time="15 min"
              badge="research"
            />
            <TestCard
              title="HEXACO"
              subtitle="Six Dimensions"
              slug="hexaco"
              description="Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct with precision."
              time="12 min"
              badge="research"
            />
            <TestCard
              title="Enneagram"
              subtitle="Nine Types"
              slug="enneagram"
              description="Explore your core motivations through nine distinct personality archetypes. Renowned for personal growth insights."
              time="10 min"
              badge="discovery"
            />
          </div>
        </section>

        {/* Divider */}
        <div className="divider-elegant mx-auto max-w-md" />

        {/* About Section */}
        <section id="about" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#1a1225] to-[#0a0a0b] opacity-50" />
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <p className="text-[#d4af37] text-xs tracking-[0.3em] uppercase mb-4">Methodology</p>
            <h3 className="font-display text-4xl font-medium text-[#f5f0e6] mb-6">
              The Science Behind It
            </h3>
            <p className="text-[#8a8a8f] text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              We prioritize scientifically validated assessments. Each test is labeled with its
              research backing so you know exactly what you're engaging with.
            </p>
            <div className="flex justify-center gap-16">
              <div className="text-center">
                <span className="inline-block border border-[#d4af37]/40 text-[#d4af37] px-4 py-2 rounded text-xs tracking-widest uppercase">
                  Research-Backed
                </span>
                <p className="mt-4 text-[#6a6a6f] text-sm">Strong empirical support</p>
              </div>
              <div className="text-center">
                <span className="inline-block border border-[#8a6a8f]/40 text-[#a888a8] px-4 py-2 rounded text-xs tracking-widest uppercase">
                  Self-Discovery
                </span>
                <p className="mt-4 text-[#6a6a6f] text-sm">Popular for reflection</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1c1c1f] py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-xl text-gold-gradient mb-4">MeSearch</p>
          <p className="text-[#5a5a5f] text-sm tracking-wide">
            Built with science. Designed for insight.
          </p>
          <p className="text-[#3a3a3f] text-xs mt-4">&copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}

type BadgeType = 'research' | 'popular' | 'discovery';

function TestCard({
  title,
  subtitle,
  slug,
  description,
  time,
  badge
}: {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  time: string;
  badge: BadgeType;
}) {
  const badgeStyles: Record<BadgeType, { border: string; text: string; label: string }> = {
    research: { border: 'border-[#d4af37]/30', text: 'text-[#d4af37]', label: 'Research-Backed' },
    popular: { border: 'border-[#4a7fa8]/30', text: 'text-[#6aa8d8]', label: 'Popular' },
    discovery: { border: 'border-[#8a6a8f]/30', text: 'text-[#a888a8]', label: 'Self-Discovery' },
  };

  const { border, text, label } = badgeStyles[badge];

  return (
    <div className="card-premium rounded-lg p-8 group">
      <div className="flex items-center justify-between mb-6">
        <span className={`${border} ${text} text-[10px] tracking-widest uppercase border px-3 py-1.5 rounded`}>
          {label}
        </span>
        <span className="text-[#5a5a5f] text-xs tracking-wide">{time}</span>
      </div>
      <h4 className="font-display text-2xl font-medium text-[#f5f0e6] mb-1">{title}</h4>
      <p className="text-[#d4af37]/70 text-sm mb-4 tracking-wide">{subtitle}</p>
      <p className="text-[#7a7a7f] text-sm mb-8 leading-relaxed">{description}</p>
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
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="border-b border-[#2a2a2e]/50 bg-[#0a0a0b]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">
            MeSearch
          </Link>
          <GitHubIcon />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="card-premium rounded-lg p-12">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-[#d4af37]/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#d4af37]"
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
          <p className="text-[#d4af37] text-xs tracking-[0.3em] uppercase mb-4">In Development</p>
          <h2 className="font-display text-3xl font-medium text-[#f5f0e6] mb-4">Coming Soon</h2>
          <p className="text-[#7a7a7f] mb-10 leading-relaxed">
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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test/:slug" element={<TestPage />} />
    </Routes>
  );
}

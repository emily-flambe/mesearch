import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="block p-2 border-2 border-[#0a0a0a] bg-white hover:bg-[#0a0a0a] hover:text-white transition-colors"
      aria-label="View on GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  );
}

function GeometricShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Large red circle - top right */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-8 border-[#e53935]"
        style={{ opacity: 0.15 }}
      />
      {/* Blue square - bottom left */}
      <div
        className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#1565c0]"
        style={{ opacity: 0.08, transform: 'rotate(15deg)' }}
      />
      {/* Yellow triangle - right side */}
      <div
        className="absolute top-1/2 right-20 w-0 h-0"
        style={{
          borderLeft: '60px solid transparent',
          borderRight: '60px solid transparent',
          borderBottom: '100px solid #fdd835',
          opacity: 0.12,
          transform: 'rotate(-20deg)'
        }}
      />
      {/* Small black circle */}
      <div
        className="absolute top-40 left-1/4 w-12 h-12 rounded-full bg-[#0a0a0a]"
        style={{ opacity: 0.06 }}
      />
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] geo-grid-subtle">
      {/* Header stripe */}
      <div className="geo-header-stripe" />

      <header className="border-b-4 border-[#0a0a0a] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e53935] flex items-center justify-center">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0a0a0a] uppercase">
              MeSearch
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <a
              href="#tests"
              className="px-4 py-2 font-bold text-sm uppercase tracking-widest text-[#0a0a0a] hover:bg-[#fdd835] transition-colors"
            >
              Tests
            </a>
            <a
              href="#about"
              className="px-4 py-2 font-bold text-sm uppercase tracking-widest text-[#0a0a0a] hover:bg-[#fdd835] transition-colors"
            >
              About
            </a>
            <div className="ml-2">
              <GitHubIcon />
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <GeometricShapes />
          <div className="mx-auto max-w-6xl px-6 py-24 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left content - asymmetric layout */}
              <div className="lg:col-span-7">
                <p className="geo-subhead text-[#e53935] mb-4">
                  Personality Assessment Platform
                </p>
                <h1 className="geo-heading text-6xl md:text-7xl lg:text-8xl text-[#0a0a0a] mb-8">
                  Know
                  <br />
                  <span className="text-[#1565c0]">Your</span>
                  <br />
                  Self
                </h1>
                <p className="text-lg text-[#424242] max-w-md mb-10 leading-relaxed">
                  Scientifically-backed personality assessments. Track results over time.
                  Discover insights across multiple frameworks.
                </p>
                <a href="#tests" className="geo-btn geo-btn-red">
                  Explore Tests
                </a>
              </div>

              {/* Right decorative element */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className="relative h-80">
                  {/* Overlapping geometric shapes */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#e53935]" />
                  <div className="absolute top-16 right-16 w-48 h-48 bg-[#1565c0]" />
                  <div className="absolute top-32 right-32 w-48 h-48 bg-[#fdd835]" />
                  <div className="absolute top-8 right-8 w-48 h-48 border-4 border-[#0a0a0a]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="geo-divider" />

        {/* Tests Section */}
        <section id="tests" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="geo-subhead text-[#424242] mb-2">Available Now</p>
                <h2 className="geo-heading text-4xl md:text-5xl text-[#0a0a0a]">
                  Featured Tests
                </h2>
              </div>
              <div className="hidden md:flex gap-2">
                <div className="w-4 h-4 bg-[#e53935]" />
                <div className="w-4 h-4 bg-[#1565c0]" />
                <div className="w-4 h-4 bg-[#fdd835]" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TestCard
                title="Big Five"
                subtitle="IPIP-NEO"
                slug="big-five"
                description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
                time="15 min"
                badge="research"
                accentColor="red"
              />
              <TestCard
                title="HEXACO"
                subtitle="Six-Factor Model"
                slug="hexaco"
                description="Includes Honesty-Humility dimension. Predicts ethical behavior and workplace conduct with strong empirical backing."
                time="12 min"
                badge="research"
                accentColor="blue"
              />
              <TestCard
                title="Enneagram"
                subtitle="Nine Types"
                slug="enneagram"
                description="Explore your core motivations through 9 personality types. Popular for personal growth and self-discovery."
                time="10 min"
                badge="discovery"
                accentColor="yellow"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-[#0a0a0a] text-white py-20 relative overflow-hidden">
          {/* Geometric background */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-0 w-1/3 h-2 bg-[#e53935]" />
            <div className="absolute top-0 left-1/3 w-1/3 h-2 bg-[#1565c0]" />
            <div className="absolute top-0 left-2/3 w-1/3 h-2 bg-[#fdd835]" />
            <div
              className="absolute -bottom-32 -right-32 w-96 h-96 border-8 border-[#424242] rounded-full"
              style={{ opacity: 0.3 }}
            />
          </div>

          <div className="mx-auto max-w-6xl px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="geo-subhead text-[#fdd835] mb-4">Methodology</p>
                <h2 className="geo-heading text-4xl md:text-5xl text-white mb-6">
                  The Science
                  <br />
                  Behind It
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  We prioritize scientifically validated assessments. Each test is labeled
                  with its research backing so you know exactly what you're getting.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 border-l-4 border-[#e53935] bg-[#1a1a1a]">
                  <div className="w-3 h-3 bg-[#e53935] mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="geo-badge text-[#e53935] mb-2">Research-Backed</span>
                    <p className="text-gray-400 mt-3">
                      Strong empirical support from peer-reviewed studies
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 border-l-4 border-[#1565c0] bg-[#1a1a1a]">
                  <div className="w-3 h-3 bg-[#1565c0] mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="geo-badge text-[#1565c0] mb-2">Self-Discovery</span>
                    <p className="text-gray-400 mt-3">
                      Popular frameworks for personal reflection and growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t-4 border-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#0a0a0a]" />
            <span className="font-bold text-sm uppercase tracking-widest text-[#0a0a0a]">
              MeSearch
            </span>
          </div>
          <p className="text-[#424242] text-sm">
            2025 MeSearch. Built with science, designed for insight.
          </p>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[#e53935]" />
            <div className="w-3 h-3 bg-[#1565c0]" />
            <div className="w-3 h-3 bg-[#fdd835]" />
          </div>
        </div>
      </footer>
    </div>
  );
}

type BadgeType = 'research' | 'popular' | 'discovery';
type AccentColor = 'red' | 'blue' | 'yellow';

function TestCard({
  title,
  subtitle,
  slug,
  description,
  time,
  badge,
  accentColor
}: {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  time: string;
  badge: BadgeType;
  accentColor: AccentColor;
}) {
  const badgeConfig: Record<BadgeType, { color: string; label: string }> = {
    research: { color: '#e53935', label: 'Research-Backed' },
    popular: { color: '#1565c0', label: 'Popular' },
    discovery: { color: '#1565c0', label: 'Self-Discovery' },
  };

  const accentColors: Record<AccentColor, string> = {
    red: 'geo-card-red',
    blue: 'geo-card-blue',
    yellow: 'geo-card-yellow',
  };

  const borderColors: Record<AccentColor, string> = {
    red: 'border-l-[#e53935]',
    blue: 'border-l-[#1565c0]',
    yellow: 'border-l-[#fdd835]',
  };

  const { color, label } = badgeConfig[badge];

  return (
    <div className={`geo-card ${accentColors[accentColor]} p-0`}>
      {/* Top accent bar */}
      <div
        className="h-2"
        style={{ backgroundColor: accentColor === 'red' ? '#e53935' : accentColor === 'blue' ? '#1565c0' : '#fdd835' }}
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span
            className="geo-badge"
            style={{ color, borderColor: color }}
          >
            {label}
          </span>
          <span className="text-[#424242] text-sm font-bold uppercase tracking-wider">
            {time}
          </span>
        </div>

        <h3 className="geo-heading text-2xl text-[#0a0a0a] mb-1">{title}</h3>
        <p className="text-[#424242] text-sm font-medium uppercase tracking-wider mb-4">
          {subtitle}
        </p>

        <p className="text-[#424242] text-sm leading-relaxed mb-6">
          {description}
        </p>

        <Link
          to={`/test/${slug}`}
          className="block w-full py-3 bg-[#0a0a0a] text-white text-center font-bold uppercase tracking-widest text-sm hover:bg-[#e53935] transition-colors"
        >
          Start Test
        </Link>
      </div>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] geo-grid-subtle">
      {/* Header stripe */}
      <div className="geo-header-stripe" />

      <header className="border-b-4 border-[#0a0a0a] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e53935] flex items-center justify-center">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0a0a0a] uppercase">
              MeSearch
            </span>
          </Link>
          <GitHubIcon />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="geo-card p-0">
          {/* Accent bar */}
          <div className="h-2 bg-[#1565c0]" />

          <div className="p-10 text-center">
            {/* Geometric "under construction" indicator */}
            <div className="flex justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-[#e53935]" />
              <div className="w-8 h-8 bg-[#1565c0] rotate-45" />
              <div className="w-8 h-8 bg-[#fdd835]" />
            </div>

            <p className="geo-subhead text-[#424242] mb-3">Status</p>
            <h1 className="geo-heading text-4xl md:text-5xl text-[#0a0a0a] mb-6">
              Coming
              <br />
              Soon
            </h1>
            <p className="text-[#424242] text-lg mb-10 max-w-md mx-auto">
              We're working on bringing you this assessment.
              Check back soon for updates.
            </p>
            <Link to="/" className="geo-btn geo-btn-blue">
              Back to Home
            </Link>
          </div>
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

import { Routes, Route, Link } from 'react-router-dom';

// Decorative geometric shapes component
function GeometricShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Pink triangle - top left */}
      <div
        className="absolute -top-4 -left-8 float-anim"
        style={{
          width: 0,
          height: 0,
          borderLeft: '40px solid transparent',
          borderRight: '40px solid transparent',
          borderBottom: '70px solid #FF1493',
        }}
      />
      {/* Blue circle - top right */}
      <div
        className="absolute top-20 right-12 w-16 h-16 rounded-full float-anim-reverse"
        style={{
          backgroundColor: '#00D4FF',
          border: '4px solid #1A1A2E'
        }}
      />
      {/* Yellow square - rotated */}
      <div
        className="absolute top-40 left-20 w-12 h-12 float-anim-slow"
        style={{
          backgroundColor: '#FFE600',
          border: '3px solid #1A1A2E',
          transform: 'rotate(15deg)',
        }}
      />
      {/* Mint circle - bottom left */}
      <div
        className="absolute bottom-32 left-16 w-10 h-10 rounded-full float-anim"
        style={{
          backgroundColor: '#7FFFD4',
          border: '3px solid #1A1A2E'
        }}
      />
      {/* Pink half-circle - right side */}
      <div
        className="absolute top-1/2 -right-6 w-12 h-24 float-anim-reverse"
        style={{
          backgroundColor: '#FF1493',
          borderTopLeftRadius: '60px',
          borderBottomLeftRadius: '60px',
          border: '3px solid #1A1A2E',
          borderRight: 'none',
        }}
      />
      {/* Small orange triangle */}
      <div
        className="absolute bottom-48 right-24 float-anim-slow"
        style={{
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '35px solid #FF6B35',
        }}
      />
    </div>
  );
}

// Squiggle line decoration
function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 12 Q 17 2, 32 12 T 62 12 T 92 12 T 118 12"
        stroke="#FF1493"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg hover:bg-[#FFE600] transition-colors squiggle-hover"
      style={{ border: '2px solid #1A1A2E' }}
      aria-label="View on GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="#1A1A2E"
        aria-hidden="true"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8E7' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FFE600',
          borderBottom: '4px solid #1A1A2E'
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1
            className="text-3xl memphis-title squiggle-hover cursor-default"
            style={{ color: '#1A1A2E' }}
          >
            MeSearch
          </h1>
          <nav className="flex items-center gap-4">
            <a
              href="#tests"
              className="px-4 py-2 font-bold uppercase tracking-wide transition-all squiggle-hover"
              style={{
                color: '#1A1A2E',
                borderBottom: '3px solid transparent'
              }}
              onMouseEnter={e => e.currentTarget.style.borderBottomColor = '#FF1493'}
              onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
            >
              Tests
            </a>
            <a
              href="#about"
              className="px-4 py-2 font-bold uppercase tracking-wide transition-all squiggle-hover"
              style={{
                color: '#1A1A2E',
                borderBottom: '3px solid transparent'
              }}
              onMouseEnter={e => e.currentTarget.style.borderBottomColor = '#00D4FF'}
              onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
            >
              About
            </a>
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto max-w-6xl px-4 py-24">
          <GeometricShapes />
          <div className="relative z-10 text-center">
            <Squiggle className="mx-auto mb-6" />
            <h2
              className="text-6xl md:text-7xl memphis-title mb-8 text-shadow-memphis"
              style={{ color: '#1A1A2E' }}
            >
              Understand<br />
              <span style={{ color: '#FF1493' }}>Yourself</span><br />
              Better
            </h2>
            <p
              className="text-xl mb-10 max-w-xl mx-auto font-medium"
              style={{ color: '#1A1A2E' }}
            >
              Take scientifically-backed personality assessments, track your results over time,
              and discover insights across multiple frameworks.
            </p>
            <a
              href="#tests"
              className="memphis-btn memphis-btn-pink inline-block px-10 py-4 text-lg rounded-none"
            >
              Explore Tests
            </a>
          </div>
        </section>

        {/* Squiggle divider */}
        <div className="squiggle-line w-full" />

        {/* Tests Section */}
        <section
          id="tests"
          className="py-20 memphis-dots-light"
          style={{ backgroundColor: '#00D4FF' }}
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h3
                className="text-4xl md:text-5xl memphis-title inline-block px-6 py-3"
                style={{
                  color: '#1A1A2E',
                  backgroundColor: '#FFE600',
                  border: '4px solid #1A1A2E',
                  boxShadow: '6px 6px 0px #1A1A2E'
                }}
              >
                Featured Tests
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TestCard
                title="Big Five (IPIP-NEO)"
                slug="big-five"
                description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
                time="15 min"
                badge="research"
                color="#FF1493"
              />
              <TestCard
                title="HEXACO"
                slug="hexaco"
                description="Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct."
                time="12 min"
                badge="research"
                color="#7FFFD4"
              />
              <TestCard
                title="Enneagram"
                slug="enneagram"
                description="Explore your core motivations through 9 personality types. Popular for personal growth and self-discovery."
                time="10 min"
                badge="discovery"
                color="#FFE600"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-20 relative overflow-hidden"
          style={{ backgroundColor: '#1A1A2E' }}
        >
          {/* Background decorations */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full float-anim" style={{ backgroundColor: '#FF1493', opacity: 0.3 }} />
          <div className="absolute bottom-10 right-20 w-16 h-16 float-anim-reverse" style={{ backgroundColor: '#00D4FF', opacity: 0.3, transform: 'rotate(45deg)' }} />

          <div className="mx-auto max-w-6xl px-4 text-center relative z-10">
            <h3
              className="text-4xl md:text-5xl memphis-title mb-8"
              style={{ color: '#FFE600' }}
            >
              The Science Behind It
            </h3>
            <p
              className="text-lg max-w-2xl mx-auto mb-10"
              style={{ color: '#7FFFD4' }}
            >
              We prioritize scientifically validated assessments. Each test is labeled with its research backing
              so you know exactly what you are getting.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-8">
              <div
                className="memphis-border p-6 inline-block"
                style={{ backgroundColor: '#7FFFD4' }}
              >
                <span
                  className="memphis-badge px-3 py-1 inline-block mb-3"
                  style={{ backgroundColor: '#FF1493', color: 'white' }}
                >
                  Research-Backed
                </span>
                <p className="font-bold" style={{ color: '#1A1A2E' }}>Strong empirical support</p>
              </div>
              <div
                className="memphis-border p-6 inline-block"
                style={{ backgroundColor: '#00D4FF' }}
              >
                <span
                  className="memphis-badge px-3 py-1 inline-block mb-3"
                  style={{ backgroundColor: '#9B59B6', color: 'white' }}
                >
                  Self-Discovery
                </span>
                <p className="font-bold" style={{ color: '#1A1A2E' }}>Popular for reflection</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="py-8"
        style={{
          backgroundColor: '#FFE600',
          borderTop: '4px solid #1A1A2E'
        }}
      >
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p
            className="font-bold"
            style={{ color: '#1A1A2E' }}
          >
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
  color
}: {
  title: string;
  slug: string;
  description: string;
  time: string;
  badge: BadgeType;
  color: string;
}) {
  const badgeStyles: Record<BadgeType, { bg: string; label: string }> = {
    research: { bg: '#FF1493', label: 'Research-Backed' },
    popular: { bg: '#00D4FF', label: 'Popular' },
    discovery: { bg: '#9B59B6', label: 'Self-Discovery' },
  };

  const { bg, label } = badgeStyles[badge];

  return (
    <div
      className="memphis-card memphis-border p-6 relative"
      style={{ backgroundColor: '#FFF8E7' }}
    >
      {/* Colored accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center gap-3 mb-4 pt-2">
        <span
          className="memphis-badge px-2 py-1"
          style={{ backgroundColor: bg, color: 'white' }}
        >
          {label}
        </span>
        <span
          className="font-bold text-sm px-2 py-1"
          style={{
            color: '#1A1A2E',
            backgroundColor: '#FFE600',
            border: '2px solid #1A1A2E'
          }}
        >
          {time}
        </span>
      </div>
      <h4
        className="text-2xl font-black mb-3"
        style={{ color: '#1A1A2E' }}
      >
        {title}
      </h4>
      <p
        className="text-sm mb-6"
        style={{ color: '#1A1A2E' }}
      >
        {description}
      </p>
      <Link
        to={`/test/${slug}`}
        className="memphis-btn block w-full py-3 text-center"
      >
        Start Test
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8E7' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FFE600',
          borderBottom: '4px solid #1A1A2E'
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-3xl memphis-title squiggle-hover"
            style={{ color: '#1A1A2E' }}
          >
            MeSearch
          </Link>
          <GitHubIcon />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-16 relative">
        <GeometricShapes />

        <div
          className="memphis-border p-8 text-center relative z-10"
          style={{ backgroundColor: '#00D4FF' }}
        >
          {/* Construction icon replacement - geometric shapes */}
          <div className="flex justify-center gap-4 mb-6">
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '25px solid transparent',
                borderRight: '25px solid transparent',
                borderBottom: '44px solid #FF1493',
              }}
            />
            <div
              className="w-12 h-12"
              style={{
                backgroundColor: '#FFE600',
                border: '3px solid #1A1A2E',
                transform: 'rotate(15deg)',
              }}
            />
            <div
              className="w-12 h-12 rounded-full"
              style={{
                backgroundColor: '#7FFFD4',
                border: '3px solid #1A1A2E',
              }}
            />
          </div>

          <h2
            className="text-4xl memphis-title mb-6"
            style={{ color: '#1A1A2E' }}
          >
            Coming Soon
          </h2>
          <p
            className="text-lg mb-8 font-medium"
            style={{ color: '#1A1A2E' }}
          >
            We are working on bringing you this assessment. Check back soon!
          </p>
          <Link
            to="/"
            className="memphis-btn memphis-btn-pink inline-block px-8 py-3"
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

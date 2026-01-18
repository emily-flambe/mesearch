import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-black hover:text-[#ff0000] transition-colors"
      aria-label="View on GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="brutal-heading text-3xl tracking-tight">MESEARCH</h1>
          <nav className="flex items-center gap-8">
            <a href="#tests" className="brutal-link text-sm font-bold uppercase tracking-widest">Tests</a>
            <a href="#about" className="brutal-link text-sm font-bold uppercase tracking-widest">About</a>
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="border-b-4 border-black">
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="max-w-4xl">
              <h2 className="brutal-heading text-6xl md:text-8xl lg:text-9xl mb-8">
                KNOW<br />
                <span className="text-[#ff0000]">YOUR</span><br />
                SELF
              </h2>
              <p className="text-lg md:text-xl font-mono max-w-xl mb-10 leading-relaxed">
                Personality tests that don't lie to you. No flattery. No fortune-telling.
                Just data about who you actually are.
              </p>
              <a
                href="#tests"
                className="brutal-btn inline-block px-10 py-4 text-lg"
              >
                Take a Test
              </a>
            </div>
          </div>
        </section>

        {/* Tests Grid */}
        <section id="tests" className="border-b-4 border-black">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-12">
              <h3 className="brutal-heading text-4xl md:text-5xl">AVAILABLE TESTS</h3>
              <div className="h-1 w-24 bg-[#ff0000] mt-4"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TestCard
                title="Big Five"
                subtitle="IPIP-NEO"
                slug="big-five"
                description="The only personality model that matters. Five dimensions. Decades of research. No mystical nonsense."
                time="15 MIN"
                badge="research"
              />
              <TestCard
                title="HEXACO"
                subtitle="Six Factors"
                slug="hexaco"
                description="Big Five plus Honesty-Humility. Predicts who will cheat, steal, and manipulate. Are you honest about yourself?"
                time="12 MIN"
                badge="research"
              />
              <TestCard
                title="Enneagram"
                subtitle="9 Types"
                slug="enneagram"
                description="Less science, more soul-searching. Find your core fear and motivation. Popular for a reason."
                time="10 MIN"
                badge="discovery"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-black text-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="brutal-heading text-4xl md:text-5xl mb-6">
                  WE LABEL<br />
                  <span className="text-[#ff0000]">EVERYTHING</span>
                </h3>
                <p className="font-mono text-lg leading-relaxed text-gray-300">
                  Not all tests are created equal. Some have decades of peer-reviewed research.
                  Others are just fun. We tell you which is which. No pretending.
                </p>
              </div>
              <div className="space-y-6">
                <div className="border-4 border-white p-6">
                  <div className="brutal-badge brutal-badge-research inline-block px-3 py-1 mb-3">
                    RESEARCH-BACKED
                  </div>
                  <p className="font-mono text-sm text-gray-300">
                    Validated by scientists. Published in journals. Actually predicts behavior.
                  </p>
                </div>
                <div className="border-4 border-white p-6">
                  <div className="brutal-badge brutal-badge-discovery inline-block px-3 py-1 mb-3 bg-white text-black">
                    SELF-DISCOVERY
                  </div>
                  <p className="font-mono text-sm text-gray-300">
                    Popular for reflection. Good for conversation. Take with a grain of salt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm">&copy; 2025 MESEARCH</p>
          <p className="font-mono text-sm text-gray-500">BUILT WITH DATA. DESIGNED WITHOUT MERCY.</p>
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
  const badgeClass = badge === 'research' ? 'brutal-badge-research' : 'brutal-badge-discovery bg-white';
  const badgeLabel = badge === 'research' ? 'RESEARCH-BACKED' : 'SELF-DISCOVERY';

  return (
    <div className="brutal-card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className={`brutal-badge ${badgeClass} px-2 py-1`}>
          {badgeLabel}
        </span>
        <span className="font-mono text-xs font-bold">{time}</span>
      </div>
      <h4 className="brutal-heading text-2xl mb-1">{title}</h4>
      <p className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">{subtitle}</p>
      <p className="font-mono text-sm mb-6 flex-grow leading-relaxed">{description}</p>
      <Link
        to={`/test/${slug}`}
        className="brutal-btn-outline block w-full py-3 text-center text-sm"
      >
        Start Test
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="brutal-heading text-3xl tracking-tight hover:text-[#ff0000] transition-colors">
            MESEARCH
          </Link>
          <GitHubIcon />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="brutal-card-red p-10 text-center">
          <div className="border-4 border-[#ff0000] inline-block px-6 py-3 mb-6">
            <span className="brutal-heading text-2xl text-[#ff0000]">UNDER CONSTRUCTION</span>
          </div>
          <h2 className="brutal-heading text-4xl mb-6">NOT READY YET</h2>
          <p className="font-mono text-lg mb-8 leading-relaxed">
            This test is being built. We could have shipped something half-baked, but we didn't.
            Check back when it's actually done.
          </p>
          <Link
            to="/"
            className="brutal-btn inline-block px-8 py-4"
          >
            Go Back
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

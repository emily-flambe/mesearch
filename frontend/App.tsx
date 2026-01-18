import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#33ff33]/60 hover:text-[#33ff33] transition-colors terminal-glow-subtle"
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

function TerminalHeader({ showNav = true }: { showNav?: boolean }) {
  return (
    <header className="border-b border-[#1a8c1a] bg-[#0a0a0a]/95">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-mono text-2xl font-bold text-[#33ff33] terminal-glow">
          <span className="text-[#33ff33]/60">[</span>MeSearch<span className="text-[#33ff33]/60">]</span>
        </Link>
        {showNav ? (
          <nav className="flex items-center gap-6 font-mono">
            <a href="#tests" className="text-[#33ff33]/70 hover:text-[#33ff33] transition-colors">
              <span className="text-[#33ff33]/40">&gt;</span> tests
            </a>
            <a href="#about" className="text-[#33ff33]/70 hover:text-[#33ff33] transition-colors">
              <span className="text-[#33ff33]/40">&gt;</span> about
            </a>
            <GitHubIcon />
          </nav>
        ) : (
          <GitHubIcon />
        )}
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-mono scanlines crt-flicker">
      <TerminalHeader />

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <div className="mb-8 text-[#33ff33]/40 text-sm">
            ╔══════════════════════════════════════════════════════════╗
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#33ff33] mb-6 terminal-glow">
            <span className="text-[#33ff33]/60">&gt;</span> Understand_Yourself_Better<span className="cursor-blink"></span>
          </h2>
          <p className="text-lg text-[#33ff33]/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Take scientifically-backed personality assessments, track your results over time,
            and discover insights across multiple frameworks.
          </p>
          <div className="mb-8 text-[#33ff33]/40 text-sm">
            ╚══════════════════════════════════════════════════════════╝
          </div>
          <a
            href="#tests"
            className="terminal-btn inline-block px-8 py-3 text-lg font-medium"
          >
            [ EXPLORE TESTS ]
          </a>
        </section>

        {/* Tests Section */}
        <section id="tests" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <div className="text-[#33ff33]/50 text-sm mb-2">════════════════════</div>
            <h3 className="text-3xl font-bold text-[#33ff33] terminal-glow-subtle">
              AVAILABLE_TESTS
            </h3>
            <div className="text-[#33ff33]/50 text-sm mt-2">════════════════════</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
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
        <section id="about" className="border-y border-[#1a8c1a] py-16 bg-[#0f0f0f]">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <div className="text-[#33ff33]/50 text-sm mb-4">
              +------------------------------------------+
            </div>
            <h3 className="text-3xl font-bold text-[#33ff33] mb-4 terminal-glow-subtle">
              SYSTEM://METHODOLOGY
            </h3>
            <div className="text-[#33ff33]/50 text-sm mb-6">
              +------------------------------------------+
            </div>
            <p className="text-[#33ff33]/70 text-lg max-w-2xl mx-auto mb-8">
              We prioritize scientifically validated assessments. Each test is labeled with its research backing
              so you know exactly what you are getting.
            </p>
            <div className="flex justify-center gap-12 text-sm">
              <div className="text-left">
                <span className="inline-block border border-[#33ff33] text-[#33ff33] px-3 py-1 mb-2">
                  [RESEARCH-BACKED]
                </span>
                <p className="text-[#33ff33]/60">Strong empirical support</p>
              </div>
              <div className="text-left">
                <span className="inline-block border border-[#33ff33]/60 text-[#33ff33]/80 px-3 py-1 mb-2">
                  [SELF-DISCOVERY]
                </span>
                <p className="text-[#33ff33]/60">Popular for reflection</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1a8c1a] py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-[#33ff33]/50 text-sm">
          <p>
            <span className="text-[#33ff33]/30">/*</span> (C) 2025 MeSearch <span className="text-[#33ff33]/30">|</span> Built with science, designed for insight. <span className="text-[#33ff33]/30">*/</span>
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
  badge
}: {
  title: string;
  slug: string;
  description: string;
  time: string;
  badge: BadgeType;
}) {
  const badgeLabels: Record<BadgeType, string> = {
    research: '[RESEARCH-BACKED]',
    popular: '[POPULAR]',
    discovery: '[SELF-DISCOVERY]',
  };

  const badgeStyles: Record<BadgeType, string> = {
    research: 'border-[#33ff33] text-[#33ff33]',
    popular: 'border-[#33ff33]/70 text-[#33ff33]/80',
    discovery: 'border-[#33ff33]/60 text-[#33ff33]/70',
  };

  return (
    <div className="terminal-card p-6 hover:border-[#33ff33] transition-colors">
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className={`border ${badgeStyles[badge]} px-2 py-1`}>
          {badgeLabels[badge]}
        </span>
        <span className="text-[#33ff33]/50">
          <span className="text-[#33ff33]/30">TIME:</span> {time}
        </span>
      </div>
      <h4 className="text-lg font-bold text-[#33ff33] mb-2 terminal-glow-subtle">
        <span className="text-[#33ff33]/40">&gt;</span> {title}
      </h4>
      <p className="text-[#33ff33]/60 text-sm mb-6 leading-relaxed">{description}</p>
      <Link
        to={`/test/${slug}`}
        className="terminal-btn block w-full py-2 text-center text-sm"
      >
        [ INITIALIZE TEST ]
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-mono scanlines">
      <TerminalHeader showNav={false} />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="terminal-card p-8">
          <div className="text-[#33ff33]/40 text-sm mb-6">
            +--------------------------------+<br />
            |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SYSTEM MESSAGE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
            +--------------------------------+
          </div>
          <div className="text-6xl mb-6 text-[#33ff33]/30">
            <pre className="inline-block text-left text-xs leading-tight">
{`   _____
  /     \\
 | () () |
  \\  ^  /
   |||||
   |||||  `}
            </pre>
          </div>
          <h2 className="text-2xl font-bold text-[#33ff33] mb-4 terminal-glow-subtle">
            <span className="text-[#33ff33]/40">&gt;</span> STATUS: UNDER_CONSTRUCTION
          </h2>
          <p className="text-[#33ff33]/60 mb-8">
            This assessment module is currently being developed.<br />
            <span className="text-[#33ff33]/40">Please check back later for updates.</span>
          </p>
          <Link
            to="/"
            className="terminal-btn inline-block px-6 py-2"
          >
            [ RETURN TO MAIN ]
          </Link>
          <div className="mt-8 text-[#33ff33]/30 text-xs">
            <span className="cursor-blink">awaiting input</span>
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

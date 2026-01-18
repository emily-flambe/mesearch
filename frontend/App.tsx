import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-[#c41e3a] transition-colors"
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

function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Masthead */}
      <header className="border-b border-black">
        <div className="mx-auto max-w-7xl px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Vol. I / January 2025
            </span>
            <GitHubIcon />
          </div>
          {/* Logo */}
          <div className="py-8 text-center">
            <h1 className="font-editorial text-6xl md:text-7xl font-medium tracking-tight-editorial text-[#0a0a0a]">
              MeSearch
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-500">
              The Journal of Self-Discovery
            </p>
          </div>
          {/* Nav */}
          <nav className="flex justify-center gap-8 py-4 border-t border-gray-200">
            <a href="#tests" className="text-xs uppercase tracking-[0.15em] text-gray-700 hover-accent-underline relative">
              Assessments
            </a>
            <a href="#about" className="text-xs uppercase tracking-[0.15em] text-gray-700 hover-accent-underline relative">
              Methodology
            </a>
            <a href="#research" className="text-xs uppercase tracking-[0.15em] text-gray-700 hover-accent-underline relative">
              Research
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero - Editorial asymmetric layout */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Main headline area */}
            <div className="md:col-span-7">
              <div className="rule-accent w-16 mb-6"></div>
              <h2 className="font-editorial text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight-editorial text-[#0a0a0a] mb-8">
                Know<br />
                <span className="italic">Thyself</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl font-light">
                Scientifically validated personality assessments.
                Track your psychological profile over time.
                Discover patterns across multiple frameworks.
              </p>
              <div className="mt-10">
                <a href="#tests" className="btn-editorial">
                  Begin Assessment
                </a>
              </div>
            </div>

            {/* Sidebar pull quote */}
            <div className="md:col-span-5 md:border-l md:border-gray-200 md:pl-8">
              <div className="pull-quote py-4">
                <p className="font-editorial text-2xl md:text-3xl italic leading-snug text-gray-800">
                  "The unexamined life is not worth living."
                </p>
                <cite className="block mt-4 text-xs uppercase tracking-[0.15em] text-gray-500 not-italic">
                  Socrates
                </cite>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-baseline gap-4">
                  <span className="display-number">3</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Featured Tests</p>
                    <p className="text-xs text-gray-500 mt-1">Research-backed & self-discovery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tests section - Editorial grid */}
        <section id="tests" className="border-t border-black">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section header */}
            <div className="py-8 border-b border-gray-200">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500">Featured Assessments</h3>
                <span className="text-xs text-gray-400">Scroll for more</span>
              </div>
            </div>

            {/* Test cards in editorial layout */}
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <TestCard
                title="Big Five"
                subtitle="IPIP-NEO"
                slug="big-five"
                description="The gold standard in personality psychology. Measures five fundamental dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
                time="15"
                number="01"
                badge="research"
              />
              <TestCard
                title="HEXACO"
                subtitle="Six-Factor Model"
                slug="hexaco"
                description="An evolution of the Big Five, adding Honesty-Humility. Particularly effective at predicting ethical behavior and workplace conduct."
                time="12"
                number="02"
                badge="research"
              />
              <TestCard
                title="Enneagram"
                subtitle="Nine Types"
                slug="enneagram"
                description="Explore core motivations and fears through nine interconnected personality types. Widely used for personal growth and understanding relationships."
                time="10"
                number="03"
                badge="discovery"
              />
            </div>
          </div>
        </section>

        {/* About section - Black background */}
        <section id="about" className="bg-[#0a0a0a] text-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-12 gap-12">
              {/* Left column */}
              <div className="md:col-span-5">
                <div className="rule-accent w-16 mb-6"></div>
                <h3 className="font-editorial text-4xl md:text-5xl font-medium italic mb-6">
                  On Methodology
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  We prioritize assessments with strong empirical foundations.
                  Each test is transparently labeled with its research backing,
                  so you understand exactly what science supports your results.
                </p>
              </div>

              {/* Right column - badge explanations */}
              <div className="md:col-span-7 md:border-l md:border-gray-800 md:pl-12">
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 border border-[#c41e3a] text-[#c41e3a] text-xs font-medium">
                      R
                    </span>
                    <div>
                      <h4 className="text-sm uppercase tracking-[0.15em] text-white mb-2">
                        Research-Backed
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Peer-reviewed studies support validity and reliability.
                        Used in academic and clinical settings worldwide.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 border border-gray-600 text-gray-400 text-xs font-medium">
                      D
                    </span>
                    <div>
                      <h4 className="text-sm uppercase tracking-[0.15em] text-white mb-2">
                        Self-Discovery
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Popular frameworks for reflection and personal growth.
                        Valued for insight, not clinical diagnosis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research note section */}
        <section id="research" className="border-t border-black py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-editorial text-2xl md:text-3xl italic leading-relaxed text-gray-700">
                Every assessment we offer links to peer-reviewed literature.
                We believe in transparency about what science knows
                and what remains open for interpretation.
              </p>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  A Note From the Editors
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-editorial text-2xl font-medium text-[#0a0a0a]">MeSearch</p>
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mt-1">
                Built with science. Designed for insight.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Copyright 2025. All rights reserved.
            </p>
          </div>
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
  number,
  badge
}: {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  time: string;
  number: string;
  badge: BadgeType;
}) {
  const badgeConfig: Record<BadgeType, { letter: string; accent: boolean }> = {
    research: { letter: 'R', accent: true },
    popular: { letter: 'P', accent: false },
    discovery: { letter: 'D', accent: false },
  };

  const { letter, accent } = badgeConfig[badge];

  return (
    <article className="py-10 px-6 md:px-8 group">
      {/* Number and badge */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-editorial text-4xl text-gray-300 font-light">{number}</span>
        <span
          className={`inline-flex items-center justify-center w-8 h-8 text-xs font-medium border ${
            accent
              ? 'border-[#c41e3a] text-[#c41e3a]'
              : 'border-gray-300 text-gray-400'
          }`}
        >
          {letter}
        </span>
      </div>

      {/* Title area */}
      <h4 className="font-editorial text-3xl font-medium text-[#0a0a0a] mb-1">
        {title}
      </h4>
      <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-4">
        {subtitle}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        {description}
      </p>

      {/* Meta and CTA */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <span className="text-xs text-gray-400">{time} min read</span>
        <Link
          to={`/test/${slug}`}
          className="text-xs uppercase tracking-[0.15em] text-[#0a0a0a] group-hover:text-[#c41e3a] transition-colors"
        >
          Take Test
          <span className="ml-2 inline-block transform group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Minimal header */}
      <header className="border-b border-black">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <Link to="/" className="font-editorial text-3xl font-medium text-[#0a0a0a] hover:text-[#c41e3a] transition-colors">
            MeSearch
          </Link>
          <GitHubIcon />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <article className="text-center">
          {/* Decorative element instead of emoji */}
          <div className="mb-8">
            <span className="inline-block w-16 h-16 border-2 border-[#c41e3a] relative">
              <span className="absolute inset-0 flex items-center justify-center font-editorial text-2xl text-[#c41e3a] italic">
                ?
              </span>
            </span>
          </div>

          <div className="rule-accent w-16 mx-auto mb-6"></div>

          <h2 className="font-editorial text-4xl md:text-5xl font-medium italic text-[#0a0a0a] mb-6">
            Coming Soon
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto mb-10">
            This assessment is currently in development.
            We are working to bring you a rigorously validated experience.
          </p>

          <Link
            to="/"
            className="btn-editorial-outline"
          >
            Return to Journal
          </Link>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-auto">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs text-gray-400">
            Copyright 2025 MeSearch. All rights reserved.
          </p>
        </div>
      </footer>
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

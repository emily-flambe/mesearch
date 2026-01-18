import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--mist)] hover:text-[var(--ink)] transition-colors duration-500"
      aria-label="View on GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
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
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Header - ultra minimal */}
      <header className="py-8 px-8 md:px-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-xl font-light tracking-[0.2em] text-[var(--ink)]">
            MeSearch
          </h1>
          <nav className="flex items-center gap-12">
            <a href="#assessments" className="zen-link text-sm tracking-[0.15em] lowercase">
              assessments
            </a>
            <a href="#philosophy" className="zen-link text-sm tracking-[0.15em] lowercase">
              philosophy
            </a>
            <GitHubIcon />
          </nav>
        </div>
      </header>

      {/* Thin divider */}
      <div className="divider mx-16" />

      <main>
        {/* Hero - maximum whitespace */}
        <section className="py-32 md:py-48 px-8 md:px-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-[var(--stone)] text-sm tracking-[0.3em] uppercase mb-8 opacity-0 animate-fade-in">
              personality research
            </p>
            <h2 className="font-serif text-4xl md:text-6xl font-light text-[var(--ink)] leading-tight mb-12 opacity-0 animate-fade-in animation-delay-100">
              Know thyself,<br />
              <span className="text-[var(--stone)]">with clarity</span>
            </h2>
            <p className="text-[var(--stone)] text-lg font-light max-w-xl leading-relaxed mb-16 opacity-0 animate-fade-in animation-delay-200">
              Scientifically validated assessments. No distractions.
              Just you and the questions that reveal who you are.
            </p>
            <a
              href="#assessments"
              className="zen-button inline-block opacity-0 animate-fade-in animation-delay-300"
            >
              begin
            </a>
          </div>
        </section>

        {/* Assessments - asymmetric grid */}
        <section id="assessments" className="py-24 md:py-32 px-8 md:px-16 bg-[var(--snow)]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-20 md:mb-32">
              <p className="text-[var(--stone)] text-sm tracking-[0.3em] uppercase mb-4">
                three paths
              </p>
              <h3 className="font-serif text-3xl md:text-4xl font-light text-[var(--ink)]">
                Choose your assessment
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-[var(--cloud)]">
              <TestCard
                title="Big Five"
                slug="big-five"
                subtitle="IPIP-NEO"
                description="The gold standard. Measures openness, conscientiousness, extraversion, agreeableness, and emotional stability."
                duration="15"
                category="empirical"
              />
              <TestCard
                title="HEXACO"
                slug="hexaco"
                subtitle="Six Dimensions"
                description="Adds honesty-humility to the traditional five. Particularly revealing of ethical tendencies."
                duration="12"
                category="empirical"
              />
              <TestCard
                title="Enneagram"
                slug="enneagram"
                subtitle="Nine Types"
                description="Core motivations and fears. Less scientific, more contemplative. A different lens."
                duration="10"
                category="reflective"
              />
            </div>
          </div>
        </section>

        {/* Philosophy section - minimal */}
        <section id="philosophy" className="py-32 md:py-48 px-8 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[var(--stone)] text-sm tracking-[0.3em] uppercase mb-8">
              our approach
            </p>
            <h3 className="font-serif text-3xl md:text-4xl font-light text-[var(--ink)] mb-12 leading-relaxed">
              We believe self-knowledge should be<br />
              quiet, focused, and honest.
            </h3>
            <div className="divider mb-12" />
            <div className="flex justify-center gap-16 text-sm text-[var(--stone)]">
              <div>
                <span className="zen-badge">empirical</span>
                <p className="mt-4 tracking-wide">peer-reviewed research</p>
              </div>
              <div>
                <span className="zen-badge">reflective</span>
                <p className="mt-4 tracking-wide">introspective tools</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - barely there */}
      <footer className="py-12 px-8 md:px-16">
        <div className="divider mb-12" />
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[var(--mist)]">
          <p className="tracking-wider">MeSearch</p>
          <p className="tracking-wider">2025</p>
        </div>
      </footer>
    </div>
  );
}

function TestCard({
  title,
  slug,
  subtitle,
  description,
  duration,
  category
}: {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  duration: string;
  category: 'empirical' | 'reflective';
}) {
  return (
    <div className="zen-card bg-[var(--snow)] p-10 md:p-12">
      <div className="flex items-center gap-4 mb-6">
        <span className="zen-badge">{category}</span>
        <span className="text-[var(--mist)] text-xs tracking-[0.15em]">{duration} min</span>
      </div>
      <h4 className="font-serif text-2xl font-light text-[var(--ink)] mb-1">{title}</h4>
      <p className="text-[var(--mist)] text-sm tracking-wider mb-6">{subtitle}</p>
      <p className="text-[var(--stone)] text-sm leading-relaxed mb-10">{description}</p>
      <Link
        to={`/test/${slug}`}
        className="zen-button inline-block text-sm"
      >
        begin
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Header */}
      <header className="py-8 px-8 md:px-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-light tracking-[0.2em] text-[var(--ink)]">
            MeSearch
          </Link>
          <GitHubIcon />
        </div>
      </header>

      <div className="divider mx-16" />

      {/* Content */}
      <main className="py-32 md:py-48 px-8 md:px-16">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[var(--stone)] text-sm tracking-[0.3em] uppercase mb-8">
            in development
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--ink)] mb-8 leading-relaxed">
            This assessment is<br />
            being carefully prepared.
          </h2>
          <div className="divider mb-8" />
          <p className="text-[var(--stone)] text-sm leading-relaxed mb-12">
            We are working to bring you a thoughtful, well-designed experience.
            Quality takes time.
          </p>
          <Link
            to="/"
            className="zen-button inline-block text-sm"
          >
            return home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 absolute bottom-0 left-0 right-0">
        <div className="divider mb-12" />
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[var(--mist)]">
          <p className="tracking-wider">MeSearch</p>
          <p className="tracking-wider">2025</p>
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

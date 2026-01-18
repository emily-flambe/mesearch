import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#8B7355] hover:text-[#5C4A3A] transition-colors duration-300"
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

// CSS-based leaf decoration component
function LeafDecoration({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { width: 16, height: 24 },
    md: { width: 24, height: 36 },
    lg: { width: 32, height: 48 },
  };
  const { width, height } = sizes[size];

  return (
    <svg
      viewBox="0 0 24 36"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 0C12 0 24 12 24 24C24 30 18.627 36 12 36C5.373 36 0 30 0 24C0 12 12 0 12 0Z"
        fill="currentColor"
      />
      <path
        d="M12 8L12 32"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M12 14L6 20M12 18L18 24M12 22L8 28"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
        fill="none"
      />
    </svg>
  );
}

// Organic blob shape component
function OrganicBlob({ className = '', variant = 1 }: { className?: string; variant?: 1 | 2 | 3 }) {
  const blobClass = `organic-blob-${variant}`;
  return (
    <div
      className={`absolute pointer-events-none ${blobClass} ${className}`}
      aria-hidden="true"
    />
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF6F1] font-sans-organic relative overflow-hidden">
      {/* Background organic texture */}
      <div className="fixed inset-0 organic-texture pointer-events-none" />

      {/* Decorative floating blobs */}
      <OrganicBlob
        variant={1}
        className="w-96 h-96 bg-[#B5C4A8]/20 -top-32 -right-32 float-gentle"
      />
      <OrganicBlob
        variant={2}
        className="w-64 h-64 bg-[#D9A08C]/15 top-1/3 -left-24 float-gentle-delayed"
      />
      <OrganicBlob
        variant={3}
        className="w-80 h-80 bg-[#B5C4A8]/10 bottom-0 right-1/4 float-gentle"
      />

      <header className="relative border-b border-[#8B9A7C]/20 bg-[#FAF6F1]/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LeafDecoration size="sm" className="text-[#8B9A7C]" />
            <h1 className="text-2xl font-serif-organic font-bold text-[#5C4A3A]">MeSearch</h1>
          </div>
          <nav className="flex items-center gap-8">
            <a
              href="#tests"
              className="text-[#8B7355] hover:text-[#C17C60] transition-colors duration-300 font-medium"
            >
              Tests
            </a>
            <a
              href="#about"
              className="text-[#8B7355] hover:text-[#C17C60] transition-colors duration-300 font-medium"
            >
              About
            </a>
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-6 py-24 text-center relative">
          {/* Decorative leaves */}
          <div className="absolute top-8 left-16 opacity-30">
            <LeafDecoration size="lg" className="text-[#8B9A7C] rotate-[-30deg]" />
          </div>
          <div className="absolute top-20 right-20 opacity-20">
            <LeafDecoration size="md" className="text-[#6B7A5C] rotate-[45deg]" />
          </div>
          <div className="absolute bottom-8 left-1/4 opacity-25">
            <LeafDecoration size="sm" className="text-[#C17C60] rotate-[15deg]" />
          </div>

          <h2 className="text-5xl md:text-6xl font-serif-organic font-bold text-[#5C4A3A] mb-6 leading-tight">
            Understand Yourself
            <span className="block text-[#8B9A7C]">Naturally</span>
          </h2>
          <p className="text-xl text-[#8B7355] mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Take scientifically-backed personality assessments, track your results over time,
            and discover insights that help you grow.
          </p>
          <a
            href="#tests"
            className="btn-primary-organic inline-block text-lg"
          >
            Begin Your Journey
          </a>

          {/* Organic divider */}
          <div className="organic-divider max-w-xs mx-auto mt-16" />
        </section>

        {/* Tests Section */}
        <section id="tests" className="mx-auto max-w-6xl px-6 py-16 relative">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif-organic font-bold text-[#5C4A3A] mb-3">
              Featured Assessments
            </h3>
            <p className="text-[#8B7355] max-w-lg mx-auto">
              Each assessment is carefully selected for its scientific validity or personal growth value.
            </p>
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
              subtitle="Six-Factor Model"
              slug="hexaco"
              description="Includes Honesty-Humility as a sixth factor. Excellent for predicting ethical behavior and workplace conduct."
              time="12 min"
              badge="research"
            />
            <TestCard
              title="Enneagram"
              subtitle="Nine Types"
              slug="enneagram"
              description="Explore your core motivations through nine distinct personality types. Beloved for personal growth and self-discovery."
              time="10 min"
              badge="discovery"
            />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative py-20 overflow-hidden">
          {/* Natural background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B9A7C] via-[#7A8B6E] to-[#6B7A5C]" />

          {/* Decorative elements */}
          <OrganicBlob
            variant={2}
            className="w-48 h-48 bg-white/10 -top-12 -right-12"
          />
          <OrganicBlob
            variant={1}
            className="w-32 h-32 bg-white/5 bottom-8 left-8"
          />

          <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
            <h3 className="text-3xl font-serif-organic font-bold text-white mb-4">
              Rooted in Science
            </h3>
            <p className="text-[#E8EDE4] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              We prioritize assessments with strong empirical foundations. Each test is clearly labeled
              so you understand exactly what you're exploring.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-8 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20">
                <span className="badge-research text-sm font-medium px-4 py-1.5 rounded-full inline-block">
                  Research-Backed
                </span>
                <p className="mt-3 text-[#E8EDE4]">
                  Strong empirical support from<br />peer-reviewed studies
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20">
                <span className="badge-discovery text-sm font-medium px-4 py-1.5 rounded-full inline-block">
                  Self-Discovery
                </span>
                <p className="mt-3 text-[#E8EDE4]">
                  Popular for personal<br />reflection and growth
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-[#8B9A7C]/20 py-10 bg-[#F5EDE3]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LeafDecoration size="sm" className="text-[#8B9A7C]" />
            <span className="font-serif-organic font-bold text-[#5C4A3A]">MeSearch</span>
          </div>
          <p className="text-[#8B7355] text-sm">
            Built with science, designed for insight.
          </p>
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
  subtitle?: string;
  slug: string;
  description: string;
  time: string;
  badge: BadgeType;
}) {
  const badgeStyles: Record<BadgeType, { className: string; label: string }> = {
    research: { className: 'badge-research', label: 'Research-Backed' },
    popular: { className: 'badge-research', label: 'Popular Assessment' },
    discovery: { className: 'badge-discovery', label: 'Self-Discovery' },
  };

  const { className: badgeClassName, label } = badgeStyles[badge];

  return (
    <div className="organic-card rounded-3xl p-7 relative corner-flourish overflow-hidden">
      {/* Subtle leaf accent in corner */}
      <div className="absolute top-4 right-4 opacity-15">
        <LeafDecoration size="sm" className="text-[#8B9A7C]" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={`${badgeClassName} text-xs font-medium px-3 py-1 rounded-full`}>
          {label}
        </span>
        <span className="text-[#8B7355] text-sm">{time}</span>
      </div>

      <h4 className="text-xl font-serif-organic font-bold text-[#5C4A3A] mb-1">
        {title}
      </h4>
      {subtitle && (
        <p className="text-sm text-[#C17C60] font-medium mb-3">{subtitle}</p>
      )}

      <p className="text-[#8B7355] text-sm mb-6 leading-relaxed">
        {description}
      </p>

      <Link
        to={`/test/${slug}`}
        className="btn-secondary-organic block w-full text-center"
      >
        Start Assessment
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F1] font-sans-organic relative overflow-hidden">
      {/* Background organic texture */}
      <div className="fixed inset-0 organic-texture pointer-events-none" />

      {/* Decorative blobs */}
      <OrganicBlob
        variant={1}
        className="w-72 h-72 bg-[#B5C4A8]/15 -top-20 -right-20 float-gentle"
      />
      <OrganicBlob
        variant={2}
        className="w-48 h-48 bg-[#D9A08C]/10 bottom-20 -left-16 float-gentle-delayed"
      />

      <header className="relative border-b border-[#8B9A7C]/20 bg-[#FAF6F1]/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <LeafDecoration size="sm" className="text-[#8B9A7C] group-hover:text-[#6B7A5C] transition-colors" />
            <span className="text-2xl font-serif-organic font-bold text-[#5C4A3A] group-hover:text-[#C17C60] transition-colors">
              MeSearch
            </span>
          </Link>
          <GitHubIcon />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-20 relative">
        <div className="organic-card rounded-3xl p-10 text-center relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-6 left-6 opacity-20">
            <LeafDecoration size="md" className="text-[#8B9A7C] rotate-[-15deg]" />
          </div>
          <div className="absolute bottom-6 right-6 opacity-15">
            <LeafDecoration size="sm" className="text-[#C17C60] rotate-[30deg]" />
          </div>

          {/* Growing seedling illustration - CSS only */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-t from-[#8B7355] to-[#B8A090] rounded-full opacity-30" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1 h-12 bg-[#8B9A7C]" />
            <LeafDecoration
              size="md"
              className="absolute bottom-12 left-1/2 -translate-x-1/2 -translate-x-4 text-[#8B9A7C] rotate-[-30deg]"
            />
            <LeafDecoration
              size="md"
              className="absolute bottom-14 left-1/2 translate-x-1 text-[#6B7A5C] rotate-[30deg]"
            />
          </div>

          <h2 className="text-2xl font-serif-organic font-bold text-[#5C4A3A] mb-4">
            Growing Soon
          </h2>
          <p className="text-[#8B7355] mb-8 leading-relaxed max-w-sm mx-auto">
            Like a seedling reaching for light, this assessment is still taking root.
            Check back soon to begin your exploration.
          </p>

          <Link
            to="/"
            className="btn-primary-organic inline-block"
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

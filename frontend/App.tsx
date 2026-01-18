import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-lavender-400 hover:text-lavender-600 transition-colors p-2 rounded-full hover:bg-lavender-50"
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-sky-50">
      <header className="bg-white/60 backdrop-blur-md border-b border-white/40 shadow-soft">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-rounded font-bold bg-gradient-to-r from-lavender-500 via-rose-400 to-peach-400 bg-clip-text text-transparent">
            MeSearch
          </h1>
          <nav className="flex items-center gap-2">
            <a
              href="#tests"
              className="px-5 py-2.5 text-lavender-600 hover:bg-lavender-100/60 rounded-full transition-all font-medium"
            >
              Tests
            </a>
            <a
              href="#about"
              className="px-5 py-2.5 text-lavender-600 hover:bg-lavender-100/60 rounded-full transition-all font-medium"
            >
              About
            </a>
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-28 text-center">
          <div className="inline-block mb-8 px-6 py-2 bg-gradient-to-r from-mint-100 to-sky-100 rounded-full">
            <span className="text-mint-700 font-medium text-sm">Discover your unique patterns</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-rounded font-bold text-slate-700 mb-8 leading-tight">
            Understand Yourself
            <span className="block bg-gradient-to-r from-lavender-500 via-rose-400 to-peach-400 bg-clip-text text-transparent">
              A Little Better
            </span>
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Take thoughtful personality assessments, reflect on your patterns over time,
            and gather insights across different frameworks.
          </p>
          <a
            href="#tests"
            className="inline-block bg-gradient-to-r from-lavender-400 to-rose-300 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-soft hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Explore Tests
          </a>
        </section>

        <section id="tests" className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-14">
            <h3 className="text-3xl font-rounded font-bold text-slate-700 mb-3">Featured Tests</h3>
            <p className="text-slate-400">Choose an assessment that resonates with you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestCard
              title="Big Five"
              subtitle="IPIP-NEO"
              slug="big-five"
              description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
              time="15 min"
              badge="research"
              gradient="from-lavender-100 to-lavender-50"
              accent="lavender"
            />
            <TestCard
              title="HEXACO"
              subtitle="Six Factors"
              slug="hexaco"
              description="Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct."
              time="12 min"
              badge="research"
              gradient="from-mint-100 to-mint-50"
              accent="mint"
            />
            <TestCard
              title="Enneagram"
              subtitle="Nine Types"
              slug="enneagram"
              description="Explore your core motivations through 9 personality types. Popular for personal growth and self-discovery."
              time="10 min"
              badge="discovery"
              gradient="from-peach-100 to-peach-50"
              accent="peach"
            />
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="bg-gradient-to-br from-lavender-100 via-rose-50 to-sky-100 rounded-3xl p-12 shadow-soft">
              <h3 className="text-3xl font-rounded font-bold text-slate-700 mb-6 text-center">
                The Science Behind It
              </h3>
              <p className="text-slate-500 text-lg text-center max-w-2xl mx-auto mb-10 leading-relaxed">
                We prioritize scientifically validated assessments. Each test is labeled with its research backing
                so you know exactly what you're getting.
              </p>
              <div className="flex justify-center gap-6 flex-wrap">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-soft">
                  <span className="inline-block bg-gradient-to-r from-mint-300 to-mint-400 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                    Research-Backed
                  </span>
                  <p className="text-slate-500 text-sm">Strong empirical support</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-soft">
                  <span className="inline-block bg-gradient-to-r from-lavender-300 to-lavender-400 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                    Self-Discovery
                  </span>
                  <p className="text-slate-500 text-sm">Popular for reflection</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-slate-400 font-medium">
            MeSearch — Built with science, designed for insight
          </p>
        </div>
      </footer>
    </div>
  );
}

type BadgeType = 'research' | 'popular' | 'discovery';
type AccentType = 'lavender' | 'mint' | 'peach' | 'sky' | 'rose';

function TestCard({
  title,
  subtitle,
  slug,
  description,
  time,
  badge,
  gradient,
  accent
}: {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  time: string;
  badge: BadgeType;
  gradient: string;
  accent: AccentType;
}) {
  const badgeStyles: Record<BadgeType, { classes: string; label: string }> = {
    research: {
      classes: 'bg-gradient-to-r from-mint-200 to-mint-300 text-mint-700',
      label: 'Research-Backed'
    },
    popular: {
      classes: 'bg-gradient-to-r from-sky-200 to-sky-300 text-sky-700',
      label: 'Popular'
    },
    discovery: {
      classes: 'bg-gradient-to-r from-lavender-200 to-lavender-300 text-lavender-700',
      label: 'Self-Discovery'
    },
  };

  const buttonStyles: Record<AccentType, string> = {
    lavender: 'from-lavender-300 to-lavender-400 hover:from-lavender-400 hover:to-lavender-500',
    mint: 'from-mint-300 to-mint-400 hover:from-mint-400 hover:to-mint-500',
    peach: 'from-peach-300 to-peach-400 hover:from-peach-400 hover:to-peach-500',
    sky: 'from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-500',
    rose: 'from-rose-300 to-rose-400 hover:from-rose-400 hover:to-rose-500',
  };

  const { classes, label } = badgeStyles[badge];

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white/50`}>
      <div className="flex items-center justify-between mb-5">
        <span className={`${classes} text-xs font-semibold px-3 py-1.5 rounded-full`}>
          {label}
        </span>
        <span className="text-slate-400 text-sm bg-white/60 px-3 py-1 rounded-full">{time}</span>
      </div>
      <h4 className="text-2xl font-rounded font-bold text-slate-700 mb-1">{title}</h4>
      <p className="text-slate-400 text-sm mb-4">{subtitle}</p>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{description}</p>
      <Link
        to={`/test/${slug}`}
        className={`block w-full bg-gradient-to-r ${buttonStyles[accent]} text-white py-3.5 rounded-2xl font-semibold shadow-soft hover:shadow-md transition-all duration-300 text-center`}
      >
        Begin Assessment
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-sky-50">
      <header className="bg-white/60 backdrop-blur-md border-b border-white/40 shadow-soft">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-rounded font-bold bg-gradient-to-r from-lavender-500 via-rose-400 to-peach-400 bg-clip-text text-transparent"
          >
            MeSearch
          </Link>
          <GitHubIcon />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="bg-gradient-to-br from-lavender-100 via-rose-50 to-peach-100 rounded-3xl p-12 shadow-soft border border-white/50 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-lavender-200 to-rose-200 rounded-full flex items-center justify-center shadow-soft">
            <svg
              className="w-10 h-10 text-lavender-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-rounded font-bold text-slate-700 mb-4">Coming Soon</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We're crafting this assessment with care. Check back soon for a thoughtful experience.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-lavender-400 to-rose-300 text-white px-8 py-3.5 rounded-full font-semibold shadow-soft hover:shadow-lg hover:scale-105 transition-all duration-300"
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

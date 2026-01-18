import { Routes, Route, Link } from 'react-router-dom';

function GitHubIcon() {
  return (
    <a
      href="https://github.com/emily-flambe/mesearch"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-gray-600 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">MeSearch</h1>
          <nav className="flex items-center gap-6">
            <a href="#tests" className="text-gray-600 hover:text-indigo-600 transition-colors">Tests</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a>
            <GitHubIcon />
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Understand Yourself Better
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Take scientifically-backed personality assessments, track your results over time,
            and discover insights across multiple frameworks.
          </p>
          <a
            href="#tests"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Explore Tests
          </a>
        </section>

        <section id="tests" className="mx-auto max-w-6xl px-4 py-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Tests</h3>
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

        <section id="about" className="bg-indigo-600 text-white py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">The Science Behind It</h3>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-6">
              We prioritize scientifically validated assessments. Each test is labeled with its research backing
              so you know exactly what you're getting.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Research-Backed</span>
                <p className="mt-2 text-indigo-200">Strong empirical support</p>
              </div>
              <div>
                <span className="bg-purple-400 text-white px-2 py-1 rounded text-xs font-medium">Self-Discovery</span>
                <p className="mt-2 text-indigo-200">Popular for reflection</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-gray-500">
          <p>&copy; 2025 MeSearch. Built with science, designed for insight.</p>
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
  const badgeStyles: Record<BadgeType, { bg: string; text: string; label: string }> = {
    research: { bg: 'bg-green-100', text: 'text-green-700', label: 'Research-Backed' },
    popular: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Popular Assessment' },
    discovery: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Self-Discovery' },
  };

  const { bg, text, label } = badgeStyles[badge];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span className={`${bg} ${text} text-xs font-medium px-2 py-1 rounded`}>
          {label}
        </span>
        <span className="text-gray-400 text-sm">{time}</span>
      </div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Link
        to={`/test/${slug}`}
        className="block w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
      >
        Start Test
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600">MeSearch</Link>
          <GitHubIcon />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We're working on bringing you this assessment. Check back soon!
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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

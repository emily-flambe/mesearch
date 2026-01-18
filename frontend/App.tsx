import { Routes, Route } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">MeSearch</h1>
          <nav className="flex gap-6">
            <a href="#tests" className="text-gray-600 hover:text-indigo-600 transition-colors">Tests</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Sign In
            </button>
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
          <div className="flex gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors">
              Explore Tests
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </section>

        <section id="tests" className="mx-auto max-w-6xl px-4 py-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Tests</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <TestCard
              title="Big Five (IPIP-NEO)"
              description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
              time="15 min"
              badge="research"
            />
            <TestCard
              title="HEXACO"
              description="Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct."
              time="12 min"
              badge="research"
            />
            <TestCard
              title="Enneagram"
              description="Explore your core motivations through 9 personality types. Popular for personal growth and self-discovery."
              time="10 min"
              badge="discovery"
            />
          </div>
        </section>

        <section className="bg-indigo-600 text-white py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">Track Your Growth Over Time</h3>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Create an account to save your results, retake tests periodically,
              and see how your personality evolves.
            </p>
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
  description,
  time,
  badge
}: {
  title: string;
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
      <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
        Start Test
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

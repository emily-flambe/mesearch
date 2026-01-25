import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getCategoryById, TestInfo } from '../data/test-categories';

function RatingDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < value
              ? 'bg-[var(--color-champagne)]'
              : 'bg-[var(--color-border)]'
          }`}
        />
      ))}
    </div>
  );
}

function TestCard({ test }: { test: TestInfo }) {
  const href = test.link || `/test/${test.slug}`;
  return (
    <div className="card-premium rounded-lg p-8 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Seriousness</span>
            <RatingDots value={test.seriousness} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Fun</span>
            <RatingDots value={test.fun} />
          </div>
        </div>
        <span className="text-[var(--color-text-muted)] text-xs tracking-wide">{test.time}</span>
      </div>
      <h4 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-1 transition-colors duration-300">{test.title}</h4>
      <p className="text-[var(--color-champagne)]/70 text-sm mb-4 tracking-wide">{test.subtitle}</p>
      <p className="text-[var(--color-text-muted)] text-xs mb-3 tracking-wide">
        {test.keywords.join(' · ')}
      </p>
      <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed transition-colors duration-300">{test.description}</p>
      <Link
        to={href}
        className="btn-ghost block w-full py-3 rounded text-center text-xs tracking-widest uppercase"
      >
        Begin Assessment
      </Link>
    </div>
  );
}

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getCategoryById(categoryId) : undefined;

  if (!category) {
    return (
      <Layout>
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center">
            <h1 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-4">
              Category Not Found
            </h1>
            <Link to="/tests" className="text-[var(--color-champagne)] hover:underline">
              Back to Tests
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                to="/tests"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-champagne)] transition-colors"
              >
                Tests
              </Link>
            </li>
            <li className="text-[var(--color-text-muted)]">/</li>
            <li className="text-[var(--color-text-primary)]">{category.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-4xl mb-4">{category.icon}</div>
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">{category.subtitle}</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-text-primary)] transition-colors duration-300 mb-4">
            {category.title}
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.tests.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            to="/tests"
            className="btn-ghost inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
          >
            ← All Categories
          </Link>
        </div>
      </main>
    </Layout>
  );
}

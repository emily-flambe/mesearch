import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { categories, Category } from '../data/test-categories';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

function CategoryCard({ category }: { category: Category }) {
  const testCount = category.tests.length;
  return (
    <Link to={`/tests/${category.id}`} className="card-premium rounded-lg p-8 block hover:border-[var(--color-champagne)]/30 transition-colors">
      <div className="mb-6">
        <span className="text-[var(--color-text-muted)] text-xs tracking-wide">
          {testCount} {testCount === 1 ? 'test' : 'tests'}
        </span>
      </div>
      <h4 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
        {category.title}
      </h4>
      <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed transition-colors duration-300">
        {category.description}
      </p>
    </Link>
  );
}

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

function MiniTestCard() {
  return (
    <div className="card-premium rounded-lg p-8 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Seriousness</span>
            <RatingDots value={1} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Fun</span>
            <RatingDots value={1} />
          </div>
        </div>
        <span className="text-[var(--color-text-muted)] text-xs tracking-wide">1 min</span>
      </div>
      <h4 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-1 transition-colors duration-300">Mini-Test</h4>
      <p className="text-[var(--color-champagne)]/70 text-sm mb-4 tracking-wide">5 Questions</p>
      <p className="text-[var(--color-text-muted)] text-xs mb-3 tracking-wide">
        Debug · Testing · Quick
      </p>
      <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed transition-colors duration-300">
        A 5-question sampler for debugging and automated testing. One question from each Big Five dimension.
      </p>
      <Link
        to="/test/mini-test"
        className="btn-ghost block w-full py-3 rounded text-center text-xs tracking-widest uppercase"
      >
        Begin Assessment
      </Link>
    </div>
  );
}

export function TestsPage() {
  const { flags } = useFeatureFlags();

  return (
    <Layout>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center mb-16">
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">Assessments</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-text-primary)] transition-colors duration-300 mb-4">
            Explore Tests
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Browse our collection of personality assessments organized by category.
            Each test is rated on Seriousness (research validity) and Fun (engagement).
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Mini-Test - Admin/Test Users Only */}
        {flags.mini_test && (
          <div className="mt-12" data-testid="mini-test-section">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs tracking-wide uppercase">
                Debug / Testing Only
              </span>
            </div>
            <div className="max-w-md mx-auto">
              <MiniTestCard />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

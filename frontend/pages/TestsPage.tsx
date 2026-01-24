import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

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

function TestCard({
  title,
  subtitle,
  slug,
  keywords,
  description,
  time,
  seriousness,
  fun,
  link,
}: {
  title: string;
  subtitle: string;
  slug: string;
  keywords: string[];
  description: string;
  time: string;
  seriousness: number;
  fun: number;
  link?: string;
}) {
  const href = link || `/test/${slug}`;
  return (
    <div className="card-premium rounded-lg p-8 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Seriousness</span>
            <RatingDots value={seriousness} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-[10px] tracking-wide uppercase">Fun</span>
            <RatingDots value={fun} />
          </div>
        </div>
        <span className="text-[var(--color-text-muted)] text-xs tracking-wide">{time}</span>
      </div>
      <h4 className="font-display text-2xl font-medium text-[var(--color-text-primary)] mb-1 transition-colors duration-300">{title}</h4>
      <p className="text-[var(--color-champagne)]/70 text-sm mb-4 tracking-wide">{subtitle}</p>
      <p className="text-[var(--color-text-muted)] text-xs mb-3 tracking-wide">
        {keywords.join(' · ')}
      </p>
      <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed transition-colors duration-300">{description}</p>
      <Link
        to={href}
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
            Each test is rated on two dimensions: Seriousness reflects the depth of research
            supporting its validity, while Fun captures how engaging the experience is.
          </p>
        </div>

        {/* Primary Tests - High scientific validity */}
        <div className="grid md:grid-cols-3 gap-8">
          <TestCard
            title="Big Five"
            subtitle="IPIP-NEO"
            slug="big-five"
            keywords={['Traits', 'Behavior', 'Stability']}
            description="The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
            time="15 min"
            seriousness={5}
            fun={3}
          />
          <TestCard
            title="HEXACO"
            subtitle="Six Dimensions"
            slug="hexaco"
            link="/hexaco"
            keywords={['Ethics', 'Honesty', 'Integrity']}
            description="Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct with precision."
            time="12 min"
            seriousness={5}
            fun={2}
          />
          <TestCard
            title="Attachment Style"
            subtitle="ECR-RS"
            slug="ecr"
            keywords={['Relationships', 'Anxiety', 'Avoidance']}
            description="Understand your attachment patterns in close relationships. Measures anxiety and avoidance on continuous dimensions."
            time="5 min"
            seriousness={5}
            fun={4}
          />
        </div>

        {/* Second Row */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <TestCard
            title="Moral Foundations"
            subtitle="MFQ-30"
            slug="mfq"
            keywords={['Ethics', 'Values', 'Politics']}
            description="Discover your moral intuitions across five foundations: Care, Fairness, Loyalty, Authority, and Purity. Based on Jonathan Haidt's research."
            time="10 min"
            seriousness={4}
            fun={4}
          />
          <TestCard
            title="Dark Triad"
            subtitle="SD3"
            slug="sd3"
            keywords={['Strategy', 'Confidence', 'Boldness']}
            description="Measures subclinical Machiavellianism, Narcissism, and Psychopathy. High engagement due to 'forbidden' appeal."
            time="5 min"
            seriousness={4}
            fun={5}
          />
          <TestCard
            title="CRT"
            subtitle="Cognitive Reflection"
            slug="crt"
            keywords={['Reasoning', 'Reflection', 'Intuition']}
            description="Test your ability to override intuitive wrong answers through deliberate reflection. The famous 'bat and ball' problem and more."
            time="5 min"
            seriousness={4}
            fun={5}
          />
        </div>

        {/* Third Row */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <TestCard
            title="RMET"
            subtitle="Eyes Test"
            slug="rmet"
            keywords={['Social Cognition', 'Empathy', 'Theory of Mind']}
            description="Measure your ability to recognize emotions and mental states from eye expressions. Research-backed assessment of social cognition."
            time="10 min"
            seriousness={4}
            fun={4}
          />
          <TestCard
            title="Myers-Briggs"
            subtitle="OEJTS"
            slug="mbti"
            keywords={['Types', 'Cognitive', 'Popular']}
            description="The world's most popular personality test. Discover your type across four dichotomies: E/I, S/N, T/F, J/P."
            time="10 min"
            seriousness={2}
            fun={5}
          />
          <TestCard
            title="Enneagram"
            subtitle="Nine Types"
            slug="enneagram"
            keywords={['Motivations', 'Growth', 'Archetypes']}
            description="Explore your core motivations through nine distinct personality archetypes. Renowned for personal growth insights."
            time="10 min"
            seriousness={2}
            fun={5}
          />
        </div>

        {/* Fourth Row */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <TestCard
            title="Communication Styles"
            subtitle="Five Styles"
            slug="communication-styles"
            keywords={['Relationships', 'Appreciation', 'Connection']}
            description="Discover how you prefer to give and receive appreciation. Learn your primary style for deeper connections."
            time="5 min"
            seriousness={2}
            fun={5}
          />
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
              <TestCard
                title="Mini-Test"
                subtitle="5 Questions"
                slug="mini-test"
                keywords={['Debug', 'Testing', 'Quick']}
                description="A 5-question sampler for debugging and automated testing. One question from each Big Five dimension."
                time="1 min"
                seriousness={1}
                fun={1}
              />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

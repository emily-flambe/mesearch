import { Routes, Route, Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import HexacoAssessment from './components/HexacoAssessment';
import HexacoResults from './components/HexacoResults';
import { HexacoResponse, calculateScores, DimensionScore } from './data/hexaco-scoring';
import BigFiveAssessment from './components/BigFiveAssessment';
import BigFiveResults from './components/BigFiveResults';
import MFQAssessment from './components/MFQAssessment';
import MFQResults from './components/MFQResults';
import SD3Assessment from './components/SD3Assessment';
import SD3Results from './components/SD3Results';
import { enneagramItems, likertScale, type LikertValue } from './data/enneagram-items';
import { calculateEnneagramResult, type EnneagramResult } from './data/enneagram-scoring';
import { EnneagramResults } from './components/EnneagramResults';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FeatureFlagsProvider, useFeatureFlags } from './contexts/FeatureFlagsContext';
import { Layout, ThemeProvider } from './components/Layout';
import { ResultsHistory } from './pages/ResultsHistory';
import { ResultDetail } from './pages/ResultDetail';
import { Settings } from './pages/Settings';
import { PublicProfile } from './pages/PublicProfile';
import { PublicResultDetail } from './pages/PublicResultDetail';
import MiniTestAssessment from './components/MiniTestAssessment';
import LoveLanguagesAssessment from './components/LoveLanguagesAssessment';
import LoveLanguagesResults from './components/LoveLanguagesResults';
import ECRAssessment from './components/ECRAssessment';
import ECRResults from './components/ECRResults';
import CRTAssessment from './components/CRTAssessment';
import MBTIAssessment from './components/MBTIAssessment';
import MBTIResults from './components/MBTIResults';
import RMETAssessment from './components/RMETAssessment';
import RMETResults from './components/RMETResults';
import { TestsPage } from './pages/TestsPage';

function HomePage() {
  return (
    <Layout>
      <main>
        {/* Hero Section */}
        <section className="relative mx-auto max-w-6xl px-6 py-32 text-center overflow-hidden">
          {/* Subtle gradient orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[var(--color-accent-purple)] via-transparent to-transparent opacity-60 pointer-events-none" />

          <h2 className="font-display text-6xl md:text-7xl lg:text-8xl font-medium text-[var(--color-text-primary)] mb-8 leading-tight tracking-tight transition-colors duration-300">
            Do Research
            <span className="block text-gold-gradient italic mt-2 text-4xl md:text-5xl lg:text-6xl">On Yourself</span>
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed font-light transition-colors duration-300">
            Scientifically-backed and/or bullshit personality assessments designed to reveal insights
            across multiple psychological frameworks and/or waste your time.
          </p>
          <div className="flex justify-center mb-12">
            <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2 font-light transition-colors duration-300 text-left">
              <li>Track your evolution over time.</li>
              <li>Argue with your friends and lovers about whether Myers-Briggs is bullshit.</li>
              <li>Generate filler for your Tinder profile.</li>
              <li>Question the nature of your reality.</li>
            </ul>
          </div>
          <Link
            to="/tests"
            className="btn-gold inline-block px-10 py-4 rounded text-sm tracking-widest uppercase"
          >
            Explore Tests
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-12 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-xl text-gold-gradient mb-4">Mesearch</p>
          <p className="text-[var(--color-text-muted)]/50 text-xs">&copy; 2026</p>
        </div>
      </footer>
    </Layout>
  );
}

// Generic placeholder for tests not yet implemented
function ComingSoonTestPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="card-premium rounded-lg p-12">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-[var(--color-champagne)]/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--color-champagne)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-[var(--color-champagne)] text-xs tracking-[0.3em] uppercase mb-4">In Development</p>
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">Coming Soon</h2>
          <p className="text-[var(--color-text-secondary)] mb-10 leading-relaxed transition-colors duration-300">
            We are meticulously crafting this assessment to ensure
            the highest standards of accuracy and insight.
          </p>
          <Link
            to="/"
            className="btn-gold inline-block px-8 py-3 rounded text-xs tracking-widest uppercase"
          >
            Return Home
          </Link>
        </div>
      </main>
    </Layout>
  );
}

// Enneagram Assessment Page
type EnneagramPhase = 'intro' | 'questions' | 'results';

function EnneagramTestPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<EnneagramPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, LikertValue>>({});
  const [result, setResult] = useState<EnneagramResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const totalQuestions = enneagramItems.length;
  const currentItem = enneagramItems[currentQuestion];

  // Save results to backend if user is logged in
  async function saveResults(calculatedResult: EnneagramResult) {
    if (!user) return;

    setSaveStatus('saving');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          test_type: 'enneagram',
          scores: calculatedResult,
        }),
      });

      if (res.ok) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }

  const handleAnswer = (value: LikertValue) => {
    setResponses((prev) => ({ ...prev, [currentItem.id]: value }));

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Calculate results
        const calculatedResult = calculateEnneagramResult({
          ...responses,
          [currentItem.id]: value,
        });
        setResult(calculatedResult);
        setPhase('results');
        // Auto-save if logged in
        saveResults(calculatedResult);
      }
    }, 200);
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentQuestion(0);
    setResponses({});
    setResult(null);
    setSaveStatus('idle');
  };

  return (
    <Layout>
      <main className="mx-auto max-w-3xl px-6 py-12">
        {phase === 'intro' && (
          <div className="text-center">
            <div className="card-premium rounded-lg p-12">
              <p className="text-[var(--color-discovery)] text-xs tracking-[0.3em] uppercase mb-4">
                Self-Discovery Tool
              </p>
              <h1 className="font-display text-4xl font-medium text-[var(--color-text-primary)] mb-4 transition-colors duration-300">
                Enneagram Assessment
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed max-w-lg mx-auto transition-colors duration-300">
                Explore your core motivations through nine distinct personality archetypes.
                This assessment will help you understand your patterns of thinking, feeling, and behaving.
              </p>

              <div className="bg-[var(--color-discovery)]/10 border border-[var(--color-discovery-border)] rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
                <p className="text-[var(--color-discovery)] text-sm font-medium mb-1">
                  Important Note
                </p>
                <p className="text-[var(--color-text-muted)] text-xs">
                  The Enneagram is a popular framework for self-reflection but lacks scientific validation.
                  Use these results for personal exploration, not diagnosis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~10 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{totalQuestions} questions</span>
                </div>
              </div>

              <button
                onClick={() => setPhase('questions')}
                className="btn-gold px-10 py-4 rounded text-sm tracking-widest uppercase"
              >
                Begin Assessment
              </button>
            </div>
          </div>
        )}

        {phase === 'questions' && currentItem && (
          <div>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-2">
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-1 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-champagne)] transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="card-premium rounded-lg p-8 md:p-12">
              <p className="font-display text-2xl md:text-3xl text-[var(--color-text-primary)] mb-10 leading-relaxed text-center transition-colors duration-300">
                {currentItem.text}
              </p>

              {/* Likert scale */}
              <div className="space-y-3">
                {likertScale.map((option) => {
                  const isSelected = responses[currentItem.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[var(--color-champagne)] bg-[var(--color-champagne)]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-champagne)]/50 hover:bg-[var(--color-bg-tertiary)]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[var(--color-champagne)] bg-[var(--color-champagne)]'
                              : 'border-[var(--color-text-muted)]'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-[var(--color-bg-primary)]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            isSelected
                              ? 'text-[var(--color-champagne)]'
                              : 'text-[var(--color-text-secondary)]'
                          } transition-colors`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation hint */}
            <p className="text-center text-[var(--color-text-muted)] text-xs mt-6">
              Select an option to continue
            </p>
          </div>
        )}

        {phase === 'results' && result && (
          <EnneagramResults result={result} onRetake={handleRetake} />
        )}
      </main>
    </Layout>
  );
}

// Route handler that decides which test to show
function TestRouter() {
  const { slug } = useParams<{ slug: string }>();
  const { flags } = useFeatureFlags();

  if (slug === 'enneagram') {
    return <EnneagramTestPage />;
  }

  if (slug === 'communication-styles') {
    return <LoveLanguagesAssessment />;
  }

  if (slug === 'ecr') {
    return <ECRAssessment />;
  }

  if (slug === 'mini-test') {
    // Only allow access if feature flag is enabled
    if (!flags.mini_test) {
      return <ComingSoonTestPage />;
    }
    return <MiniTestAssessment />;
  }

  if (slug === 'crt') {
    return <CRTAssessment />;
  }

  if (slug === 'mbti') {
    return <MBTIAssessment />;
  }

  if (slug === 'mfq') {
    return <MFQAssessment />;
  }

  if (slug === 'rmet') {
    return <RMETAssessment />;
  }

  if (slug === 'sd3') {
    return <SD3Assessment />;
  }

  // All other tests show coming soon
  return <ComingSoonTestPage />;
}

export default function App() {
  const [hexacoScores, setHexacoScores] = useState<DimensionScore[] | null>(null);

  const handleHexacoComplete = (responses: HexacoResponse[]) => {
    const scores = calculateScores(responses);
    setHexacoScores(scores);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <FeatureFlagsProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/my-results" element={<ResultsHistory />} />
            <Route path="/results/:id" element={<ResultDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/u/:username" element={<PublicProfile />} />
            <Route path="/u/:username/results/:id" element={<PublicResultDetail />} />
            <Route path="/test/big-five" element={<BigFiveAssessment />} />
            <Route path="/test/big-five/results" element={<BigFiveResults />} />
            <Route path="/test/communication-styles" element={<LoveLanguagesAssessment />} />
            <Route path="/test/communication-styles/results" element={<LoveLanguagesResults />} />
            <Route path="/test/ecr/results" element={<ECRResults />} />
            <Route path="/test/mbti" element={<MBTIAssessment />} />
            <Route path="/test/mbti/results" element={<MBTIResults />} />
            <Route path="/test/mfq" element={<MFQAssessment />} />
            <Route path="/test/mfq/results" element={<MFQResults />} />
            <Route path="/test/rmet" element={<RMETAssessment />} />
            <Route path="/test/rmet/results" element={<RMETResults />} />
            <Route path="/test/sd3" element={<SD3Assessment />} />
            <Route path="/test/sd3/results" element={<SD3Results />} />
            <Route path="/test/:slug" element={<TestRouter />} />
            <Route
              path="/hexaco"
              element={<HexacoAssessment onComplete={handleHexacoComplete} />}
            />
            <Route
              path="/hexaco/results"
              element={<HexacoResults scores={hexacoScores} />}
            />
          </Routes>
        </FeatureFlagsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

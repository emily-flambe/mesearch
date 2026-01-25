export interface TestInfo {
  title: string;
  subtitle: string;
  slug: string;
  keywords: string[];
  description: string;
  time: string;
  seriousness: number;
  fun: number;
  link?: string;
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tests: TestInfo[];
}

export const categories: Category[] = [
  {
    id: 'personality',
    title: 'Personality',
    subtitle: 'Trait-based assessments',
    description: 'Explore your fundamental personality traits through scientifically validated and popular frameworks.',
    tests: [
      {
        title: 'Big Five',
        subtitle: 'IPIP-NEO',
        slug: 'big-five',
        keywords: ['Traits', 'Behavior', 'Stability'],
        description: 'The gold standard in personality psychology. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
        time: '15 min',
        seriousness: 5,
        fun: 3,
      },
      {
        title: 'HEXACO',
        subtitle: 'Six Dimensions',
        slug: 'hexaco',
        link: '/hexaco',
        keywords: ['Ethics', 'Honesty', 'Integrity'],
        description: 'Six-factor model including Honesty-Humility. Predicts ethical behavior and workplace conduct with precision.',
        time: '12 min',
        seriousness: 5,
        fun: 2,
      },
      {
        title: 'Myers-Briggs',
        subtitle: 'OEJTS',
        slug: 'mbti',
        keywords: ['Types', 'Cognitive', 'Popular'],
        description: "The world's most popular personality test. Discover your type across four dichotomies: E/I, S/N, T/F, J/P.",
        time: '10 min',
        seriousness: 2,
        fun: 5,
      },
      {
        title: 'Enneagram',
        subtitle: 'Nine Types',
        slug: 'enneagram',
        keywords: ['Motivations', 'Growth', 'Archetypes'],
        description: 'Explore your core motivations through nine distinct personality archetypes. Renowned for personal growth insights.',
        time: '10 min',
        seriousness: 2,
        fun: 5,
      },
      {
        title: 'Dark Triad',
        subtitle: 'SD3',
        slug: 'sd3',
        keywords: ['Strategy', 'Confidence', 'Boldness'],
        description: "Measures subclinical Machiavellianism, Narcissism, and Psychopathy. High engagement due to 'forbidden' appeal.",
        time: '5 min',
        seriousness: 4,
        fun: 5,
      },
    ],
  },
  {
    id: 'iat',
    title: 'Implicit Association Tests',
    subtitle: 'Reaction-time based measures',
    description: 'Measure automatic associations through reaction time. Educational tools for exploring implicit cognition.',
    tests: [
      {
        title: 'Flowers-Insects IAT',
        subtitle: 'Implicit Association Test',
        slug: 'iat',
        keywords: ['Reaction Time', 'Automatic Associations', 'Self-Reflection'],
        description: 'Measure automatic associations between flowers/insects and pleasant/unpleasant concepts. A practice IAT to learn the format.',
        time: '5-10 min',
        seriousness: 3,
        fun: 4,
      },
      {
        title: 'Gender-Career IAT',
        subtitle: 'Implicit Association Test',
        slug: 'gender-career-iat',
        keywords: ['Gender', 'Career', 'Implicit Bias'],
        description: 'Explore implicit associations between gender and career vs. family concepts. Based on Project Implicit research.',
        time: '5-10 min',
        seriousness: 4,
        fun: 3,
      },
      {
        title: 'Race IAT',
        subtitle: 'Implicit Association Test',
        slug: 'race-iat',
        keywords: ['Race', 'Implicit Bias', 'Self-Reflection'],
        description: 'Examine implicit associations between race and evaluative concepts. Educational tool for self-reflection on racial attitudes.',
        time: '5-10 min',
        seriousness: 5,
        fun: 2,
      },
      {
        title: 'Skin-Tone IAT',
        subtitle: 'Implicit Association Test',
        slug: 'skin-tone-iat',
        keywords: ['Skin Tone', 'Implicit Bias', 'Self-Reflection'],
        description: 'Explore implicit preferences related to skin tone. Educational tool based on Project Implicit methodology.',
        time: '5-10 min',
        seriousness: 5,
        fun: 2,
      },
      {
        title: 'Weapons IAT',
        subtitle: 'Implicit Association Test',
        slug: 'weapons-iat',
        keywords: ['Weapons', 'Race', 'Implicit Bias'],
        description: 'Examine implicit associations between race and weapon/harmless object categorization. Based on classic implicit bias research.',
        time: '5-10 min',
        seriousness: 5,
        fun: 2,
      },
    ],
  },
  {
    id: 'empathy',
    title: 'Empathy & Social Cognition',
    subtitle: 'Understanding others',
    description: 'Assess your ability to understand emotions, mental states, and social dynamics.',
    tests: [
      {
        title: 'RMET',
        subtitle: 'Eyes Test',
        slug: 'rmet',
        keywords: ['Social Cognition', 'Empathy', 'Theory of Mind'],
        description: 'Measure your ability to recognize emotions and mental states from eye expressions. Research-backed assessment of social cognition.',
        time: '10 min',
        seriousness: 4,
        fun: 4,
      },
    ],
  },
  {
    id: 'values',
    title: 'Values & Morality',
    subtitle: 'Ethical frameworks',
    description: 'Discover your moral intuitions and the values that guide your ethical decision-making.',
    tests: [
      {
        title: 'Moral Foundations',
        subtitle: 'MFQ-30',
        slug: 'mfq',
        keywords: ['Ethics', 'Values', 'Politics'],
        description: "Discover your moral intuitions across five foundations: Care, Fairness, Loyalty, Authority, and Purity. Based on Jonathan Haidt's research.",
        time: '10 min',
        seriousness: 4,
        fun: 4,
      },
    ],
  },
  {
    id: 'cognitive',
    title: 'Cognitive',
    subtitle: 'Thinking patterns',
    description: 'Explore how you think, reason, and make decisions.',
    tests: [
      {
        title: 'CRT',
        subtitle: 'Cognitive Reflection',
        slug: 'crt',
        keywords: ['Reasoning', 'Reflection', 'Intuition'],
        description: "Test your ability to override intuitive wrong answers through deliberate reflection. The famous 'bat and ball' problem and more.",
        time: '5 min',
        seriousness: 4,
        fun: 5,
      },
    ],
  },
  {
    id: 'relationships',
    title: 'Relationships',
    subtitle: 'Connection patterns',
    description: 'Understand how you connect with others, express appreciation, and form attachments.',
    tests: [
      {
        title: 'Attachment Style',
        subtitle: 'ECR-RS',
        slug: 'ecr',
        keywords: ['Relationships', 'Anxiety', 'Avoidance'],
        description: 'Understand your attachment patterns in close relationships. Measures anxiety and avoidance on continuous dimensions.',
        time: '5 min',
        seriousness: 5,
        fun: 4,
      },
      {
        title: 'Communication Styles',
        subtitle: 'Five Styles',
        slug: 'communication-styles',
        keywords: ['Relationships', 'Appreciation', 'Connection'],
        description: 'Discover how you prefer to give and receive appreciation. Learn your primary style for deeper connections.',
        time: '5 min',
        seriousness: 2,
        fun: 5,
      },
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((cat) => cat.id === id);
}

export function getTestBySlug(slug: string): TestInfo | undefined {
  for (const category of categories) {
    const test = category.tests.find((t) => t.slug === slug);
    if (test) return test;
  }
  return undefined;
}

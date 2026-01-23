// Open Extended Jungian Type Scales (OEJTS) 1.2
// Source: https://openpsychometrics.org/tests/OEJTS/
// License: Creative Commons (with attribution)
// Attribution: Eric Jorgenson, Open Psychometrics

export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';
export type Pole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface Item {
  id: number;
  leftText: string; // Option at value 1
  rightText: string; // Option at value 5
  dimension: Dimension;
  leftPole: Pole; // What pole the left option (value 1) measures
  rightPole: Pole; // What pole the right option (value 5) measures
}

export interface DimensionInfo {
  code: Dimension;
  name: string;
  leftPole: {
    code: Pole;
    name: string;
    description: string;
  };
  rightPole: {
    code: Pole;
    name: string;
    description: string;
  };
  color: string;
}

export const dimensionInfo: Record<Dimension, DimensionInfo> = {
  EI: {
    code: 'EI',
    name: 'Extraversion vs Introversion',
    leftPole: {
      code: 'E',
      name: 'Extraversion',
      description:
        'You tend to gain energy from social interaction, prefer to process thoughts externally, and focus on the outer world of people and activities.',
    },
    rightPole: {
      code: 'I',
      name: 'Introversion',
      description:
        'You tend to gain energy from solitude, prefer to process thoughts internally, and focus on your inner world of ideas and reflections.',
    },
    color: '#f97316', // orange
  },
  SN: {
    code: 'SN',
    name: 'Sensing vs Intuition',
    leftPole: {
      code: 'S',
      name: 'Sensing',
      description:
        'You tend to focus on concrete facts and details, trust direct experience, and prefer practical, realistic approaches.',
    },
    rightPole: {
      code: 'N',
      name: 'Intuition',
      description:
        'You tend to focus on patterns and possibilities, trust hunches and insights, and prefer imaginative, theoretical approaches.',
    },
    color: '#22c55e', // green
  },
  TF: {
    code: 'TF',
    name: 'Thinking vs Feeling',
    leftPole: {
      code: 'T',
      name: 'Thinking',
      description:
        'You tend to make decisions based on logic and objective analysis, prioritize fairness and consistency, and value truth over tact.',
    },
    rightPole: {
      code: 'F',
      name: 'Feeling',
      description:
        'You tend to make decisions based on values and personal impact, prioritize harmony and empathy, and value compassion over detachment.',
    },
    color: '#3b82f6', // blue
  },
  JP: {
    code: 'JP',
    name: 'Judging vs Perceiving',
    leftPole: {
      code: 'J',
      name: 'Judging',
      description:
        'You tend to prefer structure and planning, like decisions to be made, and feel more comfortable with clear schedules and closure.',
    },
    rightPole: {
      code: 'P',
      name: 'Perceiving',
      description:
        'You tend to prefer flexibility and spontaneity, like to keep options open, and feel more comfortable with adaptability and open-endedness.',
    },
    color: '#a855f7', // purple
  },
};

// Type descriptions for all 16 MBTI types
export const typeDescriptions: Record<string, { name: string; description: string }> = {
  ISTJ: {
    name: 'The Inspector',
    description:
      'Quiet, serious, thorough and dependable. Practical, matter-of-fact, realistic, and responsible. Work steadily toward goals, able to concentrate in spite of distractions.',
  },
  ISFJ: {
    name: 'The Protector',
    description:
      'Quiet, friendly, responsible, and conscientious. Committed and steady in meeting obligations. Thorough, painstaking, and accurate. Loyal, considerate, and notice what others need.',
  },
  INFJ: {
    name: 'The Counselor',
    description:
      'Seek meaning and connection in ideas, relationships, and material possessions. Want to understand what motivates people. Conscientious and committed to firm values.',
  },
  INTJ: {
    name: 'The Mastermind',
    description:
      'Have original minds and great drive for implementing ideas. Skeptical and independent, with high standards of competence and performance. Long-range thinkers with a clear vision.',
  },
  ISTP: {
    name: 'The Craftsman',
    description:
      'Tolerant and flexible, quiet observers until a problem appears, then act quickly to find workable solutions. Analyze what makes things work and organize facts using logical principles.',
  },
  ISFP: {
    name: 'The Composer',
    description:
      'Quiet, friendly, sensitive, and kind. Enjoy the present moment. Like to have their own space and work within their own time frame. Loyal and committed to values and people.',
  },
  INFP: {
    name: 'The Healer',
    description:
      'Idealistic, loyal to their values and people who are important to them. Want an external life congruent with values. Curious, quick to see possibilities, catalysts for implementing ideas.',
  },
  INTP: {
    name: 'The Architect',
    description:
      'Seek to develop logical explanations for everything that interests them. Theoretical and abstract, interested more in ideas than social interaction. Quiet, contained, flexible, and adaptable.',
  },
  ESTP: {
    name: 'The Dynamo',
    description:
      'Flexible and tolerant, pragmatic with a focus on immediate results. Theories and conceptual explanations bore them. Energetic and full of fun, spontaneous and adaptable.',
  },
  ESFP: {
    name: 'The Performer',
    description:
      'Outgoing, friendly, and accepting. Exuberant lovers of life, people, and material comforts. Enjoy working with others to make things happen. Bring common sense and fun to any situation.',
  },
  ENFP: {
    name: 'The Champion',
    description:
      'Warmly enthusiastic and imaginative. See life as full of possibilities. Make connections between events and information quickly. Want affirmation from others, and readily give appreciation.',
  },
  ENTP: {
    name: 'The Visionary',
    description:
      'Quick, ingenious, stimulating, alert, and outspoken. Resourceful in solving new and challenging problems. Adept at generating conceptual possibilities and analyzing them strategically.',
  },
  ESTJ: {
    name: 'The Supervisor',
    description:
      'Practical, realistic, matter-of-fact. Decisive, quickly move to implement decisions. Organize projects and people to get things done. Forceful in implementing plans.',
  },
  ESFJ: {
    name: 'The Provider',
    description:
      'Warmhearted, conscientious, and cooperative. Want harmony in environment, work with determination to establish it. Like to work with others to complete tasks accurately and on time.',
  },
  ENFJ: {
    name: 'The Teacher',
    description:
      'Warm, empathetic, responsive, and responsible. Highly attuned to the emotions and needs of others. Find potential in everyone, want to help others fulfill their potential.',
  },
  ENTJ: {
    name: 'The Commander',
    description:
      'Frank, decisive, assume leadership readily. Quickly see illogical and inefficient procedures and policies. Develop and implement comprehensive systems to solve organizational problems.',
  },
};

// 32 OEJTS items (8 per dimension)
// Each item is a bipolar pair rated on a 5-point scale
// Value 1 = strongly identifies with left option
// Value 5 = strongly identifies with right option
export const items: Item[] = [
  // === EXTRAVERSION vs INTROVERSION (EI) ===
  {
    id: 1,
    leftText: 'Bored by time alone',
    rightText: 'Needs time alone',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },
  {
    id: 2,
    leftText: 'Energetic',
    rightText: 'Mellow',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },
  {
    id: 3,
    leftText: 'Works best in groups',
    rightText: 'Works best alone',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },
  {
    id: 4,
    leftText: 'Gets fired up by parties',
    rightText: 'Gets worn out by parties',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },
  {
    id: 5,
    leftText: 'Goes out on the town',
    rightText: 'Stays at home',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },
  {
    id: 6,
    leftText: 'Yelling comes naturally',
    rightText: 'Finds it difficult to yell very loudly',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },
  {
    id: 7,
    leftText: 'Likes to perform in front of others',
    rightText: 'Avoids public speaking',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },
  {
    id: 8,
    leftText: 'Talks more',
    rightText: 'Listens more',
    dimension: 'EI',
    leftPole: 'E',
    rightPole: 'I',
  },

  // === SENSING vs INTUITION (SN) ===
  {
    id: 9,
    leftText: 'Makes lists',
    rightText: 'Relies on memory',
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },
  {
    id: 10,
    leftText: 'Keeps a clean room',
    rightText: 'Just puts stuff wherever',
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },
  {
    id: 11,
    leftText: 'Organized',
    rightText: 'Chaotic',
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },
  {
    id: 12,
    leftText: 'Focused on the past',
    rightText: 'Focused on the future',
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },
  {
    id: 13,
    leftText: 'Wants the details',
    rightText: 'Wants the big picture',
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },
  {
    id: 14,
    leftText: "Likes to know 'who, what, when'",
    rightText: "Likes to know 'why'",
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },
  {
    id: 15,
    leftText: 'Realistic',
    rightText: 'Imaginative',
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },
  {
    id: 16,
    leftText: 'Interested in realities',
    rightText: 'Interested in possibilities',
    dimension: 'SN',
    leftPole: 'S',
    rightPole: 'N',
  },

  // === THINKING vs FEELING (TF) ===
  {
    id: 17,
    leftText: 'Sceptical',
    rightText: 'Wants to believe',
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },
  {
    id: 18,
    leftText: "Strives to have a mechanical mind",
    rightText: "Thinks 'robotic' is an insult",
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },
  {
    id: 19,
    leftText: 'Thick-skinned',
    rightText: 'Easily hurt',
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },
  {
    id: 20,
    leftText: "Wants people's respect",
    rightText: "Wants their love",
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },
  {
    id: 21,
    leftText: 'Follows the head',
    rightText: 'Follows the heart',
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },
  {
    id: 22,
    leftText: 'Bases morality on justice',
    rightText: 'Bases morality on compassion',
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },
  {
    id: 23,
    leftText: 'Uncomfortable with emotions',
    rightText: 'Values emotions',
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },
  {
    id: 24,
    leftText: 'Cares if something is true or false',
    rightText: 'Cares if something is good or bad',
    dimension: 'TF',
    leftPole: 'T',
    rightPole: 'F',
  },

  // === JUDGING vs PERCEIVING (JP) ===
  {
    id: 25,
    leftText: 'Accepts things as they are',
    rightText: 'Unsatisfied with the way things are',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
  {
    id: 26,
    leftText: 'Prefers multiple choice tests',
    rightText: 'Prefers essay answers',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
  {
    id: 27,
    leftText: 'Plans far ahead',
    rightText: 'Plans at the last minute',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
  {
    id: 28,
    leftText: 'Gets work done right away',
    rightText: 'Procrastinates',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
  {
    id: 29,
    leftText: 'Commits',
    rightText: 'Keeps options open',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
  {
    id: 30,
    leftText: 'Prepares',
    rightText: 'Improvises',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
  {
    id: 31,
    leftText: 'Empirical',
    rightText: 'Theoretical',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
  {
    id: 32,
    leftText: 'Good sense of time',
    rightText: 'Loses track of time',
    dimension: 'JP',
    leftPole: 'J',
    rightPole: 'P',
  },
];

// Shuffle items for the assessment (consistent shuffle based on seed)
export function shuffleItems(seed: number = 42): Item[] {
  const shuffled = [...items];
  let currentIndex = shuffled.length;
  let randomValue: number;

  // Simple seeded random
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    randomValue = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomValue]] = [
      shuffled[randomValue],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

// Get all dimensions
export const dimensions: Dimension[] = ['EI', 'SN', 'TF', 'JP'];

// Get items for a specific dimension
export function getItemsForDimension(dimension: Dimension): Item[] {
  return items.filter((item) => item.dimension === dimension);
}

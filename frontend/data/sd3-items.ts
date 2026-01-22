// Short Dark Triad (SD3) - 27-item measure of the Dark Triad
// Source: Jones, D.N., & Paulhus, D.L. (2014). Introducing the Short Dark Triad (SD3):
// A Brief Measure of Dark Personality Traits. Assessment, 21(1), 28-41.
// License: Free for research with citation

export type DarkTrait = 'machiavellianism' | 'narcissism' | 'psychopathy';

export interface Item {
  id: number;
  text: string;
  trait: DarkTrait;
  isReversed: boolean;
}

export interface TraitInfo {
  code: DarkTrait;
  name: string;
  description: string;
  lowDescription: string;
  highDescription: string;
  color: string;
}

export const traitInfo: Record<DarkTrait, TraitInfo> = {
  machiavellianism: {
    code: 'machiavellianism',
    name: 'Machiavellianism',
    description:
      'A strategic approach to social interactions characterized by a focus on self-interest, pragmatic ethics, and a preference for planning over impulsivity.',
    lowDescription:
      'You tend to be straightforward and trusting in your dealings with others, preferring direct communication over strategic maneuvering.',
    highDescription:
      'You tend to be strategic and calculating in social situations, carefully considering how to position yourself for advantage.',
    color: '#6366f1', // indigo
  },
  narcissism: {
    code: 'narcissism',
    name: 'Narcissism',
    description:
      'A pattern of grandiosity, need for admiration, and sense of entitlement. At subclinical levels, reflects confidence and leadership tendencies.',
    lowDescription:
      'You tend to be modest and self-effacing, preferring to deflect attention and avoid the spotlight.',
    highDescription:
      'You tend to see yourself as special and deserving of recognition, often seeking leadership roles and admiration.',
    color: '#f59e0b', // amber
  },
  psychopathy: {
    code: 'psychopathy',
    name: 'Psychopathy',
    description:
      'A pattern characterized by impulsivity, thrill-seeking, low empathy, and low anxiety. At subclinical levels, reflects boldness and risk tolerance.',
    lowDescription:
      'You tend to be cautious, empathetic, and considerate of consequences before acting.',
    highDescription:
      'You tend to be bold and action-oriented, with a higher tolerance for risk and confrontation.',
    color: '#ef4444', // red
  },
};

// All 27 SD3 items (9 per trait)
export const items: Item[] = [
  // === MACHIAVELLIANISM (items 1-9) ===
  {
    id: 1,
    text: "It's not wise to tell your secrets.",
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 2,
    text: 'I like to use clever manipulation to get my way.',
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 3,
    text: 'Whatever it takes, you must get the important people on your side.',
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 4,
    text: 'Avoid direct conflict with others because they may be useful in the future.',
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 5,
    text: "It's wise to keep track of information that you can use against people later.",
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 6,
    text: 'You should wait for the right time to get back at people.',
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 7,
    text: "There are things you should hide from other people because they don't need to know.",
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 8,
    text: 'Make sure your plans benefit you, not others.',
    trait: 'machiavellianism',
    isReversed: false,
  },
  {
    id: 9,
    text: 'Most people can be manipulated.',
    trait: 'machiavellianism',
    isReversed: false,
  },

  // === NARCISSISM (items 10-18) ===
  {
    id: 10,
    text: 'People see me as a natural leader.',
    trait: 'narcissism',
    isReversed: false,
  },
  {
    id: 11,
    text: 'I hate being the center of attention.',
    trait: 'narcissism',
    isReversed: true,
  },
  {
    id: 12,
    text: 'Many group activities tend to be dull without me.',
    trait: 'narcissism',
    isReversed: false,
  },
  {
    id: 13,
    text: 'I know that I am special because everyone keeps telling me so.',
    trait: 'narcissism',
    isReversed: false,
  },
  {
    id: 14,
    text: 'I like to get acquainted with important people.',
    trait: 'narcissism',
    isReversed: false,
  },
  {
    id: 15,
    text: 'I feel embarrassed if someone compliments me.',
    trait: 'narcissism',
    isReversed: true,
  },
  {
    id: 16,
    text: 'I have been compared to famous people.',
    trait: 'narcissism',
    isReversed: false,
  },
  {
    id: 17,
    text: 'I am an average person.',
    trait: 'narcissism',
    isReversed: true,
  },
  {
    id: 18,
    text: 'I insist on getting the respect I deserve.',
    trait: 'narcissism',
    isReversed: false,
  },

  // === PSYCHOPATHY (items 19-27) ===
  {
    id: 19,
    text: 'I like to get revenge on authorities.',
    trait: 'psychopathy',
    isReversed: false,
  },
  {
    id: 20,
    text: 'I avoid dangerous situations.',
    trait: 'psychopathy',
    isReversed: true,
  },
  {
    id: 21,
    text: 'Payback needs to be quick and nasty.',
    trait: 'psychopathy',
    isReversed: false,
  },
  {
    id: 22,
    text: "People often say I'm out of control.",
    trait: 'psychopathy',
    isReversed: false,
  },
  {
    id: 23,
    text: "It's true that I can be mean to others.",
    trait: 'psychopathy',
    isReversed: false,
  },
  {
    id: 24,
    text: 'People who mess with me always regret it.',
    trait: 'psychopathy',
    isReversed: false,
  },
  {
    id: 25,
    text: 'I have never gotten into trouble with the law.',
    trait: 'psychopathy',
    isReversed: true,
  },
  {
    id: 26,
    text: 'I enjoy having sex with people I hardly know.',
    trait: 'psychopathy',
    isReversed: false,
  },
  {
    id: 27,
    text: "I'll say anything to get what I want.",
    trait: 'psychopathy',
    isReversed: false,
  },
];

// Get all traits
export const traits: DarkTrait[] = ['machiavellianism', 'narcissism', 'psychopathy'];

// Get items for a specific trait
export function getItemsForTrait(trait: DarkTrait): Item[] {
  return items.filter((item) => item.trait === trait);
}

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

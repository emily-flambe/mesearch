// RWA-VSA (Right-Wing Authoritarianism Very Short Scale) Items
// Source: Bizumic, B., & Duckitt, J. (2018). Investigating right wing authoritarianism
// with a very short authoritarianism scale. Journal of Social and Political Psychology.
// License: Free for research with citation

export type Dimension = 'Submission' | 'Aggression' | 'Conventionalism';

export interface Item {
  id: number;
  text: string;
  dimension: Dimension;
  isReversed: boolean;
}

export interface DimensionInfo {
  code: Dimension;
  name: string;
  description: string;
  lowDescription: string;
  highDescription: string;
  color: string;
}

export const dimensionInfo: Record<Dimension, DimensionInfo> = {
  Submission: {
    code: 'Submission',
    name: 'Authoritarian Submission',
    description:
      'The tendency to submit to authorities perceived as established and legitimate in society.',
    lowDescription:
      'You tend to question authority and value independent thinking over deference to established leaders.',
    highDescription:
      'You tend to respect and defer to established authorities and value following the guidance of leaders.',
    color: '#3b82f6', // blue
  },
  Aggression: {
    code: 'Aggression',
    name: 'Authoritarian Aggression',
    description:
      'The tendency to support harsh punishments and strong measures against those who deviate from social norms.',
    lowDescription:
      'You tend to favor rehabilitation and understanding over punishment for those who break social norms.',
    highDescription:
      'You tend to support strict enforcement and firm consequences for those who violate social norms.',
    color: '#ef4444', // red
  },
  Conventionalism: {
    code: 'Conventionalism',
    name: 'Conventionalism',
    description:
      'The tendency to adhere to traditional social norms and values, particularly those sanctioned by authorities.',
    lowDescription:
      'You tend to be open to changing social norms and question traditional moral standards.',
    highDescription:
      'You tend to value traditional moral standards and support preserving established social norms.',
    color: '#f59e0b', // amber
  },
};

// All 6 RWA-VSA items (2 per dimension)
export const items: Item[] = [
  // === SUBMISSION (items 1-2) ===
  {
    id: 1,
    text: "It's great that many young people today are prepared to defy authority.",
    dimension: 'Submission',
    isReversed: true,
  },
  {
    id: 2,
    text: 'What our country needs most is discipline, with everyone following our leaders in unity.',
    dimension: 'Submission',
    isReversed: false,
  },

  // === CONVENTIONALISM (items 3-4) ===
  {
    id: 3,
    text: "God's laws about abortion, pornography, and marriage must be strictly followed before it is too late.",
    dimension: 'Conventionalism',
    isReversed: false,
  },
  {
    id: 4,
    text: 'There is nothing wrong with premarital sexual intercourse.',
    dimension: 'Conventionalism',
    isReversed: true,
  },

  // === AGGRESSION (items 5-6) ===
  {
    id: 5,
    text: 'Our society does NOT need tougher government and stricter laws.',
    dimension: 'Aggression',
    isReversed: true,
  },
  {
    id: 6,
    text: 'The facts on crime and the recent public disorders show we have to crack down harder on troublemakers, if we are going to preserve law and order.',
    dimension: 'Aggression',
    isReversed: false,
  },
];

// Get all dimensions
export const dimensions: Dimension[] = ['Submission', 'Aggression', 'Conventionalism'];

// Get items for a specific dimension
export function getItemsForDimension(dimension: Dimension): Item[] {
  return items.filter((item) => item.dimension === dimension);
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

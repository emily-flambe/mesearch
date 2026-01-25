// Social Dominance Orientation Scale (SDO7) - 16-item measure
// Source: Ho, A.K., Sidanius, J., Kteily, N., Sheehy-Skeffington, J., Pratto, F.,
// Henkel, K.E., Foels, R., & Stewart, A.L. (2015). The nature of social dominance
// orientation: Theorizing and measuring preferences for intergroup inequality using
// the new SDO7 scale. Journal of Personality and Social Psychology, 109(6), 1003-1028.
// License: Free for research with citation

export type Dimension = 'SDO-D' | 'SDO-E';

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
  'SDO-D': {
    code: 'SDO-D',
    name: 'Dominance',
    description:
      'Preference for group-based dominance hierarchies and overt expressions of superiority. Reflects support for some groups dominating or oppressing others.',
    lowDescription:
      'You tend to reject the idea that some groups should dominate or be superior to others. You likely oppose overt group-based oppression.',
    highDescription:
      'You tend to accept or support group-based dominance hierarchies where some groups are on top and others on the bottom.',
    color: '#ef4444', // red
  },
  'SDO-E': {
    code: 'SDO-E',
    name: 'Anti-Egalitarianism',
    description:
      'Opposition to group-based equality. Reflects resistance to efforts that would promote equality between groups.',
    lowDescription:
      'You tend to support efforts toward group-based equality and believe groups should have equal opportunities and outcomes.',
    highDescription:
      'You tend to oppose efforts toward group-based equality and resist policies aimed at equalizing conditions between groups.',
    color: '#f59e0b', // amber
  },
};

// All 16 SDO7 items (8 per dimension, 4 pro-trait and 4 con-trait reversed)
export const items: Item[] = [
  // === SDO-D (Dominance) ===
  // SDO-D Pro-trait items (1-4): Support for dominance hierarchies
  {
    id: 1,
    text: 'Some groups of people must be kept in their place.',
    dimension: 'SDO-D',
    isReversed: false,
  },
  {
    id: 2,
    text: "It's probably a good thing that certain groups are at the top and other groups are at the bottom.",
    dimension: 'SDO-D',
    isReversed: false,
  },
  {
    id: 3,
    text: 'An ideal society requires some groups to be on top and others to be on the bottom.',
    dimension: 'SDO-D',
    isReversed: false,
  },
  {
    id: 4,
    text: 'Some groups of people are simply inferior to other groups.',
    dimension: 'SDO-D',
    isReversed: false,
  },
  // SDO-D Con-trait items (5-8): Opposition to dominance hierarchies (REVERSED)
  {
    id: 5,
    text: 'Groups at the bottom are just as deserving as groups at the top.',
    dimension: 'SDO-D',
    isReversed: true,
  },
  {
    id: 6,
    text: 'No one group should dominate in society.',
    dimension: 'SDO-D',
    isReversed: true,
  },
  {
    id: 7,
    text: 'Groups at the bottom should not have to stay in their place.',
    dimension: 'SDO-D',
    isReversed: true,
  },
  {
    id: 8,
    text: 'Group dominance is a poor principle.',
    dimension: 'SDO-D',
    isReversed: true,
  },

  // === SDO-E (Anti-Egalitarianism) ===
  // SDO-E Pro-trait items (9-12): Opposition to equality
  {
    id: 9,
    text: "We shouldn't try to guarantee that every group has the same quality of life.",
    dimension: 'SDO-E',
    isReversed: false,
  },
  {
    id: 10,
    text: 'It is unjust to try to make groups equal.',
    dimension: 'SDO-E',
    isReversed: false,
  },
  {
    id: 11,
    text: 'Group equality should not be our primary goal.',
    dimension: 'SDO-E',
    isReversed: false,
  },
  {
    id: 12,
    text: "We shouldn't try to guarantee that every group has the same chance of success.",
    dimension: 'SDO-E',
    isReversed: false,
  },
  // SDO-E Con-trait items (13-16): Support for equality (REVERSED)
  {
    id: 13,
    text: 'We should work to give all groups an equal chance to succeed.',
    dimension: 'SDO-E',
    isReversed: true,
  },
  {
    id: 14,
    text: 'We should do what we can to equalize conditions for different groups.',
    dimension: 'SDO-E',
    isReversed: true,
  },
  {
    id: 15,
    text: 'No matter how much effort it takes, we ought to strive to ensure that all groups have the same chance in life.',
    dimension: 'SDO-E',
    isReversed: true,
  },
  {
    id: 16,
    text: 'Group equality should be our ideal.',
    dimension: 'SDO-E',
    isReversed: true,
  },
];

// Get all dimensions
export const dimensions: Dimension[] = ['SDO-D', 'SDO-E'];

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

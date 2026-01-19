// Mini-Test: 5-question sampler for debugging and automated testing
// One question from each Big Five dimension (O, C, E, A, N)
// This test is only available to admin and test users via feature flag

export interface MiniTestItem {
  id: number;
  text: string;
  dimension: 'O' | 'C' | 'E' | 'A' | 'N';
  dimensionName: string;
  isReversed: boolean;
}

export const miniTestItems: MiniTestItem[] = [
  {
    id: 1,
    text: 'I have a vivid imagination.',
    dimension: 'O',
    dimensionName: 'Openness',
    isReversed: false,
  },
  {
    id: 2,
    text: 'I am always prepared.',
    dimension: 'C',
    dimensionName: 'Conscientiousness',
    isReversed: false,
  },
  {
    id: 3,
    text: 'I feel comfortable around people.',
    dimension: 'E',
    dimensionName: 'Extraversion',
    isReversed: false,
  },
  {
    id: 4,
    text: 'I am interested in people.',
    dimension: 'A',
    dimensionName: 'Agreeableness',
    isReversed: false,
  },
  {
    id: 5,
    text: 'I worry about things.',
    dimension: 'N',
    dimensionName: 'Neuroticism',
    isReversed: false,
  },
];

export const miniTestDimensionColors: Record<string, string> = {
  O: '#14b8a6', // teal
  C: '#3b82f6', // blue
  E: '#f97316', // orange
  A: '#22c55e', // green
  N: '#a855f7', // purple
};

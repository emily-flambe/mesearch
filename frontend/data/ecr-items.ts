// ECR-RS (Experiences in Close Relationships - Revised Short form)
// 9-item version measuring attachment anxiety and avoidance
// Source: Wei, M., Russell, D. W., Mallinckrodt, B., & Vogel, D. L. (2007)
// Reference: https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm

export type Dimension = 'anxiety' | 'avoidance';

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
  anxiety: {
    code: 'anxiety',
    name: 'Attachment Anxiety',
    description:
      'Attachment anxiety reflects worry about rejection and abandonment in close relationships, along with a strong desire for closeness and reassurance.',
    lowDescription:
      'You tend to feel secure about your relationships and do not worry excessively about rejection or abandonment.',
    highDescription:
      'You tend to worry about whether others truly care about you and may seek reassurance about your relationships.',
    color: '#ef4444', // red
  },
  avoidance: {
    code: 'avoidance',
    name: 'Attachment Avoidance',
    description:
      'Attachment avoidance reflects discomfort with closeness and emotional intimacy, along with a preference for self-reliance over depending on others.',
    lowDescription:
      'You tend to be comfortable with emotional closeness and depending on others in relationships.',
    highDescription:
      'You tend to prefer independence and may feel uncomfortable with too much closeness or emotional intimacy.',
    color: '#3b82f6', // blue
  },
};

// ECR-RS 9 items
// Items 1-4 measure Avoidance (items 1, 2, 3, 4)
// Items 5-9 measure Anxiety (items 5, 6, 7, 8, 9)
// Note: Items 1, 2, 3 are reverse-scored for Avoidance
export const items: Item[] = [
  // Avoidance items
  {
    id: 1,
    text: 'It helps to turn to my romantic partner in times of need.',
    dimension: 'avoidance',
    isReversed: true, // Low agreement = high avoidance
  },
  {
    id: 2,
    text: 'I usually discuss my problems and concerns with my partner.',
    dimension: 'avoidance',
    isReversed: true, // Low agreement = high avoidance
  },
  {
    id: 3,
    text: 'I talk things over with my partner.',
    dimension: 'avoidance',
    isReversed: true, // Low agreement = high avoidance
  },
  {
    id: 4,
    text: 'I find it easy to depend on romantic partners.',
    dimension: 'avoidance',
    isReversed: true, // Low agreement = high avoidance
  },
  // Anxiety items
  {
    id: 5,
    text: "I'm afraid that I will lose my partner's love.",
    dimension: 'anxiety',
    isReversed: false,
  },
  {
    id: 6,
    text: 'I often worry that my partner will not want to stay with me.',
    dimension: 'anxiety',
    isReversed: false,
  },
  {
    id: 7,
    text: 'I often worry that my partner does not really love me.',
    dimension: 'anxiety',
    isReversed: false,
  },
  {
    id: 8,
    text: "I worry that romantic partners won't care about me as much as I care about them.",
    dimension: 'anxiety',
    isReversed: false,
  },
  {
    id: 9,
    text: 'I often wish that my partner\'s feelings for me were as strong as my feelings for them.',
    dimension: 'anxiety',
    isReversed: false,
  },
];

// 7-point Likert scale for ECR
export type LikertValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const likertScale: { value: LikertValue; label: string }[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

// Get all dimensions
export const dimensions: Dimension[] = ['anxiety', 'avoidance'];

// Get items for a specific dimension
export function getItemsForDimension(dimension: Dimension): Item[] {
  return items.filter((item) => item.dimension === dimension);
}

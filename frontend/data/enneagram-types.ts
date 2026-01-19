// Enneagram type definitions

export interface EnneagramType {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  name: string;
  subtitle: string;
  description: string;
  coreFear: string;
  coreDesire: string;
  stressDirection: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  growthDirection: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  wings: [1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9];
}

export const enneagramTypes: EnneagramType[] = [
  {
    type: 1,
    name: 'The Reformer',
    subtitle: 'The Rational, Idealistic Type',
    description: 'Ones are conscientious and ethical, with a strong sense of right and wrong. They are teachers, crusaders, and advocates for change, striving to improve things but afraid of making mistakes. Well-organized, orderly, and fastidious, they try to maintain high standards but can slip into being critical and perfectionistic.',
    coreFear: 'Being corrupt, evil, or defective',
    coreDesire: 'To be good, have integrity, and be balanced',
    stressDirection: 4,
    growthDirection: 7,
    wings: [9, 2],
  },
  {
    type: 2,
    name: 'The Helper',
    subtitle: 'The Caring, Interpersonal Type',
    description: 'Twos are empathetic, sincere, and warm-hearted. They are friendly, generous, and self-sacrificing, but can also be sentimental, flattering, and people-pleasing. They are well-meaning and driven to be close to others, but can slip into doing things for others in order to be needed.',
    coreFear: 'Being unwanted or unworthy of being loved',
    coreDesire: 'To feel loved and appreciated',
    stressDirection: 8,
    growthDirection: 4,
    wings: [1, 3],
  },
  {
    type: 3,
    name: 'The Achiever',
    subtitle: 'The Success-Oriented, Pragmatic Type',
    description: 'Threes are self-assured, attractive, and charming. Ambitious, competent, and energetic, they can also be status-conscious and highly driven for advancement. They are diplomatic and poised, but can also be overly concerned with their image and what others think of them.',
    coreFear: 'Being worthless or without inherent value',
    coreDesire: 'To feel valuable and worthwhile',
    stressDirection: 9,
    growthDirection: 6,
    wings: [2, 4],
  },
  {
    type: 4,
    name: 'The Individualist',
    subtitle: 'The Sensitive, Withdrawn Type',
    description: 'Fours are self-aware, sensitive, and reserved. They are emotionally honest, creative, and personal, but can also be moody and self-conscious. They often feel different from others and may feel defective or misunderstood, yet they are authentic and express themselves uniquely.',
    coreFear: 'Having no identity or personal significance',
    coreDesire: 'To find themselves and their significance',
    stressDirection: 2,
    growthDirection: 1,
    wings: [3, 5],
  },
  {
    type: 5,
    name: 'The Investigator',
    subtitle: 'The Intense, Cerebral Type',
    description: 'Fives are alert, insightful, and curious. They are able to concentrate and focus on developing complex ideas and skills. Independent, innovative, and inventive, they can also become preoccupied with their thoughts and imaginary constructs. They may become detached, yet high-strung and intense.',
    coreFear: 'Being useless, helpless, or incapable',
    coreDesire: 'To be capable and competent',
    stressDirection: 7,
    growthDirection: 8,
    wings: [4, 6],
  },
  {
    type: 6,
    name: 'The Loyalist',
    subtitle: 'The Committed, Security-Oriented Type',
    description: 'Sixes are reliable, hard-working, responsible, and trustworthy. Excellent troubleshooters, they foresee problems and foster cooperation, but can also become defensive, evasive, and anxious. They can be cautious and indecisive, but also reactive and defiant, running on stress.',
    coreFear: 'Being without support and guidance',
    coreDesire: 'To have security and support',
    stressDirection: 3,
    growthDirection: 9,
    wings: [5, 7],
  },
  {
    type: 7,
    name: 'The Enthusiast',
    subtitle: 'The Busy, Fun-Loving Type',
    description: 'Sevens are extroverted, optimistic, versatile, and spontaneous. Playful, high-spirited, and practical, they can also misapply their many talents, becoming over-extended, scattered, and undisciplined. They constantly seek new and exciting experiences, but can become distracted and exhausted.',
    coreFear: 'Being deprived and in pain',
    coreDesire: 'To be satisfied and content',
    stressDirection: 1,
    growthDirection: 5,
    wings: [6, 8],
  },
  {
    type: 8,
    name: 'The Challenger',
    subtitle: 'The Powerful, Dominating Type',
    description: 'Eights are self-confident, strong, and assertive. Protective, resourceful, straight-talking, and decisive, they can also be ego-centric and domineering. They feel they must control their environment, especially people, sometimes becoming confrontational and intimidating.',
    coreFear: 'Being harmed or controlled by others',
    coreDesire: 'To protect themselves and be in control',
    stressDirection: 5,
    growthDirection: 2,
    wings: [7, 9],
  },
  {
    type: 9,
    name: 'The Peacemaker',
    subtitle: 'The Easygoing, Self-Effacing Type',
    description: 'Nines are accepting, trusting, and stable. They are usually creative, optimistic, and supportive, but can also be too willing to go along with others to keep the peace. They want everything to go smoothly and be without conflict, but they can tend to be complacent and minimize problems.',
    coreFear: 'Loss and separation, of fragmentation',
    coreDesire: 'To have inner stability and peace of mind',
    stressDirection: 6,
    growthDirection: 3,
    wings: [8, 1],
  },
];

export function getTypeById(typeNum: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): EnneagramType {
  return enneagramTypes.find((t) => t.type === typeNum)!;
}

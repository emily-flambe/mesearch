// Moral Foundations Questionnaire (MFQ-30)
// Based on the research of Jonathan Haidt and colleagues
// Source: https://moralfoundations.org/questionnaires/
// Citation: Graham, J., Haidt, J., Koleva, S., Motyl, M., Iyer, R., Wojcik, S., & Ditto, P. H. (2013).
// Moral Foundations Theory: The pragmatic validity of moral pluralism. Advances in Experimental Social Psychology, 47, 55-130.

export type Foundation = 'care' | 'fairness' | 'loyalty' | 'authority' | 'purity' | 'liberty';

export type QuestionType = 'relevance' | 'judgment';

export interface Item {
  id: number;
  text: string;
  foundation: Foundation;
  questionType: QuestionType;
  isReversed: boolean;
}

export interface FoundationInfo {
  code: Foundation;
  name: string;
  description: string;
  concernsWith: string;
  oppositeOf: string;
  color: string;
}

export const foundationInfo: Record<Foundation, FoundationInfo> = {
  care: {
    code: 'care',
    name: 'Care/Harm',
    description: 'This foundation relates to our evolved capacity for empathy and compassion. It makes us sensitive to signs of suffering and need.',
    concernsWith: 'Compassion, kindness, and protection of the vulnerable',
    oppositeOf: 'Harm, cruelty',
    color: '#ec4899', // pink
  },
  fairness: {
    code: 'fairness',
    name: 'Fairness/Cheating',
    description: 'This foundation relates to our evolved concerns about reciprocity, justice, and rights. It makes us sensitive to issues of fairness and proportionality.',
    concernsWith: 'Justice, rights, and equal treatment',
    oppositeOf: 'Cheating, injustice',
    color: '#3b82f6', // blue
  },
  loyalty: {
    code: 'loyalty',
    name: 'Loyalty/Betrayal',
    description: 'This foundation relates to our evolved tribal psychology. It makes us sensitive to signs of group membership and betrayal.',
    concernsWith: 'Patriotism, self-sacrifice for the group',
    oppositeOf: 'Betrayal, treason',
    color: '#22c55e', // green
  },
  authority: {
    code: 'authority',
    name: 'Authority/Subversion',
    description: 'This foundation relates to our evolved tendencies toward hierarchical social organization. It makes us sensitive to rank, status, and proper behavior.',
    concernsWith: 'Leadership, tradition, and social order',
    oppositeOf: 'Subversion, disrespect',
    color: '#f97316', // orange
  },
  purity: {
    code: 'purity',
    name: 'Purity/Degradation',
    description: 'This foundation relates to the psychology of disgust and contamination. It underlies notions of living in an elevated, noble way.',
    concernsWith: 'Sanctity, cleanliness, and spiritual purity',
    oppositeOf: 'Degradation, contamination',
    color: '#a855f7', // purple
  },
  liberty: {
    code: 'liberty',
    name: 'Liberty/Oppression',
    description: 'This foundation relates to our evolved resentment of those who dominate and restrict liberty. It makes us sensitive to attempts to control or coerce.',
    concernsWith: 'Freedom, autonomy, and individual rights',
    oppositeOf: 'Oppression, tyranny',
    color: '#14b8a6', // teal
  },
};

// MFQ-30 Items
// Part 1 (items 1-15): Relevance items - "When deciding whether something is right or wrong, how relevant are the following considerations?"
// Part 2 (items 16-30): Judgment items - Agreement with specific moral statements

export const items: Item[] = [
  // ===== PART 1: RELEVANCE ITEMS (1-15) =====
  // "When you decide whether something is right or wrong, to what extent are the following considerations relevant to your thinking?"

  // Care relevance items
  { id: 1, text: 'Whether or not someone suffered emotionally', foundation: 'care', questionType: 'relevance', isReversed: false },
  { id: 2, text: 'Whether or not someone cared for someone weak or vulnerable', foundation: 'care', questionType: 'relevance', isReversed: false },
  { id: 3, text: 'Whether or not someone was cruel', foundation: 'care', questionType: 'relevance', isReversed: false },

  // Fairness relevance items
  { id: 4, text: 'Whether or not some people were treated differently than others', foundation: 'fairness', questionType: 'relevance', isReversed: false },
  { id: 5, text: 'Whether or not someone acted unfairly', foundation: 'fairness', questionType: 'relevance', isReversed: false },
  { id: 6, text: 'Whether or not someone was denied his or her rights', foundation: 'fairness', questionType: 'relevance', isReversed: false },

  // Loyalty relevance items
  { id: 7, text: 'Whether or not someone\'s action showed love for his or her country', foundation: 'loyalty', questionType: 'relevance', isReversed: false },
  { id: 8, text: 'Whether or not someone did something to betray his or her group', foundation: 'loyalty', questionType: 'relevance', isReversed: false },
  { id: 9, text: 'Whether or not someone showed a lack of loyalty', foundation: 'loyalty', questionType: 'relevance', isReversed: false },

  // Authority relevance items
  { id: 10, text: 'Whether or not someone showed a lack of respect for authority', foundation: 'authority', questionType: 'relevance', isReversed: false },
  { id: 11, text: 'Whether or not someone conformed to the traditions of society', foundation: 'authority', questionType: 'relevance', isReversed: false },
  { id: 12, text: 'Whether or not an action caused chaos or disorder', foundation: 'authority', questionType: 'relevance', isReversed: false },

  // Purity relevance items
  { id: 13, text: 'Whether or not someone violated standards of purity and decency', foundation: 'purity', questionType: 'relevance', isReversed: false },
  { id: 14, text: 'Whether or not someone did something disgusting', foundation: 'purity', questionType: 'relevance', isReversed: false },
  { id: 15, text: 'Whether or not someone acted in a way that God would approve of', foundation: 'purity', questionType: 'relevance', isReversed: false },

  // ===== PART 2: JUDGMENT ITEMS (16-30) =====
  // "Please indicate your agreement or disagreement with the following statements"

  // Care judgment items
  { id: 16, text: 'Compassion for those who are suffering is the most crucial virtue.', foundation: 'care', questionType: 'judgment', isReversed: false },
  { id: 17, text: 'One of the worst things a person could do is hurt a defenseless animal.', foundation: 'care', questionType: 'judgment', isReversed: false },
  { id: 18, text: 'It can never be right to kill a human being.', foundation: 'care', questionType: 'judgment', isReversed: false },

  // Fairness judgment items
  { id: 19, text: 'When the government makes laws, the number one principle should be ensuring that everyone is treated fairly.', foundation: 'fairness', questionType: 'judgment', isReversed: false },
  { id: 20, text: 'Justice is the most important requirement for a society.', foundation: 'fairness', questionType: 'judgment', isReversed: false },
  { id: 21, text: 'I think it\'s morally wrong that rich children inherit a lot of money while poor children inherit nothing.', foundation: 'fairness', questionType: 'judgment', isReversed: false },

  // Loyalty judgment items
  { id: 22, text: 'I am proud of my country\'s history.', foundation: 'loyalty', questionType: 'judgment', isReversed: false },
  { id: 23, text: 'People should be loyal to their family members, even when they have done something wrong.', foundation: 'loyalty', questionType: 'judgment', isReversed: false },
  { id: 24, text: 'It is more important to be a team player than to express oneself.', foundation: 'loyalty', questionType: 'judgment', isReversed: false },

  // Authority judgment items
  { id: 25, text: 'Respect for authority is something all children need to learn.', foundation: 'authority', questionType: 'judgment', isReversed: false },
  { id: 26, text: 'Men and women each have different roles to play in society.', foundation: 'authority', questionType: 'judgment', isReversed: false },
  { id: 27, text: 'If I were a soldier and disagreed with my commanding officer\'s orders, I would obey anyway because that is my duty.', foundation: 'authority', questionType: 'judgment', isReversed: false },

  // Purity judgment items
  { id: 28, text: 'People should not do things that are disgusting, even if no one is harmed.', foundation: 'purity', questionType: 'judgment', isReversed: false },
  { id: 29, text: 'I would call some acts wrong on the grounds that they are unnatural.', foundation: 'purity', questionType: 'judgment', isReversed: false },
  { id: 30, text: 'Chastity is an important and valuable virtue.', foundation: 'purity', questionType: 'judgment', isReversed: false },
];

// Get all foundations
export const foundations: Foundation[] = ['care', 'fairness', 'loyalty', 'authority', 'purity', 'liberty'];

// Note: Liberty foundation is not included in the original MFQ-30
// It was added later in the Moral Foundations Questionnaire 2 (MFQ-2)
// For completeness, we'll include the core 5 foundations with scoring

// Get the five original foundations (excluding liberty which isn't in MFQ-30)
export const scoredFoundations: Foundation[] = ['care', 'fairness', 'loyalty', 'authority', 'purity'];

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
    [shuffled[currentIndex], shuffled[randomValue]] = [shuffled[randomValue], shuffled[currentIndex]];
  }

  return shuffled;
}

// Get items for a specific foundation
export function getItemsForFoundation(foundation: Foundation): Item[] {
  return items.filter((item) => item.foundation === foundation);
}

// Get items for a specific question type
export function getItemsForQuestionType(questionType: QuestionType): Item[] {
  return items.filter((item) => item.questionType === questionType);
}

// Citation for academic use
export const citation = `Graham, J., Haidt, J., Koleva, S., Motyl, M., Iyer, R., Wojcik, S., & Ditto, P. H. (2013). Moral Foundations Theory: The pragmatic validity of moral pluralism. Advances in Experimental Social Psychology, 47, 55-130.`;

// Moral Foundations Questionnaire 2 (MFQ-2)
// Based on the research of Atari, Graham, Haidt, and colleagues (2023)
// Source: Atari, M., et al. (2023). Morality beyond the WEIRD: How the nomological network of morality varies across cultures.
// Journal of Personality and Social Psychology, 125(5), 1157-1188.
// 36 items measuring 6 foundations with updated fairness distinction (Equality vs Proportionality)

export type Foundation = 'Care' | 'Equality' | 'Proportionality' | 'Loyalty' | 'Authority' | 'Purity';

export interface Item {
  id: number;
  text: string;
  foundation: Foundation;
}

export interface FoundationInfo {
  code: Foundation;
  name: string;
  description: string;
  politicalLean: 'liberal' | 'conservative' | 'neutral';
  color: string;
  higherOrder: 'Individualizing' | 'Binding';
}

export const foundationInfo: Record<Foundation, FoundationInfo> = {
  Care: {
    code: 'Care',
    name: 'Care',
    description: 'This foundation relates to our evolved capacity for empathy and compassion. It makes us sensitive to signs of suffering and need, motivating us to help and protect others.',
    politicalLean: 'liberal',
    color: '#ec4899', // pink
    higherOrder: 'Individualizing',
  },
  Equality: {
    code: 'Equality',
    name: 'Equality',
    description: 'This foundation concerns fairness as equal treatment and equal outcomes. It reflects beliefs that resources and opportunities should be distributed equally regardless of individual differences.',
    politicalLean: 'liberal',
    color: '#3b82f6', // blue
    higherOrder: 'Individualizing',
  },
  Proportionality: {
    code: 'Proportionality',
    name: 'Proportionality',
    description: 'This foundation concerns fairness as earned outcomes. It reflects beliefs that rewards should be proportional to contributions, effort, and merit.',
    politicalLean: 'conservative',
    color: '#14b8a6', // teal
    higherOrder: 'Binding',
  },
  Loyalty: {
    code: 'Loyalty',
    name: 'Loyalty',
    description: 'This foundation relates to our evolved tribal psychology. It makes us sensitive to signs of group membership and motivates self-sacrifice for the group.',
    politicalLean: 'conservative',
    color: '#22c55e', // green
    higherOrder: 'Binding',
  },
  Authority: {
    code: 'Authority',
    name: 'Authority',
    description: 'This foundation relates to our evolved tendencies toward hierarchical social organization. It makes us value leadership, tradition, and social order.',
    politicalLean: 'conservative',
    color: '#f97316', // orange
    higherOrder: 'Binding',
  },
  Purity: {
    code: 'Purity',
    name: 'Purity',
    description: 'This foundation relates to the psychology of disgust and contamination. It underlies notions of living in an elevated, noble way and treating the body as sacred.',
    politicalLean: 'conservative',
    color: '#a855f7', // purple
    higherOrder: 'Binding',
  },
};

// MFQ-2 Items (36 total, 6 per foundation)
// All items use the same format: "How well does this statement describe you?"
// Response scale: 0-4 (Does not describe me at all to Describes me extremely well)
export const items: Item[] = [
  // Care items (1, 7, 13, 19, 25, 31)
  { id: 1, text: 'Caring for people who have suffered is an important virtue.', foundation: 'Care' },
  { id: 7, text: 'I believe that compassion for those who are suffering is one of the most crucial virtues.', foundation: 'Care' },
  { id: 13, text: 'We should all care for people who are in emotional pain.', foundation: 'Care' },
  { id: 19, text: 'I am empathetic toward those people who have suffered in their lives.', foundation: 'Care' },
  { id: 25, text: 'Everyone should try to comfort people who are going through something hard.', foundation: 'Care' },
  { id: 31, text: 'It pains me when I see someone ignoring the needs of another human being.', foundation: 'Care' },

  // Equality items (2, 8, 14, 20, 26, 32)
  { id: 2, text: 'The world would be a better place if everyone made the same amount of money.', foundation: 'Equality' },
  { id: 8, text: 'Our society would have fewer problems if people had the same income.', foundation: 'Equality' },
  { id: 14, text: 'I believe that everyone should be given the same quantity of resources in life.', foundation: 'Equality' },
  { id: 20, text: 'I believe it would be ideal if everyone in society wound up with roughly the same amount of money.', foundation: 'Equality' },
  { id: 26, text: 'When people work together toward a common goal, they should share the rewards equally, even if some worked harder on it.', foundation: 'Equality' },
  { id: 32, text: 'I get upset when some people have a lot more money than others in my country.', foundation: 'Equality' },

  // Proportionality items (3, 9, 15, 21, 27, 33)
  { id: 3, text: 'I think people who are more hardworking should end up with more money.', foundation: 'Proportionality' },
  { id: 9, text: 'I think people should be rewarded in proportion to what they contribute.', foundation: 'Proportionality' },
  { id: 15, text: 'The effort a worker puts into a job ought to be reflected in the size of a raise they receive.', foundation: 'Proportionality' },
  { id: 21, text: 'It makes me happy when people are recognized on their merits.', foundation: 'Proportionality' },
  { id: 27, text: 'In a fair society, those who work hard should live with higher standards of living.', foundation: 'Proportionality' },
  { id: 33, text: 'I feel good when I see cheaters get caught and punished.', foundation: 'Proportionality' },

  // Loyalty items (4, 10, 16, 22, 28, 34)
  { id: 4, text: 'I think children should be taught to be loyal to their country.', foundation: 'Loyalty' },
  { id: 10, text: 'It upsets me when people have no loyalty to their country.', foundation: 'Loyalty' },
  { id: 16, text: 'Everyone should love their own community.', foundation: 'Loyalty' },
  { id: 22, text: 'Everyone should defend their country, if called upon.', foundation: 'Loyalty' },
  { id: 28, text: 'Everyone should feel proud when a person in their community wins in an international competition.', foundation: 'Loyalty' },
  { id: 34, text: 'I believe that the strength of a sports team comes from the loyalty of its members to each other.', foundation: 'Loyalty' },

  // Authority items (5, 11, 17, 23, 29, 35)
  { id: 5, text: 'I think it is important for societies to cherish their traditional values.', foundation: 'Authority' },
  { id: 11, text: 'I feel that most traditions serve a valuable function in keeping society orderly.', foundation: 'Authority' },
  { id: 17, text: 'I think obedience to parents is an important virtue.', foundation: 'Authority' },
  { id: 23, text: 'We all need to learn from our elders.', foundation: 'Authority' },
  { id: 29, text: 'I believe that one of the most important values to teach children is to have respect for authority.', foundation: 'Authority' },
  { id: 35, text: 'I think having a strong leader is good for society.', foundation: 'Authority' },

  // Purity items (6, 12, 18, 24, 30, 36)
  { id: 6, text: 'I think the human body should be treated like a temple, housing something sacred within.', foundation: 'Purity' },
  { id: 12, text: 'I believe chastity is an important virtue.', foundation: 'Purity' },
  { id: 18, text: 'It upsets me when people use foul language like it is nothing.', foundation: 'Purity' },
  { id: 24, text: 'If I found out that an acquaintance had an unusual but harmless sexual fetish, I would feel uneasy about them.', foundation: 'Purity' },
  { id: 30, text: 'People should try to use natural medicines rather than chemically identical human-made ones.', foundation: 'Purity' },
  { id: 36, text: 'I admire people who keep their virginity until marriage.', foundation: 'Purity' },
];

// Get all foundations
export const foundations: Foundation[] = ['Care', 'Equality', 'Proportionality', 'Loyalty', 'Authority', 'Purity'];

// Get individualizing foundations (Care, Equality)
export const individualizingFoundations: Foundation[] = ['Care', 'Equality'];

// Get binding foundations (Proportionality, Loyalty, Authority, Purity)
export const bindingFoundations: Foundation[] = ['Proportionality', 'Loyalty', 'Authority', 'Purity'];

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

// Citation for academic use
export const citation = `Atari, M., Haidt, J., Graham, J., Koleva, S., Stevens, S. T., & Dehghani, M. (2023). Morality beyond the WEIRD: How the nomological network of morality varies across cultures. Journal of Personality and Social Psychology, 125(5), 1157-1188.`;

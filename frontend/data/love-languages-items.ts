// Communication Styles Assessment Items
// An original assessment inspired by relationship communication concepts
// This is NOT the trademarked "5 Love Languages" - it's an original creation

export type CommunicationStyle = 'words' | 'time' | 'gifts' | 'service' | 'touch';

export interface StyleOption {
  text: string;
  style: CommunicationStyle;
}

export interface ForcedChoiceItem {
  id: number;
  optionA: StyleOption;
  optionB: StyleOption;
}

export interface StyleInfo {
  code: CommunicationStyle;
  name: string;
  description: string;
  examples: string[];
  color: string;
}

export const styleInfo: Record<CommunicationStyle, StyleInfo> = {
  words: {
    code: 'words',
    name: 'Verbal Appreciation',
    description: 'You feel most valued when people express their feelings through spoken or written words. Compliments, encouragement, and verbal acknowledgment of your efforts make you feel truly seen and appreciated.',
    examples: [
      'Receiving a heartfelt compliment',
      'Getting a thoughtful thank-you note',
      'Hearing "I\'m proud of you"',
      'Receiving specific praise for your work',
    ],
    color: '#f97316', // orange
  },
  time: {
    code: 'time',
    name: 'Focused Attention',
    description: 'You feel most connected when someone gives you their undivided attention. Quality conversations, shared activities, and being fully present together are what make you feel most loved.',
    examples: [
      'Having deep conversations without distractions',
      'Someone putting away their phone to focus on you',
      'Sharing a meaningful activity together',
      'Eye contact and active listening',
    ],
    color: '#3b82f6', // blue
  },
  gifts: {
    code: 'gifts',
    name: 'Thoughtful Tokens',
    description: 'You feel most appreciated when someone gives you meaningful gifts. It\'s not about monetary value - it\'s the thought, effort, and symbolism behind the gesture that makes you feel special.',
    examples: [
      'A small gift that shows they remembered something you said',
      'Bringing home your favorite treat unexpectedly',
      'Creating something by hand just for you',
      'A surprise that shows they were thinking of you',
    ],
    color: '#22c55e', // green
  },
  service: {
    code: 'service',
    name: 'Helpful Actions',
    description: 'You feel most cared for when someone helps lighten your load through practical actions. Actions speak louder than words for you - when someone does something helpful, it shows they truly care.',
    examples: [
      'Someone handling a task without being asked',
      'Taking over chores when you\'re stressed',
      'Running errands to help out',
      'Fixing something that\'s been bothering you',
    ],
    color: '#a855f7', // purple
  },
  touch: {
    code: 'touch',
    name: 'Physical Connection',
    description: 'You feel most secure and loved through appropriate physical contact. A hug, a pat on the back, or holding hands communicates care and connection to you more than words ever could.',
    examples: [
      'A warm, lingering hug',
      'A reassuring hand on your shoulder',
      'Sitting close together',
      'A pat on the back for encouragement',
    ],
    color: '#14b8a6', // teal
  },
};

// 30 forced-choice pairs covering all style combinations
// Each pair presents two different styles, asking which feels more meaningful
// With 5 styles, there are 10 unique pairs. We include 3 of each for balance.
export const items: ForcedChoiceItem[] = [
  // words vs time (3 pairs)
  {
    id: 1,
    optionA: { text: 'Receiving a heartfelt message about why you matter', style: 'words' },
    optionB: { text: 'Having someone\'s complete attention for an evening', style: 'time' },
  },
  {
    id: 2,
    optionA: { text: 'Hearing specific praise for something you did well', style: 'words' },
    optionB: { text: 'Having a long, uninterrupted conversation together', style: 'time' },
  },
  {
    id: 3,
    optionA: { text: 'Getting an encouraging note when facing a challenge', style: 'words' },
    optionB: { text: 'Someone canceling other plans to spend time with you', style: 'time' },
  },

  // words vs gifts (3 pairs)
  {
    id: 4,
    optionA: { text: 'Being told "I\'m so grateful you\'re in my life"', style: 'words' },
    optionB: { text: 'Receiving a surprise gift that shows they listened', style: 'gifts' },
  },
  {
    id: 5,
    optionA: { text: 'A compliment about your personality or character', style: 'words' },
    optionB: { text: 'A small memento from a shared experience', style: 'gifts' },
  },
  {
    id: 6,
    optionA: { text: 'Written words expressing deep appreciation', style: 'words' },
    optionB: { text: 'A carefully chosen present for a special occasion', style: 'gifts' },
  },

  // words vs service (3 pairs)
  {
    id: 7,
    optionA: { text: 'Verbal acknowledgment of your hard work', style: 'words' },
    optionB: { text: 'Someone taking tasks off your plate without being asked', style: 'service' },
  },
  {
    id: 8,
    optionA: { text: 'Hearing "I believe in you"', style: 'words' },
    optionB: { text: 'Coming home to find your chores already done', style: 'service' },
  },
  {
    id: 9,
    optionA: { text: 'A text message just to say you\'re appreciated', style: 'words' },
    optionB: { text: 'Someone preparing a meal for you after a long day', style: 'service' },
  },

  // words vs touch (3 pairs)
  {
    id: 10,
    optionA: { text: 'Being told exactly what someone loves about you', style: 'words' },
    optionB: { text: 'A warm, comforting hug when you need it', style: 'touch' },
  },
  {
    id: 11,
    optionA: { text: 'Receiving a love letter or meaningful card', style: 'words' },
    optionB: { text: 'Holding hands while walking together', style: 'touch' },
  },
  {
    id: 12,
    optionA: { text: 'Public recognition of your contributions', style: 'words' },
    optionB: { text: 'A reassuring pat on the back after a setback', style: 'touch' },
  },

  // time vs gifts (3 pairs)
  {
    id: 13,
    optionA: { text: 'An entire day devoted to doing activities together', style: 'time' },
    optionB: { text: 'A meaningful gift that took effort to find', style: 'gifts' },
  },
  {
    id: 14,
    optionA: { text: 'Regular one-on-one time without distractions', style: 'time' },
    optionB: { text: 'Receiving your favorite things as surprises', style: 'gifts' },
  },
  {
    id: 15,
    optionA: { text: 'Someone making time to hear about your day', style: 'time' },
    optionB: { text: 'A souvenir that shows someone thought of you', style: 'gifts' },
  },

  // time vs service (3 pairs)
  {
    id: 16,
    optionA: { text: 'Weekend getaways focused on being together', style: 'time' },
    optionB: { text: 'Coming home to find all the housework done', style: 'service' },
  },
  {
    id: 17,
    optionA: { text: 'Having someone fully present during conversations', style: 'time' },
    optionB: { text: 'Someone running your errands for you', style: 'service' },
  },
  {
    id: 18,
    optionA: { text: 'Planning special outings just to be together', style: 'time' },
    optionB: { text: 'Someone fixing things around the house for you', style: 'service' },
  },

  // time vs touch (3 pairs)
  {
    id: 19,
    optionA: { text: 'Long talks that go late into the night', style: 'time' },
    optionB: { text: 'Cuddling while watching a movie', style: 'touch' },
  },
  {
    id: 20,
    optionA: { text: 'Someone showing up when you need company', style: 'time' },
    optionB: { text: 'A comforting embrace during difficult moments', style: 'touch' },
  },
  {
    id: 21,
    optionA: { text: 'Having someone\'s undivided attention at dinner', style: 'time' },
    optionB: { text: 'Sitting close together while relaxing', style: 'touch' },
  },

  // gifts vs service (3 pairs)
  {
    id: 22,
    optionA: { text: 'Receiving a gift that reflects your interests', style: 'gifts' },
    optionB: { text: 'Having help with a project you\'ve been putting off', style: 'service' },
  },
  {
    id: 23,
    optionA: { text: 'A surprise delivery of something you mentioned wanting', style: 'gifts' },
    optionB: { text: 'Someone taking care of a task you dread', style: 'service' },
  },
  {
    id: 24,
    optionA: { text: 'A homemade present created just for you', style: 'gifts' },
    optionB: { text: 'Help with responsibilities when you\'re overwhelmed', style: 'service' },
  },

  // gifts vs touch (3 pairs)
  {
    id: 25,
    optionA: { text: 'A meaningful keepsake to remember a moment', style: 'gifts' },
    optionB: { text: 'A long, genuine hug of greeting', style: 'touch' },
  },
  {
    id: 26,
    optionA: { text: 'Flowers or a treat brought home unexpectedly', style: 'gifts' },
    optionB: { text: 'A massage after a stressful day', style: 'touch' },
  },
  {
    id: 27,
    optionA: { text: 'A photo album of shared memories', style: 'gifts' },
    optionB: { text: 'Dancing together at home', style: 'touch' },
  },

  // service vs touch (3 pairs)
  {
    id: 28,
    optionA: { text: 'Someone handling your to-do list when you\'re tired', style: 'service' },
    optionB: { text: 'A comforting arm around your shoulders', style: 'touch' },
  },
  {
    id: 29,
    optionA: { text: 'Having your car cleaned and filled with gas', style: 'service' },
    optionB: { text: 'Physical closeness while sharing a quiet moment', style: 'touch' },
  },
  {
    id: 30,
    optionA: { text: 'Someone making your morning coffee', style: 'service' },
    optionB: { text: 'Starting the day with a warm embrace', style: 'touch' },
  },
];

// Helper to get all styles
export const allStyles: CommunicationStyle[] = ['words', 'time', 'gifts', 'service', 'touch'];

// Shuffle items for the assessment (consistent shuffle based on seed)
export function shuffleItems(seed: number = 42): ForcedChoiceItem[] {
  const shuffled = [...items];
  let currentIndex = shuffled.length;

  // Simple seeded random
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    const randomValue = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomValue]] = [shuffled[randomValue], shuffled[currentIndex]];
  }

  return shuffled;
}

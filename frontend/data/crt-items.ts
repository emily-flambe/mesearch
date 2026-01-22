// Cognitive Reflection Test (CRT-7) Items
// Source: Toplak et al. (2014) - The Cognitive Reflection Test
// These items are widely used in cognitive psychology research

export interface CRTItem {
  id: number;
  name: string;                 // Human-readable name for the problem
  text: string;                 // The problem text
  correctAnswer: string;        // The correct answer (canonical form)
  intuitiveAnswer: string;      // The common wrong answer people give
  explanation: string;          // Why the intuitive answer is wrong
  category: 'numeric' | 'verbal';
  // Acceptable answer variations - used for validation
  correctVariations: string[];  // All acceptable forms of the correct answer
  intuitiveVariations: string[]; // All acceptable forms of the intuitive answer
}

// CRT-7 items from Toplak et al. (2014)
export const crtItems: CRTItem[] = [
  {
    id: 1,
    name: 'Bat and Ball',
    text: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? (in cents)',
    correctAnswer: '5',
    intuitiveAnswer: '10',
    explanation: 'If the ball costs 5 cents, then the bat costs $1.05 (which is $1.00 more than 5 cents), and together they cost $1.10. If the ball were 10 cents, the bat would cost $1.10, making the total $1.20.',
    category: 'numeric',
    correctVariations: ['5', '5 cents', '5c', '$0.05', '0.05', 'five', 'five cents', '.05'],
    intuitiveVariations: ['10', '10 cents', '10c', '$0.10', '0.10', 'ten', 'ten cents', '.10'],
  },
  {
    id: 2,
    name: 'Widget Machines',
    text: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets? (in minutes)',
    correctAnswer: '5',
    intuitiveAnswer: '100',
    explanation: 'Each machine makes 1 widget in 5 minutes. So 100 machines can each make 1 widget in 5 minutes, producing 100 widgets total in 5 minutes.',
    category: 'numeric',
    correctVariations: ['5', '5 minutes', '5 min', 'five', 'five minutes'],
    intuitiveVariations: ['100', '100 minutes', '100 min', 'hundred', 'one hundred', 'one hundred minutes'],
  },
  {
    id: 3,
    name: 'Lily Pad',
    text: 'In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake? (in days)',
    correctAnswer: '47',
    intuitiveAnswer: '24',
    explanation: 'Since the patch doubles each day, if it covers the whole lake on day 48, it must have covered half the lake on day 47 (and then doubled to cover the whole lake on day 48).',
    category: 'numeric',
    correctVariations: ['47', '47 days', 'forty-seven', 'forty seven', 'forty-seven days', 'forty seven days'],
    intuitiveVariations: ['24', '24 days', 'twenty-four', 'twenty four', 'twenty-four days', 'twenty four days'],
  },
  {
    id: 4,
    name: 'Sock Drawer',
    text: 'If John can drink one barrel of water in 6 days, and Mary can drink one barrel of water in 12 days, how long would it take them to drink one barrel of water together? (in days)',
    correctAnswer: '4',
    intuitiveAnswer: '9',
    explanation: 'John drinks 1/6 of a barrel per day, Mary drinks 1/12 per day. Together they drink 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4 of a barrel per day. So it takes 4 days to drink one barrel.',
    category: 'numeric',
    correctVariations: ['4', '4 days', 'four', 'four days'],
    intuitiveVariations: ['9', '9 days', 'nine', 'nine days', '18', '18 days', 'eighteen', 'eighteen days'],
  },
  {
    id: 5,
    name: 'Race Position',
    text: 'Jerry received both the 15th highest and the 15th lowest mark in the class. How many students are in the class?',
    correctAnswer: '29',
    intuitiveAnswer: '30',
    explanation: 'If Jerry is 15th highest, there are 14 students above him. If Jerry is 15th lowest, there are 14 students below him. Total: 14 + 1 (Jerry) + 14 = 29 students.',
    category: 'numeric',
    correctVariations: ['29', '29 students', 'twenty-nine', 'twenty nine', 'twenty-nine students', 'twenty nine students'],
    intuitiveVariations: ['30', '30 students', 'thirty', 'thirty students'],
  },
  {
    id: 6,
    name: 'Pig and Pond',
    text: 'A man buys a pig for $60, sells it for $70, buys it back for $80, and sells it finally for $90. How much has he made? (in dollars)',
    correctAnswer: '20',
    intuitiveAnswer: '10',
    explanation: 'First transaction: Buy $60, Sell $70 = +$10. Second transaction: Buy $80, Sell $90 = +$10. Total profit: $10 + $10 = $20.',
    category: 'numeric',
    correctVariations: ['20', '$20', '20 dollars', 'twenty', 'twenty dollars'],
    intuitiveVariations: ['10', '$10', '10 dollars', 'ten', 'ten dollars'],
  },
  {
    id: 7,
    name: 'Emily Father',
    text: "Emily's father has three daughters. The first two are named April and May. What is the third daughter's name?",
    correctAnswer: 'Emily',
    intuitiveAnswer: 'June',
    explanation: "The problem states these are Emily's father's three daughters - and Emily is telling you about them, so she must be one of them! The third daughter is Emily.",
    category: 'verbal',
    correctVariations: ['emily', 'emilie', 'emilee'],
    intuitiveVariations: ['june'],
  },
];

// Prior exposure question options
export const priorExposureOptions = [
  { value: 'none', label: "No, I've never seen these types of problems before" },
  { value: 'some', label: "I've seen one or two of these before" },
  { value: 'most', label: "I've seen most of these before" },
  { value: 'all', label: "I've seen all of these before" },
];

export type PriorExposure = 'none' | 'some' | 'most' | 'all';

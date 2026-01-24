// Multiracial Reading the Mind in the Eyes Test (MRMET) Items
// Source: Warrier, V., et al. (2024). Multiracial Reading the Mind in the Eyes Test (MRMET):
// An inclusive version of an influential measure. Behavior Research Methods.
// https://doi.org/10.3758/s13428-023-02323-x
//
// Materials obtained from OSF: https://osf.io/ahq6n/
//
// LICENSE: CC-BY-SA 4.0 (The Many Brains Project and Harvard University)
// https://creativecommons.org/licenses/by-sa/4.0/
//
// Attribution required: Images and test materials are protected by CC-BY-SA 4.0 license.
// They can be shared with appropriate attribution and derivatives cannot use a more
// restricted license.

export interface RMETItem {
  id: number;
  imageUrl: string;
  options: string[];
  correctAnswer: string;
  definitions?: Record<string, string>;
}

// Vocabulary definitions for difficult/uncommon words
export const vocabularyDefinitions: Record<string, string> = {
  aghast: 'Filled with horror or shock',
  cautious: 'Careful to avoid potential problems or dangers',
  contemplative: 'Deep in thought; meditative',
  defiant: 'Showing open resistance or bold disobedience',
  despondent: 'In low spirits from loss of hope or courage',
  dispirited: 'Having lost enthusiasm and hope; disheartened',
  distrustful: 'Feeling or showing distrust of someone or something',
  dominant: 'Having power and influence over others',
  enraged: 'Very angry; furious',
  fantasizing: 'Indulging in daydreaming or imagining',
  hostile: 'Unfriendly; antagonistic',
  indifferent: 'Having no particular interest or concern; uncaring',
  preoccupied: 'Absorbed in thought; distracted',
  sarcastic: 'Using irony to mock or convey contempt',
  tentative: 'Uncertain; hesitant',
  threatening: 'Having a hostile or deliberately frightening quality',
};

// Image base URL - served from public folder
const IMAGE_BASE_URL = '/images/mrmet';

// 37 MRMET items (plus practice item)
// Practice item has id=0, scored items are 1-37
export const rmetItems: RMETItem[] = [
  // Practice item (not scored)
  {
    id: 0,
    imageUrl: `${IMAGE_BASE_URL}/3Aghast-J.jpg`,
    options: ['anxious', 'disappointed', 'shocked', 'concerned'],
    correctAnswer: 'shocked',
  },
  // Scored items 1-37
  {
    id: 1,
    imageUrl: `${IMAGE_BASE_URL}/37Friendly-J.jpg`,
    options: ['nervous', 'sarcastic', 'curious', 'friendly'],
    correctAnswer: 'friendly',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 2,
    imageUrl: `${IMAGE_BASE_URL}/52Panicked-M.jpg`,
    options: ['threatening', 'disappointed', 'panicked', 'concerned'],
    correctAnswer: 'panicked',
    definitions: { threatening: vocabularyDefinitions.threatening },
  },
  {
    id: 3,
    imageUrl: `${IMAGE_BASE_URL}/60Relieved-S.jpg`,
    options: ['indifferent', 'relieved', 'puzzled', 'terrified'],
    correctAnswer: 'relieved',
    definitions: { indifferent: vocabularyDefinitions.indifferent },
  },
  {
    id: 4,
    imageUrl: `${IMAGE_BASE_URL}/33Excited-J.jpg`,
    options: ['excited', 'embarrassed', 'interested', 'sarcastic'],
    correctAnswer: 'excited',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 5,
    imageUrl: `${IMAGE_BASE_URL}/52Panicked-J.jpg`,
    options: ['threatening', 'panicked', 'concerned', 'disappointed'],
    correctAnswer: 'panicked',
    definitions: { threatening: vocabularyDefinitions.threatening },
  },
  {
    id: 6,
    imageUrl: `${IMAGE_BASE_URL}/17Confident-R.jpg`,
    options: ['disappointed', 'confident', 'confused', 'uneasy'],
    correctAnswer: 'confident',
  },
  {
    id: 7,
    imageUrl: `${IMAGE_BASE_URL}/37Friendly-M.jpg`,
    options: ['curious', 'friendly', 'sarcastic', 'nervous'],
    correctAnswer: 'friendly',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 8,
    imageUrl: `${IMAGE_BASE_URL}/5Amused-Lo.jpg`,
    options: ['amused', 'excited', 'curious', 'disappointed'],
    correctAnswer: 'amused',
  },
  {
    id: 9,
    imageUrl: `${IMAGE_BASE_URL}/68Terrified-A.jpg`,
    options: ['irritated', 'threatening', 'concerned', 'terrified'],
    correctAnswer: 'terrified',
    definitions: { threatening: vocabularyDefinitions.threatening },
  },
  {
    id: 10,
    imageUrl: `${IMAGE_BASE_URL}/33Excited-R.jpg`,
    options: ['interested', 'sarcastic', 'embarrassed', 'excited'],
    correctAnswer: 'excited',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 11,
    imageUrl: `${IMAGE_BASE_URL}/46Indifferent-S.jpg`,
    options: ['indifferent', 'preoccupied', 'uneasy', 'puzzled'],
    correctAnswer: 'indifferent',
    definitions: {
      indifferent: vocabularyDefinitions.indifferent,
      preoccupied: vocabularyDefinitions.preoccupied,
    },
  },
  {
    id: 12,
    imageUrl: `${IMAGE_BASE_URL}/37Friendly-Ad.jpg`,
    options: ['friendly', 'sarcastic', 'curious', 'nervous'],
    correctAnswer: 'friendly',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 13,
    imageUrl: `${IMAGE_BASE_URL}/33Excited-L.jpg`,
    options: ['sarcastic', 'interested', 'embarrassed', 'excited'],
    correctAnswer: 'excited',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 14,
    imageUrl: `${IMAGE_BASE_URL}/5Amused-E.jpg`,
    options: ['amused', 'excited', 'curious', 'disappointed'],
    correctAnswer: 'amused',
  },
  {
    id: 15,
    imageUrl: `${IMAGE_BASE_URL}/60Relieved-D.jpg`,
    options: ['relieved', 'indifferent', 'puzzled', 'terrified'],
    correctAnswer: 'relieved',
    definitions: { indifferent: vocabularyDefinitions.indifferent },
  },
  {
    id: 16,
    imageUrl: `${IMAGE_BASE_URL}/52Panicked-G.jpg`,
    options: ['panicked', 'threatening', 'disappointed', 'concerned'],
    correctAnswer: 'panicked',
    definitions: { threatening: vocabularyDefinitions.threatening },
  },
  {
    id: 17,
    imageUrl: `${IMAGE_BASE_URL}/18Confused-Ad.jpg`,
    options: ['confused', 'hostile', 'threatening', 'amused'],
    correctAnswer: 'confused',
    definitions: {
      hostile: vocabularyDefinitions.hostile,
      threatening: vocabularyDefinitions.threatening,
    },
  },
  {
    id: 18,
    imageUrl: `${IMAGE_BASE_URL}/50Joking-S.jpg`,
    options: ['thoughtful', 'excited', 'fantasizing', 'joking'],
    correctAnswer: 'joking',
    definitions: { fantasizing: vocabularyDefinitions.fantasizing },
  },
  {
    id: 19,
    imageUrl: `${IMAGE_BASE_URL}/5Amused-M.jpg`,
    options: ['curious', 'amused', 'excited', 'disappointed'],
    correctAnswer: 'amused',
  },
  {
    id: 20,
    imageUrl: `${IMAGE_BASE_URL}/18Confused-Am.jpg`,
    options: ['confused', 'hostile', 'threatening', 'amused'],
    correctAnswer: 'confused',
    definitions: {
      hostile: vocabularyDefinitions.hostile,
      threatening: vocabularyDefinitions.threatening,
    },
  },
  {
    id: 21,
    imageUrl: `${IMAGE_BASE_URL}/46Indifferent-A.jpg`,
    options: ['uneasy', 'puzzled', 'indifferent', 'preoccupied'],
    correctAnswer: 'indifferent',
    definitions: {
      indifferent: vocabularyDefinitions.indifferent,
      preoccupied: vocabularyDefinitions.preoccupied,
    },
  },
  {
    id: 22,
    imageUrl: `${IMAGE_BASE_URL}/46Indifferent-B.jpg`,
    options: ['indifferent', 'preoccupied', 'puzzled', 'uneasy'],
    correctAnswer: 'indifferent',
    definitions: {
      indifferent: vocabularyDefinitions.indifferent,
      preoccupied: vocabularyDefinitions.preoccupied,
    },
  },
  {
    id: 23,
    imageUrl: `${IMAGE_BASE_URL}/17Confident-M.jpg`,
    options: ['uneasy', 'confused', 'confident', 'disappointed'],
    correctAnswer: 'confident',
  },
  {
    id: 24,
    imageUrl: `${IMAGE_BASE_URL}/11Ashamed-J.jpg`,
    options: ['nervous', 'ashamed', 'affectionate', 'friendly'],
    correctAnswer: 'ashamed',
  },
  {
    id: 25,
    imageUrl: `${IMAGE_BASE_URL}/5Amused-Ly.jpg`,
    options: ['excited', 'disappointed', 'curious', 'amused'],
    correctAnswer: 'amused',
  },
  {
    id: 26,
    imageUrl: `${IMAGE_BASE_URL}/1Accusing-L.jpg`,
    options: ['accusing', 'confused', 'cautious', 'dominant'],
    correctAnswer: 'accusing',
    definitions: {
      cautious: vocabularyDefinitions.cautious,
      dominant: vocabularyDefinitions.dominant,
    },
  },
  {
    id: 27,
    imageUrl: `${IMAGE_BASE_URL}/5Amused-D.jpg`,
    options: ['disappointed', 'excited', 'amused', 'curious'],
    correctAnswer: 'amused',
  },
  {
    id: 28,
    imageUrl: `${IMAGE_BASE_URL}/37Friendly-Am.jpg`,
    options: ['friendly', 'sarcastic', 'curious', 'nervous'],
    correctAnswer: 'friendly',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 29,
    imageUrl: `${IMAGE_BASE_URL}/11Ashamed-B.jpg`,
    options: ['affectionate', 'ashamed', 'friendly', 'nervous'],
    correctAnswer: 'ashamed',
  },
  {
    id: 30,
    imageUrl: `${IMAGE_BASE_URL}/28Distrustful-A.jpg`,
    options: ['curious', 'distrustful', 'hostile', 'joking'],
    correctAnswer: 'distrustful',
    definitions: {
      distrustful: vocabularyDefinitions.distrustful,
      hostile: vocabularyDefinitions.hostile,
    },
  },
  {
    id: 31,
    imageUrl: `${IMAGE_BASE_URL}/16Concerned-J.jpg`,
    options: ['concerned', 'confused', 'defiant', 'disappointed'],
    correctAnswer: 'concerned',
    definitions: { defiant: vocabularyDefinitions.defiant },
  },
  {
    id: 32,
    imageUrl: `${IMAGE_BASE_URL}/55Preoccupied-S.jpg`,
    options: ['depressed', 'preoccupied', 'confused', 'alarmed'],
    correctAnswer: 'preoccupied',
    definitions: { preoccupied: vocabularyDefinitions.preoccupied },
  },
  {
    id: 33,
    imageUrl: `${IMAGE_BASE_URL}/33Excited-K.jpg`,
    options: ['excited', 'embarrassed', 'interested', 'sarcastic'],
    correctAnswer: 'excited',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 34,
    imageUrl: `${IMAGE_BASE_URL}/46Indifferent-Ja.jpg`,
    options: ['preoccupied', 'indifferent', 'uneasy', 'puzzled'],
    correctAnswer: 'indifferent',
    definitions: {
      indifferent: vocabularyDefinitions.indifferent,
      preoccupied: vocabularyDefinitions.preoccupied,
    },
  },
  {
    id: 35,
    imageUrl: `${IMAGE_BASE_URL}/70Threatening-E.jpg`,
    options: ['enraged', 'angry', 'threatening', 'scared'],
    correctAnswer: 'threatening',
    definitions: {
      enraged: vocabularyDefinitions.enraged,
      threatening: vocabularyDefinitions.threatening,
    },
  },
  {
    id: 36,
    imageUrl: `${IMAGE_BASE_URL}/46Indifferent-Ju.jpg`,
    options: ['indifferent', 'preoccupied', 'puzzled', 'uneasy'],
    correctAnswer: 'indifferent',
    definitions: {
      indifferent: vocabularyDefinitions.indifferent,
      preoccupied: vocabularyDefinitions.preoccupied,
    },
  },
  {
    id: 37,
    imageUrl: `${IMAGE_BASE_URL}/41Hostile-R.jpg`,
    options: ['hostile', 'threatening', 'shocked', 'tentative'],
    correctAnswer: 'hostile',
    definitions: {
      hostile: vocabularyDefinitions.hostile,
      threatening: vocabularyDefinitions.threatening,
      tentative: vocabularyDefinitions.tentative,
    },
  },
];

// Get scored items only (excludes practice item)
export const scoredItems = rmetItems.filter((item) => item.id > 0);

// Get practice item
export const practiceItem = rmetItems.find((item) => item.id === 0)!;

// Get definition for a word if it exists
export function getDefinition(word: string): string | undefined {
  return vocabularyDefinitions[word.toLowerCase()];
}

// Check if a word has a definition available
export function hasDefinition(word: string): boolean {
  return word.toLowerCase() in vocabularyDefinitions;
}

// Attribution text for display in the UI
export const MRMET_ATTRIBUTION = {
  title: 'Multiracial Reading the Mind in the Eyes Test (MRMET)',
  citation:
    'Warrier, V., et al. (2024). Multiracial Reading the Mind in the Eyes Test (MRMET): An inclusive version of an influential measure. Behavior Research Methods.',
  doi: 'https://doi.org/10.3758/s13428-023-02323-x',
  license: 'CC-BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  copyright: 'The Many Brains Project and Harvard University',
  osf: 'https://osf.io/ahq6n/',
};

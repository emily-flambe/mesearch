// Reading the Mind in the Eyes Test (RMET) Items
// Source: Baron-Cohen, S., Wheelwright, S., Hill, J., Raste, Y., & Plumb, I. (2001).
// The "Reading the Mind in the Eyes" Test Revised Version: A Study with Normal Adults,
// and Adults with Asperger Syndrome or High-functioning Autism.
// Journal of Child Psychology and Psychiatry, 42(2), 241-251.
//
// IMPORTANT: The original RMET images are copyrighted and require permission
// from the Autism Research Centre for use. This implementation uses placeholder
// image URLs that should be replaced with properly licensed images.
//
// Options for image sourcing:
// 1. Request permission from Autism Research Centre (https://www.autismresearchcentre.com/)
// 2. Use Multiracial RMET (MRMET) stimuli with appropriate permissions
// 3. Create or license original eye photographs

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
  contemplative: 'Deep in thought; meditative',
  despondent: 'In low spirits from loss of hope or courage',
  dispirited: 'Having lost enthusiasm and hope; disheartened',
  fantasizing: 'Indulging in daydreaming or imagining',
  flustered: 'Agitated or confused',
  imploring: 'Making an earnest or desperate appeal',
  incredulous: 'Unwilling or unable to believe something',
  pensive: 'Engaged in deep or serious thought',
  preoccupied: 'Absorbed in thought; distracted',
  reflective: 'Relating to or characterized by deep thought',
  sarcastic: 'Using irony to mock or convey contempt',
  skeptical: 'Not easily convinced; having doubts',
  tentative: 'Uncertain; hesitant',
  distrustful: 'Feeling or showing distrust of someone or something',
  defiant: 'Showing open resistance or bold disobedience',
  baffled: 'Totally bewildered or perplexed',
};

// Placeholder image base URL - in production, replace with actual licensed images
// Using a placeholder service for development/testing
const IMAGE_BASE_URL = '/images/rmet';

// 36 RMET items (plus practice item)
// Item 0 is the practice item, Items 1-36 are scored
export const rmetItems: RMETItem[] = [
  // Practice item (not scored)
  {
    id: 0,
    imageUrl: `${IMAGE_BASE_URL}/practice.jpg`,
    options: ['jealous', 'panicked', 'arrogant', 'hateful'],
    correctAnswer: 'panicked',
  },
  // Scored items 1-36
  {
    id: 1,
    imageUrl: `${IMAGE_BASE_URL}/01.jpg`,
    options: ['playful', 'comforting', 'irritated', 'bored'],
    correctAnswer: 'playful',
  },
  {
    id: 2,
    imageUrl: `${IMAGE_BASE_URL}/02.jpg`,
    options: ['terrified', 'upset', 'arrogant', 'annoyed'],
    correctAnswer: 'upset',
  },
  {
    id: 3,
    imageUrl: `${IMAGE_BASE_URL}/03.jpg`,
    options: ['joking', 'flustered', 'desire', 'convinced'],
    correctAnswer: 'desire',
    definitions: { flustered: vocabularyDefinitions.flustered },
  },
  {
    id: 4,
    imageUrl: `${IMAGE_BASE_URL}/04.jpg`,
    options: ['joking', 'insisting', 'amused', 'relaxed'],
    correctAnswer: 'insisting',
  },
  {
    id: 5,
    imageUrl: `${IMAGE_BASE_URL}/05.jpg`,
    options: ['irritated', 'sarcastic', 'worried', 'friendly'],
    correctAnswer: 'worried',
    definitions: { sarcastic: vocabularyDefinitions.sarcastic },
  },
  {
    id: 6,
    imageUrl: `${IMAGE_BASE_URL}/06.jpg`,
    options: ['aghast', 'fantasizing', 'impatient', 'alarmed'],
    correctAnswer: 'fantasizing',
    definitions: {
      aghast: vocabularyDefinitions.aghast,
      fantasizing: vocabularyDefinitions.fantasizing,
    },
  },
  {
    id: 7,
    imageUrl: `${IMAGE_BASE_URL}/07.jpg`,
    options: ['apologetic', 'friendly', 'uneasy', 'dispirited'],
    correctAnswer: 'uneasy',
    definitions: { dispirited: vocabularyDefinitions.dispirited },
  },
  {
    id: 8,
    imageUrl: `${IMAGE_BASE_URL}/08.jpg`,
    options: ['despondent', 'relieved', 'shy', 'excited'],
    correctAnswer: 'despondent',
    definitions: { despondent: vocabularyDefinitions.despondent },
  },
  {
    id: 9,
    imageUrl: `${IMAGE_BASE_URL}/09.jpg`,
    options: ['annoyed', 'hostile', 'horrified', 'preoccupied'],
    correctAnswer: 'preoccupied',
    definitions: { preoccupied: vocabularyDefinitions.preoccupied },
  },
  {
    id: 10,
    imageUrl: `${IMAGE_BASE_URL}/10.jpg`,
    options: ['cautious', 'insisting', 'bored', 'aghast'],
    correctAnswer: 'cautious',
    definitions: { aghast: vocabularyDefinitions.aghast },
  },
  {
    id: 11,
    imageUrl: `${IMAGE_BASE_URL}/11.jpg`,
    options: ['terrified', 'amused', 'regretful', 'flirtatious'],
    correctAnswer: 'regretful',
  },
  {
    id: 12,
    imageUrl: `${IMAGE_BASE_URL}/12.jpg`,
    options: ['indifferent', 'embarrassed', 'skeptical', 'dispirited'],
    correctAnswer: 'skeptical',
    definitions: {
      skeptical: vocabularyDefinitions.skeptical,
      dispirited: vocabularyDefinitions.dispirited,
    },
  },
  {
    id: 13,
    imageUrl: `${IMAGE_BASE_URL}/13.jpg`,
    options: ['decisive', 'anticipating', 'threatening', 'shy'],
    correctAnswer: 'anticipating',
  },
  {
    id: 14,
    imageUrl: `${IMAGE_BASE_URL}/14.jpg`,
    options: ['irritated', 'disappointed', 'depressed', 'accusing'],
    correctAnswer: 'accusing',
  },
  {
    id: 15,
    imageUrl: `${IMAGE_BASE_URL}/15.jpg`,
    options: ['contemplative', 'flustered', 'encouraging', 'amused'],
    correctAnswer: 'contemplative',
    definitions: {
      contemplative: vocabularyDefinitions.contemplative,
      flustered: vocabularyDefinitions.flustered,
    },
  },
  {
    id: 16,
    imageUrl: `${IMAGE_BASE_URL}/16.jpg`,
    options: ['irritated', 'thoughtful', 'encouraging', 'sympathetic'],
    correctAnswer: 'thoughtful',
  },
  {
    id: 17,
    imageUrl: `${IMAGE_BASE_URL}/17.jpg`,
    options: ['doubtful', 'affectionate', 'playful', 'aghast'],
    correctAnswer: 'doubtful',
    definitions: { aghast: vocabularyDefinitions.aghast },
  },
  {
    id: 18,
    imageUrl: `${IMAGE_BASE_URL}/18.jpg`,
    options: ['decisive', 'amused', 'aghast', 'bored'],
    correctAnswer: 'decisive',
    definitions: { aghast: vocabularyDefinitions.aghast },
  },
  {
    id: 19,
    imageUrl: `${IMAGE_BASE_URL}/19.jpg`,
    options: ['arrogant', 'grateful', 'sarcastic', 'tentative'],
    correctAnswer: 'tentative',
    definitions: {
      sarcastic: vocabularyDefinitions.sarcastic,
      tentative: vocabularyDefinitions.tentative,
    },
  },
  {
    id: 20,
    imageUrl: `${IMAGE_BASE_URL}/20.jpg`,
    options: ['dominant', 'friendly', 'guilty', 'horrified'],
    correctAnswer: 'friendly',
  },
  {
    id: 21,
    imageUrl: `${IMAGE_BASE_URL}/21.jpg`,
    options: ['embarrassed', 'fantasizing', 'confused', 'panicked'],
    correctAnswer: 'fantasizing',
    definitions: { fantasizing: vocabularyDefinitions.fantasizing },
  },
  {
    id: 22,
    imageUrl: `${IMAGE_BASE_URL}/22.jpg`,
    options: ['preoccupied', 'grateful', 'insisting', 'imploring'],
    correctAnswer: 'preoccupied',
    definitions: {
      preoccupied: vocabularyDefinitions.preoccupied,
      imploring: vocabularyDefinitions.imploring,
    },
  },
  {
    id: 23,
    imageUrl: `${IMAGE_BASE_URL}/23.jpg`,
    options: ['contented', 'apologetic', 'defiant', 'curious'],
    correctAnswer: 'defiant',
    definitions: { defiant: vocabularyDefinitions.defiant },
  },
  {
    id: 24,
    imageUrl: `${IMAGE_BASE_URL}/24.jpg`,
    options: ['pensive', 'irritated', 'excited', 'hostile'],
    correctAnswer: 'pensive',
    definitions: { pensive: vocabularyDefinitions.pensive },
  },
  {
    id: 25,
    imageUrl: `${IMAGE_BASE_URL}/25.jpg`,
    options: ['panicked', 'incredulous', 'despondent', 'interested'],
    correctAnswer: 'interested',
    definitions: {
      incredulous: vocabularyDefinitions.incredulous,
      despondent: vocabularyDefinitions.despondent,
    },
  },
  {
    id: 26,
    imageUrl: `${IMAGE_BASE_URL}/26.jpg`,
    options: ['alarmed', 'shy', 'hostile', 'anxious'],
    correctAnswer: 'hostile',
  },
  {
    id: 27,
    imageUrl: `${IMAGE_BASE_URL}/27.jpg`,
    options: ['joking', 'cautious', 'arrogant', 'reassuring'],
    correctAnswer: 'cautious',
  },
  {
    id: 28,
    imageUrl: `${IMAGE_BASE_URL}/28.jpg`,
    options: ['interested', 'joking', 'affectionate', 'contented'],
    correctAnswer: 'interested',
  },
  {
    id: 29,
    imageUrl: `${IMAGE_BASE_URL}/29.jpg`,
    options: ['impatient', 'aghast', 'irritated', 'reflective'],
    correctAnswer: 'reflective',
    definitions: {
      aghast: vocabularyDefinitions.aghast,
      reflective: vocabularyDefinitions.reflective,
    },
  },
  {
    id: 30,
    imageUrl: `${IMAGE_BASE_URL}/30.jpg`,
    options: ['grateful', 'flirtatious', 'hostile', 'disappointed'],
    correctAnswer: 'flirtatious',
  },
  {
    id: 31,
    imageUrl: `${IMAGE_BASE_URL}/31.jpg`,
    options: ['ashamed', 'confident', 'joking', 'dispirited'],
    correctAnswer: 'confident',
    definitions: { dispirited: vocabularyDefinitions.dispirited },
  },
  {
    id: 32,
    imageUrl: `${IMAGE_BASE_URL}/32.jpg`,
    options: ['serious', 'ashamed', 'bewildered', 'alarmed'],
    correctAnswer: 'serious',
  },
  {
    id: 33,
    imageUrl: `${IMAGE_BASE_URL}/33.jpg`,
    options: ['embarrassed', 'guilty', 'fantasizing', 'concerned'],
    correctAnswer: 'concerned',
    definitions: { fantasizing: vocabularyDefinitions.fantasizing },
  },
  {
    id: 34,
    imageUrl: `${IMAGE_BASE_URL}/34.jpg`,
    options: ['aghast', 'baffled', 'distrustful', 'terrified'],
    correctAnswer: 'distrustful',
    definitions: {
      aghast: vocabularyDefinitions.aghast,
      baffled: vocabularyDefinitions.baffled,
      distrustful: vocabularyDefinitions.distrustful,
    },
  },
  {
    id: 35,
    imageUrl: `${IMAGE_BASE_URL}/35.jpg`,
    options: ['puzzled', 'nervous', 'insisting', 'contemplative'],
    correctAnswer: 'nervous',
    definitions: { contemplative: vocabularyDefinitions.contemplative },
  },
  {
    id: 36,
    imageUrl: `${IMAGE_BASE_URL}/36.jpg`,
    options: ['ashamed', 'nervous', 'suspicious', 'indecisive'],
    correctAnswer: 'suspicious',
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

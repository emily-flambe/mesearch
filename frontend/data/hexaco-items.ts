// HEXACO-60 Personality Inventory Items
// Based on Lee, K., & Ashton, M.C. (2004, 2018)
// https://hexaco.org
//
// IMPORTANT: This implementation is for non-profit research/educational purposes only.
// The HEXACO-PI-R is copyrighted by K. Lee & M.C. Ashton.
// For commercial use, contact the authors at hexaco.org.

export type HexacoDimension =
  | 'Honesty-Humility'
  | 'Emotionality'
  | 'Extraversion'
  | 'Agreeableness'
  | 'Conscientiousness'
  | 'Openness';

export type HexacoFacet =
  // Honesty-Humility
  | 'Sincerity'
  | 'Fairness'
  | 'Greed-Avoidance'
  | 'Modesty'
  // Emotionality
  | 'Fearfulness'
  | 'Anxiety'
  | 'Dependence'
  | 'Sentimentality'
  // Extraversion
  | 'Social Self-Esteem'
  | 'Social Boldness'
  | 'Sociability'
  | 'Liveliness'
  // Agreeableness
  | 'Forgiveness'
  | 'Gentleness'
  | 'Flexibility'
  | 'Patience'
  // Conscientiousness
  | 'Organization'
  | 'Diligence'
  | 'Perfectionism'
  | 'Prudence'
  // Openness
  | 'Aesthetic Appreciation'
  | 'Inquisitiveness'
  | 'Creativity'
  | 'Unconventionality';

export interface HexacoItem {
  id: number;
  text: string;
  dimension: HexacoDimension;
  facet: HexacoFacet;
  isReversed: boolean;
}

// HEXACO-60 items following the official item order
// Items cycle through dimensions: O, C, A, X, E, H (1-6), then repeat
export const hexacoItems: HexacoItem[] = [
  // Items 1-6
  {
    id: 1,
    text: 'I would be quite bored by a visit to an art gallery.',
    dimension: 'Openness',
    facet: 'Aesthetic Appreciation',
    isReversed: true,
  },
  {
    id: 2,
    text: 'I plan ahead and organize things, to avoid scrambling at the last minute.',
    dimension: 'Conscientiousness',
    facet: 'Organization',
    isReversed: false,
  },
  {
    id: 3,
    text: 'I rarely hold a grudge, even against people who have badly wronged me.',
    dimension: 'Agreeableness',
    facet: 'Forgiveness',
    isReversed: false,
  },
  {
    id: 4,
    text: 'I feel reasonably satisfied with myself overall.',
    dimension: 'Extraversion',
    facet: 'Social Self-Esteem',
    isReversed: false,
  },
  {
    id: 5,
    text: 'I would feel afraid if I had to travel in bad weather conditions.',
    dimension: 'Emotionality',
    facet: 'Fearfulness',
    isReversed: false,
  },
  {
    id: 6,
    text: "I wouldn't use flattery to get a raise or promotion at work, even if I thought it would succeed.",
    dimension: 'Honesty-Humility',
    facet: 'Sincerity',
    isReversed: false,
  },
  // Items 7-12
  {
    id: 7,
    text: "I'm interested in learning about the history and politics of other countries.",
    dimension: 'Openness',
    facet: 'Inquisitiveness',
    isReversed: false,
  },
  {
    id: 8,
    text: 'I often push myself very hard when trying to achieve a goal.',
    dimension: 'Conscientiousness',
    facet: 'Diligence',
    isReversed: false,
  },
  {
    id: 9,
    text: 'People sometimes tell me that I am too critical of others.',
    dimension: 'Agreeableness',
    facet: 'Gentleness',
    isReversed: true,
  },
  {
    id: 10,
    text: 'I rarely express my opinions in group meetings.',
    dimension: 'Extraversion',
    facet: 'Social Boldness',
    isReversed: true,
  },
  {
    id: 11,
    text: "I sometimes can't help worrying about little things.",
    dimension: 'Emotionality',
    facet: 'Anxiety',
    isReversed: false,
  },
  {
    id: 12,
    text: 'If I knew that I could never get caught, I would be willing to steal a million dollars.',
    dimension: 'Honesty-Humility',
    facet: 'Fairness',
    isReversed: true,
  },
  // Items 13-18
  {
    id: 13,
    text: 'I would enjoy creating a work of art, such as a novel, a song, or a painting.',
    dimension: 'Openness',
    facet: 'Creativity',
    isReversed: false,
  },
  {
    id: 14,
    text: 'When working on something, I don\'t pay much attention to small details.',
    dimension: 'Conscientiousness',
    facet: 'Perfectionism',
    isReversed: true,
  },
  {
    id: 15,
    text: 'People sometimes tell me that I\'m too stubborn.',
    dimension: 'Agreeableness',
    facet: 'Flexibility',
    isReversed: true,
  },
  {
    id: 16,
    text: 'I prefer jobs that involve active social interaction to those that involve working alone.',
    dimension: 'Extraversion',
    facet: 'Sociability',
    isReversed: false,
  },
  {
    id: 17,
    text: 'When I suffer from a painful experience, I need someone to make me feel comfortable.',
    dimension: 'Emotionality',
    facet: 'Dependence',
    isReversed: false,
  },
  {
    id: 18,
    text: 'Having a lot of money is not especially important to me.',
    dimension: 'Honesty-Humility',
    facet: 'Greed-Avoidance',
    isReversed: false,
  },
  // Items 19-24
  {
    id: 19,
    text: 'I think that paying attention to radical ideas is a waste of time.',
    dimension: 'Openness',
    facet: 'Unconventionality',
    isReversed: true,
  },
  {
    id: 20,
    text: 'I make decisions based on the feeling of the moment rather than on careful thought.',
    dimension: 'Conscientiousness',
    facet: 'Prudence',
    isReversed: true,
  },
  {
    id: 21,
    text: 'People think of me as someone who has a quick temper.',
    dimension: 'Agreeableness',
    facet: 'Patience',
    isReversed: true,
  },
  {
    id: 22,
    text: 'On most days, I feel cheerful and optimistic.',
    dimension: 'Extraversion',
    facet: 'Liveliness',
    isReversed: false,
  },
  {
    id: 23,
    text: 'I feel like crying when I see other people crying.',
    dimension: 'Emotionality',
    facet: 'Sentimentality',
    isReversed: false,
  },
  {
    id: 24,
    text: 'I think that I am entitled to more respect than the average person is.',
    dimension: 'Honesty-Humility',
    facet: 'Modesty',
    isReversed: true,
  },
  // Items 25-30
  {
    id: 25,
    text: 'If I had the opportunity, I would like to attend a classical music concert.',
    dimension: 'Openness',
    facet: 'Aesthetic Appreciation',
    isReversed: false,
  },
  {
    id: 26,
    text: 'When working, I sometimes have difficulties due to being disorganized.',
    dimension: 'Conscientiousness',
    facet: 'Organization',
    isReversed: true,
  },
  {
    id: 27,
    text: 'My attitude toward people who have treated me badly is "forgive and forget".',
    dimension: 'Agreeableness',
    facet: 'Forgiveness',
    isReversed: false,
  },
  {
    id: 28,
    text: 'I feel that I am an unpopular person.',
    dimension: 'Extraversion',
    facet: 'Social Self-Esteem',
    isReversed: true,
  },
  {
    id: 29,
    text: 'When it comes to physical danger, I am very fearful.',
    dimension: 'Emotionality',
    facet: 'Fearfulness',
    isReversed: false,
  },
  {
    id: 30,
    text: 'If I want something from someone, I will laugh at that person\'s worst jokes.',
    dimension: 'Honesty-Humility',
    facet: 'Sincerity',
    isReversed: true,
  },
  // Items 31-36
  {
    id: 31,
    text: 'I\'ve never really enjoyed looking through an encyclopedia.',
    dimension: 'Openness',
    facet: 'Inquisitiveness',
    isReversed: true,
  },
  {
    id: 32,
    text: 'I do only the minimum amount of work needed to get by.',
    dimension: 'Conscientiousness',
    facet: 'Diligence',
    isReversed: true,
  },
  {
    id: 33,
    text: 'I tend to be lenient in judging other people.',
    dimension: 'Agreeableness',
    facet: 'Gentleness',
    isReversed: false,
  },
  {
    id: 34,
    text: 'In social situations, I\'m usually the one who makes the first move.',
    dimension: 'Extraversion',
    facet: 'Social Boldness',
    isReversed: false,
  },
  {
    id: 35,
    text: 'I worry a lot less than most people do.',
    dimension: 'Emotionality',
    facet: 'Anxiety',
    isReversed: true,
  },
  {
    id: 36,
    text: 'I would never accept a bribe, even if it were very large.',
    dimension: 'Honesty-Humility',
    facet: 'Fairness',
    isReversed: false,
  },
  // Items 37-42
  {
    id: 37,
    text: 'People have often told me that I have a good imagination.',
    dimension: 'Openness',
    facet: 'Creativity',
    isReversed: false,
  },
  {
    id: 38,
    text: 'I always try to be accurate in my work, even at the expense of time.',
    dimension: 'Conscientiousness',
    facet: 'Perfectionism',
    isReversed: false,
  },
  {
    id: 39,
    text: 'I am usually quite flexible in my opinions when people disagree with me.',
    dimension: 'Agreeableness',
    facet: 'Flexibility',
    isReversed: false,
  },
  {
    id: 40,
    text: 'The first thing that I always do in a new place is to make friends.',
    dimension: 'Extraversion',
    facet: 'Sociability',
    isReversed: false,
  },
  {
    id: 41,
    text: 'I can handle difficult situations without needing emotional support from anyone else.',
    dimension: 'Emotionality',
    facet: 'Dependence',
    isReversed: true,
  },
  {
    id: 42,
    text: 'I would get a lot of pleasure from owning expensive luxury goods.',
    dimension: 'Honesty-Humility',
    facet: 'Greed-Avoidance',
    isReversed: true,
  },
  // Items 43-48
  {
    id: 43,
    text: 'I like people who have unconventional views.',
    dimension: 'Openness',
    facet: 'Unconventionality',
    isReversed: false,
  },
  {
    id: 44,
    text: 'I make a lot of mistakes because I don\'t think before I act.',
    dimension: 'Conscientiousness',
    facet: 'Prudence',
    isReversed: true,
  },
  {
    id: 45,
    text: 'Most people tend to get angry more quickly than I do.',
    dimension: 'Agreeableness',
    facet: 'Patience',
    isReversed: false,
  },
  {
    id: 46,
    text: 'Most people are more upbeat and dynamic than I generally am.',
    dimension: 'Extraversion',
    facet: 'Liveliness',
    isReversed: true,
  },
  {
    id: 47,
    text: 'I feel strong emotions when someone close to me is going away for a long time.',
    dimension: 'Emotionality',
    facet: 'Sentimentality',
    isReversed: false,
  },
  {
    id: 48,
    text: 'I want people to know that I am an important person of high status.',
    dimension: 'Honesty-Humility',
    facet: 'Modesty',
    isReversed: true,
  },
  // Items 49-54
  {
    id: 49,
    text: 'I don\'t think of myself as the artistic or creative type.',
    dimension: 'Openness',
    facet: 'Aesthetic Appreciation',
    isReversed: true,
  },
  {
    id: 50,
    text: 'People often call me a perfectionist.',
    dimension: 'Conscientiousness',
    facet: 'Organization',
    isReversed: false,
  },
  {
    id: 51,
    text: 'Even when people make a lot of mistakes, I rarely say anything negative.',
    dimension: 'Agreeableness',
    facet: 'Gentleness',
    isReversed: false,
  },
  {
    id: 52,
    text: 'I sometimes feel that I am a worthless person.',
    dimension: 'Extraversion',
    facet: 'Social Self-Esteem',
    isReversed: true,
  },
  {
    id: 53,
    text: 'Even in an emergency I wouldn\'t feel like panicking.',
    dimension: 'Emotionality',
    facet: 'Fearfulness',
    isReversed: true,
  },
  {
    id: 54,
    text: 'I wouldn\'t pretend to like someone just to get that person to do favors for me.',
    dimension: 'Honesty-Humility',
    facet: 'Sincerity',
    isReversed: false,
  },
  // Items 55-60
  {
    id: 55,
    text: 'I find it boring to discuss philosophy.',
    dimension: 'Openness',
    facet: 'Inquisitiveness',
    isReversed: true,
  },
  {
    id: 56,
    text: 'I prefer to do whatever comes to mind, rather than stick to a plan.',
    dimension: 'Conscientiousness',
    facet: 'Diligence',
    isReversed: true,
  },
  {
    id: 57,
    text: 'When people tell me that I\'m wrong, my first reaction is to argue with them.',
    dimension: 'Agreeableness',
    facet: 'Flexibility',
    isReversed: true,
  },
  {
    id: 58,
    text: 'When I\'m in a group of people, I\'m often the one who speaks on behalf of the group.',
    dimension: 'Extraversion',
    facet: 'Social Boldness',
    isReversed: false,
  },
  {
    id: 59,
    text: 'I remain unemotional even in situations where most people get very sentimental.',
    dimension: 'Emotionality',
    facet: 'Sentimentality',
    isReversed: true,
  },
  {
    id: 60,
    text: 'I\'d be tempted to use counterfeit money, if I were sure I could get away with it.',
    dimension: 'Honesty-Humility',
    facet: 'Fairness',
    isReversed: true,
  },
];

// Dimension descriptions for results display
export const dimensionDescriptions: Record<HexacoDimension, {
  name: string;
  description: string;
  highDescription: string;
  lowDescription: string;
  facets: HexacoFacet[];
}> = {
  'Honesty-Humility': {
    name: 'Honesty-Humility',
    description: 'The tendency to be fair and genuine in dealing with others, to avoid manipulation, and to be uninterested in lavish wealth or high social status. This dimension is unique to HEXACO and distinguishes it from the Big Five model.',
    highDescription: 'You tend to be sincere, fair-minded, and uninterested in manipulating others for personal gain. You likely avoid wealth and status symbols and value genuine, straightforward interactions.',
    lowDescription: 'You may be more comfortable with flattery or manipulation to get what you want. Status symbols and material wealth may be more important to you, and you might feel entitled to special treatment.',
    facets: ['Sincerity', 'Fairness', 'Greed-Avoidance', 'Modesty'],
  },
  'Emotionality': {
    name: 'Emotionality',
    description: 'The tendency to experience fear, anxiety, and need for emotional support from others, as well as empathetic sensitivity toward others.',
    highDescription: 'You tend to experience strong emotions, may worry more, and seek emotional support during difficult times. You likely feel strong empathy and emotional bonds with others.',
    lowDescription: 'You tend to be emotionally resilient and rarely feel anxious or fearful. You may handle stress independently and might not be as affected by others\' emotional states.',
    facets: ['Fearfulness', 'Anxiety', 'Dependence', 'Sentimentality'],
  },
  'Extraversion': {
    name: 'Extraversion',
    description: 'The tendency to feel positive about oneself, confident in social situations, enthusiastic, and energetic.',
    highDescription: 'You tend to feel confident and comfortable in social situations. You likely enjoy interacting with others, feel positive about yourself, and bring energy and enthusiasm to activities.',
    lowDescription: 'You may prefer solitary activities and feel less comfortable being the center of attention. You might be more reserved in social situations and take a quieter approach to life.',
    facets: ['Social Self-Esteem', 'Social Boldness', 'Sociability', 'Liveliness'],
  },
  'Agreeableness': {
    name: 'Agreeableness',
    description: 'The tendency to forgive wrongs, be lenient in judging others, be willing to compromise, and control one\'s temper.',
    highDescription: 'You tend to be forgiving, patient, and willing to compromise. You likely avoid conflict, give others the benefit of the doubt, and maintain your composure even in frustrating situations.',
    lowDescription: 'You may hold grudges, be more critical of others, and have a quicker temper. You might be less willing to compromise and more likely to speak your mind about others\' faults.',
    facets: ['Forgiveness', 'Gentleness', 'Flexibility', 'Patience'],
  },
  'Conscientiousness': {
    name: 'Conscientiousness',
    description: 'The tendency to organize time and surroundings, work in a disciplined way, strive for accuracy, and deliberate carefully before acting.',
    highDescription: 'You tend to be organized, hardworking, and detail-oriented. You likely plan ahead, think carefully before acting, and maintain high standards in your work.',
    lowDescription: 'You may prefer spontaneity over planning and be less concerned with organization or precision. You might make decisions based on intuition rather than careful deliberation.',
    facets: ['Organization', 'Diligence', 'Perfectionism', 'Prudence'],
  },
  'Openness': {
    name: 'Openness to Experience',
    description: 'The tendency to be interested in art and nature, curious about various areas of knowledge, creative, and receptive to unconventional ideas.',
    highDescription: 'You tend to appreciate art and beauty, enjoy exploring new ideas, and value creativity. You likely have diverse interests and are open to unconventional perspectives.',
    lowDescription: 'You may prefer practical matters over abstract ideas and have more conventional tastes. You might be less interested in artistic pursuits or philosophical discussions.',
    facets: ['Aesthetic Appreciation', 'Inquisitiveness', 'Creativity', 'Unconventionality'],
  },
};

// Facet descriptions
export const facetDescriptions: Record<HexacoFacet, string> = {
  // Honesty-Humility
  'Sincerity': 'The tendency to be genuine in social relations, avoiding flattery or pretense.',
  'Fairness': 'The tendency to avoid fraud and corruption, even when there is no risk of detection.',
  'Greed-Avoidance': 'The tendency to be uninterested in possessing lavish wealth and luxury goods.',
  'Modesty': 'The tendency to be modest and unassuming, not seeking special treatment.',
  // Emotionality
  'Fearfulness': 'The tendency to experience fear in response to physical dangers.',
  'Anxiety': 'The tendency to worry even in relatively minor situations.',
  'Dependence': 'The tendency to need emotional support from others.',
  'Sentimentality': 'The tendency to feel strong emotional bonds with others.',
  // Extraversion
  'Social Self-Esteem': 'The tendency to have positive self-regard, especially in social contexts.',
  'Social Boldness': 'The tendency to feel comfortable and confident in social situations.',
  'Sociability': 'The tendency to enjoy conversation and social interaction.',
  'Liveliness': 'The tendency to feel enthusiastic, energetic, and optimistic.',
  // Agreeableness
  'Forgiveness': 'The tendency to feel trust and liking toward those who may have caused harm.',
  'Gentleness': 'The tendency to be mild and lenient in dealings with others.',
  'Flexibility': 'The tendency to be willing to compromise and cooperate with others.',
  'Patience': 'The tendency to remain calm rather than become angry.',
  // Conscientiousness
  'Organization': 'The tendency to seek order and structure in one\'s surroundings.',
  'Diligence': 'The tendency to work hard and to be committed to one\'s work.',
  'Perfectionism': 'The tendency to be thorough and to strive for accuracy in one\'s work.',
  'Prudence': 'The tendency to deliberate carefully and to avoid impulsive decisions.',
  // Openness
  'Aesthetic Appreciation': 'The tendency to appreciate art and beauty in nature.',
  'Inquisitiveness': 'The tendency to seek knowledge and information about many topics.',
  'Creativity': 'The tendency to prefer novelty and innovation.',
  'Unconventionality': 'The tendency to accept the unusual and to question authority.',
};

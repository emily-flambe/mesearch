// IPIP-NEO-120 Big Five Personality Test Items
// Source: https://ipip.ori.org/newBigFive.htm
// These items are in the public domain

export type Dimension = 'O' | 'C' | 'E' | 'A' | 'N';

export type Facet =
  // Openness facets
  | 'O1_Imagination'
  | 'O2_ArtisticInterests'
  | 'O3_Emotionality'
  | 'O4_Adventurousness'
  | 'O5_Intellect'
  | 'O6_Liberalism'
  // Conscientiousness facets
  | 'C1_SelfEfficacy'
  | 'C2_Orderliness'
  | 'C3_Dutifulness'
  | 'C4_AchievementStriving'
  | 'C5_SelfDiscipline'
  | 'C6_Cautiousness'
  // Extraversion facets
  | 'E1_Friendliness'
  | 'E2_Gregariousness'
  | 'E3_Assertiveness'
  | 'E4_ActivityLevel'
  | 'E5_ExcitementSeeking'
  | 'E6_Cheerfulness'
  // Agreeableness facets
  | 'A1_Trust'
  | 'A2_Morality'
  | 'A3_Altruism'
  | 'A4_Cooperation'
  | 'A5_Modesty'
  | 'A6_Sympathy'
  // Neuroticism facets
  | 'N1_Anxiety'
  | 'N2_Anger'
  | 'N3_Depression'
  | 'N4_SelfConsciousness'
  | 'N5_Immoderation'
  | 'N6_Vulnerability';

export interface Item {
  id: number;
  text: string;
  dimension: Dimension;
  facet: Facet;
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

export interface FacetInfo {
  code: Facet;
  name: string;
  dimension: Dimension;
  description: string;
}

export const dimensionInfo: Record<Dimension, DimensionInfo> = {
  O: {
    code: 'O',
    name: 'Openness to Experience',
    description: 'Openness reflects imagination, creativity, and a preference for novelty and variety.',
    lowDescription: 'You tend to prefer familiar routines, practical thinking, and conventional approaches.',
    highDescription: 'You tend to be imaginative, curious, and open to new experiences and ideas.',
    color: '#14b8a6', // teal
  },
  C: {
    code: 'C',
    name: 'Conscientiousness',
    description: 'Conscientiousness reflects self-discipline, organization, and goal-directed behavior.',
    lowDescription: 'You tend to be flexible, spontaneous, and prefer to go with the flow.',
    highDescription: 'You tend to be organized, dependable, and driven to achieve your goals.',
    color: '#3b82f6', // blue
  },
  E: {
    code: 'E',
    name: 'Extraversion',
    description: 'Extraversion reflects sociability, assertiveness, and positive emotionality.',
    lowDescription: 'You tend to be reserved, prefer solitude, and find social situations draining.',
    highDescription: 'You tend to be outgoing, energetic, and thrive in social situations.',
    color: '#f97316', // orange
  },
  A: {
    code: 'A',
    name: 'Agreeableness',
    description: 'Agreeableness reflects cooperation, trust, and concern for social harmony.',
    lowDescription: 'You tend to be competitive, skeptical, and prioritize your own interests.',
    highDescription: 'You tend to be cooperative, trusting, and concerned with others\' wellbeing.',
    color: '#22c55e', // green
  },
  N: {
    code: 'N',
    name: 'Neuroticism',
    description: 'Neuroticism reflects emotional instability and tendency to experience negative emotions.',
    lowDescription: 'You tend to be emotionally stable, calm, and resilient to stress.',
    highDescription: 'You tend to experience more emotional ups and downs and sensitivity to stress.',
    color: '#a855f7', // purple
  },
};

export const facetInfo: Record<Facet, FacetInfo> = {
  // Openness facets
  O1_Imagination: {
    code: 'O1_Imagination',
    name: 'Imagination',
    dimension: 'O',
    description: 'The tendency to have a vivid imagination and fantasy life.',
  },
  O2_ArtisticInterests: {
    code: 'O2_ArtisticInterests',
    name: 'Artistic Interests',
    dimension: 'O',
    description: 'Appreciation for art, beauty, and aesthetic experiences.',
  },
  O3_Emotionality: {
    code: 'O3_Emotionality',
    name: 'Emotionality',
    dimension: 'O',
    description: 'Awareness and receptivity to inner feelings and emotions.',
  },
  O4_Adventurousness: {
    code: 'O4_Adventurousness',
    name: 'Adventurousness',
    dimension: 'O',
    description: 'Willingness to try new activities and experiences.',
  },
  O5_Intellect: {
    code: 'O5_Intellect',
    name: 'Intellect',
    dimension: 'O',
    description: 'Interest in ideas, intellectual curiosity, and abstract thinking.',
  },
  O6_Liberalism: {
    code: 'O6_Liberalism',
    name: 'Liberalism',
    dimension: 'O',
    description: 'Openness to reexamining values and challenge authority.',
  },
  // Conscientiousness facets
  C1_SelfEfficacy: {
    code: 'C1_SelfEfficacy',
    name: 'Self-Efficacy',
    dimension: 'C',
    description: 'Confidence in one\'s ability to accomplish things.',
  },
  C2_Orderliness: {
    code: 'C2_Orderliness',
    name: 'Orderliness',
    dimension: 'C',
    description: 'Preference for organization, neatness, and structure.',
  },
  C3_Dutifulness: {
    code: 'C3_Dutifulness',
    name: 'Dutifulness',
    dimension: 'C',
    description: 'Strong sense of duty and moral obligation.',
  },
  C4_AchievementStriving: {
    code: 'C4_AchievementStriving',
    name: 'Achievement-Striving',
    dimension: 'C',
    description: 'Ambition and drive to excel and accomplish goals.',
  },
  C5_SelfDiscipline: {
    code: 'C5_SelfDiscipline',
    name: 'Self-Discipline',
    dimension: 'C',
    description: 'Ability to persist and complete tasks despite distractions.',
  },
  C6_Cautiousness: {
    code: 'C6_Cautiousness',
    name: 'Cautiousness',
    dimension: 'C',
    description: 'Tendency to think carefully before acting.',
  },
  // Extraversion facets
  E1_Friendliness: {
    code: 'E1_Friendliness',
    name: 'Friendliness',
    dimension: 'E',
    description: 'Warmth and genuine liking for other people.',
  },
  E2_Gregariousness: {
    code: 'E2_Gregariousness',
    name: 'Gregariousness',
    dimension: 'E',
    description: 'Preference for the company of others.',
  },
  E3_Assertiveness: {
    code: 'E3_Assertiveness',
    name: 'Assertiveness',
    dimension: 'E',
    description: 'Tendency to take charge and direct others.',
  },
  E4_ActivityLevel: {
    code: 'E4_ActivityLevel',
    name: 'Activity Level',
    dimension: 'E',
    description: 'Preference for a fast-paced, busy lifestyle.',
  },
  E5_ExcitementSeeking: {
    code: 'E5_ExcitementSeeking',
    name: 'Excitement-Seeking',
    dimension: 'E',
    description: 'Need for environmental stimulation and thrills.',
  },
  E6_Cheerfulness: {
    code: 'E6_Cheerfulness',
    name: 'Cheerfulness',
    dimension: 'E',
    description: 'Tendency to experience positive emotions.',
  },
  // Agreeableness facets
  A1_Trust: {
    code: 'A1_Trust',
    name: 'Trust',
    dimension: 'A',
    description: 'Belief in the honesty and good intentions of others.',
  },
  A2_Morality: {
    code: 'A2_Morality',
    name: 'Morality',
    dimension: 'A',
    description: 'Sincerity and unwillingness to manipulate others.',
  },
  A3_Altruism: {
    code: 'A3_Altruism',
    name: 'Altruism',
    dimension: 'A',
    description: 'Active concern for the welfare of others.',
  },
  A4_Cooperation: {
    code: 'A4_Cooperation',
    name: 'Cooperation',
    dimension: 'A',
    description: 'Preference for harmony and dislike of conflict.',
  },
  A5_Modesty: {
    code: 'A5_Modesty',
    name: 'Modesty',
    dimension: 'A',
    description: 'Humility and reluctance to claim superiority.',
  },
  A6_Sympathy: {
    code: 'A6_Sympathy',
    name: 'Sympathy',
    dimension: 'A',
    description: 'Compassion and concern for others\' suffering.',
  },
  // Neuroticism facets
  N1_Anxiety: {
    code: 'N1_Anxiety',
    name: 'Anxiety',
    dimension: 'N',
    description: 'Tendency to experience fear, worry, and nervousness.',
  },
  N2_Anger: {
    code: 'N2_Anger',
    name: 'Anger',
    dimension: 'N',
    description: 'Tendency to experience frustration and irritability.',
  },
  N3_Depression: {
    code: 'N3_Depression',
    name: 'Depression',
    dimension: 'N',
    description: 'Tendency to experience sadness and hopelessness.',
  },
  N4_SelfConsciousness: {
    code: 'N4_SelfConsciousness',
    name: 'Self-Consciousness',
    dimension: 'N',
    description: 'Sensitivity to what others think and social anxiety.',
  },
  N5_Immoderation: {
    code: 'N5_Immoderation',
    name: 'Immoderation',
    dimension: 'N',
    description: 'Difficulty resisting temptation and controlling urges.',
  },
  N6_Vulnerability: {
    code: 'N6_Vulnerability',
    name: 'Vulnerability',
    dimension: 'N',
    description: 'Difficulty coping with stress and pressure.',
  },
};

// 120 IPIP-NEO items (24 per dimension, 4 per facet)
// Source: https://ipip.ori.org/newBigFive.htm
export const items: Item[] = [
  // === NEUROTICISM (N) ===
  // N1: Anxiety
  { id: 1, text: 'I worry about things.', dimension: 'N', facet: 'N1_Anxiety', isReversed: false },
  { id: 2, text: 'I fear for the worst.', dimension: 'N', facet: 'N1_Anxiety', isReversed: false },
  { id: 3, text: 'I am afraid of many things.', dimension: 'N', facet: 'N1_Anxiety', isReversed: false },
  { id: 4, text: 'I get stressed out easily.', dimension: 'N', facet: 'N1_Anxiety', isReversed: false },
  // N2: Anger
  { id: 5, text: 'I get angry easily.', dimension: 'N', facet: 'N2_Anger', isReversed: false },
  { id: 6, text: 'I get irritated easily.', dimension: 'N', facet: 'N2_Anger', isReversed: false },
  { id: 7, text: 'I lose my temper.', dimension: 'N', facet: 'N2_Anger', isReversed: false },
  { id: 8, text: 'I am not easily annoyed.', dimension: 'N', facet: 'N2_Anger', isReversed: true },
  // N3: Depression
  { id: 9, text: 'I often feel blue.', dimension: 'N', facet: 'N3_Depression', isReversed: false },
  { id: 10, text: 'I dislike myself.', dimension: 'N', facet: 'N3_Depression', isReversed: false },
  { id: 11, text: 'I am often down in the dumps.', dimension: 'N', facet: 'N3_Depression', isReversed: false },
  { id: 12, text: 'I feel comfortable with myself.', dimension: 'N', facet: 'N3_Depression', isReversed: true },
  // N4: Self-Consciousness
  { id: 13, text: 'I find it difficult to approach others.', dimension: 'N', facet: 'N4_SelfConsciousness', isReversed: false },
  { id: 14, text: 'I am afraid to draw attention to myself.', dimension: 'N', facet: 'N4_SelfConsciousness', isReversed: false },
  { id: 15, text: 'I am easily embarrassed.', dimension: 'N', facet: 'N4_SelfConsciousness', isReversed: false },
  { id: 16, text: 'I am not embarrassed easily.', dimension: 'N', facet: 'N4_SelfConsciousness', isReversed: true },
  // N5: Immoderation
  { id: 17, text: 'I often eat too much.', dimension: 'N', facet: 'N5_Immoderation', isReversed: false },
  { id: 18, text: 'I go on binges.', dimension: 'N', facet: 'N5_Immoderation', isReversed: false },
  { id: 19, text: 'I rarely overindulge.', dimension: 'N', facet: 'N5_Immoderation', isReversed: true },
  { id: 20, text: 'I easily resist temptations.', dimension: 'N', facet: 'N5_Immoderation', isReversed: true },
  // N6: Vulnerability
  { id: 21, text: 'I panic easily.', dimension: 'N', facet: 'N6_Vulnerability', isReversed: false },
  { id: 22, text: 'I become overwhelmed by events.', dimension: 'N', facet: 'N6_Vulnerability', isReversed: false },
  { id: 23, text: 'I feel that I\'m unable to deal with things.', dimension: 'N', facet: 'N6_Vulnerability', isReversed: false },
  { id: 24, text: 'I remain calm under pressure.', dimension: 'N', facet: 'N6_Vulnerability', isReversed: true },

  // === EXTRAVERSION (E) ===
  // E1: Friendliness
  { id: 25, text: 'I make friends easily.', dimension: 'E', facet: 'E1_Friendliness', isReversed: false },
  { id: 26, text: 'I warm up quickly to others.', dimension: 'E', facet: 'E1_Friendliness', isReversed: false },
  { id: 27, text: 'I feel comfortable around people.', dimension: 'E', facet: 'E1_Friendliness', isReversed: false },
  { id: 28, text: 'I am hard to get to know.', dimension: 'E', facet: 'E1_Friendliness', isReversed: true },
  // E2: Gregariousness
  { id: 29, text: 'I love large parties.', dimension: 'E', facet: 'E2_Gregariousness', isReversed: false },
  { id: 30, text: 'I talk to a lot of different people at parties.', dimension: 'E', facet: 'E2_Gregariousness', isReversed: false },
  { id: 31, text: 'I prefer to be alone.', dimension: 'E', facet: 'E2_Gregariousness', isReversed: true },
  { id: 32, text: 'I avoid crowds.', dimension: 'E', facet: 'E2_Gregariousness', isReversed: true },
  // E3: Assertiveness
  { id: 33, text: 'I take charge.', dimension: 'E', facet: 'E3_Assertiveness', isReversed: false },
  { id: 34, text: 'I try to lead others.', dimension: 'E', facet: 'E3_Assertiveness', isReversed: false },
  { id: 35, text: 'I can talk others into doing things.', dimension: 'E', facet: 'E3_Assertiveness', isReversed: false },
  { id: 36, text: 'I wait for others to lead the way.', dimension: 'E', facet: 'E3_Assertiveness', isReversed: true },
  // E4: Activity Level
  { id: 37, text: 'I am always busy.', dimension: 'E', facet: 'E4_ActivityLevel', isReversed: false },
  { id: 38, text: 'I am always on the go.', dimension: 'E', facet: 'E4_ActivityLevel', isReversed: false },
  { id: 39, text: 'I do a lot in my spare time.', dimension: 'E', facet: 'E4_ActivityLevel', isReversed: false },
  { id: 40, text: 'I like to take it easy.', dimension: 'E', facet: 'E4_ActivityLevel', isReversed: true },
  // E5: Excitement-Seeking
  { id: 41, text: 'I love excitement.', dimension: 'E', facet: 'E5_ExcitementSeeking', isReversed: false },
  { id: 42, text: 'I seek adventure.', dimension: 'E', facet: 'E5_ExcitementSeeking', isReversed: false },
  { id: 43, text: 'I love action.', dimension: 'E', facet: 'E5_ExcitementSeeking', isReversed: false },
  { id: 44, text: 'I dislike loud music.', dimension: 'E', facet: 'E5_ExcitementSeeking', isReversed: true },
  // E6: Cheerfulness
  { id: 45, text: 'I radiate joy.', dimension: 'E', facet: 'E6_Cheerfulness', isReversed: false },
  { id: 46, text: 'I have a lot of fun.', dimension: 'E', facet: 'E6_Cheerfulness', isReversed: false },
  { id: 47, text: 'I love life.', dimension: 'E', facet: 'E6_Cheerfulness', isReversed: false },
  { id: 48, text: 'I look at the bright side of life.', dimension: 'E', facet: 'E6_Cheerfulness', isReversed: false },

  // === OPENNESS TO EXPERIENCE (O) ===
  // O1: Imagination
  { id: 49, text: 'I have a vivid imagination.', dimension: 'O', facet: 'O1_Imagination', isReversed: false },
  { id: 50, text: 'I enjoy wild flights of fantasy.', dimension: 'O', facet: 'O1_Imagination', isReversed: false },
  { id: 51, text: 'I love to daydream.', dimension: 'O', facet: 'O1_Imagination', isReversed: false },
  { id: 52, text: 'I do not have a good imagination.', dimension: 'O', facet: 'O1_Imagination', isReversed: true },
  // O2: Artistic Interests
  { id: 53, text: 'I believe in the importance of art.', dimension: 'O', facet: 'O2_ArtisticInterests', isReversed: false },
  { id: 54, text: 'I like music.', dimension: 'O', facet: 'O2_ArtisticInterests', isReversed: false },
  { id: 55, text: 'I see beauty in things that others might not notice.', dimension: 'O', facet: 'O2_ArtisticInterests', isReversed: false },
  { id: 56, text: 'I do not like art.', dimension: 'O', facet: 'O2_ArtisticInterests', isReversed: true },
  // O3: Emotionality
  { id: 57, text: 'I experience my emotions intensely.', dimension: 'O', facet: 'O3_Emotionality', isReversed: false },
  { id: 58, text: 'I feel others\' emotions.', dimension: 'O', facet: 'O3_Emotionality', isReversed: false },
  { id: 59, text: 'I am passionate about causes.', dimension: 'O', facet: 'O3_Emotionality', isReversed: false },
  { id: 60, text: 'I rarely notice my emotional reactions.', dimension: 'O', facet: 'O3_Emotionality', isReversed: true },
  // O4: Adventurousness
  { id: 61, text: 'I prefer variety to routine.', dimension: 'O', facet: 'O4_Adventurousness', isReversed: false },
  { id: 62, text: 'I like to visit new places.', dimension: 'O', facet: 'O4_Adventurousness', isReversed: false },
  { id: 63, text: 'I am interested in many things.', dimension: 'O', facet: 'O4_Adventurousness', isReversed: false },
  { id: 64, text: 'I prefer to stick with things that I know.', dimension: 'O', facet: 'O4_Adventurousness', isReversed: true },
  // O5: Intellect
  { id: 65, text: 'I love to read challenging material.', dimension: 'O', facet: 'O5_Intellect', isReversed: false },
  { id: 66, text: 'I avoid philosophical discussions.', dimension: 'O', facet: 'O5_Intellect', isReversed: true },
  { id: 67, text: 'I have difficulty understanding abstract ideas.', dimension: 'O', facet: 'O5_Intellect', isReversed: true },
  { id: 68, text: 'I am not interested in abstract ideas.', dimension: 'O', facet: 'O5_Intellect', isReversed: true },
  // O6: Liberalism
  { id: 69, text: 'I tend to vote for liberal political candidates.', dimension: 'O', facet: 'O6_Liberalism', isReversed: false },
  { id: 70, text: 'I believe that there is no absolute right or wrong.', dimension: 'O', facet: 'O6_Liberalism', isReversed: false },
  { id: 71, text: 'I tend to vote for conservative political candidates.', dimension: 'O', facet: 'O6_Liberalism', isReversed: true },
  { id: 72, text: 'I believe that we should be tough on crime.', dimension: 'O', facet: 'O6_Liberalism', isReversed: true },

  // === AGREEABLENESS (A) ===
  // A1: Trust
  { id: 73, text: 'I trust others.', dimension: 'A', facet: 'A1_Trust', isReversed: false },
  { id: 74, text: 'I believe that others have good intentions.', dimension: 'A', facet: 'A1_Trust', isReversed: false },
  { id: 75, text: 'I trust what people say.', dimension: 'A', facet: 'A1_Trust', isReversed: false },
  { id: 76, text: 'I distrust people.', dimension: 'A', facet: 'A1_Trust', isReversed: true },
  // A2: Morality
  { id: 77, text: 'I would never cheat on my taxes.', dimension: 'A', facet: 'A2_Morality', isReversed: false },
  { id: 78, text: 'I stick to the rules.', dimension: 'A', facet: 'A2_Morality', isReversed: false },
  { id: 79, text: 'I use flattery to get ahead.', dimension: 'A', facet: 'A2_Morality', isReversed: true },
  { id: 80, text: 'I use others for my own ends.', dimension: 'A', facet: 'A2_Morality', isReversed: true },
  // A3: Altruism
  { id: 81, text: 'I make people feel welcome.', dimension: 'A', facet: 'A3_Altruism', isReversed: false },
  { id: 82, text: 'I anticipate the needs of others.', dimension: 'A', facet: 'A3_Altruism', isReversed: false },
  { id: 83, text: 'I love to help others.', dimension: 'A', facet: 'A3_Altruism', isReversed: false },
  { id: 84, text: 'I am indifferent to the feelings of others.', dimension: 'A', facet: 'A3_Altruism', isReversed: true },
  // A4: Cooperation
  { id: 85, text: 'I am easy to satisfy.', dimension: 'A', facet: 'A4_Cooperation', isReversed: false },
  { id: 86, text: 'I can\'t stand confrontations.', dimension: 'A', facet: 'A4_Cooperation', isReversed: false },
  { id: 87, text: 'I hate to seem pushy.', dimension: 'A', facet: 'A4_Cooperation', isReversed: false },
  { id: 88, text: 'I have a sharp tongue.', dimension: 'A', facet: 'A4_Cooperation', isReversed: true },
  // A5: Modesty
  { id: 89, text: 'I dislike being the center of attention.', dimension: 'A', facet: 'A5_Modesty', isReversed: false },
  { id: 90, text: 'I dislike talking about myself.', dimension: 'A', facet: 'A5_Modesty', isReversed: false },
  { id: 91, text: 'I consider myself an average person.', dimension: 'A', facet: 'A5_Modesty', isReversed: false },
  { id: 92, text: 'I think highly of myself.', dimension: 'A', facet: 'A5_Modesty', isReversed: true },
  // A6: Sympathy
  { id: 93, text: 'I sympathize with the homeless.', dimension: 'A', facet: 'A6_Sympathy', isReversed: false },
  { id: 94, text: 'I feel sympathy for those who are worse off than myself.', dimension: 'A', facet: 'A6_Sympathy', isReversed: false },
  { id: 95, text: 'I value cooperation over competition.', dimension: 'A', facet: 'A6_Sympathy', isReversed: false },
  { id: 96, text: 'I am not interested in other people\'s problems.', dimension: 'A', facet: 'A6_Sympathy', isReversed: true },

  // === CONSCIENTIOUSNESS (C) ===
  // C1: Self-Efficacy
  { id: 97, text: 'I complete tasks successfully.', dimension: 'C', facet: 'C1_SelfEfficacy', isReversed: false },
  { id: 98, text: 'I excel in what I do.', dimension: 'C', facet: 'C1_SelfEfficacy', isReversed: false },
  { id: 99, text: 'I handle tasks smoothly.', dimension: 'C', facet: 'C1_SelfEfficacy', isReversed: false },
  { id: 100, text: 'I misjudge situations.', dimension: 'C', facet: 'C1_SelfEfficacy', isReversed: true },
  // C2: Orderliness
  { id: 101, text: 'I like order.', dimension: 'C', facet: 'C2_Orderliness', isReversed: false },
  { id: 102, text: 'I like to tidy up.', dimension: 'C', facet: 'C2_Orderliness', isReversed: false },
  { id: 103, text: 'I want everything to be "just right."', dimension: 'C', facet: 'C2_Orderliness', isReversed: false },
  { id: 104, text: 'I leave my belongings around.', dimension: 'C', facet: 'C2_Orderliness', isReversed: true },
  // C3: Dutifulness
  { id: 105, text: 'I keep my promises.', dimension: 'C', facet: 'C3_Dutifulness', isReversed: false },
  { id: 106, text: 'I tell the truth.', dimension: 'C', facet: 'C3_Dutifulness', isReversed: false },
  { id: 107, text: 'I follow through on my commitments.', dimension: 'C', facet: 'C3_Dutifulness', isReversed: false },
  { id: 108, text: 'I break rules.', dimension: 'C', facet: 'C3_Dutifulness', isReversed: true },
  // C4: Achievement-Striving
  { id: 109, text: 'I work hard.', dimension: 'C', facet: 'C4_AchievementStriving', isReversed: false },
  { id: 110, text: 'I do more than what\'s expected of me.', dimension: 'C', facet: 'C4_AchievementStriving', isReversed: false },
  { id: 111, text: 'I set high standards for myself and others.', dimension: 'C', facet: 'C4_AchievementStriving', isReversed: false },
  { id: 112, text: 'I do just enough work to get by.', dimension: 'C', facet: 'C4_AchievementStriving', isReversed: true },
  // C5: Self-Discipline
  { id: 113, text: 'I get chores done right away.', dimension: 'C', facet: 'C5_SelfDiscipline', isReversed: false },
  { id: 114, text: 'I am always prepared.', dimension: 'C', facet: 'C5_SelfDiscipline', isReversed: false },
  { id: 115, text: 'I start tasks right away.', dimension: 'C', facet: 'C5_SelfDiscipline', isReversed: false },
  { id: 116, text: 'I find it difficult to get down to work.', dimension: 'C', facet: 'C5_SelfDiscipline', isReversed: true },
  // C6: Cautiousness
  { id: 117, text: 'I avoid mistakes.', dimension: 'C', facet: 'C6_Cautiousness', isReversed: false },
  { id: 118, text: 'I choose my words with care.', dimension: 'C', facet: 'C6_Cautiousness', isReversed: false },
  { id: 119, text: 'I make rash decisions.', dimension: 'C', facet: 'C6_Cautiousness', isReversed: true },
  { id: 120, text: 'I rush into things.', dimension: 'C', facet: 'C6_Cautiousness', isReversed: true },
];

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

// Get all dimensions
export const dimensions: Dimension[] = ['O', 'C', 'E', 'A', 'N'];

// Get all facets for a dimension
export function getFacetsForDimension(dimension: Dimension): Facet[] {
  return Object.values(facetInfo)
    .filter((f) => f.dimension === dimension)
    .map((f) => f.code);
}

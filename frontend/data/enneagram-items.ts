// Enneagram test items based on Open Source Psychometrics Project
// License: CC BY-NC-SA
// https://openpsychometrics.org/

export interface EnneagramItem {
  id: number;
  text: string;
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

// 36 items, 4 per type, 5-point Likert scale (1=Strongly Disagree to 5=Strongly Agree)
export const enneagramItems: EnneagramItem[] = [
  // Type 1 - Reformer
  { id: 1, text: "I have high standards and get frustrated when they aren't met.", type: 1 },
  { id: 2, text: "I often notice errors and feel compelled to correct them.", type: 1 },
  { id: 3, text: "I believe there is a right way to do things.", type: 1 },
  { id: 4, text: "I am often critical of myself and others.", type: 1 },

  // Type 2 - Helper
  { id: 5, text: "I feel fulfilled when I can help others.", type: 2 },
  { id: 6, text: "I often put others' needs before my own.", type: 2 },
  { id: 7, text: "I want to be appreciated for my caring nature.", type: 2 },
  { id: 8, text: "I find it easy to sense what others need.", type: 2 },

  // Type 3 - Achiever
  { id: 9, text: "I am very goal-oriented and driven to succeed.", type: 3 },
  { id: 10, text: "I adapt my image based on what will make me successful.", type: 3 },
  { id: 11, text: "Recognition and achievement are very important to me.", type: 3 },
  { id: 12, text: "I work hard to be seen as competent and successful.", type: 3 },

  // Type 4 - Individualist
  { id: 13, text: "I often feel different from others.", type: 4 },
  { id: 14, text: "I am deeply in touch with my emotions.", type: 4 },
  { id: 15, text: "I feel like something is missing in my life.", type: 4 },
  { id: 16, text: "I am drawn to what is authentic and meaningful.", type: 4 },

  // Type 5 - Investigator
  { id: 17, text: "I need time alone to recharge and think.", type: 5 },
  { id: 18, text: "I prefer to observe before participating.", type: 5 },
  { id: 19, text: "I value knowledge and understanding deeply.", type: 5 },
  { id: 20, text: "I tend to minimize my needs and live simply.", type: 5 },

  // Type 6 - Loyalist
  { id: 21, text: "I often think about what could go wrong.", type: 6 },
  { id: 22, text: "Loyalty and trust are extremely important to me.", type: 6 },
  { id: 23, text: "I look to authority figures or systems for guidance.", type: 6 },
  { id: 24, text: "I question things and look for hidden motives.", type: 6 },

  // Type 7 - Enthusiast
  { id: 25, text: "I love new experiences and adventures.", type: 7 },
  { id: 26, text: "I tend to avoid negative emotions and focus on the positive.", type: 7 },
  { id: 27, text: "I have many interests and find it hard to focus on just one.", type: 7 },
  { id: 28, text: "I get restless when I feel trapped or limited.", type: 7 },

  // Type 8 - Challenger
  { id: 29, text: "I am direct and assertive in expressing my opinions.", type: 8 },
  { id: 30, text: "I don't like to show weakness or vulnerability.", type: 8 },
  { id: 31, text: "I naturally take charge in situations.", type: 8 },
  { id: 32, text: "I stand up for the underdog and fight injustice.", type: 8 },

  // Type 9 - Peacemaker
  { id: 33, text: "I try to avoid conflict whenever possible.", type: 9 },
  { id: 34, text: "I often go along with others to keep the peace.", type: 9 },
  { id: 35, text: "I can see multiple perspectives in any situation.", type: 9 },
  { id: 36, text: "I sometimes have trouble knowing what I want.", type: 9 },
];

export const likertScale = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
] as const;

export type LikertValue = 1 | 2 | 3 | 4 | 5;

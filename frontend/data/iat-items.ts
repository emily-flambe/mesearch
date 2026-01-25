// Implicit Association Test (IAT) Configuration
// Source: Project Implicit (Harvard) - Flowers-Insects IAT
// License: Educational/research use
//
// CRITICAL ETHICAL NOTE:
// The IAT has low test-retest reliability (~0.50) for individuals.
// It should ONLY be framed as an educational self-reflection tool,
// NOT as a diagnostic measure.

export interface IATCategory {
  name: string;
  items: string[];
}

export interface IATBlockConfig {
  blockNumber: number;
  type: 'practice' | 'test';
  leftCategories: string[]; // Categories assigned to 'E' key
  rightCategories: string[]; // Categories assigned to 'I' key
  numTrials: number;
  instructions: string;
}

export interface IATConfig {
  id: string;
  name: string;
  description: string;
  disclaimer: string;
  categories: {
    target1: IATCategory; // e.g., Flowers
    target2: IATCategory; // e.g., Insects
    attribute1: IATCategory; // e.g., Good
    attribute2: IATCategory; // e.g., Bad
  };
  blocks: IATBlockConfig[];
}

// Flowers-Insects IAT - A neutral, low-stakes demonstration IAT
// This is commonly used as an introductory IAT because it doesn't
// involve sensitive social categories.
export const flowersInsectsIAT: IATConfig = {
  id: 'flowers-insects',
  name: 'Flowers vs. Insects IAT',
  description:
    'This IAT measures implicit preferences between Flowers and Insects by comparing how quickly you sort words when different concepts share a response key. Most people find it easier to pair Flowers with Good and Insects with Bad.',
  disclaimer: `This is an educational demonstration of the Implicit Association Test (IAT), developed by researchers at Harvard, the University of Virginia, and the University of Washington.

• Your result may differ from your conscious beliefs
• Results can vary between sessions due to fatigue, distraction, or recent experiences
• This is NOT a diagnosis—the IAT measures associations, not prejudice or character
• Use your result as an opportunity for self-reflection, not a definitive assessment

By proceeding, you acknowledge that you may encounter interpretations you find surprising or objectionable.`,
  categories: {
    target1: {
      name: 'Flowers',
      items: ['Rose', 'Tulip', 'Daisy', 'Lily', 'Orchid', 'Sunflower', 'Violet', 'Daffodil'],
    },
    target2: {
      name: 'Insects',
      items: ['Wasp', 'Cockroach', 'Mosquito', 'Spider', 'Beetle', 'Fly', 'Ant', 'Moth'],
    },
    attribute1: {
      name: 'Good',
      items: ['Wonderful', 'Joyful', 'Excellent', 'Lovely', 'Superb', 'Pleasure', 'Beautiful', 'Glorious'],
    },
    attribute2: {
      name: 'Bad',
      items: ['Terrible', 'Horrible', 'Nasty', 'Awful', 'Evil', 'Painful', 'Ugly', 'Dreadful'],
    },
  },
  // Standard 7-block IAT structure with counterbalancing
  // Block order can be counterbalanced (compatible first vs incompatible first)
  blocks: [
    // Block 1: Target discrimination practice
    {
      blockNumber: 1,
      type: 'practice',
      leftCategories: ['Flowers'],
      rightCategories: ['Insects'],
      numTrials: 20,
      instructions:
        'Press E for Flowers, press I for Insects.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 2: Attribute discrimination practice
    {
      blockNumber: 2,
      type: 'practice',
      leftCategories: ['Good'],
      rightCategories: ['Bad'],
      numTrials: 20,
      instructions:
        'Press E for Good words, press I for Bad words.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 3: Combined practice (compatible pairing)
    {
      blockNumber: 3,
      type: 'practice',
      leftCategories: ['Flowers', 'Good'],
      rightCategories: ['Insects', 'Bad'],
      numTrials: 20,
      instructions:
        'Press E for Flowers or Good words.\nPress I for Insects or Bad words.\n\nSort items as quickly as you can.',
    },
    // Block 4: Combined test (compatible pairing)
    {
      blockNumber: 4,
      type: 'test',
      leftCategories: ['Flowers', 'Good'],
      rightCategories: ['Insects', 'Bad'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Flowers or Good words.\nPress I for Insects or Bad words.\n\nGo as fast as you can!',
    },
    // Block 5: Reversed target discrimination practice
    {
      blockNumber: 5,
      type: 'practice',
      leftCategories: ['Insects'],
      rightCategories: ['Flowers'],
      numTrials: 40,
      instructions:
        'ATTENTION: The categories have switched sides!\n\nPress E for Insects, press I for Flowers.\n\nThis may feel awkward at first - that is normal.',
    },
    // Block 6: Combined practice (incompatible pairing)
    {
      blockNumber: 6,
      type: 'practice',
      leftCategories: ['Insects', 'Good'],
      rightCategories: ['Flowers', 'Bad'],
      numTrials: 20,
      instructions:
        'Press E for Insects or Good words.\nPress I for Flowers or Bad words.\n\nSort items as quickly as you can.',
    },
    // Block 7: Combined test (incompatible pairing)
    {
      blockNumber: 7,
      type: 'test',
      leftCategories: ['Insects', 'Good'],
      rightCategories: ['Flowers', 'Bad'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Insects or Good words.\nPress I for Flowers or Bad words.\n\nGo as fast as you can!',
    },
  ],
};

// Helper to determine which category a stimulus belongs to
export function getCategoryForStimulus(
  config: IATConfig,
  stimulus: string
): string | null {
  const { target1, target2, attribute1, attribute2 } = config.categories;

  if (target1.items.includes(stimulus)) return target1.name;
  if (target2.items.includes(stimulus)) return target2.name;
  if (attribute1.items.includes(stimulus)) return attribute1.name;
  if (attribute2.items.includes(stimulus)) return attribute2.name;

  return null;
}

// Helper to determine correct response for a stimulus in a block
export function getCorrectResponse(
  block: IATBlockConfig,
  category: string
): 'E' | 'I' {
  if (block.leftCategories.includes(category)) return 'E';
  if (block.rightCategories.includes(category)) return 'I';
  throw new Error(`Category ${category} not found in block ${block.blockNumber}`);
}

// Generate trial stimuli for a block
export function generateBlockTrials(
  config: IATConfig,
  block: IATBlockConfig
): string[] {
  const stimuli: string[] = [];
  const { target1, target2, attribute1, attribute2 } = config.categories;

  // Determine which categories are active in this block
  const allCategories = [...block.leftCategories, ...block.rightCategories];
  const activeItems: string[] = [];

  if (allCategories.includes(target1.name)) {
    activeItems.push(...target1.items);
  }
  if (allCategories.includes(target2.name)) {
    activeItems.push(...target2.items);
  }
  if (allCategories.includes(attribute1.name)) {
    activeItems.push(...attribute1.items);
  }
  if (allCategories.includes(attribute2.name)) {
    activeItems.push(...attribute2.items);
  }

  // Generate trials ensuring roughly equal representation
  while (stimuli.length < block.numTrials) {
    // Shuffle and add items
    const shuffled = [...activeItems].sort(() => Math.random() - 0.5);
    for (const item of shuffled) {
      if (stimuli.length < block.numTrials) {
        stimuli.push(item);
      }
    }
  }

  // Final shuffle
  return stimuli.sort(() => Math.random() - 0.5);
}

// Get display color for a category (for visual distinction)
export function getCategoryColor(category: string): string {
  // Target categories are green, attribute categories are blue
  const targetCategories = ['Flowers', 'Insects', 'Black faces', 'White faces', 'Black Faces', 'White Faces', 'Male', 'Female', 'Light Skin', 'Dark Skin'];
  const attributeCategories = ['Good', 'Bad', 'Career', 'Family', 'Weapons', 'Harmless'];

  if (targetCategories.includes(category)) {
    return '#22c55e'; // green-500
  }
  if (attributeCategories.includes(category)) {
    return '#3b82f6'; // blue-500
  }
  return '#a1a1aa'; // zinc-400
}

// Generate counterbalanced block configuration
// Per IAT methodology, there are two independent randomizations:
// 1. targetSideSwapped: Which side targets appear on initially (target1 left vs right)
// 2. pairingOrderSwapped: Which pairing comes first (compatible vs incompatible)
// This creates 4 possible conditions (2x2 design)
export function getCounterbalancedBlocks(
  config: IATConfig,
  pairingOrderSwapped: boolean,
  targetSideSwapped: boolean = false
): IATBlockConfig[] {
  // Extract category names from config for generic handling
  const target1 = config.categories.target1.name;
  const target2 = config.categories.target2.name;
  const attr1 = config.categories.attribute1.name;
  const attr2 = config.categories.attribute2.name;

  return config.blocks.map((block) => {
    let newBlock = { ...block };

    // Handle target side randomization (affects blocks 1, 3-4, 5, 6-7)
    // When targetSideSwapped=true, target2 starts on left instead of target1
    if (targetSideSwapped) {
      if (block.blockNumber === 1) {
        // Swap Block 1: target2 on left, target1 on right
        newBlock = {
          ...newBlock,
          leftCategories: [target2],
          rightCategories: [target1],
          instructions: `Press E for ${target2}, press I for ${target1}.\n\nSort the items as quickly as you can while making as few mistakes as possible.`,
        };
      } else if (block.blockNumber === 5) {
        // Block 5 reverses from Block 1, so if Block 1 has target2-left,
        // Block 5 should have target1-left (opposite of standard)
        newBlock = {
          ...newBlock,
          leftCategories: [target1],
          rightCategories: [target2],
          instructions: `ATTENTION: The categories have switched sides!\n\nPress E for ${target1}, press I for ${target2}.\n\nThis may feel awkward at first - that is normal.`,
        };
      }
    }

    // Handle pairing order randomization (affects combined blocks 3-4 and 6-7)
    // When pairingOrderSwapped=true, incompatible pairing comes first
    if (pairingOrderSwapped) {
      if (block.blockNumber === 3 || block.blockNumber === 4) {
        // Swap to incompatible pairing first
        const leftTarget = targetSideSwapped ? target1 : target2;
        const rightTarget = targetSideSwapped ? target2 : target1;
        newBlock = {
          ...newBlock,
          leftCategories: [leftTarget, attr1],
          rightCategories: [rightTarget, attr2],
          instructions: block.blockNumber === 3
            ? `Press E for ${leftTarget} or ${attr1} words.\nPress I for ${rightTarget} or ${attr2} words.\n\nSort items as quickly as you can.`
            : `This is the same task as before.\n\nPress E for ${leftTarget} or ${attr1} words.\nPress I for ${rightTarget} or ${attr2} words.\n\nGo as fast as you can!`,
        };
      } else if (block.blockNumber === 6 || block.blockNumber === 7) {
        // Swap to compatible pairing
        const leftTarget = targetSideSwapped ? target2 : target1;
        const rightTarget = targetSideSwapped ? target1 : target2;
        newBlock = {
          ...newBlock,
          leftCategories: [leftTarget, attr1],
          rightCategories: [rightTarget, attr2],
          instructions: block.blockNumber === 6
            ? `Press E for ${leftTarget} or ${attr1} words.\nPress I for ${rightTarget} or ${attr2} words.\n\nSort items as quickly as you can.`
            : `This is the same task as before.\n\nPress E for ${leftTarget} or ${attr1} words.\nPress I for ${rightTarget} or ${attr2} words.\n\nGo as fast as you can!`,
        };
      }
    } else {
      // Standard pairing order, but still need to handle target side swap
      if (targetSideSwapped) {
        if (block.blockNumber === 3 || block.blockNumber === 4) {
          // Compatible pairing with swapped targets: target2+attr1 on left
          newBlock = {
            ...newBlock,
            leftCategories: [target2, attr1],
            rightCategories: [target1, attr2],
            instructions: block.blockNumber === 3
              ? `Press E for ${target2} or ${attr1} words.\nPress I for ${target1} or ${attr2} words.\n\nSort items as quickly as you can.`
              : `This is the same task as before.\n\nPress E for ${target2} or ${attr1} words.\nPress I for ${target1} or ${attr2} words.\n\nGo as fast as you can!`,
          };
        } else if (block.blockNumber === 6 || block.blockNumber === 7) {
          // Incompatible pairing with swapped targets: target1+attr1 on left
          newBlock = {
            ...newBlock,
            leftCategories: [target1, attr1],
            rightCategories: [target2, attr2],
            instructions: block.blockNumber === 6
              ? `Press E for ${target1} or ${attr1} words.\nPress I for ${target2} or ${attr2} words.\n\nSort items as quickly as you can.`
              : `This is the same task as before.\n\nPress E for ${target1} or ${attr1} words.\nPress I for ${target2} or ${attr2} words.\n\nGo as fast as you can!`,
          };
        }
      }
    }

    return newBlock;
  });
}

// Race IAT - Measures implicit associations between Black/White faces and Good/Bad words
// IMPORTANT: This is a sensitive assessment measuring implicit racial bias.
// See docs/IAT-METHODOLOGY.md for ethical requirements.
export const raceIAT: IATConfig = {
  id: 'race-iat',
  name: 'Race IAT',
  description:
    'This IAT measures implicit associations between racial categories (Black and White faces) and evaluative attributes (Good and Bad words). It examines the strength of automatic associations that may differ from your conscious beliefs and values.',
  disclaimer: `IMPORTANT: Please read carefully before proceeding.

This is an educational self-reflection tool measuring implicit associations, NOT a diagnostic measure of racial prejudice or character.

KEY POINTS TO UNDERSTAND:

1. IMPLICIT PREFERENCE DOES NOT EQUAL PREJUDICE
An implicit preference does not mean you are racist or harbor conscious prejudice. The IAT measures automatic associations that exist in many people, regardless of their conscious beliefs and values.

2. RESULTS HAVE LOW INDIVIDUAL RELIABILITY
Single IAT scores have a test-retest reliability of approximately 0.50. Your results may differ significantly if you take this test again. This is normal and expected.

3. NOT FOR CONSEQUENTIAL DECISIONS
IAT results should NEVER be used for hiring, selection, or any consequential decisions about yourself or others.

4. CULTURAL CONTEXT MATTERS
Implicit associations are influenced by cultural exposure and do not necessarily reflect personal endorsement. Living in a society with certain cultural associations can create implicit biases even in people who actively reject those biases.

5. RESULTS ARE FOR REFLECTION ONLY
Use this as an opportunity for self-awareness and learning, not as a definitive assessment of who you are.

NOTE: This version uses placeholder text labels. Future versions will include face images for more accurate measurement.

By proceeding, you acknowledge that:
- You understand this measures implicit associations, not prejudice
- You may encounter results that surprise you or feel uncomfortable
- You will use results for self-reflection, not self-judgment`,
  categories: {
    target1: {
      name: 'Black faces',
      // Placeholder labels - future versions will use actual face images
      items: [
        'Black Face 1',
        'Black Face 2',
        'Black Face 3',
        'Black Face 4',
        'Black Face 5',
        'Black Face 6',
        'Black Face 7',
        'Black Face 8',
      ],
    },
    target2: {
      name: 'White faces',
      // Placeholder labels - future versions will use actual face images
      items: [
        'White Face 1',
        'White Face 2',
        'White Face 3',
        'White Face 4',
        'White Face 5',
        'White Face 6',
        'White Face 7',
        'White Face 8',
      ],
    },
    attribute1: {
      name: 'Good',
      items: ['Wonderful', 'Joyful', 'Excellent', 'Lovely', 'Superb', 'Pleasure', 'Beautiful', 'Glorious'],
    },
    attribute2: {
      name: 'Bad',
      items: ['Terrible', 'Horrible', 'Nasty', 'Awful', 'Evil', 'Painful', 'Ugly', 'Dreadful'],
    },
  },
  // Standard 7-block IAT structure with counterbalancing
  blocks: [
    // Block 1: Target discrimination practice
    {
      blockNumber: 1,
      type: 'practice',
      leftCategories: ['Black faces'],
      rightCategories: ['White faces'],
      numTrials: 20,
      instructions:
        'Press E for Black faces, press I for White faces.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 2: Attribute discrimination practice
    {
      blockNumber: 2,
      type: 'practice',
      leftCategories: ['Good'],
      rightCategories: ['Bad'],
      numTrials: 20,
      instructions:
        'Press E for Good words, press I for Bad words.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 3: Combined practice (compatible pairing)
    {
      blockNumber: 3,
      type: 'practice',
      leftCategories: ['Black faces', 'Good'],
      rightCategories: ['White faces', 'Bad'],
      numTrials: 20,
      instructions:
        'Press E for Black faces or Good words.\nPress I for White faces or Bad words.\n\nSort items as quickly as you can.',
    },
    // Block 4: Combined test (compatible pairing)
    {
      blockNumber: 4,
      type: 'test',
      leftCategories: ['Black faces', 'Good'],
      rightCategories: ['White faces', 'Bad'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Black faces or Good words.\nPress I for White faces or Bad words.\n\nGo as fast as you can!',
    },
    // Block 5: Reversed target discrimination practice
    {
      blockNumber: 5,
      type: 'practice',
      leftCategories: ['White faces'],
      rightCategories: ['Black faces'],
      numTrials: 40,
      instructions:
        'ATTENTION: The categories have switched sides!\n\nPress E for White faces, press I for Black faces.\n\nThis may feel awkward at first - that is normal.',
    },
    // Block 6: Combined practice (incompatible pairing)
    {
      blockNumber: 6,
      type: 'practice',
      leftCategories: ['White faces', 'Good'],
      rightCategories: ['Black faces', 'Bad'],
      numTrials: 20,
      instructions:
        'Press E for White faces or Good words.\nPress I for Black faces or Bad words.\n\nSort items as quickly as you can.',
    },
    // Block 7: Combined test (incompatible pairing)
    {
      blockNumber: 7,
      type: 'test',
      leftCategories: ['White faces', 'Good'],
      rightCategories: ['Black faces', 'Bad'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for White faces or Good words.\nPress I for Black faces or Bad words.\n\nGo as fast as you can!',
    },
  ],
};

// Gender-Career IAT - Measures implicit associations between
// male/female names and career vs family concepts
// This is one of the most widely studied IATs in the literature.
export const genderCareerIAT: IATConfig = {
  id: 'gender-career',
  name: 'Gender-Career IAT',
  description:
    'This IAT measures implicit associations between gender (Male/Female names) and domains (Career/Family). It examines whether you more easily associate Male names with Career concepts and Female names with Family concepts, or vice versa.',
  disclaimer: `This is an educational demonstration of the Implicit Association Test (IAT), developed by researchers at Harvard, the University of Virginia, and the University of Washington.

IMPORTANT ETHICAL CONSIDERATIONS:

- Your result may differ from your conscious beliefs about gender roles
- Results can vary between sessions due to fatigue, distraction, or recent experiences
- This is NOT a diagnosis - the IAT measures associations, not sexism or character
- Implicit associations often reflect cultural exposure rather than personal endorsement
- Use your result as an opportunity for self-reflection, not a definitive assessment

The Gender-Career IAT has been studied extensively. Many people show implicit associations that link Male with Career and Female with Family, regardless of their explicit beliefs about gender equality.

By proceeding, you acknowledge that you may encounter interpretations you find surprising or objectionable.`,
  categories: {
    target1: {
      name: 'Male',
      items: ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Richard', 'Joseph'],
    },
    target2: {
      name: 'Female',
      items: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica'],
    },
    attribute1: {
      name: 'Career',
      items: ['Career', 'Professional', 'Office', 'Business', 'Salary', 'Management', 'Corporation', 'Executive'],
    },
    attribute2: {
      name: 'Family',
      items: ['Family', 'Home', 'Children', 'Parents', 'Wedding', 'Marriage', 'Relatives', 'Household'],
    },
  },
  // Standard 7-block IAT structure with counterbalancing
  blocks: [
    // Block 1: Target discrimination practice
    {
      blockNumber: 1,
      type: 'practice',
      leftCategories: ['Male'],
      rightCategories: ['Female'],
      numTrials: 20,
      instructions:
        'Press E for Male names, press I for Female names.\n\nSort the names as quickly as you can while making as few mistakes as possible.',
    },
    // Block 2: Attribute discrimination practice
    {
      blockNumber: 2,
      type: 'practice',
      leftCategories: ['Career'],
      rightCategories: ['Family'],
      numTrials: 20,
      instructions:
        'Press E for Career words, press I for Family words.\n\nSort the words as quickly as you can while making as few mistakes as possible.',
    },
    // Block 3: Combined practice (Male+Career pairing)
    {
      blockNumber: 3,
      type: 'practice',
      leftCategories: ['Male', 'Career'],
      rightCategories: ['Female', 'Family'],
      numTrials: 20,
      instructions:
        'Press E for Male names or Career words.\nPress I for Female names or Family words.\n\nSort items as quickly as you can.',
    },
    // Block 4: Combined test (Male+Career pairing)
    {
      blockNumber: 4,
      type: 'test',
      leftCategories: ['Male', 'Career'],
      rightCategories: ['Female', 'Family'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Male names or Career words.\nPress I for Female names or Family words.\n\nGo as fast as you can!',
    },
    // Block 5: Reversed target discrimination practice
    {
      blockNumber: 5,
      type: 'practice',
      leftCategories: ['Female'],
      rightCategories: ['Male'],
      numTrials: 40,
      instructions:
        'ATTENTION: The categories have switched sides!\n\nPress E for Female names, press I for Male names.\n\nThis may feel awkward at first - that is normal.',
    },
    // Block 6: Combined practice (Female+Career pairing)
    {
      blockNumber: 6,
      type: 'practice',
      leftCategories: ['Female', 'Career'],
      rightCategories: ['Male', 'Family'],
      numTrials: 20,
      instructions:
        'Press E for Female names or Career words.\nPress I for Male names or Family words.\n\nSort items as quickly as you can.',
    },
    // Block 7: Combined test (Female+Career pairing)
    {
      blockNumber: 7,
      type: 'test',
      leftCategories: ['Female', 'Career'],
      rightCategories: ['Male', 'Family'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Female names or Career words.\nPress I for Male names or Family words.\n\nGo as fast as you can!',
    },
  ],
};

// Skin-Tone IAT - Examines implicit preferences between light and dark skin tones
// IMPORTANT: This is a sensitive topic. Strong ethical disclaimers are required.
// Currently uses placeholder text labels; future versions will include face images.
export const skinToneIAT: IATConfig = {
  id: 'skin-tone',
  name: 'Skin-Tone IAT',
  description:
    'This IAT measures implicit preferences between Light Skin and Dark Skin by comparing how quickly you sort items when different concepts share a response key. Research shows that many people, regardless of their own skin tone, show an implicit preference for lighter skin.',
  disclaimer: `IMPORTANT: This is an educational self-reflection tool designed to help you explore unconscious associations related to skin tone. Please read carefully before proceeding.

WHAT THIS TEST MEASURES:
- Implicit associations between skin tone and evaluative concepts (Good/Bad)
- The speed of automatic mental associations, NOT conscious beliefs or values
- Patterns that exist broadly in society, not your personal character

WHAT THIS TEST DOES NOT MEASURE:
- Your moral character or whether you are a "good" or "bad" person
- Conscious prejudice or intentional discrimination
- How you treat people of different skin tones in real life

CRITICAL LIMITATIONS:
- Single IAT scores have LOW individual reliability (~0.50 test-retest)
- Your result may vary between sessions due to fatigue, distraction, or recent experiences
- Implicit associations are shaped by cultural exposure, not personal endorsement
- This test should NEVER be used for hiring, selection, or any consequential decisions

ETHICAL FRAMING:
- Implicit preference does NOT equal prejudice or character judgment
- Many people show implicit biases they consciously reject
- Results are most meaningful for self-reflection, not self-judgment
- Use this as an opportunity for awareness, not a definitive assessment

NOTE: This version uses placeholder text labels. Future versions will include face images for a more valid assessment.

By proceeding, you acknowledge that:
1. You may encounter results that differ from your conscious beliefs
2. You will use your results for self-reflection, not self-criticism
3. You understand the limitations of single IAT administrations`,
  categories: {
    target1: {
      name: 'Light Skin',
      items: [
        'Light Skin 1',
        'Light Skin 2',
        'Light Skin 3',
        'Light Skin 4',
        'Light Skin 5',
        'Light Skin 6',
        'Light Skin 7',
        'Light Skin 8',
      ],
    },
    target2: {
      name: 'Dark Skin',
      items: [
        'Dark Skin 1',
        'Dark Skin 2',
        'Dark Skin 3',
        'Dark Skin 4',
        'Dark Skin 5',
        'Dark Skin 6',
        'Dark Skin 7',
        'Dark Skin 8',
      ],
    },
    attribute1: {
      name: 'Good',
      items: ['Wonderful', 'Joyful', 'Excellent', 'Lovely', 'Superb', 'Pleasure', 'Beautiful', 'Glorious'],
    },
    attribute2: {
      name: 'Bad',
      items: ['Terrible', 'Horrible', 'Nasty', 'Awful', 'Evil', 'Painful', 'Ugly', 'Dreadful'],
    },
  },
  // Standard 7-block IAT structure with counterbalancing
  blocks: [
    // Block 1: Target discrimination practice
    {
      blockNumber: 1,
      type: 'practice',
      leftCategories: ['Light Skin'],
      rightCategories: ['Dark Skin'],
      numTrials: 20,
      instructions:
        'Press E for Light Skin, press I for Dark Skin.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 2: Attribute discrimination practice
    {
      blockNumber: 2,
      type: 'practice',
      leftCategories: ['Good'],
      rightCategories: ['Bad'],
      numTrials: 20,
      instructions:
        'Press E for Good words, press I for Bad words.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 3: Combined practice (compatible pairing)
    {
      blockNumber: 3,
      type: 'practice',
      leftCategories: ['Light Skin', 'Good'],
      rightCategories: ['Dark Skin', 'Bad'],
      numTrials: 20,
      instructions:
        'Press E for Light Skin or Good words.\nPress I for Dark Skin or Bad words.\n\nSort items as quickly as you can.',
    },
    // Block 4: Combined test (compatible pairing)
    {
      blockNumber: 4,
      type: 'test',
      leftCategories: ['Light Skin', 'Good'],
      rightCategories: ['Dark Skin', 'Bad'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Light Skin or Good words.\nPress I for Dark Skin or Bad words.\n\nGo as fast as you can!',
    },
    // Block 5: Reversed target discrimination practice
    {
      blockNumber: 5,
      type: 'practice',
      leftCategories: ['Dark Skin'],
      rightCategories: ['Light Skin'],
      numTrials: 40,
      instructions:
        'ATTENTION: The categories have switched sides!\n\nPress E for Dark Skin, press I for Light Skin.\n\nThis may feel awkward at first - that is normal.',
    },
    // Block 6: Combined practice (incompatible pairing)
    {
      blockNumber: 6,
      type: 'practice',
      leftCategories: ['Dark Skin', 'Good'],
      rightCategories: ['Light Skin', 'Bad'],
      numTrials: 20,
      instructions:
        'Press E for Dark Skin or Good words.\nPress I for Light Skin or Bad words.\n\nSort items as quickly as you can.',
    },
    // Block 7: Combined test (incompatible pairing)
    {
      blockNumber: 7,
      type: 'test',
      leftCategories: ['Dark Skin', 'Good'],
      rightCategories: ['Light Skin', 'Bad'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Dark Skin or Good words.\nPress I for Light Skin or Bad words.\n\nGo as fast as you can!',
    },
  ],
};

// Weapons IAT - Replicates research on implicit weapon bias
// Based on studies examining implicit associations between race and weapons/harmless objects.
//
// CRITICAL ETHICAL NOTE:
// This is an extremely sensitive test that touches on racial bias.
// It should be framed VERY carefully as an educational self-reflection tool,
// with extensive disclaimers about the limitations of individual IAT scores.
//
// IMPORTANT: This version uses placeholder text labels instead of images.
// The original research used photographs of faces and images of objects.
// Future versions will include actual images.
export const weaponsIAT: IATConfig = {
  id: 'weapons-iat',
  name: 'Weapons IAT',
  description:
    'This IAT examines implicit associations between racial categories and weapons versus harmless objects. It replicates a well-known paradigm in social psychology research on implicit bias. Most people show faster reaction times when pairing certain categories together, regardless of their conscious beliefs.',
  disclaimer: `PLEASE READ CAREFULLY BEFORE PROCEEDING

This is an extremely sensitive assessment that examines implicit associations related to race and weapons. Before taking this test, please understand:

IMPORTANT CONTEXT:
- This test replicates research paradigms used to study implicit weapon bias
- It currently uses PLACEHOLDER TEXT LABELS instead of actual images
- Future versions will include photographs of faces and images of objects
- Your results reflect automatic associations, NOT your character, values, or conscious beliefs

WHAT THIS TEST DOES NOT MEASURE:
- Whether you are racist or prejudiced
- Your moral character or worth as a person
- How you would actually behave in real situations
- Your conscious beliefs about race

CRITICAL LIMITATIONS:
- Individual IAT scores have LOW reliability (~0.50 test-retest)
- Your score may differ significantly if you take the test again
- Results are influenced by cultural exposure, media, and recent experiences
- A single IAT score should NEVER be used to make judgments about individuals

ETHICAL USE:
- This is for EDUCATIONAL SELF-REFLECTION ONLY
- Do NOT use results for hiring, selection, or any consequential decisions
- Do NOT interpret results as measuring prejudice or discriminatory intent
- Results are most meaningful at aggregate/group level, not for individuals

By proceeding, you acknowledge that:
1. You understand the limitations of this assessment
2. You will not use results to judge yourself or others
3. You may encounter results you find surprising or uncomfortable
4. This is a learning tool, not a diagnostic instrument`,
  categories: {
    target1: {
      name: 'Black Faces',
      items: [
        'Black Face 1',
        'Black Face 2',
        'Black Face 3',
        'Black Face 4',
        'Black Face 5',
        'Black Face 6',
        'Black Face 7',
        'Black Face 8',
      ],
    },
    target2: {
      name: 'White Faces',
      items: [
        'White Face 1',
        'White Face 2',
        'White Face 3',
        'White Face 4',
        'White Face 5',
        'White Face 6',
        'White Face 7',
        'White Face 8',
      ],
    },
    attribute1: {
      name: 'Weapons',
      items: ['Gun', 'Knife', 'Sword', 'Bomb', 'Grenade', 'Rifle', 'Pistol', 'Dagger'],
    },
    attribute2: {
      name: 'Harmless',
      items: ['Phone', 'Wallet', 'Camera', 'Keys', 'Sunglasses', 'Umbrella', 'Book', 'Flashlight'],
    },
  },
  // Standard 7-block IAT structure
  blocks: [
    // Block 1: Target discrimination practice
    {
      blockNumber: 1,
      type: 'practice',
      leftCategories: ['Black Faces'],
      rightCategories: ['White Faces'],
      numTrials: 20,
      instructions:
        'Press E for Black Faces, press I for White Faces.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 2: Attribute discrimination practice
    {
      blockNumber: 2,
      type: 'practice',
      leftCategories: ['Weapons'],
      rightCategories: ['Harmless'],
      numTrials: 20,
      instructions:
        'Press E for Weapons, press I for Harmless objects.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
    },
    // Block 3: Combined practice (first pairing)
    {
      blockNumber: 3,
      type: 'practice',
      leftCategories: ['Black Faces', 'Weapons'],
      rightCategories: ['White Faces', 'Harmless'],
      numTrials: 20,
      instructions:
        'Press E for Black Faces or Weapons.\nPress I for White Faces or Harmless objects.\n\nSort items as quickly as you can.',
    },
    // Block 4: Combined test (first pairing)
    {
      blockNumber: 4,
      type: 'test',
      leftCategories: ['Black Faces', 'Weapons'],
      rightCategories: ['White Faces', 'Harmless'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for Black Faces or Weapons.\nPress I for White Faces or Harmless objects.\n\nGo as fast as you can!',
    },
    // Block 5: Reversed target discrimination practice
    {
      blockNumber: 5,
      type: 'practice',
      leftCategories: ['White Faces'],
      rightCategories: ['Black Faces'],
      numTrials: 40,
      instructions:
        'ATTENTION: The categories have switched sides!\n\nPress E for White Faces, press I for Black Faces.\n\nThis may feel awkward at first - that is normal.',
    },
    // Block 6: Combined practice (second pairing)
    {
      blockNumber: 6,
      type: 'practice',
      leftCategories: ['White Faces', 'Weapons'],
      rightCategories: ['Black Faces', 'Harmless'],
      numTrials: 20,
      instructions:
        'Press E for White Faces or Weapons.\nPress I for Black Faces or Harmless objects.\n\nSort items as quickly as you can.',
    },
    // Block 7: Combined test (second pairing)
    {
      blockNumber: 7,
      type: 'test',
      leftCategories: ['White Faces', 'Weapons'],
      rightCategories: ['Black Faces', 'Harmless'],
      numTrials: 40,
      instructions:
        'This is the same task as before.\n\nPress E for White Faces or Weapons.\nPress I for Black Faces or Harmless objects.\n\nGo as fast as you can!',
    },
  ],
};

// Get all available IAT configurations
export const availableIATs: IATConfig[] = [flowersInsectsIAT, raceIAT, genderCareerIAT, skinToneIAT, weaponsIAT];

// Get IAT by ID
export function getIATById(id: string): IATConfig | undefined {
  return availableIATs.find((iat) => iat.id === id);
}

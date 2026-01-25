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
  const targetCategories = ['Flowers', 'Insects'];
  const attributeCategories = ['Good', 'Bad'];

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
// 1. targetSideSwapped: Which side targets appear on initially (Flowers left vs right)
// 2. pairingOrderSwapped: Which pairing comes first (compatible vs incompatible)
// This creates 4 possible conditions (2×2 design)
export function getCounterbalancedBlocks(
  config: IATConfig,
  pairingOrderSwapped: boolean,
  targetSideSwapped: boolean = false
): IATBlockConfig[] {
  return config.blocks.map((block) => {
    let newBlock = { ...block };

    // Handle target side randomization (affects blocks 1, 3-4, 5, 6-7)
    // When targetSideSwapped=true, Insects starts on left instead of Flowers
    if (targetSideSwapped) {
      if (block.blockNumber === 1) {
        // Swap Block 1: Insects on left, Flowers on right
        newBlock = {
          ...newBlock,
          leftCategories: ['Insects'],
          rightCategories: ['Flowers'],
          instructions: 'Press E for Insects, press I for Flowers.\n\nSort the items as quickly as you can while making as few mistakes as possible.',
        };
      } else if (block.blockNumber === 5) {
        // Block 5 reverses from Block 1, so if Block 1 has Insects-left,
        // Block 5 should have Flowers-left (opposite of standard)
        newBlock = {
          ...newBlock,
          leftCategories: ['Flowers'],
          rightCategories: ['Insects'],
          instructions: 'ATTENTION: The categories have switched sides!\n\nPress E for Flowers, press I for Insects.\n\nThis may feel awkward at first - that is normal.',
        };
      }
    }

    // Handle pairing order randomization (affects combined blocks 3-4 and 6-7)
    // When pairingOrderSwapped=true, incompatible pairing comes first
    if (pairingOrderSwapped) {
      if (block.blockNumber === 3 || block.blockNumber === 4) {
        // Swap to incompatible pairing first
        const leftTarget = targetSideSwapped ? 'Flowers' : 'Insects';
        const rightTarget = targetSideSwapped ? 'Insects' : 'Flowers';
        newBlock = {
          ...newBlock,
          leftCategories: [leftTarget, 'Good'],
          rightCategories: [rightTarget, 'Bad'],
          instructions: newBlock.instructions
            .replace(/Press E for \w+ or Good/, `Press E for ${leftTarget} or Good`)
            .replace(/Press I for \w+ or Bad/, `Press I for ${rightTarget} or Bad`),
        };
      } else if (block.blockNumber === 6 || block.blockNumber === 7) {
        // Swap to compatible pairing
        const leftTarget = targetSideSwapped ? 'Insects' : 'Flowers';
        const rightTarget = targetSideSwapped ? 'Flowers' : 'Insects';
        newBlock = {
          ...newBlock,
          leftCategories: [leftTarget, 'Good'],
          rightCategories: [rightTarget, 'Bad'],
          instructions: newBlock.instructions
            .replace(/Press E for \w+ or Good/, `Press E for ${leftTarget} or Good`)
            .replace(/Press I for \w+ or Bad/, `Press I for ${rightTarget} or Bad`),
        };
      }
    } else {
      // Standard pairing order, but still need to handle target side swap
      if (targetSideSwapped) {
        if (block.blockNumber === 3 || block.blockNumber === 4) {
          // Compatible pairing with swapped targets: Insects+Good on left
          newBlock = {
            ...newBlock,
            leftCategories: ['Insects', 'Good'],
            rightCategories: ['Flowers', 'Bad'],
            instructions: newBlock.instructions
              .replace(/Press E for \w+ or Good/, 'Press E for Insects or Good')
              .replace(/Press I for \w+ or Bad/, 'Press I for Flowers or Bad'),
          };
        } else if (block.blockNumber === 6 || block.blockNumber === 7) {
          // Incompatible pairing with swapped targets: Flowers+Good on left
          newBlock = {
            ...newBlock,
            leftCategories: ['Flowers', 'Good'],
            rightCategories: ['Insects', 'Bad'],
            instructions: newBlock.instructions
              .replace(/Press E for \w+ or Good/, 'Press E for Flowers or Good')
              .replace(/Press I for \w+ or Bad/, 'Press I for Insects or Bad'),
          };
        }
      }
    }

    return newBlock;
  });
}

// Get all available IAT configurations
export const availableIATs: IATConfig[] = [flowersInsectsIAT];

// Get IAT by ID
export function getIATById(id: string): IATConfig | undefined {
  return availableIATs.find((iat) => iat.id === id);
}

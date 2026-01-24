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
    'This IAT measures the strength of automatic associations between Flowers/Insects and Good/Bad. Most people find it easier to associate Flowers with Good and Insects with Bad.',
  disclaimer: `IMPORTANT: This is an educational demonstration of the Implicit Association Test.

- Individual IAT results have LOW reliability (test-retest ~0.50)
- Your result may differ if you take the test again
- This is NOT a diagnosis of your beliefs or character
- Results reflect automatic associations, not conscious attitudes
- Many factors affect IAT scores: fatigue, distraction, familiarity with concepts

This tool is for SELF-REFLECTION only. Do not use it to make judgments about yourself or others.`,
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
// Per IAT methodology, half of participants should receive incompatible pairing first
// This function swaps the combined blocks (3-4 and 6-7) when counterbalanced=true
export function getCounterbalancedBlocks(
  config: IATConfig,
  counterbalanced: boolean
): IATBlockConfig[] {
  if (!counterbalanced) {
    // Standard order: compatible pairing first (blocks 3-4), then incompatible (blocks 6-7)
    return config.blocks;
  }

  // Counterbalanced order: incompatible pairing first
  // We need to swap the category assignments in blocks 3-4 and 6-7
  return config.blocks.map((block) => {
    // Blocks 1-2 and 5 remain unchanged (single category discrimination)
    if (block.blockNumber === 1 || block.blockNumber === 2 || block.blockNumber === 5) {
      return block;
    }

    // For combined blocks (3-4 and 6-7), swap the pairings
    // Original block 3-4: Flowers+Good vs Insects+Bad
    // Counterbalanced block 3-4: Insects+Good vs Flowers+Bad
    // (and vice versa for blocks 6-7)
    if (block.blockNumber === 3 || block.blockNumber === 4) {
      // Swap to incompatible pairing
      return {
        ...block,
        leftCategories: ['Insects', 'Good'],
        rightCategories: ['Flowers', 'Bad'],
        instructions: block.instructions
          .replace('Flowers or Good', 'Insects or Good')
          .replace('Insects or Bad', 'Flowers or Bad'),
      };
    }

    if (block.blockNumber === 6 || block.blockNumber === 7) {
      // Swap to compatible pairing
      return {
        ...block,
        leftCategories: ['Flowers', 'Good'],
        rightCategories: ['Insects', 'Bad'],
        instructions: block.instructions
          .replace('Insects or Good', 'Flowers or Good')
          .replace('Flowers or Bad', 'Insects or Bad'),
      };
    }

    return block;
  });
}

// Get all available IAT configurations
export const availableIATs: IATConfig[] = [flowersInsectsIAT];

// Get IAT by ID
export function getIATById(id: string): IATConfig | undefined {
  return availableIATs.find((iat) => iat.id === id);
}

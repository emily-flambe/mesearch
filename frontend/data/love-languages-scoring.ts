// Communication Styles Scoring Logic
// Count-based scoring for forced-choice format

import {
  type CommunicationStyle,
  type ForcedChoiceItem,
  items,
  allStyles,
  styleInfo,
} from './love-languages-items';

export interface ForcedChoiceResponse {
  itemId: number;
  selectedOption: 'A' | 'B';
}

export interface StyleScore {
  style: CommunicationStyle;
  name: string;
  count: number;        // Times selected
  percentage: number;   // Percentage of possible selections
  color: string;
}

export interface CommunicationStylesResults {
  primary: CommunicationStyle;
  secondary: CommunicationStyle;
  styles: StyleScore[];
  completedAt: string;
  totalQuestions: number;
}

// Get the item by ID
export function getItemById(itemId: number): ForcedChoiceItem | undefined {
  return items.find((item) => item.id === itemId);
}

// Get the selected style from a response
export function getSelectedStyle(response: ForcedChoiceResponse): CommunicationStyle | null {
  const item = getItemById(response.itemId);
  if (!item) return null;

  return response.selectedOption === 'A' ? item.optionA.style : item.optionB.style;
}

// Count how many times each style appears in the items (for percentage calculation)
// Each style appears in items paired with every other style, 3 times each
// With 5 styles, each style appears in 4 * 3 = 12 items
export function countStyleOccurrences(): Record<CommunicationStyle, number> {
  const counts: Record<CommunicationStyle, number> = {
    words: 0,
    time: 0,
    gifts: 0,
    service: 0,
    touch: 0,
  };

  for (const item of items) {
    counts[item.optionA.style]++;
    counts[item.optionB.style]++;
  }

  return counts;
}

// Get how many times each style could be selected (appears in items)
export function getMaxPossibleSelections(style: CommunicationStyle): number {
  const occurrences = countStyleOccurrences();
  return occurrences[style];
}

// Calculate style scores from responses
export function calculateStyleScores(
  responses: ForcedChoiceResponse[]
): StyleScore[] {
  // Count selections for each style
  const selectionCounts: Record<CommunicationStyle, number> = {
    words: 0,
    time: 0,
    gifts: 0,
    service: 0,
    touch: 0,
  };

  for (const response of responses) {
    const selectedStyle = getSelectedStyle(response);
    if (selectedStyle) {
      selectionCounts[selectedStyle]++;
    }
  }

  // Calculate scores with percentages
  const scores: StyleScore[] = allStyles.map((style) => {
    const count = selectionCounts[style];
    const maxPossible = getMaxPossibleSelections(style);
    const percentage = maxPossible > 0 ? Math.round((count / maxPossible) * 100) : 0;

    return {
      style,
      name: styleInfo[style].name,
      count,
      percentage,
      color: styleInfo[style].color,
    };
  });

  // Sort by count (descending), then by style name for consistency
  scores.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.style.localeCompare(b.style);
  });

  return scores;
}

// Calculate full results from responses
export function calculateResults(
  responses: ForcedChoiceResponse[]
): CommunicationStylesResults {
  const scores = calculateStyleScores(responses);

  // Primary is the highest scoring style
  // Secondary is the second highest
  const primary = scores[0]?.style || 'words';
  const secondary = scores[1]?.style || 'time';

  return {
    primary,
    secondary,
    styles: scores,
    completedAt: new Date().toISOString(),
    totalQuestions: responses.length,
  };
}

// Get interpretation for a style's score level
export function getScoreInterpretation(percentage: number): string {
  if (percentage >= 80) return 'Very Strong';
  if (percentage >= 60) return 'Strong';
  if (percentage >= 40) return 'Moderate';
  if (percentage >= 20) return 'Low';
  return 'Very Low';
}

// Serialize responses for localStorage
export function serializeResponses(responses: ForcedChoiceResponse[]): string {
  return JSON.stringify(responses);
}

// Deserialize responses from localStorage
export function deserializeResponses(json: string): ForcedChoiceResponse[] | null {
  try {
    return JSON.parse(json) as ForcedChoiceResponse[];
  } catch {
    return null;
  }
}

// Serialize results for localStorage
export function serializeResults(results: CommunicationStylesResults): string {
  return JSON.stringify(results);
}

// Deserialize results from localStorage
export function deserializeResults(json: string): CommunicationStylesResults | null {
  try {
    return JSON.parse(json) as CommunicationStylesResults;
  } catch {
    return null;
  }
}

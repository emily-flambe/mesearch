import { useEffect, useRef, useCallback, useState } from 'react';
import { getCategoryColor } from '../data/iat-items';

interface IATTrialProps {
  stimulus: string;
  correctCategory: string;
  leftCategories: string[];
  rightCategories: string[];
  onResponse: (responseKey: 'E' | 'I', responseTime: number) => void;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
}

export default function IATTrial({
  stimulus,
  correctCategory,
  leftCategories,
  rightCategories,
  onResponse,
  showFeedback,
  feedbackType,
}: IATTrialProps) {
  const stimulusOnsetRef = useRef<number>(0);
  const hasRespondedRef = useRef<boolean>(false);
  const [showErrorFeedback, setShowErrorFeedback] = useState(false);

  // Reset state when stimulus changes
  useEffect(() => {
    hasRespondedRef.current = false;
    setShowErrorFeedback(false);
    // Use performance.now() for millisecond-accurate timing
    stimulusOnsetRef.current = performance.now();
  }, [stimulus]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only respond to E or I keys
      const key = event.key.toLowerCase();
      if (key !== 'e' && key !== 'i') return;

      // Prevent double responses
      if (hasRespondedRef.current) return;

      // Calculate response time
      const responseTime = performance.now() - stimulusOnsetRef.current;
      const responseKey = key === 'e' ? 'E' : 'I';

      // Check if response is correct
      const isCorrect = responseKey === 'E'
        ? leftCategories.includes(correctCategory)
        : rightCategories.includes(correctCategory);

      if (!isCorrect && showFeedback) {
        // Show error feedback but don't record the response yet
        setShowErrorFeedback(true);
        return;
      }

      // Record the response
      hasRespondedRef.current = true;
      onResponse(responseKey as 'E' | 'I', responseTime);
    },
    [leftCategories, rightCategories, correctCategory, onResponse, showFeedback]
  );

  // Handle correct response after error
  const handleCorrectAfterError = useCallback(
    (event: KeyboardEvent) => {
      if (!showErrorFeedback) return;

      const key = event.key.toLowerCase();
      if (key !== 'e' && key !== 'i') return;

      const responseKey = key === 'e' ? 'E' : 'I';
      const isCorrect = responseKey === 'E'
        ? leftCategories.includes(correctCategory)
        : rightCategories.includes(correctCategory);

      if (isCorrect) {
        // Now record the full response time (including error correction)
        const responseTime = performance.now() - stimulusOnsetRef.current;
        hasRespondedRef.current = true;
        setShowErrorFeedback(false);
        onResponse(responseKey as 'E' | 'I', responseTime);
      }
    },
    [showErrorFeedback, leftCategories, rightCategories, correctCategory, onResponse]
  );

  // Set up keyboard listener
  useEffect(() => {
    const handler = showErrorFeedback ? handleCorrectAfterError : handleKeyDown;
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyDown, handleCorrectAfterError, showErrorFeedback]);

  // Determine the color for the stimulus based on its category
  const stimulusColor = getCategoryColor(correctCategory);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative"
      data-testid="iat-trial"
    >
      {/* Category labels - always visible at top */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-8 py-4">
        <div className="text-left">
          <div className="text-xs text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">
            Press E for:
          </div>
          <div className="space-y-1">
            {leftCategories.map((cat) => (
              <div
                key={cat}
                className="text-lg font-medium"
                style={{ color: getCategoryColor(cat) }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">
            Press I for:
          </div>
          <div className="space-y-1">
            {rightCategories.map((cat) => (
              <div
                key={cat}
                className="text-lg font-medium"
                style={{ color: getCategoryColor(cat) }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stimulus display */}
      <div
        className="text-4xl md:text-5xl font-bold text-center"
        style={{ color: stimulusColor }}
        data-testid="iat-stimulus"
      >
        {stimulus}
      </div>

      {/* Error feedback */}
      {showErrorFeedback && (
        <div
          className="absolute bottom-24 text-red-500 text-xl font-medium animate-pulse"
          data-testid="iat-error-feedback"
        >
          X - Wrong key! Press the correct key.
        </div>
      )}

      {/* Visual feedback for correct/incorrect */}
      {feedbackType === 'correct' && (
        <div
          className="absolute bottom-24 text-green-500 text-xl"
          data-testid="iat-correct-feedback"
        >
          Correct
        </div>
      )}
    </div>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getCategoryColor } from '../data/iat-items';

interface IATTrialProps {
  stimulus: string;
  correctCategory: string;
  leftCategories: string[];
  rightCategories: string[];
  onResponse: (responseKey: 'E' | 'I', responseTime: number, stimulus: string) => void;
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
  // Use ref for error state to avoid race condition with effect-based handler switching
  const showErrorFeedbackRef = useRef<boolean>(false);
  const [showErrorFeedback, setShowErrorFeedback] = useState(false);

  // Use refs to always have access to current props in keyboard handler
  // This avoids stale closure issues entirely
  const propsRef = useRef({
    stimulus,
    correctCategory,
    leftCategories,
    rightCategories,
    onResponse,
    showFeedback,
  });

  // Keep refs in sync with props - use useLayoutEffect to ensure synchronous update
  useLayoutEffect(() => {
    propsRef.current = {
      stimulus,
      correctCategory,
      leftCategories,
      rightCategories,
      onResponse,
      showFeedback,
    };
  });

  // Reset state when stimulus changes
  useEffect(() => {
    console.log('[IAT Debug] New stimulus:', stimulus, '- resetting state');
    hasRespondedRef.current = false;
    showErrorFeedbackRef.current = false;
    setShowErrorFeedback(false);
    // Use performance.now() for millisecond-accurate timing
    stimulusOnsetRef.current = performance.now();
  }, [stimulus]);

  // Set up keyboard listener - use stable callback that reads from refs
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key repeat events (when user holds key down)
      if (event.repeat) return;

      // Only respond to E or I keys
      const key = event.key.toLowerCase();
      if (key !== 'e' && key !== 'i') return;

      // Prevent double responses
      if (hasRespondedRef.current) return;

      // Debug logging - remove after fixing
      console.log('[IAT Debug] Key pressed:', key, 'hasResponded:', hasRespondedRef.current, 'showError:', showErrorFeedbackRef.current);

      // Get current props from ref
      const { stimulus: currentStimulus, correctCategory: currentCategory,
              leftCategories: left, rightCategories: right,
              onResponse: respond, showFeedback: feedback } = propsRef.current;

      // Calculate response time
      const responseTime = performance.now() - stimulusOnsetRef.current;
      const responseKey = key === 'e' ? 'E' : 'I';

      // Check if response is correct
      const isCorrect = responseKey === 'E'
        ? left.includes(currentCategory)
        : right.includes(currentCategory);

      // If we're in error state, only accept correct responses
      if (showErrorFeedbackRef.current) {
        if (isCorrect) {
          // Correct response after error - record it
          console.log('[IAT Debug] Correct after error, recording response');
          hasRespondedRef.current = true;
          showErrorFeedbackRef.current = false;
          setShowErrorFeedback(false);
          respond(responseKey as 'E' | 'I', responseTime, currentStimulus);
        } else {
          console.log('[IAT Debug] Still wrong key in error state, ignoring');
        }
        // Wrong response while in error state - ignore (keep showing error)
        return;
      }

      // Not in error state - normal processing
      if (!isCorrect && feedback) {
        // Show error feedback but don't record the response yet
        console.log('[IAT Debug] Wrong key, showing error feedback');
        showErrorFeedbackRef.current = true;
        setShowErrorFeedback(true);
        return;
      }

      // Record the response
      console.log('[IAT Debug] Correct! Recording response for:', currentStimulus);
      hasRespondedRef.current = true;
      respond(responseKey as 'E' | 'I', responseTime, currentStimulus);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty deps - handler reads from refs

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

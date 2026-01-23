import { test, expect } from '@playwright/test';

test.describe('ECR Attachment Style Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see 2D plot with both dimensions', async ({ page }) => {
    // Navigate to ECR assessment
    await page.goto('/test/ecr');

    // Verify intro page
    await expect(page.getByText('Attachment Style Assessment')).toBeVisible();
    await expect(page.getByText('ECR-RS')).toBeVisible();
    await expect(page.getByText('Research-Backed')).toBeVisible();

    // Start the assessment
    await page.getByTestId('ecr-start').click();

    // Answer all 9 questions with option 4 (Neutral)
    for (let i = 1; i <= 9; i++) {
      // Verify we're on question i
      await expect(page.getByTestId('ecr-progress')).toContainText(`${i} of 9`);

      // Click the 4th option (Neutral)
      await page.getByTestId('ecr-option-4').click();
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByTestId('ecr-view-results').click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/ecr/results');

    // Verify results are displayed
    await expect(page.getByTestId('ecr-results')).toBeVisible();

    // Verify 2D plot is present
    await expect(page.getByTestId('ecr-2d-plot')).toBeVisible();
    await expect(page.getByTestId('ecr-position-marker')).toBeVisible();

    // Verify both dimension scores are shown
    await expect(page.getByText('Attachment Anxiety')).toBeVisible();
    await expect(page.getByText('Attachment Avoidance')).toBeVisible();

    // Verify suggested style is shown (for educational context)
    await expect(page.getByTestId('ecr-suggested-style')).toBeVisible();

    // Verify the dimensional disclaimer is present
    await expect(page.getByText(/Attachment is best understood as existing on continuous dimensions/)).toBeVisible();

    // Verify citation is shown
    await expect(page.getByText(/Wei, M., Russell, D. W./)).toBeVisible();
  });

  test('shows correct style for secure pattern (low anxiety, low avoidance)', async ({ page }) => {
    await page.goto('/test/ecr');
    await page.getByTestId('ecr-start').click();

    // Items 1-4 are avoidance (reversed): high agreement = low avoidance
    // Items 5-9 are anxiety: low agreement = low anxiety
    const responses = [7, 7, 7, 7, 1, 1, 1, 1, 1]; // Secure pattern

    for (let i = 0; i < 9; i++) {
      await page.getByTestId(`ecr-option-${responses[i]}`).click();
    }

    await page.getByTestId('ecr-view-results').click();

    // Should show Secure style
    await expect(page.getByTestId('ecr-suggested-style')).toContainText('Secure');
  });

  test('shows correct style for fearful-avoidant pattern (high anxiety, high avoidance)', async ({ page }) => {
    await page.goto('/test/ecr');
    await page.getByTestId('ecr-start').click();

    // Items 1-4 are avoidance (reversed): low agreement = high avoidance
    // Items 5-9 are anxiety: high agreement = high anxiety
    const responses = [1, 1, 1, 1, 7, 7, 7, 7, 7]; // Fearful-avoidant pattern

    for (let i = 0; i < 9; i++) {
      await page.getByTestId(`ecr-option-${responses[i]}`).click();
    }

    await page.getByTestId('ecr-view-results').click();

    // Should show Fearful-Avoidant style
    await expect(page.getByTestId('ecr-suggested-style')).toContainText('Fearful-Avoidant');
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/ecr');
    await page.getByTestId('ecr-start').click();

    // Answer first 3 questions
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('ecr-option-4').click();
    }

    // Verify we're on question 4
    await expect(page.getByTestId('ecr-progress')).toContainText('4 of 9');

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/ecr');

    // Should see Resume Progress button
    await expect(page.getByTestId('ecr-resume')).toBeVisible();

    // Resume progress
    await page.getByTestId('ecr-resume').click();

    // Should be on question 4
    await expect(page.getByTestId('ecr-progress')).toContainText('4 of 9');
  });

  test('can navigate back to previous question', async ({ page }) => {
    await page.goto('/test/ecr');
    await page.getByTestId('ecr-start').click();

    // Answer first question
    await page.getByTestId('ecr-option-3').click();

    // Verify we're on question 2
    await expect(page.getByTestId('ecr-progress')).toContainText('2 of 9');

    // Go back
    await page.getByTestId('ecr-back').click();

    // Should be back on question 1
    await expect(page.getByTestId('ecr-progress')).toContainText('1 of 9');
  });

  test('ECR card is visible on homepage', async ({ page }) => {
    await page.goto('/');

    // Verify ECR test card is present
    await expect(page.getByText('Attachment Style')).toBeVisible();
    await expect(page.getByText('ECR-RS')).toBeVisible();
    await expect(page.getByText(/anxiety and avoidance/i)).toBeVisible();
  });

  test('uses 7-point Likert scale', async ({ page }) => {
    await page.goto('/test/ecr');
    await page.getByTestId('ecr-start').click();

    // Verify all 7 options are present
    await expect(page.getByTestId('ecr-option-1')).toBeVisible();
    await expect(page.getByTestId('ecr-option-2')).toBeVisible();
    await expect(page.getByTestId('ecr-option-3')).toBeVisible();
    await expect(page.getByTestId('ecr-option-4')).toBeVisible();
    await expect(page.getByTestId('ecr-option-5')).toBeVisible();
    await expect(page.getByTestId('ecr-option-6')).toBeVisible();
    await expect(page.getByTestId('ecr-option-7')).toBeVisible();

    // Verify scale labels
    await expect(page.getByText('Strongly Disagree')).toBeVisible();
    await expect(page.getByText('Strongly Agree')).toBeVisible();
  });
});

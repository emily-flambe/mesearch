import { test, expect } from '@playwright/test';

test.describe('Communication Styles Assessment', () => {
  test.describe('Homepage', () => {
    test('communication styles card is visible on homepage', async ({ page }) => {
      await page.goto('/');

      // Should see the Communication Styles test card
      await expect(page.getByRole('heading', { name: 'Communication Styles' })).toBeVisible();
      await expect(page.getByText('Five Styles')).toBeVisible();
      await expect(page.getByText('Discover how you prefer to give and receive appreciation')).toBeVisible();
    });
  });

  test.describe('Assessment Flow', () => {
    test('can start and complete the assessment', async ({ page }) => {
      await page.goto('/test/communication-styles');

      // Should see the intro page
      await expect(page.getByRole('heading', { name: 'Communication Styles' })).toBeVisible();
      await expect(page.getByText('Discover how you prefer to give and receive appreciation')).toBeVisible();

      // Start the assessment - wait for button to be ready
      const startButton = page.getByTestId('love-languages-start');
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Wait for first question to appear
      await expect(page.getByText('1 of 30')).toBeVisible();

      // Answer all 30 questions (alternating A and B to get varied results)
      for (let i = 0; i < 30; i++) {
        // Alternate between A and B options
        const option = i % 2 === 0 ? 'a' : 'b';
        await page.getByTestId(`love-languages-option-${option}`).click();
        // Wait for transition
        await page.waitForTimeout(200);
      }

      // Should see completion screen
      await expect(page.getByRole('heading', { name: 'Assessment Complete' })).toBeVisible();
      await expect(page.getByTestId('love-languages-view-results')).toBeVisible();
    });

    test('can view results after completing assessment', async ({ page }) => {
      await page.goto('/test/communication-styles');

      // Start the assessment - wait for button to be ready
      const startButton = page.getByTestId('love-languages-start');
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Wait for first question
      await expect(page.getByText('1 of 30')).toBeVisible();

      // Answer all questions with option A
      for (let i = 0; i < 30; i++) {
        await page.getByTestId('love-languages-option-a').click();
        await page.waitForTimeout(200);
      }

      // View results
      await page.getByTestId('love-languages-view-results').click();

      // Should see results page
      await expect(page.getByTestId('love-languages-results')).toBeVisible();
      await expect(page.getByText('Your Results')).toBeVisible();

      // Should show primary and secondary styles
      await expect(page.getByTestId('primary-style')).toBeVisible();
      await expect(page.getByTestId('secondary-style')).toBeVisible();

      // Should show complete profile ranking
      await expect(page.getByTestId('style-ranking')).toBeVisible();
    });

    test('shows all five communication styles in results', async ({ page }) => {
      await page.goto('/test/communication-styles');

      // Start and complete assessment - wait for button to be ready
      const startButton = page.getByTestId('love-languages-start');
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Wait for first question
      await expect(page.getByText('1 of 30')).toBeVisible();

      for (let i = 0; i < 30; i++) {
        await page.getByTestId('love-languages-option-a').click();
        await page.waitForTimeout(200);
      }

      await page.getByTestId('love-languages-view-results').click();

      // Should show all 5 styles
      await expect(page.getByTestId('style-words')).toBeVisible();
      await expect(page.getByTestId('style-time')).toBeVisible();
      await expect(page.getByTestId('style-gifts')).toBeVisible();
      await expect(page.getByTestId('style-service')).toBeVisible();
      await expect(page.getByTestId('style-touch')).toBeVisible();
    });

    test('progress is saved and can be resumed', async ({ page }) => {
      await page.goto('/test/communication-styles');

      // Start the assessment - wait for button to be ready
      const startButton = page.getByTestId('love-languages-start');
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Wait for first question
      await expect(page.getByText('1 of 30')).toBeVisible();

      // Answer first 5 questions
      for (let i = 0; i < 5; i++) {
        await page.getByTestId('love-languages-option-a').click();
        await page.waitForTimeout(200);
      }

      // Navigate away
      await page.goto('/');

      // Come back to the assessment
      await page.goto('/test/communication-styles');

      // Should see resume option
      await expect(page.getByTestId('love-languages-resume')).toBeVisible();
      await expect(page.getByTestId('love-languages-start-over')).toBeVisible();

      // Resume progress
      await page.getByTestId('love-languages-resume').click();

      // Should be at question 6 (showing "6 of 30")
      await expect(page.getByText('6 of 30')).toBeVisible();
    });

    test('can go back to previous question', async ({ page }) => {
      await page.goto('/test/communication-styles');

      // Start the assessment - wait for button to be ready
      const startButton = page.getByTestId('love-languages-start');
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Wait for first question
      await expect(page.getByText('1 of 30')).toBeVisible();

      // Answer first question
      await page.getByTestId('love-languages-option-a').click();
      await page.waitForTimeout(200);

      // Should be on question 2
      await expect(page.getByText('2 of 30')).toBeVisible();

      // Go back
      await page.getByTestId('love-languages-back').click();

      // Should be on question 1 again
      await expect(page.getByText('1 of 30')).toBeVisible();
    });
  });

  test.describe('Authenticated User', () => {
    test('logged in user can complete assessment and view results', async ({ page }) => {
      // Login first
      await page.goto('/api/auth/dev-login?email=user%2Btest@example.com');
      await expect(page).toHaveURL('/');

      // Navigate to assessment
      await page.goto('/test/communication-styles');

      // Start and complete assessment - wait for button to be ready
      const startButton = page.getByTestId('love-languages-start');
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Wait for first question
      await expect(page.getByText('1 of 30')).toBeVisible();

      for (let i = 0; i < 30; i++) {
        await page.getByTestId('love-languages-option-a').click();
        await page.waitForTimeout(200);
      }

      // View results
      await page.getByTestId('love-languages-view-results').click();
      await expect(page.getByTestId('love-languages-results')).toBeVisible();

      // Should show primary and secondary styles
      await expect(page.getByTestId('primary-style')).toBeVisible();
      await expect(page.getByTestId('secondary-style')).toBeVisible();
    });
  });

  test.describe('Direct URL Access', () => {
    test('redirects to assessment when accessing results without completing', async ({ page }) => {
      // Clear localStorage to ensure no saved results
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.removeItem('mesearch-communication-styles-results');
        localStorage.removeItem('mesearch-communication-styles-responses');
      });

      // Try to access results directly
      await page.goto('/test/communication-styles/results');

      // Should redirect to assessment page
      await expect(page).toHaveURL('/test/communication-styles');
    });
  });
});

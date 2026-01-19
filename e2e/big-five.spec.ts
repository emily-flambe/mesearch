import { test, expect } from '@playwright/test';

test.describe('Big Five Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see 5 domains in results', async ({ page }) => {
    // Navigate to Big Five assessment
    await page.goto('/test/big-five');

    // Verify intro page
    await expect(page.getByText('Big Five Personality Test')).toBeVisible();
    await expect(page.getByText('IPIP-NEO-120')).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 120 questions with "Moderately Accurate" (value 4)
    // The test shows "X of 120" in the header
    for (let i = 1; i <= 120; i++) {
      // Verify we're on question i
      await expect(page.getByText(`${i} of 120`)).toBeVisible();

      // Click the 4th option (Moderately Accurate)
      await page.getByRole('button', { name: 'Moderately Accurate' }).click();
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/big-five/results');

    // Verify all 5 dimensions are displayed (use first() since dimensions appear in chart and cards)
    await expect(page.getByText('Openness to Experience').first()).toBeVisible();
    await expect(page.getByText('Conscientiousness').first()).toBeVisible();
    await expect(page.getByText('Extraversion').first()).toBeVisible();
    await expect(page.getByText('Agreeableness').first()).toBeVisible();
    await expect(page.getByText('Neuroticism').first()).toBeVisible();

    // Verify results title is shown
    await expect(page.getByText('Big Five Personality Profile')).toBeVisible();
    await expect(page.getByText('Your Results')).toBeVisible();
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/big-five');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer first 5 questions
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: 'Moderately Accurate' }).click();
    }

    // Verify we're on question 6
    await expect(page.getByText('6 of 120')).toBeVisible();

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/big-five');

    // Should see Resume Progress button
    await expect(page.getByRole('button', { name: /Resume Progress/i })).toBeVisible();

    // Resume progress
    await page.getByRole('button', { name: /Resume Progress/i }).click();

    // Should be on question 6
    await expect(page.getByText('6 of 120')).toBeVisible();
  });
});

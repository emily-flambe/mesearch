import { test, expect } from '@playwright/test';

test.describe('HEXACO-60 Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see all 6 dimensions in results', async ({ page }) => {
    // Navigate to HEXACO assessment
    await page.goto('/hexaco');

    // Verify we're on the assessment page (HEXACO goes directly to questions, no intro)
    await expect(page.getByText('Question 1')).toBeVisible();

    // Answer all 60 questions with "Neutral" (value 3)
    for (let i = 1; i <= 60; i++) {
      // Verify we're on question i
      await expect(page.getByText(`${i} of 60`)).toBeVisible();

      // Click "Neutral" option
      await page.getByRole('button', { name: 'Neutral' }).click();
    }

    // On last question, need to click "View Results" button
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/hexaco/results');

    // Verify results header
    await expect(page.getByText('HEXACO-60 Profile')).toBeVisible();
    await expect(page.getByText('Your Results', { exact: true })).toBeVisible();

    // Verify all 6 dimensions are displayed
    await expect(page.getByText('Honesty-Humility').first()).toBeVisible();
    await expect(page.getByText('Emotionality').first()).toBeVisible();
    await expect(page.getByText('Extraversion').first()).toBeVisible();
    await expect(page.getByText('Agreeableness').first()).toBeVisible();
    await expect(page.getByText('Conscientiousness').first()).toBeVisible();
    await expect(page.getByText('Openness').first()).toBeVisible();

    // Verify HEXACO-specific elements
    await expect(page.getByText('Unique to HEXACO')).toBeVisible();
    await expect(page.getByText('The HEXACO Difference')).toBeVisible();
  });

  test('displays incomplete results message when visiting results without completing assessment', async ({
    page,
  }) => {
    // Navigate directly to results without completing assessment
    await page.goto('/hexaco/results');

    // Should see incomplete message
    await expect(page.getByText('Assessment Incomplete')).toBeVisible();
    await expect(page.getByText('No Results Found')).toBeVisible();

    // Should have link to start assessment
    await expect(page.getByRole('link', { name: /Start Assessment/i })).toBeVisible();
  });

  test('can navigate between questions using Previous/Next buttons', async ({ page }) => {
    // Navigate to HEXACO assessment
    await page.goto('/hexaco');

    // Answer first question
    await expect(page.getByText('1 of 60')).toBeVisible();
    await page.getByRole('button', { name: 'Agree', exact: true }).click();

    // Should auto-advance to question 2
    await expect(page.getByText('2 of 60')).toBeVisible();

    // Click Previous to go back
    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(page.getByText('1 of 60')).toBeVisible();

    // Previous should be disabled on first question
    const previousButton = page.getByRole('button', { name: 'Previous' });
    await expect(previousButton).toBeDisabled();
  });
});

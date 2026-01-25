import { test, expect } from '@playwright/test';

test.describe('Myers-Briggs Style Test (OEJTS)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('MBTI test card is visible on personality category page', async ({ page }) => {
    await page.goto('/tests/personality');

    // MBTI card should be visible
    await expect(page.getByRole('heading', { name: 'Myers-Briggs' })).toBeVisible();
    await expect(page.getByText("The world's most popular personality test")).toBeVisible();
  });

  test('can navigate to MBTI assessment and see intro', async ({ page }) => {
    await page.goto('/tests/personality');

    // Click on the MBTI test card (entire card is clickable)
    const mbtiCard = page.locator('a.card-premium', { hasText: 'Myers-Briggs' });
    await mbtiCard.click();

    // Should be on the MBTI intro page
    await expect(page).toHaveURL('/test/mbti');
    await expect(page.getByRole('heading', { name: 'Myers-Briggs Style Test' })).toBeVisible();

    // Check for key information
    await expect(page.getByText('Open Extended Jungian Type Scales (OEJTS)')).toBeVisible();
    await expect(page.getByText('This test contains 32 questions')).toBeVisible();
    await expect(page.getByText('39-76% of people')).toBeVisible(); // Reliability disclaimer
    await expect(page.getByTestId('mbti-start')).toBeVisible();
  });

  test('can start, answer questions, and go back', async ({ page }) => {
    await page.goto('/test/mbti');

    // Start the test
    await page.getByTestId('mbti-start').click();

    // Should see the first question
    await expect(page.getByText('1 of 32')).toBeVisible();
    await expect(page.getByText('Where do you fall between these two descriptions?')).toBeVisible();

    // Answer with option 3 (neutral)
    await page.getByTestId('mbti-option-3').click();

    // Should advance to question 2
    await expect(page.getByText('2 of 32')).toBeVisible();

    // Go back
    await page.getByRole('button', { name: /Previous Question/i }).click();

    // Should be back on question 1
    await expect(page.getByText('1 of 32')).toBeVisible();
  });

  test('can complete full assessment and see results', async ({ page }) => {
    await page.goto('/test/mbti');

    // Start the test
    await page.getByTestId('mbti-start').click();

    // Answer all 32 questions
    for (let i = 0; i < 32; i++) {
      // Vary answers to get interesting results
      const value = i < 8 ? 1 : i < 16 ? 5 : i < 24 ? 2 : 4;
      await page.getByTestId(`mbti-option-${value}`).click();
      await page.waitForTimeout(100);
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: 'View Results' }).click();

    // Should be on results page with all key elements
    await expect(page).toHaveURL('/test/mbti/results');
    await expect(page.getByTestId('mbti-results')).toBeVisible();

    // Should show all four dimensions
    await expect(page.getByText('Extraversion vs Introversion')).toBeVisible();
    await expect(page.getByText('Sensing vs Intuition')).toBeVisible();
    await expect(page.getByText('Thinking vs Feeling')).toBeVisible();
    await expect(page.getByText('Judging vs Perceiving')).toBeVisible();

    // Should show reliability disclaimer
    await expect(page.getByText('About Test Reliability')).toBeVisible();

    // Should show attribution
    await expect(page.getByText('Eric Jorgenson')).toBeVisible();
  });

  test('shows no results message when results page accessed directly', async ({ page }) => {
    // Clear any existing results first
    await page.goto('/test/mbti');
    await page.evaluate(() => {
      localStorage.removeItem('mesearch-mbti-results');
      localStorage.removeItem('mesearch-mbti-responses');
    });

    await page.goto('/test/mbti/results');

    // Should show no results message
    await expect(page.getByText('No Results Found')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Take the Test' })).toBeVisible();
  });
});

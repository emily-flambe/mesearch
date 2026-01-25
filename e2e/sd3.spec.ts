import { test, expect } from '@playwright/test';

test.describe('Short Dark Triad (SD3) Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see 3 traits in results', async ({ page }) => {
    // Navigate to SD3 assessment
    await page.goto('/test/sd3');

    // Verify intro page
    await expect(page.getByText('Short Dark Triad (SD3)')).toBeVisible();
    await expect(page.getByText('Jones & Paulhus (2014)')).toBeVisible();

    // Verify important context disclaimer is shown
    await expect(page.getByText('Important Context')).toBeVisible();
    await expect(page.getByText('normal personality variation')).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 27 questions with "Agree" (value 4)
    for (let i = 1; i <= 27; i++) {
      // Verify we're on question i
      await expect(page.getByTestId('sd3-progress')).toHaveText(`${i} of 27`);

      // Click the 4th option (Agree) using testid
      await page.getByTestId('sd3-option-4').click();
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/sd3/results');

    // Verify all 3 traits are displayed
    await expect(page.getByText('Machiavellianism').first()).toBeVisible();
    await expect(page.getByText('Narcissism').first()).toBeVisible();
    await expect(page.getByText('Psychopathy').first()).toBeVisible();

    // Verify results title is shown
    await expect(page.getByText('Short Dark Triad Profile')).toBeVisible();
    await expect(page.getByText('Your Results', { exact: true })).toBeVisible();

    // Verify critical framing disclaimer is shown in results
    await expect(page.getByText('Understanding Your Results')).toBeVisible();
    await expect(page.getByText('subclinical personality traits, not disorders')).toBeVisible();

    // Verify citation is shown
    await expect(
      page.getByText('Jones, D.N., & Paulhus, D.L. (2014)')
    ).toBeVisible();
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/sd3');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer first 5 questions using testid
    for (let i = 0; i < 5; i++) {
      await page.getByTestId('sd3-option-4').click();
    }

    // Verify we're on question 6
    await expect(page.getByTestId('sd3-progress')).toHaveText('6 of 27');

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/sd3');

    // Should see Resume Progress button
    await expect(page.getByRole('button', { name: /Resume Progress/i })).toBeVisible();

    // Resume progress
    await page.getByRole('button', { name: /Resume Progress/i }).click();

    // Should be on question 6
    await expect(page.getByTestId('sd3-progress')).toHaveText('6 of 27');
  });

  test('SD3 test card is visible on personality category page', async ({ page }) => {
    await page.goto('/tests/personality');

    // Verify the SD3 test card is displayed - scope to the card to avoid strict mode violations
    const sd3Card = page.locator('a.card-premium', { has: page.getByRole('heading', { name: 'Dark Triad' }) });
    await expect(sd3Card.getByRole('heading', { name: 'Dark Triad' })).toBeVisible();
    await expect(sd3Card.getByText('5 min', { exact: true })).toBeVisible();
    await expect(sd3Card.getByText('Machiavellianism, Narcissism, and Psychopathy')).toBeVisible();
  });

  test('can navigate to SD3 from personality category page', async ({ page }) => {
    await page.goto('/tests/personality');

    // Click on the SD3 test card (entire card is clickable)
    const sd3Card = page.locator('a.card-premium', { has: page.getByRole('heading', { name: 'Dark Triad' }) });
    await sd3Card.click();

    // Should be on SD3 assessment page
    await expect(page).toHaveURL('/test/sd3');
    await expect(page.getByText('Short Dark Triad (SD3)')).toBeVisible();
  });

  test('shows no results page when accessing results without completing test', async ({ page }) => {
    // Go directly to results page without completing test
    await page.goto('/test/sd3/results');

    // Should see "No Results Found" message
    await expect(page.getByText('No Results Found')).toBeVisible();
    await expect(page.getByRole('button', { name: /Take the Test/i })).toBeVisible();
  });

  test('displays trait level indicators in results', async ({ page }) => {
    // Complete the assessment first
    await page.goto('/test/sd3');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 27 questions using testid
    for (let i = 1; i <= 27; i++) {
      await page.getByTestId('sd3-option-4').click();
    }

    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify level indicators are shown (Low/Average/High)
    // At least one level should be visible
    const levelIndicators = page.locator('span', { hasText: /^(Low|Average|High)$/ });
    await expect(levelIndicators.first()).toBeVisible();
  });
});

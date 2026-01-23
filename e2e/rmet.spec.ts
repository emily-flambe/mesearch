import { test, expect } from '@playwright/test';

test.describe('RMET Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see results', async ({ page }) => {
    // Navigate to RMET assessment
    await page.goto('/test/rmet');

    // Verify intro page
    await expect(page.getByRole('heading', { name: 'Reading the Mind in the Eyes Test' })).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Should see practice question indicator
    await expect(page.getByText('Practice Question', { exact: true })).toBeVisible();

    // Click first option to complete practice (MRMET practice options)
    const practiceOptions = page.locator('button').filter({ hasText: /anxious|disappointed|shocked|concerned/i });
    await practiceOptions.first().click();
    // Click Continue after feedback
    await page.getByRole('button', { name: /Continue/i }).click();

    // Now in main assessment - answer all 37 questions (MRMET has 37 scored items)
    for (let i = 1; i <= 37; i++) {
      // Verify we're on question i
      await expect(page.getByText(`${i} of 37`)).toBeVisible();

      // Click the first option for each question
      const options = page.locator('main button').filter({ has: page.locator('span') });
      await options.first().click();
      // Click Continue after feedback
      await page.getByRole('button', { name: /Continue/i }).click();
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/rmet/results');

    // Verify results are displayed
    await expect(page.getByRole('heading', { name: 'Reading the Mind in the Eyes' })).toBeVisible();
    await expect(page.getByText('Your Results')).toBeVisible();
    await expect(page.getByText('of 37', { exact: true })).toBeVisible();
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/rmet');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Complete practice (MRMET practice options)
    const practiceOptions = page.locator('button').filter({ hasText: /anxious|disappointed|shocked|concerned/i });
    await practiceOptions.first().click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Answer first 5 questions
    for (let i = 0; i < 5; i++) {
      const options = page.locator('main button').filter({ has: page.locator('span') });
      await options.first().click();
      await page.getByRole('button', { name: /Continue/i }).click();
    }

    // Verify we're on question 6
    await expect(page.getByText('6 of 37')).toBeVisible();

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/rmet');

    // Should see Resume Progress button
    await expect(page.getByRole('button', { name: /Resume Progress/i })).toBeVisible();

    // Resume progress
    await page.getByRole('button', { name: /Resume Progress/i }).click();

    // Should be on question 6
    await expect(page.getByText('6 of 37')).toBeVisible();
  });

  test('displays MRMET stimulus images', async ({ page }) => {
    // Start assessment
    await page.goto('/test/rmet');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Complete practice to get to main assessment (MRMET practice options)
    const practiceOptions = page.locator('button').filter({ hasText: /anxious|disappointed|shocked|concerned/i });
    await practiceOptions.first().click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Should show actual MRMET stimulus image (no placeholder)
    await expect(page.locator('[data-testid="rmet-image"]')).toBeVisible();
    // Placeholder should NOT be visible when images load correctly
    await expect(page.locator('[data-testid="rmet-image-placeholder"]')).not.toBeVisible();
  });

  test('shows definition tooltip on hover for difficult words', async ({ page }) => {
    // Start assessment
    await page.goto('/test/rmet');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Complete practice (MRMET practice options)
    const practiceOptions = page.locator('button').filter({ hasText: /anxious|disappointed|shocked|concerned/i });
    await practiceOptions.first().click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Answer questions until we get to one with definitions
    for (let i = 0; i < 5; i++) {
      const options = page.locator('main button').filter({ has: page.locator('span') });
      await options.first().click();
      await page.getByRole('button', { name: /Continue/i }).click();
    }

    // Now on question 6, hover over a word with definition if present
    // Check that a word with dotted underline exists
    const wordWithDefinition = page.locator('span.border-dotted').first();
    if (await wordWithDefinition.count() > 0) {
      await wordWithDefinition.hover();
      // Tooltip should appear
      await expect(page.locator('.z-10').filter({ hasText: /./i })).toBeVisible();
    }
  });

  test('can go back to previous question', async ({ page }) => {
    // Start assessment
    await page.goto('/test/rmet');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Complete practice (MRMET practice options)
    const practiceOptions = page.locator('button').filter({ hasText: /anxious|disappointed|shocked|concerned/i });
    await practiceOptions.first().click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Answer first 2 questions
    for (let i = 0; i < 2; i++) {
      const options = page.locator('main button').filter({ has: page.locator('span') });
      await options.first().click();
      await page.getByRole('button', { name: /Continue/i }).click();
    }

    // Should be on question 3
    await expect(page.getByText('3 of 37')).toBeVisible();

    // Click back button
    await page.getByRole('button', { name: /Previous Question/i }).click();

    // Should be on question 2
    await expect(page.getByText('2 of 37')).toBeVisible();
  });

  test('displays RMET card on home page', async ({ page }) => {
    await page.goto('/');

    // Should see RMET test card
    await expect(page.getByRole('heading', { name: 'RMET' })).toBeVisible();
    await expect(page.getByText('Eyes Test')).toBeVisible();
    await expect(page.getByText('Social Cognition', { exact: false }).first()).toBeVisible();
  });

  test('results page shows item breakdown', async ({ page }) => {
    // Complete full assessment first
    await page.goto('/test/rmet');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Complete practice (MRMET practice options)
    const practiceOptions = page.locator('button').filter({ hasText: /anxious|disappointed|shocked|concerned/i });
    await practiceOptions.first().click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Answer all 37 questions quickly by clicking first option (MRMET has 37 scored items)
    for (let i = 1; i <= 37; i++) {
      const options = page.locator('main button').filter({ has: page.locator('span') });
      await options.first().click();
      await page.getByRole('button', { name: /Continue/i }).click();
    }

    // View results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Click to expand item breakdown
    await page.getByText('Item-by-Item Breakdown').click();

    // Should see item results
    await expect(page.getByText('#1', { exact: true })).toBeVisible();
    await expect(page.getByText('#37', { exact: true })).toBeVisible();
  });
});

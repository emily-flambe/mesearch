import { test, expect } from '@playwright/test';

test.describe('Enneagram Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see type with wing in results', async ({ page }) => {
    // Navigate to Enneagram assessment
    await page.goto('/test/enneagram');

    // Verify intro page
    await expect(page.getByText('Enneagram Assessment')).toBeVisible();
    await expect(
      page.getByText(/The Enneagram is a popular framework/)
    ).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 36 questions
    // The Enneagram test shows "Question X of 36" in the header
    for (let i = 1; i <= 36; i++) {
      // Verify we're on question i
      await expect(page.getByText(`Question ${i} of 36`)).toBeVisible();

      // Click "Agree" (value 4)
      await page.getByRole('button', { name: 'Agree', exact: true }).click();
    }

    // Should see results (Enneagram shows results inline, not on separate page)
    // Look for the primary type indicator
    await expect(page.getByText('Your Primary Type')).toBeVisible();

    // Verify a type number is shown (Type 1-9)
    // The result shows "Type X" where X is 1-9
    const typePattern = /Type [1-9]/;
    await expect(page.getByText(typePattern).first()).toBeVisible();

    // Verify wing label is shown (format: Xw[X-1 or X+1])
    // Wing labels like "1w9", "2w1", "4w5", etc.
    const wingPattern = /[1-9]w[1-9]/;
    await expect(page.getByText(wingPattern).first()).toBeVisible();

    // Verify type name is shown (e.g., "The Reformer", "The Helper", etc.)
    const typeNames = [
      'The Reformer',
      'The Helper',
      'The Achiever',
      'The Individualist',
      'The Investigator',
      'The Loyalist',
      'The Enthusiast',
      'The Challenger',
      'The Peacemaker',
    ];

    // At least one type name should be visible
    let foundTypeName = false;
    for (const typeName of typeNames) {
      const element = page.getByText(typeName);
      if ((await element.count()) > 0) {
        foundTypeName = true;
        break;
      }
    }
    expect(foundTypeName).toBe(true);

    // Verify disclaimer is shown (Enneagram isn't scientifically validated)
    await expect(
      page.getByText(/Not Scientifically Validated/i)
    ).toBeVisible();
  });

});

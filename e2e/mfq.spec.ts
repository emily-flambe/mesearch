import { test, expect } from '@playwright/test';

test.describe('Moral Foundations Questionnaire Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see 5 foundations in results', async ({ page }) => {
    // Navigate to MFQ assessment
    await page.goto('/test/mfq');

    // Verify intro page
    await expect(page.getByText('Moral Foundations Questionnaire')).toBeVisible();
    await expect(page.getByText('MFQ-30')).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 30 questions with "Somewhat relevant" or "Slightly agree" (value 3)
    // The test shows "X of 30" in the header
    for (let i = 1; i <= 30; i++) {
      // Verify we're on question i
      await expect(page.getByText(`${i} of 30`)).toBeVisible();

      // Click one of the middle options - try both likert scale texts
      const somewhereRelevant = page.getByRole('button', { name: 'Somewhat relevant' });
      const slightlyAgree = page.getByRole('button', { name: 'Slightly agree' });

      if (await somewhereRelevant.isVisible()) {
        await somewhereRelevant.click();
      } else {
        await slightlyAgree.click();
      }
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/mfq/results');

    // Verify all 5 foundations are displayed
    await expect(page.getByText('Care/Harm').first()).toBeVisible();
    await expect(page.getByText('Fairness/Cheating').first()).toBeVisible();
    await expect(page.getByText('Loyalty/Betrayal').first()).toBeVisible();
    await expect(page.getByText('Authority/Subversion').first()).toBeVisible();
    await expect(page.getByText('Purity/Degradation').first()).toBeVisible();

    // Verify results title is shown
    await expect(page.getByText('Moral Foundations Profile')).toBeVisible();
    await expect(page.getByText('Your Results')).toBeVisible();

    // Verify citation is present
    await expect(page.getByText('Graham, J., Haidt, J.')).toBeVisible();
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/mfq');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer first 5 questions
    for (let i = 0; i < 5; i++) {
      // Click one of the middle options
      const somewhereRelevant = page.getByRole('button', { name: 'Somewhat relevant' });
      const slightlyAgree = page.getByRole('button', { name: 'Slightly agree' });

      if (await somewhereRelevant.isVisible()) {
        await somewhereRelevant.click();
      } else {
        await slightlyAgree.click();
      }
    }

    // Verify we're on question 6
    await expect(page.getByText('6 of 30')).toBeVisible();

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/mfq');

    // Should see Resume Progress button
    await expect(page.getByRole('button', { name: /Resume Progress/i })).toBeVisible();

    // Resume progress
    await page.getByRole('button', { name: /Resume Progress/i }).click();

    // Should be on question 6
    await expect(page.getByText('6 of 30')).toBeVisible();
  });

  test('shows MFQ card on homepage', async ({ page }) => {
    await page.goto('/');

    // Verify the MFQ test card is visible
    await expect(page.getByText('Moral Foundations')).toBeVisible();
    await expect(page.getByText('MFQ-30')).toBeVisible();
    // Use more specific selector since multiple cards have "Ethics" keyword
    await expect(page.getByText('Ethics · Values · Politics')).toBeVisible();
  });

  test('displays different likert scales for relevance vs judgment questions', async ({ page }) => {
    // Start assessment
    await page.goto('/test/mfq');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // First question should be a relevance question with relevance-style options
    // Check for relevance-specific instruction text
    await expect(page.getByText(/relevant to your thinking/i)).toBeVisible();

    // Relevance questions should have "Not at all relevant" option
    await expect(page.getByRole('button', { name: 'Not at all relevant' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Extremely relevant' })).toBeVisible();

    // Answer all relevance questions (first 15, though they may be shuffled)
    // We'll just complete the test and verify both types appear
    let foundRelevance = false;
    let foundJudgment = false;

    for (let i = 0; i < 30; i++) {
      // Check which type of question this is
      const relevanceOption = page.getByRole('button', { name: 'Not at all relevant' });
      const judgmentOption = page.getByRole('button', { name: 'Strongly disagree' });

      if (await relevanceOption.isVisible()) {
        foundRelevance = true;
        await page.getByRole('button', { name: 'Somewhat relevant' }).click();
      } else if (await judgmentOption.isVisible()) {
        foundJudgment = true;
        await page.getByRole('button', { name: 'Slightly agree' }).click();
      }
    }

    // Verify we saw both types of questions
    expect(foundRelevance).toBe(true);
    expect(foundJudgment).toBe(true);
  });
});

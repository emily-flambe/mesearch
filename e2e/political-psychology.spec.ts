import { test, expect } from '@playwright/test';

test.describe('SDO7 (Social Dominance Orientation) Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see results with 2 dimensions', async ({ page }) => {
    // Navigate to SDO7 assessment
    await page.goto('/test/sdo7');

    // Verify intro page - title uses parentheses format
    await expect(page.getByRole('heading', { name: /Social Dominance Orientation/ })).toBeVisible();
    await expect(page.getByText('Ho et al. (2015)')).toBeVisible();

    // Verify important context disclaimer is shown
    await expect(page.getByText('What This Measures')).toBeVisible();
    await expect(page.getByText(/attitudes about group-based hierarchy/)).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 16 questions with "Neutral" (value 4)
    for (let i = 1; i <= 16; i++) {
      // Verify we're on question i
      await expect(page.getByTestId('sdo7-progress')).toHaveText(`${i} of 16`);

      // Click the neutral option using testid
      await page.getByTestId('sdo7-option-4').click();
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/sdo7/results');

    // Verify results title is shown
    await expect(page.getByText('Social Dominance Orientation Profile')).toBeVisible();
    await expect(page.getByText('Your Results', { exact: true })).toBeVisible();

    // Verify both dimensions are displayed
    await expect(page.getByText('Dominance').first()).toBeVisible();
    await expect(page.getByText('Anti-Egalitarianism').first()).toBeVisible();

    // Verify critical framing disclaimer is shown in results
    await expect(page.getByText('Understanding Your Results')).toBeVisible();
    // Use first() since the text appears both in disclaimer heading and explanatory paragraph
    await expect(page.getByText(/measures attitudes about group-based hierarchy/).first()).toBeVisible();

    // Verify citation is shown
    await expect(
      page.getByText(/Ho, A\.K\./).first()
    ).toBeVisible();
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/sdo7');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer first 5 questions using testid
    for (let i = 0; i < 5; i++) {
      await page.getByTestId('sdo7-option-4').click();
    }

    // Verify we're on question 6
    await expect(page.getByTestId('sdo7-progress')).toHaveText('6 of 16');

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/sdo7');

    // Should see Resume Progress button
    await expect(page.getByRole('button', { name: /Resume Progress/i })).toBeVisible();

    // Resume progress
    await page.getByRole('button', { name: /Resume Progress/i }).click();

    // Should be on question 6
    await expect(page.getByTestId('sdo7-progress')).toHaveText('6 of 16');
  });

  test('shows no results page when accessing results without completing test', async ({ page }) => {
    // Go directly to results page without completing test
    await page.goto('/test/sdo7/results');

    // Should see "No Results Found" message
    await expect(page.getByText('No Results Found')).toBeVisible();
    await expect(page.getByRole('button', { name: /Take the Test/i })).toBeVisible();
  });

  test('displays 7-point likert scale options', async ({ page }) => {
    // Start assessment
    await page.goto('/test/sdo7');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Verify all 7 likert options are visible
    await expect(page.getByRole('button', { name: 'Strongly Oppose' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Somewhat Oppose' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Slightly Oppose' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Neutral' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Slightly Favor' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Somewhat Favor' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Strongly Favor' })).toBeVisible();
  });
});

test.describe('RWA-VSA (Right-Wing Authoritarianism) Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see results with 3 dimensions', async ({ page }) => {
    // Navigate to RWA assessment
    await page.goto('/test/rwa');

    // Verify intro page
    await expect(page.getByRole('heading', { name: /Right-Wing Authoritarianism Scale/ })).toBeVisible();
    await expect(page.getByText('Very Short Scale (RWA-VSA)')).toBeVisible();

    // Verify important context disclaimer is shown
    await expect(page.getByText('Important Context')).toBeVisible();
    await expect(page.getByText(/attitudes about authority and tradition/)).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 6 questions with "Neutral" (value 0)
    for (let i = 1; i <= 6; i++) {
      // Verify we're on question i
      await expect(page.getByTestId('rwa-progress')).toHaveText(`${i} of 6`);

      // Click the neutral option using testid
      await page.getByTestId('rwa-option-0').click();
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/rwa/results');

    // Verify results title is shown
    await expect(page.getByText('Right-Wing Authoritarianism Profile')).toBeVisible();
    await expect(page.getByText('Your Results', { exact: true })).toBeVisible();

    // Verify all 3 dimensions are displayed
    await expect(page.getByText('Authoritarian Submission').first()).toBeVisible();
    await expect(page.getByText('Authoritarian Aggression').first()).toBeVisible();
    await expect(page.getByText('Conventionalism').first()).toBeVisible();

    // Verify critical framing disclaimer is shown in results
    await expect(page.getByText('Understanding Your Results')).toBeVisible();
    await expect(page.getByText(/measures attitudes about authority and tradition/).first()).toBeVisible();

    // Verify citation is shown
    await expect(
      page.getByText(/Bizumic, B\./).first()
    ).toBeVisible();
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/rwa');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer first 3 questions using testid
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('rwa-option-0').click();
    }

    // Verify we're on question 4
    await expect(page.getByTestId('rwa-progress')).toHaveText('4 of 6');

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/rwa');

    // Should see Resume Progress button
    await expect(page.getByRole('button', { name: /Resume Progress/i })).toBeVisible();

    // Resume progress
    await page.getByRole('button', { name: /Resume Progress/i }).click();

    // Should be on question 4
    await expect(page.getByTestId('rwa-progress')).toHaveText('4 of 6');
  });

  test('shows no results page when accessing results without completing test', async ({ page }) => {
    // Go directly to results page without completing test
    await page.goto('/test/rwa/results');

    // Should see "No Results Found" message
    await expect(page.getByText('No Results Found')).toBeVisible();
    await expect(page.getByRole('button', { name: /Take the Test/i })).toBeVisible();
  });

  test('displays 9-point likert scale options (-4 to +4)', async ({ page }) => {
    // Start assessment
    await page.goto('/test/rwa');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Verify all 9 likert options are visible using testids since button names include numeric values
    await expect(page.getByTestId('rwa-option--4')).toBeVisible();
    await expect(page.getByTestId('rwa-option--3')).toBeVisible();
    await expect(page.getByTestId('rwa-option--2')).toBeVisible();
    await expect(page.getByTestId('rwa-option--1')).toBeVisible();
    await expect(page.getByTestId('rwa-option-0')).toBeVisible();
    await expect(page.getByTestId('rwa-option-1')).toBeVisible();
    await expect(page.getByTestId('rwa-option-2')).toBeVisible();
    await expect(page.getByTestId('rwa-option-3')).toBeVisible();
    await expect(page.getByTestId('rwa-option-4')).toBeVisible();

    // Verify the label text is present
    await expect(page.getByText('Very Strongly Disagree')).toBeVisible();
    await expect(page.getByText('Very Strongly Agree')).toBeVisible();
  });

  test('displays overall RWA score out of 54', async ({ page }) => {
    // Complete the assessment first
    await page.goto('/test/rwa');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 6 questions with neutral (0)
    for (let i = 1; i <= 6; i++) {
      await page.getByTestId('rwa-option-0').click();
    }

    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify the score is shown out of 54
    await expect(page.getByText('out of 54')).toBeVisible();
  });
});

test.describe('MFQ-2 (Moral Foundations Questionnaire 2) Assessment', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete assessment and see results with 6 foundations and radar chart', async ({ page }) => {
    // Navigate to MFQ2 assessment
    await page.goto('/test/mfq2');

    // Verify intro page
    await expect(page.getByRole('heading', { name: /Moral Foundations Questionnaire 2/ })).toBeVisible();
    await expect(page.getByText('MFQ-2', { exact: true })).toBeVisible();

    // Verify all 6 foundations are mentioned on intro
    await expect(page.getByRole('main').getByText('Care')).toBeVisible();
    await expect(page.getByRole('main').getByText('Equality')).toBeVisible();
    await expect(page.getByRole('main').getByText('Proportionality')).toBeVisible();
    await expect(page.getByRole('main').getByText('Loyalty')).toBeVisible();
    await expect(page.getByRole('main').getByText('Authority')).toBeVisible();
    await expect(page.getByRole('main').getByText('Purity')).toBeVisible();

    // Start the assessment
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 36 questions with "Moderately describes me" (value 2)
    for (let i = 1; i <= 36; i++) {
      // Verify we're on question i (progress indicator without testid)
      await expect(page.getByText(`${i} of 36`)).toBeVisible();

      // Click the middle option
      await page.getByRole('button', { name: 'Moderately describes me' }).click();
    }

    // Should see completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();

    // Click to view results
    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify we're on the results page
    await expect(page).toHaveURL('/test/mfq2/results');

    // Verify results title is shown
    await expect(page.getByText('Moral Foundations Profile')).toBeVisible();
    await expect(page.getByText('Your Results', { exact: true })).toBeVisible();

    // Verify all 6 foundations are displayed in results
    await expect(page.getByText('Care').first()).toBeVisible();
    await expect(page.getByText('Equality').first()).toBeVisible();
    await expect(page.getByText('Proportionality').first()).toBeVisible();
    await expect(page.getByText('Loyalty').first()).toBeVisible();
    await expect(page.getByText('Authority').first()).toBeVisible();
    await expect(page.getByText('Purity').first()).toBeVisible();

    // Verify radar chart is displayed (the one with width="320" is the radar chart)
    await expect(page.locator('svg[width="320"]')).toBeVisible();

    // Verify higher-order summary is shown
    await expect(page.getByText('Individualizing vs. Binding')).toBeVisible();
    await expect(page.getByText('Individualizing').first()).toBeVisible();
    await expect(page.getByText('Binding').first()).toBeVisible();

    // Verify citation is shown
    await expect(
      page.getByText(/Atari, M\./).first()
    ).toBeVisible();
  });

  test('can resume progress after navigating away', async ({ page }) => {
    // Start assessment
    await page.goto('/test/mfq2');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer first 10 questions
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: 'Moderately describes me' }).click();
    }

    // Verify we're on question 11
    await expect(page.getByText('11 of 36')).toBeVisible();

    // Navigate away
    await page.goto('/');

    // Return to assessment
    await page.goto('/test/mfq2');

    // Should see Resume Progress button
    await expect(page.getByRole('button', { name: /Resume Progress/i })).toBeVisible();

    // Resume progress
    await page.getByRole('button', { name: /Resume Progress/i }).click();

    // Should be on question 11
    await expect(page.getByText('11 of 36')).toBeVisible();
  });

  test('shows no results page when accessing results without completing test', async ({ page }) => {
    // Go directly to results page without completing test
    await page.goto('/test/mfq2/results');

    // Should see "No Results Found" message
    await expect(page.getByText('No Results Found')).toBeVisible();
    await expect(page.getByRole('button', { name: /Take the Test/i })).toBeVisible();
  });

  test('displays 5-point likert scale options (0-4)', async ({ page }) => {
    // Start assessment
    await page.goto('/test/mfq2');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Verify all 5 likert options are visible
    await expect(page.getByRole('button', { name: 'Does not describe me at all' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Slightly describes me' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Moderately describes me' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Describes me fairly well' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Describes me extremely well' })).toBeVisible();
  });

  test('displays instruction text for each question', async ({ page }) => {
    // Start assessment
    await page.goto('/test/mfq2');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Verify instruction text is shown
    await expect(page.getByText('How well does the following statement describe you?')).toBeVisible();
  });

  test('displays political lean indicators in results', async ({ page }) => {
    // Complete the assessment first
    await page.goto('/test/mfq2');
    await page.getByRole('button', { name: /Begin Assessment/i }).click();

    // Answer all 36 questions
    for (let i = 1; i <= 36; i++) {
      await page.getByRole('button', { name: 'Moderately describes me' }).click();
    }

    await page.getByRole('button', { name: /View Results/i }).click();

    // Verify political lean badges are shown
    await expect(page.getByText('Liberal-leaning').first()).toBeVisible();
    await expect(page.getByText('Conservative-leaning').first()).toBeVisible();
  });
});

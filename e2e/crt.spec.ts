import { test, expect } from '@playwright/test';

test.describe('Cognitive Reflection Test (CRT)', () => {
  test.describe('Navigation and Intro', () => {
    test('CRT card is visible on homepage', async ({ page }) => {
      await page.goto('/');

      // Should see the CRT test card
      await expect(page.getByRole('heading', { name: 'CRT' })).toBeVisible();
      await expect(page.getByText('Cognitive Reflection')).toBeVisible();
    });

    test('can navigate to CRT from homepage', async ({ page }) => {
      await page.goto('/');

      // Find the CRT card and click the begin button
      const crtCard = page.locator('.card-premium', { has: page.getByRole('heading', { name: 'CRT' }) });
      await crtCard.getByRole('link', { name: 'Begin Assessment' }).click();

      // Should see the CRT intro page
      await expect(page.getByRole('heading', { name: 'Cognitive Reflection Test' })).toBeVisible();
      await expect(page.getByText('CRT-7')).toBeVisible();
    });

    test('intro page shows test information', async ({ page }) => {
      await page.goto('/test/crt');

      // Should see intro content
      await expect(page.getByRole('heading', { name: 'Cognitive Reflection Test' })).toBeVisible();
      await expect(page.getByText('7 questions')).toBeVisible();
      await expect(page.getByTestId('crt-start')).toBeVisible();
    });
  });

  test.describe('Prior Exposure Question', () => {
    test('shows prior exposure question before starting', async ({ page }) => {
      await page.goto('/test/crt');

      // Start the test
      await page.getByTestId('crt-start').click();

      // Should see prior exposure question
      await expect(page.getByText('Have you seen these problems before?')).toBeVisible();
      await expect(page.getByTestId('crt-exposure-none')).toBeVisible();
      await expect(page.getByTestId('crt-exposure-some')).toBeVisible();
      await expect(page.getByTestId('crt-exposure-most')).toBeVisible();
      await expect(page.getByTestId('crt-exposure-all')).toBeVisible();
    });

    test('can select prior exposure and proceed', async ({ page }) => {
      await page.goto('/test/crt');

      // Start the test
      await page.getByTestId('crt-start').click();

      // Select no prior exposure
      await page.getByTestId('crt-exposure-none').click();

      // Should now see first question
      await expect(page.getByText('1 of 7')).toBeVisible();
      await expect(page.getByTestId('crt-answer-input')).toBeVisible();
    });
  });

  test.describe('Assessment Flow', () => {
    test('can answer questions with free text input', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Should see first question (Bat and Ball)
      await expect(page.getByText('Bat and Ball')).toBeVisible();
      await expect(page.getByTestId('crt-answer-input')).toBeVisible();

      // Enter an answer
      await page.getByTestId('crt-answer-input').fill('5');
      await page.getByTestId('crt-submit').click();

      // Should move to second question
      await expect(page.getByText('2 of 7')).toBeVisible();
    });

    test('can go back to previous question', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer first question
      await page.getByTestId('crt-answer-input').fill('5');
      await page.getByTestId('crt-submit').click();

      // Should be on second question
      await expect(page.getByText('2 of 7')).toBeVisible();

      // Go back
      await page.getByText('Previous Question').click();

      // Should be back on first question with previous answer
      await expect(page.getByText('1 of 7')).toBeVisible();
      await expect(page.getByTestId('crt-answer-input')).toHaveValue('5');
    });

    test('submit button is disabled without answer', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Submit button should be disabled
      await expect(page.getByTestId('crt-submit')).toBeDisabled();

      // Type something
      await page.getByTestId('crt-answer-input').fill('test');

      // Submit button should be enabled
      await expect(page.getByTestId('crt-submit')).toBeEnabled();
    });

    test('can complete entire assessment', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer all 7 questions with correct answers
      const correctAnswers = ['5', '5', '47', '4', '29', '20', 'Emily'];

      for (let i = 0; i < 7; i++) {
        await page.getByTestId('crt-answer-input').fill(correctAnswers[i]);
        await page.getByTestId('crt-submit').click();

        // Wait for next question or results
        if (i < 6) {
          await expect(page.getByText(`${i + 2} of 7`)).toBeVisible();
        }
      }

      // Should see results
      await expect(page.getByTestId('crt-results')).toBeVisible();
    });
  });

  test.describe('Results Display', () => {
    test('shows correct score for all correct answers', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer all questions correctly
      const correctAnswers = ['5', '5', '47', '4', '29', '20', 'Emily'];

      for (const answer of correctAnswers) {
        await page.getByTestId('crt-answer-input').fill(answer);
        await page.getByTestId('crt-submit').click();
        await page.waitForTimeout(100);
      }

      // Should see results with 7/7 score
      await expect(page.getByTestId('crt-results')).toBeVisible();
      // Check for score indicators
      await expect(page.getByText('/7')).toBeVisible();
    });

    test('shows intuitive score for intuitive wrong answers', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer with intuitive (wrong) answers
      const intuitiveAnswers = ['10', '100', '24', '9', '30', '10', 'June'];

      for (const answer of intuitiveAnswers) {
        await page.getByTestId('crt-answer-input').fill(answer);
        await page.getByTestId('crt-submit').click();
        await page.waitForTimeout(100);
      }

      // Should see 0/7 score with intuitive count of 7
      await expect(page.getByTestId('crt-results')).toBeVisible();
      // The intuitive score should show 7
      await expect(page.getByTestId('crt-intuitive-score')).toHaveText('7');
    });

    test('shows explanations for wrong answers', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer first question incorrectly, rest correctly
      await page.getByTestId('crt-answer-input').fill('10'); // Wrong
      await page.getByTestId('crt-submit').click();

      const correctRest = ['5', '47', '4', '29', '20', 'Emily'];
      for (const answer of correctRest) {
        await page.waitForTimeout(100);
        await page.getByTestId('crt-answer-input').fill(answer);
        await page.getByTestId('crt-submit').click();
      }

      // Should see explanation for first question (which was wrong)
      await expect(page.getByTestId('crt-results')).toBeVisible();
      await expect(page.getByText('Explanation:').first()).toBeVisible();
    });

    test('shows prior exposure warning when applicable', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and indicate prior exposure
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-all').click();

      // Answer all questions
      const answers = ['5', '5', '47', '4', '29', '20', 'Emily'];
      for (const answer of answers) {
        await page.getByTestId('crt-answer-input').fill(answer);
        await page.getByTestId('crt-submit').click();
        await page.waitForTimeout(100);
      }

      // Should see prior exposure note
      await expect(page.getByTestId('crt-results')).toBeVisible();
      await expect(page.getByText('prior exposure', { exact: false })).toBeVisible();
    });
  });

  test.describe('Answer Validation', () => {
    test('accepts various forms of correct answers', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer with variations - "5 cents" for bat and ball
      await page.getByTestId('crt-answer-input').fill('5 cents');
      await page.getByTestId('crt-submit').click();

      // "5 minutes" for widgets
      await page.waitForTimeout(100);
      await page.getByTestId('crt-answer-input').fill('5 minutes');
      await page.getByTestId('crt-submit').click();

      // "47 days" for lily pad
      await page.waitForTimeout(100);
      await page.getByTestId('crt-answer-input').fill('47 days');
      await page.getByTestId('crt-submit').click();

      // "4 days" for drinking
      await page.waitForTimeout(100);
      await page.getByTestId('crt-answer-input').fill('4 days');
      await page.getByTestId('crt-submit').click();

      // "29 students" for class
      await page.waitForTimeout(100);
      await page.getByTestId('crt-answer-input').fill('29 students');
      await page.getByTestId('crt-submit').click();

      // "$20" for pig
      await page.waitForTimeout(100);
      await page.getByTestId('crt-answer-input').fill('$20');
      await page.getByTestId('crt-submit').click();

      // "emily" (lowercase) for Emily's father
      await page.waitForTimeout(100);
      await page.getByTestId('crt-answer-input').fill('emily');
      await page.getByTestId('crt-submit').click();

      // Should have all 7 correct - check reflective score shows 7
      await expect(page.getByTestId('crt-results')).toBeVisible();
      await expect(page.getByTestId('crt-reflective-score')).toHaveText('7');
    });
  });

  test.describe('Progress Saving', () => {
    test('saves progress to localStorage', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer first two questions
      await page.getByTestId('crt-answer-input').fill('5');
      await page.getByTestId('crt-submit').click();
      await page.waitForTimeout(100);

      await page.getByTestId('crt-answer-input').fill('5');
      await page.getByTestId('crt-submit').click();

      // Navigate away and come back
      await page.goto('/');
      await page.goto('/test/crt');

      // Should see resume option
      await expect(page.getByTestId('crt-resume')).toBeVisible();
    });

    test('can resume saved progress', async ({ page }) => {
      await page.goto('/test/crt');

      // Start and skip exposure question
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      // Answer first question
      await page.getByTestId('crt-answer-input').fill('5');
      await page.getByTestId('crt-submit').click();
      await page.waitForTimeout(100);

      // Navigate away and come back
      await page.goto('/');
      await page.goto('/test/crt');

      // Resume
      await page.getByTestId('crt-resume').click();

      // Should be on question 2
      await expect(page.getByText('2 of 7')).toBeVisible();
    });
  });

  test.describe('Authenticated User', () => {
    test('saves results to backend when logged in', async ({ page }) => {
      // Login
      await page.goto('/api/auth/dev-login?email=user%2Btest@example.com');
      await expect(page).toHaveURL('/');

      // Go to CRT
      await page.goto('/test/crt');

      // Complete the test
      await page.getByTestId('crt-start').click();
      await page.getByTestId('crt-exposure-none').click();

      const answers = ['5', '5', '47', '4', '29', '20', 'Emily'];
      for (const answer of answers) {
        await page.getByTestId('crt-answer-input').fill(answer);
        await page.getByTestId('crt-submit').click();
        await page.waitForTimeout(100);
      }

      // Results should be visible
      await expect(page.getByTestId('crt-results')).toBeVisible();

      // Check results history
      await page.goto('/my-results');

      // Should see CRT in the results (use first() since there may be multiple)
      await expect(page.getByRole('heading', { name: 'CRT' }).first()).toBeVisible();
    });
  });
});

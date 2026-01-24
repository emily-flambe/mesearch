import { test, expect } from '@playwright/test';

test.describe('Mini-Test Feature Flag', () => {
  test.describe('Regular Users (No Access)', () => {
    test('mini-test section is NOT visible on tests page for regular users', async ({ page }) => {
      // Login as a regular user (not admin, no +test in email)
      await page.goto('/api/auth/dev-login?email=regular@example.com');
      await expect(page).toHaveURL('/');

      // Go to tests page where mini-test section would be displayed
      await page.goto('/tests');

      // Mini-test section should NOT be visible
      await expect(page.getByTestId('mini-test-section')).not.toBeVisible();
    });

    test('mini-test direct URL shows Coming Soon for regular users', async ({ page }) => {
      // Login as a regular user
      await page.goto('/api/auth/dev-login?email=regular@example.com');
      await expect(page).toHaveURL('/');

      // Try to access mini-test directly
      await page.goto('/test/mini-test');

      // Should see Coming Soon page
      await expect(page.getByRole('heading', { name: 'Coming Soon' })).toBeVisible();
    });

    test('unauthenticated users cannot see mini-test', async ({ page }) => {
      await page.goto('/tests');

      // Mini-test section should NOT be visible
      await expect(page.getByTestId('mini-test-section')).not.toBeVisible();
    });
  });

  test.describe('Test Users (+test email)', () => {
    test('mini-test section IS visible for test users', async ({ page }) => {
      // Login with +test in email (URL encode the + as %2B)
      await page.goto('/api/auth/dev-login?email=user%2Btest@example.com');
      await expect(page).toHaveURL('/');

      // Go to tests page where mini-test section is displayed
      await page.goto('/tests');

      // Mini-test section should be visible
      await expect(page.getByTestId('mini-test-section')).toBeVisible();
    });

    test('test user can start and complete mini-test', async ({ page }) => {
      // Login with +test in email (URL encode the + as %2B)
      await page.goto('/api/auth/dev-login?email=user%2Btest@example.com');
      await expect(page).toHaveURL('/');

      // Navigate to mini-test
      await page.goto('/test/mini-test');

      // Should see the intro page
      await expect(page.getByRole('heading', { name: 'Mini-Test' })).toBeVisible();
      await expect(page.getByText('Debug / Testing Only')).toBeVisible();

      // Start the test
      await page.getByTestId('mini-test-start').click();

      // Answer all 5 questions with "Moderately Accurate" (value 4)
      for (let i = 0; i < 5; i++) {
        await page.getByTestId('mini-test-option-4').click();
        // Wait for transition
        await page.waitForTimeout(300);
      }

      // Should see results
      await expect(page.getByTestId('mini-test-results')).toBeVisible();
      await expect(page.getByText('Your Results')).toBeVisible();

      // Should show all 5 dimensions
      await expect(page.getByText('Openness')).toBeVisible();
      await expect(page.getByText('Conscientiousness')).toBeVisible();
      await expect(page.getByText('Extraversion')).toBeVisible();
      await expect(page.getByText('Agreeableness')).toBeVisible();
      await expect(page.getByText('Neuroticism')).toBeVisible();
    });
  });

  test.describe('Admin User', () => {
    test('mini-test section IS visible for admin user', async ({ page }) => {
      // Login as admin
      await page.goto('/api/auth/dev-login?email=emily.cogsdill@gmail.com');
      await expect(page).toHaveURL('/');

      // Go to tests page where mini-test section is displayed
      await page.goto('/tests');

      // Mini-test section should be visible
      await expect(page.getByTestId('mini-test-section')).toBeVisible();
    });

    test('admin can access mini-test directly', async ({ page }) => {
      // Login as admin
      await page.goto('/api/auth/dev-login?email=emily.cogsdill@gmail.com');
      await expect(page).toHaveURL('/');

      // Navigate to mini-test
      await page.goto('/test/mini-test');

      // Should see the mini-test page, not Coming Soon
      await expect(page.getByRole('heading', { name: 'Mini-Test' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Coming Soon' })).not.toBeVisible();
    });
  });

  test.describe('Mini-Test Results History', () => {
    test('mini-test results appear in history after completion', async ({ page }) => {
      // Login with +test in email (URL encode the + as %2B)
      await page.goto('/api/auth/dev-login?email=user%2Btest@example.com');
      await expect(page).toHaveURL('/');

      // Navigate to mini-test
      await page.goto('/test/mini-test');

      // Start the test
      await page.getByTestId('mini-test-start').click();

      // Answer all 5 questions with "Moderately Accurate" (value 4)
      for (let i = 0; i < 5; i++) {
        await page.getByTestId('mini-test-option-4').click();
        // Wait for transition
        await page.waitForTimeout(300);
      }

      // Should see results
      await expect(page.getByTestId('mini-test-results')).toBeVisible();

      // Navigate to results history
      await page.goto('/my-results');

      // Should see Mini-Test in the results (use first() since there may be multiple)
      await expect(page.getByRole('heading', { name: 'Mini-Test' }).first()).toBeVisible();
    });

    test('View Details link shows result detail page', async ({ page }) => {
      // Login with +test in email (URL encode the + as %2B)
      await page.goto('/api/auth/dev-login?email=user%2Btest@example.com');
      await expect(page).toHaveURL('/');

      // Complete a mini-test first to ensure there's a result
      await page.goto('/test/mini-test');
      await page.getByTestId('mini-test-start').click();
      for (let i = 0; i < 5; i++) {
        await page.getByTestId('mini-test-option-4').click();
        await page.waitForTimeout(300);
      }
      await expect(page.getByTestId('mini-test-results')).toBeVisible();

      // Navigate to results history
      await page.goto('/my-results');

      // Should see Mini-Test result
      await expect(page.getByRole('heading', { name: 'Mini-Test' }).first()).toBeVisible();

      // Click the View Details link for the first result
      await page.getByRole('link', { name: 'View Details' }).first().click();

      // Should be on the result detail page with /results/ in URL
      await expect(page).toHaveURL(/\/results\/.+/);

      // Should see the result detail content
      await expect(page.getByTestId('result-detail-content')).toBeVisible();

      // Should see Result Details as the heading and Mini-Test as the test type label
      await expect(page.getByRole('heading', { name: 'Result Details' })).toBeVisible();
      await expect(page.getByText('Mini-Test')).toBeVisible();

      // Should see dimension scores
      await expect(page.getByText('Dimension Scores')).toBeVisible();
    });
  });
});

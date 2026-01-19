import { test, expect } from '@playwright/test';

test.describe('Mini-Test Feature Flag', () => {
  test.describe('Regular Users (No Access)', () => {
    test('mini-test section is NOT visible on homepage for regular users', async ({ page }) => {
      // Login as a regular user (not admin, no +test in email)
      await page.goto('/api/auth/dev-login?email=regular@example.com');
      await expect(page).toHaveURL('/');

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
      await page.goto('/');

      // Mini-test section should NOT be visible
      await expect(page.getByTestId('mini-test-section')).not.toBeVisible();
    });
  });

  test.describe('Test Users (+test email)', () => {
    test('mini-test section IS visible for test users', async ({ page }) => {
      // Login with +test in email (URL encode the + as %2B)
      await page.goto('/api/auth/dev-login?email=user%2Btest@example.com');
      await expect(page).toHaveURL('/');

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
});

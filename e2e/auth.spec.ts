import { test, expect } from '@playwright/test';

test.describe('Authentication - Unauthenticated', () => {
  test('homepage loads with Sign In link', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page.getByRole('link', { name: 'Mesearch' })).toBeVisible();

    // Check for Sign In link (when not logged in)
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });

  test('Sign In link points to dev-login on localhost', async ({ page }) => {
    await page.goto('/');

    const signInLink = page.getByRole('link', { name: 'Sign In' });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/api/auth/dev-login');
  });

  test('my-results page shows auth prompt when not logged in', async ({ page }) => {
    await page.goto('/my-results');

    // Should show authentication required message
    await expect(page.getByRole('heading', { name: 'Authentication Required' })).toBeVisible();
    await expect(page.getByText('Use the link in the header')).toBeVisible();

    // Sign In should be in the header (via UserMenu)
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });
});

test.describe('Authentication - Dev Login Flow', () => {
  test('dev-login sets cookie and redirects to home', async ({ page }) => {
    // Navigate to dev-login endpoint
    await page.goto('/api/auth/dev-login');

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // After redirect, Sign In should no longer be visible (user is logged in)
    await expect(page.getByRole('link', { name: 'Sign In' })).not.toBeVisible();
  });

  test('dev-login with custom email', async ({ page }) => {
    // Navigate to dev-login with custom email
    await page.goto('/api/auth/dev-login?email=test@example.com');

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // User should be logged in - Sign In link should not be visible
    await expect(page.getByRole('link', { name: 'Sign In' })).not.toBeVisible();
  });

  test('logged in user sees user menu with initial', async ({ page }) => {
    // Login first
    await page.goto('/api/auth/dev-login?email=jane@example.com');
    await expect(page).toHaveURL('/');

    // Should see a user menu button with the initial 'J'
    await expect(page.getByRole('button').filter({ hasText: 'J' })).toBeVisible();
  });

  test('user menu shows Settings link', async ({ page }) => {
    // Login first
    await page.goto('/api/auth/dev-login?email=test@example.com');
    await expect(page).toHaveURL('/');

    // Click user menu to open dropdown
    await page.getByRole('button').filter({ hasText: 'T' }).click();

    // Should see Settings link in dropdown (My Results moved to main nav as "Results")
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  });

  test('Results link is visible in main nav when logged in', async ({ page }) => {
    // Login first
    await page.goto('/api/auth/dev-login?email=test@example.com');
    await expect(page).toHaveURL('/');

    // Should see Results link in the main nav
    await expect(page.getByRole('link', { name: 'Results' })).toBeVisible();
  });

  test('logout clears session', async ({ page }) => {
    // Login first
    await page.goto('/api/auth/dev-login');
    await expect(page).toHaveURL('/');

    // Click user menu to open dropdown
    await page.getByRole('button').filter({ hasText: 'D' }).click();

    // Click Sign Out
    await page.getByRole('button', { name: 'Sign Out' }).click();

    // Sign In link should reappear
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });
});

test.describe('Authenticated User - My Results', () => {
  test('logged in user can access my-results page', async ({ page }) => {
    // Login first
    await page.goto('/api/auth/dev-login');
    await expect(page).toHaveURL('/');

    // Navigate to my-results
    await page.goto('/my-results');

    // Should see Results History heading (not sign-in prompt)
    await expect(page.getByRole('heading', { name: 'Results History' })).toBeVisible();

    // Should NOT see authentication required message
    await expect(page.getByRole('heading', { name: 'Authentication Required' })).not.toBeVisible();
  });

  test('new user sees empty results state', async ({ page }) => {
    // Login with a new unique email
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await page.goto(`/api/auth/dev-login?email=${encodeURIComponent(uniqueEmail)}`);

    // Navigate to my-results
    await page.goto('/my-results');

    // Should see "No Results Yet" message
    await expect(page.getByRole('heading', { name: 'No Results Yet' })).toBeVisible();
    await expect(page.getByText('Complete a personality test to see your results here')).toBeVisible();
  });
});

test.describe('Anonymous User Flow', () => {
  test('can take Enneagram test without logging in', async ({ page }) => {
    // Navigate to the Enneagram test page
    await page.goto('/test/enneagram');

    // Should be on the test intro page
    await expect(page.getByRole('heading', { name: 'Enneagram Assessment' })).toBeVisible();

    // Can start the test
    await page.getByRole('button', { name: 'Begin Assessment' }).click();

    // Should see first question
    await expect(page.getByText('Question 1')).toBeVisible();
  });
});

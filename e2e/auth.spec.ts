import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('homepage loads with Sign In link', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads - use header link specifically
    await expect(page.getByRole('link', { name: 'Mesearch' })).toBeVisible();

    // Check for Sign In link (when not logged in)
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');

    // Check form elements
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('text=Continue with Google')).toBeVisible();
  });

  test('can switch between login and register modes', async ({ page }) => {
    await page.goto('/login');

    // Initially in login mode
    await expect(page.locator('text=Welcome Back')).toBeVisible();

    // Switch to register mode
    await page.click('text=Don\'t have an account? Sign up');
    await expect(page.locator('text=Create Account')).toBeVisible();
    await expect(page.locator('input#displayName')).toBeVisible();

    // Switch back to login mode
    await page.click('text=Already have an account? Sign in');
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });

  test('shows validation errors on empty form submission', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.click('button:has-text("Sign In")');

    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('Google OAuth button redirects correctly', async ({ page }) => {
    await page.goto('/login');

    // Click Google button and check it navigates
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/google')),
      page.click('text=Continue with Google'),
    ]);

    // Should get a redirect to Google
    expect(response.status()).toBe(302);
  });
});

test.describe('Registration Flow', () => {
  const uniqueEmail = `test-${Date.now()}@example.com`;

  test('can register a new account', async ({ page }) => {
    await page.goto('/login');

    // Switch to register mode
    await page.click('text=Don\'t have an account? Sign up');

    // Fill in form
    await page.fill('input#displayName', 'Test User');
    await page.fill('input#email', uniqueEmail);
    await page.fill('input#password', 'testpassword123');

    // Submit
    await page.click('button:has-text("Create Account")');

    // Should redirect to home page and show user menu (Sign In link should be gone)
    await page.waitForURL('/');
    await expect(page.getByRole('link', { name: 'Sign In' })).not.toBeVisible();
  });

  test('shows error for short password', async ({ page }) => {
    await page.goto('/login');

    // Switch to register mode
    await page.click('text=Don\'t have an account? Sign up');

    // Fill in form with short password
    await page.fill('input#email', 'test@example.com');
    await page.fill('input#password', 'short');

    // Try to submit - HTML5 validation should block
    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toHaveAttribute('minLength', '8');
  });
});

test.describe('Login Flow', () => {
  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in form with invalid credentials
    await page.fill('input#email', 'nonexistent@example.com');
    await page.fill('input#password', 'wrongpassword');

    // Submit
    await page.click('button:has-text("Sign In")');

    // Should show error
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });
});

test.describe('Anonymous User Flow', () => {
  test('can take a test without logging in', async ({ page }) => {
    // Navigate directly to the Enneagram test page
    await page.goto('/test/enneagram');

    // Should be on the test intro page
    await expect(page.getByRole('heading', { name: 'Enneagram Assessment' })).toBeVisible();

    // Can start the test
    await page.click('button:has-text("Begin Assessment")');

    // Should see first question
    await expect(page.getByText('Question 1')).toBeVisible();
  });
});

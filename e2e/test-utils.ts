import { test as base, expect } from '@playwright/test';

const TEST_USER_EMAIL = 'test-e2e@localhost';

// Extended test fixture with authentication via dev-login cookie
export const test = base.extend<{ authContext: { email: string } }>({
  authContext: async ({ context }, use) => {
    // Set the dev_user_email cookie directly (same as /api/auth/dev-login sets)
    await context.addCookies([{
      name: 'dev_user_email',
      value: encodeURIComponent(TEST_USER_EMAIL),
      domain: 'localhost',
      path: '/',
    }]);

    await use({ email: TEST_USER_EMAIL });
  },
});

export { expect, TEST_USER_EMAIL };

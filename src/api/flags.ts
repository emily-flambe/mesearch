// Feature flags API
import { Hono } from 'hono';
import type { Env } from '../types';

const flags = new Hono<{ Bindings: Env }>();

const ADMIN_EMAIL = 'emily.cogsdill@gmail.com';

function isAdminOrTestUser(email: string | null): boolean {
  if (!email) return false;
  return email === ADMIN_EMAIL || email.includes('+test');
}

// GET /api/flags - Get feature flags for current user
flags.get('/', async (c) => {
  // Get current user email
  const accessEmail = c.req.header('Cf-Access-Authenticated-User-Email');
  const cookies = c.req.header('Cookie') || '';
  const devEmailMatch = cookies.match(/dev_user_email=([^;]+)/);
  const devEmail = devEmailMatch ? decodeURIComponent(devEmailMatch[1]) : null;
  const email = accessEmail || devEmail;

  const isPrivileged = isAdminOrTestUser(email);

  // Return flags based on user privileges
  const featureFlags = {
    mini_test: isPrivileged,
  };

  return c.json({ data: featureFlags, error: null });
});

export default flags;

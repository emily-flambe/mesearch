// Auth API routes - uses Cloudflare Access for authentication
import { Hono } from 'hono';
import type { Env, User } from '../types';

const auth = new Hono<{ Bindings: Env }>();

// Helper to generate unique IDs
function generateId(): string {
  return crypto.randomUUID();
}

// GET /api/auth/me - Get current user
// When protected by Cloudflare Access, reads Cf-Access-Authenticated-User-Email header
// For local dev, falls back to dev-login cookie
auth.get('/me', async (c) => {
  // Check for Cloudflare Access header (production)
  const accessEmail = c.req.header('Cf-Access-Authenticated-User-Email');

  // Check for dev cookie (local development)
  const cookies = c.req.header('Cookie') || '';
  const devEmailMatch = cookies.match(/dev_user_email=([^;]+)/);
  const devEmail = devEmailMatch ? decodeURIComponent(devEmailMatch[1]) : null;

  const email = accessEmail || devEmail;

  if (!email) {
    return c.json({ data: null, error: null }); // Not logged in, but not an error
  }

  // Find or create user
  let user = await c.env.DB.prepare(
    'SELECT id, email, display_name, avatar_url, created_at FROM users WHERE email = ?'
  ).bind(email).first();

  if (!user) {
    // Auto-create user on first login
    const userId = generateId();
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, email_verified)
      VALUES (?, ?, 1)
    `).bind(userId, email).run();

    user = { id: userId, email, display_name: null, avatar_url: null, created_at: Date.now() };
  }

  return c.json({ data: user, error: null });
});

// GET /api/auth/dev-login - Development-only login (sets a cookie)
auth.get('/dev-login', async (c) => {
  const url = new URL(c.req.url);
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if (!isLocalDev) {
    return c.json({
      data: null,
      error: { message: 'Not available in production', code: 'NOT_FOUND' }
    }, 404);
  }

  const email = c.req.query('email') || 'dev@localhost';

  // Set a simple cookie for dev
  const cookie = `dev_user_email=${encodeURIComponent(email)}; Path=/; HttpOnly; SameSite=Lax`;

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': cookie,
    },
  });
});

// POST /api/auth/logout - Clear session
auth.post('/logout', (c) => {
  // Clear dev cookie
  const clearCookie = 'dev_user_email=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';

  // For Cloudflare Access, user would need to go to Access logout URL
  // But clearing the dev cookie handles local dev
  c.header('Set-Cookie', clearCookie);
  return c.json({ data: { success: true }, error: null });
});

// DELETE /api/auth/account - Delete user account and all data
auth.delete('/account', async (c) => {
  const accessEmail = c.req.header('Cf-Access-Authenticated-User-Email');
  const cookies = c.req.header('Cookie') || '';
  const devEmailMatch = cookies.match(/dev_user_email=([^;]+)/);
  const devEmail = devEmailMatch ? decodeURIComponent(devEmailMatch[1]) : null;

  const email = accessEmail || devEmail;

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  // Delete user (CASCADE will delete results)
  await c.env.DB.prepare('DELETE FROM users WHERE email = ?').bind(email).run();

  // Clear dev cookie
  c.header('Set-Cookie', 'dev_user_email=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');

  return c.json({ data: { success: true }, error: null });
});

export default auth;

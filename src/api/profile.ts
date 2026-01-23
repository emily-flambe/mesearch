// Profile API routes - protected by Cloudflare Access
import { Hono } from 'hono';
import type { Env, User } from '../types';

const profile = new Hono<{ Bindings: Env }>();

// Helper to get user email from Cloudflare Access header or dev cookie
function getUserEmail(c: { req: { header: (name: string) => string | undefined } }): string | null {
  const accessEmail = c.req.header('Cf-Access-Authenticated-User-Email');
  if (accessEmail) return accessEmail;

  const cookies = c.req.header('Cookie') || '';
  const devEmailMatch = cookies.match(/dev_user_email=([^;]+)/);
  return devEmailMatch ? decodeURIComponent(devEmailMatch[1]) : null;
}

// Username validation regex: 3-30 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphens
const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

function isValidUsername(username: string): boolean {
  if (username.length < 3 || username.length > 30) return false;
  if (!USERNAME_REGEX.test(username)) return false;
  if (username.includes('--')) return false; // No consecutive hyphens
  return true;
}

// GET /api/profile - Get current user's profile
profile.get('/', async (c) => {
  const email = getUserEmail(c);

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const user = await c.env.DB.prepare(
    'SELECT id, email, display_name, avatar_url, username, is_public, created_at FROM users WHERE email = ?'
  ).bind(email).first<User>();

  if (!user) {
    return c.json({
      data: null,
      error: { message: 'User not found', code: 'NOT_FOUND' }
    }, 404);
  }

  return c.json({
    data: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      username: user.username,
      is_public: Boolean(user.is_public),
      created_at: user.created_at,
    },
    error: null
  });
});

// PATCH /api/profile - Update current user's profile
profile.patch('/', async (c) => {
  const email = getUserEmail(c);

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const user = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first<{ id: string }>();

  if (!user) {
    return c.json({
      data: null,
      error: { message: 'User not found', code: 'NOT_FOUND' }
    }, 404);
  }

  const body = await c.req.json<{
    display_name?: string;
    username?: string;
    is_public?: boolean;
  }>();

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (body.display_name !== undefined) {
    updates.push('display_name = ?');
    values.push(body.display_name);
  }

  if (body.username !== undefined) {
    const username = body.username.toLowerCase().trim();

    if (username && !isValidUsername(username)) {
      return c.json({
        data: null,
        error: {
          message: 'Invalid username. Must be 3-30 characters, lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen.',
          code: 'INVALID_USERNAME'
        }
      }, 400);
    }

    // Check if username is already taken (by another user)
    if (username) {
      const existing = await c.env.DB.prepare(
        'SELECT id FROM users WHERE username = ? AND id != ?'
      ).bind(username, user.id).first();

      if (existing) {
        return c.json({
          data: null,
          error: { message: 'Username is already taken', code: 'USERNAME_TAKEN' }
        }, 409);
      }
    }

    updates.push('username = ?');
    values.push(username || null as unknown as string);
  }

  if (body.is_public !== undefined) {
    updates.push('is_public = ?');
    values.push(body.is_public ? 1 : 0);
  }

  if (updates.length === 0) {
    return c.json({
      data: null,
      error: { message: 'No fields to update', code: 'NO_UPDATES' }
    }, 400);
  }

  updates.push('updated_at = unixepoch()');
  values.push(user.id);

  await c.env.DB.prepare(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...values).run();

  // Fetch updated user
  const updatedUser = await c.env.DB.prepare(
    'SELECT id, email, display_name, avatar_url, username, is_public, created_at FROM users WHERE id = ?'
  ).bind(user.id).first<User>();

  return c.json({
    data: {
      id: updatedUser!.id,
      email: updatedUser!.email,
      display_name: updatedUser!.display_name,
      avatar_url: updatedUser!.avatar_url,
      username: updatedUser!.username,
      is_public: Boolean(updatedUser!.is_public),
      created_at: updatedUser!.created_at,
    },
    error: null
  });
});

// GET /api/profile/check-username/:username - Check if username is available
profile.get('/check-username/:username', async (c) => {
  const email = getUserEmail(c);

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const username = c.req.param('username').toLowerCase().trim();

  if (!isValidUsername(username)) {
    return c.json({
      data: { available: false, reason: 'invalid' },
      error: null
    });
  }

  // Get current user to exclude them from the check
  const currentUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first<{ id: string }>();

  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE username = ? AND id != ?'
  ).bind(username, currentUser?.id || '').first();

  return c.json({
    data: {
      available: !existing,
      reason: existing ? 'taken' : null
    },
    error: null
  });
});

export default profile;

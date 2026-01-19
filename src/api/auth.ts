// Auth API routes
import { Hono } from 'hono';
import type { Env, User } from '../types';
import {
  createToken,
  generateId,
  createSessionCookie,
  clearSessionCookie,
  getSessionFromCookie,
  verifyToken,
  hashPassword,
  verifyPassword,
} from '../lib/auth';
import {
  getGoogleAuthUrl,
  exchangeGoogleCode,
  getGoogleUserInfo,
  GoogleOAuthConfig,
} from '../lib/oauth/google';
import { OAuthStateManager } from '../lib/oauth/state';

const auth = new Hono<{ Bindings: Env }>();

// Helper to check if request is over HTTPS (for cookie Secure flag)
function isSecureRequest(c: { req: { url: string } }): boolean {
  const url = new URL(c.req.url);
  return url.protocol === 'https:';
}

// Helper to get OAuth redirect URI from request
function getRedirectUri(requestUrl: string): string {
  const url = new URL(requestUrl);
  return `${url.origin}/api/auth/google/callback`;
}

// GET /api/auth/google - Initiate Google OAuth
auth.get('/google', async (c) => {
  const stateManager = new OAuthStateManager(c.env.JWT_SECRET);
  const state = await stateManager.createState('google');

  const config: GoogleOAuthConfig = {
    clientId: c.env.GOOGLE_CLIENT_ID,
    clientSecret: c.env.GOOGLE_CLIENT_SECRET,
    redirectUri: getRedirectUri(c.req.url),
  };

  const authUrl = getGoogleAuthUrl(config, state);
  return c.redirect(authUrl);
});

// GET /api/auth/google/callback - Handle Google OAuth callback
auth.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');

  if (!code || !state) {
    return c.redirect('/login?error=missing_params');
  }

  const stateManager = new OAuthStateManager(c.env.JWT_SECRET);
  try {
    await stateManager.verifyState(state, 'google');
  } catch {
    return c.redirect('/login?error=invalid_state');
  }

  try {
    const config: GoogleOAuthConfig = {
      clientId: c.env.GOOGLE_CLIENT_ID,
      clientSecret: c.env.GOOGLE_CLIENT_SECRET,
      redirectUri: getRedirectUri(c.req.url),
    };

    const tokens = await exchangeGoogleCode(code, config);
    const userInfo = await getGoogleUserInfo(tokens.access_token);

    if (!userInfo.email_verified) {
      return c.redirect('/login?error=email_not_verified');
    }

    // Check if user exists by Google ID or email
    let user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE google_id = ? OR email = ?'
    ).bind(userInfo.sub, userInfo.email).first<User>();

    if (user) {
      // Update Google ID if not set (account linking)
      if (!user.google_id) {
        await c.env.DB.prepare(
          'UPDATE users SET google_id = ?, avatar_url = COALESCE(avatar_url, ?), email_verified = 1, updated_at = unixepoch() WHERE id = ?'
        ).bind(userInfo.sub, userInfo.picture, user.id).run();
      }
    } else {
      // Create new user
      const userId = generateId();

      await c.env.DB.prepare(`
        INSERT INTO users (id, email, display_name, avatar_url, google_id, email_verified)
        VALUES (?, ?, ?, ?, ?, 1)
      `).bind(userId, userInfo.email, userInfo.name, userInfo.picture, userInfo.sub).run();

      user = { id: userId, email: userInfo.email } as User;
    }

    // Create session token
    const token = await createToken(user.id, c.env.JWT_SECRET);

    // Set cookie and redirect
    const secure = isSecureRequest(c);
    const cookie = createSessionCookie(token, secure);

    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': cookie,
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return c.redirect('/login?error=oauth_failed');
  }
});

// POST /api/auth/register - Register with email/password
auth.post('/register', async (c) => {
  const body = await c.req.json<{ email: string; password: string; displayName?: string }>();
  const { email, password, displayName } = body;

  if (!email || !password) {
    return c.json({
      data: null,
      error: { message: 'Email and password are required', code: 'MISSING_FIELDS' }
    }, 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return c.json({
      data: null,
      error: { message: 'Invalid email format', code: 'INVALID_EMAIL' }
    }, 400);
  }

  // Validate password length
  if (password.length < 8) {
    return c.json({
      data: null,
      error: { message: 'Password must be at least 8 characters', code: 'PASSWORD_TOO_SHORT' }
    }, 400);
  }

  // Check if user already exists
  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();

  if (existingUser) {
    return c.json({
      data: null,
      error: { message: 'Email already registered', code: 'EMAIL_EXISTS' }
    }, 400);
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const userId = generateId();

  await c.env.DB.prepare(`
    INSERT INTO users (id, email, password_hash, display_name, email_verified)
    VALUES (?, ?, ?, ?, 0)
  `).bind(userId, email, passwordHash, displayName || null).run();

  // Create session token
  const token = await createToken(userId, c.env.JWT_SECRET);
  const secure = isSecureRequest(c);
  const cookie = createSessionCookie(token, secure);

  c.header('Set-Cookie', cookie);
  return c.json({
    data: { id: userId, email, display_name: displayName || null },
    error: null
  }, 201);
});

// POST /api/auth/login - Login with email/password
auth.post('/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({
      data: null,
      error: { message: 'Email and password are required', code: 'MISSING_FIELDS' }
    }, 400);
  }

  // Find user by email
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first<User>();

  if (!user || !user.password_hash) {
    return c.json({
      data: null,
      error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' }
    }, 401);
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return c.json({
      data: null,
      error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' }
    }, 401);
  }

  // Create session token
  const token = await createToken(user.id, c.env.JWT_SECRET);
  const secure = isSecureRequest(c);
  const cookie = createSessionCookie(token, secure);

  c.header('Set-Cookie', cookie);
  return c.json({
    data: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url
    },
    error: null
  });
});

// POST /api/auth/logout - Clear session
auth.post('/logout', (c) => {
  const secure = isSecureRequest(c);
  c.header('Set-Cookie', clearSessionCookie(secure));
  return c.json({ data: { success: true }, error: null });
});

// GET /api/auth/me - Get current user
auth.get('/me', async (c) => {
  const cookieHeader = c.req.header('Cookie');
  const token = getSessionFromCookie(cookieHeader);

  if (!token) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const payload = await verifyToken(token, c.env.JWT_SECRET);

  if (!payload) {
    return c.json({
      data: null,
      error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' }
    }, 401);
  }

  const user = await c.env.DB.prepare(
    'SELECT id, email, display_name, avatar_url, email_verified, created_at FROM users WHERE id = ?'
  ).bind(payload.userId).first();

  if (!user) {
    return c.json({
      data: null,
      error: { message: 'User not found', code: 'USER_NOT_FOUND' }
    }, 401);
  }

  return c.json({ data: user, error: null });
});

// GET /api/auth/dev-login - Development-only login (bypasses OAuth)
auth.get('/dev-login', async (c) => {
  const url = new URL(c.req.url);
  const isLocalDev = url.protocol === 'http:';

  if (!isLocalDev) {
    return c.json({
      data: null,
      error: { message: 'Not found', code: 'NOT_FOUND' }
    }, 404);
  }

  // Find or create dev user
  const devEmail = 'dev@localhost';
  let user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(devEmail).first<User>();

  if (!user) {
    const userId = generateId();
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, display_name, email_verified)
      VALUES (?, ?, ?, 1)
    `).bind(userId, devEmail, 'Dev User').run();
    user = { id: userId, email: devEmail } as User;
  }

  // Create session token
  const token = await createToken(user.id, c.env.JWT_SECRET);
  const cookie = createSessionCookie(token, false);

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': cookie,
    },
  });
});

// DELETE /api/auth/account - Delete user account and all data
auth.delete('/account', async (c) => {
  const cookieHeader = c.req.header('Cookie');
  const token = getSessionFromCookie(cookieHeader);

  if (!token) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const payload = await verifyToken(token, c.env.JWT_SECRET);

  if (!payload) {
    return c.json({
      data: null,
      error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' }
    }, 401);
  }

  // Delete user (CASCADE will delete results)
  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(payload.userId).run();

  // Clear session cookie
  const secure = isSecureRequest(c);
  c.header('Set-Cookie', clearSessionCookie(secure));

  return c.json({ data: { success: true }, error: null });
});

export default auth;

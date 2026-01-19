// Results API routes - protected by Cloudflare Access
import { Hono } from 'hono';
import type { Env, TestResult } from '../types';

const results = new Hono<{ Bindings: Env }>();

// Helper to generate unique IDs
function generateId(): string {
  return crypto.randomUUID();
}

// Helper to get user email from Cloudflare Access header or dev cookie
function getUserEmail(c: { req: { header: (name: string) => string | undefined } }): string | null {
  // Check for Cloudflare Access header (production)
  const accessEmail = c.req.header('Cf-Access-Authenticated-User-Email');
  if (accessEmail) return accessEmail;

  // Check for dev cookie (local development)
  const cookies = c.req.header('Cookie') || '';
  const devEmailMatch = cookies.match(/dev_user_email=([^;]+)/);
  return devEmailMatch ? decodeURIComponent(devEmailMatch[1]) : null;
}

// Helper to get or create user by email
async function getOrCreateUser(email: string, db: D1Database): Promise<string> {
  const user = await db.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first<{ id: string }>();

  if (user) return user.id;

  // Auto-create user
  const userId = generateId();
  await db.prepare(`
    INSERT INTO users (id, email, email_verified)
    VALUES (?, ?, 1)
  `).bind(userId, email).run();

  return userId;
}

// GET /api/results - Get user's past results
results.get('/', async (c) => {
  const email = getUserEmail(c);

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const userId = await getOrCreateUser(email, c.env.DB);
  const testType = c.req.query('test_type');

  let query = 'SELECT * FROM results WHERE user_id = ?';
  const params: string[] = [userId];

  if (testType) {
    query += ' AND test_type = ?';
    params.push(testType);
  }

  query += ' ORDER BY completed_at DESC';

  const userResults = await c.env.DB.prepare(query).bind(...params).all<TestResult>();

  return c.json({
    data: userResults.results.map(r => ({
      ...r,
      scores: JSON.parse(r.scores)
    })),
    error: null
  });
});

// GET /api/results/:id - Get a specific result
results.get('/:id', async (c) => {
  const email = getUserEmail(c);
  const resultId = c.req.param('id');

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const userId = await getOrCreateUser(email, c.env.DB);

  const result = await c.env.DB.prepare(
    'SELECT * FROM results WHERE id = ? AND user_id = ?'
  ).bind(resultId, userId).first<TestResult>();

  if (!result) {
    return c.json({
      data: null,
      error: { message: 'Result not found', code: 'NOT_FOUND' }
    }, 404);
  }

  return c.json({
    data: {
      ...result,
      scores: JSON.parse(result.scores)
    },
    error: null
  });
});

// POST /api/results - Save a test result
results.post('/', async (c) => {
  const email = getUserEmail(c);

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const userId = await getOrCreateUser(email, c.env.DB);

  const body = await c.req.json<{ test_type: string; scores: Record<string, unknown> }>();
  const { test_type, scores } = body;

  if (!test_type || !scores) {
    return c.json({
      data: null,
      error: { message: 'test_type and scores are required', code: 'MISSING_FIELDS' }
    }, 400);
  }

  const resultId = generateId();
  const scoresJson = JSON.stringify(scores);

  await c.env.DB.prepare(`
    INSERT INTO results (id, user_id, test_type, scores)
    VALUES (?, ?, ?, ?)
  `).bind(resultId, userId, test_type, scoresJson).run();

  return c.json({
    data: {
      id: resultId,
      user_id: userId,
      test_type,
      scores,
      completed_at: Math.floor(Date.now() / 1000)
    },
    error: null
  }, 201);
});

// DELETE /api/results/:id - Delete a specific result
results.delete('/:id', async (c) => {
  const email = getUserEmail(c);
  const resultId = c.req.param('id');

  if (!email) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

  const userId = await getOrCreateUser(email, c.env.DB);

  const result = await c.env.DB.prepare(
    'SELECT id FROM results WHERE id = ? AND user_id = ?'
  ).bind(resultId, userId).first();

  if (!result) {
    return c.json({
      data: null,
      error: { message: 'Result not found', code: 'NOT_FOUND' }
    }, 404);
  }

  await c.env.DB.prepare('DELETE FROM results WHERE id = ?').bind(resultId).run();

  return c.json({ data: { success: true }, error: null });
});

export default results;

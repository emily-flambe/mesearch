// Results API routes
import { Hono } from 'hono';
import type { Env, TestResult } from '../types';
import {
  generateId,
  getSessionFromCookie,
  verifyToken,
} from '../lib/auth';

const results = new Hono<{ Bindings: Env }>();

// Middleware to get user ID from session (optional - returns null if not authenticated)
async function getUserId(c: { req: { header: (name: string) => string | undefined }; env: Env }): Promise<string | null> {
  const cookieHeader = c.req.header('Cookie');
  const token = getSessionFromCookie(cookieHeader);
  if (!token) return null;

  const payload = await verifyToken(token, c.env.JWT_SECRET);
  return payload?.userId || null;
}

// GET /api/results - Get user's past results
results.get('/', async (c) => {
  const userId = await getUserId(c);

  if (!userId) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

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
  const userId = await getUserId(c);
  const resultId = c.req.param('id');

  if (!userId) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

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
  const userId = await getUserId(c);

  if (!userId) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

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
  const userId = await getUserId(c);
  const resultId = c.req.param('id');

  if (!userId) {
    return c.json({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
    }, 401);
  }

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

// Public profile API routes - no authentication required
import { Hono } from 'hono';
import type { Env, User, TestResult } from '../types';

const publicApi = new Hono<{ Bindings: Env }>();

// GET /api/u/:username - Get public profile and results
publicApi.get('/:username', async (c) => {
  const username = c.req.param('username');

  // Find user by username
  const user = await c.env.DB.prepare(
    'SELECT id, username, display_name, is_public, created_at FROM users WHERE username = ?'
  ).bind(username).first<Pick<User, 'id' | 'username' | 'display_name' | 'is_public' | 'created_at'>>();

  if (!user) {
    return c.json({
      data: null,
      error: { message: 'User not found', code: 'NOT_FOUND' }
    }, 404);
  }

  // Check if profile is public
  if (!user.is_public) {
    return c.json({
      data: null,
      error: { message: 'This profile is private', code: 'FORBIDDEN' }
    }, 403);
  }

  // Get all public results for this user
  const results = await c.env.DB.prepare(
    'SELECT id, test_type, scores, completed_at FROM results WHERE user_id = ? AND is_public = 1 ORDER BY completed_at DESC'
  ).bind(user.id).all<TestResult>();

  return c.json({
    data: {
      user: {
        username: user.username,
        display_name: user.display_name,
        created_at: user.created_at,
      },
      results: results.results.map(r => ({
        id: r.id,
        test_type: r.test_type,
        scores: JSON.parse(r.scores),
        completed_at: r.completed_at,
      })),
    },
    error: null
  });
});

// GET /api/u/:username/results/:id - Get specific public result
publicApi.get('/:username/results/:id', async (c) => {
  const username = c.req.param('username');
  const resultId = c.req.param('id');

  // Find user by username
  const user = await c.env.DB.prepare(
    'SELECT id, username, display_name, is_public FROM users WHERE username = ?'
  ).bind(username).first<Pick<User, 'id' | 'username' | 'display_name' | 'is_public'>>();

  if (!user) {
    return c.json({
      data: null,
      error: { message: 'User not found', code: 'NOT_FOUND' }
    }, 404);
  }

  // Check if profile is public
  if (!user.is_public) {
    return c.json({
      data: null,
      error: { message: 'This profile is private', code: 'FORBIDDEN' }
    }, 403);
  }

  // Get the specific result
  const result = await c.env.DB.prepare(
    'SELECT id, test_type, scores, is_public, completed_at FROM results WHERE id = ? AND user_id = ?'
  ).bind(resultId, user.id).first<TestResult>();

  if (!result) {
    return c.json({
      data: null,
      error: { message: 'Result not found', code: 'NOT_FOUND' }
    }, 404);
  }

  // Check if this specific result is public
  if (!result.is_public) {
    return c.json({
      data: null,
      error: { message: 'This result is private', code: 'FORBIDDEN' }
    }, 403);
  }

  return c.json({
    data: {
      user: {
        username: user.username,
        display_name: user.display_name,
      },
      result: {
        id: result.id,
        test_type: result.test_type,
        scores: JSON.parse(result.scores),
        completed_at: result.completed_at,
      },
    },
    error: null
  });
});

export default publicApi;

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';

import auth from './api/auth';
import flags from './api/flags';
import results from './api/results';
import profile from './api/profile';
import publicApi from './api/public';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  credentials: true,
}));

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes
app.route('/api/auth', auth);
app.route('/api/flags', flags);
app.route('/api/results', results);
app.route('/api/profile', profile);
// Public profile routes - outside /api to bypass Cloudflare Access
app.route('/p', publicApi);

// 404 handler for API routes
app.notFound(async (c) => {
  if (c.req.path.startsWith('/api')) {
    return c.json({ data: null, error: { message: 'Not found', code: 'NOT_FOUND' } }, 404);
  }
  // Serve static assets for non-API routes
  const assets = c.env.ASSETS;
  if (assets) {
    return assets.fetch(c.req.raw);
  }
  return c.notFound();
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    data: null,
    error: { message: 'Internal server error', code: 'INTERNAL_ERROR' }
  }, 500);
});

export default app;

-- Mesearch D1 Schema
-- Run with: wrangler d1 execute mesearch-db --local --file=./src/db/schema.sql

-- Users (created via OAuth or email/password)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,                -- NULL for OAuth-only users
  display_name TEXT,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  email_verified INTEGER DEFAULT 0,  -- 1 if verified
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Test results
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  test_type TEXT NOT NULL,
  scores TEXT NOT NULL,              -- JSON blob of scores
  completed_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_user_test ON results(user_id, test_type);
CREATE INDEX IF NOT EXISTS idx_results_completed ON results(completed_at);

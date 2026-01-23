-- Migration: Add public profile support
--
-- NOTE: SQLite doesn't support adding UNIQUE columns directly to tables with data.
-- Run each command separately with:
--   wrangler d1 execute mesearch-db --remote --command "<SQL>"
--
-- Commands to run in order:
-- 1. ALTER TABLE users ADD COLUMN username TEXT;
-- 2. ALTER TABLE users ADD COLUMN is_public INTEGER DEFAULT 0;
-- 3. ALTER TABLE results ADD COLUMN is_public INTEGER DEFAULT 0;
-- 4. CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
-- 5. CREATE INDEX IF NOT EXISTS idx_results_public ON results(user_id, is_public);

-- Add username to users table (without UNIQUE - will be enforced by index)
ALTER TABLE users ADD COLUMN username TEXT;

-- Add is_public to users table
ALTER TABLE users ADD COLUMN is_public INTEGER DEFAULT 0;

-- Add is_public to results table
ALTER TABLE results ADD COLUMN is_public INTEGER DEFAULT 0;

-- Add unique index for username lookups (enforces uniqueness)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Add index for efficient public results queries
CREATE INDEX IF NOT EXISTS idx_results_public ON results(user_id, is_public);

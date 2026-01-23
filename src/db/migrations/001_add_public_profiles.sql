-- Migration: Add public profile support
-- Run with: wrangler d1 execute mesearch-db --file=./src/db/migrations/001_add_public_profiles.sql

-- Add username and is_public to users table
ALTER TABLE users ADD COLUMN username TEXT UNIQUE;
ALTER TABLE users ADD COLUMN is_public INTEGER DEFAULT 0;

-- Add is_public to results table
ALTER TABLE results ADD COLUMN is_public INTEGER DEFAULT 0;

-- Add indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_results_public ON results(user_id, is_public);

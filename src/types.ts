// Environment bindings for Cloudflare Workers
export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  FEATURE_FLAGS: KVNamespace;
  // Note: Authentication is handled by Cloudflare Access
  // No secrets needed in the Worker for auth
}

// User model
export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  display_name: string | null;
  avatar_url: string | null;
  google_id: string | null;
  username: string | null;
  is_public: number; // 0 = private, 1 = public
  email_verified: number; // 0 or 1
  created_at: number;
  updated_at: number;
}

// Test result model
export interface TestResult {
  id: string;
  user_id: string;
  test_type: string;
  scores: string; // JSON blob
  is_public: number; // 0 = private, 1 = public
  completed_at: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: { message: string; code: string } | null;
}

// Auth context
export interface AuthContext {
  userId: string;
  user?: User;
}

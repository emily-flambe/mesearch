// Environment bindings for Cloudflare Workers
export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
}

// User model
export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  display_name: string | null;
  avatar_url: string | null;
  google_id: string | null;
  email_verified: boolean;
  created_at: number;
  updated_at: number;
}

// Test result model
export interface TestResult {
  id: string;
  user_id: string;
  test_type: string;
  scores: string; // JSON blob
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

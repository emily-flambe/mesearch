import { describe, it, expect } from 'vitest';
import {
  createToken,
  verifyToken,
  generateId,
  hashPassword,
  verifyPassword,
  createSessionCookie,
  clearSessionCookie,
  getSessionFromCookie,
} from '../lib/auth';

const TEST_SECRET = 'test-secret-key-for-testing-32ch';

describe('Token Functions', () => {
  it('createToken and verifyToken work correctly', async () => {
    const userId = 'test-user-123';
    const token = await createToken(userId, TEST_SECRET);

    expect(token).toBeDefined();
    expect(token).toContain('.');

    const payload = await verifyToken(token, TEST_SECRET);
    expect(payload).toBeDefined();
    expect(payload?.userId).toBe(userId);
  });

  it('verifyToken returns null for invalid token', async () => {
    const result = await verifyToken('invalid-token', TEST_SECRET);
    expect(result).toBeNull();
  });

  it('verifyToken returns null for wrong secret', async () => {
    const userId = 'test-user-123';
    const token = await createToken(userId, TEST_SECRET);

    const result = await verifyToken(token, 'wrong-secret');
    expect(result).toBeNull();
  });

  it('verifyToken returns null for tampered token', async () => {
    const userId = 'test-user-123';
    const token = await createToken(userId, TEST_SECRET);

    // Tamper with the payload
    const parts = token.split('.');
    parts[0] = btoa(JSON.stringify({ userId: 'hacker', exp: Date.now() + 10000000 }));
    const tamperedToken = parts.join('.');

    const result = await verifyToken(tamperedToken, TEST_SECRET);
    expect(result).toBeNull();
  });
});

describe('Password Hashing', () => {
  it('hashPassword creates a salted hash', async () => {
    const password = 'mySecurePassword123';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).toContain(':');
    // Hash should be different each time due to random salt
    const hash2 = await hashPassword(password);
    expect(hash).not.toBe(hash2);
  });

  it('verifyPassword returns true for correct password', async () => {
    const password = 'mySecurePassword123';
    const hash = await hashPassword(password);

    const result = await verifyPassword(password, hash);
    expect(result).toBe(true);
  });

  it('verifyPassword returns false for wrong password', async () => {
    const password = 'mySecurePassword123';
    const hash = await hashPassword(password);

    const result = await verifyPassword('wrongPassword', hash);
    expect(result).toBe(false);
  });

  it('verifyPassword returns false for malformed hash', async () => {
    const result = await verifyPassword('password', 'invalid-hash');
    expect(result).toBe(false);
  });
});

describe('ID Generation', () => {
  it('generateId creates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBe(32); // 16 bytes as hex = 32 chars
  });
});

describe('Cookie Functions', () => {
  it('createSessionCookie creates proper cookie string', () => {
    const token = 'test-token-123';
    const cookie = createSessionCookie(token, true);

    expect(cookie).toContain(`session=${token}`);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('Secure');
  });

  it('createSessionCookie omits Secure flag when not secure', () => {
    const token = 'test-token-123';
    const cookie = createSessionCookie(token, false);

    expect(cookie).not.toContain('Secure');
  });

  it('clearSessionCookie creates empty cookie', () => {
    const cookie = clearSessionCookie(true);

    expect(cookie).toContain('session=');
    expect(cookie).toContain('Max-Age=0');
  });

  it('getSessionFromCookie extracts token correctly', () => {
    const token = 'test-token-123';
    const cookieHeader = `session=${token}; other=value`;

    const result = getSessionFromCookie(cookieHeader);
    expect(result).toBe(token);
  });

  it('getSessionFromCookie handles base64 tokens with padding', () => {
    const token = 'eyJ0ZXN0IjoidmFsdWUifQ==.c2lnbmF0dXJl';
    const cookieHeader = `session=${token}`;

    const result = getSessionFromCookie(cookieHeader);
    expect(result).toBe(token);
  });

  it('getSessionFromCookie returns null for missing cookie', () => {
    const result = getSessionFromCookie('other=value');
    expect(result).toBeNull();
  });

  it('getSessionFromCookie returns null for undefined header', () => {
    const result = getSessionFromCookie(undefined);
    expect(result).toBeNull();
  });
});

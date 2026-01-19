// OAuth State Management
// Uses HMAC to create signed state tokens for CSRF protection

export interface OAuthState {
  provider: string;
  timestamp: number;
}

export class OAuthStateManager {
  private secret: string;

  constructor(jwtSecret: string) {
    this.secret = jwtSecret;
  }

  async createState(provider: string): Promise<string> {
    const payload = {
      provider,
      timestamp: Date.now(),
      exp: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const encoder = new TextEncoder();
    const payloadStr = JSON.stringify(payload);
    const payloadBase64 = btoa(payloadStr);

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64));
    const signatureBase64 = this.arrayBufferToBase64(signature);

    return `${payloadBase64}.${signatureBase64}`;
  }

  async verifyState(state: string, expectedProvider: string): Promise<OAuthState> {
    const parts = state.split('.');
    if (parts.length !== 2) {
      throw new Error('Invalid OAuth state format');
    }

    const [payloadBase64, signatureBase64] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = this.base64ToArrayBuffer(signatureBase64);
    const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(payloadBase64));

    if (!isValid) {
      throw new Error('Invalid OAuth state signature');
    }

    const payload = JSON.parse(atob(payloadBase64)) as OAuthState & { exp: number };

    if (payload.exp < Date.now()) {
      throw new Error('OAuth state expired');
    }

    if (payload.provider !== expectedProvider) {
      throw new Error('Provider mismatch');
    }

    return payload;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

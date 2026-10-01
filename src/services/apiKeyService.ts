import crypto from 'crypto';

export class ApiKeyService {
  /**
   * Generates a cryptographically secure raw API key (sk_live_...) and its SHA-256 hash.
   */
  static generateApiKey(): { rawKey: string; hash: string } {
    const bytes = crypto.randomBytes(24).toString('hex');
    const rawKey = `sk_live_${bytes}`;
    const hash = this.hashApiKey(rawKey);
    return { rawKey, hash };
  }

  /**
   * Hashes a raw API key using SHA-256.
   */
  static hashApiKey(rawKey: string): string {
    return crypto.createHash('sha256').update(rawKey).digest('hex');
  }

  /**
   * Verifies if a raw API key matches a stored SHA-256 hash.
   */
  static verifyApiKey(rawKey: string, storedHash: string): boolean {
    const computedHash = this.hashApiKey(rawKey);
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(storedHash));
  }
}

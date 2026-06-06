import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { env } from '../../core/config/env';

/**
 * Password + token hashing helpers.
 *
 * `bcryptjs` is a pure-JS, drop-in implementation of bcrypt — same algorithm,
 * no native build step (friendlier for CI / in-memory tests).
 */
export const password = {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, Number(env.bcrypt_salt_rounds));
  },

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  },
};

/** A random opaque token (used for password reset) plus its SHA-256 hash. */
export function createOpaqueToken(): { token: string; tokenHash: string } {
  const token = crypto.randomBytes(32).toString('hex');
  return { token, tokenHash: hashToken(token) };
}

/** SHA-256 of a token. We store hashes only and compare hash-to-hash. */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

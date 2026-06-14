import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import config from '../config';

export const passwordHelper = {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, Number(config.bcrypt_salt_rounds));
  },

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  },
};

export function createOpaqueToken(): { token: string; tokenHash: string } {
  const token = crypto.randomBytes(32).toString('hex');
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

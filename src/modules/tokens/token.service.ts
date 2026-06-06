import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from '../../core/config/env';
import { ApiError } from '../../core/http/ApiError';
import { hashToken } from '../../shared/utils/password';
import { refreshTokenRepository } from './refreshToken.repository';
import { TokenPair } from './tokens.types';

const access_expire_in = env.jwt.access_expire_in as SignOptions['expiresIn'];
const refresh_expire_in = env.jwt.refresh_expire_in as SignOptions['expiresIn'];

/**
 * Owns JWT sign/verify and refresh-token persistence/rotation. Auth orchestrates
 * the flows; this module is the only place that mints or rotates tokens.
 */
export const tokenService = {
  /** Signs a fresh access+refresh pair and persists the refresh-token hash. */
  async issuePair(userId: string): Promise<TokenPair> {
    // A unique `jti` per token guarantees rotated tokens differ even when issued
    // in the same second, and gives each token a distinct identity.
    const accessToken = jwt.sign(
      { sub: userId, jti: crypto.randomUUID() },
      env.jwt.access_secret as string,
      { expiresIn: access_expire_in },
    );
    const refreshToken = jwt.sign(
      { sub: userId, jti: crypto.randomUUID() },
      env.jwt.refresh_secret as string,
      { expiresIn: refresh_expire_in },
    );

    const expiresAt = decodeExpiry(refreshToken);
    await refreshTokenRepository.create(userId, hashToken(refreshToken), expiresAt);

    return { accessToken, refreshToken };
  },

  /** Verifies + rotates a refresh token, returning a brand-new pair. */
  async rotate(refreshToken: string): Promise<TokenPair> {
    const userId = this.verifyRefreshToken(refreshToken);

    const stored = await refreshTokenRepository.findActiveByHash(
      hashToken(refreshToken),
    );
    if (!stored || stored.expiresAt.getTime() < Date.now()) {
      throw ApiError.unauthorized('Refresh token is invalid or expired');
    }

    await refreshTokenRepository.revokeById(stored.id);
    return this.issuePair(userId);
  },

  /** Best-effort revoke of a single refresh token (logout). */
  async revoke(refreshToken: string): Promise<void> {
    const stored = await refreshTokenRepository.findActiveByHash(
      hashToken(refreshToken),
    );
    if (stored) await refreshTokenRepository.revokeById(stored.id);
  },

  revokeAllForUser(userId: string): Promise<unknown> {
    return refreshTokenRepository.revokeAllForUser(userId);
  },

  verifyRefreshToken(refreshToken: string): string {
    try {
      const payload = jwt.verify(refreshToken, env.jwt.refresh_secret as string) as {
        sub?: string;
      };
      if (!payload.sub) throw new Error('missing sub');
      return payload.sub;
    } catch {
      throw ApiError.unauthorized('Refresh token is invalid or expired');
    }
  },
};

/** Reads the `exp` claim of a freshly signed token as a Date. */
function decodeExpiry(token: string): Date {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (decoded?.exp) return new Date(decoded.exp * 1000);
  // Fallback: 7 days out.
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

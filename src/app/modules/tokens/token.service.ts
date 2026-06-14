import crypto from 'crypto';

import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { hashToken } from '../../../helpers/passwordHelper';
import ApiError from '../../errors/ApiErrors';
import { refreshTokenRepository } from './refreshToken.repository';
import { ITokenPair } from './tokens.interface';

/**
 * Owns JWT sign/verify and refresh-token persistence/rotation. Auth orchestrates
 * the flows; this module is the only place that mints or rotates tokens.
 */
export const TokenService = {
  async issuePairToDB(userId: string): Promise<ITokenPair> {
    const accessToken = jwtHelper.createToken(
      { sub: userId, jti: crypto.randomUUID() },
      config.jwt.access_secret,
      config.jwt.access_expire_in,
    );
    const refreshToken = jwtHelper.createToken(
      { sub: userId, jti: crypto.randomUUID() },
      config.jwt.refresh_secret,
      config.jwt.refresh_expire_in,
    );

    const expiresAt = decodeExpiry(refreshToken);
    await refreshTokenRepository.create(userId, hashToken(refreshToken), expiresAt);

    return { accessToken, refreshToken };
  },

  async rotateToDB(refreshToken: string): Promise<ITokenPair> {
    const userId = this.verifyRefreshToken(refreshToken);

    const stored = await refreshTokenRepository.findActiveByHash(hashToken(refreshToken));
    if (!stored || stored.expiresAt.getTime() < Date.now()) {
      throw new ApiError(401, 'Refresh token is invalid or expired');
    }

    await refreshTokenRepository.revokeById(stored.id);
    return this.issuePairToDB(userId);
  },

  async revokeFromDB(refreshToken: string): Promise<void> {
    const stored = await refreshTokenRepository.findActiveByHash(hashToken(refreshToken));
    if (stored) await refreshTokenRepository.revokeById(stored.id);
  },

  revokeAllForUser(userId: string): Promise<unknown> {
    return refreshTokenRepository.revokeAllForUser(userId);
  },

  verifyRefreshToken(refreshToken: string): string {
    try {
      const payload = jwtHelper.verifyToken(refreshToken, config.jwt.refresh_secret);
      if (!payload.sub) throw new Error('missing sub');
      return payload.sub;
    } catch {
      throw new ApiError(401, 'Refresh token is invalid or expired');
    }
  },
};

function decodeExpiry(token: string): Date {
  const decoded = jwtHelper.verifyToken(token, config.jwt.refresh_secret);
  if (decoded.exp) return new Date(decoded.exp * 1000);
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

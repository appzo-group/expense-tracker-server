import crypto from 'crypto';

import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { hashToken } from '../../../helpers/passwordHelper';
import ApiError from '../../errors/ApiErrors';
import {
  createRefreshToken,
  findActiveRefreshTokenByHash,
  revokeRefreshTokenById,
  revokeAllRefreshTokensForUser,
} from './refreshToken.repository';
import { ITokenPair } from './tokens.interface';

export const issuePairToDB = async (userId: string): Promise<ITokenPair> => {
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
  await createRefreshToken(userId, hashToken(refreshToken), expiresAt);

  return { accessToken, refreshToken };
};

export const rotateToDB = async (refreshToken: string): Promise<ITokenPair> => {
  const userId = verifyRefreshToken(refreshToken);

  const stored = await findActiveRefreshTokenByHash(hashToken(refreshToken));
  if (!stored || stored.expiresAt.getTime() < Date.now()) {
    throw new ApiError(401, 'Refresh token is invalid or expired');
  }

  await revokeRefreshTokenById(stored.id);
  return issuePairToDB(userId);
};

export const revokeFromDB = async (refreshToken: string): Promise<void> => {
  const stored = await findActiveRefreshTokenByHash(hashToken(refreshToken));
  if (stored) await revokeRefreshTokenById(stored.id);
};

export const revokeAllForUser = (userId: string): Promise<unknown> =>
  revokeAllRefreshTokensForUser(userId);

export const verifyRefreshToken = (refreshToken: string): string => {
  try {
    const payload = jwtHelper.verifyToken(refreshToken, config.jwt.refresh_secret);
    if (!payload.sub) throw new Error('missing sub');
    return payload.sub;
  } catch {
    throw new ApiError(401, 'Refresh token is invalid or expired');
  }
};

function decodeExpiry(token: string): Date {
  const decoded = jwtHelper.verifyToken(token, config.jwt.refresh_secret);
  if (decoded.exp) return new Date(decoded.exp * 1000);
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

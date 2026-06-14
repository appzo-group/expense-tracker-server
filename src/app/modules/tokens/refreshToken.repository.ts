import { Types } from 'mongoose';

import { RefreshTokenModel } from './refreshToken.model';

export const createRefreshToken = (userId: string, tokenHash: string, expiresAt: Date) =>
  RefreshTokenModel.create({ userId: new Types.ObjectId(userId), tokenHash, expiresAt });

export const findActiveRefreshTokenByHash = (tokenHash: string) =>
  RefreshTokenModel.findOne({ tokenHash, revoked: false });

export const revokeRefreshTokenById = (id: Types.ObjectId) =>
  RefreshTokenModel.updateOne({ _id: id }, { revoked: true });

export const revokeAllRefreshTokensForUser = (userId: string) =>
  RefreshTokenModel.updateMany(
    { userId: new Types.ObjectId(userId), revoked: false },
    { revoked: true },
  );

import { Types } from 'mongoose';

import { RefreshTokenModel } from './refreshToken.model';

/** All Mongoose access for the refresh-token collection. */
export const refreshTokenRepository = {
  create(userId: string, tokenHash: string, expiresAt: Date) {
    return RefreshTokenModel.create({
      userId: new Types.ObjectId(userId),
      tokenHash,
      expiresAt,
    });
  },

  findActiveByHash(tokenHash: string) {
    return RefreshTokenModel.findOne({ tokenHash, revoked: false });
  },

  revokeById(id: Types.ObjectId) {
    return RefreshTokenModel.updateOne({ _id: id }, { revoked: true });
  },

  revokeAllForUser(userId: string) {
    return RefreshTokenModel.updateMany(
      { userId: new Types.ObjectId(userId), revoked: false },
      { revoked: true },
    );
  },
};

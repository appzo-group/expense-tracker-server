import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export interface RefreshTokenInterface {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IRefreshToken = HydratedDocument<RefreshTokenInterface>;

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAccessTokenPayload {
  sub: string;
}

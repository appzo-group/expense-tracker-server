import config from '../../../config';
import { createOpaqueToken, hashToken, passwordHelper } from '../../../helpers/passwordHelper';
import { logger } from '../../../shared/logger';
import ApiError from '../../errors/ApiErrors';
import { issuePairToDB, rotateToDB, revokeFromDB, revokeAllForUser } from '../tokens';
import { IAuthResult, ILoginInput, IRegisterInput } from './auth.interface';
import {
  existsByEmail,
  createUserToDB,
  findByEmailWithPassword,
  toPublic,
  findByEmail,
  findByResetTokenHash,
  setResetToken,
  setPassword,
} from '../users/user.service';

export const registerUserToDB = async (input: IRegisterInput): Promise<IAuthResult> => {


  if (await existsByEmail(input.email)) {
    throw new ApiError(409, 'An account with this email already exists');
  }
  const passwordHash = await passwordHelper.hash(input.password);
  const user = await createUserToDB({ name: input.name, email: input.email, password: passwordHash });
  const tokens = await issuePairToDB(user.id.toString());
  return { user: toPublic(user), ...tokens };
};

export const loginUserFromDB = async (input: ILoginInput): Promise<IAuthResult> => {
  const user = await findByEmailWithPassword(input.email);
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const valid = await passwordHelper.compare(input.password, user.password);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const tokens = await issuePairToDB(user.id);
  return { user: toPublic(user), ...tokens };
};

export const newAccessTokenToUser = (refreshToken: string) => rotateToDB(refreshToken);

export const logoutUserFromDB = async (refreshToken: string): Promise<void> => {
  await revokeFromDB(refreshToken);
};

export const forgetPasswordToDB = async (email: string): Promise<{ resetToken?: string }> => {
  const user = await findByEmail(email);
  if (!user) return {};

  const { token, tokenHash } = createOpaqueToken();
  await setResetToken(user.id, tokenHash, new Date(Date.now() + 15 * 60 * 1000));
  logger.info(`Password reset requested for ${email}`);

  return config.isTest ? { resetToken: token } : {};
};

export const resetPasswordToDB = async (token: string, newPassword: string): Promise<void> => {
  const user = await findByResetTokenHash(hashToken(token));
  if (!user || !user.passwordResetExpires || user.passwordResetExpires.getTime() < Date.now()) {
    throw new ApiError(400, 'Reset token is invalid or has expired');
  }

  const passwordHash = await passwordHelper.hash(newPassword);
  await setPassword(user, passwordHash);
  await revokeAllForUser(user.id);
};

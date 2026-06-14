import config from '../../../config';
import { createOpaqueToken, hashToken, passwordHelper } from '../../../helpers/passwordHelper';
import { logger } from '../../../shared/logger';

import ApiError from '../../errors/ApiErrors';
import { ITokenPair, TokenService } from '../tokens';
import { IAuthResult, ILoginInput, IRegisterInput } from './auth.interface';
import {
  checkMailExistsToDB,
  createUserToDB,
  findByMailWithPassword,
  toPublic,
  findByMail,
  findByResetTokenHash,
  setResetToken,
  setPassword
} from '../users/user.service';


export const authService = {
  async registerUserToDB(input: IRegisterInput): Promise<IAuthResult> {
    if (await checkMailExistsToDB(input.mail)) {
      throw new ApiError(409, 'An account with this email already exists');
    }
    const passwordHash = await passwordHelper.hash(input.password);
    const user = await createUserToDB({
      name: input.name,
      mail: input.mail,
      password: passwordHash,
    });

    const id = user._id.toString();
    const tokens = await TokenService.issuePairToDB(id);
    return { user: toPublic(user), ...tokens };
  },

  async loginUserFromDB(input: ILoginInput): Promise<IAuthResult> {
    const user = await findByMailWithPassword(input.mail);
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const valid = await passwordHelper.compare(input.password, user.password);
    if (!valid) throw new ApiError(401, 'Invalid email or password');

    const tokens = await TokenService.issuePairToDB(user.id);
    return { user: toPublic(user), ...tokens };
  },

  newAccessTokenToUser(refreshToken: string): Promise<ITokenPair> {
    return TokenService.rotateToDB(refreshToken);
  },

  async logoutUserFromDB(refreshToken: string): Promise<void> {
    await TokenService.revokeFromDB(refreshToken);
  },

  async forgetPasswordToDB(mail: string): Promise<{ resetToken?: string }> {
    const user = await findByMail(mail);
    if (!user) return {};

    const { token, tokenHash } = createOpaqueToken();
    await setResetToken(
      user.id,
      tokenHash,
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    );
    logger.info(`Password reset requested for ${mail}`);

    return config.isTest ? { resetToken: token } : {};
  },

  async resetPasswordToDB(token: string, newPassword: string): Promise<void> {
    const user = await findByResetTokenHash(hashToken(token));
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      throw new ApiError(400, 'Reset token is invalid or has expired');
    }

    const passwordHash = await passwordHelper.hash(newPassword);
    await setPassword(user, passwordHash);
    await TokenService.revokeAllForUser(user.id);
  },
};

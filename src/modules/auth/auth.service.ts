import { env } from '../../core/config/env';
import { logger } from '../../core/config/logger';
import { ApiError } from '../../core/http/ApiError';
import { RESET_TOKEN_TTL_MS } from '../../shared/constants';
import {
  createOpaqueToken,
  hashToken,
  password as passwordUtil,
} from '../../shared/utils/password';
import { tokenService, TokenPair } from '../tokens';
import { userService } from '../users';
import { AuthResult, LoginInput, RegisterInput } from './auth.types';

/** Orchestrates auth flows over the users + tokens modules. */
export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    if (await userService.emailExists(input.email)) {
      throw ApiError.conflict('An account with this email already exists');
    }
    const passwordHash = await passwordUtil.hash(input.password);
    const user = await userService.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    const tokens = await tokenService.issuePair(user.id);
    return { user: userService.toPublic(user), ...tokens };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userService.findByEmailWithPassword(input.email);
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const valid = await passwordUtil.compare(input.password, user.password);
    if (!valid) throw ApiError.unauthorized('Invalid email or password');

    const tokens = await tokenService.issuePair(user.id);
    return { user: userService.toPublic(user), ...tokens };
  },

  refresh(refreshToken: string): Promise<TokenPair> {
    return tokenService.rotate(refreshToken);
  },

  async logout(refreshToken: string): Promise<void> {
    await tokenService.revoke(refreshToken);
  },

  /**
   * Always resolves (never reveals whether the email exists). The raw reset
   * token would normally be emailed; the transport is stubbed. In non-production
   * we return it so the flow is testable end-to-end.
   */
  async forgotPassword(email: string): Promise<{ resetToken?: string }> {
    const user = await userService.findByEmail(email);
    if (!user) return {};

    const { token, tokenHash } = createOpaqueToken();
    await userService.setResetToken(
      user.id,
      tokenHash,
      new Date(Date.now() + RESET_TOKEN_TTL_MS),
    );
    logger.info(`Password reset requested for ${email}`);

    return !env.isTest ? {} : { resetToken: token };
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await userService.findByResetTokenHash(hashToken(token));
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      throw ApiError.badRequest('Reset token is invalid or has expired');
    }

    const passwordHash = await passwordUtil.hash(newPassword);
    await userService.setPassword(user, passwordHash);
    // Invalidate every existing session after a password change.
    await tokenService.revokeAllForUser(user.id);
  },
};

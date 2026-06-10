import { ApiError } from '../../core/http/ApiError';
import { password as passwordUtil } from '../../shared/utils/password';
import { budgetService } from '../budgets';
import { tokenService } from '../tokens';
import { transactionService } from '../transactions';
import { userRepository } from './user.repository';
import { UserDocument } from './user.model';
import {
  CreateUserInput,
  PublicUser,
  UpdateProfileInput,
  UpdateSettingsInput,
} from './user.types';

/** Business logic for users. The only module allowed to mutate user records. */
export const userService = {
  toPublic(doc: UserDocument): PublicUser {
    return doc.toJSON() as unknown as PublicUser;
  },

  async create(input: CreateUserInput): Promise<UserDocument> {
    return userRepository.create(input);
  },

  async emailExists(email: string): Promise<boolean> {
    return (await userRepository.existsByEmail(email)) !== null;
  },

  findByEmailWithPassword(email: string) {
    return userRepository.findByEmailWithPassword(email);
  },

  findByEmail(email: string) {
    return userRepository.findByEmail(email);
  },

  findByResetTokenHash(tokenHash: string) {
    return userRepository.findByResetTokenHash(tokenHash);
  },

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.unauthorized('User not found');
    return this.toPublic(user);
  },

  async updateProfile(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    if (input.name !== undefined) user.name = input.name;
    await user.save();
    return this.toPublic(user);
  },

  async updateSettings(
    userId: string,
    input: UpdateSettingsInput,
  ): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    if (input.currency !== undefined) user.currency = input.currency;
    if (input.notifications?.budgetAlerts !== undefined) {
      user.notifications.budgetAlerts = input.notifications.budgetAlerts;
    }
    await user.save();
    return this.toPublic(user);
  },

  async setResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) return;
    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = expiresAt;
    await user.save();
  },

  async setPassword(user: UserDocument, passwordHash: string): Promise<void> {
    user.password = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
  },

  /**
   * Permanently deletes the account after re-authenticating with the current
   * password, then removes all associated data (transactions, budgets, refresh
   * tokens) per the data-retention policy.
   */
  async deleteAccount(userId: string, plainPassword: string): Promise<void> {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) throw ApiError.notFound('User not found');

    const valid = await passwordUtil.compare(plainPassword, user.password);
    if (!valid) throw ApiError.unauthorized('Incorrect password');

    // Soft-delete all user-owned data and revoke sessions, then the user record.
    await Promise.all([
      transactionService.deleteAllForUser(userId),
      budgetService.deleteAllForUser(userId),
      tokenService.revokeAllForUser(userId),
    ]);
    await userRepository.deleteById(userId);
  },
};

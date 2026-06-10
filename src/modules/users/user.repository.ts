import { UserModel } from './user.model';
import { CreateUserInput } from './user.types';

/** All Mongoose access for the users collection. */
export const userRepository = {
  create(input: CreateUserInput) {
    return UserModel.create({
      name: input.name,
      email: input.email,
      password: input.passwordHash,
    });
  },

  findById(id: string) {
    return UserModel.findById(id);
  },

  /** Includes the password hash — for re-authentication (e.g. account deletion). */
  findByIdWithPassword(id: string) {
    return UserModel.findById(id).select('+password');
  },

  /** Soft-delete: marks the user as deleted rather than removing the record. */
  deleteById(id: string) {
    return UserModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  },

  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  /** Includes the password hash for login verification. */
  findByEmailWithPassword(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password');
  },

  findByResetTokenHash(tokenHash: string) {
    return UserModel.findOne({ passwordResetToken: tokenHash }).select(
      '+passwordResetToken +passwordResetExpires',
    );
  },

  existsByEmail(email: string) {
    return UserModel.exists({ email: email.toLowerCase() });
  },
};

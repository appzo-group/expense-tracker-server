import ApiError from '../../errors/ApiErrors';
import { ICreateUser, IPublicUser, IUpdateProfile, IUpdateSettings, IUser, } from './user.interface';
import {
  createUser,
  existsByEmail,
  findByEmail,
  findByEmailWithPassword,
  findById,
  findByIdWithPassword,
  deleteById,
  findByResetTokenHash,
} from './user.repository';

export const toPublic = (user: IUser): IPublicUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  currency: user.currency,
  notifications: user.notifications,
});
export const createUserToDB = async (input: ICreateUser): Promise<IUser> => createUser(input);

export const retrieveProfileToDB = async (userId: string): Promise<IPublicUser> => {
  const user = await findById(userId);
  if (!user) throw new ApiError(404, 'User not found')
  return toPublic(user);
};

export const updateProfileToDB = async (userId: string, input: IUpdateProfile): Promise<IPublicUser> => {
  const user = await findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  if (input.name !== undefined) {
    user.name = input.name;
  }

  await user.save();
  return toPublic(user);
};

export const updateSettingsToDB = async (userId: string, input: IUpdateSettings): Promise<IPublicUser> => {
  const user = await findById(userId);

  if (!user) throw new ApiError(404, 'User not found');

  if (input.currency !== undefined) {
    user.currency = input.currency;
  }

  if (input.notifications?.budgetAlerts !== undefined) {
    user.notifications.budgetAlerts =
      input.notifications.budgetAlerts;
  }

  await user.save();
  return toPublic(user);
};

export const setResetToken = async (userId: string, tokenHash: string, expiresAt: Date,): Promise<void> => {
  const user = await findById(userId);
  if (!user) return;

  user.passwordResetToken = tokenHash;
  user.passwordResetExpires = expiresAt;

  await user.save();
};

export const setPassword = async (user: any, passwordHash: string): Promise<void> => {
  user.password = passwordHash;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
};

export const deleteAccountFromDB = async (userId: string, plainPassword: string,
): Promise<void> => {
  const user = await findById(userId);

  if (!user) throw new ApiError(404, 'User not found')

  user.deletedAt = new Date();
  await user.save();


  return;

  // const valid = await passwordHelper.compare(plainPassword, user.password);

  // if (!valid) {
  //   throw new ApiError(401, 'Incorrect password');
  // }

  // await Promise.all([
  //   dependencies.deleteTransactions(userId),
  //   dependencies.deleteBudgets(userId),
  //   dependencies.revokeTokens(userId),
  // ]);

  // await deleteById(userId);
};


export { findByEmail, findByEmailWithPassword, findByResetTokenHash, existsByEmail };

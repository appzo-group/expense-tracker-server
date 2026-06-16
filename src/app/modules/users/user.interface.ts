
import { HydratedDocument, Model } from "mongoose";

export interface IUserNotifications { budgetAlerts: boolean }

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  currency: string;
  notifications: IUserNotifications;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IUser = HydratedDocument<UserInterface>;

export type IPublicUser = Pick<IUser, "name" | "email" | "currency" | "notifications"> & { id: string };

export interface ICreateUser { name: string; email: string; password: string }

export interface IUpdateProfile { name?: string }

export interface IUpdateSettings { currency?: string; notifications?: Partial<IUserNotifications> }

export interface UserModel extends Model<IUser> {
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
}

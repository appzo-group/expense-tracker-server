import { Document, Types, Model } from "mongoose";


export interface IUser {
  _id: Types.ObjectId;
  name: string;
  mail: string;
  password: string;
  currency: string;
  notifications: { budgetAlerts: boolean };
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}


export interface IPublicUser { id: string; name: string; mail: string; currency: string; notifications: { budgetAlerts: boolean } }
export interface ICreateUser { name: string; mail: string; password: string }
export interface IUpdateProfile { name?: string }
export interface IUpdateSettings { currency?: string; notifications?: { budgetAlerts?: boolean } }



export interface UserModel extends Model<IUser> {
  isExistUserById(id: string): Promise<IUser | null>;
  isExistUserByEmail(email: string): Promise<IUser | null>;
  isAccountCreated(id: string): Promise<boolean>;
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
}


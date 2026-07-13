import { ICreateUser } from './user.interface';
import { User } from './user.model';

export const createUser = async (input: ICreateUser) => User.create({ name: input.name, email: input.email, password: input.password })

export const findById = async (id: string) => User.findById(id)

export const findByIdWithPassword = async (id: string) => User.findById(id).select('+password')

export const deleteById = async (id: string) => User.findByIdAndUpdate(id, { deletedAt: new Date() })

export const findByEmail = async (email: string) => User.findOne({ email: email.toLowerCase() })

export const findByEmailWithPassword = async (email: string) => User.findOne({ email: email.toLowerCase() }).select('+password')

export const findByResetTokenHash = async (tokenHash: string) => User.findOne({ passwordResetToken: tokenHash }).select('+passwordResetToken +passwordResetExpires')



export const existsByEmail = async (email: string): Promise<boolean> => {
    const result = await User.exists({ email: email.toLowerCase() });
    return result !== null;
};
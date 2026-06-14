import { ICreateUser } from './user.interface';
import { User } from './user.model';

export const createUser = async (input: ICreateUser) => User.create({ name: input.name, mail: input.mail, password: input.password })

export const findById = async (id: string) => User.findById(id)

export const findByIdWithPassword = async (id: string) => User.findById(id).select('+password')

export const deleteById = async (id: string) => User.findByIdAndUpdate(id, { deletedAt: new Date() })

export const findByMail = async (mail: string) => User.findOne({ mail: mail.toLowerCase() })

export const findByMailWithPassword = async (mail: string) => User.findOne({ mail: mail.toLowerCase() }).select('+password')

export const findByResetTokenHash = async (tokenHash: string) => User.findOne({ passwordResetToken: tokenHash }).select('+passwordResetToken +passwordResetExpires')

export const existsByMail = async (mail: string): Promise<boolean> => (await User.exists({ mail: mail.toLowerCase() })) !== null;


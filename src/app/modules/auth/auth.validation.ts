import { z } from 'zod';

const createRegisterZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required')
      .max(60, 'Name must be 60 characters or fewer'),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Enter a valid email' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Enter a valid email' }),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  }),
});

const createRefreshZodSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({ required_error: 'refreshToken is required' })
      .min(1, 'refreshToken is required'),
  }),
});

const createForgotPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Enter a valid email' }),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Token is required' }).min(1, 'Token is required'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
  }),
});

export const AuthValidation = {
  createRegisterZodSchema,
  createLoginZodSchema,
  createRefreshZodSchema,
  createForgotPasswordZodSchema,
  createResetPasswordZodSchema,
};

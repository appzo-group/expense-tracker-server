import { z } from 'zod';

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required')
      .max(60, 'Name must be 60 characters or fewer'),
  }),
});

const updateSettingsZodSchema = z.object({
  body: z.object({
    currency: z
      .string()
      .length(3, 'Currency must be a 3-letter code')
      .optional(),
    notifications: z
      .object({
        budgetAlerts: z.boolean({ required_error: 'budgetAlerts must be a boolean' }),
      })
      .optional(),
  }),
});

const deleteAccountZodSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required to delete your account' })
      .min(1, 'Password is required to delete your account'),
  }),
});

export {
  updateProfileZodSchema,
  updateSettingsZodSchema,
  deleteAccountZodSchema,
};

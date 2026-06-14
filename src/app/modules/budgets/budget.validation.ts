import { z } from 'zod';

import { BUDGET_PERIODS } from '../../../enums/budget';

const createBudgetZodSchema = z.object({
  body: z.object({
    category: z
      .string({ required_error: 'Category is required' })
      .min(1, 'Category is required'),
    limit: z
      .number({ required_error: 'Limit is required' })
      .gt(0, 'Limit must be greater than zero'),
    period: z.enum(BUDGET_PERIODS, {
      required_error: 'Period is required',
      message: 'Period must be monthly or yearly',
    }),
    startDate: z
      .string({ required_error: 'startDate is required' })
      .datetime({ message: 'startDate must be a valid ISO date' }),
  }),
});

const updateBudgetZodSchema = z.object({
  body: z.object({
    category: z.string().min(1).optional(),
    limit: z.number().gt(0, 'Limit must be greater than zero').optional(),
    period: z.enum(BUDGET_PERIODS).optional(),
    startDate: z
      .string()
      .datetime({ message: 'startDate must be a valid ISO date' })
      .optional(),
  }),
});

const budgetIdZodSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  }),
});

export const BudgetValidation = {
  createBudgetZodSchema,
  updateBudgetZodSchema,
  budgetIdZodSchema,
};

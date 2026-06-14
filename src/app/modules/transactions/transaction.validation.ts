import { z } from 'zod';

import { TRANSACTION_TYPES } from '../../../enums/transaction';

/** Body validation for creating a transaction (reused by expenses/income). */
export const createTransactionZodSchema = z.object({
  body: z.object({
    amount: z
      .number({ required_error: 'Amount is required' })
      .gt(0, 'Amount must be greater than zero'),
    category: z
      .string({ required_error: 'Category is required' })
      .min(1, 'Category is required'),
    note: z.string().optional(),
    date: z
      .string({ required_error: 'Date is required' })
      .datetime({ message: 'Date must be a valid ISO date' }),
  }),
});

/** Body validation for updating a transaction — all fields optional. */
export const updateTransactionZodSchema = z.object({
  body: z.object({
    amount: z.number().gt(0, 'Amount must be greater than zero').optional(),
    category: z.string().min(1).optional(),
    note: z.string().optional(),
    date: z.string().datetime({ message: 'Date must be a valid ISO date' }).optional(),
  }),
});

export const listTransactionsZodSchema = z.object({
  query: z.object({
    type: z.enum(TRANSACTION_TYPES).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    sort: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const idParamZodSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  }),
});

export const TransactionValidation = {
  createTransactionZodSchema,
  updateTransactionZodSchema,
  listTransactionsZodSchema,
  idParamZodSchema,
};

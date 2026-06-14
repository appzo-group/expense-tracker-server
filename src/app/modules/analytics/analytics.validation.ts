import { z } from 'zod';

import { TRANSACTION_TYPES } from '../../../enums/transaction';

const categoryBreakdownZodSchema = z.object({
  query: z.object({
    type: z.enum(TRANSACTION_TYPES).optional(),
    year: z.string().optional(),
  }),
});

const monthlyZodSchema = z.object({
  query: z.object({
    year: z.string().optional(),
  }),
});

const incomeVsExpenseZodSchema = z.object({
  query: z.object({
    from: z.string().datetime({ message: 'from must be a valid ISO date' }).optional(),
    to: z.string().datetime({ message: 'to must be a valid ISO date' }).optional(),
  }),
});

export { categoryBreakdownZodSchema, monthlyZodSchema, incomeVsExpenseZodSchema };

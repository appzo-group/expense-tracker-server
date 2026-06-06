import { transactionService } from '../transactions';
import {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from '../transactions/transaction.types';

type ExpenseDto = Omit<CreateTransactionInput, 'type'>;

/**
 * Thin wrapper over the transaction service with `type: 'expense'` injected.
 * No model/repository of its own — see blueprint §13.
 */
export const expenseService = {
  create(userId: string, dto: ExpenseDto) {
    return transactionService.create(userId, { ...dto, type: 'expense' });
  },

  update(userId: string, id: string, dto: UpdateTransactionInput) {
    return transactionService.update(userId, id, dto, 'expense');
  },

  remove(userId: string, id: string) {
    return transactionService.remove(userId, id, 'expense');
  },

  list(userId: string, query: ListTransactionsQuery) {
    return transactionService.list(userId, { ...query, type: 'expense' });
  },
};

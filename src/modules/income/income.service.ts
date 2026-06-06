import { transactionService } from '../transactions';
import {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from '../transactions/transaction.types';

type IncomeDto = Omit<CreateTransactionInput, 'type'>;

/**
 * Thin wrapper over the transaction service with `type: 'income'` injected.
 * No model/repository of its own — see blueprint §13.
 */
export const incomeService = {
  create(userId: string, dto: IncomeDto) {
    return transactionService.create(userId, { ...dto, type: 'income' });
  },

  update(userId: string, id: string, dto: UpdateTransactionInput) {
    return transactionService.update(userId, id, dto, 'income');
  },

  remove(userId: string, id: string) {
    return transactionService.remove(userId, id, 'income');
  },

  list(userId: string, query: ListTransactionsQuery) {
    return transactionService.list(userId, { ...query, type: 'income' });
  },
};

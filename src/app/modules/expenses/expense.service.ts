import {
  ICreateTransaction,
  IListTransactionsQuery,
  IUpdateTransaction,
} from '../transactions/transaction.interface';
import { TransactionService } from '../transactions/transaction.service';

type IExpenseDto = Omit<ICreateTransaction, 'type'>;

/**
 * Thin wrapper over TransactionService with `type: 'expense'` injected.
 * No model/repository of its own.
 */
export const ExpenseService = {
  createExpenseToDB(userId: string, dto: IExpenseDto) {
    return TransactionService.createTransactionToDB(userId, { ...dto, type: 'expense' });
  },

  updateExpenseToDB(userId: string, id: string, dto: IUpdateTransaction) {
    return TransactionService.updateTransactionToDB(userId, id, dto, 'expense');
  },

  deleteExpenseFromDB(userId: string, id: string) {
    return TransactionService.deleteTransactionFromDB(userId, id, 'expense');
  },

  getAllExpensesFromDB(userId: string, query: IListTransactionsQuery) {
    return TransactionService.getAllTransactionsFromDB(userId, { ...query, type: 'expense' });
  },
};

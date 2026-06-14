import {
  ICreateTransaction,
  IListTransactionsQuery,
  IUpdateTransaction,
} from '../transactions/transaction.interface';
import { TransactionService } from '../transactions/transaction.service';

type IIncomeDto = Omit<ICreateTransaction, 'type'>;

/**
 * Thin wrapper over TransactionService with `type: 'income'` injected.
 * No model/repository of its own.
 */
export const IncomeService = {
  createIncomeToDB(userId: string, dto: IIncomeDto) {
    return TransactionService.createTransactionToDB(userId, { ...dto, type: 'income' });
  },

  updateIncomeToDB(userId: string, id: string, dto: IUpdateTransaction) {
    return TransactionService.updateTransactionToDB(userId, id, dto, 'income');
  },

  deleteIncomeFromDB(userId: string, id: string) {
    return TransactionService.deleteTransactionFromDB(userId, id, 'income');
  },

  getAllIncomeFromDB(userId: string, query: IListTransactionsQuery) {
    return TransactionService.getAllTransactionsFromDB(userId, { ...query, type: 'income' });
  },
};

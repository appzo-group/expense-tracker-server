import {
  ICreateTransaction,
  IListTransactionsQuery,
  IPublicTransaction,
  IUpdateTransaction,
} from '../transactions/transaction.interface';

export type IExpenseDto = Omit<ICreateTransaction, 'type'>;
export type IUpdateExpenseDto = IUpdateTransaction;
export type IListExpensesQuery = Omit<IListTransactionsQuery, 'type'>;
export type IPublicExpense = IPublicTransaction;

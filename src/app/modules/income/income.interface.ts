import {
  ICreateTransaction,
  IListTransactionsQuery,
  IPublicTransaction,
  IUpdateTransaction,
} from '../transactions/transaction.interface';

export type IIncomeDto = Omit<ICreateTransaction, 'type'>;
export type IUpdateIncomeDto = IUpdateTransaction;
export type IListIncomeQuery = Omit<IListTransactionsQuery, 'type'>;
export type IPublicIncome = IPublicTransaction;

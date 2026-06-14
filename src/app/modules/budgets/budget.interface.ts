import { BudgetPeriod } from '../../../enums/budget';

export interface ICreateBudget {
  category: string;
  limit: number;
  period: BudgetPeriod;
  startDate: Date;
}

export interface IUpdateBudget {
  category?: string;
  limit?: number;
  period?: BudgetPeriod;
  startDate?: Date;
}

export interface IPublicBudget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: BudgetPeriod;
  startDate: string;
}

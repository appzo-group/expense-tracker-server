import { BudgetPeriod } from '../../shared/constants';

export interface CreateBudgetInput {
  category: string;
  limit: number;
  period: BudgetPeriod;
  startDate: Date;
}

export interface UpdateBudgetInput {
  category?: string;
  limit?: number;
  period?: BudgetPeriod;
  startDate?: Date;
}

export interface PublicBudget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: BudgetPeriod;
  startDate: string;
}

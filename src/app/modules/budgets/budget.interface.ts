import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { BudgetPeriod } from '../../../enums/budget';

export interface BudgetInterface {
  userId: Types.ObjectId;
  category: string;
  limit: number;
  period: BudgetPeriod;
  startDate: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IBudget = HydratedDocument<BudgetInterface>;

export interface ICreateBudget { category: string; limit: number; period: BudgetPeriod; startDate: Date }

export interface IUpdateBudget { category?: string; limit?: number; period?: BudgetPeriod; startDate?: Date }

export interface IPublicBudget { id: string; category: string; limit: number; spent: number; period: BudgetPeriod; startDate: string }

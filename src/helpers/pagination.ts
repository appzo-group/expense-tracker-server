import { IMeta, IPaginationParams } from '../types/pagination.types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function parsePagination(query: { page?: unknown; limit?: unknown }): IPaginationParams {
  const page = clampInt(query.page, DEFAULT_PAGE, 1, Number.MAX_SAFE_INTEGER);
  const limit = clampInt(query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  return { page, limit, skip: (page - 1) * limit };
}

export function buildMeta(total: number, { page, limit }: IPaginationParams): IMeta {
  return {
    page,
    limit,
    total,
    totalPage: limit > 0 ? Math.ceil(total / limit) : 1,
  };
}

function clampInt(raw: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

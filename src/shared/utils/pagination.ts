import { PAGINATION } from '../constants';
import { PaginationMeta, PaginationParams } from '../types/pagination.types';

/** Parses and clamps `page`/`limit` query params into safe pagination values. */
export function parsePagination(query: {
  page?: unknown;
  limit?: unknown;
}): PaginationParams {
  const page = clampInt(query.page, PAGINATION.defaultPage, 1, Number.MAX_SAFE_INTEGER);
  const limit = clampInt(
    query.limit,
    PAGINATION.defaultLimit,
    1,
    PAGINATION.maxLimit,
  );
  return { page, limit, skip: (page - 1) * limit };
}

/** Builds the pagination meta block returned alongside list responses. */
export function buildMeta(
  total: number,
  { page, limit }: PaginationParams,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
  };
}

function clampInt(
  raw: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

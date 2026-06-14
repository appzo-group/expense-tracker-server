export interface IPaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IPaginated<T> {
  items: T[];
  meta: IMeta;
}

import type { Pagination } from "./common.types";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    pagination?: Pagination;
  };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

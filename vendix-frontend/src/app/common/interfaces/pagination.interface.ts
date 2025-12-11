/**
 * Pagination metadata interface
 * Contains information about the current pagination state
 */
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

/**
 * Pagination links interface
 * Contains URLs for navigation between pages
 */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

/**
 * Generic paginated response interface
 * @template T - The type of items in the data array
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

/**
 * Pagination state interface
 * Used for managing pagination state in components
 */
export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
  loading: boolean;
}


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginationState } from '../common/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private defaultPageSize = 15;
  private defaultPageSizeOptions = [5, 10, 15, 25, 50, 100];
  private maxPageSize = 100;

  /**
   * Create initial pagination state
   */
  createInitialState(pageSize: number = this.defaultPageSize): PaginationState {
    return {
      page: 1,
      perPage: pageSize,
      total: 0,
      loading: false,
    };
  }

  /**
   * Build query parameters object for API requests
   */
  buildQueryParams(state: PaginationState): { page: number; per_page: number } {
    return {
      page: Math.max(1, state.page),
      per_page: Math.min(this.maxPageSize, Math.max(1, state.perPage)),
    };
  }

  /**
   * Build query string for API requests
   */
  buildQueryString(state: PaginationState): string {
    const params = this.buildQueryParams(state);
    return `page=${params.page}&per_page=${params.per_page}`;
  }

  /**
   * Reset pagination state to page 1
   */
  resetToFirstPage(state: PaginationState): PaginationState {
    return {
      ...state,
      page: 1,
    };
  }

  /**
   * Update pagination state with new page
   */
  updatePage(state: PaginationState, page: number): PaginationState {
    return {
      ...state,
      page: Math.max(1, page),
    };
  }

  /**
   * Update pagination state with new page size
   * Resets to page 1 when page size changes
   */
  updatePageSize(state: PaginationState, perPage: number): PaginationState {
    return {
      ...state,
      perPage: Math.min(this.maxPageSize, Math.max(1, perPage)),
      page: 1, // Reset to first page when page size changes
    };
  }

  /**
   * Update pagination state from API response meta
   */
  updateFromMeta(state: PaginationState, meta: { current_page: number; per_page: number; total: number }): PaginationState {
    return {
      ...state,
      page: meta.current_page,
      perPage: meta.per_page,
      total: meta.total,
    };
  }

  /**
   * Set loading state
   */
  setLoading(state: PaginationState, loading: boolean): PaginationState {
    return {
      ...state,
      loading,
    };
  }

  /**
   * Validate page number against total pages
   */
  validatePage(state: PaginationState): PaginationState {
    const totalPages = this.getTotalPages(state);
    if (state.page > totalPages && totalPages > 0) {
      return {
        ...state,
        page: totalPages,
      };
    }
    return state;
  }

  /**
   * Get total number of pages
   */
  getTotalPages(state: PaginationState): number {
    if (state.total === 0 || state.perPage === 0) {
      return 0;
    }
    return Math.ceil(state.total / state.perPage);
  }

  /**
   * Get default page size
   */
  getDefaultPageSize(): number {
    return this.defaultPageSize;
  }

  /**
   * Get default page size options
   */
  getDefaultPageSizeOptions(): number[] {
    return [...this.defaultPageSizeOptions];
  }

  /**
   * Get max page size
   */
  getMaxPageSize(): number {
    return this.maxPageSize;
  }

  /**
   * Check if pagination is on first page
   */
  isFirstPage(state: PaginationState): boolean {
    return state.page === 1;
  }

  /**
   * Check if pagination is on last page
   */
  isLastPage(state: PaginationState): boolean {
    return state.page >= this.getTotalPages(state);
  }

  /**
   * Check if there are items to paginate
   */
  hasItems(state: PaginationState): boolean {
    return state.total > 0;
  }
}


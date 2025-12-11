import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  private paginationService = inject(PaginationService);

  @Input() currentPage: number = 1;

  private _pageSize?: number;

  @Input()
  set pageSize(value: number | undefined) {
    this._pageSize = value;
  }

  get pageSize(): number {
    return this._pageSize ?? this.paginationService.getDefaultPageSize();
  }

  @Input() totalItems: number = 0;

  private _pageSizeOptions?: number[];

  @Input()
  set pageSizeOptions(value: number[] | undefined) {
    this._pageSizeOptions = value;
  }

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions ?? this.paginationService.getDefaultPageSizeOptions();
  }

  @Input() showPageSizeOptions: boolean = true;
  @Input() loading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  // MatPaginator uses 0-based indexing, but our API uses 1-based
  get paginatorPageIndex(): number {
    return this.currentPage - 1;
  }

  // Display text for "Showing X to Y of Z items"
  get displayText(): string {
    if (this.totalItems === 0) {
      return 'Nenhum item encontrado';
    }

    const from = this.getFrom();
    const to = this.getTo();

    if (from === to) {
      return `Mostrando ${from} de ${this.totalItems} item${this.totalItems !== 1 ? 's' : ''}`;
    }

    return `Mostrando ${from} a ${to} de ${this.totalItems} item${this.totalItems !== 1 ? 's' : ''}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Ensure currentPage is always valid
    if (changes['currentPage'] && this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  onPageChange(event: PageEvent): void {
    // MatPaginator uses 0-based indexing, convert to 1-based for API
    const newPage = event.pageIndex + 1;

    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      this.pageChange.emit(newPage);
    }

    if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.pageSizeChange.emit(event.pageSize);
    }
  }

  private getFrom(): number {
    if (this.totalItems === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  private getTo(): number {
    const to = this.currentPage * this.pageSize;
    return Math.min(to, this.totalItems);
  }
}


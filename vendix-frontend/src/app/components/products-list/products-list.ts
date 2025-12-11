import { Component, inject, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IProduct } from '../../IProduct';
import { ProductService } from '../../services/product.service';
import { PaginationService } from '../../services/pagination.service';
import { PaginationState } from '../../common/interfaces/pagination.interface';
import { PaginationComponent } from '../pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-products-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    PaginationComponent,
    RouterLink
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList implements OnInit, OnChanges, OnDestroy {
  @Input() searchTerm: string = '';

  displayedColumns: string[] = ['product_name', 'product_category', 'unit_price', 'actions'];
  productsList: IProduct[] = [];
  isMobile = false;

  productService: ProductService = inject(ProductService);
  paginationService: PaginationService = inject(PaginationService);

  paginationState: PaginationState = this.paginationService.createInitialState();
  pageSizeOptions: number[] = this.paginationService.getDefaultPageSizeOptions();

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    // Setup debounced search
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadProducts();
      });

    this.loadProducts();
  }

  ngOnInit() {
    // Watch for mobile breakpoints
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      // Reset to page 1 when search term changes
      this.paginationState = this.paginationService.resetToFirstPage(this.paginationState);
      this.searchSubject$.next(this.searchTerm);
    }
  }

  loadProducts(): void {
    this.paginationState = this.paginationService.setLoading(this.paginationState, true);

    const params = this.paginationService.buildQueryParams(this.paginationState);

    this.productService.getProductsPaginated(params.page, params.per_page).subscribe({
      next: (response) => {
        this.productsList = response.data;
        this.paginationState = this.paginationService.updateFromMeta(
          this.paginationService.setLoading(this.paginationState, false),
          response.meta
        );
      },
      error: (error) => {
        console.error('Erro ao carregar produtos: ', error);
        this.snackBar.open('Erro ao carregar produtos.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['toast-error']
        });
        this.paginationState = this.paginationService.setLoading(this.paginationState, false);
      }
    });
  }

  onPageChange(page: number): void {
    this.paginationState = this.paginationService.updatePage(this.paginationState, page);
    this.loadProducts();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(perPage: number): void {
    this.paginationState = this.paginationService.updatePageSize(this.paginationState, perPage);
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onDelete(product_id: number): void {
    const confirmed = confirm('Tem certeza que deseja excluir este produto?');

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product_id).subscribe({
      next: (response) => {
        this.snackBar.open(response.message ?? 'Produto excluído com sucesso.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['toast-success']
        });

        // Reload the list - if current page becomes empty, go to previous page
        const currentPageItems = this.productsList.length;
        if (currentPageItems === 1 && this.paginationState.page > 1) {
          // If we're deleting the last item on this page and not on page 1, go to previous page
          this.paginationState = this.paginationService.updatePage(this.paginationState, this.paginationState.page - 1);
        }
        this.loadProducts();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir produto.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['toast-error']
        });
      },
    });
  }
}

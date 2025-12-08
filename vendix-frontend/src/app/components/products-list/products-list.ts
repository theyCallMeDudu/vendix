import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IProduct } from '../../IProduct';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList implements OnInit, OnDestroy {
  displayedColumns: string[] = ['product_name', 'product_category', 'unit_price', 'actions'];
  productsList: IProduct[] = [];
  filteredProductList: IProduct[] = [];
  isMobile = false;

  productService: ProductService = inject(ProductService);
  private destroy$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadProducts() {
    try {
      const products = await this.productService.getAllProducts();

      this.productsList = products;
      this.filteredProductList = products;
    } catch (error) {
      console.error('Erro ao carregar produtos: ', error);
    }
  }

  onDelete(product_id: number): void {
    const confirmed = confirm('Are you sure you want to delete this record?');

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product_id).subscribe({
      next: (response) => {
        this.snackBar.open(response.message ?? 'Product successfully deleted.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['toast-success']
        });

        // reloads the list
        this.loadProducts();
      },
      error: () => {
        this.snackBar.open('Error while deleting record.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['toast-error']
        });
      },
    });
  }
}

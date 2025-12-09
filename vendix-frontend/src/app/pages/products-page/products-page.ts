import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductsList } from '../../components/products-list/products-list';
import { Toolbar } from '../../components/toolbar/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-page',
  imports: [
    MatSnackBarModule,
    ProductsList,
    Toolbar
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  searchTerm: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const state = history.state as {
      toast?: { type: 'success' | 'error'; message: string };
    };

    if (state && state.toast) {
      this.snackBar.open(state.toast.message, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass:
          state.toast.type === 'success'
            ? ['toast-success']
            : ['toast-error']
      });
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
  }
}

import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IProduct } from '../../IProduct';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-products-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  displayedColumns: string[] = ['product_name', 'product_category', 'unit_price', 'actions'];
  productsList: IProduct[] = [];
  filteredProductList: IProduct[] = [];

  productService: ProductService = inject(ProductService);

  constructor() {
    this.loadProducts();
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
}

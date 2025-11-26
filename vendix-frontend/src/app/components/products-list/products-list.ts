import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IProduct } from '../../IProduct';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-list',
  imports: [MatTableModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  displayedColumns: string[] = ['product_name', 'unit_price', 'actions'];
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

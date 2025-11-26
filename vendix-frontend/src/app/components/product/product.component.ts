import { Component, inject, input } from '@angular/core';
import { IProduct } from '../../IProduct';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  imports: [RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class Product {
  product = input.required<IProduct>();

  productsList: IProduct[] = [];
  productService: ProductService = inject(ProductService);
  filteredProductList: IProduct[] = [];

  constructor() {
    this.productService
      .getAllProducts()
      .then((productsList: IProduct[]) => {
        this.productsList = productsList;
        this.filteredProductList = productsList;
      });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredProductList = this.productsList;
      return;
    }
    this.filteredProductList = this.productsList.filter((product) =>
      product?.product_name.toLowerCase().includes(text.toLowerCase())
    );
  }
}

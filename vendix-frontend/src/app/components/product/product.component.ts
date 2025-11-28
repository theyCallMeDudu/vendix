import { ChangeDetectionStrategy, Component, inject, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../IProduct';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IProductCategory } from '../../IProductCategory';
import { ProductCategoryService } from '../../services/product-category.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class Product {
  @Input() cancelRoute: string = '';

  product = input<IProduct>();

  productsList: IProduct[] = [];
  productCategoriesList: IProductCategory[] = [];

  productService: ProductService = inject(ProductService);
  productCategoryService: ProductCategoryService = inject(ProductCategoryService);

  constructor() {
    // this.productService
    //   .getProductById();

    this.loadProductCategories();
  }

  async loadProductCategories() {
    try {
      const productCategories = await this.productCategoryService.getAllProductCategories();

      this.productCategoriesList = productCategories;
    } catch (error) {
      console.error('Erro ao carregar categorias: ', error);
    }
  }
}

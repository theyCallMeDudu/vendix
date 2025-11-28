import { Component, input } from '@angular/core';
import { IProductCategory } from '../../IProductCategory';

@Component({
  selector: 'app-product-category',
  imports: [],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss',
})
export class ProductCategory {
  productCategory = input.required<IProductCategory>();

  productCategoriesList: IProductCategory[] = [];
  // productCategoryService
}

import { Component } from '@angular/core';
import { ProductCategory } from '../../components/product-category/product-category.component';
import { ProductCategoriesList } from '../../components/product-categories-list/product-categories-list';
import { Toolbar } from '../../components/toolbar/toolbar';

@Component({
  selector: 'app-product-categories-page',
  imports: [ProductCategoriesList, Toolbar],
  templateUrl: './product-categories-page.html',
  styleUrl: './product-categories-page.scss',
})
export class ProductCategoriesPage {

}

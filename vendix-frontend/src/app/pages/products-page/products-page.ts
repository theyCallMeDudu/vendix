import { Component } from '@angular/core';
import { ProductsList } from '../../components/products-list/products-list';
import { Product } from '../../components/product/product.component';
import { Toolbar } from '../../components/toolbar/toolbar';

@Component({
  selector: 'app-products-page',
  imports: [ProductsList, Product, Toolbar],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {

}

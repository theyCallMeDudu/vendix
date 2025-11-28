import { Component } from '@angular/core';
import { ProductsList } from '../../components/products-list/products-list';
import { Toolbar } from '../../components/toolbar/toolbar';

@Component({
  selector: 'app-products-page',
  imports: [ProductsList, Toolbar],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {

}

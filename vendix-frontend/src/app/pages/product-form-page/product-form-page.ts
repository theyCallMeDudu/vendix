import { Component } from '@angular/core';
import { Product } from '../../components/product/product.component';

@Component({
  selector: 'app-product-form-page',
  imports: [Product],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.scss',
})
export class ProductFormPage {

}


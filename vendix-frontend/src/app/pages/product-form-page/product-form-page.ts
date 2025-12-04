import { Component } from '@angular/core';
import { Product } from '../../components/product/product.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [Product],
  templateUrl: './product-form-page.html',
})
export class ProductFormPage {
  productId?: number;

  constructor(private route: ActivatedRoute) {
    const idParam = this.route.snapshot.paramMap.get('product_id');
    this.productId = idParam ? Number(idParam) : undefined;
  }
}


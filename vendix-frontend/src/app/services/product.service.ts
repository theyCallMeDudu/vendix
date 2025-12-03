import { Injectable } from '@angular/core';
import { IProduct } from '../IProduct';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsURL = 'http://localhost:8000/api/products';

  constructor(private http: HttpClient) {}

  async getAllProducts(): Promise<IProduct[]> {
    const response = await fetch(this.productsURL, {
      headers: {
        Accept: 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.status}`);
    }

    const json = (await response.json()) as ProductsResponse;
    console.log(json);

    return json.data ?? [];
  }

  createProduct(payload: ProductPayload): Observable<any> {
    return this.http.post(`${this.productsURL}`, payload);
  }
}

interface ProductsResponse {
  data: IProduct[];
}

export interface ProductPayload {
  product_name: string;
  unit_price: number;
  product_category_id: number;
}

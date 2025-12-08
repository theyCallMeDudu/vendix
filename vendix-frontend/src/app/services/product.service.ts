import { Injectable } from '@angular/core';
import { IProduct } from '../IProduct';
import { map, Observable } from 'rxjs';
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

  createProduct(payload: ProductPayload): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.productsURL}`, payload);
  }

  getProductById(product_id: number): Observable<IProduct> {
    return this.http
      .get<{ data: IProduct }>(`${this.productsURL}/${product_id}`)
      .pipe(
        map(response => response.data)
      );
  }

  updateProduct(product_id: number, payload: ProductPayload): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.productsURL}/${product_id}`, payload);
  }

  deleteProduct(product_id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.productsURL}/${product_id}`);
  }
}

interface ProductsResponse {
  data: IProduct[];
}

interface ProductResponse {
  message: string;
  data: IProduct;
}

export interface ProductPayload {
  product_name: string;
  unit_price: number;
  product_category_id: number;
}

export interface DeleteResponse {
  message: string;
}

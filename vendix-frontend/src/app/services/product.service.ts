import { Injectable } from '@angular/core';
import { IProduct } from '../IProduct';

interface ProductsResponse {
  data: IProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsURL = 'http://localhost:8000/api/products';

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

  // async getProductById(id: number): Promise<IProduct | undefined> {
  //   const data = await fetch(`${this.productsURL}?id=${id}`);
  //   const productJson = await data.json();
  //   return productJson[0] ?? [];
  // }

  // submitProduct(nome_produto: string, preco_unitario: number) {
  //   console.log(
  //     `Product received:  nome: ${nome_produto}, preço: ${preco_unitario}`
  //   );
  // }
}

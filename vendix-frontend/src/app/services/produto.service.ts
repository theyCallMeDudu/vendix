import { Injectable } from '@angular/core';
import { IProduto } from '../IProduto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  productsURL = 'http://localhost:3000/produtos';

  async getAllProducts(): Promise<IProduto[]> {
    const data = await fetch(this.productsURL);
    return (await data.json()) ?? [];
  }

  async getProductById(id: number): Promise<IProduto | undefined> {
    const data = await fetch(`${this.productsURL}?id=${id}`);
    const productJson = await data.json();
    return productJson[0] ?? [];
  }

  submitProduct(nome_produto: string, preco_unitario: number) {
    console.log(
      `Product received:  nome: ${nome_produto}, preço: ${preco_unitario}`
    );
  }
}

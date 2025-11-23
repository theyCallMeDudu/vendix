import { Injectable } from '@angular/core';
import { IProduto } from '../IProduto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  listaProdutos: IProduto[] = [
    {
      id: 1,
      nome_produto: 'Brownie de doce de leite',
      id_categoria: 1,
      preco_unitario: 7.00,
      img_produto: 'assets/brownie-doce-de-leite.jpg'
    },
    {
      id: 2,
      nome_produto: 'Bolo de cenoura com chocolate',
      id_categoria: 1,
      preco_unitario: 12.00,
      img_produto: '/assets/brownie-doce-de-leite.jpg'
    },
    {
      id: 3,
      nome_produto: 'Bolo de fubá com goiabada',
      id_categoria: 1,
      preco_unitario: 15.00,
      img_produto: '/assets/brownie-doce-de-leite.jpg'
    },
  ];

  getAllProducts(): IProduto[] {
    return this.listaProdutos;
  }

  getProductById(id: number): IProduto | undefined {
    return this.listaProdutos.find((produto) => produto.id === id);
  }

  submitProduct(nome_produto: string, preco_unitario: number) {
    console.log(
      `Product received:  nome: ${nome_produto}, preço: ${preco_unitario}`
    );
  }
}

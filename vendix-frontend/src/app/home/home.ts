import { Component, inject } from '@angular/core';
import { Produto } from '../produto/produto';
import { IProduto } from '../IProduto';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-home',
  imports: [Produto],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  productsList: IProduto[] = [];
  productService: ProdutoService = inject(ProdutoService);
  filteredProductList: IProduto[] = [];

  constructor() {
    this.productService
      .getAllProducts()
      .then((productsList: IProduto[]) => {
        this.productsList = productsList;
        this.filteredProductList = productsList;
      });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredProductList = this.productsList;
      return;
    }
    this.filteredProductList = this.productsList.filter((product) =>
      product?.nome_produto.toLowerCase().includes(text.toLowerCase())
    );
  }
}

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
  produtoService: ProdutoService = inject(ProdutoService);
  filteredProductList: IProduto[] = [];

  constructor() {
    this.productsList = this.produtoService.getAllProducts();
    this.filteredProductList = this.productsList;
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

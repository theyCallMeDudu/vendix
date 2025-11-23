import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { IProduto } from '../IProduto';
import { ProdutoService } from '../services/produto.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  route: ActivatedRoute = inject(ActivatedRoute);
  produtoService = inject(ProdutoService);
  produto: IProduto | undefined;
  formCadastro = new FormGroup({
    nome_produto: new FormControl(''),
    preco_unitario: new FormControl(0)
  });

  constructor() {
    const produtoId = parseInt(this.route.snapshot.params['id'], 10);
    this.produto = this.produtoService.getProductById(produtoId);
  }

  submitItem() {
    this.produtoService.submitProduct(
      this.formCadastro.value.nome_produto ?? '',
      this.formCadastro.value.preco_unitario ?? 0
    );
  }
}

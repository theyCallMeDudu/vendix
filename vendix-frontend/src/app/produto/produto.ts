import { Component, input } from '@angular/core';
import { IProduto } from '../IProduto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-produto',
  imports: [RouterLink],
  templateUrl: './produto.html',
  styleUrl: './produto.scss',
})
export class Produto {
  product = input.required<IProduto>();
}

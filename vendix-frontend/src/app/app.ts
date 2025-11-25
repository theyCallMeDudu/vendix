import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Layout } from './layout/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Layout],
  template: '<app-layout></app-layout>',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vendix-frontend');
}

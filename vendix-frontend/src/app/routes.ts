import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Produto } from './produto/produto';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home'
  },
  {
    path: 'products',
    component: Produto,
    title: 'Produtos'
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Details'
  },
];

export default routeConfig;

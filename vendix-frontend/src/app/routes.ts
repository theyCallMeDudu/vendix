import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Details } from './components/details/details';
import { ProductsPage } from './pages/products-page/products-page';
import { CategoriesPage } from './pages/categories-page/categories-page';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home'
  },
  {
    path: 'products',
    component: ProductsPage,
    title: 'Produtos'
  },
  {
    path: 'categories',
    component: CategoriesPage,
    title: 'Categorias'
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Details'
  },
];

export default routeConfig;

import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Details } from './components/details/details';
import { ProductsPage } from './pages/products-page/products-page';
import { ProductCategoriesPage } from './pages/product-categories/product-categories-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';

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
    path: 'products/new',
    component: ProductFormPage,
    title: 'Novo Produto'
  },
  {
    path: 'categories',
    component: ProductCategoriesPage,
    title: 'Categorias'
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Details'
  },
];

export default routeConfig;

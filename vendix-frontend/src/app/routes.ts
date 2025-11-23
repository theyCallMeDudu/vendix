import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home'
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Details'
  },
];

export default routeConfig;

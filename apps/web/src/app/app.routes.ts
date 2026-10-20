import { Routes } from '@angular/router';
import { SALON } from './core/config/salon.config';

export const routes: Routes = [
  {
    path: '',
    title: SALON.nome,
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  { path: '**', redirectTo: '' },
];

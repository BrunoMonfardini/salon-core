import { Routes } from '@angular/router';
import { SALON } from '../../core/config/salon.config';
import { BookingShell } from './booking-shell';
import { passoGuard } from './passo.guard';
import { PASSOS } from './passos';

function titulo(passo: number): string {
  return `${PASSOS[passo].rotulo} | ${SALON.nome}`;
}

export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: BookingShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: PASSOS[0].path },
      {
        path: PASSOS[0].path,
        title: titulo(0),
        canActivate: [passoGuard(0)],
        loadComponent: () =>
          import('./profissional/escolha-profissional').then((m) => m.EscolhaProfissional),
      },
      {
        path: PASSOS[1].path,
        title: titulo(1),
        canActivate: [passoGuard(1)],
        loadComponent: () => import('./data-horario/data-horario').then((m) => m.DataHorario),
      },
      {
        path: PASSOS[2].path,
        title: titulo(2),
        canActivate: [passoGuard(2)],
        loadComponent: () => import('./confirmacao/confirmacao').then((m) => m.Confirmacao),
      },
    ],
  },
];

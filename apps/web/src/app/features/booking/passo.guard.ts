import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingStore } from '../../core/booking/booking.store';
import { urlDoPasso } from './passos';

/** Só abre o passo se os anteriores estão completos; senão, volta ao primeiro que falta. */
export function passoGuard(passo: number): CanActivateFn {
  return () => {
    const concluidos = inject(BookingStore).passosConcluidos();
    return passo <= concluidos || inject(Router).parseUrl(urlDoPasso(concluidos));
  };
}

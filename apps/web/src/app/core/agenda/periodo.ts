import { Periodo } from '../models';

/** Dois períodos se chocam quando um começa antes do outro terminar. Encostar não conta. */
export function sobrepoe(a: Periodo, b: Periodo): boolean {
  return a.inicio < b.fim && b.inicio < a.fim;
}

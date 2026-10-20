import { describe, expect, it } from '@jest/globals';
import { sobrepoe } from './periodo';

const corte = { inicio: '2026-10-20T10:00', fim: '2026-10-20T10:30' };

describe('sobrepoe', () => {
  it.each([
    ['começa no meio', { inicio: '2026-10-20T10:15', fim: '2026-10-20T10:45' }],
    ['contém o outro', { inicio: '2026-10-20T09:00', fim: '2026-10-20T11:00' }],
    ['é igual', corte],
  ])('choca quando %s', (_, outro) => {
    expect(sobrepoe(corte, outro)).toBe(true);
    expect(sobrepoe(outro, corte)).toBe(true);
  });

  it.each([
    ['termina quando o outro começa', { inicio: '2026-10-20T09:30', fim: '2026-10-20T10:00' }],
    ['começa quando o outro termina', { inicio: '2026-10-20T10:30', fim: '2026-10-20T11:00' }],
    ['é em outro dia', { inicio: '2026-10-21T10:00', fim: '2026-10-21T10:30' }],
  ])('não choca quando %s', (_, outro) => {
    expect(sobrepoe(corte, outro)).toBe(false);
  });
});

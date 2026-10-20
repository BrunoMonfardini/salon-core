import { describe, expect, it } from '@jest/globals';
import { statusDoProfissional } from './status';

const HOJE = '2026-10-20';

describe('statusDoProfissional', () => {
  it('disponível hoje, com o próximo horário', () => {
    expect(statusDoProfissional({ data: HOJE, horario: '14:30' }, HOJE)).toEqual({
      texto: 'Disponível hoje às 14:30',
      tom: 'success',
      disponivel: true,
    });
  });

  it('em outro dia, mostra dia da semana e data', () => {
    const status = statusDoProfissional({ data: '2026-10-24', horario: '09:00' }, HOJE);
    expect(status.texto).toMatch(/^Próximo horário: sábado, 24\/10 às 09:00$/);
    expect(status.tom).toBe('info');
    expect(status.disponivel).toBe(true);
  });

  it('sem vaga na janela, fica indisponível', () => {
    expect(statusDoProfissional(null, HOJE)).toEqual({
      texto: 'Sem horários nos próximos 14 dias',
      tom: 'neutral',
      disponivel: false,
    });
  });
});

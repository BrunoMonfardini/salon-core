import { formatBr, weekday, weekdayNames } from '@brunomonfardini/ui';
import { DIAS_DE_AGENDA, ProximoHorario } from '../../../core/agenda/disponibilidade';

export type TomDoStatus = 'success' | 'info' | 'neutral';

export interface StatusDoProfissional {
  readonly texto: string;
  readonly tom: TomDoStatus;
  readonly disponivel: boolean;
}

/** "sábado, 24/10" */
function diaCurto(data: string): string {
  return `${weekdayNames()[weekday(data)].long}, ${formatBr(data).slice(0, 5)}`;
}

/** Como mostrar a disponibilidade do profissional a partir do próximo horário livre dele. */
export function statusDoProfissional(
  proximo: ProximoHorario | null,
  hoje: string,
): StatusDoProfissional {
  if (!proximo) {
    return {
      texto: `Sem horários nos próximos ${DIAS_DE_AGENDA} dias`,
      tom: 'neutral',
      disponivel: false,
    };
  }
  if (proximo.data === hoje) {
    return { texto: `Disponível hoje às ${proximo.horario}`, tom: 'success', disponivel: true };
  }
  return {
    texto: `Próximo horário: ${diaCurto(proximo.data)} às ${proximo.horario}`,
    tom: 'info',
    disponivel: true,
  };
}

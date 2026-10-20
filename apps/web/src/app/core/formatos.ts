import { formatCents } from '@brunomonfardini/ui';
import { Servico } from './models';

/** "Corte · 30 min · R$ 50,00": igual na escolha do serviço e no resumo da confirmação. */
export function rotuloDoServico({ nome, duracaoMin, precoCentavos }: Servico): string {
  return `${nome} · ${duracaoMin} min · ${formatCents(precoCentavos)}`;
}

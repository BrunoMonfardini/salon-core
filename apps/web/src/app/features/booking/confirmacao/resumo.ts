import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ARG_LIST, dayLabel } from '@brunomonfardini/ui';
import { SALON_CONFIG, enderecoCompleto } from '../../../core/config/salon.config';
import { rotuloDoServico } from '../../../core/formatos';
import { Profissional, Servico } from '../../../core/models';

/** As escolhas completas do agendamento, antes ou depois de confirmar. */
export interface Escolhas {
  readonly profissional: Profissional;
  readonly servico: Servico;
  readonly data: string;
  readonly horario: string;
}

/** Resumo do agendamento: o mesmo antes de confirmar e na tela de concluído. */
@Component({
  selector: 'app-resumo',
  imports: [ARG_LIST],
  template: `
    <ul arg-list divided bordered>
      @for (item of itens(); track item.rotulo) {
        <li arg-list-item>
          <span class="texto-secundario">{{ item.rotulo }}</span>
          <strong>{{ item.valor }}</strong>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resumo {
  readonly escolhas = input.required<Escolhas>();
  private readonly endereco = enderecoCompleto(inject(SALON_CONFIG).endereco);

  protected readonly itens = computed(() => {
    const { profissional, servico, data, horario } = this.escolhas();
    return [
      { rotulo: 'Profissional', valor: profissional.nome },
      { rotulo: 'Serviço', valor: rotuloDoServico(servico) },
      { rotulo: 'Data', valor: dayLabel(data) },
      { rotulo: 'Horário', valor: horario },
      { rotulo: 'Local', valor: this.endereco },
    ];
  });
}

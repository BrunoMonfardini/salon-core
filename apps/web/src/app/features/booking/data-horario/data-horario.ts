import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { Router } from '@angular/router';
import { ARG_CHOICE, ARG_FIELD, ArgButton, ArgDateInput, ArgTimeSlots } from '@brunomonfardini/ui';
import {
  AGORA,
  DIAS_DE_AGENDA,
  diasComVaga,
  diasDaJanela,
  horariosDoDia,
} from '../../../core/agenda/disponibilidade';
import { BookingStore } from '../../../core/booking/booking.store';
import { AgendaRepo, ServicosRepo } from '../../../core/data/repos';
import { rotuloDoServico } from '../../../core/formatos';
import { Servico } from '../../../core/models';
import { urlDoPasso } from '../passos';

@Component({
  selector: 'app-data-horario',
  imports: [ARG_CHOICE, ARG_FIELD, ArgButton, ArgDateInput, ArgTimeSlots],
  templateUrl: './data-horario.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataHorario {
  private readonly servicosRepo = inject(ServicosRepo);
  private readonly agendaRepo = inject(AgendaRepo);
  private readonly router = inject(Router);
  private readonly agora = inject(AGORA)();

  protected readonly store = inject(BookingStore);
  protected readonly rotuloDoServico = rotuloDoServico;
  private readonly janela = diasDaJanela(this.agora);
  protected readonly hoje = this.janela[0];
  protected readonly ultimoDia = this.janela[DIAS_DE_AGENDA - 1];

  private readonly expediente = computed(() => this.store.profissional()?.expediente ?? {});

  private readonly servicos = resource({ loader: () => this.servicosRepo.listar() });
  /** Só os serviços que o profissional escolhido oferece. */
  protected readonly servicosDoProfissional = computed(() => {
    const ids = this.store.profissional()?.servicoIds ?? [];
    return (this.servicos.value() ?? []).filter((s) => ids.includes(s.id));
  });

  private readonly ocupados = resource({
    params: () => this.store.profissional()?.id,
    loader: ({ params: id }) => this.agendaRepo.ocupados(id, this.hoje, this.ultimoDia),
  });

  private readonly diasLivres = computed(() => {
    const servico = this.store.servico();
    if (!servico) return new Set<string>();
    return diasComVaga(
      this.expediente(),
      servico.duracaoMin,
      this.ocupados.value() ?? [],
      this.agora,
    );
  });
  /** O calendário bloqueia os dias sem nenhum horário em que o serviço caiba. */
  protected readonly diaBloqueado = computed(() => {
    const livres = this.diasLivres();
    return (data: string) => !livres.has(data);
  });

  protected readonly horarios = computed(() => {
    const servico = this.store.servico();
    const data = this.store.data();
    if (!servico || !data) return [];
    return horariosDoDia(
      this.expediente(),
      data,
      servico.duracaoMin,
      this.ocupados.value() ?? [],
      this.agora,
    );
  });

  protected readonly podeContinuar = computed(() => this.store.passosConcluidos() >= 2);

  protected escolherServico(servico: Servico): void {
    this.store.escolherServico(servico);
  }

  protected escolherData(data: string | null): void {
    if (data) this.store.escolherData(data);
  }

  protected escolherHorario(horario: string | null): void {
    if (horario) this.store.escolherHorario(horario);
  }

  protected continuar(): void {
    void this.router.navigateByUrl(urlDoPasso(2));
  }
}

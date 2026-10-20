import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { Router } from '@angular/router';
import { ArgAvatar, ArgBadge, ArgSkeleton, addDays } from '@brunomonfardini/ui';
import { AGORA, DIAS_DE_AGENDA, proximoHorario } from '../../../core/agenda/disponibilidade';
import { BookingStore } from '../../../core/booking/booking.store';
import { AgendaRepo, ProfissionaisRepo, ServicosRepo } from '../../../core/data/repos';
import { Profissional } from '../../../core/models';
import { OpcaoCard } from '../../../shared/ui/opcao-card/opcao-card';
import { urlDoPasso } from '../passos';
import { statusDoProfissional } from './status';

@Component({
  selector: 'app-escolha-profissional',
  imports: [ArgAvatar, ArgBadge, ArgSkeleton, OpcaoCard],
  templateUrl: './escolha-profissional.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscolhaProfissional {
  private readonly profissionaisRepo = inject(ProfissionaisRepo);
  private readonly servicosRepo = inject(ServicosRepo);
  private readonly agendaRepo = inject(AgendaRepo);
  private readonly agora = inject(AGORA);
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly escolhido = this.store.profissional;
  protected readonly esqueletos = [1, 2, 3];

  /** Cada profissional com o status do próximo horário em que cabe o serviço mais curto dele. */
  protected readonly opcoes = resource({
    loader: async () => {
      const agora = this.agora();
      const ate = addDays(agora.data, DIAS_DE_AGENDA - 1);
      const [profissionais, servicos] = await Promise.all([
        this.profissionaisRepo.listar(),
        this.servicosRepo.listar(),
      ]);
      return Promise.all(
        profissionais.map(async (profissional) => {
          const ocupados = await this.agendaRepo.ocupados(profissional.id, agora.data, ate);
          const duracoes = servicos
            .filter((s) => profissional.servicoIds.includes(s.id))
            .map((s) => s.duracaoMin);
          const proximo = duracoes.length
            ? proximoHorario(profissional.expediente, Math.min(...duracoes), ocupados, agora)
            : null;
          return { profissional, status: statusDoProfissional(proximo, agora.data) };
        }),
      );
    },
  });

  protected escolher(profissional: Profissional): void {
    this.store.escolherProfissional(profissional);
    void this.router.navigateByUrl(urlDoPasso(1));
  }
}

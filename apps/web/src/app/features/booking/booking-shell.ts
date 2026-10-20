import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ArgLink, ArgStepper } from '@brunomonfardini/ui';
import { filter, map } from 'rxjs';
import { PASSOS, passoDaUrl, urlDoPasso } from './passos';

/** Moldura das telas do agendamento: tracker de passos no topo e a tela do passo abaixo. */
@Component({
  selector: 'app-booking-shell',
  imports: [RouterLink, RouterOutlet, ArgLink, ArgStepper],
  template: `
    <main class="pagina pilha">
      <a arg-link variant="muted" routerLink="/">Voltar ao início</a>
      <arg-stepper
        label="Etapas do agendamento"
        [steps]="rotulos"
        [current]="atual()"
        navigable
        (stepSelect)="irPara($event)"
      />
      <router-outlet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingShell {
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly rotulos = PASSOS.map((p) => p.rotulo);
  protected readonly atual = computed(() => passoDaUrl(this.url()));

  /** O guard decide se o passo pode abrir. */
  protected irPara(passo: number): void {
    void this.router.navigateByUrl(urlDoPasso(passo));
  }
}

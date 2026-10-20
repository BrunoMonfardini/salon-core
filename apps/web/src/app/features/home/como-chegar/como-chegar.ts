import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ARG_CARD, ArgButton, ArgIcon } from '@brunomonfardini/ui';
import { SALON_CONFIG, enderecoCompleto } from '../../../core/config/salon.config';
import { comoChegarLinks } from '../../../shared/links/como-chegar';

@Component({
  selector: 'app-como-chegar',
  imports: [ARG_CARD, ArgButton, ArgIcon],
  templateUrl: './como-chegar.html',
  styleUrl: './como-chegar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComoChegar {
  private readonly salon = inject(SALON_CONFIG);
  private readonly links = comoChegarLinks(this.salon);

  protected readonly endereco = enderecoCompleto(this.salon.endereco);
  // A URL vem só da config (nunca de entrada do usuário), por isso pode ir para o iframe
  protected readonly mapa = inject(DomSanitizer).bypassSecurityTrustResourceUrl(this.links.mapa);
  protected readonly acoes = [
    { rotulo: 'Ver rota no Maps', url: this.links.rota },
    { rotulo: 'Chamar Uber', url: this.links.uber },
    { rotulo: 'Chamar 99', url: this.links.noventaENove },
  ];
}

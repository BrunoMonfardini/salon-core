import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ARG_CARD, ArgBadge } from '@brunomonfardini/ui';

/**
 * Card inteiro clicável para escolher uma opção (profissional, serviço…). Marca a escolhida
 * com borda e selo, e anuncia o estado com `aria-pressed`.
 *
 * Áreas projetadas: `[opcaoMidia]` ao lado do título, o conteúdo padrão abaixo dele e
 * `[opcaoRodape]` no rodapé, antes do selo de escolhido.
 */
@Component({
  selector: 'app-opcao-card',
  imports: [NgTemplateOutlet, ARG_CARD, ArgBadge],
  template: `
    <ng-template #botao>
      <button
        arg-card-link
        type="button"
        [disabled]="desabilitada()"
        [attr.aria-pressed]="escolhida()"
        (click)="escolher.emit()"
      >
        {{ titulo() }}
      </button>
    </ng-template>

    <article arg-card class="opcao" [class.opcao--escolhida]="escolhida()">
      <div arg-card-header class="acoes">
        <ng-content select="[opcaoMidia]" />
        @if (nivel() === 2) {
          <h2 arg-card-title><ng-container [ngTemplateOutlet]="botao" /></h2>
        } @else {
          <h3 arg-card-title><ng-container [ngTemplateOutlet]="botao" /></h3>
        }
      </div>
      <ng-content />
      <footer arg-card-actions class="acoes">
        <ng-content select="[opcaoRodape]" />
        @if (escolhida()) {
          <span arg-badge tone="primary">Escolhido</span>
        }
      </footer>
    </article>
  `,
  styles: `
    :host,
    .opcao {
      display: block;
      height: 100%;
    }

    .opcao--escolhida {
      border-color: var(--arg-color-primary);
      box-shadow: 0 0 0 1px var(--arg-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpcaoCard {
  readonly titulo = input.required<string>();
  readonly escolhida = input(false, { transform: booleanAttribute });
  readonly desabilitada = input(false, { transform: booleanAttribute });
  /** Nível do título: 2 quando os cards são as seções da tela, 3 dentro de uma seção. */
  readonly nivel = input<2 | 3>(2);
  readonly escolher = output<void>();
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ARG_CARD, ArgBadge, formatCents } from '@brunomonfardini/ui';
import { Produto } from '../../../core/models';

/** Card de um produto, igual na vitrine do início e na página do shop. */
@Component({
  selector: 'app-produto-card',
  imports: [ARG_CARD, ArgBadge],
  template: `
    <article arg-card class="produto">
      <h3 arg-card-title>{{ produto().nome }}</h3>
      <p arg-card-description>{{ produto().descricao }}</p>
      <footer arg-card-actions class="acoes">
        <strong>{{ preco() }}</strong>
        @if (!produto().disponivel) {
          <span arg-badge tone="neutral">Esgotado</span>
        }
      </footer>
    </article>
  `,
  styles: `
    :host,
    .produto {
      display: block;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutoCard {
  readonly produto = input.required<Produto>();
  protected readonly preco = computed(() => formatCents(this.produto().precoCentavos));
}

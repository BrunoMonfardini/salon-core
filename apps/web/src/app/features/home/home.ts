import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARG_CARD, ArgButton, ArgIcon, ArgLink } from '@brunomonfardini/ui';
import { SALON_CONFIG } from '../../core/config/salon.config';
import { ProdutosRepo } from '../../core/data/repos';
import { ProdutoCard } from '../../shared/ui/produto-card/produto-card';
import { ComoChegar } from './como-chegar/como-chegar';

/** Quantos produtos aparecem no destaque do shop. */
const DESTAQUES = 3;

@Component({
  selector: 'app-home',
  imports: [RouterLink, ARG_CARD, ArgButton, ArgIcon, ArgLink, ComoChegar, ProdutoCard],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly produtosRepo = inject(ProdutosRepo);

  protected readonly salon = inject(SALON_CONFIG);
  private readonly produtos = resource({ loader: () => this.produtosRepo.listar() });
  protected readonly destaques = computed(() =>
    (this.produtos.value() ?? []).filter((p) => p.disponivel).slice(0, DESTAQUES),
  );
}

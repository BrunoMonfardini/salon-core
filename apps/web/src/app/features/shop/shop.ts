import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArgEmptyState, ArgLink, ArgSkeleton } from '@brunomonfardini/ui';
import { ProdutosRepo } from '../../core/data/repos';
import { ProdutoCard } from '../../shared/ui/produto-card/produto-card';

@Component({
  selector: 'app-shop',
  imports: [RouterLink, ArgEmptyState, ArgLink, ArgSkeleton, ProdutoCard],
  templateUrl: './shop.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly produtosRepo = inject(ProdutosRepo);
  protected readonly produtos = resource({ loader: () => this.produtosRepo.listar() });
  /** Quantos cards de carregamento mostrar enquanto a lista não chega. */
  protected readonly esqueletos = [1, 2, 3];
}

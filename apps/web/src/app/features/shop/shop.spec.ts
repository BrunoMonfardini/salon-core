import { describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PRODUTOS } from '../../core/data/mock/dados';
import { ProdutosRepo } from '../../core/data/repos';
import { Produto } from '../../core/models';
import { Shop } from './shop';

async function renderizar(produtos: readonly Produto[]): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: ProdutosRepo, useValue: { listar: async () => produtos } },
    ],
  });
  const fixture = TestBed.createComponent(Shop);
  await fixture.whenStable();
  return fixture.nativeElement;
}

describe('Shop', () => {
  it('lista todos os produtos, inclusive os esgotados', async () => {
    const el = await renderizar(PRODUTOS);
    expect(el.querySelectorAll('app-produto-card')).toHaveLength(PRODUTOS.length);
    expect(el.textContent).toContain('Esgotado');
  });

  it('avisa que o pagamento é na barbearia', async () => {
    expect((await renderizar(PRODUTOS)).textContent).toContain('pague na hora do atendimento');
  });

  it('mostra o estado vazio sem produtos', async () => {
    expect((await renderizar([])).textContent).toContain('Nenhum produto por enquanto');
  });
});

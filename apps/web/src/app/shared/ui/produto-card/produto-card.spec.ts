import { describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { PRODUTOS } from '../../../core/data/mock/dados';
import { Produto } from '../../../core/models';
import { ProdutoCard } from './produto-card';

function renderizar(produto: Produto): HTMLElement {
  const fixture = TestBed.createComponent(ProdutoCard);
  fixture.componentRef.setInput('produto', produto);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('ProdutoCard', () => {
  const [pomada] = PRODUTOS;

  it('mostra nome, descrição e preço em reais', () => {
    const texto = renderizar(pomada).textContent?.replace(/\s+/g, ' ');
    expect(texto).toContain('Pomada modeladora');
    expect(texto).toContain('Fixação média, efeito seco.');
    expect(texto).toMatch(/R\$\s45,00/);
  });

  it('marca como esgotado só o produto indisponível', () => {
    expect(renderizar(pomada).textContent).not.toContain('Esgotado');
    expect(renderizar({ ...pomada, disponivel: false }).textContent).toContain('Esgotado');
  });
});

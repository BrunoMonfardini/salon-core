import { beforeEach, describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { SALON } from '../../../core/config/salon.config';
import { comoChegarLinks } from '../../../shared/links/como-chegar';
import { provideTela } from '../../../../testing/providers';
import { ComoChegar } from './como-chegar';

function renderizar(): HTMLElement {
  const fixture = TestBed.createComponent(ComoChegar);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('ComoChegar', () => {
  const links = comoChegarLinks(SALON);
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTela() });
  });

  it('mostra o endereço e o mapa com o ponto da barbearia', () => {
    const el = renderizar();
    expect(el.textContent).toContain('Rua França, 77 - Parque das Nações, Santo André - SP');
    expect(el.querySelector('iframe')?.getAttribute('src')).toBe(links.mapa);
  });

  it('abre rota, Uber e 99 em outra aba', () => {
    const botoes = [...renderizar().querySelectorAll('a')];
    expect(botoes.map((a) => a.getAttribute('href'))).toEqual([
      links.rota,
      links.uber,
      links.noventaENove,
    ]);
    for (const a of botoes) {
      expect(a.target).toBe('_blank');
      expect(a.rel).toBe('noopener');
      expect(a.textContent).toContain('abre em outra aba');
    }
  });
});

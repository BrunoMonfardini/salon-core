import { beforeEach, describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { SALON } from '../../core/config/salon.config';
import { provideTela } from '../../../testing/providers';
import { Home } from './home';

async function renderizar(): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(Home);
  await fixture.whenStable();
  return fixture.nativeElement;
}

describe('Home', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTela() });
  });

  it('abre com o banner da barbearia: nome, resumo e botão de agendar', async () => {
    const banner = (await renderizar()).querySelector('.banner');
    expect(banner?.querySelector('h1')?.textContent).toBe(SALON.nome);
    expect(banner?.textContent).toContain(SALON.resumo);
    const cta = banner?.querySelector('a[href="/agendar/profissional"]');
    expect(cta?.textContent).toContain('Agendar horário');
    expect(cta?.classList).toContain('banner__acao');
  });

  it('leva ao shop sem mostrar produtos na tela inicial', async () => {
    const el = await renderizar();
    expect(el.querySelector('a[href="/shop"]')?.textContent).toContain('Shop');
    expect(el.querySelector('app-produto-card')).toBeNull();
  });

  it('termina com o como chegar', async () => {
    const main = (await renderizar()).querySelector('main');
    expect(main?.lastElementChild?.tagName.toLowerCase()).toBe('app-como-chegar');
  });
});

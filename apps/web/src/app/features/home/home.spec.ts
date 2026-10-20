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

  it('apresenta a barbearia com nome e resumo', async () => {
    const el = await renderizar();
    expect(el.querySelector('h1')?.textContent).toBe(SALON.nome);
    expect(el.textContent).toContain(SALON.resumo);
  });

  it('leva para o primeiro passo do agendamento', async () => {
    const cta = (await renderizar()).querySelector('a[href="/agendar/profissional"]');
    expect(cta?.textContent).toContain('Agendar horário');
  });

  it('destaca só produtos disponíveis e leva para o shop', async () => {
    const el = await renderizar();
    const nomes = [...el.querySelectorAll('app-produto-card h3')].map((h) => h.textContent);
    expect(nomes).toEqual(['Pomada modeladora', 'Óleo para barba']);
    expect(el.querySelector('a[href="/shop"]')).not.toBeNull();
  });
});

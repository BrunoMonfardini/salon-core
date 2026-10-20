import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AGORA } from '../../../core/agenda/disponibilidade';
import { BookingStore } from '../../../core/booking/booking.store';
import { PROFISSIONAIS } from '../../../core/data/mock/dados';
import { ProfissionaisRepo } from '../../../core/data/repos';
import { provideTela } from '../../../../testing/providers';
import { EscolhaProfissional } from './escolha-profissional';

// Terça, 10h: Rafael e Thiago trabalham; Diego só no fim de semana
const TERCA_10H = { data: '2026-10-20', minutos: 600 };

async function renderizar(): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(EscolhaProfissional);
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture.nativeElement;
}

function cards(el: HTMLElement) {
  return [...el.querySelectorAll('article')].map((card) => ({
    nome: card.querySelector('button')?.textContent?.trim(),
    status: card.querySelector('[arg-badge]')?.textContent?.trim(),
    desabilitado: card.querySelector('button')?.disabled,
  }));
}

describe('EscolhaProfissional', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTela(), { provide: AGORA, useValue: () => TERCA_10H }],
    });
  });

  it('lista os profissionais com a disponibilidade de cada um', async () => {
    const lista = cards(await renderizar());
    expect(lista[0]).toEqual({
      nome: 'Rafael',
      status: 'Disponível hoje às 10:30',
      desabilitado: false,
    });
    expect(lista[2].nome).toBe('Diego');
    expect(lista[2].status).toMatch(/^Próximo horário: sábado, 24\/10 às 08:00$/);
  });

  it('desabilita quem não tem horário na janela de agenda', async () => {
    const semExpediente = { ...PROFISSIONAIS[0], expediente: {} };
    TestBed.overrideProvider(ProfissionaisRepo, {
      useValue: { listar: async () => [semExpediente] },
    });
    const [card] = cards(await renderizar());
    expect(card.status).toBe('Sem horários nos próximos 14 dias');
    expect(card.desabilitado).toBe(true);
  });

  it('escolher grava no fluxo e segue para o horário', async () => {
    const navegar = jest.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const el = await renderizar();
    el.querySelector('button')?.click();
    expect(TestBed.inject(BookingStore).profissional()?.id).toBe('rafael');
    expect(navegar).toHaveBeenCalledWith('/agendar/horario');
  });
});

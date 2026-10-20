import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ArgDateInput } from '@brunomonfardini/ui';
import { AGORA } from '../../../core/agenda/disponibilidade';
import { BookingStore } from '../../../core/booking/booking.store';
import { PROFISSIONAIS } from '../../../core/data/mock/dados';
import { provideTela } from '../../../../testing/providers';
import { DataHorario } from './data-horario';

// Terça, 10h, com o Rafael (terça a sábado; corte, barba e corte e barba)
const TERCA_10H = { data: '2026-10-20', minutos: 600 };

describe('DataHorario', () => {
  let fixture: ComponentFixture<DataHorario>;
  let el: HTMLElement;
  let store: BookingStore;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [...provideTela(), { provide: AGORA, useValue: () => TERCA_10H }],
    });
    store = TestBed.inject(BookingStore);
    store.escolherProfissional(PROFISSIONAIS[0]);
    fixture = TestBed.createComponent(DataHorario);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function atualizar() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function radio(rotulo: RegExp): HTMLInputElement {
    const label = [...el.querySelectorAll('label')].find((l) => rotulo.test(l.textContent ?? ''));
    return label?.querySelector('input') as HTMLInputElement;
  }

  function horario(hora: string): HTMLInputElement {
    return el.querySelector(`fieldset input[value="${hora}"]`) as HTMLInputElement;
  }

  function dataInput(): ArgDateInput {
    return fixture.debugElement.query(By.directive(ArgDateInput)).componentInstance;
  }

  async function escolherCorteHoje() {
    radio(/^\s*Corte ·/).click();
    await atualizar();
    fixture.debugElement
      .query(By.directive(ArgDateInput))
      .triggerEventHandler('valueChange', '2026-10-20');
    await atualizar();
  }

  it('mostra só os serviços que o profissional oferece', () => {
    const servicos = [...el.querySelectorAll('label')].map((l) =>
      l.textContent?.split('·')[0].trim(),
    );
    expect(servicos).toEqual(['Corte', 'Barba', 'Corte e barba']);
  });

  it('a data só aparece depois do serviço, e o horário depois da data', async () => {
    expect(el.querySelector('input[arg-date]')).toBeNull();
    radio(/^\s*Corte ·/).click();
    await atualizar();
    expect(store.servico()?.id).toBe('corte');
    expect(el.querySelector('input[arg-date]')).not.toBeNull();
    expect(el.querySelector('fieldset[arg-time-slots]')).toBeNull();
  });

  it('bloqueia no calendário os dias sem vaga e fora da janela', async () => {
    radio(/^\s*Corte ·/).click();
    await atualizar();
    const bloqueado = dataInput().blocked();
    expect(bloqueado?.('2026-10-26')).toBe(true); // segunda: folga
    expect(bloqueado?.('2026-10-21')).toBe(false);
    expect(dataInput().min()).toBe('2026-10-20');
    expect(dataInput().max()).toBe('2026-11-02');
  });

  it('lista os horários livres do dia, sem os que já passaram', async () => {
    await escolherCorteHoje();
    expect(horario('10:00').disabled).toBe(true);
    expect(horario('10:30').disabled).toBe(false);
  });

  it('com serviço, data e horário, continua para a confirmação', async () => {
    const navegar = jest.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const continuar = () => el.querySelector<HTMLButtonElement>('button[arg-button]');
    await escolherCorteHoje();
    expect(continuar()?.disabled).toBe(true);

    horario('10:30').click();
    await atualizar();
    expect(store.horario()).toBe('10:30');
    expect(continuar()?.disabled).toBe(false);

    continuar()?.click();
    expect(navegar).toHaveBeenCalledWith('/agendar/confirmar');
  });
});

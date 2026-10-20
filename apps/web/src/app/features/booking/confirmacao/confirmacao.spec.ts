import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ArgToast } from '@brunomonfardini/ui';
import { BookingStore } from '../../../core/booking/booking.store';
import { PROFISSIONAIS, SERVICOS } from '../../../core/data/mock/dados';
import { AgendaRepo, HorarioIndisponivelError } from '../../../core/data/repos';
import { NovoAgendamento } from '../../../core/models';
import { provideTela } from '../../../../testing/providers';
import { Confirmacao } from './confirmacao';

describe('Confirmacao', () => {
  let fixture: ComponentFixture<Confirmacao>;
  let el: HTMLElement;
  let store: BookingStore;
  let criar: jest.Mock<(novo: NovoAgendamento) => Promise<unknown>>;

  beforeEach(async () => {
    criar = jest.fn(async (novo: NovoAgendamento) => ({ ...novo, id: 'ag-7' }));
    TestBed.configureTestingModule({
      providers: [...provideTela(), { provide: AgendaRepo, useValue: { criar } }],
    });
    store = TestBed.inject(BookingStore);
    store.escolherProfissional(PROFISSIONAIS[0]);
    store.escolherServico(SERVICOS[2]); // Corte e barba, 60 min
    store.escolherData('2026-10-20');
    store.escolherHorario('10:30');
    fixture = TestBed.createComponent(Confirmacao);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function atualizar() {
    // O envio é assíncrono e o whenStable não espera a promessa da agenda
    await new Promise((resolver) => setTimeout(resolver));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function digitar(seletor: string, valor: string) {
    const input = el.querySelector<HTMLInputElement>(seletor);
    if (!input) throw new Error(`Campo ${seletor} não encontrado`);
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  }

  async function enviar(nome: string, telefone: string) {
    digitar('input[arg-input]', nome);
    digitar('input[arg-mask]', telefone);
    el.querySelector('form')?.dispatchEvent(new Event('submit'));
    await atualizar();
  }

  it('resume profissional, serviço, data, horário e local', () => {
    const texto = el.textContent?.replace(/\s+/g, ' ');
    expect(texto).toContain('Rafael');
    expect(texto).toContain('Corte e barba · 60 min');
    expect(texto).toContain('terça-feira, 20 de outubro de 2026');
    expect(texto).toContain('10:30');
    expect(texto).toContain('Rua França, 77');
  });

  it('não envia sem nome e celular válidos, e diz o que falta', async () => {
    await enviar('', '1199');
    expect(criar).not.toHaveBeenCalled();
    expect(el.textContent).toContain('Diga como podemos te chamar.');
    expect(el.textContent).toContain('Informe um celular com DDD.');
  });

  it('grava na agenda do profissional com o nome e o telefone do cliente', async () => {
    const aviso = jest.spyOn(TestBed.inject(ArgToast), 'show');
    await enviar('  João da Silva ', '(11) 99999-8888');

    expect(criar).toHaveBeenCalledWith({
      profissionalId: 'rafael',
      servicoId: 'corte-barba',
      inicio: '2026-10-20T10:30',
      fim: '2026-10-20T11:30',
      cliente: { nome: 'João da Silva', telefone: '11999998888' },
    });
    expect(el.querySelector('h1')?.textContent).toContain('Agendamento confirmado');
    expect(el.querySelector('a[download]')?.getAttribute('href')).toMatch(
      /^data:text\/calendar;charset=utf-8,/,
    );
    expect(aviso).toHaveBeenCalledWith('Seu horário está reservado.', expect.anything());
    expect(store.passosConcluidos()).toBe(0);
  });

  it('se o horário foi tomado, avisa e volta para escolher outro', async () => {
    criar.mockRejectedValueOnce(new HorarioIndisponivelError());
    const navegar = jest.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    await enviar('João', '11999998888');

    expect(el.textContent).toContain('Esse horário acabou de ser ocupado');
    el.querySelector<HTMLButtonElement>('[arg-alert-action]')?.click();
    expect(store.horario()).toBeNull();
    expect(store.servico()?.id).toBe('corte-barba');
    expect(navegar).toHaveBeenCalledWith('/agendar/horario');
  });

  it('outros erros da agenda não viram aviso de conflito', async () => {
    criar.mockRejectedValueOnce(new Error('fora do ar'));
    const confirmar = (
      fixture.componentInstance as unknown as { confirmar(): Promise<void> }
    ).confirmar.bind(fixture.componentInstance);
    digitar('input[arg-input]', 'João');
    digitar('input[arg-mask]', '11999998888');
    await expect(confirmar()).rejects.toThrow('fora do ar');
    await atualizar();
    expect(el.textContent).not.toContain('Esse horário acabou de ser ocupado');
  });
});

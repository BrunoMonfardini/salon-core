import { beforeEach, describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { PROFISSIONAIS, SERVICOS } from '../data/mock/dados';
import { BookingStore } from './booking.store';

const [rafael, thiago] = PROFISSIONAIS;
const [corte, barba] = SERVICOS;

describe('BookingStore', () => {
  let store: BookingStore;
  beforeEach(() => {
    store = TestBed.inject(BookingStore);
  });

  function preencherTudo() {
    store.escolherProfissional(rafael);
    store.escolherServico(corte);
    store.escolherData('2026-10-20');
    store.escolherHorario('10:00');
  }

  it('começa sem nenhum passo concluído', () => {
    expect(store.passosConcluidos()).toBe(0);
  });

  it('conta os passos conforme as escolhas', () => {
    store.escolherProfissional(rafael);
    expect(store.passosConcluidos()).toBe(1);
    store.escolherServico(corte);
    store.escolherData('2026-10-20');
    expect(store.passosConcluidos()).toBe(1);
    store.escolherHorario('10:00');
    expect(store.passosConcluidos()).toBe(2);
  });

  it('trocar o profissional limpa serviço, data e horário', () => {
    preencherTudo();
    store.escolherProfissional(thiago);
    expect(store.profissional()).toBe(thiago);
    expect([store.servico(), store.data(), store.horario()]).toEqual([null, null, null]);
  });

  it('escolher o mesmo profissional de novo mantém as escolhas', () => {
    preencherTudo();
    store.escolherProfissional(rafael);
    expect(store.passosConcluidos()).toBe(2);
  });

  it('trocar o serviço limpa só o horário', () => {
    preencherTudo();
    store.escolherServico(barba);
    expect(store.servico()).toBe(barba);
    expect(store.data()).toBe('2026-10-20');
    expect(store.horario()).toBeNull();
  });

  it('trocar a data limpa o horário; a mesma data não', () => {
    preencherTudo();
    store.escolherData('2026-10-20');
    expect(store.horario()).toBe('10:00');
    store.escolherData('2026-10-21');
    expect(store.horario()).toBeNull();
  });

  it('limparHorario tira só o horário', () => {
    preencherTudo();
    store.limparHorario();
    expect(store.horario()).toBeNull();
    expect(store.data()).toBe('2026-10-20');
    expect(store.passosConcluidos()).toBe(1);
  });

  it('limpar volta ao início', () => {
    preencherTudo();
    store.limpar();
    expect(store.profissional()).toBeNull();
    expect(store.passosConcluidos()).toBe(0);
  });
});

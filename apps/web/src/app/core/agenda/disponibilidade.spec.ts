import { describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { Expediente } from '../models';
import {
  AGORA,
  agoraDe,
  diasComVaga,
  horariosDoDia,
  periodoDe,
  proximoHorario,
} from './disponibilidade';

// 2026-10-20 é terça (2); 2026-10-25, domingo (0)
const TERCA = '2026-10-20';
const expediente: Expediente = {
  2: [
    { inicio: '09:00', fim: '10:30' },
    { inicio: '13:00', fim: '14:00' },
  ],
};
const madrugada = { data: TERCA, minutos: 0 };

function livres(slots: { time: string; available: boolean }[]) {
  return slots.filter((s) => s.available).map((s) => s.time);
}

describe('horariosDoDia', () => {
  it('oferece um início a cada 30 minutos que caiba inteiro na faixa', () => {
    expect(livres(horariosDoDia(expediente, TERCA, 30, [], madrugada))).toEqual([
      '09:00',
      '09:30',
      '10:00',
      '13:00',
      '13:30',
    ]);
  });

  it('serviço longo não começa onde não termina antes do fim da faixa', () => {
    expect(livres(horariosDoDia(expediente, TERCA, 60, [], madrugada))).toEqual([
      '09:00',
      '09:30',
      '13:00',
    ]);
  });

  it('marca como ocupado o que choca com outro atendimento', () => {
    const ocupados = [periodoDe(TERCA, 9 * 60 + 30, 30)];
    const slots = horariosDoDia(expediente, TERCA, 60, ocupados, madrugada);
    expect(slots).toEqual([
      { time: '09:00', available: false },
      { time: '09:30', available: false },
      { time: '13:00', available: true },
    ]);
  });

  it('hoje, os horários que já passaram ficam ocupados', () => {
    const agora = { data: TERCA, minutos: 9 * 60 + 30 };
    expect(livres(horariosDoDia(expediente, TERCA, 30, [], agora))).toEqual([
      '10:00',
      '13:00',
      '13:30',
    ]);
  });

  it('folga e dia passado não têm horários', () => {
    expect(horariosDoDia(expediente, '2026-10-25', 30, [], madrugada)).toEqual([]);
    expect(horariosDoDia(expediente, '2026-10-19', 30, [], madrugada)).toEqual([]);
  });
});

describe('proximoHorario', () => {
  it('é o primeiro livre de hoje quando ainda há vaga', () => {
    expect(proximoHorario(expediente, 30, [], madrugada)).toEqual({
      data: TERCA,
      horario: '09:00',
    });
  });

  it('pula para o próximo dia de expediente quando hoje acabou', () => {
    const fimDoDia = { data: TERCA, minutos: 23 * 60 };
    expect(proximoHorario(expediente, 30, [], fimDoDia)).toEqual({
      data: '2026-10-27',
      horario: '09:00',
    });
  });

  it('é nulo quando não há vaga dentro da janela', () => {
    expect(proximoHorario({}, 30, [], madrugada)).toBeNull();
    expect(proximoHorario(expediente, 30, [], { data: TERCA, minutos: 23 * 60 }, 3)).toBeNull();
  });
});

describe('relógio', () => {
  it('converte uma data para dia e minutos locais', () => {
    expect(agoraDe(new Date(2026, 9, 20, 14, 45))).toEqual({ data: TERCA, minutos: 885 });
  });

  it('o padrão lê a hora atual', () => {
    const antes = agoraDe(new Date());
    expect(TestBed.inject(AGORA)().data).toBe(antes.data);
  });
});

describe('diasComVaga', () => {
  it('só os dias de expediente com horário livre, dentro da janela', () => {
    expect([...diasComVaga(expediente, 30, [], madrugada, 8)]).toEqual([TERCA, '2026-10-27']);
  });

  it('um dia com a agenda cheia fica de fora', () => {
    const cheio = [{ inicio: `${TERCA}T09:00`, fim: `${TERCA}T14:00` }];
    expect([...diasComVaga(expediente, 30, cheio, madrugada, 7)]).toEqual([]);
  });
});

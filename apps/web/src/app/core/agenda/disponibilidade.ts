import { InjectionToken } from '@angular/core';
import { ArgTimeSlot, addDays, todayIso, toMinutes, toTime, weekday } from '@brunomonfardini/ui';
import { Expediente, Periodo } from '../models';
import { sobrepoe } from './periodo';

/** De quanto em quanto tempo a grade oferece um horário de início. */
export const PASSO_MIN = 30;

/** Quantos dias à frente o cliente pode agendar, contando hoje. */
export const DIAS_DE_AGENDA = 14;

/** O instante atual no fuso da barbearia: dia AAAA-MM-DD e minutos desde a meia-noite. */
export interface Agora {
  readonly data: string;
  readonly minutos: number;
}

export function agoraDe(data: Date): Agora {
  return { data: todayIso(data), minutos: data.getHours() * 60 + data.getMinutes() };
}

/** Relógio injetável: os testes fixam o "agora" em vez de depender da hora real. */
export const AGORA = new InjectionToken<() => Agora>('AGORA', {
  providedIn: 'root',
  factory: () => () => agoraDe(new Date()),
});

/**
 * Horários de início do dia para um serviço de `duracaoMin`: livres quando cabem inteiros
 * numa faixa do expediente, não chocam com nada ocupado e ainda não passaram.
 */
export function horariosDoDia(
  expediente: Expediente,
  data: string,
  duracaoMin: number,
  ocupados: readonly Periodo[],
  agora: Agora,
): ArgTimeSlot[] {
  if (data < agora.data) return [];
  const faixas = expediente[weekday(data) as keyof Expediente] ?? [];
  const horarios: ArgTimeSlot[] = [];
  for (const faixa of faixas) {
    const fim = toMinutes(faixa.fim);
    for (let inicio = toMinutes(faixa.inicio); inicio + duracaoMin <= fim; inicio += PASSO_MIN) {
      const periodo = periodoDe(data, inicio, duracaoMin);
      const passou = data === agora.data && inicio <= agora.minutos;
      const livre = !passou && !ocupados.some((o) => sobrepoe(o, periodo));
      horarios.push({ time: toTime(inicio), available: livre });
    }
  }
  return horarios;
}

/** O período de um atendimento que começa em `inicio` (minutos) no dia `data`. */
export function periodoDe(data: string, inicio: number, duracaoMin: number): Periodo {
  return { inicio: `${data}T${toTime(inicio)}`, fim: `${data}T${toTime(inicio + duracaoMin)}` };
}

export interface ProximoHorario {
  readonly data: string;
  readonly horario: string;
}

/** O primeiro horário livre a partir de agora, dentro da janela de agenda; `null` se não houver. */
export function proximoHorario(
  expediente: Expediente,
  duracaoMin: number,
  ocupados: readonly Periodo[],
  agora: Agora,
  dias = DIAS_DE_AGENDA,
): ProximoHorario | null {
  for (let i = 0; i < dias; i++) {
    const data = addDays(agora.data, i);
    const livre = horariosDoDia(expediente, data, duracaoMin, ocupados, agora).find(
      (h) => h.available,
    );
    if (livre) return { data, horario: livre.time };
  }
  return null;
}

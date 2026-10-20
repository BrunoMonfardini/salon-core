import { Periodo } from '../models';

/** Fuso da barbearia: os horários da agenda são locais. */
export const FUSO = 'America/Sao_Paulo';

export interface EventoIcs extends Periodo {
  readonly id: string;
  readonly titulo: string;
  readonly local: string;
}

/** "2026-10-20T10:30" → "20261020T103000" */
function dataHoraIcs(dataHora: string): string {
  return `${dataHora.replace(/[-:]/g, '')}00`;
}

/** Texto do iCalendar: vírgula, ponto e vírgula e barra invertida precisam de escape. */
function texto(valor: string): string {
  return valor.replace(/[\\,;]/g, (c) => `\\${c}`);
}

/** Um evento em iCalendar (.ics), para o cliente salvar o horário na própria agenda. */
export function arquivoIcs({ id, titulo, local, inicio, fim }: EventoIcs): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//salon-core//agendamento//PT-BR',
    'BEGIN:VEVENT',
    `UID:${id}@salon-core`,
    `DTSTART;TZID=${FUSO}:${dataHoraIcs(inicio)}`,
    `DTEND;TZID=${FUSO}:${dataHoraIcs(fim)}`,
    `SUMMARY:${texto(titulo)}`,
    `LOCATION:${texto(local)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Link de download do .ics, sem precisar de script para gerar o arquivo. */
export function linkIcs(evento: EventoIcs): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(arquivoIcs(evento))}`;
}

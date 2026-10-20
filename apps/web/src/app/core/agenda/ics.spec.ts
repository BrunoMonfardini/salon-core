import { describe, expect, it } from '@jest/globals';
import { EventoIcs, arquivoIcs, linkIcs } from './ics';

const evento: EventoIcs = {
  id: 'ag-1',
  titulo: 'Corte com Rafael',
  local: 'Rua França, 77 - Parque das Nações; Santo André',
  inicio: '2026-10-20T10:30',
  fim: '2026-10-20T11:00',
};

describe('arquivoIcs', () => {
  const linhas = arquivoIcs(evento).split('\r\n');

  it('é um calendário com um evento', () => {
    expect(linhas[0]).toBe('BEGIN:VCALENDAR');
    expect(linhas).toContain('BEGIN:VEVENT');
    expect(linhas.at(-1)).toBe('END:VCALENDAR');
  });

  it('usa o horário local da barbearia', () => {
    expect(linhas).toContain('DTSTART;TZID=America/Sao_Paulo:20261020T103000');
    expect(linhas).toContain('DTEND;TZID=America/Sao_Paulo:20261020T110000');
  });

  it('escapa vírgula e ponto e vírgula nos textos', () => {
    expect(linhas).toContain('LOCATION:Rua França\\, 77 - Parque das Nações\\; Santo André');
    expect(linhas).toContain('SUMMARY:Corte com Rafael');
    expect(linhas).toContain('UID:ag-1@salon-core');
  });
});

describe('linkIcs', () => {
  it('é um data URI de text/calendar com o arquivo inteiro', () => {
    const link = linkIcs(evento);
    expect(link.startsWith('data:text/calendar;charset=utf-8,')).toBe(true);
    expect(decodeURIComponent(link.split(',').slice(1).join(','))).toBe(arquivoIcs(evento));
  });
});

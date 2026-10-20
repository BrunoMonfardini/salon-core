import { beforeEach, describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { NovoAgendamento } from '../../models';
import {
  AgendaRepo,
  HorarioIndisponivelError,
  ProdutosRepo,
  ProfissionaisRepo,
  ServicosRepo,
} from '../repos';
import { PRODUTOS, PROFISSIONAIS, SERVICOS } from './dados';
import { provideMockRepos } from './mock-repos';

const corte: NovoAgendamento = {
  profissionalId: 'rafael',
  servicoId: 'corte',
  inicio: '2026-10-20T10:00',
  fim: '2026-10-20T10:30',
  cliente: { nome: 'João', telefone: '11999998888' },
};

describe('repositórios mock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideMockRepos() });
  });

  it('listam os dados de exemplo', async () => {
    expect(await TestBed.inject(ProfissionaisRepo).listar()).toBe(PROFISSIONAIS);
    expect(await TestBed.inject(ServicosRepo).listar()).toBe(SERVICOS);
    expect(await TestBed.inject(ProdutosRepo).listar()).toBe(PRODUTOS);
  });

  it('todo serviço oferecido por um profissional existe', () => {
    const ids = new Set(SERVICOS.map((s) => s.id));
    for (const p of PROFISSIONAIS) expect(p.servicoIds.every((id) => ids.has(id))).toBe(true);
  });

  describe('agenda', () => {
    let agenda: AgendaRepo;
    beforeEach(() => {
      agenda = TestBed.inject(AgendaRepo);
    });

    it('grava o agendamento com o cliente e devolve com id', async () => {
      expect(await agenda.criar(corte)).toEqual({ ...corte, id: 'ag-1' });
    });

    it('lista como ocupado só o profissional e o intervalo de datas pedidos', async () => {
      await agenda.criar(corte);
      await agenda.criar({ ...corte, inicio: '2026-10-22T10:00', fim: '2026-10-22T10:30' });
      await agenda.criar({ ...corte, profissionalId: 'thiago' });

      expect(await agenda.ocupados('rafael', '2026-10-20', '2026-10-21')).toEqual([
        { inicio: '2026-10-20T10:00', fim: '2026-10-20T10:30' },
      ]);
    });

    it('recusa um horário que choca com outro do mesmo profissional', async () => {
      await agenda.criar(corte);
      await expect(
        agenda.criar({ ...corte, inicio: '2026-10-20T10:15', fim: '2026-10-20T10:45' }),
      ).rejects.toBeInstanceOf(HorarioIndisponivelError);
    });
  });
});

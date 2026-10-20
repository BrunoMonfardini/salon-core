import { Injectable, Provider } from '@angular/core';
import { sobrepoe } from '../../agenda/periodo';
import { Agendamento, NovoAgendamento, Periodo } from '../../models';
import {
  AgendaRepo,
  HorarioIndisponivelError,
  ProdutosRepo,
  ProfissionaisRepo,
  ServicosRepo,
} from '../repos';
import { PRODUTOS, PROFISSIONAIS, SERVICOS } from './dados';

@Injectable()
export class MockProfissionaisRepo extends ProfissionaisRepo {
  async listar() {
    return PROFISSIONAIS;
  }
}

@Injectable()
export class MockServicosRepo extends ServicosRepo {
  async listar() {
    return SERVICOS;
  }
}

@Injectable()
export class MockProdutosRepo extends ProdutosRepo {
  async listar() {
    return PRODUTOS;
  }
}

/** Agenda em memória: dura até recarregar a página. */
@Injectable()
export class MockAgendaRepo extends AgendaRepo {
  private readonly agendamentos: Agendamento[] = [];
  private proximoId = 1;

  async ocupados(profissionalId: string, de: string, ate: string): Promise<readonly Periodo[]> {
    return this.agendamentos
      .filter((a) => a.profissionalId === profissionalId)
      .filter((a) => a.inicio.slice(0, 10) >= de && a.inicio.slice(0, 10) <= ate)
      .map(({ inicio, fim }) => ({ inicio, fim }));
  }

  async criar(novo: NovoAgendamento): Promise<Agendamento> {
    const ocupado = this.agendamentos.some(
      (a) => a.profissionalId === novo.profissionalId && sobrepoe(a, novo),
    );
    if (ocupado) throw new HorarioIndisponivelError();
    const agendamento = { ...novo, id: `ag-${this.proximoId++}` };
    this.agendamentos.push(agendamento);
    return agendamento;
  }
}

export function provideMockRepos(): Provider[] {
  return [
    { provide: ProfissionaisRepo, useClass: MockProfissionaisRepo },
    { provide: ServicosRepo, useClass: MockServicosRepo },
    { provide: ProdutosRepo, useClass: MockProdutosRepo },
    { provide: AgendaRepo, useClass: MockAgendaRepo },
  ];
}

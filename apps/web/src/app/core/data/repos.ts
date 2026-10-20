import { Agendamento, NovoAgendamento, Periodo, Produto, Profissional, Servico } from '../models';

// Portas de dados: as telas dependem só destas classes. Trocar o mock pela API real é trocar o provider.

export abstract class ProfissionaisRepo {
  abstract listar(): Promise<readonly Profissional[]>;
}

export abstract class ServicosRepo {
  abstract listar(): Promise<readonly Servico[]>;
}

export abstract class AgendaRepo {
  /** Períodos já ocupados do profissional entre duas datas AAAA-MM-DD, inclusive. */
  abstract ocupados(profissionalId: string, de: string, ate: string): Promise<readonly Periodo[]>;
  /** Grava na agenda do profissional; rejeita com `HorarioIndisponivelError` se o período foi tomado. */
  abstract criar(novo: NovoAgendamento): Promise<Agendamento>;
}

export abstract class ProdutosRepo {
  abstract listar(): Promise<readonly Produto[]>;
}

export class HorarioIndisponivelError extends Error {
  constructor() {
    super('O horário escolhido acabou de ser ocupado.');
    this.name = 'HorarioIndisponivelError';
  }
}

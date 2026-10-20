/** Data e hora local no formato AAAA-MM-DDTHH:mm (fuso da barbearia). */
export type DataHora = string;

/** Faixa de horário dentro de um dia, no formato HH:mm. */
export interface Faixa {
  readonly inicio: string;
  readonly fim: string;
}

/** Faixas de trabalho por dia da semana (0 = domingo). Dia sem faixa é folga. */
export type Expediente = Readonly<Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, readonly Faixa[]>>>;

export interface Periodo {
  readonly inicio: DataHora;
  readonly fim: DataHora;
}

export interface Servico {
  readonly id: string;
  readonly nome: string;
  readonly duracaoMin: number;
  readonly precoCentavos: number;
}

export interface Profissional {
  readonly id: string;
  readonly nome: string;
  readonly foto?: string;
  readonly especialidades: readonly string[];
  readonly servicoIds: readonly string[];
  readonly expediente: Expediente;
}

export interface Cliente {
  readonly nome: string;
  /** Só dígitos, com DDD. */
  readonly telefone: string;
}

export interface NovoAgendamento extends Periodo {
  readonly profissionalId: string;
  readonly servicoId: string;
  readonly cliente: Cliente;
}

export interface Agendamento extends NovoAgendamento {
  readonly id: string;
}

export interface Produto {
  readonly id: string;
  readonly nome: string;
  readonly descricao: string;
  readonly precoCentavos: number;
  readonly imagem?: string;
  readonly disponivel: boolean;
}

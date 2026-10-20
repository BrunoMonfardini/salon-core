import { Injectable, computed, signal } from '@angular/core';
import { Profissional, Servico } from '../models';

/**
 * Escolhas do cliente ao longo do agendamento, compartilhadas pelas telas do fluxo.
 * Mudar uma escolha limpa as que dependem dela, para nunca sobrar um horário que não cabe mais.
 */
@Injectable({ providedIn: 'root' })
export class BookingStore {
  private readonly _profissional = signal<Profissional | null>(null);
  private readonly _servico = signal<Servico | null>(null);
  private readonly _data = signal<string | null>(null);
  private readonly _horario = signal<string | null>(null);

  readonly profissional = this._profissional.asReadonly();
  readonly servico = this._servico.asReadonly();
  /** AAAA-MM-DD */
  readonly data = this._data.asReadonly();
  /** HH:mm */
  readonly horario = this._horario.asReadonly();

  /** Quantos passos do fluxo já estão completos: 0 (nenhum), 1 (profissional) ou 2 (data, horário e serviço). */
  readonly passosConcluidos = computed(() => {
    if (!this._profissional()) return 0;
    return this._servico() && this._data() && this._horario() ? 2 : 1;
  });

  escolherProfissional(profissional: Profissional): void {
    if (this._profissional()?.id === profissional.id) return;
    this._profissional.set(profissional);
    this._servico.set(null);
    this._data.set(null);
    this._horario.set(null);
  }

  /** A duração muda quais horários cabem: o horário escolhido é limpo. */
  escolherServico(servico: Servico): void {
    this._servico.set(servico);
    this._horario.set(null);
  }

  escolherData(data: string): void {
    if (this._data() === data) return;
    this._data.set(data);
    this._horario.set(null);
  }

  escolherHorario(horario: string): void {
    this._horario.set(horario);
  }

  /** Quando o horário foi tomado por outra pessoa: mantém o resto e pede outro horário. */
  limparHorario(): void {
    this._horario.set(null);
  }

  limpar(): void {
    this._profissional.set(null);
    this._servico.set(null);
    this._data.set(null);
    this._horario.set(null);
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ARG_FIELD,
  ArgAlert,
  ArgButton,
  ArgIcon,
  ArgInput,
  ArgMaskedInput,
  ArgToast,
  toMinutes,
} from '@brunomonfardini/ui';
import { periodoDe } from '../../../core/agenda/disponibilidade';
import { linkIcs } from '../../../core/agenda/ics';
import { BookingStore } from '../../../core/booking/booking.store';
import { SALON_CONFIG, enderecoCompleto } from '../../../core/config/salon.config';
import { AgendaRepo, HorarioIndisponivelError } from '../../../core/data/repos';
import { comoChegarLinks } from '../../../shared/links/como-chegar';
import { urlDoPasso } from '../passos';
import { Escolhas, Resumo } from './resumo';

interface Confirmado extends Escolhas {
  readonly ics: string;
}

@Component({
  selector: 'app-confirmacao',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ARG_FIELD,
    ArgAlert,
    ArgButton,
    ArgIcon,
    ArgInput,
    ArgMaskedInput,
    Resumo,
  ],
  templateUrl: './confirmacao.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Confirmacao {
  private readonly store = inject(BookingStore);
  private readonly agenda = inject(AgendaRepo);
  private readonly router = inject(Router);
  private readonly toast = inject(ArgToast);
  private readonly salon = inject(SALON_CONFIG);

  protected readonly rota = comoChegarLinks(this.salon).rota;

  protected readonly form = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    // O arg-mask entrega só os dígitos e já valida o celular com DDD
    telefone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly enviando = signal(false);
  protected readonly conflito = signal(false);
  protected readonly confirmado = signal<Confirmado | null>(null);

  /** As escolhas do fluxo; o guard garante que estão completas ao abrir a tela. */
  protected readonly escolhas = computed<Escolhas | null>(() => {
    const profissional = this.store.profissional();
    const servico = this.store.servico();
    const data = this.store.data();
    const horario = this.store.horario();
    return profissional && servico && data && horario
      ? { profissional, servico, data, horario }
      : null;
  });

  protected erro(campo: 'nome' | 'telefone'): string | null {
    const controle = this.form.controls[campo];
    if (!controle.touched || controle.valid) return null;
    return campo === 'nome' ? 'Diga como podemos te chamar.' : 'Informe um celular com DDD.';
  }

  protected async confirmar(): Promise<void> {
    const escolhas = this.escolhas();
    if (this.form.invalid || !escolhas) {
      this.form.markAllAsTouched();
      return;
    }
    const { profissional, servico, data, horario } = escolhas;
    const { nome, telefone } = this.form.getRawValue();
    this.enviando.set(true);
    this.conflito.set(false);
    try {
      const agendamento = await this.agenda.criar({
        ...periodoDe(data, toMinutes(horario), servico.duracaoMin),
        profissionalId: profissional.id,
        servicoId: servico.id,
        cliente: { nome: nome.trim(), telefone },
      });
      const ics = linkIcs({
        ...agendamento,
        titulo: `${servico.nome} com ${profissional.nome} | ${this.salon.nome}`,
        local: enderecoCompleto(this.salon.endereco),
      });
      this.confirmado.set({ ...escolhas, ics });
      this.store.limpar();
      this.toast.show('Seu horário está reservado.', { title: 'Agendado', tone: 'success' });
    } catch (erro) {
      if (!(erro instanceof HorarioIndisponivelError)) throw erro;
      this.conflito.set(true);
    } finally {
      this.enviando.set(false);
    }
  }

  protected escolherOutroHorario(): void {
    this.store.limparHorario();
    void this.router.navigateByUrl(urlDoPasso(1));
  }
}

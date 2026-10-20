import { describe, expect, it, jest } from '@jest/globals';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OpcaoCard } from './opcao-card';

@Component({
  imports: [OpcaoCard],
  template: `
    <app-opcao-card
      titulo="Corte"
      [escolhida]="escolhida()"
      [desabilitada]="desabilitada()"
      [nivel]="nivel()"
      (escolher)="escolheu()"
    >
      <span opcaoMidia>mídia</span>
      <p>30 min</p>
      <strong opcaoRodape>R$ 50,00</strong>
    </app-opcao-card>
  `,
})
class Hospedeiro {
  readonly escolhida = signal(false);
  readonly desabilitada = signal(false);
  readonly nivel = signal<2 | 3>(2);
  escolheu = jest.fn();
}

function renderizar() {
  const fixture = TestBed.createComponent(Hospedeiro);
  fixture.detectChanges();
  const el: HTMLElement = fixture.nativeElement;
  return { fixture, el, botao: () => el.querySelector('button') as HTMLButtonElement };
}

describe('OpcaoCard', () => {
  it('projeta mídia, conteúdo e rodapé em volta do título', () => {
    const { el } = renderizar();
    expect(el.querySelector('h2 button')?.textContent?.trim()).toBe('Corte');
    expect(el.textContent).toContain('mídia');
    expect(el.textContent).toContain('30 min');
    expect(el.querySelector('footer')?.textContent).toContain('R$ 50,00');
  });

  it('avisa quando é clicado', () => {
    const { fixture, botao } = renderizar();
    botao().click();
    expect(fixture.componentInstance.escolheu).toHaveBeenCalled();
  });

  it('marca a escolhida com aria-pressed e selo', () => {
    const { fixture, el, botao } = renderizar();
    expect(botao().getAttribute('aria-pressed')).toBe('false');
    fixture.componentInstance.escolhida.set(true);
    fixture.detectChanges();
    expect(botao().getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('article')?.classList).toContain('opcao--escolhida');
    expect(el.textContent).toContain('Escolhido');
  });

  it('desabilita e troca o nível do título', () => {
    const { fixture, el, botao } = renderizar();
    fixture.componentInstance.desabilitada.set(true);
    fixture.componentInstance.nivel.set(3);
    fixture.detectChanges();
    expect(botao().disabled).toBe(true);
    expect(el.querySelector('h3 button')).not.toBeNull();
  });
});

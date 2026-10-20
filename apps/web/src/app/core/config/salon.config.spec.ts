import { describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { SALON, SALON_CONFIG, enderecoCompleto } from './salon.config';

describe('salon.config', () => {
  it('monta o endereço completo numa linha', () => {
    expect(enderecoCompleto(SALON.endereco)).toBe(
      'Rua França, 77 - Parque das Nações, Santo André - SP',
    );
  });

  it('injeta a config da barbearia por padrão', () => {
    expect(TestBed.inject(SALON_CONFIG)).toBe(SALON);
  });
});

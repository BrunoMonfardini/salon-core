import { describe, expect, it } from '@jest/globals';
import { SERVICOS } from './data/mock/dados';
import { rotuloDoServico } from './formatos';

describe('rotuloDoServico', () => {
  it('junta nome, duração e preço em reais', () => {
    expect(rotuloDoServico(SERVICOS[2])).toMatch(/^Corte e barba · 60 min · R\$\s80,00$/);
  });
});

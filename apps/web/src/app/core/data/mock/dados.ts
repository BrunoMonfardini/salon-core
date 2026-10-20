import { Expediente, Faixa, Produto, Profissional, Servico } from '../../models';

// Dados de exemplo enquanto não há backend. Nomes e preços são fictícios.

const DIA_CHEIO: readonly Faixa[] = [
  { inicio: '09:00', fim: '12:00' },
  { inicio: '13:00', fim: '19:00' },
];
const SABADO: readonly Faixa[] = [{ inicio: '08:00', fim: '16:00' }];

const TERCA_A_SABADO: Expediente = {
  2: DIA_CHEIO,
  3: DIA_CHEIO,
  4: DIA_CHEIO,
  5: DIA_CHEIO,
  6: SABADO,
};

export const SERVICOS: readonly Servico[] = [
  { id: 'corte', nome: 'Corte', duracaoMin: 30, precoCentavos: 5000 },
  { id: 'barba', nome: 'Barba', duracaoMin: 30, precoCentavos: 4000 },
  { id: 'corte-barba', nome: 'Corte e barba', duracaoMin: 60, precoCentavos: 8000 },
  { id: 'pigmentacao', nome: 'Pigmentação', duracaoMin: 45, precoCentavos: 6000 },
];

export const PROFISSIONAIS: readonly Profissional[] = [
  {
    id: 'rafael',
    nome: 'Rafael',
    especialidades: ['Degradê', 'Barba'],
    servicoIds: ['corte', 'barba', 'corte-barba'],
    expediente: TERCA_A_SABADO,
  },
  {
    id: 'thiago',
    nome: 'Thiago',
    especialidades: ['Tesoura', 'Pigmentação'],
    servicoIds: ['corte', 'corte-barba', 'pigmentacao'],
    expediente: TERCA_A_SABADO,
  },
  {
    id: 'diego',
    nome: 'Diego',
    especialidades: ['Barba'],
    servicoIds: ['barba'],
    // Só sábado e domingo: aparece como indisponível nos outros dias
    expediente: { 6: SABADO, 0: [{ inicio: '09:00', fim: '13:00' }] },
  },
];

export const PRODUTOS: readonly Produto[] = [
  {
    id: 'pomada',
    nome: 'Pomada modeladora',
    descricao: 'Fixação média, efeito seco.',
    precoCentavos: 4500,
    disponivel: true,
  },
  {
    id: 'oleo-barba',
    nome: 'Óleo para barba',
    descricao: 'Hidrata e perfuma, 30 ml.',
    precoCentavos: 3900,
    disponivel: true,
  },
  {
    id: 'shampoo',
    nome: 'Shampoo antiqueda',
    descricao: 'Uso diário, 250 ml.',
    precoCentavos: 5200,
    disponivel: false,
  },
];

import { InjectionToken } from '@angular/core';

export interface Coordenadas {
  readonly lat: number;
  readonly lng: number;
}

export interface Endereco {
  readonly logradouro: string;
  readonly numero: string;
  readonly bairro: string;
  readonly cidade: string;
  readonly uf: string;
}

export interface SalonConfig {
  readonly nome: string;
  readonly resumo: string;
  readonly endereco: Endereco;
  /** Usadas pelos apps de corrida; o mapa e a rota usam o endereço em texto, que é mais preciso. */
  readonly coordenadas: Coordenadas;
}

/** Única fonte dos dados da barbearia: telas e links leem daqui, nunca repetem estes valores. */
export const SALON: SalonConfig = {
  nome: 'Salon Barbearia',
  resumo:
    'Corte, barba e acabamento no capricho, com hora marcada e sem fila. Escolha o profissional, o horário e pronto.',
  endereco: {
    logradouro: 'Rua França',
    numero: '77',
    bairro: 'Parque das Nações',
    cidade: 'Santo André',
    uf: 'SP',
  },
  // Aproximadas pelo CEP 09210-270 (o OpenStreetMap não tem o número); trocar pelo ponto exato
  coordenadas: { lat: -23.6354944, lng: -46.5256008 },
};

export const SALON_CONFIG = new InjectionToken<SalonConfig>('SALON_CONFIG', {
  providedIn: 'root',
  factory: () => SALON,
});

/** "Rua França, 77 - Parque das Nações, Santo André - SP" */
export function enderecoCompleto({ logradouro, numero, bairro, cidade, uf }: Endereco): string {
  return `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${uf}`;
}

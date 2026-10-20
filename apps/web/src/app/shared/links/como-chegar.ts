import { SalonConfig, enderecoCompleto } from '../../core/config/salon.config';

export interface ComoChegarLinks {
  /** Mapa com o ponto da barbearia, para iframe. Não exige chave de API. */
  readonly mapa: string;
  readonly rota: string;
  readonly uber: string;
  readonly noventaENove: string;
}

const q = encodeURIComponent;

/** Todos os links de "como chegar" saem daqui, a partir da config: nenhuma tela monta URL. */
export function comoChegarLinks({ nome, endereco, coordenadas }: SalonConfig): ComoChegarLinks {
  const texto = enderecoCompleto(endereco);
  const { lat, lng } = coordenadas;
  return {
    mapa: `https://www.google.com/maps?q=${q(texto)}&output=embed`,
    rota: `https://www.google.com/maps/dir/?api=1&destination=${q(texto)}`,
    // Formato documentado de deep link do Uber: abre o app (ou o site) com o destino preenchido
    uber:
      'https://m.uber.com/ul/?action=setPickup&pickup=my_location' +
      `&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}` +
      `&dropoff[nickname]=${q(nome)}&dropoff[formatted_address]=${q(texto)}`,
    // A 99 não documenta deep link com destino: abre o app/site, e o cliente digita o endereço
    noventaENove: 'https://99app.com/',
  };
}

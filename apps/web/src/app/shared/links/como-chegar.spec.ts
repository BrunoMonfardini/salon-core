import { describe, expect, it } from '@jest/globals';
import { SALON, SalonConfig } from '../../core/config/salon.config';
import { comoChegarLinks } from './como-chegar';

describe('comoChegarLinks', () => {
  const links = comoChegarLinks(SALON);
  const endereco =
    'Rua%20Fran%C3%A7a%2C%2077%20-%20Parque%20das%20Na%C3%A7%C3%B5es%2C%20Santo%20Andr%C3%A9%20-%20SP';

  it('mapa embutido aponta para o endereço', () => {
    expect(links.mapa).toBe(`https://www.google.com/maps?q=${endereco}&output=embed`);
  });

  it('rota usa o endereço como destino', () => {
    expect(links.rota).toBe(`https://www.google.com/maps/dir/?api=1&destination=${endereco}`);
  });

  it('uber parte da localização atual e chega nas coordenadas da barbearia', () => {
    const url = new URL(links.uber);
    expect(url.origin + url.pathname).toBe('https://m.uber.com/ul/');
    expect(url.searchParams.get('pickup')).toBe('my_location');
    expect(url.searchParams.get('dropoff[latitude]')).toBe(String(SALON.coordenadas.lat));
    expect(url.searchParams.get('dropoff[longitude]')).toBe(String(SALON.coordenadas.lng));
    expect(url.searchParams.get('dropoff[nickname]')).toBe(SALON.nome);
  });

  it('escapa caracteres que quebrariam a URL', () => {
    const config: SalonConfig = { ...SALON, nome: 'Corte & Cia #1' };
    const url = new URL(comoChegarLinks(config).uber);
    expect(url.searchParams.get('dropoff[nickname]')).toBe('Corte & Cia #1');
  });

  it('99 abre o app oficial', () => {
    expect(links.noventaENove).toBe('https://99app.com/');
  });
});

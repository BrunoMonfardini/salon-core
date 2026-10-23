import { EnvironmentProviders } from '@angular/core';
import {
  argIconCalendar,
  argIconCar,
  argIconCheck,
  argIconClock,
  argIconExternalLink,
  argIconMapPin,
  argIconScissors,
  argIconSparkles,
  provideArgIcons,
  provideArgila,
} from '@brunomonfardini/ui';

/** Ícones usados no app: registrar só os necessários mantém o bundle pequeno. */
export const ICONES = [
  argIconCalendar,
  argIconCar,
  argIconCheck,
  argIconClock,
  argIconExternalLink,
  argIconMapPin,
  argIconScissors,
  argIconSparkles,
];

/** Aparência da barbearia: vidro escuro com ardósia, petróleo e mostarda, sobre fundo em degradê. */
export function provideAparencia(): EnvironmentProviders[] {
  return [
    provideArgIcons(ICONES),
    provideArgila({
      segments: {
        barbearia: {
          style: 'transparente',
          scheme: 'dark',
          colors: { primary: 'ardosia', secondary: 'petroleo', accent: 'mostarda' },
          surfaceOpacity: 0.65,
          background: 'degrade',
        },
      },
      defaultSegment: 'barbearia',
    }),
  ];
}

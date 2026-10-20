import { EnvironmentProviders } from '@angular/core';
import {
  argIconCalendar,
  argIconCheck,
  argIconClock,
  argIconExternalLink,
  argIconMapPin,
  argIconScissors,
  provideArgIcons,
  provideArgila,
} from '@brunomonfardini/ui';

/** Ícones usados no app: registrar só os necessários mantém o bundle pequeno. */
export const ICONES = [
  argIconCalendar,
  argIconCheck,
  argIconClock,
  argIconExternalLink,
  argIconMapPin,
  argIconScissors,
];

/** Aparência da barbearia: vidro escuro com ardósia, petróleo e mostarda. */
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
          // background: 'degrade' entra com o Argila 0.8.0, que traz os fundos
        },
      },
      defaultSegment: 'barbearia',
    }),
  ];
}

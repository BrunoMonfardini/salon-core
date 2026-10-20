import { EnvironmentProviders } from '@angular/core';
import {
  ArgIconDef,
  ArgIconName,
  argIconCalendar,
  argIconCheck,
  argIconClock,
  argIconExternalLink,
  argIconMapPin,
  argIconScissors,
  argIconSparkles,
  provideArgIcons,
  provideArgila,
} from '@brunomonfardini/ui';

/**
 * Carro, para os botões de corrida (Uber e 99). O Argila ainda não tem esse ícone e a
 * lista de nomes dele é fechada: o nome é forçado aqui, num lugar só, no mesmo traço dos
 * ícones do Argila (viewBox 24, contorno). Sai daqui quando o Argila ganhar um `car`.
 */
export const ICONE_CARRO = 'carro' as ArgIconName;
const argIconCarro: ArgIconDef = {
  name: ICONE_CARRO,
  svg: '<path d="M4 16v-4l2.5-5h11l2.5 5v4"/><path d="M3 16h18"/><path d="M4 12h16"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/>',
};

/** Ícones usados no app: registrar só os necessários mantém o bundle pequeno. */
export const ICONES = [
  argIconCalendar,
  argIconCarro,
  argIconCheck,
  argIconClock,
  argIconExternalLink,
  argIconMapPin,
  argIconScissors,
  argIconSparkles,
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

import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideArgIcons } from '@brunomonfardini/ui';
import { provideMockRepos } from '../app/core/data/mock/mock-repos';
import { ICONES } from '../app/core/ui/argila';

/** O que toda tela precisa num teste: rotas vazias, dados mock e os mesmos ícones do app. */
export function provideTela(): (Provider | EnvironmentProviders)[] {
  return [provideRouter([]), provideMockRepos(), provideArgIcons(ICONES)];
}

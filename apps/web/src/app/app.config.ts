import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideMockRepos } from './core/data/mock/mock-repos';
import { provideAparencia } from './core/ui/argila';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideMockRepos(),
    provideAparencia(),
  ],
};

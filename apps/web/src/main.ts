import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Falha de bootstrap é o único log permitido: sem ela a tela fica em branco sem explicação
// eslint-disable-next-line no-console
bootstrapApplication(App, appConfig).catch((err) => console.error(err));

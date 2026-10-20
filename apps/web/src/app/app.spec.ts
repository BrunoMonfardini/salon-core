import { describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  it('sobe com a configuração do app e renderiza a rota no router-outlet', () => {
    TestBed.configureTestingModule({ imports: [App], providers: appConfig.providers });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });
});

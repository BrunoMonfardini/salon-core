import { beforeEach, describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ArgStepper, provideArgIcons } from '@brunomonfardini/ui';
import { BookingStore } from '../../core/booking/booking.store';
import { PROFISSIONAIS } from '../../core/data/mock/dados';
import { provideMockRepos } from '../../core/data/mock/mock-repos';
import { ICONES } from '../../core/ui/argila';
import { BOOKING_ROUTES } from './booking.routes';
import { passoGuard } from './passo.guard';
import { PASSOS, passoDaUrl, urlDoPasso } from './passos';

describe('passos', () => {
  it('monta a URL de cada passo', () => {
    expect(PASSOS.map((_, i) => urlDoPasso(i))).toEqual([
      '/agendar/profissional',
      '/agendar/horario',
      '/agendar/confirmar',
    ]);
  });

  it('acha o passo pela URL, e o primeiro fora do fluxo', () => {
    expect(passoDaUrl('/agendar/horario')).toBe(1);
    expect(passoDaUrl('/agendar/confirmar?x=1')).toBe(2);
    expect(passoDaUrl('/')).toBe(0);
  });
});

describe('fluxo do agendamento', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'agendar', children: BOOKING_ROUTES }]),
        provideMockRepos(),
        provideArgIcons(ICONES),
      ],
    });
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
  });

  it('/agendar abre o primeiro passo com o tracker no topo', async () => {
    await harness.navigateByUrl('/agendar');
    expect(router.url).toBe('/agendar/profissional');
    const atual = harness.routeNativeElement?.querySelector('[aria-current="step"]');
    expect(atual?.textContent).toContain('Profissional');
  });

  it('escolher um passo no tracker navega até ele', async () => {
    await harness.navigateByUrl('/agendar/profissional');
    harness.routeDebugElement?.query(By.directive(ArgStepper)).triggerEventHandler('stepSelect', 0);
    await harness.fixture.whenStable();
    expect(router.url).toBe('/agendar/profissional');
  });
});

describe('passoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  function rodar(passo: number) {
    return TestBed.runInInjectionContext(() =>
      passoGuard(passo)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  it('abre o primeiro passo sempre', () => {
    expect(rodar(0)).toBe(true);
  });

  it('manda de volta ao primeiro passo que falta', () => {
    expect(String(rodar(1))).toBe('/agendar/profissional');
    TestBed.inject(BookingStore).escolherProfissional(PROFISSIONAIS[0]);
    expect(String(rodar(2))).toBe('/agendar/horario');
  });

  it('abre o passo quando os anteriores estão completos', () => {
    TestBed.inject(BookingStore).escolherProfissional(PROFISSIONAIS[0]);
    expect(rodar(1)).toBe(true);
  });
});

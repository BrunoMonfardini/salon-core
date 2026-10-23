import { defineConfig, devices } from '@playwright/test';

/**
 * Testes de ponta a ponta no navegador: o app de verdade, com o Argila de verdade.
 * Pegam o que os testes unitários (jsdom) não pegam, como o clique no calendário.
 * Ficam em e2e/*.e2e.ts, fora do Jest.
 */
const PORTA = 4310;

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  // Teste instável vira issue, não retentativa (padrão de pipeline)
  retries: 0,
  reporter: process.env['CI']
    ? [['list'], ['html', { open: 'never', outputFolder: 'reports/e2e' }]]
    : 'list',
  use: {
    baseURL: `http://localhost:${PORTA}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'celular', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `pnpm ng serve web --port ${PORTA}`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});

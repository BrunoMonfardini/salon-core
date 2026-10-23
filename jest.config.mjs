// @ts-check
import presets from 'jest-preset-angular/presets/index.js';

/**
 * Testes unitários do repositório: um project por app em apps/* e os scripts.
 * Tudo roda como ESM (o Angular é publicado em ESM), por isso o Jest roda com
 * --experimental-vm-modules e cada spec importa `jest` de '@jest/globals'.
 */

/** @param {string} app */
function angular(app) {
  const preset = presets.createEsmPreset({
    tsconfig: `<rootDir>/apps/${app}/tsconfig.spec.json`,
  });
  return {
    ...preset,
    displayName: app,
    roots: [`<rootDir>/apps/${app}/src`],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  };
}

/** @type {import('jest').Config} */
export default {
  projects: [
    angular('web'),
    {
      displayName: 'scripts',
      testEnvironment: 'node',
      roots: ['<rootDir>/scripts'],
      extensionsToTreatAsEsm: ['.ts'],
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          { useESM: true, tsconfig: '<rootDir>/scripts/tsconfig.jest.json' },
        ],
      },
    },
  ],
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'apps/*/src/**/*.ts',
    'scripts/lib/**/*.ts',
    '!**/*.spec.ts',
    '!**/main.ts',
  ],
  coverageReporters: ['text-summary', 'html', 'json-summary', 'lcov'],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        suiteNameTemplate: '{filepath}',
      },
    ],
  ],
  testTimeout: 30000,
};

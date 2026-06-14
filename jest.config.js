/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  // env.ts must run first (before modules load) so config picks up the vars.
  setupFiles: ['<rootDir>/tests/helpers/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.ts'],
  // mongodb-memory-server can take a moment to download/boot on first run.
  testTimeout: 30000,
  clearMocks: true,
};

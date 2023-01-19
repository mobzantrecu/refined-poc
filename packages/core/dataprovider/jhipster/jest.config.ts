import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    rootDir: './',
    displayName: 'jhipster-dataprovider',
    setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'https://api.jhipster.dev',
    },
};

export default config;

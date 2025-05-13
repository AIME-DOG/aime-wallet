/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/(__tests__|tests)/**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    verbose: true,
    testEnvironmentOptions: {
        nodeOptions: ['--experimental-vm-modules']
    },
    testTimeout: 60000,
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    detectOpenHandles: true
}; 
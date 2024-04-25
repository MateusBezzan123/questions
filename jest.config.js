module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['src/'],
    testMatch: ['/tests//.[jt]s?(x)', '**/?(.)+(spec|test).[tj]s?(x)'],
    transform: {
        '^.+\.(ts|tsx)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true
};
module.exports = {
    moduleFileExtensions: ['ts', 'js', 'vue', 'json'],

    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest',
    },
    // automock: false,
    // setupFiles: [
    //     "./setupJest.js"
    // ],
    collectCoverage: true,

    collectCoverageFrom: [
        '<rootDir>/src/components/**/*.vue',
        '<rootDir>/src/*.vue',
    ],

    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel'
};

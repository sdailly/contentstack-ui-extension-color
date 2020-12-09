module.exports = {
    moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
    setupFiles: [
        "<rootDir>/jest/globals.ts"
    ],
    globals: {
        ContentstackUIExtension: {
            init: () => Promise.resolve({
                field: {
                    getData: () => ({
                        colorSelected: undefined
                    })
                },
                config: {
                    colorsList: [
                        {}
                    ]
                }
            })
        }
    },
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

module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: [
        'airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        "linebreak-style": 0,
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "space-in-parens": [2, "never"],
        "eol-last": ["error", "never"],
    },
};
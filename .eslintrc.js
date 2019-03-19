module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    mongo: true,
    worker: true,
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:security/recommended',
    'prettier',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 9,
  },
  plugins: ['prettier', 'jest', 'security'],
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    semi: ['error', 'always'],
    strict: 0,
    'no-duplicate-imports': 2,
    'no-class-assign': 2,
    'no-useless-constructor': 1,
    'no-useless-computed-key': 2,
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'no-eval': 2,
  },
};

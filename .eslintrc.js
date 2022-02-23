const {off} = require('process');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-typescript',
    'airbnb-base',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
    es6: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/extensions': 'off',
    'react/jsx-filename-extension': 'off',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-cycle': 'off',
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'none',
      },
    ],
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
      alias: [
        ['@ezyfs/crypto', 'libs/crypto/src'],
        ['@ezyfs/common', 'libs/common/src'],
        ['@ezyfs/internal', 'libs/internal/src'],
        ['@ezyfs/proto-schema', 'libs/proto-schema/src'],
        ['@ezyfs/repositories', 'libs/repositories/src'],
        ['@ezyfs/repositories/*', 'libs/repositories/src/*'],
      ],
    },
  },
};

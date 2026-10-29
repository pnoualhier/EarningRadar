import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [
            ['@babel/preset-typescript'],
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
        },
      },
    },
    rules: {
      'no-unused-vars': 'off', // TypeScript compiler handles unused variables
      'no-console': ['warn', { allow: ['warn', 'error', 'log', 'info'] }],
      'no-undef': 'off',
      'no-useless-assignment': 'warn',
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'dev-dist/**',
      'public/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];

// eslint.config.js
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  // Configuration for TypeScript files
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'bin/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      // Disable rules that add extra spacing
      'padding-line-between-statements': 'off',
      'lines-between-class-members': 'off',
      'no-multiple-empty-lines': 'off',
    },
  },
  
  // Prettier must be last to override other formatting rules
  prettierConfig,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    files: ['src/**/*.ts', 'bin/**/*.ts'],
    rules: {
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  }
];

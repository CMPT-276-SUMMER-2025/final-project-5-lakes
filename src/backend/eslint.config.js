import js from '@eslint/js'
import { defineConfig } from 'eslint/config'

export default defineConfig({
  files: ['**/*.js'],
  ignores: ['node_modules', 'dist'],
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      require: 'readonly',
      module: 'readonly',
      __dirname: 'readonly',
      process: 'readonly',
    },
  },
  rules: {
    //'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
})

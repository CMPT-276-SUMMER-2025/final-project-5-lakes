module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'error',
    "semi": ["error", "always"],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist'],
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      env: {
        jest: true,
        node: true, // also enables `global`
      },
    },
  ],
};

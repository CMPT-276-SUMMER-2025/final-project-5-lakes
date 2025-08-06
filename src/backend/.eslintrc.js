/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2022: true,
  },
  ignorePatterns: ['node_modules', 'dist'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  globals: {
    require: 'readonly',
    module: 'readonly',
    __dirname: 'readonly',
    process: 'readonly',
  },
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'error',
    "semi": ["error", "always"],
  },
};

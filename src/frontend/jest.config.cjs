module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.test.(js|jsx|ts|tsx)',
  ],
  testEnvironmentOptions: {
    html: '<html><body></body></html>',
    url: 'http://localhost',
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
export default {
  transform: {}, 
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.js"],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'], 
};
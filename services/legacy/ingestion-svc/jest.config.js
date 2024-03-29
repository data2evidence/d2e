module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/helpers/', '<rootDir>/src/__tests__/data/']
}

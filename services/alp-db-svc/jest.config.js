module.exports = {
  "preset": 'ts-jest',
  "testEnvironment": 'node',
  "roots": [
    "<rootDir>/src"
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/src/__tests__/helper.ts",
    "<rootDir>/src/__tests__/postgresHelper.ts"
  ],
};
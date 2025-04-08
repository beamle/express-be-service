/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // testRegex: "__tests__/.*.e2e.test.ts$",
  testMatch: [
    "<rootDir>/__tests__/**/*.e2e.test.ts",
    "<rootDir>/__tests__/integration/**/*.integration.test.ts"
  ]
}
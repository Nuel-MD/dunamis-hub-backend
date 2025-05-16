module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      lines: 90,
      functions: 90,
      statements: 90,
    },
  },
  coveragePathIgnorePatterns: ["<rootDir>/build/","<rootDir>/bin/", "<rootDir>/node_modules/"],
  errorOnDeprecated: true,
  fakeTimers: {
    enableGlobally: true,
  },
  modulePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/bin/", "<rootDir>/node_modules/"],
  preset: "ts-jest",
  resetMocks: true,
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};

export default config;
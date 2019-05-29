module.exports = {
  // roots: ['<rootDir>/src/scripts'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testRegex: "/tests/.*\\.(test|spec)\\.(jsx?|tsx?|ts)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageReporters: ["text-summary"]
};
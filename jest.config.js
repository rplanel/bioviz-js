module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testRegex: "tests/.*\\.(test|spec)\\.(jsx?|tsx?|ts)$",
  collectCoverage: true,
  coverageReporters: ["text-summary"]
};
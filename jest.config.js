const { defaults } = require("jest-config");
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  testTimeout: 50000,
  // testResultsProcessor: "./node_modules/jest-html-reporter",
  // ...
};

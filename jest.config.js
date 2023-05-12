const { defaults } = require("jest-config");
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  testTimeout: 50000,
  testEnvironment: "./src/env/CustomNodeEnvironment.js"
  // testResultsProcessor: "./node_modules/jest-html-reporter",
  // ...
};

require("colors");
require("dotenv").config();

const Table = require("cli-table");
const os = require("os");
const path = require("path");

const { EnvSettings } = require("advanced-settings");

const util = require("util");

const exec = util.promisify(require("child_process").exec);

const envSettings = new EnvSettings();

const testOptions = envSettings.loadJsonFileSync("testOptions.json", "utf8");
const { v4 } = require("uuid")

/**
 *
 * @param {string | number} suiteIdentifier
 * @param {string} stderr
 * @param {number} virtualUser
 * @description Print the report table
 */
const createTable = (suiteIdentifier, stderr, virtualUser) => {
  const jestOutput = require(`../${suiteIdentifier}-jest-output.json`);

  const tableHead = [];
  const colWidths = [];

  tableHead.push("#".blue);
  colWidths.push(5);

  testOptions.customColumns.forEach((column) => {
    tableHead.push(`${column}`.blue);
    colWidths.push(40);
  });

  tableHead.push("Status".blue);
  colWidths.push(15);

  const table = new Table({
    head: [...tableHead],
    colWidths: [...colWidths],
    colors: true,
  }); //* Creates the table

  let testResultIndex = 0;

  for (const testResult of jestOutput.testResults) {

    const path =
      os.type() === "Windows_NT"
        ? testResult.name.split("\\")
        : testResult.name.split("/");

    const testIndex = path.indexOf("tests");
    if (testIndex === -1) {
      console.log(
        `${path[path.length - 1]} test is not inside the correct directory.`
          .yellow
      );
      testResultIndex++;
      continue;
    }

    //get test case name
    for(var assertionResult of testResult.assertionResults){
      if(process.env.SKIP_SUCCESS_TEST_IN_REPORT==="true" && assertionResult.status=="passed") continue;
      console.log(assertionResult)
      var testSuiteName = assertionResult.ancestorTitles[0].trim()
      var testCaseName = assertionResult.title.trim()
      var status = assertionResult.status.trim()

      const tableValues = path.slice(testIndex + 1);
      const contentToPush = [];
  
      contentToPush.push((testResultIndex + 1).toString());
  
      for (let index = 0; index < testOptions.customColumns.length; index++) {
        switch(index){
          case 0: contentToPush.push(`${tableValues[0]} / ${tableValues[1]}`); break;
          case 1: contentToPush.push(tableValues[tableValues.length-1]); break;
          case 2: contentToPush.push(`${testCaseName}`); break;
        }
      }
  
      contentToPush.push(
        status === "passed"
          ? status.green
          : status.red
      );
  
      table.push([...contentToPush]);
      testResultIndex++;      
    }
  } //* Inserts data to the table

  console.info(
    `\n# ${virtualUser} Report table for the ${suiteIdentifier} suite\n`.yellow
      .bold
  );

  console.info(table.toString() + "\n"); //* Prints the table
};

/**
 * @description app entrypoint
 */
const main = () => {
  let suiteIndex = 0;
  for (
    let index = 0;
    index < (testOptions.virtualUserMultiplier || 1);
    index++
  ) {
    for (const suite of testOptions.virtualUserSuites) {
      if (!suite.skip) {
        const suiteIdentifier = suite.identifier
          ? suite.identifier
          : suiteIndex;

        var testUuid = v4();

        console.info(
          `#${index} Starting ${suiteIdentifier} uuid ${testUuid}`.bgMagenta
        );

        const environmentTestFiles = process.env.FILTERED_FILES
          ? process.env.FILTERED_FILES.toString().split(" ")
          : [];

        const suiteTestFiles = suite.files || [];

        const globalTestFiles = testOptions.files || [];

        const testFiles =
          environmentTestFiles.length > 0
            ? environmentTestFiles
            : suiteTestFiles.length > 0
            ? suiteTestFiles
            : globalTestFiles;

        var localPath = process.env.PATH;

        let executeCommand = `npx jest --verbose --json --runInBand --outputFile=${suiteIdentifier}-jest-output.json`;

        if (os.type() !== "Windows_NT") {
          executeCommand = `PATH=${localPath} ${executeCommand}`;
        }

        //* Spawns the jest process
        exec(`${executeCommand} ${testFiles.join(" ")}`, {
          env: { ...suite.variables, ...process.env, test_uuid: testUuid },
          cwd: path.join(__dirname, ".."),
        })
          .then((result) => {
            console.info(result.stderr.blue); //* Print the jest result
            if (testOptions.customColumns.length > 0) {
              createTable(suiteIdentifier, result.stderr.blue, index);
            }
          })
          .catch((err) => {
            if (!err.killed) {
              console.info(err.stderr.red); //* Print the jest result
              if (testOptions.customColumns.length > 0) {
                createTable(suiteIdentifier, err.stderr.red, index);
              }
            } else {
              console.error("error".red, err);
            }
          });
      }
      suiteIndex++;
    }
  }
};

main();

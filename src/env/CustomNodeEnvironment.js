// my-custom-environment
const os = require("os");
const fs = require("fs");
const path = require("path");
const NodeEnvironment = require('jest-environment-node');
const { v4: uuidv4 } = require('uuid');

class CustomNodeEnvironment extends NodeEnvironment {

    constructor(config, context) {
        super(config, context);
        this.global._testPath = context.testPath;
    }

    async setup() {
        await super.setup();
    }

    async handleTestEvent(event, state) {

        if (event.name === "test_start") {
            let testNames = [];
            let currentTest = event.test;
            while (currentTest) {
                testNames.push(currentTest.name);
                currentTest = currentTest.parent;
            }

            this.global._describeName = testNames[1]
            this.global._testName = testNames[0]
        }

        if (event.name === "test_fn_failure") {
            this.global._testStatus = "failure"
            //take screenshot on error
            const screenshot = await this.global.driver.takeScreenshot();
            var imageLocation = path.join(process.env.npm_config_local_prefix, "report", uuidv4()+".jpg");
            await fs.promises.writeFile(imageLocation, await screenshot, { encoding: 'base64' })
            console.log("screenshot: "+imageLocation)
        } else if (event.name === "test_fn_success") {
            this.global._testStatus = "success"
        }
    }
}

module.exports = CustomNodeEnvironment
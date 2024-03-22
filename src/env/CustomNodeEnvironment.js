// my-custom-environment
const os = require("os");
const fs = require("fs");
const path = require("path");
const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { v4: uuidv4 } = require('uuid');
var util = require('util')

class CustomNodeEnvironment extends NodeEnvironment {

    constructor(config, context) {
        super(config, context);
        this.global._testPath = context.testPath;
        this.global._testUuid = process.env.test_uuid;
    }

    async setup() {
        await super.setup();
        var reportBaseFolder = path.join(process.env.npm_config_local_prefix, "report", this.global._testUuid);
        await fs.promises.mkdir(reportBaseFolder, { recursive: true })
    }

    async teardown() {
        // var logLocation = path.join(process.env.npm_config_local_prefix, "report", uuidv4()+".txt");
        // var files = await fs.promises.readdir(path.join(process.env.npm_config_local_prefix, "report"))
        // await fs.promises.writeFile(logLocation, JSON.stringify(files))
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
            console.log(event)
            this.global._testStatus = "failure"
            //take screenshot on error
            const screenshot = await this.global.driver.takeScreenshot();
            const folderSeparator = os.type() === "Windows_NT" ? "\\" : "/";
            var folderSeparatorExp = new RegExp(folderSeparator, 'g');                
            var imageName = this.global._testPath.replace(process.env.npm_config_local_prefix, "").
            replace(folderSeparatorExp,"_")+"_"+
            this.global._describeName+"_"+
            this.global._testName+".jpg"
            var imageLocation = path.join(process.env.npm_config_local_prefix, "report", this.global._testUuid, imageName);
            await fs.promises.writeFile(imageLocation, await screenshot, { encoding: 'base64' })
            console.log("screenshot: "+imageLocation)
        } else if (event.name === "test_fn_success") {
            this.global._testStatus = "success"
        }
    }
}

module.exports = CustomNodeEnvironment
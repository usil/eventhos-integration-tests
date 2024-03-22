const os = require("os");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid")

function ScreenshotHelper(){}

ScreenshotHelper.takeScreenshot = async (driver, testFileLocation) => {
    const screenshot = await driver.takeScreenshot();
    const folderSeparator = os.type() === "Windows_NT" ? "\\" : "/";
    var folderSeparatorExp = new RegExp(folderSeparator, 'g');                
    var imageName = testFileLocation.replace(process.env.npm_config_local_prefix, "").replace(folderSeparatorExp,"_")+"_"+v4()+".jpg"
    var imageLocation = path.join(process.env.npm_config_local_prefix, "report", imageName);
    await fs.promises.writeFile(imageLocation, await screenshot, { encoding: 'base64' })
}

module.exports = ScreenshotHelper;
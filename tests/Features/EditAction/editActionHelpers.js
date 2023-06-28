const { until, By } = require("selenium-webdriver");
const { Driver } = require("selenium-webdriver/chrome");
const createActionHelpers = require("../CreateAction/createActionHelpers");

const editActionHelpers = {
    /**
     * 
     * @param {Driver} driver 
     */
    editActionHasRawFunctionBody: async (driver) => {
        const actionName = await createActionHelpers.createActionWithRawFunctionBody(driver);
        await createActionHelpers.verifyIfExistActionByName(driver, actionName);
        const firstRow = await driver.wait(
            until.elementLocated(By.css("tbody tr:first-child"))
          );
        const editButton = await firstRow.findElement(By.xpath('./td[6]/button[1]'));
        await editButton.click();
        const textAreaRawFunctionBody = await driver.wait(until.elementLocated( By.id('action-raw-function-body')), 5 * 1000, "There isn't text area raw function body", 3 *100);
        await textAreaRawFunctionBody.clear();
        await textAreaRawFunctionBody.sendKeys('return c*b');
        const updateButton = await driver.findElement(By.xpath('//app-edit-action/div/section/form/button[3]'));
        await driver.executeScript("arguments[0].click();", updateButton);
    }
}

module.exports = editActionHelpers;
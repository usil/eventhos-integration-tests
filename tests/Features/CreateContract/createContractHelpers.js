const { until, By } = require("selenium-webdriver");
const { Driver } = require("selenium-webdriver/chrome");
const rs = require("randomstring");
const { expect } = require("chai");


const createContractHelpers = {
    /**
     * 
     * @param {Driver} driver 
     */
    createContract: async (driver) => {
        const identifierInputCondition = until.elementLocated(By.xpath("//input[@formcontrolname='identifier']"));
        await driver.wait(driver => identifierInputCondition.fn(driver), 5 * 1000, "There isn't identifier input", 2 * 100);
      
          const nameInput = await driver.findElement(
            By.xpath("//input[@formcontrolname='name']")
          );
      
          const orderInput = await driver.findElement(
            By.xpath("//input[@formcontrolname='order']")
          );
      
          const producerSelect = await driver.findElement(
            By.xpath("//mat-select[@formcontrolname='producerId']")
          );
      
          const eventSelect = await driver.findElement(
            By.xpath("//mat-select[@formcontrolname='eventId']")
          );
      
          const consumerSelect = await driver.findElement(
            By.xpath("//mat-select[@formcontrolname='consumerId']")
          );
      
          const actionSelect = await driver.findElement(
            By.xpath("//mat-select[@formcontrolname='actionId']")
          );
      
          const eventIsDisabled =
            (await eventSelect.getAttribute("aria-disabled")) === "true"
              ? true
              : false;
      
          const actionIsDisabled =
            (await actionSelect.getAttribute("aria-disabled")) === "true"
              ? true
              : false;
      
          expect(eventIsDisabled).to.equal(true);
      
          expect(actionIsDisabled).to.equal(true);
      
          const createButton = await driver.findElement(By.css("form button"));
      
          const identifierDisabled =
            (await createButton.getAttribute("disabled")) === "true" ? true : false;
      
          const isCreateButtonDisabled =
            (await createButton.getAttribute("disabled")) === "true" ? true : false;
      
          expect(identifierDisabled).to.equal(true);
      
          expect(isCreateButtonDisabled).to.equal(true);
      
          const contractName = rs.generate({
            length: 8,
            charset: "alphabetic",
          });
      
          await nameInput.sendKeys(contractName);
      
          await orderInput.sendKeys(0);
      
          await producerSelect.click();
      
          const producerOptions = await driver.wait(
            until.elementsLocated(By.css(".mat-option"))
          );
      
          await producerOptions[0].click();
      
          await driver.wait(until.stalenessOf(producerOptions[0]));
      
          await eventSelect.click();
      
          const eventOptions = await driver.wait(
            until.elementsLocated(By.css(".mat-option"))
          );
      
          await eventOptions[0].click();
      
          await driver.wait(until.stalenessOf(eventOptions[0]));
      
          await consumerSelect.click();
      
          const consumerOptions = await driver.wait(
            until.elementsLocated(By.css(".mat-option"))
          );
      
          await consumerOptions[0].click();
      
          await driver.wait(until.stalenessOf(consumerOptions[0]));
      
          await actionSelect.click();
      
          const actionOptions = await driver.wait(
            until.elementsLocated(By.css(".mat-option"))
          );
      
          await actionOptions[0].click();
      
          await driver.wait(until.stalenessOf(actionOptions[0]));
      
          await createButton.click();

          return contractName;
    },
    /**
     * 
     * @param {Driver} driver 
     * @param {string} contractName 
     */
    verifyIfContractExistByName: async (driver, contractName) => {
        const searchInputCondition = until.elementLocated(By.xpath('//app-contract/section[2]/form/mat-form-field/div/div[1]/div/input'));
        const inputSelect = await driver.wait(driver => searchInputCondition.fn(driver), 6 * 1000, "There isn't search input by name", 2 * 100);
        await inputSelect.sendKeys(contractName);
        const conditionRows = until.elementsLocated(By.xpath('//app-contract/section[2]/div/div/table/tbody/tr'));
        const rows = await driver.findElements(driver => conditionRows.fn(driver), 7 * 1000, "There aren't rows", 2 * 100);
        expect(rows.length).to.be.greaterThanOrEqual(1)
    }

}

module.exports = createContractHelpers;
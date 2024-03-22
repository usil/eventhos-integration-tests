const { By, until } = require("selenium-webdriver");
const { Driver } = require("selenium-webdriver/chrome");
const rs = require("randomstring");
const { expect } = require("chai");
const FrontendConstants = require("../../../src/helpers/FrontendConstants.js");

const createActionHelpers = {
    /**
     * 
     * @param {Driver} driver 
     */
    fillCreateForm: async (driver) => {
        const identifierInput = await driver.wait(until.elementLocated(
            By.xpath("//input[@formcontrolname='identifier']")),
            5 * 1000,
            "there isn't identifier input",
            2 * 100
        );
    
        const nameInput = await driver.findElement(
            By.xpath("//input[@formcontrolname='name']")
        );
    
        const systemSelect = await driver.findElement(
            By.xpath("//mat-select[@formcontrolname='system_id']")
        );
    
        const operationInput = await driver.findElement(
            By.xpath("//input[@formcontrolname='operation']")
        );
    
        const descriptionTextInput = await driver.findElement(
            By.xpath("//textarea[@formcontrolname='description']")
        );
    
        const urlInput = await driver.findElement(
            By.xpath("//input[@formcontrolname='url']")
        );
    
        const methodSelect = await driver.findElement(
            By.xpath("//mat-select[@formcontrolname='method']")
        );
    
        const securityTypeSelect = await driver.findElement(
            By.xpath("//mat-select[@formcontrolname='securityType']")
        );
        const actionName = rs.generate({
            length: 8,
            charset: "alphabetic",
        });
    
        const formButtons = await driver.findElements(By.css("form button"));
    
        const createButton = formButtons[2];
    
        const createButtonDisabled =
            (await createButton.getAttribute("disabled")) === "true" ? true : false;
    
        expect(createButtonDisabled).to.equal(true);
    
        await nameInput.sendKeys(actionName);
    
        await descriptionTextInput.sendKeys(
            rs.generate({
                length: 16,
                charset: "alphabetic",
            })
        );
        await driver.executeScript("arguments[0].click();", systemSelect);
        const systemOptions = await driver.wait(
            until.elementsLocated(By.css(".mat-option"))
        );
      
        await driver.executeScript("arguments[0].click();", systemOptions[0]);
    
        await driver.wait(until.stalenessOf(systemOptions[0]));
        
        const operationKey = "new"
        await operationInput.sendKeys(operationKey)
    
        await urlInput.sendKeys("/url");
    
        await driver.executeScript("arguments[0].click();", methodSelect);
    
        const methodOptions = await driver.wait(
            until.elementsLocated(By.css(".mat-option"))
        );
        
        await driver.executeScript("arguments[0].click();", methodOptions[0]);
    
        await driver.wait(until.stalenessOf(methodOptions[0]));
        
        await driver.executeScript("arguments[0].click();", securityTypeSelect);
    
        const securityTypeOptions = await driver.wait(
            until.elementsLocated(By.css(".mat-option"))
        );
    
        await driver.executeScript("arguments[0].click();", securityTypeOptions[0]);
    
        await driver.wait(until.stalenessOf(securityTypeOptions[0]));
    
        const addHeaderButton = formButtons[0];
    
        const addQueryUrlParams = formButtons[1];
        
        await driver.executeScript("arguments[0].click();", addHeaderButton);
        await driver.executeScript("arguments[0].click();", addHeaderButton);

        const headerForms = await driver.wait(
            until.elementsLocated(
                By.css("div[formarrayname='headers'] > .ng-star-inserted")
            )
        );
    
        expect(headerForms.length).to.equal(2);
    
        const headerKey = await headerForms[0].findElement(
            By.css("input[formcontrolname='key']")
        );
    
        const headerValue = await headerForms[0].findElement(
            By.css("input[formcontrolname='value']")
        );
    
        const removeHeader = await headerForms[1].findElement(By.css("button"));
        
        await driver.executeScript("arguments[0].click();", removeHeader);
    
        const removedHeader = await driver.wait(until.stalenessOf(headerForms[1]));
    
        expect(removedHeader).to.equal(true);
    
        await headerKey.sendKeys("seleniumTestKey");
    
        await headerValue.sendKeys("seleniumTestValue");
    
        await driver.executeScript(
            "arguments[0].scrollIntoView()",
            addQueryUrlParams
        );
    
        await driver.executeScript("arguments[0].click();", addQueryUrlParams);
        await driver.executeScript("arguments[0].click();", addQueryUrlParams);
        
        const queryForms = await driver.wait(
            until.elementsLocated(
                By.css("div[formarrayname='queryUrlParams'] > .ng-star-inserted")
            )
        );
    
        expect(queryForms.length).to.equal(2);
    
        const queryKey = await queryForms[0].findElement(
            By.css("input[formcontrolname='key']")
        );
    
        const queryValue = await queryForms[0].findElement(
            By.css("input[formcontrolname='value']")
        );
    
        const removeQuery = await queryForms[1].findElement(By.css("button"));
        
        await driver.executeScript("arguments[0].click();", removeQuery);
    
        const queryRemoved = await driver.wait(until.stalenessOf(queryForms[1]));
    
        expect(queryRemoved).to.equal(true);
    
        await queryKey.sendKeys("seleniumTestKey");
    
        await queryValue.sendKeys("seleniumTestValue");
    
        const identifierValue = await identifierInput.getAttribute("value");
    
        expect(identifierValue).to.equal(`${actionName.toLowerCase()}_${operationKey}`);
        await driver.executeScript("arguments[0].click();", createButton);
        return actionName;
    },
    /**
     * 
     * @param {Driver} driver 
     * @param {String} actionName
     */
    verifyIfExistActionByName: async (driver, actionName) => {
        const searchInputCondition = until.elementLocated(By.xpath('//section[2]/form/mat-form-field/div/div[1]/div/input'));
        const inputSelect = await driver.wait(driver => searchInputCondition.fn(driver), 6 * 1000, "There isn't search input by name", 2 * 100);
        await inputSelect.sendKeys(actionName);
        const conditionRows = until.elementsLocated(By.xpath('//app-action/section[2]/div/div/table/tbody/tr'));
        await driver.sleep( 2 * 1000)
        const rows = await driver.wait(driver => conditionRows.fn(driver), 7 * 1000, "There aren't rows", 2 * 1000);
        expect(rows.length).to.be.greaterThanOrEqual(1)
        return rows;
    },
    /**
     * @param {Driver} driver 
     */
    fillCreateFormWithBodyAndCustomAuth: async (driver) => {
      const identifierInput = await driver.wait(until.elementLocated(
          By.xpath("//input[@formcontrolname='identifier']")),
          5 * 1000,
          "there isn't identifier input",
          2 * 100
      );
    
      const nameInput = await driver.findElement(
          By.xpath("//input[@formcontrolname='name']")
      );
    
      const systemSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='system_id']")
      );
  
      const operationInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='operation']")
      );
  
      const descriptionTextInput = await driver.findElement(
        By.xpath("//textarea[@formcontrolname='description']")
      );
  
      const urlInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='url']")
      );
  
      const methodSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='method']")
      );
  
      const securityTypeSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='securityType']")
      );
  
      const actionName = rs.generate({
        length: 8,
        charset: "alphabetic",
      });
  
      const formButtons = await driver.findElements(By.css("form button"));
  
      const createButton = formButtons[2];
  
      await nameInput.sendKeys(actionName);
  
      await descriptionTextInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );
    
      await driver.executeScript("arguments[0].click();", systemSelect);    
      const systemOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
  
      await systemOptions[0].click();
  
      await driver.wait(until.stalenessOf(systemOptions[0]));
  
      const operationKey = "new"
      await operationInput.sendKeys(operationKey)
  
      await urlInput.sendKeys("/url");
  
      await methodSelect.click();
  
      const methodOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
  
      await methodOptions[1].click();
  
      await driver.wait(until.stalenessOf(methodOptions[0]));
      await securityTypeSelect.click();
      const securityTypeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
      
      await securityTypeOptions[FrontendConstants.securityTypeOptionsIndexOfCustomSecurity].click();
  
      const toRawButton = await driver.wait(
        until.elementLocated(By.css("mat-radio-button:nth-child(2)"))
      );
  
      await driver.executeScript("arguments[0].scrollIntoView()", toRawButton);
      await toRawButton.click();
  
      const rawTextInput = await driver.wait(
        until.elementLocated(By.xpath("//textarea[@formcontrolname='rawBody']")),
        5 * 1000
      );
      await rawTextInput.clear();
      await rawTextInput.sendKeys('{"rawValue": 1}');
      const identifierValue = await identifierInput.getAttribute("value");
      expect(identifierValue).to.equal(`${actionName.toLowerCase()}_${operationKey}`);
      
      //create button should not be disabled
      // const createButtonStatus = await createButton.getAttribute("disabled");
      // console.log("createButtonStatus", createButtonStatus)
      //expect(createButtonStatus).toBe(null);
      
      await createButton.click();
      return actionName;
    },

    fillCreateFormWithBodyAndOauth2: async (driver) => {
      const identifierInput = await driver.wait(until.elementLocated(
          By.xpath("//input[@formcontrolname='identifier']")),
          5 * 1000,
          "there isn't identifier input",
          2 * 100
      );
    
      const nameInput = await driver.findElement(
          By.xpath("//input[@formcontrolname='name']")
      );
    
      const systemSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='system_id']")
      );
  
      const operationInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='operation']")
      );
  
      const descriptionTextInput = await driver.findElement(
        By.xpath("//textarea[@formcontrolname='description']")
      );
  
      const urlInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='url']")
      );
  
      const methodSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='method']")
      );
  
      const securityTypeSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='securityType']")
      );
  
      const actionName = rs.generate({
        length: 8,
        charset: "alphabetic",
      });
  
      const formButtons = await driver.findElements(By.css("form button"));
  
      const createButton = formButtons[2];
  
      await nameInput.sendKeys(actionName);
  
      await descriptionTextInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );
    
      await driver.executeScript("arguments[0].click();", systemSelect);    
      const systemOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
  
      await systemOptions[0].click();
  
      await driver.wait(until.stalenessOf(systemOptions[0]));
  
      const operationKey = "new"
      await operationInput.sendKeys(operationKey)
  
      await urlInput.sendKeys("/url");
  
      await methodSelect.click();
  
      const methodOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
  
      await methodOptions[1].click();
  
      await driver.wait(until.stalenessOf(methodOptions[0]));
      await securityTypeSelect.click();
      const securityTypeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
      
      await securityTypeOptions[FrontendConstants.securityTypeOptionsIndexOfCustomSecurity].click();
  
      //await driver.wait(until.stalenessOf(securityTypeOptions[0]));
  
      const tokenUrlInput = await driver.wait(
        until.elementLocated(By.xpath("//input[@formcontrolname='securityUrl']")),
        5 * 1000
      );
  
      const clientIdInput = await driver.wait(
        until.elementLocated(By.xpath("//input[@formcontrolname='clientId']")),
        5 * 1000
      );
  
      const clientSecretInput = await driver.wait(
        until.elementLocated(
          By.xpath("//input[@formcontrolname='clientSecret']")
        ),
        5 * 1000
      );
  
      expect(tokenUrlInput).to.be.exist;
      expect(clientIdInput).to.be.exist;
      expect(clientSecretInput).to.be.exist;
  
      await tokenUrlInput.sendKeys("/token");
  
      await clientIdInput.sendKeys("clientId");
  
      await clientSecretInput.sendKeys("secret");
  
      const toRawButton = await driver.wait(
        until.elementLocated(By.css("mat-radio-button:nth-child(2)"))
      );
  
      await driver.executeScript("arguments[0].scrollIntoView()", toRawButton);
      await toRawButton.click();
  
      const rawTextInput = await driver.wait(
        until.elementLocated(By.xpath("//textarea[@formcontrolname='rawBody']")),
        5 * 1000
      );
      await rawTextInput.clear();
      await rawTextInput.sendKeys('{"rawValue": 1}');
      const identifierValue = await identifierInput.getAttribute("value");
      expect(identifierValue).to.equal(`${actionName.toLowerCase()}_${operationKey}`);
      
      //create button should not be disabled
      const createButtonStatus = await createButton.getAttribute("disabled");
      console.log("createButtonStatus", createButtonStatus)
      //expect(createButtonStatus).toBe(null);
      
      await createButton.click();
      return actionName;
    },    
    /**
     * 
     * @param {Driver} driver 
     */
    createActionWithRawFunctionBody: async (driver) => {
      const identifierInput = await driver.wait(until.elementLocated(
        By.xpath("//input[@formcontrolname='identifier']")),
        5 * 1000,
        "there isn't identifier input",
        2 * 100
      );
    
      const nameInput = await driver.findElement(
          By.xpath("//input[@formcontrolname='name']")
      );
    
      const systemSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='system_id']")
      );

      const operationInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='operation']")
      );

      const descriptionTextInput = await driver.findElement(
        By.xpath("//textarea[@formcontrolname='description']")
      );

      const urlInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='url']")
      );

      const methodSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='method']")
      );

      const securityTypeSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='securityType']")
      );

      const actionName = rs.generate({
        length: 8,
        charset: "alphabetic",
      });

      const formButtons = await driver.findElements(By.css("form button"));
  
      const createButton = formButtons[2];
  
      await nameInput.sendKeys(actionName);
  
      await descriptionTextInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );
    
      await driver.executeScript("arguments[0].click();", systemSelect);    
      const systemOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
      await systemOptions[0].click();

      await driver.wait(until.stalenessOf(systemOptions[0]));
  
      const operationKey = "new"
      await operationInput.sendKeys(operationKey)
  
      await urlInput.sendKeys("/url");
  
      await methodSelect.click();
  
      const methodOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
  
      await methodOptions[1].click();
  
      await driver.wait(until.stalenessOf(methodOptions[0]));
      await securityTypeSelect.click();
      const securityTypeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );
      await securityTypeOptions[0].click();

      const radioButtonCode = await driver.findElement(By.id('mat-radio-4-input'));
      await driver.executeScript("arguments[0].click();", radioButtonCode);
      const textAreaRawFunctionBody = await driver.findElement(By.id('action-raw-function-body'));
      await textAreaRawFunctionBody.sendKeys('return a*b');
      await driver.executeScript("arguments[0].click();", createButton);
      return actionName;
    }

}

module.exports = createActionHelpers;
const { By, Key, until } = require("selenium-webdriver");
const rs = require("randomstring");

const seoHelpers = {
  createContract: async (driver) => {
    try {
      await seoHelpers.artificialWait();

      const nameInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='name']")
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

      const createButton = await driver.findElement(By.css("form button"));

      const identifierDisabled =
        (await createButton.getAttribute("disabled")) === "true" ? true : false;

      const isCreateButtonDisabled =
        (await createButton.getAttribute("disabled")) === "true" ? true : false;

      expect(identifierDisabled).toBe(true);

      expect(isCreateButtonDisabled).toBe(true);

      const contractName = rs.generate({
        length: 8,
        charset: "alphabetic",
      });

      await nameInput.sendKeys(contractName);

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

      await seoHelpers.artificialWait(300);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  createSimpleAction: async (driver) => {
    try {
      await seoHelpers.artificialWait();

      const nameInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='name']")
      );

      const systemSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='system_id']")
      );

      const operationSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='operation']")
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

      await systemSelect.click();

      const systemOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await systemOptions[0].click();

      await driver.wait(until.stalenessOf(systemOptions[0]));

      await operationSelect.click();

      const operationOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await operationOptions[0].click();

      await driver.wait(until.stalenessOf(operationOptions[0]));

      await urlInput.sendKeys("/url");

      await methodSelect.click();

      const methodOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await methodOptions[0].click();

      await driver.wait(until.stalenessOf(methodOptions[0]));

      await securityTypeSelect.click();

      const securityTypeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await securityTypeOptions[0].click();

      await driver.wait(until.stalenessOf(securityTypeOptions[0]));

      await createButton.click();

      await seoHelpers.artificialWait(300);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  createEvent: async (driver) => {
    try {
      await seoHelpers.artificialWait();

      const nameInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='name']")
      );

      const systemSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='system_id']")
      );

      const operationSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='operation']")
      );

      const descriptionTextInput = await driver.findElement(
        By.xpath("//textarea[@formcontrolname='description']")
      );

      const createButton = await driver.findElement(By.css("form button"));

      const eventName = rs.generate({
        length: 8,
        charset: "alphabetic",
      });

      await nameInput.sendKeys(eventName);

      await descriptionTextInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );

      await systemSelect.click();

      const systemOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await systemOptions[0].click();

      await driver.wait(until.stalenessOf(systemOptions[0]));

      await operationSelect.click();

      const operationOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await operationOptions[0].click();

      await driver.wait(until.stalenessOf(operationOptions[0]));

      await createButton.click();

      await seoHelpers.artificialWait(300);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  createConsumerSystem: async (driver) => {
    try {
      await seoHelpers.artificialWait();

      const nameInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='name']")
      );

      const typeSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='type']")
      );

      const systemClassSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='systemClass']")
      );

      const descriptionTextInput = await driver.findElement(
        By.xpath("//textarea[@formcontrolname='description']")
      );

      const createButton = await driver.findElement(By.css("form button"));

      const systemName = rs.generate({
        length: 8,
        charset: "alphabetic",
      });

      await nameInput.sendKeys(systemName);

      await descriptionTextInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );

      await typeSelect.click();

      const typeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await typeOptions[0].click();

      await driver.wait(until.stalenessOf(typeOptions[0]));

      await systemClassSelect.click();

      const classOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await classOptions[1].click();

      await driver.wait(until.stalenessOf(classOptions[0]));

      await createButton.click();

      await seoHelpers.artificialWait(100);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  createProducerSystem: async (driver) => {
    try {
      await seoHelpers.artificialWait();
      const nameInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='name']")
      );

      const typeSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='type']")
      );

      const systemClassSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='systemClass']")
      );

      const descriptionTextInput = await driver.findElement(
        By.xpath("//textarea[@formcontrolname='description']")
      );

      const clientIdSelect = await driver.findElement(
        By.xpath("//mat-select[@formcontrolname='clientId']")
      );

      const createButton = await driver.findElement(By.css("form button"));

      const systemName = rs.generate({
        length: 8,
        charset: "alphabetic",
      });

      await nameInput.sendKeys(systemName);

      await descriptionTextInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );

      await typeSelect.click();

      const typeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await typeOptions[0].click();

      await driver.wait(until.stalenessOf(typeOptions[0]));

      await systemClassSelect.click();

      const classOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await classOptions[0].click();

      await driver.wait(until.stalenessOf(classOptions[0]));

      await clientIdSelect.click();

      const clientIdOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await clientIdOptions[0].click();

      await createButton.click();

      await seoHelpers.artificialWait(100);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  getTableRows: async (driver) => {
    try {
      const allRows = await driver.wait(
        until.elementsLocated(By.css("tbody tr")),
        2 * 1000
      );
      return allRows;
    } catch (error) {
      return [];
    }
  },
  createUser: async (driver) => {
    try {
      const userPassword = "passworD1";

      const clientHead = await driver.wait(
        until.elementLocated(By.className("users-head")),
        5 * 1000
      );

      const openDialogButton = await clientHead.findElement(
        By.className("mat-flat-button")
      );

      await openDialogButton.click();

      const dialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const actionsButtons = await dialog.findElements(
        By.css(".mat-dialog-actions button")
      );

      const createButton = actionsButtons[1];

      const nameInput = await dialog.findElement(By.name("name"));

      const descriptionInput = await dialog.findElement(By.name("description"));

      const usernameInput = await dialog.findElement(By.name("username"));

      const passwordInput = (
        await dialog.findElements(By.css("input[name='password']"))
      )[0];

      const resourceSelect = await dialog.findElement(By.name("role"));

      await nameInput.sendKeys(
        rs.generate({
          length: 8,
          charset: "alphabetic",
        })
      );

      await descriptionInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );

      await usernameInput.sendKeys(
        rs.generate({
          length: 8,
          charset: "alphabetic",
        })
      );

      await passwordInput.sendKeys(userPassword);

      await resourceSelect.click();

      const options = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await options[0].click();

      const addButton = await dialog.findElement(By.css(".select-role button"));

      await addButton.click();

      await createButton.click();

      await driver.wait(until.stalenessOf(dialog), 5 * 1000);

      await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:first-child")),
        5 * 1000
      );
    } catch (error) {
      console.log(error);
    }
  },
  artificialWait: (timeToWait = 500) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, timeToWait);
    });
  },
  createClient: async (driver) => {
    try {
      const clientHead = await driver.wait(
        until.elementLocated(By.className("client-head")),
        5 * 1000
      );

      const openDialogButton = await clientHead.findElement(
        By.className("mat-flat-button")
      );

      await openDialogButton.click();

      const dialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const actionsButtons = await dialog.findElements(
        By.css(".mat-dialog-actions button")
      );

      const createButton = actionsButtons[1];

      const nameInput = await dialog.findElement(By.name("name"));

      const descriptionInput = await dialog.findElement(By.name("description"));

      const identifierInput = await dialog.findElement(
        By.css("input[name='identifier']")
      );

      const resourceSelect = await dialog.findElement(By.name("role"));

      await nameInput.sendKeys(
        rs.generate({
          length: 8,
          charset: "alphabetic",
        })
      );

      await descriptionInput.sendKeys(
        rs.generate({
          length: 16,
          charset: "alphabetic",
        })
      );

      await identifierInput.sendKeys(+new Date());

      await resourceSelect.click();

      const options = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await options[0].click();

      const addButton = await dialog.findElement(By.css(".select-role button"));

      await addButton.click();

      await createButton.click();

      await driver.wait(until.stalenessOf(dialog), 5 * 1000);

      const postCreateDialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const okButton = await postCreateDialog.findElement(
        By.css(".mat-dialog-actions button")
      );

      await okButton.click();

      await driver.wait(until.stalenessOf(postCreateDialog), 5 * 1000);

      await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:first-child")),
        5 * 1000
      );
    } catch (error) {
      console.log(error);
    }
  },
  creatRole: async (driver) => {
    try {
      const roleHead = await driver.wait(
        until.elementLocated(By.className("role-head")),
        5 * 1000
      );

      const openDialogButton = await roleHead.findElement(
        By.className("mat-flat-button")
      );

      await openDialogButton.click();

      const dialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const actionsButtons = await dialog.findElements(
        By.css(".mat-dialog-actions button")
      );

      const createButton = actionsButtons[1];

      const identifierInput = await dialog.findElement(By.name("identifier"));

      const resourceSelect = await dialog.findElement(By.name("resource"));

      await identifierInput.sendKeys(
        rs.generate({
          length: 8,
          charset: "alphabetic",
        })
      );

      await resourceSelect.click();

      const options = await driver.wait(
        until.elementsLocated(By.css(".mat-option"))
      );

      await options[1].click();

      const listItems = await dialog.findElements(By.css("mat-list-option"));

      await listItems[0].click();

      await createButton.click();

      await driver.wait(until.stalenessOf(dialog), 5 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  createResource: async (driver) => {
    try {
      const roleHead = await driver.wait(
        until.elementLocated(By.className("role-head")),
        5 * 1000
      );

      const openDialogButton = await roleHead.findElement(
        By.className("mat-flat-button")
      );

      await openDialogButton.click();

      const dialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const actionButtons = await dialog.findElements(By.css("button"));

      const createButton = actionButtons[1];

      const resourceIdentifierInput = await dialog.findElement(
        By.name("resourceIdentifier")
      );

      const applicationSelect = await dialog.findElement(
        By.name("application")
      );

      applicationSelect.click();

      const option = await driver.wait(
        until.elementLocated(By.xpath("//mat-option[@tabindex='0']")),
        5 * 1000
      );

      await option.click();

      await resourceIdentifierInput.sendKeys(
        rs.generate({
          length: 8,
          charset: "alphabetic",
        })
      );

      await createButton.click();

      await driver.wait(until.stalenessOf(dialog), 6 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  enterIntoEventhos: async (driver, webUrl, password) => {
    try {
      await driver.get(webUrl);
      await driver.wait(until.urlIs(webUrl + "/login"), 5 * 1000);
      const usernameInput = await driver.findElement(By.name("username"));
      await usernameInput.sendKeys("admin");
      const passwordInput = await driver.findElement(By.name("password"));
      await passwordInput.sendKeys(password);
      const submitButton = await driver.findElement(By.className("login-btn"));
      submitButton.click();
      const result = await driver.wait(
        until.urlIs(webUrl + "/dashboard"),
        5 * 1000
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  getSearchPosition: async (driver, findStringDreams, urlColoringDreams) => {
    try {
      const searchBox = driver.findElement(By.name("q"));
      await searchBox.sendKeys(findStringDreams, Key.RETURN);
      const searchList = await driver.wait(
        until.elementLocated(By.id("rso")),
        5 * 1000
      );
      const linksContainers = await searchList.findElements(By.className("g"));
      const links = [];
      for (const linkContainer of linksContainers) {
        const aLink = await linkContainer.findElement(By.css("a"));
        const href = await aLink.getAttribute("href");
        links.push({ aLink, href });
      }
      const linkIndex = links.findIndex(
        (link) => link.href === urlColoringDreams
      );
      return linkIndex;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = seoHelpers;

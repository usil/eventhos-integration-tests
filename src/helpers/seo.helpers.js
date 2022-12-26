const { By, Key, until } = require("selenium-webdriver");
const rs = require("randomstring");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

const seoHelpers = {
  createContract: async (driver, order = 0) => {
    try {
      await seoHelpers.artificialWait();

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

      await orderInput.sendKeys(order);

      await producerSelect.click();

      const producerOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        3 * 1000
      );

      await producerOptions[0].click();

      await driver.wait(until.stalenessOf(producerOptions[0]), 5 * 1000);

      await eventSelect.click();

      const eventOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        3 * 1000
      );

      await eventOptions[0].click();

      await driver.wait(until.stalenessOf(eventOptions[0]), 5 * 1000);

      await consumerSelect.click();

      const consumerOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await consumerOptions[0].click();

      await driver.wait(until.stalenessOf(consumerOptions[0]), 5 * 1000);

      await actionSelect.click();

      const actionOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        3 * 1000
      );

      await actionOptions[0].click();

      await driver.wait(until.stalenessOf(actionOptions[0]), 5 * 1000);

      await createButton.click();

      await seoHelpers.artificialWait(300);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 5 * 1000);

      return true;
    } catch (error) {
      console.log(error);
      return false;
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await systemOptions[0].click();

      await driver.wait(until.stalenessOf(systemOptions[0]), 5 * 1000);

      await operationSelect.click();

      const operationOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await operationOptions[0].click();

      await driver.wait(until.stalenessOf(operationOptions[0]), 5 * 1000);

      await urlInput.sendKeys("/url");

      await methodSelect.click();

      const methodOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await methodOptions[0].click();

      await driver.wait(until.stalenessOf(methodOptions[0]), 5 * 1000);

      await securityTypeSelect.click();

      const securityTypeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await securityTypeOptions[0].click();

      await driver.wait(until.stalenessOf(securityTypeOptions[0]), 5 * 1000);

      await createButton.click();

      await seoHelpers.artificialWait(300);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 5 * 1000);
    } catch (error) {
      console.log(error);
    }
  },
  createAction: async (
    driver,
    baseUrl = "/url",
    method = 0,
    headers = [],
    queryUrlParams = [],
    rawBody = null,
    oauth2Credentials = null
  ) => {
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await systemOptions[0].click();

      await driver.wait(until.stalenessOf(systemOptions[0]), 5 * 1000);

      await operationSelect.click();

      const operationOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await operationOptions[0].click();

      await driver.wait(until.stalenessOf(operationOptions[0]), 5 * 1000);

      await urlInput.sendKeys(baseUrl);

      await methodSelect.click();

      const methodOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await methodOptions[method].click();

      await driver.wait(until.stalenessOf(methodOptions[method]), 5 * 1000);

      await securityTypeSelect.click();

      const securityTypeOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      if (oauth2Credentials !== null) {
        await securityTypeOptions[1].click();

        await driver.wait(until.stalenessOf(securityTypeOptions[1]), 5 * 1000);

        const tokenUrlInput = await driver.wait(
          until.elementLocated(
            By.xpath("//input[@formcontrolname='securityUrl']")
          ),
          5 * 1000
        );

        const clientIdInput = await driver.wait(
          until.elementLocated(
            By.xpath("//input[@formcontrolname='clientId']")
          ),
          5 * 1000
        );

        const clientSecretInput = await driver.wait(
          until.elementLocated(
            By.xpath("//input[@formcontrolname='clientSecret']")
          ),
          5 * 1000
        );

        await tokenUrlInput.sendKeys(oauth2Credentials.url);

        await clientIdInput.sendKeys(oauth2Credentials.id);

        await clientSecretInput.sendKeys(oauth2Credentials.secret);
      } else {
        await securityTypeOptions[0].click();
        await driver.wait(until.stalenessOf(securityTypeOptions[0]));
      }

      if (headers.length > 0) {
        const addHeaderButton = formButtons[0];

        for (const header of headers) {
          await addHeaderButton.click();

          const headerForm = await driver.wait(
            until.elementLocated(
              By.css(
                "div[formarrayname='headers'] > .ng-star-inserted:last-child"
              )
            ),
            5 * 1000
          );

          const headerKey = await headerForm.findElement(
            By.css("input[formcontrolname='key']")
          );

          const headerValue = await headerForm.findElement(
            By.css("input[formcontrolname='value']")
          );

          await headerKey.sendKeys(header.key);

          await headerValue.sendKeys(header.value);
        }
      }
      if (queryUrlParams.length > 0) {
        const addQueryUrlParams = formButtons[1];
        //ElementClickInterceptedError: 
        //element click intercepted: Element is not clickable at point (786, 625)
        //Fix: perform a scroll until the element
        await driver.executeScript("arguments[0].scrollIntoView()", addQueryUrlParams);
        
        for (const query of queryUrlParams) {
          await addQueryUrlParams.click();

          const queryForm = await driver.wait(
            until.elementLocated(
              By.css(
                "div[formarrayname='queryUrlParams'] > .ng-star-inserted:last-child"
              )
            ),
            5 * 1000
          );

          const queryKey = await queryForm.findElement(
            By.css("input[formcontrolname='key']")
          );

          const queryValue = await queryForm.findElement(
            By.css("input[formcontrolname='value']")
          );

          await queryKey.sendKeys(query.key);

          await queryValue.sendKeys(query.value);
        }
      }

      if (rawBody !== null && method === 1) {
        const toRawButton = await driver.wait(
          until.elementLocated(By.css("mat-radio-button:last-child")),
          5 * 1000
        );

        await toRawButton.click();

        const rawTextInput = await driver.wait(
          until.elementLocated(
            By.xpath("//textarea[@formcontrolname='rawBody']")
          ),
          5 * 1000
        );

        await rawTextInput.clear();

        await rawTextInput.sendKeys(JSON.stringify(rawBody));
      }

      await createButton.click();

      await seoHelpers.artificialWait(300);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);

      const idTh = await driver.wait(
        until.elementLocated(By.css("tr th:first-child")),
        5 * 1000
      );

      await idTh.click();

      await seoHelpers.artificialWait();

      const firstRowFirstColumn = await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:first-child")),
        2 * 1000
      );

      return await firstRowFirstColumn.getAttribute("innerHTML");
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  createEvent: async (driver) => {
    try {
      await seoHelpers.artificialWait();

      const identifierInput = await driver.findElement(
        By.xpath("//input[@formcontrolname='identifier']")
      );

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

      const tableSectionElement = await driver.findElement(
        By.xpath("//section[@class='show-table']")
      );

      const searchEventByNameTextInput = await tableSectionElement.findElement(
        By.css("input[formcontrolname*='name']")
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await systemOptions[0].click();

      await driver.wait(until.stalenessOf(systemOptions[0]), 5 * 1000);

      await operationSelect.click();

      const operationOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await operationOptions[0].click();

      await driver.wait(until.stalenessOf(operationOptions[0]), 5 * 1000);

      await createButton.click();

      await seoHelpers.artificialWait(300);
      
      await searchEventByNameTextInput.sendKeys(eventName.toLowerCase());

      //#TODO: wait until the search
      //I tried this https://stackoverflow.com/a/47653460/3957754
      //with no luck. So ...
      await seoHelpers.artificialWait(2*1000);

      const eventIdentifierCol = await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:nth-child(2)"))
      );

      return await eventIdentifierCol.getAttribute("innerHTML");
    } catch (error) {
      console.log(error);
      return null;
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await typeOptions[0].click();

      await driver.wait(until.stalenessOf(typeOptions[0]), 5 * 1000);

      await systemClassSelect.click();

      const classOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await classOptions[1].click();

      await driver.wait(until.stalenessOf(classOptions[0]), 5 * 1000);

      await createButton.click();

      await seoHelpers.artificialWait(100);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);

      return true;
    } catch (error) {
      console.log(error);
      return false;
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await typeOptions[0].click();

      await driver.wait(until.stalenessOf(typeOptions[0]), 5 * 1000);

      await systemClassSelect.click();

      const classOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await classOptions[0].click();

      await driver.wait(until.stalenessOf(classOptions[0]), 5 * 1000);

      await clientIdSelect.click();

      const clientIdOptions = await driver.wait(
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await clientIdOptions[0].click();

      await createButton.click();

      await seoHelpers.artificialWait(100);

      await driver.wait(until.elementsLocated(By.css("tbody tr")), 2 * 1000);

      return systemName;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  getTableRows: async (driver) => {
    try {
      return await driver.wait(
        until.elementsLocated(By.css("tbody tr")),
        2 * 1000
      );
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
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
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(true);
      }, timeToWait);
    });
  },
  createClient: async (driver, withAccessToken = true) => {
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
      );

      await options[0].click();

      const addButton = await dialog.findElement(By.css(".select-role button"));

      await addButton.click();

      if (withAccessToken) {
        const checkbox = await dialog.findElement(By.css("mat-checkbox"));
        await checkbox.click();
      }

      await createButton.click();

      await driver.wait(until.stalenessOf(dialog), 5 * 1000);

      const postCreateDialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const postCreateInputs = await postCreateDialog.findElements(
        By.css("input")
      );

      const clientId = await postCreateInputs[0].getAttribute("value");
      const clientSecret = await postCreateInputs[1].getAttribute("value");

      let accessToken;

      if (withAccessToken) {
        accessToken = await postCreateInputs[2].getAttribute("value");
      }

      const okButton = await postCreateDialog.findElement(
        By.css("div[align='end'] button")
      );

      await okButton.click();

      await driver.wait(until.stalenessOf(postCreateDialog), 5 * 1000);

      await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:first-child")),
        5 * 1000
      );

      return { clientId, clientSecret, accessToken };
    } catch (error) {
      console.log(error);
      return {};
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
        until.elementsLocated(By.css(".mat-option")),
        5 * 1000
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
      return await driver.wait(
        until.urlIs(webUrl + "/dashboard/profile"),
        5 * 1000
      );
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
      return links.findIndex((link) => link.href === urlColoringDreams);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = seoHelpers;

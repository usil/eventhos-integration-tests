const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { until } = require("selenium-webdriver");
const createActionHelpers = require("./createActionHelpers");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Creates an action (026)", () => {
  let driver;
  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createConsumerSystem(driver);

    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);
  });

  it("Create action, no body and custom auth", async () => {
    // let allOriginalRows = await seoHelpers.getTableRows(driver);

    /* const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);

    await driver.executeScript("arguments[0].click();", idTh); */

    /* if (allOriginalRows.length !== 0) {
      await driver.wait(until.stalenessOf(allOriginalRows[0]));

      allOriginalRows = await driver.wait(
        until.elementsLocated(By.css("tbody tr")),
        2 * 1000
      );
    } */

    /* const identifierInput = await driver.findElement(
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

    expect(createButtonDisabled).toBe(true);

    await nameInput.sendKeys(actionName);

    await descriptionTextInput.sendKeys(
      rs.generate({
        length: 16,
        charset: "alphabetic",
      })
    );

    // await systemSelect.click();
    await driver.executeScript("arguments[0].click();", systemSelect); */

    /* const systemOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await driver.executeScript("arguments[0].click();", systemOptions[0]);

    await driver.wait(until.stalenessOf(systemOptions[0]));


    await driver.executeScript("arguments[0].click();", operationSelect);

    const operationOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    // await operationOptions[0].click();

    await driver.executeScript("arguments[0].click();", operationOptions[0]);

    await driver.wait(until.stalenessOf(operationOptions[0]));

    await urlInput.sendKeys("/url");

    // await methodSelect.click();
    await driver.executeScript("arguments[0].click();", methodSelect);

    const methodOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    // await methodOptions[0].click();

    await driver.executeScript("arguments[0].click();", methodOptions[0]);

    await driver.wait(until.stalenessOf(methodOptions[0]));

    // await securityTypeSelect.click();

    await driver.executeScript("arguments[0].click();", securityTypeSelect);

    const securityTypeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    // await securityTypeOptions[0].click();
    await driver.executeScript("arguments[0].click();", securityTypeOptions[0]);

    await driver.wait(until.stalenessOf(securityTypeOptions[0]));

    const addHeaderButton = formButtons[0];

    const addQueryUrlParams = formButtons[1];

    // await addHeaderButton.click();

    await driver.executeScript("arguments[0].click();", addHeaderButton);
 */

    // await addHeaderButton.click();

    /* const headerForms = await driver.wait(
      until.elementsLocated(
        By.css("div[formarrayname='headers'] > .ng-star-inserted")
      )
    );

    expect(headerForms.length).toBe(2);

    const headerKey = await headerForms[0].findElement(
      By.css("input[formcontrolname='key']")
    );

    const headerValue = await headerForms[0].findElement(
      By.css("input[formcontrolname='value']")
    );

    const removeHeader = await headerForms[1].findElement(By.css("button"));

    // await removeHeader.click();

    await driver.executeScript("arguments[0].click();", removeHeader);

    const removedHeader = await driver.wait(until.stalenessOf(headerForms[1]));

    expect(removedHeader).toBe(true);

    await headerKey.sendKeys("seleniumTestKey");

    await headerValue.sendKeys("seleniumTestValue");

    await driver.executeScript(
      "arguments[0].scrollIntoView()",
      addQueryUrlParams
    );
    // await addQueryUrlParams.click();

    // await addQueryUrlParams.click();

    await driver.executeScript("arguments[0].click();", addQueryUrlParams);

    await driver.executeScript("arguments[0].click();", addQueryUrlParams);

    const queryForms = await driver.wait(
      until.elementsLocated(
        By.css("div[formarrayname='queryUrlParams'] > .ng-star-inserted")
      )
    );

    expect(queryForms.length).toBe(2);

    const queryKey = await queryForms[0].findElement(
      By.css("input[formcontrolname='key']")
    );

    const queryValue = await queryForms[0].findElement(
      By.css("input[formcontrolname='value']")
    );

    const removeQuery = await queryForms[1].findElement(By.css("button"));

    // await removeQuery.click();

    await driver.executeScript("arguments[0].click();", removeQuery);

    const queryRemoved = await driver.wait(until.stalenessOf(queryForms[1]));

    expect(queryRemoved).toBe(true);

    await queryKey.sendKeys("seleniumTestKey");

    await queryValue.sendKeys("seleniumTestValue");

    const identifierValue = await identifierInput.getAttribute("value");

    expect(identifierValue).toBe(`${actionName.toLowerCase()}_select`);

    // await createButton.click();

    await driver.executeScript("arguments[0].click();", createButton);
 */
  const actionName = await createActionHelpers.fillCreateForm(driver);
  await createActionHelpers.verifyIfExistActionByName(driver, actionName)

    /* if (allOriginalRows.length !== 0) {
      await driver.wait(until.stalenessOf(allOriginalRows[0]));
    }

    const rows = await driver.wait(
      until.elementsLocated(By.css("tbody tr")),
      2 * 1000
    );

    const rowColumns = await rows[0].findElements(By.css("td"));

    const nameColumn = await rowColumns[1];

    const nameOfCreated = await nameColumn.getAttribute("innerHTML");

    expect(nameOfCreated).toBe(actionName); */
  });

  it("Create action, with body and custom auth", async () => {
    driver.navigate().refresh();

    /* let allOriginalRows = await seoHelpers.getTableRows(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
    await idTh.click();

    if (allOriginalRows.length !== 0) {
      await driver.wait(until.stalenessOf(allOriginalRows[0]));

      allOriginalRows = await driver.wait(
        until.elementsLocated(By.css("tbody tr")),
        2 * 1000
      );
    } */

    /* const identifierInput = await driver.findElement(
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

    const urlInput = await driver.findElement(
      By.xpath("//input[@formcontrolname='url']")
    );

    const methodSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='method']")
    );

    const securityTypeSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='securityType']")
    );

    const eventName = rs.generate({
      length: 8,
      charset: "alphabetic",
    });

    const formButtons = await driver.findElements(By.css("form button"));

    const createButton = formButtons[2];

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

    await securityTypeOptions[1].click();

    await driver.wait(until.stalenessOf(securityTypeOptions[0]));

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

    expect(tokenUrlInput).toBeTruthy();
    expect(clientIdInput).toBeTruthy();
    expect(clientSecretInput).toBeTruthy();

    await tokenUrlInput.sendKeys("/token");

    await clientIdInput.sendKeys("clientId");

    await clientSecretInput.sendKeys("secret");

    const toRawButton = await driver.wait(
      until.elementLocated(By.css("mat-radio-button:last-child"))
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

    expect(identifierValue).toBe(`${eventName.toLowerCase()}_select`);

    await createButton.click(); */

    /* if (allOriginalRows.length !== 0) {
      await driver.wait(until.stalenessOf(allOriginalRows[0]), 5 * 1000);
    }

    const rows = await driver.wait(
      until.elementsLocated(By.css("tbody tr")),
      2 * 1000
    );

    const rowColumns = await rows[0].findElements(By.css("td"));

    const nameColumn = await rowColumns[1];

    const nameOfCreated = await nameColumn.getAttribute("innerHTML");

    expect(nameOfCreated).toBe(eventName); */

    const actionName = await createActionHelpers.fillCreateFormWithBodyAndCustomAuth(driver);
    await createActionHelpers.verifyIfExistActionByName(driver, actionName)
  });

  afterAll(async () => {
    await driver.quit();
  });
});

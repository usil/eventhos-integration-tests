const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");
const createContractHelpers = require("./createContractHelpers");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Creates a new contract (029)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );

    await seoHelpers.createClient(driver);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createProducerSystem(driver);

    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    await seoHelpers.createEvent(driver);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createConsumerSystem(driver);

    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    await seoHelpers.createSimpleAction(driver);

    await driver.get(webUrl + "/dashboard/contract");
    await driver.wait(until.urlIs(webUrl + "/dashboard/contract"), 5 * 1000);
  });

  it("Create a contract works", async () => {
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

    /* await driver.findElement(
      By.xpath("//input[@formcontrolname='identifier']")
    );

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

    expect(eventIsDisabled).toBe(true);

    expect(actionIsDisabled).toBe(true);

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

    await createButton.click(); */

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

    expect(nameOfCreated).toBe(contractName); */

    const contractName = await createContractHelpers.createContract(driver);
    await createContractHelpers.verifyIfContractExistByName(driver, contractName);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
